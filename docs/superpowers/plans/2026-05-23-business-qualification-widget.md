# Widget de qualification business — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire un widget de qualification diégétique pour les dossiers deep-research : 6 mini-blocs distribués au fil de la prose (axes Maturité IA, Environnement, Cas d'usage, Équipe, Budget, Gouvernance) + récap radar SVG en fin d'article, calibré en pilote sur `analytics-agentique-gcp/`.

**Architecture:** Sidecar JSON par dossier (`qualif.json`) + lib partagée `/assets/dossier-qualif.{js,css}` (IIFE passive auto-bootstrap, lit le DOM, persiste LocalStorage) + injecteur Python `tools/insert_qualif.py` idempotent calqué sur `insert-quizzes.py`. Mapping utilisateur → profil par distance euclidienne sur 6 axes vers 5 personas, + max 2 recos d'ajustement via règles déclaratives.

**Tech Stack:** Vanilla HTML/CSS/JS (zéro dépendance runtime), Python 3 (script d'injection, stdlib uniquement), Node 20+ `node:test` (suite de tests), GitHub Actions (CI existante à étendre).

**Spec:** `docs/superpowers/specs/2026-05-23-business-qualification-widget-design.md` — à lire avant la première tâche.

**Branche:** `claude/business-qualif-widget-2026-05-23` (déjà créée depuis `main`, spec déjà committé).

---

## Phase 0 — Bases

À la fin de cette phase : le contexte est chargé, les fichiers de référence repérés.

### Task 0.1 — Lecture spec et fichiers de référence

**Files:**
- Read: `docs/superpowers/specs/2026-05-23-business-qualification-widget-design.md`
- Read: `.claude/skills/illustrated-deep-research/assets/insert-quizzes.py` (modèle Python à calquer)
- Read: `assets/dossier-app.js` (lib partagée existante, pour cohabiter sans conflit)
- Read: `tests/lib-contract.test.mjs` (modèle de tests Node natifs)
- Read: `analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html` (cible d'injection)

- [ ] **Step 1: Lire le spec en entier**

Le spec contient le contrat exhaustif (axes, profils, règles d'ajustement, schéma JSON, anatomie HTML, CSS variables). Toute décision d'ambiguïté pendant l'implémentation doit s'y référer.

- [ ] **Step 2: Repérer les IDs des headings cibles dans l'app GCP**

Run:
```bash
grep -nE '<h[23] id=' analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html | head -30
```

Attendu : les IDs `le-nl-sql-brut-est-une-fausse-promesse`, `2-anatomie-de-la-chaine-data-gcp-avant-agents`, `3-trois-surfaces-agentiques-pyramide-x-chaine`, `6-agents-custom-vertex-agent-builder-adk-a2a`, `8-observabilite-evaluation-data-agentique`, `10-banque-francaise-tier-1-section-regu`, `12-feuille-de-route-18-mois` doivent exister (au moins approximativement — on validera les slugs exacts en Task 1.1).

Si un slug diffère (ex. `1-...` vs sans préfixe numérique), noter la version exacte du fichier pour adapter le JSON.

- [ ] **Step 3: Vérifier l'absence de fichiers conflictuels**

Run:
```bash
ls assets/dossier-qualif.* 2>/dev/null
ls tools/insert_qualif.py 2>/dev/null
ls analytics-agentique-gcp/qualif.json 2>/dev/null
ls tests/qualif-*.test.mjs 2>/dev/null
```

Attendu : aucun fichier (sinon partir d'un état non-vierge).

---

## Phase 1 — Sidecar JSON `qualif.json` et validation

À la fin de cette phase : `analytics-agentique-gcp/qualif.json` existe et valide le schéma. Premier test Node passe.

### Task 1.1 — Récupérer les IDs exacts des headings GCP

**Files:**
- Read: `analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html`

- [ ] **Step 1: Lister les headings h2 et h3 avec leurs IDs**

Run:
```bash
grep -nE '<h[23] id="[^"]+"' analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html
```

- [ ] **Step 2: Noter les 7 ancres cibles**

Tu dois identifier dans la sortie :
- Le heading qui annonce la falaise NL→SQL (avant lequel va l'axe Maturité IA)
- Le heading §2 chaîne data (avant lequel va l'axe Environnement)
- Le heading §3 pyramide (avant lequel va l'axe Cas d'usage)
- Le heading §6 agents custom (avant lequel va l'axe Équipe — l'axe est posé entre §6 et §8, donc on prend le `before_heading_id` qui pointe sur §8 obs+eval pour positionnement avant §8)

Correction : selon le spec, l'axe Équipe est placé entre §6-7 et §8. On prend le `before_heading_id` du **heading §8 obs+eval** (qui place le bloc juste avant §8, après §6-7).

- Le heading §8 (avant lequel va l'axe Budget — non, l'axe Budget se place après §8 et avant §10. Donc `before_heading_id` = celui de §10 régu)

Re-lecture spec : axe Budget = "Inséré avant §8 obs+eval"? Non — le spec dit "§8 obs+eval" comme section ancre. Re-lecture précise du spec table :
- Maturité IA : avant §1 falaise (avant heading "le-nl-sql-brut-est-une-fausse-promesse")
- Environnement : avant §2 chaîne data
- Cas d'usage : avant §3 pyramide × chaîne
- Équipe : avant §6-7 → avant heading §6 agents custom (entre §5 et §6)
- Budget : avant §8 obs+eval
- Gouvernance & conformité : avant §10 régu
- Récap : avant §12 feuille de route

Donc 7 IDs à noter (6 axes + 1 récap). Tu auras besoin des valeurs exactes des attributs `id="..."` en Task 1.2.

- [ ] **Step 3: Vérifier visuellement les ID dans l'app**

Si un ID a un format inattendu (ex. caractères accentués, préfixe différent), noter pour adapter le JSON. Le slug exact est celui qui apparaît dans l'HTML, sans toucher au dossier.

### Task 1.2 — Créer `analytics-agentique-gcp/qualif.json` (squelette + meta + 1 axe)

**Files:**
- Create: `analytics-agentique-gcp/qualif.json`

- [ ] **Step 1: Créer le fichier avec la structure complète mais 1 seul axe**

Crée `analytics-agentique-gcp/qualif.json` :

```json
{
  "meta": {
    "slug": "analytics-agentique-gcp",
    "version": 1,
    "title": "Profil de qualif — IA data sur GCP",
    "recap_before_heading_id": "PLACEHOLDER_TO_FILL_FROM_TASK_1_1"
  },
  "axes": [
    {
      "id": "maturite-ia",
      "label": "Maturité IA",
      "before_heading_id": "PLACEHOLDER_TO_FILL_FROM_TASK_1_1",
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
  "profiles": [],
  "adjustments": []
}
```

Remplace les `PLACEHOLDER_TO_FILL_FROM_TASK_1_1` par les vrais slugs trouvés en Task 1.1.

- [ ] **Step 2: Valider JSON syntaxiquement**

Run:
```bash
python -c "import json; json.load(open('analytics-agentique-gcp/qualif.json'))" && echo "OK"
```

Attendu : `OK` (pas d'exception).

- [ ] **Step 3: Commit**

```bash
git add analytics-agentique-gcp/qualif.json
git commit -m "qualif(gcp): squelette sidecar JSON avec 1er axe Maturité IA"
```

### Task 1.3 — Compléter `qualif.json` avec les 5 autres axes

**Files:**
- Modify: `analytics-agentique-gcp/qualif.json`

- [ ] **Step 1: Ajouter les 5 axes restants**

Dans `analytics-agentique-gcp/qualif.json`, après l'axe `maturite-ia`, ajoute (dans le tableau `axes`) :

```json
{
  "id": "environnement",
  "label": "Environnement / stack",
  "before_heading_id": "<id-section-§2>",
  "intro": "Quelle est votre stack data aujourd'hui ?",
  "inputs": [
    {
      "id": "architecture",
      "type": "slider-anchored",
      "label": "Architecture data dominante",
      "scoring": "axis",
      "levels": [
        {"value": 0,   "label": "Silos métiers"},
        {"value": 33,  "label": "DWH central"},
        {"value": 66,  "label": "Lakehouse moderne"},
        {"value": 100, "label": "Data mesh"}
      ]
    },
    {
      "id": "cloud",
      "type": "multi",
      "label": "Cloud(s) en place",
      "options": [
        {"id": "gcp",      "label": "GCP"},
        {"id": "aws",      "label": "AWS"},
        {"id": "azure",    "label": "Azure"},
        {"id": "fr-sov",   "label": "FR-sov (S3NS / OVH / Outscale)"},
        {"id": "on-prem",  "label": "On-prem"}
      ]
    },
    {
      "id": "solutions",
      "type": "multi",
      "label": "Solutions data clés",
      "options": [
        {"id": "bigquery",   "label": "BigQuery"},
        {"id": "snowflake",  "label": "Snowflake"},
        {"id": "databricks", "label": "Databricks"},
        {"id": "looker",     "label": "Looker"},
        {"id": "powerbi",    "label": "Power BI"},
        {"id": "tableau",    "label": "Tableau"},
        {"id": "dbt",        "label": "dbt"},
        {"id": "fivetran",   "label": "Fivetran"},
        {"id": "autre",      "label": "Autre"}
      ]
    }
  ]
},
{
  "id": "cas-usage",
  "label": "Cas d'usage",
  "before_heading_id": "<id-section-§3>",
  "intro": "Quelles surfaces vous parlent en priorité ?",
  "inputs": [
    {
      "id": "surface",
      "type": "segmented",
      "label": "Surface agentique prioritaire",
      "scoring": "axis",
      "options": [
        {"id": "conv-analytics", "label": "Conv analytics", "score": 50},
        {"id": "agents-custom",  "label": "Agents custom",  "score": 75},
        {"id": "mcp",            "label": "MCP & connecteurs", "score": 75},
        {"id": "indecis",        "label": "Indécis",        "score": 0}
      ]
    },
    {
      "id": "use-cases",
      "type": "multi",
      "label": "Cas d'usage prioritaires",
      "max_picks": 3,
      "options": [
        {"id": "chat-data",       "label": "Chat data self-service"},
        {"id": "reporting-auto",  "label": "Reporting auto-généré"},
        {"id": "insights",        "label": "Insights pro-actifs"},
        {"id": "anomalies",       "label": "Anomalies / monitoring"},
        {"id": "decisionnel",     "label": "Décisionnel agentique"},
        {"id": "externe",         "label": "Externe (clients / partenaires)"}
      ]
    },
    {
      "id": "urgence",
      "type": "slider-anchored",
      "label": "Urgence du sujet",
      "levels": [
        {"value": 0,   "label": "Exploratoire"},
        {"value": 50,  "label": "Plan annuel"},
        {"value": 100, "label": "Critique T+1"}
      ]
    }
  ]
},
{
  "id": "equipe",
  "label": "Équipe data/IA",
  "before_heading_id": "<id-section-§6>",
  "intro": "Quelle est votre force de frappe data/IA ?",
  "inputs": [
    {
      "id": "structure",
      "type": "slider-anchored",
      "label": "Structure équipe",
      "scoring": "axis",
      "levels": [
        {"value": 0,   "label": "Pas d'équipe"},
        {"value": 25,  "label": "Data sans IA"},
        {"value": 50,  "label": "Squad IA"},
        {"value": 75,  "label": "CoE IA central"},
        {"value": 100, "label": "Foncières IA décentralisées"}
      ]
    },
    {
      "id": "etp",
      "type": "segmented",
      "label": "ETP dédiés data/IA",
      "options": [
        {"id": "0-5",   "label": "0-5"},
        {"id": "5-20",  "label": "5-20"},
        {"id": "20-50", "label": "20-50"},
        {"id": "50+",   "label": "50+"}
      ]
    },
    {
      "id": "competences",
      "type": "multi",
      "label": "Compétences présentes",
      "options": [
        {"id": "data-eng",    "label": "Data engineering"},
        {"id": "data-sci",    "label": "Data science"},
        {"id": "ml-ops",      "label": "ML ops"},
        {"id": "prompt-eng",  "label": "Prompt engineering"},
        {"id": "sec-ia",      "label": "Sécurité IA"},
        {"id": "product-data","label": "Product data"}
      ]
    }
  ]
},
{
  "id": "budget",
  "label": "Budget",
  "before_heading_id": "<id-section-§8>",
  "intro": "Quelle posture d'investissement sur ces sujets ?",
  "inputs": [
    {
      "id": "montant",
      "type": "slider-anchored",
      "label": "Budget annuel data/IA",
      "scoring": "axis",
      "levels": [
        {"value": 0,   "label": "< 100k €"},
        {"value": 25,  "label": "100k-500k €"},
        {"value": 50,  "label": "500k-2M €"},
        {"value": 75,  "label": "2M-10M €"},
        {"value": 100, "label": "> 10M €"}
      ]
    },
    {
      "id": "posture",
      "type": "segmented",
      "label": "Posture",
      "options": [
        {"id": "frileux",  "label": "Frileux"},
        {"id": "mesure",   "label": "Mesuré"},
        {"id": "engage",   "label": "Engagé"},
        {"id": "offensif", "label": "Offensif"}
      ]
    },
    {
      "id": "lignes",
      "type": "multi",
      "label": "Lignes prioritaires d'invest",
      "max_picks": 3,
      "options": [
        {"id": "socle",      "label": "Socle data (lineage, semantic, DLP)"},
        {"id": "plateforme", "label": "Plateforme agent (orchestration, MCP)"},
        {"id": "llm",        "label": "LLM (licences, fine-tune)"},
        {"id": "formation",  "label": "Formation équipe"},
        {"id": "conseil",    "label": "Conseil externe"},
        {"id": "conformite", "label": "Conformité / audit"}
      ]
    }
  ]
},
{
  "id": "gouvernance",
  "label": "Gouvernance & conformité",
  "before_heading_id": "<id-section-§10>",
  "intro": "Où en êtes-vous sur la gouvernance et la conformité ?",
  "inputs": [
    {
      "id": "maturite",
      "type": "slider-anchored",
      "label": "Maturité gouvernance",
      "scoring": "axis",
      "levels": [
        {"value": 0,   "label": "Ad-hoc"},
        {"value": 25,  "label": "Documenté"},
        {"value": 50,  "label": "Outillé"},
        {"value": 75,  "label": "Audité"},
        {"value": 100, "label": "Mesuré / automatisé"}
      ]
    },
    {
      "id": "regime",
      "type": "segmented",
      "label": "Régime applicable",
      "options": [
        {"id": "hors-fin-sante", "label": "Hors fin/santé"},
        {"id": "finance",         "label": "Finance"},
        {"id": "banque-assur",    "label": "Banque-assurance"},
        {"id": "sante",           "label": "Santé"},
        {"id": "public",          "label": "Secteur public"}
      ]
    },
    {
      "id": "contraintes",
      "type": "multi",
      "label": "Contraintes prioritaires",
      "options": [
        {"id": "rgpd",         "label": "RGPD"},
        {"id": "ai-act",       "label": "AI Act"},
        {"id": "dora",         "label": "DORA"},
        {"id": "bcbs-239",     "label": "BCBS 239"},
        {"id": "souverainete", "label": "Souveraineté"},
        {"id": "audit-int",    "label": "Audit interne"},
        {"id": "sec-ops",      "label": "SecOps"}
      ]
    }
  ]
}
```

Remplace les 5 `<id-section-§X>` par les vrais slugs trouvés en Task 1.1.

- [ ] **Step 2: Valider JSON syntaxiquement**

Run:
```bash
python -c "import json; d = json.load(open('analytics-agentique-gcp/qualif.json')); print(f'{len(d[\"axes\"])} axes OK')"
```

Attendu : `6 axes OK`.

- [ ] **Step 3: Commit**

```bash
git add analytics-agentique-gcp/qualif.json
git commit -m "qualif(gcp): 5 axes restants — environnement, cas d'usage, équipe, budget, gouvernance"
```

### Task 1.4 — Compléter `qualif.json` avec les 5 profils + 10 règles

**Files:**
- Modify: `analytics-agentique-gcp/qualif.json`

- [ ] **Step 1: Remplir le tableau `profiles`**

Dans `analytics-agentique-gcp/qualif.json`, remplacer `"profiles": []` par :

```json
"profiles": [
  {
    "id": "explorer",
    "label": "Explorer",
    "anchor": [20, 30, 25, 15, 25, 30],
    "verdict": "Phase d'exploration. Le risque principal est l'overengineering — investir dans la plateforme avant d'avoir un cas d'usage à valeur claire.",
    "recos": [
      "Cadrer 1-2 cas d'usage à valeur claire avant tooling.",
      "Lire §3 (pyramide) puis §4 (semantic layer) en priorité.",
      "Le semantic décide, pas le modèle."
    ]
  },
  {
    "id": "poc-trapped",
    "label": "PoC trapped",
    "anchor": [40, 50, 50, 35, 50, 35],
    "verdict": "Vous avez un PoC qui marche en démo mais cale en prod. Le coupable n'est jamais le modèle — c'est le contexte sémantique manquant.",
    "recos": [
      "Auditer l'accuracy par catégorie de question.",
      "Poser un semantic minimal (§4) avant de scaler.",
      "Mettre en place eval offline + Agent Analytics (§8).",
      "Asymétrie 70/20/10 dès maintenant."
    ]
  },
  {
    "id": "builder",
    "label": "Builder / Scaler",
    "anchor": [65, 70, 70, 65, 70, 50],
    "verdict": "Vous êtes en industrialisation. L'enjeu n'est plus de prouver — c'est d'éviter la fragmentation : un seul semantic layer, des MCP servers internes, une eval centrale.",
    "recos": [
      "Convergence sur un semantic unique.",
      "MCP banque interne sur Cloud Run (§7).",
      "Agent Analytics natif sur ADK (§8).",
      "A2A en mode pilote contrôlé."
    ]
  },
  {
    "id": "regulated",
    "label": "Regulated / Banque",
    "anchor": [50, 60, 50, 50, 60, 85],
    "verdict": "Votre première contrainte n'est pas technique — elle est réglementaire. DORA / AI Act / BCBS 239 redéfinissent le périmètre du faisable.",
    "recos": [
      "Démarrer par §10 (régu).",
      "Assured Workloads EU + S3NS Premi3NS pour souveraineté.",
      "DLP runtime par défaut.",
      "Lineage Dataplex non-négociable.",
      "Eval offline obligatoire avant prod."
    ]
  },
  {
    "id": "pioneer",
    "label": "Pioneer",
    "anchor": [80, 80, 85, 80, 85, 60],
    "verdict": "Vous êtes à la frontière. Le risque n'est pas de manquer la techno mais d'investir dans l'interop avant que les standards stabilisent.",
    "recos": [
      "A2A en sandbox (§6) avant prod.",
      "Contribution upstream MCP.",
      "Observabilité agentique traitée comme produit interne.",
      "70/20/10 reste valable même en pionnier."
    ]
  }
]
```

- [ ] **Step 2: Remplir le tableau `adjustments`**

Remplacer `"adjustments": []` par :

```json
"adjustments": [
  {
    "id": "frein-hallucination",
    "when": {"axis": "maturite-ia", "input": "freins", "contains": "hallucinations"},
    "reco": "Le semantic layer (§4) est votre levier prioritaire — pas un meilleur prompt."
  },
  {
    "id": "frein-couts",
    "when": {"axis": "maturite-ia", "input": "freins", "contains": "couts"},
    "reco": "Lisez §8 — la dérive coût BigQuery se mesure en table BQ via Agent Analytics."
  },
  {
    "id": "frein-gouv-regule",
    "when": {"axis": "maturite-ia", "input": "freins", "contains": "gouvernance", "and": {"axis": "gouvernance", "input": "regime", "not": "hors-fin-sante"}},
    "reco": "DLP runtime et Dataplex lineage doivent être actifs en J0, pas en plan."
  },
  {
    "id": "cloud-non-gcp",
    "when": {"axis": "environnement", "input": "cloud", "contains_any_of": ["aws", "azure"], "and_not": {"axis": "environnement", "input": "cloud", "contains": "gcp"}},
    "reco": "Ce dossier est GCP-first. La pyramide §3 reste portable ; les surfaces §5-7 sont à mapper sur votre stack."
  },
  {
    "id": "cloud-fr-sov",
    "when": {"axis": "environnement", "input": "cloud", "contains": "fr-sov"},
    "reco": "S3NS Premi3NS SecNumCloud 3.2 (§10) est probablement votre voie obligée pour les workloads OIV."
  },
  {
    "id": "surface-indecis",
    "when": {"axis": "cas-usage", "input": "surface", "equals": "indecis"},
    "reco": "Commencez par §3 (pyramide × chaîne) — c'est le cadre de décision sur la surface."
  },
  {
    "id": "contrainte-dora",
    "when": {"axis": "gouvernance", "input": "contraintes", "contains": "dora"},
    "reco": "DORA fait du cloud un sujet de conseil d'administration — voir §10 sur la désignation Google Cloud CTPP."
  },
  {
    "id": "contrainte-ai-act",
    "when": {"axis": "gouvernance", "input": "contraintes", "contains": "ai-act"},
    "reco": "Échéance 2 août 2026 pour l'Annexe III — scoring crédit est haut-risque par défaut."
  },
  {
    "id": "equipe-vide-maturite-haute",
    "when": {"axis": "equipe", "input": "structure", "lt": 25, "and": {"axis": "maturite-ia", "input": "stade", "gte": 50}},
    "reco": "Risque de dette opérationnelle — staffer avant de scaler."
  },
  {
    "id": "budget-frileux-maturite-haute",
    "when": {"axis": "budget", "input": "posture", "equals": "frileux", "and": {"axis": "maturite-ia", "input": "stade", "gte": 50}},
    "reco": "Le 70/20/10 (socle/agent/LLM) compte plus que le montant absolu — voir §11."
  }
]
```

- [ ] **Step 3: Valider JSON syntaxiquement**

Run:
```bash
python -c "import json; d = json.load(open('analytics-agentique-gcp/qualif.json')); print(f'{len(d[\"axes\"])} axes, {len(d[\"profiles\"])} profils, {len(d[\"adjustments\"])} règles')"
```

Attendu : `6 axes, 5 profils, 10 règles`.

- [ ] **Step 4: Commit**

```bash
git add analytics-agentique-gcp/qualif.json
git commit -m "qualif(gcp): 5 profils types + 10 règles d'ajustement"
```

### Task 1.5 — Tests Node : validation schéma JSON

**Files:**
- Create: `tests/qualif-contract.test.mjs`

- [ ] **Step 1: Écrire le premier test (parsing + schéma de base)**

Crée `tests/qualif-contract.test.mjs` :

```javascript
import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const QUALIF_GCP = JSON.parse(
  readFileSync(join(ROOT, 'analytics-agentique-gcp/qualif.json'), 'utf8')
);

test('qualif.json: meta has required fields', () => {
  assert.ok(QUALIF_GCP.meta);
  assert.equal(typeof QUALIF_GCP.meta.slug, 'string');
  assert.equal(typeof QUALIF_GCP.meta.version, 'number');
  assert.equal(typeof QUALIF_GCP.meta.title, 'string');
  assert.equal(typeof QUALIF_GCP.meta.recap_before_heading_id, 'string');
});

test('qualif.json: has exactly 6 axes with unique ids', () => {
  assert.equal(QUALIF_GCP.axes.length, 6);
  const ids = QUALIF_GCP.axes.map(a => a.id);
  assert.equal(new Set(ids).size, 6, `duplicate axis ids: ${ids.join(', ')}`);
});

test('qualif.json: each axis has required fields and at least 1 input', () => {
  for (const axis of QUALIF_GCP.axes) {
    assert.equal(typeof axis.id, 'string', `axis missing id`);
    assert.equal(typeof axis.label, 'string', `${axis.id} missing label`);
    assert.equal(typeof axis.before_heading_id, 'string', `${axis.id} missing before_heading_id`);
    assert.equal(typeof axis.intro, 'string', `${axis.id} missing intro`);
    assert.ok(Array.isArray(axis.inputs) && axis.inputs.length >= 1, `${axis.id} has no inputs`);
  }
});

test('qualif.json: each axis has exactly one axial-scoring input', () => {
  for (const axis of QUALIF_GCP.axes) {
    const axial = axis.inputs.filter(i => i.scoring === 'axis');
    assert.equal(axial.length, 1, `${axis.id} should have exactly 1 axial-scoring input, got ${axial.length}`);
  }
});

test('qualif.json: has exactly 5 profiles with unique ids', () => {
  assert.equal(QUALIF_GCP.profiles.length, 5);
  const ids = QUALIF_GCP.profiles.map(p => p.id);
  assert.equal(new Set(ids).size, 5);
});

test('qualif.json: each profile has anchor of length 6 with values 0-100', () => {
  for (const p of QUALIF_GCP.profiles) {
    assert.ok(Array.isArray(p.anchor), `${p.id} anchor not array`);
    assert.equal(p.anchor.length, 6, `${p.id} anchor length != 6`);
    for (const v of p.anchor) {
      assert.ok(typeof v === 'number' && v >= 0 && v <= 100, `${p.id} anchor has invalid value: ${v}`);
    }
  }
});

test('qualif.json: each profile has verdict and 3-5 recos', () => {
  for (const p of QUALIF_GCP.profiles) {
    assert.equal(typeof p.verdict, 'string', `${p.id} missing verdict`);
    assert.ok(Array.isArray(p.recos) && p.recos.length >= 3 && p.recos.length <= 5, `${p.id} should have 3-5 recos, got ${p.recos.length}`);
  }
});

test('qualif.json: adjustments reference valid axes and inputs', () => {
  const axisIds = new Set(QUALIF_GCP.axes.map(a => a.id));
  const inputIds = new Map();
  for (const axis of QUALIF_GCP.axes) {
    inputIds.set(axis.id, new Set(axis.inputs.map(i => i.id)));
  }

  for (const adj of QUALIF_GCP.adjustments) {
    assert.equal(typeof adj.id, 'string', `adjustment missing id`);
    assert.equal(typeof adj.reco, 'string', `${adj.id} missing reco`);
    assert.ok(adj.when, `${adj.id} missing when clause`);
    assert.ok(axisIds.has(adj.when.axis), `${adj.id} references unknown axis: ${adj.when.axis}`);
    assert.ok(inputIds.get(adj.when.axis).has(adj.when.input), `${adj.id} references unknown input ${adj.when.input} on axis ${adj.when.axis}`);
  }
});
```

- [ ] **Step 2: Run tests — must pass**

Run:
```bash
node --test tests/qualif-contract.test.mjs
```

Attendu : `pass 8 / fail 0`. Si fail : corriger le JSON ou les tests, mais la cible est que tout passe ici (le JSON a été écrit pour passer le schéma).

- [ ] **Step 3: Commit**

```bash
git add tests/qualif-contract.test.mjs
git commit -m "test(qualif): validation schéma JSON sidecar (8 tests)"
```

---

## Phase 2 — Lib JS — Moteur de calcul (`/assets/dossier-qualif.js`)

À la fin de cette phase : le JS contient les 4 fonctions pures (computeAxisScore, dominantProfile, applyAdjustments, renderRadarPath) testées unitairement. Pas encore d'attache au DOM.

### Task 2.1 — Créer le squelette de `/assets/dossier-qualif.js`

**Files:**
- Create: `assets/dossier-qualif.js`

- [ ] **Step 1: Créer le fichier avec IIFE et structure**

Crée `assets/dossier-qualif.js` :

```javascript
/* dossier-qualif — shared runtime for qualification widget
 *
 * Source unique de vérité : ce fichier rend les mini-blocs de qualif
 * (axes Maturité IA, Environnement, Cas d'usage, Équipe, Budget,
 * Gouvernance) au fil d'un dossier deep-research, calcule un profil
 * dominant parmi 5 personas, et affiche un récap radar SVG + verdict
 * + recos prioritaires en fin d'article.
 *
 * Spec : docs/superpowers/specs/2026-05-23-business-qualification-widget-design.md
 * Source de données : <dossier>/qualif.json (sidecar par dossier)
 * Persistence : localStorage['qualif_<slug>_v<n>']
 *
 * Aucune API publique, aucun framework. Le script se réveille sur
 * DOMContentLoaded, détecte la présence de <aside class="qualif-step">
 * dans le DOM, et trouve son fichier JSON via <link rel="qualif-data">.
 */

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────
  // Exposed for tests via globalThis.__qualif (node:test reads this when the
  // module is loaded via vm; in browser, this is just an internal namespace).
  // ─────────────────────────────────────────────────────────────────────────
  const Q = {};

  // ─────────────────────────────────────────────────────────────────────────
  // Pure functions — moteur de calcul
  // ─────────────────────────────────────────────────────────────────────────

  // Placeholder : remplie en Task 2.2
  Q.computeAxisScore = function () {};

  // Placeholder : remplie en Task 2.3
  Q.dominantProfile = function () {};

  // Placeholder : remplie en Task 2.4
  Q.applyAdjustments = function () {};

  // Placeholder : remplie en Task 2.5
  Q.renderRadarPath = function () {};

  // ─────────────────────────────────────────────────────────────────────────
  // DOM bootstrap — branché en Phase 3
  // ─────────────────────────────────────────────────────────────────────────

  function init() {
    // Branché en Phase 3
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose pour tests
  if (typeof globalThis !== 'undefined') {
    globalThis.__qualif = Q;
  }
})();
```

- [ ] **Step 2: Vérifier syntaxe JS valide**

Run:
```bash
node --input-type=module -e "import('./assets/dossier-qualif.js').catch(() => {}); console.log('OK')"
```

Attendu : `OK` (le fichier ne s'importe pas car il utilise `document`, mais l'erreur attendue est ReferenceError, pas SyntaxError).

Plus simple — utiliser vm pour valider la syntaxe :
```bash
node -e "const vm = require('vm'); const fs = require('fs'); vm.compileFunction(fs.readFileSync('assets/dossier-qualif.js', 'utf8')); console.log('syntax OK')"
```

Attendu : `syntax OK`.

- [ ] **Step 3: Commit**

```bash
git add assets/dossier-qualif.js
git commit -m "feat(qualif): squelette dossier-qualif.js (IIFE, namespace Q)"
```

### Task 2.2 — TDD : `computeAxisScore(axis, state)`

**Files:**
- Create: `tests/qualif-engine.test.mjs`
- Modify: `assets/dossier-qualif.js`

- [ ] **Step 1: Écrire le test (doit échouer)**

Crée `tests/qualif-engine.test.mjs` :

```javascript
import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadQualif() {
  const code = readFileSync(join(ROOT, 'assets/dossier-qualif.js'), 'utf8');
  const sandbox = {
    document: { addEventListener: () => {}, readyState: 'complete' },
    globalThis: {},
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox.globalThis.__qualif;
}

const Q = loadQualif();

test('computeAxisScore: slider-anchored returns the raw value', () => {
  const axis = {
    id: 'test',
    inputs: [
      { id: 'stade', type: 'slider-anchored', scoring: 'axis',
        levels: [{value: 0}, {value: 50}, {value: 100}] }
    ]
  };
  const state = { 'test.stade': 75 };
  assert.equal(Q.computeAxisScore(axis, state), 75);
});

test('computeAxisScore: segmented with scoring=axis returns option score', () => {
  const axis = {
    id: 'cas-usage',
    inputs: [
      { id: 'surface', type: 'segmented', scoring: 'axis',
        options: [
          {id: 'a', label: 'A', score: 50},
          {id: 'b', label: 'B', score: 75},
          {id: 'indecis', label: 'Indécis', score: 0}
        ] }
    ]
  };
  assert.equal(Q.computeAxisScore(axis, { 'cas-usage.surface': 'b' }), 75);
  assert.equal(Q.computeAxisScore(axis, { 'cas-usage.surface': 'indecis' }), 0);
});

test('computeAxisScore: no state for axis returns null (not 0)', () => {
  const axis = {
    id: 'test',
    inputs: [{ id: 'stade', type: 'slider-anchored', scoring: 'axis', levels: [{value:0},{value:100}] }]
  };
  assert.equal(Q.computeAxisScore(axis, {}), null);
});

test('computeAxisScore: axis with no axial-scoring input throws', () => {
  const axis = {
    id: 'broken',
    inputs: [{ id: 'm', type: 'multi', options: [{id:'a', label:'A'}] }]
  };
  assert.throws(() => Q.computeAxisScore(axis, {}), /no axial.*scoring/i);
});
```

- [ ] **Step 2: Run test — doit échouer (fonction vide)**

Run:
```bash
node --test tests/qualif-engine.test.mjs
```

Attendu : `pass 0 / fail 4`. Les fails sont sur `computeAxisScore is not a function` ou retours `undefined`.

- [ ] **Step 3: Implémenter `computeAxisScore`**

Dans `assets/dossier-qualif.js`, remplace le placeholder `Q.computeAxisScore = function () {};` par :

```javascript
  /**
   * Retourne le score 0-100 d'un axe, ou null si non renseigné.
   * Cherche l'input avec scoring="axis" dans l'axe et lit sa valeur dans state.
   * @param {Object} axis - L'objet axe du JSON.
   * @param {Object} state - Map des saisies, clés "<axisId>.<inputId>".
   * @returns {number|null}
   */
  Q.computeAxisScore = function computeAxisScore(axis, state) {
    const axial = axis.inputs.find(function (i) { return i.scoring === 'axis'; });
    if (!axial) {
      throw new Error('Axis "' + axis.id + '" has no axial-scoring input');
    }
    const key = axis.id + '.' + axial.id;
    const raw = state[key];
    if (raw === undefined || raw === null || raw === '') return null;

    if (axial.type === 'slider-anchored') {
      return Number(raw);
    }
    if (axial.type === 'segmented') {
      const opt = axial.options.find(function (o) { return o.id === raw; });
      return opt && typeof opt.score === 'number' ? opt.score : null;
    }
    return null;
  };
```

- [ ] **Step 4: Run test — doit passer**

Run:
```bash
node --test tests/qualif-engine.test.mjs
```

Attendu : `pass 4 / fail 0`.

- [ ] **Step 5: Commit**

```bash
git add assets/dossier-qualif.js tests/qualif-engine.test.mjs
git commit -m "feat(qualif): computeAxisScore — slider/segmented → 0-100 ou null"
```

### Task 2.3 — TDD : `dominantProfile(vec, profiles)`

**Files:**
- Modify: `assets/dossier-qualif.js`
- Modify: `tests/qualif-engine.test.mjs`

- [ ] **Step 1: Écrire les tests (à ajouter à la fin du fichier)**

Ajoute à la fin de `tests/qualif-engine.test.mjs` :

```javascript
const TEST_PROFILES = [
  { id: 'explorer',   anchor: [20, 30, 25, 15, 25, 30] },
  { id: 'poc',        anchor: [40, 50, 50, 35, 50, 35] },
  { id: 'builder',    anchor: [65, 70, 70, 65, 70, 50] },
  { id: 'regulated',  anchor: [50, 60, 50, 50, 60, 85] },
  { id: 'pioneer',    anchor: [80, 80, 85, 80, 85, 60] }
];
const TIEBREAK_ORDER = ['regulated', 'builder', 'poc', 'pioneer', 'explorer'];

test('dominantProfile: explorer vector → explorer', () => {
  const dominant = Q.dominantProfile([20, 30, 25, 15, 25, 30], TEST_PROFILES, TIEBREAK_ORDER);
  assert.equal(dominant.id, 'explorer');
});

test('dominantProfile: builder vector → builder', () => {
  const dominant = Q.dominantProfile([65, 70, 70, 65, 70, 50], TEST_PROFILES, TIEBREAK_ORDER);
  assert.equal(dominant.id, 'builder');
});

test('dominantProfile: regulated vector → regulated', () => {
  const dominant = Q.dominantProfile([50, 60, 50, 50, 60, 85], TEST_PROFILES, TIEBREAK_ORDER);
  assert.equal(dominant.id, 'regulated');
});

test('dominantProfile: pioneer vector → pioneer', () => {
  const dominant = Q.dominantProfile([80, 80, 85, 80, 85, 60], TEST_PROFILES, TIEBREAK_ORDER);
  assert.equal(dominant.id, 'pioneer');
});

test('dominantProfile: poc vector → poc', () => {
  const dominant = Q.dominantProfile([40, 50, 50, 35, 50, 35], TEST_PROFILES, TIEBREAK_ORDER);
  assert.equal(dominant.id, 'poc');
});

test('dominantProfile: equidistant between explorer & poc → poc wins (tiebreak)', () => {
  // Midpoint of explorer (20,30,25,15,25,30) and poc (40,50,50,35,50,35) = (30,40,37.5,25,37.5,32.5)
  const dominant = Q.dominantProfile([30, 40, 37.5, 25, 37.5, 32.5], TEST_PROFILES, TIEBREAK_ORDER);
  assert.equal(dominant.id, 'poc'); // poc comes before explorer in TIEBREAK_ORDER
});

test('dominantProfile: null entries treated as 50 (neutral) for partial profiles', () => {
  // Partial profile: only 2 axes filled
  const dominant = Q.dominantProfile([20, 30, null, null, null, null], TEST_PROFILES, TIEBREAK_ORDER);
  // Filling unknowns with 50 gives [20,30,50,50,50,50] — closest to explorer's [20,30,25,15,25,30]? Let's verify.
  // explorer dist² = 0+0+625+1225+625+400 = 2875
  // poc dist² = 400+400+0+225+0+225 = 1250
  // builder dist² = 2025+1600+400+225+400+0 = 4650
  // → poc wins
  assert.equal(dominant.id, 'poc');
});
```

- [ ] **Step 2: Run tests — doivent échouer**

Run:
```bash
node --test tests/qualif-engine.test.mjs
```

Attendu : les 7 nouveaux tests fail (dominantProfile non implémenté).

- [ ] **Step 3: Implémenter `dominantProfile`**

Dans `assets/dossier-qualif.js`, remplace le placeholder `Q.dominantProfile = function () {};` par :

```javascript
  /**
   * Retourne le profil le plus proche du vecteur utilisateur (distance euclidienne).
   * Les entrées null/undefined sont traitées comme 50 (neutre).
   * Tie-break stable selon l'ordre prioritaire fourni.
   * @param {Array<number|null>} vec - 6 scores axiaux (peut contenir null pour partiel).
   * @param {Array<Object>} profiles - Liste des profils avec {id, anchor: [6]}.
   * @param {Array<string>} tiebreakOrder - IDs de profils dans l'ordre prioritaire.
   * @returns {Object} Le profil dominant.
   */
  Q.dominantProfile = function dominantProfile(vec, profiles, tiebreakOrder) {
    const normalized = vec.map(function (v) {
      return (v === null || v === undefined) ? 50 : v;
    });

    let best = null;
    let bestDist = Infinity;
    let bestPriority = Infinity;

    for (let i = 0; i < profiles.length; i++) {
      const p = profiles[i];
      let dist = 0;
      for (let k = 0; k < 6; k++) {
        const d = normalized[k] - p.anchor[k];
        dist += d * d;
      }
      const priority = tiebreakOrder.indexOf(p.id);
      const isCloser = dist < bestDist;
      const isTieAndPrior = (dist === bestDist) && (priority < bestPriority);
      if (isCloser || isTieAndPrior) {
        best = p;
        bestDist = dist;
        bestPriority = priority;
      }
    }
    return best;
  };
```

- [ ] **Step 4: Run tests — doivent passer**

Run:
```bash
node --test tests/qualif-engine.test.mjs
```

Attendu : `pass 11 / fail 0` (4 anciens + 7 nouveaux).

- [ ] **Step 5: Commit**

```bash
git add assets/dossier-qualif.js tests/qualif-engine.test.mjs
git commit -m "feat(qualif): dominantProfile — distance euclidienne + tiebreak stable"
```

### Task 2.4 — TDD : `applyAdjustments(state, adjustments)`

**Files:**
- Modify: `assets/dossier-qualif.js`
- Modify: `tests/qualif-engine.test.mjs`

- [ ] **Step 1: Écrire les tests**

Ajoute à la fin de `tests/qualif-engine.test.mjs` :

```javascript
const TEST_ADJUSTMENTS = [
  { id: 'a-contains',
    when: { axis: 'maturite-ia', input: 'freins', contains: 'hallucinations' },
    reco: 'Reco contains' },
  { id: 'a-equals',
    when: { axis: 'cas-usage', input: 'surface', equals: 'indecis' },
    reco: 'Reco equals' },
  { id: 'a-lt',
    when: { axis: 'equipe', input: 'structure', lt: 25 },
    reco: 'Reco lt' },
  { id: 'a-gte',
    when: { axis: 'maturite-ia', input: 'stade', gte: 50 },
    reco: 'Reco gte' },
  { id: 'a-and',
    when: { axis: 'equipe', input: 'structure', lt: 25,
            and: { axis: 'maturite-ia', input: 'stade', gte: 50 } },
    reco: 'Reco and' },
  { id: 'a-not',
    when: { axis: 'gouvernance', input: 'regime', not: 'hors-fin-sante' },
    reco: 'Reco not' },
  { id: 'a-contains-any-of',
    when: { axis: 'environnement', input: 'cloud', contains_any_of: ['aws', 'azure'] },
    reco: 'Reco contains_any_of' },
  { id: 'a-and-not',
    when: { axis: 'environnement', input: 'cloud', contains_any_of: ['aws', 'azure'],
            and_not: { axis: 'environnement', input: 'cloud', contains: 'gcp' } },
    reco: 'Reco and_not' }
];

test('applyAdjustments: contains triggers when option in multi-select', () => {
  const recos = Q.applyAdjustments({ 'maturite-ia.freins': ['hallucinations', 'accuracy'] }, TEST_ADJUSTMENTS);
  assert.ok(recos.includes('Reco contains'));
});

test('applyAdjustments: contains does NOT trigger when option absent', () => {
  const recos = Q.applyAdjustments({ 'maturite-ia.freins': ['accuracy'] }, TEST_ADJUSTMENTS);
  assert.ok(!recos.includes('Reco contains'));
});

test('applyAdjustments: equals triggers on exact match', () => {
  const recos = Q.applyAdjustments({ 'cas-usage.surface': 'indecis' }, TEST_ADJUSTMENTS);
  assert.ok(recos.includes('Reco equals'));
});

test('applyAdjustments: lt triggers when value below threshold', () => {
  const recos = Q.applyAdjustments({ 'equipe.structure': 10 }, TEST_ADJUSTMENTS);
  assert.ok(recos.includes('Reco lt'));
});

test('applyAdjustments: gte triggers when value at threshold', () => {
  const recos = Q.applyAdjustments({ 'maturite-ia.stade': 50 }, TEST_ADJUSTMENTS);
  assert.ok(recos.includes('Reco gte'));
});

test('applyAdjustments: and requires both conditions', () => {
  const both = Q.applyAdjustments({ 'equipe.structure': 10, 'maturite-ia.stade': 60 }, TEST_ADJUSTMENTS);
  assert.ok(both.includes('Reco and'));
  const onlyOne = Q.applyAdjustments({ 'equipe.structure': 10, 'maturite-ia.stade': 30 }, TEST_ADJUSTMENTS);
  assert.ok(!onlyOne.includes('Reco and'));
});

test('applyAdjustments: not triggers when value differs', () => {
  const recos = Q.applyAdjustments({ 'gouvernance.regime': 'banque-assur' }, TEST_ADJUSTMENTS);
  assert.ok(recos.includes('Reco not'));
  const notTriggered = Q.applyAdjustments({ 'gouvernance.regime': 'hors-fin-sante' }, TEST_ADJUSTMENTS);
  assert.ok(!notTriggered.includes('Reco not'));
});

test('applyAdjustments: contains_any_of triggers if at least one in list', () => {
  const aws = Q.applyAdjustments({ 'environnement.cloud': ['aws'] }, TEST_ADJUSTMENTS);
  assert.ok(aws.includes('Reco contains_any_of'));
  const none = Q.applyAdjustments({ 'environnement.cloud': ['gcp'] }, TEST_ADJUSTMENTS);
  assert.ok(!none.includes('Reco contains_any_of'));
});

test('applyAdjustments: and_not blocks when secondary condition matches', () => {
  // aws + gcp → and_not(contains gcp) blocks Reco and_not
  const both = Q.applyAdjustments({ 'environnement.cloud': ['aws', 'gcp'] }, TEST_ADJUSTMENTS);
  assert.ok(!both.includes('Reco and_not'));
  // aws only → and_not satisfied → triggers
  const awsOnly = Q.applyAdjustments({ 'environnement.cloud': ['aws'] }, TEST_ADJUSTMENTS);
  assert.ok(awsOnly.includes('Reco and_not'));
});

test('applyAdjustments: caps at 2 recos max in declaration order', () => {
  // State that triggers 5 different recos
  const state = {
    'maturite-ia.freins': ['hallucinations'],
    'cas-usage.surface': 'indecis',
    'equipe.structure': 10,
    'maturite-ia.stade': 60,
    'gouvernance.regime': 'banque-assur'
  };
  const recos = Q.applyAdjustments(state, TEST_ADJUSTMENTS, 2);
  assert.equal(recos.length, 2);
  // First two declared : a-contains, a-equals
  assert.equal(recos[0], 'Reco contains');
  assert.equal(recos[1], 'Reco equals');
});
```

- [ ] **Step 2: Run tests — doivent échouer**

Run:
```bash
node --test tests/qualif-engine.test.mjs
```

Attendu : les 10 nouveaux tests fail.

- [ ] **Step 3: Implémenter `applyAdjustments`**

Dans `assets/dossier-qualif.js`, remplace le placeholder `Q.applyAdjustments = function () {};` par :

```javascript
  /**
   * Évalue une clause when sur le state.
   * Supports : contains, equals, not, lt, gt, lte, gte, contains_any_of,
   *            and (nested), and_not (negated nested).
   */
  function matchClause(when, state) {
    const key = when.axis + '.' + when.input;
    const value = state[key];

    if (when.contains !== undefined) {
      if (!Array.isArray(value)) return false;
      if (!value.includes(when.contains)) return false;
    }
    if (when.contains_any_of !== undefined) {
      if (!Array.isArray(value)) return false;
      const hit = when.contains_any_of.some(function (v) { return value.includes(v); });
      if (!hit) return false;
    }
    if (when.equals !== undefined) {
      if (value !== when.equals) return false;
    }
    if (when.not !== undefined) {
      if (value === when.not) return false;
      if (value === undefined || value === null) return false;
    }
    if (when.lt !== undefined) {
      if (typeof value !== 'number' || value >= when.lt) return false;
    }
    if (when.gt !== undefined) {
      if (typeof value !== 'number' || value <= when.gt) return false;
    }
    if (when.lte !== undefined) {
      if (typeof value !== 'number' || value > when.lte) return false;
    }
    if (when.gte !== undefined) {
      if (typeof value !== 'number' || value < when.gte) return false;
    }
    if (when.and) {
      if (!matchClause(when.and, state)) return false;
    }
    if (when.and_not) {
      if (matchClause(when.and_not, state)) return false;
    }
    return true;
  }

  /**
   * Retourne les recos déclenchées par les règles, max `cap` (défaut 2).
   * Ordre de déclaration du JSON respecté ; premières règles match gagnent.
   * @param {Object} state - Map des saisies.
   * @param {Array<Object>} adjustments - Règles du JSON.
   * @param {number} [cap=2] - Maximum de recos à retourner.
   * @returns {Array<string>}
   */
  Q.applyAdjustments = function applyAdjustments(state, adjustments, cap) {
    if (cap === undefined) cap = 2;
    const out = [];
    for (let i = 0; i < adjustments.length && out.length < cap; i++) {
      const adj = adjustments[i];
      if (matchClause(adj.when, state)) {
        out.push(adj.reco);
      }
    }
    return out;
  };
```

- [ ] **Step 4: Run tests — doivent passer**

Run:
```bash
node --test tests/qualif-engine.test.mjs
```

Attendu : `pass 21 / fail 0` (11 anciens + 10 nouveaux).

- [ ] **Step 5: Commit**

```bash
git add assets/dossier-qualif.js tests/qualif-engine.test.mjs
git commit -m "feat(qualif): applyAdjustments — 8 opérateurs (contains/equals/lt/gte/and/not/...) cap=2"
```

### Task 2.5 — TDD : `renderRadarPath(scores)`

**Files:**
- Modify: `assets/dossier-qualif.js`
- Modify: `tests/qualif-engine.test.mjs`

- [ ] **Step 1: Écrire les tests**

Ajoute à la fin de `tests/qualif-engine.test.mjs` :

```javascript
test('renderRadarPath: 6 scores → SVG d= with 6 line segments + close', () => {
  const d = Q.renderRadarPath([50, 50, 50, 50, 50, 50], { cx: 160, cy: 160, radius: 120 });
  // M cx,cy_offset L ... L ... L ... L ... L ... Z
  assert.match(d, /^M [\d.-]+,[\d.-]+( L [\d.-]+,[\d.-]+){5} Z$/);
});

test('renderRadarPath: zero scores → all points at center', () => {
  const d = Q.renderRadarPath([0, 0, 0, 0, 0, 0], { cx: 160, cy: 160, radius: 120 });
  const segments = d.match(/[\d.-]+,[\d.-]+/g);
  assert.equal(segments.length, 6);
  // All should be (160, 160) — center, with tiny float tolerance
  for (const s of segments) {
    const [x, y] = s.split(',').map(Number);
    assert.ok(Math.abs(x - 160) < 0.01, `x not at center: ${x}`);
    assert.ok(Math.abs(y - 160) < 0.01, `y not at center: ${y}`);
  }
});

test('renderRadarPath: max scores → all points at radius', () => {
  const d = Q.renderRadarPath([100, 100, 100, 100, 100, 100], { cx: 160, cy: 160, radius: 120 });
  const segments = d.match(/[\d.-]+,[\d.-]+/g);
  for (const s of segments) {
    const [x, y] = s.split(',').map(Number);
    const dist = Math.sqrt((x - 160) ** 2 + (y - 160) ** 2);
    assert.ok(Math.abs(dist - 120) < 0.01, `point not at radius: ${dist}`);
  }
});

test('renderRadarPath: no NaN in output', () => {
  const d = Q.renderRadarPath([42, 17, 88, 3, 71, 56], { cx: 160, cy: 160, radius: 120 });
  assert.ok(!d.includes('NaN'), `path contains NaN: ${d}`);
});

test('renderRadarPath: null scores treated as 0', () => {
  const d = Q.renderRadarPath([null, null, null, null, null, null], { cx: 160, cy: 160, radius: 120 });
  const segments = d.match(/[\d.-]+,[\d.-]+/g);
  for (const s of segments) {
    const [x, y] = s.split(',').map(Number);
    assert.ok(Math.abs(x - 160) < 0.01);
    assert.ok(Math.abs(y - 160) < 0.01);
  }
});
```

- [ ] **Step 2: Run tests — doivent échouer**

Run:
```bash
node --test tests/qualif-engine.test.mjs
```

Attendu : 5 nouveaux tests fail.

- [ ] **Step 3: Implémenter `renderRadarPath`**

Dans `assets/dossier-qualif.js`, remplace le placeholder `Q.renderRadarPath = function () {};` par :

```javascript
  /**
   * Construit l'attribut "d" d'un <path> SVG polygonal à 6 sommets,
   * un par axe, avec coordonnées calculées à partir des scores 0-100.
   * Premier axe à -90° (top), sens horaire.
   * @param {Array<number|null>} scores - 6 valeurs 0-100, null traité comme 0.
   * @param {Object} geom - {cx, cy, radius}.
   * @returns {string}
   */
  Q.renderRadarPath = function renderRadarPath(scores, geom) {
    const cx = geom.cx;
    const cy = geom.cy;
    const r = geom.radius;
    const N = 6;
    const points = [];

    for (let i = 0; i < N; i++) {
      const raw = scores[i];
      const v = (raw === null || raw === undefined) ? 0 : raw;
      const ratio = v / 100;
      // Premier axe à -90° (= -π/2 = top), sens horaire (+ angle clockwise)
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / N;
      const x = cx + ratio * r * Math.cos(angle);
      const y = cy + ratio * r * Math.sin(angle);
      points.push(x.toFixed(2) + ',' + y.toFixed(2));
    }

    return 'M ' + points[0] + ' L ' + points.slice(1).join(' L ') + ' Z';
  };
```

- [ ] **Step 4: Run tests — doivent passer**

Run:
```bash
node --test tests/qualif-engine.test.mjs
```

Attendu : `pass 26 / fail 0`.

- [ ] **Step 5: Commit**

```bash
git add assets/dossier-qualif.js tests/qualif-engine.test.mjs
git commit -m "feat(qualif): renderRadarPath — polygone SVG à 6 sommets, axe 0 = top"
```

---

## Phase 3 — Lib JS — Rendu UI et persistance (`/assets/dossier-qualif.js`)

À la fin de cette phase : le JS s'attache au DOM, écoute les inputs, persiste, met à jour le récap en live.

### Task 3.1 — Lecture du JSON sidecar + helpers DOM

**Files:**
- Modify: `assets/dossier-qualif.js`

- [ ] **Step 1: Ajouter le chargement du JSON via <link rel="qualif-data">**

Dans `assets/dossier-qualif.js`, remplace la fonction `init()` et ajoute juste avant elle :

```javascript
  // ─────────────────────────────────────────────────────────────────────────
  // Chargement du sidecar JSON
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Cherche <link rel="qualif-data" href="...qualif.json"> dans <head>,
   * fetch le JSON, retourne la Promise<config>.
   */
  function loadQualifConfig() {
    const link = document.querySelector('link[rel="qualif-data"]');
    if (!link) return Promise.resolve(null);
    return fetch(link.href).then(function (r) {
      if (!r.ok) throw new Error('qualif: fetch ' + link.href + ' → ' + r.status);
      return r.json();
    });
  }

  /**
   * Tiebreak order standard (Regulated > Builder > PoC > Pioneer > Explorer).
   * Pour les calibrages génériques. Override possible via config.meta.tiebreak.
   */
  const DEFAULT_TIEBREAK = ['regulated', 'builder', 'poc-trapped', 'pioneer', 'explorer'];
```

- [ ] **Step 2: Implémenter init() pour charger config et persistance**

Remplace la fonction `init()` actuelle par :

```javascript
  function init() {
    const steps = document.querySelectorAll('aside.qualif-step');
    const recap = document.querySelector('aside#qualif-recap');
    if (steps.length === 0 && !recap) return; // pas de widget sur cette page

    loadQualifConfig().then(function (config) {
      if (!config) return;
      const slug = config.meta.slug;
      const version = config.meta.version || 1;
      const storageKey = 'qualif_' + slug + '_v' + version;
      const tiebreak = config.meta.tiebreak || DEFAULT_TIEBREAK;

      const state = hydrateState(storageKey);
      const handles = {
        config: config,
        storageKey: storageKey,
        tiebreak: tiebreak,
        state: state
      };

      wireSteps(handles);
      wireRecap(handles);
      renderAll(handles);
    }).catch(function (err) {
      console.error('[qualif]', err);
    });
  }

  function hydrateState(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return {};
      const data = JSON.parse(raw);
      return (data && data.inputs) || {};
    } catch (e) {
      console.warn('[qualif] hydrate failed', e);
      return {};
    }
  }

  function persistState(key, state, dominantId) {
    try {
      localStorage.setItem(key, JSON.stringify({
        inputs: state,
        ts: new Date().toISOString(),
        dominant_profile: dominantId
      }));
    } catch (e) {
      console.warn('[qualif] persist failed', e);
    }
  }

  // Placeholders : remplis en Task 3.2 et 3.3
  function wireSteps(handles) {}
  function wireRecap(handles) {}
  function renderAll(handles) {}
```

- [ ] **Step 3: Vérifier syntaxe**

Run:
```bash
node -e "const vm = require('vm'); const fs = require('fs'); vm.compileFunction(fs.readFileSync('assets/dossier-qualif.js', 'utf8')); console.log('syntax OK')"
```

Attendu : `syntax OK`.

- [ ] **Step 4: Re-run tests engine — toujours verts**

Run:
```bash
node --test tests/qualif-engine.test.mjs
```

Attendu : `pass 26 / fail 0`. (Les fonctions exposées sur `Q` n'ont pas bougé.)

- [ ] **Step 5: Commit**

```bash
git add assets/dossier-qualif.js
git commit -m "feat(qualif): chargement JSON sidecar + hydrate/persist localStorage"
```

### Task 3.2 — `wireSteps()` — bind events sur inputs

**Files:**
- Modify: `assets/dossier-qualif.js`

- [ ] **Step 1: Implémenter `wireSteps`**

Remplace le placeholder `function wireSteps(handles) {}` par :

```javascript
  function wireSteps(handles) {
    const config = handles.config;
    const steps = document.querySelectorAll('aside.qualif-step');

    steps.forEach(function (step) {
      const axisId = step.dataset.axis;
      const axis = config.axes.find(function (a) { return a.id === axisId; });
      if (!axis) return;

      // Hydrate : restore les valeurs depuis state vers DOM
      axis.inputs.forEach(function (input) {
        const key = axisId + '.' + input.id;
        const v = handles.state[key];
        if (v === undefined || v === null) return;

        if (input.type === 'slider-anchored') {
          const el = step.querySelector('input[type="range"][name="' + key + '"]');
          if (el) {
            el.value = v;
            updateSliderAriaText(el, input);
          }
        } else if (input.type === 'segmented') {
          const el = step.querySelector('input[type="radio"][name="' + key + '"][value="' + v + '"]');
          if (el) el.checked = true;
        } else if (input.type === 'multi') {
          (Array.isArray(v) ? v : []).forEach(function (opt) {
            const el = step.querySelector('input[type="checkbox"][name="' + key + '"][value="' + opt + '"]');
            if (el) el.checked = true;
          });
          enforceMaxPicks(step, key, input.max_picks);
        }
      });

      // Bind events
      step.addEventListener('input', function (e) { handleStepInput(e, axis, handles); });
      step.addEventListener('change', function (e) { handleStepInput(e, axis, handles); });

      // Update du témoin (witness) initial
      updateStepWitness(step, axis, handles.state);
    });
  }

  function handleStepInput(e, axis, handles) {
    const target = e.target;
    if (!target.name) return;
    const key = target.name;

    if (target.type === 'range') {
      handles.state[key] = Number(target.value);
      const input = axis.inputs.find(function (i) { return key.endsWith('.' + i.id); });
      if (input) updateSliderAriaText(target, input);
    } else if (target.type === 'radio') {
      handles.state[key] = target.value;
    } else if (target.type === 'checkbox') {
      const all = e.currentTarget.querySelectorAll('input[type="checkbox"][name="' + key + '"]:checked');
      const values = Array.prototype.map.call(all, function (el) { return el.value; });
      handles.state[key] = values;
      const input = axis.inputs.find(function (i) { return key.endsWith('.' + i.id); });
      if (input && input.max_picks) enforceMaxPicks(e.currentTarget, key, input.max_picks);
    }

    const step = target.closest('aside.qualif-step');
    if (step) updateStepWitness(step, axis, handles.state);

    renderAll(handles); // recalcule profil + recos + radar + persist
  }

  function enforceMaxPicks(scope, name, maxPicks) {
    if (!maxPicks) return;
    const all = scope.querySelectorAll('input[type="checkbox"][name="' + name + '"]');
    const checked = scope.querySelectorAll('input[type="checkbox"][name="' + name + '"]:checked');
    const atCap = checked.length >= maxPicks;
    all.forEach(function (el) {
      if (!el.checked) el.disabled = atCap;
    });
  }

  function updateSliderAriaText(rangeEl, input) {
    const v = Number(rangeEl.value);
    if (!input.levels) return;
    // Trouver le palier le plus proche
    let closest = input.levels[0];
    let bestDelta = Math.abs(v - closest.value);
    for (let i = 1; i < input.levels.length; i++) {
      const d = Math.abs(v - input.levels[i].value);
      if (d < bestDelta) { closest = input.levels[i]; bestDelta = d; }
    }
    rangeEl.setAttribute('aria-valuetext', closest.label);
  }

  function updateStepWitness(step, axis, state) {
    const witness = step.querySelector('.qualif-step__witness');
    const seeRecap = step.querySelector('.qualif-step__see-recap');
    if (!witness) return;

    const total = axis.inputs.length;
    let filled = 0;
    for (let i = 0; i < axis.inputs.length; i++) {
      const input = axis.inputs[i];
      const key = axis.id + '.' + input.id;
      const v = state[key];
      if (v === undefined || v === null) continue;
      if (Array.isArray(v) && v.length === 0) continue;
      if (typeof v === 'string' && v === '') continue;
      filled++;
    }

    if (filled === 0) {
      witness.textContent = '— En attente de saisie';
      if (seeRecap) seeRecap.hidden = true;
    } else if (filled < total) {
      witness.textContent = filled + ' sur ' + total + ' renseignés';
      if (seeRecap) seeRecap.hidden = false;
    } else {
      witness.textContent = '✓ Axe pris en compte';
      if (seeRecap) seeRecap.hidden = false;
    }
  }
```

- [ ] **Step 2: Vérifier syntaxe**

Run:
```bash
node -e "const vm = require('vm'); const fs = require('fs'); vm.compileFunction(fs.readFileSync('assets/dossier-qualif.js', 'utf8')); console.log('syntax OK')"
```

Attendu : `syntax OK`.

- [ ] **Step 3: Re-run tests engine (régression check)**

Run:
```bash
node --test tests/qualif-engine.test.mjs
```

Attendu : `pass 26 / fail 0`.

- [ ] **Step 4: Commit**

```bash
git add assets/dossier-qualif.js
git commit -m "feat(qualif): wireSteps — hydrate DOM, bind events, max_picks, témoin"
```

### Task 3.3 — `wireRecap()` + `renderAll()` — radar SVG + verdict + recos

**Files:**
- Modify: `assets/dossier-qualif.js`

- [ ] **Step 1: Implémenter `wireRecap` et `renderAll`**

Remplace les placeholders `function wireRecap(handles) {}` et `function renderAll(handles) {}` par :

```javascript
  function wireRecap(handles) {
    const recap = document.querySelector('aside#qualif-recap');
    if (!recap) return;

    const printBtn = recap.querySelector('button[data-action="print"]');
    const resetBtn = recap.querySelector('button[data-action="reset"]');

    if (printBtn) {
      printBtn.addEventListener('click', function () { window.print(); });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (!window.confirm('Réinitialiser votre profil ?')) return;
        localStorage.removeItem(handles.storageKey);
        for (const k of Object.keys(handles.state)) delete handles.state[k];
        // Reset DOM inputs visuellement
        document.querySelectorAll('aside.qualif-step input').forEach(function (el) {
          if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
          if (el.type === 'range') {
            const def = el.getAttribute('value');
            el.value = (def !== null) ? def : Math.round((Number(el.min || 0) + Number(el.max || 100)) / 2);
          }
          if (el.disabled) el.disabled = false;
        });
        document.querySelectorAll('aside.qualif-step').forEach(function (step) {
          const axisId = step.dataset.axis;
          const axis = handles.config.axes.find(function (a) { return a.id === axisId; });
          if (axis) updateStepWitness(step, axis, handles.state);
        });
        renderAll(handles);
      });
    }
  }

  function renderAll(handles) {
    const config = handles.config;
    const state = handles.state;

    // 1. Calcul du vecteur 6 axes
    const vec = config.axes.map(function (axis) {
      return Q.computeAxisScore(axis, state);
    });

    // 2. Comptage des axes renseignés
    const filledCount = vec.filter(function (v) { return v !== null; }).length;

    // 3. Profil dominant (sur normalisation neutre 50 pour partiel)
    const profile = Q.dominantProfile(vec, config.profiles, handles.tiebreak);

    // 4. Recos d'ajustement (max 2)
    const adjRecos = Q.applyAdjustments(state, config.adjustments || [], 2);

    // 5. Persist
    persistState(handles.storageKey, state, profile ? profile.id : null);

    // 6. Bind UI
    renderRecapUI(config, vec, filledCount, profile, adjRecos);
  }

  function renderRecapUI(config, vec, filledCount, profile, adjRecos) {
    const recap = document.querySelector('aside#qualif-recap');
    if (!recap || !profile) return;

    // a) label profil
    const labelEl = recap.querySelector('[data-bind="profile-label"]');
    if (labelEl) labelEl.textContent = filledCount > 0 ? profile.label : '—';

    // b) verdict
    const verdictEl = recap.querySelector('[data-bind="verdict"]');
    if (verdictEl) {
      if (filledCount === 0) {
        verdictEl.textContent = 'Aucun axe renseigné. Complétez les blocs ci-dessus pour faire apparaître votre profil.';
        verdictEl.classList.add('is-empty');
      } else {
        verdictEl.textContent = profile.verdict;
        verdictEl.classList.remove('is-empty');
      }
    }

    // c) recos
    const recosEl = recap.querySelector('[data-bind="recos"]');
    if (recosEl) {
      recosEl.innerHTML = '';
      if (filledCount > 0) {
        (profile.recos || []).forEach(function (r) {
          const li = document.createElement('li');
          li.textContent = r;
          recosEl.appendChild(li);
        });
        adjRecos.forEach(function (r) {
          const li = document.createElement('li');
          li.className = 'reco-adjustment';
          li.textContent = '↪ ' + r;
          recosEl.appendChild(li);
        });
      }
    }

    // d) meta : timestamp + completeness
    const tsEl = recap.querySelector('[data-bind="ts"]');
    if (tsEl) {
      const now = new Date();
      tsEl.dateTime = now.toISOString();
      tsEl.textContent = formatDateFr(now);
    }
    const compEl = recap.querySelector('[data-bind="completeness"]');
    if (compEl) compEl.textContent = filledCount + ' sur 6 axes renseignés';

    // e) radar SVG
    drawRadar(recap, vec, profile);

    // f) figcaption
    const figcap = recap.querySelector('[data-bind="radar-caption"]');
    if (figcap) {
      figcap.textContent = filledCount === 0
        ? 'Complétez les blocs pour voir votre radar.'
        : 'Profil ' + profile.label + ' — vous êtes le plus proche de ce profil cible sur les axes renseignés.';
    }

    // g) radar desc (a11y)
    const desc = recap.querySelector('[data-bind="radar-desc"]');
    if (desc) {
      const axisLabels = config.axes.map(function (a) { return a.label; });
      const parts = vec.map(function (v, i) {
        return axisLabels[i] + ' ' + (v === null ? 'non renseigné' : v);
      });
      desc.textContent = 'Vous êtes sur le profil ' + profile.label + '. Scores : ' + parts.join(', ') + '.';
    }

    // h) état des boutons
    const printBtn = recap.querySelector('button[data-action="print"]');
    const resetBtn = recap.querySelector('button[data-action="reset"]');
    if (printBtn) printBtn.disabled = (filledCount === 0);
    if (resetBtn) resetBtn.disabled = (filledCount === 0);
  }

  function drawRadar(recap, vec, profile) {
    const svg = recap.querySelector('figure.qualif-recap__radar svg');
    if (!svg) return;
    const geom = { cx: 160, cy: 160, radius: 120 };

    // Polygone utilisateur (path data-bind="user-polygon")
    const userPath = svg.querySelector('path[data-bind="user-polygon"]');
    if (userPath) {
      userPath.setAttribute('d', Q.renderRadarPath(vec, geom));
    }

    // Polygone profil cible
    const profilePath = svg.querySelector('path[data-bind="profile-polygon"]');
    if (profilePath && profile) {
      profilePath.setAttribute('d', Q.renderRadarPath(profile.anchor, geom));
    }
  }

  function formatDateFr(d) {
    const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear()
      + ' · ' + String(d.getHours()).padStart(2, '0') + 'h' + String(d.getMinutes()).padStart(2, '0');
  }
```

- [ ] **Step 2: Vérifier syntaxe**

Run:
```bash
node -e "const vm = require('vm'); const fs = require('fs'); vm.compileFunction(fs.readFileSync('assets/dossier-qualif.js', 'utf8')); console.log('syntax OK')"
```

Attendu : `syntax OK`.

- [ ] **Step 3: Re-run tests engine**

Run:
```bash
node --test tests/qualif-engine.test.mjs
```

Attendu : `pass 26 / fail 0`.

- [ ] **Step 4: Commit**

```bash
git add assets/dossier-qualif.js
git commit -m "feat(qualif): wireRecap + renderAll — radar SVG, verdict, recos, print, reset"
```

---

## Phase 4 — Lib CSS (`/assets/dossier-qualif.css`)

À la fin de cette phase : le CSS partagé est complet (mini-bloc + récap + radar + mobile + print).

### Task 4.1 — Créer le squelette CSS avec variables

**Files:**
- Create: `assets/dossier-qualif.css`

- [ ] **Step 1: Créer le fichier**

Crée `assets/dossier-qualif.css` :

```css
/* dossier-qualif — shared styles for qualification widget
 *
 * Spec : docs/superpowers/specs/2026-05-23-business-qualification-widget-design.md
 *
 * 3 patterns visuels :
 *  - .qualif-step  : mini-bloc inséré au fil de la prose (6×)
 *  - .qualif-input : un input dans un mini-bloc (3 types)
 *  - .qualif-recap : récap final radar + verdict + recos
 *
 * Variables thématiques : héritées de la page (--paper, --ink, --accent, ...).
 * Variables propres au widget : déclarées dans :root ci-dessous, surchargeables.
 */

:root {
  --qualif: #5b6d8a;
  --qualif-soft: #5b6d8a14;
  --qualif-hover: #5b6d8a22;
}

/* ─────────────────────────────────────────────────────────────────────────
 * Mini-bloc — qualif-step
 * ───────────────────────────────────────────────────────────────────────── */

aside.qualif-step {
  border-left: 3px solid var(--qualif);
  background: var(--qualif-soft);
  padding: clamp(16px, 3vw, 24px) clamp(14px, 3vw, 20px);
  margin: 2.5rem 0;
  border-radius: 2px;
  font-family: var(--sans, 'Inter', sans-serif);
}

.qualif-step__head { margin-bottom: 1rem; }

.qualif-step__eyebrow {
  font-family: var(--mono, 'JetBrains Mono', monospace);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--qualif);
  margin: 0 0 0.4rem 0;
}

.qualif-step__intro {
  font-size: 1.05rem;
  line-height: 1.45;
  color: var(--ink, #1a1a1a);
  margin: 0;
}

.qualif-step__body {
  display: grid;
  gap: 1.5rem;
}

/* ─────────────────────────────────────────────────────────────────────────
 * Inputs
 * ───────────────────────────────────────────────────────────────────────── */

fieldset.qualif-input {
  border: 0;
  margin: 0;
  padding: 0;
}

fieldset.qualif-input > legend {
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--ink, #1a1a1a);
  margin-bottom: 0.5rem;
  padding: 0;
}

/* slider-anchored */
.qualif-input--slider input[type="range"] {
  width: 100%;
  margin: 0.3rem 0 0.5rem 0;
  accent-color: var(--qualif);
}
.qualif-input--slider .qualif-anchors {
  display: grid;
  grid-template-columns: repeat(var(--anchor-count, 5), 1fr);
  font-family: var(--mono, 'JetBrains Mono', monospace);
  font-size: 0.68rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--ink-soft, #555);
}
.qualif-input--slider .qualif-anchors span {
  text-align: center;
}
.qualif-input--slider .qualif-anchors span:first-child { text-align: left; }
.qualif-input--slider .qualif-anchors span:last-child { text-align: right; }

/* multi */
.qualif-input--multi ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.45rem 1rem;
}
.qualif-input--multi label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.92rem;
}
.qualif-input--multi label:has(input:disabled) {
  opacity: 0.4;
  cursor: not-allowed;
}
.qualif-input--multi input[type="checkbox"] {
  accent-color: var(--qualif);
}

/* segmented */
.qualif-input--segmented ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.qualif-input--segmented li {
  flex: 1 1 auto;
}
.qualif-input--segmented label {
  display: block;
  text-align: center;
  padding: 0.5rem 0.8rem;
  border: 1px solid var(--ink-soft, #c8c5b9);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 120ms, border-color 120ms;
}
.qualif-input--segmented label:hover {
  background: var(--qualif-hover);
}
.qualif-input--segmented input[type="radio"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.qualif-input--segmented input[type="radio"]:checked + span {
  font-weight: 600;
}
.qualif-input--segmented label:has(input:checked) {
  background: var(--qualif);
  color: white;
  border-color: var(--qualif);
}

/* ─────────────────────────────────────────────────────────────────────────
 * Footer (witness + see-recap)
 * ───────────────────────────────────────────────────────────────────────── */

.qualif-step__foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--qualif);
  flex-wrap: wrap;
  gap: 0.5rem;
}
.qualif-step__witness {
  font-family: var(--mono, 'JetBrains Mono', monospace);
  font-size: 0.78rem;
  color: var(--qualif);
  margin: 0;
}
.qualif-step__see-recap {
  font-size: 0.86rem;
  color: var(--accent, #b8582e);
  text-decoration: none;
  border-bottom: 1px dotted currentColor;
}
.qualif-step__see-recap:hover {
  border-bottom-style: solid;
}
.qualif-step__see-recap[hidden] {
  display: none;
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/dossier-qualif.css
git commit -m "feat(qualif): CSS mini-bloc — slider/multi/segmented, témoin, see-recap"
```

### Task 4.2 — CSS récap (radar + verdict + recos + actions)

**Files:**
- Modify: `assets/dossier-qualif.css`

- [ ] **Step 1: Ajouter les styles récap à la fin du CSS**

Ajoute à la fin de `assets/dossier-qualif.css` :

```css
/* ─────────────────────────────────────────────────────────────────────────
 * Récap final — qualif-recap
 * ───────────────────────────────────────────────────────────────────────── */

aside#qualif-recap {
  border: 1px solid var(--qualif);
  background: white;
  padding: clamp(20px, 3vw, 32px);
  margin: 3rem 0;
  border-radius: 4px;
  font-family: var(--sans, 'Inter', sans-serif);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.qualif-recap__head {
  margin-bottom: 1.5rem;
}
.qualif-recap__eyebrow {
  font-family: var(--mono, 'JetBrains Mono', monospace);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--qualif);
  margin: 0 0 0.4rem 0;
}
.qualif-recap__head h3 {
  font-family: var(--serif, 'Fraunces', serif);
  font-size: 1.45rem;
  font-weight: 500;
  margin: 0;
  color: var(--ink, #1a1a1a);
}
.qualif-recap__head h3 strong {
  color: var(--qualif);
  font-weight: 600;
}

.qualif-recap__grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2rem;
  align-items: start;
}

.qualif-recap__radar {
  margin: 0;
}
.qualif-recap__radar svg {
  width: 100%;
  height: auto;
  display: block;
}
.qualif-recap__radar svg path[data-bind="user-polygon"] {
  fill: var(--accent, #b8582e);
  fill-opacity: 0.25;
  stroke: var(--accent, #b8582e);
  stroke-width: 2;
  transition: d 300ms ease;
}
.qualif-recap__radar svg path[data-bind="profile-polygon"] {
  fill: var(--qualif);
  fill-opacity: 0.10;
  stroke: var(--qualif);
  stroke-width: 2;
  stroke-dasharray: 4 3;
  transition: d 300ms ease;
}
.qualif-recap__radar svg .grid-axis,
.qualif-recap__radar svg .grid-poly {
  fill: none;
  stroke: var(--ink-soft, #c8c5b9);
  stroke-width: 1;
  opacity: 0.5;
}
.qualif-recap__radar svg .axis-label {
  font-family: var(--mono, 'JetBrains Mono', monospace);
  font-size: 10px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  fill: var(--ink-soft, #555);
}
.qualif-recap__radar figcaption {
  text-align: center;
  font-size: 0.82rem;
  color: var(--ink-soft, #555);
  margin-top: 0.5rem;
  font-style: italic;
}

.qualif-recap__body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.qualif-recap__verdict {
  font-size: 1.02rem;
  line-height: 1.5;
  color: var(--ink, #1a1a1a);
  margin: 0;
}
.qualif-recap__verdict.is-empty {
  color: var(--ink-soft, #888);
  font-style: italic;
}

.qualif-recap__recos {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.qualif-recap__recos li {
  position: relative;
  padding-left: 1.2rem;
  font-size: 0.96rem;
  line-height: 1.45;
}
.qualif-recap__recos li::before {
  content: '·';
  position: absolute;
  left: 0;
  font-weight: 700;
  color: var(--ink-soft, #888);
}
.qualif-recap__recos li.reco-adjustment {
  color: var(--ink, #1a1a1a);
}
.qualif-recap__recos li.reco-adjustment::before {
  content: '';
}

.qualif-recap__foot {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--ink-soft, #e6e3d8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
.qualif-recap__meta {
  font-family: var(--mono, 'JetBrains Mono', monospace);
  font-size: 0.78rem;
  color: var(--ink-soft, #555);
  margin: 0;
}
.qualif-recap__actions {
  display: flex;
  gap: 0.75rem;
}
.qualif-recap__actions button {
  font-family: inherit;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--qualif);
  background: var(--qualif);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background 120ms;
}
.qualif-recap__actions button:hover {
  background: #4a5872;
}
.qualif-recap__actions button[disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}
.qualif-recap__actions button.is-quiet {
  background: transparent;
  color: var(--qualif);
  border-color: transparent;
  text-decoration: underline;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
}
.qualif-recap__actions button.is-quiet:hover {
  background: var(--qualif-hover);
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/dossier-qualif.css
git commit -m "feat(qualif): CSS récap — radar SVG, verdict, recos, actions"
```

### Task 4.3 — CSS mobile + print

**Files:**
- Modify: `assets/dossier-qualif.css`

- [ ] **Step 1: Ajouter les media queries**

Ajoute à la fin de `assets/dossier-qualif.css` :

```css
/* ─────────────────────────────────────────────────────────────────────────
 * Mobile (≤ 1024px : grid récap empilé ; ≤ 480px : inputs en colonne)
 * ───────────────────────────────────────────────────────────────────────── */

@media (max-width: 1024px) {
  .qualif-recap__grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .qualif-recap__radar {
    max-width: 320px;
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  aside.qualif-step,
  aside#qualif-recap {
    margin-left: calc(-1 * clamp(12px, 4vw, 20px));
    margin-right: calc(-1 * clamp(12px, 4vw, 20px));
    border-radius: 0;
  }
  .qualif-input--multi ul {
    grid-template-columns: 1fr;
  }
  .qualif-input--slider .qualif-anchors {
    /* Garder seulement min/milieu/max sur les paliers 5-tier */
    grid-template-columns: repeat(3, 1fr);
  }
  .qualif-input--slider .qualif-anchors span:nth-child(2),
  .qualif-input--slider .qualif-anchors span:nth-child(4) {
    display: none;
  }
  .qualif-recap__head h3 {
    font-size: 1.2rem;
  }
  .qualif-recap__foot {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* ─────────────────────────────────────────────────────────────────────────
 * Print — one-pager A4 portrait
 * ───────────────────────────────────────────────────────────────────────── */

@media print {
  /* Tout cacher SAUF le récap et son contenu */
  body > *:not(main),
  main > *:not(aside#qualif-recap),
  header.site,
  aside#toc,
  aside#sources,
  .topbar,
  #topbar,
  aside.qualif-step,
  aside.quiz-card,
  aside.callout {
    display: none !important;
  }
  main {
    display: block;
    padding: 0;
    max-width: none;
    width: auto;
  }
  aside#qualif-recap {
    border: none;
    box-shadow: none;
    background: white;
    margin: 0;
    padding: 0;
    page-break-inside: avoid;
  }
  .qualif-recap__head h3 {
    font-size: 1.6rem;
  }
  .qualif-recap__grid {
    grid-template-columns: 280px 1fr;
    gap: 1.5rem;
  }
  .qualif-recap__radar svg path[data-bind="user-polygon"],
  .qualif-recap__radar svg path[data-bind="profile-polygon"] {
    transition: none;
  }
  .qualif-recap__actions {
    display: none;
  }
  .qualif-recap__foot::after {
    content: '— Profil établi sur mathieugug.github.io/analytics-agentique-gcp/ · © Mathieu Guglielmino';
    display: block;
    width: 100%;
    text-align: center;
    margin-top: 1rem;
    font-family: var(--mono, monospace);
    font-size: 0.7rem;
    color: #888;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/dossier-qualif.css
git commit -m "feat(qualif): CSS mobile + print one-pager A4"
```

---

## Phase 5 — Injecteur Python `tools/insert_qualif.py`

À la fin de cette phase : le script idempotent rend les 6 mini-blocs + le récap dans l'app GCP, plus inject les `<link>`/`<script>` de la lib.

### Task 5.1 — Squelette du script (parse args + load JSON + validation)

**Files:**
- Create: `tools/insert_qualif.py`

- [ ] **Step 1: Créer le fichier avec parsing args et validation JSON**

Crée `tools/insert_qualif.py` :

```python
#!/usr/bin/env python3
"""
insert_qualif.py — inject qualification mini-blocs and recap into a deep-research app from a JSON sidecar.

Usage:
    python insert_qualif.py --app PATH --qualif PATH [--check] [--strict]

Modèle calqué sur insert-quizzes.py (idempotent, dry-run, strict mode).
Spec : docs/superpowers/specs/2026-05-23-business-qualification-widget-design.md
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
from pathlib import Path
from typing import Any


def load_qualif(path: Path) -> dict[str, Any]:
    with path.open('r', encoding='utf-8') as f:
        return json.load(f)


def validate_qualif(config: dict[str, Any]) -> list[str]:
    """Retourne la liste des erreurs (vide si OK)."""
    errors: list[str] = []
    meta = config.get('meta', {})
    for field in ('slug', 'version', 'title', 'recap_before_heading_id'):
        if not meta.get(field):
            errors.append(f'meta.{field} missing or empty')

    axes = config.get('axes', [])
    if not isinstance(axes, list) or len(axes) == 0:
        errors.append('axes must be a non-empty array')
        return errors

    axis_ids: set[str] = set()
    for i, axis in enumerate(axes):
        prefix = f'axes[{i}]'
        for field in ('id', 'label', 'before_heading_id', 'intro'):
            if not axis.get(field):
                errors.append(f'{prefix}.{field} missing')
        aid = axis.get('id', '')
        if aid in axis_ids:
            errors.append(f'duplicate axis id: {aid}')
        axis_ids.add(aid)

        inputs = axis.get('inputs', [])
        if not isinstance(inputs, list) or len(inputs) == 0:
            errors.append(f'{prefix}.inputs must be non-empty')
            continue
        axial = [inp for inp in inputs if inp.get('scoring') == 'axis']
        if len(axial) != 1:
            errors.append(f'{prefix} should have exactly 1 axial-scoring input (got {len(axial)})')

    profiles = config.get('profiles', [])
    profile_ids: set[str] = set()
    for i, p in enumerate(profiles):
        prefix = f'profiles[{i}]'
        if not p.get('id'):
            errors.append(f'{prefix}.id missing')
        pid = p.get('id', '')
        if pid in profile_ids:
            errors.append(f'duplicate profile id: {pid}')
        profile_ids.add(pid)
        anchor = p.get('anchor', [])
        if not (isinstance(anchor, list) and len(anchor) == 6):
            errors.append(f'{prefix}.anchor must be a list of 6 numbers')
        else:
            for j, v in enumerate(anchor):
                if not isinstance(v, (int, float)) or not (0 <= v <= 100):
                    errors.append(f'{prefix}.anchor[{j}] = {v} not in [0..100]')

    for i, adj in enumerate(config.get('adjustments', [])):
        prefix = f'adjustments[{i}]'
        if not adj.get('id'):
            errors.append(f'{prefix}.id missing')
        if not adj.get('reco'):
            errors.append(f'{prefix}.reco missing')
        when = adj.get('when', {})
        if not when.get('axis') or when['axis'] not in axis_ids:
            errors.append(f'{prefix}.when.axis unknown: {when.get("axis")}')

    return errors


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description='Inject qualification widget blocks into an app HTML.')
    ap.add_argument('--app', required=True, type=Path)
    ap.add_argument('--qualif', required=True, type=Path)
    ap.add_argument('--check', action='store_true', help='dry-run: do not write')
    ap.add_argument('--strict', action='store_true', help='treat missing headings as errors')
    args = ap.parse_args(argv)

    if not args.app.exists():
        print(f'error: app file not found: {args.app}', file=sys.stderr)
        return 2
    if not args.qualif.exists():
        print(f'error: qualif file not found: {args.qualif}', file=sys.stderr)
        return 2

    config = load_qualif(args.qualif)
    errors = validate_qualif(config)
    if errors:
        print('JSON validation failed:', file=sys.stderr)
        for e in errors:
            print('  - ' + e, file=sys.stderr)
        return 3

    html_src = args.app.read_text(encoding='utf-8')

    # Phase 5.3+ : rendu + injection
    print(f'qualif JSON validated: {len(config["axes"])} axes, {len(config["profiles"])} profiles, {len(config.get("adjustments", []))} adjustments')
    print(f'app: {args.app} ({len(html_src)} chars)')
    print('rendu + injection: TODO (Task 5.3+)')

    return 0


if __name__ == '__main__':
    sys.exit(main())
```

- [ ] **Step 2: Run en --check sur l'app GCP — doit valider sans écrire**

Run:
```bash
python tools/insert_qualif.py --app analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html --qualif analytics-agentique-gcp/qualif.json --check
```

Attendu : sortie avec `qualif JSON validated: 6 axes, 5 profiles, 10 adjustments` puis `app: ... (N chars)`.

- [ ] **Step 3: Commit**

```bash
git add tools/insert_qualif.py
git commit -m "feat(qualif): squelette insert_qualif.py — parsing args + validation JSON"
```

### Task 5.2 — Fonctions de rendu HTML (`render_slider_anchored`, `render_multi`, `render_segmented`)

**Files:**
- Modify: `tools/insert_qualif.py`

- [ ] **Step 1: Ajouter les fonctions de rendu**

Dans `tools/insert_qualif.py`, ajoute juste avant la fonction `main()` :

```python
# ─────────────────────────────────────────────────────────────────────────
# Rendu HTML par type d'input
# ─────────────────────────────────────────────────────────────────────────

def render_slider_anchored(axis_id: str, inp: dict[str, Any]) -> str:
    """Rend un slider HTML5 avec datalist + labels d'ancres."""
    name = f'{axis_id}.{inp["id"]}'
    levels = inp.get('levels', [])
    list_id = f'qualif-{axis_id}-{inp["id"]}-levels'
    default_value = levels[0]['value'] if levels else 0
    min_value = min(lvl['value'] for lvl in levels) if levels else 0
    max_value = max(lvl['value'] for lvl in levels) if levels else 100

    datalist_options = '\n        '.join(
        f'<option value="{lvl["value"]}" label="{html.escape(lvl["label"])}"></option>'
        for lvl in levels
    )
    anchor_spans = '\n        '.join(
        f'<span>{html.escape(lvl["label"])}</span>' for lvl in levels
    )

    return f'''<fieldset class="qualif-input qualif-input--slider" style="--anchor-count: {len(levels)};">
      <legend>{html.escape(inp["label"])}</legend>
      <input type="range"
             name="{name}"
             id="qualif-{axis_id}-{inp["id"]}"
             min="{min_value}"
             max="{max_value}"
             step="1"
             value="{default_value}"
             list="{list_id}"
             aria-valuetext="{html.escape(levels[0]["label"]) if levels else ""}">
      <datalist id="{list_id}">
        {datalist_options}
      </datalist>
      <div class="qualif-anchors" aria-hidden="true">
        {anchor_spans}
      </div>
    </fieldset>'''


def render_multi(axis_id: str, inp: dict[str, Any]) -> str:
    """Rend un multi-select (checkboxes) avec max_picks optionnel."""
    name = f'{axis_id}.{inp["id"]}'
    max_picks = inp.get('max_picks')
    max_label = f' (max {max_picks})' if max_picks else ''
    options_html = '\n        '.join(
        f'<li><label><input type="checkbox" name="{name}" value="{opt["id"]}"> {html.escape(opt["label"])}</label></li>'
        for opt in inp.get('options', [])
    )
    return f'''<fieldset class="qualif-input qualif-input--multi">
      <legend>{html.escape(inp["label"])}{max_label}</legend>
      <ul>
        {options_html}
      </ul>
    </fieldset>'''


def render_segmented(axis_id: str, inp: dict[str, Any]) -> str:
    """Rend un segmented control (radios stylés)."""
    name = f'{axis_id}.{inp["id"]}'
    options_html = '\n        '.join(
        f'<li><label><input type="radio" name="{name}" value="{opt["id"]}"><span>{html.escape(opt["label"])}</span></label></li>'
        for opt in inp.get('options', [])
    )
    return f'''<fieldset class="qualif-input qualif-input--segmented">
      <legend>{html.escape(inp["label"])}</legend>
      <ul>
        {options_html}
      </ul>
    </fieldset>'''


def render_input(axis_id: str, inp: dict[str, Any]) -> str:
    t = inp.get('type')
    if t == 'slider-anchored':
        return render_slider_anchored(axis_id, inp)
    if t == 'multi':
        return render_multi(axis_id, inp)
    if t == 'segmented':
        return render_segmented(axis_id, inp)
    raise ValueError(f'unknown input type: {t}')


def render_step(axis: dict[str, Any]) -> str:
    """Rend un <aside class="qualif-step"> complet."""
    inputs_html = '\n    '.join(render_input(axis['id'], inp) for inp in axis['inputs'])
    return f'''<aside class="qualif-step" data-axis="{axis["id"]}">
  <header class="qualif-step__head">
    <p class="qualif-step__eyebrow">// votre profil — {html.escape(axis["label"])}</p>
    <p class="qualif-step__intro">{html.escape(axis["intro"])}</p>
  </header>
  <div class="qualif-step__body">
    {inputs_html}
  </div>
  <footer class="qualif-step__foot">
    <p class="qualif-step__witness" role="status" aria-live="polite">— En attente de saisie</p>
    <a class="qualif-step__see-recap" href="#qualif-recap" hidden>Voir mon profil ↓</a>
  </footer>
</aside>'''


def render_recap(config: dict[str, Any]) -> str:
    """Rend le <aside id='qualif-recap'> avec radar SVG inline (grille statique, polygones data-bind)."""
    axes = config['axes']
    # 6 axes : générer les axes radiaux + labels (calcul des positions)
    import math
    cx, cy, r = 160, 160, 120
    n = len(axes)
    axis_lines: list[str] = []
    axis_labels: list[str] = []
    for i, a in enumerate(axes):
        angle = -math.pi / 2 + (i * 2 * math.pi) / n
        x_end = cx + r * math.cos(angle)
        y_end = cy + r * math.sin(angle)
        axis_lines.append(f'<line class="grid-axis" x1="{cx}" y1="{cy}" x2="{x_end:.2f}" y2="{y_end:.2f}"/>')
        # Label position un peu au-delà du rayon
        lx = cx + (r + 16) * math.cos(angle)
        ly = cy + (r + 16) * math.sin(angle)
        anchor = 'middle'
        if math.cos(angle) > 0.3: anchor = 'start'
        elif math.cos(angle) < -0.3: anchor = 'end'
        axis_labels.append(
            f'<text class="axis-label" x="{lx:.1f}" y="{ly:.1f}" text-anchor="{anchor}" dominant-baseline="middle">{html.escape(a["label"])}</text>'
        )

    # Grille polygonale concentrique
    grid_polys: list[str] = []
    for ratio in (0.25, 0.5, 0.75, 1.0):
        pts = []
        for i in range(n):
            angle = -math.pi / 2 + (i * 2 * math.pi) / n
            x = cx + ratio * r * math.cos(angle)
            y = cy + ratio * r * math.sin(angle)
            pts.append(f'{x:.2f},{y:.2f}')
        grid_polys.append(f'<polygon class="grid-poly" points="{" ".join(pts)}"/>')

    axis_lines_html = '\n          '.join(axis_lines)
    axis_labels_html = '\n          '.join(axis_labels)
    grid_polys_html = '\n          '.join(grid_polys)

    return f'''<aside id="qualif-recap" class="qualif-recap" aria-labelledby="qualif-recap-title">
  <header class="qualif-recap__head">
    <p class="qualif-recap__eyebrow">// votre profil — diagnostic</p>
    <h3 id="qualif-recap-title">Profil <strong data-bind="profile-label">—</strong></h3>
  </header>

  <div class="qualif-recap__grid">
    <figure class="qualif-recap__radar">
      <svg viewBox="0 0 320 320" role="img" aria-labelledby="radar-title radar-desc">
        <title id="radar-title">Radar du profil</title>
        <desc id="radar-desc" data-bind="radar-desc">Aucun axe renseigné.</desc>
        <g>
          {grid_polys_html}
          {axis_lines_html}
        </g>
        <path data-bind="profile-polygon" d=""/>
        <path data-bind="user-polygon" d=""/>
        <g>
          {axis_labels_html}
        </g>
      </svg>
      <figcaption data-bind="radar-caption">Complétez les blocs pour voir votre radar.</figcaption>
    </figure>

    <div class="qualif-recap__body">
      <p class="qualif-recap__verdict is-empty" data-bind="verdict">Aucun axe renseigné. Complétez les blocs ci-dessus pour faire apparaître votre profil.</p>
      <ul class="qualif-recap__recos" data-bind="recos"></ul>
    </div>
  </div>

  <footer class="qualif-recap__foot">
    <p class="qualif-recap__meta">
      Profil établi le <time data-bind="ts">—</time> ·
      <span data-bind="completeness">0 sur 6 axes renseignés</span>
    </p>
    <div class="qualif-recap__actions">
      <button type="button" data-action="print" disabled>Imprimer le récap</button>
      <button type="button" data-action="reset" class="is-quiet" disabled>Réinitialiser</button>
    </div>
  </footer>
</aside>'''
```

- [ ] **Step 2: Test ad-hoc d'import**

Run:
```bash
python -c "from tools.insert_qualif import render_step, render_recap; import json; c = json.load(open('analytics-agentique-gcp/qualif.json')); print(render_step(c['axes'][0])[:200])"
```

Attendu : le début du HTML rendu (avec `<aside class=\"qualif-step\" data-axis=\"maturite-ia\">`).

- [ ] **Step 3: Commit**

```bash
git add tools/insert_qualif.py
git commit -m "feat(qualif): render_step/render_recap + 3 types d'input + SVG radar grille"
```

### Task 5.3 — Logique d'injection (replace ou insert avant heading, gestion `<hr />`)

**Files:**
- Modify: `tools/insert_qualif.py`

- [ ] **Step 1: Ajouter les fonctions d'injection**

Dans `tools/insert_qualif.py`, ajoute juste avant la fonction `main()` :

```python
# ─────────────────────────────────────────────────────────────────────────
# Injection : replace si existant, sinon insert avant le heading
# ─────────────────────────────────────────────────────────────────────────

ASIDE_STEP_RE = re.compile(
    r'<aside class="qualif-step" data-axis="(?P<axis>[^"]+)">.*?</aside>',
    re.DOTALL,
)
ASIDE_RECAP_RE = re.compile(
    r'<aside id="qualif-recap"[^>]*>.*?</aside>',
    re.DOTALL,
)
HR_BEFORE_RE = re.compile(r'<hr\s*/?>\s*(?=<h[23] id=")')


def heading_pos(html_src: str, heading_id: str) -> int:
    """Retourne la position du <h2|h3 id="..."> dans html_src, ou -1."""
    pat = re.compile(rf'<h[23] id="{re.escape(heading_id)}"[^>]*>')
    m = pat.search(html_src)
    return m.start() if m else -1


def maybe_pull_before_hr(html_src: str, pos: int) -> int:
    """Si un <hr> précède directement le heading (à moins de ~80 chars), retourne sa position."""
    window = html_src[max(0, pos - 200):pos]
    hr_match = re.search(r'<hr\s*/?>\s*$', window)
    if hr_match:
        return pos - 200 + hr_match.start() if pos - 200 >= 0 else hr_match.start()
    return pos


def inject_step(html_src: str, axis: dict[str, Any], strict: bool = False) -> tuple[str, str]:
    """Retourne (new_html, action) où action ∈ {'inserted', 'replaced', 'skipped'}."""
    rendered = render_step(axis)
    # 1. Replace if present
    pat = re.compile(
        rf'<aside class="qualif-step" data-axis="{re.escape(axis["id"])}">.*?</aside>',
        re.DOTALL,
    )
    if pat.search(html_src):
        new_html = pat.sub(rendered, html_src, count=1)
        return new_html, 'replaced'
    # 2. Insert before heading
    pos = heading_pos(html_src, axis['before_heading_id'])
    if pos == -1:
        msg = f'warning: heading id "{axis["before_heading_id"]}" not found for axis "{axis["id"]}"'
        if strict:
            raise RuntimeError(msg)
        print(msg, file=sys.stderr)
        return html_src, 'skipped'
    insert_pos = maybe_pull_before_hr(html_src, pos)
    indent = '\n\n'
    new_html = html_src[:insert_pos] + rendered + indent + html_src[insert_pos:]
    return new_html, 'inserted'


def inject_recap(html_src: str, config: dict[str, Any], strict: bool = False) -> tuple[str, str]:
    rendered = render_recap(config)
    if ASIDE_RECAP_RE.search(html_src):
        new_html = ASIDE_RECAP_RE.sub(rendered, html_src, count=1)
        return new_html, 'replaced'
    pos = heading_pos(html_src, config['meta']['recap_before_heading_id'])
    if pos == -1:
        msg = f'warning: heading id "{config["meta"]["recap_before_heading_id"]}" not found for recap'
        if strict:
            raise RuntimeError(msg)
        print(msg, file=sys.stderr)
        return html_src, 'skipped'
    insert_pos = maybe_pull_before_hr(html_src, pos)
    indent = '\n\n'
    new_html = html_src[:insert_pos] + rendered + indent + html_src[insert_pos:]
    return new_html, 'inserted'
```

- [ ] **Step 2: Étendre `main()` pour appeler les injections**

Remplace la fin de `main()` (à partir de `# Phase 5.3+ : rendu + injection`) par :

```python
    # Inject mini-blocs (axes)
    actions: list[str] = []
    for axis in config['axes']:
        html_src, action = inject_step(html_src, axis, strict=args.strict)
        actions.append(f'  axis "{axis["id"]}" → {action}')

    # Inject récap
    html_src, recap_action = inject_recap(html_src, config, strict=args.strict)
    actions.append(f'  recap → {recap_action}')

    # Inject lib tags (link + script) if absent
    html_src, lib_action = ensure_lib_tags(html_src)
    actions.append(f'  lib tags → {lib_action}')

    # Inject <link rel="qualif-data"> pointing to the sidecar JSON
    html_src, data_link_action = ensure_data_link(html_src, args.qualif, args.app)
    actions.append(f'  data link → {data_link_action}')

    print('\n'.join(actions))

    if args.check:
        print('\n--check : no file written')
        return 0

    args.app.write_text(html_src, encoding='utf-8')
    print(f'\nwritten: {args.app}')
    return 0
```

- [ ] **Step 3: Ajouter `ensure_lib_tags` et `ensure_data_link`**

Ajoute juste avant `main()`, après `inject_recap()` :

```python
def ensure_lib_tags(html_src: str) -> tuple[str, str]:
    """Injecte <link> et <script> de la lib si absents."""
    has_css = 'href="/assets/dossier-qualif.css"' in html_src
    has_js = 'src="/assets/dossier-qualif.js"' in html_src
    if has_css and has_js:
        return html_src, 'present'

    css_tag = '<link rel="stylesheet" href="/assets/dossier-qualif.css">'
    js_tag = '<script src="/assets/dossier-qualif.js" defer></script>'

    # CSS : insérer juste après <link rel="stylesheet" href="/assets/dossier-app.css"> si présent, sinon avant </head>
    if not has_css:
        anchor_css = 'href="/assets/dossier-app.css"'
        if anchor_css in html_src:
            # Insérer juste après la balise complète qui contient cet href
            pat = re.compile(r'<link[^>]+href="/assets/dossier-app\.css"[^>]*>')
            html_src = pat.sub(lambda m: m.group(0) + '\n  ' + css_tag, html_src, count=1)
        else:
            html_src = html_src.replace('</head>', '  ' + css_tag + '\n</head>', 1)

    # JS : insérer juste avant </body>, OU juste après <script src="/assets/dossier-app.js" defer>
    if not has_js:
        anchor_js = 'src="/assets/dossier-app.js"'
        if anchor_js in html_src:
            pat = re.compile(r'<script[^>]+src="/assets/dossier-app\.js"[^>]*>\s*</script>')
            html_src = pat.sub(lambda m: m.group(0) + '\n  ' + js_tag, html_src, count=1)
        else:
            html_src = html_src.replace('</body>', '  ' + js_tag + '\n</body>', 1)

    return html_src, 'inserted'


def ensure_data_link(html_src: str, qualif_path: Path, app_path: Path) -> tuple[str, str]:
    """Injecte <link rel="qualif-data" href="..."> pointant vers le sidecar JSON."""
    if 'rel="qualif-data"' in html_src:
        return html_src, 'present'
    # Chemin relatif : ex. ./qualif.json
    try:
        rel = qualif_path.resolve().relative_to(app_path.resolve().parent)
        href = './' + rel.as_posix()
    except ValueError:
        # fallback : chemin absolu depuis racine repo
        href = '/' + qualif_path.as_posix()
    tag = f'<link rel="qualif-data" href="{href}">'
    html_src = html_src.replace('</head>', '  ' + tag + '\n</head>', 1)
    return html_src, 'inserted'
```

- [ ] **Step 4: Run en --check sur l'app GCP**

Run:
```bash
python tools/insert_qualif.py --app analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html --qualif analytics-agentique-gcp/qualif.json --check
```

Attendu : sortie type
```
qualif JSON validated: 6 axes, 5 profiles, 10 adjustments
app: analytics-agentique-gcp/... (N chars)
  axis "maturite-ia" → inserted
  axis "environnement" → inserted
  axis "cas-usage" → inserted
  axis "equipe" → inserted
  axis "budget" → inserted
  axis "gouvernance" → inserted
  recap → inserted
  lib tags → inserted
  data link → inserted

--check : no file written
```

Si l'un des axes est `skipped` : le `before_heading_id` du JSON ne matche pas un heading de l'app. Corriger le JSON et re-runner.

- [ ] **Step 5: Commit**

```bash
git add tools/insert_qualif.py
git commit -m "feat(qualif): injection idempotente — replace/insert + lib tags + data link"
```

---

## Phase 6 — Intégration GCP

À la fin de cette phase : l'app GCP a les 6 mini-blocs + le récap injectés, visibles et fonctionnels en navigateur.

### Task 6.1 — Run réel du script sur l'app GCP

**Files:**
- Modify: `analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html`

- [ ] **Step 1: Run le script sans --check (écriture réelle)**

Run:
```bash
python tools/insert_qualif.py --app analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html --qualif analytics-agentique-gcp/qualif.json
```

Attendu : `written: analytics-agentique-gcp/...` à la fin, et toutes les actions à `inserted`.

- [ ] **Step 2: Vérifier la diff**

Run:
```bash
git diff --stat analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html
```

Attendu : `1 file changed, +N insertions, ...`. Le nombre d'insertions doit être de l'ordre de 200-300 lignes (6 mini-blocs ~30 lignes chacun + récap ~50 lignes + 2 link/script).

- [ ] **Step 3: Sanity check sur l'HTML**

Run:
```bash
grep -c 'aside class="qualif-step"' analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html
grep -c 'id="qualif-recap"' analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html
grep -c 'rel="qualif-data"' analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html
grep -c '/assets/dossier-qualif.css' analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html
grep -c '/assets/dossier-qualif.js' analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html
```

Attendu : `6`, `1`, `1`, `1`, `1`.

- [ ] **Step 4: Commit**

```bash
git add analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html
git commit -m "feat(gcp): injection des 6 mini-blocs qualif + récap"
```

### Task 6.2 — Idempotence : re-run doit produire 0 changement

**Files:**
- (no file modified, vérification)

- [ ] **Step 1: Re-run le script**

Run:
```bash
python tools/insert_qualif.py --app analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html --qualif analytics-agentique-gcp/qualif.json
```

Attendu : toutes les actions à `replaced` (pas `inserted`), et `lib tags → present`, `data link → present`.

- [ ] **Step 2: Vérifier que la diff est vide ou triviale**

Run:
```bash
git diff analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html
```

Attendu : aucun changement (ou whitespace trivial si normalisation diffère). Si diff non triviale : bug d'idempotence dans le script à fixer.

- [ ] **Step 3: Si diff non vide, investiguer**

Si la diff montre des modifications (ex. attributs réordonnés, espaces différents), c'est un bug d'idempotence. Le rendu HTML doit être strictement identique à la 2e exécution. Corriger `render_step` / `render_recap` pour figer l'ordre des attributs.

Si OK : pas de commit (rien à committer).

### Task 6.3 — Vérification visuelle en navigateur

**Files:**
- (vérification manuelle)

- [ ] **Step 1: Démarrer un serveur local**

Run:
```bash
python -m http.server 8000
```

(Laisser tourner dans un terminal séparé.)

- [ ] **Step 2: Ouvrir l'app GCP dans le navigateur**

URL : `http://localhost:8000/analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html`

- [ ] **Step 3: Vérifier visuellement chaque axe**

Pour chaque mini-bloc (6×) :
- L'eyebrow `// votre profil — <axe>` est visible.
- Le slider/multi/segmented sont rendus correctement.
- Cliquer/glisser une saisie : le témoin passe de "En attente de saisie" → "1 sur 3 renseignés" → etc.
- Le bouton "Voir mon profil ↓" apparaît dès la 1re saisie.
- Click sur "Voir mon profil ↓" → scroll smooth vers le récap final.

Pour le récap :
- Avant toute saisie : verdict gris "Aucun axe renseigné...", radar avec grille seule.
- Après 1+ saisie : profil dominant affiché, radar polygone utilisateur visible, recos remplies.
- Après 6 axes complets : verdict complet + jusqu'à 5 puces.
- Click "Imprimer le récap" → ouvre la fenêtre d'impression du navigateur.
- Click "Réinitialiser" → confirm() → reset propre.

- [ ] **Step 4: Vérifier en print preview**

Dans la fenêtre d'impression du navigateur :
- Seul le récap est affiché (pas la prose, pas la topbar, pas les sidebars, pas les mini-blocs).
- Le footer imprimé montre `mathieugug.github.io/analytics-agentique-gcp/ · © Mathieu Guglielmino`.
- Mise en page A4 portrait propre, tout tient sur une page.

- [ ] **Step 5: Vérifier mobile en devtools**

Dans Chrome DevTools, basculer en mode mobile (iPhone SE 375px) :
- Les mini-blocs prennent toute la largeur, padding correct.
- Le récap empile radar au-dessus + verdict/recos en dessous.
- Les inputs multi passent en 1 colonne.
- Les ancres slider montrent seulement 3 (min/milieu/max).

- [ ] **Step 6: Vérifier LocalStorage persistance**

- Faire quelques saisies.
- Rafraîchir la page (`F5`).
- Vérifier que les saisies ré-apparaissent, que le récap reste rempli.

Si tout passe : pas de bug bloquant. Si quelque chose casse : noter précisément et créer une tâche de fix avant de continuer (la phase 7 dépend d'un récap fonctionnel).

- [ ] **Step 7: Arrêter le serveur local**

`Ctrl+C` dans le terminal du serveur.

---

## Phase 7 — Tests d'intégration et CI

À la fin de cette phase : un test Node statique vérifie que l'app GCP a bien tous les blocs attendus, et le workflow CI tourne sur cette branche.

### Task 7.1 — Test d'intégration sur l'app GCP

**Files:**
- Create: `tests/qualif-integration.test.mjs`

- [ ] **Step 1: Écrire le test**

Crée `tests/qualif-integration.test.mjs` :

```javascript
import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APP = readFileSync(
  join(ROOT, 'analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html'),
  'utf8'
);
const CONFIG = JSON.parse(
  readFileSync(join(ROOT, 'analytics-agentique-gcp/qualif.json'), 'utf8')
);

test('GCP app contains exactly 6 qualif-step aside elements', () => {
  const matches = APP.match(/<aside class="qualif-step" data-axis="[^"]+">/g) || [];
  assert.equal(matches.length, 6, `expected 6 mini-blocs, got ${matches.length}`);
});

test('GCP app: each axis from JSON has a matching mini-bloc with data-axis', () => {
  for (const axis of CONFIG.axes) {
    const re = new RegExp(`<aside class="qualif-step" data-axis="${axis.id}">`);
    assert.ok(re.test(APP), `missing mini-bloc for axis "${axis.id}"`);
  }
});

test('GCP app contains exactly 1 qualif-recap aside', () => {
  const matches = APP.match(/<aside id="qualif-recap"/g) || [];
  assert.equal(matches.length, 1);
});

test('GCP app references the shared lib (CSS + JS)', () => {
  assert.ok(APP.includes('href="/assets/dossier-qualif.css"'), 'missing dossier-qualif.css link');
  assert.ok(APP.includes('src="/assets/dossier-qualif.js"'), 'missing dossier-qualif.js script');
});

test('GCP app contains <link rel="qualif-data"> pointing to qualif.json', () => {
  assert.ok(/rel="qualif-data"[^>]+qualif\.json/.test(APP), 'missing or wrong qualif-data link');
});

test('Recap has all expected data-bind hooks', () => {
  const expected = ['profile-label', 'verdict', 'recos', 'ts', 'completeness', 'radar-desc', 'radar-caption', 'user-polygon', 'profile-polygon'];
  for (const hook of expected) {
    assert.ok(APP.includes(`data-bind="${hook}"`), `missing data-bind="${hook}"`);
  }
});

test('Each axis mini-bloc has the right number of inputs (3 fieldsets each)', () => {
  for (const axis of CONFIG.axes) {
    // Extract this axis aside block
    const re = new RegExp(`<aside class="qualif-step" data-axis="${axis.id}">[\\s\\S]*?</aside>`);
    const m = APP.match(re);
    assert.ok(m, `axis "${axis.id}" block not found`);
    const fieldsetCount = (m[0].match(/<fieldset class="qualif-input/g) || []).length;
    assert.equal(fieldsetCount, axis.inputs.length, `axis "${axis.id}" expected ${axis.inputs.length} fieldsets, got ${fieldsetCount}`);
  }
});

test('Mini-blocs sit before their target heading in document order', () => {
  for (const axis of CONFIG.axes) {
    const asidePat = new RegExp(`<aside class="qualif-step" data-axis="${axis.id}">`);
    const headingPat = new RegExp(`<h[23] id="${axis.before_heading_id}"`);
    const asidePos = APP.search(asidePat);
    const headingPos = APP.search(headingPat);
    assert.ok(asidePos !== -1, `axis "${axis.id}" aside not found`);
    assert.ok(headingPos !== -1, `heading "${axis.before_heading_id}" not found`);
    assert.ok(asidePos < headingPos, `axis "${axis.id}" should be before heading "${axis.before_heading_id}" (aside at ${asidePos}, heading at ${headingPos})`);
  }
});
```

- [ ] **Step 2: Run tests — doivent passer**

Run:
```bash
node --test tests/qualif-integration.test.mjs
```

Attendu : `pass 8 / fail 0`.

- [ ] **Step 3: Commit**

```bash
git add tests/qualif-integration.test.mjs
git commit -m "test(qualif): intégration sur app GCP — 8 tests (mini-blocs, recap, lib tags)"
```

### Task 7.2 — Étendre le workflow CI pour inclure les tests qualif

**Files:**
- Modify: `.github/workflows/test.yml`

- [ ] **Step 1: Modifier la ligne `node --test`**

Édite `.github/workflows/test.yml`. Remplace la ligne :

```yaml
        run: node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs
```

Par :

```yaml
        run: node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs tests/qualif-contract.test.mjs tests/qualif-engine.test.mjs tests/qualif-integration.test.mjs
```

- [ ] **Step 2: Run la suite complète localement pour vérif**

Run:
```bash
node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs tests/qualif-contract.test.mjs tests/qualif-engine.test.mjs tests/qualif-integration.test.mjs
```

Attendu : tout vert, temps total < 5s. Si un ancien test échoue : sans doute une régression de Phase 6 — investiguer.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/test.yml
git commit -m "ci(qualif): inclure les 3 tests qualif dans le workflow"
```

---

## Phase 8 — Documentation et finalisation

À la fin de cette phase : CLAUDE.md documente le widget, le hub GCP mentionne la fonctionnalité (optionnel), la PR est ouverte.

### Task 8.1 — Documenter dans CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Repérer où insérer la section**

Run:
```bash
grep -n "^## " CLAUDE.md | head -20
```

Repérer la section "## Quiz cards" — on insère "## Widget de qualification business" juste après celle des callouts (qui suit les quiz).

- [ ] **Step 2: Ajouter la section**

Dans `CLAUDE.md`, ajoute après la section "## Encadrés de renvoi vers d'autres dossiers (callouts)" et avant "## Bibliothèque partagée `/assets/dossier-app.{js,css}`" :

```markdown
## Widget de qualification business (qualif)

Widget diégétique : 6 mini-blocs distribués au fil de la prose d'un dossier deep-research (axes Maturité IA, Environnement, Cas d'usage, Équipe, Budget, Gouvernance), + récap radar SVG en fin d'article avec verdict + recos. Pilote sur `analytics-agentique-gcp/`.

**Source de vérité** : sidecar JSON par dossier (`<dossier>/qualif.json`) déclare axes, inputs, profils types et règles d'ajustement. La lib partagée rend les mini-blocs, calcule le profil dominant par distance euclidienne, peint le radar et persiste en localStorage.

**Couleur sémantique** : `--qualif: #5b6d8a` (slate-blue), 3e couleur du fil après `--carmine` (quiz) et `--teal` (callout).

**Commande repo** (idempotente, à re-runner après chaque édition du JSON) :

```
python tools/insert_qualif.py \
  --app analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html \
  --qualif analytics-agentique-gcp/qualif.json
```

Le script idempotent (`--check` pour dry-run, `--strict` pour failer sur missing heading) :
- valide le JSON (6 axes, 5 profils, anchor de longueur 6, références d'ajustement)
- injecte les 6 `<aside class="qualif-step" data-axis="...">` avant les `before_heading_id` du JSON
- injecte le `<aside id="qualif-recap">` avant `meta.recap_before_heading_id`
- ajoute `<link href="/assets/dossier-qualif.css">`, `<script src="/assets/dossier-qualif.js" defer>` et `<link rel="qualif-data" href="./qualif.json">` si absents

**Spec & plan** : `docs/superpowers/specs/2026-05-23-business-qualification-widget-design.md`, `docs/superpowers/plans/2026-05-23-business-qualification-widget.md`.

**Tests CI** : `tests/qualif-contract.test.mjs`, `tests/qualif-engine.test.mjs`, `tests/qualif-integration.test.mjs` (run dans le workflow `.github/workflows/test.yml`).

**Print** : `@media print` dans `/assets/dossier-qualif.css` masque tout sauf le récap → one-pager A4 propre pour glisser dans un dossier RDV.
```

- [ ] **Step 3: Mettre à jour Quick Reference (en haut du CLAUDE.md)**

Repérer la section "## Quick Reference" en haut du fichier. Ajouter une ligne dans le "Publier un nouveau dossier" qui mentionne le widget de qualif. Actuellement la liste va jusqu'à 5. Ajouter :

```markdown
6. (Optionnel) Si tu veux activer le widget de qualif : créer `<slug>/qualif.json` (6 axes, 5 profils, règles), puis `python tools/insert_qualif.py --app … --qualif …`. Cf. *Widget de qualification business* pour le calibrage.
```

À insérer après le point "5. Avant merge : vérifier la checklist mobile…".

- [ ] **Step 4: Vérifier le rendu markdown**

Run:
```bash
head -30 CLAUDE.md
```

S'assurer que la Quick Reference reste lisible.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: section CLAUDE.md pour le widget de qualif + Quick Reference"
```

### Task 8.2 — Mettre à jour `assets/README.md`

**Files:**
- Modify: `assets/README.md`

- [ ] **Step 1: Ajouter une section pour dossier-qualif**

Dans `assets/README.md`, après la fin du contenu actuel sur `dossier-app`, ajoute :

```markdown

---

# Lib `dossier-qualif.{js,css}` (widget de qualif business)

Pilier indépendant de `dossier-app`. Active le widget de qualification business sur un dossier en plus du runtime principal.

## Fichiers

- **`dossier-qualif.js`** — IIFE qui charge le sidecar JSON via `<link rel="qualif-data">`, rend les mini-blocs interactifs, calcule profil + recos, peint le radar SVG, persiste en LocalStorage.
- **`dossier-qualif.css`** — patterns structurels pour `.qualif-step`, `.qualif-input--{slider,multi,segmented}`, `.qualif-recap` + radar SVG + print A4.

## Inclusion dans une app

```html
<!-- Dans <head>, après <link href="/assets/dossier-app.css"> -->
<link rel="stylesheet" href="/assets/dossier-qualif.css">
<link rel="qualif-data" href="./qualif.json">

<!-- Dans <body>, juste avant </body>, après <script src="/assets/dossier-app.js"> -->
<script src="/assets/dossier-qualif.js" defer></script>
```

L'injection est automatique via `tools/insert_qualif.py` — voir CLAUDE.md.

## Contrat DOM

| Pattern | IDs / sélecteurs |
|---|---|
| Mini-blocs | `<aside class="qualif-step" data-axis="...">` |
| Récap | `<aside id="qualif-recap">` |
| Bindings dynamiques | `[data-bind="profile-label"]`, `[data-bind="verdict"]`, `[data-bind="recos"]`, `[data-bind="ts"]`, `[data-bind="completeness"]`, `[data-bind="radar-desc"]`, `[data-bind="radar-caption"]`, `[data-bind="user-polygon"]`, `[data-bind="profile-polygon"]` |
| Actions | `button[data-action="print"]`, `button[data-action="reset"]` |

## Persistance

LocalStorage clé `qualif_<slug>_v<n>`. Bump `meta.version` du JSON → ancien profil silencieusement ignoré (pas de migration).
```

- [ ] **Step 2: Commit**

```bash
git add assets/README.md
git commit -m "docs(assets): section README pour dossier-qualif.{js,css}"
```

### Task 8.3 — Run final de toute la suite de tests

**Files:**
- (vérification)

- [ ] **Step 1: Run la suite complète**

Run:
```bash
node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs tests/qualif-contract.test.mjs tests/qualif-engine.test.mjs tests/qualif-integration.test.mjs
```

Attendu : tout vert.

- [ ] **Step 2: Vérifier l'idempotence finale du script**

Run:
```bash
python tools/insert_qualif.py --app analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html --qualif analytics-agentique-gcp/qualif.json
git diff --stat
```

Attendu : `--stat` montre aucun changement (ou trivial). Sinon : bug à investiguer.

- [ ] **Step 3: Vérifier que le hub GCP n'est pas cassé**

Run:
```bash
python -m http.server 8000
```

Ouvrir `http://localhost:8000/analytics-agentique-gcp/index.html` — la home du dossier doit fonctionner normalement (la modification est uniquement sur l'app, pas le hub).

Ouvrir `http://localhost:8000/analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html` — l'app doit afficher les 6 mini-blocs et le récap, l'interaction doit fonctionner.

`Ctrl+C` pour arrêter le serveur.

### Task 8.4 — Push et PR

**Files:**
- (git ops)

- [ ] **Step 1: Vérifier le log**

Run:
```bash
git log --oneline main..HEAD
```

Attendu : ~25-30 commits, lisibles, conventional commits respectés (`feat(qualif):`, `test(qualif):`, `docs:`, `ci(qualif):`, etc.).

- [ ] **Step 2: Push la branche**

Run:
```bash
git push -u origin claude/business-qualif-widget-2026-05-23
```

Attendu : la branche est créée sur origin et trackée.

- [ ] **Step 3: Ouvrir une PR via MCP GitHub**

Utiliser l'outil `mcp__github__create_pull_request` (pas `gh` qui n'est pas installé). Owner: `mathieugug`. Repo: `mathieugug.github.io`.

Titre : `feat(qualif): widget de qualification business — pilote analytics-agentique-gcp`

Body :
```
## Summary

Widget de qualif diégétique : 6 mini-blocs distribués au fil de la prose (Maturité IA, Environnement, Cas d'usage, Équipe, Budget, Gouvernance) + récap radar SVG en fin d'article. Pilote sur `analytics-agentique-gcp/`.

Architecture : sidecar JSON par dossier (`<dossier>/qualif.json`) + lib partagée `/assets/dossier-qualif.{js,css}` (zéro dépendance, IIFE auto-bootstrap) + injecteur Python idempotent `tools/insert_qualif.py` (modèle `insert-quizzes.py`).

Mapping profil par distance euclidienne sur 6 axes vers 5 personas (Explorer, PoC trapped, Builder, Regulated, Pioneer) + jusqu'à 2 recos d'ajustement via règles déclaratives. Export LocalStorage + print one-pager A4. Pas de capture email, pas de tracker.

3e couleur sémantique du fil : `--qualif: #5b6d8a` (slate-blue) après `--carmine` (quiz) et `--teal` (callout).

## Spec & plan

- Spec : `docs/superpowers/specs/2026-05-23-business-qualification-widget-design.md`
- Plan : `docs/superpowers/plans/2026-05-23-business-qualification-widget.md`

## Test plan

- [ ] `node --test tests/qualif-contract.test.mjs tests/qualif-engine.test.mjs tests/qualif-integration.test.mjs` (45+ assertions)
- [ ] Run idempotent : 2e exécution du script → aucun changement
- [ ] Visuel sur `http://localhost:8000/analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html` : 6 mini-blocs visibles aux bons endroits, récap fonctionnel
- [ ] LocalStorage persiste à F5
- [ ] Reset confirm() + vide bien
- [ ] Print preview → one-pager A4 propre, seul le récap visible
- [ ] Mobile devtools 375px : mini-blocs et récap restent lisibles

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

- [ ] **Step 4: Récupérer l'URL de la PR pour le user**

Note le `html_url` retourné par l'API. Donner l'URL au user pour qu'il puisse relire et merger.

---

## Self-Review interne (avant de transmettre)

Avant de considérer le plan terminé, l'exécutant doit vérifier :

1. **Coverage spec** : Les 8 critères de succès du spec (à la fin du fichier spec) sont tous couverts par une tâche. ✓
2. **Aucun placeholder** : Aucune occurrence de `TBD`, `TODO`, `FIXME`, `XXX` dans le plan ou les fichiers produits.
3. **Type consistency** : Les noms de fonctions (`computeAxisScore`, `dominantProfile`, `applyAdjustments`, `renderRadarPath`, `wireSteps`, `wireRecap`, `renderAll`) sont identiques dans toutes les tâches qui les référencent.
4. **DOM contract consistency** : Les `data-bind="..."` listés dans `wireRecap`/`renderRecapUI` (Phase 3.3) sont les mêmes que ceux générés par `render_recap` (Phase 5.2) et vérifiés par les tests d'intégration (Phase 7.1).

Si une incohérence est détectée pendant l'exécution : revenir sur le plan et le corriger AVANT de continuer l'implémentation, pour ne pas se piéger plus tard.
