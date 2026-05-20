# Bibliothèque partagée — `dossier-app.{js,css}`

Source unique de vérité pour le comportement et le style des patterns récurrents des apps deep-research du repo (`*/2026*-app.html`) : zoom plein écran, modal SCHEMAS, citations highlight, TOC observer, mobile panels, sources collapse desktop, sigil MG, topbar scroll, tooltips terms.

## Fichiers

- **`dossier-app.js`** (~440 lignes) — IIFE auto-bootstrap qui lit `window.SCHEMAS` et trouve les éléments DOM par ID conventionnel. Aucune API publique.
- **`dossier-app.css`** (~410 lignes) — patterns structurels uniquement. Les variables de thème (`--paper`, `--accent`, `--ink`, `--carmine`…) restent définies par chaque page sur `:root`.

## Inclusion dans une app

```html
<!-- Dans <head>, après les Google Fonts -->
<link rel="stylesheet" href="/assets/dossier-app.css">

<!-- Dans <body>, juste avant </body> -->
<script src="/assets/dossier-app.js" defer></script>
```

## Contrat DOM

La page doit fournir ces IDs/sélecteurs, sinon le bloc concerné se désactive silencieusement :

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

## Donnée requise inline

```html
<script>
  const SCHEMAS = { /* schema-id: { card-id: { title, body, eyebrow } } */ };
  const SOURCES = [ /* { n, citation, url, accessed } */ ];
  window.SCHEMAS = SCHEMAS;
</script>
```

## Modifier la lib

1. Éditer `/assets/dossier-app.js` ou `.css`.
2. Si la modification ajoute une fonction publique et/ou un sélecteur/ID, mettre à jour le fichier de fixtures correspondant : `tests/fixtures/expected-fns.json` pour les fonctions, `tests/fixtures/expected-ids.json` pour les sélecteurs. Une vraie évolution de pattern touche souvent les deux.
3. Re-run `node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs` localement.
4. Sur PR, vérifier visuellement 2-3 apps représentatives (les patterns peuvent avoir des effets de bord visuels).

## Migrer une app existante vers la lib

Le script `tools/extract_to_lib.py` est idempotent et fait le boulot pour les apps qui suivent le pattern :

```bash
python tools/extract_to_lib.py path/to/app.html
```

Pour les apps qui dérivent du pattern → migration manuelle, voir le code de `migrate_app()` pour comprendre les étapes.

## Tests CI

`node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs` tourne sur PR + push à main via `.github/workflows/test.yml`. Zéro dépendance, run < 5 secondes. Les apps non-migrées (s'il en reste) sont auto-skippées via une regex sur la présence de `<script src="/assets/dossier-app.js">`.

## Voir aussi

- **Patterns techniques généraux** (mobile, topbar, sidebars, callouts) : skill `.claude/skills/illustrated-deep-research/references/`.
- **Conventions éditoriales du site** (cadrage, workflow git, mode admin) : `CLAUDE.md` à la racine.
- **Suite de tests détaillée** + procédure de mise à jour du contrat fixtures : `tests/README.md`.
