# *La fabrique d'un agent* — Plan d'implémentation phase 1 (rapport markdown)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produire la **phase 1** du dossier *La fabrique d'un agent* : 12 schémas SVG + rapport markdown ~10 000 mots + hub HTML + tuile racine + SEO + PR. Phases 2 (app illustrée) et 3 (scrolly) hors scope ici.

**Architecture:** Un dossier `fabrique-agent/` autonome dans le repo `mathieugug.github.io`. Le rapport est un livre long-format en markdown, qui est servi tel quel (via le pattern admin), et qui posera la base pour les phases 2 et 3 qui en dériveront. Production stage-by-stage : pour chaque stade, on produit d'abord ses schémas SVG, puis on rédige la prose qui les enveloppe.

**Tech Stack:** HTML/CSS/JS vanille · Markdown (extensions Obsidian-like : `==text==`, callouts `[!pm]/[!builder]/[!decideur]/[!scene]/[!antipattern]`, `[!1300]`) · SVG inline (convention typo `coding-agents`) · Python tools du repo (`tools/seo_dossiers.py`, `tools/og-card.py` invoqué automatiquement) · MCP GitHub pour la PR.

**Spec source** : `docs/superpowers/specs/2026-05-15-fabrique-agent-design.md` — référence canonique en cas de doute sur un détail.

---

## Pré-requis et conventions

- **Branche de travail** : `claude/fabrique-agent` (déjà créée depuis main, contient le spec déjà commité).
- **Pas de push automatique.** À la fin de chaque tâche, le commit reste local. Le push se fait en Task 25 dans le cadre de la PR.
- **Pas de mention Lincoln** ailleurs qu'au footer du site (jamais dans hero/headers/sources/READMEs).
- **Pas de client interne nommé**, jamais.
- **Disclosure IA** : mention discrète en footer du rapport.
- **Convention typo des schémas** (cf. CLAUDE.md, dérivée de `coding-agents/`) :
  - Title : `.display` 28pt 600 weight letter-spacing -0.01em
  - Subtitle : `.display` 18pt 400 italic
  - Body label : `.body` 15pt 500 weight
  - Annotation : `.body` 13pt
  - Caption / source : `.body` 12pt italic
  - Numeric callout : `.mono` 15pt 500 weight
  - Marker (numéro/lettre) : `.mono` 12pt 600 weight
  - Schema marker (SCHÉMA NN) : `.mono` 12pt 600 weight letter-spacing 0.16em CARMINE
- **Règles flèches** : laisser ≥ 12px entre la pointe de flèche et le bord cible ; partir du périmètre des cercles (pas du centre) ; centrer sur le milieu horizontal des boîtes cibles.
- **Validation XML** des SVG avant chaque commit (script donné en Task 4).
- **Échappement** : `&` → `&amp;`, `<` dans texte (mais pas balises) → `&lt;`, idem `>` → `&gt;`. Apostrophes françaises dans des chaînes JS futures : `\'` (mais pas pertinent pour la phase 1 qui n'a pas de JS).

---

## Task 1 : Pré-flight et scaffolding du dossier

**Files:**
- Verify: branch `claude/fabrique-agent` is current
- Create: `fabrique-agent/` (directory)
- Create: `fabrique-agent/images/` (directory)

- [ ] **Step 1 : Vérifier qu'on est sur la bonne branche**

```bash
git branch --show-current
```
Expected output: `claude/fabrique-agent`. Si ce n'est pas le cas : `git switch claude/fabrique-agent`.

- [ ] **Step 2 : Créer la structure du dossier**

```bash
mkdir -p fabrique-agent/images
```

- [ ] **Step 3 : Vérifier que le dossier est bien créé**

```bash
ls -la fabrique-agent/
```
Expected: `images/` présent.

- [ ] **Step 4 : Pas de commit à ce stade.** Le scaffolding sera commité avec la première substance (Task 2).

---

## Task 2 : Hub `fabrique-agent/index.html`

**Files:**
- Create: `fabrique-agent/index.html`

**Pattern de référence à imiter** : `evaluation-agentique/index.html`, `harness-agentique/index.html`, `coding-agents/index.html`. À ce stade, le hub n'a qu'**une seule carte** (le rapport markdown), classée `format--admin` car les rapports md sont masqués hors mode admin (cf. CLAUDE.md, easter egg `Ctrl/Cmd + Alt + M`).

- [ ] **Step 1 : Lire 2-3 hubs existants pour identifier le pattern**

Read: `harness-agentique/index.html`, `evaluation-agentique/index.html`, `memoire-agentique/index.html`. Repérer la structure : `<head>` (meta, fonts, favicon, style inline) + `<body>` (topbar 2-items hub + hero du dossier + grille de cartes + footer + `admin.js`).

- [ ] **Step 2 : Adapter le pattern pour `fabrique-agent/index.html`**

Contenu attendu :
- Topbar 2-items : "Mathieu Guglielmino" à gauche, "← Retour aux dossiers" à droite (cible `../index.html#series`)
- Hero : eyebrow "Dossier · La fabrique" en mono CARMINE, titre `<em>La fabrique d'un agent</em>` en Fraunces, lede (cf. spec section 2)
- Sous-titre : "Quatre stades de maturité, dix artefacts partagés, une équipe qui apprend à livrer des agents"
- Métadonnées : date "15 mai 2026", nombre de mots ~10 000, durée de lecture "≈ 40 min", nombre de schémas 12
- Bloc "Les quatre stades" : 4 vignettes courtes (Prototype "ça parle" / Pilote "ça mesure" / Production "ça tient" / Mature "ça apprend")
- Grille de formats : **1 carte** `<a class="format format--admin" href="20260515-fabrique-agent-rapport.md" download>` — Rapport intégral (markdown). En mode admin, `admin.js` la transforme en zip download.
- Disclosure IA discrète + footer
- `<script src="/admin.js" defer></script>` juste avant `</body>`
- Bloc SEO encadré par les markers `<!-- og:start -->` / `<!-- og:end -->` — placeholder pour l'instant, `tools/seo_dossiers.py` regénère le tout en Task 24
- Favicon : `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`

- [ ] **Step 3 : Valider que le HTML est bien formé**

```bash
python -c "from html.parser import HTMLParser; HTMLParser(convert_charrefs=True).feed(open('fabrique-agent/index.html', encoding='utf-8').read()); print('OK')"
```
Expected: `OK` sans erreur.

- [ ] **Step 4 : Ouvrir dans un navigateur pour vérifier visuellement** (via Playwright)

Use mcp__plugin_playwright_playwright__browser_navigate to `file:///<chemin>/fabrique-agent/index.html`, capture un snapshot. Vérifier : topbar visible, hero lisible, 1 carte de format en grille.

- [ ] **Step 5 : Commit**

```bash
git add fabrique-agent/index.html
git commit -m "$(cat <<'EOF'
feat(fabrique-agent): scaffold hub avec 1 carte rapport.md (admin-only)

Hub initial du dossier "La fabrique d'un agent" avec :
- Topbar 2-items (Mathieu / retour aux dossiers)
- Hero : eyebrow + titre + lede + métadonnées
- Bloc "Les quatre stades"
- 1 carte format--admin pour le rapport.md (révélée via easter egg
  Ctrl/Cmd+Alt+M, transformée en zip download par admin.js)
- Bloc SEO placeholder (regénéré par tools/seo_dossiers.py)
- Footer + disclosure IA + favicon

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3 : Tuile dans `index.html` racine

**Files:**
- Modify: `index.html` (racine)

La tuile s'insère en **tête de la grille `#series`** (la dernière publication apparaît en premier). Le numéro `NN` continue le séquencement existant — vérifier le dernier NN utilisé en lisant le fichier.

- [ ] **Step 1 : Lire la grille `#series` dans `index.html` racine**

Read: `index.html` (recherche `<section id="series"` ou `<div class="series-grid"`). Identifier le NN courant (typiquement la première `<a class="serie">` après l'ouverture de `.series-grid` porte le NN le plus récent). Identifier la convention de format des `.serie-tag` (ex. `03 · 15 mai 2026`).

- [ ] **Step 2 : Composer la tuile fabrique-agent**

Structure typique (à adapter selon la convention exacte trouvée) :
```html
<a class="serie" href="fabrique-agent/">
  <div class="serie-visual">
    <span class="serie-tag">NN · 15 mai 2026</span>
    <span class="serie-type">Dossier</span>
    <img src="fabrique-agent/og.png" alt="La fabrique d'un agent — couverture">
  </div>
  <div class="serie-body">
    <div class="serie-meta">
      <span>Étude</span><span>≈ 40 min</span><span>12 schémas</span>
    </div>
    <h3 class="serie-title">La <em>fabrique</em> d'un agent</h3>
    <p class="serie-sub">Quatre stades de maturité, dix artefacts partagés, une équipe qui apprend à livrer des agents.</p>
    <div class="serie-cta">
      <span>Ouvrir le dossier</span>
      <span class="arrow">→</span>
    </div>
  </div>
</a>
```

NB : `og.png` n'existe pas encore — c'est `tools/seo_dossiers.py` qui le créera en Task 24. Mais l'attribut `src` peut déjà pointer dessus, ça résoudra côté serveur quand le fichier sera là.

- [ ] **Step 3 : Insérer en tête de `.series-grid`**

Use Edit tool to insert the tile just after the opening tag of the series grid.

- [ ] **Step 4 : Vérification visuelle**

Use Playwright to navigate to the local `index.html`, snapshot the `#series` grid, vérifier que la tuile apparaît en première position, sans casser la mise en page (texte, image placeholder, alignement).

- [ ] **Step 5 : Commit**

```bash
git add index.html
git commit -m "$(cat <<'EOF'
feat(fabrique-agent): tuile en tête de la grille #series

Ajout de la tuile du nouveau dossier "La fabrique d'un agent" en
première position dans la grille des séries de l'accueil. La carte
pointe vers fabrique-agent/ (le hub gère la suite).

og.png sera généré par tools/seo_dossiers.py (Task 24).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4 : SCHÉMA 01 — *L'oignon ↔ la fabrique* (sommaire-index)

**Files:**
- Create: `fabrique-agent/images/01-oignon-fabrique.svg`

**Brief visuel** : double-page compacte. À gauche, l'oignon 10 couches en mode index (sans détail, juste 10 anneaux concentriques numérotés 00-09 avec leur nom court : non-déterminisme, boucle, outils, contexte, patterns, protocoles, guardrails, observabilité, runtime, gouvernance). À droite, les 10 artefacts en colonne. Lignes de correspondance fines au milieu reliant chaque artefact à 1-2 couches qui le concernent.

**ViewBox suggéré** : `1300 × 720`.

**Référence visuelle** : voir `anatomie/livre-schemas.js` pour la convention oignon (couleurs, rayonnement). Reprendre la palette `--bg #faf6ec`, `--accent #b8582e`, `--ink`, `--ink-mid`.

- [ ] **Step 1 : Lire la convention SVG du site**

Read: `coding-agents/images/` (tout SVG récent pour voir la convention typo, l'usage de `font-family`, les marges, le viewBox). Read aussi `illustrated-deep-research/references/svg-editorial-style.md` si disponible (sinon CLAUDE.md section "Convention typo des schémas").

- [ ] **Step 2 : Esquisser la grille de positionnement (avant d'écrire le SVG)**

Plan textuel :
- Bandeau supérieur (y=0-80) : titre "L'oignon ↔ la fabrique" en .display 28pt + sous-titre "L'agent comme structure, la fabrique comme fabrication" en .display 18pt italic
- Marker carmine "SCHÉMA 01" mono 12pt 600 en haut à gauche
- Zone gauche (x=80-560, y=120-680) : oignon — 10 anneaux concentriques, centre à (320, 400), rayon externe 280, chaque anneau 28px d'épaisseur. Numéro à l'extérieur de chaque anneau (mono 12pt 600), nom court au centre de chaque anneau ou à droite.
- Zone milieu (x=560-740) : 10 lignes fines (stroke 0.5, ink-mid) qui partent de chaque couche pour rejoindre l'artefact correspondant à droite.
- Zone droite (x=740-1220, y=120-680) : 10 boîtes empilées, chacune contient le nom de l'artefact (body 15pt 500) + le numéro #N en mono 12pt 600 carmine. Espacement vertical homogène.
- Bandeau inférieur (y=680-720) : caption italique 12pt — "L'oignon décrit l'agent (anatomie, dossier dédié). La fabrique décrit le métier d'équipe qui le produit. Lignes : quelle couche concerne quel artefact."

- [ ] **Step 3 : Écrire le SVG**

Le SVG complet. Inclure le `<style>` avec les classes `.display`, `.body`, `.mono`, et la palette. Toutes les couleurs en variables de style inline (pas de CSS vars qui dépendraient de la page hôte).

- [ ] **Step 4 : Valider XML**

```bash
python -c "import xml.etree.ElementTree as ET; ET.parse('fabrique-agent/images/01-oignon-fabrique.svg'); print('XML OK')"
```
Expected: `XML OK`.

- [ ] **Step 5 : Vérifier qu'aucun font-size n'est < 11pt**

```bash
python -c "
import re
content = open('fabrique-agent/images/01-oignon-fabrique.svg', encoding='utf-8').read()
small = re.findall(r'font-size=\"([^\"]+)\"', content)
bad = [s for s in small if s.replace('pt','').replace('px','').isdigit() and int(s.replace('pt','').replace('px','')) < 11]
print('OK' if not bad else f'BAD: {bad}')"
```
Expected: `OK`.

- [ ] **Step 6 : Rendu visuel via Playwright**

Use Playwright to render the SVG and snapshot. Vérifier : lisibilité, alignement, contraste, espacement.

- [ ] **Step 7 : Commit**

```bash
git add fabrique-agent/images/01-oignon-fabrique.svg
git commit -m "feat(fabrique-agent): SCHÉMA 01 — l'oignon ↔ la fabrique

Sommaire-index visuel qui relie les 10 couches d'agent (anatomie)
aux 10 artefacts de la fabrique. Posé en intro du rapport pour
rappeler la grammaire de base du site puis tourner la page.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5 : Section 0 du rapport (Ouverture, ~800 mots)

**Files:**
- Create: `fabrique-agent/20260515-fabrique-agent-rapport.md`

**Brief éditorial** :
- Hook (0.1, ~150 mots) : ouvrir sur "Un agent ne crashe pas, il dérive" (citation de **anatomie**, à attribuer en note de bas de page). Empiler les chiffres alarmants : 95 % des pilotes au point mort (MIT NANDA), 70 % des POC ne passent jamais en prod. Conclure avec une promesse : ce rapport raconte ce qui sépare les 5 % qui réussissent des 95 % qui s'enlisent — pas un secret de modèle, une discipline d'équipe.
- Thèse (0.2, ~200 mots) : la maturité d'une fabrique se lit dans la qualité de ses artefacts partagés, pas dans son code. Le **harness** est différenciant (Schluntz & Zhang : sur SWE-Bench Pro, le même modèle oscille de 22 points selon le scaffold), mais ce qui le tient en vie c'est la fabrique autour. Métaphore : "un atelier qui apprend".
- Rappel oignon (0.3, ~150 mots) : pose le SCHÉMA 01 (Oignon ↔ fabrique). Rappel rapide des 10 couches sans s'attarder. Renvoi explicite à `anatomie` pour creuser.
- Présentation des 10 artefacts (0.4, ~150 mots) : annonce la matrice à venir, pointe vers la colonne droite du SCHÉMA 01.
- Mode d'emploi (0.5, ~150 mots) : les trois parcours de lecture (PM 🎯 / Builder 🔧 / Décideur 🧭), durée indicative, signalisation en marge.

**Surlignages `<mark>` obligatoires** : 2-3, sur les phrases-pivots ("la maturité d'une fabrique se lit dans la qualité de ses artefacts partagés", "le harness distingue un POC d'un produit").

**Termes du glossaire à introduire avec `.term`** : harness, boucle TAOR (juste à la 1ʳᵉ occurrence ; ils seront définis dans l'annexe A).

**Callouts** : aucun dans la section 0 — réservés aux stades.

- [ ] **Step 1 : Créer le fichier rapport avec front-matter et structure de squelette en placeholders**

```markdown
---
title: La fabrique d'un agent
subtitle: Quatre stades de maturité, dix artefacts partagés, une équipe qui apprend à livrer des agents
date: 2026-05-15
author: Mathieu Guglielmino
---

# La fabrique d'un agent

> *Quatre stades de maturité, dix artefacts partagés, une équipe qui apprend à livrer des agents.*

## 0. Ouverture

### 0.1 — Hook

[…]

### 0.2 — Thèse

[…]

### 0.3 — Rappel : l'oignon à 10 couches

[…]

![SCHÉMA 01 — L'oignon ↔ la fabrique|1300](images/01-oignon-fabrique.svg)

### 0.4 — Les dix artefacts partagés

[…]

### 0.5 — Comment lire ce rapport

[…]

## 1. Stade 1 · Prototype · « ça parle »
## 2. Stade 2 · Pilote · « ça mesure »
## 3. Stade 3 · Production · « ça tient »
## 4. Stade 4 · Mature multi-agents · « ça apprend »
## 5. Clôture
## Annexe A — Glossaire
## Annexe B — Voir aussi
## Annexe C — Sources
```

- [ ] **Step 2 : Rédiger la section 0 complète**

Remplacer les `[…]` par la prose. Respecter les briefs ci-dessus. Embarquer le surlignage `==…==` (rendu `<mark>` Obsidian) sur 2-3 phrases-pivots. Faire intervenir `.term` à la première occurrence de **harness** et **boucle TAOR** — syntaxe inline : `<span class="term" data-term="harness">harness</span>`.

- [ ] **Step 3 : Compter les mots**

```bash
python -c "
import re
content = open('fabrique-agent/20260515-fabrique-agent-rapport.md', encoding='utf-8').read()
# garder section 0 uniquement
import re
s0_match = re.search(r'## 0\. Ouverture(.*?)## 1\.', content, re.DOTALL)
words = len(s0_match.group(1).split()) if s0_match else 0
print(f'Section 0 word count: {words}')"
```
Expected: ~700-900 mots.

- [ ] **Step 4 : Vérifier la présence des éléments obligatoires**

```bash
grep -c '==' fabrique-agent/20260515-fabrique-agent-rapport.md  # surlignages (2-3 attendus dans section 0)
grep -c 'data-term=' fabrique-agent/20260515-fabrique-agent-rapport.md  # termes glossaire (≥ 2)
grep -c '01-oignon-fabrique.svg' fabrique-agent/20260515-fabrique-agent-rapport.md  # référence SCHÉMA 01
```
Expected: surlignages ≥ 2, termes ≥ 2, schéma 01 référencé 1 fois.

- [ ] **Step 5 : Commit**

```bash
git add fabrique-agent/20260515-fabrique-agent-rapport.md
git commit -m "feat(fabrique-agent): section 0 — ouverture (hook · thèse · oignon · artefacts · mode d'emploi)

Section d'ouverture ~800 mots avec intégration du SCHÉMA 01.
Pose la thèse centrale : la maturité d'une fabrique se lit dans
ses artefacts partagés, pas dans son code.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6 : SCHÉMA 02 — *L'atelier · Stade 1 (Prototype)*

**Files:**
- Create: `fabrique-agent/images/02-atelier-prototype.svg`

**Brief visuel** : atelier-totem #1, cross-section frontale. Sobre, presque vide. Un seul personnage (silhouette de dev). Notebook ouvert sur une table. Un post-it "BACKLOG" sur le mur. Au-dessus du notebook : une bulle de texte = le prompt système, qui *déborde* du cadre (suggérer la croissance non maîtrisée). Dans un coin sombre : un cercle qui se mord la queue = menace de la boucle infinie, avec un compteur `4 $/min` qui monte.

**ViewBox suggéré** : `1300 × 800`.

**Conventions** :
- Sol = ligne horizontale ink-mid à y=720
- Personnage = silhouette stylisée, 80px de hauteur, neutre (pas de visage détaillé)
- Mobilier = traits fins, pas de remplissage massif
- Texte du prompt = body 13pt italic dans la bulle ; **deux lignes** illustratives qui débordent un peu de la bulle (overflow visible)
- Menace boucle : un cercle pointillé carmine, flèche cyclique, compteur mono 15pt 500 weight CARMINE.
- Titre en haut : "STADE 1 · PROTOTYPE · *ça parle*" en .display 28pt + 18pt italic, marker carmine "SCHÉMA 02"

- [ ] **Step 1 : Esquisser la grille de positionnement**

(positions approximatives, à raffiner pendant l'écriture)
- Mur du fond : y=80-720, lignes verticales discrètes pour suggérer le panneau (stroke 0.3 ink-faint)
- Post-it "BACKLOG" : (x=180, y=180, 120×100), fond jaune pâle (ex. `#fff3b0`), un peu en biais (rotation -3°)
- Table : (x=400, y=600, 500×20) rectangle ink
- Notebook : (x=560, y=540, 180×60) parallélépipède semi-ouvert
- Personnage dev : (x=480, y=540), debout, tournée vers le notebook
- Bulle prompt : ovale (x=720, y=380, 360×180), contour ink, contenu déborde
- Menace boucle (coin bas-droit) : cercle pointillé carmine, (x=1100, y=680, r=60), petit compteur en dessous "4 $/min"
- Légende basse (y=760-790) : "Pas de budget de tours · pas de détection de cycle · pas de plafond de tokens — *un agent qui parle dans le vide*"

- [ ] **Step 2 : Écrire le SVG**

- [ ] **Step 3 : Valider XML + pas de font-size < 11pt** (commandes Task 4)

- [ ] **Step 4 : Rendu visuel via Playwright + ajustement si nécessaire**

- [ ] **Step 5 : Commit**

```bash
git add fabrique-agent/images/02-atelier-prototype.svg
git commit -m "feat(fabrique-agent): SCHÉMA 02 — atelier-totem stade 1 (Prototype)

Cross-section frontale d'un atelier minimaliste : un dev, un
notebook, un post-it backlog, un prompt qui déborde, et la menace
silencieuse d'une boucle infinie à 4 \$/min. Première des 4 scènes-
totem qui rythment le rapport.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7 : SCHÉMA 03 — *Anatomie du prompt v0 comme palimpseste*

**Files:**
- Create: `fabrique-agent/images/03-prompt-palimpseste.svg`

**Brief visuel** : le prompt système dessiné comme un manuscrit raturé. Couches d'instructions superposées, ratures datées, ajouts marginaux. Texture évoquant le palimpseste (parchemin). 4-5 strates : (a) identité initiale "Tu es un assistant…" rayée, remplacée par "Tu es un agent…" ; (b) bullet "outils disponibles : (vide)" avec ajout marginal "+ web_search, + code_exec" ; (c) note rouge "ne dis JAMAIS le mot 'X'" griffonnée dans la marge ; (d) bloc de tests adressés au modèle "voici 3 cas : …" ; (e) une date de modification "v0.7 — 03/05".

**ViewBox suggéré** : `1300 × 760`.

- [ ] **Step 1 : Plan de mise en page** (5 strates empilées verticalement, marge gauche pour annotations)

- [ ] **Step 2 : Écrire le SVG**

- [ ] **Step 3 : Valider XML + font-size**

- [ ] **Step 4 : Rendu Playwright**

- [ ] **Step 5 : Commit**

```bash
git add fabrique-agent/images/03-prompt-palimpseste.svg
git commit -m "feat(fabrique-agent): SCHÉMA 03 — anatomie du prompt v0 comme palimpseste

Le prompt système du Prototype, dessiné comme un manuscrit raturé :
5 strates qui montrent comment un prompt grossit sans gouvernance,
par accrétion d'instructions, ratures et ajouts marginaux.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 8 : Section 1 du rapport (Stade Prototype, ~1400 mots)

**Files:**
- Modify: `fabrique-agent/20260515-fabrique-agent-rapport.md`

**Brief éditorial** :
- **1.1 La scène** (~300 mots) : pose le SCHÉMA 02 (atelier-totem). Décris la scène en prose : un seul personnage, un notebook, un post-it. Voix narrative qui rend l'image. Inclus une référence à la **boucle TAOR** et au stop_reason.
- **1.2 Artefacts qui existent déjà sous forme brouillon** (~600 mots) :
  - Backlog post-it / doc partagé (≈ 100 mots) — qu'est-ce qu'on y note, qu'est-ce qui manque
  - Prompt système v0 (≈ 200 mots, intègre SCHÉMA 03) — pas versionné, palimpseste, hidden constraints qui s'accumulent
  - Scratchpad mémoire de travail (≈ 100 mots) — CoALA #1, la mémoire la plus simple, contexte unique
  - Golden dataset embryonnaire (≈ 150 mots) — Anthropic playbook étape 1 : "partir du manuel", convertir les bugs du tracker en test cases ; capability d'abord (terme `.term`)
  - Logs print (≈ 50 mots) — pas encore d'OTel ; on lit dans la console
- **1.3 Antipattern signature** (~250 mots) en cartouche `[!antipattern]` : "Il marche sur mon laptop". Sans budget de tours, sans détection de cycle, sans plafond de tokens, un agent entre dans une boucle infinie à 4 $/min (citation **anatomie**). Conséquences : facture invisible, comportements non reproductibles, dépendance au compte cloud personnel.
- **1.4 Signal de bascule vers Pilote** (~250 mots) : *un utilisateur réel passe son premier message à l'agent*. Ce qui change le jour J. Premières attentes (réponse en X secondes, réponse intelligible, pas de débordement). La fin du privilège du dev qui était seul utilisateur.

**Callouts ciblés** (≤ 3) :
- `[!builder]` 🔧 sur le détail technique du stop_reason et du début de boucle TAOR (1.1)
- `[!pm]` 🎯 sur le golden dataset "vous démarrez avec 20-50 tasks, pas 500" (1.2)

**Surlignages** : 2-3 phrases-clés sur le palimpseste du prompt et la menace "4 $/min".

**Termes du glossaire** à introduire (1ʳᵉ occurrence) : harness (si pas déjà fait), boucle TAOR, golden dataset, context engineering, scaffolding.

**Schémas intégrés** : 02 (en 1.1) et 03 (en 1.2.b).

- [ ] **Step 1 : Lire la section 0 pour cohérence stylistique**

- [ ] **Step 2 : Rédiger la section 1 complète**

Remplacer le placeholder de la section 1 par la prose. Embarquer les 2 callouts, l'antipattern en cartouche, les 2 surlignages, les 5 termes glossaire, les références aux SCHÉMAS 02 et 03 avec syntaxe Obsidian `![alt|1300](images/N-…svg)`.

- [ ] **Step 3 : Vérifications**

```bash
# Word count Section 1
python -c "
import re
content = open('fabrique-agent/20260515-fabrique-agent-rapport.md', encoding='utf-8').read()
s = re.search(r'## 1\. Stade 1(.*?)## 2\.', content, re.DOTALL)
print(f'Section 1: {len(s.group(1).split())} words' if s else 'NOT FOUND')"
# Expected: ~1200-1600

# Présence des éléments
grep -c '02-atelier-prototype.svg' fabrique-agent/20260515-fabrique-agent-rapport.md  # 1
grep -c '03-prompt-palimpseste.svg' fabrique-agent/20260515-fabrique-agent-rapport.md  # 1
grep -c '> \[!antipattern\]' fabrique-agent/20260515-fabrique-agent-rapport.md  # ≥ 1
grep -c '> \[!pm\]\|> \[!builder\]\|> \[!decideur\]' fabrique-agent/20260515-fabrique-agent-rapport.md  # 2 en section 1
```

- [ ] **Step 4 : Commit**

```bash
git add fabrique-agent/20260515-fabrique-agent-rapport.md
git commit -m "feat(fabrique-agent): section 1 — stade Prototype (« ça parle »)

Section 1 ~1400 mots avec intégration des SCHÉMAS 02 (atelier-totem
#1) et 03 (prompt palimpseste). Couvre les 5 artefacts qui existent
déjà sous forme brouillon, l'antipattern « il marche sur mon laptop »
(4 \$/min en boucle infinie), et le signal de bascule vers Pilote.

Callouts : 1× builder (stop_reason TAOR), 1× pm (golden dataset 20-50).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 9 : SCHÉMA 04 — *L'atelier · Stade 2 (Pilote)*

**Files:**
- Create: `fabrique-agent/images/04-atelier-pilote.svg`

**Brief visuel** : même atelier qu'au stade 1, enrichi. Le dev a été rejoint par un PO (deux silhouettes maintenant). Sur le mur : un premier dashboard de 3 cadrans (usage, perf, comportement) qui s'allument. Au sol, à droite de la table : une pile de 50 petites cartes "golden dataset". Au plafond : un tuyau "OTel" qui descend et se branche au notebook. Sur la table : un microphone (= feedback users qui captent thumbs up/down).

**ViewBox suggéré** : `1300 × 800` (même que stade 1, pour comparabilité visuelle).

- [ ] **Step 1 : Plan de mise en page** (réutilise les ancres du stade 1, ajoute les nouveaux éléments)

- [ ] **Step 2 : Écrire le SVG**

- [ ] **Step 3 : Valider XML + font-size**

- [ ] **Step 4 : Rendu Playwright + comparaison côte à côte avec SCHÉMA 02**

- [ ] **Step 5 : Commit**

```bash
git add fabrique-agent/images/04-atelier-pilote.svg
git commit -m "feat(fabrique-agent): SCHÉMA 04 — atelier-totem stade 2 (Pilote)

Même atelier qu'au stade 1, enrichi : PO rejoint le dev, premier
dashboard 3 cadrans (usage · perf · comportement), pile 50 cartes
golden dataset, microphone feedback users, tuyau OTel au plafond.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 10 : SCHÉMA 05 — *Anatomie d'un TestCase*

**Files:**
- Create: `fabrique-agent/images/05-testcase-anatomie.svg`

**Brief visuel** : la formule canonique `TestCase = (Persona × Quest × Environment) → Expected Outcome` mise en scène. Trois boîtes d'inputs (Persona, Quest, Environment) se composent par un opérateur `×`, suivie d'une flèche `→` vers la sortie Expected Outcome. La sortie est éclatée en deux familles : (a) Metrics déterministes (code-checkable, ex. `turn_count ≤ 10`, `tool_schema_errors = 0`, `quest_completed = true`), (b) suite de juges LLM single-responsibility (ex. `judge_no_hallucination`, `judge_pii_protection`, `judge_source_citation`, `judge_error_disclosure`).

**ViewBox suggéré** : `1300 × 640`.

- [ ] **Step 1 : Plan**

3 boîtes d'inputs alignées en haut (y=180), opérateur × entre elles, flèche → à droite, Expected Outcome boîte centrale (y=380), puis 2 sous-boîtes Metrics et Juges en bas (y=520).

- [ ] **Step 2 : Écrire le SVG**

Conventions textuelles dans les boîtes :
- Persona : "Role · Knowledge · Mood"
- Quest : "Goal · Hidden constraint · Success criterion"
- Environment : "Happy · Chaos (timeout/500/quota) · Adversarial"
- Metrics déterministes : liste mono 13pt : `turn_count ≤ 10` / `tool_schema_errors = 0` / `quest_completed = true`
- Juges LLM : liste mono 13pt : `judge_no_hallucination` / `judge_pii_protection` / `judge_source_citation`

- [ ] **Step 3 : Valider XML + font-size**

- [ ] **Step 4 : Rendu Playwright**

- [ ] **Step 5 : Commit**

```bash
git add fabrique-agent/images/05-testcase-anatomie.svg
git commit -m "feat(fabrique-agent): SCHÉMA 05 — anatomie d'un TestCase

La formule canonique d'évaluation : TestCase = (Persona × Quest ×
Environment) → Expected Outcome, avec la sortie éclatée en deux
familles : metrics déterministes (code-checkable) + suite de juges
LLM single-responsibility.

Reprise de la convention du dossier evaluation-agentique pour
cohérence cross-dossier.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 11 : SCHÉMA 06 — *La vallée de la mort des pilotes*

**Files:**
- Create: `fabrique-agent/images/06-vallee-de-la-mort.svg`

**Brief visuel** : courbe éditoriale. Axe X = "temps de vie du pilote (semaines)", axe Y = "probabilité de passage en prod". Une cohorte de petits points (≈ 100 pilotes) avance le long de la courbe. À mi-chemin, une falaise. 70 % tombent dans le ravin (chiffre éditorial reprenant la stat MIT NANDA). Les 30 % qui franchissent passent au plateau "Production". Trois flèches accusatrices pointent les artefacts manquants chez ceux qui tombent : *FinOps absent · eval discontinue · gouvernance informelle*.

**ViewBox suggéré** : `1300 × 720`.

- [ ] **Step 1 : Plan**

Axes (X de x=120 à x=1180, Y de y=600 à y=180). Courbe qui monte en plateau, puis chute brusque à x=700 (la falaise). Points dispersés le long. Au fond du ravin : 70 points écroulés. Sur le plateau prod : 30 points debout. 3 flèches carmine partant du ravin pointant vers 3 étiquettes en haut.

- [ ] **Step 2 : Écrire le SVG**

- [ ] **Step 3 : Valider XML + font-size**

- [ ] **Step 4 : Rendu Playwright**

- [ ] **Step 5 : Commit**

```bash
git add fabrique-agent/images/06-vallee-de-la-mort.svg
git commit -m "feat(fabrique-agent): SCHÉMA 06 — la vallée de la mort des pilotes

Courbe éditoriale : 70 % des pilotes tombent dans la falaise entre
Pilote et Production (MIT NANDA). Les survivants ont trois artefacts
que les morts n'avaient pas : FinOps, eval continue, gouvernance
formelle. Schéma le plus éditorial du rapport.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 12 : Section 2 du rapport (Stade Pilote, ~1800 mots)

**Files:**
- Modify: `fabrique-agent/20260515-fabrique-agent-rapport.md`

**Brief éditorial** :
- **2.1 La scène** (~250 mots) : intégrer SCHÉMA 04. Le PO arrive, premier dashboard, premier feedback user, premier alerting L0-L1. La discovery du Pilote : on découvre ce qu'on ne mesurait pas. Citer **CLEAR** comme cadre multi-critères naissant. Stat : "l'écart benchmark/production atteint 37 %".
- **2.2 Artefacts qui naissent** (~800 mots) :
  - DoD adaptée aux agents (~100 mots) — terme `.term`
  - Traces OTel GenAI (~150 mots) — les 4 spans canoniques `invoke_agent` · `chat` · `execute_tool` · `gen_ai.evaluation.result`, terme `.term`. Renvoi à observabilite-agents-ia.
  - 3 piliers d'observabilité (~100 mots) — usage + perf + comportement ; pas encore qualité/gouv/drift
  - TestCase formalisé (~200 mots) — intégrer SCHÉMA 05. Formule complète, capability vs régression evals + graduate (term)
  - Mémoire sémantique + épisodique (~100 mots) — CoALA piliers #2 et #3
  - Boucle de feedback user (~80 mots) — thumbs up/down + raison
  - Premier dashboard + alerting (~70 mots) — niveaux L0-L1 (premières échelles)
- **2.3 La vallée de la mort** (~400 mots) : intégrer SCHÉMA 06. Pourquoi 70 % tombent. Trois manques : FinOps absent, eval discontinue (le palier N3 non atteint), gouvernance informelle. Anthropic gruyère suisse — citer pour préparer le stade 3.
- **2.4 Antipattern** (~200 mots) en cartouche `[!antipattern]` : "On alerte sur tout, donc plus personne ne lit les alertes". Cible la mauvaise calibration du seuillage L0-L4.
- **2.5 Signal de bascule** (~150 mots) : *un SLA est promis, ou un risque réglementaire pointe*. Premier audit demandé. Premier "comment on s'arrête si ça déraille ?".

**Callouts** (≤ 3) :
- `[!pm]` 🎯 sur capability vs régression + graduate (2.2.d)
- `[!builder]` 🔧 sur OTel GenAI 4 spans et `OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=false` en prod (2.2.b)
- `[!decideur]` 🧭 sur la vallée de la mort : "budget d'une vraie eval continue = 10-15 % du budget agent annuel" (2.3)

**Surlignages** : "discovery du Pilote : on découvre ce qu'on ne mesurait pas", "le palier N3 non atteint".

**Termes glossaire** : DoD adaptée aux agents, OTel GenAI, TestCase, LLM-as-a-judge, capability vs régression evals + graduate, HITL, approval gate, least agency, context engineering (si pas déjà introduit).

- [ ] **Step 1 : Rédiger la section 2**

- [ ] **Step 2 : Vérifications**

```bash
# Word count section 2
python -c "
import re
c = open('fabrique-agent/20260515-fabrique-agent-rapport.md', encoding='utf-8').read()
s = re.search(r'## 2\. Stade 2(.*?)## 3\.', c, re.DOTALL)
print(f'Section 2: {len(s.group(1).split())} words')"
# Expected: ~1600-2000

# Schémas
for n in [4, 5, 6]:
  grep -c "0$n-" fabrique-agent/20260515-fabrique-agent-rapport.md  # 1 chaque
```

- [ ] **Step 3 : Commit**

```bash
git add fabrique-agent/20260515-fabrique-agent-rapport.md
git commit -m "feat(fabrique-agent): section 2 — stade Pilote (« ça mesure »)

Section 2 ~1800 mots avec intégration des SCHÉMAS 04 (atelier-totem
#2), 05 (TestCase anatomie) et 06 (vallée de la mort). Couvre les 7
artefacts qui naissent au Pilote, l'analyse des 70 % qui ne passent
jamais en prod, l'antipattern « on alerte sur tout », et le signal
de bascule vers Production.

Callouts : 1× pm (graduate), 1× builder (OTel spans), 1× décideur
(budget eval 10-15 %).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 13 : SCHÉMA 07 — *L'atelier · Stade 3 (Production)*

**Files:**
- Create: `fabrique-agent/images/07-atelier-production.svg`

**Brief visuel** : atelier-totem #3, encore enrichi. **Quatre silhouettes** : PO + Builder + SRE + Auditeur. Le mur entier devient un tableau de bord 6 piliers (6 cadrans alignés). Au centre : un **coffre-fort** = tools registry + agent registry. Au sol entre l'agent et la sortie : un **cordon rouge** = approval gate. Au plafond : une **horloge SLA**. À droite : un **compteur FinOps** type pompe à essence (qui consomme). En arrière-plan : **3 silhouettes en transparence** = les 3 lignes de défense (Dev/Ops · Risk/Compliance · Audit) — overlay en gris pour pas surcharger.

**ViewBox suggéré** : `1300 × 800`.

- [ ] **Step 1 : Plan** (4 personnages au sol, 6 cadrans au mur, coffre-fort central, cordon rouge horizontal, horloge SLA et FinOps en éléments distincts)

- [ ] **Step 2 : Écrire le SVG**

- [ ] **Step 3 : Valider XML + font-size**

- [ ] **Step 4 : Rendu Playwright**

- [ ] **Step 5 : Commit**

```bash
git add fabrique-agent/images/07-atelier-production.svg
git commit -m "feat(fabrique-agent): SCHÉMA 07 — atelier-totem stade 3 (Production)

Atelier densifié : 4 silhouettes (PO + Builder + SRE + Auditeur),
mur 6 piliers d'observabilité, coffre-fort registries au centre,
cordon rouge approval gate au sol, horloge SLA au plafond, compteur
FinOps en pompe à essence, et en transparence les 3 lignes de
défense (SR 11-7) en arrière-plan.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 14 : SCHÉMA 08 — *Le gruyère suisse de l'évaluation*

**Files:**
- Create: `fabrique-agent/images/08-gruyere-suisse.svg`

**Brief visuel** : 5 tranches de fromage superposées horizontalement, chacune avec ses trous décalés. De haut en bas : (1) Auto evals, (2) Monitoring prod, (3) A/B testing, (4) Revue manuelle, (5) Études humaines structurées. Une bille = un incident potentiel — entre par le haut, traverse trois trous (passe les 3 premières couches), mais s'arrête à la quatrième couche (revue manuelle l'attrape). Citer Anthropic ("aucune méthode unique ne suffit") en caption.

**ViewBox suggéré** : `1300 × 720`.

- [ ] **Step 1 : Plan** (5 tranches alignées verticalement, trous semi-aléatoires, bille = cercle rouge avec trace de chute)

- [ ] **Step 2 : Écrire le SVG**

- [ ] **Step 3 : Valider XML + font-size**

- [ ] **Step 4 : Rendu Playwright**

- [ ] **Step 5 : Commit**

```bash
git add fabrique-agent/images/08-gruyere-suisse.svg
git commit -m "feat(fabrique-agent): SCHÉMA 08 — le gruyère suisse de l'évaluation

Modèle d'empilement à 5 couches : auto evals · monitoring prod ·
A/B testing · revue manuelle · études humaines. Une bille (=
incident) traverse 3 trous puis s'arrête à la 4e couche. Métaphore
canonique d'Anthropic : « aucune méthode unique ne suffit ».

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 15 : SCHÉMA 09 — *OBO vs Régime autonome — la facture cachée*

**Files:**
- Create: `fabrique-agent/images/09-obo-vs-autonome.svg`

**Brief visuel** : diptyque. À gauche, panneau OBO (Assistants On-Behalf-Of) — ~17 % du projet en gouvernance — avec liste détaillée des coûts (provider Registry/Defender 4-5 %, setup 2-3 %, méthodologie comité+charte 4-5 %, formation 3-4 %, tracking 2-3 %). À droite, panneau Régime autonome — 30-40 % du projet — avec sa propre liste (provisioning double, compliance renforcée, incident response 24/7, plan de remédiation, support juridique). Comparaison brutale, lecture en un coup d'œil.

**ViewBox suggéré** : `1300 × 760`.

- [ ] **Step 1 : Plan** (2 colonnes égales, bandeau commun, liste à puces verticale dans chaque colonne, totaux en bas grosse police)

- [ ] **Step 2 : Écrire le SVG**

- [ ] **Step 3 : Valider XML + font-size**

- [ ] **Step 4 : Rendu Playwright**

- [ ] **Step 5 : Commit**

```bash
git add fabrique-agent/images/09-obo-vs-autonome.svg
git commit -m "feat(fabrique-agent): SCHÉMA 09 — OBO vs Régime autonome (facture cachée)

Diptyque comparatif : agents OBO (~17 % du projet en gouvernance)
vs régime autonome (30-40 %). Liste détaillée des coûts cachés
de chaque régime, lecture en un coup d'œil.

Reprend les chiffres canoniques du dossier gouvernance.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 16 : Section 3 du rapport (Stade Production, ~2400 mots)

**Files:**
- Modify: `fabrique-agent/20260515-fabrique-agent-rapport.md`

**Brief éditorial** (la section la plus chargée du rapport) :
- **3.1 La scène** (~300 mots) : intégrer SCHÉMA 07. 4 personnages en mouvement, SLA explicite, premier incident, premier post-mortem. Arbitrage coût × latence × qualité doit être tenu par une équipe, pas par un fichier de config.
- **3.2 Artefacts qui montent en grade** (~1200 mots, le plus dense) :
  - Epics produit & roadmap (~100 mots)
  - Tools registry & policy (~150 mots) — least agency explicite, citer OWASP ASI 2026
  - Agent registry (~150 mots) — Entra Agent ID, templates Purview/Defender, ownership clair (vocabulaire gouvernance)
  - Budget FinOps (~150 mots) — par agent / flow / tenant, règles routing Sonnet/Opus/fallback, alerting budget
  - Runbook & politique HITL (~200 mots) — approval gates sur flux sortant, escalation L2-L4, modes dégradés. Distinction HITL/approval gate.
  - Charte de risques & 3 lignes de défense (~150 mots) — SR 11-7 origin, 14 piliers, *overlay dans SCHÉMA 07*. Choix structurant OBO vs Autonome (intégrer SCHÉMA 09).
  - Pipeline d'évaluation continue (~150 mots) — gruyère suisse à 5 couches (intégrer SCHÉMA 08), CLEAR multi-critères, capability/régression géré, pass^k explicite
  - Cognitive audit trail (~75 mots) — versioning + tagging policy + RBAC ; trace fautive → test case permanent
  - 6 piliers d'observabilité activés (~75 mots) — usage, perf, comportement, qualité, gouvernance, drift
- **3.3 OBO vs Régime autonome** (~250 mots) : intégrer SCHÉMA 09 (s'il n'est pas déjà placé en 3.2). Détailler les deux régimes et leurs implications cumulées.
- **3.4 La boucle agentique sous tension** (~300 mots) : quand on dégrade (cache hit, modèle low-cost, refus poli). Discipline du pass^k pour le client-facing (un agent à 75 % a 42 % de chance sur 3 interactions consécutives).
- **3.5 Antipattern** (~200 mots) en cartouche `[!antipattern]` : "Le runbook est à jour mais personne ne l'a lu". Symptômes : incident → improvisation → fix qui crée le prochain incident. Remède : exercises tabletop réguliers.
- **3.6 Signal de bascule** (~150 mots) : *un deuxième agent rejoint le premier, ou : on veut que l'agent apprenne*. Premier protocole inter-agents discuté. Premier "memory pool" envisagé.

**Callouts** (≤ 3) :
- `[!builder]` 🔧 sur l'implémentation des approval gates et la cinématique des escalations L2-L4
- `[!decideur]` 🧭 sur le choix OBO vs Autonome et l'engagement budgétaire (17 % vs 30-40 %)
- `[!pm]` 🎯 sur le pass^k et son implication produit (un agent à 75 % a 42 % sur 3 interactions)

**Surlignages** : "l'arbitrage doit être tenu par une équipe, pas un fichier de config", "le runbook est à jour mais personne ne l'a lu", "tenir l'écart benchmark/production sous 10 %".

**Termes glossaire** : approval gate (si pas déjà), gruyère suisse, CLEAR, OBO vs Régime autonome, pass@k vs pass^k.

**Schémas** : 07, 08, 09.

- [ ] **Step 1 : Rédiger la section 3**

- [ ] **Step 2 : Vérifications** (word count ~2400, présence des 3 schémas, 3 callouts, 1 antipattern)

- [ ] **Step 3 : Commit**

```bash
git add fabrique-agent/20260515-fabrique-agent-rapport.md
git commit -m "feat(fabrique-agent): section 3 — stade Production (« ça tient »)

Section 3 ~2400 mots (la plus dense) avec intégration des SCHÉMAS
07 (atelier-totem #3), 08 (gruyère suisse) et 09 (OBO vs Autonome).
Couvre les 9 artefacts qui montent en grade en prod, le choix OBO
vs Autonome (17 % vs 30-40 %), la boucle agentique sous tension
(pass^k), l'antipattern « runbook à jour mais pas lu », et le
signal de bascule vers Mature.

Callouts : 1× builder (approval gates), 1× décideur (régime), 1× pm
(pass^k 75 % → 42 %).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 17 : SCHÉMA 10 — *L'atelier · Stade 4 (Mature multi-agents)*

**Files:**
- Create: `fabrique-agent/images/10-atelier-mature.svg`

**Brief visuel** : atelier-totem #4, devenu théâtre. **4-5 silhouettes d'agents** (formes distinctes) en mouvement sur la scène. Au centre : un **puits commun** = memory pool partagé. **Équipe humaine** en coulisses (silhouettes en arrière-plan, plus discrètes). Sur le mur : **ROI cards en damier** (15 cartes 5×3 = 5 axes × 3 temporalités). **Conveyor d'évaluation continue** qui tourne dans le bas. Les anciens postes humains ont muté : le PO tient une roadmap multi-agents, le SRE surveille un swarm.

**ViewBox suggéré** : `1300 × 800`.

- [ ] **Step 1 : Plan** (4 agents au centre-haut, puits central, équipe en arrière-plan, mur damier ROI, conveyor en bas)

- [ ] **Step 2 : Écrire le SVG**

- [ ] **Step 3 : Valider XML + font-size**

- [ ] **Step 4 : Rendu Playwright**

- [ ] **Step 5 : Commit**

```bash
git add fabrique-agent/images/10-atelier-mature.svg
git commit -m "feat(fabrique-agent): SCHÉMA 10 — atelier-totem stade 4 (Mature multi-agents)

Atelier devenu théâtre : 4-5 silhouettes d'agents en mouvement,
memory pool partagé au centre comme un puits, équipe humaine en
coulisses, ROI cards en damier sur le mur (5 axes × 3 temporalités),
conveyor d'évaluation continue qui tourne.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 18 : SCHÉMA 11 — *La mémoire CoALA en cycle*

**Files:**
- Create: `fabrique-agent/images/11-coala-cycle.svg`

**Brief visuel** : 4 mémoires (travail · sémantique · épisodique · procédurale) comme 4 organes disposés autour d'un cercle central. 6 flèches courbes circulent autour pour matérialiser les 6 opérations du cycle CoALA : récupération · consolidation · mise à jour · indexation · compression · oubli. Une légende renvoie à la taxonomie d'origine (CoALA, Princeton TMLR 2024).

**ViewBox suggéré** : `1300 × 720`.

- [ ] **Step 1 : Plan** (4 organes en croix autour d'un cercle central de cycle, 6 flèches circulaires)

- [ ] **Step 2 : Écrire le SVG**

- [ ] **Step 3 : Valider XML + font-size**

- [ ] **Step 4 : Rendu Playwright**

- [ ] **Step 5 : Commit**

```bash
git add fabrique-agent/images/11-coala-cycle.svg
git commit -m "feat(fabrique-agent): SCHÉMA 11 — la mémoire CoALA en cycle

4 mémoires (travail · sémantique · épisodique · procédurale) connectées
par les 6 opérations du cycle (récup · consolidation · mise à jour ·
indexation · compression · oubli). Reprise de la taxonomie canonique
CoALA (Princeton TMLR 2024).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 19 : Section 4 du rapport (Stade Mature, ~1800 mots)

**Files:**
- Modify: `fabrique-agent/20260515-fabrique-agent-rapport.md`

**Brief éditorial** :
- **4.1 La scène** (~300 mots) : intégrer SCHÉMA 10. 4-5 agents qui coopèrent, memory pool, équipe humaine en coulisses. Le métier de l'équipe a changé : on n'écrit plus l'agent, on l'élève.
- **4.2 Artefacts qui fusionnent** (~1100 mots) :
  - Mémoire CoALA complète (~250 mots, intégrer SCHÉMA 11) — 4 piliers, cycle 6 opérations complet, memory pool partagé, scoring qualité, gouvernance mémoire (memory poisoning à mentionner avec `.term`)
  - Pipeline de mise à jour (~150 mots) — prompt système, modèle, mémoire versionnés séparément, A/B continu, machine unlearning RGPD
  - Évaluation adverse intégrée (~150 mots) — tasks adversarial deliberate, red team, simulation user dual-control (τ²-bench), simulation agent
  - Protocoles inter-agents (~150 mots) — MCP / A2A / AG-UI, Agent Card, file-based handoff
  - Mode d'exécution à l'échelle (~150 mots) — self-host vs managed (Claude Managed Agents, AgentCore, Vertex Agent Engine, Foundry Service), arbitrage TCO
  - ROI cards mûres (~250 mots) — 5 axes × 3 temporalités, 15 cartes, 8 méthodes de calcul, Hard vs Soft savings (terme), renvoi à measure-roi
- **4.3 Impact équipe** (~250 mots) : réallocation du temps gagné comme condition sine qua non (Cigref). Augmentation 52 % / Automatisation 45 % (Anthropic Economic Index). Pause d'Engels comme scénario à éviter par choix, pas par fatalité (six leviers Acemoglu). Renvoi à ia-et-travail.
- **4.4 Antipattern** (~150 mots) en cartouche `[!antipattern]` : "Les agents écrivent leur mémoire mais ne la lisent jamais". Symptôme : memory pool qui se remplit sans jamais influencer le comportement. Remède : embed retrieval dans la boucle TAOR par défaut, mesurer le memory hit rate.

**Callouts** (≤ 3) :
- `[!builder]` 🔧 sur l'implémentation MCP / A2A / file-based handoff
- `[!pm]` 🎯 sur la réallocation du temps gagné (condition sine qua non)
- `[!decideur]` 🧭 sur l'arbitrage self-host vs managed (impact TCO et souveraineté)

**Surlignages** : "on n'écrit plus l'agent, on l'élève", "le temps gagné qu'on ne réalloue pas est un temps perdu".

**Termes glossaire** : CoALA (étoffée), memory poisoning, hard savings vs soft savings, réallocation du temps gagné.

**Schémas** : 10, 11.

- [ ] **Step 1 : Rédiger la section 4**

- [ ] **Step 2 : Vérifications** (word count ~1800, schémas 10+11 présents, 3 callouts, 1 antipattern)

- [ ] **Step 3 : Commit**

```bash
git add fabrique-agent/20260515-fabrique-agent-rapport.md
git commit -m "feat(fabrique-agent): section 4 — stade Mature multi-agents (« ça apprend »)

Section 4 ~1800 mots avec intégration des SCHÉMAS 10 (atelier-totem
#4) et 11 (CoALA cycle). Couvre les 6 artefacts qui fusionnent au
stade Mature, l'impact équipe (réallocation Cigref, augmentation vs
automatisation Anthropic Economic Index, pause d'Engels Acemoglu),
et l'antipattern « les agents écrivent leur mémoire mais ne la lisent
jamais ».

Callouts : 1× builder (MCP/A2A), 1× pm (réallocation), 1× décideur
(self-host vs managed).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 20 : SCHÉMA 12 — *Tableau récap · 10 artefacts × 4 stades*

**Files:**
- Create: `fabrique-agent/images/12-recap-10x4.svg`

**Brief visuel** : grille finale 10 lignes × 4 colonnes. Chaque cellule = un mot ou une icône qui décrit l'état de l'artefact à ce stade (utilise la matrice de la spec section 6). En-têtes : "Artefact" + "Prototype" + "Pilote" + "Production" + "Mature". Lecture comme une partition de musique : chaque colonne est un moment, chaque ligne est une voix.

**ViewBox suggéré** : `1300 × 920` (la grille est haute).

- [ ] **Step 1 : Plan** (5 colonnes : 1 large pour les libellés d'artefacts à gauche, 4 colonnes étroites pour les stades. 10 lignes. Chaque cellule a 3-6 mots max.)

- [ ] **Step 2 : Composer le contenu de chaque cellule**

À partir de la matrice du spec section 6, condenser chaque cellule à 3-5 mots max. Exemple ligne 1 (Backlog) :
| Stade 1 | Stade 2 | Stade 3 | Stade 4 |
|---|---|---|---|
| Post-it brouillon | Priorisé · DoD v0 | Epics · CLEAR | Multi-agent · capacity |

- [ ] **Step 3 : Écrire le SVG**

Couleurs : alternance subtile entre colonnes (rayures très pâles). Cellules vides = `—`. Quelques cellules-pivots (ex. "Entra Agent ID" stade 3, "Memory pool" stade 4) mises en relief carmine.

- [ ] **Step 4 : Valider XML + font-size**

- [ ] **Step 5 : Rendu Playwright**

- [ ] **Step 6 : Commit**

```bash
git add fabrique-agent/images/12-recap-10x4.svg
git commit -m "feat(fabrique-agent): SCHÉMA 12 — récap 10 artefacts × 4 stades

Grille finale : 10 lignes × 4 colonnes. Chaque cellule = l'état
d'un artefact à un stade, condensé en 3-5 mots. Quelques cellules
pivots mises en relief carmine. Lecture comme une partition.

Schéma de clôture qui rejoue tout le rapport en une page.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 21 : Section 5 du rapport (Clôture, ~600 mots)

**Files:**
- Modify: `fabrique-agent/20260515-fabrique-agent-rapport.md`

**Brief éditorial** :
- **5.1 Tableau récap** (~150 mots) : intégrer SCHÉMA 12. Phrase d'introduction + 2-3 commentaires sur les cellules-pivots.
- **5.2 Trois questions à se poser** (~300 mots) : une par persona, en bloc dédié.
  - 🎯 PM : "Quel est le signal de bascule qui me dit que je suis prêt pour le stade suivant ?"
  - 🔧 Builder : "Quel est l'artefact load-bearing que je n'ai pas encore, et qui me fait perdre des heures ?"
  - 🧭 Décideur : "Si je choisis le régime OBO maintenant, quand devrai-je migrer vers Autonome — et à quel coût ?"
- **5.3 Coda** (~150 mots) : citer "le travail n'est pas un destin technologique" (Acemoglu). La fabrique d'un agent est aussi une fabrique d'équipe, et donc une fabrique de société. Tenir cette boucle ouverte, c'est notre vrai chantier des trois à cinq ans qui viennent.

**Footer** : disclosure IA discrète "*Format co-écrit avec l'aide d'une IA.*"

**Schémas** : 12.

- [ ] **Step 1 : Rédiger la section 5**

- [ ] **Step 2 : Vérifications**

- [ ] **Step 3 : Commit**

```bash
git add fabrique-agent/20260515-fabrique-agent-rapport.md
git commit -m "feat(fabrique-agent): section 5 — clôture (récap · trois questions · coda)

Section 5 ~600 mots avec intégration du SCHÉMA 12 (récap 10×4),
les trois questions à se poser (une par persona), et la coda :
« le travail n'est pas un destin technologique » (Acemoglu).

Disclosure IA placée en footer.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 22 : Annexes A (glossaire), B (voir aussi), C (sources)

**Files:**
- Modify: `fabrique-agent/20260515-fabrique-agent-rapport.md`

**Brief éditorial** :

### Annexe A — Glossaire (~1000 mots, 20 entrées)

Liste alphabétique. Chaque entrée : terme en gras + définition 30-60 mots. Reprendre les définitions canoniques du site (cf. spec section 8 et résultats de l'audit dans les dossiers existants).

Format type pour chaque entrée :

```markdown
**Harness** — Couche d'orchestration qui transforme un LLM en agent productif. Non un wrapper léger mais un système à 7 couches (modèle, boucle de contrôle, contexte, outils & sandbox, mémoire, observabilité, gouvernance). Schluntz & Zhang : sur SWE-Bench Pro, le même modèle oscille de 22 points selon le scaffold. Voir aussi : `harness-agentique`.
```

Les 20 entrées (cf. spec section 8) :
1. Harness
2. Boucle TAOR
3. Golden dataset
4. Context engineering
5. DoD adaptée aux agents
6. Least agency
7. HITL
8. Approval gate
9. OTel GenAI
10. TestCase
11. LLM-as-a-judge
12. Capability evals vs régression evals
13. Gruyère suisse
14. CLEAR
15. OBO vs Régime autonome
16. Pass@k vs Pass^k
17. CoALA
18. Memory poisoning
19. Hard savings vs Soft savings
20. Réallocation du temps gagné

### Annexe B — Voir aussi (~200 mots)

Tableau (cf. spec section 9) qui liste les 9 dossiers existants + l'angle de creusage. Pas de citation, juste les pointeurs.

### Annexe C — Sources (~200 mots, en moyenne)

Liste numérotée [1], [2], …, avec auteur · titre · publication · année. Inclure les sources canoniques : Anthropic (Building effective agents · Eval playbook · Economic Index) · Schluntz & Zhang · MIT NANDA · Cigref · Acemoglu · OWASP ASI · MITRE ATLAS · Princeton CoALA. Idéalement 15-25 entrées numérotées, référencées dans le corps avec syntaxe `<span class="cite" data-cite="N">[N]</span>` (la lib `dossier-app.js` gère les liens vers `#source-N`).

- [ ] **Step 1 : Rédiger Annexe A (glossaire) en respectant le format type**

- [ ] **Step 2 : Rédiger Annexe B (tableau Voir aussi)**

- [ ] **Step 3 : Rédiger Annexe C (sources numérotées)**

- [ ] **Step 4 : Vérifications**

```bash
# Word count global
wc -w fabrique-agent/20260515-fabrique-agent-rapport.md
# Expected: ~9000-11000

# Présence des 20 termes du glossaire
for t in "Harness" "Boucle TAOR" "Golden dataset" "Context engineering" "DoD" "Least agency" "HITL" "Approval gate" "OTel GenAI" "TestCase" "LLM-as-a-judge" "Capability evals" "Gruyère suisse" "CLEAR" "OBO" "Pass@k" "CoALA" "Memory poisoning" "Hard savings" "Réallocation"; do
  grep -c "^\\*\\*$t" fabrique-agent/20260515-fabrique-agent-rapport.md
done
# Each should be ≥ 1
```

- [ ] **Step 5 : Commit**

```bash
git add fabrique-agent/20260515-fabrique-agent-rapport.md
git commit -m "feat(fabrique-agent): annexes A (glossaire 20 termes) + B (voir aussi) + C (sources)

Annexe A : 20 entrées du glossaire en ordre alphabétique, avec
définitions canoniques + renvois aux dossiers existants.

Annexe B : tableau Voir aussi qui pointe vers les 9 dossiers de
référence (anatomie, harness, observabilité, évaluation, mémoire,
gouvernance, ROI, travail, économie inférence).

Annexe C : sources numérotées (Anthropic, MIT NANDA, Cigref,
Acemoglu, OWASP ASI, MITRE ATLAS, Princeton CoALA, etc.).

Le rapport est désormais complet (~10 000 mots, 12 schémas).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 23 : Audit éditorial complet

**Files:**
- Verify: `fabrique-agent/20260515-fabrique-agent-rapport.md`

Cette tâche est une revue qualité sans modification a priori (corrections inline si défauts trouvés).

- [ ] **Step 1 : Vérifier le word count global et par section**

```bash
python -c "
import re
content = open('fabrique-agent/20260515-fabrique-agent-rapport.md', encoding='utf-8').read()
total = len(content.split())
print(f'Total: {total} words')
sections = re.split(r'^## \d', content, flags=re.MULTILINE)[1:]
labels = ['0 Ouverture', '1 Prototype', '2 Pilote', '3 Production', '4 Mature', '5 Clôture']
for label, sec in zip(labels, sections[:6]):
    print(f'{label}: {len(sec.split())} words')"
```
Expected total ~10 000 ± 1500. Par section : voir briefs de chaque task.

- [ ] **Step 2 : Vérifier que les 12 schémas sont présents**

```bash
for i in 01 02 03 04 05 06 07 08 09 10 11 12; do
  count=$(grep -c "$i-" fabrique-agent/20260515-fabrique-agent-rapport.md || echo 0)
  echo "SCHÉMA $i: $count référence(s)"
done
```
Each schema must be referenced ≥ 1 time.

- [ ] **Step 3 : Vérifier que les 20 termes du glossaire sont définis ET utilisés**

Voir Task 22 step 4. En complément :

```bash
# data-term occurrences (utilisation inline)
grep -oE 'data-term="[^"]+"' fabrique-agent/20260515-fabrique-agent-rapport.md | sort | uniq -c
```
Chaque terme du glossaire devrait apparaître ≥ 1 fois avec `data-term=`.

- [ ] **Step 4 : Compter callouts et antipatterns**

```bash
echo "Callouts pm:     $(grep -c '> \[!pm\]' fabrique-agent/20260515-fabrique-agent-rapport.md)"
echo "Callouts builder: $(grep -c '> \[!builder\]' fabrique-agent/20260515-fabrique-agent-rapport.md)"
echo "Callouts decideur:$(grep -c '> \[!decideur\]' fabrique-agent/20260515-fabrique-agent-rapport.md)"
echo "Antipatterns:    $(grep -c '> \[!antipattern\]' fabrique-agent/20260515-fabrique-agent-rapport.md)"
echo "Scenes:          $(grep -c '> \[!scene\]' fabrique-agent/20260515-fabrique-agent-rapport.md)"
```
Expected : 8-11 callouts répartis (≈ 3 par stade × 4 = 12 max, 8 min) · 4 antipatterns (1 par stade) · 4 scenes (1 par atelier-totem, optionnel)

- [ ] **Step 5 : Validation XML de tous les SVG**

```bash
python -c "
import xml.etree.ElementTree as ET
import glob
for f in sorted(glob.glob('fabrique-agent/images/*.svg')):
    try:
        ET.parse(f)
        print(f'OK   {f}')
    except Exception as e:
        print(f'FAIL {f}: {e}')"
```
All 12 SVGs must be `OK`.

- [ ] **Step 6 : Pas de mention Lincoln hors footer**

```bash
grep -ni 'lincoln' fabrique-agent/20260515-fabrique-agent-rapport.md
grep -ni 'lincoln' fabrique-agent/index.html
```
Both should return 0 results (Lincoln n'est que dans le footer global du site, géré ailleurs).

- [ ] **Step 7 : Disclosure IA présente**

```bash
grep -i 'co-écrit\|IA' fabrique-agent/20260515-fabrique-agent-rapport.md | head -5
```
Au moins une occurrence en fin de fichier.

- [ ] **Step 8 : Corriger les défauts trouvés** (Edit inline). Pas de commit séparé pour les corrections — si besoin, faire un single commit "polish: audit éditorial".

---

## Task 24 : SEO, og.png, topbar et favicon

**Files:**
- Modify: `fabrique-agent/index.html` (insertion topbar 3-items + favicon si pas déjà)
- Generate: `fabrique-agent/og.png` (via tool)
- Auto-injection: bloc SEO (via tool)

Note : le hub est une page interne et porte la **topbar 3-items** (cf. CLAUDE.md). Pour la phase 1, le hub est la seule page interne. Le rapport `.md` n'est pas servi tel quel comme page HTML — il est téléchargé.

- [ ] **Step 1 : Topbar 3-items sur le hub**

Le hub est un *hub* : il porte la topbar à **2 items** seulement (`Mathieu Guglielmino` + `← Retour aux dossiers`). C'est la convention site (cf. CLAUDE.md "Hubs ≠ pages internes"). À vérifier que c'est bien fait dans la Task 2.

Pour la phase 1, **aucune page interne** au sens de la convention site (pas d'app, pas de slideshow, pas de scrolly, pas de livre). Donc on n'a *pas* à exécuter `tools/add_dossier_topbar.py` ni `tools/add_topbar_dossier_title.py` à ce stade — ce sera la phase 2.

- [ ] **Step 2 : Vérifier favicon sur le hub**

```bash
grep 'favicon.svg' fabrique-agent/index.html
```
Expected : 1 occurrence du tag `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`.

- [ ] **Step 3 : Lancer `tools/seo_dossiers.py` pour générer og.png + propager le bloc SEO**

```bash
python tools/seo_dossiers.py --only fabrique-agent
```
Expected: création de `fabrique-agent/og.png` (1200×630 PNG) et mise à jour du bloc SEO dans `fabrique-agent/index.html` entre les markers `<!-- og:start -->` et `<!-- og:end -->`.

- [ ] **Step 4 : Vérifications post-tool**

```bash
# og.png présent et bonne taille
python -c "
from PIL import Image
img = Image.open('fabrique-agent/og.png')
print(f'og.png: {img.size}')
assert img.size == (1200, 630), 'Wrong dimensions'
print('OK')"

# Bloc SEO complet
grep -c 'og:title\|og:image\|og:description\|twitter:card' fabrique-agent/index.html
# Expected: ≥ 4
```

- [ ] **Step 5 : Snapshot Playwright du hub final**

Use Playwright to render `fabrique-agent/index.html`, vérifier visuellement : topbar 2-items, hero correct, OG image visible dans `<head>` (inspecter source).

- [ ] **Step 6 : Commit**

```bash
git add fabrique-agent/og.png fabrique-agent/index.html
git commit -m "feat(fabrique-agent): SEO complet (og.png 1200×630 + bloc OG/Twitter/JSON-LD)

Génération via tools/seo_dossiers.py --only fabrique-agent :
- og.png 1200×630 (PIL avec charte du site : Cambria italique titre,
  Consolas eyebrow+footer, accent orange sur mot-clé)
- Bloc SEO complet (OpenGraph + Twitter Card + canonical + JSON-LD
  Article) injecté entre les markers og:start/end

Hub fabrique-agent prêt pour publication.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 25 : Pull Request

**Files:** none modified — workflow only

- [ ] **Step 1 : Vérifier l'état de la branche**

```bash
git status -sb
git log --oneline main..claude/fabrique-agent
```
Expected: aucun fichier non-commité (les éventuels untracked du repo non liés sont normaux). ~15-20 commits sur la branche depuis main.

- [ ] **Step 2 : Push de la branche vers origin**

```bash
git push origin HEAD:claude/fabrique-agent
```
Expected: succès.

NB : si `git push origin main` est tenté quelque part, c'est une erreur — main est bloqué côté proxy (cf. CLAUDE.md). On pousse la branche fabrique-agent seulement.

- [ ] **Step 3 : Ouvrir la PR via MCP GitHub**

Use `mcp__github__create_pull_request` avec :
- owner: `mathieugug` (casse minuscule)
- repo: `mathieugug.github.io`
- head: `claude/fabrique-agent`
- base: `main`
- title: `La fabrique d'un agent — phase 1 (rapport + 12 schémas + hub)`
- body:

```markdown
## Résumé

Nouveau dossier *La fabrique d'un agent* : une étude autonome qui décrit le métier d'équipe produisant et maintenant un agent en production, sous l'angle des artefacts partagés × maturité.

## Contenu phase 1

- **Rapport markdown** ~10 000 mots (`fabrique-agent/20260515-fabrique-agent-rapport.md`)
- **12 schémas SVG** dans `fabrique-agent/images/` (4 ateliers-totem signature + 8 schémas intercalaires)
- **Hub** `fabrique-agent/index.html` avec 1 carte rapport (format--admin, révélée par easter egg Ctrl/Cmd+Alt+M)
- **Tuile** en tête de la grille `#series` de l'accueil
- **SEO complet** (og.png 1200×630, bloc OG/Twitter/JSON-LD) via `tools/seo_dossiers.py`

## Structure narrative

- 4 stades de maturité : **Prototype** « ça parle » → **Pilote** « ça mesure » → **Production** « ça tient » → **Mature multi-agents** « ça apprend »
- 10 artefacts partagés × 4 stades = matrice de 40 cellules
- 3 personas en lecture stratifiée (PM 🎯 / Builder 🔧 / Décideur 🧭) avec parcours balisés et callouts ciblés
- Glossaire de 20 termes en annexe A · mapping vers les 9 dossiers existants en annexe B · sources numérotées en annexe C

## Spec et plan

- Spec : `docs/superpowers/specs/2026-05-15-fabrique-agent-design.md`
- Plan : `docs/superpowers/plans/2026-05-15-fabrique-agent-phase1.md`

## Suite

Phases 2 (app illustrée long-format) et 3 (scrolly avec overlays animés) à venir dans des PR séparées.

## Test plan

- [ ] Hub accessible, lisible, 1 carte format--admin présente
- [ ] Tuile présente en tête de `#series` à l'accueil
- [ ] og.png présent, dimensions 1200×630
- [ ] Bloc SEO complet (canonical, OG, Twitter, JSON-LD)
- [ ] Mobile-friendliness : hub lisible sur 320-414 px
- [ ] Mode admin (Ctrl+Alt+M, mot de passe `K1ng-Mathi3u`) révèle la carte rapport et permet le téléchargement zip
- [ ] Tous les schémas SVG s'affichent sur leur rendu (à vérifier en phase 2 lors de la production de l'app)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

- [ ] **Step 4 : Vérifier que la PR est ouverte**

L'output de l'outil MCP donne l'URL de la PR. La passer à Mathieu pour relecture et merge manuel. **Pas de merge automatique.**

---

## Final validation

Plan terminé. Récap :

- **25 tasks** au total
- **12 SVG** (tasks 4, 6-7, 9-11, 13-15, 17-18, 20)
- **6 sections markdown** (tasks 5, 8, 12, 16, 19, 21) + annexes (task 22)
- **3 tâches d'infra** (1-3 scaffold + 24 SEO + 25 PR)
- **2 tâches transverses** (23 audit éditorial complet)

Granularité : chaque task ≤ 30 min de travail, décomposée en steps unitaires. Commits fréquents (≥ 20 sur la branche).

Convention de commit respectée : conventional commits avec scope `fabrique-agent`, format de chaînage Co-Authored-By selon CLAUDE.md.

Suite : après merge de cette PR, démarrer phase 2 (app illustrée) via un nouveau plan dérivé du même spec.
