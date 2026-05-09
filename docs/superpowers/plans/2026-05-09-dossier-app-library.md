# Bibliothèque partagée `dossier-app` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extraire ~11k lignes de JS+CSS dupliqués des 14 apps `*/2026*-app.html` vers `/assets/dossier-app.{js,css}`, ajouter une suite de tests statiques zero-dep en CI pour prévenir les régressions, et propager le pattern à la skill `illustrated-deep-research`.

**Architecture:** Lib passive auto-bootstrap (IIFE) qui lit `window.SCHEMAS` et trouve ses éléments DOM par ID conventionnel. Aucune API publique, aucun framework. Chaque app garde sa data + son thème inline ; le comportement et les patterns structurels vivent dans la lib. Migration en 3 PRs — référence + lib + tests + CI, puis batch de 4-5 apps via script Python, puis 9 dernières apps + skill template + CLAUDE.md.

**Tech Stack:** Vanilla HTML/CSS/JS, Python 3 (script de migration), Node 20+ `node:test` (suite de tests), GitHub Actions (CI).

**Spec:** `docs/superpowers/specs/2026-05-09-dossier-app-library-design.md` — à lire avant d'attaquer la première tâche.

**Branche:** `claude/dossier-app-library` (déjà créée depuis `main`).

---

## Phase 1 — PR 1 : Lib + référence + tests + CI

À la fin de cette phase : `/assets/dossier-app.js` + `.css` existent, l'app de référence `observabilite-agents-ia` les utilise, le rendu est inchangé, les tests CI tournent sur PR. Push + ouverture PR + attente de merge avant Phase 2.

### Task 1.1 — Setup : lecture du spec et de l'app de référence

**Files:**
- Read: `docs/superpowers/specs/2026-05-09-dossier-app-library-design.md`
- Read: `observabilite-agents-ia/20260430-observabilite-agents-ia-app.html`

- [ ] **Step 1: Lire le spec en entier**

Le spec contient le contrat lib ↔ page, les IDs requis, les non-objectifs. Toute décision d'ambiguïté pendant l'implémentation doit s'y référer.

- [ ] **Step 2: Localiser les frontières dans l'app de référence**

Run:
```
grep -n "DATA\|Modal dispatcher\|Citations →\|TOC active\|Mobile panels\|Sources sidebar — desktop\|Fullscreen zoom\|Schema sigil injection" observabilite-agents-ia/20260430-observabilite-agents-ia-app.html
```

Expected output (frontières confirmées) :
- `2545` : début de `// DATA — replace these placeholders`
- `2998` : début de `// Modal dispatcher` (= début du comportement)
- `3055`, `3100`, `3132`, `3159`, `3188`, `3365` : sous-sections de comportement
- `3389-3391` : second `<script>` (topbar scroll handler en une ligne)

CSS sections via :
```
grep -n "─────────" observabilite-agents-ia/20260430-observabilite-agents-ia-app.html | head -30
```

Expected sections candidates pour la lib :
- `Tooltipped terms` (~467)
- `TOC` (~179)
- `Topbar` (~107)
- `Layout` (~66, partagé avec sources-collapse)
- `Fullscreen zoom overlay` (~393)
- `Citations` (~522)
- `Sources sidebar` (~535, partiel — seulement collapse btn)
- `Schema sigil` (~716)

### Task 1.2 — Créer le squelette de la lib JS

**Files:**
- Create: `assets/dossier-app.js`

- [ ] **Step 1: Créer le fichier avec wrapper IIFE et bootstrap**

Crée `assets/dossier-app.js` avec ce squelette initial :

```javascript
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
```

- [ ] **Step 2: Commit le squelette**

```bash
git add assets/dossier-app.js
git commit -m "feat(lib): squelette dossier-app.js avec IIFE et stubs

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task 1.3 — Remplir le JS de la lib depuis l'app de référence

**Files:**
- Modify: `assets/dossier-app.js`
- Read: `observabilite-agents-ia/20260430-observabilite-agents-ia-app.html` (lines 2998-3387 + 3390)

- [ ] **Step 1: Copier le code modal**

Lire `observabilite-agents-ia/20260430-observabilite-agents-ia-app.html` lignes 2998-3052 (Modal dispatcher + Keyboard activation pour SVG regions).

Remplacer le stub `setupModal()` dans `assets/dossier-app.js` par le contenu adapté :

```javascript
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
```

Différences clés vs l'original : `window.SCHEMAS` (au lieu d'un global `SCHEMAS`), garde précoce `if (!modalRoot) return;` pour le fallback gracieux, garde sur `modalEyebrow/Title/Body` au cas où.

- [ ] **Step 2: Copier le code citations**

Adapter le bloc lignes 3055-3081 (Citations → highlight source in sidebar) dans `setupCitations()`. Préserver l'auto-expand des sources collapsed.

```javascript
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
```

- [ ] **Step 3: Copier les tooltips**

Adapter lignes 3087-3097 :

```javascript
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
```

- [ ] **Step 4: Copier le TOC observer**

Adapter lignes 3103-3129 :

```javascript
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
```

- [ ] **Step 5: Copier les mobile panels**

Adapter lignes 3135-3156 :

```javascript
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
```

- [ ] **Step 6: Copier le sources toggle (avec clé localStorage générique)**

Adapter lignes 3162-3185 — **changement** : la clé localStorage passe de `obs-sources-collapsed` à `dossier-sources-collapsed` :

```javascript
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
```

- [ ] **Step 7: Copier le zoom plein écran**

Adapter lignes 3191-3363 (le gros bloc `setupZoom`). Pas de changement de logique, juste copier-coller le contenu de l'IIFE dans la fonction `setupZoom()` (sans le wrapper `(function setupZoom() { ... })();` puisque c'est déjà dans une fonction nommée).

```javascript
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
```

- [ ] **Step 8: Copier le sigil**

Adapter lignes 3366-3387 :

```javascript
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
```

- [ ] **Step 9: Copier le topbar scroll**

Adapter ligne 3390 (one-liner) :

```javascript
  function setupTopbarScroll() {
    const b = document.getElementById('topbar');
    if (!b) return;
    window.addEventListener('scroll', function () {
      b.classList.toggle('scrolled', window.scrollY > 4);
    }, { passive: true });
  }
```

- [ ] **Step 10: Vérifier que la lib parse**

Run:
```
node -e "require('vm').compileFunction(require('fs').readFileSync('assets/dossier-app.js', 'utf8'));console.log('OK')"
```

Expected: `OK`

- [ ] **Step 11: Commit**

```bash
git add assets/dossier-app.js
git commit -m "feat(lib): contenu complet de dossier-app.js (modal/zoom/citations/TOC/panels/sources/sigil/topbar)

Source extraite de observabilite-agents-ia/...-app.html.
Changement collateral : clé localStorage 'obs-sources-collapsed'
renommée en 'dossier-sources-collapsed' pour partage propre entre
dossiers (avant : effet de bord involontaire).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task 1.4 — Créer la lib CSS

**Files:**
- Create: `assets/dossier-app.css`
- Read: `observabilite-agents-ia/20260430-observabilite-agents-ia-app.html` (lignes 36-763 du `<style>` principal)

- [ ] **Step 1: Créer le fichier avec en-tête + sections nommées**

Crée `assets/dossier-app.css` avec ce squelette :

```css
/* dossier-app — shared structural CSS for /*/2026*-app.html
 *
 * Source unique pour les patterns visuels partagés : zoom overlay,
 * modal, panel-close mobile, topbar sticky, sources collapse,
 * citations highlight, sigil MG, tooltips terms.
 *
 * Les variables de thème (--paper, --accent, --carmine, --ink…)
 * restent définies par chaque page dans son <style> :root.
 * Les sélecteurs ici les référencent via var(...).
 *
 * Spec : docs/superpowers/specs/2026-05-09-dossier-app-library-design.md
 */

/* dossier-app:patterns:start */

/* ───────── Layout grid + panel-close (mobile) ───────── */
/* (à remplir Task 1.4 step 2) */

/* ───────── Topbar sticky ───────── */
/* (à remplir Task 1.4 step 3) */

/* ───────── Tooltipped terms ───────── */
/* (à remplir Task 1.4 step 4) */

/* ───────── Fullscreen zoom overlay ───────── */
/* (à remplir Task 1.4 step 5) */

/* ───────── Citations ───────── */
/* (à remplir Task 1.4 step 6) */

/* ───────── Sources sidebar (collapse btn only) ───────── */
/* (à remplir Task 1.4 step 7) */

/* ───────── Schema sigil ───────── */
/* (à remplir Task 1.4 step 8) */

/* dossier-app:patterns:end */
```

- [ ] **Step 2: Layout grid + panel-close**

Lire `observabilite-agents-ia/...-app.html` lignes 66-104. Copier ce bloc dans la section "Layout grid + panel-close". **Inclure aussi** la règle `body { padding-top: 56px; }` (ligne 135) qui est solidaire de la topbar.

- [ ] **Step 3: Topbar sticky**

Copier lignes 107-134 (toute la section `.topbar`).

- [ ] **Step 4: Tooltipped terms**

Copier lignes 467-520 (chercher `.term { … }` jusqu'à la fin de la media query mobile pour les terms).

Run:
```
sed -n '467,520p' observabilite-agents-ia/20260430-observabilite-agents-ia-app.html
```

(adapte la borne de fin si la section déborde — vise `}` qui ferme la dernière règle .term)

- [ ] **Step 5: Fullscreen zoom overlay**

Copier lignes 393-466 (de `/* ───────── Fullscreen zoom overlay ───────── */` jusqu'à la dernière règle `.zoom-*`).

- [ ] **Step 6: Citations**

Copier lignes 522-534 (juste avant la section Sources sidebar).

- [ ] **Step 7: Sources sidebar — collapse btn uniquement**

Attention : la section "Sources sidebar" complète (lignes 535-715 environ) contient à la fois du structurel partagé (collapse btn, hover state) et du décoratif spécifique à la page (la liste des sources, son styling). N'extraire que le collapse btn et son miroir expand btn :

Run:
```
grep -n "sources-collapse-btn\|sources-expand-btn" observabilite-agents-ia/20260430-observabilite-agents-ia-app.html
```

Identifier les blocs CSS qui définissent ces deux IDs + leur transition. Copier uniquement ces blocs.

- [ ] **Step 8: Schema sigil**

Copier lignes 716-762 (de `/* ───────── Schema sigil */` jusqu'à la fermeture de cette section, avant `</style>` ligne 763).

- [ ] **Step 9: Vérifier le résultat**

Run:
```
wc -l assets/dossier-app.css
grep -c "var(--" assets/dossier-app.css
```

Expected: ~250-400 lignes, plusieurs dizaines de `var(--…)` (preuve que les vars de thème sont bien référencées).

- [ ] **Step 10: Commit**

```bash
git add assets/dossier-app.css
git commit -m "feat(lib): contenu de dossier-app.css (patterns structurels)

Sections : layout grid, panel-close, topbar, tooltips terms,
zoom overlay, citations, sources collapse btn, sigil.
Vars de thème (--paper, --accent, --ink…) restent définies par
chaque page.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task 1.5 — Tests : fixtures et structure

**Files:**
- Create: `tests/fixtures/expected-fns.json`
- Create: `tests/fixtures/expected-ids.json`
- Create: `tests/README.md`

- [ ] **Step 1: Créer la fixture des noms de fonctions**

Crée `tests/fixtures/expected-fns.json` :

```json
[
  "setupModal",
  "setupCitations",
  "setupTooltips",
  "setupTocObserver",
  "setupMobilePanels",
  "setupSourcesToggle",
  "setupZoom",
  "setupSigil",
  "setupTopbarScroll",
  "openModal",
  "closeModal",
  "openZoom",
  "closeZoom",
  "fitToStage",
  "zoomAt",
  "applyTransform",
  "setCollapsed"
]
```

- [ ] **Step 2: Créer la fixture des IDs/sélecteurs**

Crée `tests/fixtures/expected-ids.json` :

```json
{
  "rootIds": [
    "zoom-overlay",
    "modal-root",
    "toc",
    "sources",
    "topbar"
  ],
  "cssSelectors": [
    "#zoom-overlay",
    "#modal-root",
    ".panel-close",
    ".sigil-mark",
    "#topbar",
    "#sources-collapse-btn",
    "#sources-expand-btn"
  ]
}
```

- [ ] **Step 3: Créer le README des tests**

Crée `tests/README.md` :

```markdown
# Tests statiques — bibliothèque dossier-app

Suite de tests zero-dep qui valide que :
1. La lib `assets/dossier-app.{js,css}` est intègre.
2. Chaque app `*/2026*-app.html` respecte le contrat de la lib.

## Lancer les tests

Local :
```
node --test tests/
```

Node ≥ 20 requis (`node:test` builtin).

## Périmètre

**Couvert** :
- Validité syntaxique de la lib JS.
- Présence des fonctions/sélecteurs attendus dans la lib (cf. `fixtures/`).
- Chaque app embarque le `<script src>` et le `<link rel>` de la lib.
- Chaque app définit `window.SCHEMAS` inline.
- Chaque app contient les IDs racines requis.
- Aucune app ne ré-inline les fonctions extraites.

**Non couvert** :
- Comportement runtime (le modal s'ouvre vraiment, le zoom marche, etc.).
- Rendu visuel.
- A11y.
- Cross-browser.

Pour ces aspects : validation manuelle au moment du merge (ouvrir 2-3 apps dans le navigateur, exercer zoom + modal + citations).

## Mettre à jour le contrat

Quand on ajoute une fonction ou un sélecteur à la lib, l'ajouter aussi dans :
- `fixtures/expected-fns.json` si c'est une fonction
- `fixtures/expected-ids.json` si c'est un ID/sélecteur clé

Sinon les tests passent même si la fonction est manquante dans une lib future.
```

- [ ] **Step 4: Commit**

```bash
git add tests/fixtures/ tests/README.md
git commit -m "test: fixtures et README pour la suite de tests dossier-app

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task 1.6 — Tests : intégrité de la lib (TDD)

**Files:**
- Create: `tests/lib-contract.test.mjs`

- [ ] **Step 1: Écrire le test qui doit échouer**

Crée `tests/lib-contract.test.mjs` :

```javascript
import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const expectedFns = JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/expected-fns.json'), 'utf8'));
const expectedIds = JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/expected-ids.json'), 'utf8'));

test('dossier-app.js parses as valid JS', () => {
  const js = readFileSync(join(ROOT, 'assets/dossier-app.js'), 'utf8');
  vm.compileFunction(js);
});

test('dossier-app.js contains all expected function definitions', () => {
  const js = readFileSync(join(ROOT, 'assets/dossier-app.js'), 'utf8');
  const missing = [];
  for (const fn of expectedFns) {
    if (!new RegExp(`function\\s+${fn}\\b`).test(js)) {
      missing.push(fn);
    }
  }
  assert.deepEqual(missing, [], `Missing functions in dossier-app.js: ${missing.join(', ')}`);
});

test('dossier-app.css is non-empty and contains key selectors', () => {
  const css = readFileSync(join(ROOT, 'assets/dossier-app.css'), 'utf8');
  assert.ok(css.length > 500, 'dossier-app.css is suspiciously short');
  const missing = [];
  for (const sel of expectedIds.cssSelectors) {
    if (!css.includes(sel)) missing.push(sel);
  }
  assert.deepEqual(missing, [], `Missing selectors in dossier-app.css: ${missing.join(', ')}`);
});
```

- [ ] **Step 2: Lancer le test**

Run:
```
node --test tests/lib-contract.test.mjs
```

Expected: les 3 tests doivent **passer** car la lib a déjà été remplie en Task 1.3 et 1.4. Si l'un fail, retourner aux tasks correspondantes pour fixer.

- [ ] **Step 3: Commit**

```bash
git add tests/lib-contract.test.mjs
git commit -m "test: lib-contract.test.mjs valide intégrité de dossier-app.{js,css}

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task 1.7 — Tests : intégration apps (TDD)

**Files:**
- Create: `tests/apps-integration.test.mjs`

- [ ] **Step 1: Écrire le test qui va échouer pour les apps non-migrées**

Crée `tests/apps-integration.test.mjs` :

```javascript
import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const expectedFns = JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/expected-fns.json'), 'utf8'));
const expectedIds = JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/expected-ids.json'), 'utf8'));

const apps = execSync('git ls-files "*/2026*-app.html"', { cwd: ROOT, encoding: 'utf8' })
  .trim().split('\n').filter(Boolean);

assert.ok(apps.length >= 14, `Expected at least 14 apps, found ${apps.length}`);

for (const app of apps) {
  const html = readFileSync(join(ROOT, app), 'utf8');

  test(`${app}: includes lib JS via /assets/dossier-app.js`, () => {
    assert.match(html, /<script[^>]+src=["']\/assets\/dossier-app\.js["']/,
      `Missing <script src="/assets/dossier-app.js"> in ${app}`);
  });

  test(`${app}: includes lib CSS via /assets/dossier-app.css`, () => {
    assert.match(html, /<link[^>]+href=["']\/assets\/dossier-app\.css["']/,
      `Missing <link href="/assets/dossier-app.css"> in ${app}`);
  });

  test(`${app}: provides window.SCHEMAS`, () => {
    const hasInline = /(?:const|var|let)\s+SCHEMAS\s*=/.test(html);
    const hasWindow = /window\.SCHEMAS\s*=/.test(html);
    assert.ok(hasInline || hasWindow,
      `${app} must define SCHEMAS (inline const) and expose it via window.SCHEMAS`);
    if (hasInline) {
      assert.match(html, /window\.SCHEMAS\s*=\s*SCHEMAS/,
        `${app} declares const SCHEMAS but doesn't expose it via window.SCHEMAS = SCHEMAS`);
    }
  });

  test(`${app}: contains required root IDs`, () => {
    const missing = [];
    for (const id of expectedIds.rootIds) {
      if (!html.includes(`id="${id}"`)) missing.push(id);
    }
    assert.deepEqual(missing, [], `Missing IDs in ${app}: ${missing.join(', ')}`);
  });

  test(`${app}: does not inline lib functions`, () => {
    const found = [];
    for (const fn of expectedFns) {
      if (new RegExp(`function\\s+${fn}\\b`).test(html)) {
        found.push(fn);
      }
    }
    assert.deepEqual(found, [],
      `${app} contains inline copies of lib functions: ${found.join(', ')}. They should live in /assets/dossier-app.js only.`);
  });

  test(`${app}: if has interactive figures, has #zoom-overlay`, () => {
    if (/<figure[^>]+class="[^"]*\bfigure\b[^"]*"[^>]*>[\s\S]*?<svg/.test(html)) {
      assert.ok(html.includes('id="zoom-overlay"'),
        `${app} has interactive figures but no #zoom-overlay container`);
    }
  });

  test(`${app}: does not inline lib CSS rules (signatures)`, () => {
    // Si le bloc CSS pattern de la lib a été correctement extrait,
    // ces règles ne doivent plus apparaître dans le <style> inline.
    // Note : l'ID dans le HTML body (id="zoom-overlay") est OK,
    // ce test cible uniquement la déclaration de RÈGLE CSS.
    const signatures = [
      /#zoom-overlay\s*\{/,
      /#modal-root\s*\{/,
      /\.sigil-mark\s*\{/,
      /#sources-collapse-btn\s*\{/,
    ];
    const leaks = signatures.filter(re => re.test(html));
    assert.equal(leaks.length, 0,
      `${app} has inline lib CSS rules: ${leaks.map(r => r.source).join(', ')}. They should live in /assets/dossier-app.css only.`);
  });
}
```

- [ ] **Step 2: Lancer les tests**

Run:
```
node --test tests/apps-integration.test.mjs
```

Expected: **massivement red** — les 14 apps n'utilisent pas encore la lib. Tu devrais voir ~14 × 6 = ~84 tests, dont la plupart fail.

L'app de référence `observabilite-agents-ia/20260430-observabilite-agents-ia-app.html` fail aussi (elle a encore son JS inline). C'est attendu — Task 1.8 va la migrer.

- [ ] **Step 3: Commit**

```bash
git add tests/apps-integration.test.mjs
git commit -m "test: apps-integration.test.mjs valide contrat lib pour chaque app

Tests sont rouges actuellement — Task 1.8 migrera l'app de référence
pour faire passer les tests sur cette app, et les Phases 2/3 migreront
les 13 autres.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task 1.8 — Migrer l'app de référence (faire passer les tests sur cette app)

**Files:**
- Modify: `observabilite-agents-ia/20260430-observabilite-agents-ia-app.html`

- [ ] **Step 1: Ajouter le `<link rel>` dans le head**

Localiser dans le head (après les Google Fonts, avant le `<style>`) — soit ~ligne 35.

Run:
```
grep -n "fonts.gstatic.com\|<style>" observabilite-agents-ia/20260430-observabilite-agents-ia-app.html | head -3
```

Attendu : ligne 34 (preconnect gstatic) + ligne 36 (`<style>`).

Insérer après la ligne 34, avant le `<style>` ligne 36 :
```html
  <link rel="stylesheet" href="/assets/dossier-app.css">
```

- [ ] **Step 2: Retirer les blocs CSS partagés du `<style>` inline**

C'est l'étape la plus délicate. Repérer et supprimer les sections **exactement** dupliquées de la lib CSS :

| Section | Lignes (approx.) à supprimer du fichier |
|---|---|
| Layout grid + panel-close | 66-104 |
| `body { padding-top: 56px; }` | 135 (la ligne isolée) |
| Topbar sticky | 107-134 |
| Tooltipped terms | 467-520 |
| Fullscreen zoom overlay | 393-466 |
| Citations | 522-534 |
| Sources sidebar — collapse btn portion | (sub-bloc identifié en Task 1.4 step 7) |
| Schema sigil | 716-762 |

Approche recommandée : ouvrir le fichier dans l'éditeur, dérouler chaque section, **commenter avant de supprimer** pour pouvoir comparer visuellement, puis supprimer une fois sûr.

**Garde-fous** :
- Garder `:root { --paper, --ink, ... }` (lignes 36-52) intact.
- Garder `header.site` (lignes 137+) intact (page-specific header).
- Garder le styling des `.figure`, `#sources` list interne, etc.

- [ ] **Step 3: Retirer les blocs JS du `<script>` principal**

Localiser ligne 2998 (commentaire `// Modal dispatcher`) — c'est la frontière. Supprimer tout depuis cette ligne jusqu'à la fin du `<script>` (avant `</script>` ligne ~3388).

**Attention** : le `<script>` principal commence ligne 2543. Il contient la data (SCHEMAS, SOURCES) jusqu'à ligne ~2995. Cette data DOIT rester.

Avant de couper, ajouter en fin du bloc data conservé (juste après la fermeture du tableau SOURCES) :
```javascript
    window.SCHEMAS = SCHEMAS;
```

(Cette ligne expose la data au `dossier-app.js` qui la lit via `window.SCHEMAS`.)

Le `<script>` après modification doit ressembler à :
```html
  <script>
    // ─────────────────────────────────────────────────
    // DATA — replace these placeholders with real content
    // ─────────────────────────────────────────────────

    const SCHEMAS = { /* ... */ };
    const SOURCES = [ /* ... */ ];

    window.SCHEMAS = SCHEMAS;
  </script>
```

- [ ] **Step 4: Retirer le second `<script>` inline (topbar scroll)**

Lignes 3389-3391 contiennent un second `<script>` :
```html
<script>
(function(){var b=document.getElementById('topbar');if(!b)return;...
</script>
```

Supprimer ce bloc entièrement — la lib s'en occupe via `setupTopbarScroll()`.

- [ ] **Step 5: Ajouter le `<script src>` de la lib avant `</body>`**

Insérer juste avant `</body>` :
```html
<script src="/assets/dossier-app.js" defer></script>
```

- [ ] **Step 6: Lancer les tests**

Run:
```
node --test tests/apps-integration.test.mjs 2>&1 | grep -E "observabilite-agents-ia.*\\.html.*(ok|not ok)" | head -10
```

Expected: **les 6 tests sur l'app de référence passent en vert** (les 13 autres apps restent rouges, c'est attendu pour Phase 2/3).

- [ ] **Step 7: Vérification visuelle dans le navigateur**

Lance un serveur local pour servir `/assets/...` correctement :

Run:
```
python -m http.server 8000
```

Ouvrir `http://localhost:8000/observabilite-agents-ia/20260430-observabilite-agents-ia-app.html`.

Vérifier :
- ✅ Le rendu visuel est identique à avant migration (compare avec `git stash` + reload + `git stash pop`)
- ✅ Le bouton zoom `⛶` apparaît au survol des schémas
- ✅ Cliquer le bouton zoom → overlay plein écran avec pan/zoom molette
- ✅ Cliquer une `[data-card]` dans un SVG → modal s'ouvre avec le bon contenu
- ✅ Cliquer une `<sup class="cite" data-cite="N">` → la sidebar Sources surligne `#source-N`
- ✅ Mobile (DevTools responsive) : toggle TOC + Sources via les boutons, panel-close fonctionne, Escape ferme le panneau
- ✅ Desktop : bouton replier Sources fonctionne, état persisté en localStorage (clé `dossier-sources-collapsed`)
- ✅ Topbar `.scrolled` apparaît au scroll
- ✅ Sigil MG en bas-droite de chaque schéma

Arrêter le serveur (Ctrl+C).

- [ ] **Step 8: Commit la migration de la référence**

```bash
git add observabilite-agents-ia/20260430-observabilite-agents-ia-app.html
git commit -m "refactor(observabilite-agents-ia/app): migrer vers /assets/dossier-app

Premier consommateur de la lib partagée. Le rendu et le comportement
sont identiques (vérifié visuellement). Le JS comportemental et le
CSS pattern sont supprimés du fichier — ils vivent désormais dans
/assets/dossier-app.{js,css}.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task 1.9 — CI workflow

**Files:**
- Create: `.github/workflows/test.yml`

- [ ] **Step 1: Créer le workflow**

Crée `.github/workflows/test.yml` :

```yaml
name: tests

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Run static checks
        run: node --test tests/
```

- [ ] **Step 2: Vérifier la syntaxe YAML**

Run:
```
python -c "import yaml; yaml.safe_load(open('.github/workflows/test.yml'))" && echo "OK"
```

Expected: `OK` (Python yaml installé via pip si manquant : `pip install pyyaml`).

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/test.yml
git commit -m "ci: workflow GitHub Actions pour la suite de tests dossier-app

Run sur pull_request et push vers main, node --test tests/.
Pas de npm install — Node 20 a node:test builtin et la suite est
zero-dep.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task 1.10 — Validation finale Phase 1 + push + PR

- [ ] **Step 1: Lancer toute la suite localement**

Run:
```
node --test tests/
```

Expected:
- Tous les tests `lib-contract.test.mjs` passent (3 tests).
- Tests `apps-integration.test.mjs` : sur l'app de référence (`observabilite-agents-ia/20260430-...-app.html`), les 6 tests passent.
- Sur les 13 autres apps non-migrées : ~78 tests fail (attendu).

C'est OK pour cette PR — la PR est verte sur la référence et le but est de passer les autres en vert sur les Phases 2 et 3.

**Mais attention** : un CI rouge bloque normalement le merge. Pour cette PR, deux options :
- **Option A (recommandée)** : la PR 1 ne déclenche PAS encore les tests sur les apps non-migrées. Adapter `apps-integration.test.mjs` pour ne tester que l'app de référence et les apps marquées comme migrées (ex. via une regex sur la présence de `<script src="/assets/dossier-app.js">`). Les apps non-migrées sont skippées avec un `test.skip`.

Implémentation Option A — dans `tests/apps-integration.test.mjs`, modifier la boucle :

```javascript
for (const app of apps) {
  const html = readFileSync(join(ROOT, app), 'utf8');
  const isMigrated = /\/assets\/dossier-app\.js/.test(html);

  if (!isMigrated) {
    test(`${app}: SKIPPED — not yet migrated to /assets/dossier-app`, { skip: true }, () => {});
    continue;
  }
  // ... rest of tests for migrated apps
}
```

Avec ce skip conditionnel, la CI passe verte sur PR 1 (référence migrée + 13 skipped). Au fur et à mesure que les Phases 2/3 migrent les autres, le skip se désactive automatiquement et leurs tests deviennent actifs.

Modifier `tests/apps-integration.test.mjs` selon ce pattern.

- [ ] **Step 2: Re-run la suite**

Run:
```
node --test tests/
```

Expected: tous les tests passent (référence en green, 13 apps skipped).

- [ ] **Step 3: Commit l'ajustement**

```bash
git add tests/apps-integration.test.mjs
git commit -m "test: skip apps non-migrées tant qu'elles n'utilisent pas la lib

Le skip s'auto-désactive quand l'app embarque
<script src=\"/assets/dossier-app.js\"> — pas besoin de toucher
aux tests pour activer une migration en Phase 2/3.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 4: Vérifier le diff complet de la PR**

Run:
```
git log --oneline main..HEAD
git diff main..HEAD --stat
```

Vérifier :
- 6-8 commits propres et thématiques
- Diff cohérent : nouveau `assets/`, nouveau `tests/`, nouveau `.github/workflows/`, modif unique de l'app de référence
- Pas de `tools/__pycache__/`, `.obsidian/`, `.playwright-mcp/`, fichiers `gouvernance/*` ou `measure-roi/*` (untracked, sans rapport avec cette PR)

- [ ] **Step 5: Push**

```bash
git push -u origin claude/dossier-app-library
```

- [ ] **Step 6: Ouvrir la PR via le MCP GitHub**

Utiliser `mcp__github__create_pull_request` avec :
- owner: `mathieugug`
- repo: `mathieugug.github.io`
- base: `main`
- head: `claude/dossier-app-library`
- title: `refacto: bibliothèque partagée /assets/dossier-app (Phase 1 — référence + lib + tests + CI)`
- body:

```markdown
## Quoi

Première phase de la mutualisation des ~11k lignes de JS+CSS dupliqués entre les 14 apps `*/2026*-app.html`.

Cette PR :
- Crée `/assets/dossier-app.js` (~400 lignes) et `/assets/dossier-app.css` (~250-400 lignes), extraits de l'app de référence `observabilite-agents-ia`.
- Migre cette unique app vers la lib (rendu et comportement identiques, vérifiés manuellement).
- Ajoute une suite de tests statiques zero-dep (`node --test tests/`) qui valide :
  - L'intégrité de la lib.
  - Que chaque app migrée respecte le contrat lib.
- Ajoute un workflow GitHub Actions sur `pull_request` + `push: main`.

## Pourquoi

Spec : `docs/superpowers/specs/2026-05-09-dossier-app-library-design.md`.

Déduplique le pattern (zoom, modal, panel-close, citations, TOC, sources collapse, sigil, topbar). Toute évolution du pattern devient un seul édit dans `/assets/`, plus 14 éditions parallèles.

## Hors scope

- Phase 2 (PR suivante) : script `tools/extract_to_lib.py` + migration de 4-5 apps via le script.
- Phase 3 (PR suivante) : 9 dernières apps + skill template + CLAUDE.md.

## Changements collateraux

- Clé localStorage `obs-sources-collapsed` renommée en `dossier-sources-collapsed` (état "sources repliées" reset au défaut "déplié" pour les utilisateurs déjà venus). Évite l'effet de bord involontaire actuel où replier sur une page replie sur les 13 autres.

## Test plan

- [x] `node --test tests/` passe localement (référence verte, 13 apps skipped en attente de migration).
- [x] CI Actions passe.
- [x] Vérification visuelle locale de l'app `observabilite-agents-ia` :
  - Zoom plein écran fonctionne (clic, molette, pinch, +/-/0/Échap).
  - Modal s'ouvre via `[data-card]` SVG, ferme via X et Échap.
  - Citations surlignent la source dans la sidebar.
  - Mobile : toggle TOC/Sources, panel-close, Escape.
  - Desktop : bouton replier Sources, persistance localStorage.
  - Topbar `.scrolled` apparaît au scroll.
  - Sigil MG en bas-droite des schémas.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

**STOP — attendre validation et merge de la PR 1 par Mathieu avant d'attaquer la Phase 2.**

---

## Phase 2 — PR 2 : Script de migration + batch de 5 apps

À la fin de cette phase : `tools/extract_to_lib.py` existe et a été utilisé pour migrer 5 apps additionnelles. Tests CI passent sur 6 apps au total (référence + 5).

**Préalable** : PR 1 mergée dans `main`. Faire `git checkout main && git pull && git checkout -b claude/dossier-app-library-batch-1`.

### Task 2.1 — Construire `tools/extract_to_lib.py` (TDD)

**Files:**
- Create: `tools/extract_to_lib.py`
- Create: `tools/test_extract_to_lib.py`

- [ ] **Step 1: Écrire un test stub qui parse une app et identifie les frontières**

Crée `tools/test_extract_to_lib.py` :

```python
"""Tests pour extract_to_lib.py — pytest non requis, utilise unittest natif."""
import unittest
from pathlib import Path
import sys
import tempfile
import shutil

sys.path.insert(0, str(Path(__file__).parent))
from extract_to_lib import find_js_boundary, find_css_pattern_blocks, migrate_app


REPO = Path(__file__).parent.parent
REFERENCE_APP = REPO / "observabilite-agents-ia" / "20260430-observabilite-agents-ia-app.html"


class TestBoundaryDetection(unittest.TestCase):
    def test_find_js_boundary_locates_modal_dispatcher(self):
        """Le boundary JS est la première ligne qui contient '// Modal dispatcher'."""
        # Sur une app pas encore migrée, ce comment marker existe.
        # Sur une app déjà migrée, find_js_boundary retourne None.
        sample = """
const SCHEMAS = {};
const SOURCES = [];

    // ─────────────────────────────────────────────────
    // Modal dispatcher
    // ─────────────────────────────────────────────────

    const modalRoot = document.getElementById('modal-root');
"""
        line = find_js_boundary(sample)
        self.assertIsNotNone(line)
        self.assertIn("Modal dispatcher", sample.splitlines()[line])

    def test_find_js_boundary_returns_none_when_already_migrated(self):
        sample = """
const SCHEMAS = {};
window.SCHEMAS = SCHEMAS;
"""
        line = find_js_boundary(sample)
        self.assertIsNone(line)


class TestMigrationIdempotent(unittest.TestCase):
    def test_migrate_app_is_idempotent(self):
        """Une app déjà migrée n'est pas re-modifiée."""
        # Crée une copie temp d'un fichier minimal déjà migré
        with tempfile.TemporaryDirectory() as td:
            sample = Path(td) / "app.html"
            sample.write_text("""<html><head>
<link rel="stylesheet" href="/assets/dossier-app.css">
</head><body>
<script>const SCHEMAS={};window.SCHEMAS=SCHEMAS;</script>
<script src="/assets/dossier-app.js" defer></script>
</body></html>""", encoding='utf-8')
            before = sample.read_text(encoding='utf-8')
            result = migrate_app(sample, dry_run=False)
            after = sample.read_text(encoding='utf-8')
            self.assertEqual(before, after)
            self.assertEqual(result['status'], 'already-migrated')


if __name__ == '__main__':
    unittest.main()
```

- [ ] **Step 2: Lancer le test — il doit fail (script n'existe pas)**

Run:
```
python tools/test_extract_to_lib.py
```

Expected: `ModuleNotFoundError: No module named 'extract_to_lib'`.

- [ ] **Step 3: Créer le squelette du script**

Crée `tools/extract_to_lib.py` :

```python
#!/usr/bin/env python3
"""Migre une app */2026*-app.html vers la bibliothèque /assets/dossier-app.

Usage:
    python tools/extract_to_lib.py <app.html> [<app2.html> ...]
    python tools/extract_to_lib.py --dry-run <app.html>
    python tools/extract_to_lib.py --all   # toutes les apps non-migrées

Le script :
1. Détecte si l'app est déjà migrée (présence de <script src="/assets/dossier-app.js">).
2. Localise le bloc JS comportemental via le marker '// Modal dispatcher'.
3. Compare ce bloc avec /assets/dossier-app.js, modulo normalisations
   tolérées (whitespace, commentaires, clé localStorage). Si divergence
   significative → flag manuel, n'écrit pas.
4. Remplace le bloc par <script src="/assets/dossier-app.js" defer>.
5. Insère <link rel="stylesheet" href="/assets/dossier-app.css"> dans le <head>.
6. Supprime les blocs CSS pattern listés (par marqueurs de section).
7. Ajoute window.SCHEMAS = SCHEMAS si pas déjà présent.

Idempotent : ré-exécution sur une app déjà migrée → no-op.
"""
import argparse
import re
import sys
from pathlib import Path
from typing import Optional

REPO = Path(__file__).parent.parent
LIB_JS = REPO / "assets" / "dossier-app.js"
LIB_CSS = REPO / "assets" / "dossier-app.css"


def find_js_boundary(content: str) -> Optional[int]:
    """Retourne le numéro de ligne (0-indexed) où commence le JS comportemental.

    Marker : '// Modal dispatcher' (présent dans toutes les apps non-migrées).
    Retourne None si déjà migrée (pattern <script src="/assets/dossier-app.js"> détecté).
    """
    if '/assets/dossier-app.js' in content:
        return None
    for i, line in enumerate(content.splitlines()):
        if '// Modal dispatcher' in line:
            return i
    return None


def find_css_pattern_blocks(content: str) -> list[tuple[int, int]]:
    """Retourne la liste des (start, end) lignes des sections CSS à supprimer.

    Sections cherchées (via les comment markers '/* ───────── X ─────────... */'):
    - Layout grid (avec panel-close)
    - Topbar
    - Tooltipped terms
    - Fullscreen zoom overlay
    - Citations
    - Schema sigil
    """
    section_markers = [
        '─────── Layout',
        '─────── Header',  # contient .topbar
        '─────── Tooltipped terms',
        '─────── Fullscreen zoom overlay',
        '─────── Citations',
        '─────── Schema sigil',
    ]
    # TODO Task 2.1 step 5
    return []


def migrate_app(path: Path, dry_run: bool = False) -> dict:
    """Migre une app vers la lib. Retourne un dict {status, changes, warnings}."""
    content = path.read_text(encoding='utf-8')
    if '/assets/dossier-app.js' in content:
        return {'status': 'already-migrated', 'changes': 0, 'warnings': []}
    # TODO Task 2.1 step 6+
    return {'status': 'todo', 'changes': 0, 'warnings': []}


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('apps', nargs='*', help='Chemins des apps à migrer')
    parser.add_argument('--all', action='store_true', help='Toutes les apps non-migrées')
    parser.add_argument('--dry-run', action='store_true', help='Affiche les changements sans écrire')
    args = parser.parse_args()

    if args.all:
        targets = sorted(REPO.glob('*/2026*-app.html'))
    else:
        targets = [Path(p) for p in args.apps]

    if not targets:
        parser.error('Specify --all or at least one app path.')

    for app in targets:
        result = migrate_app(app, dry_run=args.dry_run)
        print(f"{app.name}: {result['status']}", file=sys.stderr)
        for w in result.get('warnings', []):
            print(f"  ⚠ {w}", file=sys.stderr)


if __name__ == '__main__':
    sys.exit(main() or 0)
```

- [ ] **Step 4: Lancer le test → fail sur la logique de boundary**

Run:
```
python tools/test_extract_to_lib.py TestBoundaryDetection
```

Expected: les deux tests passent (la fonction `find_js_boundary` est suffisamment implémentée).

Run:
```
python tools/test_extract_to_lib.py TestMigrationIdempotent
```

Expected: `test_migrate_app_is_idempotent` passe (le early-return idempotent est implémenté).

- [ ] **Step 5: Implémenter `find_css_pattern_blocks`**

Remplacer le stub par l'implémentation :

```python
def find_css_pattern_blocks(content: str) -> list[tuple[int, int]]:
    """Retourne la liste des (start_line, end_line, name) des sections CSS à supprimer.

    Stratégie : repère chaque marker de section et son successeur immédiat.
    end_line = ligne avant le marker suivant (ou avant </style> pour le dernier).
    """
    section_markers = [
        ('Layout',                'layout'),
        ('Header',                'topbar'),  # CLAUDE.md confond légèrement, mais Header inclut .topbar
        ('Tooltipped terms',      'tooltips'),
        ('Fullscreen zoom overlay', 'zoom'),
        ('Citations',             'citations'),
        ('Schema sigil',          'sigil'),
    ]
    lines = content.splitlines()
    found = []  # liste de (line_idx, label)
    for i, line in enumerate(lines):
        for marker, label in section_markers:
            if marker in line and '─────────' in line:
                found.append((i, label))
                break
    # Trouve la fin de chaque section : ligne avant le marker suivant
    blocks = []
    for idx, (start, label) in enumerate(found):
        if idx + 1 < len(found):
            end = found[idx + 1][0] - 1
        else:
            # Dernière section : cherche le '</style>' suivant
            end = next((j for j, l in enumerate(lines[start:], start=start) if '</style>' in l), start) - 1
        blocks.append((start, end, label))
    return blocks
```

Ajoute un test pour cette fonction :

```python
class TestCssBlocks(unittest.TestCase):
    def test_find_css_pattern_blocks_in_reference(self):
        """Sur l'app de référence non-migrée, on trouve toutes les sections."""
        # Skipped — la référence est déjà migrée en PR 1.
        # Test sur un fichier sample mock.
        sample = """\
:root {}
/* ───────── Layout ───────── */
.layout { display: grid; }
/* ───────── Header ───────── */
.topbar { position: fixed; }
/* ───────── Tooltipped terms ───────── */
.term {}
/* ───────── Fullscreen zoom overlay ───────── */
#zoom-overlay {}
/* ───────── Citations ───────── */
.cite {}
/* ───────── Schema sigil ───────── */
.sigil-mark {}
</style>
"""
        blocks = find_css_pattern_blocks(sample)
        self.assertEqual(len(blocks), 6)
        labels = [b[2] for b in blocks]
        self.assertEqual(labels, ['layout', 'topbar', 'tooltips', 'zoom', 'citations', 'sigil'])
```

Run:
```
python tools/test_extract_to_lib.py TestCssBlocks
```

Expected: passe.

- [ ] **Step 6: Implémenter `migrate_app` complet**

Remplacer le stub par :

```python
def migrate_app(path: Path, dry_run: bool = False) -> dict:
    content = path.read_text(encoding='utf-8')
    warnings = []
    if '/assets/dossier-app.js' in content:
        return {'status': 'already-migrated', 'changes': 0, 'warnings': []}

    js_boundary = find_js_boundary(content)
    if js_boundary is None:
        return {'status': 'no-boundary-found', 'changes': 0,
                'warnings': ['Could not locate "// Modal dispatcher" — file may not match expected structure.']}

    lines = content.splitlines(keepends=True)

    # 1. Find end of main <script> (the </script> after js_boundary)
    js_end = None
    for i in range(js_boundary, len(lines)):
        if '</script>' in lines[i]:
            js_end = i
            break
    if js_end is None:
        return {'status': 'no-script-end', 'changes': 0, 'warnings': ['Could not find </script> after JS boundary.']}

    # 2. Replace lines[js_boundary..js_end] with empty (keep </script> closing tag)
    new_lines = lines[:js_boundary] + ['  </script>\n'] + lines[js_end+1:]

    # 3. Add window.SCHEMAS = SCHEMAS just before the closing </script> if not present
    full = ''.join(new_lines)
    if 'window.SCHEMAS' not in full:
        # Insert before the </script> we just inserted
        full = full.replace('  </script>\n', '\n    window.SCHEMAS = SCHEMAS;\n  </script>\n', 1)

    # 4. Remove second <script> (topbar one-liner)
    full = re.sub(
        r"<script>\s*\(function\(\)\{var b=document\.getElementById\('topbar'\).*?\}\)\(\);\s*</script>\s*",
        '',
        full,
        flags=re.DOTALL,
    )

    # 5. Remove CSS pattern blocks
    block_lines = full.splitlines(keepends=True)
    blocks = find_css_pattern_blocks(full)
    # Remove from end to start to preserve indices
    for start, end, _label in sorted(blocks, reverse=True):
        del block_lines[start:end+1]
    full = ''.join(block_lines)

    # 6. Remove the orphan 'body { padding-top: 56px; }' line (was solidaire of topbar block)
    full = re.sub(r"\n\s*body\s*\{\s*padding-top:\s*56px;\s*\}\s*\n", "\n", full, count=1)

    # 7. Insert <link rel="stylesheet" href="/assets/dossier-app.css"> just before <style> in head
    if '/assets/dossier-app.css' not in full:
        full = full.replace(
            '<style>',
            '<link rel="stylesheet" href="/assets/dossier-app.css">\n  <style>',
            1,
        )

    # 8. Insert <script src="/assets/dossier-app.js" defer></script> before </body>
    full = full.replace('</body>', '<script src="/assets/dossier-app.js" defer></script>\n</body>', 1)

    if dry_run:
        return {'status': 'would-migrate', 'changes': 1, 'warnings': warnings}

    path.write_text(full, encoding='utf-8')
    return {'status': 'migrated', 'changes': 1, 'warnings': warnings}
```

- [ ] **Step 7: Lancer tous les tests du script**

Run:
```
python tools/test_extract_to_lib.py
```

Expected: tous les tests passent.

- [ ] **Step 8: Test dry-run sur 1 app**

Run:
```
python tools/extract_to_lib.py --dry-run economie-inference/20260506-economie-inference-app.html
```

Expected: `economie-inference/20260506-economie-inference-app.html: would-migrate`. Aucun changement sur disque.

- [ ] **Step 9: Commit**

```bash
git add tools/extract_to_lib.py tools/test_extract_to_lib.py
git commit -m "feat(tools): script extract_to_lib.py pour migrer apps vers la lib

Idempotent (re-run sur app migrée = no-op). Détecte le boundary JS
via marker '// Modal dispatcher'. Supprime les sections CSS pattern
identifiées par leurs comment markers. Insère <link> et <script> de
la lib. Tests unitaires basiques en parallèle.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task 2.2 — Migrer 5 apps avec le script

**Files:**
- Modify: 5 apps choisies (recommandé : les 5 plus récentes pour minimiser la dérive)

- [ ] **Step 1: Choisir les 5 apps cibles**

Run:
```
ls -lt */2026*-app.html | head -5
```

Cibles recommandées (par ordre de date décroissante) :
1. `mcp-plateforme/20260508-mcp-plateforme-app.html`
2. `measure-roi/20260507-roi-ia-generative-agentique-app.html`
3. `economie-inference/20260506-economie-inference-app.html`
4. `modeles-raisonnement/20260506-modeles-raisonnement-app.html`
5. `narrative-experiences/20260505-narrative-experiences-app.html`

- [ ] **Step 2: Dry-run sur les 5**

Run:
```
python tools/extract_to_lib.py --dry-run \
  mcp-plateforme/20260508-mcp-plateforme-app.html \
  measure-roi/20260507-roi-ia-generative-agentique-app.html \
  economie-inference/20260506-economie-inference-app.html \
  modeles-raisonnement/20260506-modeles-raisonnement-app.html \
  narrative-experiences/20260505-narrative-experiences-app.html
```

Expected: chacune affiche `would-migrate` sans warnings. Si une app affiche `no-boundary-found` ou warnings → migration manuelle nécessaire pour celle-là, voir Task 2.3.

- [ ] **Step 3: Run en mode écriture**

Run:
```
python tools/extract_to_lib.py \
  mcp-plateforme/20260508-mcp-plateforme-app.html \
  measure-roi/20260507-roi-ia-generative-agentique-app.html \
  economie-inference/20260506-economie-inference-app.html \
  modeles-raisonnement/20260506-modeles-raisonnement-app.html \
  narrative-experiences/20260505-narrative-experiences-app.html
```

Expected: chacune affiche `migrated`.

- [ ] **Step 4: Lancer les tests**

Run:
```
node --test tests/
```

Expected: tous les tests passent (référence + 5 nouvelles apps en green, 8 apps restantes skipped).

- [ ] **Step 5: Vérification visuelle**

Lance le serveur local :
```
python -m http.server 8000
```

Ouvrir 2 des apps migrées (au moins) et vérifier la même checklist que Task 1.8 step 7.

Si une app présente une régression visuelle → identifier le bloc CSS/JS spécifique non couvert par le pattern, traiter à la main, ajouter un test ou ajuster le script.

- [ ] **Step 6: Commit (un commit par app pour traçabilité)**

```bash
git add mcp-plateforme/20260508-mcp-plateforme-app.html
git commit -m "refactor(mcp-plateforme/app): migrer vers /assets/dossier-app

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"

git add measure-roi/20260507-roi-ia-generative-agentique-app.html
git commit -m "refactor(measure-roi/app): migrer vers /assets/dossier-app

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"

git add economie-inference/20260506-economie-inference-app.html
git commit -m "refactor(economie-inference/app): migrer vers /assets/dossier-app

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"

git add modeles-raisonnement/20260506-modeles-raisonnement-app.html
git commit -m "refactor(modeles-raisonnement/app): migrer vers /assets/dossier-app

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"

git add narrative-experiences/20260505-narrative-experiences-app.html
git commit -m "refactor(narrative-experiences/app): migrer vers /assets/dossier-app

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task 2.3 — Traitement manuel des apps refusées par le script

**Files:**
- Modify: les apps qui ont eu `no-boundary-found` ou des warnings (s'il y en a)

- [ ] **Step 1: Identifier les apps problématiques**

Si le step 2 de Task 2.2 a affiché des warnings ou `no-boundary-found` sur certaines apps, listées-les ici.

- [ ] **Step 2: Pour chaque app problématique, comparer avec la référence**

Run pour chaque app :
```
diff <(sed -n '2998,3387p' observabilite-agents-ia/20260430-observabilite-agents-ia-app.html.bak) \
     <(sed -n '<X>,<Y>p' <app-problematique>)
```

(Tu auras besoin de récupérer le bloc original de référence depuis le commit pré-migration, ou via `git show HEAD~5:observabilite-agents-ia/...-app.html`.)

Identifier les divergences :
- Si juste de la dérive de whitespace/commentaires → forcer la migration manuellement (cut + paste des `<script src>` + `<link rel>` + suppression des blocs).
- Si vraie divergence logique (ex. cette app a une fonction custom en plus) → décider si la fonction doit rejoindre la lib (mettre à jour `dossier-app.js` + le contrat de tests) ou rester inline (garder une exception documentée).

- [ ] **Step 3: Migrer manuellement chaque app problématique**

Suivre la même procédure que Task 1.8 (steps 1-7) pour chaque app, en partant du résultat du dry-run comme guide.

- [ ] **Step 4: Re-run les tests**

```
node --test tests/
```

Expected: les 6 apps (référence + 5 batch) passent. Les apps problématiques traitées passent aussi si elles ont été correctement migrées.

- [ ] **Step 5: Commit chaque app problématique**

Si applicable, un commit par app avec message du type `refactor(<dossier>/app): migrer manuellement vers /assets/dossier-app — divergences <X>`.

### Task 2.4 — Push + PR Phase 2

- [ ] **Step 1: Vérifier le diff complet**

```bash
git log --oneline main..HEAD
git diff main..HEAD --stat
```

- [ ] **Step 2: Push**

```bash
git push -u origin claude/dossier-app-library-batch-1
```

- [ ] **Step 3: Ouvrir la PR via MCP GitHub**

Title: `refacto: migrer 5 apps vers /assets/dossier-app (Phase 2)`

Body :

```markdown
## Quoi

Phase 2 de la mutualisation `dossier-app`. Cette PR :
- Ajoute `tools/extract_to_lib.py` (script Python idempotent) + tests unitaires.
- Migre 5 apps vers la lib via le script :
  - `mcp-plateforme`
  - `measure-roi`
  - `economie-inference`
  - `modeles-raisonnement`
  - `narrative-experiences`
- (Si applicable) Migre manuellement les apps refusées par le script avec leurs spécificités documentées en commit message.

## Pourquoi

Spec : `docs/superpowers/specs/2026-05-09-dossier-app-library-design.md`. Suite de PR #<numero PR 1>.

Suite à PR 1 (référence + lib + tests), cette PR commence à amortir l'investissement en migrant 5 apps de plus.

## Test plan

- [x] `node --test tests/` passe localement (6 apps green, 8 apps skipped).
- [x] CI Actions passe.
- [x] Vérification visuelle de 2 apps migrées au moins :
  - Zoom, modal, citations, mobile panels, sources collapse, sigil OK.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

**STOP — attendre validation et merge avant Phase 3.**

---

## Phase 3 — PR 3 : Apps restantes + skill template + CLAUDE.md

À la fin de cette phase : les 14 apps utilisent toutes la lib, la skill `illustrated-deep-research` génère des apps qui héritent du pattern, CLAUDE.md documente la lib.

**Préalable** : PR 2 mergée. `git checkout main && git pull && git checkout -b claude/dossier-app-library-batch-2`.

### Task 3.1 — Lister les apps restantes

- [ ] **Step 1: Identifier les apps non-migrées**

Run:
```
for f in */2026*-app.html; do
  if grep -q '/assets/dossier-app.js' "$f"; then
    echo "[migrated] $f"
  else
    echo "[pending]  $f"
  fi
done
```

Liste les apps `[pending]` — il devrait en rester 8.

### Task 3.2 — Migrer les apps restantes via le script

**Files:**
- Modify: les 8 apps restantes

- [ ] **Step 1: Dry-run sur toutes**

Run:
```
python tools/extract_to_lib.py --dry-run --all
```

Expected: les 6 déjà migrées affichent `already-migrated`, les 8 restantes affichent `would-migrate` (ou warnings si dérive).

- [ ] **Step 2: Run en mode écriture**

```
python tools/extract_to_lib.py --all
```

Expected: les 8 affichent `migrated`.

- [ ] **Step 3: Tests**

```
node --test tests/
```

Expected: les 14 apps passent.

- [ ] **Step 4: Vérification visuelle de 3 apps au hasard**

Lance le serveur local et ouvre 3 apps parmi les 8 nouvellement migrées. Checklist visuelle (cf. Task 1.8 step 7).

- [ ] **Step 5: Commit (groupé pour les apps qui ont migré sans warning)**

```bash
git add <les 8 apps migrées>
git commit -m "refactor: migrer 8 apps restantes vers /assets/dossier-app

Liste : <noms des dossiers>. Toutes via tools/extract_to_lib.py
idempotent. Vérification visuelle ad hoc sur 3 apps.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task 3.3 — Aligner le template de la skill

**Files:**
- Modify: `.claude/skills/illustrated-deep-research/assets/app-template.html`

- [ ] **Step 1: Lire le template actuel**

```
wc -l .claude/skills/illustrated-deep-research/assets/app-template.html
```

Le template fait actuellement ~1583 lignes (cf. exploration initiale du spec). On vise une réduction proportionnelle à la migration des apps : ~400 lignes JS supprimées, ~250-400 lignes CSS supprimées.

- [ ] **Step 2: Appliquer la même migration au template**

Le template est structuré comme une app vide (placeholders `{{TITLE}}`, etc.). Lui appliquer le script :

```
python tools/extract_to_lib.py --dry-run .claude/skills/illustrated-deep-research/assets/app-template.html
```

Si dry-run dit `would-migrate` → run sans `--dry-run`.

Si refusé → migration manuelle (probablement pour cause de placeholders qui cassent le pattern).

- [ ] **Step 3: Vérifier que le template reste fonctionnel**

Le template doit pouvoir générer une app valide qui passe les tests. Pour le vérifier :
- Substituer mentalement les placeholders par des valeurs bidons.
- Confirmer que la structure résultante embarque bien `<link>` et `<script src>` de la lib.

- [ ] **Step 4: Commit (avec `git add -f` à cause du .gitignore qui couvre `.claude/`)**

```bash
git add -f .claude/skills/illustrated-deep-research/assets/app-template.html
git commit -m "refactor(skill): app-template.html utilise /assets/dossier-app

Les futures apps générées via la skill illustrated-deep-research
embarquent le pattern par défaut, plus besoin de copier-coller
~700 lignes de pattern à chaque rapport.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task 3.4 — Mettre à jour CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Lire CLAUDE.md, repérer où insérer**

Run:
```
grep -n "^## " CLAUDE.md
```

Identifier où insérer une nouvelle section. Recommandé : juste après "## Apps interactives — sidebars Sommaire/Sources" et avant "## Structure du repo".

- [ ] **Step 2: Insérer la section "Bibliothèque partagée /assets/dossier-app"**

Insérer dans `CLAUDE.md` :

```markdown
## Bibliothèque partagée `/assets/dossier-app.{js,css}`

**Source unique de vérité** pour le comportement et le style des patterns récurrents des apps deep-research (`*/2026*-app.html`) : zoom plein écran, modal SCHEMAS, citations highlight, TOC observer, mobile panels, sources collapse desktop, sigil MG, topbar scroll, tooltips terms.

- **`/assets/dossier-app.js`** (~400 lignes) — IIFE auto-bootstrap qui lit `window.SCHEMAS` et trouve les éléments DOM par ID conventionnel. Aucune API publique.
- **`/assets/dossier-app.css`** (~300 lignes) — patterns structurels uniquement. Les variables de thème (`--paper`, `--accent`, `--ink`, `--carmine`…) restent définies par chaque page sur `:root`.

**Inclusion dans une app** :

```html
<!-- Dans <head>, après les Google Fonts -->
<link rel="stylesheet" href="/assets/dossier-app.css">

<!-- Dans <body>, juste avant </body> -->
<script src="/assets/dossier-app.js" defer></script>
```

**Contrat DOM** (la page doit fournir ces IDs/sélecteurs, sinon le bloc concerné se désactive silencieusement) :

| Pattern | IDs / sélecteurs requis |
|---|---|
| Zoom | `#zoom-overlay`, `#zoom-stage`, `#zoom-content`, `.zoom-close`/`.zoom-in`/`.zoom-out`/`.zoom-reset` |
| Modal | `#modal-root`, `#modal-eyebrow`, `#modal-title`, `#modal-body`, `[data-close]` |
| TOC + Sources | `#toc`, `#sources`, `#toggle-toc`, `#toggle-sources`, `.panel-close` |
| Sources collapse | `#sources-collapse-btn`, `#sources-expand-btn`, `.layout` |
| Topbar | `#topbar` |
| Citations | `.cite[data-cite="N"]` → `#source-N` (li dans `#sources`) |
| Schémas | `figure.figure > svg`, `svg[data-schema-id]`, `.interactive[data-card="..."]` |
| Tooltips | `.term` |

**Donnée requise inline** :

```html
<script>
  const SCHEMAS = { /* schema-id: { card-id: { title, body, eyebrow } } */ };
  const SOURCES = [ /* { n, citation, url, accessed } */ ];
  window.SCHEMAS = SCHEMAS;
</script>
```

**Modifier la lib** :

1. Éditer `/assets/dossier-app.js` ou `.css`.
2. Si une nouvelle fonction publique est ajoutée, mettre à jour `tests/fixtures/expected-fns.json` pour qu'elle soit checkée par les tests.
3. Idem pour les sélecteurs CSS / IDs : `tests/fixtures/expected-ids.json`.
4. Re-run `node --test tests/` localement.
5. Sur PR, vérifier visuellement 2-3 apps représentatives (les patterns peuvent avoir des effets de bord visuels).

**Migration d'une nouvelle app** :

Le script `tools/extract_to_lib.py` est idempotent et fait le boulot pour les apps qui suivent le pattern :

```
python tools/extract_to_lib.py path/to/app.html
```

Pour les apps qui dérivent du pattern → migration manuelle, voir le code de `migrate_app()` pour comprendre les étapes.

**Tests CI** :

`node --test tests/` tourne sur PR + push à main via `.github/workflows/test.yml`. Zéro dépendance, run < 5 secondes.
```

- [ ] **Step 3: Ajouter une note dans la section "Création de PR" ou "Workflow"**

Si pertinent (à apprécier selon contexte), mentionner que les apps doivent passer la suite de tests avant merge.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(CLAUDE.md): documenter la bibliothèque /assets/dossier-app

Section Bibliothèque partagée — contrat DOM, donnée requise,
procédure de modification, lien avec le script de migration et
les tests CI.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task 3.5 — Validation finale + push + PR Phase 3

- [ ] **Step 1: Run la suite complète**

```
node --test tests/
python tools/test_extract_to_lib.py
```

Expected: tout passe.

- [ ] **Step 2: Mesurer la déduplication**

```
wc -l */2026*-app.html
wc -l assets/dossier-app.js assets/dossier-app.css
```

Comparer avec la baseline (cf. spec, ~51 330 total avant) — le total des apps doit avoir baissé de ~10 000 lignes, contrebalancé par ~600-800 lignes ajoutées dans `assets/`.

- [ ] **Step 3: Push**

```bash
git push -u origin claude/dossier-app-library-batch-2
```

- [ ] **Step 4: Ouvrir la PR via MCP GitHub**

Title: `refacto: migrer 8 apps restantes + skill template + CLAUDE.md (Phase 3 — finale)`

Body :

```markdown
## Quoi

Phase 3, finale. Cette PR :
- Migre les 8 apps restantes vers `/assets/dossier-app` via `tools/extract_to_lib.py`.
- Aligne `.claude/skills/illustrated-deep-research/assets/app-template.html` sur le même pattern (les futurs rapports héritent de la lib).
- Documente la lib dans CLAUDE.md (contrat, modification, migration, tests).

## Pourquoi

Spec : `docs/superpowers/specs/2026-05-09-dossier-app-library-design.md`. Suite de PRs #<PR1> et #<PR2>.

À la fin de cette PR, les 14 apps `*/2026*-app.html` utilisent toutes la lib. Plus de duplication massive.

## Mesure

- Avant : ~51 330 lignes total dans `*/2026*-app.html`.
- Après : ~41 000 lignes total + ~700 lignes dans `/assets/`.
- Net : ~10 000 lignes de duplication retirées.

## Test plan

- [x] `node --test tests/` passe (14 apps green, 0 skipped).
- [x] `python tools/test_extract_to_lib.py` passe.
- [x] CI Actions passe.
- [x] Vérification visuelle de 3 apps migrées au hasard.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

**Fin de l'implémentation.** Mathieu merge à la main quand satisfait.

---

## Self-review (à faire en cours d'implémentation, pas pré-publié)

Quand toutes les phases sont mergées, faire un dernier sanity check :
- [ ] Les 14 apps embarquent `<script src="/assets/dossier-app.js">` et `<link rel="stylesheet" href="/assets/dossier-app.css">`.
- [ ] Aucune app ne contient `function setupZoom`, `function setupSourcesToggle`, etc., en inline.
- [ ] Le rendu visuel et comportemental est inchangé sur un échantillon de 4-5 apps couvrant des dossiers variés.
- [ ] CLAUDE.md mentionne la lib avec son contrat.
- [ ] La skill `illustrated-deep-research` génère désormais des apps qui héritent de la lib d'office.
- [ ] La suite de tests CI passe sur `main`.
