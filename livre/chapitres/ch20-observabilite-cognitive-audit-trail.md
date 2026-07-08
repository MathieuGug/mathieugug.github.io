---
chapitre: 20
titre: "Observabilité agentique et cognitive audit trail"
acte: 4
acte_titre: "Mesures et garde-fous"
gabarit: standard
mots: 6000
statut: v1
date_maj: 2026-05-29
---

# Chapitre 20 — Observabilité agentique et cognitive audit trail

> **Acte IV — Mesures et garde-fous · Chapitre standard, ~24 pages**
> _L'agent ne **crashe** pas — il **dérive**. La grille d'observabilité 2026 : OpenTelemetry GenAI comme standard d'instrumentation, six piliers de télémétrie, **cognitive audit trail** comme réponse à l'AI Act et au RGPD, double marché incumbents-APM / challengers AI-native, et échelle de maturité organisationnelle. La trajectoire qui était l'objet d'évaluation au [Ch. 19](ch19-evaluation-benchmarks.md) devient l'objet de **monitoring en production**._

> [!QUESTION] Question d'ouverture
> Le 12 mars 2026, une caisse régionale française découvre que son agent CRM, déployé six mois plus tôt, recommande depuis trois semaines un produit que la direction marketing a retiré du catalogue le 17 février. Aucune alerte. Aucun ticket. Les CSAT ne bougent pas — les clients qui acceptent la recommandation sont simplement orientés vers la mauvaise page produit, où on leur dit *« ce produit n'est plus disponible »*. La perte n'est pas une panne ; c'est une **dérive silencieuse**, lente, partielle. ==Comment voir, en 2026, ce qu'un APM classique n'a plus aucune chance de voir — la trajectoire d'un raisonnement, la qualité d'une réponse, le glissement d'une politique d'usage — et à qui cette visibilité doit-elle être rendue ?==

> [!TLDR] TL;DR décideur
> - ==L'agent ne crashe pas, il dérive.== Le contrat épistémique de l'APM des années 2015-2024 (input → output déterministe, défaillance binaire, stack trace) ne tient pas. L'observabilité agentique 2026 hérite de vingt-cinq ans de DevOps/SRE et y greffe une **couche cognitive** irréductible aux signaux infrastructure.
> - **OpenTelemetry GenAI** (semantic conventions v1.37+, statut expérimental avril 2026, stabilisation prévue S2 2026) joue pour les agents le rôle qu'a joué OTel pour les microservices : un vocabulaire commun (`gen_ai.*`) qui rend la télémétrie portable entre frameworks et backends. **Standardiser dès le premier sprint** protège contre la facture explosive des SaaS dominants (un workload agentique génère 10 à 50× plus de télémétrie qu'un service classique).
> - **Six piliers de télémétrie** s'empilent : usage & tokens, performance, comportement, qualité, gouvernance, drift & fiabilité. Aucun n'est suffisant seul ; la valeur se révèle à la croisée — un coût qui explose **sans** drift de qualité signale un problème de routing ; un drift de qualité **sans** surcoût signale un problème de prompt ou de modèle.
> - Le marché se polarise. **Incumbents APM** (Dynatrace, Datadog, Splunk, Grafana, Elastic) excellent sur l'infrastructure et la topologie ; **challengers AI-native** (Langfuse, Braintrust, Arize Phoenix, Galileo, Maxim) dominent l'évaluation qualité et la conversion trace → test case. Aucun ne couvre seul tout le spectre. L'architecture mature 2026 est **hybride**, fédérée par OpenTelemetry comme protocole.
> - Le saut de maturité **N2 → N3** (du tracing distribué à l'évaluation continue) est le palier cognitif. Il exige de **définir « qu'est-ce qu'une bonne réponse ? » de façon mesurable** — datasets de référence, scorers calibrés, juges LLM débiaisés. Les organisations qui sautent ce palier construisent de l'auto-remédiation sur des signaux non calibrés et obtiennent une autonomie illisible.
> - Le **cognitive audit trail** est la réponse opérationnelle à AI Act art. 12-13-15 + RGPD art. 22 + DORA. C'est une nouvelle catégorie de log avec rétention longue, signature, et droit d'accès — pas un dashboard. Sans lui, on documente *qu'un agent a tourné* ; avec lui, on peut répondre à la question *« pourquoi cet agent a-t-il pris cette décision à ce moment-là, sur la base de quelles données ? »* — et c'est cette question que les régulateurs vont poser à partir d'août 2026.
> - **Trois pièges 100 % traçables.** POC sans observabilité = dette technique massive le jour du passage en prod · per-LLM-span billing facturé deux à trois fois la base APM, jamais lu au moment de la signature · juge LLM unique non calibré qui produit des alertes que personne ne croit, donc personne ne lit.

---

## 20.1 La rupture paradigmatique — du déterministe au probabiliste

### 20.1.1 Vingt-cinq ans de paradigmes empilés

L'observabilité ne s'est pas inventée en 2023 avec les agents IA. Elle a traversé quatre paradigmes successifs depuis 2000, chacun ajoutant une couche au-dessus de la précédente sans remplacer les fondations[^1][^3].

![Quatre paradigmes d'observabilité, vingt-cinq ans d'évolution|1300](../../observabilite-agents-ia/images/20260430-01-rupture-paradigmatique.svg)

Chaque ère répondait aux limites de la précédente. **Le monitoring SNMP** (Nagios, Zabbix, fin 1990s) voyait le serveur mais pas la requête. **L'APM applicatif** (New Relic, AppDynamics, 2005-2015) voyait la transaction mais pas la cascade microservices. **L'observabilité cloud-native distribuée** (MELT, OpenTelemetry, 2015-2024) voyait la cascade mais pas le raisonnement. **L'observabilité agentique** voit le raisonnement — mais doit s'appuyer sur les trois couches précédentes pour le contextualiser.

La rupture véritable n'est ni technique ni outillée : elle est **épistémologique**. Pendant deux décennies, le système était déterministe — mêmes inputs, mêmes outputs, défaillance binaire (marche/panne) avec stack trace pour debug. Les agents IA introduisent un régime non-déterministe : même input, outputs variables, défaillance graduelle (drift, dégradation, hallucination), causalité indirecte (prompt + contexte + modèle + données). ==Un agent ne *crashe* pas — il *dérive*.==

### 20.1.2 Les quatre angles morts de l'APM classique

Quatre angles morts caractérisent l'incapacité de l'APM traditionnel à couvrir ce nouveau terrain[^2].

- **Cécité comportementale.** L'APM suit requêtes et erreurs, mais pas les glissements comportementaux du modèle — sélection d'outils anormale, perte de contexte conversationnel, choix de réponse passé du *poliment correct* au *poliment hors-sujet*.
- **Ignorance statistique.** Incapacité à détecter des patterns probabilistes : scores bimodaux, drift de confiance, variance qui augmente sans déclencher de seuil binaire. L'APM ne sait pas voir une distribution qui s'étale.
- **Vide causal.** Les outils déterministes supposent une causalité directe (stack trace → ligne de code). L'IA se dégrade par causalité indirecte et diffuse : un nouveau prompt subtilement biaisé, une source RAG actualisée, une version de modèle silencieusement mise à jour côté provider. Le *root cause* n'est plus une ligne de code, c'est un mélange.
- **Absence de contexte.** Inspection requête par requête sans vision des patterns séquentiels, alors que la chaîne de raisonnement est précisément ce qu'il faut observer.

Les chiffres parlent. 89 % des organisations ayant déployé des agents ont implémenté une forme d'observabilité dédiée[^9] ; 57 % ont des agents en production[^5] ; et Gartner prédit que ==40 % des projets d'IA agentique seront annulés d'ici 2027 pour des raisons de fiabilité==[^4]. L'écart entre expérimentation et production enterprise — moins de 10 % des organisations ont scalé l'agentique au niveau fonctionnel[^3] — est avant tout un **gap d'observabilité**.

> [!INFO] Voir [Ch. 19 — Évaluer un agent (et débunker les leaderboards)](ch19-evaluation-benchmarks.md) · [Ch. 23 — Mesurer le ROI (et le paradoxe agentique)](ch23-roi-paradoxe-agentique.md)
> Le [Ch. 19](ch19-evaluation-benchmarks.md) a posé l'évaluation **avant** déploiement : trajectoires, pass^k, graders, playbook gruyère 8 étapes. L'autre mouvement : la trajectoire devient un objet d'observation **en production**, et le matériau que l'eval offline manipule est désormais le **trafic réel** scoré en continu. Le [Ch. 23](ch23-roi-paradoxe-agentique.md) (ROI) en tirera les conséquences économiques — l'observabilité est le seul moyen d'attribuer un coût à un outcome.

---

## 20.2 Les six piliers de la télémétrie agentique

L'instrumentation d'un agent en production exige une couverture sur six dimensions distinctes, qui doivent toutes être croisées dans le bus de télémétrie[^5][^6]. Aucune n'est suffisante seule ; chacune sert d'angle de lecture des cinq autres.

![Les six piliers de la télémétrie agentique|1300](../../observabilite-agents-ia/images/20260430-02-six-piliers-telemetrie.svg)

### 20.2.1 Usage et tokens — le pilier le plus opérationnel

Tokens en entrée et en sortie pour chaque appel modèle, combinés au provider et au modèle utilisés. Cela révèle d'où viennent les coûts, quels agents ou routes sont onéreux, et comment l'usage évolue après modification du prompt ou du routing. La spec OTel GenAI v1.37+ standardise les attributs `gen_ai.usage.input_tokens` et `gen_ai.usage.output_tokens`[^11]. Le pilier est le plus opérationnel parce qu'il **se lit dans n'importe quelle direction** : par agent, par tenant, par feature, par utilisateur final, par heure de la journée.

### 20.2.2 Performance — latence de bout en bout, TTFT, throughput

La latence agentique se décompose en au moins quatre temps : latence du modèle (TTFT, *time to first token* ; ITL, *inter-token latency*), latence des outils (un tool qui appelle Snowflake peut prendre 6 secondes ; un tool qui appelle un cache local, 12 ms), latence du harness (parsing du `tool_use`, dispatch, retry), latence des sidecars (vector store retrieve, log enrichment, security wrap). Les métriques infrastructure classiques restent pertinentes mais ne suffisent plus — un TTFT de 200 ms peut masquer 8 secondes cumulées en outils.

### 20.2.3 Comportement — le cœur de l'observabilité agentique

Quelles décisions l'agent prend-il ? Quels outils sélectionne-t-il ? Comment navigue-t-il entre ses étapes de raisonnement ? C'est ici que les traces distribuées prennent toute leur dimension, avec des spans hiérarchiques représentant chaque opération (cf. §20.3). C'est aussi le pilier **le plus difficile à instrumenter sans framework** — un agent maison construit autour d'une boucle `while stop_reason == "tool_use"` n'émet rien par défaut. Les SDKs Anthropic, OpenAI Agents, Claude Agent SDK, Google ADK, AWS Strands émettent désormais nativement des spans OTel ; les builds maison doivent ajouter Promptfoo, Langfuse SDK, OpenLLMetry ou OpenLIT pour rattraper.

### 20.2.4 Qualité — la métrique qui déplace la question

Le pilier qualité déplace la question de *« l'agent a-t-il répondu ? »* vers *« la réponse était-elle correcte, complète et alignée avec les politiques ? »*. Les évaluations automatisées — LLM-as-a-judge, heuristiques, scorers custom — mesurent la qualité à l'échelle. Galileo annonce une précision de 93-97 % sur ses Luna-2 evaluators ; Braintrust intègre 25+ scorers built-in ; Anthropic publie sa méthodologie de calibration[^14][^15].

C'est le pilier le plus jeune en production. Trois ans après l'apparition des juges LLM, la maturité opérationnelle reste très inégale : ==trois entreprises sur quatre déclarent évaluer leurs agents en offline ; moins d'une sur cinq évalue en *online* sur le trafic réel==. C'est précisément le saut N2 → N3 documenté au §20.7.

### 20.2.5 Gouvernance — ce qui a été activé

Quels guardrails se sont déclenchés ? Ont-ils bloqué ou modifié des actions ? Quelles sources de données l'agent a-t-il interrogées ? Quels outils ont été refusés ? Ce pilier est essentiel pour l'audit, l'explication des blocages, et la traçabilité réglementaire — finance, santé, secteur public. Il est aussi le **pilier le plus directement consommé par le cognitive audit trail** (§20.6) : un guardrail bloque, un log structuré est émis, une obligation documentaire AI Act art. 12-13-15 est satisfaite. Sans ce pilier, on documente que l'agent a tourné ; on ne documente pas *qu'il a été contrôlé*.

### 20.2.6 Drift et fiabilité — l'évolution temporelle

Capture l'évolution temporelle des scores d'évaluation pour détecter la dérive comportementale. Quand un nouveau prompt, modèle ou outil dégrade la fiabilité, le changement apparaît comme un *shift* dans les scores et les patterns d'erreur sur le trafic réel — pas comme une erreur runtime. Trois familles de drift à suivre : *data drift* (la distribution des entrées change), *concept drift* (la définition d'une bonne réponse change), *trajectory drift* (l'agent prend des chemins qu'il ne prenait pas — un nouveau tool, un nouveau pattern de retries).

> [!IMPORTANT] La valeur se révèle à la croisée
> Aucun des six piliers n'est suffisant seul. ==Un coût qui explose **sans** drift de qualité signale un problème de routing ; un drift de qualité **sans** surcoût signale un problème de prompt ou de modèle ; un drift comportemental **sans** drift de qualité signale soit que le nouveau chemin est meilleur, soit que la métrique ne capte pas ce qui s'est cassé.== C'est le croisement qui produit le diagnostic — et c'est précisément ce que le bus d'observabilité §20.3 est conçu pour rendre possible.

---

## 20.3 Architecture de référence — le bus d'observabilité comme colonne vertébrale

L'erreur la plus fréquente dans les premières implémentations consiste à traiter l'observabilité comme une couche de monitoring **en aval** du système agentique. La bonne abstraction est inverse : le bus d'observabilité est une **colonne vertébrale horizontale** que tous les composants traversent[^7].

![Architecture multi-agents avec bus d'observabilité|1300](../../observabilite-agents-ia/images/20260430-03-architecture-bus-observabilite.svg)

Trois choix de design méritent attention. Le premier est la **séparation orchestration / capacités**. Le planner décompose en sous-objectifs, l'executor appelle outils et modèles, le critic évalue et replanifie si nécessaire. Cette séparation rend chaque rôle observable individuellement : la boucle de correction critic → planner produit un span imbriqué visible dans les traces, ce qui permet de mesurer le coût et la latence du *self-correction* indépendamment du coût et de la latence de la première proposition.

Le second est la **sandbox d'outils**, isolée du système de production. C'est elle qui exécute les actions de l'executor — appels API, requêtes vector store via MCP, exécution de code. L'isolation est à la fois sécuritaire (un agent compromis ne peut pas atteindre la prod directement — cf. [Ch. 21](ch21-gardefous-securite-globale.md)) et observable (chaque appel produit un span `execute_tool` avec ses paramètres et son résultat capturés en option).

Le troisième est l'unification mémoire / télémétrie en un **plan horizontal**. La mémoire agent (épisodique, sémantique, procédurale — cf. [Ch. 9](ch09-memoire-agentique.md)) et le bus de télémétrie partagent la même position structurelle : transverse à toutes les opérations, accessible en lecture/écriture par tous les agents, persistante au-delà d'une trace individuelle. Cette parité conceptuelle simplifie la gouvernance — la rétention des spans devient un sujet aussi régulé que la rétention des entrées mémoire (cf. [Ch. 10](ch10-compaction.md) § *RGPD art. 17 + AI Act art. 10/25*).

Le bus central — OpenTelemetry GenAI — exporte vers N backends via OTLP. ==C'est le point de découplage stratégique qui justifie l'effort d'instrumentation.== C'est aussi le sujet de la section suivante.

---

## 20.4 OpenTelemetry GenAI — le standard d'instrumentation

### 20.4.1 La coalition et le statut

Le projet **GenAI Observability** au sein d'OpenTelemetry est porté par une coalition de contributeurs (Amazon, Elastic, Google, IBM, Langtrace, Microsoft, OpenLIT, Scorecard, Traceloop) et joue pour les agents IA le rôle qu'OpenTelemetry a joué pour les microservices : un vocabulaire commun qui rend l'instrumentation portable[^11][^7]. Les conventions sémantiques `gen_ai.*` (v1.37+ en avril 2026, statut expérimental, transition vers stable prévue S2 2026) définissent quatre types de spans canoniques.

![Anatomie d'une trace OpenTelemetry GenAI|1300](../../observabilite-agents-ia/images/20260430-04-anatomie-trace-otel-genai.svg)

### 20.4.2 Les quatre types de spans

- **Agent spans** (`invoke_agent`) — un span racine par invocation d'agent, portant `gen_ai.agent.name`, `gen_ai.agent.id`, `gen_ai.conversation.id`. Le `SpanKind` est `CLIENT` pour un agent distant et `INTERNAL` pour un agent in-process. C'est l'identité de la session — la racine de tout ce qui suit.
- **Model spans** (`chat`, `text_completion`) — un span par appel LLM, portant `gen_ai.request.model`, `gen_ai.response.model` (==le modèle réellement utilisé peut différer du modèle demandé via aliasing/routing — piège fréquent, qu'on découvre seulement après que le provider a silencieusement migré==), `gen_ai.usage.input_tokens`, `gen_ai.usage.output_tokens`.
- **Tool spans** (`execute_tool`) — un span par invocation d'outil, avec `gen_ai.tool.name`, `gen_ai.tool.call.id`, et `gen_ai.tool.type` parmi `function` (outil côté client), `extension` (outil côté agent), `datastore` (RAG, grounding).
- **Events** — `gen_ai.client.inference.operation.details` capture les payloads en opt-in ; `gen_ai.evaluation.result` attache un score de qualité directement au span de l'opération évaluée, plutôt que de le stocker séparément. C'est ce dernier point qui rend l'éval continue (§20.5) techniquement faisable.

### 20.4.3 Un instrument, N backends — la promesse OTel pour l'IA

Le déploiement opérationnel passe par le pattern **un instrument, N backends**. C'est la proposition de valeur fondamentale d'OTel pour l'IA : découpler l'instrumentation du backend d'observabilité.

![Un instrument, N backends — la promesse d'OpenTelemetry|1300](../../observabilite-agents-ia/images/20260430-05-un-instrument-n-backends.svg)

L'application instrumentée une fois (SDK OTel + auto-instrumentor) émet des spans conformes vers un **Collector central** qui applique les processors — redaction PII, sampling, enrichissement, routing — puis exporte vers les backends choisis : incumbents APM, AI-native, ou stack open-source self-hosted. Trois bonnes pratiques structurent un déploiement mature[^13][^11].

- **Premièrement**, activer le flag `gen_ai_latest_experimental` pour utiliser les conventions v1.37+ et anticiper la stabilisation. Le coût d'un *upgrade* après stabilisation est non nul mais maîtrisable ; l'inverse — partir sur une convention non-standard et migrer plus tard — coûte deux à trois fois plus.
- **Deuxièmement**, désactiver le content capture en production par défaut (`OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=false`). Les prompts contiennent souvent des données sensibles ; le Collector reste le seul endroit où les PII peuvent être redactées avant export.
- **Troisièmement**, utiliser le Collector OTel comme **gateway centralisée** : c'est le point unique de redaction, sampling et routing, et le seul moyen de déployer une politique homogène à travers les frameworks d'agents.

Côté écosystème, **OpenLLMetry** (Traceloop, en cours de donation à OpenTelemetry) couvre 44+ providers LLM et frameworks d'agents[^16]. **OpenLIT** propose une instrumentation en une ligne (`openlit.init()`) couvrant LLMs, vector DBs, GPUs[^17]. Les frameworks récents — PydanticAI, smolagents, Strands Agents, CrewAI, Google ADK — émettent nativement des traces OTel sans dépendance tierce.

> [!QUOTE] La stratégie anti-lock-in passe par OTel
> *Recommander OpenTelemetry comme standard d'instrumentation en mission consulting protège le client contre le lock-in vendor tout en gardant la flexibilité de changer de backend sans réinstrumenter — un argument de négociation puissant face aux SaaS dominants dont la facture peut atteindre 40 à 200 % de surcoût après ajout du monitoring IA*[^19]. Le coût d'instrumentation est marginal au démarrage et asymptotique si on attend. Le choix de backend devient révisable — ce qui transforme la négociation commerciale.

---

## 20.5 Boucles de correction — du blocage 100 ms au refactor

Une plateforme d'observabilité qui ne déclenche aucune réaction n'est qu'un dashboard. La valeur opérationnelle vient des **boucles de correction** qu'elle orchestre, depuis le blocage automatique en moins de 100 ms jusqu'au refactor stratégique sur plusieurs jours.

![Hiérarchie d'alertes et boucles de correction|1300](../../observabilite-agents-ia/images/20260430-06-hierarchie-alertes-boucles.svg)

Cinq niveaux de réaction (L0 à L4) avec leurs déclencheurs, leurs réponses, leurs responsables et leurs SLA. La hiérarchie n'est pas une échelle de gravité mais ==une échelle de cognition requise : plus on monte, plus la décision exige du contexte humain==.

- **L0 — Blocage automatique (< 100 ms).** Guardrail content moderation, classifier d'injection, allowlist d'outils. La décision est prise au runtime sans intervention. Responsable : l'agent lui-même via son harness ; pas de notification, juste un log structuré.
- **L1 — Rollback automatique (< 1 minute).** Un score d'éval en ligne sous un seuil, sur N requêtes consécutives, déclenche un *rollback* à la version précédente du prompt ou du modèle. Responsable : la plateforme. Notification ops à *post-mortem*, pas en temps réel — un agent qui rollback proprement n'est pas un incident.
- **L2 — Alerte ops (< 5 minutes).** Drift comportemental détecté sur une fenêtre glissante. Le système alerte un ingénieur IA d'astreinte. Décision : investiguer, escalader, ou laisser passer (faux positif). Responsable : l'astreinte ; SLA acknowledge < 5 minutes.
- **L3 — Investigation produit (< 24 h).** Pattern récurrent qui ne déclenche pas de seuil unique mais qui dégrade lentement la qualité. Un PM / un data scientist / un *agent engineer* prend en charge la session de diagnostic. SLA fix < 24-72 h.
- **L4 — Refactor stratégique (semaines).** Le pattern signale un problème d'architecture, pas un bug. Changement de modèle, reconception du prompt, ajout d'un nouvel outil, refonte d'une politique. Responsable : le *tech lead* avec sponsor produit.

### 20.5.1 Trois pratiques qui structurent un alerting mature

**Évaluations online continues** — scorer **chaque interaction** en production, pas seulement en offline, pour détecter les régressions en temps réel. Sans cela, le drift n'apparaît qu'au prochain audit batch, parfois plusieurs semaines après l'incident. C'est exactement le saut N2 → N3 ; c'est aussi le saut le plus coûteux en discipline de calibration des juges.

**Alertes multi-signal** — croiser latence + score qualité + coût pour éviter les faux positifs. Une latence élevée seule peut être un pic temporaire ; une latence élevée corrélée à un drop de score qualité **et** un surcoût signale une régression réelle. La règle d'hygiène : ==un seul signal, un dashboard ; trois signaux corrélés, une alerte==.

**Conversion trace → test case** (innovation Braintrust)[^14] — quand un problème est détecté en production, convertir la trace fautive en cas de test permanent dans le dataset d'évaluation. C'est le mécanisme qui transforme un incident isolé en immunité durable du système. Sans cette conversion, les équipes ré-investiguent le même type d'incident tous les trois mois.

> [!ATTENTION] L'asymétrie L0 / L4
> Le coût marginal d'un blocage L0 est négligeable ; le coût marginal d'un refactor L4 est gigantesque. Les équipes mature **investissent dans les seuils L0-L1 dès le pilote** pour ne pas accumuler de dette qui se paie ensuite en L3-L4. Une équipe qui n'a aucun blocage automatique en J+30 du passage en prod est une équipe qui paiera ses incidents en jours-ingénieur cinq trimestres plus tard.

---

## 20.6 Le cognitive audit trail — réponse AI Act, RGPD, DORA

### 20.6.1 La nouvelle catégorie de log

Pour les environnements régulés (finance, santé, assurance, secteur public), un mécanisme spécifique s'ajoute aux cinq niveaux ci-dessus : le **cognitive audit trail**[^5]. Chaque trace est enrichie avec **métadonnées de versioning de modèle**, **tagging de politique**, et **contrôle d'accès**. Cela produit une lignée complète du raisonnement agent, permettant de répondre *a posteriori* à la question : *« pourquoi cet agent a-t-il pris cette décision à ce moment-là, sur la base de quelles données ? »*

Ce n'est pas un dashboard, ce n'est pas un log applicatif, ce n'est pas une trace OTel : c'est ==une catégorie de **document opérationnel**==, signée, horodatée, à rétention longue, soumise à un droit d'accès. Quatre régulations européennes le rendent obligatoire ou quasi-obligatoire en 2026-2027.

- **AI Act art. 12-13** — *record keeping* et *transparency obligations* pour les systèmes haute-risque. Obligation de conserver les logs automatiquement générés tant qu'ils sont pertinents pour le cycle de vie du système. Art. 12 entre en application le 2 août 2026 pour les systèmes haute-risque déjà déployés.
- **AI Act art. 15** — *cybersecurity* et *accuracy*. Documentation des mécanismes de robustesse face aux entrées adversariales (cf. [Ch. 21](ch21-gardefous-securite-globale.md)). Le journal d'observabilité fait partie de la technical file.
- **RGPD art. 22** — *automated individual decision-making*. Pour toute décision purement automatisée à effet juridique ou significatif, le sujet a un droit à une explication. ==L'explication ne s'invente pas a posteriori ; elle se construit en amont, dans le cognitive audit trail==.
- **DORA** (Digital Operational Resilience Act, application 17 janvier 2025 pour le secteur financier UE) — *ICT-related incidents* doivent être documentés et déclarés. Pour un agent CRM bancaire, un drift de score de qualité au-delà d'un seuil constitue un incident ICT au sens DORA — et le cognitive audit trail est ce qu'on présente à l'ACPR.

### 20.6.2 Ce que doit contenir un cognitive audit trail bien fait

À minima, six classes d'informations doivent être versionnées et signées :

- L'**identité de l'agent** (nom, version, hash du prompt système, hash du jeu de skills chargées).
- L'**identité du modèle réellement utilisé** (`gen_ai.response.model`, pas seulement la valeur demandée).
- La **trajectoire d'outils** (`execute_tool` spans dans l'ordre, avec leurs paramètres et leurs résultats résumés).
- La **chaîne de provenance des données** lues (sources RAG, tenant, *trust level*, hash du document).
- Les **guardrails déclenchés** (cf. [Ch. 21](ch21-gardefous-securite-globale.md)) — quels classifiers ont bloqué, quels ont laissé passer, quelle action a été modifiée.
- Le **score d'évaluation en ligne** attaché à la trace, avec l'identité du juge et la version de la rubrique.

> [!IMPORTANT] Cognitive audit ≠ logging classique
> Un log applicatif a une rétention de quelques semaines, n'est pas signé, n'est pas opposable. Un cognitive audit trail est ==signé, à rétention pluri-annuelle, soumis à droit d'accès, et structurellement décorrélé de la performance applicative==. Le confondre avec du logging classique conduit à la situation observée chez plusieurs banques tier 2 en 2025 : un audit interne demande la trace d'un agent six mois plus tard, et la rétention OTel l'a déjà purgée. ==Pas de cognitive audit trail = pas de défense devant le régulateur.==

### 20.6.3 La couche `gen_ai.compaction.*` — front actif du WG GenAI

Une convention candidate, actuellement discutée au Working Group OTel GenAI (fin 2026), propose une famille d'attributs `gen_ai.compaction.*` pour documenter les opérations de compaction décrites au [Ch. 10](ch10-compaction.md) — `policy_id`, `signed_by`, `tokens_dropped`, `summary_hash`, `retrieval_handle_count`. C'est le seul moyen connu de rendre une compaction **opposable** : signée à l'instant t, vérifiable à t+N mois. ==Sans cette couche, le droit à l'oubli RGPD art. 17 ne peut pas être prouvé techniquement.==

> [!INFO] Voir [Ch. 10 — Compaction](ch10-compaction.md) · [Ch. 25 — Gouvernance : AI Act, banque, machine unlearning](ch25-gouvernance-ai-act.md)
> Le [Ch. 10](ch10-compaction.md) a posé le triangle **fidélité × coût × oubliabilité** comme cadre éditorial de la compaction. L'observabilité rend la troisième dimension — l'oubliabilité — observable. Le [Ch. 25](ch25-gouvernance-ai-act.md) (gouvernance) reprendra l'angle régulatoire pour expliciter le rôle DPO / RSSI / sponsor dans la signature des politiques.

---

## 20.7 Échelle de maturité — cinq niveaux, un palier critique

L'observabilité IA n'est pas un outil qu'on installe — c'est une **capacité organisationnelle** qu'on construit. Cinq niveaux de maturité, du monitoring réactif à l'autonomie complète, structurent la trajectoire 2026-2028.

![Échelle de maturité — du monitoring réactif à l'autonomie|1300](../../observabilite-agents-ia/images/20260430-08-echelle-maturite-observabilite.svg)

Les organisations ne sautent pas directement à l'autonomie complète. Elles progressent par paliers, et chaque palier exige des prérequis qui le rendent possible[^3][^5].

- **N1 — Monitoring réactif** : logs manuels, debug ad-hoc, pas de traces. État de la majorité des projets pré-production en 2024-2025.
- **N2 — Observabilité structurée** : tracing distribué OTel, dashboards latence/tokens, alertes seuil multi-signal. Prérequis : SDK + Collector déployés. **C'est l'état atteignable en deux à quatre semaines avec une équipe disciplinée.**
- **N3 — Évaluation continue** : LLM-as-judge online, guardrails runtime, feedback loops humains, drift detection. ==**Le palier cognitif**== — la qualité devient une métrique opérationnelle. Prérequis : datasets de référence, scorers calibrés.
- **N4 — Autonomie supervisée** : auto-remédiation L0/L1, rollback automatique, scaling intelligent, workflows agentiques. Cible 2026 pour la majorité des programmes IA enterprise. Prérequis : runbooks automatisés, SLO mesurables, human-in-the-loop défini.
- **N5 — Autonomie complète** : agents d'observabilité, auto-optimisation des prompts, gouvernance AI-driven, remédiation autonome L2/L3. Horizon 2027-2028 sur scope limité. Exemples vendor : Dynatrace Intelligence, Splunk Troubleshooting Agent, Datadog Bits AI[^4][^20].

### 20.7.1 Le saut N2 → N3 — le palier cognitif

Le passage de N2 à N3 est le **saut le plus difficile**. Il exige de définir *« qu'est-ce qu'une réponse correcte ? »* de façon mesurable, via datasets de référence et scorers calibrés. C'est exactement le travail décrit en [Ch. 19](ch19-evaluation-benchmarks.md) §19.6 (LLM-as-a-judge calibré, debiased pairwise par swap, ensemble multi-modèles, calibration humaine sur 100-200 échantillons). Tant que ce travail n'a pas été fait, l'observabilité reste *cosmétique* : on voit des dashboards, on ne voit pas la qualité.

==Les organisations qui sautent ce palier — typiquement parce que le sponsor exige des « agents autonomes » avant que les juges soient calibrés — construisent de l'auto-remédiation sur des signaux non calibrés et obtiennent une autonomie illisible.== Le système rollback, alerte, escalade — mais personne ne sait si ces actions sont justifiées. Les ops apprennent à ignorer les alertes ; le sponsor finit par couper le programme.

### 20.7.2 Les agents d'observabilité — N5 et la question récursive

La tendance 2026 la plus forte est l'intégration d'**agents d'observabilité** — des agents IA spécialisés qui ingèrent les données d'observabilité pour diagnostiquer, corréler et remédier. Un agent spécialisé dans les logs analyse, extrait des patterns, trouve des anomalies puis collabore avec d'autres agents pour remédier et prévenir.

Cette autonomie n'est ni gratuite ni sûre : elle dépend de l'**observabilité de premier ordre** (les agents observent ce que la plateforme leur donne à voir) et exige une gouvernance renforcée. La question récursive est inévitable : ==qui supervise l'agent qui supervise les agents ?== La réponse 2026, pragmatique : on lui applique exactement le même contrat — six piliers, cognitive audit trail, échelle d'alerte L0-L4. Récursivement.

---

## 20.8 Cartographie du marché — incumbents APM × challengers AI-native

Le marché de l'observabilité 2026, valorisé à environ 60 Md USD[^4], se structure autour d'un **double marché** : incumbents APM (full-stack, gouvernance, échelle) et challengers AI-native (eval, guardrails, traces cognitives). La frontière s'estompe mais reste significative en 2026.

![Quadrant : maturité plateforme × capacité IA-native|1300](../../observabilite-agents-ia/images/20260430-07-quadrant-vendor-landscape.svg)

### 20.8.1 Incumbents APM — la course au rattrapage AI-native

**Dynatrace** (Leader Gartner, #1 Ability to Execute pour la 15ᵉ année consécutive[^18]) revendique le territoire premium avec trois différenciateurs : Davis AI hypermodale (causale + prédictive + générative), Grail (data lakehouse unifié sans indexation), et Smartscape (graphe de dépendances temps réel). Depuis février 2026, Dynatrace Intelligence positionne la plateforme comme un *« OS agentique »* avec des Intelligence Agents spécialisés (SRE / Developer / Security) et un MCP Server pour l'interaction avec assistants IA externes[^20].

**Datadog** (Leader Gartner, 5ᵉ année[^18]) a la trajectoire de challenger la plus crédible : LLM Observability en GA, Bits AI assistant, support natif OTel GenAI v1.37+ depuis décembre 2025[^21], Experiments pour A/B testing de prompts, Sensitive Data Scanner inclus. Mais sa facturation cumule per-host APM + per-GB logs + per-span traces + ==per-LLM-span (8 $/10K spans annuel)== — les workloads IA peuvent multiplier la facture par 2 à 3.

**Splunk/Cisco** mise sur la convergence sécurité-observabilité avec AI Agent Monitoring (GA Q1 2026), Cisco AI PODs pour le monitoring d'infrastructure IA pré-validée (NVIDIA NIMs, Milvus, LiteLLM), un Troubleshooting Agent et le Splunk MCP Server. La complexité post-acquisition Cisco et la coexistence Splunk/AppDynamics restent des friction points.

**Grafana Labs** (Leader Gartner, #1 Completeness of Vision[^22]) capture le segment OTel-first / coût-conscient avec la stack LGTM (Loki/Grafana/Tempo/Mimir). Pas de capacité d'évaluation IA native, mais réception native des traces GenAI via Tempo et ==coût 10 à 50× inférieur aux solutions propriétaires==. **Elastic** (Leader Gartner) et **New Relic** (pricing transparent, pivot mid-market) complètent le paysage.

### 20.8.2 Challengers AI-native — l'évaluation comme primitive

Côté challengers AI-native, le segment se structure autour de l'**évaluation comme primitive d'observabilité** — précisément le gap que les incumbents n'ont pas encore fermé[^14].

- **Langfuse** (open-source MIT, OTel natif, self-hosted ou cloud) — le leader open-source de référence ; gratuit, communauté active, intégrations framework natives.
- **Braintrust** — plateforme intégrée eval-first, conversion traces → test cases en un clic, Loop AI pour scorers custom, 25+ scorers built-in ; utilisé par Notion, Stripe, Zapier.
- **Arize AI** + **Phoenix** (open-source) — rigueur statistique académique, embedding drift detection, pont entre ML traditionnel et LLM observability.
- **Galileo AI** — Luna-2 evaluators avec précision propriétaire 93-97 %, guardrails production[^15].
- **Maxim AI** — full lifecycle (simulation + évaluation + observabilité unifiées).

| Critère | Incumbents (Dynatrace, Datadog…) | AI-native (Langfuse, Braintrust…) |
|---|---|---|
| Latence, tokens, errors | Excellent | Bon |
| Topologie et dépendances | Excellent | Absent |
| Infrastructure monitoring | Complet | Absent |
| Évaluation qualité output | Basique | Excellent |
| LLM-as-judge automatisé | Limité | Natif |
| Guardrails runtime | Émergent | Intégré |
| Traces → test cases | Absent | Natif (Braintrust) |
| Prompt management | Absent | Natif (Langfuse) |
| Coût relatif | $$$$$ | $ à $$ |
| Self-hosted | Limité | Disponible (Langfuse MIT) |

### 20.8.3 La règle hybride

Le choix n'est pas binaire. ==L'architecture mature en 2026 est typiquement **hybride** : un backend full-stack== (Dynatrace, Datadog ou Grafana selon le profil) couplé à un outil AI-native (Langfuse ou Braintrust) pour la couche évaluation, le tout fédéré par OpenTelemetry comme protocole d'instrumentation unique. C'est exactement parce qu'aucun acteur ne couvre seul le spectre — et c'est précisément ce que le découplage OTel permet de bricoler sans s'enfermer.

> [!INFO] Voir [Ch. 22 — Runtime managé et déploiement](ch22-runtime-manage.md)
> Les runtimes managés des hyperscalers (AWS Bedrock AgentCore Observability, Vertex AI Agent Engine telemetry, Azure AI Foundry tracing) embarquent leur propre couche d'observabilité, **OTel-compliant**. Ce sont des choix raisonnables pour un mono-cloud — au prix d'un couplage qui se paie le jour du multi-cloud (cf. [Ch. 22](ch22-runtime-manage.md) §sur la portabilité).

---

## 20.9 Récap chapitre — quatre disciplines, un standard

![Le bus d'observabilité et les six piliers — récap chapitre|1300](../../observabilite-agents-ia/images/20260430-03-architecture-bus-observabilite.svg)

==**À retenir** : quatre disciplines et un standard.==

==**Quatre disciplines** :== (1) instrumenter dès le premier sprint ; (2) construire les six piliers — usage, performance, comportement, qualité, gouvernance, drift — et lire à la croisée ; (3) franchir le palier N2 → N3 en calibrant les juges avant d'investir l'autonomie ; (4) produire un cognitive audit trail signé, opposable, à rétention longue, pour répondre à AI Act + RGPD + DORA.

**Un standard.** OpenTelemetry GenAI semantic conventions, v1.37+, dont la stabilisation S2 2026 va clore une fenêtre de prudence. ==Toute architecture qui n'est pas déjà OTel-compliant en janvier 2026 doit avoir un plan de migration daté en mars 2026.== Sinon, c'est de la dette qui se paiera au prochain trimestre, avec un facteur de coût de 2 à 3.

Pour une équipe Data & AI qui démarre :

1. **Une instrumentation OTel native** dès le pilote, avec backend Langfuse self-hosted ou Phoenix. Les traces deviennent le matériau de toutes les analyses ultérieures — éval ([Ch. 19](ch19-evaluation-benchmarks.md)), ROI ([Ch. 23](ch23-roi-paradoxe-agentique.md)), audit ([Ch. 25](ch25-gouvernance-ai-act.md)).
2. **Un Collector OTel centralisé** avec processors de redaction PII et politique de sampling, déployé avant la première mise en production. C'est le point unique de gouvernance.
3. **Trois à cinq scorers calibrés** sur des cas critiques (faithfulness RAG, tool-use accuracy, policy compliance), avec 100-200 annotations humaines pour ancrer la corrélation.
4. **Un cognitive audit trail signé** dès la première mise en prod régulée, avec rétention alignée sur l'AI Act art. 12 (durée pertinente pour le cycle de vie du système — souvent 5 ans pour banque/santé).

L'investissement marginal au-delà (agents d'observabilité N5, RCA automatisé, Luna-2 SLM-judge custom) doit attendre que le palier N3 soit consolidé — ==sinon il optimise un système qu'on ne sait pas encore mesurer==.

---

> [!WARNING] Trois pièges classiques (les trois sont 100 % traçables)
> **POC sans observabilité** — dette technique massive le jour du passage en prod. On ne corrige pas ce qu'on ne voit pas — on invente des hypothèses, on rejoue des cas au hasard, et le glissement comportemental se creuse à bas bruit jusqu'à l'incident. Coût moyen documenté pour rattraper après-coup : 3 à 5× le coût d'instrumentation initiale, sans compter les incidents qui auraient été évités.
>
> **Per-LLM-span billing non lu au moment de la signature** — un workload agentique émet 10 à 50× plus de spans qu'un service classique. Une facture Datadog ou New Relic dimensionnée sur l'APM classique double à triple en six mois. ==La clause de révision doit être négociée à la signature, pas découverte au premier renouvellement==.
>
> **Juge LLM unique non calibré** — position bias 10-20 %, verbosity bias, self-enhancement bias (cf. [Ch. 19](ch19-evaluation-benchmarks.md) §19.6). Un juge unique sur une rubrique vague produit un score qui dépend autant du juge que de l'agent. Les ops apprennent à ignorer les alertes ; les alertes deviennent du bruit ; ==l'observabilité retombe au niveau N2 avec un dashboard plus joli==. Sans debiased pairwise par swap, ensemble multi-modèles, et calibration humaine sur 100-200 échantillons, ce qu'on appelle « éval continue » est en réalité du bruit signé.

---

## Sources

[^1]: OpenTelemetry, *AI Agent Observability Standards*, OpenTelemetry Blog, mars 2025. <https://opentelemetry.io/blog/2025/ai-agent-observability/>

[^2]: InsightFinder, *AI Observability vs Traditional Monitoring*, décembre 2025. <https://insightfinder.com/blog/ai-observability-vs-traditional-monitoring/>

[^3]: IBM Think, *Observability Trends 2026*, IBM Institute for Business Value, mars 2026. <https://www.ibm.com/think/insights/observability-trends>

[^4]: Dynatrace, *Six Observability Predictions for 2026*, décembre 2025. <https://www.dynatrace.com/news/blog/six-observability-predictions-for-2026/>

[^5]: Kore.ai, *AI Observability: Monitoring & Governing AI Agents*, mars 2026. <https://www.kore.ai/blog/what-is-ai-observability>

[^6]: Voiceflow, *What Is AI Agent Observability? A 2026 Guide*, mars 2026. <https://www.voiceflow.com/blog/what-is-ai-agent-observability>

[^7]: Anthropic, *Building Effective Agents*, whitepaper, décembre 2024. <https://www.anthropic.com/research/building-effective-agents>

[^9]: N-iX, *AI Agent Observability: Practical Framework*, décembre 2025. <https://www.n-ix.com/ai-agent-observability/>

[^11]: OpenTelemetry, *GenAI Semantic Conventions (specification)*, version 1.37, 2026. <https://opentelemetry.io/docs/specs/semconv/gen-ai/>

[^13]: Datadog, *LLM Observability + OTel GenAI Semantic Convention support*, décembre 2025. <https://www.datadoghq.com/blog/llm-otel-semantic-convention/>

[^14]: Braintrust, *AI Observability Tools: Buyer's Guide 2026*, janvier 2026. <https://www.braintrust.dev/articles/best-ai-observability-tools-2026>

[^15]: GetMaxim, *Top 5 AI Agent Observability Platforms 2026*, décembre 2025. <https://www.getmaxim.ai/articles/top-5-ai-agent-observability-platforms-in-2026/>

[^16]: Traceloop, *OpenLLMetry — auto-instrumentation OTel pour 44+ providers LLM*, GitHub, 2026. <https://github.com/traceloop/openllmetry>

[^17]: OpenLIT, *OpenLIT SDK — auto-instrumentation 1 ligne LLMs/vector DBs/GPUs*, GitHub, 2026. <https://github.com/openlit/openlit>

[^18]: Gartner, *Magic Quadrant for Observability Platforms 2025*, juillet 2025. <https://www.gartner.com/en/documents/6688834>

[^19]: OneUptime, *AI Workloads Observability: Cost Crisis*, avril 2026. <https://oneuptime.com/blog/ai-workloads-observability-cost-crisis>

[^20]: Dynatrace, *Dynatrace Intelligence — Agentic OS announcement at Perform 2026*, février 2026. <https://www.dynatrace.com/news/blog/dynatrace-intelligence-platform/>

[^21]: Splunk, *Q1 2026 Observability Update — AI Agent Monitoring*, février 2026. <https://www.splunk.com/en_us/blog/observability/splunk-observability-ai-agent-monitoring-innovations.html>

[^22]: Grafana Labs, *Leader Gartner Magic Quadrant Observability 2025 — #1 Completeness of Vision*, 2025. <https://grafana.com/about/press/2025/07/>
