"""Playwright-driven crawler: landing scrape + per-article fetch + scoring."""
import asyncio
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
from urllib.parse import urljoin, urldefrag

from playwright.async_api import async_playwright, BrowserContext, TimeoutError as PWTimeout


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

        landing_html = await page.content()
        urls = await _extract_urls_from_landing(page, source)
        new_urls = diff_new_urls(state, source["slug"], urls)

        for url in new_urls:
            try:
                await page.goto(url, timeout=30_000, wait_until="domcontentloaded")
                html = await page.content()
                interactive = is_interactive(html, source.get("interactivity_signals", []))
                items.append({"url": url, "html": html, "is_interactive": interactive})
            except PWTimeout:
                continue

        await browser.close()
    return items


async def _extract_urls_from_landing(page, source: dict) -> list[str]:
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
                from tools.veille_presse.paths import REPO
                storage = REPO / ".claude" / "skills" / "veille-presse-visuelle" / s["storage_state"]
            return s["slug"], await crawl_source(s, state, storage)

    results = await asyncio.gather(*[_one(s) for s in sources], return_exceptions=True)
    out = {}
    for r in results:
        if isinstance(r, Exception):
            continue
        slug, items = r
        out[slug] = items
    return out
