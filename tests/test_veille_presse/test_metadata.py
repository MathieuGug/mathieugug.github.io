"""Tests for metadata.py — title/authors/date + tags heuristic."""
import unittest
from pathlib import Path

from tools.veille_presse import metadata

FIXTURE = Path(__file__).parent / "fixtures" / "nytimes-article.html"


class TestMetadataExtraction(unittest.TestCase):
    def test_extract_title(self):
        html = FIXTURE.read_text(encoding="utf-8")
        sels = {"title": "h1", "author": ".byline", "published": "time[datetime]"}
        meta = metadata.extract(html, sels)
        self.assertIn("Heat", meta["title"])

    def test_extract_authors_split(self):
        html = FIXTURE.read_text(encoding="utf-8")
        sels = {"title": "h1", "author": ".byline", "published": "time[datetime]"}
        meta = metadata.extract(html, sels)
        self.assertGreaterEqual(len(meta["authors"]), 1)

    def test_extract_published_iso(self):
        html = FIXTURE.read_text(encoding="utf-8")
        sels = {"title": "h1", "author": ".byline", "published": "time[datetime]"}
        meta = metadata.extract(html, sels)
        self.assertTrue(meta["published"].startswith("2026"))


class TestTagsHeuristic(unittest.TestCase):
    def test_detect_hexbin_as_cartogram(self):
        html = '<svg><g class="hexbin"></g></svg>'
        tags = metadata.detect_tags(html)
        self.assertIn("cartogram", tags)

    def test_detect_voronoi(self):
        html = '<svg><pattern id="voronoi"></pattern></svg>'
        tags = metadata.detect_tags(html)
        self.assertIn("voronoi", tags)

    def test_detect_scrollytelling(self):
        html = '<div class="scrollytelling-step"></div>'
        tags = metadata.detect_tags(html)
        self.assertIn("scrollytelling", tags)

    def test_detect_map(self):
        html = '<script src="https://api.mapbox.com/v3/something.js"></script>'
        tags = metadata.detect_tags(html)
        self.assertIn("map", tags)

    def test_empty_html_no_tags(self):
        self.assertEqual(metadata.detect_tags("<html></html>"), [])


if __name__ == "__main__":
    unittest.main()
