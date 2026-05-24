# Eval Canvas Redesign — Tasks Dump

**Branche** : `claude/eval-canvas-redesign-2026-05-20`
**PR précédente supersédée** : #90 (`claude/eval-infinite-canvas-2026-05-20`)
**Date** : 2026-05-20

## État du contexte

Après la PR #90 (visuel cassé : schéma central illisible, leaves vides, connecteurs chaos), recadrage avec Mathieu sur :

1. **Métaphore** : gruyère fractal (chaque trou contient un mini-gruyère) **+ flèches d'attaque** (modèle Reason complet à 2 axes)
2. **Zoom sémantique DANS la scène unique** (pas vers des boîtes externes — style Bret Victor / focus+context)
3. **7 attaques** retenues : hallucination, prompt injection, tool misuse, context saturation, reward hacking, spec mismatch, latency drift
4. **Style icons** : line-art éditorial
5. **Process itératif** : SVG explorer d'abord → mockup niveau 0 isolé → validation → niveau 1 → niveau 2 → intégration

## Tasks completed

- [x] **#36** PR #90 → commenté pour flag superseded (manuel : convertir en draft via UI)
- [x] **#37** Nouvelle branche `claude/eval-canvas-redesign-2026-05-20` depuis main
- [x] **#38** `tools/svg-explorer.html` — outil de diagnostic drag/zoom, 11 presets schémas eval (commit `3eaad11`)
- [x] **#39** Mockup niveau 0 : `evaluation-agentique/canvas-redesign/mockup-niveau-0.svg` (4000×3000, gruyère + 7 flèches + outcomes, commit `7c69847`)

## Tasks pending

- [ ] **#40 — Validation visuelle niveau 0 via explorer** (Mathieu)
  - Ouvrir `tools/svg-explorer.html` dans navigateur (avec serveur local si `file://` bloque les fetches)
  - Charger `evaluation-agentique/canvas-redesign/mockup-niveau-0.svg`
  - Valider : composition, lisibilité, affordances, équilibre attaques↔défenses↔outcomes
  - **Feedback attendu** : reprendre/ajuster avant niveau 1

- [ ] **Niveau 1 — mockup zoom dans une phase**
  - Choisir une phase pilote (ex. Phase 1 Collecte tasks)
  - Mockup SVG isolé montrant : ce qu'on voit quand le viewBox zoome sur la zone Phase 1
  - Contenu attendu : mini-gruyère interne (S0 et S1 comme sous-trous), flèches d'attaque qui touchent cette zone annotées
  - Pattern : LOD via opacity (overview faded, structure visible)

- [ ] **Niveau 1 — mockup zoom dans une attaque**
  - Choisir une attaque pilote (ex. Prompt injection)
  - Mockup SVG montrant : timeline de l'attaque, exemples concrets, indicateurs de détection
  - À ce niveau, on suit le parcours de l'attaque à travers le gruyère

- [ ] **Niveau 2 — mockup ultra-zoom**
  - Sur un sous-trou ou un point timeline : détail technique final
  - Ex : zoom dans S0 → diagramme dédié "20-50 tasks issues de vrais échecs"
  - Citations, formules, contre-exemples

- [ ] **Pipeline de génération `canvas-content.yaml`**
  - Définir un YAML source-of-truth qui décrit la composition (défenses + attaques + contenu à 3 niveaux)
  - Script Python `tools/build_canvas_svg.py` qui prend le YAML et génère le SVG complet
  - Re-runnable, idempotent — modifier YAML = régénérer SVG

- [ ] **Intégration dans le canvas HTML interactif**
  - Une fois les mockups niveau 0/1/2 validés, assembler dans un seul SVG cohérent
  - Câbler avec `/assets/canvas-zoom.js` (déjà existante, peut nécessiter ajustement)
  - Topbar, mobile interstitiel (existants)
  - PR finale qui remplace PR #90

- [ ] **Cleanup hub**
  - `evaluation-agentique/index.html` : ajouter la carte format 2 (carte zoomable) — pareil que dans PR #90 mais sur la nouvelle branche

- [ ] **SEO + poster A0 final**
  - Régénérer OG + canonical pour le nouveau canvas
  - Générer poster A0 depuis le canvas final (script `tools/extract_poster_svg.py` existe déjà sur PR #90, à porter)

## Cleanup git en suspens

- [x] **Commit dangling `6f700fe`** ("plan refacto CLAUDE.md") : **déjà nettoyé** lors du rebase de `claude/eval-infinite-canvas-2026-05-20` sur main. Le commit n'est plus dans l'ancestry d'aucune branche (`git branch --all --contains 6f700fe` ne retourne rien). Il subsiste uniquement dans le reflog HEAD@{10} et sera GC'd dans 30 jours.
- [ ] **Optionnel** : `git reflog expire --expire=now --all && git gc --prune=now` pour le supprimer immédiatement (non bloquant, à faire à froid).

## Décisions design verrouillées

| Sujet | Choix |
|---|---|
| Métaphore visuelle | Gruyère fractal + flèches d'attaque (modèle Reason 2 axes) |
| Format niveau 0 | Paysage 4000×3000 (vertical à reconsidérer si validation problématique) |
| 7 attaques | hallucination, prompt injection, tool misuse, context saturation, reward hacking, spec mismatch, latency drift |
| 4 phases (trous haut) | 1 collecte, 2A cadrer, 2B harness, 3 maintenance |
| 3 niveaux (bandes bas) | 1 préventif, 2 curatif, 3 qualitatif |
| Style icons | Line-art éditorial (stroke fin, monochrome) |
| Couleurs | Phase 1/Niveau 1 teal `#1F5560`, Phase 2A/Niveau 2 ocre `#B58A2C`, Phase 2B `#A07320`, Phase 3/Niveau 3 carmine `#B7332C`, Cheese matter `#F3E5C0`, Attacks carmine `#B7332C`, Outcomes vert `#4B9466` / carmine `#B7332C` |
| Mécanique zoom | Semantic zoom **DANS** une scène unique (pas orbital), LOD via opacity |

## Fichiers présents sur la branche

```
tools/svg-explorer.html                                          (587 lignes, autonome)
evaluation-agentique/canvas-redesign/mockup-niveau-0.svg         (517 lignes)
docs/superpowers/plans/2026-05-20-eval-canvas-redesign-tasks.md  (ce fichier)
```

## Référence : PR #90 (legacy)

- URL : https://github.com/MathieuGug/mathieugug.github.io/pull/90
- État : open mais commenté pour flagger comme supersédé
- Contient : `/assets/canvas-zoom.{js,css}` (utile, à reporter), `extract_poster_svg.py` (utile), spec + plan + canvas HTML (à jeter), poster SVG (à régénérer)
- **À porter sur la nouvelle branche au moment de l'intégration** : `canvas-zoom.{js,css}` (la lib semantic zoom marche, c'est juste le contenu qui était mauvais) + `extract_poster_svg.py`

## Reprise rapide

```bash
# Sur cette branche
cd C:/Users/mguglielmino/Documents/code/mathieugug.github.io
git switch claude/eval-canvas-redesign-2026-05-20
git log --oneline main..HEAD   # voir les commits du redesign

# Ouvrir le mockup niveau 0
# 1. Lancer un serveur local : python -m http.server 8000
# 2. Naviguer vers http://localhost:8000/tools/svg-explorer.html
# 3. Cliquer "Charger" → sélectionner mockup-niveau-0.svg
# OU drag-and-drop le SVG dans la stage
```
