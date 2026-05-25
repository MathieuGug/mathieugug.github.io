# Widget de qualification business (qualif)

Widget diégétique : 6 mini-blocs distribués au fil de la prose d'un dossier deep-research (axes Maturité IA, Environnement, Cas d'usage, Équipe, Budget, Gouvernance), + récap radar SVG en fin d'article avec verdict + recos. Pattern pilote : `analytics-agentique-gcp/`. 3e signature visuelle du fil après les `.quiz-card` (carmine) et les `.callout` (teal) : couleur `--qualif: #5b6d8a` (slate-blue).

**Spec complète** : `docs/superpowers/specs/2026-05-23-business-qualification-widget-design.md` (à lire avant de calibrer un nouveau dossier).

## Quand l'utiliser

À déployer sur un dossier deep-research qui :

- Couvre un sujet où **un BM / Practice Manager pourrait l'utiliser comme support de qualif structurée en RDV** (les 6 axes génériques font sens dans le contexte du dossier).
- A au moins 6 sections h2 sur lesquelles accrocher les axes (chaque axe se positionne avant une section précise, en cohérence éditoriale entre la prose qui suit et la question posée).
- Mérite un one-pager A4 imprimable : verdict + 3 recos profil + 2 recos d'ajustement = ~5 puces actionnables pour glisser dans un dossier RDV.

Skip si le dossier est trop court (< 6 sections), trop technique (les axes business génériques tomberaient à plat), ou trop spécifique (la qualif générique 6 axes ne s'aligne pas avec le contenu).

## Architecture

```
<dossier>/
  qualif.json                   ← source de vérité (axes, inputs, profils, recos, règles)
  <YYYYmmdd>-<slug>-app.html    ← cible : 6 mini-blocs + récap injectés au fil de la prose

/assets/
  dossier-qualif.css            ← CSS partagé (mini-bloc, radar, récap, print)
  dossier-qualif.js             ← JS partagé (rendu inputs, calcul profil, radar SVG, LocalStorage)

tools/
  insert_qualif.py              ← injecteur idempotent (modèle insert-quizzes.py)

tests/
  qualif-contract.test.mjs      ← tests Node sur le moteur de calcul (lib)
  qualif-engine.test.mjs        ← tests règles d'ajustement
  qualif-integration.test.mjs   ← tests post-injection sur une app
```

**Couleur sémantique** : `--qualif: #5b6d8a` (slate-blue). 3e couleur du fil après `--carmine` (quiz) et `--teal` (callout).

**Persistance** : `localStorage['qualif_<slug>_v<n>']` — scoped par dossier, versioning par bump `_v<n>` (ancien profil silencieusement ignoré, pas de migration).

## Schéma `qualif.json`

Structure canonique (calibrage GCP simplifié pour illustration) :

```json
{
  "meta": {
    "slug": "<slug>",
    "version": 1,
    "title": "Profil de qualif — <sujet>",
    "recap_before_heading_id": "<id-section-finale>"
  },
  "axes": [
    {
      "id": "maturite-ia",
      "label": "Maturité IA",
      "before_heading_id": "<id-section-1>",
      "intro": "Question conversationnelle ouvrant l'axe",
      "inputs": [
        { "id": "stade", "type": "slider-anchored", "scoring": "axis",
          "label": "Stade actuel",
          "levels": [
            {"value": 0,   "label": "Exploration"},
            {"value": 25,  "label": "PoC"},
            {"value": 50,  "label": "Pilote"},
            {"value": 75,  "label": "Prod limitée"},
            {"value": 100, "label": "Prod à l'échelle"}
          ]
        },
        { "id": "freins", "type": "multi", "label": "Principaux freins ressentis", "max_picks": 3,
          "options": [{"id": "halluc", "label": "Hallucinations"}, ...] },
        { "id": "consommateurs", "type": "segmented", "label": "Qui consomme aujourd'hui ?",
          "options": [{"id": "data-team", "label": "Data team"}, ...] }
      ]
    }
    // 5 autres axes (environnement, cas-usage, equipe, budget, gouvernance)
  ],
  "profiles": [
    {
      "id": "explorer",
      "label": "Explorer",
      "anchor": [20, 30, 25, 15, 25, 30],
      "verdict": "Phase d'exploration. Risque principal : overengineering.",
      "recos": ["Cadrer 1-2 cas d'usage à valeur claire avant tooling.", "..."]
    }
    // 4 autres profils
  ],
  "adjustments": [
    {
      "id": "frein-hallucination",
      "when": {"axis": "maturite-ia", "input": "freins", "contains": "hallucinations"},
      "reco": "Le semantic layer (§4) est votre levier prioritaire — pas un meilleur prompt."
    }
    // règles additionnelles
  ]
}
```

**Contrats stricts** (vérifiés par `validate_qualif()` dans `tools/insert_qualif.py`) :

- `meta.slug` / `version` / `title` / `recap_before_heading_id` obligatoires.
- **Exactement 6 axes**, IDs uniques, chaque axe a `id` / `label` / `before_heading_id` / `intro` / `inputs`.
- Chaque axe contient **exactement 1 input avec `scoring: "axis"`** (le slider principal, ou un segmented avec `score` par option dans le cas Cas d'usage GCP).
- **5 profils minimum**, chaque profil a `id` unique + `anchor` = liste de **6 nombres** dans `[0..100]`.
- Chaque `adjustments[].when.axis` réfère à un axe existant.

Types d'input supportés :

| Type | Usage | `scoring: "axis"` possible ? |
|---|---|---|
| `slider-anchored` | Slider HTML5 + `<datalist>` HTML5 (paliers natifs Chrome/Edge/Safari, fallback gracieux Firefox). Labels descriptifs sous le slider, `aria-valuetext` annonce le palier. | Oui (toujours pour l'axe à slider) |
| `multi` | Checkboxes ; `max_picks` optionnel ; influence profil + recos via `adjustments`, jamais le score axial. | Non |
| `segmented` | Boutons radio façon segmented control. Peut porter `scoring: "axis"` + un `score` par option (cas axe Cas d'usage). | Oui (avec `score` par option) |

## Calibrage : choisir les `before_heading_id`

Chaque axe doit être ancré sur **une section précise du dossier dont la question posée éclaire le contenu qui suit** (logique diégétique). Pattern pilote GCP :

| Axe | Section d'accroche | Pourquoi |
|---|---|---|
| Maturité IA | §1 (thèse d'ouverture) | Le lecteur s'auto-positionne dès l'entrée. |
| Environnement / stack | §2 (anatomie technique) | La question stack précède la description du socle technique. |
| Cas d'usage | §3 (sélection de surface / d'option) | Le lecteur choisit avant que le dossier ne déroule les options. |
| Équipe | section "agents / orchestration" | L'équipe conditionne le régime atteignable. |
| Budget | section "obs / éval" ou équivalent post-prod | Le budget cadre l'industrialisation. |
| Gouvernance & conformité | section "régu" ou équivalent contraintes | La gouvernance arrive après la techno, comme dans le dossier. |
| **Récap** | section "feuille de route" ou "matrice de décision" finale | Le lecteur a son profil sous les yeux quand il enchaîne sur les actions. |

**Cas particulier — anchors sur `<section id="...">` plutôt que `<h2 id="...">`** : certains dossiers (ex. `surfaces-agentiques/`) ancrent les IDs sur les `<section>` wrappers et pas directement sur les `<h2>`. Le script `insert_qualif.py` détecte automatiquement les deux conventions (regex `<(?:h[23]|section) id="...">`). Rien à faire de spécial dans le JSON.

## Calibrage : slider levels

**Règle** : 4-5 paliers max, libellés courts (1-2 mots), valeurs équiréparties dans `[0..100]`.

- 5 paliers : `0, 25, 50, 75, 100` (recommandé pour les axes principaux).
- 4 paliers : `0, 33, 66, 100`.
- 3 paliers (rare, urgence/time-to-value) : `0, 50, 100`.

Les paliers s'affichent sous le slider en datalist HTML5 native (Chrome/Edge/Safari) + en mono-caps en `<div class="qualif-anchors">` (cross-browser).

**Calibration sémantique** : le palier à 50 est le **point de pivot pédagogique** du dossier. Sur GCP : `Pilote` = "vous avez quelque chose qui tourne mais pas en prod" = entre PoC trapped et Builder. Sur surfaces-agentiques : `SPA streamée` = "vous êtes en architecture moderne mais sans AG-UI" = entre SSR/SPA classique et AG-UI native.

## Calibrage : 5 profils + ancres

5 profils canoniques (à adapter au sujet) :

| Profil | Posture | Vecteur d'ancrage type | Verdict |
|---|---|---|---|
| **Explorer** | Découverte, pas de cas d'usage clair | `[20, 30, 25, 15, 25, 30]` | Risque d'overengineering. Cadrer le besoin avant le tooling. |
| **<X>-trapped** (PoC trapped, Chatbot-trapped, …) | Démos qui calent en prod | `[40, 50, 50, 35, 50, 35]` | Le coupable n'est pas le modèle — c'est le contexte/régime sous-dimensionné. |
| **Builder / Scaler** | Industrialisation | `[65, 70, 70, 65, 70, 50]` | Éviter la fragmentation : un seul socle, des standards, une eval centrale. |
| **Regulated** | Première contrainte = régu | `[50, 60, 50, 50, 60, 85]` | Commencer par la régu. Souveraineté / DLP / audit non-négociables. |
| **Pioneer** | Frontière techno | `[80, 80, 85, 80, 85, 60]` | Risque d'investir avant que les standards stabilisent. |

**Mapping utilisateur → profil** : distance euclidienne entre les 6 scores utilisateur et les 5 ancres. Le plus proche gagne. Tie-breaker (rarissime) : ordre prioritaire fixe `Regulated > Builder > <X>-trapped > Pioneer > Explorer` (sécurité d'abord, défini dans le JS lib).

**Vecteurs d'ancrage** : valeurs dans l'ordre des 6 axes du JSON. Ajuster pour qu'il y ait un écart minimum de ~20 points sur au moins 2 axes entre 2 profils adjacents (sinon tie-breaks systématiques).

## Calibrage : règles d'ajustement (`adjustments`)

Chaque règle déclenche **une reco additionnelle** quand son `when` matche l'état utilisateur. Max 2 recos d'ajustement affichées dans le récap (premières règles déclaratives gagnent).

Schéma `when` :

```json
{ "axis": "id-axe", "input": "id-input", "contains": "option-id" }     // multi/segmented
{ "axis": "id-axe", "input": "id-input", "contains_any_of": ["a","b"]} // multi
{ "axis": "id-axe", "input": "id-input", "not": "option-id" }          // segmented (negative)
{ "axis": "id-axe", "input": "id-input", "equals": "option-id" }       // segmented (positive)
{ "axis": "id-axe", "input": "id-input", "lt": 30 }                    // slider seuil
{ "axis": "id-axe", "input": "id-input", "gte": 50 }                   // slider seuil
{ "axis": "...", "and": { "axis": "...", ... } }                       // AND composition
{ "axis": "...", "and_not": { "axis": "...", ... } }                   // AND NOT composition
```

**Bonnes règles d'ajustement** :

- Pointer vers une section précise du dossier (le `(§N)` est load-bearing : montre que la reco est sourcée).
- Capturer une situation **typique mais pas couverte par les profils** (ex. cloud non-GCP dans un dossier GCP-first, contrainte AI Act dans un dossier industrie).
- Asymétrie : la même règle déclenchée sur 2 profils différents reste vraie (pas de logique conditionnelle dans la reco elle-même).

Volume cible : 8-12 règles déclaratives par dossier. Pas plus — le moteur ne montre que les 2 premières qui matchent.

## Commande d'injection

```bash
python tools/insert_qualif.py \
  --app <dossier>/<YYYYmmdd>-<slug>-app.html \
  --qualif <dossier>/qualif.json
```

Flags utiles :

- `--check` (dry-run) : valide + affiche les actions sans écrire.
- `--strict` : transforme les warnings (heading manquant) en erreurs.

**Idempotent** : ré-injection détecte les blocs existants par leur `data-axis` ou `id="qualif-recap"` et les remplace. Re-runner après chaque édition du JSON sans crainte.

Le script injecte / met à jour :

1. **6 `<aside class="qualif-step">`** un par axe, avant le `<h2 id="...">` ou `<section id="...">` cible.
2. **1 `<aside id="qualif-recap">`** avant le heading `meta.recap_before_heading_id`.
3. **1 `<aside id="qualif-nav">`** comme sidebar drawer (avant `<aside id="sources">`).
4. **1 `<button id="toggle-qualif">`** dans `<header class="topbar">` (avant `<nav class="back-nav">`) — bouton "Profil" qui ouvre le drawer qualif-nav.
5. **`<link rel="stylesheet" href="/assets/dossier-qualif.css">`** et **`<script src="/assets/dossier-qualif.js" defer>`** dans le `<head>` / `</body>` si absents.
6. **`<link rel="qualif-data" href="./qualif.json">`** dans le `<head>` (l'URL relative est calculée par le script).

## Tests CI

Suite Node `node:test` natif, zéro dépendance. À ajouter dans `.github/workflows/test.yml` :

- `tests/qualif-contract.test.mjs` — moteur de calcul (`computeAxisScore`, `dominantProfile`, `applyAdjustments`, rendu radar SVG).
- `tests/qualif-engine.test.mjs` — règles d'ajustement par cas.
- `tests/qualif-integration.test.mjs` — assertions post-injection sur un dossier (6 mini-blocs présents, data-axis distincts, lib CSS+JS référencée, data-bind du récap, ordre dans le DOM).

**Pour un nouveau dossier qualifié** : créer un fichier d'intégration parallèle (`tests/qualif-<slug>-integration.test.mjs`) qui charge l'app + qualif.json du dossier et exécute les mêmes assertions structurelles. Pattern à recopier depuis `tests/qualif-integration.test.mjs`.

## Anatomie visuelle (rappel HTML rendu)

```html
<aside class="qualif-step" id="qualif-step-<axis>" data-axis="<axis>">
  <header class="qualif-step__head">
    <p class="qualif-step__eyebrow">// votre profil — <Label axe></p>
    <p class="qualif-step__intro"><Question intro></p>
    <p class="qualif-step__witness" role="status" aria-live="polite">— En attente de saisie</p>
    <button class="qualif-step__toggle" type="button" aria-expanded="false">Renseigner →</button>
  </header>
  <div class="qualif-step__body" hidden>
    <fieldset class="qualif-input qualif-input--slider">…</fieldset>
    <fieldset class="qualif-input qualif-input--multi">…</fieldset>
    <fieldset class="qualif-input qualif-input--segmented">…</fieldset>
    <a class="qualif-step__see-recap" href="#qualif-recap" hidden>Voir mon profil ↓</a>
  </div>
</aside>
```

**Identité visuelle** :

- Bordure gauche `3px solid var(--qualif)` (slate-blue).
- Padding et rythme verticaux **identiques à `.quiz-card`** pour ne pas casser la cadence éditoriale.
- Eyebrow mono caps `// votre profil — <axe>` (signature alignée sur `// vérifier sa compréhension`).
- Pas de titre h3 séparé — l'intro fait office de titre conversationnel.
- Bloc collapsible par défaut : ouvert sur clic du bouton `Renseigner →`.

**Mobile** :

- Mini-bloc full-bleed avec padding `clamp(12px, 4vw, 20px)`.
- Slider : ancres en 5-col grid au-dessus de 480px, 3-col (min/milieu/max) en dessous.
- qualif-nav passe en drawer full-screen.

**Print** : `@media print` dans `/assets/dossier-qualif.css` masque tout sauf le récap → one-pager A4 propre pour glisser dans un dossier RDV. Pas besoin d'override repo.

## Gotchas

- **`<section id>` vs `<h2 id>`** : le script accepte les deux. Vérifier dans l'HTML cible quelle convention est utilisée (`grep -nE '<h2 id=|<section id=' <app.html>`).
- **Heading manquant** : sans `--strict`, le script logge un warning sur stderr et skip silencieusement l'axe — le `<aside>` n'est pas inséré. Toujours vérifier la sortie console.
- **Layout 4 colonnes** : la qualif-nav sort du flux grid (`position: fixed` drawer), donc pas d'impact sur les 3 colonnes existantes (toc / main / sources).
- **Topbar requise** : le script cherche `<nav class="back-nav">` dans `<header class="topbar">` pour y injecter le bouton "Profil". Si la topbar n'existe pas (cas rare des dossiers narratifs), le script logge `skipped (no back-nav anchor in topbar)` — le widget reste accessible via scroll, juste sans bouton d'ouverture du drawer.
- **`scoring: "axis"` manquant** : la validation échoue dur (`exactly 1 axial-scoring input`). Toujours marquer l'input principal (slider ou segmented avec scores) `"scoring": "axis"`.
- **Anchor à 6 valeurs** : la validation échoue si `profile.anchor` n'a pas exactement 6 entrées dans `[0..100]`. L'ordre suit l'ordre des axes dans le JSON.
- **LocalStorage scope** : la clé `qualif_<slug>_v1` est dérivée de `meta.slug`. Bumper `meta.version` quand on change le schéma d'un dossier déjà publié → l'ancien profil utilisateur est silencieusement ignoré (pas de migration).
