# Spec — Refacto CLAUDE.md ↔ skill `illustrated-deep-research`

**Date** : 2026-05-20
**Auteur** : Mathieu Guglielmino (avec l'aide d'une IA)
**Statut** : Design validé, à implémenter

## Contexte et problème

`CLAUDE.md` (40k chars, 331 lignes) et la skill `illustrated-deep-research` (3 044 lignes réparties sur `SKILL.md` + 7 fichiers `references/`) décrivent en parallèle les mêmes patterns techniques pour les apps deep-research :

- mobile-friendliness (overflow-x, panel-close, mobile typography dans `@media (max-width: 1024px)`, overflow `<pre>`/`<table>`)
- topbar 3 items + sticky-adjustments
- sidebars TOC/Sources (structure, sticky math, sources-collapse, format `<li id="source-N">`)
- callouts inter-dossiers
- quiz cards (CSS + IIFE detection)
- surlignage stabilo + hint Obsidian `|1300`
- bibliothèque `/assets/dossier-app.{js,css}` (contrat DOM, inclusion, tests CI)

La skill `companion-app.md` (1 131 lignes) référence explicitement CLAUDE.md (« they are also enforced by `CLAUDE.md` of the personal site »). Couplage circulaire et brittle :

- **Drift silencieux** : un apprentissage daté ajouté à CLAUDE.md (« cas vu le YYYY-MM-DD ») n'atterrit pas dans la skill — une session sur claude.ai retombera dans le même bug.
- **Itération coûteuse** : `companion-app.md` est un monolithe de 1 131 lignes ; éditer un point mobile demande de scroller au milieu du fichier et de naviguer entre 6 concerns mélangés.
- **CLAUDE.md trop gros** : 40k chars chargés à chaque session, dont ~60% sont des patterns shared-with-skill (donc redondants pour Claude qui voit aussi la skill).

## Objectifs

1. **Réduire CLAUDE.md à ~13k chars** en gardant uniquement le repo-specific : workflow git, MCP push, easter egg admin, index/homepage, structure du repo, versionnement skill, création PR.
2. **Faire de la skill la source unique de vérité** pour les patterns techniques. CLAUDE.md ne contient plus que des pointeurs + les overrides/exceptions spécifiques au repo.
3. **Éclater `companion-app.md`** en fichiers focalisés mono-thème (~200-350 lignes chacun) pour rendre l'itération atomique.
4. **Maintenir la skill auto-suffisante pour claude.ai** — aucun fichier `references/` ne référence CLAUDE.md ; la skill marche sans le repo.
5. **Co-localiser la doc du shared lib** `/assets/dossier-app.{js,css}` dans `/assets/README.md`, à côté du code qu'elle documente.

## Non-objectifs

- Pas de modification du code des apps (`*/2026*-app.html`) — refacto purement documentaire.
- Pas de modification des autres formats (slideshows, journal, livre, scrollies) en dehors des bullets qui les concernent.
- Pas de nouveau pattern technique introduit — on déplace l'existant.
- Pas de refonte de `SKILL.md` (juste mise à jour de pointers vers les nouveaux fichiers).
- Pas de touche aux autres skills (`svg-schemas`, `frontend-design`, etc.).

## Décisions de design (acquises au brainstorming)

1. **Skill = source de vérité** pour patterns techniques partagés. CLAUDE.md = repo-specific overrides uniquement.
2. **Apprentissages datés** : généraliser dans la skill au présent intemporel, dropper la date. CLAUDE.md perd l'entrée. Le « pourquoi » reste sous forme de motivation générique.
3. **Shared lib `/assets/dossier-app.{js,css}`** : doc co-localisée dans `/assets/README.md`. CLAUDE.md → pointer 1-ligne.
4. **Granularité** : éclatement de `companion-app.md` par concern (4 nouveaux fichiers) plutôt que de l'épaissir.

## Architecture cible

### Skill `illustrated-deep-research/references/`

**Inchangés :**
- `SKILL.md` (entrée — touche légère pour mettre à jour pointers vers nouveaux fichiers)
- `svg-editorial-style.md`
- `slideshow.md`
- `seo.md`
- `workflow.md`
- `a4-exec-sum-infographic.md`

**Allégé : `companion-app.md`** (1 131 → ~600 lignes)
Garde : architecture/layout 3-col, baseline interactions (modal/tooltip/citations), zoom fullscreen, stack de z-index, micro-patterns style (mark stabilo + Obsidian width hint `|1300`).
Sort : mobile, panel-close, sources format canonique, topbar, callouts, quiz CSS notes.

**Enrichi : `quiz-authoring.md`**
Reçoit le CSS quiz local + note IIFE detection pattern (script `insert-quizzes.py` skip injection si shared lib détectée) + liste sidecars existants vs apps legacy hand-rolled à migrer.

**Nouveaux fichiers (4) :**

- `mobile.md` (~350 lignes) — checklist 7 points :
  1. `overflow-x: hidden` sur html/body + exception `overflow-x: clip` pour scrolly avec `position: sticky`
  2. Topbar fixe responsive (padding + tailles sous 560px / 380px)
  3. Apps `header.site` + `main#report` : typographie mobile dans le **même** `@media (max-width: 1024px)` (load-bearing pour Chrome "Desktop site")
  4. Schémas SVG `width: 100%; height: auto; max-width: 100%` + zoom plein écran obligatoire
  5. Sidebars `panel-close` (renvoie vers `sidebars.md`)
  6. `<pre>` + `<code>` : 3 règles `main pre` + `main code` + `main pre code`
  7. `<table>` : `display: block; overflow-x: auto` + `white-space: normal` sur cellules

- `topbar.md` (~280 lignes) — pattern 3 items :
  - Structure HTML (Gauche / Milieu / Droite) + responsive (em masqué sous 380px, dossier-context masqué sous 768px)
  - Constantes structurelles (hauteur 56px, z-index 60/70/99/100, background `rgba + backdrop-filter`)
  - Ajustements obligatoires sur sticky/fixed adjacents (panels TOC/Sources, `.pin` scrolly, `.stage` livre, `.toc-toggle`)
  - Vars CSS adaptatives selon format hôte (apps vs slideshows vs journal vs livre vs gouvernance masthead)
  - Scope hubs vs pages internes (hubs gardent topbar 2 items)
  - Pages hors scope (livre-print, pitch interne)

- `sidebars.md` (~300 lignes) — TOC + Sources :
  - Structure HTML + sticky height calc `100vh - 56px` (et pourquoi `height` > `max-height` avec `align-self: start`)
  - Pattern `panel-close` mobile complet (CSS + HTML + JS Escape avec yield zoom/modal)
  - `#sources-collapse-btn` : `position: fixed` load-bearing (pas absolute)
  - Format canonique `<li id="source-N">` : `[N]` bracketed littéral + URL complète comme texte de lien + `<br>` + accessed
  - CSS canonique des sources (couleurs, tailles)
  - Convention legacy à migrer au passage

- `callouts.md` (~200 lignes) — renvois inter-dossiers :
  - Pattern `<aside class="callout">` complet (HTML)
  - Mécanique du zoom (bouton vs `<a>`, IIFE inline qui réutilise `window.__dossierOpenZoom`)
  - Variante `callout--text` (sans vignette, pleine largeur)
  - Différenciation visuelle bordure gauche `--teal` vs `--carmine` (quiz)
  - Responsive mobile (vignette au-dessus)

### CLAUDE.md (final ~12-14k chars)

**Gardé en l'état ou marginalement allégé (sections repo-only) :**
- Quick Reference (mis à jour pour pointer les nouveaux fichiers skill)
- Cadrage éditorial (Lincoln, clients internes, disclosure IA)
- Schémas SVG (déjà juste un pointer vers skill `svg-schemas` — pas de changement)
- Structure du repo
- Mode admin (easter egg)
- Index tri et typologie
- Workflow git (commit→diff→push branche, jamais main)
- Versionnement skill `illustrated-deep-research`
- Création de PR
- Push direct sur main

**Remplacé par pointer 2-3 lignes + overrides repo (sections migrées) :**

| Section | Pointer vers | Override repo conservé |
|---|---|---|
| Mobile-friendliness | `skill/references/mobile.md` | Exception scrolly `overflow-x: clip` |
| Topbar 3 items | `skill/references/topbar.md` | Outils `tools/add_dossier_topbar.py`, `add_topbar_dossier_title.py` |
| Sidebars Sommaire/Sources | `skill/references/sidebars.md` | — |
| Quiz cards | `skill/references/quiz-authoring.md` | Commande `python .claude/skills/.../insert-quizzes.py` |
| Callouts | `skill/references/callouts.md` | — |
| Bibliothèque `/assets/dossier-app` | `/assets/README.md` | Tests CI `node --test tests/lib-contract.test.mjs` |
| SEO | `skill/references/seo.md` + commande `tools/seo_dossiers.py --only <slug>` | Commande repo |
| Stack > stabilo + Obsidian hint | `skill/references/companion-app.md` (micro-patterns) | — |

**Template de pointer-ligne canonique :**

```markdown
## Mobile-friendliness

Pattern complet : `.claude/skills/illustrated-deep-research/references/mobile.md`.

**Exception repo :** sur scrolly avec `position: sticky` (ex. `anatomie/scrolly.html`),
utiliser `overflow-x: clip` au lieu de `hidden` — sinon le sticky casse.
```

Règle : (1) renvoie au fichier source de vérité, (2) liste les overrides/exceptions spécifiques au repo qui n'auraient pas leur place dans une skill générale.

### `/assets/README.md` (nouveau)

Contenu migré depuis CLAUDE.md section "Bibliothèque partagée /assets/dossier-app.{js,css}" :
- Description (source unique de vérité pour comportement + style des apps deep-research)
- Inclusion dans une app (snippet HTML head + script defer)
- Contrat DOM (tableau IDs/sélecteurs requis)
- Donnée inline requise (SCHEMAS + SOURCES)
- Comment modifier la lib (5 étapes + fixtures à mettre à jour)
- Migration nouvelle app (`tools/extract_to_lib.py`)
- Tests CI (commande + workflow)

Pas de changement de contenu, juste relocalisation.

## Plan d'exécution — 5 PRs

Chaque PR est atomique, reviewable, ne casse rien. Branches `claude/refacto-claude-md-skill-N`.

### PR 1 — Validation du pattern (smallest)

- **Nouveau :** `skill/references/callouts.md` (~200 lignes, aucun conflit, la skill n'a rien)
- **Modifié :** `skill/references/companion-app.md` reçoit 2 bullets micro-patterns :
  - mark stabilo (sélecteur, gradient CSS, syntax Obsidian, scope `.entry` vs `main`)
  - hint Obsidian `|1300` sur images des journaux markdown
- **Modifié :** `CLAUDE.md` remplace 3 sections par leurs pointers (callouts, stabilo, obsidian-hint)
- **Objectif :** valider la mécanique du pointer + le template d'un fichier skill mono-thème avant de toucher les gros morceaux. Risque minimal.

### PR 2 — Shared lib doc (mécanique)

- **Nouveau :** `/assets/README.md` avec contenu migré de la section "Bibliothèque partagée" (contrat DOM, inclusion, tests CI, `extract_to_lib`)
- **Modifié :** `CLAUDE.md` remplace la section par pointer + mention `tests/lib-contract.test.mjs` (CI repo-specific)
- **Pas de conflit** — la skill ne documente pas la lib repo (et ne doit pas — c'est un artefact non portable).

### PR 3 — Mobile + Topbar (groupe "responsive shape")

- **Nouveaux :** `skill/references/mobile.md` (~350 lignes), `skill/references/topbar.md` (~280 lignes)
- **Modifié :** `skill/references/companion-app.md` perd ses sections "Mobile-friendliness & panel close" (lignes 39-80+) — contenu déplacé/réconcilié
- **Modifié :** `CLAUDE.md` remplace les 2 sections par leurs pointers + overrides (scrolly `clip`, outils topbar)
- **Conflits attendus :** `companion-app.md` a déjà du contenu mobile qui chevauche CLAUDE.md → règle de résolution ci-dessous.

### PR 4 — Sidebars (groupe "data panels")

- **Nouveau :** `skill/references/sidebars.md` (~300 lignes) avec TOC/Sources + sticky math + sources collapse + format `<li id="source-N">` canonique
- **Modifié :** `skill/references/companion-app.md` perd sa section sidebars (déplacée)
- **Modifié :** `CLAUDE.md` remplace par pointer
- **Conflit attendu :** convention legacy vs canonique pour les sources → la nouvelle ref `sidebars.md` documente les deux + plan de migration.

### PR 5 — Quiz + audit final

- **Modifié :** `skill/references/quiz-authoring.md` enrichi (CSS local + IIFE detection + liste sidecars/legacy)
- **Modifié :** `CLAUDE.md` remplace section quiz par pointer + commande repo `insert-quizzes.py`
- **Audit final :**
  - Relit `CLAUDE.md` end-to-end pour vérifier qu'aucun pointer n'est cassé ni orphelin
  - Met à jour `SKILL.md` ("What this skill produces" + "Workflow at a glance") pour pointer les nouveaux fichiers
  - Vérifie cohérence `companion-app.md` allégé (encore une narration logique, pas un patchwork)
  - Re-run `node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs`
  - Vérification visuelle sur 2-3 apps représentatives (`evaluation-agentique`, `observabilite-agents-ia`, `agent-sdk`) — diff de comportement zéro attendu

## Règle de résolution des conflits (drift CLAUDE.md ↔ skill)

Pour les PRs 3 et 4 où la skill a déjà du contenu chevauchant :

1. **Diff 3-way** entre version CLAUDE.md actuelle, version skill actuelle, et cible nouveau fichier.
2. **Même fond, phrasing différent** → garder phrasing skill (déjà timeless/générique). CLAUDE.md est souvent post-mortem-style avec dates.
3. **CLAUDE.md a une info que la skill n'a pas** (typiquement, incident récent) → généraliser au présent intemporel et intégrer dans la skill. Pas de date.
4. **Skill a une info que CLAUDE.md n'a pas** → conserver (la skill peut être plus complète qu'attendu).
5. **Vraie contradiction** (rare) → s'arrêter, flagguer dans PR description, demander avant de trancher.
6. Chaque PR description liste explicitement les conflits résolus + leur résolution — documente la dette de drift qu'on paye.

## Non-régression

- Après chaque PR : grep rapide pour vérifier patterns toujours consistants sur 2-3 apps représentatives.
- Après PR 5 : CI complète + relecture full CLAUDE.md pour orphans / pointeurs cassés.
- **Pas de touche au code des apps** dans cette refacto — purement documentaire.
- Le fichier `CLAUDE.md` final doit être ouvrable et compréhensible sans avoir besoin d'ouvrir la skill (les pointers doivent suffire à savoir où chercher).

## Risques et mitigations

| Risque | Probabilité | Mitigation |
|---|---|---|
| Drift réintroduit après refacto (un futur fix édite CLAUDE.md au lieu de la skill) | Moyenne | CLAUDE.md ne contient plus le pattern → la tentation d'éditer y disparaît. Un override-clause clair dans CLAUDE.md indique « pour patterns shared : édite la skill ». |
| Pointer cassé (fichier skill renommé/déplacé) | Faible | Audit PR 5 ; les chemins sont stables (`.claude/skills/illustrated-deep-research/references/X.md`). |
| Skill devient trop fragmentée (8+ fichiers references) | Moyenne | 4 nouveaux fichiers ajoutés (total 11). Limite acceptée : chaque fichier est mono-thème. Si on dépasse 15, regrouper. |
| Une PR de cette série conflit avec un autre travail en cours sur CLAUDE.md | Moyenne | Faire la série en rafale (1-2 jours), pas en arrière-plan sur 2 semaines. |

## Estimation

- 5 PRs × ~30-45 min de rédaction/review chacune = ~3-4 h total
- Chaque PR est mergeable indépendamment (pas de séquencement strict, mais l'ordre proposé minimise le risque)
- Résultat : CLAUDE.md de 40k → ~13k chars (-67%), skill mieux structurée et auto-suffisante pour claude.ai

## Métriques de succès

- `wc -c CLAUDE.md` ≤ 14 000
- 0 pattern technique partagé décrit deux fois (entre CLAUDE.md et skill)
- 4 nouveaux fichiers skill mono-thème, chacun éditable sans toucher au reste
- `node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs` passe inchangé après chaque PR
- Pas de régression visuelle sur 3 apps représentatives
