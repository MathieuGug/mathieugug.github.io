# L'économie unitaire de l'inférence

> 6 mai 2026 — Mathieu Guglielmino

Étude approfondie sur l'économie de l'inférence LLM en 2026 : courbe LLMflation (×1 000 en trois ans), anatomie du coût d'une seconde-GPU, pile d'optimisation logicielle (PagedAttention, FlashAttention-3, FP8/FP4, speculative decoding, prefix caching), désagrégation prefill/decode (Splitwise, Mooncake, DistServe), arbitrage MoE vs dense, mix matériel (H100 / B200 / MI300X / Trainium 2 / Groq LPU), marges fragiles des fournisseurs et angle mort des reasoning models.

## Comment ouvrir

- **Application illustrée (recommandé)** : ouvrir `20260506-economie-inference-app.html` dans un navigateur (double-clic). Aucun serveur requis. Sommaire à gauche, sources à droite (repliables sur desktop), 7 schémas SVG cliquables avec 54 régions interactives, glossaire au survol des termes pointillés, plein écran via le bouton ⛶ au survol de chaque figure.
- **Version texte** : `20260506-economie-inference-rapport.md` — markdown compatible Obsidian, citations en notes de bas de page, schémas embarqués via `![alt|width](images/...svg)`.
- **Hub d'entrée** : `index.html` — page de présentation du dossier avec les deux formats.

## Structure du dossier

```
economie-inference/
├── index.html                                  # hub d'entrée
├── 20260506-economie-inference-app.html        # application illustrée
├── 20260506-economie-inference-rapport.md      # rapport markdown
├── README.md                                   # ce fichier
└── images/
    ├── 20260506-01-llmflation-curve.svg          # courbe $/Mtok 2021-2026
    ├── 20260506-02-anatomie-appel.svg            # prefill / decode / KV cache
    ├── 20260506-03-pile-optimisation.svg         # 7 couches, ×14 cumulé
    ├── 20260506-04-desagregation.svg             # prefill / decode / KV bus
    ├── 20260506-05-moe-vs-dense.svg              # matrice VRAM × FLOPs
    ├── 20260506-06-mix-materiel.svg              # H100/H200/B200/MI300X/Trainium2/Groq
    └── 20260506-07-reasoning-cost.svg            # AIME accuracy × $/résolution
```

## Sommaire du rapport

1. Synthèse exécutive
2. La chute d'un facteur 1 000
3. Anatomie d'un appel d'inférence
4. La pile d'optimisation logicielle
5. Désagréger prefill et decode
6. MoE — la nouvelle économie de l'inférence
7. Le mix matériel — Hopper, Blackwell et alternatives
8. Marge fragile et angle mort des reasoning models
9. Outlook 12-24 mois

## Format

Étude · 9 sections · 7 schémas · 54 régions interactives · 13 sources premium · ~6 500 mots.

Format co-écrit avec l'aide d'une IA.
