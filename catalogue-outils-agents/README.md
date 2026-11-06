# Personne ne possède l'outil

> 6 novembre 2026 — Mathieu Guglielmino

Dossier de recherche illustré sur le **catalogue d'outils d'un agent comme produit interne**.
Piste éditoriale **C** (plateformes, outillage et pièges de déploiement), avec un débord sur la piste A.

**Thèse.** Un agent n'exerce aucune autorisation autrement qu'en appelant un outil : le catalogue
d'outils est la seule surface où une politique d'entreprise s'applique vraiment. Ce catalogue n'est
pourtant le produit de personne — le modèle de données canonique de l'écosystème ne porte aucun champ
propriétaire, l'état « déprécié » que le registre public offre est utilisé par 3,5 % des versions
publiées, et la liste qui fait foi vit dans la console d'un fournisseur.

## Fichiers

| Fichier | Quoi |
|---|---|
| `index.html` | hub d'entrée du dossier (à ouvrir en premier) |
| `20261106-catalogue-outils-agents-app.html` | application illustrée : 8 sections, 7 schémas, 32 zones cliquables, sommaire et sources actifs |
| `20261106-catalogue-outils-agents-rapport.md` | rapport markdown, compatible Obsidian (notes de bas de page, images `![alt\|1300]`) |
| `images/` | les 7 schémas SVG éditoriaux |
| `og.png` | carte sociale 1200×630 |

L'application s'ouvre directement depuis le disque : aucun serveur, aucune étape de construction.
Les seules dépendances externes sont Google Fonts et la bibliothèque partagée `/assets/dossier-app.{js,css}`.

## Mesure originale

La section 5 repose sur un relevé effectué le 6 novembre 2026 sur l'interface publique du registre
officiel de serveurs d'outils (`GET /v0/servers`), par pagination semée sur trente-six points d'entrée
de l'espace des noms : 21 029 enregistrements de version, 4 743 noms distincts, 3,54 % portant l'état
`deprecated`, aucun `deleted`, 63,2 % des noms à version unique.

## Note

Publié à titre personnel. Format co-écrit avec l'aide d'une IA.
