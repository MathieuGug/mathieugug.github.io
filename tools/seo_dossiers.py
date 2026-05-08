#!/usr/bin/env python3
"""seo_dossiers.py — single-pass SEO sweep for mathieugug.github.io.

For every dossier discovered in the root index.html main grid, this script:
  1. Generates {dossier}/og.png via tools/og-card.py (1200x630 social card).
  2. Injects a complete SEO meta-tag block (Open Graph, Twitter Card,
     canonical, JSON-LD) into the hub (index.html) and every companion file
     (app, slideshow, scrolly, journal, livre).
  3. Generates /og-default.png for the root index, and injects SEO into the
     root index.html.

Idempotent: if the marker comment '<!-- og: -->' is already present in a file,
the SEO block insertion is skipped for that file (the og.png is still
re-generated).

Usage:
    python tools/seo_dossiers.py [--dry-run] [--only mcp-plateforme,...] [--skip-images]

The dossier metadata (num, date, type, title, sub) is parsed from
index.html's <a class="serie"> blocks — this is the single source of truth.
The full text of <meta name="description"> on each existing file is preserved
unless --override-desc is passed (we only add new tags, never overwrite).
"""

from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
SITE_URL = "https://mathieugug.github.io"
AUTHOR = "Mathieu Guglielmino"
SITE_NAME = "Mathieu Guglielmino"
LOCALE = "fr_FR"

OG_MARKER_START = "<!-- og:start -->"
OG_MARKER_END = "<!-- og:end -->"

MONTH_FR = {
    "janvier": "01", "février": "02", "mars": "03", "avril": "04",
    "mai": "05", "juin": "06", "juillet": "07", "août": "08",
    "septembre": "09", "octobre": "10", "novembre": "11", "décembre": "12",
}


@dataclass
class Dossier:
    slug: str
    num: str
    date_iso: str          # 2026-05-08
    date_human: str        # 8 mai 2026
    kind: str              # Dossier | Veille | Étude
    title: str             # MCP, le HTTP des agents
    sub: str               # description text
    files: list[str] = field(default_factory=list)


def parse_index(index_html: Path) -> list[Dossier]:
    soup = BeautifulSoup(index_html.read_text(encoding="utf-8"), "html.parser")
    out: list[Dossier] = []
    for a in soup.select("a.serie"):
        href = (a.get("href") or "").rstrip("/")
        if not href or "/" in href:
            continue
        slug = href
        tag_div = a.select_one(".serie-tag")
        type_div = a.select_one(".serie-type")
        title_h = a.select_one(".serie-title")
        sub_p = a.select_one(".serie-sub")
        if not (tag_div and type_div and title_h and sub_p):
            continue
        tag_text = tag_div.get_text(strip=True)
        m = re.match(r"^\s*(\d+)\s*·\s*(.+)$", tag_text)
        if not m:
            continue
        num, date_human = m.group(1), m.group(2).strip()
        date_iso = parse_french_date(date_human)
        title_text = re.sub(r"\s+", " ", title_h.get_text()).strip()
        sub_text = re.sub(r"\s+", " ", sub_p.get_text()).strip()
        kind = type_div.get_text(strip=True)
        out.append(Dossier(slug, num, date_iso, date_human, kind, title_text, sub_text))
    return out


def parse_french_date(human: str) -> str:
    """`8 mai 2026` -> `2026-05-08`. Tolerates `1er`, `1er mai 2026`."""
    h = human.strip().lower().replace("1er", "1").replace("1ᵉʳ", "1")
    parts = h.split()
    if len(parts) >= 3 and parts[1] in MONTH_FR:
        d = int(re.sub(r"\D", "", parts[0]) or "0")
        m = MONTH_FR[parts[1]]
        y = parts[2]
        return f"{y}-{m}-{d:02d}"
    # fallback: best-effort YYYY-MM
    if len(parts) >= 2 and parts[0] in MONTH_FR:
        return f"{parts[1]}-{MONTH_FR[parts[0]]}-01"
    raise ValueError(f"unparseable date: {human!r}")


def discover_files(slug: str) -> list[Path]:
    """All HTML files inside a dossier directory (hub + apps + slideshows + extras)."""
    folder = ROOT / slug
    if not folder.is_dir():
        return []
    return sorted(p for p in folder.glob("*.html") if p.is_file())


def clean_social_title(title: str) -> str:
    """Strip the trailing ' — dossier NN' / ' · étude NN' / ' · veille NN'
    suffix from a page title — these numbers are useful on the index page
    for at-a-glance ordering, but they add noise on a LinkedIn / Slack /
    iMessage unfurl. The browser-tab `<title>` keeps the number; only the
    `og:title` and `twitter:title` are cleaned.

    Also strips a few other low-value taglines like ' · couverture' or a
    trailing ' — Mathieu Guglielmino' (since og:site_name and meta author
    already convey authorship).
    """
    s = title
    # Trailing dossier/etude/veille number, with em-dash, en-dash, or middle dot
    s = re.sub(r"\s*[—–·\-]\s*(?:dossier|étude|etude|veille|note|chronique)\s*\d+\s*$", "", s, flags=re.IGNORECASE)
    # Trailing author name, in case it slipped into a <title>
    s = re.sub(r"\s*[—–·\-]\s*Mathieu\s+Guglielmino\s*$", "", s, flags=re.IGNORECASE)
    return s.strip()


def short_desc(full: str, max_chars: int = 240) -> str:
    """Compact description for og:description (target ≤ 200 chars). Cuts on sentence boundary."""
    txt = re.sub(r"\s+", " ", full).strip()
    if len(txt) <= max_chars:
        return txt
    cut = txt[: max_chars - 1]
    # try to cut on a punctuation
    for stop in [". ", " — ", "; ", ", "]:
        idx = cut.rfind(stop)
        if idx > max_chars * 0.6:
            return cut[: idx + 1].rstrip() + "…"
    return cut.rsplit(" ", 1)[0] + "…"


def detect_accent_word(title: str) -> str | None:
    """Pick a single italicized/emphatic word for the og card.

    Override values must be a literal substring of the title (case-insensitive),
    otherwise the og-card.py renderer cannot find them and silently skips the
    accent. The fallback is the last word of the title.
    """
    # (substring_to_match_in_title_lowercased, accent_word_to_color)
    # The accent word MUST appear in the title — verify when adding entries.
    overrides = [
        ("musk", "Altman"),                # Procès Musk v. Altman → accent on Altman
        ("anatomie", "Anatomie"),          # Anatomie d'un système agentique
        ("mcp", "agents"),                 # MCP, le HTTP des agents
        ("roi", "ROI"),                    # Mesurer le ROI ...
        ("raisonnement", "raisonnement"),  # Les modèles de raisonnement
        ("inférence", "inférence"),        # L'économie unitaire de l'inférence
        ("narrative", "narratives"),       # Expériences narratives
        ("world", "models"),               # World models
        ("travail", "travail"),            # L'IA et le travail
        ("computer use", "computer"),      # Agents computer use
        ("mémoire", "mémoire"),            # La mémoire agentique
        ("harness", "Harness"),            # Harness agentiques
        ("jailbreak", "Jailbreak"),        # Jailbreak des LLMs
        ("évaluer", "agent"),              # Évaluer un agent
        ("observabilité", "agents"),       # Observabilité des agents IA
        ("gouverner", "gouverner"),        # Gouverner l'agent
    ]
    low = title.lower()
    for key, word in overrides:
        if key in low and word.lower() in low:
            return word
    # fallback: last word, stripped of trailing punctuation
    parts = re.split(r"[\s,]+", title.strip())
    if parts:
        return parts[-1].strip(".:;,)('\"")
    return None


def og_card_for(d: Dossier, dry: bool = False) -> Path:
    """Generate {slug}/og.png. Skips if --skip-images was set globally."""
    output = ROOT / d.slug / "og.png"
    eyebrow = f"{d.kind} {d.num} · {d.date_human}"
    accent = detect_accent_word(d.title)
    cmd = [
        sys.executable,
        str(ROOT / "tools" / "og-card.py"),
        "--title", d.title,
        "--eyebrow", eyebrow,
        "--output", str(output),
        "--kind", d.kind.lower().replace("é", "e"),
    ]
    if accent:
        cmd += ["--accent-word", accent]
    if dry:
        print("[dry] " + " ".join(cmd))
        return output
    subprocess.run(cmd, check=True)
    return output


def og_default_card(dry: bool = False) -> Path:
    output = ROOT / "og-default.png"
    cmd = [
        sys.executable,
        str(ROOT / "tools" / "og-card.py"),
        "--title", "Mathieu Guglielmino",
        "--eyebrow", "articles · études · veille IA",
        "--output", str(output),
        "--accent-word", "Guglielmino",
        "--kind", "veille",
    ]
    if dry:
        print("[dry] " + " ".join(cmd))
        return output
    subprocess.run(cmd, check=True)
    return output


# ─────────────────────────────────────────────────────────
# SEO block injection
# ─────────────────────────────────────────────────────────


def build_seo_block(
    *,
    title: str,
    description: str,
    canonical_url: str,
    og_image_url: str,
    og_type: str = "article",
    published_date: str | None = None,
    keywords: list[str] | None = None,
) -> str:
    """Return the multi-line SEO block (no leading/trailing newline). Wrapped
    in <!-- og:start --> / <!-- og:end --> markers for idempotency.

    The browser-tab `<title>` and the social `og:title` / `twitter:title` use
    different strings: the tab keeps useful nav metadata (e.g. ' — dossier 14')
    while the social title is cleaned via `clean_social_title()` so unfurls
    don't show that filler number prominently.
    """
    social_title = clean_social_title(title)
    title_attr = html_escape_attr(social_title)
    desc_attr = html_escape_attr(description)
    image_attr = og_image_url
    url_attr = canonical_url

    lines = [
        OG_MARKER_START,
        f'<meta name="author" content="{AUTHOR}">',
        f'<link rel="canonical" href="{url_attr}">',
    ]
    if keywords:
        lines.append(f'<meta name="keywords" content="{html_escape_attr(", ".join(keywords))}">')

    lines += [
        f'<meta property="og:type" content="{og_type}">',
        f'<meta property="og:site_name" content="{SITE_NAME}">',
        f'<meta property="og:locale" content="{LOCALE}">',
        f'<meta property="og:url" content="{url_attr}">',
        f'<meta property="og:title" content="{title_attr}">',
        f'<meta property="og:description" content="{desc_attr}">',
        f'<meta property="og:image" content="{image_attr}">',
        f'<meta property="og:image:width" content="1200">',
        f'<meta property="og:image:height" content="630">',
        f'<meta property="og:image:alt" content="{title_attr} — couverture social">',
    ]
    if og_type == "article" and published_date:
        lines += [
            f'<meta property="article:published_time" content="{published_date}">',
            f'<meta property="article:author" content="{AUTHOR}">',
        ]

    lines += [
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{title_attr}">',
        f'<meta name="twitter:description" content="{desc_attr}">',
        f'<meta name="twitter:image" content="{image_attr}">',
    ]

    # JSON-LD — also use the cleaned social_title (search engines surface
    # `headline` directly; the dossier number is filler in that context too).
    if og_type == "article":
        ld = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": social_title,
            "description": description,
            "image": og_image_url,
            "url": canonical_url,
            "datePublished": published_date or "",
            "inLanguage": "fr-FR",
            "author": {
                "@type": "Person",
                "name": AUTHOR,
                "url": SITE_URL + "/",
            },
            "publisher": {
                "@type": "Person",
                "name": AUTHOR,
                "url": SITE_URL + "/",
            },
        }
    else:
        ld = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": SITE_NAME,
            "url": canonical_url,
            "description": description,
            "inLanguage": "fr-FR",
            "author": {"@type": "Person", "name": AUTHOR},
        }

    import json
    lines.append('<script type="application/ld+json">')
    lines.append(json.dumps(ld, ensure_ascii=False, indent=0).replace("\n", ""))
    lines.append("</script>")
    lines.append(OG_MARKER_END)

    return "\n".join(lines)


def html_escape_attr(s: str) -> str:
    return (
        s.replace("&", "&amp;")
         .replace('"', "&quot;")
         .replace("<", "&lt;")
         .replace(">", "&gt;")
    )


def inject_seo(html_path: Path, block: str, dry: bool = False) -> bool:
    """Inject `block` before the `<link rel="icon"` line if not already present.
    Returns True if a change was made."""
    text = html_path.read_text(encoding="utf-8")
    if OG_MARKER_START in text:
        # Replace the existing block in-place (idempotent re-runs).
        new_text = re.sub(
            re.escape(OG_MARKER_START) + r".*?" + re.escape(OG_MARKER_END),
            block,
            text,
            count=1,
            flags=re.DOTALL,
        )
        if new_text == text:
            return False
        if dry:
            print(f"[dry] would update existing SEO block: {html_path.relative_to(ROOT)}")
            return False
        html_path.write_text(new_text, encoding="utf-8")
        print(f"updated SEO block: {html_path.relative_to(ROOT)}")
        return True

    # First-time insert: anchor on `<link rel="icon"`.
    pattern = re.compile(r'^([ \t]*)<link\s+rel="icon"', re.MULTILINE)
    m = pattern.search(text)
    if not m:
        print(f"WARN: no <link rel=\"icon\"> anchor in {html_path.relative_to(ROOT)} — skipping", file=sys.stderr)
        return False
    indent = m.group(1)
    indented_block = "\n".join(indent + line if line else "" for line in block.split("\n"))
    new_text = text[:m.start()] + indented_block + "\n" + text[m.start():]
    if dry:
        print(f"[dry] would insert SEO block: {html_path.relative_to(ROOT)}")
        return False
    html_path.write_text(new_text, encoding="utf-8")
    print(f"inserted SEO block: {html_path.relative_to(ROOT)}")
    return True


def existing_meta(html_path: Path) -> tuple[str, str]:
    """Return (title, description) from an HTML file."""
    soup = BeautifulSoup(html_path.read_text(encoding="utf-8"), "html.parser")
    title_el = soup.find("title")
    title = (title_el.get_text(strip=True) if title_el else "")
    desc_el = soup.find("meta", attrs={"name": "description"})
    desc = (desc_el.get("content") if desc_el else "") or ""
    return title, desc


# ─────────────────────────────────────────────────────────
# File classification
# ─────────────────────────────────────────────────────────


def file_role(name: str) -> str:
    """hub | app | slideshow | scrolly | journal | livre | other."""
    n = name.lower()
    if n == "index.html":
        return "hub"
    if "-app.html" in n:
        return "app"
    if "-slideshow.html" in n:
        return "slideshow"
    if "-scrolly.html" in n or n == "scrolly.html":
        return "scrolly"
    if "journal.html" in n:
        return "journal"
    if "livre" in n and ("-print" not in n):
        return "livre"
    if "livre-print" in n:
        return "livre-print"
    return "other"


# ─────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────


def process_dossier(d: Dossier, dry: bool, skip_images: bool) -> None:
    folder = ROOT / d.slug
    if not folder.is_dir():
        print(f"WARN: {d.slug} folder missing — skipping")
        return

    if not skip_images:
        og_card_for(d, dry=dry)

    og_image_url = f"{SITE_URL}/{d.slug}/og.png"
    files = discover_files(d.slug)
    if not files:
        print(f"WARN: no .html in {d.slug}/")
        return

    for f in files:
        role = file_role(f.name)
        if role == "livre-print":
            # print-version, exclude from social previews
            continue
        title, desc = existing_meta(f)
        if not desc:
            desc = short_desc(d.sub)
        if role == "hub":
            url = f"{SITE_URL}/{d.slug}/"
            og_type = "website"
            published = d.date_iso
        else:
            url = f"{SITE_URL}/{d.slug}/{f.name}"
            og_type = "article"
            published = extract_date_from_filename(f.name) or d.date_iso

        block = build_seo_block(
            title=title or d.title,
            description=desc,
            canonical_url=url,
            og_image_url=og_image_url,
            og_type=og_type,
            published_date=published,
            keywords=keyword_hints(d),
        )
        inject_seo(f, block, dry=dry)


def extract_date_from_filename(name: str) -> str | None:
    m = re.match(r"^(\d{4})(\d{2})(\d{2})", name)
    if not m:
        return None
    return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"


def keyword_hints(d: Dossier) -> list[str]:
    base = ["IA agentique", "Mathieu Guglielmino", "agents IA", d.kind.lower()]
    # add a couple of theme-specific keywords from the slug
    extras = d.slug.replace("-", " ").split()
    return base + extras


def process_root_index(dry: bool, skip_images: bool) -> None:
    if not skip_images:
        og_default_card(dry=dry)
    f = ROOT / "index.html"
    title, desc = existing_meta(f)
    block = build_seo_block(
        title=title,
        description=desc,
        canonical_url=f"{SITE_URL}/",
        og_image_url=f"{SITE_URL}/og-default.png",
        og_type="website",
        published_date=None,
        keywords=["IA agentique", "veille IA", "data storytelling", "Mathieu Guglielmino"],
    )
    inject_seo(f, block, dry=dry)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--only", help="comma-separated slugs to limit the run")
    ap.add_argument("--skip-images", action="store_true", help="skip og.png generation, only inject meta tags")
    ap.add_argument("--skip-root", action="store_true")
    args = ap.parse_args()

    only = set(args.only.split(",")) if args.only else None
    dossiers = parse_index(ROOT / "index.html")
    print(f"discovered {len(dossiers)} dossiers in index.html")
    for d in dossiers:
        if only and d.slug not in only:
            continue
        print(f"\n── {d.slug} (#{d.num}, {d.date_iso}, {d.kind}) — {d.title}")
        process_dossier(d, dry=args.dry_run, skip_images=args.skip_images)

    if not args.skip_root and not only:
        print("\n── root index.html")
        process_root_index(dry=args.dry_run, skip_images=args.skip_images)


if __name__ == "__main__":
    main()
