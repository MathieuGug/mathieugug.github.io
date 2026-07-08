# Quantification des LLM — deep dive

> 8 juillet 2026 — Mathieu Guglielmino

Deep dive du dossier [IA embarquée](../ia-embarquee/) : la quantification des grands modèles de langage lue serré, comme une **bataille contre les valeurs aberrantes** (*outliers*).

## Contenu

- **`index.html`** — hub d'entrée du dossier.
- **`20260708-quantification-llm-app.html`** — l'application illustrée (8 sections, 7 schémas SVG cliquables, 32 régions, glossaire au survol, sommaire et sources actifs). Ouvrir dans un navigateur.
- **`20260708-quantification-llm-rapport.md`** — le rapport en markdown (compatible Obsidian), schémas référencés en syntaxe `![alt|width](images/…svg)`, citations en notes de bas de page.
- **`images/`** — les 7 schémas éditoriaux SVG.

## Thèse

Quantifier n'est pas tronquer la précision : c'est neutraliser une poignée de valeurs aberrantes qui concentrent l'essentiel de l'erreur. Chaque méthode sérieuse (LLM.int8, SmoothQuant, GPTQ, AWQ, rotations QuaRot/SpinQuant, QAT, ternaire natif) est une stratégie différente pour protéger, migrer ou dissoudre ces outliers — et sous 4 bits par poids, la qualité tombe d'une falaise que seules ces stratégies repoussent.

*Format co-écrit avec l'aide d'une IA.*
