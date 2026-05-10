# Coding agents 2026 — Claude Code, Codex CLI, GitHub Copilot

**Spec rédigée le 2026-05-10 · publication cible mardi 2026-05-12 · slug `coding-agents`.**

Dossier deep research illustré pour mathieugug.github.io. Branche worktree `worktree-coding-agents-deep-research`, à renommer `claude/coding-agents-dossier` avant PR.

## 1. Intention

Produire un dossier qui décode ce qu'est un coding agent en 2026, pourquoi c'est un changement de régime de travail (et pas un nouvel autocomplete), et où ça paie concrètement — du livrable transverse (rédaction, slides, veille) au pipeline data critique. Audience prioritaire : data experts (data engineers, scientists, analysts, BI), audience secondaire : fonctions support et tâches transverses (synthèses, présentations, storytelling).

Promesse au lecteur : à la fin, **vous savez ce qu'est un coding agent, comment il fonctionne sous le capot, par quel cas d'usage commencer selon votre rôle, et combien ça coûte vraiment.**

## 2. Décisions structurantes

| Décision | Choix | Raison |
|---|---|---|
| Angle | Explainer + pyramide d'usage | Pédagogie d'abord, comparatif ensuite. Le lecteur doit comprendre avant de choisir. |
| Dosage outils | Claude Code 70% / Codex CLI 15% / GitHub Copilot 15% | Claude Code = porte d'entrée. Codex CLI et Copilot positionnés sur leurs vraies spécificités. |
| Pyramide | 3 étages par rôle (transverse · data quotidien · data expert) | Lisibilité immédiate. Les chevauchements (un data eng utilise aussi le bas, un consultant aussi le haut) sont assumés et nommés. |
| Chiffrage | Mix retex perso + benchmarks publics | Un dossier ancré (retex chiffré) ET calibré (sources tierces). Sans benchmarks, ça reste anecdotique ; sans retex, ça reste abstrait. |
| Codex | **Codex CLI** uniquement (pas Codex cloud) | Le CLI est l'analogue direct de Claude Code, donc la comparaison a du sens. |
| Cursor / Devin / Aider | Encadré dédié (pas chapitre) | Audience-le sait, mais le sujet n'est pas un panorama exhaustif. Encadré court qui les situe. |
| Longueur | 9 000 – 12 000 mots | Sujet ambitieux qui justifie la profondeur. Cible haute de la série. |
| Format | Skill `illustrated-deep-research` (md + companion HTML + slideshow + ZIP) | Standard de la série. |

## 3. Plan du rapport

```
INTRO — Pourquoi ce dossier maintenant
   La bascule "autocomplete → agent" entre 2024 et 2026.
   Pour qui (data experts ET fonctions support).
   Comment lire ce dossier (par où entrer selon profil).

§1. Coding agent : définition opérationnelle
   §1.1 Ce qu'un coding agent fait que rien ne faisait avant
        — agir sur un projet entier (vs un buffer)
        — itérer en boucle (vs un coup de complétion)
        — déléguer un livrable (vs suggérer une ligne)
   §1.2 Démarcation vs autocomplete (Copilot v1),
        assistant IDE (Tabnine, JetBrains AI), chat ChatGPT
   §1.3 Schéma 1 — "Trois régimes" (autocomplete · IDE · agent)

§2. Anatomie d'un coding agent (Claude Code en vedette)
   Schéma 2 — "Anatomie d'un coding agent" (hub & spokes)
   §2.1 Le contexte (projet entier, CLAUDE.md, mémoire,
        compaction). La vraie nouveauté vs ChatGPT.
   §2.2 Les tools (Read/Write/Grep/Bash + MCP).
        Le terminal comme contexte universel.
   §2.3 Les skills — qu'est-ce que c'est, à quoi ça sert.
        Schéma 3 — "Cycle de vie d'une skill"
        Pas-à-pas : créer une skill, deux mini-exemples
          Cas data : "auditer un schéma dbt"
          Cas transverse : "synthétiser un PDF en 5 bullets"
   §2.4 Les sub-agents (orchestration interne, parallélisme)
   §2.5 Les hooks (boucle de feedback automatisée :
        pre-commit, pre-tool, post-tool)
   §2.6 Permissions, gouvernance, sandboxing
        Schéma 9 — "Ce que voit l'agent" (optionnel)
   §2.7 Une philosophie : "le terminal comme contexte universel"

§3. Codex CLI en bref (~1 500 mots)
   Genèse (OpenAI, 2025) et positionnement.
   La spécificité à creuser : sandboxing strict + permissions
   par paliers (read / write / exec). Comparaison directe
   avec Claude Code sur 1 cas concret.
   Quand préférer Codex CLI à Claude Code.

§4. GitHub Copilot en bref (~1 500 mots)
   Genèse (2021) et bascule autocomplete → agent mode (2025).
   La spécificité à creuser : densité d'usage IDE-natif et
   intégration GitHub (issues, PR, repo) — l'effet de réseau.
   Comparaison directe avec Claude Code sur 1 cas concret.
   Quand Copilot suffit, quand il décroche.

   Schéma 4 — Comparatif Claude Code / Codex CLI / Copilot
   ENCADRÉ — "Et Cursor / Devin / Aider ?"
     · Cursor : IDE-fork avec coding agent intégré.
     · Devin : agent autonome cloud, "ingénieur AI complet".
     · Aider : pionnier open source CLI, philosophie git-first.
     Pourquoi ils sont hors scope ici, où aller pour les voir
     en détail.

§5. Pyramide des cas d'usage
   Schéma 5 — LA PYRAMIDE (schéma central, full-bleed)
   §5.1 Étage transverse / tous : rédaction longue, slides
        (cf. Gamma + Claude), veille, brief, mail, recherche,
        synthèse documentaire.
   §5.2 Étage data quotidien : SQL ad hoc, notebooks,
        transfo CSV, dashboards, scripts ponctuels.
   §5.3 Étage data expert : pipelines ETL/dbt, refacto repo,
        audits sécu/qualité, MLOps, tests.
   Pour chaque étage : 2-3 exemples mûrs + 1-2 contre-cas.
   Note explicite sur les chevauchements (un data eng
   utilise aussi le bas, un consultant aussi le haut).

§6. Gains
   Schéma 6 — "Gains observés" (barres horizontales par
   tâche-type, sources iconifiées)
   §6.1 Trois retex chiffrés
        Retex 1 — Ce dossier-ci (delta heures + qualité)
        Retex 2 — Refacto dossier-app.js (perso, 100% public,
                  traçable via git)
        Retex 3 — Slide deck d'offres commerciales pour
                  une équipe practice (pro, anonymisé,
                  delta jour-/-2-h)
   §6.2 Benchmarks publics calibrants
        — METR (étude productivité Claude Code en condition
          réelle, durée de tâches)
        — Anthropic case studies (Block, Stripe, Atlassian)
        — GitHub Copilot research (les "+55%" et leur
          critique)
        — DORA Report 2025
        — Stack Overflow Developer Survey 2025
   §6.3 Critique honnête
        — Biais de sélection (qui mesure)
        — Effet nouveauté
        — Tâches non comparables
        — Convertir "temps gagné" en valeur ?

§7. Coûts
   Schéma 7 — "Coûts mensuels stratifiés" (stack/waterfall,
   3 profils : occasionnel · régulier · intensif)
   §7.1 Abonnements (panorama 2026 : Claude Pro/Max,
        OpenAI Plus/Pro, Copilot Pro/Business). Tableau
        pricing daté 2026-05.
   §7.2 Tokens : ce que coûte un dossier long format en
        ordre de grandeur. La place du caching.
   §7.3 Coût caché : temps de relecture, de vérification,
        de fix. Le multiplicateur réel d'un agent qui
        livre vite mais peut errer.
   §7.4 Risques structurels
        — Skill rot (compétences qui s'atrophient)
        — Lock-in vendor (CLAUDE.md, .codex.toml,
          prompts versionnés)
        — Confidentialité (où vivent les tokens)
        — Souveraineté (où vit le repo et qui peut
          le lire)

§8. Par où commencer (carte de décision)
   Schéma 8 — "Carte de décision" (arbre 4-5 portes
   d'entrée selon profil)
   §8.1 Première heure : un cas trivial qui marche
   §8.2 Première semaine : un cas régulier qui colle
        au vrai travail
   §8.3 Premier mois : un cas qui change l'organisation
        de son temps

CONCLUSION — Le bon réflexe en 2026
   Pas "remplacer le clavier" mais "déléguer un livrable".
   Le piège opposé : tout vouloir déléguer (le retour
   au coût caché).
   Une note sur la suite : ce qui se prépare en 2026-2027
   (autonomie longue, agent-to-agent, on-device).
```

## 4. Schémas SVG inline

8 schémas obligatoires + 1 optionnel. Tous : `width: 100%; height: auto`, zoom plein écran (pattern `dossier-app`), full-bleed sur la `.figure`, tooltips sur jargons via `.term`.

| # | Titre | Type / structure | Place |
|---|---|---|---|
| 1 | Trois régimes : autocomplete · assistant IDE · coding agent | 3 colonnes side-by-side, axes (contexte / interaction / durée boucle / livrable). Accent orange sur la 3e | §1.3 |
| 2 | Anatomie d'un coding agent | Hub & spokes : agent au centre, 6 boîtes orbitales (Contexte, Tools, Skills, Sub-agents, Hooks, Permissions). Cellules cliquables → modals | §2 ouverture |
| 3 | Cycle de vie d'une skill | Flèches circulaires : création → `.claude/skills/` → invocation → exécution → versionnement | §2.3 |
| 4 | Comparatif Claude Code / Codex CLI / Copilot | Matrice 6 lignes × 3 colonnes (philosophie, contexte, skills, MCP, prix, sécu). Cellules cliquables → modal | §3-§4 charnière |
| 5 | **Pyramide des cas d'usage** | 3 étages, ~5-6 cas par étage, stickers "outil le plus adapté". Schéma central, full-bleed | §5 |
| 6 | Gains observés | Barres horizontales par tâche-type. Sources iconifiées (METR, Anthropic, retex perso) | §6 |
| 7 | Coûts mensuels stratifiés | Stack/waterfall : abonnement + tokens + revue = TCO. 3 profils | §7 |
| 8 | Carte de décision | Arbre 4-5 portes d'entrée par profil. Première heure / semaine / mois | §8 |
| 9 *(opt.)* | Permissions et sandboxing | "Ce que voit l'agent" : dossiers, tools, MCP servers autorisés | §2.6 si place |

## 5. Sources cibles (~12-15)

**Documentation officielle** : Anthropic Claude Code docs (skills, hooks, sub-agents, MCP) · OpenAI Codex CLI docs · GitHub Copilot agent mode docs · Anthropic Model Context Protocol spec.

**Études quantitatives** : METR study (productivité dev en condition réelle) · Anthropic case studies (Block, Stripe, Atlassian) · GitHub Copilot research papers · DORA Report 2025 · Stack Overflow Developer Survey 2025.

**Voix critiques** (essentielles pour la critique honnête de §6.3) : Simon Willison · AI Snake Oil (Narayanan / Kapoor) · Latent Space podcast retex.

**Références prix datées 2026-05** : pages pricing Anthropic, OpenAI, GitHub.

## 6. Modalités de production

### Branche et worktree
- Worktree créé : `.claude/worktrees/coding-agents-deep-research/`, branche `worktree-coding-agents-deep-research`.
- Renommer en `claude/coding-agents-dossier` avant la PR pour cohérence avec les autres branches du repo.

### Structure du dossier produit
```
coding-agents/
├── index.html                              (hub)
├── 2026-05-12-coding-agents-rapport.md     (texte source)
├── 2026-05-12-coding-agents-app.html       (companion interactif)
├── 2026-05-12-coding-agents-slideshow.html (slideshow linéaire)
├── images/
│   ├── 01-trois-regimes.svg
│   ├── 02-anatomie-coding-agent.svg
│   ├── 03-cycle-skill.svg
│   ├── 04-comparatif.svg
│   ├── 05-pyramide.svg
│   ├── 06-gains.svg
│   ├── 07-couts.svg
│   └── 08-carte-decision.svg
└── og.png                                  (1200×630, généré)
```

### Tuile sur l'index racine
- Ajout en tête de la grille `#series` (date 2026-05-12).
- Eyebrow : `OUTILS`.
- Badge typologique : `Étude` (recoupe data + transverse, plus large qu'un Dossier mais plus structuré qu'une Veille).
- Numéro de publication : suivant le dernier (à confirmer au moment de l'insertion).
- Accent orange sur "coding agents" dans le titre.

### Topbar dossier
Toutes les pages internes embarquent le pattern PR #29 (3 zones : Mathieu Guglielmino · titre dossier · ← Hub · Accueil). Hub : pattern 2 items (Mathieu · ← Retour aux dossiers).

### OG card et SEO
1. `python tools/og-card.py` (à adapter au slug `coding-agents` si le générateur ne fait pas tout seul)
2. `python tools/seo_dossiers.py --only coding-agents`

### Disclosure IA
Footer du rapport, formulation :

> Format co-écrit avec l'aide d'une IA — et le sujet est lui-même un cas d'usage. Les ordres de grandeur de gains revendiqués ici s'appliquent à la production de ce dossier.

### Lincoln
Footer du site uniquement (déjà en place via `index.html` racine). Aucune mention dans le dossier, ni dans les retex (le retex pro §6.1 reste anonymisé "équipe practice").

## 7. Workflow de relecture

Pas de PR avant validation. Construction par sections, relecture en trois passes :

| Pass | Sections | Objet de la relecture |
|---|---|---|
| 1 | Intro + §1 + §2 | Cadrage et anatomie. Le concept "coding agent" est-il clair ? |
| 2 | §3 + §4 + §5 | Comparatif outils + pyramide. Le dosage 70/15/15 tient-il ? La pyramide est-elle lisible ? |
| 3 | §6 + §7 + §8 + Conclusion | Chiffres et carte de décision. Les retex sont-ils suffisamment chiffrés ? Les coûts couvrent-ils les bonnes catégories ? |

Après pass 3 validée : génération OG card, SEO propagation, ajout tuile index, push branche `claude/coding-agents-dossier`, PR via MCP GitHub. Mathieu merge à la main.

## 8. Risques identifiés et mitigations

| Risque | Mitigation |
|---|---|
| Sujet "auto-référentiel" (Claude écrit sur Claude Code) — biais évident | Disclosure IA explicite, ton critique sur §6.3 et §7.4, citations de voix critiques (Willison, AI Snake Oil) |
| Longueur qui dérape (12 000 mots peut devenir 18 000) | Contrôle de longueur entre passes. Si §2 dépasse 3 500 mots, déplacer §2.4-§2.6 vers une annexe ou un encadré |
| Pricing daté qui périme vite (Anthropic / OpenAI changent souvent) | Daté visiblement "2026-05" sur le tableau, formulation "à la date de publication" |
| Retex pro identifiable malgré l'anonymisation | Vérification finale par Mathieu avant PR. Si doute, basculer le retex 3 vers un autre exemple perso |
| Pyramide perçue comme hiérarchique (élitiste) | Note explicite §5 sur les chevauchements et la non-hiérarchie. Le sommet n'est pas "mieux", il est "plus technique" |

## 9. Definition of Done

- [ ] 8 schémas SVG inline produits, zoom plein écran fonctionnel
- [ ] Rapport markdown 9 000 – 12 000 mots
- [ ] Companion HTML interactif (modals sur schémas 2, 4, 5)
- [ ] Slideshow linéaire (toutes les data-cards des SCHEMAS touchées)
- [ ] Hub `coding-agents/index.html`
- [ ] Topbar dossier sur toutes les pages internes
- [ ] OG card 1200×630 générée
- [ ] Bloc SEO injecté via `tools/seo_dossiers.py --only coding-agents`
- [ ] Tuile ajoutée à l'index racine, grille `#series`, en tête
- [ ] Disclosure IA en footer du rapport
- [ ] Aucune mention Lincoln hors footer du site
- [ ] Aucun client / projet interne nommé
- [ ] 3 passes de relecture validées par Mathieu
- [ ] Branche renommée `claude/coding-agents-dossier`
- [ ] PR ouverte via MCP GitHub
