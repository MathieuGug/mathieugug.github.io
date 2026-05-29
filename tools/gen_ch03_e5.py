"""Generate E5 — Comparatif PRM vs LLM-as-judge vs human eval.
Output : `livre/images/20260601-04-prm-vs-judge-vs-human-e5.svg`.
A4 portrait, viewBox 900×1280.
"""

import os

W, H = 900, 1280
OUT = "livre/images/20260601-04-prm-vs-judge-vs-human-e5.svg"

svg = []
svg.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {} {}" font-family="Inter, system-ui, sans-serif" role="img" aria-labelledby="title-e5">'.format(W, H))
svg.append('  <title id="title-e5">E5 — PRM vs LLM-as-judge vs human eval : trois mécaniques pour noter le raisonnement</title>')
svg.append('  <desc>Matrice 3 lignes (PRM, LLM-as-judge, Human eval) x 5 colonnes (coût, scalabilité, biais, fidélité, cas d usage) suivie d un bandeau bas montrant les 4 trajectoires d evolution alignees sur les 3 lignes.</desc>')

svg.append('''  <style>
    .title { font: 600 24px/1.2 'Fraunces', 'Georgia', serif; fill: #1a1a1a; }
    .subtitle { font: italic 13px/1.4 'Inter', sans-serif; fill: #555; }
    .row-title { font: 600 14px 'Inter', sans-serif; fill: #fff; }
    .row-sub { font: italic 11px 'Inter', sans-serif; fill: #fff; opacity: 0.85; }
    .col-header { font: 600 12px 'Inter', sans-serif; fill: #1a1a1a; }
    .cell-fact { font: 600 14px 'Inter', sans-serif; fill: #1a1a1a; }
    .cell-detail { font: 11px 'Inter', sans-serif; fill: #555; }
    .label { font: 11px 'JetBrains Mono', monospace; fill: #444; }
    .label-small { font: 10px 'Inter', sans-serif; fill: #666; }
    .annotation { font: italic 12px 'Inter', sans-serif; fill: #444; }
    .annotation-em { font: italic 13px 'Inter', sans-serif; fill: #b8582e; }
    .row-bg-prm { fill: #b8582e; }
    .row-bg-judge { fill: #2d8a8a; }
    .row-bg-human { fill: #5e5345; }
    .cell-bg { fill: #ffffff; stroke: #d4cdb6; stroke-width: 0.6; }
    .cell-bg-alt { fill: #f7f1de; stroke: #d4cdb6; stroke-width: 0.6; }
    .legend-box { fill: #f0e9d4; stroke: #d4cdb6; stroke-width: 0.7; }
    .arrow-traj { stroke: #1a1a1a; stroke-width: 1.4; fill: none; }
  </style>''')

svg.append('  <defs>')
svg.append('    <marker id="arr-e5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">')
svg.append('      <path d="M0,0 L10,5 L0,10 z" fill="#1a1a1a"/>')
svg.append('    </marker>')
svg.append('  </defs>')

svg.append('  <rect width="{}" height="{}" fill="#faf6ec"/>'.format(W, H))

# Title
svg.append('  <text x="40" y="42" class="title">PRM vs LLM-as-judge vs human eval</text>')
svg.append('  <text x="40" y="64" class="subtitle">Trois mécaniques pour noter la qualité d\'un raisonnement. Aucune ne suffit seule : en 2026, le pattern dominant en production combine les trois.</text>')

# Matrix layout
# 5 columns x 3 rows + header row
# Total table : 800w x 760h, starting at x=50, y=110
TABLE_X = 50
TABLE_Y = 110
ROW_LABEL_W = 180  # left column for row name
COL_W = 124  # each of 5 data columns
TABLE_W = ROW_LABEL_W + 5 * COL_W
HEADER_H = 50
ROW_H = 200
TABLE_H = HEADER_H + 3 * ROW_H

# Header row
cols = ['Coût', 'Scalabilité', 'Biais', 'Fidélité', 'Cas d\'usage']
for i, col in enumerate(cols):
    cx = TABLE_X + ROW_LABEL_W + i * COL_W
    svg.append('  <rect x="{}" y="{}" width="{}" height="{}" class="cell-bg-alt"/>'.format(cx, TABLE_Y, COL_W, HEADER_H))
    svg.append('  <text x="{:.1f}" y="{}" text-anchor="middle" class="col-header">{}</text>'.format(cx + COL_W / 2, TABLE_Y + 30, col))

# Rows
rows_data = [
    {
        "name": "PRM",
        "sub": "process reward model entraîné",
        "bg_class": "row-bg-prm",
        "cells": [
            ("0,001 $", "/évaluation\n(post-training)"),
            ("Millions/jour", "GPU-bound\nfaible latence"),
            ("Reward hacking", "99 % exploitation /\n&lt; 2 % verbalisation\n(Anthropic 2025)"),
            ("Haute si in-dist.", "S'effondre OOD ;\nfaithfulness CoT\n= pré-requis"),
            ("Math, code,\nsciences", "Training-time\nsur domaines\nvérifiables"),
        ],
    },
    {
        "name": "LLM-as-judge",
        "sub": "verifier génératif (prompté)",
        "bg_class": "row-bg-judge",
        "cells": [
            ("0,01-0,05 $", "/évaluation\n(API call)"),
            ("Millions/jour", "API-bound\nlatence variable"),
            ("Sycophantie", "position bias,\nself-preference,\nverbosity bias"),
            ("Calibrable", "0,75-0,85 IAA\navec humain\n(MT-Bench)"),
            ("Production", "audit + ranking\nhors chemin\ncritique"),
        ],
    },
    {
        "name": "Human eval",
        "sub": "SME / crowdsourcing",
        "bg_class": "row-bg-human",
        "cells": [
            ("5-150 $", "/évaluation\nselon domaine"),
            ("100s-1k/jour", "Coordination\néquipe annotateurs"),
            ("IAA variable", "0,4-0,9 selon\ntâche ; fatigue,\nbiais culturel"),
            ("Gold standard", "référence pour\ncalibrer les\ndeux autres"),
            ("Calibration +\nrégulé", "domaines à\ntraçabilité\nlégale"),
        ],
    },
]

for r_idx, row in enumerate(rows_data):
    ry = TABLE_Y + HEADER_H + r_idx * ROW_H
    # Row label box (left)
    svg.append('  <rect x="{}" y="{}" width="{}" height="{}" class="{}"/>'.format(TABLE_X, ry, ROW_LABEL_W, ROW_H, row["bg_class"]))
    svg.append('  <text x="{}" y="{}" text-anchor="middle" class="row-title">{}</text>'.format(TABLE_X + ROW_LABEL_W // 2, ry + 100, row["name"]))
    svg.append('  <text x="{}" y="{}" text-anchor="middle" class="row-sub">{}</text>'.format(TABLE_X + ROW_LABEL_W // 2, ry + 120, row["sub"]))
    # 5 cells
    for c_idx, (fact, detail) in enumerate(row["cells"]):
        cx = TABLE_X + ROW_LABEL_W + c_idx * COL_W
        bg_class = "cell-bg" if (r_idx + c_idx) % 2 == 0 else "cell-bg-alt"
        svg.append('  <rect x="{}" y="{}" width="{}" height="{}" class="{}"/>'.format(cx, ry, COL_W, ROW_H, bg_class))
        # Fact at top
        svg.append('  <text x="{:.1f}" y="{}" text-anchor="middle" class="cell-fact">{}</text>'.format(cx + COL_W / 2, ry + 36, fact))
        # Detail lines below
        detail_lines = detail.split('\n')
        for k, line in enumerate(detail_lines):
            svg.append('  <text x="{:.1f}" y="{}" text-anchor="middle" class="cell-detail">{}</text>'.format(cx + COL_W / 2, ry + 70 + k * 16, line))

# Trajectories band (bottom)
BB_Y = TABLE_Y + TABLE_H + 40
svg.append('  <text x="{}" y="{}" class="row-title" fill="#1a1a1a">Quatre trajectoires d\'évolution 2027-2028 (alignées sur les 3 mécaniques)</text>'.format(TABLE_X, BB_Y))

# 4 trajectories laid out horizontally
trajs = [
    ("RLVR généralisé", "Math/code/sciences\nle PRM devient superflu (DeepSeek-R1 → +)", "PRM →", "row-bg-prm"),
    ("Generative verifier intégré", "Raisonneur ↔ notateur convergent\n(GenRM, ThinkPRM)", "PRM + judge fusionnés", "row-bg-judge"),
    ("PRM spécialisé domaine", "Oncologie (Stanford), droit (Harvey),\ncode (Cursor, Cognition)", "PRM verticalisé", "row-bg-prm"),
    ("PRM-as-a-service", "Surge Verifier, Patronus,\nClaude Eval", "judge + human-in-loop", "row-bg-judge"),
]

t_box_w = (TABLE_W - 3 * 10) // 4  # 4 boxes with 10px gap
t_box_h = 120
for i, (title, body, arrow_label, bg) in enumerate(trajs):
    tx = TABLE_X + i * (t_box_w + 10)
    ty = BB_Y + 16
    svg.append('  <rect x="{}" y="{}" width="{}" height="{}" class="legend-box" rx="4"/>'.format(tx, ty, t_box_w, t_box_h))
    # Top stripe with the bg color
    svg.append('  <rect x="{}" y="{}" width="{}" height="6" class="{}"/>'.format(tx, ty, t_box_w, bg))
    # Title
    svg.append('  <text x="{:.1f}" y="{}" text-anchor="middle" class="col-header">{}</text>'.format(tx + t_box_w / 2, ty + 28, title))
    # Body
    for k, line in enumerate(body.split('\n')):
        svg.append('  <text x="{:.1f}" y="{}" text-anchor="middle" class="cell-detail">{}</text>'.format(tx + t_box_w / 2, ty + 50 + k * 14, line))
    # Arrow label at bottom
    svg.append('  <text x="{:.1f}" y="{}" text-anchor="middle" class="annotation-em">{}</text>'.format(tx + t_box_w / 2, ty + t_box_h - 12, arrow_label))

# Pattern dominant
PD_Y = BB_Y + 16 + t_box_h + 30
svg.append('  <rect x="{}" y="{}" width="{}" height="60" fill="#f0e9d4" stroke="#d4cdb6" stroke-width="0.7" rx="6"/>'.format(TABLE_X, PD_Y, TABLE_W))
svg.append('  <text x="{:.1f}" y="{}" text-anchor="middle" class="annotation-em">Pattern dominant 2026 en production :</text>'.format(TABLE_X + TABLE_W / 2, PD_Y + 22))
svg.append('  <text x="{:.1f}" y="{}" text-anchor="middle" class="annotation">règle déterministe (précision) + judge LLM async (couverture) + sampling humain 0,5-2 % (calibration)</text>'.format(TABLE_X + TABLE_W / 2, PD_Y + 44))

# Caption
svg.append('  <text x="{}" y="{}" text-anchor="middle" class="annotation">'.format(W / 2, H - 16))
svg.append('    Sources : Lightman 2023 PRM800K · Anthropic + OpenAI 2025 reward hacking · Zhang 2024 GenRM ICLR 2025 · Khalifa 2025 ThinkPRM · Wolfe Substack 2025 (marché)')
svg.append('  </text>')

svg.append('</svg>')

content = "\n".join(svg) + "\n"

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    f.write(content)

print("Written {} bytes -> {}".format(len(content), OUT))
