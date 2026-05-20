# Spec — Carte zoomable du playbook d'évaluation agentique

**Date** : 2026-05-20
**Dossier** : `evaluation-agentique/`
**Branche** : `claude/eval-infinite-canvas-2026-05-20`
**Statut** : draft à valider

## Intention

Ajouter un **second format** au dossier `evaluation-agentique/` : une carte zoomable qui place le playbook gruyère au centre et déploie les 14 sous-cartes (8 steps + 6 couches) chacune comme une zone reliée à un schéma technique du dossier. Trois niveaux de zoom discrets — *overview / zone / leaf* — façon details-on-demand de Shneiderman. Le format vise grand écran et propose un fallback explicite vers le rapport existant sur mobile. Un poster SVG A0 standalone est dérivé du canvas et téléchargeable.

## Cadrage et justification

**Pourquoi ce format ici** :
- Le playbook a une structure intrinsèquement hiérarchique (étapes → pièges → contre-mesures, et couches → mécanismes), donc le zoom est *significatif*, pas décoratif.
- Les 14 sous-cartes du playbook pointent toutes vers un schéma technique déjà présent dans le dossier (graders, observabilité, frameworks, coûts, simulation utilisateur, etc.) — la carte zoomable orchestre des assets existants, elle n'invente pas de contenu.
- C'est le 1er format zoomable du repo : différenciation forte, applicable ailleurs ensuite si ça tient.

**Pourquoi pas un autre dossier** :
- Le contenu eval s'y prête mieux que les autres (LLM jailbreaking, IA frugale, MCP plateforme…) parce que le playbook gruyère existe déjà comme schéma navigable.
- La densité de schémas existants (11 schémas, ~77 régions cliquables) garantit une réutilisation propre des leaves sans nouveau dessin SVG.

**Risques principaux** (et leur mitigation) :
- *Risque Prezi* — désorientation : mitigé par les 3 niveaux discrets + animation explicite + bouton "Vue d'ensemble" toujours accessible + URL deep-link par level-1/level-2.
- *Mobile* : assumé via redirection vers l'app existante. Pas de re-render linéaire pour éviter la duplication de contenu.
- *a11y/SEO* : assumé via fallback rapport + `aria-live` sur transitions + le canvas n'est pas la seule entrée du contenu (le hub + l'app textuelle restent canoniques).

## Architecture

### Fichiers à créer

```
evaluation-agentique/
├── 20260520-evaluation-agentique-canvas.html   (nouveau, fichier principal)
└── 20260520-evaluation-agentique-poster.svg     (nouveau, généré)

assets/
├── canvas-zoom.js                               (nouveau, lib partagée semantic zoom)
└── canvas-zoom.css                              (nouveau, lib partagée styles canvas)

tools/
└── extract_poster_svg.py                        (nouveau, dérive le poster depuis le canvas)
```

### Fichiers à modifier

```
evaluation-agentique/
└── index.html                                   (ajout d'une carte format 2)
```

### Fichiers de la lib partagée — utilisés

Le canvas embarque :
- `/assets/dossier-app.{js,css}` pour la topbar, le favicon, le sigil MG, le handler Escape global
- `/assets/canvas-zoom.{js,css}` **dès le jour 1** (nouvelle lib partagée) pour la mécanique semantic zoom

Choix assumé : extraction préemptive plutôt qu'inline-puis-extraction. Raison : le format zoomable est candidat à réutilisation sur d'autres dossiers (gouvernance, mcp-plateforme…), et la lib `dossier-app.{js,css}` montre qu'extraire à postériori coûte plus cher qu'extraire dès la première implémentation.

**Contrat DOM `/assets/canvas-zoom.js`** :
- `<svg id="canvas" data-canvas-zoom>` : opt-in par data-attr
- `<g class="zoom-target" data-node="..." data-leaf-viewbox="x y w h" data-parent-bbox="x,y,w,h">` : chaque leaf
- Bouton optionnel `[data-canvas-zoom-reset]` (la topbar y attache "Vue d'ensemble")
- API publique minimale : `window.canvasZoom.openLeaf(nodeId)`, `window.canvasZoom.reset()`, `window.canvasZoom.getLevel()`

## Hiérarchie de contenu (3 niveaux)

### Niveau 0 — root (viewBox global, vue d'ensemble)

- **viewBox** : `0 0 5000 3500` (ratio 1.428, A0 ≈ 1.414)
- **Centre** (translate 1900, 1350) : le SVG playbook+gruyère existant à sa taille native 1200×800
- **Autour** : **7 leaves "ghostées"** — opacity 0.15, labels masqués. Chaque leaf **regroupe 2 cards** du playbook qui partagent une phase ou un niveau de défense (pattern combined-modal des slideshows récents)
  - 4 leaves au-dessus du playbook, alignées sur les 4 phases (chaque leaf couvre 2 step boxes)
  - 3 leaves en-dessous, alignées sur les 3 niveaux de défense (chaque leaf couvre 2 cheese layers)
- **Connecteurs** : chaque leaf est reliée aux 2 cards parentes par 2 fines lignes
- **Annotation manuscrite** Caveat font discrète au démarrage : *"Cliquer pour zoomer · Échap pour revenir"*. Disparaît au premier zoom.

### Niveau 1 — zone (zoom sur une phase/niveau)

- **Trigger** : clic ou tap sur n'importe laquelle des 2 cards parentes (e.g. clic step-2 OU step-3 → ouvre la leaf L2)
- **Cible viewBox** : bbox(union des 2 parents + leaf + ~200 px de marge)
- **LOD** : la leaf cible passe à opacity 1, le playbook central à opacity 0.7, les autres leaves restent à 0.15
- **Lisible à ce niveau** : titre de la leaf (`PHASE 1 · COLLECTE TASKS` etc.) + 2-3 bullets clés par sous-card
- **Sortie** : clic sur la leaf focalisée → niveau 2 ; Échap → retour niveau 0

### Niveau 2 — leaf (drill-down sur les schémas techniques)

- **Trigger** : clic ou tap sur la leaf déjà focalisée au niveau 1
- **Cible viewBox** : `data-leaf-viewbox` lu directement depuis le `<g>` du leaf
- **Contenu** : **2 schémas existants juxtaposés** (côte à côte ou empilés selon la place), composition statique — pas de sous-zoom 2.5
- **LOD** : seule cette leaf à opacity 1, tout le reste à 0.05 (presque invisible)
- **Sortie** : Échap → retour niveau 1 ; clic fond → retour niveau 0

### Mapping leaf → cards & schémas existants

| Leaf | Cards groupées | Eyebrow | Titre | Schémas réutilisés |
|---|---|---|---|---|
| **L1** | step-0 + step-1 | `PHASE 1 · COLLECTE TASKS` | Anatomie & sources de tasks | 02-anatomie-evaluation (panorama complet) |
| **L2** | step-2 + step-3 | `PHASE 2A · CADRER LES CAS` | Pass@k & formula TestCase | 04-pyramide-metriques + 06bis-testcase-formula |
| **L3** | step-4 + step-5 | `PHASE 2B · HARNESS & GRADERS` | Observabilité + graders | 07-observabilite-rca + 03-taxonomie-graders + 05-llm-as-judge |
| **L4** | step-6 + step-7 | `PHASE 3 · MAINTENANCE` | Transcripts & évolution | 07 (focus trace) + 01-evolution-paradigmes |
| **L5** | cheese-1 + cheese-2 | `NIVEAU 1 · PRÉVENTIF` | Frameworks + monitoring | 08-frameworks-matrice + 07 (focus prod) |
| **L6** | cheese-3 + cheese-4 | `NIVEAU 2 · CURATIF` | Coûts & simulation utilisateur | 09-couts-goulots + 06-user-simulation |
| **L7** | cheese-5 + cheese-6 | `NIVEAU 3 · QUALITATIF` | Review humain & calibration LAJ | 07 (review humain) + 05 (calibration) |

**Couleurs** : chaque leaf reprend la couleur de phase/niveau du playbook source — L1/L5 en teal `#1F5560`, L2/L3/L6 en ocre `#B58A2C`, L4/L7 en carmine `#B7332C`. La cohérence chromatique fait le lien visuel entre le centre et ses leaves.

**Inline** : chaque schéma source est copié intégralement dans la leaf comme `<g>` nested avec `transform="translate(...) scale(...)"`. Les ids internes (markers, gradients) sont préfixés `L1-`, `L2-` etc. pour éviter les collisions.

**Réutilisations efficientes** : 07-observabilite-rca apparaît dans 4 leaves (L3, L4, L5, L7) avec des `clipPath` différents pour cadrer la portion pertinente. 05-llm-as-judge apparaît dans L3 et L7. Pas de redessin de schémas techniques.

## Mécanique de zoom

### Structure SVG racine

```html
<svg id="canvas" viewBox="0 0 5000 3500" aria-label="Carte zoomable du playbook d'évaluation agentique">
  <g id="root-content">
    <g id="playbook-center" transform="translate(1900,1350)">
      <!-- SVG existant 20260501-10-playbook-gruyere.svg inline ici -->
    </g>
    <g class="leaf" data-node="step-0"
       data-parent-bbox="80,200,120,100"
       data-leaf-viewbox="...x y w h..."
       data-state="ghost">
      <!-- ligne de connexion + leaf SVG inline -->
    </g>
    <!-- 13 autres leaves -->
  </g>
</svg>
```

Chaque `.zoom-target` porte :
- `data-node` : identifiant de la leaf (L1..L7)
- `data-cards` : liste CSV des cards parentes qui ouvrent cette leaf (ex. `"step-0,step-1"`, `"cheese-3,cheese-4"`)
- `data-parent-bbox` : `x,y,w,h` de l'**union** des 2 cards parentes (référentiel SVG racine)
- `data-leaf-viewbox` : viewBox cible pour le niveau 2 (`x y w h`)
- `data-state` : attribut runtime, vide par défaut / `focused` / `dimmed`

### Animation viewBox

Interpolation linéaire des 4 valeurs viewBox sur **600 ms**, easing `cubic-bezier(0.22, 1, 0.36, 1)`, via `requestAnimationFrame`. À chaque frame : `canvas.setAttribute('viewBox', ...)`. Pas de CSS transform — le viewBox natif garde la netteté du texte au zoom max.

### LOD (opacity par état)

CSS :
```css
.leaf { opacity: 0.15; transition: opacity 400ms ease; }
.leaf[data-state="focused"] { opacity: 1; }
.leaf[data-state="dimmed"] { opacity: 0.05; }
#playbook-center[data-state="dimmed"] { opacity: 0.7; }
#playbook-center[data-state="dimmed-deep"] { opacity: 0.05; }
```

Transitions JS :
- level-0 → level-1(node) : tous `.leaf` restent ghost, sauf `[data-node=node]` → focused ; `#playbook-center` → dimmed
- level-1(node) → level-2(node) : tous `.leaf` → dimmed, sauf `[data-node=node]` → focused ; playbook → dimmed-deep
- → level-0 : tous reset à ghost, playbook reset

### Interaction

- **Clic/tap** sur un step ou cheese box (`data-card="step-N"` ou `data-card="cheese-N"` dans le SVG playbook) → résolution card → leaf via `data-cards` CSV → level-1 sur la leaf qui couvre cette card
- **Clic/tap** sur la leaf focalisée → level-2
- **Clic sur fond** (event sur `[data-canvas-background]`), **bouton "↑ Vue d'ensemble"**, **Échap** → revient niveau précédent (level-2 → level-1 → level-0)
- **Flèche gauche/droite** à level-1 ou level-2 → navigue entre frères dans l'ordre L1..L7 (les 4 phases puis les 3 niveaux gruyère)
- **Pas de wheel/pinch zoom** — discipline assumée

### Résolution card → leaf

Le handler de clic traduit un `data-card="step-3"` en l'ID de leaf qui le couvre (`L2`) via :

```js
function findLeafForCard(cardId) {
  return targets.find(t => (t.dataset.cards || '').split(',').includes(cardId));
}
```

Pas de hardcoding — la lib `canvas-zoom.js` reste agnostique au schéma de regroupement. La page définit ses leaves avec leurs `data-cards`, la lib lit.

### Deep-link & historique

- `history.pushState({ level, node }, '', '#leaf-id')` à chaque transition
- `popstate` listener pour gérer back/forward navigateur
- Au chargement, lecture de `location.hash` : `#L2` ouvre directement le niveau 2 sur la leaf L2 ; `#zone-L2` ouvre le niveau 1
- **Backward compat des deep-links card** : `#step-3` est résolu via `findLeafForCard` au chargement → ouvre `L2`. Permet de partager `#step-3` même si la structure d'une leaf bouge.
- Pas de hash → niveau 0

## Fallback mobile (sous 768 px)

### Détection

```js
window.matchMedia('(max-width: 768px)').matches
```

À vérifier au DOMContentLoaded **et** à chaque `resize` (rotation device).

### Interstitiel

Plein écran, par-dessus le canvas. Contenu :

> **Le format carte zoomable est conçu pour grand écran.**
>
> Sur mobile, on bascule sur le rapport interactif du dossier qui couvre les mêmes notions en lecture linéaire.
>
> [ → Lire le rapport interactif ]   [ Rester sur la carte (zoom limité) ]

Le lien sortant pointe vers `20260501-evaluation-agentique-app.html#10-playbook-de-zero-a-des-evals-fiables` (ancre directe vers la section playbook).

Le bouton "Rester" cache l'interstitiel et laisse le canvas accessible. Le zoom reste fonctionnel mais avec de petites cibles tactiles — compromis assumé pour l'a11y de base.

### Pourquoi pas de re-render linéaire mobile

- Duplique l'app existante
- Charge de maintenance double sur le contenu
- L'app `20260501-…-app.html` a déjà la version mobile testée et propre (cf. règles CLAUDE.md `header.site + main#report`)

## Poster SVG A0 standalone

### Production en deux temps

**Le poster n'est pas une simple extraction du canvas** : c'est un livrable autonome qui exige une **identité visuelle unifiée** au-delà des 11 schémas réutilisés. Le canvas, sur écran, raconte par interaction (zoom, ghost, focus) ; le poster, en print, doit raconter par composition statique.

**Étape 1 — extraction mécanique** (script idempotent) :

```bash
python tools/extract_poster_svg.py evaluation-agentique/20260520-evaluation-agentique-canvas.html
```

Le script :
1. Lit le `<svg id="canvas">` inline du canvas HTML
2. Force tous les `data-state` → `focused` (équivaut à opacity 1)
3. Inline les Google Fonts via `<defs><style>@font-face{…}</style></defs>` avec base64 (ou fallback Georgia/Helvetica/Courier si trop lourd)
4. Écrit un brouillon `evaluation-agentique/20260520-evaluation-agentique-poster-draft.svg`

**Étape 2 — habillage éditorial** (édition manuelle ou semi-générée) :

Le brouillon est ensuite enrichi pour devenir le poster final. Liste des couches d'identité visuelle à produire (chiffrage volontairement vague — à raffiner dans le plan) :

- **Bandeau titre** plein largeur en haut : titre éditorial *"Évaluer un agent — playbook gruyère"* + sous-titre *"de 20 tasks à un harness fiable"* + métadonnées (date, auteur, URL canonique)
- **Légende narrative** verticale à gauche ou en bas : 5-7 lignes qui racontent l'arc *"on commence ici → on déploie en confiance"*
- **Visuels de liaison** : flèches/cordons stylisés qui relient le playbook central à ses 14 leaves de façon plus expressive que les fines lignes du canvas écran. Ces visuels n'existent pas dans le canvas — c'est du dessin neuf, dédié au poster.
- **Légende couleur** : un mini-encart qui explique la sémantique des 3 phases du playbook (collecte / harness & graders / maintenance) et des 3 niveaux de gruyère (préventif / curatif / qualitatif)
- **Cartouche signature** en bas-droite : sigil MG (cf. skill `svg-schemas`) + URL + date + mention "Format co-écrit avec l'aide d'une IA"
- **Numérotation visuelle** : chaque leaf porte son repère L1..L7 (couleur calée sur la phase/niveau associé) qui en print remplace le hint "cliquer pour zoomer" du canvas. Au sein de chaque leaf, les sous-cards conservent leurs labels naturels (S0/S1 dans L1, C1/C2 dans L5, etc.) pour permettre la lecture détaillée en print.

Cette étape 2 produit `evaluation-agentique/20260520-evaluation-agentique-poster.svg` (sans suffixe `-draft`). Le brouillon `-draft.svg` reste dans le repo comme intermédiaire pour les re-runs ultérieurs.

**Workflow re-run** : si le canvas change, on re-run l'étape 1 (regénère le brouillon), puis on re-applique manuellement les éléments d'habillage à partir du brouillon mis à jour. À voir si on peut formaliser l'habillage en un overlay SVG séparé qui se compose avec le brouillon — c'est le bon objectif d'évolution mais hors scope v1.

**Source de vérité hybride** : canvas HTML pour les schémas et la structure ; poster.svg pour l'habillage éditorial. Cohabitation assumée.

### Dimensions et lisibilité

- viewBox `0 0 5000 3500`
- A0 print 1189×841 mm → 1 unité viewBox = 0.238 mm
- Min font size dans le SVG actuel : 9pt body, 10pt mono → reste lisible jusqu'à 6pt en print
- A1 print acceptable (594×841 mm) → 1 unité = 0.168 mm, body 9pt = 1.51 mm = 4.3pt impression — à la limite

### Lien depuis le canvas HTML

Bouton discret en topbar (icône `↓` + label "Poster A0"), pointe vers le `.svg` avec attribut `download`.

## Intégration site

### Hub `evaluation-agentique/index.html`

Ajout d'une carte format 2 entre la carte rapport et la carte admin md :

```html
<a href="20260520-evaluation-agentique-canvas.html" class="format">
  <div class="format-tag">Format expérimental · Carte zoomable</div>
  <h2 class="format-title">La <em>carte mentale</em></h2>
  <p class="format-sub">Le playbook gruyère 8 étapes au centre, et 14 zooms qui déploient les concepts techniques — graders, observabilité, frameworks, coûts. Pensée pour grand écran. Poster A0 téléchargeable.</p>
  <div class="format-cta">
    <span>Exploration · 15-30 min</span>
    <span class="arrow">Ouvrir →</span>
  </div>
</a>
```

Le compteur meta `10 sections · 11 schémas interactifs · ~77 régions cliquables · 50 sources · Deep research` reste inchangé — la carte est une *vue* du même contenu.

### Topbar du canvas HTML

Pattern 3-items standard (`Mathieu Guglielmino` / `Évaluer un agent` / `← Hub · Accueil`) **plus** :
- bouton "↑ Vue d'ensemble" (visible uniquement à level-1 ou level-2)
- bouton "↓ Poster A0" (toujours visible, download)

### SEO

Re-run après ajout :
```bash
python tools/seo_dossiers.py --only evaluation-agentique
```

Régénère l'`og.png` du dossier et propage le bloc OG/Twitter/canonical/JSON-LD sur tous les fichiers HTML du dossier (hub + app + canvas).

Le canvas obtient son propre `<title>`, canonical, og:title et og:description spécifiques (mot accent candidat : "carte"). Le bloc est encadré par `<!-- og:start -->` / `<!-- og:end -->` pour permettre les re-runs idempotents.

### Accueil racine

Pas de modification — l'entrée "evaluation-agentique" pointe déjà vers le dossier, c'est le hub qui aiguille.

## Accessibilité

- `aria-label="Carte zoomable du playbook d'évaluation agentique"` sur le `<svg id="canvas">`
- `tabindex="0"` + `role="button"` + `aria-label` sur chaque step/cheese (déjà présent dans le SVG existant)
- `<div aria-live="polite" class="sr-only">` qui annonce les transitions : "Zoom sur étape 5 — Graders", "Retour à la vue d'ensemble"
- **Navigation clavier complète** : Tab parcourt les zones, Enter pour zoomer, Échap pour dézoomer, flèches gauche/droite pour naviguer entre frères au niveau 1/2
- Sur mobile, l'interstitiel offre la sortie vers le rapport linéaire (a11y assumée par le rapport existant, pas par le canvas)

## Mobile-friendliness — checklist CLAUDE.md (7 points)

| Point | Cas canvas |
|---|---|
| 1. `overflow-x: hidden` sur html/body | Oui sur le canvas HTML. Sur l'interstitiel mobile, pas de scroll horizontal possible. |
| 2. Topbar fixe responsive | Hérite du pattern lib partagée — testé déjà sur 12+ apps. |
| 3. App `header.site + main#report` mobile typography | Non applicable : le canvas n'a pas de `main#report`, c'est un `<main>` avec un SVG plein viewport. |
| 4. SVG `width:100%; height:auto` + zoom plein écran | Le canvas SVG a son propre zoom interne (semantic). Pas de zoom plein écran lib partagée (conflit). Le poster A0 est téléchargeable comme échappatoire mobile. |
| 5. Sidebars panel-close | Non applicable : pas de TOC/Sources sur le canvas. |
| 6. `<pre>` / `<code>` overflow | Non applicable : pas de bloc code dans le canvas. |
| 7. `<table>` overflow | Non applicable : pas de tableau dans le canvas. |

**Conclusion** : la checklist 7 points est trivialement respectée parce que le canvas n'embarque pas la structure `header.site + main#report + sidebars` qui motive la majorité des règles.

## Tests à prévoir

Pas de tests CI automatiques pour ce format (le `tests/lib-contract.test.mjs` ne s'applique qu'aux apps qui embarquent la lib partagée — le canvas l'embarque mais pas comme app deep-research, donc il sera auto-skippé via la regex existante).

Vérifications manuelles obligatoires avant merge :
1. Niveau 0 → niveau 1 sur les 14 cards (8 steps + 6 cheese), chacune ouvrant la leaf L1..L7 attendue
2. Niveau 1 → niveau 2 sur les 7 leaves
3. Échap remonte d'un niveau à chaque fois
4. Flèches gauche/droite cyclent dans l'ordre L1..L7
5. Bouton "Vue d'ensemble" remet à niveau 0 depuis n'importe quel état
6. URLs deep-link `#L2`, `#zone-L5` (et compat `#step-3` qui résout vers L2) ouvrent au bon niveau
7. Back/forward navigateur retracent les transitions
8. Mobile 320/375/414 px : interstitiel affiché ; bouton "Rester" rend le canvas accessible ; "Lire le rapport" ouvre l'app à l'ancre attendue
9. Poster `.svg` ouvert dans Inkscape/Illustrator/navigateur affiche tout déplié avec fonts correctes
10. Topbar 3-items + bouton "Poster A0" + bouton "Vue d'ensemble" tous fonctionnels

## Plan d'exécution (haut niveau)

L'implémentation détaillée sera spécifiée par writing-plans. Vue d'ensemble :

1. Squelette HTML + topbar + SVG canvas viewBox `0 0 5000 3500`
2. Inline du playbook central
3. Positionnement et inline des 14 leaves (avec lignes de connexion)
4. Définition des `data-leaf-viewbox` pour chaque leaf
5. Logique JS d'animation viewBox + LOD + clavier + historique
6. Interstitiel mobile + détection + redirection
7. Bouton "Vue d'ensemble" topbar
8. Script `tools/extract_poster_svg.py` + génération du `.svg`
9. Bouton "Poster A0" topbar
10. Hub `index.html` : ajout de la carte format 2
11. Re-run `tools/seo_dossiers.py --only evaluation-agentique`
12. Tests manuels checklist 10 points
13. Diff review → commit → push branche → PR via MCP GitHub

## Hors scope

- Pas de zoom continu wheel/pinch (assumé : semantic discret uniquement)
- Pas de re-render linéaire mobile (assumé : redirection vers l'app)
- Pas de nouveau SVG **technique** à dessiner pour le canvas (assumé : réutilisation des 11 schémas existants pour les leaves)
- Pas de quizzes embarqués (assumé : le canvas pointe vers les concepts, pas vers des questions)
- Pas de modifications de l'app existante `20260501-…-app.html` (assumé : le canvas est un format additif, l'app reste la référence narrative)
- Pas de formalisation de l'habillage poster en overlay automatisé v1 (assumé : étape 2 du poster reste manuelle, automatisation candidate pour v2)
