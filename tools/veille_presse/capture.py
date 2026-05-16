"""Screenshot + GIF/MP4 capture pipeline."""
import asyncio
import re
import subprocess
import tempfile
from pathlib import Path
from typing import Optional

from playwright.async_api import async_playwright, Browser, BrowserContext, Page


GIF_CAP_BYTES = 6 * 1024 * 1024  # 6 Mo
MP4_CAP_BYTES = 8 * 1024 * 1024  # 8 Mo

# Section selectors used to detect "chart-like" blocks for individual screenshots
SECTION_SELECTORS = [
    "figure",
    "section[id]",
    "div.chart",
    "div.figure",
    "div[class*='dataviz']",
    "div[class*='infographic']",
]


def _slugify(text: str) -> str:
    """Build a filesystem-safe slug fragment from arbitrary text."""
    text = re.sub(r"[^\w\s-]", "", text.lower())
    text = re.sub(r"[-\s]+", "-", text).strip("-")
    return text[:40] or "section"


def screenshot_full_page_from_html(html: str, out_path: Path) -> None:
    """Sync wrapper: render HTML, save full-page screenshot."""
    asyncio.run(_screenshot_full_page_async(html, out_path))


async def _screenshot_full_page_async(html: str, out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        try:
            ctx = await browser.new_context(viewport={"width": 1200, "height": 800})
            page = await ctx.new_page()
            await page.set_content(html, wait_until="load")
            await page.screenshot(path=str(out_path), full_page=True)
        finally:
            await browser.close()


def screenshot_sections_from_html(
    html: str, out_dir: Path, slug: str, max_sections: int = 5
) -> list[Path]:
    """Sync wrapper: detect sections, save one PNG per matched element (up to max_sections)."""
    return asyncio.run(_screenshot_sections_async(html, out_dir, slug, max_sections))


async def _screenshot_sections_async(
    html: str, out_dir: Path, slug: str, max_sections: int
) -> list[Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    paths: list[Path] = []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        try:
            ctx = await browser.new_context(viewport={"width": 1200, "height": 800})
            page = await ctx.new_page()
            await page.set_content(html, wait_until="load")

            for sel in SECTION_SELECTORS:
                if len(paths) >= max_sections:
                    break
                els = await page.query_selector_all(sel)
                for el in els:
                    if len(paths) >= max_sections:
                        break
                    # Skip too-small or hidden elements
                    box = await el.bounding_box()
                    if box is None or box["width"] < 100 or box["height"] < 60:
                        continue
                    # Derive filename
                    el_id = await el.get_attribute("id")
                    name = _slugify(el_id) if el_id else f"sect-{len(paths)+1}"
                    out = out_dir / f"{slug}-{name}.png"
                    try:
                        await el.screenshot(path=str(out))
                        paths.append(out)
                    except Exception:
                        continue
        finally:
            await browser.close()
    return paths


# === GIF / MP4 capture (Task 7) ===
# Implemented next.
