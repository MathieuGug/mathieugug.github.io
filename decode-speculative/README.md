# Décode spéculative en production

> 22 mai 2026 — Mathieu Guglielmino

Dossier technique sur la décode spéculative — la technique d'inférence qui permet de générer plusieurs tokens par forward du gros modèle, sans changer la sortie. Du papier fondateur (Leviathan, Chen 2023) à l'option par défaut des frameworks de serving en 2026.

## Thèse

La décode spéculative livre 2× à 4× sur le temps par token sans modifier la sortie du modèle. Mais son gain réel dépend de deux paramètres invisibles : l'acceptance rate (qui s'effondre dès que le draft sort de sa distribution d'entraînement) et l'interaction avec le batching dynamique (le speedup s'effondre au-delà d'un certain `batch_size`). L'optimisation d'un déploiement spéculatif en 2026 n'est plus le choix de la variante, c'est le calibrage du seuil de désactivation conditionnelle.

## Contenu du dossier

- **`20260522-decode-speculative-app.html`** — l'application interactive (format long). Ouvrir dans un navigateur.
- **`20260522-decode-speculative-rapport.md`** — le rapport markdown source, lisible dans Obsidian / GitHub / VS Code. Schémas SVG inclus en syntaxe Obsidian.
- **`images/`** — 6 schémas SVG éditoriaux.
- **`index.html`** — hub du dossier, exposé sur GitHub Pages.
- **`og.png`** — carte sociale 1200×630.

## Schémas

1. Décode séquentielle vs spéculative — anatomie temporelle (draft / verify / accept)
2. L'arbre de tokens spéculatifs et le tree attention mask
3. Taxonomie des quatre familles — draft externe / Medusa / EAGLE / Lookahead
4. Acceptance rate × domaine — où la spéculation paie, où elle casse
5. Le point de bascule speedup vs batch size
6. Matrice frameworks × variantes spéculatives (vLLM, SGLang, TensorRT-LLM, DeepSpeed-MII)

## Notes

- Format co-écrit avec l'aide d'une IA.
- 12 sources premium citées dans le panneau de l'app (Leviathan, Chen DeepMind, Cai/Medusa, Li/EAGLE 1/2/3, Fu/Lookahead, vLLM SOSP, survey Xia et al., NVIDIA TRT-LLM, SGLang, Together AI, Hydra).
- Publié à titre personnel sur mathieugug.github.io.
