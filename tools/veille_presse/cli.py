"""Entrypoint for the veille-presse-visuelle skill.

Subcommands:
  run                       Full weekly cycle (cron-invoked or manual)
  build-storage-state SLUG  Open Playwright for manual login, save storage
  discover-only             Phase 1 dry-run (no captures, no commit)
"""
import argparse
import asyncio
import io
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

# Force stdout/stderr to UTF-8 on Windows (default cp1252 chokes on → · etc.)
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace", line_buffering=True)

from tools.veille_presse import (
    sources as srcmod,
    crawler,
    metadata,
    capture,
    output,
    publish,
)
from tools.veille_presse.paths import (
    REPO, SKILL_DIR, SOURCES_YML, STATE_DIR,
    LAST_CRAWL_JSON, RUN_LOG_JSONL, VEILLE_DIR, VEILLE_HUB,
    edition_dir, STORAGE_STATE_DIR,
)


def _slugify(text: str) -> str:
    import re
    text = re.sub(r"[^\w\s-]", "", text.lower())
    return re.sub(r"[-\s]+", "-", text).strip("-")[:40] or "untitled"


def _edition_date_for_today() -> str:
    """Return the most recent Sunday in ISO format (YYYY-MM-DD)."""
    today = datetime.now(timezone.utc)
    days_back = (today.weekday() + 1) % 7  # Monday=0, Sunday=6 -> need offset to Sunday
    sunday = today - timedelta(days=days_back)
    return sunday.strftime("%Y-%m-%d")


def cmd_run(args: argparse.Namespace) -> int:
    """Full weekly cycle."""
    date_str = args.date or _edition_date_for_today()
    print(f"[veille] cycle for {date_str}")

    # 0. Refresh gift links (before crawling)
    if not args.skip_gift_links:
        from tools.veille_presse import gift_links as gl
        paywall_slugs = [s["slug"] for s in srcmod.load_sources(SOURCES_YML) if s.get("paywall")]
        print(f"[veille] refreshing gift links for {len(paywall_slugs)} paywall sources...")
        try:
            links = gl.discover_gift_links(paywall_slugs)
            gl.save_cache(STATE_DIR / "gift-links-cache.json", links)
            print(f"[veille] found {len(links)} gift links")
        except Exception as e:
            print(f"[veille] gift link discovery failed (continuing): {e}")

    # 1. Load config + state
    sources = srcmod.load_sources(SOURCES_YML)
    state = srcmod.load_state(LAST_CRAWL_JSON)

    # 2. Crawl all sources (parallel)
    print(f"[veille] crawling {len(sources)} sources...")
    crawl_results = asyncio.run(crawler.crawl_all(sources, state, max_parallel=5))

    # 3. Build shortlist with scoring
    all_items: list[dict] = []
    for slug, items in crawl_results.items():
        source = next(s for s in sources if s["slug"] == slug)
        for it in items:
            it["source_slug"] = slug
            it["source"] = source["name"]
            it["score"] = crawler.score_item(it, source)
            it["selectors"] = source["selectors"]
            it["twitter_handles"] = source.get("twitter_handles", [])
        all_items.extend(items)
    shortlist = crawler.build_shortlist(all_items, cap=15)
    print(f"[veille] shortlist: {len(shortlist)} items (from {len(all_items)} new URLs)")

    # 4. Update last-crawl state (we've "seen" all crawled URLs, not just shortlisted)
    for slug, items in crawl_results.items():
        srcmod.update_state(state, slug, [it["url"] for it in items])
    srcmod.save_state(LAST_CRAWL_JSON, state)

    # 5. Capture phase
    out_dir = edition_dir(date_str)
    images_dir = out_dir / "images"
    images_dir.mkdir(parents=True, exist_ok=True)
    enriched: list[dict] = []
    impossibles: list[dict] = []
    for item in shortlist:
        meta = metadata.extract(item["html"], item["selectors"])
        title = meta["title"] or item["url"].rstrip("/").rsplit("/", 1)[-1]
        slug_title = _slugify(title)
        prefix = f"{item['source_slug']}-{slug_title}"
        tags = metadata.detect_tags(item["html"])
        if item.get("is_interactive") and "scrollytelling" not in tags:
            tags.append("scrollytelling")

        try:
            # Full-page screenshot
            fp = images_dir / f"{prefix}-fullpage.png"
            capture.screenshot_full_page_from_html(item["html"], fp)
            # Section screenshots
            sec_paths = capture.screenshot_sections_from_html(
                item["html"], images_dir, prefix, max_sections=4
            )
            images = [fp.name] + [p.name for p in sec_paths]

            # GIF/MP4 if interactive
            if item.get("is_interactive"):
                gif_out = images_dir / f"{prefix}-interaction.gif"
                result = capture.capture_interaction_gif_from_html(
                    item["html"], gif_out, duration_s=8, fps=10
                )
                if result["format"] == "mp4":
                    images.append(f"{prefix}-interaction.mp4")
                elif result["format"] == "gif":
                    images.append(f"{prefix}-interaction.gif")

            enriched.append({
                "source": item["source"],
                "source_slug": item["source_slug"],
                "title": title,
                "url": item["url"],
                "authors": meta["authors"],
                "twitter_handles": item["twitter_handles"],
                "tags": tags,
                "score": item["score"],
                "images": images,
            })
        except Exception as e:
            print(f"[veille] capture failed for {item['url']}: {e}")
            impossibles.append({
                "source": item["source"],
                "title": title,
                "url": item["url"],
                "authors": meta["authors"],
            })

    print(f"[veille] captured {len(enriched)} items, {len(impossibles)} impossibles")

    # 6. Generate notes.md + index.html
    edition_payload = {
        "date": date_str,
        "title_draft": _generate_title_draft(enriched),
        "items": enriched,
        "captures_impossibles": impossibles,
    }
    notes_md = output.render_notes_md(edition_payload)
    (out_dir / "notes.md").write_text(notes_md, encoding="utf-8")
    edition_html = output.render_edition_html(edition_payload)
    (out_dir / "index.html").write_text(edition_html, encoding="utf-8")

    # 7. Update hub
    hub_editions = _collect_existing_editions()
    hub_editions.append({
        "date": date_str,
        "n_items": len(enriched),
        "n_sources": len({i["source"] for i in enriched}),
        "title": edition_payload["title_draft"],
        "tags": _dominant_tags(enriched),
        "hero_images": [f"{date_str}/images/{i['images'][0]}"
                        for i in sorted(enriched, key=lambda x: -x["score"])[:4]],
    })
    hub_html = output.render_hub_html(hub_editions)
    VEILLE_HUB.write_text(hub_html, encoding="utf-8")

    # 8. og.png for the new edition
    _run_og_card(date_str, edition_payload["title_draft"])

    # 9. Git: branch + commit
    sha = publish.create_edition_commit(
        REPO, date_str, n_items=len(enriched),
        paths_to_add=[f"veille-presse/{date_str}", "veille-presse/index.html"],
    )
    print(f"[veille] commit {sha[:8]} on veille/{date_str}")

    if args.no_push:
        print("[veille] --no-push: stopping before push/PR")
        return 0

    publish.push_branch(REPO, date_str)
    pending = publish.write_pending_mcp_actions(STATE_DIR, date_str, f"veille/{date_str}")
    print(f"[veille] pending MCP actions written to {pending}")
    print("[veille] cycle complete. Claude harness must now execute MCP actions for PR + merge.")

    # 10. Append run-log
    publish.append_run_log(RUN_LOG_JSONL, {
        "date": date_str,
        "n_crawled": sum(len(v) for v in crawl_results.values()),
        "n_shortlisted": len(shortlist),
        "n_captured": len(enriched),
        "n_skipped": len(impossibles),
        "commit_sha": sha,
    })
    return 0


def _generate_title_draft(items: list[dict]) -> str:
    """Naive title from dominant tags. Replace with LLM call in v2 if needed."""
    if not items:
        return "Édition vide"
    tags = _dominant_tags(items)
    if tags:
        return f"Une semaine de {' · '.join(tags[:2])}"
    return "Une semaine de visualisations"


def _dominant_tags(items: list[dict]) -> list[str]:
    from collections import Counter
    counter = Counter(t for it in items for t in it["tags"])
    return [t for t, _ in counter.most_common(4)]


def _collect_existing_editions() -> list[dict]:
    """Scan veille-presse/ for existing YYYY-MM-DD/ subdirs, return summaries."""
    out = []
    if not VEILLE_DIR.exists():
        return out
    for sub in VEILLE_DIR.iterdir():
        if not sub.is_dir() or not _is_iso_date(sub.name):
            continue
        notes = sub / "notes.md"
        if not notes.exists():
            continue
        # Parse very lightly: count items (## headings) and unique sources (# headings)
        text = notes.read_text(encoding="utf-8")
        n_items = text.count("\n## ")
        n_sources = text.count("\n# ") + (1 if text.startswith("# ") else 0)
        # Hero images: first .png of the notes
        import re as _re
        first_images = _re.findall(r"!\[\]\(([^)]+\.(?:png|gif))\)", text)[:4]
        out.append({
            "date": sub.name,
            "n_items": n_items,
            "n_sources": n_sources,
            "title": "",  # not extracted, hub renders from date only
            "tags": [],
            "hero_images": [f"{sub.name}/images/{img}" for img in first_images],
        })
    return out


def _is_iso_date(s: str) -> bool:
    import re as _re
    return bool(_re.fullmatch(r"\d{4}-\d{2}-\d{2}", s))


def _run_og_card(date_str: str, title: str) -> None:
    """Invoke tools/og-card.py to produce veille-presse/YYYY-MM-DD/og.png."""
    import subprocess
    out = edition_dir(date_str) / "og.png"
    subprocess.run([
        sys.executable, str(REPO / "tools" / "og-card.py"),
        "--title", title,
        "--eyebrow", f"Veille presse · semaine du {date_str}",
        "--output", str(out),
        "--kind", "veille",
    ], check=False)


def cmd_refresh_gift_links(args: argparse.Namespace) -> int:
    """Crawl Reddit for gift links across all paywall sources, update cache."""
    from tools.veille_presse import gift_links as gl
    sources = srcmod.load_sources(SOURCES_YML)
    paywall_slugs = [s["slug"] for s in sources if s.get("paywall")]
    print(f"[veille] searching gift links for {len(paywall_slugs)} paywall sources...")
    links = gl.discover_gift_links(paywall_slugs)
    print(f"[veille] found {len(links)} gift links")
    cache_path = STATE_DIR / "gift-links-cache.json"
    gl.save_cache(cache_path, links)
    print(f"[veille] cache saved → {cache_path}")
    if args.verbose:
        for url, gift in links.items():
            print(f"  {url}")
            print(f"    → {gift}")
    return 0


def cmd_build_storage_state(args: argparse.Namespace) -> int:
    """Open Playwright (headed) on a source's login page, save storageState on exit."""
    sources = srcmod.load_sources(SOURCES_YML)
    matches = [s for s in sources if s["slug"] == args.slug]
    if not matches:
        print(f"unknown slug: {args.slug}", file=sys.stderr)
        return 1
    source = matches[0]
    if not source.get("storage_state"):
        print(f"source {args.slug} has no 'storage_state' field. Set one first.", file=sys.stderr)
        return 1

    STORAGE_STATE_DIR.mkdir(parents=True, exist_ok=True)
    storage_path = SKILL_DIR / source["storage_state"]

    asyncio.run(_build_storage_state_async(source, storage_path))
    print(f"[veille] storage_state saved → {storage_path}")
    return 0


async def _build_storage_state_async(source: dict, storage_path: Path) -> None:
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        await page.goto(source["graphics_url"])
        print(f"\n[veille] Browser open. Log in to {source['name']} manually.")
        input("Press ENTER here when logged in to save storageState and quit.")
        await context.storage_state(path=str(storage_path))
        await browser.close()


def cmd_discover_only(args: argparse.Namespace) -> int:
    """Dry-run Phase 1: crawl + shortlist, print summary, no captures, no commit."""
    sources = srcmod.load_sources(SOURCES_YML)
    state = srcmod.load_state(LAST_CRAWL_JSON)
    crawl_results = asyncio.run(crawler.crawl_all(sources, state, max_parallel=5))
    all_items = []
    for slug, items in crawl_results.items():
        source = next(s for s in sources if s["slug"] == slug)
        for it in items:
            it["source_slug"] = slug
            it["source"] = source["name"]
            it["score"] = crawler.score_item(it, source)
        all_items.extend(items)
    shortlist = crawler.build_shortlist(all_items, cap=15)
    print(f"crawled {len(all_items)} new URLs, shortlist {len(shortlist)}:")
    for i, it in enumerate(shortlist, 1):
        print(f"  [{i:2d}] {it['score']:5.1f}  {it['source']:25s}  {it['url']}")
    return 0


def main(argv: list[str] = None) -> int:
    parser = argparse.ArgumentParser(prog="veille-presse")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_run = sub.add_parser("run", help="full weekly cycle")
    p_run.add_argument("--date", help="override edition date (YYYY-MM-DD)")
    p_run.add_argument("--no-push", action="store_true",
                       help="stop before push/PR (commit local only)")
    p_run.add_argument("--skip-gift-links", action="store_true",
                       help="skip the Reddit gift-link refresh at cycle start")
    p_run.set_defaults(func=cmd_run)

    p_gl = sub.add_parser("refresh-gift-links",
                          help="search Reddit for gift links and update cache")
    p_gl.add_argument("--verbose", action="store_true")
    p_gl.set_defaults(func=cmd_refresh_gift_links)

    p_bss = sub.add_parser("build-storage-state",
                           help="rebuild Playwright session for a source")
    p_bss.add_argument("slug")
    p_bss.set_defaults(func=cmd_build_storage_state)

    p_disc = sub.add_parser("discover-only",
                            help="Phase 1 dry-run, no captures, no commit")
    p_disc.set_defaults(func=cmd_discover_only)

    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
