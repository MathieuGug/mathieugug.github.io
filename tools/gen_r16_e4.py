"""Generate R16 (J-curve × LLMflation × paradoxe agentique) and E4 (threat
model unifié 2026). Both A3 paysage, viewBox 1600×1130.
"""

import os
import math

W, H = 1600, 1130
OUT_DIR = "livre/images"


def escape(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def wrap_text(text, max_chars):
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


# ============================================================
# R16 — Productivity J-curve × LLMflation × paradoxe agentique
# ============================================================

def make_r16():
    primary = "#b8582e"      # accent
    teal = "#2d8a8a"
    carmine = "#7a1e1e"
    ink = "#5e2f17"

    svg = []
    svg.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {} {}" font-family="Inter, system-ui, sans-serif" role="img" aria-labelledby="title-r16">'.format(W, H))
    svg.append('  <title id="title-r16">R16 — Productivity J-curve × LLMflation × paradoxe agentique</title>')
    svg.append('  <desc>Double-page éco : trois lectures de la même facture agentique 2026. Panel A LLMflation prix/token ×1000 en 4 ans. Panel B stack 4 niveaux paradoxe agentique (token → tâche → processus → outcome). Panel C J-curve Brynjolfsson productivité vraie vs mesurée. Bandeau bas : 3 régimes temporels court/moyen/long.</desc>')

    svg.append('''  <style>
    .acte-tag { font: 700 12px 'JetBrains Mono', monospace; fill: #b8582e; letter-spacing: 0.18em; }
    .title { font: 700 36px/1.1 'Fraunces', 'Georgia', serif; fill: #1a1a1a; }
    .subtitle { font: italic 15px/1.4 'Inter', sans-serif; fill: #444; }
    .panel-title { font: 600 18px 'Fraunces', 'Georgia', serif; fill: #1a1a1a; }
    .panel-sub { font: italic 12px 'Inter', sans-serif; fill: #666; }
    .label { font: 11px 'JetBrains Mono', monospace; fill: #444; }
    .label-em { font: 600 11px 'JetBrains Mono', monospace; fill: #1a1a1a; }
    .label-small { font: 10px 'Inter', sans-serif; fill: #666; }
    .annotation { font: italic 12px 'Inter', sans-serif; fill: #444; }
    .annotation-em { font: italic 13px 'Inter', sans-serif; fill: #b8582e; }
    .axis-bold { stroke: #1a1a1a; stroke-width: 0.9; }
    .grid { stroke: #d4cdb6; stroke-width: 0.5; stroke-dasharray: 2,3; }
    .llmflation-curve { stroke: #b8582e; stroke-width: 2.5; fill: none; }
    .true-curve { stroke: #2d8a8a; stroke-width: 2.5; fill: none; }
    .measured-curve { stroke: #7a1e1e; stroke-width: 2.5; fill: none; stroke-dasharray: 6,3; }
    .stack-layer { stroke: #b8582e; stroke-width: 1; }
    .stack-text { font: 600 14px 'Inter', sans-serif; fill: #1a1a1a; }
    .stack-detail { font: 11px 'Inter', sans-serif; fill: #444; }
    .regime-box { fill: #f0e9d4; stroke: #b8582e; stroke-width: 0.8; }
    .regime-title { font: 700 11px 'Inter', sans-serif; fill: #5e2f17; letter-spacing: 0.06em; }
    .regime-body { font: 11px/1.35 'Inter', sans-serif; fill: #333; }
    .caption { font: italic 11px 'Inter', sans-serif; fill: #777; }
  </style>''')

    svg.append('  <rect width="{}" height="{}" fill="#faf6ec"/>'.format(W, H))

    # Header
    svg.append('  <text x="50" y="40" class="acte-tag">SCHÉMA R16 · ACTE IV CHARNIÈRE Ch.21 · DOUBLE-PAGE ÉCO</text>')
    svg.append('  <text x="50" y="84" class="title">Prix qui baisse, valeur qui monte lentement, courbe d\'outcome dans le creux</text>')
    svg.append('  <text x="50" y="110" class="subtitle">Trois lectures de la même facture agentique 2026 — coût/token (Acte I) × paradoxe agentique (Ch.21) × J-curve Brynjolfsson</text>')

    # Three panels side by side
    panel_y = 160
    panel_h = 680
    panel_w = (W - 120 - 40) / 3  # 120px margins, 20*2 gaps
    gap = 20
    margin = 60

    # ========= Panel A : LLMflation =========
    pa_x = margin
    chart_x = pa_x + 70
    chart_y = panel_y + 80
    chart_w = panel_w - 90
    chart_h = panel_h - 140

    svg.append('  <text x="{}" y="{}" class="panel-title">A · LLMflation : la chute ×1 000</text>'.format(pa_x, panel_y + 30))
    svg.append('  <text x="{}" y="{}" class="panel-sub">Prix par million de tokens, log scale, 2021-2026 (a16z + InferenceMAX 2025)</text>'.format(pa_x, panel_y + 50))

    # Chart frame
    svg.append('  <rect x="{}" y="{}" width="{:.0f}" height="{}" fill="none" stroke="#d4cdb6" stroke-width="0.6"/>'.format(chart_x, chart_y, chart_w, chart_h))

    # Y axis log scale from $0.01 to $100 (4 decades)
    def y_log(usd):
        log = math.log10(usd)
        return chart_y + chart_h - ((log + 2) / 4) * chart_h

    # X axis years 2021-2026
    years_a = ['2021', '2022', '2023', '2024', '2025', '2026']
    def x_year(year_idx):
        return chart_x + (year_idx / 5) * chart_w

    # Grid
    for usd in [0.01, 0.1, 1, 10, 100]:
        yv = y_log(usd)
        svg.append('  <line x1="{}" y1="{:.1f}" x2="{:.0f}" y2="{:.1f}" class="grid"/>'.format(chart_x, yv, chart_x + chart_w, yv))
        label = '${:g}'.format(usd) if usd >= 1 else '${:.2f}'.format(usd)
        svg.append('  <text x="{}" y="{:.1f}" text-anchor="end" class="label">{}</text>'.format(chart_x - 8, yv + 4, label))

    # Curve data (approximate)
    curve_pts = [
        (0, 60), (0.8, 30), (1.5, 10), (2.2, 3), (3, 0.6), (4, 0.06), (5, 0.02)
    ]
    d_parts = []
    for i, (yr_idx, usd) in enumerate(curve_pts):
        cmd = "M" if i == 0 else "L"
        d_parts.append("{}{:.1f},{:.1f}".format(cmd, x_year(yr_idx), y_log(usd)))
    svg.append('  <path d="{}" class="llmflation-curve"/>'.format(" ".join(d_parts)))

    # X axis labels
    svg.append('  <line x1="{}" y1="{}" x2="{:.0f}" y2="{}" class="axis-bold"/>'.format(chart_x, chart_y + chart_h, chart_x + chart_w, chart_y + chart_h))
    for i, year in enumerate(years_a):
        xv = x_year(i)
        svg.append('  <text x="{:.1f}" y="{}" text-anchor="middle" class="label">{}</text>'.format(xv, chart_y + chart_h + 18, year))

    # Annotations
    svg.append('  <text x="{:.1f}" y="{:.1f}" class="annotation-em">×1 000</text>'.format(x_year(2.5), y_log(20)))
    svg.append('  <text x="{:.1f}" y="{:.1f}" class="annotation">en 4 ans</text>'.format(x_year(2.5), y_log(15)))

    # 3 régimes markers
    svg.append('  <rect x="{:.1f}" y="{}" width="{:.0f}" height="{}" fill="#b8582e" opacity="0.06"/>'.format(x_year(2), chart_y, x_year(3.5) - x_year(2), chart_h))
    svg.append('  <text x="{:.1f}" y="{}" text-anchor="middle" class="label-small" fill="#7a1e1e">PagedAttention + FA-3</text>'.format(x_year(2.75), chart_y - 8))

    # Y label
    svg.append('  <text x="{}" y="{}" text-anchor="middle" class="label-em" transform="rotate(-90 {} {})">$/Mtok (log)</text>'.format(chart_x - 50, chart_y + chart_h / 2, chart_x - 50, chart_y + chart_h / 2))

    # ========= Panel B : Stack 4 niveaux =========
    pb_x = margin + panel_w + gap
    stack_x = pb_x + 60
    stack_y = panel_y + 80
    stack_w = panel_w - 80

    svg.append('  <text x="{}" y="{}" class="panel-title">B · Paradoxe agentique : où va la facture</text>'.format(pb_x, panel_y + 30))
    svg.append('  <text x="{}" y="{}" class="panel-sub">Stack 4 niveaux — l\'unité de mesure se déplace token → tâche → processus → outcome</text>'.format(pb_x, panel_y + 50))

    # 4 stacked layers from bottom to top
    layers = [
        {"name": "TOKEN", "title": "coût technique direct", "fact": "Wh/req baisse, $/Mtok ×1/1000", "color": "#2d8a8a", "opacity": 0.85},
        {"name": "TÂCHE", "title": "coût par cas d'usage", "fact": "AIME ×10-74 reasoning vs non-reasoning", "color": "#b8582e", "opacity": 0.75},
        {"name": "PROCESSUS", "title": "coût de réallocation", "fact": "RH · formation · gouvernance · refonte UX", "color": "#7a1e1e", "opacity": 0.70},
        {"name": "OUTCOME", "title": "coût/bénéfice métier réel", "fact": "J-curve : creux 12-36 mois (cf. Panel C)", "color": "#5e2f17", "opacity": 0.85},
    ]
    layer_h = (panel_h - 200) / 4
    for i, layer in enumerate(layers):
        ly = stack_y + (3 - i) * (layer_h + 4)  # bottom to top
        svg.append('  <rect x="{}" y="{:.1f}" width="{:.0f}" height="{:.1f}" fill="{}" opacity="{}" stroke="#1a1a1a" stroke-width="0.6"/>'.format(stack_x, ly, stack_w, layer_h, layer["color"], layer["opacity"]))
        svg.append('  <text x="{}" y="{:.1f}" class="stack-text" fill="#fff">{} — {}</text>'.format(stack_x + 16, ly + 28, layer["name"], escape(layer["title"])))
        svg.append('  <text x="{}" y="{:.1f}" class="stack-detail" fill="#fff" opacity="0.95">{}</text>'.format(stack_x + 16, ly + 50, escape(layer["fact"])))

    # Vertical arrow on the left "la valeur se construit en remontant"
    arrow_x = stack_x - 30
    arrow_top = stack_y + 10
    arrow_bot = stack_y + 4 * (layer_h + 4) - 10
    svg.append('  <line x1="{}" y1="{}" x2="{}" y2="{:.1f}" stroke="#1a1a1a" stroke-width="1.4" marker-end="url(#arr-up)"/>'.format(arrow_x, arrow_bot, arrow_x, arrow_top))
    svg.append('  <text x="{}" y="{}" text-anchor="middle" class="label-em" transform="rotate(-90 {} {})">la valeur se construit en remontant</text>'.format(arrow_x - 20, (arrow_top + arrow_bot) / 2, arrow_x - 20, (arrow_top + arrow_bot) / 2))

    # Klarna annotation at top
    svg.append('  <text x="{}" y="{}" class="annotation-em">Klarna : 67% automatisé puis recul partiel</text>'.format(stack_x, stack_y - 8))
    svg.append('  <text x="{}" y="{}" class="annotation">(excellent niveau tâche, outcome qualité ne suit pas)</text>'.format(stack_x, stack_y + 10))

    # ========= Panel C : J-curve Brynjolfsson =========
    pc_x = margin + 2 * (panel_w + gap)
    chart_x_c = pc_x + 60
    chart_y_c = panel_y + 80
    chart_w_c = panel_w - 80
    chart_h_c = panel_h - 140

    svg.append('  <text x="{}" y="{}" class="panel-title">C · J-curve Brynjolfsson</text>'.format(pc_x, panel_y + 30))
    svg.append('  <text x="{}" y="{}" class="panel-sub">Productivité métier : courbe vraie (teal) vs mesurée (carmin) sur 0-7 ans</text>'.format(pc_x, panel_y + 50))

    svg.append('  <rect x="{}" y="{}" width="{:.0f}" height="{}" fill="none" stroke="#d4cdb6" stroke-width="0.6"/>'.format(chart_x_c, chart_y_c, chart_w_c, chart_h_c))

    # Grid
    for i in range(5):
        yv = chart_y_c + (i / 4) * chart_h_c
        svg.append('  <line x1="{}" y1="{:.1f}" x2="{:.0f}" y2="{:.1f}" class="grid"/>'.format(chart_x_c, yv, chart_x_c + chart_w_c, yv))

    # X axis years 0-7
    def x_yr(yr):
        return chart_x_c + (yr / 7) * chart_w_c

    # Y baseline (productivity 0%)
    y0 = chart_y_c + chart_h_c * 0.6  # baseline near middle-bottom
    svg.append('  <line x1="{}" y1="{:.1f}" x2="{:.0f}" y2="{:.1f}" stroke="#999" stroke-width="0.6" stroke-dasharray="3,3"/>'.format(chart_x_c, y0, chart_x_c + chart_w_c, y0))
    svg.append('  <text x="{}" y="{:.1f}" text-anchor="end" class="label">0%</text>'.format(chart_x_c - 8, y0 + 4))

    # True curve : starts at 0, dips slightly 0-2 years (investment cost), climbs steeply 2-5 years, plateau
    # y values: 0% (year 0), -10% (year 1), -5% (year 2), +15% (year 3), +35% (year 4), +50% (year 5), +60% (year 7)
    def y_pct(pct):
        return y0 - pct * (chart_h_c * 0.4) / 60  # 60% maps to top, -20% near bottom

    true_pts = [(0, 0), (0.5, -8), (1, -10), (1.5, -5), (2, 5), (3, 20), (4, 38), (5, 50), (6, 57), (7, 60)]
    d_t = []
    for i, (yr, pct) in enumerate(true_pts):
        cmd = "M" if i == 0 else "L"
        d_t.append("{}{:.1f},{:.1f}".format(cmd, x_yr(yr), y_pct(pct)))
    svg.append('  <path d="{}" class="true-curve"/>'.format(" ".join(d_t)))

    # Measured curve : deeper dip, slower climb (lag of measurement)
    meas_pts = [(0, 0), (0.5, -12), (1, -18), (1.5, -19), (2, -15), (3, -8), (4, 5), (5, 20), (6, 35), (7, 48)]
    d_m = []
    for i, (yr, pct) in enumerate(meas_pts):
        cmd = "M" if i == 0 else "L"
        d_m.append("{}{:.1f},{:.1f}".format(cmd, x_yr(yr), y_pct(pct)))
    svg.append('  <path d="{}" class="measured-curve"/>'.format(" ".join(d_m)))

    # Curve labels
    svg.append('  <text x="{:.1f}" y="{:.1f}" class="annotation" fill="#2d8a8a">productivité vraie</text>'.format(x_yr(4.2), y_pct(42)))
    svg.append('  <text x="{:.1f}" y="{:.1f}" class="annotation" fill="#7a1e1e">productivité mesurée (KPI)</text>'.format(x_yr(4.2), y_pct(15)))

    # Creux annotation
    svg.append('  <text x="{:.1f}" y="{:.1f}" text-anchor="middle" class="annotation-em">creux</text>'.format(x_yr(1.5), y_pct(-22)))
    svg.append('  <text x="{:.1f}" y="{:.1f}" text-anchor="middle" class="annotation">12-36 mois</text>'.format(x_yr(1.5), y_pct(-27)))

    # X axis
    svg.append('  <line x1="{}" y1="{}" x2="{:.0f}" y2="{}" class="axis-bold"/>'.format(chart_x_c, chart_y_c + chart_h_c, chart_x_c + chart_w_c, chart_y_c + chart_h_c))
    for yr in [0, 1, 2, 3, 4, 5, 6, 7]:
        xv = x_yr(yr)
        svg.append('  <text x="{:.1f}" y="{}" text-anchor="middle" class="label">{}</text>'.format(xv, chart_y_c + chart_h_c + 18, yr))
    svg.append('  <text x="{:.1f}" y="{}" text-anchor="middle" class="label-em">années depuis l\'adoption</text>'.format(chart_x_c + chart_w_c / 2, chart_y_c + chart_h_c + 38))

    # Y label
    svg.append('  <text x="{}" y="{}" text-anchor="middle" class="label-em" transform="rotate(-90 {} {})">productivité (±%)</text>'.format(chart_x_c - 50, chart_y_c + chart_h_c / 2, chart_x_c - 50, chart_y_c + chart_h_c / 2))

    # ============ Bandeau bas : 3 régimes temporels ============
    bb_y = panel_y + panel_h + 50
    bb_h = 130
    svg.append('  <text x="{}" y="{}" class="panel-title">Trois régimes temporels alignés sur les trois panels</text>'.format(margin, bb_y - 8))

    regimes = [
        ("COURT TERME (0-12 MOIS)", "Le prix par token baisse mécaniquement (LLMflation + Blackwell). Le décideur croit en bénéficier. Le FinOps signe un contrat /Mtok et anticipe l'économie."),
        ("MOYEN TERME (12-36 MOIS)", "Le reasoning explose la facture par tâche (×10-74 AIME). La structure (RH, formation, gouvernance) se met en place. Les KPI métier ne suivent pas — on est dans le creux du J."),
        ("LONG TERME (3-7 ANS)", "La productivité vraie remonte (Brynjolfsson). Mais l'outcome qualité (Klarna 5% cas charge émotionnelle) impose un retour à l'hybride. La courbe mesurée rattrape la courbe vraie avec 12-18 mois de lag."),
    ]
    box_w = (W - 2 * margin - 2 * 20) / 3
    for i, (rtitle, rbody) in enumerate(regimes):
        bx = margin + i * (box_w + 20)
        svg.append('  <rect x="{:.1f}" y="{}" width="{:.0f}" height="{}" class="regime-box" rx="4"/>'.format(bx, bb_y, box_w, bb_h))
        svg.append('  <text x="{:.1f}" y="{}" class="regime-title">{}</text>'.format(bx + 16, bb_y + 24, rtitle))
        body_lines = wrap_text(rbody, 65)
        for j, lin in enumerate(body_lines[:5]):
            svg.append('  <text x="{:.1f}" y="{}" class="regime-body">{}</text>'.format(bx + 16, bb_y + 46 + j * 16, escape(lin)))

    # Caption + key signature line
    svg.append('  <text x="{}" y="{}" class="caption">Sources : a16z LLMflation · Brynjolfsson 2024 J-curve · McKinsey 2024 EBIT · MIT NANDA pilots failure rate · cas Klarna (2024-2025) · livre §21.2.3 + §21.7 + §5.10</text>'.format(margin, H - 32))
    svg.append('  <text x="{}" y="{}" class="annotation-em">« Trois lectures d\'une même facture. »</text>'.format(margin, H - 14))
    svg.append('  <text x="{}" y="{}" text-anchor="end" class="caption">R16 · livre « Anatomie d\'une IA agentique »</text>'.format(W - margin, H - 14))

    # Marker for up arrow (used in stack)
    svg.insert(2, '  <defs><marker id="arr-up" viewBox="0 0 10 10" refX="5" refY="2" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,10 L5,0 L10,10 z" fill="#1a1a1a"/></marker></defs>')

    svg.append('</svg>')
    return "\n".join(svg) + "\n"


# ============================================================
# E4 — Threat model unifié 2026
# ============================================================

def make_e4():
    primary = "#7a1e1e"
    ink = "#4a0e0e"

    svg = []
    svg.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {} {}" font-family="Inter, system-ui, sans-serif" role="img" aria-labelledby="title-e4">'.format(W, H))
    svg.append('  <title id="title-e4">E4 — Threat model unifié 2026 : six surfaces, six familles, quatre parades load-bearing</title>')
    svg.append('  <desc>Threat model unifié 2026 pour agents IA. Six surfaces d\'attaque : modèle, prompt, mémoire, outil, protocole, surface utilisateur. Pour chaque surface : 2-3 vecteurs typiques avec exemples CVE/incidents, parade load-bearing, renvoi chapitre. Quatre parades transverses : Sigstore + hash pinning, tool tagging, allowlist namespace, HITL writes.</desc>')

    svg.append('''  <style>
    .tag { font: 700 12px 'JetBrains Mono', monospace; fill: #7a1e1e; letter-spacing: 0.18em; }
    .title { font: 700 32px/1.1 'Fraunces', 'Georgia', serif; fill: #1a1a1a; }
    .subtitle { font: italic 15px/1.4 'Inter', sans-serif; fill: #444; }
    .surface-card { fill: #ffffff; stroke: #d4cdb6; stroke-width: 0.8; }
    .surface-stripe { fill: #7a1e1e; }
    .surface-title { font: 700 18px 'Fraunces', 'Georgia', serif; fill: #fff; }
    .surface-tag { font: 600 10px 'JetBrains Mono', monospace; fill: #fff; letter-spacing: 0.12em; }
    .vector-label { font: 700 9px 'Inter', sans-serif; fill: #888; letter-spacing: 0.08em; }
    .vector-name { font: 600 12px 'Inter', sans-serif; fill: #1a1a1a; }
    .vector-detail { font: 11px/1.35 'Inter', sans-serif; fill: #444; }
    .parade-label { font: 700 10px 'Inter', sans-serif; fill: #2d8a8a; letter-spacing: 0.08em; }
    .parade-text { font: italic 12px/1.35 'Inter', sans-serif; fill: #1a4a4a; }
    .renvoi { font: 11px 'JetBrains Mono', monospace; fill: #7a1e1e; }
    .loadbearing-box { fill: #d8ecec; stroke: #2d8a8a; stroke-width: 1.2; }
    .loadbearing-title { font: 700 13px 'Inter', sans-serif; fill: #1a4a4a; letter-spacing: 0.06em; }
    .loadbearing-body { font: 11px/1.4 'Inter', sans-serif; fill: #1a1a1a; }
    .caption { font: italic 11px 'Inter', sans-serif; fill: #777; }
  </style>''')

    svg.append('  <rect width="{}" height="{}" fill="#faf6ec"/>'.format(W, H))

    # Header
    svg.append('  <text x="50" y="40" class="tag">SCHÉMA E4 · ACTE IV CHARNIÈRE Ch.19 · SCHÉMA TRANSVERSE RSSI</text>')
    svg.append('  <text x="50" y="84" class="title">Threat model unifié 2026 — six surfaces d\'attaque agentiques</text>')
    svg.append('  <text x="50" y="110" class="subtitle">Cartographie défensive : à chaque surface, deux à trois vecteurs typiques, une parade load-bearing, un renvoi chapitre détaillé.</text>')

    # 6 surface cards in 3x2 grid
    surfaces = [
        {
            "name": "MODÈLE", "label": "couche réseau de neurones",
            "vectors": [
                ("Jailbreaking (LLM)", "asymétrie attaque/défense, taxonomie documentée depuis 2023 (Carlini, Anthropic, OWASP LLM Top 10)"),
                ("Backdoors entraînement", "data poisoning à l'échelle pretrain, BadNet sur fine-tuning (Wang 2024)"),
                ("Reward hacking", "Anthropic + OpenAI 2025 : 99 % exploitation / < 2 % verbalisation (CoT illisible)"),
            ],
            "parade": "Red-teaming continu + monitoring distributions + governance des fine-tunes (Ch.2 + Ch.3 + Ch.19)",
            "renvoi": "→ Ch.2 §2.6 (faithfulness) · Ch.3 §3.6 (reward hacking) · Ch.19 §19.4",
        },
        {
            "name": "PROMPT", "label": "couche entrée utilisateur",
            "vectors": [
                ("Injection directe", "l'utilisateur insère « ignore previous instructions », classique mais toujours actif"),
                ("Injection indirecte", "contenu hostile dans un document RAG / une page web / un email scrapé (Greshake 2023)"),
                ("Prompt leakage", "extraction du system prompt par paraphrase / role-play / encodage Unicode"),
            ],
            "parade": "Séparation rôles + filtres I/O + spotlighting + sanitization markdown/HTML (Ch.19 §19.5)",
            "renvoi": "→ Ch.19 §19.5 · OWASP LLM01 · NIST AI RMF GV-1.5",
        },
        {
            "name": "MÉMOIRE", "label": "couche contexte & historique",
            "vectors": [
                ("Memory poisoning (SpAIware)", "Beurer-Kellner & Tramèr 2024 — injection paraphrasée promue « volonté utilisateur » via compaction"),
                ("Cross-session leakage", "fuite d'informations sensibles entre sessions ou comptes via mémoire partagée"),
                ("MITRE ATLAS AML.T0080", "model evasion via memory manipulation, vecteur documenté en taxonomie officielle"),
            ],
            "parade": "Signature compactions + isolation par session/tenant + audit ledger OTel `gen_ai.compaction.*` (Ch.10 §10.6)",
            "renvoi": "→ Ch.10 §10.6 (SpAIware) · Ch.9 §9.7 (architecture) · Ch.18 §18.4 (ledger)",
        },
        {
            "name": "OUTIL", "label": "couche fonctions exposées",
            "vectors": [
                ("Tool poisoning", "description hostile dans le manifest MCP, schema JSON malicieux exploitant le parsing LLM"),
                ("Supply chain (OAuth/registry)", "compromise d'un serveur MCP en amont, distribution via registry non signé"),
                ("Execute_sql / shell sans scoping", "exfiltration en 3 tours via injection indirecte + tool surpuissant"),
            ],
            "parade": "Sigstore + hash pinning sur les serveurs MCP, scoping minimal des tools, HITL sur writes irréversibles (Ch.13 §13.4)",
            "renvoi": "→ Ch.8 §8.3 (outils) · Ch.13 §13.2-§13.4 (MCP sécu) · MITRE ATLAS",
        },
        {
            "name": "PROTOCOLE", "label": "couche transport agent ↔ tools/agents",
            "vectors": [
                ("MCP 10 vecteurs", "matrice Ch.13 : tool poisoning, prompt injection cross-doc, cross-server confusion, OAuth+supply"),
                ("Cross-server confusion", "agent appelle outil A en pensant utiliser outil B (namespace collision)"),
                ("A2A handshake spoofing", "agent malveillant se fait passer pour un sous-agent légitime via Agent Card forgée"),
            ],
            "parade": "Allowlist namespace + tool tagging par origine + spec MCP v2 Sigstore (automne 2026, Ch.13 §13.7)",
            "renvoi": "→ Ch.13 (intégral) · spec MCP v2 · AAIF roadmap printemps 2027",
        },
        {
            "name": "SURFACE", "label": "couche utilisateur / écran",
            "vectors": [
                ("VPI — Visual Prompt Injection", "Anthropic 2024-2025 : injection via captures écran, OCR contaminé"),
                ("CVE-2025-55322", "computer use Operator/Devin — escape de la sandbox via UI hostile (oct 2025)"),
                ("Clickjacking agentique", "agent on-behalf-of confronté à des dark patterns conçus pour les humains"),
            ],
            "parade": "Sandbox stricte + visual content filtering + HITL approval sur transactions financières/légales (Ch.15 §15.5)",
            "renvoi": "→ Ch.14 §14.4 (on-behalf-of) · Ch.15 §15.5 (VPI) · CVE database",
        },
    ]

    grid_x = 50
    grid_y = 160
    grid_w = W - 100
    grid_h = H - 360
    gap_x = 20
    gap_y = 20
    cols = 3
    rows = 2
    card_w = (grid_w - (cols - 1) * gap_x) / cols
    card_h = (grid_h - (rows - 1) * gap_y) / rows

    for i, surf in enumerate(surfaces):
        row = i // cols
        col = i % cols
        cx = grid_x + col * (card_w + gap_x)
        cy = grid_y + row * (card_h + gap_y)
        # Card bg
        svg.append('  <rect x="{:.1f}" y="{:.1f}" width="{:.1f}" height="{:.1f}" class="surface-card" rx="6"/>'.format(cx, cy, card_w, card_h))
        # Top stripe
        stripe_h = 56
        svg.append('  <rect x="{:.1f}" y="{:.1f}" width="{:.1f}" height="{}" class="surface-stripe" rx="6"/>'.format(cx, cy, card_w, stripe_h))
        svg.append('  <rect x="{:.1f}" y="{:.1f}" width="{:.1f}" height="20" class="surface-stripe"/>'.format(cx, cy + stripe_h - 20, card_w))
        # Title + label
        svg.append('  <text x="{:.1f}" y="{:.1f}" class="surface-tag">SURFACE</text>'.format(cx + 18, cy + 18))
        svg.append('  <text x="{:.1f}" y="{:.1f}" class="surface-title">{}</text>'.format(cx + 18, cy + 42, escape(surf["name"])))
        svg.append('  <text x="{:.1f}" y="{:.1f}" text-anchor="end" class="surface-tag" opacity="0.85">{}</text>'.format(cx + card_w - 18, cy + 42, escape(surf["label"].upper())))

        # Vectors (3)
        inner_y = cy + stripe_h + 16
        for v_idx, (vname, vdetail) in enumerate(surf["vectors"]):
            block_y = inner_y + v_idx * 60
            svg.append('  <text x="{:.1f}" y="{:.1f}" class="vector-label">VECTEUR {}</text>'.format(cx + 18, block_y, v_idx + 1))
            svg.append('  <text x="{:.1f}" y="{:.1f}" class="vector-name">{}</text>'.format(cx + 18, block_y + 14, escape(vname)))
            detail_lines = wrap_text(vdetail, 50)
            for j, lin in enumerate(detail_lines[:2]):
                svg.append('  <text x="{:.1f}" y="{:.1f}" class="vector-detail">{}</text>'.format(cx + 18, block_y + 30 + j * 14, escape(lin)))

        # Parade
        parade_y = inner_y + 3 * 60 + 8
        svg.append('  <line x1="{:.1f}" y1="{:.1f}" x2="{:.1f}" y2="{:.1f}" stroke="#2d8a8a" stroke-width="0.6"/>'.format(cx + 18, parade_y, cx + card_w - 18, parade_y))
        svg.append('  <text x="{:.1f}" y="{:.1f}" class="parade-label">PARADE DOMINANTE</text>'.format(cx + 18, parade_y + 16))
        parade_lines = wrap_text(surf["parade"], 50)
        for j, lin in enumerate(parade_lines[:3]):
            svg.append('  <text x="{:.1f}" y="{:.1f}" class="parade-text">{}</text>'.format(cx + 18, parade_y + 32 + j * 16, escape(lin)))
        # Renvoi
        renvoi_y = cy + card_h - 14
        svg.append('  <text x="{:.1f}" y="{:.1f}" class="renvoi">{}</text>'.format(cx + 18, renvoi_y, escape(surf["renvoi"])))

    # Bottom : 4 parades load-bearing transverses
    lb_y = grid_y + grid_h + 30
    lb_h = 90
    svg.append('  <text x="50" y="{}" class="loadbearing-title">QUATRE PARADES LOAD-BEARING (transverses aux six surfaces)</text>'.format(lb_y - 8))

    parades = [
        ("Sigstore + hash pinning", "Signature cryptographique des serveurs MCP. Spec v2 obligatoire automne 2026 (AAIF). Cible : compromise registry."),
        ("Tool tagging par origine", "Métadonnée d'origine sur chaque tool exposé. Permet allowlist par catégorie de risque. Cible : tool poisoning."),
        ("Allowlist namespace", "Cloisonnement strict des serveurs MCP par session/tenant. Aucun call cross-namespace sans validation. Cible : confusion."),
        ("HITL writes irréversibles", "Approbation humaine obligatoire sur tout write financier / légal / shell / DB. Cible : execute_sql + on-behalf-of."),
    ]
    p_w = (W - 100 - 3 * 16) / 4
    for i, (ptitle, pbody) in enumerate(parades):
        px = 50 + i * (p_w + 16)
        svg.append('  <rect x="{:.1f}" y="{}" width="{:.1f}" height="{}" class="loadbearing-box" rx="4"/>'.format(px, lb_y, p_w, lb_h))
        svg.append('  <text x="{:.1f}" y="{}" class="loadbearing-title">{}</text>'.format(px + 14, lb_y + 22, escape(ptitle)))
        body_lines = wrap_text(pbody, 42)
        for j, lin in enumerate(body_lines[:4]):
            svg.append('  <text x="{:.1f}" y="{}" class="loadbearing-body">{}</text>'.format(px + 14, lb_y + 42 + j * 15, escape(lin)))

    # Caption
    svg.append('  <text x="50" y="{}" class="caption">Sources : OWASP LLM Top 10 + ASI Top 10 (déc 2025) · MITRE ATLAS · NIST AI RMF · livre Ch.10 + Ch.13 + Ch.15 + Ch.19 §19.10</text>'.format(H - 22))
    svg.append('  <text x="{}" y="{}" text-anchor="end" class="caption">E4 · livre « Anatomie d\'une IA agentique »</text>'.format(W - 50, H - 22))

    svg.append('</svg>')
    return "\n".join(svg) + "\n"


# ---- main ----

os.makedirs(OUT_DIR, exist_ok=True)

r16_content = make_r16()
r16_path = os.path.join(OUT_DIR, "20260601-r16-jcurve-llmflation-paradoxe.svg")
with open(r16_path, "w", encoding="utf-8") as f:
    f.write(r16_content)
print("Written {} bytes -> {}".format(len(r16_content), r16_path))

e4_content = make_e4()
e4_path = os.path.join(OUT_DIR, "20260601-e4-threat-model-unifie-2026.svg")
with open(e4_path, "w", encoding="utf-8") as f:
    f.write(e4_content)
print("Written {} bytes -> {}".format(len(e4_content), e4_path))
