# CLAUDE.md — mathieugug.github.io

Site personnel de Mathieu Guglielmino, hébergé sur GitHub Pages. Il publie des artefacts publics : articles interactifs, études, dossiers de veille.

## Quick Reference

**Publier un nouveau dossier** :
1. Créer `<slug>/` avec son `index.html` (hub) + le(s) format(s) (app, slideshow, journal, scrolly, livre…).
2. Ajouter la tuile dans `index.html` racine (typologie + date + lien vers `<slug>/`).
3. `python tools/seo_dossiers.py --only <slug>` — génère `og.png` et injecte le bloc SEO dans toutes les pages du dossier (idempotent, à re-runner après modif titre/desc/date).
4. App deep-research : embarquer `/assets/dossier-app.css` + `/assets/dossier-app.js`, la topbar 3-items, le favicon, et le contrat DOM (cf. section *Bibliothèque partagée*). Alternative : `python tools/extract_to_lib.py path/to/app.html`.
5. Avant merge : vérifier la checklist mobile 7 points (section *Mobile-friendliness*) **sur device réel ou Chrome devtools en mode mobile** (pas "desktop site").

**Tests CI** : `node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs` (zéro dépendance, < 5 s).

**Workflow git** : branche `claude/...` ou `journal/...` → commit → **diff review obligatoire** → push branche → PR via `mcp__github__create_pull_request` (owner/repo `mathieugug` / `mathieugug.github.io`). **Jamais `git push origin main`** (403 garanti). Mathieu merge à la main, sauf cas explicitement validé (voir *Push direct sur main*).

**Trois règles non négociables** : (1) Lincoln uniquement en footer, jamais en hero / en-tête / sources de schémas. (2) Disclosure IA discrète sur chaque artefact. (3) Pas de tracker, analytics ni tiers (sauf Google Fonts).

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
- **Surlignage stabilo (`<mark>`)** : signature visuelle du site, syntaxe Obsidian `==texte==`. Pattern complet (CSS, scope `.entry` vs `main`) : `.claude/skills/illustrated-deep-research/references/companion-app.md` § "Micro-patterns de style".
- **Hint de largeur Obsidian `|1300`** sur les images des journaux markdown — voir `.claude/skills/illustrated-deep-research/references/workflow.md` § 3.4.

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

**Conventions complètes : voir la skill `svg-schemas`** (`.claude/skills/svg-schemas/SKILL.md`, versionnée force-add comme `illustrated-deep-research`). Elle couvre :

- **Géométrie des flèches** : blanc visible avant cible (12–18 px) ; origine sur le périmètre des cercles/hubs avec dérivation `(cx + r·dx/L, cy + r·dy/L)` ; alignement sur le milieu horizontal de la cible.
- **Texte interne aux `<rect>`** : la `height` doit contenir tout le texte (rallonger + pousser les éléments en-dessous + viewBox global) ; pas d'auto-wrap dans `<text>` SVG, splitter à la main avec une table px/char par police.
- **Intégration page** : zoom plein écran obligatoire (overlay + pan + Reset/Échap, bouton `⛶`) — fourni par `/assets/dossier-app.{js,css}` sur les apps deep-research, IIFE locale `setupZoom()` ailleurs.
- **Full-bleed sur pages narratives** (journal, livre, scrolly) : cassent le wrap à 760 px avec `margin: … calc(50% - 50vw); padding: 0 clamp(16px, 3vw, 48px)` ; `<figcaption>` re-centré à 760 px.
- **Apps deep-research** : grille `.layout` pleine viewport (sidebars sur les bords) ; figure adaptative aux deux états sidebar via `margin-inline: calc(-1 * max(0px, (100vw - 1320px) / 2 + 48px))` (formule dérivée pour un `main#report` container-capped à 760 px — prérequis load-bearing).
- **Branches interactives (journal Musk)** : contrat `data-modal-id` obligatoire + entrée correspondante dans l'objet `modals`.
- **Tracker probabilité Musk** : `tools/insert_tracker.py` idempotent, à re-runner à chaque nouvelle entrée après avoir mis à jour le tuple `DATA`.
- **Échelle typographique** : titre 28pt / subtitle 18pt italic / body label 15pt / annotation 13pt / caption 12pt italic (calibrée sur `coding-agents/`, +2pt vs `illustrated-deep-research/references/svg-editorial-style.md`, à harmoniser progressivement sur les autres dossiers).

Toute nouvelle session qui touche à un schéma SVG doit invoquer la skill via `Skill svg-schemas` plutôt que de se référer uniquement aux bullets ci-dessus — les cas corrigés datés, les patterns CSS complets et la checklist sont dans la skill.

## Mobile-friendliness

Checklist 7 points : `.claude/skills/illustrated-deep-research/references/mobile.md`.

**Override repo** : sur un scrolly avec `position: sticky` (ex. `anatomie/scrolly.html`), utiliser `overflow-x: clip` au lieu de `hidden` sur `html, body` — sinon le sticky casse (avec fallback `overflow-x: hidden` déclaré juste avant pour Safari < 16).

Avant merge : vérifier la checklist **sur device réel ou Chrome devtools en mode mobile** (pas "desktop site").

## Topbar des pages internes (3 items)

Pattern complet : `.claude/skills/illustrated-deep-research/references/topbar.md`.

**Outils repo** (idempotents, rejouables sur futurs dossiers) :
- `tools/add_dossier_topbar.py` — injecte la topbar (CSS + HTML) dans les apps `header.site` qui n'en ont pas, ajuste TOC/Sources sticky, retire l'ancien `.back` du `header.site`. Pour ajouter un nouveau dossier app : ajouter le fichier dans la liste `APPS` et relancer.
- `tools/add_topbar_dossier_title.py` — ajoute le `<span class="dossier-context">` à toute page qui a déjà une topbar. Lit l'`og:title` du hub.

Pour scrollies / livre / gouvernance scrolly : edits manuels ciblés (chaque page a sa structure spécifique).

## Apps interactives — sidebars Sommaire/Sources

Pattern complet (structure HTML, sticky math `height` vs `max-height`, `panel-close` mobile, `sources-collapse-btn` `position: fixed`, format canonique `<li id="source-N">` bracketed + full URL) : `.claude/skills/illustrated-deep-research/references/sidebars.md`.

## Quiz cards (vérification de compréhension)

Workflow **JSON-first, tool-generated** : chaque app deep-research qui ajoute des quiz aux charnières conceptuelles maintient un sidecar `<slug>/quizzes.json` (source de vérité) et **génère** le markup HTML via le script idempotent `python .claude/skills/illustrated-deep-research/assets/insert-quizzes.py --app <path> --quizzes <path>` (cf. `.claude/skills/illustrated-deep-research/references/quiz-authoring.md` pour la spec complète).

- **Le JSON est la source.** Toute correction d'énoncé, de bonne réponse, d'explication ou de back-link se fait dans le `.json`, puis on relance le script (qui réécrit chaque `<aside class="quiz-card" data-quiz-id="q-{id}">` en place). Idempotent. À chaque édition d'un quiz : éditer le JSON → re-run → diff review.
- **Convention canonique des `name` d'inputs** (load-bearing pour les radios single-mode, cosmétique pour les checkboxes mais à respecter pour la cohérence) :
  - single, 1 question : tous les radios partagent `name="q-{id}"`
  - single, N>1 questions : question k → `name="q-{id}-{k}"`
  - multi, 1 question : chaque option → `name="q-{id}-{i}"`
  - multi, N>1 questions : `name="q-{id}-{k}-{i}"`
- **CSS et IIFE `setupQuizzes()`** : la lib partagée `/assets/dossier-app.js` fournit `setupQuizzes()` qui bind chaque `.quiz-card`. Le script `insert-quizzes.py` détecte la présence de `<script src="/assets/dossier-app.js">` et **skip totalement l'injection CSS + IIFE** dans ce cas (sinon double binding). Conséquence pratique : le CSS quiz (bloc `.quiz-card`, `.quiz-q__*`) doit être embarqué localement dans la `<style>` de chaque app qui utilise la lib partagée (le shared CSS ne le contient pas à date 2026-05). Copier le bloc canonique depuis `evaluation-agentique/20260501-…-app.html` ou `observabilite-agents-ia/20260430-…-app.html` (~150 lignes, variantes mobile `@media (max-width: 1024px)` incluses).
- **Placement automatique** : le script insère chaque carte juste avant le `<h2 id="{before_heading_id}">` (ou `<h3>`) déclaré dans le JSON. Si ce heading est précédé d'un `<hr />`, la carte se loge AVANT le `<hr />` pour préserver le flow visuel `…prose… <quiz/> <hr/> <heading/>`.
- **Hand-rolled à éviter.** Écrire le markup à la main « marche » (le shared `setupQuizzes()` ne dépend que des sélecteurs `.quiz-q__*`), mais désynchronise le JSON du HTML et oblige à toute correction ultérieure de le faire deux fois. Si une nouvelle app n'a pas encore de `quizzes.json`, **créer le JSON d'abord**, lancer le script ensuite — la `obs` app a été créée à l'envers une fois (2026-05-20) puis rattrapée en re-runnant le tool en mode `replaced` pour normaliser le markup.

Sidecars existants à date 2026-05 (pattern reproductible) : `evaluation-agentique/quizzes.json`, `ia-frugale/quizzes.json`, `observabilite-agents-ia/quizzes.json`, `process-reward-models/quizzes.json`. Autres apps quizzées sans sidecar (legacy hand-rolled) : `surfaces-agentiques`, `agent-sdk`, `ia-et-travail`, `mcp-plateforme`, `benchmarks-contestes`, `measure-roi`, `analytics-agentique-gcp` — à migrer au passage si on les édite (créer le `quizzes.json` puis re-runner le script en mode `replaced`).

## Encadrés de renvoi vers d'autres dossiers (callouts)

Pattern complet : `.claude/skills/illustrated-deep-research/references/callouts.md`.

**Quand l'utiliser dans ce repo** : à chaque charnière où un dossier voisin éclaire la section (obs ↔ eval, harness ↔ agent-sdk, etc.). Bordure gauche en `--teal` pour différencier visuellement des `.quiz-card` (bordure `--carmine`).

## Bibliothèque partagée `/assets/dossier-app.{js,css}`

Source unique de vérité pour le comportement + style des apps deep-research (`*/2026*-app.html`). **Doc complète co-localisée avec le code** : [`assets/README.md`](assets/README.md).

**Inclusion minimale** (rappel) :

```html
<link rel="stylesheet" href="/assets/dossier-app.css">
<script src="/assets/dossier-app.js" defer></script>
```

**Tests CI repo** : `node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs` (workflow `.github/workflows/test.yml`, zéro dépendance, < 5 s).

**Migration nouvelle app** : `python tools/extract_to_lib.py path/to/app.html` (idempotent).

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
