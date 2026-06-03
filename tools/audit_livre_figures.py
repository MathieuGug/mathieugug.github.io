"""Scan livre/chapitres/*.md and emit livre/figures.json — table of figures.

Each entry : { chapter, chapter_slug, chapter_title, alt, src, basename,
section_title, section_anchor }.

`src` is normalized to a path relative to the repo root (so livre/figures.html
can rewrite it for its own location). `basename` is the file stem without
extension — used as the deep-link anchor (`#chNN/fig-<basename>`).

Re-run after editing chapters.
"""

from __future__ import annotations

import json
import os
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CH_DIR = ROOT / "livre" / "chapitres"
OUT_JSON = ROOT / "livre" / "figures.json"

IMG_RE = re.compile(r"!\[([^\]\n]*?)(?:\|\d+)?\]\(([^)\s]+)\)")
HEADING_RE = re.compile(r"^(#{2,3})\s+(.+?)\s*$")
FRONTMATTER_RE = re.compile(r"^---\r?\n([\s\S]+?)\r?\n---\r?\n")
TITLE_RE = re.compile(r"^titre:\s*\"?(.+?)\"?\s*$", re.M)


def slugify(text: str) -> str:
    t = text.lower()
    t = "".join(c for c in unicodedata.normalize("NFD", t)
                if unicodedata.category(c) != "Mn")
    t = re.sub(r"[^a-z0-9]+", "-", t)
    return t.strip("-")[:60]


def main() -> None:
    figures: list[dict] = []
    files = sorted(CH_DIR.glob("ch??-*.md"))
    for fp in files:
        m = re.match(r"^ch(\d{2})-(.+)\.md$", fp.name)
        if not m:
            continue
        ch_num = int(m.group(1))
        ch_slug = fp.stem
        content = fp.read_text(encoding="utf-8")
        # Normalize CRLF
        content = content.replace("\r\n", "\n").replace("\r", "\n")
        # Extract chapter title from frontmatter
        ch_title = ""
        fm = FRONTMATTER_RE.match(content)
        if fm:
            tm = TITLE_RE.search(fm.group(1))
            if tm:
                ch_title = tm.group(1)
        body = content[fm.end():] if fm else content
        lines = body.split("\n")
        # Track active heading as we scan line by line
        cur_h_level = 0
        cur_h_title = ""
        cur_h_anchor = ""
        seen_anchors: dict[str, int] = {}
        for line in lines:
            hm = HEADING_RE.match(line)
            if hm:
                cur_h_level = len(hm.group(1))
                cur_h_title = hm.group(2).strip()
                base = slugify(cur_h_title) or "h"
                anchor = base
                n = 2
                while anchor in seen_anchors:
                    anchor = f"{base}-{n}"
                    n += 1
                seen_anchors[anchor] = 1
                cur_h_anchor = anchor
                continue
            for im in IMG_RE.finditer(line):
                alt = im.group(1).strip()
                raw_src = im.group(2).strip()
                # Resolve relative to the chapter file's directory.
                abs_path = (CH_DIR / raw_src).resolve()
                try:
                    rel = abs_path.relative_to(ROOT)
                except ValueError:
                    # Outside repo — skip
                    continue
                rel_str = str(rel).replace("\\", "/")
                basename = abs_path.stem
                figures.append({
                    "chapter": ch_num,
                    "chapter_slug": ch_slug,
                    "chapter_title": ch_title,
                    "alt": alt,
                    "src": rel_str,
                    "basename": basename,
                    "section_title": cur_h_title,
                    "section_anchor": cur_h_anchor,
                })

    OUT_JSON.write_text(
        json.dumps(figures, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(figures)} figures -> {OUT_JSON}")


if __name__ == "__main__":
    main()
