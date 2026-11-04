# La part qu'on garde

> 4 novembre 2026 — Mathieu Guglielmino

Dossier 56. L'assurabilité du risque agentique, côté européen : ce que la directive (UE) 2024/2853
couvre réellement à partir du 9 décembre 2026, ce qu'elle laisse dehors, et pourquoi la part de risque
qui reste au déployeur n'est transférée ni à son fournisseur ni à son assureur.

## Contenu du dossier

| Fichier | Rôle |
|---|---|
| `index.html` | Hub d'entrée du dossier |
| `20261104-assurabilite-agentique-app.html` | Application illustrée : 11 sections, 7 schémas interactifs, 32 régions cliquables, 22 sources |
| `20261104-assurabilite-agentique-rapport.md` | Rapport markdown (Obsidian), schémas référencés en externe |
| `images/*.svg` | Les sept schémas éditoriaux |
| `og.png` | Carte sociale 1200×630 générée par `tools/og-card.py` |

## Thèse

Le risque agentique se conserve par défaut. Trois mouvements simultanés le produisent : la directive
qui s'applique en décembre 2026 ne bénéficie qu'aux personnes physiques et exclut les biens et données
à usage professionnel ; la proposition de directive sur la responsabilité en matière d'IA a été retirée
le 6 octobre 2025 ; et le marché de l'assurance retire la couverture non affirmative par avenant.
La décision qui reste est une décision de rétention : plafonner l'exposition par conception, nommer
la part conservée, la provisionner, et lui donner un propriétaire.

## Piste éditoriale

Piste **B** — cas d'usage métier & ROI mesurable, avec débord sur la piste A (gouvernance).
Entrée du backlog ajoutée le 2026-08-02 depuis `agent-engage-entreprise`.

## Régénérer le bloc SEO

```
python tools/seo_dossiers.py --only assurabilite-agentique
```
