# CC-10 Dev Agentique — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Livrer le cas pratique CC-10 « Pair programming → organisation dev agentique » du livre, complet et basculé `statut: "livre"` — JSON 19 sections + MD narratif ~7 000 mots + 4 SVG figures + HTML rendu self-contained + mises à jour hub/index + SEO + tests CI passants.

**Architecture:** Cas pratique éditorial conforme au schéma canonique v2 (`livre/use-cases-data/schemas/case.schema.md`). Source unique de vérité = JSON ; le MD narre, les SVG illustrent, le HTML rendu est self-contained (CSS + JS inline). Calqué sur le patron CC-14 (déjà livré, commit `644f9d3`). La spec design (docs/superpowers/specs/2026-06-04-CC-10-dev-agentique-design.md) est la **source de contenu de référence** — chaque tâche cite la section du spec à consommer pour éviter de dupliquer 500 lignes.

**Tech Stack:** JSON + Markdown + SVG inline + HTML/CSS/JS vanilla self-contained. Tests CI : `node --test tests/cases-contract.test.mjs tests/roi-metrics-contract.test.mjs tests/cases-build.test.mjs` (zéro dépendance, < 5 s). Outils repo : `tools/seo_dossiers.py` (SEO + og.png), `python -c "import xml.etree.ElementTree as ET; ET.parse('x.svg')"` (validation SVG strict).

---

## Spec source

**Fichier de référence** : `docs/superpowers/specs/2026-06-04-CC-10-dev-agentique-design.md` (commit `ff98b41`).
- §1 — Métadonnées canoniques + thèse + décisions tranchées
- §3.1–§3.20 — Contenu structuré des 19 sections JSON + figures
- §5 — Structure du MD (17 sections numérotées)
- §6 — HTML rendu (widgets + topbar + hero)
- §7 — Ordre d'implémentation suggéré
- §8 — Risques et points d'attention
- §9 — Définition de fin (DoD éditoriale)

Calibration éditoriale = **CC-14 power users**. Fichiers de référence à lire pour calquer ton, structure, widgets :
- `livre/cas-pratiques/cases/CC-14-power-users.json`
- `livre/cas-pratiques/cases/CC-14-power-users.md`
- `livre/cas-pratiques/CC-14-power-users.html`

---

## File structure

### Created (10)

| Fichier | Responsabilité |
|---|---|
| `livre/cas-pratiques/cases/CC-10-dev-agentique.json` | Source de vérité 19 sections canoniques |
| `livre/cas-pratiques/cases/CC-10-dev-agentique.md` | Narration ~7 000 mots (17 sections + footnotes) |
| `livre/cas-pratiques/images/CC-10-dev-agentique/CC-10-fig-00-architecture-actuelle.svg` | Stack SI dev actuelle (obligatoire) — A3 paysage 1600×1130 |
| `livre/cas-pratiques/images/CC-10-dev-agentique/CC-10-fig-01-anatomie-patterns.svg` | Comparatif 4 patterns d'agents de dev — 1600×900 |
| `livre/cas-pratiques/images/CC-10-dev-agentique/CC-10-fig-02-workflow-ticket.svg` | Workflow ticket en mode agentique — 1600×1000 |
| `livre/cas-pratiques/images/CC-10-dev-agentique/CC-10-fig-03-derive-couts.svg` | Dérive coûts inférence 2024-2026 par pattern — 1480×800 |
| `livre/cas-pratiques/CC-10-dev-agentique.html` | HTML rendu self-contained (CSS+JS inline) |
| `livre/cas-pratiques/CC-10-dev-agentique-og.png` | Carte sociale 1200×630 — généré par `tools/og-card.py` via `tools/seo_dossiers.py` |
| `docs/superpowers/notes/2026-06-04-CC-10-sources-actu.md` | Notes de fact-checking pour §10 (tokenmaxxing / Uber / Copilot pricing) |

### Modified (3)

| Fichier | Modif |
|---|---|
| `livre/use-cases-data/cases-index.json` | Entry `CC-10` : `statut: "draft"` → `"livre"` |
| `livre/cas-pratiques/index.html` | Carte CC-10 : `class="draft"` → `class="livre"` ; href réel ; lede final |
| `livre/index.html` | Compteur cas livrés dans le CTA `cas-pratiques` (incrémenter de N à N+1) |

### Possibly modified (conditional)

| Fichier | Modif conditionnelle |
|---|---|
| `livre/use-cases-data/shared/roi-metrics.json` | Ajouter `pr-throughput`, `post-release-bug-rate`, `enps-dev` si absents (vérification Task 0) |

---

## Conventions de commit

Style des commits récents (cf. `git log --oneline livre/cas-pratiques/`) :

```
livre/cas-pratiques : CC-10 <verbe> — <portée>
```

Exemples :
- `livre/cas-pratiques : CC-10 dev agentique — couche auteur complète (JSON + MD + 4 SVG)`
- `livre/cas-pratiques : CC-10 dev agentique — HTML rendu self-contained`
- `livre/cas-pratiques : CC-10 dev agentique — bascule statut livre + SEO`

Footer obligatoire :
```
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

Toujours `git add <fichier ciblé>` (jamais `git add .` — `.claude/` est gitignoré, d'autres untracked existent).

---

## Phase 0 — Setup & validation prérequis

### Task 0 : Vérifier `shared/roi-metrics.json` et créer les métriques manquantes

**Files:**
- Read: `livre/use-cases-data/shared/roi-metrics.json`
- Modify (conditional): `livre/use-cases-data/shared/roi-metrics.json`

- [ ] **Step 0.1 — Lire `shared/roi-metrics.json` et lister les `id` existants**

Lire le fichier, identifier si les 4 `id` cibles existent : `processing-time`, `pr-throughput`, `post-release-bug-rate`, `employee-engagement`.

Note : `processing-time` et `employee-engagement` sont des métriques canoniques très probablement déjà présentes (utilisées par CC-01, CC-14). `pr-throughput` et `post-release-bug-rate` sont dev-spécifiques et probablement absentes.

- [ ] **Step 0.2 — Ajouter les métriques manquantes**

Si `pr-throughput` absente, ajouter :
```json
{
  "id": "pr-throughput",
  "label": "Throughput de PRs équipe dev",
  "categorie": "vitesse",
  "type": "hard",
  "unite": "PR/semaine",
  "definition": "Nombre de pull requests mergées par semaine pour une équipe donnée. KPI vélocité dev classique DORA.",
  "renvoi_chapitre": "ch.23.8"
}
```

Si `post-release-bug-rate` absente, ajouter :
```json
{
  "id": "post-release-bug-rate",
  "label": "Taux de bugs post-release",
  "categorie": "qualite",
  "type": "hard",
  "unite": "% PR avec hotfix < 7j",
  "definition": "Part des PR mergées qui déclenchent un hotfix dans les 7 jours suivant le déploiement. KPI gardien qualité quand le throughput augmente.",
  "renvoi_chapitre": "ch.19"
}
```

Si `enps-dev` n'existe pas mais qu'`employee-engagement` existe : utiliser `employee-engagement` (générique) plutôt qu'inventer un id dev-spécifique. **Décision** : ne pas créer `enps-dev` séparé — réutiliser `employee-engagement` dans le JSON CC-10. Le label dans le MD reste « eNPS dev » (libre), seul l'id de la métrique liée à `roi-metrics.json` est canonique.

- [ ] **Step 0.3 — Si modifs : commit**

```bash
git add livre/use-cases-data/shared/roi-metrics.json
git commit -m "$(cat <<'EOF'
livre/use-cases-data : roi-metrics — ajout pr-throughput + post-release-bug-rate pour CC-10

Métriques DORA dev-spécifiques requises par le cas CC-10 (pair programming
→ dev agentique) : pr-throughput (KPI vélocité), post-release-bug-rate
(KPI gardien qualité). employee-engagement réutilisé pour eNPS dev.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

Si pas de modif (tout existe déjà) : skip le commit, passer à Task 1.

- [ ] **Step 0.4 — Run roi-metrics-contract.test.mjs pour valider**

```bash
node --test tests/roi-metrics-contract.test.mjs
```

Expected : PASS (vérifie que tous les `id` référencés par les cas existants pointent vers une métrique réelle ; nos nouveaux ajouts ne référencent rien donc pas de régression).

---

## Phase 1 — JSON CC-10 (19 sections)

**Principe** : écrire le JSON section par section, en consommant directement les blocs structurés du spec (§3.1 à §3.20). Le JSON est la source de vérité ; il doit valider le contrat (`tests/cases-contract.test.mjs`) avant de passer à la phase MD.

### Task 1 : JSON sections 1-3 (meta + mise_en_situation + architecture_actuelle)

**Files:**
- Create: `livre/cas-pratiques/cases/CC-10-dev-agentique.json`

- [ ] **Step 1.1 — Créer le fichier avec le squelette JSON et la section `meta`**

Consommer §1 du spec. Le JSON doit commencer par :

```json
{
  "meta": {
    "id": "CC-10",
    "titre": "Pair programming → organisation dev agentique",
    "secteur": "Développement logiciel",
    "horizontal": true,
    "facette_principale": "build_vs_buy",
    "facettes_secondaires": ["evaluation", "gouvernance"],
    "regime_recommande": "buy",
    "ia_type": "agentic",
    "axe_roi_principal": "vitesse",
    "axes_roi_secondaires": ["qualite", "bienetre"],
    "gabarit": "charniere",
    "verdict_prevu": "GO_BUY_COMPARATIF_PAR_PROFIL",
    "these_une_ligne": "Appliquer la boucle agentique au plus bas niveau — résoudre une issue, clôturer une PR, déléguer la review, jusqu'à la sécurité — sur de vraies fondations (MCP, observabilité) valide l'architecture avant de la remonter aux métiers ; mais l'all-you-can-eat Copilot est mort, le bon arbitrage 2026 n'est plus un outil unique imposé à toute l'équipe, c'est un portefeuille par profil de ticket × profil de dev, distribué via une gateway LLM avec quotas.",
    "auteur": "Mathieu Guglielmino",
    "date_v1": "2026-06-04"
  },
```

- [ ] **Step 1.2 — Ajouter la section `mise_en_situation`**

Consommer §3.2 du spec. Bloc JSON :

```json
  "mise_en_situation": {
    "scene": "Mardi 9 h, scale-up SaaS B2B (~150 devs). Le [CTO] ouvre le tableau de bord finance avant le standup : la ligne « AI tooling » a doublé en six mois. Au standup, quatre devs annoncent — sans coordination — qu'ils utilisent quatre outils différents en parallèle : Cursor en abonnement perso, Copilot via le SSO entreprise, Claude Code via Bedrock pour les gros refactors, Codex CLI pour les scripts d'ops. Le matin même, GitHub a envoyé un mail rappelant le passage aux premium requests ; en filigrane, le retex public d'Uber qui a fait dépasser son budget Copilot Enterprise circule sur les channels Slack inter-CTO. La [VP_ENG] veut une doctrine, le [CFO] veut un plafond.",
    "chiffres_bruts": [
      { "label": "Devs", "valeur": "150" },
      { "label": "PR mergées / semaine", "valeur": "280" },
      { "label": "Outils IA actifs", "valeur": "4 (Cursor, Copilot, Claude Code, Codex CLI) + 2 review auto POC (CodeRabbit, Greptile)" },
      { "label": "Budget AI tooling annualisé", "valeur": "480 k€ (×2 vs 2025)" },
      { "label": "Cycle médian ticket → PR", "valeur": "3,8 j" },
      { "label": "eNPS dev", "valeur": "38" }
    ],
    "horizon_temporel": "POC 2 mois → doctrine v1 6 mois → régime fédéré 12 mois → scale 36 mois"
  },
```

- [ ] **Step 1.3 — Ajouter la section `architecture_actuelle`**

Consommer §3.3 du spec. Bloc JSON :

```json
  "architecture_actuelle": {
    "composants": [
      { "categorie": "canal_utilisateur", "nom": "Postes dev — mix VS Code 65 % / JetBrains 25 % / Neovim 10 %", "criticite_pour_le_cas": "read_write", "remarque": "Slack et Linear comme surfaces de communication, MFA hardware key, scope par squad" },
      { "categorie": "front_metier", "nom": "GitHub.com (org Cloud) + GitHub Actions matrix CI + GitHub Advanced Security", "criticite_pour_le_cas": "read_write_via_proxy_validation", "remarque": "Secret scan + Dependabot ; webhook surface pour CodeRabbit/Greptile" },
      { "categorie": "data_scoring", "nom": "Sentry (errors) + Datadog APM/logs + Codecov + LaunchDarkly", "criticite_pour_le_cas": "read_only", "remarque": "Obs existante à étendre aux agents async ; LaunchDarkly = garde-fou rollback" },
      { "categorie": "core_metier", "nom": "Monorepo TypeScript (Next.js front + Node API) + service Java legacy 2018 (paiement) + service Go récent (event bus). Postgres + Redis managés.", "criticite_pour_le_cas": "read_write_via_proxy_validation", "remarque": "Le service Java legacy 2018 = sclérosant : agent async cloud déconseillé dessus jusqu'à refacto" },
      { "categorie": "knowledge_base", "nom": "Notion (specs, ADR) + GitHub Discussions + Confluence legacy en migration", "criticite_pour_le_cas": "read_only", "remarque": "MCP Notion officiel disponible ; corpus ADR à indexer en priorité" },
      { "categorie": "back_office", "nom": "Linear (ticketing) + Vercel (preview env) + Vault HCP (secrets)", "criticite_pour_le_cas": "read_write", "remarque": "Linear MCP officiel pour transitions et commentaires ; Vault MCP custom obligatoire (scoping fin)" },
      { "categorie": "outils_satellites", "nom": "4 outils IA cités au standup, dont 2 hors SSO (achats perso → shadow soft)", "criticite_pour_le_cas": "read_write", "remarque": "Cursor en perso + Codex CLI sur poste = surface shadow à intégrer dans la doctrine" }
    ],
    "implications_structurantes": [
      "Stack 100 % cloud, pas de mainframe → tous les patterns techniquement accessibles.",
      "Service Java legacy 2018 → agent async cloud interdit dessus jusqu'à refacto (horizon 2+ ans).",
      "Vault read-only scopé par équipe → MCP server Vault possible mais scoping fin obligatoire (RSSI).",
      "GitHub Cloud + Bedrock dispo → bascule API privée Claude/GPT-5 sans contrainte souveraineté.",
      "Datadog + Sentry → infra obs existante, à étendre pour observer les agents async (cf. ch.20)."
    ],
    "renvoi_figure": "fig-00"
  },
```

- [ ] **Step 1.4 — Commit intermédiaire (optionnel — ou attendre Task 5)**

À ce stade le JSON est invalide (manque sections obligatoires). Si tu fais un commit WIP : préciser `[wip]` dans le message. Sinon, attendre Task 5 pour un commit unique de tout le JSON.

### Task 2 : JSON sections 4-6 (application_concrete + outils_internes + modeles_cibles)

**Files:**
- Modify: `livre/cas-pratiques/cases/CC-10-dev-agentique.json`

- [ ] **Step 2.1 — Ajouter la section `application_concrete`**

Consommer §3.4 du spec. Bloc complet à insérer :

```json
  "application_concrete": {
    "modes_usage": [
      {
        "id": "A",
        "label": "Coding inline (caret IDE)",
        "moment": "Toute la journée, ~80 % des sessions dev",
        "actions": [
          "Ghost autocomplete inline (Copilot Tab / Cursor Tab / Supermaven)",
          "Dialogue chat IDE pour multi-fichier cadré (Cursor Composer, Claude Code, Codex CLI, JetBrains AI)",
          "Suggestion de tests unitaires + revue de diff en cours"
        ]
      },
      {
        "id": "B",
        "label": "Délégation de ticket (agent async cloud, hors écran)",
        "moment": "Ouvert depuis Linear ou GitHub Issue, l'agent traite, revient avec une PR. ~10 % du flux mais le plus visible.",
        "sous_modes": [
          { "id": "B1", "label": "Tier 1 trivial", "description": "Bumps deps, traduction i18n, typage strict, refacto pattern connu — Claude Code BG / Cursor BG / Codex async / Copilot Workspace / Devin" },
          { "id": "B2", "label": "Tier 2 refacto cadré", "description": "Extraction, rename API, migration framework cadré — supervisé par un sénior en chat IDE" }
        ]
      },
      {
        "id": "C",
        "label": "Review et merge (PR GitHub)",
        "moment": "Webhook PR ouverte → review auto en sentinelle + dev humain qui tranche",
        "actions": [
          "Review auto sur diff (CodeRabbit / Greptile / Copilot for PRs)",
          "Flags qualité (typage régressé, coverage en baisse, conventions monorepo)",
          "Suggestion de tests manquants"
        ]
      }
    ],
    "niveaux_autonomie": [
      { "id": "L1", "label": "Suggest", "description": "Ghost autocomplete, copie-colle ou Tab. Toujours actif.", "active_en": "POC + Pilote + Prod (tous profils)" },
      { "id": "L2", "label": "Pré-remplir", "description": "Chat IDE multi-fichier diff proposé, validation step-by-step par le dev.", "active_en": "Pilote (sénior et sénior+)" },
      { "id": "L3", "label": "Exécuter sous validation", "description": "Agent async ouvre une PR sur tier 1 / tier 2 bordé. Review humaine obligatoire avant merge.", "active_en": "Prod (tickets tier 1 ROBOT-friendly)" },
      { "id": "L4", "label": "Pleine autonomie", "description": "Auto-merge si CI verte sur backlog ROBOT-friendly (bumps deps, traductions i18n, typage strict).", "active_en": "Scale — opt-in explicite par repo, jamais sur Java legacy ni paiement / scoring" }
    ],
    "trajectoire_multi_step_exemple": {
      "scenario": "Mode B.1 — agent async cloud traite un ticket tier 1 ROBOT-friendly (bump deps avec breaking change mineur sur 12 fichiers du monorepo)",
      "etapes": [
        { "id": 1, "label": "Listen", "description": "Ticket Linear taggé `tier-1-robot` auto-routé vers l'agent async cloud (Claude Code background)" },
        { "id": 2, "label": "Retrieve", "description": "MCP calls en parallèle : GitHub (state du repo + open PRs), Linear (acceptance criteria), Datadog (perf baseline), Notion (ADR liée)", "outils_appeles": ["github-mcp.get_repo_state", "linear-mcp.get_ticket", "datadog-mcp.get_metrics", "notion-mcp.search_adr"] },
        { "id": 3, "label": "Reason + Plan", "description": "Chain-of-thought, plan publié en commentaire Linear + en draft PR description (étapes, tests touchés, risque rollback)", "renvoi_livre": "ch.7 boucle agent" },
        { "id": 4, "label": "Execute", "description": "Branche créée, commits, CI lancée — review auto en sentinelle déclenchée par webhook" },
        { "id": 5, "label": "Audit", "description": "Log structuré (chain-of-thought + diff + traces MCP + coût tokens) → audit trail Datadog (rétention 90 j)", "renvoi_livre": "ch.20 audit trail cognitif" }
      ]
    }
  },
```

- [ ] **Step 2.2 — Ajouter la section `outils_internes`**

Consommer §3.5 du spec. Reproduire la table MCP servers (8 entrées : GitHub, Linear, Datadog, Sentry, Vault, Notion, Codecov, LaunchDarkly) avec effort + risque. Format identique au schéma canonique :

```json
  "outils_internes": {
    "mcp_servers": [
      { "systeme": "GitHub", "mode": "read_write", "type_mcp": "officiel disponible", "effort_dev": "2 j", "risque": "bas", "raison_risque": "scoping par repo, accès via bot account dédié" },
      { "systeme": "Linear", "mode": "read_write", "type_mcp": "officiel", "effort_dev": "1 j", "risque": "bas", "raison_risque": "écriture des commentaires + transitions de statut" },
      { "systeme": "Datadog", "mode": "read", "type_mcp": "officiel", "effort_dev": "3 j", "risque": "bas" },
      { "systeme": "Sentry", "mode": "read", "type_mcp": "officiel", "effort_dev": "2 j", "risque": "bas" },
      { "systeme": "Vault HCP", "mode": "read_only_scope", "type_mcp": "custom obligatoire", "effort_dev": "2 sem.", "risque": "haut", "raison_risque": "scoping par équipe + masquage secret + audit RSSI — le sclérosant projet" },
      { "systeme": "Notion", "mode": "read", "type_mcp": "officiel", "effort_dev": "3 j", "risque": "bas" },
      { "systeme": "Codecov", "mode": "read", "type_mcp": "custom (API REST)", "effort_dev": "1 sem.", "risque": "bas" },
      { "systeme": "LaunchDarkly", "mode": "read", "type_mcp": "officiel", "effort_dev": "3 j", "risque": "moyen", "raison_risque": "éviter qu'un agent toggle des flags prod par erreur" }
    ],
    "effort_total": "5-6 semaines pour 1 backend / SRE senior",
    "renvois_livre": ["ch.15 MCP plateforme", "ch.16 sécurité MCP"]
  },
```

- [ ] **Step 2.3 — Ajouter la section `modeles_cibles`**

Consommer §3.6 du spec. Reproduire la table candidats + cascade :

```json
  "modeles_cibles": {
    "candidats": [
      { "modele": "Claude 4.7 Sonnet", "force_pour_le_cas": "Tool use natif, MCP first-class, 1M tokens, sweet spot dev", "faiblesse": "Cloud US (atténué Bedrock EU)", "cout_indicatif": "$3 / $15 par M tokens" },
      { "modele": "Claude 4.7 Opus", "force_pour_le_cas": "Reasoning supérieur, idéal gros refactor multi-fichier", "faiblesse": "Coût ×5, latence", "cout_indicatif": "$15 / $75 par M tokens" },
      { "modele": "Claude 4.7 Haiku", "force_pour_le_cas": "Latence faible, ghost autocomplete réaliste", "faiblesse": "Reasoning limité sur multi-fichier", "cout_indicatif": "$1 / $5 par M tokens" },
      { "modele": "GPT-5", "force_pour_le_cas": "Tool use solide, intégration Copilot par défaut", "faiblesse": "Lock-in Copilot, pricing premium reqs", "cout_indicatif": "$5 / $25 par M tokens" },
      { "modele": "Codestral 25B fine-tuné", "force_pour_le_cas": "Self-hosted possible, fallback dégradé tier 1", "faiblesse": "Reasoning en retrait, infra coûteuse", "cout_indicatif": "OpEx infra" },
      { "modele": "Cursor proprietary (cursor-small)", "force_pour_le_cas": "Latence ghost imbattable, pricing siège inclus", "faiblesse": "Boîte noire, lock-in éditeur", "cout_indicatif": "inclus siège Cursor" }
    ],
    "recommandation": {
      "regime": "cascade par pattern",
      "ghost_mode_A_inline": "Claude Haiku ou Cursor-small natif (latence)",
      "chat_ide_mode_A_multifichier": "Claude Sonnet par défaut, escalade Opus manuelle pour gros refactor",
      "agent_async_mode_B_tier1": "Claude Sonnet + Opus en fallback réflexif si plan échoue 2× — cap budget par ticket",
      "code_review_auto_mode_C": "Claude Sonnet (CodeRabbit/Greptile) — pas de bloc Opus en review (coût/PR insoutenable)",
      "argument_cascade": "Tient le tweet 'et si Anthropic est down ?' → fallback Codestral self-hosted sur tier 1. Anti-tokenmaxxing : Opus borné par budget de ticket et par session (cf. section 10 dérive des coûts)."
    }
  },
```

### Task 3 : JSON sections 7-9 (enjeux + build_buy + trajectoire_couts)

**Files:**
- Modify: `livre/cas-pratiques/cases/CC-10-dev-agentique.json`

- [ ] **Step 3.1 — Ajouter la section `enjeux`**

Consommer §3.7 du spec :

```json
  "enjeux": {
    "enjeux_chiffres": [
      { "label": "Délester le quotidien", "chiffre": "-40 % cycle ticket → PR sur tier 1", "consequence": "+25 % throughput équipe (PR/sem)" },
      { "label": "Stabiliser la qualité", "chiffre": "taux de bug post-release stable", "consequence": "à +25 % throughput — le vrai test du pattern agent" },
      { "label": "Soutenabilité économique", "chiffre": "poste inférence borné à 30 % du budget AI tooling", "consequence": "sinon dérive non finançable au COMEX Q1 2027" }
    ],
    "benchmark": {
      "reference": "DORA State of DevOps 2025 + GitHub Octoverse 2026",
      "metrique": "% PR ouvertes avec assistance agentique par taille d'équipe, distribution outils par profil dev",
      "renvoi_livre": "ch.23.8"
    }
  },
```

- [ ] **Step 3.2 — Ajouter la section `build_buy`**

Consommer §3.8 du spec. Reproduire la table 3 colonnes × 6 critères :

```json
  "build_buy": {
    "criteres": ["data_sensitivity", "personnalisation", "volumetrie", "lock_in", "time_to_value", "souverainete"],
    "options": [
      {
        "regime": "build_pur",
        "stack": "Plateforme dev agent maison (orchestrateur + LLM hosted + UI + intégrations)",
        "scores": { "data_sensitivity": "++", "personnalisation": "++", "volumetrie": "+", "lock_in": "+", "time_to_value": "--", "souverainete": "++" },
        "verdict": "Non — pas le métier d'une scale-up SaaS, effort énorme (18 mois+), retard de l'état de l'art outils du marché. Antipattern."
      },
      {
        "regime": "buy_uniforme",
        "solution": "Un seul outil pour tous (ex. Copilot Enterprise universel, Cursor universel)",
        "scores": { "data_sensitivity": "-", "personnalisation": "-", "volumetrie": "++", "lock_in": "--", "time_to_value": "++", "souverainete": "--" },
        "verdict": "Antipattern — chaque outil a ses forces (ghost / chat IDE / async / review), un Copilot universel laisse 30 % de vélocité sur la table sur les patterns chat IDE et async cloud. Et le pricing siège unique exploserait sur les power users qui tokenmaxxent."
      },
      {
        "regime": "buy_comparatif_par_profil",
        "stack": "Mix portefeuille : ghost universel + chat IDE par profil sénior + async cloud pour tier 1 + review auto en sentinelle. Distribution via gateway LLM interne + tokens scopés par profil dev.",
        "scores": { "data_sensitivity": "+", "personnalisation": "+", "volumetrie": "+", "lock_in": "0", "time_to_value": "+", "souverainete": "0" },
        "verdict": "RECOMMANDÉ — équilibre vélocité, budget maîtrisé via quotas distribués, fallback dégradé Bedrock + cascade modèle, doctrine itérée trimestriel."
      }
    ],
    "decision_ponderee": "Buy comparatif par profil ; gateway LLM interne + tokens scopés par profil dev ; cascade modèle pour le run async ; doctrine en revue trimestrielle. Le crossover gateway interne vs sièges Copilot uniformes se situe à ≈ 1 500 PR/an avec usage agentique.",
    "renvoi_livre": "ch.23.6 arbre décision"
  },
```

- [ ] **Step 3.3 — Ajouter la section `trajectoire_couts`**

Consommer §3.9 du spec. La grille 8 postes × 4 phases en k€ :

```json
  "trajectoire_couts": {
    "phases": [
      { "id": "poc", "label": "POC 2 mois", "perimetre": "10 devs early-adopters, 1 squad, mode L1 ghost + L2 chat IDE" },
      { "id": "pilote", "label": "Pilote 6 mois", "perimetre": "40 devs, 4 squads, ajout L3 async cloud sur tier 1 + review auto sentinelle" },
      { "id": "prod", "label": "Prod 12 mois", "perimetre": "150 devs, doctrine v1, gateway LLM interne, doctrine trimestrielle" },
      { "id": "scale", "label": "Scale 36 mois", "perimetre": "150 devs + sub-agents custom internes + cascade modèle mature" }
    ],
    "postes": {
      "inference":   { "poc": 18, "pilote": 95,  "prod": 320,  "scale": 620  },
      "infra":       { "poc": 6,  "pilote": 22,  "prod": 60,   "scale": 110  },
      "equipe":      { "poc": 60, "pilote": 180, "prod": 360,  "scale": 720  },
      "data":        { "poc": 4,  "pilote": 18,  "prod": 35,   "scale": 55   },
      "evaluation":  { "poc": 3,  "pilote": 25,  "prod": 80,   "scale": 160  },
      "gouvernance": { "poc": 4,  "pilote": 18,  "prod": 50,   "scale": 110  },
      "securite":    { "poc": 6,  "pilote": 22,  "prod": 55,   "scale": 105  },
      "change":      { "poc": 5,  "pilote": 35,  "prod": 110,  "scale": 220  }
    },
    "cout_par_interaction": { "poc": 7.60, "pilote": 4.80, "prod": 3.10, "scale": 2.30 },
    "crossover_point": "≈ 1 500 PR/an avec usage agentique : bascule de gateway LLM interne bat le tarif siège Copilot uniforme.",
    "commentaire_courbe": "Inférence × 35 entre POC et Scale, vs équipe × 12, vs change × 44. Le poste change pèse plus que prévu parce que la doctrine doit évoluer trimestriellement (cf. dérive du pricing). Le coût par PR divise par ~3 mais c'est l'inférence qui dérive sans gateway — d'où la section dédiée §10 du MD."
  },
```

### Task 4 : JSON sections 10-13 (gouvernance + evaluation + roi + operation_equipe + debat)

**Files:**
- Modify: `livre/cas-pratiques/cases/CC-10-dev-agentique.json`

- [ ] **Step 4.1 — Section `gouvernance`**

Consommer §3.11 du spec :

```json
  "gouvernance": {
    "raci": {
      "responsable": "[STAFF_ENG_DX] (1,5 ETP cible en Prod) + [VP_ENG]",
      "approbateur": "[CTO] (sponsor)",
      "consultes": ["[CFO] (budget AI tooling)", "[RSSI] (scoping MCP + agents async sur code prod)", "[DPO] (PII dans logs Datadog)"],
      "informes": ["Tech leads par squad", "COMEX (trimestriel)"]
    },
    "cadence_revue": {
      "comite_dev_practice": "mensuel (KPI usage + coût + qualité)",
      "alertes": "continues (dépassement quota ticket, dépassement quota dev, taux re-prompt anormal)",
      "audit_doctrine_externe": "annuel (revue par pair CTO inter-entreprise, type DX community)"
    },
    "ai_act_ligne": {
      "niveau": "hors_haut_risque_par_defaut",
      "fondement": "Code interne non-décisionnel sur tiers. Non listé Annexe III. À documenter si agents async accèdent à du code de scoring/RH/PII utilisateur final.",
      "echeance": "Documentation périmètre permanent + revue annuelle",
      "actions": ["Registre interne agents async", "Charte explicite agents async sur code prod", "Gate explicite pour repos qui touchent client/PII/scoring"]
    },
    "renvoi_livre": "ch.25 gouvernance + ch.26 IA et travail"
  },
```

- [ ] **Step 4.2 — Section `evaluation`**

Consommer §3.12 du spec :

```json
  "evaluation": {
    "regression_suite": {
      "taille": "SWE-bench Live (mensuel) + golden set interne ~80 PRs annotées (replay)",
      "cadence": "mensuelle pour SWE-bench Live ; trimestrielle pour golden set interne",
      "criteres": ["completion correcte", "respect des conventions monorepo", "pas de régression de typage", "pas de leak secret", "coverage stable ou en hausse"]
    },
    "metriques_online": [
      { "id": "pr-throughput", "cible": "+25 %", "alerte": "< +10 %" },
      { "id": "post-release-bug-rate", "cible": "stable (≤ 3 %)", "alerte": "> 5 % (rollback feature flag immédiat)" },
      { "id": "processing-time", "cible": "-40 % tier 1", "alerte": "< -20 %" },
      { "id": "employee-engagement", "cible": "+8 (eNPS dev)", "alerte": "< +3" }
    ],
    "detection_derive": {
      "outil": "Datadog + LLM-as-judge sur 5 % des PR async + ratio re-prompt par session",
      "alerte": "PagerDuty équipe Dev Productivity, escalade VP Eng si % bug post-release > 5 %",
      "fenetre": "rolling 7 jours vs baseline 30 jours"
    },
    "boucle_correction": {
      "trigger": "ticket Linear ou alerte automatique",
      "delai_re_prompt": "48 h sur la doctrine ; immédiat pour rollback feature flag pattern",
      "cadence_revision_doctrine": "trimestriel (pricing outils + bumps modèles)",
      "rollback": "feature flag par pattern (`agent-async-tier-1: off`) — possible en < 1 h"
    },
    "renvoi_livre": ["ch.19 benchmarks contestés (SWE-bench gaming — cf. benchmarks-contestes/)", "ch.20 audit trail cognitif"]
  },
```

- [ ] **Step 4.3 — Section `roi`**

Consommer §3.13 du spec :

```json
  "roi": {
    "axe_principal": "vitesse",
    "axes_secondaires": ["qualite", "bienetre"],
    "methode_mobilisee": "TEI Forrester + DORA + ch.23.7 paradoxe agentique + ch.23.8 Cigref Hard/Soft",
    "metriques": [
      { "id": "processing-time",      "borne_basse": "-25 %", "cible": "-40 % tier 1", "borne_haute": "-60 %" },
      { "id": "pr-throughput",        "borne_basse": "+12 %", "cible": "+25 %",       "borne_haute": "+40 %" },
      { "id": "post-release-bug-rate","borne_basse": "stable", "cible": "stable",       "borne_haute": "stable" },
      { "id": "employee-engagement",  "borne_basse": "+3",     "cible": "+8 (eNPS dev)","borne_haute": "+12" }
    ],
    "non_retenu": [
      { "id": "cost-per-line", "raison": "Anti-pattern Goodhart explicite — les LLM gonflent les lignes sans valeur" },
      { "id": "revenue", "raison": "Indirect, pas attribuable au programme dev tooling" },
      { "id": "nps", "raison": "Périmètre client, hors cas (renvoyé à CC-01)" }
    ]
  },
```

- [ ] **Step 4.4 — Section `operation_equipe`**

Consommer §3.14 du spec :

```json
  "operation_equipe": {
    "personas": {
      "porteur":  { "role": "[VP_ENG]",         "posture": "Convaincu, veut une doctrine partagée, sous pression du [CTO] sur le budget", "citation": "On a quatre outils en parallèle au standup, c'est intenable au COMEX." },
      "sponsor":  { "role": "[CTO]",            "posture": "Arbitre final, sponsorise mais veut un plafond budget défendable au COMEX",     "citation": "Si le budget AI tooling double encore en 2027, je dois pouvoir expliquer pourquoi en une slide." },
      "allie":    { "role": "[STAFF_ENG_DX]",   "posture": "Porte le programme opérationnel, animait déjà la communauté Cursor/Claude Code en interne", "citation": "Le bon outil dépend du ticket, pas du dev. C'est ça qu'il faut écrire dans la doctrine." },
      "opposant": { "role": "[RSSI]",           "posture": "Refus agents async sur code prod sensible, exige scoping MCP fin et masquage PII", "citation": "Un agent qui ouvre une PR sur le service de paiement, c'est non. Sur les bumps deps, je veux un audit trail complet." }
    },
    "equipe_par_phase": {
      "poc": {
        "etp_total": 1.0,
        "composition": [
          { "role": "Staff eng Dev Productivity", "etp": 0.5, "profil": "Pivot — anime la communauté Cursor/Claude Code, instrumente la mesure" },
          { "role": "RSSI référent", "etp": 0.3, "profil": "Scope MCP Vault, charte agents async" },
          { "role": "DPO référent", "etp": 0.2, "profil": "PII dans logs Datadog, registre interne" }
        ]
      },
      "prod": { "etp_total": 2.5, "note": "1,5 ETP Staff DX + 0,5 backend MCP + 0,3 RSSI + 0,2 DPO + 0,1 change manager" }
    },
    "velocite": {
      "poc":    { "duree": "2 mois",  "cadence_release": "bi-hebdo",      "perimetre": "10 devs early-adopters, mode L1+L2 ghost+chat IDE, 1 squad" },
      "pilote": { "duree": "6 mois",  "cadence_release": "hebdo",         "perimetre": "40 devs, 4 squads, ajout L3 async cloud sur tier 1 + review auto sentinelle" },
      "prod":   { "duree": "12 mois", "cadence_release": "2 sem.",        "perimetre": "150 devs, doctrine v1, gateway LLM interne" },
      "scale":  { "duree": "36 mois", "cadence_release": "mensuel",       "perimetre": "150 devs + sub-agents custom internes + cascade modèle mature" }
    },
    "sclerosants": [
      "Pricing fluctuant des outils du marché (Anthropic weekly limits, Cursor Background changes, GitHub Copilot premium reqs) → doctrine forcément trimestrielle, jamais figée.",
      "Service Java legacy 2018 → agent async cloud interdit dessus jusqu'à refacto (horizon 2+ ans).",
      "Scoping MCP Vault → 2 semaines, demande masquage secret + audit RSSI + scope par squad.",
      "Formation continue → bi-annuelle (montée patterns chat IDE + async), inertie sur les juniors.",
      "Mesure de l'eNPS dev → outillage manquant en début, à instrumenter (form trimestriel + dashboard Datadog)."
    ],
    "deadlines_externes": [
      { "echeance": "2026-08", "label": "AI Act transparence (Annexe III)", "consequence_si_ratee": "N'impacte pas directement le code interne, mais documenter le périmètre si agents touchent scoring/RH" },
      { "echeance": "2026-Q3", "label": "Présentation doctrine v1 au COMEX",  "consequence_si_ratee": "Plafond budget AI tooling imposé d'en haut sans concertation" },
      { "echeance": "2027-Q1", "label": "Revue annuelle CFO du poste AI dev tooling", "consequence_si_ratee": "Coupe arbitraire du budget si pas de récit ROI consolidé" }
    ],
    "deadline_operationnelle": "POC démarré juil. 2026 → pilote sept. 2026 → prod avr. 2027 → scale en continu."
  },
```

- [ ] **Step 4.5 — Section `debat`**

Consommer §3.15 du spec :

```json
  "debat": {
    "question": "Le buy comparatif par profil installe-t-il une économie à deux vitesses dans l'équipe — sénior bien outillés vs junior bridés ?",
    "pour": [
      { "argument": "Aligne outil sur valeur de ticket. La latence ghost suffit au junior 80 % du temps." },
      { "argument": "Les coûts d'Opus / Claude Code / Cursor Ultra sur 30 % des devs power users représentent 60 % du budget AI tooling — distribuer uniformément, c'est gâcher." },
      { "argument": "DORA mesure que l'effet ROI des outils dev se concentre sur les profils sénior + tickets standards (cf. ch.23.8)." }
    ],
    "contre": [
      { "argument": "Crée des classes (sénior outillé vs junior bridé) → risque culturel et turnover des juniors qui ne montent pas en compétence assistée." },
      { "argument": "Les tickets « ROBOT-friendly » risquent d'être les seuls confiés aux juniors → spirale d'apprentissage cassée." },
      { "argument": "Le pricing siège unique a une vertu : il pousse l'usage transverse, le portefeuille par profil le contredit." }
    ],
    "verdict_pondere": "GO_BUY_COMPARATIF_PAR_PROFIL — mais avec : KPI gardien employee-engagement (+8 cible, alerte si -2) ; promotion rotative (un junior par squad obtient l'outil sénior pendant 2 mois/an pour montée en compétence, financement pris sur le poste change) ; KPI « % PR juniors avec accès outil sénior pour un cas qui le méritait » mesuré trimestriellement ; le COMEX revoit la doctrine si écart eNPS sénior vs junior > 5 pts.",
    "renvois_livre": ["ch.23.5", "ch.23.7", "ch.26"]
  },
```

### Task 5 : JSON sections 14-17 (choix_lecteur + quiz + verdict + renvois_livre + figures) + commit JSON

**Files:**
- Modify: `livre/cas-pratiques/cases/CC-10-dev-agentique.json`

- [ ] **Step 5.1 — Section `choix_lecteur`** (3 bifurcations, gabarit charnière)

Consommer §3.16 du spec. Trois objets :

```json
  "choix_lecteur": [
    {
      "question": "Vous êtes [VP_ENG]. Pour qui plaidez-vous comme sponsor exécutif du programme dev agentique ?",
      "options": [
        { "id": "A", "label": "CFO", "consequence": "ROI Hard chiffrable au COMEX, mais arbitrage uniquement sur le coût pur, on perd le KPI qualité.", "grille_analyse": "Piège du Hard isolé — cf. ch.23.5.3", "renvoi_chapitre": "ch.23.5.3" },
        { "id": "B", "label": "VP Eng (vous)", "consequence": "Focus qualité du code et eNPS dev mais budget fluctuant pas défendable seul au COMEX.", "grille_analyse": "Piège du Soft seul — cf. ch.23.5.4", "renvoi_chapitre": "ch.23.5.4" },
        { "id": "C", "label": "CTO (recommandé)", "consequence": "Transverse, arbitre entre VP Eng (qualité) et CFO (budget). Sponsorise le mix portefeuille.", "grille_analyse": "Alignement Cigref Hard + Soft — cf. ch.23.7.3", "renvoi_chapitre": "ch.23.7.3" }
      ]
    },
    {
      "question": "GitHub Copilot annonce les premium requests, fin de l'illimité. Vous faites quoi en 90 jours ?",
      "options": [
        { "id": "A", "label": "Tenir l'illimité chez un fournisseur niche", "consequence": "Lock-in vendor + qualité incertaine ; cassure projet si le fournisseur ferme.", "grille_analyse": "Antipattern — refus d'admettre la fin du modèle économique", "renvoi_chapitre": "ch.22" },
        { "id": "B", "label": "Accepter les quotas + les distribuer par profil via gateway interne (recommandé)", "consequence": "Doctrine itérée trimestriel, gateway LLM interne en 6 mois, plafond par ticket — défend au COMEX.", "grille_analyse": "Pattern paved road + gateway scopée (cf. CC-14)", "renvoi_chapitre": "ch.15" },
        { "id": "C", "label": "Bascule API pure via Bedrock + cascade modèle interne complète", "consequence": "Autonomie maximale, time-to-doctrine 6 mois supplémentaires, effort lourd ETP.", "grille_analyse": "Pari long terme — valide mais coûteux", "renvoi_chapitre": "ch.22" }
      ]
    },
    {
      "question": "Tier 1 ROBOT-friendly autorisé. Vous descendez jusqu'où sur l'autonomie des agents async sur le code de prod ?",
      "options": [
        { "id": "A", "label": "Interdit total", "consequence": "Vous laissez 30 % du gain sur la table sur les tickets faciles. eNPS sénior dégradé.", "grille_analyse": "Antipattern — sur-prudence qui ne tient pas dans le temps", "renvoi_chapitre": "ch.21" },
        { "id": "B", "label": "Autorisé tier 1 + review humain obligatoire (recommandé)", "consequence": "Gain mesurable sur tier 1, audit trail Datadog, rollback feature flag par pattern.", "grille_analyse": "Cadre paved road + gardien — cf. ch.20", "renvoi_chapitre": "ch.20" },
        { "id": "C", "label": "Pleine autonomie + auto-merge si CI verte sur backlog ROBOT-friendly", "consequence": "Pari sur la couverture CI. Le jour où la CI rate, l'incident arrive en prod direct.", "grille_analyse": "Piège du pari CI — cf. ch.21 gardefous", "renvoi_chapitre": "ch.21" }
      ]
    }
  ],
```

- [ ] **Step 5.2 — Section `quiz`** (3 cartes)

Consommer §3.17 du spec :

```json
  "quiz": [
    {
      "question": "Pourquoi un seul outil IA pour toute l'équipe dev = antipattern 2026 ?",
      "options": [
        "Parce que les éditeurs IDE ne sont plus compatibles entre eux",
        "Parce que les 4 patterns (ghost / chat IDE / async / review) sont structurellement différents — surfaces, latences, niveaux d'autonomie, modèles éco — un outil unique en laisse 30 % sur la table",
        "Parce que la loi AI Act l'interdit",
        "Parce que le pricing siège unique est moins cher"
      ],
      "bonne_reponse": 1,
      "explication": "Chaque pattern a son ROI sur un type de ticket × profil de dev. Un Copilot universel ne maximise aucun des 4. Le bon arbitrage est un portefeuille distribué via gateway LLM avec quotas par profil.",
      "renvoi_chapitre": "ch.14"
    },
    {
      "question": "Que mesure le « tokenmaxxing » et pourquoi change-t-il le pricing dev 2026 ?",
      "options": [
        "Le nombre maximum de tokens dans une seule requête",
        "L'usage maximal du quota par session (long context + boucles Opus avec tool calls) — qui a poussé Anthropic à introduire des weekly rate limits, Cursor à plafonner Auto/Background, et GitHub Copilot à passer aux premium requests : le modèle all-you-can-eat n'est plus viable",
        "La compression maximale des tokens",
        "Une métrique de qualité du code généré"
      ],
      "bonne_reponse": 1,
      "explication": "Le tokenmaxxing désigne la pratique des power users de saturer leur quota en boucle (Opus + long context + tool calls). Anthropic, Cursor et GitHub ont tous ajusté leur pricing en 2025-2026 en réponse. Le all-you-can-eat est mort, place aux quotas distribués.",
      "renvoi_chapitre": "ch.5"
    },
    {
      "question": "Où s'arrête l'autonomie d'un agent async cloud sur le code de prod d'une scale-up SaaS B2B ?",
      "options": [
        "Pleine autonomie si CI verte sur tout le monorepo",
        "Au périmètre ROBOT-friendly opt-in par repo (typage, deps, traduction, refacto pattern connu) — review humaine obligatoire, jamais sur le service legacy ni sur le code de paiement / scoring client",
        "Aucune autonomie, tous les agents async sont interdits",
        "L'autonomie dépend uniquement du modèle utilisé"
      ],
      "bonne_reponse": 1,
      "explication": "L'autonomie agent async est opt-in par repo, jamais sur les zones sensibles (Java legacy 2018, paiement, scoring). Review humaine obligatoire avant merge, audit trail Datadog systématique, rollback feature flag immédiat possible.",
      "renvoi_chapitre": "ch.20"
    }
  ],
```

- [ ] **Step 5.3 — Section `verdict`**

Consommer §3.18 du spec :

```json
  "verdict": {
    "stamp": "GO_BUY_COMPARATIF_PAR_PROFIL",
    "label": "Buy par portefeuille, distribué par profil et par tier de ticket",
    "conditions": [
      "Mix portefeuille : ghost universel + chat IDE par profil + async cloud pour tier 1 + review auto en sentinelle",
      "Gateway LLM interne avec tokens scopés par profil dev + quotas distribués + plafond par ticket",
      "Doctrine trimestrielle révisée — le pricing des outils du marché bouge trop pour figer la doctrine à 12 mois",
      "KPI gardien employee-engagement (eNPS dev) + KPI « % PR juniors avec outil sénior » mesuré trimestriellement",
      "Promotion rotative : un junior par squad obtient l'outil sénior pendant 2 mois/an",
      "MCP servers internes minimum (GitHub, Linear, Datadog, Sentry, Vault scopé, Notion, Codecov, LaunchDarkly) — effort 5-6 sem.",
      "Tiering ticket explicite dans Linear : auto-routage tier 1 → async cloud, tier 2 → chat IDE, tier 3 → human-led",
      "Code review auto en sentinelle obligatoire sur les PRs des agents async",
      "Formation continue bi-annuelle, financement pris sur le poste change",
      "Charte agents async sur code de prod : opt-in par repo, jamais sur legacy/paiement/scoring, audit trail Datadog obligatoire"
    ]
  },
```

- [ ] **Step 5.4 — Section `renvois_livre`**

```json
  "renvois_livre": ["ch.14", "ch.7", "ch.15", "ch.16", "ch.19", "ch.20", "ch.21", "ch.22", "ch.23.5", "ch.23.7", "ch.23.8", "ch.5", "ch.25", "ch.26"],
```

- [ ] **Step 5.5 — Section `figures`** (4)

```json
  "figures": [
    {
      "id": "fig-00",
      "titre": "Architecture SI dev actuelle — scale-up SaaS B2B 2026",
      "fichier": "images/CC-10-dev-agentique/CC-10-fig-00-architecture-actuelle.svg",
      "caption": "Stack dev existante avant doctrine : monorepo TS + service Java legacy + service Go, GitHub Cloud + Actions, Linear, Datadog + Sentry, Vault HCP, Notion, 4 outils IA en parallèle (Cursor, Copilot, Claude Code, Codex CLI) dont 2 hors SSO. Annotations criticité par composant."
    },
    {
      "id": "fig-01",
      "titre": "Anatomie comparée des 4 patterns d'agents de dev",
      "fichier": "images/CC-10-dev-agentique/CC-10-fig-01-anatomie-patterns.svg",
      "caption": "Comparatif ghost autocomplete inline / chat IDE-CLI connecté / agent async cloud / code review automatique. Pour chaque pattern : surface IDE/CI/PR, latence cible, niveau d'autonomie typique, modèle économique, ticket type."
    },
    {
      "id": "fig-02",
      "titre": "Workflow ticket en mode agentique — du tri Linear au merge GitHub",
      "fichier": "images/CC-10-dev-agentique/CC-10-fig-02-workflow-ticket.svg",
      "caption": "Trajectoire d'un ticket : ouverture Linear → tri par tag automatique → bifurcation par tier (tier 1 trivial → async cloud / tier 2 refacto cadré → chat IDE en pair / tier 3 feature nouvelle → human-led + ghost) → review (agent OU humain selon tier) → merge → release. Marqueurs L1-L4 par étape."
    },
    {
      "id": "fig-03",
      "titre": "Dérive des coûts inférence par pattern 2024-2026",
      "fichier": "images/CC-10-dev-agentique/CC-10-fig-03-derive-couts.svg",
      "caption": "Courbes par pattern de coût/dev/mois : ghost stable ~10 $, chat IDE 20 $ → 60 $, async cloud 0 $ → 140 $, review auto 5 $ → 25 $. Repères Anthropic weekly rate limits (mi-2025), retex Uber Copilot Enterprise (2025-2026), GitHub Copilot premium requests (2025-2026). Crossover gateway LLM interne vs sièges Copilot uniformes."
    }
  ]
}
```

(Le `}` final ferme le JSON document.)

- [ ] **Step 5.6 — Valider le JSON syntaxiquement**

```bash
node -e "const fs=require('fs'); JSON.parse(fs.readFileSync('livre/cas-pratiques/cases/CC-10-dev-agentique.json','utf8')); console.log('JSON valid')"
```

Expected : `JSON valid`. Si erreur → corriger.

- [ ] **Step 5.7 — Run `cases-contract.test.mjs` pour valider les 17 sections obligatoires**

```bash
node --test tests/cases-contract.test.mjs
```

Expected : PASS (le test vérifie que `CC-10-dev-agentique.json` contient les sections 1-13 + 17-19 obligatoires).

Si FAIL → identifier la section manquante et corriger.

- [ ] **Step 5.8 — Run `roi-metrics-contract.test.mjs`**

```bash
node --test tests/roi-metrics-contract.test.mjs
```

Expected : PASS (les 4 métriques `id` utilisées par CC-10 — `processing-time`, `pr-throughput`, `post-release-bug-rate`, `employee-engagement` — existent dans `shared/roi-metrics.json`).

Si FAIL → vérifier Task 0 puis corriger.

- [ ] **Step 5.9 — Commit du JSON CC-10 complet**

```bash
git add livre/cas-pratiques/cases/CC-10-dev-agentique.json
git commit -m "$(cat <<'EOF'
livre/cas-pratiques : CC-10 dev agentique — JSON 19 sections (source de vérité)

Cas CC-10 (Strate 1 Fondations / pôle profond) : couche JSON canonique
conforme schéma v2. Verdict GO_BUY_COMPARATIF_PAR_PROFIL — mix portefeuille
ghost + chat IDE + async cloud + review auto, distribué via gateway LLM
avec quotas par profil dev. Spec : docs/superpowers/specs/2026-06-04-CC-10-dev-agentique-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2 — Fact-checking sources actu pour §10 Dérive des coûts

### Task 6 : Vérifier les sources de la section spéciale §10

**Files:**
- Create: `docs/superpowers/notes/2026-06-04-CC-10-sources-actu.md`

**Pourquoi cette tâche** : la section §10 du MD repose sur 3 retex publics dont les chiffres et dates doivent être confirmés avant rédaction (cf. spec §8 risques). Sourcer correctement évite d'inventer un chiffre faussement validé.

- [ ] **Step 6.1 — Créer le dossier notes si absent**

```bash
mkdir -p docs/superpowers/notes
```

- [ ] **Step 6.2 — Pour chaque source, identifier 1-2 références publiques fiables**

Sujets à fact-checker (priorité : exactitude des dates et chiffres) :

1. **Anthropic weekly rate limits sur Claude Sonnet/Opus** (mi-2025) — quand exactement, quel niveau de quota par tier, communication publique d'Anthropic (blogpost / status page).
2. **Retex Uber Copilot Enterprise budget dépassement** — interview ingénieur, blogpost, talk DevX 2025-2026. Si pas confirmable publiquement, **paraphraser comme « pattern documenté chez plusieurs hyperscalers 2025-2026 sans citer Uber nominativement »**.
3. **GitHub Copilot premium requests pricing** (annonce GitHub 2025) — date d'annonce, quotas par tier (Business / Enterprise), prix overage.
4. (Bonus) **Cursor Auto / Background limits** ajustements 2025-2026.
5. (Bonus) **« Tokenmaxxing »** — origine du terme (Twitter, blogs), première mention notable.

Méthode : WebSearch pour identifier les sources publiques. Pas de fabrication. Si une source ne se confirme pas → paraphraser et flagger en footnote « pattern documenté empiriquement en 2025-2026 sans source unique faisant autorité ».

- [ ] **Step 6.3 — Consigner les sources dans `2026-06-04-CC-10-sources-actu.md`**

Format type :

```markdown
# CC-10 — Sources actu pour §10 Dérive des coûts

## 1. Anthropic weekly rate limits
- Source : [titre + URL + date]
- Chiffres confirmés : [tier / quota / date d'introduction]
- Citation utilisable : "[…]"

## 2. Retex Uber Copilot Enterprise
- Source : [titre + URL] OU "pattern paraphrasé, pas de source unique"
- Si paraphrasé : formulation à utiliser dans le MD

## 3. GitHub Copilot premium requests
- Source : annonce GitHub Blog [URL + date]
- Chiffres : [quota Business / Enterprise / overage]
- Citation utilisable : "[…]"

## 4. Cursor Auto/Background limits (bonus)
- Source : [URL] ou "pas trouvé"

## 5. Tokenmaxxing — origine
- Source : [URL ou "terme émergent fin 2025, repris dans la presse spécialisée"]
```

- [ ] **Step 6.4 — Commit les notes (utile pour traçabilité)**

```bash
git add docs/superpowers/notes/2026-06-04-CC-10-sources-actu.md
git commit -m "$(cat <<'EOF'
docs/superpowers : notes CC-10 — sources actu pour §10 dérive des coûts

Fact-checking préalable à la rédaction du MD CC-10 : Anthropic weekly
rate limits (mi-2025), retex Uber Copilot Enterprise, GitHub Copilot
premium requests, Cursor Auto/Background limits, origine 'tokenmaxxing'.
Sources confirmées ou patterns paraphrasés sans source unique.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3 — MD narration 17 sections (~7 000 mots)

**Calibration** : reproduire la structure et le ton de `livre/cas-pratiques/cases/CC-14-power-users.md`. Densité footnotes cible : 12-18 substantielles. Hint Obsidian `|1300` (ou `|1480` paysage très large) sur chaque image embed.

**Front matter** à mettre en tête du fichier :

```markdown
---
id: CC-10
titre: Pair programming → organisation dev agentique
secteur: Développement logiciel
facette_scaling: build_vs_buy
regime_recommande: buy (comparatif par profil)
gabarit: charnière
date_v1: 2026-06-04
auteur: Mathieu Guglielmino
---
```

Suivi par titre + sous-titre :

```markdown
# CC-10 — Pair programming → organisation dev agentique

**Développement logiciel · Agentic · charnière (~7 000 mots) · pôle profond/maîtrisé de la Strate 1 Fondations, complémentaire de CC-00 (pôle horizontal) et CC-03 (socle data)**

> [Thèse une ligne — copier verbatim depuis §1 du spec]
```

### Task 7 : MD §1 scène d'ouverture + §2 stack dev actuelle (fig-00)

**Files:**
- Create: `livre/cas-pratiques/cases/CC-10-dev-agentique.md`

- [ ] **Step 7.1 — Front matter + titre + sous-titre + thèse**

Insérer le bloc indiqué ci-dessus.

- [ ] **Step 7.2 — §1 « Quatre outils au standup »** (~700 mots)

Voix [CTO]. Ouverture scénique (mardi 9 h, tableau de bord finance, ligne AI tooling × 2). Au standup, 4 devs annoncent 4 outils en parallèle. Mail GitHub premium reqs. Retex Uber sur Slack inter-CTO. VP Eng veut doctrine, CFO veut plafond. Tension d'entrée + question centrale : *un seul outil ou un portefeuille ?*

Sources : §3.2 du spec + notes Task 6 pour précision sur retex Uber.

**Footnotes attendues** : 1-2 (sur le retex Uber + pattern multi-outils observé).

- [ ] **Step 7.3 — §2 « La stack dev actuelle — la carte que tout le monde croit avoir »** (~600 mots)

Avant l'arbitrage, ce qui est *déjà là*. Stack monorepo TS + Java legacy 2018 + Go récent. GitHub Cloud + Actions + Advanced Security. Linear, Datadog, Sentry, Notion, Vault. **L'angle mort = les 4 outils IA** déjà installés sans coordination (dont 2 hors SSO = shadow soft).

Embed fig-00 (hint `|1300`) :

```markdown
![La stack dev actuelle — monorepo TS + service Java legacy + service Go, GitHub + Actions, Linear, Datadog + Sentry, Vault, Notion, et 4 outils IA en parallèle dont 2 hors SSO|1300](../images/CC-10-dev-agentique/CC-10-fig-00-architecture-actuelle.svg)
```

Implications structurantes (3-4 puces) :
- Service Java legacy 2018 = sclérosant → agent async cloud interdit dessus.
- Vault scope par squad → MCP server custom obligatoire avec masquage secret.
- GitHub Cloud + Bedrock dispo → pas de contrainte souveraineté.
- 2 outils IA shadow (Cursor perso + Codex CLI) = à intégrer dans la doctrine, pas à chasser.

**Footnotes attendues** : 1-2 (sur le pattern shadow soft + définition tier ticket).

- [ ] **Step 7.4 — Commit intermédiaire (optionnel)**

À ce stade, MD est très partiel. Si commit WIP : `[wip]` ou attendre Task 14.

### Task 8 : MD §3 anatomie 4 patterns (fig-01) + §4 workflow ticket (fig-02)

**Files:**
- Modify: `livre/cas-pratiques/cases/CC-10-dev-agentique.md`

- [ ] **Step 8.1 — §3 « Quatre patterns d'agents de dev — pourquoi pas un seul »** (~900 mots)

C'est la section qui fonde tout le verdict. Voix : pédagogique sur les différences structurelles.

Plan : intro (« on dit IA dev tooling, mais c'est 4 patterns différents qui partagent peu »), puis pour chaque pattern un paragraphe (~200 mots) couvrant :
- où ça s'attache (caret IDE / side-panel / branche / webhook PR)
- latence cible
- type de ticket que ça fait gagner / où ça échoue
- modèle économique (siège, tokens, premium reqs, quota tâche)
- outils nommés (Copilot Tab / Cursor Tab / Supermaven · Cursor Composer / Claude Code / Codex CLI / JetBrains AI · Devin / Cursor BG / Claude Code BG / Codex async / Copilot Workspace · CodeRabbit / Greptile / Copilot for PRs)

Embed fig-01 (hint `|1300`) :

```markdown
![Anatomie comparée des 4 patterns d'agents de dev — surfaces, latences, niveaux d'autonomie, modèles éco|1300](../images/CC-10-dev-agentique/CC-10-fig-01-anatomie-patterns.svg)
```

Conclusion de section : « un Copilot universel ne maximise aucun des 4 — il fait moyennement les 4 ». Préfigure le verdict.

**Footnotes attendues** : 3-4 (sources sur pricing 2026, latences observées DORA, Devin lancé 2024, etc.).

- [ ] **Step 8.2 — §4 « Le workflow ticket — du tri Linear au merge GitHub »** (~700 mots)

Trajectoire end-to-end. Tiering ticket explicite (tier 1 / 2 / 3). Bifurcation par tier → pattern préféré. Niveaux d'autonomie L1-L4. Cap L4 à l'opt-in par repo.

Embed fig-02 (hint `|1480` paysage large) :

```markdown
![Workflow ticket en mode agentique — du tri Linear au merge GitHub, bifurcation par tier, niveaux L1-L4|1480](../images/CC-10-dev-agentique/CC-10-fig-02-workflow-ticket.svg)
```

Inclure encart « anatomie d'un ticket tier 1 ROBOT-friendly » (~150 mots) reprenant la trajectoire multi-step du JSON §3.4 (Listen → Retrieve → Reason+Plan → Execute → Audit). Style : citation > avec narration courte (cf. CC-14 §3.5 encart paved-road).

**Footnotes attendues** : 1-2 (sur DORA tier ticket + audit trail OTel).

### Task 9 : MD §5 MCP servers + §6 modèles cibles

**Files:**
- Modify: `livre/cas-pratiques/cases/CC-10-dev-agentique.md`

- [ ] **Step 9.1 — §5 « Les huit MCP servers qui font la différence »** (~500 mots)

Table opérationnelle (8 entrées, reprendre du JSON §3.5). Pour chaque MCP : système, mode, type, effort, risque. Souligner le sclérosant **Vault** (2 sem., scoping fin obligatoire, RSSI). Le service Java legacy 2018 explique pourquoi `LaunchDarkly` est en risque moyen (un agent qui toggle le mauvais flag = incident).

Renvois ch.15 (plateforme MCP) + ch.16 (sécurité MCP).

**Footnotes attendues** : 1-2 (sur le scoping fin Vault + audit log MCP OTel gen_ai.compaction.*).

- [ ] **Step 9.2 — §6 « Les modèles — cascade par pattern, pas modèle unique »** (~500 mots)

Reprendre la matrice JSON §3.6. Argument central : modèle ≠ pattern. Cascade explicite :
- Haiku pour le ghost (latence)
- Sonnet pour le chat IDE et l'async tier 1 (sweet spot)
- Opus en fallback réflexif quand le plan échoue 2× (cap budget par ticket)
- Codestral fallback dégradé si Anthropic down
- Cursor-small natif pour le ghost si Cursor est l'IDE choisi

Tweet test : *« et si Anthropic est down ? »*. Préfigure §10 (anti-tokenmaxxing).

**Footnotes attendues** : 1-2 (sur LLMflation ch.5 + Bedrock résidence EU).

### Task 10 : MD §7 enjeux + §8 build/buy/hybride

**Files:**
- Modify: `livre/cas-pratiques/cases/CC-10-dev-agentique.md`

- [ ] **Step 10.1 — §7 « Pourquoi — vélocité, qualité, soutenabilité »** (~500 mots)

3 enjeux chiffrés. Bench DORA + GitHub Octoverse 2026. Insister sur « taux de bug post-release stable malgré + throughput » = **le vrai test du pattern agent**. Si la qualité dérive à throughput +25 %, c'est qu'on a optimisé Goodhart (cost-per-line, pas value).

Renvois ch.23.5 (Hard vs Soft) + ch.23.8 (Cigref).

**Footnotes attendues** : 1-2 (DORA + Octoverse).

- [ ] **Step 10.2 — §8 « Build, Buy, Hybride — l'arbitrage porte sur le portefeuille »** (~600 mots)

Reproduire la table 3 colonnes × 6 critères du JSON §3.8. Verdict : `GO_BUY_COMPARATIF_PAR_PROFIL`. Trois arguments contre le buy uniforme :
1. Chaque pattern a sa surface, sa latence, son ROI.
2. Le pricing siège unique exploserait sur les power users qui tokenmaxxent.
3. Le sclérosant Java legacy interdit l'async cloud → pas de pattern « one-size-fits-all » techniquement possible.

Conclure sur la gateway LLM interne comme **moyen de distribution** (préfigure §10 et 11).

**Footnotes attendues** : 1 (ch.23.6 arbre décision).

### Task 11 : MD §9 trajectoire 8 postes + §10 dérive des coûts (section spéciale + fig-03)

**Files:**
- Modify: `livre/cas-pratiques/cases/CC-10-dev-agentique.md`

- [ ] **Step 11.1 — §9 « Les huit postes — quand l'inférence dérive »** (~700 mots)

Reproduire la grille JSON §3.9 en table markdown. Lecture transverse :
- Inférence × 35 entre POC et Scale (poste le plus dérivant).
- Équipe × 12 (l'ETP DX double seulement).
- Change × 44 (la formation et la médiation doctrine pèsent autant que prévu).
- Coût/PR / 3 (de 7,60 € à 2,30 €).

Crossover gateway interne ≈ 1 500 PR/an avec usage agentique.

Préfigurer la section §10 par une phrase de transition : *« Mais l'inférence ne dérive pas par hasard. Et le tableau qu'on vient de poser suppose que les sièges Copilot tiennent leur promesse. En 2026, ils ne la tiennent plus. »*

**Footnotes attendues** : 1-2 (sur paradoxe agentique ch.23.7 + crossover par PR/an).

- [ ] **Step 11.2 — §10 « Dérive des coûts : tokenmaxxing, Uber, fin de l'all-you-can-eat »** (~800 mots, section spéciale)

**Trois sous-sections** :

**10.1 — Le tokenmaxxing** : définition (saturation du quota Max par sessions Opus en boucle, long context, tool calls). Anthropic introduit les weekly rate limits mi-2025 en réponse. Cursor adapte Auto/Background. Renvoi notes Task 6.

**10.2 — Le retex Uber Copilot Enterprise** : pattern documenté en 2025-2026 — le siège illimité ne tient plus quand les devs power users tournent en boucle. Citer la source publique ou paraphraser (cf. notes Task 6). Conclusion : le modèle siège illimité a une fin.

**10.3 — GitHub Copilot premium requests** : annonce 2025, quotas par tier (chiffres précis depuis notes Task 6), dépassement facturé au token. Fin du modèle all-you-can-eat. Le pricing siège passe d'un *forfait* à un *forfait + tokens à la consommation*.

Conclusion de section : la **gateway LLM interne** introduite en CC-14 §7 refait surface ici comme **garde-fou financier dev**. Tokens scopés par profil + quotas distribués + journalisation + plafond par ticket.

Embed fig-03 :

```markdown
![Dérive des coûts inférence 2024-2026 par pattern — ghost stable, chat IDE +200 %, async cloud +600 %, review auto +500 % ; repères Anthropic weekly limits, retex Uber, GitHub premium reqs|1480](../images/CC-10-dev-agentique/CC-10-fig-03-derive-couts.svg)
```

**Footnotes attendues** : 3-5 (les sources Task 6 + LLMflation ch.5 + paradoxe agentique ch.23.7).

### Task 12 : MD §11 gouvernance + §12 évaluation + §13 ROI

**Files:**
- Modify: `livre/cas-pratiques/cases/CC-10-dev-agentique.md`

- [ ] **Step 12.1 — §11 « Gouvernance — RACI plat, doctrine trimestrielle »** (~400 mots)

RACI : VP Eng = R (doctrine), CTO = A (sponsor), CFO + RSSI + DPO = C, Tech leads = I, COMEX trimestriel. Cadence revue mensuelle dev practice. Ligne AI Act : hors haut-risque par défaut (code interne), mais documenter périmètre si agents touchent scoring/RH/PII utilisateur final.

Renvois ch.25 + ch.26.

**Footnotes attendues** : 1 (sur Annexe III AI Act).

- [ ] **Step 12.2 — §12 « Évaluation — régression + online + dérive »** (~500 mots)

3 axes : régression suite (SWE-bench Live + golden set interne 80 PRs), métriques online (pr-throughput, post-release-bug-rate, processing-time, employee-engagement), détection dérive (LLM-as-judge sur 5 % PR async + ratio re-prompt).

**Mention critique** : SWE-bench Live est instrumenté contre le gaming (cf. `benchmarks-contestes/` 2026-05-15). Boucle correction : doctrine itérée trimestriel, feature flag par pattern.

Renvois ch.19 (cf. `benchmarks-contestes/`) + ch.20.

**Footnotes attendues** : 1-2 (sur SWE-bench Live + LLM-as-judge).

- [ ] **Step 12.3 — §13 « ROI — Vitesse principal, gardien Qualité »** (~400 mots)

Méthode TEI + DORA + Cigref. 4 métriques retenues (cf. JSON §3.13). Non retenues : cost-per-line (Goodhart explicite — *« le LLM gonfle les lignes »*), revenue (indirect), nps (hors périmètre client).

Argument central : **le KPI gardien est post-release-bug-rate stable**. Sans ça, l'augmentation du throughput cache une dégradation qualité.

Renvois ch.23.5 + ch.23.7 + ch.23.8.

**Footnotes attendues** : 1-2 (sur paradoxe agentique appliqué au dev).

### Task 13 : MD §14 équipe + §15 débat + §16 trois choix

**Files:**
- Modify: `livre/cas-pratiques/cases/CC-10-dev-agentique.md`

- [ ] **Step 13.1 — §14 « L'équipe, la vélocité, les sclérosants »** (~500 mots)

Personas (porteur VP Eng, sponsor CTO, allié Staff eng DX, opposant RSSI) avec citations courtes. 1,5 ETP cœur en Prod. 5 sclérosants (pricing fluctuant → doctrine trimestrielle, Java legacy, scoping Vault, formation continue, mesure eNPS dev).

Deadlines : AI Act 2026-08, doctrine v1 COMEX 2026-Q3, revue CFO 2027-Q1.

**Footnotes attendues** : 0-1.

- [ ] **Step 13.2 — §15 « Le débat — économie à deux vitesses ? »** (~500 mots)

Question : *Le buy comparatif par profil installe-t-il une économie à deux vitesses (sénior outillés vs juniors bridés) ?*

Pour (3 arguments) : aligne outil sur valeur de ticket ; les power users représentent 60 % du budget ; DORA mesure que l'effet ROI se concentre sur les sénior + tickets standards.

Contre (3 arguments) : crée des classes ; les tickets ROBOT-friendly sont confiés aux juniors → spirale d'apprentissage cassée ; le siège unique pousse l'usage transverse.

Verdict pondéré : oui mais avec garde-fous (eNPS gardien + promotion rotative + KPI « % PR juniors avec outil sénior pour cas qui le mérite »).

Renvois ch.23.5 + ch.23.7 + ch.26.

**Footnotes attendues** : 1-2 (sur DORA + sentiment de classe outil tech, cf. CC-14).

- [ ] **Step 13.3 — §16 « Trois choix qu'il faut faire »** (~600 mots)

Reproduire les 3 bifurcations du JSON §3.16 en prose claire :
- 16.1 : sponsor (CFO / VP Eng / **CTO** recommandé)
- 16.2 : fin all-you-can-eat (niche / **quotas distribués** recommandé / Bedrock pure)
- 16.3 : autonomie agents async (interdit / **tier 1 + review** recommandé / auto-merge CI verte)

Pour chaque option : 1 phrase consequence + grille analyse + renvoi chapitre.

**Footnotes attendues** : 1-2 (renvois chapitres déjà inline).

### Task 14 : MD §17 verdict + Renvois livre + footnotes complètes + commit MD

**Files:**
- Modify: `livre/cas-pratiques/cases/CC-10-dev-agentique.md`

- [ ] **Step 14.1 — §17 « Verdict — GO_BUY_COMPARATIF_PAR_PROFIL »** (~700 mots, section finale dense)

Stamp + label + 10 conditions opérationnelles (reprises verbatim du JSON §3.18 mais en prose, pas en liste sèche).

Refermer la boucle narrative : *« la boucle agentique appliquée au plus bas niveau valide l'architecture avant qu'on la remonte aux métiers — mais elle ne se contente pas de coder, elle teste la doctrine du portefeuille d'outils, la gateway, le tiering, l'audit trail. Avant CC-01 (banque), CC-10 fait le test grandeur nature dans le périmètre le moins risqué : le code interne d'une scale-up. »*

Renvois croisés explicites en fin de section :
- ↔ CC-00 (assistant transverse — pôle horizontal du livre)
- ↔ CC-03 (socle data — même réflexes paved road)
- ↔ CC-11 (gateway agent — gateway LLM dev en analogue financier)
- ↔ CC-14 (paved road power users — la même logique appliquée aux power users dev)

**Footnotes attendues** : 1 (citation finale ou repère méta).

- [ ] **Step 14.2 — Renvois livre en bas de fichier**

Format identique à CC-14 (liens markdown vers les chapitres). Liste complète depuis JSON §3.19 :

```markdown
## Renvois livre

- **[Ch. 14 — Assistants de code (anatomie des outils-source)](../../chapitres/ch14-assistants-de-code.md)**
- **[Ch. 7 — Reason · Act · Observe : la boucle agentique appliquée au ticket dev](../../chapitres/ch07-boucle-agentique.md)**
- **[Ch. 15 — MCP plateforme (MCP servers internes consommés par les agents)](../../chapitres/ch15-mcp-plateforme.md)**
- **[Ch. 16 — Sécurité MCP (scope par squad, audit log)](../../chapitres/ch16-mcp-securite.md)**
- **[Ch. 19 — Évaluation et benchmarks (SWE-bench, contamination, SWE-bench Live)](../../chapitres/ch19-evaluation-benchmarks.md)**
- **[Ch. 20 — Observabilité agentique et cognitive audit trail](../../chapitres/ch20-observabilite-cognitive-audit-trail.md)**
- **[Ch. 21 — Garde-fous (DLP, secret scan, charte agents async)](../../chapitres/ch21-gardefous-securite-globale.md)**
- **[Ch. 22 — Runtime managé vs maison (gateway LLM interne vs SaaS)](../../chapitres/ch22-runtime-manage.md)**
- **[Ch. 5 — Économie de l'inférence (LLMflation, dérive des coûts)](../../chapitres/ch05-economie-inference.md)**
- **[Ch. 23.5 — Hard vs Soft Savings appliqué au dev](../../chapitres/ch23-roi-paradoxe-agentique.md)**
- **[Ch. 23.7 — Paradoxe agentique appliqué aux devs](../../chapitres/ch23-roi-paradoxe-agentique.md)**
- **[Ch. 23.8 — Cigref / DORA appliqués au dev](../../chapitres/ch23-roi-paradoxe-agentique.md)**
- **[Ch. 25 — Gouvernance (AI Act par usage si bascule scoring)](../../chapitres/ch25-gouvernance-ai-act.md)**
- **[Ch. 26 — IA et travail (sentiment de classe outil tech)](../../chapitres/ch26-ia-et-travail.md)**
```

- [ ] **Step 14.3 — Footnotes complètes**

Vérifier que toutes les footnotes `[^N]` du corps ont leur définition en bas. Densité cible : 12-18.

Pour chaque footnote :
- Source précise (titre + auteur + date + URL si web)
- 1-3 phrases de contexte ou citation
- Si paraphrasé sans source unique → flagger explicitement

- [ ] **Step 14.4 — Footer disclosure IA**

```markdown
---

*Format co-écrit avec l'aide d'une IA. Données et calibrage : analyse Mathieu Guglielmino · juin 2026.*
```

- [ ] **Step 14.5 — Vérifier la longueur totale**

```bash
wc -w livre/cas-pratiques/cases/CC-10-dev-agentique.md
```

Expected : 6 500 - 7 500 mots (cible gabarit charnière). Si < 6 000 → densifier les sections les plus minces. Si > 8 000 → resserrer.

- [ ] **Step 14.6 — Vérifier que les renvois chapitres pointent vers des fichiers existants**

```bash
node -e "
const fs = require('fs');
const md = fs.readFileSync('livre/cas-pratiques/cases/CC-10-dev-agentique.md', 'utf8');
const links = [...md.matchAll(/\\(\\.\\.\\/\\.\\.\\/chapitres\\/(ch[^.)]+\\.md)\\)/g)];
const unique = [...new Set(links.map(m => m[1]))];
const missing = unique.filter(f => !fs.existsSync('livre/chapitres/' + f));
if (missing.length) { console.error('Renvois chapitres cassés :', missing); process.exit(1); }
console.log('Renvois chapitres OK :', unique.length, 'chapitres référencés');
"
```

Expected : `Renvois chapitres OK : N chapitres référencés` (N ≥ 8).

Si missing → vérifier que les noms de fichiers correspondent à `livre/chapitres/` réels (cf. `git status` initial qui montre `ch01-coeur-stochastique.md`, `ch07-boucle-agentique.md`, etc.).

- [ ] **Step 14.7 — Commit MD CC-10 complet**

```bash
git add livre/cas-pratiques/cases/CC-10-dev-agentique.md
git commit -m "$(cat <<'EOF'
livre/cas-pratiques : CC-10 dev agentique — narration MD (~7000 mots, 17 sections)

Narration éditoriale de CC-10 calquée sur le patron CC-14 : voix CTO,
17 sections + footnotes denses (12-18). Couvre les 4 patterns agents
de dev (ghost / chat IDE / async cloud / review auto), workflow ticket
par tier, grille 8 postes × 4 phases, section spéciale §10 'Dérive
des coûts' (tokenmaxxing / Uber / GitHub Copilot premium requests),
verdict GO_BUY_COMPARATIF_PAR_PROFIL + 10 conditions. Renvois croisés
CC-00 / CC-03 / CC-11 / CC-14.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4 — 4 SVG figures

**Skill à invoquer** : `svg-schemas` pour les conventions repo (palette site `--bg #faf6ec`, `--accent #b8582e`, échelle typo 28/18/15/13/12, flèches blanc visible avant cible, anchors `fig-NN` dans figcaption, XML validé strict avant commit).

**Sclérosant XML** : toujours échapper `&` `<` `>` dans les attributs et le texte. Toujours valider avec un parser strict.

### Task 15 : fig-00 — Architecture SI dev actuelle (A3 paysage 1600×1130)

**Files:**
- Create: `livre/cas-pratiques/images/CC-10-dev-agentique/CC-10-fig-00-architecture-actuelle.svg`

- [ ] **Step 15.1 — Créer le dossier images**

```bash
mkdir -p livre/cas-pratiques/images/CC-10-dev-agentique
```

- [ ] **Step 15.2 — Design fig-00**

Contrat : `viewBox="0 0 1600 1130"` (A3 paysage). Composants par catégorie (cf. JSON §3.3) :
- **Canal utilisateur** (en haut, fond crème) : postes dev (icône VS Code + JetBrains + Neovim), Slack, Linear.
- **Front métier / IDE et CI** : GitHub Cloud + GitHub Actions + Advanced Security.
- **Core métier** (centre) : monorepo TypeScript (Next.js front + Node API), service Java legacy 2018 ⚠️ (badge sclérosant), service Go récent, Postgres + Redis.
- **Knowledge base** : Notion (ADR + specs), GitHub Discussions, Confluence legacy (badge migration).
- **Obs et qualité** : Sentry, Datadog APM/logs, Codecov, LaunchDarkly.
- **Back office** : Linear (ticketing), Vercel, Vault HCP (badge ⚠️ scoping fin RSSI).
- **Outils satellites IA** (en bas, fond pointillé pour signaler le shadow soft) : Cursor (perso ⚠️), Copilot SSO, Claude Code via Bedrock, Codex CLI (perso ⚠️). Badge « 4 outils sans coordination ».

Annotations criticité (codes couleur) :
- `read_only` : neutre
- `read_write` : bordure orange (accent)
- `read_write_via_proxy_validation` : bordure rouge/carmine
- `pas_touche_regule` : bordure noire (pas applicable ici)

Typographie : titre 28pt, subtitle 18pt italic, body label 15pt, annotations 13pt, caption 12pt italic.

**Sources fond** : ne PAS mentionner Lincoln. Footer SVG = juste la skill `svg-schemas` repo convention (palette site, échelle typo).

- [ ] **Step 15.3 — Valider le SVG (XML strict)**

```bash
python -c "import xml.etree.ElementTree as ET; ET.parse('livre/cas-pratiques/images/CC-10-dev-agentique/CC-10-fig-00-architecture-actuelle.svg'); print('XML valid')"
```

Expected : `XML valid`. Si erreur → vérifier escape `&` / `<` / `>` dans tous les attributs et `<text>`.

- [ ] **Step 15.4 — Inspection visuelle**

Ouvrir le SVG dans un navigateur (drag&drop) ou via un viewer SVG. Vérifier :
- Tous les composants sont visibles et lisibles.
- Les couleurs respectent la palette site.
- Le badge ⚠️ Java legacy est bien visible (= sclérosant).
- Le badge ⚠️ Vault est bien visible (= scoping fin).
- Le bloc « outils IA shadow » en bas est bien distingué (fond pointillé).
- Aucune flèche ne touche un composant sans le blanc visible avant cible.

- [ ] **Step 15.5 — Commit fig-00**

```bash
git add livre/cas-pratiques/images/CC-10-dev-agentique/CC-10-fig-00-architecture-actuelle.svg
git commit -m "$(cat <<'EOF'
livre/cas-pratiques : CC-10 fig-00 — architecture SI dev actuelle (A3 paysage)

Stack dev existante avant doctrine : monorepo TS + Java legacy 2018
(sclérosant) + Go récent, GitHub Cloud + Actions, Linear, Datadog +
Sentry, Vault scoping fin (sclérosant), Notion, et 4 outils IA en
parallèle dont 2 hors SSO (shadow soft). Annotations criticité par
composant. Conventions skill svg-schemas (palette site, échelle
typo 28/18/15/13/12, flèches blanc visible avant cible).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### Task 16 : fig-01 — Anatomie comparée des 4 patterns (1600×900)

**Files:**
- Create: `livre/cas-pratiques/images/CC-10-dev-agentique/CC-10-fig-01-anatomie-patterns.svg`

- [ ] **Step 16.1 — Design fig-01**

Contrat : `viewBox="0 0 1600 900"`. Format : tableau visuel 4 colonnes (un pattern par colonne) × 5 lignes (surface / latence / autonomie typique / modèle éco / outils nommés).

Colonnes :
1. **Ghost autocomplete inline** — icône caret + Tab key. Surface : IDE caret. Latence : <200 ms. Autonomie : L1 Suggest. Éco : siège mensuel $10-19. Outils : Copilot Tab · Cursor Tab · Supermaven.
2. **Chat IDE / CLI connecté** — icône side-panel. Surface : IDE side-panel + terminal + MCP. Latence : 2-8 s. Autonomie : L2-L3 multi-fichier sous validation. Éco : siège + tokens (Pro/Max) ou API pure. Outils : Cursor Composer · Claude Code · Codex CLI · JetBrains AI.
3. **Agent async cloud** — icône cloud + branche git. Surface : branche git → PR auto. Latence : 5-30 min. Autonomie : L3-L4 selon tier ticket. Éco : tâche / heure machine / quotas. Outils : Devin · Cursor BG · Claude Code BG · Copilot Workspace · Codex async.
4. **Code review auto** — icône loupe + PR. Surface : PR GitHub webhook. Latence : 30 s. Autonomie : L2 review déléguée pre-merge. Éco : siège / PR. Outils : CodeRabbit · Greptile · Copilot for PRs.

En bas, une bande « ticket type adapté » par colonne :
1. *Tickets fastoches : typage, boilerplate, imports oubliés*
2. *Refacto multi-fichier cadré, exploration, debug*
3. *Bumps deps, traductions i18n, tier 1 ROBOT-friendly*
4. *Sentinelle sur toutes les PR, surtout celles des agents async*

Typographie : titre principal 28pt, sous-titre 18pt italic, headers de colonne 18pt, body 15pt, outils nommés 13pt.

- [ ] **Step 16.2 — Valider et commit**

```bash
python -c "import xml.etree.ElementTree as ET; ET.parse('livre/cas-pratiques/images/CC-10-dev-agentique/CC-10-fig-01-anatomie-patterns.svg'); print('XML valid')"

git add livre/cas-pratiques/images/CC-10-dev-agentique/CC-10-fig-01-anatomie-patterns.svg
git commit -m "$(cat <<'EOF'
livre/cas-pratiques : CC-10 fig-01 — anatomie comparée des 4 patterns d'agents de dev

Tableau visuel 4 colonnes : ghost autocomplete inline · chat IDE/CLI
connecté · agent async cloud · code review automatique. Pour chaque
pattern : surface IDE/CI/PR, latence cible, niveau d'autonomie typique,
modèle économique, outils nommés du marché, ticket type adapté. Fonde
le verdict GO_BUY_COMPARATIF_PAR_PROFIL.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### Task 17 : fig-02 — Workflow ticket en mode agentique (1600×1000)

**Files:**
- Create: `livre/cas-pratiques/images/CC-10-dev-agentique/CC-10-fig-02-workflow-ticket.svg`

- [ ] **Step 17.1 — Design fig-02**

Contrat : `viewBox="0 0 1600 1000"`. Format : workflow horizontal avec bifurcation par tier.

Étapes (gauche → droite) :
1. **Ouverture Linear** — issue créée par PO ou support.
2. **Tri** — auto-tag par classifier interne (tier 1 ROBOT-friendly / tier 2 refacto cadré / tier 3 feature nouvelle).
3. **Bifurcation 3 voies** :
   - **Voie tier 1** (haut) → agent async cloud (Claude Code BG / Cursor BG / Devin / Copilot Workspace). PR ouverte automatiquement. Niveau L3.
   - **Voie tier 2** (milieu) → chat IDE en pair avec un dev senior. Niveau L2 sous validation.
   - **Voie tier 3** (bas) → human-led + ghost autocomplete + review auto en sentinelle. Niveau L1 + L2 review.
4. **Review** — convergence des 3 voies vers le webhook PR. Code review auto (CodeRabbit/Greptile/Copilot for PRs) sentinelle + review humaine obligatoire pour tier 1 et tier 2.
5. **Merge** — CI verte requise. Auto-merge possible **uniquement** sur backlog ROBOT-friendly opt-in par repo (Niveau L4).
6. **Release** — Vercel preview env + Datadog audit trail + Sentry corrélation post-merge.

Annotations niveaux L1/L2/L3/L4 par étape, code couleur progressif (clair = L1 → foncé = L4).

Encart en bas : « anatomie d'un ticket tier 1 ROBOT-friendly » (5 étapes Listen → Retrieve → Reason+Plan → Execute → Audit) — reprise du JSON §3.4 trajectoire multi-step.

- [ ] **Step 17.2 — Valider et commit**

```bash
python -c "import xml.etree.ElementTree as ET; ET.parse('livre/cas-pratiques/images/CC-10-dev-agentique/CC-10-fig-02-workflow-ticket.svg'); print('XML valid')"

git add livre/cas-pratiques/images/CC-10-dev-agentique/CC-10-fig-02-workflow-ticket.svg
git commit -m "$(cat <<'EOF'
livre/cas-pratiques : CC-10 fig-02 — workflow ticket en mode agentique

Trajectoire ouverture Linear → tri par tag → bifurcation 3 voies par
tier (tier 1 → async cloud, tier 2 → chat IDE en pair, tier 3 →
human-led + ghost + review sentinelle) → review (auto + humain) →
merge (auto-merge L4 opt-in par repo uniquement) → release Datadog
audit trail. Marqueurs L1-L4 par étape. Encart anatomie ticket tier 1
ROBOT-friendly (Listen → Retrieve → Reason+Plan → Execute → Audit).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### Task 18 : fig-03 — Dérive des coûts inférence 2024-2026 par pattern (1480×800)

**Files:**
- Create: `livre/cas-pratiques/images/CC-10-dev-agentique/CC-10-fig-03-derive-couts.svg`

- [ ] **Step 18.1 — Design fig-03**

Contrat : `viewBox="0 0 1480 800"`. Format : graphique courbes superposées.

Axes :
- X : temps (2024 → 2025 → 2026 → projection 2027).
- Y : coût par dev par mois en USD (échelle log si nécessaire pour absorber l'amplitude).

Courbes (4) :
1. **Ghost autocomplete** — ligne plate ~$10 (siège), légère hausse vers $15 en 2026.
2. **Chat IDE / CLI** — ascendante : $20 (2024 siège pur) → $40 (2025 siège + premium) → $60 (2026 siège + premium reqs + tokens).
3. **Agent async cloud** — ascendante forte : $0 (2024, pas encore commodifié) → $60 (2025 Devin, Cursor BG early) → $140 (2026 usage régulier tier 1 sans gateway interne).
4. **Code review auto** — ascendante modérée : $5 (2024) → $15 (2025) → $25 (2026 prix par PR).

Repères verticaux (event lines) sur l'axe temps :
- **Mid-2025** : Anthropic weekly rate limits introduites sur Sonnet/Opus.
- **Fin 2025** : retex Uber Copilot Enterprise budget dépassement.
- **2025-2026** : GitHub Copilot premium requests annoncées.

Annotation finale : **Crossover gateway LLM interne** (point où le coût total cumulé via gateway interne avec quotas par profil bat le coût total via sièges Copilot uniformes) — situé courant 2026.

Bande pédagogique en bas (subtitle 18pt italic) : *« Le poste inférence × 35 entre POC et Scale, l'équipe × 12. La dérive n'est pas dans le siège, elle est dans les tokens. »*

- [ ] **Step 18.2 — Valider et commit**

```bash
python -c "import xml.etree.ElementTree as ET; ET.parse('livre/cas-pratiques/images/CC-10-dev-agentique/CC-10-fig-03-derive-couts.svg'); print('XML valid')"

git add livre/cas-pratiques/images/CC-10-dev-agentique/CC-10-fig-03-derive-couts.svg
git commit -m "$(cat <<'EOF'
livre/cas-pratiques : CC-10 fig-03 — dérive des coûts inférence 2024-2026 par pattern

Courbes superposées de coût/dev/mois 2024-2026 par pattern : ghost
stable ~10 $, chat IDE 20 $ → 60 $, async cloud 0 $ → 140 $, review
auto 5 $ → 25 $. Repères verticaux Anthropic weekly rate limits
(mi-2025), retex Uber Copilot Enterprise (fin 2025), GitHub Copilot
premium requests (2025-2026). Crossover gateway LLM interne vs sièges
Copilot uniformes courant 2026. Illustre la §10 du MD.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5 — HTML rendu self-contained

**Patron** : `livre/cas-pratiques/CC-14-power-users.html` (1 351 lignes, livré commit `644f9d3`). Calquer la structure CSS + JS + widgets.

**Sclérosants connus** :
- Apostrophes françaises (’) dans HTML inliné en JS → escape `\'` (mémoire `feedback_js_string_apostrophe_escape`).
- Tags littéraux `<thinking>` dans `<code>` → escape `&lt;...&gt;` (mémoire `feedback_html_tag_in_code_escape`).
- Modal SVG zoom : pointer-events sur `.modal-card` uniquement, pas sur le wrapper (mémoire `feedback_slideshow_topbar_click_with_modal`).

### Task 19 : HTML skeleton (head + topbar + hero + footer + JS inline)

**Files:**
- Create: `livre/cas-pratiques/CC-10-dev-agentique.html`

- [ ] **Step 19.1 — Lire le patron CC-14 et identifier les blocs réutilisables**

Lire `livre/cas-pratiques/CC-14-power-users.html` en entier. Identifier :
- Bloc `<head>` (meta, favicon, Google Fonts, palette CSS variables, OG markers)
- Topbar 3-items (.back / .dossier-context / .forward)
- Hero (eyebrow CC-XX / titre / lede)
- Footer site-foot (Lincoln-only, disclosure IA)
- JS inline (zoom modal SVG, anchor figcaption, sidebar TOC + Sources si présent)
- Skin CSS (palette, typo Fraunces/Inter/JetBrains Mono)

- [ ] **Step 19.2 — Créer le squelette HTML**

Reproduire la structure CC-14 avec adaptation CC-10 :
- `<title>` : `CC-10 — Pair programming → organisation dev agentique | Livre · Mathieu Guglielmino`
- Topbar centre : `Pair programming → dev agentique`
- Hero eyebrow : `Cas pratique CC-10 · Développement logiciel · Agentic · Charnière`
- Hero titre : `Pair programming → organisation dev agentique`
- Hero lede : reprendre la thèse du JSON `meta.these_une_ligne` (réécrit en 2 phrases pour la respiration).
- Bloc OG markers placeholders `<!-- og:start --> <!-- og:end -->` (rempli par `tools/seo_dossiers.py` plus tard).
- Footer : copier verbatim depuis CC-14 (disclosure IA + Lincoln footer-only).

- [ ] **Step 19.3 — JS inline minimal (zoom + anchor)**

Copier les fonctions IIFE de CC-14 (zoom SVG modal + anchor ¶ scroll-into-view). Vérifier qu'aucune apostrophe française n'est inlinée en JS sans escape (mémoire).

- [ ] **Step 19.4 — Valider syntaxe HTML**

```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('livre/cas-pratiques/CC-10-dev-agentique.html', 'utf8');
// Vérifications basiques : balises principales équilibrées
const opens = (html.match(/<(div|section|article|header|footer|main|aside|nav)\\b/g) || []).length;
const closes = (html.match(/<\\/(div|section|article|header|footer|main|aside|nav)>/g) || []).length;
if (opens !== closes) console.warn('Déséquilibre balises bloc :', {opens, closes});
else console.log('Balises bloc OK :', opens, 'ouvertures =', closes, 'fermetures');
"
```

Expected : `Balises bloc OK : N ouvertures = N fermetures`.

### Task 20 : HTML widgets §1-9 (mise en situation → trajectoire coûts)

**Files:**
- Modify: `livre/cas-pratiques/CC-10-dev-agentique.html`

- [ ] **Step 20.1 — Lire les widgets attendus dans `tests/cases-build.test.mjs`**

```bash
node -e "
const fs = require('fs');
const test = fs.readFileSync('tests/cases-build.test.mjs', 'utf8');
console.log(test.match(/case-[a-z-]+/g));
"
```

Attendre la liste des widgets attendus (`case-team-cast`, `case-archi`, `case-app-modes`, `case-mcp`, `case-models`, `case-build-buy`, `case-cost-trajectory`, `case-governance-stack`, `case-eval-loop`, `case-roi-grid`, `case-debate`, `case-choice`, `case-quiz`, `case-verdict`).

- [ ] **Step 20.2 — Insérer les widgets §1 à §9**

Calquer chaque widget sur l'équivalent CC-14. Adapter les data inline avec le contenu CC-10 (depuis le MD et le JSON) :
- `<section class="case-team-cast">` : personas (CTO sponsor, VP Eng porteur, Staff DX allié, RSSI opposant).
- `<section class="case-archi">` : embed fig-00 + bouton zoom ⛶ + anchor ¶.
- `<section class="case-app-modes">` : modes A/B/C + niveaux L1-L4 + tiering ticket.
- `<section class="case-mcp">` : table 8 MCP servers.
- `<section class="case-models">` : matrice 6 modèles candidats + cascade par pattern.
- `<section class="case-build-buy">` : table 3 régimes × 6 critères.
- `<section class="case-cost-trajectory">` : grille 8 postes × 4 phases + coût/PR + crossover.

Pour chaque widget : reprendre le HTML CC-14 équivalent, remplacer le contenu. **Préserver classes CSS** (le test build vérifie la présence des classes, pas le contenu).

### Task 21 : HTML widgets §10-17 + nouveau widget case-cost-drift + run cases-build.test.mjs + commit

**Files:**
- Modify: `livre/cas-pratiques/CC-10-dev-agentique.html`

- [ ] **Step 21.1 — Insérer le nouveau widget `case-cost-drift` pour §10**

Décision (spec §6) : **wrap autour de fig-03 + bande pédagogique** plutôt que mini-svg interactif natif (plus simple, conforme au reste des widgets).

Structure :

```html
<section class="case-cost-drift">
  <h2>Dérive des coûts : tokenmaxxing, Uber, fin de l'all-you-can-eat</h2>
  <figure id="fig-03">
    <img src="images/CC-10-dev-agentique/CC-10-fig-03-derive-couts.svg" alt="Dérive des coûts inférence par pattern 2024-2026">
    <figcaption>
      Courbes par pattern · repères Anthropic weekly limits / Uber / Copilot premium reqs
      <a class="anchor" href="#fig-03" title="Lien direct vers ce schéma">¶</a>
    </figcaption>
  </figure>
  <div class="drift-callouts">
    <div class="drift-callout">
      <h3>Tokenmaxxing</h3>
      <p>[Texte ~80 mots adapté du MD §10.1]</p>
    </div>
    <div class="drift-callout">
      <h3>Retex Uber</h3>
      <p>[Texte ~80 mots adapté du MD §10.2 — paraphrasé si pas de source unique fiable]</p>
    </div>
    <div class="drift-callout">
      <h3>GitHub Copilot premium requests</h3>
      <p>[Texte ~80 mots adapté du MD §10.3]</p>
    </div>
  </div>
  <p class="drift-conclusion">La gateway LLM interne (cf. CC-14 §7) refait surface ici comme garde-fou financier dev.</p>
</section>
```

CSS dédié à ajouter dans le `<style>` (calque sur `.callout` ou `.quiz-card` de CC-14 mais avec `border-left: 4px solid var(--accent)` pour distinguer).

- [ ] **Step 21.2 — Insérer les widgets §11 à §17**

Calquer chaque widget sur CC-14 :
- `<section class="case-governance-stack">` : RACI + cadence revue + ligne AI Act.
- `<section class="case-eval-loop">` : 3 axes éval (régression + online + dérive) + boucle correction.
- `<section class="case-roi-grid">` : grille ROI 4 métriques (cibles + non retenu).
- `<section class="case-debate">` : pour / contre / verdict pondéré.
- `<section class="case-choice">` ×3 : bifurcations 16.1, 16.2, 16.3.
- `<section class="case-quiz">` ×3 : Q1 patterns, Q2 tokenmaxxing, Q3 autonomie agents async.
- `<section class="case-verdict">` : stamp + label + 10 conditions.

Renvois livre en bas (liens vers `../chapitres/*.md`).

- [ ] **Step 21.3 — Run cases-build.test.mjs**

```bash
node --test tests/cases-build.test.mjs
```

Expected : PASS. Le test vérifie que `CC-10-dev-agentique.html` contient toutes les classes widgets attendues.

Si FAIL → vérifier la liste des widgets manquants depuis l'output du test, ajouter les widgets correspondants.

- [ ] **Step 21.4 — Vérifier le rendu mobile (Chrome devtools)**

Mobile checklist 7 points (cf. `.claude/skills/illustrated-deep-research/references/mobile.md`) :
1. Pas de débordement horizontal (`overflow-x: hidden` sur html, body).
2. Touch targets ≥ 44px (boutons, liens).
3. Police body ≥ 16px sur mobile (pas de zoom auto iOS).
4. Tableaux scrollables horizontalement (wrap dans `<div class="table-wrap">` avec `overflow-x: auto`).
5. SVG figures responsive (`max-width: 100%` + `height: auto`).
6. Modal zoom SVG fonctionne au tap (pas seulement hover).
7. Topbar mobile : pas de blocage de clic par modal (cf. mémoire `feedback_slideshow_topbar_click_with_modal`).

- [ ] **Step 21.5 — Commit HTML CC-10**

```bash
git add livre/cas-pratiques/CC-10-dev-agentique.html
git commit -m "$(cat <<'EOF'
livre/cas-pratiques : CC-10 dev agentique — HTML rendu self-contained

HTML rendu calqué sur le patron CC-14 (self-contained, CSS + JS inline,
Google Fonts seule dépendance externe). Tous widgets canoniques présents
+ nouveau widget case-cost-drift pour la section §10 (wrap fig-03 +
3 callouts tokenmaxxing/Uber/Copilot). Topbar 3-items, hero CC-10,
4 figures avec bouton zoom ⛶ et anchor ¶, mobile checklist 7 points
passée. Tests CI cases-build.test.mjs passants.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6 — Updates index / hub / cases-index

### Task 22 : Bascule carte CC-10 + cases-index + compteur hub livre

**Files:**
- Modify: `livre/cas-pratiques/index.html`
- Modify: `livre/use-cases-data/cases-index.json`
- Modify: `livre/index.html`

- [ ] **Step 22.1 — Bascule carte CC-10 dans `livre/cas-pratiques/index.html`**

Lire le fichier. Identifier la carte CC-10 actuelle (probablement `class="format format--draft"` ou `class="format format--cas format--draft"` ou similaire — cf. la carte CC-02 qui est aussi en draft).

Changer la classe `draft` → `livre` (ou supprimer `draft` selon convention). Mettre à jour le `href` vers `CC-10-dev-agentique.html`. Mettre à jour le lede si placeholder.

- [ ] **Step 22.2 — Update `cases-index.json`**

Modifier l'entry `CC-10` :
```diff
-      "statut": "draft",
+      "statut": "livre",
```

- [ ] **Step 22.3 — Update compteur hub livre racine `livre/index.html`**

Lire le fichier. Identifier le CTA `cas-pratiques` qui contient un compteur de cas livrés (du genre `N cas livrés sur 10`). Incrémenter de N à N+1.

Vérifier le nombre actuel de cas avec `statut: "livre"` dans `cases-index.json` :

```bash
node -e "
const idx = JSON.parse(require('fs').readFileSync('livre/use-cases-data/cases-index.json', 'utf8'));
const livres = idx.cases.filter(c => c.statut === 'livre').map(c => c.id);
console.log('Cas livrés:', livres.length, livres);
"
```

Aligner le compteur dans `livre/index.html` sur ce nombre.

- [ ] **Step 22.4 — Commit bascule statut + index**

```bash
git add livre/cas-pratiques/index.html livre/use-cases-data/cases-index.json livre/index.html
git commit -m "$(cat <<'EOF'
livre : CC-10 dev agentique bascule statut livre + compteur hub livre

Carte CC-10 dans le hub cas-pratiques passée de draft à livre (href
réel + lede final). cases-index.json statut 'livre'. Compteur de cas
livrés dans le CTA cas-pratiques du hub livre racine incrémenté.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 7 — SEO + finale

### Task 23 : SEO + og.png + mobile final + récapitulatif

**Files:**
- Generate: `livre/cas-pratiques/CC-10-dev-agentique-og.png`
- Modify (par le script): `livre/cas-pratiques/CC-10-dev-agentique.html` (bloc OG markers)
- Modify (par le script): `livre/cas-pratiques/index.html` (bloc OG markers si pas déjà fait)

- [ ] **Step 23.1 — Run `tools/seo_dossiers.py --only cas-pratiques`**

```bash
python tools/seo_dossiers.py --only cas-pratiques
```

Expected output (cf. CLAUDE.md repo) :
- Génère `livre/cas-pratiques/CC-10-dev-agentique-og.png` (1200×630).
- Injecte le bloc OG/Twitter/canonical/JSON-LD entre `<!-- og:start -->` et `<!-- og:end -->` dans `CC-10-dev-agentique.html`.
- Met à jour le hub `index.html` si nécessaire.

Si erreur (ex. og.png non généré) → diagnostiquer (fonts PIL manquantes, etc.).

- [ ] **Step 23.2 — Vérifier visuel og.png**

Ouvrir `livre/cas-pratiques/CC-10-dev-agentique-og.png` dans un viewer. Vérifier :
- Taille 1200×630.
- Titre lisible avec accent orange sur un mot-clé.
- Eyebrow `Cas pratique CC-10 · Développement logiciel`.
- Monogramme MG en bas à droite.
- Footer brand.

- [ ] **Step 23.3 — Vérification finale mobile + accessibility**

Ouvrir `CC-10-dev-agentique.html` dans Chrome devtools mode mobile (iPhone 12 Pro). Re-vérifier les 7 points de la mobile checklist + le rendu des 4 figures + le widget `case-cost-drift`.

Ouvrir le hub `livre/cas-pratiques/index.html` mobile. Vérifier que la carte CC-10 apparaît bien en `livre` (pas en `draft`).

- [ ] **Step 23.4 — Commit final SEO + og.png**

```bash
git add livre/cas-pratiques/CC-10-dev-agentique-og.png livre/cas-pratiques/CC-10-dev-agentique.html livre/cas-pratiques/index.html
git commit -m "$(cat <<'EOF'
livre/cas-pratiques : CC-10 dev agentique — SEO og.png + bloc OG/Twitter/canonical/JSON-LD

Carte sociale 1200×630 générée par tools/og-card.py. Bloc OpenGraph +
Twitter Card + canonical + JSON-LD Article injecté dans CC-10.html
et dans le hub cas-pratiques via tools/seo_dossiers.py (markers
og:start/og:end). Mobile checklist 7 points re-vérifiée. Carte hub
finalisée.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 23.5 — Run tests CI complets une dernière fois**

```bash
node --test tests/cases-contract.test.mjs tests/roi-metrics-contract.test.mjs tests/cases-build.test.mjs tests/lib-contract.test.mjs tests/apps-integration.test.mjs
```

Expected : ALL PASS.

Si FAIL → corriger avant push.

- [ ] **Step 23.6 — Récapitulatif final pour l'utilisateur**

Synthèse à présenter à Mathieu :
- ✅ CC-10 livré complet : JSON + MD (~7 000 mots) + 4 SVG + HTML self-contained.
- ✅ Hub + cases-index + compteur livre racine à jour.
- ✅ SEO og.png + bloc OpenGraph injecté.
- ✅ Tests CI passants.
- ✅ Mobile checklist passée.
- ✅ Commits propres sur `claude/kind-curie-HRp70` (N nouveaux commits).
- ⏳ **Action utilisateur** : `git log --oneline claude/kind-curie-HRp70 ^main` pour review des commits, puis ouvrir PR via MCP GitHub (`mathieugug/mathieugug.github.io`, head `claude/kind-curie-HRp70`, base `main`).

Ne PAS push automatiquement (CLAUDE.md). Attendre validation explicite de Mathieu pour push branche + PR.

---

## Self-Review du plan

### 1. Spec coverage

Vérifier chaque section du spec contre une tâche du plan :

| Spec section | Tâche du plan |
|---|---|
| §1 méta + thèse + décisions | Task 1.1 |
| §3.1 meta | Task 1.1 |
| §3.2 mise_en_situation | Task 1.2 |
| §3.3 architecture_actuelle | Task 1.3 + fig-00 Task 15 |
| §3.4 application_concrete | Task 2.1 + fig-02 Task 17 |
| §3.5 outils_internes | Task 2.2 |
| §3.6 modeles_cibles | Task 2.3 |
| §3.7 enjeux | Task 3.1 |
| §3.8 build_buy | Task 3.2 |
| §3.9 trajectoire_couts | Task 3.3 |
| §3.10 dérive (section spéciale MD) | Task 6 sources + Task 11.2 MD + fig-03 Task 18 + widget Task 21.1 |
| §3.11 gouvernance | Task 4.1 |
| §3.12 evaluation | Task 4.2 |
| §3.13 roi | Task 4.3 + Task 0 si métriques manquantes |
| §3.14 operation_equipe | Task 4.4 |
| §3.15 debat | Task 4.5 |
| §3.16 choix_lecteur | Task 5.1 |
| §3.17 quiz | Task 5.2 |
| §3.18 verdict | Task 5.3 |
| §3.19 renvois_livre | Task 5.4 |
| §3.20 figures | Task 5.5 + tasks 15-18 |
| §5 structure MD 17 sections | Tasks 7-14 |
| §6 HTML self-contained | Tasks 19-21 |
| §7 ordre implémentation | Tout le plan |
| §8 risques | Task 6 fact-checking + Task 14.6 vérif renvois + mobile checklist Task 21.4 + Task 23.3 |
| §9 DoD éditoriale | Task 23.5 + récap 23.6 |

**Couverture : 100 %.** Aucune section orpheline.

### 2. Placeholder scan

Recherche des patterns interdits :
- `TBD` / `TODO` : aucun.
- `implement later` / `fill in details` : aucun.
- `add appropriate error handling` (vague) : aucun.
- « Similar to Task N » sans répétition du contenu : aucun — chaque tâche cite explicitement les sections JSON ou les blocs MD à produire avec le contenu réel ou un renvoi précis au spec.
- « Add appropriate widgets » : non — Task 20 et 21 listent les widgets nommément.

**OK.**

### 3. Type consistency

Vérifier que les noms de fichiers, de sections et d'identifiants ne dérivent pas entre tâches :
- `CC-10-dev-agentique.json` / `.md` / `.html` / `-og.png` : cohérent dans toutes les tâches.
- Dossier `images/CC-10-dev-agentique/` : cohérent.
- Préfixe figures `CC-10-fig-00-...` à `CC-10-fig-03-...` : cohérent.
- Sections JSON nommées exactement comme dans `case.schema.md` v2 : `meta`, `mise_en_situation`, `architecture_actuelle`, `application_concrete`, `outils_internes`, `modeles_cibles`, `enjeux`, `build_buy`, `trajectoire_couts`, `gouvernance`, `evaluation`, `roi`, `operation_equipe`, `debat`, `choix_lecteur`, `quiz`, `verdict`, `renvois_livre`, `figures` — cohérent.
- Branches : toutes les opérations git restent sur `claude/kind-curie-HRp70` (confirmé en brainstorming).
- Widgets HTML CSS classes : `case-team-cast`, `case-archi`, etc. — cohérent.

**OK.**

### 4. Ambiguïtés résiduelles

- Task 6 fact-checking laisse explicitement la possibilité de paraphraser si une source ne se confirme pas — c'est intentionnel et flaggé.
- Task 22.3 demande de calculer le compteur depuis `cases-index.json` — pas d'ambiguïté, commande fournie.
- Task 23.1 dépend du bon fonctionnement de `tools/seo_dossiers.py` — si le script échoue, diagnostiquer (flaggé en step 23.1).

**OK.**

---

## Execution Handoff

Plan complet et sauvegardé à `docs/superpowers/plans/2026-06-04-CC-10-dev-agentique.md`. Deux options d'exécution :

**1. Subagent-Driven (recommandé)** — Je dispatche un fresh subagent par tâche, review entre les tâches, itération rapide. Bien adapté ici : 23 tâches indépendantes, deux phases (JSON + MD + SVG) où la calibration éditoriale peut diverger sans un œil critique entre chaque livrable.

**2. Inline Execution** — Exécute les tâches dans la session courante avec `superpowers:executing-plans`, exécution par batch avec checkpoints pour review.

**Quelle approche tu préfères ?**
