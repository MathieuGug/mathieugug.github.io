# Désagréger l'inférence : prefill et decode séparés

> 22 juin 2026 — Mathieu Guglielmino

Deep dive des dossiers *économie de l'inférence* et *décodage spéculatif* : pourquoi le serving LLM à grande échelle sépare les deux phases de l'inférence — un prefill compute-bound et un decode memory-bound — sur des pools de GPU distincts, pour supprimer l'interférence qui plafonne le goodput sous SLO.

## Contenu

- `index.html` — hub du dossier (point d'entrée).
- `20260622-desagregation-prefill-decode-app.html` — l'application illustrée (rapport interactif : schémas cliquables, glossaire au survol, sommaire et sources actifs).
- `20260622-desagregation-prefill-decode-rapport.md` — le rapport markdown (compatible Obsidian, schémas SVG inclus, citations en notes de bas de page).
- `images/` — les 7 schémas éditoriaux SVG.

## Thèse

La désagrégation prefill/decode est passée du papier de recherche (DistServe, Splitwise, Mooncake) au standard de fait du serving (NVIDIA Dynamo, vLLM) entre 2024 et 2026. Elle n'est pourtant rentable qu'au-dessus d'un seuil de charge et de longueur de contexte ; en dessous, le prefill découpé en colocation (Sarathi-Serve) reste compétitif.

Format co-écrit avec l'aide d'une IA.
