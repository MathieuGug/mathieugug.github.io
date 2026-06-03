# Schéma canonique d'un cas pratique (v2)

> Contrat éditorial pour les 12 cas du livre (`livre/cas-pratiques/cases/CC-XX-*.json`). Le build script `tools/build_case_pages.py` produit le HTML rendu à partir de cette structure ; les tests CI (`tests/cases-contract.test.mjs`) valident la conformité.

**Source unique de vérité** : le JSON. Le HTML est rebuilt à chaque édition. Ne jamais éditer un `livre/cas-pratiques/CC-XX-*.html` à la main.

**v2 — 19 sections** : ajout de `architecture_actuelle`, `application_concrete`, `outils_internes`, `modeles_cibles`, fusion de `equipe` / `velocite` / `deadlines` en `operation_equipe`. Évolution motivée par la nécessité de fonder l'arbitrage build/buy/hybride sur l'architecture SI existante et les capacités modèles 2026 — sans ces sections, le cas reste théorique.

---

## Structure d'ensemble — 19 sections

| # | Section | Rôle |
|---|---|---|
| 1 | `meta` | Métadonnées (id, titre, secteur, facette, régime, thèse) |
| 2 | `mise_en_situation` | Scène concrète + chiffres bruts + horizon temporel |
| 3 | `architecture_actuelle` | **NEW** — stack SI existante + criticité par composant + `fig-00` |
| 4 | `application_concrete` | **NEW** — modes d'usage (A/B/C) + niveaux autonomie (L1→L4) + trajectoire multi-step |
| 5 | `outils_internes` | **NEW** — MCP servers à monter (effort + risque par outil) |
| 6 | `modeles_cibles` | **NEW** — matrice modèles + cascade recommandée + arguments souveraineté |
| 7 | `enjeux` | 3 enjeux chiffrés + benchmark sectoriel |
| 8 | `build_buy` | Table 3 colonnes (interne / mainstream / hybride) + verdict pondéré |
| 9 | `trajectoire_couts` | Grille 4 phases × 8 postes + cost/interaction + crossover point |
| 10 | `gouvernance` | RACI + cadence revue + ligne AI Act |
| 11 | `evaluation` | Régression suite + métriques online + détection dérive + boucle correction |
| 12 | `roi` | Axe principal + métriques retenues (3-5) + non retenu + méthode mobilisée |
| 13 | `operation_equipe` | **NEW MERGED** — 4 personas (porteur/sponsor/allié/opposant) + ETP par phase + vélocité + deadlines datées |
| 14 | `debat` | Pour / Contre / Verdict pondéré |
| 15 | `choix_lecteur` | Bifurcations reader-driven (1-3 selon gabarit) |
| 16 | `quiz` | Cartes-quiz (2-3) |
| 17 | `verdict` | Stamp + conditions |
| 18 | `renvois_livre` | Liste plate `ch.XX.Y` |
| 19 | `figures` | SVG inline (0-2) avec anchors `fig-NN` |

---

## 1. Métadonnées (`meta`)

```json
{
  "id": "CC-01",
  "titre": "Copilot conseiller bancaire",
  "secteur": "Banque",
  "facette_scaling": "build_vs_buy",
  "regime": "hybride",
  "ia_type": "generative",
  "gabarit": "charniere",
  "thes_e_une_ligne": "…",
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
  "horizon_temporel": "Pilote 6 mois → décision généralisation"
}
```

**Style** : pas de "il était une fois", entrée directe sur le détail concret. Utiliser placeholders `[VILLE]` / `[REGION]` au lieu de noms propres pour les lieux fictifs.

> Note v2 : le champ `stack_actuel` en string court a migré vers la section dédiée `architecture_actuelle` (section 3).

---

## 3. Architecture actuelle (`architecture_actuelle`) — **NEW v2**

Stack SI existante de l'entreprise au moment du déclencheur. Sans cette section, l'arbitrage build/buy reste théorique : ce qui est *déjà là* (legacy mainframe, SaaS récents, DMS legacy) décide de l'effort MCP, de la complexité d'intégration, du risque sécu.

```json
{
  "composants": [
    {
      "categorie": "canal_utilisateur",
      "nom": "Poste de travail conseiller (Windows + Edge + Office 365)",
      "criticite_pour_le_cas": "read_only",
      "remarque": "IAM Azure AD avec Conditional Access + MFA hardware key"
    },
    {
      "categorie": "front_metier",
      "nom": "Salesforce Financial Services Cloud (CRM cloud)",
      "criticite_pour_le_cas": "read_write_via_proxy_validation",
      "remarque": "Fiche client 360, RDV, opportunités, KYC, custom Lightning components"
    },
    {
      "categorie": "data_scoring",
      "nom": "Snowflake datamart (cloud Azure) + Pega Decisioning SaaS",
      "criticite_pour_le_cas": "read_only",
      "remarque": "Snowflake mirror nuit du core banking ; Pega API REST pour scoring crédit temps réel"
    },
    {
      "categorie": "core_metier_regule",
      "nom": "Mainframe IBM z/OS COBOL + middleware Tibco/MQ",
      "criticite_pour_le_cas": "pas_touche_regule",
      "remarque": "Décision crédit OFFICIELLE humaine, jamais déléguée à IA. APIs WS-SOAP exposées via middleware legacy."
    },
    {
      "categorie": "knowledge_base",
      "nom": "SharePoint Online + Documentum DMS + Confluence",
      "criticite_pour_le_cas": "read_only",
      "remarque": "Documentum legacy = MCP wrapper custom obligatoire (le sclérosant)"
    },
    {
      "categorie": "back_office",
      "nom": "ServiceNow + Power BI",
      "criticite_pour_le_cas": "read_write",
      "remarque": "Tickets back-office + reporting hiérarchique"
    }
  ],
  "implications_structurantes": [
    "Cloud Azure dominant → Microsoft Copilot Studio s'intègre quasi natif (argument time-to-value).",
    "Mainframe inaccessible → le copilot prépare le dossier, l'humain signe.",
    "Documentum legacy → MCP wrapper custom obligatoire (3-4 sem. d'effort).",
    "Azure AD → SSO + scope par grade conseiller (junior/senior/manager) géré côté IAM."
  ],
  "renvoi_figure": "fig-00"
}
```

**Conventions** :
- `categorie` libre mais recommandé : `canal_utilisateur` / `front_metier` / `data_scoring` / `core_metier_regule` / `knowledge_base` / `back_office` / `outils_satellites`.
- `criticite_pour_le_cas` ∈ `read_only` / `read_write` / `read_write_via_proxy_validation` / `pas_touche_regule` / `non_concerne`.
- La figure `fig-00-architecture-actuelle.svg` est **obligatoire** sur chaque cas — c'est le test de véracité de l'analyse architecturale.

---

## 4. Application concrète (`application_concrete`) — **NEW v2**

Ce que fait *réellement* l'IA — pas un pitch marketing mais le workflow détaillé. Trois sous-sections : modes d'usage temporels, niveaux d'autonomie progressifs, trajectoire multi-step d'un appel typique.

```json
{
  "modes_usage": [
    {
      "id": "A",
      "label": "Préparation pré-RDV",
      "moment": "5 min avant le RDV, déclenché par bouton 'Briefer ce RDV' sur Salesforce",
      "actions": [
        "Génère brief client 360°",
        "Suggère 3 opportunités cross-sell (avec pré-filtre DDA)",
        "Propose trame d'entretien adaptée au profil",
        "Flags de vigilance conformité"
      ]
    },
    {
      "id": "B",
      "label": "Pendant le RDV (temps réel, side-panel CRM)",
      "moment": "Transcription temps réel via Deepgram on-prem, pas d'enregistrement audio persistant (RGPD)",
      "sous_modes": [
        {
          "id": "B1",
          "label": "Q&A doc temps réel",
          "description": "Réponse en 4-6 sec avec source citée à la question conseiller"
        },
        {
          "id": "B2",
          "label": "Suggestion produit contextuelle",
          "description": "Détecte mention projet → propose offre éligible + arguments + flag DDA"
        },
        {
          "id": "B3",
          "label": "Pré-remplissage formulaire",
          "description": "Remplit champs Salesforce en silence, validation 1-clic par le conseiller"
        }
      ]
    },
    {
      "id": "C",
      "label": "Post-RDV",
      "moment": "10 min après la fin du RDV",
      "actions": [
        "Génère compte-rendu structuré (résumé, décisions, actions de relance datées)",
        "Crée ticket ServiceNow si pièces manquantes",
        "Met à jour fiche Salesforce (tags d'intérêt, prochaine action)",
        "Sauvegarde audit trail conformité"
      ]
    }
  ],
  "niveaux_autonomie": [
    { "id": "L1", "label": "Suggest",                    "description": "Suggestions textuelles, conseiller copie-colle",                          "active_en": "POC (8 sem.)" },
    { "id": "L2", "label": "Pré-remplir",                "description": "Écrit dans Salesforce des champs structurés, validation globale 1-clic", "active_en": "Pilote (mois 4-9)" },
    { "id": "L3", "label": "Exécuter sous validation",   "description": "Crée ticket ServiceNow, met à jour fiche, envoie email récap — chaque action validée 1-clic", "active_en": "Prod (mois 10-22)" },
    { "id": "L4", "label": "Pleine autonomie",           "description": "Agit sans validation humaine",                                              "active_en": "INTERDIT — DDA + AI Act Annexe III §5 exigent supervision humaine effective" }
  ],
  "trajectoire_multi_step_exemple": {
    "scenario": "Mode B.2 — suggestion produit contextuelle suite à mention 'travaux d'isolation, 18 000 € sur 7 ans'",
    "etapes": [
      {
        "id": 1,
        "label": "Listen",
        "description": "Transcription streaming (Deepgram on-prem)"
      },
      {
        "id": 2,
        "label": "Retrieve",
        "description": "5 appels MCP en parallèle (~1.2 s total)",
        "outils_appeles": [
          "salesforce-mcp.get_client_360",
          "snowflake-mcp.get_credit_history",
          "pega-mcp.score_credit_conso",
          "sharepoint-mcp.search_offers",
          "documentum-mcp.search_dda"
        ]
      },
      {
        "id": 3,
        "label": "Reason",
        "description": "Chain-of-thought sur modèle reasoning : DTI projeté, éligibilité offre, check DDA, score Pega — conclusion produit suggéré + flag opportunité + audit DDA",
        "renvoi_livre": "ch.7 boucle agent + ch.2 modèles reasoning"
      },
      {
        "id": 4,
        "label": "Propose",
        "description": "Carte produit en side-panel avec arguments + DTI + check DDA + cross-sell + boutons [Insérer] [Ignorer]"
      },
      {
        "id": 5,
        "label": "Audit",
        "description": "Log structuré (chain-of-thought + sources retrieve + décision conseiller) → bucket S3 audit-trail (rétention 6 ans DDA)",
        "renvoi_livre": "ch.18 audit trail cognitif"
      }
    ]
  }
}
```

---

## 5. Outils internes / MCP servers (`outils_internes`) — **NEW v2**

Table opérationnelle des MCP servers à monter. Effort + risque par outil pour budgéter l'intégration. C'est ici que se logent les vraies surprises projet.

```json
{
  "mcp_servers": [
    {
      "systeme": "Salesforce FSC",
      "mode": "read_write_via_proxy",
      "type_mcp": "officiel disponible",
      "effort_dev": "1 sem. customization",
      "risque": "moyen",
      "raison_risque": "scopes par grade conseiller (junior/senior/manager) à câbler"
    },
    {
      "systeme": "Snowflake datamart",
      "mode": "read",
      "type_mcp": "open source (snowflake-mcp)",
      "effort_dev": "2 j config",
      "risque": "bas"
    },
    {
      "systeme": "Pega Decisioning",
      "mode": "read",
      "type_mcp": "custom (API REST)",
      "effort_dev": "1 sem.",
      "risque": "bas"
    },
    {
      "systeme": "SharePoint Online",
      "mode": "read",
      "type_mcp": "officiel Microsoft",
      "effort_dev": "3 j",
      "risque": "moyen",
      "raison_risque": "RBAC + scoping des libraries autorisées"
    },
    {
      "systeme": "Documentum DMS",
      "mode": "read",
      "type_mcp": "custom obligatoire (legacy SOAP)",
      "effort_dev": "3 sem.",
      "risque": "haut",
      "raison_risque": "Legacy SOAP + permissions granulaires + corpus DDA mal structuré — le sclérosant projet."
    },
    {
      "systeme": "ServiceNow",
      "mode": "write",
      "type_mcp": "officiel",
      "effort_dev": "1 sem.",
      "risque": "bas"
    },
    {
      "systeme": "Deepgram voice",
      "mode": "read_streaming",
      "type_mcp": "pas MCP, intégration websocket directe",
      "effort_dev": "1 sem.",
      "risque": "bas"
    }
  ],
  "effort_total": "6-8 semaines pour 1 backend dev sénior",
  "renvois_livre": ["ch.12 MCP plateforme", "ch.13 sécurité MCP"]
}
```

---

## 6. Modèles cibles (`modeles_cibles`) — **NEW v2**

Matrice des modèles candidats + recommandation explicite (cascade primaire + gardien quand pertinent). Projection sur les capacités 2026.

```json
{
  "candidats": [
    {
      "modele": "Claude 4.7 Sonnet",
      "force_pour_le_cas": "Excellent FR, tool use natif robuste, MCP first-class, context 1M tokens",
      "faiblesse": "Cloud US (RGPD scrutin) — atténué par AWS Bedrock résidence EU",
      "cout_indicatif": "$3 / $15 par M tokens"
    },
    {
      "modele": "Claude 4.7 Opus",
      "force_pour_le_cas": "Reasoning niveau supérieur, idéal sur arbitrages DDA complexes",
      "faiblesse": "Coût, latence",
      "cout_indicatif": "$15 / $75 par M tokens"
    },
    {
      "modele": "GPT-5",
      "force_pour_le_cas": "Voice tier intégré, structured output robuste",
      "faiblesse": "Lock-in MS si Copilot Studio",
      "cout_indicatif": "$5 / $25 par M tokens"
    },
    {
      "modele": "Mistral Large 3",
      "force_pour_le_cas": "Souverain France — argument fort en banque réglementée",
      "faiblesse": "Reasoning légèrement en retrait sur arbitrages multi-critères",
      "cout_indicatif": "€2.5 / €10 par M tokens"
    },
    {
      "modele": "Mistral 7B fine-tuné",
      "force_pour_le_cas": "Coût plancher, peut tourner self-hosted pour 2nd opinion DDA",
      "faiblesse": "Capacité limitée, pas standalone pour ce cas",
      "cout_indicatif": "OpEx infra"
    }
  ],
  "recommandation": {
    "regime": "cascade",
    "modele_primaire": "Claude 4.7 Sonnet (via AWS Bedrock résidence EU)",
    "modele_gardien": "Mistral 7B fine-tuned self-hosted (2nd opinion sur tout flag DDA)",
    "voice_tier": "Deepgram on-prem",
    "embeddings_rag": "Mistral embed (souverain, perf OK)",
    "argument_cascade": "Tient le tweet 'et si OpenAI/Anthropic est down ?' — fallback dégradé sur Mistral seul possible. Souverain partiel + capacité reasoning + coût maîtrisé."
  }
}
```

---

## 7. Pourquoi (`enjeux`)

3 enjeux business chiffrés + benchmark sectoriel.

```json
{
  "enjeux_chiffres": [
    { "label": "Délester l'entretien",   "chiffre": "-8 min en moyenne",         "consequence": "+4 RDV/sem/conseiller" },
    { "label": "Réduire le cost/contact","chiffre": "85 € → 68 €",               "consequence": "ROI 18 mois" },
    { "label": "Élever la consistency",  "chiffre": "écart doctrine < 5 %",      "consequence": "vs 12 % baseline" }
  ],
  "benchmark": {
    "reference": "Bank of America (Erica) 2024",
    "metrique": "1.5 Md interactions / NPS digital +12 pts",
    "renvoi_livre": "ch.21.8"
  }
}
```

---

## 8. Build / Buy / Hybride (`build_buy`) — alimenté par sections 3-6

Toujours 3 options évaluées côte à côte, même si une seule fait sens. Notation `--` / `-` / `0` / `+` / `++`.

```json
{
  "criteres": ["data_sensitivity", "personnalisation", "volumetrie", "lock_in", "time_to_value", "souverainete"],
  "options": [
    {
      "regime": "interne",
      "stack": "LangGraph + vLLM + Mistral 7B fine-tuned sur corpus DDA",
      "scores": { "data_sensitivity": "++", "personnalisation": "++", "volumetrie": "+", "lock_in": "+", "time_to_value": "--", "souverainete": "++" },
      "verdict": "Trop lent à mettre en prod pour le calendrier sponsor (Q2 2027 CODIR)."
    },
    {
      "regime": "mainstream",
      "solution": "Microsoft Copilot Studio (GPT-5 sur Azure)",
      "scores": { "data_sensitivity": "-", "personnalisation": "-", "volumetrie": "++", "lock_in": "--", "time_to_value": "++", "souverainete": "--" },
      "verdict": "Time-to-value imbattable mais lock-in Azure problématique pour métier régulé."
    },
    {
      "regime": "hybride",
      "stack": "Orchestrateur maison + Claude 4.7 Sonnet via MCP + cascade Mistral 7B FT gardien + RAG corpus interne",
      "scores": { "data_sensitivity": "+", "personnalisation": "+", "volumetrie": "+", "lock_in": "0", "time_to_value": "+", "souverainete": "0" },
      "verdict": "RECOMMANDÉ — équilibre time-to-value, souveraineté partielle et fallback dégradé."
    }
  ],
  "decision_ponderee": "Hybride : démarrage POC sur API Anthropic, ré-évaluation à 12 mois pour internaliser routing et gardien.",
  "renvoi_livre": "ch.21.6 arbre décision"
}
```

---

## 9. Trajectoire de coûts (`trajectoire_couts`)

Grille canonique 4 phases × 8 postes (postes définis dans `shared/cost-postes.json`). Valeurs en **k€**.

```json
{
  "phases": [
    { "id": "poc",    "label": "POC 3 mois",    "perimetre": "20 conseillers, 1 agence" },
    { "id": "pilote", "label": "Pilote 6 mois", "perimetre": "80 conseillers, 4 agences" },
    { "id": "prod",   "label": "Prod 12 mois",  "perimetre": "2 800 conseillers, 14 régions" },
    { "id": "scale",  "label": "Scale 36 mois", "perimetre": "2 800 conseillers + cross-sell + suivi long" }
  ],
  "postes": {
    "inference":   { "poc": 5,  "pilote": 30,  "prod": 180,  "scale": 450  },
    "infra":       { "poc": 8,  "pilote": 25,  "prod": 90,   "scale": 220  },
    "equipe":      { "poc": 90, "pilote": 280, "prod": 720,  "scale": 1500 },
    "data":        { "poc": 10, "pilote": 40,  "prod": 60,   "scale": 80   },
    "evaluation":  { "poc": 5,  "pilote": 30,  "prod": 120,  "scale": 300  },
    "gouvernance": { "poc": 8,  "pilote": 25,  "prod": 80,   "scale": 180  },
    "securite":    { "poc": 5,  "pilote": 20,  "prod": 80,   "scale": 180  },
    "change":      { "poc": 0,  "pilote": 40,  "prod": 160,  "scale": 320  }
  },
  "cout_par_interaction": { "poc": 2.10, "pilote": 0.85, "prod": 0.42, "scale": 0.28 },
  "crossover_point": "≈ 800 k interactions / an : seuil au-delà duquel l'hybride avec routing interne bat la solution mainstream pure.",
  "commentaire_courbe": "Le coût par interaction divise par 7 entre POC et Scale, MAIS le poste équipe est multiplié par ~17 — paradoxe agentique (ch.21.7) : l'unité de mesure se déplace de l'inférence vers l'équipe + change."
}
```

**Règle** : `cout_par_interaction[scale]` < `cout_par_interaction[poc]` (sinon problème de design — soulever en débat). Si exception réelle, documenter dans `commentaire_courbe`.

---

## 10. Gouvernance (`gouvernance`)

```json
{
  "raci": {
    "responsable":   "Équipe produit copilot (Tech Lead + 2 prompt eng + 1 ML eng)",
    "approbateur":   "Dir. Retail (sponsor)",
    "consultes":     ["DPO", "RSSI", "Conformité DDA", "Comité IA Risk"],
    "informes":      ["CODIR", "CSE / représentants conseillers"]
  },
  "cadence_revue": {
    "comite_eval":   "trimestriel",
    "alertes":       "continues (Datadog + LLM-as-judge échantillon 5%)",
    "audit_externe": "annuel (cabinet conformité bancaire)"
  },
  "ai_act_ligne": {
    "niveau":     "haut_risque",
    "fondement":  "Annexe III §5 — évaluation de la solvabilité dans le cadre du conseil crédit",
    "echeance":   "2026-08 (transparence) puis 2027-08 (obligations complètes)",
    "actions":    ["FRIA documentée", "Registre Annexe IV", "Log d'audit ≥ 6 ans", "Supervision humaine effective (DDA + AI Act)"]
  },
  "renvoi_livre": "ch.23.5 banque sous AI Act"
}
```

---

## 11. Évaluation (`evaluation`)

Boucle à 4 temps : régression suite → métriques online → détection dérive → boucle correction.

```json
{
  "regression_suite": {
    "taille":    "120 cas dorés DDA + 40 cas adversariaux",
    "cadence":   "mise à jour mensuelle par cellule conformité",
    "criteres":  ["respect DDA", "consistency vs doctrine", "absence cross-sell agressif"]
  },
  "metriques_online": [
    { "id": "response-consistency",  "cible": "> 95 %", "alerte": "< 92 %" },
    { "id": "regulatory-compliance", "cible": "0 violation DDA", "alerte": "> 0 (rollback immédiat)" },
    { "id": "csat",                  "cible": "> 4.2/5", "alerte": "< 4.0/5" }
  ],
  "detection_derive": {
    "outil":    "Datadog + LLM-as-judge (Mistral 7B FT gardien) sur 5 % des entretiens",
    "alerte":   "PagerDuty équipe produit, escalade DPO si DDA",
    "fenetre":  "rolling 7 jours vs baseline 30 jours"
  },
  "boucle_correction": {
    "trigger":              "ticket Linear ou alerte automatique",
    "delai_re_prompt":      "48 h",
    "cadence_re_finetune":  "trimestriel sur le gardien Mistral",
    "rollback":             "possible en < 4 h via feature flag, contrat clause expresse"
  },
  "renvoi_livre": ["ch.17 évaluation agent", "ch.18 audit trail cognitif"]
}
```

---

## 12. ROI (`roi`)

```json
{
  "axe_principal":     "vitesse",
  "axes_secondaires":  ["volume", "bienetre"],
  "methode_mobilisee": "TEI Forrester + Cigref Hard/Soft + arbre décision ch.21.6",
  "metriques": [
    { "id": "processing-time",     "borne_basse": "-3 min",   "cible": "-8 min",   "borne_haute": "-12 min" },
    { "id": "cost-per-contact",    "borne_basse": "-8 €",     "cible": "-17 €",    "borne_haute": "-25 €"   },
    { "id": "conversion-rate",     "borne_basse": "+0.5 pt",  "cible": "+1.5 pt",  "borne_haute": "+3 pt"   },
    { "id": "employee-engagement", "borne_basse": "+3",       "cible": "+8",       "borne_haute": "+12"     }
  ],
  "non_retenu": [
    { "id": "fraud-avoided",  "raison": "pas le périmètre (cf. CC-03)" },
    { "id": "basket-size",    "raison": "attribution copilot ↔ cross-sell trop indirecte" },
    { "id": "nps",            "raison": "secondaire de convergence Soft, pas KPI primaire (cf. ch.21.5.4)" }
  ]
}
```

**Référencement** : tout `id` métrique doit exister dans `shared/roi-metrics.json`. Validé par CI.

---

## 13. Opération, équipe, vélocité, deadlines (`operation_equipe`) — **NEW MERGED v2**

Tout le bloc opérationnel en une section. Personas (les 4 archétypes du cas) + ETP par phase + cadence release + deadlines datées.

```json
{
  "personas": {
    "porteur":  { "role": "Dir. Retail",      "posture": "Convaincu, prend des risques mesurés", "citation": "Le retour d'expérience BNPL 2024 nous a fait peur, on va sur des risques bornés." },
    "sponsor":  { "role": "CFO",              "posture": "Veut un ROI Hard chiffrable pour le CODIR Q2 2027", "citation": "Si on dégage 5 pts de cost-ratio en 18 mois, je signe." },
    "allie":    { "role": "DSI",              "posture": "Voit l'opportunité de refondre la couche d'intégration legacy", "citation": "Le CRM est vétuste, c'est le moment de moderniser." },
    "opposant": { "role": "Conformité DDA",   "posture": "Garde-fou principiel, mandat légitime — souvent celui qui aura raison à 18 mois", "citation": "On a accepté l'IA pour la pré-qualif, pas pour recommander." }
  },
  "equipe_par_phase": {
    "poc": {
      "etp_total": 9.6,
      "composition": [
        { "role": "Tech Lead Agentic",          "etp": 1.0, "profil": "Senior Python+TS, expérience agentic ≥ 12 mois, MCP/tool use" },
        { "role": "ML Engineer",                "etp": 2.0, "profil": "Eval, RAG, fine-tuning Mistral 7B, MLOps" },
        { "role": "Backend MCP",                "etp": 1.0, "profil": "Le sclérosant : Documentum + Pega + middleware" },
        { "role": "Prompt Engineer",            "etp": 1.5, "profil": "1 banque/conformité + 0.5 conversation designer FR" },
        { "role": "Data Engineer",              "etp": 1.0, "profil": "Snowflake, corpus DDA, embeddings, qualité data" },
        { "role": "UX Designer",                "etp": 0.5, "profil": "Side-panel CRM, workflow conseiller, validation 1-clic" },
        { "role": "Product Owner",              "etp": 1.0, "profil": "Ex-conseiller banque retail — load-bearing" },
        { "role": "MLOps / SRE",                "etp": 0.5, "profil": "Observabilité, déploiement, monitoring agent" },
        { "role": "RSSI référent",              "etp": 0.3, "profil": "Threat model, MCP authz, red-team" },
        { "role": "DPO référent",               "etp": 0.3, "profil": "FRIA, registre AI Act, doctrine prompts" },
        { "role": "Change manager",             "etp": 0.5, "profil": "Formation, CSE, communication interne" }
      ]
    },
    "prod": { "etp_total": 6.0, "note": "Core 6 ETP + ressources mutualisées plateforme agent transverse" }
  },
  "velocite": {
    "poc":    { "duree": "8 sem.",  "cadence_release": "bi-hebdo",  "perimetre": "20 conseillers 1 agence, mode L1 Suggest, crédit conso" },
    "pilote": { "duree": "6 mois",  "cadence_release": "hebdo",     "perimetre": "80 conseillers 4 agences, mode L2 Pré-remplir, MCP Salesforce+Snowflake+SharePoint+Pega" },
    "prod":   { "duree": "12 mois", "cadence_release": "2 sem. + hotfix 48 h", "perimetre": "2 800 conseillers 14 régions, mode L3 sous validation, extension crédit immo + assurance" },
    "scale":  { "duree": "36 mois", "cadence_release": "mensuel",   "perimetre": "Optimisation cost/interaction, internalisation Mistral self-hosted, cross-sell pro" }
  },
  "sclerosants": [
    "Accès Documentum DMS legacy : +3-4 semaines toujours",
    "Qualité corpus DDA (doctrine éparpillée en circulaires PDF non-versionnées) : +1 mois data prep",
    "Gouvernance CSE/syndicats : 3 mois consultations obligatoires avant pilote élargi",
    "FRIA AI Act : 4 semaines, cabinet externe"
  ],
  "deadlines_externes": [
    { "echeance": "2026-08", "label": "AI Act transparence (Annexe III §5)", "consequence_si_ratee": "FRIA + registre obligatoires si système haut risque en prod sans documentation" },
    { "echeance": "2027-08", "label": "AI Act obligations complètes",        "consequence_si_ratee": "Audit externe, log 6 ans, non-conformité = amende jusqu'à 7 % CA" },
    { "echeance": "2027-Q2", "label": "CODIR premiers chiffres ROI",         "consequence_si_ratee": "Sponsor CFO doit présenter Hard savings concrets — sinon arrêt budget" },
    { "echeance": "2028",    "label": "Plan stratégique -10 pts cost-income ratio", "consequence_si_ratee": "Copilot est levier sur 1.5-2 pts du plan" }
  ],
  "deadline_operationnelle": "POC démarré sept. 2026 → pilote en prod avril 2027 → généralisation Q3 2027."
}
```

**Pas de prénoms** dans les personas (cf. `shared/personas.json`). **Pas de Klarna** dans les citations.

---

## 14. Débat (`debat`)

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

## 15. Bifurcations reader-driven (`choix_lecteur`)

1-3 bifurcations selon gabarit (court=1, standard=2, charnière=3). Au moins une option doit être un "piège" pédagogique (cf. règle ch.21.5).

```json
[
  {
    "question": "Vous êtes le CFO. Vous engagez 2.8 M€ sur 18 mois pour mesurer EN PREMIER à 6 mois…",
    "options": [
      { "id": "A", "label": "Cost-per-contact baseline+pilote",      "consequence": "…", "grille_analyse": "Cf. ch.21.5.3 — piège du Hard isolé", "renvoi_chapitre": "ch.21.5.3" },
      { "id": "B", "label": "NPS conseillers (eNPS)",                "consequence": "…", "grille_analyse": "Cf. ch.21.5.4 — piège du Soft seul",  "renvoi_chapitre": "ch.21.5.4" },
      { "id": "C", "label": "Combo Vitesse + KPI gardien qualité",    "consequence": "…", "grille_analyse": "Cf. ch.21.7.3 — alignement Cigref",   "renvoi_chapitre": "ch.21.7.3" }
    ]
  }
]
```

---

## 16. Quiz (`quiz`)

2-3 cartes-quiz. Workflow JSON identique aux autres dossiers du site.

```json
[
  {
    "question": "…",
    "options": ["…", "…", "…", "…"],
    "bonne_reponse": 2,
    "explication": "…",
    "renvoi_chapitre": "ch.21.5"
  }
]
```

---

## 17. Verdict (`verdict`)

```json
{
  "stamp":      "PILOT_ETENDU_CONDITIONNE",
  "label":     "Pilote étendu, conditionné",
  "conditions": [
    "KPI primaire Vitesse + KPI gardien consistency-rate",
    "Échantillon humain re-listening 5 % des RDV",
    "Clause de rollback contractuelle si NPS dégrade > 2 pts en 18 mois"
  ]
}
```

---

## 18. Renvois livre (`renvois_livre`)

Liste plate, format `ch.XX.Y` ou `ch.XX`. Utilisée pour générer les callouts teal à la fin du cas et pour le tableau comparatif transverse.

```json
["ch.21.5", "ch.21.7.2", "ch.21.7.3", "ch.7", "ch.13", "ch.17", "ch.18", "ch.19", "ch.23.5"]
```

---

## 19. Figures (`figures`)

**Au moins** `fig-00-architecture-actuelle.svg` obligatoire. Une ou deux figures additionnelles selon gabarit (charnière = jusqu'à 3, standard = jusqu'à 2).

```json
[
  {
    "id": "fig-00",
    "titre": "Architecture SI actuelle — banque retail mid-tier 2026",
    "fichier": "images/CC-01-fig-00-architecture-actuelle.svg",
    "caption": "Stack existante avant copilot : Salesforce + Snowflake + Pega + mainframe + Documentum + ServiceNow. Annotations criticité par composant."
  },
  {
    "id": "fig-01",
    "titre": "Carte d'estimation Hard/Soft du copilot bancaire",
    "fichier": "images/CC-01-fig-01-roi-hard-soft.svg",
    "caption": "Sankey : 4 métriques → 4 axes ROI → classification Hard / Soft. Illustre la règle ch.21.5 : Hard sans gardien Soft = risque de pivot Vitesse → Hybride."
  }
]
```

Conventions générales SVG : voir skill `svg-schemas` (palette site, échelle typo 28/18/15/13/12, flèches blanc visible avant cible, anchors `fig-NN` zero-padded dans la figcaption).

---

## 20. Validation CI (méta — pas une section JSON)

- `tests/cases-contract.test.mjs` — sections obligatoires : 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 17, 18, 19.
- `tests/roi-metrics-contract.test.mjs` — tout `roi.metriques[].id` existe dans `shared/roi-metrics.json`.
- `tests/cases-build.test.mjs` — sortie HTML contient les widgets attendus (case-team-cast, case-archi, case-app-modes, case-mcp, case-models, case-build-buy, case-cost-trajectory, case-governance-stack, case-eval-loop, case-roi-grid, case-debate, case-choice, case-verdict).

Tous zéro dépendance, < 5 s, alignés avec le pattern des tests existants (`lib-contract.test.mjs`).
