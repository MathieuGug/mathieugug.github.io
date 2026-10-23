# Ce que l'agent n'a pas le droit de conclure

> 23 octobre 2026 — Mathieu Guglielmino

Dossier 54 du site. Piste éditoriale **D — data marketing & mesure** (avec débord C, outillage et anti-patrons de déploiement).

**Thèse.** La valeur d'un agent dans la chaîne de mesure marketing se situe du côté de la réfutation. L'inférence causale n'offre aucun jeu de validation où une erreur d'hypothèse se verrait : le contre-factuel n'a jamais été observé, donc un plan d'identification faux sort sous la forme d'un chiffre bien formé. La batterie de tests qui met un résultat en doute a la propriété inverse — mécanique, énumérable, vérifiable par un tiers — et elle est la première sacrifiée faute de temps humain. Corollaire opérationnel : le livrable d'un agent de mesure est une spécification pré-enregistrée, signée et rejouable, pas un chiffre.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Hub du dossier — point d'entrée, liste les formats |
| `20261023-agent-de-mesure-app.html` | Application illustrée : rapport interactif, 7 schémas cliquables (36 régions), glossaire au survol, sommaire et sources en panneaux |
| `20261023-agent-de-mesure-rapport.md` | Rapport markdown, compatible Obsidian (notes de bas de page, `![alt\|1200](images/…)`) |
| `images/*.svg` | Les sept schémas éditoriaux, également embarqués en ligne dans l'application |
| `og.png` | Carte social 1200×630 générée par `tools/og-card.py` |

## Ouvrir

Double-cliquer sur `20261023-agent-de-mesure-app.html` : la page est autonome, sans serveur ni étape de compilation. Seules dépendances externes : Google Fonts et la bibliothèque partagée `/assets/dossier-app.{js,css}` du site.

## Schémas

1. **La chaîne de mesure rangée par détectabilité de l'erreur** — six maillons croisés avec l'appétence de délégation déclarée, la détectabilité d'une erreur et sa réversibilité.
2. **Deux chaînes, un seul contre-factuel observable** — la boucle de validation en prédiction, son absence en mesure causale, et ce que cette absence coûte sur 663 expériences.
3. **Neuf tâches rangées par ce qu'un contrôle automatique peut attraper** — trois bandes : déléguer, déléguer sous revue, verrouiller.
4. **Le jardin aux sentiers qui bifurquent, à l'échelle machine** — quatre bifurcations à trois branches, quatre-vingt-une spécifications, et les deux contre-mesures.
5. **Le poste de travail de la réfutation** — six tests, ce que chacun attrape, son coût à la main, son caractère délégable.
6. **Le circuit de signature** — trois artefacts, qui les écrit, qui les signe, qui peut les rejouer.
7. **Un palier d'autonomie par maillon** — quatre paliers × six maillons, et la condition vérifiable de montée.

## Sources porteuses

- Gordon, Moakler, Zettelmeyer, « Close Enough? », *Marketing Science* 42(4), 2023 — 663 expériences, erreur médiane 83/58/24 % selon l'étage du tunnel.
- Sharma, Kıcıman, « DoWhy », 2020 — les quatre temps modéliser / identifier / estimer / réfuter.
- Gelman, Loken, « The garden of forking paths », Columbia, 2013 — l'inflation du taux de faux positifs sans intention de tricher.
