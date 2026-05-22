---
name: svg-schemas
description: Use when creating, editing, or auditing SVG schémas inline pour les artefacts de mathieugug.github.io — couvre la géométrie des flèches, le wrapping de texte, le full-bleed sur pages narratives, la largeur adaptative dans les apps deep-research, les branches interactives avec modal, le tracker Musk, et l'échelle typographique. Symptômes déclencheurs : flèche qui pénètre dans une boîte, texte SVG qui dépasse à droite, schéma qui recouvre la sidebar TOC ou Sources, branche cliquable inerte, `<rect>` dont le texte interne déborde, schéma à harmoniser sur la nouvelle échelle typo.
---

# SVG Schemas — conventions du site

Skill projet pour `mathieugug.github.io`. Tous les artefacts du site (apps deep-research, journal, scrolly, livre, gouvernance, slideshows) embarquent des **SVG inline** rédigés à la main. Cette skill rassemble les règles géométriques, les patterns de layout, les contrats d'interactivité et l'échelle typo — toutes apprises au prix de bugs visibles concrets.

## Quand l'invoquer

- Créer un nouveau schéma SVG pour un dossier (deep-research, journal, scrolly, livre, gouvernance)
- Éditer un schéma existant (ajouter une section dans une `<rect>`, changer le texte, déplacer une flèche)
- Auditer la lisibilité d'un schéma sur grand écran (1440+) ou mobile
- Câbler une branche interactive (`<g class="branch">` dans un journal)
- Maintenir ou faire évoluer le tracker probabilité du procès Musk
- Harmoniser la typographie d'un dossier sur l'échelle de référence (cf. *Convention typo*)

## Quand NE PAS l'invoquer

- Création/édition du HTML/CSS hors `<svg>` → CLAUDE.md (sections *Stack et conventions*, *Mobile-friendliness*, *Topbar*)
- Génération d'un dossier deep-research complet → skill `illustrated-deep-research`
- Carte OpenGraph `og.png` → `tools/og-card.py` + `tools/seo_dossiers.py`

## 1. Géométrie des flèches

### Flèches → cibles : laisser un blanc visible

Laisser **un blanc visible** entre la pointe de la flèche et le bord de la boîte cible (≈ 12–18 px en unités SVG). Ne jamais terminer une flèche pile sur le bord d'un rectangle — avec `marker-end`, l'œil lit ça comme une pénétration dans la boîte.

### Origine des flèches issues d'une forme (cercle, ellipse, hub)

Démarrer la ligne **sur le périmètre de la forme**, dans la direction de la cible, pas depuis le centre ni depuis le haut/bas par défaut. Sinon la flèche traverse la forme et se chevauche avec son texte.

Pour un cercle `(cx, cy, r)` visant `(tx, ty)` :
```
(dx, dy) = (tx - cx, ty - cy)
L        = √(dx² + dy²)
start    = (cx + r·dx/L, cy + r·dy/L)
```
Ajouter ~4 px de respiration au-delà du périmètre si la forme a un halo ou un stroke épais.

**Cas de référence corrigé** : flèches du schéma « Partly » de `proces-musk-altman/journal.html` — départs `(492, 387)`, `(600, 452)`, `(708, 387)` autour d'un cercle `(600, 330, r=118)`.

### Alignement

Centrer la flèche sur le **milieu horizontal** de la boîte cible, pas sur une position arbitraire à l'intérieur. Pour une boîte `x=80, width=320`, viser `x=240`.

## 2. Texte interne aux SVG

### Boîtes `<rect>` qui enveloppent du texte — la hauteur doit contenir TOUT le texte

Quand on ajoute une section supplémentaire en bas d'une boîte (ex. « CONSÉQUENCE » sous les prongs (i) et (ii)), il faut **rallonger la `height` du rect parent ET pousser tous les éléments en-dessous** (titres, sous-boîtes, sources, viewBox du SVG global). Sinon le texte interne déborde sous le rect, se chevauche avec la section suivante, et donne un schéma cassé visuellement.

**Méthode** : calculer `y_dernier_texte + ~20 px` de padding bas pour la nouvelle `height`, puis appliquer le delta de shift à toute la suite.

**Cas corrigé** : boîtes Lecture M / Lecture S du schéma du 14 mai dans `proces-musk-altman/journal.html` — height passée de 318 à 358, shift +40 appliqué à L'INVERSION header, dashed box TROIS PIÈCES MIROIR, sources line, et viewBox 860 → 900.

### Texte SVG long sur une ligne — pas d'auto-wrap, splitter à la main

L'élément `<text>` SVG ne fait pas de retour à la ligne automatique : une chaîne plus large que sa boîte parente dépasse silencieusement à droite, masquée ou non par `overflow: hidden` selon les cas.

**Règle de pouce** : pour une `<rect>` de largeur W, la zone texte utilisable est `W - 2 * padding` (typiquement W − 40). Estimation des largeurs caractères :

| Police | Taille | Largeur ≈ |
|---|---|---|
| Inter regular | 11pt | 5.5 px/char |
| Inter regular | 13pt | 6.5 px/char |
| Fraunces italic | 14pt | 7 px/char |

Au-delà, splitter en plusieurs `<text>` empilés (gap typique 18–20 px en y pour Inter 13pt) — et **rallonger la rect parente + pousser les éléments en-dessous** (cf. règle ci-dessus).

**Cas corrigé le 14 mai** : `« Primarily, I was thinking about Reid Hoffman. He was the OpenAI donor I knew. »` (~80 chars Fraunces 14pt italic) splitté en 2 lignes dans la box Lecture S (520 px de large) ; le dashed box TROIS PIÈCES MIROIR a fait pareil sur ses 2 lignes initiales (~175 et ~218 chars chacune) en passant à 4 lignes plus courtes, height 96 → 138.

## 3. Intégration page — zoom obligatoire

Tout schéma SVG inline **doit** être agrandissable en plein écran (overlay + pan + zoom molette/pinch + Reset/Échap, bouton `⛶` au survol).

- **Apps deep-research** : fourni par la bibliothèque partagée `/assets/dossier-app.{js,css}` — pas d'IIFE locale, juste le contrat DOM `#zoom-overlay`/`#zoom-stage`/`#zoom-content` + boutons `.zoom-close`/`.zoom-in`/`.zoom-out`/`.zoom-reset`.
- **Autres pages** (journal, scrolly, livre) : copier le bloc de `observabilite-agents-ia/20260430-observabilite-agents-ia-app.html` (CSS `.zoom-btn` + `#zoom-overlay`, IIFE `setupZoom()`) et adapter les variables de couleur + le sélecteur (`.figure`, `.entry figure`, …) à la structure hôte.

Sur mobile, le schéma rendu à 320 px de large devient illisible — le zoom est l'échappatoire **non négociable**.

### Anchor `¶` au début de la figcaption (deep-link)

Toute `<figure>` qui contient un schéma SVG ou une infographie **doit** porter un `id="fig-XX"` **et** ouvrir sa `<figcaption>` par un petit lien d'ancre `¶` cliquable, identique au pattern infographie. Permet de copier un lien direct vers un schéma précis (utile pour le partage, les renvois croisés entre dossiers, et la cite interne dans un futur sommaire des schémas).

```html
<figure class="figure" id="fig-03">
  <svg …>…</svg>
  <figcaption class="figure-caption"><a class="anchor" href="#fig-03" title="Lien direct vers ce schéma">¶</a>Schéma 3 — …</figcaption>
</figure>
```

- **Style** : déjà défini dans `/assets/dossier-app.css` (`.figure-caption .anchor`) — accent `--accent`, opacity 0.55, plein 1 au hover. Pas de CSS local à ajouter sur les apps deep-research.
- **Scroll-margin** : `dossier-app.css` règle `scroll-margin-top: 80px` sur tout `main figure[id]` pour décaler sous la topbar fixe quand on jump à l'ancre.
- **Convention `id`** : `fig-NN` zero-padded à 2 chiffres (`fig-01`, …, `fig-10`), suffixe `bis` autorisé (`fig-06bis`). Garder cohérent avec le numéro affiché dans le titre de la figcaption.
- **Title attribute** : `"Lien direct vers ce schéma"` (ou `"… cette infographie"` pour les A4 portrait) — sert d'affordance au survol.
- **Pages non-apps** (journal, scrolly, livre) : même pattern HTML, mais le style `.figure-caption .anchor` est uniquement embarqué par `dossier-app.css`. Sur ces pages, ajouter le bloc CSS localement (copier-coller de `assets/dossier-app.css` lignes 24-38).

## 4. Layout — full-bleed sur les pages narratives

Sur les pages narratives (journal, livre, scrolly) qui ont un wrap étroit (typiquement `.wrap { max-width: 760px }`), les schémas SVG **cassent** le wrap pour occuper toute la viewport — texte à 760 px, schémas pleine largeur. Le `<figcaption>` reste re-centré à 760 px sinon sa typographie devient illisible sur grand écran.

**Petit padding latéral obligatoire** (`padding: 0 clamp(16px, 3vw, 48px)`) pour que le schéma ne touche pas les bords physiques de l'écran — 16 px sur mobile, scale jusqu'à 48 px sur large screen.

```css
.entry figure {
  margin: 26px calc(50% - 50vw);
  padding: 0 clamp(16px, 3vw, 48px);
  position: relative;
}
.entry figure svg {
  width: 100%;
  border-radius: 0;
}
.entry figure figcaption {
  max-width: 760px;
  margin: 10px auto 0;
  padding: 0 5vw;
}
```

**Préalable** : `html, body { overflow-x: hidden }` (ou `overflow-x: clip` pour les pages scrolly avec sticky — cf. CLAUDE.md *Mobile-friendliness* point 1) pour que les marges négatives ne déclenchent pas de scroll horizontal.

**Cas de référence** : `proces-musk-altman/journal.html`.

## 5. Layout — apps deep-research, sidebars sur les bords de la viewport

Sur les apps deep-research desktop (`header.site` + `main#report` + sidebars), la grille `.layout` (`240px minmax(0, 1fr) 320px`) **n'est pas capée**, elle remplit toute la viewport — TOC ancré au bord gauche, Sources au bord droit, main-cell au milieu avec `main#report` centré (max-width 760 px). Sur écrans 1440+, ça évite les bandes vides à gauche/droite et place le bouton de repli des Sources pile sur le bord gauche du panneau.

**Cas corrigé le 2026-05-04** : avant, `.layout { max-width: 1440px; margin: 0 auto }` centrait la grille → bandes vides + collapse button mal positionné sur grandes résolutions.

### Largeur des schémas adaptative selon l'état des sidebars

Sous `@media (min-width: 1025px)`, la `.figure` casse `main#report` (max-width 760 px) pour prendre **toute la place horizontale visible**, en s'arrêtant pile aux sidebars actuelles.

**Deux états :**

- **Sources ouvertes (par défaut)** : figure couvre le main-cell entier `[TOC-right, Sources-left]`.
  - 1320 px : figure = 760 (= main)
  - 1440 px : 880
  - 1920 px : 1360
- **Sources repliées (`.layout.sources-collapsed`)** : figure s'étend `[TOC-right, viewport-right]`.
  - 1920 px : 1680

**Formules CSS :**

```css
.figure {
  margin-inline: calc(-1 * max(0px, (100vw - 1320px) / 2 + 48px));
  width: auto;
}
.layout.sources-collapsed .figure {
  margin-inline: calc(-1 * max(0px, (100vw - 904px) / 2));
}
```

Le `width: auto` + marges négatives symétriques absorbent à la fois le centrage de `main#report` dans le main-cell **et** son padding interne 48 px. Transition smoothe 280 ms alignée avec la transition `grid-template-columns` du layout.

**Aucun chevauchement des sidebars visibles** (contrainte stricte : avec `width: 100vw`, le background `--paper` de la figure peint au-dessus des items du TOC et les masque visuellement). Dérivation mathématique complète : `illustrated-deep-research/references/companion-app.md` § 5.

Mobile (< 1025 px) : la grille s'effondre en colonne unique, la figure remplit naturellement, pas d'override.

### Prérequis load-bearing — `main#report` doit être container-capped à 760 px

Pattern exact :
```css
main#report {
  padding: 56px 48px 96px;
  min-width: 0;
  max-width: 760px;
  margin: 0 auto;
  width: 100%;
}
```

Les deux constantes magiques de la formule (1320 et 904) sont dérivées en supposant `main#report` cappé à 760 et centré dans le main-cell. Si à la place `main#report` remplit toute la grid-cell (ancien pattern où chaque enfant `> .lead, > h1, > p…` était cappé individuellement à 760), la figure part de `240 + 48 = 288` au lieu de `(100vw - 520) / 2 + 48` et la formule de breakout calcule une marge négative beaucoup trop large → la figure recouvre le TOC à gauche et la sidebar Sources à droite.

**Cas corrigé le 2026-05-16** sur `llm-jailbreaking/20260428-…-app.html` : figure dépassait à `x=100` avec TOC right à `x=240`, soit 140 px de chevauchement.

**Pour toute nouvelle app ou audit d'une app existante** : vérifier la règle `main#report` AVANT de faire confiance à la formule de breakout. Si l'app héberge un ancien pattern child-capped, **migrer vers container-capped** en supprimant la règle multi-sélecteur sur les enfants — elle devient redondante (main fait 760 wide, les enfants n'ont plus rien à capper) et tous les éléments narratifs sont déjà alignés correctement.

## 6. Branches interactives — contrat `data-modal-id` (journal Musk)

Toute `<g class="branch" ...>` rendue dans `proces-musk-altman/journal.html` doit porter un attribut `data-modal-id="<id>"` **ET** avoir une entrée correspondante dans l'objet `modals` du `setupBranchModal` IIFE (cherchable via `grep "data-modal-id\|var modals = {" journal.html`).

Sans `data-modal-id`, le sélecteur `.branch[data-modal-id]` ne matche pas et le clic ne fait rien — **bug silencieux** (la branche reste focusable et hover-stylable mais inerte).

**Format de l'entrée modale :**
```js
{ eyebrow, title, body: [paragraphes avec <em>/<strong>/<tspan> autorisés] }
```

**Convention de nommage des IDs** : `<famille>-<n>` — ex. `lecture-molo`, `lecture-scott`, `strate-1-formation`, `voice-3-necessite`, `test-1`, `onde-2`.

Le câblage des branches du journal Musk est complet à date 14 mai : `lecture-molo/scott`, `strate-1/2`, `voice-1/2/3`, `test-1/2/3`, `lecture-1/2/3`, `onde-1/2/3`, `lock-1/2/3`. Toute nouvelle branche doit suivre le contrat.

## 7. Tracker probabilité Musk (journal Musk uniquement)

Chaque entrée du journal embarque, en fin d'article (juste avant `</article>`), un `<div class="tracker">` qui rend un **diagramme à barres stackées verticalement** (Musk en accent en bas, Altman en ink-mid en haut, chaque barre = 100 %) montrant l'évolution quotidienne de la probabilité estimée que Musk gagne en équité, depuis l'ouverture du procès (1 mai 2026) **jusqu'au jour de l'entrée incluse**.

**Visuel :** viewBox 1080×320, plot zone [60, 1020]×[92, 272], 14 jours étiquetés sur axe X, bars de 40 px de large, dernière barre encadrée d'un stroke accent + label day en accent bold, badge top-right `MUSK X% · ALTMAN Y%` (avec MUSK en accent et ALTMAN en ink-mid pour servir de légende).

**Pourquoi des barres et pas une line chart** : les barres conservent leur impact visuel quand le SVG est réduit, contrairement à une line chart dont les dots et la ligne deviennent illisibles sub-400 px de viewport.

**Workflow de mise à jour** : le script `tools/insert_tracker.py` est idempotent (détecte la présence de `class="tracker"` et la remplace). À chaque **nouvelle entrée publiée** :

1. Mettre à jour le tuple `DATA` en tête du script avec la nouvelle date + la proba estimée.
2. `python tools/insert_tracker.py` — il ré-écrit l'historique sur **chaque** entrée existante (pour que l'entrée du jour J' affiche les barres jusqu'au jour J').

La proba est une **estimation éditoriale** ; elle doit suivre les pivots de la narration quotidienne, pas une formule.

**Pattern de référence** : `proces-musk-altman/journal.html` (13 entrées, 1 → 14 mai 2026, avec saut du dimanche 10 mai matérialisé par une colonne vide).

## 8. Convention typo des schémas (TODO design system unifié)

À date (2026-05), les schémas du dossier `coding-agents/` ont été calibrés sur les tailles ci-dessous, **+2pt par rapport à la table de `illustrated-deep-research/references/svg-editorial-style.md`**. À harmoniser sur les autres dossiers progressivement.

| Rôle | Classe | Taille | Style |
|---|---|---|---|
| Title | `.display` | 28pt | 600 weight, letter-spacing -0.01em |
| Subtitle | `.display` | 18pt | 400 italic |
| Body label | `.body` | 15pt | 500 weight |
| Annotation | `.body` | 13pt | regular |
| Caption / source | `.body` | 12pt | italic |
| Numeric callout | `.mono` | 15pt | 500 weight |
| Marker (numéro / lettre) | `.mono` | 12pt | 600 weight |
| Schema marker (SCHÉMA NN) | `.mono` | 12pt | 600 weight, letter-spacing 0.16em, CARMINE |

**TODO design system unifié :**

1. Auditer les ~70 schémas SVG existants pour repérer ceux qui ont des polices < 11pt et les remettre aux tailles minimales :
   ```bash
   grep -lE 'font-size="[6-9]"|font-size="10"' */images/*.svg
   ```
2. Mettre à jour `illustrated-deep-research/references/svg-editorial-style.md` pour qu'il pointe sur cette nouvelle convention.
3. Optionnel : ajouter un test CI qui vérifie que les SVG ne contiennent pas de `font-size="<11"`.

À cadrer une fois ce dossier publié.

## Quick checklist avant de pusher un schéma

- [ ] Flèches : blanc de 12–18 px avant la cible, origine sur le périmètre des cercles/hubs, centrées horizontalement sur la boîte cible
- [ ] `<rect>` : height englobe tout le texte interne (recompter `y_dernier_texte + ~20 px`)
- [ ] `<text>` long : splitté à la main si > `W - 40` (cf. table px/char)
- [ ] Bouton zoom `⛶` présent et fonctionnel
- [ ] `<figure id="fig-NN">` + anchor `<a class="anchor" href="#fig-NN">¶</a>` au début de la figcaption (deep-link)
- [ ] Page narrative : full-bleed avec `margin: … calc(50% - 50vw); padding: 0 clamp(16px, 3vw, 48px)` ; `<figcaption>` re-centré à 760 px
- [ ] App deep-research : `main#report` container-capped à 760 px ; formule `.figure` margin-inline adaptative aux deux états sidebar (vérifier à 1320 / 1440 / 1920 px que ni TOC ni Sources ne sont recouverts)
- [ ] Branche interactive (journal Musk) : `data-modal-id` présent + entrée correspondante dans `modals`
- [ ] Tracker Musk (si nouvelle entrée journal) : `DATA` mis à jour + `python tools/insert_tracker.py` re-runné
- [ ] Typographie : tailles ≥ 11pt sur l'échelle de référence

## Références croisées

- Skill `illustrated-deep-research` (`.claude/skills/illustrated-deep-research/`) — workflow de génération d'un dossier deep-research complet ; `references/svg-editorial-style.md` (échelle typo de référence à harmoniser) et `references/companion-app.md` § 5 (dérivation mathématique de la formule de breakout).
- `CLAUDE.md` racine — sections *Stack et conventions* (palette de variables, fonts), *Mobile-friendliness* (zoom comme échappatoire mobile, `overflow-x` sur scrolly), *Apps interactives* (sidebars, panel-close).
- Bibliothèque partagée `/assets/dossier-app.{js,css}` — implémentation du zoom, modal, citations highlight, sources collapse. Contrat DOM dans CLAUDE.md *Bibliothèque partagée*.
