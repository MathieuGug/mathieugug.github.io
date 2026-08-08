"""Tests for gift_links.py — Reddit search + cache (no network)."""
import json
import time
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch, MagicMock

from tools.veille_presse import gift_links as gl


class TestCanonicalize(unittest.TestCase):
    def test_strips_query_and_fragment(self):
        self.assertEqual(
            gl._canonicalize("https://www.nytimes.com/2026/05/15/foo.html?unlocked_article_code=ABC#xyz"),
            "https://www.nytimes.com/2026/05/15/foo.html",
        )

    def test_strips_trailing_slash(self):
        self.assertEqual(
            gl._canonicalize("https://www.nytimes.com/2026/05/15/foo/"),
            "https://www.nytimes.com/2026/05/15/foo",
        )


class TestGiftUrlExtraction(unittest.TestCase):
    def test_nyt_pattern_extracts_from_selftext(self):
        text = "Check out this article: https://www.nytimes.com/2026/05/15/climate/heat.html?unlocked_article_code=ABCD1234 — really good!"
        matches = gl.REDDIT_SOURCES["nyt"]["gift_url_pattern"].findall(text)
        self.assertEqual(len(matches), 1)
        self.assertIn("unlocked_article_code=ABCD1234", matches[0])

    def test_wapo_pattern_extracts(self):
        text = "https://www.washingtonpost.com/world/2026/05/15/foo/?gift=XYZ789ABC and another paragraph"
        matches = gl.REDDIT_SOURCES["wapo"]["gift_url_pattern"].findall(text)
        self.assertEqual(len(matches), 1)
        self.assertIn("gift=XYZ789ABC", matches[0])

    def test_pattern_skips_unrelated(self):
        text = "Plain text with no gift link, just https://www.nytimes.com/foo.html as a normal URL"
        self.assertEqual(gl.REDDIT_SOURCES["nyt"]["gift_url_pattern"].findall(text), [])


class TestCache(unittest.TestCase):
    def test_save_and_load_roundtrip(self):
        with TemporaryDirectory() as td:
            cache = Path(td) / "gift.json"
            gl.save_cache(cache, {"https://nyt.com/foo": "https://nyt.com/foo?unlocked_article_code=ABC"})
            loaded = gl.load_cache(cache)
            self.assertIn("https://nyt.com/foo", loaded)
            self.assertEqual(loaded["https://nyt.com/foo"]["gift_url"],
                             "https://nyt.com/foo?unlocked_article_code=ABC")

    def test_load_missing_returns_empty(self):
        with TemporaryDirectory() as td:
            self.assertEqual(gl.load_cache(Path(td) / "missing.json"), {})

    def test_lookup_returns_gift_url_for_non_expired(self):
        cache = {
            "https://nyt.com/foo": {
                "gift_url": "https://nyt.com/foo?unlocked_article_code=ABC",
                "fetched_at": int(time.time()),
                "expires_at": int(time.time()) + 1000,
            }
        }
        self.assertEqual(
            gl.lookup_gift_url("https://nyt.com/foo", cache),
            "https://nyt.com/foo?unlocked_article_code=ABC",
        )

    def test_lookup_returns_none_for_expired(self):
        cache = {
            "https://nyt.com/foo": {
                "gift_url": "https://nyt.com/foo?unlocked_article_code=ABC",
                "fetched_at": int(time.time()) - 2000,
                "expires_at": int(time.time()) - 1000,
            }
        }
        self.assertIsNone(gl.lookup_gift_url("https://nyt.com/foo", cache))

    def test_lookup_matches_by_canonical_url(self):
        cache = {
            "https://nyt.com/foo": {
                "gift_url": "https://nyt.com/foo?unlocked_article_code=ABC",
                "fetched_at": int(time.time()),
                "expires_at": int(time.time()) + 1000,
            }
        }
        # The cache key is canonical (no query); lookup with full URL should match
        self.assertEqual(
            gl.lookup_gift_url("https://nyt.com/foo?source=email", cache),
            "https://nyt.com/foo?unlocked_article_code=ABC",
        )


class TestDiscoverGiftLinksMocked(unittest.TestCase):
    def test_discover_aggregates_from_subreddits(self):
        # Mock a Reddit JSON response with 2 posts containing gift links
        fake_response = {
            "data": {
                "children": [
                    {"data": {"selftext": "Here's a gift: https://www.nytimes.com/2026/05/15/foo.html?unlocked_article_code=AAA", "url": ""}},
                    {"data": {"selftext": "", "url": "https://www.nytimes.com/2026/05/16/bar.html?unlocked_article_code=BBB"}},
                ]
            }
        }
        with patch("tools.veille_presse.gift_links._fetch_json", return_value=fake_response):
            with patch("tools.veille_presse.gift_links.time.sleep"):  # skip rate-limit pause
                result = gl.discover_gift_links_for_source("nyt")
        self.assertEqual(len(result), 2)
        self.assertIn("https://www.nytimes.com/2026/05/15/foo.html", result)
        self.assertIn("https://www.nytimes.com/2026/05/16/bar.html", result)

    def test_discover_returns_empty_for_unknown_slug(self):
        self.assertEqual(gl.discover_gift_links_for_source("unknown-slug"), {})


if __name__ == "__main__":
    unittest.main()
