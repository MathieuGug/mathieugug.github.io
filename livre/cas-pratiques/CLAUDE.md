# CLAUDE.md — `livre/cas-pratiques/`

Dossier d'artefact : **un arc de maturité agentique en 14 études de cas** (4 strates : fondations → remontée métiers → galerie → chapeau) qui adosse le ch. 23 (ROI · paradoxe agentique) au terrain. Chaque cas illustre une facette de la mise à l'échelle d'agents IA en entreprise (build/buy, trajectoire de 8 postes de coûts × 4 phases, gouvernance, évaluation).

## Layout

```
livre/cas-pratiques/
├── CLAUDE.md                         ← ce fichier
├── index.html                        ← hub des cas, groupé en 4 strates (self-contained)
├── cases/
│   ├── CC-01-copilot-banque.json     ← données structurées (schéma 19 sections)
│   ├── CC-01-copilot-banque.md       ← narration éditoriale (charnière ~6 500 mots)
│   └── (à venir : CC-02 → CC-13)
├── images/
│   └── CC-01-copilot-banque/                       ← un sous-dossier par cas (CC-XX-slug/)
│       ├── CC-01-fig-00-architecture-actuelle.svg ← OBLIGATOIRE sur chaque cas
│       ├── CC-01-fig-01-roi-hard-soft.svg         ← ROI Sankey
│       ├── CC-01-fig-02-modes-temporels.svg       ← modes A/B/C
│       └── CC-01-fig-03-anatomie-appel.svg        ← pipeline Listen→Audit
└── CC-01-copilot-banque.html         ← HTML pilote rendu, self-contained
```

**Bibliothèque de standards partagés** : [`../use-cases-data/`](../use-cases-data/)
- `cases-index.json` — index ordonné des 12 cas + 8 en réserve
- `schemas/case.schema.md` — contrat éditorial 19 sections
- `shared/roi-metrics.json` — 32 métriques ROI classées Hard/Soft
- `shared/cost-postes.json` — 8 postes × 4 phases
- `shared/personas.json` — archétypes porteur/sponsor/allié/opposant

## Quick Reference

**Ajouter un cas pratique** :
1. Auteur `cases/CC-XX-slug.json` en suivant `../use-cases-data/schemas/case.schema.md` (19 sections obligatoires).
2. Auteur `cases/CC-XX-slug.md` (narration, ~5 000-7 000 mots selon gabarit).
3. Produire **au minimum `images/CC-XX-slug/CC-XX-fig-00-architecture-actuelle.svg`** (schéma de l'archi SI existante de l'entreprise — c'est le test de véracité du raisonnement build/buy/hybride).
4. Ajouter le cas dans `index.html` (carte de la grille, basculer `class="draft"` → `class="livre"` quand actif).
5. (Phase 2) Rebuilder le HTML via `tools/build_case_pages.py --only CC-XX`. Pour le moment, le HTML pilote CC-01 est écrit à la main — patron à reproduire pour les suivants.
6. Mettre à jour `index.html` racine livre (compteur de cas livrés dans le CTA `cas-pratiques`).

**Renvois chapitres** : toujours en liens markdown `[ch. XX.Y](../chapitres/chXX-*.md)`. Format Renvois en bas de chaque MD :

```md
- **[Ch. 23.5 — Hard vs Soft Savings](../../chapitres/ch23-roi-paradoxe-agentique.md)**
```

(Depuis `cases/CC-XX.md`, le chemin relatif est `../../chapitres/`. Depuis `CC-XX.html`, c'est `../chapitres/`.)

## Règles éditoriales

Trois règles non-négociables, validées par mémoire :

1. **Pas de "Klarna" explicite.** Paraphraser ("pattern fintech BNPL 2024", "cas d'école de la remontée échouée"). Renvois `ch.23.7.2` par numéro, pas par titre. ([feedback-case-studies-no-brand-names](../../.claude/.. mémoire))
2. **Architecture actuelle obligatoire.** Chaque cas commence par la stack SI existante (CRM, core métier, datamart, DMS, ticketing, IAM…) + figure `fig-00-architecture-actuelle.svg`. Sans ça, l'arbitrage build/buy est théorique. ([feedback-case-studies-always-archi-schema](../../.claude/.. mémoire))
3. **Jamais de ref aux JSON sources dans la prose narrative.** Pas de `(cf. shared/cost-postes.json)` dans le MD/HTML lecteur. Les JSON sont la source d'authoring, pas un objet éditorial.

Autres règles héritées du CLAUDE.md racine :

- **Pas de prénoms inventés** pour les personas — toujours `[FONCTION]` (`[CFO]`, `[DPO]`, `[DIR_RETAIL]`…) cf. `../use-cases-data/shared/personas.json`.
- **Pas de noms de villes réelles** sans nécessité — placeholders `[VILLE]` / `[REGION]`.
- **Pas de mention Lincoln** dans le corps des cas ni dans les sources/légendes des schémas (footer-only via `footer.site-foot`).
- **Disclosure IA** discrète en footer (`Format co-écrit avec l'aide d'une IA · …`).

## Conventions de format

### Naming

- JSON / MD : `cases/CC-XX-slug-court.{json,md}` — slug ≤ 4 mots kebab-case (ex. `copilot-banque`, `fraude-temps-reel`).
- SVG figures : `images/CC-XX-slug/CC-XX-fig-NN-slug.svg` — un sous-dossier `CC-XX-slug/` par cas (même slug que `cases/`), fichier nom complet ; `NN` zero-padded (`fig-00` → `fig-09`).
- HTML rendu : `CC-XX-slug-court.html` (même slug que JSON/MD).

### SVG figures

- Conventions skill `svg-schemas` (palette site, échelle typo 28/18/15/13/12, flèches blanc visible avant cible).
- `fig-00` = archi actuelle, **obligatoire**. Format recommandé : A3 paysage `viewBox="0 0 1600 1130"`.
- `fig-01` = ROI Hard/Soft Sankey (charnière) ou autre infographie pédagogique (standard).
- `fig-02+` = additionnels selon gabarit (charnière jusqu'à 4, standard jusqu'à 2).
- XML validé avant commit (parser strict). Apostrophes/`&`/`<`/`>` échappés en attributs.
- Bug connu : `text { fill: #X; }` CSS écrase l'attribut `fill="..."`. Pour forcer un fill spécifique (ex. blanc sur fond noir), utiliser `style="fill:#fff"` qui bat la CSS author.

### HTML rendu

- Self-contained pour le pilote (CC-01) : CSS + JS inline, seule dépendance externe = Google Fonts.
- Topbar 3-items :
  - Gauche : `← Cas pratiques` (lien `index.html`)
  - Centre : `.dossier-context` = titre du cas (ex. *Copilot conseiller bancaire*)
  - Droite : `Hub livre` (lien `../index.html`)
- Hero avec eyebrow `Cas pratique CC-XX · Secteur · iaType · Gabarit`.
- Widgets interactifs (case-choice, case-quiz) : JS inline, pas de framework.
- Bouton zoom ⛶ sur chaque figure (visible au hover desktop / opacité 0.85 mobile).
- Anchor `¶` cliquable en figcaption pour deep-link.

## État (au 2026-06-03)

L'annexe est structurée en **arc de maturité agentique** (4 strates) — cf. [`PROPOSITION-priorisation.md`](PROPOSITION-priorisation.md). Ordre canonique : `../use-cases-data/cases-index.json` (champ `ordre` + `strate`).

| Strate | ID | Cas | Statut | Lien |
|---|---|---|---|---|
| 🟦 Fondations | **CC-00** | Assistant transverse (routines · analyses · veille) | ✅ Livré (JSON + MD + 4 SVG + HTML) | [HTML](CC-00-assistant-transverse.html) · [MD](cases/CC-00-assistant-transverse.md) |
| 🟦 Fondations | **CC-03** | Plateforme data moderne & analytics agentique | ✅ Livré (JSON + MD + 4 SVG + HTML) | [HTML](CC-03-plateforme-data.html) · [MD](cases/CC-03-plateforme-data.md) |
| 🟦 Fondations | **CC-10** | Pair programming → organisation dev agentique | Draft index *(reframé : ia_type agentic)* | — |
| 🟩 Remontée métiers | **CC-01** | Copilot conseiller bancaire | ✅ Livré (JSON + MD + 4 SVG + HTML) | [HTML](CC-01-copilot-banque.html) · [MD](cases/CC-01-copilot-banque.md) |
| 🟩 Remontée métiers | **CC-02** | Agent vocal IA service client | 🖊️ Rédigé couche auteur (JSON + MD + 4 SVG) — HTML phase 2 | [MD](cases/CC-02-agent-vocal-telecom.md) · [JSON](cases/CC-02-agent-vocal-telecom.json) |
| 🟩 Remontée métiers | CC-09 | Agent guichet unique | Draft index | — |
| 🟨 Galerie | CC-13 | Contrôle qualité visuel usine | Draft index | — |
| 🟨 Galerie | CC-06 | Try-on virtuel | Draft index | — |
| 🟨 Galerie | CC-04 | Maintenance prédictive turbines | Draft index | — |
| 🟨 Galerie | CC-12 | Modération contenu IA | Draft index | — |
| 🟨 Galerie | CC-05 | Optimisation grid temps réel | Draft index *(proposé réserve — arbitrage)* | — |
| 🟨 Galerie | CC-07 | Pricing dynamique fret | Draft index *(proposé réserve — arbitrage)* | — |
| 🟨 Galerie | CC-08 | Drug discovery IA | Draft index *(proposé réserve — arbitrage)* | — |
| 🟥 Chapeau | **CC-11** | Gouverner une flotte d'agents | 🖊️ Rédigé couche auteur (JSON + MD + 3 SVG : fig-00 sprawl, fig-01 socle fédéré, fig-02 tiering+cycle de vie) — HTML phase 2 | [MD](cases/CC-11-flotte-agents.md) · [JSON](cases/CC-11-flotte-agents.json) · [Spec](PROPOSITION-cas-flotte-agents.md) |
| ⬛ Réserve | CC-03-reserve | Détection fraude temps réel *(ML traditionnel, hors focus)* | Couche auteur conservée dans `../use-cases-data/reserve/` | [MD](../use-cases-data/reserve/CC-03-fraude-temps-reel.md) · [JSON](../use-cases-data/reserve/CC-03-fraude-temps-reel.json) |

## Pipeline (à venir phase 2)

- `tools/build_case_pages.py` — idempotent, lit `../use-cases-data/cases-index.json` + `cases/CC-XX.{json,md}` + `images/CC-XX-slug/*.svg` → produit `CC-XX.html`. Réutilise le patron CC-01 livré à la main.
- Tests CI :
  - `tests/cases-contract.test.mjs` (toutes sections obligatoires présentes dans le JSON)
  - `tests/roi-metrics-contract.test.mjs` (toute métrique ROI référencée existe dans `shared/roi-metrics.json`)
  - `tests/cases-build.test.mjs` (HTML rendu contient les widgets attendus)
- SEO : `tools/seo_dossiers.py --only cas-pratiques` pour générer `og.png` + injecter le bloc OpenGraph via markers.

## Liens utiles

- Hub : [`index.html`](index.html)
- Schéma JSON canonique : [`../use-cases-data/schemas/case.schema.md`](../use-cases-data/schemas/case.schema.md)
- Métriques ROI : [`../use-cases-data/shared/roi-metrics.json`](../use-cases-data/shared/roi-metrics.json)
- Postes de coûts : [`../use-cases-data/shared/cost-postes.json`](../use-cases-data/shared/cost-postes.json)
- CC-01 pilote : [HTML](CC-01-copilot-banque.html) · [JSON](cases/CC-01-copilot-banque.json) · [MD](cases/CC-01-copilot-banque.md)
- Renvois chapitres source : [`../chapitres/`](../chapitres/)
