---
chapitre: 11
titre: "Patterns canoniques et orchestration multi-agents"
acte: 2
acte_titre: "La boucle"
gabarit: charnière
mots: 7810
statut: v1
date_maj: 2026-05-29
---

# Chapitre 11 — Patterns canoniques et orchestration multi-agents

> **Acte II — La boucle · Chapitre standard, ~22 pages**
> _Dès que la tâche s'étend au-delà d'un agent unique, deux questions surgissent : avec **quel pattern** structure-t-on la décomposition, et **qui pilote** la boucle ? La grille complète : quatre régimes de contrôle, huit patterns canoniques, un stack en trois couches, cinq problèmes durs en prod, et un arbre de décision buy/build à quatre questions._

> [!QUESTION] Question d'ouverture
> En 2026, plus de la moitié des projets agentiques qui partent en *« multi-agents »* en reviennent en *« workflow routé »* dans les six mois — sans diminution mesurable de qualité, avec une **division par dix de la facture** et un debug redevenu lisible. Si l'écart de productivité entre un agent autonome et un workflow déterministe coûte un ordre de grandeur, et si la composition d'agents reproduit exactement les modes d'échec connus des systèmes distribués (handoffs typés, idempotence, observabilité), à quel moment précis bascule-t-on dans le multi-agent — et qui pilote la boucle quand on y est ?

> [!TLDR] TL;DR décideur
> - ==Le pattern est une décision d'architecture, pas un choix d'outil.== Huit patterns canoniques structurent l'écosystème 2026 (cinq workflows d'Anthropic — chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer — + trois topologies multi-agents : supervisor-workers, hierarchical, peer-to-peer). Tous se composent, aucun ne nécessite un framework dédié.
> - **Quatre régimes de contrôle** distinguent *qui pilote la boucle* : code-driven (workflow), LLM-driven (routines + handoffs), graphe déclaratif, agent autonome. Plus on monte vers l'autonomie, plus on gagne en flexibilité et plus on perd en prévisibilité — et plus l'observabilité devient critique. 70 % des cas se résolvent en régime 1 ou 2, sans jamais mériter l'étiquette « agentique » au sens fort.
> - **Le stack se découpe en trois couches** qu'il faut distinguer pour décider sainement : **ADK** (la forme d'un agent dans le code — LangGraph, CrewAI, OpenAI Agents SDK, Claude Agent SDK…), **runtime** (où les sessions tournent — Lambda, container, AgentCore Runtime…), **services de plateforme** (memory, identity, gateway, observability, sandbox, browser tool). « On utilise Bedrock » ne dit rien tant qu'on n'a pas précisé *quelles briques* parmi les six.
> - ==**Cinq problèmes durs** font crasher les agents en prod== — pas la qualité du modèle. Mémoire qui dérive, observabilité absente, identité non déléguée, idempotence cassée, amplification de tokens. Quatre des cinq sont traités ailleurs dans le livre ([Ch. 9](ch09-memoire-agentique.md), [Ch. 18](ch18-observabilite-cognitive-audit-trail.md), [Ch. 13](ch13-mcp-securite.md)/[Ch. 19](ch19-gardefous-securite-globale.md), [Ch. 10](ch10-compaction.md)) ; ils sont nommés et reliés ici pour qu'aucun ne reste orphelin dans la pile.
> - **Un arbre de décision à quatre questions** structure le buy/build : (Q1) cas d'usage standard du marché → produit vertical ; (Q2) workflow unique + besoins prod → ADK + runtime managé ; (Q3) spécificité forte + équipe SRE → self-host ; (Q4) contrainte unique (on-prem, edge, modèle maison) → build from scratch. Si toutes les réponses sont *non*, il n'y a probablement pas besoin d'un agent — un workflow Anthropic suffit, à un coût 10× moindre.
> - **L'équipe est l'angle mort.** La fabrique d'un agent décline quatre stades de maturité (Prototype · Pilote · Production · Mature multi-agents) × dix artefacts partagés. Une équipe qui livre des agents en prod, ce n'est pas un harness — c'est un atelier qui apprend. Le multi-agent est un saut de stade, pas un upgrade de subscription.

---

## 11.1 Pourquoi un chapitre dédié aux patterns

> [!INFO] Voir [Ch. 7 — Reason · Act · Observe](ch07-boucle-agentique.md)
> [Ch. 7](ch07-boucle-agentique.md) traite l'agent comme un objet unique enveloppé d'un harness à sept couches. Il fixe le principe *« start simple, measure, add complexity only when it delivers measurable value »* (règle Schluntz-Zhang[^1]) et décrit en détail le pattern à trois agents (§7.4) comme cas particulier d'orchestration. La taxonomie complète des huit patterns canoniques, les quatre régimes de contrôle qui décident qui pilote la boucle, et l'arbre de décision buy/build sont déroulés ici.

### 11.1.1 Le glissement 2023 → 2026

![Glissement chat → tool calling → boucle agentique → orchestration|1300](../../orchestration-agentique/images/20260527-01-shift-chat-systeme.svg)

L'année 2024 a été celle des **boucles agentiques** ; 2026 est celle des **plateformes pour les opérer**[^2]. Le glissement se voit dans la chronologie des annonces : Anthropic publie *Building Effective Agents*[^1] en décembre 2024, OpenAI sort Swarm dans la foulée pour expérimenter handoffs et routines[^3], puis transforme l'éducatif en production avec l'Agents SDK en mars 2025[^4]. AWS atteint la GA de Bedrock AgentCore le 13 octobre 2025[^5]. Google généralise son Agent Development Kit, qui dépasse 7 millions de téléchargements au premier trimestre 2026[^6]. Microsoft fusionne AutoGen et Semantic Kernel en Microsoft Agent Framework, dont la v1 entre en disponibilité générale en avril 2026[^7]. Sur la même période, le protocole Agent-to-Agent (A2A), donné par Google à la Linux Foundation en juin 2025, rassemble 150+ organisations en avril 2026[^8].

Tout cet outillage répond à un déplacement de la question. Tant qu'un agent restait un script *one-shot* — *prompt-réponse-fin* — il n'y avait rien à orchestrer. À partir du moment où l'agent tourne pendant huit heures, appelle quinze outils, retient son raisonnement entre deux conversations, et coordonne ses actions avec d'autres agents, ==quelqu'un doit décider qui pilote la boucle==. Ce quelqu'un, c'est l'orchestrateur. Et selon le régime choisi (§11.3), ce quelqu'un peut être le code applicatif, le modèle lui-même, un graphe déclaratif, ou un runtime managé chez un hyperscaler.

L'autre raison est économique. Le prix d'un million de tokens en classe Sonnet a été divisé par dix entre 2023 et 2026 ; en classe Haiku par cinquante ([Ch. 5](ch05-economie-inference.md)). Une boucle agentique qui tournait à 4 € l'exécution en 2023 en coûte 8 centimes aujourd'hui — ce qui rend les patterns du type *evaluator-optimizer* (qui empilent les appels) financièrement défendables. ==Le coût marginal d'un *« et si on rajoutait une étape de vérification »* est passé d'inacceptable à acceptable.== Les architectures se sont densifiées en conséquence.

---

## 11.2 Ce qu'on orchestre exactement

![Anatomie de la boucle agentique — quatre phases internes, quatre ressources externes, un orchestrateur|1300](../../orchestration-agentique/images/20260527-02-anatomie-boucle.svg)

Avant de répondre au *qui*, il faut être clair sur le *quoi*. Un agent — au sens 2026, pas au sens 2023 — c'est quatre choses qui doivent être maintenues vivantes ensemble : **le modèle** (Claude, GPT, Gemini, Llama — l'orchestrateur n'en dépend pas et l'on doit pouvoir le switcher sans changer la logique), **les outils** (tout ce que l'agent peut appeler pour agir : API REST, fonctions Python, serveurs MCP, sandboxes de code, navigateurs distants — l'interface contractuelle), **la mémoire** (trois couches en réalité : la fenêtre de contexte d'un appel, la mémoire de session, la mémoire long-terme persistée), et **le contrôle** (qui décide quoi tourne ensuite : passer la main, appeler tel outil, déclarer la tâche finie, demander une validation humaine).

Ces quatre ressources tournent autour de la boucle à quatre temps *perceive → decide → act → observe* déjà rencontrée au [Ch. 7](ch07-boucle-agentique.md). L'orchestration **n'est** ni le modèle, ni les outils, ni la mémoire, ni le contrôle. C'est la *colle* qui fait tenir ces quatre ressources ensemble dans la durée. Concrètement, l'orchestrateur tranche cinq questions à chaque tour de boucle :

1. **Qui est l'agent actif maintenant ?** Si on est dans un système multi-agents, est-ce que c'est encore le triagiste, ou est-ce qu'on a passé la main au spécialiste ?
2. **Quel contexte lui présente-t-on ?** Combien de tours d'historique, quels documents, quels résultats d'outils sont injectés dans le prompt ?
3. **Quels outils a-t-il le droit d'appeler ?** Toute la liste, ou un sous-ensemble dépendant de son rôle et de son identité ?
4. **Comment réagit-on à un crash ou un timeout ?** Replay depuis le dernier checkpoint, escalade à un humain, échec propre, retry avec backoff ?
5. **Comment trace-t-on tout ça ?** Quels événements sont émis pour debug, audit, évaluation et facturation ?

Selon le régime choisi, ces cinq questions sont tranchées par du code que vous écrivez, par le modèle lui-même via du *prompt engineering*, par un graphe déclaratif type LangGraph, ou par un runtime managé qui en absorbe une partie.

> [!NOTE] La distinction workflow vs agent — la maxime devenue canonique
> Dans *Building Effective Agents*[^1], Anthropic distingue deux modes : les **workflows**, où les étapes sont définies dans le code et le LLM est appelé à des points fixes, et les **agents**, où le LLM décide lui-même quelles étapes prendre. La maxime qui en découle est devenue canonique : *« Utilisez un workflow quand le chemin est prévisible ; réservez l'agent aux tâches qui exigent flexibilité et décision contextuelle ».* Cela posé, ==le spectre n'est pas binaire== — c'est ce qu'on regarde dans la section suivante.

---

## 11.3 Quatre régimes de contrôle

![Spectre des quatre régimes de contrôle — code-driven, LLM-driven, graphe déclaratif, agent autonome|1300](../../orchestration-agentique/images/20260527-03-spectre-controle.svg)

L'écosystème a stabilisé quatre régimes, qui se distinguent moins par leurs outils que par la **position du pilote**. Plus on monte vers la droite du spectre, plus on délègue la décision au modèle ; plus on gagne en flexibilité ; plus on perd en prévisibilité — et plus l'observabilité devient critique[^9].

### 11.3.1 Régime 1 — Code-driven (workflow)

L'application reste pilote. Le LLM est appelé à des étapes fixes, comme un service externe enrichi. C'est exactement le mode « workflow » d'Anthropic, et c'est le régime à privilégier ==chaque fois que le chemin est connu à l'avance==. Extraction de champs structurés, classification, traduction multi-étapes, modération en pipeline : autant de cas où un graphe d'appels fixe bat un agent autonome en stabilité, en coût et en debug. Le risque ici est l'inverse de l'agent fugueur : c'est l'over-engineering, l'ajout d'étapes qui n'apportent rien.

### 11.3.2 Régime 2 — LLM-driven (routines + handoffs)

C'est l'invention d'OpenAI Swarm[^3], reprise dans l'Agents SDK. Une **routine** est, dans la documentation officielle, *« une instruction en langage naturel associée aux outils nécessaires à son exécution »*. Dans l'API, cela se traduit par la classe `Agent` : un système prompt + une liste de tools. Un **handoff** est *« une fonction qui retourne un agent différent »* : c'est la primitive qui permet au modèle de transférer le contrôle à un autre agent — typiquement un spécialiste — sans que l'application n'ait à orchestrer cela par du code.

> [!EXAMPLE] La signature minimale d'un handoff (OpenAI Agents SDK)
> ```python
> triage = Agent(
>     name="Triage",
>     instructions="Si la demande concerne un remboursement, passe la main "
>                  "à 'Refund'. Sinon réponds.",
>     tools=[lookup_order],
>     handoffs=[refund_agent, billing_agent]
> )
> ```
> ==L'élégance du modèle est qu'il fait porter la logique de routing par le prompt et non par du code.== Le revers : la décision est *dans la tête du modèle*. On l'audite *a posteriori* via les traces, pas *a priori* via une revue de code. Pour des cas non-régulés, ça suffit ; pour des workflows soumis à audit (santé, finance), on préfère le régime 3.

### 11.3.3 Régime 3 — Graphe déclaratif

LangGraph, devenu en 2026 le standard de facto des workflows agentiques durables[^10], pousse à modéliser explicitement les nœuds (agents, outils, validateurs) et les arêtes conditionnelles. Le moteur exécute, **persiste l'état après chaque nœud**, et permet de reprendre la session après crash, de la rejouer pour audit, ou de la *rollback* à un checkpoint. L'avantage : on a un objet inspectable, versionnable, qui peut être audité avant déploiement. Le coût : 120 lignes de code là où Smolagents en demande 40[^11]. ==La verbosité est délibérée — c'est ce qu'on paie pour que le système reste lisible quand il atteint quinze nœuds.==

Les déploiements en production cités par LangChain donnent une idée du calibre du segment : Klarna, Uber, LinkedIn, BlackRock, Cisco, JPMorgan, Replit, Elastic[^10]. La caractéristique commune : ce sont des environnements réglementés ou critiques où le coût d'une *boîte noire* est insupportable.

### 11.3.4 Régime 4 — Agent autonome (boucle libre)

Le modèle pilote, point. La boucle tourne jusqu'à condition de stop — *« done »*, plafond de tours atteint, erreur, ou intervention humaine. C'est le régime de Claude Code, de Devin, de Cursor en mode agent. La documentation Claude Agent SDK le décrit ainsi : *« L'agent évalue le prompt, appelle des outils pour agir, reçoit les résultats, et répète jusqu'à ce que la tâche soit terminée »*[^12]. Le pattern interne est *gather context → take action → verify work → repeat* — exactement la **variante 2** identifiée au [Ch. 7](ch07-boucle-agentique.md) §7.3.

Ce régime est le plus puissant et le plus dangereux. Puissant parce qu'il libère le modèle de la rigidité du graphe pour explorer un espace de tâches non-décomposable à l'avance — typiquement le debugging d'une régression, la rédaction d'une étude qui demande de la recherche, l'exploration d'un grand code base. Dangereux parce qu'il invite tous les modes d'échec de la §11.6 : amplification de tokens, mémoire qui dérive, observabilité difficile, idempotence à recalculer.


> [!ATTENTION] La recommandation Anthropic, devenue convergence d'industrie
> Réserver l'autonomie aux cas où elle est nécessaire, et privilégier les régimes plus déterministes dès qu'on peut. ==Le régime 4 contient toujours les régimes inférieurs : un agent autonome appelle ses propres workflows et ses propres routines.== La question n'est pas *« faut-il un agent ? »* mais *« à quelle profondeur d'autonomie place-t-on la couture entre code et décision-modèle ? »*.

---

## 11.4 Les huit patterns canoniques

![Huit patterns canoniques — cinq workflows Anthropic + trois topologies multi-agents|1300](../../orchestration-agentique/images/20260527-04-patterns-canoniques.svg)

Les patterns sont à l'orchestration ce que les *design patterns* étaient à l'OO des années 1990 : un vocabulaire partagé pour décrire des structures qui marchent. Le canon 2026 tient en huit éléments — cinq workflows d'Anthropic, trois topologies multi-agents. Aucun n'a besoin d'un framework ; tous se composent.

### 11.4.1 Les cinq workflows d'Anthropic

**Prompt chaining** — la sortie d'un LLM est l'entrée du suivant. Usage canonique : brouillon → édition → résumé. Idéal pour des tâches dont la décomposition est stable et où chaque étape gagne à être spécialisée. C'est le pattern le plus simple, et l'un des plus puissants quand le pipeline est clair.

**Routing** — un premier LLM classe la requête et choisit la suite (modèle, branche). Anthropic[^1] donne l'exemple du tri Haiku/Sonnet/Opus : faciles à Haiku, durs à Opus, mediums à Sonnet — gains de coût directs. ==C'est le pattern qui produit les gains de FinOps les plus immédiats==, parce qu'il fait correspondre la complexité du modèle à la complexité de la tâche.

**Parallelization** — deux variantes qu'Anthropic distingue soigneusement[^1]. Le **voting** exécute la même tâche en parallèle plusieurs fois et agrège (majoritaire, médiane, ou jury LLM) ; il vise la **robustesse**. Le **sectioning** découpe en sous-tâches indépendantes connues à l'avance ; il vise la **latence**. Le cas canonique de voting : modération sur trois axes en parallèle (toxicité, PII, conformité régu). Le cas canonique de sectioning : générer en parallèle l'introduction, le corps, la conclusion d'un livrable structuré.

**Orchestrator-workers** — un orchestrateur LLM décompose la tâche **à la volée**, délègue à des workers, fusionne les résultats. Différence cruciale avec le parallel sectioning : ==les sous-tâches ne sont *pas connues à l'avance*==. C'est la structure de Claude Code éditant plusieurs fichiers en parallèle quand l'agent a découvert pendant la session quels fichiers méritent l'édition.

**Evaluator-optimizer** — un LLM génère, un autre évalue, on boucle jusqu'à passage. C'est la traduction itérative, ou la boucle *code-lint-fix* d'un coding agent. C'est aussi la structure du **pattern à trois agents** vu au [Ch. 7](ch07-boucle-agentique.md) §7.4 (planner / generator / evaluator) — qui en est l'instanciation production-grade, avec file-based handoff et evaluator calibré sceptique.

> [!INFO] Voir [Ch. 7 — Reason · Act · Observe](ch07-boucle-agentique.md) §7.4 — Le pattern à trois agents
> Le pattern GAN-inspiré (planner / generator / evaluator) documenté par Anthropic Labs en mars 2026 est un cas particulier d'**evaluator-optimizer** étendu par un **planner** en amont. La séparation des trois rôles crée le signal correctif que l'auto-critique d'un agent unique ne fournit pas — c'est pourquoi le mono-agent s'effondre au-delà de 30 min wall-clock. [Ch. 7](ch07-boucle-agentique.md) traite l'économie du pattern (mono 20 min/9 $ vs trois agents 6 h/200 $) ; il est replacé ici dans la taxonomie complète.

### 11.4.2 Les trois topologies multi-agents

**Supervisor-workers** — version explicite de l'orchestrator-workers, où les workers sont des *agents distincts* (chacun avec son prompt, ses outils, ses garde-fous). C'est la structure typique d'un Sierra qui dispatche entre CRM, refund et escalation humaine[^13]. La différence opérationnelle avec orchestrator-workers : ici les workers sont **persistants et adressables** (chacun a son identité, ses permissions, son catalogue d'outils), là où l'orchestrator-workers est plus dynamique et éphémère.

**Hierarchical** — l'arbre se prolonge — un superviseur de superviseurs. Permet de *borner le contexte* de chaque sous-arbre, ce qui devient critique au-delà de cinq ou six agents (sinon la fenêtre de contexte du superviseur racine explose). C'est la structure que Microsoft a documentée pour l'orchestrateur multi-domaine ITSM décrit en [Ch. 7](ch07-boucle-agentique.md) §7.4.4 — un orchestrateur racine qui route entre réseau / app / data, chaque domaine ayant son sous-superviseur et ses workers spécialisés.

**Peer-to-peer** — conversation égalitaire entre agents, popularisée par AutoGen (et donc par le Microsoft Agent Framework[^7]). Plus libre, plus difficile à borner — adapté à la simulation et à la délibération, moins à l'exécution déterministe. C'est le pattern où la garantie de terminaison est la plus faible : sans condition de stop explicite, deux agents peuvent débattre indéfiniment.

> [!IMPORTANT] La maxime non-écrite — on compose
> ==La même règle revient chez Anthropic, chez LangChain et chez AWS : on compose==. Un système réel enchaîne souvent **routing → orchestrator-workers → evaluator-optimizer**, avec une couche **supervisor-workers** par-dessus quand les agents deviennent plusieurs. Les frameworks qui ont gagné en 2026 (LangGraph, l'Agents SDK d'OpenAI, l'ADK Google) ne sont pas ceux qui fournissent le pattern le plus sophistiqué — ce sont **ceux qui rendent la composition lisible**.

> [!INFO] Voir [Ch. 14 — Surfaces agentiques et levels of autonomy](ch14-surfaces-agentiques.md)
> Les quatre régimes (§11.3) traitent le pilote *interne* de la boucle. Les **quatre régimes d'accès** du [Ch. 14](ch14-surfaces-agentiques.md) (chat / copilote inline / canvas génératif / on-behalf-of) traitent le pilote *côté utilisateur final*. Et la grille **levels of autonomy** du Knight Institute, posée transversalement dans le [Ch. 14](ch14-surfaces-agentiques.md), articule les deux. À lire de pair pour décider de l'expérience de bout en bout, pas seulement de l'architecture interne.

---

## 11.5 Le stack en trois couches — ADK ≠ runtime ≠ plateforme

![Le stack en trois couches — ADK, runtime, services de plateforme|1300](../../orchestration-agentique/images/20260527-05-stack-trois-couches.svg)

C'est la source de confusion la plus fréquente. *« On utilise Bedrock pour nos agents »* veut tout et rien dire — Bedrock, c'est à la fois un catalogue de modèles, un runtime d'exécution (AgentCore Runtime), et une suite de services de plateforme (Memory, Identity, Gateway, Observability, Code Interpreter, Browser Tool)[^14]. Pareil pour Vertex AI : Agent Engine (le runtime), ADK (le SDK), Memory Bank et les Eval services (la plateforme). Le découpage est le même chez les trois hyperscalers, mais avec des noms différents — et avec une frontière qu'il faut tracer pour décider sainement.

### 11.5.1 Couche 1 — ADK (Agent Development Kit)

Le SDK que vous *importez dans votre code*. Il définit la **forme** d'un agent : la classe, les types des outils, le contrat de hand-off, la signature des middlewares. Les choix se font sur deux axes : vendeur (lock-in à un modèle/cloud particulier) ou ouvert (agnostique), et niveau d'abstraction (très DSL comme CrewAI, très bas-niveau comme LangGraph).

| ADK | Mainteneur | Position 2026 |
|---|---|---|
| LangGraph | LangChain | Standard de facto pour workflows agentiques durables en environnements régulés[^10] |
| CrewAI | indépendant | Plus rapide à prototyper (≈ 20 lignes pour un ReAct), souvent migré vers LangGraph en prod[^11] |
| Mastra | indépendant (TypeScript) | TypeScript-first, intégré Vercel/Next.js, populaire côté web full-stack[^11] |
| OpenAI Agents SDK | OpenAI | Production-grade depuis mars 2025, support handoffs/guardrails/tracing[^4] |
| Claude Agent SDK | Anthropic | Extrait du moteur de Claude Code, supporte les Skills (annonce mars 2026)[^15] |
| Google ADK | Google | Open-source, 4 langages (Py/TS/Go/Java), pivot du stack Vertex[^6] |
| Microsoft Agent Framework | Microsoft | Fusion AutoGen + Semantic Kernel, v1 GA avril 2026[^7] |

### 11.5.2 Couche 2 — Runtime (exécution)

Là où **les sessions tournent vraiment**. Le runtime tranche les choses suivantes : isolation entre sessions, durée maximale d'exécution, *cold-start*, scaling horizontal, retry, persistance d'état entre redémarrages. Trois familles cohabitent en 2026 :

- **Runtimes managés hyperscaler** — AWS Bedrock AgentCore Runtime (microVM par session, jusqu'à 8 h d'exécution, *« charge only for what's consumed »*[^14]), Google Vertex AI Agent Engine, Azure AI Foundry Agent Service. Ils absorbent tout le plumbing — vous déployez un binaire ou un container, ils gèrent la suite.
- **Self-hosted classique** — container ECS/GKE/Cloud Run, ou Lambda pour les courts. Plus de contrôle, plus d'opération.
- **Runtimes spécialisés** — Temporal-pour-agents, Inferable, plusieurs autres entrants. Ils visent les workflows durables avec *checkpointing* fin.

==La différence pratique se voit sur des sessions longues.== Une session de huit heures dans un Lambda est impossible (timeout) ; dans un ECS, vous devez gérer le *liveness*, le retry, la persistance. Dans AgentCore Runtime, c'est natif et facturé à la consommation effective. Pour les agents qui passent 80 % du temps à attendre une API externe, c'est la différence entre une facture viable et une facture monstrueuse.

> [!INFO] Voir [Ch. 20 — Runtime managé et déploiement](ch20-runtime-manage.md)
> La couche 2 (runtime) est traitée en profondeur en [Ch. 20](ch20-runtime-manage.md) : matrice vendor (Bedrock AgentCore / Vertex Agent Engine / Foundry Agent Service / Claude Managed Agents / OpenAI Agent Builder), pricing consumption-based, dépendance et **code-first + protocoles ouverts** (MCP, A2A) comme meilleure assurance anti-lock-in.

### 11.5.3 Couche 3 — Services de plateforme

Là où les hyperscalers se distinguent vraiment, et où la complexité se cache. AgentCore propose six briques distinctes, chacune consommable indépendamment[^14] :

- **Memory** — court terme (session), long terme (faits/préférences/résumés persistés). Traité [Ch. 9](ch09-memoire-agentique.md) (cartographie) et [Ch. 10](ch10-compaction.md) (compaction).
- **Identity** — authentification *on-behalf-of*, compatible avec les fournisseurs d'identité existants. ==L'agent agit *au nom de l'utilisateur*, pas avec les droits du service.== C'est la différence entre une injection bornée et une exfiltration admin.
- **Gateway** — convertit n'importe quelle API (REST, Lambda, services existants) en outils MCP-compatibles. Permet aussi de fédérer des serveurs MCP existants. Renvoi [Ch. 12](ch12-mcp-plateforme.md) (MCP) et [Ch. 13](ch13-mcp-securite.md) (sécurité MCP).
- **Observability** — tracing OpenTelemetry, vue unifiée des appels et des erreurs. Traité [Ch. 18](ch18-observabilite-cognitive-audit-trail.md).
- **Code Interpreter** — sandbox isolé pour exécuter du Python, JavaScript ou TypeScript — jusqu'à huit heures.
- **Browser Tool** — navigateur distant : l'agent navigue le web *comme un humain*, sans pourrir la machine locale. Renvoi [Ch. 15](ch15-computer-use.md) (computer use).

Google Vertex AI a sa propre déclinaison (Memory Bank, Agent Garden, A2A natif), Azure Foundry aussi. ==Le tableau de bord change selon le cloud ; **la liste des problèmes à régler est la même**==, parce qu'elle découle des modes d'échec de la §11.6.

### 11.5.4 La cartographie 2026 — quatre bandes plus deux protocoles

![Cartographie 2026 — ADK ouverts, ADK vendeurs, runtimes managés, produits verticaux, et deux protocoles transverses|1300](../../orchestration-agentique/images/20260527-06-cartographie-2026.svg)

La cartographie n'a pas vocation à recenser tout l'écosystème — elle a vocation à donner les *bandes* dans lesquelles raisonner. Quatre bandes plus deux protocoles transverses.

**ADK ouverts** — choix par défaut quand on veut éviter le lock-in vendeur. LangGraph domine en production régulée ; CrewAI prototypage rapide ; Mastra TypeScript-first ; Pydantic AI sur la *type-safety*. Un benchmark de 2026 montre que LangGraph est le plus rapide en latence sur cinq tâches standard, et que CrewAI porte le plus de tokens sur les tâches simples (≈ 3× les autres pour un appel à un outil)[^11]. ==La leçon : un framework qui rend tout facile rend aussi tout cher.==

**ADK vendeurs** — friction minimale si on adhère au socle du vendeur. OpenAI Agents SDK (modèle OpenAI principal, mais agnostique sur le runtime) ; Claude Agent SDK (taillé pour Claude, partage le moteur de Claude Code) ; Google ADK (couplé Vertex mais 4 langages) ; Microsoft Agent Framework (Azure). Le choix se joue sur le socle de modèle dominant et sur l'environnement existant — pas sur les abstractions, qui se ressemblent toutes (Agent + tools + handoffs).

**Runtimes + plateformes managés** — les hyperscalers. AWS Bedrock AgentCore reste le plus modulaire avec ses six briques indépendantes ; Vertex AI Agent Engine couple plus serré ADK + runtime + Memory Bank ; Azure Foundry s'aligne sur Microsoft Agent Framework. Le différentiel pratique : *pricing model* (consommation effective chez AWS *vs* allocation chez certains autres), couplage avec l'IAM cloud, intégrations natives avec les services data du cloud. Pour une entreprise déjà multi-cloud, ça compte plus que les capacités intrinsèques.

**Produits verticaux** — le *« buy »* dans la décision build-vs-buy (§11.7). Sierra a fait du support client agentique un produit (Sonos, WeightWatchers, SiriusXM)[^13] ; Harvey occupe le segment légal ; Claude Code, Cursor et Devin se disputent l'ingénierie logicielle ; Hippocratic AI cible la santé ; Lindy, EvenUp et d'autres montent sur des niches. La logique est simple : si quelqu'un a déjà payé la dette d'évals, le tuning métier et le support 24/7, ==réinventer n'a aucun sens stratégique==.

**Protocoles transverses** — MCP (agent ↔ outils, lancé par Anthropic en novembre 2024, désormais quasi-universel) et A2A (agent ↔ agent, donné par Google à la Linux Foundation en juin 2025, 150+ organisations en avril 2026[^8]). Ce sont les deux protocoles qui rendent les agents *inter-opérables* — sans eux, chaque vendeur réinventerait sa colle propriétaire, et le marché se fragmenterait. Ils ne sont pas concurrents : ==MCP est *vertical* (un agent vers ses outils), A2A est *horizontal* (un agent vers un autre agent, possiblement d'un autre vendeur)==.

> [!INFO] Voir [Ch. 12 — MCP plateforme](ch12-mcp-plateforme.md) et [Ch. 13 — Sécurité MCP](ch13-mcp-securite.md)
> La trinité **MCP × A2A × AG-UI** est traitée en [Ch. 12](ch12-mcp-plateforme.md) (la promesse, le réseau, le layering avec function calling et OpenAPI) et la matrice défensive **10 vecteurs × 10 patterns** pour MCP en [Ch. 13](ch13-mcp-securite.md) (la dette de sécurité que la promesse fait porter). Le rôle des deux protocoles dans le stack est posé ici ; les deux chapitres dédiés creusent la promesse et le coût.

---

## 11.6 Les cinq problèmes durs en prod

![Cinq problèmes durs qui font crasher les agents — mémoire, observabilité, sécurité, idempotence, coût|1300](../../orchestration-agentique/images/20260527-07-problemes-prod.svg)

Les boucles agentiques ne crashent pas pour les raisons qu'on imagine. Elles ne crashent pas parce que le modèle hallucine — ça, c'est traité au niveau du modèle. Elles crashent parce que ==**les couches autour de la boucle ne tiennent pas la durée**==. Cinq problèmes durs reviennent dans toutes les *post-mortem* publiques de 2025-2026. Quatre des cinq sont traités en profondeur ailleurs dans le livre ; on les nomme ici pour qu'aucun ne reste orphelin de l'architecture.

### 11.6.1 Mémoire et contexte

Le problème classique : l'agent oublie ce qu'on lui a dit il y a trente tours, ou pire, hallucine un fait d'une session précédente. La cause technique : la fenêtre de contexte est finie, l'historique cru ne tient pas, l'application doit choisir quoi garder. L'approche naïve (*« dump everything »*) brûle les tokens et dégrade le raisonnement[^16]. L'approche mature consiste à dédier une couche mémoire qui résume, indexe et réinjecte au bon moment — Mem0, Letta, Zep, AgentCore Memory côté AWS, Memory Bank côté Vertex. Un algo *token-efficient* publié en avril 2026 a montré qu'on pouvait fonctionner à ~7 000 tokens par *retrieval*[^16] — soit 5 à 10× moins que les approches *dump-all*. **Renvois** : [Ch. 9](ch09-memoire-agentique.md) (4 piliers, 5 architectures de production), [Ch. 10](ch10-compaction.md) (compaction et oubli stratégique).

### 11.6.2 Observabilité

L'agent a appelé le mauvais outil 3 % du temps. Sans tracing fin, c'est invisible et indebugable. Le minimum vital, repris par Braintrust[^17] et tous les acteurs sérieux : par exécution, un *job ID*, un *timestamp* début/fin, un *exit code*, le nombre de tokens, la liste des appels d'outils, et le raisonnement par étape. OpenTelemetry GenAI Semantic Conventions est devenu la norme, et les services managés (AgentCore Observability, Langfuse, Braintrust, Arize) sont en train de standardiser la collecte. ==L'orchestration sans observabilité, c'est de la divination.== **Renvoi** : [Ch. 18](ch18-observabilite-cognitive-audit-trail.md) (6 piliers, cognitive audit trail, attribut `gen_ai.compaction.*`).

### 11.6.3 Sécurité

Trois sous-problèmes empilés. **Sandbox** : si l'agent exécute du code, il doit le faire dans un environnement isolé (microVM, *gVisor*, container restreint) — pas dans le process du runtime. **Identité déléguée** : l'agent agit *au nom* d'un utilisateur, pas avec les droits du service. Sinon, une injection dans un mail lu peut déclencher un transfert bancaire avec les droits *admin*. AgentCore Identity gère ce *on-behalf-of* nativement, compatible OAuth/OIDC. **Allowlist d'outils** : l'agent n'a accès qu'aux outils nécessaires à son rôle — pas à la liste universelle. C'est le principe **least agency** de l'OWASP ASI Top 10 décembre 2025[^18]. **Renvois** : [Ch. 7](ch07-boucle-agentique.md) §7.5.4 (le RBAC passe par l'infra, pas par le prompt), [Ch. 13](ch13-mcp-securite.md) (matrice défensive MCP 10×10), [Ch. 19](ch19-gardefous-securite-globale.md) (threat model unifié).

### 11.6.4 Idempotence et retry

Un agent qui replanifie après crash ne doit pas dupliquer ses actions. Si la session crash après la création d'un ticket Jira mais avant la confirmation, le replay ne doit pas recréer le ticket. Solution canonique : un workflow *durable* (LangGraph avec checkpointing, ou un runtime spécialisé comme Temporal-pour-agents) plus des **clés d'idempotence** côté outils. ==La discipline est dans les outils== : chaque appel produisant un effet de bord doit accepter une clé qu'il sait dédupliquer. C'est exactement le même principe que dans les microservices REST — sauf qu'ici la responsabilité de générer la clé incombe au harness, pas au client.

### 11.6.5 Coût et amplification de tokens

Une boucle qui s'auto-nourrit peut brûler un budget. Cas typique : l'agent appelle un outil qui renvoie 4 000 tokens, replanifie, rappelle un autre outil qui renvoie 6 000 tokens — vingt tours plus tard, le prompt total fait 200 000 tokens. Les parades sont connues mais doivent être *configurées explicitement* : plafond de tours, plafond de tokens par session, *compaction* agentique (résumer l'historique au-delà d'un seuil), modèles plus petits sur les étapes routinières. **Renvoi** : [Ch. 10](ch10-compaction.md) (cinq familles de compaction, triangle fidélité × coût × oubliabilité).

> [!WARNING] La cascade d'erreurs en multi-agents — angle aggravé
> Quand un système multi-agents fait passer une erreur silencieuse de l'agent N à l'agent N+1, le débogage devient cauchemardesque. La distillation GitHub de février 2026 sur les échecs multi-agents en synthétise le diagnostic : ==un système multi-agents se comporte comme un système distribué — chaque handoff requiert un schéma typé, des actions contraintes et une validation de frontière explicite==. *Add more agents* n'est jamais la solution ; c'est un problème de design d'interface[^19]. C'est l'angle qui fait dire à Anthropic et à GitHub Engineering la même chose : **le multi-agent réussit quand il est traité comme du distribué, pas comme du LLM**.

---

## 11.7 L'arbre de décision — produit, ADK + runtime, ou tout construire ?

![Arbre de décision buy/build — quatre questions, quatre destinations|1300](../../orchestration-agentique/images/20260527-08-arbre-decision.svg)

La question revient sous toutes les formes : *« on devrait pas plutôt acheter Sierra ? »*, *« est-ce qu'on a vraiment besoin d'AgentCore ou un LangGraph sur un container suffit ? »*, *« et si on codait notre propre boucle ? »*. L'arbre ci-dessus n'a pas vocation à donner *la* bonne réponse — il a vocation à clarifier *quelle question* on est en train de se poser.

### 11.7.1 Q1 — Cas d'usage standard du marché ?

Si la réponse est oui (support client, légal, code, ops support, ventes B2B), **regarder sérieusement les produits verticaux avant tout**. Quelqu'un a déjà payé la dette d'évals, le tuning métier, et le support 24/7. L'expérience Klarna est exemplaire et instructive : ils ont *construit* leur assistant interne dès 2024 avec OpenAI, ont automatisé 67 % des conversations en un mois[^20], puis ont dû *réintroduire des humains* sur les 5 % de cas chargés émotionnellement parce que ces 5 % détruisaient la CSAT[^21]. ==La leçon n'est pas *« n'automatisez pas »* — c'est *« le ticket d'entrée pour un agent métier qui marche en prod est plus haut qu'on ne croit »*.== Les vendeurs verticaux ont en moyenne deux ans d'avance sur ce ticket.

> [!QUOTE] L'angle Klarna — deux lectures, deux chapitres
> Le cas Klarna est utilisé deux fois dans ce livre. Ici (§11.7.1) comme **arbitrage architectural** : faut-il construire son agent ou prendre Sierra ? La réponse longue est qu'il y a un ticket d'entrée — la dette d'évals + tuning métier + support 24/7 — qu'un éditeur vertical a déjà payée. En **[Ch. 21 (mesurer le ROI)](ch21-roi-paradoxe-agentique.md)**, il est repris comme illustration du **paradoxe agentique** : le changement d'unité de mesure (token → tâche → processus → outcome). Les deux lectures sont complémentaires, pas redondantes.

### 11.7.2 Q2 — Workflow unique, mais besoin de mémoire, identité, audit production-grade ?

Si oui, construire sur un socle managé : un ADK (LangGraph ou celui du cloud cible) + AgentCore / Vertex AE / Azure Foundry. ==Vous codez la logique métier, ils opèrent la mémoire, l'identité, l'observabilité.== C'est le sweet spot pour 80 % des projets internes. Ce chemin assume que les couches plateforme (memory, identity, gateway, observability) ne vous différencient pas — c'est vrai pour la quasi-totalité des cas non-spécifiques.

### 11.7.3 Q3 — Forte spécificité, latence basse, contrôle des coûts critique, équipe SRE en place ?

Si oui, **self-host**. LangGraph + container ECS/GKE/Cloud Run, ou orchestration custom. Vous payez en SRE et en discipline d'opération — vous gagnez en optimisation modèles (quantification, batching, *speculative decoding* — [Ch. 4](ch04-decode-speculative.md)), en latence p95, et en indépendance vis-à-vis du cloud. Choix légitime pour les acteurs à forte volumétrie ou aux contraintes de marge fines.

### 11.7.4 Q4 — Contraintes uniques : on-prem, edge, latence < 50 ms, modèle fine-tuné maison ?

Si oui, bâtir de A à Z. Mais soyons honnêtes : ==ce cas est minoritaire==. Les contraintes que les architectes invoquent pour justifier le *build from scratch* sont, neuf fois sur dix, soit absorbables par un runtime managé soit déplaçables (le on-prem peut souvent devenir *VPC peering*). Le *build from scratch* a un coût d'opportunité ; il ne se justifie que quand on sait précisément ce qu'on récupère.

### 11.7.5 Si toutes les réponses sont « non »

Il n'y a probablement pas besoin d'un agent. ==Un workflow Anthropic (chaining + routing) suffit.== L'économie en coût de run et de debug est de l'ordre du 10× et du 100× respectivement. C'est précisément la situation que Schluntz & Zhang documentent dans *Building Effective Agents*[^1] : la majorité des cas étiquetés *« agentiques »* en POC se résolvent en workflow déterministe en prod.

### 11.7.6 Trois signaux de migration

Trois signaux indiquent qu'il est temps de monter d'une marche dans l'arbre :

- ==**L'opération vous coûte plus que le développement.**== Vous passez plus de temps à debugger les sessions crashées qu'à coder les nouveaux cas. Signe qu'un runtime managé vaut son prix.
- **Vous avez réécrit votre propre couche mémoire ou observabilité.** À ce stade, les briques de plateforme valent leur coût marginal — ce que vous bricolez existe en mieux ailleurs.
- **Le métier vous demande des évals continues, du replay, des audits.** Le graphe déclaratif + checkpointing devient quasi-obligatoire ; un agent autonome non-instrumenté ne passera pas la revue.

À l'inverse, deux signaux indiquent qu'on *descend* d'une marche : la facture du runtime managé représente plus de 30 % du coût total (et vous savez ce que vous faites en SRE), ou vous touchez à des contraintes uniques (latence, on-prem, modèle propriétaire) que le runtime managé ne supporte pas. Ce sont les cas où le *build* commence à se défendre.

---

## 11.8 La fabrique d'équipe — quatre stades, dix artefacts

Un déplacement de focale. Les sections précédentes ont décrit **l'objet** orchestration (régimes, patterns, stack, problèmes, arbre). Mais ==**ce qui distingue une équipe qui livre des agents en prod d'une équipe qui accumule des pilotes morts, ce n'est pas le choix du LLM ni du framework ; c'est la qualité des artefacts partagés**==[^22] : 95 % des pilotes restent au point mort (MIT NANDA 2025), 70 % des POC ne passent jamais en production (consensus Gartner / McKinsey / Cigref 2025-2026) — pas pour des raisons techniques, mais parce que la fabrique autour de l'agent n'a pas mûri.

### 11.8.1 Quatre stades

| Stade | Devise | Atelier | Artefacts naissants |
|---|---|---|---|
| **1 · Prototype** | *« ça parle »* | Un dev, un notebook, un prompt qui grossit | Backlog post-it, prompt v0, scratchpad, golden dataset embryonnaire, logs `print` |
| **2 · Pilote** | *« ça mesure »* | Un PO arrive, un dashboard s'allume | DoD agentique, traces OTel GenAI, TestCase formalisé, mémoire sémantique + épisodique, boucle de feedback, dashboard + alerting |
| **3 · Production** | *« ça tient »* | Quatre personnages tiennent l'arbitrage (PO, builder, SRE, compliance) | Epics produit, tools registry & policy, agent registry, budget FinOps, runbook & HITL, charte de risques 3 lignes de défense, pipeline d'éval continue, cognitive audit trail, 6 piliers d'observabilité |
| **4 · Mature multi-agents** | *« ça apprend »* | Plusieurs agents coopèrent, les humains en coulisses | Mémoire CoALA complète, pipeline de mise à jour (prompt/memory/model versionnés séparément), évaluation adverse intégrée, protocoles inter-agents (MCP + A2A + AG-UI), runtime à l'échelle, ROI cards mûres |

Chaque stade a son moment de bascule. Le passage Prototype → Pilote, c'est *« le premier utilisateur réel = fin du privilège »*. Pilote → Production, c'est *« un SLA promis = passage en Production »*. Production → Mature, c'est *« un deuxième agent arrive »*. Aucun de ces seuils n'est technique au sens strict — ce sont des **contraintes externes** (un utilisateur, un SLA, un deuxième agent) qui forcent un saut de maturité que la bonne volonté interne n'aurait pas produit.

> [!IMPORTANT] La maturité d'une fabrique se lit dans ses artefacts
> ==La maturité d'une fabrique se lit dans la qualité de ses artefacts partagés, pas dans son code.== Un harness sans fabrique s'évapore dès que le builder qui l'a conçu passe à autre chose. Avec une fabrique, il accumule : chaque itération enrichit le dataset d'évaluation, précise la politique des outils, affine les seuils de déclenchement HITL. Le multi-agent (stade 4) n'est pas un upgrade de subscription — c'est un saut où **on n'écrit plus l'agent, on l'élève** : les humains passent de praticiens à directeurs, conçoivent les conditions dans lesquelles les agents apprennent, auditent la mémoire partagée, arbitrent les mises à jour du modèle.

### 11.8.2 Cinq cellules pivots

Sur la matrice complète 10 artefacts × 4 stades, cinq cellules sont des **points de basculement** qu'une équipe rate le plus souvent parce qu'ils sont à la frontière entre deux stades :

- **Entra Agent ID (ou équivalent)** — l'identité machine rend un agent auditable, révocable, traçable. Tant qu'un agent tourne sous les credentials d'un utilisateur humain, il n'y a pas de gouvernance possible — seulement de l'illusion.
- **Memory pool** — sa présence dans le registre ne garantit rien ; ce qui compte, c'est le `memory_hit_rate`. Si la lecture mémoire est conditionnelle (par exemple, déclenchée seulement quand le champ `memory_lookup` est à `true`), ==le pool est mort== — un entrepôt auquel personne ne rend visite.
- **Pass^k** — la métrique qui bascule l'évaluation du qualitatif au quantitatif. Un agent à 75 % de succès par tentative n'a que 42 % de chances de réussir trois interactions consécutives. Sans pass^k, on navigue à l'instinct (renvoi [Ch. 17](ch17-evaluation-benchmarks.md)).
- **OBO vs Autonome** — un choix de régime d'autorisation qui n'est **pas réversible à bas coût** : la migration OBO → Autonome coûte 13 à 23 points de budget projet, sur six à douze mois de plomberie. Une décision d'architecture de gouvernance, pas une case à cocher.
- **Réallocation du temps gagné** — l'artefact final, non technique : RH, organisationnel, politique. Son absence dans une fabrique mature signifie que l'équipe a livré des agents sans traiter ce qui change pour les humains autour. Renvoi [Ch. 21](ch21-roi-paradoxe-agentique.md) (ROI) et [Ch. 24](ch24-ia-et-travail.md) (IA et travail).

---

## 11.9 Récap chapitre — Quatre régimes, huit patterns, trois couches, un arbre

![Spectre des quatre régimes de contrôle — récap chapitre|1300](../../orchestration-agentique/images/20260527-03-spectre-controle.svg)

==**À retenir** : les quatre régimes de contrôle articulent tout le reste.== À gauche, le régime 1 code-driven : maximum de prévisibilité, le code pilote, on instancie des patterns d'**Anthropic workflows** (chaining, routing, parallelization). À droite, le régime 4 agent autonome : maximum de flexibilité, le modèle pilote, on instancie des patterns multi-agents (orchestrator-workers, evaluator-optimizer, supervisor-workers, hierarchical, peer-to-peer). Au milieu, les régimes 2 et 3 — LLM-driven et graphe déclaratif — qui couvrent 60 à 70 % des projets enterprise réels.

Sur ce spectre, ==chaque pas vers la droite ajoute trois exigences== : observabilité plus dense (parce que la décision migre dans la tête du modèle), gouvernance plus stricte (parce que la surface d'action s'élargit), facture plus volatile (parce que la boucle peut s'auto-nourrir). C'est pourquoi la règle Schluntz-Zhang tient en 2026 comme elle tenait en 2024 : *start simple, measure, add complexity only when it delivers measurable value*. Les huit patterns canoniques (§11.4) sont des **briques** ; les quatre régimes sont des **profondeurs** où placer la couture entre code et décision-modèle. Le stack en trois couches (§11.5) est la **plomberie** sous-jacente. Les cinq problèmes durs (§11.6) sont les **modes d'échec** qui décident lequel des quatre régimes vous tient en prod. L'arbre de décision (§11.7) ramène les quatre régimes à quatre questions de buy/build. Et la fabrique d'équipe (§11.8) rappelle que tout cela tient ou s'effondre en fonction des artefacts partagés.

==Le piège, pour un décideur ou un architecte 2026, n'est ni de sous-investir (l'écosystème est mature) ni de sur-investir (les frameworks pullulent et beaucoup ne survivront pas). Le piège est de **mal nommer la zone** où on intervient.== *« On utilise AgentCore »* ne dit rien tant qu'on n'a pas précisé *quelles briques* (Runtime ? Memory ? Identity ?). *« On code en LangGraph »* ne dit rien tant qu'on n'a pas précisé *avec quel runtime* (Lambda ? container ? AgentCore Runtime ?). *« On a un agent en prod »* ne dit rien tant qu'on n'a pas précisé *qui pilote la boucle* (le code ? le modèle ? un graphe ? un runtime managé ?).

C'est ce qu'on attend d'une couche d'orchestration mûre : ==pas qu'elle fasse les choix à votre place, mais qu'elle vous force à savoir ce que vous choisissez==.

---

> [!WARNING] Trois pièges classiques (les trois sont 100 % traçables)
> - **Sortir l'artillerie multi-agent pour un besoin qu'un workflow aurait résolu.** ×10-15 tokens, mois vs semaines de delivery, debug exponentiellement plus dur. La règle Schluntz-Zhang tranche : *start simple, measure, add complexity only when it delivers measurable value*. 70 % des cas se résolvent en régime 1 ou 2.
> - **Mal nommer la zone du stack.** Choisir un ADK sans avoir tranché le runtime, ou prendre un runtime managé sans savoir si on consomme une, trois ou six briques de plateforme. Conséquence : facture imprévisible, lock-in subi au lieu d'assumé, debug qui patauge entre les couches.
> - **Traiter le multi-agent comme un upgrade de subscription au lieu d'un saut de maturité de fabrique.** Le stade 4 demande des artefacts (memory pool partagé avec scoring qualité, pipeline de mise à jour à trois flux versionnés séparément, évaluation adverse intégrée, protocoles inter-agents) qu'un stade 2-3 n'a pas. ==Sauter le stade 3 pour aller directement au stade 4, c'est garantir un retour en stade 2 dans les six mois==, avec une dette de gouvernance en plus.

---

## Sources

[^1]: Anthropic, *Building Effective Agents*, décembre 2024 (mis à jour 2025-2026). <https://www.anthropic.com/engineering/building-effective-agents>

[^2]: Synthèse à partir des annonces 2024-2026 : Anthropic *Building Effective Agents* (déc. 2024), OpenAI Swarm puis Agents SDK (oct. 2024 / mars 2025), AWS Bedrock AgentCore GA (oct. 2025), Microsoft Agent Framework v1 GA (avr. 2026), Google ADK Cloud Next 2026 — référencés ci-dessous.

[^3]: OpenAI Cookbook, *Orchestrating Agents: Routines and Handoffs*, octobre 2024. <https://developers.openai.com/cookbook/examples/orchestrating_agents>

[^4]: OpenAI, *New tools for building agents* (annonce Agents SDK), mars 2025. <https://openai.com/index/new-tools-for-building-agents/>

[^5]: AWS, *Introducing Amazon Bedrock AgentCore* (GA octobre 2025). <https://aws.amazon.com/blogs/aws/introducing-amazon-bedrock-agentcore-securely-deploy-and-operate-ai-agents-at-any-scale/>

[^6]: Google Cloud, *Agent Development Kit* documentation et annonces Cloud Next 2026. <https://google.github.io/adk-docs/>

[^7]: Microsoft, *Microsoft Agent Framework* (v1 GA avril 2026), annonces Build 2026.

[^8]: Stellagent, *A2A Protocol Explained: How Google's Agent-to-Agent Standard Grew to 150+ Organizations*, avril 2026. <https://stellagent.ai/insights/a2a-protocol-google-agent-to-agent>

[^9]: Knowlee, *AI Agent Orchestration Guide 2026: Patterns, Code, and Ops*, 2026. <https://www.knowlee.ai/blog/ai-agent-orchestration-guide-2026>

[^10]: GuruSup, *Best Multi-Agent Frameworks in 2026: LangGraph, CrewAI, AutoGen*, 2026. <https://gurusup.com/blog/best-multi-agent-frameworks-2026>

[^11]: Morph, *AI Agent Frameworks in 2026: 8 SDKs, ACP, and the Trade-offs*. <https://www.morphllm.com/ai-agent-framework>

[^12]: Anthropic / Claude Code Docs, *How the agent loop works*. <https://code.claude.com/docs/en/agent-sdk/agent-loop>

[^13]: Sierra, *Why the future of enterprise software belongs to vertical agents*. <https://sierra.ai/uk/resources/podcasts/bret-taylor-sierra-why-the-future-of-enterprise-software-belongs-to-vertical-agents>

[^14]: AWS, *Amazon Bedrock AgentCore — Overview*, documentation. <https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html>

[^15]: Anthropic, *Building agents with the Claude Agent SDK*. <https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk>

[^16]: Mem0, *State of AI Agent Memory 2026: Benchmarks, Architectures & Production Gaps*, avril 2026. <https://mem0.ai/blog/state-of-ai-agent-memory-2026>

[^17]: Braintrust, *Agent Observability: The Complete Guide for 2026*. <https://www.braintrust.dev/articles/agent-observability-complete-guide-2026>

[^18]: OWASP Agentic Security Initiative, *Top 10 for Agentic Applications*, décembre 2025. <https://owasp.org/www-project-agentic-security-initiative/>

[^19]: GitHub Engineering, *Multi-Agent Workflows Often Fail. Here's How to Engineer Ones That Don't*, 24 février 2026.

[^20]: Klarna, *Klarna AI assistant handles two-thirds of customer service chats in its first month*. <https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/>

[^21]: Digital Applied, *Klarna Reverses AI Layoffs: Why Replacing 700 Failed*. <https://www.digitalapplied.com/blog/klarna-reverses-ai-layoffs-replacing-700-workers-backfired>

[^22]: Mathieu Guglielmino, *La fabrique d'un agent — quatre stades de maturité, dix artefacts partagés*, 15 mai 2026. Sources internes : MIT NANDA (95 % des pilotes au point mort), consensus Gartner/McKinsey/Cigref (70 % des POC), Schluntz & Zhang (variance scaffold sur SWE-Bench Pro), Anthropic Economic Index (split augmentation/automatisation 52 %/45 %).
