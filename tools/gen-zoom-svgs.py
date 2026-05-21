# -*- coding: utf-8 -*-
"""
Génère les 14 SVG zoom-X.svg dédiés (1 par sub-card).
- Template uniforme : header + bullets + frameworks + footer
- C1 contient le contenu riche (5 µ-méthodes) demandé explicitement
- Les 13 autres ont un placeholder structuré à enrichir
"""
import sys, io, pathlib
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

OUT_DIR = pathlib.Path('evaluation-agentique/canvas-redesign')

# Couleurs par sub-card
COLORS = {
    'S': '#1f5560',  # phases (teal)
    'S2': '#b58a2c', 'S3': '#b58a2c',  # phase 2A ocre
    'S4': '#a07320', 'S5': '#a07320',  # phase 2B ocre foncé
    'S6': '#b7332c', 'S7': '#b7332c',  # phase 3 carmine
    'C1': '#1f5560', 'C2': '#1f5560',  # couche 1 teal
    'C3': '#b58a2c', 'C4': '#b58a2c',  # couche 2 ocre
    'C5': '#b7332c', 'C6': '#b7332c',  # couche 3 carmine
}
BG = {
    '#1f5560': '#e8f0f1',
    '#b58a2c': '#f4eccc',
    '#a07320': '#f5e9c8',
    '#b7332c': '#f5dedb',
}

# Per sub-card : (badge, name, tagline, items[(label, sublabel, note)], frameworks[], footer)
DATA = {
    'S0': {
        'badge': 'S0', 'category': 'COLLECTE TASKS · DÉMARRER TÔT',
        'name': 'Démarrer tôt',
        'tagline': '20-50 tasks de vrais échecs suffisent à amorcer un système d\'eval',
        'items': [
            ('20-50 tasks', 'volume initial', 'assez pour révéler 80 % des modes d\'échec'),
            ('Issues de vrais échecs', 'sources', 'bugs reportés, edge cases déjà observés en prod'),
            ('Règle 80/20', 'discipline', 'on capture l\'essentiel avec un effort modeste'),
            ('Value compose', 'effet cumulatif', 'chaque task ajoutée renforce le harness existant'),
        ],
        'antipattern': ('Attendre 1 000 tasks gold-labellisées avant de démarrer',
                        'Conséquence : la dette d\'eval gonfle pendant qu\'on optimise dans le noir.'),
        'frameworks': ['Linear', 'GitHub Issues', 'Notion', 'Loom replay'],
        'footer': 'Toujours préférer un démarrage modeste qui itère sur la dette.',
    },
    'S1': {
        'badge': 'S1', 'category': 'COLLECTE TASKS · MANUEL D\'ABORD',
        'name': "Manuel d'abord",
        'tagline': 'Tes tasks vivent déjà dans les bugs, le support, tes checks pre-release',
        'items': [
            ('Checks pre-release', 'validation manuelle', 'ce que tu valides à la main avant chaque ship'),
            ('Bugs reportés', 'tickets', 'Linear, GitHub issues, Jira — chacun est une task'),
            ('Support queue', 'questions récurrentes', 'les patterns qui reviennent = patterns à grader'),
            ('Conversations agent', 'transcripts d\'échecs', 'où l\'agent a foiré — déjà des cas par défaut'),
        ],
        'pipeline': 'source brute → input + état attendu → test case prêt pour le grader',
        'frameworks': ['Zendesk', 'Intercom', 'PostHog session replay', 'Hotjar'],
        'footer': 'Pas besoin d\'un Excel parfait — un Notion suffit pour démarrer.',
    },
    'S2': {
        'badge': 'S2', 'category': 'CADRER LES CAS · NON-AMBIGUÏTÉ',
        'name': 'Non-ambiguïté',
        'tagline': 'Tasks dont 2 experts conviennent sur pass/fail · pass@k vs pass^k',
        'items': [
            ('2 experts → même verdict', 'critère minimal', 'si pas d\'accord, la task est cassée'),
            ('Reference solution', 'gold standard', 'la "bonne" réponse documentée'),
            ('pass@k', 'au moins 1 succès sur k tries', 'mesure de la capabilité brute'),
            ('pass^k', 'tous les k tries réussis', 'mesure de fiabilité (plus stricte)'),
        ],
        'antipattern': ('0% pass = task cassée',
                        'Si même les meilleurs experts ne savent pas trancher, le grader ne saura pas.'),
        'frameworks': ['SWE-bench', 'HumanEval', 'GAIA', 'AgentBench'],
        'footer': 'Privilégier la qualité du critère sur la quantité de tasks.',
    },
    'S3': {
        'badge': 'S3', 'category': 'CADRER LES CAS · ÉQUILIBRE',
        'name': 'Équilibre',
        'tagline': 'Should trigger / should NOT trigger — éviter l\'overtriggering',
        'items': [
            ('should trigger', 'cas où l\'agent doit agir', 'mesure la capability'),
            ('should NOT trigger', 'cas où l\'agent doit ne PAS agir', 'mesure la prudence'),
            ('Ratio cible', '50/50', 'pour éviter le bias vers une réponse par défaut'),
            ('Diversité', 'angles d\'attaque variés', 'pas tous les cas du même domaine'),
        ],
        'antipattern': ('Web search : 90% should-trigger',
                        'L\'agent apprend à toujours déclencher → coût, latence, et faux positifs.'),
        'frameworks': ['BFCL', 'ToolBench', 'BBH', 'τ-bench'],
        'footer': 'Le déséquilibre est le piège le plus fréquent des suites d\'eval naïves.',
    },
    'S4': {
        'badge': 'S4', 'category': 'HARNESS & GRADERS · HARNESS STABLE',
        'name': 'Harness stable',
        'tagline': 'Isolation par trial · clean env · pas de shared state · traces OTel',
        'items': [
            ('Isolation par trial', 'chaque task indépendante', 'pas de fuite entre les runs'),
            ('Clean environment', 'reset complet', 'filesystem, network, env vars'),
            ('Pas de shared state', 'idempotence', 'rejouer une task donne le même résultat'),
            ('Traces OpenTelemetry', 'observabilité native', 'GenAI semantic conventions OTel'),
        ],
        'antipattern': ('git history leak entre trials',
                        'L\'agent voit l\'historique de ses tentatives précédentes → l\'eval est faussée.'),
        'frameworks': ['Inspect AI', 'Anthropic Evals', 'LangSmith', 'Phoenix Arize'],
        'footer': 'Un harness flaky pollue les graders. Investir tôt.',
    },
    'S5': {
        'badge': 'S5', 'category': 'HARNESS & GRADERS · GRADERS SOBRES',
        'name': 'Graders sobres',
        'tagline': 'Déterministe > LLM-as-judge > humain · grader le résultat pas le chemin',
        'items': [
            ('Hiérarchie 1', 'déterministe quand possible', 'regex, schema check, exact match'),
            ('Hiérarchie 2', 'LLM-as-judge pour le nuancé', 'avec calibration humaine'),
            ('Hiérarchie 3', 'humain pour les cas durs', 'gold standard, mais lent et cher'),
            ('Partial credit', 'éviter le tout-ou-rien', 'gradient de qualité = signal plus riche'),
        ],
        'antipattern': ('LAJ flaky → fausses régressions',
                        'Si le LAJ n\'est pas calibré, le bruit masque le signal. Perte de confiance.'),
        'frameworks': ['DeepEval', 'Ragas', 'Promptfoo', 'OpenAI Evals'],
        'footer': 'Grader le RÉSULTAT pas le CHEMIN — sinon on bride l\'exploration.',
    },
    'S6': {
        'badge': 'S6', 'category': 'MAINTENANCE · LIRE TRANSCRIPTS',
        'name': 'Lire transcripts',
        'tagline': 'Vraie skill d\'agent dev · tooling de viz aussi rentable que les graders',
        'items': [
            ('Sample biaisé', '50% sur erreurs', 'sampler sur les outliers · pas uniforme'),
            ('Tooling de visualisation', 'investissement clé', 'rentable autant que les graders'),
            ('Lecture hebdomadaire', '1h en équipe', 'tag des patterns émergents'),
            ('Feed les graders', 'feedback loop', 'transcripts → nouvelles golden tasks'),
        ],
        'antipattern': ('Ne pas lire les transcripts',
                        'Les métriques agrégées cachent les modes d\'échec subtils. Le grader est aveugle.'),
        'frameworks': ['Honeycomb', 'LangSmith', 'Phoenix', 'Datadog APM'],
        'footer': 'La lecture qualitative est la skill la plus sous-estimée du métier.',
    },
    'S7': {
        'badge': 'S7', 'category': 'MAINTENANCE · SATURATION',
        'name': 'Saturation',
        'tagline': 'Capability eval → régression eval · ownership team · living artifact',
        'items': [
            ('Capability eval', 'au début', 'tu mesures ce que l\'agent peut faire'),
            ('Régression eval', 'à la maturité', 'tu vérifies que rien ne casse'),
            ('Ownership team', 'qui maintient ?', 'sans owner, le harness pourrit en 6 semaines'),
            ('Living artifact', 'pas un one-shot', 'la suite évolue avec le produit'),
        ],
        'antipattern': ('Harness sans owner explicite',
                        'Tout le monde et personne. Les golden tasks deviennent obsolètes silencieusement.'),
        'frameworks': ['Datadog regression', 'Sentry', 'Snowflake metrics', 'Hex'],
        'footer': 'Évolution de paradigme : eval qualitative → régression quantitative.',
    },
    'C1': {
        'badge': 'C1', 'category': 'PRÉVENTIF · AUTOMATED EVALS',
        'name': 'Automated evals',
        'tagline': 'CI/CD pre-launch · 5 µ-méthodes empilées · cycle rapide, scalable',
        'items': [
            ('µ-1 Prompt unit tests', 'templates testés en isolation', 'attrape : prompt injection sur templates'),
            ('µ-2 Tool call schema validation', 'arguments typés et bornés', 'attrape : tool misuse — mauvais args'),
            ('µ-3 Golden regression suite', 'N tasks figées re-jouées à chaque ship', 'attrape : hallucination — drift sur cas connus'),
            ('µ-4 Output structure / JSON schema', 'format validé · pas de free-form en sortie', 'attrape : spec mismatch — format incorrect'),
            ('µ-5 Perf & cost benchmark', 'latence p95 + $ par task suivis dans la CI', '⚠ trous larges : latency drift y passe souvent'),
        ],
        'antipattern': None,
        'frameworks': ['Promptfoo', 'DeepEval', 'JSON Schema', 'Anthropic Evals', 'k6 perf'],
        'footer': 'CI/CD pre-launch · drift à monitorer, investissement up-front nécessaire.',
    },
    'C2': {
        'badge': 'C2', 'category': 'PRÉVENTIF · PRODUCTION MONITORING',
        'name': 'Production monitoring',
        'tagline': 'Post-launch · vérité terrain · 5 µ-méthodes · réactif mais signal bruyant',
        'items': [
            ('µ-1 Error rate / 5xx / timeout', 'alertes sur taux d\'erreurs HTTP/runtime', 'attrape : tool misuse — échecs API répétés'),
            ('µ-2 Latency p95 / p99', 'seuils trop lâches · drift lent invisible', '⚠ TROU LARGE : latency drift passe ici → incident'),
            ('µ-3 Cost per task / token usage', 'alertes sur dépassement budget', 'attrape : reward hacking — long thinking'),
            ('µ-4 Output anomaly detection', 'distribution-shift sur les outputs', 'attrape : hallucination — sortie hors distribution'),
            ('µ-5 User reports / 👍/👎', 'signal direct mais sparse, biaisé', 'attrape : context saturation — fil perdu signalé'),
        ],
        'antipattern': None,
        'frameworks': ['Datadog', 'Honeycomb', 'Sentry', 'Anomalo', 'PostHog'],
        'footer': 'Réactif et utile, mais le signal bruyant requiert du tri.',
    },
    'C3': {
        'badge': 'C3', 'category': 'CURATIF · A/B TESTING',
        'name': 'A/B testing',
        'tagline': 'Outcome utilisateur · décisif mais lent · seul juge réel d\'une amélioration',
        'items': [
            ('Traffic split par cohorte', 'segmentation propre', 'random + filtres d\'éligibilité'),
            ('Métriques primaires', 'success rate, satisfaction', 'ce qu\'on optimise'),
            ('Métriques secondaires', 'latence, coût, escalations', 'garde-fous obligatoires'),
            ('Durée minimale', 'significativité statistique', 'pas de squashing à 2 jours'),
        ],
        'antipattern': ('Latency en métrique secondaire optionnelle',
                        'Drift invisible — l\'agent devient lent sans qu\'aucune alerte ne se déclenche.'),
        'frameworks': ['Statsig', 'GrowthBook', 'PostHog', 'Optimizely', 'Eppo'],
        'footer': 'Le seul vrai juge d\'une amélioration en prod. Mais lent.',
    },
    'C4': {
        'badge': 'C4', 'category': 'CURATIF · USER FEEDBACK',
        'name': 'User feedback',
        'tagline': 'Continu · cas non-anticipés · sparse (≪ 1%) et biaisé sévère',
        'items': [
            ('Boutons 👍/👎', 'feedback inline', 'capture immédiate après réponse'),
            ('Ticket support · NPS', 'canaux Slack/Discord', 'feedback structuré et qualitatif'),
            ('Tagger par catégorie', 'classification', 'pour analyser les patterns'),
            ('Triager hebdo en équipe', '1h max', 'cadence régulière pour éviter le backlog'),
        ],
        'antipattern': ('Ignorer les feedbacks sparse',
                        'Les utilisateurs en colère sur-représentent les feedbacks. Mais c\'est aussi un signal.'),
        'frameworks': ['Sentry feedback', 'Canny', 'Pendo', 'Productboard'],
        'footer': 'Force : capture les angles morts des graders automatisés.',
    },
    'C5': {
        'badge': 'C5', 'category': 'QUALITATIF · MANUAL TRANSCRIPT REVIEW',
        'name': 'Manual transcript review',
        'tagline': '~20 traces / semaine · lecture qualitative · calibre l\'intuition · ne scale pas',
        'items': [
            ('Sample 20 traces / semaine', 'cadence régulière', 'sur des millions de traces'),
            ('Sampling biaisé', '50% sur traces lentes/anormales', 'biais utile pour détecter les drifts'),
            ('Checklist structurée', 'précision · ton · timing', 'éviter le freestyle'),
            ('Postmortem mensuel', 'perçu vs mesuré', 'recalibration des intuitions'),
        ],
        'antipattern': ('Skipper le timing dans la checklist',
                        'Latency drift passe inaperçu. C\'est ce qui a causé l\'incident niveau 0.'),
        'frameworks': ['Honeycomb', 'LangSmith', 'Datadog APM', 'Jaeger'],
        'footer': 'Force : calibre l\'intuition de l\'équipe. Limite : ne scale pas.',
    },
    'C6': {
        'badge': 'C6', 'category': 'QUALITATIF · SYSTEMATIC HUMAN STUDIES',
        'name': 'Systematic human studies',
        'tagline': 'Gold standard · cher (~10-30 K€) · lent (~6 semaines) · à faire 2-3×/an',
        'items': [
            ('Étude formelle', 'N=30+ raters', 'pas un sample bricolé'),
            ('Calibration LAJ vs humain', 'inter-rater agreement', 'mesure du gap LAJ/gold'),
            ('Rubrics structurées', 'critères explicites', '+ double review pour la fiabilité'),
            ('Détection biais systématiques', 'biais de positionnement', 'biais culturels, etc.'),
        ],
        'antipattern': ('Faire des human studies en continu',
                        'Trop cher pour le quotidien. Réserver aux moments de recalibration majeure.'),
        'frameworks': ['Surge AI', 'Scale AI', 'Prolific', 'Toloka'],
        'footer': 'Référence pour recalibrer toute la pyramide : LAJ → graders deterministic → metrics in CI.',
    },
}

def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

def make_svg(sub_id, data):
    color = COLORS.get(sub_id, COLORS.get(sub_id[0], '#1f5560'))
    bg_color = BG[color]
    # Escape XML-sensitive chars in all text fields
    data = {**data}
    data['category'] = esc(data['category'])
    data['name'] = esc(data['name'])
    data['tagline'] = esc(data['tagline'])
    data['footer'] = esc(data['footer'])
    if data.get('antipattern'):
        data['antipattern'] = (esc(data['antipattern'][0]), esc(data['antipattern'][1]))
    items_html = ''
    for i, (label, sublabel, note) in enumerate(data['items']):
        y = 380 + i * 340
        label_x = esc(label)
        sublabel_x = esc(sublabel)
        note_x = esc(note)
        note_color = '#5a5a5a'
        if note.startswith('⚠'):
            note_color = '#b8582e'
        items_html += f'''  <g transform="translate(100, {y})">
    <rect x="0" y="0" width="1800" height="300" rx="12" fill="#faf8f3" stroke="{color}" stroke-width="2.5"/>
    <text x="40" y="50" font-family="Source Code Pro, monospace" font-size="22" letter-spacing="0.15em" fill="{color}" font-weight="500">µ-{i+1}</text>
    <text x="40" y="120" font-family="Cambria, Georgia, serif" font-size="48" font-weight="500" fill="#1a1a1a">{label_x}</text>
    <text x="40" y="170" font-family="Cambria, Georgia, serif" font-size="28" font-style="italic" fill="#5a5a5a">{sublabel_x}</text>
    <text x="40" y="240" font-family="Source Code Pro, monospace" font-size="22" fill="{note_color}">{note_x}</text>
  </g>
'''
    n_items = len(data['items'])
    anti_y = 380 + n_items * 340 + 20
    anti_html = ''
    if data.get('antipattern'):
        title, desc = data['antipattern']
        anti_html = f'''  <g transform="translate(100, {anti_y})">
    <rect x="0" y="0" width="1800" height="180" rx="10" fill="#fbf2ea" stroke="#b8582e" stroke-width="2"/>
    <text x="40" y="50" font-family="Source Code Pro, monospace" font-size="20" letter-spacing="0.2em" font-weight="500" fill="#b8582e">⚠ ANTI-PATTERN</text>
    <text x="40" y="100" font-family="Cambria, Georgia, serif" font-size="32" font-weight="500" fill="#1a1a1a">{title}</text>
    <text x="40" y="148" font-family="Cambria, Georgia, serif" font-size="24" font-style="italic" fill="#5a5a5a">{desc}</text>
  </g>
'''
        fw_y = anti_y + 220
    else:
        fw_y = anti_y

    # Frameworks pills
    pills_x = ''
    for i, fw in enumerate(data['frameworks']):
        cx = i * 230
        pills_x += f'''    <rect x="{cx}" y="0" width="210" height="48" rx="6" fill="{bg_color}"/>
    <text x="{cx + 105}" y="32" text-anchor="middle" font-family="Source Code Pro, monospace" font-size="20" fill="{color}">{fw}</text>
'''
    fw_html = f'''  <g transform="translate(100, {fw_y})">
    <text x="0" y="-20" font-family="Source Code Pro, monospace" font-size="22" letter-spacing="0.2em" font-weight="500" fill="{color}">FRAMEWORKS / OUTILS</text>
  </g>
  <g transform="translate(100, {fw_y + 10})">
{pills_x}  </g>
'''

    footer_y = fw_y + 130
    footer = f'''  <text x="100" y="{footer_y}" font-family="Cambria, Georgia, serif" font-size="26" font-style="italic" fill="#5a5a5a">« {data["footer"]} »</text>
'''

    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 {footer_y + 100}" preserveAspectRatio="xMidYMid meet">
  <rect width="2000" height="{footer_y + 100}" fill="#faf8f3"/>

  <!-- Header -->
  <text x="100" y="80" font-family="Source Code Pro, monospace" font-size="28" letter-spacing="0.2em" font-weight="500" fill="{color}">{data["category"]}</text>
  <text x="100" y="180" font-family="Cambria, Georgia, serif" font-size="84" font-weight="500" fill="#1a1a1a">{data["name"]}</text>
  <text x="100" y="240" font-family="Cambria, Georgia, serif" font-size="36" font-style="italic" fill="#5a5a5a">{data["tagline"]}</text>
  <line x1="100" y1="290" x2="800" y2="290" stroke="{color}" stroke-width="3"/>

  <!-- Items -->
{items_html}

  <!-- Anti-pattern (si présent) -->
{anti_html}

  <!-- Frameworks -->
{fw_html}

  <!-- Footer -->
{footer}
</svg>
'''
    return svg

# Génération
for sub_id, data in DATA.items():
    svg = make_svg(sub_id, data)
    path = OUT_DIR / f'zoom-{sub_id}.svg'
    with open(path, 'w', encoding='utf-8') as f:
        f.write(svg)
    print(f'  {path.name} : {len(svg)} chars')
print(f'\n14 zoom-X.svg générés dans {OUT_DIR}')
