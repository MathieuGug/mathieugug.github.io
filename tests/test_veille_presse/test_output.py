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


class TestHtmlGeneration(unittest.TestCase):
    def test_render_edition_html_contains_topbar_and_sections(self):
        html = output.render_edition_html(SAMPLE_EDITION)
        self.assertIn('class="topbar"', html)
        self.assertIn("The New York Times", html)
        self.assertIn("Bloomberg Graphics", html)
        self.assertIn("How Heat Is Reshaping Cities", html)
        self.assertIn("VEILLE PRESSE · SEMAINE DU", html)

    def test_render_edition_html_groups_items_by_source(self):
        html = output.render_edition_html(SAMPLE_EDITION)
        # NYT should appear before Bloomberg (higher score)
        nyt_idx = html.find("The New York Times")
        bloomberg_idx = html.find("Bloomberg Graphics")
        self.assertLess(nyt_idx, bloomberg_idx)

    def test_render_edition_html_includes_video_for_mp4(self):
        edition_with_mp4 = {**SAMPLE_EDITION}
        edition_with_mp4["items"] = [{
            **SAMPLE_EDITION["items"][0],
            "images": ["nyt-test-interaction.mp4"],
        }]
        html = output.render_edition_html(edition_with_mp4)
        self.assertIn("<video", html)
        self.assertIn("nyt-test-interaction.mp4", html)

    def test_render_hub_html_renders_cards(self):
        editions = [
            {"date": "2026-05-17", "n_items": 12, "n_sources": 6,
             "title": "Climat et politique", "tags": ["map", "scrollytelling"],
             "hero_images": ["2026-05-17/images/nyt-fullpage.png"]},
            {"date": "2026-05-10", "n_items": 8, "n_sources": 5,
             "title": "Inégalités", "tags": ["heatmap"],
             "hero_images": ["2026-05-10/images/wapo-fullpage.png"]},
        ]
        html = output.render_hub_html(editions)
        self.assertIn("class=\"edition-card\"", html)
        self.assertIn("2026-05-17", html)
        self.assertIn("2026-05-10", html)
        # Anti-chronologique
        idx_17 = html.find("2026-05-17")
        idx_10 = html.find("2026-05-10")
        self.assertLess(idx_17, idx_10)


if __name__ == "__main__":
    unittest.main()
