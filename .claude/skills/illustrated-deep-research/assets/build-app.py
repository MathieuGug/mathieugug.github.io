#!/usr/bin/env python3
"""
build-app.py — assemble a companion HTML app from a host scaffold + content fragments.

Why this exists: writing a 1500–2000 line app HTML through repeated Edit() calls is
expensive and error-prone. The recurring pattern is to start from an existing
deliverable (or `assets/app-template.html`) — which already has all the CSS, JS,
modal/tooltip/zoom/sticky-sidebar/mobile-friendliness machinery wired correctly —
and swap out three blocks:

  1. The <main id="report">…</main> body (prose + figures)
  2. The <ol id="sources-list">…</ol> entries inside <aside id="sources">
  3. The `const SCHEMAS = { … };` JS object that drives modal content

Plus inline the 5–10 SVGs from `images/` at placeholder markers.

Usage:
  python3 build-app.py \\
      --host  path/to/host-scaffold.html \\
      --main  path/to/main-fragment.html \\
      --sources path/to/sources-list-fragment.html \\
      --schemas path/to/schemas-fragment.js \\
      --images path/to/images-dir \\
      --out   path/to/output-app.html

Marker conventions inside the main fragment:
  <!--INLINE-SVG:NN-->   → replaced by the inline content of `images/<date>-NN-*.svg`
                            with data-schema-id="schema-NN" injected into <svg ...>

The host file is the source of truth for the framework (CSS, JS, sticky-sidebar
collapse, zoom overlay, panel-close, etc.). Only the three content blocks above
are swapped. Anything else in the host file is preserved verbatim.

Idempotent: running with the same inputs produces the same output.
"""

from __future__ import annotations
import argparse
import re
import sys
from pathlib import Path


def _swap_block(haystack: str, start_marker: str, end_marker: str, replacement: str, *, name: str) -> str:
    """Replace the first occurrence of [start_marker .. end_marker] (inclusive of both)
    with `replacement`. Errors if either marker is missing or end precedes start.
    """
    s = haystack.find(start_marker)
    if s < 0:
        raise SystemExit(f"[build-app] start marker not found ({name}): {start_marker!r}")
    # Find end_marker AFTER start_marker
    e = haystack.find(end_marker, s + len(start_marker))
    if e < 0:
        raise SystemExit(f"[build-app] end marker not found ({name}) after start: {end_marker!r}")
    e_full = e + len(end_marker)
    return haystack[:s] + replacement + haystack[e_full:]


def _inject_schema_id(svg_text: str, schema_id: str) -> str:
    """Ensure the root <svg ...> tag carries data-schema-id="<schema_id>".
    If it already has data-schema-id="…", overwrite. Otherwise insert as the first attribute.
    """
    # Match the opening <svg ...> (first one in the file)
    m = re.search(r"<svg\b([^>]*)>", svg_text, flags=re.IGNORECASE)
    if not m:
        raise SystemExit(f"[build-app] no <svg> root tag found while injecting {schema_id}")
    attrs = m.group(1)
    if re.search(r'\bdata-schema-id\s*=', attrs):
        new_attrs = re.sub(r'\bdata-schema-id\s*=\s*"[^"]*"', f'data-schema-id="{schema_id}"', attrs)
    else:
        new_attrs = f' data-schema-id="{schema_id}"' + attrs
    return svg_text[:m.start()] + f"<svg{new_attrs}>" + svg_text[m.end():]


def _inline_svgs(main_html: str, images_dir: Path) -> str:
    """Replace <!--INLINE-SVG:NN--> markers with the content of images_dir/*-NN-*.svg.

    The lookup uses glob `*-NN-*.svg` (NN zero-padded as authored). If multiple files
    match, the first lexicographically wins. Errors loudly if no match.
    """
    pattern = re.compile(r"<!--\s*INLINE-SVG:(\d{2,3})\s*-->")

    def _resolve(num: str) -> str:
        candidates = sorted(images_dir.glob(f"*-{num}-*.svg"))
        if not candidates:
            raise SystemExit(f"[build-app] no SVG match for marker {num} in {images_dir}/*-{num}-*.svg")
        svg_text = candidates[0].read_text(encoding="utf-8")
        # Strip the XML declaration if present — it doesn't belong inline in HTML
        svg_text = re.sub(r"^\s*<\?xml[^?]*\?>\s*", "", svg_text)
        return _inject_schema_id(svg_text, f"schema-{num}")

    def _sub(m: re.Match[str]) -> str:
        return _resolve(m.group(1))

    out = pattern.sub(_sub, main_html)
    # Sanity check: report any unreplaced INLINE-SVG markers
    leftover = pattern.findall(out)
    if leftover:
        raise SystemExit(f"[build-app] unreplaced INLINE-SVG markers (regex bug?): {leftover}")
    return out


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--host", required=True, type=Path, help="host scaffold HTML (CSS/JS framework, will be preserved)")
    ap.add_argument("--main", required=True, type=Path, help="new <main id=\"report\"> innerHTML fragment")
    ap.add_argument("--sources", required=True, type=Path, help="new <ol id=\"sources-list\"> innerHTML fragment")
    ap.add_argument("--schemas", required=True, type=Path, help="new SCHEMAS JS object body (the bare object literal: { ... })")
    ap.add_argument("--images", required=True, type=Path, help="directory holding the SVG files referenced by INLINE-SVG markers")
    ap.add_argument("--out", required=True, type=Path, help="output app HTML path")
    args = ap.parse_args()

    host = args.host.read_text(encoding="utf-8")
    main_frag = args.main.read_text(encoding="utf-8")
    sources_frag = args.sources.read_text(encoding="utf-8")
    schemas_frag = args.schemas.read_text(encoding="utf-8").strip()

    # Inline SVGs into main fragment
    main_inlined = _inline_svgs(main_frag, args.images)

    # Swap 1 — <main id="report"> … </main>
    new_main = '<main id="report">\n' + main_inlined.strip() + "\n    </main>"
    host = _swap_block(
        host,
        '<main id="report">',
        '</main>',
        new_main,
        name="main#report",
    )

    # Swap 2 — <ol id="sources-list"> … </ol>
    new_sources = '<ol id="sources-list">\n' + sources_frag.strip() + "\n        </ol>"
    host = _swap_block(
        host,
        '<ol id="sources-list">',
        '</ol>',
        new_sources,
        name="sources-list",
    )

    # Swap 3 — const SCHEMAS = { … };
    # We match from `const SCHEMAS = {` up to the matching `};` that immediately follows
    # the SCHEMAS object literal. Strategy: find `const SCHEMAS = {`, then scan forward
    # for balanced braces and consume up to the next `};` at brace-depth 0.
    s_anchor = "const SCHEMAS = {"
    s = host.find(s_anchor)
    if s < 0:
        raise SystemExit("[build-app] `const SCHEMAS = {` not found in host")
    depth = 0
    i = s + len(s_anchor) - 1   # position of the opening `{`
    end = -1
    while i < len(host):
        c = host[i]
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                # Expect immediate `;` after the closing brace
                # (allow whitespace tolerance)
                j = i + 1
                while j < len(host) and host[j] in ' \t':
                    j += 1
                if j < len(host) and host[j] == ';':
                    end = j + 1
                    break
                else:
                    end = i + 1
                    break
        i += 1
    if end < 0:
        raise SystemExit("[build-app] unable to find closing `};` for SCHEMAS object")
    # Normalize the schemas fragment: strip trailing semicolon, the script will re-add `;`
    schemas_body = schemas_frag.rstrip().rstrip(';').rstrip()
    if not schemas_body.startswith('{'):
        raise SystemExit("[build-app] schemas fragment must start with `{` (object literal)")
    new_schemas = f"const SCHEMAS = {schemas_body};"
    host = host[:s] + new_schemas + host[end:]

    args.out.write_text(host, encoding="utf-8")
    print(f"[build-app] wrote {args.out} ({len(host):,} chars)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
