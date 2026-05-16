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
