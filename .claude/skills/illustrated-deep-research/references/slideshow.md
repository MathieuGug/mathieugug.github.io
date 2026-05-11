# Narrative slideshow companion (optional 3rd format)

A scenic full-screen slideshow that condenses the long-form study into 10-12 minutes. **Optional**: only build it when the user asks, or when the topic warrants a third entry door alongside the report.md and the long-form HTML app. Reuses the report's existing SVGs and modal cards — no new schemas, no new sources.

Reference proto: `narrative-experiences/20260505-narrative-experiences-slideshow.html` on `mathieugug.github.io`. ~2200 lines, single self-contained HTML. The proto is the source of truth — when in doubt about a CSS rule or a JS handler, read it there.

---

## ⚠️ Quick start — actions you WILL forget if you don't do them on purpose

These are the non-obvious adjustments that took multiple iterations to discover during the V1 proto. **Do them all up front when copying SVGs or building the layout — the user should not have to ask for any of these.**

### A. SVG adaptations (per SVG, before any inline-pasting into `#schemas`)

For every SVG you copy from the long-form app's `<figure id="fig-NN">`:

1. **Background `<rect>` → `fill="transparent"`.** The SVGs ship with `<rect width="..." height="..." fill="#FAF8F3"/>` as their first child (after `<defs>`). This paints an inset cream rectangle inside the page paper, creating a visible "card-within-a-card" frame. Switch to `fill="transparent"` so the SVG fuses with the page background. *(Forgetting this = the user sees a floating off-white panel inside the cream paper and asks "why does the schema look less nice than in the app?")*

2. **Wrap the internal SVG header in `<g class="svg-header">`.** Each SVG ships with 3-4 `<text>` elements at the very top: an eyebrow (`SCHÉMA NN`), a serif title, a graphite italic lede. In the slideshow these would duplicate the topbar's `.scene-title-bar`. Wrap the entire header `<text>` block in `<g class="svg-header">…</g>` so the slideshow's CSS rule `.schema-host svg .svg-header { display: none; }` hides it. *(Forgetting this = duplicate title at the top of every schema scene, the user asks "the title appears twice".)*

3. **Crop the `viewBox` to remove the now-empty header zone.** After hiding the header (~150 SVG units of vertical space), the viewBox still reserves that empty zone, wasting ~25-30% of vertical space. Crop:
   - **Default for landscape SVGs (1200×800):** `viewBox="0 155 1200 635"`
   - **Default for square SVGs (900×900):** `viewBox="0 155 900 745"`
   - **For SVGs with rotated column labels protruding above y=155** (e.g. matrix schemas with -25° labels): use `viewBox="0 105 1200 685"` or even `0 90 1200 700`. **Test each SVG visually after the crop** — anything clipped at the top means drop the y value by 20-30 more units for that specific SVG.

   **Always test each SVG individually after the crop in a browser.** The default y=155 works for ~80% of cases; the remaining 20% need per-SVG tuning. *(Forgetting this = SVG looks small with a big empty space above. User asks "augmente la hauteur du schéma".)*

### B. Layout decisions that override the original spec

The first spec proposed centered modals, a bottom timeline, and a title inside the stage. **All three were wrong.** Here's what actually works (and why):

4. **Title goes in the topbar, NOT in the stage.** Move the scene's title (`NN · {scene title}`) into a `<div class="scene-title-bar">` centered in the topbar. The topbar grows from 48px to **64px desktop / 56px mobile** to accommodate it. Update via `updateSceneTitleBar(scene)` called at the top of every `render()`. *(Forgetting this = the title eats 60-80px of vertical space in the stage that the SVG needs.)*

5. **Modal as right sidebar, NOT centered.** `#modal-root { position: fixed; right: 64px; top: 64px; bottom: 0; width: 400px; transform: translateX(calc(100% + 64px)); }`, slides in via transform. The stage shrinks via `body.modal-open .stage { right: 480px; }` with a 280ms transition. **No backdrop overlay** — the SVG stays visible, just compressed to the left. This preserves the reader's mental model of the schema. On mobile (<1024px), modal becomes a bottom-sheet (`width: 100%; height: 90vh; transform: translateY(100%)`). *(Forgetting this = a centered modal that covers the SVG. User asks "les modaux peuvent s'afficher en sidebar pour préserver le modèle mental".)*

6. **Timeline as vertical right sidebar (desktop), horizontal bottom (mobile).** `.footer-bar { position: fixed; right: 18px; top: 50%; transform: translateY(-50%); flex-direction: column; }`. Under `@media (max-width: 1024px)`, flips to horizontal at `bottom: 16px`. The `.fill` div on each segment uses `style="height: X%; width: X%"` inline so desktop reads the height (vertical fill) and mobile reads the width (horizontal fill) — same JS, two CSS contexts. *(Forgetting this = timeline at the bottom steals viewport height the SVG needs. User asks "déplace la timeline sur la sidebar".)*

### C. Modal infrastructure differs from the long-form app

7. **`SCHEMAS` is a 2-level object, NOT a flat `MODAL_CARDS`.** The long-form app stores cards as `SCHEMAS[schemaId][cardId]` (e.g. `SCHEMAS["schema-01"]["comic-strip"]`). Copy the **entire** `SCHEMAS` object from the app — all 7 sub-schemas, not just the one you've imported first. The clickable regions in the SVGs use `data-card="..."` (NOT `data-modal=`), and the schema id is read from `data-schema-id` on the `<svg>` root. *(Forgetting this = clicking regions on schemas 02-07 does nothing because their cards aren't loaded. User asks "teste quelques modaux y'en a aucun autre qui s'ouvre".)*

8. **`setupZoom()` from the long-form app needs refactoring.** The original IIFE installs static `.zoom-btn` listeners at page-load and queries `.figure svg` once. The slideshow's DOM is dynamic (SVGs are injected per `render()`). Refactor to: IIFE returns `{ openZoom }`, slideshow attaches a `stage.click` listener in **capture phase** (3rd arg `true`) catching `.zoom-btn` clicks and calling `__zoom.openZoom(svg)`. *(Forgetting this = zoom button does nothing on schema scenes.)*

### D. Punchline scenes need real titles

9. **Every punchline scene gets an editorial `title:`.** The timeline tooltip and the TOC overlay use `scene.title` as fallback "Respiration" if missing — but "Respiration" everywhere is meaningless. Author short editorial titles like *"Une troisième voie"*, *"L'acte éditorial"*, *"Le bilan IA"*. *(Forgetting this = the timeline has 3 tooltips reading "Respiration · Respiration · Respiration", uninformative.)*

### E. Hub card

10. **Add a 3ʳᵈ `.format` card to the dossier's `index.html`.** Between the long-form app card and the report.md card. Tag: `Format · Slideshow narratif`. Title: `Le <em>récit illustré</em>`. Sub: ~3 sentences referencing the dossier's own framing. CTA: `Lecture · 10-12 min` / `Ouvrir →`. Update the hub's `.meta` block to mention "**3** formats". *(Forgetting this = the slideshow is shipped but the hub still says "deux formats" and the user can't navigate to it.)*

---

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

- `.dim` → `opacity: 0.18` (visible but pushed back, contextual)
- `.active` → `opacity: 1` (the focus)
- `.hidden` → `opacity: 0; pointer-events: none` (gone)

These are applied via `data-step-state="..."` attributes on SVG elements matching the selectors in `highlight` / `dim` / `hidden`.

**A good choreography:**

| Step | Pattern |
|---|---|
| 0 | Overview — show the structure, no focus (use `dim: []` OR set `fullView: true`, see §4.3) |
| 1-N | Sequential focus — bring one element into the foreground at a time |
| Last | Synthesis — empty `dim`/`hidden` so all elements are `.active` again, OR rely on synthetic recap (see §4.4) |

**Required ids:** Most SVGs in the long-form app use `<g class="interactive" data-card="...">` for clickable regions. To enable per-step CSS selectors, you may need to add additional `id` attributes to non-interactive `<g>` elements that group "narrative blocks" (e.g. axis, columns, rows, layers). Modify only the local copy of the SVG inside the slideshow's `#schemas` container — never touch the app's source SVG.

### 4.1 Focus zoom & auto-state

When a step focuses (i.e. `dim` or `hidden` is non-empty AND `highlight` is non-empty), the engine does two things on top of the explicit state attributes:

1. **CSS transform zoom on the SVG root** (not viewBox manipulation — the original viewBox-based approach broke on desktop with the modal panel). The `__schemaZoom` IIFE computes a `translate(tx, ty) scale(s)` in screen pixels:
   - centre horizontalement le `highlight` dans la portion de stage encore disponible (en excluant la zone du modal panel quand `modalAuto` est set ou que `body.modal-open` est actif)
   - scale up to `MAX_SCALE = 1.6` for small highlights, scale down if the highlight is wider than the available area
   - keeps the highlight at its natural vertical position when `scale ≤ 1` (no push into caption area), recentres vertically only when `scale > 1` (zoom-in benefits from full vertical use)
   - listens to `ResizeObserver` (window resize) and a `MutationObserver` on `body.classList` (modal toggle) to recompute on the fly

2. **Auto-state on top-level non-active children** of the SVG, so the schema doesn't look "ridicule" with a single visible element on a sea of empty paper:
   - loose `<text>` situated in the BOTTOM of the viewBox (`y >= viewBox.bottom − min(120, height·0.18)`) → `hidden` — these are sources / lecture / footer text the reader doesn't need during focus
   - other loose `<text>` (axis labels, quadrant names, "EFFECTIFS" legend, annotations on curves like "Creux mesuré") → **left at full opacity** because they're the schema's reading marks; without them the focused element loses context
   - everything else not already in `dim`/`hidden`/`active` (sibling cards, lines, arrows, paths, circles, background rects, untagged `<g>`) → `dim` — the reader still sees the rest of the schema as faded context, so the focused element doesn't float in a void

You don't author this choreography per step — it kicks in automatically whenever a step has both `highlight` and (`dim` ∪ `hidden`) non-empty. The data only needs to declare what's ACTIVE and what's explicitly hidden; the rest is inferred.

### 4.2 modalAuto and combined modals

A step can declare `modalAuto: 'card-id'` (string) or `modalAuto: ['card-id-1', 'card-id-2', …]` (array). The engine auto-opens the corresponding modal(s) 220 ms after the step's CSS transition. Once open, the next `→` keypress closes the modal AND advances to the next step (combo).

#### Anti-pattern: one step = one modal

The naive shape — one step that focuses one card and opens its modal, repeated for every card on the schema — bloats the slideshow:

| Schema | Cards | Naive step count |
|---|---|---|
| Anatomy (6 spokes) | 6 | 6 (+1 overview = 7) |
| Comparative matrix (3 cols × 6 axes) | 18 | 18 (+1 overview = 19) |
| Decision card (5 profiles) | 5 | 5 (+1 overview = 6) |

For a typical dossier with 8 schemas, that yields **40–50 steps**. The narrative rhythm shatters: the audience can't keep the thread of the chapter under a barrage of single-card pop-ups. Cap the count.

#### Pattern: one step = one focus + 1 to 4 modals stacked

Group cards by thematic coherence and surface them in a single step. Pass an array to `modalAuto`; the engine renders all cards in one modal panel with a dashed separator between each. Optional `modalGroupEyebrow` + `modalGroupTitle` give the stack a shared header (otherwise the modal opens with an empty eyebrow/title and the substacks carry their own).

```js
{
  caption: 'Trois rouages d\'infrastructure : un contexte versionné, un set de tools, des skills.',
  highlight: ['[data-card="card-contexte"]', '[data-card="card-tools"]', '[data-card="card-skills"]'],
  dim:       ['[data-card="card-subagents"]', '[data-card="card-hooks"]', '[data-card="card-permissions"]'],
  hidden:    [],
  modalAuto: ['card-contexte', 'card-tools', 'card-skills'],
  modalGroupEyebrow: 'ROUAGES · INFRASTRUCTURE',
  modalGroupTitle:   'Contexte, tools, skills — la matière partagée'
}
```

The engine resolves the array via `SCHEMAS[scene.schemaId][cardId]` for each id and feeds the list to `openModalStack(cards, groupEyebrow, groupTitle)`. The DOM emitted inside `.modal-body` is:

```
<div class="modal-substack">
  <p class="modal-substack-eyebrow">{card.eyebrow}</p>
  <h4 class="modal-substack-title">{card.title}</h4>
  <div class="modal-substack-body">{card.body}</div>
</div>
<hr class="modal-stack-sep" aria-hidden="true">
<div class="modal-substack">…</div>
…
```

Single-card arrays (`['card-id']`) work too and degrade to the single-card path. Mix freely: same scene can have a stacked step followed by a single-card step.

#### Worked examples — typical reductions

- **Anatomy schema (6 cards) → 3 steps**: overview + "infrastructure" stack (contexte + tools + skills) + "orchestration" stack (sub-agents + hooks + permissions).
- **Comparative matrix (3 tools × 6 axes = 18 cells) → 3 steps**: one per column (full column stacked, 6 cards each).
- **Decision card (5 profiles) → 3 steps**: overview + non-tech stack (consultant + analyst) + tech stack (eng + scientist + manager).
- **Three-phase timeline (3 cells) → 2 steps**: overview + all 3 stacked in one narrative beat.

#### Target totals and required coverage

Aim for **~15–20 schema steps total** across the slideshow (plus intro + outro = 17–22 actual `→` presses). A 12-scene slideshow should rarely exceed 25 steps. The step should narrate ONE thing — not unroll a list.

**Coverage constraint (mémoire `feedback_slideshow_scene_coverage`)** : every `data-card` that has a SCHEMAS entry MUST appear in `modalAuto` (string or array) at some point during linear playback. The combined-modal pattern preserves coverage while compressing steps — there is no trade-off. Audit script (Python one-liner) at the bottom of this section.

#### Coverage audit

```python
# Run from repo root after editing the slideshow's SCENES array.
import re
with open('dossier-slug/YYYYMMDD-slug-slideshow.html', encoding='utf-8') as f:
    text = f.read()
m = re.search(r'const SCENES = \[(.*?)\];\s*\n\s*/\* .*? SCHEMAS', text, re.DOTALL)
scenes_text = m.group(1)
simple  = re.findall(r"modalAuto:\s*'([^']+)'", scenes_text)
arrays  = re.findall(r"modalAuto:\s*\[([^\]]+)\]", scenes_text)
covered = set(simple)
for arr in arrays:
    covered.update(re.findall(r"'([^']+)'", arr))
print(f'modalAuto covers {len(covered)} cards')  # compare with SCHEMAS keys count
```

Reference implementation: `coding-agents/20260512-coding-agents-slideshow.html` (46 steps → 18 schema steps + intro + outro = 20 total, 36/36 cards covered).

### 4.3 `step.fullView` — opt-out of focus

Set `step.fullView: true` on a step that you authored with a non-empty `dim` (for visual emphasis only) but where you DON'T want the focus zoom or the auto-hide/dim of contextual elements. Use it when the step IS the overview:

```js
{
  caption: 'Trois questions filtrent les huit méthodes…',
  highlight: ['[data-card="q1"]', '[data-card="q2"]', '[data-card="q3"]'],
  dim:       ['[data-card="m1"]', '[data-card="m2"]', …],   // visual emphasis only
  hidden:    [],
  fullView:  true                                            // ← skip focus zoom
}
```

In `fullView` mode the explicit `dim`/`hidden`/`active` states still apply (so the methods are visibly faded), but no transform is applied, no auto-hide of footer, and no modalAuto fires. The schema looks normal.

### 4.4 Synthetic recap before scene transition

When the LAST step of a schema scene is itself a focus step (i.e. has `dim`/`hidden` non-empty AND there's a next scene), pressing → at that step does NOT immediately go to the next scene. Instead the engine:

1. Closes the modal if open.
2. Re-renders the same step with `step.fullView` forced to `true` — full schema, no zoom, no auto-hide. Internally a `__pendingRecap` flag tracks this synthetic state.
3. Waits for the next → keypress to actually transition.

This gives the reader a "view from above" moment before leaving the scene — useful when the last step had an aggressive zoom or an open modal. Pressing ← from the recap brings back the focus step with its modal.

If the last step is already a true overview (empty `dim`/`hidden`), the recap is skipped — the step itself IS the recap.

### 4.5 Modal floats over the stage

The modal is **fixed** at `right: 0; top: 64px; bottom: 0; width: 480px` and slides in via `transform: translateX(...)`. The stage **does not shrink** when `body.modal-open` is added (no `right: 480px` rule). This avoids width jumps for the SVG between steps with/without modal — the SVG keeps its natural CSS size, and only the focus zoom transform recomputes (via MutationObserver) to centre the highlight in the still-visible portion.

The right portion of the schema (typically non-focus content) is hidden behind the modal panel, but `__schemaZoom` ensures the highlighted/focused content stays fully in the visible portion.

The bottom **caption** does adapt visually:
- shifts left on desktop via `transform: translateX(-208px)` (= `(modal_w − timeline_w) / 2`) so it stays centred in the modal-free area
- sits on top of `.stage::after`, a **`position: fixed; left: 0; right: 0; bottom: 0; height: 96px`** opaque band with `linear-gradient(to top, var(--bg) 0%, var(--bg) 55%, transparent 100%)`. This band spans the FULL viewport width (not just the stage which is `right: 64px`) and masks any SVG content that was transformed below its natural CSS box, so the italic caption text always sits on a clean opaque ground

### 4.6 Toggle on click — same card closes

Clicking on a region with `data-card="..."` opens its modal (single or aggregated). **Clicking the same card again closes the modal** — toggle behaviour. Internally a `__currentModalCardId` variable tracks which card opened the current modal:

```js
stage.addEventListener('click', (e) => {
  const target = e.target.closest('[data-card]');
  if (!target) return;
  const cardId = target.dataset.card;
  const modalOpen = !document.getElementById('modal-root').hidden;
  if (modalOpen && __currentModalCardId === cardId) { closeModal(); return; }
  // …open modal for cardId
  __currentModalCardId = cardId;
}, true);
```

`closeModal()` clears `__currentModalCardId` (so the next click on the same card opens the modal again). Clicking a different card while a modal is open closes the current modal AND opens the new one (via the standard open path — no special "switch" code, the toggle check just falls through).

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

`position: fixed; top: 64px; left: 0; right: 64px; bottom: 0; overflow: hidden`. The right offset (`64px`) reserves the timeline sidebar. The stage **does NOT shrink** when a modal opens — the modal floats over the stage's right portion. This avoids SVG width jumps between steps with/without modal. The focus zoom in `__schemaZoom.compute()` (§4.1) reads `body.classList.contains('modal-open')` and reserves the modal panel area in `availW`, so the highlight stays centred in the still-visible portion. The right portion of the SVG sits behind the modal — that's fine, it's not the focused content.

`overflow: hidden` on the stage clips the transformed SVG (zoom-in extending past natural bounds, neighbours shifted off-screen, etc.) so nothing leaks into the timeline or the modal panel.

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
4. **Modal centered overlapping the SVG** — the spec proposed centered modals, but in practice covering the SVG breaks the reader's mental model. The slideshow uses **right-sidebar modals** that slide in beside the SVG, but **the stage does NOT shrink** when the modal opens (no `body.modal-open .stage { right: 480px }` rule). Reason: shrinking creates jarring SVG width jumps between steps with/without modal. Instead, `__schemaZoom.compute()` reads `body.classList.contains('modal-open')` and reserves the modal panel area in `availW` so the focus zoom centres the highlight in the still-visible portion. The right portion of the SVG sits behind the modal panel — that's fine because by construction it's not the focused content. (§4.5, §6.)
5. **Timeline at bottom stealing height** — the SVG needs vertical room. Move the timeline to a vertical right sidebar. Mobile flips back to horizontal bottom (touch ergonomics). (§6.)
6. **Title in the stage stealing more height** — the spec had `.schema-host > .scene-title` inside the stage. Move it to the topbar (which grows from 48px to 64px) via `<div class="scene-title-bar">` updated by `updateSceneTitleBar(scene)` on every render. (§6.)
7. **Centering content vertically with `justify-content: center` while content overflows** — when `max-height` of the SVG is too generous, the schema-host overflows the stage and gets pushed under the topbar. Either reduce SVG max-height, or switch to `justify-content: flex-start` with explicit margins.
8. **`align-items: stretch` makes the SVG fill the entire stage width** — too much. Stay with `align-items: center` and limit `.schema-host` width with `max-width: min(1400px, 92vw)`.
9. **viewBox `y=155` is global, but rotated column labels protrude** — SVG 03 of `narrative-experiences` (matrix with -25° rotated labels) needed `y=105` to fit. Always check each schema in browser; some need a more generous crop.
10. **`MODAL_CARDS` (flat) doesn't exist in the app — it's `SCHEMAS[schemaId][cardId]` (2-level)** — the slideshow's modal dispatcher must reconstruct the schema key from the SVG's `data-schema-id` and look up the card by its `data-card` attribute. Don't try to flatten.
11. **`setupZoom()` from the app installs static `.zoom-btn` listeners at page-load** — but the slideshow renders schemas dynamically via `render()`. Refactor the IIFE to expose `__zoom.openZoom(svg)` and attach a `stage.click` listener in capture phase that catches `.zoom-btn` clicks.
12. **Topbar height change cascades** — when you move the title to the topbar (48px → 64px), every dependent measurement must follow: stage `top`, modal `top`, mobile media queries, max-height calc.
13. **Naïve viewBox-based focus zoom on desktop with the modal panel** — the original `__schemaZoom` IIFE animated the SVG's `viewBox` to fit the highlight bbox, padded to the original aspect ratio. On desktop with modal open, this consistently broke: a single tall card (e.g. a "potentiel" column 340 user wide × 480 tall) would get padded horizontally to match a 1.92 aspect viewBox → focus rectangle ~1075 wide → neighbours got pulled into frame, the highlight wasn't actually centred, and the right side ended up under the modal panel. The fix is **CSS transform on the SVG root** computed in screen pixels (§4.1), not viewBox manipulation: it gives full control over translate + scale, ignores aspect-ratio constraints, plays well with `overflow: hidden` on the stage, and recomputes via `ResizeObserver` + `MutationObserver(body.classList)` when the modal toggles.
14. **Auto-state heuristic must distinguish footer text from reading marks** — when auto-dimming non-active elements during focus, hiding ALL loose `<text>` elements (early naïve heuristic) made schemas like the métiers map look "ridicule": no axis labels ("EXPOSITION À L'IA"), no quadrant names ("PEU TOUCHÉS"), no size legend, just orphan bubbles in a void. Fix: hide loose `<text>` only when its `y >= viewBox.bottom − min(120, height·0.18)` (i.e. genuinely the source/lecture/footer band). Keep the rest at full opacity — they're the schema's reading marks.
15. **Stage shrinks on modal-open create width jumps** — first iteration set `body.modal-open .stage { right: 480px }` so the SVG resized to fit alongside the modal. Result: every modalAuto step jolted the SVG width down then back up at scene transition. Reader complaint: "sauts de width pénibles". Fix: stage stays full-width, focus zoom recomputes `availW = stageW − 480` to centre the highlight in the modal-free portion. The trade-off (right portion of the SVG hidden behind the modal) is acceptable because by construction it's not the focused area.
16. **Caption overlapping the modal panel** — once the stage no longer shrinks, the caption (centred horizontally in `.schema-host`, max-width 720) extended into the modal area on smaller desktops. Fix: under `body.modal-open` desktop, shift the caption with `transform: translateX(-208px)` (= `(modal_w − timeline_w) / 2`) and clamp `max-width: min(720px, calc(100vw - 560px))`. Caption ends up centred in the modal-free portion of the viewport.
17. **Caption transparent over the SVG** — the SVG transformed (especially with `scale > 1`) can render content below its natural CSS box, sometimes peeking through behind the italic caption text. Fix: caption gets `position: relative; z-index: 2; padding: 28px 24px 8px; background: linear-gradient(to bottom, rgba(250,246,236,0) 0%, var(--bg) 28px, var(--bg) 100%)` — opaque body, soft fade-in at top so the boundary with the schema is gentle.
18. **`modalAuto` showing only one card when the highlight covers a group** — e.g. a "Famille A" step with `highlight: [Frey, Arntz, Eloundou]` and `modalAuto: 'frey'` would open a modal only about Frey. Reader: "modal chemin B mais focus sur chemin A et B en même temps, ça ne va pas". Fix: render() collects all `step.highlight` selectors that have a `SCHEMAS[schKey][cardId]` entry and stacks them in a single combined modal (§4.2). The data stays declarative — the engine handles the aggregation.
19. **Last step with focus has the modal AND should also recap** — conflict: the modal carries information, but the reader needs a "view from above" before leaving the scene. Fix: `__pendingRecap` flag (§4.4). First → at a focus last step closes the modal and re-renders the same step in `fullView` (recap). Second → goes to the next scene. ← from recap brings back the modal step.
20. **`fullView` was too timid** — first iteration, `step.fullView = true` only skipped the auto-state heuristic and the focus zoom transform, but `dim`/`hidden` from `step.dim`/`step.hidden` selectors were still applied, leaving "recap" steps with explicit dim cards visibly faded. The reader saw "Acemoglu in focus, others dim" instead of "everything visible". Fix: in `applyStepStyles`, when `step.fullView` is true, return early after clearing all `data-step-state` — no dim/hidden/active applied at all. Recap = truly full schema.
21. **Caption opaque background bound to caption box width** — first iteration, the gradient was `background: linear-gradient(…)` directly on `.caption`, so it stopped at `max-width: 720px`. Schema content peeking through to the LEFT and RIGHT of the caption was still visible. Fix: move the band to `.stage::after` with `position: fixed; left: 0; right: 0; height: 96px` so it spans the full viewport width, with a soft fade-in at the top.
22. **Click on a card has no toggle** — first iteration, clicking a card opened the modal; clicking the same card again opened it again (no-op visually). Reader expectation: re-clicking the same card closes the modal (like a tooltip toggle). Fix: track `__currentModalCardId` (§4.6) — set on open, cleared on close, compared on click.

## Summary

The slideshow is the third entry door to a deep-research deliverable. It reuses the report's SVGs and modals with three light adaptations (transparent rect, hidden header, cropped viewBox), wraps them in a 11-scene narrative driven by a declarative `SCENES` table, and ships in a single self-contained HTML file. The persistent UI (topbar with scene title, vertical timeline sidebar, sliding modal sidebar) keeps the SVG visible at all times — the reader's mental model stays anchored on the schema, never covered by chrome.

When in doubt, read `narrative-experiences/20260505-narrative-experiences-slideshow.html` directly — it's the V1 proto and the source of truth for every CSS rule and JS handler.
