# -*- coding: utf-8 -*-
"""
Refactor canvas niveau 1 :
- Détails phases/couches stripped : juste header + 2 sous-cards compactes cliquables
- Chaque sous-card ouvre une modale niveau-2 (schéma du rapport ou mockup)
"""
import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

PATH = 'evaluation-agentique/20260521-evaluation-agentique-canvas.html'

# Mapping sous-card -> (label, sub-line, modal SVG path, modal title)
SUB_CARDS = {
    'S0': ('S0', 'Démarrer tôt', '20-50 tasks · règle 80/20',
           'canvas-redesign/mockup-niveau-1a-zoom-phase.svg',
           'NIVEAU 2 · S0+S1', 'Collecte tasks — détail'),
    'S1': ('S1', "Manuel d'abord", 'checks pre-release · bugs · support',
           'canvas-redesign/mockup-niveau-1a-zoom-phase.svg',
           'NIVEAU 2 · S0+S1', 'Collecte tasks — détail'),
    'S2': ('S2', 'Non-ambiguïté', 'pass@k vs pass^k · 2 experts',
           'images/20260501-04-pyramide-metriques.svg',
           'NIVEAU 2 · SCHÉMA 04', 'Pyramide des métriques'),
    'S3': ('S3', 'Équilibre', 'should trigger / should NOT trigger',
           'images/20260501-06bis-testcase-formula.svg',
           'NIVEAU 2 · SCHÉMA 06bis', 'TestCase formula'),
    'S4': ('S4', 'Harness stable', 'isolation · clean env · OTel',
           'images/20260501-07-observabilite-rca.svg',
           'NIVEAU 2 · SCHÉMA 07', 'Observabilité OTel · RCA'),
    'S5': ('S5', 'Graders sobres', 'det > LAJ > humain · partial credit',
           'images/20260501-03-taxonomie-graders.svg',
           'NIVEAU 2 · SCHÉMA 03', 'Taxonomie des graders'),
    'S6': ('S6', 'Lire transcripts', "vraie skill d'agent dev",
           'images/20260501-07-observabilite-rca.svg',
           'NIVEAU 2 · SCHÉMA 07', 'Observabilité · RCA (focus traces)'),
    'S7': ('S7', 'Saturation', 'capability → régression · ownership',
           'images/20260501-01-evolution-paradigmes.svg',
           'NIVEAU 2 · SCHÉMA 01', 'Évolution des paradigmes'),
    'C1': ('C1', 'Automated evals', 'CI/CD pre-launch · 5 µ-méthodes',
           'canvas-redesign/mockup-niveau-1b-zoom-couche.svg',
           'NIVEAU 2 · C1+C2', 'Préventif — détail méthodes'),
    'C2': ('C2', 'Production monitoring', 'post-launch · vérité terrain',
           'images/20260501-07-observabilite-rca.svg',
           'NIVEAU 2 · SCHÉMA 07', 'Observabilité · RCA (focus prod)'),
    'C3': ('C3', 'A/B testing', 'outcome utilisateur · décisif',
           'images/20260501-09-couts-goulots.svg',
           'NIVEAU 2 · SCHÉMA 09', 'Coûts & goulots'),
    'C4': ('C4', 'User feedback', '👍/👎 · support · cas non-anticipés',
           'images/20260501-06-user-simulation.svg',
           'NIVEAU 2 · SCHÉMA 06', 'Simulation utilisateur τ-bench'),
    'C5': ('C5', 'Manual transcript', 'calibre l\'intuition · ne scale pas',
           'images/20260501-07-observabilite-rca.svg',
           'NIVEAU 2 · SCHÉMA 07', 'Observabilité · RCA (focus review)'),
    'C6': ('C6', 'Human studies', 'gold standard · 2-3x/an',
           'images/20260501-05-llm-as-judge.svg',
           'NIVEAU 2 · SCHÉMA 05', 'LLM-as-judge · calibration'),
}

# Détail-content pour chaque phase/couche : header + 2 sous-cards compactes
def make_subcard(sub_id, x, y, color):
    badge, name, sub, svg_path, eyebrow, title = SUB_CARDS[sub_id][:6]
    svg_path = SUB_CARDS[sub_id][3]
    eyebrow = SUB_CARDS[sub_id][4]
    title_mod = SUB_CARDS[sub_id][5]
    # Compact sub-card 480x220
    return f'''        <g transform="translate({x}, {y})" data-modal-svg="{svg_path}" data-modal-eyebrow="{eyebrow}" data-modal-title="{title_mod}">
          <rect x="0" y="0" width="480" height="240" rx="10" fill="#faf8f3" stroke="{color}" stroke-width="3"/>
          <circle cx="50" cy="50" r="30" fill="{color}"/>
          <text x="50" y="62" text-anchor="middle" class="detail-title" font-size="28" font-weight="600" fill="#faf8f3">{badge}</text>
          <text x="100" y="50" font-family="Source Code Pro, monospace" font-size="16" letter-spacing="0.2em" font-weight="500" fill="{color}">SOUS-ÉTAPE</text>
          <text x="100" y="80" class="detail-title" font-size="34" fill="#1a1a1a">{name}</text>
          <text x="20" y="135" class="detail-body" font-style="italic" font-size="22" fill="#5a5a5a">{sub}</text>
          <line x1="20" y1="170" x2="460" y2="170" stroke="{color}" stroke-width="1.5" opacity="0.3"/>
          <text x="240" y="208" text-anchor="middle" font-family="Source Code Pro, monospace" font-size="15" letter-spacing="0.2em" fill="{color}" font-weight="500">CLIQUE POUR LE DÉTAIL TECHNIQUE →</text>
        </g>
'''

# Pour chaque détail, construit le nouveau contenu compact
DETAILS = {
    'P1': {
        'color': '#1f5560', 'eyebrow': 'PHASE 1 — DÉTAIL', 'title': 'Collecte tasks',
        'sub': "Comment on amorce un système d'eval avant d'avoir un harness",
        'sub_cards': ['S0', 'S1'], 'frame_x': 200, 'frame_y': 290, 'frame_w': 880, 'frame_h': 480
    },
    'P2A': {
        'color': '#b58a2c', 'eyebrow': 'PHASE 2A — DÉTAIL', 'title': 'Cadrer les cas',
        'sub': 'Tasks dont 2 experts conviennent sur pass/fail',
        'sub_cards': ['S2', 'S3'], 'frame_x': 1020, 'frame_y': 290, 'frame_w': 880, 'frame_h': 480
    },
    'P2B': {
        'color': '#a07320', 'eyebrow': 'PHASE 2B — DÉTAIL', 'title': 'Harness & graders',
        'sub': 'Observabilité OTel · juges calibrés & sobres',
        'sub_cards': ['S4', 'S5'], 'frame_x': 1840, 'frame_y': 290, 'frame_w': 880, 'frame_h': 480
    },
    'P3': {
        'color': '#b7332c', 'eyebrow': 'PHASE 3 — DÉTAIL', 'title': 'Maintenance',
        'sub': 'Transcripts · régression evals · ownership équipe',
        'sub_cards': ['S6', 'S7'], 'frame_x': 2660, 'frame_y': 290, 'frame_w': 880, 'frame_h': 480
    },
    'N1': {
        'color': '#1f5560', 'eyebrow': 'COUCHE 1 — DÉTAIL', 'title': 'Préventif',
        'sub': 'Pre-launch · ce qui filtre AVANT la prod',
        'sub_cards': ['C1', 'C2'], 'frame_x': 620, 'frame_y': 970, 'frame_w': 720, 'frame_h': 1560
    },
    'N2': {
        'color': '#b58a2c', 'eyebrow': 'COUCHE 2 — DÉTAIL', 'title': 'Curatif',
        'sub': "Post-launch · ce qui mesure l'impact utilisateur",
        'sub_cards': ['C3', 'C4'], 'frame_x': 1360, 'frame_y': 970, 'frame_w': 720, 'frame_h': 1560
    },
    'N3': {
        'color': '#b7332c', 'eyebrow': 'COUCHE 3 — DÉTAIL', 'title': 'Qualitatif',
        'sub': 'Calibration humaine · gold standard',
        'sub_cards': ['C5', 'C6'], 'frame_x': 2100, 'frame_y': 970, 'frame_w': 720, 'frame_h': 1560
    },
}

def make_detail(node_id, d):
    cards = d['sub_cards']
    frame_x = d['frame_x']
    frame_y = d['frame_y']
    frame_w = d['frame_w']
    frame_h = d['frame_h']
    color = d['color']
    # Header inside frame
    out = f'''      <g class="detail-content">
        <rect x="{frame_x}" y="{frame_y}" width="{frame_w}" height="{frame_h}" rx="14" class="detail-frame" stroke="{color}"/>
        <text x="{frame_x+40}" y="{frame_y+50}" font-family="Source Code Pro, monospace" font-size="18" letter-spacing="0.2em" fill="{color}">{d['eyebrow']}</text>
        <text x="{frame_x+40}" y="{frame_y+100}" class="detail-title" font-size="44" fill="{color}">{d['title']}</text>
        <text x="{frame_x+40}" y="{frame_y+135}" class="detail-body" font-style="italic" font-size="22" fill="#5a5a5a">{d['sub']}</text>
'''
    # Sub-cards layout : 2 cards. For phases (frame_h~480), side by side horizontally. For couches (frame_h~1560), stacked vertically.
    is_horizontal = frame_h < 800
    if is_horizontal:
        # Side by side
        card1_x = frame_x + 40
        card1_y = frame_y + 180
        card2_x = frame_x + frame_w - 520
        card2_y = card1_y
    else:
        # Stacked
        card1_x = frame_x + 40
        card1_y = frame_y + 200
        card2_x = card1_x
        card2_y = card1_y + 320
    out += make_subcard(cards[0], card1_x, card1_y, color)
    out += make_subcard(cards[1], card2_x, card2_y, color)
    out += '      </g>\n'
    return out

# Open file and replace each detail-content
with open(PATH, encoding='utf-8') as f:
    html = f.read()

new_html = html
for node_id, d in DETAILS.items():
    # Match the zoom-target opening and find its detail-content boundaries
    # Search for the specific zoom-target by data-node
    pattern = re.compile(
        r'(<g class="zoom-target" data-node="' + node_id + r'"[^>]*>\s*\n?)'
        r'(\s*<g class="detail-content">.*?</g>\s*\n?\s*)'
        r'(</g>)',
        re.DOTALL
    )
    new_detail = make_detail(node_id, d)
    def repl(m):
        return m.group(1) + new_detail + '      ' + m.group(3)
    new_html2, count = pattern.subn(repl, new_html, count=1)
    if count == 0:
        print(f'NO MATCH for {node_id}')
    else:
        print(f'replaced detail for {node_id}')
        new_html = new_html2

with open(PATH, 'w', encoding='utf-8') as f:
    f.write(new_html)

# Verify modals wiring count
n_modals = new_html.count('data-modal-svg=')
print(f'\ndata-modal-svg attributes total : {n_modals}')
