# Ce que la promotion a vraiment causé

> 26 juillet 2026 — Mathieu Guglielmino

Dossier de recherche illustré sur l'inférence causale appliquée à la mesure de performance
commerciale en retail, à partir du dispositif d'IA causale déployé par Leroy Merlin avec
Ekimetrics (13 leviers × ~200 sous-rayons × 11 régions ≈ 40 000 modèles).

Le dossier s'adresse à des data scientists, data engineers et product owners. Il couvre les
fondamentaux (échelle causale, graphe causal, confondeurs, médiateurs, collisionneurs),
le passage de l'estimand à l'estimateur, le rapport entre MMM et inférence causale, la
question des régimes de mutualisation statistique, l'industrialisation MLOps, et les quatre
niveaux d'agentification de la boucle de mesure.

---

## Contenu du dossier

| Fichier | Description |
|---|---|
| `20260726-ia-causale-retail-app.html` | **Application compagnon interactive** — commencer ici |
| `20260726-ia-causale-retail-rapport.md` | Le rapport complet en Markdown (compatible Obsidian) |
| `images/` | Les 9 schémas éditoriaux au format SVG |
| `og.png` | Carte de prévisualisation sociale (1200 × 630) |

## Comment ouvrir

**L'application** — double-cliquer sur `20260726-ia-causale-retail-app.html`.
Elle s'ouvre directement depuis le disque : aucun serveur, aucune installation, aucune
dépendance externe hormis les polices Google chargées via CDN (le rendu reste correct
hors ligne).

**Le rapport Markdown** — ouvrir le dossier décompressé comme coffre Obsidian, ou lire
le `.md` dans n'importe quel éditeur. Les schémas sont référencés en syntaxe Obsidian
`![alt|1200](images/…svg)` et s'affichent tant que le dossier `images/` reste à côté du `.md`.

## Ce que fait l'application

- **Schémas cliquables** — 63 régions interactives réparties sur les 9 schémas ; un clic
  ouvre une fiche de détail. Navigation au clavier possible (Tab puis Entrée).
- **Zoom plein écran** — survoler un schéma fait apparaître un bouton ⛶ en haut à gauche.
  Molette pour zoomer, glisser pour déplacer, `+` `-` `0` `Échap` au clavier.
- **Infobulles** — 24 termes techniques sont définis au survol ou au clic.
- **Sources liées** — chaque appel `[N]` dans le texte fait défiler et surligne la source
  correspondante dans le panneau de droite.
- **Panneau repliable** — le panneau des sources se replie via la languette sur son bord
  gauche ; l'état est mémorisé d'une visite à l'autre.
- **Mobile** — sommaire et sources s'ouvrent en plein écran avec un bouton de fermeture.

## Les neuf schémas

1. **Combinatoire des 40 000** — les quatre dimensions, l'axe de granularité, le mur des 400 000
2. **Échelle causale** — association, intervention, contrefactuel appliqués au pilotage commercial
3. **Grammaire du DAG** — chaîne, fourche, collisionneur ; les quatre rôles d'une variable
4. **Graphe de travail** — une promotion ciblée, son ensemble d'ajustement et ses pièges
5. **Choix d'estimateur** — arbre de décision par design de données
6. **Anatomie d'un MMM** — rémanence, saturation, décomposition, et les trois points d'insertion du graphe
7. **Régimes de mutualisation** — pooling complet, nul, partiel : ce que « 40 000 modèles unitaires » engage
8. **Pipeline MLOps causal** — le graphe comme artefact versionné, la porte de réfutation
9. **Niveaux d'agentification** — lire, décider, spécifier, et le cas où l'agent devient le canal

## Note de méthode

Les chiffres de performance attribués à Leroy Merlin sont communiqués par l'entreprise et
n'ont pas fait l'objet d'une validation indépendante ; ils sont signalés comme tels dans le
rapport. Le graphe causal du schéma 4 est une reconstruction illustrative à partir des
éléments publiés : il ne reproduit pas le graphe réel de l'enseigne. L'analyse de la
section 6 sur les régimes de mutualisation porte sur la description publiée du dispositif
(« modèles unitaires »), l'architecture interne du moteur n'étant pas publique.

20 sources, principalement des articles évalués par les pairs, des publications de
recherche primaires et la documentation méthodologique des éditeurs concernés.
