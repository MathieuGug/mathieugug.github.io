# Spec — Bibliothèque partagée `dossier-app` pour les apps deep-research

**Date** : 2026-05-09
**Auteur** : Mathieu Guglielmino (avec l'aide d'une IA)
**Statut** : Design validé, à implémenter

## Contexte et problème

Le repo contient 14 fichiers `*/2026*-app.html` qui partagent le même squelette de comportement et de style :
- 14 apps × ~400 lignes de JS comportemental quasi-identique = **~5 600 lignes dupliquées**
- 14 apps × ~400 lignes de CSS pattern (`#zoom-overlay`, `#modal-root`, `.panel-close`, `.sigil-mark`, `#topbar`, `#sources-collapse-btn`, etc.) = **~5 600 lignes dupliquées**

Total : **~11 000 lignes** que l'on peut centraliser sans changer le rendu utilisateur.

Conséquences actuelles :
- Toute évolution du pattern (ex. fix de la position du bouton sources-collapse, cf. CLAUDE.md) demande 14 éditions parallèles, sources d'inconsistances.
- Les apps anciennes dérivent silencieusement quand on oublie de propager une amélioration.
- La skill `illustrated-deep-research` doit maintenir un template de 1 583 lignes en miroir, alors qu'une app neuve pourrait n'avoir que sa data + ses schémas.

Le repo est une vanilla HTML/CSS/JS sur GitHub Pages : `main = ce qui est servi`, pas de build pipeline.

## Objectifs

1. **Source unique de vérité** pour le comportement et le style des patterns récurrents (zoom, modal, panel, sigil, topbar, citations, TOC, sources-collapse, tooltips).
2. **Suite de tests anti-régression** détectant qu'une page dérive du contrat (test statique, zero-dep, run en CI sur PR vers `main`).
3. **Préserver intégralement le rendu utilisateur** sur les 14 apps existantes — aucun changement perceptible visuel ou comportemental.

## Non-objectifs

- Ne couvre pas les slideshows (4 fichiers), journaux, scrollies, livre interactif. Ces formats suivront dans une itération distincte si la première passe.
- Pas de tests Playwright / runtime (validation comportementale réelle reste manuelle au moment du merge — checklist documentée).
- Pas de minification, pas de bundling. La lib est un `.js` et un `.css` en clair, lisibles au runtime.
- Pas d'introduction de framework (vanilla JS only — cohérence avec l'esprit du repo).

## Architecture

```
/assets/
  dossier-app.js          ← IIFE auto-bootstrap, lit window.SCHEMAS, câble tout
  dossier-app.css         ← styles structurels des patterns partagés

/tools/
  extract_to_lib.py       ← script de migration idempotent

/tests/
  lib-contract.test.mjs    ← tests sur la lib elle-même
  apps-integration.test.mjs ← tests sur chaque app
  README.md                ← scope / limitations des tests
  fixtures/
    expected-fns.json     ← noms de fonctions devant vivre dans la lib
    expected-ids.json     ← IDs/sélecteurs requis par la lib

.github/workflows/
  test.yml                ← CI : node --test tests/

(modifié : .claude/skills/illustrated-deep-research/assets/app-template.html)
(modifié : CLAUDE.md — ajout d'une section "Bibliothèque partagée /assets/")
```

### Répartition des responsabilités

**Reste inline dans chaque page** :
- `<style>` avec les variables de thème (`:root { --paper, --accent, --carmine, --ink, --graphite, --rule, --serif, --mono... }`) et les styles spécifiques au contenu (titres, lede, layout du report).
- `<script>const SCHEMAS = {...}; window.SCHEMAS = SCHEMAS;</script>` — donnée éditoriale.
- Le HTML : structure du report, schémas SVG inline, sidebar Sources, topbar, etc.

**Sort dans la lib** :
- Tout le JS comportemental (~400 lignes) : modal, zoom, citations, TOC observer, panels mobile, sources collapse, sigil injection, topbar scroll.
- Tout le CSS structurel des 7 patterns (~400 lignes) : `#zoom-overlay`, `#modal-root`, `.panel-close`, `.sigil-mark`, `.topbar`, `#sources-collapse-btn`, `#sources-expand-btn`, etc. Les variables CSS (`var(--accent)`, `var(--paper)`, `var(--ink)`) restent référencées et résolues au runtime par les valeurs définies dans la page → si une page définit une `--accent` différente, la lib s'adapte automatiquement.

## Contrat lib ↔ page

La lib est entièrement passive. Elle se réveille sur `DOMContentLoaded`, lit `window.SCHEMAS`, trouve les éléments DOM par ID conventionnel, câble les handlers. Aucun export public, aucune API à invoquer.

### IDs et sélecteurs requis (la page doit les fournir)

| Pattern | IDs / sélecteurs |
|---|---|
| Zoom plein écran | `#zoom-overlay`, `#zoom-stage`, `#zoom-content`, `#zoom-caption`, `#zoom-hint`, `.zoom-close`, `.zoom-in`, `.zoom-out`, `.zoom-reset` |
| Modal SCHEMAS | `#modal-root`, `#modal-eyebrow`, `#modal-title`, `#modal-body`, `[data-close]` |
| TOC + Sources sidebars | `#toc`, `#sources`, `#toggle-toc`, `#toggle-sources`, `.panel-close` |
| Sources collapse desktop | `#sources-collapse-btn`, `#sources-expand-btn`, `.layout` (parent) |
| Topbar scroll | `#topbar` |
| Citations inline | `.cite[data-cite="N"]` → cible `#source-N` (li dans `#sources`) |
| Tooltips glossaire | `.term` |
| Schémas zoomables | `figure.figure > svg` |
| Régions interactives SVG | `svg[data-schema-id]` avec descendants `.interactive[data-card="…"]` |
| Sigil MG | `figure.figure` (la lib injecte `.schema-sigil` à l'intérieur) |

### Données globales requises

```js
window.SCHEMAS = {
  'schema-id': {
    'card-id': { title: '…', body: '<p>…</p>', eyebrow: '…' }
  }
};
```

### Comportements gracieux

- Si `window.SCHEMAS` n'existe pas, le modal ne s'ouvre simplement pas. Aucune erreur console. Toutes les autres features fonctionnent.
- Si un ID requis manque (ex. la page n'a pas de `#zoom-overlay`), le bloc concerné se désactive silencieusement (`if (!overlay) return;`). Pattern déjà présent dans le code actuel.

### Fix collatéral : clé localStorage générique

Aujourd'hui chaque app utilise la clé `obs-sources-collapsed` (héritée du dossier observabilité, copiée verbatim). Conséquence non intentionnelle : replier les sources sur une page les replie sur les 13 autres. La lib utilisera `dossier-sources-collapsed` (générique, partagée par design — c'est ce qui se passe déjà dans les faits, mais via le mauvais chemin). État existant des utilisateurs courants : reset au défaut "déplié". Mentionné dans la PR description.

## Tests statiques (zéro dépendance)

Tournent en `node --test tests/` (Node ≥ 20). Pas de `package.json`, pas d'install. Run < 5 secondes.

### A — Lib intégrité (`lib-contract.test.mjs`)

- `dossier-app.js` parse comme JS valide via `vm.compileFunction(content)`.
- `dossier-app.js` contient les marqueurs de fonctions attendues (regex sur les noms listés dans `fixtures/expected-fns.json`) : `setupZoom`, `setupSourcesToggle`, `openModal`, `closeModal`, `closeZoom`, `openZoom`, `fitToStage`, `setCollapsed`, etc.
- `dossier-app.css` est non vide et contient les sélecteurs clés (regex via `fixtures/expected-ids.json`) : `#zoom-overlay`, `#modal-root`, `.panel-close`, `.sigil-mark`, `#topbar`, `#sources-collapse-btn`.

### B — Apps respectent le contrat (`apps-integration.test.mjs`)

Pour chaque `*/2026*-app.html` (glob auto, pas de liste hardcodée) :
- Inclut un `<script src="/assets/dossier-app.js"` (defer optionnel).
- Inclut un `<link rel="stylesheet" href="/assets/dossier-app.css"`.
- Définit `window.SCHEMAS` (regex `window\.SCHEMAS\s*=` ou `const SCHEMAS\s*=` suivi quelque part de `window.SCHEMAS = SCHEMAS`).
- Contient les IDs racines requis : `#zoom-overlay`, `#modal-root`, `#toc`, `#sources`, `#topbar`. (Pas tous les sub-IDs — juste les conteneurs racines, pour rester souple sur les variations internes.)
- **N'inclut pas de copies inline** des fonctions extraites : regex négatif sur `function setupZoom\b`, `function setupSourcesToggle\b`, `function openModal\b`, etc., dans le HTML. C'est le check anti-régression principal — si quelqu'un (humain ou Claude futur) recolle du JS inline, le test casse.

### C — Cohérence du dossier

- Tous les `*-app.html` listés dans `index.html` racine existent et passent les checks B (pas d'orphelins).
- Toute app contenant un `figure.figure svg` contient aussi `#zoom-overlay` (sinon le bouton de zoom apparaît mais ne fait rien — bug silencieux).

### Limitations explicites (à documenter dans `tests/README.md`)

- **Pas de validation comportementale runtime** : les tests ne vérifient pas que le modal s'ouvre vraiment au clic, que `fitToStage` calcule la bonne échelle, que les pinch gestures fonctionnent. Seul Playwright attraperait ces bugs — accepté hors scope.
- **Pas de check visuel ou d'a11y automatisé**.
- **Pas de check cross-navigateur**.

### CI

```yaml
# .github/workflows/test.yml
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
        with: { node-version: '20' }
      - run: node --test tests/
```

Pas de `npm install`. Le workflow tourne aussi sur push à `main` pour rattraper d'éventuels push directs hors PR (cohérent avec la règle CLAUDE.md "main = ce qui est publié").

## Plan de migration (3 PRs)

### PR 1 — Lib + référence + tests + CI

- Crée `/assets/dossier-app.js` et `/assets/dossier-app.css` extraits depuis `observabilite-agents-ia/20260430-observabilite-agents-ia-app.html` (déjà la référence canonique selon CLAUDE.md).
- Migre **uniquement cette app** : retire le JS comportemental et le CSS pattern, ajoute `<script src>` et `<link rel>`.
- Ajoute `tools/extract_to_lib.py` (mais ne le run pas encore en masse).
- Ajoute la suite de tests + CI workflow.
- Diff estimé : ~1 500 lignes (lib créée + 1 app migrée + tests + CI).
- Validation manuelle : ouvrir l'app de référence en local, vérifier zoom, modal, citations, TOC, sources collapse, panneaux mobile (Cmd+Alt+M ne s'applique pas ici, c'est sur les hubs).

### PR 2 — Migration de 4-5 apps via le script

- Run `python tools/extract_to_lib.py` sur 4-5 apps (à choisir, idéalement les plus récentes pour minimiser la dérive).
- Le script flag automatiquement les apps avec divergence > seuil par rapport à la référence → traitement manuel.
- Tests CI doivent passer.
- Validation manuelle : ouvrir 1-2 apps migrées dans le navigateur, sanity check zoom/modal.

### PR 3 — Migration des ~9 dernières apps + skill template + CLAUDE.md

- Run le script sur les apps restantes.
- Met à jour `.claude/skills/illustrated-deep-research/assets/app-template.html` pour qu'il utilise la lib d'office (les futurs rapports générés via la skill héritent du pattern).
- Met à jour `CLAUDE.md` avec une nouvelle section "Bibliothèque partagée `/assets/dossier-app.{js,css}`" qui documente le contrat et la marche à suivre pour modifier la lib.

### Détails du script `tools/extract_to_lib.py`

- **Locate** : trouve le `<script>` qui contient l'ancre `// DATA — replace these placeholders` (présente dans toutes les apps en l'état) et son `</script>` correspondant.
- **Split** : sépare ce qui doit rester (la définition `const SCHEMAS = {...}; const SOURCES = ...;` + ajout `window.SCHEMAS = SCHEMAS;`) de ce qui doit partir (tout le JS qui suit la définition de data).
- **Validate** : compare le bloc qui part avec le contenu de la lib. Normalisations tolérées par défaut : différence sur la clé localStorage (`obs-sources-collapsed` → `dossier-sources-collapsed`), différences de whitespace pur, différences de commentaires. Toute autre divergence (logique, sélecteur, valeur numérique) → refuse la migration auto et flag pour revue manuelle. Output : nom du fichier + diff unifié résumé sur les lignes divergentes.
- **Rewrite JS** : remplace le bloc behavior par `<script src="/assets/dossier-app.js" defer></script>` placé juste avant `</body>`.
- **Rewrite CSS** : repère le bloc des patterns partagés. Stratégie hybride :
  1. Si la référence contient les marqueurs `/* dossier-app:patterns:start */` … `/* dossier-app:patterns:end */` (ajoutés dans la PR 1 lors de l'extraction initiale), le script cherche les mêmes marqueurs dans la cible. Si présents → coupe propre.
  2. Fallback heuristique : détecte la zone par les sélecteurs caractéristiques (`#zoom-overlay`, `.panel-close`, `.sigil-mark`) qui apparaissent toujours groupés. Coupe au premier et dernier sélecteur de cette famille.
- **Insert link CSS** : ajoute `<link rel="stylesheet" href="/assets/dossier-app.css">` dans le `<head>`, après les Google Fonts.
- **Idempotent** : si déjà migré (présence de `<script src="/assets/dossier-app.js">`), ne fait rien et ne touche pas le fichier.

### Marqueurs CSS

La PR 1 ajoute les marqueurs dans la lib elle-même (commentaires en début et fin de la section pattern). Ils ne sont pas requis dans les apps cibles avant migration — le détecteur heuristique les retrouvera. Mais une fois migrée, l'app n'a plus de bloc CSS pattern (c'est dans la lib), donc plus de marqueurs nécessaires côté app.

### Risques et mitigations

| Risque | Mitigation |
|---|---|
| Une app a customisé subtilement son CSS (couleur de zoom-btn, taille de modal…) | Le script refuse la migration auto et flag pour revue manuelle. Le mainteneur traite ces cas en éditant le code à la main puis valide visuellement. |
| Régression visuelle non détectée par les tests statiques | Checklist de PR : ouvrir 2-3 apps migrées dans le navigateur, vérifier zoom/modal/citations avant merge. Documenté dans `tools/extract_to_lib.py --help` et `tests/README.md`. |
| La clé `localStorage` change → état "sources-collapsed" perdu | Cosmétique, état revient au défaut (déplié). Mentionné dans la PR description. |
| Script de migration corrompt un fichier | Idempotence + commit dédié par batch d'apps → `git revert` propre par batch si besoin. |
| Quelqu'un push direct sur `main` du JS inline qui bypass la lib | Le CI sur push à `main` casse → PR rouge visible. (Ne bloque pas le push, GitHub Pages peut servir un main rouge — c'est un compromis accepté car le repo n'a pas de branch protection en place.) |
| Future Claude session (re)copie le JS dans une page | Section CLAUDE.md "Bibliothèque partagée" + tests CI rouges → fail rapide. |

## Critères de succès

1. Les 14 apps sont migrées et utilisent toutes `<script src="/assets/dossier-app.js">` et `<link rel="stylesheet" href="/assets/dossier-app.css">`.
2. La suite de tests passe (`node --test tests/` retourne exit 0) sur `main` après PR 3.
3. CI GitHub Actions configuré et tournant sur PR + push à main.
4. Le rendu visuel et comportemental des 14 apps est inchangé (vérifié manuellement sur un échantillon de 4-5 apps couvrant des dossiers variés).
5. `CLAUDE.md` documente la lib, son contrat, et le workflow pour la modifier.
6. La skill `illustrated-deep-research` génère désormais des apps qui héritent de la lib d'office.
7. **Mesure de duplication post-migration** : `wc -l` des `*/2026*-app.html` doit avoir baissé de ~5 600 lignes (suppression du JS) + ~5 600 lignes (suppression du CSS) = ~11 000 lignes de moins. La lib seule fait ~800 lignes. Net : ~10 200 lignes de duplication retirées.

## Hors scope (itérations futures)

- Slideshows (4 fichiers) : ils partagent le modal/zoom/SCHEMAS mais ont en plus un moteur SCENES + transitions specific. Refactor analogue mais design séparé.
- Journal `proces-musk-altman/journal.html`, scrollies (`anatomie/scrolly.html`, `proces-musk-altman/scrolly.html`), livre interactif `anatomie/livre.html`, gouvernance scrolly. Chacun a ses cas particuliers (pin sticky, livre flipping, masthead).
- Tests Playwright pour validation comportementale runtime.
- Bundling/minification de la lib pour réduire la taille servie.
