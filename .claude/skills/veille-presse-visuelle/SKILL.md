---
name: veille-presse-visuelle
description: Weekly automated visual press review — crawls ~30 dataviz press sources, captures screenshots/GIFs/MP4 with Playwright, generates a public dossier in veille-presse/YYYY-MM-DD/, opens a PR and auto-merges. Triggered by Sunday 20h Europe/Paris cron via /schedule, or manually via `python -m tools.veille_presse.cli run`. Use when the Sunday cron fires, when user asks to run the press veille manually, or when a storage_state needs rebuilding.
---

# Veille presse visuelle

Skill that runs the weekly visual press review on `mathieugug.github.io`.

## Triggers

- **Sunday 20h Europe/Paris cron** (registered via `/schedule`) — fires `python -m tools.veille_presse.cli run` from the repo root
- **Manual invocation** — user says "lance la veille presse" or "fais tourner la veille" → run `python -m tools.veille_presse.cli run`
- **Storage state rebuild** — when a source's session has expired (skipped items in run-log for that source) → run `python tools/build-storage-state.py <slug>`

## Contract — what this skill produces

A new commit on `main` containing :
- `veille-presse/YYYY-MM-DD/index.html` — public edition page
- `veille-presse/YYYY-MM-DD/notes.md` — Obsidian-format notes
- `veille-presse/YYYY-MM-DD/og.png` — social card
- `veille-presse/YYYY-MM-DD/images/*.{png,gif,mp4}` — captures
- `veille-presse/index.html` updated (new card at the top)

## Workflow (2 phases)

### Phase 1 — Discovery + Capture (fully autonomous)

0. **Refresh gift-links cache** : search Reddit (r/nytimes, r/nytimesgiftarticles, r/WaPoGiftLinks) for shared `unlocked_article_code=` and `?gift=` URLs. Cached 14 days in `state/gift-links-cache.json`. Skippable via `--skip-gift-links`.
1. Load `sources.yml` + `state/last-crawl.json`
2. For each source in parallel (max 5): crawl `graphics_url`, diff vs seen URLs
3. For each new URL: fetch article HTML with **paywall fallback chain** : gift link → direct (storage_state) → archive.ph → Wayback Machine → skip
4. Score = `weight × (1 + 0.3 × is_interactive)`, cap shortlist at 15
5. Capture per item: full-page PNG + section PNGs + GIF/MP4 if interactive
6. Extract metadata (title, authors, date, tags)

### Phase 2 — Publication + Automerge

7. Render `notes.md` + `index.html` from templates
8. Update hub `veille-presse/index.html` (insert new card)
9. Generate `og.png` via `tools/og-card.py`
10. `git checkout -b veille/YYYY-MM-DD` + commit + push
11. Open PR via `mcp__github__create_pull_request` (read `state/mcp-pending.json` for the action sequence)
12. Auto-merge PR via `mcp__github__merge_pull_request` with `mergeMethod: squash`
13. Append `state/run-log.jsonl`

## Checklist before merge (post-publication audit, mensuel)

- [ ] Les screenshots full-page ne sont pas tronqués
- [ ] Les GIFs < 6 Mo, lisibles
- [ ] Les MP4 < 8 Mo, jouables en navigateur
- [ ] `notes.md` parse en Obsidian (galleries reconnues)
- [ ] `index.html` mobile 320 px et desktop 1920 px OK
- [ ] Topbar 3-items présente
- [ ] Hub `veille-presse/index.html` montre la nouvelle carte en tête
- [ ] `og.png` 1200×630 généré
- [ ] PR mergée et publiée sur GitHub Pages
- [ ] Aucune `storage_state` n'a expiré silencieusement (vérifier `run-log.jsonl`)

## MCP actions bridge

Phase 2 / step 11-12 ne peuvent pas être appelées depuis Python (les MCP tools sont disponibles uniquement dans la session Claude). Solution :

- `cli.py run` écrit `state/mcp-pending.json` décrivant la séquence d'actions à exécuter
- Le harness Claude (ou Mathieu lors d'un run manuel) lit ce fichier et exécute les MCP calls
- Une fois les actions complétées, le harness met à jour `run-log.jsonl` avec `pr_number` et `merge_sha`, puis supprime `mcp-pending.json`

## Stratégie paywall (les sources paywallées représentent ~60% du registre)

Pour les sources paywallées, la chaîne de fallback `crawler._fetch_article_with_fallback` essaie dans cet ordre :

1. **Gift link** trouvé sur Reddit (r/nytimes, r/nytimesgiftarticles, r/WaPoGiftLinks) — officiel, qualité visuelle parfaite. Couvre actuellement NYT + WaPo.
2. **storage_state Playwright** (cookies session de Mathieu, abonné) — si le fichier existe.
3. **archive.ph/newest** — snapshot pixel-perfect public.
4. **Wayback Machine** — snapshot le plus proche.
5. **Skip** — l'article tombe dans la section « Captures impossibles » de l'édition.

Détails dans `references/crawler.md`.

**Pour étendre la couverture gift links** : éditer `gift_links.REDDIT_SOURCES` (ajouter un slug + sa subreddit + sa regex d'URL gift). FT/Le Monde/Bloomberg/Mediapart etc. n'ont pas de communauté Reddit gift-link active — fallback sur archive.ph fonctionne.

**Sites bonus accessibles librement** (déjà dans `sources.yml`, sans paywall) : Reuters Graphics, The Pudding, Bellingcat, BBC Visual, ProPublica, The Markup, Pew, OWID, Datawrapper, Observable, FlowingData, IIB Awards. Ces sources fournissent la base de qualité de chaque édition même quand les paywalls résistent.

## Surfaces de configuration manuelle

- **`sources.yml`** — ajouter/retirer/repondérer une source
- **`tools/build-storage-state.py <slug>`** — rebuild d'une session Playwright expirée
- **`python -m tools.veille_presse.cli refresh-gift-links --verbose`** — rafraîchir manuellement le cache Reddit (cycle le fait automatiquement)
- **`veille-presse/YYYY-MM-DD/index.html` post-merge** — édition manuelle d'une coquille, ajout d'un `<mark>`, retrait d'une pièce

## Pour plus de détails

- **Crawler strategy + sélecteurs par source** → `references/crawler.md`
- **Capture pipeline (Playwright + ffmpeg)** → `references/capture.md`
- **Templates HTML + design system** → `references/output.md`

## Spec d'origine

`docs/superpowers/specs/2026-05-16-veille-presse-visuelle-design.md`
