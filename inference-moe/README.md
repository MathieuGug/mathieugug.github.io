# inference-moe — Servir un mélange d'experts

> 29 juillet 2026 — Mathieu Guglielmino

Deep dive prolongeant [`melange-experts`](../melange-experts/) : l'inférence MoE en production comme **problème de réseau**. Le poste dominant du décodage est le tout-à-tout qui achemine chaque token vers ses experts ; l'arbitrage porteur de 2026 est parallélisme d'experts (EP) contre parallélisme de tenseurs (TP), et le socle est le trio ouvert DeepEP / DeepGEMM / EPLB.

## Contenu

- `20260729-inference-moe-app.html` — **application illustrée** (format principal) : 8 sections, 7 schémas SVG interactifs, glossaire au survol, sommaire et sources actifs, zoom plein écran.
- `20260729-inference-moe-rapport.md` — le rapport complet en markdown (compatible Obsidian), citations en notes de bas de page. Masqué du hub (mode admin).
- `images/` — les 7 schémas SVG éditoriaux.

## Ouvrir

Double-cliquer `20260729-inference-moe-app.html` (aucun serveur requis). Le hub `index.html` aiguille vers les formats.

## Schémas

1. Anatomie d'une couche MoE en service
2. Le tout-à-tout, anatomie d'un goulot
3. EP · TP · DP : la grammaire du parallélisme
4. DeepEP lu serré
5. Le déséquilibre des experts
6. Deux régimes EP : prefill contre decode
7. Le paysage outillage 2026

Format co-écrit avec l'aide d'une IA.
