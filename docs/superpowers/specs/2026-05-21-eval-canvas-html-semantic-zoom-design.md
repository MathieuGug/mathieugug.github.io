# Canvas évaluation-agentique — semantic zoom HTML+SVG hybride (A0-first)

**Statut :** spec — à valider par Mathieu avant plan.
**Auteur :** brainstorming Mathieu × Claude, 2026-05-21.
**Remplace :** la précédente itération SVG-only (`20260521-evaluation-agentique-canvas.html` actuel) — voir les commits sur `claude/eval-canvas-redesign-2026-05-20`.

## 1. Pourquoi

L'itération SVG-only butait sur :

- Pas de vrai semantic zoom : clic S0 téléportait le viewBox vers un layer caché à y > 3000. La card S0 n'était PAS le détail, elle pointait vers un autre endroit. Mauvaise affordance.
- Texte SVG = compromis sur le rendu (hinting, sélection, accessibilité, line-break).
- L'aspect ratio des slots de détail (portrait) ≠ aspect du stage (paysage) → débord du voisin.
- Le bug `data-modal-svg=""` qui a fait apparaître l'interstitial mobile via injection HTML accidentelle.

La bonne primitive : **HTML pour la structure + CSS pour la mise en page + transitions, SVG seulement pour les îlots vraiment graphiques.** Et on construit *depuis l'A0* — le document complet, lisible linéairement, qui contient tout. Le zoom est alors un *projecteur* qui collapse les sections non focalisées.

## 2. Principe directeur

**A0 = document HTML long, cohérent, lisible linéairement comme un article.**
**Zoom = état CSS qui collapse ou met en avant des sections de cet A0.**

Une *card* n'est jamais déplacée dans le DOM. Elle change de taille, de position et de niveau de détail visible selon `:root[data-zoom]`. C'est le sens originel du zoom sémantique : *même élément, plus de détail.*

## 3. Structure A0 (HTML)

Le document complet, dans cet ordre, sans rien collapser :

```
<main class="canvas" data-zoom="0">

  <section class="hero">
    H1 "Évaluer un agent"
    Subtitle "Le playbook construit les défenses · le gruyère arrête les attaques"
    <svg class="gruyere-diagram">  <!-- SVG ÎLOT -->
      ... 3 slices, holes, 7 flèches d'attaque, outcomes ...
    </svg>
    Reason citation
  </section>

  <section class="playbook">
    H2 "Le playbook — comment on construit les défenses"
    <article class="phase" id="P1">
      Badge "Phase 1" · H3 "Collecte tasks" · subtitle
      <div class="subcards">
        <article class="subcard" id="S0">
          Badge "S0" · H4 "Démarrer tôt" · subtitle
          <ul class="methods">
            <li class="method">µ-1 "20-50 tasks" · body</li>
            <li class="method">µ-2 ...</li>
            µ-3, µ-4
          </ul>
          <aside class="antipattern">⚠ ANTI-PATTERN · ...</aside>
          <ul class="frameworks">Linear · GitHub Issues · Notion · Loom replay</ul>
          <blockquote class="tagline">« ... »</blockquote>
        </article>
        <article class="subcard" id="S1">...</article>
      </div>
    </article>
    Phase P2A (S2, S3), P2B (S4, S5), P3 (S6, S7)
  </section>

  <section class="gruyere">
    H2 "Le gruyère — ce qui arrête les attaques"
    <article class="couche" id="N1">
      Badge "Couche 1" · H3 "Préventif"
      <div class="subcards">
        <article class="subcard" id="C1">...</article>
        <article class="subcard" id="C2">...</article>
      </div>
    </article>
    Couche N2 (C3, C4), N3 (C5, C6)
  </section>

  <section class="attaques">
    H2 "7 attaques · trajectoires sur les 3 couches"
    <article class="attaque" id="A-prompt-injection">
      H3 "Prompt injection"
      <ol class="verdicts">
        <li data-slice="N1" data-verdict="passe">contenu N1</li>
        <li data-slice="N2" data-verdict="arrete">contenu N2</li>
        <li data-slice="N3" data-verdict="redondant">contenu N3</li>
      </ol>
    </article>
    × 7 attaques
  </section>

  <section class="outcomes">
    <article class="outcome outcome--success">Agent fiable</article>
    <article class="outcome outcome--failure">Incident</article>
  </section>

</main>
```

Lu en `data-zoom="0"` sur petit écran, ce document doit être lisible comme un article long et cohérent. Il faut s'assurer que **l'A0 est complet AVANT** d'ajouter la mécanique de zoom — sinon on construit sur du sable.

## 4. États de zoom

Mirroir 1:1 avec ce qu'on avait au SVG, mais maintenant chaque état correspond à un set de règles CSS qui mute la mise en page.

| `data-zoom` | Vue | Comportement |
|---|---|---|
| `0` | Overview | Hero visible · sections collapsed en bandeaux compacts (juste titre + subtitle) · gruyère SVG montre les 3 slices + 7 flèches |
| `P1`, `P2A`, `P2B`, `P3` | Phase zoomée | Section playbook scrollée en focus · sub-cards de la phase visibles avec teaser (titre + subtitle + "voir le détail") · autres sections dimmed à 0.05 |
| `N1`, `N2`, `N3` | Couche zoomée | Idem section gruyère · sub-cards de la couche en teaser |
| `S0`..`S7`, `C1`..`C6` | Sub-card pleine | La card devient `position: fixed; inset: 0; overflow-y: auto` · tout le contenu détaillé visible · le reste du document dimmed |
| `A-*` (les 7 attaques) | Attaque focalisée | Section attaques en focus · UNE attaque expanded avec ses 3 verdicts · autres collapsed |

Le routage est piloté par `location.hash` :
- `#` → `data-zoom="0"`
- `#zone-P1` → `data-zoom="P1"`
- `#S0` → `data-zoom="S0"`
- `#A-prompt-injection` → `data-zoom="A-prompt-injection"`

Cette parité avec l'existant garantit que les liens externes (partages, deep-links) continuent de fonctionner.

## 5. SVG : où on en garde

Trois îlots SVG, et trois seulement :

1. **`<svg class="gruyere-diagram">` dans `.hero`** — la viz centrale. 3 slices + holes + 7 flèches courbées + outcomes ✓/✗. Elle reste full-fidelity à tous les niveaux de zoom (juste sa taille évolue). C'est l'image-clé du dossier.

2. **`<svg class="attack-arrow">` inline dans chaque `.attaque`** — une mini-flèche schématique qui montre la trajectoire N1→N2→N3 et où l'attaque est arrêtée. Petit, focused, lisible à n'importe quel zoom.

3. **`<svg class="outcome-icon">` dans les deux outcomes** — juste le pictogramme ✓ ou ✗ stylisé. Pourrait être emoji ou Unicode mais SVG donne plus de contrôle.

Tout le reste — titres, badges, listes, pills, blockquotes, anti-pattern, frameworks — c'est du HTML pur. Bénéfices immédiats : sélection texte, accessibilité (lecteurs d'écran, OS zoom), font hinting, line-break responsive.

## 6. Mécanique de morph (CSS)

Pas de viewBox animation, pas de FLIP custom, pas de View Transitions API (pas encore standard partout). On utilise CSS Grid + transitions sur des propriétés bien définies.

Squelette de règles :

```css
:root { --gap: clamp(40px, 6vw, 80px); }

.canvas {
  display: grid;
  grid-template-columns: minmax(0, 720px);
  justify-content: center;
  gap: var(--gap);
  padding: var(--gap) clamp(16px, 4vw, 48px);
}

/* État compact d'une subcard (par défaut) */
.subcard {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: clamp(20px, 2.5vw, 32px);
  transition: padding 400ms cubic-bezier(.4,0,.2,1),
              border-color 400ms ease;
}
.subcard .methods,
.subcard .antipattern,
.subcard .frameworks,
.subcard .tagline {
  display: none;
}

/* Sub-card focalisée → position fixed plein écran */
:root[data-zoom="S0"] #S0,
:root[data-zoom="S1"] #S1,
/* ... 14 sélecteurs ... */
:root[data-zoom="C6"] #C6 {
  position: fixed;
  inset: 56px 0 0 0;   /* sous topbar */
  z-index: 50;
  overflow-y: auto;
  padding: clamp(40px, 6vw, 96px) clamp(20px, 5vw, 80px);
  background: var(--bg);
  max-width: 920px;
  margin-inline: auto;
}

:root[data-zoom="S0"] #S0 .methods,
:root[data-zoom="S0"] #S0 .antipattern,
:root[data-zoom="S0"] #S0 .frameworks,
:root[data-zoom="S0"] #S0 .tagline {
  display: block;
}

/* Dim du reste quand une sub-card est focus */
:root[data-zoom^="S"], :root[data-zoom^="C"] {
  .canvas > section { opacity: 0.04; pointer-events: none; }
}
```

L'animation est libre : transition sur `padding`, `opacity`, et — pour le passage compact → fixed — une combinaison de transitions sur les propriétés animables (`opacity`, `transform`) + un effet de fade-in/fade-out qui masque le saut layout (`position: static → fixed` n'est pas animable).

Si le saut est trop brutal, on couche par-dessus une transition d'opacité à 200ms qui fade-out la position compacte, swap, puis fade-in la position fixed. Pragmatique et suffisant pour ce cas.

## 7. JS

Minimaliste. Trois responsabilités :

1. **Routing hash ↔ data-zoom** : sur `hashchange`, parse le hash et set `document.documentElement.dataset.zoom`.
2. **Click handlers** : sur `.phase`, `.couche`, `.subcard`, `.attaque` → push state avec le hash correspondant.
3. **Keyboard** : Échap pop le zoom (S0 → P1 → 0), flèches naviguent les siblings (S0 ↔ S1 ↔ S2).

~80 lignes total. Tout le reste est CSS.

## 8. Migration

Le fichier `evaluation-agentique/20260521-evaluation-agentique-canvas.html` actuel sera **réécrit**. Le contenu textuel (les zoom-X.svg + les overlays attaques) est déjà rédigé et sert de source.

Phases :
1. **Construire l'A0 complet** : HTML statique avec tout le contenu, sans aucune mécanique de zoom. CSS de base, lisible linéairement. Test : à `data-zoom="0"` sans CSS de zoom, on doit pouvoir lire le doc du début à la fin sur n'importe quel écran.
2. **SVG gruyère dans le hero** : la viz centrale (3 slices + holes + flèches d'attaque + outcomes), placée comme `<figure>` dans `.hero`. Plus tout le styling autour.
3. **CSS de zoom** : règles pour chaque `data-zoom` (0, P*, N*, S*, C*, A-*). Test : muter `data-zoom` à la main en devtools, voir la mise en page muter proprement.
4. **JS routing + clicks + keyboard** : 3 fonctions courtes, contrat propre.
5. **Polish + accessibilité** : transitions tuning, focus management (focus dans la sub-card focalisée), aria-live pour annoncer les transitions.
6. **Mobile** : remplacer l'interstitial actuel par une vraie experience mobile. Sur petit écran, le doc se comporte juste comme un article scrollable, sans mécanique de zoom (ou avec un zoom degraded — collapse/expand des sub-cards via `<details>` natifs).

## 9. Non-objectifs

- **Pas d'animation cinématique entre sections.** Le zoom est instantané ou avec transition CSS basique. On ne refait pas Apple Keynote.
- **Pas de View Transitions API** (support encore inégal en 2026, faillible sur Safari).
- **Pas de pan/drag.** Le zoom est piloté par clic + hash, pas par geste de souris.
- **Pas de modale.** Tout vit dans le document. Le pattern modal de l'itération précédente est retiré.

## 10. Critères d'acceptation

- À `data-zoom="0"`, le hero gruyère SVG est lisible, les sections suivantes sont collapsed en bandeaux compacts (juste titre + subtitle + chip "voir").
- Clic sur Phase 1 → URL change en `#zone-P1`, la section playbook devient l'élément en focus, les sub-cards S0/S1 sont visibles en teaser, le reste du doc est dimmed.
- Clic sur S0 (teaser) → URL change en `#S0`, la card S0 devient fixed plein écran (sous la topbar), tout son contenu détaillé (µ-1..4, anti-pattern, frameworks, tagline) est visible et scrollable, le reste du doc disparaît visuellement.
- Échap depuis S0 → revient à `#zone-P1`. Échap encore → `#`.
- Reload sur `#S0` → ouvre directement avec S0 focalisée.
- Sélectionner du texte dans une sub-card fonctionne (browser native selection).
- Lecteur d'écran lit le document de manière cohérente.
- À 768px et en-dessous, le doc reste navigable (peut-être avec un mode dégradé : juste `<details>` natifs au lieu du zoom fixed).
- Pas de scrollbar horizontal involontaire.
- Pas de réapparition surprise de l'interstitial.
- Les hashs `#zone-P1`, `#S0`, `#A-prompt-injection` continuent de fonctionner (parité avec l'itération SVG).

## 11. Open questions

- **Niveau-1 visuel des sections playbook/gruyère/attaques** : faut-il que les sections inactives soient masquées (`display: none`) ou juste dimmées (`opacity: 0.04`) ? Dimmées préserve le scroll position et la cohérence du doc — préférable.
- **Hero SVG à `data-zoom="S0"`** : visible (dimmé) ou caché ? Caché évite le bruit. Dimmé garde le repère visuel. À tester.
- **Mobile zoom degraded** : `<details>` natifs (chacun avec `<summary>`) ou rien du tout (juste scroll long) ? `<details>` donne une UX familière.
- **Numérotation badges** : "S0…S7" et "C1…C6" gardés pour parité avec l'existant, OK.
- **Quoi faire du JSON-LD og:image existant ?** Réutilisé tel quel, pas de régénération SEO nécessaire (titre + description + slug inchangés).

## 12. Risques

- Saut visuel `position: static → fixed` non animable nativement. Mitigation : crossfade opacity 200ms.
- Backdrop scroll lock quand sub-card focalisée : il faut bloquer le scroll du document parent (CSS `:root[data-zoom^="S"] { overflow: hidden; }` au niveau body suffit).
- Focus management : quand une sub-card s'ouvre, focus doit aller dedans (a11y). Quand elle se ferme, focus revient au déclencheur. JS ~10 lignes.
- Le hash navigation pop le state — Échap dans le navigateur peut interférer avec back. Soit on accepte que back native marche aussi, soit on capture Échap explicitement et on push une nouvelle state. À tester.

---

**Prochaine étape** : Mathieu lit la spec, on ajuste, puis on génère le plan d'implémentation avec tâches bite-sized et on délègue en subagent-driven.
