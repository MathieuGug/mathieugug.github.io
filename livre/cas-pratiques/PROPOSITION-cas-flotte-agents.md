# Cas pratique (spec à valider) — Gouverner une flotte d'agents

> **ID : CC-11 — cas-chapeau de CLÔTURE de l'annexe** (`ordre` final). **Décision tranchée** : CC-11 n'**ouvre pas** l'annexe — l'ouvreur est l'**assistant transverse (CC-00)**, le pôle large/peu maîtrisé de l'arc de maturité. CC-11 est la **synthèse de clôture** : on ne gouverne une flotte qu'**après** l'avoir laissée proliférer (fondations + remontée métiers + galerie). Statut : **spec + `fig-00`** livrés en couche auteur ; CC-11 est désormais **inscrit dans `cases-index.json`** (entrée draft, `strate: "chapeau"`) et **présent dans le hub** (carte draft, strate 4). JSON 19 sections + MD + `fig-01`/`fig-02` à écrire sur ton feu vert.

**Transverse · Agentic · charnière · facette principale `gouvernance` (secondaires `build_vs_buy` du socle, `evaluation` à l'échelle).**

> **Thèse** : passé une dizaine d'agents, le problème n'est plus de *faire* un agent mais de *gouverner une flotte*. Sans socle fédéré ni modèle opératoire, la prolifération (50 agents Copilot + verticaux + shadow) coûte plus qu'elle ne rapporte — doublons, zombies, accès non revus, réponses contradictoires. Le ROI n'est pas par agent, il est au niveau du **portefeuille**.

Ce cas est le **point de convergence de tout l'arc** : les MCP servers, harness d'éval et garde-fous des fondations (CC-00 assistant, CC-03 socle data, CC-10 dev agentique) et des cas métiers (CC-01/CC-02/CC-09) deviennent des **composants mutualisés d'un socle fédéré**. C'est le cas qui transforme une collection de projets en plateforme — et qui ferme la boucle ouverte par l'assistant transverse : là où CC-00 montrait l'IA *non maîtrisée* qui entre par tous les côtés, CC-11 montre comment on *reprend la main* sur la flotte qui en résulte.

---

## 1. Mise en situation — « on a 50 agents, qui gère ça ? »

Grand groupe / ETI. En 18 mois, l'IA agentique est entrée **bottom-up** :

- **50 agents dans Microsoft Copilot Studio** montés par les métiers (RH, finance, achats, IT, juridique, commerce, support…).
- **4 agents verticaux « sérieux »** buildés par les équipes data (le copilot conseiller CC-01, l'agent vocal CC-02, l'agent guichet CC-09, un agent fraude temps réel).
- **~12 agents shadow** montés en douce sur des plateformes grand public.

Le déclencheur CODIR : le DSI découvre qu'un agent RH écrit dans le SIRH **sans revue sécu** ; le DAF voit **7 abonnements agentiques en doublon** ; deux agents donnent des réponses **contradictoires** sur la politique de notes de frais ; un agent client-facing a été mis en prod **sans éval**. Question : *« qui gère ces 50 agents, comment, sur quel socle — et est-ce que ça nous coûte plus que ça ne rapporte ? »*

**Chiffres bruts** (à caler) : 50 agents Copilot · 4 verticaux · ~12 shadow · X k€ de licences/sièges · **~60 % d'agents « zombies »** (déployés, jamais utilisés) · % sans owner · % sans éval · N incidents accès.

**`fig-00`** = la carte de la flotte (la sprawl) — voir `images/CC-11-fig-00-flotte-agents-sprawl.svg`. C'est le test de véracité : sans cette carte, le « cadrage » reste un slogan.

---

## 2. Quel socle ? (→ `build_buy` + `outils_internes`)

La gestion d'une flotte exige un **socle transverse** = 6 services partagés (la plateforme « AgentOps »). Le socle ne *remplace* pas les plateformes d'exécution (Copilot Studio, build maison) : il les **fédère**.

| # | Service du socle | Rôle | Sans lui |
|---|---|---|---|
| 1 | **Registre d'agents** | Catalogue : owner, finalité, données accédées, modèle, statut éval, niveau de risque, statut AI Act, cycle de vie | Personne n'a la carte → sprawl |
| 2 | **Gateway / identité agent** | Authn/authz **par agent**, scopes MCP, secrets, rate-limit, routing modèle, **attribution de coût** (FinOps) | Accès non revus, coûts non imputables |
| 3 | **Éval-as-a-service** | Régression suites réutilisables par archétype, LLM-as-judge mutualisé, **gate de promotion** | 50 évals artisanales = aucune éval |
| 4 | **Observabilité transverse** | Traces, coût/agent, latence, usage réel, escalades, incidents | Pas de perf, pas de détection des zombies |
| 5 | **Garde-fous & politiques** | DLP, PII, anti prompt-injection, politiques par niveau de risque | Risque non maîtrisé, conformité ingérable |
| 6 | **Catalogue de composants** | MCP servers partagés (ex. les 6 MCP banque de CC-01), prompts, templates | Chaque équipe rebuild les mêmes briques |

### L'arbitrage central — build/buy **du socle**

| Option | Couvre quoi | Limite |
|---|---|---|
| **Buy Microsoft-native** (Copilot Studio + Purview + Entra Agent ID + admin center) | Gouvernance native des 50 Copilot | **Angle mort** : ne couvre ni les agents build ni les shadow → lock-in, périmètre partiel |
| **Buy AgentOps tiers** (plateforme de gouvernance multi-vendor) | L'hétérogène | Nouvelle dépendance, maturité marché, re-lock-in |
| **Build socle maison** (registre + gateway + harness) | Tout, souverain | Effort plateforme, équipe |
| **Hybride fédéré** *(recommandé)* | **Tout** | Discipline d'architecture |

**Recommandation — hybride fédéré** : exploiter le **natif Microsoft** pour gouverner les 50 Copilot (ne pas réinventer), + un **registre + gateway transverse maison léger** qui chapeaute **toutes** les plateformes (Copilot + build + cadre les shadow), + un **harness d'éval partagé**. Le socle fédère, il ne centralise pas l'exécution.

> Renvois : ch.12 (MCP plateforme = le socle), ch.13 (sécurité MCP = gateway/identité agent), ch.20 (runtime managé vs maison).

---

## 3. Qui ? Métier vs DSI ? (→ `gouvernance` + `operation_equipe`)

C'est **le** débat. Trois modèles opératoires :

- **Centralisé (la DSI fait tout)** — contrôle maximal, mais goulot d'étranglement, tue l'innovation métier, file d'attente. Ne passe pas à l'échelle de 50+ agents.
- **Décentralisé (chaque métier fait ses agents)** — vélocité, mais c'est **exactement la sprawl actuelle** : doublons, chaos, risque non maîtrisé.
- **Fédéré / « hub and spoke » (recommandé)** — un **Center of Excellence agents / plateforme** possède le socle, les standards, les garde-fous, le registre, l'éval-as-a-service ; les **métiers possèdent leurs agents** (finalité, contenu, owner métier **obligatoire**, ROI de *leur* agent) **dans le cadre**. Principe de la **« paved road »** : rendre la voie conforme la plus facile à emprunter.

**RACI cible** :

| Acteur | Responsabilité |
|---|---|
| **Plateforme / CoE (DSI + sécu + data)** | Le socle, les standards, l'admission au registre, les garde-fous transverses, l'éval-as-a-service |
| **Métier (agent product owner)** | La finalité, le contenu, l'éval métier, le ROI de **son** agent |
| **Sécu / DPO** | Revue des accès écriture & données sensibles, gate de mise en prod, statut AI Act |
| **Comité de portefeuille d'agents** (trimestriel) | Admission, **dé-commissionnement**, arbitrage des doublons, priorisation |

**Rôles nouveaux** : un **Head of AgentOps / Agent Platform Owner** (côté plateforme) + des **agent product owners** côté métier. **Règle d'or : tout agent a un owner métier nommé + une fiche au registre — sinon il est éteint.**

> Renvois : ch.24 (métier vs DSI, conduite du changement), ch.11 (patterns d'orchestration).

---

## 4. Quelle gouvernance ? (→ `gouvernance`)

- **Cycle de vie agent** (comme un cycle de vie applicatif, mais pour agents) : idée → **admission au registre** (revue proportionnée) → build → **gate d'éval** → prod → monitoring → revue périodique → **dé-commissionnement**.
- **Tiering par le risque — la clé de la scalabilité.** On ne met **pas** la même gouvernance sur les 50. Trois niveaux :
  - **Tier 1 (fort)** : client-facing, écrit dans un système régulé, données sensibles → revue lourde (sécu, DPO), éval renforcée, supervision humaine.
  - **Tier 2 (moyen)** : écrit dans des systèmes internes non régulés → revue standard.
  - **Tier 3 (faible)** : RAG interne lecture seule → **self-service cadré** (la paved road).
- **AI Act par agent** : la plupart des 50 sont risque limité/minimal (productivité interne), mais certains basculent **haut risque** (RH/recrutement = Annexe III). Le **registre porte le statut AI Act de chaque agent** — le registre **est** l'outil de conformité.
- **Shadow agents** : **amnistie + onboarding** (« ramène ton agent au registre, on t'aide à le mettre en conformité ») plutôt que la chasse. On convertit la sprawl en flotte plutôt que de la combattre.

> Renvois : ch.23 (AI Act — registre par agent), ch.19 (garde-fous).

---

## 5. Quelle validation ? (→ `evaluation`)

L'éval **à l'échelle de la flotte** est un problème nouveau : on ne peut pas faire 50 régression suites artisanales.

- **Éval-as-a-service** : un harness partagé, des suites de régression réutilisables **par archétype** (RAG, tool-use, conversationnel), un LLM-as-judge mutualisé, des **gates de promotion standardisés** (aucun agent en prod sans passer le gate).
- **Test de non-contradiction inter-agents** : les 50 agents donnent-ils des réponses **cohérentes** sur les politiques communes (notes de frais, congés) ? C'est un test propre à la flotte.
- **Détection de collision** : deux agents au périmètre qui se chevauchent et divergent.
- **Validation continue, pas one-shot** (leçon de l'évaluation continue généralisée à la flotte) : la dérive d'un agent passe inaperçue si l'éval n'est pas mutualisée et permanente.

> Renvois : ch.17 (évaluation), ch.18 (observabilité / audit trail).

---

## 6. Performance ? (→ observabilité + `trajectoire_couts`)

- **Observabilité transverse** : coût par agent (**FinOps agentique** — attribuer tokens/sièges par agent et par métier), latence, **taux d'usage réel**, taux d'escalade, incidents sécu.
- **Le KPI de flotte** : **taux d'agents actifs avec ROI prouvé** vs **agents zombies**. Sur 50 agents, souvent **< 40 % réellement utilisés** → le premier gisement de valeur n'est pas d'en ajouter, c'est d'**éteindre les zombies**.
- **Le coût de la sprawl** : (a) licences/sièges dupliqués, (b) duplication d'effort (chacun rebuild les mêmes MCP), (c) risque/incidents. Le socle paie par **mutualisation**.

---

## 7. ROI au niveau portefeuille (→ `trajectoire_couts` + `roi`)

- Le ROI **n'est pas par agent** mais au niveau **portefeuille**. Le socle a un coût fixe (plateforme + CoE) qui s'amortit sur N agents : sous ~10-15 agents, pas besoin de socle lourd ; **au-delà, le socle devient rentable** (mutualisation éval + MCP + garde-fous). **C'est le crossover du socle** — l'analogue flotte du crossover build/buy.
- **Les 8 postes appliqués au portefeuille** : inférence (somme des agents), infra (le socle), équipe (le CoE/AgentOps), data, **évaluation (le harness partagé)**, **gouvernance (registre + comité)**, sécurité (gateway), change (enablement métier).
- **Le paradoxe agentique au carré** : à l'échelle flotte, l'inférence par agent baisse (LLMflation, ch.21.2.1) mais le **coût de coordination** (socle, gouvernance, éval transverse) devient le poste dominant. L'unité de mesure se déplace de l'agent vers la **flotte**.
- **Axe ROI principal** : `cout` (TCO du portefeuille, fin des doublons/zombies) ; secondaires `qualite` (cohérence inter-agents), `bienetre`. **Gardien** : taux d'usage réel (un agent non utilisé est un coût pur, pas un actif).

---

## 8. Verdict prévu — `GO_SOCLE_FÉDÉRÉ`

Sinon la sprawl coûte plus qu'elle ne rapporte. Conditions :

1. **Registre obligatoire** — aucun agent sans owner métier + fiche (sinon extinction).
2. **Gouvernance proportionnée au risque** (tiering 3 niveaux), pas uniforme.
3. **Éval-as-a-service** partagée + gate de prod pour tous.
4. **Modèle fédéré** — la DSI/CoE possède le socle, le métier possède les agents.
5. **Dé-commissionnement actif des zombies** (KPI taux d'usage).
6. **Socle hybride** — natif Microsoft pour les Copilot + registre/gateway transverse maison pour fédérer le reste + amnistie/onboarding des shadow.

---

## 9. Bifurcations reader-driven (charnière → 3)

1. **Métier vs DSI** : centralisé (goulot) / décentralisé (= la sprawl) / **fédéré CoE** (le bon).
2. **Le socle** : Microsoft-native only (angle mort build/shadow) / AgentOps tiers (re-lock-in) / build pur (effort) / **hybride fédéré** (le bon).
3. **Les 50 existants + shadow** : tout raser (perte d'adhésion) / laisser courir (le risque explose) / **amnistie + onboarding + tiering** (le bon).

---

## 10. Figures prévues

- **`fig-00` — Carte de la flotte (la sprawl)** ✅ livrée : 50 Copilot + verticaux build + shadow, avec les angles morts (pas de registre / gateway / éval / observabilité, doublons, zombies, accès non revus).
- `fig-01` — Le socle fédéré (6 services) + modèle opératoire RACI (CoE possède le socle, métiers possèdent les agents) — *à dessiner*.
- `fig-02` — Tiering par le risque + cycle de vie agent (admission → gate éval → prod → dé-commissionnement) — *à dessiner*.

---

## Renvois livre

ch.11 (orchestration multi-agent) · ch.12 (MCP plateforme = socle) · ch.13 (sécurité MCP = gateway/identité agent) · ch.14 (surfaces agentiques) · ch.17 (éval) · ch.18 (observabilité/audit) · ch.19 (garde-fous) · ch.20 (runtime managé) · ch.21.2.1 (LLMflation) · ch.21.7 (paradoxe agentique au niveau flotte) · ch.23 (AI Act — registre par agent) · ch.24 (métier vs DSI).

---

*Spec de travail · juin 2026 · co-écrit avec l'aide d'une IA.*
