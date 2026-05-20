# -*- coding: utf-8 -*-
"""
Refactor canvas niveau 1 : détails stripped → sub-cards cliquables.
Utilise un compteur de balance <g>/</g> pour trouver les bornes correctes.
"""
import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

PATH = 'evaluation-agentique/20260521-evaluation-agentique-canvas.html'

SUB_CARDS = {
    'S0': ('S0', 'Démarrer tôt', '20-50 tasks · règle 80/20',
           'canvas-redesign/mockup-niveau-1a-zoom-phase.svg', 'NIVEAU 2 · S0+S1', 'Collecte tasks — détail'),
    'S1': ('S1', "Manuel d'abord", 'checks pre-release · bugs · support',
           'canvas-redesign/mockup-niveau-1a-zoom-phase.svg', 'NIVEAU 2 · S0+S1', 'Collecte tasks — détail'),
    'S2': ('S2', 'Non-ambiguïté', 'pass@k vs pass^k · 2 experts',
           'images/20260501-04-pyramide-metriques.svg', 'NIVEAU 2 · SCHÉMA 04', 'Pyramide des métriques'),
    'S3': ('S3', 'Équilibre', 'should trigger / should NOT trigger',
           'images/20260501-06bis-testcase-formula.svg', 'NIVEAU 2 · SCHÉMA 06bis', 'TestCase formula'),
    'S4': ('S4', 'Harness stable', 'isolation · clean env · OTel',
           'images/20260501-07-observabilite-rca.svg', 'NIVEAU 2 · SCHÉMA 07', 'Observabilité OTel · RCA'),
    'S5': ('S5', 'Graders sobres', 'det > LAJ > humain · partial credit',
           'images/20260501-03-taxonomie-graders.svg', 'NIVEAU 2 · SCHÉMA 03', 'Taxonomie des graders'),
    'S6': ('S6', 'Lire transcripts', "vraie skill d'agent dev",
           'images/20260501-07-observabilite-rca.svg', 'NIVEAU 2 · SCHÉMA 07', 'Observabilité · RCA (focus traces)'),
    'S7': ('S7', 'Saturation', 'capability → régression · ownership',
           'images/20260501-01-evolution-paradigmes.svg', 'NIVEAU 2 · SCHÉMA 01', 'Évolution des paradigmes'),
    'C1': ('C1', 'Automated evals', 'CI/CD pre-launch · 5 µ-méthodes',
           'canvas-redesign/mockup-niveau-1b-zoom-couche.svg', 'NIVEAU 2 · C1+C2', 'Préventif — détail méthodes'),
    'C2': ('C2', 'Production monitoring', 'post-launch · vérité terrain',
           'images/20260501-07-observabilite-rca.svg', 'NIVEAU 2 · SCHÉMA 07', 'Observabilité · RCA (focus prod)'),
    'C3': ('C3', 'A/B testing', 'outcome utilisateur · décisif',
           'images/20260501-09-couts-goulots.svg', 'NIVEAU 2 · SCHÉMA 09', 'Coûts & goulots'),
    'C4': ('C4', 'User feedback', '👍/👎 · support · cas non-anticipés',
           'images/20260501-06-user-simulation.svg', 'NIVEAU 2 · SCHÉMA 06', 'Simulation utilisateur τ-bench'),
    'C5': ('C5', 'Manual transcript', "calibre l'intuition · ne scale pas",
           'images/20260501-07-observabilite-rca.svg', 'NIVEAU 2 · SCHÉMA 07', 'Observabilité · RCA (focus review)'),
    'C6': ('C6', 'Human studies', 'gold standard · 2-3x/an',
           'images/20260501-05-llm-as-judge.svg', 'NIVEAU 2 · SCHÉMA 05', 'LLM-as-judge · calibration'),
}

DETAILS = {
    'P1': {'color': '#1f5560', 'eyebrow': 'PHASE 1 — DÉTAIL', 'title': 'Collecte tasks',
           'sub': "Comment on amorce un système d'eval avant d'avoir un harness",
           'sub_cards': ['S0', 'S1'], 'frame_x': 200, 'frame_y': 290, 'frame_w': 880, 'frame_h': 480},
    'P2A': {'color': '#b58a2c', 'eyebrow': 'PHASE 2A — DÉTAIL', 'title': 'Cadrer les cas',
            'sub': 'Tasks dont 2 experts conviennent sur pass/fail',
            'sub_cards': ['S2', 'S3'], 'frame_x': 1020, 'frame_y': 290, 'frame_w': 880, 'frame_h': 480},
    'P2B': {'color': '#a07320', 'eyebrow': 'PHASE 2B — DÉTAIL', 'title': 'Harness & graders',
            'sub': 'Observabilité OTel · juges calibrés & sobres',
            'sub_cards': ['S4', 'S5'], 'frame_x': 1840, 'frame_y': 290, 'frame_w': 880, 'frame_h': 480},
    'P3': {'color': '#b7332c', 'eyebrow': 'PHASE 3 — DÉTAIL', 'title': 'Maintenance',
           'sub': 'Transcripts · régression evals · ownership équipe',
           'sub_cards': ['S6', 'S7'], 'frame_x': 2660, 'frame_y': 290, 'frame_w': 880, 'frame_h': 480},
    'N1': {'color': '#1f5560', 'eyebrow': 'COUCHE 1 — DÉTAIL', 'title': 'Préventif',
           'sub': 'Pre-launch · ce qui filtre AVANT la prod',
           'sub_cards': ['C1', 'C2'], 'frame_x': 620, 'frame_y': 970, 'frame_w': 720, 'frame_h': 1560},
    'N2': {'color': '#b58a2c', 'eyebrow': 'COUCHE 2 — DÉTAIL', 'title': 'Curatif',
           'sub': "Post-launch · ce qui mesure l'impact utilisateur",
           'sub_cards': ['C3', 'C4'], 'frame_x': 1360, 'frame_y': 970, 'frame_w': 720, 'frame_h': 1560},
    'N3': {'color': '#b7332c', 'eyebrow': 'COUCHE 3 — DÉTAIL', 'title': 'Qualitatif',
           'sub': 'Calibration humaine · gold standard',
           'sub_cards': ['C5', 'C6'], 'frame_x': 2100, 'frame_y': 970, 'frame_w': 720, 'frame_h': 1560},
}

def make_subcard(sub_id, x, y, color):
    badge, name, sub, svg_path, eyebrow, title_mod = SUB_CARDS[sub_id]
    return f'''        <g transform="translate({x}, {y})" data-modal-svg="{svg_path}" data-modal-eyebrow="{eyebrow}" data-modal-title="{title_mod}">
          <rect x="0" y="0" width="480" height="240" rx="10" fill="#faf8f3" stroke="{color}" stroke-width="3"/>
          <circle cx="50" cy="50" r="30" fill="{color}"/>
          <text x="50" y="62" text-anchor="middle" class="detail-title" font-size="28" font-weight="600" fill="#faf8f3">{badge}</text>
          <text x="100" y="50" font-family="Source Code Pro, monospace" font-size="16" letter-spacing="0.2em" font-weight="500" fill="{color}">SOUS-ÉTAPE</text>
          <text x="100" y="80" class="detail-title" font-size="34" fill="#1a1a1a">{name}</text>
          <text x="20" y="135" class="detail-body" font-style="italic" font-size="22" fill="#5a5a5a">{sub}</text>
          <line x1="20" y1="170" x2="460" y2="170" stroke="{color}" stroke-width="1.5" opacity="0.3"/>
          <text x="240" y="208" text-anchor="middle" font-family="Source Code Pro, monospace" font-size="15" letter-spacing="0.2em" fill="{color}" font-weight="500">CLIQUE POUR LE DÉTAIL TECHNIQUE →</text>
        </g>'''

def make_detail(node_id, d):
    cards = d['sub_cards']
    fx, fy, fw, fh, color = d['frame_x'], d['frame_y'], d['frame_w'], d['frame_h'], d['color']
    is_horizontal = fh < 800
    if is_horizontal:
        c1x, c1y = fx + 40, fy + 180
        c2x, c2y = fx + fw - 520, c1y
    else:
        c1x, c1y = fx + 40, fy + 200
        c2x, c2y = c1x, c1y + 320
    return f'''<g class="detail-content">
        <rect x="{fx}" y="{fy}" width="{fw}" height="{fh}" rx="14" class="detail-frame" stroke="{color}"/>
        <text x="{fx+40}" y="{fy+50}" font-family="Source Code Pro, monospace" font-size="18" letter-spacing="0.2em" fill="{color}">{d['eyebrow']}</text>
        <text x="{fx+40}" y="{fy+100}" class="detail-title" font-size="44" fill="{color}">{d['title']}</text>
        <text x="{fx+40}" y="{fy+135}" class="detail-body" font-style="italic" font-size="22" fill="#5a5a5a">{d['sub']}</text>
{make_subcard(cards[0], c1x, c1y, color)}
{make_subcard(cards[1], c2x, c2y, color)}
      </g>'''

def find_matching_close(html, start_pos):
    """Trouve le </g> qui ferme le <g> ouvrant à start_pos. Compteur de balance."""
    # start_pos pointe sur le '<' du <g... opening
    depth = 0
    pos = start_pos
    while pos < len(html):
        next_open = html.find('<g', pos + 1)
        next_close = html.find('</g>', pos + 1)
        if next_close == -1:
            return -1
        if next_open != -1 and next_open < next_close:
            # check that <g is really an opening (vs <g/> self-closing — pas dans notre cas)
            depth += 1
            pos = next_open
        else:
            if depth == 0:
                return next_close + 4  # position après </g>
            depth -= 1
            pos = next_close
    return -1

with open(PATH, encoding='utf-8') as f:
    html = f.read()

# Pour chaque zoom-target P1/P2A/P2B/P3/N1/N2/N3, remplacer son contenu
for node_id, d in DETAILS.items():
    # Trouver le début du zoom-target
    marker = f'<g class="zoom-target" data-node="{node_id}"'
    idx = html.find(marker)
    if idx == -1:
        print(f'NO match for zoom-target {node_id}')
        continue
    # Trouver la fin (le > du tag opening)
    open_end = html.index('>', idx) + 1
    # Trouver le </g> matching (balance counter)
    close_end = find_matching_close(html, idx)
    if close_end == -1:
        print(f'No closing </g> for {node_id}')
        continue
    # Construire le nouveau contenu
    new_content = '\n      ' + make_detail(node_id, d) + '\n    '
    # Remplacer entre open_end (après >) et close_end - 4 (avant </g>)
    html = html[:open_end] + new_content + html[close_end - 4:]
    print(f'replaced {node_id} : new content {len(new_content)} chars')

# Aussi : strip les attack zoom-targets pour ne garder que header (TODO un autre script)
# Pour cette itération on garde les attaques avec leurs cards (à refactorer après validation niveau 1)

with open(PATH, 'w', encoding='utf-8') as f:
    f.write(html)

# Verify
n_modals = html.count('data-modal-svg=')
print(f'\ndata-modal-svg total: {n_modals}')
n_microbands = html.count('Prompt unit tests')
print(f'occurrences "Prompt unit tests" (devrait être 0 hors attack zoom): {n_microbands}')
