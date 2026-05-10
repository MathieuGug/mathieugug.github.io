# Coding agents 2026 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produire et publier le dossier illustré "Coding agents 2026 — Claude Code, Codex CLI, GitHub Copilot" sur mathieugug.github.io selon la spec `docs/superpowers/specs/2026-05-10-coding-agents-design.md`.

**Architecture:** La skill `illustrated-deep-research` produit les artefacts de fond (rapport markdown, schémas SVG, companion HTML, slideshow). Le présent repo `mathieugug.github.io` les intègre dans son écosystème de hub, topbar, SEO et tuile d'index. La production se fait dans le worktree `.claude/worktrees/coding-agents-deep-research/` (déjà créé), branche `worktree-coding-agents-deep-research`, à renommer `claude/coding-agents-dossier` avant PR.

**Tech Stack:** HTML/CSS/JS vanille, SVG inline, skill `illustrated-deep-research` (templates dans `.claude/skills/illustrated-deep-research/assets/`, references dans `.../references/`), bibliothèque partagée `/assets/dossier-app.{js,css}`, tools/ Python pour SEO et OG card.

**Spec source:** `docs/superpowers/specs/2026-05-10-coding-agents-design.md` — relire avant chaque phase.

---

## Phase 1 — Setup du dossier

### Task 1.1 : Créer la structure du dossier

**Files:**
- Create: `coding-agents/` (folder)
- Create: `coding-agents/images/` (folder)
- Create: `coding-agents/sources.md` (working file, NOT committed to main eventually — see Task 10.2)

- [ ] **Step 1.1.1** : Créer les dossiers

```bash
mkdir -p coding-agents/images
```

- [ ] **Step 1.1.2** : Créer le fichier sources.md de travail

```bash
cat > coding-agents/sources.md << 'EOF'
# Sources — coding-agents
Working file. Compilé en Phase 2, intégré au rapport en Phase 4.
Ne pas publier tel quel.

## Documentation officielle
## Études quantitatives
## Voix critiques
## Pricing 2026-05
EOF
```

- [ ] **Step 1.1.3** : Vérifier la baseline tests dossier-app

```bash
node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs
```

Expected: tous les tests passent (les apps existantes sont intactes, on n'a rien modifié dans `/assets/`).

- [ ] **Step 1.1.4** : Commit

```bash
git add coding-agents/
git commit -m "setup(coding-agents): structure dossier + sources.md de travail"
```

---

## Phase 2 — Recherche et sourcing

Sept sous-tâches **parallélisables**. Chaque sous-tâche ouvre un agent (Explore ou general-purpose) avec un brief précis. Les résultats sont compilés dans `coding-agents/sources.md`.

### Task 2.1 : Documentation officielle Claude Code

**Brief de recherche** (à passer à un agent WebSearch/WebFetch) :

> Compile les références officielles Anthropic Claude Code (mai 2026) sur :
> 1. Skills (système de modules invocables, format .md frontmatter, dossier .claude/skills/)
> 2. Hooks (pre-tool, post-tool, pre-commit, syntax dans settings.json)
> 3. Sub-agents (orchestration interne, Agent tool, subagent_type)
> 4. MCP (Model Context Protocol, integration avec Claude Code, claude.ai/mcp)
> 5. Permissions (allowlist, settings.json, modes)
> 6. CLAUDE.md (mémoire projet, hiérarchie, format)
>
> Pour chaque réf : URL, titre, date d'accès. Privilégier docs.anthropic.com, claude.ai/docs, github.com/anthropics/.

- [ ] **Step 2.1.1** : Lancer l'agent
- [ ] **Step 2.1.2** : Compiler les réfs trouvées dans `sources.md` § Documentation officielle (sous-section "Claude Code")
- [ ] **Step 2.1.3** : Vérifier que chaque URL répond (HTTP 200)

### Task 2.2 : Documentation Codex CLI

**Brief :**

> Compile les références officielles OpenAI sur **Codex CLI** (le terminal-based agent, pas Codex cloud) :
> 1. Annonce officielle (date GA, repo GitHub openai/codex)
> 2. Documentation des permissions par paliers (read/write/exec)
> 3. Sandbox et isolation (containerisation)
> 4. Configuration (.codex.toml, prompts persistants)
> 5. Comparaison faite par OpenAI eux-mêmes vs Claude Code (s'il y en a)
>
> Privilégier openai.com/blog, github.com/openai/codex, openai.com/docs.

- [ ] **Step 2.2.1** : Lancer l'agent
- [ ] **Step 2.2.2** : Compiler dans `sources.md` § "Codex CLI"

### Task 2.3 : Documentation GitHub Copilot

**Brief :**

> Compile les références officielles GitHub sur Copilot :
> 1. Évolution autocomplete → agent mode (ligne du temps 2021-2026)
> 2. Agent mode (annonce, documentation, intégration VS Code/Visual Studio)
> 3. MCP et Copilot (support, limites)
> 4. Plans Pro/Business/Enterprise (pricing 2026-05)
> 5. Roadmap publique 2026
>
> Privilégier github.blog, docs.github.com/copilot.

- [ ] **Step 2.3.1** : Lancer l'agent
- [ ] **Step 2.3.2** : Compiler dans `sources.md` § "GitHub Copilot"

### Task 2.4 : Études quantitatives — METR + Anthropic

**Brief :**

> Trouve et résume :
> 1. **METR study** sur l'impact productivité des coding agents (Claude Code en condition réelle, durées de tâches, comparaison expérimentée). URL papier, méthodologie, échantillon, résultats clés, critiques.
> 2. **Anthropic case studies** récents (2025-2026) : Block, Stripe, Atlassian, autres si dispo. Pour chacun : URL, secteur, métrique d'adoption, gain revendiqué.
>
> Privilégier metr.org, anthropic.com/case-studies, papiers arXiv.

- [ ] **Step 2.4.1** : Lancer l'agent
- [ ] **Step 2.4.2** : Compiler dans `sources.md` § Études quantitatives

### Task 2.5 : Études GitHub + DORA + Stack Overflow

**Brief :**

> Compile :
> 1. **GitHub Copilot research papers** sur la productivité (les "+55%" et leurs critiques). URL papiers, méthodologie, biais relevés.
> 2. **DORA Report 2025** (Google Cloud) : section AI/coding agents, métriques.
> 3. **Stack Overflow Developer Survey 2025/2026** : sections AI tools usage, satisfaction, adoption.
>
> Privilégier github.blog, dora.dev, survey.stackoverflow.co.

- [ ] **Step 2.5.1** : Lancer l'agent
- [ ] **Step 2.5.2** : Compiler dans `sources.md`

### Task 2.6 : Voix critiques

**Brief :**

> Compile 3-5 références critiques sur les coding agents :
> 1. **Simon Willison** : posts récents sur coding agents, claude code, productivité réelle (simonwillison.net)
> 2. **AI Snake Oil** (Narayanan / Kapoor) : critiques de "+55% productivity", articles récents.
> 3. **Latent Space podcast** : épisodes 2025-2026 sur coding agents, retex production.
> 4. Autre voix critique académique ou industrie si pertinent (Tabnine retex, Sourcegraph, etc.)
>
> Pour chacun : URL, date, citation clé (1-2 phrases).

- [ ] **Step 2.6.1** : Lancer l'agent
- [ ] **Step 2.6.2** : Compiler dans `sources.md` § Voix critiques

### Task 2.7 : Pricing pages 2026-05

**Brief :**

> Capture les pages pricing publiques de :
> 1. Anthropic (Claude Pro, Claude Max — claude.ai/pricing)
> 2. OpenAI (Plus, Pro, Team — openai.com/pricing, codex pricing si distinct)
> 3. GitHub Copilot (Pro, Business, Enterprise — github.com/features/copilot)
>
> Pour chacun : prix mensuel/annuel, ce qui est inclus en termes d'agent (limites tokens/messages/heures), date de capture (2026-05-10).

- [ ] **Step 2.7.1** : Lancer l'agent
- [ ] **Step 2.7.2** : Compiler dans `sources.md` § Pricing 2026-05

### Task 2.8 : Consolider sources.md + commit

- [ ] **Step 2.8.1** : Relire `coding-agents/sources.md` complet, vérifier ~12-15 sources, dédupliquer
- [ ] **Step 2.8.2** : Numéroter les sources (1 à N) — cet ordre sert de référence pour les `[^N]` dans le rapport
- [ ] **Step 2.8.3** : Commit

```bash
git add coding-agents/sources.md
git commit -m "research(coding-agents): compilation des sources (~15 réfs)"
```

---

## Phase 3 — Schémas SVG (8 obligatoires + 1 optionnel)

**Parallélisables.** Chaque schéma est une tâche indépendante. Lire d'abord `.claude/skills/illustrated-deep-research/references/svg-editorial-style.md` (palette, typographie, grammaire d'annotation, style éditorial vs flat infographic).

Convention nom de fichier : `coding-agents/images/20260512-NN-slug.svg` où NN = 01..09.

Palette à respecter (extraite de la palette du site) : `--bg #faf6ec`, `--accent #b8582e`, `--ink #1f1d1a`, `--graphite #545148`. Police titre : Fraunces serif. Police étiquettes : JetBrains Mono ou Inter.

**Pattern par schéma :**
1. Drafter le SVG (viewBox 1200×800 par défaut, sauf hub & spokes plus carré 1100×900, et pyramide plus haute 1200×1000)
2. Inclure un en-tête interne `<g class="svg-header">` avec eyebrow + title (rapport conventions des slideshows)
3. Pour les régions cliquables : utiliser `class="interactive"` + `data-card="card-id"` sur les groupes ou rectangles cibles
4. Vérifier le rendu (ouvrir dans le navigateur)
5. Commit

### Task 3.1 : Schéma 01 — Trois régimes

**Files:**
- Create: `coding-agents/images/20260512-01-trois-regimes.svg`

**Spec visuel:**
- 3 colonnes côte à côte : Autocomplete · Assistant IDE · Coding agent
- 4 lignes de comparaison : Contexte d'opération · Mode d'interaction · Durée d'une boucle · Type de livrable
- Accent orange sur la 3e colonne (la bascule)
- Tailles de typo : titre colonne 24px, label ligne 14px caps, contenu cellule 16px

**Cellules attendues** (à raffiner pendant la rédaction) :

|  | Autocomplete | Assistant IDE | Coding agent |
|---|---|---|---|
| Contexte | Buffer courant | Fichier ouvert | Projet entier |
| Interaction | Caret | Q/R chat | Délégation |
| Boucle | Sec | Min | 10-60 min |
| Livrable | Tokens | Fonction | PR / dossier |

- [ ] **Step 3.1.1** : Drafter le SVG
- [ ] **Step 3.1.2** : Vérifier zoom-ability (ouvrir dans navigateur, tester resize)
- [ ] **Step 3.1.3** : Commit

```bash
git add coding-agents/images/20260512-01-trois-regimes.svg
git commit -m "schema(coding-agents): 01 trois régimes — autocomplete vs IDE vs agent"
```

### Task 3.2 : Schéma 02 — Anatomie d'un coding agent

**Files:**
- Create: `coding-agents/images/20260512-02-anatomie.svg`

**Spec visuel:**
- Hub & spokes : agent au centre (cercle accent), 6 boîtes orbitales reliées
- 6 boîtes : **Contexte** (CLAUDE.md, mémoire, fichiers) · **Tools** (Read/Write/Grep/Bash + MCP) · **Skills** (modules invocables) · **Sub-agents** (orchestration parallèle) · **Hooks** (boucle automatisée) · **Permissions** (allowlist, sandboxing)
- Chaque boîte cliquable (`class="interactive" data-card="card-XX"`)
- Respect de la règle CLAUDE.md sur l'origine des flèches : depuis le périmètre du cercle central, pas le centre

**Régions cliquables et card-id :**
- `card-contexte`, `card-tools`, `card-skills`, `card-subagents`, `card-hooks`, `card-permissions`

Modal content authored en Phase 5.4 (lors de l'assemblage du SCHEMAS object).

- [ ] **Step 3.2.1** : Drafter le SVG (viewBox `0 0 1100 900`)
- [ ] **Step 3.2.2** : Vérifier flèches périmétriques (CLAUDE.md règle Partly)
- [ ] **Step 3.2.3** : Vérifier que chaque `data-card` est unique
- [ ] **Step 3.2.4** : Commit

```bash
git add coding-agents/images/20260512-02-anatomie.svg
git commit -m "schema(coding-agents): 02 anatomie — hub & spokes Claude Code"
```

### Task 3.3 : Schéma 03 — Cycle de vie d'une skill

**Files:**
- Create: `coding-agents/images/20260512-03-cycle-skill.svg`

**Spec visuel:**
- 5 étapes en cycle : (1) Création (.md frontmatter) → (2) Enregistrement (.claude/skills/ ou plugin) → (3) Invocation (mots-clés ou Skill tool) → (4) Exécution (instructions chargées) → (5) Versionnement (git, partage)
- Forme : ovale ou cercle avec flèches directionnelles
- Annotations latérales : 2 mini-exemples concrets (cas data "audit-dbt-schema" + cas transverse "synthese-pdf-5-bullets")

- [ ] **Step 3.3.1** : Drafter le SVG
- [ ] **Step 3.3.2** : Commit

```bash
git add coding-agents/images/20260512-03-cycle-skill.svg
git commit -m "schema(coding-agents): 03 cycle de vie d'une skill"
```

### Task 3.4 : Schéma 04 — Comparatif Claude Code / Codex CLI / Copilot

**Files:**
- Create: `coding-agents/images/20260512-04-comparatif.svg`

**Spec visuel:**
- Matrice 6 lignes × 3 colonnes
- Lignes : **Philosophie** · **Contexte d'opération** · **Skills** · **MCP** · **Prix mensuel** · **Sécurité / sandboxing**
- Colonnes : Claude Code · Codex CLI · Copilot
- Cellules cliquables (`data-card="cell-{outil}-{axe}"`, ex. `cell-claude-skills`)
- Code couleur : vert/orange/rouge ou pictogrammes pour densité de la fonctionnalité

**Cellules** (drafts à raffiner) :

|  | Claude Code | Codex CLI | Copilot |
|---|---|---|---|
| Philosophie | Agent CLI multimodal | Agent CLI sandbox-first | IDE-natif évolué |
| Contexte | Projet entier + mémoire | Sandbox isolée par session | Fichier ouvert + workspace |
| Skills | OUI (système 1ère classe) | Limité (prompts versionnés) | Non (extensions, pas skills) |
| MCP | OUI (natif, large ecosystem) | OUI (récent, plus limité) | Léger (preview) |
| Prix | Pro 17€ / Max 100-200€ | OpenAI Plus/Pro inclus | Pro 10$ / Business 19$ |
| Sandboxing | Permissions explicites | Sandbox forte par défaut | Token GitHub (large scope) |

- [ ] **Step 3.4.1** : Drafter le SVG (viewBox `0 0 1200 900`)
- [ ] **Step 3.4.2** : Vérifier que chaque cellule a un `data-card` unique
- [ ] **Step 3.4.3** : Commit

```bash
git add coding-agents/images/20260512-04-comparatif.svg
git commit -m "schema(coding-agents): 04 comparatif Claude/Codex/Copilot"
```

### Task 3.5 : Schéma 05 — LA PYRAMIDE des cas d'usage

**Files:**
- Create: `coding-agents/images/20260512-05-pyramide.svg`

**C'est le schéma central du dossier.** Plus de soin que les autres.

**Spec visuel:**
- Pyramide à 3 étages, chacun avec son fond légèrement teinté
- Étage bas (large) : **TRANSVERSE / TOUS** — 6 exemples : rédaction longue · slides · veille · brief client · mails complexes · recherche documentaire
- Étage milieu : **DATA QUOTIDIEN** — 5 exemples : SQL ad hoc · notebooks Jupyter · transfo CSV · dashboards (Streamlit, etc.) · scripts ponctuels
- Étage haut (étroit) : **DATA EXPERT** — 4 exemples : pipelines ETL/dbt · refacto repo · audits sécu/qualité · MLOps + tests
- Stickers/icones "outil le plus adapté" sur quelques cases (ex. Claude Code = livrable + repo, Codex CLI = sandbox PR, Copilot = IDE-natif)
- Régions cliquables sur chaque étage (`data-card="etage-transverse|quotidien|expert"`) et idéalement sur chaque case d'exemple
- Note explicite en bas : **"Les chevauchements sont assumés : un data engineer utilise aussi le bas, un consultant aussi le haut."**

- [ ] **Step 3.5.1** : Drafter le SVG (viewBox `0 0 1200 1000`)
- [ ] **Step 3.5.2** : Vérifier lisibilité mobile (rendu à 320px de large reste lisible avec zoom plein écran)
- [ ] **Step 3.5.3** : Commit

```bash
git add coding-agents/images/20260512-05-pyramide.svg
git commit -m "schema(coding-agents): 05 pyramide cas d'usage — schéma central"
```

### Task 3.6 : Schéma 06 — Gains observés

**Files:**
- Create: `coding-agents/images/20260512-06-gains.svg`

**Spec visuel:**
- Barres horizontales par tâche-type (6-8 barres)
- Tâches : Rédaction longue · Slide deck · SQL ad hoc · Notebook EDA · Refacto repo · Audit code · Pipeline ETL · Présentation client
- Pour chaque barre : avant (heures) · après (heures) · delta (%) · source (icône METR / Anthropic / retex perso)
- Légende : code couleur des sources, mention "ordres de grandeur, contextes différents"
- Pied du schéma : note critique brève "ces gains assument une revue humaine de qualité — voir §6.3"

- [ ] **Step 3.6.1** : Drafter le SVG (viewBox `0 0 1200 900`)
- [ ] **Step 3.6.2** : Vérifier que les chiffres viennent bien de Phase 2 (sources.md) ou de retex perso identifiés
- [ ] **Step 3.6.3** : Commit

```bash
git add coding-agents/images/20260512-06-gains.svg
git commit -m "schema(coding-agents): 06 gains observés (ordres de grandeur sourcés)"
```

### Task 3.7 : Schéma 07 — Coûts mensuels stratifiés

**Files:**
- Create: `coding-agents/images/20260512-07-couts.svg`

**Spec visuel:**
- Stack ou waterfall : abonnement + tokens + temps revue = TCO mensuel
- 3 colonnes (3 profils) : **Occasionnel** (~10h/mois) · **Régulier** (~40h/mois) · **Intensif** (~100h/mois)
- Chaque colonne stack : couleur 1 = abonnement, couleur 2 = surcoût tokens (cas long format), couleur 3 = temps revue valorisé (à 50€/h ou indicateur)
- Annotations : "le coût caché est presque toujours le plus gros"

- [ ] **Step 3.7.1** : Drafter le SVG (viewBox `0 0 1200 900`)
- [ ] **Step 3.7.2** : Commit

```bash
git add coding-agents/images/20260512-07-couts.svg
git commit -m "schema(coding-agents): 07 coûts mensuels stratifiés (3 profils)"
```

### Task 3.8 : Schéma 08 — Carte de décision (par où commencer)

**Files:**
- Create: `coding-agents/images/20260512-08-carte-decision.svg`

**Spec visuel:**
- Arbre de décision ou flowchart : "Vous êtes... → commencez par..."
- 4-5 portes d'entrée selon profil :
  1. Consultant / fonction support → "Synthèse PDF en 5 bullets"
  2. Data analyst → "Génération SQL ad hoc commenté"
  3. Data engineer → "Refacto d'un script Python existant"
  4. Data scientist → "Notebook EDA sur dataset connu"
  5. Manager / lead → "Rédaction de brief de specs technique"
- Pour chaque porte : Première heure / Première semaine / Premier mois (3 niveaux d'engagement)

- [ ] **Step 3.8.1** : Drafter le SVG (viewBox `0 0 1200 1000`)
- [ ] **Step 3.8.2** : Commit

```bash
git add coding-agents/images/20260512-08-carte-decision.svg
git commit -m "schema(coding-agents): 08 carte de décision par profil"
```

### Task 3.9 (optionnel) : Schéma 09 — Permissions et sandboxing

**Skip si §2.6 du rapport reste compact.** Sinon :

- Visualisation "ce que voit l'agent" : dossiers autorisés, tools whitelist, MCP servers attachés
- 3 modes côte à côte : Claude Code (permissions explicites) · Codex CLI (sandbox forte) · Copilot (token GitHub)

- [ ] **Step 3.9.1** : Décider go/no-go selon longueur §2.6
- [ ] **Step 3.9.2** (si go) : Drafter `coding-agents/images/20260512-09-permissions.svg` + commit

---

## Phase 4 — Rédaction du rapport markdown

**Files:**
- Create: `coding-agents/20260512-coding-agents-rapport.md`

**Conventions:**
- Front matter Obsidian-compatible (titre, date, byline, tags)
- Référencer les schémas via `![alt|1300](images/20260512-NN-slug.svg)` (hint largeur 1300 obligatoire — convention CLAUDE.md pour les markdowns)
- Citations `[^N]` pointant vers `## Sources` final
- Surlignage `==texte==` pour 1-2 phrases-clés par section (signature visuelle du site)
- Disclosure IA en footer
- **Aucune mention Lincoln** ; aucun client/projet interne nommé
- Cible : 9 000–12 000 mots

Une tâche par section (sequentielles, sauf §2.4-§2.7 et §3-§4 qui peuvent partir en parallèle).

### Task 4.1 : Front matter + intro

**Files:**
- Create: `coding-agents/20260512-coding-agents-rapport.md` (initial)

**Contenu attendu** (~600 mots) :
- Front matter YAML (titre, date 2026-05-12, byline Mathieu Guglielmino, tags coding-agents data-experts)
- Lede 2-3 phrases : la bascule autocomplete → agent
- "Pour qui ce dossier" : data experts ET fonctions support
- "Comment lire" : entrer par le profil (renvoi à §8 carte de décision)

- [ ] **Step 4.1.1** : Rédiger
- [ ] **Step 4.1.2** : Vérifier mots (`wc -w` cible 600 ±100)
- [ ] **Step 4.1.3** : Commit

```bash
git add coding-agents/20260512-coding-agents-rapport.md
git commit -m "draft(coding-agents): front matter + intro"
```

### Task 4.2 : §1 Définition opérationnelle

**Contenu attendu** (~800 mots) :
- §1.1 Trois choses qu'un coding agent fait (projet entier · boucle · délégation livrable)
- §1.2 Démarcation vs autocomplete, assistant IDE, chat ChatGPT
- §1.3 Renvoi à Schéma 01 : `![Trois régimes|1300](images/20260512-01-trois-regimes.svg)`
- ==phrase clé== sur "ce n'est pas un assistant plus rapide, c'est un délégué"

- [ ] **Step 4.2.1** : Rédiger
- [ ] **Step 4.2.2** : Vérifier insertion schéma 01
- [ ] **Step 4.2.3** : Commit `draft(coding-agents): §1 définition opérationnelle`

### Task 4.3 : §2.1-§2.2 Contexte + Tools

**Contenu attendu** (~1500 mots) :
- §2 ouverture : `![Anatomie|1300](images/20260512-02-anatomie.svg)`
- §2.1 Le contexte : projet entier vs IDE buffer, CLAUDE.md, mémoire, compaction. La nouveauté centrale vs ChatGPT.
- §2.2 Les tools : Read/Write/Grep/Bash + MCP. Le terminal comme contexte universel. Une note sur les **MCP servers** : ce que c'est, à quoi ça sert.

- [ ] **Step 4.3.1** : Rédiger
- [ ] **Step 4.3.2** : Insérer Schéma 02 en ouverture §2
- [ ] **Step 4.3.3** : Commit `draft(coding-agents): §2.1-§2.2 contexte + tools`

### Task 4.4 : §2.3 Skills + cycle + 2 mini-exemples

**Contenu attendu** (~1200 mots) :
- §2.3 Skills : qu'est-ce que c'est, format frontmatter `.md`, dossier `.claude/skills/`, invocation par mot-clé ou tool Skill
- Renvoi Schéma 03 : `![Cycle de vie d'une skill|1300](images/20260512-03-cycle-skill.svg)`
- Mini-exemple A (cas data) : skill `audit-dbt-schema` — frontmatter, body, instructions au modèle, comment l'invoquer ("audite le schéma dbt de ce dossier")
- Mini-exemple B (cas transverse) : skill `synthese-pdf-5-bullets` — frontmatter, body, instructions, invocation ("synthétise ce PDF en 5 bullets")
- Note : la skill devient un objet partageable, versionnable, gouvernable (≠ un prompt one-shot)

- [ ] **Step 4.4.1** : Rédiger les deux mini-exemples avec code complet (block ```yaml + ```markdown)
- [ ] **Step 4.4.2** : Vérifier insertion Schéma 03
- [ ] **Step 4.4.3** : Commit `draft(coding-agents): §2.3 skills + 2 mini-exemples (data + transverse)`

### Task 4.5 : §2.4-§2.7 Sub-agents, hooks, permissions, philosophie

**Contenu attendu** (~1200 mots) :
- §2.4 Sub-agents : orchestration interne, parallélisme, ce qui les distingue d'un sub-process (résultat synthétique vs raw output)
- §2.5 Hooks : pre-tool / post-tool / pre-commit, exemple settings.json, à quoi ça sert (gouvernance live)
- §2.6 Permissions, gouvernance, sandboxing : allowlist, modes, et différences entre les 3 outils. Schéma 09 ici si retenu.
- §2.7 Philosophie "le terminal comme contexte universel" : pourquoi le terminal et pas l'IDE, ce que ça change pour la gouvernance et le partage.

- [ ] **Step 4.5.1** : Rédiger
- [ ] **Step 4.5.2** : Décider go/no-go Schéma 09 (Task 3.9) — si dropped, supprimer la référence
- [ ] **Step 4.5.3** : Commit `draft(coding-agents): §2.4-§2.7 sub-agents, hooks, permissions, philosophie`

### Task 4.6 : §3 Codex CLI

**Contenu attendu** (~1500 mots) :
- Genèse : OpenAI Codex CLI, date GA, repo openai/codex
- Ce qui le distingue : sandboxing strict + permissions par paliers (read / write / exec). Les 3 paliers, comment ils se déclenchent.
- Comparaison directe avec Claude Code sur 1 cas concret : "refacto d'un script Python isolé". Pourquoi Codex CLI peut être plus rassurant pour un data eng en environnement réglementé.
- Quand préférer Codex CLI à Claude Code : (a) sandboxing prioritaire, (b) déjà dans l'écosystème OpenAI (Plus/Pro), (c) dossier où on ne veut pas la mémoire de projet.
- Note honnête : moins riche en skills, plus jeune en MCP.
- Renvoi à Schéma 04 (comparatif).

- [ ] **Step 4.6.1** : Rédiger
- [ ] **Step 4.6.2** : Commit `draft(coding-agents): §3 Codex CLI`

### Task 4.7 : §4 GitHub Copilot + encadré Cursor/Devin/Aider

**Contenu attendu** (~1500 mots) :
- Genèse 2021 + bascule autocomplete → agent mode (2025-2026)
- Spécificité à creuser : densité d'usage IDE-natif, intégration GitHub (issues, PR, repo). L'effet de réseau est sa force.
- Comparaison directe avec Claude Code sur 1 cas concret : "ouvrir une PR depuis une issue GitHub". Pourquoi Copilot est unbeatable pour un dev qui vit dans GitHub.
- Quand Copilot suffit : autocomplete + génération in-IDE. Quand il décroche : tâches multi-fichiers complexes hors IDE, skills versionnables.
- **Encadré "Et Cursor / Devin / Aider ?"** : 3 paragraphes courts (Cursor = IDE-fork avec agent intégré ; Devin = agent autonome cloud ambitieux mais coûteux ; Aider = pionnier open source git-first). Pourquoi hors scope. Où aller pour les voir en détail.
- Renvoi Schéma 04.

- [ ] **Step 4.7.1** : Rédiger
- [ ] **Step 4.7.2** : Commit `draft(coding-agents): §4 Copilot + encadré Cursor/Devin/Aider`

### Task 4.8 : §5 Pyramide cas d'usage

**Contenu attendu** (~1500 mots) :
- Ouverture : `![Pyramide des cas d'usage|1300](images/20260512-05-pyramide.svg)` + ==phrase clé== sur la non-hiérarchie ("le sommet n'est pas mieux, il est plus technique")
- §5.1 Étage transverse : pour chaque cas (rédaction longue, slides, veille, brief, mail, recherche), 2-3 phrases concrètes ("voilà à quoi ça ressemble", "voilà ce qu'on récupère"). 1-2 contre-cas ("ne marche pas pour", "à éviter quand").
- §5.2 Étage data quotidien : SQL ad hoc, notebooks, transfo CSV, dashboards, scripts ponctuels.
- §5.3 Étage data expert : pipelines ETL, refacto repo, audits sécu, MLOps, tests.
- Note de fin : "Les chevauchements sont assumés. Un data engineer utilise aussi le bas. Un consultant aussi le haut."

- [ ] **Step 4.8.1** : Rédiger
- [ ] **Step 4.8.2** : Vérifier que les régions cliquables du Schéma 05 sont bien adressables depuis le texte (renvois "voir [étage transverse](#52-...)")
- [ ] **Step 4.8.3** : Commit `draft(coding-agents): §5 pyramide cas d'usage`

### Task 4.9 : §6 Gains (3 retex + benchmarks + critique)

**Contenu attendu** (~1500 mots) :
- §6.1 Trois retex chiffrés
  - Retex 1 — Ce dossier-ci : delta heures (~5h vs ~25h) + delta qualité subjectif. Mention transparente "ce dossier est lui-même un cas d'usage".
  - Retex 2 — Refacto `dossier-app.js` : delta heures (~1h vs ~6h), traçable via PR #[N] et commits.
  - Retex 3 — Slide deck d'offres commerciales pour une équipe practice (anonymisé) : delta jour-/2h.
- §6.2 Benchmarks publics calibrants : METR · Anthropic case studies (Block, Stripe, Atlassian) · GitHub Copilot research · DORA · Stack Overflow Survey. Citations [^N].
- §6.3 Critique honnête : biais sélection, effet nouveauté, tâches non comparables. Citations Willison, AI Snake Oil.
- Renvoi Schéma 06.

- [ ] **Step 4.9.1** : Rédiger
- [ ] **Step 4.9.2** : Vérifier que les chiffres retex sont cohérents avec ce que dit le Schéma 06
- [ ] **Step 4.9.3** : Vérifier qu'aucun nom de client/projet interne n'apparaît
- [ ] **Step 4.9.4** : Commit `draft(coding-agents): §6 gains — retex + benchmarks + critique`

### Task 4.10 : §7 Coûts

**Contenu attendu** (~1200 mots) :
- §7.1 Abonnements (panorama 2026 daté) : tableau Claude Pro/Max, OpenAI Plus/Pro, Copilot Pro/Business. 1 phrase de commentaire par cellule.
- §7.2 Tokens : ce que coûte un dossier long format en ordres de grandeur. La place du caching.
- §7.3 Coût caché : temps de relecture/vérif/fix. Le multiplicateur réel.
- §7.4 Risques structurels : skill rot · lock-in vendor · confidentialité · souveraineté.
- Renvoi Schéma 07.

- [ ] **Step 4.10.1** : Rédiger
- [ ] **Step 4.10.2** : Tableau pricing daté visiblement "2026-05" + formule "à la date de publication"
- [ ] **Step 4.10.3** : Commit `draft(coding-agents): §7 coûts mensuels`

### Task 4.11 : §8 + Conclusion

**Contenu attendu** (~800 mots) :
- §8 Par où commencer (carte de décision) : intro + renvoi à Schéma 08
  - §8.1 Première heure : un cas trivial qui marche
  - §8.2 Première semaine : un cas régulier qui colle au vrai travail
  - §8.3 Premier mois : un cas qui change l'organisation de son temps
- Conclusion "Le bon réflexe en 2026" : pas remplacer le clavier mais déléguer un livrable. Le piège opposé : tout vouloir déléguer (retour au coût caché).
- Note finale sur la suite (autonomie longue, agent-to-agent, on-device en 2026-2027)

- [ ] **Step 4.11.1** : Rédiger
- [ ] **Step 4.11.2** : Commit `draft(coding-agents): §8 + conclusion`

### Task 4.12 : Sources, disclosure IA, relecture finale

**Contenu attendu** :
- Bloc `## Sources` final avec toutes les `[^N]` numérotées et formatées (auteur · titre · publication · URL · date d'accès 2026-05-1X)
- Bloc footer disclosure IA :

```markdown
---
*Format co-écrit avec l'aide d'une IA — et le sujet est lui-même un cas d'usage. Les ordres de grandeur de gains revendiqués ici s'appliquent à la production de ce dossier.*
```

- [ ] **Step 4.12.1** : Compiler les sources finales depuis `coding-agents/sources.md` (numérotation finale)
- [ ] **Step 4.12.2** : Vérifier `wc -w` total : cible 9 000–12 000 mots. Si <9 000, étoffer §5/§6/§7. Si >12 000, élaguer §2 (déplacer §2.4-§2.6 vers annexe ou compresser).
- [ ] **Step 4.12.3** : Vérifier qu'aucune mention "Lincoln" / "client" / projet interne nommé n'apparaît : `grep -i "lincoln\|cabinet\|practice" coding-agents/20260512-coding-agents-rapport.md` → seul le footer (s'il y a) ne doit pas en contenir non plus
- [ ] **Step 4.12.4** : Vérifier que les 8 schémas sont référencés (`grep -c '!\[' coding-agents/20260512-coding-agents-rapport.md` ≥ 8)
- [ ] **Step 4.12.5** : Vérifier les `==stabilo==` (au moins 1 par section principale)
- [ ] **Step 4.12.6** : Commit final rapport

```bash
git add coding-agents/20260512-coding-agents-rapport.md
git commit -m "draft(coding-agents): rapport complet — sources + disclosure IA"
```

---

## Phase 5 — Companion HTML interactif

Architecture imposée : utiliser le scaffold le plus récent du repo (`narrative-experiences/20260505-narrative-experiences-app.html` ou `ia-et-travail/20260504-ia-et-travail-app.html`) + `assets/build-app.py` de la skill pour swap les 3 fragments. Lire d'abord :
- `.claude/skills/illustrated-deep-research/references/companion-app.md`
- `assets/dossier-app.{js,css}` au niveau racine du repo (bibliothèque partagée)

### Task 5.1 : Cloner un scaffold récent et adapter le head/topbar

**Files:**
- Create: `coding-agents/20260512-coding-agents-app.html` (cloné depuis un app récent)

- [ ] **Step 5.1.1** : Copier `narrative-experiences/20260505-narrative-experiences-app.html` → `coding-agents/20260512-coding-agents-app.html`
- [ ] **Step 5.1.2** : Adapter `<head>` :
  - `<title>` → "Coding agents 2026 — Claude Code, Codex CLI, GitHub Copilot · Mathieu Guglielmino"
  - `<meta name="description">`
  - `<meta name="keywords">`
  - Le bloc OG sera regénéré en Phase 8 — laisser tel quel pour l'instant ou marker `<!-- og:start --> <!-- og:end -->` vide
  - `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`
- [ ] **Step 5.1.3** : Adapter `<header class="site">` h1, byline, et le lien `← Retour aux dossiers` → pointer `index.html` (hub local)
- [ ] **Step 5.1.4** : Vérifier que `<link rel="stylesheet" href="/assets/dossier-app.css">` et `<script src="/assets/dossier-app.js" defer>` sont présents
- [ ] **Step 5.1.5** : Commit

```bash
git add coding-agents/20260512-coding-agents-app.html
git commit -m "scaffold(coding-agents): clone narrative-experiences app + adapt head"
```

### Task 5.2 : Préparer les fragments pour build-app.py

**Files:**
- Create temp: `coding-agents/main-fragment.html`
- Create temp: `coding-agents/sources-fragment.html`
- Create temp: `coding-agents/schemas-fragment.js`

- [ ] **Step 5.2.1** : `main-fragment.html` — convertir le markdown du rapport en HTML inline structuré
  - Conserver la hiérarchie h1/h2/h3
  - Remplacer `==text==` par `<mark>text</mark>`
  - Remplacer `[^N]` par `<sup class="cite" data-cite="N">[N]</sup>`
  - Remplacer `![alt|1300](images/NN-slug.svg)` par `<figure class="figure" id="fig-NN"><figcaption>...</figcaption><!--INLINE-SVG:NN--></figure>`
  - Pour les jargons à tooltipper, wrapper `<span class="term" data-tooltip="définition courte">terme</span>`
- [ ] **Step 5.2.2** : `sources-fragment.html` — un `<li id="source-N">` par source, label court (`anthropic.com ↗`)
- [ ] **Step 5.2.3** : `schemas-fragment.js` — objet littéral `{ "schema-01": { "card-id": { eyebrow, title, body } }, ... }` avec modal content authored pour chaque `data-card`. **Couvrir tous les data-card** des Schémas 02 (6 spokes), 04 (18 cellules), 05 (3 étages + cases), et toute interactive autre.

- [ ] **Step 5.2.4** : Commit fragments
```bash
git add coding-agents/main-fragment.html coding-agents/sources-fragment.html coding-agents/schemas-fragment.js
git commit -m "fragments(coding-agents): main + sources + schemas pour build-app"
```

### Task 5.3 : Assembler avec build-app.py

- [ ] **Step 5.3.1** : Lancer le helper

```bash
python3 .claude/skills/illustrated-deep-research/assets/build-app.py \
  --host    coding-agents/20260512-coding-agents-app.html \
  --main    coding-agents/main-fragment.html \
  --sources coding-agents/sources-fragment.html \
  --schemas coding-agents/schemas-fragment.js \
  --images  coding-agents/images \
  --out     coding-agents/20260512-coding-agents-app.html
```

- [ ] **Step 5.3.2** : Vérifier qu'il n'y a plus de marqueurs

```bash
grep -nE '\{\{|\[SCHEMA-|\{tooltip:|<!--\s*INLINE-SVG' coding-agents/20260512-coding-agents-app.html
```

Expected: aucune sortie.

- [ ] **Step 5.3.3** : Ouvrir dans navigateur (file://) et vérifier :
  - Tous les schémas s'affichent
  - Cliquer sur les régions interactives ouvre les modals
  - Les tooltips fonctionnent
  - Le bouton zoom plein écran fonctionne sur chaque schéma
  - Les sources sont cliquables et highlight
  - Le panel close mobile fonctionne (resize la fenêtre <414px)
- [ ] **Step 5.3.4** : Commit
```bash
git add coding-agents/20260512-coding-agents-app.html
git commit -m "build(coding-agents): companion app assemblée via build-app.py"
```

### Task 5.4 : Nettoyage des fragments + tests CI

- [ ] **Step 5.4.1** : Supprimer les fragments temporaires (ils ne doivent pas être committés sur main au final)

```bash
rm coding-agents/main-fragment.html coding-agents/sources-fragment.html coding-agents/schemas-fragment.js
```

- [ ] **Step 5.4.2** : Lancer les tests CI

```bash
node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs
```

Expected: tous les tests passent. La nouvelle app est auto-détectée par le test de couverture (regex sur la présence de `<script src="/assets/dossier-app.js">`).

- [ ] **Step 5.4.3** : Si un test échoue, lire le message et corriger l'app (fragments DOM manquants)
- [ ] **Step 5.4.4** : Commit cleanup
```bash
git add -u coding-agents/
git commit -m "cleanup(coding-agents): remove temp fragments + tests pass"
```

---

## Phase 6 — Slideshow linéaire

Référence : `.claude/skills/illustrated-deep-research/references/slideshow.md` + `assets/slideshow-template.html`. Lire la **section "Quick start"** en premier (10 adaptations non-évidentes).

Référence concrète à recopier : `narrative-experiences/20260505-narrative-experiences-slideshow.html` (V1 proto, source de vérité).

### Task 6.1 : Cloner le proto slideshow

**Files:**
- Create: `coding-agents/20260512-coding-agents-slideshow.html`

- [ ] **Step 6.1.1** : Copier `narrative-experiences/20260505-narrative-experiences-slideshow.html` → `coding-agents/20260512-coding-agents-slideshow.html`
- [ ] **Step 6.1.2** : Adapter `<head>` (title, description, OG markers vides)
- [ ] **Step 6.1.3** : Adapter topbar (3 zones — pattern PR #29) avec le bon titre dossier
- [ ] **Step 6.1.4** : Commit `scaffold(coding-agents): slideshow cloné + head adapté`

### Task 6.2 : Recopier les SVGs et adapter

- [ ] **Step 6.2.1** : Copier les 8 SVGs dans `<div id="schemas" hidden>` du slideshow
- [ ] **Step 6.2.2** : Pour chaque SVG : `<rect>` background → `fill="transparent"`, header interne wrapper `<g class="svg-header">`, `viewBox` cropé `y=155` (ou `y=105` si rotated labels)
- [ ] **Step 6.2.3** : Reuser le même `SCHEMAS` et `SOURCES` que l'app (copier-coller les objets JS depuis l'app finale)
- [ ] **Step 6.2.4** : Commit `slideshow(coding-agents): SVGs intégrés + SCHEMAS reuse`

### Task 6.3 : Définir la timeline narrative

**Spec** : 10-12 scènes linéaires. Chaque scène = un schéma ou un focus modal.

Suggestion de timeline :
1. Cover : titre + lede
2. Schéma 01 — Trois régimes
3. Schéma 02 — Anatomie (focus card-skills)
4. Schéma 02 — Anatomie (focus card-tools + card-mcp)
5. Schéma 03 — Cycle d'une skill (avec mini-exemple data)
6. Schéma 04 — Comparatif (focus 1 outil = Claude Code)
7. Schéma 04 — Comparatif (focus Codex CLI + Copilot)
8. Schéma 05 — Pyramide (focus étage transverse)
9. Schéma 05 — Pyramide (focus étage data quotidien + expert)
10. Schéma 06 — Gains (avec retex)
11. Schéma 07 — Coûts
12. Schéma 08 — Carte de décision (par où commencer)
13. Cover finale : disclosure IA + sources

**Couverture obligatoire** : chaque `data-card` avec entrée SCHEMAS doit être touché en focus+modal au moins une fois en lecture linéaire (mémoire `feedback_slideshow_scene_coverage`).

- [ ] **Step 6.3.1** : Définir la timeline dans le `scenes` array du JS
- [ ] **Step 6.3.2** : Vérifier la couverture data-card : pour chaque `data-card` SVG → au moins 1 scène focus
- [ ] **Step 6.3.3** : Tester en linéaire (Page Down depuis scène 1 → fin)
- [ ] **Step 6.3.4** : Commit `slideshow(coding-agents): timeline narrative + couverture data-cards`

### Task 6.4 : Smoke test mobile + desktop

- [ ] **Step 6.4.1** : Ouvrir slideshow desktop, naviguer ←/→, S (TOC), R (sources), Esc cascade
- [ ] **Step 6.4.2** : Resize navigateur ≤414px : modal devient bottom-sheet, timeline horizontale en bas, swipe horizontal change scène
- [ ] **Step 6.4.3** : Vérifier `prefers-reduced-motion` (DevTools)
- [ ] **Step 6.4.4** : Si bug, fix puis commit

```bash
git add coding-agents/20260512-coding-agents-slideshow.html
git commit -m "slideshow(coding-agents): smoke test mobile/desktop ok"
```

---

## Phase 7 — Hub `coding-agents/index.html`

**Files:**
- Create: `coding-agents/index.html`

Pattern : reprendre `narrative-experiences/index.html` (3 formats : app + slideshow + rapport). Le rapport est en carte `format--admin` (caché par défaut, visible en mode admin).

### Task 7.1 : Cloner le pattern hub à 3 formats

- [ ] **Step 7.1.1** : Copier `narrative-experiences/index.html` → `coding-agents/index.html`
- [ ] **Step 7.1.2** : Adapter eyebrow (`OUTILS`), titre, lede, byline date 2026-05-12
- [ ] **Step 7.1.3** : Adapter les 3 cartes formats (rapport interactif, slideshow, rapport markdown admin)
- [ ] **Step 7.1.4** : Vérifier que la topbar 2-items du hub est en place (`Mathieu` + `← Retour aux dossiers`)
- [ ] **Step 7.1.5** : Vérifier `<script src="/admin.js" defer>` présent (pour révéler la carte rapport.md en mode admin)
- [ ] **Step 7.1.6** : Smoke test (ouvrir hub, cliquer chaque carte, vérifier liens fonctionnent)
- [ ] **Step 7.1.7** : Commit

```bash
git add coding-agents/index.html
git commit -m "hub(coding-agents): 3 formats — app, slideshow, rapport (admin)"
```

---

## Phase 8 — SEO + OG card

### Task 8.1 : Topbar dossier sur les pages internes

Les pages internes (app, slideshow) embarquent le pattern PR #29 (3 zones : Mathieu · titre dossier · ← Hub · Accueil).

- [ ] **Step 8.1.1** : Vérifier que `tools/add_dossier_topbar.py` couvre le slug `coding-agents`. Sinon ajouter `coding-agents/20260512-coding-agents-app.html` à la liste APPS du script.
- [ ] **Step 8.1.2** : Lancer le script

```bash
python tools/add_dossier_topbar.py
```

- [ ] **Step 8.1.3** : Lancer le script du titre dossier middle

```bash
python tools/add_topbar_dossier_title.py
```

- [ ] **Step 8.1.4** : Adapter manuellement la topbar du slideshow (le script ne couvre pas les slideshows automatiquement). Utiliser le pattern de `proces-musk-altman/scrolly` ou `narrative-experiences/...slideshow`.
- [ ] **Step 8.1.5** : Smoke test : sur l'app et le slideshow, vérifier les 3 zones de topbar (Mathieu / titre dossier / ← Hub · Accueil)
- [ ] **Step 8.1.6** : Commit

```bash
git add -u coding-agents/ tools/
git commit -m "topbar(coding-agents): pattern dossier 3 zones sur app + slideshow"
```

### Task 8.2 : Tuile sur l'index racine

Avant l'OG card, la tuile racine doit être en place — `seo_dossiers.py` parse `index.html` racine pour les métas canoniques.

- [ ] **Step 8.2.1** : Lire la grille `#series` actuelle dans `index.html` racine, trouver le numéro de publication suivant (le dernier publié est probablement 14 ou 15)

```bash
grep -n 'NN ·' index.html | head -20
```

- [ ] **Step 8.2.2** : Insérer la tuile en **tête** de la grille `#series`, juste après le header de la section. Format :

```html
<a class="serie" href="coding-agents/" data-date="2026-05-12">
  <div class="serie-meta">
    <span class="serie-tag">NN · 12 mai 2026</span>
    <span class="serie-badge">Étude</span>
  </div>
  <div class="serie-eyebrow">OUTILS</div>
  <h3 class="serie-title">Coding agents 2026 — Claude Code, Codex CLI, <mark>GitHub Copilot</mark></h3>
  <p class="serie-lede">Trois outils qui ressemblent à des copilotes mais opèrent comme des collègues. Ce qu'ils sont, comment ils marchent, et où ils paient — du livrable transverse au pipeline data critique.</p>
</a>
```

- [ ] **Step 8.2.3** : Vérifier visuellement (ouvrir `index.html` racine)
- [ ] **Step 8.2.4** : Commit

```bash
git add index.html
git commit -m "index(coding-agents): tuile en tête de la grille séries"
```

### Task 8.3 : OG card 1200×630 PNG

- [ ] **Step 8.3.1** : Lire `tools/og-card.py` pour comprendre la signature

```bash
head -80 tools/og-card.py
```

- [ ] **Step 8.3.2** : Lancer

```bash
python tools/og-card.py --slug coding-agents --eyebrow OUTILS --title "Coding agents 2026 — Claude Code, Codex CLI, GitHub Copilot" --accent-keyword "Coding agents"
```

(Si la signature diffère, adapter à l'invocation existante observée pour `narrative-experiences` ou autre dossier récent.)

- [ ] **Step 8.3.3** : Vérifier `coding-agents/og.png` existe, est en 1200×630, est lisible
- [ ] **Step 8.3.4** : Commit

```bash
git add coding-agents/og.png
git commit -m "og(coding-agents): card 1200×630 PNG"
```

### Task 8.4 : Bloc SEO via seo_dossiers.py

- [ ] **Step 8.4.1** : Lancer

```bash
python tools/seo_dossiers.py --only coding-agents
```

- [ ] **Step 8.4.2** : Vérifier que le bloc `<!-- og:start -->` … `<!-- og:end -->` est injecté/mis à jour dans :
  - `coding-agents/index.html` (hub) → JSON-LD `WebSite` / `WebPage`
  - `coding-agents/20260512-coding-agents-app.html` → JSON-LD `Article`
  - `coding-agents/20260512-coding-agents-slideshow.html` → JSON-LD `Article`

```bash
grep -c 'og:start' coding-agents/*.html
```

Expected: 1 par fichier HTML.

- [ ] **Step 8.4.3** : Vérifier 1 metadata clé : `<meta property="og:image" content="https://mathieugug.github.io/coding-agents/og.png" />`
- [ ] **Step 8.4.4** : Commit

```bash
git add coding-agents/index.html coding-agents/20260512-coding-agents-app.html coding-agents/20260512-coding-agents-slideshow.html
git commit -m "seo(coding-agents): bloc OG/Twitter/canonical/JSON-LD via seo_dossiers"
```

---

## Phase 9 — Validation finale & PR

### Task 9.1 : Validation finale checklist

Auto-check via les CLAUDE.md :

- [ ] **Step 9.1.1** : Mobile-friendliness (7 points CLAUDE.md) : ouvrir chaque page interne en DevTools mobile (320–414px), vérifier `overflow-x: hidden`, topbar adaptée, schémas <100% width, panneaux Sommaire/Sources fermables, `<pre>` scrollable horizontalement, tableaux scrollables horizontalement
- [ ] **Step 9.1.2** : Sources sidebar pinned au scroll (vérifier sur l'app, scroll-down past first viewport)
- [ ] **Step 9.1.3** : Bouton replier Sources en `position: fixed` (pas absolute) sur l'app desktop
- [ ] **Step 9.1.4** : Schémas full-bleed sur app desktop (figure casse main pour aller jusqu'aux sidebars)
- [ ] **Step 9.1.5** : Stabilo `<mark>` rendu correctement (pas de span block, dégradé bas)
- [ ] **Step 9.1.6** : Surlignage `==text==` du markdown rendu avec `<mark>`
- [ ] **Step 9.1.7** : Aucune mention Lincoln dans pages publiées :

```bash
grep -ri "lincoln" coding-agents/
```

Expected: aucune sortie (sauf éventuels artefacts de skills internes — mais aucun fichier publié).

- [ ] **Step 9.1.8** : Aucun client/projet interne nommé : relecture humaine du retex 3 §6.1
- [ ] **Step 9.1.9** : Disclosure IA présent en footer du rapport ET dans le README (s'il y en a un)

### Task 9.2 : 3 passes de relecture humaine (Mathieu)

- [ ] **Step 9.2.1** : Pass 1 — Cadrage et anatomie (Intro + §1 + §2). Le concept "coding agent" est-il clair ? Discuter et ajuster.
- [ ] **Step 9.2.2** : Pass 2 — Comparatif outils + pyramide (§3 + §4 + §5). Le dosage 70/15/15 tient-il ? La pyramide est-elle lisible ?
- [ ] **Step 9.2.3** : Pass 3 — Chiffres et carte de décision (§6 + §7 + §8 + Conclusion). Les retex sont-ils suffisamment chiffrés ? Les coûts couvrent-ils les bonnes catégories ?
- [ ] **Step 9.2.4** : Pour chaque pass : noter les ajustements demandés, créer un commit `revise(coding-agents): pass N — <résumé>`

### Task 9.3 : Renommer la branche et push

- [ ] **Step 9.3.1** : Renommer la branche locale

```bash
git branch -m worktree-coding-agents-deep-research claude/coding-agents-dossier
```

- [ ] **Step 9.3.2** : Push vers le remote

```bash
git push -u origin claude/coding-agents-dossier
```

Expected: push OK (les pushes vers `claude/...` ne sont pas bloqués, seul `main` l'est).

### Task 9.4 : Ouvrir la PR via MCP GitHub

- [ ] **Step 9.4.1** : Préparer le titre PR : `dossier(coding-agents): Claude Code, Codex CLI, GitHub Copilot — pyramide d'usage 2026`
- [ ] **Step 9.4.2** : Préparer le body :

```markdown
Dossier deep-research illustré sur les coding agents en 2026.

## Sommaire
- Anatomie d'un coding agent (Claude Code en vedette)
- Codex CLI et GitHub Copilot en bref + encadré Cursor/Devin/Aider
- Pyramide des cas d'usage (transverse / data quotidien / data expert)
- Gains (3 retex chiffrés + benchmarks publics + critique honnête)
- Coûts (abonnements, tokens, coût caché, risques structurels)
- Carte de décision par profil

## Formats
- Hub `coding-agents/index.html`
- App interactive `20260512-coding-agents-app.html`
- Slideshow linéaire `20260512-coding-agents-slideshow.html`
- Rapport markdown (admin) `20260512-coding-agents-rapport.md`
- 8 schémas SVG inline
- ~12-15 sources

## Spec et plan
- Spec : `docs/superpowers/specs/2026-05-10-coding-agents-design.md`
- Plan : `docs/superpowers/plans/2026-05-10-coding-agents.md`

## Test plan
- [ ] Ouvrir hub `coding-agents/` et naviguer vers les 3 formats
- [ ] App : vérifier zoom plein écran, modals régions, tooltips, sources sidebar
- [ ] App mobile (≤414px) : panneaux Sommaire/Sources fermables, schémas full-width
- [ ] Slideshow : navigation linéaire ←/→, hotkeys S/R/Esc, mode mobile bottom-sheet
- [ ] Tuile racine en tête de la grille `#series`
- [ ] OG preview LinkedIn / X (1200×630 PNG)
```

- [ ] **Step 9.4.3** : Créer la PR via MCP GitHub

```
mcp__github__create_pull_request:
  owner: mathieugug
  repo: mathieugug.github.io
  title: "dossier(coding-agents): Claude Code, Codex CLI, GitHub Copilot — pyramide d'usage 2026"
  head: claude/coding-agents-dossier
  base: main
  body: <le body ci-dessus>
```

- [ ] **Step 9.4.4** : Récupérer l'URL de la PR, la donner à Mathieu pour merge manuel

---

## Phase 10 — Post-merge et nettoyage

### Task 10.1 : Vérifier le déploiement GitHub Pages

- [ ] **Step 10.1.1** : Après merge par Mathieu, attendre quelques minutes
- [ ] **Step 10.1.2** : Ouvrir https://mathieugug.github.io/coding-agents/ et vérifier que le hub charge
- [ ] **Step 10.1.3** : Vérifier l'OG preview avec un outil comme opengraph.xyz ou cards-dev.twitter.com (URL https://mathieugug.github.io/coding-agents/)
- [ ] **Step 10.1.4** : Vérifier la tuile sur https://mathieugug.github.io/#series

### Task 10.2 : Nettoyage du sources.md de travail

Le fichier `coding-agents/sources.md` était un fichier de travail. Il a été utilisé pour compiler les sources finales du rapport (Phase 4.12). Il ne doit pas rester dans le dossier publié — son contenu fait doublon avec `## Sources` du rapport.md.

- [ ] **Step 10.2.1** : Sur une nouvelle branche `claude/coding-agents-cleanup`, supprimer `coding-agents/sources.md`
- [ ] **Step 10.2.2** : Push + PR + merge

### Task 10.3 : Mettre à jour le BACKLOG.md

- [ ] **Step 10.3.1** : Sur `claude/backlog-update` ou en fin de PR principale, ajouter :

```markdown
- 2026-05-12 · coding-agents · pyramide d'usage Claude Code / Codex CLI / Copilot
```

dans la section `## Déjà couverts (date · slug · angle)` du `BACKLOG.md`.

- [ ] **Step 10.3.2** : Retirer le bullet "Coding agents en production..." de la section "Sujets evergreen — backlog" (puisque maintenant couvert).
- [ ] **Step 10.3.3** : Commit + push + PR + merge

---

## Self-Review du plan

### Couverture spec

- ✅ §3 plan rapport → Tasks 4.1 à 4.12 (chaque section a sa tâche)
- ✅ §4 schémas → Tasks 3.1 à 3.9 (8 obligatoires + 1 optionnel)
- ✅ §5 sources → Phase 2 complète + Task 4.12.1 (compilation finale)
- ✅ §6 modalités production → Phase 1 (worktree), Phase 7-8 (hub, SEO), Phase 9 (PR)
- ✅ §7 workflow relecture 3 passes → Task 9.2
- ✅ §8 risques (auto-référentiel, longueur, pricing) → Tasks 4.9 (disclosure), 4.12.2 (mots), 4.10.2 (pricing daté)
- ✅ §9 Definition of Done → Task 9.1 checklist + 9.4 PR body

### Type cohérence

- Convention noms fichiers : `20260512-coding-agents-{rapport.md|app.html|slideshow.html}` partout (pas `2026-05-12-`)
- Schémas : `images/20260512-NN-slug.svg` partout
- `data-card` : convention `card-{name}` ou `cell-{outil}-{axe}` selon schéma — explicité dans chaque task
- Disclosure IA : formulation identique entre spec et plan

### Placeholders scan

- ✅ Aucun TBD/TODO
- ✅ Tous les briefs de recherche (Phase 2) sont autonomes — un agent peut les exécuter sans contexte
- ✅ Tous les schémas (Phase 3) ont une spec visuelle assez précise pour drafter
- ✅ Toutes les sections rapport ont mots cibles + contenu attendu
- ⚠ "Trouver le numéro de publication suivant" (Task 8.2.1) reste à faire au moment de l'insertion — c'est une dépendance temporelle inévitable

---

**Plan complete.** Prochaine étape : exécution.
