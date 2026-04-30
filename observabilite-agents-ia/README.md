# Observabilité des agents IA

> **Du monitoring au cognitive audit trail — état de l'art, architecture de référence, cartographie du marché et feuille de route 2026.**
>
> 30 avril 2026 — Mathieu Guglielmino

## Contenu de ce dossier

| Fichier | Description |
|---|---|
| `20260430-observabilite-agents-ia-rapport.md` | Le rapport complet, en Markdown (compatible Obsidian). Référence les schémas SVG via `images/`. |
| `20260430-observabilite-agents-ia-app.html` | L'application compagnon interactive. **Ouvrez-la d'un double-clic** dans votre navigateur. |
| `images/` | Les 8 schémas SVG en style éditorial. Référencés depuis le Markdown. |
| `README.md` | Ce fichier. |

## Pour utiliser le rapport en Markdown

Le fichier `20260430-observabilite-agents-ia-rapport.md` est compatible Obsidian. Les images sont référencées avec la syntaxe `![alt|width](images/...svg)`. Si vous l'ouvrez dans un autre éditeur Markdown, l'attribut `|width` peut s'afficher comme du texte — sans gravité.

## Pour utiliser l'application compagnon

1. Double-cliquez sur `20260430-observabilite-agents-ia-app.html` — elle s'ouvre dans votre navigateur par défaut, sans serveur ni installation.
2. Le rapport s'affiche au centre, le sommaire à gauche, les sources à droite.
3. **Schémas interactifs** : cliquez sur les éléments d'un schéma (planner, executor, ères, piliers, vendors…) pour ouvrir un panneau de détail. Chaque schéma expose entre 4 et 15 régions cliquables (~50 modales au total).
4. **Termes techniques** : les termes soulignés en pointillés (TTFT, LLM-as-judge, MCP) ont une définition au survol — ou au tap sur mobile.
5. **Sources** : cliquez sur les numéros `[1]`, `[2]`… dans le texte pour mettre en évidence la source correspondante dans le panneau de droite.
6. Sur mobile, les panneaux Sommaire et Sources se replient — utilisez les boutons en haut.

## Structure méthodologique

- **9 sections** organisées en 4 parties principales : cadre épistémologique, instrumentation OTel, architecture & boucles de correction, cartographie marché & feuille de route
- **8 schémas** SVG, chacun avec 4 à 15 régions interactives (≈ 6 en moyenne)
- **22 sources** premium :
  - **8 institutionnelles/normatives** — OpenTelemetry (specs et blog), IBM, Anthropic, Gartner Magic Quadrant 2025
  - **6 vendors et plateformes** — Dynatrace, Datadog, Splunk, Grafana, Langfuse, Braintrust
  - **8 publications industrielles** — Kore.ai, Voiceflow, Groundcover, N-iX, GetMaxim, OneUptime, InsightFinder, Traceloop/OpenLIT
- **3 termes techniques** définis dans le glossaire interactif (TTFT, LLM-as-judge, MCP)

## Sources principales agrégées

Ce livrable consolide trois rapports de recherche internes produits début avril 2026 :

- *Observabilité des agents IA* — deep research initial (3 avril)
- *OpenTelemetry GenAI — état de l'art* — focus sur les conventions sémantiques et patterns d'instrumentation (3 avril)
- *Dynatrace et ses concurrents — vendor landscape* — analyse comparative des incumbents APM et challengers AI-native (7 avril)

Le présent rapport restructure ces matériaux selon une architecture éditoriale unifiée et y ajoute la couche illustrée.

## Notes techniques

- Les schémas SVG dans `images/` sont les fichiers source. Ils sont également intégrés *inline* dans l'application HTML pour permettre l'interactivité, ce qui crée une duplication assumée (~170 KB pour le HTML).
- L'application HTML fonctionne hors-ligne, à l'exception des polices Google Fonts (Spectral / Inter / JetBrains Mono) chargées depuis le CDN Google. Sans connexion, des polices système prennent le relais — la lisibilité reste correcte.
- Aucune télémétrie, aucun tracker, aucun script tiers en dehors des polices.
- Conventions OpenTelemetry GenAI référencées : v1.37+ (statut expérimental en avril 2026, transition vers stable prévue S2 2026).

---

*Généré avec le skill `illustrated-deep-research`.*
