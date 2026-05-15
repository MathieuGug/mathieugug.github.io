---
title: La fabrique d'un agent
subtitle: Quatre stades de maturité, dix artefacts partagés, une équipe qui apprend à livrer des agents
date: 2026-05-15
author: Mathieu Guglielmino
---

# La fabrique d'un agent

> *Quatre stades de maturité, dix artefacts partagés, une équipe qui apprend à livrer des agents.*

## 0. Ouverture

### 0.1 — Hook

« Un agent ne crashe pas, il dérive. » Cette formule, posée dans le dossier *Anatomie d'un agent* (couche 07 — observabilité), résume le défi industriel que personne n'avait vraiment vu venir : les systèmes agentiques ne tombent pas en panne comme un service REST. Ils s'éloignent silencieusement de ce qu'on attendait d'eux — un token de travers dans le contexte, un outil qui retourne un format légèrement différent, une boucle qui s'emballe sur un cas limite. Le bug n'est pas binaire. Il est probabiliste.

Ce caractère probabiliste se retrouve dans les chiffres : 95 % des pilotes agentiques restent au point mort, selon les données du MIT NANDA[^mit-nanda]. Le consensus industrie 2025-2026 estime à 70 % la part des POC qui ne passent jamais en production[^poc-gap]. Et sur SWE-Bench Pro, le *même* modèle LLM peut osciller de 22 points selon le scaffold qui l'entoure[^schluntz-zhang]. Autrement dit : ce n'est pas le modèle qui fait la différence. C'est tout ce qui l'entoure.

Ce rapport raconte ce qui sépare les 5 % qui réussissent des 95 % qui restent bloqués. Pas un secret de modèle. Une discipline d'équipe.

[^mit-nanda]: MIT NANDA (Network for AI Deployment and Adoption), rapport 2025 sur l'adoption des systèmes agentiques en entreprise.
[^poc-gap]: Consensus issu de plusieurs études sectorielles (Gartner, McKinsey, Cigref 2025-2026) sur le taux de passage POC → production des projets IA.
[^schluntz-zhang]: Schluntz & Zhang, *Harness design and performance variance on SWE-Bench Pro*, 2025 — écart de 22 points de résolution entre configurations scaffold sur le même modèle de base.

### 0.2 — Thèse

==La maturité d'une fabrique se lit dans la qualité de ses artefacts partagés, pas dans son code.==

L'industrie a passé deux ans à optimiser les modèles, les prompts, les appels d'outils. Mais ce qui différencie une équipe qui livre des agents en production d'une équipe qui accumule des pilotes morts, ce n'est pas le choix du LLM. C'est la qualité de ce qui reste quand le sprint est terminé : un backlog structuré, un golden dataset versionné, un registre d'agents, une piste d'audit cognitive.

Le <span class="term" data-term="harness">harness</span> — l'infrastructure de scaffolding qui orchestre l'agent — est effectivement différenciant (Schluntz & Zhang le documentent précisément). Mais ce qui fait vivre le harness dans le temps, c'est la fabrique autour. Un harness sans fabrique s'évapore dès que le builder qui l'a conçu passe à autre chose. Avec une fabrique, il accumule : chaque itération enrichit le dataset d'évaluation, précise la politique des outils, affine les seuils de déclenchement HITL.

Un atelier qui apprend documente ses gabarits, entretient ses outils, forme ses compagnons sur des pièces de référence. Les dix artefacts partagés sont ces gabarits. La structure du rapport suit cette logique : quatre stades de maturité, dix artefacts traversants.

### 0.3 — Rappel : l'oignon à 10 couches

Pour lire ce rapport, il faut avoir en tête la grammaire de base posée dans le dossier *Anatomie d'un agent* : un agent est structuré comme un oignon à dix couches autour d'un tirage probabiliste. De la plus interne à la plus externe : **00** non-déterminisme · **01** <span class="term" data-term="boucle-taor">boucle TAOR</span> · **02** outils · **03** contexte & mémoire · **04** patterns · **05** protocoles · **06** guardrails · **07** observabilité · **08** runtime · **09** gouvernance.

==L'oignon décrit la structure ; la fabrique décrit la pratique.== L'oignon répond à « qu'est-ce qu'un agent ? » — il en décrit l'architecture interne. La fabrique répond à « comment une équipe apprend-elle à livrer des agents ? » — elle en décrit le cycle de vie. Le SCHÉMA 01 ci-dessous superpose les deux : à gauche les dix couches, à droite les dix artefacts partagés répartis selon les quatre stades.

*Pour creuser les dix couches, voir le dossier [Anatomie d'un agent](../anatomie/).*

![SCHÉMA 01 — L'oignon ↔ la fabrique|1300](images/01-oignon-fabrique.svg)

### 0.4 — Les dix artefacts partagés

La fabrique d'un agent se construit autour de dix artefacts. Chacun naît embryonnaire au stade Prototype, se formalise au stade Pilote, se industrialise en Production, se distribue au stade Mature multi-agents. La liste ci-dessous les présente dans leur ordre d'apparition naturelle dans une équipe — du plus immédiat au plus structurant.

1. **Backlog produit** — du post-it informel au DoD versionné avec critères d'acceptation agentiques.
2. **Prompt système & spec d'agent** — du griffonnage dans un Notion à l'Agent Card structurée et versionnée.
3. **Tools registry & policy** — du tools codé en dur à la politique de *least agency* explicite et auditée.
4. **Agent registry** — de la doc Confluence au système d'identité formel (Entra Agent ID ou équivalent).
5. **Contexte & mémoire** — du scratchpad de session au memory pool partagé organisé selon la taxonomie CoALA (in-context / external / parametric).
6. **Observabilité** — du `print` de débogage aux six piliers OTel GenAI : traces, métriques, logs, coûts, qualité, sécurité.
7. **Golden dataset & pipeline d'éval** — des 20 cas manuels au gruyère suisse à cinq couches : unit · integration · E2E · adversarial · human.
8. **HITL & charte de risques** — de la politique ad hoc décidée dans le sprint aux trois lignes de défense formalisées avec seuils d'escalade.
9. **FinOps & règles de routing** — des coûts subis et découverts en fin de mois au budget par agent, par flow, par tenant, avec routing automatique selon le rapport qualité/prix.
10. **ROI cards & rituels d'équipe** — du « ça marche, non ? » à la réallocation documentée du temps humain économisé, avec rituels de revue bimensuels.

Ces dix artefacts naissent, mutent et se renforcent au fil des quatre stades. La colonne droite du SCHÉMA 01 ci-dessus les reprend visuellement ; le SCHÉMA 12 en clôture les déploie en matrice complète 10 × 4 stades.

### 0.5 — Comment lire ce rapport

Ce rapport s'adresse à trois types de lecteurs. Chacun a son parcours optimal.

- 🎯 **PM / PO produit** (~25 min) — Lire les sections 0 et 5 intégralement, puis dans chaque stade (1 à 4) : le chapeau introductif, les artefacts 1-2-7-10, et les callouts 🎯. Passer les développements techniques des artefacts 3-4-5-6.
- 🔧 **Builder / Tech lead** (~40 min) — Lecture intégrale recommandée, annexes comprises. Les callouts 🔧 signalent les points d'implémentation à ne pas manquer.
- 🧭 **Cadre tech encadrant** (~20 min) — Sections 0 et 5 + les callouts 🧭 dans chaque stade, qui pointent sur les bascules organisationnelles et les signaux de passage de niveau.

Les passages adressés spécifiquement à l'un des trois lecteurs sont signés 🎯 / 🔧 / 🧭 en tête de callout. Le rapport comporte également : un **glossaire de 20 termes** (annexe A — les termes soulignés dans le corps du texte y renvoient), un **mapping vers les neuf dossiers existants** du site pour approfondir chaque couche (annexe B), et des **sources numérotées** en annexe C.

## 1. Stade 1 · Prototype · « ça parle »

### 1.1 — La scène

L'atelier tient sur un bureau. Un seul personnage. Un notebook Jupyter ouvert sur la moitié droite de l'écran, une fenêtre de terminal sur la gauche. Collé sur le bord du moniteur, un post-it jaune avec cinq mots griffonnés : *« arrêter quand c'est fini »*. C'est le vrai premier problème.

![SCHÉMA 02 — L'atelier · Stade 1 (Prototype)|1300](images/02-atelier-prototype.svg)

La boucle TAOR — Think · Act · Observe · Repeat — a été introduite dans la section 0.3 comme couche 01 de l'oignon. Ici elle devient concrète. C'est la première chose qu'on programme, avant même le prompt : décider quand l'agent s'arrête. Tant que le modèle pense (Think), appelle un outil (Act), observe la réponse (Observe), il boucle. Le `stop_reason` est l'instruction qui dit « j'ai fini ». Sans lui, l'agent tourne — et facture.

> [!builder] **Pour le builder** 🔧
>
> La boucle TAOR est techniquement un `while not stop_reason : do(think → act → observe)`. Le `stop_reason` est l'instruction du modèle qui dit « j'ai fini ». Anthropic SDK distingue `end_turn` (réponse normale), `max_tokens` (saturation), `stop_sequence` (motif d'arrêt), `tool_use` (l'agent appelle un outil et la boucle attend le retour). Au Prototype, on ignore généralement les trois derniers cas — ce qui est précisément ce qui finit en boucle infinie.

Au stade Prototype, tout ça vit dans le notebook. Il n'y a pas de CI, pas de déploiement, pas d'utilisateur. Il y a un builder qui teste, observe, ajuste. C'est suffisant. L'objectif n'est pas la robustesse — c'est la démonstration. Montrer que « ça parle » : que l'agent comprend la tâche, appelle les bons outils dans le bon ordre, et s'arrête au bon moment.

Ce stade dure rarement plus de quelques semaines. Il doit en durer peu. Sa vertu est d'aller vite ; son risque, de durer trop longtemps.

---

### 1.2 — Les artefacts qui existent déjà sous forme brouillon

Cinq artefacts naissent au stade Prototype. Aucun n'est encore formalisé. Tous sont présents.

#### 1.2.a — Backlog post-it / doc partagé

On note tout dans un doc partagé — ou sur le post-it, ou dans un coin du README. Les idées d'amélioration, les bugs observés, les cas limites repérés lors des tests manuels. C'est pêle-mêle, non priorisé, sans *definition of ready*. Ce qui manque : un critère d'acceptation, une notion de *done*, une distinction entre « bug à corriger maintenant » et « cas limite à couvrir plus tard ». Mais c'est OK. Le backlog post-it remplit sa fonction au stade Prototype : ne rien laisser tomber. La formalisation viendra au Pilote.

#### 1.2.b — Prompt système v0

Le prompt est un palimpseste. Au début, trois lignes claires. Puis une instruction ajoutée après un bug. Puis une contrainte embarquée suite à une réunion. Puis un exemple ajouté parce que le modèle confondait deux cas. Semaine après semaine, le prompt grossit. Les instructions initiales ne sont pas effacées — elles sont recouvertes, superposées, parfois contredites par les nouvelles.

![SCHÉMA 03 — Anatomie du prompt v0 comme palimpseste|1300](images/03-prompt-palimpseste.svg)

==Un prompt qui n'est pas versionné n'est pas un artefact, c'est une faille.== Le premier signe de maturité du stade Pilote sera de mettre le prompt sous contrôle de version — un fichier, un hash, un historique. Mais au stade Prototype, ce n'est pas encore l'urgence. L'urgence est de comprendre ce que le modèle fait avec ce qu'on lui donne.

C'est ici qu'intervient le <span class="term" data-term="context-engineering">context engineering</span> — la discipline formulée par Andrej Karpathy : remplir la fenêtre de contexte avec juste la bonne information à chaque étape de la boucle TAOR. Pas trop, pas trop peu. Le prompt v0 en est la première tentative, naïve et efficace. Il sera remplacé — mais il pose les bases de ce que l'agent doit savoir pour fonctionner.

#### 1.2.c — Scratchpad mémoire de travail

L'agent écrit dans un bloc-notes éphémère pendant sa session. Il y note ses hypothèses de travail, les résultats intermédiaires, l'état de sa progression. Ce bloc-notes est lu et écrit dans la même session, puis jeté. C'est la mémoire la plus simple qui soit.

Dans la taxonomie <span class="term" data-term="coala">CoALA</span> — Cognitive Architectures for Language Agents — ce scratchpad correspond au premier des quatre piliers : la mémoire *in-context*, celle qui vit dans la fenêtre de contexte du modèle. La plus immédiate. La plus volatile. Elle disparaît à la fin du tour. Au Prototype, c'est la seule mémoire dont on a besoin.

#### 1.2.d — Golden dataset embryonnaire

Le playbook Anthropic est explicite sur ce point : *partir du manuel*. Avant d'automatiser l'évaluation, on convertit les bugs du tracker en test cases. Vingt à cinquante tâches représentatives de ce qu'on attend de l'agent. Pas cinq cents — vingt à cinquante. Le réflexe « il faut couvrir tous les cas » est l'ennemi du démarrage.

Ces premières tâches constituent le <span class="term" data-term="golden-dataset">golden dataset</span> embryonnaire : un ensemble de cas d'entrée avec leur sortie attendue, lancés manuellement après chaque modification du prompt. Ce sont des *capability evals* — on vérifie que l'agent sait faire ce qu'on lui demande, pas encore qu'il le fait de façon sûre et robuste. La rigueur viendra au Pilote. Pour l'heure, vingt tâches qu'on lance tous les jours battent cinq cents tâches qu'on lance une fois par trimestre.

> [!pm] **Pour le PM** 🎯
>
> Vous démarrez avec 20-50 tâches, pas 500. Anthropic le recommande explicitement dans son playbook d'évaluation : *partir du manuel*, convertir les bugs du tracker / queue support en test cases. Le réflexe « il faut couvrir tous les cas » est l'ennemi du démarrage. Un dataset de 20 tâches qu'on lance tous les jours bat un dataset de 500 qu'on lance une fois par trimestre.

#### 1.2.e — Logs print

Il n'y a pas encore d'OpenTelemetry. On lit dans la console. `print(f"[ACT] tool={tool_name}, input={input}")`. C'est l'antécédent direct du palier N1 de l'échelle observabilité décrite dans le dossier *observabilite-agents-ia*. Il n'y a rien de plus à dire à ce stade — c'est délibérément bref. Les logs print font le travail. Ce qu'ils ne font pas, on le découvrira en Pilote.

---

### 1.3 — Antipattern signature

> [!antipattern] **« Il marche sur mon laptop »**
>
> ==Sans budget de tours, votre agent vous présente une facture cachée.== L'agent tourne en tâche de fond, relance la boucle TAOR, appelle des outils, relance encore. Sans `max_turns`, sans détection de cycle, sans plafond de tokens par tour, cette boucle ne s'arrête pas. Elle tourne à 4 $/min — un chiffre réel, documenté dans le dossier *Anatomie d'un agent* pour un agent intermédiaire avec outils.
>
> Les conséquences sont au moins trois. D'abord, la **facture invisible** : l'agent tourne pendant que vous dormez, la note tombe le mois suivant, parfois avec quatre zéros supplémentaires. Ensuite, les **comportements non reproductibles** : si l'agent s'est arrêté aléatoirement ou sur un timeout d'infrastructure, l'utilisateur ne peut pas rejouer son cas — l'état de la boucle est perdu. Enfin, la **dépendance au compte cloud personnel du dev** : le prototype tourne sur les credentials du builder, qui est le seul à pouvoir arrêter l'agent manuellement, et le seul à recevoir l'alerte de facturation. Single point of failure.
>
> La première discipline du stade Prototype, c'est de borner les coûts. Trois lignes de code : `max_turns=20`, `cycle_detection=on`, `max_tokens_per_turn=4000`. Le <span class="term" data-term="scaffolding">scaffolding</span> qui empêche la facture cachée. Ces trois paramètres ne limitent pas la puissance de l'agent — ils définissent ses conditions d'arrêt. Sans eux, « il marche sur mon laptop » n'est pas une démonstration : c'est une minuterie.

---

### 1.4 — Signal de bascule vers Pilote

Un utilisateur réel passe son premier message à l'agent. C'est le jour J.

Ce qui change : il y a maintenant un *autre*. Le builder n'est plus le seul utilisateur. Cet autre a des attentes — une réponse en moins de dix secondes, une réponse intelligible, pas de débordement de contexte visible dans l'interface. Ces attentes n'ont pas été discutées. Elles émergent naturellement du premier usage.

Le premier `feedback user` n'est pas auto-généré. Il vient d'une vraie personne, par message, par mail ou à l'oral : *« c'est bien mais… »* ou *« pourquoi il a fait ça ? »* Ce feedback est qualitatif, subjectif, non structuré. Il est précieux exactement parce qu'il n'est pas filtré par le builder.

À ce stade, le builder n'a pas les outils pour répondre rigoureusement à ces questions. Il n'a pas de traces structurées, pas de métriques de latence, pas de pipeline d'éval automatisé. Il a les logs print, le golden dataset embryonnaire, et les retours oraux. C'est suffisant pour savoir que *quelque chose* fonctionne. Ce n'est pas suffisant pour savoir *ce qui* fonctionne, *pourquoi*, et *combien de fois*.

Le besoin de mesurer émerge naturellement à ce moment. Pas comme une exigence de gouvernance — comme une nécessité pratique. On veut savoir si le correctif du soir a amélioré les choses. On veut comparer deux versions du prompt. On veut répondre à l'utilisateur avec autre chose que « j'ai l'impression que ça va mieux ».

Le Prototype parle. Le Pilote va commencer à mesurer.

## 2. Stade 2 · Pilote · « ça mesure »

### 2.1 — La scène

L'atelier s'est agrandi. Il y a maintenant un PO — product owner — qui lit les retours utilisateur dans un Slack dédié, un premier dashboard ouvert dans un onglet de navigateur, et une alerte Slack qui vient de s'allumer pour la première fois. L'agent a dérivé. Personne ne sait encore pourquoi.

![SCHÉMA 04 — L'atelier · Stade 2 (Pilote)|1300](images/04-atelier-pilote.svg)

==La discovery du Pilote : on découvre ce qu'on ne mesurait pas.== Le passage à une vraie population d'utilisateurs révèle immédiatement trois catégories de situations que les tests manuels n'avaient pas anticipées : des cas limites non couverts dans le golden dataset, des comportements corrects en isolation qui deviennent problématiques en combinaison, et des attentes utilisateur qui diffèrent de la spécification initiale. Ce que le builder pensait savoir, le Pilote le remet en question — systématiquement.

C'est exactement le territoire que le cadre <span class="term" data-term="clear">CLEAR</span> formalise : Comprehensive (couvrir tous les critères pertinents), Linked (chaque métrique liée à un objectif produit), Efficient (pas de sur-mesure là où un standard suffit), Actionable (chaque signal déclenche une action définie), Reliable (les métriques sont reproductibles et non manipulables). Ces cinq propriétés définissent la maturité d'une pratique d'évaluation. Au Pilote, on en instancie deux ou trois — les autres arrivent avec la production. La recherche sur le déploiement de CLEAR en contexte agentique mesure systématiquement un écart de 37 % entre les scores benchmark et les scores de production réelle[^clear-gap] — cet écart n'est pas un bug, c'est le signal d'entrée du Pilote.

[^clear-gap]: CLEAR Research Consortium, *Evaluation gaps in agentic systems: from benchmark to production*, 2026 — écart médian de 37 % entre scores de benchmark et performance mesurée en production sur un échantillon de 40 déploiements pilote.

---

### 2.2 — Les artefacts qui naissent

Sept artefacts formels émergent au stade Pilote. Aucun n'existait sous sa forme rigoureuse au stade Prototype. Chacun répond à un manque précis révélé par la confrontation avec les premiers vrais usages.

#### 2.2.a — DoD adaptée aux agents

La première formalisation qu'exige le Pilote, c'est de définir ce que « fait » veut dire pour un agent. Pas pour un service REST — pour un agent. La <span class="term" data-term="dod-agents">DoD adaptée aux agents</span> est radicalement différente de la DoD classique.

Une DoD classique est déterministe : la fonction retourne le bon résultat, le test passe, le ticket est fermé. Une DoD agentique est probabiliste : l'agent réussit sur 90 % d'un golden dataset de 50 cas représentatifs, pour une latence médiane inférieure à 8 secondes, à un coût moyen inférieur à 0,12 € par requête. Ce n'est pas un seuil binaire — c'est un seuil sur une distribution. Cette DoD-là tient sur deux lignes. C'est intentionnel : une DoD agentique de plus de cinq lignes est un signe qu'on n'a pas encore décidé ce qui compte vraiment.

#### 2.2.b — Traces OTel GenAI

Le premier `print()` de débogage a fait son temps. Le Pilote introduit <span class="term" data-term="otel-genai">OTel GenAI</span> — la convention OpenTelemetry pour les systèmes agentiques — comme couche d'instrumentation structurée. Quatre spans canoniques couvrent la majorité des cas : `invoke_agent` (le déclenchement de la boucle TAOR complète), `chat` (un échange model-in/out), `execute_tool` (l'appel d'un outil avec ses paramètres et sa réponse), et `gen_ai.evaluation.result` (le résultat d'une évaluation automatisée). Ces spans portent des champs nommés standardisés : `gen_ai.usage.input_tokens`, `gen_ai.usage.output_tokens`, `gen_ai.tool.name`, `gen_ai.tool.call.id`. Pour creuser l'instrumentation OTel GenAI complète — les six piliers, la hiérarchie L0-L4, le pipeline de collecte — voir le dossier [*observabilite-agents-ia*](../observabilite-agents-ia/).

> [!builder] **Pour le builder** 🔧
>
> En production, désactivez la capture du contenu des messages : `OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=false`. Capturer le contenu brut des échanges dans les traces est utile en phase de debug — mais ruineux en volume dès que le trafic monte. Les workloads agentiques génèrent 10 à 50× plus de télémétrie qu'un service REST classique, et les messages LLM sont denses. Routez votre collecte via un Collector OTel configuré comme gateway de redaction PII et de sampling adaptatif : gardez 100 % des traces en erreur, 10 % des traces nominales. Ce seul ajustement divise généralement la facture observabilité par cinq.

#### 2.2.c — Les 3 piliers d'observabilité du Pilote

Au stade Pilote, l'observabilité repose sur trois piliers. **Usage** : combien de tokens consommés, combien d'outils appelés, combien de tours de boucle, par requête et par session. **Performance** : latence de bout en bout, latence par composant (LLM, tools, réseau), p50/p95/p99. **Comportement** : quels outils sont appelés dans quel ordre, avec quels paramètres, dans quels contextes.

Ce que le Pilote n'a pas encore : la **qualité** (qui exige <span class="term" data-term="llm-as-a-judge">LLM-as-a-judge</span>, un juge automatisé pour évaluer les réponses à l'échelle — ça arrive en production), la **gouvernance** (guardrails déclenchés, escalades HITL, piste d'audit — stade 3), et la **dérive** (évolution temporelle des distributions — stade 3 aussi). Ces trois piliers supplémentaires arrivent avec la maturité. Les ignorer au Pilote n'est pas une faiblesse — c'est du pragmatisme : instrumenter ce qu'on n'est pas encore en mesure d'interpréter ne fait qu'augmenter le bruit.

#### 2.2.d — TestCase formalisé

Au Prototype, un cas de test était une tâche décrite dans un doc partagé. Au Pilote, un cas de test a une structure formelle. La formule est : `(Persona × Quest × Environment) → Expected Outcome`. Un <span class="term" data-term="testcase">TestCase</span> spécifie *qui* (Persona — le profil de l'utilisateur et ses caractéristiques), *quoi* (Quest — la tâche ou l'objectif), *dans quel contexte* (Environment — les outils disponibles, les données d'entrée, les contraintes de session), et *ce qu'on attend* (Expected Outcome — le résultat ou le comportement attendu, avec ses critères d'acceptation).

![SCHÉMA 05 — Anatomie d'un TestCase|1300](images/05-testcase-anatomie.svg)

La distinction entre <span class="term" data-term="capability-regression">capability evals vs régression evals</span> est la clé de voûte de toute pratique d'évaluation durable. Les *capability evals* mesurent ce que l'agent sait faire — elles commencent bas (50 %, parfois moins) et progressent avec les itérations du modèle et du prompt. Les *régression evals* mesurent ce que l'agent ne doit plus jamais faire — elles stationnent à ~100 % et constituent le filet de sécurité. Quand une capability est suffisamment maîtrisée — disons, >90 % de réussite sur 30 itérations consécutives — elle est *graduée* : elle bascule dans la suite de régression et libère le budget eval pour de nouveaux cas plus difficiles. C'est ce mécanisme de `graduate` qui empêche la suite d'évaluation de stagner et de devenir une formalité.

> [!pm] **Pour le PM** 🎯
>
> Capability evals (« que sait-il faire ? ») partent bas (< 50 %) et progressent avec le modèle. Régression evals (« gère-t-il toujours les acquis ? ») stationnent à ~100 %. Quand une capability sature, vous la *graduate* : elle passe en suite de régression et libère le budget eval pour de nouveaux cas plus difficiles. Sans ce mécanisme, votre suite stationne et votre équipe arrête d'y croire — elle lance les tests, voit 94 %, et ne sait plus si c'est bon ou mauvais. Le `graduate` rend la progression lisible.

#### 2.2.e — Mémoire sémantique + épisodique

Le scratchpad de session (mémoire in-context, pilier #1 de CoALA) ne suffit plus dès que les sessions s'accumulent et que la base de connaissance grandit. Au Pilote, deux nouveaux piliers CoALA entrent en jeu. La **mémoire sémantique** (#2) correspond au RAG basique : un vector store alimenté par les documents de référence, une couche de retrieval qui injecte les passages pertinents dans la fenêtre de contexte à chaque tour. La **mémoire épisodique** (#3) correspond aux logs horodatés des sessions passées : l'agent peut y accéder pour retrouver ce qu'il a fait la semaine dernière avec un utilisateur donné, ou pour diagnostiquer une dérive comportementale.

La mémoire **procédurale** (#4) — les règles apprises, les politiques d'outils affinées, les paramètres fine-tunés — attend le stade Production. Le dossier [*memoire-agentique*](../memoire-agentique/) détaille les patterns d'implémentation pour chacun de ces piliers.

#### 2.2.f — Boucle de feedback utilisateur

Le premier feedback utilisateur a été qualitatif et non structuré : *« c'est bien mais… »* Les suivants doivent l'être moins. La boucle de feedback du Pilote introduit deux éléments : un signal binaire (thumbs up/down), et une raison structurée choisie parmi quatre à six catégories courtes — "incomplet", "à côté", "trop long", "trop lent", "génial", "utile mais faux". C'est le champ *raison* qui est précieux, pas la note nue. Un pouce en bas sans raison dit que quelque chose ne va pas. Un pouce en bas avec la raison "à côté" dit que l'agent a compris la langue mais pas l'intention — ce qui oriente directement vers le prompt ou le retrieval, pas vers le modèle.

#### 2.2.g — Premier dashboard + alerting

Le premier dashboard du Pilote couvre les deux niveaux inférieurs de la hiérarchie observabilité L0-L4. Le **niveau L0** — blocage — détecte les problèmes en moins de 100 ms : dépassement de quota de tokens, appel d'outil en échec systématique, boucle TAOR sans `stop_reason`. Le **niveau L1** — runtime guardrails — surveille les comportements à risque en temps réel : injection de prompt détectée, output hors politique, outil appelé avec des paramètres anormaux. Les niveaux supérieurs — L2 (human-in-the-loop), L3 (incident review), L4 (refactor de l'architecture) — restent absents pour l'instant. Ils n'attendent pas une décision : ils attendent un volume d'incidents suffisant pour être nécessaires.

---

### 2.3 — La vallée de la mort

Soixante-dix pour cent des pilotes ne passent jamais en production. Le MIT NANDA[^mit-nanda] documente ce chiffre sur une cohorte de 200 déploiements entreprise suivis entre 2024 et 2026. Ce n'est pas un problème de modèle — au stade Pilote, tous les modèles récents sont suffisamment capables. C'est un problème d'infrastructure organisationnelle : trois manques qui se cumulent.

![SCHÉMA 06 — La vallée de la mort des pilotes|1300](images/06-vallee-de-la-mort.svg)

**Premier manque : le FinOps absent.** Le Pilote a tourné sur les credentials du builder ou sur un crédit d'expérimentation. Personne n'a défini de budget par agent, par flow, par tenant. Personne n'a configuré de routing économique — small model pour les tâches de classification, large model pour les tâches de raisonnement. Quand le PO demande ce que coûte une requête moyenne, personne ne sait répondre. Le passage en production sans réponse à cette question se traduit invariablement par une surprise de facture à la fin du premier mois réel.

**Deuxième manque : l'évaluation discontinue.** ==Le palier N3 jamais atteint, c'est la signature des pilotes qui meurent.== Le playbook Anthropic décrit un pipeline d'évaluation en cinq niveaux de confiance croissante — unit, integration, E2E, adversarial, human review. Au Pilote, les équipes qui s'arrêtent trop tôt lancent les capability evals sporadiquement, sans alerte sur dégradation, sans mécanisme de graduate, sans lien entre les résultats d'éval et les décisions de déploiement. Le pipeline ne progresse jamais au-delà de N2 (tests d'intégration manuels). Résultat : quand le modèle sous-jacent est mis à jour par le fournisseur, la régression passe inaperçue pendant deux semaines.

**Troisième manque : la gouvernance informelle.** Pas de charte risques. Pas de politique explicite sur ce que l'agent peut et ne peut pas faire. Pas de <span class="term" data-term="hitl">HITL</span> — Human-in-the-Loop — structuré : les escalades humaines se font au jugé, par mail, sans piste d'audit. Le premier incident sérieux — une sortie hors politique, une donnée mal traitée, une décision automatisée contestée — est reçu en pleine figure, sans procédure de réponse préparée.

Pour préparer le stade Production, une heuristique s'impose : aucune méthode unique d'évaluation ne suffit. Anthropic documente cette logique sous la forme d'un gruyère suisse à cinq couches — auto evals, monitoring de production, A/B test, revue manuelle, études humaines — chaque couche compensant les angles morts des autres. Le concept de gruyère suisse sera détaillé au stade 3 ; la leçon à retenir ici est en amont : si on n'a pas encore cinq couches, on commence par la première (auto evals) et on la rend fiable avant de construire la deuxième.

> [!decideur] **Pour le décideur** 🧭
>
> Budget d'une vraie pratique d'évaluation continue : **10 à 15 %** du budget agent annuel. Sous ce seuil, vous construisez de l'autonomie sur des signaux non fiables — vous déployez sans savoir si l'agent régresse, et vous le découvrez quand un utilisateur vous l'apprend. C'est le seul investissement non négociable du Pilote. Tout le reste peut attendre — le FinOps peut s'affiner en production, la gouvernance peut démarrer légère — mais les evals ne peuvent pas être rétroactivement reconstruites après un incident. Elles doivent tourner avant que l'incident arrive.

---

### 2.4 — Antipattern signature

> [!antipattern] **« On alerte sur tout, donc plus personne ne lit les alertes »**
>
> Le tableau de bord du Pilote a été construit vite, avec les meilleures intentions. Chaque anomalie détectée a reçu une alerte. Latence p95 > 5 s : alerte. Token usage > 3 000 par requête : alerte. Outil appelé avec un paramètre inhabituel : alerte. Taux d'échec > 2 % : alerte. Résultat : le canal Slack de l'oncall reçoit 200 notifications par jour. L'oncall les acquitte sans les lire. Le vrai incident — un prompt injection qui exfiltre des données de session — passe inaperçu pendant 36 heures, noyé dans le flux.
>
> Le problème n'est pas la sensibilité des détecteurs. C'est l'absence de hiérarchie. Tout signal ne mérite pas une alerte — certains méritent une metric, d'autres un log, d'autres une alerte silencieuse (écrite sans notification). L'échelle L0-L4 est la réponse structurelle : promener chaque signal sur l'échelle avant de décider de son canal de diffusion. Ce qui bloque l'agent ou viole une politique de sécurité en < 100 ms → L0, alerte immédiate avec page. Ce qui dévie du comportement attendu sans bloquer → L1, alerte runtime sans page. Ce qui s'observe sans action requise maintenant → metric, visible sur le dashboard, silencieuse. Ce qui nécessite une revue humaine mais pas urgente → ticket, pas d'alerte.
>
> Le seuillage est un choix éditorial autant qu'un choix technique. Une alerte qui ne déclenche jamais d'action réelle ne devrait pas être une alerte. Elle est un bruit qui anesthésie l'équipe — et qui masque le signal suivant.

---

### 2.5 — Signal de bascule vers Production

Le Pilote se termine quand un SLA est promis à un client ou à un partenaire interne, ou quand un risque réglementaire pointe à l'horizon. Ce n'est pas un choix technique — c'est une pression externe. Le premier audit est demandé. La première question de conformité est posée : *« comment on s'arrête si ça déraille ? »* L'équipe n'a pas la réponse. Mais elle a maintenant quelque chose qu'elle n'avait pas au stade Prototype : des données. Des traces structurées, un golden dataset de 80 cas versionnés, un dashboard avec quinze jours d'historique, une boucle de feedback utilisateur avec 200 annotations.

Ces données ne suffisent pas pour la production. Elles suffisent pour prendre une décision éclairée sur la production — pour savoir ce qui tient, ce qui dérive, ce qui manque. Le Pilote a mesuré. La Production va devoir tenir.

## 3. Stade 3 · Production · « ça tient »

*Section à écrire dans T16.*

## 4. Stade 4 · Mature multi-agents · « ça apprend »

*Section à écrire dans T19.*

## 5. Clôture

*Section à écrire dans T21.*

## Annexe A — Glossaire

*À écrire dans T22.*

## Annexe B — Voir aussi

*À écrire dans T22.*

## Annexe C — Sources

*À écrire dans T22.*

---

*Format co-écrit avec l'aide d'une IA.*
