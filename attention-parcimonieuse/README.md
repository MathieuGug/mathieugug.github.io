# L'attention parcimonieuse entraînée

> 22 juillet 2026 — Mathieu Guglielmino

Deep dive prolongeant [Compresser le KV-cache](../compression-kv-cache/). Là où ce dernier réduisait la *taille* d'un cache déjà calculé, celui-ci attaque l'autre moitié du problème long-contexte : **ne pas calculer** l'attention sur la plupart des tokens.

**Thèse** — L'attention parcimonieuse a changé de nature : longtemps optimisation greffée à l'inférence (motifs fixes, éviction gloutonne), elle est devenue une propriété *entraînée* du modèle (NSA, MoBA, DeepSeek Sparse Attention). La parcimonie native est à l'éviction ce que MLA est à GQA.

## Contenu

- `20260722-attention-parcimonieuse-app.html` — l'application illustrée interactive (8 sections, 7 schémas cliquables, 29 régions, glossaire au survol, sommaire + sources actifs). Ouvre directement dans un navigateur.
- `20260722-attention-parcimonieuse-rapport.md` — le rapport en markdown (Obsidian-compatible), avec les 7 schémas SVG en syntaxe image et les sources en notes de bas de page.
- `images/` — les 7 schémas SVG éditoriaux.
- `index.html` — le hub du dossier.

## Ouvrir

Double-cliquer sur `20260722-attention-parcimonieuse-app.html`, ou passer par le hub `index.html`. Aucun serveur ni build : tout est autonome (hors Google Fonts).

*Format co-écrit avec l'aide d'une IA.*
