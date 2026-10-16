# Veille presse visuelle — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully automated weekly visual press review system that crawls dataviz landing pages of ~30 press sources, captures screenshots/GIFs/MP4s, generates a public dossier in `veille-presse/YYYY-MM-DD/`, and auto-merges the PR — wired to a Sunday 20h Europe/Paris cron.

**Architecture:** Python package `tools/veille_presse/` with 8 focused modules (sources, crawler, metadata, capture, output, publish, cli, paths). Playwright headless with per-source `storage_state.json` for paywalled sources. Templates HTML inline-rendered (no Jinja, plain string `.format()` consistent with repo). Skill `.claude/skills/veille-presse-visuelle/` holds SKILL.md, sources.yml, references, HTML templates, gitignored state. Cron via `/schedule` invokes `python tools/veille_presse/cli.py run`.

**Tech Stack:** Python 3.11+ (unittest natif), Playwright Python (`playwright`), PyYAML, Pillow (déjà utilisé par og-card.py), ffmpeg (système). MCP GitHub pour PR/merge. Pas de framework web — vanilla HTML/CSS comme le reste du repo.

---

## File Structure

```
.claude/skills/veille-presse-visuelle/                  ← skill (force-add)
  SKILL.md                                               ← entry + 2-phase checklist
  sources.yml                                            ← config source de vérité (30 sources)
  references/
    crawler.md                                           ← stratégie diff + sélecteurs
    capture.md                                           ← pipeline Playwright + ffmpeg
    output.md                                            ← templates + design system
  assets/
    edition-template.html                                ← squelette page hebdo
    hub-template.html                                    ← squelette hub veille-presse/
  state/                                                 ← gitignored sauf .gitkeep
    .gitignore                                           ← `*\n!.gitignore\n!.gitkeep`
    .gitkeep

tools/veille_presse/                                     ← package Python
  __init__.py
  paths.py                                               ← REPO, SKILL_DIR, VEILLE_DIR, STATE_DIR
  sources.py                                             ← YAML loader + diff state
  crawler.py                                             ← Playwright crawl + scoring
  metadata.py                                            ← title/authors/tags extraction
  capture.py                                             ← screenshots + GIF/MP4
  output.py                                              ← notes.md + HTML generators
  publish.py                                             ← git + GitHub MCP + run-log
  cli.py                                                 ← argparse entrypoint (run, build-storage-state)
  requirements.txt                                       ← playwright, pyyaml, pillow
  README.md                                              ← 1-page pointer vers SKILL.md

tools/build-storage-state.py                             ← thin wrapper vers cli.py

tests/test_veille_presse/
  __init__.py
  conftest.py                                            ← tmpdir, fixtures shared
  test_sources.py
  test_crawler.py
  test_metadata.py
  test_capture.py                                        ← smoke (Playwright requis)
  test_output.py
  test_publish.py                                        ← smoke (tmp git repo)
  fixtures/
    sources-sample.yml
    nytimes-sample.html
    nytimes-graphics-landing.html
    bloomberg-sample.html
    expected-notes.md
    expected-edition.html
```

**Boundaries / responsibilities** :
- `sources.py` : YAML load + state diff. Aucune dépendance Playwright. Testable en isolation.
- `crawler.py` : Playwright I/O + scoring. Dépend de sources.py + metadata.py.
- `metadata.py` : Parse HTML pur (BeautifulSoup-style via `parsel` ou `playwright`'s `query_selector`). Testable avec fixtures HTML.
- `capture.py` : Screenshots + ffmpeg. Smoke tests uniquement (I/O lourd).
- `output.py` : Génération markdown + HTML. Testable avec strings.
- `publish.py` : git + MCP GitHub + JSONL log. Tests sur tmp git repo + mock MCP.
- `cli.py` : Wire les phases. Testé via smoke end-to-end.
- `paths.py` : Constantes. Pas de test (trivial).

---

## Task 1: Bootstrap — skill skeleton + Python package skel

**Files:**
- Create: `.claude/skills/veille-presse-visuelle/SKILL.md` (placeholder)
- Create: `.claude/skills/veille-presse-visuelle/sources.yml` (vide pour l'instant)
- Create: `.claude/skills/veille-presse-visuelle/state/.gitignore`
- Create: `.claude/skills/veille-presse-visuelle/state/.gitkeep`
- Create: `tools/veille_presse/__init__.py`
- Create: `tools/veille_presse/requirements.txt`
- Create: `tools/veille_presse/README.md`
- Create: `tools/veille_presse/paths.py`
- Create: `tests/test_veille_presse/__init__.py`

- [ ] **Step 1.1: Créer l'arborescence**

Run :
```bash
mkdir -p .claude/skills/veille-presse-visuelle/{references,assets,state}
mkdir -p tools/veille_presse
mkdir -p tests/test_veille_presse/fixtures
touch tools/veille_presse/__init__.py
touch tests/test_veille_presse/__init__.py
touch .claude/skills/veille-presse-visuelle/state/.gitkeep
```

- [ ] **Step 1.2: Écrire `state/.gitignore`**

`.claude/skills/veille-presse-visuelle/state/.gitignore` :
```
*
!.gitignore
!.gitkeep
```

- [ ] **Step 1.3: Écrire `requirements.txt`**

`tools/veille_presse/requirements.txt` :
```
playwright>=1.45
pyyaml>=6.0
pillow>=10.0
```

- [ ] **Step 1.4: Écrire `paths.py`**

`tools/veille_presse/paths.py` :
```python
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
```

- [ ] **Step 1.5: Écrire `README.md` pointer**

`tools/veille_presse/README.md` :
```markdown
# tools/veille_presse/

Python package implementing the `veille-presse-visuelle` skill.

For the contract, workflow, and design rationale, see
`.claude/skills/veille-presse-visuelle/SKILL.md`.

## Quick start

```bash
pip install -r tools/veille_presse/requirements.txt
playwright install chromium

# Manual run (same as the Sunday 20h cron)
python tools/veille_presse/cli.py run

# Rebuild a paywall session
python tools/veille_presse/cli.py build-storage-state nyt
```
```

- [ ] **Step 1.6: SKILL.md placeholder + sources.yml placeholder**

`.claude/skills/veille-presse-visuelle/SKILL.md` :
```markdown
---
name: veille-presse-visuelle
description: Weekly automated visual press review — crawls ~30 dataviz sources, captures screenshots/GIFs/MP4, publishes to veille-presse/YYYY-MM-DD/, auto-merges PR. Triggered by Sunday 20h cron or `python tools/veille_presse/cli.py run`.
---

# Veille presse visuelle

Skeleton — see Task 16 for the full contract.
```

`.claude/skills/veille-presse-visuelle/sources.yml` (vide en attente Task 4) :
```yaml
# Source registry — populated in Task 4
[]
```

- [ ] **Step 1.7: Commit**

```bash
git add .claude/skills/veille-presse-visuelle tools/veille_presse tests/test_veille_presse
git commit -m "veille: bootstrap skill skel + python package skel"
```

---

## Task 2: `sources.py` — YAML loader + diff state

**Files:**
- Create: `tools/veille_presse/sources.py`
- Create: `tests/test_veille_presse/test_sources.py`
- Create: `tests/test_veille_presse/fixtures/sources-sample.yml`

- [ ] **Step 2.1: Écrire la fixture YAML de test**

`tests/test_veille_presse/fixtures/sources-sample.yml` :
```yaml
- name: The New York Times
  slug: nyt
  graphics_url: https://www.nytimes.com/spotlight/graphics
  paywall: true
  weight: 10
  storage_state: state/storage-state/nyt.json
  selectors:
    item: "article a[href*='/interactive/']"
    title: "h1"
    author: ".byline"
    published: "time[datetime]"
  interactivity_signals: [d3, scrollama]

- name: Reuters Graphics
  slug: reuters
  graphics_url: https://www.reuters.com/graphics/
  paywall: false
  weight: 10
  selectors:
    item: "a.story-card[href*='/graphics/']"
    title: "h1"
    author: ".author-name"
  interactivity_signals: [d3]
```

- [ ] **Step 2.2: Écrire les tests qui échouent**

`tests/test_veille_presse/test_sources.py` :
```python
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


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2.3: Run tests, observe failure**

```bash
python -m unittest tests.test_veille_presse.test_sources -v
```

Expected: `ModuleNotFoundError` ou `AttributeError` sur `srcmod.load_sources`, `_validate_source`, `diff_new_urls`, `update_state`, `save_state`, `load_state`, `SourceConfigError`.

- [ ] **Step 2.4: Implémenter `sources.py`**

`tools/veille_presse/sources.py` :
```python
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
    if s.get("paywall") and not s.get("storage_state"):
        raise SourceConfigError(
            f"source {s['slug']} is paywalled but has no storage_state path"
        )


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
```

- [ ] **Step 2.5: Run tests, expect PASS**

```bash
python -m unittest tests.test_veille_presse.test_sources -v
```

Expected: 7 tests pass.

- [ ] **Step 2.6: Commit**

```bash
git add tools/veille_presse/sources.py tests/test_veille_presse/test_sources.py tests/test_veille_presse/fixtures/sources-sample.yml
git commit -m "veille: sources.yml loader + last-crawl diff state"
```

---

## Task 3: `crawler.py` — Playwright crawl + scoring

**Files:**
- Create: `tools/veille_presse/crawler.py`
- Create: `tests/test_veille_presse/test_crawler.py`
- Create: `tests/test_veille_presse/fixtures/nytimes-graphics-landing.html`

- [ ] **Step 3.1: Capturer une fixture HTML réelle de NYT graphics landing**

Manuellement, depuis Chrome :
1. Visiter https://www.nytimes.com/spotlight/graphics
2. View Source → sauvegarder le HTML brut dans `tests/test_veille_presse/fixtures/nytimes-graphics-landing.html`
3. Garder uniquement les ~50 premiers `<article>` blocks pour réduire la taille (fichier ~200 Ko max)

Si pas accessible : créer un mock HTML minimal :
```html
<!DOCTYPE html><html><body>
<article><a href="/interactive/2026/05/15/climate/heat-map.html"><h2>How Heat Is Reshaping Cities</h2></a></article>
<article><a href="/interactive/2026/05/14/politics/senate.html"><h2>The Senate Race</h2></a></article>
<article><a href="/opinion/2026/05/13/article.html"><h2>Not interactive</h2></a></article>
</body></html>
```

- [ ] **Step 3.2: Écrire les tests qui échouent**

`tests/test_veille_presse/test_crawler.py` :
```python
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


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 3.3: Run tests, observe failure**

```bash
python -m unittest tests.test_veille_presse.test_crawler -v
```

Expected: fail on `crawler.extract_urls_from_html`, `score_item`, `build_shortlist`, `is_interactive`.

- [ ] **Step 3.4: Implémenter `crawler.py`**

`tools/veille_presse/crawler.py` :
```python
"""Playwright-driven crawler: landing scrape + per-article fetch + scoring."""
import asyncio
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
from urllib.parse import urljoin, urldefrag

from playwright.async_api import async_playwright, BrowserContext, TimeoutError as PWTimeout


def extract_urls_from_html(html: str, selector: str, base: str) -> list[str]:
    """Parse HTML and extract absolute URLs matching `selector` (href attr).
    Uses Playwright's lightweight DOM parsing via a temporary page in chromium.
    Synchronous wrapper around an async call for ergonomic tests.
    """
    return asyncio.run(_extract_urls_from_html_async(html, selector, base))


async def _extract_urls_from_html_async(html: str, selector: str, base: str) -> list[str]:
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context()
        page = await context.new_page()
        await page.set_content(html)
        hrefs = await page.eval_on_selector_all(
            selector, "els => els.map(e => e.getAttribute('href')).filter(Boolean)"
        )
        await browser.close()
    out = []
    seen = set()
    for h in hrefs:
        abs_url, _ = urldefrag(urljoin(base, h))
        if abs_url not in seen:
            seen.add(abs_url)
            out.append(abs_url)
    return out


def is_interactive(html: str, signals: list[str]) -> bool:
    """Heuristic: any of `signals` substrings present in <script src=...> attrs?"""
    if not signals:
        return False
    pattern = re.compile(r'<script[^>]+src=["\']([^"\']+)["\']', re.IGNORECASE)
    srcs = pattern.findall(html)
    blob = " ".join(srcs).lower()
    return any(sig.lower() in blob for sig in signals)


def score_item(item: dict, source: dict) -> float:
    """score = source.weight × (1 + 0.3 × is_interactive)."""
    base = float(source["weight"])
    bonus = 0.3 if item.get("is_interactive") else 0.0
    return base * (1.0 + bonus)


def build_shortlist(items: list[dict], cap: int = 15) -> list[dict]:
    """Sort items by 'score' descending, cap to N."""
    return sorted(items, key=lambda i: i.get("score", 0), reverse=True)[:cap]


async def crawl_source(source: dict, state: dict, storage_state_path: Optional[Path] = None) -> list[dict]:
    """Crawl one source's landing page, return list of {url, is_interactive, html} for NEW items only.

    Caller is responsible for state.update_state() and metadata extraction.
    """
    from tools.veille_presse.sources import diff_new_urls

    items: list[dict] = []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx_args = {}
        if storage_state_path and storage_state_path.exists():
            ctx_args["storage_state"] = str(storage_state_path)
        context = await browser.new_context(**ctx_args)
        page = await context.new_page()

        try:
            await page.goto(source["graphics_url"], timeout=30_000, wait_until="domcontentloaded")
        except PWTimeout:
            await browser.close()
            return []

        landing_html = await page.content()
        urls = await _extract_urls_from_landing(page, source)
        new_urls = diff_new_urls(state, source["slug"], urls)

        for url in new_urls:
            try:
                await page.goto(url, timeout=30_000, wait_until="domcontentloaded")
                html = await page.content()
                interactive = is_interactive(html, source.get("interactivity_signals", []))
                items.append({"url": url, "html": html, "is_interactive": interactive})
            except PWTimeout:
                continue

        await browser.close()
    return items


async def _extract_urls_from_landing(page, source: dict) -> list[str]:
    """Extract URLs using source.selectors.item, return absolute deduplicated list."""
    hrefs = await page.eval_on_selector_all(
        source["selectors"]["item"],
        "els => els.map(e => e.getAttribute('href')).filter(Boolean)",
    )
    base = source["graphics_url"]
    out, seen = [], set()
    for h in hrefs:
        abs_url, _ = urldefrag(urljoin(base, h))
        if abs_url not in seen:
            seen.add(abs_url)
            out.append(abs_url)
    return out


async def crawl_all(sources: list[dict], state: dict, max_parallel: int = 5) -> dict[str, list[dict]]:
    """Crawl all sources in parallel batches. Returns {slug: [items]}."""
    sem = asyncio.Semaphore(max_parallel)

    async def _one(s):
        async with sem:
            storage = None
            if s.get("storage_state"):
                from tools.veille_presse.paths import REPO
                storage = REPO / ".claude" / "skills" / "veille-presse-visuelle" / s["storage_state"]
            return s["slug"], await crawl_source(s, state, storage)

    results = await asyncio.gather(*[_one(s) for s in sources], return_exceptions=True)
    out = {}
    for r in results:
        if isinstance(r, Exception):
            continue
        slug, items = r
        out[slug] = items
    return out
```

- [ ] **Step 3.5: Run tests, expect PASS**

```bash
playwright install chromium  # premier run uniquement
python -m unittest tests.test_veille_presse.test_crawler -v
```

Expected: 6 tests pass. Le test `extract_urls_with_selector` lance un vrai Chromium headless (~3s).

- [ ] **Step 3.6: Commit**

```bash
git add tools/veille_presse/crawler.py tests/test_veille_presse/test_crawler.py tests/test_veille_presse/fixtures/nytimes-graphics-landing.html
git commit -m "veille: Playwright crawler + scoring + shortlist"
```

---

## Task 4: `sources.yml` — populate with 30 sources + selectors per source

**Files:**
- Modify: `.claude/skills/veille-presse-visuelle/sources.yml`

- [ ] **Step 4.1: Renseigner les 30 sources avec sélecteurs vérifiés**

Pour chaque source, sélecteurs identifiés via DevTools sur leur landing page courante. **Pour les paywalls**, ne pas activer `storage_state` avant Task 14 (build-storage-state). Préparer le YAML mais le path peut être absent — le validator l'exigera seulement pour les paywalls.

Workaround pour faire passer le validator sans storage_state encore : mettre `paywall: false` temporairement sur tous, puis Task 14 mettra à jour. **Alternative préférée** : adapter `_validate_source` pour rendre `storage_state` optionnel (la skill skip la source à la capture si manquant). Choisir l'alternative — modifier `sources.py` `_validate_source` pour retirer le `if s.get("paywall") and not s.get("storage_state")` (et son test associé), remplacer par un warning au load. Voir Step 4.2.

`.claude/skills/veille-presse-visuelle/sources.yml` :
```yaml
# Registre source de vérité pour la veille presse.
# Édition manuelle. Validation au chargement (cf. tools/veille_presse/sources.py).
#
# Champs :
#   name, slug, graphics_url, weight, selectors.item (requis)
#   paywall, storage_state, selectors.{title,author,published},
#   interactivity_signals, twitter_handles, blocked (optionnels)

# === Quotidiens dataviz US/UK ===
- name: The New York Times
  slug: nyt
  graphics_url: https://www.nytimes.com/spotlight/graphics
  paywall: true
  weight: 10
  storage_state: state/storage-state/nyt.json
  selectors:
    item: "section ol li a[href*='/interactive/'], section ol li a[href*='/spotlight/']"
    title: "h1[data-test-id='headline'], h1"
    author: "p[data-test-id='byline'], .byline, [itemprop='author']"
    published: "time[datetime]"
  interactivity_signals: [d3, scrollama, observable, mapbox]
  twitter_handles: [nytgraphics, upshotnyt]

- name: Washington Post
  slug: wapo
  graphics_url: https://www.washingtonpost.com/graphics/
  paywall: true
  weight: 10
  storage_state: state/storage-state/wapo.json
  selectors:
    item: "a[href*='/graphics/'], a[href*='/interactive/']"
    title: "h1"
    author: ".author-name, [data-qa='author-name']"
    published: "time[datetime]"
  interactivity_signals: [d3, scrollama, mapbox]

- name: Bloomberg Graphics
  slug: bloomberg
  graphics_url: https://www.bloomberg.com/graphics
  paywall: true
  weight: 10
  storage_state: state/storage-state/bloomberg.json
  selectors:
    item: "a[href*='/graphics/'], a[href*='/features/']"
    title: "h1"
    author: ".byline, [data-component='byline']"
    published: "time[datetime]"
  interactivity_signals: [d3, scrollama, mapbox]

- name: Reuters Graphics
  slug: reuters
  graphics_url: https://www.reuters.com/graphics/
  paywall: false
  weight: 10
  selectors:
    item: "a[href*='/graphics/']"
    title: "h1"
    author: ".author-name, .ArticleHeader-author"
    published: "time[datetime]"
  interactivity_signals: [d3, scrollama]

- name: Financial Times
  slug: ft
  graphics_url: https://www.ft.com/visual-and-data-journalism
  paywall: true
  weight: 9
  storage_state: state/storage-state/ft.json
  selectors:
    item: "a.js-teaser-heading-link[href*='/content/']"
    title: ".article-header__title, h1"
    author: ".n-content-tag--author, .o-typography-link"
    published: "time[datetime]"
  interactivity_signals: [d3, scrollama]

- name: LA Times
  slug: latimes
  graphics_url: https://www.latimes.com/projects
  paywall: false
  weight: 7
  selectors:
    item: "a.promo-title-link, a[href*='/projects/']"
    title: "h1"
    author: ".author-list .author-name"
    published: "time[datetime]"
  interactivity_signals: [d3, scrollama]

- name: WSJ Graphics
  slug: wsj
  graphics_url: https://www.wsj.com/news/types/graphics
  paywall: true
  weight: 9
  storage_state: state/storage-state/wsj.json
  selectors:
    item: "a[href*='/articles/'], a[href*='/graphics/']"
    title: "h1"
    author: ".byline, [data-byline-name]"
    published: "time[datetime]"
  interactivity_signals: [d3, scrollama]

# === Quotidiens FR ===
- name: Le Monde — Les Décodeurs
  slug: lemonde
  graphics_url: https://www.lemonde.fr/les-decodeurs/
  paywall: true
  weight: 9
  storage_state: state/storage-state/lemonde.json
  selectors:
    item: "a[href*='/les-decodeurs/article/']"
    title: "h1.article__title"
    author: ".meta__authors, .author__name"
    published: "span.meta__date, time[datetime]"
  interactivity_signals: [d3, scrollama]

- name: Le Figaro — Fig Data
  slug: lefigaro
  graphics_url: https://www.lefigaro.fr/data
  paywall: true
  weight: 8
  storage_state: state/storage-state/lefigaro.json
  selectors:
    item: "a[href*='/fig-data/'], a.fig-link[href]"
    title: "h1.fig-headline"
    author: ".fig-content-metas__author, .fig-author"
    published: "time[datetime]"
  interactivity_signals: [d3]

- name: Libération
  slug: liberation
  graphics_url: https://www.liberation.fr/checknews/
  paywall: true
  weight: 6
  storage_state: state/storage-state/liberation.json
  selectors:
    item: "a[href*='/checknews/']"
    title: "h1"
    author: ".author-name"
    published: "time[datetime]"
  interactivity_signals: [d3]

- name: Le Parisien — Data
  slug: leparisien
  graphics_url: https://www.leparisien.fr/data/
  paywall: true
  weight: 5
  storage_state: state/storage-state/leparisien.json
  selectors:
    item: "a[href*='/data/']"
    title: "h1"
    author: ".author-name"
    published: "time[datetime]"
  interactivity_signals: [d3]

# === International ===
- name: Folha de São Paulo
  slug: folha
  graphics_url: https://www1.folha.uol.com.br/infograficos/
  paywall: true
  weight: 8
  storage_state: state/storage-state/folha.json
  selectors:
    item: "a[href*='/infograficos/'], a[href*='/multimidia/']"
    title: "h1"
    author: ".c-signature__author"
    published: "time[datetime]"
  interactivity_signals: [d3, scrollama]

- name: SCMP
  slug: scmp
  graphics_url: https://multimedia.scmp.com/
  paywall: false
  weight: 7
  selectors:
    item: "a[href*='infographics']"
    title: "h1"
    author: ".author"
    published: "time[datetime]"
  interactivity_signals: [d3, scrollama]

- name: RTVE
  slug: rtve
  graphics_url: https://www.rtve.es/noticias/datos/
  paywall: false
  weight: 6
  selectors:
    item: "a[href*='/noticias/']"
    title: "h1"
    author: ".author"
    published: "time[datetime]"
  interactivity_signals: [d3]

- name: El País
  slug: elpais
  graphics_url: https://elpais.com/especiales/
  paywall: true
  weight: 7
  storage_state: state/storage-state/elpais.json
  selectors:
    item: "a[href*='/especiales/']"
    title: "h1"
    author: ".a_md_a"
    published: "time[datetime]"
  interactivity_signals: [d3]

- name: ZEIT Online
  slug: zeit
  graphics_url: https://www.zeit.de/serie/data
  paywall: true
  weight: 7
  storage_state: state/storage-state/zeit.json
  selectors:
    item: "a[href*='/data/']"
    title: "h1"
    author: ".byline__author"
    published: "time[datetime]"
  interactivity_signals: [d3]

- name: Nikkei Asia
  slug: nikkei
  graphics_url: https://asia.nikkei.com/Spotlight
  paywall: true
  weight: 6
  storage_state: state/storage-state/nikkei.json
  selectors:
    item: "a[href*='/Spotlight/']"
    title: "h1"
    author: ".meta__author"
    published: "time[datetime]"
  interactivity_signals: [d3]

# === Magazines / mensuels ===
- name: The Economist
  slug: economist
  graphics_url: https://www.economist.com/graphic-detail
  paywall: true
  weight: 9
  storage_state: state/storage-state/economist.json
  selectors:
    item: "a[href*='/graphic-detail/']"
    title: "h1"
    author: ".author"
    published: "time[datetime]"
  interactivity_signals: [d3]

- name: The Atlantic
  slug: atlantic
  graphics_url: https://www.theatlantic.com/projects/
  paywall: true
  weight: 7
  storage_state: state/storage-state/atlantic.json
  selectors:
    item: "a[href*='/projects/']"
    title: "h1"
    author: ".author"
    published: "time[datetime]"
  interactivity_signals: [d3]

# === Long-form / mag dataviz ===
- name: The Pudding
  slug: pudding
  graphics_url: https://pudding.cool/
  paywall: false
  weight: 9
  selectors:
    item: "a.story-link, a[href*='/2026/'], a[href*='/2025/']"
    title: "h1"
    author: ".byline a"
    published: "time[datetime]"
  interactivity_signals: [d3, scrollama, observable]

- name: ProPublica
  slug: propublica
  graphics_url: https://www.propublica.org/series
  paywall: false
  weight: 8
  selectors:
    item: "a.story-card-headline, a[href*='/article/']"
    title: "h1"
    author: ".article-byline a"
    published: "time[datetime]"
  interactivity_signals: [d3, scrollama]

- name: The Markup
  slug: markup
  graphics_url: https://themarkup.org/
  paywall: false
  weight: 7
  selectors:
    item: "a.story-card-headline, a[href*='/series/']"
    title: "h1"
    author: ".author"
    published: "time[datetime]"
  interactivity_signals: [d3]

- name: BBC Visual Journalism
  slug: bbc
  graphics_url: https://www.bbc.com/news/in_pictures
  paywall: false
  weight: 8
  selectors:
    item: "a[href*='/news/'][href*='-pictures'], a[href*='/news/extra/']"
    title: "h1"
    author: ".ssrcss-68pt20-Text-TextContributorName"
    published: "time[datetime]"
  interactivity_signals: [d3, scrollama]

# === Recherche / think tanks ===
- name: Pew Research Center
  slug: pew
  graphics_url: https://www.pewresearch.org/short-reads/
  paywall: false
  weight: 7
  selectors:
    item: "a.post-title, a[href*='/short-reads/']"
    title: "h1"
    author: ".author"
    published: "time[datetime]"
  interactivity_signals: [d3]

- name: PNAS
  slug: pnas
  graphics_url: https://www.pnas.org/
  paywall: false
  weight: 5
  selectors:
    item: "a[href*='/doi/']"
    title: "h1"
    author: ".loa-author-name"
    published: "time[datetime]"
  interactivity_signals: []

- name: UNEP
  slug: unep
  graphics_url: https://www.unep.org/resources
  paywall: false
  weight: 5
  selectors:
    item: "a[href*='/resources/']"
    title: "h1"
    author: ""
    published: "time[datetime]"
  interactivity_signals: []

- name: Our World in Data
  slug: owid
  graphics_url: https://ourworldindata.org/latest
  paywall: false
  weight: 7
  selectors:
    item: "a[href*='/grapher/'], a[href*='/explorers/']"
    title: "h1"
    author: ".authors-byline"
    published: "time[datetime]"
  interactivity_signals: [d3]

# === Plateformes / showcases ===
- name: Datawrapper River
  slug: datawrapper
  graphics_url: https://www.datawrapper.de/blog/category/showcase
  paywall: false
  weight: 6
  selectors:
    item: "a.entry-title-link, a[href*='/blog/']"
    title: "h1"
    author: ".byline a"
    published: "time[datetime]"
  interactivity_signals: []

- name: Observable Featured
  slug: observable
  graphics_url: https://observablehq.com/explore
  paywall: false
  weight: 6
  selectors:
    item: "a[href*='/@']"
    title: "h1"
    author: ".author"
    published: "time[datetime]"
  interactivity_signals: [observable, d3]

- name: FlowingData
  slug: flowingdata
  graphics_url: https://flowingdata.com/category/visualization/
  paywall: false
  weight: 5
  selectors:
    item: "h2.entry-title a"
    title: "h1.entry-title"
    author: ".author a"
    published: "time[datetime]"
  interactivity_signals: []
```

- [ ] **Step 4.2: Adapter `_validate_source` pour rendre `storage_state` non bloquant**

Modifier `tools/veille_presse/sources.py` :
```python
def _validate_source(s: dict) -> None:
    for field in REQUIRED_FIELDS:
        if field not in s:
            raise SourceConfigError(f"source {s.get('slug', '?')} missing field '{field}'")
    if not isinstance(s["selectors"], dict):
        raise SourceConfigError(f"source {s['slug']} 'selectors' must be a dict")
    for sel in REQUIRED_SELECTORS:
        if sel not in s["selectors"]:
            raise SourceConfigError(f"source {s['slug']} 'selectors.{sel}' is required")
    # storage_state non bloquant : si paywall + pas de storage_state,
    # le crawl/capture skipperont la source au runtime (cf. crawler.crawl_source
    # qui ne charge storage_state que s'il existe).
```

Et adapter le test `test_load_validates_required_fields` qui contient un cas paywall — supprimer l'assertion paywall+storage_state. **Aussi supprimer le test inutile devenu (le scenario "paywall sans storage_state" n'est plus une erreur).** Modifier `test_sources.py` Step 2.2 → garder seulement les 3 premiers tests de TestSourcesLoader (test_load_returns_list_of_dicts, test_load_validates_required_fields adapté pour tester un autre champ manquant comme `weight`, test_load_rejects_duplicate_slugs).

`test_load_validates_required_fields` version adaptée :
```python
def test_load_validates_required_fields(self):
    bad = {"name": "Bad", "slug": "bad", "graphics_url": "http://a"}  # missing weight, selectors
    with self.assertRaises(srcmod.SourceConfigError):
        srcmod._validate_source(bad)
```

- [ ] **Step 4.3: Tester le chargement du YAML réel**

Ajouter à `test_sources.py` :
```python
class TestRealSourcesYml(unittest.TestCase):
    def test_real_sources_yml_loads(self):
        from tools.veille_presse.paths import SOURCES_YML
        sources = srcmod.load_sources(SOURCES_YML)
        self.assertGreaterEqual(len(sources), 25)
        slugs = [s["slug"] for s in sources]
        for required in ["nyt", "wapo", "bloomberg", "reuters", "lemonde", "pudding"]:
            self.assertIn(required, slugs)
```

Run :
```bash
python -m unittest tests.test_veille_presse.test_sources -v
```

Expected : tous les tests passent, le real_sources_yml_loads charge bien 30 sources.

- [ ] **Step 4.4: Commit**

```bash
git add .claude/skills/veille-presse-visuelle/sources.yml tools/veille_presse/sources.py tests/test_veille_presse/test_sources.py
git commit -m "veille: populate sources.yml (30 sources) + storage_state non-blocking"
```

---

## Task 5: `metadata.py` — title/authors/date + tags heuristic

**Files:**
- Create: `tools/veille_presse/metadata.py`
- Create: `tests/test_veille_presse/test_metadata.py`
- Create: `tests/test_veille_presse/fixtures/nytimes-article.html`

- [ ] **Step 5.1: Capturer une fixture article réelle**

Idem Step 3.1 : sauvegarder un HTML d'article NYT interactive dans `tests/test_veille_presse/fixtures/nytimes-article.html`. Si pas accessible :

```html
<!DOCTYPE html><html><body>
<h1>How Heat Is Reshaping Cities</h1>
<p class="byline">By <a>Jane Doe</a> and <a>John Smith</a></p>
<time datetime="2026-05-15T08:00:00-04:00">May 15, 2026</time>
<svg><g class="hexbin"></g></svg>
<script src="https://d3js.org/d3.v7.min.js"></script>
<div class="scrollytelling-step"></div>
</body></html>
```

- [ ] **Step 5.2: Écrire les tests qui échouent**

`tests/test_veille_presse/test_metadata.py` :
```python
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
```

- [ ] **Step 5.3: Run tests, observe failure**

```bash
python -m unittest tests.test_veille_presse.test_metadata -v
```

Expected: fail on `metadata.extract` and `metadata.detect_tags`.

- [ ] **Step 5.4: Implémenter `metadata.py`**

`tools/veille_presse/metadata.py` :
```python
"""Article metadata extraction via Playwright + tags heuristics."""
import asyncio
import re
from typing import Optional

from playwright.async_api import async_playwright


TAG_PATTERNS = {
    "voronoi": [r'<pattern[^>]+id=["\']?voronoi', r'class=["\'][^"\']*voronoi'],
    "cartogram": [r'<g[^>]+class=["\'][^"\']*hexbin', r'class=["\'][^"\']*cartogram'],
    "heatmap": [r'class=["\'][^"\']*heat[-_]?map', r'<g[^>]+class=["\'][^"\']*heatmap'],
    "hemicycle": [r'class=["\'][^"\']*hemicycle'],
    "scrollytelling": [
        r'class=["\'][^"\']*scrollytelling',
        r'data-scrollama',
        r'class=["\'][^"\']*scrolly[-_]',
        r'<script[^>]+src=["\'][^"\']*scrollama',
    ],
    "treemap": [r'class=["\'][^"\']*treemap'],
    "bertin": [r'class=["\'][^"\']*bertin', r'<!--\s*bertin'],
    "network": [r'class=["\'][^"\']*network[-_]graph', r'class=["\'][^"\']*force[-_]graph'],
    "map": [
        r'<script[^>]+src=["\'][^"\']*mapbox',
        r'<script[^>]+src=["\'][^"\']*leaflet',
        r'class=["\'][^"\']*mapboxgl',
    ],
    "opening": [r'class=["\'][^"\']*hero[-_]', r'class=["\'][^"\']*opening'],
}


def detect_tags(html: str) -> list[str]:
    """Heuristic tag detection from raw HTML. Returns deduped list."""
    found = []
    for tag, patterns in TAG_PATTERNS.items():
        for pat in patterns:
            if re.search(pat, html, re.IGNORECASE):
                found.append(tag)
                break
    return found


def extract(html: str, selectors: dict) -> dict:
    """Extract title, authors (list), published (ISO str) from HTML via Playwright DOM.
    Falls back to None for missing fields. Returns dict.
    """
    return asyncio.run(_extract_async(html, selectors))


async def _extract_async(html: str, selectors: dict) -> dict:
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await (await browser.new_context()).new_page()
        await page.set_content(html)

        async def text_of(sel: Optional[str]) -> Optional[str]:
            if not sel:
                return None
            try:
                el = await page.query_selector(sel)
                if el is None:
                    return None
                return (await el.inner_text()).strip()
            except Exception:
                return None

        title = await text_of(selectors.get("title"))

        authors: list[str] = []
        author_sel = selectors.get("author")
        if author_sel:
            try:
                els = await page.query_selector_all(author_sel)
                for el in els:
                    txt = (await el.inner_text()).strip()
                    if txt:
                        for piece in re.split(r"\s+and\s+|,|;|\set\s", txt):
                            piece = piece.strip().lstrip("By ").lstrip("by ").strip()
                            if piece and piece not in authors:
                                authors.append(piece)
            except Exception:
                pass

        published = None
        pub_sel = selectors.get("published")
        if pub_sel:
            try:
                el = await page.query_selector(pub_sel)
                if el is not None:
                    published = await el.get_attribute("datetime")
            except Exception:
                pass

        await browser.close()

    return {
        "title": title or "",
        "authors": authors,
        "published": published or "",
    }
```

- [ ] **Step 5.5: Run tests, expect PASS**

```bash
python -m unittest tests.test_veille_presse.test_metadata -v
```

Expected: 8 tests pass.

- [ ] **Step 5.6: Commit**

```bash
git add tools/veille_presse/metadata.py tests/test_veille_presse/test_metadata.py tests/test_veille_presse/fixtures/nytimes-article.html
git commit -m "veille: article metadata extraction + tags heuristic"
```

---

## Task 6: `capture.py` — screenshots full-page + sections

**Files:**
- Create: `tools/veille_presse/capture.py`
- Create: `tests/test_veille_presse/test_capture.py`

- [ ] **Step 6.1: Écrire les tests qui échouent (smoke)**

`tests/test_veille_presse/test_capture.py` :
```python
"""Smoke tests for capture.py — requires Playwright + ffmpeg installed."""
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

from tools.veille_presse import capture


# Mini HTML servi en data: URL (pas besoin de serveur)
SAMPLE_HTML = """
<!DOCTYPE html><html><body>
<h1 id="hero">Hero</h1>
<section id="chart-1"><svg width="200" height="100"><rect width="200" height="100" fill="blue"/></svg></section>
<section id="chart-2"><svg width="200" height="100"><rect width="200" height="100" fill="red"/></svg></section>
<div style="height: 2000px"></div>
</body></html>
"""


class TestScreenshots(unittest.TestCase):
    def test_full_page_screenshot(self):
        with TemporaryDirectory() as td:
            out = Path(td) / "fullpage.png"
            capture.screenshot_full_page_from_html(SAMPLE_HTML, out)
            self.assertTrue(out.exists())
            self.assertGreater(out.stat().st_size, 1000)

    def test_section_screenshots(self):
        with TemporaryDirectory() as td:
            out_dir = Path(td)
            paths = capture.screenshot_sections_from_html(
                SAMPLE_HTML, out_dir, slug="test", max_sections=5
            )
            self.assertGreaterEqual(len(paths), 1)
            for p in paths:
                self.assertTrue(p.exists())


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 6.2: Run, expect failure**

```bash
python -m unittest tests.test_veille_presse.test_capture -v
```

Expected: fail on `capture.screenshot_full_page_from_html` and `screenshot_sections_from_html`.

- [ ] **Step 6.3: Implémenter `capture.py` (partie screenshots)**

`tools/veille_presse/capture.py` :
```python
"""Screenshot + GIF/MP4 capture pipeline."""
import asyncio
import re
import subprocess
import tempfile
from pathlib import Path
from typing import Optional

from playwright.async_api import async_playwright, Browser, BrowserContext, Page


GIF_CAP_BYTES = 6 * 1024 * 1024  # 6 Mo
MP4_CAP_BYTES = 8 * 1024 * 1024  # 8 Mo

# Section selectors used to detect "chart-like" blocks for individual screenshots
SECTION_SELECTORS = [
    "figure",
    "section[id]",
    "div.chart",
    "div.figure",
    "div[class*='dataviz']",
    "div[class*='infographic']",
]


def _slugify(text: str) -> str:
    """Build a filesystem-safe slug fragment from arbitrary text."""
    text = re.sub(r"[^\w\s-]", "", text.lower())
    text = re.sub(r"[-\s]+", "-", text).strip("-")
    return text[:40] or "section"


def screenshot_full_page_from_html(html: str, out_path: Path) -> None:
    """Sync wrapper: render HTML, save full-page screenshot."""
    asyncio.run(_screenshot_full_page_async(html, out_path))


async def _screenshot_full_page_async(html: str, out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx = await browser.new_context(viewport={"width": 1200, "height": 800})
        page = await ctx.new_page()
        await page.set_content(html, wait_until="load")
        await page.screenshot(path=str(out_path), full_page=True)
        await browser.close()


def screenshot_sections_from_html(
    html: str, out_dir: Path, slug: str, max_sections: int = 5
) -> list[Path]:
    """Sync wrapper: detect sections, save one PNG per matched element (up to max_sections)."""
    return asyncio.run(_screenshot_sections_async(html, out_dir, slug, max_sections))


async def _screenshot_sections_async(
    html: str, out_dir: Path, slug: str, max_sections: int
) -> list[Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    paths: list[Path] = []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx = await browser.new_context(viewport={"width": 1200, "height": 800})
        page = await ctx.new_page()
        await page.set_content(html, wait_until="load")

        for sel in SECTION_SELECTORS:
            if len(paths) >= max_sections:
                break
            els = await page.query_selector_all(sel)
            for el in els:
                if len(paths) >= max_sections:
                    break
                # Skip too-small or hidden elements
                box = await el.bounding_box()
                if box is None or box["width"] < 100 or box["height"] < 60:
                    continue
                # Derive filename
                el_id = await el.get_attribute("id")
                name = _slugify(el_id) if el_id else f"sect-{len(paths)+1}"
                out = out_dir / f"{slug}-{name}.png"
                try:
                    await el.screenshot(path=str(out))
                    paths.append(out)
                except Exception:
                    continue
        await browser.close()
    return paths


# === GIF / MP4 capture (Task 7) ===
# Implemented next.
```

- [ ] **Step 6.4: Run, expect PASS**

```bash
python -m unittest tests.test_veille_presse.test_capture -v
```

Expected: 2 tests pass.

- [ ] **Step 6.5: Commit**

```bash
git add tools/veille_presse/capture.py tests/test_veille_presse/test_capture.py
git commit -m "veille: capture screenshots full-page + sections"
```

---

## Task 7: `capture.py` — GIF capture + MP4 fallback (ffmpeg)

**Files:**
- Modify: `tools/veille_presse/capture.py`
- Modify: `tests/test_veille_presse/test_capture.py`

- [ ] **Step 7.1: Vérifier que ffmpeg est installé**

```bash
ffmpeg -version
```

Si absent : `winget install ffmpeg` (Windows) ou via le package manager OS. Documenter dans `tools/veille_presse/README.md` que ffmpeg est requis.

- [ ] **Step 7.2: Étendre le test capture**

Ajouter dans `tests/test_veille_presse/test_capture.py` :
```python
class TestGifCapture(unittest.TestCase):
    def test_gif_capture_produces_file(self):
        scroll_html = """
        <!DOCTYPE html><html><body style="margin:0">
        <div style="height: 3000px; background: linear-gradient(red, blue);"></div>
        </body></html>
        """
        with TemporaryDirectory() as td:
            out = Path(td) / "scroll.gif"
            result = capture.capture_interaction_gif_from_html(
                scroll_html, out, duration_s=2, fps=5
            )
            self.assertEqual(result["format"], "gif")
            self.assertTrue(out.exists())
            self.assertLess(out.stat().st_size, capture.GIF_CAP_BYTES)
```

- [ ] **Step 7.3: Run, expect failure**

```bash
python -m unittest tests.test_veille_presse.test_capture.TestGifCapture -v
```

Expected: `AttributeError: capture_interaction_gif_from_html`.

- [ ] **Step 7.4: Compléter `capture.py` avec GIF/MP4**

Ajouter à `tools/veille_presse/capture.py` :
```python
def capture_interaction_gif_from_html(
    html: str, out_path: Path, duration_s: int = 8, fps: int = 10, width: int = 1000
) -> dict:
    """Capture frames via Playwright scroll, encode GIF via ffmpeg.

    Returns {"format": "gif" | "mp4" | "skipped", "size_bytes": int}.

    Fallback ladder:
      1. Try GIF at width=1000 → if <= GIF_CAP_BYTES, return GIF.
      2. Re-encode at width=800 → if <= GIF_CAP_BYTES, return GIF.
      3. Encode MP4 H.264 → if <= MP4_CAP_BYTES, return MP4.
      4. Otherwise, delete output and return {"format": "skipped"}.
    """
    asyncio.run(_capture_frames_async(html, out_path.parent, duration_s, fps, width))
    frames_dir = out_path.parent / f"_frames_{out_path.stem}"

    # Try GIF at requested width
    _encode_gif(frames_dir, out_path, fps, width)
    if out_path.stat().st_size <= GIF_CAP_BYTES:
        _cleanup_frames(frames_dir)
        return {"format": "gif", "size_bytes": out_path.stat().st_size}

    # Re-encode GIF at 800px
    _encode_gif(frames_dir, out_path, fps, 800)
    if out_path.stat().st_size <= GIF_CAP_BYTES:
        _cleanup_frames(frames_dir)
        return {"format": "gif", "size_bytes": out_path.stat().st_size}

    # Fallback to MP4
    mp4_out = out_path.with_suffix(".mp4")
    _encode_mp4(frames_dir, mp4_out, fps)
    if mp4_out.stat().st_size <= MP4_CAP_BYTES:
        out_path.unlink(missing_ok=True)
        _cleanup_frames(frames_dir)
        return {"format": "mp4", "size_bytes": mp4_out.stat().st_size}

    # Skip
    out_path.unlink(missing_ok=True)
    mp4_out.unlink(missing_ok=True)
    _cleanup_frames(frames_dir)
    return {"format": "skipped", "size_bytes": 0}


async def _capture_frames_async(
    html: str, work_dir: Path, duration_s: int, fps: int, width: int
) -> None:
    frames_dir = work_dir / "_frames_capture"
    frames_dir.mkdir(parents=True, exist_ok=True)
    n_frames = duration_s * fps

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx = await browser.new_context(viewport={"width": width, "height": 700})
        page = await ctx.new_page()
        await page.set_content(html, wait_until="load")
        scroll_height = await page.evaluate("document.body.scrollHeight")
        viewport_height = 700
        max_scroll = max(0, scroll_height - viewport_height)

        for i in range(n_frames):
            y = int((i / max(1, n_frames - 1)) * max_scroll)
            await page.evaluate(f"window.scrollTo(0, {y})")
            await page.wait_for_timeout(50)  # let layout settle
            await page.screenshot(path=str(frames_dir / f"frame_{i:04d}.png"))
        await browser.close()


def _encode_gif(frames_dir: Path, out_path: Path, fps: int, width: int) -> None:
    """ffmpeg: PNG frames → GIF with palette generation for smaller size."""
    palette = frames_dir / "palette.png"
    subprocess.run(
        ["ffmpeg", "-y", "-framerate", str(fps), "-i", str(frames_dir / "frame_%04d.png"),
         "-vf", f"scale={width}:-1:flags=lanczos,palettegen", str(palette)],
        check=True, capture_output=True,
    )
    subprocess.run(
        ["ffmpeg", "-y", "-framerate", str(fps), "-i", str(frames_dir / "frame_%04d.png"),
         "-i", str(palette),
         "-filter_complex", f"[0:v]scale={width}:-1:flags=lanczos[x];[x][1:v]paletteuse",
         str(out_path)],
        check=True, capture_output=True,
    )


def _encode_mp4(frames_dir: Path, out_path: Path, fps: int) -> None:
    """ffmpeg: PNG frames → H.264 MP4."""
    subprocess.run(
        ["ffmpeg", "-y", "-framerate", str(fps), "-i", str(frames_dir / "frame_%04d.png"),
         "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "23",
         "-vf", "pad=ceil(iw/2)*2:ceil(ih/2)*2",
         str(out_path)],
        check=True, capture_output=True,
    )


def _cleanup_frames(frames_dir: Path) -> None:
    """Best-effort frame cleanup."""
    if not frames_dir.exists():
        return
    for f in frames_dir.iterdir():
        try:
            f.unlink()
        except Exception:
            pass
    try:
        frames_dir.rmdir()
    except Exception:
        pass
```

Note: `_capture_frames_async` écrit dans `work_dir / "_frames_capture"` mais le code public attend `_frames_<stem>`. **Harmoniser : changer `_capture_frames_async` pour utiliser `_frames_<stem>` aussi.** Modif :

```python
async def _capture_frames_async(
    html: str, frames_dir: Path, duration_s: int, fps: int, width: int
) -> None:
    frames_dir.mkdir(parents=True, exist_ok=True)
    # ... reste identique
```

Et dans `capture_interaction_gif_from_html`, passer le bon dir :
```python
frames_dir = out_path.parent / f"_frames_{out_path.stem}"
asyncio.run(_capture_frames_async(html, frames_dir, duration_s, fps, width))
```

- [ ] **Step 7.5: Run, expect PASS**

```bash
python -m unittest tests.test_veille_presse.test_capture.TestGifCapture -v
```

Expected: 1 test pass (durée ~5-10s à cause de la capture et de l'encodage).

- [ ] **Step 7.6: Commit**

```bash
git add tools/veille_presse/capture.py tests/test_veille_presse/test_capture.py
git commit -m "veille: GIF capture (scroll + ffmpeg) + MP4 fallback"
```

---

## Task 8: `output.py` — notes.md generator

**Files:**
- Create: `tools/veille_presse/output.py`
- Create: `tests/test_veille_presse/test_output.py`
- Create: `tests/test_veille_presse/fixtures/expected-notes.md`

- [ ] **Step 8.1: Écrire la fixture attendue**

`tests/test_veille_presse/fixtures/expected-notes.md` :
```markdown
# The New York Times
## How Heat Is Reshaping Cities
https://www.nytimes.com/interactive/2026/05/15/climate/heat-map.html by Jane Doe, John Smith
#scrollytelling #map
![](nyt-how-heat-is-reshaping-cities-fullpage.png)
![](nyt-how-heat-is-reshaping-cities-chart-1.png)
![](nyt-how-heat-is-reshaping-cities-interaction.gif)

# Bloomberg Graphics
## The Wall Street Story
https://www.bloomberg.com/graphics/2026/wall-street.html by Editor X
#cartogram
![](bloomberg-the-wall-street-story-fullpage.png)
```

- [ ] **Step 8.2: Écrire les tests**

`tests/test_veille_presse/test_output.py` :
```python
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
```

- [ ] **Step 8.3: Run, expect failure**

```bash
python -m unittest tests.test_veille_presse.test_output -v
```

Expected: fail on `output.render_notes_md`.

- [ ] **Step 8.4: Implémenter notes.md generator dans `output.py`**

`tools/veille_presse/output.py` :
```python
"""Notes.md + HTML rendering for veille-presse editions."""
from collections import defaultdict


def render_notes_md(edition: dict) -> str:
    """Build notes.md content matching the historical Obsidian format.

    edition shape:
      {
        "date": "YYYY-MM-DD",
        "title_draft": str,
        "items": [ {source, source_slug, title, url, authors, twitter_handles,
                    tags, score, images}, ... ],
        "captures_impossibles": [ {source, title, url, authors}, ... ],
      }
    """
    # Group items by source, preserve order (highest score first within each)
    by_source: dict[str, list[dict]] = defaultdict(list)
    for item in edition["items"]:
        by_source[item["source"]].append(item)

    # Sort source groups by max score within
    source_order = sorted(
        by_source.keys(),
        key=lambda s: -max(i["score"] for i in by_source[s]),
    )

    lines: list[str] = []
    for src in source_order:
        lines.append(f"# {src}")
        for item in by_source[src]:
            lines.append(f"## {item['title']}")
            byline = item["url"]
            if item["authors"]:
                byline += " by " + ", ".join(item["authors"])
            for h in item.get("twitter_handles", []):
                byline += f" @{h}"
            lines.append(byline)
            if item["tags"]:
                lines.append(" ".join(f"#{t}" for t in item["tags"]))
            for img in item["images"]:
                lines.append(f"![]({img})")
            lines.append("")  # blank between items

    # Captures impossibles
    if edition.get("captures_impossibles"):
        lines.append("# Captures impossibles")
        for c in edition["captures_impossibles"]:
            lines.append(f"## {c['title']}")
            byline = c["url"]
            if c.get("authors"):
                byline += " by " + ", ".join(c["authors"])
            lines.append(byline)
            lines.append("_storage_state expirée ou capture en échec._")
            lines.append("")

    return "\n".join(lines).strip() + "\n"
```

- [ ] **Step 8.5: Run, expect PASS**

```bash
python -m unittest tests.test_veille_presse.test_output -v
```

Expected: 3 tests pass.

- [ ] **Step 8.6: Commit**

```bash
git add tools/veille_presse/output.py tests/test_veille_presse/test_output.py tests/test_veille_presse/fixtures/expected-notes.md
git commit -m "veille: notes.md generator (Obsidian format préservé)"
```

---

## Task 9: HTML templates — edition + hub

**Files:**
- Create: `.claude/skills/veille-presse-visuelle/assets/edition-template.html`
- Create: `.claude/skills/veille-presse-visuelle/assets/hub-template.html`

- [ ] **Step 9.1: Vérifier le pattern de page dans le repo**

Regarder une page existante pour le pattern topbar+head+layout :
```bash
head -60 fabrique-agent/index.html
```

Identifier exactement : favicon link, fonts Google, vars CSS racines, topbar 3-items markup.

- [ ] **Step 9.2: Écrire `edition-template.html` avec placeholders `{{...}}`**

`.claude/skills/veille-presse-visuelle/assets/edition-template.html` (extrait — version complète à intégrer en respectant CLAUDE.md du repo) :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#faf6ec">
<title>{{TITLE_DRAFT}} — Veille presse · semaine du {{DATE_LONG}}</title>
<meta name="description" content="{{TITLE_DRAFT}} — {{N_ITEMS}} pièces de presse dataviz repérées la semaine du {{DATE_LONG}}.">
<!-- og:start -->
<!-- og:end -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400;1,9..144,500&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #faf6ec; --bg-2: #f3eedf; --surface: #ffffff;
  --line: rgba(30,30,44,0.08); --line-strong: rgba(30,30,44,0.20);
  --text: #1e1e2a; --text-mid: #6b6f7c; --text-faint: #9a9ca5;
  --accent: #b8582e;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: var(--bg); color: var(--text);
  font-family: 'Inter', sans-serif; font-weight: 300; line-height: 1.55;
  -webkit-font-smoothing: antialiased; overflow-x: hidden;
}
body { padding-top: 56px; min-height: 100vh; }
.topbar {
  position: fixed; top: 0; left: 0; right: 0; height: 56px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 28px; background: rgba(250,246,236,0.85);
  backdrop-filter: blur(10px); border-bottom: 1px solid var(--line);
  z-index: 60;
}
.topbar a { color: var(--text); text-decoration: none; font-family: 'Fraunces', serif; }
.topbar .dossier-context {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--text-mid); opacity: 0.55;
  max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.back-nav { display: flex; gap: 12px; align-items: center;
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  letter-spacing: 0.16em; text-transform: uppercase;
}
@media (max-width: 768px) { .topbar .dossier-context { display: none; } }
@media (max-width: 380px) { .topbar a:first-child em { display: none; } }
main { max-width: 980px; margin: 0 auto; padding: 56px 28px 80px; }
.hero { margin-bottom: 64px; }
.hero .eyebrow {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 16px;
}
.hero h1 {
  font-family: 'Fraunces', serif; font-weight: 400; font-size: 2.4rem;
  line-height: 1.15; margin-bottom: 20px;
}
.hero .tags {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--text-mid);
}
.source-block { margin-bottom: 64px; border-top: 1px solid var(--line); padding-top: 36px; }
.source-block h2 {
  font-family: 'Fraunces', serif; font-weight: 400; font-size: 1.6rem;
  margin-bottom: 24px; color: var(--text);
}
.item { margin-bottom: 48px; }
.item h3 {
  font-family: 'Fraunces', serif; font-weight: 500; font-size: 1.2rem;
  margin-bottom: 8px;
}
.item h3 a { color: var(--text); text-decoration: none; border-bottom: 1px solid var(--line-strong); }
.item h3 a:hover { color: var(--accent); }
.item .credits {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  letter-spacing: 0.12em; color: var(--text-mid); margin-bottom: 16px;
}
.item .credits .tag { color: var(--accent); margin-right: 6px; }
.item figure { margin: 20px 0; }
.item figure img, .item figure video {
  max-width: 100%; height: auto; display: block;
  border: 1px solid var(--line);
}
.item figure figcaption {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 0.12em; color: var(--text-faint); margin-top: 6px;
}
footer { margin-top: 80px; padding-top: 32px; border-top: 1px solid var(--line);
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  letter-spacing: 0.08em; color: var(--text-faint); text-align: center; }
</style>
</head>
<body>
<div class="topbar">
  <a href="../../index.html">Mathieu <em>Guglielmino</em></a>
  <span class="dossier-context">{{DOSSIER_CONTEXT}}</span>
  <nav class="back-nav" aria-label="Navigation retour">
    <a href="../index.html" title="Revenir au hub Veille presse">← Hub</a>
    <span aria-hidden="true">·</span>
    <a href="../../index.html#series" title="Revenir à l'accueil">Accueil</a>
  </nav>
</div>

<main>
  <header class="hero">
    <div class="eyebrow">VEILLE PRESSE · SEMAINE DU {{DATE_LONG_UPPER}}</div>
    <h1><!-- EDITABLE -->{{TITLE_DRAFT}}</h1>
    <div class="tags">{{TAGS_DOMINANT}} · {{N_ITEMS}} PIÈCES · {{N_SOURCES}} SOURCES</div>
  </header>

  {{BODY_SECTIONS}}

  <footer>
    Sélection éditoriale et captures automatisées · publié par Mathieu Guglielmino<br>
    Mathieu Guglielmino · Practice Manager Lincoln
  </footer>
</main>
</body>
</html>
```

- [ ] **Step 9.3: Écrire `hub-template.html`**

`.claude/skills/veille-presse-visuelle/assets/hub-template.html` :
```html
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#faf6ec">
<title>Veille presse visuelle — Mathieu Guglielmino</title>
<meta name="description" content="Sélection hebdomadaire de la presse dataviz internationale — NYT, Bloomberg, Reuters, Le Monde, FT, etc. Mise à jour chaque dimanche.">
<!-- og:start -->
<!-- og:end -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400;1,9..144,500&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #faf6ec; --surface: #ffffff;
  --line: rgba(30,30,44,0.08); --text: #1e1e2a;
  --text-mid: #6b6f7c; --accent: #b8582e;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: var(--bg); color: var(--text);
  font-family: 'Inter', sans-serif; font-weight: 300; line-height: 1.55;
  overflow-x: hidden; }
body { padding-top: 56px; min-height: 100vh; }
.topbar {
  position: fixed; top: 0; left: 0; right: 0; height: 56px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 28px; background: rgba(250,246,236,0.85);
  backdrop-filter: blur(10px); border-bottom: 1px solid var(--line);
  z-index: 60;
}
.topbar a { color: var(--text); text-decoration: none; font-family: 'Fraunces', serif; }
.back-nav { font-family: 'JetBrains Mono', monospace; font-size: 11px;
  letter-spacing: 0.16em; text-transform: uppercase; }
main { max-width: 1100px; margin: 0 auto; padding: 56px 28px 80px; }
.hero {
  margin-bottom: 64px; padding-bottom: 36px; border-bottom: 1px solid var(--line);
}
.hero .eyebrow {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 16px;
}
.hero h1 {
  font-family: 'Fraunces', serif; font-weight: 400; font-size: 2.6rem;
  line-height: 1.1; margin-bottom: 16px; max-width: 720px;
}
.hero p { font-size: 1.05rem; color: var(--text-mid); max-width: 640px; }
.editions-grid {
  display: grid; gap: 32px;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}
.edition-card {
  display: block; background: var(--surface); text-decoration: none;
  color: var(--text); border: 1px solid var(--line);
  transition: transform 200ms, box-shadow 200ms;
}
.edition-card:hover { transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(30,30,44,0.06); }
.edition-card .mosaic {
  display: grid; grid-template-columns: 1fr 1fr; aspect-ratio: 16/9;
  background: var(--bg);
}
.edition-card .mosaic img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}
.edition-card .meta { padding: 16px 20px; }
.edition-card .badge {
  display: inline-block; padding: 2px 8px;
  background: var(--accent); color: #fff;
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 0.14em; text-transform: uppercase;
  margin-bottom: 12px;
}
.edition-card h3 {
  font-family: 'Fraunces', serif; font-weight: 500; font-size: 1.15rem;
  margin-bottom: 6px;
}
.edition-card .sub {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 0.12em; color: var(--text-mid);
}
@media (max-width: 768px) {
  .topbar .dossier-context { display: none; }
}
</style>
</head>
<body>
<div class="topbar">
  <a href="../index.html">Mathieu <em>Guglielmino</em></a>
  <nav class="back-nav" aria-label="Navigation retour">
    <a href="../index.html#series">← Retour aux dossiers</a>
  </nav>
</div>

<main>
  <header class="hero">
    <div class="eyebrow">Veille</div>
    <h1>Veille presse visuelle</h1>
    <p>Une sélection hebdomadaire de la presse dataviz internationale, repérée le dimanche soir par mon agent et publiée le lundi matin. NYT, Bloomberg, Reuters, Le Monde, FT et une trentaine d'autres sources.</p>
  </header>

  <div class="editions-grid">
    {{EDITION_CARDS}}
  </div>
</main>
</body>
</html>
```

- [ ] **Step 9.4: Commit**

```bash
git add .claude/skills/veille-presse-visuelle/assets/
git commit -m "veille: HTML templates (edition + hub) au design system du repo"
```

---

## Task 10: `output.py` — HTML edition + hub generators

**Files:**
- Modify: `tools/veille_presse/output.py`
- Modify: `tests/test_veille_presse/test_output.py`

- [ ] **Step 10.1: Étendre les tests**

Ajouter dans `tests/test_veille_presse/test_output.py` :
```python
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
```

- [ ] **Step 10.2: Run, expect failure**

```bash
python -m unittest tests.test_veille_presse.test_output.TestHtmlGeneration -v
```

Expected: fail on `output.render_edition_html` and `output.render_hub_html`.

- [ ] **Step 10.3: Implémenter dans `output.py`**

Ajouter à `tools/veille_presse/output.py` :
```python
from collections import defaultdict
from pathlib import Path

from tools.veille_presse.paths import ASSETS_DIR


MONTH_FR = ["janvier", "février", "mars", "avril", "mai", "juin",
            "juillet", "août", "septembre", "octobre", "novembre", "décembre"]


def _date_long_fr(date_str: str) -> str:
    """2026-05-17 -> '17 mai 2026'."""
    y, m, d = date_str.split("-")
    return f"{int(d)} {MONTH_FR[int(m) - 1]} {y}"


def _is_video(filename: str) -> bool:
    return filename.lower().endswith((".mp4", ".webm", ".mov"))


def _render_figure(image_filename: str) -> str:
    """Build <figure> tag, choosing <img> or <video> based on extension."""
    if _is_video(image_filename):
        return (
            f'<figure><video src="images/{image_filename}" autoplay loop muted playsinline></video>'
            f'<figcaption>interaction · vidéo</figcaption></figure>'
        )
    if image_filename.lower().endswith(".gif"):
        return (
            f'<figure><img src="images/{image_filename}" alt="" loading="lazy">'
            f'<figcaption>interaction</figcaption></figure>'
        )
    return f'<figure><img src="images/{image_filename}" alt="" loading="lazy"></figure>'


def _render_item(item: dict) -> str:
    """Render one <article class="item">."""
    credits_bits = []
    if item["authors"]:
        credits_bits.append(", ".join(item["authors"]))
    for h in item.get("twitter_handles", []):
        credits_bits.append(f"@{h}")
    credits = " · ".join(credits_bits)
    tags_html = " ".join(f'<span class="tag">#{t}</span>' for t in item["tags"])
    figs = "\n".join(_render_figure(img) for img in item["images"])
    return f'''<article class="item">
  <h3><a href="{item["url"]}" target="_blank" rel="noopener">{item["title"]}</a></h3>
  <div class="credits">{tags_html}{(" · " + credits) if credits else ""}</div>
  {figs}
</article>'''


def _render_source_section(source_name: str, items: list[dict]) -> str:
    blocks = "\n".join(_render_item(i) for i in items)
    return f'<section class="source-block"><h2>{source_name}</h2>\n{blocks}\n</section>'


def render_edition_html(edition: dict) -> str:
    """Render the full HTML of an edition page from edition-template.html."""
    template = (ASSETS_DIR / "edition-template.html").read_text(encoding="utf-8")

    # Group items by source, sort sources by max score
    by_source: dict[str, list[dict]] = defaultdict(list)
    for it in edition["items"]:
        by_source[it["source"]].append(it)
    sources_ordered = sorted(by_source.keys(),
                             key=lambda s: -max(i["score"] for i in by_source[s]))
    body_sections = "\n\n".join(
        _render_source_section(s, by_source[s]) for s in sources_ordered
    )

    # Captures impossibles
    if edition.get("captures_impossibles"):
        ci = "\n".join(
            f'<li><a href="{c["url"]}" target="_blank">{c["title"]}</a> — '
            f'{", ".join(c.get("authors", []))}</li>'
            for c in edition["captures_impossibles"]
        )
        body_sections += (
            f'\n\n<section class="source-block"><h2>Captures impossibles</h2>'
            f'<ul>{ci}</ul></section>'
        )

    # Dominant tags
    all_tags = [t for it in edition["items"] for t in it["tags"]]
    tag_freq = defaultdict(int)
    for t in all_tags:
        tag_freq[t] += 1
    dominant = sorted(tag_freq, key=lambda t: -tag_freq[t])[:3]
    tags_dominant = " · ".join(f"#{t}" for t in dominant) or "—"

    date_long = _date_long_fr(edition["date"])
    n_items = len(edition["items"])
    n_sources = len(by_source)

    return (template
            .replace("{{TITLE_DRAFT}}", edition["title_draft"])
            .replace("{{DATE_LONG}}", date_long)
            .replace("{{DATE_LONG_UPPER}}", date_long.upper())
            .replace("{{DOSSIER_CONTEXT}}", f"VEILLE PRESSE · {date_long.upper()}")
            .replace("{{TAGS_DOMINANT}}", tags_dominant)
            .replace("{{N_ITEMS}}", str(n_items))
            .replace("{{N_SOURCES}}", str(n_sources))
            .replace("{{BODY_SECTIONS}}", body_sections))


def render_hub_html(editions: list[dict]) -> str:
    """Render veille-presse/index.html hub from hub-template.html.

    editions shape: [{date, n_items, n_sources, title, tags, hero_images}, ...]
    """
    template = (ASSETS_DIR / "hub-template.html").read_text(encoding="utf-8")
    editions_sorted = sorted(editions, key=lambda e: e["date"], reverse=True)
    cards: list[str] = []
    for ed in editions_sorted:
        # Mosaic of up to 4 hero images
        mosaic_imgs = "".join(
            f'<img src="{p}" alt="" loading="lazy">' for p in ed["hero_images"][:4]
        ) or '<div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-mid);">—</div>'
        tags_str = " · ".join(f"#{t}" for t in ed["tags"][:4])
        cards.append(f'''<a class="edition-card" href="{ed["date"]}/">
  <div class="mosaic">{mosaic_imgs}</div>
  <div class="meta">
    <span class="badge">Veille</span>
    <h3>Semaine du {_date_long_fr(ed["date"])}</h3>
    <div class="sub">{ed["n_items"]} pièces · {ed["n_sources"]} sources · {tags_str}</div>
  </div>
</a>''')

    return template.replace("{{EDITION_CARDS}}", "\n".join(cards))
```

- [ ] **Step 10.4: Run, expect PASS**

```bash
python -m unittest tests.test_veille_presse.test_output -v
```

Expected: 7 tests pass total.

- [ ] **Step 10.5: Commit**

```bash
git add tools/veille_presse/output.py tests/test_veille_presse/test_output.py
git commit -m "veille: HTML edition + hub generators"
```

---

## Task 11: `publish.py` — git ops + run-log

**Files:**
- Create: `tools/veille_presse/publish.py`
- Create: `tests/test_veille_presse/test_publish.py`

- [ ] **Step 11.1: Écrire les tests sur tmp git repo**

`tests/test_veille_presse/test_publish.py` :
```python
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
```

- [ ] **Step 11.2: Run, expect failure**

```bash
python -m unittest tests.test_veille_presse.test_publish -v
```

Expected: fail on `publish.create_edition_commit` and `publish.append_run_log`.

- [ ] **Step 11.3: Implémenter `publish.py` (partie git + log)**

`tools/veille_presse/publish.py` :
```python
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
```

- [ ] **Step 11.4: Run, expect PASS**

```bash
python -m unittest tests.test_veille_presse.test_publish -v
```

Expected: 3 tests pass.

- [ ] **Step 11.5: Commit**

```bash
git add tools/veille_presse/publish.py tests/test_veille_presse/test_publish.py
git commit -m "veille: git branch/commit + run-log + MCP action pending bridge"
```

---

## Task 12: `cli.py` — entrypoint wiring all phases

**Files:**
- Create: `tools/veille_presse/cli.py`

- [ ] **Step 12.1: Implémenter le CLI**

`tools/veille_presse/cli.py` :
```python
"""Entrypoint for the veille-presse-visuelle skill.

Subcommands:
  run                       Full weekly cycle (cron-invoked or manual)
  build-storage-state SLUG  Open Playwright for manual login, save storage
  discover-only             Phase 1 dry-run (no captures, no commit)
"""
import argparse
import asyncio
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

from tools.veille_presse import (
    sources as srcmod,
    crawler,
    metadata,
    capture,
    output,
    publish,
)
from tools.veille_presse.paths import (
    REPO, SKILL_DIR, SOURCES_YML, STATE_DIR,
    LAST_CRAWL_JSON, RUN_LOG_JSONL, VEILLE_DIR, VEILLE_HUB,
    edition_dir, STORAGE_STATE_DIR,
)


def _slugify(text: str) -> str:
    import re
    text = re.sub(r"[^\w\s-]", "", text.lower())
    return re.sub(r"[-\s]+", "-", text).strip("-")[:40] or "untitled"


def _edition_date_for_today() -> str:
    """Return the most recent Sunday in ISO format (YYYY-MM-DD)."""
    today = datetime.now(timezone.utc)
    days_back = (today.weekday() + 1) % 7  # Monday=0, Sunday=6 -> need offset to Sunday
    sunday = today - timedelta(days=days_back)
    return sunday.strftime("%Y-%m-%d")


def cmd_run(args: argparse.Namespace) -> int:
    """Full weekly cycle."""
    date_str = args.date or _edition_date_for_today()
    print(f"[veille] cycle for {date_str}")

    # 1. Load config + state
    sources = srcmod.load_sources(SOURCES_YML)
    state = srcmod.load_state(LAST_CRAWL_JSON)

    # 2. Crawl all sources (parallel)
    print(f"[veille] crawling {len(sources)} sources...")
    crawl_results = asyncio.run(crawler.crawl_all(sources, state, max_parallel=5))

    # 3. Build shortlist with scoring
    all_items: list[dict] = []
    for slug, items in crawl_results.items():
        source = next(s for s in sources if s["slug"] == slug)
        for it in items:
            it["source_slug"] = slug
            it["source"] = source["name"]
            it["score"] = crawler.score_item(it, source)
            it["selectors"] = source["selectors"]
            it["twitter_handles"] = source.get("twitter_handles", [])
        all_items.extend(items)
    shortlist = crawler.build_shortlist(all_items, cap=15)
    print(f"[veille] shortlist: {len(shortlist)} items (from {len(all_items)} new URLs)")

    # 4. Update last-crawl state (we've "seen" all crawled URLs, not just shortlisted)
    for slug, items in crawl_results.items():
        srcmod.update_state(state, slug, [it["url"] for it in items])
    srcmod.save_state(LAST_CRAWL_JSON, state)

    # 5. Capture phase
    out_dir = edition_dir(date_str)
    images_dir = out_dir / "images"
    images_dir.mkdir(parents=True, exist_ok=True)
    enriched: list[dict] = []
    impossibles: list[dict] = []
    for item in shortlist:
        meta = metadata.extract(item["html"], item["selectors"])
        title = meta["title"] or item["url"].rstrip("/").rsplit("/", 1)[-1]
        slug_title = _slugify(title)
        prefix = f"{item['source_slug']}-{slug_title}"
        tags = metadata.detect_tags(item["html"])
        if item.get("is_interactive") and "scrollytelling" not in tags:
            tags.append("scrollytelling")

        try:
            # Full-page screenshot
            fp = images_dir / f"{prefix}-fullpage.png"
            capture.screenshot_full_page_from_html(item["html"], fp)
            # Section screenshots
            sec_paths = capture.screenshot_sections_from_html(
                item["html"], images_dir, prefix, max_sections=4
            )
            images = [fp.name] + [p.name for p in sec_paths]

            # GIF/MP4 if interactive
            if item.get("is_interactive"):
                gif_out = images_dir / f"{prefix}-interaction.gif"
                result = capture.capture_interaction_gif_from_html(
                    item["html"], gif_out, duration_s=8, fps=10
                )
                if result["format"] == "mp4":
                    images.append(f"{prefix}-interaction.mp4")
                elif result["format"] == "gif":
                    images.append(f"{prefix}-interaction.gif")

            enriched.append({
                "source": item["source"],
                "source_slug": item["source_slug"],
                "title": title,
                "url": item["url"],
                "authors": meta["authors"],
                "twitter_handles": item["twitter_handles"],
                "tags": tags,
                "score": item["score"],
                "images": images,
            })
        except Exception as e:
            print(f"[veille] capture failed for {item['url']}: {e}")
            impossibles.append({
                "source": item["source"],
                "title": title,
                "url": item["url"],
                "authors": meta["authors"],
            })

    print(f"[veille] captured {len(enriched)} items, {len(impossibles)} impossibles")

    # 6. Generate notes.md + index.html
    edition_payload = {
        "date": date_str,
        "title_draft": _generate_title_draft(enriched),
        "items": enriched,
        "captures_impossibles": impossibles,
    }
    notes_md = output.render_notes_md(edition_payload)
    (out_dir / "notes.md").write_text(notes_md, encoding="utf-8")
    edition_html = output.render_edition_html(edition_payload)
    (out_dir / "index.html").write_text(edition_html, encoding="utf-8")

    # 7. Update hub
    hub_editions = _collect_existing_editions()
    hub_editions.append({
        "date": date_str,
        "n_items": len(enriched),
        "n_sources": len({i["source"] for i in enriched}),
        "title": edition_payload["title_draft"],
        "tags": _dominant_tags(enriched),
        "hero_images": [f"{date_str}/images/{i['images'][0]}"
                        for i in sorted(enriched, key=lambda x: -x["score"])[:4]],
    })
    hub_html = output.render_hub_html(hub_editions)
    VEILLE_HUB.write_text(hub_html, encoding="utf-8")

    # 8. og.png for the new edition
    _run_og_card(date_str, edition_payload["title_draft"])

    # 9. Git: branch + commit
    sha = publish.create_edition_commit(
        REPO, date_str, n_items=len(enriched),
        paths_to_add=[f"veille-presse/{date_str}", "veille-presse/index.html"],
    )
    print(f"[veille] commit {sha[:8]} on veille/{date_str}")

    if args.no_push:
        print("[veille] --no-push: stopping before push/PR")
        return 0

    publish.push_branch(REPO, date_str)
    pending = publish.write_pending_mcp_actions(STATE_DIR, date_str, f"veille/{date_str}")
    print(f"[veille] pending MCP actions written to {pending}")
    print("[veille] cycle complete. Claude harness must now execute MCP actions for PR + merge.")

    # 10. Append run-log
    publish.append_run_log(RUN_LOG_JSONL, {
        "date": date_str,
        "n_crawled": sum(len(v) for v in crawl_results.values()),
        "n_shortlisted": len(shortlist),
        "n_captured": len(enriched),
        "n_skipped": len(impossibles),
        "commit_sha": sha,
    })
    return 0


def _generate_title_draft(items: list[dict]) -> str:
    """Naive title from dominant tags. Replace with LLM call in v2 if needed."""
    if not items:
        return "Édition vide"
    tags = _dominant_tags(items)
    if tags:
        return f"Une semaine de {' · '.join(tags[:2])}"
    return "Une semaine de visualisations"


def _dominant_tags(items: list[dict]) -> list[str]:
    from collections import Counter
    counter = Counter(t for it in items for t in it["tags"])
    return [t for t, _ in counter.most_common(4)]


def _collect_existing_editions() -> list[dict]:
    """Scan veille-presse/ for existing YYYY-MM-DD/ subdirs, return summaries."""
    out = []
    if not VEILLE_DIR.exists():
        return out
    for sub in VEILLE_DIR.iterdir():
        if not sub.is_dir() or not _is_iso_date(sub.name):
            continue
        notes = sub / "notes.md"
        if not notes.exists():
            continue
        # Parse very lightly: count items (## headings) and unique sources (# headings)
        text = notes.read_text(encoding="utf-8")
        n_items = text.count("\n## ")
        n_sources = text.count("\n# ") + (1 if text.startswith("# ") else 0)
        # Hero images: first .png of the notes
        import re as _re
        first_images = _re.findall(r"!\[\]\(([^)]+\.(?:png|gif))\)", text)[:4]
        out.append({
            "date": sub.name,
            "n_items": n_items,
            "n_sources": n_sources,
            "title": "",  # not extracted, hub renders from date only
            "tags": [],
            "hero_images": [f"{sub.name}/images/{img}" for img in first_images],
        })
    return out


def _is_iso_date(s: str) -> bool:
    import re as _re
    return bool(_re.fullmatch(r"\d{4}-\d{2}-\d{2}", s))


def _run_og_card(date_str: str, title: str) -> None:
    """Invoke tools/og-card.py to produce veille-presse/YYYY-MM-DD/og.png."""
    import subprocess
    out = edition_dir(date_str) / "og.png"
    subprocess.run([
        sys.executable, str(REPO / "tools" / "og-card.py"),
        "--title", title,
        "--eyebrow", f"Veille presse · semaine du {date_str}",
        "--output", str(out),
        "--kind", "veille",
    ], check=False)


def cmd_build_storage_state(args: argparse.Namespace) -> int:
    """Open Playwright (headed) on a source's login page, save storageState on exit."""
    sources = srcmod.load_sources(SOURCES_YML)
    matches = [s for s in sources if s["slug"] == args.slug]
    if not matches:
        print(f"unknown slug: {args.slug}", file=sys.stderr)
        return 1
    source = matches[0]
    if not source.get("storage_state"):
        print(f"source {args.slug} has no 'storage_state' field. Set one first.", file=sys.stderr)
        return 1

    STORAGE_STATE_DIR.mkdir(parents=True, exist_ok=True)
    storage_path = SKILL_DIR / source["storage_state"]

    asyncio.run(_build_storage_state_async(source, storage_path))
    print(f"[veille] storage_state saved → {storage_path}")
    return 0


async def _build_storage_state_async(source: dict, storage_path: Path) -> None:
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        await page.goto(source["graphics_url"])
        print(f"\n[veille] Browser open. Log in to {source['name']} manually.")
        input("Press ENTER here when logged in to save storageState and quit.")
        await context.storage_state(path=str(storage_path))
        await browser.close()


def cmd_discover_only(args: argparse.Namespace) -> int:
    """Dry-run Phase 1: crawl + shortlist, print summary, no captures, no commit."""
    sources = srcmod.load_sources(SOURCES_YML)
    state = srcmod.load_state(LAST_CRAWL_JSON)
    crawl_results = asyncio.run(crawler.crawl_all(sources, state, max_parallel=5))
    all_items = []
    for slug, items in crawl_results.items():
        source = next(s for s in sources if s["slug"] == slug)
        for it in items:
            it["source_slug"] = slug
            it["source"] = source["name"]
            it["score"] = crawler.score_item(it, source)
        all_items.extend(items)
    shortlist = crawler.build_shortlist(all_items, cap=15)
    print(f"crawled {len(all_items)} new URLs, shortlist {len(shortlist)}:")
    for i, it in enumerate(shortlist, 1):
        print(f"  [{i:2d}] {it['score']:5.1f}  {it['source']:25s}  {it['url']}")
    return 0


def main(argv: list[str] = None) -> int:
    parser = argparse.ArgumentParser(prog="veille-presse")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_run = sub.add_parser("run", help="full weekly cycle")
    p_run.add_argument("--date", help="override edition date (YYYY-MM-DD)")
    p_run.add_argument("--no-push", action="store_true",
                       help="stop before push/PR (commit local only)")
    p_run.set_defaults(func=cmd_run)

    p_bss = sub.add_parser("build-storage-state",
                           help="rebuild Playwright session for a source")
    p_bss.add_argument("slug")
    p_bss.set_defaults(func=cmd_build_storage_state)

    p_disc = sub.add_parser("discover-only",
                            help="Phase 1 dry-run, no captures, no commit")
    p_disc.set_defaults(func=cmd_discover_only)

    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 12.2: Smoke test `discover-only` (sans réseau dispo : skip)**

Run :
```bash
python tools/veille_presse/cli.py --help
python tools/veille_presse/cli.py discover-only 2>&1 | head -20
```

Expected for `--help` : usage with 3 subcommands. Pour `discover-only` : si réseau dispo, affiche la shortlist. Si réseau bloqué, traceback Playwright → c'est attendu, le test e2e viendra Task 14.

- [ ] **Step 12.3: Commit**

```bash
git add tools/veille_presse/cli.py
git commit -m "veille: cli entrypoint (run, build-storage-state, discover-only)"
```

---

## Task 13: `tools/build-storage-state.py` — thin helper wrapper

**Files:**
- Create: `tools/build-storage-state.py`

- [ ] **Step 13.1: Implémenter le wrapper**

`tools/build-storage-state.py` :
```python
#!/usr/bin/env python3
"""Thin wrapper that defers to `tools/veille_presse/cli.py build-storage-state`.

Usage:
    python tools/build-storage-state.py <slug>
    # e.g.
    python tools/build-storage-state.py nyt
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.veille_presse.cli import main

if __name__ == "__main__":
    args = ["build-storage-state"] + sys.argv[1:]
    sys.exit(main(args))
```

- [ ] **Step 13.2: Smoke run**

```bash
python tools/build-storage-state.py --help 2>&1 | head -5
```

Doit afficher l'usage du sous-commande build-storage-state.

- [ ] **Step 13.3: Commit**

```bash
git add tools/build-storage-state.py
git commit -m "veille: tools/build-storage-state.py thin wrapper"
```

---

## Task 14: Skill `SKILL.md` + references markdown

**Files:**
- Modify: `.claude/skills/veille-presse-visuelle/SKILL.md`
- Create: `.claude/skills/veille-presse-visuelle/references/crawler.md`
- Create: `.claude/skills/veille-presse-visuelle/references/capture.md`
- Create: `.claude/skills/veille-presse-visuelle/references/output.md`

- [ ] **Step 14.1: Écrire `SKILL.md` complet**

`.claude/skills/veille-presse-visuelle/SKILL.md` :
```markdown
---
name: veille-presse-visuelle
description: Weekly automated visual press review — crawls ~30 dataviz press sources, captures screenshots/GIFs/MP4 with Playwright, generates a public dossier in veille-presse/YYYY-MM-DD/, opens a PR and auto-merges. Triggered by Sunday 20h Europe/Paris cron via /schedule, or manually via `python tools/veille_presse/cli.py run`. Use when the Sunday cron fires, when user asks to run the press veille manually, or when a storage_state needs rebuilding.
---

# Veille presse visuelle

Skill that runs the weekly visual press review on `mathieugug.github.io`.

## Triggers

- **Sunday 20h Europe/Paris cron** (registered via `/schedule`) — fires `python tools/veille_presse/cli.py run`
- **Manual invocation** — user says "lance la veille presse" or "fais tourner la veille" → run `python tools/veille_presse/cli.py run`
- **Storage state rebuild** — when a source's session has expired (skipped items in run-log for that source) → run `python tools/build-storage-state.py <slug>`

## Contract — what this skill produces

A new commit on `main` containing :
- `veille-presse/YYYY-MM-DD/index.html` — public edition page
- `veille-presse/YYYY-MM-DD/notes.md` — Obsidian-format notes
- `veille-presse/YYYY-MM-DD/og.png` — social card
- `veille-presse/YYYY-MM-DD/images/*.{png,gif,mp4}` — captures
- `veille-presse/index.html` updated (new card at the top)

## Workflow (2 phases)

### Phase 1 — Discovery + Capture (fully autonomous)

1. Load `sources.yml` + `state/last-crawl.json`
2. For each source in parallel (max 5): crawl `graphics_url`, diff vs seen URLs
3. For each new URL: fetch article HTML, detect interactivity heuristic
4. Score = `weight × (1 + 0.3 × is_interactive)`, cap shortlist at 15
5. Capture per item: full-page PNG + section PNGs + GIF/MP4 if interactive
6. Extract metadata (title, authors, date, tags)

### Phase 2 — Publication + Automerge

7. Render `notes.md` + `index.html` from templates
8. Update hub `veille-presse/index.html` (insert new card)
9. Generate `og.png` via `tools/og-card.py`
10. `git checkout -b veille/YYYY-MM-DD` + commit + push
11. Open PR via `mcp__github__create_pull_request` (read `state/mcp-pending.json` for the action sequence)
12. Auto-merge PR via `mcp__github__merge_pull_request` with `mergeMethod: squash`
13. Append `state/run-log.jsonl`

## Checklist before merge (post-publication audit, mensuel)

- [ ] Les screenshots full-page ne sont pas tronqués
- [ ] Les GIFs < 6 Mo, lisibles
- [ ] Les MP4 < 8 Mo, jouables en navigateur
- [ ] `notes.md` parse en Obsidian (galleries reconnues)
- [ ] `index.html` mobile 320 px et desktop 1920 px OK
- [ ] Topbar 3-items présente
- [ ] Hub `veille-presse/index.html` montre la nouvelle carte en tête
- [ ] `og.png` 1200×630 généré
- [ ] PR mergée et publiée sur GitHub Pages
- [ ] Aucune `storage_state` n'a expiré silencieusement (vérifier `run-log.jsonl`)

## MCP actions bridge

Phase 2 / step 11-12 ne peuvent pas être appelées depuis Python (les MCP tools sont disponibles uniquement dans la session Claude). Solution :

- `cli.py run` écrit `state/mcp-pending.json` décrivant la séquence d'actions à exécuter
- Le harness Claude (ou Mathieu lors d'un run manuel) lit ce fichier et exécute les MCP calls
- Une fois les actions complétées, le harness met à jour `run-log.jsonl` avec `pr_number` et `merge_sha`, puis supprime `mcp-pending.json`

## Surfaces de configuration manuelle

- **`sources.yml`** — ajouter/retirer/repondérer une source
- **`tools/build-storage-state.py <slug>`** — rebuild d'une session Playwright expirée
- **`veille-presse/YYYY-MM-DD/index.html` post-merge** — édition manuelle d'une coquille, ajout d'un `<mark>`, retrait d'une pièce

## Pour plus de détails

- **Crawler strategy + sélecteurs par source** → `references/crawler.md`
- **Capture pipeline (Playwright + ffmpeg)** → `references/capture.md`
- **Templates HTML + design system** → `references/output.md`

## Spec d'origine

`docs/superpowers/specs/2026-05-16-veille-presse-visuelle-design.md`
```

- [ ] **Step 14.2: Écrire les 3 references**

`.claude/skills/veille-presse-visuelle/references/crawler.md` :
```markdown
# Crawler — diff strategy + selectors

## Diff strategy

For each source, `state/last-crawl.json` stores `{slug: {seen_urls: [...]}}`.
A URL is "new" if it's not in `seen_urls`. After a successful crawl, new URLs
are appended (FIFO cap at 500 per source).

## Selectors per source

Each source in `sources.yml` declares `selectors.item` — the CSS selector to
extract URLs from the landing page. The selector should target `<a>` elements
whose `href` is the article URL. Hrefs are resolved relative to the landing
page URL.

**Common patterns** :
- NYT : `article a[href*='/interactive/'], section ol li a[href*='/spotlight/']`
- Bloomberg : `a[href*='/graphics/'], a[href*='/features/']`
- Le Monde : `a[href*='/les-decodeurs/article/']`

**When a source breaks** : if `run-log.jsonl` shows `n_crawled: 0` for a source
2 cycles in a row, the selector likely needs an update. Reopen the landing
page in DevTools, find the new pattern, edit `sources.yml`, commit.

## Scoring

```
score = source.weight × (1 + 0.3 × is_interactive)
```

`is_interactive` is heuristic — true if any of `source.interactivity_signals`
(`d3`, `scrollama`, `observable`, `mapbox`, …) matches a `<script src=...>` URL
in the article HTML.

Shortlist cap : 15 (matches historical edition size).

## Parallelism

`crawl_all()` runs up to 5 sources in parallel via `asyncio.Semaphore`. Each
source's per-item article fetching is sequential to keep memory bounded.
```

`.claude/skills/veille-presse-visuelle/references/capture.md` :
```markdown
# Capture — Playwright + ffmpeg

## Engine

**Playwright Chromium headless** is the only capture engine. We do not use
claude-in-chrome in the auto loop (requires an interactive session).

For paywalled sources, the crawler loads a per-source `storage_state.json`
(Playwright session export) via `browser_context.storage_state`. These
sessions are rebuilt manually with `python tools/build-storage-state.py <slug>`.

## Outputs per item

For a shortlisted article at `https://nyt.com/interactive/.../heat.html` with
title "How Heat Reshapes Cities", we save :

```
veille-presse/2026-05-17/images/
  nyt-how-heat-reshapes-cities-fullpage.png
  nyt-how-heat-reshapes-cities-hero.png         ← section #hero
  nyt-how-heat-reshapes-cities-sect-1.png       ← unnamed section
  nyt-how-heat-reshapes-cities-interaction.gif  ← if is_interactive
```

## GIF/MP4 fallback ladder

1. Encode GIF at width=1000 → if ≤ 6 Mo, keep
2. Re-encode GIF at width=800 → if ≤ 6 Mo, keep
3. Encode MP4 H.264 → if ≤ 8 Mo, keep, drop GIF
4. Otherwise skip both, keep only fullpage PNG + note in `notes.md`

## ffmpeg commands

Palette-based GIF :
```
ffmpeg -y -framerate 10 -i frame_%04d.png -vf "scale=W:-1,palettegen" palette.png
ffmpeg -y -framerate 10 -i frame_%04d.png -i palette.png \
  -filter_complex "[0:v]scale=W:-1[x];[x][1:v]paletteuse" out.gif
```

MP4 H.264 :
```
ffmpeg -y -framerate 10 -i frame_%04d.png -c:v libx264 -pix_fmt yuv420p \
  -crf 23 -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2" out.mp4
```

## Frame capture (scroll)

`_capture_frames_async` opens the article at 1000×700 viewport, computes the
total scrollable height, and takes a screenshot every `1/fps` seconds while
scrolling from top to bottom over `duration_s` seconds. Default 80 frames
(8 s × 10 FPS).
```

`.claude/skills/veille-presse-visuelle/references/output.md` :
```markdown
# Output — templates + design system

## Templates

Two HTML templates with `{{PLACEHOLDER}}` substitution (string.replace, no
Jinja) :

- `assets/edition-template.html` — one weekly edition
- `assets/hub-template.html` — the `veille-presse/index.html` hub

## Placeholders

**edition-template.html** :
- `{{TITLE_DRAFT}}` — auto-generated 1-line title (editable post-merge)
- `{{DATE_LONG}}` / `{{DATE_LONG_UPPER}}` — "17 mai 2026" / upper
- `{{DOSSIER_CONTEXT}}` — topbar middle text
- `{{N_ITEMS}}`, `{{N_SOURCES}}` — counters
- `{{TAGS_DOMINANT}}` — top 3 tags of the edition
- `{{BODY_SECTIONS}}` — H2-per-source sections, generated server-side

**hub-template.html** :
- `{{EDITION_CARDS}}` — antichrono `<a class="edition-card">` blocks

## Design system

Strict respect of the repo's CLAUDE.md :
- Vars : `--bg #faf6ec`, `--accent #b8582e`, `--text #1e1e2a`
- Fonts : Fraunces (serif) / Inter (sans) / JetBrains Mono (mono)
- Topbar 3-items obligatoire sur l'édition (Mathieu · titre dossier · Hub/Accueil)
- Topbar 2-items sur le hub
- Mobile : 7 points (overflow-x hidden, padding adapté, etc.)
- `<mark>` highlight NOT auto-applied — Mathieu adds them by hand post-merge if needed

## OG cards

Generated via `tools/og-card.py` with `--kind veille` (style à définir si le
script ne le supporte pas encore — par défaut, fallback sur la charte
existante avec accent orange sur un mot du titre).
```

- [ ] **Step 14.3: Commit**

```bash
git add .claude/skills/veille-presse-visuelle/SKILL.md .claude/skills/veille-presse-visuelle/references/
git commit -m "veille: SKILL.md + 3 references markdown (crawler, capture, output)"
```

---

## Task 15: Schedule registration + first dry-run

**Files:**
- (no new files — uses the /schedule skill)

- [ ] **Step 15.1: Lancer le dry-run de discovery**

Run :
```bash
python tools/veille_presse/cli.py discover-only
```

Expected (with network) : liste de shortlist 15 pièces avec scores. Si traceback Playwright : `playwright install chromium` puis retry.

- [ ] **Step 15.2: Si la shortlist est vide ou très petite**

Cas attendu sur le premier run : aucune URL n'est dans `last-crawl.json` donc TOUT est "nouveau". La shortlist sera capée à 15 par construction. Si elle est petite, c'est que les selecteurs ne matchent rien — DevTools sur 2-3 sources qui ressortent vides, fix sélecteurs dans `sources.yml`, commit.

- [ ] **Step 15.3: Lancer un cycle complet --no-push**

Run :
```bash
python tools/veille_presse/cli.py run --no-push --date 2026-05-17
```

Expected : crée `veille-presse/2026-05-17/{index.html,notes.md,images/...}`, met à jour `veille-presse/index.html`, commit local sur `veille/2026-05-17` mais ne push pas. Vérifier visuellement :
- `veille-presse/2026-05-17/index.html` s'ouvre dans un navigateur
- `veille-presse/index.html` (hub) montre une carte pour 2026-05-17
- `veille-presse/2026-05-17/notes.md` est lisible
- `veille-presse/2026-05-17/og.png` est bien généré (1200×630)

Si OK, `git reset --hard HEAD~1 && git checkout main && git branch -D veille/2026-05-17` pour nettoyer (le vrai run viendra avec push).

- [ ] **Step 15.4: Enregistrer le cron via `/schedule`**

Invoquer la skill `/schedule` (manuellement par l'utilisateur dans une session Claude) :
- Nom du job : `veille-presse-hebdo`
- Cron : `0 20 * * 0`
- TZ : `Europe/Paris`
- Commande : `cd /path/to/mathieugug.github.io && python tools/veille_presse/cli.py run`

Le job exécutera le cycle complet (avec push). Les MCP actions (PR + merge) restent à exécuter par la session Claude qui lit `state/mcp-pending.json`.

- [ ] **Step 15.5: Documenter dans `tools/veille_presse/README.md`**

Ajouter à `tools/veille_presse/README.md` :
```markdown

## Schedule

Le cron est enregistré via la skill `/schedule` :

| Nom | Cron | TZ | Action |
|---|---|---|---|
| `veille-presse-hebdo` | `0 20 * * 0` | `Europe/Paris` | `python tools/veille_presse/cli.py run` |

Pour modifier : `/schedule list`, `/schedule update veille-presse-hebdo`.

## MCP actions bridge

Le CLI ne peut pas appeler les MCP tools (PR / merge). À la fin d'un run, il
écrit `state/mcp-pending.json` que la session Claude (ou Mathieu en manuel)
doit lire pour exécuter :
1. `mcp__github__create_pull_request` → récupérer `pr_number`
2. `mcp__github__merge_pull_request` avec `pullNumber: <pr_number>`, `mergeMethod: "squash"`
3. Compléter l'entrée correspondante dans `state/run-log.jsonl` avec `pr_number` + `merge_sha`
4. Supprimer `state/mcp-pending.json`
```

- [ ] **Step 15.6: Commit + push branch**

```bash
git add tools/veille_presse/README.md
git commit -m "veille: doc cron schedule + MCP actions bridge"
git push origin claude/veille-presse-visuelle
```

- [ ] **Step 15.7: Ouvrir la PR finale via MCP GitHub**

Run (Claude session) :
```
mcp__github__create_pull_request:
  owner: mathieugug
  repo: mathieugug.github.io
  title: "veille-presse-visuelle: skill + cron + auto-publication"
  body: "Implémente la spec docs/superpowers/specs/2026-05-16-veille-presse-visuelle-design.md. Cf. plan dans docs/superpowers/plans/2026-05-16-veille-presse-visuelle.md."
  head: claude/veille-presse-visuelle
  base: main
```

Mathieu merge manuellement après relecture finale.

---

## Self-Review Notes

**Spec coverage check** :
- ✅ Skill location + structure : T1
- ✅ sources.yml schema + loader + diff : T2 + T4
- ✅ Playwright crawler + scoring + cap : T3
- ✅ Metadata + tags heuristic : T5
- ✅ Screenshots full-page + sections : T6
- ✅ GIF + MP4 fallback : T7
- ✅ notes.md format : T8
- ✅ HTML templates + generators : T9 + T10
- ✅ Git ops + run-log : T11
- ✅ CLI entrypoint + 3 commands : T12
- ✅ build-storage-state helper : T13
- ✅ SKILL.md + references : T14
- ✅ Cron + dry run + PR : T15

**Non-objectifs respectés** :
- ✅ Pas de validation user inline (full auto)
- ✅ Pas de claude-in-chrome dans la boucle
- ✅ Cap 8 Mo binaires
- ✅ Pas d'historique pre-2026 migré

**Items where the spec requires something but the plan defers** :
- MCP actions (PR create + merge) : delegated to Claude harness via `mcp-pending.json` bridge — Task 11 (Step 11.3) implements the bridge, Task 14 (SKILL.md) documents the contract, Task 15 (Step 15.7) is the first manual demonstration. The skill design assumes Claude executes these MCP calls when it sees `mcp-pending.json` written.
- Update root `index.html` tile : not explicitly done in any task. Add a step in Task 15 (Step 15.3) to manually edit the root tile during first dry-run, then automate in v2.

**Placeholder scan** : OK — no TBD/TODO/etc. Two notes use the phrase "à définir" (Task 14 Step 14.2 OG card `--kind veille` if not supported) — acceptable, the engineer can pass a different `--kind` or fall back to the default.

**Type consistency check** : `score_item` returns float ; `build_shortlist` sorts by `score` key ; `crawl_all` returns `dict[str, list[dict]]` ; `extract` returns `{title, authors, published}` ; all consistent across tasks.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-16-veille-presse-visuelle.md`. Two execution options :

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach ?**
