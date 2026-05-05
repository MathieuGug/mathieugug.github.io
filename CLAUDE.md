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
- **Surlignage stabilo (`<mark>`)** : signature visuelle du site, à utiliser pour les phrases-clés que je veux faire ressortir dans le corps narratif. En markdown : syntaxe Obsidian `==texte==` qui rend `<mark>texte</mark>`. Style : un dégradé qui ne tache que la moitié basse du texte, façon stylo feutre — `background: linear-gradient(transparent 58%, rgba(178, 59, 27, 0.14) 58%); color: inherit; padding: 0 2px;`. La règle CSS doit cibler `main mark` (apps `header.site` + `main#report`) ou `.entry .body mark` (journal/scrolly). Le pattern d'origine vient de `gouvernance/20260421-pitch-gouvernance-agentic.html:189`. Embarqué dans les huit apps deep-research, dans `proces-musk-altman/journal.html`, et dans le template de la skill `illustrated-deep-research/assets/app-template.html`. Toute nouvelle app HTML longue (rapport, journal) doit l'embarquer.

## Schémas SVG

- **Flèches → cibles** : laisser **un blanc visible** entre la pointe de la flèche et le bord de la boîte cible (≈ 12–18 px en unités SVG). Ne jamais terminer une flèche pile sur le bord d'un rectangle — avec `marker-end`, l'œil lit ça comme une pénétration dans la boîte.
- **Origine des flèches issues d'une forme** (cercle, ellipse, hub) : démarrer la ligne **sur le périmètre de la forme**, dans la direction de la cible, pas depuis le centre ni depuis le haut/bas par défaut. Sinon la flèche traverse la forme et se chevauche avec son texte. Pour un cercle `(cx, cy, r)` visant `(tx, ty)` : `start = (cx + r·dx/L, cy + r·dy/L)` avec `(dx, dy) = (tx-cx, ty-cy)` et `L = √(dx²+dy²)`. Ajouter ~4 px de respiration au-delà du périmètre si la forme a un halo ou un stroke épais. Cas de référence corrigé : flèches du schéma « Partly » de `proces-musk-altman/journal.html` — départs `(492, 387)`, `(600, 452)`, `(708, 387)` autour d'un cercle `(600, 330, r=118)`.
- **Alignement** : centrer la flèche sur le **milieu horizontal** de la boîte cible, pas sur une position arbitraire à l'intérieur. Pour une boîte `x=80, width=320`, viser `x=240`.
- **Zoom obligatoire** : tout schéma SVG inline doit être agrandissable en plein écran (overlay + pan + zoom molette/pinch + Reset/Échap, bouton `⛶` au survol). Pattern de référence : `observabilite-agents-ia/20260430-observabilite-agents-ia-app.html` (CSS `.zoom-btn` + `#zoom-overlay`, IIFE `setupZoom()`). Pour une nouvelle page, copier le bloc et adapter les variables de couleur + le sélecteur (`.figure`, `.entry figure`, …) à la structure hôte.
- **Full-bleed sur les pages narratives** (journal, livre, scrolly) : sur les layouts qui ont un wrap étroit (typiquement `.wrap { max-width: 760px }`), les schémas SVG **cassent** le wrap pour occuper toute la viewport — texte à 760px, schémas pleine largeur. Le `<figcaption>` reste re-centré à 760px sinon sa typographie devient illisible sur grand écran. **Petit padding latéral obligatoire** (`padding: 0 clamp(16px, 3vw, 48px)`) pour que le schéma ne touche pas les bords physiques de l'écran — 16px sur mobile, scale jusqu'à 48px sur large screen. Pattern CSS : `.entry figure { margin: 26px calc(50% - 50vw); padding: 0 clamp(16px, 3vw, 48px); position: relative; }` + `.entry figure svg { width: 100%; border-radius: 0; }` + `.entry figure figcaption { max-width: 760px; margin: 10px auto 0; padding: 0 5vw; }`. Préalable : `html, body { overflow-x: hidden }` (déjà dans le boilerplate mobile-friendliness ci-dessous) pour que les marges négatives ne déclenchent pas de scroll horizontal. Cas de référence : `proces-musk-altman/journal.html`.
- **Layout pleine largeur — sidebars sur les bords de la viewport** (apps deep-research desktop, `header.site` + `main#report` + sidebars) : la grille `.layout` (`240px minmax(0, 1fr) 320px`) **n'est pas capée**, elle remplit toute la viewport — TOC ancré au bord gauche, Sources au bord droit, main-cell au milieu avec `main#report` centré (max-width 760 px). Sur écrans 1440+, ça évite les bandes vides à gauche/droite et place le bouton de repli des Sources pile sur le bord gauche du panneau (vu le 2026-05-04 : avant, `.layout { max-width: 1440px; margin: 0 auto }` centrait la grille → bandes vides + collapse button mal positionné sur grandes résolutions).
- **Largeur des schémas adaptative selon l'état des sidebars** sur ces mêmes apps : sous `@media (min-width: 1025px)`, la `.figure` casse `main#report` (max-width 760 px) pour prendre **toute la place horizontale visible**, en s'arrêtant pile aux sidebars actuelles. **Deux états** :
  - **Sources ouvertes (par défaut)** : figure couvre le main-cell entier `[TOC-right, Sources-left]`. À 1320 px : figure = 760 (= main). À 1440 px : 880. À 1920 px : 1360.
  - **Sources repliées (`.layout.sources-collapsed`)** : figure s'étend `[TOC-right, viewport-right]`. À 1920 px : 1680.

  Formules : `.figure { margin-inline: calc(-1 * max(0px, (100vw - 1320px) / 2 + 48px)); width: auto }` (default) puis `.layout.sources-collapsed .figure { margin-inline: calc(-1 * max(0px, (100vw - 904px) / 2)) }`. Le `width: auto` + marges négatives symétriques absorbent à la fois le centrage de `main#report` dans le main-cell **et** son padding interne 48 px. Transition smoothe 280 ms alignée avec la transition `grid-template-columns` du layout. **Aucun chevauchement des sidebars visibles** (contrainte stricte : avec `width: 100vw`, le background `--paper` de la figure peint au-dessus des items du TOC et les masque visuellement). Pattern CSS et dérivation mathématique complète dans la skill `illustrated-deep-research` (`references/companion-app.md` § 5). Mobile (<1025 px) : la grille s'effondre en colonne unique, la figure remplit naturellement, pas d'override. Appliqué aux huit apps existantes ; tout nouveau rapport généré par la skill l'embarque par défaut.

## Mobile-friendliness

Tout artefact (hub + format[s]) **doit** être lisible sur petit écran (320–414 px). Avant de merger, vérifier ces 7 points :

1. **`overflow-x: hidden` sur `html, body`** (ou `overflow-x: clip` sur la `.layout` racine, **doublé** d'un `overflow-x: hidden` sur `body` pour les apps avec sidebars — `clip` sur `.layout` ne suffit pas si un élément déborde du body). Protection défensive, pas une excuse pour laisser passer un vrai dépassement. **Cas particulier scrollytelling** : sur les pages qui dépendent de `position: sticky` pour pinner un élément pendant un long scroll (ex. `anatomie/scrolly.html` avec sa `.pin`), `overflow-x: hidden` sur `html, body` **casse le sticky** — le body devient un scroll container et l'élément sticky n'a plus la viewport comme ancrage, donc il défile avec le contenu (vu le 2026-05-04 sur scrolly : ça défilait avec contenu vide). Utiliser `overflow-x: clip` à la place (avec `overflow-x: hidden` en fallback déclaré juste avant pour Safari < 16) — `clip` n'établit pas de scroll container, le sticky retrouve la viewport.
2. **Topbar fixe** (`Mathieu Guglielmino` à gauche, `← Retour aux dossiers` à droite) : sous `@media (max-width: 560px)` réduire le padding (`12px 16px`), descendre la taille du nom serif à `14px` et celle du back mono à `9px` avec `letter-spacing: 0.16em`. Sous `@media (max-width: 380px)`, masquer le `<em>Guglielmino</em>` (`.topbar a:first-child em { display: none; }`) — sinon les deux liens se chevauchent sur iPhone SE.
3. **Apps `header.site` + `main#report`** : la typographie mobile doit vivre dans le **même `@media (max-width: 1024px)`** que l'effondrement de `.layout` en colonne unique (et non dans un `@media (max-width: 640px)` séparé — sinon Chrome en mode « desktop site » reporte une viewport ≥ 980 px qui ne déclenche pas la version mobile, et le rapport reste à la taille desktop). Y mettre : `header.site { padding: 14px 16px; gap: 10px }`, `header.site h1 { font-size: 1.05rem; min-width: 0; overflow-wrap: break-word; word-break: break-word }`, `main#report { padding: 28px 18px 56px; max-width: 100%; min-width: 0 }`, `h1.report-title { font-size: 1.8rem; word-break: break-word }`, `.lead { font-size: 1.02rem }`, `h2`/`h3` à `1.25rem`/`1.05rem` avec `word-break: break-word`, et `.figure { max-width: 100%; overflow: hidden }` + `.figure svg { width: 100%; max-width: 100%; height: auto }` pour que les schémas SVG ne forcent pas la largeur. Doubler aussi avec `html, body { max-width: 100vw }` en plus de l'overflow-x.
4. **Schémas SVG** : `width: 100%; height: auto; max-width: 100%` sur le `<svg>`, et toujours fournir le bouton de zoom plein écran (cf. section ci-dessus). Sur mobile, le schéma rendu à 320 px de large devient illisible — le zoom est l'échappatoire.
5. **Sidebars Sommaire/Sources** : pattern `panel-close` obligatoire (cf. section *Apps interactives*).
6. **Blocs de code et formules (`<pre>`, `<code>` inline)** : un `<pre>` sans contrainte déborde la viewport sur mobile (formules, JSON, prompts XML — cas vu sur `evaluation-agentique` avec `TestCase = (Persona × Quest × Environment) → Expected Outcome`). Pattern obligatoire dans le bloc `main code` de chaque app : ajouter `overflow-wrap: anywhere` sur `main code` (casse les longs identifiants/URLs inline qui n'ont pas d'espace), puis une règle `main pre { margin: 1.5rem 0; padding: 14px 16px; background: var(--paper-2); border-radius: 4px; overflow-x: auto; max-width: 100%; font-size: 0.85em; line-height: 1.5; -webkit-overflow-scrolling: touch; }` qui rend le bloc scrollable horizontalement plutôt que de pousser la page, et un override `main pre code { background: transparent; padding: 0; border-radius: 0; font-size: 1em; overflow-wrap: normal; }` pour neutraliser le style inline et préserver les sauts de ligne du `<pre>`. Le `overflow-wrap: normal` interne empêche que le navigateur casse les lignes du bloc et fasse disparaître l'ascenseur horizontal. **Toute nouvelle app `header.site` + `main#report` doit embarquer ces trois règles**, même si elle ne contient pas encore de `<pre>` — la prochaine itération de contenu en aura.
7. **Tableaux (`<table>`)** : par défaut un `<table>` avec `width: 100%` ne réduit pas en deçà de la largeur naturelle des colonnes — sur mobile, les cellules débordent et la dernière colonne est tronquée à droite (cas vu le 2026-05-04 sur `ia-et-travail` avec le tableau « Étape 5 — La conversion en impact », colonne *Exemple* coupée). Pattern obligatoire à embarquer dans le `@media (max-width: 1024px)` à côté des règles `<pre>` : `main table { display: block; max-width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }` + `main th, main td { white-space: normal; }`. Mécanique : `display: block` sur le `<table>` génère une table anonyme à l'intérieur qui se dimensionne à son contenu ; combiné à `overflow-x: auto`, le débordement devient un scroll horizontal plutôt qu'une troncature. **Toute nouvelle app `header.site` + `main#report` doit embarquer ces deux règles**, même sans tableau présent — un comparatif arrive vite.

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
- **Hauteur des panneaux desktop** : utiliser `height: 100vh` (pas `max-height: 100vh`) sur `#toc` et `#sources`. Avec `align-self: start` dans la grille, `max-height` n'impose pas la hauteur — le panneau se rétrécit à la hauteur de son contenu, ce qui laisse un trou en bas si la liste est plus courte qu'une viewport (cf. bug visible le 2026-05-04 sur la sidebar Sources d'`agents-computer-use` : la liste s'arrêtait à mi-écran). `height: 100vh` force la hauteur ; `overflow-y: auto` reste là pour scroller le contenu interne.
- **Bouton replier Sources (`#sources-collapse-btn`) : `position: fixed`, pas `position: absolute`**. En `absolute` à l'intérieur du panneau qui a `overflow-y: auto`, le bouton scrolle avec le contenu interne — quand la liste de sources dépasse une viewport, l'utilisateur doit remonter le panneau pour le retrouver. Pattern correct : `position: fixed; top: 50%; right: 320px; transform: translate(50%, -50%); z-index: 70;` — bouton centré verticalement sur le bord gauche du panneau Sources (qui fait 320px de large), ancré à la viewport, fixe au scroll. Le bouton miroir `#sources-expand-btn` est déjà en `fixed` à `right: 0; top: 50%` ; les deux occupent le même axe vertical milieu-droit, alternant via la classe `.layout.sources-collapsed`.

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
- Préférer `git add <fichier>` ciblé plutôt que `git add .` (le dossier `.claude/` est gitignoré et ne doit pas être commité).
- **`main` = ce qui est publié sur GitHub Pages.** Tout commit sur `main` est immédiatement servi sur https://mathieugug.github.io. Jamais de WIP / brouillons / commits non relus directement sur `main` — toujours passer par une branche `claude/...` ou `journal/...` dédiée et ouvrir une PR pour validation.

## Versionnement de la skill `illustrated-deep-research`

Exception : `.claude/skills/illustrated-deep-research/` **est versionnée** (force-add, malgré le `.gitignore`) parce qu'elle est partagée via le repo. Les modifications de la skill (`SKILL.md`, `references/*.md`, `assets/*`) :

- Doivent **toujours passer par une branche dédiée** (par exemple `claude/skill-<sujet>`), **jamais sur la branche d'un artefact en cours** (un dossier `.../*-app.html`, un journal, etc.). Ça évite que la skill soit livrée par mégarde lors du merge de l'artefact.
- Doivent être commitées avec `git add -f .claude/skills/illustrated-deep-research/<file>` (le `-f` est nécessaire à cause du `.gitignore` parent).
- Sont mergeables sur `main` indépendamment du contenu publié — la skill ne sert qu'aux Claudes qui clonent le repo, elle n'est ni indexée ni rendue par GitHub Pages.

Si une modif skill arrive en même temps qu'un travail sur un artefact, créer **deux branches distinctes** et **deux PR distinctes** plutôt que de mélanger.

## Création de PR

- `git` (commit, branch, push) : via Bash.
- **Création de la PR : via le MCP GitHub** (`mcp__github__create_pull_request`). Le binaire `gh` n'est pas installé dans cet environnement — ne pas tenter de l'invoquer ni de le contourner.
- Owner/repo pour le MCP : `mathieugug` / `mathieugug.github.io` (casse minuscule côté API, même si le remote git affiche `MathieuGug`).
- Ne jamais merger automatiquement. Mathieu merge à la main.
