# Sécurité MCP — dix vecteurs d'attaque, dix patterns défensifs

> 20 mai 2026 — Mathieu Guglielmino

Approfondissement sécurité du dossier [`mcp-plateforme`](../mcp-plateforme/). Six trust boundaries, quatre familles d'attaque, une matrice défensive 10×10.

## Fichiers

- `index.html` — hub du dossier (carte d'entrée vers les formats)
- `20260520-mcp-securite-app.html` — application interactive (format de lecture)
- `20260520-mcp-securite-rapport.md` — rapport texte Markdown (admin only)
- `images/` — 7 schémas SVG éditoriaux

## Plan

1. La géométrie de la surface MCP
2. Famille A — Tool poisoning et description spoofing
3. Famille B — Prompt injection cross-document et exfiltration
4. Famille C — Cross-server confusion, namespace collisions, shadowing
5. Famille D — Transport, OAuth, supply chain
6. La matrice défensive — dix patterns
7. Roadmap 12 mois — ce qui change d'ici mai 2027
8. Pour qui builde un agent en 2026
