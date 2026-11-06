"""sources.yml loader + last-crawl.json state diff helpers."""
import json
from pathlib import Path
from typing import Any

import yaml


REQUIRED_FIELDS = ("name", "slug", "graphics_url", "weight", "selectors")
REQUIRED_SELECTORS = ("item",)


class SourceConfigError(ValueError):
    """Raised when sources.yml is malformed."""


def _validate_source(s: dict) -> None:
    for field in REQUIRED_FIELDS:
        if field not in s:
            raise SourceConfigError(f"source {s.get('slug', '?')} missing field '{field}'")
    if not isinstance(s["selectors"], dict):
        raise SourceConfigError(f"source {s['slug']} 'selectors' must be a dict")
    for sel in REQUIRED_SELECTORS:
        if sel not in s["selectors"]:
            raise SourceConfigError(f"source {s['slug']} 'selectors.{sel}' is required")



def load_sources(path: Path) -> list[dict]:
    """Load and validate sources.yml. Returns list of source dicts."""
    raw = yaml.safe_load(path.read_text(encoding="utf-8")) or []
    if not isinstance(raw, list):
        raise SourceConfigError("sources.yml top-level must be a list")
    slugs = set()
    for s in raw:
        _validate_source(s)
        if s["slug"] in slugs:
            raise SourceConfigError(f"duplicate slug '{s['slug']}'")
        slugs.add(s["slug"])
    return raw


def load_state(path: Path) -> dict:
    """Load last-crawl.json. Returns {} if missing."""
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def save_state(path: Path, state: dict) -> None:
    """Persist last-crawl.json with pretty indent."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(state, indent=2, ensure_ascii=False), encoding="utf-8")


def diff_new_urls(state: dict, slug: str, crawled: list[str]) -> list[str]:
    """Return URLs in `crawled` not previously seen for `slug`."""
    seen = set(state.get(slug, {}).get("seen_urls", []))
    return [u for u in crawled if u not in seen]


def update_state(state: dict, slug: str, new_urls: list[str], cap: int = 500) -> None:
    """Append new_urls to state[slug].seen_urls, FIFO cap. Mutates state in place."""
    bucket = state.setdefault(slug, {"seen_urls": []})
    seen = bucket["seen_urls"] + new_urls
    if len(seen) > cap:
        seen = seen[-cap:]
    bucket["seen_urls"] = seen
