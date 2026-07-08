# Mobile-friendliness — checklist 7 points

Tout artefact (hub + format[s]) doit être lisible sur petit écran (320–414 px). 7 points à vérifier avant de merger, **sur device réel ou Chrome devtools en mode mobile** (pas "desktop site" — voir point 3 pour comprendre pourquoi "Desktop site" trompe).

---

## 1. `overflow-x` sur `html, body`

Règle défensive à placer en dehors de tout media query :

```css
html, body { margin: 0; padding: 0; max-width: 100vw; }
body { overflow-x: hidden; }
.layout { overflow-x: clip; }
```

`overflow-x: clip` sur `.layout` seul n'est **pas** suffisant quand un élément en `position: absolute` (par exemple le bouton `#sources-expand-btn`) vit en dehors de la grille `.layout` — ce dernier s'échappe du conteneur et peut créer un scroll horizontal. La règle `body { overflow-x: hidden }` est la ceinture qui complète les bretelles de `.layout`.

**Cas particulier — scrolly avec `position: sticky`** : sur les pages qui utilisent un élément `position: sticky` pour pinner un bloc pendant un long scroll (un panneau ou une colonne fixe), `overflow-x: hidden` sur `html` ou `body` casse le sticky — le body devient un scroll container et l'élément sticky n'a plus la viewport comme ancrage, il défile avec le contenu. Utiliser `overflow-x: clip` à la place sur `html, body` (avec `overflow-x: hidden` déclaré juste avant comme fallback pour Safari < 16 qui ne supporte pas `clip`) :

```css
html, body { overflow-x: hidden; } /* fallback Safari < 16 */
html, body { overflow-x: clip; }   /* clip ne crée pas de scroll container */
```

`clip` coupe le dépassement sans établir de scroll container, l'élément sticky retrouve alors la viewport comme ancrage.

Protection défensive, pas une excuse pour laisser passer un vrai dépassement — toujours investiguer la cause racine.

---

## 2. Topbar fixe responsive

La topbar (voir `references/topbar.md` pour le pattern complet) doit rester lisible sur les petits écrans.

Sous `@media (max-width: 560px)` :

```css
.topbar { padding: 12px 16px; }
.topbar a:first-child { font-size: 14px; }
.back-nav a { font-size: 9px; letter-spacing: 0.16em; }
```

Sous `@media (max-width: 380px)` : masquer `<em>Guglielmino</em>` (ou l'élément secondaire de l'identité gauche) :

```css
.topbar a:first-child em { display: none; }
```

Sans cette règle, les deux zones gauche/droite se chevauchent sur les très petits écrans (iPhone SE, Galaxy A03, etc.).

---

## 3. Apps `header.site` + `main#report` — typographie mobile dans le **même** `@media (max-width: 1024px)`

La typographie mobile de `header.site` et `main#report` **doit vivre dans le même `@media (max-width: 1024px)`** que l'effondrement de `.layout` en colonne unique.

Raison pivot : Chrome en mode "Desktop site" sur Android/iOS reporte une viewport ≥ 980 px. Un `@media (max-width: 640px)` séparé ne se déclenche jamais dans ce mode — le rapport reste à la taille desktop et devient illisible sur mobile. En regroupant tout dans `@1024px`, les règles se déclenchent même en mode "Desktop site".

```css
@media (max-width: 1024px) {
  .layout { grid-template-columns: minmax(0, 1fr); }

  header.site { padding: 14px 16px; gap: 10px; flex-wrap: wrap; }
  header.site h1 { font-size: 1.05rem; min-width: 0; overflow-wrap: break-word; word-break: break-word; }
  header.site .back { font-size: 0.7rem; letter-spacing: 0.08em; }

  main#report { padding: 28px 18px 56px; max-width: 100%; min-width: 0; }
  main h1.report-title { font-size: 1.8rem; word-break: break-word; }
  main#report > .lead { font-size: 1.02rem; }
  main h2 { font-size: 1.25rem; word-break: break-word; }
  main h3 { font-size: 1.05rem; }
  main p, main ul, main ol { overflow-wrap: break-word; word-break: break-word; }

  .figure { max-width: 100%; overflow: hidden; }
  .figure svg { width: 100%; max-width: 100%; height: auto; }
}
```

Doubler aussi avec `html, body { max-width: 100vw }` en dehors du media query (point 1 ci-dessus).

---

## 4. Schémas SVG

Sur le `<svg>` lui-même :

```css
.figure svg { width: 100%; height: auto; max-width: 100%; }
```

Toujours fournir le bouton de zoom plein écran (`⛶`). Sur mobile, un schéma rendu à 320 px de large devient illisible — le zoom est l'échappatoire obligatoire. Le zoom est fourni automatiquement par `/assets/dossier-app.js` (apps deep-research) ou par une IIFE locale `setupZoom()` (autres formats).

---

## 5. Sidebars `panel-close` (mobile)

Le pattern complet (CSS + HTML + JS avec yield Escape sur zoom/modal) vit dans `references/sidebars.md` § "Pattern `panel-close` (mobile)".

---

## 6. `<pre>` et `<code>` inline — overflow contrôlé

Un `<pre>` sans contrainte pousse la page plus large que la viewport sur mobile (formules longues, JSON, prompts XML, pseudocode). Trois règles obligatoires à embarquer dans chaque app, même si le contenu actuel n'a pas de `<pre>` — la prochaine itération en aura :

```css
main code {
  overflow-wrap: anywhere; /* casse les longs identifiants/URLs inline sans espace */
  /* + styles inline code existants */
}

main pre {
  margin: 1.5rem 0;
  padding: 14px 16px;
  background: var(--paper-2);
  border-radius: 4px;
  overflow-x: auto;
  max-width: 100%;
  font-size: 0.85em;
  line-height: 1.5;
  -webkit-overflow-scrolling: touch;
}

main pre code {
  background: transparent;
  padding: 0;
  border-radius: 0;
  font-size: 1em;
  overflow-wrap: normal; /* override du rule parent — préserve les sauts de ligne du <pre> et maintient l'ascenseur horizontal */
}
```

L'override `overflow-wrap: normal` sur `pre code` est le subtil : sans lui, la règle `anywhere` héritée de `main code` casse chaque longue ligne dans le `<pre>`, fait disparaître l'ascenseur horizontal (le contenu n'est plus plus large que la viewport), et le bloc devient un bloc illisible.

---

## 7. Tableaux `<table>` — overflow contrôlé

Un `<table>` avec `width: 100%` ne se réduit pas en dessous de la largeur naturelle de ses colonnes. Sur mobile, les cellules débordent et la dernière colonne est tronquée à droite (invisible, pas scrollable). Pattern obligatoire à embarquer dans le `@media (max-width: 1024px)` aux côtés des règles `<pre>`, même sans tableau présent :

```css
main table {
  display: block;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
main th, main td { white-space: normal; }
```

Mécanique : `display: block` sur le `<table>` génère une table anonyme à l'intérieur qui se dimensionne à son contenu naturel ; combiné à `overflow-x: auto`, le débordement devient un scroll horizontal plutôt qu'une troncature silencieuse.
