# CLAUDE.md — mathieugug.github.io

Site personnel de Mathieu Guglielmino, hébergé sur GitHub Pages. Il publie des artefacts publics : articles interactifs, études, dossiers de veille.

## Cadrage éditorial

- **Tout est publié au nom de Mathieu Guglielmino, à titre personnel.** Ces artefacts ne sont pas des livrables internes.
- **Lincoln** : mention légère, footer uniquement (`Mathieu Guglielmino · Practice Manager Lincoln`). Pas dans les hero, pas dans les en-têtes d'articles, pas dans les README, pas dans les sources/légendes des schémas.
- **Jamais de clients internes** ni de projets internes nommés. Si un nom de client apparaît dans un brouillon, demander avant de publier.
- **Disclosure IA** : chaque artefact porte une mention discrète `Format co-écrit avec l'aide d'une IA` (ou équivalent contextuel).

## Stack et conventions

- HTML/CSS/JS vanille. Chaque page est autonome (un dossier = un artefact).
- Polices : Google Fonts (Fraunces / Inter / JetBrains Mono).
- Palette définie en haut de `index.html` (`--bg #faf6ec`, `--accent #b8582e`, etc.). Réutiliser ces variables pour la cohérence visuelle.
- Illustrations : SVG inline pour l'accessibilité et l'interactivité.
- **Favicon** : `/favicon.svg` à la racine (monogramme MG italique sur fond accent). Toute nouvelle page HTML publiée doit inclure `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` dans son `<head>`.
- Pas de tracker, pas d'analytics, pas de tiers en dehors de Google Fonts.

## Structure du repo

- `index.html` racine — accueil (hero · Aujourd'hui · expertise · séries · parcours · footer).
- Un dossier par artefact (`anatomie/`, `gouvernance/`, `proces-musk-altman/`, …).
- **Chaque dossier d'artefact contient son propre `index.html`** qui sert de hub d'entrée. Le hub présente l'artefact (eyebrow + titre + lede + métadonnées) et liste les formats disponibles (1 ou plusieurs cartes). Quand l'artefact n'a qu'un format, le hub propose une seule grosse carte ; sinon, une grille.
- Les liens depuis l'accueil pointent vers le **dossier** (`anatomie/`, `gouvernance/`, …), jamais directement vers un fichier interne. C'est le hub qui aiguille ensuite.
- **Bouton retour des hubs** : pointe vers `../index.html#series` avec le label `← Retour aux dossiers` — ramène à la grille des séries de l'accueil, pas à la hero/CV.
- Un dossier peut aussi contenir : scrollytelling HTML, livre/app interactive, version print, README, médias.

## Index : tri et typologie

- Les séries sont listées en **ordre décroissant par date** (publication la plus récente en premier).
- Chaque tuile porte un badge de typologie : `Dossier`, `Veille`, `Étude`. Le badge `Veille` utilise la couleur `--accent`, les autres le fond sombre.
- Format de tag de date : `NN · jour mois année` quand la date est précise (ex. `03 · 27 avril 2026`), sinon `NN · Mois Année`. `NN` = numéro de publication, conservé même quand la grille est triée par date.

## Workflow

- Faire les changements → commit → **vérifier le diff du commit avant de pousser**. Le user a explicitement demandé cette étape pour rattraper d'éventuelles erreurs ou contenus qui viendraient d'autres contextes.
- Ne pas push automatiquement — attendre validation explicite.
- Préférer `git add <fichier>` ciblé plutôt que `git add .` (le dossier `.claude/` ne doit pas être commité).

## Création de PR

- `git` (commit, branch, push) : via Bash.
- **Création de la PR : via le MCP GitHub** (`mcp__github__create_pull_request`). Le binaire `gh` n'est pas installé dans cet environnement — ne pas tenter de l'invoquer ni de le contourner.
- Owner/repo pour le MCP : `mathieugug` / `mathieugug.github.io` (casse minuscule côté API, même si le remote git affiche `MathieuGug`).
- Ne jamais merger automatiquement. Mathieu merge à la main.
