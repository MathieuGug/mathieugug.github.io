---
chapitre: 9
titre: "Mémoire agentique : 4 piliers, 6 opérations, 5 architectures"
acte: 2
acte_titre: "La boucle"
gabarit: standard
mots: 6900
statut: v1
date_maj: 2026-05-29
---

# Chapitre 9 — Mémoire agentique : quatre piliers, six opérations, cinq architectures

> **Acte II — La boucle · Chapitre standard, ~22 pages**
> _Comment un agent se souvient-il de la conversation d'hier, du projet en cours, du dernier résultat de son sous-agent — et où ça casse en prod ? La **grille canonique de la mémoire agentique** (CoALA, Princeton, TMLR 2024), les cinq architectures de production qui s'en sont déduites en moins de 24 mois, et la frontière régulatoire (MITRE ATLAS AML.T0080, RGPD art. 17, AI Act art. 10/25) que le déployeur 2026 ne peut plus traiter en option._

> [!QUESTION] Question d'ouverture
> Si **95 %** des pilotes GenAI en entreprise n'aboutissent pas (MIT NANDA, juillet 2025[^1]) et que Gartner anticipe **40 %** d'abandons de projets agentiques d'ici fin 2027[^2] — pour la même cause racine, le *learning gap* — pourquoi continue-t-on à empiler du contexte au lieu d'investir dans une mémoire gouvernée ? Et qu'est-ce qu'« oublier » veut dire, opérationnellement, dans un système qui a vectorisé, paraphrasé et indexé l'information sur six mois ?

> [!TLDR] TL;DR décideur
> - ==La mémoire n'est plus une fonctionnalité optionnelle : c'est le mécanisme par lequel un agent passe d'un *outil transactionnel* à un *partenaire persistant*.== Les écarts mesurés sont sans précédent ailleurs dans la pile (79,5 % de précision diagnostique avec mémoire vs ~40 % sans, sur MedAgentSim/MIMIC-IV[^17] ; 90 % de réussite vs 50 % sur des processus structurés avec mémoire de travail structurée[^16]).
> - **Quatre piliers canoniques** (travail, sémantique, épisodique, procédurale) issus de l'architecture CoALA (Sumers et al., TMLR 2024[^6]) × **six opérations** (récupération, consolidation, mise à jour, indexation, compression, oubli). C'est la grammaire commune à tous les frameworks 2026.
> - **Cinq architectures de production** se sont stabilisées en moins de trois ans — MemGPT/Letta (OS-like, paging hiérarchique), Generative Agents (memory stream + reflection), A-MEM (Zettelkasten agentique), Zep/Graphiti (knowledge graph temporel), Mem0 (optimisation production, +26 % LLM-as-Judge sur LOCOMO vs OpenAI[^10]). Aucune dominante — le choix est un arbitrage entre auditabilité, latence et auto-édition.
> - **Le contexte long ne résout pas le problème** : la courbe *reasoning-in-a-haystack* (Shang et al. 2024[^3]) démontre qu'un long contexte *nuit* à la capacité de raisonner et de récupérer simultanément. La mémoire externe structurée n'est pas concurrente du million de tokens — elle en est la **condition**.
> - **Surface d'attaque qualitativement nouvelle** : MITRE ATLAS référence le memory poisoning sous **AML.T0080**. Le pattern *SpAIware* (Rehberger, septembre 2024[^14]) démontre qu'une injection en mémoire persiste à travers les sessions futures jusqu'à nettoyage explicite. C'est un sujet RSSI à part entière, pas une variante de prompt injection classique.
> - **Trois pièges à 100 % traçables** : déployer un agent sans dashboard mémoire (l'utilisateur ne peut ni voir ni oublier), confondre rétention long-contexte et mémoire structurée (le 1 M tokens ne suffit pas), et différer la conformité RGPD/AI Act sur la mémoire opérationnelle au prétexte du *machine unlearning* (l'oubli prouvable n'est différé que sur les poids — pas sur les fichiers, vecteurs et blocs structurés).

---

## 9.1 Le déficit d'apprentissage : pourquoi la mémoire est devenue le goulot

### 9.1.1 L'amnésie comme signature opérationnelle

Le rapport MIT NANDA *State of AI in Business 2025* — fondé sur 52 entretiens d'organisations, 153 réponses de dirigeants et l'analyse de plus de 300 déploiements publics — fait converger un diagnostic[^1] : malgré 30 à 40 milliards de dollars investis en GenAI sur l'année écoulée, **95 % des entreprises ne constatent aucun retour mesurable sur leurs projets**. Le facteur central n'est ni la qualité des modèles, ni le cadre régulatoire — c'est l'**absence d'apprentissage et de mémoire** dans les systèmes déployés. Gartner converge en juin 2025[^2] : *plus de 40 % des projets agentiques seront annulés d'ici fin 2027*, pour cause de coûts incontrôlés, valeur commerciale floue et contrôles de risque inadéquats — autant de symptômes d'un même mal racine.

Cette amnésie a une signature opérationnelle reconnaissable. Un agent qui oublie le contexte oblige l'utilisateur à se répéter, casse le rythme de travail et entame la confiance. Surtout, il ne capitalise pas : chaque interaction redémarre à zéro. Dans le secteur financier, où le livre blanc IMA *Agentic AI* (novembre 2025, contributeurs : Société Générale, Crédit Agricole CIB, Natixis, La Banque Postale, Saint-Gobain) a documenté plusieurs cas critiques[^16], l'image retenue est celle du *jour de la marmotte* : un opérateur KYC chevronné qui doit, chaque matin, redécouvrir les particularités des dossiers de la veille.

![Cadrage stratégique — MIT NANDA, Gartner, et la courbe reasoning-in-haystack|1300](../../memoire-agentique/images/20260430-01-cadrage-strategique.svg)

### 9.1.2 Le contexte long ne résout pas le problème

L'objection commune — *« si la fenêtre est plus grande que la trajectoire, on n'a pas besoin de mémoire externe »* — a longtemps tenu côté commercial. Anthropic, OpenAI, Google ont successivement annoncé 200 k, 1 M, puis 2 M tokens entre 2023 et 2025. Le travail *AI-native Memory* (Shang et al., 2024[^3]) la démonte. La méthode est simple : on insère une information cruciale au milieu d'un texte extrêmement long et distrayant, puis on pose une question qui exige non seulement de **retrouver** cette information, mais de **l'utiliser dans un raisonnement**. Le test du *reasoning-in-a-haystack* donne un verdict sans équivoque : même les modèles les plus sophistiqués voient leur précision chuter à mesure que la longueur croît — pas linéairement, par paliers — démontrant que ==le long contexte nuit à la capacité de raisonner et de récupérer *simultanément*==.

Le pattern Liu et al. (TACL 2024, *Lost in the Middle*), traité en détail en [Ch. 10](ch10-compaction.md) §10.2, l'isole sur une dimension simple : la performance d'un agent question-answering trace une courbe en U selon la position de l'information cible dans la fenêtre. Étendre la fenêtre sans repenser la *gestion* du contenu revient à empiler de la mémoire morte.

L'étude *Agent Hospital* (Li et al., 2024[^17]) et son successeur *MedAgentSim* (Almansoori et al., 2025[^18]) quantifient le coût dans un cadre médical critique. Sur le benchmark MIMIC-IV, des agents dotés de mécanismes de mémoire et d'auto-amélioration atteignent **79,5 % de précision diagnostique**, là où les modèles de base peinent à dépasser 40 %. L'écart n'est pas marginal — il définit la frontière entre un démonstrateur et un système déployable. ==La mémoire n'est pas un confort d'expérience utilisateur ; c'est le mécanisme par lequel un agent devient *intrinsèquement* plus fiable.==

> [!INFO] Voir [Ch. 7 — Reason · Act · Observe](ch07-boucle-agentique.md)
> La couche mémoire (n° 5 dans la grille [Ch. 7](ch07-boucle-agentique.md) §7.2) reste sous-spécifiée tant qu'on n'a pas posé la grille des quatre piliers + six opérations — c'est ce que ce chapitre fait. Le [Ch. 10](ch10-compaction.md) qui suit approfondit un sous-pilier (le scratchpad / mémoire de travail) sous l'angle de la compaction.

---

## 9.2 Quatre piliers : la grille canonique

Le travail fondateur *Cognitive Architectures for Language Agents* (CoALA), publié dans *Transactions on Machine Learning Research* en 2024 par Sumers, Yao, Narasimhan et Griffiths (Princeton[^6]), a fixé le vocabulaire de référence. CoALA décrit un agent linguistique selon trois dimensions : une **organisation modulaire de la mémoire**, un espace d'action structuré pour interagir avec la mémoire interne et l'environnement externe, et un processus de décision généralisé. La mémoire à long terme y est elle-même subdivisée en trois sous-types — épisodique, sémantique, procédurale — par analogie avec les architectures cognitives classiques (ACT-R, Soar). Augmentée de la mémoire de travail, la grille à quatre piliers s'est imposée comme la grammaire commune des systèmes agentiques 2026.

![Taxonomie des quatre piliers de la mémoire agentique|1300](../../memoire-agentique/images/20260430-02-taxonomie-piliers.svg)

### 9.2.1 Mémoire de travail — le scratchpad de l'instant présent

Le *bloc-notes* à très court terme qui maintient l'état d'avancement d'une tâche en cours. Implémentation typique : injection directe dans le prompt sous forme de *scratchpad* (Yao et al. ReAct, Anthropic *thinking* blocks, OpenAI scratchpad implicite). Sur des processus structurés, son architecture détermine la fiabilité — les contributeurs IMA documentent que les agents avec mémoire de travail **non structurée** échouent dans la moitié des cas (50 %), contre **90 %** de réussite pour ceux opérant avec un protocole structuré sur les mêmes tâches[^16]. C'est ce pilier qui sature en premier sur les trajectoires longues, et c'est lui que le [Ch. 10](ch10-compaction.md) approfondit sous l'angle de la compaction.

### 9.2.2 Mémoire sémantique — l'encyclopédie

Règles métier, procédures de conformité, jargon, listes, faits stables. Permanente et stable, elle est typiquement implémentée via **RAG sur des bases de connaissances d'entreprise** (vector store + retrieval, parfois augmenté d'un knowledge graph). C'est le pilier le mieux outillé, parce qu'il est aussi le plus ancien dans l'écosystème (le RAG est antérieur aux agents). Mais ==il faut résister à la tentation d'y voir *la* mémoire — c'est *un* des quatre piliers, pas la cible unique==.

### 9.2.3 Mémoire épisodique — le journal de bord

Collection des expériences vécues : chaque cas traité, chaque erreur corrigée est stockée comme un épisode horodaté. C'est la matière première du *few-shot learning* contextualisé : face à une situation nouvelle, l'agent y cherche des cas similaires. Les Generative Agents de Stanford (§9.4.2) l'implémentent comme un *memory stream* — un journal exhaustif des expériences en langage naturel, interrogeable par similarité, récence et importance.

### 9.2.4 Mémoire procédurale — le répertoire des savoir-faire

Pas des faits bruts, mais des **séquences d'actions et stratégies**. C'est ce qui permet à un agent de savoir *comment traiter* une alerte de fraude, et pas seulement de savoir *ce qu'elle est*. L'approche *Agent Workflow Memory* (Wang et al., 2024[^19]) montre qu'un agent peut induire automatiquement de nouvelles procédures en observant des exemples, transformant une série d'actions passées en compétence réutilisable. ==C'est le pilier le moins outillé en 2026 — et celui qui porte la promesse d'auto-amélioration à 12-18 mois.==

> [!NOTE] La grille n'est pas un découpage physique
> Les quatre piliers ne correspondent pas nécessairement à quatre bases de données distinctes. La mémoire de travail vit dans la fenêtre de contexte ; la sémantique dans un vector store ; l'épisodique dans un journal cumulé ; la procédurale dans des fichiers Markdown (Anthropic CLAUDE.md) ou un store de workflows induits. ==Ce qui compte, c'est qu'au design, on sache laquelle des quatre on cible.== Mélanger les piliers dans la même base produit une mémoire qui ne sait ni se rappeler ni oublier.

---

## 9.3 Six opérations du cycle de vie

Disposer d'une grille à quatre piliers ne suffit pas — encore faut-il décider, à chaque étape, **ce qu'on écrit, ce qu'on lit, ce qu'on mute, ce qu'on jette**. La synthèse récente *Rethinking Memory in AI* de Du, Huang, Zheng et al. (arXiv 2505.00675, 2025[^4]) en formalise six, qui correspondent étroitement à celles décrites par les contributeurs IMA[^16].

![Cycle de vie en six opérations — récupération, consolidation, mise à jour, indexation, compression, oubli|1300](../../memoire-agentique/images/20260430-03-cycle-de-vie.svg)

### 9.3.1 Récupération (retrieval)

Au cœur du paradigme RAG, l'agent interroge ses mémoires pour trouver les informations pertinentes. Techniquement : embeddings vectoriels et recherche par similarité, désormais standard. La sophistication 2025-2026 vient de trois mouvements : *hybrid retrieval* (dense + sparse + BM25), *re-ranking* via un modèle cross-encoder, et *query rewriting* (le LLM réécrit sa propre requête avant de chercher). Sur des cas régulés, ajouter un filtre déterministe pré-retrieval (ACL, scope tenant, date de validité) est devenu non négociable.

### 9.3.2 Consolidation

Le processus essentiel par lequel une information volatile devient pérenne. Une expérience (mémoire épisodique), après analyse, est transformée en compétence (mémoire procédurale). ==C'est le moteur de l'apprentissage.== Les Generative Agents de Stanford l'implémentent via leur mécanisme de *réflexion*, qui synthétise les souvenirs en inférences de plus haut niveau dès qu'un seuil d'importance accumulée est franchi[^11]. *Reflexion* (Shinn et al., NeurIPS 2023[^23]) a généralisé en utilisant la réflexion comme signal de renforcement verbal pour l'apprentissage par essai-erreur.

### 9.3.3 Mise à jour (updating)

L'acte de modifier une information existante pour éviter d'appliquer une norme obsolète. Critique pour la gouvernance : un agent KYC qui applique une règle d'avant la mise à jour du *règlement européen sur les transferts intra-groupe* expose la banque à un risque de conformité. Zep/Graphiti (§9.4.4) en a fait un parti pris architectural — chaque arête de son graphe porte un intervalle de validité (`t_valid`, `t_invalid`) qui sépare *quand un événement a eu lieu* de *quand il a été ingéré*.

### 9.3.4 Indexation

L'organisation intelligente de la mémoire (typiquement via une base vectorielle) pour une récupération efficace fondée sur le sens, non les mots-clés. La sophistication 2026 — au-delà de l'embedding générique — passe par des **embeddings spécialisés par domaine** (juridique, médical, financier), des **schémas hiérarchiques** (résumé → chunks → spans), et des **tags de provenance** propagés depuis l'ingestion (cf. §9.7 sur l'attaque de surface).

### 9.3.5 Compression

Le résumé d'information pour optimiser le stockage et l'usage du contexte. *MemoryBank* (Zhong et al., AAAI 2024[^20]) crée des résumés quotidiens de haut niveau ; *TiM* extrait les relations clés. Le sujet est si dense qu'il fait l'objet du **chapitre suivant** dans son intégralité — la compaction comme première politique d'oubli active.

> [!INFO] Voir [Ch. 10 — Compaction et oubli stratégique](ch10-compaction.md)
> [Ch. 10](ch10-compaction.md) approfondit la compression sous l'angle de la **mémoire de travail / scratchpad**, avec ses cinq familles (summarization LLM, eviction attention-based, hiérarchique paging, retrieval-augmentée, compactors appris) et le triangle non-dégénéré **fidélité × coût × oubliabilité**. La compression long-terme (résumés quotidiens MemoryBank, decay temporel Mem0) reste traitée ici.

### 9.3.6 Oubli (forgetting)

La capacité de supprimer des informations de manière ciblée, pour des raisons techniques (saturation), légales (RGPD art. 17), ou de pertinence (information périmée). *MemoryBank* incorpore explicitement un **modèle de courbe d'oubli d'Ebbinghaus**, qui imite la dégradation de la mémoire humaine[^20]. Mem0 décroît la pertinence d'une mémoire par fonction temporelle. Letta expose un `forget()` programmable. ==L'oubli n'est pas l'absence de mémoire — c'est une opération de première classe.==

> [!IMPORTANT] Triage cognitif (IMA)
> Les contributeurs IMA proposent une lecture opérationnelle utile[^16] : face à une requête, l'agent applique successivement *(1) Garde-fou* (Terra Incognita — escalade si rien de pertinent), *(2) Reconnaissance immédiate* (zero-shot via mémoire sémantique/procédurale), *(3) Inspiration par l'exemple* (few-shot via mémoire épisodique), et *(4) Application d'une leçon apprise* (auto-réflexion sur l'échec). Cette discipline de triage transforme une mémoire brute en *intelligence appliquée*.

---

## 9.4 Cinq architectures de référence

Cinq familles d'architectures se sont stabilisées en moins de trois ans. Elles répondent à la même question — comment doter un LLM d'une mémoire à long terme cohérente — mais avec des paris d'ingénierie différents.

![Matrice comparative des frameworks de production — MemGPT/Letta, Generative Agents, A-MEM, Zep/Graphiti, Mem0|1300](../../memoire-agentique/images/20260430-04-frameworks-matrice.svg)

### 9.4.1 MemGPT / Letta — la mémoire comme système d'exploitation

Publié en octobre 2023 par Packer, Wooders, Lin et Patil (UC Berkeley Sky Computing Lab[^7]), MemGPT propose une analogie radicale : ==un LLM est un processeur, son contexte est sa RAM, la mémoire externe est son disque.== Le système gère explicitement une hiérarchie à deux niveaux — *main context* (tokens visibles par le LLM) et *external context* (stockage persistant) — et utilise les *function calls* pour permettre au modèle de déplacer activement l'information entre les deux, comme un OS qui gère son *paging*. Le composant *recall memory* indexe l'historique conversationnel, l'*archival memory* sert de stockage long-terme étendu. Le projet est devenu **Letta** en septembre 2024[^21] et a popularisé le concept de *memory blocks* : sections structurées du contexte (par exemple les blocs `human` et `persona`) que l'agent lit et réécrit lui-même via des outils dédiés[^22].

**Force unique** : l'opération mémoire est explicite et auditable — chaque paging produit un log. **Limite principale** : demande au modèle d'apprendre à gérer sa mémoire, ce qui consomme des tokens (les appels de paging eux-mêmes) ; sur des modèles plus faibles qu'Opus 4.x ou GPT-5.x, la qualité de la décision de paging est médiocre.

### 9.4.2 Generative Agents — le memory stream et la réflexion

L'article *Generative Agents : Interactive Simulacra of Human Behavior* (Park et al., Stanford × Google, UIST 2023[^11]) a démontré qu'on peut animer 25 agents dans un sandbox *à la Sims* en leur donnant trois mécanismes : un **memory stream** (journal exhaustif des expériences en langage naturel), un module de **reflection** (synthèse récursive en inférences de plus haut niveau lorsqu'un seuil d'importance est franchi), et un planificateur. Le retrieval combine trois critères pondérés : ==pertinence sémantique, récence (décroissance exponentielle), et importance (notée par le LLM lui-même de 1 à 10)==. Ce trio *recency / relevance / importance* est devenu un standard de fait pour les agents conversationnels long-vivants. *Reflexion* (Shinn et al., 2023[^23]) a généralisé le mécanisme de réflexion en l'utilisant comme signal de renforcement verbal pour l'apprentissage par essai-erreur.

### 9.4.3 A-MEM — la mémoire agentique inspirée du Zettelkasten

Présenté à NeurIPS 2025 par Xu, Liang, Mei et al.[^8], A-MEM s'inspire de la méthode *Zettelkasten* du sociologue Niklas Luhmann — un système de notes atomiques liées dynamiquement. Pour chaque nouveau souvenir, A-MEM construit une note structurée (description contextuelle, mots-clés, tags), analyse le dépôt historique pour identifier des connexions sémantiques, établit des liens, et — point clé — **fait évoluer les notes existantes** : intégrer un nouvel élément peut déclencher une mise à jour des descriptions et attributs des mémoires antérieures. Le réseau se raffine en continu. Empiriquement, A-MEM surpasse les baselines SOTA sur six modèles fondations.

**Force unique** : émergence de structure thématique sans schéma préalable. **Limite principale** : la qualité de la liaison entre notes dépend du LLM qui lie, ce qui réintroduit une variance à chaque écriture.

### 9.4.4 Zep / Graphiti — le knowledge graph temporel

Publié en janvier 2025 par Rasmussen, Paliychuk, Beauvais, Ryan et Chalef (arXiv 2501.13956[^9]), Zep dépasse l'approche purement vectorielle. Son cœur, **Graphiti** (open-source, ~20 000 étoiles GitHub[^24]), est un moteur de graphe de connaissances *temporellement conscient* : chaque arête possède des intervalles de validité (`t_valid`, `t_invalid`), un modèle bi-temporel qui sépare *quand un événement a eu lieu* de *quand il a été ingéré*. Lorsqu'une nouvelle information contredit une information existante, Zep **n'écrase pas — il invalide**, préservant l'histoire. Sur le benchmark Deep Memory Retrieval (DMR), Zep atteint **94,8 %** contre 93,4 % pour MemGPT[^9].

**Force unique** : requêtes temporelles natives (« que savait l'agent de X au jour J ? »), qu'un vector store classique ne supporte pas. **Limite principale** : l'ingestion graphe est plus coûteuse qu'un upsert vectoriel ; à fort volume, le coût d'écriture devient le facteur limitant.

### 9.4.5 Mem0 — l'optimisation production

Le paper Mem0 *Building Production-Ready AI Agents with Scalable Long-Term Memory* (Chhikara, Aryan et al., ECAI 2025, arXiv 2504.19413[^10]) documente le compromis production : **précision élevée sous contrainte de tokens et de latence**. Mem0 affiche +26 % d'amélioration LLM-as-a-Judge sur LOCOMO par rapport à OpenAI[^25], 93,4 sur LongMemEval (+26 points), et 91,6 sur LOCOMO. ==La latence médiane reste sous la seconde==, là où l'approche *full-context* atteint 9,87 s en médiane et 17,12 s au p95 — catégoriquement inutilisable en production temps réel. La version *graph memory* ajoute environ 2 % de gain marginal au prix d'une complexité d'infra notable.

**Force unique** : le compromis SLA. **Limite principale** : peu d'auditabilité fine — la pipeline de distillation interne (qui décide ce qui est mémorisé) n'est pas trivialement instrumentable.

> [!ATTENTION] Aucune dominante en 2026
> Au-delà de ces cinq, le panorama s'est densifié : **LangMem** (LangChain), **MIRIX** (multi-utilisateur), **MemMachine** (0,917 sur LOCOMO en mars 2026 avec gpt-4.1-mini[^26]), **Memory-R1** (Yan et al., 2025 — opérations CRUD apprises par renforcement). La leçon transversale : ==il n'y a pas une seule mémoire, mais une bibliothèque de patterns== dont le choix dépend de la criticité, du volume conversationnel et de la dépendance temporelle des cas d'usage.

| Architecture | Pari structurel | Profil de force | Profil de limite |
| --- | --- | --- | --- |
| **MemGPT / Letta** | OS-like, paging hiérarchique explicite | Auditabilité par log | Coût en tokens des appels de paging |
| **Generative Agents** | Memory stream + reflection | Triade *recency × relevance × importance* élégante | Pas pensé pour la prod régulée |
| **A-MEM** | Zettelkasten — notes atomiques liées dynamiquement | Émergence sans schéma préalable | Variance d'écriture |
| **Zep / Graphiti** | Knowledge graph bi-temporel | Requêtes temporelles natives, audit RGPD facile | Coût d'écriture graphe |
| **Mem0** | Pipeline distillation production | Latence sub-seconde, compromis SLA tenable | Auditabilité fine limitée |

---

## 9.5 Le context engineering : la discipline d'orchestration

Disposer d'une architecture de mémoire ne suffit pas — encore faut-il décider, à chaque étape, *ce que l'on présente exactement au LLM*. C'est la discipline du **context engineering**, qu'Andrej Karpathy a définie en juin 2025 comme *« l'art et la science délicats de remplir la fenêtre de contexte avec juste la bonne information à chaque étape »*[^12]. La métaphore qu'il déploie est éclairante : le LLM est un nouveau type de système d'exploitation, son contexte est la RAM, et le context engineering joue le rôle du **gestionnaire de mémoire de l'OS**.

![Quatre stratégies du context engineering — Write, Select, Compress, Isolate|1300](../../memoire-agentique/images/20260430-05-context-engineering.svg)

Lance Martin (LangChain) a structuré le champ en quatre stratégies génériques[^13] :

### 9.5.1 Write — sortir l'information du contexte

Sauvegarder dans un scratchpad (TODO file, mémoire structurée), externaliser des résultats d'outils dans un système de fichiers. ==L'équipe Manus atteint des ratios de compression 100:1== en gardant la réversibilité (URL pour récupérer le contenu complet si nécessaire). Le pattern est commun à Claude Code (filesystem-backed scratchpads), Cursor (workspace state) et aux harnesses orientés *bash is all you need* (cf. [Ch. 7](ch07-boucle-agentique.md) §7.5.2).

### 9.5.2 Select — choisir ce qui rentre

Retrieval ciblé (RAG), sélection de quelques exemples few-shot par similarité, inclusion de règles métier précises. ==C'est ici que la mémoire long-terme joue son rôle pivot==. La sophistication 2026 — hybrid retrieval + re-ranking + query rewriting — relève entièrement de ce levier.

### 9.5.3 Compress — réduire ce qui rentre

Résumés successifs, synthèses hiérarchiques, *condensation* de l'historique conversationnel. *MemoryBank* implémente la compression quotidienne ; *Reflexion* compresse les échecs en leçons ; la commande `/compact` de Claude Code est l'archétype côté harness. Le sujet est traité en détail au [Ch. 10](ch10-compaction.md).

### 9.5.4 Isolate — cloisonner

Sandboxer un sous-agent dans un contexte restreint pour éviter la pollution d'attention, déléguer une sous-tâche à un agent spécialisé qui aura son propre contexte. Le pattern *planner / executor / critic* en est l'incarnation classique[^6]. C'est aussi ce que le pattern à trois agents (GAN-inspiré, [Ch. 7](ch07-boucle-agentique.md) §7.4) opère structurellement.

> [!QUOTE] Karpathy — la bascule modèle ↔ contexte
> *« Dans la plupart des cas où les agents échouent, ce n'est pas le modèle qui échoue, c'est le contexte. »* (Karpathy, juin 2025, repris par Tobias Lütke et Greg Brockman[^27].) Pour un agent engineer 2026, le déplacement est concret : ne pas s'enfermer dans la course aux modèles, investir dans la **couche d'orchestration mémoire / contexte** qui se place au-dessus.

L'observation pratique des contributeurs IMA est cohérente avec ce cadre : ==le context engineering est *la tâche principale des développeurs d'agents*==[^16]. Il sélectionne stratégiquement quelles opérations de mémoire utiliser — Récupération et Compression notamment — pour décider quels faits (sémantique), quelles expériences (épisodique) et quelles procédures incluront le contexte limité.

---

## 9.6 Paysage fournisseurs : trois philosophies

Les trois grands fournisseurs grand public ont déployé des architectures de mémoire structurellement différentes. Comprendre ces différences est crucial pour choisir un fournisseur, mais aussi pour anticiper les patterns que les utilisateurs d'entreprise ramènent depuis leur usage personnel — le *Shadow AI* signalé par MIT NANDA (90 % des employés selon le rapport[^1]) crée une attente qui s'aligne désormais sur les produits grand public.

![Trois fournisseurs, trois philosophies — OpenAI ChatGPT, Anthropic Claude, Google Gemini|1300](../../memoire-agentique/images/20260430-06-vendors-comparison.svg)

### 9.6.1 OpenAI ChatGPT — le couple `bio` + Chat History Reference

OpenAI a introduit la mémoire dans ChatGPT en deux phases : d'abord *Saved Memories* (avril 2024, gérée explicitement via l'outil `bio` que le modèle invoque pour persister une information), puis *Chat History Reference* (en 2024-2025, profil implicite construit en arrière-plan). Le contenu est rendu visible au modèle dans une section *Model Set Context* en début de conversation. Le système est puissant, mais ==opaque côté utilisateur== : l'inférence implicite à partir de l'historique fonctionne, mais la traçabilité de chaque mémoire est limitée. L'opération `bio` peut être déclenchée par le modèle de sa propre initiative — surface d'attaque centrale documentée en §9.7.

### 9.6.2 Anthropic Claude — l'architecture *file-based* hiérarchique

Anthropic a adopté un parti pris structurellement différent : la mémoire est stockée dans des **fichiers Markdown** (`CLAUDE.md`) organisés hiérarchiquement (Enterprise → Project → User), chargés en cascade dans le contexte. La mémoire conversationnelle automatique a été ouverte aux plans Pro et Max en octobre 2025[^28]. Le **Memory Tool** (API, Claude 4.7) expose une interface client-side : Claude appelle des opérations CRUD sur un répertoire `/memories`, l'application les exécute localement[^29]. Ce design — ==fichiers texte versionnables, opérations explicites, contrôle utilisateur granulaire== — privilégie la transparence et l'auditabilité au prix d'une scalabilité moindre que les approches vectorielles. La feature *Auto Dream* (Claude Code) implémente un cycle de consolidation périodique inspiré du sommeil REM, qui revoit les notes accumulées, élague le périmé et réorganise[^30]. Anthropic a également introduit en avril 2026 la mémoire pour les *Managed Agents* du Claude Platform : stockage par fichiers exportables, journalisation de chaque écriture, permissions différenciées (read-only org, read-write user)[^31].

### 9.6.3 Google Gemini — Personal Context et 2 M tokens

L'approche Google combine un contexte natif extrêmement long (jusqu'à 2 M tokens) avec une **intégration profonde dans Workspace** (Gmail, Drive, Calendar, Docs). Le *Personal Context* fait évoluer un profil utilisateur que Gemini consulte par défaut. La force de l'approche tient à l'intégration cross-app — Gemini *voit* le calendrier, les emails et les documents, et peut s'y référer sans configuration. ==La faiblesse, que §9.7 documente, est qu'elle élargit considérablement la surface d'injection indirecte.==

| Dimension | OpenAI ChatGPT | Anthropic Claude | Google Gemini |
|---|---|---|---|
| **Architecture mémoire** | `bio` + Chat History Reference | `CLAUDE.md` hiérarchique + Memory Tool | Personal Context + intégration Workspace |
| **Contexte natif** | 128 K — 200 K tokens | 200 K — 1 M tokens (Sonnet 4.6) | 1 M — 2 M tokens |
| **Transparence côté utilisateur** | Faible (implicite) | Élevée (fichiers visibles, éditables) | Modérée (visualisable, éditable) |
| **Contrôle granulaire** | Visualisation, suppression | Édition fichier par fichier, hiérarchie | Visualisation, suppression |
| **Mode Incognito** | Oui (Temporary Chat) | Oui | Limité |

Lecture stratégique : pour des cas d'usage régulés où l'**auditabilité prime** (banque, santé, public), l'approche file-based d'Anthropic est plus défendable. Pour des cas d'**intégration profonde** (productivité bureautique), Gemini a un avantage natif. Pour des cas de **personnalisation grand public à grande échelle**, ChatGPT bénéficie de sa base installée et de la richesse de son profilage implicite.

---

## 9.7 Surface d'attaque : memory poisoning et MITRE ATLAS AML.T0080

Doter une IA d'une mémoire persistante crée une surface d'attaque **qualitativement nouvelle**. Une vulnérabilité d'injection dans une session classique disparaît à la fin de l'échange ; ==une vulnérabilité dans la mémoire persiste, par construction, à travers les sessions futures==.

![Surface d'attaque de la mémoire persistante — cycle en cinq étapes, cas documentés, quatre couches de mitigation|1300](../../memoire-agentique/images/20260430-07-surface-attaque.svg)

### 9.7.1 La famille des attaques : SpAIware, Delayed Tool, ShadowLeak

Le travail séminal de **Johann Rehberger** (Red Team Director, Electronic Arts) a documenté la chaîne d'attaque dès 2024[^14]. Son *SpAIware* (septembre 2024) a démontré qu'une instruction malveillante embarquée dans un site web ou un document — récupéré via la fonctionnalité de navigation de ChatGPT — peut déclencher l'outil `bio` et **persister une instruction d'exfiltration dans la mémoire long-terme**. Toute conversation future transmet alors, à l'insu de l'utilisateur, les inputs vers un serveur contrôlé par l'attaquant[^32]. L'attaque fonctionne sans interaction supplémentaire de la victime : un seul document piégé suffit.

En février 2025, Rehberger a publié une variante ciblant Gemini Advanced[^33] via la technique *delayed tool invocation* : l'instruction injectée n'est pas exécutée immédiatement, mais armée pour se déclencher sur des mots-clés futurs (*yes, no, sure*). Démonstration visuelle marquante : Gemini *se souvient* après ingestion d'un document piégé que l'utilisateur a 102 ans, croit que la Terre est plate et vit dans la Matrice. Au-delà du clin d'œil, la persistance est démontrée.

L'écosystème a formalisé la classe d'attaques. Microsoft Research la définit explicitement : *« AI Memory Poisoning occurs when an external actor injects unauthorized instructions or facts into an AI assistant's memory »*[^34]. Le cadre **MITRE ATLAS** la référence sous le code **AML.T0080 — *AI Agent Context Poisoning : Memory***[^15]. *ShadowLeak* (septembre 2025) a démontré une variante exploitant Deep Research d'OpenAI ; en octobre-février 2025, une chaîne plus subtile (SSRF + injection + mémoire persistante) a permis une compromission via un simple lien hypertexte, OpenAI mettant plusieurs mois à publier le correctif complet[^35].

> [!WARNING] Le cycle d'attaque en cinq étapes
> **(1) Recon** — repérage des points d'ingestion (web, documents, emails, calendrier) ; **(2) Inject** — placement de l'instruction malveillante dans un contenu apparemment légitime ; **(3) Persist** — déclenchement de l'écriture en mémoire (souvent via un outil `bio` ou équivalent) ; **(4) Activate** — déclenchement par mot-clé ou condition différée ; **(5) Exfiltrate** — transmission silencieuse des données utilisateur. ==Une chaîne reproductible, à coût quasi nul, à portée multi-mois.==

### 9.7.2 Mitigations à quatre niveaux

Les défenses connues couvrent plusieurs niveaux, et aucune n'est suffisante seule.

- **Infrastructure** : sandboxing des outils de mémoire, validation explicite avant écriture, journalisation auditable de chaque opération CRUD (Anthropic l'implémente nativement pour les Managed Agents[^31]).
- **Modèle** : *LLM-scorer* qui évalue la qualité de chaque mémoire candidate avant intégration, comme proposé dans *Memory Sharing for Large Language Model based Agents* (Gao & Zhang, 2024[^36]).
- **Utilisateur** : *tableau de bord mémoire* permettant de visualiser, corriger et oublier sélectivement — recommandé par les contributeurs IMA[^16] et désormais standard chez Anthropic et OpenAI ; mode Incognito pour les conversations sensibles.
- **Organisation** : audit régulier, purge périodique, sources de confiance documentées.

> [!INFO] Voir [Ch. 21 — Garde-fous et sécurité globale](ch21-gardefous-securite-globale.md)
> Le vecteur memory poisoning est l'une des six branches du **schéma essentiel transverse E4** (modèle / prompt / mémoire / outil / protocole / surface) qui agrège, en [Ch. 21](ch21-gardefous-securite-globale.md), l'ensemble des surfaces d'attaque 2026. La verticale mémoire est traitée ici ; le [Ch. 16](ch16-mcp-securite.md) traite la verticale outil/protocole (MCP) ; le [Ch. 21](ch21-gardefous-securite-globale.md) fournit la matrice transverse pour le RSSI.

### 9.7.3 RGPD, AI Act et le défi du *machine unlearning*

Sur le plan réglementaire, la mémoire persistante percute frontalement le **RGPD article 17** (*droit à l'effacement*). L'EU AI Act (entré en vigueur en 2024, déploiement progressif jusqu'en 2027) ne mentionne pas explicitement le droit à l'oubli, mais ses articles 2(7) et le considérant 69 imposent que les systèmes IA respectent le RGPD à travers tout leur cycle de vie, en particulier pour les usages classés *high-risk*[^37]. Le défi technique tient à ce qu'on appelle le **machine unlearning** : on peut effacer un fichier, mais on ne peut pas, à coût raisonnable, *désentraîner* un modèle dont les poids ont absorbé une donnée pendant l'entraînement initial.

Les contributeurs IMA distinguent à juste titre deux régimes[^16] :

- ==**Mémoire opérationnelle / explicite**== (fichiers, vecteurs, blocs structurés) — l'effacement est techniquement faisable, doit être documenté avec des délais de propagation et une preuve d'exécution. **C'est la part qui ne souffre aucun délai en 2026.**
- **Mémoire implicite / paramétrique** (poids du modèle entraînés sur des données passées) — l'effacement ciblé reste une technologie émergente. La transparence sur cette limite est indispensable à la confiance.

> [!IMPORTANT] La gouvernance tactique en trois actions
> (1) **Consentement explicite et durée de rétention bornée** (par exemple 6 mois renouvelables), (2) **gestion documentée de l'effacement** sur le périmètre opérationnel, (3) **reconnaissance explicite des limites** sur le périmètre paramétrique. ==Cette honnêteté technique est un déterminant de confiance, pas un aveu de faiblesse.==

> [!INFO] Voir [Ch. 25 — Gouvernance, machine unlearning et AI Act](ch25-gouvernance-ai-act.md)
> [Ch. 25](ch25-gouvernance-ai-act.md) traite la grille réglementaire dans son ensemble (calendrier 2026-2027, sous-puits *machine unlearning*, rôle DPO/RSSI/Sponsor). Le détail mémoire persistante est instancié ici.

---

## 9.8 Feuille de route 6/12/18 mois

La transformation d'un agent amnésique en partenaire persistant est moins un *big bang* qu'une **discipline progressive**. À partir des sept piliers proposés par les contributeurs IMA[^16] et des retours empiriques des frameworks de production (Mem0, Zep, Letta), trois horizons se distinguent. Les trois pistes — **architecture**, **gouvernance**, **adoption** — doivent avancer en parallèle, synchronisées sur les mêmes jalons.

![Feuille de route 18 mois sur trois pistes — architecture, gouvernance, adoption|1300](../../memoire-agentique/images/20260430-08-roadmap.svg)

### 9.8.1 Horizon 0–6 mois : auditer, prototyper, gouverner

- **Auditer l'amnésie actuelle** : identifier les trois processus où vos agents existants forcent les utilisateurs à se répéter, et sonder l'usage *Shadow AI* (90 % des employés selon MIT NANDA[^1]) pour comprendre où la valeur est déjà perçue. Ce sont les cibles prioritaires.
- **Définir une charte de gouvernance** : politique de rétention, mécanismes d'effacement, transparence sur les limites du machine unlearning.
- **Prototyper un *tableau de bord mémoire*** sur un périmètre restreint : visualiser, corriger, oublier. Tester avec des utilisateurs pilotes.
- **Choisir une architecture de référence** parmi les cinq : Letta pour les déploiements OS-like avec auto-édition ; Mem0 pour le compromis production ; Zep si la dimension temporelle prime ; *file-based* (Anthropic Memory Tool) si l'auditabilité prime.

### 9.8.2 Horizon 6–12 mois : industrialiser, mesurer

- **Migrer un cas d'usage critique** vers une architecture mémoire complète (4 piliers, 6 opérations). KYC, onboarding client, planification multi-fuseaux et support technique long terme sont les meilleurs candidats[^16].
- **Mettre en place les indicateurs de performance** : taux de pertinence de la mémoire, taux de résolution sans escalade, délai de mise à jour des connaissances, *Quotient Contextuel* (proportion de suggestions non sollicitées acceptées par l'utilisateur).
- **Évaluer rigoureusement** sur LongMemEval, LOCOMO ou un benchmark interne dérivé. ==La mesure quantifiée est la condition de la défense budgétaire.==
- **Industrialiser le LLM-scorer** : un agent dédié qui valide les nouvelles mémoires avant intégration, contre la dérive[^36].

### 9.8.3 Horizon 12–18 mois : autonomiser, partenariser

- **Activer l'auto-amélioration** : la boucle *self-reflection* + *case-based reasoning* est documentée comme atteignant +15 % de résolution autonome par trimestre dans les déploiements optimisés[^16][^18].
- **Déployer en multi-agents** : partage de mémoire gouverné, *Memory Pool* avec scoring de qualité.
- **Mémoire procédurale induite** : *Agent Workflow Memory* permet à l'agent d'extraire automatiquement de nouveaux workflows à partir des trajectoires passées[^19], réduisant la maintenance manuelle des prompts complexes.

> [!INFO] Voir [Ch. 20 — Observabilité agentique et cognitive audit trail](ch20-observabilite-cognitive-audit-trail.md)
> La mesure des indicateurs ci-dessus repose sur la **télémétrie OpenTelemetry GenAI semconv** traitée en [Ch. 20](ch20-observabilite-cognitive-audit-trail.md) (six piliers télémétrie + cognitive audit trail). Les attributs `gen_ai.memory.*` (en cours de spécification par le WG fin 2026, en miroir des `gen_ai.compaction.*` du [Ch. 10](ch10-compaction.md)) sont l'infrastructure de mesure obligatoire pour qui veut défendre son ROI mémoire face à un DPO ou à un auditeur AI Act.

---

## Récap chapitre — La grille des quatre piliers

![Taxonomie des quatre piliers — récap chapitre|1300](../../memoire-agentique/images/20260430-02-taxonomie-piliers.svg)

==**À retenir** : quatre piliers (travail, sémantique, épisodique, procédurale), six opérations (récupération, consolidation, mise à jour, indexation, compression, oubli), cinq architectures de production (Letta, Generative Agents, A-MEM, Zep, Mem0).== Une architecture mémoire d'entreprise se conçoit en croisant ces trois axes — pas en achetant un framework et en espérant que la grille viendra avec.

Le [Ch. 10](ch10-compaction.md) approfondit immédiatement le pilier *travail* sous l'angle de la **compaction** (cinq familles, triangle non-dégénéré fidélité × coût × oubliabilité). Le [Ch. 21](ch21-gardefous-securite-globale.md) agrège la verticale mémoire dans le **threat model unifié 2026** (schéma E4). Le [Ch. 25](ch25-gouvernance-ai-act.md) prend le sujet par le bout réglementaire (RGPD art. 17, AI Act art. 10/25, machine unlearning). Les trois lectures sont complémentaires — pas redondantes.

---

> [!WARNING] Trois pièges classiques (les trois sont 100 % traçables)
> **(1) Déployer un agent persistant sans dashboard mémoire** — l'utilisateur ne peut ni voir, ni corriger, ni oublier ce qui le concerne. Coût : confiance perdue à la première hallucination répétée + risque RGPD direct. **(2) Confondre rétention long-contexte et mémoire structurée** — le 1 M tokens de Sonnet 4.6 ne remplace pas une grille à 4 piliers ; le *reasoning-in-a-haystack* (Shang et al.[^3]) le démontre par expérience. **(3) Différer la conformité RGPD/AI Act sur la mémoire opérationnelle au prétexte du machine unlearning** — ==l'oubli prouvable n'est différé que sur les poids du modèle ; sur les fichiers, vecteurs et blocs structurés, l'effacement ciblé est techniquement disponible aujourd'hui==. Le diffuser comme un seul problème n'est pas une posture de prudence — c'est une faute opérationnelle qu'un DPO saura nommer.

---

## Sources

[^1]: Challapally, A., Pease, C., Raskar, R., & Chari, P. (2025). *The GenAI Divide : State of AI in Business 2025*, MIT Project NANDA, juillet 2025. <https://nanda.media.mit.edu/>

[^2]: Gartner, Inc. (2025). *Gartner Predicts Over 40 % of Agentic AI Projects Will Be Canceled by End of 2027*, communiqué de presse, 25 juin 2025. <https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027>

[^3]: Shang, J., Zheng, Z., Wei, J., et al. (2024). *AI-native Memory : A Pathway from LLM Towards AGI*. arXiv:2406.18312. <https://arxiv.org/abs/2406.18312>

[^4]: Du, Y., Huang, W., Zheng, D., et al. (2025). *Rethinking Memory in AI : Taxonomy, Operations, Topics, and Future Directions*. arXiv:2505.00675. <https://arxiv.org/abs/2505.00675>

[^6]: Sumers, T. R., Yao, S., Narasimhan, K., & Griffiths, T. L. (2024). *Cognitive Architectures for Language Agents (CoALA)*. Transactions on Machine Learning Research. arXiv:2309.02427. <https://arxiv.org/abs/2309.02427>

[^7]: Packer, C., Wooders, S., Lin, K., Fang, V., Patil, S. G., Sheth, I., & Gonzalez, J. E. (2023). *MemGPT : Towards LLMs as Operating Systems*. arXiv:2310.08560, UC Berkeley Sky Computing Lab. <https://arxiv.org/abs/2310.08560>

[^8]: Xu, W., Liang, Z., Mei, K., Gao, H., Tan, J., & Zhang, Y. (2025). *A-MEM : Agentic Memory for LLM Agents*. NeurIPS 2025, arXiv:2502.12110. <https://arxiv.org/abs/2502.12110>

[^9]: Rasmussen, P., Paliychuk, P., Beauvais, T., Ryan, J., & Chalef, D. (2025). *Zep : A Temporal Knowledge Graph Architecture for Agent Memory*. arXiv:2501.13956. <https://arxiv.org/abs/2501.13956>

[^10]: Chhikara, P., Khant, D., Aryan, S., Singh, T., & Yadav, D. (2025). *Mem0 : Building Production-Ready AI Agents with Scalable Long-Term Memory*. ECAI 2025, arXiv:2504.19413. <https://arxiv.org/abs/2504.19413>

[^11]: Park, J. S., O'Brien, J. C., Cai, C. J., Morris, M. R., Liang, P., & Bernstein, M. S. (2023). *Generative Agents : Interactive Simulacra of Human Behavior*. UIST '23, ACM. <https://dl.acm.org/doi/10.1145/3586183.3606763>

[^12]: Karpathy, A. (2025). Tweet sur le *context engineering*, 25 juin 2025. <https://x.com/karpathy/status/1937902205765607626>

[^13]: Martin, R. L. (2025). *Context Engineering for Agents*, blog personnel, 23 juin 2025. <https://rlancemartin.github.io/2025/06/23/context_engineering/>

[^14]: Rehberger, J. (2024). *ChatGPT macOS Flaw Exposes Persistent Memory Risks (SpAIware)*, septembre 2024. Synthèse SC Media : <https://www.scworld.com/brief/prolonged-spyware-injection-possible-with-chatgpt-macos-flaw>

[^15]: MITRE ATLAS (2025). *AML.T0080 — AI Agent Context Poisoning : Memory*. <https://atlas.mitre.org/>

[^16]: Gibert, L., Herbera, D., Arnaudy, A., Fournier, G., Dupouy, H., Meghara, L., Fournier, L., et al. (2025). *Agentic AI : Premiers retours terrain*, livre blanc, Innovation Makers Alliance (IMA), novembre 2025. Chapitre 5 « Prospective : gestion de la mémoire, la clé de la réussite ». <https://www.ima-dt.org/>

[^17]: Li, J., Lai, Y., Li, W., et al. (2024). *Agent Hospital : A Simulacrum of Hospital with Evolvable Medical Agents*. arXiv preprint.

[^18]: Almansoori, M., Kumar, K., & Cholakkal, H. (2025). *Self-Evolving Multi-Agent Simulations for Realistic Clinical Interactions (MedAgentSim)*. arXiv preprint.

[^19]: Wang, Z. Z., Mao, J., Fried, D., & Neubig, G. (2024). *Agent Workflow Memory*. arXiv preprint.

[^20]: Zhong, W., et al. (2023). *MemoryBank : Enhancing LLM with Long-Term Memory via Ebbinghaus-inspired Forgetting*. AAAI 2024.

[^21]: Letta (2024). *MemGPT is now part of Letta*, billet de blog, septembre 2024. <https://www.letta.com/blog/memgpt-and-letta>

[^22]: Letta Documentation. *Memory Blocks*. <https://docs.letta.com/>

[^23]: Shinn, N., Cassano, F., Berman, E., Gopinath, A., Narasimhan, K., & Yao, S. (2023). *Reflexion : Language Agents with Verbal Reinforcement Learning*. NeurIPS 2023, arXiv:2303.11366.

[^24]: Zep AI (2025). *Graphiti : Real-Time Temporal Knowledge Graph for AI Agents*. GitHub. <https://github.com/getzep/graphiti>

[^25]: Mem0 (2026). *State of AI Agent Memory 2026*, blog Mem0. <https://mem0.ai/blog/state-of-ai-agent-memory-2026>

[^26]: Hong, S., et al. (2026). *MemMachine : A Ground-Truth-Preserving Memory System for Personalized AI Agents*. arXiv preprint.

[^27]: 36Kr (2025). *Context Engineering : The New Sensation in Silicon Valley*, juillet 2025. <https://eu.36kr.com/en/p/3366869315372801>

[^28]: Anthropic (2025). *Anthropic Brings Automatic Memory to Claude Pro and Max Users*, octobre 2025. Couverture MacRumors : <https://www.macrumors.com/2025/10/23/anthropic-automatic-memory-claude/>

[^29]: Anthropic Claude Documentation (2026). *Memory Tool*. <https://docs.claude.com/en/docs/agents-and-tools/tool-use/memory-tool>

[^30]: Claude Code Documentation (2026). *Auto Dream : Memory Consolidation for Long-Running Agents*. <https://claudefa.st/blog/guide/mechanics/auto-dream>

[^31]: Anthropic (2026). *Memory in Managed Agents (Claude Platform)*.

[^32]: Defensorum (2024). *ChatGPT macOS Flaw Exposes AI Memory Risks*, novembre 2024. <https://www.defensorum.com/chatgpt-macos-vulnerability-highlights-growing-risks-in-ai-memory-functionality/>

[^33]: LastPass Blog (2025). *Prompt Injection Attacks in 2025 — Gemini delayed tool invocation*, octobre 2025. <https://blog.lastpass.com/posts/prompt-injection>

[^34]: Microsoft Research / ALMcorp (2026). *AI Memory Poisoning : How Prompt Injection Attacks Hijack Copilot, ChatGPT & Claude*, février 2026. <https://almcorp.com/blog/ai-memory-poisoning-prompt-injection-attacks/>

[^35]: WebProNews (2026). *A Single Hyperlink Broke ChatGPT's Memory — And OpenAI Took Months to Fix It*, mars 2026. <https://www.webpronews.com/a-single-hyperlink-broke-chatgpts-memory-and-openai-took-months-to-fix-it/>

[^36]: Gao, H., & Zhang, Y. (2024). *Memory Sharing for Large Language Model based Agents*. arXiv preprint.

[^37]: EMILDAI (2025). *What Happens to the Right to Be Forgotten When AI Never Forgets ?*, novembre 2025. <https://emildai.eu/what-happens-to-the-right-to-be-forgotten-when-ai-never-forgets-is-data-erasure-an-illusion/>
