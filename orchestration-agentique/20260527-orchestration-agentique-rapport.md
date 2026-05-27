# Orchestrer des agents IA — qui pilote la boucle ?

> **L'orchestration n'est pas un nouveau produit ; c'est la couche qui est devenue indispensable quand l'agent est passé du chat à la prod.** — 27 mai 2026, Mathieu Guglielmino

---

En 2023, le mot « agent » était un *wrapper* d'une vingtaine de lignes autour d'un appel ChatGPT. Trois ans plus tard, c'est une session de huit heures qui peut tourner sur une microVM dédiée, partager sa mémoire avec quinze autres agents via un protocole standard, et facturer un client à la fin de son raisonnement. Entre les deux, quelque chose s'est glissé qui n'avait pas de nom au début et qui a fini par s'appeler **l'orchestration**. Le mot reste vague — c'est ce qui le rend utile : il recouvre la zone grise entre *« j'écris un agent »* et *« je l'exploite ».*

Ce dossier prend les six questions que tout le monde se pose et essaie de les trancher : qui orchestre, qu'est-ce que ça veut dire, pourquoi maintenant, qu'est-ce qu'une routine, ce qu'apportent les runtimes managés, et la fameuse alternative « produit vertical *vs* ADK + plumbing ».

[SCHEMA-01]

## 1. Pourquoi « orchestrer » est devenu le verbe central

L'année 2024 a été celle des **boucles agentiques** ; 2026 est celle des **plateformes pour les opérer**. Le glissement se voit dans les annonces : Anthropic publie « Building Effective Agents »[^1] en décembre 2024, OpenAI sort Swarm[^2] dans la foulée pour expérimenter handoffs et routines, puis transforme l'éducatif en production avec l'Agents SDK en mars 2025[^3]. AWS atteint la GA de Bedrock AgentCore le 13 octobre 2025[^4]. Google généralise son Agent Development Kit, qui dépasse 7 millions de téléchargements au premier trimestre 2026[^5]. Microsoft fusionne AutoGen et Semantic Kernel en Microsoft Agent Framework, dont la v1 entre en disponibilité générale en avril 2026[^6]. Sur la même période, le protocole Agent-to-Agent (A2A), donné par Google à la Linux Foundation en juin 2025, rassemble 150+ organisations en avril 2026[^7].

Tout cet outillage répond à un déplacement de la question. Tant qu'un agent restait un script *one-shot* — *prompt-réponse-fin* — il n'y avait rien à orchestrer. À partir du moment où l'agent ==tourne pendant huit heures, appelle quinze outils, retient son raisonnement entre deux conversations, et coordonne ses actions avec d'autres agents==, ==quelqu'un doit décider qui pilote la boucle==. Ce quelqu'un, c'est l'orchestrateur. Et selon le régime choisi (cf. §3), ce quelqu'un peut être le code applicatif, le modèle lui-même, un graphe déclaratif, ou un runtime managé chez un hyperscaler.

L'autre raison est économique. Le prix d'un million de tokens en classe Sonnet a été divisé par dix entre 2023 et 2026 ; en classe Haiku par cinquante. Une boucle agentique qui tournait à 4 € l'exécution en 2023 en coûte 8 centimes aujourd'hui — ce qui rend les patterns du type *evaluator-optimizer* (qui empilent les appels) financièrement défendables. Le coût marginal d'un *« et si on rajoutait une étape de vérification »* est passé d'inacceptable à acceptable. Les architectures se sont densifiées en conséquence.

## 2. Ce qu'on orchestre exactement

Avant de répondre au *qui*, il faut être clair sur le *quoi*. Un agent — au sens 2026, pas au sens 2023 — c'est quatre choses qui doivent être maintenues vivantes ensemble : <span class="term" data-tooltip="Le LLM qui réfléchit. Claude, GPT, Gemini, Llama. L'orchestrateur n'en dépend pas — on peut switcher sans changer la logique.">le modèle</span>, <span class="term" data-tooltip="Tout ce que l'agent peut appeler pour agir : API REST, fonctions Python, serveurs MCP, sandboxes de code, navigateurs distants. Le tool calling est l'interface contractuelle.">les outils</span>, <span class="term" data-tooltip="Trois couches en réalité : (1) la fenêtre de contexte d'un appel ; (2) la mémoire de session (l'historique de la conversation) ; (3) la mémoire long-terme (faits, préférences, summaries persistés entre sessions).">la mémoire</span>, et <span class="term" data-tooltip="Qui décide quoi tourne ensuite : passer la main à un autre agent, appeler tel outil, déclarer la tâche finie, demander une validation humaine.">le contrôle</span>. Ces quatre ressources tournent autour d'une **boucle** à quatre temps : *perceive → decide → act → observe*. C'est cette boucle, exécutée à plat ou récursivement, qu'on appelle « agentique ».

[SCHEMA-02]

L'orchestration n'est ni le modèle, ni les outils, ni la mémoire, ni le contrôle. C'est la *colle* qui ==fait tenir ces quatre ressources ensemble dans la durée==. Concrètement, l'orchestrateur tranche cinq questions à chaque tour de boucle :

1. **Qui est l'agent actif maintenant ?** Si on est dans un système multi-agents, est-ce que c'est encore le triagiste, ou est-ce qu'on a passé la main au spécialiste ?
2. **Quel contexte lui présente-t-on ?** Combien de tours d'historique, quels documents, quels résultats d'outils sont injectés dans le prompt ?
3. **Quels outils a-t-il le droit d'appeler ?** Toute la liste, ou un sous-ensemble dépendant de son rôle et de son identité ?
4. **Comment réagit-on à un crash ou un timeout ?** Replay depuis le dernier checkpoint, escalade à un humain, échec propre, retry avec backoff ?
5. **Comment trace-t-on tout ça ?** Quels événements sont émis pour debug, audit, évaluation et facturation ?

Selon le régime d'orchestration choisi, ces cinq questions sont tranchées par du code que vous écrivez, par le modèle lui-même via du *prompt engineering*, par un graphe déclaratif type LangGraph, ou par un runtime managé qui en absorbe une partie. C'est tout l'enjeu de la section suivante.

Un mot sur la distinction Anthropic, qui structure le débat depuis dix-huit mois. Dans « Building Effective Agents »[^1], l'équipe distingue deux modes : les **workflows**, où les étapes sont définies dans le code et le LLM est appelé à des points fixes, et les **agents**, où le LLM décide lui-même quelles étapes prendre. La maxime qui en découle est devenue canonique : *« Utilisez un workflow quand le chemin est prévisible ; réservez l'agent aux tâches qui exigent flexibilité et décision contextuelle ».* Cela posé, le spectre n'est pas binaire. C'est ce qu'on regarde maintenant.

## 3. Qui orchestre ? Quatre régimes de contrôle

L'écosystème a stabilisé quatre régimes, qui se distinguent moins par leurs outils que par la **position du pilote**. Plus on monte vers la droite du schéma, plus on délègue la décision au modèle ; plus on gagne en flexibilité ; plus on perd en prévisibilité — et plus l'observabilité devient critique.

[SCHEMA-03]

### Régime 1 — Code-driven (workflow)

L'application reste pilote. Le LLM est appelé à des étapes fixes, comme un service externe enrichi. C'est exactement le mode « workflow » d'Anthropic, et c'est le régime à privilégier ==chaque fois que le chemin est connu à l'avance==. Extraction de champs structurés, classification, traduction multi-étapes, modération en pipeline : autant de cas où un graphe d'appels fixe bat un agent autonome en stabilité, en coût et en debug. Le risque ici est l'inverse de l'agent fugueur : c'est l'over-engineering, l'ajout d'étapes qui n'apportent rien.

### Régime 2 — LLM-driven (routines + handoffs)

C'est l'invention d'OpenAI Swarm, reprise dans l'Agents SDK. Une **routine** est, dans la documentation officielle, *« une instruction en langage naturel associée aux outils nécessaires à son exécution »*[^2]. Dans l'API, cela se traduit par la classe `Agent` : un système prompt + une liste de tools. Un **handoff** est *« une fonction qui retourne un agent différent »* : c'est la primitive qui permet au modèle de transférer le contrôle à un autre agent — typiquement un spécialiste — sans que l'application n'ait à orchestrer cela par du code.

```python
# OpenAI Agents SDK — la signature minimale
triage = Agent(
    name="Triage",
    instructions="Si la demande concerne un remboursement, passe la main à 'Refund'. Sinon réponds.",
    tools=[lookup_order],
    handoffs=[refund_agent, billing_agent]
)
```

L'élégance du modèle est qu'il fait porter la logique de routing par le prompt et non par du code. Le revers : la décision est *dans la tête du modèle*. On l'audite *a posteriori* via les traces, pas *a priori* via une revue de code. Pour des cas non-régulés, ça suffit ; pour des workflows soumis à audit (santé, finance), on préfère le régime suivant.

### Régime 3 — Graphe déclaratif

LangGraph, devenu en 2026 le standard de facto des workflows agentiques durables[^8], pousse à modéliser explicitement les nœuds (agents, outils, validateurs) et les arêtes conditionnelles. Le moteur exécute, **persiste l'état après chaque nœud**, et permet de reprendre la session après crash, de la rejouer pour audit, ou de la *rollback* à un checkpoint. L'avantage : on a un objet inspectable, versionnable, qui peut être audité avant déploiement. Le coût : 120 lignes de code là où Smolagents en demande 40[^9]. La verbosité est délibérée — c'est ce qu'on paie pour que le système reste lisible quand il atteint quinze nœuds.

Les déploiements en production cités par LangChain donnent une idée du calibre du segment : Klarna, Uber, LinkedIn, BlackRock, Cisco, JPMorgan, Replit, Elastic[^8]. La caractéristique commune : ce sont des environnements réglementés ou critiques où le coût d'une *boîte noire* est insupportable.

### Régime 4 — Agent autonome (boucle libre)

Le modèle pilote, point. La boucle tourne jusqu'à condition de stop — *« done »*, plafond de tours atteint, erreur, ou intervention humaine. C'est le régime de Claude Code, de Devin, de Cursor en mode agent. La documentation Claude Agent SDK le décrit ainsi : *« L'agent évalue le prompt, appelle des outils pour agir, reçoit les résultats, et répète jusqu'à ce que la tâche soit terminée »*[^10]. Le pattern interne est *gather context → take action → verify work → repeat*.

Ce régime est le plus puissant et le plus dangereux. Puissant parce qu'il libère le modèle de la rigidité du graphe pour explorer un espace de tâches non-décomposable à l'avance — typiquement, le debugging d'une régression, la rédaction d'une étude qui demande de la recherche, l'exploration d'un grand code base. Dangereux parce qu'il invite tous les modes d'échec de la section 7 : amplification de tokens, mémoire qui dérive, observabilité difficile, idempotence à recalculer.

La recommandation d'Anthropic, qu'on peut compléter par celle de la quasi-totalité des praticiens 2026, est de **réserver l'autonomie aux cas où elle est nécessaire**, et de privilégier les régimes plus déterministes dès qu'on peut. Le régime 4 contient toujours les régimes inférieurs : un agent autonome appelle ses propres workflows et ses propres routines. La question n'est pas *« faut-il un agent ? »* mais *« à quelle profondeur d'autonomie place-t-on la couture entre code et décision-modèle ? ».*

## 4. Les patterns canoniques

Les patterns sont à l'orchestration ce que les *design patterns* étaient à l'OO des années 1990 : un vocabulaire partagé pour décrire des structures qui marchent. Le canon 2026 tient en huit éléments — cinq workflows d'Anthropic, trois topologies multi-agents. Aucun n'a besoin d'un framework ; tous se composent.

[SCHEMA-04]

Les cinq workflows d'Anthropic[^1] :

- **Prompt chaining** : la sortie d'un LLM est l'entrée du suivant. Usage canonique : brouillon → édition → résumé. Idéal pour des tâches dont la décomposition est stable et où chaque étape gagne à être spécialisée.
- **Routing** : un premier LLM classe la requête et choisit la suite (modèle, branche). Anthropic donne l'exemple du tri Haiku/Sonnet/Opus : faciles à Haiku, durs à Opus, mediums à Sonnet — gains de coût directs.
- **Parallelization** : exécuter la même tâche en parallèle plusieurs fois (*voting*) ou découper en sous-tâches indépendantes (*sectioning*). Anthropic distingue les deux : le voting cherche la robustesse, le sectioning la latence.
- **Orchestrator-workers** : un orchestrateur LLM décompose la tâche à la volée, délègue à des workers, fusionne les résultats. Différence avec le parallel : les sous-tâches ne sont *pas connues à l'avance*. C'est la structure de Claude Code éditant plusieurs fichiers en parallèle.
- **Evaluator-optimizer** : un LLM génère, un autre évalue, on boucle jusqu'à passage. C'est la traduction itérative, ou la boucle *code-lint-fix* d'un coding agent.

Les trois topologies multi-agents, popularisées en 2026[^11] :

- **Supervisor-workers** : version explicite du pattern 4, où les workers sont des *agents distincts* (chacun avec son prompt, ses outils, ses garde-fous). C'est la structure typique d'un Sierra qui dispatche entre CRM, refund et escalation humaine.
- **Hierarchical** : l'arbre se prolonge — un superviseur de superviseurs. Permet de *borner le contexte* de chaque sous-arbre, ce qui devient critique au-delà de cinq ou six agents (sinon la fenêtre de contexte du superviseur racine explose).
- **Peer-to-peer** : conversation égalitaire entre agents, popularisée par AutoGen (et donc le Microsoft Agent Framework). Plus libre, plus difficile à borner — adapté à la simulation et à la délibération, moins à l'exécution déterministe.

==La maxime non-écrite, et pourtant la plus importante, est la même chez Anthropic, chez LangChain et chez AWS : on compose==. Un système réel enchaîne souvent routing → orchestrator-workers → evaluator-optimizer, avec une couche supervisor-workers par-dessus quand les agents deviennent plusieurs. Les frameworks qui ont gagné en 2026 (LangGraph, l'Agents SDK d'OpenAI, l'ADK Google) ne sont pas ceux qui fournissent le pattern le plus sophistiqué — ce sont ceux qui rendent la composition lisible.

> Voir aussi le dossier complémentaire **« Surfaces agentiques »** ([surfaces-agentiques/](../surfaces-agentiques/)) qui détaille où vivent les agents côté utilisateur (chatbot, copilot embarqué, on-behalf-of), et **« La fabrique d'un agent »** ([fabrique-agent/](../fabrique-agent/)) pour la décomposition pas-à-pas d'un agent unique.

## 5. Démêler le stack — ADK ≠ runtime ≠ plateforme

C'est la source de confusion la plus fréquente. *« On utilise Bedrock pour nos agents »* veut tout et rien dire — Bedrock, c'est à la fois un catalogue de modèles, un runtime d'exécution (AgentCore Runtime), et une suite de services de plateforme (Memory, Identity, Gateway, Observability, Code Interpreter, Browser Tool)[^12]. Pareil pour Vertex AI : Agent Engine (le runtime), ADK (le SDK), Memory Bank et les Eval services (la plateforme). Le découpage est le même chez les trois hyperscalers, mais avec des noms différents — et avec une frontière qu'il faut tracer pour décider sainement.

[SCHEMA-05]

### Couche 1 — ADK (Agent Development Kit)

Le SDK que vous *importez dans votre code*. Il définit la **forme** d'un agent : la classe, les types des outils, le contrat de hand-off, la signature des middlewares. Les choix se font sur deux axes : vendeur (lock-in à un modèle/cloud particulier) ou ouvert (agnostique), et niveau d'abstraction (très DSL comme CrewAI, très bas-niveau comme LangGraph).

| ADK | Mainteneur | Position 2026 |
|---|---|---|
| LangGraph | LangChain | Standard de facto pour workflows agentiques durables en environnements régulés[^8] |
| CrewAI | indépendant | Plus rapide à prototyper (20 lignes pour un ReAct), souvent migré vers LangGraph en prod[^9] |
| Mastra | indépendant (TypeScript) | TypeScript-first, intégré Vercel/Next.js, populaire côté web full-stack[^9] |
| OpenAI Agents SDK | OpenAI | Production-grade depuis mars 2025, support handoffs/guardrails/tracing[^3] |
| Claude Agent SDK | Anthropic | Extrait du moteur de Claude Code, supporte les Skills (annonce mars 2026)[^13] |
| Google ADK | Google | Open-source, 4 langages (Py/TS/Go/Java), pivot du stack Vertex[^5] |
| Microsoft Agent Framework | Microsoft | Fusion AutoGen + Semantic Kernel, v1 GA avril 2026[^6] |

### Couche 2 — Runtime (exécution)

Là où **les sessions tournent vraiment**. Le runtime tranche les choses suivantes : isolation entre sessions, durée maximale d'exécution, *cold-start*, scaling horizontal, retry, persistance d'état entre redémarrages. Trois familles cohabitent en 2026 :

- **Runtimes managés hyperscaler** : AWS Bedrock AgentCore Runtime (microVM par session, jusqu'à 8 h d'exécution, *« charge only for what's consumed »*[^12]), Google Vertex AI Agent Engine, Azure AI Foundry Agent Service. Ils absorbent tout le plumbing — vous déployez un binaire ou un container, ils gèrent la suite.
- **Self-hosted classique** : container ECS/GKE/Cloud Run, ou Lambda pour les courts. Plus de contrôle, plus d'opération.
- **Runtimes spécialisés** : Temporal-pour-agents, Inferable, plusieurs autres entrants. Ils visent les workflows durables avec *checkpointing* fin.

La différence pratique se voit sur des sessions longues. Une session de huit heures dans un Lambda est impossible (timeout) ; dans un ECS, vous devez gérer le *liveness*, le retry, la persistance. Dans AgentCore Runtime, c'est natif et facturé à la consommation effective. Pour les agents qui passent 80 % du temps à attendre une API externe, c'est la différence entre une facture viable et une facture monstrueuse.

### Couche 3 — Services de plateforme

Là où les hyperscalers se distinguent vraiment, et où la complexité se cache. AgentCore propose six briques distinctes, chacune consommable indépendamment[^12] :

- **Memory** : court terme (session), long terme (faits/préférences/résumés persistés).
- **Identity** : authentification *on-behalf-of*, compatible avec les fournisseurs d'identité existants — l'agent agit *au nom de l'utilisateur*, pas avec les droits du service.
- **Gateway** : convertit n'importe quelle API (REST, Lambda, services existants) en outils MCP-compatibles. Permet aussi de fédérer des serveurs MCP existants.
- **Observability** : tracing OpenTelemetry, vue unifiée des appels et des erreurs.
- **Code Interpreter** : sandbox isolé pour exécuter du Python, JavaScript ou TypeScript — jusqu'à huit heures.
- **Browser Tool** : navigateur distant — l'agent navigue le web *comme un humain*, sans pourrir la machine locale.

Google Vertex AI a sa propre déclinaison (Memory Bank, Agent Garden, A2A natif), Azure Foundry aussi. Le tableau de bord change selon le cloud ; **la liste des problèmes à régler est la même**, parce qu'elle découle des modes d'échec de la section 7.

> Trois dossiers de la même série prolongent cette section : **« Mémoire agentique »** ([memoire-agentique/](../memoire-agentique/)) sur la couche Memory, **« Observabilité des agents IA »** ([observabilite-agents-ia/](../observabilite-agents-ia/)) sur le tracing/évals, et **« Harness agentiques »** ([harness-agentique/](../harness-agentique/)) sur le runtime côté coding agents.

## 6. Cartographie 2026 — qui propose quoi

La cartographie n'a pas vocation à recenser tout l'écosystème — elle a vocation à donner les *bandes* dans lesquelles raisonner. Quatre bandes plus deux protocoles transverses.

[SCHEMA-06]

**ADK ouverts** — choix par défaut quand on veut éviter le lock-in vendeur. LangGraph domine en production régulée ; CrewAI prototypage rapide ; Mastra TypeScript-first ; Pydantic AI sur la *type-safety*. Un benchmark de 2026 montre que LangGraph est le plus rapide en latence sur cinq tâches standard, et que CrewAI porte le plus de tokens sur les tâches simples (≈ 3× les autres pour un appel à un outil)[^9]. La leçon : un framework qui rend tout facile rend aussi tout cher.

**ADK vendeurs** — friction minimale si on adhère au socle du vendeur. OpenAI Agents SDK (modèle OpenAI principal, mais agnostique sur le runtime) ; Claude Agent SDK (taillé pour Claude, partage le moteur de Claude Code) ; Google ADK (couplé Vertex mais 4 langages) ; Microsoft Agent Framework (Azure). Le choix se joue sur le socle de modèle dominant et sur l'environnement existant — pas sur les abstractions, qui se ressemblent toutes (Agent + tools + handoffs).

**Runtimes + plateformes managés** — les hyperscalers. AWS Bedrock AgentCore reste le plus modulaire avec ses six briques indépendantes ; Vertex AI Agent Engine couple plus serré ADK + runtime + Memory Bank ; Azure Foundry s'aligne sur Microsoft Agent Framework. Le différentiel pratique : *pricing model* (consommation effective chez AWS *vs* allocation chez certains autres), couplage avec l'IAM cloud, intégrations natives avec les services data du cloud (Snowflake, BigQuery, S3…). Pour une entreprise déjà multi-cloud, ça compte plus que les capacités intrinsèques.

**Produits verticaux** — le *« buy »* dans la décision build-vs-buy. Sierra a fait du support client agentique un produit (Sonos, WeightWatchers, SiriusXM)[^14] ; Harvey occupe le segment légal ; Devin et Cursor se disputent l'ingénierie logicielle ; Hippocratic AI cible la santé ; Lindy, EvenUp et d'autres montent sur des niches. La logique est simple : si quelqu'un a déjà payé la dette d'évals, le tuning métier et le support 24/7, ==réinventer n'a aucun sens stratégique==.

**Protocoles transverses** — MCP (agent ↔ outils, lancé par Anthropic en novembre 2024, désormais quasi-universel) et A2A (agent ↔ agent, donné par Google à la Linux Foundation en juin 2025, 150+ organisations en avril 2026[^7]). Ce sont les deux protocoles qui rendent les agents *inter-opérables* — sans eux, chaque vendeur réinventerait sa colle propriétaire, et le marché se fragmenterait. Ils ne sont pas concurrents : MCP est *vertical* (un agent vers ses outils), A2A est *horizontal* (un agent vers un autre agent, possiblement d'un autre vendeur).

> Le dossier **« MCP-plateforme »** ([mcp-plateforme/](../mcp-plateforme/)) et **« MCP-sécurité »** ([mcp-securite/](../mcp-securite/)) creusent le protocole MCP et ses pièges. **« Claude Code et l'Agent SDK »** ([agent-sdk/](../agent-sdk/)) détaille l'architecture du Claude Agent SDK.

## 7. Les problèmes durs qui font crasher en prod

Les boucles agentiques ne crashent pas pour les raisons qu'on imagine. Elles ne crashent pas parce que le modèle hallucine — ça, c'est traité au niveau du modèle. Elles crashent parce que **les couches autour de la boucle ne tiennent pas la durée**. Cinq problèmes durs reviennent dans toutes les *post-mortem* publiques de 2025-2026.

[SCHEMA-07]

### Mémoire et contexte

Le problème classique : l'agent oublie ce qu'on lui a dit il y a trente tours, ou pire, hallucine un fait d'une session précédente. La cause technique : la fenêtre de contexte est finie, l'historique cru ne tient pas, l'application doit choisir quoi garder. L'approche naïve (*« dump everything »*) brûle les tokens et dégrade le raisonnement[^15]. L'approche mature consiste à dédier une couche mémoire qui résume, indexe et réinjecte au bon moment — Mem0, Letta, Zep, AgentCore Memory côté AWS, Memory Bank côté Vertex. Un algo *token-efficient* publié en avril 2026 a montré qu'on pouvait fonctionner à ~7 000 tokens par *retrieval*[^15] — soit 5 à 10× moins que les approches *dump-all*.

### Observabilité

L'agent a appelé le mauvais outil 3 % du temps. Sans tracing fin, c'est invisible et indebugable. Le minimum vital, repris par Braintrust[^16] et tous les acteurs sérieux : par exécution, un *job ID*, un *timestamp* début/fin, un *exit code*, le nombre de tokens, la liste des appels d'outils, et le raisonnement par étape. OpenTelemetry est devenu la norme, et les services managés (AgentCore Observability, Langfuse, Braintrust, Arize) sont en train de standardiser la collecte. ==L'orchestration sans observabilité, c'est de la divination==.

### Sécurité

Trois sous-problèmes empilés. **Sandbox** : si l'agent exécute du code, il doit le faire dans un environnement isolé (microVM, *gVisor*, container restreint) — pas dans le process du runtime. **Identité déléguée** : l'agent agit *au nom* d'un utilisateur, pas avec les droits du service. Sinon, une injection dans un mail lu peut déclencher un transfert bancaire avec les droits *admin*. AgentCore Identity gère ce *on-behalf-of* nativement, compatible OAuth/OIDC. **Allowlist d'outils** : l'agent n'a accès qu'aux outils nécessaires à son rôle — pas à la liste universelle.

### Idempotence et retry

Un agent qui replanifie après crash ne doit pas dupliquer ses actions. Si la session crash après la création d'un ticket Jira mais avant la confirmation, le replay ne doit pas recréer le ticket. Solution canonique : un workflow *durable* (LangGraph avec checkpointing, ou un runtime spécialisé comme Temporal-pour-agents) plus des **clés d'idempotence** côté outils. La discipline est dans les outils : chaque appel produisant un effet de bord doit accepter une clé qu'il sait dédupliquer.

### Coût et amplification de tokens

Une boucle qui s'auto-nourrit peut brûler un budget. Cas typique : l'agent appelle un outil qui renvoie 4 000 tokens, replanifie, rappelle un autre outil qui renvoie 6 000 tokens — vingt tours plus tard, le prompt total fait 200 000 tokens. Les parades sont connues mais doivent être *configurées explicitement* : plafond de tours, plafond de tokens par session, *compaction* agentique (résumer l'historique au-delà d'un seuil), modèles plus petits sur les étapes routinières. Le dossier **« Compaction agentique »** ([compaction-agentique/](../compaction-agentique/)) creuse cinq familles de stratégies pour ce problème précis.

## 8. Décider — produit, ADK + runtime, ou tout construire ?

La question revient sous toutes les formes : *« on devrait pas plutôt acheter Sierra ? »*, *« est-ce qu'on a vraiment besoin d'AgentCore ou un LangGraph sur un container suffit ? »*, *« et si on codait notre propre boucle ? »*. L'arbre suivant n'a pas vocation à donner *la* bonne réponse — il a vocation à clarifier *quelle question* on est en train de se poser.

[SCHEMA-08]

**Q1 — Cas d'usage standard du marché ?** Si la réponse est oui (support client, légal, code, ops support, ventes B2B), regarder sérieusement les produits verticaux avant tout. Quelqu'un a déjà payé la dette d'évals, le tuning métier, et le support 24/7. L'expérience Klarna est exemplaire et instructive : ils ont *construit* leur assistant interne dès 2024 avec OpenAI, ont automatisé 67 % des conversations en un mois[^17], puis ont dû *réintroduire des humains* sur les 5 % de cas chargés émotionnellement parce que ces 5 % détruisaient la CSAT[^18]. La leçon n'est pas *« n'automatisez pas »* — c'est *« le ticket d'entrée pour un agent métier qui marche en prod est plus haut qu'on ne croit »*. Les vendeurs verticaux ont en moyenne deux ans d'avance sur ce ticket.

**Q2 — Workflow unique, mais besoin de mémoire, identité, audit production-grade ?** Si oui, construire sur un socle managé : un ADK (LangGraph ou celui du cloud cible) + AgentCore / Vertex AE / Azure Foundry. Vous codez la logique métier, ils opèrent la mémoire, l'identité, l'observabilité. C'est le sweet spot pour 80 % des projets internes.

**Q3 — Forte spécificité, latence basse, contrôle des coûts critique, équipe SRE en place ?** Si oui, self-host. LangGraph + container ECS/GKE/Cloud Run, ou orchestration custom. Vous payez en SRE et en discipline d'opération — vous gagnez en optimisation modèles (quantification, batching, *speculative decoding*), en latence p95, et en indépendance vis-à-vis du cloud. Choix légitime pour les acteurs à forte volumétrie ou aux contraintes de marge fines.

**Q4 — Contraintes uniques : on-prem, edge, latence < 50 ms, modèle fine-tuné maison ?** Si oui, bâtir de A à Z. Mais soyons honnêtes : ce cas est minoritaire. Les contraintes que les architectes invoquent pour justifier le *build from scratch* sont, neuf fois sur dix, soit absorbables par un runtime managé soit déplaçables (le on-prem peut souvent devenir *VPC peering*). Le *build from scratch* a un coût d'opportunité ; il ne se justifie que quand on sait précisément ce qu'on récupère.

**Si toutes les réponses sont « non »** — il y a probablement pas besoin d'un agent. Un workflow Anthropic (chaining + routing) suffit. L'économie en coût de run et de debug est de l'ordre du 10× et 100× respectivement.

### Signaux de migration

Trois signaux indiquent qu'il est temps de monter d'une marche dans l'arbre :

- **L'opération vous coûte plus que le développement.** Vous passez plus de temps à debugger les sessions crashées qu'à coder les nouveaux cas. Signe qu'un runtime managé vaut son prix.
- **Vous avez réécrit votre propre couche mémoire ou observabilité.** À ce stade, les briques de plateforme valent leur coût marginal — ce que vous bricolez existe en mieux ailleurs.
- **Le métier vous demande des évals continues, du replay, des audits.** Le graphe déclaratif + checkpointing devient quasi-obligatoire ; un agent autonome non-instrumenté ne passera pas la revue.

À l'inverse, deux signaux indiquent qu'on *descend* d'une marche : la facture du runtime managé représente plus de 30 % du coût total (et vous savez ce que vous faites en SRE), ou vous touchez à des contraintes uniques (latence, on-prem, modèle propriétaire) que le runtime managé ne supporte pas. Ce sont les cas où le *build* commence à se défendre.

---

## Conclusion

L'orchestration n'est pas un produit ; c'est une **couche** qui s'est imposée à mesure que la boucle agentique gagnait en durée et en exigence opérationnelle. Le mot « orchestrer » recouvre quatre questions distinctes : qui décide quel agent tourne (régime), comment on compose les patterns canoniques, à quelle couche du stack on intervient (ADK ? runtime ? plateforme ?), et quel produit ou framework on choisit dans chaque bande du marché.

Le piège, pour un décideur ou un architecte 2026, n'est ni de sous-investir (l'écosystème est mature) ni de sur-investir (les frameworks pullulent et beaucoup ne survivront pas). Le piège est de **mal nommer la zone** où on intervient. *« On utilise AgentCore »* ne dit rien tant qu'on n'a pas précisé *quelles briques* (Runtime ? Memory ? Identity ?). *« On code en LangGraph »* ne dit rien tant qu'on n'a pas précisé *avec quel runtime* (Lambda ? container ? AgentCore Runtime ?). *« On a un agent en prod »* ne dit rien tant qu'on n'a pas précisé *qui pilote la boucle* (le code ? le modèle ? un graphe ? un runtime managé ?).

Le travail des prochains trimestres ne sera pas de choisir le bon framework — ce choix est largement secondaire. Ce sera de *poser les bonnes questions au bon niveau du stack*, pour que les décisions techniques et budgétaires aient un sens. C'est ce qu'on attend d'une couche d'orchestration mûre : ==pas qu'elle fasse les choix à votre place, mais qu'elle vous force à savoir ce que vous choisissez==.

---

## Sources

[^1]: Anthropic, *« Building Effective Agents »*, décembre 2024 — https://www.anthropic.com/engineering/building-effective-agents (consulté le 27 mai 2026)

[^2]: OpenAI Cookbook, *« Orchestrating Agents: Routines and Handoffs »* — https://developers.openai.com/cookbook/examples/orchestrating_agents (consulté le 27 mai 2026)

[^3]: OpenAI, *« New tools for building agents »* (annonce Agents SDK), mars 2025 — https://openai.com/index/new-tools-for-building-agents/ (consulté le 27 mai 2026)

[^4]: AWS, *« Introducing Amazon Bedrock AgentCore »* (GA octobre 2025) — https://aws.amazon.com/blogs/aws/introducing-amazon-bedrock-agentcore-securely-deploy-and-operate-ai-agents-at-any-scale/ (consulté le 27 mai 2026)

[^5]: Google Cloud, *« Agent Development Kit »* documentation et annonces Cloud Next 2026 — https://google.github.io/adk-docs/ (consulté le 27 mai 2026)

[^6]: Microsoft, *« Microsoft Agent Framework »* (v1 GA avril 2026) — annonces Build 2026 (consulté le 27 mai 2026)

[^7]: Stellagent, *« A2A Protocol Explained: How Google's Agent-to-Agent Standard Grew to 150+ Organizations »*, avril 2026 — https://stellagent.ai/insights/a2a-protocol-google-agent-to-agent (consulté le 27 mai 2026)

[^8]: GuruSup, *« Best Multi-Agent Frameworks in 2026: LangGraph, CrewAI, AutoGen »*, 2026 — https://gurusup.com/blog/best-multi-agent-frameworks-2026 (consulté le 27 mai 2026)

[^9]: Morph, *« AI Agent Frameworks in 2026: 8 SDKs, ACP, and the Trade-offs »* — https://www.morphllm.com/ai-agent-framework (consulté le 27 mai 2026)

[^10]: Anthropic / Claude Code Docs, *« How the agent loop works »* — https://code.claude.com/docs/en/agent-sdk/agent-loop (consulté le 27 mai 2026)

[^11]: Knowlee, *« AI Agent Orchestration Guide 2026: Patterns, Code, and Ops »*, 2026 — https://www.knowlee.ai/blog/ai-agent-orchestration-guide-2026 (consulté le 27 mai 2026)

[^12]: AWS, *« Amazon Bedrock AgentCore — Overview »* documentation — https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html (consulté le 27 mai 2026)

[^13]: Anthropic, *« Building agents with the Claude Agent SDK »* — https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk (consulté le 27 mai 2026)

[^14]: Sierra, *« Why the future of enterprise software belongs to vertical agents »* — https://sierra.ai/uk/resources/podcasts/bret-taylor-sierra-why-the-future-of-enterprise-software-belongs-to-vertical-agents (consulté le 27 mai 2026)

[^15]: Mem0, *« State of AI Agent Memory 2026: Benchmarks, Architectures & Production Gaps »*, avril 2026 — https://mem0.ai/blog/state-of-ai-agent-memory-2026 (consulté le 27 mai 2026)

[^16]: Braintrust, *« Agent Observability: The Complete Guide for 2026 »* — https://www.braintrust.dev/articles/agent-observability-complete-guide-2026 (consulté le 27 mai 2026)

[^17]: Klarna, *« Klarna AI assistant handles two-thirds of customer service chats in its first month »* — https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/ (consulté le 27 mai 2026)

[^18]: Digital Applied, *« Klarna Reverses AI Layoffs: Why Replacing 700 Failed »* — https://www.digitalapplied.com/blog/klarna-reverses-ai-layoffs-replacing-700-workers-backfired (consulté le 27 mai 2026)
