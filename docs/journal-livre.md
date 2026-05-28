# Journal de suivi — livre

Journal de production du livre (28 dossiers → 25 chapitres). Voir [`livre-outline.md`](./livre-outline.md) pour la structure globale.

> **Branche** : `claude/book-outline-concepts-2mRuR` · **Dépôt** : [mathieugug/mathieugug.github.io](https://github.com/MathieuGug/mathieugug.github.io)

## État global

| | Statut | Note |
| --- | --- | --- |
| Outline | ✅ v0 mergé (PR #127) | 4 actes, 25 chapitres, 3 catégories de schémas (S/R/E) |
| Audit schémas | 🟡 partiel | Ch.4 + Ch.7 + Ch.9 + Ch.10 + Ch.11 + Ch.17 faits — les 18 autres en attente |
| Manuscrit | 🟡 6/25 | **Ch.4 standard : v1 livrée** + **Ch.7 charnière : v1 livrée** + **Ch.9 standard : v1 livrée** + **Ch.10 standard : v1 livrée** + **Ch.11 standard : v1 livrée** + **Ch.17 charnière : v1 livrée** |
| Schémas R/E à produire | ⏳ | E4 (threat model), E3 (capability×cost), E5 (PRM comparatif), R1 (boucle ReAct + 3 variantes — Ch.7 traité par réutilisation), R2 (4 piliers × 6 opérations × 5 architectures — Ch.9 traité par réutilisation tel quel de `taxonomie-piliers.svg` en récap, complétion par matrice prod à demander pour print), R4 (8 patterns canoniques — Ch.11 traité par réutilisation de `patterns-canoniques.svg` tel quel), R5 (fabrique 4 stades — Ch.11 traité par tableau markdown faute de schéma fabrique-12 satisfaisant en gabarit récap), R11 (playbook gruyère — Ch.17 traité par réutilisation tel quel de `playbook-gruyere.svg` en récap), R12 (4 vecteurs contamination — Ch.17 traité par réutilisation tel quel de `vecteurs-contamination.svg`) — pas démarré pour les schémas E |
| Bugs SVG corrigés | ✅ 1 | `cinq-familles.svg` (balise XML malformée) |
| Rendu print/web | ⏳ | non décidé |

---

## Chapitre 17 — Évaluer un agent (et débunker les leaderboards)

> **Acte IV — Mesures et garde-fous · Gabarit charnière 28-40 p · ~10 700 mots**
> **Lecteur cible** : acheteur enterprise, tech lead, sponsor IA, RSSI, DPO, agent engineer.
> **Sortie lecteur** : maîtrise les trois ruptures qui ont rendu obsolètes F1/BLEU/ROUGE ; distingue task / trial / grader / transcript / outcome et les trois familles de graders ; comprend pourquoi pass^k > pass@k pour un agent client-facing ; connaît la grille CLEAR (Cost, Latency, Efficacy, Assurance, Reliability) et ses deux métriques composites CNA et CPS ; sait calibrer un LLM-as-a-judge (cinq biais, cinq correctifs, échelle 0-5 max) ; maîtrise la grammaire `TestCase = (Persona × Quest × Environment) → Outcome` et la chute dual-control de τ²-bench ; identifie les quatre vecteurs de fuite des benchmarks publics (chevauchement temporel, version-tag, gaming du harnais, leakage de prompt) et reconnaît qu'aucun n'est résolu par SWE-bench Verified ; sait situer une mesure dans le 2×2 contrôlé × ponctuel ; peut dérouler le playbook gruyère en 8 étapes ; reconnaît les trois pièges 100 % traçables (RFP au score SWE-bench, score brut sans inspection des transcripts, juge LLM unique non calibré).

### Statut

| Étape | Statut |
| --- | --- |
| Audit schémas source (2 dossiers) | ✅ fait (cf. §Audit ci-dessous) |
| Plan détaillé | ✅ fait |
| Manuscrit | ✅ **v1 livrée** — `docs/livre/ch17-evaluation-benchmarks.md` (≈ 10 700 mots, 17 encadrés, 16 schémas intégrés) |
| Schémas à créer | 0 v1 (R11 « playbook gruyère 8 étapes » traité par **réutilisation tel quel** de `evaluation-10-playbook-gruyere.svg` en page de section §17.14 + récap ; R12 « 4 vecteurs contamination » traité par **réutilisation tel quel** de `benchmarks-02-vecteurs-contamination.svg` en §17.9. Le 2×2 contrôlé × ponctuel d'annexe (cf. outline annexe A) est couvert par `benchmarks-06-framework-decision.svg`.) |
| Frontière Ch.17 ↔ Ch.18 | ✅ respectée — Ch.17 garde les graders, juges, simulation, playbook ; Ch.18 dédié à OTel GenAI semconv, cognitive audit trail, vendor landscape obs. Le schéma `evaluation-07-observabilite-rca.svg` est **réassigné Ch.18** depuis le dossier `evaluation-agentique`. |
| Frontière Ch.17 ↔ Ch.19 | ✅ respectée — Ch.17 traite l'éval (qualité, biais, contamination) ; Ch.19 traite la sécurité (OWASP ASI, jailbreaking, threat model E4 unifié). Pas de redite. |
| Frontière Ch.17 ↔ Ch.21 | ✅ respectée — Ch.17 mentionne le token cost trap et CNA/CPS pour la cohérence intra-chapitre, mais le déroulé ROI complet (frameworks Cigref/McKinsey/BCG/MIT NANDA/Forrester TEI, J-curve, Klarna) reste Ch.21. |
| Renvois inter-chapitres | ✅ Ch. 7 (boucle / harness produit la trajectoire évaluée), Ch. 9 (mémoire — benchmarks MemoryCD/Mem2ActBench/Letta), Ch. 10 (compaction — token cost trap renvoyé), Ch. 18 (OTel GenAI semconv comme matériau d'éval continue), Ch. 19 (threat model), Ch. 21 (ROI / paradoxe agentique). |

### Sources matérielles

Le Ch.17 est une **charnière à 2 dossiers** — la dyade structurante évaluation × benchmarks contestés. La discipline éditoriale est forte : le dossier `evaluation-agentique/` construit le playbook (gruyère 8 étapes, taxonomie graders, LLM-as-judge calibré, τ-bench), le dossier `benchmarks-contestes/` démolit la lecture des leaderboards publics (4 vecteurs de fuite, benchmark teams, contre-mouvement vivant). Lus ensemble = grille d'achat complète.

- **Dossier principal #1 — [`evaluation-agentique/`](../evaluation-agentique/)** (1ᵉʳ mai 2026, étude #08) — le playbook complet : trois ruptures (F1 → BLEU → trajectoire), vocabulaire task/trial/grader/transcript/outcome, taxonomie 3 familles de graders, pass@k vs pass^k, grille CLEAR à 5 dimensions, LLM-as-judge (4 modes × 5 biais × 5 correctifs), TestCase = (Persona × Quest × Environment) → Outcome, τ-bench et τ²-bench dual-control, observabilité OTel (renvoyé Ch.18), frameworks 4 quadrants, coûts à 6 postes, playbook gruyère 8 étapes (R11 — schéma signature de l'Acte IV).
  - [Rapport (.md, ~14 000 mots)](../evaluation-agentique/20260501-evaluation-agentique-rapport.md) · [App interactive](../evaluation-agentique/20260501-evaluation-agentique-app.html) · [Canvas](../evaluation-agentique/20260501-evaluation-agentique-rapport.md)
  - 11 schémas SVG dans [`images/`](../evaluation-agentique/images/) (10 narratifs + 1 `exec-sum-a4` annexe)
- **Dossier principal #2 — [`benchmarks-contestes/`](../benchmarks-contestes/)** (15 mai 2026, étude #19) — l'anti-playbook : écart 78 % → 26 %, anatomie SWE-bench 4 étapes, 4 vecteurs de fuite croisés en 2×2 (R12), trajectoire 2024-2026 GAIA/OSWorld/τ-bench/SWE-bench Verified, anatomie d'une benchmark team (5 leviers cumulés multiplicatif +15-25 pts), contre-mouvement vivant (SWE-bench Live / SWE-Lancer / CORE-Bench / MLE-bench / ARC-AGI 2), framework décision 2×2 contrôlé × ponctuel pour acheteurs.
  - [Rapport (.md, ~6 000 mots)](../benchmarks-contestes/20260515-benchmarks-contestes-rapport.md) · [App interactive](../benchmarks-contestes/20260515-benchmarks-contestes-app.html)
  - 6 schémas SVG dans [`images/`](../benchmarks-contestes/images/)

### Audit des schémas — Ch.17

Au total, **17 schémas SVG** dans les 2 dossiers source. Classement S (au fil du texte Ch.17) / R (récap chapitre) / Ch.X (réassigné) / écarté.

#### Schémas du dossier `evaluation-agentique/` (11)

| Fig | Slug | Catégorie Ch.17 | Statut |
| --- | --- | --- | --- |
| 00 | `exec-sum-a4` | écarté (livre) | annexe rapport |
| 01 | `evolution-paradigmes` | **S §17.2** | tel quel — pose les trois ruptures F1 → BLEU → trajectoire |
| 02 | `anatomie-evaluation` | **S §17.3.1** | tel quel — task / trial / grader / transcript / outcome |
| 03 | `taxonomie-graders` | **S §17.3.2** | tel quel — trois familles code / model / human |
| 04 | `pyramide-metriques` | **S §17.5** | tel quel — RAG → agent → CLEAR enterprise |
| 05 | `llm-as-judge` | **S §17.6** | tel quel — 4 modes × 5 biais × 5 correctifs |
| 06 | `user-simulation` | **S §17.7.2** | tel quel — τ-bench single-control → τ²-bench dual-control → multi-agent persona |
| 06bis | `testcase-formula` | **S §17.7.1** | tel quel — grammaire opérationnelle (Persona × Quest × Environment) |
| 07 | `observabilite-rca` | **Ch.18** (observabilité) | réassigné Ch.18 — OTel GenAI + cognitive audit trail + RCA (AgentRx, AgentTrace, AgentDebug). Frontière Ch.17/Ch.18 respectée. |
| 08 | `frameworks-matrice` | **S §17.17** | tel quel — cartographie 4 quadrants (offline/online × OSS/SaaS) |
| 09 | `couts-goulots` | **S §17.16** | tel quel — 6 postes de coût + 7 goulots organisationnels |
| 10 | `playbook-gruyere` | **R11 §17.14 + récap §Récap** | tel quel — **schéma signature de l'Acte IV**, utilisé **2×** (§17.14 + récap). Tient lieu de R11 v1. |

**Bilan dossier 1** : 10/10 schémas narratifs absorbés (07 réassigné Ch.18 par discipline éditoriale, pas écarté). Taux d'absorption maximal.

#### Schémas du dossier `benchmarks-contestes/` (6)

| Fig | Slug | Catégorie Ch.17 | Statut |
| --- | --- | --- | --- |
| 01 | `anatomie-swe-bench` | **S §17.8.2** | tel quel — pipeline 4 étages SWE-bench |
| 02 | `vecteurs-contamination` | **R12 §17.9** | tel quel — **schéma signature démolition**, 4 vecteurs croisés en 2×2 (explicite/implicite × données/protocole). Tient lieu de R12 v1. |
| 03 | `trajectoire-scores` | **S §17.10** | tel quel — trajectoires SWE-bench Verified / GAIA / OSWorld / τ-bench 2024-2026 |
| 04 | `chaine-optimisation` | **S §17.11** | tel quel — 5 leviers cumulés d'une benchmark team |
| 05 | `benchmarks-vivants` | **S §17.12** | tel quel — comparatif SWE-bench Live / SWE-Lancer / CORE-Bench / MLE-bench / ARC-AGI 2 |
| 06 | `framework-decision` | **S §17.13** | tel quel — 2×2 contrôlé × ponctuel × écologique × longitudinal |

**Bilan dossier 2** : 6/6 schémas absorbés. Taux d'absorption maximal.

**Bilan global audit Ch.17** : **16/17 schémas narratifs absorbés** (1 réassigné Ch.18 par discipline éditoriale). 0 schéma écarté pour redondance, 0 schéma à fixer. Audit aussi propre que Ch.9 (8/8) et Ch.11 (8/8 + 6 réassignés) — signe que les deux dossiers source étaient structurés dès l'origine comme une dyade complémentaire sans redondance.

### Redondances et complémentarités entre les 2 dossiers

**0 redondance vraie entre `evaluation-agentique` et `benchmarks-contestes`**. Les deux dossiers sont **strictement complémentaires** — c'est exactement la thèse du chapitre. Le premier construit, le second démolit, et lus ensemble forment la grille d'achat complète.

| Sujet | `evaluation-agentique` | `benchmarks-contestes` | Décision Ch.17 |
| --- | --- | --- | --- |
| Méthodologie d'éval | Playbook gruyère 8 étapes (§17.14), taxonomie graders, LLM-as-judge calibré, simulation utilisateur | non couvert | Reste §17.2-§17.7, §17.14-§17.17 |
| Critique des benchmarks publics | Mentionne « 50× variation de coût », CORE-Bench bug 42 %→95 % | Démolition systémique : 4 vecteurs, benchmark teams, contre-mouvement | Reste §17.8-§17.13. Le passage entre les deux mouvements (§17.8) cite l'écart 78 %/26 % comme pivot narratif. |
| τ-bench et τ²-bench | Cas méthodologique (§17.7.2) | Cas de contamination (§17.10) | **Deux angles distincts** sur le même benchmark. §17.7.2 traite le simulateur comme outil ; §17.10 traite la baisse v1→v2 comme signal de contamination. Pas de doublon. |
| SWE-bench | Mention rapide CORE-Bench bug | Analyse complète anatomie + 4 vecteurs | Reste §17.8-§17.11. La dyade est l'objet du chapitre. |

**3 frontières inter-chapitres à tenir strictement** :

| Sujet | Couvert où ? | Décision Ch.17 |
| --- | --- | --- |
| **OTel GenAI Semantic Conventions** | Mentionné en §17.7.2 simulation et §17.17 frameworks comme fondation ; déroulé complet (6 piliers + cognitive audit trail + WG `gen_ai.memory.*` / `gen_ai.compaction.*`) en Ch.18 | Ch.17 traite la convergence comme contexte ; le schéma `evaluation-07-observabilite-rca.svg` est réassigné Ch.18. Renvoi `[!INFO] Voir Ch. 18` en §17.17. |
| **OWASP ASI Top 10 + jailbreaking** | Mentionné en §17.3.2 grader safety-critique ; déroulé Ch.19 (threat model E4 unifié) | Ch.17 ne reprend ni la matrice OWASP ASI ni l'asymétrie attaque/défense. Pas de renvoi explicite (Ch.19 viendra ré-encrer la sécurité comme verticale). |
| **Token cost trap + ROI** | Mentionné en §17.16.2 comme illustration de la rupture POC→prod ; déroulé Ch.21 (5 frameworks Cigref/McKinsey/BCG/MIT NANDA/Forrester TEI, J-curve Brynjolfsson, paradoxe agentique, Klarna) | Ch.17 cite l'exemple Klaus Hofenbitzer (0,14 $ → 130 000 $/mois) comme illustration intra-chapitre. Pas de doublon, deux profondeurs. |

**Cohérence avec la frontière posée par Ch.9 §9.7 (surface d'attaque mémoire) et Ch.10 §10.7 (cycle d'attaque compaction)** : le Ch.17 ne traite ni la verticale mémoire ni la compaction sous l'angle threat model — il traite la **mesure** de la qualité d'un agent, dont la sécurité est une des dimensions (CLEAR pillar "Assurance", grader safety-critique). Pas de réinjection. Le threat model unifié reste E4 / Ch.19.

**1 absence notable, non bloquante** : pas de **schéma A4 récap dédié au framework 2×2 contrôlé × ponctuel**. L'outline (annexe A.2) listait ce 2×2 comme « grille d'achat » à recadrer en annexe consultative. **Décision v1** : couvert par `benchmarks-06-framework-decision.svg` (réutilisé tel quel en §17.13). Si l'édition print réclame un récap dédié pleine page, l'élément existe déjà et son coût d'intégration est nul.

### Plan détaillé du chapitre

```
> [!QUESTION] Question d'ouverture
  78,2 % SWE-bench Verified (Anthropic, 14 mai 2026) vs 26 % terrain
  (banque européenne, même jour). Trois fois moins. Qu'est-ce qu'on mesure ?

> [!TLDR] TL;DR décideur (8 bullets)

§17.1   Pourquoi un seul chapitre éval ET benchmarks
        ├─ §17.1.1 La place du chapitre dans l'Acte IV
        ├─ §17.1.2 Le double mouvement — construire et démolir
        └─ encadré [!INFO] Voir Ch. 7, 18, 21

§17.2   Trois ruptures qui ont rendu obsolètes les métriques classiques
        ├─ [SVG S] evaluation-01-evolution-paradigmes.svg
        ├─ §17.2.1 IA classique — F1, précision, rappel
        ├─ §17.2.2 IA générative — la déroute des n-grammes
        └─ §17.2.3 IA agentique — la trajectoire comme objet
            └─ encadré [!QUOTE] Anthropic — outcome ≠ transcript

§17.3   Anatomie d'une éval agentique
        ├─ §17.3.1 Vocabulaire (7 termes)
        │   └─ [SVG S] evaluation-02-anatomie-evaluation.svg
        ├─ §17.3.2 Trois familles de graders (code / model / human)
        │   └─ [SVG S] evaluation-03-taxonomie-graders.svg
        └─ §17.3.3 Capability evals vs régression evals
            └─ encadré [!IMPORTANT] La graduation des evals

§17.4   Pass@k vs pass^k — le non-déterminisme comme attribut produit
        └─ encadré [!ATTENTION] Le choix de métrique est un choix produit

§17.5   La grille CLEAR — cinq dimensions pour l'enterprise
        ├─ [SVG S] evaluation-04-pyramide-metriques.svg
        └─ CNA (Cost-Normalized Accuracy) + CPS (Cost Per Success)

§17.6   LLM-as-a-judge — modes, biais, calibration
        ├─ [SVG S] evaluation-05-llm-as-judge.svg
        ├─ §17.6.1 Quatre modes opératoires (pointwise/reference-based/pairwise/listwise)
        ├─ §17.6.2 Cinq biais systématiques (position/verbosity/self-enhancement/authority/format)
        ├─ §17.6.3 Pipeline correctif en 5 couches
        │   └─ encadré [!EXAMPLE] Rubrique discrète + reasoning-first + porte de sortie
        ├─ §17.6.4 Quand NE PAS utiliser un juge LLM (4 cas)
        └─ §17.6.5 SLM-judges spécialisés (Galileo Luna-2, Pearson > 0,85)

§17.7   Simulation utilisateur — TestCase = (Persona × Quest × Environment) → Outcome
        ├─ §17.7.1 La grammaire opérationnelle
        │   └─ [SVG S] evaluation-06bis-testcase-formula.svg
        ├─ §17.7.2 τ-bench et τ²-bench (dual-control)
        │   └─ [SVG S] evaluation-06-user-simulation.svg
        └─ §17.7.3 Le Sim2Real gap — qualité du simulateur

──────────────────────────────────────────────────────────────────
                       BASCULEMENT NARRATIF
──────────────────────────────────────────────────────────────────

§17.8   LE BASCULEMENT — pourquoi les benchmarks publics ne tiennent plus
        ├─ §17.8.1 L'écart qui s'élargit (78 % vs 26 %)
        │   └─ encadré [!QUOTE] L'écart entre les deux courbes
        └─ §17.8.2 Anatomie de SWE-bench (4 étages)
            └─ [SVG S] benchmarks-01-anatomie-swe-bench.svg

§17.9   Les quatre vecteurs de fuite (R12 — schéma signature démolition)
        ├─ [SVG R12] benchmarks-02-vecteurs-contamination.svg
        ├─ §17.9.1 Chevauchement temporel (vecteur i, 8-15 pts)
        ├─ §17.9.2 Fuite par version-tag (vecteur ii, ~18 %)
        ├─ §17.9.3 Gaming du harnais (vecteur iii, +5 à +10 pts)
        ├─ §17.9.4 Leakage de prompt (vecteur iv)
        └─ encadré [!WARNING] Aucun n'est résolu par "Verified"

§17.10  GAIA, OSWorld, τ-bench — même pathologie, déclinée
        └─ [SVG S] benchmarks-03-trajectoire-scores.svg

§17.11  Le score est un produit — anatomie d'une "benchmark team"
        ├─ [SVG S] benchmarks-04-chaine-optimisation.svg
        ├─ 5 leviers cumulés (checkpoint / harness / prompt / RL / retries)
        └─ encadré [!IMPORTANT] Le contre-exemple ARC-AGI (private eval, compute capé)

§17.12  Le contre-mouvement — benchmarks vivants
        ├─ [SVG S] benchmarks-05-benchmarks-vivants.svg
        └─ SWE-bench Live / SWE-Lancer / CORE-Bench / MLE-bench / ARC-AGI 2

§17.13  Mesurer pour quoi faire — framework 2×2 contrôlé × ponctuel
        ├─ [SVG S] benchmarks-06-framework-decision.svg
        ├─ Chercheur / acheteur / régulateur / journaliste
        └─ encadré [!IMPORTANT] L'éval interne datée bat tous les scores publics

──────────────────────────────────────────────────────────────────
                       RETOUR CONSTRUCTION
──────────────────────────────────────────────────────────────────

§17.14  Le playbook gruyère en 8 étapes (R11 — schéma signature Acte IV)
        ├─ [SVG R11] evaluation-10-playbook-gruyere.svg
        ├─ §17.14.1 Démarrer tôt (20-50 tasks, règle 80/20)
        ├─ §17.14.2 Partir du manuel (bug → test case)
        ├─ §17.14.3 Tasks unambiguës avec ref solutions (test-or test, 0 % pass@100 = task cassée)
        ├─ §17.14.4 Problem sets équilibrés (class balance)
        ├─ §17.14.5 Eval harness robuste (isolation par trial)
        ├─ §17.14.6 Graders thoughtfully designés (déterministe d'abord, partial credit, porte de sortie "Unknown")
        ├─ §17.14.7 Lire les transcripts (cas Opus 4.5 CORE-Bench 42 % → 95 %)
        ├─ §17.14.8 Monitorer la saturation (graduation capability → régression)
        └─ §17.14.9 Ownership et contribution (evals = unit tests)

§17.15  Le modèle gruyère — combiner les couches
        ├─ tableau 6 méthodes (auto / monitoring / A/B / feedback / review / studies)
        └─ encadré [!QUOTE] Anthropic — frameworks valent ce que valent les eval tasks

§17.16  Coûts et goulots de l'éval mature
        ├─ [SVG S] evaluation-09-couts-goulots.svg
        ├─ §17.16.1 6 postes de coût (modèle / juges / synthétique / humain / infra / maintenance)
        ├─ §17.16.2 Token cost trap (0,14 $ → 130 000 $/mois)
        └─ §17.16.3 Les vrais goulots ne sont pas techniques (qualité tasks, calibration, lecture transcripts, ownership)

§17.17  Frameworks et outils — cartographie 4 quadrants
        ├─ [SVG S] evaluation-08-frameworks-matrice.svg
        ├─ Quadrant offline × OSS (Promptfoo, DeepEval, Ragas, OpenAI Evals, MLflow)
        ├─ Quadrant offline × SaaS (Braintrust, LangSmith, Galileo, Maxim, Vals.ai)
        ├─ Quadrant online × OSS (Langfuse, Arize Phoenix, Agenta)
        ├─ Quadrant online × SaaS (Microsoft Foundry, AWS Strands, Datadog, AgentEvals)
        ├─ Le rôle des graders SDK fondeurs (OpenAI, Anthropic, Google ADK, AWS Strands, Microsoft Foundry)
        ├─ Étude Arena CAIS 2026 (modèle/prompt > framework)
        └─ encadré [!INFO] Voir Ch. 18 — OTel GenAI

Récap chapitre — Construire et démolir simultanément
        ├─ [SVG R11] evaluation-10-playbook-gruyere.svg (réutilisé en récap)
        └─ 3 investissements à fort ROI (golden suite 50 tasks / OTel natif / persona-based)

> [!WARNING] Trois pièges classiques (100 % traçables)
  RFP au score SWE-bench · score brut sans inspection des transcripts ·
  juge LLM unique non calibré

Sources (32 footnotes : 2 dossiers + Anthropic engineering + Sierra Research +
        OpenAI + Microsoft Foundry + Google ADK + AWS + ARC Prize +
        Princeton + papers arXiv 2023-2026 + Galileo + Hofenbitzer Medium)
```

### Encadrés prévus dans le chapitre

Variété des `> [!TYPE]` Obsidian retenus :

| Type | Usage | Compte |
| --- | --- | --- |
| `[!QUESTION]` | Ouverture chapitre | 1 |
| `[!TLDR]` | Synthèse décideur 8 bullets | 1 |
| `[!INFO]` | Renvois inter-chapitres (Ch.7, 18, 21) | 2 |
| `[!QUOTE]` | Anthropic outcome≠transcript + L'écart entre les deux courbes + Anthropic frameworks ne valent que ce que valent les eval tasks | 3 |
| `[!IMPORTANT]` | Graduation evals + Contre-exemple ARC-AGI + L'éval interne datée bat tout | 3 |
| `[!ATTENTION]` | Pass@k vs pass^k = choix produit | 1 |
| `[!EXAMPLE]` | Rubrique discrète + reasoning-first + porte de sortie | 1 |
| `[!WARNING]` | Aucun vecteur n'est résolu par "Verified" + Trois pièges classiques clôture | 2 |
| **Total** | | **14** |

### Tâches restantes Ch.17

- [x] Rédiger le manuscrit `docs/livre/ch17-evaluation-benchmarks.md` (~10 700 mots)
- [x] Audit des 17 schémas SVG des 2 dossiers source (16 absorbés + 1 réassigné Ch.18)
- [ ] Relecture Mathieu — passes critiques suggérées :
  - **(a) Le basculement narratif §17.8** : le chapitre charnière repose sur la bascule construction → démolition autour de l'écart 78 %/26 %. Vérifier que la transition est lisible et que le double mouvement TLDR (8 bullets) reste fidèle au mouvement effectif du manuscrit.
  - **(b) La frontière Ch.17 ↔ Ch.18** : §17.7.2, §17.17 mentionnent OTel GenAI comme fondation ; le déroulé 6 piliers + cognitive audit trail reste Ch.18. Vérifier qu'aucun bout d'observabilité ne fuite (notamment §17.16 coûts qui pourrait empiéter sur le monitoring production).
  - **(c) La frontière Ch.17 ↔ Ch.21** : §17.16.2 cite le token cost trap (Klaus Hofenbitzer, 0,14 $ → 130 000 $/mois) en illustration. Vérifier que le chapitre ROI (Ch.21) ne refera pas cette illustration sous le même angle.
  - **(d) Le récap §Récap** : décision de réutiliser `playbook-gruyere.svg` (R11) comme schéma de récap, plutôt que de placer côte-à-côte le playbook + les 4 vecteurs (R12) en double page A3 facing. L'outline (annexe A.2) le listait comme `playbook gruyère 8 étapes / matrice 4 vecteurs en page facing`. Si l'édition print réclame le facing A3, le coût est nul (les deux schémas existent déjà tels quels).
  - **(e) Le single-responsibility principle des juges §17.7.1** : c'est un angle original repris du dossier `evaluation-agentique` §6.0 (formule TestCase). Vérifier que la grammaire opérationnelle est restituée fidèlement et que le décideur peut s'en servir comme grille.
  - **(f) Le contre-exemple ARC-AGI §17.11** : encadré [!IMPORTANT] qui sert de boussole méthodologique. Vérifier qu'il ne survend pas ARC (la barre humaine reste à 85 %, les modèles autour de 55 % début 2026).
- [ ] Si validation : copier-coller la matière vers le futur format de sortie (print HTML / PDF) quand décidé

---

## Chapitre 9 — Mémoire agentique : quatre piliers, six opérations, cinq architectures

> **Acte II — La boucle · Gabarit standard 16-24 p · ~6 200 mots**
> **Lecteur cible** : agent engineer, tech lead, architecte, DPO, RSSI.
> **Sortie lecteur** : maîtrise la grille canonique CoALA (4 piliers travail/sémantique/épisodique/procédurale × 6 opérations) ; sait quand choisir Letta vs Mem0 vs Zep vs file-based Anthropic vs Generative Agents ; comprend le rôle pivot du context engineering (Karpathy, Martin Write/Select/Compress/Isolate) ; distingue la mémoire opérationnelle (effacement RGPD techniquement faisable aujourd'hui) de la mémoire paramétrique (machine unlearning émergent) ; reconnaît le pattern d'attaque MITRE ATLAS AML.T0080 et sait l'instrumenter à 4 niveaux (infra / modèle / utilisateur / org) ; peut dérouler la feuille de route 6/12/18 mois pour son organisation.

### Statut

| Étape | Statut |
| --- | --- |
| Audit schémas source (1 dossier) | ✅ fait (cf. §Audit ci-dessous) |
| Plan détaillé | ✅ fait |
| Manuscrit | ✅ **v1 livrée** — `docs/livre/ch09-memoire-agentique.md` (≈ 6 200 mots, 13 encadrés, 8 schémas intégrés) |
| Schémas à créer | 0 v1 (R2 « 4 piliers × 6 opérations × 5 architectures » traité par **réutilisation tel quel** de `taxonomie-piliers.svg` en récap ; matrice prod 5 architectures déjà rendue par tableau markdown § 9.4. La fusion R2 « grille 4 piliers × 5 archi × 6 op » de l'outline annexe A.2 n'est pas livrée v1 — si édition print l'exige, fusion `taxonomie-piliers` + `frameworks-matrice` + `cycle-de-vie` en un seul triptyque, coût ~3-4 j SVG) |
| Renvois inter-chapitres | ✅ Ch. 7 (boucle / 7 couches harness, couche mémoire = n°5), Ch. 10 (compaction = sous-pilier travail / scratchpad), Ch. 18 (observabilité, futurs attributs `gen_ai.memory.*` WG GenAI), Ch. 19 (threat model E4 — verticale mémoire), Ch. 23 (gouvernance RGPD/AI Act, machine unlearning) |

### Sources matérielles

Le Ch.9 est un **chapitre standard à un seul dossier source** — c'est l'absorption la plus propre du livre : un dossier → un chapitre, audit linéaire des 8 schémas, 100 % des schémas non-annexe absorbés.

- **Dossier principal — [`memoire-agentique/`](../memoire-agentique/)** (30 avril 2026, étude #07) — la cartographie complète : déficit d'apprentissage (MIT NANDA + Gartner + reasoning-in-haystack), 4 piliers CoALA, 6 opérations du cycle de vie, 5 architectures de production (MemGPT/Letta, Generative Agents, A-MEM, Zep/Graphiti, Mem0), context engineering (Karpathy + Martin), paysage OpenAI/Anthropic/Google, surface d'attaque (SpAIware, MITRE ATLAS AML.T0080), feuille de route 18 mois.
  - [Rapport (.md, ~10 000 mots)](../memoire-agentique/20260430-memoire-agentique-rapport.md) · [App interactive](../memoire-agentique/20260430-memoire-agentique-app.html)
  - 8 schémas SVG dans [`images/`](../memoire-agentique/images/) (hors `exec-sum-a4` réservé annexe)

### Audit des schémas — Ch.9

Au total, **9 schémas SVG** dans le dossier source (1 `exec-sum-a4` + 8 schémas narratifs). Classement S (au fil du texte Ch.9) / R (récap chapitre) / écarté.

| Fig | Slug | Aperçu | Catégorie Ch.9 | Statut |
| --- | --- | --- | --- | --- |
| 00 | [`exec-sum-a4`](../memoire-agentique/images/20260430-00-exec-sum-a4.svg) | A4 portrait synthèse | écarté (livre) | annexe rapport |
| 01 | [`cadrage-strategique`](../memoire-agentique/images/20260430-01-cadrage-strategique.svg) | ![](../memoire-agentique/images/20260430-01-cadrage-strategique.svg) | **S §9.1.2** | tel quel — pose le diagnostic chiffré MIT NANDA + Gartner + reasoning-in-haystack |
| 02 | [`taxonomie-piliers`](../memoire-agentique/images/20260430-02-taxonomie-piliers.svg) | ![](../memoire-agentique/images/20260430-02-taxonomie-piliers.svg) | **S §9.2 + Récap §9** | tel quel — schéma signature du chapitre, utilisé **2×** (S §9.2 + récap). Tient lieu de R2 v1. |
| 03 | [`cycle-de-vie`](../memoire-agentique/images/20260430-03-cycle-de-vie.svg) | ![](../memoire-agentique/images/20260430-03-cycle-de-vie.svg) | **S §9.3** | tel quel — 6 opérations (récupération, consolidation, mise à jour, indexation, compression, oubli) |
| 04 | [`frameworks-matrice`](../memoire-agentique/images/20260430-04-frameworks-matrice.svg) | ![](../memoire-agentique/images/20260430-04-frameworks-matrice.svg) | **S §9.4** | tel quel — matrice 5 frameworks ; complété par tableau markdown récap (force/limite) en bas de §9.4 |
| 05 | [`context-engineering`](../memoire-agentique/images/20260430-05-context-engineering.svg) | ![](../memoire-agentique/images/20260430-05-context-engineering.svg) | **S §9.5** | tel quel — grille Lance Martin Write/Select/Compress/Isolate |
| 06 | [`vendors-comparison`](../memoire-agentique/images/20260430-06-vendors-comparison.svg) | ![](../memoire-agentique/images/20260430-06-vendors-comparison.svg) | **S §9.6** | tel quel — OpenAI/Anthropic/Google ; complété par tableau markdown des 5 dimensions |
| 07 | [`surface-attaque`](../memoire-agentique/images/20260430-07-surface-attaque.svg) | ![](../memoire-agentique/images/20260430-07-surface-attaque.svg) | **S §9.7.1** | tel quel — cycle 5 étapes + cas SpAIware/Delayed Tool/ShadowLeak + 4 couches mitigation. Source clé pour le futur E4 du Ch.19. |
| 08 | [`roadmap`](../memoire-agentique/images/20260430-08-roadmap.svg) | ![](../memoire-agentique/images/20260430-08-roadmap.svg) | **S §9.8** | tel quel — 3 horizons × 3 pistes (architecture / gouvernance / adoption) |

**Bilan audit Ch.9** : 8/8 schémas narratifs absorbés (taux d'absorption maximal avec Ch.11). 0 schéma écarté pour redondance, 0 schéma à fixer, 0 schéma réassigné à un autre chapitre. C'est l'audit le plus propre du livre — signe que le dossier source était structuré dès l'origine comme un seul chapitre, sans dispersion.

### Redondances et complémentarités avec les chapitres voisins

**0 redondance vraie dans Ch.9 lui-même** (chapitre à un seul dossier). **3 frontières inter-chapitres à tenir strictement** :

| Sujet | Couvert où ? | Décision Ch.9 |
| --- | --- | --- |
| **Mémoire de travail / scratchpad → compaction** | Posée en Ch.9 §9.2.1 comme pilier ; approfondie en Ch.10 (compaction = première politique d'éviction active de ce pilier) | Définition canonique du pilier = §9.2.1 (4 lignes) ; la mécanique compaction (5 familles, triangle non-dégénéré) reste au Ch.10. Renvoi `[!INFO] Voir Ch. 10`. |
| **Surface d'attaque mémoire** | Posée en Ch.9 §9.7 comme verticale ; agrégée en Ch.19 dans le threat model E4 unifié 2026 (modèle / prompt / mémoire / outil / protocole / surface) | Ch.9 décrit le cycle d'attaque mémoire + 4 couches de mitigation. Le Ch.19 ré-agrège avec les 5 autres verticales. Pas de doublon, deux profondeurs. |
| **RGPD art. 17 + machine unlearning** | Effleuré en Ch.9 §9.7.3 (deux régimes opérationnel/paramétrique) ; déroulé en Ch.23 (calendrier 2026-2027, sous-puits unlearning, rôle DPO/RSSI/Sponsor) | Ch.9 pose la distinction des deux régimes (3-4 phrases). Le détail réglementaire reste Ch.23. Renvoi `[!INFO] Voir Ch. 23`. |

**Cohérence avec la frontière posée par Ch.10** (`docs/livre/ch10-compaction.md` §10.1) : le Ch.10 ouvre par *« Le chapitre précédent a posé la grille des quatre piliers de la mémoire agentique… »*. Le Ch.9 §9.2 pose effectivement cette grille (4 piliers CoALA). Le Ch.10 §10.1 renvoie vers *« Ch. 9 §3-§5 »* pour les piliers long-terme et architectures de production — dans le numérotage Ch.9 livré (§9.3 = 6 opérations, §9.4 = 5 architectures, §9.5 = context engineering), la correspondance fonctionne. Aucune édition rétro-active du Ch.10 nécessaire.

**1 absence notable, non bloquante** : pas de **schéma fusionné R2** (matrice 4 piliers × 6 opérations × 5 architectures en un seul triptyque). L'outline (annexe A.2) le liste comme « fusion de la grille existante + matrice prod ». **Décision v1** : couvert par 3 schémas distincts (taxonomie-piliers en §9.2, cycle-de-vie en §9.3, frameworks-matrice en §9.4) + tableau markdown récap des 5 architectures (force/limite) en bas de §9.4. Le récap chapitre réutilise `taxonomie-piliers.svg` (le pilier conceptuel qui ancre tout le reste). Si l'édition print réclame un récap fusionné dédié, le coût est ~3-4 jours SVG.

### Plan détaillé du chapitre

```
> [!QUESTION] Question d'ouverture
  95 % d'échec MIT NANDA, 40 % d'abandons Gartner — pour un même learning gap.
  Pourquoi empiler du contexte au lieu d'investir dans une mémoire gouvernée ?

> [!TLDR] TL;DR décideur (6 bullets)

§9.1   Le déficit d'apprentissage : pourquoi la mémoire est devenue le goulot
       ├─ §9.1.1 La place de ce chapitre dans l'Acte II
       ├─ §9.1.2 L'amnésie comme signature opérationnelle
       │   └─ [SVG S] cadrage-strategique.svg
       ├─ §9.1.3 Le contexte long ne résout pas le problème (Shang et al.)
       └─ encadré [!INFO] Voir Ch. 7 (7 couches harness)

§9.2   Quatre piliers : la grille canonique CoALA
       ├─ [SVG S] taxonomie-piliers.svg
       ├─ §9.2.1 Mémoire de travail
       ├─ §9.2.2 Mémoire sémantique
       ├─ §9.2.3 Mémoire épisodique
       ├─ §9.2.4 Mémoire procédurale
       └─ encadré [!NOTE] La grille n'est pas un découpage physique

§9.3   Six opérations du cycle de vie
       ├─ [SVG S] cycle-de-vie.svg
       ├─ §9.3.1 Récupération
       ├─ §9.3.2 Consolidation
       ├─ §9.3.3 Mise à jour
       ├─ §9.3.4 Indexation
       ├─ §9.3.5 Compression (renvoi Ch.10)
       ├─ §9.3.6 Oubli
       └─ encadré [!IMPORTANT] Triage cognitif (IMA)

§9.4   Cinq architectures de référence
       ├─ [SVG S] frameworks-matrice.svg
       ├─ §9.4.1 MemGPT/Letta — OS-like
       ├─ §9.4.2 Generative Agents — memory stream + reflection
       ├─ §9.4.3 A-MEM — Zettelkasten
       ├─ §9.4.4 Zep/Graphiti — knowledge graph temporel
       ├─ §9.4.5 Mem0 — production
       ├─ encadré [!ATTENTION] Aucune dominante en 2026
       └─ tableau markdown force/limite des 5 architectures

§9.5   Le context engineering : la discipline d'orchestration (Karpathy/Martin)
       ├─ [SVG S] context-engineering.svg
       ├─ §9.5.1 Write
       ├─ §9.5.2 Select
       ├─ §9.5.3 Compress (renvoi Ch.10)
       ├─ §9.5.4 Isolate
       └─ encadré [!QUOTE] Karpathy — la bascule modèle ↔ contexte

§9.6   Paysage fournisseurs : trois philosophies
       ├─ [SVG S] vendors-comparison.svg
       ├─ §9.6.1 OpenAI ChatGPT — `bio` + Chat History Reference
       ├─ §9.6.2 Anthropic Claude — file-based hiérarchique + Memory Tool
       ├─ §9.6.3 Google Gemini — Personal Context + 2 M tokens
       └─ tableau markdown comparatif 5 dimensions

§9.7   Surface d'attaque : memory poisoning et MITRE ATLAS AML.T0080
       ├─ [SVG S] surface-attaque.svg
       ├─ §9.7.1 SpAIware, Delayed Tool, ShadowLeak (Rehberger)
       │   └─ encadré [!WARNING] Cycle d'attaque en 5 étapes
       ├─ §9.7.2 Mitigations à 4 niveaux
       │   └─ encadré [!INFO] Voir Ch. 19 (threat model E4)
       └─ §9.7.3 RGPD, AI Act et le machine unlearning
           ├─ encadré [!IMPORTANT] Gouvernance tactique en 3 actions
           └─ encadré [!INFO] Voir Ch. 23 (gouvernance)

§9.8   Feuille de route 6/12/18 mois
       ├─ [SVG S] roadmap.svg
       ├─ §9.8.1 0–6 mois : auditer, prototyper, gouverner
       ├─ §9.8.2 6–12 mois : industrialiser, mesurer
       ├─ §9.8.3 12–18 mois : autonomiser, partenariser
       └─ encadré [!INFO] Voir Ch. 18 (observabilité, `gen_ai.memory.*`)

Récap chapitre — La grille des quatre piliers
       └─ [SVG R2] taxonomie-piliers.svg (réutilisé en récap)

> [!WARNING] Trois pièges classiques (les trois sont 100 % traçables)
  Pas de dashboard mémoire · confondre long-contexte et mémoire structurée ·
  différer la conformité RGPD/AI Act sur la mémoire opérationnelle

Sources (28 footnotes : 1 dossier source + 27 références premium)
```

### Encadrés prévus dans le chapitre

Variété des `> [!TYPE]` Obsidian retenus :

| Type | Usage | Compte |
| --- | --- | --- |
| `[!QUESTION]` | Ouverture chapitre | 1 |
| `[!TLDR]` | Synthèse décideur 6 bullets | 1 |
| `[!INFO]` | Renvois inter-chapitres (Ch.7, 10, 18, 19, 23) | 5 |
| `[!NOTE]` | La grille n'est pas un découpage physique | 1 |
| `[!IMPORTANT]` | Triage cognitif IMA + Gouvernance tactique en 3 actions | 2 |
| `[!ATTENTION]` | Aucune dominante en 2026 | 1 |
| `[!QUOTE]` | Karpathy — la bascule modèle ↔ contexte | 1 |
| `[!WARNING]` | Cycle d'attaque 5 étapes + trois pièges classiques en clôture | 2 |
| **Total** | | **14** |

### Tâches restantes Ch.9

- [x] Rédiger le manuscrit `docs/livre/ch09-memoire-agentique.md` (~6 200 mots)
- [x] Audit des 9 schémas SVG du dossier source (8/8 narratifs absorbés)
- [ ] Relecture Mathieu — passes critiques suggérées :
  - **(a) La frontière Ch.9 ↔ Ch.10** : vérifier que §9.2.1 (mémoire de travail) reste bref et renvoie correctement vers Ch.10 pour la mécanique compaction ; que §9.3.5 (compression) ne refait pas la taxonomie des 5 familles. Statut v1 : 4 lignes pour §9.2.1, 3 lignes pour §9.3.5, renvois explicites.
  - **(b) La frontière Ch.9 ↔ Ch.19** : vérifier que §9.7 décrit la verticale mémoire sans empiéter sur la matrice E4 transverse (Ch.19). Statut v1 : §9.7 traite cycle d'attaque + 4 niveaux mitigation + RGPD ; renvoi unique `[!INFO]` vers Ch.19 pour le threat model agrégé.
  - **(c) La frontière Ch.9 ↔ Ch.23** : vérifier que §9.7.3 (RGPD/AI Act/unlearning) reste à 3-4 phrases + 1 encadré + renvoi vers Ch.23 pour le calendrier complet. Statut v1 : OK, §9.7.3 fait ~12 lignes total.
  - **(d) Le récap §Récap** : décider si la réutilisation de `taxonomie-piliers.svg` suffit, ou si on commande la fusion R2 (4 piliers × 6 op × 5 archi en un seul triptyque). Statut v1 : réutilisation tel quel, la grille des 4 piliers est ce qu'on veut graver dans la tête du lecteur.
  - **(e) Le triage cognitif (IMA) §9.3** : c'est un angle original IMA qui mérite vérification éditoriale (citation correcte du livre blanc, ne pas surcharger l'encadré).
- [ ] Si validation : copier-coller la matière vers le futur format de sortie (print HTML / PDF) quand décidé

---

## Chapitre 7 — Reason · Act · Observe : le harness et ce qu'il enveloppe

> **Acte II — La boucle · Gabarit charnière 28-40 p · ~9 800 mots**
> **Lecteur cible** : agent engineer, tech lead, architecte, acheteur AI.
> **Sortie lecteur** : comprend la grille à 7 couches d'un harness, sait pourquoi la boucle ReAct invariante porte trois noms (TAOR / Gather-Act-Verify / GAN 3 agents) selon le contexte, distingue tools / bash / codegen et leurs zones de pertinence, sait choisir entre Client SDK / Agent SDK / Claude Code / Managed Agents, peut calibrer un budget POC vs prod multi-agent, et a identifié les trois pièges 100 % traçables (loop infinie, exfil via tool non scopé, multi-agent prématuré).

### Statut

| Étape | Statut |
| --- | --- |
| Audit schémas source (4 dossiers) | ✅ fait (cf. §Audit ci-dessous) |
| Plan détaillé | ✅ fait |
| Manuscrit | ✅ **v1 livrée** — `docs/livre/ch07-boucle-agentique.md` (≈ 9 800 mots, 12 encadrés, 8 schémas intégrés) |
| Schémas à créer | 0 v1 (R1 « boucle ReAct + 3 variantes » traité par **superposition** des 4 schémas source ; à refaire en fusion lourde si édition print) |
| Renvois inter-chapitres | ✅ Ch. 1 (cœur stochastique), Ch. 9 (mémoire), Ch. 10 (compaction), Ch. 11 (orchestration multi-agent), Ch. 13 (MCP sécurité), Ch. 18 (observabilité), Ch. 19 (threat model E4), Ch. 20 (runtime managé), Ch. 21 (ROI) |

### Sources matérielles

Le Ch.7 est une **charnière à 4 dossiers** — c'est le chapitre qui dédouble la matière du corpus sur la « boucle agentique » avec la discipline éditoriale stricte d'une seule description canonique.

- **Dossier principal #1 — [`harness-agentique/`](../harness-agentique/)** (29 avr 2026, étude #04) — l'anatomie 7 couches + pattern GAN + cartographie 3 couches + observabilité 6 piliers + effort de dev. **C'est l'épine** du chapitre.
  - [Rapport (.md, ~7 500 mots)](../harness-agentique/20260429-harness-agentique-rapport.md) · [App interactive](../harness-agentique/20260429-harness-agentique-app.html)
  - 9 schémas SVG dans [`images/`](../harness-agentique/images/)
- **Dossier principal #2 — [`agent-sdk/`](../agent-sdk/)** (18 mai 2026) — Claude Code + Agent SDK, *bash is all you need*, Gather/Act/Verify, hooks, skills, sub-agents, gruyère sécurité, 3 voies de build.
  - [Rapport (.md, ~7 000 mots)](../agent-sdk/20260518-agent-sdk-rapport.md) · [App interactive](../agent-sdk/20260518-agent-sdk-app.html)
  - 11 schémas SVG dans [`images/`](../agent-sdk/images/) (dont 3 `ref-*` qui pointent déjà vers harness/coding-agents)
- **Dossier principal #3 — [`coding-agents/`](../coding-agents/)** (12 mai 2026, outils #17) — instanciation Claude Code/Codex/Copilot + **pyramide d'usage 4 étages** + gains/coûts/risques + carte de décision par profil.
  - [Rapport (.md, ~12 000 mots)](../coding-agents/20260512-coding-agents-rapport.md) · [App](../coding-agents/20260512-coding-agents-app.html) · [Slideshow](../coding-agents/20260512-coding-agents-slideshow.html)
  - 9 schémas SVG dans [`images/`](../coding-agents/images/)
- **Source méta — [`anatomie/`](../anatomie/)** (14 mai 2026) — anneaux 01 (boucle) + 04 (patterns) de `livre-data.js`. **Sert de définition canonique** pour ReAct, `stop_reason`, harness, et les 6 patterns Schluntz-Zhang qui sont étendus en Ch.11.

### Audit des schémas — Ch.7

Au total, **29 schémas SVG** dans les 4 dossiers source. Classement S (au fil du texte du Ch.7) / R (récap chapitre) / E (essentiel transverse) / Ch.X (assigné à un autre chapitre) / écarté.

#### Schémas du dossier `harness-agentique/` (9)

| Fig | Slug | Aperçu | Catégorie Ch.7 | Statut |
| --- | --- | --- | --- | --- |
| 00 | [`exec-sum-a4`](../harness-agentique/images/20260429-00-exec-sum-a4.svg) | A4 portrait synthèse | écarté (livre) | annexe rapport |
| 01 | [`anatomie-harness`](../harness-agentique/images/20260429-01-anatomie-harness.svg) | ![](../harness-agentique/images/20260429-01-anatomie-harness.svg) | **S §7.2 + Récap §7** | tel quel — schéma signature du chapitre, utilisé **2×** (S §7.2 + récap) |
| 01b | [`architecture-systeme`](../harness-agentique/images/20260429-01b-architecture-systeme.svg) | ![](../harness-agentique/images/20260429-01b-architecture-systeme.svg) | **S §7.2.3** | tel quel — 4 zones + bus observabilité, complète anatomie-harness |
| 02 | [`boucle-gan`](../harness-agentique/images/20260429-02-boucle-gan.svg) | ![](../harness-agentique/images/20260429-02-boucle-gan.svg) | **S §7.4** | tel quel — planner/generator/evaluator |
| 03 | [`trois-couches`](../harness-agentique/images/20260429-03-trois-couches.svg) | ![](../harness-agentique/images/20260429-03-trois-couches.svg) | **Ch.20** (runtime managé) | renvoi Ch.20 — la cartographie API/SDK/Managed appartient au chapitre runtime |
| 04 | [`secteurs-maturite`](../harness-agentique/images/20260429-04-secteurs-maturite.svg) | ![](../harness-agentique/images/20260429-04-secteurs-maturite.svg) | **Ch.21** (ROI) | renvoi Ch.21 — matrice secteurs × maturité |
| 05 | [`effort-developpement`](../harness-agentique/images/20260429-05-effort-developpement.svg) | ![](../harness-agentique/images/20260429-05-effort-developpement.svg) | **S §7.11** | tel quel — trois trajectoires POC / mid / multi-agent |
| 06 | [`observabilite-piliers`](../harness-agentique/images/20260429-06-observabilite-piliers.svg) | ![](../harness-agentique/images/20260429-06-observabilite-piliers.svg) | **S §7.7** | tel quel — 6 piliers (renvoi Ch.18 pour détail) |
| 07 | [`trajectoire`](../harness-agentique/images/20260429-07-trajectoire.svg) | ![](../harness-agentique/images/20260429-07-trajectoire.svg) | **Ch.20** (horizon runtime) | renvoi Ch.20 |

#### Schémas du dossier `agent-sdk/` (11, dont 3 ref)

| Fig | Slug | Aperçu | Catégorie Ch.7 | Statut |
| --- | --- | --- | --- | --- |
| 00 | [`exec-sum-a4`](../agent-sdk/images/20260518-00-exec-sum-a4.svg) | A4 portrait | écarté (livre) | annexe rapport |
| 01 | [`evolution-agents`](../agent-sdk/images/20260518-01-evolution-agents.svg) | ![](../agent-sdk/images/20260518-01-evolution-agents.svg) | **Prologue/Ch.1** (LLM features → workflows → agents) | écarté Ch.7 — trop méta, mieux placé en intro générale |
| 02 | [`anatomie-claude-code`](../agent-sdk/images/20260518-02-anatomie-claude-code.svg) | ![](../agent-sdk/images/20260518-02-anatomie-claude-code.svg) | écarté Ch.7 (redondant avec harness-01) | mieux placé en encart "vue produit" du Ch.7 si édition print le réclame |
| 03 | [`cc-vs-sdk`](../agent-sdk/images/20260518-03-cc-vs-sdk.svg) | ![](../agent-sdk/images/20260518-03-cc-vs-sdk.svg) | écarté Ch.7 (couverte textuellement §7.10) | optionnel pour zoom produit |
| 04 | [`trois-voies`](../agent-sdk/images/20260518-04-trois-voies.svg) | ![](../agent-sdk/images/20260518-04-trois-voies.svg) | **S §7.10** (envisagé) | tel quel — mais §7.10 a privilégié la matrice tabulaire pour densité d'info |
| 05 | [`pokeapi-variantes`](../agent-sdk/images/20260518-05-pokeapi-variantes.svg) | ![](../agent-sdk/images/20260518-05-pokeapi-variantes.svg) | écarté Ch.7 (cas spécifique) | gardé en ligne sur dossier source |
| 06 | [`bash-funnel`](../agent-sdk/images/20260518-06-bash-funnel.svg) | ![](../agent-sdk/images/20260518-06-bash-funnel.svg) | **S §7.5.2** (envisagé) | non retenu v1 — texte du scénario rideshare suffit ; à réintroduire si édition print veut une illustration |
| 07 | [`matrice-tools-bash-codegen`](../agent-sdk/images/20260518-07-matrice-tools-bash-codegen.svg) | ![](../agent-sdk/images/20260518-07-matrice-tools-bash-codegen.svg) | **S §7.5** | tel quel — matrice trois paradigmes |
| 08 | [`agent-loop`](../agent-sdk/images/20260518-08-agent-loop.svg) | ![](../agent-sdk/images/20260518-08-agent-loop.svg) | candidat **S §7.3** | non retenu v1 — la formulation TAOR + variante GAN suffit textuellement ; à réintégrer si édition print veut un schéma boucle dédié |
| 09 | [`securite-couches`](../agent-sdk/images/20260518-09-securite-couches.svg) | ![](../agent-sdk/images/20260518-09-securite-couches.svg) | **S §7.8** | tel quel — gruyère 3 couches |
| ref-1 | [`ref-coding-agents-anatomie`](../agent-sdk/images/ref-coding-agents-anatomie.svg) | (copie de coding-agents-02) | — | source originale en coding-agents/ |
| ref-2 | [`ref-gruyere-suisse`](../agent-sdk/images/ref-gruyere-suisse.svg) | (parallèle évaluation) | **Ch.17** (gruyère évaluation) | renvoi Ch.17 — c'est la fig signature playbook eval 8 étapes |
| ref-3 | [`ref-harness-7-couches`](../agent-sdk/images/ref-harness-7-couches.svg) | (copie de harness-01) | — | source originale en harness-agentique/ |

#### Schémas du dossier `coding-agents/` (9)

| Fig | Slug | Aperçu | Catégorie Ch.7 | Statut |
| --- | --- | --- | --- | --- |
| 00 | [`exec-sum-a4`](../coding-agents/images/20260512-00-exec-sum-a4.svg) | A4 portrait | écarté (livre) | annexe rapport |
| 01 | [`trois-regimes`](../coding-agents/images/20260512-01-trois-regimes.svg) | ![](../coding-agents/images/20260512-01-trois-regimes.svg) | écarté Ch.7 (trop coding-spé) | gardé en ligne sur dossier source |
| 02 | [`anatomie`](../coding-agents/images/20260512-02-anatomie.svg) | ![](../coding-agents/images/20260512-02-anatomie.svg) | écarté Ch.7 (redondant avec harness-01 + sdk-02) | gardé en ligne ; signe la redondance massive identifiée |
| 03 | [`cycle-skill`](../coding-agents/images/20260512-03-cycle-skill.svg) | ![](../coding-agents/images/20260512-03-cycle-skill.svg) | candidat §7.6.1 | non retenu v1 — descriptions textuelles des skills suffisent ; à réintroduire en print si nécessaire |
| 04 | [`comparatif`](../coding-agents/images/20260512-04-comparatif.svg) | ![](../coding-agents/images/20260512-04-comparatif.svg) | écarté Ch.7 (comparatif produits trop coding-spé) | gardé en ligne |
| 05 | [`pyramide`](../coding-agents/images/20260512-05-pyramide.svg) | ![](../coding-agents/images/20260512-05-pyramide.svg) | **S §7.9** | tel quel — schéma signature de §7.9 |
| 06 | [`gains`](../coding-agents/images/20260512-06-gains.svg) | ![](../coding-agents/images/20260512-06-gains.svg) | **Ch.21** (ROI/gains) | renvoi Ch.21 |
| 07 | [`couts`](../coding-agents/images/20260512-07-couts.svg) | ![](../coding-agents/images/20260512-07-couts.svg) | **Ch.21** (ROI/coûts) | renvoi Ch.21 |
| 08 | [`carte-decision`](../coding-agents/images/20260512-08-carte-decision.svg) | ![](../coding-agents/images/20260512-08-carte-decision.svg) | écarté Ch.7 (matrice tabulaire §7.10.5 suffit) | gardé en ligne |

#### Schémas du dossier `anatomie/` (méta)

Les anneaux concentriques de `livre.html` (rendus par `livre-render.js` à partir de `LAYERS` dans `livre-data.js`) ne sont pas exportés en SVG indépendants. Les anneaux 01 (boucle), 02 (outils), 03 (contexte), 04 (patterns) constituent le **squelette conceptuel** mais ne fournissent pas d'images directement réutilisables ; ils nourrissent en revanche la **discipline éditoriale** (définitions canoniques, risques par couche, rôles par couche). Le schéma E1 (anatomie 10 anneaux concentriques) sera dérivé pour l'ouverture du livre.

### Redondances et complémentarités entre les 4 dossiers

**3 redondances majeures identifiées, déduplications opérées dans le chapitre :**

| Sujet | `harness-agentique` | `agent-sdk` | `coding-agents` | `anatomie` | Décision Ch.7 |
| --- | --- | --- | --- | --- | --- |
| **Anatomie d'un harness** | 7 couches verticales + 2 plans (le plus dense, vue système) | 9 satellites autour du modèle (vue produit Claude Code) | 6 rouages (vue coding agent) | 10 anneaux concentriques (vue stratégique) | **Définition canonique = harness-01 (7 couches)**. Sdk-02 et coding-02 cités en mémoire, anatomie en référence amont. Évite 3 schémas redondants. |
| **Boucle Reason · Act · Observe** | TAOR (Think-Act-Observe-Repeat) | Gather · Act · Verify (Anthropic Agent SDK) | « itère en boucle » (description narrative) | ReAct (formalisation académique) | **Définition canonique = §7.3 avec 3 variantes nommées**. Une seule description, 3 noms reconnus, 1 pivot (`stop_reason`). Le R1 « boucle + 3 variantes » de l'outline est rempli par superposition textuelle dans §7.3 — pas de schéma fusionné v1, à créer si édition print. |
| **6 patterns canoniques Anthropic** | mention rapide | non couvert | mention rapide | 6 patterns détaillés (anneau 04 livre-data.js) | **Définition canonique = Ch.11**, pas Ch.7. Le Ch.7 fixe le principe (start simple, règle Schluntz-Zhang), Ch.11 déroule la taxonomie complète. |

**Complémentarités assumées (pas de doublon vrai) :**

| Apport unique du dossier | À conserver pour le Ch.7 |
| --- | --- |
| `harness-agentique` | Anatomie 7 couches, pattern GAN, observabilité 6 piliers, effort de dev (les 4 schémas signature) |
| `agent-sdk` | Matrice tools/bash/codegen, gruyère 3 couches sécurité, matrice 4 voies de build, hooks 6 points d'interception |
| `coding-agents` | Pyramide d'usage 4 étages (le seul angle qui structure l'adoption transverse), retex chiffrés (Stripe, METR), pyramide d'adoption |
| `anatomie/livre-data.js` | Définitions canoniques (ReAct, stop_reason, harness, runner, graph execution, function calling, tool_use…), risques par couche |

**1 absence notable, non bloquante** : pas de **schéma fusionné R1** (boucle ReAct canonique + 3 variantes harness GAN / gather-act-verify / coding loop). L'outline (annexe A.2) le liste comme « à créer par fusion ». **Décision v1** : couvert textuellement dans §7.3 (3 variantes nommées, une seule description), et le récap chapitre réutilise harness-01 (7 couches) qui couvre déjà la boucle comme couche 2. Si l'édition print réclame un récap fusionné dédié, le coût est ~3-5 jours SVG.

### Plan détaillé du chapitre

```
> [!QUESTION] Question d'ouverture
  Si l'écart inter-modèles tombe sous 1,3pt mais que le scaffold pèse 22pt,
  où passe le levier d'ingénierie 2026 ?

> [!TLDR] TL;DR décideur (6 bullets)

§7.1  Pourquoi 2026 est l'année du harness (3 faits empiriques)
      └─ encadré [!INFO] Voir Ch.1 (cœur stochastique)

§7.2  Anatomie d'un harness — sept couches
      ├─ §7.2.1 Modèle, boucle, contexte, outils, mémoire
      │  └─ encadré [!INFO] Voir Ch.9 (mémoire agentique)
      ├─ §7.2.2 Observabilité, gouvernance (plans horizontaux)
      └─ §7.2.3 Du conceptuel au système
         ├─ [SVG S] harness-01-anatomie-harness.svg
         └─ [SVG S] harness-01b-architecture-systeme.svg

§7.3  La boucle Reason · Act · Observe et son pivot stop_reason
      ├─ encadré [!EXAMPLE] boucle minimale Anthropic Client SDK
      ├─ §7.3.1 Trois variantes d'une même boucle (TAOR / Gather-Act-Verify / GAN)
      └─ §7.3.2 Pourquoi la boucle mono-agent s'effondre
         └─ encadré [!QUOTE] Rajasekaran Anthropic Labs

§7.4  Le pattern à trois agents (GAN-inspiré)
      ├─ [SVG S] harness-02-boucle-gan.svg
      ├─ §7.4.1 Anatomie (planner / generator / evaluator)
      ├─ §7.4.2 L'économie du pattern (mono 20min/9$ vs trois agents 6h/200$)
      └─ §7.4.3 Trois leçons d'ingénierie
         └─ encadré [!ATTENTION] Le pattern n'est pas la seule architecture

§7.5  Outils, bash et codegen — les trois paradigmes d'action
      ├─ [SVG S] sdk-07-matrice-tools-bash-codegen.svg
      ├─ §7.5.1 Tools — actions structurées
      ├─ §7.5.2 Bash — composition, filesystem, mémoire (scénario rideshare)
      ├─ §7.5.3 Codegen — flexibilité, deep research
      │  └─ encadré [!EXAMPLE] codegen avec hooks
      └─ §7.5.4 La règle de combinaison
         └─ encadré [!IMPORTANT] RBAC passe par l'infra, pas le prompt

§7.6  Skills, hooks, sub-agents — leviers de fiabilité déterministe
      ├─ §7.6.1 Les skills — objet partageable
      ├─ §7.6.2 Les hooks — rattrapage déterministe
      └─ §7.6.3 Les sub-agents — déléguer dans la délégation
         └─ encadré [!INFO] Voir Ch.11 (orchestration multi-agent)

§7.7  Observabilité — six piliers, et pourquoi l'APM est aveugle
      ├─ [SVG S] harness-06-observabilite-piliers.svg
      └─ encadré [!INFO] Voir Ch.18 (observabilité agentique)

§7.8  Gouvernance — gruyère suisse, sandbox, RBAC
      ├─ [SVG S] sdk-09-securite-couches.svg
      ├─ encadré [!WARNING] Piège classique de la couche outils (execute_sql + injection)
      └─ encadré [!INFO] Voir Ch.13 et Ch.19 (sécurité MCP + threat model E4)

§7.9  La pyramide d'adoption — qui s'en sert pour quoi
      ├─ [SVG S] coding-05-pyramide.svg
      ├─ 4 étages (transverse / data quotidien / data expert / produit-décideurs)
      └─ encadré [!NOTE] Le sommet n'est pas mieux que la base

§7.10 Trois voies pour builder + une — matrice de décision
      ├─ §7.10.1 Client SDK
      ├─ §7.10.2 Agent SDK
      ├─ §7.10.3 Claude Code comme plateforme d'extension
      ├─ §7.10.4 Managed Agents
      ├─ §7.10.5 Matrice transverse (8 cas d'usage × voie × mix × surveillance)
      └─ encadré [!INFO] Voir Ch.20 (runtime managé)

§7.11 Effort de développement — combien, combien de temps, avec qui
      ├─ [SVG S] harness-05-effort-developpement.svg
      ├─ 3 trajectoires (POC 50-100k€ / mid 150-300k€ / multi-agent 500k-2M€+)
      ├─ Distribution effort (data prep 60-75%, intégration 40-60%, safety +20-30%)
      └─ encadré [!INFO] Voir Ch.21 (ROI + paradoxe agentique)

Récap chapitre — Sept couches, une boucle, trois voies
       └─ [SVG R] harness-01-anatomie-harness.svg (réutilisé en récap)

> [!WARNING] Trois pièges classiques (les trois sont 100% traçables)
  Loop infinie sans budget de tours · execute_sql sans sandbox ·
  multi-agent prématuré (×10-15 tokens, mois vs semaines, debug exponentiel)

Sources (23 footnotes : 4 dossiers source + Anthropic engineering blog +
        Microsoft Tech Community + ReAct paper + Coinbase + McKinsey + OWASP +
        Stack Overflow Survey + METR)
```

### Encadrés prévus dans le chapitre

Variété des `> [!TYPE]` Obsidian retenus :

| Type | Usage | Compte |
| --- | --- | --- |
| `[!QUESTION]` | Ouverture chapitre | 1 |
| `[!TLDR]` | Synthèse décideur 6 bullets | 1 |
| `[!INFO]` | Renvois inter-chapitres (Ch.1, 9, 11, 13/19, 18, 20, 21) | 7 |
| `[!EXAMPLE]` | Code pseudo-Python (Client SDK loop + Agent SDK hooks) | 2 |
| `[!QUOTE]` | Citation Rajasekaran (Anthropic Labs) | 1 |
| `[!ATTENTION]` | Le pattern n'est pas la seule architecture (renvoi Ch.11) | 1 |
| `[!IMPORTANT]` | RBAC passe par l'infra | 1 |
| `[!NOTE]` | Le sommet n'est pas mieux que la base (pyramide §7.9) | 1 |
| `[!WARNING]` | Piège exec_sql + trois pièges classiques en clôture | 2 |
| **Total** | | **17** |

### Tâches restantes Ch.7

- [x] Rédiger le manuscrit `docs/livre/ch07-boucle-agentique.md` (~9 800 mots)
- [x] Audit des 29 schémas SVG des 4 dossiers source
- [ ] Relecture Mathieu — passes critiques suggérées :
  - **(a) La discipline anti-redondance** : vérifier que les 3 redondances majeures (anatomie / boucle / 6 patterns) sont effectivement déduplicéés sans perte de matière utile.
  - **(b) Le récap §Récap** : décider si on garde la réutilisation du schéma harness-01 ou si on commande la fusion R1 (boucle ReAct + 3 variantes).
  - **(c) Le §7.5.2 bash** : le scénario rideshare est cité textuellement sans schéma ; valider que ça passe ou réintégrer sdk-06-bash-funnel.svg.
  - **(d) Le §7.9 pyramide** : c'est l'angle unique du dossier coding-agents — vérifier qu'il n'est pas dilué par l'absorption en charnière.
  - **(e) La frontière Ch.7 ↔ Ch.11** : règle d'écriture posée (§7.4 trois agents = Ch.7 ; 8 patterns canoniques + topologies multi-agents + arbre buy/build = Ch.11). À valider pendant la rédaction du Ch.11.
- [ ] Si validation : copier-coller la matière vers le futur format de sortie (print HTML / PDF) quand décidé

---

## Chapitre 11 — Patterns canoniques et orchestration multi-agents

> **Acte II — La boucle · Gabarit standard 16-24 p · ~6 500 mots**
> **Lecteur cible** : agent engineer, tech lead, architecte, sponsor IA.
> **Sortie lecteur** : connaît les 4 régimes de contrôle et sait à quel moment basculer du workflow vers l'agent autonome ; maîtrise les 8 patterns canoniques (5 workflows Anthropic + 3 topologies multi-agents) ; distingue les 3 couches du stack (ADK / runtime / plateforme) et sait que « on utilise Bedrock » ne dit rien tant qu'on n'a pas précisé les briques ; reconnaît les 5 problèmes durs qui font crasher les agents en prod ; peut dérouler l'arbre buy/build à 4 questions ; et sait qu'une fabrique d'équipe en 4 stades × 10 artefacts est ce qui sépare 5 % de projets qui livrent des 95 % qui restent en pilote (MIT NANDA).

### Statut

| Étape | Statut |
| --- | --- |
| Audit schémas source (3 dossiers) | ✅ fait (cf. §Audit ci-dessous) |
| Plan détaillé | ✅ fait |
| Manuscrit | ✅ **v1 livrée** — `docs/livre/ch11-patterns-orchestration.md` (≈ 6 500 mots, 14 encadrés, 8 schémas intégrés) |
| Schémas à créer | 0 v1 (R4 « 8 patterns canoniques » traité par réutilisation tel quel de `orchestration-04-patterns-canoniques.svg` ; R5 « fabrique 4 stades » traité par tableau markdown — le schéma `fabrique-12-recap-10x4.svg` reste optionnel pour le récap dédié si édition print l'exige) |
| Frontière Ch.7 ↔ Ch.11 | ✅ respectée — Ch.7 garde le pattern GAN 3-agents (§7.4) ; Ch.11 déroule la taxonomie complète des 8 patterns et cite §7.4 comme cas particulier d'evaluator-optimizer enrichi d'un planner |
| Renvois inter-chapitres | ✅ Ch. 5 (économie token), Ch. 7 (boucle, pattern GAN, RBAC), Ch. 9 (mémoire), Ch. 10 (compaction), Ch. 12 (MCP plateforme), Ch. 13 (MCP sécurité), Ch. 14 (surfaces + Knight levels), Ch. 15 (computer use / browser tool), Ch. 17 (eval pass^k), Ch. 18 (observabilité), Ch. 19 (threat model E4), Ch. 20 (runtime managé), Ch. 21 (ROI Klarna second usage), Ch. 24 (IA et travail réallocation) |

### Sources matérielles

Le Ch.11 est une **charnière à 3 dossiers**, ancré dans le dossier le plus récent de la série (`orchestration-agentique/` mergé via PR #126 le 27 mai 2026, source principale) qui structure les huit patterns, les quatre régimes, le stack en trois couches, les cinq problèmes durs et l'arbre buy/build. La couche fabrique d'équipe vient de `fabrique-agent/`. L'absorbé `anatomie/` couche 04 fournit les définitions canoniques.

- **Dossier principal — [`orchestration-agentique/`](../orchestration-agentique/)** (27 mai 2026, dossier #28) — épine du chapitre : 4 régimes (§3), 8 patterns canoniques (§4), stack ADK/runtime/plateforme (§5), cartographie 2026 (§6), 5 problèmes prod (§7), arbre de décision buy/build (§8).
  - [Rapport (.md, ~6 500 mots)](../orchestration-agentique/20260527-orchestration-agentique-rapport.md) · [App interactive](../orchestration-agentique/20260527-orchestration-agentique-app.html)
  - 8 schémas SVG dans [`images/`](../orchestration-agentique/images/) — **tous** intégrés en Ch.11 (taux d'absorption maximal du corpus).
- **Dossier sous-chapitre équipe — [`fabrique-agent/`](../fabrique-agent/)** (15 mai 2026, étude #21) — 4 stades de maturité (Prototype · Pilote · Production · Mature multi-agents) × 10 artefacts partagés, 5 cellules pivots.
  - [Rapport (.md, ~14 000 mots)](../fabrique-agent/20260515-fabrique-agent-rapport.md) · [App interactive](../fabrique-agent/20260515-fabrique-agent-app.html)
  - 13 schémas SVG dans [`images/`](../fabrique-agent/images/) — pas absorbés visuellement (le tableau §11.8.1 condense, fidèle à la discipline anti-mur-de-schéma)
- **Source méta — [`anatomie/`](../anatomie/)** (14 mai 2026) — anneau 04 (patterns) de `livre-data.js`. Définitions canoniques mobilisées textuellement, pas de schéma autonome extrait.

### Audit des schémas — Ch.11

Au total, **21 schémas SVG** dans les 3 dossiers source. Classement S (au fil du texte Ch.11) / R (récap chapitre) / Ch.X (assigné à un autre chapitre) / écarté.

#### Schémas du dossier `orchestration-agentique/` (8 — tous absorbés)

| Fig | Slug | Aperçu | Catégorie Ch.11 | Statut |
| --- | --- | --- | --- | --- |
| 01 | [`shift-chat-systeme`](../orchestration-agentique/images/20260527-01-shift-chat-systeme.svg) | ![](../orchestration-agentique/images/20260527-01-shift-chat-systeme.svg) | **S §11.1.2** | tel quel — frise 2023→2026 qui pose le motif du chapitre |
| 02 | [`anatomie-boucle`](../orchestration-agentique/images/20260527-02-anatomie-boucle.svg) | ![](../orchestration-agentique/images/20260527-02-anatomie-boucle.svg) | **S §11.2** | tel quel — 4 phases + 4 ressources + orchestrateur enveloppant |
| 03 | [`spectre-controle`](../orchestration-agentique/images/20260527-03-spectre-controle.svg) | ![](../orchestration-agentique/images/20260527-03-spectre-controle.svg) | **S §11.3 + Récap §11.9** | tel quel — schéma signature du chapitre, utilisé **2×** |
| 04 | [`patterns-canoniques`](../orchestration-agentique/images/20260527-04-patterns-canoniques.svg) | ![](../orchestration-agentique/images/20260527-04-patterns-canoniques.svg) | **R4 §11.4** | tel quel — couvre la bibliothèque des 8 patterns sans gap. Le R4 de l'outline (annexe A.2) est ainsi rempli sans fusion lourde. |
| 05 | [`stack-trois-couches`](../orchestration-agentique/images/20260527-05-stack-trois-couches.svg) | ![](../orchestration-agentique/images/20260527-05-stack-trois-couches.svg) | **S §11.5** | tel quel — ADK / runtime / plateforme |
| 06 | [`cartographie-2026`](../orchestration-agentique/images/20260527-06-cartographie-2026.svg) | ![](../orchestration-agentique/images/20260527-06-cartographie-2026.svg) | **S §11.5.4** | tel quel — 4 bandes + 2 protocoles |
| 07 | [`problemes-prod`](../orchestration-agentique/images/20260527-07-problemes-prod.svg) | ![](../orchestration-agentique/images/20260527-07-problemes-prod.svg) | **S §11.6** | tel quel — 5 problèmes durs, ancrés en symptôme / signal / parade |
| 08 | [`arbre-decision`](../orchestration-agentique/images/20260527-08-arbre-decision.svg) | ![](../orchestration-agentique/images/20260527-08-arbre-decision.svg) | **S §11.7 (+ E6 outline)** | tel quel — arbre 4 questions. C'est aussi le schéma essentiel transverse **E6** de l'outline, cité ici en source et à recadrer si l'annexe consultative print le réclame. |

#### Schémas du dossier `fabrique-agent/` (13, aucun absorbé visuellement)

Les 13 schémas de `fabrique-agent/` (atelier par stade, recap 10×4, ROI cards, etc.) sont **tous écartés** du Ch.11 v1 — non par jugement de qualité, mais par discipline éditoriale. Le chapitre Ch.11 est standard (16-24 p), il a déjà 8 schémas intégrés (tous d'`orchestration-agentique/`), et la matière fabrique est condensée en §11.8 par un **tableau markdown 4 stades × artefacts naissants** qui suffit à porter la thèse sans alourdir. Si une édition print exige un schéma de récap dédié à la fabrique (équivalent du R5 listé en annexe A.2 de l'outline), `fabrique-12-recap-10x4.svg` est le candidat naturel ; sa réutilisation en Ch.11 reste possible à coût zéro.

Détail de classification pour mémoire (et pour le Ch.11 qui ne les absorbe pas) :

| Fig | Slug | Catégorie | Note |
| --- | --- | --- | --- |
| 01 | `oignon-fabrique` | écarté Ch.11 | superposition oignon / fabrique — appartient à l'ouverture du livre ou au prologue |
| 02-04, 07, 10 | `atelier-prototype` / `atelier-pilote` / `atelier-production` / `atelier-mature` | écarté Ch.11 | scènes d'atelier par stade — appartiennent à un éventuel sous-chapitre dédié `fabrique-agent` |
| 05 | `testcase-anatomie` | **Ch.17** | format TestCase = (Persona × Quest × Environment) → Expected Outcome — appartient au chapitre éval |
| 06 | `vallee-de-la-mort` | **Ch.21** | 95 %/70 % POC qui meurent — ROI/économie |
| 08 | `gruyere-suisse` | **Ch.17** | Anthropic 5 couches d'évaluation — appartient au chapitre éval (renvoyé déjà via `agent-sdk ref-2` au Ch.7) |
| 09 | `obo-vs-autonome` | **Ch.13/Ch.19/Ch.23** | régimes d'identité — sécurité MCP / threat model / gouvernance |
| 11 | `coala-cycle` | **Ch.9** | 4 piliers CoALA + 6 opérations — appartient au chapitre mémoire |
| 12 | `recap-10x4` | candidat **R5 Ch.11** (édition print) | matrice 10 artefacts × 4 stades — réservée pour récap fabrique si gabarit print le réclame. v1 du Ch.11 fait sans, par tableau markdown. |
| 13 | `roi-cards` | **Ch.21** | 5 axes × 3 temporalités = 15 ROI cards — appartient au chapitre ROI |

#### Schémas du dossier `anatomie/` (couche 04 patterns)

Les anneaux concentriques de `livre.html` (rendus par `livre-render.js` à partir de `LAYERS` dans `livre-data.js`) ne sont pas exportés en SVG indépendants. La couche 04 (patterns) fournit en revanche la **discipline éditoriale** : c'est elle qui pose le principe que la taxonomie des 6 patterns Schluntz-Zhang est canonique et qu'elle s'étend en multi-agent par 3 topologies. Aucune image directement réutilisable — la matière est dans le SVG `orchestration-04-patterns-canoniques` qui couvre les 8 patterns en une bibliothèque visuelle.

### Redondances et complémentarités entre les 3 dossiers

**2 redondances majeures identifiées, déduplications opérées dans le chapitre :**

| Sujet | `orchestration-agentique` | `fabrique-agent` | `anatomie` 04 | Décision Ch.11 |
| --- | --- | --- | --- | --- |
| **Boucle agentique 4 phases** | SCHÉMA 02 anatomie-boucle (perceive·decide·act·observe + 4 ressources) | TAOR mentionnée comme couche 01 de l'oignon | ReAct dans `livre-data.js` LAYERS[1] | **Définition canonique = Ch.7 §7.3** (déjà acquise). Ch.11 §11.2 réutilise le schéma 02 pour rappeler les 4 ressources sous l'angle « ce qu'on orchestre exactement », sans redécrire la mécanique. Pas de doublon vrai parce que l'angle change (orchestration vs harness). |
| **8 patterns Anthropic + multi-agents** | SCHÉMA 04 patterns-canoniques (la bibliothèque complète) | non couvert visuellement | 6 patterns Schluntz-Zhang dans anneau 04 | **Définition canonique = Ch.11 §11.4** (objet propre du chapitre). Le Ch.7 a explicitement repoussé en Ch.11 (cf. son audit). Le Ch.11 cite §7.4 (pattern GAN à 3 agents) comme cas particulier d'evaluator-optimizer enrichi d'un planner, sans refaire la narration. |

**Complémentarités assumées (pas de doublon vrai) :**

| Apport unique du dossier | À conserver pour le Ch.11 |
| --- | --- |
| `orchestration-agentique` | 4 régimes de contrôle (§3) ; 8 patterns canoniques (§4) ; stack 3 couches ADK / runtime / plateforme (§5) ; cartographie 2026 4 bandes + 2 protocoles (§6) ; 5 problèmes durs en prod (§7) ; arbre de décision buy/build 4 questions (§8). C'est **le** dossier qui structure l'ensemble. |
| `fabrique-agent` | Discipline « la maturité se lit dans les artefacts, pas dans le code » + 4 stades + 10 artefacts + 5 cellules pivots + chiffres MIT NANDA (95 %) / consensus POC (70 %). **L'angle équipe** que `orchestration-agentique` n'a pas. |
| `anatomie/livre-data.js` couche 04 | Définitions canoniques des 6 patterns Schluntz-Zhang, risques par couche, rôles par couche. Sert de référence amont, pas d'absorption directe. |

**Cohérence avec la frontière posée par Ch.7** : le Ch.7 a repoussé explicitement en Ch.11 (a) les 8 patterns canoniques, (b) l'arbre de décision buy/build, (c) la cartographie des 4 régimes étendue. Le Ch.7 garde (i) le principe `start simple` Schluntz-Zhang, (ii) le pattern GAN à 3 agents comme cas particulier traité en détail §7.4. Le Ch.11 respecte cette frontière sans la franchir : §11.4.1 mentionne le pattern à 3 agents comme cas particulier d'evaluator-optimizer + planner, renvoie au Ch.7 §7.4 pour l'économie et la narration, et ne refait pas le schéma `harness-02-boucle-gan.svg` (qui reste signature du Ch.7).

**1 absence notable, non bloquante** : pas de **schéma fusionné R5** (matrice 4 stades fabrique × 10 artefacts). L'outline (annexe A.2) le liste comme « tel quel à partir de `fabrique-12-recap-10x4.svg` ». **Décision v1** : couvert par tableau markdown §11.8.1, plus condensé qu'un schéma 10 colonnes × 4 lignes qui demanderait une double-page A3 pour rester lisible. Si l'édition print réclame un récap visuel dédié, `fabrique-12-recap-10x4.svg` est le candidat naturel et son coût d'intégration est nul (réutilisation tel quel).

### Plan détaillé du chapitre

```
> [!QUESTION] Question d'ouverture
  Si plus de la moitié des projets multi-agents reviennent en workflow routé
  en 6 mois (sans perte de qualité, ×10 facture, debug lisible),
  à quel moment bascule-t-on dans le multi-agent — et qui pilote la boucle ?

> [!TLDR] TL;DR décideur (6 bullets)

§11.1  Pourquoi un chapitre dédié aux patterns
       ├─ §11.1.1 La place de ce chapitre dans l'Acte II
       │  └─ encadré [!INFO] Voir Ch.7 (boucle / pattern GAN)
       └─ §11.1.2 Le glissement 2023 → 2026
          └─ [SVG S] orchestration-01-shift-chat-systeme.svg

§11.2  Ce qu'on orchestre exactement
       ├─ [SVG S] orchestration-02-anatomie-boucle.svg
       ├─ 4 ressources + 5 questions par tour
       └─ encadré [!NOTE] La distinction workflow vs agent (Anthropic)

§11.3  Quatre régimes de contrôle
       ├─ [SVG S] orchestration-03-spectre-controle.svg
       ├─ §11.3.1 Code-driven (workflow)
       ├─ §11.3.2 LLM-driven (routines + handoffs) — OpenAI Swarm
       │  └─ encadré [!EXAMPLE] signature minimale handoff Agents SDK
       ├─ §11.3.3 Graphe déclaratif — LangGraph
       └─ §11.3.4 Agent autonome (boucle libre)
          └─ encadré [!ATTENTION] Recommandation Anthropic — réserver l'autonomie

§11.4  Les huit patterns canoniques
       ├─ [SVG R4] orchestration-04-patterns-canoniques.svg
       ├─ §11.4.1 Cinq workflows Anthropic
       │  └─ encadré [!INFO] Voir Ch.7 §7.4 — pattern à 3 agents
       ├─ §11.4.2 Trois topologies multi-agents
       ├─ encadré [!IMPORTANT] La maxime non-écrite — on compose
       └─ encadré [!INFO] Voir Ch.14 (surfaces + Knight levels)

§11.5  Le stack en trois couches — ADK ≠ runtime ≠ plateforme
       ├─ [SVG S] orchestration-05-stack-trois-couches.svg
       ├─ §11.5.1 Couche 1 — ADK (tableau 7 ADK)
       ├─ §11.5.2 Couche 2 — Runtime
       │  └─ encadré [!INFO] Voir Ch.20 (runtime managé)
       ├─ §11.5.3 Couche 3 — Services de plateforme (6 briques AgentCore)
       └─ §11.5.4 Cartographie 2026 — 4 bandes + 2 protocoles
          ├─ [SVG S] orchestration-06-cartographie-2026.svg
          └─ encadré [!INFO] Voir Ch.12 et Ch.13 (MCP plateforme + sécurité)

§11.6  Les cinq problèmes durs en prod
       ├─ [SVG S] orchestration-07-problemes-prod.svg
       ├─ §11.6.1 Mémoire et contexte (renvoi Ch.9, Ch.10)
       ├─ §11.6.2 Observabilité (renvoi Ch.18)
       ├─ §11.6.3 Sécurité (renvoi Ch.7 §7.5.4, Ch.13, Ch.19)
       ├─ §11.6.4 Idempotence et retry
       ├─ §11.6.5 Coût et amplification de tokens (renvoi Ch.10)
       └─ encadré [!WARNING] La cascade d'erreurs en multi-agents

§11.7  L'arbre de décision — produit, ADK + runtime, ou tout construire ?
       ├─ [SVG S] orchestration-08-arbre-decision.svg
       ├─ §11.7.1 Q1 — Cas d'usage standard ?
       │  └─ encadré [!QUOTE] L'angle Klarna — deux lectures, deux chapitres
       ├─ §11.7.2 Q2 — Workflow + besoin prod ?
       ├─ §11.7.3 Q3 — Spécificité forte + SRE ?
       ├─ §11.7.4 Q4 — Contraintes uniques ?
       ├─ §11.7.5 Si toutes les réponses sont « non »
       └─ §11.7.6 Trois signaux de migration

§11.8  La fabrique d'équipe — quatre stades, dix artefacts
       ├─ §11.8.1 Quatre stades (tableau markdown)
       │  └─ encadré [!IMPORTANT] La maturité d'une fabrique se lit
       │     dans ses artefacts
       └─ §11.8.2 Cinq cellules pivots (Entra Agent ID, memory_hit_rate,
          pass^k, OBO vs Autonome, réallocation)

§11.9  Récap chapitre — Quatre régimes, huit patterns, trois couches,
       un arbre
       └─ [SVG R] orchestration-03-spectre-controle.svg (réutilisé en récap
          — c'est le schéma qui articule tout le reste)

> [!WARNING] Trois pièges classiques (les trois sont 100 % traçables)
  Multi-agent prématuré · mal nommer la zone du stack · sauter le stade 3
  pour aller direct au stade 4

Sources (22 footnotes : 3 dossiers + Anthropic Building Effective Agents
        + OpenAI Cookbook/Agents SDK + AWS AgentCore + Google ADK +
        MS Agent Framework + Stellagent A2A + Knowlee + GuruSup + Morph +
        Claude Code docs + Sierra + Mem0 + Braintrust + OWASP ASI +
        GitHub Engineering multi-agent failures + Klarna press/post-mortem)
```

### Encadrés prévus dans le chapitre

Variété des `> [!TYPE]` Obsidian retenus :

| Type | Usage | Compte |
| --- | --- | --- |
| `[!QUESTION]` | Ouverture chapitre | 1 |
| `[!TLDR]` | Synthèse décideur 6 bullets | 1 |
| `[!INFO]` | Renvois inter-chapitres (Ch.7, 12+13, 14, 20) | 4 |
| `[!NOTE]` | Distinction workflow vs agent (maxime Anthropic) | 1 |
| `[!EXAMPLE]` | Code pseudo-Python (signature handoff Agents SDK) | 1 |
| `[!ATTENTION]` | Recommandation Anthropic — réserver l'autonomie | 1 |
| `[!IMPORTANT]` | La maxime "on compose" + La maturité des artefacts | 2 |
| `[!QUOTE]` | L'angle Klarna — deux lectures, deux chapitres (anticipe Ch.21) | 1 |
| `[!WARNING]` | Cascade d'erreurs multi-agents + Trois pièges classiques clôture | 2 |
| **Total** | | **14** |

### Tâches restantes Ch.11

- [x] Rédiger le manuscrit `docs/livre/ch11-patterns-orchestration.md` (~6 500 mots)
- [x] Audit des 21 schémas SVG des 3 dossiers source (8 absorbés sur 8 d'`orchestration-agentique` ; 0 sur 13 absorbés visuellement de `fabrique-agent` mais 6 réassignés à d'autres chapitres)
- [ ] Relecture Mathieu — passes critiques suggérées :
  - **(a) La frontière Ch.7 ↔ Ch.11** : vérifier que §11.4.1 (mention pattern à 3 agents comme cas particulier d'evaluator-optimizer) renvoie correctement au Ch.7 §7.4 sans rejouer l'économie 9 $/200 $ ni redécrire la mécanique. Statut v1 : renvoi unique sans répétition.
  - **(b) La fabrique d'équipe §11.8** : choix éditorial fort — table markdown plutôt que `fabrique-12-recap-10x4.svg`. Risque : sous-représentation visuelle du sous-chapitre. Alternative : insérer le schéma en récap dédié si édition print l'exige, ou créer un sous-chapitre `fabrique-agent` autonome (cf. friction 1 outline §4.2).
  - **(c) Le récap §11.9** : décision de réutiliser `orchestration-03-spectre-controle.svg` plutôt que `orchestration-04-patterns-canoniques.svg`. Justification : le spectre articule tout le reste (régimes → patterns → stack → problèmes → arbre) alors que le schéma 04 est une bibliothèque. Si Mathieu préfère le 04, swap trivial.
  - **(d) L'angle Klarna §11.7.1** : double usage explicite avec Ch.21 (ROI). Vérifier que les deux lectures restent complémentaires, pas redondantes.
  - **(e) La frontière Ch.11 ↔ Ch.20** : §11.5.2 (runtime) introduit AgentCore Runtime, Vertex Agent Engine, Foundry Service. Le Ch.20 dédié va creuser la matrice vendor. À ne pas refaire en Ch.20 — règle d'écriture posée.
- [ ] Si validation : copier-coller la matière vers le futur format de sortie (print HTML / PDF) quand décidé

---

## Chapitre 10 — Compaction et oubli stratégique

> **Acte II — La boucle · Gabarit standard 16-24 p · ~5 500-6 500 mots**
> **Lecteur cible** : agent engineer, tech lead, RSSI, DPO.
> **Sortie lecteur** : sait choisir une famille de compaction selon le triangle régulatoire/économique, connaît la surface d'attaque cachée et les attributs OTel candidats du WG GenAI fin 2026, peut justifier le choix de policy auprès d'un DPO/RSSI.

### Statut

| Étape | Statut |
| --- | --- |
| Audit schémas source | ✅ fait (cf. §Audit ci-dessous) |
| Plan détaillé | ✅ fait |
| Manuscrit | ✅ **v1 livrée** — `docs/livre/ch10-compaction.md` (≈ 5 800 mots, 14 encadrés, 7 schémas intégrés) |
| Schémas à créer | 0 (la matière source couvre) |
| Schémas à fixer | ✅ fait — `cinq-familles.svg` ligne 26 (XML désormais valide via xmllint) |
| Renvois inter-chapitres | ✅ Ch. 9 (mémoire), Ch. 18 (observabilité), Ch. 19 (sécurité E4), Ch. 23 (gouvernance) |

### Sources matérielles

- **Dossier principal** : [`compaction-agentique/`](../compaction-agentique/) — publié 27 mai 2026
  - [Rapport complet (.md, ~6 000 mots)](../compaction-agentique/20260527-compaction-agentique-rapport.md)
  - [App interactive (.html)](../compaction-agentique/20260527-compaction-agentique-app.html)
  - 7 schémas SVG dans [`images/`](../compaction-agentique/images/)
- **Dossier cross-référencé** : [`memoire-agentique/`](../memoire-agentique/) — publié 30 avril 2026
  - 9 schémas SVG dans [`images/`](../memoire-agentique/images/) — utilisés pour la **transition Ch.9 → Ch.10** uniquement (renvoi, pas absorption).

### Audit des schémas — Ch.10

Sept schémas dans `compaction-agentique`, neuf dans `memoire-agentique` mobilisables. Classement S (au fil du texte) / R (récap chapitre) / E (essentiel transverse).

#### Schémas du dossier compaction-agentique (7)

| Fig | Slug | Aperçu | Taille | Catégorie | Statut | Note |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | [`mur-fenetre`](../compaction-agentique/images/20260527-01-mur-fenetre.svg) | [![mur-fenetre](../compaction-agentique/images/20260527-01-mur-fenetre.svg)](../compaction-agentique/images/20260527-01-mur-fenetre.svg) | 7.7 Ko | **S** §10.2 | tel quel | Pose le problème : courbe en U (Liu et al.). À garder en ouverture chapitre. |
| 02 | [`contrat-io`](../compaction-agentique/images/20260527-02-contrat-io.svg) | [![contrat-io](../compaction-agentique/images/20260527-02-contrat-io.svg)](../compaction-agentique/images/20260527-02-contrat-io.svg) | 8.3 Ko | **S** §10.3 | tel quel | Anatomie I/O + 4 rôles (compactor, ledger, retrieval handle, security wrap). |
| 03 | [`cinq-familles`](../compaction-agentique/images/20260527-03-cinq-familles.svg) | [![cinq-familles](../compaction-agentique/images/20260527-03-cinq-familles.svg)](../compaction-agentique/images/20260527-03-cinq-familles.svg) | 14 Ko | **S** §10.4 | ⚠ **fix XML** + tel quel | Schéma le plus dense (5 colonnes summarization / eviction / hiérarchique / retrieval / learned). **Bug ligne 26** : `</title<` au lieu de `</text>` — duplication du titre. À corriger avant intégration. |
| 04 | [`triangle-tradeoff`](../compaction-agentique/images/20260527-04-triangle-tradeoff.svg) | [![triangle-tradeoff](../compaction-agentique/images/20260527-04-triangle-tradeoff.svg)](../compaction-agentique/images/20260527-04-triangle-tradeoff.svg) | 8.9 Ko | **R3** §10.5 + récap fin de chapitre | tel quel | **Schéma signature du chapitre.** Triangle non-dégénéré fidélité × coût × oubliabilité, positionnement des 5 familles, encadré "Conséquence opérationnelle" déjà présent côté droit. Format actuel A4 paysage 1200×760, à imprimer A3 paysage double-page si le récap pleine page est validé. |
| 05 | [`matrice-production`](../compaction-agentique/images/20260527-05-matrice-production.svg) | [![matrice-production](../compaction-agentique/images/20260527-05-matrice-production.svg)](../compaction-agentique/images/20260527-05-matrice-production.svg) | 9.6 Ko | **S** §10.6 | tel quel | Matrice 5 produits × 4 dimensions (Claude Code / Cursor / ChatGPT / Mem0 / Letta). |
| 06 | [`cycle-attaque`](../compaction-agentique/images/20260527-06-cycle-attaque.svg) | [![cycle-attaque](../compaction-agentique/images/20260527-06-cycle-attaque.svg)](../compaction-agentique/images/20260527-06-cycle-attaque.svg) | 9.5 Ko | **S** §10.7 | tel quel | Cycle d'attaque memory poisoning persistant à travers la compaction (SpAIware). À renvoyer ensuite vers le futur schéma **E4 (threat model unifié)** en Ch.19. |
| 07 | [`horizon`](../compaction-agentique/images/20260527-07-horizon.svg) | [![horizon](../compaction-agentique/images/20260527-07-horizon.svg)](../compaction-agentique/images/20260527-07-horizon.svg) | 7.4 Ko | **S** §10.9 | tel quel | Horizon 2026-2028 : compactors appris, multi-résolution, ledger transparent OTel. |

#### Schémas du dossier memoire-agentique (cross-ref, 9)

Tous appartiennent au **Ch.9 — Mémoire agentique** (Acte II). Listés ici pour vérifier les redondances et fixer les renvois.

| Fig | Slug | Catégorie Ch.9 | Renvoi depuis Ch.10 |
| --- | --- | --- | --- |
| 00 | [`exec-sum-a4`](../memoire-agentique/images/20260430-00-exec-sum-a4.svg) | annexe rapport (27.5 Ko) | non |
| 01 | [`cadrage-strategique`](../memoire-agentique/images/20260430-01-cadrage-strategique.svg) | S Ch.9 §1 | non |
| 02 | [`taxonomie-piliers`](../memoire-agentique/images/20260430-02-taxonomie-piliers.svg) | **R2 Ch.9** (récap 4 piliers) | ✅ renvoi dans §10.1 ouverture |
| 03 | [`cycle-de-vie`](../memoire-agentique/images/20260430-03-cycle-de-vie.svg) | S Ch.9 (6 opérations) | non |
| 04 | [`frameworks-matrice`](../memoire-agentique/images/20260430-04-frameworks-matrice.svg) | S Ch.9 (matrice frameworks) | non — la matrice production compaction §10.6 couvre |
| 05 | [`context-engineering`](../memoire-agentique/images/20260430-05-context-engineering.svg) | S Ch.9 | non |
| 06 | [`vendors-comparison`](../memoire-agentique/images/20260430-06-vendors-comparison.svg) | S Ch.9 (vendors mémoire) | non |
| 07 | [`surface-attaque`](../memoire-agentique/images/20260430-07-surface-attaque.svg) | S Ch.9 (MITRE ATLAS AML.T0080) | ⚠ **complémentaire** au `compaction-06-cycle-attaque` — voir §Redondances |
| 08 | [`roadmap`](../memoire-agentique/images/20260430-08-roadmap.svg) | S Ch.9 (roadmap 6/12/18 mois) | non |

### Redondances et complémentarités

**Pas de doublon vrai entre `compaction-agentique` et `memoire-agentique`**. Les deux dossiers sont **strictement complémentaires** :

| Sujet | `memoire-agentique` (Ch.9) | `compaction-agentique` (Ch.10) | Décision |
| --- | --- | --- | --- |
| Taxonomie générale | 4 piliers travail/sémantique/épisodique/procédurale | Approfondit le pilier *travail / scratchpad* | Ch.9 cartographie, Ch.10 approfondit un pilier |
| Surface d'attaque mémoire | `memoire-07-surface-attaque.svg` = MITRE ATLAS AML.T0080 (vue générale) | `compaction-06-cycle-attaque.svg` = cycle SpAIware spécifique au compactor | Les deux schémas restent — le Ch.10 cite le Ch.9 et ouvre vers le futur E4 (threat model unifié) en Ch.19 |
| Frameworks / vendors | `memoire-04` + `memoire-06` (mémoire long-terme : Letta, Mem0, Zep, A-MEM, Generative Agents) | `compaction-05` (compactors prod : Claude Code, Cursor, ChatGPT, Mem0, Letta) | Pas de doublon — l'angle est différent (mémoire vs compaction). Renvoi croisé possible mais pas indispensable. |
| Architectures cognitives | CoALA Sumers et al. TMLR 2024 | non couvert | Reste Ch.9 |
| Lost in the Middle | non couvert | Liu et al. TACL 2024 | Reste Ch.10 |

**Une seule absence notable, non bloquante** : pas de schéma de transition « Où agit la compaction dans la grille des 4 piliers mémoire ». Coût ≈ 1 h SVG. **Décision** : textualiser la transition via un encadré `> [!INFO] Voir Ch.9` plutôt que de créer un schéma redondant. Si l'éditeur le réclame en relecture, on le créera.

### Plan détaillé du chapitre

```
> [!QUESTION] Question d'ouverture
  Pourquoi 1 M tokens de fenêtre ne suffisent pas, et comment fait-on oublier
  un agent sans détruire sa cohérence ?

> [!TLDR] TL;DR décideur (5 lignes)

§10.1  De la mémoire à la compaction (transition Ch.9 → Ch.10)
       └─ encadré [!INFO] Voir Ch.9

§10.2  Pourquoi 1 M tokens de fenêtre ne suffisent pas
       ├─ [SVG S] mur-fenetre.svg
       ├─ La courbe en U de Liu et al. (TACL 2024)
       │  └─ encadré [!QUOTE] Liu et al.
       └─ Les contraintes économiques et de latence

§10.3  Anatomie de la compaction
       ├─ [SVG S] contrat-io.svg
       ├─ Le contrat I/O
       │  └─ encadré [!EXAMPLE] pseudo-code compact()
       └─ La policy comme première classe

§10.4  Cinq familles de stratégies
       ├─ [SVG S] cinq-familles.svg (après fix XML)
       ├─ Summarization LLM
       ├─ Eviction attention-based
       ├─ Hiérarchique avec paging
       ├─ Retrieval-augmentée
       ├─ Compactors appris
       └─ encadré [!ATTENTION] aucune dominante

§10.5  Le triangle fidélité × coût × oubliabilité
       ├─ encadré [!IMPORTANT] règle du triangle non-dégénéré
       ├─ Positionnement des 5 familles
       └─ Conséquence opérationnelle (B2C/B2B/streaming)

§10.6  Compaction en production
       ├─ [SVG S] matrice-production.svg
       └─ Trois observations transversales

§10.7  La surface d'attaque cachée
       ├─ [SVG S] cycle-attaque.svg
       ├─ Le cycle d'attaque memory poisoning persistant
       │  └─ encadré [!WARNING] SpAIware
       ├─ Pourquoi les filtres I/O ne suffisent pas
       └─ encadré [!INFO] Voir Ch.19 (E4 threat model unifié)

§10.8  RGPD, AI Act et l'oubli prouvable
       ├─ Trois cas de figure
       ├─ encadré [!NOTE] Rappel RGPD art.17
       ├─ encadré [!IMPORTANT] AI Act art.10 + 25
       ├─ Machine unlearning (CNIL/EDPS 2025-2026)
       └─ encadré [!INFO] Voir Ch.23 (gouvernance)

§10.9  Horizon 2026-2028
       ├─ [SVG S] horizon.svg
       ├─ Compactors appris (2026-2027)
       ├─ Multi-résolution (2026-2028)
       ├─ Ledger transparent et observabilité (2027-2028)
       │  └─ encadré [!INFO] Voir Ch.18 (WG GenAI OTel)
       └─ AI Act art.25 transforme observabilité en obligation

Récap chapitre — Le triangle non-dégénéré
       └─ [SVG R3] triangle-tradeoff.svg (pleine page A3 paysage)

> [!WARNING] Piège classique
  Faire confiance à /compact sur un agent à mémoire persistante sans signer
  les compactions — une injection paraphrasée 3 mois en arrière reste active.

Sources (12 footnotes du rapport)
```

### Encadrés prévus dans le chapitre

Variété des `> [!TYPE]` Obsidian retenus :

| Type | Usage | Compte |
| --- | --- | --- |
| `[!QUESTION]` | Ouverture chapitre | 1 |
| `[!TLDR]` | Synthèse décideur | 1 |
| `[!INFO]` | Renvois inter-chapitres (Ch.9, 18, 19, 23) | 4 |
| `[!QUOTE]` | Citation Liu et al. | 1 |
| `[!EXAMPLE]` | Pseudo-code contrat I/O | 1 |
| `[!ATTENTION]` | Pas de famille dominante | 1 |
| `[!IMPORTANT]` | Règle du triangle + AI Act art.10/25 | 2 |
| `[!NOTE]` | Rappel RGPD art.17 | 1 |
| `[!WARNING]` | SpAIware + piège classique | 2 |
| **Total** | | **14** |

### Tâches restantes Ch.10

- [x] Rédiger le manuscrit `docs/livre/ch10-compaction.md`
- [x] Corriger le bug XML `cinq-familles.svg` ligne 26 (`</title<` → `</text>`) — validé `xmllint --noout`
- [ ] Relecture Mathieu — passe critique sur le triangle (positionnement des familles relativement aux sommets) et sur l'encadré SpAIware
- [ ] Si validation : copier-coller la matière vers le futur format de sortie (print HTML / PDF) quand décidé

---

## Chapitre 4 — Décode spéculative et la course au token/sec

> **Acte I — Les moteurs · Gabarit standard 16-24 p · ~6 500-7 500 mots**
> **Lecteur cible** : agent engineer, plateforme ML, FinOps / acheteur infra, sponsor IA technique.
> **Sortie lecteur** : comprend pourquoi la décode est sériel et memory-bound (HBM/KV cache lus à chaque token, tensor cores sous-employés) ; lit l'anatomie draft / verify / accept-reject et sait pourquoi le théorème d'équivalence Leviathan-Kalman-Matias (ICML 2023) rend la spec acceptable sans débat qualité ; situe les 4 familles de variantes (draft externe Leviathan/Chen — têtes Medusa/Hydra — feature-level EAGLE 1/2/3 — Jacobi Lookahead) et le critère de choix entre elles ; comprend que l'acceptance rate α est **le** paramètre invisible — 75-85 % code, 60-70 % Q&A factuel, 40-50 % créatif, &lt; 30 % out-of-distribution → perte nette ; sait pourquoi l'instrumentation de α est devenue un indicateur de premier rang en 2026 (au même titre que p99 latency) ; identifie le second piège — l'interaction avec batching dynamique : maximal à batch 1 (memory-bound), s'effondre au-dessus de batch ≈ 24 (compute-bound saturé) ; lit la sophistication des schedulers hybrides 2025-2026 (vLLM 0.6 activation conditionnelle, TensorRT-LLM 0.9 deux schedulers parallèles, SGLang `speculation_threshold`) ; choisit entre les 4 frameworks dominants (vLLM / SGLang / TensorRT-LLM / DeepSpeed-MII) sur la maturité d'intégration scheduler, pas sur la disponibilité de variante ; reconnaît trois pièges 100 % traçables (activer la spec partout sans monitoring α / RFP au speedup peak / signature contrat 3 ans sur tokens/sec batch 1).

### Statut

| Étape | Statut |
| --- | --- |
| Audit schémas source (1 dossier) | ✅ fait — `decode-speculative/` (6 schémas SVG tous absorbés tels quels) |
| Plan détaillé | ✅ fait (audit du 2026-05-29) |
| Manuscrit | ✅ **v1 livrée** — `docs/livre/ch04-decode-speculative.md` (~6 800 mots, 6 schémas réutilisés, 14 encadrés Obsidian, 12 footnotes) |
| Schémas à créer | **0 ex nihilo**. Tous les schémas du dossier source sont absorbables tels quels avec hint Obsidian `\|1300` (full-bleed). |
| Frontière Ch.4 ↔ Ch.2 | À tenir — Ch.2 explique **pourquoi** on a besoin de compute à l'inférence (second axe de scaling, reasoning models) ; Ch.4 explique **comment** on regagne le débit perdu. Renvoi `[!INFO]` croisé en §4.1. |
| Frontière Ch.4 ↔ Ch.5 | À tenir — Ch.5 = pile 7 couches d'optim inference (PagedAttention, FlashAttention-3, batching continu, FP8/FP4, désagrégation, MoE) côté économie globale ; Ch.4 = zoom monographique sur **une** couche (la décode spéculative). Renvoi vers la matrice frameworks de Ch.5 + complément Ch.4 (matrice variantes × frameworks, **côte à côte**, **pas fusionnée** — décision outline). |
| Frontière Ch.4 ↔ Ch.21 | Légère — la spec n'a pas d'impact ROI direct, mais elle conditionne la mesure du *tokens/sec* utilisée comme proxy de coût. Renvoi non explicite. |
| Frontière Ch.4 ↔ Ch.18 | À tenir — l'instrumentation de α (acceptance rate par requête) entre dans le **cognitive audit trail** au sens Ch.18 (OTel GenAI semconv `gen_ai.speculative.acceptance_rate`, WG en cours fin 2026). Renvoi `[!INFO]` en §4.4. |

### Sources matérielles

Le Ch.4 est un **chapitre standard à un seul dossier source dense et techniquement homogène**. Pas de redondance externe massive — `decode-speculative` est le seul dossier qui traite la spéculation, et il le fait de bout en bout (théorème, anatomie, taxonomie, deux pièges, marché, horizon).

- **Dossier principal — [`decode-speculative/`](../decode-speculative/)** (22 mai 2026, étude #25) — théorème d'équivalence Leviathan-Kalman-Matias (ICML 2023), anatomie en 3 étapes (drafting / verification / accept-reject), 4 familles de variantes, formule du speedup conditionnée à α, 3 facteurs gouvernant α (domaine / température / drift), interaction batching, point de bascule batch ≈ 24, schedulers hybrides 2025-2026, matrice frameworks 4 vendeurs × variantes, 3 directions horizon 2026-2028 (RL-guided drafting / multi-draft mixture / ensemble verification).
  - [Rapport (.md, ~3 500 mots)](../decode-speculative/20260522-decode-speculative-rapport.md) · [App interactive](../decode-speculative/20260522-decode-speculative-app.html)
  - 6 schémas SVG dans [`images/`](../decode-speculative/images/), tous narratifs, tous absorbables

### Audit des schémas — Ch.4

| Fig | Slug | viewBox | Catégorie Ch.4 | Insertion | Statut |
| --- | --- | --- | --- | --- | --- |
| 01 | [`decode-sequentielle-vs-speculative`](../decode-speculative/images/20260522-01-decode-sequentielle-vs-speculative.svg) | 1200×760 | **S §4.2** | Anatomie temporelle : à gauche K forwards séquentiels (1 token/forward), à droite drafting + 1 verify parallèle | tel quel — **schéma d'ouverture mécanique** |
| 02 | [`arbre-tokens-tree-attention`](../decode-speculative/images/20260522-02-arbre-tokens-tree-attention.svg) | 1200×760 | **S §4.2.2** | Tree attention mask : matrice causale standard à gauche, masque tree à droite (branches concurrentes dans un même forward) | tel quel |
| 03 | [`taxonomie-variantes-speculation`](../decode-speculative/images/20260522-03-taxonomie-variantes-speculation.svg) | 1200×760 | **S §4.3 + Récap** | 4 familles côte à côte : draft externe / Medusa-Hydra / EAGLE / Lookahead, avec stratégie de drafting et trade-off VRAM × acceptance × entraînement | tel quel — **schéma signature** |
| 04 | [`acceptance-rate-domaine`](../decode-speculative/images/20260522-04-acceptance-rate-domaine.svg) | 1200×740 | **S §4.4** | α par domaine (code 75-85 / Q&A 60-70 / créatif 40-50 / OOD &lt; 30) avec seuil de perte nette à 30 % | tel quel |
| 05 | [`point-bascule-batch`](../decode-speculative/images/20260522-05-point-bascule-batch.svg) | 1200×720 | **S §4.5** | Speedup vs batch_size : pic à batch 1, dégradation autour de batch 24-32, perte nette à batch &gt; 48 | tel quel |
| 06 | [`matrice-frameworks`](../decode-speculative/images/20260522-06-matrice-frameworks.svg) | 1200×740 | **S §4.6** | vLLM × SGLang × TensorRT-LLM × DeepSpeed-MII contre 4 variantes spéculatives + maturité scheduler hybride | tel quel — **carte de décision frameworks** |

**Bilan audit Ch.4** : 6/6 schémas absorbés tels quels. 0 schéma écarté. 0 schéma à créer ex nihilo. Densité finale : ~1 schéma par 1 100 mots — rythme typique d'un chapitre standard à matière visuelle dense. ViewBox déjà standardisés (1200×~720-760), hint Obsidian `|1300` aligne sur la convention CLAUDE.md pour full-bleed.

### Redondances et complémentarités

**Pas de redondance interne** — un seul dossier, pas de chevauchement de matière. La discipline éditoriale numéro 1 est de **tenir la frontière avec Ch.5** : la spec est **une** couche de la pile 7-couches d'optim de Ch.5, mais elle mérite son propre chapitre parce qu'elle (a) repose sur un théorème mathématique qui mérite d'être explicité, (b) condense les deux pièges les plus traîtres de l'inference moderne (acceptance rate + batching), et (c) est devenue l'option par défaut des serveurs en 2026 — ce qui change la grille de mesure du tokens/sec.

**Décision outline réaffirmée** : matrice frameworks de Ch.4 (variantes spéculatives × 4 vendeurs) **ne pas fusionner** avec matrice frameworks d'`orchestration-agentique` (ADK ouverts vs vendeurs Ch.11/Ch.20). Couches différentes. À mettre **côte à côte** dans la version print, **séparées** en web.

### Encadrés prévus dans le chapitre

| Type | Usage | Compte |
| --- | --- | --- |
| `[!QUESTION]` | Ouverture | 1 |
| `[!TLDR]` | Synthèse décideur 5 bullets | 1 |
| `[!INFO]` | Renvois inter-chapitres (Ch.2, Ch.5, Ch.18) | 3 |
| `[!QUOTE]` | Citation Leviathan et al. ICML 2023 + 1 doc framework | 2 |
| `[!IMPORTANT]` | Le théorème d'équivalence + l'instrumentation α | 2 |
| `[!ATTENTION]` | Sampling cohérent draft/target + drift silencieux | 2 |
| `[!EXAMPLE]` | Formule de speedup + calcul (α=0.8 K=5 → 3.4×) | 1 |
| `[!NOTE]` | Pourquoi *zero-train* fait gagner Lookahead | 1 |
| `[!WARNING]` | Trois pièges classiques en clôture | 1 |
| **Total** | | **~14** |

### Tâches restantes Ch.4

- [x] Rédiger le manuscrit `docs/livre/ch04-decode-speculative.md` (~6 500-7 500 mots)
- [x] Audit schémas source (6/6 absorbables tels quels — pas de retouche nécessaire)
- [ ] Relecture Mathieu — passes critiques suggérées :
  - **(a) Formule de speedup §4.4** : la dérivation Leviathan est-elle assez explicite pour qu'un agent engineer puisse l'appliquer à son cas ?
  - **(b) Le piège batching §4.5** : le point de bascule batch ≈ 24-32 est-il bien dérivable depuis le memory-bound vs compute-bound ? Faut-il un encadré « calcul de seuil pour Llama-3.1-70B sur H100 » ?
  - **(c) Matrice frameworks §4.6** : la grille d'achat est-elle exploitable pour un FinOps qui négocie un contrat 12 mois sans connaître les détails d'EAGLE-3 ?
  - **(d) Pièges en clôture** : les trois pièges sont-ils tous traçables à des incidents/contrats observés en 2025-2026 ?
- [ ] Si validation : matière transposable vers le futur format de sortie (print HTML / PDF) quand décidé

---

### Tâches restantes globales livre

- [ ] Auditer les 18 dossiers restants (priorité : `economie-inference` Ch.5, `modeles-raisonnement` Ch.2, `mcp-plateforme` + `mcp-securite` Ch.12-13, `process-reward-models` Ch.3)
- [ ] Créer le schéma E4 (threat model unifié 2026) — ~4-6 jours, schéma le plus coûteux. **La verticale mémoire du Ch.9 §9.7 fournit déjà un cycle d'attaque + 4 niveaux mitigation utilisables pour le tronc commun.**
- [ ] Créer E3 (capability × cost) et R16 (J-curve × LLMflation) — ~2-3 j chacun
- [ ] Créer R1 (boucle ReAct canonique + 3 variantes) si édition print le demande — ~3-5 j (v1 du Ch.7 fait sans, par superposition textuelle)
- [ ] Créer R2 (4 piliers × 6 op × 5 archi triptyque fusionné) si édition print le demande — ~3-4 j (v1 du Ch.9 fait sans, par 3 schémas distincts + tableau récap markdown)
- [ ] Décider du format de sortie (print PDF / web interactif / les deux)
- [ ] Décider du calendrier de gel des contenus évolutifs
