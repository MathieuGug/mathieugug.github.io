# -*- coding: utf-8 -*-
"""
3 fixes :
1. Strip 7 attack zoom-targets (header only, comme phases)
2. Affordance text raccourci → "VOIR LE DÉTAIL →"
3. Modales par sous-card individuel (1 schéma par sub-card, plus de combinaison)
"""
import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

PATH = 'evaluation-agentique/20260521-evaluation-agentique-canvas.html'

# Per-sub-card modal mapping (1 schéma dédié par sub-card)
SUB_CARD_MODALS = {
    'S0': ('images/20260501-02-anatomie-evaluation.svg',
           'SCHÉMA 02', "Anatomie d'une évaluation"),
    'S1': ('images/20260501-02-anatomie-evaluation.svg',
           'SCHÉMA 02', "Anatomie — sources manuelles"),
    'S2': ('images/20260501-04-pyramide-metriques.svg',
           'SCHÉMA 04', 'Pyramide des métriques'),
    'S3': ('images/20260501-06bis-testcase-formula.svg',
           'SCHÉMA 06bis', 'TestCase formula'),
    'S4': ('images/20260501-07-observabilite-rca.svg',
           'SCHÉMA 07', 'Observabilité OTel · RCA'),
    'S5': ('images/20260501-03-taxonomie-graders.svg',
           'SCHÉMA 03', 'Taxonomie des graders'),
    'S6': ('images/20260501-07-observabilite-rca.svg',
           'SCHÉMA 07', 'Observabilité · focus traces'),
    'S7': ('images/20260501-01-evolution-paradigmes.svg',
           'SCHÉMA 01', 'Évolution des paradigmes'),
    'C1': ('images/20260501-08-frameworks-matrice.svg',
           'SCHÉMA 08', 'Frameworks d\'évaluation'),
    'C2': ('images/20260501-07-observabilite-rca.svg',
           'SCHÉMA 07', 'Observabilité · focus prod'),
    'C3': ('images/20260501-09-couts-goulots.svg',
           'SCHÉMA 09', 'Coûts & goulots'),
    'C4': ('images/20260501-06-user-simulation.svg',
           'SCHÉMA 06', 'Simulation utilisateur τ-bench'),
    'C5': ('images/20260501-07-observabilite-rca.svg',
           'SCHÉMA 07', 'Observabilité · review humain'),
    'C6': ('images/20260501-05-llm-as-judge.svg',
           'SCHÉMA 05', 'LLM-as-judge · calibration'),
}

# Attack zoom-targets : header compact only
ATTACKS = {
    'A-prompt-injection': ('arrete', 'Prompt injection',
                           'Instructions adversariales cachées dans l\'input ou tool output',
                           '✓ ATTAQUE STOPPÉE EN COUCHE 2 · CURATIF'),
    'A-hallucination': ('arrete', 'Hallucination',
                        'L\'agent invente du faux factuel (chiffres, refs, citations)',
                        '✓ ATTAQUE STOPPÉE EN COUCHE 1 · PRÉVENTIF'),
    'A-tool-misuse': ('arrete', 'Tool misuse',
                      'Mauvais args, mauvais outil, oubli d\'appel obligatoire',
                      '✓ ATTAQUE STOPPÉE EN COUCHE 1 · PRÉVENTIF'),
    'A-context-saturation': ('arrete', 'Context saturation',
                              'L\'agent perd le fil sur trajectoires longues (12+ turns)',
                              '✓ ATTAQUE STOPPÉE EN COUCHE 3 · QUALITATIF'),
    'A-reward-hacking': ('arrete', 'Reward hacking',
                         'L\'agent sur-optimise la métrique au détriment du but réel',
                         '✓ ATTAQUE STOPPÉE EN COUCHE 3 · QUALITATIF'),
    'A-spec-mismatch': ('arrete', 'Spec mismatch',
                        'L\'agent fait ce qui marche techniquement, pas ce qui était demandé',
                        '✓ ATTAQUE STOPPÉE EN COUCHE 2 · CURATIF'),
    'A-latency-drift': ('incident', 'Latency drift',
                        'L\'agent devient lent au fil des semaines · p95 800 → 4200 ms',
                        '⚠ INCIDENT · ATTAQUE PASSE LES 3 COUCHES'),
}

VERDICT_COLOR = {
    'arrete': ('#e8f3ec', '#4b9466'),     # bg, stroke
    'passe':  ('#fbf2ea', '#b7332c'),
    'incident': ('#fbf2ea', '#b7332c'),
}

def make_attack_header(status, name, desc, label):
    bg, stroke = VERDICT_COLOR[status]
    return f'''<g class="detail-content">
        <rect x="200" y="950" width="3600" height="180" rx="10" fill="{bg}" stroke="{stroke}" stroke-width="2"/>
        <text x="240" y="998" font-family="Source Code Pro, monospace" font-size="22" letter-spacing="0.18em" font-weight="500" fill="{stroke}">{label}</text>
        <text x="240" y="1056" class="detail-title" font-size="48" fill="#1a1a1a">{name}</text>
        <text x="240" y="1098" class="detail-body" font-style="italic" font-size="24" fill="#5a5a5a">{desc}</text>
      </g>'''

def find_matching_close(html, start_pos):
    """Trouve le </g> qui ferme le <g> ouvrant à start_pos (compteur balance)."""
    depth = 0
    pos = start_pos
    while pos < len(html):
        next_open = html.find('<g', pos + 1)
        next_close = html.find('</g>', pos + 1)
        if next_close == -1:
            return -1
        if next_open != -1 and next_open < next_close:
            depth += 1
            pos = next_open
        else:
            if depth == 0:
                return next_close + 4
            depth -= 1
            pos = next_close
    return -1

with open(PATH, encoding='utf-8') as f:
    html = f.read()

# ════════════════════════════════════════════════════════
# FIX 1+3 : Re-map sub-card modal targets (per-sub-card)
# ════════════════════════════════════════════════════════
# Trouve chaque sous-card par sa structure : g transform="translate(...)" data-modal-svg="..."
# avec un texte "S0/S1/.../C6" à l'intérieur
n_remapped = 0
for sub_id, (svg_path, eyebrow, title) in SUB_CARD_MODALS.items():
    # Pattern : trouve le <g transform="translate(...)" data-modal-svg=... avec un text contenant >SubId<
    # Matcher chaque sub-card individuellement
    pat = re.compile(
        r'(<g transform="translate\([^)]+\)" )'
        r'data-modal-svg="[^"]*" data-modal-eyebrow="[^"]*" data-modal-title="[^"]*"'
        r'(>[^<]*<rect[^/]+/>\s*<circle[^/]+/>\s*<text[^>]+>' + re.escape(sub_id) + r'</text>)',
        re.DOTALL
    )
    new_attrs = f'data-modal-svg="{svg_path}" data-modal-eyebrow="{eyebrow}" data-modal-title="{title}"'
    new_html, c = pat.subn(r'\1' + new_attrs + r'\2', html, count=1)
    if c == 0:
        print(f'  ! no match pour sub-card {sub_id}')
    else:
        n_remapped += 1
        html = new_html
print(f'  {n_remapped}/14 sub-cards re-mappées vers schémas individuels')

# ════════════════════════════════════════════════════════
# FIX 2 : Affordance text raccourci
# ════════════════════════════════════════════════════════
old_text = 'CLIQUE POUR LE DÉTAIL TECHNIQUE →'
new_text = '→ VOIR LE DÉTAIL'
n = html.count(old_text)
html = html.replace(old_text, new_text)
print(f'  Affordance text raccourci : {n} occurrences')

# ════════════════════════════════════════════════════════
# FIX 1 : Strip attack zoom-targets (header only)
# ════════════════════════════════════════════════════════
for atk_id, (status, name, desc, label) in ATTACKS.items():
    marker = f'<g class="zoom-target" data-node="{atk_id}"'
    idx = html.find(marker)
    if idx == -1:
        print(f'  ! no match attack {atk_id}')
        continue
    open_end = html.index('>', idx) + 1
    close_end = find_matching_close(html, idx)
    if close_end == -1:
        print(f'  ! no close attack {atk_id}')
        continue
    new_content = '\n      ' + make_attack_header(status, name, desc, label) + '\n    '
    html = html[:open_end] + new_content + html[close_end - 4:]
    print(f'  strip {atk_id} : OK')

with open(PATH, 'w', encoding='utf-8') as f:
    f.write(html)

# Verify
n_modals = html.count('data-modal-svg=')
print(f'\ntotal data-modal-svg : {n_modals}')
remaining_micro = html.count('µ-1 Prompt unit tests')
print(f'occurrences "µ-1 Prompt unit tests" reste : {remaining_micro} (devrait être 0)')
