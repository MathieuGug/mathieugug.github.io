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


class TestPaywallHeuristic(unittest.TestCase):
    def test_short_page_with_sentinel_is_paywall(self):
        html = "<html><body>" + "<p>foo</p>" * 50 + "<div>Subscribe to continue</div></body></html>"
        # ~ a few hundred chars, definitely < 30_000
        self.assertTrue(crawler._looks_paywalled(html))

    def test_full_length_page_not_paywall_even_with_sentinel(self):
        # full article page that happens to mention "subscribe" in nav
        html = "<html><body>" + ("<p>real article content " * 1300) + "subscribe to continue</body></html>"
        # > 30_000 chars
        assert len(html) >= 30_000, f"fixture too short: {len(html)}"
        self.assertFalse(crawler._looks_paywalled(html))

    def test_short_page_no_sentinel_not_paywall(self):
        html = "<html><body><h1>Title</h1><p>tiny</p></body></html>"
        self.assertFalse(crawler._looks_paywalled(html))


class TestArchiveUrls(unittest.TestCase):
    def test_archive_ph_url(self):
        url = "https://www.nytimes.com/interactive/2026/05/15/foo.html"
        self.assertEqual(
            crawler._archive_ph_url(url),
            "https://archive.ph/newest/https://www.nytimes.com/interactive/2026/05/15/foo.html",
        )

    def test_wayback_api_url(self):
        url = "https://www.nytimes.com/interactive/2026/05/15/foo.html"
        self.assertEqual(
            crawler._wayback_api_url(url),
            "http://archive.org/wayback/available?url=https://www.nytimes.com/interactive/2026/05/15/foo.html",
        )


if __name__ == "__main__":
    unittest.main()
