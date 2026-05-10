#!/usr/bin/env python3
"""Migre une app */2026*-app.html vers la bibliothèque /assets/dossier-app.

Usage:
    python tools/extract_to_lib.py <app.html> [<app2.html> ...]
    python tools/extract_to_lib.py --dry-run <app.html>
    python tools/extract_to_lib.py --all   # toutes les apps
    python tools/extract_to_lib.py --dry-run --all

Le script :
1. Détecte si l'app est déjà migrée (présence de <script src="/assets/dossier-app.js">).
2. Localise le bloc JS comportemental via le marker '// Modal dispatcher'
   ou '/* ─── Modal dispatcher ─── */' ou 'const modalRoot = document.getElementById'.
3. Supprime le JS comportemental (tout depuis le boundary jusqu'à </script>).
4. Ajoute window.SCHEMAS = SCHEMAS; si absent.
5. Supprime le second <script> inline (topbar scroll one-liner) si présent.
6. Supprime les blocs CSS pattern qui vivent désormais dans dossier-app.css.
7. Insère <link rel="stylesheet" href="/assets/dossier-app.css"> dans le head.
8. Insère <script src="/assets/dossier-app.js" defer></script> avant </body>.

Idempotent : ré-exécution sur une app déjà migrée → no-op.
"""
import argparse
import re
import sys
from pathlib import Path
from typing import Optional

REPO = Path(__file__).parent.parent
LIB_JS = REPO / "assets" / "dossier-app.js"
LIB_CSS = REPO / "assets" / "dossier-app.css"


def find_js_boundary(content: str) -> Optional[int]:
    """Retourne le numéro de ligne (0-indexed) où commence le JS comportemental.

    Essaie plusieurs markers dans l'ordre de priorité :
    1. '// Modal dispatcher' (plusieurs apps : agents-computer-use, harness, etc.)
    2. '/* ─── Modal dispatcher ─── */' (apps récentes : mcp-plateforme, etc.)
    3. 'const modalRoot = document.getElementById' (apps sans marker : economie-inference, etc.)

    Retourne None si déjà migrée (pattern <script src="/assets/dossier-app.js"> détecté).
    """
    if '/assets/dossier-app.js' in content:
        return None

    lines = content.splitlines()

    # Priority 1: JS-style comment marker
    for i, line in enumerate(lines):
        if '// Modal dispatcher' in line:
            return i

    # Priority 2: CSS-style comment marker (used in recent apps)
    for i, line in enumerate(lines):
        if 'Modal dispatcher' in line and '/*' in line:
            return i

    # Priority 3: First behavioral DOM access after SCHEMAS/SOURCES data
    # Find const SCHEMAS first to avoid false positives in HTML content
    schemas_line = None
    for i, line in enumerate(lines):
        if re.search(r'const\s+SCHEMAS\s*=', line):
            schemas_line = i
            break

    if schemas_line is not None:
        for i, line in enumerate(lines[schemas_line:], start=schemas_line):
            if 'const modalRoot = document.getElementById' in line:
                return i

    return None


def _remove_css_block_by_markers(lines: list[str], marker_labels: list[tuple[str, str]],
                                  stop_before: str = '</style>') -> list[str]:
    """Remove CSS sections identified by comment markers.

    Each section spans from its marker comment line to the line before the
    next marker (or before stop_before for the last section).
    Returns the filtered list of lines.
    """
    # Find all section markers in order
    found = []  # list of (line_idx, label)
    for i, line in enumerate(lines):
        for marker, label in marker_labels:
            if marker in line and '─────────' in line:
                found.append((i, label))
                break

    if not found:
        return lines  # no markers found, nothing to remove

    # Determine end of each section
    blocks_to_remove = set()  # set of line indices to remove
    for idx, (start, label) in enumerate(found):
        if idx + 1 < len(found):
            end = found[idx + 1][0] - 1
        else:
            # Last section: find stop_before
            end = start
            for j in range(start, len(lines)):
                if stop_before in lines[j]:
                    end = j - 1
                    break
        for k in range(start, end + 1):
            blocks_to_remove.add(k)

    return [line for i, line in enumerate(lines) if i not in blocks_to_remove]


def _remove_css_rules_by_regex(content: str, patterns: list[tuple[str, str]]) -> str:
    """Remove CSS rule blocks by matching their opening selector via regex.

    For each (selector_pattern, description):
    - Find the line matching selector_pattern
    - If the rule is single-line (no { ... } spanning multiple lines), remove it
    - If multiline, find the matching closing } and remove the whole block
    Also handles @media blocks that contain a single rule.
    """
    lines = content.splitlines(keepends=True)
    lines_to_remove = set()

    for pattern, desc in patterns:
        regex = re.compile(pattern)
        i = 0
        while i < len(lines):
            line = lines[i]
            if regex.search(line):
                # Check if it's a single-line rule (contains both { and } on same line)
                stripped = line.strip()
                if stripped.count('{') == stripped.count('}') and '{' in stripped:
                    lines_to_remove.add(i)
                    i += 1
                    continue

                # Multiline rule: count braces to find end
                depth = 0
                j = i
                collected = False
                while j < len(lines):
                    depth += lines[j].count('{') - lines[j].count('}')
                    if depth <= 0 and j > i:
                        # End of block
                        for k in range(i, j + 1):
                            lines_to_remove.add(k)
                        collected = True
                        i = j + 1
                        break
                    j += 1
                if not collected:
                    # Couldn't find end, skip
                    i += 1
            else:
                i += 1

    return ''.join(line for i, line in enumerate(lines) if i not in lines_to_remove)


def find_css_pattern_blocks(content: str) -> list[tuple[int, int, str]]:
    """Retourne la liste des (start_line, end_line, name) des sections CSS à supprimer.

    Stratégie : repère chaque marker de section et son successeur immédiat.
    end_line = ligne avant le marker suivant (ou avant </style> pour le dernier).

    Note: Cette fonction est utilisée principalement pour les apps qui ont des
    comment markers CSS explicites (style agents-computer-use). Pour les apps
    sans markers, migrate_app() utilise _remove_css_rules_by_regex().
    """
    section_markers = [
        ('Layout',                'layout'),
        ('Header',                'topbar'),   # includes .topbar
        ('Tooltipped terms',      'tooltips'),
        ('Fullscreen zoom overlay', 'zoom'),
        ('Citations',             'citations'),
        ('Schema sigil',          'sigil'),
    ]
    lines = content.splitlines()
    found = []  # list of (line_idx, label)
    for i, line in enumerate(lines):
        for marker, label in section_markers:
            if marker in line and '─────────' in line:
                found.append((i, label))
                break

    # Determine end of each section
    blocks = []
    for idx, (start, label) in enumerate(found):
        if idx + 1 < len(found):
            end = found[idx + 1][0] - 1
        else:
            # Last section: find </style>
            end = next((j for j, l in enumerate(lines[start:], start=start) if '</style>' in l), start) - 1
        blocks.append((start, end, label))
    return blocks


def _remove_css_lib_rules(content: str) -> str:
    """Remove all CSS rules that belong to dossier-app.css from inline <style>.

    Handles both apps with explicit section markers AND apps without markers
    (compact single-line rule format).

    Removes:
    - .layout grid + .layout.sources-collapsed + @media panel-close rules
    - .topbar rules (sticky topbar)
    - .zoom-btn rules (before fullscreen zoom overlay)
    - #zoom-overlay and related #zoom-* rules
    - .sidebar-edge-toggle + #sources-collapse-btn + #sources-expand-btn rules
    - #modal-root + .modal-* rules
    - .cite rules
    - .schema-sigil / .sigil-* / .sigil-mark rules
    - body { padding-top: 56px; } orphan
    - @media (hover: none) { .zoom-btn ... } rules
    """
    # ─── Strategy 1: Remove sections identified by comment markers ───
    # Used by apps like agents-computer-use which have explicit /* ─── X ─── */ headers
    css_section_markers = [
        ('Layout',                          'layout'),
        ('Header',                          'topbar'),
        ('Zoom button on each figure',      'zoom-btn'),
        ('Fullscreen zoom overlay',         'zoom-overlay'),
        ('Sidebar edge toggles',            'sidebar-edge-toggles'),
        ('Tooltipped terms',                'tooltips'),
        ('Citations',                       'citations'),
        ('Modal',                           'modal'),
        ('Schema sigil',                    'sigil'),
    ]

    lines_list = content.splitlines(keepends=True)
    lines_stripped = [l.rstrip('\n').rstrip('\r') for l in lines_list]

    # Detect which section markers exist
    found_markers = []
    for i, line in enumerate(lines_stripped):
        for marker, label in css_section_markers:
            if marker in line and '─────────' in line and '/*' in line:
                found_markers.append((i, label))
                break

    if found_markers:
        # Remove identified CSS sections
        lines_to_remove = set()
        for idx, (start, label) in enumerate(found_markers):
            if idx + 1 < len(found_markers):
                end = found_markers[idx + 1][0] - 1
            else:
                # Last section: find </style> or end of file
                end = start
                for j in range(start, len(lines_stripped)):
                    if '</style>' in lines_stripped[j]:
                        end = j - 1
                        break
            for k in range(start, end + 1):
                lines_to_remove.add(k)
        content_after_markers = ''.join(
            line for i, line in enumerate(lines_list) if i not in lines_to_remove
        )
    else:
        content_after_markers = content

    # ─── Strategy 2: Regex-based removal for rules without markers ───
    # Handles compact single-line rules common in newer apps

    # These patterns identify the START of CSS blocks to remove.
    # Each is (regex_to_match_opening_line, description)
    regex_patterns = [
        # Layout grid
        (r'^\s+\.layout\s*\{', 'layout grid'),
        (r'^\s+@media\s+\(min-width:\s*1025px\)\s*\{[\s\S]{0,200}?sources-collapsed', 'layout desktop media'),
        # Topbar
        (r'^\s+/\*.*Sticky topbar', 'topbar comment'),
        (r'^\s+\.topbar\s*\{', 'topbar'),
        # zoom-btn (appears BEFORE the zoom-overlay section)
        (r'^\s+\.zoom-btn\s*\{', 'zoom-btn'),
        (r'^\s+\.figure:hover\s+\.zoom-btn', 'zoom-btn hover'),
        (r'^\s+\.zoom-btn:hover\s*\{', 'zoom-btn hover2'),
        (r'^\s+@media\s+\(hover:\s*none\)\s*\{\s*\.zoom-btn', 'zoom-btn media'),
        # Fullscreen zoom overlay
        (r'^\s+#zoom-overlay\[hidden\]', 'zoom-overlay hidden'),
        (r'^\s+#zoom-overlay\s*\{', 'zoom-overlay'),
        (r'^\s+#zoom-header\s*\{', 'zoom-header'),
        (r'^\s+#zoom-caption\s*\{', 'zoom-caption'),
        (r'^\s+\.zoom-controls\s*\{', 'zoom-controls'),
        (r'^\s+\.zoom-controls\s+button\s*\{', 'zoom-controls button'),
        (r'^\s+#zoom-stage\s*\{', 'zoom-stage'),
        (r'^\s+#zoom-stage\.grabbing\s*\{', 'zoom-stage grabbing'),
        (r'^\s+#zoom-content\s*\{', 'zoom-content'),
        (r'^\s+#zoom-content\s*>\s*svg\s*\{', 'zoom-content svg'),
        (r'^\s+#zoom-hint\s*\{', 'zoom-hint'),
        (r'^\s+#zoom-hint\.fade\s*\{', 'zoom-hint fade'),
        (r'^\s+@media\s+\(max-width:\s*640px\)\s*\{[\s\S]{0,100}?zoom-', 'zoom media 640px'),
        # Sidebar edge toggles
        (r'^\s+\.sidebar-edge-toggle\s*\{', 'sidebar-edge-toggle'),
        (r'^\s+\.sidebar-edge-toggle:hover\s*\{', 'sidebar-edge-toggle hover'),
        (r'^\s+\.sidebar-edge-toggle:focus-visible\s*\{', 'sidebar-edge-toggle focus'),
        (r'^\s+#sources-collapse-btn\s*\{', 'sources-collapse-btn'),
        (r'[^\S\n]+\.layout\.sources-collapsed\s+#sources-collapse-btn\s*\{', 'sources-collapsed sources-collapse-btn'),  # Bug 2
        (r'^\s+#sources-expand-btn\s*\{', 'sources-expand-btn'),
        (r'^\s+#sources-expand-btn\[hidden\]', 'sources-expand-btn hidden'),
        # Modal
        (r'^\s+#modal-root\[hidden\]', 'modal-root hidden'),
        (r'^\s+#modal-root\s*\{', 'modal-root'),
        (r'^\s+\.modal-backdrop\s*\{', 'modal-backdrop'),
        (r'^\s+\.modal-card\s*\{', 'modal-card'),
        (r'^\s+\.modal-close\s*\{', 'modal-close'),
        (r'^\s+\.modal-close:hover\s*\{', 'modal-close hover'),
        (r'^\s+\.modal-card\s+h3\s*\{', 'modal-card h3'),
        (r'^\s+\.modal-card\s+\.modal-eyebrow\s*\{', 'modal-eyebrow'),
        (r'^\s+\.modal-card\s+\.modal-body\s+p\s*\{', 'modal-body p'),
        # Citations
        (r'^\s+\.cite\s*\{', 'cite'),
        (r'^\s+\.cite::before\s*\{', 'cite before'),
        (r'^\s+\.cite::after\s*\{', 'cite after'),
        (r'^\s+\.cite:hover\s*\{', 'cite hover'),
        # Schema sigil
        (r'^\s+\.schema-sigil\s*\{', 'schema-sigil'),
        (r'^\s+\.sigil-mark\s*\{', 'sigil-mark'),
        (r'^\s+\.schema-sigil\s+\.sigil-mark\s*\{', 'schema-sigil sigil-mark'),  # Bug 1
        (r'^\s+\.sigil-bg\s*\{', 'sigil-bg'),
        (r'^\s+\.sigil-ring\s*\{', 'sigil-ring'),
        (r'^\s+\.sigil-letters\s*\{', 'sigil-letters'),
        (r'^\s+\.sigil-letters\s+text\s*\{', 'sigil-letters text'),
        (r'^\s+figure\.figure\s+\.schema-sigil\s*\{', 'schema-sigil hover'),
        # Tooltip floater (body-level single instance)
        (r'^\s+#tooltip-floater\[hidden\]', 'tooltip-floater hidden'),
        (r'^\s+#tooltip-floater\s*\{', 'tooltip-floater'),
        (r'^\s+#tooltip-floater::after\s*\{', 'tooltip-floater after'),
    ]

    result = content_after_markers

    # Apply regex removals iteratively
    # Use line-by-line approach to handle both single-line and multi-line rules
    result = _remove_css_rules_by_regex(result, regex_patterns)

    # Remove orphan 'body { padding-top: 56px; }' line
    result = re.sub(r'\n[ \t]*body\s*\{\s*padding-top:\s*56px;\s*\}\s*\n', '\n', result, count=2)

    # Remove the .sidebar-edge-toggle { display: none !important; } inside @media (max-width: 1024px)
    # This is a single-line rule inside a larger media block; the line itself needs removal
    result = re.sub(r'[ \t]+\.sidebar-edge-toggle\s*\{\s*display:\s*none\s*!important;\s*\}\n', '', result)

    # Bug 3: Remove the inline one-liner @media wrapper form:
    # @media (max-width: 1024px) { .sidebar-edge-toggle { display: none !important; } }
    result = re.sub(
        r'[ \t]+@media\s+\(max-width:\s*1024px\)\s*\{\s*\.sidebar-edge-toggle\s*\{[^}]*\}\s*\}\n',
        '',
        result,
    )

    # Clean up multiple consecutive blank lines inside <style>
    result = re.sub(r'(\n\s*){3,}', '\n\n', result)

    return result


def migrate_app(path: Path, dry_run: bool = False) -> dict:
    """Migre une app vers la lib. Retourne un dict {status, changes, warnings}."""
    content = path.read_text(encoding='utf-8')
    warnings = []

    # Idempotency check
    if '/assets/dossier-app.js' in content:
        return {'status': 'already-migrated', 'changes': 0, 'warnings': []}

    # Find JS behavioral boundary
    js_boundary = find_js_boundary(content)
    if js_boundary is None:
        return {
            'status': 'no-boundary-found',
            'changes': 0,
            'warnings': ['Could not locate JS behavioral boundary — file may not match expected structure.'],
        }

    lines = content.splitlines(keepends=True)

    # Find end of the main <script> block (the </script> after js_boundary)
    js_end = None
    for i in range(js_boundary, len(lines)):
        if '</script>' in lines[i]:
            js_end = i
            break
    if js_end is None:
        return {'status': 'no-script-end', 'changes': 0,
                'warnings': ['Could not find </script> after JS boundary.']}

    # Replace lines[js_boundary..js_end] with just the closing tag
    new_lines = lines[:js_boundary] + ['  </script>\n'] + lines[js_end + 1:]
    full = ''.join(new_lines)

    # Add window.SCHEMAS = SCHEMAS just before the closing </script> if not present
    if 'window.SCHEMAS' not in full:
        full = full.replace('  </script>\n', '\n    window.SCHEMAS = SCHEMAS;\n  </script>\n', 1)

    # Remove second <script> (topbar one-liner) — several variants exist
    # Variant 1: function with getElementById('topbar')
    full = re.sub(
        r'<script>\s*\(function\s*\(\s*\)\s*\{[^<]*getElementById\s*\(\s*[\'"]topbar[\'"]\s*\)[^<]*</script>\s*',
        '',
        full,
        flags=re.DOTALL,
    )
    # Variant 2: short one-liner with var b=document.getElementById
    full = re.sub(
        r'<script>\s*\(function\(\)\{var b=document\.getElementById\([\'"]topbar[\'"]\).*?\}\)\(\);\s*</script>\s*',
        '',
        full,
        flags=re.DOTALL,
    )

    # Remove CSS pattern blocks (zoom, modal, sidebar, citations, sigil, topbar, layout)
    full = _remove_css_lib_rules(full)

    # Insert <link rel="stylesheet" href="/assets/dossier-app.css"> just before <style> in head
    if '/assets/dossier-app.css' not in full:
        full = full.replace(
            '<style>',
            '<link rel="stylesheet" href="/assets/dossier-app.css">\n  <style>',
            1,
        )

    # Insert <script src="/assets/dossier-app.js" defer></script> before </body>
    if '/assets/dossier-app.js' not in full:
        full = full.replace(
            '</body>',
            '<script src="/assets/dossier-app.js" defer></script>\n</body>',
            1,
        )

    if dry_run:
        return {'status': 'would-migrate', 'changes': 1, 'warnings': warnings}

    path.write_text(full, encoding='utf-8')
    return {'status': 'migrated', 'changes': 1, 'warnings': warnings}


def main():
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument('apps', nargs='*', help='Chemins des apps à migrer')
    parser.add_argument('--all', action='store_true', help='Toutes les apps')
    parser.add_argument('--dry-run', action='store_true', help='Affiche les changements sans écrire')
    args = parser.parse_args()

    if args.all:
        targets = sorted(REPO.glob('*/2026*-app.html'))
    else:
        targets = [Path(p) for p in args.apps]

    if not targets:
        parser.error('Specify --all or at least one app path.')

    for app in targets:
        result = migrate_app(app, dry_run=args.dry_run)
        status_line = f"{app.name}: {result['status']}"
        if result.get('warnings'):
            status_line += f" ({len(result['warnings'])} warning(s))"
        print(status_line, file=sys.stderr)
        for w in result.get('warnings', []):
            print(f"  WARNING: {w}", file=sys.stderr)


if __name__ == '__main__':
    sys.exit(main() or 0)
