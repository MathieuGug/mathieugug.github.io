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
  orbitSpeed: 0.055,
  holeSeed: 'eval-2026',
  // Target fraction of emitted particles that reach the accumulator (the "attack
  // success rate"). The hole alignment between plates is tuned at mount time
  // via Monte Carlo until the geometric survival rate matches this target.
  // 0.01 = 1% — realistic for stacked defenses.
  targetSurvivalRate: 0.01,
};

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

// Plate dimensions: 5×5 unit square centered on origin (x,y in [-2.5, 2.5]).
const PLATE_HALF = 2.5;
const HOLE_R_MIN = 0.07;
const HOLE_R_MAX = 0.22;
const ALIGN_P2_TO_P1 = 0.30;
const ALIGN_P3_TO_P2 = 0.15;

// Z layout — well-spaced plates and the accumulator screen far behind plate 3.
const PLATE_Z = [0.5, 3.0, 5.5];     // 2.5u between plates so the depth reads
const ACCUMULATOR_Z = 8.0;            // 2.5u behind plate 3 — distinct back wall
const SPAWN_Z = -3.0;                 // well upstream — particles enter from far in front
const CUBE_Z_MIN = 0;
const CUBE_Z_MAX = 8.0;

function tooClose(hole, others, slack = 0.1) {
  for (const o of others) {
    const dx = hole.x - o.x, dy = hole.y - o.y;
    if (Math.hypot(dx, dy) < hole.r + o.r + slack) return true;
  }
  return false;
}

function generateHoles(plateIndex, rng, parentHoles, alignRatioOverride) {
  const target = 4 + Math.floor(rng() * 5); // 4..8 inclusive
  const holes = [];

  // Alignment pass: copy a fraction of parent holes (with small jitter).
  if (parentHoles) {
    const defaultRatio = plateIndex === 1 ? ALIGN_P2_TO_P1 : ALIGN_P3_TO_P2;
    const ratio = alignRatioOverride != null ? alignRatioOverride : defaultRatio;
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

// Monte Carlo: estimate the geometric survival rate of `plates` (array of
// { holes, z }). N random spawn positions, count how many pass-through.
function monteCarloSurvival(plates, n) {
  // Sample over the actual spawn area so the estimated rate matches the
  // animation. SPAWN_HALF is declared later in the file but hoisted via `const`.
  const half = PLATE_HALF - 0.2;
  let survivors = 0;
  for (let i = 0; i < n; i++) {
    const x = (Math.random() * 2 - 1) * half;
    const y = (Math.random() * 2 - 1) * half;
    let alive = true;
    for (const plate of plates) {
      let hits = false;
      for (const h of plate.holes) {
        const dx = x - h.x, dy = y - h.y;
        if (dx*dx + dy*dy <= h.r * h.r) { hits = true; break; }
      }
      if (!hits) { alive = false; break; }
    }
    if (alive) survivors++;
  }
  return survivors / n;
}

// Iteratively tune the plate-2-to-1 and plate-3-to-2 alignment ratios until
// the Monte Carlo survival rate matches `targetRate` within ±25%. The seed
// stays fixed so hole positions/sizes are identical across iterations —
// only the count of "aligned" holes changes. Returns the best-fitting
// hole layouts plus the achieved survival rate.
function tuneHolesForTarget(seedStr, targetRate, maxAttempts = 8) {
  let alignP2 = ALIGN_P2_TO_P1;
  let alignP3 = ALIGN_P3_TO_P2;
  let bestHoles = null;
  let bestDelta = Infinity;
  let bestRate = 0;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const rng = mulberry32(hashSeed(seedStr));
    const platesHoles = [];
    for (let i = 0; i < 3; i++) {
      const parent = i === 0 ? null : platesHoles[i - 1];
      const ratio = i === 0 ? null : (i === 1 ? alignP2 : alignP3);
      platesHoles.push(generateHoles(i, rng, parent, ratio));
    }
    const platesForSim = platesHoles.map((h, i) => ({ holes: h, z: PLATE_Z[i] }));
    const rate = monteCarloSurvival(platesForSim, 5000);

    const delta = Math.abs(rate - targetRate);
    if (delta < bestDelta) {
      bestDelta = delta;
      bestHoles = platesHoles;
      bestRate = rate;
    }
    if (targetRate > 0 && delta / targetRate < 0.25) break;

    // Adjust toward target. Sqrt damping keeps it stable.
    if (rate > 0) {
      const factor = Math.sqrt(targetRate / rate);
      alignP2 = Math.max(0.0, Math.min(0.95, alignP2 * factor));
      alignP3 = Math.max(0.0, Math.min(0.95, alignP3 * factor));
    } else {
      // No survivors at all — push alignment up.
      alignP2 = Math.min(0.95, alignP2 * 1.5 + 0.05);
      alignP3 = Math.min(0.95, alignP3 * 1.5 + 0.05);
    }
  }

  return { holesPerPlate: bestHoles, achievedRate: bestRate };
}

function detectCapabilities() {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const probe = document.createElement('canvas');
  const webgl = !!(probe.getContext('webgl2') || probe.getContext('webgl'));
  const mobile = matchMedia('(max-width: 768px)').matches ||
                 (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);
  return { reducedMotion, webgl, mobile };
}

// Persistent "scars" left on plates where particles crashed. Accumulate across
// the reset cycle, then cleared together with the accumulated survivors.
const MAX_MARKS = 800;
const MARK_COLOR = 0xa83020;  // deeper red than the ring so the trace stains the plate

function buildMarkSystem(maxCount) {
  const positions = new Float32Array(maxCount * 3);
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setDrawRange(0, 0);
  const mat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(MARK_COLOR) } },
    vertexShader: `
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 42.0 * (1.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      void main() {
        vec2 c = gl_PointCoord - vec2(0.5);
        float d = length(c);
        if (d > 0.5) discard;
        float soft = smoothstep(0.5, 0.25, d);
        gl_FragColor = vec4(uColor, 0.85 * soft);
      }
    `,
    transparent: true,
    depthWrite: false,
  });
  const points = new THREE.Points(geom, mat);
  return { points, geom, positions, count: 0 };
}

function addMark(ms, x, y, z) {
  if (ms.count >= MAX_MARKS) return;
  const off = ms.count * 3;
  ms.positions[off    ] = x;
  ms.positions[off + 1] = y;
  // Push the mark just in front of the plate so it sits ON the surface, not inside.
  ms.positions[off + 2] = z - 0.055;
  ms.count++;
  ms.geom.attributes.position.needsUpdate = true;
  ms.geom.setDrawRange(0, ms.count);
}

function clearMarks(ms) {
  ms.count = 0;
  ms.geom.setDrawRange(0, 0);
}

// Particle states.
const STATE_ALIVE = 0;
const STATE_FADING = 1;
const STATE_ACCUMULATED = 2;
const STATE_DEAD = 3;

const PARTICLE_SPEED = 2.4;  // units/s — tuned so lifetime × spawnRate stays below the cap
// SPAWN_HALF MUST be ≤ PLATE_HALF — particles must engage with the plates,
// never fall above/below them. Small inward padding keeps the impact pattern
// safely inside the plate face.
const SPAWN_HALF = PLATE_HALF - 0.2;

function buildParticleSystem(maxCount) {
  const positions = new Float32Array(maxCount * 3);
  const colors = new Float32Array(maxCount * 3);
  const alphas = new Float32Array(maxCount);

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geom.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
  geom.setDrawRange(0, 0);

  // Shader material with per-vertex alpha + circular point sprite.
  const mat = new THREE.ShaderMaterial({
    vertexShader: `
      attribute float alpha;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vColor = color;
        vAlpha = alpha;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 95.0 * (1.0 / -mvPosition.z);
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
        float soft = smoothstep(0.5, 0.2, d);
        gl_FragColor = vec4(vColor, vAlpha * soft);
      }
    `,
    transparent: true,
    vertexColors: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geom, mat);

  const particles = new Array(maxCount).fill(null).map(() => ({
    state: STATE_DEAD,
    x: 0, y: 0, z: 0,
    r: 1, g: 1, b: 1,
    a: 1,
    fadeStart: 0,
  }));

  return { points, geom, particles, positions, colors, alphas };
}

// Trail length behind each alive particle, in world units.
const TRAIL_LENGTH = 0.45;

// One LineSegments mesh holds the trail of every alive particle. Each particle
// contributes 2 vertices: head (at current position, full alpha) and tail
// (TRAIL_LENGTH behind, alpha 0). The fragment shader interpolates colour and
// alpha along each line segment giving a fading streak.
function buildTrailSystem(maxCount) {
  const positions = new Float32Array(maxCount * 2 * 3);
  const colors = new Float32Array(maxCount * 2 * 3);
  const alphas = new Float32Array(maxCount * 2);

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geom.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
  geom.setDrawRange(0, 0);

  const mat = new THREE.ShaderMaterial({
    vertexShader: `
      attribute float alpha;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vColor = color;
        vAlpha = alpha;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        gl_FragColor = vec4(vColor, vAlpha);
      }
    `,
    transparent: true,
    vertexColors: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const lines = new THREE.LineSegments(geom, mat);
  return { lines, geom, positions, colors, alphas };
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

// Effect pools — short-lived bursts at the point of a plate-crossing.
// - blocked → red expanding RING (the particle was stopped)
// - passed  → green soft DISC (the particle made it through a hole)
const BURST_LIFETIME = 0.65; // seconds
const MAX_BURSTS = 30;
const BLOCKED_COLOR = 0xc0392b;  // red — alert / failure
const PASSED_COLOR  = 0x4caf50;  // green — success / breach signal

function buildRingPool(color) {
  const rings = [];
  for (let i = 0; i < MAX_BURSTS; i++) {
    const geom = new THREE.RingGeometry(0.04, 0.07, 28);
    const mat = new THREE.MeshBasicMaterial({
      color,
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

function buildBurstPool(color) {
  const discs = [];
  for (let i = 0; i < MAX_BURSTS; i++) {
    const geom = new THREE.CircleGeometry(0.12, 28);
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.visible = false;
    discs.push({ mesh, life: 0, alive: false });
  }
  return discs;
}

function triggerBurst(pool, x, y, z) {
  for (const r of pool) {
    if (!r.alive) {
      r.alive = true;
      r.life = BURST_LIFETIME;
      r.mesh.position.set(x, y, z);
      r.mesh.scale.set(1, 1, 1);
      r.mesh.material.opacity = 0.85;
      r.mesh.visible = true;
      return;
    }
  }
}

function updateBurst(pool, dt, growthFactor) {
  for (const r of pool) {
    if (!r.alive) continue;
    r.life -= dt;
    if (r.life <= 0) {
      r.alive = false;
      r.mesh.visible = false;
      continue;
    }
    const t = 1 - r.life / BURST_LIFETIME;
    const scale = 1 + t * growthFactor;
    r.mesh.scale.set(scale, scale, 1);
    r.mesh.material.opacity = 0.85 * (1 - t);
  }
}

// Wireframe cube (12 edges) + faint base socle. Defines the volume so the
// implicit cube becomes legible without being loud. Centered on z = (CUBE_Z_MIN + CUBE_Z_MAX) / 2.
function buildVolumeFrame() {
  const group = new THREE.Group();
  const w = PLATE_HALF * 2;            // 4
  const d = CUBE_Z_MAX - CUBE_Z_MIN;   // 4
  const centerZ = (CUBE_Z_MIN + CUBE_Z_MAX) / 2;

  // No visible cube wireframe — the volume is implicit. Only socle is drawn.

  // Socle: faint horizontal plane just below the cube bottom, slightly larger.
  const socleW = w + 0.6;
  const socleD = d + 0.6;
  const socleGeom = new THREE.PlaneGeometry(socleW, socleD);
  socleGeom.rotateX(-Math.PI / 2);
  const socleMat = new THREE.MeshBasicMaterial({
    color: 0x1a1a1a,
    transparent: true,
    opacity: 0.05,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const socle = new THREE.Mesh(socleGeom, socleMat);
  socle.position.set(0, -PLATE_HALF - 0.02, centerZ);
  group.add(socle);

  // Socle outline (thin border around the base).
  const halfW = socleW / 2;
  const halfD = socleD / 2;
  const outlinePositions = new Float32Array([
    -halfW, 0, -halfD,  halfW, 0, -halfD,
     halfW, 0, -halfD,  halfW, 0,  halfD,
     halfW, 0,  halfD, -halfW, 0,  halfD,
    -halfW, 0,  halfD, -halfW, 0, -halfD,
  ]);
  const outlineGeom = new THREE.BufferGeometry();
  outlineGeom.setAttribute('position', new THREE.BufferAttribute(outlinePositions, 3));
  const outlineMat = new THREE.LineBasicMaterial({
    color: 0x1a1a1a,
    transparent: true,
    opacity: 0.40,
  });
  const outline = new THREE.LineSegments(outlineGeom, outlineMat);
  outline.position.set(0, -PLATE_HALF - 0.02, centerZ);
  group.add(outline);

  return group;
}

// Bounding sphere — bounds plates + accumulator (the framed subject). Padding
// > 1.0 leaves margin so the orbital camera NEVER clips at any angle. Spawn
// area extends slightly outside the sphere; particles there read as "incoming
// from off-screen", which is intentional. Padding must compensate for the
// asymmetry between the bounding-sphere math and actual scene corner reach.
const SCENE_RADIUS = 5.5;
const FIT_PADDING = 1.12;

function computeOrbitRadius(camera) {
  const vFovHalf = camera.fov * Math.PI / 360;
  const aspect = camera.aspect;
  // Horizontal half-FOV derived from vertical FOV and aspect ratio.
  const hFovHalf = Math.atan(aspect * Math.tan(vFovHalf));
  // The narrower of the two dimensions constrains the required distance.
  const minHalfFov = Math.min(vFovHalf, hFovHalf);
  return FIT_PADDING * SCENE_RADIUS / Math.sin(minHalfFov);
}

// Plate visual constants — three rich tones (layer-coded), MeshPhong so they
// don't need an environment map to read as coloured rather than black.
const PLATE_THICKNESS = 0.12;
const PLATE_COLORS = [
  0x3a5570,   // deep steel blue — préventif
  0x8a5a3a,   // brushed copper — curatif
  0x5a4068,   // muted aubergine — qualitatif
];
const PLATE_SPECULAR = 0xb8a888;
const PLATE_SHININESS = 90;
const PLATE_OPACITY = 0.78;

// Particle visual — bright cream head, warm-red "danger" trail behind.
const PARTICLE_COLOR = 0xfaf2e0;
const PARTICLE_SIZE_PX = 95;
const TRAIL_DANGER_COLOR = 0xff5a28;  // warm orange-red — "threat in motion"

function buildPlate(holes, z, plateIndex) {
  const shape = new THREE.Shape();
  shape.moveTo(-PLATE_HALF, -PLATE_HALF);
  shape.lineTo( PLATE_HALF, -PLATE_HALF);
  shape.lineTo( PLATE_HALF,  PLATE_HALF);
  shape.lineTo(-PLATE_HALF,  PLATE_HALF);
  shape.lineTo(-PLATE_HALF, -PLATE_HALF);
  for (const h of holes) {
    const hole = new THREE.Path();
    hole.absarc(h.x, h.y, h.r, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }

  // Extrude the 2D shape into a thin 3D slab so the plate has real edges.
  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: PLATE_THICKNESS,
    bevelEnabled: true,
    bevelThickness: 0.014,
    bevelSize: 0.010,
    bevelSegments: 2,
    curveSegments: 32,
  });
  geom.translate(0, 0, -PLATE_THICKNESS / 2);

  // Phong material reads colour without needing an env map (unlike PBR
  // standard which paints black without one).
  const mat = new THREE.MeshPhongMaterial({
    color: PLATE_COLORS[plateIndex] ?? PLATE_COLORS[0],
    specular: PLATE_SPECULAR,
    shininess: PLATE_SHININESS,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: PLATE_OPACITY,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.z = z;

  // Subtle dark rim picks out the front silhouette + holes.
  const rimEdges = new THREE.EdgesGeometry(geom, 18);
  const rimMat = new THREE.LineBasicMaterial({
    color: 0x141414,
    transparent: true,
    opacity: 0.55,
  });
  const rim = new THREE.LineSegments(rimEdges, rimMat);
  rim.position.z = z;

  const group = new THREE.Group();
  group.add(mesh);
  group.add(rim);
  return { group, holes, z };
}

// The back wall where survivors accumulate — a deeper, matte surface that
// clearly reads as "the screen behind the defenses".
const ACCUMULATOR_COLOR = 0x1d1b18;
function buildAccumulatorScreen() {
  const w = PLATE_HALF * 2;
  const geom = new THREE.PlaneGeometry(w, w);
  const mat = new THREE.MeshStandardMaterial({
    color: ACCUMULATOR_COLOR,
    metalness: 0.10,
    roughness: 0.92,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geom, mat);
  plane.position.z = ACCUMULATOR_Z;
  return plane;
}

function initScene(container) {
  const w = container.clientWidth;
  const h = container.clientHeight;
  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
  camera.position.set(-6, 3, -4);
  camera.lookAt(0, 0, 2);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Lighting: hemisphere (sky+ground tonality) + warm key + cool fill.
  const hemi = new THREE.HemisphereLight(0xfff1d8, 0x6a4a2a, 0.65);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff2d8, 1.10);
  key.position.set(-5, 7, -3);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xc8d4e2, 0.55);
  fill.position.set(5, -1, 6);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xff9a5a, 0.35);
  rim.position.set(2, 2, 10);  // warm rim from behind to lick the back wall
  scene.add(rim);

  return { scene, camera, renderer };
}

function mountPoster(container, scriptDir) {
  const img = document.createElement('img');
  img.src = scriptDir + 'gruyere-hero-poster.svg';
  img.alt = '3 plaques perforées en perspective, particules accumulées sur l\'écran arrière';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';
  const caption = container.querySelector('.gruyere-hero__caption');
  if (caption) container.insertBefore(img, caption);
  else container.appendChild(img);
  return { destroy() { img.remove(); }, pause() {}, resume() {}, reset() {} };
}

export function mountGruyereHero(container, opts = {}) {
  const config = { ...DEFAULTS, ...opts };
  const caps = detectCapabilities();
  const scriptDir = new URL('.', import.meta.url).href;
  if (caps.reducedMotion || !caps.webgl) {
    return mountPoster(container, scriptDir);
  }

  const { scene, camera, renderer } = initScene(container);

  if (caps.mobile) {
    config.particleRate = 8;
  }

  // Optional reset button (hidden by default).
  let resetButton = null;
  if (config.showResetButton) {
    resetButton = document.createElement('button');
    resetButton.type = 'button';
    resetButton.className = 'gruyere-hero__reset';
    resetButton.textContent = 'Reset';
    resetButton.setAttribute('aria-label', 'Réinitialiser l\'accumulation');
    container.appendChild(resetButton);
  }

  // Volume frame: wireframe cube + socle (the implicit cube made visible).
  const frame = buildVolumeFrame();
  scene.add(frame);

  // Back wall: the accumulator screen, visible as a matte surface.
  const accumulatorScreen = buildAccumulatorScreen();
  scene.add(accumulatorScreen);

  // Hole geometry: tune alignment ratios via Monte Carlo so that the resulting
  // geometric survival rate matches config.targetSurvivalRate. Same seed
  // across iterations = stable visual identity, only alignment varies.
  const tuned = tuneHolesForTarget(config.holeSeed, config.targetSurvivalRate);
  const platesData = [];
  for (let i = 0; i < 3; i++) {
    const plate = buildPlate(tuned.holesPerPlate[i], PLATE_Z[i], i);
    platesData.push(plate);
    scene.add(plate.group);
  }

  // Particles + trails.
  const MAX_PARTICLES = caps.mobile ? 50 : 100;
  const psys = buildParticleSystem(MAX_PARTICLES);
  const tsys = buildTrailSystem(MAX_PARTICLES);
  scene.add(tsys.lines);  // trails behind heads (z-order: drawn first)
  scene.add(psys.points);

  const particleColor = new THREE.Color(PARTICLE_COLOR);
  const dangerColor = new THREE.Color(TRAIL_DANGER_COLOR);
  const accentColor = readAccentColor();
  const partRng = mulberry32(hashSeed(config.holeSeed + '-particles'));

  const blockedRings = buildRingPool(BLOCKED_COLOR);  // red — blocked at a plate
  const passedBursts = buildBurstPool(PASSED_COLOR);  // green — passed through a hole
  const marks = buildMarkSystem(MAX_MARKS);            // persistent red scars on plates
  for (const r of blockedRings) scene.add(r.mesh);
  for (const r of passedBursts) scene.add(r.mesh);
  scene.add(marks.points);

  // Accumulation: particles that pass plate 3 are frozen on the back wall.
  const accumulated = [];
  let resetCycleStart = performance.now();
  let resetStartedAt = -1; // -1 = not currently fading out the constellation
  const RESET_FADE_MS = 1500;

  let lastT = performance.now();
  let spawnAccumulator = 0;

  const FADE_DURATION = 0.3; // seconds

  function hitsAnyHole(x, y, holes) {
    for (const h of holes) {
      const dx = x - h.x, dy = y - h.y;
      if (dx*dx + dy*dy <= h.r * h.r) return true;
    }
    return false;
  }

  function updateParticles(dt, now) {
    spawnAccumulator += config.particleRate * dt;
    while (spawnAccumulator >= 1) {
      spawnAccumulator -= 1;
      for (let i = 0; i < psys.particles.length; i++) {
        if (psys.particles[i].state === STATE_DEAD) {
          spawnParticle(psys.particles[i], partRng, particleColor);
          break;
        }
      }
    }
    for (let i = 0; i < psys.particles.length; i++) {
      const p = psys.particles[i];
      if (p.state === STATE_ALIVE) {
        const prevZ = p.z;
        p.z += PARTICLE_SPEED * dt;
        for (let k = 0; k < platesData.length; k++) {
          const plate = platesData[k];
          if (prevZ < plate.z && p.z >= plate.z) {
            if (!hitsAnyHole(p.x, p.y, plate.holes)) {
              p.state = STATE_FADING;
              p.fadeStart = now;
              triggerBurst(blockedRings, p.x, p.y, plate.z);
              addMark(marks, p.x, p.y, plate.z);
              break;
            } else {
              // Passed through a hole — green cloud signals the breach.
              triggerBurst(passedBursts, p.x, p.y, plate.z + 0.01);
            }
          }
        }
        if (p.state === STATE_ALIVE && p.z >= ACCUMULATOR_Z) {
          p.state = STATE_ACCUMULATED;
          p.z = ACCUMULATOR_Z;
          p.r = accentColor.r;
          p.g = accentColor.g;
          p.b = accentColor.b;
          p.a = 0.85;
          accumulated.push(p);
        }
      } else if (p.state === STATE_FADING) {
        const elapsed = (now - p.fadeStart) / 1000;
        const t = Math.min(1, elapsed / FADE_DURATION);
        p.a = 0.9 * (1 - t);
        if (t >= 1) p.state = STATE_DEAD;
      }
    }
    let drawCount = 0;
    let trailCount = 0;
    for (let i = 0; i < psys.particles.length; i++) {
      const p = psys.particles[i];
      if (p.state === STATE_DEAD) continue;
      // Head dot (Points).
      const off = drawCount * 3;
      psys.positions[off    ] = p.x;
      psys.positions[off + 1] = p.y;
      psys.positions[off + 2] = p.z;
      psys.colors[off    ] = p.r;
      psys.colors[off + 1] = p.g;
      psys.colors[off + 2] = p.b;
      psys.alphas[drawCount] = p.a;
      drawCount++;

      // Trail segment (LineSegments) — only for in-flight particles. Head is
      // the bright cream particle; tail fades to a warm danger orange + 0 alpha,
      // giving a hot streak behind each incoming attack.
      if (p.state === STATE_ALIVE) {
        const offT = trailCount * 6;
        // Head vertex
        tsys.positions[offT    ] = p.x;
        tsys.positions[offT + 1] = p.y;
        tsys.positions[offT + 2] = p.z;
        tsys.colors[offT    ] = p.r;
        tsys.colors[offT + 1] = p.g;
        tsys.colors[offT + 2] = p.b;
        tsys.alphas[trailCount * 2] = p.a * 0.85;
        // Tail vertex — warm orange-red, fully faded alpha
        const tailZ = Math.max(p.z - TRAIL_LENGTH, SPAWN_Z);
        tsys.positions[offT + 3] = p.x;
        tsys.positions[offT + 4] = p.y;
        tsys.positions[offT + 5] = tailZ;
        tsys.colors[offT + 3] = dangerColor.r;
        tsys.colors[offT + 4] = dangerColor.g;
        tsys.colors[offT + 5] = dangerColor.b;
        tsys.alphas[trailCount * 2 + 1] = 0.0;
        trailCount++;
      }
    }
    psys.geom.attributes.position.needsUpdate = true;
    psys.geom.attributes.color.needsUpdate = true;
    psys.geom.attributes.alpha.needsUpdate = true;
    psys.geom.setDrawRange(0, drawCount);

    tsys.geom.attributes.position.needsUpdate = true;
    tsys.geom.attributes.color.needsUpdate = true;
    tsys.geom.attributes.alpha.needsUpdate = true;
    tsys.geom.setDrawRange(0, trailCount * 2);
  }

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
      const targetAlpha = 0.85 * (1 - t);
      for (const p of accumulated) p.a = targetAlpha;
      if (t >= 1) {
        for (const p of accumulated) p.state = STATE_DEAD;
        accumulated.length = 0;
        clearMarks(marks);
        resetStartedAt = -1;
        resetCycleStart = now;
      }
    }
  }

  // Orbital camera: slow rotation around the scene center. Distance is
  // recomputed each frame from the current aspect so the scene never clips.
  const ORBIT_Y_RATIO = 0.18;
  // Centre on the midpoint of plate-0 to accumulator (the framed subject).
  const ORBIT_CENTER = new THREE.Vector3(0, 0, (PLATE_Z[0] + ACCUMULATOR_Z) / 2);
  let orbitAngle = -Math.PI * 0.78;

  // Drag-to-rotate (horizontal mouse/touch drag → orbit angle).
  // Auto-rotation pauses while the user is dragging.
  let dragActive = false;
  let dragLastX = 0;
  renderer.domElement.style.cursor = 'grab';
  renderer.domElement.style.touchAction = 'pan-y';
  function onPointerDown(e) {
    dragActive = true;
    dragLastX = e.clientX;
    try { renderer.domElement.setPointerCapture(e.pointerId); } catch (_) {}
    renderer.domElement.style.cursor = 'grabbing';
  }
  function onPointerMove(e) {
    if (!dragActive) return;
    const dx = e.clientX - dragLastX;
    dragLastX = e.clientX;
    orbitAngle -= dx * 0.0065;
  }
  function onPointerUp(e) {
    if (!dragActive) return;
    dragActive = false;
    try { renderer.domElement.releasePointerCapture(e.pointerId); } catch (_) {}
    renderer.domElement.style.cursor = 'grab';
  }
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('pointercancel', onPointerUp);
  renderer.domElement.addEventListener('pointerleave', onPointerUp);

  function syncViewport() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    const aspect = w / h;
    if (Math.abs(camera.aspect - aspect) > 1e-3) {
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    }
    renderer.setSize(w, h, false);
  }

  // Pause rendering when the hero is out of viewport (battery on long pages).
  let inView = true;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) inView = e.isIntersecting;
    if (inView && !rafId) { lastT = performance.now(); animate(); }
    if (!inView && rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }, { threshold: 0.01 });
  io.observe(container);

  let rafId = null;
  function animate() {
    rafId = requestAnimationFrame(animate);
    const now = performance.now();
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;

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

    updateParticles(dt, now);
    updateBurst(blockedRings, dt, 3.5);  // red ring expands fast
    updateBurst(passedBursts, dt, 5.0);  // green cloud expands faster (breach signal)
    maybeReset(now);
    renderer.render(scene, camera);
  }
  animate();

  if (resetButton) {
    resetButton.addEventListener('click', () => { resetStartedAt = performance.now(); });
  }

  function disposeNode(obj) {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
      else obj.material.dispose();
    }
  }

  return {
    destroy() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      io.disconnect();
      if (resetButton) resetButton.remove();
      frame.traverse(disposeNode);
      for (const plate of platesData) plate.group.traverse(disposeNode);
      for (const r of blockedRings) disposeNode(r.mesh);
      for (const r of passedBursts) disposeNode(r.mesh);
      marks.geom.dispose();
      marks.points.material.dispose();
      psys.geom.dispose();
      psys.points.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
    pause() { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } },
    resume() { if (!rafId) { lastT = performance.now(); animate(); } },
    reset() { resetStartedAt = performance.now(); },
  };
}
