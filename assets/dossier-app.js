/* dossier-app — shared runtime for /*/2026*-app.html
 *
 * Source unique de vérité : ce fichier remplace le JS comportemental
 * inline qui était dupliqué dans 14 apps. Il se réveille sur
 * DOMContentLoaded, lit window.SCHEMAS (data fournie par la page),
 * trouve les éléments DOM par ID conventionnel, câble les handlers.
 *
 * Aucune API publique, aucun export. La page n'invoque pas la lib —
 * elle l'inclut et fournit les bons IDs + window.SCHEMAS.
 *
 * Spec : docs/superpowers/specs/2026-05-09-dossier-app-library-design.md
 */
(function () {
  'use strict';

  function init() {
    setupModal();
    setupCitations();
    setupTooltips();
    setupTocObserver();
    setupMobilePanels();
    setupSourcesToggle();
    setupZoom();
    setupSigil();
    setupTopbarScroll();
  }

  // ──────────────────────────────────────────────────────────
  // Modal dispatcher
  // ──────────────────────────────────────────────────────────

  function setupModal() {
    // TODO Task 1.3
  }

  // ──────────────────────────────────────────────────────────
  // Citations → highlight source in sidebar
  // ──────────────────────────────────────────────────────────

  function setupCitations() {
    // TODO Task 1.3
  }

  // ──────────────────────────────────────────────────────────
  // Tooltips: pin on touch / click for mobile
  // ──────────────────────────────────────────────────────────

  function setupTooltips() {
    // TODO Task 1.3
  }

  // ──────────────────────────────────────────────────────────
  // TOC active section + smooth scroll
  // ──────────────────────────────────────────────────────────

  function setupTocObserver() {
    // TODO Task 1.3
  }

  // ──────────────────────────────────────────────────────────
  // Mobile panels (TOC + Sources)
  // ──────────────────────────────────────────────────────────

  function setupMobilePanels() {
    // TODO Task 1.3
  }

  // ──────────────────────────────────────────────────────────
  // Sources sidebar — desktop collapse/expand
  // ──────────────────────────────────────────────────────────

  function setupSourcesToggle() {
    // TODO Task 1.3
  }

  // ──────────────────────────────────────────────────────────
  // Fullscreen zoom for schemas
  // ──────────────────────────────────────────────────────────

  function setupZoom() {
    // TODO Task 1.3
  }

  // ──────────────────────────────────────────────────────────
  // Schema sigil injection — MG monogram on each figure
  // ──────────────────────────────────────────────────────────

  function setupSigil() {
    // TODO Task 1.3
  }

  // ──────────────────────────────────────────────────────────
  // Topbar scroll class
  // ──────────────────────────────────────────────────────────

  function setupTopbarScroll() {
    // TODO Task 1.3
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
