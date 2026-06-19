"""Notes.md + HTML rendering for veille-presse editions."""
from collections import defaultdict
from pathlib import Path

from tools.veille_presse.paths import ASSETS_DIR


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
