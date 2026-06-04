# Livre — outline de travail

_Document de travail pour la mise en livre des 28 dossiers du site. Destiné aux experts data et aux décideurs. Pédagogue, problématisé, dense. Signale explicitement les redondances, les concepts qui s'approfondissent d'un dossier à l'autre, les schémas à fusionner._

> **Date** : 2026-05-27 · **Branche** : `claude/book-outline-concepts-2mRuR` · **Statut** : v0 — outline soumis pour discussion. Ce n'est pas le manuscrit, c'est la carte de bataille.
>
> **Révision 2026-06-04** : structure portée de 25 à **27 chapitres**. Deux chapitres ajoutés — **ch. 12 « Construire la boucle : SDK, ADK et frameworks d'agents »** (clôture de l'Acte II ; absorbe `agent-sdk` + la couche ADK d'`orchestration-agentique`, jusque-là noyés au Ch. 7/Ch. 11 → cf. Friction 1 §4.2, tranchée par promotion) et **ch. 14 « Assistants de code »** (Acte III ; promotion de `coding-agents`, instanciation du régime copilote/CLI). **Acte III réordonné** : surfaces (13) → assistants de code (14) → MCP (15) → sécurité MCP (16) → computer use (17) → analytics (18). Tous les numéros de chapitre 12→25 ont glissé (12→15, 13→16, 14→13, 15→17, 16→18, 17-25 → 19-27). Les blocs de specs §3 ci-dessous ont des titres renumérotés mais restent dans leur ordre de rédaction d'origine (à réordonner physiquement plus tard si besoin).

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

### 0.4 Type et calibrage des schémas

**Principe directeur** : toute thèse importante du livre est reprise visuellement quelque part — pas de mur de texte sans appui graphique. Le corpus du site fournit déjà ~200 schémas SVG ; le livre s'appuie dessus massivement après **audit + fusion**.

Trois registres de schémas dans le livre :

| Catégorie | Format | Rôle | Quantité estimée |
| --- | --- | --- | --- |
| **Schémas au fil du texte (S)** | Variable : inline ½-page, pleine page, ou bandeau ¼ de page selon densité. Tous formats portrait. | Visualisent **les thèses au moment où elles tombent**. Repris des dossiers source avec recadrage léger ; certains fusionnent 2-3 figures voisines. C'est le gros du volume graphique. | ~60-90 (à déterminer par l'audit, cf. ci-dessous) |
| **Récap chapitre (R)** | A4 portrait (210×297 mm) en page de droite finale du chapitre, ou A3 paysage double-page (420×297 mm) quand le schéma est dense (matrices, taxonomies à plus de 6 entrées) | Un par chapitre standard + charnière — synthèse mentale. Le lecteur qui ne mémorise que cette page doit avoir la grille du chapitre. | ~19 |
| **Essentiels transverses (E)** | A3 paysage double-page (sauf 1 cas portrait) | À connaître à tout prix, cités 2 à 4 fois dans le livre. Réunis dans un cahier central « 6 schémas pour tout retenir » qui peut être détaché / affiché. | ~6 |

**Démarche : audit puis fusion**.

1. **Audit** des ~200 schémas existants (passe par dossier) : pour chaque schéma, on tague (a) le chapitre du livre où il s'insère, (b) sa catégorie cible (S / R / E / écarté), (c) le statut (tel quel / recadrer / fusionner avec X / refaire). Livrable : un index CSV `audit-schemas.csv` à la racine de `docs/` avec colonnes `dossier, fig_id, titre, chapitre, categorie, statut, notes`.
2. **Fusion** : passe par chapitre où on identifie les doublons (ex. boucle ReAct illustrée dans 5 dossiers → on garde 1 référence canonique + 3 variantes en encarts latéraux). La fusion est ce qui produit les schémas R et E listés en annexe A.
3. **Sélection finale** : les schémas S restants après audit/fusion sont intégrés au fil du texte ; ceux qui n'ont pas trouvé leur place restent **en ligne** sur leur dossier d'origine (le livre n'est pas une encyclopédie, c'est une carte).

**Règle de fabrication** :
- Toute infographie A3 doit pouvoir s'imprimer A4 par moitié sans perte critique (pour les versions de poche). Conséquence : pas de typographie sous 9 pt sur la maquette A3, pas d'élément critique qui chevauche le pli central.
- Schémas S au fil du texte : largeur max 145 mm (zone de texte A4), hauteur libre, légende encadrée sous le schéma avec renvoi vers la source dossier.
- Encres : palette du site (`--bg #faf6ec`, `--accent #b8582e`, `--carmine`, `--teal`, neutres) ; pas de gradient ; pas d'image bitmap.
- Anchors `fig-NN` zero-padded (cohérent avec le repo) + caption avec lien direct depuis le livre web.
- Source-de-vérité SVG dans le repo, export PDF/PNG haute résolution pour l'impression.

### 0.5 Gabarits de longueur

Trois gabarits d'écriture, à signaler en tête de chaque chapitre dans le manuscrit :

| Gabarit | Pages cibles | Compte de mots | Usage |
| --- | --- | --- | --- |
| **Court / encart** | 8-12 | 2 500-4 000 | Bordures, contreforts, ouvertures. Ch. 1, 6, 8, 18-encart, 20, 25-encart, 26-narrative. |
| **Standard** | 16-24 | 5 000-8 000 | La majorité des chapitres. Une thèse, 3-4 sections, 1 récap. |
| **Charnière** | 28-40 | 10 000-14 000 | Chapitres-pivots qui fusionnent 3+ dossiers. Ch. 7 (boucle), 11 (orchestration), 17 (éval+benchmarks), 21 (ROI). |

Total visé : ~440 pages corps + ~40 pages annexes = **~480 pages**. C'est un livre dense d'expert, pas un livre de transition.

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

## 2. Le squelette — 4 actes, 25 chapitres

Vue d'avion. Le détail chapitre par chapitre suit en §3.

| Acte | Titre travail | Anneaux anatomie absorbés | Dossiers fusionnés | Cible lecteur |
| --- | --- | --- | --- | --- |
| **Prologue** | Pourquoi un livre, maintenant | — | (méta) | tout le monde |
| **Acte I** | Les moteurs | 00 LLM core | `anatomie` (00), `modeles-raisonnement`, `process-reward-models`, `decode-speculative`, `economie-inference`, (`world-models` en horizon) | expert data, FinOps, achats infra |
| **Acte II** | La boucle | 01-04 (boucle, outils, contexte, patterns) + ADK | `anatomie` (01-04), `harness-agentique`, `memoire-agentique`, `compaction-agentique`, `orchestration-agentique` (patterns), puis **ch. 12** : `agent-sdk` + `orchestration-agentique` (couche ADK) | agent engineer, tech lead, architecte |
| **Acte III** | Les interfaces | 05 protocoles + surfaces | `anatomie` (05), `surfaces-agentiques`, **ch. 14** : `coding-agents`, `mcp-plateforme`, `mcp-securite`, `agents-computer-use`, `analytics-agentique-gcp`, (`narrative-experiences`) | PM, designer, intégrateur, architecte plateforme, développeur |
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

**Concepts qui s'approfondissent ailleurs** : `Température`, `Top-p`, `Softmax`, `Seed` → re-référencés en Acte II Ch. 4 (variance qui accumule à chaque tool call) et Acte IV Ch. 18 (trajectory drift en observabilité).

**Schéma** : `fig-01` anneau 00 (existant dans `anatomie/`). À garder tel quel — il sert de couverture conceptuelle au chapitre.

**Piège classique** : traiter le LLM comme une fonction pure. `T=0.7` rejoué 1000× = 1000 trajectoires.

---

#### Chapitre 2 — Les modèles de raisonnement et la seconde courbe de scaling

**Question** : Depuis o1, on dépense du compute **à l'inférence** pour chercher, vérifier, corriger. Qu'est-ce qui a changé exactement, et pourquoi un décideur doit-il s'en soucier ?

**Thèse** : La pensée est devenue un **programme stochastique outillé**. Le second axe de scaling (Snell et al.) déplace une partie du coût de l'entraînement vers l'inférence — ce qui réordonne entièrement les contrats vendor, les budgets, et la qualité accessible par cas d'usage.

**Dossiers absorbés** : `modeles-raisonnement/` (06 mai · #14). Concepts mobilisés : pivot o1 sept. 2024, RL sur récompense vérifiable (RLVR), GRPO, **« aha moment » R1**, interleaved thinking Claude 4.x, parallel thinking Gemini Deep Think.

**Approfondissement explicite** : le **piège de la fidélité de la chaîne de pensée** (Anthropic mars 2025 : Claude 3.7 fidèle 25 % du temps, R1 39 %). Repris en Acte IV Ch. 18 sous l'angle audit/observabilité.

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

**Liaison avec Acte IV Ch. 21 (ROI)** et **Ch. 22 (frugalité)** : c'est le même triangle vu sous 3 angles : coût/token (Acte I), coût/cas d'usage (ROI), coût/externalité (frugalité).

**Schémas à fusionner** :
- Schéma 7 couches d'optim de `economie-inference` → **figure de référence** du livre, citée 3 fois.
- À compléter par un encadré « comparatif hardware 2026 » mis à jour (sortie B200 en cours).

**Piège classique** : signer un contrat 3 ans sur un prix/token sans clause de révision. Le mix prefill/decode change avec ton workload réel ; le vendeur a optimisé sa marge sur le profil qu'il anticipait.

---

#### Chapitre 6 (encart court) — Bordure : world models et physique apprise

**Question** : Si le LLM est un modèle du langage, qu'est-ce qu'un *world model* — et pourquoi est-ce que la question revient dans tous les pipelines de computer use ?

**Thèse** : Trois architectures concurrentes (JEPA latent, diffusion itérative, autoregressive) ; aucune n'a gagné. Pour le décideur 2026, c'est encore une bordure de recherche — sauf si le cas d'usage touche au pilotage écran ou à la robotique.

**Dossiers absorbés** : `world-models/` (05 mai). Court chapitre (~6 pages), positionné comme **encart** entre Acte I et Acte II. Renvoi explicite vers Acte III Ch. 15 (computer use).

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

**Concepts qui s'approfondissent** : `tool_use` (Anthropic), `function calling` (OpenAI), JSON Schema → étendu en Acte III Ch. 11 (MCP comme standardisation cross-vendor) et Acte IV Ch. 20 (tool poisoning).

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
- La surface d'attaque MITRE ATLAS de `memoire-agentique` + le vecteur SpAIware → **un schéma unifié de threat model mémoire** à placer entre Ch. 9 et Ch. 10, renvoyé en Acte IV Ch. 20.

**Piège classique** : faire confiance à `/compact` sur un agent à mémoire persistante sans signer les compactions. Une injection paraphrasée 3 mois en arrière reste active.

---

#### Chapitre 11 — Patterns canoniques et orchestration multi-agent

**Question** : Workflow simple, agent autonome, ou flotte d'agents — quelle topologie pour quelle tâche, et pourquoi le multi-agent peut coûter 10-15× plus cher ?

**Thèse** : **Start simple, measure, add complexity only when it delivers measurable value** (règle Schluntz/Zhang). 4 régimes de contrôle (code-driven workflow / LLM-driven routines+handoffs / graphe LangGraph / agent autonome) × 8 patterns canoniques (Anthropic 6 + supervisor-workers + hierarchical + peer-to-peer AutoGen). 70 % des cas se résolvent en workflow routé sans jamais mériter l'étiquette « agentique ».

**Dossiers absorbés** :
- `anatomie` couche 04 + l'essentiel d'`orchestration-agentique/` (27 mai · #28) — 8 patterns, stack ADK/runtime/produit, 5 problèmes durs prod, **arbre de décision buy/build**.
- `fabrique-agent/` (15 mai · #21) — 4 stades de maturité, 10 artefacts partagés (positionné en sous-chapitre « équipe »).

**Étude de cas centrale** : Klarna (67 % automatisé puis recul partiel sur les 5 % de cas charges émotionnellement). À utiliser **deux fois** dans le livre : ici comme illustration multi-agent, et en Acte IV Ch. 21 sur le ROI. Pas redondant — deux lectures complémentaires.

**Schémas à fusionner** :
- Les 8 patterns d'`orchestration-agentique` → schéma de référence du chapitre (le plus dense du livre).
- L'arbre de décision buy/build d'`orchestration-agentique` → annexe Acte IV (renvoyé depuis ici).
- Les 4 stades de maturité de `fabrique-agent` → schéma signature de la sous-section équipe.

**Piège classique** : sortir l'artillerie multi-agent pour un besoin qu'un workflow aurait résolu. 10-15× tokens, mois vs semaines de delivery, debug exponentiellement plus dur.

---

#### Chapitre 12 — Construire la boucle : SDK, ADK et frameworks d'agents

**Question** : Si la boucle Reason · Act · Observe est partout la même, pourquoi une dizaine de frameworks pour l'écrire — et comment choisir sans se tromper de couche ?

**Thèse** : Le choix d'un kit n'est pas un choix d'abstraction (elles convergent toutes vers `Agent` + `tools` + `handoffs`) mais un pari sur un **socle** (modèle, cloud, runtime). Le produit et le SDK sont deux enveloppes du même harness ; le code spécifique tient en ~50 lignes ; *bash is all you need* ; et il faut séparer strictement **ADK** (forme dans le code) / **runtime** (où ça tourne) / **services de plateforme** (mémoire, identité, gateway).

**Dossiers absorbés** : `agent-sdk/` (18 mai · #22) — Claude Code vs Agent SDK, 3 voies, tools/bash/codegen, gather/act/verify, sécurité 3 couches ; `orchestration-agentique/` (27 mai · #28) couche **ADK** (stack 3 couches + cartographie LangGraph/CrewAI/OpenAI Agents SDK/Claude Agent SDK/Google ADK/Microsoft Agent Framework).

**Frontières éditoriales** : la boucle *conceptuelle* reste au Ch. 7 ; les *topologies multi-agents* et le buy/build restent au Ch. 11 ; le *runtime managé* et le déploiement restent au Ch. 22 ; le *catalogue d'outils* reste au Ch. 8. Ici uniquement : le geste de construction d'un agent unique.

**Schémas réutilisés** : `agent-sdk` 03-cc-vs-sdk, 04-trois-voies, 07-matrice-tools-bash-codegen, 08-agent-loop, 09-securite-couches ; `orchestration` 05-stack-trois-couches, 06-cartographie-2026.

**Piège classique** : choisir son framework par comparaison d'abstractions. On choisit un socle (modèle/cloud/runtime), pas une API — et on le regrette quand on a choisi l'API.

---

### ACTE III — LES INTERFACES

> _Anneau 05 + surfaces. C'est par là que l'utilisateur final touche l'agent — et que se décide la friction d'adoption. Lecteur cible : PM, designer, intégrateur, architecte plateforme._

#### Chapitre 15 — MCP, le HTTP des agents

**Question** : MCP a gagné par effet de réseau (97 M téléchargements/mois, 7500 serveurs, donation Linux Foundation) — pas par sa rigueur technique. Qu'est-ce que ça change pour le décideur qui standardise sa stack ?

**Thèse** : MCP est **devenu** le standard de facto agent↔outils, A2A le standard de facto agent↔agent (Google avr 2025 → LF juin 2025, 150+ orgs), AG-UI le standard de facto agent↔frontend (CopilotKit, 17 events). La trinité dessine l'**interopérabilité 2026-2027**. Refuser MCP en propriétaire, c'est s'enfermer dans sa chapelle ; l'adopter, c'est accepter une surface d'attaque non triviale (Ch. 16).

**Dossiers absorbés** : `mcp-plateforme/` (08 mai · #16). Genèse novembre 2024, pivot OpenAI mars 2025, donation LF décembre 2025, layering avec function calling / OpenAPI / A2A.

**Schémas** : layering MCP/FC/OpenAPI/A2A de `mcp-plateforme` → schéma de référence. Compléter par schéma trinité MCP×A2A×AG-UI de `surfaces-agentiques` (Ch. 13).

---

#### Chapitre 16 — Sécurité MCP : 10 vecteurs × 10 patterns

**Question** : Si l'agent peut appeler **n'importe quel** serveur MCP, qui valide qu'il ne se fait pas piéger par un outil empoisonné ou un namespace shadowed ?

**Thèse** : 6 trust boundaries, 4 familles d'attaques (tool poisoning / prompt injection cross-document / cross-server confusion / OAuth+supply chain), matrice défensive 10×10 avec **4 patterns pivots** : Sigstore + hash pinning, tool tagging, allowlist namespace, HITL writes. Le reste est cosmétique.

**Dossiers absorbés** : `mcp-securite/` (20 mai · #26). Roadmap 12 mois : AI Act art. 15 (août 2026), spec MCP v2 Sigstore (automne 2026), registries signés (janvier 2027), MCP × A2A (printemps 2027).

**Approfondissement vs Ch. 15** : Ch. 15 vend la promesse, Ch. 16 documente le coût. **Strictement complémentaires**, dyade unique.

**Schémas à fusionner** :
- Matrice défensive 10×10 de `mcp-securite` → schéma signature du chapitre.
- À mettre en regard de la matrice sécurité agent computer use (CVE-2025-55322, VPI) de `agents-computer-use` (Ch. 17) → **schéma de synthèse menaces 2026** unifié, renvoyé en Acte IV Ch. 20.

---

#### Chapitre 13 — Surfaces agentiques : 4 régimes d'accès

**Question** : Le chatbot est-il mort ? Et si non, à quel régime de prise l'utilisateur final accède-t-il vraiment ?

**Thèse** : Quatre régimes coexistent — chat / copilote inline / canvas génératif / on-behalf-of — chacun avec sa surface d'attention, sa friction, son contrat de confiance. Le « procès du chatbot » (Wattenberger, Appleton, Lee, Litt, Saarinen, Pike) sert de prologue. La trinité protocoles MCP × A2A × AG-UI sert de plomberie.

**Dossiers absorbés** : `surfaces-agentiques/` (18 mai · #23). Generative UI (v0, Claude Artifacts, OpenAI Canvas), on-behalf-of (Operator, Computer Use, Devin, Manus, Sierra, Agentforce, Vapi, Harvey), levels of autonomy (Knight Institute), patterns de confiance (Anthropic graduated trust, Salesforce trust layer), 5 couches d'architecture canonique, matrice de décision.

**Encart Knight levels of autonomy** : à reprendre **tel quel** comme grille de cadrage transverse au livre (renvoyée 4 fois : Ch. 11 orchestration, Ch. 13, Ch. 17 computer use, Ch. 23 governance).

---

#### Chapitre 14 — Assistants de code : Claude Code, Copilot, Codex, Antigravity

**Question** : Si le même outil accélère un débutant (+55,8 %) et ralentit un expert (−19 %), qu'est-ce qu'on mesure — et comment déléguer ?

**Thèse** : L'assistant de code est l'instanciation du régime copilote/CLI (Ch. 13) sur la verticale dev — devenue, parce que *bash is all you need*, un outil d'automatisation générale. Changement de **nature** (un délégué qui livre une PR), pas de nom. L'IA y est un **amplificateur** : le rendement dépend de la maturité du contexte et de la qualité de la revue. Le bon réflexe n'est pas de remplacer le clavier mais de déléguer un livrable *quand la revue est bornée*.

**Dossiers absorbés** : `coding-agents/` (12 mai · #17) — définition opérationnelle, anatomie 6 composants, panorama Claude Code / Codex CLI / Copilot + Cursor/Devin/Aider, **pyramide d'usage 4 étages**, gains/coûts (retex vs benchmarks vs case studies). **Ajout 2026-06** : Antigravity, Gemini CLI, Jules (absents du dossier, à sourcer sur pages officielles Google).

**Frontières éditoriales** : la *typologie des surfaces* reste au Ch. 13 ; *builder son propre agent* (SDK/ADK) est au Ch. 12 (ici on parle des produits qu'on *utilise*) ; le *cadre ROI général* (frameworks, J-curve, paradoxe) est au Ch. 23 (ici, seulement la déclinaison code) ; sécurité MCP au Ch. 16, computer use au Ch. 17.

**Schémas réutilisés** : `coding-agents` 01-trois-regimes, 02-anatomie, 04-comparatif, 05-pyramide, 06-gains, 07-couts, 08-carte-decision.

**Piège classique** : mettre un score de benchmark (« SWE-bench > 60 % ») dans un RFP au lieu du facteur de productivité *net de revue* sur son propre corpus, à son étage de la pyramide.

---

#### Chapitre 17 — Computer use : le régime extrême

**Question** : Quand l'agent **pilote un écran** comme un humain, à quoi ressemble la boucle, à quoi ressemblent les benchmarks, et quelle surface d'attaque hérite-t-on ?

**Thèse** : Boucle observe·plan·ground·act·verify. Trois architectures concurrentes en 2026. Surface d'attaque inédite : **VPI** (Visual Prompt Injection) + CVE-2025-55322. Profil de latence dégradé. Marché 2026-2030 en repositionnement.

**Dossiers absorbés** : `agents-computer-use/` (02 mai · #09). OSWorld / WebArena / UI-CUBE comme benchmarks de référence — à mettre en regard du chapitre `benchmarks-contestes` (Ch. 19), qui montre comment ils sont contaminés.

---

#### Chapitre 18 — Analytics agentique : la stack data + IA en sectoriel régulé

**Question** : Quand l'agent **interroge la data warehouse**, où passe le pivot sémantique, et comment fait-on tenir l'AI Act + DORA + ACPR + souveraineté pour une banque tier 1 française ?

**Thèse** : Trois surfaces agentiques (Conversational Analytics / agents custom Vertex / MCP banque). **Le pivot sémantique** (Looker semantic vs dbt vs Cube) est le goulot d'étranglement. Section régu banque française : échéance 2 août 2026 AI Act, DORA, EBA, ACPR, BCBS 239, Assured Workloads S3NS Premi3NS SecNumCloud. Comparatif Snowflake Cortex / Databricks Genie / Microsoft Fabric.

**Dossiers absorbés** : `analytics-agentique-gcp/` (19 mai · #24). Cas instanciation **sectorielle** du livre. À traiter aussi comme **renvoi anticipé** vers Acte IV Ch. 23 (gouvernance).

**Encart** : `narrative-experiences/` (05 mai) en aparté de fin de chapitre — la « troisième voie » d'interaction (ni chat, ni copilote, ni canvas) — 4 pages d'horizon.

---

### ACTE IV — MESURES ET GARDE-FOUS

> _Anneaux 06-09. C'est ici que se gagne ou se perd la confiance du décideur — et qu'on sait **tuer** un cas d'usage au bon moment. Lecteur cible : décideur, sponsor, RSSI, DPO, FinOps, CDO, DPO._

#### Chapitre 19 — Évaluer un agent (et débunker les leaderboards)

**Question** : Comment passe-t-on du F1 classique aux trajectoires multi-tours — et pourquoi un score SWE-bench impressionnant ne survit pas à un audit d'entreprise ?

**Thèse** : Deux mouvements à tenir en même temps. (1) Construire son éval interne datée (gruyère 8 étapes : LLM-as-judge, τ-bench/τ²-bench, pass@k vs pass^k, OTel). (2) Refuser de signer sur les benchmarks publics : 4 vecteurs de contamination (chevauchement temporel / version-tag / harness gaming / prompt leakage), benchmark teams industrialisées (Anthropic, Magic, Cognition), contre-mouvement vivant (SWE-bench Live, SWE-Lancer, MLE-bench, ARC-AGI 2). **L'éval interne datée bat tous les scores publics.**

**Dossiers fusionnés (chapitre charnière)** :
- `evaluation-agentique/` (01 mai · #08) — taxonomie complète, **playbook gruyère 8 étapes** (schéma signature de l'Acte IV).
- `benchmarks-contestes/` (15 mai · #19) — démolition des leaderboards publics, framework décision 2×2 contrôlé × ponctuel pour acheteurs.

**Approfondissement** : `evaluation-agentique` construit, `benchmarks-contestes` détruit. Lus ensemble = grille d'achat complète.

**Schémas à fusionner** :
- Playbook gruyère 8 étapes d'`evaluation-agentique` → schéma signature du livre, cité 3× (ici, Ch. 20, Ch. 21).
- Matrice 4 vecteurs contamination de `benchmarks-contestes` → en regard, page facing.
- Le 2×2 contrôlé × ponctuel → annexe « grille d'achat ».

**Piège classique** : RFP qui demande SWE-bench > 60 %. C'est mesurer un proxy contaminé ; ce qu'il faut demander c'est l'**éval interne datée du fournisseur, sur ton corpus**.

---

#### Chapitre 20 — Observabilité agentique et cognitive audit trail

**Question** : L'agent ne crashe pas — il **dérive**. Comment voir sa trajectoire, ses coûts, sa qualité — et qui ça concerne légalement ?

**Thèse** : **OpenTelemetry GenAI Semantic Conventions** unifie en 2026. 6 piliers télémétrie. **Cognitive audit trail** (réponse à AI Act art. 12-13-15 + RGPD art. 22) = nouvelle catégorie de log avec rétention, signature, et droit d'accès. L'APM classique y est structurellement aveugle.

**Dossiers absorbés** : `observabilite-agents-ia/` (30 avr · #06). Vendor landscape (Langfuse, Braintrust, Arize, LangSmith, Dynatrace, AgentCore). Échelle de maturité.

**Approfondissement transverse** : la couche `gen_ai.compaction.*` (WG actif fin 2026, mentionné dans `compaction-agentique`) → à signaler ici comme front actif.

**Redondance à dédupliquer** : OTel GenAI mentionné dans **5 chapitres** (Ch. 1, 9, 10, 19, 20). **Définition canonique ici**, renvois ailleurs.

**Piège classique** : POC sans observabilité = dette technique massive le jour du passage en prod.

---

#### Chapitre 21 — Garde-fous, jailbreaking et sécurité globale

**Question** : 48 % des pros cyber placent l'agentique en top vecteur d'attaque 2026, 34 % seulement ont des contrôles dédiés — qu'est-ce qu'on met en place concrètement ?

**Thèse** : Trois mouvements convergents — (1) **Least agency** (OWASP ASI Top 10 décembre 2025), (2) **Asymétrie attaque/défense** (jailbreaking documenté depuis 2023), (3) **patterns pivots** (Sigstore + hash pinning, tool tagging, allowlist namespace, HITL writes — déjà introduits Ch. 16).

**Dossiers fusionnés** :
- `anatomie` couche 06.
- `llm-jailbreaking/` (28 avr) — asymétrie attaque/défense, taxonomie d'attaques.
- Renvois vers Ch. 10 (memory poisoning SpAIware), Ch. 16 (MCP 10×10), Ch. 17 (computer use CVE).

**Schéma à créer** : **synthèse menaces 2026** unifiée (modèle / prompt / mémoire / outil / protocole / surface), agrégeant les figures dispersées dans `llm-jailbreaking`, `mcp-securite`, `compaction-agentique`, `agents-computer-use`, `memoire-agentique` (MITRE ATLAS). C'est le schéma transverse le plus utile du livre pour un RSSI.

**Piège classique** : agent admin sans HITL + injection indirecte = incident post-mortem que personne ne veut signer.

---

#### Chapitre 22 — Runtime managé et déploiement

**Question** : Vous opérez ces services au quotidien, ou le cloud le fait pour vous — et à quel prix de portabilité ?

**Thèse** : 2026 est l'année des runtimes managés (AWS Bedrock AgentCore GA oct. 2025 / Vertex AI Agent Engine / Azure AI Foundry Agent Service GA mai 2025 / Claude Managed Agents public beta avr 2026 / OpenAI Agent Builder). Pricing consumption-based, attente I/O souvent gratuite, sandbox isolée. Le gain est réel ; la dépendance aussi. **Code-first + protocoles ouverts** (MCP, A2A) = meilleure assurance anti-lock-in.

**Dossiers absorbés** : `anatomie` couche 08. Sous-chapitres d'`orchestration-agentique` sur runtime + d'`agent-sdk` sur managed agents.

---

#### Chapitre 23 — Mesurer le ROI (et le paradoxe agentique)

**Question** : Comment passe-t-on de « token → tâche → processus → outcome » sans confondre 4 unités de mesure incompatibles ? Et pourquoi Klarna a-t-elle reculé après avoir automatisé 67 % du support ?

**Thèse** : 5 frameworks lus côte à côte (Cigref, McKinsey, BCG, MIT NANDA, Forrester TEI). Grille analytique propriétaire à 5 axes. **Hard vs soft savings**. **Productivity J-curve** (Brynjolfsson). Arbre de décision sur 8 méthodes de calcul. **Paradoxe agentique** = changement d'unité de mesure à mesure que l'agent monte la pile de valeur. Klarna : 67 % automatisé puis recul partiel sur les 5 % de cas charge émotionnelle. Études empiriques : Brynjolfsson, Copilot, jagged frontier, METR.

**Dossiers absorbés** : `measure-roi/` (07 mai · #15). Pièges et checklist en 7 questions.

**Schémas à fusionner** :
- Productivity J-curve de `measure-roi` → schéma signature du chapitre, à mettre en regard de la « courbe LLMflation » de `economie-inference` (Ch. 5) → **double-page éco** : prix qui baisse (token) vs valeur qui monte lentement (outcome).

**Approfondissement vs Ch. 5** : Ch. 5 mesurait le coût par token ; Ch. 23 mesure la valeur par outcome. Même triangle, deux faces.

**Piège classique** : RFP au token. Une fois le contrat signé, le vendeur optimise le profil qui maximise sa marge, pas ton outcome.

---

#### Chapitre 24 — Externalité énergétique : IA frugale

**Question** : Une requête, c'est 0,3 Wh ou 3 Wh ? Une vidéo générée, c'est 50 Wh ou 1000 Wh ? Et le paradoxe de Jevons (Google +48 %, DeepSeek-V3) annule-t-il les gains d'efficience ?

**Thèse** : L'arithmétique honnête (Epoch 2025 0,3 Wh ; raisonnement 5-20 Wh ; image 2-4 Wh ; vidéo 50-1000 Wh) est la base. Eau scope 1/2/3 (cooling Microsoft 0,30 L/kWh ; scope 2 thermique 1,8-7,5 L/kWh ; TSMC 200 M L/jour). Électricité mondiale (AIE 485 TWh 2025 → 945 TWh 2030 ; LBNL 176 → 325-580 TWh US ; rush nucléaire Microsoft Three Mile Island, Amazon Susquehanna, Google Kairos, Meta Vistra). Embodied carbon H100 (1312 kg CO₂eq baseboard, 164 kg/carte). Leviers structurels (MoE / distillation / SLM / geo-aware / nucléaire dédié / pré-KV cache routing). **3 trajectoires 2030** : laissez-faire 1500 TWh / efficience seule 1100 / plafond 650.

**Dossiers absorbés** : `ia-frugale/` (13 mai · #20). Frameworks de mesure (ML CO2 Impact, Green Algorithms, MLCO2, ISO/IEC 21031, méthodologie AIE 2026, EU Code of Conduct datacenters).

**Approfondissement vs Ch. 5 et 23** : Ch. 5 coût direct, Ch. 23 ROI métier, Ch. 24 externalité. **Trois lectures complémentaires d'une même facture**.

**Schémas à fusionner** :
- 3 trajectoires 2030 de `ia-frugale` → schéma signature du chapitre.
- À mettre en regard de la « pile 7 couches » d'`economie-inference` (Ch. 5) → on voit que les mêmes leviers (MoE, KV cache, distillation) jouent sur les 3 axes.

---

#### Chapitre 25 — Gouvernance : AI Act, banque, machine unlearning

**Question** : Quelles sont les obligations réelles en 2026 pour qui déploie un agent — et pourquoi les calendriers (AI Act art. 12 août 2026, art. 15 août 2026, GPAI documentation, DORA, AAIF) convergent-ils sur les 12 prochains mois ?

**Thèse** : Le calendrier réglementaire se compresse. AI Act art. 12 (transparence GPAI) août 2026, art. 15 (cybersécurité haute risque) août 2026, art. 10 + art. 25 (data governance, transparence) déjà en vigueur. Pour la banque française : DORA + EBA + ACPR + BCBS 239 + souveraineté. **Machine unlearning** (CNIL, EDPS guidelines 2025-2026, retraining-free unlearning papers 2025) émerge comme réponse opérationnelle à RGPD art. 17.

**Dossiers absorbés** :
- `gouvernance/` (21 avr) — scrolly AI Act.
- Rappels d'`analytics-agentique-gcp` (banque), `compaction-agentique` (RGPD art. 17, AI Act art. 10/25, machine unlearning), `mcp-securite` (AI Act art. 15).

**Encart « rôle DPO/RSSI/Sponsor »** : pour chaque obligation, quel rôle porte la signature.

---

#### Chapitre 26 — Société : IA et travail

**Question** : Frey & Osborne 2013 vs Acemoglu 2024 vs Eloundou 2023 vs FMI 2024 — quel cadre choisir pour estimer l'impact emploi, et qu'est-ce que la « pause d'Engels » (Allen 2009) suggère du calendrier ?

**Thèse** : La littérature converge sur une **incertitude structurée**. Cadres : Acemoglu (substitution vs complémentarité), Frey-Osborne (probabilité d'automatisation), Eloundou/OpenAI (exposure), Goldman/McKinsey/FMI (taille d'impact macro), Aghion-Benhamou (productivité longue durée). **4 scénarios 2035** : adoption rapide+inégale / adoption progressive / plafond technique / disruption AGI. **6 leviers anti-catastrophe** (formation, redistribution, droit du travail, négociation collective, public option, transition juste).

**Dossiers absorbés** : `ia-et-travail/` (06 mai · #10).

**Encart** : la pause d'Engels (1830-1860) comme analogie historique pour le calendrier de redistribution. Allen 2009.

---

#### Chapitre 27 — Politique : procès Musk v. Altman

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

## 4. Vérification d'anatomie : exhaustivité, pertinence, actionnabilité

Trois passes de contrôle de l'outline avant d'engager la rédaction.

### 4.1 Exhaustivité — les 28 dossiers sont-ils tous absorbés ?

✓ Vérifié dossier par dossier. Tableau de couverture :

| # | Dossier | Date | Absorbé en | Statut |
| --- | --- | --- | --- | --- |
| 1 | `anatomie/` | 14 mai | Squelette transverse (E1) + Ch. 1, 7, 8, 11, 20, 21, 22, 25 | ✓ os du livre |
| 2 | `agent-sdk/` | 18 mai | **Ch. 12 (ADK, chapitre dédié)** + Ch. 22 (managed) | ✓ |
| 3 | `agents-computer-use/` | 02 mai | Ch. 17 (chapitre dédié) | ✓ |
| 4 | `analytics-agentique-gcp/` | 19 mai | Ch. 18 (chapitre dédié sectoriel) + renvoi Ch. 25 | ✓ |
| 5 | `benchmarks-contestes/` | 15 mai | Ch. 19 (dyade avec eval) | ✓ |
| 6 | `coding-agents/` | 12 mai | **Ch. 14 (chapitre dédié)** + pyramide d'usage intégrée ; Antigravity/Gemini CLI/Jules ajoutés | ✓ (Friction 1 tranchée : promotion) |
| 7 | `compaction-agentique/` | 27 mai | Ch. 10 (chapitre dédié) + renvois Ch. 9, 20, 21, 25 | ✓ |
| 8 | `decode-speculative/` | 22 mai | Ch. 4 (chapitre dédié) | ✓ |
| 9 | `economie-inference/` | 05 mai | Ch. 5 (chapitre dédié) + E2 schéma le plus cité | ✓ |
| 10 | `evaluation-agentique/` | 01 mai | Ch. 19 (dyade avec benchmarks) | ✓ |
| 11 | `fabrique-agent/` | 15 mai | Ch. 11 sous-section équipe | ✓ |
| 12 | `gouvernance/` | 21 avr | Ch. 25 (chapitre dédié) | ✓ |
| 13 | `harness-agentique/` | 29 avr | Ch. 7 (charnière) | ✓ |
| 14 | `ia-et-travail/` | 06 mai | Ch. 26 (chapitre dédié contrefort) | ✓ |
| 15 | `ia-frugale/` | 13 mai | Ch. 24 (chapitre dédié) | ✓ |
| 16 | `llm-jailbreaking/` | 28 avr | Ch. 21 (chapitre dédié sécurité globale) | ✓ |
| 17 | `mcp-plateforme/` | 08 mai | Ch. 15 (dyade avec sécurité) | ✓ |
| 18 | `mcp-securite/` | 20 mai | Ch. 16 (dyade avec plateforme) | ✓ |
| 19 | `measure-roi/` | 07 mai | Ch. 23 (charnière) | ✓ |
| 20 | `memoire-agentique/` | 30 avr | Ch. 9 (chapitre dédié) | ✓ |
| 21 | `modeles-raisonnement/` | 06 mai | Ch. 2 (chapitre dédié) | ✓ |
| 22 | `narrative-experiences/` | 05 mai | Encart fin Ch. 18 | ⚠ voir §4.2 |
| 23 | `observabilite-agents-ia/` | 30 avr | Ch. 20 (chapitre dédié) | ✓ |
| 24 | `orchestration-agentique/` | 27 mai | Ch. 11 (patterns multi-agents, charnière) + **Ch. 12 (couche ADK/stack 3 couches)** + E6 arbre buy/build | ✓ |
| 25 | `proces-musk-altman/` | 27 avr | Ch. 27 (chapitre dédié contrefort) | ✓ |
| 26 | `process-reward-models/` | 13 mai | Ch. 3 (chapitre dédié) | ✓ |
| 27 | `surfaces-agentiques/` | 18 mai | Ch. 13 (chapitre dédié) | ✓ |
| 28 | `world-models/` | 05 mai | Ch. 6 encart (bordure Acte I) | ⚠ voir §4.2 |

**Conclusion** : 26/28 en chapitre plein (depuis la promotion de `coding-agents` au Ch. 14 et la création du Ch. 12 ADK), 2/28 en encart court (`narrative-experiences`, `world-models`) — couverture **exhaustive** ; aucune perte de matière.

### 4.2 Pertinence — les regroupements résistent-ils à la critique ?

Trois zones de friction identifiées, à arbitrer **avant** la rédaction :

**Friction 1 — `coding-agents` noyé en Ch. 7** → ✅ **TRANCHÉE 2026-06-04 : promotion (variante de l'option b).**
Le dossier ne décrivait pas que le harness du code ; il propose aussi une **pyramide d'usage 4 étages** (transverse / data quotidien / data expert / produit-décideurs) qui est un outil d'adoption à part entière. Le mettre en sous-section du Ch. 7 (boucle) gommait cet angle.
Résolution retenue : **promotion en chapitre dédié, mais dans l'Acte III** (et non « Ch. 7bis » de l'Acte II comme l'envisageait l'option b d'origine), parce qu'un assistant de code est d'abord une **surface** — l'instanciation du régime copilote/CLI de la typologie du Ch. 13. Le chapitre est le **Ch. 14**, placé juste après surfaces (typologie → instanciation). En parallèle, la couche *builder son agent* (`agent-sdk` + couche ADK d'`orchestration-agentique`) est extraite du Ch. 7/Ch. 11 vers un **Ch. 12 dédié** en clôture de l'Acte II. Anciennes options conservées pour mémoire :
- ~~**(a)** Garder en Ch. 7 sous-section + encart dédié à la pyramide d'usage.~~
- ~~**(b)** Promouvoir en Ch. 7bis « Coding agents en pratique ».~~ (retenue, mais reclassée en Acte III)
- ~~**(c)** Déplacer la pyramide d'usage en encart d'ouverture du livre.~~

**Friction 2 — Ch. 16 (sécurité MCP) vs Ch. 21 (sécurité globale)**
Risque de chevauchement matériel. Le Ch. 16 traite la **surface MCP** (10×10 matrice) ; le Ch. 21 reprend en **synthèse transverse** + OWASP ASI Top 10 + jailbreaking historique.
Distinction à tenir strictement dans la rédaction :
- Ch. 16 = matrice spécifique au protocole (R7), 4 patterns pivots nommés.
- Ch. 21 = grille générale + threat model unifié (E4) + asymétrie attaque/défense.
- **Règle d'écriture** : tout ce qui relève de MCP spécifiquement reste en Ch. 16, et **n'est pas redit** en Ch. 21 (renvoi seulement). Inversement, tout ce qui transcende MCP reste en Ch. 21.

Recommandation : conserver la dyade, **noter en marge** de chaque chapitre la frontière éditoriale.

**Friction 3 — Ch. 18 (analytics banque) vs Ch. 25 (gouvernance)**
Le Ch. 18 traite déjà de l'AI Act + DORA + ACPR sur le cas banque française ; le Ch. 25 généralise.
Distinction à tenir :
- Ch. 18 = instanciation **sectorielle** (banque tier 1 française : DORA + EBA + ACPR + BCBS 239 + souveraineté Assured Workloads).
- Ch. 25 = grille **réglementaire générale** (calendrier 2026-2027, machine unlearning, rôle DPO/RSSI/Sponsor).
- **Règle d'écriture** : pas de redite des articles AI Act dans les deux chapitres ; le Ch. 25 traite le cadre, le Ch. 18 montre une application.

Recommandation : conserver, **frontière claire**.

### 4.3 Actionnabilité — un rédacteur peut-il s'y mettre tout de suite ?

Pour chaque chapitre, le rédacteur doit pouvoir attaquer en 30 minutes. Check-list de complétude :

| Critère | Présent dans l'outline | Action restante |
| --- | --- | --- |
| Dossier(s) source identifié(s) avec URL | ✓ (§3 chapitre par chapitre + annexe C) | — |
| Concepts qui s'approfondissent ailleurs | ✓ (renvois Ch. X.Y) | — |
| Schémas à fusionner / créer | ✓ (annexe A reclassée R/E A4P/A3L) | — |
| Longueur cible | ✓ (§0.5 gabarits + indication par chapitre) | — |
| Lecteur cible | ✓ (en-tête d'acte + tableau §0.2) | — |
| Concepts canoniques vs renvois | ✓ (signalés explicitement) | — |
| Piège classique | ✓ (un par chapitre) | — |
| Sortie lecteur | ⚠ pas tous les chapitres | À compléter avant rédaction |
| Sources premium à citer | ✗ | À extraire des dossiers source (regex `<li id="source-`) avant rédaction |

**Action restante avant rédaction** :
1. **Audit des ~200 schémas existants** (livrable préalable, ~3 j) : tagger chaque schéma par chapitre cible, catégorie (S/R/E/écarté), statut (tel quel / recadrer / fusionner / refaire). Sortie : `docs/audit-schemas.csv`.
2. Pour chaque chapitre, ajouter la « sortie lecteur » manquante (1 phrase).
3. Générer pour chaque chapitre la liste consolidée des sources (extraction automatique des `<li id="source-N">` des dossiers absorbés, dédoublonnée par DOI/URL).
4. Trancher friction 1 (coding-agents) — recommandation (a).
5. Acter les 9 schémas R/E à créer ex nihilo / fusionner lourdement et leur budget (E3, E4, E5, R1, R6, R14, R15, R16, R18) — le total représente ~25 jours de travail SVG sur le seul livrable visuel R+E. Le budget S vient en plus, dépendant du volume retenu après audit.

---

## 5. Annexes

### Annexe A — Audit, fusion, schémas R et E

Trois registres (cf. §0.4) : **S** = schémas au fil du texte (le gros du volume, à déterminer par audit) ; **R** = récap chapitre (1 par chapitre) ; **E** = essentiel transverse (cahier central, cité 2-4 fois dans le livre).

L'annexe ci-dessous détaille seulement **R et E** — les S sortent de l'audit des ~200 schémas existants (cf. §0.4 démarche). L'audit est un livrable préalable à la rédaction.

#### A.1 Essentiels transverses (E) — cahier central « 6 schémas pour tout retenir »

| # | Schéma final | Format | Cité en | Source à fusionner | Note |
| --- | --- | --- | --- | --- | --- |
| **E1** | **Anatomie en 10 anneaux concentriques** | A3 paysage (déplié central) | Ouverture livre + renvois 4× | `anatomie/livre-schemas.js` schéma principal | Repris **tel quel**, c'est l'os du livre. Page de garde / dépliable. |
| **E2** | **Pile 7 couches d'optimisation inference** | A3 paysage | Ch. 5 (principal), Ch. 24 (leviers frugaux), Ch. 23 (économie) | `economie-inference/` schéma 7-couches | Tel quel. Schéma le plus densément cité du livre. |
| **E3** | **Capability vs Cost — second axe de scaling** | A4 portrait | Ch. 2 (principal), Ch. 5, Ch. 19 | `modeles-raisonnement/` (o1 pivot) + `economie-inference/` (LLMflation) | **À créer** par fusion : double-vue capabilities / coût sur axe temps 2020-2026. |
| **E4** | **Threat model unifié 2026** (modèle / prompt / mémoire / outil / protocole / surface) | A3 paysage | Ch. 21 (principal), Ch. 10, 16, 17 | `mcp-securite/` (10×10), `llm-jailbreaking/`, `compaction-agentique/` (SpAIware), `agents-computer-use/` (CVE/VPI), `memoire-agentique/` (MITRE ATLAS) | **À créer** — n'existe pas dans le corpus. Schéma signature pour RSSI. Coûteux à produire (~4-6 j de travail SVG + revue sécurité). |
| **E5** | **Comparatif PRM vs LLM-as-judge vs human eval** (3 lignes × 5 colonnes coût/scalabilité/biais/fidélité/cas d'usage) | A4 portrait | Ch. 3 (principal), Ch. 19 | `process-reward-models/` + `evaluation-agentique/` | **À créer** par fusion. Pivot du chapitre éval. |
| **E6** | **Arbre de décision buy/build agent** | A3 paysage | Annexe consultative + renvois Ch. 11, 22 | `orchestration-agentique/` arbre buy/build | Tel quel, recadré pour impression. |

#### A.2 Récaps chapitre (R) — un par chapitre standard/charnière

| # | Récap | Format | Chapitre | Source | Note |
| --- | --- | --- | --- | --- | --- |
| R1 | Boucle Reason · Act · Observe canonique + 3 variantes (harness GAN, gather/act/verify, coding loop) | A3 paysage | Ch. 7 (charnière) | `anatomie/` 01, `harness-agentique/` (GAN 3 agents), `agent-sdk/` (gather/act/verify), `coding-agents/` | **À créer** par fusion. Une référence canonique + variantes dérivées en encarts latéraux. |
| R2 | 4 piliers mémoire × 6 opérations × 5 architectures prod | A3 paysage | Ch. 9 | `memoire-agentique/` + matrice prod `compaction-agentique/` | Fusion de la grille existante + matrice prod. |
| R3 | Triangle fidélité × coût × oubliabilité + 5 familles de compaction | A4 portrait | Ch. 10 | `compaction-agentique/` | Tel quel + légende détaillée. |
| R4 | 8 patterns canoniques d'orchestration (Anthropic 6 + supervisor-workers + hierarchical + peer-to-peer) | A3 paysage | Ch. 11 (charnière) | `orchestration-agentique/` + `anatomie/` couche 04 | Tel quel ; sous-encart pour les 6 patterns Anthropic. |
| R5 | 4 stades de maturité fabrique agent + 10 artefacts partagés | A4 portrait | Ch. 11 sous-section équipe | `fabrique-agent/` | Tel quel. |
| R6 | Trinité protocoles MCP × A2A × AG-UI + layering avec function calling / OpenAPI | A4 portrait | Ch. 15 | `surfaces-agentiques/` + `mcp-plateforme/` | **À unifier** en un seul schéma de référence. |
| R7 | Matrice défensive MCP 10×10 (vecteurs × patterns) | A3 paysage | Ch. 16 | `mcp-securite/` | Tel quel. |
| R8 | 4 régimes d'accès + levels of autonomy (Knight) + graduated trust (Anthropic) | A3 paysage | Ch. 13 (+ renvois Ch. 11, 17, 25) | `surfaces-agentiques/` | Grille de cadrage transverse. À recadrer A3. |
| R9 | Boucle computer use observe·plan·ground·act·verify + 3 architectures | A4 portrait | Ch. 17 | `agents-computer-use/` | Tel quel ; renvoyer à R1 pour la boucle générique. |
| R10 | 3 surfaces analytics agentique × pile semantic layer | A4 portrait | Ch. 18 | `analytics-agentique-gcp/` | Tel quel, recadré sectoriel. |
| R11 | Playbook gruyère 8 étapes (Build → Run → Govern) | A3 paysage | Ch. 19 (charnière, principal) + renvois Ch. 20, 21 | `evaluation-agentique/` fig gruyère | Tel quel — schéma signature de l'Acte IV. |
| R12 | 4 vecteurs de contamination benchmarks publics | A4 portrait | Ch. 19 | `benchmarks-contestes/` | En page facing du gruyère. |
| R13 | 6 piliers télémétrie OTel GenAI + cognitive audit trail | A3 paysage | Ch. 20 | `observabilite-agents-ia/` | Fusion 6 piliers + cognitive audit trail en un schéma. |
| R14 | OWASP ASI Top 10 + asymétrie attaque/défense | A4 portrait | Ch. 21 | `llm-jailbreaking/` + OWASP ASI dec 2025 | À créer. En complément de E4 (threat model unifié). |
| R15 | Vendor landscape runtimes managés (5 vendeurs × 8 dimensions) | A4 portrait | Ch. 22 | `orchestration-agentique/` matrice ADK + `agent-sdk/` managed | À créer par fusion. |
| R16 | Productivity J-curve × LLMflation × paradoxe agentique | A3 paysage | Ch. 23 (charnière) | `measure-roi/` + `economie-inference/` | **À créer** : double-page « facture qui baisse vs valeur qui monte lentement ». |
| R17 | 3 trajectoires énergétiques 2030 (laissez-faire / efficience / plafond) | A3 paysage | Ch. 24 | `ia-frugale/` | Tel quel. |
| R18 | Calendrier réglementaire 2026-2027 (AI Act + DORA + RGPD + AAIF) | A4 portrait | Ch. 25 | À créer à partir de `gouvernance/`, `analytics-agentique-gcp/`, `compaction-agentique/`, `mcp-securite/` | Frise temporelle synthétique. |
| R19 | 4 scénarios IA et travail 2035 + 6 leviers anti-catastrophe | A4 portrait | Ch. 26 | `ia-et-travail/` | Tel quel. |

#### A.3 Bilan de production

| Type | Nombre estimé | Tel quel (recadrage léger) | À fusionner | À créer ex nihilo |
| --- | --- | --- | --- | --- |
| Schémas fil-du-texte (S) | ~60-90 (audit) | majoritairement | quelques-uns | rarement |
| Récaps (R) | 19 | 9 | 8 | 6 (R1, R6, R14, R15, R16, R18) — dont 2 par fusion lourde |
| Essentiels (E) | 6 | 2 (E1, E2, E6) | 1 (E3) | 3 (E3 fusion, E4, E5) |
| **Total R+E** | **25** | 11 | 9 | ~9 |

**Schémas les plus coûteux à produire** : E4 (threat model unifié — ~4-6 jours SVG + revue sécurité externe), E3 et R16 (les deux double-vue capability/cost et J-curve/LLMflation — ~2-3 jours chacun).

**Pour les S** : le coût n'est pas dans la création mais dans l'**audit + recadrage** (~3 j pour la passe complète + ~5-10 j de recadrage selon volume retenu).

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
- **RSSI** → Ch. 16, 21 (priorité), Ch. 10, 17, 25 (compléments).
- **FinOps** → Ch. 5, 23, 24 (priorité), Ch. 22 (compléments).
- **DPO** → Ch. 10, 25 (priorité), Ch. 20 (cognitive audit trail).
- **CDO / Sponsor** → Prologue, Ch. 11, 23, 25, 26, 27 (priorité).
- **Agent Engineer** → Acte II en entier (Ch. 7-11), Ch. 16, 20 (compléments).

---

## 6. Risques d'écriture identifiés

À garder en tête pendant la rédaction du manuscrit :

1. **Sur-redondance Acte II** : les patterns canoniques Anthropic sont décrits 5 fois dans le corpus, le risque c'est de les redécrire 2 fois dans le livre. Discipline : une seule définition Ch. 7, renvois ailleurs.
2. **Sous-représentation contreforts** : `world-models`, `narrative-experiences`, `proces-musk-altman` peuvent être noyés. Choix éditorial assumé : ils restent en **encarts** (Ch. 6, fin Ch. 18, Ch. 27), pas en chapitres dédiés sauf le procès qui a son chapitre.
3. **Dossiers évolutifs** : `proces-musk-altman` (journal vivant), `compaction-agentique` (compactors RL en cours), `mcp-securite` (roadmap 12 mois) — risque d'obsolescence à l'impression. Solution : encadré « état au 27 mai 2026 » sur ces chapitres, avec renvoi URL vers la version vivante.
4. **Schéma A4 (threat model unifié) à créer** — n'existe pas encore dans le corpus. C'est un livrable supplémentaire à produire avant impression.
5. **Niveau d'entrée Acte I** : trop technique pour un décideur pur. Solution : encadré « TL;DR décideur » de 5 lignes en ouverture de chaque chapitre Acte I, qui résume l'enjeu business sans terminologie.
6. **Tonalité Lincoln** : aucune mention Lincoln dans les chapitres, sources de schémas ou en-têtes. Footer/colophon uniquement, en accord avec CLAUDE.md.

---

## 7. Prochain pas (suggestion)

1. **Valider la structure 4-actes + 25 chapitres**. Si ajustement (fusionner/séparer un chapitre), corriger l'outline avant de partir en rédaction.
2. **Lancer l'audit des ~200 schémas existants** (livrable `docs/audit-schemas.csv` — ~3 j). C'est le prérequis pour décider du volume S/R/E final et budgéter la production graphique. Sans audit, le bilan §A.3 reste indicatif.
3. **Acter la liste des schémas R/E à fusionner ou créer** (annexe A, registres R et E) : 25 schémas dont ~9 lourds. Le schéma **E4 (threat model unifié)** est le plus coûteux et le plus utile au lecteur RSSI.
4. **Choisir le format de sortie** : livre print PDF (style `anatomie/livre-print.html`), livre web interactif (style `anatomie/livre.html` avec navigation au clavier), ou les deux. Implique un budget de mise en page différent.
5. **Décider du calendrier de gel des contenus évolutifs** (procès, MCP v2, AI Act art. 15) — date d'arrêt-image dans le manuscrit, avec renvoi URL pour le vivant.
