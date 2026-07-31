# pagination-kv-cache — Le KV-cache comme mémoire virtuelle

> 31 juillet 2026 — Mathieu Guglielmino

Deep dive prolongeant [`kv-cache`](../kv-cache/) (suite c « PagedAttention / RadixAttention en détail »). Thèse : la gestion du KV-cache a cessé d'être de l'allocation mémoire pour devenir de la **mémoire virtuelle** — PagedAttention importe la pagination de l'OS (blocs, table de blocs, copie-sur-écriture), RadixAttention y ajoute le partage automatique de préfixes, et ce substrat a rendu possible le *prompt caching* facturé −90 %. La limite structurelle nouvelle est le **mur du préfixe** (RAG), que CacheBlend et la hiérarchie mémoire tentent de franchir.

## Contenu

- `index.html` — hub d'entrée du dossier.
- `20260731-pagination-kv-cache-app.html` — application illustrée (7 schémas cliquables, 28 régions, glossaire, sommaire, sources). **Format principal.**
- `20260731-pagination-kv-cache-rapport.md` — rapport markdown (Obsidian-compatible), masqué du hub (mode admin).
- `images/` — 7 schémas SVG éditoriaux.

## Ouvrir

Ouvrir `index.html` (ou directement l'application) dans un navigateur. Aucune dépendance hors Google Fonts.

## Plan (7 sections)

1. Un tableau contigu qui gaspille 60 à 80 %
2. PagedAttention : importer la mémoire virtuelle
3. Copie-sur-écriture : partager puis diverger
4. RadixAttention : du partage intra-requête au partage inter-requêtes
5. APC en production : le hash chaîné
6. L'économie du *prompt caching*
7. Le mur du préfixe et la hiérarchie mémoire
