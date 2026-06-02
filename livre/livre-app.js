/* livre-app.js — interactions du hub + reader client-side.
   Dépendances : window.LIVRE_DATA (livre-data.js), window.marked (assets/marked.min.js). */

(function () {
  'use strict';

  if (!window.LIVRE_DATA) { console.error('[livre-app] LIVRE_DATA missing'); return; }
  if (!window.marked)    { console.error('[livre-app] marked.js missing'); return; }

  // marked options : GFM tables, no <br> on single \n.
  window.marked.setOptions({ gfm: true, breaks: false, headerIds: false, mangle: false });

  var DATA = window.LIVRE_DATA;
  var REPO_GITHUB = 'https://github.com/MathieuGug/mathieugug.github.io/blob/main/livre/chapitres/';
  var mdCache = Object.create(null);

  // ─────────────────────────────────────────────────────────────────
  // Hub — wire interactive chapter cards (the <g class="chapter-card">)
  // ─────────────────────────────────────────────────────────────────
  function wireChapterCards() {
    var cards = document.querySelectorAll('.infographie .chapter-card');
    cards.forEach(function (card) {
      var ch = card.getAttribute('data-ch');
      var slug = card.getAttribute('data-slug');
      if (!ch || !slug) return;
      card.addEventListener('click', function () { openReader(parseInt(ch, 10)); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openReader(parseInt(ch, 10)); }
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // Zoom overlay (infographies plein écran)
  // ─────────────────────────────────────────────────────────────────
  function setupZoomButtons() {
    document.querySelectorAll('.infographie .zoom-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var svg = btn.closest('.infographie').querySelector('svg');
        if (!svg) return;
        var clone = svg.cloneNode(true);
        // Disable card click-handlers in zoom view (overlay = preview only)
        clone.querySelectorAll('.chapter-card').forEach(function (g) {
          g.removeAttribute('tabindex');
          g.removeAttribute('role');
          g.style.cursor = 'default';
        });
        var overlay = ensureZoomOverlay();
        var stage = overlay.querySelector('.zoom-stage');
        stage.innerHTML = '';
        stage.appendChild(clone);
        overlay.setAttribute('data-open', 'true');
        overlay.querySelector('.zoom-close').focus();
      });
    });
  }
  function ensureZoomOverlay() {
    var existing = document.getElementById('zoom-overlay');
    if (existing) return existing;
    var overlay = document.createElement('div');
    overlay.id = 'zoom-overlay';
    overlay.innerHTML =
      '<div class="zoom-controls">' +
      '  <button class="zoom-close" type="button" aria-label="Fermer">Échap · Fermer</button>' +
      '</div>' +
      '<div class="zoom-stage"></div>';
    document.body.appendChild(overlay);
    overlay.querySelector('.zoom-close').addEventListener('click', closeZoom);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeZoom(); });
    return overlay;
  }
  function closeZoom() {
    var overlay = document.getElementById('zoom-overlay');
    if (overlay) overlay.removeAttribute('data-open');
  }

  // ─────────────────────────────────────────────────────────────────
  // Reader
  // ─────────────────────────────────────────────────────────────────
  var lastFocus = null;

  function openReader(chNum, anchor) {
    var meta = DATA.chapitres[chNum];
    if (!meta) { console.warn('[livre-app] no chapter', chNum); return; }

    lastFocus = document.activeElement;
    var overlay = document.getElementById('reader-overlay');
    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    // Update hash without scroll. Preserve anchor when present.
    var targetHash = '#ch' + pad2(chNum) + (anchor ? '/' + anchor : '');
    if (location.hash !== targetHash) {
      history.pushState({ ch: chNum, anchor: anchor || null }, '', targetHash);
    }

    paintBreadcrumb(chNum, meta);
    paintPrevNext(chNum);
    paintFooter(meta);

    var content = document.getElementById('reader-content');
    content.innerHTML = '<div class="reader-loading">Chargement…</div>';

    fetchChapter(meta.slug).then(function (md) {
      var grid = renderChapter(md, meta);
      content.innerHTML = '';
      content.appendChild(grid);
      // Scroll to top (default) — overridden if an anchor was requested
      overlay.scrollTop = 0;
      // Move focus into the article so keyboard shortcuts work without tabbing
      var firstHeading = grid.querySelector('h1');
      if (firstHeading) firstHeading.setAttribute('tabindex', '-1'), firstHeading.focus({ preventScroll: true });
      // Wire TOC observer to highlight the active section while scrolling
      wireTocObserver(grid, overlay);
      // Deep-link : scroll to a specific anchor (figure or section) if provided
      if (anchor) scrollToAnchor(anchor, overlay);
    }).catch(function (err) {
      console.error('[livre-app] fetch error', err);
      content.innerHTML = '<div class="reader-error">Impossible de charger ' + meta.slug + '.md (' + err.message + ')</div>';
    });
  }

  function closeReader() {
    var overlay = document.getElementById('reader-overlay');
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
    // Strip the hash so we don't reopen on back-button/refresh.
    if (location.hash && /^#ch\d{2}(\/.+)?$/.test(location.hash)) {
      history.pushState({}, '', location.pathname + location.search);
    }
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function fetchChapter(slug) {
    if (mdCache[slug]) return Promise.resolve(mdCache[slug]);
    return fetch('chapitres/' + slug + '.md', { cache: 'default' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then(function (txt) { mdCache[slug] = txt; return txt; });
  }

  // ─────────────────────────────────────────────────────────────────
  // Markdown rendering
  // ─────────────────────────────────────────────────────────────────
  function renderChapter(md, meta) {
    // Normalize line endings : the .md files committed from Windows have CRLF,
    // and JS regex `.` does not match \r — leaving trailing \r on each line
    // breaks `$`-anchored patterns (callouts, footnote defs, …).
    md = md.replace(/\r\n?/g, '\n');
    var body = stripFrontmatter(md);
    body = stripObsidianImageWidth(body);
    body = rewriteInternalChapterLinks(body);
    var fnSection;
    var fnRes = extractFootnotes(body);
    body = fnRes.body;
    fnSection = fnRes.section;

    // Extract callouts first → placeholders
    var calloutExtract = extractCallouts(body);
    body = calloutExtract.body;

    // Convert stabilo ==text== to a placeholder that marked won't touch, then back to <mark>
    body = body.replace(/==([^=\n]+?)==/g, 'MARK$1MARK');

    var html = window.marked.parse(body);
    html = html.replace(/MARK/g, '<mark>').replace(/MARK/g, '</mark>');

    // Reinject callouts
    calloutExtract.placeholders.forEach(function (cb, i) {
      html = html.replace('<p>' + cbToken(i) + '</p>', cb.html);
      // Some callouts may not be wrapped in <p> (rare)
      html = html.replace(cbToken(i), cb.html);
    });

    // Append footnotes section
    if (fnSection) html += fnSection;

    var article = document.createElement('article');
    article.className = 'reader-article';
    article.innerHTML = html;

    // Post-process : wrap tables in scrollable container
    article.querySelectorAll('table').forEach(function (t) {
      if (t.parentElement && t.parentElement.classList && t.parentElement.classList.contains('table-wrap')) return;
      var wrap = document.createElement('div');
      wrap.className = 'table-wrap';
      t.parentNode.insertBefore(wrap, t);
      wrap.appendChild(t);
    });

    // Assign deep-link IDs to images based on their src basename, so the
    // figures index page can land on the exact figure inside the chapter via
    // a `#chNN/fig-<basename>` hash.
    article.querySelectorAll('img').forEach(function (img) {
      var src = img.getAttribute('src') || '';
      var basename = src.split('/').pop().replace(/\.[^.]+$/, '');
      if (!basename) return;
      var anchorId = 'fig-' + basename;
      img.id = anchorId;
      // Lift the ID onto the wrapping <p> too, so scrolling lands cleanly
      // (img inside a paragraph often has padding above from the <p>).
      var parent = img.closest('p, figure');
      if (parent && !parent.id) parent.id = anchorId + '-wrap';
    });

    // Slugify H2/H3 + build mini-TOC sidebar
    var toc = buildToc(article);

    // Wrap article + toc in a grid container
    var grid = document.createElement('div');
    grid.className = 'reader-grid';
    grid.appendChild(article);
    if (toc) grid.appendChild(toc);

    return grid;
  }

  function slugifyHeading(text) {
    return text.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60);
  }

  function buildToc(article) {
    var headings = article.querySelectorAll('h2, h3');
    if (headings.length < 2) return null;
    var aside = document.createElement('aside');
    aside.className = 'reader-toc';
    aside.setAttribute('aria-label', 'Sommaire du chapitre');
    var html = '<div class="toc-label">Dans ce chapitre</div><ol class="toc-list">';
    var seen = Object.create(null);
    headings.forEach(function (h) {
      var text = h.textContent.trim();
      if (!text) return;
      var base = slugifyHeading(text) || 'h';
      var id = base;
      var n = 2;
      while (seen[id]) { id = base + '-' + n; n += 1; }
      seen[id] = true;
      h.id = id;
      var level = h.tagName === 'H2' ? '2' : '3';
      html += '<li class="toc-item toc-level-' + level + '"><a href="#' + id + '">' + escapeHtml(text) + '</a></li>';
    });
    html += '</ol>';
    aside.innerHTML = html;
    // Smooth-scroll handler that targets the overlay scroll container (not the body)
    aside.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var targetId = a.getAttribute('href').slice(1);
      var target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      var overlay = document.getElementById('reader-overlay');
      var top = target.getBoundingClientRect().top - overlay.getBoundingClientRect().top + overlay.scrollTop - 72;
      overlay.scrollTo({ top: top, behavior: 'smooth' });
    });
    return aside;
  }

  function wireTocObserver(grid, overlay) {
    var toc = grid.querySelector('.reader-toc');
    if (!toc) return;
    var links = toc.querySelectorAll('a[href^="#"]');
    if (!links.length) return;
    var byId = Object.create(null);
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      byId[id] = a.parentElement; // .toc-item
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.id;
        var item = byId[id];
        if (!item) return;
        if (entry.isIntersecting) {
          // Clear other active states, set this one
          toc.querySelectorAll('.toc-item.is-active').forEach(function (el) { el.classList.remove('is-active'); });
          item.classList.add('is-active');
        }
      });
    }, { root: overlay, rootMargin: '-80px 0px -60% 0px', threshold: 0 });
    grid.querySelectorAll('h2, h3').forEach(function (h) { if (h.id) observer.observe(h); });
  }

  function stripFrontmatter(md) {
    return md.replace(/^---\r?\n[\s\S]+?\r?\n---\r?\n/, '');
  }

  function stripObsidianImageWidth(md) {
    // ![alt|640](path)  →  ![alt](path)
    return md.replace(/!\[([^\]\n]*?)\|\d+\]/g, '![$1]');
  }

  function rewriteInternalChapterLinks(md) {
    // [text](ch07-...md)  →  [text](#ch07)
    return md.replace(/\]\(((?:\.\.\/)*)(ch(\d{2})-[a-z0-9-]+)\.md(#[^\)]*)?\)/g, function (_, prefix, slug, num, hash) {
      return '](#ch' + num + ')';
    });
  }

  function cbToken(i) { return 'CB' + i + ''; }

  function extractCallouts(md) {
    // Obsidian callout :
    //   > [!TYPE] Optional title
    //   > body line
    //   > body line
    //   (blank line ends the callout)
    var lines = md.split('\n');
    var placeholders = [];
    var out = [];
    var i = 0;
    while (i < lines.length) {
      var line = lines[i];
      var m = /^>\s*\[!([A-Z]+)\]\s*(.*)$/.exec(line);
      if (m) {
        var type = m[1];
        var title = (m[2] || '').trim();
        var bodyLines = [];
        i += 1;
        while (i < lines.length && /^>(?:\s|$)/.test(lines[i])) {
          bodyLines.push(lines[i].replace(/^>\s?/, ''));
          i += 1;
        }
        var bodyMd = bodyLines.join('\n').trim();
        // Stabilo dans le corps du callout
        bodyMd = bodyMd.replace(/==([^=\n]+?)==/g, 'MARK$1MARK');
        var bodyHtml = window.marked.parse(bodyMd);
        bodyHtml = bodyHtml.replace(/MARK/g, '<mark>').replace(/MARK/g, '</mark>');
        var titleHtml = title
          ? '<div class="callout-title">' + type + ' · ' + escapeHtml(title) + '</div>'
          : '<div class="callout-title">' + type + '</div>';
        var html = '<aside class="callout" data-type="' + type + '">' +
                   titleHtml +
                   '<div class="callout-body">' + bodyHtml + '</div>' +
                   '</aside>';
        placeholders.push({ html: html });
        out.push(cbToken(placeholders.length - 1));
        continue;
      }
      out.push(line);
      i += 1;
    }
    return { body: out.join('\n'), placeholders: placeholders };
  }

  function extractFootnotes(md) {
    // Definitions :  [^id]: body
    // References  :  text[^id]
    // IDs can be named (`[^welleck]`) — we renumber them 1..N by order of first
    // appearance in the body, so the rendered ref reads `[1]`, not `welleck`.
    var defs = Object.create(null);
    var defRe = /^\[\^([^\]]+)\]:[ \t]*([^\n]*(?:\n[ \t]+[^\n]*)*)/gm;
    var body = md.replace(defRe, function (_, id, content) {
      defs[id] = content.replace(/\n[ \t]+/g, ' ').trim();
      return '';
    });
    // First pass : assign numbers in order of first ref appearance in body.
    var numbering = Object.create(null);
    var counter = 0;
    body.replace(/\[\^([^\]]+)\]/g, function (_, id) {
      if (numbering[id] === undefined) { counter += 1; numbering[id] = counter; }
      return _;
    });
    // Catch defs that have no ref (rare) so they still show up — append at end.
    Object.keys(defs).forEach(function (id) {
      if (numbering[id] === undefined) { counter += 1; numbering[id] = counter; }
    });
    // Replace references with numbered <sup>[N]</sup>
    body = body.replace(/\[\^([^\]]+)\]/g, function (_, id) {
      var n = numbering[id];
      return '<sup class="fn-ref"><a href="#fn-' + n + '" id="fnref-' + n + '">[' + n + ']</a></sup>';
    });
    if (!counter) return { body: body, section: '' };
    // Render notes section in numerical order
    var ordered = Object.keys(numbering).sort(function (a, b) { return numbering[a] - numbering[b]; });
    var section = '<hr><h4 id="footnotes">Notes</h4><ol class="footnotes">';
    ordered.forEach(function (id) {
      var n = numbering[id];
      var content = defs[id];
      if (!content) return;
      var html = window.marked.parseInline(content);
      section += '<li id="fn-' + n + '"><span class="fn-num">[' + n + ']</span> ' + html +
                 ' <a href="#fnref-' + n + '" class="fn-back" aria-label="Retour à la référence">↩</a></li>';
    });
    section += '</ol>';
    return { body: body, section: section };
  }

  function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  // ─────────────────────────────────────────────────────────────────
  // Breadcrumb / nav
  // ─────────────────────────────────────────────────────────────────
  function paintBreadcrumb(chNum, meta) {
    var acte = DATA.actes.find(function (a) { return a.num === meta.acte; });
    document.querySelector('#reader-overlay .acte-name').textContent =
      'Acte ' + meta.acte + ' · ' + (acte ? acte.titre : '') + ' · Chapitre ' + chNum;
    document.querySelector('#reader-overlay .chap-name').textContent = meta.titre;
  }

  function paintPrevNext(chNum) {
    var prevBtn = document.querySelector('#reader-overlay .reader-prev');
    var nextBtn = document.querySelector('#reader-overlay .reader-next');
    prevBtn.disabled = (chNum <= 1);
    nextBtn.disabled = (chNum >= 25);
    prevBtn.onclick = function () { if (chNum > 1) openReader(chNum - 1); };
    nextBtn.onclick = function () { if (chNum < 25) openReader(chNum + 1); };
  }

  function paintFooter(meta) {
    var a = document.querySelector('#reader-overlay .reader-github-link');
    a.href = REPO_GITHUB + meta.slug + '.md';
    document.querySelector('#reader-overlay .reader-words').textContent = '~' + meta.mots.toLocaleString('fr-FR') + ' mots';
  }

  // ─────────────────────────────────────────────────────────────────
  // Routing + keyboard
  // ─────────────────────────────────────────────────────────────────
  function handleHash() {
    // Accept #chNN or #chNN/<anchor>. The anchor is opaque to the router —
    // anything after the `/` is passed through to openReader as-is.
    var m = /^#ch(\d{2})(?:\/(.+))?$/.exec(location.hash);
    if (m) {
      var n = parseInt(m[1], 10);
      var anchor = m[2] ? decodeURIComponent(m[2]) : null;
      if (n >= 1 && n <= 25) { openReader(n, anchor); return; }
    }
    // No hash or invalid → ensure reader closed
    var overlay = document.getElementById('reader-overlay');
    if (overlay && !overlay.hasAttribute('hidden')) closeReader();
  }

  function scrollToAnchor(anchor, overlay) {
    // Try the anchor as-is, then the wrap variant (used for images/figures).
    var target = document.getElementById(anchor) || document.getElementById(anchor + '-wrap');
    if (!target) return;
    // Wait one frame so layout has settled after the article was injected.
    requestAnimationFrame(function () {
      var top = target.getBoundingClientRect().top - overlay.getBoundingClientRect().top + overlay.scrollTop - 72;
      overlay.scrollTo({ top: top, behavior: 'auto' });
      // Brief highlight ring so the user spots the target
      target.classList.add('fig-deeplinked');
      setTimeout(function () { target.classList.remove('fig-deeplinked'); }, 2200);
    });
  }

  function bindKeyboard() {
    document.addEventListener('keydown', function (e) {
      var overlay = document.getElementById('reader-overlay');
      var zoom = document.getElementById('zoom-overlay');
      if (zoom && zoom.getAttribute('data-open') === 'true') {
        if (e.key === 'Escape') { e.preventDefault(); closeZoom(); }
        return;
      }
      if (overlay && !overlay.hasAttribute('hidden')) {
        if (e.key === 'Escape') { e.preventDefault(); closeReader(); }
        else if (e.key === 'ArrowLeft') {
          var prev = overlay.querySelector('.reader-prev'); if (prev && !prev.disabled) { e.preventDefault(); prev.click(); }
        } else if (e.key === 'ArrowRight') {
          var next = overlay.querySelector('.reader-next'); if (next && !next.disabled) { e.preventDefault(); next.click(); }
        }
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // Boot
  // ─────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    wireChapterCards();
    setupZoomButtons();
    bindKeyboard();
    document.querySelector('#reader-overlay .reader-close').addEventListener('click', closeReader);
    window.addEventListener('popstate', handleHash);
    handleHash();
  });
})();
