# Désagréger l'inférence : prefill et decode sur deux pools

> 29 juin 2026 — Mathieu Guglielmino

Deep dive du dossier [KV-cache](../kv-cache/) sur la **désagrégation prefill/decode** : séparer les deux phases de l'inférence LLM — prefill *compute-bound*, decode *memory-bound* — sur des pools de GPU distincts, en transférant le KV-cache de l'un à l'autre.

## Contenu

- `index.html` — hub d'entrée du dossier.
- `20260629-desagregation-prefill-decode-app.html` — **application illustrée** (format principal) : 8 sections, 7 schémas SVG cliquables, glossaire au survol, sommaire et sources interactifs. Ouvre directement depuis le disque (`file://`), sans serveur.
- `20260629-desagregation-prefill-decode-rapport.md` — le rapport complet en markdown (Obsidian-compatible), citations en notes de bas de page. Masqué du hub par défaut (mode admin).
- `images/` — les 7 schémas SVG éditoriaux.

## Fil conducteur

Le goodput sous double SLO (DistServe), l'anatomie d'un système désagrégé, le placement par phase (DeepSeek-V3 : prefill EP32 vs decode EP144), le coût du transfert KV (RDMA/NVLink/NIXL), le débat désagrégation contre chunked prefill (Sarathi-Serve), et la cartographie de la production (Mooncake, Splitwise, NVIDIA Dynamo, llm-d).

*Format co-écrit avec l'aide d'une IA.*
