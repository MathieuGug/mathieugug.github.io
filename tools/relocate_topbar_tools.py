"""Idempotent: relocate #toggle-toc and #toggle-sources from <header class="site">
into a new <div class="topbar-tools"> inside <header class="topbar">. Also remove
the legacy pull-tab buttons #sources-collapse-btn and #sources-expand-btn (replaced
by the topbar tools that collapse both sidebars symmetrically on desktop).

Pour l'app avec qualif (analytics-agentique-gcp), le bouton #toggle-qualif reste
en dehors du .topbar-tools (à sa position actuelle dans la topbar). Le cluster
de droite finit donc visuellement : [Sommaire][Sources][Profil] + back-nav.

Run from repo root:
    python tools/relocate_topbar_tools.py                  # apply to all
    python tools/relocate_topbar_tools.py --check          # dry-run, report only
    python tools/relocate_topbar_tools.py --only <slug>    # filter by path substring
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def find_apps() -> list[Path]:
    return sorted(ROOT.glob("*/2026*-app.html"))


def transform(content: str) -> tuple[str, list[str]]:
    """Return (new_content, list_of_changes_applied). Idempotent."""
    changes: list[str] = []

    has_tools_div = re.search(r'<div\s+class="topbar-tools"', content) is not None

    # Buttons match (single-line, attributes-in-any-order).
    btn_toc_re = re.compile(
        r'^([ \t]*)<button\b[^>]*\bid="toggle-toc"[^>]*>[^<]*</button>[ \t]*\n',
        re.MULTILINE,
    )
    btn_src_re = re.compile(
        r'^([ \t]*)<button\b[^>]*\bid="toggle-sources"[^>]*>[^<]*</button>[ \t]*\n',
        re.MULTILINE,
    )

    if not has_tools_div:
        m_toc = btn_toc_re.search(content)
        m_src = btn_src_re.search(content)
        if not (m_toc and m_src):
            return content, [
                "SKIP: #toggle-toc and/or #toggle-sources not found at top-level — "
                "manual migration needed"
            ]

        toc_inner = m_toc.group(0).strip()
        src_inner = m_src.group(0).strip()

        # Remove both buttons from their original location.
        content = btn_toc_re.sub("", content, count=1)
        content = btn_src_re.sub("", content, count=1)

        # Build the .topbar-tools block. Indentation matches existing topbar children
        # (4 spaces for the div, 6 for its buttons).
        tools_block = (
            '    <div class="topbar-tools">\n'
            f"      {toc_inner}\n"
            f"      {src_inner}\n"
            "    </div>\n"
        )

        # Insert just before either <button id="toggle-qualif" ...> (if present in
        # topbar) or <nav class="back-nav" ...> (otherwise).
        qualif_anchor_re = re.compile(
            r'(?m)^([ \t]*)<button[^>]*\bid="toggle-qualif"[^>]*>'
        )
        nav_anchor_re = re.compile(
            r'(?m)^([ \t]*)<nav\s+class="back-nav"'
        )

        anchor_match = qualif_anchor_re.search(content) or nav_anchor_re.search(content)
        if not anchor_match:
            return content, [
                "SKIP: no insertion anchor found (#toggle-qualif or .back-nav inside topbar)"
            ]

        anchor_line_start = anchor_match.start()
        content = content[:anchor_line_start] + tools_block + content[anchor_line_start:]
        changes.append("moved toggle-toc + toggle-sources into .topbar-tools")

    # Pull-tab cleanup — multi-line attribute wrapping supported via [^<] (which
    # accepts newlines in Python regex negated classes).
    pull_collapse_re = re.compile(
        r'[ \t]*<button\b[^>]*\bid="sources-collapse-btn"[^>]*>[^<]*</button>[ \t]*\n?'
    )
    pull_expand_re = re.compile(
        r'[ \t]*<button\b[^>]*\bid="sources-expand-btn"[^>]*>[^<]*</button>[ \t]*\n?'
    )
    if pull_collapse_re.search(content):
        content = pull_collapse_re.sub("", content, count=1)
        changes.append("removed #sources-collapse-btn pull-tab")
    if pull_expand_re.search(content):
        content = pull_expand_re.sub("", content, count=1)
        changes.append("removed #sources-expand-btn pull-tab")

    # Inline CSS leaks cleanup — dead code from before lib extraction. These
    # rules style elements that no longer exist (the pull-tab buttons were just
    # removed above), so they're pure clutter.
    leak_patterns = [
        # Standalone comment line "/* Sidebar edge toggles */"
        re.compile(r'\n[ \t]*/\* Sidebar edge toggles \*/\n'),
        # .sidebar-edge-toggle { ... } block (multi-line, balanced braces)
        re.compile(r'\n[ \t]*\.sidebar-edge-toggle\s*\{[^}]*\}\n'),
        # .sidebar-edge-toggle:hover { ... } single-line
        re.compile(r'\n[ \t]*\.sidebar-edge-toggle:hover\s*\{[^}]*\}\n'),
        # .sidebar-edge-toggle:focus-visible { ... } single-line
        re.compile(r'\n[ \t]*\.sidebar-edge-toggle:focus-visible\s*\{[^}]*\}\n'),
        # /* Pinned to viewport ... */ orphan comment block (multi-line)
        re.compile(
            r'\n[ \t]*/\* Pinned to viewport[^*]*(?:\*(?!/)[^*]*)*\*/\n'
        ),
        # #sources-expand-btn { ... } block (multi-line)
        re.compile(r'\n[ \t]*#sources-expand-btn\s*\{[^}]*\}\n'),
        # #sources-expand-btn[hidden] { ... } single-line
        re.compile(r'\n[ \t]*#sources-expand-btn\[hidden\]\s*\{[^}]*\}\n'),
        # @media wrapper that only contained .sidebar-edge-toggle hide: strip the
        # selector from the selector list inside print / max-width media queries.
    ]
    leak_changed = False
    for pat in leak_patterns:
        new_content = pat.sub("\n", content)
        if new_content != content:
            content = new_content
            leak_changed = True

    # Selector-list cleanup: ", .sidebar-edge-toggle" inside a longer selector list
    # like "#toc, #sources, ..., .sidebar-edge-toggle { display: none; }".
    selector_list_re = re.compile(r',\s*\.sidebar-edge-toggle\b')
    if selector_list_re.search(content):
        content = selector_list_re.sub("", content)
        leak_changed = True

    # Standalone single-line rule inside a media query :
    # ".sidebar-edge-toggle { display: none !important; }"
    standalone_hide_re = re.compile(
        r'\n[ \t]*\.sidebar-edge-toggle\s*\{\s*display:\s*none\s*!important;?\s*\}[ \t]*\n'
    )
    if standalone_hide_re.search(content):
        content = standalone_hide_re.sub("\n", content)
        leak_changed = True

    if leak_changed:
        changes.append("cleaned up inline CSS leaks (.sidebar-edge-toggle / #sources-expand-btn)")

    return content, changes


def main() -> int:
    args = sys.argv[1:]
    check = "--check" in args
    only = None
    if "--only" in args:
        idx = args.index("--only")
        if idx + 1 < len(args):
            only = args[idx + 1]

    files = find_apps()
    if only:
        files = [f for f in files if only in str(f.relative_to(ROOT))]
    if not files:
        print("no files matched", file=sys.stderr)
        return 1

    total_changed = 0
    for path in files:
        original = path.read_text(encoding="utf-8")
        new_content, changes = transform(original)
        rel = path.relative_to(ROOT)
        if not changes:
            print(f"  unchanged  {rel}")
            continue
        if any(c.startswith("SKIP") for c in changes):
            print(f"  SKIP       {rel} — {changes[0]}")
            continue
        if check:
            print(f"  would edit {rel} — {', '.join(changes)}")
        else:
            path.write_text(new_content, encoding="utf-8", newline="\n")
            print(f"  edited     {rel} — {', '.join(changes)}")
        total_changed += 1

    print()
    if check:
        print(f"{total_changed} file(s) would be edited (dry-run).")
    else:
        print(f"{total_changed} file(s) edited.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
