# Output — templates + design system

## Templates

Two HTML templates with `{{PLACEHOLDER}}` substitution (string.replace, no
Jinja) :

- `assets/edition-template.html` — one weekly edition
- `assets/hub-template.html` — the `veille-presse/index.html` hub

## Placeholders

**edition-template.html** :
- `{{TITLE_DRAFT}}` — auto-generated 1-line title (editable post-merge)
- `{{DATE_LONG}}` / `{{DATE_LONG_UPPER}}` — "17 mai 2026" / upper
- `{{DOSSIER_CONTEXT}}` — topbar middle text
- `{{N_ITEMS}}`, `{{N_SOURCES}}` — counters
- `{{TAGS_DOMINANT}}` — top 3 tags of the edition
- `{{BODY_SECTIONS}}` — H2-per-source sections, generated server-side

**hub-template.html** :
- `{{EDITION_CARDS}}` — antichrono `<a class="edition-card">` blocks

## Design system

Strict respect of the repo's CLAUDE.md :
- Vars : `--bg #faf6ec`, `--accent #b8582e`, `--text #1e1e2a`
- Fonts : Fraunces (serif) / Inter (sans) / JetBrains Mono (mono)
- Topbar 3-items obligatoire sur l'édition (Mathieu · titre dossier · Hub/Accueil)
- Topbar 2-items sur le hub
- Mobile : 7 points (overflow-x hidden, padding adapté, etc.)
- `<mark>` highlight NOT auto-applied — Mathieu adds them by hand post-merge if needed

## OG cards

Generated via `tools/og-card.py` with `--kind veille` (style à définir si le
script ne le supporte pas encore — par défaut, fallback sur la charte
existante avec accent orange sur un mot du titre).
