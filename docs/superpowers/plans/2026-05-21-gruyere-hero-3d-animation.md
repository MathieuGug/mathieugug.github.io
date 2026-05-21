# Gruyère Hero 3D Animation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implémenter une bannière vedette animée 3D (gruyère de Reason — 3 plaques percées + particules + accumulation) partagée par les 3 pages du dossier `evaluation-agentique/`.

**Architecture:** Module ESM Three.js autonome (`evaluation-agentique/gruyere-hero.js`) chargé via CDN jsDelivr, exposé par `mountGruyereHero(container, opts)`. Trous générés par seed déterministe pour signature visuelle stable. Fallback poster SVG si `prefers-reduced-motion` ou WebGL absent.

**Tech Stack:** Three.js r160 (ESM via jsDelivr), `THREE.Points` (particules), `ShapeGeometry` + `EdgesGeometry` (plaques), HTML/CSS vanille, `node:test` pour la couverture structure. Pas de bundler.

**Spec source:** `docs/superpowers/specs/2026-05-21-gruyere-hero-3d-animation-design.md`

---

## Task 1: Branch setup + module skeleton

**Files:**
- Create: `evaluation-agentique/gruyere-hero.js`
- Create: `evaluation-agentique/gruyere-hero.css`

- [ ] **Step 1: Verify branch**

Run: `git rev-parse --abbrev-ref HEAD`
Expected output: `claude/gruyere-hero-3d-2026-05-21`

If on another branch, stop and ask user. Do not commit on `main` or on `claude/eval-canvas-redesign-2026-05-20`.

- [ ] **Step 2: Create gruyere-hero.js skeleton**

Write `evaluation-agentique/gruyere-hero.js`:

```js
// gruyere-hero.js — animation 3D vedette du dossier evaluation-agentique.
// Spec : docs/superpowers/specs/2026-05-21-gruyere-hero-3d-animation-design.md
// Embed via : <script type="module"> import {mountGruyereHero} from './gruyere-hero.js'; mountGruyereHero(el); </script>

import * as THREE from 'three';

const DEFAULTS = {
  particleRate: 25,
  maxAccumulated: 300,
  resetIntervalMs: 30000,
  plateOpacity: 0.08,
  showResetButton: false,
  orbitSpeed: 0.015,
  holeSeed: 'eval-2026',
};

export function mountGruyereHero(container, opts = {}) {
  const config = { ...DEFAULTS, ...opts };
  // TODO Task 2: capability detection + fallback
  // TODO Task 4-9: scene, plates, particles, accumulation, camera
  return {
    destroy() {},
    pause() {},
    resume() {},
    reset() {},
  };
}
```

- [ ] **Step 3: Create gruyere-hero.css skeleton**

Write `evaluation-agentique/gruyere-hero.css`:

```css
/* gruyere-hero.css — bannière vedette du dossier evaluation-agentique. */

.gruyere-hero {
  position: relative;
  width: 100%;
  margin: 0;
  padding: 0;
  height: clamp(380px, 55vh, 620px);
  background: var(--bg, #faf6ec);
  overflow: hidden;
}

.gruyere-hero canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.gruyere-hero__caption {
  display: block;
  max-width: 760px;
  margin: 12px auto 0;
  padding: 0 16px;
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: 14px;
  opacity: 0.6;
  text-align: center;
}

@media (max-width: 768px) {
  .gruyere-hero {
    height: clamp(280px, 45vh, 420px);
  }
}
```

- [ ] **Step 4: Sanity-check JS parses**

Run: `node --check evaluation-agentique/gruyere-hero.js`
Expected: no output (success).

Note: import statement requires `--input-type=module`. Use:

```bash
node --input-type=module -e "$(cat evaluation-agentique/gruyere-hero.js)" 2>&1 | head -5
```

Expected: an error about resolving 'three' (because we don't have Three.js installed locally). That's normal — we only need to verify there's no syntax error before the import resolves. The error "Cannot find package 'three'" or "Module not found" confirms parse succeeded.

- [ ] **Step 5: Commit**

```bash
git add evaluation-agentique/gruyere-hero.js evaluation-agentique/gruyere-hero.css
git commit -m "feat(eval/hero): scaffold gruyere-hero module + CSS"
```

---

## Task 2: Capability detection + poster fallback path

**Files:**
- Modify: `evaluation-agentique/gruyere-hero.js`
- Create: `tests/gruyere-hero.test.mjs`

- [ ] **Step 1: Write failing test for detection helpers**

Write `tests/gruyere-hero.test.mjs`:

```js
import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const HERO_JS = readFileSync(join(ROOT, 'evaluation-agentique/gruyere-hero.js'), 'utf8');

test('gruyere-hero.js exports mountGruyereHero', () => {
  assert.match(HERO_JS, /export\s+function\s+mountGruyereHero/);
});

test('gruyere-hero.js detects prefers-reduced-motion', () => {
  assert.match(HERO_JS, /prefers-reduced-motion/);
});

test('gruyere-hero.js detects WebGL availability', () => {
  assert.match(HERO_JS, /getContext\(['"]webgl/);
});

test('gruyere-hero.js has poster fallback path', () => {
  assert.match(HERO_JS, /gruyere-hero-poster\.svg/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/gruyere-hero.test.mjs`
Expected: 4 tests, 3 failing (reduced-motion, webgl, poster references not in code yet). Test 1 passes.

- [ ] **Step 3: Implement detection + poster mount**

Modify `evaluation-agentique/gruyere-hero.js` — replace the body of `mountGruyereHero` and add helpers:

```js
function detectCapabilities() {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const probe = document.createElement('canvas');
  const webgl = !!(probe.getContext('webgl2') || probe.getContext('webgl'));
  const mobile = matchMedia('(max-width: 768px)').matches ||
                 (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);
  return { reducedMotion, webgl, mobile };
}

function mountPoster(container, scriptDir) {
  const img = document.createElement('img');
  img.src = scriptDir + 'gruyere-hero-poster.svg';
  img.alt = '3 plaques perforées en perspective, particules accumulées sur l\'écran arrière';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';
  // Preserve any pre-existing <noscript> + <figcaption>
  const caption = container.querySelector('.gruyere-hero__caption');
  container.insertBefore(img, caption);
  return { destroy() { img.remove(); }, pause() {}, resume() {}, reset() {} };
}

export function mountGruyereHero(container, opts = {}) {
  const config = { ...DEFAULTS, ...opts };
  const caps = detectCapabilities();
  // The script is co-located with the SVG poster in evaluation-agentique/.
  // import.meta.url gives us the directory to resolve the poster from.
  const scriptDir = new URL('.', import.meta.url).href;
  if (caps.reducedMotion || !caps.webgl) {
    return mountPoster(container, scriptDir);
  }
  // TODO Task 4: real animation
  return { destroy() {}, pause() {}, resume() {}, reset() {} };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/gruyere-hero.test.mjs`
Expected: 4 tests, 4 pass.

- [ ] **Step 5: Commit**

```bash
git add evaluation-agentique/gruyere-hero.js tests/gruyere-hero.test.mjs
git commit -m "feat(eval/hero): capability detection + poster fallback path"
```

---

## Task 3: Seeded RNG + Poisson hole generation

**Files:**
- Modify: `evaluation-agentique/gruyere-hero.js`
- Modify: `tests/gruyere-hero.test.mjs`

- [ ] **Step 1: Write failing tests for seed determinism**

Append to `tests/gruyere-hero.test.mjs`:

```js
test('gruyere-hero.js declares mulberry32 RNG', () => {
  assert.match(HERO_JS, /function\s+mulberry32/);
});

test('gruyere-hero.js generates holes per plate', () => {
  assert.match(HERO_JS, /function\s+generateHoles/);
});

test('gruyere-hero.js applies alignment ratio between plates', () => {
  // Must reference both alignment hints from the spec.
  assert.match(HERO_JS, /0\.30|0\.3/, 'expected ~30% plate-2 alignment with plate-1');
  assert.match(HERO_JS, /0\.15/, 'expected ~15% plate-3 alignment with plate-2');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/gruyere-hero.test.mjs`
Expected: 3 new tests failing (no mulberry32 / generateHoles / ratio constants).

- [ ] **Step 3: Implement RNG + hole generation**

Add to `evaluation-agentique/gruyere-hero.js` near the top, after `DEFAULTS`:

```js
// Deterministic RNG: mulberry32. Same seed string → same hole layout on all 3 pages.
function hashSeed(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h ^= h >>> 16) >>> 0;
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return function() {
    t = (t + 0x6D2B79F5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// Poisson-ish: reject samples too close to existing holes.
// Plate dimensions: 4×4 unit square centered on origin (x,y in [-2, 2]).
// Holes: 4-8 per plate, radius 0.05-0.18, min center distance = sum of radii + 0.1.
const PLATE_HALF = 2.0;
const HOLE_R_MIN = 0.05;
const HOLE_R_MAX = 0.18;
const ALIGN_P2_TO_P1 = 0.30;
const ALIGN_P3_TO_P2 = 0.15;

function tooClose(hole, others, slack = 0.1) {
  for (const o of others) {
    const dx = hole.x - o.x, dy = hole.y - o.y;
    if (Math.hypot(dx, dy) < hole.r + o.r + slack) return true;
  }
  return false;
}

function generateHoles(plateIndex, rng, parentHoles) {
  // plateIndex 0..2. parentHoles = holes of the previous plate (or null for plate 0).
  const target = 4 + Math.floor(rng() * 5); // 4..8 inclusive
  const holes = [];

  // Alignment pass: copy a fraction of parent holes (with small jitter).
  if (parentHoles) {
    const ratio = plateIndex === 1 ? ALIGN_P2_TO_P1 : ALIGN_P3_TO_P2;
    const nAlign = Math.round(parentHoles.length * ratio);
    const shuffled = parentHoles.slice().sort(() => rng() - 0.5);
    for (let i = 0; i < nAlign && holes.length < target; i++) {
      const p = shuffled[i];
      const r = HOLE_R_MIN + rng() * (HOLE_R_MAX - HOLE_R_MIN);
      const jitter = 0.04;
      const candidate = {
        x: p.x + (rng() - 0.5) * jitter,
        y: p.y + (rng() - 0.5) * jitter,
        r,
      };
      if (!tooClose(candidate, holes)) holes.push(candidate);
    }
  }

  // Random pass: fill remainder.
  let attempts = 0;
  while (holes.length < target && attempts < 200) {
    attempts++;
    const candidate = {
      x: (rng() * 2 - 1) * (PLATE_HALF - HOLE_R_MAX - 0.05),
      y: (rng() * 2 - 1) * (PLATE_HALF - HOLE_R_MAX - 0.05),
      r: HOLE_R_MIN + rng() * (HOLE_R_MAX - HOLE_R_MIN),
    };
    if (!tooClose(candidate, holes)) holes.push(candidate);
  }
  return holes;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/gruyere-hero.test.mjs`
Expected: all tests pass (7 total now).

- [ ] **Step 5: Commit**

```bash
git add evaluation-agentique/gruyere-hero.js tests/gruyere-hero.test.mjs
git commit -m "feat(eval/hero): seeded RNG + Poisson hole generation with alignment"
```

---

## Task 4: Three.js scene + camera + renderer

**Files:**
- Modify: `evaluation-agentique/gruyere-hero.js`

- [ ] **Step 1: Add scene initialization**

Add to `evaluation-agentique/gruyere-hero.js` — new function above `mountGruyereHero`:

```js
function initScene(container, config) {
  const w = container.clientWidth;
  const h = container.clientHeight;
  const scene = new THREE.Scene();
  scene.background = null; // CSS background of container shows through

  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  // Camera position will be driven by orbital motion in animate(); set initial.
  camera.position.set(0, 1.5, -3);
  camera.lookAt(2, 0, 2);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h);
  renderer.setClearColor(0x000000, 0); // transparent — CSS bg shows
  container.appendChild(renderer.domElement);

  return { scene, camera, renderer };
}
```

- [ ] **Step 2: Wire scene into mountGruyereHero**

Modify the body of `mountGruyereHero` — replace the post-fallback section:

```js
export function mountGruyereHero(container, opts = {}) {
  const config = { ...DEFAULTS, ...opts };
  const caps = detectCapabilities();
  const scriptDir = new URL('.', import.meta.url).href;
  if (caps.reducedMotion || !caps.webgl) {
    return mountPoster(container, scriptDir);
  }

  const { scene, camera, renderer } = initScene(container, config);

  // Apply mobile overrides.
  if (caps.mobile) {
    config.particleRate = 8;
  }

  // TODO Task 5: plates
  // TODO Task 6-9: particles, accumulation, camera orbit

  let rafId = null;
  function animate() {
    rafId = requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  return {
    destroy() {
      cancelAnimationFrame(rafId);
      renderer.dispose();
      renderer.domElement.remove();
    },
    pause() { cancelAnimationFrame(rafId); rafId = null; },
    resume() { if (!rafId) animate(); },
    reset() {},
  };
}
```

- [ ] **Step 3: Add Three.js import map test placeholder**

Append to `tests/gruyere-hero.test.mjs`:

```js
test('gruyere-hero.js initialises a Three.js scene', () => {
  assert.match(HERO_JS, /new THREE\.Scene/);
  assert.match(HERO_JS, /new THREE\.PerspectiveCamera/);
  assert.match(HERO_JS, /new THREE\.WebGLRenderer/);
});
```

- [ ] **Step 4: Run all tests**

Run: `node --test tests/gruyere-hero.test.mjs`
Expected: all pass.

- [ ] **Step 5: Smoke-test in browser**

This step requires a temporary host page. Create `evaluation-agentique/_dev-hero.html` (gitignored — see step 6):

```html
<!doctype html>
<html><head>
<meta charset="utf-8">
<title>hero dev</title>
<style>:root{--bg:#faf6ec;--accent:#b8582e;} body{margin:0;background:var(--bg);}</style>
<script type="importmap">
{"imports": {"three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"}}
</script>
<link rel="stylesheet" href="gruyere-hero.css">
</head><body>
<figure class="gruyere-hero" id="h"></figure>
<script type="module">
import { mountGruyereHero } from './gruyere-hero.js';
mountGruyereHero(document.getElementById('h'));
</script>
</body></html>
```

Open it via a local server (e.g. `python -m http.server 8000` from repo root, then navigate to `http://localhost:8000/evaluation-agentique/_dev-hero.html`). Expected: cream banner, no console errors. Empty Three.js scene = blank cream because the canvas is transparent and the container has the cream background. That's correct for this step.

- [ ] **Step 6: Add dev file to ignore**

Add to `.gitignore` (append):

```
# Local hero dev playground
evaluation-agentique/_dev-hero.html
```

- [ ] **Step 7: Commit**

```bash
git add evaluation-agentique/gruyere-hero.js tests/gruyere-hero.test.mjs .gitignore
git commit -m "feat(eval/hero): three.js scene + camera + renderer"
```

---

## Task 5: Plates with holes (faces + wireframe)

**Files:**
- Modify: `evaluation-agentique/gruyere-hero.js`

- [ ] **Step 1: Add plate builder**

Add to `evaluation-agentique/gruyere-hero.js` — new function near the top:

```js
const PLATE_Z = [0, 2, 4];
const ACCUMULATOR_Z = 5.5;
const SPAWN_Z = -3;

function buildPlate(holes, z, opacity) {
  // Outer rectangle (4×4 unit square centered on origin in local space).
  const shape = new THREE.Shape();
  shape.moveTo(-PLATE_HALF, -PLATE_HALF);
  shape.lineTo( PLATE_HALF, -PLATE_HALF);
  shape.lineTo( PLATE_HALF,  PLATE_HALF);
  shape.lineTo(-PLATE_HALF,  PLATE_HALF);
  shape.lineTo(-PLATE_HALF, -PLATE_HALF);

  // Holes as circular paths (32 segments).
  for (const h of holes) {
    const hole = new THREE.Path();
    hole.absarc(h.x, h.y, h.r, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }

  const geom = new THREE.ShapeGeometry(shape);
  const faceMat = new THREE.MeshBasicMaterial({
    color: 0x1a1a1a,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const face = new THREE.Mesh(geom, faceMat);
  face.position.z = z;

  // Wireframe overlay: edges only (outer rect + circles).
  const edges = new THREE.EdgesGeometry(geom);
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x1a1a1a, transparent: true, opacity: 0.9 });
  const wire = new THREE.LineSegments(edges, edgeMat);
  wire.position.z = z;

  const group = new THREE.Group();
  group.add(face);
  group.add(wire);
  return { group, holes, z };
}
```

- [ ] **Step 2: Wire plate building into mount**

Modify `mountGruyereHero` — after `if (caps.mobile)` block, before `let rafId`:

```js
  // Build plates with seeded holes.
  const seed = hashSeed(config.holeSeed);
  const rng = mulberry32(seed);
  const platesData = [];
  for (let i = 0; i < 3; i++) {
    const parent = i === 0 ? null : platesData[i - 1].holes;
    const holes = generateHoles(i, rng, parent);
    const plate = buildPlate(holes, PLATE_Z[i], config.plateOpacity);
    platesData.push(plate);
    scene.add(plate.group);
  }
```

- [ ] **Step 3: Test plate behaviour markers**

Append to `tests/gruyere-hero.test.mjs`:

```js
test('gruyere-hero.js builds 3 plates from PLATE_Z', () => {
  assert.match(HERO_JS, /PLATE_Z\s*=\s*\[0,\s*2,\s*4\]/);
  assert.match(HERO_JS, /function\s+buildPlate/);
  assert.match(HERO_JS, /ShapeGeometry/);
  assert.match(HERO_JS, /EdgesGeometry/);
});
```

Run: `node --test tests/gruyere-hero.test.mjs`
Expected: all pass.

- [ ] **Step 4: Visual smoke-test**

Open `_dev-hero.html` in browser. Expected:
- 3 dark-slate plates visible, in perspective (camera looks from -z back toward +z).
- Each plate shows clearly its holes (cutouts visible because faceMat is translucent + wireframe drawn).
- Visible separation between the plates (perspective foreshortening).

If plates look frontal (no perspective) or all overlap visually, camera position may need tuning. Move forward to Task 9 (orbital camera) — this is expected.

- [ ] **Step 5: Commit**

```bash
git add evaluation-agentique/gruyere-hero.js tests/gruyere-hero.test.mjs
git commit -m "feat(eval/hero): plates with holes — ShapeGeometry + wireframe"
```

---

## Task 6: Particle system + spawn loop

**Files:**
- Modify: `evaluation-agentique/gruyere-hero.js`

- [ ] **Step 1: Add particle pool**

Add to `evaluation-agentique/gruyere-hero.js`:

```js
// Particle states. We use a plain array of structs; positions also live in a BufferGeometry attribute.
const STATE_ALIVE = 0;
const STATE_FADING = 1;
const STATE_ACCUMULATED = 2;
const STATE_DEAD = 3;

const PARTICLE_SPEED = 2.5;            // units/s along +z
const SPAWN_HALF = 2.2;                // x,y range at spawn

function buildParticleSystem(maxCount) {
  const positions = new Float32Array(maxCount * 3);
  const colors = new Float32Array(maxCount * 3);
  const alphas = new Float32Array(maxCount);

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geom.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
  // Initial draw range = 0; we expand as particles spawn.
  geom.setDrawRange(0, 0);

  // Use a shader material so we can drive per-vertex alpha.
  const mat = new THREE.ShaderMaterial({
    vertexShader: `
      attribute float alpha;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vColor = color;
        vAlpha = alpha;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 5.0 * (1.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vec2 c = gl_PointCoord - vec2(0.5);
        float d = length(c);
        if (d > 0.5) discard;
        float soft = smoothstep(0.5, 0.3, d);
        gl_FragColor = vec4(vColor, vAlpha * soft);
      }
    `,
    transparent: true,
    vertexColors: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geom, mat);

  // CPU-side state mirror.
  const particles = new Array(maxCount).fill(null).map(() => ({
    state: STATE_DEAD,
    x: 0, y: 0, z: 0,
    r: 1, g: 1, b: 1, // cream by default — actual colour set on spawn
    a: 1,
    fadeStart: 0,
  }));

  return { points, geom, particles, positions, colors, alphas };
}

function spawnParticle(p, rng, creamColor) {
  p.state = STATE_ALIVE;
  p.x = (rng() * 2 - 1) * SPAWN_HALF;
  p.y = (rng() * 2 - 1) * SPAWN_HALF;
  p.z = SPAWN_Z;
  p.r = creamColor.r;
  p.g = creamColor.g;
  p.b = creamColor.b;
  p.a = 0.9;
}

function readAccentColor() {
  const css = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent').trim() || '#b8582e';
  return new THREE.Color(css);
}
```

- [ ] **Step 2: Wire particles into the mount + animate loop**

Modify `mountGruyereHero` — extend the body after plate building:

```js
  // Particles.
  const MAX_PARTICLES = caps.mobile ? 50 : 100;
  const psys = buildParticleSystem(MAX_PARTICLES);
  scene.add(psys.points);

  const creamColor = new THREE.Color(0xfaf6ec);
  const accentColor = readAccentColor();
  const partRng = mulberry32(hashSeed(config.holeSeed + '-particles'));

  let lastT = performance.now();
  let spawnAccumulator = 0;

  function updateParticles(dt) {
    // Spawn budget.
    spawnAccumulator += config.particleRate * dt;
    while (spawnAccumulator >= 1) {
      spawnAccumulator -= 1;
      // Find a DEAD slot.
      for (let i = 0; i < psys.particles.length; i++) {
        if (psys.particles[i].state === STATE_DEAD) {
          spawnParticle(psys.particles[i], partRng, creamColor);
          break;
        }
      }
    }
    // Step alive particles forward; cull beyond accumulator.
    for (let i = 0; i < psys.particles.length; i++) {
      const p = psys.particles[i];
      if (p.state === STATE_ALIVE) {
        p.z += PARTICLE_SPEED * dt;
        if (p.z >= ACCUMULATOR_Z) {
          // Task 7 will refine: for now just mark DEAD beyond accumulator.
          p.state = STATE_DEAD;
        }
      }
    }
    // Push CPU state to GPU buffers.
    let drawCount = 0;
    for (let i = 0; i < psys.particles.length; i++) {
      const p = psys.particles[i];
      if (p.state === STATE_DEAD) continue;
      const off = drawCount * 3;
      psys.positions[off    ] = p.x;
      psys.positions[off + 1] = p.y;
      psys.positions[off + 2] = p.z;
      psys.colors[off    ] = p.r;
      psys.colors[off + 1] = p.g;
      psys.colors[off + 2] = p.b;
      psys.alphas[drawCount] = p.a;
      drawCount++;
    }
    psys.geom.attributes.position.needsUpdate = true;
    psys.geom.attributes.color.needsUpdate = true;
    psys.geom.attributes.alpha.needsUpdate = true;
    psys.geom.setDrawRange(0, drawCount);
  }
```

Then update the `animate` closure to call `updateParticles`:

```js
  function animate() {
    rafId = requestAnimationFrame(animate);
    const now = performance.now();
    const dt = Math.min(0.05, (now - lastT) / 1000); // clamp to 50ms (≥20fps step) to avoid huge jumps after tab idle
    lastT = now;
    updateParticles(dt);
    renderer.render(scene, camera);
  }
```

- [ ] **Step 3: Visual check**

Open `_dev-hero.html`. Expected:
- Cream specks streaming through the scene from left/behind toward right/front.
- No crash. Performance smooth.
- No collision yet — particles still pass through plates.

- [ ] **Step 4: Commit**

```bash
git add evaluation-agentique/gruyere-hero.js
git commit -m "feat(eval/hero): particle pool + spawn loop"
```

---

## Task 7: Crossing detection + fade-out + impact ring

**Files:**
- Modify: `evaluation-agentique/gruyere-hero.js`

- [ ] **Step 1: Add impact ring pool**

Add to `evaluation-agentique/gruyere-hero.js`:

```js
// Impact rings: short-lived expanding rings at the point a particle was stopped.
const IMPACT_LIFETIME = 0.6; // seconds
const MAX_IMPACTS = 30;

function buildImpactPool(accentColor) {
  const rings = [];
  for (let i = 0; i < MAX_IMPACTS; i++) {
    const geom = new THREE.RingGeometry(0.04, 0.06, 24);
    const mat = new THREE.MeshBasicMaterial({
      color: accentColor.clone(),
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.visible = false;
    rings.push({ mesh, life: 0, alive: false });
  }
  return rings;
}

function triggerImpact(rings, x, y, z) {
  for (const r of rings) {
    if (!r.alive) {
      r.alive = true;
      r.life = IMPACT_LIFETIME;
      r.mesh.position.set(x, y, z);
      r.mesh.scale.set(1, 1, 1);
      r.mesh.material.opacity = 0.8;
      r.mesh.visible = true;
      return;
    }
  }
}

function updateImpacts(rings, dt) {
  for (const r of rings) {
    if (!r.alive) continue;
    r.life -= dt;
    if (r.life <= 0) {
      r.alive = false;
      r.mesh.visible = false;
      continue;
    }
    const t = 1 - r.life / IMPACT_LIFETIME;
    const scale = 1 + t * 3;
    r.mesh.scale.set(scale, scale, 1);
    r.mesh.material.opacity = 0.8 * (1 - t);
  }
}
```

- [ ] **Step 2: Wire impacts into the mount**

Add after particle system setup in `mountGruyereHero`:

```js
  const impacts = buildImpactPool(accentColor);
  for (const r of impacts) scene.add(r.mesh);
```

- [ ] **Step 3: Replace `updateParticles` with crossing-aware version**

Replace `updateParticles` body inside `mountGruyereHero`:

```js
  const FADE_DURATION = 0.3; // seconds

  function hitsAnyHole(x, y, holes) {
    for (const h of holes) {
      const dx = x - h.x, dy = y - h.y;
      if (dx*dx + dy*dy <= h.r * h.r) return true;
    }
    return false;
  }

  function updateParticles(dt, now) {
    // Spawn budget.
    spawnAccumulator += config.particleRate * dt;
    while (spawnAccumulator >= 1) {
      spawnAccumulator -= 1;
      for (let i = 0; i < psys.particles.length; i++) {
        if (psys.particles[i].state === STATE_DEAD) {
          spawnParticle(psys.particles[i], partRng, creamColor);
          break;
        }
      }
    }
    // Step / cull.
    for (let i = 0; i < psys.particles.length; i++) {
      const p = psys.particles[i];
      if (p.state === STATE_ALIVE) {
        const prevZ = p.z;
        p.z += PARTICLE_SPEED * dt;
        // Check each plate it crossed this frame.
        for (let k = 0; k < platesData.length; k++) {
          const plate = platesData[k];
          if (prevZ < plate.z && p.z >= plate.z) {
            if (!hitsAnyHole(p.x, p.y, plate.holes)) {
              p.state = STATE_FADING;
              p.fadeStart = now;
              triggerImpact(impacts, p.x, p.y, plate.z);
              break;
            }
          }
        }
        if (p.state === STATE_ALIVE && p.z >= ACCUMULATOR_Z) {
          // Task 8 will refine — for now mark DEAD.
          p.state = STATE_DEAD;
        }
      } else if (p.state === STATE_FADING) {
        const elapsed = (now - p.fadeStart) / 1000;
        const t = Math.min(1, elapsed / FADE_DURATION);
        p.a = 0.9 * (1 - t);
        if (t >= 1) p.state = STATE_DEAD;
      }
    }
    // Push to GPU.
    let drawCount = 0;
    for (let i = 0; i < psys.particles.length; i++) {
      const p = psys.particles[i];
      if (p.state === STATE_DEAD) continue;
      const off = drawCount * 3;
      psys.positions[off    ] = p.x;
      psys.positions[off + 1] = p.y;
      psys.positions[off + 2] = p.z;
      psys.colors[off    ] = p.r;
      psys.colors[off + 1] = p.g;
      psys.colors[off + 2] = p.b;
      psys.alphas[drawCount] = p.a;
      drawCount++;
    }
    psys.geom.attributes.position.needsUpdate = true;
    psys.geom.attributes.color.needsUpdate = true;
    psys.geom.attributes.alpha.needsUpdate = true;
    psys.geom.setDrawRange(0, drawCount);
  }
```

Update the `animate` closure to pass `now`:

```js
  function animate() {
    rafId = requestAnimationFrame(animate);
    const now = performance.now();
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    updateParticles(dt, now);
    updateImpacts(impacts, dt);
    renderer.render(scene, camera);
  }
```

- [ ] **Step 4: Visual check**

Open `_dev-hero.html`. Expected:
- Most particles stop at one of the 3 plates, fade out, leave a brief orange ring at the impact site.
- A minority pass holes; some make it through 2 plates, a few through all 3.
- Visual rhythm: streaming flow + many small impacts + occasional survivor.

- [ ] **Step 5: Commit**

```bash
git add evaluation-agentique/gruyere-hero.js
git commit -m "feat(eval/hero): crossing detection + fade-out + impact rings"
```

---

## Task 8: Accumulation on back screen + accent shift + reset cycle

**Files:**
- Modify: `evaluation-agentique/gruyere-hero.js`

- [ ] **Step 1: Add accumulator state**

Modify `updateParticles` inside `mountGruyereHero` — replace the `p.z >= ACCUMULATOR_Z` branch:

```js
        if (p.state === STATE_ALIVE && p.z >= ACCUMULATOR_Z) {
          p.state = STATE_ACCUMULATED;
          p.z = ACCUMULATOR_Z; // freeze on the plane
          p.r = accentColor.r;
          p.g = accentColor.g;
          p.b = accentColor.b;
          p.a = 0.85;
          accumulated.push(p);
        }
```

- [ ] **Step 2: Declare `accumulated` array near the closure**

Add just before `let lastT = performance.now();` inside `mountGruyereHero`:

```js
  const accumulated = []; // particles in STATE_ACCUMULATED, in order of arrival
  let resetStartedAt = -1; // timestamp when reset fade-out began; -1 if not resetting
```

- [ ] **Step 3: Add reset trigger and fade-out**

Add a new helper inside `mountGruyereHero` after `updateParticles`:

```js
  const RESET_FADE_MS = 1500; // duration of accumulated fade-out

  function maybeReset(now) {
    if (resetStartedAt < 0) {
      const overflow = accumulated.length >= config.maxAccumulated;
      const timeOut = (now - resetCycleStart) >= config.resetIntervalMs;
      if (overflow || timeOut) {
        resetStartedAt = now;
      }
    } else {
      const elapsed = now - resetStartedAt;
      const t = Math.min(1, elapsed / RESET_FADE_MS);
      // Fade alpha of every accumulated particle uniformly.
      const targetAlpha = 0.85 * (1 - t);
      for (const p of accumulated) p.a = targetAlpha;
      if (t >= 1) {
        // Recycle slots: mark DEAD, clear list, reset cycle.
        for (const p of accumulated) p.state = STATE_DEAD;
        accumulated.length = 0;
        resetStartedAt = -1;
        resetCycleStart = now;
      }
    }
  }
```

- [ ] **Step 4: Declare `resetCycleStart` and call `maybeReset`**

Add near `accumulated` declaration:

```js
  let resetCycleStart = performance.now();
```

Then update `animate`:

```js
  function animate() {
    rafId = requestAnimationFrame(animate);
    const now = performance.now();
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    updateParticles(dt, now);
    updateImpacts(impacts, dt);
    maybeReset(now);
    renderer.render(scene, camera);
  }
```

- [ ] **Step 5: Wire the public `reset()` action**

Modify the returned object so manual reset works:

```js
  return {
    destroy() {
      cancelAnimationFrame(rafId);
      renderer.dispose();
      renderer.domElement.remove();
    },
    pause() { cancelAnimationFrame(rafId); rafId = null; },
    resume() { if (!rafId) { lastT = performance.now(); animate(); } },
    reset() { resetStartedAt = performance.now(); },
  };
```

- [ ] **Step 6: Visual check**

Open `_dev-hero.html`. Watch for 35-40 seconds. Expected:
- Orange dots accumulate on the back screen plane, behind plate 3.
- They persist visibly (not flickering — they're frozen in place).
- Around the 30-second mark, the constellation fades out smoothly (~1.5s), then starts re-accumulating.

- [ ] **Step 7: Commit**

```bash
git add evaluation-agentique/gruyere-hero.js
git commit -m "feat(eval/hero): accumulation + accent shift + 30s reset cycle"
```

---

## Task 9: Orbital camera + look-at center

**Files:**
- Modify: `evaluation-agentique/gruyere-hero.js`

- [ ] **Step 1: Add orbital state**

Add inside `mountGruyereHero`, near `lastT` declaration:

```js
  const ORBIT_RADIUS = 9;
  const ORBIT_Y = 1.5;
  const ORBIT_CENTER = new THREE.Vector3(0, 0, 2); // midpoint of plate stack
  let orbitAngle = Math.PI * 0.65; // initial: looking from slightly above-left-back
```

- [ ] **Step 2: Update animate to drive camera**

Modify the `animate` closure (replace existing):

```js
  function animate() {
    rafId = requestAnimationFrame(animate);
    const now = performance.now();
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;

    orbitAngle += config.orbitSpeed * dt;
    camera.position.set(
      ORBIT_CENTER.x + ORBIT_RADIUS * Math.sin(orbitAngle),
      ORBIT_Y,
      ORBIT_CENTER.z + ORBIT_RADIUS * Math.cos(orbitAngle),
    );
    camera.lookAt(ORBIT_CENTER);

    updateParticles(dt, now);
    updateImpacts(impacts, dt);
    maybeReset(now);
    renderer.render(scene, camera);
  }
```

- [ ] **Step 3: Visual check**

Open `_dev-hero.html`. Expected:
- Very slow drift visible. Over ~30 seconds, the perspective shifts subtly — plates rotate in view.
- The cube *implicit* — between the plates and the accumulator plane — becomes legible because the camera angle shifts.

If the motion feels too fast or too jittery, the spec lists `orbitSpeed: 0.015` as default — keep that. If too slow to notice, double-check unit (rad/s).

- [ ] **Step 4: Commit**

```bash
git add evaluation-agentique/gruyere-hero.js
git commit -m "feat(eval/hero): slow orbital camera"
```

---

## Task 10: CSS polish + caption + reset button (optional)

**Files:**
- Modify: `evaluation-agentique/gruyere-hero.css`

- [ ] **Step 1: Expand CSS to final form**

Replace `evaluation-agentique/gruyere-hero.css`:

```css
/* gruyere-hero.css — bannière vedette du dossier evaluation-agentique. */

.gruyere-hero {
  position: relative;
  width: 100%;
  margin: 0;
  padding: 0;
  height: clamp(380px, 55vh, 620px);
  background: var(--bg, #faf6ec);
  overflow: hidden;
}

.gruyere-hero canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.gruyere-hero > img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gruyere-hero__caption {
  display: block;
  max-width: 760px;
  margin: 12px auto 0;
  padding: 0 16px;
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: 14px;
  letter-spacing: 0.005em;
  color: #1a1a1a;
  opacity: 0.6;
  text-align: center;
}

.gruyere-hero__reset {
  position: absolute;
  right: 16px;
  bottom: 16px;
  appearance: none;
  background: rgba(26, 26, 26, 0.06);
  border: 1px solid rgba(26, 26, 26, 0.18);
  border-radius: 999px;
  padding: 6px 12px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #1a1a1a;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 160ms ease;
}

.gruyere-hero__reset:hover,
.gruyere-hero__reset:focus-visible {
  opacity: 1;
}

@media (max-width: 768px) {
  .gruyere-hero {
    height: clamp(280px, 45vh, 420px);
  }
}

@media (prefers-reduced-motion: reduce) {
  /* No animation; poster image already inserted by JS path. */
  .gruyere-hero {
    height: clamp(280px, 40vh, 480px);
  }
}
```

- [ ] **Step 2: Wire optional reset button**

Modify `mountGruyereHero` — after the `if (caps.mobile)` block:

```js
  let resetButton = null;
  if (config.showResetButton) {
    resetButton = document.createElement('button');
    resetButton.type = 'button';
    resetButton.className = 'gruyere-hero__reset';
    resetButton.textContent = 'Reset';
    resetButton.setAttribute('aria-label', 'Réinitialiser l\'accumulation');
    container.appendChild(resetButton);
    resetButton.addEventListener('click', () => { resetStartedAt = performance.now(); });
  }
```

And in `destroy()`:

```js
    destroy() {
      cancelAnimationFrame(rafId);
      if (resetButton) resetButton.remove();
      renderer.dispose();
      renderer.domElement.remove();
    },
```

- [ ] **Step 3: Visual check**

Open `_dev-hero.html`. Expected: same visuals as Task 9. The button is hidden by default (`showResetButton: false`).

Test the button by adding `{ showResetButton: true }` to the mount call temporarily. The reset button appears in the bottom-right, low-opacity pill. Click it → constellation fades, restarts.

- [ ] **Step 4: Commit**

```bash
git add evaluation-agentique/gruyere-hero.css evaluation-agentique/gruyere-hero.js
git commit -m "feat(eval/hero): CSS polish + optional reset button"
```

---

## Task 11: Lifecycle — IntersectionObserver + ResizeObserver + cleanup

**Files:**
- Modify: `evaluation-agentique/gruyere-hero.js`

- [ ] **Step 1: Add pause-on-scroll-away via IntersectionObserver**

Add inside `mountGruyereHero`, after the impacts setup:

```js
  let inView = true;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) inView = e.isIntersecting;
    if (inView && !rafId) { lastT = performance.now(); animate(); }
    if (!inView && rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }, { threshold: 0.01 });
  io.observe(container);
```

- [ ] **Step 2: Add ResizeObserver**

Add right after:

```js
  const ro = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  ro.observe(container);
```

- [ ] **Step 3: Update destroy() to free everything**

Replace the returned object:

```js
  return {
    destroy() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      io.disconnect();
      ro.disconnect();
      if (resetButton) resetButton.remove();
      // Geometries + materials.
      for (const plate of platesData) {
        plate.group.traverse(obj => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) obj.material.dispose();
        });
      }
      psys.geom.dispose();
      psys.points.material.dispose();
      for (const r of impacts) {
        r.mesh.geometry.dispose();
        r.mesh.material.dispose();
      }
      renderer.dispose();
      renderer.domElement.remove();
    },
    pause() { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } },
    resume() { if (!rafId) { lastT = performance.now(); animate(); } },
    reset() { resetStartedAt = performance.now(); },
  };
```

- [ ] **Step 4: Test lifecycle markers**

Append to `tests/gruyere-hero.test.mjs`:

```js
test('gruyere-hero.js wires IntersectionObserver + ResizeObserver', () => {
  assert.match(HERO_JS, /new IntersectionObserver/);
  assert.match(HERO_JS, /new ResizeObserver/);
});

test('gruyere-hero.js destroy() disposes Three.js resources', () => {
  assert.match(HERO_JS, /renderer\.dispose/);
  assert.match(HERO_JS, /geometry\.dispose/);
});
```

Run: `node --test tests/gruyere-hero.test.mjs`
Expected: all pass.

- [ ] **Step 5: Manual lifecycle check**

Open `_dev-hero.html`. Open DevTools → Performance tab.
1. Record a few seconds while the banner is in view. Confirm framerate ≥ 50 fps on desktop.
2. Scroll the page so the banner leaves the viewport (you may need to add some scroll spacer in `_dev-hero.html`, e.g. `<div style="height:300vh"></div>`). Confirm CPU graph drops — the animation pauses.
3. Resize the browser window. Confirm canvas remains responsive (no stretched aspect ratio).

- [ ] **Step 6: Commit**

```bash
git add evaluation-agentique/gruyere-hero.js tests/gruyere-hero.test.mjs
git commit -m "feat(eval/hero): lifecycle — observers + dispose"
```

---

## Task 12: Poster SVG fallback

**Files:**
- Create: `evaluation-agentique/gruyere-hero-poster.svg`

- [ ] **Step 1: Hand-author the poster SVG**

Write `evaluation-agentique/gruyere-hero-poster.svg`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 620" preserveAspectRatio="xMidYMid slice" role="img" aria-label="3 plaques perforées en perspective, particules accumulées sur l'écran arrière">
  <defs>
    <radialGradient id="dot" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#faf6ec"/>
      <stop offset="0.6" stop-color="#faf6ec" stop-opacity="0.7"/>
      <stop offset="1" stop-color="#faf6ec" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="dotAccent" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#b8582e"/>
      <stop offset="0.5" stop-color="#b8582e" stop-opacity="0.85"/>
      <stop offset="1" stop-color="#b8582e" stop-opacity="0"/>
    </radialGradient>
    <mask id="plate1">
      <rect width="100%" height="100%" fill="white"/>
      <circle cx="320" cy="220" r="14" fill="black"/>
      <circle cx="380" cy="280" r="20" fill="black"/>
      <circle cx="290" cy="350" r="16" fill="black"/>
      <circle cx="420" cy="380" r="22" fill="black"/>
      <circle cx="340" cy="430" r="12" fill="black"/>
    </mask>
    <mask id="plate2">
      <rect width="100%" height="100%" fill="white"/>
      <circle cx="560" cy="240" r="18" fill="black"/>
      <circle cx="610" cy="300" r="14" fill="black"/>
      <circle cx="540" cy="370" r="22" fill="black"/>
      <circle cx="660" cy="410" r="16" fill="black"/>
      <circle cx="580" cy="450" r="20" fill="black"/>
    </mask>
    <mask id="plate3">
      <rect width="100%" height="100%" fill="white"/>
      <circle cx="800" cy="260" r="22" fill="black"/>
      <circle cx="850" cy="320" r="14" fill="black"/>
      <circle cx="780" cy="380" r="20" fill="black"/>
      <circle cx="890" cy="430" r="16" fill="black"/>
    </mask>
  </defs>

  <!-- Background tonale, matching --bg -->
  <rect width="1200" height="620" fill="#faf6ec"/>

  <!-- Faint accumulator screen guide -->
  <line x1="1040" y1="160" x2="1040" y2="520" stroke="#1a1a1a" stroke-width="0.5" stroke-dasharray="2 4" opacity="0.15"/>

  <!-- Trajectory ghost (one survivor making it through) -->
  <path d="M 60 340 Q 350 320, 580 330 T 1040 340" stroke="#b8582e" stroke-width="0.8" fill="none" stroke-dasharray="1 3" opacity="0.35"/>

  <!-- Plates -->
  <g transform="skewY(-4)" opacity="0.92">
    <rect x="280" y="180" width="180" height="280" fill="#1a1a1a" fill-opacity="0.08" stroke="#1a1a1a" stroke-width="1.2" mask="url(#plate1)"/>
    <rect x="520" y="200" width="180" height="280" fill="#1a1a1a" fill-opacity="0.08" stroke="#1a1a1a" stroke-width="1.2" mask="url(#plate2)"/>
    <rect x="760" y="220" width="180" height="280" fill="#1a1a1a" fill-opacity="0.08" stroke="#1a1a1a" stroke-width="1.2" mask="url(#plate3)"/>
  </g>

  <!-- Particles in flight (cream) -->
  <g fill="url(#dot)">
    <circle cx="100" cy="320" r="4"/>
    <circle cx="180" cy="290" r="3.5"/>
    <circle cx="220" cy="380" r="4"/>
    <circle cx="160" cy="420" r="3"/>
    <circle cx="120" cy="240" r="3.5"/>
  </g>

  <!-- Accumulated particles (accent orange) -->
  <g fill="url(#dotAccent)">
    <circle cx="1040" cy="200" r="3.5"/>
    <circle cx="1042" cy="240" r="3"/>
    <circle cx="1038" cy="260" r="3.5"/>
    <circle cx="1044" cy="290" r="4"/>
    <circle cx="1036" cy="310" r="3"/>
    <circle cx="1042" cy="340" r="3.5"/>
    <circle cx="1040" cy="370" r="3"/>
    <circle cx="1038" cy="400" r="4"/>
    <circle cx="1044" cy="430" r="3.5"/>
    <circle cx="1040" cy="460" r="3"/>
    <circle cx="1042" cy="490" r="3.5"/>
    <circle cx="1036" cy="220" r="3"/>
    <circle cx="1044" cy="380" r="3.5"/>
    <circle cx="1040" cy="280" r="3"/>
    <circle cx="1038" cy="320" r="3.5"/>
  </g>
</svg>
```

- [ ] **Step 2: Validate SVG parses**

Run:

```bash
python -c "import xml.etree.ElementTree as ET; ET.parse('evaluation-agentique/gruyere-hero-poster.svg')"
```

Expected: no output (parse success).

- [ ] **Step 3: Visual check**

Open the SVG directly in the browser (`file://.../gruyere-hero-poster.svg`). Expected:
- 3 dark slate plates with circular holes, set in perspective via skewY.
- Cream dots streaming in from the left.
- Orange dots clustered on the right (accumulator plane).
- Cream background.

Adjust positions if needed for editorial taste (the goal is "saisissant" + readable as the same scene the animation paints).

- [ ] **Step 4: Test reduced-motion fallback in browser**

In Chrome DevTools → Rendering panel → "Emulate CSS media feature `prefers-reduced-motion`" → reduce. Reload `_dev-hero.html`. Expected: SVG poster shows, no canvas, no animation.

- [ ] **Step 5: Add test for poster file existence**

Append to `tests/gruyere-hero.test.mjs`:

```js
test('gruyere-hero-poster.svg exists and is well-formed', () => {
  const svg = readFileSync(join(ROOT, 'evaluation-agentique/gruyere-hero-poster.svg'), 'utf8');
  assert.ok(svg.length > 1000, 'poster SVG suspiciously short');
  assert.match(svg, /<svg/);
  assert.match(svg, /viewBox="0 0 1200 620"/);
});
```

Run: `node --test tests/gruyere-hero.test.mjs`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add evaluation-agentique/gruyere-hero-poster.svg tests/gruyere-hero.test.mjs
git commit -m "feat(eval/hero): static SVG poster fallback"
```

---

## Task 13: Integration — hub `evaluation-agentique/index.html`

**Files:**
- Modify: `evaluation-agentique/index.html`

- [ ] **Step 1: Read current hub head + body**

Run: `head -100 evaluation-agentique/index.html` (already known from spec exploration — topbar then `<main class="wrap">`).

- [ ] **Step 2: Add the import map to `<head>`**

Find the existing `<head>` section. Insert before `</head>`:

```html
<script type="importmap">
{"imports": {"three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"}}
</script>
<link rel="stylesheet" href="gruyere-hero.css">
```

- [ ] **Step 3: Insert the hero figure**

Find the existing line:

```html
<header class="topbar" id="topbar">
  <a href="../index.html">Mathieu <em>Guglielmino</em></a>
  <a href="../index.html#series" class="back">← Retour aux dossiers</a>
</header>

<main class="wrap">
```

Insert between `</header>` and `<main class="wrap">`:

```html
<figure class="gruyere-hero" id="gruyere-hero" role="img"
        aria-label="Diagramme animé du modèle gruyère : 3 couches de défense filtrent les attaques, certaines passent.">
  <noscript><img src="gruyere-hero-poster.svg" alt="3 plaques perforées en perspective, particules accumulées sur l'écran arrière"></noscript>
  <figcaption class="gruyere-hero__caption">
    3 couches de défense · 7 attaques · les survivants s'accumulent
  </figcaption>
</figure>
```

- [ ] **Step 4: Add the script-module import**

Find the closing `</body>` of the file (last few lines: there's already a `<script>` for the topbar scroll and `<script src="/admin.js" defer></script>`). Insert before `<script src="/admin.js" defer></script>`:

```html
<script type="module">
  import { mountGruyereHero } from './gruyere-hero.js';
  mountGruyereHero(document.getElementById('gruyere-hero'));
</script>
```

- [ ] **Step 5: Visual verify hub**

Local server: `python -m http.server 8000` (from repo root). Navigate to `http://localhost:8000/evaluation-agentique/`. Expected:
- Bannière animée pleine largeur sous la topbar, au-dessus du eyebrow "Étude 08".
- Animation tourne normalement, particules + accumulation visibles.
- Aucune erreur console.
- Le texte (eyebrow, H1, lede, cartes formats) reste intact en dessous.

- [ ] **Step 6: Commit**

```bash
git add evaluation-agentique/index.html
git commit -m "feat(eval/hero): hub integration"
```

---

## Task 14: Integration — app rapport `20260501-evaluation-agentique-app.html`

**Files:**
- Modify: `evaluation-agentique/20260501-evaluation-agentique-app.html`

- [ ] **Step 1: Add the import map and CSS link to `<head>`**

Find the existing `<head>` and locate the lib CSS link `<link rel="stylesheet" href="/assets/dossier-app.css">` (or similar). Insert just before `</head>`:

```html
<script type="importmap">
{"imports": {"three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"}}
</script>
<link rel="stylesheet" href="gruyere-hero.css">
```

- [ ] **Step 2: Find `<header class="site">` and insert hero figure before `<h1>`**

Locate around line 950 (`<header class="site">`). The current content is roughly:

```html
<header class="site">
  ...
  <h1>Évaluer un agent : méthodes, métriques, coûts et goulots</h1>
  ...
</header>
```

**Modify** to insert the figure right after `<header class="site">` opening tag. The exact insertion target is the first child position — before any existing content of the header.

```html
<header class="site">
  <figure class="gruyere-hero" id="gruyere-hero" role="img"
          aria-label="Diagramme animé du modèle gruyère : 3 couches de défense filtrent les attaques, certaines passent.">
    <noscript><img src="gruyere-hero-poster.svg" alt="3 plaques perforées en perspective, particules accumulées sur l'écran arrière"></noscript>
    <figcaption class="gruyere-hero__caption">
      3 couches de défense · 7 attaques · les survivants s'accumulent
    </figcaption>
  </figure>
  ...
```

**Verify visual hierarchy**: the `<header class="site">` may have its own padding/centering. Quickly inspect via grep:

```bash
grep -n "header.site" evaluation-agentique/20260501-evaluation-agentique-app.html | head -10
```

If the header has a constrained max-width via CSS, the figure may need to break out. Test in step 4 — if visually constrained, add a CSS override scoped to the app file:

```css
/* in <style> inside the file, or via gruyere-hero.css if generic enough */
header.site > .gruyere-hero {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}
```

- [ ] **Step 3: Add the script-module import**

Find the existing script-module block (typically in the closing of `<body>` — the app loads `dossier-app.js` and inlines `SCHEMAS`). Add a separate `<script type="module">` block:

```html
<script type="module">
  import { mountGruyereHero } from './gruyere-hero.js';
  mountGruyereHero(document.getElementById('gruyere-hero'));
</script>
```

Place it BEFORE the existing `dossier-app.js` script tag to avoid race conditions (the hero is independent).

- [ ] **Step 4: Visual verify app rapport**

Local server. Navigate to `http://localhost:8000/evaluation-agentique/20260501-evaluation-agentique-app.html`. Expected:
- Bannière au-dessus du titre.
- TOC sidebar, sources sidebar, contenu — tout doit rester fonctionnel.
- Aucune régression sur le sticky scroll, les figures interactives, les modales.

If the figure looks constrained, apply the `width: 100vw` override from Step 2.

- [ ] **Step 5: Run existing integration tests to confirm no regression**

```bash
node --test tests/apps-integration.test.mjs tests/gruyere-hero.test.mjs
```

Expected: all pass. The app integration suite must not flag this app as broken.

- [ ] **Step 6: Commit**

```bash
git add evaluation-agentique/20260501-evaluation-agentique-app.html
git commit -m "feat(eval/hero): app rapport integration"
```

---

## Task 15: Integration — canvas `20260521-evaluation-agentique-canvas.html`

**Files:**
- Modify: `evaluation-agentique/20260521-evaluation-agentique-canvas.html`

- [ ] **Step 1: Add the import map and CSS link to `<head>`**

Find the existing `<head>`. Insert just before `</head>`:

```html
<script type="importmap">
{"imports": {"three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"}}
</script>
<link rel="stylesheet" href="gruyere-hero.css">
```

- [ ] **Step 2: Insert hero between topbar and `<section class="hero">`**

Find the topbar (around line 678 — `<header class="topbar"...`). The hero section follows. Insert the `<figure class="gruyere-hero">` between them — right after `</header>` of the topbar, right before `<section class="hero">` of the canvas:

```html
</header>

<figure class="gruyere-hero" id="gruyere-hero" role="img"
        aria-label="Diagramme animé du modèle gruyère : 3 couches de défense filtrent les attaques, certaines passent.">
  <noscript><img src="gruyere-hero-poster.svg" alt="3 plaques perforées en perspective, particules accumulées sur l'écran arrière"></noscript>
  <figcaption class="gruyere-hero__caption">
    3 couches de défense · 7 attaques · les survivants s'accumulent
  </figcaption>
</figure>

<section class="hero">
```

- [ ] **Step 3: Confirm the static `.gruyere-diagram` SVG is preserved**

The canvas hero contains `<figure class="gruyere-figure" data-task-pending="7"></figure>` (the existing static SVG analytical diagram). Verify by grep:

```bash
grep -n "gruyere-figure\|gruyere-diagram" evaluation-agentique/20260521-evaluation-agentique-canvas.html
```

Expected: the lines exist and are untouched. The two visuals coexist by design — the animation is the signature, the static SVG is the analytical tool.

- [ ] **Step 4: Add the script-module import**

Find the closing of `<body>` (likely contains an inline script for zoom/navigation logic). Add before the closing `</body>`:

```html
<script type="module">
  import { mountGruyereHero } from './gruyere-hero.js';
  mountGruyereHero(document.getElementById('gruyere-hero'));
</script>
```

- [ ] **Step 5: Visual verify canvas**

Local server. Navigate to `http://localhost:8000/evaluation-agentique/20260521-evaluation-agentique-canvas.html`. Expected:
- Bannière animée 3D sous la topbar.
- Hero section (titre + lede + SVG gruyère statique + Reason quote) intacte juste en dessous.
- Aucune collision visuelle entre les deux.
- Le zoom du canvas (`data-zoom`) doit continuer de fonctionner sur le contenu en dessous.

- [ ] **Step 6: Commit**

```bash
git add evaluation-agentique/20260521-evaluation-agentique-canvas.html
git commit -m "feat(eval/hero): canvas integration"
```

---

## Task 16: CLAUDE.md jsDelivr exception note

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Locate the existing tracker rule**

Find the line in `CLAUDE.md` § "Stack et conventions":

```
Pas de tracker, pas d'analytics, pas de tiers en dehors de Google Fonts.
```

- [ ] **Step 2: Update the rule with the exception**

Replace that line with:

```
- Pas de tracker, pas d'analytics. **Tiers autorisés** : Google Fonts (toutes pages) + jsDelivr (Three.js via CDN ESM, restreint au dossier `evaluation-agentique/` pour la bannière `gruyere-hero.js`). Toute autre dépendance tierce doit être justifiée explicitement avant intégration.
```

- [ ] **Step 3: Verify the rule is now coherent**

Run:

```bash
grep -n "jsDelivr\|Google Fonts\|tracker" CLAUDE.md
```

Expected: the line appears in § "Stack et conventions", consistent with the trois règles non négociables in Quick Reference.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: authorize jsDelivr CDN for Three.js on evaluation-agentique"
```

---

## Task 17: Final integration tests + cleanup

**Files:**
- Modify: `tests/gruyere-hero.test.mjs`

- [ ] **Step 1: Add cross-page integration assertions**

Append to `tests/gruyere-hero.test.mjs`:

```js
const HOST_PAGES = [
  'evaluation-agentique/index.html',
  'evaluation-agentique/20260501-evaluation-agentique-app.html',
  'evaluation-agentique/20260521-evaluation-agentique-canvas.html',
];

for (const page of HOST_PAGES) {
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
```

- [ ] **Step 2: Run full test suite**

```bash
node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs tests/gruyere-hero.test.mjs
```

Expected: all tests pass. No regression on the existing suites.

- [ ] **Step 3: Visual final pass — all 3 pages**

Local server. Open in sequence:
- `http://localhost:8000/evaluation-agentique/`
- `http://localhost:8000/evaluation-agentique/20260501-evaluation-agentique-app.html`
- `http://localhost:8000/evaluation-agentique/20260521-evaluation-agentique-canvas.html`

For each, verify:
1. Bannière s'affiche, animation tourne, accumulation visible.
2. Aucune erreur console.
3. Texte sous la bannière reste lisible et fonctionnel.
4. Le `aria-label` se lit correctement (inspecter le DOM).
5. Le `<figcaption>` est recentré sous l'animation.

- [ ] **Step 4: Mobile verification**

Chrome DevTools → toggle device toolbar → iPhone 12. For each of the 3 pages, verify:
1. Bannière hauteur réduite (45vh max).
2. Animation tourne (peut être ralentie).
3. Pas de scroll horizontal.
4. Caption recentré et lisible.

- [ ] **Step 5: prefers-reduced-motion verification**

Chrome DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`. Reload each of the 3 pages. Expected: poster SVG affiché, pas de canvas, pas d'animation.

- [ ] **Step 6: Memory leak smoke-test**

DevTools → Memory → take heap snapshot. In console:

```js
const h = document.getElementById('gruyere-hero');
const handle = window.__heroHandle; // won't exist unless we expose it; alternative: trigger destroy via reload
```

Quick alternative: reload the page 5 times, then check that Memory tab does not show monotonically growing retained size. Acceptable if stable across reloads.

- [ ] **Step 7: Remove _dev-hero.html if accidentally tracked**

```bash
git status --short evaluation-agentique/_dev-hero.html
```

If shown: it was added against intent. Remove it:

```bash
git rm evaluation-agentique/_dev-hero.html 2>/dev/null || true
rm -f evaluation-agentique/_dev-hero.html
```

If untracked (`??`): already gitignored, leave it on disk for future dev work.

- [ ] **Step 8: Final commit**

```bash
git add tests/gruyere-hero.test.mjs
git commit -m "test(eval/hero): cross-page integration assertions"
```

---

## Task 18: PR creation

**Files:** none

- [ ] **Step 1: Verify branch state**

```bash
git status --short
git log --oneline origin/main..HEAD
```

Expected: clean working tree, ~16 commits ahead of `main` (Task 1 → Task 17, no Task 18 commit since none was needed).

- [ ] **Step 2: Push branch**

```bash
git push -u origin claude/gruyere-hero-3d-2026-05-21
```

Expected: push succeeds (branch push is allowed by the proxy). The `main` push is blocked but the branch push is not.

- [ ] **Step 3: Open PR via GitHub MCP**

Use `mcp__github__create_pull_request` with:

```
owner: mathieugug
repo: mathieugug.github.io
base: main
head: claude/gruyere-hero-3d-2026-05-21
title: Hero 3D gruyère animé — bannière vedette du dossier evaluation-agentique
body:
  ## Pourquoi
  Le dossier evaluation-agentique mérite une signature visuelle forte au-dessus du titre — l'étude raconte le modèle gruyère de Reason, donnons-le à voir en mouvement.

  ## Quoi
  - Bannière 3D animée Three.js : 3 plaques percées en perspective, particules perpendiculaires, accumulation visible des survivants sur l'écran arrière.
  - Module ESM `evaluation-agentique/gruyere-hero.js` (+ CSS + poster SVG) intégré sur les 3 pages du dossier : hub, app rapport, canvas.
  - Seed déterministe ⇒ même bannière sur les 3 supports = identité visuelle stable.
  - Fallback poster SVG si `prefers-reduced-motion` ou WebGL absent.
  - Mobile : particleRate réduit, hauteur réduite, cap GPU.
  - CLAUDE.md : exception jsDelivr documentée.

  ## Tests
  - `node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs tests/gruyere-hero.test.mjs` — green.
  - Vérif visuelle manuelle sur les 3 pages, desktop + mobile, reduced-motion.

  ## Spec & plan
  - Spec : `docs/superpowers/specs/2026-05-21-gruyere-hero-3d-animation-design.md`
  - Plan : `docs/superpowers/plans/2026-05-21-gruyere-hero-3d-animation.md`

  Format co-écrit avec l'aide d'une IA.
```

- [ ] **Step 4: Communicate the PR URL to the user**

Return the PR URL from the MCP response. Wait for Mathieu to merge manually.

---

## Self-Review

**Spec coverage:**

| Spec § | Task |
|---|---|
| §2 Concept visuel · plaques + perspective | Tasks 5, 9 |
| §2 · particules + flux + couleur cream→orange | Tasks 6, 8 |
| §2 · filtre + fade-out + impact ring | Task 7 |
| §2 · accumulation + reset cycle | Task 8 |
| §2 · palette éditoriale | Tasks 4, 5, 8, 10 |
| §3 · Three.js ESM via jsDelivr | Task 4, importmap in 13/14/15 |
| §3 · ShapeGeometry + EdgesGeometry | Task 5 |
| §3 · point-in-circle, simulation CPU | Task 7 |
| §3 · Poisson seed déterministe + alignement | Task 3 |
| §3 · fichiers livrés (.js, .css, poster) | Tasks 1, 10, 12 |
| §4 · API mountGruyereHero + options | Tasks 1, 8, 10, 11 |
| §4 · couleur --accent dynamique | Task 6 |
| §4 · paramètres figés | Tasks 5, 6 (constants) |
| §5 · intégration hub | Task 13 |
| §5 · intégration app rapport | Task 14 |
| §5 · intégration canvas + SVG statique préservé | Task 15 |
| §5 · caption | Tasks 13/14/15 (markup), Task 10 (CSS) |
| §6 · prefers-reduced-motion | Task 2 |
| §6 · WebGL fallback | Task 2 |
| §6 · ARIA | Tasks 13/14/15 |
| §6 · IntersectionObserver + ResizeObserver | Task 11 |
| §6 · mobile overrides | Tasks 4, 6, 10 |
| §6 · jsDelivr exception note CLAUDE.md | Task 16 |
| §7 · critères d'acceptation 1-8 | Task 17 (vérifs manuelles + tests) |

All spec sections covered.

**Placeholder scan:** scanned — no TBD, no "implement later", no "similar to X" hand-waves. Every code step shows the actual code.

**Type consistency:** spot-checked — `PLATE_Z` declared in Task 5 used in Task 7 unchanged; `accumulated[]` declared in Task 8 used in Task 8 reset logic; `triggerImpact`/`updateImpacts` signatures consistent between Task 7 definition and Task 7 wiring; `mountGruyereHero` config flow consistent across Tasks 1, 2, 4, 8, 10.

**Type fix found:** none. Plan is internally consistent.
