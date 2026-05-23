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
  /**
   * Retourne le profil le plus proche du vecteur utilisateur (distance euclidienne).
   * Les entrées null/undefined sont traitées comme 50 (neutre).
   * Tie-break stable selon l'ordre prioritaire fourni.
   */
  Q.dominantProfile = function dominantProfile(vec, profiles, tiebreakOrder) {
    const normalized = vec.map(function (v) {
      return (v === null || v === undefined) ? 50 : v;
    });
    let best = null;
    let bestDist = Infinity;
    let bestPriority = Infinity;
    for (let i = 0; i < profiles.length; i++) {
      const p = profiles[i];
      let dist = 0;
      for (let k = 0; k < 6; k++) {
        const d = normalized[k] - p.anchor[k];
        dist += d * d;
      }
      const priority = tiebreakOrder.indexOf(p.id);
      const isCloser = dist < bestDist;
      const isTieAndPrior = (dist === bestDist) && (priority < bestPriority);
      if (isCloser || isTieAndPrior) {
        best = p;
        bestDist = dist;
        bestPriority = priority;
      }
    }
    return best;
  };
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
