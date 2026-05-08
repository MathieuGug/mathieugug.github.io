# SEO et social previews

Each report shipped on `mathieugug.github.io` must carry a complete SEO + social preview meta-tag block. Before this skill enforced it (May 2026), reports shipped with only `<title>` and `<meta name="description">` — when the URL was pasted in Slack/LinkedIn/iMessage, the resulting unfurl was a default-style "no thumbnail" tile. Since the site is the author's main public surface, every shareable URL must produce a branded card.

This file specifies the full block, the og:image generation pipeline, and where the markers live in the templates.

## What ships in every `<head>`

The block is wrapped in `<!-- og:start -->` / `<!-- og:end -->` markers — that pair is **mandatory** for the idempotent re-run logic of `tools/seo_dossiers.py` (the host repo's batch driver). If you author a new HTML file by hand, copy these markers verbatim around the block.

```html
<!-- og:start -->
<meta name="author" content="Mathieu Guglielmino">
<link rel="canonical" href="{{CANONICAL_URL}}">
<meta name="keywords" content="{{KEYWORDS}}">
<meta property="og:type" content="article">         <!-- "website" for hubs/index, "article" for content pages -->
<meta property="og:site_name" content="Mathieu Guglielmino">
<meta property="og:locale" content="fr_FR">
<meta property="og:url" content="{{CANONICAL_URL}}">
<meta property="og:title" content="{{TITLE}}">
<meta property="og:description" content="{{META_DESCRIPTION}}">
<meta property="og:image" content="{{OG_IMAGE_URL}}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{{TITLE}} — couverture social">
<meta property="article:published_time" content="{{PUBLISHED_DATE}}">
<meta property="article:author" content="Mathieu Guglielmino">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{TITLE}}">
<meta name="twitter:description" content="{{META_DESCRIPTION}}">
<meta name="twitter:image" content="{{OG_IMAGE_URL}}">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"{{TITLE}}","description":"{{META_DESCRIPTION}}","image":"{{OG_IMAGE_URL}}","url":"{{CANONICAL_URL}}","datePublished":"{{PUBLISHED_DATE}}","inLanguage":"fr-FR","author":{"@type":"Person","name":"Mathieu Guglielmino","url":"https://mathieugug.github.io/"},"publisher":{"@type":"Person","name":"Mathieu Guglielmino","url":"https://mathieugug.github.io/"}}
</script>
<!-- og:end -->
```

## Field-by-field rules

- **`{{CANONICAL_URL}}`** — absolute URL, always with the `https://mathieugug.github.io` origin. Hubs end with `/` (e.g. `https://mathieugug.github.io/mcp-plateforme/`), companion files name the file (e.g. `https://mathieugug.github.io/mcp-plateforme/20260508-mcp-plateforme-app.html`). Do **not** use relative URLs — Open Graph crawlers need absolute.
- **`{{OG_IMAGE_URL}}`** — absolute URL to the dossier's `og.png` (1200×630 PNG, NOT SVG — LinkedIn / Slack / Twitter do not render SVG OG images). Pattern: `https://mathieugug.github.io/{slug}/og.png`. The host site's root index uses `https://mathieugug.github.io/og-default.png`.
- **`{{TITLE}}`** — short, ≤ 60 chars when possible. Twitter truncates around 70.
- **`{{META_DESCRIPTION}}`** — 1 to 2 sentences, ≤ 200 chars (LinkedIn truncates around 200, Twitter at 200, Facebook at 300). Avoid bullet lists or numerical avalanche — Phrase for a human glancing at a tile, not for SEO scoring.
- **`{{KEYWORDS}}`** — 3 to 7 comma-separated keywords. Modern crawlers ignore `meta keywords` for ranking, but it's harmless and a few internal tools still parse it.
- **`{{PUBLISHED_DATE}}`** — ISO 8601 YYYY-MM-DD. Required when `og:type` is `article`.
- **`og:type`** — use `article` for content pages (the app, the slideshow, the scrolly, the journal, the livre). Use `website` only for the host site root index and dossier hub pages, since those are navigational.

## og.png generation pipeline

`tools/og-card.py` (in the host repo, not in the skill) renders 1200×630 PNG cards via PIL. It uses Cambria italic (Windows fallback for Fraunces — close in feel) for the title and Consolas for the eyebrow/footer, both shipped with Windows. Output dir is `{slug}/og.png`.

Inputs:
- `--title` — title text, ≤ ~60 chars renders best.
- `--eyebrow` — small uppercase mono line, e.g. `"Dossier 16 · 8 mai 2026"`.
- `--accent-word` — one word in the title rendered in accent orange (signature emphasis).
- `--kind` — `dossier` / `veille` / `etude`, badge in bottom-right.

Cards composition (top to bottom):
1. 5 px vertical accent bar at top-left + eyebrow line in mono uppercase.
2. Centered Cambria-italic title that wraps up to 4 lines (font auto-shrinks for long titles).
3. Hairline rule near the bottom, then `mathieugug.github.io` (mono dim) + `KIND | MG` (mono badge + italic monogram in accent).

If you ship a long-running visual identity update, the constants `PAPER`, `INK`, `ACCENT`, `DIM`, `RULE` at the top of `og-card.py` are the single source of truth. Don't fork.

## Batch driver `tools/seo_dossiers.py`

The host repo ships a single Python driver that:
1. Parses `index.html` to extract every dossier listed under `<a class="serie">` (slug, num, date, kind, title, sub).
2. For each dossier, calls `og-card.py` to (re)generate `{slug}/og.png`.
3. Iterates every `*.html` in the dossier folder, classifies it (hub/app/slideshow/scrolly/journal/livre/livre-print), and injects the SEO block before `<link rel="icon">`.
4. Treats `livre-print.html` files as exclusion (print-only, not for social previews).
5. Is idempotent: re-running on a file that already has `<!-- og:start -->` updates the existing block in-place.

Run examples:
```
python tools/seo_dossiers.py                                # full sweep
python tools/seo_dossiers.py --only mcp-plateforme          # one dossier
python tools/seo_dossiers.py --skip-images                  # only re-inject meta tags, skip og.png regen
python tools/seo_dossiers.py --dry-run                      # show what would happen, no writes
```

## When publishing a NEW dossier from this skill

This skill emits a ZIP. The ZIP itself does **not** contain `og.png` — generating the PNG requires Cambria/Consolas which are Windows-specific. The author drops the ZIP into the host repo, then runs:

```
python tools/og-card.py \
    --title "{{TITLE}}" \
    --eyebrow "{{KIND}} {{NUM}} · {{DATE_HUMAN}}" \
    --accent-word "{{ACCENT_WORD}}" \
    --kind {{KIND_LOWER}} \
    --output {{slug}}/og.png

python tools/seo_dossiers.py --only {{slug}}
```

The companion app's `<head>` ships with the SEO block already populated by the template if `build-app.py` filled in the `{{CANONICAL_URL}}`, `{{OG_IMAGE_URL}}`, `{{KEYWORDS}}`, `{{PUBLISHED_DATE}}` markers. If `build-app.py` is invoked before those markers are filled, the host's `seo_dossiers.py` overwrites the block in-place — both paths converge.

If you author the HTML by hand (one-off pitch, special-format page) without going through `build-app.py`:
- Insert the block manually using the snippet above.
- Make sure the file has `<link rel="icon">` so the batch driver's anchor regex matches on subsequent re-runs.

## Verification before push

After running the batch driver, eyeball:
1. `grep -c '<!-- og:start -->' **/*.html` — count must equal the number of HTML files (excluding livre-print).
2. Open one app in a browser → DevTools → Elements → confirm the block is in the head.
3. Use `https://www.opengraph.xyz/` or LinkedIn's Post Inspector with a deployed URL to check the unfurl. (Local file paths can't be tested by remote crawlers.)
4. Check og.png renders cleanly: open `{slug}/og.png` directly. Long titles must not overflow the safe area.

## Failure modes seen so far

- **og.png left as SVG** — Twitter/LinkedIn/Slack reject SVG. Always rasterize to PNG (or JPG); the og-card.py script does this by design.
- **Relative og:image URL** — crawlers fetch og:image asynchronously from a URL, so it must be absolute. Do not write `og.png` or `/og.png` alone — write the full `https://...` URL.
- **Mismatch between `<title>` and `og:title`** — happens when only the `<title>` is updated. The injection script reads the existing `<title>` directly, so this drift can't happen via the script. If you hand-edit, change both.
- **JSON-LD with raw quotes inside title** — escape `"` to `\"` inside the JSON. The skill's templates pre-escape, the batch driver uses `json.dumps`.

## Quality checklist (added to SKILL.md)

- [ ] Every shipped HTML has the `<!-- og:start -->` … `<!-- og:end -->` block in `<head>`.
- [ ] `og:image` points to an absolute `https://mathieugug.github.io/...png` URL — never SVG, never relative.
- [ ] og.png exists at `{slug}/og.png`, dimensions are exactly 1200×630.
- [ ] `og:title` matches `<title>` (the script enforces this; verify on hand-edits).
- [ ] `og:description` ≤ ~200 chars (avoid LinkedIn / Twitter truncation).
- [ ] Hubs use `og:type=website`; content files (app, slideshow, scrolly, journal, livre) use `og:type=article` + `article:published_time` ISO 8601.
- [ ] JSON-LD `Article` block present with `headline`, `description`, `image`, `url`, `datePublished`, `author`, `publisher`. No HTML in the strings.
- [ ] Twitter Card type is `summary_large_image` (matches the 1200×630 ratio).
