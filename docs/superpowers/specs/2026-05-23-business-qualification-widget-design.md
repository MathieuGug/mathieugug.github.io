# Widget de qualification business — design

**Date** : 2026-05-23
**Auteur** : Mathieu Guglielmino (brainstormé avec Claude)
**Pilote** : dossier `analytics-agentique-gcp/`
**Status** : draft, en revue

## Intention

Un widget de qualification business **diégétique** : 6 mini-blocs distribués au fil de la prose d'un dossier deep-research, qui invitent le lecteur (ou un Business Manager en RDV) à se positionner sur 6 axes à mesure qu'il avance dans la lecture. À la fin, un **récap agrégé** (radar SVG + verdict + recos prioritaires) imprimable en one-pager A4.

Le widget sert deux usages avec un seul flow :

- **Lecteur en libre service** : s'auto-positionne au fil de la lecture, obtient un diagnostic pédagogique en fin d'article.
- **BM / consultant en RDV** : utilise le widget devant le client comme support de qualif structurée, imprime le récap pour ses notes.

Pas de capture email. Pas de lead-gen explicite. Pas de tracker. Le widget est un artefact éditorial autonome, cohérent avec le reste du site.

Il s'insère dans le fil au même rang sémantique que les `.quiz-card` (vérification de compréhension) et les `.callout` (renvois inter-dossiers) — **3e signature visuelle** du fil, identifiée par une couleur dédiée (slate-blue).

## Architecture

```
analytics-agentique-gcp/
  qualif.json                   ← source de vérité (axes, inputs, profils, recos, règles)
  20260519-…-app.html           ← cible : 6 mini-blocs + récap injectés au fil de la prose

/assets/
  dossier-qualif.css            ← CSS partagé (mini-bloc, radar, récap, print)
  dossier-qualif.js             ← JS partagé (rendu inputs, calcul profil, radar SVG, LocalStorage)

tools/
  insert_qualif.py              ← injecteur idempotent (modèle insert-quizzes.py)

tests/
  qualif-contract.test.mjs      ← tests Node sur la lib
  qualif-integration.test.mjs   ← tests sur l'app GCP après injection
```

**Flux runtime** :

1. `dossier-qualif.js` initialise via `init()` (appelé au DOMContentLoaded, en cohabitation pacifique avec `dossier-app.js`).
2. Le JS détecte les `<aside class="qualif-step">` posés dans le DOM par `insert_qualif.py`, et le `<aside id="qualif-recap">`.
3. Chaque mini-bloc reçoit un binding events qui met à jour `localStorage['qualif_<slug>_v1']`.
4. À chaque `input`/`change` : recalcul du profil dominant + recos, refresh du récap si visible (animation `transition: d 300ms` sur les polygones SVG).
5. Le récap affiche radar + verdict + recos + boutons Imprimer/Réinitialiser.

**Conformité repo** :

- Pas de tracker, zéro dépendance tierce.
- LocalStorage scoped par slug : `qualif_<slug>_v<n>`.
- Print styles dans `dossier-qualif.css` : `@media print` qui masque tout sauf le récap, rendu en one-pager A4 portrait.
- Cohabite avec `/assets/dossier-app.{css,js}` sans conflit DOM ni double-init.

## Les 6 axes × 18 inputs (calibrage GCP)

Chaque axe est ancré sur une section précise du dossier GCP (logique diégétique). Pattern uniforme : **3 inputs par axe** = 1 slider ancré (donne le score 0-100) + 2 multi-select/segmented (enrichissent profil & recos).

| Axe | Inséré avant section | Input 1 (slider ancré → score axe) | Input 2 | Input 3 |
|---|---|---|---|---|
| **Maturité IA** | `le-nl-sql-brut-est-une-fausse-promesse` (§1) | Slider : Exploration → PoC → Pilote → Prod limitée → Prod à l'échelle | Multi (max 3) : freins ressentis (hallucinations, accuracy, latence, coûts, gouvernance, adoption métier, data quality) | Segmented : qui consomme (data team / métier outillé / métier autonome) |
| **Environnement / stack** | §2 chaîne data GCP | Slider : Silos → DWH central → Lakehouse → Data mesh | Multi : cloud(s) (GCP / AWS / Azure / FR-sov S3NS-OVH / on-prem) | Multi : solutions data clés (BigQuery / Snowflake / Databricks / Looker / Power BI / Tableau / dbt / Fivetran / autre) |
| **Cas d'usage** | §3 pyramide × chaîne | Segmented (scoring axial) : surface prioritaire (Conv analytics=50 / Agents custom=75 / MCP=75 / Indécis=0) | Multi (max 3) : cas d'usage prioritaires (chat data self-service / reporting auto / insights pro-actifs / anomalies / décisionnel agentique / externe clients) | Slider : urgence (exploratoire ↔ critique T+1) |
| **Équipe data/IA** | §6-7 agents + MCP | Slider : Pas d'équipe → Data sans IA → Squad IA → CoE IA → Foncières décentralisées | Segmented : ETP dédiés (0-5 / 5-20 / 20-50 / 50+) | Multi : compétences présentes (data eng / data sci / ML ops / prompt eng / sec IA / product data) |
| **Budget** | §8 obs+eval | Slider : <100k / 100-500k / 500k-2M / 2-10M / >10M €/an | Segmented : posture (Frileux / Mesuré / Engagé / Offensif) | Multi (max 3) : lignes prioritaires (socle data / plateforme agent / LLM / formation / conseil externe / conformité) |
| **Gouvernance & conformité** | §10 régu | Slider : Ad-hoc → Documenté → Outillé → Audité → Mesuré | Segmented : régime (Hors fin/santé / Finance / Banque-assurance / Santé / Public) | Multi : contraintes prioritaires (RGPD / AI Act / DORA / BCBS 239 / Souveraineté / Audit interne / SecOps) |

**Récap final** : injecté avant §12 (`12-feuille-de-route-18-mois`). Le lecteur/BM a son profil sous les yeux quand il enchaîne sur la roadmap.

**Slider ancré** : `<input type="range" step="25">` + `<datalist>` HTML5 (les tirets natifs s'affichent sous le slider sur Chrome/Edge/Safari, fallback gracieux Firefox). Labels descriptifs des paliers en dessous, mono petite caps. `aria-valuetext` annonce le palier ("Pilote") plutôt que la valeur (50).

## Schéma `qualif.json`

```json
{
  "meta": {
    "slug": "analytics-agentique-gcp",
    "version": 1,
    "title": "Profil de qualif — IA data sur GCP",
    "recap_before_heading_id": "12-feuille-de-route-18-mois"
  },
  "axes": [
    {
      "id": "maturite-ia",
      "label": "Maturité IA",
      "before_heading_id": "le-nl-sql-brut-est-une-fausse-promesse",
      "intro": "Où en êtes-vous sur l'usage IA de la data aujourd'hui ?",
      "inputs": [
        {
          "id": "stade",
          "type": "slider-anchored",
          "label": "Stade actuel",
          "scoring": "axis",
          "levels": [
            {"value": 0,   "label": "Exploration"},
            {"value": 25,  "label": "PoC"},
            {"value": 50,  "label": "Pilote"},
            {"value": 75,  "label": "Prod limitée"},
            {"value": 100, "label": "Prod à l'échelle"}
          ]
        },
        {
          "id": "freins",
          "type": "multi",
          "label": "Principaux freins ressentis",
          "max_picks": 3,
          "options": [
            {"id": "hallucinations", "label": "Hallucinations"},
            {"id": "accuracy",       "label": "Accuracy"},
            {"id": "latence",        "label": "Latence"},
            {"id": "couts",          "label": "Coûts"},
            {"id": "gouvernance",    "label": "Gouvernance"},
            {"id": "adoption",       "label": "Adoption métier"},
            {"id": "data-quality",   "label": "Data quality"}
          ]
        },
        {
          "id": "consommateurs",
          "type": "segmented",
          "label": "Qui consomme aujourd'hui ?",
          "options": [
            {"id": "data-team",       "label": "Data team"},
            {"id": "metier-outille",  "label": "Métier outillé"},
            {"id": "metier-autonome", "label": "Métier autonome"}
          ]
        }
      ]
    }
  ],
  "profiles": [
    {
      "id": "explorer",
      "label": "Explorer",
      "anchor": [20, 30, 25, 15, 25, 30],
      "verdict": "Phase d'exploration. Risque principal : overengineering — investir dans la plateforme avant d'avoir un cas d'usage à valeur claire.",
      "recos": [
        "Cadrer 1-2 cas d'usage à valeur claire avant tooling.",
        "Lire §3 (pyramide) puis §4 (semantic layer) en priorité.",
        "Le semantic décide, pas le modèle."
      ]
    }
  ],
  "adjustments": [
    {
      "id": "frein-hallucination",
      "when": {"axis": "maturite-ia", "input": "freins", "contains": "hallucinations"},
      "reco": "Le semantic layer (§4) est votre levier prioritaire — pas un meilleur prompt."
    }
  ]
}
```

**Types d'input supportés** :

- `slider-anchored` — slider HTML5 avec `<datalist>` des paliers ; valeur 0-100 ; `scoring: "axis"` si cet input fixe le score axial (toujours le cas du slider principal).
- `multi` — checkboxes ; `max_picks` optionnel ; influence profil + recos via `adjustments`, jamais le score axial.
- `segmented` — boutons radio façon segmented control ; peut porter `scoring: "axis"` (cas de l'axe Cas d'usage où il n'y a pas de slider) avec un `score` par option.

**Schéma `adjustments.when`** :

```json
{
  "axis": "id-axe",
  "input": "id-input",
  "contains": "option-id"   // pour multi/segmented
  // OU "lt": 30, "gt": 70  // pour les sliders (seuils)
}
```

Le récap affiche **verdict du profil dominant + 3 recos du profil + jusqu'à 2 recos d'ajustement** (ordre déclaratif du JSON, premières règles match gagnent).

## Les 5 profils types + règles d'ajustement (calibrage GCP)

**Vecteurs d'ancrage** sur les 6 axes dans l'ordre : Maturité IA / Environnement / Cas d'usage / Équipe / Budget / Gouvernance.

| Profil | Ancre | Verdict | Recos prioritaires |
|---|---|---|---|
| **Explorer** | [20, 30, 25, 15, 25, 30] | Phase d'exploration. Risque principal : overengineering — investir dans la plateforme avant d'avoir un cas d'usage à valeur claire. | Cadrer 1-2 cas d'usage à valeur claire avant tooling · Lire §3 (pyramide) puis §4 (semantic layer) · Le semantic décide, pas le modèle |
| **PoC trapped** | [40, 50, 50, 35, 50, 35] | Vous avez un PoC qui marche en démo mais cale en prod. Le coupable n'est jamais le modèle — c'est le contexte sémantique manquant. | Auditer l'accuracy par catégorie de question · Poser un semantic minimal (§4) avant de scaler · Mettre en place eval offline + Agent Analytics (§8) · Asymétrie 70/20/10 dès maintenant |
| **Builder / Scaler** | [65, 70, 70, 65, 70, 50] | En industrialisation. L'enjeu n'est plus de prouver, c'est d'éviter la fragmentation : un semantic layer, des MCP servers internes, une eval centrale. | Convergence sur un semantic unique · MCP banque interne sur Cloud Run (§7) · Agent Analytics natif sur ADK (§8) · A2A en mode pilote contrôlé |
| **Regulated / Banque** | [50, 60, 50, 50, 60, 85] | Votre première contrainte n'est pas technique — elle est réglementaire. DORA / AI Act / BCBS 239 redéfinissent le périmètre du faisable. | Démarrer par §10 (régu) · Assured Workloads EU + S3NS Premi3NS pour souveraineté · DLP runtime par défaut · Lineage Dataplex non-négociable · Eval offline obligatoire avant prod |
| **Pioneer** | [80, 80, 85, 80, 85, 60] | À la frontière. Le risque n'est pas de manquer la techno mais d'investir dans l'interop avant que les standards stabilisent. A2A et MCP sont encore en consolidation. | A2A en sandbox (§6) avant prod · Contribution upstream MCP · Observabilité agentique traitée comme produit interne · 70/20/10 reste valable même en pionnier |

**Mapping utilisateur → profil** : distance euclidienne entre les 6 scores utilisateur et les 5 ancres. Le plus proche gagne. Tie-breaker (rarissime) : ordre prioritaire fixe `Regulated > Builder > PoC > Pioneer > Explorer` pour stabilité.

**Règles d'ajustement** (recos additionnelles déclenchées par les inputs 2-3 ou par seuils sur les sliders) :

| Déclencheur | Reco ajoutée |
|---|---|
| `freins` contient `hallucinations` | Le semantic layer (§4) est votre levier prioritaire — pas un meilleur prompt. |
| `freins` contient `couts` | Lisez §8 — la dérive coût BigQuery se mesure en table BQ via Agent Analytics. |
| `freins` contient `gouvernance` ET `régime ≠ Hors fin/santé` | DLP runtime et Dataplex lineage doivent être actifs en J0, pas en plan. |
| `cloud` contient `AWS` ou `Azure` mais pas `GCP` | Ce dossier est GCP-first. La pyramide §3 reste portable ; les surfaces §5-7 sont à mapper sur votre stack. |
| `cloud` contient `FR-sov` | S3NS Premi3NS SecNumCloud 3.2 (§10) est probablement votre voie obligée pour les workloads OIV. |
| `surface` = `Indécis` | Commencez par §3 (pyramide × chaîne) — c'est le cadre de décision sur la surface. |
| `contraintes` contient `DORA` | DORA fait du cloud un sujet de conseil d'administration — voir §10 sur la désignation Google Cloud CTPP. |
| `contraintes` contient `AI Act` | Échéance 2 août 2026 pour l'Annexe III — scoring crédit est haut-risque par défaut. |
| `équipe.stade` = `Pas d'équipe` ET `maturité IA ≥ 50` | Risque de dette opérationnelle — staffer avant de scaler. |
| `budget.posture` = `Frileux` ET `maturité IA ≥ 50` | Le 70/20/10 (socle/agent/LLM) compte plus que le montant absolu — voir §11. |

**Volume cible du récap** : verdict (2-3 phrases du profil) + 3 recos du profil + max 2 recos d'ajustement = **~5 puces actionnables**.

## UX des mini-blocs

**Anatomie HTML** :

```html
<aside class="qualif-step" data-axis="maturite-ia">
  <header class="qualif-step__head">
    <p class="qualif-step__eyebrow">// votre profil — Maturité IA</p>
    <p class="qualif-step__intro">Une question structurante avant d'aborder la suite.</p>
  </header>
  <div class="qualif-step__body">
    <fieldset class="qualif-input qualif-input--slider">…slider ancré + labels paliers…</fieldset>
    <fieldset class="qualif-input qualif-input--multi">…checkboxes + max_picks…</fieldset>
    <fieldset class="qualif-input qualif-input--segmented">…radios stylés segmented…</fieldset>
  </div>
  <footer class="qualif-step__foot">
    <p class="qualif-step__witness" role="status" aria-live="polite">— En attente de saisie</p>
    <a class="qualif-step__see-recap" href="#qualif-recap">Voir mon profil ↓</a>
  </footer>
</aside>
```

**Identité visuelle** :

- Bordure gauche `3px solid var(--qualif)` avec `--qualif: #5b6d8a` (slate-blue), 3e couleur sémantique du fil après `--carmine` (quiz) et `--teal` (callout).
- Padding et rythme verticaux **identiques à `.quiz-card`** pour ne pas casser la cadence éditoriale.
- Eyebrow mono caps `// votre profil — <axe>` (signature alignée sur `// vérifier sa compréhension`).
- Pas de titre h3 séparé — l'intro fait office de titre conversationnel.

**3 états du témoin (footer)** :

| État | Témoin (gauche) | Bouton (droite) |
|---|---|---|
| Empty | `— En attente de saisie` | (caché) |
| Partial | `2 sur 3 renseignés` | `Voir mon profil ↓` |
| Complete | `✓ Axe pris en compte` | `Voir mon profil ↓` |

Le bouton `Voir mon profil ↓` est un `<a href="#qualif-recap">` — scroll smooth via `scroll-behavior: smooth` sur `html`. Apparaît dès la 1re saisie significative, dispo dans chaque mini-bloc.

**Accessibilité** :

- Chaque `<fieldset>` a son `<legend>`.
- Slider : `aria-valuetext` dynamique (palier courant), `aria-valuemin/max/now`.
- Témoin `role="status" aria-live="polite"`.
- Tout navigable au clavier.

**Mobile** :

- Mini-bloc full-bleed avec padding `clamp(12px, 4vw, 20px)`.
- Slider : ancres en 5-col grid au-dessus de 480px, 3-col (min/milieu/max) en dessous.
- Multi-select : 1 colonne.
- Segmented : wrap à 2 lignes max ; fallback `<select>` natif si > 5 options.

## UX du récap

**Anatomie HTML** :

```html
<aside id="qualif-recap" class="qualif-recap" aria-labelledby="qualif-recap-title">
  <header class="qualif-recap__head">
    <p class="qualif-recap__eyebrow">// votre profil — diagnostic</p>
    <h3 id="qualif-recap-title">Profil <strong data-bind="profile-label">…</strong></h3>
  </header>

  <div class="qualif-recap__grid">
    <figure class="qualif-recap__radar">
      <svg viewBox="0 0 320 320" role="img" aria-labelledby="radar-t radar-d">
        <title id="radar-t">Radar du profil</title>
        <desc id="radar-d" data-bind="radar-desc">…</desc>
        <!-- 6 axes + hexagone gradué 25/50/75/100 + polygone profil cible + polygone utilisateur -->
      </svg>
      <figcaption data-bind="radar-caption">…</figcaption>
    </figure>

    <div class="qualif-recap__body">
      <p class="qualif-recap__verdict" data-bind="verdict">…</p>
      <ul class="qualif-recap__recos" data-bind="recos"></ul>
    </div>
  </div>

  <footer class="qualif-recap__foot">
    <p class="qualif-recap__meta">
      Profil établi le <time data-bind="ts">…</time> ·
      <span data-bind="completeness">N sur 6 axes renseignés</span>
    </p>
    <div class="qualif-recap__actions">
      <button type="button" data-action="print">Imprimer le récap</button>
      <button type="button" data-action="reset" class="is-quiet">Réinitialiser</button>
    </div>
  </footer>
</aside>
```

**Le radar SVG** (peint en JS) :

- 6 axes à 60° d'angle, étiquetés autour (mono petite caps).
- Grille polygonale concentrique 25 / 50 / 75 / 100.
- **Polygone "profil cible"** (l'ancre du profil dominant) : `--qualif` fill `opacity 0.10` + stroke dashed `2px`.
- **Polygone "utilisateur"** (les 6 scores) : `--accent` fill `opacity 0.25` + stroke solid `2px`.
- Petits points circulaires sur chaque sommet du polygone utilisateur (3px).
- Légende discrète sous le radar : `─ Vous · ┄ Profil cible <label>`.
- Animation `transition: d 300ms` à chaque recalcul.

**3 états du récap** :

| État | Quand | Affichage |
|---|---|---|
| **Vide** | 0 axes renseignés | Verdict gris : "Aucun axe renseigné. Complétez les blocs ci-dessus pour faire apparaître votre profil." Radar : juste grille + axes, pas de polygone utilisateur. Boutons Imprimer/Réinitialiser désactivés. |
| **Partiel** | 1-5 axes renseignés | Verdict du profil dominant calculé sur les axes renseignés (axes manquants pris à 50 — neutre). Marqueur méta : "Profil provisoire — N sur 6 axes renseignés". Polygone affiché. Imprimer activé. |
| **Complet** | 6 axes renseignés | Verdict + 3 recos profil + jusqu'à 2 recos ajustement. Méta : "6 sur 6 axes renseignés". Polygone plein. |

**Recos visuelles** :

- Recos du profil : puces standard, couleur prose.
- Recos d'ajustement : préfixe `↪` en `--qualif` pour les distinguer — recos "personnalisées" basées sur les choix spécifiques. Max 2.

**Actions** :

- **Imprimer** → `window.print()`. CSS print masque topbar, sidebars, prose, mini-blocs ; agrandit le récap pour A4 portrait ; header (titre dossier + date) et footer (URL + © Mathieu Guglielmino) imprimés.
- **Réinitialiser** → `confirm()` natif → vide localStorage, reset inputs, refresh récap. Style discret (lien souligné, pas bouton primaire).

**Persistance et horodatage** :

- LocalStorage clé `qualif_<slug>_v1` : `{ inputs: {...}, ts: ISO8601, dominant_profile: "builder" }`.
- `<time datetime="...">` affiché en français court ("23 mai 2026 · 14h32").
- Versioning de la clé : bump schéma → ancien profil ignoré silencieusement, pas de migration.

**Accessibilité** :

- Verdict en `role="status" aria-live="polite"`.
- Le SVG radar a `<title>` + `<desc>` data-bound qui décrivent textuellement : "Vous êtes sur le profil Builder. Vos scores : Maturité IA 65, Environnement 70, …".
- Reset : ouvre une vraie `confirm()` native.
- Boutons disabled quand récap vide ont `aria-disabled="true"`.

## `tools/insert_qualif.py`

Modèle calqué sur `insert-quizzes.py` (idempotent, dry-run, strict mode).

**Flux** :

1. Parse args : `--app <path/to/app.html>` `--qualif <path/to/qualif.json>` `[--check]` `[--strict]`.
2. **Charge + valide le JSON** :
   - 6 axes uniques, chaque `before_heading_id` non-vide, inputs présents.
   - 5 profils uniques, chaque `anchor` = liste de 6 floats `[0..100]`.
   - Chaque `adjustments.when.axis` / `.input` / `.contains` réfère à un élément existant — sinon erreur claire.
   - Meta `recap_before_heading_id` présent.
3. **Vérifie l'HTML cible** : chaque `before_heading_id` correspond à un `<h2 id="...">` ou `<h3 id="...">`. Warning stderr (default) ou raise (`--strict`).
4. **Détecte la lib partagée** : cherche `<link rel="stylesheet" href="/assets/dossier-qualif.css">` et `<script src="/assets/dossier-qualif.js"`. Si absent → ajoute les tags juste après ceux de `dossier-app.{css,js}`. Idempotent.
5. **Rend et injecte chaque mini-bloc** :
   - Cible : `<aside class="qualif-step" data-axis="{id}">…</aside>`.
   - Si présent → replace en place.
   - Sinon → insère avant `<h2 id="{before_heading_id}">` ou `<h3 id="...">` (avec gestion `<hr />` précédent).
6. **Rend et injecte le récap** : cible `<aside id="qualif-recap" class="qualif-recap">…</aside>`.
7. **Logs** : action par axe et récap (`inserted` / `replaced` / `skipped` / `warning`).

**Rendu HTML** : templates Python (f-strings, zéro dep). 3 fonctions : `render_slider_anchored(input_def)`, `render_multi(input_def)`, `render_segmented(input_def)`. Plus `render_step(axis)` et `render_recap(meta)` (squelette vide, le JS remplit les `data-bind`).

**Échappement HTML** : tout libellé du JSON passe par `html.escape()` avant injection.

**Flags** :

- `--check` (dry-run) : calcule sans écrire, imprime les actions prévues.
- `--strict` : warnings → errors.

**Invocation type** :

```bash
python tools/insert_qualif.py \
  --app analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html \
  --qualif analytics-agentique-gcp/qualif.json
```

## Tests CI

`tests/qualif-contract.test.mjs` (Node `--test` natif, zéro dep) :

| Test | Vérifie |
|---|---|
| `parse(qualif.json)` valide le schéma canonique GCP | Pas de régression sur le sidecar GCP |
| `computeAxisScore(input)` retourne 0-100 pour les 3 types d'input | Slider : valeur brute ; Multi : 0 (pas axial) ; Segmented avec `scoring: "axis"` : score de l'option choisie |
| `dominantProfile(vec)` retourne le bon profil sur 5 vecteurs de test | Un vecteur par profil (`[20,30,25,15,25,30] → "explorer"`, etc.) |
| `dominantProfile(vec)` tie-breaker stable | Vecteur à mi-chemin entre 2 profils → ordre `Regulated > Builder > PoC > Pioneer > Explorer` |
| `applyAdjustments(state)` déclenche les bonnes recos | Pour chaque règle du JSON GCP, un cas qui la déclenche + un cas qui ne la déclenche pas |
| `renderRadarPath(scores)` produit un `d=` SVG valide | Vecteur → polygone 6 sommets, pas de NaN |
| Pas plus de 2 recos d'ajustement dans le récap | 5 déclencheurs → seulement les 2 premiers déclaratifs |

`tests/qualif-integration.test.mjs` :

| Test | Vérifie |
|---|---|
| L'HTML GCP contient 6 `<aside class="qualif-step">` et 1 `<aside id="qualif-recap">` | Post-run du script |
| Chaque mini-bloc a un `data-axis` unique parmi les 6 axes du JSON | Pas de désynchro JSON/HTML |
| `/assets/dossier-qualif.css` et `.js` référencés | Lib bien wired |
| Le récap a tous les `data-bind` attendus | Pas de breakage du contrat lib ↔ template |

Run local et CI :

```bash
node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs \
  tests/qualif-contract.test.mjs tests/qualif-integration.test.mjs
```

Zéro dépendance, < 5 s comme l'existant.

## Hors scope (YAGNI explicite)

- **Pas de capture email / lead-gen** : décision tranchée dès la finalité. À ré-évaluer plus tard si besoin métier émerge.
- **Pas d'URL partageable encodée** : option discutée mais écartée — LocalStorage + impression suffisent pour le couple lecteur/BM.
- **Pas de markdown clipboard** : Print/PDF est la sortie professionnelle ciblée.
- **Pas d'A/B testing, pas de tracking d'usage** : cohérent avec règle repo "pas de tracker".
- **Pas de migration entre versions de schéma** : bump `_v<n>` → ancien profil silencieusement ignoré.
- **Pas de multi-langue** : le widget est FR comme le reste du site, pas de plomberie i18n.
- **Pas de "second widget en milieu de dossier"** : option explorée, écartée pour ne pas dupliquer l'effort éditorial sur ce premier pilote.

## Critères de succès

Le widget est considéré opérationnel quand :

1. `node --test tests/qualif-contract.test.mjs tests/qualif-integration.test.mjs` passe.
2. L'app GCP affiche 6 mini-blocs au bon endroit (visuel + scroll fluide).
3. Saisie utilisateur → récap se met à jour en live (radar animé, verdict, recos).
4. Print de l'app GCP produit un one-pager A4 propre (vérifié en preview navigateur).
5. LocalStorage persiste correctement (fermer/rouvrir l'onglet → reprise).
6. Reset fonctionne (confirm + vide bien tout).
7. Pages relues sur mobile (≤ 480px) : mini-blocs et récap restent lisibles et utilisables.
8. Pattern reproductible : un 2e dossier candidat aurait juste à écrire son `qualif.json` (calibré sur son contenu) et relancer `insert_qualif.py`.

## Décisions clés (récap pour décideurs)

| Décision | Choix | Pourquoi |
|---|---|---|
| Finalité primaire | Lecteur + BM avec même flow, pas de capture | Cohérence éditoriale, pas de friction |
| Articulation axes | Génériques, fixes (6) — sidecar JSON par dossier | Réutilisable, calibrage local |
| Forme diagnostic | Radar + verdict + recos | "Vrai diagnostic", exportable |
| Densité formulaire | 3 inputs par axe (~18 total) | Sweet spot widget avancé |
| Placement | Mini-blocs distribués + récap final | Diégétique, suit la prose |
| Mécanique verdict | Hybride profils + règles d'ajustement | Profil lisible + recos personnalisées |
| Export | Print/PDF + LocalStorage | Pro pour RDV, pas de URL fragile |
| Couleur sémantique | Slate-blue `#5b6d8a` | 3e couleur après `--carmine` (quiz) et `--teal` (callout) |
