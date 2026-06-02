/* livre-figures.js — page "Toutes les figures" : grid + filtres + zoom + deep-link.
   Dépend de window.LIVRE_DATA (livre-data.js) et de livre/figures.json fetché à l'init. */

(function () {
  'use strict';

  var FIGURES_PATH = 'figures.json';
  var state = { all: [], chapter: 'all', query: '' };

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
    var html = '<button type="button" class="chip chip-chap" role="radio" aria-checked="true" data-chapter="all">' +
               'Tous · ' + state.all.length + '</button>';
    for (var i = 1; i <= 25; i++) {
      if (!perChapter[i]) continue;
      html += '<button type="button" class="chip chip-chap" role="radio" aria-checked="false" data-chapter="' + i +
              '">Ch. ' + i + ' · ' + perChapter[i] + '</button>';
    }
    chips.innerHTML = html;
    chips.addEventListener('click', function (e) {
      var btn = e.target.closest('button.chip-chap');
      if (!btn) return;
      chips.querySelectorAll('.chip-chap').forEach(function (b) { b.setAttribute('aria-checked', 'false'); });
      btn.setAttribute('aria-checked', 'true');
      state.chapter = btn.dataset.chapter;
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
    var chap = state.chapter;
    return state.all.filter(function (f) {
      if (chap !== 'all' && String(f.chapter) !== chap) return false;
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
    var html = '';
    list.forEach(function (f, idx) {
      var imgPath = '../' + f.src;
      var deepLink = 'index.html#ch' + pad2(f.chapter) + '/fig-' + encodeURIComponent(f.basename);
      var label = escapeHtml(f.alt || f.basename);
      var section = f.section_title ? escapeHtml(f.section_title) : '';
      var chapTitle = escapeHtml(f.chapter_title || '');
      html +=
        '<article class="fig-card" data-i="' + idx + '">' +
        '  <a class="fig-thumb" href="' + escapeAttr(deepLink) + '" data-zoom="' + escapeAttr(imgPath) +
        '" data-alt="' + escapeAttr(label) + '" aria-label="Zoomer : ' + escapeAttr(label) + '">' +
        '    <img src="' + escapeAttr(imgPath) + '" alt="' + escapeAttr(label) + '" loading="lazy" />' +
        '  </a>' +
        '  <div class="fig-meta">' +
        '    <div class="fig-eyebrow">Ch. ' + f.chapter + ' · ' + chapTitle + '</div>' +
        '    <div class="fig-alt">' + label + '</div>' +
        '    <div class="fig-section">' + section + '</div>' +
        '    <div class="fig-actions">' +
        '      <button type="button" class="fig-btn fig-btn-zoom" data-zoom="' + escapeAttr(imgPath) +
        '" data-alt="' + escapeAttr(label) + '">⛶ Zoomer</button>' +
        '      <a class="fig-btn fig-btn-jump" href="' + escapeAttr(deepLink) + '">↗ Aller au passage</a>' +
        '    </div>' +
        '  </div>' +
        '</article>';
    });
    grid.innerHTML = html;
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
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
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
