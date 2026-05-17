"""Playwright-driven crawler: landing scrape + per-article fetch + scoring."""
import asyncio
import json
import re
import sys
from pathlib import Path
from typing import Optional
from urllib.parse import urljoin, urldefrag, urlparse

from playwright.async_api import async_playwright, Page, TimeoutError as PWTimeout

# ---------------------------------------------------------------------------
# Paywall bypass — archive chain helpers
# ---------------------------------------------------------------------------

PAYWALL_SENTINELS = (
    "subscribe to continue", "subscribe now", "subscribe to read",
    "create an account to continue", "abonnez-vous", "réservé aux abonnés",
    "this article is for subscribers", "subscriber-only content",
    "to continue reading", "exclusivement réservé",
)


def _looks_paywalled(html: str, min_full_length: int = 30_000) -> bool:
    """Heuristic: short HTML page containing a paywall sentinel = paywall hit."""
    if len(html) >= min_full_length:
        return False  # full-length article, no paywall
    lower = html.lower()
    return any(s in lower for s in PAYWALL_SENTINELS)


def _archive_ph_url(article_url: str) -> str:
    """Build archive.ph URL for the most recent snapshot."""
    return f"https://archive.ph/newest/{article_url}"


def _wayback_api_url(article_url: str) -> str:
    """Build Wayback Machine availability API URL."""
    return f"http://archive.org/wayback/available?url={article_url}"


async def _fetch_via_archive_ph(page, article_url: str) -> Optional[str]:
    """Try archive.ph/newest. Returns snapshot HTML or None."""
    try:
        await page.goto(_archive_ph_url(article_url), timeout=60_000,
                        wait_until="domcontentloaded")
        html = await page.content()
        # archive.ph returns a search/empty page when no snapshot exists
        if "have not found any matches" in html.lower():
            return None
        if "no captures" in html.lower():
            return None
        # If we landed on the search page (URL didn't redirect to a snapshot),
        # the title still contains "archive.ph" → likely no usable snapshot
        title = await page.title()
        if title.strip().lower() in ("archive.today", "archive.ph"):
            return None
        return html
    except PWTimeout:
        return None
    except Exception:
        return None


async def _fetch_via_wayback(page, article_url: str) -> Optional[str]:
    """Try Wayback Machine. Returns snapshot HTML or None."""
    try:
        # 1) Query the availability API
        await page.goto(_wayback_api_url(article_url), timeout=30_000,
                        wait_until="domcontentloaded")
        body = await page.evaluate("document.body.innerText")
        data = json.loads(body)
        closest = data.get("archived_snapshots", {}).get("closest", {})
        if not closest.get("available") or not closest.get("url"):
            return None
        # 2) Fetch the snapshot
        await page.goto(closest["url"], timeout=60_000, wait_until="domcontentloaded")
        return await page.content()
    except PWTimeout:
        return None
    except Exception:
        return None


async def _fetch_article_with_fallback(
    page, article_url: str, source: dict, has_storage_state: bool,
    gift_links_cache: Optional[dict] = None,
) -> Optional[str]:
    """Fetch the article HTML. Fallback chain: gift link → direct → archive.ph → Wayback."""
    from tools.veille_presse import gift_links as gl

    is_paywall = source.get("paywall", False)

    # 1. Gift link lookup (paywall sources only — others don't need it)
    if is_paywall and gift_links_cache:
        gift_url = gl.lookup_gift_url(article_url, gift_links_cache)
        if gift_url:
            try:
                await page.goto(gift_url, timeout=30_000, wait_until="domcontentloaded")
                html = await page.content()
                if not _looks_paywalled(html):
                    return html
            except PWTimeout:
                pass

    # 2. For paywall + no storage, skip direct fetch → archive chain
    if is_paywall and not has_storage_state:
        for fetcher in (_fetch_via_archive_ph, _fetch_via_wayback):
            html = await fetcher(page, article_url)
            if html:
                return html
        return None

    # 3. Direct fetch (with storage_state for paywall sources that have one)
    try:
        await page.goto(article_url, timeout=30_000, wait_until="domcontentloaded")
        html = await page.content()
    except PWTimeout:
        html = None

    # 4. If direct fetch hit paywall, try archive chain
    if is_paywall and (html is None or _looks_paywalled(html)):
        for fetcher in (_fetch_via_archive_ph, _fetch_via_wayback):
            archived = await fetcher(page, article_url)
            if archived:
                return archived
        return html  # fall back to the (partial) paywall page if no archive

    return html


def extract_urls_from_html(html: str, selector: str, base: str) -> list[str]:
    """Parse HTML and extract absolute URLs matching `selector` (href attr).
    Uses Playwright's lightweight DOM parsing via a temporary page in chromium.
    Synchronous wrapper around an async call for ergonomic tests.
    """
    return asyncio.run(_extract_urls_from_html_async(html, selector, base))


async def _extract_urls_from_html_async(html: str, selector: str, base: str) -> list[str]:
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context()
        page = await context.new_page()
        await page.set_content(html)
        hrefs = await page.eval_on_selector_all(
            selector, "els => els.map(e => e.getAttribute('href')).filter(Boolean)"
        )
        await browser.close()
    out = []
    seen = set()
    for h in hrefs:
        abs_url, _ = urldefrag(urljoin(base, h))
        if abs_url not in seen:
            seen.add(abs_url)
            out.append(abs_url)
    return out


def is_interactive(html: str, signals: list[str]) -> bool:
    """Heuristic: any of `signals` substrings present in <script src=...> attrs?"""
    if not signals:
        return False
    pattern = re.compile(r'<script[^>]+src=["\']([^"\']+)["\']', re.IGNORECASE)
    srcs = pattern.findall(html)
    blob = " ".join(srcs).lower()
    return any(sig.lower() in blob for sig in signals)


def score_item(item: dict, source: dict) -> float:
    """score = source.weight × (1 + 0.3 × is_interactive)."""
    base = float(source["weight"])
    bonus = 0.3 if item.get("is_interactive") else 0.0
    return base * (1.0 + bonus)


def build_shortlist(items: list[dict], cap: int = 15, max_per_source: int = 3) -> list[dict]:
    """Sort by score desc, cap total to `cap`, with a per-source diversity cap.

    The per-source cap prevents a single prolific source (e.g. ProPublica) from
    flooding the shortlist. Items beyond the per-source limit are dropped.
    """
    by_score = sorted(items, key=lambda i: i.get("score", 0), reverse=True)
    out: list[dict] = []
    counts: dict[str, int] = {}
    for it in by_score:
        if len(out) >= cap:
            break
        src = it.get("source") or it.get("source_slug") or "?"
        if counts.get(src, 0) >= max_per_source:
            continue
        out.append(it)
        counts[src] = counts.get(src, 0) + 1
    return out


def _gift_urls_for_source(source: dict, gift_links_cache: Optional[dict]) -> list[str]:
    """Return canonical article URLs from the gift-links cache matching this source's domain."""
    if not gift_links_cache:
        return []
    # Match by domain. sources.yml graphics_url tells us the canonical host.
    host = urlparse(source["graphics_url"]).netloc.replace("www.", "")
    out = []
    for canonical_url, entry in gift_links_cache.items():
        if not isinstance(entry, dict):
            continue
        if entry.get("expires_at", 0) < int(__import__("time").time()):
            continue
        if host in canonical_url:
            out.append(canonical_url)
    return out


async def crawl_source(source: dict, state: dict, storage_state_path: Optional[Path] = None,
                       gift_links_cache: Optional[dict] = None) -> list[dict]:
    """Crawl one source's landing page (+ gift-link cache for paywalled sources).

    Returns list of {url, is_interactive, html} for NEW items only.
    Caller is responsible for state.update_state() and metadata extraction.
    """
    from tools.veille_presse.sources import diff_new_urls

    items: list[dict] = []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx_args = {}
        if storage_state_path and storage_state_path.exists():
            ctx_args["storage_state"] = str(storage_state_path)
        context = await browser.new_context(**ctx_args)
        page = await context.new_page()

        # 1. Landing crawl (may yield 0 URLs for paywalled sources whose landing is blocked)
        landing_urls: list[str] = []
        try:
            await page.goto(source["graphics_url"], timeout=30_000, wait_until="domcontentloaded")
            landing_urls = await _extract_urls_from_landing(page, source)
        except PWTimeout:
            pass

        # 2. Gift link injection for paywalled sources
        if source.get("paywall"):
            gift_urls = _gift_urls_for_source(source, gift_links_cache)
            # Merge: gift URLs first (most likely to actually unlock), dedup
            seen = set(landing_urls)
            combined: list[str] = list(landing_urls)
            for u in gift_urls:
                if u not in seen:
                    combined.append(u)
                    seen.add(u)
            all_urls = combined
        else:
            all_urls = landing_urls

        new_urls = diff_new_urls(state, source["slug"], all_urls)

        has_storage = storage_state_path is not None and storage_state_path.exists()
        for url in new_urls:
            html = await _fetch_article_with_fallback(page, url, source, has_storage,
                                                      gift_links_cache=gift_links_cache)
            if html is None:
                continue
            interactive = is_interactive(html, source.get("interactivity_signals", []))
            items.append({"url": url, "html": html, "is_interactive": interactive})

        await browser.close()
    return items


async def _extract_urls_from_landing(page: Page, source: dict) -> list[str]:
    """Extract URLs using source.selectors.item, return absolute deduplicated list."""
    hrefs = await page.eval_on_selector_all(
        source["selectors"]["item"],
        "els => els.map(e => e.getAttribute('href')).filter(Boolean)",
    )
    base = source["graphics_url"]
    out, seen = [], set()
    for h in hrefs:
        abs_url, _ = urldefrag(urljoin(base, h))
        if abs_url not in seen:
            seen.add(abs_url)
            out.append(abs_url)
    return out


async def crawl_all(sources: list[dict], state: dict, max_parallel: int = 5) -> dict[str, list[dict]]:
    """Crawl all sources in parallel batches. Returns {slug: [items]}."""
    from tools.veille_presse import gift_links as gl
    from tools.veille_presse.paths import STATE_DIR
    gift_cache = gl.load_cache(STATE_DIR / "gift-links-cache.json")

    sem = asyncio.Semaphore(max_parallel)

    async def _one(s):
        async with sem:
            storage = None
            if s.get("storage_state"):
                from tools.veille_presse.paths import SKILL_DIR
                storage = SKILL_DIR / s["storage_state"]
            return s["slug"], await crawl_source(s, state, storage, gift_cache)

    results = await asyncio.gather(*[_one(s) for s in sources], return_exceptions=True)
    out = {}
    for r in results:
        if isinstance(r, Exception):
            print(f"[crawler] source crawl failed: {r!r}", file=sys.stderr)
            continue
        slug, items = r
        out[slug] = items
    return out
