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
      wireQualifNav(handles);
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

  /**
   * Helper pur : compte les inputs renseignés d'un axe.
   * Retourne { filled: number, total: number, isComplete: boolean }.
   * Réutilisé par updateStepWitness (mini-bloc inline) et updateNavState (sidebar).
   */
  function axisCompletion(axis, state) {
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
    return { filled: filled, total: total, isComplete: filled === total };
  }

  function updateStepWitness(step, axis, state) {
    const witness = step.querySelector('.qualif-step__witness');
    const seeRecap = step.querySelector('.qualif-step__see-recap');
    if (!witness) return;

    const { filled, total, isComplete } = axisCompletion(axis, state);

    if (filled === 0) {
      witness.textContent = '— En attente de saisie';
      if (seeRecap) seeRecap.hidden = true;
    } else if (!isComplete) {
      witness.textContent = filled + ' sur ' + total + ' renseignés';
      if (seeRecap) seeRecap.hidden = false;
    } else {
      witness.textContent = '✓ Axe pris en compte';
      if (seeRecap) seeRecap.hidden = false;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // wireRecap + renderAll — radar SVG, verdict, recos, print, reset
  // ─────────────────────────────────────────────────────────────────────────

  function wireRecap(handles) {
    const recap = document.querySelector('aside#qualif-recap');
    if (!recap) return;

    const printBtn = recap.querySelector('button[data-action="print"]');
    const resetBtn = recap.querySelector('button[data-action="reset"]');

    if (printBtn) {
      printBtn.addEventListener('click', function () { window.print(); });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (!window.confirm('Réinitialiser votre profil ?')) return;
        localStorage.removeItem(handles.storageKey);
        for (const k of Object.keys(handles.state)) delete handles.state[k];
        // Reset DOM inputs visuellement
        document.querySelectorAll('aside.qualif-step input').forEach(function (el) {
          if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
          if (el.type === 'range') {
            const def = el.getAttribute('value');
            el.value = (def !== null) ? def : Math.round((Number(el.min || 0) + Number(el.max || 100)) / 2);
            // Re-aligner aria-valuetext avec la valeur reset (sinon SR annonce le palier pré-reset)
            const stepEl = el.closest('aside.qualif-step');
            if (stepEl) {
              const axisId = stepEl.dataset.axis;
              const axis = handles.config.axes.find(function (a) { return a.id === axisId; });
              const inputDef = axis && axis.inputs.find(function (i) { return el.name.endsWith('.' + i.id); });
              if (inputDef) updateSliderAriaText(el, inputDef);
            }
          }
          if (el.disabled) el.disabled = false;
        });
        document.querySelectorAll('aside.qualif-step').forEach(function (step) {
          const axisId = step.dataset.axis;
          const axis = handles.config.axes.find(function (a) { return a.id === axisId; });
          if (axis) updateStepWitness(step, axis, handles.state);
        });
        renderAll(handles);
      });
    }
  }

  function wireQualifNav(handles) {
    const nav = document.querySelector('aside#qualif-nav');
    if (!nav) return;

    // Topbar toggle button (mobile)
    const toggleBtn = document.querySelector('#toggle-qualif');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        nav.classList.toggle('open');
        document.body.classList.toggle('has-panel-open', nav.classList.contains('open'));
      });
    }

    // Panel close button
    const closeBtn = nav.querySelector('.panel-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        nav.classList.remove('open');
        document.body.classList.remove('has-panel-open');
      });
    }

    // ESC closes the drawer (mobile)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        document.body.classList.remove('has-panel-open');
      }
    });

    // Click on any axis link → close drawer (mobile) then native scroll
    nav.querySelectorAll('a[href^="#qualif-step-"]').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        document.body.classList.remove('has-panel-open');
      });
    });
    // Same for "Voir mon profil ↓"
    const seeRecap = nav.querySelector('a[href="#qualif-recap"]');
    if (seeRecap) {
      seeRecap.addEventListener('click', function () {
        nav.classList.remove('open');
        document.body.classList.remove('has-panel-open');
      });
    }
  }

  function updateNavState(handles) {
    const nav = document.querySelector('aside#qualif-nav');
    if (!nav) return;

    handles.config.axes.forEach(function (axis) {
      const li = nav.querySelector('li[data-axis="' + axis.id + '"]');
      if (!li) return;
      const stateEl = li.querySelector('[data-bind="state"]');
      const { filled, total, isComplete } = axisCompletion(axis, handles.state);

      li.classList.remove('is-empty', 'is-partial', 'is-complete');
      if (filled === 0) {
        li.classList.add('is-empty');
        if (stateEl) stateEl.textContent = '0 / ' + total;
      } else if (isComplete) {
        li.classList.add('is-complete');
        if (stateEl) stateEl.textContent = '✓';
      } else {
        li.classList.add('is-partial');
        if (stateEl) stateEl.textContent = filled + ' / ' + total;
      }
    });
  }

  function renderAll(handles) {
    const config = handles.config;
    const state = handles.state;

    // 1. Vecteur 6 axes
    const vec = config.axes.map(function (axis) {
      return Q.computeAxisScore(axis, state);
    });

    // 2. Axes renseignés
    const filledCount = vec.filter(function (v) { return v !== null; }).length;

    // 3. Profil dominant (normalisation neutre 50 pour partiel)
    const profile = Q.dominantProfile(vec, config.profiles, handles.tiebreak);

    // 4. Recos d'ajustement — cap=2 explicite (cf. JSDoc applyAdjustments)
    const adjRecos = Q.applyAdjustments(state, config.adjustments || [], 2);

    // 5. Persist
    persistState(handles.storageKey, state, profile ? profile.id : null);

    // 6. Render UI
    renderRecapUI(config, vec, filledCount, profile, adjRecos);
    updateNavState(handles);
  }

  function renderRecapUI(config, vec, filledCount, profile, adjRecos) {
    const recap = document.querySelector('aside#qualif-recap');
    if (!recap) return;
    // Note : profile peut être null si config.profiles est vide. On rend quand même
    // l'état vide (verdict gris, figcaption prompt, boutons disabled) — la garde
    // précédente sur !profile masquait silencieusement une misconfig JSON.

    // a) label profil
    const labelEl = recap.querySelector('[data-bind="profile-label"]');
    if (labelEl) labelEl.textContent = (filledCount > 0 && profile) ? profile.label : '—';

    // b) verdict
    const verdictEl = recap.querySelector('[data-bind="verdict"]');
    if (verdictEl) {
      if (filledCount === 0) {
        verdictEl.textContent = 'Aucun axe renseigné. Complétez les blocs ci-dessus pour faire apparaître votre profil.';
        verdictEl.classList.add('is-empty');
      } else if (profile) {
        verdictEl.textContent = profile.verdict;
        verdictEl.classList.remove('is-empty');
      } else {
        verdictEl.textContent = 'Aucun profil défini dans le sidecar JSON.';
        verdictEl.classList.add('is-empty');
      }
    }

    // c) recos
    const recosEl = recap.querySelector('[data-bind="recos"]');
    if (recosEl) {
      recosEl.innerHTML = '';
      if (filledCount > 0 && profile) {
        (profile.recos || []).forEach(function (r) {
          const li = document.createElement('li');
          li.textContent = r;
          recosEl.appendChild(li);
        });
        adjRecos.forEach(function (r) {
          const li = document.createElement('li');
          li.className = 'reco-adjustment';
          li.textContent = '↪ ' + r;
          recosEl.appendChild(li);
        });
      }
    }

    // d) meta : timestamp + completeness
    const tsEl = recap.querySelector('[data-bind="ts"]');
    if (tsEl) {
      const now = new Date();
      tsEl.dateTime = now.toISOString();
      tsEl.textContent = formatDateFr(now);
    }
    const compEl = recap.querySelector('[data-bind="completeness"]');
    if (compEl) compEl.textContent = filledCount + ' sur ' + config.axes.length + ' axes renseignés';

    // e) radar SVG
    drawRadar(recap, vec, profile);

    // f) figcaption
    const figcap = recap.querySelector('[data-bind="radar-caption"]');
    if (figcap) {
      figcap.textContent = (filledCount === 0 || !profile)
        ? 'Complétez les blocs pour voir votre radar.'
        : 'Profil ' + profile.label + ' — vous êtes le plus proche de ce profil cible sur les axes renseignés.';
    }

    // g) radar desc (a11y)
    const desc = recap.querySelector('[data-bind="radar-desc"]');
    if (desc) {
      const axisLabels = config.axes.map(function (a) { return a.label; });
      const parts = vec.map(function (v, i) {
        return axisLabels[i] + ' ' + (v === null ? 'non renseigné' : v);
      });
      if (profile) {
        desc.textContent = 'Vous êtes sur le profil ' + profile.label + '. Scores : ' + parts.join(', ') + '.';
      } else {
        desc.textContent = 'Pas de profil disponible.';
      }
    }

    // h) état des boutons
    const printBtn = recap.querySelector('button[data-action="print"]');
    const resetBtn = recap.querySelector('button[data-action="reset"]');
    if (printBtn) printBtn.disabled = (filledCount === 0);
    if (resetBtn) resetBtn.disabled = (filledCount === 0);
  }

  function drawRadar(recap, vec, profile) {
    const svg = recap.querySelector('figure.qualif-recap__radar svg');
    if (!svg) return;
    const geom = { cx: 160, cy: 160, radius: 120 };

    const userPath = svg.querySelector('path[data-bind="user-polygon"]');
    if (userPath) {
      userPath.setAttribute('d', Q.renderRadarPath(vec, geom));
    }
    const profilePath = svg.querySelector('path[data-bind="profile-polygon"]');
    if (profilePath && profile) {
      profilePath.setAttribute('d', Q.renderRadarPath(profile.anchor, geom));
    }
  }

  function formatDateFr(d) {
    const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear()
      + ' · ' + String(d.getHours()).padStart(2, '0') + 'h' + String(d.getMinutes()).padStart(2, '0');
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
