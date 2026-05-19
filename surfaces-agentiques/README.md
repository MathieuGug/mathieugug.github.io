# Surfaces agentiques

> 18 mai 2026 — Mathieu Guglielmino

Étude sur les surfaces d'accès à un agent IA en 2026. Pendant frontend du dossier [*Agent SDK*](../agent-sdk/) : si *Agent SDK* répond à *« quel moteur ? »*, ce dossier répond à *« quelle surface ? »* — par quoi l'utilisateur final accède concrètement à un agent, et qu'est-ce qu'il faut construire pour que ça tienne.

## Thèse

Le chatbot est la prise minimale, pas la bonne forme. Quatre régimes d'accès à un agent ont émergé entre 2022 et 2026 — chat, copilote inline, canvas génératif, on-behalf-of — et le bon design commence par décider du régime *avant* de coder l'agent. AG-UI est le protocole qui standardise la prise (pendant frontend de MCP).

## Contenu du dossier

- **`20260518-surfaces-agentiques-app.html`** — l'application interactive (format long). Ouvrir dans un navigateur.
- **`20260518-surfaces-agentiques-rapport.md`** — le rapport markdown source, lisible dans Obsidian / GitHub / VS Code. Schémas SVG inclus en syntaxe Obsidian.
- **`images/`** — 10 schémas SVG éditoriaux.
- **`index.html`** — hub du dossier, exposé sur GitHub Pages.
- **`og.png`** — carte sociale 1200×630.

## Schémas

1. La pile d'accès — chat, inline, canvas, on-behalf-of
2. Le procès du chatbot — affordance, flow, articulation
3. Trois sub-modes inline — ghost text, sidebar, agent mode
4. Quatre régimes de generative UI
5. Surface du on-behalf-of — quatre questions UX
6. Trois piliers — MCP / A2A / AG-UI
7. Flux d'événements AG-UI
8. Cinq niveaux d'autonomie (Knight Institute)
9. Architecture canonique en cinq couches
10. Matrice de décision — quel régime pour quel cas

## Notes

- Format co-écrit avec l'aide d'une IA.
- 54 sources premium citées dans le panneau de l'app.
- Publié à titre personnel sur mathieugug.github.io.
