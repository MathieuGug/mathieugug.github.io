# Topbar des pages internes — pattern 3 items

Toutes les pages **internes** d'un dossier (apps, slideshows, journal, scrollies, livre) embarquent une topbar sticky uniforme à 3 zones :

```
[Identité]    [titre du dossier (mono caps)]    [← Hub  ·  Accueil]
```

- **Gauche** : `<a href="../index.html">{Prénom} <em>{Nom}</em></a>` — identité + lien accueil. L'`<em>` se masque sous 380 px pour éviter le chevauchement sur iPhone SE.
- **Milieu** : `<span class="dossier-context">{titre}</span>` — mono caps, `opacity: 0.55`, `max-width: 320px` avec ellipsis. **Masqué sous 768 px.** Le titre vient de l'`og:title` du hub (`*/index.html`), suffixe `— N formats / — étude / — comprendre les enjeux` retiré pour la forme courte.
- **Droite** : `<nav class="back-nav" aria-label="Navigation retour">` à 2 liens — `← Hub` (→ `index.html` du dossier) et `Accueil` (→ `../index.html#series`), séparés par `<span class="back-sep" aria-hidden="true">·</span>`. Le `←` arrow n'est que sur "Hub" pour différencier visuellement le retour proche du retour lointain. `title=` donne la version longue ("Revenir au hub du dossier" / "Revenir à l'accueil").

**Hubs ≠ pages internes** : les hubs `*/index.html` gardent leur topbar à 2 items (identité + `← Retour aux dossiers`) — ils SONT le hub, pas besoin du lien `← Hub`. La grille de l'accueil garde aussi sa topbar à 2 items.

---

## Constantes structurelles

- **Hauteur** : 56 px partout (`height: 56px`, `padding: 12px 28px`)
- **Z-index** : 60 par défaut ; peut monter à 70 sur un livre interactif (au-dessus d'un `.toc-toggle`), ou à 99 sur un scrolly qui a un `#progress` à 100 (sous le progress)
- **Background** : `rgba(<paper>, 0.82–0.85)` + `backdrop-filter: blur(10px)` — fond légèrement transparent avec flou
- **Apps `header.site`** : la topbar est injectée AVANT la `.layout` (pas dedans), `body { padding-top: 56px }` libère la place. L'ancien lien `.back` du `<header class="site">` est retiré quand la topbar prend le relais.

---

## Ajustements obligatoires sur les sticky/fixed adjacents

Toute page qui ajoute la topbar **doit** aussi ajuster ses éléments sticky/fixed pour ne pas être recouverts ou décalés par les 56 px de la topbar.

**Apps (panneaux TOC et Sources)** : passer de `top: 0; height: 100vh` à `top: 56px; height: calc(100vh - 56px)`. Les deux variants CSS multi-ligne et single-line coexistent selon les apps — adapter en conséquence.

**Scrolly avec élément `position: sticky`** : l'élément pinné doit passer à `top: 56px; height: calc(100vh - 56px)` (ou `100dvh` en doublon pour les navigateurs récents) — sinon la topbar recouvre le haut de l'élément pendant le scroll.

**Livre interactif** : la scène `.stage` passe à `top: 56px; height: calc(100vh - 56px)` pour que le livre vive sous la topbar. Le bouton Sommaire du livre descend d'autant pour rester accessible.

**Scrolly avec marqueur éditorial** : si un `#marker` ou élément d'identité existant remplit la même fonction que la topbar, le retirer pour éviter la redondance.

---

## Vars CSS adaptatives selon le format hôte

Chaque format a son propre système de variables. Le bloc CSS de la topbar doit respecter la convention locale plutôt que d'introduire des valeurs hardcodées :

**Apps deep-research** : utilisent typiquement `var(--ink)`, `var(--carmine)`, `var(--graphite)`, `var(--mono)`, `var(--serif)`, `var(--rule)`.

**Slideshows, journal, scrolly narratif** : utilisent typiquement `var(--text)`, `var(--accent)`, `var(--text-mid)`, `var(--text-faint)`, `var(--line)` + les polices `'Fraunces', serif` et `'JetBrains Mono', monospace` hardcodées si pas de variable.

**Livre interactif** : utilise typiquement `var(--ink)`, `var(--ink-2)`, `var(--accent)` (pas de `--carmine`).

**Scrolly gouvernance** ou pages avec une masthead existante : restructurer la masthead existante en pattern topbar (en conservant ses sélecteurs pour ne pas casser le style éditorial) plutôt que d'ajouter une `.topbar` parallèle.

---

## Pages hors scope (pas de topbar, intentionnel)

Certaines pages n'embarquent pas la topbar :

- **Versions imprimables** (`*-print.html`) — la navigation est hors de propos pour l'impression.
- **Pitches internes ou slides non liés à un hub public** — ces pages ont un contexte de diffusion différent, la topbar de navigation de site n'est pas pertinente.

---

## Automatisation (optionnelle)

Pour un repo qui héberge plusieurs dossiers et veut industrialiser l'injection, deux types de scripts idempotents sont utiles (à écrire selon le contexte) :

- **Injecteur de topbar** — pour les apps `header.site` qui n'en ont pas : injecte le bloc CSS + le HTML, ajuste `#toc`/`#sources` sticky (`top: 56px; height: calc(100vh - 56px)`), retire l'ancien lien `.back` du `<header class="site">` s'il existe.
- **Injecteur de titre** — ajoute le `<span class="dossier-context">` à toute page qui a déjà une topbar, en lisant l'`og:title` du hub correspondant.

Pour les scrollies, livres et pages narratives qui ont leur propre masthead : edits manuels ciblés (chaque page a sa structure spécifique). À chaque nouvelle page interne, embarquer le pattern dès la rédaction — ne pas reporter à plus tard, sinon il faudra un script d'injection rétroactif.
