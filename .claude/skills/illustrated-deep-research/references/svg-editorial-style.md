# Editorial SVG Style Guide

The aesthetic is **broadsheet infographic** — think NYT Graphics, FT Visual & Data Journalism, Reuters Graphics, The Economist data team. Refined typography, restrained palette, deliberate whitespace, thin strokes with selective emphasis. **No flat-design generic, no PowerPoint templates, no emoji, no clipart, no neon gradients.**

---

## Design tokens

Use these tokens consistently across **every** schema in a report so the set reads as a cohesive series.

### Palette

```
/* Paper & ink */
--paper:        #FAF8F3   /* off-white background */
--ink:          #1A1A1A   /* primary text & strokes */
--graphite:     #5A5A5A   /* secondary text */
--mist:         #B8B5AE   /* tertiary/disabled, fine rules */
--rule:         #E5E1D8   /* dividers and grid lines */

/* Accents — pick TWO max per schema, three only if structurally needed */
--carmine:      #B7332C   /* primary accent — emphasis, key flows */
--teal:         #1F5560   /* secondary accent — context, structure */
--mustard:      #B58A2C   /* tertiary accent — annotations, callouts */
--forest:       #2F5D3F   /* alternative secondary */
--ink-blue:     #1E3A5F   /* alternative primary */
```

When a schema needs to encode **categories**, use accents at full saturation. When it needs to encode **intensity** (heatmap, volume), use a single hue at varying alpha (10/30/60/90%).

Backgrounds are always `--paper` (never pure white, never dark — the user defaults to light mode).

### Typography

Load via Google Fonts in the HTML companion. In the SVG itself, declare fonts with fallbacks so the file renders correctly even if opened standalone:

```xml
<style>
  .display { font-family: 'Spectral', 'Playfair Display', Georgia, serif; }
  .body    { font-family: 'Inter', 'Helvetica Neue', system-ui, sans-serif; }
  .mono    { font-family: 'JetBrains Mono', 'IBM Plex Mono', monospace; }
</style>
```

Type scale (in SVG `font-size` units, viewBox-relative):

| Role | Class | Size | Weight | Letter-spacing |
|---|---|---|---|---|
| Title | `.display` | 26 | 600 | -0.01em |
| Subtitle / section | `.display` | 16 | 400 italic | 0 |
| Body label | `.body` | 13 | 500 | 0 |
| Annotation | `.body` | 11 | 400 | 0.01em |
| Caption / source | `.body` | 10 | 400 italic | 0.02em |
| Numeric callout | `.mono` | 14 | 500 | 0 |
| Marker (1, 2, 3 / a, b, c) | `.mono` | 11 | 600 | 0 |

### Stroke weights

| Use | Weight |
|---|---|
| Default outline | 1.25 |
| Emphasized flow / primary axis | 2.5 |
| Hairline / grid | 0.5 |
| Annotation leader line | 0.75 |
| Boundary / region divider | 1 (dashed: `stroke-dasharray="2 3"`) |

### Geometry

- **Corners:** rounded `rx="3"` for cards/boxes; pure rectangles only for tables.
- **Arrows:** thin marker-end arrowheads, never balloon-style. Define once in `<defs>`, reuse via `marker-end="url(#arrow)"`.
- **Curves:** prefer cubic Béziers with gentle control points — no sharp elbows.
- **Spacing:** minimum 24 units (viewBox) between distinct conceptual groups.

---

## Canvas & viewBox

Two formats only:

| Use case | viewBox | MD width hint |
|---|---|---|
| Landscape (architectures, timelines, comparison matrices) | `0 0 1200 800` | `1200` |
| Square (taxonomies, conceptual frameworks, 2×2 matrices) | `0 0 900 900` | `900` |

Always set `viewBox` (not fixed `width`/`height`). The HTML app will let SVGs scale fluidly; the MD will render at the hinted width.

---

## Anatomy of an editorial schema

Every schema includes **all** of these elements, in order:

1. **Header strip** (top 80 viewBox units)
   - Schema number marker (mono, e.g., "Schéma 04")
   - Title (display, ~26pt)
   - Subtitle (display italic, ~16pt) — one line, what the schema actually shows
2. **Body** (the visualization itself, ~600 units tall for landscape)
   - Use whitespace generously; don't fill edge-to-edge
3. **Annotation layer** — numbered or lettered markers with leader lines pointing to specific elements, plus a 1-line caption per marker
4. **Footer strip** (bottom 60–80 units)
   - Source citation (caption style, italic, e.g., "Source : OECD AI Observatory, 2025 ; analyse Lincoln")
   - Optional: methodology note (caption)

**Rule:** if the schema has more than 4 numbered annotations, group them into a side legend rather than scattering markers everywhere. A reader should grasp the schema in 5 seconds, then deepen via legend.

---

## Interactive regions

Every schema embeds clickable regions that the HTML app turns into modals. Add these attributes to interactive groups:

```xml
<g class="interactive" data-card="planner-agent" tabindex="0" role="button"
   aria-label="Planner agent — cliquez pour les détails">
  <rect x="..." y="..." width="..." height="..." rx="3" fill="..." stroke="..."/>
  <text class="body" ...>Planner</text>
</g>
```

Requirements per interactive region:
- Wrap in `<g class="interactive" data-card="{kebab-case-id}">`
- The `data-card` value is unique within the schema
- Add `tabindex="0"` and `role="button"` for keyboard accessibility
- The HTML app's CSS will add hover/focus states (subtle outline or fill shift)

**Number of interactive regions per schema:** 4–8 typical, 10 max. If you have more, the schema is probably too dense — split it.

---

## Annotation grammar

Numbered annotations follow a consistent format:

```xml
<!-- Marker -->
<circle cx="320" cy="180" r="9" fill="var(--carmine, #B7332C)"/>
<text x="320" y="184" class="mono" font-size="11" font-weight="600"
      fill="#FAF8F3" text-anchor="middle">1</text>

<!-- Leader line -->
<line x1="329" y1="180" x2="380" y2="180"
      stroke="#5A5A5A" stroke-width="0.75"/>

<!-- Caption -->
<text x="386" y="184" class="body" font-size="11" fill="#1A1A1A">
  Détection de l'intent en sub-goals
</text>
```

Markers can also use letters (a, b, c) when the diagram already uses numbers for something else (e.g., a timeline).

---

## Worked patterns

### Pattern A — Architecture diagram (landscape)

```
[Header: title + subtitle]
[Three layered horizontal bands: input | processing | output]
[Each layer has 2–4 boxed components]
[Cross-cutting "spine" running below: observability/governance bus]
[Annotated with 4–6 numbered markers]
[Footer: source + methodology]
```

### Pattern B — Taxonomy (square)

```
[Header]
[Centered tree or radial structure]
[Root concept at top/center]
[2–4 primary branches]
[Each primary branch with 2–4 leaf nodes]
[Color-coded by category]
[Footer]
```

### Pattern C — Comparative matrix (landscape)

```
[Header]
[Grid: rows = entities (vendors, sectors, …), columns = capabilities/dimensions]
[Cells: filled circles at varying alpha for intensity, OR symbols (●/◐/○) for categorical]
[Row labels left, column labels top (rotated 35° if needed)]
[Legend bottom-right]
[Footer]
```

### Pattern D — Timeline / roadmap (landscape)

```
[Header]
[Horizontal axis with 3–5 horizon markers (Q3 2025, Q1 2026, …)]
[Multiple parallel tracks (technology / regulation / commercial)]
[Milestones as dots; phases as rounded rectangles spanning ranges]
[Critical path highlighted in carmine]
[Footer]
```

### Pattern E — 2×2 framework (square)

```
[Header]
[Two axes labeled at midpoint, with arrow markers indicating direction]
[Four quadrants with subtle background fill]
[Quadrant labels in italic display type, near outer corners]
[6–10 entities plotted as labeled dots]
[Footer]
```

---

## What to avoid

| Don't | Do |
|---|---|
| Use 6+ colors | Stick to 2–3 accents + neutrals |
| Fill the canvas edge-to-edge | Leave 60+ units of margin |
| Use drop shadows | Use a hairline rule below cards if separation is needed |
| Use 3D effects, gradients, or "glass" styles | Flat fills, optionally with 5–10% alpha for layering |
| Use icons from Material/Font Awesome | Use letterforms, geometric primitives, or none |
| Crowd labels on top of strokes | Move labels into clear whitespace; use leader lines if needed |
| Mix typeface families beyond the three declared | Stick to display / body / mono |
| Use `text-anchor="end"` for primary labels | Prefer `start` or `middle` for legibility; reserve `end` for right-aligned axes |

---

## Final checklist per SVG

Before writing the file, verify:

- [ ] viewBox matches landscape (1200×800) or square (900×900)
- [ ] Header strip with schema number + title + subtitle
- [ ] All text uses `.display`, `.body`, or `.mono` class
- [ ] Palette uses **at most** 2–3 accent colors + neutrals
- [ ] Strokes follow the weight scale (1.25 default, 2.5 emphasis, 0.5 hairline)
- [ ] All interactive regions have `class="interactive"` + `data-card="..."` + `tabindex="0"` + `role="button"` + `aria-label`
- [ ] At least one marker-arrow defined in `<defs>` if the schema has flows
- [ ] Annotations are numbered/lettered with leader lines (not floating text)
- [ ] Footer strip with source + optional methodology note
- [ ] No emoji, no clipart, no Material icons, no third-party SVG sprites
