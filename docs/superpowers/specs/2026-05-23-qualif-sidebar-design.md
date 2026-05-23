# Sidebar qualif (nav + état) — design

**Date** : 2026-05-23
**Auteur** : Mathieu Guglielmino (brainstormé avec Claude)
**Pilote** : `analytics-agentique-gcp/`
**Dépend de** : `2026-05-23-business-qualification-widget-design.md` (widget de qualif déjà livré)
**Status** : draft, validé par le user

## Intention

Ajouter une **sidebar de navigation/état** pour le widget de qualif, qui résout un problème d'usage identifié à la livraison : avec 6 mini-blocs distribués au fil de la prose, le lecteur ne sait pas combien il en reste à remplir ni où ils sont.

La sidebar offre une **vue d'ensemble** des 6 axes + leur état de complétude + un lien direct vers chaque mini-bloc inline. **Elle ne contient pas les inputs** — la saisie continue de se faire dans la prose (pour préserver l'effet diégétique).

## Architecture

### Desktop (≥ 1024px)

Nouvelle `<aside id="qualif-nav">` injectée dans la colonne de droite du layout grid, **au-dessus de `#sources`**. Sticky avec `top: var(--topbar-h)`. Hauteur naturelle (~280px pour 6 axes). Sources reste sticky en-dessous, avec son `top` décalé de `var(--qualif-nav-h) + gap`.

### Mobile (≤ 1024px)

Un 3e bouton dans la topbar (`#toggle-qualif`) à côté de `#toggle-toc` et `#toggle-sources`. Click → drawer plein écran qui couvre la prose, même mécanique que les drawers TOC/Sources existants. Close par `.panel-close` ou ESC.

### DOM injecté

```html
<aside id="qualif-nav" class="qualif-nav" aria-labelledby="qualif-nav-title">
  <header class="qualif-nav__head">
    <p class="qualif-nav__eyebrow">// votre profil</p>
    <h4 id="qualif-nav-title">Profil de qualif</h4>
    <button type="button" class="panel-close" aria-label="Fermer">×</button>
  </header>
  <ol class="qualif-nav__list">
    <li data-axis="maturite-ia">
      <a href="#qualif-step-maturite-ia">
        <span class="qualif-nav__label">Maturité IA</span>
        <span class="qualif-nav__state" data-bind="state">0 / 3</span>
      </a>
    </li>
    <!-- 5 autres axes -->
  </ol>
  <footer class="qualif-nav__foot">
    <a href="#qualif-recap" class="qualif-nav__see-recap">Voir mon profil ↓</a>
  </footer>
</aside>
```

### Anchors

Les liens `<a href="#qualif-step-{axisId}">` exigent que chaque mini-bloc ait un id ancrable. Donc on ajoute `id="qualif-step-{axisId}"` sur les `<aside class="qualif-step">` (Python injector update).

## États dynamiques

Refactorer la logique de comptage existante : extraire de `updateStepWitness` un helper `axisCompletion(axis, state)` qui retourne `{filled, total, isComplete}`. Réutilisé par :
- `updateStepWitness` (mini-bloc inline footer, déjà existant)
- nouveau `updateNavState` (peint le `<span data-bind="state">` avec `0 / 3`, `1 / 3`, `✓` quand complet)

Re-render à chaque `renderAll()` (déjà appelé sur chaque saisie).

**Classes d'état sur `<li>`** :
- `data-axis="..."` toujours présent.
- `.is-empty` quand 0/3.
- `.is-partial` quand 1-2/3.
- `.is-complete` quand 3/3 (couleur accent + symbole ✓).

## Identité visuelle

- Bordure gauche `3px solid var(--qualif)` (cohérent avec mini-blocs).
- Header h4 mono petite caps eyebrow + serif label.
- Liste `<ol>` avec compteur natif `1.` à `6.` en mono petite caps gris doux.
- État `0 / 3` en `--ink-soft`, `1-2/3` en `--qualif`, `✓` en `--accent`.
- Hover sur `<a>` : sous-ligne dotted → solid.
- Footer "Voir mon profil ↓" : style `.qualif-step__see-recap` (déjà existant).

## Mobile drawer

- Topbar bouton `#toggle-qualif` avec label "Profil" (ou icône).
- Click → toggle classe `is-open` sur `#qualif-nav`, qui passe en `position: fixed; inset: 0; z-index: 100`.
- Backdrop `body.has-panel-open` pour bloquer scroll (pattern existant).
- ESC ou click sur `.panel-close` → close.
- Sur tap d'un lien `<a href="#qualif-step-...">` : 
  1. Close le drawer
  2. Scroll vers le mini-bloc (via `scroll-behavior: smooth`)
  3. Le focus va au mini-bloc (optionnel, pour SR)

## Synchro

**Aucune duplication d'inputs** — la sidebar ne contient PAS de fieldset/input/slider. Toute la saisie se fait via les mini-blocs inline. La sidebar lit le state au render et propose juste des liens annotés.

## Print

`@media print` cache `#qualif-nav` (déjà le pattern : on cache toute la nav, on garde seulement le récap).

## Fichiers touchés

- `assets/dossier-qualif.js` :
  - Nouveau helper pur `axisCompletion(axis, state)`.
  - Refactor `updateStepWitness` pour utiliser le helper.
  - Nouveau `wireQualifNav(handles)` appelé par `init()`.
  - Nouveau `updateNavState(handles)` appelé par `renderAll()`.
  - Wire du bouton `#toggle-qualif` (toggle drawer).
  - Wire des `<a href="#qualif-step-...">` pour fermer le drawer mobile au click.
- `assets/dossier-qualif.css` :
  - Bloc `.qualif-nav` (desktop sticky + mobile drawer).
  - Adapter le sticky des sources si nécessaire (`top` calculation).
  - `@media print { #qualif-nav { display: none } }` (déjà dans le pattern global).
- `tools/insert_qualif.py` :
  - Nouvelle fonction `render_qualif_nav(config)` (markup statique + liste générée depuis `config.axes`).
  - Nouvelle fonction `inject_qualif_nav(html_src)` (idempotent, replace ou insert avant `#sources`).
  - Update `render_step` pour ajouter `id="qualif-step-{axisId}"` sur le `<aside>`.
  - Update `main()` pour appeler `inject_qualif_nav` après `inject_recap`.
  - Update `ensure_topbar_button(html_src)` (ou similaire) pour ajouter le bouton `#toggle-qualif` dans la topbar si absent.
- `analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html` :
  - Reçoit le markup généré par le script.
- `tests/qualif-integration.test.mjs` :
  - +3-4 tests : présence sidebar, anchors `qualif-step-{id}` sur les 6 mini-blocs, lien topbar.

## Hors scope

- Pas de duplication des inputs dans la sidebar.
- Pas de mini-radar dans la sidebar (le récap final assume ce rôle).
- Pas de drag-and-drop ou de réordonnancement des axes.
- Pas d'animation autre que le `scroll-behavior: smooth` natif.

## Critères de succès

1. Sidebar visible sur desktop ≥ 1024px, sticky en haut à droite, au-dessus des Sources.
2. Mobile ≤ 1024px : 3e bouton topbar ouvre un drawer plein écran qui se ferme au tap d'un lien ou via ESC/×.
3. Les 6 axes apparaissent dans l'ordre du JSON.
4. L'état (0/3 → 1/3 → 2/3 → ✓) se met à jour live à chaque saisie inline.
5. Click sur un axe → scroll smooth vers le mini-bloc correspondant.
6. Click sur "Voir mon profil ↓" → scroll smooth vers le récap final.
7. Print : sidebar masquée, seul le récap apparaît.
8. Tests d'intégration mis à jour passent en CI.
9. Idempotence du script Python : 2e run = 0 diff.

## Décisions clés (récap)

| Décision | Choix | Pourquoi |
|---|---|---|
| Rôle sidebar | Nav + état uniquement | Préserve la diégèse, plus léger |
| Placement | Col droite au-dessus de Sources | Cohérent avec pattern existant, identité visuelle propre |
| Mobile | Drawer plein écran (3e bouton topbar) | Cohérent avec TOC/Sources |
| Synchro | Lit le state, n'écrit jamais | Pas de duplication d'inputs |
