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
- **Surlignage stabilo (`<mark>`)** : signature visuelle du site, à utiliser pour les phrases-clés que je veux faire ressortir dans le corps narratif. En markdown : syntaxe Obsidian `==texte==` qui rend `<mark>texte</mark>`. Style : un dégradé qui ne tache que la moitié basse du texte, façon stylo feutre — `background: linear-gradient(transparent 58%, rgba(178, 59, 27, 0.14) 58%); color: inherit; padding: 0 2px;`. La règle CSS doit cibler `main mark` (apps `header.site` + `main#report`) ou **`.entry mark`** (journal/scrolly — **pas** `.entry .body mark`, qui rate les `<mark>` dans les bullets `<li>` de l'exec sum ; cas vu le 14 mai 2026 sur le journal Musk : un `<mark>` en bullet apparaissait en jaune browser-default au lieu du wash orange). Le pattern d'origine vient de `gouvernance/20260421-pitch-gouvernance-agentic.html:189`. Embarqué dans les huit apps deep-research, dans `proces-musk-altman/journal.html`, et dans les deux templates de la skill `illustrated-deep-research/assets/` (`app-template.html` et `slideshow-template.html`). Toute nouvelle app HTML longue (rapport, journal) doit l'embarquer.
- **Hint de largeur Obsidian `|1300` sur les images des journaux markdown** : dans tout fichier journal `.md` (cas en cours : `proces-musk-altman/journal.md`), chaque image inline doit porter le suffixe `|1300` — syntaxe Obsidian `![alt|1300](path.svg)`. C'est purement un hint pour homogénéiser la prévisualisation Obsidian locale (sinon les schémas s'affichent à la largeur du wrap éditeur, trop étroite pour relire). **N'affecte pas le rendu HTML publié** : le `journal.html` est écrit/maintenu à la main, pas auto-généré depuis le `.md`. Toute nouvelle entrée journal qui ajoute un `![...](...)` doit l'embarquer dès sa rédaction.

## SEO et social previews

Toute page publiée embarque le bloc OpenGraph + Twitter Card + canonical + JSON-LD `Article`/`WebSite`, encadré par les markers `<!-- og:start -->` / `<!-- og:end -->` (anchor d'idempotence pour `tools/seo_dossiers.py`). L'**og:image** est obligatoirement un PNG 1200×630 — pas de SVG, Twitter/LinkedIn/Slack ne le supportent pas en preview.

Pipeline :

- **`tools/og-card.py`** — générateur PIL d'une carte 1200×630 brandée (Cambria italique pour le titre, Consolas pour eyebrow + footer, accent orange sur un mot-clé du titre, monogramme MG en bas à droite). Sortie : `{slug}/og.png`. Pour modifier la charte des cartes (couleurs, polices, layout), éditer les constantes en haut du script.
- **`tools/seo_dossiers.py`** — driver idempotent qui parse `index.html` pour extraire les métadonnées canoniques de chaque dossier (`<a class="serie">`), regénère les `og.png`, puis injecte/met à jour le bloc SEO dans **toutes** les pages HTML d'un dossier (hub + app + slideshow + scrolly + journal + livre — exclut `livre-print.html`). Re-run met à jour le bloc en place via les markers.

À chaque **nouveau dossier publié** : ajouter sa tuile dans `index.html`, puis :

```
python tools/seo_dossiers.py --only <slug>
```

À chaque **modification d'un titre / description / date** d'un dossier dans `index.html`, re-run la même commande pour propager. Spec complète des meta tags + heuristique d'accent : `.claude/skills/illustrated-deep-research/references/seo.md`.

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
- **Boîtes `<rect>` qui enveloppent du texte — la hauteur doit contenir TOUT le texte interne, pas seulement les premières sections.** Quand on ajoute une section supplémentaire en bas d'une boîte (ex. « CONSÉQUENCE » sous les prongs (i) et (ii)), il faut **rallonger la `height` du rect parent ET pousser tous les éléments en-dessous** (titres, sous-boîtes, sources, viewBox du SVG global). Sinon le texte interne déborde sous le rect, se chevauche avec la section suivante, et donne un schéma cassé visuellement. Méthode : calculer `y_dernier_texte + ~20 px` de padding bas pour la nouvelle `height`, puis appliquer le delta de shift à toute la suite. Cas corrigé : boîtes Lecture M / Lecture S du schéma du 14 mai dans `proces-musk-altman/journal.html` — height passée de 318 à 358, shift +40 appliqué à L'INVERSION header, dashed box TROIS PIÈCES MIROIR, sources line, et viewBox 860 → 900.
- **Branches interactives (`<g class="branch">`) — contrat data-modal-id obligatoire dans `journal.html`.** Toute `<g class="branch" ...>` rendue dans le journal doit porter un attribut `data-modal-id="<id>"` ET avoir une entrée correspondante dans l'objet `modals` du `setupBranchModal` IIFE (cherchable via `grep "data-modal-id\|var modals = {" journal.html`). Sans `data-modal-id`, le sélecteur `.branch[data-modal-id]` ne matche pas et le clic ne fait rien — bug silencieux (la branche reste focusable et hover-stylable mais inerte). Format de l'entrée modale : `{ eyebrow, title, body: [paragraphes avec <em>/<strong>/<tspan> autorisés] }`. Convention de nommage des IDs : `<famille>-<n>` (ex. `lecture-molo`, `lecture-scott`, `strate-1-formation`, `voice-3-necessite`, `test-1`, `onde-2`). Le câblage des branches du journal Musk est complet à date 14 mai (lecture-molo/scott, strate-1/2, voice-1/2/3, test-1/2/3, lecture-1/2/3, onde-1/2/3, lock-1/2/3). Toute nouvelle branche doit suivre le contrat.
- **Texte SVG long sur une ligne — pas d'auto-wrap dans `<text>`, splitter à la main si dépasse la largeur du conteneur.** L'élément `<text>` SVG ne fait pas de retour à la ligne automatique : une chaîne plus large que sa boîte parente dépasse silencieusement à droite, masquée ou non par `overflow: hidden` selon les cas. Règle de pouce : pour une `<rect>` de largeur W, la zone texte utilisable est `W - 2 * padding` (typiquement W − 40). Compter ~6.5 px/char pour Inter 13pt regular ; ~5.5 px/char pour Inter 11pt ; ~7 px/char pour Fraunces 14pt italic. Au-delà, splitter en plusieurs `<text>` empilés (gap typique 18-20 px en y pour Inter 13pt) — et **rallonger la rect parente + pousser les éléments en-dessous** (cf. règle Boîtes `<rect>` ci-dessus). Cas corrigé le 14 mai : `« Primarily, I was thinking about Reid Hoffman. He was the OpenAI donor I knew. »` (~80 chars Fraunces 14pt italic) splitté en 2 lignes dans la box Lecture S (520 px de large) ; le dashed box TROIS PIÈCES MIROIR a fait pareil sur ses 2 lignes initiales (~175 et ~218 chars chacune) en passant à 4 lignes plus courtes, height 96 → 138.
- **Tracker probabilité Musk (journal Musk uniquement)** : chaque entrée du journal embarque, en fin d'article (juste avant `</article>`), un `<div class="tracker">` qui rend un SVG horizontal montrant l'évolution de ma probabilité estimée que Musk gagne en équité, depuis l'ouverture du procès (1 mai 2026) **jusqu'au jour de l'entrée incluse**. Visuellement : viewBox 1080×240, plot zone [80, 1020]×[80, 180] sur axe Y 0-60 %, 14 jours étiquetés sur axe X, ligne accent connectant les points, dernier point en plein (r=6, fill accent) avec badge `P(MUSK) = XX%` top-right, guide vertical pointillé entre dernier point et axe X. Le script `tools/insert_tracker.py` (idempotent — détecte la présence de `class="tracker"`) génère et injecte. À chaque **nouvelle entrée publiée**, mettre à jour le tuple `DATA` du script avec la nouvelle date + ma proba estimée, puis re-runner — il ré-écrit l'historique sur **chaque** entrée existante (pour que l'entrée du jour J' affiche la courbe jusqu'au jour J'). La proba est une estimation éditoriale ; elle doit suivre les pivots de ma narration quotidienne, pas une formule. Pattern de référence : `proces-musk-altman/journal.html` (13 entrées, 1 → 14 mai 2026, avec saut du dimanche 10 mai).
- **Convention typo des schémas (TODO design system unifié)** : à date (2026-05), les schémas du dossier `coding-agents/` ont été calibrés sur les tailles ci-dessous, +2pt par rapport à la table de `illustrated-deep-research/references/svg-editorial-style.md`. À harmoniser sur les autres dossiers progressivement (todo : audit complet + alignement) :
  - Title : `.display` 28pt 600 weight letter-spacing -0.01em
  - Subtitle : `.display` 18pt 400 italic
  - Body label : `.body` 15pt 500 weight
  - Annotation : `.body` 13pt
  - Caption / source : `.body` 12pt italic
  - Numeric callout : `.mono` 15pt 500 weight
  - Marker (numéro / lettre) : `.mono` 12pt 600 weight
  - Schema marker (SCHÉMA NN) : `.mono` 12pt 600 weight letter-spacing 0.16em CARMINE

  **TODO** : (1) auditer les ~70 schémas SVG existants (`grep -lE 'font-size="[6-9]"|font-size="10"' */images/*.svg`) pour repérer ceux qui ont des polices < 11pt et les remettre aux tailles minimales ; (2) mettre à jour `illustrated-deep-research/references/svg-editorial-style.md` pour qu'il pointe sur cette nouvelle convention ; (3) optionnel : ajouter un test CI qui vérifie que les SVG ne contiennent pas de `font-size="<11"`. À cadrer une fois ce dossier publié.

## Mobile-friendliness

Tout artefact (hub + format[s]) **doit** être lisible sur petit écran (320–414 px). Avant de merger, vérifier ces 7 points :

1. **`overflow-x: hidden` sur `html, body`** (ou `overflow-x: clip` sur la `.layout` racine, **doublé** d'un `overflow-x: hidden` sur `body` pour les apps avec sidebars — `clip` sur `.layout` ne suffit pas si un élément déborde du body). Protection défensive, pas une excuse pour laisser passer un vrai dépassement. **Cas particulier scrollytelling** : sur les pages qui dépendent de `position: sticky` pour pinner un élément pendant un long scroll (ex. `anatomie/scrolly.html` avec sa `.pin`), `overflow-x: hidden` sur `html, body` **casse le sticky** — le body devient un scroll container et l'élément sticky n'a plus la viewport comme ancrage, donc il défile avec le contenu (vu le 2026-05-04 sur scrolly : ça défilait avec contenu vide). Utiliser `overflow-x: clip` à la place (avec `overflow-x: hidden` en fallback déclaré juste avant pour Safari < 16) — `clip` n'établit pas de scroll container, le sticky retrouve la viewport.
2. **Topbar fixe** (`Mathieu Guglielmino` à gauche, `← Retour aux dossiers` à droite) : sous `@media (max-width: 560px)` réduire le padding (`12px 16px`), descendre la taille du nom serif à `14px` et celle du back mono à `9px` avec `letter-spacing: 0.16em`. Sous `@media (max-width: 380px)`, masquer le `<em>Guglielmino</em>` (`.topbar a:first-child em { display: none; }`) — sinon les deux liens se chevauchent sur iPhone SE.
3. **Apps `header.site` + `main#report`** : la typographie mobile doit vivre dans le **même `@media (max-width: 1024px)`** que l'effondrement de `.layout` en colonne unique (et non dans un `@media (max-width: 640px)` séparé — sinon Chrome en mode « desktop site » reporte une viewport ≥ 980 px qui ne déclenche pas la version mobile, et le rapport reste à la taille desktop). Y mettre : `header.site { padding: 14px 16px; gap: 10px }`, `header.site h1 { font-size: 1.05rem; min-width: 0; overflow-wrap: break-word; word-break: break-word }`, `main#report { padding: 28px 18px 56px; max-width: 100%; min-width: 0 }`, `h1.report-title { font-size: 1.8rem; word-break: break-word }`, `.lead { font-size: 1.02rem }`, `h2`/`h3` à `1.25rem`/`1.05rem` avec `word-break: break-word`, et `.figure { max-width: 100%; overflow: hidden }` + `.figure svg { width: 100%; max-width: 100%; height: auto }` pour que les schémas SVG ne forcent pas la largeur. Doubler aussi avec `html, body { max-width: 100vw }` en plus de l'overflow-x.
4. **Schémas SVG** : `width: 100%; height: auto; max-width: 100%` sur le `<svg>`, et toujours fournir le bouton de zoom plein écran (cf. section ci-dessus). Sur mobile, le schéma rendu à 320 px de large devient illisible — le zoom est l'échappatoire.
5. **Sidebars Sommaire/Sources** : pattern `panel-close` obligatoire (cf. section *Apps interactives*).
6. **Blocs de code et formules (`<pre>`, `<code>` inline)** : un `<pre>` sans contrainte déborde la viewport sur mobile (formules, JSON, prompts XML — cas vu sur `evaluation-agentique` avec `TestCase = (Persona × Quest × Environment) → Expected Outcome`). Pattern obligatoire dans le bloc `main code` de chaque app : ajouter `overflow-wrap: anywhere` sur `main code` (casse les longs identifiants/URLs inline qui n'ont pas d'espace), puis une règle `main pre { margin: 1.5rem 0; padding: 14px 16px; background: var(--paper-2); border-radius: 4px; overflow-x: auto; max-width: 100%; font-size: 0.85em; line-height: 1.5; -webkit-overflow-scrolling: touch; }` qui rend le bloc scrollable horizontalement plutôt que de pousser la page, et un override `main pre code { background: transparent; padding: 0; border-radius: 0; font-size: 1em; overflow-wrap: normal; }` pour neutraliser le style inline et préserver les sauts de ligne du `<pre>`. Le `overflow-wrap: normal` interne empêche que le navigateur casse les lignes du bloc et fasse disparaître l'ascenseur horizontal. **Toute nouvelle app `header.site` + `main#report` doit embarquer ces trois règles**, même si elle ne contient pas encore de `<pre>` — la prochaine itération de contenu en aura.
7. **Tableaux (`<table>`)** : par défaut un `<table>` avec `width: 100%` ne réduit pas en deçà de la largeur naturelle des colonnes — sur mobile, les cellules débordent et la dernière colonne est tronquée à droite (cas vu le 2026-05-04 sur `ia-et-travail` avec le tableau « Étape 5 — La conversion en impact », colonne *Exemple* coupée). Pattern obligatoire à embarquer dans le `@media (max-width: 1024px)` à côté des règles `<pre>` : `main table { display: block; max-width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }` + `main th, main td { white-space: normal; }`. Mécanique : `display: block` sur le `<table>` génère une table anonyme à l'intérieur qui se dimensionne à son contenu ; combiné à `overflow-x: auto`, le débordement devient un scroll horizontal plutôt qu'une troncature. **Toute nouvelle app `header.site` + `main#report` doit embarquer ces deux règles**, même sans tableau présent — un comparatif arrive vite.

## Topbar des pages internes (3 items)

Toutes les pages **internes** d'un dossier (apps, slideshows, journal, scrollies, livre, gouvernance scrolly) embarquent une topbar sticky uniforme à 3 zones — pattern PR #29 :

```
[Mathieu Guglielmino]    [titre du dossier (mono caps)]    [← Hub  ·  Accueil]
```

- **Gauche** : `<a href="../index.html">Mathieu <em>Guglielmino</em></a>` — identité + lien accueil. L'`em>Guglielmino</em>` se masque sous 380 px.
- **Milieu** : `<span class="dossier-context">{titre}</span>` — mono caps, `opacity: 0.55`, `max-width: 320px` avec ellipsis. **Masqué sous 768 px.** Le titre vient de l'`og:title` du hub (`*/index.html`), suffixe `— N formats / — étude / — comprendre les enjeux` retiré.
- **Droite** : `<nav class="back-nav" aria-label="Navigation retour">` à 2 liens — `← Hub` (→ `index.html` du dossier) et `Accueil` (→ `../index.html#series`), séparés par `<span class="back-sep" aria-hidden="true">·</span>`. Le `←` arrow n'est que sur "Hub" pour différencier visuellement le retour proche du retour lointain. `title=` donne la version longue ("Revenir au hub du dossier" / "Revenir à l'accueil").

**Hubs ≠ pages internes** : les hubs `*/index.html` gardent leur topbar à 2 items (Mathieu + `← Retour aux dossiers`) — ils SONT le hub, pas besoin du lien `← Hub`. La grille de l'accueil garde aussi sa topbar à 2 items.

### Constantes structurelles

- **Hauteur** : 56 px partout (`height: 56px`, `padding: 12px 28px`)
- **Z-index** : 60 par défaut, 70 sur le livre (au-dessus de `.toc-toggle`), 99 sur `proces-musk-altman/scrolly` (sous le `#progress` à 100)
- **Background** : `rgba(<paper>, 0.82-0.85)` + `backdrop-filter: blur(10px)`
- **Apps `header.site`** : la topbar est injectée AVANT la `.layout` (pas dedans), `body { padding-top: 56px }` libère la place. L'ancien lien `.back` du `<header class="site">` est retiré.

### Ajustements obligatoires sur les sticky/fixed adjacents

Toute page qui ajoute la topbar **doit** aussi ajuster ses éléments sticky/fixed pour ne pas être recouverts ou décalés :

- **Apps** : `#toc` et `#sources` passent de `top: 0; height: 100vh` à `top: 56px; height: calc(100vh - 56px)`. Attention au CSS multi-ligne (`height: 100vh;\n overflow-y: auto;`) vs single-line (`height: 100vh; overflow-y: auto;`) — les deux variants existent dans le repo, le script `tools/add_dossier_topbar.py` gère les deux via un simple `replace("height: 100vh", "height: calc(100vh - 56px)")`.
- **Scrolly avec `.pin`** (ex. `anatomie/scrolly`) : `top: 56px; height: calc(100vh - 56px); height: calc(100dvh - 56px)` — sinon le pin est recouvert par la topbar pendant le scroll.
- **Livre interactif** (`anatomie/livre`) : `.stage` passe à `top: 56px; height: calc(100vh - 56px)` pour que le livre vive sous la topbar. Le `.toc-toggle` (Sommaire) descend de `top: 26px` à `top: 70px`.
- **Scrolly proces-musk-altman** : le `#marker` éditorial est **retiré** (la topbar reprend la fonction d'identité, plus de redondance).

### Vars CSS adaptatives selon le format hôte

Chaque page a son propre système de variables. Le bloc topbar CSS doit respecter la convention locale :

- **Apps** : `var(--ink)`, `var(--carmine)`, `var(--graphite)`, `var(--mono)`, `var(--serif)`, `var(--rule)`
- **Slideshows / journal / `anatomie/scrolly`** : `var(--text)`, `var(--accent)`, `var(--text-mid)`, `var(--text-faint)`, `var(--line)` + `'Fraunces', serif` + `'JetBrains Mono', monospace` hardcodés
- **Livre** : `var(--ink)`, `var(--ink-2)`, `var(--accent)` (pas de carmine)
- **Gouvernance scrolly** : utilise sa **masthead** existante restructurée au pattern (gardée pour préserver le style éditorial), pas une `.topbar` séparée — sélecteurs `.masthead-left`, `.masthead .dossier-context`, `.masthead .back-nav`.

### Pages hors scope (pas de topbar, intentionnel)

- `anatomie/livre-print.html` — version imprimable, navigation hors propos
- `gouvernance/20260421-pitch-gouvernance-agentic.html` — pitch interne non lié au hub

### Outils

Deux scripts idempotents sous `tools/` rendent l'opération rejouable et propagable aux futurs dossiers :

- `tools/add_dossier_topbar.py` — injecte la topbar (CSS + HTML) dans les apps `header.site` qui n'en ont pas, ajuste TOC/Sources sticky, retire l'ancien `.back` du `header.site` et insère un petit JS pour la classe `.scrolled`. Pour ajouter un nouveau dossier app : ajouter le fichier dans la liste `APPS` et relancer.
- `tools/add_topbar_dossier_title.py` — ajoute le `<span class="dossier-context">` à toute page qui a déjà une topbar (apps + slideshows + journal). Lit l'`og:title` du hub.

Pour scrollies / livre / gouvernance scrolly : Edits manuels ciblés (chaque page a sa structure spécifique, voir PR #29 pour les patches de référence). À chaque **nouvelle page interne publiée**, embarquer le pattern dès la rédaction — les templates `illustrated-deep-research/assets/` doivent être maintenus en miroir.

## Apps interactives — sidebars Sommaire/Sources

Toute app long format avec sidebars `#toc` et `#sources` (les six études + tout nouvel app) **doit** embarquer le pattern de fermeture mobile :

- En CSS, dans `@media (max-width: 1024px)` : padding top de `64px` sur `#toc.open`/`#sources.open` (pour ne pas masquer le bouton), styles de `.panel-close` (`position: fixed; top:16px; right:16px; z-index:91`). Hors media query : `.panel-close { display: none; }`.
- En HTML : un `<button class="panel-close" type="button" aria-label="Fermer le sommaire">Fermer ✕</button>` en première position dans `<nav id="toc">` ET dans `<aside id="sources">`.
- En JS : (1) handler click sur `.panel-close` qui retire la classe `open` du parent ; (2) handler `keydown` global qui ferme tout panneau ouvert sur `Escape` (en s'effaçant si un `#zoom-overlay` ou un `#modal-root` est déjà ouvert, pour ne pas marcher sur leurs propres handlers Escape).
- **Hauteur des panneaux desktop** : utiliser `height: calc(100vh - 56px)` (pas `max-height: …`) sur `#toc` et `#sources`, avec `top: 56px` pour le sticky — la topbar fixe (cf. section dédiée) consomme les 56 premiers pixels de la viewport. Avec `align-self: start` dans la grille, `max-height` n'impose pas la hauteur — le panneau se rétrécit à la hauteur de son contenu, ce qui laisse un trou en bas si la liste est plus courte qu'une viewport (cf. bug visible le 2026-05-04 sur la sidebar Sources d'`agents-computer-use` : la liste s'arrêtait à mi-écran). `height: calc(100vh - 56px)` force la hauteur ; `overflow-y: auto` reste là pour scroller le contenu interne.
- **Bouton replier Sources (`#sources-collapse-btn`) : `position: fixed`, pas `position: absolute`**. En `absolute` à l'intérieur du panneau qui a `overflow-y: auto`, le bouton scrolle avec le contenu interne — quand la liste de sources dépasse une viewport, l'utilisateur doit remonter le panneau pour le retrouver. Pattern correct : `position: fixed; top: 50%; right: 320px; transform: translate(50%, -50%); z-index: 70;` — bouton centré verticalement sur le bord gauche du panneau Sources (qui fait 320px de large), ancré à la viewport, fixe au scroll. Le bouton miroir `#sources-expand-btn` est déjà en `fixed` à `right: 0; top: 50%` ; les deux occupent le même axe vertical milieu-droit, alternant via la classe `.layout.sources-collapsed`.

Pattern de référence : `proces-musk-altman/20260427-proces-musk-altman-app.html` (rechercher `panel-close`). **Nouvelle app = vérifier ces 3 points avant de merger**, sinon le panneau couvre tout l'écran sur mobile sans moyen de revenir en arrière. Le comportement (handler click + handler Escape) est désormais fourni par la bibliothèque partagée — voir section ci-dessous.

## Bibliothèque partagée `/assets/dossier-app.{js,css}`

**Source unique de vérité** pour le comportement et le style des patterns récurrents des apps deep-research (`*/2026*-app.html`) : zoom plein écran, modal SCHEMAS, citations highlight, TOC observer, mobile panels, sources collapse desktop, sigil MG, topbar scroll, tooltips terms.

- **`/assets/dossier-app.js`** (~440 lignes) — IIFE auto-bootstrap qui lit `window.SCHEMAS` et trouve les éléments DOM par ID conventionnel. Aucune API publique.
- **`/assets/dossier-app.css`** (~410 lignes) — patterns structurels uniquement. Les variables de thème (`--paper`, `--accent`, `--ink`, `--carmine`…) restent définies par chaque page sur `:root`.

### Inclusion dans une app

```html
<!-- Dans <head>, après les Google Fonts -->
<link rel="stylesheet" href="/assets/dossier-app.css">

<!-- Dans <body>, juste avant </body> -->
<script src="/assets/dossier-app.js" defer></script>
```

### Contrat DOM

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

### Donnée requise inline

```html
<script>
  const SCHEMAS = { /* schema-id: { card-id: { title, body, eyebrow } } */ };
  const SOURCES = [ /* { n, citation, url, accessed } */ ];
  window.SCHEMAS = SCHEMAS;
</script>
```

### Modifier la lib

1. Éditer `/assets/dossier-app.js` ou `.css`.
2. Si une nouvelle fonction publique est ajoutée, mettre à jour `tests/fixtures/expected-fns.json`.
3. Idem pour les sélecteurs CSS / IDs : `tests/fixtures/expected-ids.json`.
4. Re-run `node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs` localement.
5. Sur PR, vérifier visuellement 2-3 apps représentatives (les patterns peuvent avoir des effets de bord visuels).

### Migration d'une nouvelle app vers la lib

Le script `tools/extract_to_lib.py` est idempotent et fait le boulot pour les apps qui suivent le pattern :

```
python tools/extract_to_lib.py path/to/app.html
```

Pour les apps qui dérivent du pattern → migration manuelle, voir le code de `migrate_app()` pour comprendre les étapes.

### Tests CI

`node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs` tourne sur PR + push à main via `.github/workflows/test.yml`. Zéro dépendance, run < 5 secondes. Les apps non-migrées (s'il en reste) sont auto-skippées via une regex sur la présence de `<script src="/assets/dossier-app.js">`.

## Structure du repo

- `index.html` racine — accueil (hero · Aujourd'hui · expertise · séries · parcours · footer).
- Un dossier par artefact (`anatomie/`, `gouvernance/`, `proces-musk-altman/`, …).
- **Chaque dossier d'artefact contient son propre `index.html`** qui sert de hub d'entrée. Le hub présente l'artefact (eyebrow + titre + lede + métadonnées) et liste les formats disponibles (1 ou plusieurs cartes). Quand l'artefact n'a qu'un format, le hub propose une seule grosse carte ; sinon, une grille.
- Les liens depuis l'accueil pointent vers le **dossier** (`anatomie/`, `gouvernance/`, …), jamais directement vers un fichier interne. C'est le hub qui aiguille ensuite.
- **Bouton retour des hubs** : pointe vers `../index.html#series` avec le label `← Retour aux dossiers` — ramène à la grille des séries de l'accueil, pas à la hero/CV.
- Un dossier peut aussi contenir : scrollytelling HTML, livre/app interactive, version print, README, médias.

## Mode admin (easter egg) et annexes markdown masquées

Les rapports markdown (`*-rapport.md`) sont **masqués des hubs par défaut** : aucune carte « version texte » ni lien de téléchargement n'est visible publiquement. Ils ne sont révélés qu'en **mode admin**, activé par un easter egg clavier.

- Raccourci : `Ctrl/Cmd + Alt + M` → modal injectée par `/admin.js` (présent à la racine, inclus dans tous les `index.html` hubs + `index.html` racine via `<script src="/admin.js" defer></script>` juste avant `</body>`). Mot de passe provisoire : `K1ng-Mathi3u`. État stocké dans `localStorage.mg_admin === 'true'`. Même raccourci en mode admin → modal avec bouton de déconnexion.
- Pattern HTML : la carte md du hub porte `class="format format--admin"` (en plus de `format`). Le CSS injecté par `admin.js` (`.format--admin{display:none}` / `html.is-admin .format--admin{display:block}`) gère la révélation. Ne **pas** cacher la carte autrement (ex. `hidden`, inline `style="display:none"`) — la classe suffit.
- En mode admin, le clic sur une carte `format--admin` pointant vers un `.md` est intercepté par `admin.js` : JSZip est chargé à la demande depuis le CDN, le rapport et toutes les images référencées (regex `!\[...\](path)`, chemins relatifs uniquement) sont emballés dans un `.zip` généré côté client (`{slug}-rapport.zip`). Si JSZip échoue à charger, fallback gracieux sur le téléchargement `.md` natif. Conséquence : **toute nouvelle carte admin doit être un `<a href="...rapport.md" class="format format--admin" download>`** — le href reste le `.md` (pas un `.zip` pré-buildé), c'est admin.js qui transforme le download au runtime.
- Note de sécurité : ce gating est purement cosmétique. Les fichiers `*.md` et `images/*.svg` restent servis publiquement par GitHub Pages — n'importe qui connaissant l'URL directe peut les télécharger. C'est un voile sur l'affordance, pas un contrôle d'accès. Ne jamais y mettre de contenu confidentiel.

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

`.claude/skills/illustrated-deep-research/` **est versionnée** (force-add, malgré le `.gitignore`) parce qu'elle est partagée via le repo. Les modifications de la skill (`SKILL.md`, `references/*.md`, `assets/*`) :

- Doivent être commitées avec `git add -f .claude/skills/illustrated-deep-research/<file>` (le `-f` est nécessaire à cause du `.gitignore` parent).
- **Peuvent vivre sur la même branche qu'un artefact en cours** ou être commitées directement sur `main` au fil de l'eau. La skill ne sert qu'aux Claudes qui clonent le repo, elle n'est ni indexée ni rendue par GitHub Pages — donc aucun risque de "publication par mégarde". Plus besoin de branche skill dédiée ni de double PR : mieux vaut un commit clair qui bundle l'évolution de la skill avec son cas d'usage qu'un aller-retour entre deux PR.

## Création de PR

- `git` (commit, branch, push vers branche claude/journal/...) : via Bash.
- **Création de la PR : via le MCP GitHub** (`mcp__github__create_pull_request`). Le binaire `gh` n'est pas installé dans cet environnement — ne pas tenter de l'invoquer ni de le contourner.
- Owner/repo pour le MCP : `mathieugug` / `mathieugug.github.io` (casse minuscule côté API, même si le remote git affiche `MathieuGug`).
- Ne jamais merger automatiquement. Mathieu merge à la main.

## Push direct sur `main`

- **`git push origin main` est bloqué côté proxy local** (réponse `HTTP 403` constante). Pas la peine de retry — le 403 ne se résorbe pas.
- **Le push vers une branche `journal/...` ou `claude/...` fonctionne normalement via Bash.** C'est la première étape obligatoire — elle sauvegarde le commit côté remote et donne une base pour le passage par MCP.
- **Pour atteindre `main`, deux voies via le MCP GitHub** (owner/repo : `mathieugug` / `mathieugug.github.io`) :
  1. **`mcp__github__push_files`** — un seul commit, plusieurs fichiers. Pratique mais demande de passer **le contenu complet de chaque fichier** en paramètre. À éviter si l'un des fichiers dépasse ~25k tokens (cas typique : `proces-musk-altman/journal.html` qui fait > 1 600 lignes). Sinon, c'est la voie la plus propre — un commit propre directement sur `main`.
  2. **PR + merge via MCP** — `mcp__github__create_pull_request` (head = ta branche `journal/...`, base = `main`) puis `mcp__github__merge_pull_request` (merge_method `merge` ou `squash`). Pas de re-upload de contenu : le merge utilise les blobs déjà présents sur la branche. C'est la voie de secours quand un fichier est trop gros pour `push_files`.
- **À n'utiliser que pour les cas où Mathieu a explicitement validé un push direct** (typiquement : le journal du procès Musk vs Altman). Hors de ces cas, rester sur le workflow `branche claude/... → PR → merge manuel par Mathieu`.
- **Workflow journal type** :
  1. `git commit` local des fichiers du journal (md, html, svg).
  2. `git push origin HEAD:refs/heads/journal/YYYY-MM-DD-<slug>` — la branche existe maintenant sur origin avec le commit complet.
  3. Selon la taille des fichiers : soit `push_files` directement sur `main`, soit `create_pull_request` + `merge_pull_request`. Pour le journal Musk, l'option 2 est généralement plus sûre (le `journal.html` cumulé est volumineux).
  4. Ne **pas** tenter `git push origin main` — c'est le 403 garanti, ça pollue les logs sans rien produire.
