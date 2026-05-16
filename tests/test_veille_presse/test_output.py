"""Tests for output.py — notes.md and HTML generation."""
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

from tools.veille_presse import output

FIXTURE_DIR = Path(__file__).parent / "fixtures"


SAMPLE_EDITION = {
    "date": "2026-05-17",
    "title_draft": "Une semaine de visualisations climatiques et politiques",
    "items": [
        {
            "source": "The New York Times",
            "source_slug": "nyt",
            "title": "How Heat Is Reshaping Cities",
            "url": "https://www.nytimes.com/interactive/2026/05/15/climate/heat-map.html",
            "authors": ["Jane Doe", "John Smith"],
            "twitter_handles": [],
            "tags": ["scrollytelling", "map"],
            "score": 13.0,
            "images": [
                "nyt-how-heat-is-reshaping-cities-fullpage.png",
                "nyt-how-heat-is-reshaping-cities-chart-1.png",
                "nyt-how-heat-is-reshaping-cities-interaction.gif",
            ],
        },
        {
            "source": "Bloomberg Graphics",
            "source_slug": "bloomberg",
            "title": "The Wall Street Story",
            "url": "https://www.bloomberg.com/graphics/2026/wall-street.html",
            "authors": ["Editor X"],
            "twitter_handles": [],
            "tags": ["cartogram"],
            "score": 10.0,
            "images": ["bloomberg-the-wall-street-story-fullpage.png"],
        },
    ],
    "captures_impossibles": [],
}


class TestNotesGeneration(unittest.TestCase):
    def test_notes_md_matches_expected(self):
        expected = (FIXTURE_DIR / "expected-notes.md").read_text(encoding="utf-8")
        actual = output.render_notes_md(SAMPLE_EDITION)
        self.assertEqual(actual.strip(), expected.strip())

    def test_notes_groups_by_source(self):
        notes = output.render_notes_md(SAMPLE_EDITION)
        self.assertIn("# The New York Times", notes)
        self.assertIn("# Bloomberg Graphics", notes)

    def test_notes_includes_tags_and_authors(self):
        notes = output.render_notes_md(SAMPLE_EDITION)
        self.assertIn("#scrollytelling #map", notes)
        self.assertIn("Jane Doe, John Smith", notes)


if __name__ == "__main__":
    unittest.main()
