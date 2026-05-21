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

function tooClose(hole, others, slack = 0.1) {
  for (const o of others) {
    const dx = hole.x - o.x, dy = hole.y - o.y;
    if (Math.hypot(dx, dy) < hole.r + o.r + slack) return true;
  }
  return false;
}

function generateHoles(plateIndex, rng, parentHoles) {
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

function detectCapabilities() {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const probe = document.createElement('canvas');
  const webgl = !!(probe.getContext('webgl2') || probe.getContext('webgl'));
  const mobile = matchMedia('(max-width: 768px)').matches ||
                 (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);
  return { reducedMotion, webgl, mobile };
}

function initScene(container) {
  const w = container.clientWidth;
  const h = container.clientHeight;
  const scene = new THREE.Scene();
  scene.background = null; // CSS background of container shows through

  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
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

  // TODO Task 5-9: plates, particles, accumulation, camera orbit

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
