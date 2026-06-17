# Désagréger l'inférence

> 17 juin 2026 — Mathieu Guglielmino

Deep dive sur la **désagrégation prefill/decode** et l'**économie du KV cache** — prolongement des dossiers `economie-inference` et `decode-speculative`.

**Thèse** : la séparation des deux régimes de l'inférence LLM (prefill compute-bound, decode memory-bandwidth-bound) sur des pools de GPU distincts est devenue le principal levier économique du serving en production 2026, et fait du KV cache l'objet central qu'on transfère, mutualise et facture.

## Contenu du dossier

- **`index.html`** — hub d'entrée du dossier.
- **`20260617-desagregation-inference-app.html`** — application illustrée interactive (format principal) : 8 sections, 6 schémas SVG cliquables, glossaire au survol, sommaire et sources actifs. S'ouvre directement dans un navigateur.
- **`20260617-desagregation-inference-rapport.md`** — le rapport en markdown (compatible Obsidian), schémas en syntaxe `![alt|width](images/…)`, citations en notes de bas de page.
- **`images/`** — les 6 schémas éditoriaux SVG.

## Les six schémas

1. Deux régimes, pas un — prefill vs decode et l'asymétrie roofline.
2. Du monolithe à la flotte désagrégée — pools spécialisés + transfert KV.
3. Le KV cache, objet central — paging, partage de préfixes, offloading, pooling global.
4. État de l'art 2026 — matrice de huit systèmes × six dimensions.
5. Deux réponses rivales — chunked prefill vs désagrégation (cadre de décision).
6. Trajectoire 2022-2028 — quatre ères de l'inférence.

Publié à titre personnel. Format co-écrit avec l'aide d'une IA.
