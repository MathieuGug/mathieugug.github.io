# Carte zoomable du playbook eval-agentique — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un second format au dossier `evaluation-agentique/` — une carte HTML/SVG zoomable à 3 niveaux discrets (overview/zone/leaf) qui place le playbook gruyère au centre et réutilise les 11 schémas existants comme leaves. Plus une lib partagée `/assets/canvas-zoom.{js,css}` et un poster A0 standalone dérivé.

**Architecture:** SVG vanilla avec animation `viewBox` via `requestAnimationFrame` + interpolation cubic-out + CSS opacity LOD. **7 leaves** thématiques positionnées autour du playbook central (4 phases au-dessus, 3 niveaux gruyère en-dessous), chacune groupant 2 cards parentes du playbook via `data-cards` CSV. Mobile sous 768 px → interstitiel qui redirige vers l'app linéaire existante. Poster en deux temps : extraction mécanique (script Python) puis habillage éditorial manuel.

**Tech Stack:** HTML5, SVG natif, JavaScript vanilla ES2020, CSS3 (variables + transitions), Python 3 pour la génération du poster, `node --test` pour les tests de contrat.

**Spec source:** [`docs/superpowers/specs/2026-05-20-eval-infinite-canvas-design.md`](../specs/2026-05-20-eval-infinite-canvas-design.md)

**Branche:** `claude/eval-infinite-canvas-2026-05-20`

---

## File Structure

### Files to create

```
assets/
├── canvas-zoom.js              (~250 lignes, IIFE auto-bootstrap, API publique window.canvasZoom)
└── canvas-zoom.css             (~100 lignes, LOD opacity + interstitiel mobile + canvas stage)

evaluation-agentique/
├── 20260520-evaluation-agentique-canvas.html   (~800 lignes, fichier principal)
├── 20260520-evaluation-agentique-poster-draft.svg  (généré, intermédiaire)
└── 20260520-evaluation-agentique-poster.svg    (final, manuel après habillage)

tests/
├── canvas-zoom-contract.test.mjs   (~80 lignes, tests de contrat de la lib)
└── fixtures/
    └── expected-canvas-fns.json    (liste des fonctions exportées par canvas-zoom.js)

tools/
└── extract_poster_svg.py       (~200 lignes, Python idempotent)
```

### Files to modify

```
evaluation-agentique/
└── index.html                  (ajout d'une carte format 2 entre rapport et admin md)

.github/workflows/test.yml      (ajout du nouveau test file si pas déjà couvert par le glob)
```

### Files NOT to modify (assumption)

- `assets/dossier-app.{js,css}` — la lib existante reste intacte
- `evaluation-agentique/20260501-…-app.html` — l'app existante reste intacte
- `evaluation-agentique/images/*.svg` — les schémas sources restent intacts
- Aucun autre dossier

---

## Phase A — Shared lib `/assets/canvas-zoom.{js,css}`

### Task A1: Initialiser les fixtures de test

**Files:**
- Create: `tests/fixtures/expected-canvas-fns.json`

- [ ] **Step 1: Créer le fichier fixture avec les fonctions publiques attendues**

Contenu de `tests/fixtures/expected-canvas-fns.json` :

```json
[
  "init",
  "parseViewBox",
  "viewBoxString",
  "setLevelState",
  "animateViewBox",
  "bboxFromTarget",
  "leafViewBox",
  "findLeafForCard",
  "openZone",
  "openLeaf",
  "reset",
  "setupClickHandlers",
  "setupKeyboardHandlers",
  "setupResetButton",
  "setupMobileInterstitial",
  "handlePopState",
  "restoreFromHash"
]
```

- [ ] **Step 2: Commit**

```bash
git add tests/fixtures/expected-canvas-fns.json
git commit -m "test(canvas-zoom): fixtures de fonctions attendues"
```

---

### Task A2: Écrire les tests de contrat (TDD : doivent échouer)

**Files:**
- Create: `tests/canvas-zoom-contract.test.mjs`

- [ ] **Step 1: Écrire le test runner avec les vérifications**

Contenu complet de `tests/canvas-zoom-contract.test.mjs` :

```javascript
import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const expectedFns = JSON.parse(
  readFileSync(join(ROOT, 'tests/fixtures/expected-canvas-fns.json'), 'utf8')
);

test('canvas-zoom.js parses as valid JS', () => {
  const js = readFileSync(join(ROOT, 'assets/canvas-zoom.js'), 'utf8');
  vm.compileFunction(js);
});

test('canvas-zoom.js contains all expected function definitions', () => {
  const js = readFileSync(join(ROOT, 'assets/canvas-zoom.js'), 'utf8');
  const missing = [];
  for (const fn of expectedFns) {
    if (!new RegExp(`function\\s+${fn}\\b`).test(js)) {
      missing.push(fn);
    }
  }
  assert.deepEqual(missing, [],
    `Missing functions in canvas-zoom.js: ${missing.join(', ')}`);
});

test('canvas-zoom.js exposes window.canvasZoom API', () => {
  const js = readFileSync(join(ROOT, 'assets/canvas-zoom.js'), 'utf8');
  assert.match(js, /window\.canvasZoom\s*=/,
    'canvas-zoom.js must expose window.canvasZoom');
  assert.match(js, /openLeaf/, 'window.canvasZoom.openLeaf required');
  assert.match(js, /reset/, 'window.canvasZoom.reset required');
  assert.match(js, /getLevel/, 'window.canvasZoom.getLevel required');
});

test('canvas-zoom.js auto-bootstraps on DOMContentLoaded', () => {
  const js = readFileSync(join(ROOT, 'assets/canvas-zoom.js'), 'utf8');
  assert.match(js, /DOMContentLoaded/,
    'canvas-zoom.js must auto-bootstrap on DOMContentLoaded');
});

test('canvas-zoom.css is non-empty and contains key selectors', () => {
  const css = readFileSync(join(ROOT, 'assets/canvas-zoom.css'), 'utf8');
  assert.ok(css.length > 500, 'canvas-zoom.css is suspiciously short');
  const expected = [
    'svg[data-canvas-zoom]',
    '.zoom-target',
    '[data-state="focused"]',
    '[data-state="dimmed"]',
    '.canvas-mobile-interstitial',
    '.canvas-stage',
  ];
  const missing = expected.filter((sel) => !css.includes(sel));
  assert.deepEqual(missing, [],
    `Missing selectors in canvas-zoom.css: ${missing.join(', ')}`);
});
```

- [ ] **Step 2: Run the tests, verify they fail**

```bash
node --test tests/canvas-zoom-contract.test.mjs
```

Expected output: All 5 tests FAIL with errors about missing files (`assets/canvas-zoom.js`, `assets/canvas-zoom.css`).

- [ ] **Step 3: Commit**

```bash
git add tests/canvas-zoom-contract.test.mjs
git commit -m "test(canvas-zoom): contract tests (failing, TDD)"
```

---

### Task A3: Écrire `canvas-zoom.css` minimal qui satisfait le contrat

**Files:**
- Create: `assets/canvas-zoom.css`

- [ ] **Step 1: Écrire le fichier CSS complet**

Contenu de `assets/canvas-zoom.css` :

```css
/* canvas-zoom.css — partagé pour les formats "carte zoomable"
 *
 * Source unique de vérité : ce fichier complète /assets/dossier-app.css
 * pour les pages qui utilisent <svg data-canvas-zoom> avec semantic zoom.
 *
 * Spec : docs/superpowers/specs/2026-05-20-eval-infinite-canvas-design.md
 */

/* ── Canvas stage ─────────────────────────────────────────── */

.canvas-stage {
  position: fixed;
  top: 56px;        /* sous la topbar fixed 56 px */
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg, #faf6ec);
  overflow: hidden;
}

svg[data-canvas-zoom] {
  width: 100%;
  height: 100%;
  display: block;
  background: transparent;
}

/* ── Zoom targets (leaves) ────────────────────────────────── */

svg[data-canvas-zoom] .zoom-target {
  opacity: 0.15;
  transition: opacity 400ms ease;
  cursor: pointer;
}

svg[data-canvas-zoom] .zoom-target[data-state="focused"] {
  opacity: 1;
}

svg[data-canvas-zoom] .zoom-target[data-state="dimmed"] {
  opacity: 0.05;
}

/* Connector lines that link a leaf to its parent step/cheese */
svg[data-canvas-zoom] .zoom-connector {
  stroke: currentColor;
  stroke-width: 1;
  opacity: 0.25;
  transition: opacity 400ms ease;
}

svg[data-canvas-zoom] .zoom-target[data-state="focused"] + .zoom-connector,
svg[data-canvas-zoom] .zoom-target[data-state="focused"] ~ .zoom-connector {
  opacity: 0.6;
}

/* ── Central playbook ─────────────────────────────────────── */

svg[data-canvas-zoom] #playbook-center {
  transition: opacity 400ms ease;
}

svg[data-canvas-zoom] #playbook-center[data-state="dimmed"] {
  opacity: 0.7;
}

svg[data-canvas-zoom] #playbook-center[data-state="dimmed-deep"] {
  opacity: 0.05;
}

/* ── Hover / focus visuals (desktop) ──────────────────────── */

@media (hover: hover) {
  svg[data-canvas-zoom] [data-card]:hover {
    filter: brightness(0.95);
  }

  svg[data-canvas-zoom] .zoom-target:hover {
    opacity: 0.4;
  }

  svg[data-canvas-zoom] .zoom-target[data-state="focused"]:hover {
    opacity: 1;
  }
}

svg[data-canvas-zoom] [data-card]:focus-visible,
svg[data-canvas-zoom] .zoom-target:focus-visible {
  outline: 2px dashed var(--accent, #b8582e);
  outline-offset: 2px;
}

/* ── Mobile interstitial (< 768 px) ──────────────────────── */

.canvas-mobile-interstitial {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: var(--bg, #faf6ec);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(20px, 6vw, 48px);
  text-align: center;
}

.canvas-mobile-interstitial[hidden] {
  display: none !important;
}

.canvas-mobile-interstitial h2 {
  font-family: 'Fraunces', serif;
  font-weight: 400;
  font-size: clamp(22px, 5vw, 32px);
  line-height: 1.2;
  margin: 0 0 16px;
}

.canvas-mobile-interstitial h2 em {
  font-style: italic;
  color: var(--accent, #b8582e);
}

.canvas-mobile-interstitial p {
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  color: var(--text-dim, #3b3f4d);
  margin: 0 0 32px;
  max-width: 540px;
  line-height: 1.55;
  font-size: 16px;
}

.canvas-mobile-interstitial .actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 360px;
}

.canvas-mobile-interstitial a,
.canvas-mobile-interstitial button {
  display: block;
  padding: 14px 22px;
  border-radius: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  border: 1px solid currentColor;
  background: transparent;
  color: var(--text, #1e1e2a);
  font-weight: 500;
}

.canvas-mobile-interstitial .actions a {
  background: var(--accent, #b8582e);
  color: white;
  border-color: var(--accent, #b8582e);
}

/* ── Topbar zoom controls ─────────────────────────────────── */

.zoom-control {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-mid, #6b6f7c);
  text-decoration: none;
  padding: 6px 10px;
  border: 1px solid var(--line, rgba(30,30,44,0.08));
  border-radius: 3px;
  background: transparent;
  cursor: pointer;
}

.zoom-control:hover {
  color: var(--accent, #b8582e);
  border-color: var(--accent, #b8582e);
}

.zoom-control[hidden] {
  display: none !important;
}

/* ── Accessibility: screen reader announcements ───────────── */

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/canvas-zoom.css
git commit -m "feat(canvas-zoom): shared CSS for semantic zoom canvas"
```

---

### Task A4: Écrire le squelette de `canvas-zoom.js` (IIFE + init + parsers)

**Files:**
- Create: `assets/canvas-zoom.js`

- [ ] **Step 1: Créer le fichier avec l'IIFE, l'init, les helpers parseViewBox/viewBoxString**

Contenu initial de `assets/canvas-zoom.js` :

```javascript
/* canvas-zoom — shared runtime for "carte zoomable" pages
 *
 * Source unique de vérité : ce fichier équipe les pages qui ont un
 * <svg data-canvas-zoom> avec un semantic zoom à 3 niveaux discrets
 * (overview / zone / leaf). Lit data-attrs sur les .zoom-target.
 *
 * Aucune dépendance. Auto-bootstrap sur DOMContentLoaded.
 *
 * Spec : docs/superpowers/specs/2026-05-20-eval-infinite-canvas-design.md
 */
(function () {
  'use strict';

  // ─── Constants ────────────────────────────────────────────
  const DURATION_MS = 600;
  // ease-out cubic, approximates cubic-bezier(0.22, 1, 0.36, 1)
  const easing = (t) => 1 - Math.pow(1 - t, 3);

  // ─── State ────────────────────────────────────────────────
  let canvas = null;
  let targets = [];
  let rootViewBox = null;
  let currentAnim = null;
  const state = { level: 0, node: null };

  // ─── Helpers ──────────────────────────────────────────────

  function parseViewBox(s) {
    const [x, y, w, h] = s.split(/\s+/).map(Number);
    return { x, y, w, h };
  }

  function viewBoxString(vb) {
    return `${vb.x} ${vb.y} ${vb.w} ${vb.h}`;
  }

  // ─── Bootstrap ────────────────────────────────────────────

  function init() {
    canvas = document.querySelector('svg[data-canvas-zoom]');
    if (!canvas) return;

    rootViewBox = parseViewBox(canvas.getAttribute('viewBox'));
    targets = Array.from(canvas.querySelectorAll('.zoom-target'));

    setupClickHandlers();
    setupKeyboardHandlers();
    setupResetButton();
    setupMobileInterstitial();
    window.addEventListener('popstate', handlePopState);

    if (location.hash) restoreFromHash(location.hash.slice(1));

    window.canvasZoom = {
      openLeaf,
      reset,
      getLevel: function () { return state.level; },
    };
  }

  // Stubs — implémentations dans les tasks suivantes
  function setLevelState(level, node) { /* Task A5 */ }
  function animateViewBox(targetVB) { /* Task A6 */ }
  function bboxFromTarget(node) { /* Task A7 */ return null; }
  function leafViewBox(node) { /* Task A7 */ return null; }
  function findLeafForCard(cardId) { /* Task A7b */ return null; }
  function openZone(node) { /* Task A8 */ }
  function openLeaf(node) { /* Task A8 */ }
  function reset() { /* Task A8 */ }
  function setupClickHandlers() { /* Task A9 */ }
  function setupKeyboardHandlers() { /* Task A10 */ }
  function setupResetButton() { /* Task A11 */ }
  function setupMobileInterstitial() { /* Task A11 */ }
  function handlePopState(e) { /* Task A12 */ }
  function restoreFromHash(hash) { /* Task A12 */ }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

- [ ] **Step 2: Run contract tests, verify partial pass**

```bash
node --test tests/canvas-zoom-contract.test.mjs
```

Expected: tests for `parses as valid JS`, `all expected function definitions` (toutes les stubs sont là), `exposes window.canvasZoom API`, `auto-bootstraps on DOMContentLoaded`, `css contains key selectors` should all PASS.

- [ ] **Step 3: Commit**

```bash
git add assets/canvas-zoom.js
git commit -m "feat(canvas-zoom): IIFE skeleton + init + parsers"
```

---

### Task A5: Implémenter `setLevelState` (LOD via data-state attrs)

**Files:**
- Modify: `assets/canvas-zoom.js` — remplacer le stub `setLevelState`

- [ ] **Step 1: Remplacer le stub par l'implémentation**

Remplacer dans `assets/canvas-zoom.js` :

```javascript
  function setLevelState(level, node) { /* Task A5 */ }
```

par :

```javascript
  function setLevelState(level, node) {
    state.level = level;
    state.node = node;

    targets.forEach(function (t) {
      const tn = t.dataset.node;
      if (level === 0) {
        t.removeAttribute('data-state');
      } else if (level === 1) {
        if (tn === node) t.dataset.state = 'focused';
        else t.removeAttribute('data-state');
      } else if (level === 2) {
        if (tn === node) t.dataset.state = 'focused';
        else t.dataset.state = 'dimmed';
      }
    });

    const center = canvas.querySelector('#playbook-center');
    if (center) {
      if (level === 0) center.removeAttribute('data-state');
      else if (level === 1) center.dataset.state = 'dimmed';
      else if (level === 2) center.dataset.state = 'dimmed-deep';
    }

    announce(level, node);
  }

  function announce(level, node) {
    const live = document.querySelector('[data-zoom-live]');
    if (!live) return;
    if (level === 0) live.textContent = "Vue d'ensemble";
    else if (level === 1) live.textContent = 'Niveau zone — ' + (node || '');
    else if (level === 2) live.textContent = 'Détails — ' + (node || '');
  }
```

- [ ] **Step 2: Commit**

```bash
git add assets/canvas-zoom.js
git commit -m "feat(canvas-zoom): setLevelState + aria-live announce"
```

---

### Task A6: Implémenter `animateViewBox` (RAF + interpolation)

**Files:**
- Modify: `assets/canvas-zoom.js` — remplacer le stub `animateViewBox`

- [ ] **Step 1: Remplacer le stub**

Remplacer :

```javascript
  function animateViewBox(targetVB) { /* Task A6 */ }
```

par :

```javascript
  function animateViewBox(targetVB) {
    if (currentAnim) cancelAnimationFrame(currentAnim);
    const startVB = parseViewBox(canvas.getAttribute('viewBox'));
    const startTime = performance.now();

    function frame(now) {
      const t = Math.min(1, (now - startTime) / DURATION_MS);
      const e = easing(t);
      const vb = {
        x: startVB.x + (targetVB.x - startVB.x) * e,
        y: startVB.y + (targetVB.y - startVB.y) * e,
        w: startVB.w + (targetVB.w - startVB.w) * e,
        h: startVB.h + (targetVB.h - startVB.h) * e,
      };
      canvas.setAttribute('viewBox', viewBoxString(vb));
      if (t < 1) {
        currentAnim = requestAnimationFrame(frame);
      } else {
        currentAnim = null;
      }
    }

    currentAnim = requestAnimationFrame(frame);
  }
```

- [ ] **Step 2: Commit**

```bash
git add assets/canvas-zoom.js
git commit -m "feat(canvas-zoom): animateViewBox via RAF + cubic-out easing"
```

---

### Task A7: Implémenter `bboxFromTarget`, `leafViewBox`, `findLeafForCard`

**Files:**
- Modify: `assets/canvas-zoom.js` — remplacer les trois stubs

- [ ] **Step 1: Remplacer les stubs**

Remplacer :

```javascript
  function bboxFromTarget(node) { /* Task A7 */ return null; }
  function leafViewBox(node) { /* Task A7 */ return null; }
  function findLeafForCard(cardId) { /* Task A7b */ return null; }
```

par :

```javascript
  function bboxFromTarget(node) {
    const target = targets.find(function (t) { return t.dataset.node === node; });
    if (!target) return null;
    const parts = target.dataset.parentBbox.split(',').map(Number);
    if (parts.length !== 4) return null;
    const [px, py, pw, ph] = parts;
    const leaf = target.dataset.leafViewbox.split(/\s+/).map(Number);
    if (leaf.length !== 4) return null;
    const [lx, ly, lw, lh] = leaf;
    // Zone-level viewBox: union of parent + leaf bbox + 200/100 px margin
    const x = Math.min(px, lx) - 200;
    const y = Math.min(py, ly) - 100;
    const w = Math.max(px + pw, lx + lw) - x + 200;
    const h = Math.max(py + ph, ly + lh) - y + 100;
    return { x, y, w, h };
  }

  function leafViewBox(node) {
    const target = targets.find(function (t) { return t.dataset.node === node; });
    if (!target) return null;
    const parts = target.dataset.leafViewbox.split(/\s+/).map(Number);
    if (parts.length !== 4) return null;
    return { x: parts[0], y: parts[1], w: parts[2], h: parts[3] };
  }

  // Card → leaf resolution : un data-card="step-3" trouve la leaf qui
  // a "step-3" dans son attribut data-cards. Permet le grouping de cards.
  function findLeafForCard(cardId) {
    return targets.find(function (t) {
      const cards = (t.dataset.cards || '').split(',').map(function (s) { return s.trim(); });
      return cards.indexOf(cardId) !== -1;
    });
  }
```

- [ ] **Step 2: Commit**

```bash
git add assets/canvas-zoom.js
git commit -m "feat(canvas-zoom): bboxFromTarget + leafViewBox + findLeafForCard"
```

---

### Task A8: Implémenter `openZone`, `openLeaf`, `reset` (transitions + history)

**Files:**
- Modify: `assets/canvas-zoom.js`

- [ ] **Step 1: Remplacer les trois stubs**

Remplacer :

```javascript
  function openZone(node) { /* Task A8 */ }
  function openLeaf(node) { /* Task A8 */ }
  function reset() { /* Task A8 */ }
```

par :

```javascript
  function openZone(node) {
    const vb = bboxFromTarget(node);
    if (!vb) return;
    setLevelState(1, node);
    animateViewBox(vb);
    history.pushState({ level: 1, node: node }, '', '#zone-' + node);
  }

  function openLeaf(node) {
    const vb = leafViewBox(node);
    if (!vb) return;
    setLevelState(2, node);
    animateViewBox(vb);
    history.pushState({ level: 2, node: node }, '', '#' + node);
  }

  function reset() {
    setLevelState(0, null);
    animateViewBox(rootViewBox);
    history.pushState({ level: 0 }, '', location.pathname + location.search);
  }
```

- [ ] **Step 2: Commit**

```bash
git add assets/canvas-zoom.js
git commit -m "feat(canvas-zoom): openZone/openLeaf/reset + history.pushState"
```

---

### Task A9: Implémenter `setupClickHandlers`

**Files:**
- Modify: `assets/canvas-zoom.js`

- [ ] **Step 1: Remplacer le stub**

Remplacer :

```javascript
  function setupClickHandlers() { /* Task A9 */ }
```

par :

```javascript
  function setupClickHandlers() {
    canvas.addEventListener('click', function (e) {
      // Click on a step/cheese box (data-card) in central playbook
      // → résoudre via findLeafForCard puis ouvrir la leaf qui le couvre
      const card = e.target.closest('[data-card]');
      if (card && state.level === 0) {
        const leaf = findLeafForCard(card.dataset.card);
        if (leaf) {
          openZone(leaf.dataset.node);
          e.preventDefault();
        }
        return;
      }

      // Click on the focused leaf to drill down to level 2
      const leafG = e.target.closest('.zoom-target');
      if (leafG && state.level === 1 && leafG.dataset.node === state.node) {
        openLeaf(state.node);
        e.preventDefault();
        return;
      }

      // Click on canvas background → go up one level
      const bg = e.target.closest('[data-canvas-background]');
      if (bg) {
        if (state.level === 2) openZone(state.node);
        else if (state.level === 1) reset();
      }
    });
  }
```

Notes d'implémentation :
- Le canvas HTML doit avoir un `<rect data-canvas-background>` plein viewBox dès la Task B2 — sinon le click-on-background ne déclenchera rien.
- Le pattern card → leaf via `data-cards` CSV permet de grouper plusieurs cards dans une même leaf (e.g. step-2 et step-3 ouvrent tous les deux la leaf L2). La lib reste agnostique au schéma de regroupement — c'est la page qui définit ses `data-cards`.

- [ ] **Step 2: Commit**

```bash
git add assets/canvas-zoom.js
git commit -m "feat(canvas-zoom): setupClickHandlers (card → zone, leaf → leaf, bg → up)"
```

---

### Task A10: Implémenter `setupKeyboardHandlers`

**Files:**
- Modify: `assets/canvas-zoom.js`

- [ ] **Step 1: Remplacer le stub**

Remplacer :

```javascript
  function setupKeyboardHandlers() { /* Task A10 */ }
```

par :

```javascript
  function setupKeyboardHandlers() {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (state.level === 2) {
          openZone(state.node);
          e.preventDefault();
        } else if (state.level === 1) {
          reset();
          e.preventDefault();
        }
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        if (state.level === 0) return;
        const order = targets.map(function (t) { return t.dataset.node; });
        const idx = order.indexOf(state.node);
        if (idx === -1) return;
        const step = e.key === 'ArrowRight' ? 1 : -1;
        const nextIdx = (idx + step + order.length) % order.length;
        const nextNode = order[nextIdx];
        if (state.level === 1) openZone(nextNode);
        else if (state.level === 2) openLeaf(nextNode);
        e.preventDefault();
      }
    });
  }
```

- [ ] **Step 2: Commit**

```bash
git add assets/canvas-zoom.js
git commit -m "feat(canvas-zoom): keyboard nav (Escape + Left/Right siblings)"
```

---

### Task A11: Implémenter `setupResetButton` + `setupMobileInterstitial`

**Files:**
- Modify: `assets/canvas-zoom.js`

- [ ] **Step 1: Remplacer les deux stubs**

Remplacer :

```javascript
  function setupResetButton() { /* Task A11 */ }
  function setupMobileInterstitial() { /* Task A11 */ }
```

par :

```javascript
  function setupResetButton() {
    const btn = document.querySelector('[data-canvas-zoom-reset]');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      reset();
    });

    // Show/hide reset button based on current level
    function syncButtonVisibility() {
      btn.hidden = state.level === 0;
    }
    syncButtonVisibility();
    // Re-sync after each transition
    const originalSetLevelState = setLevelState;
    // (we can't override module-private; trigger via MutationObserver on canvas state instead)
    new MutationObserver(syncButtonVisibility).observe(
      canvas.querySelector('#playbook-center') || canvas,
      { attributes: true, attributeFilter: ['data-state'] }
    );
  }

  function setupMobileInterstitial() {
    const interstitial = document.querySelector('[data-mobile-interstitial]');
    if (!interstitial) return;

    const mq = window.matchMedia('(max-width: 768px)');

    function update() {
      // Only re-show interstitial if it was never dismissed by user
      if (interstitial.dataset.dismissed === 'true') return;
      interstitial.hidden = !mq.matches;
    }

    update();

    if (mq.addEventListener) mq.addEventListener('change', update);
    else mq.addListener(update); // Safari fallback

    const dismiss = interstitial.querySelector('[data-dismiss]');
    if (dismiss) {
      dismiss.addEventListener('click', function () {
        interstitial.hidden = true;
        interstitial.dataset.dismissed = 'true';
      });
    }
  }
```

- [ ] **Step 2: Commit**

```bash
git add assets/canvas-zoom.js
git commit -m "feat(canvas-zoom): reset button visibility + mobile interstitial dismiss"
```

---

### Task A12: Implémenter `handlePopState` + `restoreFromHash`

**Files:**
- Modify: `assets/canvas-zoom.js`

- [ ] **Step 1: Remplacer les deux stubs**

Remplacer :

```javascript
  function handlePopState(e) { /* Task A12 */ }
  function restoreFromHash(hash) { /* Task A12 */ }
```

par :

```javascript
  function handlePopState(e) {
    const s = e.state || { level: 0 };
    if (s.level === 0) {
      setLevelState(0, null);
      animateViewBox(rootViewBox);
    } else if (s.level === 1) {
      const vb = bboxFromTarget(s.node);
      if (vb) {
        setLevelState(1, s.node);
        animateViewBox(vb);
      }
    } else if (s.level === 2) {
      const vb = leafViewBox(s.node);
      if (vb) {
        setLevelState(2, s.node);
        animateViewBox(vb);
      }
    }
  }

  function restoreFromHash(hash) {
    if (!hash) return;
    if (hash.indexOf('zone-') === 0) {
      const node = hash.slice(5);
      const vb = bboxFromTarget(node);
      if (vb) {
        setLevelState(1, node);
        canvas.setAttribute('viewBox', viewBoxString(vb));
      }
      return;
    }
    // Try direct leaf id first
    let vb = leafViewBox(hash);
    let node = hash;
    if (!vb) {
      // Backward-compat : #step-3 → resolve to its parent leaf (L2)
      const leaf = findLeafForCard(hash);
      if (leaf) {
        vb = leafViewBox(leaf.dataset.node);
        node = leaf.dataset.node;
      }
    }
    if (vb) {
      setLevelState(2, node);
      canvas.setAttribute('viewBox', viewBoxString(vb));
    }
  }
```

- [ ] **Step 2: Run all contract tests**

```bash
node --test tests/canvas-zoom-contract.test.mjs
```

Expected: All 5 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add assets/canvas-zoom.js
git commit -m "feat(canvas-zoom): popstate + restoreFromHash (deep-link support)"
```

---

## Phase B — Canvas HTML `evaluation-agentique/20260520-evaluation-agentique-canvas.html`

### Task B1: Scaffold du fichier canvas HTML

**Files:**
- Create: `evaluation-agentique/20260520-evaluation-agentique-canvas.html`

- [ ] **Step 1: Créer le squelette HTML**

Contenu initial :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#faf6ec">
<title>Évaluer un agent — carte zoomable</title>
<meta name="description" content="Carte zoomable du playbook 8 étapes et du modèle gruyère pour évaluer un agent IA. 14 zooms sur graders, observabilité, frameworks et coûts — par Mathieu Guglielmino.">
<!-- og:start -->
<!-- og:end -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400;500&family=Caveat:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/dossier-app.css">
<link rel="stylesheet" href="/assets/canvas-zoom.css">
<style>
:root {
  --bg: #faf6ec;
  --paper: #FAF8F3;
  --paper-2: #f3eedf;
  --ink: #1a1a1a;
  --text: #1e1e2a;
  --text-dim: #3b3f4d;
  --text-mid: #6b6f7c;
  --line: rgba(30,30,44,0.08);
  --accent: #b8582e;
  --carmine: #B7332C;
  --teal: #1F5560;
  --mono: 'JetBrains Mono', monospace;
  --serif: 'Fraunces', serif;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  overflow-x: clip;
  height: 100%;
}
body { display: flex; flex-direction: column; }
</style>
</head>
<body>

<!-- Topbar 3-items + zoom controls (Task B6) -->

<main class="canvas-stage">
  <svg id="canvas" data-canvas-zoom viewBox="0 0 5000 3500"
       xmlns="http://www.w3.org/2000/svg"
       aria-label="Carte zoomable du playbook d'évaluation agentique"
       preserveAspectRatio="xMidYMid meet">
    <!-- Background catcher (Task B2 will add this) -->
    <!-- Central playbook (Task B2) -->
    <!-- 7 leaves (Tasks B3-B5) -->
  </svg>

  <!-- Caveat annotation overlay (Task B7) -->
</main>

<!-- Mobile interstitial (Task B8) -->

<!-- Aria-live region for zoom announcements -->
<div class="sr-only" aria-live="polite" data-zoom-live></div>

<script src="/assets/dossier-app.js" defer></script>
<script src="/assets/canvas-zoom.js" defer></script>
<script src="/admin.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Verify the file opens in a browser without errors**

```bash
# Optional sanity check
python -c "import xml.etree.ElementTree as ET; ET.fromstring(open('evaluation-agentique/20260520-evaluation-agentique-canvas.html').read().split('<svg')[1].split('</svg>')[0].join(['<svg','</svg>']))" 2>&1 || echo "Pas un XML strict, OK pour HTML"
```

Pas de test strict — l'HTML n'a pas à être XML valide.

- [ ] **Step 3: Commit**

```bash
git add evaluation-agentique/20260520-evaluation-agentique-canvas.html
git commit -m "feat(eval/canvas): scaffold HTML skeleton + lib includes"
```

---

### Task B2: Inliner le playbook central + background catcher

**Files:**
- Modify: `evaluation-agentique/20260520-evaluation-agentique-canvas.html` — insérer le SVG playbook dans le canvas

- [ ] **Step 1: Lire le SVG playbook source pour copier son contenu**

```bash
# Pour référence (ne pas commit cette commande)
cat evaluation-agentique/images/20260501-10-playbook-gruyere.svg
```

- [ ] **Step 2: Remplacer la zone `<!-- Central playbook -->` dans le canvas HTML**

Dans `<svg id="canvas">`, remplacer :

```html
    <!-- Background catcher (Task B2 will add this) -->
    <!-- Central playbook (Task B2) -->
```

par :

```html
    <!-- Background catcher — pour clic "remonter d'un niveau" -->
    <rect data-canvas-background x="0" y="0" width="5000" height="3500" fill="var(--bg)" />

    <!-- defs partagés -->
    <defs>
      <marker id="arrow-canvas" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#5A5A5A"/>
      </marker>
    </defs>

    <!-- Central playbook — translate au centre du canvas A0 -->
    <g id="playbook-center" transform="translate(1900, 1350)">
      <!-- Le SVG 20260501-10-playbook-gruyere.svg copié ici sans son <svg> wrapper -->
      <!-- ATTENTION : enlever la balise <svg viewBox=...> d'entrée et </svg> de fin -->
      <!-- Garder <defs>, <style>, <rect>, <text>, <g class="interactive"> et <line> -->
      <!-- IMPORTANT : renommer marker id="arrow10" en "arrow-canvas-playbook" pour éviter collision -->

      <!-- (Coller ici le contenu interne du SVG playbook source, avec les ajustements ci-dessus) -->
    </g>
```

**Détail du copier-coller** :
1. Ouvrir `evaluation-agentique/images/20260501-10-playbook-gruyere.svg`
2. Sélectionner tout entre `<svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">` et `</svg>` (exclusif des deux tags)
3. Coller dans le `<g id="playbook-center" transform="translate(1900, 1350)">`
4. Dans le contenu collé : renommer `id="arrow10"` → `id="arrow-playbook"` ET remplacer toutes les occurrences `url(#arrow10)` → `url(#arrow-playbook)`
5. Le `<style>` interne du playbook reste tel quel (selectors `.display`, `.body`, `.mono`, `.interactive` — namespacés par le `<g>` ne posent pas problème)
6. Le `<rect width="1200" height="800" fill="#FAF8F3"/>` de fond du playbook peut rester — il dessine le fond du playbook, pas du canvas

- [ ] **Step 3: Vérifier que le HTML s'ouvre et que le playbook s'affiche dans le quart central du canvas**

Ouvrir le fichier dans le navigateur :
```bash
start evaluation-agentique/20260520-evaluation-agentique-canvas.html
```

Expected : le playbook gruyère s'affiche, occupant ~25% de la largeur écran centré (parce que le viewBox 5000×3500 est mappé sur 100% de la viewport et le playbook est 1200×800 dedans).

- [ ] **Step 4: Commit**

```bash
git add evaluation-agentique/20260520-evaluation-agentique-canvas.html
git commit -m "feat(eval/canvas): inline central playbook + background catcher"
```

---

### Task B3: Documenter le layout des 7 leaves dans le canvas HTML

**Files:**
- Modify: `evaluation-agentique/20260520-evaluation-agentique-canvas.html` (commentaire)

**Layout calculé pour viewBox 5000×3500 :**

Playbook source : 1200×800 local, translaté à (1900, 1350) → occupe x=1900..3100, y=1350..2150 en canvas root.

**Step boxes dans le canvas root** (rappel) :
- step-0 à step-7 : largeur 120, hauteur 100, espacement 20 → x= 1980, 2120, 2260, 2400, 2540, 2680, 2820, 2960 ; y=1550..1650

**Cheese layers dans le canvas root** :
- cheese-1 à cheese-6 : largeur 900 (local 100..1000), hauteur 38, espacement 50 → x=2000, w=900 ; y=1745, 1795, 1845, 1895, 1945, 1995

**Layout des 7 leaves** :

| Leaf | Cards groupées | parent-bbox (union x,y,w,h) | leaf x,y,w,h | Couleur frame |
|---|---|---|---|---|
| **L1** | step-0+step-1 | `1980,1550,260,100` | `200 200 1000 900` | `var(--teal) #1F5560` |
| **L2** | step-2+step-3 | `2260,1550,260,100` | `1400 200 1000 900` | `var(--accent) #B58A2C` |
| **L3** | step-4+step-5 | `2540,1550,260,100` | `2600 200 1000 900` | `var(--accent) #B58A2C` |
| **L4** | step-6+step-7 | `2820,1550,260,100` | `3800 200 1000 900` | `var(--carmine) #B7332C` |
| **L5** | cheese-1+cheese-2 | `2000,1745,900,88` | `200 2300 1500 900` | `var(--teal) #1F5560` |
| **L6** | cheese-3+cheese-4 | `2000,1845,900,88` | `1750 2300 1500 900` | `var(--accent) #B58A2C` |
| **L7** | cheese-5+cheese-6 | `2000,1945,900,88` | `3300 2300 1500 900` | `var(--carmine) #B7332C` |

**Connector lines** : 2 lignes par leaf (1 par card parente). Pour les phase leaves (L1-L4), origine = milieu-bas de la leaf (leaf_x + leaf_w/2, leaf_y + leaf_h = leaf_y + 900 = 1100), destination = milieu-haut de chaque step parent (step_cx, 1550). Pour les cheese leaves (L5-L7), origine = milieu-haut de la leaf (leaf_y = 2300), destination = milieu-bas de chaque cheese parent (cheese_x + cheese_w/2 = 2450, cheese_y + 38).

- [ ] **Step 1: Ajouter le bloc layout comme commentaire HTML**

Dans `evaluation-agentique/20260520-evaluation-agentique-canvas.html`, juste avant `<!-- 7 leaves (Tasks B3-B5) -->` (qui doit avoir été laissé comme placeholder à la Task B1), remplacer ce commentaire par :

```html
    <!-- ┌─── LAYOUT DES 7 LEAVES (Task B3) ─────────────────────────────┐
         │ Playbook center : translate(1900, 1350), 1200×800             │
         │                                                               │
         │ Phase leaves (au-dessus, y=200..1100) :                       │
         │   L1 step-0+step-1   parent 1980,1550,260,100   leaf 200,200,1000,900   teal     │
         │   L2 step-2+step-3   parent 2260,1550,260,100   leaf 1400,200,1000,900  ocre     │
         │   L3 step-4+step-5   parent 2540,1550,260,100   leaf 2600,200,1000,900  ocre     │
         │   L4 step-6+step-7   parent 2820,1550,260,100   leaf 3800,200,1000,900  carmine  │
         │                                                               │
         │ Niveau gruyère leaves (en-dessous, y=2300..3200) :            │
         │   L5 cheese-1+cheese-2  parent 2000,1745,900,88  leaf 200,2300,1500,900  teal    │
         │   L6 cheese-3+cheese-4  parent 2000,1845,900,88  leaf 1750,2300,1500,900 ocre    │
         │   L7 cheese-5+cheese-6  parent 2000,1945,900,88  leaf 3300,2300,1500,900 carmine │
         └───────────────────────────────────────────────────────────────┘
    -->
```

- [ ] **Step 2: Commit**

```bash
git add evaluation-agentique/20260520-evaluation-agentique-canvas.html
git commit -m "docs(eval/canvas): 7-leaf layout coordinates documented"
```

---

### Task B4: Ajouter les 4 phase leaves (L1-L4) au-dessus du playbook

**Files:**
- Modify: `evaluation-agentique/20260520-evaluation-agentique-canvas.html`

**Pattern d'une leaf phase** (gabarit à instancier 4 fois) :

```html
<g class="zoom-target"
   data-node="L{N}"
   data-cards="{card-1},{card-2}"
   data-parent-bbox="{x},{y},{w},{h}"
   data-leaf-viewbox="{lx} {ly} {lw} {lh}"
   tabindex="0"
   role="button"
   aria-label="Zoom — {phase-label}">
  <!-- 2 connectors (1 par card parente) -->
  <line x1="{leaf_cx}" y1="{leaf_y+lh}" x2="{card1_cx}" y2="{card1_top}" class="zoom-connector"/>
  <line x1="{leaf_cx}" y1="{leaf_y+lh}" x2="{card2_cx}" y2="{card2_top}" class="zoom-connector"/>

  <!-- Leaf frame -->
  <rect x="{lx}" y="{ly}" width="{lw}" height="{lh}" rx="8"
        fill="var(--paper)" stroke="{frame-color}" stroke-width="3"/>

  <!-- Leaf marker (L{N} cercle haut-droite) -->
  <g>
    <circle cx="{lx+lw-30}" cy="{ly+30}" r="22" fill="{frame-color}"/>
    <text x="{lx+lw-30}" y="{ly+37}" text-anchor="middle"
          class="mono" font-size="18" font-weight="600" fill="var(--paper)">L{N}</text>
  </g>

  <!-- Header (eyebrow + titre) -->
  <text x="{lx+30}" y="{ly+50}" class="mono" font-size="14"
        fill="{frame-color}" letter-spacing="0.1em">{eyebrow}</text>
  <text x="{lx+30}" y="{ly+95}" class="display" font-family="Fraunces, serif"
        font-size="28" font-weight="500" fill="var(--ink)">{titre}</text>

  <!-- Sub-card labels (S{N1} et S{N2}) -->
  <text x="{lx+30}" y="{ly+135}" class="mono" font-size="11"
        fill="var(--text-mid)" letter-spacing="0.08em">S{N1} · {label-1}</text>
  <text x="{lx+30}" y="{ly+155}" class="mono" font-size="11"
        fill="var(--text-mid)" letter-spacing="0.08em">S{N2} · {label-2}</text>

  <!-- Schémas inlinés (2 schémas côte à côte ou empilés) -->
  <g class="leaf-schemas" transform="translate({lx+30}, {ly+180})">
    <!-- Schema 1 : translate(0, 0) scale(adapté) — contenu SVG inline avec ids préfixés L{N}A- -->
    <!-- Schema 2 : translate(adapté) scale(adapté) — contenu SVG inline avec ids préfixés L{N}B- -->
  </g>
</g>
```

**Détails par leaf** :

| Leaf | data-cards | parent-bbox | leaf | eyebrow | titre | label-1 | label-2 | Schémas inline |
|---|---|---|---|---|---|---|---|---|
| L1 | `step-0,step-1` | `1980,1550,260,100` | `200 200 1000 900` | `PHASE 1 · COLLECTE TASKS` | Anatomie & sources de tasks | S0 · Démarrer tôt — 20-50 tasks | S1 · Manuel d'abord — checks pre-release | 02-anatomie-evaluation (panorama complet, scale 0.7) |
| L2 | `step-2,step-3` | `2260,1550,260,100` | `1400 200 1000 900` | `PHASE 2A · CADRER LES CAS` | Pass@k & formula TestCase | S2 · Non ambiguïté — 2 experts pass/fail | S3 · Équilibre — should vs shouldn't trigger | 04-pyramide-metriques (scale 0.4) + 06bis-testcase-formula (scale 0.4) |
| L3 | `step-4,step-5` | `2540,1550,260,100` | `2600 200 1000 900` | `PHASE 2B · HARNESS & GRADERS` | Observabilité & graders | S4 · Harness stable — isolation par trial | S5 · Graders — det > LAJ > humain | 07-observabilite-rca (scale 0.35) + 03-taxonomie-graders (scale 0.3) + 05-llm-as-judge (scale 0.3) — 3 schémas empilés |
| L4 | `step-6,step-7` | `2820,1550,260,100` | `3800 200 1000 900` | `PHASE 3 · MAINTENANCE` | Transcripts & évolution | S6 · Lire transcripts — vraie skill | S7 · Saturation — capability → régression | 07-observabilite-rca (focus trace, clipPath, scale 0.5) + 01-evolution-paradigmes (scale 0.4) |

**Couleurs frame** : L1 → `#1F5560` (teal) ; L2 et L3 → `#B58A2C` (ocre) ; L4 → `#B7332C` (carmine).

**Connector cx/cy** :
- L1 : leaf_cx=700, leaf_bottom=1100 ; step-0 cx=2040, top=1550 ; step-1 cx=2180, top=1550
- L2 : leaf_cx=1900, leaf_bottom=1100 ; step-2 cx=2320, top=1550 ; step-3 cx=2460, top=1550
- L3 : leaf_cx=3100, leaf_bottom=1100 ; step-4 cx=2600, top=1550 ; step-5 cx=2740, top=1550
- L4 : leaf_cx=4300, leaf_bottom=1100 ; step-6 cx=2880, top=1550 ; step-7 cx=3020, top=1550

- [ ] **Step 1: Insérer L1 (step-0 + step-1) avec son schéma 02-anatomie-evaluation inliné**

Dans le canvas HTML, à l'emplacement du commentaire `<!-- ── STEP LEAVES … ──>` (ou s'il n'existe pas, juste après le bloc layout doc de B3), insérer :

```html
    <!-- ── PHASE LEAVES (4) ──────────────────────────────────────── -->

    <g class="zoom-target"
       data-node="L1"
       data-cards="step-0,step-1"
       data-parent-bbox="1980,1550,260,100"
       data-leaf-viewbox="200 200 1000 900"
       tabindex="0"
       role="button"
       aria-label="Zoom — Phase 1, collecte tasks">
      <line x1="700" y1="1100" x2="2040" y2="1550" class="zoom-connector"/>
      <line x1="700" y1="1100" x2="2180" y2="1550" class="zoom-connector"/>
      <rect x="200" y="200" width="1000" height="900" rx="8"
            fill="var(--paper)" stroke="#1F5560" stroke-width="3"/>
      <g>
        <circle cx="1170" cy="230" r="22" fill="#1F5560"/>
        <text x="1170" y="237" text-anchor="middle" class="mono"
              font-size="18" font-weight="600" fill="var(--paper)">L1</text>
      </g>
      <text x="230" y="250" class="mono" font-size="14"
            fill="#1F5560" letter-spacing="0.1em">PHASE 1 · COLLECTE TASKS</text>
      <text x="230" y="295" class="display" font-family="Fraunces, serif"
            font-size="28" font-weight="500" fill="var(--ink)">Anatomie &amp; sources de tasks</text>
      <text x="230" y="335" class="mono" font-size="11"
            fill="var(--text-mid)" letter-spacing="0.08em">S0 · DÉMARRER TÔT — 20-50 tasks, règle 80/20</text>
      <text x="230" y="355" class="mono" font-size="11"
            fill="var(--text-mid)" letter-spacing="0.08em">S1 · MANUEL D'ABORD — checks pre-release, bugs, support</text>

      <!-- Schémas inlinés -->
      <g class="leaf-schemas" transform="translate(230, 380)">
        <!-- Schema 02-anatomie-evaluation inliné avec ids préfixés L1A- -->
        <!-- À copier depuis evaluation-agentique/images/20260501-02-anatomie-evaluation.svg : -->
        <!-- 1. Ouvrir le SVG, copier tout entre <svg viewBox=…> et </svg> -->
        <!-- 2. Renommer tous les id="X" en id="L1A-X" -->
        <!-- 3. Renommer toutes les références url(#X) en url(#L1A-X) -->
        <!-- 4. Wrapper le contenu dans <g transform="scale(0.7)"> -->
        <g transform="scale(0.7)">
          <!-- (contenu inline du schéma 02 ici) -->
        </g>
      </g>
    </g>
```

**Procédure de copie du SVG** :
1. `Read` `evaluation-agentique/images/20260501-02-anatomie-evaluation.svg`
2. Sélectionner tout sauf le wrapper `<svg ...>` initial et le `</svg>` final
3. Renommer ids : utilisation simple — sed-like search+replace de `id="XXX"` → `id="L1A-XXX"`, puis `url(#XXX)` → `url(#L1A-XXX)`
4. Coller dans le `<g transform="scale(0.7)">` du canvas

- [ ] **Step 2: Insérer L2 (step-2 + step-3) avec ses 2 schémas inlinés côte à côte**

Pattern similaire à L1, avec :
- `data-cards="step-2,step-3"`
- `data-parent-bbox="2260,1550,260,100"`
- `data-leaf-viewbox="1400 200 1000 900"`
- Frame stroke `#B58A2C` (ocre), marker L2 même couleur
- Connectors : `line x1="1900" y1="1100" x2="2320" y2="1550"` et `line x1="1900" y1="1100" x2="2460" y2="1550"`
- Eyebrow : `PHASE 2A · CADRER LES CAS`
- Titre : `Pass@k &amp; formula TestCase`
- Sub-labels : `S2 · NON AMBIGUÏTÉ — 2 experts pass/fail` ; `S3 · ÉQUILIBRE — should vs shouldn't trigger`
- 2 schémas inlinés (04-pyramide-metriques scale 0.4 à gauche, 06bis-testcase-formula scale 0.4 à droite) avec ids préfixés `L2A-` et `L2B-`

```html
<g class="zoom-target" data-node="L2" data-cards="step-2,step-3"
   data-parent-bbox="2260,1550,260,100"
   data-leaf-viewbox="1400 200 1000 900"
   tabindex="0" role="button" aria-label="Zoom — Phase 2A, cadrer les cas">
  <!-- ... pattern complet ... -->
  <g class="leaf-schemas" transform="translate(1430, 380)">
    <g transform="translate(0, 0) scale(0.4)">
      <!-- Schema 04-pyramide-metriques avec ids préfixés L2A- -->
    </g>
    <g transform="translate(490, 0) scale(0.4)">
      <!-- Schema 06bis-testcase-formula avec ids préfixés L2B- -->
    </g>
  </g>
</g>
```

- [ ] **Step 3: Insérer L3 (step-4 + step-5) avec ses 3 schémas empilés**

`data-cards="step-4,step-5"` ; `data-parent-bbox="2540,1550,260,100"` ; `data-leaf-viewbox="2600 200 1000 900"`. Frame `#B58A2C`. Connectors : `x1="3100" y1="1100" x2="2600" y2="1550"` et `x1="3100" y1="1100" x2="2740" y2="1550"`.

3 schémas : 07-observabilite-rca en haut (full width, scale 0.35), puis 03-taxonomie-graders et 05-llm-as-judge en-dessous côte à côte (scale 0.3 chacun). Ids préfixés `L3A-`, `L3B-`, `L3C-`.

```html
<g class="leaf-schemas" transform="translate(2630, 380)">
  <g transform="translate(0, 0) scale(0.35)">
    <!-- Schema 07-observabilite-rca avec ids préfixés L3A- -->
  </g>
  <g transform="translate(0, 300) scale(0.3)">
    <!-- Schema 03-taxonomie-graders avec ids préfixés L3B- -->
  </g>
  <g transform="translate(490, 300) scale(0.3)">
    <!-- Schema 05-llm-as-judge avec ids préfixés L3C- -->
  </g>
</g>
```

- [ ] **Step 4: Insérer L4 (step-6 + step-7) avec ses 2 schémas**

`data-cards="step-6,step-7"` ; `data-parent-bbox="2820,1550,260,100"` ; `data-leaf-viewbox="3800 200 1000 900"`. Frame `#B7332C` (carmine). Connectors : `x1="4300" y1="1100" x2="2880" y2="1550"` et `x1="4300" y1="1100" x2="3020" y2="1550"`.

2 schémas : 07-observabilite-rca (avec `clipPath` qui isole la zone trace — scope x=600..1200) et 01-evolution-paradigmes (scale 0.4). Ids préfixés `L4A-` et `L4B-`.

```html
<defs>
  <clipPath id="L4A-clip">
    <rect x="600" y="0" width="600" height="800"/>
  </clipPath>
</defs>
<g class="leaf-schemas" transform="translate(3830, 380)">
  <g transform="scale(0.5)" clip-path="url(#L4A-clip)">
    <!-- Schema 07-observabilite-rca avec ids préfixés L4A- -->
  </g>
  <g transform="translate(0, 450) scale(0.4)">
    <!-- Schema 01-evolution-paradigmes avec ids préfixés L4B- -->
  </g>
</g>
```

- [ ] **Step 5: Vérifier visuellement les 4 phase leaves**

```bash
start evaluation-agentique/20260520-evaluation-agentique-canvas.html
```

Expected : playbook central + 4 leaves rectangulaires en ghost (opacity 0.15) au-dessus, chacune connectée à 2 step boxes du playbook par fines lignes.

- [ ] **Step 6: Tester un zoom via la console**

```javascript
window.canvasZoom.openLeaf('L2');
// Vérifie : viewBox s'anime vers x=1400, w=1000 ; L2 passe à opacity 1 ; les 3 autres restent à 0.15
window.canvasZoom.reset();
// Retour level-0
```

Tester aussi le click sur step-3 dans le playbook → doit ouvrir L2 (résolution via `data-cards`).

- [ ] **Step 7: Commit**

```bash
git add evaluation-agentique/20260520-evaluation-agentique-canvas.html
git commit -m "feat(eval/canvas): 4 phase leaves (L1-L4) with inlined schemas"
```

---

### Task B5: Ajouter les 3 cheese leaves (L5-L7) en-dessous du playbook

**Files:**
- Modify: `evaluation-agentique/20260520-evaluation-agentique-canvas.html`

**Pattern d'une cheese leaf** (gabarit à instancier 3 fois, plus large que les phase leaves) :

```html
<g class="zoom-target"
   data-node="L{N}"
   data-cards="cheese-{A},cheese-{B}"
   data-parent-bbox="{x},{y},{w},{h}"
   data-leaf-viewbox="{lx} {ly} {lw} {lh}"
   tabindex="0" role="button" aria-label="Zoom — {niveau-label}">
  <!-- 2 connectors vers le haut (vers les 2 cheese layers parentes) -->
  <line x1="{leaf_cx}" y1="{ly}" x2="{cheese1_cx}" y2="{cheese1_bottom}" class="zoom-connector"/>
  <line x1="{leaf_cx}" y1="{ly}" x2="{cheese2_cx}" y2="{cheese2_bottom}" class="zoom-connector"/>
  <rect x="{lx}" y="{ly}" width="{lw}" height="{lh}" rx="8"
        fill="var(--paper)" stroke="{frame-color}" stroke-width="3"/>
  <!-- Marker L{N} en haut-droite -->
  <g>
    <circle cx="{lx+lw-30}" cy="{ly+30}" r="22" fill="{frame-color}"/>
    <text x="{lx+lw-30}" y="{ly+37}" text-anchor="middle" class="mono"
          font-size="18" font-weight="600" fill="var(--paper)">L{N}</text>
  </g>
  <text x="{lx+30}" y="{ly+50}" class="mono" font-size="14"
        fill="{frame-color}" letter-spacing="0.1em">{eyebrow}</text>
  <text x="{lx+30}" y="{ly+95}" class="display" font-family="Fraunces, serif"
        font-size="28" font-weight="500" fill="var(--ink)">{titre}</text>
  <text x="{lx+30}" y="{ly+135}" class="mono" font-size="11"
        fill="var(--text-mid)" letter-spacing="0.08em">C{A} · {label-1}</text>
  <text x="{lx+30}" y="{ly+155}" class="mono" font-size="11"
        fill="var(--text-mid)" letter-spacing="0.08em">C{B} · {label-2}</text>
  <g class="leaf-schemas" transform="translate({lx+30}, {ly+180})">
    <!-- 2 schémas inlinés côte à côte -->
  </g>
</g>
```

**Détails par leaf** :

| Leaf | data-cards | parent-bbox | leaf | eyebrow | titre | C{A}-label | C{B}-label | Schémas |
|---|---|---|---|---|---|---|---|---|
| L5 | `cheese-1,cheese-2` | `2000,1745,900,88` | `200 2300 1500 900` | `NIVEAU 1 · PRÉVENTIF` | Frameworks & monitoring | C1 · Automated evals — CI/CD pre-launch | C2 · Production monitoring — vérité terrain | 08-frameworks-matrice (scale 0.5) + 07-observabilite-rca (focus prod via clipPath, scale 0.4) |
| L6 | `cheese-3,cheese-4` | `2000,1845,900,88` | `1750 2300 1500 900` | `NIVEAU 2 · CURATIF` | Coûts & simulation utilisateur | C3 · A/B testing — outcome utilisateur | C4 · User feedback — cas non-anticipés | 09-couts-goulots (scale 0.5) + 06-user-simulation (scale 0.5) |
| L7 | `cheese-5,cheese-6` | `2000,1945,900,88` | `3300 2300 1500 900` | `NIVEAU 3 · QUALITATIF` | Review humain & calibration LAJ | C5 · Manual transcript — calibre l'intuition | C6 · Human studies — gold standard | 07-observabilite-rca (review humain, clipPath, scale 0.45) + 05-llm-as-judge (focus calibration, clipPath, scale 0.45) |

**Couleurs** : L5 `#1F5560` (teal) ; L6 `#B58A2C` (ocre) ; L7 `#B7332C` (carmine).

**Connectors** :
- L5 : leaf_cx=950, leaf_top=2300 ; cheese-1 cx=2450, bottom=1783 ; cheese-2 cx=2450, bottom=1833
- L6 : leaf_cx=2500, leaf_top=2300 ; cheese-3 cx=2450, bottom=1883 ; cheese-4 cx=2450, bottom=1933
- L7 : leaf_cx=4050, leaf_top=2300 ; cheese-5 cx=2450, bottom=1983 ; cheese-6 cx=2450, bottom=2033

- [ ] **Step 1: Insérer L5 (cheese-1 + cheese-2)**

Après le `</g>` de L4, ajouter le marqueur de section et L5 :

```html
    <!-- ── NIVEAU GRUYÈRE LEAVES (3) ─────────────────────────────── -->

    <g class="zoom-target"
       data-node="L5"
       data-cards="cheese-1,cheese-2"
       data-parent-bbox="2000,1745,900,88"
       data-leaf-viewbox="200 2300 1500 900"
       tabindex="0" role="button" aria-label="Zoom — Niveau 1, préventif">
      <line x1="950" y1="2300" x2="2450" y2="1783" class="zoom-connector"/>
      <line x1="950" y1="2300" x2="2450" y2="1833" class="zoom-connector"/>
      <rect x="200" y="2300" width="1500" height="900" rx="8"
            fill="var(--paper)" stroke="#1F5560" stroke-width="3"/>
      <g>
        <circle cx="1670" cy="2330" r="22" fill="#1F5560"/>
        <text x="1670" y="2337" text-anchor="middle" class="mono"
              font-size="18" font-weight="600" fill="var(--paper)">L5</text>
      </g>
      <text x="230" y="2350" class="mono" font-size="14"
            fill="#1F5560" letter-spacing="0.1em">NIVEAU 1 · PRÉVENTIF</text>
      <text x="230" y="2395" class="display" font-family="Fraunces, serif"
            font-size="28" font-weight="500" fill="var(--ink)">Frameworks &amp; monitoring</text>
      <text x="230" y="2435" class="mono" font-size="11"
            fill="var(--text-mid)" letter-spacing="0.08em">C1 · AUTOMATED EVALS — CI/CD pre-launch</text>
      <text x="230" y="2455" class="mono" font-size="11"
            fill="var(--text-mid)" letter-spacing="0.08em">C2 · PRODUCTION MONITORING — vérité terrain</text>
      <defs>
        <clipPath id="L5B-clip">
          <rect x="0" y="0" width="1200" height="400"/>  <!-- crop sur la partie haute du SVG 07 -->
        </clipPath>
      </defs>
      <g class="leaf-schemas" transform="translate(230, 2480)">
        <g transform="translate(0, 0) scale(0.5)">
          <!-- Schema 08-frameworks-matrice avec ids préfixés L5A- -->
        </g>
        <g transform="translate(620, 0) scale(0.4)" clip-path="url(#L5B-clip)">
          <!-- Schema 07-observabilite-rca avec ids préfixés L5B- (focus prod monitoring) -->
        </g>
      </g>
    </g>
```

- [ ] **Step 2: Insérer L6 (cheese-3 + cheese-4)**

`data-cards="cheese-3,cheese-4"` ; `data-parent-bbox="2000,1845,900,88"` ; `data-leaf-viewbox="1750 2300 1500 900"`. Frame `#B58A2C`. Connectors : `x1="2500" y1="2300" x2="2450" y2="1883"` et `x1="2500" y1="2300" x2="2450" y2="1933"`.

Schémas : 09-couts-goulots (scale 0.5) à gauche, 06-user-simulation (scale 0.5) à droite. Ids `L6A-` et `L6B-`.

- [ ] **Step 3: Insérer L7 (cheese-5 + cheese-6)**

`data-cards="cheese-5,cheese-6"` ; `data-parent-bbox="2000,1945,900,88"` ; `data-leaf-viewbox="3300 2300 1500 900"`. Frame `#B7332C` (carmine). Connectors : `x1="4050" y1="2300" x2="2450" y2="1983"` et `x1="4050" y1="2300" x2="2450" y2="2033"`.

Schémas : 07-observabilite-rca avec un clipPath différent de L5 (focus review humain — zone basse du SVG 07, x=0..600, y=400..800), scale 0.45 ; + 05-llm-as-judge avec clipPath focus calibration. Ids `L7A-` et `L7B-`.

- [ ] **Step 4: Vérifier visuellement les 7 leaves complètes**

```bash
start evaluation-agentique/20260520-evaluation-agentique-canvas.html
```

Expected : playbook au centre, 4 leaves au-dessus (rangée x=200..4800, y=200..1100), 3 leaves en-dessous (rangée x=200..4800, y=2300..3200), 7 leaves connectées par 14 fines lignes (2 par leaf).

- [ ] **Step 5: Tester les zooms via la console**

```javascript
window.canvasZoom.openLeaf('L6');   // ouvre L6 (curatif)
window.canvasZoom.reset();           // retour level-0

// Test résolution card → leaf
document.querySelector('[data-card="cheese-4"]').click();  // doit ouvrir L6 aussi
```

- [ ] **Step 6: Commit**

```bash
git add evaluation-agentique/20260520-evaluation-agentique-canvas.html
git commit -m "feat(eval/canvas): 3 cheese leaves (L5-L7) with inlined schemas"
```

---

### Task B6: Ajouter la topbar 3-items + boutons "Vue d'ensemble" et "Poster A0"

**Files:**
- Modify: `evaluation-agentique/20260520-evaluation-agentique-canvas.html`

- [ ] **Step 1: Insérer la topbar juste après `<body>`**

Remplacer `<!-- Topbar 3-items + zoom controls (Task B6) -->` par :

```html
<header class="topbar" id="topbar">
  <a href="../index.html">Mathieu <em>Guglielmino</em></a>
  <span class="dossier-context">Évaluer un agent</span>
  <nav class="back-nav" aria-label="Navigation retour">
    <button type="button" class="zoom-control" data-canvas-zoom-reset hidden
            title="Revenir à la vue d'ensemble">↑ Vue d'ensemble</button>
    <a href="20260520-evaluation-agentique-poster.svg" download class="zoom-control"
       title="Télécharger le poster A0">↓ Poster A0</a>
    <span class="back-sep" aria-hidden="true">·</span>
    <a href="index.html" title="Revenir au hub du dossier">← Hub</a>
    <span class="back-sep" aria-hidden="true">·</span>
    <a href="../index.html#series" title="Revenir à l'accueil">Accueil</a>
  </nav>
</header>
```

Les styles `.topbar`, `.dossier-context`, `.back-nav`, `.back-sep` sont fournis par `/assets/dossier-app.css` (cf. pattern PR #29 documenté dans CLAUDE.md). Le `.zoom-control` est fourni par `/assets/canvas-zoom.css` (Task A3).

- [ ] **Step 2: Ajuster `body { padding-top: 56px; }`**

Dans le `<style>` inline du canvas HTML, ajouter dans le bloc `body` :

```css
body {
  display: flex;
  flex-direction: column;
  padding-top: 56px;  /* libère la place pour la topbar fixe */
}
```

- [ ] **Step 3: Tester le bouton "Vue d'ensemble"**

Ouvrir dans le navigateur. Vérifier :
1. Au niveau 0, le bouton "↑ Vue d'ensemble" est caché (CSS `hidden`)
2. Cliquer un step → bouton apparaît
3. Cliquer le bouton → retour vue d'ensemble + bouton se cache

- [ ] **Step 4: Commit**

```bash
git add evaluation-agentique/20260520-evaluation-agentique-canvas.html
git commit -m "feat(eval/canvas): topbar 3-items + zoom controls (overview/poster)"
```

---

### Task B7: Ajouter l'annotation Caveat de démarrage + interstitiel mobile

**Files:**
- Modify: `evaluation-agentique/20260520-evaluation-agentique-canvas.html`

- [ ] **Step 1: Ajouter l'annotation Caveat dans le SVG**

Avant `</svg>` (en dernier dans le canvas, pour overlay), ajouter :

```html
    <!-- Hint Caveat — visible uniquement au niveau 0 -->
    <g id="canvas-hint" data-state="visible">
      <text x="2500" y="3300" text-anchor="middle"
            font-family="Caveat, cursive" font-size="42" fill="var(--accent)" opacity="0.7">
        ↑ Cliquer pour zoomer · Échap pour revenir ↑
      </text>
    </g>
```

- [ ] **Step 2: Ajouter le CSS pour cacher le hint après le premier zoom**

Dans le `<style>` inline du canvas HTML, ajouter :

```css
#canvas-hint { transition: opacity 600ms ease; }
svg[data-canvas-zoom]:not([data-level="0"]) #canvas-hint { opacity: 0; pointer-events: none; }
```

- [ ] **Step 3: Modifier `canvas-zoom.js` pour mettre `data-level` sur le canvas**

Dans `setLevelState` (Task A5), après `state.level = level;`, ajouter :

```javascript
    canvas.setAttribute('data-level', String(level));
```

- [ ] **Step 4: Ajouter l'interstitiel mobile avant `</body>`**

Remplacer `<!-- Mobile interstitial (Task B8) -->` par :

```html
<aside class="canvas-mobile-interstitial" data-mobile-interstitial>
  <h2>La carte zoomable est conçue pour <em>grand écran</em>.</h2>
  <p>Sur mobile, on bascule sur le rapport interactif du dossier qui couvre les mêmes notions en lecture linéaire.</p>
  <div class="actions">
    <a href="20260501-evaluation-agentique-app.html#10-playbook-de-zero-a-des-evals-fiables">→ Lire le rapport interactif</a>
    <button type="button" data-dismiss>Rester sur la carte</button>
  </div>
</aside>
```

- [ ] **Step 5: Tester le hint et l'interstitiel**

Ouvrir dans le navigateur :
1. Niveau 0 : hint Caveat visible
2. Cliquer un step → hint disparaît
3. Resize browser à < 768 px → interstitiel apparaît
4. Cliquer "Rester sur la carte" → interstitiel disparaît, canvas accessible
5. Re-élargir le navigateur → interstitiel ne réapparaît pas (dismissed)
6. Cliquer "Lire le rapport interactif" → navigate vers l'app à l'ancre

- [ ] **Step 6: Commit**

```bash
git add evaluation-agentique/20260520-evaluation-agentique-canvas.html assets/canvas-zoom.js
git commit -m "feat(eval/canvas): Caveat hint + mobile interstitial"
```

---

## Phase C — Hub integration & SEO

### Task C1: Ajouter la carte format 2 dans le hub

**Files:**
- Modify: `evaluation-agentique/index.html`

- [ ] **Step 1: Insérer la carte entre la carte rapport et la carte admin md**

Dans `evaluation-agentique/index.html`, après le `</a>` de la première carte format (rapport interactif) et avant `<a href="20260501-evaluation-agentique-rapport.md" class="format format--admin" download>` (carte admin md), insérer :

```html
  <a href="20260520-evaluation-agentique-canvas.html" class="format">
    <div class="format-tag">Format expérimental · Carte zoomable</div>
    <h2 class="format-title">La <em>carte mentale</em></h2>
    <p class="format-sub">Le playbook gruyère 8 étapes au centre, et 14 zooms qui déploient les concepts techniques — graders, observabilité, frameworks, coûts. Pensée pour grand écran. Poster A0 téléchargeable.</p>
    <div class="format-cta">
      <span>Exploration · 15-30 min</span>
      <span class="arrow">Ouvrir →</span>
    </div>
  </a>
```

- [ ] **Step 2: Tester le hub**

```bash
start evaluation-agentique/index.html
```

Vérifier : la nouvelle carte apparaît entre les deux existantes, le lien fonctionne.

- [ ] **Step 3: Commit**

```bash
git add evaluation-agentique/index.html
git commit -m "feat(eval): add 'carte zoomable' format card to hub"
```

---

### Task C2: Régénérer SEO sur tous les fichiers du dossier

**Files:**
- Modify: `evaluation-agentique/index.html`, `evaluation-agentique/20260501-evaluation-agentique-app.html`, `evaluation-agentique/20260520-evaluation-agentique-canvas.html`, `evaluation-agentique/og.png`

- [ ] **Step 1: Lancer le script SEO**

```bash
python tools/seo_dossiers.py --only evaluation-agentique
```

Expected output : régénération de `og.png` + mise à jour du bloc OG/Twitter/JSON-LD dans les 3 fichiers HTML du dossier (markers `<!-- og:start --> ... <!-- og:end -->`).

- [ ] **Step 2: Vérifier le diff**

```bash
git diff evaluation-agentique/
```

Expected : modifications uniquement entre les markers og:start/og:end, plus l'og.png remplacé.

- [ ] **Step 3: Tester sur l'aperçu social**

Ouvrir le canvas HTML dans le navigateur, View Source → vérifier que le bloc OG contient bien :
- `og:title` = "Évaluer un agent" (ou variante)
- `og:url` = `https://mathieugug.github.io/evaluation-agentique/20260520-evaluation-agentique-canvas.html`
- `og:image` = `https://mathieugug.github.io/evaluation-agentique/og.png`
- canonical correctement positionné

- [ ] **Step 4: Commit**

```bash
git add evaluation-agentique/
git commit -m "seo(eval): regen og.png + OG blocks for canvas format"
```

---

## Phase D — Poster A0

### Task D1: Créer `tools/extract_poster_svg.py`

**Files:**
- Create: `tools/extract_poster_svg.py`

- [ ] **Step 1: Écrire le script Python**

Contenu de `tools/extract_poster_svg.py` :

```python
#!/usr/bin/env python3
"""Extrait le <svg id="canvas"> d'un fichier canvas HTML et produit un brouillon
de poster SVG standalone (étape 1 du workflow poster en 2 temps).

Le script :
1. Lit le fichier HTML d'entrée
2. Extrait le <svg id="canvas" ...>...</svg>
3. Force tous les data-state à "focused" pour révéler toutes les leaves
4. Inline les Google Fonts (Fraunces, Inter, JetBrains Mono) via @font-face base64
5. Écrit un fichier {slug}-poster-draft.svg dans le même dossier

Étape 2 (habillage éditorial — bandeau titre, légende narrative, visuels de
liaison, cartouche signature, numérotation) reste manuelle. Cf. spec
docs/superpowers/specs/2026-05-20-eval-infinite-canvas-design.md

Usage :
    python tools/extract_poster_svg.py evaluation-agentique/20260520-evaluation-agentique-canvas.html
"""

import argparse
import re
import sys
from pathlib import Path


SVG_START_RE = re.compile(r'<svg\s+id="canvas"[^>]*>', re.DOTALL)
SVG_END_RE = re.compile(r'</svg>')

# Pattern pour data-state="anything" → data-state="focused"
DATA_STATE_RE = re.compile(r'data-state="[^"]*"')

# Pattern pour matcher l'ouverture du tag <svg id="canvas"> et capturer ses attributs
SVG_OPENING_RE = re.compile(
    r'(<svg\s+id="canvas"[^>]*?)(\s*>)',
    re.DOTALL
)


def extract_canvas_svg(html: str) -> str:
    """Extrait le <svg id="canvas">...</svg> du HTML."""
    m = SVG_START_RE.search(html)
    if not m:
        raise ValueError('No <svg id="canvas"> found in HTML')
    start = m.start()
    # Find matching </svg> — naive but works since canvas SVGs don't nest <svg>
    depth = 1
    pos = m.end()
    while depth > 0 and pos < len(html):
        next_open = html.find('<svg', pos)
        next_close = html.find('</svg>', pos)
        if next_close == -1:
            raise ValueError('Unclosed <svg> tag')
        if next_open != -1 and next_open < next_close:
            depth += 1
            pos = next_open + 4
        else:
            depth -= 1
            pos = next_close + 6
    return html[start:pos]


def force_focused_states(svg: str) -> str:
    """Force tous les data-state="..." à data-state="focused"."""
    return DATA_STATE_RE.sub('data-state="focused"', svg)


def inline_fonts_stylesheet(svg: str) -> str:
    """Injecte un <style> avec les fallbacks de polices (Cambria/Helvetica/Consolas).

    Pour la v1, on n'embarque pas les Google Fonts en base64 (trop lourd).
    On déclare uniquement des @font-face fallbacks alignés sur les styles utilisés.
    """
    style_block = '''<defs>
<style type="text/css"><![CDATA[
text.display, text[font-family*="Fraunces"], text[font-family*="serif"] {
  font-family: 'Cambria', 'Georgia', serif;
}
text.body, text[font-family*="Inter"] {
  font-family: 'Helvetica Neue', 'Arial', sans-serif;
}
text.mono, text[font-family*="JetBrains Mono"], text[font-family*="monospace"] {
  font-family: 'Consolas', 'Courier New', monospace;
}
text[font-family*="Caveat"] {
  font-family: 'Caveat', 'Comic Sans MS', cursive;
}
]]></style>
</defs>'''

    return SVG_OPENING_RE.sub(r'\1\2' + style_block, svg, count=1)


def add_xmlns(svg: str) -> str:
    """S'assure que le SVG porte xmlns pour un rendu standalone."""
    if 'xmlns="http://www.w3.org/2000/svg"' in svg.split('>', 1)[0]:
        return svg
    return SVG_OPENING_RE.sub(
        r'\1 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"\2',
        svg, count=1
    )


def derive_draft_path(canvas_html_path: Path) -> Path:
    """canvas.html → canvas-poster-draft.svg dans le même dossier."""
    name = canvas_html_path.stem  # 20260520-evaluation-agentique-canvas
    if name.endswith('-canvas'):
        base = name[:-len('-canvas')]
    else:
        base = name
    return canvas_html_path.parent / f'{base}-poster-draft.svg'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('canvas_html', type=Path, help='Path to the canvas HTML file')
    parser.add_argument('--output', type=Path, default=None,
                        help='Output SVG path (default: derived from input)')
    args = parser.parse_args()

    if not args.canvas_html.exists():
        print(f'Error: {args.canvas_html} does not exist', file=sys.stderr)
        return 1

    html = args.canvas_html.read_text(encoding='utf-8')

    try:
        svg = extract_canvas_svg(html)
    except ValueError as e:
        print(f'Error extracting SVG: {e}', file=sys.stderr)
        return 1

    svg = force_focused_states(svg)
    svg = add_xmlns(svg)
    svg = inline_fonts_stylesheet(svg)

    # Ajouter le préambule XML pour rendu standalone
    output = '<?xml version="1.0" encoding="UTF-8"?>\n' + svg + '\n'

    output_path = args.output or derive_draft_path(args.canvas_html)
    output_path.write_text(output, encoding='utf-8')
    print(f'Wrote {output_path} ({len(output)} bytes)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
```

- [ ] **Step 2: Tester le script avec un fichier minimal**

Créer un fichier temporaire de test :

```bash
cat > /tmp/canvas-test.html << 'EOF'
<html><body><svg id="canvas" viewBox="0 0 100 100">
  <g class="zoom-target" data-state=""><rect/></g>
  <g class="zoom-target" data-state="ghost"><rect/></g>
</svg></body></html>
EOF
python tools/extract_poster_svg.py /tmp/canvas-test.html --output /tmp/canvas-test-poster.svg
cat /tmp/canvas-test-poster.svg
```

Expected : un SVG valide avec `data-state="focused"` partout, xmlns présent, style fallback inline.

- [ ] **Step 3: Commit**

```bash
git add tools/extract_poster_svg.py
git commit -m "feat(tools): extract_poster_svg.py for poster A0 draft generation"
```

---

### Task D2: Générer le brouillon poster pour le canvas eval

**Files:**
- Create: `evaluation-agentique/20260520-evaluation-agentique-poster-draft.svg` (généré)

- [ ] **Step 1: Lancer le script sur le canvas eval**

```bash
python tools/extract_poster_svg.py evaluation-agentique/20260520-evaluation-agentique-canvas.html
```

Expected output : `Wrote evaluation-agentique/20260520-evaluation-agentique-poster-draft.svg (~XXX bytes)`

- [ ] **Step 2: Ouvrir le brouillon dans le navigateur pour vérification**

```bash
start evaluation-agentique/20260520-evaluation-agentique-poster-draft.svg
```

Expected : toutes les 7 leaves visibles à pleine opacité + le playbook central, sans le hint Caveat (qui est dans un `<g id="canvas-hint">` non géré par le script — c'est OK, on l'enlèvera dans le post-traitement).

- [ ] **Step 3: Valider la structure XML**

```bash
python -c "import xml.etree.ElementTree as ET; ET.parse('evaluation-agentique/20260520-evaluation-agentique-poster-draft.svg')" && echo "XML valid"
```

Expected : `XML valid`.

- [ ] **Step 4: Commit**

```bash
git add evaluation-agentique/20260520-evaluation-agentique-poster-draft.svg
git commit -m "build(eval): generate poster draft from canvas HTML"
```

---

### Task D3: Habillage éditorial du poster — bandeau titre + cartouche signature (numérotation L déjà inline via canvas)

**Files:**
- Create: `evaluation-agentique/20260520-evaluation-agentique-poster.svg` (final, copié du draft puis enrichi manuellement)

- [ ] **Step 1: Copier le brouillon vers la version finale**

```bash
cp evaluation-agentique/20260520-evaluation-agentique-poster-draft.svg evaluation-agentique/20260520-evaluation-agentique-poster.svg
```

- [ ] **Step 2: Ajouter le bandeau titre en haut (y=20 → y=180)**

Ouvrir `20260520-evaluation-agentique-poster.svg` dans un éditeur. Juste après `<rect data-canvas-background ... />`, ajouter :

```xml
<!-- Bandeau titre éditorial -->
<g id="poster-title-band">
  <rect x="0" y="0" width="5000" height="180" fill="#FAF8F3"/>
  <line x1="0" y1="180" x2="5000" y2="180" stroke="#E5E1D8" stroke-width="2"/>
  <text x="80" y="90" font-family="Cambria, Georgia, serif" font-size="60" font-weight="500"
        fill="#1A1A1A" letter-spacing="-0.02em">Évaluer un agent</text>
  <text x="80" y="140" font-family="Cambria, Georgia, serif" font-size="28" font-style="italic"
        fill="#5A5A5A">de 20 tasks à un harness fiable · playbook gruyère 8 étapes</text>
  <text x="4920" y="90" text-anchor="end" font-family="Consolas, monospace" font-size="16"
        fill="#5A5A5A" letter-spacing="0.1em">ÉTUDE 08 · MAI 2026</text>
  <text x="4920" y="120" text-anchor="end" font-family="Consolas, monospace" font-size="13"
        fill="#9A9CA5">mathieugug.github.io/evaluation-agentique</text>
  <text x="4920" y="145" text-anchor="end" font-family="Consolas, monospace" font-size="13"
        fill="#9A9CA5">Mathieu Guglielmino · Format co-écrit avec une IA</text>
</g>
```

- [ ] **Step 3: Vérifier que les marqueurs L1..L7 sont bien présents (déjà inline depuis Tasks B4/B5)**

Les marqueurs L1..L7 (cercles colorés en haut-droite de chaque leaf, fill teal/ocre/carmine selon phase/niveau) ont été inlinés dès la création des leaves dans Tasks B4 et B5. Aucune action requise ici — vérifier visuellement dans le brouillon que les 7 marqueurs sont visibles :

```bash
start evaluation-agentique/20260520-evaluation-agentique-poster-draft.svg
```

Si un marqueur manque (e.g. oubli dans une leaf à Task B4/B5), revenir sur la leaf concernée du canvas HTML pour l'ajouter, puis re-lancer `extract_poster_svg.py` (Task D2).

**Note** : les sub-labels `S0..S7` et `C1..C6` à l'intérieur de chaque leaf (sous le titre, en mono) ont aussi été inlinés à B4/B5 — ils permettent la lecture détaillée en print sans dépendre du marqueur L principal.

- [ ] **Step 4: Ajouter le cartouche signature en bas-droite**

Avant `</svg>`, ajouter :

```xml
<!-- Cartouche signature -->
<g id="poster-signature" transform="translate(4700, 3300)">
  <text x="0" y="0" text-anchor="end" font-family="Cambria, Georgia, serif"
        font-size="22" font-style="italic" fill="#1A1A1A">— Mathieu Guglielmino</text>
  <text x="0" y="30" text-anchor="end" font-family="Consolas, monospace" font-size="13"
        fill="#5A5A5A" letter-spacing="0.08em">v.20260520 · CC BY 4.0</text>
  <!-- Sigil MG (cf. skill svg-schemas) -->
  <g transform="translate(30, -50) scale(2)">
    <text x="0" y="0" font-family="Cambria, Georgia, serif" font-style="italic"
          font-size="40" font-weight="500" fill="#b8582e">MG</text>
  </g>
</g>
```

- [ ] **Step 5: Supprimer le hint Caveat (qui n'a pas sa place en print)**

Chercher dans le SVG le bloc `<g id="canvas-hint">...</g>` et le supprimer entièrement.

- [ ] **Step 6: Vérifier le rendu dans le navigateur**

```bash
start evaluation-agentique/20260520-evaluation-agentique-poster.svg
```

Expected : bandeau titre, 7 leaves L1-L7 (avec sub-labels S0-S7 / C1-C6 lisibles à l'intérieur), cartouche signature, pas de hint Caveat.

- [ ] **Step 7: Valider XML**

```bash
python -c "import xml.etree.ElementTree as ET; ET.parse('evaluation-agentique/20260520-evaluation-agentique-poster.svg')" && echo "XML valid"
```

- [ ] **Step 8: Commit**

```bash
git add evaluation-agentique/20260520-evaluation-agentique-poster.svg
git commit -m "feat(eval/poster): editorial overlay v1 — title band + signature"
```

---

### Task D4: Habillage éditorial — légende narrative + légende couleur

**Files:**
- Modify: `evaluation-agentique/20260520-evaluation-agentique-poster.svg`

- [ ] **Step 1: Ajouter la légende narrative verticale à droite (zone 4400-4950 x 200-3200)**

Avant le `<g id="poster-signature">`, ajouter :

```xml
<!-- Légende narrative verticale (colonne droite) -->
<g id="poster-narrative">
  <rect x="4400" y="200" width="550" height="3000" fill="#F2EFE7" opacity="0.4"/>
  <line x1="4400" y1="200" x2="4400" y2="3200" stroke="#E5E1D8" stroke-width="2"/>

  <text x="4430" y="260" font-family="Consolas, monospace" font-size="14" fill="#B7332C"
        letter-spacing="0.15em">LE FIL ROUGE</text>

  <text x="4430" y="310" font-family="Cambria, Georgia, serif" font-size="24" font-weight="500"
        fill="#1A1A1A">De 20 tasks</text>
  <text x="4430" y="340" font-family="Cambria, Georgia, serif" font-size="24" font-weight="500"
        fill="#1A1A1A">à un harness</text>
  <text x="4430" y="370" font-family="Cambria, Georgia, serif" font-size="24" font-style="italic"
        fill="#b8582e">qu'on déploie en confiance.</text>

  <!-- Manuscrit-style narrative bullets, 5-7 lignes -->
  <text x="4430" y="450" font-family="Helvetica Neue, sans-serif" font-size="16" fill="#3b3f4d">
    <tspan x="4430" dy="0">S0-S1 : on part de l'observation,</tspan>
    <tspan x="4430" dy="22">pas du benchmark.</tspan>
  </text>
  <text x="4430" y="540" font-family="Helvetica Neue, sans-serif" font-size="16" fill="#3b3f4d">
    <tspan x="4430" dy="0">S2-S5 : on conçoit le harness</tspan>
    <tspan x="4430" dy="22">— tasks claires, graders sobres.</tspan>
  </text>
  <text x="4430" y="630" font-family="Helvetica Neue, sans-serif" font-size="16" fill="#3b3f4d">
    <tspan x="4430" dy="0">S6-S7 : on lit les transcripts</tspan>
    <tspan x="4430" dy="22">et on tient le harness vivant.</tspan>
  </text>
  <text x="4430" y="720" font-family="Helvetica Neue, sans-serif" font-size="16" fill="#3b3f4d">
    <tspan x="4430" dy="0">C1-C6 : aucune méthode ne suffit.</tspan>
    <tspan x="4430" dy="22">L'empilement des couches</tspan>
    <tspan x="4430" dy="22">donne la couverture.</tspan>
  </text>
  <text x="4430" y="850" font-family="Cambria, Georgia, serif" font-size="20" font-style="italic"
        fill="#1F5560">★ Démontrer la robustesse</text>
  <text x="4430" y="875" font-family="Cambria, Georgia, serif" font-size="20" font-style="italic"
        fill="#1F5560">multi-segments avant déploiement.</text>
</g>
```

- [ ] **Step 2: Ajouter la légende couleur en bas-gauche (y=3100-3300)**

Ajouter :

```xml
<!-- Légende couleur (encart bas-gauche) -->
<g id="poster-color-legend" transform="translate(80, 3100)">
  <text x="0" y="0" font-family="Consolas, monospace" font-size="14" fill="#5A5A5A"
        letter-spacing="0.15em">LÉGENDE COULEUR</text>

  <!-- Phases playbook -->
  <text x="0" y="30" font-family="Consolas, monospace" font-size="11" fill="#9A9CA5"
        letter-spacing="0.1em">PHASES DU PLAYBOOK</text>
  <circle cx="15" cy="55" r="8" fill="#1F5560"/>
  <text x="35" y="60" font-family="Helvetica Neue, sans-serif" font-size="13" fill="#1A1A1A">Collecte tasks (S0-S1)</text>
  <circle cx="15" cy="80" r="8" fill="#B58A2C"/>
  <text x="35" y="85" font-family="Helvetica Neue, sans-serif" font-size="13" fill="#1A1A1A">Design harness &amp; graders (S2-S5)</text>
  <circle cx="15" cy="105" r="8" fill="#B7332C"/>
  <text x="35" y="110" font-family="Helvetica Neue, sans-serif" font-size="13" fill="#1A1A1A">Maintenance long terme (S6-S7)</text>

  <!-- Niveaux gruyère -->
  <text x="500" y="30" font-family="Consolas, monospace" font-size="11" fill="#9A9CA5"
        letter-spacing="0.1em">NIVEAUX DE DÉFENSE</text>
  <rect x="500" y="48" width="20" height="14" fill="#FAF8F3" stroke="#1F5560" stroke-width="1.5"/>
  <text x="530" y="60" font-family="Helvetica Neue, sans-serif" font-size="13" fill="#1A1A1A">Préventif — automated, monitoring (C1-C2)</text>
  <rect x="500" y="73" width="20" height="14" fill="#FAF8F3" stroke="#B58A2C" stroke-width="1.5"/>
  <text x="530" y="85" font-family="Helvetica Neue, sans-serif" font-size="13" fill="#1A1A1A">Curatif — A/B, feedback (C3-C4)</text>
  <rect x="500" y="98" width="20" height="14" fill="#FAF8F3" stroke="#B7332C" stroke-width="1.5"/>
  <text x="530" y="110" font-family="Helvetica Neue, sans-serif" font-size="13" fill="#1A1A1A">Qualitatif — review, human studies (C5-C6)</text>
</g>
```

- [ ] **Step 3: Valider XML + visuel**

```bash
python -c "import xml.etree.ElementTree as ET; ET.parse('evaluation-agentique/20260520-evaluation-agentique-poster.svg')" && echo "XML valid"
start evaluation-agentique/20260520-evaluation-agentique-poster.svg
```

Expected : légende narrative à droite, légende couleur en bas-gauche, le tout cohérent visuellement.

- [ ] **Step 4: Commit**

```bash
git add evaluation-agentique/20260520-evaluation-agentique-poster.svg
git commit -m "feat(eval/poster): narrative legend + color legend"
```

---

### Task D5: Habillage éditorial — visuels de liaison (cordons stylisés)

**Files:**
- Modify: `evaluation-agentique/20260520-evaluation-agentique-poster.svg`

- [ ] **Step 1: Remplacer les fines lignes `class="zoom-connector"` par des cordons décoratifs**

Les `<line class="zoom-connector">` créées dans les Tasks B4 et B5 (canvas — 2 lignes par leaf) sont rectilignes et discrètes pour le mode interactif. En poster, on les remplace par des paths courbes (Bezier) qui font respirer visuellement la composition.

Pour chaque leaf (7) et chacun de ses 2 connectors (donc 14 paths au total) : remplacer la `<line x1=".." y1=".." x2=".." y2=".." class="zoom-connector"/>` par :

```xml
<path d="M {leaf_cx} {leaf_anchor_y} C {leaf_cx} {midpoint_y}, {card_cx} {midpoint_y}, {card_cx} {card_anchor_y}"
      stroke="#5A5A5A" stroke-width="2.5" fill="none" opacity="0.45"/>
```

Avec :
- Pour les phase leaves L1-L4 (au-dessus du playbook) :
  - `leaf_cx` = leaf_x + leaf_w/2 (center horizontal de la leaf)
  - `leaf_anchor_y` = leaf_y + leaf_h (base de la leaf, y=1100)
  - `card_cx` = step parent center x
  - `card_anchor_y` = step parent y (top du step box, y=1550)
- Pour les cheese leaves L5-L7 (en-dessous du playbook) :
  - `leaf_anchor_y` = leaf_y (top de la leaf, y=2300)
  - `card_anchor_y` = cheese parent y + cheese parent h (bottom du cheese layer)
- `midpoint_y` = (leaf_anchor_y + card_anchor_y) / 2

Exemple pour L1 (step-0 + step-1 → 2 paths) :
- leaf 200,200,1000,900 → leaf_cx=700, leaf_anchor_y=1100
- step-0 cx=2040, anchor_y=1550 → midpoint=1325
- step-1 cx=2180, anchor_y=1550 → midpoint=1325

```xml
<path d="M 700 1100 C 700 1325, 2040 1325, 2040 1550"
      stroke="#5A5A5A" stroke-width="2.5" fill="none" opacity="0.45"/>
<path d="M 700 1100 C 700 1325, 2180 1325, 2180 1550"
      stroke="#5A5A5A" stroke-width="2.5" fill="none" opacity="0.45"/>
```

Reproduire pour les 7 leaves × 2 connectors = 14 paths.

**Pour les cheese leaves** (L5-L7, en-dessous du playbook), inverser le sens : le path part du haut de la leaf (`leaf_y`) et monte vers le bas du cheese parent (`cheese_y + cheese_h`).

- [ ] **Step 2: Valider XML + visuel**

```bash
python -c "import xml.etree.ElementTree as ET; ET.parse('evaluation-agentique/20260520-evaluation-agentique-poster.svg')" && echo "XML valid"
start evaluation-agentique/20260520-evaluation-agentique-poster.svg
```

Expected : 14 cordons décoratifs (7 leaves × 2 connectors) relient leaves et playbook de façon expressive.

- [ ] **Step 3: Commit**

```bash
git add evaluation-agentique/20260520-evaluation-agentique-poster.svg
git commit -m "feat(eval/poster): replace zoom connectors with decorative bezier cords"
```

---

## Phase E — Verification & PR

### Task E1: Manual test checklist (10 points de la spec)

**Files:**
- (Aucun fichier à modifier — seulement vérifications)

- [ ] **Step 1: Tests fonctionnels du canvas**

Ouvrir `evaluation-agentique/20260520-evaluation-agentique-canvas.html` dans Chrome desktop.

1. **Niveau 0 → niveau 1 sur les 14 cards (via résolution `data-cards`)** :
   - Cliquer chacun des 8 step boxes du playbook → vérifier zoom vers la leaf L1..L4 attendue
     - step-0 → L1 ; step-1 → L1 ; step-2 → L2 ; step-3 → L2 ; step-4 → L3 ; step-5 → L3 ; step-6 → L4 ; step-7 → L4
   - Cliquer chacune des 6 cheese layers → vérifier zoom vers L5..L7 attendu
     - cheese-1 → L5 ; cheese-2 → L5 ; cheese-3 → L6 ; cheese-4 → L6 ; cheese-5 → L7 ; cheese-6 → L7
   - Compter : 14 cards → 7 leaves, toutes les 14 transitions cohérentes

2. **Niveau 1 → niveau 2** : depuis chacune des 7 leaves au level-1, cliquer la leaf focalisée → zoom plus profond sur les schémas techniques inlinés. Vérifier 7 fois.

3. **Échap remonte** : depuis level-2 → level-1 ; depuis level-1 → level-0. Tester 3 fois (une par profondeur).

4. **Flèches gauche/droite** : à level-1, presser droite plusieurs fois → cycle dans l'ordre L1, L2, L3, L4, L5, L6, L7, L1, ... Gauche → ordre inverse.

5. **Bouton "↑ Vue d'ensemble"** : depuis n'importe quel état non-0, cliquer le bouton → retour à level-0.

6. **Deep-link** :
   - `…canvas.html#L2` → s'ouvre directement au niveau 2 sur L2
   - `…canvas.html#zone-L5` → niveau 1 sur L5
   - `…canvas.html#step-3` → backward-compat : résout `step-3` → leaf parente `L2`, ouvre L2 au niveau 2

7. **Back/forward navigateur** : faire une séquence step-3 → step-5 → cheese-1, puis presser back back back → retour aux états précédents dans l'ordre inverse (L2 → L3 → L5 → L2 → level-0).

- [ ] **Step 2: Tests mobile (Chrome DevTools en mode mobile, pas desktop site)**

Ouvrir DevTools, basculer en mode iPhone 12 Pro (390×844).

8. **Interstitiel mobile** : à l'ouverture, l'interstitiel plein écran apparaît avec :
   - Titre "La carte zoomable est conçue pour grand écran"
   - Deux boutons : "Lire le rapport interactif" + "Rester sur la carte"

9. **Bouton "Rester"** : clique → interstitiel se cache, canvas accessible, taps fonctionnels (mais cibles petites — c'est attendu).

10. **Bouton "Lire le rapport interactif"** : navigate vers `20260501-…-app.html#10-playbook-…` — vérifier l'ancre s'ouvre sur la bonne section.

- [ ] **Step 3: Tests poster SVG**

11. **Poster ouvert dans navigateur** :
   ```bash
   start evaluation-agentique/20260520-evaluation-agentique-poster.svg
   ```
   Toutes les leaves visibles à opacité 1, bandeau titre, narrative legend, color legend, signature, cordons. Pas de hint Caveat.

12. **Validation XML stricte** :
   ```bash
   python -c "import xml.etree.ElementTree as ET; ET.parse('evaluation-agentique/20260520-evaluation-agentique-poster.svg')" && echo "OK"
   ```

13. **Lien depuis le canvas** : dans le canvas HTML desktop, cliquer "↓ Poster A0" → téléchargement du `.svg` déclenché.

- [ ] **Step 4: Tests contract automatisés**

```bash
node --test tests/canvas-zoom-contract.test.mjs tests/lib-contract.test.mjs tests/apps-integration.test.mjs
```

Expected : tous les tests passent.

- [ ] **Step 5: Si un test échoue**

Ne pas avancer. Diagnostiquer, fixer, re-tester. Commit séparé si correction nécessaire :

```bash
git add <files>
git commit -m "fix(canvas-zoom): <description>"
```

- [ ] **Step 6: Marquer la checklist comme complétée**

Aucun commit pour cette étape — c'est un gate de validation.

---

### Task E2: Diff review pré-push

**Files:**
- Aucun fichier à modifier — revue manuelle

- [ ] **Step 1: Vérifier l'arbre des commits de la branche**

```bash
git log main..HEAD --oneline
```

Expected : une suite de commits clairs (feat/test/fix), pas de WIP, pas de garbage.

- [ ] **Step 2: Vérifier le diff cumulé**

```bash
git diff main..HEAD --stat
```

Expected stats : `~10-15` files changed, ~5000+ insertions (le gros est dans le canvas HTML et le poster SVG).

- [ ] **Step 3: Vérifier qu'aucun fichier sensible n'est commit**

```bash
git diff main..HEAD --name-only | grep -E '(\.env|credentials|secret|key)' || echo "Pas de fichier sensible"
```

- [ ] **Step 4: Si quelque chose détonne**

Stop. Identifier le commit fautif, corriger via un nouveau commit (ne pas amender les anciens).

---

### Task E3: Push branche + créer la PR via MCP GitHub

**Files:**
- Aucun

- [ ] **Step 1: Push la branche sur origin**

```bash
git push -u origin claude/eval-infinite-canvas-2026-05-20
```

Expected : push réussi (pas sur main → pas de 403).

- [ ] **Step 2: Créer la PR via MCP GitHub**

```
mcp__github__create_pull_request(
  owner="mathieugug",
  repo="mathieugug.github.io",
  base="main",
  head="claude/eval-infinite-canvas-2026-05-20",
  title="feat(eval): carte zoomable du playbook gruyère + poster A0",
  body=`
## Ce que cette PR ajoute

Un second format au dossier \`evaluation-agentique/\` — une carte HTML/SVG zoomable à 3 niveaux discrets qui place le playbook gruyère au centre et déploie 7 leaves thématiques (4 phases + 3 niveaux gruyère) qui réutilisent les 11 schémas existants du dossier.

Plus :
- Une lib partagée \`/assets/canvas-zoom.{js,css}\` réutilisable sur d'autres dossiers
- Un poster A0 SVG standalone téléchargeable (dérivé via \`tools/extract_poster_svg.py\` puis habillé éditorialement)
- Tests de contrat pour la lib + tests d'intégration mis à jour

## Format

- Desktop : carte zoomable interactive, semantic zoom 3 niveaux (overview/zone/leaf)
- Mobile (< 768 px) : interstitiel qui redirige vers l'app rapport existante

## Liens

- Spec : \`docs/superpowers/specs/2026-05-20-eval-infinite-canvas-design.md\`
- Plan : \`docs/superpowers/plans/2026-05-20-eval-infinite-canvas.md\`

## Test plan

- [ ] Niveau 0 → niveau 1 OK sur les 14 cards (résolution → 7 leaves)
- [ ] Niveau 1 → niveau 2 OK sur les 7 leaves
- [ ] Échap remonte un niveau (3 niveaux testés)
- [ ] Flèches gauche/droite cyclent dans l'ordre
- [ ] Bouton "↑ Vue d'ensemble" OK
- [ ] Deep-link \`#L2\`, \`#zone-L5\`, et backward-compat \`#step-3\` OK
- [ ] Back/forward navigateur OK
- [ ] Mobile interstitiel + bouton "Rester" + bouton "Lire le rapport" OK
- [ ] Poster SVG ouvert dans navigateur + valide XML
- [ ] Tests CI \`node --test\` PASS

🤖 Generated with [Claude Code](https://claude.com/claude-code)
  `
)
```

- [ ] **Step 3: Vérifier que la PR est créée**

Le MCP retourne l'URL de la PR. La passer à l'utilisateur pour merge manuel.

---

## Self-Review Notes

**Spec coverage check** :

- [x] Architecture (spec §3) → Task B1
- [x] Hiérarchie 3 niveaux + regroupement 7 leaves (spec §4) → Tasks A5, A8, B3-B5
- [x] Mécanique viewBox + résolution card→leaf (spec §5) → Tasks A4-A12
- [x] Mapping leaf → schémas (spec §4 tableau, 7 leaves × 2-3 schémas) → Tasks B4, B5
- [x] LOD opacity (spec §5) → Task A3 (CSS) + A5 (JS)
- [x] Interaction (clic/Échap/flèches) + findLeafForCard (spec §5) → Tasks A7, A9, A10
- [x] Deep-link & history + backward-compat #step-N (spec §5) → Tasks A8, A12
- [x] Fallback mobile (spec §6) → Tasks A11, B7
- [x] Poster en 2 temps (spec §7) → Tasks D1-D5
- [x] Hub intégration (spec §8) → Task C1
- [x] Topbar 3-items + boutons (spec §8) → Task B6
- [x] SEO regen (spec §8) → Task C2
- [x] a11y (spec §9) → Tasks A5 (aria-live), B1 (aria-label), B6 (focus-visible)
- [x] Tests (spec §10) → Tasks A1, A2, E1
- [x] Hors scope respecté → pas de tâche pour zoom wheel/pinch, re-render mobile, ni quizzes

**Placeholder scan** : aucun "TBD/TODO/à compléter" — chaque step a son code ou sa commande concrète.

**Type consistency** :
- `setLevelState(level, node)` cohérent partout (A5, A8, A11, A12) ; `node` = leaf id (L1..L7), pas card id
- `bboxFromTarget(node)` / `leafViewBox(node)` / `findLeafForCard(cardId)` cohérents (A7, A8, A12)
- data-attrs canoniques : `data-node` (leaf id L1..L7), `data-cards` (CSV des cards parentes), `data-parent-bbox`, `data-leaf-viewbox`, `data-state`, `data-canvas-zoom`, `data-canvas-background`, `data-canvas-zoom-reset`, `data-mobile-interstitial`, `data-dismiss`, `data-zoom-live`, `data-level` — tous référencés cohéremment
- Selectors CSS : `svg[data-canvas-zoom]`, `.zoom-target[data-state="focused"]`, `.canvas-mobile-interstitial` — alignés entre Task A3 (CSS) et Tasks B1-B7 (HTML)
- Naming `L{N}` pour les 7 leaves, sub-labels `S{N}` (steps) et `C{N}` (cheese) pour les cards à l'intérieur — pas de confusion entre niveau leaf (L) et card (S/C)

**Granularity check** : 29 tasks (A1-A12, B1-B7, C1-C2, D1-D5, E1-E3), chacune avec 2-10 steps, chacune commitable indépendamment. Le plan est exécutable task-par-task par un agent.

---

**Plan terminé.** Sauvegardé à `docs/superpowers/plans/2026-05-20-eval-infinite-canvas.md`.
