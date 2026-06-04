---
chapitre: 12
titre: "Construire la boucle : SDK, ADK et frameworks d'agents"
acte: 2
acte_titre: "La boucle"
gabarit: standard
mots: 5200
statut: ébauche v0.9
date_maj: 2026-06-04
---

# Chapitre 12 — Construire la boucle : SDK, ADK et frameworks d'agents

> **Acte II — La boucle · Chapitre standard, ~18 pages**
> _Les chapitres précédents ont décrit la boucle comme un objet : le harness ([Ch. 7](ch07-boucle-agentique.md)), les outils ([Ch. 8](ch08-outils-de-lagent.md)), la mémoire ([Ch. 9](ch09-memoire-agentique.md)), les patterns d'orchestration ([Ch. 11](ch11-patterns-orchestration.md)). Reste la question du praticien : **avec quoi écrit-on tout ça ?** Ce chapitre traite la couche ADK — la forme qu'un agent prend dans le code — et la distingue nettement du runtime (où il tourne) et des services de plateforme (mémoire, identité, gateway). Le geste concret, pas la théorie de la boucle._

> [!QUESTION] Question d'ouverture
> Si la boucle Reason · Act · Observe est partout la même, pourquoi y a-t-il une dizaine de frameworks pour l'écrire — et pourquoi leurs abstractions se ressemblent-elles toutes (un `Agent`, des `tools`, un `handoff`) ? Le choix d'un kit n'est pas un choix d'abstraction : c'est un pari sur un socle de modèle, un environnement d'exécution, et un degré de couplage qu'on accepte. Quand faut-il importer une *library*, quand suffit-il d'une boucle de cinquante lignes sur l'API brute, et quand la bonne réponse est-elle de ne rien builder du tout ?

> [!TLDR] TL;DR décideur
> - ==Le produit et le SDK sont deux enveloppes du même harness.== Claude Code (la CLI) et le Claude Agent SDK partagent strictement le même cœur : modèle, outils built-in, agent loop, gestion du contexte[^1]. On hérite du harness ; on change seulement *ce qui le consomme*. Le code spécifique à votre agent tient souvent en **~50 lignes** — le reste vit dans le filesystem (CLAUDE.md, scripts, skills).
> - ==Quatre voies, un même curseur effort × contrôle.== API brute (tool loop fait main, contrôle max), Agent SDK (harness hérité, UI à soi), Claude Code comme plateforme d'extension (skills/commands/hooks, vélocité max), et runtime managé ([Ch. 22](ch22-runtime-manage.md)). On monte le curseur seulement quand le besoin l'exige.
> - ==« Bash is all you need ».== Plutôt qu'empiler des dizaines d'outils métier rigides, l'agent compose des primitives Unix (`grep`, `jq`, `git`, pipes) et écrit ses propres scripts. C'est ce qui a fait sortir les coding agents du périmètre dev — et c'est aussi pourquoi le **plafond pratique des outils déclarés est ~une dizaine** avant que le modèle se perde dans le choix.
> - ==ADK ≠ runtime ≠ services de plateforme.== L'ADK définit la *forme* de l'agent dans le code ; le runtime est *là où les sessions tournent* (isolation, durée, cold-start, scaling) ; les services de plateforme sont les briques (mémoire, identité, gateway, observabilité, sandbox). Confondre les trois est *« la source de confusion la plus fréquente »* : « on utilise Bedrock » ne dit rien tant qu'on n'a pas précisé *quelles briques*.
> - ==Les abstractions se ressemblent ; le choix se joue sur le socle.== ADK ouverts (LangGraph, CrewAI, Mastra, Pydantic AI) pour éviter le lock-in ; ADK vendeurs (OpenAI Agents SDK, Claude Agent SDK, Google ADK, Microsoft Agent Framework) pour la friction minimale si on adhère au socle de modèle dominant.
> - ==La sécurité est un gruyère à trois couches== (alignement modèle · contrôles du harness · sandbox), et le **RBAC passe par l'infra — jamais par le prompt**. Une clé API scopée tient ; un « ne lis pas la table users » glissé dans le prompt ne tient pas.

---

## 12.1 Pourquoi un chapitre sur les kits

> [!INFO] Frontières avec les chapitres voisins
> Ce chapitre est volontairement étroit. La **boucle conceptuelle** (les sept couches du harness, le `stop_reason`, le pattern à trois agents) est au [Ch. 7](ch07-boucle-agentique.md). Les **topologies multi-agents** et la décision *buy/build* sont au [Ch. 11](ch11-patterns-orchestration.md). Le **runtime managé et le déploiement** (AgentCore, Vertex Agent Engine, Managed Agents) sont au [Ch. 22](ch22-runtime-manage.md). Le **catalogue d'outils** et leur surface de risque sont au [Ch. 8](ch08-outils-de-lagent.md). Ici : uniquement le geste de construction d'un agent unique — la couche ADK.

Aakash Gupta résume la bascule d'une formule : *« 2025 was agents, 2026 is agent harnesses »*[^2]. 2024 a été l'année des boucles ; 2026 est celle des **kits pour les écrire et des plateformes pour les opérer**[^3]. Le glissement se lit dans la chronologie des annonces : Anthropic publie *Building Effective Agents* en décembre 2024[^4], OpenAI sort Swarm dans la foulée puis transforme l'éducatif en production avec l'Agents SDK en mars 2025[^5], AWS atteint la GA de Bedrock AgentCore le 13 octobre 2025[^6], Google généralise son Agent Development Kit (plus de 7 millions de téléchargements au premier trimestre 2026)[^7], et Microsoft fusionne AutoGen et Semantic Kernel en Microsoft Agent Framework, dont la v1 entre en disponibilité générale en avril 2026[^8].

### 12.1.1 Le même harness, deux enveloppes

Le point le plus mal compris : **le produit et le SDK ne sont pas deux choses différentes**. La documentation officielle est explicite — le Claude Agent SDK expose *« the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript »*[^1]. Autrement dit, Claude Code (la CLI, l'extension IDE, l'app desktop) et le SDK sont deux *enveloppes* du même noyau. Le package TypeScript `@anthropic-ai/claude-agent-sdk` embarque d'ailleurs le binaire Claude Code natif ; le package Python parle au même binaire via un wrapper[^1].

![Claude Code vs Agent SDK — même harness, deux enveloppes|1300](../../agent-sdk/images/20260518-03-cc-vs-sdk.svg)

La conséquence pratique est libératrice : on prototype dans le produit (gratuit, immédiat), puis on extrait la logique dans le SDK quand il faut une UI ou une intégration propres. *« The actual agent file looks like… it's around 50 lines »*[^9] — parce que le harness est fourni, et que le reste du comportement vit dans des artefacts versionnés (CLAUDE.md, scripts, skills) plutôt que dans du code.

## 12.2 Quatre voies pour builder — le curseur effort × contrôle

Il n'y a pas une bonne façon de construire un agent, mais un **curseur** entre effort de mise en œuvre et contrôle obtenu[^9].

![Trois voies de build sur les axes effort × contrôle|1300](../../agent-sdk/images/20260518-04-trois-voies.svg)

### 12.2.1 L'API brute — contrôle maximal, boilerplate maximal

On appelle directement la Messages API, on déclare ses outils, on écrit soi-même la boucle `while response.stop_reason == "tool_use"`. C'est la voie du contrôle total : chaque tour est explicite, loggable, modifiable. C'est aussi celle où l'on réécrit le harness à la main — gestion des retries, du budget de tours, de la compaction. À réserver aux cas où l'on a une raison précise de ne pas hériter d'un harness existant.

### 12.2.2 L'Agent SDK — le sweet spot du produit custom

On hérite du harness (boucle, outils built-in `Read`/`Write`/`Edit`/`Bash`/`Grep`/`WebFetch`…, gestion du contexte, hooks) et on construit sa propre UI par-dessus. C'est le bon ratio contrôle/effort pour une application de production qui doit avoir sa propre interface et sa propre logique métier, sans réinventer la plomberie.

### 12.2.3 Claude Code comme plateforme d'extension — vélocité maximale

On ne sort jamais du produit : on le configure via `CLAUDE.md`, des *slash commands*, des *skills* et des *hooks*. Effort minimal, vélocité maximale — mais l'artefact produit n'est exécutable que par les personnes qui ont Claude Code installé. Idéal pour l'outillage interne d'une équipe ; insuffisant pour livrer un produit à des utilisateurs finaux.

### 12.2.4 Le runtime managé — la voie de production

Quand l'agent doit tourner en continu, à l'échelle, pour des tiers, on le pose sur un runtime hosté (Managed Agents Anthropic, Bedrock AgentCore, Vertex Agent Engine). C'est la suite naturelle d'un prototype Agent SDK — traitée en détail au [Ch. 22](ch22-runtime-manage.md).

## 12.3 Le geste concret : tools, bash ou codegen ?

Une fois la voie choisie, la décision d'architecture la plus chargée est : **comment l'agent agit-il ?** Trois registres, aucun ne gagne sur tout[^10].

![Matrice Tools / Bash / Codegen — trois zones de pertinence|1300](../../agent-sdk/images/20260518-07-matrice-tools-bash-codegen.svg)

- **Tools** — actions structurées, atomiques, souvent destructives. Schéma JSON, fiable, rapide (un aller-retour), contrôlé. Mais cher en contexte et peu composable. *Pour :* envoyer un email, créer un ticket, écrire un paiement, masquer des données sensibles, produire un audit log structuré.
- **Bash** — composition, filesystem, recherche. Composable (pipes natifs), économe en contexte (les résultats vivent dans des *fichiers*, pas en tokens), scriptable. Mais découvrabilité moyenne (le modèle doit connaître `jq`/`awk`) et fiabilité immédiate plus basse. *Pour :* search (`grep`/`ripgrep`), lint & build (`eslint`/`tsc`/`pytest`), systèmes de mémoire.
- **Codegen** — flexibilité maximale, analyses *ad hoc*, deep research. Mais latence la plus haute (overhead compile/exec). *Pour :* analyses dynamiques, requêtes ponctuelles complexes.

### 12.3.1 « Bash is all you need »

La thèse opinionated du SDK : plutôt qu'empiler *« dozens or hundreds of rigid tools »*, l'agent compose des primitives Unix et écrit ses propres scripts[^9]. C'est ce qui explique le **plafond pratique** observé : au-delà d'une dizaine d'outils déclarés, le modèle se perd dans le choix. Et c'est ce qui a fait sortir les coding agents de leur niche : un agent qui sait écrire et exécuter du bash sait travailler sur de la finance, du marketing ou de la data — pas seulement du code (voir [Ch. 14](ch14-assistants-de-code.md)).

### 12.3.2 La règle de combinaison

Une application de production combine les trois : des *tools* pour les ~5 actions destructives critiques, du *bash* pour ~80 % du raisonnement opérationnel, du *codegen* pour les pics de flexibilité. La proportion dépend du domaine — un agent SRE penchera vers le bash, un agent CRM vers les tools.

### 12.3.3 Le cas SQL, canonique

Faut-il un outil `executeQuery` ou laisser l'agent écrire du SQL en bash ? Les deux, selon le contrat : un **tool** (whitelist + parser anti-PII + RBAC déterministe) quand on veut un contrôle strict ; **bash/codegen** quand on veut du SQL dynamique avec boucle de feedback — plus puissant, plus difficile à sécuriser. Le choix se décide par le risque, pas par le confort.

## 12.4 La boucle invariante : Gather → Act → Verify

Sous tous les kits, une même séquence : *gather context → take action → verify work → repeat*[^11].

![Boucle Gather → Act → Verify avec points de hook|1300](../../agent-sdk/images/20260518-08-agent-loop.svg)

1. **Gather** — l'étape la plus sous-estimée ; beaucoup d'agents échouent en la sautant. Sur des codebases massives (50 M+ lignes), le *stuffing* ne suffit pas : on s'appuie sur de bons `CLAUDE.md` et on démarre l'agent dans un sous-répertoire pour scoper. La recherche sémantique pure est *« brittle »* — le modèle n'est pas entraîné sur votre index[^9].
2. **Act** — tools/bash/codegen selon la matrice. **Logger systématiquement** chaque action : sans trace, le debug est impossible.
3. **Verify** — la couche qui distingue un agent fiable d'un agent bavard. Sur le code, elle est *donnée* (lint, compile, tests, exit code) ; sur la recherche, elle est *à construire* (forcer les citations, croiser les sources, déployer un second agent validateur).

Les **hooks** (six points d'interception : `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `SessionEnd`, `UserPromptSubmit`) ajoutent de la *discipline déterministe par-dessus* un modèle probabiliste[^12] : on ne reconfigure pas le modèle, on reconfigure sa boucle pour qu'une étape sautée soit toujours rattrapée. La méta-compétence du métier, elle, tient en trois mots : *« read transcripts constantly »*[^9] — l'équivalent agentique du post-mortem SRE.

## 12.5 ADK ≠ runtime ≠ services de plateforme

C'est la distinction structurante du chapitre, et *« la source de confusion la plus fréquente »*[^3]. Trois couches, mêmes problèmes chez les trois hyperscalers, noms différents.

![Stack en trois couches : ADK / runtime / services de plateforme|1300](../../orchestration-agentique/images/20260527-05-stack-trois-couches.svg)

- **Couche 1 — ADK.** Le SDK qu'on importe : il définit la *forme* d'un agent (la classe, les types d'outils, le contrat de hand-off, la signature des middlewares). Deux axes de choix : vendeur vs ouvert, et niveau d'abstraction (DSL haut niveau comme CrewAI vs bas niveau comme LangGraph).
- **Couche 2 — Runtime.** *Là où les sessions tournent vraiment* : isolation entre sessions, durée maximale, cold-start, scaling, retry, persistance d'état. Une session de 8 h est impossible dans un Lambda (timeout) ; native dans AgentCore Runtime (microVM par session, jusqu'à 8 h, facturée à la consommation)[^6]. → [Ch. 22](ch22-runtime-manage.md).
- **Couche 3 — Services de plateforme.** Là où les hyperscalers se distinguent : mémoire (court/long terme), identité *on-behalf-of* (OAuth/OIDC), gateway (convertit n'importe quelle API en outils MCP-compatibles), observabilité (tracing OpenTelemetry → [Ch. 20](ch20-observabilite-cognitive-audit-trail.md)), code interpreter, browser tool.

> [!INFO] La phrase qui fait gagner une réunion
> *« On utilise AgentCore »* ne dit rien tant qu'on n'a pas précisé **quelles briques** parmi les six. *« On code en LangGraph »* ne dit rien tant qu'on n'a pas précisé **avec quel runtime**. Le tableau de bord change selon le cloud ; la liste des problèmes à régler est la même.

## 12.6 Le paysage des ADK en 2026

Les abstractions se ressemblent toutes (`Agent` + `tools` + `handoffs`). Le choix se joue donc sur le **socle** (modèle dominant, cloud existant), pas sur l'API.

![Cartographie 2026 : ADK ouverts, ADK vendeurs, runtimes, produits|1300](../../orchestration-agentique/images/20260527-06-cartographie-2026.svg)

| Framework | Éditeur | Posture | Trait distinctif | Repère |
|---|---|---|---|---|
| **LangGraph** | LangChain | Graphe déclaratif bas niveau | Persiste l'état après chaque nœud (replay, rollback, checkpointing) ; standard de facto en environnement régulé | Le plus rapide en latence sur un benchmark 2026 ; ~120 lignes là où des kits légers en demandent 40 |
| **CrewAI** | indépendant | DSL haut niveau | ~20 lignes pour un ReAct ; souvent migré vers LangGraph en prod | Porte ≈ 3× plus de tokens sur les tâches simples |
| **Mastra** | indépendant (TS) | TypeScript-first | Intégré Vercel/Next.js, populaire full-stack web | — |
| **Pydantic AI** | indépendant | Code-first | Mise sur la *type-safety* | — |
| **OpenAI Agents SDK** | OpenAI | Léger (routines + handoffs) | Production-grade ; handoffs/guardrails/tracing | GA mars 2025 (issu de Swarm)[^5] |
| **Claude Agent SDK** | Anthropic | Code-first, agent loop autonome | Extrait du moteur de Claude Code ; supporte les Skills | Skills annoncées mars 2026 ; crédit mensuel dédié mi-juin 2026[^1] |
| **Google ADK** | Google | Open-source multi-langage | Python/TS/Go/Java ; pivot du stack Vertex mais portable | > 7 M téléchargements au T1 2026[^7] |
| **Microsoft Agent Framework** | Microsoft | Fusion d'héritages | AutoGen + Semantic Kernel ; supporte le peer-to-peer | v1 GA avril 2026[^8] |

La ligne de partage tient en une phrase : **ADK ouverts** (LangGraph, CrewAI, Mastra, Pydantic AI) pour minimiser le lock-in ; **ADK vendeurs** (OpenAI Agents SDK, Claude Agent SDK, Google ADK, Microsoft Agent Framework) pour la friction minimale quand on a déjà choisi son socle. Une routine (OpenAI) = une instruction en langage naturel + des outils ; un *handoff* = une fonction qui retourne un agent différent. Les concepts voyagent d'un kit à l'autre.

## 12.7 Sécurité : le gruyère à trois couches

Aucune couche ne suffit seule ; c'est la superposition qui défend[^13].

![Le gruyère suisse de la sécurité : trois couches superposées|1300](../../agent-sdk/images/20260518-09-securite-couches.svg)

1. **Alignement du modèle** — refus d'actions destructrices sans confirmation, résistance aux prompt injections, pas d'auto-exfiltration. Première barrière, insuffisante seule.
2. **Contrôles du harness** — parser bash (comprendre ce que l'agent veut faire *avant* exécution, bloquer les patterns dangereux), système de permissions, hooks. La couche qu'on configure explicitement.
3. **Sandbox** — isolation réseau, filesystem scopé (`/workspace`, pas `/etc`), pas de root, limites CPU/RAM. Implémentée par Cloudflare Sandbox, Modal, E2B, Daytona.

> [!WARNING] La règle qui ne se négocie pas
> ==Le RBAC passe par l'infrastructure, jamais par le prompt.== Clés API scopées + proxies backend + tokens temporaires courts. Un prompt *« ne touche pas à ces données »* ne tient pas ; une clé qui n'a pas accès à ces données tient toujours. C'est le même principe que la défense en profondeur du [Ch. 21](ch21-gardefous-securite-globale.md), appliqué à la couche construction.

## 12.8 Sortie lecteur

Après ce chapitre, on doit pouvoir : (1) nommer la voie de build adaptée à son besoin (API brute / SDK / extension produit / managé) ; (2) répartir ses actions entre tools, bash et codegen selon le risque et la composabilité ; (3) ne plus confondre ADK, runtime et services de plateforme dans une discussion d'architecture ; (4) choisir un ADK par le socle plutôt que par l'abstraction ; (5) poser une sécurité en trois couches avec un RBAC ancré dans l'infra.

> [!CAUTION] Piège classique
> Choisir son framework d'agent par comparaison d'abstractions (« LangGraph a un plus joli graphe »). Les abstractions convergent ; ce qui ne converge pas, c'est le couplage au modèle, au cloud et au runtime. On choisit un socle, pas une API — et on le regrette quand on a choisi l'API.

---

[^1]: Anthropic, *Claude Agent SDK — overview*, https://code.claude.com/docs/en/agent-sdk/overview (consulté le 18 mai 2026) ; *Claude Code — overview*, https://code.claude.com/docs/en/overview. Le crédit mensuel dédié aux usages Agent SDK est annoncé mi-juin 2026.
[^2]: Aakash Gupta, *« 2025 was agents, 2026 is agent harnesses »*, essai, janvier 2026.
[^3]: Synthèse du dossier *Orchestration agentique* (mathieugug.github.io/orchestration-agentique, 27 mai 2026) ; voir Anthropic, *Building agents with the Claude Agent SDK*, https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk.
[^4]: Anthropic, *Building Effective Agents*, décembre 2024, https://www.anthropic.com/engineering/building-effective-agents.
[^5]: OpenAI, *New tools for building agents*, mars 2025, https://openai.com/index/new-tools-for-building-agents/ ; *Orchestrating Agents: Routines and Handoffs* (OpenAI Cookbook).
[^6]: AWS, *Introducing Amazon Bedrock AgentCore* (GA 13 octobre 2025), https://aws.amazon.com/blogs/aws/introducing-amazon-bedrock-agentcore-securely-deploy-and-operate-ai-agents-at-any-scale/ ; doc *What is Bedrock AgentCore*.
[^7]: Google Cloud, *Agent Development Kit*, https://google.github.io/adk-docs/ (annonces Cloud Next 2026).
[^8]: Microsoft, *Microsoft Agent Framework* (v1 GA avril 2026), annonces Build 2026.
[^9]: Thariq Shihipar (Anthropic), *Workshop Claude Code + Agent SDK*, 18 mai 2026 (transcription). Citations : agent file *« around 50 lines »*, *« bash became the first true code mode »*, *« read transcripts constantly »*.
[^10]: Matrice Tools / Bash / Codegen, dossier *Claude Code et l'Agent SDK* (mathieugug.github.io/agent-sdk, 18 mai 2026), §7.
[^11]: Anthropic, *How the agent loop works*, https://code.claude.com/docs/en/agent-sdk/agent-loop.
[^12]: Anthropic, *Automate workflows with hooks*, https://code.claude.com/docs/en/hooks-guide. Six points : `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `SessionEnd`, `UserPromptSubmit`.
[^13]: Modèle de sécurité en trois couches (alignement / harness controls / sandbox), dossier *agent-sdk* §9 ; providers de sandbox cités : Cloudflare Sandbox, Modal, E2B, Daytona.
