# Design — dossier `agent-sdk/`

**Date** : 2026-05-18
**Slug** : `agent-sdk`
**Format** : étude moyenne (rapport.md + app.html), pas de slideshow
**Source primaire** : `anatomie/docs/Claude Code + Agent SDK.md` (workshop Thariq Shihipar, Anthropic, 18 mai 2026)
**Sources secondaires autorisées** : docs publiques Anthropic (Agent SDK reference, Claude Code reference)

## Titre & lede

**Titre** : *Claude Code et l'Agent SDK*
**Sous-titre** : *Un produit, un SDK, trois voies pour builder son agent*
**Lede** : Claude Code est un produit utilisateur. L'Agent SDK est le même harness, exposé comme librairie. Trois voies pour s'en servir — wrapper l'API brute, builder avec le SDK, étendre Claude Code — une thèse — *bash is all you need* — et une boucle Gather → Act → Verify qui tient depuis 2024.

## Angle éditorial

**Builder pratique, fidèle au workshop.** On suit le fil du workshop avec un pivot décisionnel sur les trois voies de build au milieu. Lecteur cible : dev/architecte qui veut construire un agent et hésite entre voies.

**Distinct des dossiers existants** :
- `anatomie/` reste théorique (10 couches). Ici : produit & SDK concrets.
- `harness-agentique/` parle stratégie/coûts/moat. Ici : comment Anthropic packe son harness, comment toi tu en construis un.
- `coding-agents/` panorama des coding agents. Ici : ce qu'il y a derrière Claude Code.
- `fabrique-agent/` orga d'équipe. Disjoint.

## Plan rapport.md

### Synthèse exécutive
5 puces serrées : harness comme produit packagé · bash comme universal tool · trois voies de build · loop Gather/Act/Verify · skills + hooks comme leviers déterministes.

### 1. Du prompt au harness — la bascule 2026
Recap rapide : LLM features (GPT-3 single-shot) → workflows (RAG, pipelines structurés) → agents (Claude Code, autonomie). Définition d'agent par Shihipar : *« build their own context, decide their own trajectories »*. Positionnement de ce dossier dans la série mathieugug.github.io.

**Schéma 1** — Timeline LLM features → workflows → agents. Trois colonnes verticales avec exemples typiques (classify/summarize | RAG/pipelines | Claude Code), rôle du dev (qui structure quoi), unité de raisonnement (token | étape | trajectoire).

### 2. Le harness, vu par Anthropic
Pas refaire l'anatomie des 7 couches industrielles (déjà dans `harness-agentique/`). Ici, angle « ce qu'Anthropic met dans la boîte Claude Code » : modèle, tools (file/bash/edit/grep), prompts, filesystem comme substrat, skills, subagents, memory, hooks, permissions, context compaction. Insister sur le filesystem comme **mémoire long-terme** (CLAUDE.md, fichiers d'état, scripts) et **substrat de vérification**.

**Schéma 2** — Anatomie du harness Claude Code : un noyau (modèle Claude) entouré de 9 satellites (tools, bash, filesystem, prompts, skills, subagents, memory, hooks, sandbox/permissions). Style éditorial différent du schéma harness-agentique (qui montre 7 couches verticales) : ici une rosace ou orbite circulaire pour signaler le packaging.

**Cross-link** : embedded SVG repris de `harness-agentique/images/20260429-01-anatomie-harness.svg`, figcaption « Pour la version 7 couches industrielles, voir le dossier *Harness agentiques* ».

### 3. Claude Code vs Claude Agent SDK
Le cœur de la question Mathieu. Claude Code = produit (terminal + chat + commands + skills). Agent SDK = même harness exposé comme librairie (TS/Python) pour builder autre chose. Ce qu'on hérite (harness, tools, permissions, skills, hooks). Ce qu'on perd (l'UI de Claude Code, le mode interactif). Pourquoi Anthropic a extrait le SDK : *« we kept rebuilding the same infrastructure over and over again »*.

**Schéma 3** — Diagramme 2 panneaux côte-à-côte. À gauche : Claude Code (l'utilisateur tape → harness → sortie terminal). À droite : Agent SDK (votre code TS/Python → même harness → sortie programmable). Le bloc harness est identique au milieu pour visualiser l'inversion.

### 4. Trois voies pour builder un agent *(pivot)*
Comparaison structurée :
- **Voie 1 — API brute** (Messages Completion). Vous définissez tout : tools, loop, prompts, gestion d'état. Max contrôle, max boilerplate. Exemple : le `chat.ts` du workshop avec ~5 tools Pokémon.
- **Voie 2 — Agent SDK**. Vous héritez du harness, vous gardez le contrôle sur l'UI et les tools métier. Sweet spot pour produit custom. Exemple : un agent de support client multi-tenant.
- **Voie 3 — Claude Code** (skills, CLAUDE.md, slash commands). Vous étendez un produit qui existe déjà. Min effort, max vélocité, max contrainte (vous restez dans la skin Claude Code). Exemple : un workflow GitHub de triage interne.

**Schéma 4** — Curseur 3 voies : axe X = effort de build (bas → haut), axe Y = contrôle du produit final (bas → haut). Trois points positionnés avec annotations courtes. Petit tableau en figcaption avec 1 use-case typique par voie.

**Cross-link** : embedded SVG repris de `harness-agentique/images/20260429-03-trois-couches.svg` (API/SDK/runtime managé) en complément ou alternative — à arbitrer en production.

### 5. Créer une CLI ou wrapper une API — le geste concret
Démo PokéAPI du workshop, restructurée en trois variantes du même use case (« lister les Pokémon Gen 2 type eau ») :
- **Variante A — codegen pur dans Claude Code** : « va lire les docs PokéAPI et génère-moi un SDK TypeScript ». Le harness fait. Output : `pokeapi-sdk/`, CLAUDE.md sert d'état d'agent.
- **Variante B — tools déclarés en Messages API** : on définit `getPokemon`, `getMove`, etc. comme tools. Le modèle décide quand les appeler. Plus de contrôle, mais plafonne sur le nombre d'outils gérables.
- **Variante C — codegen + bash dans un Agent SDK** : on laisse l'agent écrire et exécuter ses scripts, on garde des hooks pour valider (« read before you write »).

**Schéma 5** — Trois variantes côte-à-côte avec le même output. Colonnes : qui code (humain / agent), qui exécute (humain / harness), où vit l'état (mémoire de chat / fichiers / DB), latence relative.

**Cross-link** : référence à `coding-agents/images/20260512-02-anatomie.svg` (panorama complet des coding agents, depuis Claude Code jusqu'à Cursor/Aider/Devin).

### 6. Bash is all you need — la thèse
La punchline du workshop. Pourquoi le bash tool a généralisé Claude Code aux non-devs (finance, marketing, data scientists). Le scénario email du workshop : *« combien j'ai dépensé en rideshare cette semaine ? »* avec / sans bash. Pourquoi les Unix primitives (grep, pipe, tail, jq, ffmpeg, git) battent les tools custom pour les agents : composabilité, économie de contexte, traçabilité.

**Schéma 6** — Funnel d'usage. Branche du haut (sans bash) : 500 emails → contexte saturé → réponse approximative ou hallucinée. Branche du bas (avec bash) : grep → save to file → sum → vérifié. Annotations sur les économies de contexte (tokens) + traçabilité (fichiers persistés).

### 7. Tools vs Bash vs Codegen — la matrice
Le tableau du workshop, repris et étendu. Pour chaque famille, pros/cons/quand utiliser :
- **Tools** : structuré, fiable, cher en contexte, mauvaise composabilité → bon pour actions destructives, atomiques (envoyer un email, écrire un fichier)
- **Bash** : composable, peu de contexte, scriptable, discoverability moyenne → bon pour filesystem, search, lint, scripts réutilisables, mémoire
- **Codegen** : flexibilité max, latence max → bon pour analyses dynamiques, deep research, requêtes ad hoc, data analysis

**Schéma 7** — Triangle ou matrice 3×3. Axes : fiabilité, composabilité, contexte cost. Chaque famille positionnée + 3 exemples concrets par famille.

### 8. L'agent loop : Gather → Act → Verify
Le cœur invariant. Trois étapes. Pourquoi la verification est ce qui rend les coding agents si forts (lint, tests, compilation, type check). Pourquoi la research est plus dure (verification floue). **Hooks** comme rattrapage déterministe quand le modèle saute une étape (exemple workshop : *« always read script before writing »*).

**Schéma 8** — Loop circulaire Gather/Act/Verify avec les outils typiques par étape (grep, fetch, read | bash, codegen, tools | lint, tests, type check, citations). Filaments hooks qui interceptent au-dessus (les flèches qui injectent du feedback déterministe).

### 9. Production — local vs sandbox, sécurité
Compress version : extraire la logique du prototype Claude Code → deploy local (CLI installable, app frontend) OU sandbox managé (Cloudflare Sandbox, Modal, E2B, Daytona). Swiss cheese sécurité (alignement modèle | harness controls | sandbox env). RBAC via clés API scopées et proxies backend, pas via prompt. Pas de schéma neuf — on réembarque le gruyère.

**Cross-link** : embedded SVG repris de `fabrique-agent/images/20260515-08-gruyere-suisse.svg`, figcaption « Swiss cheese de sécurité repris du dossier *Fabrique d'un agent* (§ sécurité multicouches) ».

### 10. Quand utiliser quoi — synthèse décisionnelle
Une grille décisionnelle d'une page : votre cas d'usage tombe dans quelle voie ? Quel mélange Tools/Bash/Codegen ? Un mini-FAQ ou flowchart simple. Pas obligatoirement un schéma SVG ici — peut être un tableau HTML stylé.

## Schémas — récap

**8 nouveaux** (préfixe `20260518-01..08-`) :
1. Timeline LLM features → workflows → agents
2. Anatomie du harness Claude Code (rosace 9 satellites)
3. Claude Code vs Agent SDK (2 panneaux miroirs)
4. Trois voies de build (curseur effort × contrôle)
5. PokéAPI 3 variantes (codegen / tools / bash+codegen)
6. Funnel email avec/sans bash
7. Matrice Tools / Bash / Codegen
8. Agent loop Gather/Act/Verify avec hooks

**3 emprunts** (préfixe `ref-` pour signaler la provenance) :
- `ref-harness-7-couches.svg` ← `harness-agentique/images/20260429-01-anatomie-harness.svg`
- `ref-coding-agents-anatomie.svg` ← `coding-agents/images/20260512-02-anatomie.svg`
- `ref-gruyere-suisse.svg` ← `fabrique-agent/images/20260515-08-gruyere-suisse.svg`

Chaque emprunt accompagné d'une figcaption explicite avec lien vers le dossier d'origine.

**Anatomie** : skip explicite du user — pas de cross-link, ni visuel, ni textuel. Le dossier reste découvrable via la grille d'accueil mais n'est pas appelé dans le rapport.

## Charte visuelle

Respect CLAUDE.md :
- Police Fraunces / Inter / JetBrains Mono
- Palette `--bg #faf6ec`, `--accent #b8582e`
- Tailles typo schémas : convention coding-agents (+2pt) — title 28pt, body 15pt, annotation 13pt, mono 12pt 600
- Surlignage `<mark>` orange wash sur les phrases-clés
- Full-bleed schémas sur narratif (rapport.md), figure.figure dans l'app
- Zoom plein écran obligatoire sur tous les schémas SVG
- Mobile-friendliness 7-points
- Topbar 3 items avec dossier-context
- Bibliothèque partagée `/assets/dossier-app.{js,css}`

## Fichiers à produire

```
agent-sdk/
├── index.html                                # hub
├── 20260518-agent-sdk-rapport.md             # rapport canonique
├── 20260518-agent-sdk-app.html               # app illustrée interactive
├── og.png                                    # 1200×630 brandé
└── images/
    ├── 20260518-01-evolution-agents.svg
    ├── 20260518-02-anatomie-claude-code.svg
    ├── 20260518-03-cc-vs-sdk.svg
    ├── 20260518-04-trois-voies.svg
    ├── 20260518-05-pokeapi-variantes.svg
    ├── 20260518-06-bash-funnel.svg
    ├── 20260518-07-matrice-tools-bash-codegen.svg
    ├── 20260518-08-agent-loop.svg
    ├── ref-harness-7-couches.svg             # copie depuis harness-agentique/
    ├── ref-coding-agents-anatomie.svg        # copie depuis coding-agents/
    └── ref-gruyere-suisse.svg                # copie depuis fabrique-agent/
```

Plus mise à jour de :
- `index.html` racine : ajouter la tuile `agent-sdk/` dans la grille des séries (badge `Dossier` ou `Étude` selon préférence du jour)
- Run `python tools/seo_dossiers.py --only agent-sdk` pour générer l'`og.png` + injecter le bloc SEO

## Sortie de scope

- Pas de slideshow (étude moyenne).
- Pas de version print A4.
- Pas de scrollytelling.
- Pas de format livre interactif.
- Pas de tracker dynamique (réservé au journal Musk).

## Risques & mitigations

- **Redite avec `harness-agentique/`** : mitiger via schéma 2 visuellement distinct (rosace vs couches verticales) + cross-link explicite + angle « packaging Anthropic » vs « anatomie industrielle ».
- **Volume du workshop trop dense pour 10 sections** : prioriser fidèlement les 4 axes demandés par Mathieu (SDK vs CC / CLI / wrap API / tools). Sections 6-8 plus courtes si besoin.
- **Démo PokéAPI peu universelle** : le user moyen ne joue pas à Pokémon. Mitiger en accentuant la transposition (« remplacer PokéAPI par votre API métier interne »).
- **Cross-links visuels fatigants** : si les 3 schémas empruntés alourdissent, en garder 1-2 max et basculer les autres en simple lien texte « voir aussi ».

## Workflow de production

1. Setup branche `claude/agent-sdk-2026-05-18`
2. Mkdir + copie des SVG empruntés depuis dossiers connexes
3. Rédaction rapport.md (sections 1 → 10, avec ToC interne + footnotes)
4. Génération des 8 SVG nouveaux (un par un, validation XML systématique)
5. Génération app.html via skill illustrated-deep-research (template app-template.html)
6. Génération index.html du hub
7. Tuile dans `index.html` racine
8. `python tools/seo_dossiers.py --only agent-sdk` → og.png + SEO
9. Audit mobile-friendliness 7 points + Playwright spot-check
10. Commit + diff review + push branche + PR via MCP GitHub

## Disclosure & footer

- Mention `Format co-écrit avec l'aide d'une IA` discrète dans le rapport et l'app.
- Footer : `Mathieu Guglielmino · Practice Manager Lincoln`.
- Pas de mention client ni de projet interne.
- Le workshop est attribué à Thariq Shihipar (Anthropic) dans la première source du rapport.
