# Slideshow narratif — design

> Brouillon validé en brainstorming le 2026-05-05. Auteur : Mathieu Guglielmino. À relire avant transition vers writing-plans.

## 1. Intention et niche

Le site `mathieugug.github.io` propose plusieurs formats pour ses dossiers : hub, app illustrée long format, scrollytelling, livre, journal, pitch HTML, rapport markdown. Ce nouveau format — **slideshow narratif** — comble une niche qui n'est pas encore occupée :

> Une expérience scénique plein écran, lecture rapide (~10-12 min), où chaque "scène" présente un schéma SVG qui se construit en plusieurs étapes sous les yeux du lecteur, ponctuée de scènes-respiration en typographie XXL. Le lecteur garde le contrôle du rythme (clavier ou clic), peut zoomer ou ouvrir des modaux à la demande pour creuser, et arrive à un outro qui pointe vers le format long correspondant.

Promesse vis-à-vis du lecteur : *"Je te raconte un sujet en scènes plein écran, le schéma se construit avec toi, et tu peux plonger ou filer à ton rythme."*

Trois différenciations vis-à-vis des formats existants :
- vs **app illustrée** : la lecture rapide remplace la lecture posée. Format ~10 min vs ~45 min. Une porte d'entrée pour découvrir un sujet, l'app reste la référence dense.
- vs **scrollytelling** (pattern d'`anatomie/`) : pas de scroll. Plein écran, navigation discrète. Sensation théâtrale au lieu de la sensation de descente continue.
- vs **pitch HTML** (pattern de `gouvernance/`) : ajoute la chorégraphie progressive intra-scène (les étapes internes), les modaux à la demande et le zoom — qui transforment un deck en exploration.

Le slideshow est un **format de découverte / synthèse**, pas un format d'expert. Il s'inscrit comme troisième porte d'un dossier qui possède déjà une étude longue.

## 2. Cas d'usage : exemple sur `narrative-experiences`

Le proto cible est l'étude `narrative-experiences/` (publiée le 2026-05-05). Elle contient 7 schémas SVG et 19 sources. Le slideshow condense cette étude en **11 scènes** :

| # | Type | Titre | Schéma source |
|---|------|-------|---------------|
| 01 | punchline | « Une expérience narrative *impose une structure auctoriale* aux données tout en *préservant l'agence cognitive* du lecteur. » | — |
| 02 | schema | Le spectre auteur ↔ lecteur | 01-spectre-auteur-lecteur |
| 03 | schema | Les fondations canoniques | 02-fondations-canoniques |
| 04 | schema | Genres × dimensions de design | 03-genres-dimensions |
| 05 | punchline | « Le data storytelling moderniste prétend à *l'objectivité de la donnée*. Le tournant humaniste rappelle que *chaque visualisation est un acte éditorial*. » | — |
| 06 | schema | Le manifeste Data Humanism | 04-data-humanism |
| 07 | schema | Pipelines techniques | 05-pipelines-techniques |
| 08 | schema | La chaîne augmentée par IA | 06-chaine-augmentee |
| 09 | schema | Matrice contexte × pattern | 07-matrice-contexte-pattern |
| 10 | punchline | « *Sept étapes* dans la chaîne. *Trois* où l'IA aide. *Deux* où elle nuit. » | — |
| 11 | outro | Pour aller plus loin | — |

Trois scènes-respiration (01, 05, 10) intercalent le rythme. La scène 11 est l'outro avec CTA vers l'étude longue + rapport markdown + recommencer.

## 3. Architecture du fichier

**Fichier :** `narrative-experiences/20260505-narrative-experiences-slideshow.html` — un seul fichier HTML autonome, sans dépendance externe au-delà des Google Fonts (Fraunces / Inter / JetBrains Mono).

**Imports :**
- Polices Google Fonts (preconnect comme partout sur le site)
- Favicon `/favicon.svg` à la racine du site
- Pas de framework, pas de lib (pas de GSAP, pas d'anime.js)

**Schémas SVG :** copiés inline depuis `20260505-narrative-experiences-app.html` au lieu d'être référencés via `<img>` ou `<object>` depuis `images/`. Raisons : (a) permet de cibler les `<g id="…">` internes pour la chorégraphie, (b) réutilise les `data-modal-…` existants pour les modaux cliquables, (c) garde le slideshow auto-suffisant en `file://`.

**Estimation taille :** ~2 Mo non-compressés (essentiellement les 7 SVG inline). Gzip ramène à ~330 Ko sur le réseau. Acceptable pour GitHub Pages.

**Hub mis à jour** (`narrative-experiences/index.html`) :
- Ajout d'une troisième carte `.format` entre l'app illustrée et le rapport markdown
- Tag : `Format · Slideshow narratif`
- Titre : `Le *récit illustré*` (le « illustré » en `<em>` accent)
- Sub : « Onze scènes plein écran, animations progressives, modaux à la demande, navigation au clavier ou au clic. La même étude condensée en 10 minutes. »
- CTA : `Lecture · 10-12 min` / `Ouvrir →`
- Métadonnées du hub : `Trois formats · 1 étude · 7 schémas · 19 sources`

**Skill `illustrated-deep-research` : non modifiée à ce stade.** La généralisation (faire du slideshow un format optionnel de la skill) est explicitement hors scope. Hypothèse à reposer après validation du proto.

## 4. Modèle de données : scène, étape, mise en valeur

Le slideshow est piloté par un tableau JS déclaratif `SCENES`. Trois types de scène, traités par le même moteur :

```js
const SCENES = [
  // type 'punchline'
  {
    id: 'intro',
    type: 'punchline',
    title: null,
    body: 'Une expérience narrative <mark>impose une structure auctoriale</mark> aux données tout en <mark>préservant l\'agence cognitive</mark> du lecteur.',
    attribution: 'Mathieu Guglielmino, mai 2026'
  },

  // type 'schema'
  {
    id: 'spectre-segel-heer',
    type: 'schema',
    title: 'Le spectre auteur ↔ lecteur',
    schemaId: 'svg-01-spectre',
    steps: [
      {
        caption: 'Sept genres narratifs identifiés par Segel et Heer en 2010.',
        highlight: ['#genres-row'],
        dim: [],
        modalAuto: null
      },
      {
        caption: 'Un axe les ordonne : qui mène — l\'auteur ou le lecteur ?',
        highlight: ['#genres-row', '#spectrum-axis'],
        dim: [],
        modalAuto: null
      },
      {
        caption: 'À gauche, l\'auteur dirige strictement.',
        highlight: ['#genre-magazine', '#genre-poster'],
        dim: ['#genres-row'],
        modalAuto: 'magazine-style'
      }
      // … etc
    ]
  },

  // type 'outro'
  {
    id: 'outro',
    type: 'outro',
    title: 'Pour aller plus loin',
    body: 'L\'étude longue détaille les sept étapes du cadre praticien et propose un arbre de décision.',
    cta: { href: '20260505-narrative-experiences-app.html', label: 'Ouvrir l\'étude illustrée' }
  }
];
```

### Comportement par type

| Type | Rendu | Étapes | Transitions intra |
|---|---|---|---|
| `schema` | Titre haut + SVG plein écran centré + caption qui change. | Multiples (3-7 typiquement). Étape 0 = état neutre, premier `→` passe à étape 1. | Application/retrait des classes CSS sur les sélecteurs SVG, transition CSS 220ms sur opacité/stroke. |
| `punchline` | Pas de titre. Texte XXL centré (clamp 40-72px), Fraunces serif italic. `<mark>` honorée selon le pattern site. Fond `--bg` avec radial-gradient `--accent` plus marqué. Attribution en bas en JetBrains Mono 10px. | Une seule étape (statique). | Fade-in à l'arrivée, 500ms. |
| `outro` | Titre Fraunces 48px + corps 22px Fraunces italic + bouton CTA primaire `--accent` + bouton secondaire vers le rapport markdown + lien « Recommencer » + lien retour aux dossiers. | Une seule étape. | Fade-in à l'arrivée, 500ms. |

### Vocabulaire visuel des révélations (3 primitives CSS)

Appliquées aux sélecteurs SVG en fonction de l'étape courante :

- `.dim` → `opacity: 0.18`, transition 220ms. Élément présent mais en arrière-plan.
- `.active` → `opacity: 1`, plus boost facultatif (`filter: drop-shadow(0 0 0 var(--accent))` ou `stroke-width +1`). Transition 220ms.
- `.hidden` → `opacity: 0; pointer-events: none`. Élément qui n'apparaît qu'à partir d'une étape donnée (ex : flèche tracée tardivement).

Pour les chorégraphies plus fines (tracé de ligne SVG en `stroke-dashoffset`, pulsation de cercle, etc.) : règles CSS keyframes inline dans la `<style>` du fichier, déclenchées par classes `scene-step-N` sur le SVG parent. Pas de lib externe.

### Modal : automatique ou cliquable, même infrastructure

Le `#modal-root` et la fonction `openModal(eyebrow, title, body)` sont **copiés tels quels** depuis `20260505-narrative-experiences-app.html`. Deux déclencheurs coexistent :

1. **Clic** sur région cliquable du SVG (régions déjà câblées dans l'app illustrée). Pendant qu'un modal est ouvert, `→` ferme le modal au lieu d'avancer la scène. Échap ferme aussi.
2. **Chorégraphie** : si une étape déclare `modalAuto: 'magazine-style'`, le moteur appelle `openModal()` 220ms après le début de la transition CSS de l'étape (donc à la fin de cette transition). Le lecteur lit, puis `→` **ferme le modal et avance d'un coup à l'étape suivante** (combo). Échap ferme le modal sans avancer.

## 5. Moteur et chorégraphie

### Machine d'état

Une seule paire `(currentSceneIndex, currentStepIndex)`. Tous les inputs convergent vers trois fonctions : `advance()`, `retreat()`, `gotoScene(N)`. Une fonction `render()` redessine après chaque mutation.

### Pseudo-code du déroulé d'une scène-schema

```
Entrée scène N → fade-out scène N-1 (250ms vers --bg)
              → hide all SVG, show SVG cible
              → fade-in scène N (250ms)
              → SVG dans état "scene-step-0" (squelette neutre, dim)
              → caption d'intro

→ (input avance) → scene-step-1 → CSS révèle highlight[0], dim dim[0]
                                → caption[1] avec fade 180ms

→ (input avance) → scene-step-2 → ...

→ Si l'étape K a modalAuto :
   après transition CSS de l'étape (220ms), openModal(...) avec contenu mappé
   tant que modal ouvert : input `→` ferme + avance à étape K+1 (combo)

→ (input avance après dernière étape) → gotoScene(N+1) → fade-through-paper
```

### Mapping des inputs

| Input | Action |
|---|---|
| `→`, `Espace`, `PgDown`, clic gauche sur la stage | `advance()` : étape ou scène suivante |
| `←`, `PgUp`, clic gauche + `Shift` | `retreat()` : étape ou scène précédente |
| `↑`, `↓` | `gotoScene(currentSceneIndex ∓ 1)` : saut direct de scène |
| Tap (touch device) | `advance()` |
| Swipe horizontal | seuil 60px + vélocité min ; → = scène +1, ← = scène -1 |
| Clic marqueur de timeline | `gotoScene(N)` |
| Clic région cliquable SVG | `openModal(...)` ; `e.stopPropagation()` pour empêcher l'avance parent |
| Touche `S` ou clic `[≡]` | toggle sommaire-overlay |
| Touche `R` ou clic `[Sources]` | toggle sources-overlay |
| Échap | ferme dans cet ordre : modal > zoom > sources-overlay > sommaire-overlay |

**Règle précise du `→` selon l'état :**

| État | Comportement de `→` |
|---|---|
| Aucune surface ouverte | Avance à l'étape ou scène suivante |
| Modal **cliqué** ouvert (lecteur a cliqué une région SVG) | Ferme le modal seulement. Pas d'avance. Le lecteur appuie une seconde fois pour avancer. |
| Modal **modalAuto** ouvert (déclenché par chorégraphie d'une étape) | Ferme le modal **et** avance d'un coup à l'étape suivante (combo). |
| Sommaire-overlay ou sources-overlay ouvert | Ne fait rien. Seul Échap ferme. |
| Zoom plein écran ouvert | Ne fait rien. Seul Échap ferme. |

Distinguer modal-cliqué et modal-modalAuto : flag `__modalAutoActive` posé par le moteur quand il appelle `openModal()` depuis la chorégraphie, retiré à la fermeture.

### Indication "clique pour avancer"

Pulse `→` discret en bas à droite de la scène, opacité 0.5, pulse à 1.5s d'intervalle. Apparaît après 4s d'inactivité sur l'étape courante. Disparaît dès le prochain input.

### Transition inter-scènes : fade-through-paper

```js
async function gotoScene(index) {
  stage.classList.add('fading-out');     // CSS opacity 0, 250ms
  await wait(250);
  swapVisibleScene(index);
  stage.classList.remove('fading-out');  // fade-in 250ms
  await wait(250);
  resetSceneToStep0(index);
}
```

Total ~500ms par changement de scène. Sous `prefers-reduced-motion: reduce`, les délais passent à 0ms (cut sec).

## 6. UI persistant

### Layout plein écran

```
┌───────────────────────────────────────────────────┐
│ [topbar]      Mathieu Guglielmino  ← Retour ...  │  56px
├───────────────────────────────────────────────────┤
│  03 · Le spectre auteur ↔ lecteur                 │  48px Fraunces
│                                                   │
│        [SVG plein écran centré]                   │  ~70% viewport
│                                                   │
│        Caption qui change selon l'étape           │  18-22px italic
│                                                   │
├───────────────────────────────────────────────────┤
│ ━━━━━━━━━━━ ◉━━━ ━ ━ ━ ━ ━     [Sources] [≡]   │  pied 32px
└───────────────────────────────────────────────────┘
```

### Topbar

Reprend exactement le composant `<header class="topbar">` du site (Mathieu Guglielmino à gauche + `← Retour aux dossiers` pointant `../index.html#series` à droite). Hauteur réduite à 48px. Auto-masquage après 3s d'inactivité, réapparition au mouvement de souris ou au tap. À tester dans le proto, comportement non-définitif si gênant.

### Titre de scène

Position `top: 64px`, monospace 12px `03 ·` + Fraunces 48px (clamp 28-48px). Pour `punchline`/`outro`, masqué (le contenu lui-même est le titre). Fade out/in lors des transitions.

### Timeline cliquable (élément singulier du format)

Position `bottom: 32px`, centrée à 60% de la largeur. 11 segments horizontaux (~36px de large, séparés par 4px) :
- Scène-schema : trait `━━━`
- Scène-punchline : point plein `◉` au centre
- Scène-outro : chevron `▸`

États visuels :
- Non-visitée : couleur `--text-faint`
- En cours : couleur `--accent`, **se remplit progressivement** en sous-segment de gauche à droite à mesure que les étapes internes sont consommées
- Visitée : couleur `--accent` à pleine opacité

Hover (desktop) = tooltip `01 · Intro`, `02 · Le spectre auteur ↔ lecteur`, etc. Clic / tap = `gotoScene(N)`.

### Boutons à droite de la timeline

`[Sources]` et `[≡]`, JetBrains Mono 9.5px, `letter-spacing: 0.18em`, `text-transform: uppercase`, couleur `--text-mid`, hover `--accent`. Style identique aux autres liens du site.

### Sommaire-overlay

Touche `S` ou clic `[≡]`. Plein écran, fond `--bg` à 0.95 opacité, backdrop-blur 12px. Fade-in 200ms. Liste verticale des 11 scènes, format ligne : `01 · Intro · 1 étape`, `02 · Le spectre auteur ↔ lecteur · 5 étapes`. Hover = `--accent`. Clic = `gotoScene(N)` + ferme l'overlay. Échap ferme.

### Sources-overlay

Touche `R` ou clic `[Sources]`. Plein écran, fond `--bg`, backdrop-blur 12px. Liste numérotée des 19 sources copiées telles quelles depuis l'app illustrée. Champ de filtre texte en haut (filtre la liste à la frappe). Échap ferme.

**Référence à une source depuis un modal** : `[12]` est rendu comme un lien cliquable mono-`--accent`. Clic ferme le modal, ouvre la sources-overlay scrollée sur la source 12, avec un `<mark>` flash sur la ligne (highlight `--accent` à 0.2 opacity, fade-out après 1.5s).

### Modal

Copié tel quel depuis l'app illustrée (`#modal-root` + `openModal()`). Trois adaptations :
1. `z-index` supérieur à la timeline, inférieur aux overlays sommaire/sources (parce qu'on peut cliquer une source depuis un modal).
2. Cascade Échap intégrée à la résolution globale (modal > sources > sommaire).
3. Sur mobile : taille 95vw × 90vh au lieu des ~70% desktop.

### Zoom plein écran

Bouton `⛶` en bas à droite du SVG actif (uniquement scène-schema). Click → `#zoom-overlay` existant (copié de l'app illustrée) avec pan + wheel zoom + Reset/Échap. Pendant zoom, les inputs `←/→` désactivés. Bouton à 0.5 d'opacité (0.8 sur mobile pour découvrabilité), 1 au hover.

## 7. Mobile (320-414px)

| Élément | Adaptation |
|---|---|
| Topbar | Pattern `@media (max-width: 560px)` du site : padding 12px 16px, nom serif 14px, back mono 9px. Sous 380px, `<em>Guglielmino</em>` masqué. |
| Titre scène | Clamp 28px, marge réduite, `word-break: break-word`. |
| SVG | `width:100%; height:auto; max-width:100%`. Bouton zoom à 0.8 d'opacité par défaut. |
| Caption | 16px Fraunces italic, padding latéral 16px. |
| Timeline | Segments 24px (vs 36px desktop), pas de hover-tooltip. À l'arrivée sur une scène, titre-flash de 1s en haut. |
| Boutons `[Sources]` `[≡]` | Mono 8px, plus serrés. |
| Modaux | 95vw × 90vh, scrollables verticalement. |
| Overlays sommaire/sources | Plein écran, pas de changement structurel. |
| Inputs | Tap = `advance()`. Swipe horizontal seuil 60px = scène ±1. Swipe vertical désactivé. |
| Toaster d'onboarding | Premier tap sur touch device + premier visit (localStorage `slideshow-onboarded`) : toaster bas centre « *Tape pour avancer · Swipe pour changer de scène · Pince pour zoomer un schéma* ». 4s ou 1er tap. |

`overflow-x: hidden` sur `html, body`. `html, body { max-width: 100vw }`. `body { overflow-y: hidden }` aussi pour empêcher le scroll natif de fighter avec le format plein écran.

## 8. Outro

Scène 11. Structure :

```
        Vous avez parcouru
        Expériences narratives — l'essentiel

        Pour aller plus loin :

        [ Ouvrir l'étude illustrée → ]      ← bouton primaire --accent
        [ Télécharger le rapport ↓ ]        ← bouton secondaire

        ↺ Recommencer    ← Retour aux dossiers
```

Disclosure IA en footer discret : `Format co-écrit avec l'aide d'une IA`.

Pas d'auto-redirect. Le lecteur termine ou clique.

## 9. Accessibilité

1. **Sémantique** : chaque scène = `<section role="group" aria-roledescription="scène" aria-labelledby="scene-N-title">`. `aria-hidden="true"` sur les scènes non-actives.
2. **Caption live** : `<div aria-live="polite">` pour annoncer les changements de caption au lecteur d'écran.
3. **Régions cliquables SVG** : `role="button"` + `tabindex="0"` + `aria-label`, `keydown Enter/Espace` ouvre le modal (pattern déjà présent dans l'app illustrée).
4. **Focus** : à l'ouverture d'un modal, focus sur le `<button>` Fermer ; à la fermeture, focus restauré sur l'élément qui l'a ouvert.
5. **`prefers-reduced-motion: reduce`** : transitions à 0ms, pulse `→` masqué, mises en valeur en cut sec. Comportement obligatoire (pattern site).

## 10. Performance

- Total inline ~2 Mo, gzip ~330 Ko sur le réseau (estimation).
- Premier paint : scène intro (punchline, légère) immédiate. Les 7 SVG sont parsés mais en `display: none`.
- Pas de lazy-load (over-engineering pour 11 scènes). Pas de tracker, pas de tiers (pattern site).

## 11. Hors scope

Listé ici pour ne pas dériver pendant l'implémentation :

- Généralisation dans la skill `illustrated-deep-research` (à reposer après validation du proto)
- Mode auto-play / chronométré
- Export PDF / mode print du slideshow
- Captation analytics / tracker
- Versions traduites
- Variantes thématiques (dark mode dédié, etc.)
- Slideshows pour les autres dossiers (`gouvernance/`, `harness-agentique/`, etc.) — duplication possible mais pas dans ce ticket

## 12. Conventions site honorées

- Bouton `← Retour aux dossiers` pointant `../index.html#series` dans la topbar
- Favicon `/favicon.svg`
- `<mark>` du site (linear-gradient stabilo) — règle CSS sur `.punchline mark` et `.modal-body mark`
- `overflow-x: hidden` sur `html, body`
- Disclosure IA en footer
- Pas de tracker, pas d'analytics
- Polices : Fraunces / Inter / JetBrains Mono via Google Fonts
- Palette : variables CSS site (`--bg`, `--accent`, etc.)
- Mobile-friendly : 7 points du CLAUDE.md respectés

## 13. Ce que le proto doit démontrer

Critères d'acceptation pour le slideshow `narrative-experiences` :

1. Les **7 schémas SVG** existants jouent leur chorégraphie sans bug sur les 7 styles (spectre, stack, grille, manifeste, pipeline, chaîne, matrice).
2. Au moins **une scène** déclenche un `modalAuto` à mi-parcours pour valider le combo "modal automatique + `→` qui ferme et avance".
3. Au moins **deux régions cliquables** déclenchent un modal manuel (validation de la coexistence des deux déclencheurs).
4. La **timeline progresse correctement** scène par scène et étape par étape (sous-segment qui se remplit).
5. Le **clic sur un marqueur de timeline** saute à la bonne scène, en mode "vu" (segments précédents en `--accent` plein).
6. **Sommaire-overlay** et **sources-overlay** s'ouvrent avec `S` et `R`, se ferment avec Échap, et la **référence `[12]` depuis un modal** ouvre les sources sur la bonne ligne avec flash.
7. Le **zoom plein écran** marche sur tous les SVG.
8. Sur **mobile** (test à 375px), le tap et le swipe sont fonctionnels, le toaster apparaît au premier tap, et le bouton zoom est plus visible.
9. **`prefers-reduced-motion`** : le slideshow reste utilisable en cut sec.
10. La carte slideshow apparaît dans `narrative-experiences/index.html` comme **troisième format** entre l'app et le rapport.

## 14. Open questions (à résoudre pendant l'implémentation, pas avant)

- Auto-masquage de la topbar après inactivité : à essayer dans le proto, retirer si gênant.
- Comportement précis du `pulse →` sur mobile : le supprimer si le toaster onboarding suffit.
- Liste exacte des `modalAuto` (quelle étape de quelle scène) : à figer pendant l'écriture du contenu, pas avant.
- Le lien `← Retour aux dossiers` reste-t-il visible quand un modal/overlay est ouvert ? Probablement oui (toujours accessible) — à confirmer en proto.
