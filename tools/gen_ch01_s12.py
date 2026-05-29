"""Generate S1.2 — Faisceau de 100 trajectoires de décode à T=0,7.
One-shot generator for `livre/images/20260601-02-variance-trajectoire-1000-rejouages.svg`.
"""
import math
import random

random.seed(42)

W, H = 1200, 640

# Chart area
X0, Y0 = 110, 130
XW, YH = 1010, 360
CY = Y0 + YH // 2

# Trajectory data : 100 paths, each with 21 waypoints
NUM_TRAJ = 100
NUM_POINTS = 21
TOKEN_MAX = 200


def x_for(i):
    return X0 + (i / (NUM_POINTS - 1)) * XW


def trajectory_y(j, jitter_seed):
    """Generate y values for trajectory j (0..NUM_TRAJ-1).
    Spread is quadratic in position: trajectories start tight, fan out.
    """
    rng = random.Random(jitter_seed)
    amplitude = (j - NUM_TRAJ // 2) / (NUM_TRAJ // 2)  # -1..+1
    base = CY
    pts = []
    drift = 0.0
    for i in range(NUM_POINTS):
        t = i / (NUM_POINTS - 1)
        spread = amplitude * 170 * (t ** 1.3)
        drift += rng.uniform(-6, 6)
        modulation = math.sin(i * 0.7 + j * 0.31) * 5 * t
        y = base + spread + drift * (0.2 + 0.8 * t) + modulation
        pts.append((x_for(i), y))
    return pts


# Build paths
paths_html = []
for j in range(NUM_TRAJ):
    pts = trajectory_y(j, j * 137)
    d_parts = ["M{:.1f},{:.1f}".format(pts[0][0], pts[0][1])]
    for x, y in pts[1:]:
        d_parts.append("L{:.1f},{:.1f}".format(x, y))
    paths_html.append('    <path d="' + " ".join(d_parts) + '" class="traj"/>')

# Highlighted trajectories
highlight_specs = [(15, "traj-up"), (50, "traj-mid"), (85, "traj-down")]
highlight_data = []
for jj, hclass in highlight_specs:
    pts = trajectory_y(jj, jj * 137)
    d_parts = ["M{:.1f},{:.1f}".format(pts[0][0], pts[0][1])]
    for x, y in pts[1:]:
        d_parts.append("L{:.1f},{:.1f}".format(x, y))
    highlight_data.append((hclass, " ".join(d_parts), pts[-1]))

# SVG header
svg_parts = []
svg_parts.append(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {} {}" '.format(W, H)
    + 'font-family="Inter, system-ui, sans-serif" role="img" aria-labelledby="title-fig02">'
)
svg_parts.append('  <title id="title-fig02">Variance accumulée : 100 trajectoires de décode depuis le même prompt à T=0,7</title>')
svg_parts.append('  <desc>Faisceau de 100 trajectoires de génération token-par-token au sampling stochastique T=0,7. Les courbes convergent à l\'origine puis divergent après une dizaine de tokens, illustrant qu\'un même prompt produit des sorties distinctes à chaque rejouage.</desc>')
svg_parts.append('''  <style>
    .title { font: 600 26px/1.2 'Fraunces', 'Georgia', serif; fill: #1a1a1a; }
    .subtitle { font: italic 14px/1.4 'Inter', sans-serif; fill: #555; }
    .axis-title { font: 600 12px 'Inter', sans-serif; fill: #444; }
    .label { font: 10px 'JetBrains Mono', monospace; fill: #555; }
    .annotation { font: italic 13px 'Inter', sans-serif; fill: #444; }
    .annotation-em { font: italic 14px 'Inter', sans-serif; fill: #b8582e; }
    .baseline { stroke: #1a1a1a; stroke-width: 0.8; }
    .grid { stroke: #d4cdb6; stroke-width: 0.5; stroke-dasharray: 2,4; }
    .traj { stroke: #2d8a8a; stroke-width: 0.7; fill: none; opacity: 0.18; }
    .traj-up { stroke: #7a1e1e; stroke-width: 1.6; fill: none; opacity: 0.95; }
    .traj-mid { stroke: #1a1a1a; stroke-width: 1.6; fill: none; opacity: 0.9; stroke-dasharray: 4,3; }
    .traj-down { stroke: #b8582e; stroke-width: 1.6; fill: none; opacity: 0.95; }
    .divergence-zone { fill: #b8582e; opacity: 0.06; }
    .marker { fill: #1a1a1a; }
  </style>''')

svg_parts.append('  <rect width="{}" height="{}" fill="#faf6ec"/>'.format(W, H))

# Title block
svg_parts.append('  <text x="40" y="42" class="title">Mille décodes depuis le même prompt à T=0,7 : la variance accumulée</text>')
svg_parts.append('  <text x="40" y="64" class="subtitle">Chaque ligne est une trajectoire distincte. La divergence s\'installe après une dizaine de tokens — visualisation procédurale (100 trajectoires affichées sur 1 000 simulées).</text>')

# Chart frame
svg_parts.append('  <rect x="{}" y="{}" width="{}" height="{}" fill="none" stroke="#d4cdb6" stroke-width="0.6"/>'.format(X0, Y0, XW, YH))

# Divergence zone
xdiv = X0 + XW * 12 / TOKEN_MAX
svg_parts.append('  <rect x="{:.1f}" y="{}" width="{:.1f}" height="{}" class="divergence-zone"/>'.format(xdiv, Y0, XW * (TOKEN_MAX - 12) / TOKEN_MAX, YH))

# Grid
for tk in [0, 25, 50, 75, 100, 125, 150, 175, 200]:
    xv = X0 + (tk / TOKEN_MAX) * XW
    svg_parts.append('  <line x1="{:.1f}" y1="{}" x2="{:.1f}" y2="{}" class="grid"/>'.format(xv, Y0, xv, Y0 + YH))
for k in range(5):
    yv = Y0 + (k / 4) * YH
    svg_parts.append('  <line x1="{}" y1="{:.1f}" x2="{}" y2="{:.1f}" class="grid"/>'.format(X0, yv, X0 + XW, yv))

# Origin
svg_parts.append('  <circle cx="{}" cy="{}" r="3" class="marker"/>'.format(X0, CY))

# All trajectories
svg_parts.append('  <!-- 100 trajectories -->')
svg_parts.extend(paths_html)

# Highlighted
svg_parts.append('  <!-- 3 highlighted trajectories -->')
for hclass, d, _ in highlight_data:
    svg_parts.append('  <path d="{}" class="{}"/>'.format(d, hclass))

# Axes
svg_parts.append('  <line x1="{}" y1="{}" x2="{}" y2="{}" class="baseline"/>'.format(X0, Y0 + YH, X0 + XW, Y0 + YH))
svg_parts.append('  <text x="{}" y="{}" text-anchor="middle" class="axis-title">Position du token de sortie</text>'.format(X0 + XW // 2, Y0 + YH + 50))
for tk in [0, 50, 100, 150, 200]:
    xv = X0 + (tk / TOKEN_MAX) * XW
    svg_parts.append('  <text x="{:.1f}" y="{}" text-anchor="middle" class="label">{}</text>'.format(xv, Y0 + YH + 18, tk))

svg_parts.append('  <line x1="{}" y1="{}" x2="{}" y2="{}" class="baseline"/>'.format(X0, Y0, X0, Y0 + YH))
svg_parts.append('  <text x="{}" y="{}" text-anchor="middle" class="axis-title" transform="rotate(-90 {} {})">Dérive sémantique cumulée</text>'.format(X0 - 60, CY, X0 - 60, CY))
svg_parts.append('  <text x="{}" y="{}" text-anchor="end" class="label">0</text>'.format(X0 - 8, CY + 4))
svg_parts.append('  <text x="{}" y="{}" text-anchor="end" class="label">+</text>'.format(X0 - 8, Y0 + 4))
svg_parts.append('  <text x="{}" y="{}" text-anchor="end" class="label">−</text>'.format(X0 - 8, Y0 + YH))

# Endpoint annotations
ep_up = highlight_data[0][2]
ep_mid = highlight_data[1][2]
ep_down = highlight_data[2][2]
svg_parts.append('  <text x="{:.1f}" y="{:.1f}" class="annotation" fill="#7a1e1e">Trajectoire convergente (sortie « courte »)</text>'.format(ep_up[0] - 250, ep_up[1] - 4))
svg_parts.append('  <text x="{:.1f}" y="{:.1f}" class="annotation" fill="#1a1a1a">Trajectoire moyenne</text>'.format(ep_mid[0] - 130, ep_mid[1] + 4))
svg_parts.append('  <text x="{:.1f}" y="{:.1f}" class="annotation" fill="#b8582e">Trajectoire divergente (sortie hors-distribution)</text>'.format(ep_down[0] - 280, ep_down[1] + 14))

# Divergence onset marker
svg_parts.append('  <line x1="{:.1f}" y1="{}" x2="{:.1f}" y2="{}" stroke="#7a1e1e" stroke-width="0.8" stroke-dasharray="3,3" opacity="0.7"/>'.format(xdiv, Y0 - 4, xdiv, Y0 + YH + 4))
svg_parts.append('  <text x="{:.1f}" y="{}" text-anchor="middle" class="label" fill="#7a1e1e">divergence ≈ token 12</text>'.format(xdiv, Y0 - 8))

# Bottom caption
svg_parts.append('''  <g transform="translate(40, 560)">
    <rect x="0" y="0" width="1120" height="56" fill="#f0e9d4" stroke="#d4cdb6" stroke-width="0.6"/>
    <text x="20" y="22" class="annotation-em">Test unitaire exact = 1 trajectoire sur 1 000.</text>
    <text x="20" y="44" class="annotation">Ce qu\'il faut mesurer, c\'est la distribution : <tspan font-family="JetBrains Mono, monospace" font-size="12">n</tspan> rejouages, intervalle de confiance, pass@<tspan font-family="JetBrains Mono, monospace" font-size="12">k</tspan> vs pass^<tspan font-family="JetBrains Mono, monospace" font-size="12">k</tspan> (cf. Ch. 17).</text>
  </g>''')

svg_parts.append('</svg>')

svg_str = "\n".join(svg_parts) + "\n"

with open('livre/images/20260601-02-variance-trajectoire-1000-rejouages.svg', 'w', encoding='utf-8') as f:
    f.write(svg_str)

print('Written {} bytes'.format(len(svg_str)))
print('Trajectories: {}'.format(NUM_TRAJ))
