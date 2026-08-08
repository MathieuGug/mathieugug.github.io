"""Git ops + GitHub MCP wiring + run-log for veille-presse editions."""
import json
import subprocess
from pathlib import Path
from typing import Optional


def _git(repo: Path, *args: str, capture: bool = True) -> str:
    """Run git in repo, return stdout (or '' if capture=False)."""
    if capture:
        return subprocess.check_output(["git", *args], cwd=repo, text=True).strip()
    subprocess.run(["git", *args], cwd=repo, check=True)
    return ""


def create_edition_commit(
    repo: Path,
    date_str: str,
    n_items: int,
    paths_to_add: list[str],
) -> str:
    """Create branch veille/YYYY-MM-DD off main, add paths, commit, return commit sha.

    Caller pushes separately (push needs network/auth).
    """
    branch = f"veille/{date_str}"
    _git(repo, "checkout", "main", capture=False)
    _git(repo, "checkout", "-b", branch, capture=False)
    for p in paths_to_add:
        _git(repo, "add", p, capture=False)
    msg = f"veille: édition du {date_str} ({n_items} pièces)\n\nCo-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
    _git(repo, "commit", "-m", msg, capture=False)
    return _git(repo, "rev-parse", "HEAD")


def push_branch(repo: Path, date_str: str) -> None:
    """git push origin veille/YYYY-MM-DD."""
    branch = f"veille/{date_str}"
    _git(repo, "push", "origin", branch, capture=False)


def append_run_log(log_path: Path, entry: dict) -> None:
    """Append a JSONL entry to the run log."""
    log_path.parent.mkdir(parents=True, exist_ok=True)
    with log_path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


# === MCP GitHub wiring ===
# These two functions DELEGATE to the caller's MCP environment via stdout
# protocol (the CLI prints a JSON command, the Claude session reads it and
# performs the MCP call, then writes the result back to stdin).
#
# In v1 we keep it simple: the cli.py main `run` command writes a
# `mcp-pending.json` file describing the PR to create + merge, and the
# Claude harness picks it up. See cli.py for the bridge.


def write_pending_mcp_actions(state_dir: Path, date_str: str, branch: str) -> Path:
    """Write the pending MCP action sequence to disk for the Claude harness to execute."""
    state_dir.mkdir(parents=True, exist_ok=True)
    pending = state_dir / "mcp-pending.json"
    pending.write_text(json.dumps({
        "actions": [
            {
                "tool": "mcp__github__create_pull_request",
                "args": {
                    "owner": "mathieugug",
                    "repo": "mathieugug.github.io",
                    "title": f"Veille presse — semaine du {date_str}",
                    "body": "Édition automatique générée par la skill `veille-presse-visuelle`. Cf. spec `docs/superpowers/specs/2026-05-16-veille-presse-visuelle-design.md`.",
                    "head": branch,
                    "base": "main",
                },
                "expect": {"output_field": "number", "save_as": "pr_number"},
            },
            {
                "tool": "mcp__github__merge_pull_request",
                "args": {
                    "owner": "mathieugug",
                    "repo": "mathieugug.github.io",
                    "pullNumber": "{pr_number}",
                    "mergeMethod": "squash",
                },
                "expect": {"output_field": "sha", "save_as": "merge_sha"},
            },
        ],
    }, indent=2), encoding="utf-8")
    return pending
