# Désagrégation prefill/decode

Deep dive du dossier [`economie-inference`](../economie-inference/) sur la séparation des deux phases de l'inférence LLM en pools spécialisés.

> 15 juin 2026 — Mathieu Guglielmino

## Fichiers

- **`index.html`** — hub du dossier (point d'entrée).
- **`20260615-desagregation-prefill-decode-app.html`** — l'application illustrée interactive (schémas cliquables, glossaire au survol, sommaire et sources actifs). Ouvrir ce fichier dans un navigateur.
- **`20260615-desagregation-prefill-decode-rapport.md`** — le rapport complet en markdown (compatible Obsidian, images SVG en syntaxe `![alt|width](images/…)`).
- **`images/`** — les 6 schémas SVG éditoriaux.

## Thèse

La désagrégation prefill/decode fait passer le serving LLM d'un problème de *scheduling* sur GPU homogènes à un problème d'*architecture distribuée* : deux pools de calcul aux profils matériels opposés, reliés par un transfert de KV cache qui est à la fois le déverrouillage (goodput ×7) et le nouveau goulot d'étranglement.

7 sections · 6 schémas interactifs · 12 sources tier-1.
