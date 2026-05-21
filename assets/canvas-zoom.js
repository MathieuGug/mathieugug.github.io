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
    canvas.setAttribute('data-level', String(level));
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
  function openZone(node) {
    const vb = bboxFromTarget(node);
    if (!vb) return;
    setLevelState(1, node);
    animateViewBox(vb);
    history.pushState({ level: 1, node: node }, '', '#zone-' + node);
  }

  function openLeaf(node) {
    const vb = leafViewBox(node);
    if (!vb) return;
    setLevelState(2, node);
    animateViewBox(vb);
    history.pushState({ level: 2, node: node }, '', '#' + node);
  }

  function reset() {
    setLevelState(0, null);
    animateViewBox(rootViewBox);
    history.pushState({ level: 0 }, '', location.pathname + location.search);
  }
  function setupClickHandlers() {
    canvas.addEventListener('click', function (e) {
      // Click on a step/cheese box (data-card) in central playbook
      // → résoudre via findLeafForCard puis ouvrir la leaf qui le couvre
      const card = e.target.closest('[data-card]');
      if (card && state.level === 0) {
        const leaf = findLeafForCard(card.dataset.card);
        if (leaf) {
          openZone(leaf.dataset.node);
          e.preventDefault();
        }
        return;
      }

      // Click on the focused leaf to drill down to level 2
      const leafG = e.target.closest('.zoom-target');
      if (leafG && state.level === 1 && leafG.dataset.node === state.node) {
        openLeaf(state.node);
        e.preventDefault();
        return;
      }

      // Click on canvas background → go up one level
      const bg = e.target.closest('[data-canvas-background]');
      if (bg) {
        if (state.level === 2) openZone(state.node);
        else if (state.level === 1) reset();
      }
    });
  }
  function setupKeyboardHandlers() {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (state.level === 2) {
          openZone(state.node);
          e.preventDefault();
        } else if (state.level === 1) {
          reset();
          e.preventDefault();
        }
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        if (state.level === 0) return;
        const order = targets.map(function (t) { return t.dataset.node; });
        const idx = order.indexOf(state.node);
        if (idx === -1) return;
        const step = e.key === 'ArrowRight' ? 1 : -1;
        const nextIdx = (idx + step + order.length) % order.length;
        const nextNode = order[nextIdx];
        if (state.level === 1) openZone(nextNode);
        else if (state.level === 2) openLeaf(nextNode);
        e.preventDefault();
      }
    });
  }
  function setupResetButton() {
    const btn = document.querySelector('[data-canvas-zoom-reset]');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      reset();
    });

    // Show/hide reset button based on current level
    function syncButtonVisibility() {
      btn.hidden = state.level === 0;
    }
    syncButtonVisibility();
    // Re-sync after each transition
    new MutationObserver(syncButtonVisibility).observe(
      canvas.querySelector('#playbook-center') || canvas,
      { attributes: true, attributeFilter: ['data-state'] }
    );
  }

  function setupMobileInterstitial() {
    const interstitial = document.querySelector('[data-mobile-interstitial]');
    if (!interstitial) return;

    const mq = window.matchMedia('(max-width: 768px)');

    function update() {
      // Only re-show interstitial if it was never dismissed by user
      if (interstitial.dataset.dismissed === 'true') return;
      interstitial.hidden = !mq.matches;
    }

    update();

    if (mq.addEventListener) mq.addEventListener('change', update);
    else mq.addListener(update); // Safari fallback

    const dismiss = interstitial.querySelector('[data-dismiss]');
    if (dismiss) {
      dismiss.addEventListener('click', function () {
        interstitial.hidden = true;
        interstitial.dataset.dismissed = 'true';
      });
    }
  }
  function handlePopState(e) {
    const s = e.state || { level: 0 };
    if (s.level === 0) {
      setLevelState(0, null);
      animateViewBox(rootViewBox);
    } else if (s.level === 1) {
      const vb = bboxFromTarget(s.node);
      if (vb) {
        setLevelState(1, s.node);
        animateViewBox(vb);
      }
    } else if (s.level === 2) {
      const vb = leafViewBox(s.node);
      if (vb) {
        setLevelState(2, s.node);
        animateViewBox(vb);
      }
    }
  }

  function restoreFromHash(hash) {
    if (!hash) return;
    if (hash.indexOf('zone-') === 0) {
      const node = hash.slice(5);
      const vb = bboxFromTarget(node);
      if (vb) {
        setLevelState(1, node);
        canvas.setAttribute('viewBox', viewBoxString(vb));
      }
      return;
    }
    // Try direct leaf id first
    let vb = leafViewBox(hash);
    let node = hash;
    if (!vb) {
      // Backward-compat : #step-3 → resolve to its parent leaf (L2)
      const leaf = findLeafForCard(hash);
      if (leaf) {
        vb = leafViewBox(leaf.dataset.node);
        node = leaf.dataset.node;
      }
    }
    if (vb) {
      setLevelState(2, node);
      canvas.setAttribute('viewBox', viewBoxString(vb));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
