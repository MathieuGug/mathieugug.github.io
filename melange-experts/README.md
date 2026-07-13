# Le mélange d'experts

> 3 juillet 2026 — Mathieu Guglielmino

Deep dive du dossier *économie de l'inférence* : le mélange d'experts (MoE) découple la **capacité** d'un modèle (paramètres totaux) de son **coût de calcul** (paramètres activés par token) — mais il déplace la difficulté vers le routage, l'équilibrage de charge et le parallélisme d'experts, transformant un problème d'architecture en un problème de systèmes distribués.

## Contenu du dossier

- **`index.html`** — hub d'entrée (présentation + accès au format).
- **`20260703-melange-experts-app.html`** — l'application illustrée : rapport long-form, 7 schémas SVG cliquables (28 régions avec modals), glossaire au survol, sommaire et sources actifs, zoom plein écran. S'ouvre directement dans un navigateur, sans serveur.
- **`20260703-melange-experts-rapport.md`** — le rapport complet en markdown (compatible Obsidian), citations en notes de bas de page, images SVG référencées. *Annexe masquée par défaut (mode admin).*
- **`images/`** — les 7 schémas éditoriaux SVG.

## Les 8 sections

1. La bascule capacité / calcul
2. Anatomie d'une couche MoE
3. Le problème du routage
4. L'équilibrage de charge — le collapse et ses parades
5. Le mur des systèmes
6. Servir un modèle creux — l'asymétrie mémoire / calcul
7. Le paysage 2024-2026
8. Trajectoires 2026-2028

14 sources tier-1 (Shazeer 2017, GShard, Switch, ST-MoE, Expert-Choice, Clark 2022, DeepSpeed-MoE, MegaBlocks, Mixtral, DeepSeekMoE, DeepSeek-V3, OLMoE, Llama 4, Qwen3).

*Format co-écrit avec l'aide d'une IA.*
