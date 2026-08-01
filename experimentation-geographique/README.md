# L'expérimentation géographique comme actif d'entreprise

> 1er août 2026 — Mathieu Guglielmino

Dossier de recherche illustré sur l'expérimentation géographique (geo-test, incrémentalité) comme **capacité d'entreprise** plutôt que comme technique de mesure ponctuelle. Piste éditoriale **D — data marketing & mesure**.

**Thèse.** Le coût d'un test d'incrémentalité n'est pas le prix de l'outil — toutes les bibliothèques de référence sont ouvertes — c'est le budget qu'on renonce à dépenser dans le groupe témoin. Et sa valeur ne se réalise qu'en régime : un test isolé est presque toujours sous-puissant, donc son « non significatif » n'informe rien. La décision de direction porte donc sur la cadence, le budget témoin provisionné, et la gouvernance des résultats.

## Contenu

| Fichier | Quoi |
|---|---|
| `index.html` | Hub d'entrée du dossier |
| `20260801-experimentation-geographique-app.html` | Application companion : rapport complet, 7 schémas cliquables (47 régions), infobulles, sommaire et sources en barres latérales |
| `20260801-experimentation-geographique-rapport.md` | Rapport markdown (compatible Obsidian), notes de bas de page numérotées |
| `images/` | Les 7 schémas éditoriaux en SVG |

Ouvrir l'application : double-cliquer sur le `.html`, ou passer par le hub. Aucun serveur ni build requis ; seule dépendance externe, Google Fonts.

## Schémas

1. Anatomie d'une expérience géographique — trois périodes, assignation, estimand
2. Cinq familles de méthodes, ordonnées par le nombre d'unités qu'elles exigent
3. Le mur de la puissance — zone aveugle, faux positifs, effets manqués
4. L'économie du budget témoin — coût d'opportunité contre précision
5. Cinq façons de rater un geo-test — symptôme, mécanisme, parade
6. La boucle test → prior → modèle de mix → réallocation
7. Gouvernance de la mesure — pré-enregistrement, registre, juge et partie, faire ou acheter

## Note de méthode

Les chiffres cités proviennent des 14 sources listées dans le rapport (Google Research, Meta GeoLift, *QJE*, *Econometrica*, *Marketing Science*, *Management Science*, *Annals of Applied Statistics*, documentation Meridian et Google Ads). Les courbes des schémas 3 et 4 sont **illustratives** : elles représentent la forme du compromis, pas des valeurs mesurées. Les repères de cadence (six à douze tests par an) et le seuil de financement sont des repères de terrain, explicitement signalés comme tels.

L'`og.png` n'a pas été régénérée dans cet environnement (polices Cambria/Consolas absentes) — relancer `python tools/seo_dossiers.py --only experimentation-geographique` localement.
