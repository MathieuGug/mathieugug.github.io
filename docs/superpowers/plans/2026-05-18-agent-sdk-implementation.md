# Agent SDK — dossier `agent-sdk/` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produire le dossier `agent-sdk/` (rapport.md + app.html + 8 SVG nouveaux + 3 emprunts) à partir du workshop Thariq Shihipar, suivant le design dans `docs/superpowers/specs/2026-05-18-agent-sdk-design.md`.

**Architecture:** Étude moyenne 10 sections. Trois assets éditoriaux (rapport.md, app.html, hub index.html) + 8 SVG schémas nouveaux + 3 SVG empruntés à `harness-agentique/`, `coding-agents/`, `fabrique-agent/`. Production sur branche `claude/agent-sdk-2026-05-18`, livraison via PR (MCP GitHub).

**Tech Stack:** HTML/CSS/JS vanille · SVG inline · bibliothèque partagée `/assets/dossier-app.{js,css}` · `tools/seo_dossiers.py` pour OG + SEO · Playwright MCP pour audit mobile · MCP GitHub pour PR.

---

## File Structure

**Nouveaux fichiers :**
```
agent-sdk/
├── index.html                                       # hub (1 carte unique vers l'app)
├── 20260518-agent-sdk-rapport.md                    # rapport canonique
├── 20260518-agent-sdk-app.html                      # app illustrée interactive
├── og.png                                           # 1200×630, généré par tools/seo_dossiers.py
└── images/
    ├── 20260518-01-evolution-agents.svg
    ├── 20260518-02-anatomie-claude-code.svg
    ├── 20260518-03-cc-vs-sdk.svg
    ├── 20260518-04-trois-voies.svg
    ├── 20260518-05-pokeapi-variantes.svg
    ├── 20260518-06-bash-funnel.svg
    ├── 20260518-07-matrice-tools-bash-codegen.svg
    ├── 20260518-08-agent-loop.svg
    ├── ref-harness-7-couches.svg              # copie de harness-agentique/images/20260429-01-anatomie-harness.svg
    ├── ref-coding-agents-anatomie.svg         # copie de coding-agents/images/20260512-02-anatomie.svg
    └── ref-gruyere-suisse.svg                 # copie de fabrique-agent/images/20260515-08-gruyere-suisse.svg
```

**Fichiers modifiés :**
- `index.html` (racine) : ajout d'une tuile `agent-sdk/` dans la grille `#series`.

---

## Task 1: Setup branche + dossiers + SVG empruntés

**Files:**
- Create: `agent-sdk/` (dossier)
- Create: `agent-sdk/images/` (dossier)
- Create: `agent-sdk/images/ref-harness-7-couches.svg` (copie)
- Create: `agent-sdk/images/ref-coding-agents-anatomie.svg` (copie)
- Create: `agent-sdk/images/ref-gruyere-suisse.svg` (copie)

- [ ] **Step 1: Créer la branche dédiée**

```bash
git checkout main
git pull origin main
git checkout -b claude/agent-sdk-2026-05-18
```

Expected: `Switched to a new branch 'claude/agent-sdk-2026-05-18'`.

- [ ] **Step 2: Créer le dossier `agent-sdk/` et le sous-dossier `images/`**

```bash
mkdir -p agent-sdk/images
```

- [ ] **Step 3: Copier les 3 SVG empruntés depuis les dossiers connexes**

```bash
cp harness-agentique/images/20260429-01-anatomie-harness.svg agent-sdk/images/ref-harness-7-couches.svg
cp coding-agents/images/20260512-02-anatomie.svg agent-sdk/images/ref-coding-agents-anatomie.svg
cp fabrique-agent/images/20260515-08-gruyere-suisse.svg agent-sdk/images/ref-gruyere-suisse.svg
ls agent-sdk/images/
```

Expected: les 3 fichiers `ref-*.svg` listés.

- [ ] **Step 4: Premier commit (squelette du dossier)**

```bash
git add agent-sdk/
git commit -m "$(cat <<'EOF'
agent-sdk: setup dossier + emprunt SVG des dossiers connexes (harness-agentique, coding-agents, fabrique-agent)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Sourcing — récupérer les pages Anthropic publiques

**Files:**
- Aucune création. Notes en RAM pour Task 3.

- [ ] **Step 1: WebFetch sur la page Agent SDK Anthropic**

Run: `WebFetch` sur `https://docs.claude.com/en/api/agent-sdk` (ou l'URL la plus à jour de la documentation Agent SDK). Extraire :
- Liste des features (subagents, hooks, skills, permissions, MCP)
- Différences avec Claude Code mentionnées explicitement
- Exemples de code (CLI, wrap API)

Expected: ≥ 1 page récupérée, notes structurées.

- [ ] **Step 2: WebFetch sur la référence Claude Code**

Run: `WebFetch` sur `https://docs.claude.com/en/docs/claude-code` (overview). Extraire :
- Définition de Claude Code comme produit
- Mention des skills, hooks, slash commands

- [ ] **Step 3: WebFetch sur l'essai Aakash Gupta « 2025 was agents, 2026 is agent harnesses »**

Run: `WebFetch` sur l'URL de l'essai (cherchable via la citation déjà présente dans `harness-agentique/20260429-harness-agentique-rapport.md`). Récupérer l'extrait pertinent pour ouverture du rapport.

Expected: 1 citation sourcée + URL canonique.

- [ ] **Step 4: WebFetch sur la page « bash is all you need » (workshop ou blog Anthropic)**

Run: `WebFetch` pour confirmer la thèse — soit page de blog Anthropic, soit transcription officielle du workshop si publiée. Sinon, on cite la transcription `anatomie/docs/Claude Code + Agent SDK.md` directement.

- [ ] **Step 5: Pas de commit cette tâche** — sourcing uniquement, notes RAM.

---

## Task 3: Rédaction du rapport.md (en un seul jet pour cohérence narrative)

**Files:**
- Create: `agent-sdk/20260518-agent-sdk-rapport.md`

- [ ] **Step 1: Écrire le frontmatter + synthèse exec + § 1-3**

Contenu à produire (extrait pour le sub-agent — voir spec pour le détail complet) :

```markdown
---
title: Claude Code et l'Agent SDK
subtitle: Un produit, un SDK, trois voies pour builder son agent
date: 2026-05-18
author: Mathieu Guglielmino
---

# Claude Code et l'Agent SDK

> *Un produit, un SDK, trois voies pour builder son agent.* — Mathieu Guglielmino, 18 mai 2026

## Synthèse exécutive

- **Claude Code est un produit utilisateur. L'Agent SDK est le même harness exposé comme librairie.** [...]
- **Trois voies pour builder un agent en 2026 : API brute, Agent SDK, extension de Claude Code.** [...]
- **Bash est l'outil universel.** [...]
- **L'agent loop reste invariant : Gather → Act → Verify.** [...]
- **Skills, hooks et filesystem sont les trois leviers de fiabilité déterministe.** [...]

## 1. Du prompt au harness — la bascule 2026
[Texte ~600-800 mots. Évolution LLM features → workflows → agents. Définition Shihipar. Position dans la série mathieugug.github.io. Cite Aakash Gupta.]

![Évolution LLM features → workflows → agents|1200](images/20260518-01-evolution-agents.svg)

*Schéma 1 — La bascule 2026 : du single-shot au harness autonome.*

## 2. Le harness, vu par Anthropic
[Texte ~700-900 mots. Anatomie Claude Code : modèle, tools, prompts, filesystem, skills, subagents, memory, hooks, permissions, context compaction. Insister sur filesystem comme substrat. Mentionner CLAUDE.md.]

![Anatomie du harness Claude Code|1200](images/20260518-02-anatomie-claude-code.svg)

*Schéma 2 — Le harness packagé : un noyau (modèle) entouré de 9 satellites.*

![Pour la version 7 couches industrielles, voir le dossier Harness agentiques|1200](images/ref-harness-7-couches.svg)

*Schéma 2bis — Repris du dossier [*Harness agentiques*](../harness-agentique/) : les 7 couches industrielles d'un harness orientées production.*

## 3. Claude Code vs Claude Agent SDK
[Texte ~600-800 mots. Cœur de la question : produit vs librairie. Ce qu'on hérite/perd. Pourquoi Anthropic a extrait le SDK.]

![Claude Code et Agent SDK — même harness, deux enveloppes|1200](images/20260518-03-cc-vs-sdk.svg)

*Schéma 3 — Inversion produit ↔ SDK.*
```

Continue le markdown jusqu'à la fin du § 3.

- [ ] **Step 2: Écrire § 4-7 (le cœur builder)**

```markdown
## 4. Trois voies pour builder un agent — le pivot décisionnel
[Texte ~800-1000 mots. Voie 1 API brute, Voie 2 SDK, Voie 3 Claude Code. Pour chacune : exemple, contrôle, effort. Tableau récapitulatif en figcaption.]

![Curseur effort × contrôle — trois voies de build|1200](images/20260518-04-trois-voies.svg)

*Schéma 4 — Trois voies positionnées sur les axes effort × contrôle. Le sweet spot dépend de votre cas.*

## 5. Créer une CLI ou wrapper une API — le geste concret
[Texte ~800-1000 mots. PokéAPI 3 variantes. Note de transposition : « remplacez PokéAPI par votre API métier interne — REST, GraphQL, ou SDK existant. La leçon reste la même ». Variantes A (codegen pur), B (tools déclarés), C (codegen + bash dans Agent SDK).]

![Trois variantes pour wrapper une API — codegen / tools / Agent SDK|1200](images/20260518-05-pokeapi-variantes.svg)

*Schéma 5 — Pour le même output, trois architectures. Qui code, qui exécute, où vit l'état.*

![Panorama complet des coding agents — voir coding-agents|1200](images/ref-coding-agents-anatomie.svg)

*Schéma 5bis — Repris du dossier [*Coding agents*](../coding-agents/) : panorama de Claude Code, Cursor, Aider, Devin.*

## 6. Bash is all you need — la thèse
[Texte ~600-800 mots. Pourquoi bash a généralisé Claude Code aux non-devs. Scénario email rideshare. Composabilité Unix primitives. Citation Shihipar : « bash became the first true code mode ».]

![Sans bash / avec bash — funnel email|1200](images/20260518-06-bash-funnel.svg)

*Schéma 6 — Bash transforme un agent d'« input → réponse approximative » en « extraction → vérification → réponse traçable ».*

## 7. Tools vs Bash vs Codegen — la matrice
[Texte ~600-800 mots. Pros/cons par famille. Quand utiliser quoi. Exemples concrets.]

![Matrice Tools / Bash / Codegen|1200](images/20260518-07-matrice-tools-bash-codegen.svg)

*Schéma 7 — Trois paradigmes, trois zones de pertinence.*
```

- [ ] **Step 3: Écrire § 8-10 + footnotes**

```markdown
## 8. L'agent loop — Gather → Act → Verify
[Texte ~600-800 mots. Le cœur invariant. Pourquoi verification est facile pour code, difficile pour research. Hooks comme rattrapage déterministe. Exemple « always read before write ».]

![Agent loop Gather → Act → Verify avec hooks|1200](images/20260518-08-agent-loop.svg)

*Schéma 8 — La boucle qui sous-tend tous les agents fiables. Les hooks interceptent quand le modèle saute une étape.*

## 9. Production — local vs sandbox, sécurité multicouches
[Texte ~500-700 mots. Extract logic du prototype → deploy local OU sandbox managé (Cloudflare/Modal/E2B/Daytona). Swiss cheese : alignement modèle + harness controls + sandbox. RBAC via clés scopées et proxies. Pas de RBAC via prompt.]

![Swiss cheese de sécurité — repris du dossier Fabrique d'un agent|1200](images/ref-gruyere-suisse.svg)

*Schéma 9 — Repris du dossier [*La fabrique d'un agent*](../fabrique-agent/) : trois couches imparfaites qui composent ensemble une défense robuste.*

## 10. Quand utiliser quoi — synthèse décisionnelle
[Tableau HTML stylé : ligne par cas d'usage, colonnes (voie recommandée, mélange Tools/Bash/Codegen, attention particulière). 8-10 lignes : assistant interne, wrap API métier, agent multi-tenant, workflow GitHub, agent SRE, agent research, automation Slack, etc.]

## Sources
1. Thariq Shihipar, *Workshop Claude Code + Agent SDK*, Anthropic, mai 2026 — transcription `anatomie/docs/Claude Code + Agent SDK.md`.
2. Anthropic, *Claude Agent SDK reference*, `https://docs.claude.com/en/api/agent-sdk`, consulté 2026-05-18.
3. Anthropic, *Claude Code documentation*, `https://docs.claude.com/en/docs/claude-code`, consulté 2026-05-18.
4. Aakash Gupta, *2025 was agents, 2026 is agent harnesses*, janvier 2026 — cité aussi dans le dossier *Harness agentiques* (2026-04-29).

## Notes
- Format co-écrit avec l'aide d'une IA.
- Le workshop original est de Thariq Shihipar (Anthropic). Le rapport reformule, contextualise et illustre.
- Voir aussi : *Harness agentiques* (anatomie industrielle 7 couches), *Coding agents* (panorama produits), *La fabrique d'un agent* (organisation d'équipe).
```

- [ ] **Step 4: Validation manuelle du rapport**

Vérifications à faire manuellement (ou via sub-agent reviewer) :
- Cohérence du ton (Mathieu Guglielmino à titre personnel, ni client interne ni mention Lincoln dans le corps)
- Phrases-clés marquées `==texte==` pour le wash orange (syntaxe Obsidian → `<mark>`) — au moins 1 par section principale
- Footnotes propres
- Pas de redite manifeste avec `harness-agentique/` (skim rapide : si on retrouve les phrases sur 6 modèles à 1,3 point, à reformuler ou retirer)
- Mention de transposition pour PokéAPI présente
- Disclosure IA présente

- [ ] **Step 5: Commit**

```bash
git add agent-sdk/20260518-agent-sdk-rapport.md
git commit -m "$(cat <<'EOF'
agent-sdk: rapport.md complet (10 sections + synthèse exec + sources)

Reformulation et contextualisation du workshop Thariq Shihipar (Anthropic, 18 mai 2026) sur l'Agent SDK et Claude Code. Trois voies de build, thèse bash-is-all-you-need, loop Gather/Act/Verify.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: SVG schéma 1 — Évolution LLM features → workflows → agents

**Files:**
- Create: `agent-sdk/images/20260518-01-evolution-agents.svg`

- [ ] **Step 1: Designer le schéma**

Concept : timeline horizontale 3 colonnes verticales.

- **Colonne 1 — LLM features** (2020-2023) : icône single-shot, exemples (classify, summarize, label), rôle du dev (« structure prompt + parse output »), unité = token.
- **Colonne 2 — Workflows** (2023-2025) : icône pipeline, exemples (RAG, indexing + retrieval, structured chains), rôle du dev (« structure pipeline + retrieval »), unité = étape.
- **Colonne 3 — Agents** (2025+) : icône loop, exemples (Claude Code, autonomy 10+ min), rôle du dev (« structure environment + verification »), unité = trajectoire.

Sous les colonnes : phrase Shihipar « build their own context, decide their own trajectories ».

ViewBox ~1080 × 580.

- [ ] **Step 2: Écrire le SVG complet**

Respect strict de la convention typo coding-agents :
- Title : Fraunces 28pt 600 weight, letter-spacing -0.01em
- Subtitle : Fraunces 18pt italic
- Body label : Inter 15pt 500
- Annotation : Inter 13pt
- Caption : Inter 12pt italic
- Numeric : JetBrains Mono 15pt 500
- Schema marker : `SCHÉMA 01` Mono 12pt 600 letter-spacing 0.16em couleur `#b8582e`

Palette : `--bg #faf6ec`, `--accent #b8582e`, `--ink #1e1e2a`, `--ink-mid #6b6f7c`, `--carmine #a83e55`.

Écrire le `<svg>` complet (~150-300 lignes).

- [ ] **Step 3: Valider XML**

Run: `python -c "import xml.etree.ElementTree as ET; ET.parse('agent-sdk/images/20260518-01-evolution-agents.svg'); print('OK')"`
Expected: `OK`. Si erreur d'entité, échapper `&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;` dans tous les textes et attributs.

- [ ] **Step 4: Commit**

```bash
git add agent-sdk/images/20260518-01-evolution-agents.svg
git commit -m "agent-sdk: SVG schéma 1 — évolution LLM features → workflows → agents

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: SVG schéma 2 — Anatomie du harness Claude Code

**Files:**
- Create: `agent-sdk/images/20260518-02-anatomie-claude-code.svg`

- [ ] **Step 1: Designer le schéma**

Concept : rosace / orbite. Au centre un cercle « MODÈLE CLAUDE ». Autour, 9 satellites disposés à 360° / 9 ≈ 40° d'écart :
1. Tools (bash, file edit, grep)
2. Filesystem (CLAUDE.md, scripts, fichiers d'état)
3. Skills (skills folder, progressive context disclosure)
4. Subagents (Agent tool, parallel dispatch)
5. Memory (memory tool, files-as-memory)
6. Hooks (deterministic interception)
7. Permissions (sandbox, RBAC)
8. Prompts (system + behavioral)
9. Context compaction

Chaque satellite : un petit cercle + label + 1 ligne d'annotation (la fonction).

Flèches bidirectionnelles entre modèle et satellites (montrent la communication).

**ATTENTION** (CLAUDE.md règle SVG) : les flèches partent du périmètre du cercle modèle, pas du centre. Formule : pour un cercle (cx, cy, r) vers (tx, ty), start = (cx + r*dx/L, cy + r*dy/L). Laisser ~12-18px de blanc entre la pointe de la flèche et le bord du satellite cible.

ViewBox ~1080 × 720.

- [ ] **Step 2: Écrire le SVG complet**

Respect strict de la convention typo + palette (cf. Task 4 step 2).

- [ ] **Step 3: Valider XML**

Run: `python -c "import xml.etree.ElementTree as ET; ET.parse('agent-sdk/images/20260518-02-anatomie-claude-code.svg'); print('OK')"`

- [ ] **Step 4: Commit**

```bash
git add agent-sdk/images/20260518-02-anatomie-claude-code.svg
git commit -m "agent-sdk: SVG schéma 2 — anatomie Claude Code (modèle + 9 satellites)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: SVG schéma 3 — Claude Code vs Agent SDK

**Files:**
- Create: `agent-sdk/images/20260518-03-cc-vs-sdk.svg`

- [ ] **Step 1: Designer le schéma**

Concept : 2 panneaux miroirs côte-à-côte avec un bloc central commun.

- **Panneau gauche** : Claude Code (l'utilisateur tape dans le terminal → harness → sortie texte/code). Flux : utilisateur (icône stick figure) → invite → harness → output terminal. Label « Produit utilisateur ».
- **Bloc central** : LE HARNESS (encadré épais avec composants listés en mini : modèle, tools, skills, hooks, memory, fs).
- **Panneau droit** : Agent SDK (votre code TS/Python instancie un Agent → même harness → sortie programmable). Flux : votre code → `new Agent({})` → harness → output (JSON, fichiers, side effects). Label « Librairie pour produit custom ».

Sous le tout : phrase « Le harness est identique. Ce qui change, c'est l'enveloppe et le consommateur. »

ViewBox ~1080 × 640.

- [ ] **Step 2: Écrire le SVG complet** (avec convention typo coding-agents)

- [ ] **Step 3: Valider XML**

- [ ] **Step 4: Commit**

```bash
git add agent-sdk/images/20260518-03-cc-vs-sdk.svg
git commit -m "agent-sdk: SVG schéma 3 — Claude Code vs Agent SDK (même harness, deux enveloppes)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: SVG schéma 4 — Trois voies de build

**Files:**
- Create: `agent-sdk/images/20260518-04-trois-voies.svg`

- [ ] **Step 1: Designer le schéma**

Concept : graphique scatter axe X (effort de build : bas → haut) × axe Y (contrôle du produit final : bas → haut).

Trois points positionnés :
- **Voie 1 — API brute** : effort haut, contrôle max. Annotation « Vous écrivez le loop, vous écrivez les tools, vous gérez l'état. »
- **Voie 2 — Agent SDK** : effort moyen, contrôle élevé. Annotation « Vous héritez du harness, vous gardez l'UI et les tools métier. »
- **Voie 3 — Claude Code** : effort bas, contrôle limité (vous restez dans la skin Claude Code). Annotation « Skills + CLAUDE.md + slash commands. »

Petit bloc à droite ou en bas : « 1 use-case typique par voie » (interne support / SaaS multi-tenant / triage GitHub).

ViewBox ~1080 × 640.

- [ ] **Step 2: Écrire le SVG complet**

- [ ] **Step 3: Valider XML**

- [ ] **Step 4: Commit**

```bash
git add agent-sdk/images/20260518-04-trois-voies.svg
git commit -m "agent-sdk: SVG schéma 4 — trois voies de build (effort × contrôle)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: SVG schéma 5 — PokéAPI trois variantes

**Files:**
- Create: `agent-sdk/images/20260518-05-pokeapi-variantes.svg`

- [ ] **Step 1: Designer le schéma**

Concept : 3 colonnes verticales, mêmes lignes pour comparaison directe.

Lignes (toutes les variantes parlent du même output : « lister les Pokémon Gen 2 type eau ») :
- Variante (titre)
- Qui code (humain / agent / mix)
- Qui exécute (humain / harness / sandbox)
- Où vit l'état (mémoire de chat / fichiers / DB)
- Latence relative (☆ / ☆☆ / ☆☆☆)
- Cas d'usage typique

Colonnes :
- A — Codegen pur dans Claude Code
- B — Tools déclarés en Messages API
- C — Codegen + bash + hooks dans Agent SDK

ViewBox ~1080 × 720.

- [ ] **Step 2: Écrire le SVG complet**

- [ ] **Step 3: Valider XML**

- [ ] **Step 4: Commit**

```bash
git add agent-sdk/images/20260518-05-pokeapi-variantes.svg
git commit -m "agent-sdk: SVG schéma 5 — PokéAPI trois variantes (codegen / tools / Agent SDK)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: SVG schéma 6 — Bash funnel email

**Files:**
- Create: `agent-sdk/images/20260518-06-bash-funnel.svg`

- [ ] **Step 1: Designer le schéma**

Concept : 2 branches verticales pour la même requête (« combien j'ai dépensé en rideshare cette semaine ? »).

- **Branche haute — Sans bash** : input → modèle ingère 500 emails → contexte saturé (couleur warning) → réponse approximative ou hallucinée. Annotation « 500 emails × ~200 tokens = 100k tokens en contexte ».
- **Branche basse — Avec bash** : input → modèle écrit `gmail-search > emails.json` → `jq '.[]|select(.from|contains("uber"))' emails.json` → `awk '{sum+=$1} END {print sum}'` → réponse précise et traçable. Annotation « 5 commandes, résultat vérifiable, tokens minimaux ».

Petit encart en bas : « Bash transforme un raisonnement en pipeline auditable. »

ViewBox ~1080 × 720.

- [ ] **Step 2: Écrire le SVG complet**

- [ ] **Step 3: Valider XML**

- [ ] **Step 4: Commit**

```bash
git add agent-sdk/images/20260518-06-bash-funnel.svg
git commit -m "agent-sdk: SVG schéma 6 — bash funnel (sans/avec bash sur use-case email rideshare)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: SVG schéma 7 — Matrice Tools / Bash / Codegen

**Files:**
- Create: `agent-sdk/images/20260518-07-matrice-tools-bash-codegen.svg`

- [ ] **Step 1: Designer le schéma**

Concept : triangle ou tableau 3 colonnes × N lignes. Choix : tableau pour lisibilité.

Colonnes : Tools | Bash | Codegen.

Lignes :
- Fiabilité (★★★ / ★★ / ★)
- Composabilité (★ / ★★★ / ★★)
- Coût contexte (★★★ haut / ★ bas / ★★ moyen)
- Latence (★ / ★ / ★★★)
- Discoverability (★★★ / ★★ / ★★★)
- Cas typiques (envoyer un email ; rm/grep/lint ; data analysis)

Sous le tableau : phrase « Aucun paradigme ne gagne sur tout. La fiabilité commerciale combine les trois. »

ViewBox ~1080 × 680.

- [ ] **Step 2: Écrire le SVG complet**

- [ ] **Step 3: Valider XML**

- [ ] **Step 4: Commit**

```bash
git add agent-sdk/images/20260518-07-matrice-tools-bash-codegen.svg
git commit -m "agent-sdk: SVG schéma 7 — matrice Tools/Bash/Codegen

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: SVG schéma 8 — Agent loop avec hooks

**Files:**
- Create: `agent-sdk/images/20260518-08-agent-loop.svg`

- [ ] **Step 1: Designer le schéma**

Concept : boucle circulaire 3 étapes (Gather Context → Take Action → Verify Work → retour).

Pour chaque étape :
- Label central
- 3 outils typiques en orbite courte (Gather : grep, fetch, read | Act : bash, codegen, tools | Verify : lint, tests, citations)

Filaments hooks au-dessus de la boucle : flèches « hooks » qui interceptent et injectent du feedback déterministe avant l'étape suivante (par exemple « always read script before write »).

Au centre du cercle : « LE LOOP » avec sous-titre « gather → act → verify ».

ViewBox ~1080 × 720.

- [ ] **Step 2: Écrire le SVG complet**

- [ ] **Step 3: Valider XML**

- [ ] **Step 4: Commit**

```bash
git add agent-sdk/images/20260518-08-agent-loop.svg
git commit -m "agent-sdk: SVG schéma 8 — agent loop Gather/Act/Verify avec hooks

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 12: Validation XML systématique de TOUS les SVG du dossier

**Files:**
- Aucune création. Vérification.

- [ ] **Step 1: Parser XML sur les 11 SVG**

```bash
for f in agent-sdk/images/*.svg; do
  python -c "import xml.etree.ElementTree as ET; ET.parse('$f'); print('OK: $f')" || echo "FAIL: $f"
done
```

Expected: 11 lignes `OK:`. Si une ligne `FAIL:`, corriger l'entité ou la balise mal close avant de continuer.

- [ ] **Step 2: Audit `font-size < 11pt`** (la convention coding-agents impose ≥ 11pt sur les schémas)

```bash
grep -lE 'font-size="(\b[1-9]\b|10)"' agent-sdk/images/*.svg
```

Expected: aucune ligne (sauf pour les 3 SVG empruntés `ref-*.svg` qui peuvent avoir leur propre convention — on les laisse tels quels).

- [ ] **Step 3: Pas de commit** — vérification uniquement.

---

## Task 13: App.html — construire l'app interactive

**Files:**
- Create: `agent-sdk/20260518-agent-sdk-app.html`

- [ ] **Step 1: Récupérer le template de référence**

Lire `coding-agents/20260512-coding-agents-app.html` comme référence (app récente, conforme à la lib partagée `/assets/dossier-app.{js,css}`). Identifier :
- Structure `<header class="site">` + `.layout` (grid TOC + main + Sources)
- Topbar 3 items
- Zoom overlay + modal-root templates
- Variables CSS locales

- [ ] **Step 2: Écrire le squelette HTML**

- `<head>` :
  - Meta charset, viewport, theme-color
  - Bloc SEO entre `<!-- og:start -->` / `<!-- og:end -->` (sera regénéré par `tools/seo_dossiers.py`)
  - `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`
  - Google Fonts (Fraunces / Inter / JetBrains Mono)
  - `<link rel="stylesheet" href="/assets/dossier-app.css">`
  - Variables CSS locales (`:root { --paper, --paper-2, --ink, --ink-mid, --carmine, --rule, --accent, --mono, --serif }`)
  - Styles spécifiques (typo body, code block, table mobile, mark wash, full-bleed figure)

- `<body>` :
  - Topbar (3 items : Mathieu / dossier-context vide pour l'instant — sera injecté par `tools/add_topbar_dossier_title.py` / Hub / Accueil)
  - `<div class="layout">` avec `<nav id="toc">` + `<main><article id="report">` + `<aside id="sources">`
  - `<div id="zoom-overlay">` + `<div id="modal-root">`

- À la fin :
  - Inline `<script>` avec `const SCHEMAS = {…}` (8 schémas, chacun avec ses cartes interactives) + `const SOURCES = [...]`
  - `<script src="/assets/dossier-app.js" defer></script>`

- [ ] **Step 3: Migrer le contenu du rapport.md en HTML**

Pour chaque section du rapport :
- Convertir `## Titre` → `<section><h2 id="..."><a class="link">¶</a> Titre</h2>`
- Convertir le texte avec `==xxx==` → `<mark>xxx</mark>`
- Convertir `![alt](path.svg)` → `<figure class="figure" data-schema-id="schema-1"><svg>...</svg><figcaption>...</figcaption></figure>` avec le SVG inliné
- Convertir les footnotes en `<sup class="cite" data-cite="N">[N]</sup>`
- Convertir le bloc `<table>` dans § 10 en HTML stylé

- [ ] **Step 4: Construire la TOC (nav#toc)**

10 entrées (1 par section principale du rapport) avec liens `#anchor`. Ajouter le bouton `.panel-close` en première position et le bouton de toggle mobile.

- [ ] **Step 5: Construire le panneau Sources (#sources)**

4 sources (workshop + 3 fetches Anthropic + Aakash Gupta) en `<li id="source-N">`. Ajouter `.panel-close` en première position et `#sources-collapse-btn` + `#sources-expand-btn`.

- [ ] **Step 6: Définir les SCHEMAS interactives**

Pour chaque schéma SVG, lister 3-5 cartes interactives (zones cliquables) avec `{ title, body, eyebrow }`. Exemples :
- Schéma 1 (évolution) : carte « LLM features » + carte « Workflows » + carte « Agents »
- Schéma 2 (anatomie) : 9 cartes (une par satellite)
- Schéma 4 (3 voies) : 3 cartes
- etc.

- [ ] **Step 7: Test manuel avec Playwright**

```bash
# Démarrer un serveur local
python -m http.server 8000 &
```

Puis utiliser Playwright MCP pour :
- Naviguer sur `http://localhost:8000/agent-sdk/20260518-agent-sdk-app.html`
- Vérifier que les schémas s'affichent
- Cliquer sur 2-3 zones interactives → modal s'ouvre
- Cliquer sur 1-2 citations → highlight sur la source
- Resize à 375×667 → topbar OK, panneaux collapsés, ouvrables et fermables

- [ ] **Step 8: Commit**

```bash
git add agent-sdk/20260518-agent-sdk-app.html
git commit -m "$(cat <<'EOF'
agent-sdk: app.html — version interactive du rapport

Sections, schémas zoomables, branches interactives, citations highlight, mobile-friendly. Utilise la bibliothèque partagée /assets/dossier-app.{js,css}.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: Hub index.html du dossier

**Files:**
- Create: `agent-sdk/index.html`

- [ ] **Step 1: Récupérer le template hub de référence**

Lire `fabrique-agent/index.html` (hub à 1 carte) comme référence — le format « étude moyenne » a un hub avec une seule carte vers l'app + une carte admin masquée pour le rapport.md.

- [ ] **Step 2: Écrire le hub complet**

Structure :
- `<head>` avec SEO (sera regénéré), favicon, fonts.
- Topbar 2 items (`Mathieu Guglielmino` / `← Retour aux dossiers` → `../index.html#series`).
- Hero : eyebrow `Dossier · 18 mai 2026`, titre `Claude Code et l'Agent SDK`, lede court.
- Métadonnées : auteur, date, durée de lecture estimée (~20 min).
- Grille à 1 carte visible :
  - **Carte « Lire l'étude » → app.html** (carte large, image preview, lede).
- Carte admin masquée (`class="format format--admin"`) pointant vers `20260518-agent-sdk-rapport.md` (download).
- Footer Lincoln.
- Inclure `<script src="/admin.js" defer></script>`.

- [ ] **Step 3: Test visuel**

Playwright : naviguer sur `localhost:8000/agent-sdk/`. Vérifier que le hub s'affiche, que la carte est cliquable et redirige vers l'app, que le mode admin (Ctrl+Alt+M, password `K1ng-Mathi3u`) révèle la carte du rapport.md.

- [ ] **Step 4: Commit**

```bash
git add agent-sdk/index.html
git commit -m "agent-sdk: hub index.html (1 carte vers l'app + carte admin masquée pour le rapport.md)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 15: Tuile sur l'accueil + génération OG card + injection SEO

**Files:**
- Modify: `index.html` (racine, grille `#series`)
- Create: `agent-sdk/og.png` (généré par `tools/seo_dossiers.py`)
- Modify: `agent-sdk/index.html` (bloc SEO injecté)
- Modify: `agent-sdk/20260518-agent-sdk-app.html` (bloc SEO injecté)

- [ ] **Step 1: Ajouter la tuile dans `index.html` racine**

Repérer la grille `#series` et ajouter une `<a class="serie">` pour `agent-sdk/`, en première position chronologique (la date 2026-05-18 est plus récente que tout le reste). Format de tag : `NN · 18 mai 2026` où `NN` = numéro de publication suivant (regarder le NN max actuel et incrémenter).

Champs :
- href : `agent-sdk/`
- date : `2026-05-18`
- numéro : suivant (à déterminer en lisant `index.html`)
- titre : « Claude Code et l'Agent SDK »
- lede : « Un produit, un SDK, trois voies pour builder son agent. »
- badge : `Dossier`

- [ ] **Step 2: Run `tools/seo_dossiers.py --only agent-sdk`**

```bash
python tools/seo_dossiers.py --only agent-sdk
```

Expected:
- `agent-sdk/og.png` créé (1200×630)
- Bloc SEO injecté dans `agent-sdk/index.html` (entre `<!-- og:start -->` / `<!-- og:end -->`)
- Bloc SEO injecté dans `agent-sdk/20260518-agent-sdk-app.html`

- [ ] **Step 3: Vérifier les og.png**

Ouvrir `agent-sdk/og.png` dans un viewer, vérifier que le titre s'affiche, qu'il y a l'accent sur un mot-clé, et le monogramme MG en bas à droite.

- [ ] **Step 4: Commit**

```bash
git add index.html agent-sdk/og.png agent-sdk/index.html agent-sdk/20260518-agent-sdk-app.html
git commit -m "agent-sdk: tuile racine + OG card + injection SEO

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 16: Audit mobile + Playwright spot-check + audit anti-redite

**Files:**
- Aucune création. Vérifications.

- [ ] **Step 1: Audit mobile manuel sur les 7 points CLAUDE.md**

Pour `agent-sdk/index.html` ET `agent-sdk/20260518-agent-sdk-app.html` :
1. `overflow-x: hidden` sur `html, body` — vérifier dans le CSS
2. Topbar adaptée < 560px et < 380px
3. App `header.site` + `main#report` : typo mobile dans le `@media (max-width: 1024px)`
4. Schémas SVG : `width: 100%; height: auto; max-width: 100%` + bouton de zoom
5. Sidebars : `panel-close` + handler `keydown` Escape
6. `<pre>` et `<code>` : règles overflow-wrap dans `@media (max-width: 1024px)`
7. `<table>` : règles `display: block; overflow-x: auto` dans le même media query

Si un point manque, l'ajouter et re-commit dans Task 13 ou 14.

- [ ] **Step 2: Playwright spot-check à 3 résolutions**

```bash
# Serveur local toujours actif (Task 13 step 7)
```

Avec Playwright MCP :
- 1440×900 (desktop) : layout 3 colonnes, sidebars visibles, schémas à pleine largeur
- 768×1024 (tablet) : layout 1 colonne, sidebars collapsées, schémas pleine largeur
- 375×667 (iPhone SE) : topbar avec dossier-context masqué, panneaux collapsables, schémas avec bouton zoom, scrollable

Vérifier qu'il n'y a pas de scroll horizontal involontaire.

- [ ] **Step 3: Audit anti-redite avec les dossiers existants**

```bash
# Récupérer les phrases-clés du rapport et les chercher dans les autres dossiers
grep -F "SWE-bench Verified" agent-sdk/20260518-agent-sdk-rapport.md harness-agentique/*.md
grep -F "harness" agent-sdk/20260518-agent-sdk-rapport.md | head -5
grep -F "bash" agent-sdk/20260518-agent-sdk-rapport.md | head -5
```

Si des phrases ou statistiques sont reprises mot-pour-mot d'un autre dossier, soit on reformule, soit on ajoute un « repris du dossier X ».

- [ ] **Step 4: Pas de commit** — audit uniquement.

---

## Task 17: Diff review + push branche + PR via MCP GitHub

**Files:**
- Aucune création. Workflow git.

- [ ] **Step 1: `git log` et `git status`**

```bash
git log --oneline main..HEAD
git status
```

Expected: ~13-15 commits sur la branche, aucun fichier non commit.

- [ ] **Step 2: Review du diff complet vs main**

```bash
git diff main..HEAD --stat
git diff main..HEAD -- index.html
```

Vérifier qu'il n'y a pas :
- de fichier `.claude/` accidentellement commité
- de contenu hors scope (autre dossier modifié sans raison)
- de mention client interne ou Lincoln dans les corps de texte (footer OK)

- [ ] **Step 3: Push de la branche**

```bash
git push -u origin claude/agent-sdk-2026-05-18
```

Expected: branche poussée vers origin.

- [ ] **Step 4: Ouvrir la PR via MCP GitHub**

Utiliser `mcp__github__create_pull_request` :
- owner : `mathieugug` (casse minuscule, cf. CLAUDE.md)
- repo : `mathieugug.github.io`
- head : `claude/agent-sdk-2026-05-18`
- base : `main`
- title : « agent-sdk : dossier Claude Code et l'Agent SDK »
- body : Summary (3 puces : nouveau dossier, schémas, cross-links) + Test plan (ouvrir hub, ouvrir app, mode admin, mobile spot-check)

- [ ] **Step 5: Retourner l'URL de la PR**

Communiquer l'URL au user dans la réponse finale. Ne PAS merger automatiquement — Mathieu merge à la main.

---

## Self-Review checklist (à exécuter après écriture du plan)

- [x] Spec coverage : toutes les sections du spec (10 sections du rapport + 8 SVG + 3 emprunts + hub + tuile + SEO + audit) sont mappées à une tâche.
- [x] Placeholder scan : pas de TBD/TODO. Les sections du rapport sont décrites par paragraphe contenu attendu, pas juste « écrire la section ».
- [x] Type consistency : noms de fichiers cohérents partout (`20260518-XX-...`), même slug `agent-sdk` partout.
- [x] Convention typo coding-agents +2pt rappelée dans la première tâche SVG, sera réappliquée dans chacune.
- [x] Pas de redite avec dossiers existants explicitement vérifiée en Task 16 step 3.

## Notes de production

- **Sub-agents en parallèle** : Tasks 4-11 (les 8 SVG) peuvent être dispatchées à 8 sub-agents en parallèle après la Task 3 (rapport). Chacun produit son SVG indépendamment.
- **Sub-agent reviewer** : recommandé pour Task 3 step 4 (validation du rapport) et Task 13 step 7 (test Playwright app.html).
- **Risque tooling** : `tools/seo_dossiers.py` peut échouer si la tuile racine n'a pas été correctement ajoutée — vérifier que `index.html` parse bien la nouvelle `<a class="serie">` en lisant le code de l'outil avant Task 15.
- **Risque cohérence** : si Task 3 (rapport) écrit des phrases déjà présentes dans `harness-agentique/` (cf. statistiques SWE-bench), reformuler immédiatement.
