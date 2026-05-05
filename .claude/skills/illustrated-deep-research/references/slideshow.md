# Narrative slideshow companion (optional 3rd format)

A scenic full-screen slideshow that condenses the long-form study into 10-12 minutes. **Optional**: only build it when the user asks, or when the topic warrants a third entry door alongside the report.md and the long-form HTML app. Reuses the report's existing SVGs and modal cards — no new schemas, no new sources.

Reference proto: `narrative-experiences/20260505-narrative-experiences-slideshow.html` on `mathieugug.github.io`. ~2200 lines, single self-contained HTML. The proto is the source of truth — when in doubt about a CSS rule or a JS handler, read it there.

## 1. Purpose & niche

| Format | Reading time | Reader posture | Density |
|---|---|---|---|
| Markdown report | 30-50 min | active, sequential | high |
| HTML companion app (long-form) | 30-50 min | active, exploratory | high |
| **Slideshow companion** | **8-12 min** | **passive, scenic** | **medium** |

The slideshow promise: *"I walk you through this topic in 10-12 full-screen scenes. The schema builds in front of you, step by step. You can dive deeper or skip — your pace."*

Niche differentiation:
- vs **app**: fast read replaces deep read. ~10 min vs ~45 min. The app stays the reference; the slideshow is a discovery / onboarding door.
- vs **scrollytelling** (e.g. `anatomie/scrolly.html`): no scroll. Full-screen, discrete navigation. Theatrical instead of continuous descent.
- vs **HTML pitch deck** (e.g. `gouvernance/`): the slideshow adds intra-scene progressive choreography (steps inside a scene), on-demand modals as sidebar, and zoom — turning a static deck into an exploration.

Build the slideshow only if the long-form app already exists. The slideshow imports the SVGs and modal cards from the app — you do not author new visuals or new sources for it.

## 2. Anatomy of a slideshow

Three scene types, all dispatched by the same engine:

### `punchline`

A full-screen italic Fraunces sentence (clamp 32-64px) with `<mark>` highlight (the site's stabilo signature). Optional `attribution` line in mono small-caps below.

Use 2-3 punchlines across the slideshow as breathing scenes between schema scenes. They surface the key editorial assertions of the long-form study.

### `schema`

The scene's title appears in the topbar (not in the stage). Below: the SVG full-screen, then a Fraunces italic caption that updates per step. Multiple steps reveal/highlight regions of the SVG progressively.

Each schema scene reuses one of the report's existing SVGs — copy-paste from the long-form app's `<figure id="fig-NN">` blocks, then adapt (see §5).

### `outro`

A closing scene with: eyebrow ("Vous avez parcouru"), title ("{Topic} — l'essentiel"), short body, primary CTA to the long-form app, secondary CTA to the markdown report, "↺ Recommencer" link, and the disclosure footer ("Format co-écrit avec l'aide d'une IA").

## 3. The SCENES table (declarative)

The whole slideshow is driven by one JS array:

```js
const SCENES = [
  // intro punchline
  {
    id: 'intro',
    type: 'punchline',
    title: 'Une troisième voie',                  // shown in topbar + timeline tooltip + TOC
    body: 'A sentence with <mark>some highlights</mark> in it.',
    attribution: '{Author Name}, {Month YYYY}'    // optional
  },

  // schema scene with progressive reveal
  {
    id: 'spectre',
    type: 'schema',
    title: 'Le spectre auteur ↔ lecteur',
    schemaId: 'svg-01-spectre',                   // matches the inline SVG's id in #schemas
    steps: [
      {
        caption: 'Caption text shown in step 0.',
        highlight: ['#group-1'],                   // CSS selectors → data-step-state="active"
        dim: ['#group-2'],                         // → data-step-state="dim" (opacity 0.18)
        hidden: ['#group-3']                       // → data-step-state="hidden" (opacity 0)
      },
      {
        caption: 'Caption for step 1 — adds an idea.',
        highlight: ['#group-1', '#group-2'],
        dim: [],
        hidden: ['#group-3'],
        modalAuto: 'card-id'                       // optional: auto-open modal at this step
      }
      // … 3-7 steps total per schema scene
    ]
  },

  // breathing punchline
  { id: 'respi-1', type: 'punchline', title: 'L\'acte éditorial', body: '...' },

  // … more schema scenes

  // outro
  {
    id: 'outro',
    type: 'outro',
    title: 'Pour aller plus loin',
    body: 'A short paragraph that bridges to the long-form study.',
    cta:        { href: '20260505-{slug}-app.html',     label: 'Ouvrir l\'étude illustrée →' },
    secondary:  { href: '20260505-{slug}-rapport.md',   label: 'Télécharger le rapport ↓' }
  }
];
```

**Conventions:**
- 11 scenes is the canonical count for a 7-schema study: `intro · 7 schema scenes · 2-3 punchlines interleaved · outro`. Adjust if the source study has fewer or more schemas.
- Every scene has a `title` (used in the topbar's `.scene-title-bar`, the timeline hover tooltip, and the TOC overlay). For punchlines, pick a short editorial title like *"L'acte éditorial"*, *"Le bilan IA"* — not "Respiration".
- Scenes are visited linearly by default. The TOC and the timeline allow random access via `gotoScene(N)`.

## 4. Choreography of a schema scene

A schema scene has 3-7 steps. Each step changes the visual state of the SVG and the caption. Three CSS primitives drive the reveal:

- `.dim` → `opacity: 0.18` (visible but pushed back)
- `.active` → `opacity: 1` (the focus)
- `.hidden` → `opacity: 0; pointer-events: none` (not yet introduced)

These are applied via `data-step-state="..."` attributes on SVG elements matching the selectors in `highlight` / `dim` / `hidden`.

**A good choreography:**

| Step | Pattern |
|---|---|
| 0 | Overview — show the structure, no focus |
| 1-N | Sequential focus — bring one element into the foreground at a time |
| Last | Synthesis — bring everything back into `.active`, the reader sees the whole picture |

**modalAuto:** A step can declare `modalAuto: 'card-id'`. The engine auto-opens that modal 220ms after the step's CSS transition. Once open, the next `→` keypress closes the modal AND advances to the next step (combo). Use sparingly — at most 1-2 modalAuto per schema scene. Reserve them for moments the narrative cannot afford to skip (a definition, a key citation, a counter-intuitive fact).

**Required ids:** Most SVGs in the long-form app use `<g class="interactive" data-card="...">` for clickable regions. To enable per-step CSS selectors, you may need to add additional `id` attributes to non-interactive `<g>` elements that group "narrative blocks" (e.g. axis, columns, rows, layers). Modify only the local copy of the SVG inside the slideshow's `#schemas` container — never touch the app's source SVG.

## 5. Reusing assets from the long-form app

The slideshow does not author new visuals or new sources. It imports them from the long-form app via copy-paste, with three light adaptations per SVG:

### Adaptation 1: transparent background `<rect>`

The SVGs from the editorial-style guide ship with a `<rect width="..." height="..." fill="#FAF8F3"/>` as their first child — it draws an inset paper rectangle that visually frames the content. Inside the slideshow's full-screen stage, this inset frame conflicts with the page paper background, creating a visible "card within a card" effect.

**Fix:** change `fill="#FAF8F3"` to `fill="transparent"` on the local copy of every SVG inside the slideshow. The long-form app source stays unchanged.

### Adaptation 2: hide the internal SVG header

Each SVG ships with 3-4 `<text>` elements at the top: an eyebrow (`SCHÉMA NN`), a serif title, and a graphite italic lede. In the long-form app, these compose the schema's header inside its `<figure>`. In the slideshow, the **scene's title appears in the topbar** — duplicating it as inline SVG text would be redundant.

**Fix:** wrap the 3-4 header `<text>` elements (everything between the `<rect>` background and the first graphical element of the schema) in `<g class="svg-header">...</g>`. The slideshow's CSS hides this group:

```css
.schema-host svg .svg-header { display: none; }
```

Apply this wrapping consistently on all 7 SVGs.

### Adaptation 3: viewBox crop

After hiding the header, the SVG's `viewBox` still reserves the empty space at the top (typically y=0..150 was the header zone). Crop the viewBox so the slideshow renders the schema with no wasted vertical space:

| Source viewBox | Slideshow viewBox | Reason |
|---|---|---|
| `0 0 1200 800` (most schemas) | `0 155 1200 635` | Drops the 155px header zone |
| `0 0 900 900` (square schemas) | `0 155 900 745` | Same y crop, square aspect ratio kept |
| Schema with **rotated column labels** that protrude above y=155 | `0 105 1200 685` | Empirical: the SVG 03 of `narrative-experiences` (matrix with labels rotated -25°) needs y=105 to show the labels in full |

**Tuning:** start with `y=155` global, then check each SVG in browser. If anything is clipped at the top (rotated labels, callouts, top-row legend), drop to `y=130`, `y=110`, `y=90` per-SVG until clear. Never crop the bottom — the SVG's source notes (`Source : ...`) stay in the visible zone.

### MODAL_CARDS / SCHEMAS — same content as the app

The slideshow's `const SCHEMAS = { "schema-01": { "card-id": { eyebrow, title, body }, ... }, ... }` is **copy-pasted as-is** from the long-form app. Same structure, same content, same 2-level nesting (`SCHEMAS[schemaId][cardId]`).

The slideshow's modal dispatcher reads the schema id from the SVG via `data-schema-id`, then looks up the card by its `data-card` attribute. This matches the app's pattern exactly — meaning every interactive region from the long-form app works in the slideshow without re-authoring.

### SOURCES — same content as the app

`const SOURCES = [ { num: 1, author, title, year, publisher, url }, ... ]` is also imported from the report. The slideshow's sources overlay (`R` key) renders this array, supports filter-by-text, and `[N]` references in modals open the overlay scrolled to source N with a flash highlight.

## 6. Layout & UI architecture

### Persistent chrome

Three persistent zones:

```
┌──────────────────────────────────────────────────────────────┐
│ {Author}     {NN · Scene title}       ← Retour aux dossiers  │  topbar 64px (56px mobile)
├──────────────────────────────────┬──────┬────────────────────┤
│                                  │      │                    │
│        [Stage: SVG centered]     │ pad  │  [Modal sidebar    │
│                                  │      │   slide-in 400px,  │
│                                  │      │   visible only     │
│                                  │      │   when open]       │
│                                  │      │                    │
│        [Caption italic]          │      │                    │
│                                  │      │                    │
└──────────────────────────────────┴──────┴────────────────────┘
                                          ▲                ▲
                                          │                │
                                          Timeline         Page edge
                                          vertical
                                          right (64px wide)
```

### Topbar (64px desktop / 56px mobile)

Three flex zones:
- left: author monogram (`Mathieu <em>Guglielmino</em>` or equivalent)
- center: `<div class="scene-title-bar">` with `<span class="num">NN</span><span class="title">{scene.title}</span>` — updated by `updateSceneTitleBar(scene)` on every render
- right: `← Retour aux dossiers` (mono uppercase, hover `--accent`)

### Stage (the central scene container)

`position: fixed; top: 64px; left: 0; right: 64px; bottom: 0`. The right offset (`64px`) reserves the timeline sidebar. When a modal is open (`body.modal-open`), the stage shrinks (`right: 480px`) via a 280ms cubic-bezier transition, sliding the SVG to the left without covering it.

The stage is `flex column` with `align-items: center; justify-content: center`. Schema-host's `max-width: min(1400px, 92vw)`. SVG `max-height: calc(100vh - 170px)`.

### Timeline (vertical right sidebar, 64px wide)

`.footer-bar { position: fixed; right: 18px; top: 50%; transform: translateY(-50%); flex-direction: column; gap: 24px; }`. 11 segments stacked vertically:
- punchlines: small filled circles `◉`
- schema scenes: thin vertical bars (4px × 36px) that fill from top to bottom as `state.stepIndex` advances
- outro: chevron `▸`

Hover (desktop) reveals a label tooltip to the left of the segment. Click jumps via `gotoScene(N)`.

Below the timeline: two buttons — `Sources` (opens sources overlay, also hotkey `R`) and `≡` (opens TOC overlay, also hotkey `S`). On desktop they're vertical text (`writing-mode: vertical-rl`).

Under `@media (max-width: 1024px)`, the entire footer-bar flips to horizontal at the bottom of the viewport — same components, repositioned.

### Modal as right sidebar (not centered)

`#modal-root { position: fixed; right: 64px; top: 64px; bottom: 0; width: 400px; transform: translateX(calc(100% + 64px)); transition: transform 280ms cubic-bezier(0.22,1,0.36,1); }`. When open: `transform: translateX(0)` and `pointer-events: auto`. No backdrop overlay — the modal slides in beside the SVG, both visible.

`.modal-card` has a `border-left: 4px solid var(--carmine)` and `box-shadow: -16px 0 48px rgba(30,25,18,0.08)`.

Two trigger sources, one infrastructure:
- **clicked:** any region with `data-card="..."` inside the SVG opens its modal. → key closes the modal only.
- **modalAuto:** the engine opens a modal at a chorégraphie step. → key closes the modal AND advances to the next step (combo).

Distinguish them via the `__modalAutoActive` flag.

Mobile (<1024px): `#modal-root { right: 0; top: 0; bottom: 0; width: 100%; transform: translateY(100%); }`. Slides up from the bottom as a 90vh bottom-sheet.

### Overlays for TOC and Sources

`.full-overlay { position: fixed; inset: 0; background: rgba(250,246,236,0.96); backdrop-filter: blur(12px); z-index: 300; }`. Higher z-index than the modal sidebar (`z-index: 200`) and the timeline (`z-index: 40`). Lower than zoom (`z-index: 400`).

Sources overlay has a search input that filters the 19-20 sources by author/title/year. References `[N]` in modals are rewritten by `openModal()` into clickable `<a class="source-ref" data-source-num="N">` — clicking closes the modal, opens sources overlay, scrolls to `li[data-num="N"]`, flashes background `--accent` for 1.5s.

### Zoom on schemas

Each schema scene injects a `<button class="zoom-btn">⛶</button>` at the top-left of the `.schema-wrapper`. Hovering the wrapper reveals it (`opacity: 0 → 1`). Click opens `#zoom-overlay` (copied from the long-form app's `setupZoom()` IIFE) — wheel/pinch zoom + drag pan + Escape to close.

The IIFE was adapted to work with dynamically-rendered SVGs (the original was static): it now exposes `__zoom.openZoom(svgEl)` and is called from a `stage.click` listener that intercepts `.zoom-btn` in capture phase.

## 7. Mobile adaptations (<1024px)

| Element | Adaptation |
|---|---|
| Topbar | 56px height, padding tightens, `<em>` of author hides under 380px |
| Scene title bar | Smaller font (`clamp(13px, 3vw, 18px)`), num hides under 560px, whole bar hides under 480px |
| Stage | `top: 56px; right: 0; bottom: 64px` (lower bottom reserves the now-horizontal timeline) |
| Timeline | Flipped to horizontal at bottom of viewport, no hover tooltips (touch device) |
| Modal | Bottom-sheet pattern, `width: 100%; height: 90vh`, slides up from bottom |
| Inputs | Tap on stage = `advance()`. Swipe horizontal (>60px, <600ms) = `gotoScene(±1)` |
| Onboarding | Toaster at first touch + first visit (localStorage `slideshow-onboarded`): "Tape pour avancer · Swipe ←→ pour changer de scène · Pince pour zoomer" |
| Defensive overflow | `html, body { overflow: hidden; max-width: 100vw }` (slideshow doesn't scroll natively) |

## 8. Accessibility

- Each scene wrapped in `<section role="group" aria-roledescription="scène">`
- Caption uses `aria-live="polite"` so screen readers announce step changes
- Interactive SVG regions remain `role="button" tabindex="0"` with `aria-label` (inherited from the long-form app)
- Modal close: `lastFocused?.focus()` restores keyboard focus on close
- `prefers-reduced-motion: reduce` honored: stage `opacity` and `right` transitions to 0ms, modal `transform` to 0ms, idle pulse animation removed, toaster transition skipped
- Keyboard navigation: ← → for scene/step, ↑ ↓ for direct scene jump, Esc cascades modal > zoom > sources > TOC, S for TOC, R for sources

## 9. Performance & file weight

A typical slideshow with 7 inline SVGs: ~2 MB uncompressed, ~330 KB gzipped on the network (acceptable for GitHub Pages).

- All 7 SVGs sit in `<div id="schemas" hidden>` — they're parsed once at load, hidden via CSS, then `outerHTML`-cloned into the stage when their scene activates.
- No lazy-load, no module imports, no fetch — single self-contained file, opens cleanly from `file://`.
- Polices via Google Fonts CDN with `display=swap` and `preconnect`, identical to the rest of the site.

## 10. Pitfalls observed during the proto

These cost real iteration cycles when building the first slideshow on `narrative-experiences`. Save your time:

1. **SVG `<rect fill="#FAF8F3">` background** — creates a visible inset frame inside the page paper. Always switch to `fill="transparent"` on the local copy. (See §5 adaptation 1.)
2. **Internal SVG title duplicates the external scene title** — wrap the header `<text>` block in `<g class="svg-header">` masked via CSS. (§5 adaptation 2.)
3. **viewBox not cropped** — the SVG reserves 25-30% of vertical space for the now-hidden header. Always crop. (§5 adaptation 3.)
4. **Modal centered overlapping the SVG** — the spec proposed centered modals, but in practice covering the SVG breaks the reader's mental model. The slideshow uses **right-sidebar modals** that slide in beside the SVG with the stage shrinking via `body.modal-open`. (§6.)
5. **Timeline at bottom stealing height** — the SVG needs vertical room. Move the timeline to a vertical right sidebar. Mobile flips back to horizontal bottom (touch ergonomics). (§6.)
6. **Title in the stage stealing more height** — the spec had `.schema-host > .scene-title` inside the stage. Move it to the topbar (which grows from 48px to 64px) via `<div class="scene-title-bar">` updated by `updateSceneTitleBar(scene)` on every render. (§6.)
7. **Centering content vertically with `justify-content: center` while content overflows** — when `max-height` of the SVG is too generous, the schema-host overflows the stage and gets pushed under the topbar. Either reduce SVG max-height, or switch to `justify-content: flex-start` with explicit margins.
8. **`align-items: stretch` makes the SVG fill the entire stage width** — too much. Stay with `align-items: center` and limit `.schema-host` width with `max-width: min(1400px, 92vw)`.
9. **viewBox `y=155` is global, but rotated column labels protrude** — SVG 03 of `narrative-experiences` (matrix with -25° rotated labels) needed `y=105` to fit. Always check each schema in browser; some need a more generous crop.
10. **`MODAL_CARDS` (flat) doesn't exist in the app — it's `SCHEMAS[schemaId][cardId]` (2-level)** — the slideshow's modal dispatcher must reconstruct the schema key from the SVG's `data-schema-id` and look up the card by its `data-card` attribute. Don't try to flatten.
11. **`setupZoom()` from the app installs static `.zoom-btn` listeners at page-load** — but the slideshow renders schemas dynamically via `render()`. Refactor the IIFE to expose `__zoom.openZoom(svg)` and attach a `stage.click` listener in capture phase that catches `.zoom-btn` clicks.
12. **Topbar height change cascades** — when you move the title to the topbar (48px → 64px), every dependent measurement must follow: stage `top`, modal `top`, mobile media queries, max-height calc.

## Summary

The slideshow is the third entry door to a deep-research deliverable. It reuses the report's SVGs and modals with three light adaptations (transparent rect, hidden header, cropped viewBox), wraps them in a 11-scene narrative driven by a declarative `SCENES` table, and ships in a single self-contained HTML file. The persistent UI (topbar with scene title, vertical timeline sidebar, sliding modal sidebar) keeps the SVG visible at all times — the reader's mental model stays anchored on the schema, never covered by chrome.

When in doubt, read `narrative-experiences/20260505-narrative-experiences-slideshow.html` directly — it's the V1 proto and the source of truth for every CSS rule and JS handler.
