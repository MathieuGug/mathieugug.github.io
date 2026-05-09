# Spec — Slideshow narratif : zoom auto sur la zone mise en valeur

**Date :** 2026-05-08
**Statut :** ✅ Implémenté sur `measure-roi/20260507-roi-ia-generative-agentique-slideshow.html` (PR #26, mergée). En cours de propagation à `ia-et-travail/20260507-ia-et-travail-slideshow.html`.
**À embarquer :** dans le template `.claude/skills/illustrated-deep-research/assets/slideshow-template.html` + à documenter dans `references/slideshow.md` lors de la mise à jour de la skill.

---

## Problème

Les schémas du slideshow sont conçus pour le format long du rapport : un `viewBox` qui couvre 5 cartes, une matrice 5×5, un arbre de décision à 7 nœuds, etc. En slideshow, chaque step focalise narrativement sur **une seule** sous-partie (ex. la carte « Coût » dans la grille à 5 axes), et le reste est dimmé à `opacity: 0.18`.

**Symptôme :** la sous-partie focalisée reste à sa taille d'origine — un cinquième du SVG, perdue dans les 4/5e de carrés grisés. Le lecteur doit faire l'effort de localiser et de lire la zone active alors qu'elle pourrait remplir l'écran.

**Demande utilisateur (textuelle) :** « quand select une partie d'une schéma de zoomer sur la partie mise en valeur pour qu'on voit que ça et en plus gros. »

## Solution

Animer le `viewBox` du SVG vers la **bounding box** de l'union des éléments sélectionnés par `step.highlight`, avec un padding et l'aspect-ratio d'origine préservé.

### Heuristique de déclenchement

Le zoom n'est activé **que sur les steps de focalisation** :

```
focusing = (step.dim?.length > 0 || step.hidden?.length > 0)
        && step.highlight?.length > 0
```

C'est-à-dire : zoom uniquement quand un step **dim ou cache** d'autres éléments. Cela respecte la chorégraphie canonique d'une scène schema :

| Step | `highlight` | `dim` | `hidden` | Zoom ? |
|---|---|---|---|---|
| 0 (panorama d'ouverture) | tout | `[]` | `[]` | ❌ vue d'origine |
| 1..N-1 (focus séquentiel) | une cible | tous les autres | `[]` | ✅ zoom |
| Dernier (synthèse) | tout | `[]` | `[]` | ❌ vue d'origine |

Pas de propriété ad-hoc à ajouter dans le `SCENES`. L'auteur du contenu pilote l'effet via `dim`, comme avant.

### Calcul du viewBox cible

```
1. bbox = ∪ getBBox(el) pour el ∈ querySelectorAll(step.highlight[*])
   en coordonnées user-space du <svg> root (via inverse(rootCTM) · localCTM)
2. padX = max(16, bbox.width  · 6%)
   padY = max(16, bbox.height · 6%)
3. padded = bbox étendu de (padX, padY) sur les 4 côtés
4. fitted = padded étendu pour matcher l'aspect-ratio du viewBox d'origine,
            centré sur la bbox originale
5. target = [fitted.x, fitted.y, fitted.width, fitted.height]
```

**Pourquoi préserver l'aspect-ratio.** L'élément SVG sur la page a `width: 100%; height: auto`, donc sa hauteur rendue dérive de l'aspect du `viewBox`. Si on change l'aspect entre deux steps, la hauteur rendue change → layout shift entre les steps → les autres éléments de la stage (caption, etc.) bougent. En préservant l'aspect, la taille rendue reste constante, seul le contenu est recadré.

**Pourquoi le padding est en *max* d'une valeur absolue et d'un ratio.** Pour les petites cibles (ex. un mot ou une icône isolée), 6 % de leur largeur est trop maigre — le padding minimum de 16 unités SVG garantit toujours un peu d'air. Pour les grosses cibles (un quart de schéma), 6 % devient significatif et évite que le zoom soit serré.

### Animation

`requestAnimationFrame`, durée 520 ms, courbe `easeOutCubic` (`1 - (1-t)³`). Le rAF en cours est annulé à chaque nouveau step pour éviter les courses entre transitions.

`prefers-reduced-motion: reduce` → snap instantané, pas d'animation.

L'interpolation linéaire entre deux `viewBox` de même aspect-ratio préserve l'aspect-ratio à chaque frame intermédiaire (preuve : `lerp(a₁, b₁) / lerp(a₂, b₂) = aspect` quand `a₁/a₂ = b₁/b₂`). Donc la taille rendue reste constante pendant l'animation, pas seulement aux endpoints.

### Coordonnées user-space

`getBBox()` retourne la bbox dans le système de coordonnées **local** de l'élément (avant ses propres transforms et ceux de ses ancêtres). On veut la bbox dans l'espace du `viewBox` du root `<svg>` (= user-space du root) pour pouvoir setter `viewBox="x y w h"` directement.

Approche : transformer les 4 coins de la bbox locale via la matrice `inverse(rootCTM) · localCTM` :

- `localCTM = el.getCTM()` → matrice de transformation de l'espace local de l'élément vers le viewport SVG
- `rootCTM = svg.getCTM()` → matrice du viewport SVG vers… son propre viewport (≠ identité car influencée par viewBox/preserveAspectRatio)
- `inverse(rootCTM) · localCTM` → matrice de l'espace local de l'élément vers l'user-space du root SVG (= viewBox coordinates)

Pour les schémas typiques (pas de transform sur le root, peu de transforms imbriqués), `localCTM` est souvent suffisant. Mais on garde l'inverse-multiply pour la robustesse : ça gère les `<g transform="translate(…) rotate(…)">` correctement.

### Stockage du viewBox d'origine

Au premier `applyZoom` sur un SVG, on copie son `viewBox` actuel sur l'attribut `data-original-viewbox`. Les zooms suivants s'animent depuis le `viewBox` courant vers soit le calculé (focus), soit `data-original-viewbox` (panorama).

### Comportement de l'overlay zoom plein-écran (⛶)

Le bouton `.zoom-btn` ouvre `#zoom-overlay`, qui clone le SVG. **Le clone restaure systématiquement le `viewBox` d'origine** (`clone.setAttribute('viewBox', clone.getAttribute('data-original-viewbox'))`) avant d'être inséré dans l'overlay.

Justification : l'overlay sert à explorer le **schéma complet** avec wheel/pinch zoom et drag-pan. L'utilisateur attend une vue d'ensemble qu'il pourra ensuite zoomer manuellement, pas un recadrage déjà imposé par le step actuel.

## Implémentation de référence

PR #26 sur `mathieugug.github.io`. Code dans `measure-roi/20260507-roi-ia-generative-agentique-slideshow.html`, IIFE `__schemaZoom` injectée juste après `applyStepStyles()`, et patch de 2 lignes dans `setupZoom().openZoom()` pour le reset du viewBox cloné.

**Forme du contrat :**

```js
const __schemaZoom = (() => {
  // … helpers : userSpaceBBox, unionBBox, ensureOriginal, fitToAspect, animate
  function applyZoom(svg, step) { /* … */ }
  return { applyZoom };
})();

function applyStepStyles(scene, step) {
  // … existing data-step-state assignment
  __schemaZoom.applyZoom(svg, step);   // ← une ligne en plus à la fin
}

function openZoom(svgEl, captionText) {
  const clone = svgEl.cloneNode(true);
  const orig = clone.getAttribute('data-original-viewbox');
  if (orig) clone.setAttribute('viewBox', orig);   // ← deux lignes en plus
  // … existing logic
}
```

Aucun changement CSS nécessaire. Aucun changement aux SVG sources. Aucune modification du contrat `SCENES`.

## Ce qu'il faut savoir avant de propager

1. **Pas de propagation aveugle.** Avant de copier le bloc dans un autre slideshow, vérifier que le SVG ciblé n'a pas `overflow="visible"` — sinon le contenu hors `viewBox` continuera à s'afficher et le zoom n'aura pas l'effet visuel attendu (tout reste visible). Les SVG existants du site n'ont pas `overflow="visible"`, mais c'est une garantie à valider.

2. **Cas pathologiques de `getBBox()` :**
   - Élément `display: none` → bbox vide. On ignore (`if (bb.width === 0 && bb.height === 0) return null`).
   - `<text>` à l'extérieur du `<g class="interactive">` mais sémantiquement lié → potentiellement ignoré du calcul. Si le sélecteur `[data-card="X"]` cible juste le `<g>` qui ne contient pas son label, le label peut sortir du cadre zoomé. À surveiller en relecture visuelle. Solution : enrichir le `<g>` pour inclure son label, ou ajuster le padding minimum.

3. **Steps sans `dim` mais avec un sous-ensemble de `highlight`.** Cas peu courant mais possible : un step qui highlight 2 cartes sur 5 sans rien dimmer. L'heuristique actuelle ne zoome **pas** dans ce cas (puisque `dim` est vide). Si on veut couvrir ce cas, il suffirait d'élargir l'heuristique : `focusing = step.highlight.length > 0 && (step.dim.length || step.hidden.length || estimatedHighlightCoverage < 0.7)`. Pour l'instant on s'en tient à `dim/hidden` qui est explicite et lisible.

4. **Les schémas matrice (ex. `svg-03-grille-5-axes` square 900×900).** Le zoom marche, mais la cible étant un `<rect>` ou `<circle>` parmi N², le bbox d'une seule cellule est petit → zoom serré. Le padding minimum de 16 atténue, mais sur très petites cibles le facteur de zoom peut atteindre 5–8x. Sur écran HD c'est OK ; sur un 4K c'est encore lisible. À vérifier visuellement par schéma lors de la relecture.

5. **Modaux auto (`modalAuto`)** : compatible. La sidebar modal s'ouvre par-dessus le SVG zoomé sans interférence.

## Plan de propagation

1. ✅ `measure-roi/20260507-roi-ia-generative-agentique-slideshow.html` (PR #26)
2. 🚧 `ia-et-travail/20260507-ia-et-travail-slideshow.html` (PR en cours, le présent doc en pièce jointe)
3. ⬜ `narrative-experiences/20260505-narrative-experiences-slideshow.html`
4. ⬜ `observabilite-agents-ia/20260505-observabilite-agents-ia-slideshow.html`
5. ⬜ Template `.claude/skills/illustrated-deep-research/assets/slideshow-template.html`
6. ⬜ Doc skill : ajouter une §11 dans `references/slideshow.md` qui réfère à cette spec, et mentionner le pattern dans la quick-start (§A) — toute nouvelle SVG du slideshow embarque le zoom sans intervention de l'auteur, donc la mention skill est juste « le zoom auto est branché au moteur, pas besoin de l'invoquer dans `SCENES` ».

## Mise à jour CLAUDE.md

À ajouter dans la section « Schémas SVG » du `CLAUDE.md` racine, à côté du paragraphe sur le « Zoom obligatoire » :

> **Zoom auto sur la zone focalisée (slideshow uniquement)** : dans les apps de format slideshow, chaque step de focalisation (qui dim ou hide d'autres éléments) recadre automatiquement le `viewBox` sur l'union des bboxes des `step.highlight`, avec aspect-ratio préservé. Pattern de référence : `measure-roi/20260507-roi-ia-generative-agentique-slideshow.html` (rechercher `__schemaZoom`). Spec complète : `docs/superpowers/specs/2026-05-08-slideshow-schema-zoom.md`. Embarqué dans le template de la skill `illustrated-deep-research` — toute nouvelle slideshow le récupère par défaut.
