# La désagrégation prefill / decode

> 12 juin 2026 — Mathieu Guglielmino

Deep dive du dossier *économie de l'inférence* : pourquoi séparer le prefill (compute-bound) et le decode (memory-bound) en pools matériels distincts re-optimise chaque phase, débloque 2 à 7× de *goodput* sous SLO, et fait du KV cache le centre de gravité du système d'inférence.

## Contenu

- `index.html` — hub d'entrée du dossier.
- `20260612-desagregation-prefill-decode-app.html` — l'application illustrée (rapport interactif : schémas cliquables, glossaire au survol, sommaire et sources actifs). **Ouvrir ce fichier dans un navigateur** (double-clic, aucun serveur requis).
- `20260612-desagregation-prefill-decode-rapport.md` — le rapport en markdown (compatible Obsidian, citations en notes de bas de page).
- `images/` — les 7 schémas éditoriaux SVG.

## Schémas

1. Deux charges antagonistes (roofline)
2. Anatomie d'un serveur désagrégé
3. Le KV cache, centre de gravité
4. Goodput vs throughput
5. Désagréger ou multiplexer (continuum chunked prefill)
6. Qui désagrège quoi — état de l'art 2026
7. Trajectoires 2026-2028
