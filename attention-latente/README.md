# L'attention latente, lue serré — MLA (Multi-head Latent Attention)

> 24 juillet 2026 — Mathieu Guglielmino

Deep dive prolongeant [`compression-kv-cache`](../compression-kv-cache/) (suite « MLA lue très serré »). Là où ce dernier traitait MLA comme un étage parmi trois, celui-ci ouvre l'étage du milieu et le lit ligne à ligne : la dérivation exacte (compression latente conjointe, RoPE découplé, absorption des matrices), la comparaison chiffrée MLA vs GQA à budget cache égal, les kernels (FlashMLA), et la conversion universelle (TransMLA).

**Thèse.** MLA n'est pas une compression du cache de plus greffée au service : c'est une reparamétrisation entraînée de l'attention où un vecteur latent par token remplace toutes les paires clé/valeur, et où l'absorption des matrices rend gratuit à l'inférence le surcoût de re-projection — d'où son statut de choix d'architecture d'attention 2026.

## Contenu du dossier

- `index.html` — hub d'entrée (présentation + accès au format).
- `20260724-attention-latente-app.html` — **application illustrée** : 8 sections, 7 schémas SVG cliquables (33 régions), glossaire au survol, sommaire et sources actifs. S'ouvre directement dans un navigateur.
- `20260724-attention-latente-rapport.md` — rapport markdown (Obsidian-compatible), citations en notes de bas de page. Masqué du hub par défaut (révélé en mode admin).
- `images/` — les 7 schémas SVG éditoriaux.

## Les 7 schémas

1. Le KV-cache par token de MHA à MLA (échelle logarithmique).
2. Anatomie d'une couche MLA (down-projection → latent caché → up-projections).
3. Le piège RoPE et la parade du découplage.
4. L'absorption des matrices (naïf vs absorbé).
5. MLA déplace le front de Pareto qualité × mémoire.
6. Du papier au silicium : DeepSeek-V3, FlashMLA, cache paginé.
7. Trajectoires : MLA comme point de convergence 2026.

## Sources clés

DeepSeek-V2 (arXiv:2405.04434) · DeepSeek-V3 (arXiv:2412.19437) · TransMLA (arXiv:2502.07864, NeurIPS 2025) · FlashMLA (github.com/deepseek-ai/FlashMLA). 11 sources tier-1 au total.
