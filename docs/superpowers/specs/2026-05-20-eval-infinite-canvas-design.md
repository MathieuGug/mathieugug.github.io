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

tools/
└── extract_poster_svg.py                        (nouveau, dérive le poster depuis le canvas)
```

### Fichiers à modifier

```
evaluation-agentique/
└── index.html                                   (ajout d'une carte format 2)
```

### Fichiers de la lib partagée — non modifiés

Le canvas embarque `/assets/dossier-app.{js,css}` pour la topbar, le favicon, le sigil MG, le handler Escape global. La logique de zoom canvas est **inline** dans le fichier HTML (pas extraite dans la lib) tant qu'il y a un seul dossier qui utilise ce format. Extraction quand un deuxième dossier suit le pattern.

## Hiérarchie de contenu (3 niveaux)

### Niveau 0 — root (viewBox global, vue d'ensemble)

- **viewBox** : `0 0 5000 3500` (ratio 1.428, A0 ≈ 1.414)
- **Centre** (translate 1900, 1350) : le SVG playbook+gruyère existant à sa taille native 1200×800
- **Autour** : 14 leaves "ghostées" — opacity 0.15, labels masqués
  - 8 leaves au-dessus du playbook, alignées sur les 8 step boxes, connectées par une fine ligne verticale
  - 6 leaves en-dessous, alignées sur les 6 cheese layers, connectées par une fine ligne verticale
- **Annotation manuscrite** Caveat font discrète au démarrage : *"Cliquer pour zoomer · Échap pour revenir"*. Disparaît au premier zoom.

### Niveau 1 — zone (zoom sur une étape/couche)

- **Trigger** : clic ou tap sur une step box ou cheese layer
- **Cible viewBox** : bbox(parent + son leaf + ~200 px de marge), calculée à partir des positions connues
- **LOD** : le leaf cible passe à opacity 1, le playbook central à opacity 0.7, les autres leaves restent à 0.15
- **Lisible à ce niveau** : titre du leaf + 2-3 bullets clés
- **Sortie** : clic sur le leaf focalisé → niveau 2 ; Échap → retour niveau 0

### Niveau 2 — leaf (drill-down sur le schéma technique)

- **Trigger** : clic ou tap sur le leaf déjà focalisé au niveau 1
- **Cible viewBox** : `data-leaf-viewbox` lu directement depuis le `<g>` du leaf
- **Contenu** : le schéma existant du dossier, inliné comme `<g>` nested
- **LOD** : seul ce leaf à opacity 1, tout le reste à 0.05 (presque invisible)
- **Sortie** : Échap → retour niveau 1 ; clic fond → retour niveau 0

### Mapping leaf → schéma existant

| Node | Schéma source | Type |
|---|---|---|
| step-0 *démarrer tôt* | extrait 02-anatomie-evaluation (zone "20-50 tasks") | crop |
| step-1 *manuel d'abord* | extrait 02-anatomie-evaluation (zone "sources") | crop |
| step-2 *non ambiguïté* | 04-pyramide-metriques (focus pass@k vs pass^k) | inline |
| step-3 *équilibre* | extrait 06bis-testcase-formula | inline |
| step-4 *harness stable* | 07-observabilite-rca | inline |
| step-5 *graders* | 03-taxonomie-graders + 05-llm-as-judge | inline (deux SVG juxtaposés) |
| step-6 *lire transcripts* | 07-observabilite-rca (focus trace) | crop |
| step-7 *saturation* | extrait 01-evolution-paradigmes | crop |
| cheese-1 *automated* | 08-frameworks-matrice | inline |
| cheese-2 *production monitoring* | 07-observabilite-rca (focus prod) | crop |
| cheese-3 *A/B testing* | 09-couts-goulots | inline |
| cheese-4 *user feedback* | 06-user-simulation | inline |
| cheese-5 *manual transcript* | 07-observabilite-rca (angle review humain) | crop |
| cheese-6 *human studies* | 05-llm-as-judge (focus calibration) | crop |

**"Inline"** = SVG complet copié dans le canvas comme `<g>` avec translate dans son rectangle.
**"Crop"** = SVG existant copié mais avec un `viewBox` interne qui ne montre qu'une portion (clip-path éventuel).

Trois schémas (07-observabilite-rca, 05-llm-as-judge, 02-anatomie-evaluation) sont réutilisés 2-4 fois avec des cadrages différents — réutilisation efficiente, pas de redessin.

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

Chaque `.leaf` porte :
- `data-node` : identifiant (step-0..7, cheese-1..6)
- `data-parent-bbox` : `x,y,w,h` de la step/cheese box parente (référentiel SVG racine)
- `data-leaf-viewbox` : viewBox cible pour le niveau 2 (`x y w h`)
- `data-state` : `ghost` (initial) / `focused`

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

- **Clic/tap** sur une step ou cheese box (déjà `data-card="step-N"` dans le SVG playbook) → level-1
- **Clic/tap** sur le leaf focalisé → level-2
- **Clic sur fond** (event sur `<svg>` sans target intéressant), **bouton "↑ Vue d'ensemble"**, **Échap** → revient niveau précédent (level-2 → level-1 → level-0)
- **Flèche gauche/droite** à level-1 ou level-2 → navigue entre frères dans l'ordre step-0..7 puis cheese-1..6
- **Pas de wheel/pinch zoom** — discipline assumée

### Deep-link & historique

- `history.pushState({ level, node }, '', '#node-id')` à chaque transition
- `popstate` listener pour gérer back/forward navigateur
- Au chargement, lecture de `location.hash` : `#step-5` ouvre directement le niveau 2 sur step-5
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

### Production

```bash
python tools/extract_poster_svg.py evaluation-agentique/20260520-evaluation-agentique-canvas.html
```

Le script :
1. Lit le `<svg id="canvas">` inline du canvas HTML
2. Force tous les `data-state="ghost"` → `data-state="focused"` (équivaut à opacity 1)
3. Inline les Google Fonts via `<defs><style>@font-face{…}</style></defs>` avec base64 (ou fallback Georgia/Helvetica/Courier si trop lourd)
4. Ajoute un cartouche signature en bas-droite : titre + date + URL canonique + sigil MG (cf. skill `svg-schemas` pour le sigil)
5. Écrit `evaluation-agentique/20260520-evaluation-agentique-poster.svg`

**Idempotent** — re-runnable à chaque modification du canvas.

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
1. Niveau 0 → niveau 1 sur tous les nodes (8 + 6 = 14)
2. Niveau 1 → niveau 2 sur tous les nodes
3. Échap remonte d'un niveau à chaque fois
4. Flèches gauche/droite cyclent dans l'ordre attendu
5. Bouton "Vue d'ensemble" remet à niveau 0 depuis n'importe quel état
6. URLs deep-link `#step-3`, `#cheese-2` ouvrent direct au niveau 2
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
- Pas d'extraction de la mécanique de zoom dans la lib partagée (assumé : inline dans le fichier tant qu'il y a un seul dossier qui utilise le format)
- Pas de nouveau SVG technique à dessiner (assumé : réutilisation des 11 schémas existants)
- Pas de quizzes embarqués (assumé : le canvas pointe vers les concepts, pas vers des questions)
- Pas de modifications de l'app existante `20260501-…-app.html` (assumé : le canvas est un format additif, l'app reste la référence narrative)
