/* livre-figures.js — page "Toutes les figures" : grid + filtres + zoom + deep-link.
   Dépend de window.LIVRE_DATA (livre-data.js) et de livre/figures.json fetché à l'init. */

(function () {
  'use strict';

  var FIGURES_PATH = 'figures.json';
  // scope.kind : 'all' | 'acte' (scope.acte = "I".."IV") | 'chapter' (scope.chapter = "7")
  var state = { all: [], scope: { kind: 'all' }, query: '' };

  function init() {
    fetch(FIGURES_PATH, { cache: 'default' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (data) {
        state.all = data;
        document.getElementById('fig-count').textContent = data.length;
        renderChips();
        render();
        wireSearch();
        wireZoom();
      })
      .catch(function (err) {
        document.getElementById('figures-grid').innerHTML =
          '<div class="figures-error">Erreur de chargement (' + err.message + ').</div>';
      });
  }

  function renderChips() {
    var chips = document.getElementById('figures-chips');
    var perChapter = Object.create(null);
    state.all.forEach(function (f) { perChapter[f.chapter] = (perChapter[f.chapter] || 0) + 1; });
    var DATA = window.LIVRE_DATA;
    var html = '<div class="chips-row chips-row-all">' +
               '  <button type="button" class="chip chip-chap" role="radio" aria-checked="true" data-chapter="all">' +
               '    Tous · ' + state.all.length +
               '  </button>' +
               '</div>';
    DATA.actes.forEach(function (acte) {
      var acteCount = 0;
      acte.chapitres.forEach(function (n) { acteCount += perChapter[n] || 0; });
      if (!acteCount) return;
      html += '<div class="chips-row" data-acte="' + acte.num + '">';
      html += '  <button type="button" class="chip chip-acte" role="radio" aria-checked="false" data-acte="' + acte.num + '"' +
              ' title="' + escapeAttr(acte.titre) + '" aria-label="Acte ' + acte.num + ' — ' + escapeAttr(acte.titre) + ' (' + acteCount + ' figures)">' +
              'Acte ' + acte.num + ' · ' + acteCount +
              '</button>';
      acte.chapitres.forEach(function (n) {
        if (!perChapter[n]) return;
        var chMeta = DATA.chapitres[n];
        var title = chMeta ? escapeAttr(chMeta.titre) : '';
        html += '  <button type="button" class="chip chip-chap" role="radio" aria-checked="false" data-chapter="' + n + '"' +
                ' title="' + title + '" aria-label="Chapitre ' + n + ' — ' + title + ' (' + perChapter[n] + ' figures)">' +
                'Ch. ' + n + ' · ' + perChapter[n] +
                '</button>';
      });
      html += '</div>';
    });
    chips.innerHTML = html;
    chips.addEventListener('click', function (e) {
      var btn = e.target.closest('button.chip');
      if (!btn) return;
      chips.querySelectorAll('.chip').forEach(function (b) { b.setAttribute('aria-checked', 'false'); });
      btn.setAttribute('aria-checked', 'true');
      if (btn.dataset.acte) {
        state.scope = { kind: 'acte', acte: btn.dataset.acte };
      } else if (btn.dataset.chapter === 'all') {
        state.scope = { kind: 'all' };
      } else {
        state.scope = { kind: 'chapter', chapter: btn.dataset.chapter };
      }
      render();
    });
  }

  function wireSearch() {
    var input = document.getElementById('figures-search-input');
    var deb;
    input.addEventListener('input', function () {
      clearTimeout(deb);
      deb = setTimeout(function () {
        state.query = input.value.trim().toLowerCase();
        render();
      }, 120);
    });
  }

  function filtered() {
    var q = state.query;
    var scope = state.scope;
    var acteChapters = null;
    if (scope.kind === 'acte') {
      var DATA = window.LIVRE_DATA;
      var acteMeta = DATA.actes.filter(function (a) { return String(a.num) === scope.acte; })[0];
      acteChapters = Object.create(null);
      if (acteMeta) acteMeta.chapitres.forEach(function (n) { acteChapters[n] = true; });
    }
    return state.all.filter(function (f) {
      if (scope.kind === 'chapter' && String(f.chapter) !== scope.chapter) return false;
      if (scope.kind === 'acte' && !acteChapters[f.chapter]) return false;
      if (!q) return true;
      var hay = (f.alt + ' ' + f.chapter_title + ' ' + f.section_title + ' ' + f.basename).toLowerCase();
      return hay.indexOf(q) !== -1;
    });
  }

  function render() {
    var grid = document.getElementById('figures-grid');
    var list = filtered();
    if (!list.length) {
      grid.innerHTML = '<div class="figures-empty">Aucune figure ne correspond.</div>';
      return;
    }
    var DATA = window.LIVRE_DATA;
    // Group under acte dividers for the "all" and "acte" scopes (an acte scope
    // naturally renders a single divider, since only its chapters match).
    var groupByActe = (state.scope.kind !== 'chapter');
    var html = '';

    if (groupByActe) {
      // Iterate actes in canonical order; under each, render its figures.
      DATA.actes.forEach(function (acte) {
        var chSet = Object.create(null);
        acte.chapitres.forEach(function (n) { chSet[n] = true; });
        var figs = list.filter(function (f) { return chSet[f.chapter]; });
        if (!figs.length) return;
        html += '<header class="acte-divider" data-acte="' + acte.num + '">' +
                '  <span class="acte-divider-tag">Acte ' + acte.num + '</span>' +
                '  <h2 class="acte-divider-title">' + escapeHtml(acte.titre) + '</h2>' +
                '  <span class="acte-divider-count">' + figs.length + ' figures</span>' +
                '</header>';
        html += '<div class="acte-figures-grid">';
        figs.forEach(function (f, idx) { html += cardHtml(f, idx); });
        html += '</div>';
      });
    } else {
      // Single-chapter filter or search : flat grid.
      html += '<div class="acte-figures-grid">';
      list.forEach(function (f, idx) { html += cardHtml(f, idx); });
      html += '</div>';
    }
    grid.innerHTML = html;
  }

  function cardHtml(f, idx) {
    var imgPath = '../' + f.src;
    var deepLink = 'index.html#ch' + pad2(f.chapter) + '/fig-' + encodeURIComponent(f.basename);
    var label = escapeHtml(f.alt || f.basename);
    var section = f.section_title ? escapeHtml(f.section_title) : '';
    var chapTitle = escapeHtml(f.chapter_title || '');
    return (
      '<article class="fig-card" data-i="' + idx + '">' +
      '  <a class="fig-thumb" href="' + escapeAttr(deepLink) + '" data-zoom="' + escapeAttr(imgPath) +
      '" data-alt="' + escapeAttr(label) + '" aria-label="Zoomer : ' + escapeAttr(label) + '">' +
      '    <img src="' + escapeAttr(imgPath) + '" alt="' + escapeAttr(label) + '" loading="lazy" />' +
      '  </a>' +
      '  <div class="fig-meta">' +
      '    <div class="fig-eyebrow" title="' + escapeAttr(f.chapter_title || '') + '">Ch. ' + f.chapter + ' · ' + chapTitle + '</div>' +
      '    <div class="fig-alt">' + label + '</div>' +
      '    <div class="fig-section">' + section + '</div>' +
      '    <div class="fig-actions">' +
      '      <button type="button" class="fig-btn fig-btn-zoom" data-zoom="' + escapeAttr(imgPath) +
      '" data-alt="' + escapeAttr(label) + '">⛶ Zoomer</button>' +
      '      <a class="fig-btn fig-btn-jump" href="' + escapeAttr(deepLink) + '">↗ Aller au passage</a>' +
      '    </div>' +
      '  </div>' +
      '</article>'
    );
  }

  // ─── Zoom overlay (clic thumb ou bouton Zoomer) ───
  function wireZoom() {
    var overlay = document.getElementById('zoom-overlay');
    var stage = overlay.querySelector('.zoom-stage');
    var closeBtn = overlay.querySelector('.zoom-close');

    function open(src, alt) {
      stage.innerHTML = '<img src="' + escapeAttr(src) + '" alt="' + escapeAttr(alt) + '" />';
      overlay.setAttribute('data-open', 'true');
      closeBtn.focus();
    }
    function close() { overlay.removeAttribute('data-open'); stage.innerHTML = ''; }

    document.getElementById('figures-grid').addEventListener('click', function (e) {
      var thumb = e.target.closest('a.fig-thumb');
      if (thumb) {
        // Block deep-link navigation : a thumbnail click means "zoom".
        e.preventDefault();
        open(thumb.getAttribute('data-zoom'), thumb.getAttribute('data-alt'));
        return;
      }
      var btn = e.target.closest('button.fig-btn-zoom');
      if (btn) {
        open(btn.getAttribute('data-zoom'), btn.getAttribute('data-alt'));
      }
    });

    closeBtn.addEventListener('click', close);
    // Click anywhere outside the image (and outside the close button) closes.
    overlay.addEventListener('click', function (e) {
      if (e.target.tagName === 'IMG') return;        // image itself — don't close
      if (e.target.closest('.zoom-close')) return;   // close button handled above
      close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.getAttribute('data-open') === 'true') {
        e.preventDefault();
        close();
      }
    });
  }

  // ─── Helpers ───
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }
  function escapeHtml(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function escapeAttr(s) { return escapeHtml(s).replace(/"/g, '&quot;'); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
