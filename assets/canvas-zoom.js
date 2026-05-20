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
