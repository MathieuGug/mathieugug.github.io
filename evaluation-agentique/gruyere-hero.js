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
  const caption = container.querySelector('.gruyere-hero__caption');
  if (caption) container.insertBefore(img, caption);
  else container.appendChild(img);
  return { destroy() { img.remove(); }, pause() {}, resume() {}, reset() {} };
}

export function mountGruyereHero(container, opts = {}) {
  const config = { ...DEFAULTS, ...opts };
  const caps = detectCapabilities();
  // Resolve poster URL relative to this module's directory (works from hub, app, canvas).
  const scriptDir = new URL('.', import.meta.url).href;
  if (caps.reducedMotion || !caps.webgl) {
    return mountPoster(container, scriptDir);
  }
  // TODO Task 4: scene, plates, particles
  return { destroy() {}, pause() {}, resume() {}, reset() {} };
}
