# Refacto CLAUDE.md ↔ skill `illustrated-deep-research` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Réduire `CLAUDE.md` de 40k → ~13k chars en migrant les patterns techniques partagés vers la skill `illustrated-deep-research` (4 nouveaux fichiers mono-thème), tout en co-localisant la doc du shared lib `/assets/dossier-app.{js,css}` dans `/assets/README.md`.

**Architecture:** 5 PRs atomiques et reviewables (~<300 lignes diff chacune). Chaque PR sur sa propre branche `claude/refacto-claude-md-skill-N-...`. CLAUDE.md devient repo-only ; la skill devient source de vérité auto-suffisante (utilisable sur claude.ai sans le repo). Co-localisation : `/assets/README.md` documente le shared lib à côté du code.

**Tech Stack:** Markdown (CLAUDE.md, skill references). Git workflow : branches `claude/...`, commits avec diff review, PRs via MCP GitHub (`mcp__github__create_pull_request`, owner/repo `mathieugug/mathieugug.github.io`). Skill files sous `.claude/skills/illustrated-deep-research/` sont gitignorés mais force-addable (`git add -f`).

**Référence spec :** `docs/superpowers/specs/2026-05-20-claude-md-skill-refactor-design.md`

**Règle de résolution des conflits** (à appliquer dans les tâches 3 et 4) :
1. Même fond, phrasing différent → garder phrasing skill (timeless/générique).
2. CLAUDE.md a une info que skill n'a pas → généraliser au présent intemporel, dropper la date, intégrer dans skill.
3. Skill a une info que CLAUDE.md n'a pas → conserver.
4. Vraie contradiction → arrêter, flagguer dans PR description, demander.
5. La PR description doit lister explicitement les conflits résolus.

---

## File Structure

**Skill (nouveaux fichiers — créés en PR 1, 3, 4) :**
- `.claude/skills/illustrated-deep-research/references/callouts.md` — pattern encadrés inter-dossiers (PR 1)
- `.claude/skills/illustrated-deep-research/references/mobile.md` — checklist 7 points mobile (PR 3)
- `.claude/skills/illustrated-deep-research/references/topbar.md` — pattern topbar 3 items (PR 3)
- `.claude/skills/illustrated-deep-research/references/sidebars.md` — TOC/Sources + format sources (PR 4)

**Skill (modifiés) :**
- `.claude/skills/illustrated-deep-research/SKILL.md` — pointers vers nouveaux fichiers
- `.claude/skills/illustrated-deep-research/references/companion-app.md` — perd sections mobile + sidebars, gagne 2 micro-bullets (stabilo + obsidian-hint)
- `.claude/skills/illustrated-deep-research/references/quiz-authoring.md` — enrichi CSS local + IIFE detection (PR 5)

**Repo :**
- `assets/README.md` — nouveau, doc co-localisée du shared lib (PR 2)

**Racine :**
- `CLAUDE.md` — réduit section par section au fil des PRs

---

## Task 1 (PR 1) — Validation du pattern : callouts + stabilo + obsidian-hint

**Branche :** `claude/refacto-claude-md-skill-2026-05-20` (existante — contient déjà le commit spec `9e11533`)

**Files:**
- Create: `.claude/skills/illustrated-deep-research/references/callouts.md`
- Modify: `.claude/skills/illustrated-deep-research/references/companion-app.md` (ajout 2 bullets)
- Modify: `.claude/skills/illustrated-deep-research/SKILL.md` (mise à jour pointer si nécessaire)
- Modify: `CLAUDE.md` (remplace 3 sections par pointers)

**Source material (verbatim depuis CLAUDE.md actuel) :**
- Callouts : `CLAUDE.md` lignes 184-208 (section "Encadrés de renvoi vers d'autres dossiers")
- Stabilo : `CLAUDE.md` ligne 35 (bullet "Surlignage stabilo")
- Obsidian-hint : `CLAUDE.md` ligne 36 (bullet "Hint de largeur Obsidian `|1300`")

### Étapes

- [ ] **Step 1.1 : Lire les 3 sections sources de CLAUDE.md**

Run:
```bash
sed -n '184,208p' CLAUDE.md
sed -n '35,36p' CLAUDE.md
```

Verify: contenu callouts (HTML pattern, IIFE zoom hook, variantes), bullet stabilo (sélecteur + gradient + scope `.entry` vs `main`), bullet obsidian-hint (suffixe `|1300`) tous lisibles.

- [ ] **Step 1.2 : Créer `callouts.md`**

Path: `.claude/skills/illustrated-deep-research/references/callouts.md`

Structure (basée sur CLAUDE.md lignes 184-208, généralisée — pas de référence directe au repo, pattern présenté comme générique réutilisable) :

```markdown
# Callouts — renvois inter-dossiers

Pattern `main .callout` pour pointer vers un autre dossier en parallèle d'une section de prose (ex. obs ↔ eval, harness ↔ agent-sdk). Bordure gauche en couleur secondaire (`--teal` par défaut) pour différencier visuellement des `.quiz-card` (bordure `--carmine`).

## Structure HTML

```html
<aside class="callout">
  <button type="button" class="callout-thumb-link"
          data-svg-src="../<autre-dossier>/images/<schema>.svg"
          data-svg-alt="Description de la mini-vignette"
          aria-label="Agrandir : <titre>">
    <img class="callout-thumb" src="../<autre-dossier>/images/<schema>.svg"
         alt="…" loading="lazy">
  </button>
  <div class="callout-body">
    <p class="callout-eyebrow">Eyebrow contextuel (mono caps)</p>
    <p>Texte de renvoi avec <a href="../<autre-dossier>/">lien</a> vers le hub.</p>
  </div>
</aside>
```

## Mécanique du zoom

La mini-vignette est un `<button>` (pas un `<a>`). Un IIFE inline en bas de page attache un click handler qui fetch le SVG et réutilise `window.__dossierOpenZoom` (exposé par la lib partagée `/assets/dossier-app.js` ou par l'IIFE locale `setupZoom()` selon le contexte).

```js
(function setupCalloutZoom() {
  document.querySelectorAll('.callout-thumb-link').forEach(btn => {
    btn.addEventListener('click', async () => {
      const src = btn.dataset.svgSrc;
      const alt = btn.dataset.svgAlt || '';
      const res = await fetch(src);
      const svgText = await res.text();
      if (window.__dossierOpenZoom) {
        window.__dossierOpenZoom(svgText, alt);
      }
    });
  });
})();
```

## Variantes

- `<aside class="callout callout--text">` — variante sans vignette, pleine largeur, pour un renvoi purement textuel.
- Sur mobile (`max-width: 640px`), la vignette passe au-dessus du body en colonne unique.

## CSS de base

(Bloc CSS canonique à embarquer localement dans la `<style>` de chaque app qui ajoute des callouts — pas dans la lib partagée à date.)

Pattern d'origine : voir une app deep-research existante qui implémente le pattern (sélecteur `.callout`, lignes ~237-258 du `<style>` typiquement).

## Quand l'utiliser

À chaque charnière où le lecteur peut tirer parti d'un dossier voisin (parallèle thématique, prérequis conceptuel, suite logique). Ne pas saupoudrer : un renvoi par section maximum, sinon ça devient du bruit.
```

- [ ] **Step 1.3 : Vérifier création**

Run:
```bash
wc -l .claude/skills/illustrated-deep-research/references/callouts.md
```

Expected: ~50-70 lignes.

- [ ] **Step 1.4 : Ajouter bullet stabilo dans `companion-app.md`**

Find dans `companion-app.md` la section "Style" ou équivalent (probablement après l'architecture et avant les patterns spécifiques). Si elle n'existe pas, créer une section `## Micro-patterns de style` à la fin du fichier.

Insérer :

```markdown
### Surlignage `<mark>` (stabilo)

Signature visuelle pour les phrases-clés du corps narratif. Syntaxe Obsidian `==texte==` qui rend `<mark>texte</mark>`. Style : dégradé qui ne tache que la moitié basse du texte, façon stylo feutre.

```css
main mark {
  background: linear-gradient(transparent 58%, rgba(178, 59, 27, 0.14) 58%);
  color: inherit;
  padding: 0 2px;
}
```

**Scope du sélecteur** :
- Apps `header.site` + `main#report` → `main mark`
- Pages narratives (journal, scrolly, livre) → `.entry mark` (**pas** `.entry .body mark`, qui rate les `<mark>` dans les bullets `<li>` de l'exec sum)

À embarquer dans toute app HTML longue (rapport, journal).
```

- [ ] **Step 1.5 : Ajouter bullet obsidian-hint dans `companion-app.md`**

Juste après le bullet stabilo, ajouter :

```markdown
### Hint de largeur Obsidian `|1300` sur images des journaux markdown

Dans tout fichier journal `.md` qui contient des images inline, chaque image doit porter le suffixe `|1300` : `![alt|1300](path.svg)`. Hint purement pour homogénéiser la prévisualisation Obsidian locale (sinon les schémas s'affichent à la largeur du wrap éditeur, trop étroite pour relire). **N'affecte pas le rendu HTML publié** : le `journal.html` est typiquement écrit/maintenu à la main, pas auto-généré depuis le `.md`.
```

- [ ] **Step 1.6 : Vérifier modifications companion-app.md**

Run:
```bash
grep -n "Surlignage" .claude/skills/illustrated-deep-research/references/companion-app.md
grep -n "Hint de largeur Obsidian" .claude/skills/illustrated-deep-research/references/companion-app.md
```

Expected: les deux bullets présents.

- [ ] **Step 1.7 : Mettre à jour SKILL.md pour pointer callouts.md**

Lire `SKILL.md` pour trouver la liste des `references/*.md` (probablement section "Workflow at a glance" ou similaire). Ajouter une ligne mentionnant `references/callouts.md` à l'endroit logique. Si SKILL.md n'a pas de liste explicite des references, skip ce step (le fichier est auto-découvrable).

- [ ] **Step 1.8 : Remplacer section callouts dans CLAUDE.md par pointer**

Edit `CLAUDE.md` lignes 184-208 (toute la section "## Encadrés de renvoi vers d'autres dossiers (callouts)") par :

```markdown
## Encadrés de renvoi vers d'autres dossiers (callouts)

Pattern complet : `.claude/skills/illustrated-deep-research/references/callouts.md`.

**Quand l'utiliser dans ce repo** : à chaque charnière où un dossier voisin éclaire la section (obs ↔ eval, harness ↔ agent-sdk, etc.). Bordure gauche en `--teal` pour différencier visuellement des `.quiz-card` (bordure `--carmine`).
```

- [ ] **Step 1.9 : Remplacer bullet stabilo dans CLAUDE.md par pointer**

Edit `CLAUDE.md` ligne 35 (le bullet "Surlignage stabilo (`<mark>`)" entier) par :

```markdown
- **Surlignage stabilo (`<mark>`)** : signature visuelle du site, syntaxe Obsidian `==texte==`. Pattern complet (CSS, scope `.entry` vs `main`) : `.claude/skills/illustrated-deep-research/references/companion-app.md` § "Micro-patterns de style".
```

- [ ] **Step 1.10 : Remplacer bullet obsidian-hint dans CLAUDE.md par pointer**

Edit `CLAUDE.md` ligne 36 (le bullet "Hint de largeur Obsidian `|1300`") par :

```markdown
- **Hint de largeur Obsidian `|1300`** sur les images des journaux markdown — voir `.claude/skills/illustrated-deep-research/references/companion-app.md` § "Micro-patterns de style".
```

- [ ] **Step 1.11 : Vérifier réduction CLAUDE.md**

Run:
```bash
wc -c CLAUDE.md
```

Expected: ~37-38k chars (perte de ~2k chars vs 39 622 initial : section callouts ~1k + 2 bullets ~700 + remplacement par pointers ~300).

- [ ] **Step 1.12 : Vérifier que les pointers résolvent**

Run:
```bash
grep -c "Micro-patterns de style" .claude/skills/illustrated-deep-research/references/companion-app.md
test -f .claude/skills/illustrated-deep-research/references/callouts.md && echo OK
```

Expected: `1` puis `OK`.

- [ ] **Step 1.13 : Stage et commit (avec force-add pour skill files gitignorés)**

Run:
```bash
git add CLAUDE.md
git add -f .claude/skills/illustrated-deep-research/references/callouts.md
git add -f .claude/skills/illustrated-deep-research/references/companion-app.md
git add -f .claude/skills/illustrated-deep-research/SKILL.md
git diff --cached --stat
```

Expected: 4 fichiers modifiés/créés.

Then:
```bash
git commit -m "$(cat <<'EOF'
refacto(claude-md): PR 1/5 — callouts + stabilo + obsidian-hint vers skill

Migre 3 patterns vers la skill illustrated-deep-research :
- callouts inter-dossiers : nouveau fichier references/callouts.md
- mark stabilo + obsidian-hint |1300 : bullets dans companion-app.md

CLAUDE.md : 3 sections remplacées par pointers + overrides repo.
Valide la mécanique pointer avant les gros morceaux (mobile, topbar).

Conflits résolus : aucun (la skill n'avait rien sur callouts ; stabilo et
obsidian-hint sont nouveaux dans companion-app.md).

Spec : docs/superpowers/specs/2026-05-20-claude-md-skill-refactor-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 1.14 : Push branche**

Run:
```bash
git push -u origin claude/refacto-claude-md-skill-2026-05-20
```

Expected: branche poussée.

- [ ] **Step 1.15 : Créer PR via MCP GitHub**

Use `mcp__github__create_pull_request` avec :
- owner: `mathieugug`
- repo: `mathieugug.github.io`
- title: `refacto(claude-md) PR 1/5 — callouts + stabilo + obsidian-hint`
- head: `claude/refacto-claude-md-skill-2026-05-20`
- base: `main`
- body (template) :

```markdown
## PR 1/5 — Validation du pattern

Migre 3 patterns mineurs vers la skill `illustrated-deep-research` pour valider la mécanique pointer + nouveau fichier skill mono-thème avant de toucher les gros morceaux (mobile, topbar, sidebars).

### Changements
- 🆕 `.claude/skills/illustrated-deep-research/references/callouts.md` — nouveau (pattern encadrés inter-dossiers, ~50 lignes)
- ✏️ `.claude/skills/illustrated-deep-research/references/companion-app.md` — ajout 2 bullets (mark stabilo, obsidian-hint `|1300`)
- ✏️ `CLAUDE.md` — 3 sections remplacées par pointers + overrides repo

### Conflits résolus
Aucun. Les 3 patterns n'existaient pas (ou pas explicitement) dans la skill.

### Vérification
- `wc -c CLAUDE.md` : 40k → ~38k chars
- Pointers résolvent vers des fichiers existants
- Pas de touche au code des apps

Spec : `docs/superpowers/specs/2026-05-20-claude-md-skill-refactor-design.md`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

**Stop and wait for user merge before starting Task 2.**

---

## Task 2 (PR 2) — Shared lib doc → `/assets/README.md`

**Branche :** `claude/refacto-claude-md-skill-2-shared-lib-2026-05-20` (créée depuis main après merge PR 1)

**Files:**
- Create: `assets/README.md`
- Modify: `CLAUDE.md` (remplace section "Bibliothèque partagée" par pointer)

**Source material :**
- CLAUDE.md lignes 210-272 (section "Bibliothèque partagée `/assets/dossier-app.{js,css}`" et toutes ses sous-sections : Inclusion, Contrat DOM, Donnée requise inline, Modifier la lib, Migration, Tests CI)

### Étapes

- [ ] **Step 2.1 : Créer branche depuis main**

Run:
```bash
git fetch origin main
git checkout -b claude/refacto-claude-md-skill-2-shared-lib-2026-05-20 origin/main
```

Expected: nouvelle branche basée sur main (qui contient maintenant PR 1).

- [ ] **Step 2.2 : Lire section "Bibliothèque partagée" actuelle**

Run:
```bash
sed -n '210,272p' CLAUDE.md
```

Verify: contenu complet (description, inclusion, contrat DOM, données inline, modification, migration, tests CI) lisible.

- [ ] **Step 2.3 : Créer `assets/README.md`**

Path: `assets/README.md`

Structure (copie verbatim du contenu de CLAUDE.md lignes 210-272, avec ajustements légers pour le contexte standalone — ex. titre `# Shared library — dossier-app.{js,css}` au lieu de `## Bibliothèque partagée`, et ajout d'un paragraphe intro qui explique que c'est la doc co-localisée avec le code, source de vérité pour les apps de ce repo) :

```markdown
# Shared library — `dossier-app.{js,css}`

Source unique de vérité pour le comportement et le style des patterns récurrents des apps deep-research du repo (`*/2026*-app.html`) : zoom plein écran, modal SCHEMAS, citations highlight, TOC observer, mobile panels, sources collapse desktop, sigil MG, topbar scroll, tooltips terms.

> Cette doc est **co-localisée avec le code** (ici, `assets/`). Pour les patterns techniques généraux (mobile, topbar, sidebars, callouts), voir la skill `.claude/skills/illustrated-deep-research/references/`. Pour les conventions éditoriales du site, voir `CLAUDE.md` à la racine.

## Fichiers

- `dossier-app.js` (~440 lignes) — IIFE auto-bootstrap qui lit `window.SCHEMAS` et trouve les éléments DOM par ID conventionnel. Aucune API publique.
- `dossier-app.css` (~410 lignes) — patterns structurels uniquement. Les variables de thème (`--paper`, `--accent`, `--ink`, `--carmine`…) restent définies par chaque page sur `:root`.

## Inclusion dans une app

[copier verbatim depuis CLAUDE.md lignes 217-225]

## Contrat DOM

[copier verbatim depuis CLAUDE.md lignes 227-240, incluant la table des IDs/sélecteurs]

## Donnée requise inline

[copier verbatim depuis CLAUDE.md lignes 242-250]

## Modifier la lib

[copier verbatim depuis CLAUDE.md lignes 252-258]

## Migration d'une nouvelle app vers la lib

[copier verbatim depuis CLAUDE.md lignes 260-268]

## Tests CI

[copier verbatim depuis CLAUDE.md lignes 270-272]
```

**Note :** chaque `[copier verbatim depuis CLAUDE.md lignes X-Y]` doit effectivement être remplacé par le contenu exact à ces lignes au moment de la création du fichier. Le but est un copier-coller fidèle, pas une réécriture.

- [ ] **Step 2.4 : Vérifier création**

Run:
```bash
wc -l assets/README.md
grep -c "## Contrat DOM" assets/README.md
grep -c "## Tests CI" assets/README.md
```

Expected: ~80-100 lignes ; chaque grep retourne `1`.

- [ ] **Step 2.5 : Remplacer section "Bibliothèque partagée" dans CLAUDE.md par pointer**

Edit `CLAUDE.md` lignes 210-272 (toute la section "## Bibliothèque partagée `/assets/dossier-app.{js,css}`" et ses sous-sections) par :

```markdown
## Bibliothèque partagée `/assets/dossier-app.{js,css}`

Source unique de vérité pour le comportement + style des apps deep-research (`*/2026*-app.html`). Doc complète co-localisée avec le code : `assets/README.md`.

**Inclusion minimale** (rappel) :
```html
<link rel="stylesheet" href="/assets/dossier-app.css">
<script src="/assets/dossier-app.js" defer></script>
```

**Tests CI repo** : `node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs` (workflow `.github/workflows/test.yml`, zéro dépendance, < 5 s).

**Migration nouvelle app** : `python tools/extract_to_lib.py path/to/app.html` (idempotent).
```

- [ ] **Step 2.6 : Vérifier réduction CLAUDE.md**

Run:
```bash
wc -c CLAUDE.md
```

Expected: ~32-34k chars (perte de ~4-5k chars vs après PR 1 : section bibliothèque ~5k remplacée par pointer ~600).

- [ ] **Step 2.7 : Vérifier que le pointer résout**

Run:
```bash
test -f assets/README.md && echo OK
grep -c "Contrat DOM" assets/README.md
```

Expected: `OK` puis `1`.

- [ ] **Step 2.8 : Stage et commit**

Run:
```bash
git add CLAUDE.md assets/README.md
git diff --cached --stat
```

Expected: 2 fichiers (CLAUDE.md modifié, assets/README.md créé).

Then:
```bash
git commit -m "$(cat <<'EOF'
refacto(claude-md): PR 2/5 — shared lib doc vers assets/README.md

Co-localise la doc de /assets/dossier-app.{js,css} avec le code lui-même.
CLAUDE.md : section "Bibliothèque partagée" remplacée par pointer + rappels
essentiels (snippet d'inclusion, commande CI, commande migration).

Conflits résolus : aucun (la skill ne documente pas la lib repo, by design).

Spec : docs/superpowers/specs/2026-05-20-claude-md-skill-refactor-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 2.9 : Push branche + créer PR**

Run:
```bash
git push -u origin claude/refacto-claude-md-skill-2-shared-lib-2026-05-20
```

Then create PR via `mcp__github__create_pull_request` (owner `mathieugug`, repo `mathieugug.github.io`, title `refacto(claude-md) PR 2/5 — shared lib doc → assets/README.md`, head `claude/refacto-claude-md-skill-2-shared-lib-2026-05-20`, base `main`).

PR body :
```markdown
## PR 2/5 — Shared lib doc co-localisée

Migre la section "Bibliothèque partagée `/assets/dossier-app.{js,css}`" de CLAUDE.md vers `assets/README.md` (co-localisée avec le code qu'elle documente).

### Changements
- 🆕 `assets/README.md` — nouveau (~100 lignes, contenu verbatim depuis CLAUDE.md)
- ✏️ `CLAUDE.md` — section remplacée par pointer + rappels essentiels (snippet d'inclusion, commande CI, commande migration)

### Conflits résolus
Aucun. La skill ne documente pas la lib repo (by design — c'est un artefact non portable).

### Vérification
- `wc -c CLAUDE.md` : ~38k → ~33k chars
- `tests/lib-contract.test.mjs` + `tests/apps-integration.test.mjs` non touchés, doivent passer

Spec : `docs/superpowers/specs/2026-05-20-claude-md-skill-refactor-design.md`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

**Stop and wait for user merge before starting Task 3.**

---

## Task 3 (PR 3) — Mobile + Topbar (groupe "responsive shape")

**Branche :** `claude/refacto-claude-md-skill-3-mobile-topbar-2026-05-20` (créée depuis main après merge PR 2)

**Files:**
- Create: `.claude/skills/illustrated-deep-research/references/mobile.md`
- Create: `.claude/skills/illustrated-deep-research/references/topbar.md`
- Modify: `.claude/skills/illustrated-deep-research/references/companion-app.md` (retire section mobile existante)
- Modify: `.claude/skills/illustrated-deep-research/SKILL.md` (pointers)
- Modify: `CLAUDE.md` (remplace sections mobile + topbar par pointers)

**Source material :**
- Mobile : `CLAUDE.md` lignes 70-80 + `companion-app.md` (chercher section "Mobile-friendliness & panel close", typiquement lignes ~39-200)
- Topbar : `CLAUDE.md` lignes 82-133 (toute la section "Topbar des pages internes (3 items)" + ses sous-sections Constantes, Ajustements, Vars CSS, Pages hors scope, Outils)

### Étapes

- [ ] **Step 3.1 : Créer branche depuis main**

Run:
```bash
git fetch origin main
git checkout -b claude/refacto-claude-md-skill-3-mobile-topbar-2026-05-20 origin/main
```

- [ ] **Step 3.2 : Diff 3-way pour mobile (conflit attendu)**

Lire en parallèle :
```bash
sed -n '70,80p' CLAUDE.md
grep -n "Mobile-friendliness" .claude/skills/illustrated-deep-research/references/companion-app.md
```

Puis lire la section trouvée dans `companion-app.md` (typiquement ~40-200 lignes autour de "Mobile-friendliness & panel close").

**Identifier explicitement** : (a) ce que CLAUDE.md a et la skill n'a pas (ex. l'exception scrolly `overflow-x: clip`, le pattern `<table>` `display: block`, le commentaire sur Chrome "Desktop site") ; (b) ce que la skill a et CLAUDE.md n'a pas ; (c) toute contradiction.

**Noter dans un scratch doc temporaire** la liste des conflits (à reporter dans le PR body en fin de tâche).

- [ ] **Step 3.3 : Créer `mobile.md` (réconciliation)**

Path: `.claude/skills/illustrated-deep-research/references/mobile.md`

Structure (basée sur la fusion CLAUDE.md lignes 70-80 + section mobile de companion-app.md, normalisée au présent intemporel — pas de "cas vu le YYYY-MM-DD") :

```markdown
# Mobile-friendliness — checklist 7 points

Tout artefact (hub + format[s]) doit être lisible sur petit écran (320-414 px). 7 points à vérifier avant de merger, **sur device réel ou Chrome devtools en mode mobile** (pas "desktop site").

## 1. `overflow-x: hidden` sur `html, body`

(Ou `overflow-x: clip` sur la `.layout` racine **doublé** d'un `overflow-x: hidden` sur `body` pour les apps avec sidebars — `clip` sur `.layout` seul ne suffit pas si un élément déborde du body.) Protection défensive, pas une excuse pour laisser passer un vrai dépassement.

**Cas particulier scrollytelling** : sur les pages qui dépendent de `position: sticky` pour pinner un élément pendant un long scroll, `overflow-x: hidden` sur `html, body` **casse le sticky** — le body devient un scroll container et l'élément sticky n'a plus la viewport comme ancrage. Utiliser `overflow-x: clip` à la place (avec `overflow-x: hidden` en fallback déclaré juste avant pour Safari < 16) — `clip` n'établit pas de scroll container, le sticky retrouve la viewport.

## 2. Topbar fixe responsive

Sous `@media (max-width: 560px)` : padding `12px 16px`, taille nom serif `14px`, taille back mono `9px` avec `letter-spacing: 0.16em`.
Sous `@media (max-width: 380px)` : masquer le `<em>Guglielmino</em>` (ou équivalent secondaire) — `.topbar a:first-child em { display: none; }`.

Voir `topbar.md` pour le pattern complet.

## 3. Apps `header.site` + `main#report` : typographie mobile dans le **même** `@media (max-width: 1024px)`

déterminant pour Chrome "Desktop site" sur Android/iOS qui reporte une viewport ≥ 980 px : un `@media (max-width: 640px)` séparé ne se déclenche jamais dans ce mode, et le rapport reste à la taille desktop (illisible).

Y mettre :

```css
@media (max-width: 1024px) {
  header.site { padding: 14px 16px; gap: 10px; }
  header.site h1 { font-size: 1.05rem; min-width: 0; overflow-wrap: break-word; word-break: break-word; }
  main#report { padding: 28px 18px 56px; max-width: 100%; min-width: 0; }
  h1.report-title { font-size: 1.8rem; word-break: break-word; }
  .lead { font-size: 1.02rem; }
  h2 { font-size: 1.25rem; word-break: break-word; }
  h3 { font-size: 1.05rem; word-break: break-word; }
  .figure { max-width: 100%; overflow: hidden; }
  .figure svg { width: 100%; max-width: 100%; height: auto; }
}
html, body { max-width: 100vw; }  /* doublure overflow-x */
```

## 4. Schémas SVG : `width: 100%; height: auto; max-width: 100%`

Sur le `<svg>` racine. Toujours fournir le bouton de zoom plein écran — sur mobile, le schéma rendu à 320 px est illisible, le zoom est l'échappatoire.

## 5. Sidebars `panel-close`

Pattern obligatoire — voir `sidebars.md`.

## 6. `<pre>` + `<code>` : overflow contrôlé

Un `<pre>` sans contrainte déborde la viewport sur mobile (formules, JSON, prompts XML). Pattern obligatoire dans le bloc `main code` de chaque app :

```css
main code { overflow-wrap: anywhere; }

main pre {
  margin: 1.5rem 0;
  padding: 14px 16px;
  background: var(--paper-2);
  border-radius: 4px;
  overflow-x: auto;
  max-width: 100%;
  font-size: 0.85em;
  line-height: 1.5;
  -webkit-overflow-scrolling: touch;
}

main pre code {
  background: transparent;
  padding: 0;
  border-radius: 0;
  font-size: 1em;
  overflow-wrap: normal;
}
```

L'`overflow-wrap: normal` interne du `pre code` empêche que le navigateur casse les lignes du bloc et fasse disparaître l'ascenseur horizontal.

**Toute nouvelle app doit embarquer ces 3 règles**, même sans `<pre>` actuel — la prochaine itération de contenu en aura.

## 7. `<table>` : `display: block; overflow-x: auto`

Par défaut un `<table>` `width: 100%` ne réduit pas en deçà de la largeur naturelle des colonnes — sur mobile, la dernière colonne est tronquée. Pattern obligatoire :

```css
@media (max-width: 1024px) {
  main table {
    display: block;
    max-width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  main th, main td { white-space: normal; }
}
```

Mécanique : `display: block` sur le `<table>` génère une table anonyme à l'intérieur qui se dimensionne à son contenu ; combiné à `overflow-x: auto`, le débordement devient un scroll horizontal plutôt qu'une troncature.

**Toute nouvelle app doit embarquer ces 2 règles**, même sans tableau présent — un comparatif arrive vite.
```

- [ ] **Step 3.4 : Créer `topbar.md`**

Path: `.claude/skills/illustrated-deep-research/references/topbar.md`

Structure (basée sur CLAUDE.md lignes 82-133, généralisée — drop la référence à la PR #29, garde le pattern technique) :

```markdown
# Topbar des pages internes — pattern 3 items

Toutes les pages **internes** d'un dossier (apps, slideshows, journal, scrollies, livre) embarquent une topbar sticky uniforme à 3 zones :

```
[Identité]    [titre du dossier (mono caps)]    [← Hub  ·  Accueil]
```

- **Gauche** : `<a href="../index.html">` — identité + lien accueil. Secondaire (prénom) masqué sous 380 px.
- **Milieu** : `<span class="dossier-context">{titre}</span>` — mono caps, `opacity: 0.55`, `max-width: 320px` avec ellipsis. **Masqué sous 768 px.** Le titre vient de l'`og:title` du hub.
- **Droite** : `<nav class="back-nav" aria-label="Navigation retour">` à 2 liens — `← Hub` (→ `index.html` du dossier) et `Accueil` (→ `../index.html#series`), séparés par `<span class="back-sep" aria-hidden="true">·</span>`. Le `←` arrow n'est que sur "Hub" pour différencier visuellement le retour proche du retour lointain. `title=` donne la version longue.

**Hubs ≠ pages internes** : les hubs `*/index.html` gardent leur topbar à 2 items (identité + `← Retour aux dossiers`) — ils SONT le hub, pas besoin du lien `← Hub`. La grille d'accueil aussi.

## Constantes structurelles

- **Hauteur** : 56 px partout (`height: 56px`, `padding: 12px 28px`)
- **Z-index** : 60 par défaut, 70 sur le livre (au-dessus de `.toc-toggle`), 99 sur scrolly avec barre de progression au-dessus
- **Background** : `rgba(<paper>, 0.82-0.85)` + `backdrop-filter: blur(10px)`
- **Apps `header.site`** : la topbar est injectée AVANT la `.layout` (pas dedans), `body { padding-top: 56px }` libère la place. L'ancien lien `.back` du `<header class="site">` est retiré.

## Ajustements obligatoires sur sticky/fixed adjacents

Toute page qui ajoute la topbar **doit** aussi ajuster ses éléments sticky/fixed pour ne pas être recouverts ou décalés :

- **Apps** : `#toc` et `#sources` passent de `top: 0; height: 100vh` à `top: 56px; height: calc(100vh - 56px)`.
- **Scrolly avec `.pin`** : `top: 56px; height: calc(100vh - 56px); height: calc(100dvh - 56px)` — sinon le pin est recouvert par la topbar pendant le scroll.
- **Livre interactif** : `.stage` passe à `top: 56px; height: calc(100vh - 56px)`. Le `.toc-toggle` descend de `top: 26px` à `top: 70px`.

## Vars CSS adaptatives selon le format hôte

Chaque page a son propre système de variables. Le bloc topbar CSS doit respecter la convention locale :

- **Apps** : `var(--ink)`, `var(--carmine)`, `var(--graphite)`, `var(--mono)`, `var(--serif)`, `var(--rule)`
- **Slideshows / journal / scrolly narratif** : `var(--text)`, `var(--accent)`, `var(--text-mid)`, `var(--text-faint)`, `var(--line)` + `'Fraunces', serif` + `'JetBrains Mono', monospace` hardcodés
- **Livre** : `var(--ink)`, `var(--ink-2)`, `var(--accent)` (pas de carmine)

## Pages hors scope

- Versions imprimables (`*-print.html`) : navigation hors propos
- Pitches internes non liés au hub
```

- [ ] **Step 3.5 : Retirer section mobile de companion-app.md**

Trouver dans `companion-app.md` la section "## Mobile-friendliness & panel close (non-negotiable)" (ou similaire). La supprimer entièrement, remplacée par :

```markdown
## Mobile-friendliness & panel close

Voir `references/mobile.md`. (Le pattern `panel-close` détaillé vivra dans `references/sidebars.md`, à créer en PR 4.)
```

PR 4 viendra updater ce pointer pour mentionner explicitement `sidebars.md` une fois créé.

- [ ] **Step 3.6 : Vérifier création + édition**

Run:
```bash
wc -l .claude/skills/illustrated-deep-research/references/mobile.md
wc -l .claude/skills/illustrated-deep-research/references/topbar.md
grep -c "Mobile-friendliness" .claude/skills/illustrated-deep-research/references/companion-app.md
```

Expected: mobile.md ~150-180 lignes ; topbar.md ~80-100 lignes ; grep retourne `1` (juste le pointer restant).

- [ ] **Step 3.7 : Remplacer section mobile dans CLAUDE.md par pointer**

Edit `CLAUDE.md` lignes 70-80 (toute la section "## Mobile-friendliness") par :

```markdown
## Mobile-friendliness

Checklist 7 points : `.claude/skills/illustrated-deep-research/references/mobile.md`.

**Override repo** :
- Scrolly avec `position: sticky` (ex. `anatomie/scrolly.html`) : utiliser `overflow-x: clip` au lieu de `hidden` — sinon le sticky casse (avec fallback `overflow-x: hidden` déclaré juste avant pour Safari < 16).

Avant merge : vérifier la checklist **sur device réel ou Chrome devtools en mode mobile** (pas "desktop site").
```

- [ ] **Step 3.8 : Remplacer section topbar dans CLAUDE.md par pointer**

Edit `CLAUDE.md` lignes 82-133 (toute la section "## Topbar des pages internes (3 items)" et ses sous-sections jusqu'à la fin de "### Outils") par :

```markdown
## Topbar des pages internes (3 items)

Pattern complet : `.claude/skills/illustrated-deep-research/references/topbar.md`.

**Outils repo** (idempotents, rejouables sur futurs dossiers) :
- `tools/add_dossier_topbar.py` — injecte la topbar (CSS + HTML) dans les apps `header.site` qui n'en ont pas, ajuste TOC/Sources sticky, retire l'ancien `.back` du `header.site`. Pour ajouter un nouveau dossier app : ajouter le fichier dans la liste `APPS` et relancer.
- `tools/add_topbar_dossier_title.py` — ajoute le `<span class="dossier-context">` à toute page qui a déjà une topbar. Lit l'`og:title` du hub.

Pour scrollies / livre / gouvernance scrolly : edits manuels ciblés (chaque page a sa structure spécifique).
```

- [ ] **Step 3.9 : Vérifier réduction CLAUDE.md**

Run:
```bash
wc -c CLAUDE.md
```

Expected: ~24-26k chars (perte de ~8-9k chars vs après PR 2 : sections mobile ~1.5k + topbar+sous-sections ~6.5k remplacées par pointers ~1k).

- [ ] **Step 3.10 : Stage et commit**

Run:
```bash
git add CLAUDE.md
git add -f .claude/skills/illustrated-deep-research/references/mobile.md
git add -f .claude/skills/illustrated-deep-research/references/topbar.md
git add -f .claude/skills/illustrated-deep-research/references/companion-app.md
git diff --cached --stat
```

Expected: 4 fichiers (1 modifié + 2 créés + 1 modifié skill).

Then commit avec message qui inclut la liste des conflits résolus (depuis le scratch doc du Step 3.2) :

```bash
git commit -m "$(cat <<'EOF'
refacto(claude-md): PR 3/5 — mobile + topbar vers skill

Nouveaux fichiers skill mono-thème :
- references/mobile.md (checklist 7 points, ~170 lignes)
- references/topbar.md (pattern 3 items + sticky-adjustments, ~90 lignes)

companion-app.md : section mobile retirée (déplacée vers mobile.md).
CLAUDE.md : 2 sections remplacées par pointers + overrides repo
(scrolly overflow-x clip, outils add_dossier_topbar / add_topbar_dossier_title).

Conflits résolus :
- [lister ici les conflits identifiés au Step 3.2, ex. "skill avait
  pattern panel-close JS complet, CLAUDE.md avait juste le HTML — fusionné
  avec JS complet de la skill"]
- [...]

Spec : docs/superpowers/specs/2026-05-20-claude-md-skill-refactor-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 3.11 : Push branche + créer PR**

Run:
```bash
git push -u origin claude/refacto-claude-md-skill-3-mobile-topbar-2026-05-20
```

Then create PR via `mcp__github__create_pull_request` (owner `mathieugug`, repo `mathieugug.github.io`, title `refacto(claude-md) PR 3/5 — mobile + topbar vers skill`, head `claude/refacto-claude-md-skill-3-mobile-topbar-2026-05-20`, base `main`).

PR body **doit lister explicitement les conflits résolus** (depuis le scratch doc du Step 3.2).

**Stop and wait for user merge before starting Task 4.**

---

## Task 4 (PR 4) — Sidebars (groupe "data panels")

**Branche :** `claude/refacto-claude-md-skill-4-sidebars-2026-05-20` (créée depuis main après merge PR 3)

**Files:**
- Create: `.claude/skills/illustrated-deep-research/references/sidebars.md`
- Modify: `.claude/skills/illustrated-deep-research/references/companion-app.md` (retire section sidebars + ajuste pointer mobile)
- Modify: `CLAUDE.md` (remplace section Apps interactives — sidebars + sous-section sources par pointer)

**Source material :**
- `CLAUDE.md` lignes 135-166 (section "## Apps interactives — sidebars Sommaire/Sources" + sous-section "### Convention des entrées de sources")
- `companion-app.md` section sidebars (chercher "TOC", "Sources", "panel-close", "sources-collapse" ; typiquement plusieurs blocs à fusionner)

### Étapes

- [ ] **Step 4.1 : Créer branche depuis main**

Run:
```bash
git fetch origin main
git checkout -b claude/refacto-claude-md-skill-4-sidebars-2026-05-20 origin/main
```

- [ ] **Step 4.2 : Diff 3-way pour sidebars**

Lire en parallèle :
```bash
sed -n '135,166p' CLAUDE.md
grep -n "TOC\|Sources\|panel-close\|sources-collapse" .claude/skills/illustrated-deep-research/references/companion-app.md
```

Identifier conflits/overlap (notamment : `sources-collapse-btn` `position: fixed` vs `absolute` — bug récent CLAUDE.md ; format `<li id="source-N">` bracketed + full URL — convention récente CLAUDE.md). Noter dans scratch doc pour PR body.

- [ ] **Step 4.3 : Créer `sidebars.md`**

Path: `.claude/skills/illustrated-deep-research/references/sidebars.md`

Structure (fusion CLAUDE.md lignes 135-166 + sections sidebars de companion-app.md, généralisée — drop dates type "cas vu le 2026-05-04") :

Sections :
1. Vue d'ensemble (TOC à gauche, Sources à droite, dans la grille `.layout`)
2. Sticky height calc `top: 56px; height: calc(100vh - 56px)` — **pourquoi `height` > `max-height` avec `align-self: start`** (sinon le panneau se rétrécit à la hauteur de son contenu = trou en bas si liste plus courte qu'une viewport)
3. Pattern `panel-close` mobile (CSS + HTML + JS avec yield zoom/modal sur Escape) — verbatim depuis le pattern existant
4. `#sources-collapse-btn` — **pivot : `position: fixed`, pas `absolute`** (en absolute le bouton scrolle avec le contenu interne du panneau). Snippet CSS canonique : `position: fixed; top: 50%; right: 320px; transform: translate(50%, -50%); z-index: 70;`
5. Format canonique `<li id="source-N">` — `[N]` bracketed littéral dans le HTML (pas pseudo-element), URL complète comme texte de lien (pas label host raccourci), `<br>` avant le `<a>`, `<span class="accessed">Accessed YYYY-MM-DD</span>`. Snippet HTML complet + CSS canonique (couleurs, tailles) + `overflow-wrap: anywhere` sur `#sources li a` comme filet de sécurité
6. Convention legacy à migrer au passage : `<span class="cite-num">N</span>` sans crochets + `<a>host ↗</a>` (pre-mai 2026) — toute édition d'app sur ses sources doit basculer au pattern bracketed + full URL

Cible : ~150-180 lignes.

- [ ] **Step 4.4 : Retirer section sidebars de companion-app.md + ajuster pointer mobile**

Dans `companion-app.md`, trouver le pointer "## Mobile-friendliness & panel close" inséré en PR 3, et le remplacer par :

```markdown
## Mobile-friendliness & panel close

Voir `references/mobile.md` (checklist 7 points) et `references/sidebars.md` (pattern `panel-close` détaillé, sticky math, format sources).
```

Puis chercher tout contenu sidebars résiduel dans `companion-app.md` (`#toc`, `#sources`, `panel-close`, `sources-collapse-btn`) et le retirer (devrait être limité à des mentions en passant le cas échéant).

Run:
```bash
grep -n "panel-close\|sources-collapse\|#toc\|#sources" .claude/skills/illustrated-deep-research/references/companion-app.md
```

Expected: peu de hits, juste le pointer mobile/sidebars + éventuelles mentions architecturales (ex. dans la description du layout 3-col).

- [ ] **Step 4.5 : Vérifier création + édition**

Run:
```bash
wc -l .claude/skills/illustrated-deep-research/references/sidebars.md
grep -c "sources-collapse-btn" .claude/skills/illustrated-deep-research/references/companion-app.md
```

Expected: sidebars.md ~150-180 lignes ; grep retourne `0` ou `1` (s'il reste une mention en passant).

- [ ] **Step 4.6 : Remplacer section sidebars dans CLAUDE.md par pointer**

Edit `CLAUDE.md` lignes 135-166 (toute la section "## Apps interactives — sidebars Sommaire/Sources" et sa sous-section "### Convention des entrées de sources") par :

```markdown
## Apps interactives — sidebars Sommaire/Sources

Pattern complet (structure HTML, sticky math, `panel-close` mobile, `sources-collapse-btn`, format canonique `<li id="source-N">`) : `.claude/skills/illustrated-deep-research/references/sidebars.md`.
```

- [ ] **Step 4.7 : Vérifier réduction CLAUDE.md**

Run:
```bash
wc -c CLAUDE.md
```

Expected: ~21-23k chars (perte de ~3-4k chars vs après PR 3).

- [ ] **Step 4.8 : Stage et commit**

Run:
```bash
git add CLAUDE.md
git add -f .claude/skills/illustrated-deep-research/references/sidebars.md
git add -f .claude/skills/illustrated-deep-research/references/companion-app.md
git diff --cached --stat
```

Expected: 3 fichiers (CLAUDE.md modifié, sidebars.md créé, companion-app.md ajusté).

Then commit avec liste des conflits résolus :

```bash
git commit -m "$(cat <<'EOF'
refacto(claude-md): PR 4/5 — sidebars TOC/Sources + format sources

Nouveau fichier skill : references/sidebars.md (~170 lignes) qui regroupe
TOC + Sources structure, sticky math (height vs max-height), panel-close
mobile, sources-collapse-btn position fixed (pivot), et le format
canonique <li id="source-N"> bracketed + full URL.

CLAUDE.md : section + sous-section remplacées par pointer.

Conflits résolus :
- [lister depuis scratch doc Step 4.2]

Spec : docs/superpowers/specs/2026-05-20-claude-md-skill-refactor-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4.9 : Push branche + créer PR**

Run:
```bash
git push -u origin claude/refacto-claude-md-skill-4-sidebars-2026-05-20
```

Then create PR via `mcp__github__create_pull_request` (title `refacto(claude-md) PR 4/5 — sidebars + format sources`, head `claude/refacto-claude-md-skill-4-sidebars-2026-05-20`, base `main`).

**Stop and wait for user merge before starting Task 5.**

---

## Task 5 (PR 5) — Quiz + audit final

**Branche :** `claude/refacto-claude-md-skill-5-quiz-audit-2026-05-20` (créée depuis main après merge PR 4)

**Files:**
- Modify: `.claude/skills/illustrated-deep-research/references/quiz-authoring.md` (enrichi CSS local + IIFE detection + liste sidecars)
- Modify: `.claude/skills/illustrated-deep-research/SKILL.md` (audit final pointers)
- Modify: `.claude/skills/illustrated-deep-research/references/companion-app.md` (audit cohérence après allègement)
- Modify: `CLAUDE.md` (remplace section quiz par pointer + audit final)

**Source material :**
- CLAUDE.md lignes 168-182 (section "## Quiz cards (vérification de compréhension)")
- `quiz-authoring.md` actuel (à enrichir, pas à recréer)

### Étapes

- [ ] **Step 5.1 : Créer branche depuis main**

Run:
```bash
git fetch origin main
git checkout -b claude/refacto-claude-md-skill-5-quiz-audit-2026-05-20 origin/main
```

- [ ] **Step 5.2 : Lire `quiz-authoring.md` actuel et section quiz CLAUDE.md**

Run:
```bash
wc -l .claude/skills/illustrated-deep-research/references/quiz-authoring.md
sed -n '168,182p' CLAUDE.md
```

Identifier ce qui manque dans `quiz-authoring.md` que CLAUDE.md couvre :
- Note IIFE detection : `insert-quizzes.py` détecte `<script src="/assets/dossier-app.js">` et **skip** l'injection CSS + IIFE pour éviter double binding. CSS quiz doit donc être embarqué localement dans la `<style>` de chaque app qui utilise la lib partagée (le shared CSS ne le contient pas).
- Bloc CSS canonique des quiz (~150 lignes typiquement) — référencer un exemple d'app deep-research existante plutôt que de l'inliner.
- Liste sidecars existants à date : evaluation-agentique, ia-frugale, observabilite-agents-ia, process-reward-models. Apps quizzées sans sidecar (legacy hand-rolled) à migrer au passage : surfaces-agentiques, agent-sdk, ia-et-travail, mcp-plateforme, benchmarks-contestes, measure-roi, analytics-agentique-gcp.
- Anti-pattern hand-rolled : marche mais désynchronise JSON ↔ HTML.

- [ ] **Step 5.3 : Enrichir `quiz-authoring.md`**

Ajouter une section "## Integration avec lib partagée `/assets/dossier-app.js`" qui contient les 3 points :
1. Détection automatique du shared lib par `insert-quizzes.py` → skip injection CSS + IIFE
2. CSS quiz à embarquer localement (le shared CSS ne le contient pas à date) — référencer une app existante comme source du bloc CSS canonique
3. Liste sidecars existants vs apps legacy hand-rolled à migrer

Ajouter une section "## Anti-pattern : hand-rolled" qui explique :
- Écrire le markup à la main marche techniquement (le shared `setupQuizzes()` ne dépend que des sélecteurs `.quiz-q__*`)
- Mais désynchronise JSON ↔ HTML et oblige toute correction ultérieure à être faite deux fois
- Si une nouvelle app n'a pas encore de `quizzes.json` : **créer le JSON d'abord**, lancer le script ensuite

- [ ] **Step 5.4 : Vérifier enrichissement**

Run:
```bash
wc -l .claude/skills/illustrated-deep-research/references/quiz-authoring.md
grep -c "Integration avec lib partagée" .claude/skills/illustrated-deep-research/references/quiz-authoring.md
grep -c "Anti-pattern" .claude/skills/illustrated-deep-research/references/quiz-authoring.md
```

Expected: ~280-310 lignes (vs ~229 initial) ; chaque grep retourne `1`.

- [ ] **Step 5.5 : Remplacer section quiz dans CLAUDE.md par pointer**

Edit `CLAUDE.md` lignes 168-182 (toute la section "## Quiz cards") par :

```markdown
## Quiz cards (vérification de compréhension)

Workflow JSON-first, spec complète : `.claude/skills/illustrated-deep-research/references/quiz-authoring.md`.

**Commande repo** (idempotent, à re-runner après chaque édition du JSON) :
```
python .claude/skills/illustrated-deep-research/assets/insert-quizzes.py \
  --app <path/to/app.html> --quizzes <path/to/quizzes.json>
```

**Sidecars existants** (pattern reproductible) : `evaluation-agentique/quizzes.json`, `ia-frugale/quizzes.json`, `observabilite-agents-ia/quizzes.json`, `process-reward-models/quizzes.json`.
```

- [ ] **Step 5.6 : Audit final — re-lire CLAUDE.md end-to-end**

Run:
```bash
wc -c CLAUDE.md
grep -n "^##" CLAUDE.md
```

Verify:
- Taille finale ≤ 14 000 chars (objectif spec)
- Toutes les sections gardées sont repo-only (Quick Reference, Cadrage éditorial, Schémas SVG, Structure du repo, Mode admin, Index, Workflow, Versionnement skill, Création de PR, Push direct main) + 6-8 pointers vers skill/assets
- Aucun pointer cassé : pour chaque pointer, vérifier que le fichier cible existe

```bash
# Vérifier les pointers
for f in callouts mobile topbar sidebars quiz-authoring; do
  test -f .claude/skills/illustrated-deep-research/references/$f.md && echo "$f.md OK" || echo "$f.md MISSING"
done
test -f assets/README.md && echo "assets/README.md OK" || echo "assets/README.md MISSING"
```

Expected: tous OK.

- [ ] **Step 5.7 : Audit `companion-app.md` allégé**

Run:
```bash
wc -l .claude/skills/illustrated-deep-research/references/companion-app.md
```

Expected: ~500-650 lignes (vs 1131 initial). Re-lire rapidement pour vérifier que c'est une narration logique (architecture → layout → baseline interactions → zoom → micro-patterns stabilo/obsidian) et pas un patchwork avec sections orphelines.

- [ ] **Step 5.8 : Mettre à jour SKILL.md (pointers vers nouveaux fichiers)**

Edit `.claude/skills/illustrated-deep-research/SKILL.md` :
- Section "Workflow at a glance" : mentionner les nouveaux `references/{mobile,topbar,sidebars,callouts}.md` aux endroits logiques (typiquement après companion-app.md dans la liste des références)
- Si SKILL.md a une table des matières des references/, l'enrichir avec les 4 nouveaux fichiers + brève description

- [ ] **Step 5.9 : Re-run CI (non-régression)**

Run:
```bash
node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs
```

Expected: tous les tests passent (refacto purement documentaire, code apps non touché).

- [ ] **Step 5.10 : Vérification visuelle sur 3 apps représentatives**

Ouvrir dans le navigateur (juste vérifier que le markup HTML / CSS / JS n'a pas été touché) :
```bash
git diff main -- "evaluation-agentique/*.html" "observabilite-agents-ia/*.html" "agent-sdk/*.html"
```

Expected: aucun diff (refacto purement doc).

- [ ] **Step 5.11 : Stage et commit**

Run:
```bash
git add CLAUDE.md
git add -f .claude/skills/illustrated-deep-research/references/quiz-authoring.md
git add -f .claude/skills/illustrated-deep-research/SKILL.md
git diff --cached --stat
```

Then:
```bash
git commit -m "$(cat <<'EOF'
refacto(claude-md): PR 5/5 — quiz + audit final

Enrichit references/quiz-authoring.md (CSS local + IIFE detection +
liste sidecars/legacy). CLAUDE.md : section quiz remplacée par pointer.

Audit final :
- CLAUDE.md : <wc -c value> chars (objectif ≤ 14k atteint)
- SKILL.md mis à jour pour pointer les 4 nouveaux fichiers
  (callouts.md, mobile.md, topbar.md, sidebars.md)
- companion-app.md allégé : <wc -l value> lignes (vs 1131 initial)
- CI passe inchangée (refacto purement documentaire)
- Aucun diff sur le code des apps

Spec : docs/superpowers/specs/2026-05-20-claude-md-skill-refactor-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5.12 : Push branche + créer PR**

Run:
```bash
git push -u origin claude/refacto-claude-md-skill-5-quiz-audit-2026-05-20
```

Then create PR via `mcp__github__create_pull_request` (title `refacto(claude-md) PR 5/5 — quiz + audit final`, head `claude/refacto-claude-md-skill-5-quiz-audit-2026-05-20`, base `main`).

PR body :
```markdown
## PR 5/5 — Quiz + audit final

Termine la refacto CLAUDE.md ↔ skill.

### Changements
- ✏️ `references/quiz-authoring.md` enrichi : IIFE detection, CSS local embarqué, liste sidecars vs legacy
- ✏️ `SKILL.md` mis à jour pour pointer les 4 nouveaux fichiers
- ✏️ `CLAUDE.md` : section quiz remplacée par pointer + commande repo

### Métriques de succès (depuis spec)
- ✅ `wc -c CLAUDE.md` ≤ 14 000 — **résultat : <à remplir>**
- ✅ 0 pattern technique partagé décrit deux fois
- ✅ 4 nouveaux fichiers skill mono-thème (callouts, mobile, topbar, sidebars)
- ✅ CI `node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs` passe
- ✅ Pas de régression visuelle sur 3 apps représentatives

Spec : `docs/superpowers/specs/2026-05-20-claude-md-skill-refactor-design.md`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

**Refacto complète.**
