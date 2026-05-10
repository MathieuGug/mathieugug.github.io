#!/usr/bin/env python3
"""Tag .serie cards in index.html with data-type, data-themes, data-date,
data-numero, data-search-text. Idempotent — re-run updates in place.

Mapping type + thèmes encodé ici depuis le spec
docs/superpowers/specs/2026-05-10-homepage-filters-design.md.
"""
from __future__ import annotations
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"

# slug -> (type, [themes], iso_date)
# Date manquante (Avril 2026 sans jour) -> 1er du mois.
CARDS = {
    "proces-musk-altman":     ("veille",  ["gouvernance", "economie"],   "2026-04-27"),
    "evaluation-agentique":   ("etude",   ["agentique", "production"],   "2026-05-01"),
    "observabilite-agents-ia":("etude",   ["agentique", "production"],   "2026-04-30"),
    "anatomie":               ("dossier", ["agentique"],                  "2026-04-01"),
    "mcp-plateforme":         ("dossier", ["agentique"],                  "2026-05-08"),
    "measure-roi":            ("dossier", ["economie"],                   "2026-05-07"),
    "ia-et-travail":          ("etude",   ["societe"],                    "2026-05-06"),
    "gouvernance":            ("dossier", ["gouvernance"],                "2026-04-01"),
    "agents-computer-use":    ("etude",   ["agentique"],                  "2026-05-06"),
    "economie-inference":     ("etude",   ["economie", "production"],     "2026-05-05"),
    "harness-agentique":      ("etude",   ["agentique"],                  "2026-05-05"),
    "memoire-agentique":      ("etude",   ["agentique"],                  "2026-05-04"),
    "modeles-raisonnement":   ("etude",   ["modeles"],                    "2026-05-02"),
    "world-models":           ("etude",   ["modeles"],                    "2026-04-30"),
    "llm-jailbreaking":       ("etude",   ["gouvernance"],                "2026-04-29"),
    "narrative-experiences":  ("dossier", ["storytelling"],               "2026-04-28"),
}

THEME_LABELS = {
    "agentique": "agentique",
    "production": "production",
    "modeles": "modeles recherche",
    "gouvernance": "gouvernance risques",
    "economie": "economie roi",
    "societe": "ia societe travail",
    "storytelling": "storytelling narrative",
}

def strip_accents(s: str) -> str:
    """Lower + NFD + drop combining marks."""
    return "".join(
        c for c in unicodedata.normalize("NFD", s.lower())
        if unicodedata.category(c) != "Mn"
    )

def extract_text(html: str) -> str:
    """Crude tag stripper: drop everything between < and >, collapse whitespace."""
    text = re.sub(r"<[^>]+>", " ", html)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def build_search_text(card_html: str, themes: list[str]) -> str:
    """title + sub + theme labels, normalized."""
    title_m = re.search(r'<h3 class="serie-title"[^>]*>(.*?)</h3>', card_html, re.S)
    sub_m   = re.search(r'<p class="serie-sub"[^>]*>(.*?)</p>',   card_html, re.S)
    title_text = extract_text(title_m.group(1)) if title_m else ""
    sub_text   = extract_text(sub_m.group(1))   if sub_m   else ""
    theme_text = " ".join(THEME_LABELS[t] for t in themes)
    combined = f"{title_text} {sub_text} {theme_text}"
    return strip_accents(combined)

def upsert_attr(opening_tag: str, attr: str, value: str) -> str:
    """Insert or replace `attr="value"` inside an <a ...> opening tag."""
    pattern = re.compile(rf'\s{re.escape(attr)}="[^"]*"')
    new_attr = f' {attr}="{value}"'
    if pattern.search(opening_tag):
        return pattern.sub(new_attr, opening_tag)
    return opening_tag[:-1] + new_attr + ">"

def slug_from_href(href: str) -> str | None:
    m = re.fullmatch(r'([a-z][a-z0-9-]*)/', href)
    return m.group(1) if m else None

def numero_from_card(card_html: str) -> str | None:
    """Pull the leading 2-digit numero from <div class="serie-tag">."""
    m = re.search(r'<div class="serie-tag">(\d{2})\s*\W', card_html)
    return m.group(1) if m else None

def main() -> int:
    src = INDEX.read_text(encoding="utf-8")
    card_re = re.compile(
        r'(<a\s+href="([^"]+)"\s+class="serie[^"]*"[^>]*>)(.*?)(</a>)',
        re.S,
    )
    updated = 0
    skipped = []

    def replace(match: re.Match) -> str:
        nonlocal updated
        opening, href, body, closing = match.groups()
        slug = slug_from_href(href)
        if slug is None or slug not in CARDS:
            skipped.append(href)
            return match.group(0)
        type_, themes, date = CARDS[slug]
        numero = numero_from_card(body) or "00"
        search_text = build_search_text(body, themes)
        opening = upsert_attr(opening, "data-type", type_)
        opening = upsert_attr(opening, "data-themes", " ".join(themes))
        opening = upsert_attr(opening, "data-date", date)
        opening = upsert_attr(opening, "data-numero", numero)
        opening = upsert_attr(opening, "data-search-text", search_text)
        updated += 1
        return opening + body + closing

    new_src = card_re.sub(replace, src)
    INDEX.write_text(new_src, encoding="utf-8")
    print(f"Tagged {updated} cards.")
    if skipped:
        print(f"Skipped (no slug mapping): {skipped}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
