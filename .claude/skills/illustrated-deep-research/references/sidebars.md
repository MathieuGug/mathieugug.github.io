# Sidebars TOC + Sources — pattern complet

Apps long-format avec `#toc` (sommaire à gauche) et `#sources` (citations à droite). Pattern réutilisable pour toute app `header.site` + `main#report` qui affiche un rapport avec citations numérotées.

## Vue d'ensemble

- **`#toc`** à gauche (largeur typique ~240 px) : sommaire généré depuis les `<h2>`/`<h3>` du `main#report`, lien actif synchronisé au scroll via IntersectionObserver.
- **`#sources`** à droite (largeur typique ~320 px) : liste `<ol>` des sources, chaque `<li id="source-N">` cible une citation `<a class="cite" data-cite="N">[N]</a>` dans la prose.
- Grille `.layout` 3-col desktop (`grid-template-columns: 240px minmax(0, 1fr) 320px`) ; collapse en colonne unique sous `@media (max-width: 1024px)`.

---

## Sticky math (desktop)

Les deux panneaux doivent **rester épinglés à la viewport** pendant que le rapport défile. Règle critique : utiliser `height: calc(100vh - 56px)` (**pas** `max-height`) avec `top: 56px`.

Pourquoi `height` et non `max-height` : avec `align-self: start` dans la grille, `max-height` n'impose pas la hauteur — le panneau se rétrécit à la hauteur de son contenu, ce qui laisse un trou en bas lorsque la liste est plus courte qu'une viewport. `height: calc(100vh - 56px)` force la hauteur ; `overflow-y: auto` reste là pour scroller le contenu interne.

La valeur `56px` correspond à la hauteur de la topbar fixe qui consomme le haut de la viewport.

```css
#toc, #sources {
  position: sticky;
  top: 56px;            /* hauteur de la topbar */
  height: calc(100vh - 56px);
  overflow-y: auto;
  align-self: start;
}
```

**Piège CSS fréquent** : ne pas ajouter de règle `aside#sources { position: relative; … }` en plus de `#sources { position: sticky; … }`. Le sélecteur `aside#sources` a une spécificité supérieure (0,1,1 vs 0,1,0) et silencieusement écrase `position: sticky` — le panneau se met alors à défiler avec le contenu. Symptôme : sur desktop, le panneau disparaît dès le premier scroll.

---

## Sources — HTML statique (non JS-généré)

Le bloc `<ol>` contenant les `<li id="source-N">` doit être **du HTML statique** écrit directement dans le body, pas généré à runtime par un IIFE qui injecte `innerHTML`. Le handler de citation dépend de `document.getElementById('source-N')` qui doit résoudre immédiatement — avec des sources JS-générées, un clic arrivant avant l'exécution de l'IIFE ne fait rien silencieusement.

---

## Format canonique des sources — `<li id="source-N">`

Le format canonique de chaque entrée du panneau Sources combine **numéro entre crochets** + **citation complète** + **URL complète affichée comme texte du lien** + **date d'accès**.

```html
<li id="source-1">
  <span class="cite-num">[1]</span>OWASP Foundation, "OWASP Top 10 for LLM Applications 2025", v4.2.0a, 14 November 2024
  <br><a href="https://owasp.org/.../OWASP-Top-10-for-LLMs-v2025.pdf" target="_blank" rel="noopener">https://owasp.org/.../OWASP-Top-10-for-LLMs-v2025.pdf</a><span class="accessed">Accessed YYYY-MM-DD</span>
</li>
```

Trois règles load-bearing :

1. **`[N]` avec crochets littéraux dans le HTML**, pas de pseudo-element `::before`/`::after`. Le lecteur scanne le panneau en cherchant le `[N]` cité depuis le corps du rapport — il doit lire à l'identique dans le source et le rendu.
2. **URL complète = texte du lien**, pas un label de host raccourci type `arxiv.org ↗`. Le label court masque la destination réelle (abstract vs PDF vs section ancrée vs mirror) ; l'URL complète, c'est la vérité. Les navigateurs modernes cassent les URLs proprement aux `/`.
3. **`<br>` avant le `<a>`** force le lien sur sa propre ligne, séparé visuellement du texte de citation — l'œil tombe dessus immédiatement.

### CSS canonique

```css
#sources li {
  font-size: 0.82rem;
  line-height: 1.5;
  margin: 0 0 16px;
  padding: 12px 14px;
  border-radius: 4px;
  border: 1px solid transparent;
  transition: border-color 220ms, background 220ms;
}
#sources li .cite-num {
  display: inline-block;
  font-family: var(--mono);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--carmine);
  margin-right: 6px;
}
#sources li a {
  display: inline-block;
  margin-top: 4px;
  color: var(--teal);
  text-decoration: none;
  font-size: 0.78rem;
  overflow-wrap: anywhere;  /* filet de sécurité pour les URLs sans séparateur */
}
#sources li a:hover { text-decoration: underline; }
#sources li .accessed {
  display: block;
  margin-top: 4px;
  color: var(--mist);
  font-style: italic;
  font-size: 0.74rem;
}
#sources li.highlight {
  background: var(--paper);
  border-color: var(--carmine);
}
```

Couleurs : numéro en `--carmine`, lien en `--teal`, accessed en `--mist`, taille 0.82 / 0.78 / 0.74 rem.

### Convention legacy (à migrer au passage)

Des apps plus anciennes utilisent parfois `<span class="cite-num">N</span>` sans crochets + `<a>host ↗</a>`. C'est legacy — toute édition d'une app sur ses sources (ajout, correction, refonte) doit en profiter pour basculer sur le pattern bracketed + full URL.

---

## Pattern `panel-close` (mobile)

Sous `1024px`, `#toc.open` et `#sources.open` couvrent la pleine viewport. Sans bouton de fermeture interne, un lecteur mobile qui ouvre un panneau n'a plus accès au rapport. Le pattern est **en trois parties** :

### CSS

```css
/* Hors media query — caché par défaut */
.panel-close { display: none; }

/* Mobile uniquement */
@media (max-width: 1024px) {
  .panel-close {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 91;
  }
  #toc.open,
  #sources.open {
    padding-top: 64px; /* évite que le contenu passe sous le bouton */
  }
}
```

### HTML

Le bouton doit être le **premier enfant** de chaque panneau.

```html
<nav id="toc">
  <button class="panel-close" type="button" aria-label="Fermer le sommaire">Fermer ✕</button>
  <!-- liens du sommaire -->
</nav>

<aside id="sources">
  <button class="panel-close" type="button" aria-label="Fermer les sources">Fermer ✕</button>
  <ol class="sources-list">
    <!-- <li id="source-N"> entries -->
  </ol>
</aside>
```

### JS — deux handlers

```js
// 1) Clic sur le bouton de fermeture
document.querySelectorAll('.panel-close').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('#toc, #sources')?.classList.remove('open');
  });
});

// 2) Escape — cède au zoom et à la modal (qui ont leurs propres handlers Esc)
// Sans ces gardes, appuyer sur Esc dans un schéma plein écran fermerait les deux à la fois.
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const zoom  = document.getElementById('zoom-overlay');
  const modal = document.getElementById('modal-root');
  if (zoom  && !zoom.hidden)  return;
  if (modal && !modal.hidden) return;
  const open = document.querySelector('#toc.open, #sources.open');
  if (open) { e.preventDefault(); open.classList.remove('open'); }
});
```

Le template `assets/app-template.html` embarque déjà ces trois éléments.

---

## `#sources-collapse-btn` — `position: fixed`, pas `position: absolute`

Le bouton repli du panneau Sources (bord gauche du panneau, visible au hover/focus) doit être en `position: fixed`, ancré à la viewport.

**Pourquoi pas `absolute`** : à l'intérieur de `#sources` qui a `overflow-y: auto`, un bouton `absolute` défile avec le contenu interne — quand la liste de sources dépasse une viewport, l'utilisateur doit remonter le panneau pour retrouver le bouton.

```css
#sources-collapse-btn {
  position: fixed;
  top: 50%;
  right: 320px;               /* aligné sur le bord gauche de #sources (320 px de large) */
  transform: translate(50%, -50%);
  z-index: 70;
}
```

Le bouton miroir `#sources-expand-btn` (apparaît quand `.layout.sources-collapsed` est active) est en `position: fixed; right: 0; top: 50%` — les deux occupent le même axe vertical milieu-droit, alternant via la classe `.layout.sources-collapsed`.

---

## Click handler — sources sidebar

Chaque citation dans la prose est un lien `<a class="cite" data-cite="N" href="#source-N">[N]</a>`. Le handler associé scroll vers la source et la surligne brièvement :

```js
document.addEventListener('click', (e) => {
  const cite = e.target.closest('.cite[data-cite]');
  if (!cite) return;
  e.preventDefault();
  const n = cite.dataset.cite;
  const li = document.getElementById('source-' + n);
  if (!li) return;
  li.scrollIntoView({ behavior: 'smooth', block: 'center' });
  li.classList.add('highlight');
  setTimeout(() => li.classList.remove('highlight'), 2200);
});
```

Sur mobile (≤ 1024px), le handler ouvre aussi le panneau sources en mode bottom-sheet. Sur desktop, si le panneau est replié (`.layout.sources-collapsed`), il déclenche le bouton expand et délaye le scroll (~320 ms pour laisser la transition se terminer).
