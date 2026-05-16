# Spec — Skill `veille-presse-visuelle` + dossier `veille-presse/`

**Date** : 2026-05-16
**Auteur** : Mathieu Guglielmino (avec l'aide d'une IA)
**Statut** : Design validé, à implémenter

## Contexte et problème

Entre août et décembre 2023, Mathieu a tenu une veille hebdomadaire de la presse dataviz dans `vds/02-reviews/02-press/review-MM-DD-YYYY/` (18 éditions). Chaque dossier hebdo contient :

- `0-latest-review.md` ou `0-review-DATE.md` — notes structurées par source (titre, URL, auteurs, twitter handles, tags techniques `#opening`, `#voronoi`, `#cartogram`, etc.)
- Images PNG/JPG/GIF/WEBP et vidéos MP4/MOV nommées `source-sujet.ext` (~50-70 fichiers par édition)
- Agrégat mensuel via `0-press-gallery-YYYY-MM.md` qui assemble les semaines en galleries Obsidian

Les sources récurrentes : The New York Times (Upshot, Graphics), The Washington Post, Bloomberg, Reuters, FT, Le Monde (Les Décodeurs), Le Figaro (Fig Data), Axios, LA Times, Folha de São Paulo, SCMP, Pew Research, The Economist, RTVE, occasionnellement PNAS, UNEP, OWID, The Pudding, ProPublica, BBC Visual.

**La veille s'est arrêtée fin 2023.** Aujourd'hui Mathieu publie sur `mathieugug.github.io` (artefacts d'IA agentique) et veut rouvrir cette veille presse — mais en l'**automatisant à 80 %** et en la **publiant publiquement** comme série « Veille ».

Friction historique qui justifie l'automatisation :
- Découverte manuelle chronophage (scroller chaque landing « graphics » de chaque source chaque semaine)
- Capture manuelle d'images/GIF imprévisible (impossible à faire « à froid » le dimanche soir, oublis)
- Format markdown Obsidian utile pour soi, illisible pour les lecteurs

## Objectifs

1. **Auto-discovery hebdomadaire** : un cron dominical crawle les landings « graphics » des sources connues, propose une shortlist par email avec vignettes hero, attend validation par reply.
2. **Capture hybride** : Playwright headless sur les sources gratuites, claude-in-chrome (Chrome connecté de Mathieu) sur les paywalls — screenshots full-page + sections clés + GIFs des scrollytellings.
3. **Publication automatique** sur GitHub Pages : nouveau dossier hebdo `veille-presse/YYYY-MM-DD/` avec `notes.md` (format historique préservé) + `index.html` (rendu public, design system du repo).
4. **Skill versionnée dans le repo** suivant le pattern `illustrated-deep-research` — utilisable par tout Claude qui clone le repo.

## Non-objectifs

- **Pas de génération éditoriale automatique du commentaire** : le titre de synthèse + l'éventuel paragraphe d'intro restent éditables à la main par Mathieu (la skill propose un draft, l'humain valide/réécrit).
- **Pas de scoring sophistiqué** : pondération source × bonus interactivité, rien de plus. Pas de ML, pas d'analyse sémantique du contenu.
- **Pas d'historique pre-2026** : la skill ne migre pas les 18 éditions de `vds/02-reviews/02-press/` vers le format public. Si Mathieu veut le faire, c'est un effort séparé.
- **Pas de gestion fine des droits/copyright** : les screenshots de press sont publiés en fair-use éditorial (mention obligatoire titre + auteurs + URL source, lien vers l'article original).
- **Pas d'archivage long-terme des MP4 dans le repo** : si une capture vidéo dépasse 8 Mo, la skill bascule sur GIF ou commit seulement le screenshot fixe + lien vers l'article (pas de stockage binaire lourd).

## Architecture

```
.claude/skills/veille-presse-visuelle/      ← versionné dans le repo (force-add)
  SKILL.md                                   ← entrée + contrat d'invocation + 4 phases checklist
  sources.yml                                ← registre source de vérité (URL, paywall, poids, sélecteurs)
  references/
    crawler.md                               ← stratégie diff + sélecteurs CSS par source
    capture.md                               ← pipeline Playwright vs claude-in-chrome + GIF/ffmpeg
    output.md                                ← templates HTML + design system du dossier
    email.md                                 ← template email shortlist (Gmail MCP)
  assets/
    edition-template.html                    ← squelette d'une édition hebdo
    hub-template.html                        ← squelette du hub veille-presse/
  state/                                     ← gitignored (.gitignore local au dossier)
    last-crawl.json                          ← dernières URLs vues par source (diff)
    pending-edition.json                     ← édition en cours (entre Phase 1 et Phase 4)

veille-presse/                               ← publié sur GitHub Pages
  index.html                                 ← hub : grille cartes antichrono, 1 par édition
  og.png
  2026-05-17/                                ← une édition (date = dimanche du crawl)
    index.html                               ← rendu public
    notes.md                                 ← format historique préservé
    og.png
    images/
      nyt-supreme-court-opening.png
      nyt-supreme-court-fullpage.png
      bloomberg-rates-cartogram.gif
      lemonde-precipitations-map.png
      ...
  2026-05-10/
    ...
```

### Schéma de `sources.yml`

```yaml
- name: The New York Times
  slug: nyt
  graphics_url: https://www.nytimes.com/spotlight/graphics
  paywall: true
  weight: 10
  selectors:
    item: "article a[href*='/interactive/']"
    title: "h2, h3"
    author: ".css-1baulvz, .byline"
    published: "time[datetime]"
  twitter_handles: [nytgraphics, upshotnyt]
  interactivity_signals: [d3, scrollama, observable]

- name: Washington Post
  slug: wapo
  graphics_url: https://www.washingtonpost.com/graphics/
  paywall: true
  weight: 10
  ...
```

**Édition manuelle** : Mathieu édite `sources.yml` quand il ajoute/retire/repondère. C'est l'unique surface de configuration.

### Schéma de `state/last-crawl.json`

```json
{
  "nyt": {
    "last_run": "2026-05-10T20:00:00+02:00",
    "seen_urls": ["https://www.nytimes.com/interactive/2026/...", ...]
  },
  "wapo": { ... }
}
```

Le crawler considère « nouveau » tout item dont l'URL n'est pas dans `seen_urls`. Après le crawl réussi, les nouvelles URLs sont ajoutées (cap à ~500 URLs par source pour éviter l'inflation — FIFO).

## Workflow hebdomadaire (4 phases)

### Phase 1 — Discovery (cron dimanche 20h, autonome)

Déclencheur : `/schedule` avec cron `0 20 * * 0` (Europe/Paris) qui invoque la skill avec action `discover`.

Étapes :
1. Pour chaque source dans `sources.yml` (en parallèle, max 5 simultanées) :
   - Visiter `graphics_url` avec Playwright headless
   - Appliquer `selectors.item` pour extraire les URLs
   - Diff vs `state/last-crawl.json[source].seen_urls`
2. Pour chaque nouvelle URL :
   - Visiter la page de l'article
   - Screenshot hero 1200×800 (clip sur viewport top)
   - Extraire titre / auteurs / date publication via `selectors`
   - Détecter interactivité (présence de `d3`, `scrollama`, `observable` dans les scripts → flag `is_interactive`)
3. Scoring : `score = source.weight × (1 + 0.3 × is_interactive)` (formule simple, ajustable)
4. Construire la shortlist triée par score décroissant, capée à 25 pièces
5. Stocker dans `state/pending-edition.json` : `{ edition_date, items: [{n, source, url, title, authors, hero_path, score, tags}] }`
6. **Envoi email** via `mcp__claude_ai_Gmail__create_draft` puis envoi :
   - Sujet : `🗞️ Veille presse — semaine du DD MMM YYYY (N pièces repérées)`
   - Body HTML : grille de cartes (vignette hero embed base64 + numéro + source + titre + URL + score + tags)
   - Instructions de réponse : `Réponds par les numéros à garder (ex: 1, 3, 5-8, 12), ou "tout". Tu peux ajouter des URLs en commentaire.`
7. Update `state/last-crawl.json` avec les nouvelles URLs vues

### Phase 2 — Validation (Mathieu, par email reply)

Mathieu répond au mail :
- Liste de numéros (`1, 3, 5-8, 12` ou `tout`)
- Optionnellement, URLs supplémentaires hors radar collées en plus

La skill, lors du prochain wake (déclenché soit par Mathieu invoquant la skill avec action `process-reply`, soit par un cron de check 2h plus tard), va :
1. `mcp__claude_ai_Gmail__search_threads` avec le sujet de l'email envoyé
2. Récupérer le dernier reply via `get_thread`
3. Parser la réponse : extraire numéros + URLs additionnelles
4. Construire la liste finale d'items à capturer
5. Stocker dans `state/pending-edition.json[selected_items]`

### Phase 3 — Capture (semi-auto)

Pour chaque item sélectionné :

1. **Détection paywall** :
   - Tentative Playwright headless : si statut HTTP 402/403 ou si le contenu contient des sentinelles paywall connues (`data-paywall`, `class="paywall"`, etc.), bascule sur claude-in-chrome
   - Sinon Playwright continue
2. **Bascule claude-in-chrome** :
   - Prompt à Mathieu via Telegram nudge : « Chrome dispo pour capturer X pièces paywallées ? »
   - Si OK : utilise `mcp__claude-in-chrome__navigate` + `browser_take_screenshot` (via Playwright MCP, qui partage souvent la session) ou `mcp__claude-in-chrome__gif_creator`
   - Si Chrome indisponible : skipper, lister dans le rapport « capture manuelle requise pour ces N pièces »
3. **Captures par item** :
   - `source-slug-fullpage.png` : screenshot full-page (scroll complet, Playwright `fullPage: true`)
   - `source-slug-{chartname}.png` : pour chaque section H2 ou figure SVG isolée, screenshot du bloc (heuristique : éléments avec `id` sémantique ou class `chart`/`figure`)
   - `source-slug-interaction.gif` : si `is_interactive`, scroll programmatique sur 8-12 secondes, capture frames à 10 FPS, encode GIF via ffmpeg
     - Cap à 6 Mo (sinon downscale à 800px de large) ; si toujours > 8 Mo, bascule sur MP4 H.264
     - Si MP4 > 8 Mo, skip et garde seulement le screenshot fixe + note dans `notes.md`
4. **Extraction metadata** : titre / auteurs / date / handles Twitter / tags techniques heuristiques
   - Tags techniques détectés sur le contenu de la page : `voronoi`, `cartogram`, `heatmap`, `hemicycle`, `scrollytelling`, `opening`, `map`, `treemap`, `bertin`, `network`. Détection via présence de motifs DOM/SVG (`<pattern id="voronoi">`, `<g class="hexbin">`, etc.) — pas parfait, mais reproduit l'esprit du tagging historique de Mathieu.

### Phase 4 — Génération éditoriale + publication (auto)

1. **Génération `notes.md`** au format historique exact :
   ```markdown
   # The New York Times
   ## How Climate Change Is Affecting Your City
   https://www.nytimes.com/interactive/2026/... by [Author](https://...) @twitterhandle
   #scrollytelling #map
   ![](nyt-climate-city-opening.png)
   ![](nyt-climate-city-interaction.gif)
   ![](nyt-climate-city-fullpage.png)

   # Bloomberg
   ...
   ```
2. **Génération `index.html`** depuis `edition-template.html` :
   - Topbar 3-items (Mathieu / `VEILLE PRESSE · DD MMM YYYY` / `← Hub · Accueil`)
   - Hero : eyebrow `VEILLE PRESSE · SEMAINE DU DD MMM YYYY` + titre éditorial (1 phrase de synthèse — draft généré par la skill, marqué `<!-- EDITABLE -->` pour que Mathieu sache qu'il peut le réécrire)
   - Sections H2 par source (ordre = score décroissant)
   - Pour chaque pièce : H3 (titre) lien vers l'article + crédits (auteurs + handles) + tags + figures inline (images/GIF avec captions)
   - Footer disclosure IA
3. **Mise à jour `veille-presse/index.html`** (hub) : insertion d'une carte en tête de la grille, image héro = mosaïque 2×2 des 4 plus belles pièces (sélection par score), titre = « Semaine du DD MMM YYYY », badge `Veille` (couleur `--accent`)
4. **Mise à jour `index.html` racine** : la tuile `veille-presse` mise à jour avec la date la plus récente (s'il n'y en a pas encore, création de la tuile)
5. **OG cards** : `python tools/seo_dossiers.py --only veille-presse` + `--only veille-presse/YYYY-MM-DD`
6. **Branche + PR** :
   - `git checkout -b veille/YYYY-MM-DD`
   - `git add veille-presse/` + nouveaux fichiers
   - `git commit -m "veille: édition du DD MMM YYYY (N pièces)"`
   - `git push origin veille/YYYY-MM-DD`
   - `mcp__github__create_pull_request` (owner: mathieugug, repo: mathieugug.github.io, base: main, head: veille/YYYY-MM-DD)
7. **Ping Telegram nudge** : message court « Veille presse semaine DD MMM prête, N pièces — PR #X » avec lien vers la PR. Mathieu merge à la main après relecture (jamais d'auto-merge — convention CLAUDE.md du repo).

## Design système du dossier `veille-presse/`

Strict respect du CLAUDE.md du repo :

- Vars CSS héritées (`--bg #faf6ec`, `--accent #b8582e`, polices Fraunces / Inter / JetBrains Mono)
- **Topbar 3-items obligatoire** (cf. section dédiée du CLAUDE.md)
- **Mobile-friendliness** : les 7 points obligatoires
- **Badge typologie `Veille`** (couleur `--accent`) dans la tuile racine
- **OG card** générée par `og-card.py`
- **Disclosure IA** en footer : `Sélection éditoriale assistée par IA, captures et notes par Mathieu Guglielmino`
- **Pas de `<mark>` automatique** : les surlignages restent un acte éditorial humain (Mathieu peut les ajouter à la main après merge)

### Hub `veille-presse/index.html`

Grille de cartes antichrono (1 carte = 1 édition). Format de la carte :
- Image héro = mosaïque 2×2 des 4 plus beaux visuels de l'édition (sélection par score, fallback sur la 1ère pièce)
- Titre : `Semaine du DD MMM YYYY`
- Sous-titre : `N pièces · NN sources`
- Tags : 3-4 tags techniques dominants de l'édition

### Édition `veille-presse/YYYY-MM-DD/index.html`

- Topbar
- Hero : eyebrow `VEILLE PRESSE · SEMAINE DU DD MMM YYYY` + titre éditorial + tags dominants de l'édition
- Sections H2 par source (ordre score décroissant)
- Pour chaque pièce :
  - H3 (titre, lien vers l'article original)
  - Ligne crédits + tags (mono caps, `--text-mid`)
  - Figure(s) avec images/GIF inline (CSS `figure { margin: 26px 0 }` ; `img/video { max-width: 100%; height: auto }`)
  - Pas de figcaption auto-générée (sauf pour les GIFs : caption « interaction · X secondes »)
- Footer disclosure IA

## Sources, scoring, registre

**Liste initiale validée** (~30 sources, à mettre dans `sources.yml` v1) :

- **Quotidiens dataviz US/UK** : The New York Times (Upshot, Graphics) — poids 10 ; The Washington Post — 10 ; Bloomberg (Graphics) — 10 ; Reuters Graphics — 10 ; Financial Times — 9 ; LA Times — 7 ; WSJ Graphics — 9
- **Quotidiens FR** : Le Monde (Les Décodeurs) — 9 ; Le Figaro (Fig Data) — 8 ; Libération — 6 ; Le Parisien Data — 5
- **International** : Folha de São Paulo — 8 ; SCMP — 7 ; RTVE — 6 ; El País — 7 ; Berliner Morgenpost / ZEIT Online — 7 ; Nikkei Asia — 6
- **Magazines / mensuels** : The Economist — 9 ; The Atlantic — 7 ; New Yorker — 6
- **Long-form / mag dataviz** : The Pudding — 9 ; ProPublica — 8 ; The Markup — 7 ; BBC Visual Journalism — 8
- **Recherche / think tanks** : Pew Research Center — 7 ; PNAS — 5 ; UNEP — 5 ; OWID (Our World in Data) — 7
- **Plateformes / showcases** : Datawrapper River — 6 ; Observable Featured — 6 ; FlowingData — 5 ; Information Is Beautiful Awards — 5
- **Twitter/X handles signature** : à intégrer en Phase 2 (v2 de la skill), pas dans le scope v1 — l'API Twitter est instable

**Scoring final** = `source.weight × (1 + 0.3 × is_interactive)`. Ajustable dans `sources.yml`.

## Surfaces de configuration pour Mathieu

Trois fichiers qu'il édite à la main :

1. **`sources.yml`** — ajouter/retirer/repondérer une source. Format YAML simple, validé au chargement (schema check).
2. **`SKILL.md`** — modifier le contrat (rare).
3. **L'`index.html` d'une édition publiée** — corriger une coquille, réécrire le titre éditorial, ajouter un `<mark>`, retirer une pièce qui n'a finalement rien à faire là.

Pas de UI admin, pas de panneau de réglages. Tout passe par l'édition de fichiers + git.

## Plan de test

Pas de tests automatisés au sens CI dans la v1 — la skill manipule trop d'I/O réseau et de side-effects (email, git push, PR) pour être testable de manière unitaire utile.

**Validation manuelle, checklist avant publication d'une édition** :
- [ ] L'email shortlist a été reçu et lisible (rendu HTML correct sur Gmail mobile + desktop)
- [ ] Les screenshots full-page ne sont pas tronqués ou cassés (paywalls invisibles, pas de bandeau cookies en travers)
- [ ] Les GIFs sont sous 6 Mo et lisibles (pas de saccade ni de frames manquées)
- [ ] Le `notes.md` parse correctement en Obsidian (galleries reconnues)
- [ ] L'`index.html` de l'édition s'affiche correctement sur mobile 320 px et desktop 1920 px
- [ ] La topbar 3-items est présente et stylée
- [ ] Le hub `veille-presse/index.html` montre la nouvelle carte en tête
- [ ] L'`og.png` de l'édition est généré et a la bonne forme (1200×630, accent orange sur un mot du titre)
- [ ] La PR créée a le bon contenu (pas de fichiers parasites, taille raisonnable < 30 Mo)

Cette checklist sera reproduite dans `SKILL.md` comme rituel post-publication.

## Risques et atténuations

| Risque | Atténuation |
|---|---|
| Paywall bypass non éthique | La skill ne contourne aucun paywall — elle utilise les cookies de session de Mathieu qui est abonné. Si Mathieu n'est pas abonné à une source, la capture échoue et c'est listé dans le rapport. |
| Sélecteurs CSS qui dérivent (les sites changent leur DOM) | Les sélecteurs dans `sources.yml` sont versionnés. Si un crawl échoue 2 semaines de suite sur une source, alerte dans l'email avec la trace. Mathieu update le sélecteur. |
| Volume binaire dans le repo qui explose | Cap à 8 Mo par fichier binaire. Au-delà : downscale ou skip. Audit annuel du poids du dossier `veille-presse/` — si > 500 Mo, migration vers Git LFS ou hébergement externe à envisager. |
| Cron qui rate (skill bug, machine éteinte) | Le cron est idempotent : si Phase 1 n'a pas été exécutée dimanche soir, Mathieu peut l'invoquer manuellement n'importe quand dans la semaine. L'édition prend juste la date du jour de l'invocation. |
| Mathieu ne répond pas au mail de shortlist | Timeout 5 jours : si pas de reply à J+5, la skill envoie un nudge Telegram. À J+7, l'édition est skip (entrée dans `state/skipped-editions.json` pour mémoire). |
| Fair-use éditorial contesté par une source | Mention obligatoire titre + auteurs + lien direct vers l'article original dans chaque section. Si une source demande le retrait, c'est commit de retrait + ajout du domain dans `sources.yml[blocked]`. |

## Itérations futures hors scope v1

- v2 : crawl Twitter/X (handles signature) — si l'API redevient utilisable
- v2 : agrégat mensuel/annuel (page récap des « meilleures pièces du mois » avec re-scoring éditorial humain)
- v3 : RSS export du dossier `veille-presse/` pour que les lecteurs s'abonnent
- v3 : recherche full-text sur les éditions passées (côté front, Lunr.js ou équivalent)
- v3 : commentaires des lecteurs (giscus ou équivalent)
