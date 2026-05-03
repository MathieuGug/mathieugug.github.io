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

## Schémas SVG

- **Flèches → cibles** : laisser **un blanc visible** entre la pointe de la flèche et le bord de la boîte cible (≈ 12–18 px en unités SVG). Ne jamais terminer une flèche pile sur le bord d'un rectangle — avec `marker-end`, l'œil lit ça comme une pénétration dans la boîte.
- **Origine des flèches issues d'une forme** (cercle, ellipse, hub) : démarrer la ligne **sur le périmètre de la forme**, dans la direction de la cible, pas depuis le centre ni depuis le haut/bas par défaut. Sinon la flèche traverse la forme et se chevauche avec son texte. Pour un cercle `(cx, cy, r)` visant `(tx, ty)` : `start = (cx + r·dx/L, cy + r·dy/L)` avec `(dx, dy) = (tx-cx, ty-cy)` et `L = √(dx²+dy²)`. Ajouter ~4 px de respiration au-delà du périmètre si la forme a un halo ou un stroke épais. Cas de référence corrigé : flèches du schéma « Partly » de `proces-musk-altman/journal.html` — départs `(492, 387)`, `(600, 452)`, `(708, 387)` autour d'un cercle `(600, 330, r=118)`.
- **Alignement** : centrer la flèche sur le **milieu horizontal** de la boîte cible, pas sur une position arbitraire à l'intérieur. Pour une boîte `x=80, width=320`, viser `x=240`.
- **Zoom obligatoire** : tout schéma SVG inline doit être agrandissable en plein écran (overlay + pan + zoom molette/pinch + Reset/Échap, bouton `⛶` au survol). Pattern de référence : `observabilite-agents-ia/20260430-observabilite-agents-ia-app.html` (CSS `.zoom-btn` + `#zoom-overlay`, IIFE `setupZoom()`). Pour une nouvelle page, copier le bloc et adapter les variables de couleur + le sélecteur (`.figure`, `.entry figure`, …) à la structure hôte.

## Mobile-friendliness

Tout artefact (hub + format[s]) **doit** être lisible sur petit écran (320–414 px). Avant de merger, vérifier ces 6 points :

1. **`overflow-x: hidden` sur `html, body`** (ou `overflow-x: clip` sur la `.layout` racine, **doublé** d'un `overflow-x: hidden` sur `body` pour les apps avec sidebars — `clip` sur `.layout` ne suffit pas si un élément déborde du body). Protection défensive, pas une excuse pour laisser passer un vrai dépassement.
2. **Topbar fixe** (`Mathieu Guglielmino` à gauche, `← Retour aux dossiers` à droite) : sous `@media (max-width: 560px)` réduire le padding (`12px 16px`), descendre la taille du nom serif à `14px` et celle du back mono à `9px` avec `letter-spacing: 0.16em`. Sous `@media (max-width: 380px)`, masquer le `<em>Guglielmino</em>` (`.topbar a:first-child em { display: none; }`) — sinon les deux liens se chevauchent sur iPhone SE.
3. **Apps `header.site` + `main#report`** : la typographie mobile doit vivre dans le **même `@media (max-width: 1024px)`** que l'effondrement de `.layout` en colonne unique (et non dans un `@media (max-width: 640px)` séparé — sinon Chrome en mode « desktop site » reporte une viewport ≥ 980 px qui ne déclenche pas la version mobile, et le rapport reste à la taille desktop). Y mettre : `header.site { padding: 14px 16px; gap: 10px }`, `header.site h1 { font-size: 1.05rem; min-width: 0; overflow-wrap: break-word; word-break: break-word }`, `main#report { padding: 28px 18px 56px; max-width: 100%; min-width: 0 }`, `h1.report-title { font-size: 1.8rem; word-break: break-word }`, `.lead { font-size: 1.02rem }`, `h2`/`h3` à `1.25rem`/`1.05rem` avec `word-break: break-word`, et `.figure { max-width: 100%; overflow: hidden }` + `.figure svg { width: 100%; max-width: 100%; height: auto }` pour que les schémas SVG ne forcent pas la largeur. Doubler aussi avec `html, body { max-width: 100vw }` en plus de l'overflow-x.
4. **Schémas SVG** : `width: 100%; height: auto; max-width: 100%` sur le `<svg>`, et toujours fournir le bouton de zoom plein écran (cf. section ci-dessus). Sur mobile, le schéma rendu à 320 px de large devient illisible — le zoom est l'échappatoire.
5. **Sidebars Sommaire/Sources** : pattern `panel-close` obligatoire (cf. section *Apps interactives*).
6. **Blocs de code et formules (`<pre>`, `<code>` inline)** : un `<pre>` sans contrainte déborde la viewport sur mobile (formules, JSON, prompts XML — cas vu sur `evaluation-agentique` avec `TestCase = (Persona × Quest × Environment) → Expected Outcome`). Pattern obligatoire dans le bloc `main code` de chaque app : ajouter `overflow-wrap: anywhere` sur `main code` (casse les longs identifiants/URLs inline qui n'ont pas d'espace), puis une règle `main pre { margin: 1.5rem 0; padding: 14px 16px; background: var(--paper-2); border-radius: 4px; overflow-x: auto; max-width: 100%; font-size: 0.85em; line-height: 1.5; -webkit-overflow-scrolling: touch; }` qui rend le bloc scrollable horizontalement plutôt que de pousser la page, et un override `main pre code { background: transparent; padding: 0; border-radius: 0; font-size: 1em; overflow-wrap: normal; }` pour neutraliser le style inline et préserver les sauts de ligne du `<pre>`. Le `overflow-wrap: normal` interne empêche que le navigateur casse les lignes du bloc et fasse disparaître l'ascenseur horizontal. **Toute nouvelle app `header.site` + `main#report` doit embarquer ces trois règles**, même si elle ne contient pas encore de `<pre>` — la prochaine itération de contenu en aura.

## Bouton retour sur chaque page

Toute page publiée (hub, app, scrolly, livre, journal) embarque un lien `← Retour aux dossiers` pointant vers `../index.html#series`. Style : mono, `letter-spacing: 0.16–0.22em`, `text-transform: uppercase`, couleur dim (passe à `--accent`/`--carmine` au survol). Position selon le format :

- **Hubs et journal** : dans la `.topbar` fixe, à droite (le nom de l'auteur reste à gauche).
- **Apps `header.site`** : tout début du `<header class="site">`, juste avant `<span class="marker">`. Classe `.back`.
- **Scrolly plein écran** : pastille `position: fixed` en haut à droite (ou à gauche pour les anciens layouts) avec `backdrop-filter: blur`.
- **Livre** : pastille `.back-link` `position: fixed; top: 26px; left: 26px` symétrique du `.toc-toggle`.

## Apps interactives — sidebars Sommaire/Sources

Toute app long format avec sidebars `#toc` et `#sources` (les six études + tout nouvel app) **doit** embarquer le pattern de fermeture mobile :

- En CSS, dans `@media (max-width: 1024px)` : padding top de `64px` sur `#toc.open`/`#sources.open` (pour ne pas masquer le bouton), styles de `.panel-close` (`position: fixed; top:16px; right:16px; z-index:91`). Hors media query : `.panel-close { display: none; }`.
- En HTML : un `<button class="panel-close" type="button" aria-label="Fermer le sommaire">Fermer ✕</button>` en première position dans `<nav id="toc">` ET dans `<aside id="sources">`.
- En JS : (1) handler click sur `.panel-close` qui retire la classe `open` du parent ; (2) handler `keydown` global qui ferme tout panneau ouvert sur `Escape` (en s'effaçant si un `#zoom-overlay` ou un `#modal-root` est déjà ouvert, pour ne pas marcher sur leurs propres handlers Escape).

Pattern de référence : `proces-musk-altman/20260427-proces-musk-altman-app.html` (rechercher `panel-close`). **Nouvelle app = vérifier ces 3 points avant de merger**, sinon le panneau couvre tout l'écran sur mobile sans moyen de revenir en arrière.

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
