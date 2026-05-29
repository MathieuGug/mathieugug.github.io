"""Generate E3 — Capability × Cost : second axe de scaling, double-vue.
Output : `livre/images/20260601-03-capability-vs-cost-e3.svg`.
A4 portrait, viewBox 900×1280.
"""

import os
import math

W, H = 900, 1280
OUT = "livre/images/20260601-03-capability-vs-cost-e3.svg"

# ---- helpers ----

def text(x, y, s, cls="label", anchor="start", extra=""):
    return '  <text x="{}" y="{}" text-anchor="{}" class="{}" {}>{}</text>'.format(x, y, anchor, cls, extra, s)


def line(x1, y1, x2, y2, cls="axis"):
    return '  <line x1="{:.1f}" y1="{:.1f}" x2="{:.1f}" y2="{:.1f}" class="{}"/>'.format(x1, y1, x2, y2, cls)


def circle(cx, cy, r, cls):
    return '  <circle cx="{:.1f}" cy="{:.1f}" r="{}" class="{}"/>'.format(cx, cy, r, cls)


def rect(x, y, w, h, cls, extra=""):
    return '  <rect x="{:.1f}" y="{:.1f}" width="{:.1f}" height="{:.1f}" class="{}" {}/>'.format(x, y, w, h, cls, extra)


# ---- begin SVG ----

svg = []
svg.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {} {}" font-family="Inter, system-ui, sans-serif" role="img" aria-labelledby="title-e3">'.format(W, H))
svg.append('  <title id="title-e3">E3 — Capability × Cost : la seconde courbe de scaling</title>')
svg.append('  <desc>Double-vue de la seconde courbe de scaling. Panel A : capability (AIME) vs temps 2020-2026 — pretraining sature, test-time decolle au pivot o1 (sept 2024). Panel B : coût par résolution vs performance — deux nuages distincts non-reasoning (bas-gauche) et reasoning (haut-droit) avec écart ×10-74. Bandeau bas : 3 régimes tarifaires vendor.</desc>')

svg.append('''  <style>
    .title { font: 600 24px/1.2 'Fraunces', 'Georgia', serif; fill: #1a1a1a; }
    .subtitle { font: italic 13px/1.4 'Inter', sans-serif; fill: #555; }
    .panel-title { font: 600 15px 'Inter', sans-serif; fill: #1a1a1a; }
    .panel-sub { font: italic 12px 'Inter', sans-serif; fill: #666; }
    .label { font: 11px 'JetBrains Mono', monospace; fill: #444; }
    .label-bold { font: 600 11px 'JetBrains Mono', monospace; fill: #1a1a1a; }
    .label-small { font: 10px 'Inter', sans-serif; fill: #666; }
    .annotation { font: italic 12px 'Inter', sans-serif; fill: #444; }
    .annotation-em { font: italic 13px 'Inter', sans-serif; fill: #b8582e; }
    .axis { stroke: #999; stroke-width: 0.6; }
    .axis-bold { stroke: #1a1a1a; stroke-width: 0.9; }
    .grid { stroke: #d4cdb6; stroke-width: 0.5; stroke-dasharray: 2,3; }
    .pretrain-curve { stroke: #2d8a8a; stroke-width: 2.2; fill: none; }
    .testtime-curve { stroke: #b8582e; stroke-width: 2.4; fill: none; }
    .pivot-band { fill: #b8582e; opacity: 0.08; }
    .pivot-line { stroke: #7a1e1e; stroke-width: 0.9; stroke-dasharray: 4,3; }
    .nonreason-cloud { fill: #2d8a8a; opacity: 0.65; }
    .reason-cloud { fill: #b8582e; opacity: 0.85; }
    .gap-arrow { stroke: #1a1a1a; stroke-width: 1.4; fill: none; }
    .regime-box { fill: #f0e9d4; stroke: #d4cdb6; stroke-width: 0.7; }
    .regime-title { font: 600 12px 'Inter', sans-serif; fill: #1a1a1a; }
    .regime-body { font: 11px 'Inter', sans-serif; fill: #444; }
  </style>''')

svg.append('  <defs>')
svg.append('    <marker id="arr-e3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">')
svg.append('      <path d="M0,0 L10,5 L0,10 z" fill="#1a1a1a"/>')
svg.append('    </marker>')
svg.append('  </defs>')

svg.append('  <rect width="{}" height="{}" fill="#faf6ec"/>'.format(W, H))

# ---- Title block ----
svg.append('  <text x="40" y="42" class="title">Capability × Cost : la seconde courbe de scaling</text>')
svg.append('  <text x="40" y="64" class="subtitle">Deux lectures de la bascule o1 (sept. 2024). Le décideur ne choisit pas un modèle — il choisit un régime tarifaire.</text>')

# ============================
# Panel A : Capability vs Time
# ============================
PA_X, PA_Y, PA_W, PA_H = 80, 110, 740, 380
svg.append('  <g>')
svg.append('  <!-- Panel A : Capability vs Time -->')
svg.append('  <text x="{}" y="{}" class="panel-title">A · Capability vs temps — pretraining sature, test-time décolle</text>'.format(PA_X, PA_Y - 24))
svg.append('  <text x="{}" y="{}" class="panel-sub">Score AIME (proxy frontière). Snell et al. 2024 : un petit modèle compute-optimal à l\'inférence surclasse un 14× plus gros à FLOPs équivalents.</text>'.format(PA_X, PA_Y - 8))

# Chart frame
chart_x, chart_y, chart_w, chart_h = PA_X + 60, PA_Y + 20, PA_W - 100, PA_H - 80
svg.append('  <rect x="{}" y="{}" width="{}" height="{}" fill="none" stroke="#d4cdb6" stroke-width="0.6"/>'.format(chart_x, chart_y, chart_w, chart_h))

# Grid
for k in range(6):
    yv = chart_y + (k / 5) * chart_h
    svg.append('  <line x1="{}" y1="{:.1f}" x2="{}" y2="{:.1f}" class="grid"/>'.format(chart_x, yv, chart_x + chart_w, yv))

# Pivot band (sept 2024)
years = ['2020', '2021', '2022', '2023', '2024', '2025', '2026']
x_pivot = chart_x + (4.7 / 6) * chart_w  # sept 2024 between 2024 and 2025
svg.append('  <rect x="{:.1f}" y="{}" width="{:.1f}" height="{}" class="pivot-band"/>'.format(x_pivot, chart_y, (chart_x + chart_w) - x_pivot, chart_h))
svg.append('  <line x1="{:.1f}" y1="{}" x2="{:.1f}" y2="{}" class="pivot-line"/>'.format(x_pivot, chart_y - 8, x_pivot, chart_y + chart_h + 4))
svg.append('  <text x="{:.1f}" y="{}" text-anchor="middle" class="label-bold" fill="#7a1e1e">pivot o1</text>'.format(x_pivot, chart_y - 14))
svg.append('  <text x="{:.1f}" y="{}" text-anchor="middle" class="label-small" fill="#7a1e1e">12 sept. 2024</text>'.format(x_pivot, chart_y - 2))

# Curves
# x-coords for years 2020..2026 (7 points) over chart_w
xs = [chart_x + (i / 6) * chart_w for i in range(7)]
# Pretraining curve (gentle climb 0 -> 15% saturation by 2023, plateau)
# y-coords inverted (chart_y is top, +y goes down). 100% AIME at top, 0% at bottom.
def y_of(pct):  # pct in 0..1
    return chart_y + chart_h - pct * chart_h

pretrain_pts = [(xs[0], y_of(0.02)), (xs[1], y_of(0.05)), (xs[2], y_of(0.10)),
                (xs[3], y_of(0.13)), (xs[4], y_of(0.15)), (xs[5], y_of(0.17)), (xs[6], y_of(0.18))]
testtime_pts = [(xs[0], y_of(0.02)), (xs[1], y_of(0.05)), (xs[2], y_of(0.10)),
                (xs[3], y_of(0.13)), (xs[4], y_of(0.15)), (xs[5], y_of(0.62)), (xs[6], y_of(0.85))]
# testtime overlay only from 2024 onwards
testtime_curve = [(xs[4], y_of(0.15)), (xs[4.5 if False else 4] + (xs[5]-xs[4])*0.4, y_of(0.20)),
                  (xs[5], y_of(0.62)), (xs[6], y_of(0.85))]

# Use spline-like polyline
pre_d = " ".join(["M{:.1f},{:.1f}".format(pretrain_pts[0][0], pretrain_pts[0][1])] +
                 ["L{:.1f},{:.1f}".format(x, y) for x, y in pretrain_pts[1:]])
svg.append('  <path d="{}" class="pretrain-curve"/>'.format(pre_d))

# Test-time curve: starts at 2024, climbs steeply
tt_d_pts = [(xs[4], y_of(0.15)), (xs[4] + (xs[5] - xs[4]) * 0.5, y_of(0.40)),
            (xs[5], y_of(0.62)), (xs[5] + (xs[6] - xs[5]) * 0.5, y_of(0.78)),
            (xs[6], y_of(0.92))]
tt_d = " ".join(["M{:.1f},{:.1f}".format(tt_d_pts[0][0], tt_d_pts[0][1])] +
                ["L{:.1f},{:.1f}".format(x, y) for x, y in tt_d_pts[1:]])
svg.append('  <path d="{}" class="testtime-curve"/>'.format(tt_d))

# Curve labels
svg.append('  <text x="{:.1f}" y="{:.1f}" class="annotation" fill="#2d8a8a">pretraining seul</text>'.format(xs[3] + 8, y_of(0.14)))
svg.append('  <text x="{:.1f}" y="{:.1f}" class="annotation" fill="#b8582e">pretraining + test-time compute</text>'.format(xs[5] - 30, y_of(0.55)))

# Model markers
markers = [
    (xs[2], y_of(0.10), 'GPT-3'),
    (xs[3], y_of(0.13), 'GPT-4'),
    (xs[4], y_of(0.15), 'GPT-4o · Claude 3.5'),
    (xs[5], y_of(0.62), 'o1 · DeepSeek-R1'),
    (xs[5] + (xs[6] - xs[5]) * 0.5, y_of(0.78), 'o3'),
    (xs[6], y_of(0.92), 'o3+ · Claude 4.x'),
]
for mx, my, label in markers:
    svg.append('  <circle cx="{:.1f}" cy="{:.1f}" r="3" fill="#1a1a1a"/>'.format(mx, my))
    svg.append('  <text x="{:.1f}" y="{:.1f}" class="label-small">{}</text>'.format(mx + 6, my - 4, label))

# Snell annotation
svg.append('  <text x="{:.1f}" y="{:.1f}" class="annotation-em">14×</text>'.format(xs[5] + 5, y_of(0.42)))
svg.append('  <text x="{:.1f}" y="{:.1f}" class="annotation">facteur capability/paramètres</text>'.format(xs[5] - 30, y_of(0.36)))
svg.append('  <text x="{:.1f}" y="{:.1f}" class="annotation">à FLOPs équivalents (Snell 2024)</text>'.format(xs[5] - 30, y_of(0.32)))

# X axis
svg.append('  <line x1="{}" y1="{}" x2="{}" y2="{}" class="axis-bold"/>'.format(chart_x, chart_y + chart_h, chart_x + chart_w, chart_y + chart_h))
for i, year in enumerate(years):
    xv = chart_x + (i / 6) * chart_w
    svg.append('  <text x="{:.1f}" y="{}" text-anchor="middle" class="label">{}</text>'.format(xv, chart_y + chart_h + 18, year))

# Y axis
svg.append('  <line x1="{}" y1="{}" x2="{}" y2="{}" class="axis-bold"/>'.format(chart_x, chart_y, chart_x, chart_y + chart_h))
for pct in [0, 25, 50, 75, 100]:
    yv = y_of(pct / 100)
    svg.append('  <text x="{}" y="{:.1f}" text-anchor="end" class="label">{}%</text>'.format(chart_x - 8, yv + 4, pct))

svg.append('  <text x="{}" y="{}" text-anchor="middle" class="label-bold" transform="rotate(-90 {} {})">AIME (capability)</text>'.format(chart_x - 40, chart_y + chart_h / 2, chart_x - 40, chart_y + chart_h / 2))

svg.append('  </g>')

# ============================
# Panel B : Cost vs Performance
# ============================
PB_X, PB_Y, PB_W, PB_H = 80, 590, 740, 380
svg.append('  <g>')
svg.append('  <!-- Panel B : Cost vs Performance -->')
svg.append('  <text x="{}" y="{}" class="panel-title">B · Coût par résolution AIME — ×10 à ×74 entre les deux nuages</text>'.format(PB_X, PB_Y - 24))
svg.append('  <text x="{}" y="{}" class="panel-sub">Deux régimes économiques disjoints. Le décideur paie un prix par token qui baisse pendant que sa facture par tâche monte.</text>'.format(PB_X, PB_Y - 8))

chart_x, chart_y, chart_w, chart_h = PB_X + 60, PB_Y + 20, PB_W - 100, PB_H - 80
svg.append('  <rect x="{}" y="{}" width="{}" height="{}" fill="none" stroke="#d4cdb6" stroke-width="0.6"/>'.format(chart_x, chart_y, chart_w, chart_h))

# Grid
for k in range(6):
    yv = chart_y + (k / 5) * chart_h
    svg.append('  <line x1="{}" y1="{:.1f}" x2="{}" y2="{:.1f}" class="grid"/>'.format(chart_x, yv, chart_x + chart_w, yv))

# X axis : log scale $/résolution, 0.01 -> 100 USD
# Log10 -2 to +2 (4 decades)
def x_log(usd):
    log = math.log10(usd)
    return chart_x + ((log + 2) / 4) * chart_w  # -2..+2 maps to 0..chart_w

# Y axis : AIME 0..100
def y_pct(pct):
    return chart_y + chart_h - (pct / 100) * chart_h

# Non-reasoning cloud (bottom-left, $/résolution 0.02-0.1, AIME 5-15%)
nonreason = [
    (0.02, 8, 'GPT-3.5'),
    (0.025, 11, 'GPT-4 (2023)'),
    (0.04, 12, 'Claude 3 Opus'),
    (0.06, 14, 'GPT-4o'),
    (0.08, 13, 'Claude 3.5 Sonnet'),
    (0.10, 15, 'Gemini 1.5'),
]
for usd, pct, label in nonreason:
    cx = x_log(usd)
    cy = y_pct(pct)
    svg.append('  <circle cx="{:.1f}" cy="{:.1f}" r="11" class="nonreason-cloud"/>'.format(cx, cy))
    svg.append('  <text x="{:.1f}" y="{:.1f}" text-anchor="middle" class="label-small" fill="#fff">{}</text>'.format(cx, cy + 3, label[:3]))

# Reasoning cloud (top-right, $/résolution 1-20 USD, AIME 70-92%)
reason = [
    (0.8, 75, 'o1-mini'),
    (1.5, 78, 'o1'),
    (3.0, 82, 'Claude 3.7 thinking'),
    (5.0, 85, 'DeepSeek-R1'),
    (8.0, 87, 'Gemini 2.5 Deep Think'),
    (15, 90, 'o3'),
    (20, 92, 'Claude 4.x extended'),
]
for usd, pct, label in reason:
    cx = x_log(usd)
    cy = y_pct(pct)
    svg.append('  <circle cx="{:.1f}" cy="{:.1f}" r="13" class="reason-cloud"/>'.format(cx, cy))
    svg.append('  <text x="{:.1f}" y="{:.1f}" text-anchor="middle" class="label-small" fill="#fff">{}</text>'.format(cx, cy + 3, label[:3]))

# Cloud labels
svg.append('  <text x="{:.1f}" y="{:.1f}" class="annotation" fill="#2d8a8a">non-reasoning</text>'.format(x_log(0.04), y_pct(22)))
svg.append('  <text x="{:.1f}" y="{:.1f}" class="annotation" fill="#2d8a8a">(plafond ~15% AIME)</text>'.format(x_log(0.04), y_pct(18)))
svg.append('  <text x="{:.1f}" y="{:.1f}" class="annotation" fill="#b8582e">reasoning</text>'.format(x_log(3), y_pct(98)))
svg.append('  <text x="{:.1f}" y="{:.1f}" class="annotation" fill="#b8582e">(75-92% AIME, ×10 à ×74 coût)</text>'.format(x_log(3), y_pct(94)))

# Gap arrow ×10-74
svg.append('  <path d="M {:.1f},{:.1f} Q {:.1f},{:.1f} {:.1f},{:.1f}" class="gap-arrow" marker-end="url(#arr-e3)"/>'.format(
    x_log(0.05), y_pct(14), x_log(0.5), y_pct(50), x_log(1.0), y_pct(72)))
svg.append('  <text x="{:.1f}" y="{:.1f}" text-anchor="middle" class="annotation-em">écart ×10-74</text>'.format(x_log(0.3), y_pct(45)))
svg.append('  <text x="{:.1f}" y="{:.1f}" text-anchor="middle" class="annotation">en coût par résolution</text>'.format(x_log(0.3), y_pct(41)))

# X axis (log scale)
svg.append('  <line x1="{}" y1="{}" x2="{}" y2="{}" class="axis-bold"/>'.format(chart_x, chart_y + chart_h, chart_x + chart_w, chart_y + chart_h))
for usd in [0.01, 0.1, 1, 10, 100]:
    xv = x_log(usd)
    label = '${:g}'.format(usd) if usd >= 1 else '${:.2f}'.format(usd)
    svg.append('  <text x="{:.1f}" y="{}" text-anchor="middle" class="label">{}</text>'.format(xv, chart_y + chart_h + 18, label))

svg.append('  <text x="{}" y="{}" text-anchor="middle" class="label-bold">Coût par résolution AIME (USD, échelle log)</text>'.format(chart_x + chart_w / 2, chart_y + chart_h + 50))

# Y axis
svg.append('  <line x1="{}" y1="{}" x2="{}" y2="{}" class="axis-bold"/>'.format(chart_x, chart_y, chart_x, chart_y + chart_h))
for pct in [0, 25, 50, 75, 100]:
    yv = y_pct(pct)
    svg.append('  <text x="{}" y="{:.1f}" text-anchor="end" class="label">{}%</text>'.format(chart_x - 8, yv + 4, pct))
svg.append('  <text x="{}" y="{}" text-anchor="middle" class="label-bold" transform="rotate(-90 {} {})">AIME (performance)</text>'.format(chart_x - 40, chart_y + chart_h / 2, chart_x - 40, chart_y + chart_h / 2))

svg.append('  </g>')

# ============================
# Bandeau bas : 3 régimes tarifaires
# ============================
BB_Y = 1040
svg.append('  <text x="80" y="{}" class="panel-title">Trois régimes tarifaires vendor 2026</text>'.format(BB_Y))
svg.append('  <text x="80" y="{}" class="panel-sub">La capability monte avec le test-time compute. La facture monte avec elle. Choisir un raisonneur = choisir un design d\'allocation compute par requête.</text>'.format(BB_Y + 16))

# 3 boxes
box_y = BB_Y + 36
box_h = 140
box_w = 250
gap = 20
total = 3 * box_w + 2 * gap
start_x = (W - total) / 2

regimes = [
    ("A — Pricing/token uniforme", "Commodity tier non-reasoning post-2026. Un seul prix /Mtok. Modèle FinOps prévisible.", "GPT-4o, Claude 3.5, Gemini 1.5"),
    ("B — Thinking tokens facturés", "Tokens « pensée » facturés au prix output (ratio 100:1 possible). Imprévisibilité forte par requête.", "o1, o3, DeepSeek-R1"),
    ("C — Effort levels exposés", "low / medium / high choisis par le caller. Externalisation au développeur de la décision compute-optimale.", "Claude 4.6 adaptive, OpenAI reasoning effort"),
]

for i, (title, body, examples) in enumerate(regimes):
    bx = start_x + i * (box_w + gap)
    svg.append('  <rect x="{:.1f}" y="{}" width="{}" height="{}" class="regime-box" rx="6"/>'.format(bx, box_y, box_w, box_h))
    svg.append('  <text x="{:.1f}" y="{}" class="regime-title">{}</text>'.format(bx + 14, box_y + 22, title))
    # Wrap body manually
    words = body.split(' ')
    lines_body = []
    current = ""
    for w in words:
        if len(current + ' ' + w) > 36 and current:
            lines_body.append(current)
            current = w
        else:
            current = (current + ' ' + w).strip()
    if current:
        lines_body.append(current)
    for j, lline in enumerate(lines_body):
        svg.append('  <text x="{:.1f}" y="{}" class="regime-body">{}</text>'.format(bx + 14, box_y + 44 + j * 15, lline))
    svg.append('  <text x="{:.1f}" y="{}" class="label-small" fill="#777" font-style="italic">ex. {}</text>'.format(bx + 14, box_y + box_h - 12, examples))

# Caption at bottom
svg.append('  <text x="{}" y="{}" text-anchor="middle" class="annotation">'.format(W / 2, H - 16))
svg.append('    Sources : Snell et al. arXiv:2408.03314 · OpenAI o1 sept. 2024 · DeepSeek-R1 Nature sept. 2025 · pricing publics Anthropic / OpenAI / Google 2026')
svg.append('  </text>')

svg.append('</svg>')

content = "\n".join(svg) + "\n"

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    f.write(content)

print("Written {} bytes -> {}".format(len(content), OUT))
