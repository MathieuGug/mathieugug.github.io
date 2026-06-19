"""Tests for publish.py — git ops + run-log. Uses tmp git repo, no network."""
import json
import subprocess
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

from tools.veille_presse import publish


def _git(cwd: Path, *args: str) -> str:
    return subprocess.check_output(["git", *args], cwd=cwd, text=True).strip()


class TestGitBranchAndCommit(unittest.TestCase):
    def setUp(self):
        self.td = TemporaryDirectory()
        self.repo = Path(self.td.name)
        subprocess.run(["git", "init", "-q", "-b", "main"], cwd=self.repo, check=True)
        subprocess.run(["git", "config", "user.email", "test@test"], cwd=self.repo, check=True)
        subprocess.run(["git", "config", "user.name", "Test"], cwd=self.repo, check=True)
        (self.repo / "README.md").write_text("init", encoding="utf-8")
        subprocess.run(["git", "add", "."], cwd=self.repo, check=True)
        subprocess.run(["git", "commit", "-q", "-m", "init"], cwd=self.repo, check=True)

    def tearDown(self):
        self.td.cleanup()

    def test_create_branch_and_commit(self):
        (self.repo / "veille-presse" / "2026-05-17").mkdir(parents=True)
        (self.repo / "veille-presse" / "2026-05-17" / "index.html").write_text("html", encoding="utf-8")

        commit_sha = publish.create_edition_commit(
            self.repo, "2026-05-17", n_items=12,
            paths_to_add=["veille-presse"],
        )

        self.assertEqual(_git(self.repo, "rev-parse", "--abbrev-ref", "HEAD"),
                         "veille/2026-05-17")
        self.assertTrue(commit_sha)
        log_msg = _git(self.repo, "log", "-1", "--pretty=%s")
        self.assertIn("veille", log_msg)
        self.assertIn("2026-05-17", log_msg)


class TestRunLog(unittest.TestCase):
    def test_append_run_log_entry(self):
        with TemporaryDirectory() as td:
            log = Path(td) / "run-log.jsonl"
            publish.append_run_log(log, {
                "date": "2026-05-17",
                "n_crawled": 50, "n_shortlisted": 15, "n_captured": 14,
                "n_skipped": 1, "pr_number": 42, "merge_sha": "abc123",
            })
            lines = log.read_text(encoding="utf-8").strip().split("\n")
            self.assertEqual(len(lines), 1)
            entry = json.loads(lines[0])
            self.assertEqual(entry["pr_number"], 42)

    def test_append_run_log_multiple(self):
        with TemporaryDirectory() as td:
            log = Path(td) / "run-log.jsonl"
            publish.append_run_log(log, {"date": "2026-05-10", "pr_number": 1})
            publish.append_run_log(log, {"date": "2026-05-17", "pr_number": 2})
            lines = log.read_text(encoding="utf-8").strip().split("\n")
            self.assertEqual(len(lines), 2)


if __name__ == "__main__":
    unittest.main()
