# Hero 3D animé — gruyère de Reason pour le dossier evaluation-agentique

**Statut :** spec — à valider par Mathieu avant plan.
**Auteur :** brainstorming Mathieu × Claude, 2026-05-21.
**Périmètre :** bannière vedette animée 3D, partagée par les 3 pages du dossier `evaluation-agentique/` (hub `index.html`, app rapport `20260501-evaluation-agentique-app.html`, canvas zoomable `20260521-evaluation-agentique-canvas.html`).

## 1. Pourquoi

Le dossier `evaluation-agentique` est l'étude 08 du site et possède trois supports (hub, rapport interactif 60-80 min, carte zoomable). Aucun n'a aujourd'hui d'accroche visuelle forte sur son entête : juste eyebrow + H1 + lede sur le hub, header texte sur les rapports. Le dossier mérite une **signature graphique** au-dessus du titre, qui dit en image ce que le rapport démontre en texte : *l'empilement de défenses filtre les attaques, mais des survivants passent*.

Le modèle gruyère de Reason est déjà central dans le contenu (cité dans la lede, illustré en SVG statique dans la hero du canvas, structurant pour les 3 couches du rapport). L'animation 3D le donne à voir littéralement — particules qui traversent ou pas, accumulation visible des brèches au fil du temps.

## 2. Concept visuel

**Cadrage** — caméra décentrée par rapport à l'axe perpendiculaire aux plaques, en très lente rotation orbitale (~40s/tour, presque imperceptible). Les 3 plaques sont vues *en perspective*, pas frontalement, ce qui donne la sensation du cube invisible : les arêtes implicites du volume se devinent par l'écartement des plaques et l'écran d'accumulation en fond.

**Les 3 plaques** — dark slate avec translucidité ~8%, bord net (wireframe via `EdgesGeometry`), perçues comme des feuilles métalliques fines. Trous de tailles variées (4-8 par plaque, rayons entre 0.05 et 0.18 unité), positions différentes — c'est l'empilement qui filtre, pas chaque plaque seule.

**Les particules** — flux continu venant de l'avant (-z), vitesse modérée constante, trajectoires parallèles à l'axe z. ~80 particules visibles simultanément, spawn ~25/s sur desktop, ~10/s sur mobile. Couleur cream (`#faf6ec`) à l'arrivée, virent **orange `--accent` (#b8582e)** au moment où elles franchissent la 3e plaque — l'attaque réussie.

**Le filtre** — pour chaque particule, à chaque crossing d'une plaque (z passe la cote de la plaque entre deux frames), test point-in-circle contre chaque trou de cette plaque. Hit un trou → continue. Sinon → fade-out 0.3s avec petit ring d'impact orange semi-transparent qui se diffuse et meurt.

**L'accumulation** — un plan invisible à z = 5.5 (derrière la 3e plaque à z = 4). Particules qui le touchent : positions gelées, halo orange persistant. Au fil du temps une constellation de "brèches" apparaît, témoignage cumulé des attaques passées. Reset automatique tous les 30s (fade-out doux) ou bouton manuel discret en coin si activé.

**Palette / ambiance** — fond `--bg #faf6ec` (continuité avec la page hôte), plaques `#1a1a1a` à 8% opacity sur les faces et 100% sur les arêtes, particules cream, accent orange `#b8582e` pour les survivants et les halos d'impact/accumulation.

## 3. Architecture technique

**Stack** — Three.js r160+ chargé via CDN ESM (`https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js`) avec import map dans le `<head>` des pages hôtes. Pas de bundler, pas de build step. Cohérent avec la règle "pas de tracker, pas de tiers sauf Google Fonts" — extension explicite à jsDelivr pour Three.js sur ce dossier (à noter dans CLAUDE.md).

**Géométrie**
- Particules : `THREE.Points` avec `BufferGeometry` (attributs : `position`, `color`, `alpha`, `state`). Un seul draw call pour ~80 vivantes + jusqu'à 300 accumulées.
- Plaques : 3× `THREE.Mesh` avec `ShapeGeometry` construite depuis `THREE.Shape` (rectangle) + `THREE.Path` (trous). Overlay wireframe via `THREE.LineSegments(new EdgesGeometry(...))`.
- Matériaux : `MeshBasicMaterial` (pas de lighting, palette flat éditoriale, économie GPU).

**Boucle de simulation** — CPU, sans physique engine. Pour chaque particule à chaque frame :
```
prevZ = particle.z
particle.z += speed * dt
for each plate where prevZ < plate.z <= particle.z:
  if (particle.x, particle.y) inside any hole on that plate:
    continue  // passe
  else:
    particle.state = FADING; particle.fadeStart = t
    spawn impactRing at (particle.x, particle.y, plate.z)
    break
if particle.z >= accumulator.z:
  particle.state = ACCUMULATED
  particle.color = ACCENT
  add to accumulated[]
```
~80 particules × 3 plaques × 60fps = 14k tests/s. Négligeable.

**Génération des trous** — Poisson disc sampling 2D avec seed déterministe (`holeSeed: 'eval-2026'`) : même bannière sur les 3 pages, identité visuelle stable du dossier. ~30% des trous de la plaque 2 sont alignés avec la plaque 1, ~15% de la plaque 3 avec la plaque 2 — empilement asymétrique fidèle à Reason, qui produit ~5-8% de particules atteignant l'accumulateur (taux réaliste, pas une averse ni un désert).

**Fichiers livrés**
- `evaluation-agentique/gruyere-hero.js` — module ESM autonome, export `mountGruyereHero(containerEl, opts)`.
- `evaluation-agentique/gruyere-hero.css` — styles du conteneur, caption, bouton reset optionnel.
- `evaluation-agentique/gruyere-hero-poster.svg` — poster statique de fallback (état figé t≈25s, 3 plaques en perspective + ~50 particules accumulées + une trajectoire ghost).

## 4. API et paramètres

```js
mountGruyereHero(container, {
  particleRate: 25,        // spawn/s desktop, 8 sur mobile (override auto)
  maxAccumulated: 300,     // reset auto au-delà
  resetIntervalMs: 30000,  // reset cyclique de l'accumulation
  plateOpacity: 0.08,      // translucidité des faces de plaque
  showResetButton: false,  // bouton manuel discret en coin
  orbitSpeed: 0.015,       // rad/s, rotation orbitale caméra
  holeSeed: 'eval-2026'    // seed déterministe — clé d'identité visuelle
})
```

**Retour** : `{ destroy(), pause(), resume(), reset() }`. Sur les 3 pages actuelles seul `destroy()` est appelé (cleanup IntersectionObserver / navigation). Le contrat documente l'usage avancé futur.

**Couleur `--accent`** lue dynamiquement via `getComputedStyle(document.documentElement).getPropertyValue('--accent')` au mount — l'animation suit le thème de la page hôte (utile si un futur dossier utilise une autre palette).

**Paramètres figés (non exposés)** — choix éditoriaux non négociables :
- Trous : 4-8 par plaque, rayons 0.05-0.18.
- Plaques : z = [0, 2, 4], dimensions 4×4 unités centrées sur l'axe.
- Spawn : plane z = -3, x,y dans [-2.2, 2.2] (un peu plus large que les plaques, certaines particules ratent même la 1ère).
- Accumulateur : z = 5.5.
- Vitesse particule : 2.5 unités/s constante (parcours total 8.5 unités = 3.4s, cohérent avec spawn 25/s × lifetime → ~85 simultanées en régime nominal).
- Cap dur de particules vivantes simultanées : 100 desktop, 50 mobile (sécurité GPU si spawn déborde).
- Caméra : `PerspectiveCamera(45, aspect, 0.1, 100)` à r ≈ 9 du centre, hauteur y = 1.5, orbite XZ.
- Rotation : axe Y, vitesse `orbitSpeed`, jamais réinitialisée (continue lente même si l'onglet revient au focus).

## 5. Intégration sur les 3 pages

Même pattern partout — l'animation appartient au dossier, pas à un format. Le `holeSeed` identique garantit la même bannière sur les 3 supports.

### Hub `evaluation-agentique/index.html`
Insertion **entre `<header class="topbar">` et `<main class="wrap">`** :
```html
<figure class="gruyere-hero" id="gruyere-hero" role="img"
        aria-label="Diagramme animé du modèle gruyère : 3 couches de défense filtrent les attaques, certaines passent.">
  <noscript><img src="gruyere-hero-poster.svg" alt="3 plaques perforées en perspective, particules accumulées sur l'écran arrière"></noscript>
  <figcaption class="gruyere-hero__caption">
    3 couches de défense · 7 attaques · les survivants s'accumulent
  </figcaption>
</figure>

<script type="module">
  import { mountGruyereHero } from './gruyere-hero.js';
  mountGruyereHero(document.getElementById('gruyere-hero'));
</script>
```
Hauteur `clamp(380px, 55vh, 620px)`, width 100% (déjà hors du `.wrap`, pas besoin de full-bleed override).

### App rapport `20260501-evaluation-agentique-app.html`
Même `<figure>` inséré **dans `<header class="site">` (ligne ~950), avant le `<h1>`**. Le header garde son layout existant (titre + meta + back). L'animation se place au-dessus, le titre et la meta restent visibles juste en dessous.

### Canvas `20260521-evaluation-agentique-canvas.html`
Même `<figure>` inséré **juste après `<header class="topbar">`, avant `<section class="hero">`**. Le SVG `.gruyere-diagram` statique de la hero **est conservé** — c'est le diagramme analytique du canvas, pas une accroche d'ambiance. Deux objets visuels distincts pour deux usages : l'animation 3D est la signature, le SVG est l'outil de lecture.

### Caption
Sous l'animation sur les 3 pages, recentré à 760px (pas full-bleed) : `3 couches de défense · 7 attaques · les survivants s'accumulent`. Typo Fraunces italic 14px, opacity 0.6.

## 6. Accessibilité, fallback, performance

**`prefers-reduced-motion: reduce`** — pas de Three.js du tout. Le module détecte au mount via `matchMedia` et remplace le `<canvas>` cible par le `<img src="gruyere-hero-poster.svg">`. Le poster SVG est livré dans le dossier, généré une fois à la main (état figé t≈25s).

**WebGL indisponible** — même fallback. Détection au mount : `canvas.getContext('webgl2') || canvas.getContext('webgl')`.

**ARIA** — `role="img"` + `aria-label` descriptif sur le `<figure>`. Animation décorative, pas de live region.

**Lifecycle**
- IntersectionObserver pause `requestAnimationFrame` quand le canvas sort du viewport (économie batterie sur le rapport long).
- `ResizeObserver` recalcule camera aspect + renderer size sur resize.
- `destroy()` retourné par `mountGruyereHero` libère renderer, géométries, matériaux, et déconnecte les observers.

**Mobile**
- Détection `matchMedia('(max-width: 768px)')` ou `navigator.hardwareConcurrency < 4` → particleRate forcé à 8/s (au lieu de 25), cap dur 50 particules vivantes (au lieu de 100), devicePixelRatio plafonné à 1.5.
- Hauteur réduite via CSS : `clamp(280px, 45vh, 420px)` sur mobile (vs `clamp(380px, 55vh, 620px)` desktop).

**Budget perf cible**
- Three.js ESM tree-shaken : ~150 KB gzippé, mis en cache jsDelivr (1 chargement pour les 3 pages).
- < 16 ms / frame en régime nominal (à valider en QA sur MBP M1 + iPhone 12 + Pixel mid-range).
- FCP non bloqué : module chargé en `<script type="module" defer>`.

## 7. Critères d'acceptation

1. L'animation tourne en boucle sans accroc sur les 3 pages, ≥ 50 fps soutenu sur desktop moderne et ≥ 30 fps sur mobile mid-range.
2. La bannière est **visuellement identique** sur les 3 pages au pixel près (même seed = mêmes trous = même chorégraphie observée à instant t identique relatif au mount).
3. Le fallback poster SVG s'affiche correctement quand `prefers-reduced-motion: reduce` OU WebGL absent OU `<noscript>`.
4. Sur mobile (Chrome devtools mode mobile + device réel) : pas de scroll horizontal, hauteur réduite, particleRate réduit, fluide.
5. La caption sous l'animation reste recentrée à 760 px (pas full-bleed) sur les 3 pages.
6. `destroy()` libère toutes les ressources GPU (vérifié via DevTools Memory snapshot avant/après).
7. Aucun appel réseau hors jsDelivr (Three.js) et Google Fonts. Pas de tracker.
8. CLAUDE.md mentionne l'exception jsDelivr pour ce dossier.

## 8. Hors périmètre

- **Pas d'export** PNG / vidéo de l'animation (peut être ajouté plus tard si besoin marketing).
- **Pas de personnalisation runtime** (slider de densité, sélecteur de plaque, etc.). Le registre est contemplatif, pas démo.
- **Pas de propagation à d'autres dossiers** dans cette spec. Si un futur dossier réutilise le module, on extraira vers `/assets/gruyere-hero.{js,css}` à ce moment-là (YAGNI maintenant : un seul site d'usage).
- **Pas de variation par page**. Même `holeSeed`, même comportement partout — c'est la signature du dossier.
