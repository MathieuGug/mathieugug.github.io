/* dossier-app — shared runtime for dossier 2026*-app.html pages
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
    const modalRoot    = document.getElementById('modal-root');
    if (!modalRoot) return;
    const modalEyebrow = document.getElementById('modal-eyebrow');
    const modalTitle   = document.getElementById('modal-title');
    const modalBody    = document.getElementById('modal-body');
    let lastFocused = null;

    function openModal(eyebrow, title, body) {
      lastFocused = document.activeElement;
      if (modalEyebrow) modalEyebrow.textContent = eyebrow || '';
      if (modalTitle)   modalTitle.textContent   = title || '';
      if (modalBody)    modalBody.innerHTML      = body || '';
      modalRoot.hidden = false;
      document.body.style.overflow = 'hidden';
      modalRoot.querySelector('.modal-close')?.focus();
    }
    function closeModal() {
      modalRoot.hidden = true;
      document.body.style.overflow = '';
      lastFocused?.focus();
    }

    document.addEventListener('click', (e) => {
      const region = e.target.closest('.interactive[data-card]');
      if (region) {
        const svg = region.closest('svg[data-schema-id]');
        const schemaId = svg?.dataset.schemaId;
        const cardId   = region.dataset.card;
        const card     = window.SCHEMAS?.[schemaId]?.[cardId];
        if (card) {
          openModal(card.eyebrow || '', card.title || '', card.body || '');
          return;
        }
      }
      if (e.target.matches('[data-close]')) {
        closeModal();
        return;
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modalRoot.hidden) { closeModal(); return; }
      if ((e.key === 'Enter' || e.key === ' ') && document.activeElement?.matches('.interactive[data-card]')) {
        e.preventDefault();
        document.activeElement.click();
      }
    });
  }

  // ──────────────────────────────────────────────────────────
  // Citations → highlight source in sidebar
  // ──────────────────────────────────────────────────────────

  function setupCitations() {
    document.addEventListener('click', (e) => {
      const cite = e.target.closest('.cite[data-cite]');
      if (!cite) return;
      e.preventDefault();
      const n = cite.dataset.cite;
      const li = document.getElementById('source-' + n);
      if (!li) return;
      const sources = document.getElementById('sources');
      if (window.innerWidth <= 1024 && sources) sources.classList.add('open');
      const layout = document.querySelector('.layout');
      const wasCollapsed = layout?.classList.contains('sources-collapsed');
      if (wasCollapsed) {
        document.getElementById('sources-expand-btn')?.click();
      }
      const doScroll = () => {
        li.scrollIntoView({ behavior: 'smooth', block: 'center' });
        li.classList.add('highlight');
        clearTimeout(li._hl);
        li._hl = setTimeout(() => li.classList.remove('highlight'), 2400);
      };
      if (wasCollapsed) setTimeout(doScroll, 320); else doScroll();
    });
  }

  // ──────────────────────────────────────────────────────────
  // Tooltips: pin on touch / click for mobile
  // ──────────────────────────────────────────────────────────

  function setupTooltips() {
    document.querySelectorAll('.term').forEach(t => {
      if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '0');
      t.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.term.pinned').forEach(p => { if (p !== t) p.classList.remove('pinned'); });
        t.classList.toggle('pinned');
      });
    });
    document.addEventListener('click', () => {
      document.querySelectorAll('.term.pinned').forEach(p => p.classList.remove('pinned'));
    });
  }

  // ──────────────────────────────────────────────────────────
  // TOC active section + smooth scroll
  // ──────────────────────────────────────────────────────────

  function setupTocObserver() {
    const tocLinks = document.querySelectorAll('#toc a[href^="#"]');
    tocLinks.forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          document.getElementById('toc')?.classList.remove('open');
        }
      });
    });
    if ('IntersectionObserver' in window) {
      const sections = Array.from(document.querySelectorAll('main h2[id], main h1[id]'));
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            tocLinks.forEach(a => a.classList.remove('active'));
            const link = document.querySelector('#toc a[href="#' + entry.target.id + '"]');
            link?.classList.add('active');
          }
        });
      }, { rootMargin: '-30% 0px -60% 0px' });
      sections.forEach(s => observer.observe(s));
    }
  }

  // ──────────────────────────────────────────────────────────
  // Mobile panels (TOC + Sources)
  // ──────────────────────────────────────────────────────────

  function setupMobilePanels() {
    document.getElementById('toggle-toc')?.addEventListener('click', () => {
      document.getElementById('sources')?.classList.remove('open');
      document.getElementById('toc')?.classList.toggle('open');
    });
    document.getElementById('toggle-sources')?.addEventListener('click', () => {
      document.getElementById('toc')?.classList.remove('open');
      document.getElementById('sources')?.classList.toggle('open');
    });
    document.querySelectorAll('.panel-close').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('#toc, #sources')?.classList.remove('open');
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const zoom  = document.getElementById('zoom-overlay');
      const modal = document.getElementById('modal-root');
      if (zoom  && !zoom.hidden)  return;
      if (modal && !modal.hidden) return;
      const open = document.querySelector('#toc.open, #sources.open');
      if (open) { e.preventDefault(); open.classList.remove('open'); }
    });
  }

  // ──────────────────────────────────────────────────────────
  // Sources sidebar — desktop collapse/expand
  // ──────────────────────────────────────────────────────────

  function setupSourcesToggle() {
    const layout      = document.querySelector('.layout');
    const collapseBtn = document.getElementById('sources-collapse-btn');
    const expandBtn   = document.getElementById('sources-expand-btn');
    if (!layout || !collapseBtn || !expandBtn) return;

    function setCollapsed(collapsed) {
      layout.classList.toggle('sources-collapsed', collapsed);
      expandBtn.hidden = !collapsed;
      collapseBtn.setAttribute('aria-expanded', String(!collapsed));
      expandBtn.setAttribute('aria-expanded', String(!collapsed));
      try { localStorage.setItem('dossier-sources-collapsed', collapsed ? '1' : '0'); } catch (_) {}
    }

    collapseBtn.addEventListener('click', () => setCollapsed(true));
    expandBtn.addEventListener('click', () => {
      setCollapsed(false);
      requestAnimationFrame(() => collapseBtn.focus({ preventScroll: true }));
    });

    try {
      if (localStorage.getItem('dossier-sources-collapsed') === '1') setCollapsed(true);
    } catch (_) {}
  }

  // ──────────────────────────────────────────────────────────
  // Fullscreen zoom for schemas
  // ──────────────────────────────────────────────────────────

  function setupZoom() {
    const overlay  = document.getElementById('zoom-overlay');
    const stage    = document.getElementById('zoom-stage');
    const content  = document.getElementById('zoom-content');
    const captionE = document.getElementById('zoom-caption');
    const hint     = document.getElementById('zoom-hint');
    if (!overlay || !stage || !content) return;

    let scale = 1, tx = 0, ty = 0;
    let svgW = 0, svgH = 0;
    let fitScale = 1;
    let lastZoomTrigger = null;

    function applyTransform() {
      content.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    }
    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

    function fitToStage() {
      if (!svgW || !svgH) return;
      const r = stage.getBoundingClientRect();
      const margin = 32;
      fitScale = Math.min(
        (r.width  - margin * 2) / svgW,
        (r.height - margin * 2) / svgH
      );
      scale = fitScale;
      tx = (r.width  - svgW * scale) / 2;
      ty = (r.height - svgH * scale) / 2;
      applyTransform();
    }

    function zoomAt(mx, my, factor) {
      const newScale = clamp(scale * factor, fitScale * 0.5, fitScale * 16);
      tx = mx - newScale * (mx - tx) / scale;
      ty = my - newScale * (my - ty) / scale;
      scale = newScale;
      applyTransform();
    }

    function openZoom(svgEl, captionText) {
      const clone = svgEl.cloneNode(true);
      const vb = clone.viewBox?.baseVal;
      svgW = (vb && vb.width)  || svgEl.getBoundingClientRect().width  || 1200;
      svgH = (vb && vb.height) || svgEl.getBoundingClientRect().height || 800;
      clone.setAttribute('width',  svgW);
      clone.setAttribute('height', svgH);
      clone.style.width  = svgW + 'px';
      clone.style.height = svgH + 'px';

      content.innerHTML = '';
      content.appendChild(clone);
      if (captionE) captionE.textContent = captionText || '';

      lastZoomTrigger = document.activeElement;
      overlay.hidden = false;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        fitToStage();
        stage.focus({ preventScroll: true });
        if (hint) {
          hint.classList.remove('fade');
          clearTimeout(hint._t);
          hint._t = setTimeout(() => hint.classList.add('fade'), 2600);
        }
      });
    }

    function closeZoom() {
      overlay.hidden = true;
      content.innerHTML = '';
      document.body.style.overflow = '';
      lastZoomTrigger?.focus?.();
    }

    document.querySelectorAll('.figure').forEach((fig) => {
      const svg = fig.querySelector('svg');
      if (!svg) return;
      const cap = fig.querySelector('.figure-caption, figcaption');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'zoom-btn';
      btn.innerHTML = '⛶';
      btn.setAttribute('aria-label', 'Agrandir le schéma en plein écran');
      btn.title = 'Agrandir';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openZoom(svg, cap?.textContent?.trim() || '');
      });
      fig.appendChild(btn);
    });

    overlay.querySelector('.zoom-close')?.addEventListener('click', closeZoom);
    document.addEventListener('keydown', (e) => {
      if (overlay.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); closeZoom(); }
      else if (e.key === '+' || e.key === '=') { e.preventDefault(); const r = stage.getBoundingClientRect(); zoomAt(r.width/2, r.height/2, 1.25); }
      else if (e.key === '-' || e.key === '_') { e.preventDefault(); const r = stage.getBoundingClientRect(); zoomAt(r.width/2, r.height/2, 1/1.25); }
      else if (e.key === '0') { e.preventDefault(); fitToStage(); }
    });

    overlay.querySelector('.zoom-in')?.addEventListener('click', () => {
      const r = stage.getBoundingClientRect();
      zoomAt(r.width / 2, r.height / 2, 1.25);
    });
    overlay.querySelector('.zoom-out')?.addEventListener('click', () => {
      const r = stage.getBoundingClientRect();
      zoomAt(r.width / 2, r.height / 2, 1 / 1.25);
    });
    overlay.querySelector('.zoom-reset')?.addEventListener('click', fitToStage);

    stage.addEventListener('wheel', (e) => {
      e.preventDefault();
      const r = stage.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      zoomAt(mx, my, factor);
    }, { passive: false });

    let dragging = false, sx = 0, sy = 0, stx = 0, sty = 0;
    stage.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.interactive[data-card]')) return;
      dragging = true;
      stage.classList.add('grabbing');
      stage.setPointerCapture?.(e.pointerId);
      sx = e.clientX; sy = e.clientY; stx = tx; sty = ty;
    });
    stage.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      tx = stx + (e.clientX - sx);
      ty = sty + (e.clientY - sy);
      applyTransform();
    });
    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove('grabbing');
      stage.releasePointerCapture?.(e.pointerId);
    }
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('pointerleave', endDrag);

    let pinchStartDist = 0, pinchStartScale = 1, pinchMid = { x: 0, y: 0 };
    stage.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        dragging = false;
        const t1 = e.touches[0], t2 = e.touches[1];
        const dx = t1.clientX - t2.clientX, dy = t1.clientY - t2.clientY;
        pinchStartDist = Math.hypot(dx, dy);
        pinchStartScale = scale;
        const r = stage.getBoundingClientRect();
        pinchMid = { x: (t1.clientX + t2.clientX) / 2 - r.left, y: (t1.clientY + t2.clientY) / 2 - r.top };
      }
    }, { passive: true });
    stage.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && pinchStartDist > 0) {
        e.preventDefault();
        const t1 = e.touches[0], t2 = e.touches[1];
        const d = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        const factor = (d / pinchStartDist) * (pinchStartScale / scale);
        zoomAt(pinchMid.x, pinchMid.y, factor);
      }
    }, { passive: false });
    stage.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) pinchStartDist = 0;
    });

    window.addEventListener('resize', () => {
      if (!overlay.hidden) fitToStage();
    });
  }

  // ──────────────────────────────────────────────────────────
  // Schema sigil injection — MG monogram on each figure
  // ──────────────────────────────────────────────────────────

  function setupSigil() {
    const SIGIL = '<svg class="sigil-mark" viewBox="0 0 44 44" aria-hidden="true" focusable="false">'
      + '<circle class="sigil-bg" cx="22" cy="22" r="20.5"/>'
      + '<circle class="sigil-ring" cx="22" cy="22" r="17.5"/>'
      + '<g class="sigil-letters">'
      +   '<text x="7.5" y="29">M</text>'
      +   '<text x="22" y="29">G</text>'
      + '</g>'
      + '</svg>';
    document.querySelectorAll('figure.figure').forEach(function (fig) {
      if (fig.querySelector('.schema-sigil')) return;
      const a = document.createElement('a');
      a.className = 'schema-sigil';
      a.href = 'https://mathieugug.github.io/';
      a.target = '_blank';
      a.rel = 'noopener';
      a.setAttribute('aria-label', 'Mathieu Guglielmino — visiter mathieugug.github.io');
      a.title = 'Mathieu Guglielmino · mathieugug.github.io';
      a.innerHTML = SIGIL;
      fig.appendChild(a);
    });
  }

  // ──────────────────────────────────────────────────────────
  // Topbar scroll class
  // ──────────────────────────────────────────────────────────

  function setupTopbarScroll() {
    const b = document.getElementById('topbar');
    if (!b) return;
    window.addEventListener('scroll', function () {
      b.classList.toggle('scrolled', window.scrollY > 4);
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
