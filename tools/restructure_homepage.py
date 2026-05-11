#!/usr/bin/env python3
"""One-shot restructure of index.html for the homepage filter refactor.

Replaces the two existing <section id="series"> + <section id="dossiers">
blocks with:
  - <section id="a-la-une"> containing 3 featured cards (duplicates of cards
    that also live in the bibliotheque grid)
  - <section id="bibliotheque"> wrapping a filter bar UI + the 16 cards in
    date-desc order

Also rewrites the topbar link `<a href="#series">Dossiers</a>` to point at
the new `#bibliotheque` anchor.

Idempotent guard: the script aborts if either of the new sections is already
present, so re-running on a transformed file is a no-op (with a clear error).
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"

FEATURED_SLUGS = ["mcp-plateforme", "evaluation-agentique", "proces-musk-altman"]


def fail(msg: str) -> None:
    print(f"FATAL: {msg}", file=sys.stderr)
    sys.exit(1)


def find_section_bounds(src: str, section_id: str) -> tuple[int, int]:
    """Find (start, end) byte offsets of `<section ... id="{section_id}">...</section>`.

    The end is the offset just past the closing `</section>`. Walks forward
    counting nested `<section>` opens to find the matching close.
    """
    open_re = re.compile(rf'<section\b[^>]*\bid="{re.escape(section_id)}"[^>]*>')
    m = open_re.search(src)
    if not m:
        fail(f'could not find <section id="{section_id}">')
    start = m.start()
    pos = m.end()
    depth = 1
    section_open_re = re.compile(r"<section\b")
    section_close_re = re.compile(r"</section>")
    while depth > 0:
        next_open = section_open_re.search(src, pos)
        next_close = section_close_re.search(src, pos)
        if not next_close:
            fail(f"unmatched <section id={section_id}>")
        if next_open and next_open.start() < next_close.start():
            depth += 1
            pos = next_open.end()
        else:
            depth -= 1
            pos = next_close.end()
    return start, pos


def extract_cards(src: str) -> list[dict]:
    """Extract every <a class="serie ..."> ... </a> block with its data-*.

    Returns a list of dicts with: slug, date, numero, html (the raw block
    including opening <a> and closing </a>), indent (the leading whitespace
    on the opening line, used to preserve formatting on re-emission).
    """
    # We match the opening <a ...> tag (with class="serie..." and href="slug/"),
    # then walk forward until we hit the matching </a>. Cards contain <text> in
    # SVG and possibly nested <a>? — Inspecting the file: no nested <a> inside
    # cards. So a simple non-greedy match across newlines is safe.
    card_re = re.compile(
        r'(?P<indent>[ \t]*)'
        r'(?P<open><a\s+href="(?P<slug>[a-z][a-z0-9-]*)/"\s+class="serie[^"]*"[^>]*>)'
        r'(?P<body>.*?)'
        r'(?P<close></a>)',
        re.S,
    )
    cards = []
    for m in card_re.finditer(src):
        full = m.group("indent") + m.group("open") + m.group("body") + m.group("close")
        slug = m.group("slug")
        opening = m.group("open")
        date_m = re.search(r'data-date="(\d{4}-\d{2}-\d{2})"', opening)
        numero_m = re.search(r'data-numero="(\d{2})"', opening)
        if not date_m:
            fail(f"card {slug!r} is missing data-date")
        if not numero_m:
            fail(f"card {slug!r} is missing data-numero")
        cards.append(
            {
                "slug": slug,
                "date": date_m.group(1),
                "numero": numero_m.group(1),
                "html": full,
                "start": m.start(),
                "end": m.end(),
            }
        )
    return cards


A_LA_UNE_OPEN = """<section class="section featured-wrap" id="a-la-une">
  <div class="series-head">
    <div>
      <div class="section-eyebrow">À la une</div>
      <h2>Trois <em>repères</em> en ce moment.</h2>
    </div>
    <span class="series-hint">3 sélections · mai 2026</span>
  </div>
  <p class="section-lede">Lecture proposée. Le reste vit dans <a href="#bibliotheque">la bibliothèque</a> ci-dessous.</p>

  <div class="series-grid featured-grid">

"""

A_LA_UNE_CLOSE = """
  </div>
</section>"""

BIBLIO_OPEN = """<section class="section biblio-wrap" id="bibliotheque">
  <span id="series" aria-hidden="true" style="display:block;height:0"></span>
  <span id="dossiers" aria-hidden="true" style="display:block;height:0"></span>

  <div class="series-head">
    <div>
      <div class="section-eyebrow">Bibliothèque</div>
      <h2>Tous les <em>artefacts</em>.</h2>
    </div>
    <span class="series-hint" id="biblio-total">16 publications · 2026</span>
  </div>
  <p class="section-lede">Filtre par type, par thème, ou cherche un sujet. <strong>Tout est ici.</strong></p>

  <form class="biblio-filters" role="search" aria-label="Filtrer la bibliothèque">
    <div class="biblio-search">
      <input type="search" id="biblio-q"
             placeholder="Rechercher un sujet, un titre…"
             aria-label="Rechercher dans les artefacts"
             autocomplete="off">
    </div>

    <div class="biblio-chips" role="radiogroup" aria-label="Type d'artefact">
      <button type="button" class="chip chip-type" role="radio"
              aria-checked="true" data-type="">Tous</button>
      <button type="button" class="chip chip-type" role="radio"
              aria-checked="false" data-type="veille">Veille</button>
      <button type="button" class="chip chip-type" role="radio"
              aria-checked="false" data-type="etude">Étude</button>
      <button type="button" class="chip chip-type" role="radio"
              aria-checked="false" data-type="dossier">Dossier</button>
    </div>

    <div class="biblio-chips" role="group" aria-label="Thèmes">
      <button type="button" class="chip chip-theme" role="checkbox"
              aria-checked="false" data-theme="agentique">Agentique</button>
      <button type="button" class="chip chip-theme" role="checkbox"
              aria-checked="false" data-theme="production">Production</button>
      <button type="button" class="chip chip-theme" role="checkbox"
              aria-checked="false" data-theme="modeles">Modèles &amp; recherche</button>
      <button type="button" class="chip chip-theme" role="checkbox"
              aria-checked="false" data-theme="gouvernance">Gouvernance &amp; risques</button>
      <button type="button" class="chip chip-theme" role="checkbox"
              aria-checked="false" data-theme="economie">Économie &amp; ROI</button>
      <button type="button" class="chip chip-theme" role="checkbox"
              aria-checked="false" data-theme="societe">IA &amp; société</button>
      <button type="button" class="chip chip-theme" role="checkbox"
              aria-checked="false" data-theme="storytelling">Storytelling &amp; narrative</button>
    </div>

    <div class="biblio-counter" aria-live="polite">
      <span id="biblio-shown">12</span> / <span id="biblio-matched">16</span>
    </div>
  </form>

  <div class="series-grid biblio-grid" id="biblio-grid">

"""

BIBLIO_CLOSE = """
  </div>

  <div class="biblio-empty" id="biblio-empty" hidden>
    <p>Aucun artefact ne correspond à ces filtres.</p>
    <button type="button" class="biblio-reset" id="biblio-reset">Réinitialiser tous les filtres</button>
  </div>

  <div class="biblio-more-wrap" id="biblio-more-wrap">
    <button type="button" class="biblio-more" id="biblio-more">
      Voir <span id="biblio-more-count">12</span> de plus <span class="biblio-more-arrow">→</span>
    </button>
  </div>
</section>"""


def main() -> int:
    src = INDEX.read_text(encoding="utf-8")

    # Idempotence guard.
    if 'id="a-la-une"' in src or 'id="bibliotheque"' in src:
        fail(
            'index.html already contains id="a-la-une" or id="bibliotheque". '
            "This script is one-shot — abort to avoid double restructure."
        )

    # Locate both old sections.
    series_start, series_end = find_section_bounds(src, "series")
    dossiers_start, dossiers_end = find_section_bounds(src, "dossiers")

    if dossiers_start < series_end:
        fail("unexpected: #dossiers starts before #series ends")

    # Extract cards from each section in source order.
    series_block = src[series_start:series_end]
    dossiers_block = src[dossiers_start:dossiers_end]
    series_cards = extract_cards(series_block)
    dossiers_cards = extract_cards(dossiers_block)

    print(f"#series cards: {len(series_cards)} ({[c['slug'] for c in series_cards]})")
    print(f"#dossiers cards: {len(dossiers_cards)} ({[c['slug'] for c in dossiers_cards]})")

    if len(series_cards) != 4:
        fail(f"expected 4 cards in #series, got {len(series_cards)}")
    if len(dossiers_cards) != 12:
        fail(f"expected 12 cards in #dossiers, got {len(dossiers_cards)}")

    all_cards = series_cards + dossiers_cards
    if len({c["slug"] for c in all_cards}) != 16:
        fail("duplicate slugs detected across the two sections")

    # Sort the bibliotheque grid: date desc, then numero desc.
    biblio_cards = sorted(
        all_cards,
        key=lambda c: (c["date"], c["numero"]),
        reverse=True,
    )
    print("Bibliotheque order (date desc, numero desc):")
    for i, c in enumerate(biblio_cards, 1):
        print(f"  {i:2d}. {c['slug']:28s} · {c['date']} · {c['numero']}")

    # Pick featured cards by slug (in the order specified).
    by_slug = {c["slug"]: c for c in all_cards}
    missing = [s for s in FEATURED_SLUGS if s not in by_slug]
    if missing:
        fail(f"featured slug(s) not found: {missing}")
    featured_cards = [by_slug[s] for s in FEATURED_SLUGS]

    # Build the replacement block: À la une + blank line + Bibliothèque.
    featured_html = "\n".join(c["html"] for c in featured_cards)
    biblio_html = "\n".join(c["html"] for c in biblio_cards)

    new_block = (
        A_LA_UNE_OPEN
        + featured_html
        + A_LA_UNE_CLOSE
        + "\n\n"
        + BIBLIO_OPEN
        + biblio_html
        + BIBLIO_CLOSE
    )

    # Replace the contiguous span [series_start, dossiers_end). We allow
    # whatever sits between #series's </section> and #dossiers's <section>
    # (currently a blank line) to be dropped — the replacement block
    # internally provides its own blank line.
    new_src = src[:series_start] + new_block + src[dossiers_end:]

    # Topbar link rewrite.
    topbar_old = '<a href="#series">Dossiers</a>'
    topbar_new = '<a href="#bibliotheque">Bibliothèque</a>'
    if topbar_old not in new_src:
        fail(f"could not find topbar link {topbar_old!r}")
    new_src = new_src.replace(topbar_old, topbar_new, 1)

    INDEX.write_text(new_src, encoding="utf-8")
    print("OK — index.html restructured.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
