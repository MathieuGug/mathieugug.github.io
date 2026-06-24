# Routine — `Illustrated deep research · mer + ven`

> **Source de vérité versionnée du prompt de la routine Claude cloud.**
> La routine elle-même est **distante** (Claude cloud, planifiée mer + ven). Ce fichier n'est pas exécuté : il sert d'archive éditable. Pour mettre la routine à jour, **recopier ce contenu** dans la config de la routine côté Claude cloud.

## Changelog

- **2026-06-23 — fix boucle « désagrégation prefill/decode ».** La routine a reproduit quatre fois le même sujet (branches `claude/research-desagregation-prefill-decode-2026-06-{12,15,22}` + `claude/research-desagregation-inference-2026-06-17`), aucune mergée.
  **Cause racine** : le filtre anti-doublon (Phase 1) ne lisait que la section « Déjà couverts » du `BACKLOG.md`. Or cette section n'avance qu'**au merge** : la routine la met à jour *sur sa branche*, mais comme Mathieu ne merge pas automatiquement, `main` ne reçoit jamais la mise à jour. Résultat : un WIP poussé-mais-non-mergé est **invisible** au run suivant, et le backlog `main` continue d'**inviter** le sujet (ligne « Suite naturelle (b) désagrégation prefill/decode »). Boucle garantie. Le run du 17 a même utilisé un slug différent (`desagregation-inference`), donc un simple check par nom de dossier l'aurait raté.
  **Fix** : la Phase 1 lit désormais **deux** sources d'historique — « Déjà couverts » **ET** les branches `claude/research-*` poussées sur le remote (mergées ou non). Un sujet présent dans l'une OU l'autre est exclu. Voir Phase 1 ci-dessous.

---

# Prompt de la routine

Tâche : produire UN article de deep research illustré (rapport markdown + app HTML companion + 5-7 SVG éditoriaux) pour mathieugug.github.io. Tu choisis le sujet. Livraison via PR. Architecture par phases checkpointées — chaque phase commite, pousse, passe à la suivante. Anti-timeout : si tu sens la limite arriver, abrège — toute phase poussée est durable.

## Règle d'or anti-timeout

> **Après chaque sous-phase, `git add <fichiers> && git commit -m "<phase>" && git push origin <branche>`. La branche WIP doit toujours être poussée à jour.**

Si temps total > 90 min cumulées, ARRÊTE à la prochaine sous-phase et passe direct à la PR avec le WIP en l'état. Mathieu finira à la main.

## Phase 0 — Setup

```
git fetch origin dev
git checkout origin/dev -- .claude/skills/illustrated-deep-research/
```
NE COMMIT PAS `.claude/skills/...`.

Lis (Read), dans cet ordre :
1. `CLAUDE.md` racine (éditorial, palette, mobile 7 points, sidebars, SVG, surlignage stabilo)
2. `.claude/skills/illustrated-deep-research/SKILL.md` (lis ENTIÈREMENT, en particulier la section `## Avoid token-heavy app rewrites — use \`assets/build-app.py\``)
3. `.claude/skills/illustrated-deep-research/references/companion-app.md` (architecture app HTML)
4. `.claude/skills/illustrated-deep-research/references/svg-editorial-style.md`
5. `.claude/skills/illustrated-deep-research/references/workflow.md` (méthodo recherche)
6. `.claude/skills/illustrated-deep-research/assets/app-template.html` (un template possible)
7. **Liste les apps récentes du site** : `ls -lt */*-app.html | head -3`. La plus récente sert de host scaffold préféré — sa CSS/JS framework est déjà battle-tested.
8. `proces-musk-altman/index.html` (pattern hub par dossier)

Lis aussi `BACKLOG.md` racine. Crée-le s'il n'existe pas avec :
```markdown
# Backlog éditorial — illustrated deep research
_Mis à jour par la routine `Illustrated deep research · mer + ven`._

## En cours / prio haute
- [ ] (vide)

## Deep dives candidats sur dossiers existants
- (par dossier)

## Sujets evergreen — backlog
- (sujets structurels)

## Watchlist actu
- (sorties modèles, audiences, papiers, M&A)

## Déjà couverts (date · slug · angle)
- (historique anti-répétition)
```

## Phase 1 — Choix du sujet + branche

Stratégies (ordre de préférence) :
1. Deep dive sur un dossier existant (`agents-computer-use`, `anatomie`, `evaluation-agentique`, `gouvernance`, `harness-agentique`, `ia-et-travail`, `llm-jailbreaking`, `memoire-agentique`, `narrative-experiences`, `observabilite-agents-ia`, `proces-musk-altman`, `world-models`)
2. Actu IA majeure de la semaine (avec densité analytique)
3. Evergreen prio du backlog
4. Nouveau sujet structurel

### Filtre anti-doublon — DEUX sources d'historique, pas une (corrigé 2026-06-23)

Un sujet est **déjà traité** — et donc exclu — s'il apparaît dans **l'une OU l'autre** de ces sources :

1. **Section « Déjà couverts » du `BACKLOG.md`** (sujets mergés sur `main`).
2. **Branches `research-*` déjà poussées sur le remote, MÊME non mergées.** Liste-les en début de phase :
   ```bash
   git ls-remote --heads origin 'refs/heads/claude/research-*' | sed 's#.*refs/heads/claude/research-##'
   ```
   Chaque slug renvoyé correspond à un sujet **déjà tenté**. Les PR de la routine ne sont **jamais auto-mergées** : une branche poussée est durable et compte comme couverte, même sans dossier sur `main`. Attention aux variantes de slug (`desagregation-prefill-decode` vs `desagregation-inference` = même sujet) — compare sur le **fond du sujet**, pas sur la chaîne exacte.
3. **Skim des hubs** des dossiers existants (filet de sécurité).

> ⚠️ Les lignes « Suite naturelle : (a)… (b)… » du backlog sont des **suggestions, pas une file à vider**. Une suite naturelle déjà tentée (présente en source 1 ou 2) est exclue exactement comme un sujet couvert. Si tu choisis une suite naturelle, c'est qu'aucune branche `research-*` ne la couvre déjà.

Si ton premier candidat matche (1) OU (2), passe au suivant. En cas de doute sur un quasi-doublon, **change de sujet** : mieux vaut un angle neuf qu'un cinquième run sur le même thème.

```
git checkout -b claude/research-<slug>-YYYY-MM-DD
git commit --allow-empty -m "research(<slug>): kickoff"
git push -u origin claude/research-<slug>-YYYY-MM-DD
```

## Phase 2 — Research + outline (CHECKPOINT)

Sources tier-1 uniquement. 8-12 sources clés, web_fetch les plus importantes.

Écris `<slug>/.outline.md` :
- Thèse centrale (1-2 phrases)
- Plan 6-9 sections avec leads
- Liste numérotée des 8-12 sources (URL + 1 ligne pertinence)
- Liste des 5-7 schémas (brief 1 ligne) AVEC pour chaque schéma 2-4 zones cliquables (modals)

Mets `[ ] <slug>` sous "En cours / prio haute" dans `BACKLOG.md`.

```
git add <slug>/.outline.md BACKLOG.md
git commit -m "wip(<slug>): outline + sources"
git push origin <branche>
```

## Phase 3 — rapport.md (CHECKPOINT)

Produis `<slug>/YYYYMMDD-<slug>-rapport.md` complet :
- Byline : `> **<thèse>** — <date>, Mathieu Guglielmino`
- Sections selon le plan, footnotes `[^N]`
- Placeholders `[SCHEMA-01]` ... `[SCHEMA-N]` aux endroits où les SVG iront
- Section finale `## Sources` avec footnotes
- Surlignage stabilo `==texte==` sur 3-5 phrases-clés

```
git add <slug>/YYYYMMDD-<slug>-rapport.md
git commit -m "wip(<slug>): rapport.md"
git push origin <branche>
```

## Phase 4 — SVG un par un (CHECKPOINT APRÈS CHAQUE)

Pour N de 01 à 5-7 :
1. Produis `<slug>/images/YYYYMMDD-NN-<schema-slug>.svg` (style éditorial, palette site, flèches propres)
2. Remplace `[SCHEMA-NN]` du rapport par `![alt|width=1200](images/YYYYMMDD-NN-<schema-slug>.svg)`
3. Checkpoint :
```
git add <slug>/images/YYYYMMDD-NN-*.svg <slug>/YYYYMMDD-<slug>-rapport.md
git commit -m "wip(<slug>): svg NN"
git push origin <branche>
```

Si timeout proche après 4-5 SVG : ARRÊTE et passe à phase 5.

## Phase 5 — App HTML via `build-app.py` (5 SOUS-PHASES)

**STRATÉGIE** : tu n'écris PAS l'app HTML à la main. Tu produis 3 petits fragments + tu lances le script `build-app.py` qui assemble tout. Lis `## Avoid token-heavy app rewrites` dans SKILL.md pour le détail. Ratio token : ~10x plus efficace que des Edit chains.

### 5a — Host scaffold + header tweaks (CHECKPOINT)

Choisis le **host scaffold** :
- **Préférence** : la plus récente app shippée du site — son framework (CSS, JS, mobile, sticky sidebars, panel-close, zoom) est déjà battle-tested contre CLAUDE.md.
- Fallback : `.claude/skills/illustrated-deep-research/assets/app-template.html` (template propre).

Copie le scaffold à sa destination finale :
```
cp <chemin-host-scaffold> <slug>/YYYYMMDD-<slug>-app.html
```

Puis fais 5-8 Edit ciblés pour customiser le header :
- `<title>...</title>`
- `<meta name="description">...`
- `header.site h1` (titre de l'app)
- Eyebrow / date dans le header
- Byline / lede dans `<main id="report">` (la prose elle-même sera écrasée en 5d — ici tu touches juste à l'échafaudage avant)
- Bouton retour vers `../index.html#series`
- Lien de download du rapport `.md` s'il existe dans le scaffold source
- Date et signature dans le footer (`Mathieu Guglielmino · Practice Manager Lincoln` + `Format co-écrit avec l'aide d'une IA`)

Favicon `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` doit déjà être là si scaffold = app site.

```
git add <slug>/YYYYMMDD-<slug>-app.html
git commit -m "wip(<slug>): app scaffold + header"
git push origin <branche>
```

### 5b — main-fragment.html (CHECKPOINT)

C'est la conversion rapport.md → HTML, le morceau qui remplacera `<main id="report">...</main>` du host. Écris `<slug>/.build/main-fragment.html` (dossier `.build/` éphémère, supprimé phase 6) :

- Titre : `<h1 class="report-title">...`
- Lede : `<p class="lead">...`
- Sections : `<section><h2 id="slug-section">...</h2><p>...</p>...</section>`
- Sous-sections : `<h3 id="slug-sub">...`
- `**gras**` → `<strong>`, `*italique*` → `<em>`, `==surligné==` → `<mark>`
- `[texte](url)` → `<a href="url">texte</a>`
- `[^N]` (footnote) → `<sup><a href="#source-N" class="cite" data-src="N">[N]</a></sup>`
- `![alt|width=W](images/file.svg)` → `<figure class="figure" id="fig-NN"><!--INLINE-SVG:NN--><figcaption>alt</figcaption></figure>` (le marker INLINE-SVG sera remplacé par le script)
- Pour les termes techniques : wrappe-les dans `<span class="term" data-tooltip="définition courte">terme</span>` — 5-15 termes au total. Pas de dict JS, c'est inline (cf. SKILL.md tooltip note).

Ne répète PAS la section `## Sources` du rapport ici — elle vit dans le sources fragment et la sidebar.

```
git add <slug>/.build/main-fragment.html
git commit -m "wip(<slug>): main-fragment"
git push origin <branche>
```

### 5c — sources-fragment.html (CHECKPOINT)

Écris `<slug>/.build/sources-fragment.html` : juste les `<li>` qui iront dans `<ol id="sources-list">`. Format pour chaque source :
```html
<li id="source-N" data-num="N">
  <span class="src-host">DOMAINE</span>
  <a href="URL_COMPLETE">Titre court de la source</a>
  <p class="src-context">1-2 lignes : pourquoi cette source compte / quel angle elle apporte</p>
</li>
```
N = 1, 2, ... (matche les `[^N]` du rapport).

```
git add <slug>/.build/sources-fragment.html
git commit -m "wip(<slug>): sources-fragment"
git push origin <branche>
```

### 5d — schemas-fragment.js (CHECKPOINT)

Écris `<slug>/.build/schemas-fragment.js` : l'object literal qui définit les modals des schémas. Format :
```js
{
  "schema-01": {
    title: "Titre du schéma 01",
    regions: {
      "region-1": { title: "Zone 1", body: "Markdown du modal, 80-150 mots, peut contenir [^1] qui linke vers source-1" },
      "region-2": { title: "Zone 2", body: "..." }
    }
  },
  "schema-02": { }
}
```
Pas de `const SCHEMAS = ` prefix, pas de `;` final — le script wrappe.

Pour que les regions soient cliquables : ajoute des `data-region="region-1"` sur des groupes ou éléments dans les SVG correspondants. Si tu as oublié en phase 4, c'est l'occasion de faire un Edit ciblé sur chaque SVG (mais tu peux aussi laisser sans regions — les modals afficheront alors juste un descriptif global au clic-fond).

```
git add <slug>/.build/schemas-fragment.js
git commit -m "wip(<slug>): schemas-fragment"
git push origin <branche>
```

### 5e — Run build-app.py + vérifications (CHECKPOINT)

```bash
python3 .claude/skills/illustrated-deep-research/assets/build-app.py \
  --host    <slug>/YYYYMMDD-<slug>-app.html \
  --main    <slug>/.build/main-fragment.html \
  --sources <slug>/.build/sources-fragment.html \
  --schemas <slug>/.build/schemas-fragment.js \
  --images  <slug>/images \
  --out     <slug>/YYYYMMDD-<slug>-app.html
```
Le script écrit *par-dessus* le host (idempotent, sortie = entrée). Si erreur (marker absent, fragment malformé), il fail-fast — lis le message, fixe, re-lance.

Vérifications obligatoires :
```bash
grep -nE '\{\{|\[SCHEMA-|<!--\s*INLINE-SVG' <slug>/YYYYMMDD-<slug>-app.html  # doit être vide
```
Si un marker survit → fix et re-lance le script.

```
git add <slug>/YYYYMMDD-<slug>-app.html
git commit -m "wip(<slug>): build app"
git push origin <branche>
```

## Phase 6 — Hub + carte racine + cleanup + backlog (CHECKPOINT)

1. `<slug>/index.html` : hub calqué sur `proces-musk-altman/index.html` (eyebrow + titre + lede + cartes des formats : rapport, app). Bouton retour vers `../index.html#series`. Favicon. Footer Lincoln + IA.
2. `<slug>/README.md` : court (cf. SKILL.md).
3. `index.html` racine : ajoute la carte du nouvel artefact EN HAUT de la grille `#series` (date décroissante). NN = max + 1. Badge `Dossier` (ou `Veille` accent si veille).
4. Supprime `<slug>/.outline.md` ET le dossier `<slug>/.build/` (éphémères) :
```bash
rm -rf <slug>/.build <slug>/.outline.md
```
5. `BACKLOG.md` final : retire `[ ] <slug>` de "En cours", ajoute `YYYY-MM-DD · <slug> · <angle>` dans "Déjà couverts", ajoute les sujets connexes identifiés dans la bonne section. **Si le sujet vient d'une « Suite naturelle » du backlog, barre cette ligne (`~~…~~ ✓ couvert YYYY-MM-DD`) pour qu'elle cesse d'inviter le sujet** — même logique que le filtre anti-doublon Phase 1.

Vérifie `git status` : aucun `.claude/...` staged. Si oui : `git restore --staged .claude/`.

```
git add <slug>/index.html <slug>/README.md index.html BACKLOG.md
git add -u <slug>/   # capture suppression .outline.md + .build/
git commit -m "feat(<slug>): hub + carte racine + backlog"
git push origin <branche>
```

## Phase 7 — PR

```
gh pr create \
  --title "Research · <slug> — <titre court>" \
  --body "<résumé 6-10 lignes : sujet + thèse + stratégie 1/2/3/4 + fichiers + 3 sources clés + état backlog>"
```
NE MERGE PAS. Si échec, abandonne — la branche est poussée, Mathieu peut ouvrir la PR.

## Output final

Résumé court :
- Stratégie (1/2/3/4) + pourquoi
- Slug + thèse
- Phases atteintes (jusqu'où tu es allé)
- Host scaffold utilisé (lequel)
- Fichiers produits
- 3 sources clés
- URL PR ou branche WIP
- MAJ BACKLOG.md (3-5 lignes)
