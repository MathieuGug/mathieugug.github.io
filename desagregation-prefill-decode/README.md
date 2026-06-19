# Désagréger l'inférence : prefill et decode

> 19 juin 2026 — Mathieu Guglielmino

Deep dive des dossiers [`decode-speculative`](../decode-speculative/) et [`economie-inference`](../economie-inference/) : la désagrégation prefill/decode, le tournant architectural du serving LLM 2024-2026.

## Contenu

- `index.html` — hub du dossier (point d'entrée).
- `20260619-desagregation-prefill-decode-app.html` — application illustrée (rapport interactif : 6 schémas cliquables, glossaire au survol, sommaire et sources actifs).
- `20260619-desagregation-prefill-decode-rapport.md` — rapport markdown (Obsidian-compatible, images SVG, citations en notes de bas de page).
- `images/` — 6 schémas éditoriaux SVG.

## Thèse

L'inférence d'un LLM fait coexister deux régimes de calcul antagonistes — le *prefill* (compute-bound) et le *decode* (memory-bound). Les co-loger sur la même machine fait que l'un sabote la latence de l'autre. La désagrégation les sépare sur des pools distincts et transporte le KV cache sur le réseau ; son rival n'est pas le statu quo mais le *chunked prefill* co-localisé (Sarathi-Serve).

## Format co-écrit avec l'aide d'une IA.
