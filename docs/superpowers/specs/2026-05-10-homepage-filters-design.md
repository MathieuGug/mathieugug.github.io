# Refonte de la homepage — bandeau À la une + bibliothèque filtrable

**Date** : 2026-05-10
**Périmètre** : `index.html` racine
**Statut** : design validé conversationnellement, en attente de revue du spec écrit

## Contexte et motivation

L'homepage publie 16 artefacts (avril–mai 2026) répartis en deux sections séparées :

- `#series` — « Mes favoris » : 4 cartes curées à la main.
- `#dossiers` — « Tous les dossiers » : 12 cartes restantes.

À cadence ~2 publications/semaine, fin 2026 ≈ 60–80 cartes. Le découpage Favoris/Dossiers va devenir intenable :

- La section Favoris est figée (pas de tri, pas de filtre, pas de recherche).
- La section Dossiers défile en grille linéaire — pas de moyen de viser un sujet précis sans Ctrl+F.
- La maintenance éditoriale (« qu'est-ce qui mérite d'être en favori cette semaine ? ») devient elle-même une charge.

**Promesse de la nouvelle page** : *vitrine + bibliothèque*. Un bandeau **À la une** (3 cartes mises en valeur éditorialement) reste l'entrée pour le visiteur de passage. Une **bibliothèque filtrable** unifiée permet à un visiteur ciblé de viser une matière par type, par thème, ou par recherche texte.

## Objectifs

1. **Remplacer** les sections `#series` (Favoris) + `#dossiers` (Dossiers) par une structure unifiée *À la une* + *Bibliothèque*.
2. **Filtrer** la bibliothèque par type (Veille / Étude / Dossier) et par thème (taxonomie de 7 thèmes, multi-sélection).
3. **Rechercher** dans titre + sous-titre + libellés thèmes, instantanément côté client.
4. **Paginer** via « Voir 12 de plus » pour scaler à 80+ cartes sans pénaliser le first paint.
5. **Préserver** le reste de la page (hero, À propos, Aujourd'hui, Expertise, Parcours, Footer) et la grammaire visuelle existante (palette, typographie, sticky topbar).

## Non-objectifs

- Pas de framework JS. Tout reste vanilla, dans un bloc `<script>` inline en bas de `index.html`.
- Pas de fichier de données externe (`.json`). Les attributs des cartes vivent en `data-*` directement dans le HTML — cohérent avec « tout dans `index.html` ».
- Pas de filtre par format (App / Scrolly / Livre / Journal). Si besoin un jour, ajout incrémental.
- Pas de filtre par année tant que tout est 2026.
- Pas de mémorisation de filtres en `localStorage`. URL state seulement.
- Pas de fuzzy search (substring match suffit pour 60–80 cartes).
- Pas de virtualisation (DOM 80 cartes reste léger).

## Architecture de la page

```
[topbar fixe 56px]                                    (existant)
[hero principal]                                      (existant)
─────────────────────────────────────────────────────
[À LA UNE]              ← nouveau bandeau, 3 cartes featured
─────────────────────────────────────────────────────
[BIBLIOTHÈQUE]          ← unifie ex-#series + ex-#dossiers
   header "Tous les artefacts · 16 publications"
   ╔══════════════════════════════════════════════╗
   ║  🔍 Rechercher…    chips Type · chips Thèmes  ║   sticky top: 56px
   ║                                       12 / 47 ║
   ╚══════════════════════════════════════════════╝
   [grille 2 col desktop / 1 col mobile, 12 cartes initiales]
   [Voir 12 de plus →]
─────────────────────────────────────────────────────
[À propos] [Aujourd'hui] [Expertise] [Parcours]       (existant)
[Footer]                                              (existant)
```

### Compatibilité ancres

Les ancres `#series` et `#dossiers` existent dans plusieurs liens (topbar du hero, retours de hub, partages externes). Pour ne pas les casser :

- L'ancre canonique devient `#bibliotheque`.
- Deux `<span id="series">` et `<span id="dossiers">` invisibles (zero-height) sont placés juste avant `#bibliotheque` pour absorber les anciens liens.
- Le lien « Séries » de la topbar du hero pointe sur `#bibliotheque`.

## Section À la une

### HTML

```html
<section class="section featured-wrap" id="a-la-une">
  <div class="series-head">
    <div>
      <div class="section-eyebrow">À la une</div>
      <h2>Trois <em>repères</em> en ce moment.</h2>
    </div>
    <span class="series-hint">3 sélections · mai 2026</span>
  </div>
  <p class="section-lede">Lecture proposée. Le reste vit dans <a href="#bibliotheque">la bibliothèque</a> ci-dessous.</p>

  <div class="featured-grid">
    <a href="proces-musk-altman/" class="serie featured" …>…</a>
    <a href="evaluation-agentique/" class="serie featured" …>…</a>
    <a href="mcp-plateforme/" class="serie featured" …>…</a>
  </div>
</section>
```

- **3 cartes**, format identique aux cartes actuelles (cover SVG pleine largeur, eyebrow date, badge type, titre, sub, meta, CTA).
- Curation manuelle : Mathieu choisit les 3 slugs en éditant le HTML. Pas de mécanique automatique.
- Les **mêmes cartes** apparaissent **aussi** dans la grille en dessous (pas de duplication HTML : on duplique uniquement le markup `.serie` dans la section `#a-la-une` ET dans `#bibliotheque .biblio-grid`. Ça reste deux liens vers la même URL ; volume HTML +3 cartes, négligeable).
- Initiale proposée (à confirmer par Mathieu) : `proces-musk-altman` · `evaluation-agentique` · `mcp-plateforme`.

### CSS

`.featured-grid` reprend `.series-grid` à l'identique (deux colonnes ≥768px, une colonne <768px). Pas de classe modificatrice `.featured` qui change le rendu — uniquement le contexte (section `#a-la-une`). Si plus tard on veut un styling différent (cover plus haute, lede plus long), on ajoute des règles ciblées `.featured-grid .serie {…}`.

## Section Bibliothèque

### HTML

```html
<section class="section biblio-wrap" id="bibliotheque">
  <span id="series" aria-hidden="true"></span>
  <span id="dossiers" aria-hidden="true"></span>

  <div class="series-head">
    <div>
      <div class="section-eyebrow">Bibliothèque</div>
      <h2>Tous les <em>artefacts</em>.</h2>
    </div>
    <span class="series-hint" id="biblio-total">16 publications · 2026</span>
  </div>
  <p class="section-lede">Filtre par type, par thème, ou cherche un sujet. Tout est ici.</p>

  <form class="biblio-filters" role="search" aria-label="Filtrer la bibliothèque">
    <div class="biblio-search">
      <input type="search" id="biblio-q"
             placeholder="Rechercher un sujet, un titre…"
             aria-label="Rechercher dans les artefacts"
             autocomplete="off">
    </div>

    <div class="biblio-chips" role="radiogroup" aria-label="Type d'artefact">
      <button type="button" class="chip chip-type chip-active" role="radio"
              aria-checked="true" data-type="">Tous</button>
      <button type="button" class="chip chip-type" role="radio"
              aria-checked="false" data-type="veille">Veille</button>
      <button type="button" class="chip chip-type" role="radio"
              aria-checked="false" data-type="etude">Étude</button>
      <button type="button" class="chip chip-type" role="radio"
              aria-checked="false" data-type="dossier">Dossier</button>
    </div>

    <div class="biblio-chips" role="group" aria-label="Thèmes">
      <button type="button" class="chip chip-theme" role="checkbox"
              aria-checked="false" data-theme="agentique">Agentique</button>
      <button type="button" class="chip chip-theme" role="checkbox"
              aria-checked="false" data-theme="production">Production</button>
      <button type="button" class="chip chip-theme" role="checkbox"
              aria-checked="false" data-theme="modeles">Modèles & recherche</button>
      <button type="button" class="chip chip-theme" role="checkbox"
              aria-checked="false" data-theme="gouvernance">Gouvernance & risques</button>
      <button type="button" class="chip chip-theme" role="checkbox"
              aria-checked="false" data-theme="economie">Économie & ROI</button>
      <button type="button" class="chip chip-theme" role="checkbox"
              aria-checked="false" data-theme="societe">IA & société</button>
      <button type="button" class="chip chip-theme" role="checkbox"
              aria-checked="false" data-theme="storytelling">Storytelling & narrative</button>
    </div>

    <div class="biblio-counter" aria-live="polite">
      <span id="biblio-shown">12</span> / <span id="biblio-matched">16</span>
    </div>
  </form>

  <div class="biblio-grid series-grid" id="biblio-grid">
    <!-- 16 cartes .serie avec data-type/data-themes/data-date/data-numero/data-search-text -->
  </div>

  <div class="biblio-empty" id="biblio-empty" hidden>
    <p>Aucun artefact ne correspond à ces filtres.</p>
    <button type="button" class="biblio-reset" id="biblio-reset">Réinitialiser tous les filtres</button>
  </div>

  <div class="biblio-more-wrap" id="biblio-more-wrap">
    <button type="button" class="biblio-more" id="biblio-more">
      Voir <span id="biblio-more-count">12</span> de plus <span class="biblio-more-arrow">→</span>
    </button>
  </div>
</section>
```

### Modèle de données par carte

```html
<a href="proces-musk-altman/" class="serie"
   data-type="veille"
   data-themes="gouvernance economie"
   data-date="2026-04-27"
   data-numero="03"
   data-search-text="proces musk altman openai oakland audience juridique chronologie veille gouvernance economie">
  …
</a>
```

- `data-type` ∈ `veille | etude | dossier`. Source : la classe `.serie-type` actuelle (`.veille` ou rien).
- `data-themes` : tokens espace-séparés parmi `agentique production modeles gouvernance economie societe storytelling`.
- `data-date` : ISO `YYYY-MM-DD` (mai/avril 2026 → 2026-04-27, 2026-05-08, etc.). Pour les `serie-tag` actuellement en « Avril 2026 » sans jour précis (anatomie, gouvernance), date fictive du 1er du mois (`2026-04-01`).
- `data-numero` : conservé (ex. `"16"`). Sert au tri secondaire si deux cartes partagent la date.
- `data-search-text` : pré-calculé à l'écriture du HTML. Composition : `${titre brut} ${sub brut} ${libellés des thèmes joints}`, le tout en minuscules + accents strippés (`é`→`e`, `à`→`a`, etc.). Exemple ci-dessus.

### Mapping initial type + thèmes

| Slug | Type | Thèmes |
|---|---|---|
| `proces-musk-altman` | veille | gouvernance, economie |
| `evaluation-agentique` | etude | agentique, production |
| `observabilite-agents-ia` | etude | agentique, production |
| `anatomie` | dossier | agentique |
| `mcp-plateforme` | dossier | agentique |
| `measure-roi` | dossier | economie |
| `ia-et-travail` | etude | societe |
| `gouvernance` | dossier | gouvernance |
| `agents-computer-use` | etude | agentique |
| `economie-inference` | etude | economie, production |
| `harness-agentique` | etude | agentique |
| `memoire-agentique` | etude | agentique |
| `modeles-raisonnement` | etude | modeles |
| `world-models` | etude | modeles |
| `llm-jailbreaking` | etude | gouvernance |
| `narrative-experiences` | dossier | storytelling |

Distribution thèmes : `agentique 7 · production 3 · gouvernance 3 · economie 3 · modeles 2 · societe 1 · storytelling 1`.

## CSS — filter bar

### Variables ajoutées

Aucune nouvelle variable CSS — on réutilise `--bg`, `--bg-2`, `--surface`, `--line`, `--line-strong`, `--text`, `--text-mid`, `--accent`.

### Filter bar sticky

```css
.biblio-filters {
  position: sticky;
  top: 56px;                                 /* sous la topbar fixe */
  z-index: 40;                                /* sous la topbar (50), au-dessus des cartes */
  background: rgba(250, 246, 236, 0.92);      /* var(--bg) avec alpha */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid transparent;
  margin: 24px -5vw 32px;                     /* casse le wrap pour aller bord à bord */
  padding: 16px 5vw;
  display: grid;
  grid-template-columns: minmax(240px, 1fr) auto auto;
  grid-template-areas:
    "search type counter"
    "search themes counter";
  gap: 12px 24px;
  align-items: center;
}
.biblio-filters.scrolled {
  border-bottom-color: var(--line);
  background: rgba(250, 246, 236, 0.96);
}
```

Sur mobile (`max-width: 767px`) :

```css
@media (max-width: 767px) {
  .biblio-filters {
    grid-template-columns: 1fr;
    grid-template-areas:
      "search"
      "type"
      "themes"
      "counter";
    margin: 16px -6vw 24px;
    padding: 14px 6vw;
  }
  .biblio-counter { justify-self: end; font-size: 11px; }
  .biblio-chips {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    flex-wrap: nowrap;        /* row scrollable plutôt que wrap, sinon trop de hauteur */
  }
  .biblio-chips::-webkit-scrollbar { display: none; }
}
```

### Chips

```css
.chip {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: 1px solid var(--line-strong);
  border-radius: 100px;
  background: transparent;
  color: var(--text-mid);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.chip:hover { border-color: var(--text); color: var(--text); }
.chip[aria-checked="true"], .chip-active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}
/* "Tous" actif a un styling distinct (graphite, pas accent) pour signaler "aucun filtre"  */
.chip-type[data-type=""][aria-checked="true"] {
  background: var(--text);
  border-color: var(--text);
  color: var(--bg);
}
.biblio-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.biblio-chips[aria-label="Type d'artefact"] { grid-area: type; }
.biblio-chips[aria-label="Thèmes"] { grid-area: themes; }
.biblio-search { grid-area: search; }
.biblio-counter { grid-area: counter; }
```

### Search input

```css
.biblio-search input[type="search"] {
  width: 100%;
  padding: 10px 14px 10px 38px;
  border: 1px solid var(--line-strong);
  border-radius: 100px;
  background: var(--surface) url("data:image/svg+xml;utf8,<svg…/>") no-repeat 14px center;
  background-size: 14px 14px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: var(--text);
  transition: border-color 0.15s;
}
.biblio-search input[type="search"]:focus {
  outline: none;
  border-color: var(--accent);
}
```

### Counter, empty, more

```css
.biblio-counter {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--text-mid);
}
.biblio-empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-mid);
}
.biblio-empty p {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 19px;
  margin-bottom: 16px;
}
.biblio-reset {
  appearance: none;
  background: transparent;
  border: 1px solid var(--line-strong);
  border-radius: 100px;
  padding: 9px 18px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text);
  cursor: pointer;
}
.biblio-reset:hover { background: var(--text); color: var(--bg); }
.biblio-more-wrap {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
.biblio-more {
  appearance: none;
  background: var(--surface);
  border: 1px solid var(--line-strong);
  border-radius: 100px;
  padding: 14px 28px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text);
  cursor: pointer;
  transition: all 0.15s;
}
.biblio-more:hover { background: var(--text); color: var(--bg); border-color: var(--text); }
.biblio-more-arrow { display: inline-block; margin-left: 6px; transition: transform 0.15s; }
.biblio-more:hover .biblio-more-arrow { transform: translateX(3px); }
```

### Styling des cartes featured

Aucune règle dédiée. Les cartes featured héritent de `.serie` standard. (Si plus tard on veut différencier visuellement, ajouter `.featured-grid .serie {…}`.)

### Grille : pas de changement

`.biblio-grid` est une instance de `.series-grid` existante. Pas de nouvelle règle.

## JS — comportement

Bloc `<script>` inline en bas de `index.html`, après les sections. ~120 lignes vanilla.

### Pseudo-code

```js
(function () {
  const PAGE_SIZE = 12;

  // Refs
  const grid = document.getElementById('biblio-grid');
  const cards = Array.from(grid.querySelectorAll('.serie'));
  const searchInput = document.getElementById('biblio-q');
  const typeChips = document.querySelectorAll('.chip-type');
  const themeChips = document.querySelectorAll('.chip-theme');
  const counter = { shown: document.getElementById('biblio-shown'),
                    matched: document.getElementById('biblio-matched') };
  const moreBtn = document.getElementById('biblio-more');
  const moreWrap = document.getElementById('biblio-more-wrap');
  const empty = document.getElementById('biblio-empty');
  const resetBtn = document.getElementById('biblio-reset');

  let state = {
    q: '',           // string
    type: '',        // '' | 'veille' | 'etude' | 'dossier'
    themes: new Set(),
    shown: PAGE_SIZE
  };

  // ── 1. URL state (lire au load, écrire au changement) ───────────
  function readUrl() {
    const p = new URLSearchParams(location.search);
    state.q = p.get('q') || '';
    state.type = p.get('type') || '';
    const t = p.get('theme');
    state.themes = t ? new Set(t.split(',').filter(Boolean)) : new Set();
  }
  function writeUrl() {
    const p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.type) p.set('type', state.type);
    if (state.themes.size) p.set('theme', Array.from(state.themes).join(','));
    const qs = p.toString();
    history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
  }

  // ── 2. Normalize search (lowercase + accent strip via NFD + combining-diacritics range U+0300..U+036F) ─
  function norm(s) {
    return (s || '').toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  // ── 3. Filter ───────────────────────────────────────────────────
  function matches(card) {
    if (state.type && card.dataset.type !== state.type) return false;
    if (state.themes.size) {
      const cardThemes = (card.dataset.themes || '').split(/\s+/);
      const hit = cardThemes.some(t => state.themes.has(t));
      if (!hit) return false;
    }
    if (state.q) {
      const needle = norm(state.q);
      const hay = card.dataset.searchText || '';
      if (!hay.includes(needle)) return false;
    }
    return true;
  }

  // ── 4. Render ───────────────────────────────────────────────────
  function render() {
    let matched = 0, shown = 0;
    cards.forEach(card => {
      const ok = matches(card);
      if (!ok) { card.hidden = true; return; }
      matched++;
      if (shown < state.shown) {
        card.hidden = false;
        shown++;
      } else {
        card.hidden = true;
      }
    });
    counter.shown.textContent = shown;
    counter.matched.textContent = matched;
    empty.hidden = matched > 0;
    moreWrap.hidden = matched <= state.shown;
    grid.hidden = matched === 0;
    // Dynamic "Voir N de plus" label: cap at PAGE_SIZE, but show actual remainder if smaller
    const remaining = Math.max(0, matched - state.shown);
    document.getElementById('biblio-more-count').textContent = Math.min(PAGE_SIZE, remaining);
  }

  // ── 5. Reset ────────────────────────────────────────────────────
  function reset() {
    state = { q: '', type: '', themes: new Set(), shown: PAGE_SIZE };
    searchInput.value = '';
    typeChips.forEach(c => c.setAttribute('aria-checked', c.dataset.type === '' ? 'true' : 'false'));
    typeChips.forEach(c => c.classList.toggle('chip-active', c.dataset.type === ''));
    themeChips.forEach(c => c.setAttribute('aria-checked', 'false'));
    writeUrl();
    render();
  }

  // ── 6. Sync UI from state (utilisé au load après readUrl) ──────
  function syncUi() {
    searchInput.value = state.q;
    typeChips.forEach(c => {
      const on = c.dataset.type === state.type;
      c.setAttribute('aria-checked', on ? 'true' : 'false');
      c.classList.toggle('chip-active', on);
    });
    themeChips.forEach(c => {
      const on = state.themes.has(c.dataset.theme);
      c.setAttribute('aria-checked', on ? 'true' : 'false');
    });
  }

  // ── 7. Event listeners ──────────────────────────────────────────
  let qTimer;
  searchInput.addEventListener('input', e => {
    clearTimeout(qTimer);
    qTimer = setTimeout(() => {
      state.q = e.target.value;
      state.shown = PAGE_SIZE;
      writeUrl();
      render();
    }, 100);
  });

  typeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      state.type = chip.dataset.type;
      state.shown = PAGE_SIZE;
      syncUi();
      writeUrl();
      render();
    });
  });

  themeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const t = chip.dataset.theme;
      if (state.themes.has(t)) state.themes.delete(t);
      else state.themes.add(t);
      state.shown = PAGE_SIZE;
      syncUi();
      writeUrl();
      render();
    });
  });

  moreBtn.addEventListener('click', () => {
    state.shown += PAGE_SIZE;
    render();
  });

  resetBtn.addEventListener('click', reset);

  // ── 8. Sticky scroll border ─────────────────────────────────────
  const filters = document.querySelector('.biblio-filters');
  function checkScroll() {
    const top = filters.getBoundingClientRect().top;
    filters.classList.toggle('scrolled', top <= 57); // 56px topbar + 1px tolerance
  }
  window.addEventListener('scroll', checkScroll, { passive: true });

  // ── 9. Init ─────────────────────────────────────────────────────
  readUrl();
  syncUi();
  render();
  checkScroll();
})();
```

### Notes d'implémentation

- **Tri des cartes** : pas géré par JS. Les cartes sont écrites en HTML dans l'ordre date desc dès la migration ; le filtrage préserve l'ordre du DOM. Toute nouvelle carte s'insère manuellement à la bonne position dans le HTML.
- **Pagination + filtres** : changer un filtre **reset** `shown` à 12. C'est attendu — sinon on aurait un compteur incohérent (« 24 / 6 »).
- **Ordre des cartes après filtrage** : ordre du DOM, donc date desc (cohérent avec la promesse « le plus récent en premier »).
- **Cartes à venir** : tout nouveau dossier ajouté au repo doit (1) être inséré au bon endroit dans `#bibliotheque .biblio-grid` selon sa date, (2) recevoir ses `data-*` (type, themes, date, numero, search-text). Le `tools/seo_dossiers.py` peut éventuellement être étendu pour régénérer `data-search-text` à partir de l'`og:title` + `og:description` du hub, mais ce n'est pas dans le scope de cette refonte.

## Accessibilité

- Filter bar = `<form role="search" aria-label="Filtrer la bibliothèque">`.
- Recherche = `<input type="search" aria-label="…">` + placeholder.
- Chips Type = `<button role="radio" aria-checked>` regroupés dans `role="radiogroup" aria-label="Type d'artefact"`.
- Chips Thèmes = `<button role="checkbox" aria-checked>` regroupés dans `role="group" aria-label="Thèmes"`.
- Compteur = `aria-live="polite"` pour annoncer le nouveau total après filtre.
- Bouton « Voir plus » = bouton focusable standard.
- Empty state = visible (pas `display:none` mais attribut `hidden`) pour rester dans le flux a11y quand re-affiché.
- Navigation clavier : Tab parcourt search → chips Type → chips Thèmes → cartes → bouton Voir plus. Aucune trap.

## Mobile (< 768 px)

- Filter bar stack en colonne (search → type → thèmes → counter).
- Chips passent en row scrollable horizontalement (plutôt que wrap multi-ligne) pour éviter une filter bar de 200px de hauteur. Indication visuelle subtile : un fade gradient au bord droit pour suggérer le scroll.
- Sticky reste actif. `top: 56px` (la topbar mobile fait aussi 56px).
- `touch-action: pan-x` sur les chips containers pour éviter que le scroll horizontal des chips déclenche un scroll vertical de page.
- `overflow-x: hidden` sur `body` reste en place (déjà dans le boilerplate du repo).

## Migration

### Étapes

1. **Tagger les cartes** : ajouter `data-type`, `data-themes`, `data-date`, `data-numero`, `data-search-text` sur les 16 cartes existantes. Script Python idempotent dans `tools/tag_homepage_cards.py` qui parse les cartes via BeautifulSoup, infère ce qui peut l'être (`data-type` depuis `.serie-type.veille` vs absence, `data-numero` depuis `.serie-tag`, `data-date` depuis le mapping ci-dessus, `data-search-text` calculé), et applique les `data-themes` depuis un dict en tête de script. Re-runnable.
2. **Promouvoir 3 cartes featured** : Mathieu valide les 3 slugs. Le script duplique ces cartes dans une nouvelle section `#a-la-une`.
3. **Restructurer** : remplacer les sections `#series` et `#dossiers` par la nouvelle structure `#a-la-une` + `#bibliotheque`. Insérer les `<span id="series">` et `<span id="dossiers">` de compat.
4. **Injecter CSS** : nouvelles règles dans le `<style>` existant, regroupées sous un commentaire de section `/* ═════ BIBLIOTHÈQUE FILTRÉE ═════ */`.
5. **Injecter JS** : nouveau bloc `<script>` en bas, juste avant `</body>`.
6. **Mettre à jour les liens internes** : la topbar du hero (si elle pointe vers `#series`) → `#bibliotheque`. Vérifier les boutons « ← Retour aux dossiers » des hubs : ils pointent déjà vers `#series`, on les laisse tels quels (l'ancre de compat les redirige).

### Tests manuels

- Ouvrir la page : 3 cartes À la une visibles, 12 cartes dans la bibliothèque, bouton « Voir 4 de plus ».
- Cliquer un chip Type (ex. Veille) : seules les cartes Veille restent, compteur passe à `1 / 1`, bouton « Voir plus » disparaît.
- Cliquer un chip Thème (ex. Agentique) : 7 cartes restent (avec « Tous » Type), compteur `7 / 7`.
- Cliquer un 2e chip Thème (ex. Production) : OR logique → 9 cartes (7 + 3 - 1 chevauchement = 9), compteur ajusté.
- Taper dans la recherche : « eval » → cartes evaluation-agentique + observabilite-agents-ia (sub mentionne « évaluation »). Compteur en live.
- Combinaison : Type Étude + Thème Production + recherche « metrique » → résultat précis.
- Aucun résultat : empty state visible + bouton Réinitialiser fonctionnel.
- URL state : sélectionner Type=veille + Thème=gouvernance → URL devient `?type=veille&theme=gouvernance`. Recharger la page → filtres restaurés.
- Sticky : scroller dans la grille → la filter bar reste collée sous la topbar avec border-bottom apparente.
- Mobile (375px) : filter bar en colonne, chips scrollables, cartes en single column.
- Compatibilité ancres : ouvrir `https://mathieugug.github.io/#series` → scroll vers la bibliothèque (et pas une 404).

## Risques et points ouverts

1. **Sticky bar + cover SVG** : sur mobile, la filter bar sticky risque de cacher partiellement la première rangée de cartes au scroll. Mitigation : padding-top sur `.biblio-grid` + `scroll-margin-top: 140px` sur les cartes pour les ancrages éventuels.
2. **`overflow-x: hidden` du body et sticky** : le repo a déjà `html, body { overflow-x: hidden }`. La sticky bar fonctionne car aucun ancêtre scrollable n'est intercalé. À vérifier visuellement après migration.
3. **Performance JS** : 16 cartes aujourd'hui, 80 fin 2026. Filtrage en `O(n)` avec match substring sur ~200 chars/carte = négligeable (<1ms). Pas d'optimisation nécessaire.
4. **Ordre des thèmes** : actuellement listés dans l'ordre d'apparition fréquente (Agentique d'abord). Alternative : ordre alphabétique. Choix : ordre de fréquence — le visiteur trouve plus vite les thèmes les plus représentés.
5. **Initiale À la une** : 3 cartes proposées (`proces-musk-altman`, `evaluation-agentique`, `mcp-plateforme`). À confirmer par Mathieu lors de l'implémentation. Ce choix est purement éditorial et ne bloque pas l'architecture.

## Hors scope (changements futurs possibles)

- Filtre par format (App / Scrolly / Livre / Journal / Print).
- Filtre par année (quand 2027 arrive).
- Tri alternatif (par titre alpha, par nombre de sources, etc.).
- Mémorisation des préférences de filtre en `localStorage`.
- Vue liste compacte (toggle grille/liste).
- Recherche fuzzy ou avec mise en surbrillance des matches.
- Mini-TOC à côté de la grille.
- Génération automatique de `data-search-text` à partir des `og:title`/`og:description` des hubs.
