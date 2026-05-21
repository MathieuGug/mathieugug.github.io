# -*- coding: utf-8 -*-
"""
Fix bugs attack overlays :
1. Sortir les overlays de #lod-base (sinon ils héritent de opacity:0.35)
2. Agrandir et repositionner (au CENTRE de chaque slice, height ~1100)
3. Tighten data-leaf-viewbox des attack zoom-targets (zoomer plus sur les slices)
"""
import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

PATH = 'evaluation-agentique/20260521-evaluation-agentique-canvas.html'

# Positions slices
SLICE_X = {'N1': 700, 'N2': 1440, 'N3': 2180}
SLICE_W = 560

# Per-attack verdict per slice, plus contenu enrichi
VERDICTS = {
    'A-prompt-injection': {
        'N1': ('passe', 'Tests ne couvrent que les patterns connus',
               ['Templates testés en isolation', 'Garak / PromptInject scannent', 'mais les injections nouvelles passent'],
               ['Garak', 'DeepEval']),
        'N2': ('arrete', 'Anomaly detection + 👎 spikes en prod',
               ['Distribution-shift sur outputs', 'User feedback signale du bizarre', 'Détection en 2-12h'],
               ['Lakera', 'Sentry', 'Datadog']),
        'N3': ('redondant', 'Manual review filet de sécurité',
               ['Sample hebdomadaire détecte', 'les injections évidentes', 'enrichit le corpus d\'attaques'],
               ['LangSmith']),
    },
    'A-hallucination': {
        'N1': ('arrete', 'µ-3 Golden regression + Output validation',
               ['Tasks figées détectent', 'le drift sur cas connus', 'JSON schema force le format'],
               ['HaluEval', 'TruthfulQA', 'FActScore']),
        'N2': ('redondant', 'A/B verrait NPS chute',
               ['+ user feedback "l\'IA invente"', 'détection rapide', 'déjà stoppé en amont'],
               ['Statsig']),
        'N3': ('redondant', 'Manual review filet sécurité',
               ['→ feed nouvelles golden tasks', 'boucle vertueuse', 'playbook → gruyère → playbook'],
               ['LangSmith']),
    },
    'A-tool-misuse': {
        'N1': ('arrete', 'µ-2 Tool schema validation typée',
               ['JSON Schema / OpenAPI / Zod', 'arguments typés et bornés', 'rejette le mauvais appel'],
               ['JSON Schema', 'OpenAPI', 'Zod']),
        'N2': ('redondant', '5xx spikes en prod',
               ['+ "ça plante" feedback', 'rapide mais après-coup', 'C1 est plus efficace'],
               ['Sentry']),
        'N3': ('rare', 'Pas le bon outil ici',
               ['Validation programmatique gagne', 'haut la main sur tool calls', 'review humaine = overkill'],
               []),
    },
    'A-context-saturation': {
        'N1': ('passe', 'Trajectory bench partiel',
               ['Tests typiques 2-3 turns', 'pas 12+ comme en prod', '⚠ trou large'],
               ['τ-bench', 'AgentBench']),
        'N2': ('passe', 'Success_rate baisse, cause floue',
               ['Signal indirect', 'corrélation avec longueur session', 'difficile à diagnostiquer'],
               ['PostHog']),
        'N3': ('arrete', 'Manual review observe',
               ['l\'agent perdre le fil', 'sur 12+ turns', 'signal direct et lisible'],
               ['Honeycomb', 'LangSmith']),
    },
    'A-reward-hacking': {
        'N1': ('passe', 'Graders deterministic contournés',
               ['L\'agent apprend les patterns', 'explicites et les évite', 'Goodhart\'s law en action'],
               ['BBH', 'TruthfulQA']),
        'N2': ('passe', 'Métrique monte, but réel baisse',
               ['Proxy decoupling', 'A/B trompé par sur-optim', 'invisible en aggregate'],
               ['Statsig']),
        'N3': ('arrete', 'Human studies + red team manual',
               ['Détectent les patterns subtils', 'inter-rater agreement', 'gold standard'],
               ['MACHIAVELLI', 'RewardBench']),
    },
    'A-spec-mismatch': {
        'N1': ('passe', 'Schema OK pour format,',
               ['pas pour l\'INTENTION', 'le free-form passe le check', 'mais le sens dérive'],
               ['JSON Schema']),
        'N2': ('arrete', 'A/B révèle re-prompts/abandons',
               ['Les users redemandent autrement', 'session replay confirme', 'MAU baisse'],
               ['Statsig', 'PostHog']),
        'N3': ('redondant', 'Review catégorise les types',
               ['de mismatches observés', '→ feed golden tasks S2/S3', 'boucle vertueuse'],
               ['LangSmith']),
    },
    'A-latency-drift': {
        'N1': ('passe', 'Perf bench 1 task isolée',
               ['Pas trajectoire 12 tool calls', '⚠ TROU LARGE', 'fix : ajouter trajectory bench'],
               ['k6', 'Promptfoo']),
        'N2': ('passe', 'A/B utilise success_rate',
               ['pas latency comme métrique 1°', 'user tolère 1-2s, signale > 4s', 'fix : latency obligatoire'],
               ['Statsig']),
        'N3': ('passe', 'Review note la précision,',
               ['pas le timing', 'sample 20/sem ≪ M traces', 'fix : checklist timing'],
               ['LangSmith']),
    },
}

VERDICT_COLOR = {'arrete': '#4b9466', 'passe': '#b7332c', 'redondant': '#5a5a5a', 'rare': '#8a7448'}
VERDICT_BG = {'arrete': '#e8f3ec', 'passe': '#fbf2ea', 'redondant': '#f5f3ef', 'rare': '#faf8f3'}
VERDICT_BADGE = {'arrete': '✓ ARRÊTE', 'passe': '✗ PASSE', 'redondant': '⊘ REDONDANT', 'rare': '⊘ RARE'}

def make_overlay(attack_id, slice_id):
    verdict, headline, lines, frameworks = VERDICTS[attack_id][slice_id]
    color = VERDICT_COLOR[verdict]
    bg = VERDICT_BG[verdict]
    badge = VERDICT_BADGE[verdict]
    sx = SLICE_X[slice_id]
    # Plus gros : x=sx+20, y=1180, width=520, height=1100 (couvre la zone des holes)
    y0 = 1180
    h = 1100
    w = SLICE_W - 40
    lines_html = ''
    for i, line in enumerate(lines):
        lines_html += f'    <text x="{sx+40}" y="{1430 + i*45}" font-family="Cambria, Georgia, serif" font-size="24" fill="#1a1a1a">{line}</text>\n'
    # Frameworks pills
    fw_html = ''
    if frameworks:
        fw_html += f'    <text x="{sx+40}" y="{1900}" font-family="Source Code Pro, monospace" font-size="14" letter-spacing="0.15em" fill="{color}" font-weight="500">FRAMEWORKS</text>\n'
        for i, fw in enumerate(frameworks):
            px = sx + 40 + (i % 2) * 240
            py = 1940 + (i // 2) * 50
            fw_html += f'    <rect x="{px}" y="{py}" width="220" height="40" rx="4" fill="{bg}"/>\n'
            fw_html += f'    <text x="{px+110}" y="{py+27}" text-anchor="middle" font-family="Source Code Pro, monospace" font-size="18" fill="{color}">{fw}</text>\n'

    return f'''      <g class="attack-overlay" data-attack="{attack_id}" data-slice="{slice_id}">
    <rect x="{sx+20}" y="{y0}" width="{w}" height="{h}" rx="10" fill="#faf8f3" stroke="{color}" stroke-width="3"/>
    <rect x="{sx+40}" y="{y0+20}" width="200" height="44" rx="5" fill="{color}"/>
    <text x="{sx+140}" y="{y0+50}" text-anchor="middle" font-family="Source Code Pro, monospace" font-size="18" letter-spacing="0.15em" font-weight="500" fill="#faf8f3">{badge}</text>
    <text x="{sx+40}" y="{y0+140}" font-family="Cambria, Georgia, serif" font-size="30" font-weight="500" fill="#1a1a1a">{headline[:24]}</text>
    <text x="{sx+40}" y="{y0+175}" font-family="Cambria, Georgia, serif" font-size="30" font-weight="500" fill="#1a1a1a">{headline[24:48] if len(headline) > 24 else ""}</text>
{lines_html}{fw_html}
  </g>
'''

# Read
with open(PATH, encoding='utf-8') as f:
    html = f.read()

# Step 1: SUPPRIMER toutes les <g class="attack-overlay"> existantes (qui sont dans les slices)
# Pattern : <g class="attack-overlay" ... > ... </g>
old_count = html.count('<g class="attack-overlay"')
# Compteur de balance pour supprimer chaque overlay
new_html = []
pos = 0
while True:
    idx = html.find('<g class="attack-overlay"', pos)
    if idx == -1:
        new_html.append(html[pos:])
        break
    new_html.append(html[pos:idx])
    # Find closing </g> with balance
    depth = 0
    p = idx
    while p < len(html):
        no = html.find('<g', p + 1)
        nc = html.find('</g>', p + 1)
        if nc == -1:
            break
        if no != -1 and no < nc:
            depth += 1
            p = no
        else:
            if depth == 0:
                # Skip until end of </g>, plus trailing whitespace + newline
                end = nc + 4
                while end < len(html) and html[end] in ' \n':
                    end += 1
                pos = end
                break
            depth -= 1
            p = nc
html = ''.join(new_html)
print(f'Supprimé {old_count} attack-overlay groups')

# Step 2: SUPPRIMER les commentaires "<!-- 7 attack overlays for ... -->"
html = re.sub(r'\s*<!-- 7 attack overlays for N\d -->\s*', '\n', html)

# Step 3: GÉNÉRER nouveaux overlays au niveau SVG (hors lod-base)
overlays_section = '    <!-- ═══════════════════════════════════════════════════════\n'
overlays_section += '         ATTACK OVERLAYS LAYER — sibling de lod-base et zoom-targets\n'
overlays_section += '         (évite hériter de opacity 0.35 du lod-base au niveau 1)\n'
overlays_section += '         ═══════════════════════════════════════════════════════ -->\n'
overlays_section += '    <g id="attack-overlay-layer">\n'
for attack_id in VERDICTS:
    for slice_id in ['N1', 'N2', 'N3']:
        overlays_section += make_overlay(attack_id, slice_id)
overlays_section += '    </g>\n\n'

# Insérer JUSTE AVANT le <g id="canvas-hint">
hint_idx = html.index('<g id="canvas-hint">')
html = html[:hint_idx] + overlays_section + '    ' + html[hint_idx:]
print(f'Layer attack-overlay-layer inséré : {len(overlays_section)} chars')

# Step 4: TIGHTEN data-leaf-viewbox des attaques (zoom plus sur les slices)
# Nouvelle viewBox : (520, 900, 2400, 1700) — vue serrée sur les 3 slices + un peu autour
new_viewbox = '520 900 2400 1700'
old_viewbox = '180 900 3640 1600'
n = html.count(f'data-leaf-viewbox="{old_viewbox}"')
html = html.replace(f'data-leaf-viewbox="{old_viewbox}"', f'data-leaf-viewbox="{new_viewbox}"')
print(f'data-leaf-viewbox des attaques : {n} remplacés ({old_viewbox} → {new_viewbox})')

with open(PATH, 'w', encoding='utf-8') as f:
    f.write(html)

print(f'\nTotal attack-overlay finaux : {html.count("attack-overlay")}')
