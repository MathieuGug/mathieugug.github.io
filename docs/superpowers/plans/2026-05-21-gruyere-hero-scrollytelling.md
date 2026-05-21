# Gruyere hero scrollytelling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformer la bannière hero du hub `evaluation-agentique/index.html` en intro scrollytelling pleine page (5 beats narratifs) avec bannière résiduelle au-dessus du titre. L'app et la carte zoomable conservent leur bannière compacte actuelle.

**Architecture:** Section `<section class="hero-intro">` 500vh, sticky canvas 100vh, 5 sentinelles `IntersectionObserver`-pilotées, qui appellent `hero.setBeat(n)` sur un mount fullscreen. Une seconde instance `gruyere-hero` sert de bannière compacte juste au-dessus du `<main>`. Mobile/`prefers-reduced-motion` : intro masquée, seul le hub apparaît avec sa bannière (état actuel).

**Tech Stack:** Three.js (déjà en place), IntersectionObserver, vanilla ES modules, `node --test` pour la suite de tests. Pas de nouvelle dépendance.

**Spec source:** `docs/superpowers/specs/2026-05-21-gruyere-hero-scrollytelling-design.md`

**Branch:** `claude/gruyere-hero-3d-2026-05-21` (worktree `mathieugug.github.io-gruyere/`)

---

## File Structure

| Fichier | Type | Responsabilité |
|---|---|---|
| `evaluation-agentique/gruyere-hero.js` | edit | Animation Three.js. Gagne `setBeat()`, `getBeat()`, `initialBeat`, gate collision + lerp opacité par plaque. |
| `evaluation-agentique/gruyere-hero.css` | edit | Styles existants + bloc `.hero-intro*` (~60 lignes ajoutées). |
| `evaluation-agentique/hero-intro.js` | **new** | Orchestration scroll → beats (IntersectionObserver), wiring 2 mounts (intro + bannière), pause/resume bascule, fallback mobile/reduced-motion. |
| `evaluation-agentique/index.html` | edit | DOM réorganisé : `<section class="hero-intro">` (5 sentinelles + caption overlay + figure plein écran) + `<figure id="gruyere-hero">` (bannière) au-dessus de `<main>`. Script entrypoint passe de `mountGruyereHero` à `mountHeroIntro`. |
| `tests/gruyere-hero.test.mjs` | edit | Adapte les assertions du hub à la nouvelle structure (banner figure garde `id="gruyere-hero"` ; intro figure a `id="gruyere-hero-intro"`). Ajoute des tests pour `setBeat`/`getBeat`/`initialBeat`. |
| `tests/hero-intro.test.mjs` | **new** | Assertions de contrat pour `hero-intro.js` (export, IO wiring, mobile guard, BEATS array). |

**Pas touché** :
- `*-app.html`, `*-canvas.html` (ne reçoivent pas le scrollytelling)
- `gruyere-hero-poster.svg`, `og.png`
- `tests/apps-integration.test.mjs` (concerne `*-app.html`, pas `index.html`)
- Autres dossiers du site

---

## Phase 1 — API beat dans `gruyere-hero.js` (rétrocompatible)

Objectif : ajouter `setBeat()`/`getBeat()`/`initialBeat` sans changer le comportement par défaut. Les mounts existants (app, carte zoomable) continuent à fonctionner à l'identique.

### Task 1 : Tests contractuels de l'API beat

**Files:**
- Modify: `tests/gruyere-hero.test.mjs` (ajouts en bas du fichier)

- [ ] **Step 1: Ajouter les tests qui doivent échouer**

Ajouter après la dernière ligne du fichier (après la boucle `for (const page of HOST_PAGES)`), avant la fin :

```js
test('gruyere-hero.js declares setBeat function', () => {
  assert.match(HERO_JS, /\bsetBeat\b/, 'mountGruyereHero return value must include setBeat');
});

test('gruyere-hero.js declares getBeat function', () => {
  assert.match(HERO_JS, /\bgetBeat\b/, 'mountGruyereHero return value must include getBeat');
});

test('gruyere-hero.js supports initialBeat option', () => {
  assert.match(HERO_JS, /initialBeat/, 'DEFAULTS or opts must reference initialBeat');
});

test('gruyere-hero.js supports beatTransitionMs option', () => {
  assert.match(HERO_JS, /beatTransitionMs/, 'DEFAULTS or opts must reference beatTransitionMs');
});

test('gruyere-hero.js gates collision by plate.enabled', () => {
  // The collision loop in updateParticles must check an `enabled` field on plates.
  // We match the JS source for an `enabled` reference inside the collision logic.
  assert.match(HERO_JS, /\.enabled\b/, 'plates must have an .enabled flag used by collision gate');
});
```

- [ ] **Step 2: Lancer les tests pour confirmer l'échec**

```bash
cd evaluation-agentique/../  # ROOT
node --test tests/gruyere-hero.test.mjs 2>&1 | grep -E "(setBeat|getBeat|initialBeat|beatTransitionMs|enabled)" | head -20
```

Expected : 5 tests fail (les regex ne matchent rien dans le fichier actuel).

- [ ] **Step 3: Commit les tests rouges**

```bash
git add tests/gruyere-hero.test.mjs
git commit -m "test(eval/hero): contracts pour API beat (setBeat, getBeat, initialBeat)"
```

### Task 2 : Ajouter les options `initialBeat` et `beatTransitionMs` dans DEFAULTS

**Files:**
- Modify: `evaluation-agentique/gruyere-hero.js:7-23` (object `DEFAULTS`)

- [ ] **Step 1: Étendre DEFAULTS**

Localiser le bloc `const DEFAULTS = { ... }` (lignes 7-23 actuellement). Ajouter deux entrées :

```js
const DEFAULTS = {
  particleRate: 38,
  maxAccumulated: 300,
  landedLifetimeMs: 60000,
  plateOpacity: 0.08,
  showResetButton: false,
  orbitSpeed: 0.055,
  holeSeed: 'eval-2026',
  targetSurvivalRate: 0.05,
  // Beat narrative state: 1..5. Default 5 = full configuration (3 plates active).
  // Mount A (scrollytelling intro) overrides to 1; mount B (banner) stays at 5.
  initialBeat: 5,
  // Duration of the plate fade-in/out when setBeat() is called.
  beatTransitionMs: 600,
};
```

- [ ] **Step 2: Vérifier qu'aucun test JS ne casse**

```bash
node --test tests/gruyere-hero.test.mjs 2>&1 | tail -10
```

Expected : les tests `supports initialBeat option` et `supports beatTransitionMs option` passent maintenant. Les autres (`setBeat`, `getBeat`, `gates collision by plate.enabled`) continuent d'échouer.

- [ ] **Step 3: Commit**

```bash
git add evaluation-agentique/gruyere-hero.js
git commit -m "feat(eval/hero): DEFAULTS gagnent initialBeat + beatTransitionMs"
```

### Task 3 : Ajouter le champ `enabled` + `targetOpacity` sur chaque plaque

**Files:**
- Modify: `evaluation-agentique/gruyere-hero.js:552-605` (fonction `buildPlate`)

- [ ] **Step 1: Étendre l'objet retourné par buildPlate**

Localiser la fin de `buildPlate()` :

```js
  const group = new THREE.Group();
  group.add(mesh);
  group.add(rim);
  return { group, holes, z };
}
```

La remplacer par :

```js
  const group = new THREE.Group();
  group.add(mesh);
  group.add(rim);
  // enabled: false → collision skipped + opacity fades to 0.
  // currentOpacity / targetOpacity are interpolated each frame in tickPlateOpacity().
  // mesh and rim are kept on the returned object so tick can mutate their material.opacity directly.
  return {
    group,
    holes,
    z,
    mesh,
    rim,
    enabled: true,
    currentOpacity: PLATE_OPACITY,
    targetOpacity: PLATE_OPACITY,
  };
}
```

- [ ] **Step 2: Lancer les tests, le test "gates collision by plate.enabled" doit s'approcher**

```bash
node --test tests/gruyere-hero.test.mjs 2>&1 | grep "enabled"
```

Le regex `/\.enabled\b/` matche maintenant (le mot apparaît dans `buildPlate`). Le test passe.

- [ ] **Step 3: Commit**

```bash
git add evaluation-agentique/gruyere-hero.js
git commit -m "feat(eval/hero): chaque plaque expose enabled + currentOpacity + targetOpacity"
```

### Task 4 : Gate la collision sur `plate.enabled` dans `updateParticles`

**Files:**
- Modify: `evaluation-agentique/gruyere-hero.js:761-795` (boucle de collision dans `updateParticles`)

- [ ] **Step 1: Skip les plaques où enabled === false**

Localiser dans `updateParticles()` la boucle de détection de plate-crossing (commence par `for (let k = 0; k < platesData.length; k++)`). Ajouter un early-skip :

```js
        for (let k = 0; k < platesData.length; k++) {
          const plate = platesData[k];
          if (!plate.enabled) continue;   // ← NEW: collision désactivée quand la plaque n'est pas active
          if (prevZ < plate.z && p.z >= plate.z) {
            if (!hitsAnyHole(p.x, p.y, plate.holes)) {
              p.state = STATE_FADING;
              p.fadeStart = now;
              triggerBurst(blockedRings, p.x, p.y, plate.z);
              addMark(marks, p.x, p.y, plate.z, now);
              break;
            } else {
              triggerBurst(passedBursts, p.x, p.y, plate.z + 0.01);
            }
          }
        }
```

- [ ] **Step 2: Vérifier la régression visuelle (manuel via dev-hero.html)**

```bash
# Servir le dossier (depuis évaluation-agentique/, ou root)
python -m http.server 8000 &
# Ouvrir http://localhost:8000/evaluation-agentique/_dev-hero.html
```

Attendu : comportement identique à avant (par défaut toutes les plaques sont `enabled: true`). Animer ~10s, vérifier que les particules sont toujours bloquées par les plaques.

```bash
# Tuer le serveur après vérification
kill %1
```

- [ ] **Step 3: Commit**

```bash
git add evaluation-agentique/gruyere-hero.js
git commit -m "feat(eval/hero): gate collision sur plate.enabled (no-op par défaut)"
```

### Task 5 : Ajouter `tickPlateOpacity` (lerp damping) appelé dans `animate()`

**Files:**
- Modify: `evaluation-agentique/gruyere-hero.js` (helper avant `animate()` + appel dans la boucle)

- [ ] **Step 1: Définir le helper avant animate()**

Localiser la déclaration de `animate()` (vers la ligne 926). Juste avant, ajouter :

```js
  // Interpolation des opacités de plaques vers leur cible.
  // dt en secondes, transitionMs en ms — le taux de lerp est calibré pour
  // atteindre ~95 % de la cible en `transitionMs` (constante temporelle ~1/3).
  function tickPlateOpacity(dt) {
    const transitionS = Math.max(0.05, config.beatTransitionMs / 1000);
    // Exponential damping: rate = 1 - exp(-dt / tau). tau = transitionS / 3 → 95% in transitionS.
    const tau = transitionS / 3;
    const rate = 1 - Math.exp(-dt / tau);
    for (const plate of platesData) {
      const delta = plate.targetOpacity - plate.currentOpacity;
      plate.currentOpacity += delta * rate;
      // Snap to target when very close (avoid asymptotic creep).
      if (Math.abs(delta) < 0.001) plate.currentOpacity = plate.targetOpacity;
      plate.mesh.material.opacity = plate.currentOpacity;
      plate.rim.material.opacity = plate.currentOpacity * 0.7;  // rim slightly fainter than face
      plate.mesh.visible = plate.currentOpacity > 0.001;
      plate.rim.visible = plate.currentOpacity > 0.001;
    }
  }
```

- [ ] **Step 2: Appeler `tickPlateOpacity(dt)` dans la boucle `animate()`**

Localiser dans `animate()` la ligne `updateParticles(dt, now);` et insérer juste avant :

```js
    syncViewport();

    // Auto-rotate, unless the user is actively dragging.
    if (!dragActive) {
      orbitAngle += config.orbitSpeed * dt;
    }
    const orbitRadius = computeOrbitRadius(camera);
    const orbitY = orbitRadius * ORBIT_Y_RATIO;
    camera.position.set(
      ORBIT_CENTER.x + orbitRadius * Math.sin(orbitAngle),
      orbitY,
      ORBIT_CENTER.z + orbitRadius * Math.cos(orbitAngle),
    );
    camera.lookAt(ORBIT_CENTER);

    tickPlateOpacity(dt);              // ← NEW
    updateParticles(dt, now);
    updateBurst(blockedRings, dt, 3.5);
    updateBurst(passedBursts, dt, 5.0);
    updateMarks(marks, now, config.landedLifetimeMs);
    renderer.render(scene, camera);
  }
```

- [ ] **Step 3: Vérifier que la lib parse toujours**

```bash
node --check evaluation-agentique/gruyere-hero.js
```

Expected : pas d'erreur. (`--check` valide la syntaxe sans exécuter.)

- [ ] **Step 4: Commit**

```bash
git add evaluation-agentique/gruyere-hero.js
git commit -m "feat(eval/hero): tickPlateOpacity lerp les opacités vers targetOpacity"
```

### Task 6 : Exposer `setBeat()` et `getBeat()` + appliquer `initialBeat` au mount

**Files:**
- Modify: `evaluation-agentique/gruyere-hero.js` (dans `mountGruyereHero`, après la création de `platesData`, et dans le `return`)

- [ ] **Step 1: Définir helper `applyBeat` + state initial**

Localiser la zone juste après la boucle `for (let i = 0; i < 3; i++) { const plate = buildPlate(...); platesData.push(plate); scene.add(plate.group); }`.

Ajouter juste après :

```js
  // Beat state — drives which plates are enabled + visible.
  let currentBeat = 1;

  function applyBeat(n) {
    if (typeof n !== 'number' || n < 1 || n > 5) return;  // silent no-op for out-of-range
    currentBeat = n;
    // Plates 1..(n-1) become active (enabled + fade in). Plate index = beat index - 1 (so beat 2 enables plate index 0, etc.).
    // Beats: 1 → 0 active, 2 → 1 active (P1), 3 → 2 active (P1+P2), 4 or 5 → 3 active (all).
    const activeCount = Math.min(3, Math.max(0, n - 1));
    for (let i = 0; i < platesData.length; i++) {
      const wantActive = i < activeCount;
      platesData[i].enabled = wantActive;
      platesData[i].targetOpacity = wantActive ? PLATE_OPACITY : 0;
    }
  }

  // Apply the initial beat. If no override, beat 5 = legacy behavior (all plates).
  // We seed currentOpacity = targetOpacity so the first frame renders the correct state instantly
  // (no fade-in for initial mount; the fade is only triggered by later setBeat calls).
  applyBeat(config.initialBeat);
  for (const plate of platesData) {
    plate.currentOpacity = plate.targetOpacity;
    plate.mesh.material.opacity = plate.currentOpacity;
    plate.rim.material.opacity = plate.currentOpacity * 0.7;
    plate.mesh.visible = plate.currentOpacity > 0.001;
    plate.rim.visible = plate.currentOpacity > 0.001;
  }
```

- [ ] **Step 2: Étendre l'objet retourné**

Localiser le `return { destroy, pause, resume, reset }` à la fin de la fonction. Ajouter `setBeat` et `getBeat` :

```js
  return {
    destroy() { /* ... existing ... */ },
    pause() { /* ... existing ... */ },
    resume() { /* ... existing ... */ },
    reset() { /* ... existing ... */ },
    setBeat(n) { applyBeat(n); },
    getBeat() { return currentBeat; },
  };
```

- [ ] **Step 3: Lancer la suite de tests gruyere-hero**

```bash
node --test tests/gruyere-hero.test.mjs 2>&1 | tail -20
```

Expected : tous les tests précédents passent + les 5 nouveaux tests de l'API beat passent.

- [ ] **Step 4: Commit**

```bash
git add evaluation-agentique/gruyere-hero.js
git commit -m "feat(eval/hero): setBeat(n) + getBeat() + initialBeat appliqué au mount"
```

### Task 7 : Vérifier la rétrocompat sur app + carte zoomable

**Files:**
- (lecture seule)

- [ ] **Step 1: Servir et inspecter visuellement**

```bash
python -m http.server 8000 &
# Ouvrir http://localhost:8000/evaluation-agentique/20260501-evaluation-agentique-app.html
# Ouvrir http://localhost:8000/evaluation-agentique/20260521-evaluation-agentique-canvas.html
```

Attendu : la bannière hero des deux pages doit toujours afficher les 3 plaques + particules + accumulation, exactement comme avant la Phase 1.

```bash
kill %1
```

- [ ] **Step 2: Commit checkpoint si OK (pas de changement, juste marque de fin de phase)**

Pas de commit ici — Phase 1 est entièrement testée et committée. Continuer à la Phase 2.

---

## Phase 2 — CSS et HTML du scrollytelling

### Task 8 : Bloc CSS `.hero-intro*` dans `gruyere-hero.css`

**Files:**
- Modify: `evaluation-agentique/gruyere-hero.css` (ajouts à la fin)

- [ ] **Step 1: Ajouter le bloc de styles**

À la fin du fichier `gruyere-hero.css` (après le `@media (max-width: 768px)` existant), ajouter :

```css

/* ─── Scrollytelling intro (hub evaluation-agentique uniquement) ─────── */

.hero-intro {
  position: relative;
  height: 500vh;        /* 5 beats × 100vh */
  overflow: clip;       /* iOS Safari sticky fix (cf. CLAUDE.md anatomie/scrolly override) */
}

.hero-intro__sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.hero-intro__sticky .gruyere-hero {
  height: 100%;         /* override le clamp() de la bannière */
}

.hero-intro__caption {
  position: absolute;
  left: clamp(20px, 4vw, 56px);
  bottom: clamp(40px, 8vh, 96px);
  max-width: 480px;
  padding: 22px 26px 24px;
  background: rgba(250, 246, 236, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-left: 3px solid var(--accent, #b8582e);
  box-shadow: 0 12px 32px rgba(30, 25, 18, 0.10);
  transition: opacity 180ms ease;
}

.hero-intro__title {
  margin: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 400;
  font-size: clamp(22px, 3vw, 32px);
  line-height: 1.18;
  letter-spacing: -0.015em;
  color: #1e1e2a;
}

.hero-intro__lede {
  margin: 10px 0 0;
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  font-size: 14.5px;
  line-height: 1.55;
  color: #3b3f4d;
}

.hero-intro__trigger {
  position: absolute;
  left: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
  opacity: 0;
}
.hero-intro__trigger[data-beat="1"] { top: 10vh; }
.hero-intro__trigger[data-beat="2"] { top: 110vh; }
.hero-intro__trigger[data-beat="3"] { top: 210vh; }
.hero-intro__trigger[data-beat="4"] { top: 310vh; }
.hero-intro__trigger[data-beat="5"] { top: 410vh; }

.gruyere-hero--banner .gruyere-hero__caption {
  display: none;        /* caption masquée sur la bannière du hub (redonde avec beat 5) */
}

@media (max-width: 768px) {
  .hero-intro { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-intro { display: none; }
}
```

- [ ] **Step 2: Lint visuel (pas de validateur CSS dans le repo, on inspecte à la main)**

Relire le bloc. Vérifier les points critiques :
- `overflow: clip` (pas `hidden`) sur `.hero-intro`
- `overflow: hidden` sur `.hero-intro__sticky`
- `.gruyere-hero--banner .gruyere-hero__caption { display: none }` cible bien la classe modifier de la bannière (pas l'intro)

- [ ] **Step 3: Commit**

```bash
git add evaluation-agentique/gruyere-hero.css
git commit -m "feat(eval/hero): CSS scrollytelling intro (.hero-intro*) + caption masquée sur bannière"
```

### Task 9 : Tests contractuels du nouveau module `hero-intro.js`

**Files:**
- Create: `tests/hero-intro.test.mjs`

- [ ] **Step 1: Créer le fichier de test**

Créer `tests/hero-intro.test.mjs` avec ce contenu :

```js
import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const HERO_INTRO_JS_PATH = join(ROOT, 'evaluation-agentique/hero-intro.js');

test('hero-intro.js exists', () => {
  assert.ok(existsSync(HERO_INTRO_JS_PATH), 'hero-intro.js must exist at evaluation-agentique/hero-intro.js');
});

const HERO_INTRO_JS = readFileSync(HERO_INTRO_JS_PATH, 'utf8');

test('hero-intro.js exports mountHeroIntro', () => {
  assert.match(HERO_INTRO_JS, /export\s+function\s+mountHeroIntro/);
});

test('hero-intro.js imports mountGruyereHero', () => {
  assert.match(HERO_INTRO_JS, /import\s*\{\s*mountGruyereHero\s*\}\s*from\s*['"]\.\/gruyere-hero\.js['"]/);
});

test('hero-intro.js declares 5 beats with title and lede', () => {
  // Should declare an array (or similar) of 5 narrative entries.
  // We check for the BEATS identifier and at least 5 occurrences of "title:" inside the source.
  assert.match(HERO_INTRO_JS, /BEATS\s*=\s*\[/);
  const titleMatches = HERO_INTRO_JS.match(/title:\s*['"`]/g) || [];
  assert.ok(titleMatches.length >= 5, `expected ≥5 title: entries, got ${titleMatches.length}`);
  const ledeMatches = HERO_INTRO_JS.match(/lede:\s*['"`]/g) || [];
  assert.ok(ledeMatches.length >= 5, `expected ≥5 lede: entries, got ${ledeMatches.length}`);
});

test('hero-intro.js wires IntersectionObserver on triggers', () => {
  assert.match(HERO_INTRO_JS, /new IntersectionObserver/);
  // The beat IO must use a centered-band rootMargin to fire on viewport center.
  assert.match(HERO_INTRO_JS, /rootMargin:\s*['"`]-50%/);
});

test('hero-intro.js calls setBeat on the intro mount', () => {
  assert.match(HERO_INTRO_JS, /\.setBeat\s*\(/);
});

test('hero-intro.js guards mobile and reduced-motion paths', () => {
  assert.match(HERO_INTRO_JS, /max-width:\s*768px/);
  assert.match(HERO_INTRO_JS, /prefers-reduced-motion/);
});

test('hero-intro.js applies aria-live update via caption swap', () => {
  // The caption element should have its content swapped — we look for either
  // .textContent assignment or innerHTML write on title/lede references.
  assert.match(HERO_INTRO_JS, /textContent\s*=/);
});
```

- [ ] **Step 2: Lancer le test pour confirmer l'échec**

```bash
node --test tests/hero-intro.test.mjs 2>&1 | tail -20
```

Expected : `hero-intro.js exists` échoue (le fichier n'existe pas). Les autres tests échouent en cascade (require le fichier).

- [ ] **Step 3: Commit les tests rouges**

```bash
git add tests/hero-intro.test.mjs
git commit -m "test(eval/hero): contracts pour hero-intro.js (mount, IO, BEATS, mobile guard)"
```

### Task 10 : Créer le module `hero-intro.js`

**Files:**
- Create: `evaluation-agentique/hero-intro.js`

- [ ] **Step 1: Créer le module**

Créer `evaluation-agentique/hero-intro.js` avec ce contenu (~110 lignes) :

```js
// hero-intro.js — orchestre le scrollytelling du hub evaluation-agentique.
// Spec : docs/superpowers/specs/2026-05-21-gruyere-hero-scrollytelling-design.md
//
// Embed via :
//   <script type="module">
//     import { mountHeroIntro } from './hero-intro.js';
//     mountHeroIntro({
//       introContainer: document.getElementById('hero-intro'),
//       bannerContainer: document.getElementById('gruyere-hero'),
//     });
//   </script>

import { mountGruyereHero } from './gruyere-hero.js';

const BEATS = [
  {
    title: 'Les attaques se multiplient.',
    lede: 'Hallucinations, prompt injection, mauvais usage d’outils, fuites… Les agents IA exposent une surface d’attaque qui s’élargit chaque mois.',
  },
  {
    title: 'On met en place des sécurités.',
    lede: 'Première couche : prévention. Filtres d’input, garde-fous système, contraintes sur les outils. Beaucoup d’attaques passent encore.',
  },
  {
    title: 'Avec la maturité, on ajoute des couches.',
    lede: 'Curatif : on observe les trajectoires, on intercepte ce qui dérive en cours d’exécution. Moins de fuites — mais les trous restent.',
  },
  {
    title: 'Et encore une.',
    lede: 'Qualitatif : juges LLM, evals offline, audit humain ponctuel. Trois couches imparfaites, chacune avec ses angles morts.',
  },
  {
    title: 'Aucune n’est parfaite. Combinées, elles filtrent.',
    lede: '~1 % des attaques atteignent la cible. Évaluer un agent, c’est instrumenter ces 3 couches et mesurer ce qui passe quand même.',
  },
];

const CAPTION_FADE_MS = 180;

export function mountHeroIntro({ introContainer, bannerContainer }) {
  // bannerContainer EST le <figure class="gruyere-hero gruyere-hero--banner"> (pas un wrapper).
  // introContainer EST <section class="hero-intro"> qui contient le <figure>.

  const isMobile = matchMedia('(max-width: 768px)').matches;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile ou reduced-motion : on n'instancie pas le scrollytelling.
  // L'intro est masquée par CSS @media — par sécurité on met aussi hidden.
  if (isMobile || reducedMotion) {
    if (introContainer) introContainer.hidden = true;
    const banner = mountGruyereHero(bannerContainer, { initialBeat: 5 });
    return {
      banner,
      intro: null,
      destroy() { banner.destroy(); },
    };
  }

  const introFigure = introContainer.querySelector('.gruyere-hero');
  const heroIntro = mountGruyereHero(introFigure, { initialBeat: 1 });
  const heroBanner = mountGruyereHero(bannerContainer, { initialBeat: 5 });

  // Mute la bannière avant son premier render — la section intro est en vue au load.
  heroBanner.pause();

  const captionEl = introContainer.querySelector('.hero-intro__caption');
  const titleEl = captionEl.querySelector('.hero-intro__title');
  const ledeEl = captionEl.querySelector('.hero-intro__lede');

  function updateCaption(n) {
    const b = BEATS[n - 1];
    if (!b) return;
    captionEl.style.opacity = '0';
    setTimeout(() => {
      titleEl.textContent = b.title;
      ledeEl.textContent = b.lede;
      captionEl.style.opacity = '1';
    }, CAPTION_FADE_MS);
  }

  // Caption initiale (avant tout intersect)
  titleEl.textContent = BEATS[0].title;
  ledeEl.textContent = BEATS[0].lede;
  captionEl.style.opacity = '1';

  // IO 1 : beat triggers — bande horizontale centrale du viewport (~1px de haut)
  const beatIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const n = Number(e.target.dataset.beat);
      if (Number.isFinite(n) && n >= 1 && n <= 5) {
        heroIntro.setBeat(n);
        updateCaption(n);
      }
    }
  }, {
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0,
  });
  introContainer.querySelectorAll('.hero-intro__trigger').forEach((t) => beatIO.observe(t));

  // IO 2 : pause/resume bascule entre intro et bannière
  const sectionIO = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      heroIntro.resume();
      heroBanner.pause();
    } else {
      heroIntro.pause();
      heroBanner.resume();
    }
  }, { threshold: 0 });
  sectionIO.observe(introContainer);

  return {
    intro: heroIntro,
    banner: heroBanner,
    destroy() {
      beatIO.disconnect();
      sectionIO.disconnect();
      heroIntro.destroy();
      heroBanner.destroy();
    },
  };
}
```

- [ ] **Step 2: Lancer les tests, ils doivent passer**

```bash
node --test tests/hero-intro.test.mjs 2>&1 | tail -20
```

Expected : tous les tests passent.

- [ ] **Step 3: Vérifier syntaxe + parsing**

```bash
node --check evaluation-agentique/hero-intro.js
```

Expected : pas d'erreur.

- [ ] **Step 4: Commit**

```bash
git add evaluation-agentique/hero-intro.js
git commit -m "feat(eval/hero): module hero-intro.js (IO + 2 mounts + caption swap)"
```

### Task 11 : Adapter `tests/gruyere-hero.test.mjs` à la nouvelle structure du hub

**Files:**
- Modify: `tests/gruyere-hero.test.mjs:77-106` (boucle `for (const page of HOST_PAGES)`)

- [ ] **Step 1: Sortir `index.html` de la boucle générique et lui donner ses propres assertions**

Localiser le bloc :

```js
const HOST_PAGES = [
  'evaluation-agentique/index.html',
  'evaluation-agentique/20260501-evaluation-agentique-app.html',
  'evaluation-agentique/20260521-evaluation-agentique-canvas.html',
];

for (const page of HOST_PAGES) {
  // ... assertions ...
}
```

Le remplacer par :

```js
// Pages qui montent directement gruyere-hero sur <figure id="gruyere-hero"> (app + carte zoomable).
const DIRECT_HOST_PAGES = [
  'evaluation-agentique/20260501-evaluation-agentique-app.html',
  'evaluation-agentique/20260521-evaluation-agentique-canvas.html',
];

for (const page of DIRECT_HOST_PAGES) {
  const html = readFileSync(join(ROOT, page), 'utf8');

  test(`${page}: includes gruyere-hero.css`, () => {
    assert.match(html, /href=["']gruyere-hero\.css["']/);
  });

  test(`${page}: declares importmap for three`, () => {
    assert.match(html, /importmap[\s\S]*"three"[\s\S]*three\.module\.js/);
  });

  test(`${page}: contains <figure class="gruyere-hero" id="gruyere-hero">`, () => {
    assert.match(html, /<figure[^>]*class="gruyere-hero"[^>]*id="gruyere-hero"/);
  });

  test(`${page}: mounts mountGruyereHero on the figure`, () => {
    assert.match(html, /import\s*\{\s*mountGruyereHero\s*\}\s*from\s*['"]\.\/gruyere-hero\.js['"]/);
    assert.match(html, /mountGruyereHero\(\s*document\.getElementById\(['"]gruyere-hero['"]\)/);
  });

  test(`${page}: has <noscript> poster fallback`, () => {
    assert.match(html, /<noscript>\s*<img[^>]*gruyere-hero-poster\.svg/);
  });
}

// Hub : structure scrollytelling spécifique
{
  const page = 'evaluation-agentique/index.html';
  const html = readFileSync(join(ROOT, page), 'utf8');

  test(`${page}: includes gruyere-hero.css`, () => {
    assert.match(html, /href=["']gruyere-hero\.css["']/);
  });

  test(`${page}: declares importmap for three`, () => {
    assert.match(html, /importmap[\s\S]*"three"[\s\S]*three\.module\.js/);
  });

  test(`${page}: contains intro section with 5 beat triggers`, () => {
    assert.match(html, /<section[^>]*class="hero-intro"[^>]*id="hero-intro"/);
    for (let n = 1; n <= 5; n++) {
      assert.match(html, new RegExp(`<div[^>]*class="hero-intro__trigger"[^>]*data-beat="${n}"`),
        `intro section must contain a trigger for beat ${n}`);
    }
  });

  test(`${page}: contains fullscreen figure inside sticky wrapper`, () => {
    assert.match(html, /<div[^>]*class="hero-intro__sticky"/);
    assert.match(html, /<figure[^>]*class="gruyere-hero"[^>]*id="gruyere-hero-intro"/);
  });

  test(`${page}: contains banner figure with id gruyere-hero`, () => {
    assert.match(html, /<figure[^>]*class="gruyere-hero gruyere-hero--banner"[^>]*id="gruyere-hero"/);
  });

  test(`${page}: caption overlay has aria-live polite`, () => {
    assert.match(html, /<div[^>]*class="hero-intro__caption"[^>]*aria-live="polite"/);
  });

  test(`${page}: mounts mountHeroIntro from hero-intro.js`, () => {
    assert.match(html, /import\s*\{\s*mountHeroIntro\s*\}\s*from\s*['"]\.\/hero-intro\.js['"]/);
    assert.match(html, /mountHeroIntro\(/);
  });

  test(`${page}: has <noscript> poster fallback in intro figure`, () => {
    assert.match(html, /<noscript>\s*<img[^>]*gruyere-hero-poster\.svg/);
  });
}
```

- [ ] **Step 2: Lancer la suite — DOIT toujours échouer car `index.html` n'est pas encore restructuré**

```bash
node --test tests/gruyere-hero.test.mjs 2>&1 | tail -20
```

Expected : les assertions sur `index.html` échouent (la nouvelle structure n'existe pas encore). Les pages app+canvas passent toujours.

- [ ] **Step 3: Commit les tests rouges**

```bash
git add tests/gruyere-hero.test.mjs
git commit -m "test(eval/hero): assertions séparées hub (scrollytelling) vs app/carte (mount direct)"
```

### Task 12 : Restructurer `index.html` (DOM scrollytelling + bannière)

**Files:**
- Modify: `evaluation-agentique/index.html:99-174` (entre `</header>` et `<main>` + le `<script type="module">` de mount)

- [ ] **Step 1: Remplacer le bloc `<figure id="gruyere-hero">` + `<main>` par la nouvelle structure**

Localiser (lignes 99-112 actuellement) :

```html
<header class="topbar" id="topbar">
  <a href="../index.html">Mathieu <em>Guglielmino</em></a>
  <a href="../index.html#series" class="back">← Retour aux dossiers</a>
</header>

<figure class="gruyere-hero" id="gruyere-hero" role="img"
        aria-label="Diagramme animé du modèle gruyère : 3 couches de défense filtrent les attaques, certaines passent.">
  <noscript><img src="gruyere-hero-poster.svg" alt="3 plaques perforées en perspective, particules accumulées sur l'écran arrière"></noscript>
  <figcaption class="gruyere-hero__caption">
    3 couches de défense · 7 attaques · ~1% des survivants s'accumulent
  </figcaption>
</figure>

<main class="wrap">
```

Le remplacer par :

```html
<header class="topbar" id="topbar">
  <a href="../index.html">Mathieu <em>Guglielmino</em></a>
  <a href="../index.html#series" class="back">← Retour aux dossiers</a>
</header>

<section class="hero-intro" id="hero-intro" aria-label="Introduction animée du dossier">
  <div class="hero-intro__sticky">
    <figure class="gruyere-hero" id="gruyere-hero-intro" role="img"
            aria-label="Diagramme animé du modèle gruyère : 3 couches de défense filtrent les attaques, certaines passent.">
      <noscript><img src="gruyere-hero-poster.svg" alt="3 plaques perforées en perspective, particules accumulées sur l'écran arrière"></noscript>
    </figure>
    <div class="hero-intro__caption" id="hero-caption" aria-live="polite">
      <h2 class="hero-intro__title"></h2>
      <p class="hero-intro__lede"></p>
    </div>
  </div>
  <div class="hero-intro__trigger" data-beat="1"></div>
  <div class="hero-intro__trigger" data-beat="2"></div>
  <div class="hero-intro__trigger" data-beat="3"></div>
  <div class="hero-intro__trigger" data-beat="4"></div>
  <div class="hero-intro__trigger" data-beat="5"></div>
</section>

<figure class="gruyere-hero gruyere-hero--banner" id="gruyere-hero" role="img"
        aria-label="Diagramme animé du modèle gruyère : 3 couches de défense filtrent les attaques, certaines passent.">
  <noscript><img src="gruyere-hero-poster.svg" alt="3 plaques perforées en perspective, particules accumulées sur l'écran arrière"></noscript>
  <figcaption class="gruyere-hero__caption">
    3 couches de défense · 7 attaques · ~1% des survivants s'accumulent
  </figcaption>
</figure>

<main class="wrap">
```

Note importante : la **bannière** garde `id="gruyere-hero"` pour rétrocompat avec d'autres systèmes éventuels. L'**intro figure** prend `id="gruyere-hero-intro"`.

- [ ] **Step 2: Remplacer le script de mount**

Localiser le bloc (vers la ligne 171-174) :

```html
<script type="module">
  import { mountGruyereHero } from './gruyere-hero.js';
  mountGruyereHero(document.getElementById('gruyere-hero'));
</script>
<script src="/admin.js" defer></script>
```

Le remplacer par :

```html
<script type="module">
  import { mountHeroIntro } from './hero-intro.js';
  mountHeroIntro({
    introContainer: document.getElementById('hero-intro'),
    bannerContainer: document.getElementById('gruyere-hero'),
  });
</script>
<script src="/admin.js" defer></script>
```

- [ ] **Step 3: Lancer la suite complète**

```bash
node --test tests/gruyere-hero.test.mjs tests/hero-intro.test.mjs 2>&1 | tail -20
```

Expected : tous les tests passent (hub scrollytelling + app/canvas mount direct + hero-intro.js contract).

- [ ] **Step 4: Vérifier que le HTML reste valide (vérification visuelle)**

Inspecter `evaluation-agentique/index.html` :
- Pas de balise ouverte non fermée
- Tous les `<noscript>` ont leur `<img>`
- L'indentation reste cohérente

- [ ] **Step 5: Commit**

```bash
git add evaluation-agentique/index.html
git commit -m "feat(eval/hero): hub restructuré — section scrollytelling intro + bannière résiduelle"
```

---

## Phase 3 — Vérification fonctionnelle + finalisation

### Task 13 : Lancer la suite de tests complète

**Files:**
- (lecture seule)

- [ ] **Step 1: Tests d'intégration de tout le repo**

```bash
node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs tests/gruyere-hero.test.mjs tests/hero-intro.test.mjs 2>&1 | tail -30
```

Expected : tous passent. Si un test échoue, lire le message, corriger le fichier source, re-commit.

- [ ] **Step 2: Lancer toute la suite repo**

```bash
node --test tests/ 2>&1 | tail -15
```

Expected : aucune régression sur les autres tests.

### Task 14 : Vérification manuelle desktop (Chrome)

**Files:**
- (visuel seulement)

- [ ] **Step 1: Servir le repo**

```bash
python -m http.server 8000 &
```

- [ ] **Step 2: Ouvrir le hub et scroller**

Ouvrir `http://localhost:8000/evaluation-agentique/`. Vérifier :
- Au load : canvas plein écran avec aucune plaque visible, particules qui traversent. Caption beat 1 affichée en bas-gauche.
- Scroll lent vers le bas : à ~1 viewport, beat 2 prend la main, plaque 1 fade-in (~600 ms), caption swap.
- Continuer : beat 3 ajoute P2, beat 4 ajoute P3, beat 5 = synthèse.
- Sortie sticky : la bannière compacte au-dessus du titre prend le relai, l'intro s'efface.
- Scroll inverse : ordre inverse, plaques fade-out, captions reculent.

- [ ] **Step 3: Vérifier le mode mobile via devtools**

Chrome DevTools → Toggle device toolbar → iPhone 12 Pro. Recharger.
Attendu : `.hero-intro` est `display: none`, le hub démarre directement par la bannière, scroll normal. **Pas** d'intro scrollytelling.

- [ ] **Step 4: Vérifier reduced-motion**

DevTools → Rendering tab → Emulate CSS media feature `prefers-reduced-motion` → `reduce`. Recharger.
Attendu : `.hero-intro` est `display: none`, la bannière fallback sur le poster SVG (statique).

- [ ] **Step 5: Vérifier app + carte zoomable (rétrocompat)**

Ouvrir `http://localhost:8000/evaluation-agentique/20260501-evaluation-agentique-app.html` et `…-canvas.html`. La bannière hero doit s'animer comme avant (3 plaques + particules + accumulation).

```bash
kill %1
```

- [ ] **Step 6: Pas de commit (vérification visuelle uniquement). Si défaut détecté, créer un commit fix ciblé.**

### Task 15 : Checklist mobile 7 points (CLAUDE.md)

**Files:**
- (visuel seulement)

- [ ] **Step 1: Servir + ouvrir DevTools mode mobile**

```bash
python -m http.server 8000 &
```

Ouvrir `http://localhost:8000/evaluation-agentique/` en mode mobile DevTools (iPhone 12 Pro ou équivalent ~375×812).

- [ ] **Step 2: Cocher les 7 points** (cf. `.claude/skills/illustrated-deep-research/references/mobile.md`)

1. Topbar non chevauchée par le contenu
2. Lecture confortable (font-size, line-length)
3. Pas de scroll horizontal
4. Boutons cliquables ≥ 44×44px
5. Footer accessible sans scroll infini
6. Images responsives
7. Pas de tracker/3rd party

- [ ] **Step 3: Kill serveur**

```bash
kill %1
```

### Task 16 : SEO regen (idempotent)

**Files:**
- `evaluation-agentique/index.html` (potentiellement bloc og:* mis à jour)
- `evaluation-agentique/og.png` (potentiellement régénéré)

- [ ] **Step 1: Lancer le pipeline SEO**

```bash
python tools/seo_dossiers.py --only evaluation-agentique
```

Attendu : si le titre/description n'ont pas changé, idempotent (aucun diff). Sinon, met à jour les blocs `<!-- og:start --> ... <!-- og:end -->` et régénère `og.png`.

- [ ] **Step 2: Vérifier le diff**

```bash
git status --short evaluation-agentique/
git diff evaluation-agentique/index.html 2>&1 | head -40
```

- [ ] **Step 3: Si diff non vide, commit**

```bash
git add evaluation-agentique/index.html evaluation-agentique/og.png
git commit -m "chore(eval): SEO regen après restructuration hub"
```

Sinon, sauter ce step.

### Task 17 : Pousser la branche

**Files:**
- (push remote)

- [ ] **Step 1: Vérifier branche + log**

```bash
git branch --show-current
git log --oneline main..HEAD
```

Expected : branche `claude/gruyere-hero-3d-2026-05-21`, ~10-12 commits depuis main pour cette feature.

- [ ] **Step 2: Push vers la branche distante**

```bash
git push origin claude/gruyere-hero-3d-2026-05-21
```

Expected : succès (le push vers une branche `claude/...` fonctionne, contrairement à `main`).

- [ ] **Step 3: NE PAS créer la PR automatiquement**

Selon `CLAUDE.md` : Mathieu merge à la main. Ne pas invoquer `mcp__github__create_pull_request` ici — laisser l'utilisateur décider quand ouvrir la PR.

Si l'utilisateur demande explicitement la PR, l'ouvrir via `mcp__github__create_pull_request` avec :
- owner: `mathieugug`
- repo: `mathieugug.github.io`
- head: `claude/gruyere-hero-3d-2026-05-21`
- base: `main`
- title: `feat(eval/hero): scrollytelling intro pour le hub evaluation-agentique`
- body: récap des 5 beats + tests + checklist mobile cochée

---

## Self-review

**Spec coverage** :
- ✅ Architecture DOM 2 figures (intro + bannière) → Task 12
- ✅ Mounts indépendants A+B avec pause/resume → Task 10
- ✅ API beat (setBeat/getBeat/initialBeat/beatTransitionMs) → Tasks 2-6
- ✅ Sémantique des beats (collision gate + fade) → Tasks 3-6
- ✅ Mécanique scroll (IO + rootMargin centré) → Task 10
- ✅ CSS .hero-intro* (overflow clip, sticky, caption overlay) → Task 8
- ✅ Mobile + reduced-motion guard → Tasks 8 + 10
- ✅ Tests automatisés (contract + intégration) → Tasks 1, 9, 11
- ✅ Vérifications manuelles desktop/mobile → Tasks 14-15
- ✅ SEO regen idempotent → Task 16
- ✅ Workflow git (branch existante, pas de PR auto) → Task 17

**Placeholder scan** : aucun "TBD" / "TODO" / "implement later" dans le plan. Tous les blocs de code sont complets.

**Type/signature consistency** :
- `mountGruyereHero(container, opts)` retourne `{ destroy, pause, resume, reset, setBeat, getBeat }` — cohérent entre Tasks 6 et 10.
- `mountHeroIntro({ introContainer, bannerContainer })` retourne `{ intro, banner, destroy }` — cohérent entre Tasks 9 et 10.
- BEATS array de 5 entrées `{ title, lede }` — cohérent entre tests (Task 9) et implémentation (Task 10).
- `data-beat="N"` (N ∈ 1..5) — cohérent entre CSS (Task 8), HTML (Task 12), JS (Task 10) et tests (Tasks 9, 11).
- `currentBeat`, `applyBeat`, `tickPlateOpacity` — noms internes cohérents dans Tasks 5-6.

**Spec gaps** : aucun écart identifié entre la spec et le plan.
