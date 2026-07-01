# La Mixture-of-Experts — payer le savoir, pas le calcul

> 1er juillet 2026 — Mathieu Guglielmino

Deep dive du dossier *économie de l'inférence*. La Mixture-of-Experts (MoE) découple le nombre de paramètres du coût de calcul par token : elle laisse croître le savoir d'un modèle sans faire croître ses FLOPs, en échange d'une facture mémoire et communication.

## Contenu

- `20260701-mixture-of-experts-app.html` — application illustrée (rapport interactif : schémas cliquables, glossaire au survol, sommaire et sources actifs). Point d'entrée de lecture.
- `20260701-mixture-of-experts-rapport.md` — le rapport en markdown (compatible Obsidian), citations en notes de bas de page, schémas SVG en syntaxe `![alt|width](images/…)`.
- `images/` — les 7 schémas éditoriaux SVG.
- `index.html` — hub du dossier.

## Plan

1. Le découplage fondamental (dense vs sparse) · 2. Anatomie d'une couche MoE · 3. Le problème du routage · 4. La facture cachée (mémoire + all-to-all) · 5. Les innovations DeepSeek (fine-grained + shared) · 6. La sparsité, troisième axe d'échelle · 7. Le paysage MoE 2024-2026 · 8. Tensions et horizon.

12 sources tier-1 (Shazeer 2017, GShard, Switch Transformer, ST-MoE, Expert Choice, Mixtral, DeepSeekMoE, DeepSeek-V3, MegaBlocks, Sparse Upcycling, Krajewski et al. 2024, OLMoE).

*Format co-écrit avec l'aide d'une IA.*
