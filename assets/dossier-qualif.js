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
   * Tie-break stable selon l'ordre prioritaire fourni ; ids inconnus → priorité basse.
   *
   * **Invariant** : `vec` doit avoir exactement 6 entrées (padder avec null pour
   * les axes non renseignés). Une longueur < 6 produit NaN et retourne null
   * silencieusement.
   *
   * @param {Array<number|null>} vec - 6 scores axiaux (peut contenir null pour partiel).
   * @param {Array<Object>} profiles - Liste des profils avec {id, anchor: [6]}.
   * @param {Array<string>} tiebreakOrder - IDs de profils dans l'ordre prioritaire.
   * @returns {Object|null} Le profil dominant, ou null si profiles est vide.
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
      const rawPriority = tiebreakOrder.indexOf(p.id);
      // Unknown ids land last (large number) rather than first (would be -1).
      const priority = rawPriority === -1 ? tiebreakOrder.length : rawPriority;
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
  function matchClause(when, state) {
    const key = when.axis + '.' + when.input;
    const value = state[key];

    if (when.contains !== undefined) {
      if (!Array.isArray(value)) return false;
      if (!value.includes(when.contains)) return false;
    }
    if (when.contains_any_of !== undefined) {
      if (!Array.isArray(value)) return false;
      const hit = when.contains_any_of.some(function (v) { return value.includes(v); });
      if (!hit) return false;
    }
    if (when.equals !== undefined) {
      if (value !== when.equals) return false;
    }
    if (when.not !== undefined) {
      if (value === when.not) return false;
      if (value === undefined || value === null) return false;
    }
    if (when.lt !== undefined) {
      if (typeof value !== 'number' || value >= when.lt) return false;
    }
    if (when.gt !== undefined) {
      if (typeof value !== 'number' || value <= when.gt) return false;
    }
    if (when.lte !== undefined) {
      if (typeof value !== 'number' || value > when.lte) return false;
    }
    if (when.gte !== undefined) {
      if (typeof value !== 'number' || value < when.gte) return false;
    }
    if (when.and) {
      if (!matchClause(when.and, state)) return false;
    }
    if (when.and_not) {
      if (matchClause(when.and_not, state)) return false;
    }
    return true;
  }

  /**
   * Retourne les recos déclenchées par les règles, max `cap` (défaut Infinity).
   * Ordre de déclaration du JSON respecté ; premières règles match gagnent.
   *
   * **En production**, passer cap=2 explicitement (limite éditoriale spec).
   * Le défaut Infinity facilite les tests qui exercent des règles plus loin
   * dans la séquence sans saturer le cap.
   *
   * @param {Object} state - Map des saisies.
   * @param {Array<Object>} adjustments - Règles du JSON.
   * @param {number} [cap=Infinity] - Maximum de recos. Phase 3 doit passer 2.
   * @returns {Array<string>}
   */
  Q.applyAdjustments = function applyAdjustments(state, adjustments, cap) {
    if (cap === undefined) cap = Infinity;
    const out = [];
    for (let i = 0; i < adjustments.length && out.length < cap; i++) {
      const adj = adjustments[i];
      if (matchClause(adj.when, state)) {
        out.push(adj.reco);
      }
    }
    return out;
  };
  /**
   * Construit l'attribut "d" d'un <path> SVG polygonal à 6 sommets,
   * un par axe, à partir des scores 0-100. Premier axe à -90° (top), sens horaire.
   */
  Q.renderRadarPath = function renderRadarPath(scores, geom) {
    const cx = geom.cx;
    const cy = geom.cy;
    const r = geom.radius;
    const N = 6;
    const points = [];
    for (let i = 0; i < N; i++) {
      const raw = scores[i];
      const v = (raw === null || raw === undefined) ? 0 : raw;
      const ratio = v / 100;
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / N;
      const x = cx + ratio * r * Math.cos(angle);
      const y = cy + ratio * r * Math.sin(angle);
      points.push(x.toFixed(2) + ',' + y.toFixed(2));
    }
    return 'M ' + points[0] + ' L ' + points.slice(1).join(' L ') + ' Z';
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Chargement du sidecar JSON
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Cherche <link rel="qualif-data" href="...qualif.json"> dans <head>,
   * fetch le JSON, retourne la Promise<config>.
   */
  function loadQualifConfig() {
    const link = document.querySelector('link[rel="qualif-data"]');
    if (!link) return Promise.resolve(null);
    return fetch(link.href).then(function (r) {
      if (!r.ok) throw new Error('qualif: fetch ' + link.href + ' → ' + r.status);
      return r.json();
    });
  }

  /**
   * Tiebreak order standard (Regulated > Builder > PoC > Pioneer > Explorer).
   * Pour les calibrages génériques. Override possible via config.meta.tiebreak.
   */
  const DEFAULT_TIEBREAK = ['regulated', 'builder', 'poc-trapped', 'pioneer', 'explorer'];

  // ─────────────────────────────────────────────────────────────────────────
  // DOM bootstrap — Phase 3
  // ─────────────────────────────────────────────────────────────────────────

  function init() {
    // Guard pour environnements de test (sandbox vm sans DOM complet)
    if (typeof document.querySelectorAll !== 'function') return;

    const steps = document.querySelectorAll('aside.qualif-step');
    const recap = document.querySelector('aside#qualif-recap');
    if (steps.length === 0 && !recap) return; // pas de widget sur cette page

    loadQualifConfig().then(function (config) {
      if (!config) return;
      const slug = config.meta.slug;
      const version = config.meta.version || 1;
      const storageKey = 'qualif_' + slug + '_v' + version;
      const tiebreak = (config.meta && config.meta.tiebreak) || DEFAULT_TIEBREAK;

      const state = hydrateState(storageKey);
      const handles = {
        config: config,
        storageKey: storageKey,
        tiebreak: tiebreak,
        state: state
      };

      wireSteps(handles);
      wireRecap(handles);
      renderAll(handles);
    }).catch(function (err) {
      console.error('[qualif]', err);
    });
  }

  function hydrateState(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return {};
      const data = JSON.parse(raw);
      return (data && data.inputs) || {};
    } catch (e) {
      console.warn('[qualif] hydrate failed', e);
      return {};
    }
  }

  function persistState(key, state, dominantId) {
    try {
      localStorage.setItem(key, JSON.stringify({
        inputs: state,
        ts: new Date().toISOString(),
        dominant_profile: dominantId
      }));
    } catch (e) {
      console.warn('[qualif] persist failed', e);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // wireSteps — hydratation DOM + binding events sur mini-blocs
  // ─────────────────────────────────────────────────────────────────────────

  function wireSteps(handles) {
    const config = handles.config;
    const steps = document.querySelectorAll('aside.qualif-step');

    steps.forEach(function (step) {
      const axisId = step.dataset.axis;
      const axis = config.axes.find(function (a) { return a.id === axisId; });
      if (!axis) return;

      // Hydrate : restore les valeurs depuis state vers DOM
      axis.inputs.forEach(function (input) {
        const key = axisId + '.' + input.id;
        const v = handles.state[key];
        if (v === undefined || v === null) return;

        if (input.type === 'slider-anchored') {
          const el = step.querySelector('input[type="range"][name="' + key + '"]');
          if (el) {
            el.value = v;
            updateSliderAriaText(el, input);
          }
        } else if (input.type === 'segmented') {
          const el = step.querySelector('input[type="radio"][name="' + key + '"][value="' + v + '"]');
          if (el) el.checked = true;
        } else if (input.type === 'multi') {
          (Array.isArray(v) ? v : []).forEach(function (opt) {
            const el = step.querySelector('input[type="checkbox"][name="' + key + '"][value="' + opt + '"]');
            if (el) el.checked = true;
          });
          enforceMaxPicks(step, key, input.max_picks);
        }
      });

      // Bind events
      step.addEventListener('input', function (e) { handleStepInput(e, axis, handles); });
      step.addEventListener('change', function (e) { handleStepInput(e, axis, handles); });

      // Update du témoin (witness) initial
      updateStepWitness(step, axis, handles.state);
    });
  }

  function handleStepInput(e, axis, handles) {
    const target = e.target;
    if (!target.name) return;
    const key = target.name;
    const step = target.closest('aside.qualif-step');

    if (target.type === 'range') {
      handles.state[key] = Number(target.value);
      const input = axis.inputs.find(function (i) { return key.endsWith('.' + i.id); });
      if (input) updateSliderAriaText(target, input);
    } else if (target.type === 'radio') {
      handles.state[key] = target.value;
    } else if (target.type === 'checkbox') {
      const all = step.querySelectorAll('input[type="checkbox"][name="' + key + '"]:checked');
      const values = Array.prototype.map.call(all, function (el) { return el.value; });
      handles.state[key] = values;
      const input = axis.inputs.find(function (i) { return key.endsWith('.' + i.id); });
      if (input && input.max_picks) enforceMaxPicks(step, key, input.max_picks);
    }

    if (step) updateStepWitness(step, axis, handles.state);
    renderAll(handles);
  }

  function enforceMaxPicks(scope, name, maxPicks) {
    if (!maxPicks) return;
    const all = scope.querySelectorAll('input[type="checkbox"][name="' + name + '"]');
    const checked = scope.querySelectorAll('input[type="checkbox"][name="' + name + '"]:checked');
    const atCap = checked.length >= maxPicks;
    all.forEach(function (el) {
      if (!el.checked) el.disabled = atCap;
    });
  }

  function updateSliderAriaText(rangeEl, input) {
    const v = Number(rangeEl.value);
    if (!input.levels) return;
    let closest = input.levels[0];
    let bestDelta = Math.abs(v - closest.value);
    for (let i = 1; i < input.levels.length; i++) {
      const d = Math.abs(v - input.levels[i].value);
      if (d < bestDelta) { closest = input.levels[i]; bestDelta = d; }
    }
    rangeEl.setAttribute('aria-valuetext', closest.label);
  }

  function updateStepWitness(step, axis, state) {
    const witness = step.querySelector('.qualif-step__witness');
    const seeRecap = step.querySelector('.qualif-step__see-recap');
    if (!witness) return;

    const total = axis.inputs.length;
    let filled = 0;
    for (let i = 0; i < axis.inputs.length; i++) {
      const input = axis.inputs[i];
      const key = axis.id + '.' + input.id;
      const v = state[key];
      if (v === undefined || v === null) continue;
      if (Array.isArray(v) && v.length === 0) continue;
      if (typeof v === 'string' && v === '') continue;
      filled++;
    }

    if (filled === 0) {
      witness.textContent = '— En attente de saisie';
      if (seeRecap) seeRecap.hidden = true;
    } else if (filled < total) {
      witness.textContent = filled + ' sur ' + total + ' renseignés';
      if (seeRecap) seeRecap.hidden = false;
    } else {
      witness.textContent = '✓ Axe pris en compte';
      if (seeRecap) seeRecap.hidden = false;
    }
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
