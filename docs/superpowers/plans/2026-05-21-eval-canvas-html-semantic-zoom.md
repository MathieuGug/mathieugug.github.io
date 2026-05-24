# Canvas évaluation-agentique — semantic zoom HTML+SVG — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Réécrire `evaluation-agentique/20260521-evaluation-agentique-canvas.html` en HTML+CSS-first avec semantic zoom (Bret Victor style) au lieu du SVG-only précédent. La card S0 cliquée DEVIENT le détail (même DOM), pas une téléportation vers un layer caché.

**Architecture:** A0-first — un long document HTML statique qui contient TOUT le contenu en lecture linéaire. Le zoom = CSS state (`:root[data-zoom]`) qui collapse/expand des sections. SVG cantonné à 3 îlots (gruyère hero, mini-flèche attaque, picto outcome).

**Tech Stack:** HTML5 vanille + CSS Grid + CSS transitions + ~80 lignes JS (hash↔data-zoom + clicks + keyboard). Pas de bibliothèque externe.

**Spec :** [`docs/superpowers/specs/2026-05-21-eval-canvas-html-semantic-zoom-design.md`](../specs/2026-05-21-eval-canvas-html-semantic-zoom-design.md).

**Décisions tranchées (faute d'input user)** :
1. Sections inactives → `opacity: 0.04`, garde le scroll context.
2. Hero gruyère à zoom S* → caché (`display: none`), évite bruit.
3. Mobile < 768px → `<details>` natifs, pas de mécanique zoom.

---

## File Structure

**Créé** :
- `evaluation-agentique/20260521-evaluation-agentique-canvas.html` (**réécrit** complet — l'actuel est l'itération SVG, on l'écrase)
- `evaluation-agentique/canvas-redesign/gruyere-hero.svg` (mockup source du SVG hero, archivé pour ref)

**Modifié** :
- `evaluation-agentique/index.html` (hub : la carte "Carte zoomable" pointe déjà vers le bon fichier, mais on update peut-être l'eyebrow/title si pertinent)

**Inchangé** :
- `assets/canvas-zoom.{js,css}` — n'est plus inclus par le nouveau canvas (peut rester en place pour d'autres pages futures)
- Les 14 `evaluation-agentique/canvas-redesign/zoom-*.svg` — restent en archive mais ne sont plus chargés
- `tools/og-card.py`, `tools/seo_dossiers.py` — réutilisés pour la regen SEO post-deploy

---

## Source de contenu

Toute la matière textuelle existe déjà dans :
- `evaluation-agentique/canvas-redesign/zoom-S0.svg`..`zoom-S7.svg` (8 sub-cards playbook)
- `evaluation-agentique/canvas-redesign/zoom-C1.svg`..`zoom-C6.svg` (6 sub-cards gruyère)
- `tools/fix-attack-overlays.py` (dict `VERDICTS` : 7 attaques × 3 verdicts × verdict/headline/lines/frameworks)
- Le canvas SVG actuel `evaluation-agentique/20260521-evaluation-agentique-canvas.html` (hero titles, Reason citation, outcomes)

**Règle d'or** : ne pas réinventer le contenu. Extraire fidèlement des sources existantes, juste reformater en HTML structuré.

---

## Task 1: A0 scaffold — head, topbar, canvas vide, styles globaux

**Files:**
- Réécrire entièrement : `evaluation-agentique/20260521-evaluation-agentique-canvas.html`

**Spec d'acceptation:** Le fichier s'ouvre sans erreur console, avec topbar fonctionnelle, fond `--bg`, h1 + h2 ébauchés, et un placeholder pour chaque section future (hero/playbook/gruyere/attaques/outcomes). Aucun JS de zoom encore. Lisible à tous viewport.

- [ ] **Step 1: Sauvegarder l'ancien canvas en archive**

```bash
git mv evaluation-agentique/20260521-evaluation-agentique-canvas.html evaluation-agentique/canvas-redesign/legacy-svg-canvas.html
git commit -m "archive(eval/canvas): legacy SVG iteration → canvas-redesign/"
```

- [ ] **Step 2: Créer le nouveau fichier avec head + SEO + topbar**

Contenu attendu (rough) :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#faf6ec">
<title>Évaluer un agent — carte zoomable</title>
<meta name="description" content="...">
<!-- og:start -->
<!-- réinjecté par tools/seo_dossiers.py, marker préservé -->
<!-- og:end -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@500&display=swap">

<style>
/* CSS de base : reset, vars, typography, topbar */
:root {
  --bg: #faf6ec;
  --line: rgba(30,30,44,0.10);
  --accent: #b8582e;
  --text: #1e1e2a;
  --text-dim: #5b5f6c;
  --teal: #1f5560;
  --carmine: #b7332c;
  --gap: clamp(40px, 6vw, 80px);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; font-weight: 300; }
.topbar { position: fixed; top: 0; left: 0; right: 0; height: 56px; padding: 0 clamp(16px, 4vw, 32px); display: flex; align-items: center; justify-content: space-between; z-index: 100; background: var(--bg); border-bottom: 1px solid var(--line); }
.canvas { padding: calc(56px + var(--gap)) clamp(16px, 4vw, 48px) var(--gap); display: grid; gap: var(--gap); justify-content: center; grid-template-columns: minmax(0, 720px); }
h1 { font-family: 'Fraunces', serif; font-weight: 400; font-size: clamp(40px, 8vw, 80px); line-height: 1.05; }
h2 { font-family: 'Fraunces', serif; font-weight: 400; font-size: clamp(28px, 4vw, 44px); margin-bottom: 0.6em; }
</style>
</head>
<body>
<header class="topbar">
  <span class="logo">Mathieu <em>Guglielmino</em></span>
  <span class="dossier-context">Évaluer un agent</span>
  <nav class="actions"><a href="./">← Hub</a> · <a href="/">Accueil</a></nav>
</header>

<main class="canvas" data-zoom="0">
  <section class="hero"><h1>Évaluer un agent</h1><p>placeholder</p></section>
  <section class="playbook"><h2>Le playbook</h2><p>placeholder</p></section>
  <section class="gruyere"><h2>Le gruyère</h2><p>placeholder</p></section>
  <section class="attaques"><h2>7 attaques</h2><p>placeholder</p></section>
  <section class="outcomes"><p>placeholder</p></section>
</main>
</body>
</html>
```

(Topbar HTML doit suivre le pattern existant du repo — voir `.claude/skills/illustrated-deep-research/references/topbar.md` ; structure complète à reconstituer.)

- [ ] **Step 3: Vérifier rendu basique**

Lancer `python -m http.server 8765` et ouvrir `http://127.0.0.1:8765/evaluation-agentique/20260521-evaluation-agentique-canvas.html`. Doit montrer topbar + 5 sections placeholder, sans erreur console.

- [ ] **Step 4: Réinjecter le bloc SEO**

```bash
python tools/seo_dossiers.py --only evaluation-agentique
```

Vérifier que le block og:start / og:end est correctement injecté dans le head.

- [ ] **Step 5: Commit**

```bash
git add evaluation-agentique/20260521-evaluation-agentique-canvas.html evaluation-agentique/canvas-redesign/legacy-svg-canvas.html
git commit -m "feat(eval/canvas): A0 scaffold — head, topbar, canvas vide

Première étape du refactor HTML+SVG hybride. L'ancien SVG-only est
archivé en canvas-redesign/legacy-svg-canvas.html. Le nouveau fichier
contient uniquement le squelette : head + SEO + topbar + 5 sections
placeholder."
```

---

## Task 2: Hero — H1, subtitle, citation Reason, lede HTML

**Files:** Modifier `evaluation-agentique/20260521-evaluation-agentique-canvas.html`

**Spec d'acceptation:** Section `.hero` contient le titre H1, le subtitle, un lede court (2-3 phrases), et la citation Reason en `<blockquote>`. Pas encore de gruyère SVG (Task 4). Pas de styling de zoom.

- [ ] **Step 1: Remplacer le placeholder hero**

```html
<section class="hero">
  <p class="eyebrow">Carte zoomable · semantic zoom Bret Victor style</p>
  <h1>Évaluer un agent</h1>
  <p class="subtitle">Le playbook construit les défenses · le gruyère arrête les attaques</p>
  
  <p class="lede">
    On construit l'évaluation en 4 phases (collecte tasks, cadrage, instrumentation, maintenance) — c'est le <strong>playbook</strong>. Le résultat est un dispositif à 3 couches de défense (préventif, curatif, qualitatif) — c'est le <strong>gruyère de Reason</strong>. Chaque couche a ses trous, seul l'empilement arrête les attaques.
  </p>

  <!-- SVG gruyère diagram : Task 4 -->
  <figure class="gruyere-figure" data-task="4-placeholder"></figure>

  <blockquote class="reason-quote">
    « Chaque couche a ses trous ; l'empilement seul produit une couverture acceptable. »
    <cite>— James Reason, modèle gruyère suisse</cite>
  </blockquote>
</section>
```

- [ ] **Step 2: Styling minimal du hero**

Ajouter dans le `<style>` :

```css
.hero { display: grid; gap: clamp(20px, 2.5vw, 32px); }
.eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-dim); }
.subtitle { font-family: 'Fraunces', serif; font-style: italic; font-weight: 400; font-size: clamp(18px, 2.5vw, 24px); color: var(--text-dim); }
.lede { font-size: clamp(16px, 1.8vw, 18px); line-height: 1.6; max-width: 60ch; }
.reason-quote { font-family: 'Fraunces', serif; font-style: italic; font-size: clamp(16px, 1.8vw, 20px); color: var(--text-dim); border-left: 3px solid var(--accent); padding-left: 1em; max-width: 60ch; }
.reason-quote cite { display: block; font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; margin-top: 0.5em; }
```

- [ ] **Step 3: Vérifier rendu**

Ouvrir dans le navigateur. Le hero doit être lisible et bien proportionné. Citation visible avec barre orange à gauche.

- [ ] **Step 4: Commit**

```bash
git add evaluation-agentique/20260521-evaluation-agentique-canvas.html
git commit -m "feat(eval/canvas): hero — titre, subtitle, lede, Reason citation"
```

---

## Task 3: Playbook section — 4 phases × 2 sub-cards = 8 sub-cards complètes

**Files:** Modifier `evaluation-agentique/20260521-evaluation-agentique-canvas.html`

**Spec d'acceptation:** Section `.playbook` contient 4 `<article class="phase">` (P1, P2A, P2B, P3). Chaque phase contient 2 `<article class="subcard">` avec contenu complet extrait des `zoom-S*.svg` : badge, titre, subtitle, ul.methods (4 µ-méthodes), aside.antipattern, ul.frameworks (4-6 pills), blockquote.tagline.

**Sources de contenu (impératif: extraire fidèlement)** :
- P1 = "Collecte tasks" → S0 (`zoom-S0.svg` "Démarrer tôt"), S1 (`zoom-S1.svg` "Manuel d'abord")
- P2A = "Cadrer les cas" → S2 (`zoom-S2.svg`), S3 (`zoom-S3.svg`)
- P2B = "Harness & graders" → S4 (`zoom-S4.svg`), S5 (`zoom-S5.svg`)
- P3 = "Maintenance" → S6 (`zoom-S6.svg`), S7 (`zoom-S7.svg`)

- [ ] **Step 1: Lire les 8 zoom-S*.svg pour extraire le contenu**

Pour chaque fichier, identifier : eyebrow (CATEGORY · TAGLINE), title, subtitle, 4 méthodes (µ-N : title + body), anti-pattern (headline + conséquence), 4-6 frameworks, footer tagline.

- [ ] **Step 2: Écrire le template d'une `.phase` avec `.subcard`**

Structure attendue :

```html
<article class="phase" id="P1">
  <header class="phase-head">
    <span class="badge badge--phase">1</span>
    <div>
      <p class="eyebrow">Phase 1 · collecte tasks</p>
      <h3>Démarrer tôt · règle 80/20</h3>
      <p class="subtitle">Comment on amorce un système d'eval avant d'avoir un harness</p>
    </div>
  </header>
  <div class="subcards">
    <article class="subcard" id="S0">
      <header>
        <span class="badge badge--sub">S0</span>
        <p class="eyebrow">Sous-étape</p>
        <h4>Démarrer tôt</h4>
        <p class="subtitle">20-50 tasks de vrais échecs suffisent à amorcer un système d'eval</p>
      </header>
      <ul class="methods">
        <li class="method">
          <span class="mu">µ-1</span>
          <h5>20-50 tasks</h5>
          <p class="method-subtitle">volume initial</p>
          <p>Assez pour révéler 80 % des modes d'échec</p>
        </li>
        <li class="method"> µ-2 ... </li>
        <li class="method"> µ-3 ... </li>
        <li class="method"> µ-4 ... </li>
      </ul>
      <aside class="antipattern">
        <p class="anti-eyebrow">⚠ ANTI-PATTERN</p>
        <p class="anti-headline">Attendre 1 000 tasks gold-labellisées avant de démarrer</p>
        <p class="anti-consequence">Conséquence : la dette d'eval gonfle pendant qu'on optimise dans le noir.</p>
      </aside>
      <div class="frameworks">
        <p class="fw-eyebrow">Frameworks / outils</p>
        <ul>
          <li>Linear</li><li>GitHub Issues</li><li>Notion</li><li>Loom replay</li>
        </ul>
      </div>
      <blockquote class="tagline">« Toujours préférer un démarrage modeste qui itère sur la dette. »</blockquote>
    </article>
    <article class="subcard" id="S1">
      <!-- pareil, contenu de zoom-S1.svg -->
    </article>
  </div>
</article>
```

- [ ] **Step 3: Implémenter les 4 phases × 2 sub-cards**

8 sub-cards au total. Contenu réel extrait. Pas de "TODO" ni de placeholder.

- [ ] **Step 4: CSS minimal pour les phases et sub-cards**

```css
.phase { display: grid; gap: clamp(24px, 3vw, 40px); }
.phase-head { display: flex; align-items: flex-start; gap: 16px; }
.badge { display: inline-flex; align-items: center; justify-content: center; min-width: 36px; height: 36px; padding: 0 10px; border-radius: 18px; background: var(--teal); color: white; font-family: 'JetBrains Mono', monospace; font-weight: 500; font-size: 14px; }
.subcards { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(16px, 2vw, 24px); }
.subcard { border: 1px solid var(--line); border-radius: 8px; padding: clamp(20px, 2.5vw, 32px); display: grid; gap: clamp(16px, 2vw, 24px); background: var(--bg); transition: padding 400ms ease; }
.subcard header { display: grid; gap: 6px; }
.subcard h4 { font-family: 'Fraunces', serif; font-weight: 400; font-size: clamp(22px, 2.6vw, 30px); }
.methods { display: grid; gap: 12px; list-style: none; }
.method { padding: 14px 16px; border: 1px solid var(--line); border-radius: 6px; }
.method .mu { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.15em; color: var(--teal); }
.method h5 { font-family: 'Fraunces', serif; font-weight: 500; font-size: 16px; margin: 4px 0; }
.method-subtitle { font-style: italic; color: var(--text-dim); font-size: 13px; }
.antipattern { background: rgba(184,88,46,0.06); border-left: 3px solid var(--accent); padding: 12px 16px; }
.anti-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.18em; color: var(--accent); }
.anti-headline { font-family: 'Fraunces', serif; font-weight: 500; font-size: 15px; margin: 4px 0; }
.anti-consequence { font-style: italic; color: var(--text-dim); font-size: 13px; }
.frameworks .fw-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.18em; color: var(--text-dim); margin-bottom: 6px; }
.frameworks ul { display: flex; flex-wrap: wrap; gap: 6px; list-style: none; }
.frameworks li { padding: 4px 10px; border: 1px solid var(--line); border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.tagline { font-family: 'Fraunces', serif; font-style: italic; color: var(--text-dim); font-size: 14px; }

@media (max-width: 760px) {
  .subcards { grid-template-columns: 1fr; }
}
```

- [ ] **Step 5: Vérifier rendu**

Toutes les 8 sub-cards visibles, contenu lisible, layout 2 cols sur desktop, 1 col sur mobile.

- [ ] **Step 6: Commit**

```bash
git add evaluation-agentique/20260521-evaluation-agentique-canvas.html
git commit -m "feat(eval/canvas): playbook section — 4 phases × 2 sub-cards complètes"
```

---

## Task 4: Gruyère section — 3 couches × 2 sub-cards = 6 sub-cards complètes

**Files:** Modifier `evaluation-agentique/20260521-evaluation-agentique-canvas.html`

**Spec d'acceptation:** Section `.gruyere` contient 3 `<article class="couche">` (N1, N2, N3). Chaque couche contient 2 `<article class="subcard">` avec contenu extrait des `zoom-C*.svg`. Structure parallèle à `.playbook` (réutilise les classes existantes).

**Sources** :
- N1 = "Préventif" → C1 (`zoom-C1.svg`), C2 (`zoom-C2.svg`)
- N2 = "Curatif" → C3 (`zoom-C3.svg`), C4 (`zoom-C4.svg`)
- N3 = "Qualitatif" → C5 (`zoom-C5.svg`), C6 (`zoom-C6.svg`)

- [ ] **Step 1: Lire les 6 zoom-C*.svg pour extraire le contenu**

Note : `zoom-C1.svg` contient les 5 µ-méthodes explicitement demandées par Mathieu — bien préserver leur ordre et numérotation.

- [ ] **Step 2: Implémenter le HTML des 3 couches**

```html
<section class="gruyere">
  <h2>Le gruyère — ce qui arrête les attaques</h2>
  <p class="lede">3 couches de défense empilées · chaque couche a ses trous · seul l'empilement couvre.</p>
  
  <article class="couche" id="N1">
    <header class="phase-head">
      <span class="badge badge--couche">C1</span>
      <div>
        <p class="eyebrow">Couche 1 · préventif</p>
        <h3>Préventif</h3>
        <p class="subtitle">automated · monitoring</p>
      </div>
    </header>
    <div class="subcards">
      <article class="subcard" id="C1">...</article>
      <article class="subcard" id="C2">...</article>
    </div>
  </article>
  
  <article class="couche" id="N2">...</article>
  <article class="couche" id="N3">...</article>
</section>
```

Le badge "C1/C2/C3" sur la couche peut prêter à confusion avec les sub-cards C1..C6 — utiliser "Couche 1" en clair plutôt (juste `<span class="badge">1</span>` ou pas de badge sur la phase, juste le titre). À trancher au moment de l'implémentation pour cohérence visuelle.

- [ ] **Step 3: Pas de nouveau CSS** (réutilise les classes de Task 3)

- [ ] **Step 4: Vérifier rendu**

6 sub-cards C1..C6 visibles avec leur contenu détaillé. Trois couches structurées.

- [ ] **Step 5: Commit**

```bash
git add evaluation-agentique/20260521-evaluation-agentique-canvas.html
git commit -m "feat(eval/canvas): gruyère section — 3 couches × 2 sub-cards"
```

---

## Task 5: Attaques section — 7 attaques × 3 verdicts

**Files:** Modifier `evaluation-agentique/20260521-evaluation-agentique-canvas.html`

**Spec d'acceptation:** Section `.attaques` contient 7 `<article class="attaque">` (A-prompt-injection, A-hallucination, A-tool-misuse, A-context-saturation, A-reward-hacking, A-spec-mismatch, A-latency-drift). Chaque attaque a un titre + un mini-SVG flèche schématique + 3 verdicts (N1, N2, N3) avec verdict (passe/arrête/redondant/rare) + headline + body + frameworks.

**Sources** : `tools/fix-attack-overlays.py` dict `VERDICTS` (40+ verdicts au total, déjà rédigés).

- [ ] **Step 1: Extraire les 21 verdicts du dict `VERDICTS`**

Format attendu par verdict : `{attack, slice, verdict, headline, lines: [string], frameworks: [string]}`.

- [ ] **Step 2: HTML template d'une attaque**

```html
<article class="attaque" id="A-prompt-injection">
  <header class="attaque-head">
    <h3>Prompt injection</h3>
    <svg class="attack-arrow" viewBox="0 0 200 40" aria-hidden="true">
      <!-- mini flèche schématique N1 → N2 (arrêt) → N3 -->
    </svg>
  </header>
  <ol class="verdicts">
    <li class="verdict" data-slice="N1" data-verdict="passe">
      <header>
        <span class="badge badge--slice">N1 · Préventif</span>
        <span class="verdict-tag verdict-passe">✗ PASSE</span>
      </header>
      <p class="verdict-headline">Tests ne couvrent que les patterns connus</p>
      <ul class="verdict-lines">
        <li>Templates testés en isolation</li>
        <li>Garak / PromptInject scannent</li>
        <li>mais les injections nouvelles passent</li>
      </ul>
      <ul class="frameworks">
        <li>Garak</li><li>DeepEval</li>
      </ul>
    </li>
    <li class="verdict" data-slice="N2" data-verdict="arrete">...</li>
    <li class="verdict" data-slice="N3" data-verdict="redondant">...</li>
  </ol>
</article>
```

- [ ] **Step 3: Implémenter les 7 attaques** (21 verdicts au total)

- [ ] **Step 4: CSS pour les attaques**

```css
.attaque { display: grid; gap: clamp(16px, 2vw, 24px); padding: clamp(20px, 2.5vw, 32px); border: 1px solid var(--line); border-radius: 8px; }
.attaque-head { display: flex; align-items: center; gap: 16px; }
.attack-arrow { width: 200px; height: 40px; flex-shrink: 0; }
.verdicts { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: clamp(12px, 1.5vw, 20px); list-style: none; }
.verdict { padding: 16px; border: 1px solid var(--line); border-radius: 6px; }
.verdict[data-verdict="passe"] { border-color: rgba(183,51,44,0.4); background: rgba(183,51,44,0.04); }
.verdict[data-verdict="arrete"] { border-color: rgba(75,148,102,0.4); background: rgba(75,148,102,0.04); }
.verdict[data-verdict="redondant"], .verdict[data-verdict="rare"] { background: rgba(90,90,90,0.04); }
.verdict header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.verdict-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.18em; padding: 4px 8px; border-radius: 3px; }
.verdict-tag.verdict-passe { background: var(--carmine); color: white; }
.verdict-tag.verdict-arrete { background: #4b9466; color: white; }
.verdict-tag.verdict-redondant, .verdict-tag.verdict-rare { background: #5a5a5a; color: white; }
.verdict-headline { font-family: 'Fraunces', serif; font-weight: 500; font-size: 14px; margin-bottom: 8px; }
.verdict-lines { list-style: none; font-size: 13px; color: var(--text-dim); }
.verdict-lines li { padding: 2px 0; }

@media (max-width: 900px) {
  .verdicts { grid-template-columns: 1fr; }
  .attack-arrow { display: none; }
}
```

- [ ] **Step 5: Vérifier rendu**

7 attaques visibles, chaque avec 3 verdicts colorés selon le statut.

- [ ] **Step 6: Commit**

```bash
git add evaluation-agentique/20260521-evaluation-agentique-canvas.html
git commit -m "feat(eval/canvas): attaques section — 7 attaques × 3 verdicts (21 cells)"
```

---

## Task 6: Outcomes section + final assembly

**Files:** Modifier `evaluation-agentique/20260521-evaluation-agentique-canvas.html`

**Spec d'acceptation:** Section `.outcomes` contient 2 articles (success ✓ / failure ✗) avec icône SVG, titre, et description. La section suit immédiatement les attaques.

- [ ] **Step 1: HTML outcomes**

```html
<section class="outcomes">
  <article class="outcome outcome--success">
    <svg class="outcome-icon" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="none" stroke="#4b9466" stroke-width="2"/><path d="M14 24l8 8 14-16" fill="none" stroke="#4b9466" stroke-width="3"/></svg>
    <h3>Agent fiable</h3>
    <p>Attaque arrêtée par une couche · 6 attaques sur 7 stoppées</p>
  </article>
  <article class="outcome outcome--failure">
    <svg class="outcome-icon" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="none" stroke="#b7332c" stroke-width="2"/><path d="M16 16l16 16M32 16l-16 16" fill="none" stroke="#b7332c" stroke-width="3"/></svg>
    <h3>Incident</h3>
    <p>Trous alignés sur les 3 couches · 1 attaque passe</p>
  </article>
</section>
```

- [ ] **Step 2: CSS outcomes**

```css
.outcomes { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(16px, 2vw, 24px); }
.outcome { padding: clamp(24px, 3vw, 40px); border: 1px solid var(--line); border-radius: 8px; text-align: center; display: grid; gap: 12px; justify-items: center; }
.outcome--success { background: rgba(75,148,102,0.04); border-color: rgba(75,148,102,0.3); }
.outcome--failure { background: rgba(183,51,44,0.04); border-color: rgba(183,51,44,0.3); }
.outcome-icon { width: 48px; height: 48px; }
.outcome h3 { font-family: 'Fraunces', serif; font-weight: 500; }

@media (max-width: 760px) {
  .outcomes { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Vérifier le doc complet linéairement**

Scroll de haut en bas : hero → playbook (4 phases × 2 sub-cards) → gruyère (3 couches × 2 sub-cards) → attaques (7 × 3 verdicts) → outcomes. Tout doit être lisible comme un long article. **C'est l'A0.**

- [ ] **Step 4: Commit**

```bash
git add evaluation-agentique/20260521-evaluation-agentique-canvas.html
git commit -m "feat(eval/canvas): outcomes section + A0 doc complet"
```

---

## Task 7: SVG hero gruyère — la viz centrale

**Files:** Modifier `evaluation-agentique/20260521-evaluation-agentique-canvas.html`

**Spec d'acceptation:** Le placeholder `<figure class="gruyere-figure">` du hero contient un `<svg>` inline qui montre les 3 slices de gruyère (Préventif/Curatif/Qualitatif) avec leurs trous, les 7 flèches d'attaques traversant horizontalement, et les outcomes ✓/✗ à droite. Source : `canvas-redesign/legacy-svg-canvas.html` ou `canvas-redesign/mockup-niveau-0.svg`.

- [ ] **Step 1: Extraire le SVG du legacy canvas**

Identifier dans `canvas-redesign/legacy-svg-canvas.html` les balises pertinentes : les 3 `<g data-card="N1/N2/N3">` slices avec leurs holes (`<circle>` blanches), les 7 attack arrows, les 2 outcomes (`<g data-card="OUT-OK">` et `OUT-BAD`).

- [ ] **Step 2: Le copier dans le nouveau canvas**

Encapsuler dans `<figure class="gruyere-figure">` avec un `<figcaption>` discret. Garder le viewBox et les coordonnées d'origine.

```html
<figure class="gruyere-figure">
  <svg class="gruyere-diagram" viewBox="0 0 4000 3000" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Diagramme gruyère de Reason appliqué à l'évaluation d'agents IA">
    <!-- 3 slices + holes + 7 attaques + outcomes -->
  </svg>
  <figcaption>3 couches empilées · les flèches sont les 7 modes d'attaque modélisés</figcaption>
</figure>
```

- [ ] **Step 3: CSS pour le hero figure**

```css
.gruyere-figure { display: grid; gap: 8px; max-width: 100%; }
.gruyere-diagram { width: 100%; height: auto; max-height: 60vh; }
.gruyere-figure figcaption { font-style: italic; color: var(--text-dim); font-size: 13px; text-align: center; }
```

- [ ] **Step 4: Vérifier rendu**

Le hero montre la viz centrale. Pas de bug d'affichage. Aspect responsive.

- [ ] **Step 5: Commit**

```bash
git add evaluation-agentique/20260521-evaluation-agentique-canvas.html
git commit -m "feat(eval/canvas): SVG hero gruyère — viz centrale dans .hero"
```

---

## Task 8: CSS zoom states — data-zoom mute le layout

**Files:** Modifier `evaluation-agentique/20260521-evaluation-agentique-canvas.html` (style block)

**Spec d'acceptation:** Quand on mute `:root[data-zoom]` à la main en devtools, le layout évolue :
- `0` : tout visible, sub-cards en mode compact (juste header, methods/anti/fw cachés)
- `P1` : Phase 1 visible avec ses S0/S1 teasers, autres sections dimmées à 0.04
- `S0` : la card #S0 en `position: fixed; inset: 56px 0 0 0`, contenu détaillé déplié, reste du doc invisible/dimmé
- Idem pour S1..S7, C1..C6, P2A/B/3, N1/2/3, A-*

- [ ] **Step 1: État compact par défaut des sub-cards**

```css
/* Par défaut (data-zoom="0") : sub-cards en mode teaser */
:root[data-zoom="0"] .subcard .methods,
:root[data-zoom="0"] .subcard .antipattern,
:root[data-zoom="0"] .subcard .frameworks,
:root[data-zoom="0"] .subcard .tagline {
  display: none;
}

/* Affordance "voir le détail" */
.subcard::after {
  content: '→ voir le détail';
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.15em;
  color: var(--accent);
  border-top: 1px solid var(--line);
  padding-top: 12px;
  margin-top: 4px;
  cursor: pointer;
}
:root[data-zoom="0"] .subcard { cursor: pointer; }

/* Zoom phase : focus la phase, dim les autres sections */
:root[data-zoom^="P"] .canvas > section:not(.playbook),
:root[data-zoom^="N"] .canvas > section:not(.gruyere),
:root[data-zoom^="A-"] .canvas > section:not(.attaques),
:root[data-zoom^="S"] .canvas > section,
:root[data-zoom^="C"] .canvas > section {
  opacity: 0.04;
  pointer-events: none;
  transition: opacity 400ms ease;
}
```

- [ ] **Step 2: Zoom sub-card — position fixed + détail visible**

```css
/* Liste explicite des 14 sub-cards focalisables */
:root[data-zoom="S0"] #S0, :root[data-zoom="S1"] #S1,
:root[data-zoom="S2"] #S2, :root[data-zoom="S3"] #S3,
:root[data-zoom="S4"] #S4, :root[data-zoom="S5"] #S5,
:root[data-zoom="S6"] #S6, :root[data-zoom="S7"] #S7,
:root[data-zoom="C1"] #C1, :root[data-zoom="C2"] #C2,
:root[data-zoom="C3"] #C3, :root[data-zoom="C4"] #C4,
:root[data-zoom="C5"] #C5, :root[data-zoom="C6"] #C6 {
  position: fixed;
  inset: 56px 0 0 0;  /* sous topbar */
  z-index: 40;
  overflow-y: auto;
  padding: clamp(40px, 5vw, 80px) clamp(20px, 4vw, 60px);
  background: var(--bg);
  border: none;
  border-radius: 0;
  display: block;
  max-width: 900px;
  margin-inline: auto;
}

/* Quand zoomé, montrer le détail */
:root[data-zoom="S0"] #S0 .methods, :root[data-zoom="S0"] #S0 .antipattern,
:root[data-zoom="S0"] #S0 .frameworks, :root[data-zoom="S0"] #S0 .tagline,
/* ... répéter pour S1..S7, C1..C6 ... */
:root[data-zoom="C6"] #C6 .methods, :root[data-zoom="C6"] #C6 .antipattern,
:root[data-zoom="C6"] #C6 .frameworks, :root[data-zoom="C6"] #C6 .tagline {
  display: block;
}

/* Cache l'affordance "voir le détail" quand zoomé */
:root[data-zoom="S0"] #S0::after, /* ... */ { display: none; }

/* Cache le hero gruyère SVG quand on zoom dans une sub-card */
:root[data-zoom^="S"] .gruyere-figure,
:root[data-zoom^="C"] .gruyere-figure { display: none; }

/* Bloque le scroll du body quand sub-card focalisée */
:root[data-zoom^="S"], :root[data-zoom^="C"] { overflow: hidden; }
```

- [ ] **Step 3: Zoom phase/couche/attaque (niveau intermédiaire)**

```css
/* Phase zoomée : la phase est focus, les autres phases dans la même section sont dimmed */
:root[data-zoom="P1"] .phase:not(#P1),
:root[data-zoom="P2A"] .phase:not(#P2A),
:root[data-zoom="P2B"] .phase:not(#P2B),
:root[data-zoom="P3"] .phase:not(#P3) {
  opacity: 0.15;
  pointer-events: none;
}
:root[data-zoom="N1"] .couche:not(#N1),
:root[data-zoom="N2"] .couche:not(#N2),
:root[data-zoom="N3"] .couche:not(#N3) {
  opacity: 0.15;
  pointer-events: none;
}
:root[data-zoom^="A-"] .attaque:not([id^="A-"]) { opacity: 0.15; }
/* (sélecteur à affiner pour viser SEULEMENT l'attaque NON focus) */
```

- [ ] **Step 4: Test manuel via devtools**

Ouvrir devtools, dans la console : `document.documentElement.dataset.zoom = 'S0'`. Vérifier que S0 prend le plein écran avec son détail visible et le reste dimmé.

Tester chaque état : `'0'`, `'P1'`, `'P2A'`, ..., `'N1'`, ..., `'S0'`..`'S7'`, `'C1'`..`'C6'`, `'A-prompt-injection'`, ...

- [ ] **Step 5: Commit**

```bash
git add evaluation-agentique/20260521-evaluation-agentique-canvas.html
git commit -m "feat(eval/canvas): CSS zoom states — data-zoom mute le layout"
```

---

## Task 9: JS routing + clicks + keyboard

**Files:** Modifier `evaluation-agentique/20260521-evaluation-agentique-canvas.html`

**Spec d'acceptation:** Le clic sur une sub-card / phase / couche / attaque pousse le hash correspondant et `data-zoom` se met à jour. Échap pop le zoom (S0 → P1 → 0). Flèches gauche/droite naviguent les siblings au niveau courant. La navigation back/forward du navigateur fonctionne.

- [ ] **Step 1: Script inline en fin de body**

```html
<script>
(function () {
  'use strict';
  const root = document.documentElement;
  
  function hashToZoom(hash) {
    if (!hash || hash === '#') return '0';
    const h = hash.startsWith('#') ? hash.slice(1) : hash;
    if (h.startsWith('zone-')) return h.slice(5);     // #zone-P1 → P1
    return h;  // #S0, #C1, #A-prompt-injection
  }
  
  function zoomToHash(zoom) {
    if (!zoom || zoom === '0') return '#';
    // Phase/couche prennent le préfixe zone-
    if (/^P\d/.test(zoom) || zoom.startsWith('P2') || /^N\d$/.test(zoom)) return '#zone-' + zoom;
    return '#' + zoom;
  }
  
  function applyZoom(zoom) {
    root.dataset.zoom = zoom || '0';
    // Focus management : focus la card / section ciblée
    const target = document.getElementById(zoom);
    if (target) target.focus({ preventScroll: true });
  }
  
  // Init depuis hash
  applyZoom(hashToZoom(location.hash));
  
  // Listen hashchange (back/forward + clics)
  window.addEventListener('hashchange', () => applyZoom(hashToZoom(location.hash)));
  
  // Click : sub-card → zoom S/C, phase → zoom P/N, attaque → zoom A-*
  document.addEventListener('click', (e) => {
    const sub = e.target.closest('.subcard');
    if (sub && root.dataset.zoom !== sub.id) {
      e.preventDefault();
      location.hash = zoomToHash(sub.id);
      return;
    }
    const phase = e.target.closest('.phase, .couche');
    if (phase && !sub && root.dataset.zoom !== phase.id) {
      e.preventDefault();
      location.hash = zoomToHash(phase.id);
      return;
    }
    const attaque = e.target.closest('.attaque');
    if (attaque && root.dataset.zoom !== attaque.id) {
      e.preventDefault();
      location.hash = zoomToHash(attaque.id);
    }
  });
  
  // Échap : pop zoom level
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const z = root.dataset.zoom;
      if (z === '0') return;
      if (/^[SC]\d/.test(z)) {
        // sub-card → revenir à sa phase/couche parente
        const target = document.getElementById(z);
        const parent = target?.closest('.phase, .couche');
        history.pushState(null, '', zoomToHash(parent?.id || '0'));
        applyZoom(parent?.id || '0');
      } else {
        // phase/couche/attaque → niveau 0
        history.pushState(null, '', '#');
        applyZoom('0');
      }
      e.preventDefault();
    }
    
    // Flèches : naviguer siblings au niveau courant
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const z = root.dataset.zoom;
      if (z === '0') return;
      const target = document.getElementById(z);
      if (!target) return;
      const siblings = Array.from(target.parentElement.children);
      const idx = siblings.indexOf(target);
      const step = e.key === 'ArrowRight' ? 1 : -1;
      const next = siblings[(idx + step + siblings.length) % siblings.length];
      if (next?.id) {
        location.hash = zoomToHash(next.id);
        e.preventDefault();
      }
    }
  });
})();
</script>
```

- [ ] **Step 2: Test interactif**

Ouvrir canvas, clic S0 → URL change en #S0 + S0 prend le plein écran. Échap → retour à #zone-P1. Échap → #. Flèche droite depuis S0 → S1.

- [ ] **Step 3: Commit**

```bash
git add evaluation-agentique/20260521-evaluation-agentique-canvas.html
git commit -m "feat(eval/canvas): JS routing — hash↔data-zoom + clicks + keyboard"
```

---

## Task 10: Polish — animations, mobile dégradé, accessibilité, tests Playwright

**Files:** Modifier `evaluation-agentique/20260521-evaluation-agentique-canvas.html` + créer tests si pertinent.

**Spec d'acceptation:** Transitions visuelles smooth entre états (pas de saut brutal). À <768px, le doc est lisible comme un long article. Accessibilité : focus dans la sub-card focalisée, Échap restore focus, aria-live annonce les transitions. Tests Playwright : screenshots à chaque niveau.

- [ ] **Step 1: Crossfade pour les transitions de sub-card focus**

```css
.subcard { transition: opacity 200ms ease, padding 400ms cubic-bezier(.4,0,.2,1); }
:root[data-zoom^="S"] #S0:not([data-zoom-active]), /* etc */ { opacity: 0; }
/* Hack léger : on accepte que position:static→fixed soit un swap, l'opacity le masque */
```

(Si trop complexe, on accepte un saut net mais visuellement OK.)

- [ ] **Step 2: Mobile dégradé via `<details>`**

```css
@media (max-width: 768px) {
  /* Mode mobile : le doc est un long article scrollable, les sub-cards sont des <details> natifs */
  .subcard { padding: 16px; }
  /* Méthodes etc. cachées par défaut, révélées en touchant un toggle */
  /* Approche pragmatique : laisser tout visible mais en colonne unique */
  
  :root[data-zoom^="S"] .subcard, :root[data-zoom^="C"] .subcard {
    position: static; padding: 16px;
  }
  :root[data-zoom^="S"] .canvas > section, :root[data-zoom^="C"] .canvas > section {
    opacity: 1; pointer-events: auto;
  }
  /* En gros : pas de zoom mécanique sur mobile, juste le hash qui scroll-into-view */
}
```

- [ ] **Step 3: Aria-live + focus management**

Dans le JS :
```js
const live = document.createElement('div');
live.setAttribute('aria-live', 'polite');
live.className = 'sr-only';
document.body.appendChild(live);

function announceZoom(zoom) {
  if (zoom === '0') live.textContent = 'Vue d\'ensemble';
  else live.textContent = 'Détail ' + zoom;
}
```

- [ ] **Step 4: Tests Playwright manuels**

Lancer `python -m http.server 8765` et tester via Playwright MCP :
- Niveau 0 → screenshot, voir hero + sections compactes
- Clic S0 → screenshot, voir S0 plein écran
- Clic C1 → screenshot, voir C1 plein écran
- Clic A-prompt-injection → screenshot, voir l'attaque expanded
- Échap depuis S0 → revient à P1
- Mobile 375px → screenshot, voir doc en colonne

- [ ] **Step 5: Régen SEO + OG**

```bash
python tools/seo_dossiers.py --only evaluation-agentique
```

(Genère/met à jour `evaluation-agentique/og.png` si nécessaire et réinjecte le bloc SEO.)

- [ ] **Step 6: Commit final**

```bash
git add evaluation-agentique/20260521-evaluation-agentique-canvas.html
git commit -m "feat(eval/canvas): polish — transitions, mobile, a11y, SEO regen"
```

---

## Task 11: Code review final

**Files:** Review l'ensemble.

- [ ] Vérifier que la spec est entièrement couverte
- [ ] Pas de TODO résiduels
- [ ] Pas de console.log oubliés
- [ ] Pas de tests Playwright PNG dans git
- [ ] Le block SEO og:start/og:end est intact
- [ ] Le favicon est inclus
- [ ] La disclosure IA est présente (footer ou tagline)
- [ ] Lincoln NON présent en hero/section, uniquement footer si présent

- [ ] **Commit final (si modifs)**

```bash
git add -A
git commit -m "review(eval/canvas): nettoyage final + checklist publication"
```

---

## Notes pour subagents implementers

- **Pas de `git push origin main`.** Reste sur la branche `claude/eval-canvas-redesign-2026-05-20`. Push uniquement vers cette branche.
- **Ne pas merger la PR.** Mathieu merge à la main.
- **Le binaire `gh` n'est pas dispo.** Utiliser MCP GitHub pour la création de PR finale.
- **Vérifier `git status` AVANT chaque commit.** Repo a des worktrees parallèles, ne pas polluer une autre branche.
- **Source de contenu canonique** : les 14 `canvas-redesign/zoom-*.svg` + le dict `VERDICTS` dans `tools/fix-attack-overlays.py`. Ne pas réinventer.
- **Tests fonctionnels manuels via Playwright MCP** : pas de tests unitaires, pas de framework de test à introduire.

---

## Critères de done

- Le fichier `evaluation-agentique/20260521-evaluation-agentique-canvas.html` est entièrement HTML+CSS-first avec semantic zoom via `data-zoom`.
- Tous les anchors d'origine (#zone-P1, #S0, #A-prompt-injection) continuent de marcher.
- A0 (zoom=0) lisible comme un long article.
- Zoom S0..S7, C1..C6 → card prend le plein écran avec contenu déplié.
- Échap pop le zoom level. Flèches naviguent les siblings.
- Aucun JS canvas-zoom.js inclus (l'ancien lib).
- Aucune modale (l'ancien pattern modal-svg retiré).
- Sur mobile, le doc reste lisible (mode dégradé).
- Pas d'interstitial qui fait surprise.
- SEO block intact, favicon présent, disclosure IA quelque part.
