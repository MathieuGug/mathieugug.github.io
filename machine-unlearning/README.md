# machine-unlearning · l'oubli prouvable au niveau des poids

> 3 juin 2026 — Mathieu Guglielmino

Dossier court (≈ 6 500 mots, 6 schémas, 12 sources tier-1) sur le passage du *machine unlearning* du registre académique à celui du contrôle régulatoire opposable.

## Thèse

À partir d'août 2026, RGPD article 17 + AI Act article 10 + recommandations CNIL de juin 2025 imposent aux déployeurs IA de prouver qu'un modèle a oublié, sans rejouer son entraînement. Les méthodes 2023-2026 (SISA, NPO, RMU, influence functions + LoRA) couvrent le besoin opérationnel mais échouent sous les *relearning attacks* (REBEL : 93 % de récupération sur WMDP) et les MIA statistiques. L'unlearning devient un sujet d'audit, pas seulement d'ingénierie.

## Formats

- [`index.html`](index.html) — hub
- [`20260603-machine-unlearning-app.html`](20260603-machine-unlearning-app.html) — application interactive (7 sections, 6 schémas zoomables avec zones cliquables, sidebars sommaire + sources, tooltips sur termes techniques)
- [`20260603-machine-unlearning-rapport.md`](20260603-machine-unlearning-rapport.md) — rapport markdown (mode admin uniquement)

## Schémas

1. Carte régulatoire 2024-2028 (EDPB Opinion, CNIL juin 2025, AI Act art. 10, horizon contrôles 2027-2028)
2. Trois couches d'oubli (RAG · fine-tune · poids) — coût, garantie, périmètre régulatoire
3. Taxonomie 4 familles (SISA exact / NPO gradient / RMU representation / influence functions + LoRA)
4. Matrice benchmarks × garanties (TOFU / WMDP / MUSE / OpenUnlearning vs verbatim/paraphrase/inférence/membership)
5. Matrice attaques × familles (REBEL, benign relearning, SMIA, Apollo) — taux de récupération
6. Pipeline d'audit canonique (forget set → unlearning → SMIA → relearn probe → distillation + certification)

## Recoupements avec d'autres dossiers du site

- [`compaction-agentique`](../compaction-agentique/) — l'oubli **sélectif** dans le contexte d'une session, là où ce dossier vise l'oubli **structurel** dans les poids.
- [`donnees-synthetiques`](../donnees-synthetiques/) — le *model collapse* y est traité comme un risque ; ici il devient une primitive constructive d'oubli (Distillation Robustifies Unlearning, arXiv 2506.06278).
