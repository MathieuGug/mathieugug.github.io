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

*Section à écrire dans T12.*

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
