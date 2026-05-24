# Gruyere hero — intro scrollytelling

**Date** : 2026-05-21
**Branche** : `claude/gruyere-hero-3d-2026-05-21` (worktree existant à `mathieugug.github.io-gruyere/`)
**Spec connexe** : `2026-05-21-gruyere-hero-3d-animation-design.md` (l'animation Three.js elle-même, déjà implémentée)
**Périmètre** : hub du dossier `evaluation-agentique` uniquement.

## Contexte

L'animation 3D `gruyere-hero.js` est déjà en place comme bannière compacte (380-620 px) au-dessus du titre dans le hub, l'app et la carte zoomable du dossier `evaluation-agentique`. Elle montre simultanément les 3 plaques perforées, les particules qui les traversent, et l'accumulateur arrière.

L'objectif de cette évolution : **transformer la bannière du hub en intro animée scrollytelling**, pour faire émerger la métaphore du gruyère (modèle de Reason) pas à pas, plutôt que de la livrer en un coup d'œil. L'app et la carte zoomable gardent leur bannière compacte actuelle inchangée.

## Récit visé

Cinq beats narratifs séquencés au scroll, chacun occupant ~100vh dans une section sticky :

1. **« Les attaques se multiplient. »** — Pluie de particules dans le vide. Aucune plaque. Tout atteint l'écran arrière.
2. **« On met en place des sécurités. »** — Plaque 1 (préventif) fade-in. La plupart des particules sont bloquées, certaines passent.
3. **« Avec la maturité, on ajoute des couches. »** — Plaque 2 (curatif) fade-in. Moins passent.
4. **« Et encore une. »** — Plaque 3 (qualitatif) fade-in. ~1 % atteignent l'accumulateur.
5. **« Aucune n'est parfaite. Combinées, elles filtrent. »** — Synthèse. Vue d'ensemble du dispositif final. Transition vers le hub.

Drafts de contenu en annexe — à raffiner à l'écriture du HTML.

## Décisions de cadrage (validées)

- **Pattern** : sticky canvas plein écran + texte de chaque beat en carte basse-gauche (style NYT/Pudding). Le canvas reste pinné, les beats défilent par-dessus.
- **Découpage** : 5 beats. Pas de beat intermédiaire « zoom sur l'alignement des trous ».
- **Sortie sticky** : bannière hero compacte (380-620 px) résiduelle au-dessus du titre du hub. Continuité visuelle — même animation, même seed, même géométrie.
- **Mobile (≤ 768 px) et `prefers-reduced-motion`** : on skip l'intro scrollytelling entièrement. Le hub démarre directement par sa bannière (poster ou animation selon les capacités).
- **Caméra** : auto-rotate continu, identique à l'existant. Pas de choré per-beat (pas de presets, pas de zoom progressif).
- **Approche d'implémentation** : IntersectionObserver par beat (« approche A »), avec fade-in/out des plaques (~600 ms) côté `gruyere-hero.js` pour la fluidité visuelle.

## Architecture

### 1. DOM du hub (`evaluation-agentique/index.html`)

```html
<header class="topbar" id="topbar">…</header>

<section class="hero-intro" id="hero-intro" aria-label="Introduction animée du dossier">
  <div class="hero-intro__sticky">
    <figure class="gruyere-hero" id="gruyere-hero-intro" role="img"
            aria-label="3 plaques perforées filtrent des attaques.">
      <noscript><img src="gruyere-hero-poster.svg" alt="…"></noscript>
    </figure>
    <div class="hero-intro__caption" id="hero-caption" aria-live="polite">
      <h2 class="hero-intro__title"><!-- updated by JS --></h2>
      <p class="hero-intro__lede"><!-- updated by JS --></p>
    </div>
  </div>

  <!-- 5 sentinelles invisibles, une par beat -->
  <div class="hero-intro__trigger" data-beat="1"></div>
  <div class="hero-intro__trigger" data-beat="2"></div>
  <div class="hero-intro__trigger" data-beat="3"></div>
  <div class="hero-intro__trigger" data-beat="4"></div>
  <div class="hero-intro__trigger" data-beat="5"></div>
</section>

<figure class="gruyere-hero gruyere-hero--banner" id="gruyere-hero-banner"
        role="img" aria-label="3 plaques perforées en perspective, particules accumulées sur l'écran arrière">
  <noscript><img src="gruyere-hero-poster.svg" alt="…"></noscript>
  <figcaption class="gruyere-hero__caption">
    3 couches de défense · 7 attaques · ~1 % des survivants s'accumulent
  </figcaption>
</figure>

<main class="wrap">
  <!-- inchangé : eyebrow, h1, lede, meta, formats, colophon -->
</main>
```

La `figcaption` (« 3 couches · 7 attaques · ~1 % ») est conservée dans le DOM pour l'accessibilité (lecteurs d'écran qui ne suivent pas le scroll), mais masquée visuellement sur la bannière du hub (`.gruyere-hero--banner .gruyere-hero__caption { display: none }`) car elle redonde avec le beat 5 qu'on vient de scroller. Sur l'app et la carte zoomable, la caption reste visible — le sélecteur ne les touche pas (classe `--banner` uniquement appliquée sur le hub).

### 2. Deux mounts indépendants

`gruyere-hero.js` reste agnostique au scroll. On utilise deux instances simultanées du même module :

- **Mount A** : `#gruyere-hero-intro`, fullscreen sticky, IO-driven. Démarre à `initialBeat: 1`. Pas de caption interne.
- **Mount B** : `#gruyere-hero-banner`, bannière 380-620 px, démarre à `initialBeat: 5`. Sert de hero compact du hub.

Les deux instances partagent `holeSeed: 'eval-2026'` → géométrie identique des plaques. Pas de transfert d'état entre A et B (les marks accumulés sur A ne migrent pas vers B).

**Cohabitation GPU** : un `IntersectionObserver` au niveau de `<section class="hero-intro">` bascule pause/resume entre A et B selon la visibilité de l'intro :

- Intro en vue → A actif, B en pause
- Intro hors vue → A en pause, B actif

Au mount initial, A est résumé et B est mis en pause immédiatement (avant le premier frame de B). Pas de fenêtre où les deux contextes WebGL tournent simultanément à régime nominal.

### 3. API JavaScript étendue (`gruyere-hero.js`)

**Nouvelles options** :

```js
mountGruyereHero(container, {
  ...existing defaults...,
  initialBeat: 5,              // n ∈ [1,5]. Default = 5 = état actuel (3 plaques actives).
  beatTransitionMs: 600,       // durée du fade in/out d'une plaque
});
```

`initialBeat` par défaut à `5` garantit la rétrocompatibilité : les mounts existants dans l'app et la carte zoomable continuent à tourner comme avant.

**Nouveau retour** :

```js
const hero = mountGruyereHero(el, opts);
// existing:
hero.destroy();
hero.pause();
hero.resume();
hero.reset();
// new:
hero.setBeat(n);   // n ∈ [1,5] — déclenche transition fluide
hero.getBeat();    // → n actuel (lecture seule)
```

**Sémantique des beats** :

| Beat | Plaques `enabled` | Plaques `targetOpacity` | Particules |
|------|-------------------|--------------------------|------------|
| 1 | — | toutes à 0 | spawn nominal, aucune collision, toutes atteignent l'accumulateur |
| 2 | P1 | P1 à `PLATE_OPACITY`, P2/P3 à 0 | la plupart bloquées par P1, ~30-40 % passent |
| 3 | P1 + P2 | P1/P2 à `PLATE_OPACITY`, P3 à 0 | ~10-15 % passent |
| 4 | P1 + P2 + P3 | toutes à `PLATE_OPACITY` | ~1-5 % (target survival rate du tuning Monte Carlo) |
| 5 | identique à beat 4 | identique à beat 4 | identique à beat 4 |

Beat 5 est visuellement identique à beat 4 ; il existe pour ancrer le palier « synthèse » du récit et garder un viewport de scroll dédié à la conclusion avant l'exit sticky.

**Internals de `setBeat(n)`** :

- Chaque entrée de `platesData` gagne 2 champs : `enabled: bool` (gate de collision) et `targetOpacity: number` (cible vers laquelle la matière interpole).
- Une fonction `tickPlateOpacity(dt)` appelée dans `animate()` interpole `mesh.material.opacity` et `rim.material.opacity` vers `targetOpacity` via lerp damping (taux ajusté pour atteindre la cible en ~`beatTransitionMs`).
- `setBeat(n)` se contente de mettre à jour `enabled` et `targetOpacity` pour chaque plaque. Le tick gère le rendu.
- `updateParticles()` skip les plaques où `enabled === false` dans sa boucle de collision.

**Timing `enabled` vs fade visuel** : `enabled` flip à `true` synchroniquement à `setBeat(n)`, **pas à mi-fade**. Justification : le visuel commence à fader sur 600 ms ; pendant ce temps, la collision est déjà active sur la plaque, donc les particules en cours de vol sont déjà bloquées dès le début de l'apparition. Sinon on aurait un déphasage gênant (la plaque visible mais transparente à 50 % laisserait passer). Trade-off : sur la première frame du `setBeat`, la plaque saute brutalement de 0 → quelques % d'opacité ; acceptable.

### 4. Mécanique scroll (`hero-intro.js`, nouveau module ~80 lignes)

```js
import { mountGruyereHero } from './gruyere-hero.js';

const BEATS = [
  { title: 'Les attaques se multiplient.', lede: '…' },
  { title: 'On met en place des sécurités.', lede: '…' },
  { title: 'Avec la maturité, on ajoute des couches.', lede: '…' },
  { title: 'Et encore une.', lede: '…' },
  { title: 'Aucune n\'est parfaite. Combinées, elles filtrent.', lede: '…' },
];

export function mountHeroIntro({ introContainer, bannerContainer }) {
  const isMobile = matchMedia('(max-width: 768px)').matches;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // bannerContainer EST le <figure class="gruyere-hero--banner"> (pas un wrapper).
  // introContainer EST <section class="hero-intro"> qui contient le <figure>.

  // Mobile / reduced-motion : skip l'intro entièrement
  if (isMobile || reducedMotion) {
    introContainer.hidden = true;
    const banner = mountGruyereHero(bannerContainer, { initialBeat: 5 });
    return { banner, destroy() { banner.destroy(); } };
  }

  const heroIntro = mountGruyereHero(
    introContainer.querySelector('.gruyere-hero'),
    { initialBeat: 1 }
  );
  const heroBanner = mountGruyereHero(bannerContainer, { initialBeat: 5 });
  heroBanner.pause();   // mute B avant son premier render

  // IO 1 : beat triggers — bande horizontale centrale du viewport (~1px)
  const captionEl = introContainer.querySelector('.hero-intro__caption');
  const titleEl = captionEl.querySelector('.hero-intro__title');
  const ledeEl = captionEl.querySelector('.hero-intro__lede');

  function updateCaption(n) {
    const b = BEATS[n - 1];
    captionEl.style.opacity = '0';
    setTimeout(() => {
      titleEl.textContent = b.title;
      ledeEl.textContent = b.lede;
      captionEl.style.opacity = '1';
    }, 180);
  }

  // Caption initiale (avant tout intersect)
  updateCaption(1);

  const beatIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const n = +e.target.dataset.beat;
      heroIntro.setBeat(n);
      updateCaption(n);
    }
  }, {
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0,
  });
  introContainer.querySelectorAll('.hero-intro__trigger').forEach(t => beatIO.observe(t));

  // IO 2 : pause/resume bascule
  const sectionIO = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      heroIntro.resume(); heroBanner.pause();
    } else {
      heroIntro.pause(); heroBanner.resume();
    }
  }, { threshold: 0 });
  sectionIO.observe(introContainer);

  return {
    intro: heroIntro,
    banner: heroBanner,
    destroy() {
      beatIO.disconnect();
      sectionIO.disconnect();
      heroIntro.destroy();
      heroBanner.destroy();
    },
  };
}
```

**Choix du `rootMargin: -50% 0px -50% 0px`** : seul le trigger qui croise la bande centrale horizontale du viewport (~1 px de haut) émet `isIntersecting: true`. Pas d'hystérésis bizarre en scroll inversé. Le scroll-up rejoue chaque beat en ordre inverse.

**Choix d'un état initial à beat 1 explicite** : on appelle `updateCaption(1)` au mount avant tout intersect. Sans ça, la première frame affiche une caption vide.

### 5. CSS (`gruyere-hero.css`, ~60 lignes à ajouter)

Bloc inséré à la fin du fichier existant :

```css
/* ─── Scrollytelling intro (hub uniquement) ──────────────────────────── */

.hero-intro {
  position: relative;
  height: 500vh;        /* 5 beats × 100vh */
  overflow: clip;       /* iOS Safari sticky fix (cf. CLAUDE.md override) */
}

.hero-intro__sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.hero-intro__sticky .gruyere-hero {
  height: 100%;         /* override le clamp() de la bannière */
}

.hero-intro__caption {
  position: absolute;
  left: clamp(20px, 4vw, 56px);
  bottom: clamp(40px, 8vh, 96px);
  max-width: 480px;
  padding: 22px 26px 24px;
  background: rgba(250, 246, 236, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-left: 3px solid var(--accent, #b8582e);
  box-shadow: 0 12px 32px rgba(30, 25, 18, 0.10);
  transition: opacity 180ms ease;
}

.hero-intro__title {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 400;
  font-size: clamp(22px, 3vw, 32px);
  line-height: 1.18;
  letter-spacing: -0.015em;
  color: #1e1e2a;
  margin: 0;
}

.hero-intro__lede {
  margin: 10px 0 0;
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  font-size: 14.5px;
  line-height: 1.55;
  color: #3b3f4d;
}

.hero-intro__trigger {
  position: absolute;
  left: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
  opacity: 0;
}
.hero-intro__trigger[data-beat="1"] { top: 10vh; }
.hero-intro__trigger[data-beat="2"] { top: 110vh; }
.hero-intro__trigger[data-beat="3"] { top: 210vh; }
.hero-intro__trigger[data-beat="4"] { top: 310vh; }
.hero-intro__trigger[data-beat="5"] { top: 410vh; }

.gruyere-hero--banner .gruyere-hero__caption { display: none; }

@media (max-width: 768px) {
  .hero-intro { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-intro { display: none; }
}
```

Points load-bearing :

- `overflow: clip` sur `.hero-intro` (pas `hidden`) — fix iOS Safari pour `position: sticky` documenté dans `CLAUDE.md`. Sur Safari < 16, fallback `overflow-x: hidden` ajouté juste avant si besoin (à valider en test).
- `overflow: hidden` sur `.hero-intro__sticky` pour empêcher le canvas Three.js de déborder pendant un repaint au scroll iOS.
- Position absolue de la caption à l'intérieur du sticky → reste fixe à l'écran pendant tout le pin. Contenu remplacé par JS, pas de translation.

## Mobile et accessibilité

- `@media (max-width: 768px)` masque `.hero-intro` entièrement. Le hub apparaît directement avec sa bannière compacte (`#gruyere-hero-banner`), comme la version actuelle.
- `@media (prefers-reduced-motion: reduce)` masque aussi `.hero-intro`. La bannière compacte fallback elle-même sur le poster SVG via la logique existante de `gruyere-hero.js`.
- Le `aria-live="polite"` sur la caption annonce les changements de beat aux lecteurs d'écran (les utilisateurs naviguant au clavier passent automatiquement à la bannière + hub via le skip mobile, donc pas de focus piégé dans le sticky).
- Le tab order saute logiquement par-dessus la section intro (aucun élément focusable dedans).

## Tests

### Tests automatisés (`node --test`)

**`tests/lib-contract.test.mjs`** — ajouts :

- `mountGruyereHero(el, { initialBeat: 1 })` retourne un objet avec `setBeat`, `getBeat`, `pause`, `resume`, `destroy`, `reset`
- `hero.getBeat()` reflète `initialBeat`
- `hero.setBeat(3); hero.getBeat() === 3`
- `hero.setBeat(0)` et `hero.setBeat(6)` doivent throw ou être no-op (à décider en impl — recommandation : no-op silencieux pour robustesse)

**`tests/apps-integration.test.mjs`** — ajouts pour `evaluation-agentique/index.html` :

- Présence de `<section class="hero-intro">` avec exactement 5 enfants `.hero-intro__trigger[data-beat]` (beats 1..5)
- Présence d'un `<figure class="gruyere-hero--banner">` distinct, avant `<main>`
- Présence de `<div class="hero-intro__caption">` avec `aria-live="polite"`
- `gruyere-hero.js` et `hero-intro.js` référencés dans des `<script type="module">`

### Vérifications manuelles

Avant merge, sur la branche `claude/gruyere-hero-3d-2026-05-21` :

- **Desktop Chrome** : scroll lent → les 5 captions s'enchaînent dans l'ordre, plaques fade-in dans l'ordre. Scroll up → ordre inverse, fade-out propre.
- **Desktop Chrome devtools mode mobile** : vérifier que la section intro est `display: none`, hub direct, bannière OK.
- **Reduced motion** : devtools Rendering tab → `prefers-reduced-motion: reduce`. Confirmer skip intro + poster sur bannière.
- **iOS Safari réel si possible** : checklist 7 points du `CLAUDE.md` § mobile-friendliness.
- **Checklist mobile 7 points** sur le hub modifié.

## Risques et points ouverts

1. **2 mounts WebGL simultanés au mount initial** — fenêtre d'une frame ou deux avant que `sectionIO` ne pause B. Acceptable. Mitigation : `heroBanner.pause()` appelé synchroniquement après le mount, avant le premier `requestAnimationFrame`.
2. **iPad en mode desktop UA** — passe au-dessus du break `max-width: 768px` mais le `position: sticky` peut être instable. Trade-off : on essaie sur iPad réel pendant la vérif. Si ça flicker, ajouter un détect `'ontouchstart' in window` pour skip aussi sur iPad.
3. **Bandes intercalaires entre beats** — avec `rootMargin: -50% 0px -50% 0px`, il existe une bande de quelques px entre deux triggers où aucun n'est en bande centrale. Pendant cette zone, l'état précédent persiste. C'est OK fonctionnellement, mais en lecture rapide ça peut donner l'impression d'un palier. À vérifier en QA.
4. **Beat 5 vs beat 4 identique visuellement** — différenciés uniquement par la caption. Risque : le scroll user pense que rien ne change. À valider à l'usage : si gênant, on peut envisager un petit zoom out caméra sur beat 5, ou un pulse visuel sur l'accumulateur.
5. **Caption fade timing (180 ms)** vs **plates fade (600 ms)** — désynchrone volontairement, la caption répond vite, les plaques répondent en arrière-plan. À valider à l'écran.
6. **Pas de transfert d'état entre Mount A et B** — quand on quitte la section intro, le Mount B démarre frais à beat 5 (pas de marks accumulés ni d'historique de l'intro). Pas grave : les marks décaient en 60 s de toute façon, et l'utilisateur a juste vu la scène en grand, le banner sert de rappel statique.

## Annexe — Drafts de contenu (à raffiner en impl)

| N | Titre | Lede |
|---|-------|------|
| 1 | *Les attaques se multiplient.* | Hallucinations, prompt injection, mauvais usage d'outils, fuites… Les agents IA exposent une surface d'attaque qui s'élargit chaque mois. |
| 2 | *On met en place des sécurités.* | Première couche : prévention. Filtres d'input, garde-fous système, contraintes sur les outils. **Beaucoup d'attaques passent encore.** |
| 3 | *Avec la maturité, on ajoute des couches.* | Curatif : on observe les trajectoires, on intercepte ce qui dérive en cours d'exécution. Moins de fuites — mais les trous restent. |
| 4 | *Et encore une.* | Qualitatif : juges LLM, evals offline, audit humain ponctuel. Trois couches imparfaites, chacune avec ses angles morts. |
| 5 | *Aucune n'est parfaite. Combinées, elles filtrent.* | ~1 % des attaques atteignent la cible. **Évaluer un agent**, c'est instrumenter ces 3 couches et mesurer ce qui passe quand même. |

## Fichiers à toucher

| Fichier | Type | Changement |
|---|---|---|
| `evaluation-agentique/index.html` | edit | Insérer `<section class="hero-intro">` + `<figure class="gruyere-hero--banner">` avant `<main>`. Remplacer l'inline `<script type="module">` qui mount le hero par l'import de `hero-intro.js`. |
| `evaluation-agentique/gruyere-hero.js` | edit | Ajouter `setBeat()`, `getBeat()`, `opts.initialBeat`, `opts.beatTransitionMs`, champ `enabled` + `targetOpacity` par plaque, gate de collision dans `updateParticles()`, lerp opacité dans `animate()`. |
| `evaluation-agentique/gruyere-hero.css` | edit | Ajouter le bloc `.hero-intro*` (~60 lignes). |
| `evaluation-agentique/hero-intro.js` | new | Module IO + scroll wiring (~80 lignes). |
| `tests/apps-integration.test.mjs` | edit | Assertions sur la présence des 5 triggers + bannière distincte. |
| `tests/lib-contract.test.mjs` | edit | Assertions sur `setBeat`, `getBeat`, `initialBeat`. |

Pas de changement attendu sur : `*-app.html`, `*-canvas.html`, `gruyere-hero-poster.svg`, `og.png`, autres pages du site.

## Ordre d'implémentation suggéré

1. Étendre `gruyere-hero.js` avec l'API beat. Tests contractuels passent. Aucun comportement visible changé (`initialBeat: 5` par défaut).
2. Ajouter le bloc CSS `.hero-intro*`. Skeleton DOM dans `index.html` mais l'intro est encore inerte (pas de JS pour la piloter).
3. Créer `hero-intro.js`. Activer dans `index.html`. La scrollytelling devient vivante.
4. Mettre à jour les tests d'intégration.
5. Vérification mobile + reduced-motion + desktop.
6. SEO regen : `python tools/seo_dossiers.py --only evaluation-agentique` (idempotent — pas de changement attendu sauf si titre/description évoluent).
7. Commit + push branche `claude/gruyere-hero-3d-2026-05-21`.
8. PR via `mcp__github__create_pull_request` vers `main` (owner/repo `mathieugug` / `mathieugug.github.io`).

## Hors périmètre

- Pas de changement à l'app (`*-app.html`) ni à la carte zoomable (`*-canvas.html`).
- Pas de modification de la géométrie 3D, des couleurs de plaques, du seed, du Monte Carlo tuning.
- Pas de version « scrollytelling » sur d'autres dossiers — pattern à valider en usage sur `evaluation-agentique` avant éventuelle généralisation.
- Pas de tracking / analytics du scroll.
- Pas de gestion d'erreur si WebGL n'est pas dispo : on hérite du fallback poster du lib existant. La section intro reste vide (fond papier) mais le hub fonctionne.
