# L'économie du KV-cache

> 24 juin 2026 — Mathieu Guglielmino

Deep dive des dossiers `economie-inference` et `decode-speculative` : pourquoi le KV-cache est devenu la ressource rare qui gouverne l'inférence LLM, et les systèmes bâtis pour le gérer — pagination (PagedAttention), partage de préfixes (RadixAttention), désagrégation prefill/decode (DistServe, Splitwise, Mooncake) et compression (GQA/MQA, MLA, quantization, éviction).

## Contenu du dossier

- **`index.html`** — hub d'entrée (présentation + accès au format).
- **`20260624-kv-cache-app.html`** — application illustrée autonome : 8 sections, 7 schémas SVG cliquables (29 régions à modal), glossaire au survol, sommaire et sources actifs. S'ouvre directement dans un navigateur, sans serveur.
- **`20260624-kv-cache-rapport.md`** — rapport complet en markdown (compatible Obsidian), schémas en syntaxe `![alt|width](images/…)`, citations en notes de bas de page. Masqué du hub (mode admin).
- **`images/`** — les 7 schémas SVG éditoriaux.

## Thèse

L'inférence LLM est passée d'un problème de calcul à un problème de mémoire : le KV-cache en est l'unité de compte. Les systèmes de service modernes (vLLM, SGLang, Mooncake) ne se distinguent pas par leurs noyaux de calcul mais par la manière dont ils allouent, partagent, transfèrent et compriment ce cache.

_Format co-écrit avec l'aide d'une IA._
