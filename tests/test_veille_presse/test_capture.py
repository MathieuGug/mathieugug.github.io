"""Smoke tests for capture.py — requires Playwright + ffmpeg installed."""
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

from tools.veille_presse import capture


# Mini HTML servi en data: URL (pas besoin de serveur)
SAMPLE_HTML = """
<!DOCTYPE html><html><body>
<h1 id="hero">Hero</h1>
<section id="chart-1"><svg width="200" height="100"><rect width="200" height="100" fill="blue"/></svg></section>
<section id="chart-2"><svg width="200" height="100"><rect width="200" height="100" fill="red"/></svg></section>
<div style="height: 2000px"></div>
</body></html>
"""


class TestScreenshots(unittest.TestCase):
    def test_full_page_screenshot(self):
        with TemporaryDirectory() as td:
            out = Path(td) / "fullpage.png"
            capture.screenshot_full_page_from_html(SAMPLE_HTML, out)
            self.assertTrue(out.exists())
            self.assertGreater(out.stat().st_size, 1000)

    def test_section_screenshots(self):
        with TemporaryDirectory() as td:
            out_dir = Path(td)
            paths = capture.screenshot_sections_from_html(
                SAMPLE_HTML, out_dir, slug="test", max_sections=5
            )
            self.assertGreaterEqual(len(paths), 1)
            for p in paths:
                self.assertTrue(p.exists())


if __name__ == "__main__":
    unittest.main()
