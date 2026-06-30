---
chapitre: 7
titre: "Reason · Act · Observe : le harness et ce qu'il enveloppe"
acte: 2
acte_titre: "La boucle"
gabarit: charnière
mots: 9510
statut: v1
date_maj: 2026-05-29
---

# Chapitre 7 — Reason · Act · Observe : le harness et ce qu'il enveloppe

> **Acte II — La boucle · Chapitre charnière, ~36 pages**
> _Qu'est-ce qui transforme un LLM bavard en agent capable d'enchaîner plusieurs tours sans se perdre — et pourquoi le différenciant migre-t-il, en 2026, du modèle vers le code qui l'enveloppe ? Sept couches, une boucle invariante, un pattern à trois agents quand la tâche s'étend, et une pyramide d'adoption qui décide qui s'en sert pour quoi._

> [!QUESTION] Question d'ouverture
> Six modèles frontières tiennent en avril 2026 dans **1,3 point** sur SWE-bench Verified[^1]. Sur **le même** modèle, le scaffold qui l'enveloppe peut faire bouger le score de **22 points**[^2]. Si l'écart de capacité tombe sous le bruit de mesure et que le scaffold pèse autant, où passe le levier d'ingénierie ? Et comment instrumente-t-on un agent qui peut, sans budget de tours, brûler **4 $ par minute** dans une boucle infinie qu'aucune métrique APM ne signale ?

> [!TLDR] TL;DR décideur
> - ==Le modèle s'est banalisé, le harness est devenu différenciant.== 2025 a été l'année des agents ; 2026 est l'année des **harnesses agentiques** (Gupta, janvier 2026)[^3]. Le verrou n'est plus le LLM — c'est le code qui gère `stop_reason`, tools, retries, budget de tours, compaction, hooks.
> - **Une seule boucle invariante** sous toutes les variantes : *Reason · Act · Observe* (Yao 2022, formalisée ReAct[^4]), instanciée comme *Gather · Act · Verify* dans l'Agent SDK Anthropic et comme *TAOR* dans les SDK vendor. Le harness pivote sur un champ — `stop_reason` — et c'est lui, pas le modèle, qui décide quand rendre la main, quand replanifier, quand demander une approbation humaine.
> - **Sept couches** structurent un harness production-grade : modèle, boucle de contrôle, contexte, outils & sandbox, mémoire, observabilité, gouvernance. **Aucune couche n'est optionnelle** une fois passé le POC — mais leur **complexité doit décroître** à mesure que les modèles s'améliorent (règle Anthropic : *which scaffolding is still qui porte encore ?*).
> - **Architecture canonique des tâches longues** : pattern à trois agents inspiré des GAN (planner / generator / evaluator). Sur un build full-stack de 6 heures : mono-agent = 20 min, 9 $, livrables non fonctionnels ; trois agents séparés = 6 h, 200 $, application livrée et testée[^5]. ==La séparation des rôles crée un signal correctif que l'auto-critique ne fournit pas.==
> - **Une pyramide d'adoption à 4 étages** (§7.9) distribue qui s'en sert : transverse (knowledge workers), data quotidien, data expert, produit/décideurs. Le sommet n'est pas mieux que la base — il est **plus stratégique**, parce qu'il cadre les permissions et les SLA pour les autres étages.
> - **Trois pièges à 100 % traçables** : laisser tourner la boucle sans budget de tours (loop infinie), exposer `execute_sql` sans scoping ni sandbox (exfiltration en 3 tours), sortir l'artillerie multi-agent pour un besoin qu'un workflow aurait résolu (×10-15 tokens, mois vs semaines, debug exponentiel).

---

## 7.1 Pourquoi 2026 est l'année du harness

### 7.1.1 La bascule modèle ↔ harness

La question opérationnelle de 2026, c'est moins *quel modèle prendre* que *quelle couche d'orchestration construire autour de lui*. La bascule est récente et nette.

En avril 2026, six modèles frontières tiennent dans 1,3 point sur SWE-bench Verified : Claude Opus 4.7 à 87,6 %, GPT-5.3-Codex à 85,0 %, Gemini 3.1 Pro à 80,6 %, Claude Opus 4.6 à 80,8 %, MiniMax M2.5 à 80,2 % en open weights, Claude Sonnet 4.6 à 79,6 %[^1] [^6]. ==Quand l'écart de capacité tombe sous le bruit de mesure, le différenciant migre ailleurs.== Sur SWE-Bench Pro, le **même** modèle peut osciller de 22 points selon le scaffold qui l'enveloppe[^2]. Claude Code obtient 80,9 % sur SWE-bench Verified avec Opus là où Opus seul, dans un harness basique, plafonne plus bas. Le harness n'est pas une commodité : c'est l'amplificateur principal.

Aakash Gupta a formulé la bascule dans un essai de janvier 2026 qui est resté[^3] : *« 2025 was agents, 2026 is agent harnesses »*. La métaphore est explicite : si le modèle est le moteur, le harness est la voiture. Le moteur le plus puissant ne va nulle part sans direction, freins, châssis, instruments de bord.

> [!INFO] Voir [Ch. 1 — Le cœur stochastique](ch01-coeur-stochastique.md)
> La nature probabiliste du tirage LLM est la raison structurelle pour laquelle le harness existe. À `T = 0,7`, rejouer mille fois produit mille trajectoires distinctes : la reproductibilité bit-à-bit n'existe pas. Le harness est ce qui rend cette variance tractable sans la tuer — et la stochasticité accumulée à chaque tool call est exactement ce que les sections 7.3 (boucle), 7.6 (mémoire) et 7.7 (observabilité) doivent maîtriser.

Trois faits empiriques justifient le pivot 2026.

**Premier fait : la convergence des modèles.** L'écart résiduel se loge dans le harness. Pour un acheteur enterprise, la conséquence est directe : la question utile n'est plus *« quel modèle prendre ? »* mais *« quel scaffold ce modèle traverse-t-il chez ce fournisseur ? »*.

**Deuxième fait : l'amplification par le scaffold.** Le delta de 22 points entre scaffold basique et scaffold optimisé sur le même modèle se loge dans des décisions précises — gestion de `stop_reason`, choix des tools, file-based handoffs, evaluator séparé. Ces décisions sont l'objet des sections 7.2 à 7.7.

**Troisième fait : la difficulté à construire.** Manus a réécrit son harness cinq fois en six mois ; LangChain a traversé quatre architectures en un an[^3]. ==On ne télécharge pas un harness sur Hugging Face. Il se construit, il casse, il se remplace.== Cet effort cumulé devient le *moat* — et c'est ce qui pousse les vendeurs (Anthropic, OpenAI, Google, AWS) à extraire leur harness interne en SDK public, mouvement amorcé en 2025 et généralisé en 2026.

---

## 7.2 Anatomie d'un harness : sept couches

![Anatomie d'un harness — sept couches verticales (modèle, boucle, contexte, outils, mémoire) traversées par les plans observabilité et gouvernance|1300](../../harness-agentique/images/20260429-01-anatomie-harness.svg)

Un harness production-grade n'est pas un wrapper léger autour d'une API. C'est un système distribué miniature. Sept couches le composent, chacune un point de complexité indépendant[^7].

### 7.2.1 Modèle, boucle, contexte, outils, mémoire

La **couche modèle** elle-même peut être hétérogène : routing entre Sonnet pour les workers et Opus pour le lead, fallback sur un modèle moins cher sur dépassement de budget, fenêtre de contexte étendue activée conditionnellement. Cette hétérogénéité n'est plus exotique en 2026 — elle est la norme dès qu'on opère un agent à volume.

La **boucle de contrôle** implémente le paradigme TAOR (Think-Act-Observe-Repeat) : le modèle réfléchit, choisit un appel d'outil, observe le résultat, recommence jusqu'à juger la tâche terminée. ==Le runtime est volontairement *bête* — toute l'intelligence reste dans le modèle.== Mais c'est ce runtime qui décide quand arrêter, quand replanifier, quand demander une approbation humaine.

La **gestion du contexte** est la couche que les équipes sous-estiment systématiquement. Le post-mortem du Azure SRE Agent l'expose sans fard[^8] : *« six mois nous ont appris que nous construisions un système d'ingénierie du contexte qui se trouve faire de la SRE »*. Quatre patterns récurrents :

- **wide tools** — peu d'outils généralistes plutôt que des dizaines de spécialistes ;
- **code execution comme outil universel** — un seul outil capable de tout au lieu d'une API par cas ;
- **compaction continue** — résumé incrémental + état structuré (renvoie à [Ch. 10](ch10-compaction.md)) ;
- **file-based handoff** — les sous-agents communiquent par fichiers, pas par message-passing.

La **couche outils & sandbox** isole l'exécution. La leçon de l'Azure SRE Agent vaut au-delà de Microsoft : un appel d'outil ne doit jamais réinjecter directement sa réponse dans le contexte. Une requête `SELECT *` sur une table de 3 000 colonnes peut produire 200 k tokens et tuer la session[^8]. La discipline : interception session-based, écriture en fichier sandboxé, lecture sélective.

La **mémoire** distingue trois plans — épisodique (l'historique de cette session), sémantique (faits durables sur le projet, l'utilisateur, l'environnement), procédurale (patterns de résolution déjà éprouvés). Les implémentations vont du fichier `CLAUDE.md` versionné dans un repo à la mémoire persistante de Claude Managed Agents (beta avril 2026) en passant par le `SessionService` de Google ADK et les Durable Objects de Cloudflare Agents.

> [!INFO] Voir [Ch. 9 — Mémoire agentique : 4 piliers, 6 opérations, 5 architectures](ch09-memoire-agentique.md)
> Les quatre piliers (travail, sémantique, épisodique, procédurale) et les cinq architectures de production (Letta, A-MEM, Zep, Mem0, file-based) y sont traités en détail — *comment* la mémoire est organisée, en complément de ce qui est posé ici (*où* elle vit dans la pile). Le [Ch. 10](ch10-compaction.md) approfondit le sous-pilier *travail* (compaction et oubli stratégique).

### 7.2.2 Observabilité, gouvernance — les plans horizontaux

L'**observabilité** traverse toutes les autres couches. On la traite en §7.7 ; elle mérite son plan horizontal parce qu'aucune des six premières ne peut être debuguée sans elle.

La **gouvernance** — politiques d'usage, RBAC, audit trail, hooks d'approbation — est la couche qu'on ajoute en dernier et que les équipes de production découvrent indispensable en premier. Les *agent hooks* d'Azure SRE Agent (`stop hooks`, `PostToolUse hooks`, `global hooks`) en sont l'illustration récente : trois points d'interception déterministes par-dessus un modèle probabiliste[^9]. C'est ce que la §7.5 développe.

### 7.2.3 Du conceptuel au système

Ces sept couches sont des fonctions, pas des fichiers. En production, elles s'incarnent dans des composants logiciels précis, organisés en quatre zones — entrée, agent (isolé), outils & contexte, persistance — traversées par un bus d'observabilité commun.

![Architecture système d'un harness de production — quatre zones (entrée, agent isolé, outils & contexte, persistance) avec bus d'observabilité transversal|1300](../../harness-agentique/images/20260429-01b-architecture-systeme.svg)

Trois lectures se dégagent. ==Le différenciant n'est pas dans les surfaces d'entrée==, qui se sont banalisées : CLI, IDE, web — tout vendeur sérieux a les trois. Il n'est pas non plus dans la persistance, devenue une commodité (sessions, config, cache, outputs). Il se concentre dans la zone agent — routing modèle, modes, boucle TAOR à quatre phases, sub-agents — et dans la couche outils & contexte (Tool Registry, Skills System, Context Engineering). C'est là que se logent les heures d'ingénierie qui transforment un wrapper en harness.

**L'isolation entre entrée et agent est une frontière de sécurité**, pas un détail d'architecture : tout ce qui entre y est traité comme non-fiable, tout ce qui sort en est arbitré par un approval gate. **Le bus d'observabilité doit être présent dès la première version** — l'ajouter après coup oblige à instrumenter à la main des centaines de points d'appel.

---

## 7.3 La boucle Reason · Act · Observe et son pivot : `stop_reason`

Yao et collaborateurs formalisent en 2022 sous le nom **ReAct**[^4] le paradigme qui sous-tend tous les harnesses contemporains : le modèle raisonne (*Thought*), propose une action (*Act*), le runtime l'exécute, le résultat est ré-injecté en observation. La boucle pivote sur un champ — `stop_reason`. Quand il vaut `end_turn`, on répond à l'utilisateur ; quand il vaut `tool_use`, on appelle un outil et on ré-entre. Le code qui enveloppe ce cycle s'appelle un harness — et c'est lui, bien plus que le modèle, qui distingue un POC d'un produit.

> [!EXAMPLE] La boucle minimale (Anthropic Client SDK)
> ```python
> response = client.messages.create(
>     model="claude-sonnet-4-6",
>     tools=TOOLS,
>     messages=messages
> )
> while response.stop_reason == "tool_use":
>     result = your_tool_executor(response.content[-1])
>     messages.append({"role": "user", "content": [
>         {"type": "tool_result", "tool_use_id": ..., "content": result}
>     ]})
>     response = client.messages.create(
>         model="claude-sonnet-4-6", tools=TOOLS, messages=messages
>     )
> ```
> Cinq lignes utiles. C'est la voie *Client SDK* d'Anthropic — max contrôle, max boilerplate. C'est aussi la boucle que vous **n'avez plus à écrire** quand vous passez au Claude Agent SDK : le harness gère tools, retries, hooks, compaction. Vous écrivez la logique métier, plus le plumbing[^10].

### 7.3.1 Trois variantes d'une même boucle

La boucle existe sous trois formulations qui décrivent **la même mécanique** sous des angles différents — et c'est pour cela que cinq dossiers du corpus la décrivent indépendamment. Discipline éditoriale : **une seule description canonique ici**, renvois ailleurs.

**Variante 1 — TAOR (Think-Act-Observe-Repeat).** Formulation industrielle, héritée des SDK de production (Anthropic, OpenAI Agents SDK, Google ADK). Quatre phases explicitement nommées dans les traces. C'est celle qu'on instrumente en OpenTelemetry GenAI (§7.7).

**Variante 2 — Gather · Act · Verify.** Formulation Anthropic Agent SDK[^10]. *Gather* = trouver le contexte pertinent avant d'agir (la phase la plus sous-estimée, par retour d'Anthropic — beaucoup d'agents échouent non pas parce que le modèle est mauvais, mais parce qu'ils ont sauté la phase de contexte). *Act* = exécuter via tools, bash ou codegen. *Verify* = critiquer (lint, compile, tests pour le code ; citations croisées pour la recherche). ==Les coding agents sont forts précisément parce que la vérification y est facile : `tsc` échoue, le modèle voit l'erreur, corrige, relance. Les research agents sont plus durs parce que la vérification est floue.==

**Variante 3 — Pattern à trois agents (GAN-inspiré).** Quand la tâche s'étend au-delà de 30 minutes wall-clock, la boucle mono-agent s'effondre — c'est l'objet de la §7.4.

Toutes trois pivotent sur le même champ — `stop_reason` — et toutes trois sont *défensives par défaut*. Sans budget de tours, sans détection de cycle, sans plafond de tokens, un agent entre dans une **loop infinie à 4 $/minute**. C'est le piège classique de la boucle de contrôle, et c'est non négociable : un harness sans plafond n'est pas un harness, c'est un risque opérationnel.

### 7.3.2 Pourquoi la boucle mono-agent s'effondre

Anthropic a documenté l'effondrement en mars 2026[^5]. Deux modes d'échec dominent.

**La dégradation contextuelle**, d'abord : à mesure que la fenêtre se remplit, la cohérence chute non-linéairement. Sonnet 4.5 manifestait même une *« anxiété de contexte »* — le modèle accélérait sa conclusion en pressentant les limites, livrant des features non testées. La courbe en U de Liu et al. (TACL 2024, traitée en [Ch. 10](ch10-compaction.md) §10.2) frappe en milieu de fenêtre.

**La complaisance auto-évaluative**, ensuite : un agent qui juge son propre travail le surévalue systématiquement. Sur les tâches subjectives (design d'interface, qualité éditoriale), aucun test binaire ne corrige cette indulgence ; sur les tâches objectives, le biais persiste mais devient plus subtil[^5].

> [!QUOTE] Rajasekaran (Anthropic Labs, mars 2026)
> *« Calibrer un evaluator séparé pour être sceptique est techniquement plus tractable que de forcer un generator à se critiquer sincèrement. La séparation des rôles crée un signal correctif que l'auto-critique ne fournit pas. »*[^5]

La solution emprunte à un domaine apparemment éloigné : les Generative Adversarial Networks. Un *generator* produit, un *evaluator* note, et la séparation des rôles crée le signal correctif. C'est l'objet de la §7.4.

---

## 7.4 Le pattern à trois agents (GAN-inspiré)

![Pattern GAN à trois agents — planner, generator, evaluator avec artefacts file-based et critères gradables|1300](../../harness-agentique/images/20260429-02-boucle-gan.svg)

Pendant deux ans, l'architecture canonique d'un agent fut la boucle ReAct mono-agent : un seul modèle qui pense, agit, observe, en continu. Ce pattern fonctionne sur des tâches courtes et bien structurées. Il s'effondre sur les tâches longues. Le pattern à trois agents — formalisé par Anthropic Labs en mars 2026 dans un post d'ingénierie qui restera référence[^5] — est devenu le scaffold canonique des workflows long-running.

### 7.4.1 Anatomie du pattern

Le **planner** prend un prompt d'une à quatre phrases et produit une spécification produit fournie. Il s'arrête volontairement au *quoi* et au *pourquoi* — pas au *comment* — pour ne pas figer prématurément des choix d'implémentation.

Le **generator** implémente par sprints, sur une stack standardisée (React, FastAPI, PostgreSQL, git dans l'exemple Anthropic), un feature à la fois.

L'**evaluator** ouvre l'application via Playwright MCP, navigue, clique, teste contre des contrats explicites, et émet une critique typée selon quatre axes : *design quality*, *originality*, *craft*, *functionality*. Les axes design quality et originality sont pondérés plus fort, parce qu'ils encodent du goût qu'aucun test fonctionnel ne capture[^5].

### 7.4.2 L'économie du pattern

Le rapport coût/qualité est instructif. Sur l'exemple d'un *retro game maker* documenté par Anthropic[^11] :

| Configuration | Durée | Coût | Livrable |
|---|---|---|---|
| Mono-agent Opus 4.5 | 20 min | 9 $ | Non fonctionnel (routes mal ordonnées, entités non câblées, outils mal implémentés) |
| **Full harness GAN à trois agents** | **6 h** | **200 $** | **Application livrée et testée** |

==L'evaluator attrape précisément les défauts que le generator se cache à lui-même.== À 200 $ pour 6 heures, le ROI est immédiat dès qu'on remplace ne serait-ce qu'une heure d'ingénieur senior (~150 $ chargés).

### 7.4.3 Trois leçons d'ingénierie

**Les agents communiquent par fichiers, pas par messages.** Les specs, le journal de progression, la liste des features, les artefacts de test : tout passe par le système de fichiers. Cette discipline garde le travail fidèle aux spécifications sans sur-contraindre les agents — et garde la fenêtre de contexte légère (le sub-agent renvoie un résumé, pas l'intégralité de son travail).

**La complexité du harness doit décroître à mesure que les modèles s'améliorent.** Le harness initial d'Anthropic incluait des *context resets* durs entre sessions (héritage de l'anxiété de contexte de Sonnet 4.5). Avec Opus 4.5 puis 4.6, les context resets ont disparu, la décomposition en sprints a été simplifiée. ==Le test à appliquer périodiquement : quel scaffolding est encore *pivot* ? Le reste alourdit sans servir.==

**L'evaluator capture les bugs de last-mile.** Même quand le generator est excellent, c'est l'evaluator qui détecte les routes mal câblées, les états cassés, les états initiaux manquants. La critique externalisée force le système à converger sur du fonctionnel, pas sur du *« semble fonctionner »*.

> [!ATTENTION] Le pattern n'est pas la seule architecture
> Mais il est devenu le scaffold de référence pour les workflows long-running, et toutes les variantes contemporaines (Microsoft Azure SRE Agent et son evaluator de root cause, l'orchestrateur multi-domaine McKinsey pour l'ITSM agentique, le pattern initializer/coder d'Anthropic pour les sessions multi-jours) en sont des spécialisations[^9] [^12]. ==Pour la taxonomie complète des 8 patterns canoniques et l'arbre de décision *quand* sortir l'artillerie multi-agent==, voir [Ch. 11](ch11-patterns-orchestration.md).

### 7.4.4 Trois spécialisations qui circulent

Le pattern à trois agents s'instancie différemment selon le domaine. Trois variantes méritent d'être nommées parce qu'elles reviennent dans les retours d'expérience publics.

**Variante Microsoft Azure SRE Agent.** Le rôle de l'evaluator est joué par un *root cause analyzer* qui consulte logs, métriques et traces APM pour vérifier que la mitigation proposée correspond bien à la cause racine de l'incident — pas seulement à un symptôme. Chiffres publiés : 1 300+ agents déployés en interne chez Microsoft, 35 000+ incidents mitigés, 20 000+ heures d'ingénierie économisées. Sur Azure App Service, le time-to-mitigation est passé de 40,5 heures à 3 minutes[^9].

**Variante McKinsey orchestrateur multi-domaine ITSM.** L'orchestrateur joue à la fois planner et router : il identifie le domaine de l'incident (réseau / app / data), invoque le worker spécialisé du domaine (qui joue le rôle generator), puis un evaluator transverse valide la cohérence finale[^12]. Cas documenté : un grand groupe multinational où l'embedding d'agents a permis l'automation de 80 % de 450 000 tickets annuels, 50 % de capacité d'agents humains redéployée vers des activités à plus forte valeur, score de satisfaction client à 4,8/5.

**Variante Anthropic initializer/coder pour sessions multi-jours.** L'initializer (joue rôle planner) prépare le `CLAUDE.md`, scaffolde l'environnement, écrit le brief technique. Le coder (generator) exécute par sprints sur plusieurs sessions. Le ledger entre sessions, lui, joue partiellement le rôle d'evaluator — il signale les régressions de cohérence entre sprints.

Ces trois variantes partagent la mécanique de base — séparation des rôles, file-based handoff, evaluator calibré sceptique — et divergent sur la nature des artefacts intermédiaires. ==La leçon : le scaffold à trois agents n'est pas une recette unique ; c'est une **discipline d'architecture** qu'on instancie au domaine.==

---

## 7.5 Outils, bash et codegen — les trois paradigmes d'action

Une fois la boucle posée et le scaffold choisi, reste la question des **outils** : par quels canaux l'agent agit-il sur le monde ? L'Agent SDK Anthropic[^10] formalise trois paradigmes qui ne sont pas substituables — chacun a sa zone de pertinence, et une app de production sérieuse **combine les trois**.

![Matrice Tools / Bash / Codegen — trois zones de pertinence|1300](../../agent-sdk/images/20260518-07-matrice-tools-bash-codegen.svg)

### 7.5.1 Tools — actions structurées, atomiques, destructives

**Pros.** Structuré (schéma JSON déclaré), fiable (le modèle suit le schéma), rapide (un seul aller-retour), contrôlé (vous décidez exactement ce qui s'exécute).

**Cons.** Cher en contexte (chaque tool description prend des tokens), mauvaise composabilité (chaque tool est isolé, il faut orchestrer dans le prompt), faible discoverability (le modèle voit la liste mais ne peut pas en composer des nouveaux).

**Best for.** Actions destructives ou irréversibles où vous voulez un contrat strict : envoyer un email, créer un ticket Jira, écrire un fichier à un chemin précis, opérer une transaction de paiement. Tout ce qui doit avoir un masquage de données sensibles (un tool peut filtrer les champs ; un script bash, plus difficilement). Tout ce qui doit produire un audit log structuré.

### 7.5.2 Bash — composition, filesystem, mémoire

C'est l'opinion centrale qui structure l'Agent SDK. Thariq Shihipar (Anthropic) la formule sans détour dans son workshop de mai 2026[^10] : *« bash became the first true code mode »* et *« eventually you end up with dozens or hundreds of rigid tools. Claude Code instead just uses Unix primitives »*.

Le scénario qui généralise — l'assistant email reçoit *« Combien j'ai dépensé en VTC cette semaine ? »* :

- **Sans bash**, le modèle récupère 500 emails, les stuffe dans le contexte, essaie de raisonner sur l'agrégat. Résultat : approximation, hallucination de chiffres, impossibilité de vérifier. La fenêtre explose.
- **Avec bash**, l'agent compose une chaîne Unix : `gmail-search "uber OR lyft after:..."` → `jq '.messages[].body'` → `grep -oE '\$[0-9]+\.[0-9]{2}'` → `awk '{sum+=$1} END {print sum}'`. Trois lignes de shell, un total exact, une trace auditée.

==La différence n'est pas marginale. Elle est structurelle.== Trois propriétés que les tools rigides n'ont pas : **composabilité native** (pipes Unix), **économie de contexte** (résultats intermédiaires en fichiers, pas en tokens), **traçabilité** (chaque étape laisse un fichier, un exit code, un stderr).

### 7.5.3 Codegen — flexibilité, analyses ad hoc, deep research

Le compromis. L'agent **écrit ses propres scripts** au lieu d'invoquer des tools métier prédéfinis :

> [!EXAMPLE] La voie codegen avec hooks (Anthropic Agent SDK)
> ```python
> async for msg in query(
>     prompt="Liste les Pokémon de Génération 2 de type eau",
>     options=ClaudeAgentOptions(
>         allowed_tools=["Read", "Edit", "Bash", "WebFetch"],
>         hooks={"PreToolUse": [
>             HookMatcher(matcher="Write", hooks=[validate_script])
>         ]}
>     ),
> ):
>     ...
> ```
> Le hook `validate_script` peut, par exemple, refuser tout script qui n'aurait pas d'abord lu la doc ou cassé la requête en étapes traçables. ==C'est cette voie qui donne le bon ratio contrôle/effort pour une production custom : l'agent fait le travail de wrapping en runtime, vous gardez les garde-fous via les hooks et les permissions.==

### 7.5.4 La règle de combinaison

Une app de production combine typiquement les trois. **Tools** pour les ~5 actions destructives critiques. **Bash** pour 80 % du raisonnement opérationnel (recherche, lecture de fichiers, exécution de scripts). **Codegen** pour les pics de flexibilité (analyses one-shot, intégrations ad hoc). La proportion dépend du domaine — un agent SRE pèse plus côté bash, un agent CRM plus côté tools.

### 7.5.5 Le cas SQL — un mini-arbre de décision

Pour donner accès à une base à un agent, vous avez le choix entre les trois paradigmes, et ce choix est **déterminant pour la sécurité** :

- **Tool** quand vous voulez contrôle strict, masking de colonnes sensibles, et RBAC déterministe. Vous exposez `executeQuery` avec un whitelist de tables et un parser qui retire les colonnes PII. L'agent ne peut faire que ce que le tool permet. C'est la voie pour la prod régulée (BFSI, healthcare, secteur public).
- **Bash / codegen** quand vous voulez du SQL dynamique avec feedback loop. L'agent écrit une requête, voit l'erreur de syntaxe, corrige, relance. C'est plus puissant pour de l'analyse exploratoire mais beaucoup plus dur à sécuriser — la combinatoire d'attaque sur le shell est ouverte. Réserver à l'exploratoire et au prototype.

Le bon réflexe RBAC reste le même : ==**la sécurité passe par les clés API scopées, les proxies backend et les tokens temporaires — pas par le prompt.**== Un agent qui n'a pas accès à `users` via sa clé API ne touchera pas à `users`, quoi qu'il décide. Un agent qui a la clé mais à qui on a *demandé* de ne pas toucher peut être manipulé.

> [!IMPORTANT] Le RBAC passe par l'infra, pas par le prompt
> Pour donner accès à une base à un agent : ==la sécurité passe par les clés API scopées, les proxies backend et les tokens temporaires — pas par le prompt.== Un prompt *« ne lis pas la table users »* ne tient pas. Une clé API qui n'a pas accès à `users` tient toujours. C'est le principe de **least agency** de l'OWASP ASI Top 10 (déc. 2025)[^13] : ne jamais donner plus d'autonomie que la tâche ne l'exige.

---

## 7.6 Skills, hooks, sub-agents — les leviers de fiabilité déterministe

Au-delà de la boucle et des trois paradigmes d'action, le harness 2026 expose trois leviers qui **ajoutent du déterminisme par-dessus le probabiliste**. Tous trois sont matérialisés à la fois dans Claude Code (le produit) et dans le Claude Agent SDK (la library) — c'est la même mécanique avec deux surfaces.

### 7.6.1 Les skills — un objet partageable

Une *skill* est un dossier `<nom>/` contenant un fichier `SKILL.md` (frontmatter YAML — description, allowed-tools, paths — plus corps markdown d'instructions) et, optionnellement, des fichiers de support : scripts, templates, exemples[^14]. Les skills sont chargées par le client à mesure qu'elles deviennent pertinentes (matching par description) ou sur invocation explicite (`/<nom-skill>`).

Quatre emplacements par priorité décroissante : *enterprise* (managed, imposée par l'organisation), *personnel* (`~/.claude/skills/`), *projet* (`.claude/skills/`), *plugin*. Anthropic a aligné le format sur le standard ouvert **Agent Skills** (agentskills.io) — interopérable avec d'autres clients à venir[^14].

Simon Willison, qui n'est pas réputé pour son enthousiasme rapide, a qualifié les skills d'objet *« peut-être plus important que MCP »*[^15]. Sa raison : MCP donne à l'agent l'accès à des **outils nouveaux** ; les skills lui donnent l'accès à des **procédures** — des manières de faire codifiées, partageables, versionnables. Une skill `audit-dbt-schema` n'est pas un nouveau tool, c'est une recette qui combine les tools existants (Read, Bash, MCP Postgres) selon un protocole précis.

> [!EXAMPLE] Anatomie minimale d'une skill `audit-dbt-schema`
> ```markdown
> ---
> description: Audite un schéma dbt — détecte les modèles sans tests,
>   les colonnes non documentées, et les tables orphelines. Invoquer
>   quand un dossier contient `dbt_project.yml`.
> allowed-tools: [Read, Glob, Grep, Bash]
> paths:
>   - "models/**/*.sql"
>   - "models/**/*.yml"
>   - "dbt_project.yml"
> ---
>
> # Skill : audit-dbt-schema
>
> Procède dans cet ordre :
> 1. **Cartographie** — Glob `models/**/*.sql` puis `models/**/*.yml`.
> 2. **Couverture tests** — parser `tests:` au niveau modèle et colonne.
> 3. **Tables orphelines** — grepper `ref('<nom>')` pour chaque modèle.
> 4. **Rapport** — produire `dbt-audit.md` à la racine.
>
> Ne **jamais** modifier .sql ou .yml ; cette skill est read-only.
> ```
> Ce que le lecteur data engineer comprend immédiatement : ce n'est pas du code à exécuter, c'est un **protocole à suivre** par l'agent. Et ce qui rend la skill utile, ce n'est pas l'IA — c'est la *structure du raisonnement*. Elle remplace une page Confluence interne du type *« comment auditer notre dbt »* qui aurait fini obsolète. Elle est versionnée, déclenchable par mots-clés, exécutable end-to-end.

Le cycle de vie d'une skill suit cinq étapes : création (rédaction du `.md`), enregistrement (placement dans le bon dossier), invocation (mots-clés ou commande), exécution (Claude charge le `.md`, lit les instructions, applique le protocole), versionnement (commit dans un repo, partage). Pas plus complexe que ça. ==La complexité réside dans la rédaction de la skill — savoir formaliser son propre protocole de travail, ce qui est plus difficile qu'il n'y paraît.==

### 7.6.2 Les hooks — le rattrapage déterministe

Six points d'interception déterministes dans l'Agent SDK Anthropic : `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `SessionEnd`, `UserPromptSubmit`. Quand le modèle saute une étape — typiquement, **répondre de mémoire au lieu de vérifier** — un hook peut intercepter et injecter dans le contexte : *« Please make sure you write a script, please make sure you read this data from the API. »*[^10]

C'est de la **discipline déterministe ajoutée par-dessus** un modèle probabiliste. Vous n'attendez pas que le modèle soit parfait — vous reconfigurez sa boucle pour qu'une étape manquante soit toujours rattrapée. ==C'est le pattern le plus puissant de l'Agent SDK pour fiabiliser un agent en production.==

Trois cas d'usage qui reviennent en prod :

- **Bloquer une action destructive avant exécution.** Un `PreToolUse` qui matche sur `Write` ou `Bash` et inspecte les arguments — refus si le path cible touche `/etc`, `~/.ssh`, ou un fichier marqué `READONLY` dans le repo. Coût : 20-30 lignes de code, économie potentielle : un incident post-mortem signé par un humain.
- **Forcer une vérification après réponse.** Un `PostToolUse` qui détecte que la réponse contient un chiffre absolu (regex `\d+(?:\.\d+)?\s*(€|\$|%|ms|s|min)`) et qu'aucun tool n'a été appelé dans le tour — l'agent répond *« de mémoire »* sur une donnée vérifiable. Le hook renvoie au modèle : *« provide the source query or tool result that produced this number »*.
- **Imposer un format de sortie en clôture.** Un `Stop` hook qui valide le format final (JSON valide ? Markdown structuré ? Footnotes complètes ?) — si non, relance avec un *« reformat to spec »*.

### 7.6.3 Les sub-agents — déléguer dans la délégation

Un sub-agent est un assistant secondaire que l'agent principal invoque pour une tâche bornée[^14]. Il a sa propre fenêtre de contexte, son propre system prompt, son propre accès tools restreint, et renvoie un **résumé** au thread principal — pas l'intégralité de son travail. Cette dernière propriété est cruciale : elle permet au thread principal de garder une fenêtre légère même quand le sub-agent a fait un travail dense.

Trois sub-agents built-in chez Claude Code : `Explore` (read-only, parfait pour la cartographie), `Plan` (mode plan, pour drafter sans toucher), `general-purpose` (le bouclage classique). On peut en créer des custom : un fichier `.claude/agents/<nom>.md` (frontmatter `name`, `description`, `tools`, `model`) plus un system prompt. Le custom-agent peut être routé sur Haiku (plus rapide, moins cher) tout en laissant le main-thread sur Opus.

> [!INFO] Voir [Ch. 11 — Patterns canoniques et orchestration multi-agents](ch11-patterns-orchestration.md)
> Le pattern à trois agents (§7.4) et la mécanique sub-agent (§7.6.3) sont les briques élémentaires d'une orchestration. Le [Ch. 11](ch11-patterns-orchestration.md) traite la **taxonomie complète** : les 8 patterns canoniques (Anthropic 6 + supervisor-workers + hierarchical + peer-to-peer AutoGen), les 4 régimes de contrôle (code-driven workflow / LLM-driven routines+handoffs / graphe LangGraph / agent autonome), et l'**arbre de décision buy/build** (4 stades de maturité de fabrique).

---

## 7.7 Observabilité — six piliers, et pourquoi l'APM est aveugle

![Six piliers de l'observabilité agentique — traces, qualité, coût, drift, guardrails, audit, articulés autour de l'agent|1300](../../harness-agentique/images/20260429-06-observabilite-piliers.svg)

L'observabilité agentique n'est pas l'observabilité classique. Les outils APM (Datadog, Dynatrace, New Relic) instrumentent encore essentiellement la latence, les erreurs et l'utilisation de ressources. ==Sur un agent, ces métriques ratent l'essentiel : *est-ce que la sortie est bonne*.==[^16]

Six piliers structurent une observabilité production-grade. On les résume ici parce qu'ils traversent les six autres couches de la §7.2 — le détail vendor landscape et la grille de maturité sont en **[Ch. 20](ch20-observabilite-cognitive-audit-trail.md)** :

- **Traces** — OpenTelemetry a ratifié en 2025 ses *GenAI Semantic Conventions* (`gen_ai.system`, `gen_ai.request.model`, `gen_ai.usage.prompt_tokens`). Discipline (Azure SRE Agent à nouveau) : tronquer dans le span, persister le payload complet en sandbox.
- **Métriques de qualité** — LLM-as-Judge online sur chaque interaction en production (pas seulement en offline) pour détecter les régressions en temps réel. Coinbase l'a institutionnalisé : second LLM as judge pour le spot-checking et le confidence scoring[^17].
- **Coût** — token economics par session, par utilisateur, par cas d'usage. Le risque de boucle infinie (anxiété de contexte + retry sans limite) coûte cher. **Hard cap par session, kill-switch automatique, alerting sur taux de tool calls > seuil.**
- **Drift comportemental** — agents en production dérivent. La distribution des inputs change (saisonnalité, nouveaux usages), les modèles backend sont mis à jour par le fournisseur (sans préavis explicite parfois), les outils intégrés évoluent.
- **Guardrails** — politiques d'usage, détection de PII en sortie, redaction, blocage d'outils hors scope. Les violations sont des alertes critiques (PagerDuty, OpsGenie), pas des incidents informationnels.
- **Audit trail réglementaire** — pour les secteurs régulés (BFSI, healthcare, legal), un enregistrement immuable de chaque exécution : quelles données ont été utilisées, comment, quel raisonnement, qui a approuvé. ==Le **cognitive audit trail** ([Ch. 20](ch20-observabilite-cognitive-audit-trail.md) §20.3) est devenu en 2026 la nouvelle catégorie de log : rétention longue, signature cryptographique, droit d'accès art. 22 RGPD.==

> [!INFO] Voir [Ch. 20 — Observabilité agentique et cognitive audit trail](ch20-observabilite-cognitive-audit-trail.md)
> L'observabilité est posée ici **comme couche d'un harness**. Le [Ch. 20](ch20-observabilite-cognitive-audit-trail.md) traite la grille complète : vendor landscape (Langfuse, Braintrust, Arize, LangSmith, Dynatrace, AgentCore), échelle de maturité (POC → audit → cognitive trail), et l'attribut `gen_ai.compaction.*` du WG OpenTelemetry actif fin 2026 (cf. [Ch. 10](ch10-compaction.md) §10.9).

---

## 7.8 Gouvernance — le gruyère suisse, sandbox, RBAC

Thariq Shihipar (Anthropic, mai 2026) décrit la sécurité d'un agent bash-driven comme un **gruyère suisse à trois couches**[^10]. ==Chaque couche a des trous ; combinées, elles ferment la majorité des vecteurs d'attaque. Aucune n'est suffisante seule — c'est la composition qui rend l'ensemble robuste.==

![Le gruyère suisse de la sécurité d'un agent bash-driven — trois couches imparfaites superposées|1300](../../agent-sdk/images/20260518-09-securite-couches.svg)

**Couche 1 — Alignement modèle.** Anthropic investit massivement sur l'alignement du modèle lui-même : il refuse les actions destructrices sans confirmation, il évite les prompt injections, il ne s'auto-exfiltre pas. Publication récente d'Anthropic sur le *reward hacking* — un modèle bien aligné ne triche pas pour atteindre son objectif. C'est la première barrière, mais ce n'est pas suffisant.

**Couche 2 — Harness controls.** Le SDK fournit un parser bash qui comprend ce que l'agent essaie de faire avant de l'exécuter (et permet de bloquer des patterns dangereux), un permission system qui restreint les tools accessibles, des hooks qui peuvent intercepter et refuser une action, des prompting controls qui orientent le comportement. C'est la couche que vous configurez explicitement.

**Couche 3 — Sandbox env.** Isolation réseau (l'agent ne peut pas appeler des endpoints arbitraires), filesystem scope (l'agent ne voit que `/workspace`, pas `/etc`), execution scope (pas d'accès root, limites de CPU/RAM). C'est ce qui empêche l'exfiltration de données et limite le *blast radius* en cas de compromission. Les providers cités (Cloudflare Sandbox, Modal, E2B, Daytona) implémentent déjà ces garanties.

> [!WARNING] Le piège classique de la couche outils
> Exposer `execute_sql` sans scoping ni sandbox. Sous prompt injection indirecte, l'agent exfiltre la base en **trois tours**. Variante : le **tool poisoning** — une description d'outil malicieuse détourne l'intention. OWASP ASI02 documente la famille entière[^13]. ==La défense passe par : tagging des sources (chaque token porte un tag `user` / `system` / `tool:web` / `tool:rag` que le compactor doit préserver — cf. [Ch. 10](ch10-compaction.md) §10.7), sandbox isolée, allowlist namespace pour les tools MCP (cf. [Ch. 16](ch16-mcp-securite.md)).==

> [!INFO] Voir [Ch. 16 — Sécurité MCP](ch16-mcp-securite.md) et [Ch. 21 — Garde-fous et sécurité globale](ch21-gardefous-securite-globale.md)
> La matrice défensive **10 vecteurs × 10 patterns** pour les serveurs MCP est traitée en [Ch. 16](ch16-mcp-securite.md). La synthèse transverse — modèle / prompt / mémoire / outil / protocole / surface — est en [Ch. 21](ch21-gardefous-securite-globale.md) (schéma E4 du threat model unifié 2026).

### 7.8.1 Agent sprawl et cascade d'erreurs — les deux risques systémiques 2026

Au-delà du gruyère technique, deux risques **systémiques** émergent en 2026 et pèsent autant sur la décision d'adoption que les vulnérabilités techniques individuelles.

**L'agent sprawl.** Sans gouvernance d'équipe, des agents redondants se multiplient — chaque équipe construit le sien, chacun consomme du compute, beaucoup font la même chose. Le *« lean agent architecture »* d'Azure SRE Agent répond à ce risque : préférer **peu d'agents généralistes avec wide tools** que beaucoup d'agents spécialistes[^8]. La traduction opérationnelle : un catalogue d'agents partagé au niveau organisation, un comité de revue qui valide chaque nouvel agent en prod, et des conventions partagées (`CLAUDE.md` standardisé, skills versionnées dans un repo central).

**La cascade d'erreurs en multi-agents.** Quand un système multi-agents fait passer une erreur silencieuse de l'agent N à l'agent N+1, le débogage devient cauchemardesque. La distillation GitHub de février 2026 sur les échecs multi-agents en synthétise le diagnostic : ==un système multi-agents se comporte comme un système distribué — chaque handoff requiert un schéma typé, des actions contraintes et une validation de frontière explicite.== *Add more agents* n'est jamais la solution ; c'est un problème de design d'interface[^26]. Cet angle est repris en taxonomie dans le [Ch. 11](ch11-patterns-orchestration.md) (8 patterns canoniques, 5 problèmes durs prod).

---

## 7.9 La pyramide d'adoption — qui s'en sert pour quoi

![Pyramide des cas d'usage — quatre étages, du transverse au produit/décideurs|1300](../../coding-agents/images/20260512-05-pyramide.svg)

Une fois le harness construit, reste la question d'adoption — qui s'en sert, pour quoi, et avec quelle posture face à l'agent ? Une pyramide à quatre étages, malgré son origine côté code, dépasse ce périmètre et structure l'usage des agents dans toute organisation[^14].

**Étage 1 — transverse (pour tout knowledge worker).** Rédaction longue, slide deck, veille / résumés, brief client / proposal, mails complexes, recherche documentaire. C'est l'étage **le plus large**, et celui qui a fait sortir Claude Code du périmètre dev — finance, marketing, data science l'ont adopté pour la composition de scripts bash et la production de livrables texte structurés. Simon Willison l'a écrit en octobre 2025 après avoir longtemps minimisé le tournant : *« Claude Code est mal nommé. Ce n'est pas un outil de code, c'est un outil d'automatisation générale »*[^15].

**Étage 2 — data quotidien (analyste, BI dev, data scientist).** SQL ad hoc commenté, notebook EDA, transformation CSV, dashboards Streamlit, scripts ponctuels. C'est l'étage où la fiabilité du modèle compte le plus — Claude Sonnet y est le LLM le plus admiré et le 2e plus désiré selon Stack Overflow Developer Survey 2025[^18], précisément pour la bonne adhérence au schéma et le faible taux d'hallucinations sur les noms de fonctions.

**Étage 3 — data expert (pipelines, refactos, audits).** Pipelines ETL / dbt, refactos de repo (Stripe a migré 10 000 lignes Scala→Java en 4 jours là où l'estimation était 10 semaines-ingénieur[^19]), audits sécurité/qualité, MLOps + tests. C'est aussi l'étage où l'agent peut **ralentir un senior** : METR documente -19 % de vitesse chez 16 mainteneurs OSS experts avec accès à l'IA, alors qu'ils prédisaient +24 %[^20]. ==Sur les codebases qu'on connaît par cœur, l'agent peut être un frein== — c'est aussi pour ça qu'on ne le déploie pas dans une équipe sans une réflexion sur où il aide vraiment. METR a auto-critiqué en février 2026 (le -19 % est probablement une borne haute du ralentissement à cause de biais de sélection), mais le résultat brut reste instructif.

**Étage 4 — produit / décideurs (managers, PO, chefs de projet).** Ne codent pas au quotidien mais **cadrent l'usage** : permissions par équipe, brief specs en mode `plan`, audit de repo legacy, lecture critique d'un livrable agent. ==C'est l'étage qui détermine si l'agent devient un multiplicateur sain ou une dette qui s'accumule.== C'est aussi l'étage **le plus exposé aux mauvais réflexes** : un manager qui ne code pas au quotidien peut déléguer un livrable critique sans capacité de revue sérieuse, ou accorder des permissions trop laxes par méconnaissance technique. Birgitta Böckeler décrit dans *I still care about the code* l'effet *« enthusiastic but overconfident teammates »*[^24] — encore plus vrai pour un manager que pour un dev qui co-pilote l'agent. Le dev voit immédiatement ce qui sonne faux ; le manager doit construire cette capacité de revue de seconde main, par rituels (pair-review des PR agent, post-mortems quand ça casse).

> [!NOTE] Le sommet n'est pas mieux que la base — il est plus stratégique
> La pyramide ordonne la **posture face à l'agent** (utilisateur quotidien, expert technique, leader stratégique), pas la valeur. Un livrable transverse réussi — un brief client de 5 pages structuré en 2 heures plutôt qu'en 8 — génère autant de valeur qu'un audit sécurité ou qu'une décision de gouvernance bien posée. Les chevauchements sont la règle : un data engineer rédige aussi des briefs, un consultant manipule aussi des CSV, un manager audite parfois un repo legacy avant de le confier à son équipe.

### 7.9.1 Trois retex chiffrés pour calibrer le réflexe

La pyramide n'a de sens que rapportée à des ordres de grandeur. Trois retex publics — un par étage 2 à 4 — pour ancrer.

**Étage 4 — refacto Scala→Java chez Stripe.** 1 370 ingénieurs équipés de Claude Code. Anecdote phare : **migration de 10 000 lignes Scala vers Java en 4 jours**, là où l'estimation initiale était 10 semaines-ingénieur[^19]. Facteur 12,5× sur ce projet précis. Le mental model interne : *« un nouvel ingénieur capable, qui connaît tous les langages mais pas le contexte business ni le 'Stripe way' »*. La nuance compte — sans `CLAUDE.md` qui encode la *Stripe way*, l'agent produirait du Java idiomatique mais hors-norme.

**Étage 3 — l'étude METR -19 %.** 16 développeurs OSS experts (>5 ans, >1 500 commits), 246 tâches réelles sur des repos massifs, tirage aléatoire AI/no-AI. Résultat : **19 % plus lents avec accès à l'IA**, alors que les devs prédisaient être 24 % plus rapides[^20]. Gap perception/réalité : ~39 points. Cause probable : maîtrise du codebase déjà élevée — le contexte humain bat le contexte IA. ==Sur les codebases qu'on connaît par cœur, l'agent peut être un frein.== METR a auto-critiqué en février 2026 : le -19 % est probablement une borne haute du ralentissement à cause de biais de sélection (30 à 50 % des devs ont admis avoir retiré du panel les tâches avec gain anticipé maximal, et la mesure du temps est cassée sur workflows agentiques — le dev fait autre chose pendant que l'agent tourne). Le résultat brut reste néanmoins instructif.

**Étage 2 — DORA Report 2025.** ~5 000 répondants, 100h+ de qualitatif, 7 archétypes d'équipes[^25]. 90 % utilisent l'IA au travail (+14 pts vs 2024), médiane d'usage 2h/jour. >80 % estiment que l'IA augmente leur productivité ; 59 % rapportent un effet positif sur la qualité du code. **Mais 30 % font peu ou pas confiance** au code IA. Impact sur les métriques DORA : positive sur le throughput (deployment frequency, lead time), **négative sur la stabilité** (change failure rate) sans système de contrôle robuste. La phrase qui reste : *« AI's primary role is as an amplifier, magnifying an organization's existing strengths and weaknesses »*[^25]. Une équipe qui livrait propre livre encore plus propre ; une équipe qui livrait bancal livre plus de bancal plus vite.

> [!QUOTE] DORA Report 2025
> *« AI's primary role is as an amplifier, magnifying an organization's existing strengths and weaknesses. »* — c'est aussi pourquoi le cadrage du sommet (étage 4) détermine si l'agent devient un multiplicateur sain ou une dette qui s'accumule.

---

## 7.10 Trois voies pour builder + une — la matrice de décision

Une fois le harness compris (§7.2-7.8) et l'adoption cadrée (§7.9), reste la décision concrète : **avec quoi construire** ? L'Agent SDK Anthropic[^10] formalise une matrice à quatre voies, calibrée sur le curseur **effort × contrôle**.

### 7.10.1 Voie 1 — L'API brute (Client SDK)

Max contrôle, max boilerplate. Vous appelez directement la Messages API, vous gérez vous-même la boucle de tool calling (l'exemple §7.3). Cas typiques : intégration dans un produit avec des contraintes UI strictes, latence ultra-optimisée, contrôle fin de chaque tool call pour audit réglementaire.

### 7.10.2 Voie 2 — L'Agent SDK

`from claude_agent_sdk import query, ClaudeAgentOptions`. Vous héritez du harness complet : tous les tools built-in disponibles à la demande, l'agent loop déjà câblée, les hooks accessibles, le filesystem géré, les skills loadables. Vous gardez la main sur l'UI (vous fabriquez votre propre frontend) et sur les tools métier que vous ajoutez en sus.

C'est le **sweet spot pour un produit custom**. La matrice officielle d'Anthropic le dit explicitement : l'Agent SDK est fait pour les CI/CD pipelines, les custom apps, l'automation de production. *« Many teams use both »* — typiquement, on prototype dans Claude Code pour vérifier que la logique tient, puis on extrait dans le SDK pour le produit final.

### 7.10.3 Voie 3 — Claude Code comme plateforme d'extension

Vous ne fabriquez pas un nouveau produit. Vous étendez Claude Code lui-même via `.claude/skills/`, `.claude/commands/`, `CLAUDE.md`, hooks dans `settings.json`, MCP servers. **Min effort, max vélocité, contrainte forte** : votre artefact est exécutable uniquement par les gens qui ont Claude Code installé.

### 7.10.4 Voie 4 — Managed Agents (production hostée)

API REST hostée par le vendeur, sandbox managée, scaling automatique. Anthropic Claude Managed Agents (public beta avril 2026, header `managed-agents-2026-04-01`), Vertex AI Agent Engine, Azure AI Foundry Agent Service, AWS Bedrock AgentCore (GA octobre 2025, 8 services composables)[^21]. ==Trade-off classique : moins de contrôle d'exécution, plus de simplicité opérationnelle.==

Le chemin canonique recommandé par Anthropic : *« A common path is to prototype with the Agent SDK locally, then move to Managed Agents for production »*[^10]. Vous codez et débuggez en local sur le SDK, vous portez en Managed quand vous voulez livrer sans opérer la sandbox vous-même.

### 7.10.5 Une matrice transverse — quand utiliser quoi

| Cas d'usage | Voie recommandée | Tools/Bash/Codegen | À surveiller |
|---|---|---|---|
| Assistant interne pour équipe non-dev | Claude Code + skills | Bash > Tools | CLAUDE.md à entretenir |
| Wrapper API métier interne (REST) | Agent SDK (Python ou TS) | Tools + Codegen | RBAC clé scopée, masking PII |
| Agent multi-tenant SaaS en production | Agent SDK → Managed Agents | Tools + Bash | Permissions strictes, isolation tenant |
| Workflow GitHub triage | GitHub Action Claude Code | Bash > Tools | Audit log via hooks, scope token |
| Agent SRE incidents | Agent SDK + observability custom | Bash + Codegen | Wide tools, file-based handoffs |
| Agent research / veille | Agent SDK + WebSearch + WebFetch | Codegen > Bash | Verification floue : forcer citations |
| Automation Slack | Claude Code + Slack integration | Tools > Bash | Routing, confirmation utilisateur |
| Pipeline ETL ponctuel | Claude Code + bash scripts | Bash > Codegen | Idempotence, traçabilité |

Trois règles transverses :

- **Plus l'utilisateur final est exposé, plus la voie produit (Managed Agents ou Agent SDK avec UI custom) gagne.** Vous n'exposez pas un terminal Claude Code à un client final.
- **Plus les actions sont destructives, plus les tools déclarés gagnent sur le bash libre.** Un agent qui envoie des emails à des clients ou modifie des données de production doit le faire via tools auditables, pas via shell.
- **Plus l'analyse est ad hoc et exploratoire, plus le codegen + bash gagne.** Un agent de recherche ou de data analysis profite massivement de la flexibilité — la rigueur s'ajoute via les hooks et la vérification.

> [!INFO] Voir [Ch. 22 — Runtime managé et déploiement](ch22-runtime-manage.md)
> La voie 4 (Managed Agents) y est traitée en profondeur : matrice vendor (Bedrock AgentCore / Vertex Agent Engine / Foundry Agent Service / Claude Managed Agents / OpenAI Agent Builder), pricing consumption-based, dépendance et **code-first + protocoles ouverts** (MCP, A2A) comme meilleure assurance anti-lock-in.

---

## 7.11 Effort de développement — combien, combien de temps, avec qui

![Effort de développement — trois trajectoires (POC, mid-complexity, multi-agent prod)|1300](../../harness-agentique/images/20260429-05-effort-developpement.svg)

La question que pose tout COMEX éclairé en 2026 : *combien*, *combien de temps*, *avec qui*. Trois fourchettes empiriques, calibrées sur les retours de cabinets et d'éditeurs en 2026[^22] [^23].

**Trajectoire A — POC FAQ ou single-task.** 4 à 8 semaines, 50 à 100 k€ tout compris, équipe core de 2-3 ingénieurs. Périmètre : un agent unique, un ou deux outils, une tâche bien délimitée. C'est le ticket d'entrée pour valider une hypothèse business. La majorité des POC s'arrête là — pas faute de fonctionner, mais faute d'un sponsor pour faire le pas suivant.

**Trajectoire B — Agent mid-complexity (RAG + intégrations).** 3 à 5 mois, 150 à 300 k€, équipe de 4-6 personnes incluant un AI lead, deux AI engineers, un data engineer, 0,5 ETP sécurité, 0,5 ETP MLOps. C'est la zone où la majorité des projets enterprise atterrissent.

**Trajectoire C — Système multi-agents en production.** 6 à 12 mois, 500 k€ à 2 M€+, équipe 8-15 personnes y compris compliance officer dédié sur secteurs régulés. Architecture obligatoire : pattern planner / generator / evaluator + bus de télémétrie OTel + RBAC granulaire + sandbox d'exécution + agent hooks de gouvernance + memory persistante.

**Distribution de l'effort.** Trois constantes apparaissent dans les retours d'expérience consolidés[^22]. Premièrement, ==la préparation des données capture **60-75 % de l'effort total**== — le savoir d'entreprise change constamment, demande nettoyage, validation, réindexation continue. Deuxièmement, **intégration + QA capturent 40 à 60 % du build cost** dans la plupart des déploiements enterprise. Troisièmement, **safety / guardrails ajoutent 20 à 30 % au coût de développement de base** — ce ne sont pas des options ajoutables après coup ; ils doivent être conçus dans le harness dès le début, sous peine de réécriture coûteuse.

**Coûts de fonctionnement.** 3 200 à 13 000 $ par mois pour un agent en production servant des utilisateurs réels, selon le volume et la complexité des requêtes[^22]. La conséquence implicite : ==le **cost-per-successful-task** — pas le cost-per-token — devient l'indicateur central.== Vercel cite un repère : un agent DevOps automatisé résout une erreur de déploiement pour 2 $ de compute là où un ingénieur humain coûte 150 $ de labor chargé pour la même heure.

> [!INFO] Voir [Ch. 23 — Mesurer le ROI (et le paradoxe agentique)](ch23-roi-paradoxe-agentique.md)
> Le chapitre charnière de l'Acte IV traite la **productivity J-curve** (Brynjolfsson), les 5 frameworks de mesure (Cigref, McKinsey, BCG, MIT NANDA, Forrester TEI), et le **paradoxe agentique** — le changement d'unité de mesure à mesure que l'agent monte la pile de valeur (token → tâche → processus → outcome). Le cas Klarna (67 % automatisé puis recul partiel sur les 5 % de cas charge émotionnelle) y est traité comme illustration centrale.

---

## Récap chapitre — Sept couches, une boucle, trois voies

![Anatomie d'un harness — récap chapitre : sept couches verticales (modèle, boucle, contexte, outils, mémoire) traversées par les plans observabilité et gouvernance|1300](../../harness-agentique/images/20260429-01-anatomie-harness.svg)

==**À retenir** : sept couches structurent un harness production-grade.== Cinq couches verticales empilées (modèle → boucle → contexte → outils → mémoire) traversées par deux plans horizontaux (observabilité, gouvernance). Sous ces sept couches, **une seule boucle invariante** : *Reason · Act · Observe*, formalisée ReAct en 2022, instanciée comme *Gather · Act · Verify* chez Anthropic, comme *TAOR* dans les SDK vendor, comme *pattern à trois agents* (planner / generator / evaluator) dès que la tâche s'étend au-delà de 30 minutes wall-clock.

==Le différenciant 2026 n'est ni dans la couche modèle (banalisée à 1,3 point près sur SWE-bench), ni dans la couche surfaces d'entrée (CLI / IDE / web, tout vendeur sérieux a les trois), ni dans la persistance (commodity).== Il se loge dans la zone agent (routing, boucle TAOR à quatre phases, sub-agents) et dans la couche outils & contexte (Tool Registry, Skills System, Context Engineering). C'est là que se logent les heures d'ingénierie qui transforment un wrapper en harness.

Quatre voies pour le construire — Client SDK (max contrôle, max boilerplate), Agent SDK (sweet spot custom), Claude Code comme plateforme d'extension (min effort, contrainte forte), Managed Agents (production hostée, dépendance assumée). Le chemin canonique : **prototyper en Claude Code, valider la logique, extraire dans le SDK, porter en Managed quand le produit prend forme**.

---

> [!WARNING] Trois pièges classiques (les trois sont 100 % traçables)
> - **Laisser tourner la boucle sans budget de tours.** Un agent entre en loop infinie ; la facture ne se réveille que le lundi matin à 4 $/minute × week-end. ==Le harness doit être défensif par défaut== : max_turns, max_tokens, timeout wall-clock, kill-switch sur taux de tool calls > seuil.
> - **Exposer `execute_sql` sans scoping ni sandbox.** Sous prompt injection indirecte, l'agent exfiltre la base en 3 tours. La sécurité passe par les clés API scopées, les proxies backend et les tokens temporaires — **jamais** par un prompt qui dit *« ne touche pas à ces données »*.
> - **Sortir l'artillerie multi-agent pour un besoin qu'un workflow aurait résolu.** ×10-15 tokens, mois vs semaines de delivery, debug exponentiellement plus dur. Règle Schluntz-Zhang (Anthropic, déc. 2024) : *start simple, measure, add complexity only when it delivers measurable value*. 70 % des cas se résolvent en workflow routé sans jamais mériter l'étiquette *agentique* (cf. [Ch. 11](ch11-patterns-orchestration.md)).

---

## Sources

[^1]: morphllm.com, *Best AI for Coding (2026): Every Model Ranked by Real Benchmarks*, mars 2026. <https://www.morphllm.com/best-ai-model-for-coding>

[^2]: BenchLM.ai, *SWE-bench Verified Benchmark 2026: 43 LLM scores*, avril 2026. <https://benchlm.ai/benchmarks/sweVerified>

[^3]: Aakash Gupta, *2025 Was Agents. 2026 Is Agent Harnesses. Here's Why That Changes Everything*, Medium, 8 janvier 2026. <https://aakashgupta.medium.com/2025-was-agents-2026-is-agent-harnesses-heres-why-that-changes-everything-073e9877655e>

[^4]: Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik Narasimhan, Yuan Cao, *ReAct: Synergizing Reasoning and Acting in Language Models*, ICLR 2023. <https://arxiv.org/abs/2210.03629>

[^5]: Prithvi Rajasekaran (Anthropic Labs), *Harness design for long-running application development*, Anthropic Engineering Blog, 24 mars 2026. <https://www.anthropic.com/engineering/harness-design-long-running-apps>

[^6]: Marco Patzelt (marc0.dev), *SWE-Bench Verified Leaderboard March 2026*, mise à jour avril 2026. <https://www.marc0.dev/en/leaderboard>

[^7]: Anthropic, *Building effective agents*, whitepaper, décembre 2024 (mis à jour 2025). <https://www.anthropic.com/research/building-effective-agents>

[^8]: Sanchit Mehta (Microsoft Azure SRE Agent team), *Context Engineering for Reliable AI Agents: Lessons from Building Azure SRE Agent*, Microsoft Tech Community, 11 janvier 2026. <https://techcommunity.microsoft.com/blog/appsonazureblog/context-engineering-lessons-from-building-azure-sre-agent/4481200/>

[^9]: Mayunk Jain (Microsoft), *Announcing general availability for the Azure SRE Agent*, Microsoft Tech Community, avril 2026. <https://techcommunity.microsoft.com/blog/appsonazureblog/announcing-general-availability-for-the-azure-sre-agent/4500682>

[^10]: Thariq Shihipar (Anthropic), *Workshop Claude Code + Agent SDK*, mai 2026 ; et Anthropic, *Claude Agent SDK overview*, <https://code.claude.com/docs/en/agent-sdk/overview>.

[^11]: TeamDay.ai, *Anthropic's GAN-Inspired Harness for Autonomous Application Development*, 24 mars 2026. <https://www.teamday.ai/ai/anthropic-harness-design-long-running-apps>

[^12]: McKinsey & Company, *Reimagining tech infrastructure for and with agentic AI*, avril 2026. <https://www.mckinsey.com/capabilities/mckinsey-technology/our-insights/reimagining-tech-infrastructure-for-and-with-agentic-ai>

[^13]: OWASP Agentic Security Initiative, *Top 10 for Agentic Applications*, décembre 2025. <https://owasp.org/www-project-agentic-security-initiative/>

[^14]: Anthropic, *Claude Code overview*, <https://code.claude.com/docs/en/overview> ; et Agent Skills standard, <https://agentskills.io>.

[^15]: Simon Willison, *Skills might be more important than MCP*, simonwillison.net, octobre 2025.

[^16]: Synthèse à partir de OpenTelemetry GenAI Semantic Conventions (CNCF, ratification 2025) et observabilité agentique (Langfuse, Braintrust, Arize, Datadog LLM Observability), avril 2026.

[^17]: Coinbase Engineering, *Building enterprise AI agents at Coinbase: engineering for trust, scale, and repeatability*, 22 décembre 2025. <https://www.coinbase.com/blog/building-enterprise-AI-agents-at-Coinbase>

[^18]: Stack Overflow, *Developer Survey 2025 — AI section*, 2025 (48 885 répondants, section AI 33 662 réponses).

[^19]: Anthropic, *Stripe and Claude Code: 1370 engineers, 10k lines Scala→Java in 4 days*, case study 2025-2026.

[^20]: METR, *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity*, juillet 2025 ; et auto-critique méthodologique, février 2026.

[^21]: Synthèse vendor (Anthropic Claude Managed Agents, OpenAI Agent Builder, Google Vertex AI Agent Engine, Microsoft Azure AI Foundry Agent Service, AWS Bedrock AgentCore), avril 2026.

[^22]: Azilen, *AI Agent Development Cost: Full Breakdown for 2026*, avril 2026. <https://www.azilen.com/blog/ai-agent-development-cost/>

[^23]: TechCloudPro, *How Much Does an Enterprise AI Agent Cost to Build and Deploy in 2026?*, 4 avril 2026. <https://techcloudpro.com/blog/enterprise-ai-agent-cost-guide-2026/>

[^24]: Birgitta Böckeler (ThoughtWorks), *I still care about the code*, martinfowler.com, 2025.

[^25]: Google Cloud, *DORA Accelerate State of DevOps Report 2025 — AI section*, 2025.

[^26]: GitHub Engineering, *Multi-Agent Workflows Often Fail. Here's How to Engineer Ones That Don't*, 24 février 2026.
