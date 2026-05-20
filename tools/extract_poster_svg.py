#!/usr/bin/env python3
"""Extrait le <svg id="canvas"> d'un fichier canvas HTML et produit un brouillon
de poster SVG standalone (étape 1 du workflow poster en 2 temps).

Le script :
1. Lit le fichier HTML d'entrée
2. Extrait le <svg id="canvas" ...>...</svg>
3. Force tous les data-state à "focused" pour révéler toutes les leaves
4. Inline les Google Fonts (Fraunces, Inter, JetBrains Mono) via @font-face base64
5. Écrit un fichier {slug}-poster-draft.svg dans le même dossier

Étape 2 (habillage éditorial — bandeau titre, légende narrative, visuels de
liaison, cartouche signature, numérotation) reste manuelle. Cf. spec
docs/superpowers/specs/2026-05-20-eval-infinite-canvas-design.md

Usage :
    python tools/extract_poster_svg.py evaluation-agentique/20260520-evaluation-agentique-canvas.html
"""

import argparse
import re
import sys
from pathlib import Path


SVG_START_RE = re.compile(r'<svg\s+id="canvas"[^>]*>', re.DOTALL)
SVG_END_RE = re.compile(r'</svg>')

# Pattern pour data-state="anything" → data-state="focused"
DATA_STATE_RE = re.compile(r'data-state="[^"]*"')

# Pattern pour matcher l'ouverture du tag <svg id="canvas"> et capturer ses attributs
SVG_OPENING_RE = re.compile(
    r'(<svg\s+id="canvas"[^>]*?)(\s*>)',
    re.DOTALL
)


def extract_canvas_svg(html: str) -> str:
    """Extrait le <svg id="canvas">...</svg> du HTML."""
    m = SVG_START_RE.search(html)
    if not m:
        raise ValueError('No <svg id="canvas"> found in HTML')
    start = m.start()
    # Find matching </svg> — naive but works since canvas SVGs don't nest <svg>
    depth = 1
    pos = m.end()
    while depth > 0 and pos < len(html):
        next_open = html.find('<svg', pos)
        next_close = html.find('</svg>', pos)
        if next_close == -1:
            raise ValueError('Unclosed <svg> tag')
        if next_open != -1 and next_open < next_close:
            depth += 1
            pos = next_open + 4
        else:
            depth -= 1
            pos = next_close + 6
    return html[start:pos]


def force_focused_states(svg: str) -> str:
    """Force tous les data-state="..." à data-state="focused"."""
    return DATA_STATE_RE.sub('data-state="focused"', svg)


def inline_fonts_stylesheet(svg: str) -> str:
    """Injecte un <style> avec les fallbacks de polices (Cambria/Helvetica/Consolas).

    Pour la v1, on n'embarque pas les Google Fonts en base64 (trop lourd).
    On déclare uniquement des @font-face fallbacks alignés sur les styles utilisés.
    """
    style_block = '''<defs>
<style type="text/css"><![CDATA[
text.display, text[font-family*="Fraunces"], text[font-family*="serif"] {
  font-family: 'Cambria', 'Georgia', serif;
}
text.body, text[font-family*="Inter"] {
  font-family: 'Helvetica Neue', 'Arial', sans-serif;
}
text.mono, text[font-family*="JetBrains Mono"], text[font-family*="monospace"] {
  font-family: 'Consolas', 'Courier New', monospace;
}
text[font-family*="Caveat"] {
  font-family: 'Caveat', 'Comic Sans MS', cursive;
}
]]></style>
</defs>'''

    return SVG_OPENING_RE.sub(r'\1\2' + style_block, svg, count=1)


def add_xmlns(svg: str) -> str:
    """S'assure que le SVG porte xmlns pour un rendu standalone."""
    if 'xmlns="http://www.w3.org/2000/svg"' in svg.split('>', 1)[0]:
        return svg
    return SVG_OPENING_RE.sub(
        r'\1 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"\2',
        svg, count=1
    )


def derive_draft_path(canvas_html_path: Path) -> Path:
    """canvas.html → canvas-poster-draft.svg dans le même dossier."""
    name = canvas_html_path.stem  # 20260520-evaluation-agentique-canvas
    if name.endswith('-canvas'):
        base = name[:-len('-canvas')]
    else:
        base = name
    return canvas_html_path.parent / f'{base}-poster-draft.svg'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('canvas_html', type=Path, help='Path to the canvas HTML file')
    parser.add_argument('--output', type=Path, default=None,
                        help='Output SVG path (default: derived from input)')
    args = parser.parse_args()

    if not args.canvas_html.exists():
        print(f'Error: {args.canvas_html} does not exist', file=sys.stderr)
        return 1

    html = args.canvas_html.read_text(encoding='utf-8')

    try:
        svg = extract_canvas_svg(html)
    except ValueError as e:
        print(f'Error extracting SVG: {e}', file=sys.stderr)
        return 1

    svg = force_focused_states(svg)
    svg = add_xmlns(svg)
    svg = inline_fonts_stylesheet(svg)

    # Ajouter le préambule XML pour rendu standalone
    output = '<?xml version="1.0" encoding="UTF-8"?>\n' + svg + '\n'

    output_path = args.output or derive_draft_path(args.canvas_html)
    output_path.write_text(output, encoding='utf-8')
    print(f'Wrote {output_path} ({len(output)} bytes)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
