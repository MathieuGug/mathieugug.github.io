"""Centralized path constants for the veille-presse skill."""
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
SKILL_DIR = REPO / ".claude" / "skills" / "veille-presse-visuelle"
SOURCES_YML = SKILL_DIR / "sources.yml"
ASSETS_DIR = SKILL_DIR / "assets"
STATE_DIR = SKILL_DIR / "state"
STORAGE_STATE_DIR = STATE_DIR / "storage-state"
LAST_CRAWL_JSON = STATE_DIR / "last-crawl.json"
RUN_LOG_JSONL = STATE_DIR / "run-log.jsonl"

VEILLE_DIR = REPO / "veille-presse"
VEILLE_HUB = VEILLE_DIR / "index.html"
ROOT_INDEX = REPO / "index.html"


def edition_dir(date_str: str) -> Path:
    """Return the path to a weekly edition folder (YYYY-MM-DD)."""
    return VEILLE_DIR / date_str
