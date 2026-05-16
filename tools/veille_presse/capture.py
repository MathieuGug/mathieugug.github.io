"""Screenshot + GIF/MP4 capture pipeline."""
import asyncio
import re
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import Optional

FFMPEG_BIN = shutil.which("ffmpeg") or r"C:\Users\mguglielmino\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg.exe"

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


def capture_interaction_gif_from_html(
    html: str, out_path: Path, duration_s: int = 8, fps: int = 10, width: int = 1000
) -> dict:
    """Capture frames via Playwright scroll, encode GIF via ffmpeg.

    Returns {"format": "gif" | "mp4" | "skipped", "size_bytes": int}.

    Fallback ladder:
      1. Try GIF at width=1000 → if <= GIF_CAP_BYTES, return GIF.
      2. Re-encode at width=800 → if <= GIF_CAP_BYTES, return GIF.
      3. Encode MP4 H.264 → if <= MP4_CAP_BYTES, return MP4.
      4. Otherwise, delete output and return {"format": "skipped"}.
    """
    out_path.parent.mkdir(parents=True, exist_ok=True)
    frames_dir = out_path.parent / f"_frames_{out_path.stem}"
    asyncio.run(_capture_frames_async(html, frames_dir, duration_s, fps, width))

    # Try GIF at requested width
    _encode_gif(frames_dir, out_path, fps, width)
    if out_path.exists() and out_path.stat().st_size <= GIF_CAP_BYTES:
        _cleanup_frames(frames_dir)
        return {"format": "gif", "size_bytes": out_path.stat().st_size}

    # Re-encode GIF at 800px
    _encode_gif(frames_dir, out_path, fps, 800)
    if out_path.exists() and out_path.stat().st_size <= GIF_CAP_BYTES:
        _cleanup_frames(frames_dir)
        return {"format": "gif", "size_bytes": out_path.stat().st_size}

    # Fallback to MP4
    mp4_out = out_path.with_suffix(".mp4")
    _encode_mp4(frames_dir, mp4_out, fps)
    if mp4_out.exists() and mp4_out.stat().st_size <= MP4_CAP_BYTES:
        out_path.unlink(missing_ok=True)
        _cleanup_frames(frames_dir)
        return {"format": "mp4", "size_bytes": mp4_out.stat().st_size}

    # Skip
    out_path.unlink(missing_ok=True)
    mp4_out.unlink(missing_ok=True)
    _cleanup_frames(frames_dir)
    return {"format": "skipped", "size_bytes": 0}


async def _capture_frames_async(
    html: str, frames_dir: Path, duration_s: int, fps: int, width: int
) -> None:
    frames_dir.mkdir(parents=True, exist_ok=True)
    n_frames = duration_s * fps

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        try:
            ctx = await browser.new_context(viewport={"width": width, "height": 700})
            page = await ctx.new_page()
            await page.set_content(html, wait_until="load")
            scroll_height = await page.evaluate("document.body.scrollHeight")
            viewport_height = 700
            max_scroll = max(0, scroll_height - viewport_height)

            for i in range(n_frames):
                y = int((i / max(1, n_frames - 1)) * max_scroll)
                await page.evaluate(f"window.scrollTo(0, {y})")
                await page.wait_for_timeout(50)  # let layout settle
                await page.screenshot(path=str(frames_dir / f"frame_{i:04d}.png"))
        finally:
            await browser.close()


def _encode_gif(frames_dir: Path, out_path: Path, fps: int, width: int) -> None:
    """ffmpeg: PNG frames → GIF with palette generation for smaller size."""
    palette = frames_dir / "palette.png"
    subprocess.run(
        [FFMPEG_BIN, "-y", "-framerate", str(fps), "-i", str(frames_dir / "frame_%04d.png"),
         "-vf", f"scale={width}:-1:flags=lanczos,palettegen", str(palette)],
        check=True, capture_output=True,
    )
    subprocess.run(
        [FFMPEG_BIN, "-y", "-framerate", str(fps), "-i", str(frames_dir / "frame_%04d.png"),
         "-i", str(palette),
         "-filter_complex", f"[0:v]scale={width}:-1:flags=lanczos[x];[x][1:v]paletteuse",
         str(out_path)],
        check=True, capture_output=True,
    )


def _encode_mp4(frames_dir: Path, out_path: Path, fps: int) -> None:
    """ffmpeg: PNG frames → H.264 MP4."""
    subprocess.run(
        [FFMPEG_BIN, "-y", "-framerate", str(fps), "-i", str(frames_dir / "frame_%04d.png"),
         "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "23",
         "-vf", "pad=ceil(iw/2)*2:ceil(ih/2)*2",
         str(out_path)],
        check=True, capture_output=True,
    )


def _cleanup_frames(frames_dir: Path) -> None:
    """Best-effort frame cleanup."""
    if not frames_dir.exists():
        return
    for f in frames_dir.iterdir():
        try:
            f.unlink()
        except Exception:
            pass
    try:
        frames_dir.rmdir()
    except Exception:
        pass
