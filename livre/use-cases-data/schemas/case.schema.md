# Schéma canonique d'un cas pratique

> Contrat éditorial pour les 12 cas du livre (`livre/cas-pratiques/CC-XX-*.json`). Le build script `tools/build_case_pages.py` produit le HTML rendu à partir de cette structure ; les tests CI (`tests/cases-contract.test.mjs`) valident la conformité.

**Source unique de vérité** : le JSON. Le HTML est rebuilt à chaque édition. Ne jamais éditer un `livre/cas-pratiques/CC-XX-*.html` à la main.

---

## 1. Métadonnées (`meta`)

```json
{
  "id": "CC-01",                          // identifiant stable, indexé dans cases-index.json
  "titre": "Copilot conseiller bancaire",
  "secteur": "Banque",                    // libre, recommandé : aligné cases-index.json
  "facette_scaling": "build_vs_buy",      // une des 4 facettes (cf. cases-index.json)
  "regime": "hybride",                    // build | buy | hybride | build_souverain | …
  "ia_type": "generative",                // traditional_ml | generative | agentic | vision | vision_generative
  "gabarit": "charniere",                 // court | standard | charniere
  "thes_e_une_ligne": "…",                // pitch en une phrase, doit tenir en 160 caractères
  "auteur": "Mathieu Guglielmino",
  "date_v1": "2026-06-XX"
}
```

**Règle Klarna** (cf. `feedback_case_studies_no_brand_names.md`) : ne pas mentionner "Klarna" explicitement dans `thes_e_une_ligne` ni ailleurs. Paraphraser ("pattern fintech BNPL 2024", "cas d'école de la remontée échouée").

---

## 2. Mise en situation (`mise_en_situation`)

```json
{
  "scene": "Paragraphe scénique de 4-6 phrases — lieu, moment, déclencheur concret, tension humaine.",
  "chiffres_bruts": [
    { "label": "Conseillers", "valeur": "2 800" },
    { "label": "RDV/an",      "valeur": "1.2 M" },
    { "label": "NPS actuel",  "valeur": "38" },
    { "label": "Cost/RDV",    "valeur": "85 €" }
  ],
  "stack_actuel": "CRM Salesforce, fact-sheet PDF, recherche full-text 12s/requête",
  "horizon_temporel": "Pilote 6 mois → décision généralisation"
}
```

**Style** : pas de "il était une fois", entrée directe sur le détail concret. Utiliser placeholders `[VILLE]` / `[REGION]` au lieu de noms propres pour les lieux fictifs.

---

## 3. L'équipe (`equipe`)

Toujours 4 personas dans cet ordre : `porteur`, `sponsor`, `allie`, `opposant`. Utiliser placeholders rôle au lieu de prénoms (`[DIR_RETAIL]`, `[CFO]`, `[DSI]`, `[DPO]`…). Voir `shared/personas.json` pour les archétypes.

```json
{
  "porteur":  { "role": "Dir. Retail",     "posture": "…", "citation": "…" },
  "sponsor":  { "role": "CFO",             "posture": "…", "citation": "…" },
  "allie":    { "role": "DSI",             "posture": "…", "citation": "…" },
  "opposant": { "role": "Conformité (DDA)", "posture": "…", "citation": "…" }
}
```

`citation` : 1-2 phrases en italique dans le rendu. Doit refléter la posture (sceptique pour l'opposant, etc.).

---

## 4. Pourquoi (`enjeux`)

3 enjeux business chiffrés, format homogène :

```json
[
  { "label": "Délester l'entretien", "chiffre": "-8 min en moyenne",  "consequence": "+4 RDV/sem/conseiller" },
  { "label": "Réduire le cost/contact", "chiffre": "85 € → 68 €",     "consequence": "ROI 18 mois" },
  { "label": "Élever la consistency",   "chiffre": "écart doctrine < 5 %", "consequence": "vs 12 % baseline" }
]
```

+ un benchmark sectoriel :

```json
{
  "benchmark": {
    "reference": "Bank of America (Erica) 2024",
    "metrique": "1.5 Md interactions / NPS digital +12 pts",
    "renvoi_livre": "ch.21.8"
  }
}
```

---

## 5. Build / Buy / Hybride (`build_buy`) — **CLÉ**

Toujours 3 options évaluées côte à côte, même si une seule fait sens. La transparence du raisonnement importe autant que la conclusion.

```json
{
  "criteres": [
    "data_sensitivity",
    "personnalisation",
    "volumetrie",
    "lock_in",
    "time_to_value",
    "souverainete"
  ],
  "options": [
    {
      "regime": "interne",
      "stack": "LangGraph + vLLM + Mistral 7B fine-tuned sur corpus DDA",
      "scores": { "data_sensitivity": "++", "personnalisation": "++", "volumetrie": "+", "lock_in": "+", "time_to_value": "--", "souverainete": "++" },
      "verdict": "Trop lent à mettre en prod pour le calendrier sponsor."
    },
    {
      "regime": "mainstream",
      "solution": "Microsoft Copilot Studio",
      "scores": { "data_sensitivity": "-", "personnalisation": "-", "volumetrie": "++", "lock_in": "--", "time_to_value": "++", "souverainete": "--" },
      "verdict": "Time-to-value imbattable mais lock-in Azure problématique pour le métier régulé."
    },
    {
      "regime": "hybride",
      "stack": "Orchestrateur maison + Claude via MCP + RAG corpus interne",
      "scores": { "data_sensitivity": "+", "personnalisation": "+", "volumetrie": "+", "lock_in": "0", "time_to_value": "+", "souverainete": "0" },
      "verdict": "RECOMMANDÉ — équilibre time-to-value et souveraineté."
    }
  ],
  "decision_ponderee": "Hybride : démarrage POC sur API Claude, ré-évaluation à 12 mois pour internaliser le routing.",
  "renvoi_livre": "ch.21.6 arbre décision"
}
```

Notation : `--` / `-` / `0` / `+` / `++` (5 niveaux). Le rendu HTML traduit en pictos ou code couleur.

---

## 6. Trajectoire de coûts (`trajectoire_couts`) — **CLÉ**

Grille canonique 4 phases × 8 postes (postes définis dans `shared/cost-postes.json`). Valeurs en **k€**.

```json
{
  "phases": [
    { "id": "poc",    "label": "POC 3 mois",    "perimetre": "80 conseillers, 1 région" },
    { "id": "pilote", "label": "Pilote 6 mois", "perimetre": "400 conseillers, 4 régions" },
    { "id": "prod",   "label": "Prod 12 mois",  "perimetre": "2 800 conseillers, 14 régions" },
    { "id": "scale",  "label": "Scale 36 mois", "perimetre": "2 800 conseillers + cross-sell + suivi long" }
  ],
  "postes": {
    "inference":   { "poc": 5,  "pilote": 30,  "prod": 180,  "scale": 450  },
    "infra":       { "poc": 8,  "pilote": 25,  "prod": 90,   "scale": 220  },
    "equipe":      { "poc": 50, "pilote": 200, "prod": 600,  "scale": 1400 },
    "data":        { "poc": 10, "pilote": 40,  "prod": 60,   "scale": 80   },
    "evaluation":  { "poc": 5,  "pilote": 30,  "prod": 120,  "scale": 300  },
    "gouvernance": { "poc": 3,  "pilote": 15,  "prod": 60,   "scale": 150  },
    "securite":    { "poc": 2,  "pilote": 20,  "prod": 80,   "scale": 180  },
    "change":      { "poc": 0,  "pilote": 30,  "prod": 120,  "scale": 280  }
  },
  "cout_par_interaction": { "poc": 2.10, "pilote": 0.85, "prod": 0.42, "scale": 0.28 },
  "crossover_point": "≈ 800 k interactions / an : seuil au-delà duquel l'hybride avec routing interne bat la solution mainstream pure.",
  "commentaire_courbe": "Le coût par interaction divise par 7 entre POC et Scale, MAIS le poste équipe est multiplié par 28 — paradoxe agentique (ch.21.7)."
}
```

**Règle** : `cout_par_interaction[scale]` < `cout_par_interaction[poc]` (sinon il y a un problème de design — soulever en débat). Si exception réelle, documenter dans `commentaire_courbe`.

---

## 7. Gouvernance (`gouvernance`) — **CLÉ**

```json
{
  "raci": {
    "responsable":   "Équipe produit copilot (lead + 2 prompt eng + 1 ML eng)",
    "approbateur":   "Dir. Retail (sponsor)",
    "consultes":     ["DPO", "RSSI", "Conformité DDA", "Comité IA Risk"],
    "informes":      ["CODIR", "Représentants conseillers (CSE)"]
  },
  "cadence_revue": {
    "comite_eval":   "trimestriel",
    "alertes":       "continues (Datadog + LLM-as-judge échantillon 5%)",
    "audit_externe": "annuel (cabinet conformité bancaire)"
  },
  "ai_act_ligne": {
    "niveau":     "haut_risque",
    "fondement":  "Annexe III §5 — évaluation de la solvabilité",
    "echeance":   "2026-08 (transparence) puis 2027-08 (obligations complètes)",
    "actions":    ["FRIA documentée", "Registre Annexe IV", "Log d'audit ≥ 6 mois"]
  },
  "renvoi_livre": "ch.23.5 banque sous AI Act"
}
```

---

## 8. Évaluation (`evaluation`) — **CLÉ**

Boucle à 4 temps. Chaque cas la décline.

```json
{
  "regression_suite": {
    "taille":    "120 cas dorés DDA + 40 cas adversariaux",
    "cadence":   "mise à jour mensuelle par cellule conformité",
    "criteres":  ["respect DDA", "consistency vs doctrine", "absence cross-sell agressif"]
  },
  "metriques_online": [
    { "id": "consistency-rate",     "cible": "> 95 %", "alerte": "< 92 %" },
    { "id": "DDA-violation-rate",   "cible": "0",      "alerte": "> 0 (rollback immédiat)" },
    { "id": "csat",                 "cible": "> 4.2/5", "alerte": "< 4.0/5" }
  ],
  "detection_derive": {
    "outil":    "Datadog + LLM-as-judge (Claude) sur 5 % des entretiens",
    "alerte":   "PagerDuty équipe produit, escalade DPO si DDA",
    "fenetre":  "rolling 7 jours vs baseline 30 jours"
  },
  "boucle_correction": {
    "trigger":           "ticket Linear ou alerte automatique",
    "delai_re_prompt":   "48 h",
    "cadence_re_finetune":"trimestriel",
    "rollback":          "possible en < 4 h via feature flag, contrat clause expresse"
  },
  "renvoi_livre": ["ch.17.X évaluation agent", "ch.18 audit trail"]
}
```

---

## 9. ROI (`roi`)

```json
{
  "axe_principal":     "vitesse",
  "axes_secondaires":  ["volume", "bienetre"],
  "methode_mobilisee": "TEI Forrester + Cigref Hard/Soft + arbre décision ch.21.6",
  "metriques": [
    { "id": "processing-time",      "formule_courte": "ΔDurée × Volume × Coût/min", "borne_basse": "-3 min",   "cible": "-8 min",   "borne_haute": "-12 min" },
    { "id": "cost-per-contact",     "formule_courte": "ΔCost × Volume",             "borne_basse": "-8 €",    "cible": "-17 €",    "borne_haute": "-25 €"  },
    { "id": "conversion-rate",      "formule_courte": "ΔConv × Volume × Margin",     "borne_basse": "+0.5 pt", "cible": "+1.5 pt",  "borne_haute": "+3 pt"  },
    { "id": "employee-engagement",  "formule_courte": "ΔeNPS × retention modeled",   "borne_basse": "+3",     "cible": "+8",       "borne_haute": "+12"   }
  ],
  "non_retenu": [
    { "id": "fraud-avoided", "raison": "pas le périmètre (cf. CC-03)" },
    { "id": "basket-size",   "raison": "attribution copilot ↔ cross-sell trop indirecte" },
    { "id": "nps",           "raison": "secondaire de convergence Soft, pas KPI primaire (cf. ch.21.5.4)" }
  ]
}
```

**Référencement** : tout `id` métrique doit exister dans `shared/roi-metrics.json`. Validé par CI.

---

## 10. Débat (`debat`)

```json
{
  "question": "Le ROI Vitesse cache-t-il le risque de pivot Vitesse → Hybride documenté 2024 ?",
  "pour":  [
    { "argument": "Hard savings mesurables, signés CFO." },
    { "argument": "Réallocation prouvable des minutes économisées." }
  ],
  "contre": [
    { "argument": "Le pattern fintech BNPL 2024 a optimisé Vitesse, dégradé Qualité, fait marche arrière 18 mois plus tard." },
    { "argument": "Soft savings (conseil consistant) protègent le FDC contre les banques 100 % en ligne." }
  ],
  "verdict_pondere": "KPI primaire = Vitesse, KPI gardien = consistency-rate. Échantillon humain de re-listening 5 % des RDV. Clause de rollback si NPS dégrade > 2 pts en 18 mois.",
  "renvois_livre": ["ch.21.5", "ch.21.7.2"]
}
```

Pas de "Klarna" dans `pour`/`contre`/`verdict_pondere`.

---

## 11. Bifurcations reader-driven (`choix_lecteur`)

2-3 bifurcations selon gabarit (court=1, standard=2, charnière=3). Format strict :

```json
[
  {
    "question": "Vous êtes le CFO. Vous engagez 2.8 M€ sur 18 mois pour mesurer EN PREMIER à 6 mois…",
    "options": [
      { "id": "A", "label": "Cost-per-contact baseline+pilote",
        "consequence": "Vous tombez dans le piège du Hard isolé : la consistency a déjà dérivé de 4 pts, invisible dans le KPI primaire.",
        "grille_analyse": "Cf. règle de validation Hard ch.21.5.3 — preuve de réallocation OUI, mais sans contre-poids Soft, le pivot Vitesse → Hybride menace à 12-18 mois.",
        "renvoi_chapitre": "ch.21.5.3"
      },
      { "id": "B", "label": "NPS conseillers (eNPS)",
        "consequence": "Le pilote est jugé succès Soft mais le CFO ne peut pas signer la généralisation : pas de chiffre Hard à présenter au CODIR.",
        "grille_analyse": "Cf. règle de validation Soft ch.21.5.4 — convergence à 3 indicateurs requise, eNPS seul ne tient pas.",
        "renvoi_chapitre": "ch.21.5.4"
      },
      { "id": "C", "label": "Combo Vitesse + KPI gardien qualité",
        "consequence": "Vous tenez l'alignement Cigref — KPI Hard signé CFO + garde-fou Soft qui déclenche rollback si dérive.",
        "grille_analyse": "Cf. règle Cigref alignement stratégique ch.21.7.3 — c'est le seul setup qui évite le retour à l'hybride forcé.",
        "renvoi_chapitre": "ch.21.7.3"
      }
    ]
  }
]
```

**Règle pédagogique** : au moins une option doit être un "piège" (A ou B), une option doit être la bonne pratique (C). L'idée n'est pas de noter le lecteur mais de lui faire **rencontrer** les 3 chemins.

---

## 12. Quiz (`quiz`)

2-3 cartes-quiz. Workflow JSON identique aux autres dossiers du site (cf. `evaluation-agentique/quizzes.json`).

```json
[
  {
    "question": "Pourquoi cost-per-contact seul est-il un piège ?",
    "options": [
      "Parce qu'il n'est pas mesurable",
      "Parce qu'il manque la preuve de réallocation",
      "Parce qu'il ignore la dérive Qualité Soft qui peut imposer un retour à l'hybride à 18 mois",
      "Parce qu'il est interdit par le RGPD"
    ],
    "bonne_reponse": 2,
    "explication": "Le KPI Hard isolé ne déclenche pas le rollback quand la consistency dérive — c'est l'angle mort qui a coûté cher au pattern fintech BNPL documenté 2024.",
    "renvoi_chapitre": "ch.21.5"
  }
]
```

---

## 13. Verdict (`verdict`)

```json
{
  "stamp":      "PILOT_ETENDU_CONDITIONNE",  // GO_BUILD | GO_BUY | GO_HYBRIDE | PILOT_CONDITIONNE | PILOT_HITL | NO_GO | …
  "label":     "Pilote étendu, conditionné",
  "conditions": [
    "KPI primaire Vitesse + KPI gardien consistency-rate",
    "Échantillon humain re-listening 5 % des RDV",
    "Clause de rollback contractuelle si NPS dégrade > 2 pts en 18 mois"
  ]
}
```

---

## 14. Renvois livre (`renvois_livre`)

Liste plate, format `ch.XX.Y` ou `ch.XX`. Utilisée pour générer les callouts teal à la fin du cas et pour le tableau comparatif transverse.

```json
["ch.21.5", "ch.21.7.2", "ch.21.7.3", "ch.7", "ch.19", "ch.23.5"]
```

---

## 15. Figures (`figures`) — optionnel

0-2 schémas SVG inline par cas, anchor `fig-NN` zero-padded.

```json
[
  {
    "id": "fig-01",
    "titre": "Carte d'estimation Hard/Soft du copilot bancaire",
    "fichier": "images/CC-01-fig-01-roi-hard-soft.svg",
    "caption": "Sankey : 4 métriques → 4 axes → classification Hard/Soft."
  }
]
```

Conventions générales : voir skill `svg-schemas`.

---

## 16. Validation CI

- `tests/cases-contract.test.mjs` — vérifie présence des sections obligatoires (1, 2, 3, 5, 6, 7, 8, 9, 10, 13, 14).
- `tests/roi-metrics-contract.test.mjs` — vérifie que tout `roi.metriques[].id` existe dans `shared/roi-metrics.json`.
- `tests/cases-build.test.mjs` — vérifie que la sortie HTML contient les 9 widgets attendus (case-team-cast, case-build-buy, case-cost-trajectory, case-governance-stack, case-eval-loop, case-roi-grid, case-debate, case-choice, case-verdict).

Tous zéro dépendance, < 5 s, alignés avec le pattern des tests existants (`lib-contract.test.mjs`).
