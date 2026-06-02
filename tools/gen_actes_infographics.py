"""Generate 4 A3-landscape infographics, one per book Acte.
Output : `livre/images/20260601-acte{1,2,3,4}-...svg`.

A3 paysage ratio 1.414 -> viewBox 1600x1130 (close enough, scales cleanly).
"""

import os

W, H = 1600, 1130
OUT_DIR = "livre/images"

# Acte color themes (from site palette)
THEMES = {
    "I":   {"primary": "#b8582e", "ink": "#5e2f17", "soft": "#f5e4d6", "name": "I", "tag": "ACTE I"},
    "II":  {"primary": "#2d8a8a", "ink": "#1a4a4a", "soft": "#d8ecec", "name": "II", "tag": "ACTE II"},
    "III": {"primary": "#7a1e1e", "ink": "#4a0e0e", "soft": "#f0d8d8", "name": "III", "tag": "ACTE III"},
    "IV":  {"primary": "#5e5345", "ink": "#2e2820", "soft": "#e8e2d2", "name": "IV", "tag": "ACTE IV"},
}

ACTES = {
    "I": {
        "title": "Les moteurs",
        "subtitle": "Couches du dessous de la pile. Avant la boucle, le modèle. Avant la conversation, un tirage probabiliste.",
        "audience": "Expert data · FinOps · acheteur infra/cloud · sponsor IA technique",
        "thesis": "Toute la stack qui suit existe pour domestiquer la variance fondamentale du LLM sans la tuer — car c'est elle qui rend le modèle capable de raisonner.",
        "chapters": [
            {"n": "1", "slug": "ch01-coeur-stochastique", "title": "Le cœur stochastique", "fact": "softmax · T · top-p · seed", "claim": "reproductibilité statistique remplace bit-à-bit", "schema": "S1.1 + S1.2"},
            {"n": "2", "slug": "ch02-modeles-raisonnement", "title": "Modèles de raisonnement", "fact": "pivot o1 · RLVR · GRPO", "claim": "AIME 13 → 74 % single-sample en 6 mois", "schema": "E3 (capability×cost)"},
            {"n": "3", "slug": "ch03-process-reward-models", "title": "PRM : la couche notateur cachée", "fact": "économie souterraine 2-4 Md$", "claim": "reward hacking 99 % / verbalisation < 2 %", "schema": "E5 (PRM vs judge vs human)"},
            {"n": "4", "slug": "ch04-decode-speculative", "title": "Décode spéculative", "fact": "théorème Leviathan · 4 familles", "claim": "×3-6,5 throughput sans dégrader la qualité", "schema": "matrice frameworks"},
            {"n": "5", "slug": "ch05-economie-inference", "title": "L'économie unitaire de l'inférence", "fact": "LLMflation ×1 000 en 4 ans", "claim": "pile 7 couches ×14 throughput sur B300", "schema": "E2 (pile 7 couches)"},
            {"n": "6", "slug": "ch06-world-models", "title": "Bordure : world models", "fact": "JEPA · diffusion · autoregressif", "claim": "signal faible 18-36 mois (sauf computer use)", "schema": "thermomètre 6 verrous"},
        ],
        "callouts": [
            ("Triptyque tarifaire", "Ch.5 coût/token ↔ Ch.21 valeur/outcome ↔ Ch.22 externalité"),
            ("Frontières strictes", "RLVR canonique Ch.2, PRM en Ch.3, spec en Ch.4, pile 7 couches en Ch.5 — aucune redite."),
        ],
    },
    "II": {
        "title": "La boucle",
        "subtitle": "Anneaux 01-04. C'est ici que se gagne ou se perd le ROI, et que se constitue la dette technique.",
        "audience": "Agent engineer · tech lead · architecte · platform engineer",
        "thesis": "Le harness — pas le modèle — fait l'agent. Reason · Act · Observe + budget de tours + mémoire instrumentée + patterns adaptés au cas d'usage.",
        "chapters": [
            {"n": "7", "slug": "ch07-boucle-agentique", "title": "Reason · Act · Observe", "fact": "harness · stop_reason · hooks", "claim": "POC sans harness défensif = 4 $/min en silence", "schema": "R1 boucle canonique + 3 variantes"},
            {"n": "8", "slug": "ch08-outils-de-lagent", "title": "Les outils (les mains de l'agent)", "fact": "function calling · code exec · sandbox", "claim": "execute_sql sans scoping = exfiltration en 3 tours", "schema": "renvois Ch.13 (MCP) + Ch.19 (sécu)"},
            {"n": "9", "slug": "ch09-memoire-agentique", "title": "Mémoire agentique", "fact": "4 piliers × 6 opérations × 5 archis", "claim": "Letta · A-MEM · Zep · Mem0 · file-based", "schema": "R2 grille 4×5"},
            {"n": "10", "slug": "ch10-compaction", "title": "Compaction & oubli stratégique", "fact": "5 familles · triangle fidélité×coût×oubli", "claim": "Lost in the Middle tient en 2026", "schema": "R3 triangle + SpAIware"},
            {"n": "11", "slug": "ch11-patterns-orchestration", "title": "Patterns canoniques & orchestration", "fact": "8 patterns · 4 régimes contrôle", "claim": "Klarna 67 % puis recul partiel (5 % cas charges)", "schema": "R4 patterns + arbre buy/build"},
        ],
        "callouts": [
            ("La règle Schluntz/Zhang", "Start simple · measure · add complexity only when it delivers measurable value."),
            ("Risque #1 sur-orchestration", "Multi-agent prématuré = ×10-15 tokens, debug exponentiellement plus dur."),
        ],
    },
    "III": {
        "title": "Les interfaces",
        "subtitle": "Anneau 05 + surfaces. C'est par là que l'utilisateur final touche l'agent — et que se décide la friction d'adoption.",
        "audience": "PM · designer · intégrateur · architecte plateforme · CDO sectoriel",
        "thesis": "Le chatbot n'est pas mort, mais coexiste avec 3 autres régimes (copilote inline · canvas génératif · on-behalf-of). Le bon design = choisir le régime AVANT de coder l'agent.",
        "chapters": [
            {"n": "12", "slug": "ch12-mcp-plateforme", "title": "MCP, le HTTP des agents", "fact": "trinité MCP × A2A × AG-UI", "claim": "97 M téléchargements/mois · 7 500 serveurs · LF déc 2025", "schema": "R6 layering protocoles"},
            {"n": "13", "slug": "ch13-mcp-securite", "title": "Sécurité MCP", "fact": "10 vecteurs × 10 patterns défensifs", "claim": "4 load-bearing : Sigstore · tagging · allowlist · HITL writes", "schema": "R7 matrice 10×10"},
            {"n": "14", "slug": "ch14-surfaces-agentiques", "title": "Surfaces agentiques", "fact": "4 régimes d'accès Knight", "claim": "operator · collaborator · consultant · approver · observer", "schema": "R8 régimes + levels of autonomy"},
            {"n": "15", "slug": "ch15-computer-use", "title": "Computer use : le régime extrême", "fact": "observe · plan · ground · act · verify", "claim": "OSAgent dépasse baseline humain OSWorld oct 2025", "schema": "R9 boucle + cliff UI-CUBE"},
            {"n": "16", "slug": "ch16-analytics-agentique-banque", "title": "Analytics agentique (sectoriel régulé)", "fact": "3 surfaces GCP banque française tier 1", "claim": "75 jours avant AI Act art. 9-15 effectif (2 août 2026)", "schema": "R10 stack + matrice 6 réf"},
        ],
        "callouts": [
            ("Trinité protocoles 2026", "MCP (agent↔outils) · A2A (agent↔agent, Google→LF) · AG-UI (agent↔frontend, 17 events)."),
            ("Encart fin Acte III", "Narrative experiences (Ch.16 §16.14) — la 3ᵉ voie d'interaction au statut expérimental."),
        ],
    },
    "IV": {
        "title": "Mesures et garde-fous",
        "subtitle": "Anneaux 06-09. C'est ici que se gagne ou se perd la confiance du décideur — et qu'on sait tuer un cas d'usage au bon moment.",
        "audience": "Décideur · sponsor · RSSI · DPO · FinOps · CDO · CRO/COO banque",
        "thesis": "Le triptyque coût/token (Ch.5) · valeur/outcome (Ch.21) · externalité (Ch.22). Plus le calendrier réglementaire (Ch.23) qui compresse à 18 mois.",
        "chapters": [
            {"n": "17", "slug": "ch17-evaluation-benchmarks", "title": "Évaluer un agent (+ leaderboards)", "fact": "playbook gruyère 8 étapes", "claim": "4 vecteurs contamination · l'éval interne datée bat les scores publics", "schema": "R11 gruyère + R12 contamination"},
            {"n": "18", "slug": "ch18-observabilite-cognitive-audit-trail", "title": "Observabilité & cognitive audit trail", "fact": "OTel GenAI semconv · 6 piliers", "claim": "réponse à AI Act art. 12-13-15 + RGPD art. 22", "schema": "R13 piliers + audit trail"},
            {"n": "19", "slug": "ch19-gardefous-securite-globale", "title": "Garde-fous · jailbreaking · sécu globale", "fact": "OWASP ASI Top 10 (déc 2025)", "claim": "Least agency · asymétrie attaque/défense · threat model unifié 2026", "schema": "E4 (textualisé §19.10)"},
            {"n": "20", "slug": "ch20-runtime-manage", "title": "Runtime managé & déploiement", "fact": "AgentCore · Vertex · AI Foundry", "claim": "buy/build : marges 45-80 % éclairent la décision", "schema": "E6 arbre décision"},
            {"n": "21", "slug": "ch21-roi-paradoxe-agentique", "title": "Mesurer le ROI (paradoxe agentique)", "fact": "J-curve Brynjolfsson · 5 frameworks", "claim": "token → tâche → processus → outcome (Klarna)", "schema": "R16 (J-curve × LLMflation)"},
            {"n": "22", "slug": "ch22-ia-frugale", "title": "Externalité énergétique : IA frugale", "fact": "3 scopes × 3 phases (GHG)", "claim": "Jevons +48 % Google malgré -10×/req · 3 trajectoires 2030", "schema": "R17 trajectoires + sankey eau"},
            {"n": "23", "slug": "ch23-gouvernance-ai-act", "title": "Gouvernance : AI Act, banque, unlearning", "fact": "AI Act art. 9-15 effectif 2 août 2026", "claim": "6 référentiels convergents · 18 mois · 4 rôles pivot", "schema": "R18 calendrier unifié"},
            {"n": "24", "slug": "ch24-ia-et-travail", "title": "Société : IA et travail", "fact": "Acemoglu · Frey-Osborne · pause d'Engels", "claim": "4 scénarios 2035 · 6 leviers anti-catastrophe", "schema": "diptyque Acemoglu × scénarios"},
            {"n": "25", "slug": "ch25-proces-musk-altman", "title": "Politique : procès Musk v. Altman", "fact": "veille jour-J · chronologie tri-pistes", "claim": "test de stress de la gouvernance fondateur+capital", "schema": "anatomie juridique"},
        ],
        "callouts": [
            ("Calendrier régulateur", "Aoû 2026 art. 9-15 · automne 2026 Sigstore MCP v2 · janv 2027 registries signés · printemps 2027 AAIF + A2A×MCP."),
            ("Rôles pivot", "DPO · RSSI · Sponsor IA (CDO) · CRO/COO (banque haut-risque) — alignement obligatoire sur chaque décision."),
        ],
    },
}


def make_svg(acte_key, data):
    theme = THEMES[acte_key]
    primary = theme["primary"]
    ink = theme["ink"]
    soft = theme["soft"]

    chapters = data["chapters"]
    n_chap = len(chapters)

    # Layout : header (0-200), cards (240-820), callouts (860-1080), caption (1100-1130)
    margin_x = 50
    card_gap = 18
    cards_area_w = W - 2 * margin_x
    card_w = (cards_area_w - (n_chap - 1) * card_gap) / n_chap
    card_h = 520
    card_y = 260

    svg = []
    svg.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {} {}" font-family="Inter, system-ui, sans-serif" role="img" aria-labelledby="title-acte-{}">'.format(W, H, acte_key))
    svg.append('  <title id="title-acte-{}">Acte {} — {}</title>'.format(acte_key, theme["name"], data["title"]))
    svg.append('  <desc>Infographie de l\'Acte {} du livre « Anatomie d\'une IA agentique ». Synthèse des {} chapitres : thèse, public cible, contenu de chaque chapitre, schéma signature.</desc>'.format(theme["name"], n_chap))

    svg.append('''  <style>
    .acte-tag { font: 700 14px 'JetBrains Mono', monospace; fill: PRIMARY; letter-spacing: 0.18em; }
    .acte-num { font: 900 200px/1 'Fraunces', 'Georgia', serif; fill: PRIMARY; opacity: 0.08; }
    .acte-title { font: 700 52px/1.1 'Fraunces', 'Georgia', serif; fill: #1a1a1a; }
    .acte-subtitle { font: italic 18px/1.4 'Inter', sans-serif; fill: #444; }
    .acte-audience { font: 600 13px 'Inter', sans-serif; fill: PRIMARY; letter-spacing: 0.05em; }
    .acte-thesis { font: 16px/1.4 'Inter', sans-serif; fill: #1a1a1a; }
    .card-bg { fill: #ffffff; stroke: #d4cdb6; stroke-width: 0.8; }
    .card-stripe { fill: PRIMARY; }
    .card-num { font: 700 32px 'Fraunces', 'Georgia', serif; fill: #fff; }
    .card-tag { font: 600 9px 'JetBrains Mono', monospace; fill: #fff; letter-spacing: 0.12em; }
    .card-title { font: 600 16px/1.25 'Inter', sans-serif; fill: #1a1a1a; }
    .card-fact { font: 600 12px 'JetBrains Mono', monospace; fill: INK; }
    .card-claim { font: italic 13px/1.4 'Inter', sans-serif; fill: #333; }
    .card-schema { font: 11px 'JetBrains Mono', monospace; fill: PRIMARY; }
    .card-label { font: 600 9px 'Inter', sans-serif; fill: #888; letter-spacing: 0.1em; }
    .callout-box { fill: SOFT; stroke: PRIMARY; stroke-width: 1.2; }
    .callout-title { font: 700 14px 'Inter', sans-serif; fill: INK; letter-spacing: 0.04em; }
    .callout-body { font: 13px/1.4 'Inter', sans-serif; fill: #1a1a1a; }
    .caption { font: italic 11px 'Inter', sans-serif; fill: #777; }
    .chapter-card { cursor: pointer; transition: transform .2s ease, filter .2s ease; transform-origin: center; transform-box: fill-box; }
    .chapter-card:hover .card-bg, .chapter-card:focus-visible .card-bg { fill: #fffdf6; }
    .chapter-card:focus { outline: none; }
    .chapter-card:focus-visible .card-bg { stroke: PRIMARY; stroke-width: 2; }
  </style>'''.replace("PRIMARY", primary).replace("INK", ink).replace("SOFT", soft))

    svg.append('  <rect width="{}" height="{}" fill="#faf6ec"/>'.format(W, H))

    # Big background numeral (decorative)
    svg.append('  <text x="{}" y="{}" class="acte-num">{}</text>'.format(W - 240, 200, theme["name"]))

    # Header
    svg.append('  <text x="{}" y="42" class="acte-tag">{}</text>'.format(margin_x, theme["tag"]))
    svg.append('  <text x="{}" y="98" class="acte-title">{}</text>'.format(margin_x, data["title"]))
    svg.append('  <text x="{}" y="130" class="acte-subtitle">{}</text>'.format(margin_x, escape(data["subtitle"])))

    # Audience + thesis (two columns)
    svg.append('  <text x="{}" y="170" class="acte-audience">LECTEUR CIBLE</text>'.format(margin_x))
    svg.append('  <text x="{}" y="190" class="acte-thesis">{}</text>'.format(margin_x, escape(data["audience"])))

    # Thesis (right column)
    thesis_x = margin_x + 600
    svg.append('  <text x="{}" y="170" class="acte-audience">THÈSE</text>'.format(thesis_x))
    # Wrap thesis
    thesis_lines = wrap_text(data["thesis"], 70)
    for i, lin in enumerate(thesis_lines[:3]):
        svg.append('  <text x="{}" y="{}" class="acte-thesis">{}</text>'.format(thesis_x, 190 + i * 22, escape(lin)))

    # Separator
    svg.append('  <line x1="{}" y1="240" x2="{}" y2="240" stroke="{}" stroke-width="2"/>'.format(margin_x, W - margin_x, primary))

    # Char-wrap budgets proportional to card width (calibrated on 235px cards = 22 chars title).
    # Floors prevent over-shrinking on narrow cards (e.g. 9 chapitres Acte IV).
    title_chars  = max(13, int(card_w / 10.7))
    fact_chars   = max(15, int(card_w / 9.0))
    claim_chars  = max(17, int(card_w / 8.4))
    schema_chars = max(18, int(card_w / 7.8))

    # Chapter cards
    for i, ch in enumerate(chapters):
        cx = margin_x + i * (card_w + card_gap)
        # Wrapper group : clickable card (handlers attached page-side via livre-app.js)
        svg.append('  <g class="chapter-card" data-ch="{}" data-slug="{}" role="link" tabindex="0" aria-label="Chapitre {} — {}">'.format(
            ch["n"], ch["slug"], ch["n"], escape(ch["title"])
        ))
        # Card background
        svg.append('  <rect x="{:.1f}" y="{}" width="{:.1f}" height="{}" class="card-bg" rx="6"/>'.format(cx, card_y, card_w, card_h))
        # Top color stripe (with chapter number + tag)
        stripe_h = 80
        svg.append('  <rect x="{:.1f}" y="{}" width="{:.1f}" height="{}" class="card-stripe" rx="6"/>'.format(cx, card_y, card_w, stripe_h))
        # Cover the bottom rounded corner of stripe with rect
        svg.append('  <rect x="{:.1f}" y="{}" width="{:.1f}" height="20" class="card-stripe"/>'.format(cx, card_y + stripe_h - 20, card_w))
        # Number + CH tag
        svg.append('  <text x="{:.1f}" y="{}" class="card-num">{}</text>'.format(cx + 14, card_y + 50, ch["n"]))
        svg.append('  <text x="{:.1f}" y="{}" text-anchor="end" class="card-tag">CHAPITRE</text>'.format(cx + card_w - 14, card_y + 30))
        # Title
        title_y = card_y + stripe_h + 30
        title_lines = wrap_text(ch["title"], title_chars)
        for j, lin in enumerate(title_lines[:3]):
            svg.append('  <text x="{:.1f}" y="{}" class="card-title">{}</text>'.format(cx + 16, title_y + j * 21, escape(lin)))
        # Fact label
        fact_y = title_y + len(title_lines[:3]) * 21 + 24
        svg.append('  <text x="{:.1f}" y="{}" class="card-label">CONTENU</text>'.format(cx + 16, fact_y))
        fact_lines = wrap_text(ch["fact"], fact_chars)
        for j, lin in enumerate(fact_lines[:2]):
            svg.append('  <text x="{:.1f}" y="{}" class="card-fact">{}</text>'.format(cx + 16, fact_y + 16 + j * 16, escape(lin)))
        # Claim label
        claim_y = fact_y + 16 + len(fact_lines[:2]) * 16 + 22
        svg.append('  <text x="{:.1f}" y="{}" class="card-label">À RETENIR</text>'.format(cx + 16, claim_y))
        claim_lines = wrap_text(ch["claim"], claim_chars)
        for j, lin in enumerate(claim_lines[:4]):
            svg.append('  <text x="{:.1f}" y="{}" class="card-claim">{}</text>'.format(cx + 16, claim_y + 16 + j * 17, escape(lin)))
        # Schema label
        schema_y = claim_y + 16 + len(claim_lines[:4]) * 17 + 22
        svg.append('  <text x="{:.1f}" y="{}" class="card-label">SCHÉMA</text>'.format(cx + 16, schema_y))
        schema_lines = wrap_text(ch["schema"], schema_chars)
        for j, lin in enumerate(schema_lines[:2]):
            svg.append('  <text x="{:.1f}" y="{}" class="card-schema">{}</text>'.format(cx + 16, schema_y + 16 + j * 14, escape(lin)))
        # Close chapter-card wrapper
        svg.append('  </g>')

    # Callouts (2 boxes side by side at bottom)
    callout_y = card_y + card_h + 40
    callout_h = 130
    callouts = data["callouts"]
    n_callouts = len(callouts)
    callout_w = (cards_area_w - card_gap) / 2
    for i, (ctitle, cbody) in enumerate(callouts):
        cx = margin_x + i * (callout_w + card_gap)
        svg.append('  <rect x="{:.1f}" y="{}" width="{:.1f}" height="{}" class="callout-box" rx="4"/>'.format(cx, callout_y, callout_w, callout_h))
        svg.append('  <text x="{:.1f}" y="{}" class="callout-title">{}</text>'.format(cx + 20, callout_y + 28, escape(ctitle.upper())))
        body_lines = wrap_text(cbody, 80)
        for j, lin in enumerate(body_lines[:4]):
            svg.append('  <text x="{:.1f}" y="{}" class="callout-body">{}</text>'.format(cx + 20, callout_y + 54 + j * 20, escape(lin)))

    # Caption (bottom)
    svg.append('  <text x="{}" y="{}" class="caption">Livre « Anatomie d\'une IA agentique » · Mathieu Guglielmino · état au 29 mai 2026 · mathieugug.github.io</text>'.format(margin_x, H - 16))
    svg.append('  <text x="{}" y="{}" text-anchor="end" class="caption">{} / 4</text>'.format(W - margin_x, H - 16, theme["name"]))

    svg.append('</svg>')

    return "\n".join(svg) + "\n"


def escape(s):
    """Escape XML special chars."""
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def wrap_text(text, max_chars):
    """Greedy word wrap to a max char count per line."""
    words = text.split(" ")
    lines = []
    current = ""
    for w in words:
        if len(current + " " + w) > max_chars and current:
            lines.append(current)
            current = w
        else:
            current = (current + " " + w).strip()
    if current:
        lines.append(current)
    return lines


# ---- main ----

os.makedirs(OUT_DIR, exist_ok=True)
mapping = {"I": "acte1-moteurs", "II": "acte2-boucle", "III": "acte3-interfaces", "IV": "acte4-mesures-garde-fous"}
for key, data in ACTES.items():
    content = make_svg(key, data)
    fname = "20260601-{}-infographie.svg".format(mapping[key])
    path = os.path.join(OUT_DIR, fname)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Written {} bytes -> {}".format(len(content), path))
