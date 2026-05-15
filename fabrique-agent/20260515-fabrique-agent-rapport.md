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

*Section à écrire dans T8.*

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
