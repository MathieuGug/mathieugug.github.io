# -*- coding: utf-8 -*-
"""
Ajoute 21 attack-overlay groups (7 attaques × 3 slices) dans les 3
slices existantes. Plus 7 règles CSS :has() pour révéler la bonne
overlay quand une attaque est focalisée.
"""
import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

PATH = 'evaluation-agentique/20260521-evaluation-agentique-canvas.html'

SLICE_X = {'N1': 700, 'N2': 1440, 'N3': 2180}
SLICE_W = 560

VERDICTS = {
    'A-prompt-injection': {
        'N1': ('passe', 'Tests ne couvrent que', 'les patterns connus'),
        'N2': ('arrete', 'Anomaly detection', '+ 👎 spikes en prod'),
        'N3': ('redondant', 'Manual review', 'filet de sécurité'),
    },
    'A-hallucination': {
        'N1': ('arrete', 'µ-3 Golden regression', '+ output validation'),
        'N2': ('redondant', 'A/B verrait NPS chute', '+ user feedback'),
        'N3': ('redondant', 'Manual review', 'filet sécurité'),
    },
    'A-tool-misuse': {
        'N1': ('arrete', 'µ-2 Tool schema', 'validation typée'),
        'N2': ('redondant', '5xx spikes en prod', '+ « ça plante » feedback'),
        'N3': ('rare', 'Pas le bon outil ici', 'validation gagne'),
    },
    'A-context-saturation': {
        'N1': ('passe', 'Trajectory bench partiel', '2-3 turns, pas 12+'),
        'N2': ('passe', 'Success_rate baisse,', 'cause floue'),
        'N3': ('arrete', 'Manual review observe', "l'agent perdre le fil"),
    },
    'A-reward-hacking': {
        'N1': ('passe', 'Graders deterministic', 'contournés par l\'agent'),
        'N2': ('passe', 'Métrique monte,', 'but réel baisse en silence'),
        'N3': ('arrete', 'Human studies', '+ red team manual'),
    },
    'A-spec-mismatch': {
        'N1': ('passe', 'Schema OK pour format,', "pas pour l'intention"),
        'N2': ('arrete', 'A/B révèle re-prompts,', 'abandons utilisateur'),
        'N3': ('redondant', 'Review catégorise', 'les types de mismatches'),
    },
    'A-latency-drift': {
        'N1': ('passe', 'Perf bench 1 task isolée,', 'pas trajectoire'),
        'N2': ('passe', 'A/B utilise success_rate,', 'pas latency'),
        'N3': ('passe', 'Review note la précision,', 'pas le timing'),
    },
}

VERDICT_COLOR = {'arrete': '#4b9466', 'passe': '#b7332c', 'redondant': '#5a5a5a', 'rare': '#8a7448'}
VERDICT_BADGE = {'arrete': '✓ ARRÊTE', 'passe': '✗ PASSE', 'redondant': '⊘ REDONDANT', 'rare': '⊘ RARE'}

def make_overlay(attack_id, slice_id):
    verdict, line1, line2 = VERDICTS[attack_id][slice_id]
    color = VERDICT_COLOR[verdict]
    badge = VERDICT_BADGE[verdict]
    sx = SLICE_X[slice_id]
    y = 2270
    dash = ' stroke-dasharray="6 4"' if verdict in ('redondant', 'rare') else ''
    return f'''        <g class="attack-overlay" data-attack="{attack_id}">
          <rect x="{sx+20}" y="{y}" width="{SLICE_W-40}" height="190" rx="8" fill="#faf8f3" stroke="{color}" stroke-width="3"{dash}/>
          <rect x="{sx+30}" y="{y+12}" width="170" height="40" rx="4" fill="{color}"/>
          <text x="{sx+115}" y="{y+40}" text-anchor="middle" font-family="Source Code Pro, monospace" font-size="17" letter-spacing="0.15em" font-weight="500" fill="#faf8f3">{badge}</text>
          <text x="{sx+30}" y="{y+90}" font-family="Cambria, Georgia, serif" font-size="21" font-weight="500" fill="#1a1a1a">{line1}</text>
          <text x="{sx+30}" y="{y+120}" font-family="Cambria, Georgia, serif" font-size="21" font-weight="500" fill="#1a1a1a">{line2}</text>
          <text x="{sx+30}" y="{y+165}" font-family="Source Code Pro, monospace" font-size="14" letter-spacing="0.1em" fill="{color}" opacity="0.75">{attack_id.replace("A-","").replace("-"," ")}</text>
        </g>
'''

# Read canvas
with open(PATH, encoding='utf-8') as f:
    html = f.read()

# Pour chaque slice (N1, N2, N3), trouver son <g data-card="X"> et insérer les overlays AVANT son </g>
for slice_id in ['N1', 'N2', 'N3']:
    marker = f'<g data-card="{slice_id}">'
    idx = html.find(marker)
    if idx == -1:
        print(f'! no match {slice_id}')
        continue
    # Balance counter pour trouver le </g> de fermeture du slice
    depth = 0
    pos = idx
    close_pos = -1
    while pos < len(html):
        next_open = html.find('<g', pos + 1)
        next_close = html.find('</g>', pos + 1)
        if next_close == -1:
            break
        if next_open != -1 and next_open < next_close:
            depth += 1
            pos = next_open
        else:
            if depth == 0:
                close_pos = next_close
                break
            depth -= 1
            pos = next_close
    if close_pos == -1:
        print(f'! no close {slice_id}')
        continue
    # Génère les 7 overlays pour ce slice
    overlays = '\n        <!-- 7 attack overlays for ' + slice_id + ' -->\n'
    for attack_id in VERDICTS:
        overlays += make_overlay(attack_id, slice_id)
    # Insère avant </g>
    html = html[:close_pos] + overlays + '      ' + html[close_pos:]
    print(f'{slice_id} : 7 overlays insérés à pos {close_pos}')

# Ajout des règles CSS :has() avant le </style>
css_rules = '''
/* ═══════════════════════════════════════════════════════
   ATTACK OVERLAYS — homéomorphisme : overlays in-place dans les slices
   ═══════════════════════════════════════════════════════ */
svg[data-canvas-zoom] .attack-overlay {
  opacity: 0; transition: opacity 400ms ease; pointer-events: none;
}
svg[data-canvas-zoom]:has(.zoom-target[data-node="A-prompt-injection"][data-state="focused"]) .attack-overlay[data-attack="A-prompt-injection"] { opacity: 1; }
svg[data-canvas-zoom]:has(.zoom-target[data-node="A-hallucination"][data-state="focused"]) .attack-overlay[data-attack="A-hallucination"] { opacity: 1; }
svg[data-canvas-zoom]:has(.zoom-target[data-node="A-tool-misuse"][data-state="focused"]) .attack-overlay[data-attack="A-tool-misuse"] { opacity: 1; }
svg[data-canvas-zoom]:has(.zoom-target[data-node="A-context-saturation"][data-state="focused"]) .attack-overlay[data-attack="A-context-saturation"] { opacity: 1; }
svg[data-canvas-zoom]:has(.zoom-target[data-node="A-reward-hacking"][data-state="focused"]) .attack-overlay[data-attack="A-reward-hacking"] { opacity: 1; }
svg[data-canvas-zoom]:has(.zoom-target[data-node="A-spec-mismatch"][data-state="focused"]) .attack-overlay[data-attack="A-spec-mismatch"] { opacity: 1; }
svg[data-canvas-zoom]:has(.zoom-target[data-node="A-latency-drift"][data-state="focused"]) .attack-overlay[data-attack="A-latency-drift"] { opacity: 1; }
'''

# Insertion CSS : juste avant </style>
style_close = html.index('</style>')
html = html[:style_close] + css_rules + html[style_close:]
print('CSS :has() rules ajoutées (7 attaques)')

with open(PATH, 'w', encoding='utf-8') as f:
    f.write(html)

print(f'\ntotal attack-overlay groups : {html.count("attack-overlay")}')
