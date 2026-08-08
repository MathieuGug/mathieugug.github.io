"""Tests for sources.py — YAML loader + state diff."""
import json
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

from tools.veille_presse import sources as srcmod

FIXTURE = Path(__file__).parent / "fixtures" / "sources-sample.yml"


class TestSourcesLoader(unittest.TestCase):
    def test_load_returns_list_of_dicts(self):
        result = srcmod.load_sources(FIXTURE)
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0]["slug"], "nyt")
        self.assertEqual(result[1]["slug"], "reuters")

    def test_load_validates_required_fields(self):
        bad = {"name": "Bad", "slug": "bad"}  # missing graphics_url, weight, selectors
        with self.assertRaises(srcmod.SourceConfigError):
            srcmod._validate_source(bad)

    def test_load_rejects_duplicate_slugs(self):
        with TemporaryDirectory() as td:
            p = Path(td) / "dup.yml"
            p.write_text(
                "- {name: A, slug: dup, graphics_url: 'http://a', weight: 1, selectors: {item: a}}\n"
                "- {name: B, slug: dup, graphics_url: 'http://b', weight: 1, selectors: {item: a}}\n",
                encoding="utf-8",
            )
            with self.assertRaises(srcmod.SourceConfigError):
                srcmod.load_sources(p)


class TestDiffState(unittest.TestCase):
    def test_diff_new_urls(self):
        state = {"nyt": {"seen_urls": ["http://a", "http://b"]}}
        crawled = ["http://b", "http://c", "http://d"]
        new = srcmod.diff_new_urls(state, "nyt", crawled)
        self.assertEqual(new, ["http://c", "http://d"])

    def test_diff_no_prior_state(self):
        new = srcmod.diff_new_urls({}, "nyt", ["http://a"])
        self.assertEqual(new, ["http://a"])

    def test_update_state_caps_at_500_fifo(self):
        state = {"nyt": {"seen_urls": [f"http://old{i}" for i in range(500)]}}
        srcmod.update_state(state, "nyt", ["http://new1", "http://new2"], cap=500)
        self.assertEqual(len(state["nyt"]["seen_urls"]), 500)
        self.assertNotIn("http://old0", state["nyt"]["seen_urls"])
        self.assertIn("http://new2", state["nyt"]["seen_urls"])

    def test_load_save_state_roundtrip(self):
        with TemporaryDirectory() as td:
            p = Path(td) / "last-crawl.json"
            state = {"nyt": {"last_run": "2026-05-17T20:00:00+02:00", "seen_urls": ["http://a"]}}
            srcmod.save_state(p, state)
            loaded = srcmod.load_state(p)
            self.assertEqual(loaded, state)

    def test_load_state_missing_file_returns_empty(self):
        with TemporaryDirectory() as td:
            self.assertEqual(srcmod.load_state(Path(td) / "missing.json"), {})


class TestRealSourcesYml(unittest.TestCase):
    def test_real_sources_yml_loads(self):
        from tools.veille_presse.paths import SOURCES_YML
        sources = srcmod.load_sources(SOURCES_YML)
        self.assertGreaterEqual(len(sources), 25)
        slugs = [s["slug"] for s in sources]
        for required in ["nyt", "wapo", "bloomberg", "reuters", "lemonde", "pudding"]:
            self.assertIn(required, slugs)


if __name__ == "__main__":
    unittest.main()
