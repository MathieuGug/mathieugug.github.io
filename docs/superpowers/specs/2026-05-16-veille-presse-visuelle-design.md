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

**La veille s'est arrêtée fin 2023.** Aujourd'hui Mathieu publie sur `mathieugug.github.io` (artefacts d'IA agentique) et veut rouvrir cette veille presse — mais en l'**automatisant intégralement** et en la **publiant publiquement** comme série « Veille ».

Friction historique qui justifie l'automatisation :
- Découverte manuelle chronophage (scroller chaque landing « graphics » de chaque source chaque semaine)
- Capture manuelle d'images/GIF imprévisible (impossible à faire « à froid » le dimanche soir, oublis)
- Format markdown Obsidian utile pour soi, illisible pour les lecteurs

## Objectifs

1. **Cycle hebdo entièrement automatique** : cron dominical → crawl des sources → scoring → capture (screenshots + GIFs + MP4) → génération du dossier hebdo → PR auto-mergée. Zéro intervention humaine dans la boucle de publication v1.
2. **Capture Playwright headless** : un seul moteur, utilisant des `storage_state` Playwright stockés (un par source paywallée) pour traverser les abonnements de Mathieu (NYT, WaPo, Bloomberg, FT, Le Monde, Le Figaro). Si un `storage_state` expire ou manque, capture skip avec note dans `notes.md` ; Mathieu refresh manuellement.
3. **Publication automatique** sur GitHub Pages : nouveau dossier hebdo `veille-presse/YYYY-MM-DD/` avec `notes.md` (format historique préservé) + `index.html` (rendu public, design system du repo). Branche `veille/YYYY-MM-DD` → PR → auto-merge immédiat sur `main`.
4. **Amendements post-publication par commentaire PR** : Mathieu commente la PR mergée pour signaler une erreur, demander un retrait, réécrire le titre éditorial. La skill (v2) lit ces commentaires au cycle suivant pour amender l'édition précédente. En v1, Mathieu édite à la main si besoin.
5. **Skill versionnée dans le repo** suivant le pattern `illustrated-deep-research` — utilisable par tout Claude qui clone le repo.

## Non-objectifs

- **Pas de validation utilisateur dans la boucle v1** : pas d'email shortlist, pas de notification Telegram, pas de gate humaine entre crawl et publication. La PR auto-mergée est la seule trace.
- **Pas de génération éditoriale automatique du commentaire** : le titre de synthèse + l'éventuel paragraphe d'intro restent un draft généré par la skill, marqué `<!-- EDITABLE -->` ; Mathieu peut le réécrire post-merge à la main (ou commenter la PR pour rework au cycle suivant en v2).
- **Pas de scoring sophistiqué** : pondération source × bonus interactivité, rien de plus. Pas de ML, pas d'analyse sémantique du contenu.
- **Pas d'historique pre-2026** : la skill ne migre pas les 18 éditions de `vds/02-reviews/02-press/` vers le format public. Si Mathieu veut le faire, c'est un effort séparé.
- **Pas de claude-in-chrome dans la boucle auto** : claude-in-chrome requiert une session Chrome interactive de Mathieu, incompatible avec un cron 100 % autonome. Si une capture rate (paywall, sélecteur cassé), elle est skippée et notée — Mathieu peut la refaire manuellement avec claude-in-chrome ensuite.
- **Pas de gestion fine des droits/copyright** : les screenshots de press sont publiés en fair-use éditorial (mention obligatoire titre + auteurs + URL source, lien vers l'article original).
- **Pas d'archivage de fichiers binaires lourds** : cap à 8 Mo par fichier capture. MP4 acceptés sous ce seuil ; au-delà, downscale puis skip avec note.

## Architecture

```
.claude/skills/veille-presse-visuelle/      ← versionné dans le repo (force-add)
  SKILL.md                                   ← entrée + contrat + 2 phases checklist
  sources.yml                                ← registre source de vérité (URL, paywall, poids, sélecteurs)
  references/
    crawler.md                               ← stratégie diff + sélecteurs CSS par source
    capture.md                               ← pipeline Playwright + storage_state + GIF/ffmpeg
    output.md                                ← templates HTML + design system du dossier
  assets/
    edition-template.html                    ← squelette d'une édition hebdo
    hub-template.html                        ← squelette du hub veille-presse/
  state/                                     ← gitignored (.gitignore local au dossier)
    last-crawl.json                          ← dernières URLs vues par source (diff)
    storage-state/                           ← un .json Playwright par source paywallée
      nyt.json
      wapo.json
      bloomberg.json
      ft.json
      lemonde.json
      lefigaro.json
    run-log.jsonl                            ← append-only : 1 ligne par cycle (date, stats, erreurs)

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
  storage_state: state/storage-state/nyt.json   # optionnel, requis si paywall
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
  storage_state: state/storage-state/wapo.json
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

### Construction des `storage_state` Playwright

Hors-cycle : Mathieu lance un helper `python tools/build-storage-state.py <slug>` (à créer dans `tools/`) qui ouvre Playwright en mode `headless: false`, navigue sur la page de login de la source, lui laisse 60 secondes pour se connecter à la main, puis sauvegarde le `storageState` (cookies + localStorage) dans `state/storage-state/<slug>.json`. Refresh quand la session expire (typiquement 1-3 mois selon la source).

## Workflow hebdomadaire (2 phases)

### Phase 1 — Discovery + Capture (cron dimanche 20h, 100 % autonome)

Déclencheur : `/schedule` avec cron `0 20 * * 0` (Europe/Paris) qui invoque la skill avec action `run`.

**Discovery :**
1. Pour chaque source dans `sources.yml` (en parallèle, max 5 simultanées) :
   - Charger `storage_state` si paywall, sinon contexte vierge
   - Visiter `graphics_url` avec Playwright headless
   - Appliquer `selectors.item` pour extraire les URLs
   - Diff vs `state/last-crawl.json[source].seen_urls`
2. Pour chaque nouvelle URL :
   - Visiter la page de l'article
   - Extraire titre / auteurs / date publication via `selectors`
   - Détecter interactivité (présence de `d3`, `scrollama`, `observable` dans les scripts → flag `is_interactive`)
3. Scoring : `score = source.weight × (1 + 0.3 × is_interactive)`
4. Construire la shortlist triée par score décroissant, **capée à 15 pièces** (taille des éditions historiques)
5. Update `state/last-crawl.json` avec les nouvelles URLs vues

**Capture (pour chacun des 15 items retenus) :**

1. Visiter la page avec Playwright (avec `storage_state` si paywall)
2. **Si la page ne se charge pas (timeout, 4xx, 5xx) ou affiche un bandeau paywall reconnu (heuristique DOM) malgré storage_state** : capture skippée, note `[capture impossible — storage_state expiré ?]` ajoutée dans `notes.md`, item conservé avec juste titre + URL + crédits
3. Captures par item :
   - `source-slug-fullpage.png` : screenshot full-page (Playwright `fullPage: true`)
   - `source-slug-{chartname}.png` : pour chaque section H2 ou figure SVG isolée, screenshot du bloc (heuristique : éléments avec `id` sémantique ou class `chart`/`figure`, max 5 par article)
   - `source-slug-interaction.gif` ou `.mp4` : si `is_interactive`, scroll programmatique sur 8-12 secondes, capture frames à 10 FPS, encode GIF via ffmpeg
     - Cap GIF à 6 Mo (sinon downscale à 800px de large)
     - Si GIF toujours > 6 Mo après downscale : bascule sur MP4 H.264 (cap 8 Mo)
     - Si MP4 > 8 Mo : skip et garde seulement le screenshot fixe + note dans `notes.md`
4. Extraction metadata : titre / auteurs / date / handles Twitter / tags techniques heuristiques
   - Tags détectés sur le contenu de la page : `voronoi`, `cartogram`, `heatmap`, `hemicycle`, `scrollytelling`, `opening`, `map`, `treemap`, `bertin`, `network`. Détection via présence de motifs DOM/SVG (`<pattern id="voronoi">`, `<g class="hexbin">`, etc.) — heuristique, pas parfait, reproduit l'esprit du tagging historique.

### Phase 2 — Génération éditoriale + publication + automerge (auto)

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
   - Hero : eyebrow `VEILLE PRESSE · SEMAINE DU DD MMM YYYY` + titre éditorial (1 phrase de synthèse — draft généré par la skill, marqué `<!-- EDITABLE -->`)
   - Sections H2 par source (ordre = score décroissant)
   - Pour chaque pièce : H3 (titre) lien vers l'article + crédits (auteurs + handles) + tags + figures inline (images/GIF/MP4 inline)
   - Section finale `Captures impossibles` si applicable : liste des pièces dont le storage_state a expiré, avec URL et crédits seulement
   - Footer disclosure IA
3. **Mise à jour `veille-presse/index.html`** (hub) : insertion d'une carte en tête de la grille, image héro = mosaïque 2×2 des 4 plus belles pièces (sélection par score), titre = « Semaine du DD MMM YYYY », badge `Veille` (couleur `--accent`)
4. **Mise à jour `index.html` racine** : la tuile `veille-presse` mise à jour avec la date la plus récente (s'il n'y en a pas encore, création de la tuile avec badge `Veille`)
5. **OG cards** : `python tools/seo_dossiers.py --only veille-presse` + `--only veille-presse/YYYY-MM-DD`
6. **Branche + commit + push + PR + automerge** :
   - `git checkout -b veille/YYYY-MM-DD`
   - `git add veille-presse/` + nouveaux fichiers
   - `git commit -m "veille: édition du DD MMM YYYY (N pièces)"`
   - `git push origin veille/YYYY-MM-DD`
   - `mcp__github__create_pull_request` (owner: mathieugug, repo: mathieugug.github.io, base: main, head: veille/YYYY-MM-DD, title: « Veille presse — semaine du DD MMM YYYY »)
   - `mcp__github__merge_pull_request` (merge_method: `squash`) — automerge immédiat
7. **Append au `state/run-log.jsonl`** : 1 ligne JSON `{ date, n_crawled, n_shortlisted, n_captured, n_skipped, pr_number, merge_sha }`

**Override explicite du CLAUDE.md** : la règle « Jamais de WIP / brouillons / commits non relus directement sur `main` » est levée pour cette skill, parce que (a) Mathieu a explicitement validé le full-auto, (b) la branche `veille/...` existe et la PR est créée pour traçabilité, (c) Mathieu peut commenter la PR mergée pour demander correction au cycle suivant ou édite à la main si besoin. **Cette dérogation ne s'étend à aucune autre skill ou workflow du repo.**

## Design système du dossier `veille-presse/`

Strict respect du CLAUDE.md du repo :

- Vars CSS héritées (`--bg #faf6ec`, `--accent #b8582e`, polices Fraunces / Inter / JetBrains Mono)
- **Topbar 3-items obligatoire**
- **Mobile-friendliness** : les 7 points obligatoires
- **Badge typologie `Veille`** (couleur `--accent`) dans la tuile racine
- **OG card** générée par `og-card.py`
- **Disclosure IA** en footer : `Sélection éditoriale et captures automatisées · publié par Mathieu Guglielmino`
- **Pas de `<mark>` automatique** : les surlignages restent un acte éditorial humain (Mathieu peut les ajouter à la main après merge)

### Hub `veille-presse/index.html`

Grille de cartes antichrono (1 carte = 1 édition). Format de la carte :
- Image héro = mosaïque 2×2 des 4 plus beaux visuels de l'édition (sélection par score, fallback sur la 1ère pièce)
- Titre : `Semaine du DD MMM YYYY`
- Sous-titre : `N pièces · NN sources`
- Tags : 3-4 tags techniques dominants de l'édition

### Édition `veille-presse/YYYY-MM-DD/index.html`

- Topbar
- Hero : eyebrow `VEILLE PRESSE · SEMAINE DU DD MMM YYYY` + titre éditorial draft + tags dominants
- Sections H2 par source (ordre score décroissant)
- Pour chaque pièce :
  - H3 (titre, lien vers l'article original)
  - Ligne crédits + tags (mono caps, `--text-mid`)
  - Figure(s) avec images/GIF/MP4 inline (CSS `figure { margin: 26px 0 }` ; `img/video { max-width: 100%; height: auto }`)
  - Caption auto-générée seulement pour les GIFs/MP4 : « interaction · X secondes »
- Section finale `Captures impossibles` si N > 0 (URL + crédits, pas de visuel)
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
- **Twitter/X handles signature** : à intégrer en v2 (API Twitter instable)

**Scoring final** = `source.weight × (1 + 0.3 × is_interactive)`. Ajustable dans `sources.yml`.

## Surfaces de configuration pour Mathieu

Trois fichiers / opérations qu'il fait à la main :

1. **`sources.yml`** — ajouter/retirer/repondérer une source. Format YAML simple, validé au chargement (schema check).
2. **`tools/build-storage-state.py <slug>`** — rebuild le storage Playwright pour une source dont la session a expiré.
3. **L'`index.html` d'une édition publiée (post-merge)** — corriger une coquille, réécrire le titre éditorial, ajouter un `<mark>`, retirer une pièce. Ou via commentaire de la PR mergée (v2 — réagi au cycle suivant).

Pas de UI admin, pas de panneau de réglages. Tout passe par l'édition de fichiers + git.

## Plan de test

Pas de tests automatisés au sens CI dans la v1 — la skill manipule trop d'I/O réseau et de side-effects (git push, PR, merge) pour être testable de manière unitaire utile.

**Validation manuelle, checklist au lancement initial puis audit mensuel** :
- [ ] Les screenshots full-page ne sont pas tronqués (paywall bypass via storage_state fonctionne, pas de bandeau cookies en travers)
- [ ] Les GIFs sont sous 6 Mo et lisibles (pas de saccade ni de frames manquées)
- [ ] Les MP4 (si > GIF cap) sont sous 8 Mo et jouables nativement dans le navigateur
- [ ] Le `notes.md` parse correctement en Obsidian (galleries reconnues)
- [ ] L'`index.html` de l'édition s'affiche correctement sur mobile 320 px et desktop 1920 px
- [ ] La topbar 3-items est présente et stylée
- [ ] Le hub `veille-presse/index.html` montre la nouvelle carte en tête
- [ ] L'`og.png` de l'édition est généré et a la bonne forme (1200×630, accent orange sur un mot du titre)
- [ ] La PR créée a le bon contenu (pas de fichiers parasites, taille raisonnable < 30 Mo)
- [ ] Le squash-merge a bien été appliqué sur main et le commit est publié sur GitHub Pages
- [ ] Aucune `storage_state` n'a expiré silencieusement (vérifier `run-log.jsonl` pour les `n_skipped` croissants par source)

Cette checklist sera reproduite dans `SKILL.md` comme rituel post-publication mensuel.

## Risques et atténuations

| Risque | Atténuation |
|---|---|
| Paywall bypass non éthique | La skill utilise les cookies de session de Mathieu (storage_state Playwright), qui est abonné aux sources qu'il capture. Si Mathieu n'est pas abonné, la capture échoue et c'est listé dans le rapport. Pas de tentative de contourner un paywall sans session valide. |
| Sélecteurs CSS qui dérivent (les sites changent leur DOM) | Les sélecteurs dans `sources.yml` sont versionnés. Suivi via `run-log.jsonl` : si une source produit 2 cycles consécutifs sans nouvelle URL détectée (alors que les autres en trouvent), heuristique d'alerte dans le commit de l'édition (« source X muette depuis N semaines, sélecteur cassé ? »). Mathieu update le sélecteur. |
| Volume binaire dans le repo qui explose | Cap à 8 Mo par fichier binaire. Au-delà : downscale ou skip. Audit annuel du poids du dossier `veille-presse/` — si > 500 Mo, migration vers Git LFS ou hébergement externe à envisager. |
| Cron qui rate (skill bug, machine éteinte) | Le cron est idempotent : si Phase 1 n'a pas été exécutée dimanche soir, Mathieu peut l'invoquer manuellement avec `claude → /veille-presse-visuelle run` n'importe quand dans la semaine. L'édition prend la date du dimanche le plus proche. |
| `storage_state` expirée pour une source paywall | Les captures de cette source sont skippées avec note dans `notes.md` et `run-log.jsonl`. Mathieu rebuild manuellement via `tools/build-storage-state.py <slug>`. Pas d'alerte proactive en v1 — détection au moment de la relecture du dossier publié. |
| Erreur publiée (capture cassée, mauvaise attribution, titre faux) | Mathieu édite à la main post-merge (workflow normal git), ou commente la PR mergée pour mémoire (v2 réagit au cycle suivant). Pas de rollback automatique. |
| Fair-use éditorial contesté par une source | Mention obligatoire titre + auteurs + lien direct vers l'article original dans chaque section. Si une source demande le retrait, c'est commit de retrait + ajout du domain dans `sources.yml[blocked]`. |
| Auto-merge sur `main` qui casse le site | Risque réel mais limité : la skill ne touche que `veille-presse/` (nouveau dossier isolé) + 1 ligne dans `index.html` racine (insertion de tuile). Aucune modif d'autres dossiers, aucun fichier global. Si le site casse, `git revert <merge_sha>` manuel. |

## Itérations futures hors scope v1

- **v2 : Amendements via commentaires PR.** La skill lit les commentaires des PRs mergées des 4 dernières semaines au début de chaque cycle. Si un commentaire commence par `[amend]`, elle applique la modif demandée à l'édition concernée (édition de titre, retrait de pièce, ajout d'annotation `<mark>`) dans le commit de l'édition courante.
- **v2 : Notification PR via email digest mensuel.** Récap des éditions publiées dans le mois, envoyé à `mathieu.guglielmino@gmail.com` le 1er de chaque mois. Pas de notification per-PR (GitHub fait déjà ça par défaut côté repo owner).
- **v2 : Détection proactive `storage_state` expirées.** Au début de chaque cycle, ping chaque source paywall avec sa session : si KO, alerte avant le crawl complet, dans un commit dédié `chore: storage-state expirée pour X`.
- **v2 : Crawl Twitter/X handles signature** — si l'API redevient utilisable.
- **v3 : Agrégat mensuel/annuel** (page récap des « meilleures pièces du mois » avec re-scoring éditorial humain).
- **v3 : RSS export** du dossier `veille-presse/` pour que les lecteurs s'abonnent.
- **v3 : Recherche full-text** sur les éditions passées (Lunr.js ou équivalent).
- **v3 : Commentaires lecteurs** (giscus ou équivalent).
