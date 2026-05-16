"""Tests for crawler.py — URL extraction + scoring + shortlist."""
import unittest
from pathlib import Path

from tools.veille_presse import crawler

FIXTURE_DIR = Path(__file__).parent / "fixtures"
NYT_LANDING = FIXTURE_DIR / "nytimes-graphics-landing.html"


class TestUrlExtraction(unittest.TestCase):
    def test_extract_urls_with_selector(self):
        html = NYT_LANDING.read_text(encoding="utf-8")
        selector = "article a[href*='/interactive/']"
        urls = crawler.extract_urls_from_html(html, selector, base="https://www.nytimes.com")
        self.assertTrue(all("/interactive/" in u for u in urls))
        self.assertTrue(all(u.startswith("https://www.nytimes.com") for u in urls))
        # Pas de duplicates
        self.assertEqual(len(urls), len(set(urls)))


class TestScoring(unittest.TestCase):
    def test_score_baseline(self):
        item = {"is_interactive": False}
        source = {"weight": 10}
        self.assertEqual(crawler.score_item(item, source), 10.0)

    def test_score_interactive_bonus(self):
        item = {"is_interactive": True}
        source = {"weight": 10}
        self.assertEqual(crawler.score_item(item, source), 13.0)


class TestShortlist(unittest.TestCase):
    def test_shortlist_caps_and_sorts(self):
        items = [{"url": f"u{i}", "score": i} for i in range(30)]
        shortlist = crawler.build_shortlist(items, cap=15)
        self.assertEqual(len(shortlist), 15)
        self.assertEqual(shortlist[0]["url"], "u29")  # highest score first
        self.assertEqual(shortlist[-1]["url"], "u15")


class TestInteractivityDetection(unittest.TestCase):
    def test_detect_from_script_srcs(self):
        html = '<html><head><script src="https://d3js.org/d3.v7.min.js"></script></head></html>'
        signals = ["d3", "scrollama", "observable"]
        self.assertTrue(crawler.is_interactive(html, signals))

    def test_no_signals_means_not_interactive(self):
        html = "<html><body>plain article</body></html>"
        self.assertFalse(crawler.is_interactive(html, ["d3", "scrollama"]))


if __name__ == "__main__":
    unittest.main()
