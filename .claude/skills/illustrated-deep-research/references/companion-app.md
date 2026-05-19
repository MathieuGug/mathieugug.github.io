# Companion HTML App — Architecture

The companion app is **a single standalone `.html` file** that opens directly from disk (`file://` protocol). It mirrors the report content and embeds the same SVG schemas, but adds:

- Click-to-open **modals** on schema regions (detail-on-demand)
- **Tooltips** on obscure terms in the body and modal text
- A **right sidebar** showing the full source list, where each in-text citation `[N]` is clickable and scrolls/highlights the corresponding source

No build step. No npm. No React. Single file. Light mode.

---

## Layout

Three-column grid on desktop, collapsible on narrow viewports:

```
┌───────────────────────────────────────────────────────────────────┐
│ HEADER (full width): title • date • download report MD link      │
├───────────┬───────────────────────────────────────┬───────────────┤
│           │                                       │               │
│   TOC     │           REPORT BODY                 │   SOURCES     │
│ (left)    │     prose + inline interactive SVGs   │   (right)     │
│           │                                       │               │
│ sticky    │           scrollable                  │   sticky      │
│ ~220px    │           ~720–840px max width        │   ~320px      │
│           │                                       │               │
└───────────┴───────────────────────────────────────┴───────────────┘
```

Below `1024px`: TOC collapses to a top hamburger; sources sidebar collapses to a bottom-sheet trigger. **Both panels MUST embed a `.panel-close` button** so a mobile reader who opened the panel can dismiss it — see "Mobile-friendliness & panel close" below.

On desktop, the sources sidebar can also be **collapsed via a small edge toggle** anchored to its top-left edge (`#sources-collapse-btn`). When collapsed, a mirrored toggle (`#sources-expand-btn`) is pinned to the right edge of the viewport. The state is persisted per-page in `localStorage`, so a reader who prefers the sidebar hidden keeps that preference across reloads. The collapsed state is overridden automatically when the user clicks an in-text citation — the sidebar re-expands so the highlighted source is visible.

Each schema also gets a **fullscreen zoom mode**: hovering a `.figure` reveals a small ⛶ button in the upper right; clicking it lifts the SVG into a full-viewport overlay with wheel/pinch zoom, drag-to-pan, and `+`/`-`/`0`/`Esc` keyboard shortcuts. The overlay clones the SVG (so the original in-page interactive regions are unaffected), and the original modal/citation/tooltip systems remain accessible from inside the report body. The zoom overlay is at `z-index: 80`; mobile TOC/sources panels at `90`; the sidebar expand button at `70`; the schema modal at `100`; the tooltip floater at `110` — keep this stack order if you add new overlays.

---

## Mobile-friendliness & panel close (non-negotiable)

Two failure modes have repeatedly bitten this template before being fixed in the upstream apps. Both must be prevented in every shipped HTML — they are also enforced by `CLAUDE.md` of the personal site (mathieugug.github.io).

### 1. Panel close on mobile

Below `1024px`, `#toc.open` and `#sources.open` cover the full viewport. Without an in-panel close button, a mobile reader who opens either panel has no way back to the report (no header is visible). The required pattern is **three-part**:

- **CSS** (inside `@media (max-width: 1024px)`): `.panel-close` becomes `position: fixed; top: 16px; right: 16px; z-index: 91`, displayed only when its parent panel is `.open`. The opened panel must use `padding: 64px 24px 24px` (top padding so content doesn't sit under the close button). Outside the media query, `.panel-close { display: none; }`.
- **HTML**: a `<button class="panel-close" type="button" aria-label="Fermer le sommaire">Fermer ✕</button>` as the **first child** of `<nav id="toc">`, and the same with `aria-label="Fermer les sources"` as the first child of `<aside id="sources">`.
- **JS** — two handlers:
  ```js
  // 1) The button itself
  document.querySelectorAll('.panel-close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('#toc, #sources')?.classList.remove('open');
    });
  });
  // 2) Escape closes any open panel — but yields to zoom and modal,
  // which have their own Esc handlers. Without these guards, pressing
  // Esc inside a fullscreen schema would close both at once.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const zoom  = document.getElementById('zoom-overlay');
    const modal = document.getElementById('modal-root');
    if (zoom && !zoom.hidden) return;
    if (modal && !modal.hidden) return;
    const open = document.querySelector('#toc.open, #sources.open');
    if (open) { e.preventDefault(); open.classList.remove('open'); }
  });
  ```

Reference implementation: `proces-musk-altman/20260427-proces-musk-altman-app.html` in the host repo (`grep -n panel-close`). The skill's `assets/app-template.html` already ships these three pieces — keep them in.

### 2. Mobile typography lives in the **same** `@media (max-width: 1024px)` block

Putting header/main mobile typography in a separate `@media (max-width: 640px)` block looks fine in a phone simulator but breaks in real life: Chrome's "Desktop site" mode on Android and iOS reports a viewport width of `≥ 980px`, so a `@640px` rule never fires and the report stays at desktop sizing — unreadable. Keep all of these rules inside the same `@1024px` block:

```css
@media (max-width: 1024px) {
  .layout { grid-template-columns: minmax(0, 1fr); }
  /* ... panel-close rules above ... */
  header.site { padding: 14px 16px; gap: 10px; flex-wrap: wrap; }
  header.site h1 { font-size: 1.05rem; min-width: 0; overflow-wrap: break-word; word-break: break-word; }
  header.site .back { font-size: 0.7rem; letter-spacing: 0.08em; }
  main#report { padding: 28px 18px 56px; max-width: 100%; min-width: 0; }
  main h1.report-title { font-size: 1.8rem; word-break: break-word; }
  main#report > .lead { font-size: 1.02rem; }
  main h2 { font-size: 1.25rem; word-break: break-word; }
  main h3 { font-size: 1.05rem; }
  main p, main ul, main ol { overflow-wrap: break-word; word-break: break-word; }
  .figure { max-width: 100%; overflow: hidden; }
  .figure svg { width: 100%; max-width: 100%; height: auto; }
}
```

Plus the defensive rule at the document root (outside any media query):

```css
html, body { margin: 0; padding: 0; max-width: 100vw; }
body { overflow-x: hidden; /* ... */ }
.layout { /* ... */ overflow-x: clip; }
```

`overflow-x: clip` on `.layout` alone is **not** enough when an absolute-positioned element (e.g., `#sources-expand-btn`) lives outside the layout grid — `body { overflow-x: hidden }` is the belt to the layout's suspenders.

### 3. `<pre>` and inline `<code>` MUST scroll, not push

Long formulas, JSON snippets, or XML prompts inside `<pre>` will push the page wider than the viewport on mobile if left unstyled. Long inline identifiers and URLs inside `<code>` do the same. Three rules to ship in every app, even if the current report has none of these elements (the next iteration will):

```css
main code { overflow-wrap: anywhere; /* + the existing inline code styling */ }
main pre {
  margin: 1.5rem 0; padding: 14px 16px;
  background: var(--paper-2); border-radius: 4px;
  overflow-x: auto; max-width: 100%;
  font-size: 0.85em; line-height: 1.5;
  -webkit-overflow-scrolling: touch;
}
main pre code {
  background: transparent; padding: 0; border-radius: 0;
  font-size: 1em;
  overflow-wrap: normal;  /* override the inline rule — preserve <pre> line breaks so the horizontal scrollbar appears */
}
/* Stabilo / signature highlighter — markdown ==text== renders to <mark>. */
main mark {
  background: linear-gradient(transparent 58%, rgba(178, 59, 27, 0.14) 58%);
  color: inherit;
  padding: 0 2px;
}
```

The `overflow-wrap: normal` reset on `pre code` is the subtle one: without it, the `anywhere` rule from `main code` cascades in, breaks every long line in the `<pre>`, and the horizontal scrollbar disappears (because nothing is wider than the viewport anymore — but the content is now an unreadable block).

The `main mark` rule renders the site's signature stabilo: a soft carmine gradient that only tints the bottom half of the text, mimicking a felt-tip highlighter stroke. In markdown source, write `==text==` (Obsidian highlight syntax) — most markdown converters emit `<mark>text</mark>` and the rule kicks in. Use sparingly — one or two key claims per section, not every other sentence. Pattern of origin: `gouvernance/20260421-pitch-gouvernance-agentic.html`.

### 4. `← Retour aux dossiers` back link in the header

Per the host site's `CLAUDE.md`, every published page (hub, app, scrolly, livre, journal) embeds a back link pointing to `../index.html#series` with the label `← Retour aux dossiers`. For the companion app, it goes at the **very start** of `<header class="site">`, just before `<span class="marker">`, with class `.back`. The styling is mono, `letter-spacing: 0.08–0.12em`, `text-transform: uppercase`, dim color shifting to `--carmine` on hover. The skill's template already ships this — only delete it if the deliverable is meant to be a pure standalone download with no host site (rare).

### 5. State-aware figure breakout on desktop (readability without sidebar overlap)

On desktop (`min-width: 1025px`), `.figure` elements **break out of `main#report`'s 760 px column to grab as much horizontal space as the layout allows**, **stopping precisely at the visible sidebars**. The pattern is **state-aware**: when the user collapses the Sources panel via its edge toggle, schemas widen to claim the freed-up space.

The `.layout` grid is **uncapped** — it spans the entire viewport (no `max-width: 1440px; margin: 0 auto`), so the TOC sticks to the viewport's left edge, the Sources panel sticks to the right edge, and the main-cell fills everything in between. `main#report` stays centered at 760 px max within the main-cell, so the body text width is constant; only schemas grab the extra space. Two states:

- **Default (Sources panel expanded)**: figure fills the main-cell entirely — between TOC's right edge and Sources' left edge. At 1320 px viewport the figure equals main (760 px). At 1440 px: 880 px. At 1920 px: 1360 px.
- **`.layout.sources-collapsed` (Sources panel collapsed)**: figure extends from TOC's right edge to the viewport's right edge. At 1920 px: 1680 px.

The text body keeps its 760 px max for readability in both states. **Neither the TOC nor the visible Sources sidebar is overlapped** — that was a deliberate constraint after observing that schemas with `width: 100vw` painted their `var(--paper)` background over the TOC items, visually clipping them. The figure transitions smoothly between states (280 ms ease, matching the layout's grid-template-columns transition).

```css
@media (min-width: 1025px) {
  /* Default state (sources panel expanded): figure spans the main-cell. */
  .figure {
    margin-left: calc(-1 * max(0px, (100vw - 1320px) / 2 + 48px));
    margin-right: calc(-1 * max(0px, (100vw - 1320px) / 2 + 48px));
    transition: margin-left 280ms ease, margin-right 280ms ease;
    padding-left: clamp(16px, 3vw, 48px);
    padding-right: clamp(16px, 3vw, 48px);
    border-radius: 0;
  }
  /* Sources panel collapsed: figure extends from TOC's right edge to viewport's right. */
  .layout.sources-collapsed .figure {
    margin-left: calc(-1 * max(0px, (100vw - 904px) / 2));
    margin-right: calc(-1 * max(0px, (100vw - 904px) / 2));
  }
  .figure-caption {
    max-width: 760px;
    margin-left: auto;
    margin-right: auto;
    padding: 0 48px;
  }
}
```

Note: `width` is **not** set — it's `auto`, and the negative symmetric margins make the figure expand outward symmetrically from `main#report`'s content edges. The browser computes the resulting width as `main_content_width + |margin-left| + |margin-right|`, which conveniently equals the main-cell width (default) or the `[TOC-right, viewport-right]` span (collapsed).

**Math (so future readers can adapt the formulas):**

Assumed layout: `.layout { grid-template-columns: 240px minmax(0, 1fr) 320px }` (uncapped, full viewport). Collapsed state: `.layout.sources-collapsed { grid-template-columns: 240px minmax(0, 1fr) 0 }`. `main#report { max-width: 760px; margin: 0 auto; padding: 56px 48px 96px }`. So `main#report` content area is `760 - 96 = 664 px` wide.

**Default (sources expanded), grid `240 | 1fr | 320`:**
- main-cell width = `100vw - 560`
- `main#report` is centered in main-cell → distance from main's outer edge to main-cell's edge = `(main-cell - 760) / 2 = (100vw - 1320) / 2`
- main has `padding: 0 48px` inside, so distance from main's content edge to main-cell's edge = `(100vw - 1320) / 2 + 48`
- To pull the figure's edge from main's content edge to main-cell's edge: `margin-inline = -((100vw - 1320) / 2 + 48)`, clamped to 0 with `max(0px, …)` on viewports below 1320 px (where main-cell ≤ 760, main fills it, no centering offset)
- Figure width (computed) = `664 + 2 × |margin| = 664 + (100vw - 1224) = 100vw - 560` ✓ matches main-cell width

**Sources collapsed, grid `240 | 1fr | 0`:**
- main-cell width = `100vw - 240`
- `main#report` is centered in main-cell → main is asymmetric in the viewport (more space on its right than its left)
- Distance from main's content edge to main-cell's edge = `(main-cell - 760) / 2 + 48 = (100vw - 1000) / 2 + 48 = (100vw - 904) / 2`
- Symmetric margin `-((100vw - 904) / 2)` works because the negative-margin symmetry around main exactly cancels main's asymmetric centering within the asymmetric main-cell
  - Figure left = `main_content_left - |margin| = 240` (TOC's right edge) ✓
  - Figure right = `main_content_right + |margin| = 100vw` (viewport's right edge) ✓
- Figure width = `664 + (100vw - 904) = 100vw - 240` ✓ matches main-cell width

The 280 ms transition matches the layout's `grid-template-columns: 280ms ease` so figure and sidebars animate in lockstep when the user toggles the panel.

**Trade-offs and pitfalls:**
- This pattern assumes the standard `header.site` + `main#report` + sidebars layout, with the layout **uncapped** (no `max-width: 1440px` on `.layout`). If you change the grid columns (wider TOC, narrower Sources) or `main#report`'s max-width / padding, recompute the magic constants `1320` and `904`:
  - `1320 = TOC + main-max + sources = 240 + 760 + 320` (default state breakpoint where main starts being centered)
  - `904 = TOC + main-max + 2 × main-padding = 240 + 760 + 96` (collapsed state same idea)
- On viewports between 1025 and 1320 (default state), `main#report` already fills the cell (no centering offset), so the inner `(100vw - 1320) / 2 + 48` is negative-or-small; the `max(0px, …)` clamps the negative case to 0 and you get `margin-inline: 0`. Correct, but worth knowing if you debug a narrow desktop browser.
- The pattern requires `body { overflow-x: hidden }` (shipped via the mobile-friendliness defensive overflow above). Defensive — this CSS shouldn't actually trigger overflow if the math is right.
- Below `1025px`, the layout collapses to a single column. Figures naturally fill the column, no override needed.
- **Don't reintroduce `max-width: 1440px; margin: 0 auto` on `.layout`** — it caps the grid mid-viewport on 1440+ screens, leaves empty bands on the sides, and pushes the Sources collapse button (`right: 320px`) off the panel's left edge. The uncapped layout is the load-bearing assumption of these formulas.

For narrative/journal pages with a simple `.wrap { max-width: 760px }` (no grid, no sidebars), the simple `calc(50% - 50vw)` pattern works pixel-perfectly because the parent IS centered in the viewport. Reference: `proces-musk-altman/journal.html` on the host site.

---

## File structure (single HTML)

```
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{Title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?
        family=Spectral:ital,wght@0,400;0,600;1,400&
        family=Inter:wght@400;500;600&
        family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style> /* all CSS inline */ </style>
</head>
<body>
  <header>...</header>
  <nav id="toc">...</nav>
  <main id="report">
    <!-- prose with inline SVGs and citation links -->
  </main>
  <aside id="sources">...</aside>
  <div id="modal-root" hidden>...</div>
  <script>
    const SCHEMAS = { /* schema region modal content */ };
    const TOOLTIPS = { /* term → definition */ };
    const SOURCES = [ /* {n, citation, url, accessed} */ ];
    /* event handlers */
  </script>
</body>
</html>
```

The provided `assets/app-template.html` is a working scaffold. Use it as the starting point.

---

## CSS — editorial light mode

Mirror the SVG palette in CSS so the page and schemas read as one design:

```css
:root {
  --paper:    #FAF8F3;
  --paper-2:  #F2EFE7;       /* sidebar background */
  --ink:      #1A1A1A;
  --graphite: #5A5A5A;
  --mist:     #B8B5AE;
  --rule:     #E5E1D8;
  --carmine:  #B7332C;
  --teal:     #1F5560;
  --mustard:  #B58A2C;

  --serif:    'Spectral', 'Playfair Display', Georgia, serif;
  --sans:     'Inter', system-ui, sans-serif;
  --mono:     'JetBrains Mono', 'IBM Plex Mono', monospace;
}

body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 16px;
  line-height: 1.65;
  margin: 0;
}

main { max-width: 760px; margin: 0 auto; padding: 48px 32px; }
h1, h2, h3 { font-family: var(--serif); font-weight: 600; }
h1 { font-size: 2.4rem; line-height: 1.15; letter-spacing: -0.02em; }
h2 { font-size: 1.55rem; margin-top: 3rem; border-bottom: 1px solid var(--rule); padding-bottom: 0.4rem; }
h3 { font-size: 1.2rem; }

.figure { margin: 2.5rem 0; }
.figure svg { width: 100%; height: auto; display: block; }
.figure-caption { font-size: 0.9rem; color: var(--graphite); font-style: italic; margin-top: 0.6rem; }

/* Interactive SVG regions */
.figure svg .interactive { cursor: pointer; transition: filter 120ms; }
.figure svg .interactive:hover,
.figure svg .interactive:focus-visible {
  filter: drop-shadow(0 0 0 var(--carmine));
  outline: none;
}
.figure svg .interactive:hover rect,
.figure svg .interactive:focus-visible rect,
.figure svg .interactive:hover path,
.figure svg .interactive:focus-visible path { stroke-width: 2.5; }

/* Tooltipped terms — minimal styling on the trigger;
   the actual tooltip is a single body-level #tooltip-floater
   element managed in JS (see "Tooltips" section below). */
.term {
  border-bottom: 1px dotted var(--graphite);
  cursor: help;
}
.term:focus-visible {
  outline: 2px solid var(--carmine);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Citation links */
.cite {
  font-family: var(--mono);
  font-size: 0.75em;
  color: var(--carmine);
  text-decoration: none;
  vertical-align: super;
}
.cite:hover { text-decoration: underline; }

/* Source sidebar entry */
#sources li.highlight {
  background: var(--paper-2);
  outline: 2px solid var(--carmine);
  outline-offset: -2px;
  transition: outline-color 1500ms;
}
```

(The full template in `assets/app-template.html` includes the rest: TOC, sources panel layout, modal, responsive breakpoints.)

### Sticky sources sidebar — common pitfall

The sources sidebar **must stay pinned to the viewport** while the report scrolls. The single `#sources` rule needs `position: sticky; top: 0; align-self: start; height: 100vh` plus the `transition: transform 280ms ease, opacity 200ms ease` (used by the collapse animation) — **all on the same selector**.

Do NOT add a separate `aside#sources { position: relative; … }` rule alongside it. That selector's specificity (id + element = 0,1,1) beats `#sources` alone (0,1,0) and silently overrides `position: sticky`, so the sidebar starts scrolling away with the page content. The collapse button (`#sources-collapse-btn`) is `position: fixed`, anchored to the viewport — the panel itself doesn't need `position: relative` as an anchor.

Symptom when this rule is present: on desktop the sidebar disappears as soon as you scroll past the first viewport. Verify on a long report with a 1080p viewport — the sidebar should stay visible the whole way down.

### Static HTML for sources, not JS-generated

The `<ol id="sources-list">` block must be **populated as static HTML** (one `<li id="source-N">` per source, written directly in the body), not generated at runtime by an IIFE that injects `innerHTML`. The citation click handler depends on `document.getElementById('source-N')` resolving immediately — with JS-generated sources, a click that arrives before the IIFE has run silently does nothing.

### Source entry pattern — `[N]` brackets + full URL displayed

Each `<li>` follows this convention (canonical reference: `llm-jailbreaking/20260428-…-app.html`):

```html
<li id="source-1">
  <span class="cite-num">[1]</span>OWASP Foundation, "OWASP Top 10 for LLM Applications 2025", v4.2.0a, 14 November 2024
  <br><a href="https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf" target="_blank" rel="noopener">https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf</a><span class="accessed">Accessed 2026-04-28</span>
</li>
```

Three load-bearing details:

1. **`[N]` with literal brackets directly in `cite-num`** (not generated via `::before/::after`). The carmine bracketed number is what readers scan for when they follow a citation from the report body, so it must read identically in source HTML and rendered output.
2. **Full URL is the link text, not a short host label.** A short label like `arxiv.org ↗` hides the actual destination — readers can no longer eyeball whether the link points to an arXiv abstract, a PDF, an HTML version, a specific section, or somebody else's mirror. The full URL is the truth. Modern browsers break URLs cleanly at `/` boundaries, and the canonical CSS adds `overflow-wrap: anywhere` as a safety net so even URLs without separators don't push the sidebar wider than 320 px.
3. **`<br>` before the URL anchor** forces the link onto its own line, separating it visually from the citation prose so the eye lands on it immediately.

Required CSS (one off-the-shelf block, matching the jailbreaking app):

```css
#sources li {
  font-size: 0.82rem;
  line-height: 1.5;
  margin: 0 0 16px;
  padding: 12px 14px;
  border-radius: 4px;
  border: 1px solid transparent;
  transition: border-color 220ms, background 220ms;
}
#sources li .cite-num {
  display: inline-block;
  font-family: var(--mono);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--carmine);
  margin-right: 6px;
}
#sources li a {
  display: inline-block;
  margin-top: 4px;
  color: var(--teal);
  text-decoration: none;
  font-size: 0.78rem;
  overflow-wrap: anywhere;       /* break long URLs cleanly inside the 320 px sidebar */
}
#sources li a:hover { text-decoration: underline; }
#sources li .accessed {
  display: block;
  margin-top: 4px;
  color: var(--mist);
  font-style: italic;
  font-size: 0.74rem;
}
#sources li.highlight {
  background: var(--paper);
  border-color: var(--carmine);
}
```

Older apps may still use the previous `arxiv.org ↗` short-host convention with no-bracket `cite-num`; treat that as legacy — when touching an app's sources for any reason, migrate it to the bracketed `[N]` + full-URL pattern above.

---

## JavaScript — three concerns

### 1. Modal dispatcher

Single event delegation handler on `document`:

```javascript
document.addEventListener('click', (e) => {
  const region = e.target.closest('.interactive[data-card]');
  if (!region) return;

  // Find the parent SVG to identify the schema
  const svg = region.closest('svg[data-schema-id]');
  const schemaId = svg?.dataset.schemaId;
  const cardId = region.dataset.card;

  const card = SCHEMAS[schemaId]?.[cardId];
  if (!card) return;

  openModal(card.title, card.body);
});
```

The `SCHEMAS` object has the structure:

```javascript
const SCHEMAS = {
  'schema-04': {
    'planner-agent': {
      title: 'Planner Agent',
      body: '<p>Le planificateur décompose la tâche utilisateur en arbre de sous-objectifs. Il s\'appuie typiquement sur des traces de type <span class="term" data-tooltip="Chain-of-Thought : raisonnement étape par étape verbalisé">CoT</span> ou <span class="term" data-tooltip="Reasoning + Acting : alternance entre pensée et action outillée">ReAct</span>...</p><p>Implémentations notables : ...</p>'
    },
    'executor-agent': { ... },
    // one entry per data-card in the schema
  },
  'schema-05': { ... },
};
```

Modal HTML structure (the dispatcher fills in):

```html
<div id="modal-root" hidden role="dialog" aria-modal="true">
  <div class="modal-backdrop"></div>
  <div class="modal-card">
    <button class="modal-close" aria-label="Fermer">×</button>
    <h3 class="modal-title"></h3>
    <div class="modal-body"></div>
  </div>
</div>
```

Close on backdrop click, on `Escape` key, and on the close button.

### 2. Tooltips on terms

### 2. Tooltips on terms

Tooltips use a single floating element appended to `<body>`, **not** CSS pseudo-elements. This was a deliberate change after observing that pseudo-elements get trapped inside the modal-card's `overflow-y: auto` (which forces `overflow-x: auto` per spec): a tooltip extending past the modal's right edge would create a horizontal scrollbar inside the modal and clip the tooltip text. With a body-level `#tooltip-floater` in `position: fixed`, the tooltip escapes every scroll container and clamps to viewport edges.

```javascript
(function setupTooltipFloater() {
  const floater = document.createElement('div');
  floater.id = 'tooltip-floater';
  floater.setAttribute('role', 'tooltip');
  floater.hidden = true;
  document.body.appendChild(floater);

  let activeTerm = null;
  let pinned = false;

  function show(term) {
    floater.textContent = term.dataset.tooltip;
    floater.hidden = false;
    activeTerm = term;
    position();
  }
  function hide() { floater.hidden = true; activeTerm = null; }

  function position() {
    const r = activeTerm.getBoundingClientRect();
    floater.style.left = floater.style.top = '0px'; // reset before measuring
    const tip = floater.getBoundingClientRect();
    const margin = 8;
    let top = r.top - tip.height - margin;
    let side = 'top';
    if (top < margin) { top = r.bottom + margin; side = 'bottom'; }
    let left = r.left + r.width/2 - tip.width/2;
    left = Math.max(margin, Math.min(left, window.innerWidth - tip.width - margin));
    floater.style.setProperty('--arrow-x', `${(r.left + r.width/2) - left}px`);
    floater.dataset.side = side;
    floater.style.left = `${left}px`;
    floater.style.top = `${top}px`;
  }
  // hover/focus/click delegated at document level, repositions on scroll/resize
})();
```

Three things to remember when invoking this pattern:

1. **The trigger element only needs `class="term"` and `data-tooltip="…"`**. No inline styles, no pseudo-elements, no `position: relative` on the term. The floater is created and managed entirely by JS.
2. **Positioning is recomputed on every `show()`** — and on `scroll`/`resize` while a tooltip is visible. This means the tooltip stays correctly anchored when the modal scrolls, the viewport rotates, or the user pans/zooms a fullscreen schema.
3. **Click-to-pin is preserved** for mobile usability: tapping a term reveals AND latches the tooltip; tapping outside (or the same term again, or pressing Esc) unlatches it. Hover overrides pinned state in the sense that hovering a different term replaces the visible tooltip — but doesn't touch the pinned latch.

The `TOOLTIPS` dictionary is the single source of truth for term definitions. When generating the body HTML, replace each `{tooltip:term}` marker (from the workflow drafting phase) with:

```html
<span class="term" data-tooltip="{TOOLTIPS[term]}">{term}</span>
```

The same pattern works inside modal `body` strings — you can tooltip terms in modal content and they'll work correctly because the floater is at body level, not inside the modal's overflow context.

### 3. Sources sidebar

Each in-text citation becomes a link with `data-cite="N"`:

```html
…le marché global atteindrait 47 G$ d'ici 2027<a class="cite" data-cite="3" href="#source-3">[3]</a>.
```

Click handler scrolls to and briefly highlights the source entry:

```javascript
document.addEventListener('click', (e) => {
  const cite = e.target.closest('.cite[data-cite]');
  if (!cite) return;
  e.preventDefault();
  const n = cite.dataset.cite;
  const li = document.getElementById('source-' + n);
  if (!li) return;
  li.scrollIntoView({ behavior: 'smooth', block: 'center' });
  li.classList.add('highlight');
  setTimeout(() => li.classList.remove('highlight'), 2200);
});
```

The handler also has two extra branches: on mobile (≤1024px) it opens the bottom-sheet sources panel; on desktop, if the sidebar is currently collapsed (`.layout.sources-collapsed`), it triggers the expand button and delays the scroll by ~320ms to let the slide-out transition finish before scrolling.

The sources sidebar is rendered from the `SOURCES` array:

```javascript
const SOURCES = [
  {
    n: 1,
    citation: 'Anthropic, "Building effective agents", whitepaper, December 2024.',
    url: 'https://www.anthropic.com/research/building-effective-agents',
    accessed: '2026-04-12'
  },
  // ...
];
```

Rendered as:

```html
<aside id="sources">
  <button id="sources-collapse-btn" class="sidebar-edge-toggle" ...>›</button>
  <div class="sources-inner">
    <h2>Sources</h2>
    <ol>
      <li id="source-1">
        <span class="cite-num">1</span>
        Anthropic, « Building effective agents », whitepaper, December 2024.
        <a href="https://..." target="_blank" rel="noopener">Lien ↗</a>
        <span class="accessed">Consulté le 2026-04-12</span>
      </li>
      ...
    </ol>
  </div>
</aside>
```

Note the inner wrapper `.sources-inner` and the absolute-positioned collapse button at the top-left edge — these are required for the desktop collapse pattern (see "4. Sidebar collapse" below).

### 4. Fullscreen schema zoom

Every `.figure` automatically gets a small ⛶ button injected at runtime (no markup required at template-fill time — the button is created by JS, attached to each figure that contains an SVG). Clicking it clones the SVG into a fullscreen `#zoom-overlay` and gives the user:

- **Wheel** to zoom in/out toward the cursor
- **Drag** to pan
- **Pinch** to zoom on touch devices
- **Two-finger** scroll on trackpads = wheel
- **Keyboard**: `+` / `-` to zoom, `0` to fit, `Esc` to close
- **Header buttons**: zoom in / zoom out / Reset / close

The overlay clones the SVG (rather than moving it) so the original interactive regions in the report body remain wired up. The clone preserves `viewBox` for crisp zooming. The hint banner ("Wheel to zoom · drag to pan · Esc to close") fades after ~2.6s.

Implementation lives in the `setupZoom()` IIFE in the template. The selector for "what gets a zoom button" is `.figure svg` — every figure that wraps an SVG. If you add a non-SVG figure (e.g., a raster image), it will be skipped automatically.

### 4b. Schema sigil — MG monogram brand mark

Every `.figure` also gets a small **MG monogram badge** injected at runtime in the top-right corner, right next to the schema title. It links to `https://mathieugug.github.io/`. This is the author's brand sigil — same monogram as the favicon (italic Fraunces "MG", paper on carmine), rendered as an inline SVG circle.

Two variants:

- **`.schema-sigil`** — the per-figure badge. Position `absolute; top: 72px; right: clamp(14px, 4vw, 60px)` so it sits at the level of the schema title (≈ y=72 in viewBox units for a 1200-wide landscape SVG). The `top: 72px` value is non-arbitrary: it aligns the badge with the schema title text inside the SVG, so when a reader takes a screenshot of the schema, the sigil ends up in the frame.
- **`.schema-sigil.zoom-sigil`** — the same badge cloned into the `#zoom-stage` (top-right of fullscreen overlay). Higher z-index, stronger drop-shadow to remain readable over the panned SVG.

When the sigil is present, **the `.zoom-btn` moves to top-LEFT** (`left: 8px` instead of `right: 8px`) to leave the top-right empty for the sigil. Don't try to put both in the same corner.

Mobile (`max-width: 640px`) shrinks the badge to 32×32 px and bumps `top` to 28px so it stays visible inside the smaller schema header on a phone.

The static markup in `#zoom-stage` is:

```html
<a class="schema-sigil zoom-sigil" href="https://mathieugug.github.io/" target="_blank" rel="noopener" aria-label="Mathieu Guglielmino — visiter mathieugug.github.io" title="Mathieu Guglielmino · mathieugug.github.io">
  <svg class="sigil-mark" viewBox="0 0 44 44" aria-hidden="true" focusable="false">
    <circle class="sigil-bg" cx="22" cy="22" r="20.5"/>
    <circle class="sigil-ring" cx="22" cy="22" r="17.5"/>
    <g class="sigil-letters"><text x="7.5" y="29">M</text><text x="22" y="29">G</text></g>
  </svg>
</a>
```

The runtime injection IIFE clones the same `<svg.sigil-mark>` into every `<figure.figure>` (skipping figures that already have a sigil — idempotent). Implementation lives near the bottom of the script block in `assets/app-template.html`.

### 5. Sidebar collapse (desktop)

`#sources-collapse-btn` (left edge of the sidebar, only visible on hover/focus per its small footprint) collapses the sidebar by toggling `.sources-collapsed` on the `.layout` grid. The grid template animates from `240px / 1fr / 320px` to `240px / 1fr / 0`, and the sidebar itself slides out via `transform: translateX(100%)`. The mirrored `#sources-expand-btn`, fixed to the right edge of the viewport, brings it back.

The collapsed state is persisted in `localStorage` under a per-page key (`'idr-sources-collapsed:' + location.pathname`), so each report keeps its own preference. This matters because users typically open multiple report apps from the same `file://` directory — a single global key would force them all into the same state.

When a citation is clicked while the sidebar is collapsed, the handler auto-expands it before scrolling (see "3. Sources sidebar" above). This avoids the dead-click pattern where a user clicks `[3]` and nothing visible happens.

Implementation lives in the `setupSourcesToggle()` IIFE in the template.

---

## Wiring the SVGs into the HTML

For each SVG in `images/`:

1. Read the file content
2. Add `data-schema-id="schema-NN"` to the root `<svg>` element (so the dispatcher knows which schema)
3. Inline the entire SVG into the report body inside a `<figure class="figure">` wrapper:

```html
<figure class="figure" id="fig-04">
  <svg data-schema-id="schema-04" viewBox="0 0 1200 800" ...>
    <!-- entire SVG content inline -->
  </svg>
  <figcaption class="figure-caption">
    Schéma 4 — Architecture de référence pour un système multi-agents…
  </figcaption>
</figure>
```

**Don't load SVGs via `<img src>`, `<object>`, or `fetch()`** — these break interactivity (`<img>` blocks JS access to children) or break `file://` access (`fetch()` is blocked by CORS for local files in Chrome/Edge).

---

## Accessibility

- Every interactive SVG region has `tabindex="0"`, `role="button"`, and a meaningful `aria-label`
- The modal has `role="dialog"` and `aria-modal="true"`; focus is trapped inside while open and returned to the trigger on close
- The TOC uses semantic `<nav>` with an `<ol>`
- Sources are an `<ol>` (ordered list) — citation numbers are real list numbers, not bullet decorations
- All interactive elements are keyboard-reachable (Enter/Space activates `data-card` regions)
- The page validates as HTML5 and has `lang="fr"` (or the user's language) on `<html>`

---

## Widgets quiz de compréhension (optionnels)

Les apps deep-research peuvent embarquer des micro-quiz « vérifier sa compréhension » placés à des charnières conceptuelles. Le pattern (CSS + IIFE `setupQuizzes()`) est embarqué par défaut dans `assets/app-template.html` et ne fait rien tant qu'aucune carte `.quiz-card` n'est ajoutée au DOM. **C'est une option d'authoring, pas un défaut.**

> **Authoring path = JSON sidecar.** L'écriture inline des cartes documentée ci-dessous reste valide comme spécification du DOM, mais en pratique tout nouveau quiz doit passer par `assets/insert-quizzes.py` + un `quizzes.json` à côté de l'app. C'est ~4× plus économe en tokens et idempotent (réexécuter le script après une édition JSON ne pollue pas le diff). Voir `references/quiz-authoring.md` pour le schéma JSON, l'invocation, et le contrat d'insertion.

### Quand en mettre, et combien

- **3 à 4 quiz maximum par article**, jamais systématique. Placés où le lecteur peut sortir avec une **fausse intuition** s'il a survolé.
- Une charnière typique : après une distinction conceptuelle contre-intuitive (e.g. exposition vs déplacement, automation vs augmentation), après une statistique souvent mal interprétée, après un scénario que le défaut humain est de simplifier.
- 1 ou 2 questions par carte, jamais plus.
- **Ne pas mettre** : un quiz récap final (transforme le widget en exam et casse le ton calme), un quiz par section (ritualise le geste, perd sa valeur).

### Modalité visuelle

- **Inline expand replié par défaut** : carte sobre `~64 px` insérée en fin de section, dépliable au clic. Pas d'auto-trigger sur scroll, pas de modal bloquant, pas de pastille marginale.
- Marqueur visuel : `border-left: 3px solid var(--carmine)`, fond `var(--paper-2)`, eyebrow mono uppercase `// vérifier sa compréhension`, titre court sérif.
- Pas d'emoji, pas de mascotte, pas de score, pas de barre de progression. Le widget est un outil de relecture, pas un jeu.

### Authoring : HTML inline avec `data-*`

Chaque carte est rédigée à la main dans le `{{REPORT_HTML}}`, juste avant le `<h2>` de la section suivante. Le contenu (stem, options, explications) vit dans le DOM aux côtés de la prose qu'il teste, pas dans une structure de données séparée — l'auteur édite les deux dans la foulée.

```html
<aside class="quiz-card" data-quiz-id="q-NAME" data-anchor="ANCHOR" role="region" aria-labelledby="quiz-title-NAME">
  <header class="quiz-card__head">
    <span class="quiz-card__eyebrow">// vérifier sa compréhension</span>
    <h3 class="quiz-card__title" id="quiz-title-NAME">Titre court</h3>
    <button class="quiz-card__toggle" type="button" aria-expanded="false" aria-controls="quiz-body-NAME">Tester →</button>
  </header>
  <div class="quiz-card__body" id="quiz-body-NAME" hidden>
    <article class="quiz-q" data-mode="multi"><!-- ou data-mode="single" -->
      <fieldset>
        <legend class="quiz-q__stem">Stem de la question. (Plusieurs réponses possibles.)</legend>
        <ul class="quiz-q__options">
          <li>
            <label>
              <input type="checkbox" name="q-NAME-1"><!-- type="radio" si single -->
              <span>Texte de l'option.</span>
            </label>
            <p class="quiz-q__explain" data-correct="true" hidden>Vrai. Phrase d'explication courte qui dit <em>pourquoi</em>. <a href="#ANCHOR">↗ relire §N</a></p>
          </li>
          <!-- … autres options. Pour chaque option, écrire une vraie phrase d'explication, même fausse — c'est ce qui donne sa valeur pédagogique au widget. -->
        </ul>
      </fieldset>
      <button class="quiz-q__check" type="button">Valider</button>
      <div class="quiz-q__verdict" role="status" aria-live="polite" hidden></div>
      <button class="quiz-q__retry" type="button" hidden>Recommencer</button>
    </article>
  </div>
</aside>
```

Règles :

- **`data-mode="single"`** : `<input type="radio">`, tous avec le **même `name`** pour faire un radio-group (mutual exclusion). 1 seule option avec `data-correct="true"`.
- **`data-mode="multi"`** : `<input type="checkbox">`, chaque input avec un `name` distinct. Plusieurs options peuvent être `data-correct="true"`. La logique de validation exige que l'utilisateur coche **exactement** les bonnes (ni plus, ni moins).
- **`data-correct` est porté par la phrase d'explication, pas par l'option** : ça force l'auteur à toujours écrire une explication réelle, et le DOM reste sémantiquement propre.
- **Lien d'ancre** : un seul `<a href="#ANCHOR">↗ relire §N</a>` dans la première explication correcte (ou la plus représentative). Évite la redondance.
- **Pas de score, pas de localStorage, pas d'indicateur dans le TOC.** Le `Recommencer` permet de retenter, c'est tout.

### Mode mixte single / multi

Choisir le mode **par question**, selon la nuance du sujet :

- **`single`** : la bonne réponse est unique et tranchée, les distracteurs sont des contresens classiques (ex. « lequel scénario est par défaut ? » → un seul, B).
- **`multi`** : plusieurs affirmations partiellement vraies coexistent, et la pédagogie consiste à séparer le grain de l'ivraie (ex. « lesquelles de ces affirmations sont correctes ? »).

Le mix par article est encouragé. Réduire à du tout-radio appauvrit la nuance ; tout-multi alourdit la lecture.

### Accessibilité

- `<fieldset>` + `<legend class="quiz-q__stem">` pour grouper question + options sous le lecteur d'écran.
- `<input type="radio|checkbox">` natifs (jamais de `<div role="radio">` custom) : navigation Tab/Espace/Entrée fonctionne par défaut.
- `aria-expanded` + `aria-controls` sur `.quiz-card__toggle`.
- `role="status" aria-live="polite"` sur `.quiz-q__verdict` pour annoncer le résultat sans interrompre.
- À l'ouverture, focus déplacé sur le premier `<input>` ; à la validation, focus sur `Recommencer`.

### Stabilo de validation : tile par ligne

Le surlignage des options correctes/fausses utilise le pattern stabilo signature du site (gradient `transparent 60%, color 60%`) **mais avec `background-size: 100% 1.5em` et `background-repeat: repeat-y`**, pour que la bande colorée se répète sous **chaque ligne** de texte d'une option multi-ligne. Sans ça, le gradient ne tache que la dernière ligne du span. Cf. `app-template.html` règles `.quiz-q__options li.is-correct > label > span` etc.

---

## Encadrés de renvoi vers d'autres dossiers (callouts avec mini-vignettes zoomables)

Quand un dossier deep-research s'appuie sur des concepts déjà développés dans d'autres dossiers (pyramide d'usage de `coding-agents`, six piliers d'`observabilite-agents-ia`, etc.), on évite de re-développer et on insère un **encadré de renvoi** qui (a) résume en deux phrases pourquoi le lecteur devrait aller voir, et (b) embarque une **mini-vignette cliquable du schéma signature** du dossier cible.

L'encadré est posé en fin de section, après la prose qui s'appuie sur le concept renvoyé. Il signale au lecteur qu'il peut creuser sans surcharger la section courante.

### DOM

```html
<aside class="callout">
  <button type="button"
          class="callout-thumb-link"
          data-svg-src="/coding-agents/images/20260512-05-pyramide.svg"
          data-svg-alt="Mini-vignette du dossier coding-agents — pyramide d'usage"
          aria-label="Agrandir : Mini-vignette du dossier coding-agents — pyramide d'usage">
    <img class="callout-thumb"
         src="/coding-agents/images/20260512-05-pyramide.svg"
         alt="Mini-vignette du dossier coding-agents — pyramide d'usage"
         loading="lazy">
  </button>
  <div class="callout-body">
    <p class="callout-eyebrow">Pyramide d'usage data — déjà couverte</p>
    <p>La typologie à quatre étages vient du dossier <a href="/coding-agents/">coding-agents</a>. À lire si la couche outillage n'est pas familière.</p>
  </div>
</aside>
```

**Variante text-only** (quand le dossier cible n'a pas de schéma signature exploitable — typiquement un scrollytelling sans SVG standalone) : remplacer la grille par `<aside class="callout callout--text">` et omettre le bouton.

### CSS canonique

```css
main .callout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 22px;
  align-items: center;
  margin: 2.4rem 0;
  padding: 20px 24px;
  background: var(--paper-2);
  border-left: 3px solid var(--teal);
  border-radius: 2px;
  transition: grid-template-columns 320ms cubic-bezier(.2,.7,.2,1);
}
main .callout:hover { grid-template-columns: 380px 1fr; }   /* la vignette pousse le texte */
main .callout.callout--text,
main .callout.callout--text:hover { grid-template-columns: 1fr; }

main .callout > .callout-thumb-link {
  position: relative; display: block;
  width: 100%; aspect-ratio: 3 / 2;
  overflow: hidden; border-radius: 2px;
  background: var(--paper); border: 1px solid var(--rule);
  cursor: zoom-in;
  padding: 0; -webkit-appearance: none; appearance: none; font: inherit; color: inherit; text-align: left;
  transition: border-color 200ms ease, box-shadow 200ms ease;
}
main .callout > .callout-thumb-link:hover,
main .callout > .callout-thumb-link:focus-visible {
  border-color: var(--accent);
  box-shadow: 0 4px 18px rgba(30,30,42,0.10);
  outline: none;
}
main .callout > .callout-thumb-link img.callout-thumb {
  width: 100%; height: 100%;
  object-fit: contain;          /* PAS cover — on veut le schéma entier, pas un crop */
  object-position: center center;
  display: block;
  padding: 6px;
}
main .callout > .callout-thumb-link::after {
  content: '⛶ AGRANDIR';
  position: absolute; top: 8px; right: 8px;
  padding: 3px 8px;
  font-family: var(--mono); font-size: 9.5px; font-weight: 600; letter-spacing: 0.10em;
  background: rgba(250,246,236,0.94);
  border: 1px solid var(--rule); border-radius: 2px;
  color: var(--graphite);
  opacity: 0;
  transition: opacity 180ms ease, color 180ms ease, border-color 180ms ease;
  pointer-events: none;
}
main .callout > .callout-thumb-link:hover::after,
main .callout > .callout-thumb-link:focus-visible::after {
  opacity: 1; color: var(--accent); border-color: var(--accent);
}

main .callout > .callout-body { min-width: 0; }
main .callout .callout-eyebrow {
  font-family: var(--mono); font-size: 0.72rem; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--teal); margin: 0 0 0.45rem; font-weight: 600;
}
main .callout > .callout-body p { margin: 0; font-size: 0.95rem; line-height: 1.55; color: var(--ink); }
main .callout > .callout-body p a { color: var(--accent); text-decoration: none; border-bottom: 1px dotted var(--accent); }
main .callout > .callout-body p a:hover { color: var(--carmine); border-bottom-color: var(--carmine); }

@media (max-width: 640px) {
  main .callout, main .callout:hover { grid-template-columns: 1fr; gap: 14px; padding: 16px 18px; }
}
```

Trois choses load-bearing :

1. **`object-fit: contain`, pas `cover`** — l'utilisateur doit voir le schéma signature en entier (vrai scale), pas un crop centré qui coupe les bords. Sinon le rappel perd son intérêt visuel.
2. **`transition` sur `grid-template-columns`** — au hover, la grille s'agrandit (220 → 380 px sur la vignette) et le texte se relaie naturellement. C'est plus lisible qu'un `transform: scale()` qui déborde du conteneur.
3. **`button` natif, pas `<a target="_blank">`** — le clic ouvre la modale de zoom intégrée à la page, pas un nouvel onglet (cf. JS ci-dessous). `aria-label` riche pour les lecteurs d'écran.

### JS — modale de zoom (réutilise `#zoom-overlay`)

Ajouter cet IIFE à la fin du `<body>`, **après** l'inclusion de `/assets/dossier-app.js` (qui définit le comportement du `#zoom-overlay`) :

```js
(function setupCalloutZoom() {
  const svgCache = new Map();
  async function fetchSvg(src) {
    if (svgCache.has(src)) return svgCache.get(src);
    const res = await fetch(src);
    const txt = await res.text();
    const svg = new DOMParser().parseFromString(txt, 'image/svg+xml').documentElement;
    svgCache.set(src, svg);
    return svg;
  }
  async function openCalloutZoom(src, caption) {
    const overlay = document.getElementById('zoom-overlay');
    const content = document.getElementById('zoom-content');
    const captionEl = document.getElementById('zoom-caption');
    if (!overlay || !content) { window.open(src, '_blank', 'noopener'); return; }
    try {
      const svgSrc = await fetchSvg(src);
      const clone = svgSrc.cloneNode(true);
      const vb = clone.viewBox?.baseVal;
      const w = (vb && vb.width)  || 1200;
      const h = (vb && vb.height) || 800;
      clone.setAttribute('width', w); clone.setAttribute('height', h);
      clone.style.width = w + 'px';   clone.style.height = h + 'px';
      content.innerHTML = '';
      content.appendChild(clone);
      if (captionEl) captionEl.textContent = caption || '';
      overlay.hidden = false;
      document.body.style.overflow = 'hidden';
      overlay.querySelector('.zoom-reset')?.click();   // fitToStage via le handler existant
    } catch (err) {
      console.warn('[callout zoom] fetch failed, fallback open in new tab', err);
      window.open(src, '_blank', 'noopener');
    }
  }
  document.querySelectorAll('button.callout-thumb-link').forEach((btn) => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-svg-src');
      const alt = btn.getAttribute('data-svg-alt') || '';
      if (src) openCalloutZoom(src, alt);
    });
  });
})();
```

Le fetch fonctionne aussi bien en `file://` (sur certains navigateurs avec CORS désactivé) qu'en HTTP. Fallback gracieux vers `window.open` en cas d'échec — pas d'écran blanc.

### Choisir la vignette signature

Convention par défaut : c'est le schéma de structure transverse du dossier (souvent `01` ou `02`, parfois `05`). Vérifier ce que la prose du callout pointe précisément — si elle évoque « la pyramide d'usage » de coding-agents, pointer vers `20260512-05-pyramide.svg` plutôt que vers `20260512-02-anatomie.svg`, même si l'anatomie est le schéma signature stricto sensu. L'utilisateur a privilégié la pertinence de la vignette par rapport au concept référencé sur le dossier `analytics-agentique-gcp` (revue 19 mai 2026).

Exceptions :
- **Dossiers sans SVG standalone exploitable** (scrollytelling, HTML composite) → callout text-only, classe `.callout--text`.
- **Dossiers récents non publiés** → ne pas créer le callout tant que le SVG cible n'est pas en ligne (pas de lien brisé sur `mathieugug.github.io`).

---

## Infographie A4 exec sum (synthèse visuelle imprimable)

Pour les dossiers à enjeu RDV / pitch / executive briefing, **ajouter une infographie A4 portrait** juste après la synthèse exécutive textuelle. Elle condense les 5 messages-clés en un seul artefact visuel, imprimable directement (A4 standard) et utilisable en pièce jointe sur un mail ou un dossier client.

### Format

- **`viewBox="0 0 840 1188"`** — proportions A4 portrait (≈ 1 : 1.414). 840 unités de large, padding latéral 60 → zone utile 720 ; padding vertical 60 → zone utile 1068.
- **5 messages-clés stackés verticalement**, séparés par des hairlines dashed (`stroke-dasharray="3,4"`).
- Chaque message : circle numéroté (cx variable, r=20) + eyebrow mono + display title + corps visuel (mini bars, badges, colonnes, etc.).
- Palette : la même que le reste du dossier (variables CSS du site partagées via la convention `:root`).

### Structure type

```
y=0-152      Header (eyebrow date + titre 34pt + lede 16pt italic)
y=170-440    MSG 01 — visuel principal (souvent une mini bar chart avec axe Y)
y=478-660    MSG 02 — trois colonnes / cartes
y=704-870    MSG 03 — trois lignes mises en avant
y=890-1040   MSG 04 — badges/chips horizontaux
y=1060-1140  MSG 05 — bar stacking (asymétrie)
y=1170-1188  Footer (hairline)
```

### Axe Y obligatoire sur les bar charts mini

**Tout bar chart mini dans l'A4 doit porter un axe Y explicite** (graduations 0/50/100 % minimum, axe vertical, ticks). Sans repère, l'œil ne peut pas lire les proportions — la barre 85 % paraît juste « grande » et la barre 10-20 % juste « petite », sans rapport métrique. Cas vu sur la première itération de l'A4 d'`analytics-agentique-gcp` le 19 mai 2026 : l'utilisateur a flagué l'absence d'échelle, on a rajouté axe + gridlines en réponse.

Pattern :

```xml
<g transform="translate(160, 248)">
  <!-- Y-axis : graduations 0 / 50 / 100 % -->
  <text x="-8" y="36"  class="mono" font-size="9" fill="#9a9ca5" text-anchor="end">100</text>
  <text x="-8" y="76"  class="mono" font-size="9" fill="#9a9ca5" text-anchor="end">50</text>
  <text x="-8" y="116" class="mono" font-size="9" fill="#9a9ca5" text-anchor="end">0</text>
  <text x="-32" y="78" class="mono" font-size="9" font-weight="600" fill="#6b6f7c"
        letter-spacing="0.14em" text-anchor="middle"
        transform="rotate(-90, -32, 78)">ACCURACY %</text>

  <!-- Axe Y vertical + ticks -->
  <line x1="0" y1="32"  x2="0" y2="112" stroke="#1e1e2a" stroke-width="0.75"/>
  <line x1="-3" y1="32"  x2="0" y2="32"  stroke="#1e1e2a" stroke-width="0.75"/>
  <line x1="-3" y1="72"  x2="0" y2="72"  stroke="#1e1e2a" stroke-width="0.75"/>
  <line x1="-3" y1="112" x2="0" y2="112" stroke="#1e1e2a" stroke-width="0.75"/>

  <!-- Gridlines horizontales -->
  <line x1="0" y1="32"  x2="565" y2="32"  stroke="rgba(30,30,42,0.12)" stroke-width="0.5" stroke-dasharray="2,3"/>
  <line x1="0" y1="72"  x2="565" y2="72"  stroke="rgba(30,30,42,0.10)" stroke-width="0.5" stroke-dasharray="2,3"/>
  <line x1="0" y1="112" x2="565" y2="112" stroke="#1e1e2a" stroke-width="0.75"/>

  <!-- ... bars : top y = 32 + (100-pct)/100 * 80 ... -->
</g>
```

Les bars sont calées sur une zone de 80 px de haut (y=32 = 100 %, y=112 = 0 %), avec une formule directe `top_y = 32 + (100 - pct) / 100 * 80`.

### Embed dans l'app HTML

```html
<figure class="figure figure--portrait" id="fig-00">
  <a class="figure-portrait-link" href="images/YYYYMMDD-00-exec-sum-a4.svg"
     target="_blank" rel="noopener"
     title="Ouvrir l'infographie A4 en taille réelle / pour impression">
    <img src="images/YYYYMMDD-00-exec-sum-a4.svg"
         alt="Infographie A4 — [titre dossier], cinq messages-clés en synthèse visuelle"
         loading="lazy">
  </a>
  <figcaption class="figure-caption">Synthèse visuelle A4 — cinq messages-clés du dossier, en un seul coup d'œil. Cliquer pour ouvrir en plein écran et imprimer.</figcaption>
</figure>
```

CSS d'accompagnement (centrée, max-width 560 pour rendre la portrait lisible sans casser le wrap) :

```css
main .figure--portrait { margin: 3rem auto; padding: 0; border: none; max-width: 560px; }
@media (min-width: 1025px) {
  main .figure--portrait { margin-left: auto !important; margin-right: auto !important; padding: 0; }
}
main .figure--portrait .figure-portrait-link {
  display: block; width: 100%;
  border: 1px solid var(--rule); background: var(--paper); border-radius: 2px;
  cursor: zoom-in;
  transition: box-shadow 220ms ease, border-color 220ms ease;
  overflow: hidden;
}
main .figure--portrait .figure-portrait-link:hover {
  box-shadow: 0 8px 28px rgba(30,30,42,0.14);
  border-color: var(--accent);
}
main .figure--portrait img { display: block; width: 100%; height: auto; }
main .figure--portrait .figure-caption {
  max-width: 560px; margin: 14px auto 0; padding: 0; text-align: center;
}
```

Click → même IIFE de zoom modal que les callouts (le sélecteur `a.figure-portrait-link` est ajouté à l'IIFE `setupCalloutZoom` en parallèle des `button.callout-thumb-link`). L'utilisateur reste dans la page, pas de nouvel onglet.

### Embed dans le rapport markdown

Référencer en syntaxe Obsidian avec le hint `|800` (plus étroit que `|1300` parce que portrait) :

```markdown
![Synthèse visuelle A4 — cinq messages-clés du dossier|800](images/YYYYMMDD-00-exec-sum-a4.svg)
```

L'A4 est aussi le format imprimé par défaut quand l'utilisateur fait `Ctrl/Cmd+P` sur la page — confirmer en local que la mise en page imprime sans débordement avant publication.

---

## Performance & defensiveness

- Total HTML file should stay under ~3 MB; if SVGs push it past, consider lossless SVGO-style minification (remove comments, collapse whitespace, but preserve `data-*` and class attributes)
- All scripts at end of `<body>`; no `defer`/`async` modules (those need a server)
- Wrap modal/tooltip/citation handlers in `try/catch` and silently no-op on missing data — better a quiet failure than a broken page
- The page must work with JavaScript disabled (degraded but readable): SVGs render, prose reads, sources are visible. Modals and tooltips just won't be interactive.

---

## Final checklist for the HTML app

- [ ] Opens by double-click from disk (test with `file://`)
- [ ] No `fetch()`, no `import`, no external JS dependencies
- [ ] Google Fonts loaded via `<link>` (graceful fallback if offline)
- [ ] Every interactive SVG region opens a modal with content (no dead clicks)
- [ ] Every term in `TOOLTIPS` is wrapped in `<span class="term">` somewhere in the prose or modal bodies
- [ ] Every `[N]` citation in the body is a clickable `<a class="cite" data-cite="N">`
- [ ] Sources sidebar renders all entries; clicking a citation highlights the right one
- [ ] Modal closes on backdrop click, Escape key, and close button
- [ ] TOC links to each section (smooth scroll)
- [ ] Page is readable on mobile (responsive breakpoints implemented)
- [ ] Page validates HTML5 (no orphan tags, all attributes quoted)
- [ ] **Each `.figure` has a working ⛶ zoom button** — click opens fullscreen overlay; wheel/pinch zooms; drag pans; `Esc`/`0`/`+`/`-` shortcuts work
- [ ] **Sources sidebar collapses on desktop** via the edge toggle; state persists in `localStorage` across reloads; clicking a citation while collapsed re-expands the sidebar
- [ ] **`.panel-close` button present** in both `<nav id="toc">` and `<aside id="sources">` (first child); CSS hides it outside `@media (max-width: 1024px)`; click handler removes `.open` from the parent panel
- [ ] **Global Escape closer** for open mobile panels is wired AND yields to `#zoom-overlay` and `#modal-root` (both have their own Esc handlers — don't double-close)
- [ ] **Mobile typography lives inside the `@media (max-width: 1024px)` block**, not in a separate narrower breakpoint (Chrome desktop-site mode reports ≥980px on phones — narrower breakpoints never fire)
- [ ] **Defensive overflow** at document root: `html, body { max-width: 100vw }`, `body { overflow-x: hidden }`, `.layout { overflow-x: clip }`
- [ ] **`main pre` + `main code` overflow rules shipped** even if the report has no `<pre>` yet (the `overflow-wrap: normal` reset on `pre code` is mandatory to keep the horizontal scrollbar)
- [ ] **`<a class="back" href="../index.html#series">` is the first child of `<header class="site">`**, before `<span class="marker">`, with the label `← Retour aux dossiers`
- [ ] **No leaky `<!-- ... -->` HTML comments** in the shipped file (the legacy template comment block must be deleted before shipping)
- [ ] **No leftover `{{...}}` markers** anywhere in the deliverable

## Where the marker documentation lives

The `assets/app-template.html` scaffold uses `{{LANG}}`, `{{TITLE}}`, `{{SUBTITLE}}`, `{{DATE}}`, `{{AUTHOR}}`, `{{REPORT_KIND}}`, `{{MD_FILENAME}}`, `{{TOC_HTML}}`, `{{REPORT_HTML}}`, `{{SOURCES_HTML}}`, `{{SCHEMAS_DATA}}`, `{{TOOLTIPS_DATA}}`, and `{{SOURCES_DATA}}`. The previous version of the template documented these in an HTML comment at the top of the file — that comment was a known leak vector and has been removed. **Do not reintroduce it.** Marker documentation lives here, in this reference, not in the template.

Field-by-field:

- `{{LANG}}` — language code (`fr` / `en`)
- `{{TITLE}}` — report title
- `{{SUBTITLE}}` — one-line thesis (used in the `<p class="lead">`)
- `{{DATE}}` — publication date (e.g., "27 avril 2026")
- `{{AUTHOR}}` — **personal author name only** (e.g., "Mathieu Gug"). Never an organization, practice, or team name. See SKILL.md, "Cadrage : publication personnelle".
- `{{REPORT_KIND}}` — short eyebrow tag in the header (e.g., "Rapport approfondi", "Briefing")
- `{{MD_FILENAME}}` — name of the companion `.md` for the download link
- `{{TOC_HTML}}` — generated `<li>` items for the TOC `<ol>`
- `{{REPORT_HTML}}` — the full prose body, with each SVG inlined inside `<figure class="figure" id="fig-NN">` and citations as `<a class="cite" data-cite="N" href="#source-N">[N]</a>`
- `{{SOURCES_HTML}}` — generated `<li id="source-N">` items for the sources `<ol>`
- `{{SCHEMAS_DATA}}` — JS object: `SCHEMAS[schemaId][cardId] = {title, body, eyebrow}`
- `{{TOOLTIPS_DATA}}` — JS object: `TOOLTIPS[term] = definition`
- `{{SOURCES_DATA}}` — JS array: `SOURCES = [{n, citation, url, accessed}]`
