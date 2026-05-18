"""Article metadata extraction via Playwright + tags heuristics."""
import asyncio
import re
from typing import Optional

from playwright.async_api import async_playwright


TAG_PATTERNS = {
    "voronoi": [r'<pattern[^>]+id=["\']?voronoi', r'class=["\'][^"\']*voronoi'],
    "cartogram": [r'<g[^>]+class=["\'][^"\']*hexbin', r'class=["\'][^"\']*cartogram'],
    "heatmap": [r'class=["\'][^"\']*heat[-_]?map', r'<g[^>]+class=["\'][^"\']*heatmap'],
    "hemicycle": [r'class=["\'][^"\']*hemicycle'],
    "scrollytelling": [
        r'class=["\'][^"\']*scrollytelling',
        r'data-scrollama',
        r'class=["\'][^"\']*scrolly[-_]',
        r'<script[^>]+src=["\'][^"\']*scrollama',
    ],
    "treemap": [r'class=["\'][^"\']*treemap'],
    "bertin": [r'class=["\'][^"\']*bertin', r'<!--\s*bertin'],
    "network": [r'class=["\'][^"\']*network[-_]graph', r'class=["\'][^"\']*force[-_]graph'],
    "map": [
        r'<script[^>]+src=["\'][^"\']*mapbox',
        r'<script[^>]+src=["\'][^"\']*leaflet',
        r'class=["\'][^"\']*mapboxgl',
    ],
    "opening": [r'class=["\'][^"\']*hero[-_]', r'class=["\'][^"\']*opening'],
}


def detect_tags(html: str) -> list[str]:
    """Heuristic tag detection from raw HTML. Returns deduped list."""
    found = []
    for tag, patterns in TAG_PATTERNS.items():
        for pat in patterns:
            if re.search(pat, html, re.IGNORECASE):
                found.append(tag)
                break
    return found


def extract(html: str, selectors: dict) -> dict:
    """Extract title, authors (list), published (ISO str) from HTML via Playwright DOM.

    Missing fields are returned as empty string ("") for title and published,
    and as empty list ([]) for authors. Never returns None values.
    """
    return asyncio.run(_extract_async(html, selectors))


async def _extract_async(html: str, selectors: dict) -> dict:
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        try:
            page = await (await browser.new_context()).new_page()
            await page.set_content(html)

            async def text_of(sel: Optional[str]) -> Optional[str]:
                if not sel:
                    return None
                try:
                    el = await page.query_selector(sel)
                    if el is None:
                        return None
                    return (await el.inner_text()).strip()
                except Exception:
                    return None

            title = await text_of(selectors.get("title"))

            authors: list[str] = []
            author_sel = selectors.get("author")
            if author_sel:
                try:
                    els = await page.query_selector_all(author_sel)
                    for el in els:
                        txt = (await el.inner_text()).strip()
                        if txt:
                            for piece in re.split(r"\s+and\s+|,|;|\s+et\s+", txt):
                                piece = piece.strip()
                                if piece.startswith("By "):
                                    piece = piece[3:].strip()
                                elif piece.startswith("by "):
                                    piece = piece[3:].strip()
                                if piece and piece not in authors:
                                    authors.append(piece)
                except Exception:
                    pass

            published = None
            pub_sel = selectors.get("published")
            if pub_sel:
                try:
                    el = await page.query_selector(pub_sel)
                    if el is not None:
                        published = await el.get_attribute("datetime")
                except Exception:
                    pass
        finally:
            await browser.close()

    return {
        "title": title or "",
        "authors": authors,
        "published": published or "",
    }
