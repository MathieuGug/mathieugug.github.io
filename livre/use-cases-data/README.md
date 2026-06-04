# `livre/use-cases-data/` — Standards partagés des 12 cas pratiques

**Bibliothèque de standards** : index des 12 cas, schéma JSON canonique, métriques ROI curées, postes de coûts, personas. Les cas individuels (JSON structuré + MD narratif + SVG figures) vivent dans `livre/cas-pratiques/` comme dossier d'artefact autonome.

> **État : phase 1bis terminée** — CC-01 pilote (JSON + MD + 2 SVG) livré dans `cas-pratiques/`. Build engine HTML arrive en phase 2.

---

## Contenu

### Bibliothèque standards (ici, `livre/use-cases-data/`)

```
use-cases-data/
├── README.md                          ← ce fichier
├── cases-index.json                   ← liste ordonnée des 12 cas + 8 en réserve
├── schemas/
│   └── case.schema.md                 ← contrat éditorial d'un CC-XX.json (19 sections)
├── shared/
│   ├── roi-metrics.json               ← 32 métriques ROI curées (de 85), classées Hard/Soft
│   ├── cost-postes.json               ← 8 postes de coûts standardisés × 4 phases
│   └── personas.json                  ← archétypes porteur/sponsor/allié/opposant
└── OLD/                               ← matière première (non versionnée, archive locale)
```

### Dossier d'artefact (`livre/cas-pratiques/`)

```
cas-pratiques/
├── cases/                             ← CC-XX-*.{json,md} par cas
│   ├── CC-01-copilot-banque.json      ← données structurées (19 sections du schema)
│   ├── CC-01-copilot-banque.md        ← narration lecteur (gabarit charnière ~6 000 mots)
│   └── …
├── images/                            ← CC-XX-fig-NN-*.svg par cas
│   ├── CC-01-fig-00-architecture-actuelle.svg
│   ├── CC-01-fig-01-roi-hard-soft.svg
│   └── …
└── (à venir phase 2) index.html + CC-XX-*.html par cas, rendus par build engine
```

---

## La thèse derrière les 12 cas

Chaque cas illustre une **facette** de la mise à l'échelle d'agents IA en entreprise :

| Facette | Question centrale | Cas qui l'incarnent |
|---|---|---|
| **Build / Buy / Hybride** | Plateforme interne, mainstream (Copilot Studio, Mistral Enterprise, Claude Enterprise), ou hybride via MCP ? | CC-01, CC-04, CC-08, CC-09, CC-10 |
| **Trajectoire de coûts** | Comment les 8 postes se recomposent sur POC → Pilote → Prod → Scale ? Où est le crossover build/buy ? | CC-02, CC-06, CC-13 |
| **Gouvernance** | Qui décide, qui audite, qui ré-entraîne ? Quelle ligne AI Act ? | CC-05, CC-07, CC-12 |
| **Évaluation** | Régression suite, détection dérive, boucle de correction online ? | CC-03 |

La **collection** porte la thèse plus fort que chaque cas isolé : à la fin (infographie A3 récapitulative), le lecteur a la carte de scaling complète.

## Les 8 postes de coûts standardisés

Voir [`shared/cost-postes.json`](shared/cost-postes.json) pour la doc complète.

| # | Poste | Comportement scale | Maîtrisé par |
|---|---|---|---|
| 1 | Inférence | ↘ LLMflation, ↗ adoption | routing + cache + foundation model |
| 2 | Infra | ↘ mutualisation, ↗ self-host | CapEx vs OpEx, edge |
| 3 | Équipe | ↗ linéaire, plafonne | recrutement vs SI externe |
| 4 | Data | one-shot + ↗ entretien | corpus interne vs partenariats |
| 5 | Évaluation | ↗ avec adoption — **sous-estimé** | budget continu, pas projet |
| 6 | Gouvernance | ↗ régulation, step-function secteur | calendrier AI Act |
| 7 | Sécurité | step-function post-incident | préventif vs réactif |
| 8 | Change | one-shot/cohorte — **sous-estimé** | ROI Soft + ambassadeurs |

## Les 12 cas

| # | ID | Titre | Secteur | Facette principale | Régime |
|---|---|---|---|---|---|
| 1 | **CC-01** | **Copilot conseiller bancaire** | Banque | Build vs Buy | Hybride |
| 2 | CC-02 | Agent vocal IA service client | Télécom | Trajectoire coûts | Buy → Build partial |
| 3 | CC-03 | Détection fraude temps réel | Banque | Évaluation | Build |
| 4 | CC-04 | Maintenance prédictive turbines | Énergie | Build vs Buy | Buy SaaS vertical |
| 5 | CC-05 | Optimisation grid temps réel | Énergie | Gouvernance | Build souverain |
| 6 | CC-06 | Try-on virtuel | Retail | Trajectoire coûts | Hybride |
| 7 | CC-07 | Pricing dynamique fret | Transport | Gouvernance | Build |
| 8 | CC-08 | Drug discovery IA | Life science | Build vs Buy | Buy partnership |
| 9 | CC-09 | Agent guichet unique | Admin publique | Build vs Buy | Build souverain |
| 10 | CC-10 | Pair programming dev | Dev logiciel | Build vs Buy | Buy comparatif |
| 11 | CC-13 | Contrôle qualité visuel usine | Industrie | Trajectoire coûts | Hybride edge |
| 12 | CC-12 | Modération contenu IA | Médias | Gouvernance | Hybride HITL |

Le détail (statut, axe ROI, gabarit, thèse, renvois livre) est dans [`cases-index.json`](cases-index.json).

## Règles éditoriales

- **Pas de "Klarna" explicite.** Paraphraser ("pattern fintech BNPL 2024", "cas d'école de la remontée échouée"). Renvois `ch.23.7.2` par numéro, pas par titre.
- **Pas de prénoms inventés** pour les personas — toujours `[FONCTION]` (cf. `shared/personas.json`).
- **Pas de noms de villes réelles** sans nécessité — placeholders `[VILLE]` / `[REGION]` quand le nom propre n'ajoute rien.
- **Pas de mention Lincoln**, ni dans le corps, ni dans les sources/légendes des schémas (cf. `CLAUDE.md` racine).
- **Disclosure IA** sur la page rendue (mention discrète footer).

## Pipeline (à venir phase 2-3)

```
tools/build_case_pages.py [--only CC-01]
   ↓ lit  livre/use-cases-data/cases-index.json
   ↓ lit  livre/use-cases-data/shared/{roi-metrics,cost-postes,personas}.json
   ↓ lit  livre/cas-pratiques/cases/CC-XX-*.json   (data structurée)
   ↓ lit  livre/cas-pratiques/cases/CC-XX-*.md     (narration éditoriale)
   ↓ render via templates Python (string templating, safe HTML escaping)
   ↓ produit livre/cas-pratiques/CC-XX-*.html      (référence images/CC-XX-fig-NN-*.svg)
   ↓ injecte bloc SEO via markers (compat tools/seo_dossiers.py)
```

Tests CI (à venir phase 5) :
- `tests/cases-contract.test.mjs`
- `tests/roi-metrics-contract.test.mjs`
- `tests/cases-build.test.mjs`

## Rappel sources

La matière éditoriale (mises en situation, citations, blocages, benchmarks) provient de l'archive locale `OLD/data/` (121 cas × 11 secteurs). Cette archive est issue d'un format jeu antérieur (DECISION.AI) dont seul le contenu narratif a été conservé — la mécanique de jeu (points, tours, powers) est abandonnée. `OLD/` n'est pas versionné dans ce dossier (matière première, pas source canonique).
