# Ce que l'agent a le droit de retenir

> 19 août 2026 — Mathieu Guglielmino

Design patterns de la mémoire d'un agent conversationnel : niveaux d'engagement, autorité par origine, portée, mécanismes d'oubli, surface de contrôle scrutable.

**Thèse.** La mémoire d'un agent conversationnel est un régime d'autorités avant d'être un système de stockage : les informations dont il a le plus besoin pour ne pas nuire sont exactement celles que le droit lui interdit d'inférer.

## Contenu du dossier

| Fichier | Rôle |
|---|---|
| `index.html` | Hub d'entrée du dossier |
| `20260819-memoire-conversationnelle-app.html` | Application illustrée : 11 sections, 8 schémas cliquables (34 régions), sommaire et sources actifs, glossaire au survol |
| `20260819-memoire-conversationnelle-rapport.md` | Rapport complet en markdown, compatible Obsidian (images `![alt\|1200](images/…)`), citations en notes de bas de page |
| `images/` | Les 8 schémas SVG éditoriaux |
| `og.png` | Carte social 1200×630 générée par `tools/og-card.py` |

Ouvrir l'application : double-clic sur le fichier `.html`, aucun serveur ni étape de compilation. Seules dépendances externes : Google Fonts et la bibliothèque partagée `/assets/dossier-app.{js,css}` (chemins absolus, donc servis depuis la racine du site).

## Les huit schémas

| N° | Titre | Ce qu'il montre |
|---|---|---|
| 01 | Ce que la recherche mesure, et la case qu'elle laisse vide | Quatre familles de bancs d'essai (rappel, préférence, intégrité contextuelle, complaisance) et la question qu'aucune ne pose |
| 02 | Trois niveaux d'engagement, une seule séquence | Contrainte bloquante, cadre de session, préférence pondérée, et le contrôle en sortie |
| 03 | Les deux fautes de mémoire, et leur coût qui s'inverse | Oublier contre retenir à tort, par niveau, et les deux réglages opposés qui en découlent |
| 04 | L'origine fait l'autorité | Déclarée, inférée, observée × effet autorisé, avec la zone interdite et l'arrêt CJUE C-184/20 |
| 05 | Où naît un souvenir, et par quelle porte il devient durable | Portées session, récurrente, permanente ; promotions P1 et P2 ; aucune voie automatique vers le permanent |
| 06 | Cinq mécanismes d'oubli, et celui qu'on retire en premier | O1 à O5 sur un axe automatique → explicite, et le cliquet d'exclusion |
| 07 | L'écran qui répond à « comment savez-vous ça ? » | Six colonnes par item de profil, et la couche implicite qui n'a pas d'écran |
| 08 | « Local et pas cher » : la séquence qui rend l'arbitrage | Filtrer, classer, comparer, rendre le choix, revérifier |

## Ligne éditoriale

Piste **C — Plateformes, outillage & pièges de déploiement**, avec un débord sur la piste **A — Gouvernance** (base légale, consentement, article 9 du RGPD).

Le dossier ne recoupe pas `memoire-agentique/` (architectures de mémoire : piliers, opérations, Letta, Mem0, Zep), `compaction-agentique/` (compaction du contexte) ni `machine-unlearning/` (oubli au niveau des poids). Il porte sur le **design d'interaction** : ce qu'un agent a le droit de retenir, à quel titre, pour combien de temps, et sous quel contrôle de la personne concernée.

## Note de méthode

Plusieurs sources primaires (arxiv.org, openreview.net, openai.com, support.claude.com) sont inaccessibles depuis l'environnement de rédaction. Les contenus correspondants ont été recoupés sur au moins deux formulations indépendantes ; les chiffres cités sont ceux annoncés par les auteurs et n'ont pas été rejoués.

Format co-écrit avec l'aide d'une IA.
