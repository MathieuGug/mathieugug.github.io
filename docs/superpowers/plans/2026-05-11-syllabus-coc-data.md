# Syllabus CoC Data — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire un dossier `syllabus/` autonome qui contient le document maître (`syllabus.md`), un hub HTML interne (`index.html`), 5 slideshows interactifs (4 sessions courtes + 1 événement final) et 4 SVG inédits du baromètre, prêts à être animés par Mathieu pour acculturer le CoC data (~400 ingénieurs, 103 répondants au baromètre).

**Architecture:** Reproduit le pattern HTML/CSS/JS vanille du site (`coding-agents/`, `measure-roi/`, etc.) en réutilisant la lib partagée `/assets/dossier-app.{js,css}` et le template slideshow de la skill `illustrated-deep-research`. Aucun framework, aucun build. Les slideshows pointent directement vers les SVG des dossiers existants (`../coding-agents/images/...`) ; seuls les SVG du baromètre sont créés localement dans `syllabus/images/baromètre/`.

**Tech Stack:** HTML5, CSS3 (variables CSS, grid, flex, `@media`), JavaScript vanille (IIFE, pas de bundler), SVG inline. Polices Google (Fraunces / Inter / JetBrains Mono). Tests Node.js (`node --test`) pour validation contractuelle de la lib partagée.

**Spec source:** `docs/superpowers/specs/2026-05-11-syllabus-coc-data-design.md`

**Branche:** `claude/syllabus-coc-data` (déjà créée, spec déjà committé en `0340dda` + `adcc1c6`)

---

## Vue d'ensemble des tâches

| # | Tâche | Fichiers principaux |
|---|---|---|
| 1 | Squelette du dossier `syllabus/` | `syllabus/` + sous-dossier `images/baromètre/` |
| 2 | SVG baromètre #1 — chiffres clés | `syllabus/images/baromètre/baro-01-chiffres-cles.svg` |
| 3 | SVG baromètre #2 — profil répondants | `syllabus/images/baromètre/baro-02-profil-repondants.svg` |
| 4 | SVG baromètre #3 — adoption & impact | `syllabus/images/baromètre/baro-03-adoption-impact.svg` |
| 5 | SVG baromètre #4 — tâches par profil | `syllabus/images/baromètre/baro-04-taches-par-profil.svg` |
| 6 | Document maître `syllabus.md` | `syllabus/syllabus.md` |
| 7 | Hub HTML `syllabus/index.html` | `syllabus/index.html` |
| 8 | Slideshow Session 1 — Le présent | `syllabus/01-le-present-slideshow.html` |
| 9 | Slideshow Session 2 — La mécanique | `syllabus/02-la-mecanique-slideshow.html` |
| 10 | Slideshow Session 3 — La valeur | `syllabus/03-la-valeur-slideshow.html` |
| 11 | Slideshow Session 4 — Le futur | `syllabus/04-le-futur-slideshow.html` |
| 12 | Slideshow Événement final | `syllabus/05-evenement-final-slideshow.html` |
| 13 | Tests intégration + PR | `tests/syllabus-integration.test.mjs` (optionnel), PR via MCP GitHub |

**Total estimé :** ~12-16 commits (1 par task + commits intermédiaires si granularité fine).

---

## Conventions de toutes les tâches

**Style des SVG :** suit la convention typo des schémas du dossier `coding-agents/` (cf. CLAUDE.md « Convention typo des schémas ») :
- Title `.display` 28pt 600 weight letter-spacing -0.01em
- Subtitle `.display` 18pt 400 italic
- Body label `.body` 15pt 500 weight
- Annotation `.body` 13pt
- Numeric callout `.mono` 15pt 500 weight
- Schema marker (SCHÉMA NN) `.mono` 12pt 600 weight letter-spacing 0.16em CARMINE

**Palette obligatoire** (variables CSS à définir dans `<style>` de chaque fichier HTML, et fill/stroke directs dans les SVG) :
```
--bg: #faf6ec        (papier ivoire — fond)
--bg-2: #f3eedf      (papier ivoire ombré — cards)
--paper: #ffffff     (blanc pur — modaux, surfaces)
--text: #1e1e2a      (noir d'encre — texte principal)
--text-dim: #3b3f4d  (gris foncé)
--text-mid: #6b6f7c  (gris moyen)
--text-faint: #9a9ca5 (gris clair — meta)
--accent: #b8582e    (orange brûlé — accents)
--carmine: #b23b1b   (rouge carmin — markers, alertes)
--line: rgba(30,30,44,0.08) (filet léger)
--line-strong: rgba(30,30,44,0.20) (filet visible)
```

**Polices Google obligatoires** dans chaque HTML :
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

**Favicon obligatoire** : `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`

**Surlignage stabilo** : `<mark>` reste réservé aux phrases-clés narratives (cf. CLAUDE.md). En markdown : `==texte==` (Obsidian).

**Workflow git par task :**
- Commit par task avec message conventionnel `feat(syllabus):` ou `feat(syllabus-svg):`
- Vérifier le diff avant le commit (`git diff --cached --stat` puis `git log -1 --stat` après)
- Pas de push automatique : Mathieu valide quand toute la branche est prête

---

## Task 1 : Squelette du dossier syllabus/

**Files:**
- Create: `syllabus/.gitkeep`
- Create: `syllabus/images/baromètre/.gitkeep`

- [ ] **Step 1 : Vérifier qu'on est bien sur la branche `claude/syllabus-coc-data`**

```bash
git -C "C:/Users/mguglielmino/Documents/code/mathieugug.github.io" branch --show-current
```

Expected output : `claude/syllabus-coc-data`. Si ce n'est pas le cas, `git checkout claude/syllabus-coc-data`.

- [ ] **Step 2 : Créer les deux dossiers vides avec `.gitkeep`**

```bash
mkdir -p "C:/Users/mguglielmino/Documents/code/mathieugug.github.io/syllabus/images/baromètre"
touch "C:/Users/mguglielmino/Documents/code/mathieugug.github.io/syllabus/.gitkeep"
touch "C:/Users/mguglielmino/Documents/code/mathieugug.github.io/syllabus/images/baromètre/.gitkeep"
```

- [ ] **Step 3 : Vérifier la structure**

```bash
ls -la "C:/Users/mguglielmino/Documents/code/mathieugug.github.io/syllabus"
ls -la "C:/Users/mguglielmino/Documents/code/mathieugug.github.io/syllabus/images/baromètre"
```

Expected : les deux dossiers existent, `.gitkeep` présent dans chacun.

- [ ] **Step 4 : Commit**

```bash
git add syllabus/.gitkeep "syllabus/images/baromètre/.gitkeep"
git commit -m "feat(syllabus): initialise le squelette du dossier

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2 : SVG baromètre #1 — chiffres clés

**Files:**
- Create: `syllabus/images/baromètre/baro-01-chiffres-cles.svg`
- Reference visuel : visuel #1 fourni par Mathieu (titre « CHIFFRES CLÉS — Vue d'ensemble du baromètre — 82 consultants interrogés », 6 chiffres en cards + insight footer)

**Données à intégrer (exactes, du visuel source) :**
- Titre : `CHIFFRES CLÉS`
- Sous-titre : `Vue d'ensemble du baromètre — 103 consultants Data & Analytics interrogés` *(remplace le « 82 consultants » du visuel source qui est une coquille — la donnée principale est 103, confirmée par les visuels suivants)*
- 6 cards en grille 3×2 :
  1. **103** Répondants — *Consultants Data & Analytics*
  2. **60 %** IA régulièrement+ — *Utilisent l'IA au moins chaque semaine*
  3. **3.8/5** Maturité data — *Score moyen des organisations clientes*
  4. **3.6/5** IA bouleverse le métier — *Impact perçu significatif à radical*
  5. **58 %** Génération de code — *Première tâche confiée à l'IA*
  6. **59 %** Accès IA limité — *Accès encadré ou restreint chez les clients*
- Insight footer : `92 % sont en Grand Compte ou CAC 40 — l'IA est omniprésente mais l'accès reste encadré pour 59 % des consultants`

**Design (style site, retire la mention Lincoln) :**
- Dimensions SVG : `viewBox="0 0 1200 760"` (proportions 1.58:1, lisible projection 16:9)
- Fond : `var(--bg)` ivoire (`#faf6ec`)
- Schema marker en haut à gauche : `SCHÉMA 01 — BAROMÈTRE` en mono carmine 12pt letter-spacing 0.16em
- Titre `CHIFFRES CLÉS` en Fraunces 34pt 400 italic, accent orange sur « CLÉS »
- Sous-titre en Inter 16pt 400 grey text-mid
- Cards : fond `var(--paper)` blanc, bordure 1px `var(--line)`, ombre légère, border-radius 8px
- Chiffres principaux : Fraunces 60pt 400, accent orange pour les % et /5, noir d'encre pour 103
- Légendes des cards : Inter 15pt 500 weight (label), 13pt 300 (description)
- Insight footer : bandeau accent orange (`var(--accent)`) avec icône ampoule `💡` (ou pictogramme SVG), texte blanc Inter 15pt
- **Aucune mention « Lincoln »**

**Régions interactives prévues (futurs modaux du slideshow Session 1) :**
- Region `data-card="103-repondants"` : couvre la card 1
- Region `data-card="60-pct-usage"` : couvre la card 2
- Region `data-card="38-maturite"` : couvre la card 3
- Region `data-card="36-bouleversement"` : couvre la card 4
- Region `data-card="58-pct-code"` : couvre la card 5
- Region `data-card="59-pct-acces-limite"` : couvre la card 6
- Region `data-card="insight-grand-compte"` : couvre le bandeau insight

**Technique :** chaque region est un `<rect>` ou `<g>` avec `class="interactive"` et `data-card="..."` (le pattern du site, géré par `/assets/dossier-app.js`).

- [ ] **Step 1 : Vérifier qu'aucun fichier n'existe encore**

```bash
ls "C:/Users/mguglielmino/Documents/code/mathieugug.github.io/syllabus/images/baromètre/baro-01-chiffres-cles.svg" 2>&1
```

Expected : `No such file or directory`.

- [ ] **Step 2 : Écrire le SVG complet**

Référence pour s'inspirer du style : ouvrir `coding-agents/images/20260512-04-comparatif.svg` pour voir un exemple de SVG du site (cards, légendes, palette, polices). **Reproduire ce niveau de qualité** — pas un proto, un schéma livrable.

Composer le SVG avec :
- `<defs>` : aucun gradient nécessaire pour ce schéma simple ; juste les filtres d'ombre éventuels
- `<style>` interne : définir les classes `.display` (Fraunces), `.body` (Inter), `.mono` (JetBrains Mono) avec les tailles de la convention typo
- Schema marker en haut à gauche
- Titre + sous-titre centrés ou alignés à gauche selon le rythme du site (cf. exemples coding-agents)
- 6 cards en grille `<g transform="translate(...)">` × 6
- Bandeau insight en bas pleine largeur

Exemple de structure SVG (squelette, à compléter) :

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760" font-family="Inter, sans-serif">
  <style>
    .display { font-family: 'Fraunces', serif; }
    .body { font-family: 'Inter', sans-serif; font-weight: 300; }
    .mono { font-family: 'JetBrains Mono', monospace; }
    .interactive { cursor: pointer; }
    .interactive:hover rect { stroke: #b8582e; stroke-width: 2; }
  </style>

  <!-- Fond -->
  <rect width="1200" height="760" fill="#faf6ec"/>

  <!-- Schema marker -->
  <text x="60" y="50" class="mono" font-size="12" font-weight="600" letter-spacing="0.16em" fill="#b23b1b">SCHÉMA 01 — BAROMÈTRE</text>

  <!-- Titre -->
  <text x="60" y="110" class="display" font-size="34" font-weight="400" fill="#1e1e2a">
    CHIFFRES <tspan font-style="italic" fill="#b8582e">CLÉS</tspan>
  </text>

  <!-- Sous-titre -->
  <text x="60" y="142" class="body" font-size="16" fill="#6b6f7c">
    Vue d'ensemble du baromètre — 103 consultants Data &amp; Analytics interrogés
  </text>

  <!-- Cards 3×2 — voir détails ci-dessous -->
  <g class="interactive" data-card="103-repondants" transform="translate(60, 200)">
    <rect width="340" height="180" rx="8" fill="#ffffff" stroke="rgba(30,30,44,0.08)"/>
    <text x="30" y="80" class="display" font-size="60" font-weight="400" fill="#1e1e2a">103</text>
    <text x="30" y="120" class="body" font-size="15" font-weight="500" fill="#1e1e2a">Répondants</text>
    <text x="30" y="145" class="body" font-size="13" fill="#6b6f7c">Consultants Data &amp; Analytics</text>
  </g>

  <!-- Répéter pour les 5 autres cards en suivant la grille (380px de pas horizontal, 200px vertical) -->
  <!-- Card 60% à translate(440, 200), card 3.8/5 à translate(820, 200) -->
  <!-- Card 3.6/5 à translate(60, 400), card 58% à translate(440, 400), card 59% à translate(820, 400) -->

  <!-- Bandeau insight footer -->
  <g class="interactive" data-card="insight-grand-compte" transform="translate(60, 640)">
    <rect width="1080" height="80" rx="6" fill="#b8582e"/>
    <text x="30" y="35" class="mono" font-size="11" font-weight="600" letter-spacing="0.18em" fill="#ffffff">INSIGHT CLÉ</text>
    <text x="30" y="62" class="body" font-size="15" fill="#ffffff">92 % sont en Grand Compte ou CAC 40 — l'IA est omniprésente mais l'accès reste encadré pour 59 % des consultants</text>
  </g>
</svg>
```

**Compléter les 6 cards** avec les valeurs ci-dessus, en utilisant l'orange (`#b8582e`) sur les `%` et `/5` des chiffres pour la cohérence visuelle.

- [ ] **Step 3 : Ouvrir le SVG dans le navigateur et valider visuellement**

Ouvrir : `file:///C:/Users/mguglielmino/Documents/code/mathieugug.github.io/syllabus/images/baromètre/baro-01-chiffres-cles.svg`

Critères de validation :
- Toutes les valeurs chiffrées sont lisibles à distance d'écran de projection
- Palette ivoire/orange cohérente avec les autres SVG du site (comparer côte à côte avec `coding-agents/images/20260512-04-comparatif.svg`)
- Aucune mention « Lincoln »
- Le `:hover` sur les cards interactives fait apparaître la bordure orange (test visuel à la souris)
- Aucune erreur de rendu (textes débordants, alignements cassés, polices fallback)

- [ ] **Step 4 : Commit**

```bash
git add "syllabus/images/baromètre/baro-01-chiffres-cles.svg"
git commit -m "feat(syllabus-svg): baromètre 01 — chiffres clés (103 répondants, 6 cards)

Reformat du visuel corporate au style site : palette ivoire/orange,
polices Fraunces/Inter/JetBrains Mono, mention Lincoln retirée
conformément à CLAUDE.md (Lincoln en footer uniquement).

6 régions interactives prévues pour les modaux du slideshow Session 1.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3 : SVG baromètre #2 — profil répondants

**Files:**
- Create: `syllabus/images/baromètre/baro-02-profil-repondants.svg`

**Données à intégrer (exactes du visuel source) :**
- Titre : `PROFIL DES RÉPONDANTS`
- Sous-titre : `Expérience, postes et fonctions des 103 consultants`
- Schema marker : `SCHÉMA 02 — BAROMÈTRE`

**Deux colonnes de barres horizontales :**

*Colonne 1 — Niveau d'expérience :*
- Expert/Lead (10+ ans) : 16 %
- Senior (6-10 ans) : 35 %
- Confirmé (3-5 ans) : 47 %
- Junior (0-2 ans) : 3 %

*Colonne 2 — Répartition par poste :*
- Data Analyst / BI : 47 %
- Data Scientist / ML : 18 %
- Data Engineer : 15 %
- Architecte / Tech Lead : 6 %
- Autre / Consultant / Manager : 15 %

**Bandeau CTA footer (style insight orange) :**
`47 % sont Data Analyst/BI — adapter les parcours formation vers le profil dominant tout en accompagnant la montée en compétences des profils seniors (50 %)`

**Design :**
- viewBox : `0 0 1200 760`
- Deux colonnes verticales séparées par un trait fin gris
- Titre de colonne en Fraunces 18pt 500 (« Niveau d'expérience » à gauche, « Répartition par poste » à droite)
- Barres horizontales :
  - Hauteur de barre : 28px
  - Largeur max (100 %) : 380px
  - Couleur des barres : graduation en `var(--accent)` plus clair / plus foncé selon importance, OU palette monochrome accent — laisser le générateur choisir le plus lisible (s'inspirer de `measure-roi/images/20260507-09-productivity-findings.svg`)
  - Label du poste/niveau au-dessus de la barre, valeur % à droite
- Espacement vertical entre lignes : ~50px
- Bandeau CTA : pleine largeur, `var(--accent)` fond, blanc texte, icône `🎯` ou pictogramme SVG cible

**Régions interactives :**
- `data-card="profil-junior"`, `data-card="profil-confirme"`, `data-card="profil-senior"`, `data-card="profil-expert"` sur les 4 barres niveaux
- `data-card="poste-da-bi"`, `data-card="poste-ds-ml"`, `data-card="poste-de"`, `data-card="poste-architecte"`, `data-card="poste-autre"` sur les 5 barres postes
- `data-card="cta-formation-da"` sur le bandeau footer

- [ ] **Step 1 : Vérifier que le fichier n'existe pas, puis créer le SVG complet**

Suivre les conventions de la Task 2 (structure XML similaire, palette identique, schema marker, classes CSS internes). Ouvrir `coding-agents/images/20260512-06-gains.svg` ou `measure-roi/images/20260507-05-hard-vs-soft.svg` comme référence pour des barres horizontales.

Pour chaque barre :
```xml
<g class="interactive" data-card="profil-confirme" transform="translate(60, 240)">
  <text x="0" y="-8" class="body" font-size="13" fill="#3b3f4d">Confirmé (3-5 ans)</text>
  <rect width="380" height="28" rx="2" fill="rgba(184,88,46,0.1)"/> <!-- bg -->
  <rect width="178.6" height="28" rx="2" fill="#b8582e"/>             <!-- 47% width -->
  <text x="186" y="20" class="mono" font-size="13" font-weight="500" fill="#1e1e2a">47 %</text>
</g>
```

Largeur de barre = pourcentage × 3.8 (pour que 100 % = 380 px).

- [ ] **Step 2 : Validation visuelle dans le navigateur**

Critères :
- Lisibilité à distance projection
- Hiérarchie visuelle évidente (Confirmé domine, Junior à peine visible)
- Pas de chevauchement label/valeur
- Bandeau CTA distinct visuellement de l'insight de la Task 2 (icône différente)

- [ ] **Step 3 : Commit**

```bash
git add "syllabus/images/baromètre/baro-02-profil-repondants.svg"
git commit -m "feat(syllabus-svg): baromètre 02 — profil répondants (DA/BI 47 %, Senior+Confirmé 82 %)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4 : SVG baromètre #3 — adoption & impact

**Files:**
- Create: `syllabus/images/baromètre/baro-03-adoption-impact.svg`

**Données à intégrer (exactes du visuel source) :**
- Titre : `ADOPTION & IMPACT DE L'IA`
- Sous-titre : `60 % utilisent l'IA au moins chaque semaine — 27 % des clients en phase de POC`
- Schema marker : `SCHÉMA 03 — BAROMÈTRE`

**Bloc gauche — Fréquence d'usage IA (5 barres horizontales, valeurs absolues) :**
- Légende mini-carrés couleurs en haut : En continu, Quotidien, Hebdomadaire, Rarement, Jamais
- Jamais : 11
- Rarement : 26
- Hebdomadaire : 31
- Quotidien : 21
- En continu : 10

(Total = 99, écart 4 par rapport aux 103 — donnée du visuel source, on garde tel quel)

**Bloc droit — IA chez les clients (4 cards empilées) :**
- 27 % POC / expérimentation (fond jaune/sable)
- 21 % Agents / analytics conv. (fond ivoire foncé)
- 18 % Copilots BI (fond bleu pâle si on veut casser la mono-orange, OU rester accent)
- 14 % Non, pas du tout (fond gris faint)

**Sous-bandeau (sous le bloc droit) :**
`Accès IA : 59 % limité | 27 % libre | 11 % bloqué`

**Bandeau CTA footer :**
`27 % en POC = fenêtre d'opportunité pour positionner le CoC comme accélérateur de déploiements IA chez les clients`

**Design :**
- viewBox : `0 0 1200 760`
- Layout : 2 colonnes (50/50), séparateur central vertical
- Bloc fréquence : barres horizontales avec largeur proportionnelle aux valeurs absolues (max = 31 → largeur max 320px)
- Bloc clients : cards horizontales avec % en gros, label à droite

**ATTENTION mention Lincoln :** le visuel source dit « positionner Lincoln comme accélérateur ». **Remplacer par « le CoC »** dans le CTA pour respecter CLAUDE.md.

**Régions interactives :**
- `data-card="freq-jamais"`, `data-card="freq-rarement"`, `data-card="freq-hebdo"`, `data-card="freq-quoti"`, `data-card="freq-continu"`
- `data-card="client-poc"`, `data-card="client-agents"`, `data-card="client-copilots"`, `data-card="client-aucun"`
- `data-card="acces-detail"` sur le sous-bandeau accès
- `data-card="cta-fenetre-opportunite"` sur le bandeau footer

- [ ] **Step 1 : Vérifier non-existence, créer le SVG complet**

Convention identique aux tasks précédentes. Pour les barres absolues, calculer la largeur ainsi : `width = valeur / 31 * 320`.

Pour les cards client, exemple :
```xml
<g class="interactive" data-card="client-poc" transform="translate(640, 240)">
  <rect width="500" height="60" rx="6" fill="rgba(255, 200, 80, 0.6)"/>
  <text x="20" y="40" class="display" font-size="32" font-weight="500" fill="#1e1e2a">27 %</text>
  <text x="100" y="40" class="body" font-size="16" font-weight="500" fill="#1e1e2a">POC / expérimentation</text>
</g>
```

- [ ] **Step 2 : Validation visuelle**

Critères :
- Confirmer la suppression de « Lincoln » dans le CTA
- Les 4 cards client sont distinctes visuellement (couleurs ou intensités différentes)
- Sous-bandeau accès lisible mais discret (Inter 12pt italic gris)

- [ ] **Step 3 : Commit**

```bash
git add "syllabus/images/baromètre/baro-03-adoption-impact.svg"
git commit -m "feat(syllabus-svg): baromètre 03 — adoption & impact (60 % usage régulier, 27 % POC)

CTA : 'Lincoln' remplacé par 'le CoC' (CLAUDE.md : Lincoln en footer uniquement).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5 : SVG baromètre #4 — tâches IA par profil

**Files:**
- Create: `syllabus/images/baromètre/baro-04-taches-par-profil.svg`

**Données à intégrer (exactes du visuel source) :**
- Titre : `TÂCHES IA PAR PROFIL`
- Sous-titre : `La génération de code domine largement — les autres tâches révèlent les bonnes pratiques à accompagner`
- Schema marker : `SCHÉMA 04 — BAROMÈTRE`

**Bloc gauche — Répartition globale des tâches IA (6 barres horizontales) :**
- Génération / débogage de code : 58 % (couleur d'accent forte, jaune/sable doré)
- Veille technologique : 11 %
- Pas d'IA / Non concerné : 14 % (gris)
- Documentation technique : 7 %
- Livrables clients : 7 %
- Data storytelling : 3 % (gris pâle, à ressortir comme « sous-exploité »)

**Bloc droit — Génération de code par profil (5 barres) :**
- Data Scientist / ML : 84 % (16/19)
- Architecte / Tech Lead : 67 % (4/6)
- Data Analyst / BI : 60 % (29/48)
- Data Engineer : 44 % (7/16)
- Manager / Chef de projet : 33 % (2/6)

(Mention « N/total » entre parenthèses après le %)

**Bandeau enseignement footer :**
`La génération de code concentre 58 % des usages IA, mais les tâches à plus forte valeur ajoutée (data storytelling, exploration, conception dashboards) restent sous-exploitées → accompagner les bonnes pratiques au-delà du code`

**Design :**
- viewBox : `0 0 1200 760`
- Layout : 2 colonnes (50/50), séparateur vertical
- Headers de colonnes en `mono` 12pt 600 letter-spacing 0.18em (pas en Fraunces — différencier des autres SVG)
- **Mettre en évidence** la barre `Data storytelling 3 %` avec un astérisque ou un soulignement carmine, et la barre `Génération de code 58 %` avec sa couleur saturée

**Régions interactives :**
- `data-card="tache-code"`, `data-card="tache-veille"`, `data-card="tache-pas-ia"`, `data-card="tache-doc"`, `data-card="tache-livrables"`, `data-card="tache-storytelling"`
- `data-card="code-ds-ml"`, `data-card="code-architecte"`, `data-card="code-da-bi"`, `data-card="code-de"`, `data-card="code-manager"`
- `data-card="enseignement-cle"` sur le bandeau footer

- [ ] **Step 1 : Vérifier non-existence, créer le SVG complet**

Suivre conventions précédentes. Pour les pourcentages avec `(N/total)`, formater comme :
```xml
<text x="190" y="20" class="mono" font-size="13" font-weight="500" fill="#1e1e2a">
  84 %
  <tspan font-size="11" fill="#9a9ca5"> (16/19)</tspan>
</text>
```

- [ ] **Step 2 : Validation visuelle**

Critères :
- L'écart Code 58 % vs Storytelling 3 % saute aux yeux (hiérarchie visuelle)
- L'asymétrie DS/ML 84 % vs Manager 33 % est claire
- Le bandeau enseignement reprend visuellement le code « insight » des SVG précédents

- [ ] **Step 3 : Commit**

```bash
git add "syllabus/images/baromètre/baro-04-taches-par-profil.svg"
git commit -m "feat(syllabus-svg): baromètre 04 — tâches IA par profil (58 % code, 3 % storytelling)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6 : Document maître syllabus.md

**Files:**
- Create: `syllabus/syllabus.md`

**Contenu complet à écrire** (rédiger directement, pas de placeholders) :

```markdown
# Syllabus CoC Data — Acculturation IA agentique

> Cycle de **4 sessions × 45 min** + **événement final 1h30**
> Cible : ~400 ingénieurs (users + builders)
> Origine : baromètre interne 103 répondants, mai 2026
> Auteur : Mathieu Guglielmino · Format co-écrit avec l'aide d'une IA

---

## Vue d'ensemble

L'acculturation se fait en cinq temps : **présent → mécanique → valeur → futur → mise en production**. Chaque session courte est conçue pour 45 min (30 min de présentation + 15 min d'échange), animée par Mathieu seul. L'événement final (1h30) capitalise sur les 4 sessions et fait intervenir deux consultants externes (évaluation et observabilité).

Tous les supports sont autonomes : un participant qui rate une session peut consulter le slideshow correspondant chez lui. Tous embarquent zoom plein écran, modaux explicatifs et navigation clavier.

### Chiffres baromètre qui guident l'acculturation

- **103 répondants** consultants Data & Analytics, 92 % Grand Compte ou CAC 40
- **47 % Data Analyst / BI** = profil dominant à acculturer en priorité
- **58 % génération / débogage de code** = tâche IA n°1 (cible session 1)
- **36 % d'usage IA faible** (rarement ou jamais) = besoin d'acculturation confirmé
- **27 % de POC clients** = pression business sur la mesure (cible session 3)
- **3 % data storytelling, 7 % livrables clients** = angles morts (bonus session 4)

---

## Session 1 — Le présent · 45 min

**Hook** : *« 60 % d'entre vous utilisent l'IA chaque semaine, 58 % pour coder. Voilà comment on en tire vraiment parti — et pourquoi c'est un début, pas la fin. »*

**Plan minuté**
- 0-12'  Restitution baromètre — 4 visuels reformatés, focus sur les chiffres qui parlent à l'audience
- 12-30' Coding agents 2026 — Claude Code / Codex / Copilot, en partant du chiffre 58 %
- 30-45' Échange + appel à pilotes (cible : 5 DA/BI + 2 Data Engineers minimum)

**Schémas embarqués** (syntaxe Obsidian, preview inline ; ignorée par GitHub Pages)
- ![[images/baromètre/baro-01-chiffres-cles.svg]]
- ![[images/baromètre/baro-02-profil-repondants.svg]]
- ![[images/baromètre/baro-03-adoption-impact.svg]]
- ![[images/baromètre/baro-04-taches-par-profil.svg]]
- ![[../coding-agents/images/20260512-01-trois-regimes.svg]]
- ![[../coding-agents/images/20260512-04-comparatif.svg]]
- ![[../coding-agents/images/20260512-08-carte-decision.svg]]

**Notes d'animation**
- Insister sur le passage **copilote → collègue → autonome** (`coding-agents/01-trois-regimes`) — c'est le mental model qui ouvre la suite du syllabus.
- Anticiper la question « ça remplace les développeurs ? » → renvoyer explicitement à la session 4.
- Anticiper « c'est interdit chez nos clients » (59 % accès limité) → reconnaître la contrainte, expliquer ce qu'on peut faire en local (Claude Code en CLI sur poste de travail) et ce qu'on prépare pour quand l'accès s'ouvre.
- Pour l'appel à pilotes, viser une diversité de profils (au moins 5 DA/BI + 2 DE) — sinon on a 7 DS/ML qui font déjà du code IA tout seuls.

**Slideshow** : [01-le-present-slideshow.html](01-le-present-slideshow.html)

---

## Session 2 — La mécanique · 45 min

**Hook** : *« Pour bien utiliser un agent (et bien le construire), il faut savoir comment il pense. Sinon on attend des miracles ou on perd 3 mois sur un POC qui ne tient pas. »*

**Plan minuté**
- 0-10'  Pourquoi ce volet — différencier le besoin user (mental model) du besoin builder (design partagé). Référencer l'asymétrie 84 % DS/ML codent vs 44 % DE.
- 10-30' Anatomie d'un agent : boucle, outils MCP, mémoire/contexte
- 30-45' Q&A — distinction « ce qui se passe quand vous utilisez » vs « ce qui se passe quand vous construisez »

**Schémas embarqués**
- ![[../harness-agentique/images/20260429-01-anatomie-harness.svg]]
- ![[../harness-agentique/images/20260429-02-boucle-gan.svg]]
- ![[../mcp-plateforme/images/20260508-01-anatomie-protocole.svg]]
- ![[../memoire-agentique/images/20260430-05-context-engineering.svg]]
- *(bonus si temps)* ![[../agents-computer-use/images/20260502-01-taxonomie-cua.svg]]

**Notes d'animation**
- Le schéma `boucle-gan` (think → act → observe) est **le pivot** de la session — passer le temps qu'il faut dessus, illustrer avec un exemple concret (Claude Code qui lit un fichier, modifie, run un test).
- MCP : insister sur le fait que c'est un **standard** (depuis fin 2024), pas un détail propriétaire — invite à construire des serveurs MCP côté CoC.
- Mémoire : démystifier — montrer la différence context window / mémoire persistante / RAG.

**Slideshow** : [02-la-mecanique-slideshow.html](02-la-mecanique-slideshow.html)

---

## Session 3 — La valeur · 45 min

**Hook** : *« 95 % des pilotes GenAI sans P&L mesurable — MIT NANDA. Pourquoi, et comment on s'y prend chez nos clients. »*

**Plan minuté**
- 0-10'  Le paradoxe agentique : ce qu'on mesure facilement vs ce qui crée de la valeur
- 10-30' Hard vs Soft savings, grille à 5 axes, études empiriques (Brynjolfsson +14 %, Klarna recul, Jagged Frontier)
- 30-45' Échange sur projets en cours **+ teaser explicite** : *« mesurer = instrumenter — c'est l'objet de l'événement final. Vous y serez ? »*

**Schémas embarqués**
- ![[../measure-roi/images/20260507-01-paradoxe-roi.svg]]
- ![[../measure-roi/images/20260507-05-hard-vs-soft.svg]]
- ![[../measure-roi/images/20260507-03-grille-5-axes.svg]]
- ![[../measure-roi/images/20260507-09-productivity-findings.svg]]
- ![[../evaluation-agentique/images/20260501-09-couts-goulots.svg]] *(teaser final)*

**Notes d'animation**
- Le chiffre 95 % accroche — l'utiliser comme le hook qui force l'attention.
- Être très clair sur le **paradoxe agentique** : le coût par token baisse, mais la complexité de l'agent augmente → le coût par tâche peut monter même si le coût par token baisse.
- Klarna : raconter l'histoire (pic communication, recul, ré-embauche) — exemple culturel partageable.
- **Annoncer explicitement l'événement final** dans les 5 dernières minutes : « pour mesurer vraiment, il faut instrumenter, et pour instrumenter il faut savoir ce qu'on mesure — c'est ce que les deux consultants viennent expliquer le [date] ».

**Slideshow** : [03-la-valeur-slideshow.html](03-la-valeur-slideshow.html)

---

## Session 4 — Le futur · 45 min

**Hook** : *« De 47 % d'emplois exposés (Frey-Osborne 2013) à 0,55 % de productivité gagnée sur 10 ans (Acemoglu 2024) — quel scénario pour notre CoC ? »*

**Plan minuté**
- 0-10'  L'écart entre les estimations
- 10-25' Augmentation vs automatisation, 4 scénarios 2035, 6 leviers d'action
- 25-32' **Bonus baromètre — l'angle mort** : le baromètre montre 3 % de data storytelling et 7 % de livrables clients. Pointer vers le dossier `narrative-experiences/` comme ouverture pour ceux qui veulent creuser après.
- 32-45' Échange — quel scénario pour le CoC, quelles compétences à développer (au-delà du code), comment le CoC se positionne

**Schémas embarqués**
- ![[../ia-et-travail/images/20260504-01-frise-estimations.svg]]
- ![[../ia-et-travail/images/20260504-04-augmentation-automatisation.svg]]
- ![[../ia-et-travail/images/20260504-07-quatre-scenarios.svg]]
- ![[../ia-et-travail/images/20260504-08-six-leviers.svg]]

**Notes d'animation**
- L'écart Frey-Osborne / Acemoglu est l'accroche la plus efficace — c'est un chiffre qui marque.
- Pour le bonus storytelling : ne pas charger le slideshow d'un schéma supplémentaire (rester sur 4) — citer juste le pourcentage et donner l'URL `https://mathieugug.github.io/narrative-experiences/`.
- Préparer mentalement la question politique « est-ce que ça remplace les juniors ? » — répondre par les leviers (formation, redéfinition des rôles, captation de la valeur).

**Slideshow** : [04-le-futur-slideshow.html](04-le-futur-slideshow.html)

---

## Événement final — Les agents en production · 1h30

**Format** : Mathieu (intro 15 min) + 2 consultants (30 min chacun) + échange tripartite (15 min). Cible : tout le CoC + management invité.

**Plan minuté**
- 0-15'   Intro Mathieu — capitalisation des 4 sessions, pourquoi on amène 2 experts externes maintenant
- 15-45'  **Consultant 1 — Évaluation des agents** : pyramide des métriques, LLM-as-judge, playbook gruyère
- 45-75'  **Consultant 2 — Observabilité** : 6 piliers, anatomie d'une trace OpenTelemetry GenAI, échelle de maturité
- 75-90'  Échange tripartite + roadmap CoC (mois suivants)

**Schémas embarqués**
- ![[../coding-agents/images/20260512-01-trois-regimes.svg]] *(rappel session 1)*
- ![[../harness-agentique/images/20260429-01-anatomie-harness.svg]] *(rappel session 2)*
- ![[../measure-roi/images/20260507-01-paradoxe-roi.svg]] *(rappel session 3)*
- ![[../evaluation-agentique/images/20260501-04-pyramide-metriques.svg]]
- ![[../evaluation-agentique/images/20260501-05-llm-as-judge.svg]]
- ![[../evaluation-agentique/images/20260501-10-playbook-gruyere.svg]]
- ![[../observabilite-agents-ia/images/20260430-02-six-piliers-telemetrie.svg]]
- ![[../observabilite-agents-ia/images/20260430-04-anatomie-trace-otel-genai.svg]]
- ![[../observabilite-agents-ia/images/20260430-08-echelle-maturite-observabilite.svg]]

**Brief consultants**
- Envoyer aux deux : ce syllabus.md + les rapports complets `evaluation-agentique/` et `observabilite-agents-ia/`
- Demander : 30 min chrono, 3 schémas max, focus production (pas POC)
- Cadrage commun : « le CoC a vu mécanique + ROI + travail — vous arrivez sur la mise en production »

**Slideshow** : [05-evenement-final-slideshow.html](05-evenement-final-slideshow.html) (intro Mathieu prête, sections consultants en placeholder à compléter ensemble)

---

## Logistique

- **Cadence proposée** : 1 session par semaine sur 4 semaines, événement final en S+5 ou S+6
- **Salle** : assez grande pour 30-50 personnes par session courte (sur ~400, taux d'engagement réaliste : 10-15 %), salle conférence pour le final
- **Captation** : enregistrement audio/vidéo des 4 sessions courtes pour rediffusion asynchrone (les slideshows sont déjà autonomes, l'enregistrement complète l'animation)
- **Communication** : annonce groupée du cycle entier en S-1, rappel 48 h avant chaque session
- **Tracker** : feuille de présence simple par session, court formulaire post-événement pour évaluer (5 questions max)

## Itération après chaque session

Après chaque session, ajouter ici :
- Nombre de présents
- 3 questions clés qui ont émergé
- 1 ajustement à faire pour la session suivante
```

- [ ] **Step 1 : Vérifier non-existence**

```bash
ls "C:/Users/mguglielmino/Documents/code/mathieugug.github.io/syllabus/syllabus.md" 2>&1
```

Expected : `No such file or directory`.

- [ ] **Step 2 : Écrire le contenu complet ci-dessus** dans `syllabus/syllabus.md`

- [ ] **Step 3 : Vérifier le rendu Obsidian** (si Obsidian disponible)

Ouvrir le vault Obsidian (`.obsidian/` est présent dans le repo). Vérifier que les `![[../coding-agents/images/...]]` rendent bien les SVG en preview.

Si Obsidian n'est pas disponible : juste vérifier que le markdown parse correctement (titres bien hiérarchisés, listes propres, pas de syntaxe cassée).

- [ ] **Step 4 : Commit**

```bash
git add syllabus/syllabus.md
git commit -m "feat(syllabus): document maître syllabus.md (4 sessions + événement final)

Document de pilotage Obsidian-friendly avec hooks, plans minutés, schémas
référencés via syntaxe ![[...]] (preview Obsidian inline, ignorée par GitHub
Pages), notes d'animation et brief consultants pour l'événement final.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7 : Hub HTML syllabus/index.html

**Files:**
- Create: `syllabus/index.html`

**Objectif** : page de garde HTML projetable en intro de la session 1, qui présente le cycle complet et liste les 5 sessions avec leurs liens. Pas listée dans la grille de l'accueil (artefact interne CoC). Reproduit le pattern hub des autres dossiers (cf. `coding-agents/index.html`) mais avec une grille de 5 cartes au lieu d'une carte unique.

**Contenu fonctionnel** :
- Topbar 2 zones (Mathieu Guglielmino à gauche, ← Retour aux dossiers à droite) — convention CLAUDE.md « Hubs ≠ pages internes »
- Hero : eyebrow `Syllabus interne · CoC Data` (pas de date), h1 `Acculturation IA <em>agentique</em>.`, lede court avec les chiffres clés (103 répondants, 4 sessions + 1 final)
- Meta : `4 sessions · 1 événement final · 25 schémas réutilisés · 4 schémas baromètre inédits`
- Grille 5 cartes (1 par slideshow) :
  - Carte 1 : `Session 1 — Le présent` (lien `01-le-present-slideshow.html`)
  - Carte 2 : `Session 2 — La mécanique`
  - Carte 3 : `Session 3 — La valeur`
  - Carte 4 : `Session 4 — Le futur`
  - Carte 5 : `Événement final — Les agents en production` (mise en valeur visuelle, fond `var(--accent)`)
- Lien discret en footer vers `syllabus.md` pour qui veut voir le document maître
- Footer site standard avec disclosure IA (`Format co-écrit avec l'aide d'une IA`)

**Code complet** (~180 lignes) — reprendre la structure de `coding-agents/index.html` (Read pour voir l'intégralité avant d'écrire) et l'adapter.

- [ ] **Step 1 : Lire `coding-agents/index.html` en entier comme référence**

```bash
# Pas de bash, utiliser le tool Read sur coding-agents/index.html lignes 1-300
```

- [ ] **Step 2 : Écrire `syllabus/index.html`** en suivant la même structure (head, topbar, .wrap, .eyebrow, h1, .lede, .meta, .format × 5, .colophon)

Adapter :
- `<title>Syllabus CoC Data — acculturation IA agentique</title>`
- Pas de bloc OpenGraph complet (artefact interne, pas indexé) ; garder juste un `<meta name="robots" content="noindex">` pour explicitement empêcher l'indexation
- Hero h1 : `Acculturation IA <em>agentique</em>.`
- Lede : `Cycle interne CoC Data — 103 répondants au baromètre, 4 sessions courtes pour partager les bases, un événement final pour passer à la production. <strong>Tout est rejouable seul, après les sessions, pour ceux qui n'ont pas pu venir.</strong>`
- 5 cartes dans une grille `display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px` (au lieu d'une seule carte pleine largeur)
- La 5ᵉ carte (événement final) a `border-color: var(--accent)` et la barre du haut `background: var(--accent)` pleine largeur
- Pas de bloc OG-card / SEO automation (cf. CLAUDE.md « Toute page publiée embarque le bloc OpenGraph » — sauf que celle-ci n'est pas un artefact public, donc on **n'inclut pas** le bloc)

- [ ] **Step 3 : Ouvrir dans le navigateur et valider visuellement**

Ouvrir : `file:///C:/Users/mguglielmino/Documents/code/mathieugug.github.io/syllabus/index.html`

Critères :
- Page lisible projection (h1 lisible à 5m)
- 5 cartes alignées sur desktop, empilées sur mobile (test resize 375px)
- La carte « Événement final » se distingue clairement des 4 autres
- Les liens vers les 5 slideshows sont fonctionnels (cliquer chaque carte → vérifier que le navigateur tente d'ouvrir le bon fichier — 404 attendu pour l'instant, c'est OK)
- Topbar à 2 zones (pas la 3 zones des pages internes)
- `<meta name="robots" content="noindex">` présent

- [ ] **Step 4 : Commit**

```bash
git add syllabus/index.html
git commit -m "feat(syllabus): hub HTML interne (5 cartes vers les slideshows)

Hub projetable en intro de session 1, non listé dans la grille de l'accueil
(artefact interne, robots noindex). 5 cartes : 4 sessions courtes + événement
final mis en valeur (fond accent). Pas de bloc OpenGraph (page non publique).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 8 : Slideshow Session 1 — Le présent

**Files:**
- Create: `syllabus/01-le-present-slideshow.html`
- Reference: `.claude/skills/illustrated-deep-research/assets/slideshow-template.html` (template de base)
- Reference: `coding-agents/20260512-coding-agents-slideshow.html` (exemple slideshow réel)
- Reference: `measure-roi/20260507-roi-ia-generative-agentique-slideshow.html` (autre exemple)

**Architecture du slideshow** : ~12 scènes au total, alternance schéma + modaux focus + interludes punchline.

**Plan des scènes Session 1** :

| # | Type | Contenu |
|---|---|---|
| 1 | intro | Eyebrow `Session 1 / 4`, h1 `Le présent`, lede court |
| 2 | punchline | `60 % d'entre vous utilisent l'IA chaque semaine.` (citation grand format) |
| 3 | schema | `baro-01-chiffres-cles.svg` — view d'ensemble, 1 modal sur le 60 % |
| 4 | schema | `baro-02-profil-repondants.svg` — focus DA/BI 47 %, modal sur la card poste |
| 5 | schema | `baro-03-adoption-impact.svg` — focus 27 % POC + 59 % accès limité |
| 6 | schema | `baro-04-taches-par-profil.svg` — focus 58 % code, modal sur l'asymétrie DS/ML 84 % vs DE 44 % |
| 7 | punchline | `58 % pour coder. Voilà ce qu'on peut vraiment en faire.` |
| 8 | schema | `coding-agents/01-trois-regimes.svg` — copilote / collègue / autonome |
| 9 | schema | `coding-agents/04-comparatif.svg` — Claude Code / Codex CLI / Copilot, modaux par outil |
| 10 | schema | `coding-agents/08-carte-decision.svg` — quand utiliser quoi |
| 11 | outro | Eyebrow `À retenir`, h2 `3 choses pour démarrer demain`, body 3 bullets, CTA « Volontaires pilote ? » |

**Données techniques (objet `SCHEMAS` JS) — extraits clés** :

```javascript
const SCHEMAS = {
  "baro-01-chiffres-cles": {
    "60-pct-usage": {
      eyebrow: "ADOPTION",
      title: "60 % d'usage régulier — c'est haut, mais reste 36 % d'usage faible",
      body: "Sur 103 répondants, 62 utilisent l'IA en continu, quotidien ou hebdomadaire. <mark>Les 26 « rarement » et 11 « jamais » — soit 36 % — sont la cible directe de cette acculturation.</mark> Le pic n'est pas chez les juniors mais chez les confirmés (3-5 ans d'expérience), qui dominent le baromètre à 47 %."
    },
    "58-pct-code": {
      eyebrow: "TÂCHE N°1",
      title: "58 % génération de code — l'IA est d'abord un outil de production",
      body: "Très loin devant la veille (11 %), la doc (7 %), les livrables clients (7 %) et le data storytelling (3 %). C'est ce chiffre qui légitime cette session : on commence par où vous êtes déjà."
    },
    // ... une entrée par data-card du SVG
  },
  "baro-04-taches-par-profil": {
    "asymetrie-code": {
      eyebrow: "ASYMÉTRIE PROFILS",
      title: "84 % des DS/ML codent avec l'IA. 44 % des Data Engineers seulement.",
      body: "L'écart est massif. Pourquoi ? Hypothèses : (1) les DS travaillent en exploration, là où l'IA est la plus utile pour itérer ; (2) les DE travaillent sur des pipelines stables, où la confiance prime sur la vitesse ; (3) l'accès aux outils n'est pas le même selon les missions. <mark>La session 2 (mécanique) est l'occasion de montrer aux DE comment l'IA peut servir aussi en pipeline.</mark>"
    }
    // ...
  },
  "20260512-01-trois-regimes": {
    "regime-copilote": {
      eyebrow: "RÉGIME 1",
      title: "Copilote — l'autocomplétion historique",
      body: "L'utilisateur garde la main, l'IA suggère. <mark>C'est ce que la majorité de vous utilisez aujourd'hui</mark> (Copilot dans VS Code, ChatGPT en side panel)."
    },
    "regime-collegue": {
      eyebrow: "RÉGIME 2",
      title: "Collègue — la délégation par tâche",
      body: "Vous décrivez une tâche, l'IA l'exécute en plusieurs étapes (lit des fichiers, modifie, run un test). <mark>C'est Claude Code, Codex CLI, Cursor Composer.</mark> L'humain valide le résultat, pas chaque token."
    },
    "regime-autonome": {
      eyebrow: "RÉGIME 3",
      title: "Autonome — la boucle longue",
      body: "L'agent travaille pendant des minutes ou des heures sans supervision continue. Outil ouvert, mais réservé à des cas bornés et observables. <mark>C'est l'objet de l'événement final du syllabus.</mark>"
    }
    // ...
  }
  // ...etc pour les autres SVG
};

const SCENES = [
  { type: "intro", eyebrow: "Session 1 / 4", title: "Le présent", lede: "Ce que dit le baromètre. Ce que les outils permettent dès demain matin." },
  { type: "punchline", body: "<mark>60 %</mark> d'entre vous utilisent l'IA chaque semaine." },
  { type: "schema", svg: "images/baromètre/baro-01-chiffres-cles.svg", focus: ["60-pct-usage"], title: "Vue d'ensemble — 6 chiffres qui posent le décor" },
  { type: "schema", svg: "images/baromètre/baro-02-profil-repondants.svg", focus: ["poste-da-bi"], title: "Profil des répondants — Data Analyst / BI dominent" },
  { type: "schema", svg: "images/baromètre/baro-03-adoption-impact.svg", focus: ["client-poc", "acces-detail"], title: "Adoption & impact — POC partout, accès contraint" },
  { type: "schema", svg: "images/baromètre/baro-04-taches-par-profil.svg", focus: ["tache-code", "asymetrie-code"], title: "Tâches IA — code domine, le reste reste à conquérir" },
  { type: "punchline", body: "<mark>58 %</mark> pour coder. Voilà ce qu'on peut vraiment en faire." },
  { type: "schema", svg: "../coding-agents/images/20260512-01-trois-regimes.svg", focus: ["regime-copilote", "regime-collegue", "regime-autonome"], title: "Trois régimes — copilote / collègue / autonome" },
  { type: "schema", svg: "../coding-agents/images/20260512-04-comparatif.svg", focus: ["claude-code", "codex-cli", "copilot"], title: "Comparatif — Claude Code / Codex CLI / GitHub Copilot" },
  { type: "schema", svg: "../coding-agents/images/20260512-08-carte-decision.svg", focus: ["scenario-livrable", "scenario-pipeline"], title: "Carte de décision — quand utiliser quoi" },
  { type: "outro", eyebrow: "À retenir", title: "3 choses pour <em>demain</em>", body: "1. Tester Claude Code (CLI) sur un cas livrable transverse cette semaine.<br>2. Lire le rapport interactif coding-agents pour les comparatifs détaillés.<br>3. Se signaler comme volontaire pilote (cible : 5 DA/BI + 2 Data Engineers).", ctas: [{ label: "Rapport coding-agents", href: "../coding-agents/" }, { label: "Session 2 — La mécanique", href: "02-la-mecanique-slideshow.html" }] }
];
```

**Étapes** :

- [ ] **Step 1 : Lire le template `slideshow-template.html` en entier** pour comprendre les placeholders et la structure JS qui consomme `SCHEMAS` + `SCENES`

- [ ] **Step 2 : Lire `coding-agents/20260512-coding-agents-slideshow.html`** comme exemple complet adapté

- [ ] **Step 3 : Copier le template dans `syllabus/01-le-present-slideshow.html` et substituer les placeholders**

Substitutions :
- `{{LANG}}` → `fr`
- `{{TITLE}}` → `Syllabus CoC Data — Session 1 : Le présent`
- `{{META_DESCRIPTION}}` → `Session 1 du syllabus interne CoC Data — restitution du baromètre (103 répondants, 58 % génération de code) et coding agents 2026.`
- `{{CANONICAL_URL}}` → `https://mathieugug.github.io/syllabus/01-le-present-slideshow.html`
- `{{KEYWORDS}}` → `IA agentique, syllabus, CoC data, baromètre, coding agents, Claude Code`
- `{{OG_IMAGE_URL}}` → `https://mathieugug.github.io/coding-agents/og.png` *(réutiliser celui de coding-agents puisqu'on n'a pas d'OG dédiée pour le syllabus)*
- `{{PUBLISHED_DATE}}` → `2026-05-11T12:00:00+02:00`
- Le bloc `<script>` qui contient `const SCHEMAS = {{SCHEMAS_JSON}}` et `const SCENES = {{SCENES_JSON}}` → remplacer par le vrai contenu (cf. extraits ci-dessus, à compléter pour les 4 SVG baromètre + 3 SVG coding-agents avec tous les data-card)

**ATTENTION** : la topbar du slideshow doit reprendre la convention 3 zones (CLAUDE.md « Topbar des pages internes ») : `Mathieu Guglielmino` à gauche, `Syllabus CoC Data — Session 1` au milieu, `← Hub  ·  Accueil` à droite. Hub pointe vers `index.html` du syllabus, Accueil pointe vers `../index.html#series`.

Ajouter aussi `<meta name="robots" content="noindex">` (artefact interne).

- [ ] **Step 4 : Compléter les SCHEMAS pour TOUS les data-card de chaque SVG**

Pour chaque SVG embarqué, lister les data-card et écrire un modal pour chacun. Ne pas laisser de data-card sans modal (sinon le clic ne fait rien). Cible : ~30 modaux au total pour la Session 1 (6 baromètre #1 + 9 baromètre #2 + 10 baromètre #3 + 12 baromètre #4 + ~5 par schéma coding-agents).

Pour les SVG coding-agents, **lire le slideshow existant** `coding-agents/20260512-coding-agents-slideshow.html` pour récupérer les modaux déjà écrits — ne pas les réécrire de zéro.

- [ ] **Step 5 : Validation visuelle complète dans le navigateur**

Ouvrir : `file:///C:/Users/mguglielmino/Documents/code/mathieugug.github.io/syllabus/01-le-present-slideshow.html`

Critères de validation :
- 11 scènes navigables aux flèches clavier (← →)
- L'intro affiche bien `Session 1 / 4`
- Les punchlines (scènes 2, 7) sont en grande typo Fraunces italic
- Les 4 SVG baromètre s'affichent correctement (vérifier les chemins relatifs `images/baromètre/...`)
- Les 3 SVG coding-agents s'affichent (chemins `../coding-agents/images/...`)
- Cliquer sur les régions interactives ouvre les modaux (vérifier au moins 5 modaux au hasard)
- L'outro affiche les 2 CTAs vers `../coding-agents/` et `02-la-mecanique-slideshow.html`
- Topbar à 3 zones (Mathieu / titre dossier / ← Hub · Accueil)
- Mobile (resize 375px) : panneaux escamotables, pas de débordement horizontal
- Pas d'erreur console JS

- [ ] **Step 6 : Tester avec la lib partagée**

Le slideshow embarque déjà `/assets/dossier-app.js` et `/assets/dossier-app.css` dans le template. Vérifier dans la console qu'aucun warning n'apparaît du genre « SCHEMAS object missing for ... ».

- [ ] **Step 7 : Commit**

```bash
git add syllabus/01-le-present-slideshow.html
git commit -m "feat(syllabus): slideshow Session 1 — Le présent (11 scènes, ~30 modaux)

Composé : 1 intro, 2 punchlines, 7 schémas (4 baromètre + 3 coding-agents),
1 outro avec 2 CTAs (rapport coding-agents + session 2). Topbar 3 zones,
robots noindex (artefact interne).

Modaux des SVG coding-agents repris de coding-agents/20260512-coding-agents-slideshow.html.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 9 : Slideshow Session 2 — La mécanique

**Files:**
- Create: `syllabus/02-la-mecanique-slideshow.html`

**Plan des scènes (10 scènes)** :

| # | Type | Contenu |
|---|---|---|
| 1 | intro | `Session 2 / 4`, h1 `La mécanique`, lede « Ce qu'il y a sous le capot d'un agent » |
| 2 | punchline | `Pour bien utiliser un agent — ou bien le construire — il faut savoir comment il pense.` |
| 3 | schema | `harness-agentique/01-anatomie-harness.svg` — vue d'ensemble |
| 4 | schema | `harness-agentique/02-boucle-gan.svg` — think → act → observe |
| 5 | punchline | `Outils. Le langage que parle un agent au monde.` |
| 6 | schema | `mcp-plateforme/01-anatomie-protocole.svg` — MCP comme standard ouvert |
| 7 | punchline | `Mémoire. Ce qui survit à un appel LLM, ou pas.` |
| 8 | schema | `memoire-agentique/05-context-engineering.svg` — context window, RAG, mémoire persistante |
| 9 | schema *(bonus)* | `agents-computer-use/01-taxonomie-cua.svg` — la frontière computer use |
| 10 | outro | h2 `Pour la prochaine`, body « Session 3 : valeur — comment on chiffre l'impact », CTAs |

**Modaux** : extraire des slideshows existants pour `harness-agentique`, `mcp-plateforme`, `memoire-agentique`, `agents-computer-use`. Si certains de ces dossiers n'ont pas de slideshow (vérifier avec `ls`), écrire les modaux de zéro à partir des rapports `*-rapport.md`.

- [ ] **Step 1 : Vérifier la présence des slideshows source**

```bash
ls "C:/Users/mguglielmino/Documents/code/mathieugug.github.io/harness-agentique/" | grep slideshow
ls "C:/Users/mguglielmino/Documents/code/mathieugug.github.io/mcp-plateforme/" | grep slideshow
ls "C:/Users/mguglielmino/Documents/code/mathieugug.github.io/memoire-agentique/" | grep slideshow
ls "C:/Users/mguglielmino/Documents/code/mathieugug.github.io/agents-computer-use/" | grep slideshow
```

Pour chaque slideshow trouvé, lire son `SCHEMAS` JS pour récupérer les modaux à réutiliser.

- [ ] **Step 2 : Si modaux manquants, lire les rapports `*-rapport.md`** pour rédiger les modaux à partir du contenu source

- [ ] **Step 3 : Composer le slideshow** sur le pattern de la Task 8 (template + substitutions + SCHEMAS + SCENES)

Substitutions :
- `{{TITLE}}` → `Syllabus CoC Data — Session 2 : La mécanique`
- `{{META_DESCRIPTION}}` → `Session 2 du syllabus interne CoC Data — anatomie d'un agent, boucle, MCP, mémoire.`
- `{{CANONICAL_URL}}` → `https://mathieugug.github.io/syllabus/02-la-mecanique-slideshow.html`
- `{{OG_IMAGE_URL}}` → `https://mathieugug.github.io/harness-agentique/og.png`

- [ ] **Step 4 : Validation visuelle dans le navigateur**

Critères identiques à la Task 8 (navigation, modaux, mobile, pas d'erreur console).

- [ ] **Step 5 : Commit**

```bash
git add syllabus/02-la-mecanique-slideshow.html
git commit -m "feat(syllabus): slideshow Session 2 — La mécanique (10 scènes)

Anatomie harness, boucle agentique, MCP, mémoire/context-engineering,
+ bonus computer use si temps. Modaux repris des slideshows source quand
disponibles, sinon écrits depuis les rapports *.md.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 10 : Slideshow Session 3 — La valeur

**Files:**
- Create: `syllabus/03-la-valeur-slideshow.html`

**Plan des scènes (9 scènes)** :

| # | Type | Contenu |
|---|---|---|
| 1 | intro | `Session 3 / 4`, h1 `La valeur`, lede « Comment chiffrer l'impact d'un projet IA » |
| 2 | punchline | `<mark>95 %</mark> des pilotes GenAI sans P&L mesurable. — MIT NANDA, 2026` |
| 3 | schema | `measure-roi/01-paradoxe-roi.svg` |
| 4 | schema | `measure-roi/05-hard-vs-soft.svg` |
| 5 | schema | `measure-roi/03-grille-5-axes.svg` |
| 6 | schema | `measure-roi/09-productivity-findings.svg` |
| 7 | punchline | `Mesurer = instrumenter. C'est l'objet de l'événement final.` |
| 8 | schema | `evaluation-agentique/09-couts-goulots.svg` *(teaser final)* |
| 9 | outro | h2 `Pour la prochaine`, CTA « Réservez l'événement final 1h30 — date à confirmer », « Session 4 — Le futur » |

**Modaux** : réutiliser ceux du slideshow `measure-roi/20260507-roi-ia-generative-agentique-slideshow.html` (le slideshow existe déjà, lire ses SCHEMAS).

- [ ] **Step 1 : Lire `measure-roi/20260507-roi-ia-generative-agentique-slideshow.html`** pour récupérer les modaux des 4 SVG `measure-roi`

- [ ] **Step 2 : Lire `evaluation-agentique/20260501-evaluation-agentique-app.html`** pour récupérer le modal du SVG `09-couts-goulots`

- [ ] **Step 3 : Composer le slideshow**

Substitutions :
- `{{TITLE}}` → `Syllabus CoC Data — Session 3 : La valeur`
- `{{OG_IMAGE_URL}}` → `https://mathieugug.github.io/measure-roi/og.png`

- [ ] **Step 4 : Validation visuelle**

Vérifier en plus que la scène 7 « teaser » est visuellement distincte des autres punchlines (peut-être avec un eyebrow mono carmine `TEASER`).

- [ ] **Step 5 : Commit**

```bash
git add syllabus/03-la-valeur-slideshow.html
git commit -m "feat(syllabus): slideshow Session 3 — La valeur (9 scènes, teaser final inclus)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 11 : Slideshow Session 4 — Le futur

**Files:**
- Create: `syllabus/04-le-futur-slideshow.html`

**Plan des scènes (10 scènes)** :

| # | Type | Contenu |
|---|---|---|
| 1 | intro | `Session 4 / 4`, h1 `Le futur`, lede « Ce que ça change au travail data — et au CoC » |
| 2 | punchline | `<mark>47 %</mark> d'emplois exposés (Frey-Osborne 2013) → <mark>0,55 %</mark> de productivité gagnée sur 10 ans (Acemoglu 2024).` |
| 3 | schema | `ia-et-travail/01-frise-estimations.svg` |
| 4 | schema | `ia-et-travail/04-augmentation-automatisation.svg` |
| 5 | schema | `ia-et-travail/07-quatre-scenarios.svg` |
| 6 | schema | `ia-et-travail/08-six-leviers.svg` |
| 7 | punchline | `<mark>3 % data storytelling. 7 % livrables clients.</mark> Les vrais angles morts du baromètre.` |
| 8 | outro intermédiaire | `Bonus — narrative experiences`, body « Si vous voulez creuser : un dossier complet sur le data storytelling et l'IA dans la chaîne de production de visuels », CTA `Ouvrir narrative-experiences →` |
| 9 | punchline | `Et après ? L'événement final.` |
| 10 | outro | h2 `Le cycle se termine`, body « 1h30 avec deux consultants externes : évaluation et observabilité des agents en production », CTA `Réserver l'événement final` (placeholder URL — Mathieu remplace par le vrai lien d'inscription) |

**Modaux** : lire le slideshow `ia-et-travail/20260507-ia-et-travail-slideshow.html` pour récupérer les modaux des 4 SVG.

- [ ] **Step 1 : Lire le slideshow source `ia-et-travail/20260507-ia-et-travail-slideshow.html`**

- [ ] **Step 2 : Composer le slideshow**

Substitutions :
- `{{TITLE}}` → `Syllabus CoC Data — Session 4 : Le futur`
- `{{OG_IMAGE_URL}}` → `https://mathieugug.github.io/ia-et-travail/og.png`

Pour la scène 8 (outro intermédiaire bonus), réutiliser le composant `scene-outro` du template mais avec un seul CTA et sans `h2 em`.

- [ ] **Step 3 : Validation visuelle**

- [ ] **Step 4 : Commit**

```bash
git add syllabus/04-le-futur-slideshow.html
git commit -m "feat(syllabus): slideshow Session 4 — Le futur (10 scènes, bonus narrative-experiences)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 12 : Slideshow Événement final — Les agents en production

**Files:**
- Create: `syllabus/05-evenement-final-slideshow.html`

**Particularité** : ce slideshow a 3 zones distinctes — l'intro Mathieu (15 min, contenu complet) + section Consultant 1 (placeholders) + section Consultant 2 (placeholders) + outro échange.

**Plan des scènes (15 scènes)** :

| # | Type | Section | Contenu |
|---|---|---|---|
| 1 | intro | — | `Événement final · 1h30`, h1 `Les agents en <em>production</em>`, lede |
| 2 | punchline | Intro Mathieu | `On a parlé du présent, de la mécanique, de la valeur, du futur. <mark>Aujourd'hui, on parle de la mise en production.</mark>` |
| 3 | schema | Intro Mathieu | `coding-agents/01-trois-regimes.svg` (rappel session 1) |
| 4 | schema | Intro Mathieu | `harness-agentique/01-anatomie-harness.svg` (rappel session 2) |
| 5 | schema | Intro Mathieu | `measure-roi/01-paradoxe-roi.svg` (rappel session 3) |
| 6 | punchline | Intro Mathieu | `Trois questions ouvertes : peut-on évaluer ? peut-on observer ? peut-on chiffrer ? — réponses dans la prochaine heure.` |
| 7 | section | — | Eyebrow `Consultant 1`, h2 `Évaluation des agents`, body « Présenté par [nom à confirmer] » (placeholder) |
| 8 | schema | Consultant 1 | `evaluation-agentique/04-pyramide-metriques.svg` *(placeholder modal — à confirmer avec consultant)* |
| 9 | schema | Consultant 1 | `evaluation-agentique/05-llm-as-judge.svg` |
| 10 | schema | Consultant 1 | `evaluation-agentique/10-playbook-gruyere.svg` |
| 11 | section | — | Eyebrow `Consultant 2`, h2 `Observabilité`, body « Présenté par [nom à confirmer] » (placeholder) |
| 12 | schema | Consultant 2 | `observabilite-agents-ia/02-six-piliers-telemetrie.svg` |
| 13 | schema | Consultant 2 | `observabilite-agents-ia/04-anatomie-trace-otel-genai.svg` |
| 14 | schema | Consultant 2 | `observabilite-agents-ia/08-echelle-maturite-observabilite.svg` |
| 15 | outro | — | h2 `Échange tripartite + roadmap CoC`, body « 15 min restantes pour vos questions et l'esquisse de la roadmap CoC », pas de CTA (fin du syllabus) |

**Note importante sur les placeholders** : les modaux des SVG des sections Consultant 1 et 2 doivent être pré-remplis avec le contenu des slideshows existants (s'ils existent) OU avec le contenu des rapports `*-rapport.md` correspondants. **Marquer chaque modal placeholder par un eyebrow `À CONFIRMER AVEC CONSULTANT`** pour que Mathieu sache où ajuster.

Pour la nouvelle scène type `section` qui n'existe pas dans le template : ajouter au CSS du slideshow une classe `.scene-section` qui affiche un grand eyebrow + h2 + body, similaire à `.scene-outro` mais sans CTAs et avec une barre verticale carmine sur le côté gauche pour marquer la transition.

- [ ] **Step 1 : Vérifier les slideshows / rapports source**

```bash
ls "C:/Users/mguglielmino/Documents/code/mathieugug.github.io/evaluation-agentique/" | grep -E "(slideshow|rapport)"
ls "C:/Users/mguglielmino/Documents/code/mathieugug.github.io/observabilite-agents-ia/" | grep -E "(slideshow|rapport)"
```

`observabilite-agents-ia/` a un slideshow (`20260505-observabilite-agents-ia-slideshow.html`) — utiliser ses modaux. `evaluation-agentique/` n'a pas de slideshow direct, **lire l'app** `20260501-evaluation-agentique-app.html` pour extraire les modaux.

- [ ] **Step 2 : Composer le slideshow** sur 15 scènes

Substitutions :
- `{{TITLE}}` → `Syllabus CoC Data — Événement final : Les agents en production`
- `{{META_DESCRIPTION}}` → `Événement final 1h30 du syllabus CoC Data — intro Mathieu + 2 consultants externes (évaluation et observabilité des agents en production).`
- `{{OG_IMAGE_URL}}` → `https://mathieugug.github.io/observabilite-agents-ia/og.png`

Ajouter au CSS la nouvelle classe `.scene-section` :

```css
.scene-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
  max-width: 700px;
  gap: 24px;
  padding: 0 24px 0 48px;
  border-left: 4px solid var(--carmine);
}
.scene-section .eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--carmine);
}
.scene-section h2 {
  font-family: 'Fraunces', serif;
  font-weight: 300;
  font-size: clamp(40px, 6vw, 64px);
  line-height: 1.05;
  letter-spacing: -0.02em;
}
.scene-section h2 em {
  font-style: italic;
  color: var(--accent);
}
.scene-section .body {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: clamp(18px, 2.4vw, 24px);
  line-height: 1.5;
  color: var(--text-dim);
  max-width: 560px;
}
```

Et étendre le rendu JS dans le template pour gérer le `type: "section"` (similaire à `outro` mais sans CTAs).

- [ ] **Step 3 : Validation visuelle**

Critères :
- Les 3 schémas de rappel (scènes 3, 4, 5) sont identifiés visuellement comme des reprises (pas de modaux à cliquer dessus, ou modaux génériques type « Vu en session N »)
- Les sections (scènes 7, 11) introduisent visuellement les consultants
- Les modaux placeholder ont bien un eyebrow `À CONFIRMER AVEC CONSULTANT` orange ou carmine

- [ ] **Step 4 : Commit**

```bash
git add syllabus/05-evenement-final-slideshow.html
git commit -m "feat(syllabus): slideshow événement final — Les agents en production (15 scènes)

3 zones : intro Mathieu (15 min, contenu complet), Consultant 1 — Évaluation
(modaux placeholder), Consultant 2 — Observabilité (modaux placeholder), outro
échange tripartite. Nouvelle classe .scene-section pour marquer les
transitions entre interventions.

Modaux placeholder marqués 'À CONFIRMER AVEC CONSULTANT' pour identifier les
ajustements à faire en pré-prod du final.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 13 : Tests d'intégration + PR

**Files:**
- Create: `tests/syllabus-integration.test.mjs` *(optionnel — voir step 1)*
- Modify: `tests/fixtures/expected-fns.json` *(si lib étendue, sinon ignorer)*

**Objectif** : valider que les 5 slideshows + le hub passent les contraintes de la lib partagée et n'ont pas régressé visuellement.

- [ ] **Step 1 : Décider si on ajoute un test automatique**

Vérifier la structure des tests existants :

```bash
ls "C:/Users/mguglielmino/Documents/code/mathieugug.github.io/tests/" 
```

Si `lib-contract.test.mjs` ou `apps-integration.test.mjs` testent déjà tous les `*.html` du repo, **les slideshows syllabus seront automatiquement couverts** — pas besoin de nouveau test. Lire ces fichiers pour confirmer.

Si les tests existants se limitent à des chemins spécifiques (`coding-agents/`, `measure-roi/`, etc.), **étendre la regex** pour inclure `syllabus/` :

Exemple de pattern à modifier (à adapter selon le code réel) :
```javascript
// Avant
const APPS = glob.sync('!(syllabus|tests|tools)/*-app.html');
// Après — si la structure le permet
const APPS = glob.sync('!(tests|tools)/*-app.html');
const SLIDESHOWS = glob.sync('{!(tests|tools),syllabus}/*-slideshow.html');
```

- [ ] **Step 2 : Run la suite de tests existante**

```bash
cd "C:/Users/mguglielmino/Documents/code/mathieugug.github.io"
node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs
```

Expected : tous les tests passent. Si un slideshow syllabus échoue à un check de la lib (ex : `SCHEMAS missing`), le corriger.

- [ ] **Step 3 : Test manuel intégral des 5 slideshows + hub**

Pour chaque fichier (`syllabus/index.html`, `syllabus/01..05-*-slideshow.html`), ouvrir dans le navigateur, vérifier :
- Pas d'erreur console (F12 → Console)
- Navigation flèches clavier OK
- Modaux ouvrent/ferment OK
- Topbar 2 zones (hub) ou 3 zones (slideshows) selon la convention
- Mobile (resize 375px) : pas de débordement horizontal, panneaux escamotables si présents
- Liens entre pages fonctionnent (hub → slideshow N, outro slideshow N → slideshow N+1)

- [ ] **Step 4 : Vérifier la cohérence cross-syllabus**

Ouvrir `syllabus/syllabus.md` dans Obsidian (si dispo) ou un viewer markdown, vérifier que toutes les références `[link](path)` et `![[image]]` pointent vers des fichiers existants.

- [ ] **Step 5 : Lire le diff complet de la branche pour relecture finale**

```bash
git -C "C:/Users/mguglielmino/Documents/code/mathieugug.github.io" log --oneline main..claude/syllabus-coc-data
git -C "C:/Users/mguglielmino/Documents/code/mathieugug.github.io" diff main..claude/syllabus-coc-data --stat
```

Vérifier :
- Tous les commits ont un message conventionnel
- Aucun fichier hors `syllabus/`, `docs/superpowers/specs/` ou `docs/superpowers/plans/` n'est modifié (sauf `tests/` si Step 1 a étendu)
- Aucun fichier non lié n'est embarqué (notamment pas les untracked `.obsidian/`, `.playwright-mcp/`, `tools/__pycache__/`, etc.)

- [ ] **Step 6 : Push de la branche vers remote**

```bash
git -C "C:/Users/mguglielmino/Documents/code/mathieugug.github.io" push -u origin claude/syllabus-coc-data
```

- [ ] **Step 7 : Créer la PR via le MCP GitHub**

Utiliser `mcp__github__create_pull_request` avec :
- owner : `mathieugug`
- repo : `mathieugug.github.io`
- head : `claude/syllabus-coc-data`
- base : `main`
- title : `feat(syllabus): cycle CoC data — 4 sessions × 45 min + événement final 1h30`
- body : récapitulatif structuré

Body type :

```markdown
## Pourquoi

Acculturation IA agentique du CoC Data (~400 ingénieurs) basée sur les chiffres du baromètre interne (103 répondants, 47 % Data Analyst/BI, 58 % génération de code, 36 % d'usage IA faible).

## Ce qui est livré

**Document maître**
- `syllabus/syllabus.md` — Obsidian-friendly, hooks + plans minutés + notes d'animation pour les 5 sessions

**Hub interne**
- `syllabus/index.html` — page de garde projetable (5 cartes, robots noindex, non listé sur l'accueil)

**5 slideshows interactifs**
- Session 1 — Le présent (baromètre + coding agents)
- Session 2 — La mécanique (anatomie agent + MCP + mémoire)
- Session 3 — La valeur (paradoxe ROI + teaser final)
- Session 4 — Le futur (impact travail + bonus narrative-experiences)
- Événement final — Les agents en production (intro Mathieu + 2 consultants placeholder)

**4 SVG inédits du baromètre**
- Reformat des PNG corporate au style site (palette ivoire/orange, polices site, mention « Lincoln » retirée conformément à CLAUDE.md)
- ~30 régions cliquables au total

## Ce qui n'est pas livré (volontairement)

- Pas de tuile dans `index.html` racine (artefact interne CoC)
- Pas de bloc OpenGraph (pas de partage social prévu)
- Pas de modaux finalisés pour les sections Consultants — placeholders à compléter en pré-prod du final

## Risques connus

- Si un schéma source (`coding-agents/`, `measure-roi/`, etc.) est modifié plus tard, les slideshows syllabus reflètent la nouvelle version (accepté ; mitigation : copier le SVG dans `syllabus/images/<dossier>/` après animation pour figer la version utilisée)

## Tests

- Run `node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs` : OK
- Validation manuelle des 5 slideshows + hub : navigation, modaux, mobile, console
- Spec : `docs/superpowers/specs/2026-05-11-syllabus-coc-data-design.md`
- Plan : `docs/superpowers/plans/2026-05-11-syllabus-coc-data.md`

## Note pour Mathieu

Le syllabus est prêt à animer. Étapes restantes hors PR :
1. Caler les dates des 5 sessions
2. Identifier les 2 consultants pour le final + leur briefer (envoyer ce syllabus.md)
3. Compléter les modaux placeholder du slideshow 05 avec les consultants
4. Communiquer le cycle au CoC en S-1
```

- [ ] **Step 8 : Vérifier la PR créée**

Récupérer l'URL de la PR depuis la réponse de `mcp__github__create_pull_request` et la communiquer à Mathieu pour relecture/merge manuel.

---

## Self-review du plan

**1. Spec coverage** :
- ✅ Architecture syllabus/ avec syllabus.md + index.html + 5 slideshows + images/baromètre/ → Tasks 1, 6, 7, 8-12, 2-5
- ✅ 4 SVG baromètre reformatés au style site, mention Lincoln retirée → Tasks 2-5 (chaque task explicite la suppression)
- ✅ Réutilisation de tous les SVG des dossiers existants → Tasks 8-12 chacun référence les chemins relatifs `../X/images/...`
- ✅ Topbar 3 zones sur les pages internes, 2 zones sur le hub → Tasks 7 et 8 explicites
- ✅ Lib partagée `/assets/dossier-app.{js,css}` → embarquée par défaut dans le template slideshow
- ✅ Tests (manuel + automatique optionnel) → Task 13
- ✅ PR via MCP GitHub → Task 13 step 7
- ✅ Bonus narrative-experiences en session 4 → Task 11 plan des scènes
- ✅ Teaser session 3 → final → Task 10 plan des scènes (scène 7 punchline + scène 8 schéma teaser)

**2. Placeholder scan** :
- Les modaux placeholder pour Consultants (Task 12) sont assumés dans le spec et explicitement marqués `À CONFIRMER AVEC CONSULTANT` dans l'UI — pas un placeholder de plan, c'est du contenu intentionnellement à compléter à la dernière minute.
- Les chemins relatifs vers `../coding-agents/images/...` etc. sont concrets, pas placeholder.
- Aucun `TBD`, `TODO`, `À implémenter plus tard` dans le plan.

**3. Type consistency** :
- Les noms de `data-card` sont cohérents entre les SVG baromètre (Tasks 2-5) et leur consommation dans le SCHEMAS object (Task 8).
- Les chemins de fichiers sont cohérents entre les Tasks (toujours `syllabus/images/baromètre/baro-NN-*.svg`, jamais `images/barometre/` sans accent).
- Convention typo des schémas appliquée uniformément (Tasks 2-5 et conventions générales).

Plan complet. Prêt à exécuter.
