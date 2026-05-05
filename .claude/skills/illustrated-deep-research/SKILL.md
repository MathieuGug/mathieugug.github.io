---
name: illustrated-deep-research
description: Build a premium-grade illustrated deep research report on any topic, packaged as a ZIP containing (1) a Markdown report with editorial SVG schemas referenced via Obsidian syntax, (2) a standalone interactive HTML companion app that embeds the same schemas with clickable regions, modals on demand, tooltips for jargon, and a clickable sources sidebar, and (3) the SVG assets in an images/ folder. Trigger this skill whenever the user asks for a "deep research", "rapport approfondi", "rapport illustré", "illustrated report", "research dossier", "executive briefing", or any complete research deliverable on a substantive topic — even if they don't explicitly say "illustrated" or "interactive". Use it whenever the request implies polished, source-backed, multi-section research output rather than a quick answer.
---

# Illustrated Deep Research

A skill for producing publication-quality research deliverables: a sourced Markdown report + 5–10 editorial SVG schemas + a standalone interactive HTML companion app, all bundled in a ZIP.

The user is preparing client-facing or internal-strategic deliverables. Quality bar is high. Don't ship hand-wavy prose, generic stock-style infographics, or filler sources.

## What this skill produces

A single ZIP file containing:

```
YYYYmmdd-{topic-slug}/
├── YYYYmmdd-{topic-slug}-rapport.md       # the main report (Obsidian-compatible)
├── YYYYmmdd-{topic-slug}-app.html         # standalone interactive companion
├── images/
│   ├── YYYYmmdd-01-{schema-slug}.svg
│   ├── YYYYmmdd-02-{schema-slug}.svg
│   └── ...                                # 5–10 SVG schemas total
└── README.md                              # how to open the app, structure overview
```

The HTML file MUST be openable directly from disk by double-clicking — no server, no build step, no external dependencies beyond Google Fonts (loaded via CDN). The Markdown is Obsidian-compatible (image syntax `![alt|width](images/...svg)`).

The companion app ships with three baseline interactive features and two power-user features:
- **Baseline**: clickable schema regions opening modals; tooltips on technical terms; clickable citations highlighting the matching source in the right sidebar.
- **Power-user**: each schema can be opened **fullscreen** (hover reveals a ⛶ button — wheel/pinch to zoom, drag to pan, Esc to close); the sources sidebar can be **collapsed** on desktop via an edge toggle, with the state persisted in `localStorage` per report.

## Workflow at a glance

1. **Research** — conduct deep, parallel web searches; prioritize premium sources; web_fetch the most valuable for full text.
2. **Outline** — propose a 6–10 section outline to the user before writing (unless they explicitly say "go ahead and produce it").
3. **Draft the report** in Markdown with placeholders `[SCHEMA-01]` … `[SCHEMA-N]` where schemas will go.
4. **Design the schemas** — identify 5–10 conceptual visuals that genuinely add information beyond the prose. List them with one-line briefs and confirm if uncertain.
5. **Generate each SVG** in editorial style following `references/svg-editorial-style.md`. For each schema, also draft the modal content for every interactive region.
6. **Build the HTML companion app** following `references/companion-app.md` and `assets/app-template.html`. Inline all SVGs, all modal content, all tooltip definitions, all sources.
7. **Package** the ZIP, move to `/mnt/user-data/outputs/`, and present with `present_files`.

For the detailed step-by-step (research strategy, source quality bar, drafting standards), read `references/workflow.md`.

## Non-negotiable defaults (user preferences)

These are baked into every output:

- **Filenames always start with `YYYYmmdd`** in the user's local date format (today's date in the working session). Use the actual current date.
- **Markdown only** for the report — never `.docx`. Reference SVGs with `![alt|width](images/file.svg)` Obsidian syntax (default width: 1200 for landscape schemas, 900 for square ones).
- **Never inline `<svg>` tags inside the Markdown.** SVGs live as external files in `images/`. (The HTML app does inline them — that's a different file.)
- **Standalone HTML, no React, no build step.** Single `.html` file with embedded CSS and JS. Light mode by default.
- **Editorial style for SVGs** — refined, sourced-magazine aesthetic, not flat infographic generic. See `references/svg-editorial-style.md`.
- **Mobile-friendliness is non-negotiable.** Every shipped app must (a) ship `.panel-close` buttons inside `#toc` and `#sources` so a phone reader can close them, (b) keep header/main mobile typography inside the `@media (max-width: 1024px)` block (not a narrower `@640px`), (c) embed the defensive `html, body { max-width: 100vw } / body { overflow-x: hidden }` pair, and (d) ship the `main pre` + `main code` overflow rules even if the report has no `<pre>` yet. Full pattern in `references/companion-app.md` → "Mobile-friendliness & panel close".
- **Premium sources only.** Tier-1 institutions, peer-reviewed papers, primary documents, official corporate or governmental publications, recognized industry reports. No content farms, no SEO listicles, no Medium opinion pieces unless the author is a notable expert. See `references/workflow.md` for the source quality rubric.
- **Language** — match the user's working language. Mathieu typically works in French; default to French unless the topic is clearly English-context (anglophone case study, English-named technology with no French equivalent term).
- **Citation style** in the Markdown report: numbered footnotes `[^1]` with a `## Sources` section at the end. In the HTML app, every numbered citation in the body is a clickable link that opens/highlights the source in the right sidebar.

## Cadrage : publication personnelle, pas livrable d'entreprise

The report is published under the author's **personal name**. It does not engage any organization. This is a hard rule — Mathieu publishes these reports on his personal site (mathieugug.github.io and similar) and any mention of a company name signals a corporate deliverable, which this is not.

- **App header**: `{date} · {Prénom Nom} ·` (never an organization name, never "practice", "équipe", "cabinet", "firm", "team").
- **Report.md byline**: `> **{thèse}** — {date}, {Prénom Nom}`.
- **README.md author line**: `> {date} — {Prénom Nom}` (no organization).
- **Schema legends and methodology notes**: no organization name. If you cite a proprietary analytical grid, write "grille analytique propriétaire" or "cadre analytique de l'auteur" — never the company's name.
- The **only** acceptable place for an organization mention is the footer of the host site's hub page, which is **outside the scope of this skill**. Don't render it inside the report or app.

This rule applies even if the user supplies an organization name in their brief — confirm with them before including it anywhere other than a hub footer outside this skill's output.

## Template hygiene (non-negotiable)

The companion app template (`assets/app-template.html`) is a scaffold. Two failure modes have been observed in past deliveries — both must be prevented:

1. **No HTML comments wrapping the report.** The template must not contain `<!-- ... -->` blocks that document the markers (e.g., the legacy "ILLUSTRATED DEEP RESEARCH — COMPANION APP TEMPLATE" comment at the top). Any such doc comment must be deleted before the file is shipped — or, better, kept out of the template entirely. Comments inside the `<style>` and `<script>` (using `/* ... */` and `//`) are fine; HTML comments at the document level are not.
2. **No unfilled `{{MARKER}}` placeholders.** Before zipping, grep the deliverable for `{{`, `[SCHEMA-`, `{tooltip:` — if any of these patterns survive, the marker has not been replaced. Fix it. Markers that are no longer needed (because the feature is unused in this report) must be deleted, not left in.

## When in doubt, route here

| If you need to know about… | Read this file |
|---|---|
| Step-by-step execution (research, drafting, packaging) | `references/workflow.md` |
| How to design SVGs in editorial style (palette, type, layout, annotation grammar) | `references/svg-editorial-style.md` |
| HTML app architecture (layout, modal system, tooltips, sources sidebar, JS) — and the **mobile-friendliness + panel-close + `<pre>`/`<code>` overflow** patterns required by the host site's `CLAUDE.md` | `references/companion-app.md` |
| Working HTML scaffold to start from | `assets/app-template.html` |
| Helper to assemble the app from fragments (avoids 1500-line Edit chains) | `assets/build-app.py` |

## Avoid token-heavy app rewrites — use `assets/build-app.py`

Rebuilding the companion app by repeatedly editing a 1500–2000 line HTML
through `Edit()` calls is the single biggest token sink in this skill. Every
report swaps the same three blocks: the `<main id="report">` body, the
`<ol id="sources-list">` entries, and the `const SCHEMAS = {…};` JS object.
The CSS/JS framework around them — modal dispatcher, tooltip floater, zoom
overlay, sticky sidebar collapse, panel-close, mobile rules — is identical
from one report to the next.

`assets/build-app.py` does the swap in one pass. Recommended workflow:

1. **Pick a host scaffold.** Either `assets/app-template.html` (clean template
   with `{{MARKER}}` placeholders) or, more often, the most recent shipped app
   from the host site (e.g.
   `ia-et-travail/20260504-ia-et-travail-app.html`) — its framework is already
   battle-tested against the host site's `CLAUDE.md` mobile/sticky/panel
   rules. If reusing a shipped app, do a few targeted `Edit()` calls first on
   the header (`<title>`, `<meta description>`, `header.site h1`, byline, the
   `.md` download link) and the TOC `<ol>`. Those small edits are cheap.
2. **Author three fragment files** in the working directory:
   - `main-fragment.html` — the report body, with `<!--INLINE-SVG:01-->`,
     `<!--INLINE-SVG:02-->` … markers wherever a `<figure class="figure">`
     should embed an SVG. Use the same `<figure class="figure" id="fig-NN">`
     wrapper around each marker so the zoom IIFE picks them up.
   - `sources-fragment.html` — the `<li id="source-N">…</li>` entries (static
     HTML, short host labels per the companion-app reference).
   - `schemas-fragment.js` — the bare object literal
     `{ "schema-01": {…}, "schema-02": {…}, … }` (no `const SCHEMAS = `
     prefix, no trailing semicolon — the script wraps it).
3. **Run the helper:**
   ```
   python3 .claude/skills/illustrated-deep-research/assets/build-app.py \
     --host    path/to/host-scaffold.html \
     --main    main-fragment.html \
     --sources sources-fragment.html \
     --schemas schemas-fragment.js \
     --images  path/to/images-dir \
     --out     path/to/final-app.html
   ```
   The script inlines each SVG (with `data-schema-id="schema-NN"` injected on
   the root `<svg>` tag, stripping any `<?xml ... ?>` prologue), then swaps
   the three blocks in the host file. It errors loudly on missing markers or
   malformed fragments — fail-fast is the point.
4. **Verify.**
   `grep -nE '\{\{|\[SCHEMA-|\{tooltip:|<!--\s*INLINE-SVG' final-app.html`
   must return nothing. Open the file in a browser to sanity-check.

Tooltips remain inline as `data-tooltip="…"` attributes on `<span class="term">`
elements inside the main fragment — there is no separate `TOOLTIPS` JS dict to
swap. Tooltips inside modal `body` strings work the same way (the floater is
body-level, escapes the modal's overflow context).

## Output location

Always write the working folder to `/home/claude/{topic-slug}/` first, then ZIP it and move the ZIP to `/mnt/user-data/outputs/`. Use `present_files` on the ZIP at the end.

The user wants to **see the deliverable, not a long postscript explanation**. After presenting the ZIP, write 3–5 sentences max summarizing what's inside (number of sections, schema count, source count, any notable methodological choices). Don't restate the report's content.

## Calibrating depth

The user calibrates report length by topic complexity, not by inflating prose. Approximate guideline:

- **Compact briefing** (~2,500–4,000 words, 5–6 schemas) — for a focused question with a clear answer
- **Standard deep research** (~5,000–8,000 words, 7–8 schemas) — the default for most strategic topics
- **Extended dossier** (~10,000–15,000 words, 8–10 schemas) — for landscape/market analyses or multi-actor topics

If unsure, ask the user once before drafting. Better one quick clarification than a 12,000-word report when they wanted 4,000.

## Quality self-check before packaging

Before zipping, verify:

- [ ] Every schema is referenced from the prose with a "see Schema N" cue and adds information beyond the text
- [ ] Every interactive SVG region has authored modal content (no dead clicks)
- [ ] Every obscure term in the report has a tooltip definition in the HTML app
- [ ] Every source has: full citation, URL, accessed date, and is reachable from the body via numbered link
- [ ] HTML opens cleanly from `file://` (no `fetch()` of local resources, no module imports requiring a server)
- [ ] Filenames all start with `YYYYmmdd`
- [ ] The MD has no inline `<svg>` blocks (only `![alt|width](images/...)` references)
- [ ] The README.md inside the ZIP explains how to open the app and what each file is
- [ ] **Author is the user's personal name** (e.g., "Mathieu Gug") — no organization name appears anywhere in the report, app, or README
- [ ] **No HTML comments wrapping the document or marker doc-blocks** in the shipped HTML (run `grep -n '<!--' app.html` — only short inline comments at most)
- [ ] **No unfilled `{{...}}`, `[SCHEMA-...]`, or `{tooltip:...}` markers** survive in any deliverable file (run `grep -rE '\{\{|\[SCHEMA-|\{tooltip:'`)
- [ ] Fullscreen schema zoom works on each figure (hover reveals the ⛶ button); pressing Esc closes it
- [ ] Sources sidebar collapse/expand toggle works on desktop and persists across reloads (localStorage)
- [ ] **Sources sidebar stays pinned while scrolling** (`#sources` has `position: sticky; top: 0; align-self: start; height: 100vh` plus the transition, all on the SAME selector). No second `aside#sources { position: relative; … }` rule — it would override sticky by specificity. Verify on a long report: scroll past the first viewport, the sidebar must still be visible.
- [ ] **Sources are static HTML, not JS-generated.** `<ol id="sources-list">` contains one `<li id="source-N">` per source written directly in the body. Each `<a>` uses a short host label (`nber.org ↗`, `arxiv.org/2301.04104 ↗`) — never the full URL. `cite-num` has no brackets in the source text (brackets are CSS-generated on `.cite` only). Pattern in `references/companion-app.md` → "Static HTML for sources".
- [ ] Tooltips on terms render fully readable **even inside modals** — they should escape the modal box and clamp to viewport edges, not get clipped by `overflow-y: auto`
- [ ] **Mobile panel close** — `.panel-close` button is present as the first child of `<nav id="toc">` and `<aside id="sources">`; tapping it removes the `.open` class; pressing Esc on mobile also closes any open panel (but yields to zoom/modal). Test on a real ≤414 px viewport.
- [ ] **Mobile typography is inside the `@media (max-width: 1024px)` block** (not a separate `@640px`) — otherwise Chrome desktop-site mode on a phone keeps the report at desktop size.
- [ ] **Defensive overflow** is in place: `html, body { max-width: 100vw }`, `body { overflow-x: hidden }`, `.layout { overflow-x: clip }`. No horizontal scrollbar on a 320 px viewport.
- [ ] **`main pre` + `main code` overflow rules** shipped — `<pre>` blocks scroll horizontally rather than pushing the page wider; long inline identifiers in `<code>` break with `overflow-wrap: anywhere`; the `overflow-wrap: normal` reset on `pre code` is present.
- [ ] **`← Retour aux dossiers` back link** in `<header class="site">` (first child, before `.marker`), pointing to `../index.html#series`.
- [ ] **Schema modal dispatcher** still works after the mobile changes — clicking any `.interactive[data-card]` region opens its modal with title + body (and optional eyebrow); tapping outside or pressing Esc closes the modal first, then the panel underneath.
- [ ] **State-aware figure breakout on desktop** — under `@media (min-width: 1025px)`, `.figure` adapts to the sources panel state: **expanded** = fills the main grid cell only (`width: min(calc(100vw - 560px), 880px)`); **`.layout.sources-collapsed`** = extends to viewport-right (`width: calc(100vw - max(0px, (100vw - 1440px) / 2) - 240px)`). Mirrored negative `margin-left/right` align the figure's edges with the visible boundaries. Smooth 280 ms transition. `.figure-caption` re-anchored to 760 px centered max-width. Mobile keeps the figure inside its single column. See `references/companion-app.md` § 5 for the math.

If any check fails, fix it before delivering — don't ship and apologize.
