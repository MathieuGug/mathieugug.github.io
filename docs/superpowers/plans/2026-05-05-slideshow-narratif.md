# Slideshow narratif — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire le proto d'un nouveau format « slideshow narratif » (scènes plein écran, révélation progressive, modaux à la demande) sur le dossier `narrative-experiences/`, et l'intégrer comme troisième carte dans le hub du dossier.

**Architecture:** Un seul fichier HTML autonome (`narrative-experiences/20260505-narrative-experiences-slideshow.html`) qui réutilise par copier-coller les 7 SVG inline + le `#modal-root` + `#zoom-overlay` + `setupZoom()` + `openModal()` de `20260505-narrative-experiences-app.html`. Le slideshow est piloté par un tableau JS `SCENES` déclaratif et un moteur d'~150 lignes (machine d'état `(currentSceneIndex, currentStepIndex)` + résolution d'inputs + rendu CSS via classes).

**Tech Stack:** HTML/CSS/JS vanilla. Polices Google Fonts (Fraunces / Inter / JetBrains Mono). Aucune dépendance externe (pas de framework, pas de GSAP, pas de lib de test).

**Validation method:** Pas de framework de test (site statique). Validation = ouvrir le fichier dans Chrome, vérifier le comportement à l'œil + DevTools (console, layout, responsive 375px). Le test mobile se fait via DevTools device toolbar.

**Reference files (read-only during this work):**
- `CLAUDE.md` à la racine — conventions site (favicon, mark, mobile, topbar)
- `narrative-experiences/20260505-narrative-experiences-app.html` — source des SVG, modaux, zoom
- `narrative-experiences/index.html` — patron de hub à adapter
- `docs/superpowers/specs/2026-05-05-slideshow-narratif-design.md` — spec validée

**Workflow conventions (du CLAUDE.md du projet) :**
- `git add <fichier>` ciblé, jamais `git add .` (le dossier `.claude/` ne doit pas être commité)
- Commit par tâche → vérifier le diff → **ne pas push automatiquement**, attendre validation Mathieu
- PR via le MCP GitHub (`mcp__github__create_pull_request`), pas via `gh`
- Owner/repo : `mathieugug` / `mathieugug.github.io`

---

## File Structure

| Action | Fichier | Responsabilité |
|---|---|---|
| **Create** | `narrative-experiences/20260505-narrative-experiences-slideshow.html` | Fichier unique du slideshow : HTML + CSS + JS + 7 SVG inline + 2 surfaces (`#modal-root`, `#zoom-overlay`) + 2 overlays (sommaire, sources). |
| **Modify** | `narrative-experiences/index.html` | Ajout de la 3ᵉ carte `.format` entre l'app illustrée et le rapport markdown. Mise à jour des métadonnées du hub (« Trois formats »). |
| **Read-only** | `narrative-experiences/20260505-narrative-experiences-app.html` | Source à copier (SVG, modaux, zoom). Aucune modification. |
| **Read-only** | `CLAUDE.md` | Conventions site à respecter sur le nouveau fichier. |

Le slideshow est volontairement **un seul fichier**, par cohérence avec tous les autres formats du site (chaque dossier = un dossier d'artefact, chaque format = un fichier autonome). Le coût de fragmenter en plusieurs fichiers (CSS séparé, JS séparé) ne se justifie pas pour ~3000 lignes.

---

## Phase A — Squelette et moteur minimal

### Task 1 : Créer le fichier squelette HTML + topbar + palette CSS site

**Files:**
- Create: `narrative-experiences/20260505-narrative-experiences-slideshow.html`

- [ ] **Step 1: Créer le fichier avec le squelette `<head>` + topbar + palette site**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#faf6ec">
<title>Expériences narratives — slideshow</title>
<meta name="description" content="Slideshow narratif sur les expériences narratives : 11 scènes plein écran, animations progressives, modaux à la demande. Synthèse en 10 minutes de l'étude longue de Mathieu Guglielmino.">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #faf6ec;
  --bg-2: #f3eedf;
  --paper: #ffffff;
  --line: rgba(30,30,44,0.08);
  --line-strong: rgba(30,30,44,0.20);
  --text: #1e1e2a;
  --text-dim: #3b3f4d;
  --text-mid: #6b6f7c;
  --text-faint: #9a9ca5;
  --accent: #b8582e;
  --carmine: #b23b1b;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; font-weight: 300; line-height: 1.55; -webkit-font-smoothing: antialiased; height: 100vh; overflow: hidden; max-width: 100vw; }
body { background:
  radial-gradient(ellipse at 14% 8%, rgba(184,88,46,0.06) 0%, transparent 55%),
  radial-gradient(ellipse at 86% 92%, rgba(75,148,102,0.04) 0%, transparent 55%),
  var(--bg);
}
a { color: inherit; }

/* Topbar — copie du pattern site */
.topbar { position: fixed; top: 0; left: 0; right: 0; z-index: 50; padding: 12px 28px; height: 48px; display: flex; align-items: center; justify-content: space-between; background: rgba(250,246,236,0.6); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-bottom: 1px solid transparent; transition: opacity 0.25s, border-color 0.3s; }
.topbar a { font-family: 'Fraunces', serif; font-weight: 500; font-size: 15.5px; letter-spacing: -0.01em; text-decoration: none; color: var(--text); }
.topbar em { font-style: italic; color: var(--accent); }
.topbar .back { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--text-mid); }
.topbar .back:hover { color: var(--accent); }

/* Surlignage stabilo — signature site */
mark { background: linear-gradient(transparent 58%, rgba(178, 59, 27, 0.14) 58%); color: inherit; padding: 0 2px; }

/* Stage : zone scène plein écran */
.stage { position: fixed; top: 48px; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 32px 80px; transition: opacity 250ms ease; }
.stage.fading-out { opacity: 0; }

/* Mobile */
@media (max-width: 560px) {
  .topbar { padding: 12px 16px; gap: 12px; }
  .topbar a { font-size: 14px; }
  .topbar .back { font-size: 9px; letter-spacing: 0.16em; }
  .stage { padding: 16px 16px 80px; }
}
@media (max-width: 380px) {
  .topbar a:first-child em { display: none; }
}
</style>
</head>
<body>

<header class="topbar" id="topbar">
  <a href="../index.html">Mathieu <em>Guglielmino</em></a>
  <a href="../index.html#series" class="back">← Retour aux dossiers</a>
</header>

<main class="stage" id="stage">
  <!-- scènes injectées par JS -->
</main>

<script>
'use strict';
// Moteur — sera étoffé task par task
console.log('[slideshow] booted');
</script>
</body>
</html>
```

- [ ] **Step 2: Ouvrir le fichier dans Chrome**

Ouvrir `narrative-experiences/20260505-narrative-experiences-slideshow.html` dans Chrome (double-clic ou drag-drop dans navigateur).

Attendu :
- Page jaune-papier avec topbar fixe « Mathieu Guglielmino » à gauche, « ← Retour aux dossiers » à droite.
- Zone vide au centre (stage vide).
- Console : log `[slideshow] booted`.
- Lien retour fonctionnel : clic ramène à `narrative-experiences/index.html`.

- [ ] **Step 3: Tester le mobile à 375px (DevTools device toolbar)**

Activer DevTools → Toggle device toolbar → iPhone SE (375 × 667). Vérifier :
- La topbar reste lisible (le « Guglielmino » est masqué sous 380px → bascule à iPhone 4 / 320px pour valider).
- Pas de scroll horizontal.

- [ ] **Step 4: Commit**

```bash
git add narrative-experiences/20260505-narrative-experiences-slideshow.html
git commit -m "feat(narrative-experiences): squelette slideshow narratif"
```

---

### Task 2 : Données SCENES (table déclarative des 11 scènes, sans contenu détaillé)

**Files:**
- Modify: `narrative-experiences/20260505-narrative-experiences-slideshow.html` — bloc `<script>` final

- [ ] **Step 1: Remplacer le contenu du `<script>` par la table SCENES**

Remplacer le bloc `<script>...</script>` actuel par :

```html
<script>
'use strict';

const SCENES = [
  { id: 'intro', type: 'punchline', body: 'Une expérience narrative <mark>impose une structure auctoriale</mark> aux données tout en <mark>préservant l\'agence cognitive</mark> du lecteur.', attribution: 'Mathieu Guglielmino, mai 2026' },
  { id: 'spectre',     type: 'schema', title: 'Le spectre auteur ↔ lecteur', schemaId: 'svg-01-spectre',     steps: [] },
  { id: 'fondations',  type: 'schema', title: 'Les fondations canoniques',   schemaId: 'svg-02-fondations',  steps: [] },
  { id: 'genres',      type: 'schema', title: 'Genres × dimensions de design', schemaId: 'svg-03-genres',    steps: [] },
  { id: 'respi-1',     type: 'punchline', body: 'Le data storytelling moderniste prétend à <mark>l\'objectivité de la donnée</mark>. Le tournant humaniste rappelle que <mark>chaque visualisation est un acte éditorial</mark>.' },
  { id: 'humanism',    type: 'schema', title: 'Le manifeste Data Humanism',  schemaId: 'svg-04-humanism',    steps: [] },
  { id: 'pipelines',   type: 'schema', title: 'Pipelines techniques',        schemaId: 'svg-05-pipelines',   steps: [] },
  { id: 'chaine',      type: 'schema', title: 'La chaîne augmentée par IA',  schemaId: 'svg-06-chaine',      steps: [] },
  { id: 'matrice',     type: 'schema', title: 'Matrice contexte × pattern',  schemaId: 'svg-07-matrice',     steps: [] },
  { id: 'respi-2',     type: 'punchline', body: '<mark>Sept étapes</mark> dans la chaîne. <mark>Trois</mark> où l\'IA aide. <mark>Deux</mark> où elle nuit.' },
  { id: 'outro',       type: 'outro', title: 'Pour aller plus loin', body: 'L\'étude longue détaille les sept étapes du cadre praticien et propose un arbre de décision.', cta: { href: '20260505-narrative-experiences-app.html', label: 'Ouvrir l\'étude illustrée →' }, secondary: { href: '20260505-narrative-experiences-rapport.md', label: 'Télécharger le rapport ↓' } }
];

let state = { sceneIndex: 0, stepIndex: 0 };

console.log('[slideshow]', SCENES.length, 'scènes déclarées');
</script>
```

- [ ] **Step 2: Reload le navigateur**

Console : `[slideshow] 11 scènes déclarées`. Aucun rendu visuel à ce stade.

- [ ] **Step 3: Commit**

```bash
git add narrative-experiences/20260505-narrative-experiences-slideshow.html
git commit -m "feat(narrative-experiences): table SCENES déclarative pour slideshow"
```

---

### Task 3 : Moteur de rendu minimal — render() / advance() / retreat() / gotoScene()

**Files:**
- Modify: `narrative-experiences/20260505-narrative-experiences-slideshow.html` — bloc `<script>`

- [ ] **Step 1: Ajouter le moteur en dessous de la table SCENES**

Avant la ligne `console.log('[slideshow]', SCENES.length, ...)`, ajouter :

```js
const stage = document.getElementById('stage');

function render() {
  const scene = SCENES[state.sceneIndex];
  if (!scene) return;
  stage.innerHTML = `
    <div class="scene-debug" style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-faint); margin-bottom: 16px;">
      ${(state.sceneIndex+1).toString().padStart(2,'0')} / ${SCENES.length} · ${scene.type} · ${scene.id} · step ${state.stepIndex}
    </div>
    <h2 style="font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(28px, 4vw, 48px); line-height: 1.1; text-align: center; max-width: 80vw;">
      ${scene.title || scene.body || ''}
    </h2>
  `;
}

function advance() {
  const scene = SCENES[state.sceneIndex];
  const lastStep = (scene.steps && scene.steps.length > 0) ? scene.steps.length - 1 : 0;
  if (state.stepIndex < lastStep) {
    state.stepIndex++;
  } else if (state.sceneIndex < SCENES.length - 1) {
    state.sceneIndex++;
    state.stepIndex = 0;
  }
  render();
}

function retreat() {
  if (state.stepIndex > 0) {
    state.stepIndex--;
  } else if (state.sceneIndex > 0) {
    state.sceneIndex--;
    const prevScene = SCENES[state.sceneIndex];
    state.stepIndex = (prevScene.steps && prevScene.steps.length > 0) ? prevScene.steps.length - 1 : 0;
  }
  render();
}

function gotoScene(index) {
  if (index < 0 || index >= SCENES.length) return;
  state.sceneIndex = index;
  state.stepIndex = 0;
  render();
}

render();
```

- [ ] **Step 2: Reload, vérifier rendu de la scène 0**

Attendu :
- Au centre : ligne debug `01 / 11 · punchline · intro · step 0`.
- En dessous : la phrase intro avec les `<mark>` surlignés en stabilo `--accent`.
- Pas d'interaction encore (aucun input câblé).

- [ ] **Step 3: Tester via la console** (DevTools)

```js
advance(); // doit afficher 02 / 11 · schema · spectre · step 0
advance(); // 03 / 11 · schema · fondations · step 0
gotoScene(0); // retour à intro
retreat(); // ne fait rien (déjà au début)
```

- [ ] **Step 4: Commit**

```bash
git add narrative-experiences/20260505-narrative-experiences-slideshow.html
git commit -m "feat(narrative-experiences): moteur de rendu minimal advance/retreat/gotoScene"
```

---

### Task 4 : Inputs clavier + clic libre + tap

**Files:**
- Modify: `narrative-experiences/20260505-narrative-experiences-slideshow.html` — bloc `<script>`

- [ ] **Step 1: Ajouter les handlers d'input avant le `render()` final**

```js
function isAnyOverlayOpen() {
  // À étoffer aux tasks suivantes (modal, zoom, sommaire, sources)
  return false;
}

document.addEventListener('keydown', (e) => {
  // À étoffer plus tard avec gestion modal/overlay
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
    e.preventDefault();
    advance();
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    e.preventDefault();
    retreat();
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    gotoScene(state.sceneIndex + 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    gotoScene(state.sceneIndex - 1);
  }
});

stage.addEventListener('click', (e) => {
  if (isAnyOverlayOpen()) return;
  // Si le clic est sur un élément avec data-no-advance, on ignore
  if (e.target.closest('[data-no-advance]')) return;
  if (e.shiftKey) {
    retreat();
  } else {
    advance();
  }
});
```

- [ ] **Step 2: Reload, vérifier**

Au clavier : `→`, `Espace`, `PgDown` avancent ; `←`, `PgUp` reculent ; `↑↓` sautent de scène. Au clic sur la stage : avance. Shift+clic : recule.

- [ ] **Step 3: Commit**

```bash
git add narrative-experiences/20260505-narrative-experiences-slideshow.html
git commit -m "feat(narrative-experiences): inputs clavier et clic pour navigation slideshow"
```

---

## Phase B — Rendu des trois types de scène

### Task 5 : Rendu de la scène-punchline (intro, respi-1, respi-2)

**Files:**
- Modify: `narrative-experiences/20260505-narrative-experiences-slideshow.html` — `<style>` + bloc `<script>`

- [ ] **Step 1: Ajouter les styles punchline au `<style>`**

Ajouter avant la closing balise `</style>` :

```css
.scene-punchline { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; max-width: 1000px; padding: 0 24px; gap: 32px; }
.scene-punchline .body { font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-size: clamp(32px, 5.5vw, 64px); line-height: 1.18; letter-spacing: -0.015em; color: var(--text); }
.scene-punchline .body mark { background: linear-gradient(transparent 58%, rgba(178, 59, 27, 0.18) 58%); padding: 0 4px; }
.scene-punchline .attribution { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--text-faint); }

@media (max-width: 560px) {
  .scene-punchline .body { font-size: clamp(22px, 7vw, 32px); line-height: 1.25; }
}
```

- [ ] **Step 2: Remplacer la branche punchline du `render()`**

Remplacer la fonction `render()` :

```js
function render() {
  const scene = SCENES[state.sceneIndex];
  if (!scene) return;

  if (scene.type === 'punchline') {
    stage.innerHTML = `
      <div class="scene-punchline">
        <div class="body">${scene.body}</div>
        ${scene.attribution ? `<div class="attribution">${scene.attribution}</div>` : ''}
      </div>
    `;
    return;
  }

  // Fallback debug pour les autres types
  stage.innerHTML = `
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-faint); margin-bottom: 16px;">
      ${(state.sceneIndex+1).toString().padStart(2,'0')} / ${SCENES.length} · ${scene.type} · ${scene.id} · step ${state.stepIndex}
    </div>
    <h2 style="font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(28px, 4vw, 48px); line-height: 1.1; text-align: center; max-width: 80vw;">
      ${scene.title || ''}
    </h2>
  `;
}
```

- [ ] **Step 3: Reload, vérifier**

Scène 0 (intro) : grande phrase italic avec stabilo, attribution mono en bas. Avancer 4 fois pour atteindre `respi-1` (5e scène) : autre punchline, sans attribution. Tester sur mobile 375px : la phrase reste lisible.

- [ ] **Step 4: Commit**

```bash
git add narrative-experiences/20260505-narrative-experiences-slideshow.html
git commit -m "feat(narrative-experiences): rendu des scènes-punchline avec mark stabilo"
```

---

### Task 6 : Rendu de la scène-outro avec CTA

**Files:**
- Modify: `narrative-experiences/20260505-narrative-experiences-slideshow.html` — `<style>` + `render()`

- [ ] **Step 1: Ajouter les styles outro au `<style>`**

```css
.scene-outro { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; max-width: 700px; gap: 36px; padding: 0 24px; }
.scene-outro .eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--accent); }
.scene-outro h2 { font-family: 'Fraunces', serif; font-weight: 300; font-size: clamp(36px, 5vw, 56px); line-height: 1.1; letter-spacing: -0.02em; }
.scene-outro h2 em { font-style: italic; color: var(--accent); }
.scene-outro .body { font-family: 'Fraunces', serif; font-style: italic; font-size: clamp(17px, 2.2vw, 22px); line-height: 1.5; color: var(--text-dim); max-width: 560px; }
.scene-outro .ctas { display: flex; flex-direction: column; gap: 14px; align-items: stretch; min-width: 320px; }
.scene-outro .cta-primary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 16px 28px; background: var(--accent); color: white; text-decoration: none; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; border-radius: 4px; transition: background 0.2s; }
.scene-outro .cta-primary:hover { background: var(--carmine); }
.scene-outro .cta-secondary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 24px; background: transparent; color: var(--text); text-decoration: none; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase; border: 1px solid var(--line-strong); border-radius: 4px; transition: border-color 0.2s, color 0.2s; }
.scene-outro .cta-secondary:hover { border-color: var(--accent); color: var(--accent); }
.scene-outro .restart { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--text-faint); cursor: pointer; background: none; border: none; padding: 8px; }
.scene-outro .restart:hover { color: var(--accent); }
.scene-outro .disclosure { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-faint); margin-top: 24px; }
```

- [ ] **Step 2: Ajouter la branche outro dans `render()` après la branche punchline**

```js
  if (scene.type === 'outro') {
    stage.innerHTML = `
      <div class="scene-outro">
        <div class="eyebrow">Vous avez parcouru</div>
        <h2>Expériences <em>narratives</em> — l'essentiel</h2>
        <div class="body">${scene.body}</div>
        <div class="ctas" data-no-advance>
          <a class="cta-primary" href="${scene.cta.href}">${scene.cta.label}</a>
          <a class="cta-secondary" href="${scene.secondary.href}" download>${scene.secondary.label}</a>
        </div>
        <button class="restart" data-no-advance type="button" onclick="gotoScene(0)">↺ Recommencer</button>
        <div class="disclosure">Format co-écrit avec l'aide d'une IA</div>
      </div>
    `;
    return;
  }
```

- [ ] **Step 3: Reload, naviguer jusqu'à la scène 11**

Au clavier : appuyer 10× sur `→`. La scène outro s'affiche : titre Fraunces, deux boutons CTA, bouton « Recommencer » qui retour à la scène 0. Le clic sur les CTA n'avance PAS la scène (grâce à `data-no-advance`).

- [ ] **Step 4: Commit**

```bash
git add narrative-experiences/20260505-narrative-experiences-slideshow.html
git commit -m "feat(narrative-experiences): scène outro avec CTA vers étude longue"
```

---

## Phase C — Premier SVG, scène-schema avec étapes

### Task 7 : Importer le SVG 01 (spectre) depuis l'app illustrée

**Files:**
- Modify: `narrative-experiences/20260505-narrative-experiences-slideshow.html`
- Read-only source: `narrative-experiences/20260505-narrative-experiences-app.html` lignes 566-690 (figure du SVG 01)

- [ ] **Step 1: Lire le bloc `<figure id="fig-01">` (lignes 566-690) de l'app illustrée**

Le bloc contient `<figure class="figure" id="fig-01">` + `<svg ... data-schema-id="schema-01" ...>` + `<figcaption>`.

- [ ] **Step 2: Créer un conteneur `#schemas` caché en haut du `<body>` du slideshow**

Ajouter juste avant le `<main class="stage">` :

```html
<div id="schemas" hidden>
  <!-- SVG inline copiés depuis l'app illustrée — visibles via .scene-schema en JS -->
</div>
```

- [ ] **Step 3: Coller le `<svg ...>` (sans la `<figure>` ni le `<figcaption>`) dans `#schemas`**

Ajouter à l'intérieur de `<div id="schemas" hidden>` :

```html
<svg id="svg-01-spectre" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" data-schema-id="schema-01" role="img" aria-label="Spectre auteur ↔ lecteur de Segel-Heer (2010), avec les sept genres positionnés">
  <!-- contenu SVG copié depuis app.html lignes 568-688 -->
</svg>
```

Remplacer **uniquement** l'attribut `data-schema-id="schema-01"` par `id="svg-01-spectre"` au début de la balise (en gardant `data-schema-id` aussi pour préserver le câblage modal). Garder le reste du contenu strictement identique.

- [ ] **Step 4: Ajouter les styles CSS pour le conteneur de schémas**

Dans `<style>`, ajouter :

```css
#schemas { display: none; }
#schemas[hidden] { display: none !important; }
.schema-host { display: flex; flex-direction: column; align-items: center; justify-content: center; max-width: 1100px; width: 100%; gap: 16px; }
.schema-host .scene-title { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--text-mid); display: flex; align-items: baseline; gap: 12px; }
.schema-host .scene-title .num { color: var(--text-faint); }
.schema-host .scene-title .title { font-family: 'Fraunces', serif; font-weight: 400; font-size: clamp(22px, 3.2vw, 36px); letter-spacing: -0.01em; text-transform: none; color: var(--text); }
.schema-host svg { width: 100%; max-width: 1100px; height: auto; max-height: 60vh; }
.schema-host .caption { font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-size: clamp(16px, 1.8vw, 20px); line-height: 1.5; color: var(--text-dim); text-align: center; max-width: 720px; min-height: 2.4em; transition: opacity 180ms ease; }
.schema-host .caption.fade-out { opacity: 0; }
```

- [ ] **Step 5: Modifier `render()` pour la branche schema**

Remplacer la branche fallback debug par :

```js
  if (scene.type === 'schema') {
    const svgEl = document.getElementById(scene.schemaId);
    const svgClone = svgEl ? svgEl.outerHTML : `<div style="color: red;">SVG ${scene.schemaId} introuvable</div>`;
    const step = scene.steps[state.stepIndex] || { caption: '(pas d\'étape définie)' };
    stage.innerHTML = `
      <div class="schema-host">
        <div class="scene-title">
          <span class="num">${(state.sceneIndex+1).toString().padStart(2,'0')}</span>
          <span class="title">${scene.title}</span>
        </div>
        ${svgClone}
        <div class="caption">${step.caption}</div>
      </div>
    `;
    return;
  }
```

- [ ] **Step 6: Reload, naviguer jusqu'à la scène 02 (spectre)**

`→` une fois depuis intro. Vérifier : titre `02 · Le spectre auteur ↔ lecteur` en haut, le SVG du spectre Segel-Heer s'affiche, caption `(pas d'étape définie)` car `steps: []`.

- [ ] **Step 7: Commit**

```bash
git add narrative-experiences/20260505-narrative-experiences-slideshow.html
git commit -m "feat(narrative-experiences): import SVG 01 et rendu scène-schema basique"
```

---

### Task 8 : Définir les étapes de la scène spectre + classes CSS dim/active/hidden

**Files:**
- Modify: `narrative-experiences/20260505-narrative-experiences-slideshow.html`

- [ ] **Step 1: Inspecter les `<g id="...">` du SVG 01 dans DevTools**

Ouvrir DevTools → Elements → trouver `<svg id="svg-01-spectre">`. Lister les `id` de ses `<g>` enfants principaux. Noter les sélecteurs disponibles (par exemple `#genres-row`, `#spectrum-axis`, `#genre-magazine`, etc. — les ids exacts dépendent du SVG existant ; **utiliser les ids tels qu'ils existent dans le DOM**).

- [ ] **Step 2: Ajouter les styles dim/active/hidden au `<style>`**

```css
/* Vocabulaire visuel des révélations */
.schema-host svg [data-step-state="dim"] { opacity: 0.18; transition: opacity 220ms ease, filter 220ms ease; }
.schema-host svg [data-step-state="active"] { opacity: 1; transition: opacity 220ms ease, filter 220ms ease; filter: drop-shadow(0 0 0 transparent); }
.schema-host svg [data-step-state="hidden"] { opacity: 0; pointer-events: none; transition: opacity 220ms ease; }
```

- [ ] **Step 3: Compléter la table SCENES — étapes du spectre**

Remplacer dans `SCENES` la ligne `{ id: 'spectre', ..., steps: [] }` par (en adaptant les sélecteurs aux ids réellement présents dans le SVG 01 — vérifier en DevTools) :

```js
{
  id: 'spectre',
  type: 'schema',
  title: 'Le spectre auteur ↔ lecteur',
  schemaId: 'svg-01-spectre',
  steps: [
    { caption: 'Sept genres narratifs identifiés par Segel et Heer en 2010.',                  highlight: ['#genres-row'], dim: [], hidden: ['#spectrum-axis'] },
    { caption: 'Un axe les ordonne : qui mène — l\'auteur ou le lecteur ?',                    highlight: ['#genres-row', '#spectrum-axis'], dim: [], hidden: [] },
    { caption: 'À gauche, l\'auteur dirige strictement : magazine style, partitioned poster.',  highlight: ['#genre-magazine', '#genre-poster'], dim: ['#genres-row', '#spectrum-axis'], hidden: [] },
    { caption: 'Au centre, l\'autorité se relâche progressivement.',                            highlight: ['#genre-flowchart', '#genre-annotated'], dim: ['#genres-row', '#spectrum-axis'], hidden: [] },
    { caption: 'À droite, le lecteur explore librement — le format-outil prime sur le récit.',  highlight: ['#genre-explorable'], dim: ['#genres-row', '#spectrum-axis'], hidden: [] }
  ]
},
```

**Note importante :** si certains ids n'existent pas dans le SVG 01 réel, les remplacer par les ids effectifs du SVG (à lister en DevTools). Si nécessaire, *ajouter* des `id` aux `<g>` du SVG 01 dans le slideshow (modifier la copie locale, pas l'app illustrée).

- [ ] **Step 4: Implémenter `applyStepStyles()` et l'appeler depuis `render()`**

Ajouter avant `render()` :

```js
function applyStepStyles(scene, step) {
  const svg = stage.querySelector('svg');
  if (!svg) return;
  const all = svg.querySelectorAll('[id]');
  all.forEach(el => el.removeAttribute('data-step-state'));
  (step.dim || []).forEach(sel => svg.querySelectorAll(sel).forEach(el => el.setAttribute('data-step-state', 'dim')));
  (step.hidden || []).forEach(sel => svg.querySelectorAll(sel).forEach(el => el.setAttribute('data-step-state', 'hidden')));
  (step.highlight || []).forEach(sel => svg.querySelectorAll(sel).forEach(el => el.setAttribute('data-step-state', 'active')));
}
```

Et dans la branche schema de `render()`, après l'injection HTML, ajouter :

```js
    applyStepStyles(scene, step);
```

- [ ] **Step 5: Reload, naviguer dans la scène 02 étape par étape**

Aller à la scène 02 (`→` depuis intro). Appuyer sur `→` cinq fois. Vérifier : à chaque étape, le caption change avec un fade léger, et les éléments du SVG s'éclairent/s'estompent selon la chorégraphie. Les éléments dans `hidden` à l'étape 0 sont invisibles, ceux dans `dim` sont à 18%, ceux dans `highlight` à 100%.

Si une étape ne fait rien visuellement → vérifier en DevTools que les sélecteurs CSS matchent (ouvrir le `<svg>`, rechercher l'id).

- [ ] **Step 6: Commit**

```bash
git add narrative-experiences/20260505-narrative-experiences-slideshow.html
git commit -m "feat(narrative-experiences): chorégraphie progressive sur scène spectre (5 étapes)"
```

---

## Phase D — Modaux et zoom

### Task 9 : Importer #modal-root + openModal() + un modal cliqué

**Files:**
- Modify: `narrative-experiences/20260505-narrative-experiences-slideshow.html`
- Read-only source: `narrative-experiences/20260505-narrative-experiences-app.html` — lignes 401-449 (CSS modal), 1806-1880 (HTML #modal-root), 1882-1960 (JS openModal et MODAL_CARDS)

- [ ] **Step 1: Copier les styles modal de l'app illustrée**

Copier les règles CSS de `#modal-root`, `.modal-content`, `.modal-eyebrow`, `.modal-title`, `.modal-body`, `.modal-close`, `.modal-overlay` depuis l'app (lignes ~401-449) dans le `<style>` du slideshow. Adapter le `z-index` du `#modal-root` à `200` (au-dessus de la timeline future, en-dessous des overlays sommaire/sources qui seront à 300).

- [ ] **Step 2: Copier le `<div id="modal-root" hidden>` (lignes 1806-1880) avant la balise de fermeture `</body>`**

Garder la structure identique. Ne pas modifier le contenu interne.

- [ ] **Step 3: Copier les définitions `MODAL_CARDS` et la fonction `openModal()` (lignes 1882-1960) dans le `<script>`**

Coller juste avant la déclaration `const stage = document.getElementById('stage');`.

- [ ] **Step 4: Ajouter une fonction `closeModal()` et un flag `__modalAutoActive`**

```js
let __modalAutoActive = false;

function closeModal() {
  const root = document.getElementById('modal-root');
  if (!root) return;
  root.hidden = true;
  __modalAutoActive = false;
}

document.getElementById('modal-root').addEventListener('click', (e) => {
  if (e.target.closest('.modal-content')) return;
  closeModal();
});
```

- [ ] **Step 5: Mettre à jour `isAnyOverlayOpen()` et le keydown handler**

```js
function isAnyOverlayOpen() {
  return !document.getElementById('modal-root').hidden;
}
```

Et dans le `keydown` handler, modifier `ArrowRight`/`Espace` :

```js
if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
  e.preventDefault();
  const modalOpen = !document.getElementById('modal-root').hidden;
  if (modalOpen && __modalAutoActive) {
    closeModal();
    advance();
  } else if (modalOpen) {
    closeModal();
  } else {
    advance();
  }
}
```

Et ajouter Échap :

```js
} else if (e.key === 'Escape') {
  if (!document.getElementById('modal-root').hidden) {
    closeModal();
    e.preventDefault();
  }
}
```

- [ ] **Step 6: Câbler les régions cliquables des SVG (qui ont `data-modal="…"` dans l'app)**

Après le `render()` initial, ajouter :

```js
stage.addEventListener('click', (e) => {
  const target = e.target.closest('[data-modal]');
  if (!target) return;
  e.stopPropagation();
  const cardId = target.dataset.modal;
  const card = (typeof MODAL_CARDS !== 'undefined') ? MODAL_CARDS[cardId] : null;
  if (card) {
    openModal(card.eyebrow || '', card.title || '', card.body || '');
  }
}, true);  // capture phase pour intercepter avant le clic-pour-avancer
```

**Important :** ce listener doit s'exécuter en *capture phase* (3e arg `true`) pour intercepter avant le listener `stage.click` qui appelle `advance()`. Le `e.stopPropagation()` empêche le `advance()` parent.

- [ ] **Step 7: Reload, scène 02, cliquer sur une région du SVG qui a un `data-modal`**

Ouvrir DevTools → Elements → repérer un élément avec `data-modal="..."` dans le SVG 01. Cliquer dessus. Modal s'ouvre. Échap ferme. `→` ferme. Click hors modal ferme. La scène ne change pas pendant que le modal est ouvert.

- [ ] **Step 8: Commit**

```bash
git add narrative-experiences/20260505-narrative-experiences-slideshow.html
git commit -m "feat(narrative-experiences): modaux cliqués réutilisés depuis app illustrée"
```

---

### Task 10 : Modal automatique (modalAuto) — déclenché par chorégraphie + combo →

**Files:**
- Modify: `narrative-experiences/20260505-narrative-experiences-slideshow.html`

- [ ] **Step 1: Modifier la branche schema de `render()` pour déclencher modalAuto**

Dans la branche `schema`, après l'appel à `applyStepStyles(scene, step)`, ajouter :

```js
    if (step.modalAuto) {
      const card = MODAL_CARDS[step.modalAuto];
      if (card) {
        // Délai 220ms = fin de la transition CSS de l'étape
        setTimeout(() => {
          openModal(card.eyebrow || '', card.title || '', card.body || '');
          __modalAutoActive = true;
        }, 220);
      }
    }
```

- [ ] **Step 2: Ajouter `modalAuto` à une étape de la scène spectre pour tester**

Dans la table SCENES, scène spectre, modifier l'étape 3 (index 2 — celle de « À gauche, l'auteur dirige strictement ») :

```js
{ caption: 'À gauche, l\'auteur dirige strictement : magazine style, partitioned poster.',  highlight: ['#genre-magazine', '#genre-poster'], dim: ['#genres-row', '#spectrum-axis'], hidden: [], modalAuto: 'magazine-style' },
```

(Si la card `magazine-style` n'existe pas dans `MODAL_CARDS`, choisir un id qui existe — vérifier `Object.keys(MODAL_CARDS)` dans la console.)

- [ ] **Step 3: Reload, scène 02, avancer jusqu'à l'étape 3**

Le modal s'ouvre automatiquement après ~220ms. Appuyer `→` : modal se ferme ET on passe à l'étape 4 d'un coup. Appuyer `←` depuis l'étape 4 : on revient à l'étape 3, le modal se réouvre. Échap depuis le modal : il se ferme sans avancer.

- [ ] **Step 4: Commit**

```bash
git add narrative-experiences/20260505-narrative-experiences-slideshow.html
git commit -m "feat(narrative-experiences): modaux automatiques déclenchés par chorégraphie"
```

---

### Task 11 : Transition fade-through-paper entre scènes

**Files:**
- Modify: `narrative-experiences/20260505-narrative-experiences-slideshow.html`

- [ ] **Step 1: Wrapper `gotoScene()` pour ajouter fade-out / fade-in**

Remplacer la fonction `gotoScene()` :

```js
let __transitioning = false;

async function gotoScene(index) {
  if (index < 0 || index >= SCENES.length || __transitioning) return;
  __transitioning = true;
  stage.classList.add('fading-out');
  await new Promise(r => setTimeout(r, 250));
  state.sceneIndex = index;
  state.stepIndex = 0;
  render();
  stage.classList.remove('fading-out');
  await new Promise(r => setTimeout(r, 250));
  __transitioning = false;
}
```

- [ ] **Step 2: Modifier `advance()` et `retreat()` pour utiliser gotoScene quand on franchit une frontière de scène**

```js
function advance() {
  const scene = SCENES[state.sceneIndex];
  const lastStep = (scene.steps && scene.steps.length > 0) ? scene.steps.length - 1 : 0;
  if (state.stepIndex < lastStep) {
    state.stepIndex++;
    render();
  } else if (state.sceneIndex < SCENES.length - 1) {
    gotoScene(state.sceneIndex + 1);
  }
}

function retreat() {
  if (state.stepIndex > 0) {
    state.stepIndex--;
    render();
  } else if (state.sceneIndex > 0) {
    const prevScene = SCENES[state.sceneIndex - 1];
    const prevLastStep = (prevScene.steps && prevScene.steps.length > 0) ? prevScene.steps.length - 1 : 0;
    // Note : on n'utilise pas gotoScene ici parce qu'il reset à step 0. À reculer, on veut le dernier step de la scène précédente.
    state.sceneIndex--;
    state.stepIndex = prevLastStep;
    if (__transitioning) return;
    __transitioning = true;
    stage.classList.add('fading-out');
    setTimeout(() => {
      render();
      stage.classList.remove('fading-out');
      setTimeout(() => { __transitioning = false; }, 250);
    }, 250);
  }
}
```

- [ ] **Step 3: Reload, naviguer entre scènes**

Vérifier : entre intro et spectre, fade ~500ms total (250 ms out + 250 ms in). Pas de fade entre les étapes internes (elles utilisent juste les transitions CSS sur les classes dim/active). Test scène→scène en arrière (dans spectre étape 0, `←` → intro avec fade). Test `↑↓` qui doit aussi faire le fade.

- [ ] **Step 4: Ajouter le support `prefers-reduced-motion`**

Dans `<style>` :

```css
@media (prefers-reduced-motion: reduce) {
  .stage { transition: none !important; }
  .schema-host svg [data-step-state] { transition: none !important; }
  .schema-host .caption { transition: none !important; }
}
```

Et dans `gotoScene`, raccourcir les délais si reduced-motion :

```js
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FADE_MS = REDUCED ? 0 : 250;
// remplacer setTimeout 250 par setTimeout FADE_MS dans gotoScene et retreat
```

- [ ] **Step 5: Commit**

```bash
git add narrative-experiences/20260505-narrative-experiences-slideshow.html
git commit -m "feat(narrative-experiences): transition fade-through-paper avec reduced-motion"
```

---

## Phase E — Chrome persistant

### Task 12 : Timeline cliquable au pied de page

**Files:**
- Modify: `narrative-experiences/20260505-narrative-experiences-slideshow.html`

- [ ] **Step 1: Ajouter le HTML de la timeline juste avant `</body>`**

Avant `<div id="modal-root">`, ajouter :

```html
<footer class="footer-bar" id="footer-bar">
  <div class="timeline" id="timeline" data-no-advance></div>
  <div class="footer-actions" data-no-advance>
    <button class="footer-btn" id="btn-sources" type="button">Sources</button>
    <button class="footer-btn" id="btn-toc" type="button" aria-label="Sommaire">≡</button>
  </div>
</footer>
```

- [ ] **Step 2: Ajouter les styles timeline dans `<style>`**

```css
.footer-bar { position: fixed; bottom: 24px; left: 0; right: 0; display: flex; align-items: center; justify-content: center; gap: 28px; z-index: 40; padding: 0 24px; pointer-events: none; }
.timeline { display: flex; gap: 4px; align-items: center; pointer-events: auto; }
.timeline .seg { width: 36px; height: 4px; background: var(--text-faint); opacity: 0.4; cursor: pointer; position: relative; transition: opacity 0.2s, background 0.2s; }
.timeline .seg.visited { background: var(--accent); opacity: 0.5; }
.timeline .seg.current { background: var(--accent); opacity: 1; }
.timeline .seg .fill { position: absolute; left: 0; top: 0; bottom: 0; background: var(--accent); width: 0%; transition: width 220ms ease; }
.timeline .seg:hover { opacity: 1; }
.timeline .seg .label { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); white-space: nowrap; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-mid); background: var(--bg); padding: 4px 8px; border-radius: 3px; opacity: 0; pointer-events: none; transition: opacity 0.15s; box-shadow: 0 1px 3px rgba(30,30,44,0.08); }
.timeline .seg:hover .label { opacity: 1; }
.timeline .seg.punchline { width: 8px; height: 8px; border-radius: 50%; background: var(--text-faint); }
.timeline .seg.punchline.visited { background: var(--accent); opacity: 0.7; }
.timeline .seg.punchline.current { background: var(--accent); opacity: 1; transform: scale(1.3); }
.timeline .seg.outro::after { content: '▸'; position: absolute; right: -2px; top: -7px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-faint); }
.timeline .seg.outro.visited::after, .timeline .seg.outro.current::after { color: var(--accent); }
.footer-actions { display: flex; gap: 16px; pointer-events: auto; }
.footer-btn { background: none; border: none; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-mid); cursor: pointer; padding: 6px 8px; transition: color 0.2s; }
.footer-btn:hover { color: var(--accent); }

@media (max-width: 560px) {
  .footer-bar { gap: 12px; bottom: 16px; }
  .timeline .seg { width: 24px; }
  .footer-btn { font-size: 8px; }
  .timeline .seg .label { display: none; } /* tooltip non utilisable au touch */
}
```

- [ ] **Step 3: Implémenter `renderTimeline()` et l'appeler depuis `render()`**

Avant `render()` :

```js
function renderTimeline() {
  const tl = document.getElementById('timeline');
  if (!tl) return;
  tl.innerHTML = SCENES.map((scene, i) => {
    const visited = i < state.sceneIndex;
    const current = i === state.sceneIndex;
    const cls = ['seg'];
    if (scene.type === 'punchline') cls.push('punchline');
    if (scene.type === 'outro') cls.push('outro');
    if (visited) cls.push('visited');
    if (current) cls.push('current');
    let fillPct = 0;
    if (current && scene.steps && scene.steps.length > 1) {
      fillPct = Math.round((state.stepIndex / (scene.steps.length - 1)) * 100);
    } else if (visited) {
      fillPct = 100;
    }
    const label = `${(i+1).toString().padStart(2,'0')} · ${scene.title || (scene.type === 'punchline' ? 'Respiration' : 'Outro')}`;
    return `<div class="seg ${cls.join(' ')}" data-index="${i}"><div class="fill" style="width: ${fillPct}%"></div><div class="label">${label}</div></div>`;
  }).join('');
}

document.getElementById('timeline').addEventListener('click', (e) => {
  const seg = e.target.closest('.seg');
  if (!seg) return;
  e.stopPropagation();
  gotoScene(parseInt(seg.dataset.index, 10));
});
```

À la fin de `render()` (toutes branches confondues), ajouter `renderTimeline();`.

- [ ] **Step 4: Reload**

Vérifier : 11 segments en bas, le segment courant en `--accent`, hover affiche le titre. Cliquer un segment saute à la scène correspondante avec fade. À l'avancée par étapes internes, le sous-segment se remplit.

- [ ] **Step 5: Commit**

```bash
git add narrative-experiences/20260505-narrative-experiences-slideshow.html
git commit -m "feat(narrative-experiences): timeline cliquable avec sous-progression d'étape"
```

---

### Task 13 : Sommaire-overlay (touche S, bouton ≡)

**Files:**
- Modify: `narrative-experiences/20260505-narrative-experiences-slideshow.html`

- [ ] **Step 1: Ajouter le HTML de l'overlay sommaire avant `<div id="modal-root">`**

```html
<div id="toc-overlay" class="full-overlay" hidden role="dialog" aria-modal="true" aria-label="Sommaire des scènes">
  <button class="overlay-close" type="button" aria-label="Fermer le sommaire">Fermer ✕</button>
  <ol class="toc-list" id="toc-list"></ol>
</div>
```

- [ ] **Step 2: Ajouter les styles dans `<style>`**

```css
.full-overlay { position: fixed; inset: 0; background: rgba(250,246,236,0.96); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 300; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 80px 32px 80px; overflow-y: auto; }
.full-overlay[hidden] { display: none !important; }
.overlay-close { position: fixed; top: 24px; right: 32px; background: none; border: 1px solid var(--line-strong); padding: 10px 16px; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--text); cursor: pointer; border-radius: 3px; transition: border-color 0.2s, color 0.2s; }
.overlay-close:hover { border-color: var(--accent); color: var(--accent); }
.toc-list { list-style: none; max-width: 720px; width: 100%; display: flex; flex-direction: column; gap: 16px; counter-reset: scene-num; }
.toc-list li { font-family: 'Fraunces', serif; font-size: clamp(20px, 2.4vw, 28px); font-weight: 300; cursor: pointer; padding: 12px 0; border-bottom: 1px dashed var(--line); transition: color 0.2s; display: flex; align-items: baseline; gap: 16px; }
.toc-list li:hover { color: var(--accent); }
.toc-list li .num { font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.18em; color: var(--text-faint); min-width: 32px; }
.toc-list li .meta { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-faint); margin-left: auto; }
```

- [ ] **Step 3: Implémenter renderToc() et toggleToc()**

```js
function renderToc() {
  const list = document.getElementById('toc-list');
  list.innerHTML = SCENES.map((scene, i) => {
    const stepsCount = scene.steps ? scene.steps.length : 1;
    const stepsLabel = stepsCount === 1 ? '1 étape' : `${stepsCount} étapes`;
    const titleOrLabel = scene.title || (scene.type === 'punchline' ? '✴ Respiration' : 'Outro — pour aller plus loin');
    return `<li data-index="${i}"><span class="num">${(i+1).toString().padStart(2,'0')}</span><span>${titleOrLabel}</span><span class="meta">${stepsLabel}</span></li>`;
  }).join('');
}

function toggleToc(forceState) {
  const o = document.getElementById('toc-overlay');
  const newHidden = forceState !== undefined ? !forceState : !o.hidden;
  o.hidden = newHidden;
  if (!newHidden) renderToc();
}

document.getElementById('btn-toc').addEventListener('click', (e) => { e.stopPropagation(); toggleToc(true); });
document.getElementById('toc-overlay').addEventListener('click', (e) => {
  if (e.target.closest('.overlay-close')) { toggleToc(false); return; }
  const li = e.target.closest('li[data-index]');
  if (li) { gotoScene(parseInt(li.dataset.index, 10)); toggleToc(false); }
});
```

- [ ] **Step 4: Mettre à jour `isAnyOverlayOpen()` et le keydown handler**

```js
function isAnyOverlayOpen() {
  return !document.getElementById('modal-root').hidden
      || !document.getElementById('toc-overlay').hidden;
}
```

Et dans le `keydown` handler, ajouter :

```js
} else if (e.key === 's' || e.key === 'S') {
  if (e.target.tagName === 'INPUT') return;  // ne pas trigger pendant filtre sources futur
  e.preventDefault();
  toggleToc();
}
```

Et étendre le cas Échap :

```js
} else if (e.key === 'Escape') {
  if (!document.getElementById('modal-root').hidden) { closeModal(); e.preventDefault(); return; }
  if (!document.getElementById('toc-overlay').hidden) { toggleToc(false); e.preventDefault(); return; }
}
```

Et dans le `keydown` handler, garder les arrows désactivées si overlay ouvert :

```js
if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
  if (!document.getElementById('toc-overlay').hidden) return;  // ignore quand toc ouvert
  // … reste inchangé (gestion modal puis advance)
}
```

(Faire pareil pour ArrowLeft / ArrowUp / ArrowDown.)

- [ ] **Step 5: Reload, tester touche S et bouton ≡**

S ouvre le sommaire. Liste des 11 scènes, hover ligne par ligne, clic sur une ligne saute à la scène ET ferme l'overlay. Échap ferme. Bouton ≡ aussi ouvre/ferme.

- [ ] **Step 6: Commit**

```bash
git add narrative-experiences/20260505-narrative-experiences-slideshow.html
git commit -m "feat(narrative-experiences): sommaire-overlay accessible via touche S et bouton"
```

---

### Task 14 : Sources-overlay (touche R, bouton Sources, filtre, références depuis modal)

**Files:**
- Modify: `narrative-experiences/20260505-narrative-experiences-slideshow.html`
- Read-only source: `narrative-experiences/20260505-narrative-experiences-app.html` — bloc `<aside id="sources">` (chercher dans le fichier)

- [ ] **Step 1: Localiser et copier la liste des sources de l'app illustrée**

Dans l'app illustrée, identifier la zone `<aside id="sources">` (ou équivalent) qui contient les 19 sources numérotées. Extraire chaque source en JS sous forme de tableau :

```js
const SOURCES = [
  { num: 1, author: 'Bertin, J.', title: 'Sémiologie graphique', year: '1967', publisher: 'Mouton/Gauthier-Villars', url: null },
  { num: 2, author: 'Shneiderman, B.', title: 'The Eyes Have It: A Task by Data Type Taxonomy for Information Visualizations', year: '1996', publisher: 'IEEE VL', url: 'https://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf' },
  // … 17 autres extraits depuis l'aside de l'app
];
```

**Mode opératoire :** lire le bloc sources de l'app entre ses balises, extraire numéro/auteur/titre/année/url pour les 19. Copier directement le HTML brut si plus simple, et le convertir en données JS plus tard.

- [ ] **Step 2: Ajouter le HTML de l'overlay sources**

Avant `<div id="modal-root">`, après le toc-overlay :

```html
<div id="sources-overlay" class="full-overlay" hidden role="dialog" aria-modal="true" aria-label="Sources">
  <button class="overlay-close" type="button" aria-label="Fermer les sources">Fermer ✕</button>
  <input type="search" class="sources-filter" id="sources-filter" placeholder="Filtrer les 19 sources…" data-no-advance>
  <ol class="sources-list" id="sources-list"></ol>
</div>
```

- [ ] **Step 3: Ajouter les styles**

```css
.sources-filter { max-width: 720px; width: 100%; padding: 12px 16px; font-family: 'Inter', sans-serif; font-size: 14px; border: 1px solid var(--line-strong); background: transparent; color: var(--text); margin-bottom: 24px; border-radius: 3px; }
.sources-filter:focus { outline: none; border-color: var(--accent); }
.sources-list { list-style: none; max-width: 720px; width: 100%; display: flex; flex-direction: column; gap: 16px; }
.sources-list li { font-family: 'Inter', sans-serif; font-size: 14.5px; line-height: 1.55; padding: 8px 0; border-bottom: 1px dashed var(--line); display: flex; gap: 14px; transition: background 0.4s; }
.sources-list li.flash { background: rgba(184, 88, 46, 0.18); }
.sources-list li .num { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.12em; color: var(--accent); min-width: 28px; padding-top: 2px; }
.sources-list li a { color: var(--accent); text-decoration: underline; text-decoration-color: var(--line-strong); text-underline-offset: 3px; transition: text-decoration-color 0.2s; }
.sources-list li a:hover { text-decoration-color: var(--accent); }
```

- [ ] **Step 4: Implémenter renderSources(), toggleSources(), filtre, flash**

```js
function renderSources(filter = '') {
  const list = document.getElementById('sources-list');
  const f = filter.toLowerCase();
  const items = SOURCES
    .filter(s => !f || (s.author + ' ' + s.title + ' ' + s.year).toLowerCase().includes(f))
    .map(s => `
      <li data-num="${s.num}">
        <span class="num">[${s.num}]</span>
        <span><strong>${s.author}</strong> — ${s.title}, ${s.year}.${s.publisher ? ' <em>' + s.publisher + '</em>.' : ''}${s.url ? ` <a href="${s.url}" target="_blank" rel="noopener">Lien ↗</a>` : ''}</span>
      </li>
    `);
  list.innerHTML = items.join('');
}

function toggleSources(forceState) {
  const o = document.getElementById('sources-overlay');
  const newHidden = forceState !== undefined ? !forceState : !o.hidden;
  o.hidden = newHidden;
  if (!newHidden) {
    renderSources('');
    document.getElementById('sources-filter').value = '';
    setTimeout(() => document.getElementById('sources-filter').focus(), 80);
  }
}

function flashSource(num) {
  toggleSources(true);
  setTimeout(() => {
    const li = document.querySelector(`#sources-list li[data-num="${num}"]`);
    if (!li) return;
    li.scrollIntoView({ behavior: 'smooth', block: 'center' });
    li.classList.add('flash');
    setTimeout(() => li.classList.remove('flash'), 1500);
  }, 100);
}

document.getElementById('btn-sources').addEventListener('click', (e) => { e.stopPropagation(); toggleSources(true); });
document.getElementById('sources-overlay').addEventListener('click', (e) => {
  if (e.target.closest('.overlay-close')) { toggleSources(false); }
});
document.getElementById('sources-filter').addEventListener('input', (e) => renderSources(e.target.value));
```

- [ ] **Step 5: Référence depuis modal — convertir `[N]` en lien**

Dans la fonction `openModal()` (copiée de l'app), patcher le rendu du `body` pour transformer `[12]` en lien cliquable. Avant le `modalRoot.hidden = false;` final, ajouter :

```js
// Convertir [N] en liens vers la source N
const bodyEl = modalRoot.querySelector('.modal-body');
if (bodyEl) {
  bodyEl.innerHTML = bodyEl.innerHTML.replace(/\[(\d+)\]/g, (m, n) => `<a href="#" class="source-ref" data-source-num="${n}">[${n}]</a>`);
  bodyEl.querySelectorAll('.source-ref').forEach(a => {
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      const num = parseInt(a.dataset.sourceNum, 10);
      closeModal();
      flashSource(num);
    });
  });
}
```

Si `openModal` ne s'appelle pas avec un `<div class="modal-body">` mais autrement, adapter le sélecteur (lire la version copiée pour vérifier).

- [ ] **Step 6: Mettre à jour `isAnyOverlayOpen()` et keydown**

```js
function isAnyOverlayOpen() {
  return !document.getElementById('modal-root').hidden
      || !document.getElementById('toc-overlay').hidden
      || !document.getElementById('sources-overlay').hidden;
}
```

Ajouter au keydown :

```js
} else if (e.key === 'r' || e.key === 'R') {
  if (e.target.tagName === 'INPUT') return;
  e.preventDefault();
  toggleSources();
}
```

Étendre la cascade Échap :

```js
if (!document.getElementById('sources-overlay').hidden) { toggleSources(false); e.preventDefault(); return; }
```

(Ordre : modal > sources > toc.)

- [ ] **Step 7: Reload, tester**

R ouvre les sources, le champ filtre prend le focus, taper « Lupi » filtre la liste. Échap ferme. Cliquer un `[12]` dans un modal (à condition qu'un des modaux ait `[12]` dans son corps) ferme le modal et ouvre les sources avec flash sur la 12.

- [ ] **Step 8: Commit**

```bash
git add narrative-experiences/20260505-narrative-experiences-slideshow.html
git commit -m "feat(narrative-experiences): sources-overlay avec filtre et références cliquables"
```

---

### Task 15 : Zoom plein écran sur les schémas

**Files:**
- Modify: `narrative-experiences/20260505-narrative-experiences-slideshow.html`
- Read-only source: `narrative-experiences/20260505-narrative-experiences-app.html` — lignes 236-400 (CSS zoom-overlay), 1789-1805 (HTML), 2103+ (JS setupZoom)

- [ ] **Step 1: Copier les styles `#zoom-overlay`, `.zoom-btn`, `.zoom-controls`, `.zoom-pannable` de l'app illustrée**

Coller dans le `<style>` du slideshow.

- [ ] **Step 2: Copier le `<div id="zoom-overlay" hidden ...>` (lignes 1789-1805) avant le `#modal-root`**

- [ ] **Step 3: Copier la fonction `setupZoom()` IIFE (lignes 2103+) à la fin du `<script>`**

- [ ] **Step 4: Ajouter un bouton zoom dans `render()` branche schema**

Modifier le HTML injecté par `render()` pour la branche schema, ajouter à côté du SVG :

```js
    stage.innerHTML = `
      <div class="schema-host">
        <div class="scene-title">…</div>
        <div class="schema-wrapper" style="position: relative; width: 100%; max-width: 1100px;">
          ${svgClone}
          <button class="zoom-btn" type="button" aria-label="Zoom plein écran" data-no-advance data-zoom-target>⛶</button>
        </div>
        <div class="caption">${step.caption}</div>
      </div>
    `;
```

(Garder les autres lignes inchangées.)

- [ ] **Step 5: Adapter setupZoom() pour cibler `.schema-wrapper svg`**

Si la fonction `setupZoom()` copiée cherche `.figure svg` (sélecteur de l'app), modifier le sélecteur pour cibler `.schema-wrapper svg` à la place. Ou : ajouter la classe `.figure` à `.schema-wrapper` pour réutiliser le sélecteur. Choix le plus simple : ajouter `.figure` comme classe additionnelle à `.schema-wrapper`.

- [ ] **Step 6: Mettre à jour isAnyOverlayOpen() et la cascade Échap**

```js
function isAnyOverlayOpen() {
  return !document.getElementById('modal-root').hidden
      || !document.getElementById('toc-overlay').hidden
      || !document.getElementById('sources-overlay').hidden
      || !document.getElementById('zoom-overlay').hidden;
}
```

Cascade Échap (ordre final modal > zoom > sources > toc) :

```js
} else if (e.key === 'Escape') {
  if (!document.getElementById('modal-root').hidden) { closeModal(); e.preventDefault(); return; }
  if (!document.getElementById('zoom-overlay').hidden) { /* setupZoom gère son propre Échap ; vérifier qu'il intercepte */ return; }
  if (!document.getElementById('sources-overlay').hidden) { toggleSources(false); e.preventDefault(); return; }
  if (!document.getElementById('toc-overlay').hidden) { toggleToc(false); e.preventDefault(); return; }
}
```

(Le zoom de l'app illustrée a déjà son propre handler Échap dans `setupZoom()` — vérifier que les deux ne se marchent pas dessus.)

- [ ] **Step 7: Reload, scène 02, cliquer le bouton ⛶**

Le SVG passe en zoom plein écran avec pan + wheel zoom. Reset / Échap ferme. Pendant le zoom, `←/→` ne pilotent pas la scène.

- [ ] **Step 8: Commit**

```bash
git add narrative-experiences/20260505-narrative-experiences-slideshow.html
git commit -m "feat(narrative-experiences): zoom plein écran sur les schémas"
```

---

## Phase F — Compléter le contenu

### Task 16 : Importer les 6 SVG restants + définir leurs chorégraphies

**Files:**
- Modify: `narrative-experiences/20260505-narrative-experiences-slideshow.html`
- Read-only source: `narrative-experiences/20260505-narrative-experiences-app.html` — lignes 722-799 (SVG 02), 839-970 (SVG 03), 1006-1098 (SVG 04), 1138-1273 (SVG 05), 1310-1421 (SVG 06), 1461-1642 (SVG 07)

- [ ] **Step 1: Copier les 6 SVG dans le `#schemas` du slideshow**

Pour chacun des 6 SVG (02 à 07), copier le bloc `<svg ...>...</svg>` (sans la `<figure>` ni le `<figcaption>`) depuis l'app, en lui ajoutant un `id="svg-XX-slug"` correspondant à la table SCENES :

| Source app | Cible slideshow id |
|---|---|
| `data-schema-id="schema-02"` (ligne 722) | `id="svg-02-fondations"` |
| `data-schema-id="schema-03"` (ligne 839) | `id="svg-03-genres"` |
| `data-schema-id="schema-04"` (ligne 1006) | `id="svg-04-humanism"` |
| `data-schema-id="schema-05"` (ligne 1138) | `id="svg-05-pipelines"` |
| `data-schema-id="schema-06"` (ligne 1310) | `id="svg-06-chaine"` |
| `data-schema-id="schema-07"` (ligne 1461) | `id="svg-07-matrice"` |

- [ ] **Step 2: Définir les `steps` de chaque scène-schema dans la table SCENES**

Pour chaque scène-schema (fondations, genres, humanism, pipelines, chaine, matrice), inspecter le SVG correspondant dans DevTools (Elements panel), repérer les `<g id="...">` principaux, et écrire 4-7 étapes par scène. **Une étape ne doit pas dépasser 1-2 sélecteurs highlight et 1-3 sélecteurs dim/hidden.**

Template par scène :

```js
{
  id: 'fondations',
  type: 'schema',
  title: 'Les fondations canoniques',
  schemaId: 'svg-02-fondations',
  steps: [
    { caption: 'Cinq couches stratifient la pensée canonique de la dataviz narrative.', highlight: ['#stack-bertin'], dim: ['#stack-shneiderman', '#stack-meirelles', '#stack-munzner', '#stack-cairo'], hidden: [] },
    { caption: 'Bertin, 1967 — la sémiologie graphique pose les variables visuelles.',  highlight: ['#stack-bertin'], dim: ['#stack-shneiderman', '#stack-meirelles', '#stack-munzner', '#stack-cairo'], hidden: [], modalAuto: 'bertin' },
    { caption: 'Shneiderman, 1996 — overview, zoom, details on demand.',                highlight: ['#stack-shneiderman'], dim: ['#stack-bertin', '#stack-meirelles', '#stack-munzner', '#stack-cairo'], hidden: [] },
    { caption: 'Meirelles, 2013 — six structures de représentation.',                   highlight: ['#stack-meirelles'], dim: ['#stack-bertin', '#stack-shneiderman', '#stack-munzner', '#stack-cairo'], hidden: [] },
    { caption: 'Munzner, 2014 — What/Why/How comme grille de design.',                  highlight: ['#stack-munzner'], dim: ['#stack-bertin', '#stack-shneiderman', '#stack-meirelles', '#stack-cairo'], hidden: [] },
    { caption: 'Cairo, 2016 — truthful → functional → beautiful → insightful → enlightening.', highlight: ['#stack-cairo'], dim: ['#stack-bertin', '#stack-shneiderman', '#stack-meirelles', '#stack-munzner'], hidden: [] },
    { caption: 'L\'empilement complet est la grammaire commune du data storytelling moderne.', highlight: ['#stack-bertin', '#stack-shneiderman', '#stack-meirelles', '#stack-munzner', '#stack-cairo'], dim: [], hidden: [] }
  ]
}
```

(Adapter les ids à ce qui existe réellement dans le SVG correspondant. Si un id manque dans le SVG, l'**ajouter** au SVG copié dans `#schemas`.)

Procéder schéma par schéma : SVG 02 → tester → SVG 03 → tester → … Commit après chaque schéma pour pouvoir bisect en cas de pépin.

- [ ] **Step 3: Reload après chaque schéma, parcourir les 11 scènes**

Vérifier que chaque scène-schema se construit correctement étape par étape. Tester les `modalAuto` quand définis. Identifier les ids manquants ou les chorégraphies qui « tombent à plat » et les retoucher.

- [ ] **Step 4: Commit après chaque schéma fini**

```bash
git add narrative-experiences/20260505-narrative-experiences-slideshow.html
git commit -m "feat(narrative-experiences): chorégraphie scène fondations canoniques"
```

(Répéter `feat: chorégraphie scène <nom>` pour chacune des 6 scènes.)

---

## Phase G — Mobile et polish

### Task 17 : Tap, swipe horizontal mobile, toaster d'onboarding

**Files:**
- Modify: `narrative-experiences/20260505-narrative-experiences-slideshow.html`

- [ ] **Step 1: Ajouter le HTML du toaster avant `</body>`**

```html
<div class="toaster" id="toaster" hidden data-no-advance>
  <span>Tape pour avancer · Swipe ←→ pour changer de scène · Pince pour zoomer</span>
</div>
```

- [ ] **Step 2: Styles toaster**

```css
.toaster { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: var(--text); color: var(--bg); padding: 12px 20px; border-radius: 24px; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.14em; z-index: 60; opacity: 0; pointer-events: none; transition: opacity 0.4s ease; max-width: calc(100vw - 32px); text-align: center; }
.toaster.show { opacity: 1; }
.toaster[hidden] { display: none; }
```

- [ ] **Step 3: Détecter touch + premier visit + afficher toaster**

```js
function isTouchDevice() {
  return ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
}

function maybeShowOnboardingToaster() {
  if (!isTouchDevice()) return;
  if (localStorage.getItem('slideshow-onboarded')) return;
  const t = document.getElementById('toaster');
  t.hidden = false;
  setTimeout(() => t.classList.add('show'), 50);
  const dismiss = () => {
    t.classList.remove('show');
    setTimeout(() => { t.hidden = true; }, 400);
    localStorage.setItem('slideshow-onboarded', '1');
    window.removeEventListener('touchstart', dismiss);
  };
  window.addEventListener('touchstart', dismiss, { once: true });
  setTimeout(dismiss, 6000);
}

maybeShowOnboardingToaster();
```

- [ ] **Step 4: Implémenter le swipe horizontal**

```js
let touchStart = null;
stage.addEventListener('touchstart', (e) => {
  if (e.touches.length !== 1) return;
  touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
}, { passive: true });

stage.addEventListener('touchend', (e) => {
  if (!touchStart) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStart.x;
  const dy = t.clientY - touchStart.y;
  const dt = Date.now() - touchStart.t;
  touchStart = null;
  if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;  // pas un swipe horizontal franc
  if (dt > 600) return;  // trop lent
  if (dx > 0) gotoScene(state.sceneIndex - 1);
  else gotoScene(state.sceneIndex + 1);
});
```

- [ ] **Step 5: Ajustements mobile dans `<style>`**

Ajouter à la media query `@media (max-width: 560px)` :

```css
.zoom-btn { opacity: 0.8 !important; }
.modal-content { width: 95vw !important; max-height: 90vh !important; }
.scene-outro .ctas { min-width: 0; width: 100%; }
```

- [ ] **Step 6: Tester sur DevTools device toolbar (iPhone SE 375 × 667 et iPhone 12 Pro 390 × 844)**

Ouvrir le slideshow sur device toolbar. Vérifier :
- Toaster apparaît au premier chargement (vider localStorage avant via `localStorage.clear()`)
- Tap sur la stage avance
- Swipe horizontal change de scène (utiliser le device toolbar pour simuler le drag-touch)
- Bouton zoom plus visible
- Modaux occupent presque toute la viewport

- [ ] **Step 7: Commit**

```bash
git add narrative-experiences/20260505-narrative-experiences-slideshow.html
git commit -m "feat(narrative-experiences): mobile (tap, swipe, toaster d'onboarding)"
```

---

### Task 18 : Polish — pulse → d'inactivité, accessibilité, auto-masquage topbar

**Files:**
- Modify: `narrative-experiences/20260505-narrative-experiences-slideshow.html`

- [ ] **Step 1: Pulse → d'inactivité**

Ajouter dans `<style>` :

```css
.idle-cue { position: fixed; bottom: 60px; right: 32px; font-family: 'JetBrains Mono', monospace; font-size: 18px; color: var(--accent); opacity: 0; pointer-events: none; transition: opacity 0.5s; z-index: 35; animation: idle-pulse 1.5s ease-in-out infinite; }
.idle-cue.show { opacity: 0.5; }
@keyframes idle-pulse { 0%, 100% { transform: translateY(0); opacity: 0.3; } 50% { transform: translateY(-4px); opacity: 0.7; } }
@media (prefers-reduced-motion: reduce) { .idle-cue { animation: none; } }
@media (max-width: 560px) { .idle-cue { display: none; } }
```

Ajouter dans le HTML avant `</body>` : `<div class="idle-cue" id="idle-cue">→</div>`

JS :

```js
let idleTimer = null;
function resetIdle() {
  const cue = document.getElementById('idle-cue');
  cue.classList.remove('show');
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => cue.classList.add('show'), 4000);
}
['keydown', 'click', 'touchstart', 'mousemove'].forEach(evt => window.addEventListener(evt, resetIdle, { passive: true }));
resetIdle();
```

- [ ] **Step 2: Accessibilité — sémantique scène, caption live, focus**

Modifier `render()` pour wrapper chaque scène dans un `<section>` correctement annoté :

Pour la branche schema :

```js
    stage.innerHTML = `
      <section class="schema-host" role="group" aria-roledescription="scène" aria-labelledby="scene-title-${state.sceneIndex}">
        <div class="scene-title">
          <span class="num">${(state.sceneIndex+1).toString().padStart(2,'0')}</span>
          <span class="title" id="scene-title-${state.sceneIndex}">${scene.title}</span>
        </div>
        <div class="schema-wrapper figure" style="position: relative; width: 100%; max-width: 1100px;">
          ${svgClone}
          <button class="zoom-btn" type="button" aria-label="Zoom plein écran" data-no-advance>⛶</button>
        </div>
        <div class="caption" aria-live="polite">${step.caption}</div>
      </section>
    `;
```

Adapter la branche punchline et outro de la même manière (`<section role="group" aria-roledescription="scène">`).

Pour le focus management dans openModal : après `modalRoot.hidden = false`, ajouter :

```js
const closeBtn = modalRoot.querySelector('.modal-close');
if (closeBtn) {
  setTimeout(() => closeBtn.focus(), 120);
}
```

Et dans closeModal :

```js
function closeModal() {
  const root = document.getElementById('modal-root');
  if (!root) return;
  root.hidden = true;
  __modalAutoActive = false;
  // Restaure focus sur le stage pour que la suite des keyboard events fonctionne
  document.body.focus();
}
```

- [ ] **Step 3: Auto-masquage topbar (à l'essai, retirable si gênant)**

```css
.topbar.idle { opacity: 0.2; }
.topbar:hover { opacity: 1 !important; }
```

JS (étendre resetIdle) :

```js
function resetIdle() {
  const cue = document.getElementById('idle-cue');
  cue.classList.remove('show');
  document.getElementById('topbar').classList.remove('idle');
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    cue.classList.add('show');
    document.getElementById('topbar').classList.add('idle');
  }, 4000);
}
```

- [ ] **Step 4: Tester accessibilité au clavier**

Tab cycle : devrait passer sur la topbar > zoom-btn > timeline segments > Sources > ≡. Vérifier qu'on peut tout atteindre. Avec NVDA/VoiceOver activé : les changements de caption sont annoncés (aria-live).

- [ ] **Step 5: Tester `prefers-reduced-motion`**

DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`. Vérifier que le pulse s'arrête, que la transition fade est instantanée (FADE_MS=0).

- [ ] **Step 6: Commit**

```bash
git add narrative-experiences/20260505-narrative-experiences-slideshow.html
git commit -m "feat(narrative-experiences): polish — pulse d'inactivité, a11y et auto-masquage"
```

---

## Phase H — Hub et validation

### Task 19 : Ajouter la 3ᵉ carte au hub `narrative-experiences/index.html`

**Files:**
- Modify: `narrative-experiences/index.html`

- [ ] **Step 1: Ajouter la carte slideshow après la carte app illustrée (ligne ~100)**

Lire le fichier `narrative-experiences/index.html`. Repérer la carte de l'app illustrée (autour de la ligne 92-100). Ajouter **après** elle, **avant** la carte rapport markdown :

```html
  <a href="20260505-narrative-experiences-slideshow.html" class="format">
    <div class="format-tag">Format · Slideshow narratif</div>
    <h2 class="format-title">Le <em>récit illustré</em></h2>
    <p class="format-sub">Onze scènes plein écran, animations progressives, modaux à la demande, navigation au clavier ou au clic. La même étude condensée en dix minutes — point d'entrée idéal avant la lecture longue.</p>
    <div class="format-cta">
      <span>Lecture · 10-12 min</span>
      <span class="arrow">Ouvrir →</span>
    </div>
  </a>
```

- [ ] **Step 2: Mettre à jour le bloc `.meta` (ligne ~84)**

Le bloc actuel contient les métadonnées de l'étude (8 sections, 7 schémas, ~50 régions cliquables, 19 sources, Étude). Modifier pour refléter que le hub présente maintenant **trois** formats. Soit ne pas y toucher (les métadonnées concernent l'étude, pas le hub) soit ajouter un pavé `Trois formats` :

```html
  <div class="meta">
    <span><strong>3</strong> formats</span>
    <span><strong>8</strong> sections</span>
    <span><strong>7</strong> schémas illustrés</span>
    <span><strong>~50</strong> régions cliquables</span>
    <span><strong>19</strong> sources</span>
    <span>Étude</span>
  </div>
```

(À discuter : peut-être préférable de laisser la `.meta` originale et d'ajouter `Trois formats` au seul `.colophon`. Choix à valider avec Mathieu pendant la review.)

- [ ] **Step 3: Reload `narrative-experiences/index.html` dans Chrome**

Vérifier : trois cartes visibles en cascade, ordre app illustrée → slideshow → rapport. Hover sur la nouvelle carte donne le shadow-lg comme les autres. Clic ouvre le slideshow. Le bouton retour de la topbar ramène vers `../index.html#series` correctement.

- [ ] **Step 4: Tester l'ensemble du parcours utilisateur**

Depuis l'accueil `index.html` à la racine → cliquer la tuile `narrative-experiences` → atterrir sur le hub → cliquer la carte slideshow → vivre le slideshow → CTA outro vers l'étude longue.

- [ ] **Step 5: Commit**

```bash
git add narrative-experiences/index.html
git commit -m "feat(narrative-experiences): troisième carte slideshow dans le hub"
```

---

### Task 20 : Validation finale contre les 10 critères d'acceptation

**Files:** aucune modification, juste tests

- [ ] **Step 1: Parcourir la checklist de la spec section 13**

Ouvrir `docs/superpowers/specs/2026-05-05-slideshow-narratif-design.md` section 13. Pour chaque critère 1 à 10, valider :

1. Les 7 SVG jouent leur chorégraphie sans bug.
2. Au moins une scène déclenche un `modalAuto` à mi-parcours.
3. Au moins deux régions cliquables déclenchent un modal manuel.
4. La timeline progresse correctement scène + étape (sous-segment).
5. Clic sur marqueur de timeline saute correctement.
6. Sommaire (S) et sources (R) overlays + référence `[12]` flash.
7. Zoom plein écran sur tous les SVG.
8. Mobile 375px : tap, swipe, toaster, zoom plus visible.
9. `prefers-reduced-motion` : utilisable en cut sec.
10. Carte slideshow présente dans le hub.

Pour chaque critère qui échoue, ouvrir une issue (commentaire) ou faire un fix-up commit.

- [ ] **Step 2: Lighthouse audit**

DevTools → Lighthouse → Mobile + Performance + Accessibility. Viser au moins 90 sur chaque axe. Identifier les warnings d'accessibilité (contraste, `aria-*` manquants) et corriger les plus graves.

- [ ] **Step 3: Vérifier le diff total avant proposition de PR**

```bash
git log --oneline main..HEAD
git diff main..HEAD --stat
```

Vérifier qu'aucun fichier inattendu (`.claude/`, `.obsidian/`, `.playwright-mcp/`) ne s'est faufilé dans les commits. Si oui, retirer (`git reset HEAD <file>` ou `git rm --cached <file>` selon le cas).

- [ ] **Step 4: Pause — attendre validation Mathieu**

Le CLAUDE.md du projet impose : *« Ne pas push automatiquement — attendre validation explicite »*. Demander à Mathieu :

> « Le slideshow est prêt sur la branche `<nom-branche>`. Tu veux que je le pousse pour ouvrir une PR via le MCP GitHub, ou tu préfères regarder le diff localement d'abord ? »

- [ ] **Step 5: (Si Mathieu valide) Push et PR via MCP GitHub**

```bash
git push -u origin <branch-name>
```

Puis utiliser `mcp__github__create_pull_request` avec :
- owner: `mathieugug`
- repo: `mathieugug.github.io`
- base: `main`
- head: `<branch-name>`
- title: « feat(narrative-experiences): slideshow narratif — troisième format du dossier »
- body : description courte renvoyant à `docs/superpowers/specs/2026-05-05-slideshow-narratif-design.md`

**Ne pas merger automatiquement.** Mathieu merge à la main.

---

## Self-review post-write

Après avoir écrit ce plan, j'ai relu la spec section par section pour vérifier la couverture :

- §1-2 spec (intention, exemple narrative-experiences) → couvert par Task 2 (table SCENES) + Task 16 (chorégraphies des 6 schémas restants).
- §3 spec (architecture fichier + hub) → Task 1 (squelette) + Task 19 (hub).
- §4 spec (modèle SCENES) → Task 2 (déclaratif) + Task 8 (vocabulaire dim/active/hidden).
- §5 spec (moteur, inputs, transitions) → Task 3 (moteur), Task 4 (inputs), Task 11 (transition).
- §6 spec (UI persistant) → Task 12 (timeline), Task 13 (sommaire), Task 14 (sources).
- §7 spec (mobile) → Task 17.
- §8 spec (outro) → Task 6.
- §9 spec (accessibilité) → Task 18.
- §10 spec (perf) → pas de tâche dédiée mais surveillé via Task 20 step 2 (Lighthouse).
- §11 spec (hors scope) → respecté implicitement.
- §12 spec (conventions site) → Task 1 (favicon, mark, palette, topbar) + Task 17 (mobile).
- §13 spec (critères d'acceptation) → Task 20.
- §14 spec (open questions) → résolution pendant l'implémentation, pas de tâche.

**Points de vigilance détectés pendant la review :**

- **Task 14 step 1** suppose qu'on peut extraire les 19 sources de l'app illustrée. Si la structure d'extraction est compliquée (ex : sources rendues côté JS depuis un autre tableau), l'estimation 2-5 min peut déraper. Si c'est le cas, accepter d'y passer 15-20 min ou utiliser le rapport markdown comme source alternative.
- **Task 16 step 2** demande d'inspecter chaque SVG et adapter les ids — c'est la tâche la plus longue du plan (~1-2h) parce qu'elle est créative (écrire des chorégraphies pertinentes). Bien la séquencer SVG par SVG avec un commit après chaque pour pouvoir bisect.
- **Task 9 step 6** introduit un listener `click` sur stage en *capture phase* qui doit s'exécuter avant le listener du Task 4. À tester avec attention : si le clic n'ouvre pas le modal, vérifier l'ordre des listeners.
- **Task 11 retreat()** ne réutilise pas `gotoScene()` parce que ce dernier reset à step 0 (or on veut le dernier step de la scène précédente). Le code dupliqué est volontaire — note pour le développeur dans le step.
