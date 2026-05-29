# Sommaire — Livre « Anatomie d'une IA agentique »

> **Manuscrit en cours de production.** État au 29 mai 2026. **23/25 chapitres v1 livrés.**
> Voir [`../livre-outline.md`](../livre-outline.md) pour la carte de bataille complète (4 actes, 25 chapitres, schémas R/E, gabarits, frontières inter-chapitres) et [`../journal-livre.md`](../journal-livre.md) pour les audits éditoriaux + tâches restantes par chapitre.

**Repère lecteur** : ✅ v1 livré · 🟡 v1 sur disque hors PR · ⏳ à écrire

---

## Prologue

- ⏳ **Prologue — Pourquoi un livre, maintenant**

## Acte I — Les moteurs

> _Couches du dessous de la pile. Avant la boucle, le modèle. Avant la conversation, un tirage probabiliste. Avant le débit en token/sec, un schedule de GPU._
> _Lecteur cible : expert data + acheteur infra/cloud._

| # | Chapitre | Gabarit | Mots |
|---|---|---|---|
| 1 | ✅ [Le cœur stochastique](ch01-coeur-stochastique.md) | encart 8-12 p | ~4 760 |
| 2 | ✅ [Les modèles de raisonnement et la seconde courbe de scaling](ch02-modeles-raisonnement.md) | standard 22 p | ~7 630 |
| 3 | ✅ [La couche notateur cachée (Process Reward Models)](ch03-process-reward-models.md) | standard 22 p | ~7 540 |
| 4 | ✅ [Décode spéculative et la course au token/sec](ch04-decode-speculative.md) | standard 22 p | ~6 590 |
| 5 | ✅ [L'économie unitaire de l'inférence (et son angle mort)](ch05-economie-inference.md) | standard 22 p | ~7 590 |
| 6 | ✅ [Bordure : world models et physique apprise](ch06-world-models.md) (encart) | encart 6-8 p | ~3 340 |

## Acte II — La boucle

> _Anneaux 01-04 (boucle, outils, contexte, patterns). C'est ici que se gagne ou se perd le ROI, et que se constitue la dette technique._
> _Lecteur cible : agent engineer, tech lead, architecte._

| # | Chapitre | Gabarit | Mots |
|---|---|---|---|
| 7 | ✅ [Reason · Act · Observe : le harness et ce qu'il enveloppe](ch07-boucle-agentique.md) (charnière) | charnière 28-40 p | ~9 510 |
| 8 | ✅ [Les outils (les mains de l'agent)](ch08-outils-de-lagent.md) | standard 22 p | ~6 140 |
| 9 | ✅ [Mémoire agentique : 4 piliers, 6 opérations, 5 architectures](ch09-memoire-agentique.md) | standard 22 p | ~6 900 |
| 10 | ✅ [Compaction et oubli stratégique](ch10-compaction.md) | standard 22 p | ~4 880 |
| 11 | ✅ [Patterns canoniques et orchestration multi-agents](ch11-patterns-orchestration.md) (charnière) | charnière 28-40 p | ~7 810 |

## Acte III — Les interfaces

> _Anneau 05 + surfaces. C'est par là que l'utilisateur final touche l'agent — et que se décide la friction d'adoption._
> _Lecteur cible : PM, designer, intégrateur, architecte plateforme._

| # | Chapitre | Gabarit | Mots |
|---|---|---|---|
| 12 | ✅ [MCP, le HTTP des agents](ch12-mcp-plateforme.md) | standard 22 p | ~5 550 |
| 13 | ✅ [Sécurité MCP : dix vecteurs × dix patterns](ch13-mcp-securite.md) | standard 22 p | ~5 570 |
| 14 | 🟡 [Surfaces agentiques : quatre régimes d'accès](ch14-surfaces-agentiques.md) | standard 22 p | ~10 370 |
| 15 | 🟡 [Computer use : le régime extrême](ch15-computer-use.md) | standard 22 p | ~7 530 |
| 16 | 🟡 [Analytics agentique : la stack data + IA en sectoriel régulé](ch16-analytics-agentique-banque.md) | standard 24 p | ~10 800 |

## Acte IV — Mesures et garde-fous

> _Anneaux 06-09 (guardrails, observabilité, runtime, governance). C'est ici que se gagne ou se perd la confiance du décideur._
> _Lecteur cible : décideur, sponsor, RSSI, DPO, FinOps, CDO._

| # | Chapitre | Gabarit | Mots |
|---|---|---|---|
| 17 | ✅ [Évaluer un agent (et débunker les leaderboards)](ch17-evaluation-benchmarks.md) (charnière) | charnière 28-40 p | ~11 050 |
| 18 | ✅ [Observabilité agentique et cognitive audit trail](ch18-observabilite-cognitive-audit-trail.md) | standard 22 p | ~6 000 |
| 19 | ✅ [Garde-fous, jailbreaking et sécurité globale](ch19-gardefous-securite-globale.md) (charnière) | charnière 28-40 p | ~6 720 |
| 20 | ✅ [Runtime managé et déploiement](ch20-runtime-manage.md) | standard 22 p | ~6 240 |
| 21 | ✅ [Mesurer le ROI (et le paradoxe agentique)](ch21-roi-paradoxe-agentique.md) (charnière) | charnière 28-40 p | ~8 530 |
| 22 | ✅ [Externalité énergétique : IA frugale](ch22-ia-frugale.md) | standard 22 p | ~8 120 |
| 23 | ✅ [Gouvernance : AI Act, banque, machine unlearning](ch23-gouvernance-ai-act.md) | standard 22 p | ~9 300 |
| 24 | ⏳ Société : IA et travail | standard 22 p | — |
| 25 | ⏳ Politique : procès Musk v. Altman | court encart 12 p | — |

## Épilogue

- ⏳ **Épilogue — Sept paris à dater 2027-2028**

---

## Schémas produits ex nihilo pour le livre

| ID | Schéma | Position | Statut |
|---|---|---|---|
| **S1.1** | [Softmax → T → top-p → tirage : la chaîne mécanique](../../livre/images/20260601-01-softmax-temperature-sampling-chain.svg) | Ch.1 §1.2 | ✅ v1 |
| **S1.2** | [Faisceau de 1 000 trajectoires à T=0,7](../../livre/images/20260601-02-variance-trajectoire-1000-rejouages.svg) | Ch.1 §1.3 | ✅ v1 |
| **E3** | [Capability × Cost : seconde courbe de scaling](../../livre/images/20260601-03-capability-vs-cost-e3.svg) | Ch.2 §2.4 (+ renvoi Ch.5, Ch.17) | ✅ v1 |
| **E5** | [PRM vs LLM-as-judge vs human eval](../../livre/images/20260601-04-prm-vs-judge-vs-human-e5.svg) | Ch.3 §3.7 (+ renvoi Ch.17) | ✅ v1 |
| E4 | Threat model unifié 2026 (modèle / prompt / mémoire / outil / protocole / surface) | Ch.19 §19.10 | 📝 textualisé (à graphiquer si édition print le réclame) |
| R16 | Productivity J-curve × LLMflation × paradoxe agentique | Ch.21 §21.2.3 / §21.7 (+ renvoi Ch.5) | ⏳ à créer (brief Ch.21) |
| R18 | Calendrier réglementaire 2026-2028 unifié | Ch.23 §23.2 (+ §23.10) | ⏳ à créer (brief Ch.23) |

Tous les autres schémas (R1-R15, R17, R19, E1, E2, E6) sont **réutilisés tels quels** depuis les dossiers source (`anatomie/`, `economie-inference/`, `orchestration-agentique/`, etc.). Voir [`../livre-outline.md`](../livre-outline.md) annexe A pour la liste exhaustive.

---

## Annexes

| | Annexe | Statut |
|---|---|---|
| A | Schémas à fusionner (registres R et E) | 🟡 partiel — voir [`../livre-outline.md`](../livre-outline.md) §A |
| B | Glossaire (extension de `anatomie/livre-data.js` CONCEPT_DEFS + ~30 entrées spécialisées) | ⏳ à compléter |
| C | Index des dossiers source (chronologique, 28 dossiers) | ⏳ à générer depuis `index.html` racine |
| D | Index des rôles (parcours de lecture par profil RSSI / FinOps / DPO / CDO / Agent Engineer) | ⏳ à compléter |
| | Cahier central « 6 schémas pour tout retenir » (E1-E6) | 🟡 4/6 prêts (E1, E2, E3 ✅, E5 ✅, E6) — E4 textualisé |

---

## Statistiques de production

- **Couverture chapitres** : 23 / 25 (92 %) + 3 manuscrits Ch.14-16 sur disque hors PR
- **Volume total chapitres committés** : ~157 000 mots sur 23 chapitres (~6 800 mots/chapitre en moyenne)
- **Footnotes Tier-A intégrées** : 300+ (cible 12-25 par chapitre standard, 25-50 par chapitre charnière)
- **Schémas réutilisés tels quels** : 60+ depuis les 28 dossiers source
- **Schémas créés ex nihilo pour le livre** : 4 (S1.1, S1.2, E3, E5) — restent E4 (textualisé), R16, R18

---

## Pour démarrer la lecture

| Profil | Parcours recommandé |
|---|---|
| **Agent engineer / tech lead** | Acte II en entier (Ch.7 → Ch.11), puis Ch.13, 18 en compléments. Ch.4 et Ch.5 pour l'économie de la pile. |
| **Décideur / CDO / Sponsor IA** | Prologue (quand disponible), Ch.11, 21, 23, 24, 25. TLDR de chaque chapitre Acte I pour le cadre. |
| **RSSI** | Ch.13, 19 (priorité), Ch.10, 15, 23 (compléments). Threat model unifié 2026 en Ch.19 §19.10. |
| **FinOps / acheteur infra** | Ch.5, 21, 22 (priorité), Ch.20 (compléments). Le triptyque tarifaire Ch.5 ↔ Ch.21 ↔ Ch.22. |
| **DPO** | Ch.10, 23 (priorité), Ch.18 (cognitive audit trail). |
| **PM / designer / intégrateur** | Acte III en entier (Ch.12 → Ch.16). Ch.6 en bordure si computer use ou robotique. |
| **Expert data / chercheur** | Acte I en entier (Ch.1 → Ch.6). Ch.3 et Ch.17 pour l'éval (PRM ↔ benchmarks). |
