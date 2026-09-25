# Ce que le modèle de mix sait avant de voir les données

> 25 septembre 2026 — Mathieu Guglielmino

Dossier 54. Piste éditoriale **D · data marketing & mesure** (avec débord sur la piste A, gouvernance de la mesure).

**Thèse.** Les trois piles ouvertes de modélisation du mix média partagent la même mathématique et divergent sur une seule chose : ce qu'elles obligent l'annonceur à déclarer avant de voir les données. Un modèle de mix produit un arbitrage entre des données structurellement trop pauvres pour trancher et un a priori que quelqu'un a écrit. La décision qui engage une direction data porte donc sur l'identité de celui qui écrit cet a priori, sur quelle preuve, et sur la possibilité de le contester — question d'autant plus vive que deux des trois piles sont publiées par les deux premiers vendeurs d'espace publicitaire.

## Contenu du dossier

| Fichier | Rôle |
|---|---|
| `index.html` | Hub d'entrée du dossier |
| `20260925-calibration-mmm-app.html` | Application illustrée : 9 sections, 7 schémas cliquables, glossaire au survol, sommaire et sources actifs |
| `20260925-calibration-mmm-rapport.md` | Rapport markdown complet, compatible Obsidian, citations en notes de bas de page (masqué du hub hors mode admin) |
| `images/*.svg` | Les 7 schémas éditoriaux, référencés par le rapport et inlinés dans l'app |
| `og.png` | Carte sociale 1200×630, générée par `tools/seo_dossiers.py` |

## Les sept schémas

1. **Où la déclaration entre dans la chaîne** — les trois points d'injection entre la dépense et le retour remonté.
2. **Le budget d'information** — 156 observations hebdomadaires pour une cinquantaine de paramètres.
3. **Trois piles, trois surfaces de déclaration** — Meridian, Robyn, PyMC-Marketing comparés par ce qu'ils imposent d'écrire.
4. **Ce que l'a priori pèse selon la force du signal** — effacé, tirant, ou constituant à lui seul le résultat.
5. **D'où vient l'a priori** — expérience propre, jugement d'expert, étude du vendeur, et ce que chacune rend refaisable.
6. **Le cycle annuel de calibration** — et le point de rupture d'estimand qui l'invalide silencieusement.
7. **Deux axes indépendants** — la qualité d'ajustement ne dit rien du biais d'attribution.

## Ancrages sourcés

- Valeurs par défaut de Meridian lues dans `prior_distribution.py` : ROI en `LogNormal(0,2 ; 0,9)`, et `P_MEAN = 0.4` / `P_SD = 0.2` pour la contribution totale du média payant quand l'indicateur n'est pas monétaire.
- Disponibilité mondiale de Meridian GeoX le 9 septembre 2026, qui fait du vendeur d'espace le fournisseur de l'expérience qui calibre le modèle.
- Lewis & Rao, *QJE* 2015 : intervalle de confiance médian sur le ROI supérieur à cent points de pourcentage sur vingt-cinq grandes expériences.
- Gordon, Moakler & Zettelmeyer, *Marketing Science* 2023 : 663 expériences, échec des approches non expérimentales.
- Heusch, arXiv:2608.21130, août 2026 : générateur synthétique à dépense endogène et vérité causale connue.

Treize sources au total, listées dans la barre latérale de l'application et dans la section `## Sources` du rapport.
