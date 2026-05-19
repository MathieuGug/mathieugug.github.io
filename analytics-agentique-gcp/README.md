# IA pour la data sur GCP

> 19 mai 2026 — Mathieu Guglielmino

Dossier sur l'anatomie de la stack data agentique sur Google Cloud Platform, lue à travers les contraintes d'une banque française tier 1.

## Thèse

Trois surfaces agentiques sur GCP — *conversational analytics* (Looker + BQ Data Canvas + Conv Analytics API), *agents custom* (Vertex Agent Builder / Gemini Enterprise Agent Platform / ADK), *MCP & connecteurs maison* (BQ MCP managed + MCP banque sur Cloud Run). Un point d'arbitrage central : **le semantic layer décide, pas le modèle.** Deux étages de contrainte bancaire en surplus : DORA (Google Cloud désigné CTPP), AI Act (échéance haut-risque 2 août 2026), EBA Outsourcing, BCBS 239, ACPR, souveraineté (Assured Workloads EU, S3NS Premi3NS SecNumCloud 3.2).

## Contenu du dossier

- **`20260519-analytics-agentique-gcp-app.html`** — l'application interactive (format long). Ouvrir dans un navigateur.
- **`20260519-analytics-agentique-gcp-rapport.md`** — le rapport markdown source, lisible dans Obsidian / GitHub / VS Code. Schémas SVG inclus en syntaxe Obsidian.
- **`images/`** — 9 schémas SVG éditoriaux.
- **`index.html`** — hub du dossier, exposé sur GitHub Pages.
- **`og.png`** — carte sociale 1200×630.

## Schémas

1. La falaise d'accuracy du NL→SQL — Spider 85 %, enterprise 10-20 %, +semantic 67-69 %, layer modélisé ~100 %
2. Chaîne data canonique sur GCP — cinq couches
3. Pyramide d'usage × cinq couches de chaîne — outils GCP par cellule (signature)
4. Semantic layer — avec et sans, en miroir
5. Anatomie d'un appel Conversational Analytics
6. Anatomie d'un data agent custom sur GCP — six couches verticales, sidebars gouvernance + observabilité
7. Topologie MCP banque interne — agents, host, MCP servers, backends
8. Du dashboard fixe à l'expérience narrative générative — trois formats
9. Matrice contrainte régulaire × couche stack data agentique

## Renvois aux dossiers complémentaires

- `coding-agents/` — anatomie d'un coding agent, pyramide d'usage à 4 étages
- `mcp-plateforme/` — effet de réseau MCP, surface d'attaque
- `evaluation-agentique/` — graders, LLM-as-judge, playbook gruyère
- `observabilite-agents-ia/` — OpenTelemetry GenAI, six piliers de télémétrie
- `narrative-experiences/` — état de l'art du data storytelling
- `surfaces-agentiques/` — quatre régimes d'accès utilisateur
- `gouvernance/` — scrollytelling AI Act, frameworks de gouvernance
- `measure-roi/` — frameworks ROI, paradoxe agentique

## Notes

- Format co-écrit avec l'aide d'une IA.
- 36 sources premium citées dans le panneau de l'app.
- Publié à titre personnel sur mathieugug.github.io.
