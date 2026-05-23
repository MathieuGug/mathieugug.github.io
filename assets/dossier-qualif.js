/* dossier-qualif — shared runtime for qualification widget
 *
 * Source unique de vérité : ce fichier rend les mini-blocs de qualif
 * (axes Maturité IA, Environnement, Cas d'usage, Équipe, Budget,
 * Gouvernance) au fil d'un dossier deep-research, calcule un profil
 * dominant parmi 5 personas, et affiche un récap radar SVG + verdict
 * + recos prioritaires en fin d'article.
 *
 * Spec : docs/superpowers/specs/2026-05-23-business-qualification-widget-design.md
 * Source de données : <dossier>/qualif.json (sidecar par dossier)
 * Persistence : localStorage['qualif_<slug>_v<n>']
 *
 * Aucune API publique, aucun framework. Le script se réveille sur
 * DOMContentLoaded, détecte la présence de <aside class="qualif-step">
 * dans le DOM, et trouve son fichier JSON via <link rel="qualif-data">.
 */

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────
  // Exposed for tests via globalThis.__qualif (node:test reads this when the
  // module is loaded via vm; in browser, this is just an internal namespace).
  // ─────────────────────────────────────────────────────────────────────────
  const Q = {};

  // ─────────────────────────────────────────────────────────────────────────
  // Pure functions — moteur de calcul (Phase 2)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Retourne le score 0-100 d'un axe, ou null si non renseigné.
   */
  Q.computeAxisScore = function computeAxisScore(axis, state) {
    const axial = axis.inputs.find(function (i) { return i.scoring === 'axis'; });
    if (!axial) {
      throw new Error('Axis "' + axis.id + '" has no axial-scoring input');
    }
    const key = axis.id + '.' + axial.id;
    const raw = state[key];
    if (raw === undefined || raw === null || raw === '') return null;

    if (axial.type === 'slider-anchored') {
      return Number(raw);
    }
    if (axial.type === 'segmented') {
      const opt = axial.options.find(function (o) { return o.id === raw; });
      return opt && typeof opt.score === 'number' ? opt.score : null;
    }
    return null;
  };
  Q.dominantProfile = function () {};    // Phase 2.3
  Q.applyAdjustments = function () {};   // Phase 2.4
  Q.renderRadarPath = function () {};    // Phase 2.5

  // ─────────────────────────────────────────────────────────────────────────
  // DOM bootstrap — branché en Phase 3 (laissé vide pour l'instant)
  // ─────────────────────────────────────────────────────────────────────────

  function init() {
    // Branché en Phase 3
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  // Expose pour tests
  if (typeof globalThis !== 'undefined') {
    globalThis.__qualif = Q;
  }
})();
