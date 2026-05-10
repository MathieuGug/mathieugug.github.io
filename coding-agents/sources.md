# Sources — coding-agents

Working file. Compilé en Phase 2 (recherche), intégré au rapport en Phase 4.
Ne pas publier tel quel — supprimé en Phase 10.

**Vigilance** : certaines données 2026 (pricing, releases datées avril-mai 2026) sont extrapolées à partir de pages vivantes capturées le 2026-05-10. Les chiffres précis (ex. Pro 100 lancé 9 avril 2026, GPT-5.5 top model 23 avril 2026) sont à vérifier en navigation client avant publication. Les dates 2025 sont solides.

---

## I. Documentation officielle

### A. Claude Code (Anthropic)

#### 1. Extend Claude with skills
- **URL** : `https://code.claude.com/docs/en/skills`
- **Auteur / éditeur** : Anthropic
- **Date** : non daté, accédé 2026-05-10
- **Sujet** : skills, sub-agents (interaction)
- **Résumé** :
  - Skill = dossier `<nom>/` contenant `SKILL.md` (frontmatter YAML : `description`, `allowed-tools`, `disable-model-invocation`, `context: fork`, `agent`, `paths`) + corps markdown d'instructions ; les fichiers de support (scripts, templates) sont chargés à la demande.
  - Quatre emplacements par priorité décroissante : enterprise (managed) > personnel (`~/.claude/skills/`) > projet (`.claude/skills/`) > plugin (`<plugin>/skills/`). Skills d'un plugin namespacées `plugin-name:skill-name`.
  - Invocation double : matching automatique via `description`, ou `/<nom-skill>` par l'utilisateur. `disable-model-invocation: true` réserve à l'utilisateur ; `user-invocable: false` cache du menu `/`.
  - Conformité au standard ouvert **Agent Skills** (agentskills.io) — interopérable. Détection live des changements (pas de redémarrage nécessaire).
- **Citation** : *« Skills extend what Claude can do. Create a SKILL.md file with instructions, and Claude adds it to its toolkit. »*

#### 2. Automate workflows with hooks
- **URL** : `https://code.claude.com/docs/en/hooks-guide`
- **Date** : non daté, accédé 2026-05-10
- **Résumé** :
  - Hooks = commandes shell **déterministes** déclenchées à des points fixes du cycle de vie. Garantis vs jugement LLM.
  - Configuration dans `settings.json` (user / projet / local) sous clé `hooks` : événement + commande shell + matcher.
  - Événements : `PreToolUse` (peut bloquer via exit non-zéro), `PostToolUse` (formatage / lint), `Notification`, `Stop`, `SessionStart`, `InstructionsLoaded`.
  - Cas d'usage : Prettier/Black auto au PostToolUse Edit, blocage `rm -rf` au PreToolUse Bash, audit log de toutes les actions.
  - **Sécurité** : permissions complètes user, sans sandbox. Utiliser `$CLAUDE_PROJECT_DIR` pour fiabiliser les chemins.
- **Citation** : *« Hooks provide deterministic control over Claude Code's behavior, ensuring certain actions always happen rather than relying on the LLM to choose to run them. »*

#### 3. Create custom subagents
- **URL** : `https://code.claude.com/docs/en/sub-agents`
- **Résumé** :
  - Sub-agent = assistant spécialisé avec **fenêtre de contexte propre**, system prompt dédié, accès tools restreint, permissions indépendantes ; renvoie un résumé au thread principal.
  - Built-in : `Explore` (read-only), `Plan` (mode plan), `general-purpose`, `statusline-setup`, Claude Code Guide.
  - Custom : fichier markdown `.claude/agents/` (projet) ou `~/.claude/agents/` (user), frontmatter (`name`, `description`, `tools`, `model`) + system prompt. Création via `/agents`.
  - Bénéfices : préservation contexte, contraintes via tool restrictions, réutilisation cross-projects, contrôle coûts (router vers Haiku).
- **Citation** : *« Each subagent runs in its own context window with a custom system prompt, specific tool access, and independent permissions. »*

#### 4. Connect Claude Code to tools via MCP
- **URL** : `https://code.claude.com/docs/en/mcp`
- **Résumé** :
  - Configuration via CLI `claude mcp add <name> <command>` ou édition de `~/.claude.json` (user) / `.mcp.json` (projet, partageable git).
  - Trois transports : `stdio` (commande locale, npx), `sse` (HTTP SSE), `http` (streamable HTTP). Variable `MCP_TIMEOUT`.
  - Registry officiel `api.anthropic.com/mcp-registry`. Serveurs populaires : GitHub, Filesystem, Postgres, Slack, Linear, Sentry, Notion.
  - **Tool Search** : feature built-in qui charge dynamiquement les définitions de tools, **réduit la consommation contextuelle de ~72k → ~8.7k tokens (-85 %)**. Active automatiquement >10 % du context window. Requiert Sonnet 4 ou Opus 4.

#### 5. Choose a permission mode
- **URL** : `https://code.claude.com/docs/en/permission-modes`
- **Résumé** :
  - Six modes : `default` (lectures auto, prompts pour le reste), `acceptEdits` (édits + filesystem auto), `plan` (read-only proposant un plan), `auto` (classifier IA review chaque action — Sonnet/Opus 4.6+), `dontAsk` (CI, refuse non-pré-approuvé), `bypassPermissions` (pour conteneurs isolés).
  - Switch : `Shift+Tab` cycle, ou `--permission-mode`, ou `permissions.defaultMode` settings.
  - **Protected paths** jamais auto-approuvés (sauf bypass) : `.git`, `.vscode`, `.idea`, `.claude` (sauf sous-dossiers `commands/`, `agents/`, `skills/`, `worktrees/`), shell rcs, `.mcp.json`, `.claude.json`.
  - Allowlist par tool granulaire `permissions.allow / deny / ask` : `Bash(npm test)`, `Skill(commit)`, `Skill(deploy *)`. Layers user/project/local/managed merges.
- **Citation** : *« In every mode except bypassPermissions, writes to protected paths are never auto-approved, guarding repository state and Claude's own configuration against accidental corruption. »*

#### 6. How Claude remembers your project (CLAUDE.md)
- **URL** : `https://code.claude.com/docs/en/memory`
- **Résumé** :
  - Quatre scopes hiérarchisés : `./CLAUDE.md` (projet, partagé git) > `~/.claude/CLAUDE.md` (user) > Managed policy > `./CLAUDE.local.md` (gitignored). **Tous concaténés**, pas d'override.
  - Imports `@path/to/file` (relatifs/absolus, jusqu'à 5 niveaux). Approbation requise au premier import externe.
  - **Taille recommandée : <200 lignes par fichier**. Au-delà : scoper avec `.claude/rules/*.md` (frontmatter `paths:` glob).
  - Auto memory : Claude écrit ses notes sous `~/.claude/projects/<project>/memory/MEMORY.md`, premières 200 lignes / 25 KB chargées par session.
- **Citation** : *« Project-root CLAUDE.md survives compaction: after /compact, Claude re-reads it from disk and re-injects it into the session. »*

#### 7. Donating MCP and establishing the Agentic AI Foundation
- **URL** : `https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation`
- **Date** : 9 décembre 2025
- **Résumé** :
  - Anthropic donne MCP à l'**Agentic AI Foundation (AAIF)**, sous Linux Foundation, co-fondée avec Block et OpenAI.
  - Soutiens : Google, Microsoft, AWS, Cloudflare, Bloomberg (Platinum membres).
  - Métriques d'écosystème : ~97 M téléchargements SDK mensuels, >10 000 serveurs MCP publics actifs. Support natif dans ChatGPT, Claude, Cursor, Gemini, Microsoft Copilot, VS Code.
  - Trois projets fondateurs AAIF : MCP (Anthropic), goose (Block), AGENTS.md (OpenAI).
- **Citation** : *« MCP remains a neutral, open standard. »*

#### 8. Model Context Protocol — landing
- **URL** : `https://modelcontextprotocol.io/`
- **Résumé** :
  - Standard open-source pour connecter applications IA à systèmes externes (data, tools, workflows).
  - Analogie officielle : *« MCP is like a USB-C port for AI applications »*.
  - Architecture client/serveur : un client (Claude Code, Claude Desktop, ChatGPT, Cursor…) parle à un ou plusieurs serveurs MCP qui exposent ressources, tools et prompts.

### B. Codex CLI (OpenAI)

#### 9. Introducing Codex (annonce GA)
- **URL** : `https://openai.com/index/introducing-codex/`
- **Date** : 16 avril 2025 (annonce initiale Codex CLI)
- **Résumé** :
  - Lancement public Codex CLI le 16 avril 2025 : *« lightweight, open source coding agent that runs locally in your terminal »*.
  - Open source Apache-2.0, dépôt `openai/codex`.
  - Programme de subventions 1 M$ en crédits API (blocs 25 000 $).
  - Modèles : intégration progressive `o3` et `o4-mini` ; depuis, GPT-5-Codex (sept. 2025), GPT-5.3-Codex.
  - Capacités : édition fichiers, exécution commandes, support inputs visuels (captures, croquis).
- **Citation** : *« a minimal, transparent interface to link models directly with code and tasks. »*

#### 10. GitHub openai/codex
- **URL** : `https://github.com/openai/codex`
- **Résumé** :
  - *« Lightweight coding agent that runs in your terminal »*.
  - **Codebase 96 % Rust** (réécriture annoncée fin juin 2025) — initialement TypeScript/Node.js, déprécié au profit de Rust pour latence GC, plus de dépendance Node v22+, déploiements air-gapped.
  - Métriques au 2026-05-10 : 81,6k stars, 11,8k forks, 780 releases, 6 345 commits.
  - Distribution : npm `@openai/codex`, Homebrew `brew install --cask codex`, binaires macOS/Linux/Windows.
  - Auth : sign-in ChatGPT (Plus/Pro/Business/Edu/Enterprise) ou clé API ; supporte AWS Bedrock depuis 0.130.

#### 11. Codex CLI documentation (page de référence)
- **URL** : `https://developers.openai.com/codex/cli`
- **Résumé** :
  - Définition : *« Codex CLI is OpenAI's coding agent that you can run locally from your terminal. It can read, change, and run code on your machine in the selected directory. »*
  - *« Open source »* et *« built in Rust for speed and efficiency »*.
  - Capacités : sessions interactives TUI, switching modèles, pièces jointes visuelles, génération d'images CLI, code review par agent séparé avant commit, web search, mode `exec` pour scripting, intégration MCP.
  - Inclus dans tous les plans payants ChatGPT.

#### 12. Sandboxing — Codex Concepts
- **URL** : `https://developers.openai.com/codex/concepts/sandboxing`
- **Résumé** :
  - **Approche platform-native, pas de container universel** : *« Codex uses platform-native enforcement on each OS. »*
  - **macOS** : *« sandbox-exec out of the box using Seatbelt framework »*.
  - **Linux/WSL2** : `bubblewrap` (`bwrap`) en user namespace isolation, à installer manuellement.
  - **Windows natif** : Windows Sandbox ou bascule WSL2.
  - Trois modes : `read-only`, `workspace-write` (défaut), `danger-full-access`.
  - **Différence clé vs Claude Code** : Claude Code = système d'**approbations** (chaque commande passe par un prompt user, pas de sandbox OS) ; Codex CLI ajoute une **isolation OS-niveau** par-dessus.
- **Citation** : *« Codex uses platform-native enforcement on each OS. »*

#### 13. Agent approvals & security (Codex)
- **URL** : `https://developers.openai.com/codex/agent-approvals-security`
- **Résumé** :
  - Trois sandbox modes : `workspace-write` (défaut, **réseau désactivé**, paths protégés `.git`, `.agents`, `.codex`), `read-only`, `danger-full-access` (`--yolo`).
  - Quatre approval policies orthogonales : `on-request` (défaut), `untrusted` (auto-exec uniquement les commandes connues sûres), `never`, `auto_review` (agent reviewer évalue exfiltration/credentials).
  - Profils nommés réutilisables : `:read-only`, `:workspace`, `:danger-no-sandbox`, ou personnalisés via `[permissions.<name>.filesystem]`.

#### 14. Codex Configuration Reference (config.toml)
- **URL** : `https://developers.openai.com/codex/config-reference`
- **Résumé** :
  - Fichier user : `~/.codex/config.toml` ; project-scoped : `.codex/config.toml` (uniquement si projet « trusted »).
  - Champs racine : `model`, `sandbox_mode`, `approval_policy`, `default_permissions`.
  - **Profils nommés** : `[profiles.<name>]` peut surcharger n'importe quel champ — bascule rapide via `--profile`.
  - **MCP servers** : `[mcp_servers.<id>]`, soit `command` (stdio), soit `url` (streamable HTTP avec bearer/OAuth).

#### 15. MCP — Codex
- **URL** : `https://developers.openai.com/codex/mcp`
- **Résumé** :
  - MCP supporté en CLI et extension IDE.
  - Deux types serveurs : **stdio** (process local), **streamable HTTP** (URL distante, bearer/OAuth).
  - Gestion via sous-commande `codex mcp` (add, list, remove) ou édition `config.toml`.
  - **Comparaison Claude Code** : Anthropic a introduit MCP en novembre 2024, Claude Code l'a intégré dès ses premières releases début 2025 ; côté OpenAI, MCP a été ajouté à Codex CLI courant 2025 et **promu en runtime de premier rang en mai 2026** (release 0.130.0). Parité fonctionnelle aujourd'hui, Claude Code reste l'implémentation de référence et la plus ancienne.

### C. GitHub Copilot

#### 16. The agent awakens
- **URL** : `https://github.blog/news-insights/product-news/github-copilot-the-agent-awakens/`
- **Auteur** : Thomas Dohmke (CEO GitHub)
- **Date** : 6 février 2025
- **Résumé** :
  - Annonce du virage agentique : agent mode, Copilot Edits GA dans VS Code, preview de **Project Padawan** (futur agent autonome assignable à une issue).
  - Agent mode itère seul, détecte/corrige ses erreurs, propose commandes terminal, infère tâches non explicitement demandées.
  - Copilot Edits = édition multi-fichiers en langage naturel avec revue inline.
- **Citation** : *« infer additional tasks that were not specified, but are also necessary. »*

#### 17. Vibe coding with GitHub Copilot — agent mode et MCP rolling out
- **URL** : `https://github.blog/news-insights/product-news/github-copilot-agent-mode-activated/`
- **Date** : 4 avril 2025
- **Résumé** :
  - Agent mode déployé à tous les utilisateurs VS Code stable (v1.99+).
  - Édition multi-fichiers, exécution commandes terminal, analyse erreurs runtime auto-correctrice.
  - **56 % de réussite sur SWE-bench Verified** avec Claude 3.7 Sonnet.
  - **MCP en public preview** avec un serveur MCP GitHub open source (recherche repo, gestion issues, PR). Décrit comme *« a USB port for intelligence »*.
  - Modèles supportés : Claude 3.5/3.7 Sonnet, Gemini 2.0 Flash, GPT-4o.
  - Introduit le plan **Pro+** à 39 $/mois (1500 premium requests).

#### 18. Meet the new coding agent
- **URL** : `https://github.blog/news-insights/product-news/github-copilot-meet-the-new-coding-agent/`
- **Date** : 19 mai 2025 (annonce Microsoft Build)
- **GA** : 25 septembre 2025 (`https://github.blog/changelog/2025-09-25-copilot-coding-agent-is-now-generally-available/`)
- **Résumé** :
  - Lancement du **coding agent asynchrone** : on assigne une issue à Copilot ou on l'invoque depuis VS Code, l'agent travaille dans un environnement GitHub Actions et pousse des commits sur une PR draft.
  - Tâches couvertes : nouvelles features, bug fix, dette technique, couverture de tests, mise à jour doc.
  - Activation par admin requise sur Business / Enterprise.

#### 19. Agent HQ — any agent, any way you work
- **URL** : `https://github.blog/news-insights/company-news/welcome-home-agents/`
- **Auteur** : Kyle Daigle (GitHub Universe 2025)
- **Date** : 28 octobre 2025
- **Résumé** :
  - Agent HQ ouvre Copilot à un **écosystème multi-agents** : Anthropic, OpenAI, Google, Cognition, xAI livrables au sein de l'abonnement Copilot payant. **Codex d'OpenAI déjà dispo pour Pro+ en VS Code Insiders**.
  - **Mission Control** : tableau de bord unifié pour assigner, piloter et tracker les agents en parallèle.
  - GitHub se positionne en **plateforme d'orchestration**, pas en concurrent direct de Claude Code (qu'il intègre).
- **Citation** : *« Agents shouldn't be bolted on. They should work the way you already work. »* — Kyle Daigle.

#### 20. About Model Context Protocol (MCP) — GitHub Docs
- **URL** : `https://docs.github.com/en/copilot/concepts/context/mcp`
- **Résumé** :
  - **MCP GA dans VS Code à partir de juillet 2025** (VS Code 1.102) ; **GA dans JetBrains, Eclipse, Xcode en août 2025**.
  - Supports : MCP locaux ; MCP distants avec OAuth/PAT ; Copilot CLI ; cloud agent (config niveau repo).
  - **Politique MCP désactivée par défaut sur Business/Enterprise** — admin doit activer ; Free/Pro/Pro+ non concernés.
  - Le **GitHub MCP Registry reste en public preview** mai 2026.

---

## II. Études quantitatives

### Couple méthodologique central : METR + GitHub research

#### 21. The Impact of AI on Developer Productivity (GitHub / Microsoft Research) — l'étude des "+55 %"
- **URL papier** : `https://arxiv.org/abs/2302.06590`
- **URL blog GitHub** : `https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/`
- **Auteurs** : Sida Peng, Eirini Kalliamvakou, Peter Cihon, Mert Demirer (GitHub / Microsoft Research)
- **Date** : février 2023 (paper) / billet GitHub Blog 7 sept. 2022, mis à jour 21 mai 2024
- **Résumé** :
  - Expérience contrôlée : **95 développeurs professionnels** familiers avec JavaScript, randomisés en deux groupes (avec / sans Copilot).
  - Tâche standardisée : implémenter un **serveur HTTP en JavaScript** le plus vite possible. Soumissions auto-scorées.
  - **Résultat principal : 55,8 % plus rapide** (1h11 vs 2h41 en moyenne). p = 0,0017, IC 95 % = [21 %, 89 %].
  - Taux de complétion : 78 % (Copilot) vs 70 % (contrôle).
- **Critiques** :
  - Tâche unique, greenfield, < 3h, sans review/debug/architecture — non représentative du travail réel d'un dev senior.
  - Aucune mesure de qualité, dette technique, taux de bugs.
- **Citation** : *« developers who used GitHub Copilot completed the task significantly faster — 55 % faster than the developers who didn't use GitHub Copilot ».*

#### 22. Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity (METR)
- **URL blog** : `https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/`
- **URL papier** : `https://arxiv.org/abs/2507.09089`
- **Auteurs** : Joel Becker, Nate Rush, Elizabeth Barnes, David Rein — METR
- **Date** : 10 juillet 2025
- **Résumé** :
  - **n = 16 développeurs OSS experts** (5+ ans d'ancienneté, 1 500+ commits en moyenne), repos massifs (>22k stars, >1M LOC, ~10 ans).
  - **246 tâches réelles** (issues, features, refactos), durée moyenne ~2h, **tirage aléatoire au niveau de la tâche** AI/no-AI. Outils : majoritairement **Cursor Pro avec Claude 3.5/3.7 Sonnet**.
  - **Résultat-choc** : avec accès à l'IA, les devs sont **19 % plus lents** (et non plus rapides). Avant l'étude ils prédisaient **+24 % de speedup**, après l'étude ils estiment encore **+20 %** — **gap perception/réalité de ~39 points**.
  - Taux d'acceptation du code généré **< 44 %**. Forecasters experts prédisaient **+38–39 %** — l'écart prédiction/réalité est l'un des plus gros résultats du papier.
- **Hypothèses des auteurs** : maîtrise déjà élevée du codebase (contexte humain bat contexte IA), perte de temps en review/debug du code généré, contexte projet trop spécifique.
- **Critiques** :
  - Échantillon **non représentatif** : 16 mainteneurs OSS — ne dit rien des juniors, du code greenfield, des codebases moyennes.
  - Modèles testés (Claude 3.5/3.7 Sonnet) **antérieurs aux agents Claude Code, GPT-5, Sonnet 4.5+**.
- **Citation** : *« Developers thought they were 20 % faster with AI tools, but they were actually 19 % slower when they had access to AI than when they didn't. »*

#### 23. METR follow-up — We are Changing our Developer Productivity Experiment Design (auto-critique)
- **URL** : `https://metr.org/blog/2026-02-24-uplift-update/`
- **Date** : 24 février 2026
- **Résumé** :
  - Étude de suivi : **57 devs** (10 du panel d'origine + 47 nouveaux), **800+ tâches**, **143 repos** plus diversifiés. Indemnisation 50 $/h.
  - METR **renie partiellement le -19 %** : *« the true speedup could be much higher among the developers and tasks which are selected out of the experiment »*.
  - Biais de sélection identifiés : (1) **30 à 50 %** des devs admettent avoir retiré du panel les tâches avec gain anticipé maximal ; (2) part croissante refuse de participer parce qu'ils ne veulent plus coder sans IA ; (3) **mesure du temps cassée** sur workflows agentiques (le dev fait autre chose pendant que l'agent tourne).
- **À retenir** : -19 % est probablement une **borne haute du ralentissement** (donc borne basse du speedup réel).
- **Citation** : *« We now think the [-19 %] estimate is likely a bad proxy for the real productivity impact of AI tools on those developers. »*

#### 24. Developer Productivity With and Without GitHub Copilot — longitudinal mixed-methods
- **URL** : `https://arxiv.org/abs/2509.20353`
- **Date** : septembre 2025
- **Résumé** :
  - Suivi commit avant/après adoption Copilot dans une organisation réelle.
  - **Pas de variation statistiquement significative** sur les métriques de commit après adoption ; les devs déclarent pourtant une productivité subjective accrue.
  - Conforte les résultats Microsoft / Accenture : PR/semaine +12,9 % à +21,8 % chez Microsoft, +7,5 % à +8,7 % chez Accenture — **bien en deçà des 55 %**.

### Case studies vendor (à manier avec critique)

#### 25. Stripe deploys Claude Code to 1 370 engineers
- **URL** : `https://claude.com/customers/stripe`
- **Date** : 2025
- **Résumé** :
  - **1 370 ingénieurs** Stripe équipés via un **binaire enterprise signé** co-développé avec Anthropic (2-3 mois itérations sécurité, contournement de la chaîne npm).
  - Anecdote phare : **migration de 10 000 lignes Scala → Java en 4 jours**, estimée initialement à **10 semaines-ingénieur** (gain ~12,5x sur ce projet).
  - Mental model interne : *« un nouvel ingénieur capable, qui connaît tous les langages mais pas le contexte business ni le 'Stripe way' »*.
- **Critique** : un seul projet ponctuel comme preuve. Pas de mesure agrégée sur les 1 370 devs. Le ratio 4j vs 10 semaines est un *point estimate* fourni par l'équipe, pas un contrefactuel.
- **Citation** : *« Claude Code is pre-installed on everyone's laptop. It just works out of the box. »* — Scott MacVicar, Developer Infrastructure Lead.

#### 26. Block (Cash App, Square, Afterpay)
- **URL** : `https://claude.com/customers/block`
- **Date** : 2025
- **Résumé** :
  - **~10 000 employés**, **4 000 utilisateurs actifs Claude** (via Databricks), **15 profils métier** (pas que devs).
  - Agent maison **« goose »** branché sur Claude. *« 90 % de mes lignes de code sont écrites par goose »* (témoignage ML engineer).
  - **75 % des ingénieurs** déclarent économiser **8-10 h/semaine**. Adoption doublée en un mois, engagement +40-50 % hebdo. Cible : **30 % du temps employé** économisé via IA en 2025.
- **Critique** : auto-déclaratif (même angle mort que le panel METR). Les 75 %/8-10 h proviennent d'un sondage interne, pas d'une mesure objective. Le « 90 % de lignes » est un témoignage individuel.
- **Citation** : *« 90 % of my lines of code are now written by goose. »*

#### 27. How Anthropic teams use Claude Code (rapport interne)
- **URL** : `https://www.anthropic.com/news/how-anthropic-teams-use-claude-code`
- **PDF** : `https://www-cdn.anthropic.com/58284b19e702b49db9302d5b6f135ad8871e7658.pdf`
- **Date** : 2025
- **Résumé** :
  - *« La majorité du code Anthropic est écrit par Claude Code »* ; les devs basculent vers un rôle d'orchestrateurs.
  - Réduction du **temps de recherche/doc d'environ 80 %** (1 h → 10-20 min, self-report).
  - Investigation d'incidents prod : **10-15 min → ~5 min** (équipe Security).
  - 60 % du travail moyen utilise Claude, productivité auto-déclarée **+50 %**.
- **Critique** : auteur = vendeur. Les 80 % et 50 % sont des self-reports, exactement ce que METR a montré non fiable.
- **Citation** : *« Engineers focus on architecture, product thinking, and continuous orchestration: managing multiple agents in parallel. »*

#### 28. Palo Alto Networks (2 000 devs)
- **URL** : `https://aws.amazon.com/partners/success/palo-alto-networks-anthropic-sourcegraph/`
- **Date** : 2025
- **Résumé** :
  - **2 000 développeurs** équipés via **Sourcegraph Cody + Claude (Bedrock)**.
  - Productivité revendiquée **jusqu'à +40 %**, **moyenne +25 %** (auto-déclaratif).
- **Critique** : self-report. Le « jusqu'à 40 % » est la borne haute d'un sondage. Aucun groupe contrôle.
- **Citation** : *« Developers report productivity increases of up to 40 percent, with an average of 25 percent. »*

### Reports annuels

#### 29. DORA Report 2025 — State of AI-Assisted Software Development
- **URL** : `https://dora.dev/dora-report-2025/`
- **PDF** : `https://services.google.com/fh/files/misc/2025_state_of_ai_assisted_software_development.pdf`
- **Auteur** : DORA (Google Cloud) avec IT Revolution, GitHub, GitLab, SkillBench, Workhelix
- **Date** : septembre 2025
- **Résumé** :
  - **~5 000 répondants** + 100h+ qualitatif. Cluster analysis → **7 archétypes d'équipes**.
  - **90 %** des répondants utilisent l'IA au travail (+14 pts vs 2024). Médiane d'usage : **2h/jour**.
  - **>80 %** estiment que l'IA augmente leur productivité ; **59 %** rapportent un effet positif sur la qualité du code.
  - Confiance : 24 % « a lot/great deal » ; **30 % font peu ou pas confiance** au code IA.
  - Impact sur métriques DORA : **positive sur le throughput** (deployment frequency, lead time) ; **négative sur la stabilité** (change failure rate) sans système de contrôle robuste.
  - **90 %** des organisations ont au moins une plateforme interne ; corrélation directe entre qualité de plateforme et valeur tirée de l'IA.
- **Critique** : "amplificateur" est commode pour absoudre le tooling. Chiffres de productivité reposent sur du déclaratif.
- **Citation** : *« AI's primary role is as an amplifier, magnifying an organization's existing strengths and weaknesses. »*

#### 30. Stack Overflow Developer Survey 2025 — section AI
- **URL survey** : `https://survey.stackoverflow.co/2025/ai`
- **URL billet** : `https://stackoverflow.blog/2025/12/29/developers-remain-willing-but-reluctant-to-use-ai-the-2025-developer-survey-results-are-here/`
- **Date** : décembre 2025
- **Résumé** :
  - **48 885 répondants** ; section AI : **33 662 réponses**.
  - **84 %** utilisent ou prévoient d'utiliser un outil IA (vs 76 % en 2024). **47,1 %** d'usage quotidien (50,6 % chez les pros).
  - Outils (parmi les 8 323 utilisateurs d'agents IA, ~17 % du total) : **ChatGPT 81,7 %**, **GitHub Copilot 67,9 %**, **Gemini 47,4 %**, **Claude Code 40,8 %**.
  - IDE AI-enabled : **Cursor 17,9 %** (« plus rapide adoption d'IDE de l'histoire »), **Claude Code 10 %**, **Windsurf 5 %**.
  - LLM utilisés : GPT 81 %, **Claude Sonnet 43 %**, Gemini Flash 35 %. Claude Sonnet = **LLM le plus admiré** (derrière Gemini Reasoning) et 2e plus désiré (33 %).
  - **Confiance en l'exactitude** : 3,1 % « highly trust », **46 % distrust** ; sentiment positif tombé de 70 %+ (2023-2024) à **60 %** (2025) ; trust accuracy **40 % → 29 %**.
  - Frustration #1 : **66 %** « presque juste, mais pas tout à fait » ; 75,3 % préfèrent demander à un humain quand l'IA leur paraît douteuse.
  - **64 %** ne voient pas l'IA comme une menace pour leur job (vs 68 % en 2024).
- **Critique** : auto-sélection (audience SO, biais anti-IA possible — la plateforme perd du trafic à cause des LLMs).
- **Citation** : *« Developers remain willing but reluctant to use AI »* (titre du billet).

#### 31. Faros AI — What METR's Study Missed About AI Productivity in the Wild
- **URL** : `https://www.faros.ai/blog/lab-vs-reality-ai-productivity-study-findings`
- **Date** : 2025
- **Résumé** :
  - Sur le panel Faros : devs avec forte adoption IA traitent **+9 % de tâches/jour** et **+47 % de pull requests/jour** vs équipes faible adoption.
  - **Mais le lead time global de l'organisation ne diminue pas** : l'IA augmente le débit individuel tout en saturant les goulots aval (review, QA, déploiement).
  - Argument : METR mesure **temps par tâche** (lab-like) ; en production l'IA déplace la valeur vers **le parallélisme** (un dev pilote plusieurs agents) — non capté par METR.
- **Citation** : *« Developers are completing more work with AI, but their organizations aren't shipping faster. »*

---

## III. Voix critiques

#### 32. Simon Willison — Hallucinations in code are the least dangerous form of LLM mistakes
- **URL** : `https://simonwillison.net/2025/Mar/2/hallucinations-in-code/`
- **Date** : 2 mars 2025
- **Thèse** : Les hallucinations dans le code sont le **risque le moins dangereux** des LLM, parce que le code est immédiatement testable. La vraie menace : les bugs subtils que ni le compilateur ni les tests ne rattrapent.
- **Citation** : *« Hallucinated methods are such a tiny roadblock that when people complain about them I assume they've spent minimal time learning how to effectively use these systems. »*

#### 33. Simon Willison — Claude Skills are awesome, maybe a bigger deal than MCP
- **URL** : `https://simonwillison.net/2025/Oct/16/claude-skills/`
- **Date** : 16 octobre 2025
- **Thèse** : Aveu d'erreur : 2025 *a été* l'année des agents. Mais Claude Code est mal nommé : c'est un outil d'**automatisation générale**, pas seulement de code.
- **Citation** : *« Claude Code is, with hindsight, poorly named. It's not purely a coding tool: it's a tool for general computer automation. »*

#### 34. AI Snake Oil — AI leaderboards are no longer useful (Pareto curves)
- **URL** : `https://www.aisnakeoil.com/p/ai-leaderboards-are-no-longer-useful`
- **Auteurs** : Sayash Kapoor, Benedikt Stroebl, Arvind Narayanan
- **Date** : 30 avril 2024
- **Thèse** : Les benchmarks d'agents sont méthodologiquement cassés tant qu'ils ignorent le coût. Des baselines simples atteignent souvent l'accuracy d'agents complexes pour une fraction du prix.
- **Citation** : *« AI agent accuracy measurements that don't control for cost aren't useful. »*

#### 35. Latent Space — Claude Code: Anthropic's Agent in Your Terminal (avec Cat Wu & Boris Cherny)
- **URL** : `https://www.latent.space/p/claude-code`
- **Date** : 7 mai 2025
- **Thèse** : Chez Anthropic, Claude Code écrit ~80 % de Claude Code lui-même. Évaluation interne sur la *réduction de cycle time* et les features qui n'auraient pas été construites autrement.
- **Repères** : Boris Cherny revendique un 2× personnel (déclaratif). Coût utilisateur ~6 $/jour vs Cursor 20 $/mois — économie d'un dev agent-first fondamentalement différente.
- **Citation** : *« Claude Code writes 80 % of Claude Code. »*

#### 36. Birgitta Böckeler (ThoughtWorks) — I still care about the code
- **URL** : `https://martinfowler.com/articles/exploring-gen-ai/i-still-care-about-the-code.html`
- **Date** : 9 juillet 2025
- **Thèse** : Les LLM ne sont pas des compilateurs ni des transpilateurs — ce sont des **inférreurs probabilistes**. Utiliser de la GenAI dans le contexte software est un exercice continu d'évaluation de risque, pas une chaîne d'outils déterministe.
- **Citation** : *« Hallucinations are the core feature of LLMs. We just call it 'hallucinations' when they do something we don't want. »*

#### 37. Pragmatic Engineer — Learnings from two years of using AI tools (Orosz & Böckeler)
- **URL** : `https://newsletter.pragmaticengineer.com/p/two-years-of-using-ai`
- **Date** : juin 2025
- **Thèse** : Après deux ans, gains de vitesse réels mais **modestes** (10–15 % cycle time, *loin* des +55 %). Effets qualité plus inquiétants : code churn en hausse, refactoring en baisse, tendance à empiler du code neuf plutôt que faire évoluer l'existant.
- **Citation Böckeler** : *« You have to treat these tools like enthusiastic but overconfident teammates who need constant supervision. »*

---

## IV. Pricing snapshot (2026-05-10)

### Anthropic

| Plan | Prix (mensuel / annuel) | Inclusions clés (Claude Code) |
|---|---|---|
| Free | 0 $ | Web/iOS/desktop, MCP distants, limites strictes par session |
| Pro | 20 $ / 17 $ (annuel) | Quota partagé Claude.ai + Claude Code ; principalement Sonnet/Haiku |
| Max 5x | 100 $ | 5× quota Pro, output tokens étendus, accès Opus, deux limites hebdo |
| Max 20x | 200 $ | 20× quota Pro, priorité pic, accès Opus complet |
| Team | 25 $/seat (Std) à 125 $/seat (Premium) | 5–150 personnes, SSO, contrôles admin, audit |
| Enterprise | 20 $/seat + API (devis) | RBAC, SCIM, audit logs, Compliance API, HIPAA optionnel |

Sources : `claude.com/pricing`, `support.claude.com/en/articles/11049741-what-is-the-max-plan`

### OpenAI

| Plan | Prix mensuel | Inclusions Codex CLI |
|---|---|---|
| Free | 0 $ (avec ads) | Quotas très réduits |
| Go | 8 $ (US) | 1× référence |
| Plus | 20 $ | Quota Plus = unité de référence ; fenêtre 5h partagée locale CLI + tâches cloud + limite hebdo |
| Pro 100 | 100 $ | 5× Plus, boost promotionnel **10× Codex jusqu'au 31 mai 2026** |
| Pro 200 | 200 $ | 20× Plus, **25× Codex en promo jusqu'au 31 mai**, contexte 1M tokens |
| Team | 30 $/seat (25 $ annuel) | Quotas équivalents Plus, workspace partagé |
| Enterprise / Business | Sur devis (~60 $/seat indic.) | SSO/SAML, support dédié, conformité |

Sources : `chatgpt.com/pricing`, `chatgpt.com/codex/pricing`

### GitHub Copilot

| Plan | Prix mensuel | Inclusions agent mode |
|---|---|---|
| Free | 0 $ | 50 requêtes agent mode/chat, 50 premium req/mois, 2 000 inline suggestions |
| Pro | 10 $ | Agent mode illimité avec GPT-5 mini, 300 premium req/mois |
| Pro+ | 39 $ | Agent mode illimité tous modèles (incl. Claude Opus 4.7), 1 500 premium req/mois |
| Business | 19 $/user | Admin org, audit, SSO, agent mode disponible |
| Enterprise | 39 $/user | Codebase indexing, custom model fine-tuning, knowledge bases |

**Bascule usage-based le 1er juin 2026** : tous les plans migrent vers une allocation mensuelle de "GitHub AI Credits" calculée en tokens (input + output + cached) ; prix de plan inchangés.

Sources : `github.com/features/copilot/plans`, `github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/`

### Tableau récap inter-éditeurs

| Plan       | Anthropic                          | OpenAI                                    | GitHub Copilot                  |
|------------|------------------------------------|-------------------------------------------|---------------------------------|
| Free       | 0 $                                | 0 $ (Go 8 $/mois US)                      | 0 $ (50 premium req/mois)       |
| Standard   | Pro 20 $/mois (17 $ annuel)        | Plus 20 $/mois                            | Pro 10 $/mois                   |
| Premium    | Max 100 $ (5×) ou 200 $ (20×)      | Pro 100 (5×) ou 200 $ (20×)               | Pro+ 39 $/mois                  |
| Business   | Team 25 $/seat (20 $ annuel)       | Team 30 $/seat (25 $ annuel)              | Business 19 $/seat              |
| Enterprise | 20 $/seat + API (devis)            | Enterprise sur devis                      | Enterprise 39 $/seat            |

---

## V. Notes méthodologiques pour le rapport

### Le couple méthodologique central
- **GitHub +55 %** (#21) sur tâche jouet greenfield + 95 devs randomisés.
- **METR -19 %** (#22) sur 16 seniors OSS + tâches réelles complexes.
- **METR auto-critique fév. 2026** (#23) : -19 % est probablement une borne haute du ralentissement.
- **DORA 2025** (#29) : "amplificateur", positif sur throughput, négatif sur stability sans plateforme robuste.
- **Stack Overflow 2025** (#30) : 84 % adoption, mais **trust accuracy 40 % → 29 %**.

### Pour la critique honnête (§6.3)
Trois angles : (a) tâche jouet vs réelle ; (b) self-report vs RCT ; (c) débit individuel vs débit organisation.

### Pour la pyramide §5
- Étage **transverse** : Willison §33 (Claude Code = automatisation générale) — légitime l'élargissement.
- Étage **data quotidien** : Stack Overflow #30 (Claude Sonnet 43 % d'usage, le plus admiré).
- Étage **data expert** : METR #22 (le ralentissement chez les seniors sur code mature) — à contextualiser, pas à diaboliser.
