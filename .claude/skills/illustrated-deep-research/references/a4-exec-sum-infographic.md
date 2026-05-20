# A4 exec sum visuelle — pattern infographie portrait

Un format **distinct des SVG narratifs** : une infographie A4 portrait, lisible en un coup d'œil, qui condense un dossier deep research en **5 modèles mentaux** (ou « clés de lecture »). Pensée pour partage RDV / pitch / impression A4.

C'est le **fig-00** d'une app dossier — injectée juste après la `<ul>` de la synthèse exécutive, suivie d'un `<hr>` de séparation. Pas un schéma narratif numéroté, c'est la **synthèse visuelle de tout le rapport**.

## Quand l'embarquer

À envisager dès qu'un dossier deep-research :
- a 5+ messages-clés bien distillables dans la synthèse exécutive (un rapport tech ou stratégique typique)
- mérite d'être imprimé / partagé hors-écran (entretien, off-site, brief client)
- bénéficie d'un point d'entrée visuel rapide pour le lecteur pressé

Pas systématique. Si un dossier n'a que 3-4 messages forts ou si sa structure est intrinsèquement scrollytelling (cf. `proces-musk-altman` veille), skipper.

## Spec technique

- **viewBox** : `0 0 840 1188` (ratio A4 portrait, 1:√2)
- **Fichier** : `{dossier}/images/{YYYYMMDD}-00-exec-sum-a4.svg` (le suffix `-00-` signale la synthèse, distinguée du `-01-`, `-02-`… des schémas narratifs)
- **Background** : `<rect width="840" height="1188" fill="#faf6ec"/>` (paper du site)
- **Marges éditoriales** : x=60 à x=780 utiles. Header bandeau y=0-148. Bloc unifié 60 de marge gauche + 40 marge droite (pour l'œil), parfois étendu jusqu'à x=720 pour les bar charts.
- **Polices déclarées dans `<defs><style>`** :
  ```svg
  <style>
    .display { font-family: 'Fraunces', 'Spectral', Georgia, serif; }
    .body    { font-family: 'Inter', system-ui, sans-serif; }
    .mono    { font-family: 'JetBrains Mono', 'Courier New', monospace; }
  </style>
  ```

## Anatomie

```
┌─────────────────────────────────────────────────────────────────┐
│  EYEBROW · DATE  (mono carmin, ls 0.20em)        Exergue + attr │ y=56
│                                                                 │
│  Titre punchline éditorial.                                     │ y=100
│  Sublede italic en complément.                                  │ y=128
│  ──────────────────────────────────────────────────────         │ y=148
│                                                                 │
│  ① BLOC 01 — EYEBROW · titre punchline                          │ y=184+
│     [visuel : timeline / bar chart / cards…]                    │
│                                                                 │
│  ② BLOC 02 — EYEBROW · titre                                    │
│     [visuel]                                                    │
│                                                                 │
│  ③ BLOC 03                                                      │
│  ④ BLOC 04                                                      │
│  ⑤ BLOC 05  (souvent punchline one-liner ou mini-cards)         │
│                                                                 │
│  ──────────────────────────────────────────────────────         │ y=1112
│  MATHIEU GUGLIELMINO · URL DOSSIER         A4 · SYNTHÈSE        │ y=1138
└─────────────────────────────────────────────────────────────────┘
```

### Header (y=0-148)

**Eyebrow + date** (left, y=56) :
```svg
<text x="60" y="56" class="mono" font-size="12" font-weight="600" fill="#a83e55" letter-spacing="0.20em">DOSSIER · DATE</text>
```

**Exergue optionnel** (right, same y=56) — citation italic + attribution mono :
```svg
<text x="780" y="56" class="display" font-size="10" font-style="italic" fill="#9a9ca5" text-anchor="end">« citation »<tspan font-family="'JetBrains Mono', monospace" font-style="normal" font-size="7.5" letter-spacing="0.12em">  — AUTEUR</tspan></text>
```

**Titre punchline** (y=100, display 32 600) :
> Le H1 est un **message éditorial utile**, pas un méta-label. Pas « 5 modèles mentaux à retenir », plutôt « Modèle banalisé, harness différenciant. » ou « La trace devient le produit. ». La phrase doit pouvoir être lue isolément et **emporter** l'idée du dossier.

**Sublede** (y=128, display 15 italic gris ink-mid) : développe le titre en 1 phrase, sans le redire.

**Séparateur** (y=148) : ligne horizontale 1px `rgba(30,30,42,0.16)`.

### Bloc-message (chaque ×5)

Structure répétée pour les 5 blocs :
- **Cercle marqueur** : `<circle cx="84" r="20" fill="none" stroke="#COLOR" stroke-width="1.5"/>` + nombre `01`-`05` en mono 15pt 600 centré dedans
- **Eyebrow bloc** : mono 11pt 600 letter-spacing 0.14em, couleur du bloc (carmin / teal / vert / gold / carmin alternés typiquement)
- **Titre bloc** : display 19pt 600, ink — pose la punchline du modèle mental
- **Visuel** : un des patterns ci-dessous

### Footer (y=1112-1138)

```svg
<line x1="60" y1="1112" x2="780" y2="1112" stroke="rgba(30,30,42,0.16)" stroke-width="0.5"/>
<text x="60" y="1138" class="mono" font-size="9" fill="#9a9ca5" letter-spacing="0.18em">MATHIEU GUGLIELMINO · MATHIEUGUG.GITHUB.IO/{SLUG}</text>
<text x="780" y="1138" class="mono" font-size="9" fill="#9a9ca5" letter-spacing="0.14em" text-anchor="end">A4 · SYNTHÈSE EXÉCUTIVE</text>
```

## Bibliothèque de patterns visuels (par bloc)

Selon le contenu à exprimer, piocher dans cette liste — chaque pattern est testé sur la série batch1.

### Timeline 3-cards (saturation ascendante)
Pour exprimer une **évolution temporelle** : 3 cards horizontales reliées par une ligne dashed + flèches `marker-end`, saturation du fill croissante (0.04 → 0.10 → 0.20). Chaque card structure : eyebrow mono + titre display + 3 lignes de spécif (Contexte / Boucle / Livrable ou équivalent) + italic verbe-résumé final. **Padding bas obligatoire** : laisser ≥7px entre la dernière ligne (italic) et le bord du rect. Cas : `coding-agents` bloc 01.

### Bar chart avec axe Y (obligatoire)
Pour exprimer un **gradient mesuré** (scores, %, $) :
- Axe Y obligatoire avec labels mono 8pt aux paliers (`100`, `50`, `0` typiquement)
- Grid lines pointillés `stroke="rgba(30,30,42,0.10)" stroke-dasharray="2,3"` aux paliers
- Barres `fill-opacity` 0.20-0.45, stroke 0.75
- Label valeur en mono 10pt au-dessus de chaque barre
- Label catégorie en body 9.5pt sous la barre
- Pour comparaisons multi-providers : ligne mono caps sub-label fine (`OPENAI`, `CONVERGENCE AI`) sous le label catégorie
- Ligne de seuil viable possible : `stroke="#a83e55" stroke-dasharray="4,3"` + petit label droite

Cas : `harness-agentique` SWE-bench, `evaluation-agentique` pass^k, `surfaces-agentiques` double bascule, `observabilite-agents-ia` volume télémétrique.

### Hub orbital
Un **nœud central** + 3-4 satellites. Pour exprimer une stack centrée sur un acteur (l'agent runtime au milieu, MCP/A2A/AG-UI autour). Centre = cercle avec eyebrow mono interne. Périphériques = rects avec titre mono + descripteur body + caption italic. **Flèches partent du périmètre du cercle**, pas du centre (cf. règle CLAUDE.md sur l'origine des flèches). Cas : `surfaces-agentiques` bloc 03.

### Bus / pipeline (sources → collecteur → backends)
Pour exprimer un **flux N→1→M** : colonne de sources à gauche, hub central (souvent en accent carmin), backends à droite. Flèches `marker-end` reliant les niveaux. Cas : `observabilite-agents-ia` bloc 03 (bus OTel).

### Pyramide / hiérarchie d'usages
Pour exprimer une **stratification verticale** : `<polygon>` ou `<path>` formant une silhouette trapézoïdale, dividers horizontaux dashed entre les étages, saturation décroissante du sommet à la base (ou inverse selon le sens). **Garder la métaphore visuelle** — ne pas la dégrader en bandes horizontales empilées (cf. feedback v1 sur coding-agents v1). Cas : `coding-agents` bloc 04.

### Stacked layers (gruyère / sécurité industrielle)
Pour exprimer **plusieurs couches imparfaites dont l'empilement couvre** (model gruyère d'Anthropic, defense-in-depth) :
- 5-7 barres horizontales empilées, h=10 (pas plus), gap 13px entre starts
- Width modéré (200px, pas 320 — risque de sembler trop wide visuellement)
- Petits cercles `fill="#faf6ec"` aléatoirement placés sur chaque barre (les « trous » du gruyère)
- Label texte à droite de chaque barre (x=212, y=9 dans le groupe local)
- Side punchline display 14 600 à la droite extrême

**Anti-pattern** : barres trop wide → impression d'espace mort. Compacter horizontalement, étiquettes collées.

Cas : `evaluation-agentique` bloc 04 (gruyère).

### 4 régimes empilés par autonomie
Pour exprimer une **gradation d'autonomie / autorité** :
- 4 rects empilés verticalement, full-width (jusqu'à x=720 pour absorber le contenu)
- Saturation décroissante du haut au bas (régime le plus avancé en haut, saturé)
- Texte structuré dans chaque rect : `NN · Nom-du-régime` à gauche, italic exemples au milieu, mono `→ ce qui est cédé` à droite, le tout sur la même ligne

**Anti-pattern v1** : ajouter une colonne "CÈDE" externe à droite → overlap garanti avec les exemples italic. Intégrer la cède **dans** le rect.

Cas : `surfaces-agentiques` bloc 01 (pile 4 régimes).

### Cards row (3 ou 5 mini-cards horizontales)
Pour exprimer une **typologie homogène** (3 paliers de coût, 5 niveaux d'autonomie, etc.) :
- N cards de même largeur, gap 7-10px entre
- Saturation gradient en cohérence avec un axe sémantique (faible → fort)
- Eyebrow mono caps centré + titre display centré + italic body descripteur centré
- Hauteur 22-62 selon densité

Cas : `surfaces-agentiques` bloc 05 (5 niveaux Knight), `observabilite-agents-ia` bloc 05 (5 niveaux maturité), `harness-agentique` bloc 04 (3 paliers coûts).

### Grille pillars 3×2 (ou 2×N)
Pour exprimer **N piliers** :
- Grille de cards, 2 lignes × 3 colonnes par exemple, w=225 h=48 chacune
- Saturation différente par ligne (top ligne plus claire, bottom plus saturée) pour rythme
- **KPI badge en haut-droite** de chaque card (right-aligned mono 8pt 600 opacity 0.65, en couleur du bloc) — donne une métrique opérationnelle représentative au coup d'œil
- Body label body 10pt à y=36

Cas : `observabilite-agents-ia` bloc 02 (6 piliers + KPI badges).

### Verrou + clé
Pour une **échelle de maturité avec étapes de transition** :
- N cards mini (ex. 5 niveaux N1→N5)
- Une card est marquée **verrou** (stroke épais, fill plus saturé, marqueur explicite « — verrou » dans le label)
- Chaque card embarque une ligne `CLÉ · {action}` en mono carmin sous un divider — indique ce qu'il faut faire pour atteindre/maintenir ce niveau

Cas : `observabilite-agents-ia` bloc 05.

### Verdict / exergue dashed
Pour clore une démonstration ou opposer un **verdict** à des griefs : un rect avec `stroke-dasharray="4,3"`, fill très transparent, accent carmin, texte centré. Pose la conclusion à la suite des items qui l'ont menée.

Cas : `surfaces-agentiques` bloc 02 (verdict du procès du chatbot).

### Pictogrammes inline / watermarks
Pour donner un **signal visuel rapide** sur le sens d'une card sans encombrer le texte :
- Icônes simples monoline (fenêtre, flèche brisée, bulle de parole, marteau…)
- **Placement watermark obligatoire si présent en présence de texte serré** : bas-droite de la card, `scale(1.6-2.0)`, `opacity="0.15-0.20"`. Devient un fond décoratif qui suggère sans concurrencer.
- **Anti-pattern** : icône top-right en pleine opacité → chevauche l'eyebrow text (cf. feedback v2 sur surfaces bloc 02). Always go watermark si on n'a pas la place dédiée.

Cas : `surfaces-agentiques` bloc 02.

### Cross-links cliquables vers d'autres dossiers
Pour renvoyer le lecteur vers un dossier connexe (« voir aussi /coding-agents · /agent-sdk ») :
- Wrapper SVG `<a href="../../slug/" target="_top">` autour d'un `<tspan>` à l'intérieur d'un `<text>`
- Ajouter `text-decoration="underline"` au tspan pour le signal visuel
- Le lien est actif quand le SVG est ouvert en standalone (cliquer sur la figure dans l'app dossier → ouvre la SVG → liens cliquables)

Syntaxe :
```svg
<text x="0" y="160" class="body" font-size="9.5" font-style="italic" fill="#6b6f7c">
  Voir aussi :
  <a href="../../coding-agents/" target="_top"><tspan font-weight="600" fill="#a83e55" text-decoration="underline">/coding-agents</tspan></a>
  ·
  <a href="../../agent-sdk/" target="_top"><tspan font-weight="600" fill="#a83e55" text-decoration="underline">/agent-sdk</tspan></a>
</text>
```

Cas : `harness-agentique` bloc 01.

## Palette éditoriale (par bloc)

Alterner les 5 couleurs pour rythmer la lecture verticale :
- **Carmin** `#a83e55` — accent principal, bloc 01 et 05 (encadrement narratif)
- **Teal** `#1F5560` — accent froid analytique, bloc 02 ou 03
- **Vert** `#2F5D3F` — accent organique/écosystème, bloc 03 ou 04
- **Gold** `#B58A2C` — accent économie/mesure, bloc 04
- **Ink** `#1e1e2a`, **Ink-mid** `#6b6f7c`, **Mist** `#9a9ca5` — pour textes
- **Paper** `#faf6ec` — fond

Schéma typique : carmin (01) → teal (02) → vert (03) → gold (04) → carmin (05) — bookend en carmin pour ouvrir/fermer.

## Typographie

- **Title H1** : display Fraunces 32pt 600 (la punchline éditoriale)
- **Sublede** : display 15pt italic, ink-mid
- **Eyebrow page** : mono 12pt 600, carmin, letter-spacing 0.20em
- **Eyebrow bloc** : mono 11pt 600, couleur du bloc, letter-spacing 0.14em (réduire à 0.10-0.12em si dépassement)
- **Titre bloc** : display 19pt 600, ink
- **Body content** : Inter 10-11pt
- **Annotation italic** : body 9.5-10pt italic, ink-mid ou mist
- **Marqueurs numérotés** : mono 15pt 600 dans cercles bordés
- **Mono caps badges** : 8-9pt 600, letter-spacing 0.10-0.14em

## Anti-patterns observés

- **H1 méta-structure** : `« Cinq modèles mentaux à retenir »` est un label de construction, pas un message. À bannir. Le H1 doit être une **phrase utile** qui emporte l'idée. Donc « Modèle banalisé, harness différenciant. » plutôt que « 5 modèles mentaux ».
- **Eyebrow trop long** : `« RUPTURE 2 · GÉNÉRATION + RETRIEVAL »` (35 chars) dépasse le rect 230px à letter-spacing 0.14em + mono 9pt. Garder ≤ 30 chars ou réduire letter-spacing à 0.10-0.12em. Préférer les acronymes reconnus (`RAG` plutôt que `RETRIEVAL`).
- **Padding bas trop tendu** : texte italic à 2-3px du rect bottom = sensation d'encombrement. Garder ≥7px de respiration.
- **Layers trop wides** (gruyère) : barres à 320px de large avec étiquettes loin à droite = espace mort horizontal. Compacter à 200px max, étiquettes à x=212.
- **Icônes top-right en pleine opacité** : chevauchent l'eyebrow. Toujours en watermark bas-droit, opacity 0.15-0.20.
- **Side panel CÈDE externe** sur layout 4-régimes : overlap garanti. Intégrer la cède **dans** le rect.
- **Flèche partant du centre d'un cercle** : la flèche traverse la forme. Partir du **périmètre** dans la direction de la cible. Cas vu sur le hub orbital `surfaces-agentiques`.
- **`<em>` dans `<text>` SVG** : illégal. Utiliser `<tspan font-style="italic">`.

## Injection dans l'app dossier

### CSS — bloc à coller à la fin du `<style>` du `<head>`

```css
/* === infographie A4 portrait (exec sum visuelle) — pattern partagé === */
main .figure.figure--portrait,
.layout main .figure.figure--portrait,
.layout.sources-collapsed main .figure.figure--portrait {
  margin-top: 3rem; margin-bottom: 3rem;
  padding: 0 !important; border: none !important;
  border-top: none !important; border-bottom: none !important;
  width: auto;
}
@media (max-width: 1024px) {
  main .figure.figure--portrait {
    margin-left: auto !important; margin-right: auto !important;
    max-width: 100%;
  }
}
@media (min-width: 1025px) {
  main .figure.figure--portrait,
  .layout main .figure.figure--portrait,
  .layout.sources-collapsed main .figure.figure--portrait {
    margin-left: -60px !important; margin-right: -60px !important;
    max-width: calc(100% + 120px);
  }
}
@media (min-width: 1440px) {
  main .figure.figure--portrait,
  .layout main .figure.figure--portrait,
  .layout.sources-collapsed main .figure.figure--portrait {
    margin-left: -100px !important; margin-right: -100px !important;
    max-width: calc(100% + 200px);
  }
}
main .figure--portrait .figure-portrait-link { display: block; width: 100%; border: 1px solid var(--rule); background: var(--paper); border-radius: 2px; cursor: zoom-in; transition: box-shadow 220ms ease, border-color 220ms ease; overflow: hidden; }
main .figure--portrait .figure-portrait-link:hover { box-shadow: 0 8px 28px rgba(30,30,42,0.14); border-color: var(--accent); }
main .figure--portrait img { display: block; width: 100%; height: auto; }
main .figure--portrait .figure-caption { max-width: 100%; margin: 14px auto 0; padding: 0 8px; text-align: center; }
```

### HTML — bloc à injecter juste après le `</ul>` de la synthèse exécutive

```html
<figure class="figure figure--portrait" id="fig-00">
  <a class="figure-portrait-link" href="images/{YYYYMMDD}-00-exec-sum-a4.svg" target="_blank" rel="noopener" title="Ouvrir l'infographie A4 en taille réelle / pour impression">
    <img src="images/{YYYYMMDD}-00-exec-sum-a4.svg" alt="Infographie A4 — {titre punchline du dossier} (synthèse visuelle)" loading="lazy">
  </a>
  <figcaption class="figure-caption">Synthèse visuelle A4 — cinq clés du dossier, en un seul coup d'œil. Cliquer pour ouvrir en plein écran et imprimer.</figcaption>
</figure>
<hr style="border:none;border-top:1px solid var(--rule);margin:3rem 0;">
```

L'`<a class="figure-portrait-link" target="_blank">` est ce qui rend la SVG ouvrable en standalone (et donc les `<a>` cliquables internes du SVG fonctionnels).

## Checklist de validation avant commit

- [ ] viewBox `0 0 840 1188`
- [ ] Background `#faf6ec`
- [ ] H1 = message éditorial utile (pas méta-label)
- [ ] Sublede italic complémentaire (≠ paraphrase du H1)
- [ ] 5 blocs numérotés `01`-`05`
- [ ] Bar charts avec axe Y + grid dashed
- [ ] Pas d'`<em>` dans `<text>` (uniquement `<tspan font-style="italic">`)
- [ ] Entités échappées : `&amp;`, `&lt;`, `&gt;` dans textes et attributs
- [ ] Texte ne déborde aucun rect (vérifier les eyebrow longs + titres display)
- [ ] Padding bas ≥7px sur cards avec texte italic en pied
- [ ] Icônes en watermark si présents en zone texte serrée (opacity 0.15-0.20)
- [ ] Flèches partent du périmètre des formes, pas du centre
- [ ] Footer brand + label A4 présent
- [ ] Cross-links éventuels en SVG `<a href="../../slug/" target="_top">`
- [ ] XML valide : `python -c "import xml.etree.ElementTree as ET; ET.parse(open('path/to.svg', encoding='utf-8'))"` passe
- [ ] CSS injecté à la fin du `<style>` de l'app HTML
- [ ] Figure HTML injecté après le `</ul>` de la synthèse exécutive
- [ ] Filename `images/{YYYYMMDD}-00-exec-sum-a4.svg` (le `-00-` signale la synthèse)

## Cas de référence

- `harness-agentique/images/20260429-00-exec-sum-a4.svg` — bar chart + anatomie 7 couches + 3 paliers cards + cross-links + exergue
- `coding-agents/images/20260512-00-exec-sum-a4.svg` — timeline 3-cards + grille 6 rouages + substrats dashed + pyramide + punchline gains
- `evaluation-agentique/images/20260501-00-exec-sum-a4.svg` — timeline 3-cards + bar chart pass^k + grader boxes + biais dashed + gruyère stacked layers + punchline
- `observabilite-agents-ia/images/20260430-00-exec-sum-a4.svg` — 4 ères empilées + bar chart volume + pillars 3×2 + KPI badges + bus + 5 niveaux verrou + clés
- `surfaces-agentiques/images/20260518-00-exec-sum-a4.svg` — 4 régimes empilés + 3 griefs cards + verdict dashed + icônes watermark + hub orbital MCP/A2A/AG-UI + 2 bar charts (coût + précision GUI avec providers) + 5 niveaux cards
