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

// Plate dimensions: 4×4 unit square centered on origin (x,y in [-2, 2]).
const PLATE_HALF = 2.0;
const HOLE_R_MIN = 0.05;
const HOLE_R_MAX = 0.18;
const ALIGN_P2_TO_P1 = 0.30;
const ALIGN_P3_TO_P2 = 0.15;

// Z layout — cube 4×4×4 from z=0 (front face) to z=4 (back face = accumulator).
// Plates sit inside with margin from the cube faces.
const PLATE_Z = [0.5, 2.0, 3.5];
const ACCUMULATOR_Z = 4.0;   // back face of the cube
const SPAWN_Z = -1.0;        // just in front of the cube front face
const CUBE_Z_MIN = 0;
const CUBE_Z_MAX = 4;

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
  let survivors = 0;
  for (let i = 0; i < n; i++) {
    const x = (Math.random() * 2 - 1) * 2.2; // SPAWN_HALF — declared further down
    const y = (Math.random() * 2 - 1) * 2.2;
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

// Particle states.
const STATE_ALIVE = 0;
const STATE_FADING = 1;
const STATE_ACCUMULATED = 2;
const STATE_DEAD = 3;

const PARTICLE_SPEED = 1.4;  // units/s along +z — slow enough to follow each particle visually
const SPAWN_HALF = 2.2;      // x,y range at spawn (slightly wider than plates)

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
        gl_PointSize = 18.0 * (1.0 / -mvPosition.z);
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

// Wireframe cube (12 edges) + faint base socle. Defines the volume so the
// implicit cube becomes legible without being loud. Centered on z = (CUBE_Z_MIN + CUBE_Z_MAX) / 2.
function buildVolumeFrame() {
  const group = new THREE.Group();
  const w = PLATE_HALF * 2;            // 4
  const d = CUBE_Z_MAX - CUBE_Z_MIN;   // 4
  const centerZ = (CUBE_Z_MIN + CUBE_Z_MAX) / 2;

  // 12 cube edges (faint).
  const box = new THREE.BoxGeometry(w, w, d);
  const edges = new THREE.EdgesGeometry(box);
  const edgeMat = new THREE.LineBasicMaterial({
    color: 0x1a1a1a,
    transparent: true,
    opacity: 0.22,
  });
  const wire = new THREE.LineSegments(edges, edgeMat);
  wire.position.z = centerZ;
  group.add(wire);

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

// Bounding sphere of the cube (corner-to-center). Camera distance is derived
// from this radius + the camera's actual FOV/aspect, so the scene always fits.
const SCENE_RADIUS = 3.6;
const FIT_PADDING = 1.25;

function computeOrbitRadius(camera) {
  const vFovHalf = camera.fov * Math.PI / 360;
  const aspect = camera.aspect;
  // Horizontal half-FOV derived from vertical FOV and aspect ratio.
  const hFovHalf = Math.atan(aspect * Math.tan(vFovHalf));
  // The narrower of the two dimensions constrains the required distance.
  const minHalfFov = Math.min(vFovHalf, hFovHalf);
  return FIT_PADDING * SCENE_RADIUS / Math.sin(minHalfFov);
}

function buildPlate(holes, z, opacity) {
  // Outer rectangle (4×4 unit square centered on origin in local space).
  const shape = new THREE.Shape();
  shape.moveTo(-PLATE_HALF, -PLATE_HALF);
  shape.lineTo( PLATE_HALF, -PLATE_HALF);
  shape.lineTo( PLATE_HALF,  PLATE_HALF);
  shape.lineTo(-PLATE_HALF,  PLATE_HALF);
  shape.lineTo(-PLATE_HALF, -PLATE_HALF);

  // Holes as circular paths.
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

function initScene(container) {
  const w = container.clientWidth;
  const h = container.clientHeight;
  const scene = new THREE.Scene();
  scene.background = null; // CSS background of container shows through

  const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
  // Initial position set by orbital camera in animate loop.
  camera.position.set(-6, 3, -4);
  camera.lookAt(0, 0, 2);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h);
  renderer.setClearColor(0x000000, 0); // transparent — CSS bg shows
  container.appendChild(renderer.domElement);

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

  // Hole geometry: tune alignment ratios via Monte Carlo so that the resulting
  // geometric survival rate matches config.targetSurvivalRate. Same seed
  // across iterations = stable visual identity, only alignment varies.
  const tuned = tuneHolesForTarget(config.holeSeed, config.targetSurvivalRate);
  const platesData = [];
  for (let i = 0; i < 3; i++) {
    const plate = buildPlate(tuned.holesPerPlate[i], PLATE_Z[i], config.plateOpacity);
    platesData.push(plate);
    scene.add(plate.group);
  }

  // Particles.
  const MAX_PARTICLES = caps.mobile ? 50 : 100;
  const psys = buildParticleSystem(MAX_PARTICLES);
  scene.add(psys.points);

  const creamColor = new THREE.Color(0xfaf6ec);
  const accentColor = readAccentColor();
  const partRng = mulberry32(hashSeed(config.holeSeed + '-particles'));

  const impacts = buildImpactPool(accentColor);
  for (const r of impacts) scene.add(r.mesh);

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
          spawnParticle(psys.particles[i], partRng, creamColor);
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
              triggerImpact(impacts, p.x, p.y, plate.z);
              break;
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
        resetStartedAt = -1;
        resetCycleStart = now;
      }
    }
  }

  // Orbital camera: slow rotation around the cube center. Distance is
  // recomputed each frame from the current aspect so the scene never clips.
  const ORBIT_Y_RATIO = 0.18;  // camera Y as a fraction of orbit radius
  const ORBIT_CENTER = new THREE.Vector3(0, 0, (CUBE_Z_MIN + CUBE_Z_MAX) / 2);
  let orbitAngle = -Math.PI * 0.78;

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

    orbitAngle += config.orbitSpeed * dt;
    const orbitRadius = computeOrbitRadius(camera);
    const orbitY = orbitRadius * ORBIT_Y_RATIO;
    camera.position.set(
      ORBIT_CENTER.x + orbitRadius * Math.sin(orbitAngle),
      orbitY,
      ORBIT_CENTER.z + orbitRadius * Math.cos(orbitAngle),
    );
    camera.lookAt(ORBIT_CENTER);

    updateParticles(dt, now);
    updateImpacts(impacts, dt);
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
      for (const r of impacts) disposeNode(r.mesh);
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
