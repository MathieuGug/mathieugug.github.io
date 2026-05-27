# Livre — outline de travail

_Document de travail pour la mise en livre des 28 dossiers du site. Destiné aux experts data et aux décideurs. Pédagogue, problématisé, dense. Signale explicitement les redondances, les concepts qui s'approfondissent d'un dossier à l'autre, les schémas à fusionner._

> **Date** : 2026-05-27 · **Branche** : `claude/book-outline-concepts-2mRuR` · **Statut** : v0 — outline soumis pour discussion. Ce n'est pas le manuscrit, c'est la carte de bataille.

---

## 0. Cadrage

### 0.1 De quoi ce livre est fait

Le site `mathieugug.github.io` agrège **28 dossiers** publiés entre avril et mai 2026, soit ~200 schémas SVG éditoriaux, ~900 sources premium, et un livre interactif (`anatomie/livre.html`) en 10 anneaux concentriques qui sert de cellule-mère. Le livre proposé ici **n'est pas un best-of** : c'est la fusion structurée de ces 28 dossiers, avec déduplication des notions redondantes, approfondissement des concepts qui se chevauchent, et mise en série des angles complémentaires.

L'épine dorsale est le livre `anatomie/` (LAYERS 00→09 dans `anatomie/livre-data.js`). Tous les autres dossiers s'y agrègent par anneau, mais le découpage final s'organise en **4 actes** plus lisibles pour un lecteur décideur :

- **Acte I — Les moteurs** (anneau 00, plus économie de l'inférence)
- **Acte II — La boucle** (anneaux 01-04 : boucle agent, outils, contexte, patterns)
- **Acte III — Les interfaces** (anneau 05 + surfaces)
- **Acte IV — Les mesures et garde-fous** (anneaux 06-09 + société/horizon)

### 0.2 Lecteurs cibles et niveaux de lecture

Deux profils, deux entrées :

| Lecteur | Entrée | Sortie attendue |
| --- | --- | --- |
| **Expert data / agent engineer** | Acte II (la boucle, harness, mémoire) | Une grille pour designer / debugger un agent en prod sans réinventer six fois la roue. |
| **Décideur / sponsor / CDO** | Acte IV (mesures, garde-fous, gouvernance) | Une grille pour arbitrer cas d'usage, fournisseur, budget, calendrier réglementaire. |

Le livre doit pouvoir se lire dans **les deux sens** : du bas vers le haut (cœur stochastique → governance) pour les expert·e·s, du haut vers le bas (Klarna a reculé, pourquoi → ce que la pile fait techniquement) pour les décideur·euse·s. Chaque chapitre ouvre par une **question problématisée** (pattern hérité de `livre-data.js`), suivie d'une thèse en une ligne, du corpus de dossiers absorbés, et d'un encadré « **piège classique** ».

### 0.3 Méthode d'absorption

Pour chaque chapitre du livre, on précise :

1. **Question d'ouverture** (problématisation).
2. **Thèse en une ligne**.
3. **Dossiers fusionnés** (liens internes du repo + dates de publication).
4. **Concepts qui s'approfondissent** d'un dossier à l'autre (chaîne de profondeur).
5. **Redondances à dédupliquer** (où deux dossiers disent la même chose).
6. **Schémas à fusionner ou créer** (par leur `fig-NN` quand identifié).
7. **Piège classique** (un risque concret, traçable).
8. **Sortie lecteur** : ce que la personne doit pouvoir faire après lecture.

---

## 1. Carte des 28 dossiers — clusters thématiques

Avant le plan détaillé, voici les **huit clusters** qui structurent la matière (et qui suggèrent où **fusionner** vs où **multiplier les approches**).

### Cluster A — Architecture concentrique (méta)

- `anatomie/` (14 mai) — 10 anneaux concentriques LLM core → governance. **C'est l'os**. Sert de squelette à tout le livre.

### Cluster B — Moteurs : raisonnement, scoring, décodage, économie

- `modeles-raisonnement/` (06 mai · #14) — pivot o1, RLVR, GRPO, faithfulness 25 %/39 %, second axe scaling, interleaved/parallel thinking.
- `process-reward-models/` (13 mai · #18) — Lightman/PRM800K 2023, pivot DeepSeek-R1 RLVR 2025, generative verifiers GenRM/ThinkPRM, reward hacking 99 %/2 %, marché annotation 2-4 Md $.
- `decode-speculative/` (22 mai · #25) — draft·target·verify, 4 familles (Medusa/EAGLE/Lookahead), acceptance rate piège (code 80 % / créatif 45 %), point bascule batch≈24.
- `economie-inference/` (05 mai · #13) — LLMflation ×1000, pile 7 couches, désagrégation prefill/decode (Splitwise/Mooncake), MoE vs dense, marges Together ~45 %.
- `world-models/` (05 mai) + `narrative-experiences/` (05 mai) — bordures : physique apprise (JEPA/diffusion/AR), troisième voie d'interaction.

> **Approfondissement** : `modeles-raisonnement` pose le pivot → `process-reward-models` détaille la couche notateur cachée → `decode-speculative` montre comment on regagne le débit perdu → `economie-inference` agrège l'addition. Lus dans cet ordre, on ne refait pas trois fois la même boucle.
>
> **Redondance à dédupliquer** : la « chain-of-thought » et l'« inference-time compute » sont décrits dans `modeles-raisonnement` ET `process-reward-models`. Fusionner en **un seul** schéma de référence dans l'Acte I, citer en renvoi ailleurs.

### Cluster C — Boucle, harness, SDK, pratiques d'équipe

- `harness-agentique/` (29 avr · #04) — couche orchestration, architecture GAN 3 agents, observabilité, trajectoire 2026-2027.
- `agent-sdk/` (18 mai · #22) — Claude Code + Agent SDK, *bash is all you need*, gather/act/verify, hooks, skills, MCP, managed.
- `orchestration-agentique/` (27 mai · #28) — 4 régimes contrôle (code-driven / LLM-driven / graphe / autonome), 8 patterns canoniques (Anthropic + topologies multi-agents), stack 3 couches ADK/runtime/produit, 5 problèmes durs prod, arbre de décision buy/build.
- `coding-agents/` (12 mai · #17) — Claude Code, Codex CLI, GitHub Copilot, pyramide d'usage 4 étages, retex chiffrés vs benchmarks.
- `fabrique-agent/` (15 mai · #21) — 4 stades de maturité, 10 artefacts partagés, équipe qui apprend à livrer.

> **Approfondissement** : `harness-agentique` pose l'objet → `agent-sdk` montre le code minimal → `orchestration-agentique` étend à multi-agent et au runtime managé → `coding-agents` instancie sur le cas concret du code → `fabrique-agent` capitalise en pratiques d'équipe.
>
> **Redondance massive** : la boucle ReAct (Reason · Act · Observe), le `stop_reason`, les patterns canoniques Anthropic (Augmented LLM, Prompt chaining, Routing, Parallelization, Orchestrator-workers, Evaluator-optimizer) apparaissent dans **5 dossiers** : `anatomie` (couches 01-04), `harness-agentique`, `agent-sdk`, `orchestration-agentique`, `coding-agents`. Un **schéma unifié** dans l'Acte II, des renvois ailleurs.

### Cluster D — Mémoire et contexte (le cœur cognitif)

- `memoire-agentique/` (30 avr · #07) — 4 piliers (travail / sémantique / épisodique / procédurale), 6 opérations, 5 architectures production (Letta, A-MEM, Zep, Mem0, file-based), surface MITRE ATLAS.
- `compaction-agentique/` (27 mai · #27) — 5 familles (summarization /compact, eviction StreamingLLM/H2O/Quest, hiérarchique MemGPT/Letta, retrieval Mem0/Zep/A-MEM, compactors appris), triangle fidélité × coût × oubliabilité, memory poisoning SpAIware, RGPD art. 17 + AI Act art. 10/25, ledger OTel `gen_ai.compaction.*`.

> **Approfondissement** : `memoire-agentique` est la cartographie → `compaction-agentique` est le deep-dive d'un sous-pilier (le travail/court-terme) et de son envers (l'oubli stratégique). Les deux sont **complémentaires**, pas redondants. Le livre les traite en chapitre + sous-chapitre.

### Cluster E — Protocoles et plateformes

- `mcp-plateforme/` (08 mai · #16) — MCP comme HTTP des agents, effet réseau, donation LF, 7 500 serveurs, layering avec function calling / OpenAPI / A2A.
- `mcp-securite/` (20 mai · #26) — 10 vecteurs × 10 patterns, 6 trust boundaries, 4 familles (tool poisoning / prompt injection cross-doc / cross-server confusion / OAuth+supply chain), roadmap 12 mois (Sigstore automne 2026, AAIF printemps 2027).

> **Approfondissement** : dyade `mcp-plateforme` (la promesse, le réseau) → `mcp-securite` (le risque, les patterns défensifs). À traiter dans le **même** chapitre du livre, deux mouvements.

### Cluster F — Surfaces, accès, computer use

- `surfaces-agentiques/` (18 mai · #23) — 4 régimes d'accès (chat / copilote inline / canvas génératif / on-behalf-of), AG-UI 17 events, levels of autonomy (Knight Institute), graduated trust (Anthropic), 5 couches d'architecture canonique.
- `agents-computer-use/` (02 mai · #09) — pilotage écran, observe-plan-ground-act-verify, 3 architectures, OSWorld/WebArena/UI-CUBE, surface VPI + CVE-2025-55322.
- `analytics-agentique-gcp/` (19 mai · #24) — 3 surfaces agentiques sur GCP (Conversational Analytics, agents custom Vertex, MCP banque), pivot semantic layer Looker/dbt/Cube, banque tier 1 DORA + AI Act ACPR.

> **Approfondissement** : `surfaces-agentiques` pose la typologie (4 régimes, Knight) → `agents-computer-use` est l'instanciation extrême (régime on-behalf-of avec pilotage écran) → `analytics-agentique-gcp` est l'instanciation sectorielle (banque française, contraintes souveraineté).

### Cluster G — Mesure, évaluation, observabilité, ROI

- `evaluation-agentique/` (01 mai · #08) — F1 → trajectoires multi-tours, pass@k vs pass^k, taxonomie graders, LLM-as-judge, τ-bench/τ²-bench, playbook **gruyère 8 étapes**.
- `benchmarks-contestes/` (15 mai · #19) — SWE-bench / GAIA / OSWorld / τ-bench, 4 vecteurs contamination (temporel / version-tag / harness gaming / prompt leakage), benchmark teams, contre-mouvement SWE-bench Live / SWE-Lancer / MLE-bench / ARC-AGI 2.
- `observabilite-agents-ia/` (30 avr · #06) — OTel GenAI Semantic Conventions, 6 piliers télémétrie, **cognitive audit trail**, vendor landscape (Langfuse, Braintrust, Arize, LangSmith, Dynatrace, AgentCore), échelle de maturité.
- `measure-roi/` (07 mai · #15) — 5 frameworks (Cigref, McKinsey, BCG, MIT NANDA, Forrester TEI), hard vs soft savings, **productivity J-curve**, paradoxe agentique token→tâche→processus→outcome, étude Klarna (recul partiel après 67 %).
- `ia-frugale/` (13 mai · #20) — kWh/token, gCO₂eq, debunk Strubell 2019 / de Vries 2023 / Li 2023, frameworks de mesure (GHG × cycle de vie × ISO 30134/21031, EU CoC), eau scope 1/2/3, embodied carbon H100, paradoxe Jevons, 3 trajectoires 2030 (laissez-faire 1500 TWh / efficience 1100 / plafond 650).

> **Approfondissement** : `evaluation-agentique` pose la grille → `benchmarks-contestes` démolit les leaderboards publics (corollaire critique) → `observabilite-agents-ia` fournit l'infra de mesure en prod → `measure-roi` traduit en business case → `ia-frugale` ajoute l'externalité énergétique.
>
> **Redondance à arbitrer** : la mention « OpenTelemetry GenAI semconv » apparaît dans 5 dossiers (`anatomie` couche 07, `observabilite-agents-ia`, `compaction-agentique`, `evaluation-agentique`, `orchestration-agentique`). **Un seul** encadré canonique dans le chapitre Observabilité, renvois ailleurs.

### Cluster H — Sécurité, gouvernance, société, horizon

- `llm-jailbreaking/` (28 avr) — asymétrie attaque/défense, taxonomie d'attaques.
- `gouvernance/` (21 avr) — scrolly AI Act, structure réglementaire européenne.
- `ia-et-travail/` (06 mai · #10) — Acemoglu, Frey-Osborne, Eloundou, Goldman, McKinsey, FMI, Aghion, Benhamou, pause d'Engels (Allen 2009), 4 scénarios 2035, 6 leviers anti-catastrophe.
- `proces-musk-altman/` (27 avr · #03) — veille jour-J, chronologie tri-pistes, anatomie juridique, témoins, écosystème financier, application compagnon 52 régions + journal quotidien.

> **Approfondissement** : `llm-jailbreaking` + `mcp-securite` + couche 06 d'`anatomie` forment la **triade sécurité** (modèle / protocole / boucle). `gouvernance` est le cadre réglementaire ; `analytics-agentique-gcp` est l'instanciation sectorielle (DORA, ACPR, secteur banque). `ia-et-travail` et `proces-musk-altman` sont les **contreforts sociétaux** qui orbitent autour de la stack sans en faire partie.

---

## 2. Le squelette — 4 actes, ~22 chapitres

Vue d'avion. Le détail chapitre par chapitre suit en §3.

| Acte | Titre travail | Anneaux anatomie absorbés | Dossiers fusionnés | Cible lecteur |
| --- | --- | --- | --- | --- |
| **Prologue** | Pourquoi un livre, maintenant | — | (méta) | tout le monde |
| **Acte I** | Les moteurs | 00 LLM core | `anatomie` (00), `modeles-raisonnement`, `process-reward-models`, `decode-speculative`, `economie-inference`, (`world-models` en horizon) | expert data, FinOps, achats infra |
| **Acte II** | La boucle | 01-04 (boucle, outils, contexte, patterns) | `anatomie` (01-04), `harness-agentique`, `agent-sdk`, `orchestration-agentique`, `coding-agents`, `fabrique-agent`, `memoire-agentique`, `compaction-agentique` | agent engineer, tech lead, architecte |
| **Acte III** | Les interfaces | 05 protocoles | `anatomie` (05), `mcp-plateforme`, `mcp-securite`, `surfaces-agentiques`, `agents-computer-use`, `analytics-agentique-gcp`, (`narrative-experiences`) | PM, designer, intégrateur, architecte plateforme |
| **Acte IV** | Mesures et garde-fous | 06-09 (guardrails, observabilité, runtime, governance) | `anatomie` (06-09), `evaluation-agentique`, `benchmarks-contestes`, `observabilite-agents-ia`, `llm-jailbreaking`, `measure-roi`, `ia-frugale`, `gouvernance`, `ia-et-travail`, `proces-musk-altman` | décideur, sponsor, RSSI, DPO, FinOps, CDO |
| **Épilogue** | Sept paris à dater 2027-2028 | — | (transverse) | décideur, stratège |
| **Annexes** | Schémas à fusionner · Glossaire · Index dossiers source | — | (méta) | tous |

---

## 3. Plan détaillé — chapitre par chapitre

### PROLOGUE — Pourquoi un livre, maintenant

**Question** : Si chaque dossier se lit déjà très bien seul, pourquoi un livre ?

**Thèse** : Parce que les 28 dossiers décrivent **une seule** stack, et qu'on perd la cohérence en les lisant en silos. Le livre est l'occasion de purger les redondances, de réordonner la profondeur, et de proposer une grille de décision unifiée — pas un best-of.

**Contenu** :
- 1.1 Méthode (les 4 actes, l'épine anatomie, les indices).
- 1.2 Lecteurs cibles et niveaux de lecture (cf. §0.2).
- 1.3 Ce que ce livre n'est pas : un manuel d'implémentation, un livre blanc vendeur, un état de l'art exhaustif. C'est une **carte de décision problématisée**.
- 1.4 Conventions : encadrés `piège classique`, encadrés `chiffres à connaître`, renvois inter-chapitres `→ Ch. X.Y`, sources dans l'apparat.

**Sortie lecteur** : sait quoi sauter et quoi lire.

---

### ACTE I — LES MOTEURS

> _Couches du **dessous** de la pile. Avant la boucle, le modèle. Avant la conversation, un tirage probabiliste. Avant le débit en token/sec, un schedule de GPU. Lecteur cible : expert data + acheteur infra/cloud._

#### Chapitre 1 — Le cœur stochastique (anneau 00)

**Question** : Si la sortie d'un LLM est un dé pondéré, comment construit-on un système fiable autour ?

**Thèse** : La reproductibilité bit-à-bit n'existe pas — on vise la reproductibilité statistique. Toute la stack qui suit existe pour **domestiquer cette variance sans la tuer**.

**Dossiers absorbés** : `anatomie` couche 00 (`livre-data.js` LAYERS[0]).

**Concepts qui s'approfondissent ailleurs** : `Température`, `Top-p`, `Softmax`, `Seed` → re-référencés en Acte II Ch. 4 (variance qui accumule à chaque tool call) et Acte IV Ch. 16 (trajectory drift en observabilité).

**Schéma** : `fig-01` anneau 00 (existant dans `anatomie/`). À garder tel quel — il sert de couverture conceptuelle au chapitre.

**Piège classique** : traiter le LLM comme une fonction pure. `T=0.7` rejoué 1000× = 1000 trajectoires.

---

#### Chapitre 2 — Les modèles de raisonnement et la seconde courbe de scaling

**Question** : Depuis o1, on dépense du compute **à l'inférence** pour chercher, vérifier, corriger. Qu'est-ce qui a changé exactement, et pourquoi un décideur doit-il s'en soucier ?

**Thèse** : La pensée est devenue un **programme stochastique outillé**. Le second axe de scaling (Snell et al.) déplace une partie du coût de l'entraînement vers l'inférence — ce qui réordonne entièrement les contrats vendor, les budgets, et la qualité accessible par cas d'usage.

**Dossiers absorbés** : `modeles-raisonnement/` (06 mai · #14). Concepts mobilisés : pivot o1 sept. 2024, RL sur récompense vérifiable (RLVR), GRPO, **« aha moment » R1**, interleaved thinking Claude 4.x, parallel thinking Gemini Deep Think.

**Approfondissement explicite** : le **piège de la fidélité de la chaîne de pensée** (Anthropic mars 2025 : Claude 3.7 fidèle 25 % du temps, R1 39 %). Repris en Acte IV Ch. 16 sous l'angle audit/observabilité.

**Redondance à dédupliquer** : la définition « inference-time compute » apparaît aussi dans `process-reward-models` et `decode-speculative`. **Définition canonique ici**, renvois ailleurs.

**Schémas à fusionner** :
- `modeles-raisonnement/images/...` schéma pivot o1 + schéma RLVR.
- À fusionner avec le schéma « second axe de scaling » de `economie-inference` (qui montre la même bascule sous l'angle coût) → **un seul schéma double-vue** « capability vs cost ».

**Piège classique** : router automatiquement vers un reasoning model pour gagner en qualité. Sur un cas conversationnel ouvert, ×10-×74 de coût (cf. `economie-inference` AIME) pour un gain marginal — voire négatif.

---

#### Chapitre 3 — La couche notateur cachée (Process Reward Models)

**Question** : Si on n'évalue plus juste le **résultat** mais chaque **étape** du raisonnement, qui annote, à quel coût, et qu'est-ce qu'on récompense vraiment ?

**Thèse** : Les PRM forment une **économie souterraine** de l'IA (marché annotation 2-4 Md $ en 2026) que personne ne voit. Et le reward hacking y est invisible : Anthropic/OpenAI 2025 mesurent **99 % d'exploitation des reward proxies vs 2 % de verbalisation** — l'agent ment sans le savoir.

**Dossiers absorbés** : `process-reward-models/` (13 mai · #18). De Lightman/PRM800K 2023 au pivot DeepSeek-R1 RLVR 2025, generative verifiers (GenRM/ThinkPRM, Zhang 2024, Khalifa 2025), 4 trajectoires 2027-2028 (RLVR généralisé / generative integré / PRM spécialisé / PRM-as-a-service).

**Approfondissement vs Ch. 2** : Ch. 2 dit *quoi* (un modèle qui pense), Ch. 3 dit *qui note* (la couche cachée) et *avec quels biais*.

**Schémas à fusionner** : `process-reward-models/images/...` (anatomie PRM) + le schéma `evaluation-agentique` sur LLM-as-judge → **comparatif unifié** PRM vs LLM-as-judge vs human eval (3 lignes, 5 colonnes : coût, scalabilité, biais, fidélité, cas d'usage).

**Piège classique** : adopter un PRM-as-a-service sans audit de la fonction de récompense. Le 99 %/2 % devient ton problème de prod sans qu'aucune métrique standard ne le signale.

---

#### Chapitre 4 — Décode spéculative et la course au token/sec

**Question** : Si le draft model accepte 80 % en code mais 45 % en créatif, à partir de quel batch et quel cas d'usage la spéc' devient-elle une perte nette ?

**Thèse** : La décode spéculative est **conditionnée au domaine et à la concurrence GPU**. En dessous de 30 % d'acceptance, perte nette ; au-dessus du batch ≈ 24, les schedulers hybrides changent de régime. Pas un free lunch.

**Dossiers absorbés** : `decode-speculative/` (22 mai · #25). Anatomie draft/target/verify, 4 familles (draft externe Leviathan/Chen, Medusa/Hydra, EAGLE 1/2/3, Lookahead Jacobi), théorème d'équivalence Leviathan 2022, interaction batching, matrice frameworks (vLLM 0.6, TRT-LLM 0.9 deux schedulers parallèles, SGLang speculation_threshold, DeepSpeed-MII).

**Approfondissement vs Ch. 2** : Ch. 2 explique *pourquoi* on a besoin de compute à l'inférence ; Ch. 4 explique *comment* on regagne le débit perdu.

**Schémas à fusionner** : matrice frameworks de `decode-speculative` + matrice frameworks d'`orchestration-agentique` (ADK ouverts vs vendeurs) **NE PAS fusionner** — elles couvrent deux couches différentes. À mettre **côte à côte** dans le chapitre avec une note méthodologique.

**Piège classique** : activer la spec partout. Sur un workload créatif batch faible, on **perd** 15-20 % de débit.

---

#### Chapitre 5 — L'économie unitaire de l'inférence (et son angle mort)

**Question** : Le prix d'1 M tokens a chuté ×1000 en 3 ans. Pourquoi ? Et pourquoi le décideur qui croit en bénéficier mécaniquement déchante-t-il sur les reasoning models ?

**Thèse** : LLMflation ≠ baisse uniforme. La chute vient d'une **pile logicielle à 7 couches** (PagedAttention, FlashAttention-3, batching continu, FP8/FP4, speculative decoding, désagrégation prefill/decode, MoE) qui multiplie le débit par GPU d'un ordre de grandeur. Mais les reasoning models ré-explosent le coût par tâche (10-74× sur AIME). Le décideur paie un *prix par token* qui baisse pendant que sa *facture par tâche* monte.

**Dossiers absorbés** : `economie-inference/` (05 mai · #13). Anatomie d'un appel, 7 couches d'optim, Splitwise/Mooncake, MoE vs dense (DeepSeek v3), comparatif H100/B200/MI300X/Trainium 2/Groq LPU, marges Together ~45 % / Fireworks ~50 %.

**Approfondissement vs Ch. 4** : Ch. 4 isole une couche d'optim ; Ch. 5 montre la **pile entière** et l'économie qui en résulte.

**Liaison avec Acte IV Ch. 19 (ROI)** et **Ch. 20 (frugalité)** : c'est le même triangle vu sous 3 angles : coût/token (Acte I), coût/cas d'usage (ROI), coût/externalité (frugalité).

**Schémas à fusionner** :
- Schéma 7 couches d'optim de `economie-inference` → **figure de référence** du livre, citée 3 fois.
- À compléter par un encadré « comparatif hardware 2026 » mis à jour (sortie B200 en cours).

**Piège classique** : signer un contrat 3 ans sur un prix/token sans clause de révision. Le mix prefill/decode change avec ton workload réel ; le vendeur a optimisé sa marge sur le profil qu'il anticipait.

---

#### Chapitre 6 (encart court) — Bordure : world models et physique apprise

**Question** : Si le LLM est un modèle du langage, qu'est-ce qu'un *world model* — et pourquoi est-ce que la question revient dans tous les pipelines de computer use ?

**Thèse** : Trois architectures concurrentes (JEPA latent, diffusion itérative, autoregressive) ; aucune n'a gagné. Pour le décideur 2026, c'est encore une bordure de recherche — sauf si le cas d'usage touche au pilotage écran ou à la robotique.

**Dossiers absorbés** : `world-models/` (05 mai). Court chapitre (~6 pages), positionné comme **encart** entre Acte I et Acte II. Renvoi explicite vers Acte III Ch. 12 (computer use).

---

### ACTE II — LA BOUCLE

> _Anneaux 01-04. C'est ici que se gagne ou se perd le ROI, et que se constitue la dette technique. Lecteur cible : agent engineer, tech lead, architecte._

#### Chapitre 7 — Reason · Act · Observe : le harness et ce qu'il enveloppe

**Question** : Qu'est-ce qui transforme un LLM bavard en agent capable d'enchaîner plusieurs tours sans se perdre ?

**Thèse** : Ce n'est pas le modèle, c'est le **harness** — le code qui gère `stop_reason`, tools, retries, budget de tours, compaction. Un POC sans harness défensif = un agent qui ne s'arrête jamais à 4 $/minute.

**Dossiers absorbés (gros chapitre charnière)** :
- `anatomie/` couche 01 (boucle ReAct) et 04 (patterns canoniques).
- `harness-agentique/` (29 avr · #04) — architecture GAN 3 agents, cartographie API/SDK/managed.
- `agent-sdk/` (18 mai · #22) — *bash is all you need*, gather/act/verify, hooks, skills, MCP, managed.
- `coding-agents/` (12 mai · #17) — instanciation sur Claude Code / Codex CLI / Copilot.

**Redondance massive à dédupliquer** :
- La boucle ReAct est décrite **5 fois** dans le corpus (anatomie, harness-agentique, agent-sdk, orchestration-agentique, coding-agents). **Une seule description canonique ici**, renvois ailleurs.
- Les 6 patterns canoniques Anthropic (Schluntz & Zhang dec 2024 : Augmented LLM, Prompt chaining, Routing, Parallelization, Orchestrator-workers, Evaluator-optimizer) apparaissent dans `anatomie`, `harness-agentique`, `orchestration-agentique`. → **Une seule taxonomie** au Ch. 7, étendue au Ch. 9 (multi-agent).

**Schémas à fusionner** :
- Schéma « boucle ReAct + stop_reason » → **un seul** schéma de référence (variante de `anatomie/` couche 01) ; les variantes spécifiques (harness GAN 3-agents, agent-sdk gather/act/verify) en figures dérivées avec citation explicite « variation sur la boucle de référence Ch. 7 ».
- Pyramide d'usage 4 étages de `coding-agents` (transverse / data quotidien / data expert / produit-décideurs) → garder telle quelle, c'est l'angle unique de ce dossier.

**Piège classique** : laisser tourner la boucle sans budget de tours. Un agent entre en loop infini ; la facture ne se réveille que le lundi matin.

---

#### Chapitre 8 — Les outils (les mains de l'agent)

**Question** : Quelles actions l'agent peut-il réellement exécuter, avec quels droits, sur quels systèmes — et qui porte le risque ?

**Thèse** : Le choix des outils exposés est **la décision d'architecture la plus chargée** de la stack. Function calling, code execution, web search, file ops : chaque tool ajouté élargit la surface d'attaque autant que la surface de valeur.

**Dossiers absorbés** : `anatomie` couche 02. Renvois forts vers Acte III (MCP) et Acte IV (sécurité).

**Concepts qui s'approfondissent** : `tool_use` (Anthropic), `function calling` (OpenAI), JSON Schema → étendu en Acte III Ch. 11 (MCP comme standardisation cross-vendor) et Acte IV Ch. 18 (tool poisoning).

**Piège classique** : `execute_sql` sans scoping ni sandbox. Une injection indirecte = exfiltration en 3 tours.

---

#### Chapitre 9 — Mémoire agentique : 4 piliers, 6 opérations, 5 architectures

**Question** : Comment un agent se souvient-il de la conversation d'hier, du projet en cours, du dernier résultat de son sous-agent — et où ça casse en prod ?

**Thèse** : La mémoire n'est pas **une** chose mais **quatre piliers** (travail / sémantique / épisodique / procédurale) avec **six opérations** (store, retrieve, forget, compose, rank, verify). Les 5 architectures prod (Letta, A-MEM, Zep, Mem0, file-based) instancient cette grille différemment — choisir, c'est arbitrer entre couplage et portabilité.

**Dossiers absorbés** : `memoire-agentique/` (30 avr · #07). Surface d'attaque MITRE ATLAS (renvoi Acte IV).

**Schémas** : grille 4 piliers × 5 architectures de `memoire-agentique` → schéma de référence du chapitre. Compléter par la matrice production de `compaction-agentique` (Ch. 10) en figure adjacente.

---

#### Chapitre 10 — Compaction et oubli stratégique

**Question** : Pourquoi 1 M tokens de fenêtre ne suffisent pas, et comment fait-on **oublier** un agent sans détruire sa cohérence ?

**Thèse** : *Lost in the Middle* (Liu TACL 2024, courbe en U) tient en 2026. La compaction est **mécanisme défaut** : 5 familles (summarization Claude Code `/compact` / eviction StreamingLLM-H2O-Quest / hiérarchique MemGPT-Letta / retrieval Mem0-Zep-A-MEM / compactors appris). Triangle **fidélité × coût × oubliabilité** : on ne maximise que deux sommets à la fois.

**Dossiers absorbés** : `compaction-agentique/` (27 mai · #27). Surface d'attaque cachée : memory poisoning persistant **SpAIware** (Beurer-Kellner & Tramèr 2024, Greshake AISEC 23) → injection paraphrasée promue au statut « volonté utilisateur » à travers la compaction. RGPD art. 17 + AI Act art. 10/25.

**Approfondissement vs Ch. 9** : Ch. 9 cartographie le stock, Ch. 10 cartographie l'éviction. **Strictement complémentaires**, à lire ensemble.

**Schémas à fusionner / créer** :
- Le « triangle fidélité × coût × oubliabilité » de `compaction-agentique` → schéma signature du chapitre.
- La surface d'attaque MITRE ATLAS de `memoire-agentique` + le vecteur SpAIware → **un schéma unifié de threat model mémoire** à placer entre Ch. 9 et Ch. 10, renvoyé en Acte IV Ch. 18.

**Piège classique** : faire confiance à `/compact` sur un agent à mémoire persistante sans signer les compactions. Une injection paraphrasée 3 mois en arrière reste active.

---

#### Chapitre 11 — Patterns canoniques et orchestration multi-agent

**Question** : Workflow simple, agent autonome, ou flotte d'agents — quelle topologie pour quelle tâche, et pourquoi le multi-agent peut coûter 10-15× plus cher ?

**Thèse** : **Start simple, measure, add complexity only when it delivers measurable value** (règle Schluntz/Zhang). 4 régimes de contrôle (code-driven workflow / LLM-driven routines+handoffs / graphe LangGraph / agent autonome) × 8 patterns canoniques (Anthropic 6 + supervisor-workers + hierarchical + peer-to-peer AutoGen). 70 % des cas se résolvent en workflow routé sans jamais mériter l'étiquette « agentique ».

**Dossiers absorbés** :
- `anatomie` couche 04 + l'essentiel d'`orchestration-agentique/` (27 mai · #28) — 8 patterns, stack ADK/runtime/produit, 5 problèmes durs prod, **arbre de décision buy/build**.
- `fabrique-agent/` (15 mai · #21) — 4 stades de maturité, 10 artefacts partagés (positionné en sous-chapitre « équipe »).

**Étude de cas centrale** : Klarna (67 % automatisé puis recul partiel sur les 5 % de cas charges émotionnellement). À utiliser **deux fois** dans le livre : ici comme illustration multi-agent, et en Acte IV Ch. 19 sur le ROI. Pas redondant — deux lectures complémentaires.

**Schémas à fusionner** :
- Les 8 patterns d'`orchestration-agentique` → schéma de référence du chapitre (le plus dense du livre).
- L'arbre de décision buy/build d'`orchestration-agentique` → annexe Acte IV (renvoyé depuis ici).
- Les 4 stades de maturité de `fabrique-agent` → schéma signature de la sous-section équipe.

**Piège classique** : sortir l'artillerie multi-agent pour un besoin qu'un workflow aurait résolu. 10-15× tokens, mois vs semaines de delivery, debug exponentiellement plus dur.

---

### ACTE III — LES INTERFACES

> _Anneau 05 + surfaces. C'est par là que l'utilisateur final touche l'agent — et que se décide la friction d'adoption. Lecteur cible : PM, designer, intégrateur, architecte plateforme._

#### Chapitre 12 — MCP, le HTTP des agents

**Question** : MCP a gagné par effet de réseau (97 M téléchargements/mois, 7500 serveurs, donation Linux Foundation) — pas par sa rigueur technique. Qu'est-ce que ça change pour le décideur qui standardise sa stack ?

**Thèse** : MCP est **devenu** le standard de facto agent↔outils, A2A le standard de facto agent↔agent (Google avr 2025 → LF juin 2025, 150+ orgs), AG-UI le standard de facto agent↔frontend (CopilotKit, 17 events). La trinité dessine l'**interopérabilité 2026-2027**. Refuser MCP en propriétaire, c'est s'enfermer dans sa chapelle ; l'adopter, c'est accepter une surface d'attaque non triviale (Ch. 13).

**Dossiers absorbés** : `mcp-plateforme/` (08 mai · #16). Genèse novembre 2024, pivot OpenAI mars 2025, donation LF décembre 2025, layering avec function calling / OpenAPI / A2A.

**Schémas** : layering MCP/FC/OpenAPI/A2A de `mcp-plateforme` → schéma de référence. Compléter par schéma trinité MCP×A2A×AG-UI de `surfaces-agentiques` (Ch. 14).

---

#### Chapitre 13 — Sécurité MCP : 10 vecteurs × 10 patterns

**Question** : Si l'agent peut appeler **n'importe quel** serveur MCP, qui valide qu'il ne se fait pas piéger par un outil empoisonné ou un namespace shadowed ?

**Thèse** : 6 trust boundaries, 4 familles d'attaques (tool poisoning / prompt injection cross-document / cross-server confusion / OAuth+supply chain), matrice défensive 10×10 avec **4 patterns load-bearing** : Sigstore + hash pinning, tool tagging, allowlist namespace, HITL writes. Le reste est cosmétique.

**Dossiers absorbés** : `mcp-securite/` (20 mai · #26). Roadmap 12 mois : AI Act art. 15 (août 2026), spec MCP v2 Sigstore (automne 2026), registries signés (janvier 2027), MCP × A2A (printemps 2027).

**Approfondissement vs Ch. 12** : Ch. 12 vend la promesse, Ch. 13 documente le coût. **Strictement complémentaires**, dyade unique.

**Schémas à fusionner** :
- Matrice défensive 10×10 de `mcp-securite` → schéma signature du chapitre.
- À mettre en regard de la matrice sécurité agent computer use (CVE-2025-55322, VPI) de `agents-computer-use` (Ch. 15) → **schéma de synthèse menaces 2026** unifié, renvoyé en Acte IV Ch. 18.

---

#### Chapitre 14 — Surfaces agentiques : 4 régimes d'accès

**Question** : Le chatbot est-il mort ? Et si non, à quel régime de prise l'utilisateur final accède-t-il vraiment ?

**Thèse** : Quatre régimes coexistent — chat / copilote inline / canvas génératif / on-behalf-of — chacun avec sa surface d'attention, sa friction, son contrat de confiance. Le « procès du chatbot » (Wattenberger, Appleton, Lee, Litt, Saarinen, Pike) sert de prologue. La trinité protocoles MCP × A2A × AG-UI sert de plomberie.

**Dossiers absorbés** : `surfaces-agentiques/` (18 mai · #23). Generative UI (v0, Claude Artifacts, OpenAI Canvas), on-behalf-of (Operator, Computer Use, Devin, Manus, Sierra, Agentforce, Vapi, Harvey), levels of autonomy (Knight Institute), patterns de confiance (Anthropic graduated trust, Salesforce trust layer), 5 couches d'architecture canonique, matrice de décision.

**Encart Knight levels of autonomy** : à reprendre **tel quel** comme grille de cadrage transverse au livre (renvoyée 4 fois : Ch. 11 orchestration, Ch. 14, Ch. 15 computer use, Ch. 21 governance).

---

#### Chapitre 15 — Computer use : le régime extrême

**Question** : Quand l'agent **pilote un écran** comme un humain, à quoi ressemble la boucle, à quoi ressemblent les benchmarks, et quelle surface d'attaque hérite-t-on ?

**Thèse** : Boucle observe·plan·ground·act·verify. Trois architectures concurrentes en 2026. Surface d'attaque inédite : **VPI** (Visual Prompt Injection) + CVE-2025-55322. Profil de latence dégradé. Marché 2026-2030 en repositionnement.

**Dossiers absorbés** : `agents-computer-use/` (02 mai · #09). OSWorld / WebArena / UI-CUBE comme benchmarks de référence — à mettre en regard du chapitre `benchmarks-contestes` (Ch. 17), qui montre comment ils sont contaminés.

---

#### Chapitre 16 — Analytics agentique : la stack data + IA en sectoriel régulé

**Question** : Quand l'agent **interroge la data warehouse**, où passe le pivot sémantique, et comment fait-on tenir l'AI Act + DORA + ACPR + souveraineté pour une banque tier 1 française ?

**Thèse** : Trois surfaces agentiques (Conversational Analytics / agents custom Vertex / MCP banque). **Le pivot sémantique** (Looker semantic vs dbt vs Cube) est le goulot d'étranglement. Section régu banque française : échéance 2 août 2026 AI Act, DORA, EBA, ACPR, BCBS 239, Assured Workloads S3NS Premi3NS SecNumCloud. Comparatif Snowflake Cortex / Databricks Genie / Microsoft Fabric.

**Dossiers absorbés** : `analytics-agentique-gcp/` (19 mai · #24). Cas instanciation **sectorielle** du livre. À traiter aussi comme **renvoi anticipé** vers Acte IV Ch. 21 (gouvernance).

**Encart** : `narrative-experiences/` (05 mai) en aparté de fin de chapitre — la « troisième voie » d'interaction (ni chat, ni copilote, ni canvas) — 4 pages d'horizon.

---

### ACTE IV — MESURES ET GARDE-FOUS

> _Anneaux 06-09. C'est ici que se gagne ou se perd la confiance du décideur — et qu'on sait **tuer** un cas d'usage au bon moment. Lecteur cible : décideur, sponsor, RSSI, DPO, FinOps, CDO, DPO._

#### Chapitre 17 — Évaluer un agent (et débunker les leaderboards)

**Question** : Comment passe-t-on du F1 classique aux trajectoires multi-tours — et pourquoi un score SWE-bench impressionnant ne survit pas à un audit d'entreprise ?

**Thèse** : Deux mouvements à tenir en même temps. (1) Construire son éval interne datée (gruyère 8 étapes : LLM-as-judge, τ-bench/τ²-bench, pass@k vs pass^k, OTel). (2) Refuser de signer sur les benchmarks publics : 4 vecteurs de contamination (chevauchement temporel / version-tag / harness gaming / prompt leakage), benchmark teams industrialisées (Anthropic, Magic, Cognition), contre-mouvement vivant (SWE-bench Live, SWE-Lancer, MLE-bench, ARC-AGI 2). **L'éval interne datée bat tous les scores publics.**

**Dossiers fusionnés (chapitre charnière)** :
- `evaluation-agentique/` (01 mai · #08) — taxonomie complète, **playbook gruyère 8 étapes** (schéma signature de l'Acte IV).
- `benchmarks-contestes/` (15 mai · #19) — démolition des leaderboards publics, framework décision 2×2 contrôlé × ponctuel pour acheteurs.

**Approfondissement** : `evaluation-agentique` construit, `benchmarks-contestes` détruit. Lus ensemble = grille d'achat complète.

**Schémas à fusionner** :
- Playbook gruyère 8 étapes d'`evaluation-agentique` → schéma signature du livre, cité 3× (ici, Ch. 18, Ch. 19).
- Matrice 4 vecteurs contamination de `benchmarks-contestes` → en regard, page facing.
- Le 2×2 contrôlé × ponctuel → annexe « grille d'achat ».

**Piège classique** : RFP qui demande SWE-bench > 60 %. C'est mesurer un proxy contaminé ; ce qu'il faut demander c'est l'**éval interne datée du fournisseur, sur ton corpus**.

---

#### Chapitre 18 — Observabilité agentique et cognitive audit trail

**Question** : L'agent ne crashe pas — il **dérive**. Comment voir sa trajectoire, ses coûts, sa qualité — et qui ça concerne légalement ?

**Thèse** : **OpenTelemetry GenAI Semantic Conventions** unifie en 2026. 6 piliers télémétrie. **Cognitive audit trail** (réponse à AI Act art. 12-13-15 + RGPD art. 22) = nouvelle catégorie de log avec rétention, signature, et droit d'accès. L'APM classique y est structurellement aveugle.

**Dossiers absorbés** : `observabilite-agents-ia/` (30 avr · #06). Vendor landscape (Langfuse, Braintrust, Arize, LangSmith, Dynatrace, AgentCore). Échelle de maturité.

**Approfondissement transverse** : la couche `gen_ai.compaction.*` (WG actif fin 2026, mentionné dans `compaction-agentique`) → à signaler ici comme front actif.

**Redondance à dédupliquer** : OTel GenAI mentionné dans **5 chapitres** (Ch. 1, 9, 10, 17, 18). **Définition canonique ici**, renvois ailleurs.

**Piège classique** : POC sans observabilité = dette technique massive le jour du passage en prod.

---

#### Chapitre 19 — Garde-fous, jailbreaking et sécurité globale

**Question** : 48 % des pros cyber placent l'agentique en top vecteur d'attaque 2026, 34 % seulement ont des contrôles dédiés — qu'est-ce qu'on met en place concrètement ?

**Thèse** : Trois mouvements convergents — (1) **Least agency** (OWASP ASI Top 10 décembre 2025), (2) **Asymétrie attaque/défense** (jailbreaking documenté depuis 2023), (3) **Patterns load-bearing** (Sigstore + hash pinning, tool tagging, allowlist namespace, HITL writes — déjà introduits Ch. 13).

**Dossiers fusionnés** :
- `anatomie` couche 06.
- `llm-jailbreaking/` (28 avr) — asymétrie attaque/défense, taxonomie d'attaques.
- Renvois vers Ch. 10 (memory poisoning SpAIware), Ch. 13 (MCP 10×10), Ch. 15 (computer use CVE).

**Schéma à créer** : **synthèse menaces 2026** unifiée (modèle / prompt / mémoire / outil / protocole / surface), agrégeant les figures dispersées dans `llm-jailbreaking`, `mcp-securite`, `compaction-agentique`, `agents-computer-use`, `memoire-agentique` (MITRE ATLAS). C'est le schéma transverse le plus utile du livre pour un RSSI.

**Piège classique** : agent admin sans HITL + injection indirecte = incident post-mortem que personne ne veut signer.

---

#### Chapitre 20 — Runtime managé et déploiement

**Question** : Vous opérez ces services au quotidien, ou le cloud le fait pour vous — et à quel prix de portabilité ?

**Thèse** : 2026 est l'année des runtimes managés (AWS Bedrock AgentCore GA oct. 2025 / Vertex AI Agent Engine / Azure AI Foundry Agent Service GA mai 2025 / Claude Managed Agents public beta avr 2026 / OpenAI Agent Builder). Pricing consumption-based, attente I/O souvent gratuite, sandbox isolée. Le gain est réel ; la dépendance aussi. **Code-first + protocoles ouverts** (MCP, A2A) = meilleure assurance anti-lock-in.

**Dossiers absorbés** : `anatomie` couche 08. Sous-chapitres d'`orchestration-agentique` sur runtime + d'`agent-sdk` sur managed agents.

---

#### Chapitre 21 — Mesurer le ROI (et le paradoxe agentique)

**Question** : Comment passe-t-on de « token → tâche → processus → outcome » sans confondre 4 unités de mesure incompatibles ? Et pourquoi Klarna a-t-elle reculé après avoir automatisé 67 % du support ?

**Thèse** : 5 frameworks lus côte à côte (Cigref, McKinsey, BCG, MIT NANDA, Forrester TEI). Grille analytique propriétaire à 5 axes. **Hard vs soft savings**. **Productivity J-curve** (Brynjolfsson). Arbre de décision sur 8 méthodes de calcul. **Paradoxe agentique** = changement d'unité de mesure à mesure que l'agent monte la pile de valeur. Klarna : 67 % automatisé puis recul partiel sur les 5 % de cas charge émotionnelle. Études empiriques : Brynjolfsson, Copilot, jagged frontier, METR.

**Dossiers absorbés** : `measure-roi/` (07 mai · #15). Pièges et checklist en 7 questions.

**Schémas à fusionner** :
- Productivity J-curve de `measure-roi` → schéma signature du chapitre, à mettre en regard de la « courbe LLMflation » de `economie-inference` (Ch. 5) → **double-page éco** : prix qui baisse (token) vs valeur qui monte lentement (outcome).

**Approfondissement vs Ch. 5** : Ch. 5 mesurait le coût par token ; Ch. 21 mesure la valeur par outcome. Même triangle, deux faces.

**Piège classique** : RFP au token. Une fois le contrat signé, le vendeur optimise le profil qui maximise sa marge, pas ton outcome.

---

#### Chapitre 22 — Externalité énergétique : IA frugale

**Question** : Une requête, c'est 0,3 Wh ou 3 Wh ? Une vidéo générée, c'est 50 Wh ou 1000 Wh ? Et le paradoxe de Jevons (Google +48 %, DeepSeek-V3) annule-t-il les gains d'efficience ?

**Thèse** : L'arithmétique honnête (Epoch 2025 0,3 Wh ; raisonnement 5-20 Wh ; image 2-4 Wh ; vidéo 50-1000 Wh) est la base. Eau scope 1/2/3 (cooling Microsoft 0,30 L/kWh ; scope 2 thermique 1,8-7,5 L/kWh ; TSMC 200 M L/jour). Électricité mondiale (AIE 485 TWh 2025 → 945 TWh 2030 ; LBNL 176 → 325-580 TWh US ; rush nucléaire Microsoft Three Mile Island, Amazon Susquehanna, Google Kairos, Meta Vistra). Embodied carbon H100 (1312 kg CO₂eq baseboard, 164 kg/carte). Leviers structurels (MoE / distillation / SLM / geo-aware / nucléaire dédié / pré-KV cache routing). **3 trajectoires 2030** : laissez-faire 1500 TWh / efficience seule 1100 / plafond 650.

**Dossiers absorbés** : `ia-frugale/` (13 mai · #20). Frameworks de mesure (ML CO2 Impact, Green Algorithms, MLCO2, ISO/IEC 21031, méthodologie AIE 2026, EU Code of Conduct datacenters).

**Approfondissement vs Ch. 5 et 21** : Ch. 5 coût direct, Ch. 21 ROI métier, Ch. 22 externalité. **Trois lectures complémentaires d'une même facture**.

**Schémas à fusionner** :
- 3 trajectoires 2030 de `ia-frugale` → schéma signature du chapitre.
- À mettre en regard de la « pile 7 couches » d'`economie-inference` (Ch. 5) → on voit que les mêmes leviers (MoE, KV cache, distillation) jouent sur les 3 axes.

---

#### Chapitre 23 — Gouvernance : AI Act, banque, machine unlearning

**Question** : Quelles sont les obligations réelles en 2026 pour qui déploie un agent — et pourquoi les calendriers (AI Act art. 12 août 2026, art. 15 août 2026, GPAI documentation, DORA, AAIF) convergent-ils sur les 12 prochains mois ?

**Thèse** : Le calendrier réglementaire se compresse. AI Act art. 12 (transparence GPAI) août 2026, art. 15 (cybersécurité haute risque) août 2026, art. 10 + art. 25 (data governance, transparence) déjà en vigueur. Pour la banque française : DORA + EBA + ACPR + BCBS 239 + souveraineté. **Machine unlearning** (CNIL, EDPS guidelines 2025-2026, retraining-free unlearning papers 2025) émerge comme réponse opérationnelle à RGPD art. 17.

**Dossiers absorbés** :
- `gouvernance/` (21 avr) — scrolly AI Act.
- Rappels d'`analytics-agentique-gcp` (banque), `compaction-agentique` (RGPD art. 17, AI Act art. 10/25, machine unlearning), `mcp-securite` (AI Act art. 15).

**Encart « rôle DPO/RSSI/Sponsor »** : pour chaque obligation, quel rôle porte la signature.

---

#### Chapitre 24 — Société : IA et travail

**Question** : Frey & Osborne 2013 vs Acemoglu 2024 vs Eloundou 2023 vs FMI 2024 — quel cadre choisir pour estimer l'impact emploi, et qu'est-ce que la « pause d'Engels » (Allen 2009) suggère du calendrier ?

**Thèse** : La littérature converge sur une **incertitude structurée**. Cadres : Acemoglu (substitution vs complémentarité), Frey-Osborne (probabilité d'automatisation), Eloundou/OpenAI (exposure), Goldman/McKinsey/FMI (taille d'impact macro), Aghion-Benhamou (productivité longue durée). **4 scénarios 2035** : adoption rapide+inégale / adoption progressive / plafond technique / disruption AGI. **6 leviers anti-catastrophe** (formation, redistribution, droit du travail, négociation collective, public option, transition juste).

**Dossiers absorbés** : `ia-et-travail/` (06 mai · #10).

**Encart** : la pause d'Engels (1830-1860) comme analogie historique pour le calendrier de redistribution. Allen 2009.

---

#### Chapitre 25 — Politique : procès Musk v. Altman

**Question** : Qui contrôle la frontière entre safety narrative et marché ouvert — et que dit le procès de Musk v. Altman du contrat moral des labs frontière ?

**Thèse** : Le procès (Oakland, mai 2026) cristallise trois positions doctrinales incompatibles : (1) safety hard, (2) scaling efficient, (3) governance-as-service. Le verdict mi-mai 2026 fixe un précédent sur la gouvernance des labs frontière.

**Dossiers absorbés** : `proces-musk-altman/` (27 avr · #03). Chronologie tri-pistes, anatomie juridique, témoins, écosystème financier, application compagnon 52 régions + journal quotidien.

**Encart** : ce dossier est le seul **veille en temps réel** du livre (journal quotidien). Le chapitre du livre fige une lecture au 27 mai 2026, le journal en ligne reste source de profondeur.

---

### ÉPILOGUE — Sept paris à dater 2027-2028

**Question** : Si on devait dater 7 inflexions probables, lesquelles, et pourquoi sont-elles toutes corrélées ?

1. **Compactors RL appris** (suite naturelle compaction-agentique) — 2027.
2. **PRM-as-a-service** (process-reward-models trajectoire 4) — 2027.
3. **MCP v2 Sigstore + registries signés** (mcp-securite roadmap) — automne 2026 / janvier 2027.
4. **AAIF gouvernance neutre** (Linux Foundation) — printemps 2027.
5. **AI Act art. 15 + premiers contrôles organismes notifiés** — août 2026 + été 2026.
6. **A2A × MCP convergence** (orchestration-agentique horizon) — printemps 2027.
7. **Frontier model evals AISI/NIST publiées** — fin 2026.

Chaque pari est documenté dans le dossier source (avec date d'observation), avec un encadré « ce que je verrai en premier si j'avais tort ».

---

## 4. Annexes

### Annexe A — Schémas à fusionner (synthèse tabulaire)

| # | Schéma final (à produire) | Chapitre | Schémas source à fusionner / aligner | Note |
| --- | --- | --- | --- | --- |
| A1 | Boucle Reason · Act · Observe canonique + variantes | Ch. 7 | `anatomie/` 01, `harness-agentique/` (GAN 3 agents), `agent-sdk/` (gather/act/verify), `coding-agents/` | Une seule référence ; les variantes en figures dérivées avec citation. |
| A2 | Capability vs Cost — second axe de scaling | Ch. 2/5 | `modeles-raisonnement/` (pivot o1) + `economie-inference/` (LLMflation) | Double-vue capability/cost sur même axe temps. |
| A3 | 8 patterns canoniques d'orchestration | Ch. 11 | `orchestration-agentique/` (8 patterns) + `anatomie/` couche 04 (6 patterns Anthropic) | Garder le 8 (orchestration), souligner les 6 Anthropic en sous-encart. |
| A4 | Threat model unifié 2026 | Ch. 19 (+ renvois Ch. 10, 13, 15) | `mcp-securite/` (10×10), `llm-jailbreaking/`, `compaction-agentique/` (SpAIware), `agents-computer-use/` (CVE/VPI), `memoire-agentique/` (MITRE ATLAS) | Schéma signature pour RSSI. À créer (n'existe pas dans le corpus actuel). |
| A5 | Triangle fidélité × coût × oubliabilité | Ch. 10 | `compaction-agentique/` (existant) | Tel quel, schéma signature. |
| A6 | Pile 7 couches d'optimisation inference | Ch. 5 | `economie-inference/` (existant) | Tel quel ; à citer en Ch. 22 sur les leviers frugaux. |
| A7 | Playbook gruyère 8 étapes | Ch. 17 (+ Ch. 18, 19) | `evaluation-agentique/` `fig-10` (vérifier slug exact) | Schéma signature de l'Acte IV. |
| A8 | 4 vecteurs de contamination benchmarks | Ch. 17 | `benchmarks-contestes/` (existant) | En regard du gruyère. |
| A9 | Productivity J-curve vs LLMflation | Ch. 21 | `measure-roi/` + `economie-inference/` | Double-page « facture qui baisse vs valeur qui monte lentement ». |
| A10 | 3 trajectoires énergétiques 2030 | Ch. 22 | `ia-frugale/` (existant) | Tel quel ; à mettre en regard de A6. |
| A11 | 4 régimes d'accès + levels of autonomy Knight | Ch. 14 (+ renvois Ch. 11, 15, 23) | `surfaces-agentiques/` | Grille de cadrage transverse. |
| A12 | Trinité protocoles MCP × A2A × AG-UI | Ch. 12 | `surfaces-agentiques/` + `mcp-plateforme/` | À unifier en un schéma de référence. |
| A13 | 4 piliers mémoire × 5 architectures prod | Ch. 9 | `memoire-agentique/` (existant) + matrice prod `compaction-agentique/` | Page facing. |
| A14 | Comparatif PRM vs LLM-as-judge vs human eval | Ch. 3 | À créer à partir de `process-reward-models/` + `evaluation-agentique/` | 3 lignes × 5 colonnes (coût, scalabilité, biais, fidélité, cas d'usage). |
| A15 | 4 stades de maturité fabrique agent | Ch. 11 (sous-section équipe) | `fabrique-agent/` | Tel quel. |
| A16 | Arbre de décision buy/build agent | Annexe (renvoi Ch. 11) | `orchestration-agentique/` | Annexe consultative. |

### Annexe B — Glossaire (extension de `livre-data.js CONCEPT_DEFS`)

Reprendre intégralement le `CONCEPT_DEFS` d'`anatomie/livre-data.js` (~50 entrées en 10 catégories : LLM core, Loop, Tools, Context, Patterns, Protocoles, Guardrails, Observability, Runtime, Governance).

Ajouter ~30 entrées issues des dossiers spécialisés non couverts par le livre `anatomie/` :

- **Acte I** (moteurs) : `RLVR`, `GRPO`, `aha moment`, `interleaved thinking`, `parallel thinking`, `process reward model`, `PRM800K`, `GenRM`, `ThinkPRM`, `reward hacking`, `MCTS annotation`, `draft model`, `target model`, `verifier`, `acceptance rate`, `Medusa`, `EAGLE`, `Lookahead decoding`, `PagedAttention`, `FlashAttention-3`, `batching continu`, `FP8/FP4`, `Splitwise`, `Mooncake`, `MoE routing`, `LLMflation`.
- **Acte II** (boucle) : `gather/act/verify`, `bash is all you need`, `permission_mode`, `hooks`, `skills`, `slash commands`, `subagents`, `headless mode`, `Knight levels of autonomy`, `graduated trust`, `compaction summarization`, `eviction StreamingLLM`, `H2O`, `Quest`, `MemGPT paging`, `Letta`, `Mem0`, `Zep`, `A-MEM`, `Goldfish loss`, `SpAIware`.
- **Acte III** (interfaces) : `AG-UI 17 events`, `Agent Card`, `on-behalf-of`, `Operator`, `Computer Use`, `Devin`, `Manus`, `Sierra`, `VPI`, `tool poisoning`, `cross-server confusion`, `Sigstore`, `hash pinning`, `tool tagging`, `allowlist namespace`, `OAuth DCR`, `MCP-UI`.
- **Acte IV** (mesures) : `gruyère playbook`, `pass@k vs pass^k`, `τ-bench`, `τ²-bench`, `SWE-bench Live`, `MLE-bench`, `ARC-AGI 2`, `benchmark teams`, `cognitive audit trail`, `OTel GenAI semconv`, `productivity J-curve`, `paradoxe agentique`, `hard vs soft savings`, `Klarna paradox`, `kWh/token`, `gCO₂eq`, `WUE/PUE`, `embodied carbon`, `Jevons paradox`, `machine unlearning`, `pause d'Engels`, `AAIF`.

### Annexe C — Index des dossiers source (chronologique)

Liste des 28 dossiers avec : date publication, numéro #, slug, URL `mathieugug.github.io/<slug>/`, chapitre·s du livre où ils sont absorbés. À générer automatiquement depuis `index.html` (regex `<a class="serie">`).

### Annexe D — Index des rôles

Reprendre `ROLE_DEFS` d'`anatomie/livre-data.js` (28 rôles : ML Engineer, Agent Engineer, RSSI, DPO, FinOps, etc.). Ajouter pour chaque rôle : **chapitres prioritaires** (parcours de lecture orienté rôle).

Exemple :
- **RSSI** → Ch. 13, 19 (priorité), Ch. 10, 15, 23 (compléments).
- **FinOps** → Ch. 5, 21, 22 (priorité), Ch. 20 (compléments).
- **DPO** → Ch. 10, 23 (priorité), Ch. 18 (cognitive audit trail).
- **CDO / Sponsor** → Prologue, Ch. 11, 21, 23, 24, 25 (priorité).
- **Agent Engineer** → Acte II en entier (Ch. 7-11), Ch. 13, 18 (compléments).

---

## 5. Risques d'écriture identifiés

À garder en tête pendant la rédaction du manuscrit :

1. **Sur-redondance Acte II** : les patterns canoniques Anthropic sont décrits 5 fois dans le corpus, le risque c'est de les redécrire 2 fois dans le livre. Discipline : une seule définition Ch. 7, renvois ailleurs.
2. **Sous-représentation contreforts** : `world-models`, `narrative-experiences`, `proces-musk-altman` peuvent être noyés. Choix éditorial assumé : ils restent en **encarts** (Ch. 6, fin Ch. 16, Ch. 25), pas en chapitres dédiés sauf le procès qui a son chapitre.
3. **Dossiers évolutifs** : `proces-musk-altman` (journal vivant), `compaction-agentique` (compactors RL en cours), `mcp-securite` (roadmap 12 mois) — risque d'obsolescence à l'impression. Solution : encadré « état au 27 mai 2026 » sur ces chapitres, avec renvoi URL vers la version vivante.
4. **Schéma A4 (threat model unifié) à créer** — n'existe pas encore dans le corpus. C'est un livrable supplémentaire à produire avant impression.
5. **Niveau d'entrée Acte I** : trop technique pour un décideur pur. Solution : encadré « TL;DR décideur » de 5 lignes en ouverture de chaque chapitre Acte I, qui résume l'enjeu business sans terminologie.
6. **Tonalité Lincoln** : aucune mention Lincoln dans les chapitres, sources de schémas ou en-têtes. Footer/colophon uniquement, en accord avec CLAUDE.md.

---

## 6. Prochain pas (suggestion)

1. **Valider la structure 4-actes + 25 chapitres**. Si ajustement (fusionner/séparer un chapitre), corriger l'outline avant de partir en rédaction.
2. **Acter la liste des schémas A1-A16** : lesquels sont à reprendre tels quels, lesquels à fusionner, lesquels à créer. Le schéma **A4 (threat model unifié)** est probablement le plus coûteux à produire et le plus utile au lecteur RSSI.
3. **Choisir le format de sortie** : livre print PDF (style `anatomie/livre-print.html`), livre web interactif (style `anatomie/livre.html` avec navigation au clavier), ou les deux. Implique un budget de mise en page différent.
4. **Décider du calendrier de gel des contenus évolutifs** (procès, MCP v2, AI Act art. 15) — date d'arrêt-image dans le manuscrit, avec renvoi URL pour le vivant.
