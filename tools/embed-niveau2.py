# -*- coding: utf-8 -*-
"""
Embed niveau-2 content INLINE dans le canvas :
1. Lit les 14 zoom-X.svg
2. Les inject comme <g> au-delà de y=3000 dans le canvas (grille 2 cols × 7 rows)
3. Update sub-cards : data-modal-svg → data-niveau2-viewbox
4. Ajoute JS inline pour viewBox animation + Escape
5. Le clic sub-card anime le viewBox vers le slot → contenu apparaît
"""
import sys, io, re, pathlib
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

CANVAS = 'evaluation-agentique/20260521-evaluation-agentique-canvas.html'
ZOOMS_DIR = pathlib.Path('evaluation-agentique/canvas-redesign')

# Layout : 2 colonnes × 7 rangées, slot 2000×2700
SLOT_W = 2000
SLOT_H = 2700
START_Y = 3100   # juste sous le viewport niveau-0
ROW_GAP = 100

# Ordre des slots
SLOTS_ORDER = ['S0', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7',
               'C1', 'C2', 'C3', 'C4', 'C5', 'C6']

def slot_position(idx):
    """idx 0..13 → (x, y)."""
    col = idx % 2
    row = idx // 2
    x = col * SLOT_W
    y = START_Y + row * (SLOT_H + ROW_GAP)
    return x, y

def extract_svg_content(svg_text):
    """Extrait le contenu entre <svg ...> et </svg>, et la hauteur du viewBox."""
    # Strip XML prelude
    svg_text = re.sub(r'^<\?xml[^>]*\?>\s*', '', svg_text)
    # Extract viewBox
    m = re.search(r'viewBox="([\d\s.-]+)"', svg_text)
    if not m:
        return None, None
    vb_parts = m.group(1).split()
    orig_h = float(vb_parts[3])
    # Extract content (everything between <svg ...> and </svg>)
    body_m = re.search(r'<svg[^>]*>(.*)</svg>', svg_text, re.DOTALL)
    if not body_m:
        return None, None
    return body_m.group(1).strip(), orig_h

# Read each zoom-X.svg and compute slot positions
embeds = []
for idx, sub_id in enumerate(SLOTS_ORDER):
    path = ZOOMS_DIR / f'zoom-{sub_id}.svg'
    if not path.exists():
        print(f'  ! {path} missing')
        continue
    content, orig_h = extract_svg_content(path.read_text(encoding='utf-8'))
    if content is None:
        print(f'  ! {path} no extract')
        continue
    slot_x, slot_y = slot_position(idx)
    # Scale si nécessaire pour fit en 2700 tall
    if orig_h > SLOT_H:
        scale = SLOT_H / orig_h
        transform = f'translate({slot_x}, {slot_y}) scale({scale:.4f})'
    else:
        transform = f'translate({slot_x}, {slot_y})'
    embeds.append((sub_id, slot_x, slot_y, transform, content))
    print(f'  {sub_id} → slot ({slot_x}, {slot_y}) orig_h={orig_h:.0f}')

# Build niveau2-layer SVG
layer = '    <!-- ═══════════════════════════════════════════════════════\n'
layer += '         NIVEAU 2 LAYER — sub-cards content embedded inline\n'
layer += '         (hors viewport niveau-0, accessible par viewBox animation)\n'
layer += '         ═══════════════════════════════════════════════════════ -->\n'
layer += '    <g id="niveau2-layer">\n'
for sub_id, sx, sy, transform, content in embeds:
    layer += f'      <g id="n2-{sub_id}" data-niveau2-id="{sub_id}" transform="{transform}">\n'
    # Indent content slightly for readability
    layer += content + '\n'
    layer += '      </g>\n\n'
layer += '    </g>\n\n'

# Read canvas
with open(CANVAS, encoding='utf-8') as f:
    html = f.read()

# Insert layer JUST BEFORE <g id="canvas-hint">
hint_idx = html.index('<g id="canvas-hint">')
html = html[:hint_idx] + layer + '    ' + html[hint_idx:]
print(f'\nNiveau2 layer embed : {len(layer)} chars')

# Update sub-cards : data-modal-svg → data-niveau2-viewbox + data-niveau2-target
# Pattern : <g transform="translate(X, Y)" data-modal-svg="..." data-modal-eyebrow="..." data-modal-title="...">
# Map sub_id → slot viewbox
slot_vb = {}
for idx, sub_id in enumerate(SLOTS_ORDER):
    sx, sy = slot_position(idx)
    slot_vb[sub_id] = f'{sx} {sy} {SLOT_W} {SLOT_H}'

# Pour chaque sub-card (identifié par son badge text), remplacer ses attributs
n_replaced = 0
for sub_id in SLOTS_ORDER:
    vb = slot_vb[sub_id]
    # Pattern : trouve le <g ...> qui contient un <text>S0/S1/.../C6</text>
    # Plus simple : on cherche les sous-cards par leur badge texte
    # Pattern : `<g transform="translate(...)" data-modal-svg="..." ...> ... <text x="46" y="56" ... >S0</text>`
    pat = re.compile(
        r'(<g transform="translate\([^)]+\)") data-modal-svg="[^"]*" data-modal-eyebrow="[^"]*" data-modal-title="[^"]*"(>\s*<rect[^/]+/>\s*<circle[^/]+/>\s*<text[^>]+>' + re.escape(sub_id) + r'</text>)',
        re.DOTALL
    )
    new_attrs = f' data-niveau2-viewbox="{vb}" data-niveau2-target="{sub_id}" data-modal-svg=""'  # garde le modal-svg empty pour compat
    new_html, c = pat.subn(r'\1' + new_attrs + r'\2', html, count=1)
    if c == 0:
        # Essayer un autre pattern (au cas où l'ordre des attributs varierait)
        pat2 = re.compile(
            r'(<g transform="translate\([^)]+\)")\s+data-modal-svg="[^"]*"\s+data-modal-eyebrow="[^"]*"\s+data-modal-title="[^"]*"',
            re.DOTALL
        )
        # cette approche n'identifie pas le sub-id, donc skip
        print(f'  ! no match {sub_id} sub-card data attrs')
        continue
    html = new_html
    n_replaced += 1
print(f'\n{n_replaced}/14 sub-cards data-attrs remplacés (modal-svg → niveau2-viewbox)')

# Add inline JS for niveau-2 navigation
custom_js = '''
<script>
(function () {
  'use strict';
  // ═══════════════════════════════════════════════════════
  // NIVEAU 2 FRACTAL ZOOM — clic sub-card → viewBox anime vers slot
  // ═══════════════════════════════════════════════════════
  const canvas = document.querySelector('svg[data-canvas-zoom]');
  if (!canvas) return;

  const DURATION = 700;
  const easing = t => 1 - Math.pow(1 - t, 3);
  let prevViewBox = null;
  let animFrame = null;

  function parseVB(s) {
    const p = s.split(/\\s+/).map(Number);
    return { x: p[0], y: p[1], w: p[2], h: p[3] };
  }
  function vbStr(v) { return v.x + ' ' + v.y + ' ' + v.w + ' ' + v.h; }

  function animateVB(target) {
    if (animFrame) cancelAnimationFrame(animFrame);
    const start = parseVB(canvas.getAttribute('viewBox'));
    const targetVB = parseVB(target);
    const t0 = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - t0) / DURATION);
      const e = easing(t);
      const vb = {
        x: start.x + (targetVB.x - start.x) * e,
        y: start.y + (targetVB.y - start.y) * e,
        w: start.w + (targetVB.w - start.w) * e,
        h: start.h + (targetVB.h - start.h) * e,
      };
      canvas.setAttribute('viewBox', vbStr(vb));
      if (t < 1) animFrame = requestAnimationFrame(frame);
      else animFrame = null;
    }
    animFrame = requestAnimationFrame(frame);
  }

  // Click capture pour intercepter avant canvas-zoom.js
  document.addEventListener('click', function (e) {
    const trig = e.target.closest('[data-niveau2-viewbox]');
    if (!trig) return;
    const target = trig.getAttribute('data-niveau2-viewbox');
    if (!target) return;
    e.stopPropagation();
    e.preventDefault();
    prevViewBox = canvas.getAttribute('viewBox');
    canvas.setAttribute('data-niveau2-active', trig.getAttribute('data-niveau2-target') || '');
    animateVB(target);
  }, true);

  // Escape : retour au viewBox précédent (niveau-1)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && canvas.hasAttribute('data-niveau2-active') && prevViewBox) {
      e.stopPropagation();
      canvas.removeAttribute('data-niveau2-active');
      animateVB(prevViewBox);
      prevViewBox = null;
    }
  }, true);
})();
</script>
'''

# Insert custom JS just before </body>
body_close = html.rindex('</body>')
html = html[:body_close] + custom_js + html[body_close:]
print('Custom JS niveau-2 navigation ajouté')

with open(CANVAS, 'w', encoding='utf-8') as f:
    f.write(html)

print('\nDone.')
print(f'  niveau2-layer : {len(layer)} chars')
print(f'  sub-cards : {n_replaced}/14 wirés')
print(f'  data-niveau2-viewbox count : {html.count("data-niveau2-viewbox")}')
