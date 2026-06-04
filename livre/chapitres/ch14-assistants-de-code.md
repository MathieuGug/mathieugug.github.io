---
chapitre: 14
titre: "Assistants de code : Claude Code, Copilot, Codex, Antigravity"
acte: 3
acte_titre: "Les interfaces"
gabarit: standard
mots: 5400
statut: ébauche v0.9
date_maj: 2026-06-04
---

# Chapitre 14 — Assistants de code : Claude Code, Copilot, Codex, Antigravity

> **Acte III — Les interfaces · Chapitre standard, ~18 pages**
> _Le [Ch. 13](ch13-surfaces-agentiques.md) a posé la typologie des quatre régimes d'accès (chat, copilote inline, canvas génératif, on-behalf-of). On l'instancie ici sur la verticale la plus mûre : l'assistant de code. C'est la surface que des millions de personnes touchent quotidiennement — et, parce qu'un agent qui sait écrire et exécuter du bash sait travailler hors du code, c'est aussi devenu un outil d'automatisation générale. Du régime copilote au délégué de terminal._

> [!QUESTION] Question d'ouverture
> En trois ans, l'objet « autocomplete » est devenu un « délégué » : on ne lui demande plus de compléter une ligne, on lui confie un livrable — la *pull request* ouverte. Mais les chiffres de productivité divergent violemment : **+55,8 %** sur un projet *greenfield* dans une étude GitHub, **−19 %** sur un *codebase* mature dans une étude METR. Si le même outil accélère un débutant et ralentit un expert, qu'est-ce qu'on mesure réellement — et comment un décideur choisit-il quoi déléguer, à qui, et où s'arrête le gain ?

> [!TLDR] TL;DR décideur
> - ==Changement de nature, pas de nom.== Un assistant de code agit sur un *projet entier* (pas un buffer), *itère en boucle* (propose → observe → ajuste, sur 10 à 60 min), et prend en charge un *livrable* (la PR), pas une suggestion de ligne. La différence avec un chatbot n'est pas le modèle, c'est le **régime de travail**.
> - ==Une anatomie commune en six composants== autour du modèle : contexte · outils · skills · sous-agents · hooks · permissions. Aucun n'est nouveau isolément ; la nouveauté est leur intégration en un seul système (voir [Ch. 12](ch12-adk-frameworks.md) pour la couche construction).
> - ==Le terminal est un contexte universel.== Un dossier + un shell + un agent = environnement de travail pour tout *travail formalisable* (code, slides Markdown, note longue, CSV). Conséquence : ces outils sont **mal nommés** — ce ne sont pas des outils de développeur mais d'automatisation générale.
> - ==Le marché s'est structuré en trois formes== : la CLI (Claude Code, Codex CLI, Gemini CLI), l'IDE-natif (GitHub Copilot, Cursor, Antigravity), et l'agent asynchrone cloud (Copilot coding agent, Devin, Jules). Le choix dépend moins du modèle que de l'intégration à votre chaîne existante.
> - ==L'IA est un amplificateur, pas un accélérateur uniforme.== DORA 2025 : *« AI's primary role is as an amplifier »* — elle magnifie forces *et* faiblesses. Le spectre **+55,8 % / −19 %** n'est pas une contradiction : c'est la signature d'un outil dont le rendement dépend de la maturité du contexte et de la qualité de la revue.
> - ==Le bon réflexe 2026 n'est pas de remplacer le clavier, c'est de déléguer un livrable== — quand la *revue est bornée*. La délégation est une fausse économie dès que relire exige le même niveau d'expertise que produire (audit sécurité, décision d'architecture).

---

## 14.1 Pourquoi un chapitre dédié

> [!INFO] Frontières avec les chapitres voisins
> L'assistant de code est l'instanciation du **régime copilote/CLI** de la typologie du [Ch. 13](ch13-surfaces-agentiques.md) sur le métier du logiciel. La couche *construire son propre agent* (SDK, ADK) est au [Ch. 12](ch12-adk-frameworks.md) : ici on parle des produits qu'on *utilise*, pas des kits avec lesquels on *builde*. Le cadre général de **mesure du ROI** (frameworks, hard vs soft savings, J-curve, paradoxe agentique) est au [Ch. 23](ch23-roi-paradoxe-agentique.md) ; ce chapitre n'en donne que la déclinaison code. La sécurité des connecteurs (MCP) est au [Ch. 16](ch16-mcp-securite.md), le pilotage d'écran au [Ch. 17](ch17-computer-use.md).

### 14.1.1 Trois régimes, une trajectoire

![Autocomplete / assistant IDE / coding agent sur quatre axes|1300](../../coding-agents/images/20260512-01-trois-regimes.svg)

La démarcation tient en quatre axes — contexte d'opération, mode d'interaction, durée de boucle, type de livrable :

- **Autocomplete** (Copilot v1, ~2018) : contexte = quelques centaines de tokens autour du curseur ; boucle = la *milliseconde* ; livrable = un fragment.
- **Assistant IDE** (Copilot Chat début, ~2022) : contexte = le fichier ouvert ; boucle = la *seconde* ; livrable = une réponse ou un patch local.
- **Coding agent** (~2025) : contexte = un *projet* ; il accède au filesystem, lance des commandes shell, lit ses propres sorties ; boucle = la *minute* (10 à 60) ; livrable = une PR.

Simon Willison le formule sans détour : *« Claude Code est mal nommé »*[^1] — parce qu'un dossier, un shell et un agent suffisent à traiter tout travail formalisable, pas seulement du code.

### 14.1.2 Anatomie commune

![Anatomie d'un coding agent : six composants autour du modèle|1300](../../coding-agents/images/20260512-02-anatomie.svg)

Six composants gravitent autour du modèle : **contexte** (le `CLAUDE.md`, recommandé sous 200 lignes, relu depuis le disque à chaque compaction[^2]), **outils** (lire, éditer, exécuter), **skills** (capacités versionnées et réinvocables[^3]), **sous-agents** (délégation à des contextes isolés[^4]), **hooks** (discipline déterministe sur la boucle[^5]), **permissions** (le contrat de confiance[^6]). Le contexte cesse d'être un paramètre du prompt pour devenir un **objet versionné, partagé, gouverné**.

## 14.2 Panorama des outils

![Comparatif Claude Code / Codex CLI / GitHub Copilot|1300](../../coding-agents/images/20260512-04-comparatif.svg)

### 14.2.1 Les CLI de terminal

**Claude Code (Anthropic, février 2025).** La CLI de référence par densité d'écosystème : skills *first-class* (`SKILL.md`), sous-agents, hooks, mémoire persistante (`CLAUDE.md` + auto-mémoire), implémentation de référence de MCP. Sa fonction *Tool Search* réduit une session chargée d'environ 72 000 à 8 700 tokens (−85 %)[^7]. Tarifs : Pro 20 $/mois, Max 5× 100 $, Max 20× 200 $, Team 25 $/siège, Enterprise.

**Codex CLI (OpenAI, 16 avril 2025).** Open-source (Apache 2.0), réécrit à ~96 % en Rust mi-2025, distingué par un **sandboxing OS-natif strict** (Seatbelt sur macOS, `bubblewrap` sur Linux, WSL2 sur Windows) — trois modes (`read-only` / `workspace-write` réseau coupé / `danger-full-access`) croisés à quatre politiques d'approbation[^8]. **Inclus dans l'abonnement ChatGPT** (Plus/Pro/Team/Enterprise), donc quasi gratuit pour qui l'a déjà. Au 10 mai 2026 : 81,6k étoiles GitHub. MCP promu *runtime* de premier rang (release 0.130.0, mai 2026).

**Gemini CLI (Google, 2025).** Le pendant terminal open-source côté Google, adossé à Gemini, avec un tier gratuit généreux et un support MCP. Même régime que Claude Code et Codex CLI : un agent qui vit dans le shell. _(Détails tarifaires et de capacités à vérifier sur les pages officielles Google — produit en évolution rapide.)_

### 14.2.2 Les IDE-natifs

**GitHub Copilot (Microsoft/GitHub).** La densité d'usage IDE-natif (VS Code, JetBrains) doublée d'une intégration GitHub native : on assigne une *issue* à `@copilot`, qui ouvre une PR draft et répond aux commentaires de revue. Depuis *Agent HQ* (28 octobre 2025), il orchestre plusieurs modèles (Anthropic, OpenAI, Google, Cognition, xAI)[^9]. Tarifs : Free, Pro 10 $, Pro+ 39 $, Business 19 $/siège, Enterprise 39 $/siège — avec une **bascule vers la facturation à l'usage (« GitHub AI Credits ») au 1er juin 2026**.

**Cursor.** Fork de VS Code à agent intégré, créditée de *« l'adoption d'IDE la plus rapide de l'histoire »* (~17,9 % d'usage dans l'enquête Stack Overflow 2025, devant Claude Code à 10 %).

**Google Antigravity.** L'IDE agentique de Google (présenté fin 2025, autour de Gemini 3), positionné comme une plateforme *agent-first* : un *Agent Manager* y pilote plusieurs agents en parallèle à travers l'éditeur, le terminal et le navigateur. C'est l'entrée de Google dans le régime IDE-natif face à Cursor et Copilot. _(Capacités et tarifs à confirmer sur les pages officielles Google.)_

### 14.2.3 Les agents asynchrones cloud

Le régime *on-behalf-of* du [Ch. 13](ch13-surfaces-agentiques.md), appliqué au code : on confie une tâche, l'agent travaille dans une VM cloud et propose une PR. **Devin** (Cognition Labs) en est l'archétype premium ; **Jules** (Google Labs, adossé à Gemini) en est l'entrée Google ; le **coding agent asynchrone de GitHub Copilot** (GA 25 septembre 2025) en est la version intégrée. La fiabilité sur les sessions longues reste le facteur limitant.

> [!INFO] Aider, le pionnier
> **Aider** (open-source, 2023) a posé des conventions reprises partout : git-first (*chaque modification = un commit*), modèle-agnostique. Beaucoup des réflexes de Claude Code et Codex CLI viennent de là.

## 14.3 La pyramide des cas d'usage

![Pyramide des cas d'usage à quatre étages|1300](../../coding-agents/images/20260512-05-pyramide.svg)

C'est une carte de **posture** face à l'agent, pas de valeur : *« le sommet n'est pas mieux que la base, il est plus stratégique »*.

1. **Transverse** (base, le plus large) — *tout knowledge worker*. Rédaction longue, deck de slides, veille, brief client, recherche documentaire. Contre-indication : tout livrable exigeant une voix originale (sinon *« AI slop »*).
2. **Data quotidien** — *analyste, BI, data scientist*. SQL ad hoc, notebook d'exploration, transformation CSV, petits dashboards. Contre-indication : domaine métier non documenté.
3. **Data expert** — *pipelines critiques, refactos, audits*. ETL/dbt, refacto de repo, audits sécurité/qualité (le terrain des sous-agents), MLOps. Contre-indication : les tâches où l'agent ralentit un senior qui maîtrise son codebase (le −19 % METR).
4. **Produit / décideurs** (sommet, le plus étroit) — *managers, PO, leads* qui ne codent plus mais **cadrent l'usage** (permissions, SLA, périmètres MCP). C'est *« l'étage qui détermine si l'agent devient un multiplicateur sain ou une dette »* — et le profil le plus exposé aux mauvais réflexes.

## 14.4 Gains et coûts : lire les chiffres sans se faire avoir

> [!INFO] Renvoi ROI
> Le cadre complet (frameworks Cigref/McKinsey/BCG, hard vs soft savings, *productivity J-curve*, paradoxe agentique) est au [Ch. 23](ch23-roi-paradoxe-agentique.md). On se limite ici à la déclinaison code et à une règle de lecture.

![Gains observés : retex et benchmarks|1300](../../coding-agents/images/20260512-06-gains.svg)

### 14.4.1 Retex chiffrés vs scores de benchmarks

Il faut distinguer trois familles de chiffres, de fiabilité décroissante :

- **Retex de première main** (les plus utiles, les moins généralisables) : un dossier illustré complet produit en ~5 h contre ~25 h estimées (facteur ~5) ; un refacto de bibliothèque partagée en ~2,5 h contre 6-8 h (facteur ~3, mais 3 bugs de regex pris à la revue humaine) ; un deck commercial en 1 j contre 8 j (facteur ~8, après ~4 h d'écriture de skill).
- **Études contrôlées** (rigoureuses, étroites) : GitHub **+55,8 %** sur tâche *greenfield* < 3 h (RCT 2023)[^10] ; METR **−19 %** sur repos > 1 M lignes avec des experts qui prédisaient pourtant +24 % (juillet 2025)[^11], chiffre que METR a elle-même requalifié de *borne haute du ralentissement* en février 2026[^12].
- **Case studies vendeur** (spectaculaires, auto-déclarés) : Stripe, 10 000 lignes Scala→Java en 4 jours vs 10 semaines-ingénieur estimées ; Block, 75 % des 4 000 utilisateurs déclarant 8-10 h/semaine gagnées[^13]. À manier avec la même prudence qu'un communiqué.

### 14.4.2 Le coût caché domine

![Coûts mensuels stratifiés : abonnements, tokens, coût caché|1300](../../coding-agents/images/20260512-07-couts.svg)

Au-delà de l'abonnement (0 à 200 $/mois) et des tokens (un long format à l'API : 10-50 $, divisé par ~10 avec le *prompt caching* au-delà de 80 % de cache hit), le coût réel est ailleurs : l'écriture des skills et `CLAUDE.md` (2-4 h, rentable à la 3ᵉ-4ᵉ invocation) et surtout **le temps de revue**. La règle empirique : *« la revue domine — toujours »*. Le facteur de productivité brut doit être divisé par 1,5 à 2 une fois la relecture intégrée. Stack Overflow 2025 chiffre la friction : la confiance dans l'exactitude tombe de 40 % à 29 % en un an, et la frustration nᵒ 1 est *« presque juste, mais pas tout à fait »* (66 %)[^14].

## 14.5 Par où commencer : le bon réflexe

![Carte de décision par profil : première heure, semaine, mois|1300](../../coding-agents/images/20260512-08-carte-decision.svg)

Le bon réflexe n'est pas de remplacer le clavier : c'est de **déléguer un livrable** — d'exercer sur soi-même la bascule d'*individual contributor* à orchestrateur. La délégation paie quand la revue est bornée (un script de 50 lignes, un brief de 5 pages) ; elle devient une fausse économie quand relire exige le même niveau d'expertise que produire. Parcours en trois jalons :

- **Première heure** — un cas trivial qui *marche*, pour constater la capacité (pas pour prouver le ROI).
- **Première semaine** — *un* cas récurrent automatisé en skill (critères : ≥ 1 h à la main, ≥ 2×/mois, livrable structuré, erreur rattrapable).
- **Premier mois** — un *changement de cadence* (une veille mensuelle qui devient hebdomadaire), doublé d'un bilan honnête du coût (abonnement + heures de skills + fraction de revue).

## 14.6 Sortie lecteur

Après ce chapitre, on doit pouvoir : (1) situer un assistant de code dans la typologie des surfaces du [Ch. 13](ch13-surfaces-agentiques.md) ; (2) choisir entre CLI, IDE-natif et agent asynchrone selon sa chaîne existante ; (3) lire un chiffre de productivité en sachant de quelle famille il vient ; (4) identifier son étage dans la pyramide d'usage ; (5) lancer une adoption par délégation bornée plutôt que par remplacement.

> [!CAUTION] Piège classique
> Mettre un assistant de code dans un *RFP* avec un score de benchmark (« SWE-bench > 60 % ») comme critère. C'est mesurer un proxy contaminé ([Ch. 19](ch19-evaluation-benchmarks.md)) au lieu de la seule chose qui compte : le facteur de productivité *net de revue* sur *votre* corpus, à *votre* étage de la pyramide.

---

[^1]: Simon Willison, *Claude Skills are awesome, maybe a bigger deal than MCP*, 16 octobre 2025, https://simonwillison.net/2025/Oct/16/claude-skills/ ; voir aussi *Hallucinations in code are the least dangerous form of LLM mistakes*, 2 mars 2025.
[^2]: Anthropic, *How Claude remembers your project (CLAUDE.md)*, https://code.claude.com/docs/en/memory.
[^3]: Anthropic, *Extend Claude with skills*, https://code.claude.com/docs/en/skills.
[^4]: Anthropic, *Create custom subagents*, https://code.claude.com/docs/en/sub-agents.
[^5]: Anthropic, *Automate workflows with hooks*, https://code.claude.com/docs/en/hooks-guide.
[^6]: Anthropic, *Choose a permission mode*, https://code.claude.com/docs/en/permission-modes.
[^7]: Dossier *Coding agents 2026* (mathieugug.github.io/coding-agents, 12 mai 2026), §2 (Tool Search : ~72k → ~8,7k tokens).
[^8]: OpenAI, *Introducing Codex (CLI)*, 16 avril 2025, https://openai.com/index/introducing-codex/ ; *Sandboxing — Codex Concepts*, https://developers.openai.com/codex/concepts/sandboxing ; repo https://github.com/openai/codex.
[^9]: GitHub, T. Daigle, *Agent HQ: welcome home, agents*, 28 octobre 2025, https://github.blog/ ; *Meet the new coding agent* (GA 25 septembre 2025).
[^10]: S. Peng, E. Kalliamvakou et al., *The Impact of AI on Developer Productivity: Evidence from GitHub Copilot*, février 2023, https://arxiv.org/abs/2302.06590 (greenfield, IC95 % [21 %, 89 %], p = 0,0017).
[^11]: METR, *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity*, 10 juillet 2025, https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ (16 devs, 246 tâches, repos > 1 M lignes ; −19 % observé vs +24 % anticipé).
[^12]: METR, *We are changing our developer productivity experiment design*, 24 février 2026, https://metr.org/blog/2026-02-24-uplift-update/.
[^13]: Anthropic, *Stripe deploys Claude Code to 1,370 engineers* (claude.com/customers/stripe) ; *Block — Claude case study* ; *How Anthropic teams use Claude Code*. Données auto-déclarées.
[^14]: Stack Overflow, *Developer Survey 2025 — AI section*, décembre 2025, https://survey.stackoverflow.co/2025/ai ; DORA, *DORA Report 2025*, https://dora.dev/dora-report-2025/ (*« AI is an amplifier »*).
