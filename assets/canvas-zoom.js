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
  function findLeafForCard(cardId) { /* Task A7 */ return null; }
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
