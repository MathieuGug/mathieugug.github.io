"""Playwright-driven crawler: landing scrape + per-article fetch + scoring."""
import asyncio
import json
import re
import sys
from pathlib import Path
from typing import Optional
from urllib.parse import urljoin, urldefrag

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
    page, article_url: str, source: dict, has_storage_state: bool
) -> Optional[str]:
    """Fetch the article HTML. Use archive fallback chain for paywalled sources."""
    is_paywall = source.get("paywall", False)

    # For paywall sources without a valid storage_state, skip direct fetch
    # and go straight to the archive chain (it'll be blocked anyway).
    if is_paywall and not has_storage_state:
        for fetcher in (_fetch_via_archive_ph, _fetch_via_wayback):
            html = await fetcher(page, article_url)
            if html:
                return html
        return None

    # Try direct fetch
    try:
        await page.goto(article_url, timeout=30_000, wait_until="domcontentloaded")
        html = await page.content()
    except PWTimeout:
        html = None

    # If direct fetch landed on a paywall, try archive chain
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


def build_shortlist(items: list[dict], cap: int = 15) -> list[dict]:
    """Sort items by 'score' descending, cap to N."""
    return sorted(items, key=lambda i: i.get("score", 0), reverse=True)[:cap]


async def crawl_source(source: dict, state: dict, storage_state_path: Optional[Path] = None) -> list[dict]:
    """Crawl one source's landing page, return list of {url, is_interactive, html} for NEW items only.

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

        try:
            await page.goto(source["graphics_url"], timeout=30_000, wait_until="domcontentloaded")
        except PWTimeout:
            await browser.close()
            return []

        urls = await _extract_urls_from_landing(page, source)
        new_urls = diff_new_urls(state, source["slug"], urls)

        has_storage = storage_state_path is not None and storage_state_path.exists()
        for url in new_urls:
            html = await _fetch_article_with_fallback(page, url, source, has_storage)
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
    sem = asyncio.Semaphore(max_parallel)

    async def _one(s):
        async with sem:
            storage = None
            if s.get("storage_state"):
                from tools.veille_presse.paths import SKILL_DIR
                storage = SKILL_DIR / s["storage_state"]
            return s["slug"], await crawl_source(s, state, storage)

    results = await asyncio.gather(*[_one(s) for s in sources], return_exceptions=True)
    out = {}
    for r in results:
        if isinstance(r, Exception):
            print(f"[crawler] source crawl failed: {r!r}", file=sys.stderr)
            continue
        slug, items = r
        out[slug] = items
    return out
