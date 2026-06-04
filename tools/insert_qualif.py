#!/usr/bin/env python3
"""
insert_qualif.py — inject qualification mini-blocs and recap into a deep-research app from a JSON sidecar.

Usage:
    python insert_qualif.py --app PATH --qualif PATH [--check] [--strict]

Modèle calqué sur insert-quizzes.py (idempotent, dry-run, strict mode).
Spec : docs/superpowers/specs/2026-05-23-business-qualification-widget-design.md
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
from pathlib import Path
from typing import Any


def load_qualif(path: Path) -> dict[str, Any]:
    with path.open('r', encoding='utf-8') as f:
        return json.load(f)


def validate_qualif(config: dict[str, Any]) -> list[str]:
    """Retourne la liste des erreurs (vide si OK)."""
    errors: list[str] = []
    meta = config.get('meta', {})
    for field in ('slug', 'version', 'title', 'recap_before_heading_id'):
        if not meta.get(field):
            errors.append(f'meta.{field} missing or empty')

    axes = config.get('axes', [])
    if not isinstance(axes, list) or len(axes) == 0:
        errors.append('axes must be a non-empty array')
        return errors

    axis_ids: set[str] = set()
    for i, axis in enumerate(axes):
        prefix = f'axes[{i}]'
        for field in ('id', 'label', 'before_heading_id', 'intro'):
            if not axis.get(field):
                errors.append(f'{prefix}.{field} missing')
        aid = axis.get('id', '')
        if aid in axis_ids:
            errors.append(f'duplicate axis id: {aid}')
        axis_ids.add(aid)

        inputs = axis.get('inputs', [])
        if not isinstance(inputs, list) or len(inputs) == 0:
            errors.append(f'{prefix}.inputs must be non-empty')
            continue
        axial = [inp for inp in inputs if inp.get('scoring') == 'axis']
        if len(axial) != 1:
            errors.append(f'{prefix} should have exactly 1 axial-scoring input (got {len(axial)})')

    profiles = config.get('profiles', [])
    profile_ids: set[str] = set()
    for i, p in enumerate(profiles):
        prefix = f'profiles[{i}]'
        if not p.get('id'):
            errors.append(f'{prefix}.id missing')
        pid = p.get('id', '')
        if pid in profile_ids:
            errors.append(f'duplicate profile id: {pid}')
        profile_ids.add(pid)
        anchor = p.get('anchor', [])
        if not (isinstance(anchor, list) and len(anchor) == 6):
            errors.append(f'{prefix}.anchor must be a list of 6 numbers')
        else:
            for j, v in enumerate(anchor):
                if not isinstance(v, (int, float)) or not (0 <= v <= 100):
                    errors.append(f'{prefix}.anchor[{j}] = {v} not in [0..100]')

    for i, adj in enumerate(config.get('adjustments', [])):
        prefix = f'adjustments[{i}]'
        if not adj.get('id'):
            errors.append(f'{prefix}.id missing')
        if not adj.get('reco'):
            errors.append(f'{prefix}.reco missing')
        when = adj.get('when', {})
        if not when.get('axis') or when['axis'] not in axis_ids:
            errors.append(f'{prefix}.when.axis unknown: {when.get("axis")}')

    return errors


# ─────────────────────────────────────────────────────────────────────────
# Rendu HTML par type d'input
# ─────────────────────────────────────────────────────────────────────────

def render_slider_anchored(axis_id: str, inp: dict[str, Any]) -> str:
    """Rend un slider HTML5 avec datalist + labels d'ancres."""
    name = f'{axis_id}.{inp["id"]}'
    levels = inp.get('levels', [])
    list_id = f'qualif-{axis_id}-{inp["id"]}-levels'
    default_value = levels[0]['value'] if levels else 0
    min_value = min(lvl['value'] for lvl in levels) if levels else 0
    max_value = max(lvl['value'] for lvl in levels) if levels else 100

    datalist_options = '\n        '.join(
        f'<option value="{lvl["value"]}" label="{html.escape(lvl["label"])}"></option>'
        for lvl in levels
    )
    anchor_spans = '\n        '.join(
        f'<span>{html.escape(lvl["label"])}</span>' for lvl in levels
    )

    return f'''<fieldset class="qualif-input qualif-input--slider" style="--anchor-count: {len(levels)};">
      <legend>{html.escape(inp["label"])}</legend>
      <input type="range"
             name="{name}"
             id="qualif-{axis_id}-{inp["id"]}"
             min="{min_value}"
             max="{max_value}"
             step="1"
             value="{default_value}"
             list="{list_id}"
             aria-valuetext="{html.escape(levels[0]["label"]) if levels else ""}">
      <datalist id="{list_id}">
        {datalist_options}
      </datalist>
      <div class="qualif-anchors" aria-hidden="true">
        {anchor_spans}
      </div>
    </fieldset>'''


def render_multi(axis_id: str, inp: dict[str, Any]) -> str:
    """Rend un multi-select (checkboxes) avec max_picks optionnel."""
    name = f'{axis_id}.{inp["id"]}'
    max_picks = inp.get('max_picks')
    max_label = f' (max {max_picks})' if max_picks else ''
    options_html = '\n        '.join(
        f'<li><label><input type="checkbox" name="{name}" value="{opt["id"]}"> {html.escape(opt["label"])}</label></li>'
        for opt in inp.get('options', [])
    )
    return f'''<fieldset class="qualif-input qualif-input--multi">
      <legend>{html.escape(inp["label"])}{max_label}</legend>
      <ul>
        {options_html}
      </ul>
    </fieldset>'''


def render_segmented(axis_id: str, inp: dict[str, Any]) -> str:
    """Rend un segmented control (radios stylés)."""
    name = f'{axis_id}.{inp["id"]}'
    options_html = '\n        '.join(
        f'<li><label><input type="radio" name="{name}" value="{opt["id"]}"><span>{html.escape(opt["label"])}</span></label></li>'
        for opt in inp.get('options', [])
    )
    return f'''<fieldset class="qualif-input qualif-input--segmented">
      <legend>{html.escape(inp["label"])}</legend>
      <ul>
        {options_html}
      </ul>
    </fieldset>'''


def render_input(axis_id: str, inp: dict[str, Any]) -> str:
    t = inp.get('type')
    if t == 'slider-anchored':
        return render_slider_anchored(axis_id, inp)
    if t == 'multi':
        return render_multi(axis_id, inp)
    if t == 'segmented':
        return render_segmented(axis_id, inp)
    raise ValueError(f'unknown input type: {t}')


def render_step(axis: dict[str, Any]) -> str:
    """Rend un <aside class="qualif-step"> complet, collapsible (body hidden par défaut)."""
    inputs_html = '\n    '.join(render_input(axis['id'], inp) for inp in axis['inputs'])
    axis_id = axis['id']
    return f'''<aside class="qualif-step" id="qualif-step-{axis_id}" data-axis="{axis_id}">
  <header class="qualif-step__head">
    <p class="qualif-step__eyebrow">// votre profil — {html.escape(axis["label"])}</p>
    <p class="qualif-step__intro">{html.escape(axis["intro"])}</p>
    <p class="qualif-step__witness" role="status" aria-live="polite">— En attente de saisie</p>
    <button class="qualif-step__toggle" type="button" aria-expanded="false" aria-controls="qualif-body-{axis_id}">Renseigner →</button>
  </header>
  <div class="qualif-step__body" id="qualif-body-{axis_id}" hidden>
    {inputs_html}
    <a class="qualif-step__see-recap" href="#qualif-recap" hidden>Voir mon profil ↓</a>
  </div>
</aside>'''


def render_recap(config: dict[str, Any]) -> str:
    """Rend le <aside id='qualif-recap'> avec radar SVG inline (grille statique, polygones data-bind)."""
    import math
    axes = config['axes']
    cx, cy, r = 160, 160, 120
    n = len(axes)
    axis_lines: list[str] = []
    axis_labels: list[str] = []
    for i, a in enumerate(axes):
        angle = -math.pi / 2 + (i * 2 * math.pi) / n
        x_end = cx + r * math.cos(angle)
        y_end = cy + r * math.sin(angle)
        axis_lines.append(f'<line class="grid-axis" x1="{cx}" y1="{cy}" x2="{x_end:.2f}" y2="{y_end:.2f}"/>')
        lx = cx + (r + 16) * math.cos(angle)
        ly = cy + (r + 16) * math.sin(angle)
        anchor = 'middle'
        if math.cos(angle) > 0.3:
            anchor = 'start'
        elif math.cos(angle) < -0.3:
            anchor = 'end'
        axis_labels.append(
            f'<text class="axis-label" x="{lx:.1f}" y="{ly:.1f}" text-anchor="{anchor}" dominant-baseline="middle">{html.escape(a["label"])}</text>'
        )

    grid_polys: list[str] = []
    for ratio in (0.25, 0.5, 0.75, 1.0):
        pts = []
        for i in range(n):
            angle = -math.pi / 2 + (i * 2 * math.pi) / n
            x = cx + ratio * r * math.cos(angle)
            y = cy + ratio * r * math.sin(angle)
            pts.append(f'{x:.2f},{y:.2f}')
        grid_polys.append(f'<polygon class="grid-poly" points="{" ".join(pts)}"/>')

    axis_lines_html = '\n          '.join(axis_lines)
    axis_labels_html = '\n          '.join(axis_labels)
    grid_polys_html = '\n          '.join(grid_polys)

    return f'''<aside id="qualif-recap" class="qualif-recap" aria-labelledby="qualif-recap-title">
  <header class="qualif-recap__head">
    <p class="qualif-recap__eyebrow">// votre profil — diagnostic</p>
    <h3 id="qualif-recap-title">Profil <strong data-bind="profile-label">—</strong></h3>
  </header>

  <div class="qualif-recap__grid">
    <figure class="qualif-recap__radar">
      <svg viewBox="0 0 320 320" role="img" aria-labelledby="radar-title radar-desc">
        <title id="radar-title">Radar du profil</title>
        <desc id="radar-desc" data-bind="radar-desc">Aucun axe renseigné.</desc>
        <g>
          {grid_polys_html}
          {axis_lines_html}
        </g>
        <path data-bind="profile-polygon" d=""/>
        <path data-bind="user-polygon" d=""/>
        <g>
          {axis_labels_html}
        </g>
      </svg>
      <figcaption data-bind="radar-caption">Complétez les blocs pour voir votre radar.</figcaption>
    </figure>

    <div class="qualif-recap__body">
      <p class="qualif-recap__verdict is-empty" data-bind="verdict">Aucun axe renseigné. Complétez les blocs ci-dessus pour faire apparaître votre profil.</p>
      <ul class="qualif-recap__recos" data-bind="recos"></ul>
    </div>
  </div>

  <footer class="qualif-recap__foot">
    <p class="qualif-recap__meta">
      Profil établi le <time data-bind="ts">—</time> ·
      <span data-bind="completeness">0 sur 6 axes renseignés</span>
    </p>
    <div class="qualif-recap__actions">
      <button type="button" data-action="print" disabled>Imprimer le récap</button>
      <button type="button" data-action="reset" class="is-quiet" disabled>Réinitialiser</button>
    </div>
  </footer>
</aside>'''


def render_qualif_nav(config: dict[str, Any]) -> str:
    """Rend la sidebar nav (liste des 6 axes + état)."""
    items = []
    for axis in config['axes']:
        items.append(
            f'    <li data-axis="{axis["id"]}" class="is-empty">'
            f'<a href="#qualif-step-{axis["id"]}">'
            f'<span class="qualif-nav__label">{html.escape(axis["label"])}</span>'
            f'<span class="qualif-nav__state" data-bind="state">0 / {len(axis["inputs"])}</span>'
            f'</a></li>'
        )
    items_html = '\n'.join(items)
    return f'''<aside id="qualif-nav" class="qualif-nav" aria-labelledby="qualif-nav-title">
  <header class="qualif-nav__head">
    <p class="qualif-nav__eyebrow">// votre profil</p>
    <h4 id="qualif-nav-title">Profil de qualif</h4>
    <button class="panel-close" type="button" aria-label="Fermer le profil de qualif">Fermer ✕</button>
  </header>
  <ol class="qualif-nav__list">
{items_html}
  </ol>
  <footer class="qualif-nav__foot">
    <a href="#qualif-recap" class="qualif-nav__see-recap">Voir mon profil ↓</a>
  </footer>
</aside>'''


# ─────────────────────────────────────────────────────────────────────────
# Injection : replace si existant, sinon insert avant le heading
# ─────────────────────────────────────────────────────────────────────────

ASIDE_RECAP_RE = re.compile(
    r'<aside id="qualif-recap"[^>]*>.*?</aside>',
    re.DOTALL,
)


def heading_pos(html_src: str, heading_id: str) -> int:
    """Retourne la position du <h2|h3|section id="..."> dans html_src, ou -1.

    Accepte les deux conventions d'anchor utilisées dans le repo :
    - `<h2 id="...">` (cas `analytics-agentique-gcp/`)
    - `<section id="...">` (cas `surfaces-agentiques/`)
    """
    pat = re.compile(rf'<(?:h[23]|section) id="{re.escape(heading_id)}"[^>]*>')
    m = pat.search(html_src)
    return m.start() if m else -1


def maybe_pull_before_hr(html_src: str, pos: int) -> int:
    """Si un <hr> précède directement le heading (à moins de ~200 chars), retourne sa position."""
    start = max(0, pos - 200)
    window = html_src[start:pos]
    hr_match = re.search(r'<hr\s*/?>\s*$', window)
    if hr_match:
        return start + hr_match.start()
    return pos


def inject_step(html_src: str, axis: dict[str, Any], strict: bool = False) -> tuple[str, str]:
    """Retourne (new_html, action) où action ∈ {'inserted', 'replaced', 'skipped'}."""
    rendered = render_step(axis)
    pat = re.compile(
        rf'<aside class="qualif-step"(?: id="qualif-step-{re.escape(axis["id"])}")? data-axis="{re.escape(axis["id"])}">.*?</aside>',
        re.DOTALL,
    )
    if pat.search(html_src):
        new_html = pat.sub(lambda m: rendered, html_src, count=1)
        return new_html, 'replaced'
    pos = heading_pos(html_src, axis['before_heading_id'])
    if pos == -1:
        msg = f'warning: heading id "{axis["before_heading_id"]}" not found for axis "{axis["id"]}"'
        if strict:
            raise RuntimeError(msg)
        print(msg, file=sys.stderr)
        return html_src, 'skipped'
    insert_pos = maybe_pull_before_hr(html_src, pos)
    indent = '\n\n'
    new_html = html_src[:insert_pos] + rendered + indent + html_src[insert_pos:]
    return new_html, 'inserted'


def inject_recap(html_src: str, config: dict[str, Any], strict: bool = False) -> tuple[str, str]:
    rendered = render_recap(config)
    if ASIDE_RECAP_RE.search(html_src):
        new_html = ASIDE_RECAP_RE.sub(lambda m: rendered, html_src, count=1)
        return new_html, 'replaced'
    pos = heading_pos(html_src, config['meta']['recap_before_heading_id'])
    if pos == -1:
        msg = f'warning: heading id "{config["meta"]["recap_before_heading_id"]}" not found for recap'
        if strict:
            raise RuntimeError(msg)
        print(msg, file=sys.stderr)
        return html_src, 'skipped'
    insert_pos = maybe_pull_before_hr(html_src, pos)
    indent = '\n\n'
    new_html = html_src[:insert_pos] + rendered + indent + html_src[insert_pos:]
    return new_html, 'inserted'


ASIDE_QUALIF_NAV_RE = re.compile(
    r'<aside id="qualif-nav"[^>]*>.*?</aside>',
    re.DOTALL,
)


def inject_qualif_nav(html_src: str, config: dict[str, Any], strict: bool = False) -> tuple[str, str]:
    """Inject (or replace) the qualif-nav sidebar before <aside id="sources"."""
    rendered = render_qualif_nav(config)
    if ASIDE_QUALIF_NAV_RE.search(html_src):
        new_html = ASIDE_QUALIF_NAV_RE.sub(lambda m: rendered, html_src, count=1)
        return new_html, 'replaced'
    sources_pat = re.compile(r'<aside id="sources"', re.IGNORECASE)
    m = sources_pat.search(html_src)
    if not m:
        msg = 'warning: <aside id="sources"> not found — cannot anchor qualif-nav'
        if strict:
            raise RuntimeError(msg)
        print(msg, file=sys.stderr)
        return html_src, 'skipped'
    insert_pos = m.start()
    indent = '\n\n    '
    new_html = html_src[:insert_pos] + rendered + indent + html_src[insert_pos:]
    return new_html, 'inserted'


def ensure_lib_tags(html_src: str) -> tuple[str, str]:
    """Injecte <link> et <script> de la lib si absents."""
    has_css = 'href="/assets/dossier-qualif.css"' in html_src
    has_js = 'src="/assets/dossier-qualif.js"' in html_src
    if has_css and has_js:
        return html_src, 'present'

    css_tag = '<link rel="stylesheet" href="/assets/dossier-qualif.css">'
    js_tag = '<script src="/assets/dossier-qualif.js" defer></script>'

    if not has_css:
        if 'href="/assets/dossier-app.css"' in html_src:
            pat = re.compile(r'<link[^>]+href="/assets/dossier-app\.css"[^>]*>')
            html_src = pat.sub(lambda m: m.group(0) + '\n  ' + css_tag, html_src, count=1)
        else:
            html_src = html_src.replace('</head>', '  ' + css_tag + '\n</head>', 1)

    if not has_js:
        if 'src="/assets/dossier-app.js"' in html_src:
            pat = re.compile(r'<script[^>]+src="/assets/dossier-app\.js"[^>]*>\s*</script>')
            html_src = pat.sub(lambda m: m.group(0) + '\n  ' + js_tag, html_src, count=1)
        else:
            html_src = html_src.replace('</body>', '  ' + js_tag + '\n</body>', 1)

    return html_src, 'inserted'


def ensure_data_link(html_src: str, qualif_path: Path, app_path: Path) -> tuple[str, str]:
    """Injecte <link rel="qualif-data" href="..."> pointant vers le sidecar JSON."""
    if 'rel="qualif-data"' in html_src:
        return html_src, 'present'
    try:
        rel = qualif_path.resolve().relative_to(app_path.resolve().parent)
        href = './' + rel.as_posix()
    except ValueError:
        href = '/' + qualif_path.as_posix().lstrip('/')
    tag = f'<link rel="qualif-data" href="{href}">'
    html_src = html_src.replace('</head>', '  ' + tag + '\n</head>', 1)
    return html_src, 'inserted'


def ensure_topbar_button(html_src: str) -> tuple[str, str]:
    """Inject <button id="toggle-qualif"> into <header class="topbar"> just before <nav class="back-nav">.

    Placement pivot : la topbar est `position: fixed`, donc le bouton
    reste visible à tout moment. Le mettre dans <header class="site"> le ferait
    disparaître dès que l'utilisateur scrolle au-delà de l'en-tête.
    """
    if 'id="toggle-qualif"' in html_src:
        return html_src, 'present'
    btn = '<button id="toggle-qualif" class="menu-toggle" aria-label="Ouvrir le profil de qualif">Profil</button>'
    pat = re.compile(
        r'([ \t]*)(<nav class="back-nav"[^>]*>)',
        re.IGNORECASE,
    )
    m = pat.search(html_src)
    if not m:
        return html_src, 'skipped (no back-nav anchor in topbar)'
    new_html = pat.sub(lambda mt: mt.group(1) + btn + '\n' + mt.group(1) + mt.group(2), html_src, count=1)
    return new_html, 'inserted'


def main(argv: list[str] | None = None) -> int:
    # Force utf-8 stdout pour les flèches '→' dans les logs (cp1252 sur Windows Bash).
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass
    ap = argparse.ArgumentParser(description='Inject qualification widget blocks into an app HTML.')
    ap.add_argument('--app', required=True, type=Path)
    ap.add_argument('--qualif', required=True, type=Path)
    ap.add_argument('--check', action='store_true', help='dry-run: do not write')
    ap.add_argument('--strict', action='store_true', help='treat missing headings as errors')
    args = ap.parse_args(argv)

    if not args.app.exists():
        print(f'error: app file not found: {args.app}', file=sys.stderr)
        return 2
    if not args.qualif.exists():
        print(f'error: qualif file not found: {args.qualif}', file=sys.stderr)
        return 2

    config = load_qualif(args.qualif)
    errors = validate_qualif(config)
    if errors:
        print('JSON validation failed:', file=sys.stderr)
        for e in errors:
            print('  - ' + e, file=sys.stderr)
        return 3

    html_src = args.app.read_text(encoding='utf-8')

    # Inject mini-blocs (axes)
    actions: list[str] = []
    for axis in config['axes']:
        html_src, action = inject_step(html_src, axis, strict=args.strict)
        actions.append(f'  axis "{axis["id"]}" → {action}')

    # Inject récap
    html_src, recap_action = inject_recap(html_src, config, strict=args.strict)
    actions.append(f'  recap → {recap_action}')

    # Inject qualif-nav sidebar (right column, above #sources)
    html_src, nav_action = inject_qualif_nav(html_src, config, strict=args.strict)
    actions.append(f'  qualif-nav → {nav_action}')

    # Inject lib tags (link + script) if absent
    html_src, lib_action = ensure_lib_tags(html_src)
    actions.append(f'  lib tags → {lib_action}')

    # Inject <link rel="qualif-data"> pointing to the sidecar JSON
    html_src, data_link_action = ensure_data_link(html_src, args.qualif, args.app)
    actions.append(f'  data link → {data_link_action}')

    # Inject the qualif topbar button
    html_src, topbar_action = ensure_topbar_button(html_src)
    actions.append(f'  topbar button → {topbar_action}')

    print(f'qualif JSON validated: {len(config["axes"])} axes, {len(config["profiles"])} profiles, {len(config.get("adjustments", []))} adjustments')
    print(f'app: {args.app}')
    print('\n'.join(actions))

    if args.check:
        print('\n--check : no file written')
        return 0

    args.app.write_text(html_src, encoding='utf-8')
    print(f'\nwritten: {args.app}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
