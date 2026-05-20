# -*- coding: utf-8 -*-
"""
Cleanup canvas : remplace chaque zoom-target par sa version compacte,
en capturant TOUT le contenu entre le marker de début et le prochain
zoom-target (ou hint). Évite les pièges de balance counter sur structure corrompue.
"""
import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

PATH = 'evaluation-agentique/20260521-evaluation-agentique-canvas.html'

# Per-sub-card modal mapping (1 schéma par sub-card)
SUB_CARD_MODALS = {
    'S0': ('canvas-redesign/zoom-S0.svg', 'NIVEAU 2', "Démarrer tôt — détail"),
    'S1': ('canvas-redesign/zoom-S1.svg', 'NIVEAU 2', "Manuel d'abord — détail"),
    'S2': ('canvas-redesign/zoom-S2.svg', 'NIVEAU 2', "Non-ambiguïté — détail"),
    'S3': ('canvas-redesign/zoom-S3.svg', 'NIVEAU 2', "Équilibre — détail"),
    'S4': ('canvas-redesign/zoom-S4.svg', 'NIVEAU 2', "Harness stable — détail"),
    'S5': ('canvas-redesign/zoom-S5.svg', 'NIVEAU 2', "Graders sobres — détail"),
    'S6': ('canvas-redesign/zoom-S6.svg', 'NIVEAU 2', "Lire transcripts — détail"),
    'S7': ('canvas-redesign/zoom-S7.svg', 'NIVEAU 2', "Saturation — détail"),
    'C1': ('canvas-redesign/zoom-C1.svg', 'NIVEAU 2', "Automated evals — 5 µ-méthodes"),
    'C2': ('canvas-redesign/zoom-C2.svg', 'NIVEAU 2', "Production monitoring — 5 µ-méthodes"),
    'C3': ('canvas-redesign/zoom-C3.svg', 'NIVEAU 2', "A/B testing — détail"),
    'C4': ('canvas-redesign/zoom-C4.svg', 'NIVEAU 2', "User feedback — détail"),
    'C5': ('canvas-redesign/zoom-C5.svg', 'NIVEAU 2', "Manual transcript review — détail"),
    'C6': ('canvas-redesign/zoom-C6.svg', 'NIVEAU 2', "Human studies — détail"),
}

DETAILS = {
    'P1': {'color': '#1f5560', 'eyebrow': 'PHASE 1 — DÉTAIL', 'title': 'Collecte tasks',
           'sub': "Comment on amorce un système d'eval avant d'avoir un harness",
           'sub_cards': ['S0', 'S1'], 'frame_x': 200, 'frame_y': 290, 'frame_w': 880, 'frame_h': 480,
           'parent_bbox': '280,350,700,320', 'leaf_viewbox': '180 280 920 480'},
    'P2A': {'color': '#b58a2c', 'eyebrow': 'PHASE 2A — DÉTAIL', 'title': 'Cadrer les cas',
            'sub': 'Tasks dont 2 experts conviennent sur pass/fail',
            'sub_cards': ['S2', 'S3'], 'frame_x': 1020, 'frame_y': 290, 'frame_w': 880, 'frame_h': 480,
            'parent_bbox': '1100,350,700,320', 'leaf_viewbox': '1000 280 920 480'},
    'P2B': {'color': '#a07320', 'eyebrow': 'PHASE 2B — DÉTAIL', 'title': 'Harness & graders',
            'sub': 'Observabilité OTel · juges calibrés & sobres',
            'sub_cards': ['S4', 'S5'], 'frame_x': 1840, 'frame_y': 290, 'frame_w': 880, 'frame_h': 480,
            'parent_bbox': '1920,350,700,320', 'leaf_viewbox': '1820 280 920 480'},
    'P3': {'color': '#b7332c', 'eyebrow': 'PHASE 3 — DÉTAIL', 'title': 'Maintenance',
           'sub': 'Transcripts · régression evals · ownership équipe',
           'sub_cards': ['S6', 'S7'], 'frame_x': 2660, 'frame_y': 290, 'frame_w': 880, 'frame_h': 480,
           'parent_bbox': '2740,350,700,320', 'leaf_viewbox': '2640 280 920 480'},
    'N1': {'color': '#1f5560', 'eyebrow': 'COUCHE 1 — DÉTAIL', 'title': 'Préventif',
           'sub': 'Pre-launch · ce qui filtre AVANT la prod',
           'sub_cards': ['C1', 'C2'], 'frame_x': 620, 'frame_y': 970, 'frame_w': 720, 'frame_h': 1560,
           'parent_bbox': '700,1000,560,1480', 'leaf_viewbox': '600 950 760 1600'},
    'N2': {'color': '#b58a2c', 'eyebrow': 'COUCHE 2 — DÉTAIL', 'title': 'Curatif',
           'sub': "Post-launch · ce qui mesure l'impact utilisateur",
           'sub_cards': ['C3', 'C4'], 'frame_x': 1360, 'frame_y': 970, 'frame_w': 720, 'frame_h': 1560,
           'parent_bbox': '1440,1000,560,1480', 'leaf_viewbox': '1340 950 760 1600'},
    'N3': {'color': '#b7332c', 'eyebrow': 'COUCHE 3 — DÉTAIL', 'title': 'Qualitatif',
           'sub': 'Calibration humaine · gold standard',
           'sub_cards': ['C5', 'C6'], 'frame_x': 2100, 'frame_y': 970, 'frame_w': 720, 'frame_h': 1560,
           'parent_bbox': '2180,1000,560,1480', 'leaf_viewbox': '2080 950 760 1600'},
}

ATTACKS = {
    'A-prompt-injection': ('arrete', 'Prompt injection',
                           'Instructions adversariales cachées dans l\'input ou tool output',
                           '✓ ATTAQUE STOPPÉE EN COUCHE 2 · CURATIF', '100,1268,480,60'),
    'A-hallucination': ('arrete', 'Hallucination',
                        'L\'agent invente du faux factuel (chiffres, refs, citations)',
                        '✓ ATTAQUE STOPPÉE EN COUCHE 1 · PRÉVENTIF', '100,1415,480,60'),
    'A-tool-misuse': ('arrete', 'Tool misuse',
                      'Mauvais args, mauvais outil, oubli d\'appel obligatoire',
                      '✓ ATTAQUE STOPPÉE EN COUCHE 1 · PRÉVENTIF', '100,1552,480,60'),
    'A-context-saturation': ('arrete', 'Context saturation',
                              'L\'agent perd le fil sur trajectoires longues (12+ turns)',
                              '✓ ATTAQUE STOPPÉE EN COUCHE 3 · QUALITATIF', '100,1663,480,60'),
    'A-reward-hacking': ('arrete', 'Reward hacking',
                         'L\'agent sur-optimise la métrique au détriment du but réel',
                         '✓ ATTAQUE STOPPÉE EN COUCHE 3 · QUALITATIF', '100,1815,480,60'),
    'A-spec-mismatch': ('arrete', 'Spec mismatch',
                        'L\'agent fait ce qui marche techniquement, pas ce qui était demandé',
                        '✓ ATTAQUE STOPPÉE EN COUCHE 2 · CURATIF', '100,1965,480,60'),
    'A-latency-drift': ('incident', 'Latency drift',
                        'L\'agent devient lent au fil des semaines · p95 800 → 4200 ms',
                        '⚠ INCIDENT · ATTAQUE PASSE LES 3 COUCHES', '100,2165,480,60'),
}

VERDICT_BG = {'arrete': '#e8f3ec', 'passe': '#fbf2ea', 'incident': '#fbf2ea'}
VERDICT_STROKE = {'arrete': '#4b9466', 'passe': '#b7332c', 'incident': '#b7332c'}

def make_subcard(sub_id, x, y, color):
    badge = sub_id
    name_map = {
        'S0': 'Démarrer tôt', 'S1': "Manuel d'abord",
        'S2': 'Non-ambiguïté', 'S3': 'Équilibre',
        'S4': 'Harness stable', 'S5': 'Graders sobres',
        'S6': 'Lire transcripts', 'S7': 'Saturation',
        'C1': 'Automated evals', 'C2': 'Production monitor.',
        'C3': 'A/B testing', 'C4': 'User feedback',
        'C5': 'Manual review', 'C6': 'Human studies',
    }
    sub_map = {
        'S0': '20-50 tasks · 80/20', 'S1': 'pre-release · bugs',
        'S2': 'pass@k vs pass^k', 'S3': 'should / NOT trigger',
        'S4': 'isolation · OTel', 'S5': 'det > LAJ > humain',
        'S6': "vraie skill dev", 'S7': 'capability → régression',
        'C1': 'CI/CD · 5 µ-méthodes', 'C2': 'post-launch · prod',
        'C3': 'outcome utilisateur', 'C4': '👍/👎 · support',
        'C5': "calibre intuition", 'C6': 'gold standard',
    }
    name = name_map[sub_id]
    sub = sub_map[sub_id]
    svg_path, eyebrow, title_mod = SUB_CARD_MODALS[sub_id]
    # Card 380 wide instead of 480 (to fit 2 side-by-side in 880-wide frame with gap)
    return f'''        <g transform="translate({x}, {y})" data-modal-svg="{svg_path}" data-modal-eyebrow="{eyebrow}" data-modal-title="{title_mod}">
          <rect x="0" y="0" width="380" height="240" rx="10" fill="#faf8f3" stroke="{color}" stroke-width="3"/>
          <circle cx="46" cy="46" r="28" fill="{color}"/>
          <text x="46" y="56" text-anchor="middle" class="detail-title" font-size="24" font-weight="600" fill="#faf8f3">{badge}</text>
          <text x="90" y="44" font-family="Source Code Pro, monospace" font-size="14" letter-spacing="0.18em" font-weight="500" fill="{color}">SOUS-ÉTAPE</text>
          <text x="90" y="74" class="detail-title" font-size="28" fill="#1a1a1a">{name}</text>
          <text x="20" y="130" class="detail-body" font-style="italic" font-size="20" fill="#5a5a5a">{sub}</text>
          <line x1="20" y1="165" x2="360" y2="165" stroke="{color}" stroke-width="1.5" opacity="0.3"/>
          <text x="190" y="205" text-anchor="middle" font-family="Source Code Pro, monospace" font-size="14" letter-spacing="0.15em" fill="{color}" font-weight="500">→ VOIR LE DÉTAIL</text>
        </g>'''

def make_zoom_target_phase_couche(node_id, d):
    cards = d['sub_cards']
    fx, fy, fw, fh, color = d['frame_x'], d['frame_y'], d['frame_w'], d['frame_h'], d['color']
    is_horizontal = fh < 800
    if is_horizontal:
        # 2 cards 380 wide, gap 40, margins 40 each side : 40+380+40+380+40 = 880 ✓
        c1x, c1y = fx + 40, fy + 200
        c2x, c2y = fx + 460, c1y   # 40 + 380 + 40 = 460
    else:
        # Vertical stack : card 380 wide, centered in 720-wide frame
        c1x = fx + (fw - 380) // 2
        c1y = fy + 200
        c2x = c1x
        c2y = c1y + 280  # 240 height + 40 gap
    return f'''    <g class="zoom-target" data-node="{node_id}" data-cards="{node_id}"
       data-parent-bbox="{d['parent_bbox']}"
       data-leaf-viewbox="{d['leaf_viewbox']}">
      <g class="detail-content">
        <rect x="{fx}" y="{fy}" width="{fw}" height="{fh}" rx="14" class="detail-frame" stroke="{color}"/>
        <text x="{fx+40}" y="{fy+50}" font-family="Source Code Pro, monospace" font-size="18" letter-spacing="0.2em" fill="{color}">{d['eyebrow']}</text>
        <text x="{fx+40}" y="{fy+100}" class="detail-title" font-size="44" fill="{color}">{d['title']}</text>
        <text x="{fx+40}" y="{fy+135}" class="detail-body" font-style="italic" font-size="22" fill="#5a5a5a">{d['sub']}</text>
{make_subcard(cards[0], c1x, c1y, color)}
{make_subcard(cards[1], c2x, c2y, color)}
      </g>
    </g>'''

def make_zoom_target_attack(node_id, data):
    status, name, desc, label, pbbox = data
    bg = VERDICT_BG[status]
    stroke = VERDICT_STROKE[status]
    return f'''    <g class="zoom-target" data-node="{node_id}" data-cards="{node_id}"
       data-parent-bbox="{pbbox}"
       data-leaf-viewbox="180 900 3640 1600">
      <g class="detail-content">
        <rect x="200" y="950" width="3600" height="180" rx="10" fill="{bg}" stroke="{stroke}" stroke-width="2"/>
        <text x="240" y="998" font-family="Source Code Pro, monospace" font-size="22" letter-spacing="0.18em" font-weight="500" fill="{stroke}">{label}</text>
        <text x="240" y="1056" class="detail-title" font-size="48" fill="#1a1a1a">{name}</text>
        <text x="240" y="1098" class="detail-body" font-style="italic" font-size="24" fill="#5a5a5a">{desc}</text>
      </g>
    </g>'''

# Read canvas
with open(PATH, encoding='utf-8') as f:
    html = f.read()

# Phase 1: nettoyer tous les zoom-targets actuels
# On utilise un regex qui capture depuis '<g class="zoom-target"' à juste avant le suivant
# ou avant '<g id="canvas-hint">' (fin de la zone des zoom-targets)

# Pattern : capture greedy de toute la zone zoom-targets
# Marker début : premier <g class="zoom-target"
# Marker fin : <g id="canvas-hint">
zoom_start_idx = html.index('<g class="zoom-target"')
zoom_end_idx = html.index('<g id="canvas-hint">')
print(f'zone zoom-targets : char {zoom_start_idx} → {zoom_end_idx} ({zoom_end_idx - zoom_start_idx} chars)')

# Generate clean replacement
new_zoom_section = '    <!-- ═══════════════════════════════════════════════════════\n'
new_zoom_section += '         ZOOM TARGETS (régénéré clean)\n'
new_zoom_section += '         ═══════════════════════════════════════════════════════ -->\n\n'

# Phases puis couches
for node_id in ['P1', 'P2A', 'P2B', 'P3', 'N1', 'N2', 'N3']:
    new_zoom_section += '    <!-- ─── ' + node_id + ' ─── -->\n'
    new_zoom_section += make_zoom_target_phase_couche(node_id, DETAILS[node_id]) + '\n\n'

# Attaques
for atk_id, data in ATTACKS.items():
    new_zoom_section += '    <!-- ─── ' + atk_id + ' ─── -->\n'
    new_zoom_section += make_zoom_target_attack(atk_id, data) + '\n\n'

# Replace
new_html = html[:zoom_start_idx] + new_zoom_section + html[zoom_end_idx:]

with open(PATH, 'w', encoding='utf-8') as f:
    f.write(new_html)

# Stats
print(f'new zoom section : {len(new_zoom_section)} chars (avant : {zoom_end_idx - zoom_start_idx})')
print(f'data-modal-svg : {new_html.count("data-modal-svg=")}')
print(f'data-node= : {new_html.count("data-node=")}')
