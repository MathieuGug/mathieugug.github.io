---
chapitre: 20
titre: "Runtime managé et déploiement"
acte: 4
acte_titre: "Mesures et garde-fous"
gabarit: standard
mots: 6240
statut: v1
date_maj: 2026-05-29
---

# Chapitre 20 — Runtime managé et déploiement

> **Acte IV — Mesures et garde-fous · Chapitre standard, ~22 pages**
> _2026 est l'année des **runtimes managés** pour agents : Claude Managed Agents en public beta (avril 2026), OpenAI Agent Builder, Vertex AI Agent Engine, Azure AI Foundry Agent Service (GA mai 2025), AWS Bedrock AgentCore (GA octobre 2025) avec ses six services composables. **Les trois couches du stack agentique 2026** — ADK ≠ runtime ≠ plateforme — et la frontière où le décideur signe — ou pas — l'engagement vis-à-vis d'un hyperscaler._

> [!QUESTION] Question d'ouverture
> En 2023, un agent était un script Python de 60 lignes autour d'un appel API ; on l'opérait à la main. En 2026, c'est une session de huit heures qui tourne sur une **microVM dédiée**, partage sa mémoire avec quinze autres agents via un protocole standard, et facture le client à la fin de son raisonnement. Entre les deux, **trois couches** se sont glissées qui ne portent pas le même nom selon le cloud, et qui pourtant règlent les mêmes problèmes. ==Quand vous dites *« on utilise AgentCore »* ou *« on tourne sur Vertex Agent Engine »*, **qu'est-ce que vous achetez exactement** — et qu'est-ce que vous payez en contrepartie sur la portabilité dans 18 mois ?==

> [!TLDR] TL;DR décideur
> - 2026 est la première année où **les runtimes managés** pour agents deviennent des produits sérieux. ==Claude Managed Agents (public beta avril 2026), OpenAI Agent Builder, AWS Bedrock AgentCore (GA octobre 2025), Vertex AI Agent Engine, Azure AI Foundry Agent Service (GA mai 2025)== absorbent une grande partie du plumbing (sessions longues, sandbox, isolation, scaling, consumption-based billing).
> - **Trois couches à ne pas confondre.** **(1) ADK** (Agent Development Kit) — le SDK qu'on importe dans le code (LangGraph, CrewAI, Claude Agent SDK, Google ADK, OpenAI Agents SDK, Microsoft Agent Framework). **(2) Runtime** — où les sessions tournent réellement (managé hyperscaler / self-hosted / spécialisé Temporal). **(3) Services de plateforme** — les briques périphériques (Memory, Identity, Gateway, Observability, Code Interpreter, Browser Tool). *« On utilise Bedrock »* ne dit rien tant qu'on n'a pas précisé **quelles briques**.
> - **Le runtime managé tranche cinq questions** : isolation entre sessions, durée maximale d'exécution, *cold-start*, scaling horizontal, persistance d'état entre redémarrages. Sur des sessions longues (4-8 heures avec 80 % d'attente I/O), la différence entre Lambda et AgentCore Runtime n'est pas marginale — c'est **la différence entre une facture viable et une facture monstrueuse**.
> - **Pricing consumption-based** = ==attente I/O souvent gratuite, paiement seulement sur le compute actif==. AgentCore Runtime facture *« only for what's consumed »* ; Claude Managed Agents idem. Pour un agent qui passe 80 % du temps à attendre une API externe, le gain économique vs container ECS-style allocation est d'un facteur 4 à 6.
> - **Le chemin de productionisation est codifié.** Prototyper dans Claude Code (validation logique gratuite), extraire la logique dans le SDK (souvent ~50 lignes après le harness), choisir une cible (local app / sandbox managé / Managed Agents). C'est le sweet spot pour 80 % des projets internes 2026.
> - ==**Code-first + protocoles ouverts** = la meilleure assurance anti-lock-in.== MCP standardise agent↔outils ; A2A standardise agent↔agent ; AG-UI standardise agent↔frontend. Tant que votre code consomme ces protocoles plutôt que des SDK propriétaires, vous gardez la portabilité. Le runtime devient révisable ; les briques de plateforme aussi.
> - **Trois pièges 100 % traçables.** *« On utilise AgentCore »* sans préciser **quelles briques** consommées (six services indépendants — la facture varie d'un facteur 10) · sandbox sans `on-behalf-of` identity, l'agent agit avec les droits du service plutôt que de l'utilisateur · pricing not read at signature — l'attente I/O est gratuite mais le code interpreter est facturé sur l'allocation peak, pas la moyenne.

---

## 20.1 Pourquoi 2026 est l'année des runtimes managés

### 20.1.1 Le déplacement

L'année 2024 a été celle des **boucles agentiques** ; 2026 est celle des **plateformes pour les opérer**. Le glissement se voit dans les annonces. Anthropic publie *Building Effective Agents*[^1] en décembre 2024, OpenAI sort Swarm dans la foulée pour expérimenter handoffs et routines, puis transforme l'éducatif en production avec l'Agents SDK en mars 2025[^3]. AWS atteint la GA de Bedrock AgentCore le **13 octobre 2025**[^4] avec ==six services composables indépendamment==. Google généralise son Agent Development Kit, qui dépasse 7 millions de téléchargements au premier trimestre 2026[^5]. Microsoft fusionne AutoGen et Semantic Kernel en Microsoft Agent Framework, dont la v1 entre en disponibilité générale en **avril 2026**[^6]. Anthropic met Claude Managed Agents en public beta en avril 2026. Sur la même période, le protocole A2A, donné par Google à la Linux Foundation en juin 2025, rassemble 150+ organisations[^7].

==Tout cet outillage répond à un déplacement de la question==. Tant qu'un agent restait un script *one-shot* — prompt → réponse → fin —, il n'y avait rien à orchestrer. À partir du moment où l'agent tourne pendant huit heures, appelle quinze outils, retient son raisonnement entre deux conversations, et coordonne ses actions avec d'autres agents, **quelqu'un doit décider qui pilote la boucle, qui sandbox, qui scale, qui facture**. Ce quelqu'un, c'est le runtime.

### 20.1.2 L'autre raison — économique

Le prix d'un million de tokens en classe Sonnet a été divisé par dix entre 2023 et 2026 ; en classe Haiku par cinquante. Une boucle agentique qui tournait à 4 € l'exécution en 2023 en coûte 8 centimes aujourd'hui — ce qui rend les patterns du type *evaluator-optimizer* (qui empilent les appels) financièrement défendables. ==Le coût marginal d'un *« et si on rajoutait une étape de vérification »* est passé d'inacceptable à acceptable.== Les architectures se sont densifiées en conséquence ; les sessions se sont allongées ; et les runtimes sont devenus le goulot opérationnel qui se monétise.

> [!INFO] Voir [Ch. 5 — Économie de l'inférence](ch05-economie-inference.md) · [Ch. 11 — Patterns d'orchestration](ch11-patterns-orchestration.md)
> Le [Ch. 5](ch05-economie-inference.md) a posé la pile 7 couches d'optimisation qui produit la LLMflation × 1000. Le [Ch. 11](ch11-patterns-orchestration.md) a posé les patterns canoniques d'orchestration et les 4 régimes de contrôle (code-driven / LLM-driven / graphe / autonome). La marche suivante — où ces patterns *tournent réellement*, et qui paye pour l'opération.

---

## 20.2 Trois couches à ne pas confondre

C'est la source de confusion la plus fréquente. *« On utilise Bedrock pour nos agents »* veut tout et rien dire — Bedrock, c'est à la fois un catalogue de modèles, un runtime d'exécution (AgentCore Runtime), et une suite de services de plateforme (Memory, Identity, Gateway, Observability, Code Interpreter, Browser Tool)[^12]. Pareil pour Vertex AI : Agent Engine (le runtime), ADK (le SDK), Memory Bank et les Eval services (la plateforme). Le découpage est le même chez les trois hyperscalers, mais avec des noms différents — et avec une frontière qu'il faut tracer pour décider sainement.

![Stack à trois couches — ADK, runtime, plateforme|1300](../../orchestration-agentique/images/20260527-05-stack-trois-couches.svg)

### 20.2.1 Couche 1 — ADK (Agent Development Kit)

Le SDK qu'on *importe dans le code*. Il définit la **forme** d'un agent : la classe, les types des outils, le contrat de hand-off, la signature des middlewares. Les choix se font sur deux axes : vendeur (lock-in à un modèle/cloud particulier) ou ouvert (agnostique), et niveau d'abstraction (très DSL comme CrewAI, très bas-niveau comme LangGraph).

| ADK | Mainteneur | Position 2026 |
|---|---|---|
| LangGraph | LangChain | Standard de facto pour workflows agentiques durables en environnements régulés[^8] |
| CrewAI | indépendant | Plus rapide à prototyper (20 lignes pour un ReAct), souvent migré vers LangGraph en prod[^9] |
| Mastra | indépendant (TypeScript) | TypeScript-first, intégré Vercel/Next.js, populaire côté web full-stack[^9] |
| OpenAI Agents SDK | OpenAI | Production-grade depuis mars 2025, support handoffs/guardrails/tracing[^3] |
| Claude Agent SDK | Anthropic | Extrait du moteur de Claude Code, supporte les Skills (annonce mars 2026)[^13] |
| Google ADK | Google | Open-source, 4 langages (Py/TS/Go/Java), pivot du stack Vertex[^5] |
| Microsoft Agent Framework | Microsoft | Fusion AutoGen + Semantic Kernel, v1 GA avril 2026[^6] |

### 20.2.2 Couche 2 — Runtime (exécution)

Là où **les sessions tournent vraiment**. Le runtime tranche les choses suivantes : isolation entre sessions, durée maximale d'exécution, *cold-start*, scaling horizontal, retry, persistance d'état entre redémarrages. Trois familles cohabitent en 2026.

- **Runtimes managés hyperscaler** — AWS Bedrock AgentCore Runtime (microVM par session, jusqu'à 8 h d'exécution, *« charge only for what's consumed »*[^12]), Google Vertex AI Agent Engine, Azure AI Foundry Agent Service. Ils absorbent tout le plumbing — vous déployez un binaire ou un container, ils gèrent la suite.
- **Self-hosted classique** — container ECS/GKE/Cloud Run, ou Lambda pour les courts. Plus de contrôle, plus d'opération.
- **Runtimes spécialisés** — Temporal-pour-agents, Inferable, plusieurs autres entrants. Ils visent les workflows durables avec *checkpointing* fin.

La différence pratique se voit sur des sessions longues. ==Une session de huit heures dans un Lambda est impossible (timeout). Dans un ECS, vous devez gérer le *liveness*, le retry, la persistance. Dans AgentCore Runtime, c'est natif et facturé à la consommation effective.== Pour les agents qui passent 80 % du temps à attendre une API externe, c'est la différence entre une facture viable et une facture monstrueuse.

### 20.2.3 Couche 3 — Services de plateforme

Là où les hyperscalers se distinguent vraiment, et où la complexité se cache. **AgentCore propose six briques distinctes**, chacune consommable indépendamment[^12]. C'est exactement le sujet de la section §20.3.

> [!IMPORTANT] La confusion qui coûte cher
> Quand un sponsor demande *« on est sur Bedrock pour nos agents »*, il a en tête une chose ; quand un acheteur signe un PO *« AgentCore »*, il signe une autre. Sans préciser **(1)** quelle ADK consomme le code, **(2)** quel runtime fait tourner la session, **(3)** quelles briques de plateforme sont allumées, ==le compte de fin de mois sera un mystère pendant 90 jours==. La discipline opératoire est de nommer les trois couches sur chaque cas d'usage en architecture decision record.

---

## 20.3 Les six briques de plateforme — anatomie AgentCore

AgentCore (référence de l'analyse parce que la plus modulaire) propose six briques distinctes, chacune consommable indépendamment[^12]. Google Vertex AI a sa propre déclinaison (Memory Bank, Agent Garden, A2A natif), Azure Foundry aussi. Le tableau de bord change selon le cloud ; ==**la liste des problèmes à régler est la même**==, parce qu'elle découle des modes d'échec du [Ch. 11](ch11-patterns-orchestration.md) §5.

![Anatomie du harness Claude Code — neuf satellites autour du modèle|1300](../../agent-sdk/images/20260518-02-anatomie-claude-code.svg)

### 20.3.1 Memory — court terme + long terme

Service de mémoire à deux étages : **session memory** (l'historique de la conversation pendant que la trajectoire tourne) et **long-term memory** (faits, préférences, résumés persistés entre sessions). AgentCore Memory chez AWS, Memory Bank chez Vertex (GA décembre 2025 avec extraction automatique des faits persistants), Foundry Memory chez Azure. Tous offrent une API REST pour read/write/forget et une politique d'expiration configurable.

Le [Ch. 9](ch09-memoire-agentique.md) détaille la cartographie 4 piliers × 5 architectures (Letta, A-MEM, Zep, Mem0, file-based) ; le [Ch. 10](ch10-compaction.md) détaille la compaction du pilier *travail*. Ici, on note simplement que **le service managé absorbe l'opération** — vous ne provisionnez plus un vector store, vous ne gérez plus l'extraction, vous ne tunez plus le retrieve. Le contrepoint : portabilité dégradée, et politiques d'oubli (RGPD art. 17) à vérifier explicitement dans la documentation du vendor.

### 20.3.2 Identity — l'agent au nom de l'utilisateur

Authentification *on-behalf-of*, compatible avec les fournisseurs d'identité existants (Okta, Azure AD, Google Workspace, AWS IAM). ==L'agent agit *au nom de l'utilisateur*, pas avec les droits du service==. C'est la différence entre *« cet agent peut lire toutes les bases »* et *« cet agent peut lire les bases que **Marie** a le droit de lire »*. AgentCore Identity gère ce *on-behalf-of* nativement, compatible OAuth/OIDC. Vertex et Foundry alignent.

Conséquence sécurité : sans identité déléguée, ==une injection indirecte dans un email lu déclenche une action avec les droits *admin* du service==. C'est exactement le scénario EchoLeak (cf. [Ch. 19](ch19-gardefous-securite-globale.md) §19.5.1) — la mitigation structurelle est *on-behalf-of*, pas un classifier de plus.

### 20.3.3 Gateway — outils MCP

Convertit n'importe quelle API (REST, Lambda, services existants) en outils MCP-compatibles. Permet aussi de fédérer des serveurs MCP existants — un seul endpoint unifié, allowlist namespace, *secrets management* centralisé. Du côté Vertex, c'est le rôle d'Agent Garden et des connecteurs natifs ; chez Foundry, c'est intégré dans le AI Agent Service.

C'est le layer où la matrice 10×10 du [Ch. 13](ch13-mcp-securite.md) s'instancie. Le service managé absorbe une partie du plumbing (auth, retries, *circuit breaking*, observabilité), pas la **politique de sécurité** — qui reste à votre charge. Sigstore + hash pinning + tool tagging + HITL writes, c'est vous qui décidez.

### 20.3.4 Observability — traces OTel natives

Tracing OpenTelemetry, vue unifiée des appels et des erreurs. AgentCore Observability émet des spans `gen_ai.*` conformes à la spec v1.37+ (cf. [Ch. 18](ch18-observabilite-cognitive-audit-trail.md)). Vertex et Foundry idem. La force du managé : ==le tracing est natif, pas optionnel==. La limite : si vous voulez le crosser avec votre stack APM existante (Dynatrace, Datadog), il faut exporter via OTLP — ce qui est possible mais à configurer.

Le [Ch. 18](ch18-observabilite-cognitive-audit-trail.md) §18.8 a posé l'arbitrage incumbents APM × challengers AI-native. Avec un runtime managé, vous avez **par défaut** un backend AI-native ; pour la couche infra/topologie, vous restez sur votre stack incumbent.

### 20.3.5 Code Interpreter — sandbox Python/JS/TS jusqu'à 8 h

Sandbox isolé pour exécuter du code généré par l'agent — jusqu'à huit heures de session. Filesystem scopé à `/workspace`, réseau allowlisté, pas d'accès root, limites CPU/RAM. C'est le service qui permet aux patterns *codegen* (cf. [Ch. 11](ch11-patterns-orchestration.md)) de tourner sans risquer le serveur du runtime.

Différences pratiques entre AgentCore Code Interpreter, Vertex Code Execution et Foundry Sandbox : la durée maximum (8 h vs 1 h vs 30 min), les langages supportés (Python+JS+TS vs Python vs Python+TypeScript), le pricing (consumption AWS vs allocation Vertex vs Foundry hybride). Sur un agent qui fait beaucoup de codegen long, l'écart de durée maximum est *load-bearing*.

### 20.3.6 Browser Tool — navigation distante

Navigateur distant : l'agent navigue le web *comme un humain*, sans pourrir la machine locale. Pour les agents computer-use ([Ch. 15](ch15-computer-use.md)), c'est le pendant managé du *headless browser* qu'on devait gérer soi-même. Le service offre une session isolée, un cookie store éphémère, des screenshots, et un protocole d'interaction (clicks, types, scrolls).

==Surface d'attaque inédite==, intimement liée à [Ch. 15](ch15-computer-use.md) : Visual Prompt Injection (VPI). Le browser tool managé sandbox la *navigation*, pas le *rendu*. Une page web hostile peut toujours injecter via une image rendue. Mitigation : OCR + classifier (cf. [Ch. 19](ch19-gardefous-securite-globale.md) surface (vi)).

> [!INFO] Voir [Ch. 18 — Observabilité](ch18-observabilite-cognitive-audit-trail.md) · [Ch. 19 — Sécurité](ch19-gardefous-securite-globale.md) · [Ch. 9](ch09-memoire-agentique.md)-[10](ch10-compaction.md) — Mémoire/Compaction
> Chaque brique de plateforme s'instancie dans une discipline déjà traitée. Memory ⇒ [Ch. 9](ch09-memoire-agentique.md)-[10](ch10-compaction.md). Identity + Gateway ⇒ [Ch. 19](ch19-gardefous-securite-globale.md) surfaces (iv) et (vi). Observability ⇒ [Ch. 18](ch18-observabilite-cognitive-audit-trail.md). Code Interpreter + Browser Tool ⇒ [Ch. 19](ch19-gardefous-securite-globale.md) sandboxing + [Ch. 15](ch15-computer-use.md) computer use. La valeur ajoutée du runtime managé n'est pas de *réinventer* ces disciplines — c'est de **fournir une implémentation par défaut** que vous gouvernez par configuration, pas par code.

---

## 20.4 Cartographie hyperscaler — qui propose quoi

![Cartographie 2026 — ADK ouverts, ADK vendeurs, runtimes managés, produits verticaux|1300](../../orchestration-agentique/images/20260527-06-cartographie-2026.svg)

### 20.4.1 AWS Bedrock AgentCore (GA 13 octobre 2025)

Le plus modulaire avec ses six briques indépendantes (§20.3). Pricing **consumption-based pur** : *« charge only for what's consumed »*[^12]. Sessions jusqu'à 8 h en Runtime. Intégrations natives Bedrock (modèles Claude, Llama, Titan, Mistral, Cohere via API unifiée), S3, DynamoDB, Lambda, EventBridge. ==Choix par défaut pour les organisations déjà AWS-natives== avec une équipe SRE/DevOps qui sait composer les briques.

Faiblesse : la modularité demande une discipline d'architecture. Une équipe qui consomme les six briques sans gouvernance produit un coût de fin de mois qui surprend tout le monde — le pricing est juste, le sous-dimensionnement est cher à diagnostiquer.

### 20.4.2 Google Vertex AI Agent Engine

Couple plus serré ADK + runtime + Memory Bank + A2A natif. ADK supporté en 4 langages (Python, TypeScript, Go, Java), open-source. Memory Bank GA décembre 2025. A2A first-class (Google a donné le protocole à la Linux Foundation en juin 2025). Intégrations natives Vertex AI (Gemini, modèles partenaires), BigQuery, Looker, Cloud Storage.

Force : l'ADK ouvert + A2A natif sont les meilleures portes anti-lock-in côté hyperscaler. Le runtime Agent Engine est moins modulaire que AgentCore, mais le couplage ADK-runtime est plus lisse — moins de glue code à écrire.

### 20.4.3 Azure AI Foundry Agent Service (GA mai 2025)

Aligné sur Microsoft Agent Framework (v1 GA avril 2026, fusion AutoGen + Semantic Kernel). Intégrations natives M365 (Outlook, Teams, SharePoint), Azure AD, Power Platform. Foundry est la couche unifiée pour modèles (OpenAI via deployment Azure + Phi + Llama via deployment partner). Tracing OTel-compliant.

Choix par défaut pour les organisations Microsoft-centric, et pour les intégrations M365. Le compromis : un couplage Azure plus serré qu'AgentCore — moins facile à *quitter*.

### 20.4.4 Claude Managed Agents (public beta avril 2026)

L'arrivée la plus récente, et la plus opinionated. Architecture *brain/hands separation* : Claude décide, le runtime exécute. Sandbox managée, sessions isolées, SSE streaming natif. Tightly coupled au Claude Agent SDK[^13] — vous écrivez le code dans le SDK, vous le portez en Managed pour la prod hostée. Le chemin canonique recommandé par Anthropic : *« A common path is to prototype with the Agent SDK locally, then move to Managed Agents for production »*.

Trade-off classique : moins de contrôle d'exécution, plus de simplicité opérationnelle. Le coût d'attente I/O est gratuit pendant le sleep, l'inférence est facturée séparément (modèle Anthropic).

### 20.4.5 OpenAI Agent Builder

Surface managée par OpenAI, taillée pour le Agents SDK et les modèles OpenAI. Intégrations natives ChatGPT enterprise, Responses API, Realtime API. Tracing intégré au dashboard OpenAI. La force : *time-to-prod* le plus court quand l'équipe est déjà sur OpenAI. La limite : portabilité OpenAI-only.

### 20.4.6 Synthèse — choisir, pas comparer

| Critère | AgentCore | Vertex Agent Engine | Foundry Agent Service | Claude Managed | OpenAI Agent Builder |
|---|---|---|---|---|---|
| Date GA | oct. 2025 | 2025 | mai 2025 | beta avril 2026 | 2026 |
| Modèle principal | tous via Bedrock | Gemini + partners | OpenAI + partners | Claude | OpenAI |
| Modularité briques | **6 indépendantes** | couplée | couplée | opinionated | couplée |
| Pricing | consumption-based | mixte | hybride | consumption-based | consumption-based |
| Session max | 8 h | variable | variable | 8 h | variable |
| ADK supportés | tous | Google ADK + autres | Microsoft AF + autres | Claude Agent SDK | OpenAI Agents SDK |
| Protocole A2A natif | en cours | **natif** | en cours | en cours | en cours |
| MCP gateway natif | **oui** | partiel | partiel | oui | partiel |
| OTel natif | oui | oui | oui | oui | oui |
| Lock-in factor | bas-moyen | moyen | moyen-haut | moyen | haut |

==Pour une entreprise déjà multi-cloud, ce qui compte n'est pas la capacité intrinsèque — c'est la **portabilité** et le **pricing model**.== Pour une entreprise mono-cloud, la cohésion avec l'IAM et les services data du cloud existant prime.

---

## 20.5 Le chemin de productionisation

Une fois le prototype tournant dans Claude Code (ou équivalent), vient la question : **comment je déploie ?** Le chemin classique, codifié par Anthropic[^13] mais valable pour tous les vendors, mérite d'être suivi tel quel.

![Trois voies effort × contrôle — Claude Code, Agent SDK, Client SDK|1300](../../agent-sdk/images/20260518-04-trois-voies.svg)

### 20.5.1 Prototyper dans Claude Code (ou équivalent)

Gratuit, rapide, valider que la logique d'agent tient avant d'investir en infrastructure. Cette phase est massivement sous-investie en pratique — beaucoup d'équipes attaquent directement le déploiement managé et découvrent en J+30 que la logique métier ne tient pas trois cas. ==La règle d'or : un agent qu'on n'a pas vu marcher sur 20 cas réels en local ne mérite pas un déploiement managé.==

### 20.5.2 Extraire la logique dans le SDK

Anthropic fait une observation qui surprend les gens : *« the actual agent file looks like… it's around 50 lines »*. Une fois le harness fourni par le SDK, le code spécifique à votre agent tient en quelques dizaines de lignes — surtout du wiring (working directory, prompt template, options du SDK). ==Le reste vit dans le filesystem (CLAUDE.md, scripts, skills).== Cette extraction est trivial techniquement, gigantesque opérationnellement : elle force à écrire ce que l'agent *fait* indépendamment de l'UI qu'il consomme.

### 20.5.3 Choisir une cible de déploiement

Trois cibles principales, en ordre croissant de couplage :

- **Local app.** CLI installable, ou app frontend type Lovable avec dev server local et hot reload. Anthropic argue : *« I actually think local apps may come back because AI agents are expensive to host continuously. »* L'argument économique est solide : un agent qui tourne sur la machine de l'utilisateur ne coûte rien en compute serveur ; seul le modèle (via API) est facturé.
- **Sandbox managé.** Cloudflare Sandbox, Modal, E2B, Daytona. La structure de déploiement devient : `sandbox.start; bun agent.ts`. L'infra de sandboxing est abstraite, vous focalisez sur la logique. Pertinent pour les usages multi-tenant où le code de l'agent doit tourner côté serveur (intégration Slack, webhook GitHub).
- **Managed Agents.** REST API hostée par le vendor, sandbox gérée, scaling. Pour les équipes qui veulent livrer en production sans opérer la sandbox elles-mêmes. C'est la suite naturelle d'un prototype SDK quand le produit prend forme.

> [!EXAMPLE] La voie courte pour 80 % des projets internes
> 1. Prototype Claude Code (1 semaine).
> 2. Extraction Agent SDK (~50 lignes, 2 jours).
> 3. Déploiement Managed Agents ou sandbox managé (1 semaine).
> 4. Itération sur transcripts et hooks (continu).
>
> Cinq semaines au lieu de cinq mois pour un projet equivalent self-hosted depuis zéro. ==Le gain n'est pas dans la sophistication du code — il est dans le **plumbing absorbé** par le runtime managé==.

---

## 20.6 Sécurité gruyère — trois couches qui combinent

Le [Ch. 19](ch19-gardefous-securite-globale.md) a posé les **cinq couches** de la défense en profondeur agentique. Côté runtime, le manuel d'Anthropic[^13] décline une version pragmatique pour un agent bash-driven : **trois couches** spécifiques au runtime, qui s'imbriquent dans le stack à cinq couches du [Ch. 19](ch19-gardefous-securite-globale.md).

![Le gruyère suisse à trois couches — sécurité d'un agent bash-driven|1300](../../agent-sdk/images/20260518-09-securite-couches.svg)

### 20.6.1 Couche 1 — Alignement modèle

Anthropic, OpenAI, Google investissent massivement sur l'alignement du modèle lui-même : il refuse les actions destructrices sans confirmation, il évite les prompt injections évidentes, il ne s'auto-exfiltre pas. Publication Anthropic sur le reward hacking — un modèle bien aligné ne triche pas pour atteindre son objectif. ==C'est la première barrière, mais elle ne suffit jamais== (cf. [Ch. 19](ch19-gardefous-securite-globale.md) §19.7.1 — Layer 1 training-time alignment).

### 20.6.2 Couche 2 — Harness controls

Le SDK fournit : un **parser bash** qui comprend ce que l'agent essaie de faire avant de l'exécuter (et permet de bloquer des patterns dangereux), un **permission system** qui restreint les tools accessibles, des **hooks** qui peuvent intercepter et refuser une action, des **prompting controls** qui orientent le comportement. C'est la couche que **vous** configurez explicitement.

Cinq points d'interception déterministes (variant selon SDK) : `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `UserPromptSubmit`. Vous décidez quoi bloquer, quoi laisser passer, quoi enrichir.

### 20.6.3 Couche 3 — Sandbox env

Isolation réseau (l'agent ne peut pas appeler des endpoints arbitraires), filesystem scope (l'agent ne voit que `/workspace`, pas `/etc`), execution scope (pas d'accès root, limites de CPU/RAM). C'est ce qui empêche l'exfiltration de données et limite le blast radius en cas de compromission. Les providers cités (Cloudflare, Modal, E2B, Daytona, AgentCore Code Interpreter, Vertex Code Execution, Foundry Sandbox) implémentent déjà ces garanties.

==Aucune des trois couches n'est suffisante seule — c'est la composition qui rend l'ensemble robuste.== C'est exactement le motif de défense en profondeur du [Ch. 19](ch19-gardefous-securite-globale.md) §19.10 appliqué au runtime.

### 20.6.4 RBAC — côté infra, pas côté prompt

Une insistance qui revient dans toutes les documentations vendor : ==**le contrôle d'accès passe par des clés API scopées, des proxies backend qui filtrent les requêtes, des tokens temporaires à courte durée de vie — jamais par un prompt** qui dit *« ne touche pas à ces données »*==. Un agent qui n'a pas accès à `users` via sa clé API ne touchera pas à `users`, quoi qu'il décide. Un agent qui a la clé mais à qui on a *demandé* de ne pas toucher peut être manipulé.

C'est précisément ce que résout *Identity / on-behalf-of* (§20.3.2) au niveau du runtime managé : l'agent porte les *droits de l'utilisateur* via OAuth/OIDC, pas une clé service avec droits admin. La fenêtre d'erreur s'effondre.

> [!ATTENTION] L'erreur récurrente — confondre alignement et sécurité
> Un agent en prod avec uniquement la couche 1 (modèle aligné) tombe à la première injection indirecte. ==Le service managé fournit la couche 3 (sandbox env) par défaut== ; il fournit *les primitives* de la couche 2 (parser, permissions, hooks) — c'est à vous de les configurer. Si votre déploiement managé n'a pas de configuration explicite des hooks et permissions, vous opérez en couche 1 + 3 sans couche 2 — ce qui se voit le jour du post-mortem.

---

## 20.7 Pricing consumption-based — anatomie de la facture

### 20.7.1 Ce qui change vs ECS / Lambda

Le pricing classique de cloud compute :

- **Lambda** : payé à la milliseconde, facturé sur durée × mémoire allouée. Timeout 15 minutes. Inadapté aux sessions agentiques longues.
- **ECS / GKE / Cloud Run** : payé sur containers running. Une session 8 h avec 80 % d'attente I/O facture 8 h de container — même quand l'agent dort.
- **Sandbox spécialisée (AgentCore Runtime, Claude Managed Agents)** : *consumption-based*. ==Payé uniquement sur le compute actif. L'attente I/O est souvent gratuite ou facturée à un facteur 10-50 fois inférieur.==

Pour un agent qui passe 80 % du temps à attendre une API externe — un agent SRE qui interroge des dashboards, un agent customer support qui attend des confirmations utilisateur, un agent research qui télécharge des PDF — ==le gain économique vs container ECS-style allocation est d'un facteur 4 à 6==.

### 20.7.2 Les six postes de coût d'un agent managé en production

Sur un AgentCore-type deployment, six postes à dimensionner :

1. **Compute Runtime** — facturé sur compute actif. 60-80 % de la facture si l'agent est compute-intensive.
2. **Modèle (inférence)** — facturé via Bedrock/Vertex/Anthropic API. 10-30 % de la facture sur des reasoning models.
3. **Memory** — facturé sur volume stocké + opérations read/write. Souvent <5 % de la facture mais facilement sous-estimé.
4. **Code Interpreter** — facturé sur sandbox-seconds + allocation peak (CPU/RAM). Variable selon usage codegen.
5. **Browser Tool** — facturé sur sandbox-seconds + bande passante. Variable selon usage computer-use.
6. **Observability** — facturé sur volume de spans + rétention. **Le poste le plus mal anticipé** (cf. [Ch. 18](ch18-observabilite-cognitive-audit-trail.md) §18.8.1 sur le piège per-LLM-span).

### 20.7.3 Les pièges de signature

Trois clauses à négocier explicitement avant signature :

- **Clause de révision tarifaire** — les pricing models de 2026 sont jeunes. Plusieurs vendors ont déjà ajusté à la baisse (compute) ou à la hausse (memory storage). Sans clause de révision, le contrat 3 ans signé en 2026 vous enferme dans un pricing qui aura bougé d'ici 18 mois.
- **Volume d'observabilité inclus** — par défaut, les vendors facturent les spans OTel au-delà d'un seuil. Pour un agent qui émet 100-500 spans par session, ce seuil arrive vite. Négocier un volume inclus aligné sur le volume réel.
- **Egress data** — sortir les données du cloud (vers backup, audit externe, ou autre cloud) coûte parfois plus que le compute. Pour un cognitive audit trail à rétention 5 ans (cf. [Ch. 18](ch18-observabilite-cognitive-audit-trail.md) §18.6.1), c'est un poste à dimensionner.

> [!WARNING] Le coût caché — l'attente I/O qui devient compute
> Un agent qui *« attend »* peut en fait *« réfléchir »* — un reasoning model en thinking mode brûle des tokens même quand il semble inactif. ==**L'attente I/O gratuite ne couvre que les vrais waits OS-level, pas les pauses de raisonnement.**== Vérifier sur les premières factures que ce que vous croyez gratuit l'est effectivement.

---

## 20.8 Anti-lock-in — code-first + protocoles ouverts

Le risque le plus signalé contre les runtimes managés est le **lock-in vendor**. C'est un risque réel, mais le manuel anti-lock-in est connu et applicable.

### 20.8.1 Trois protocoles transverses

**MCP** (agent ↔ outils) — lancé par Anthropic en novembre 2024, donné à la Linux Foundation en décembre 2025. 97 M téléchargements SDK mensuels en avril 2026. ==Si votre code consomme MCP plutôt qu'un *« Bedrock tool API »*, vous gardez la portabilité côté outils.==

**A2A** (agent ↔ agent) — Google, avril 2025 → Linux Foundation juin 2025. 150+ supporters en avril 2026. Standard agent-to-agent stateful avec Agent Card publié à `/.well-known/agent-card.json`. Si vos agents se parlent via A2A plutôt qu'un *« handoff Vertex »*, vous gardez la portabilité côté inter-agent.

**AG-UI** (agent ↔ frontend) — CopilotKit, événementiel SSE. Pour streamer raisonnements, états, tool results vers les frontends. Standard de fait côté UI.

### 20.8.2 Code-first

L'autre versant : ==**garder la logique métier dans du code que vous possédez**==, pas dans une configuration vendor-spécifique (workflow YAML AgentCore, JSON config Vertex, prompt template Foundry). Un déploiement code-first se résume à :

- Logique métier dans du code Python/TypeScript versionné.
- Composants infra (runtime, memory, identity, gateway, code interpreter) consommés via API standards (MCP, OTel).
- Configuration vendor minimale et reproductible (idéalement Terraform / Pulumi).

La migration de cloud, dans cette architecture, consiste à **re-pointer les API calls vers un autre vendor**, pas à réécrire la logique. ==Coût de migration : semaines, pas trimestres==.

### 20.8.3 Le sweet spot anti-lock-in

| Choix | Lock-in | Productivité initiale |
|---|---|---|
| ADK ouvert (LangGraph, Mastra) + runtime managé hyperscaler + briques de plateforme native | moyen | bonne |
| ADK vendeur (Claude SDK, OpenAI SDK) + Managed Agents du même vendor | élevé | excellente |
| ADK ouvert + self-hosted ECS/GKE + Memory open-source (Mem0/Letta) + Identity OAuth maison | bas | médiocre |
| ADK vendeur + runtime *autre* vendor (rare mais possible : Claude SDK + AWS Bedrock) | moyen | bonne |

==Le sweet spot anti-lock-in 2026 est la ligne 1== : ADK ouvert (LangGraph par défaut pour environnements régulés ; Mastra pour TypeScript) + runtime managé hyperscaler pour absorber le plumbing + protocoles ouverts (MCP, A2A) pour les intégrations. Le runtime devient révisable ; les briques de plateforme aussi.

> [!INFO] Voir [Ch. 12 — MCP plateforme](ch12-mcp-plateforme.md) · [Ch. 11 — Patterns d'orchestration](ch11-patterns-orchestration.md)
> Le [Ch. 12](ch12-mcp-plateforme.md) détaille MCP comme *« HTTP des agents »* et l'effet de réseau qui l'a installé en standard de facto. Le [Ch. 11](ch11-patterns-orchestration.md) §11.5.2 a introduit la trilogie ADK / runtime / plateforme et l'arbre de décision buy/build. Ici, le **deep-dive runtime**.

---

## 20.9 Décider — quand utiliser un runtime managé ?

L'arbre de décision pour un nouvel agent en 2026.

**Q1 — La session est-elle longue (> 30 min) ou multi-tour persistant ?** Si non, Lambda ou Cloud Run suffit ; le runtime managé est over-engineering. Si oui, continuer.

**Q2 — Avez-vous besoin de Memory long terme, Identity *on-behalf-of*, Browser ou Code Interpreter sandboxés ?** Si oui, le runtime managé devient l'option par défaut — chacune de ces briques coûte 2-4 semaines-ingénieur à construire correctement et autant à maintenir. Si non, self-hosted reste viable.

**Q3 — Avez-vous une équipe SRE / Cloud Architect en place ?** Si non, runtime managé impératif — la complexité de l'opération (microVM isolation, sandbox sécurité, scaling, observabilité OTel) n'est pas un sujet à apprendre en parallèle du build de l'agent. Si oui, le choix self-hosted devient défendable, à condition de doser.

**Q4 — Volume et latence sont-ils critiques ?** Si oui (latence p95 < 100 ms sur des actions cœur métier), le self-host devient préférable pour le tuning fin (quantification modèles, batching, speculative decoding du [Ch. 4](ch04-decode-speculative.md)). Si non, le runtime managé absorbe.

**Q5 — Compliance régulée (banque, santé, public) ?** Vérifier que le runtime managé offre Assured Workloads / S3NS / SecNumCloud / souveraineté de données alignés sur votre threat model (cf. [Ch. 16](ch16-analytics-agentique-banque.md) et [Ch. 23](ch23-gouvernance-ai-act.md)). Sinon, déploiement hybride (runtime self-hosted dans région souveraine + modèle via API régionale).

### 20.9.1 Signaux de migration vers managé

- **L'opération coûte plus que le développement.** Vous passez plus de temps à debugger les sessions crashées qu'à coder les nouveaux cas. Signe qu'un runtime managé vaut son prix.
- **Vous avez réécrit votre propre couche memory ou observabilité.** À ce stade, les briques de plateforme valent leur coût marginal — ce que vous bricolez existe en mieux ailleurs.
- **Le métier vous demande des évals continues, du replay, des audits.** Le graphe déclaratif + checkpointing devient quasi-obligatoire ; un agent autonome non-instrumenté ne passera pas la revue (cf. [Ch. 18](ch18-observabilite-cognitive-audit-trail.md) cognitive audit trail).

### 20.9.2 Signaux de migration *depuis* managé

- **La facture du runtime managé dépasse 30 % du coût total** et vous savez ce que vous faites en SRE. C'est le moment d'évaluer le self-host pour les workloads dont le profil est stable.
- **Contraintes uniques** (on-prem, latence < 50 ms, modèle propriétaire fine-tuné) que le runtime managé ne supporte pas. Ce sont les cas où le build *from scratch* commence à se défendre.

==Hors de ces deux signaux, **rester sur managé en 2026** est la bonne décision pour 80 % des projets internes==.

---

## 20.10 Récap chapitre — trois couches, une discipline

==**À retenir** : trois couches, une discipline.==

==**Trois couches** :== ADK (le SDK qu'on importe), Runtime (où les sessions tournent), Services de plateforme (les briques périphériques — Memory, Identity, Gateway, Observability, Code Interpreter, Browser Tool). *« On utilise AgentCore »* ou *« On tourne sur Vertex »* ne dit rien tant qu'on n'a pas nommé les trois.

**Une discipline.** Code-first + protocoles ouverts (MCP, A2A, AG-UI) + ADK ouvert (LangGraph par défaut en régulé) + runtime managé hyperscaler pour absorber le plumbing. ==Le runtime devient révisable ; le coût de migration tombe de trimestres à semaines.==

Pour une équipe Data & AI qui démarre en 2026 :

1. **Prototyper dans Claude Code** (ou équivalent product agent du vendor cible). Valider la logique sur 20 cas réels avant tout déploiement.
2. **Extraire en Agent SDK** dès que la logique tient (~50 lignes de code spécifique + CLAUDE.md + skills).
3. **Choisir un runtime managé** aligné sur l'IAM cloud existant. AgentCore par défaut côté AWS, Vertex AE côté GCP, Foundry côté Azure, Claude Managed côté Anthropic, OpenAI Agent Builder côté OpenAI.
4. **Configurer les six briques de plateforme explicitement.** Memory avec politique d'expiration (RGPD art. 17 — [Ch. 10](ch10-compaction.md)). Identity en *on-behalf-of* (sécurité — [Ch. 19](ch19-gardefous-securite-globale.md)). Gateway en MCP avec allowlist namespace + Sigstore ([Ch. 13](ch13-mcp-securite.md)). Observability en OTel natif ([Ch. 18](ch18-observabilite-cognitive-audit-trail.md)). Code Interpreter et Browser Tool sandboxés.
5. **Négocier les clauses de pricing** — révision tarifaire, volume d'observabilité inclus, egress data — *avant* signature, pas au premier renouvellement.

L'investissement marginal au-delà (multi-cloud actif, A2A inter-vendor, runtime custom Temporal) doit attendre une volumétrie qui le justifie — ==sinon il optimise une portabilité qu'on n'utilise pas==.

---

> [!WARNING] Trois pièges classiques (les trois sont 100 % traçables)
> ***« On utilise AgentCore »* sans préciser quelles briques** — six services indépendants, la facture varie d'un facteur 10. Une équipe qui consomme Runtime + Memory + Identity + Gateway + Observability + Code Interpreter + Browser Tool sans gouvernance produit une facture de fin de mois qui surprend tout le monde. Discipline minimale : architecture decision record qui nomme les trois couches sur chaque cas d'usage, avec dimensionnement chiffré par brique.
>
> **Sandbox sans on-behalf-of identity** — l'agent agit avec les droits du service plutôt que de l'utilisateur. Une injection indirecte dans un email lu déclenche une action avec les droits *admin* du service. ==C'est exactement le pattern EchoLeak (cf. [Ch. 19](ch19-gardefous-securite-globale.md) §19.5.1)== — la mitigation structurelle est *on-behalf-of* via OAuth/OIDC, pas un classifier de plus.
>
> **Pricing not read at signature** — l'attente I/O est gratuite, *mais le code interpreter est facturé sur l'allocation peak* (CPU/RAM peak), pas la moyenne. Un agent qui pic à 8 vCPU pendant 30 secondes et tourne à 1 vCPU le reste du temps est facturé 8 × duration sur cette brique. La fenêtre de surprise est sur les **premières factures** ; sans clause de révision, le contrat 3 ans devient un boulet 18 mois plus tard.

---

## Sources

[^1]: Anthropic, *Building Effective Agents*, décembre 2024. <https://www.anthropic.com/engineering/building-effective-agents>

[^3]: OpenAI, *New tools for building agents* (annonce Agents SDK), mars 2025. <https://openai.com/index/new-tools-for-building-agents/>

[^4]: AWS, *Introducing Amazon Bedrock AgentCore* (GA octobre 2025). <https://aws.amazon.com/blogs/aws/introducing-amazon-bedrock-agentcore-securely-deploy-and-operate-ai-agents-at-any-scale/>

[^5]: Google Cloud, *Agent Development Kit* documentation et annonces Cloud Next 2026. <https://google.github.io/adk-docs/>

[^6]: Microsoft, *Microsoft Agent Framework* (v1 GA avril 2026) — annonces Build 2026.

[^7]: Stellagent, *A2A Protocol Explained: How Google's Agent-to-Agent Standard Grew to 150+ Organizations*, avril 2026. <https://stellagent.ai/insights/a2a-protocol-google-agent-to-agent>

[^8]: GuruSup, *Best Multi-Agent Frameworks in 2026: LangGraph, CrewAI, AutoGen*, 2026. <https://gurusup.com/blog/best-multi-agent-frameworks-2026>

[^9]: Morph, *AI Agent Frameworks in 2026: 8 SDKs, ACP, and the Trade-offs*. <https://www.morphllm.com/ai-agent-framework>

[^12]: AWS, *Amazon Bedrock AgentCore — Overview*. <https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html>

[^13]: Anthropic, *Building agents with the Claude Agent SDK*. <https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk>
