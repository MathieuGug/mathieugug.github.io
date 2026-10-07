# Trois organigrammes, quatre décisions

> **Une topologie data/IA ne se choisit pas entre trois modèles d'organigramme : elle se règle sur quatre cadrans indépendants — qui possède le cas d'usage, qui tient la plateforme, qui fixe la norme, qui porte le budget.** — 7 octobre 2026, Mathieu Guglielmino

## Ce que l'organigramme ne décide pas

En 2008, trois chercheurs ont posé une question que le génie logiciel n'avait jamais traitée de front : est-ce que la forme de l'organisation qui écrit un logiciel permet de prédire où ce logiciel va tomber en panne ? Nachiappan Nagappan et Brendan Murphy, de Microsoft Research, avec Victor Basili de l'université du Maryland, ont construit huit métriques décrivant non pas le code mais les gens — combien d'ingénieurs avaient touché chaque composant, combien avaient quitté l'entreprise, à quelle profondeur hiérarchique siégeait son propriétaire, combien d'organisations distinctes y contribuaient. Puis ils ont appliqué ces métriques à Windows Vista.

Le résultat a surpris, et il a tenu. Les métriques organisationnelles se sont révélées statistiquement significatives pour prédire la propension à la défaillance, avec une précision et un rappel sensiblement supérieurs à ceux des métriques employées jusque-là : volume de modifications, complexité, couverture de tests, dépendances, bogues détectés avant la mise en service[^1]. ==La carte de l'organisation prédisait les pannes mieux que n'importe quelle propriété du logiciel lui-même.==

Dix-huit ans plus tard, une direction data ou IA qui arbitre son organisation dispose d'un vocabulaire à trois entrées : centre d'excellence, modèle fédéré, équipes produit autonomes. Ce vocabulaire ne contient aucune des variables que Nagappan, Murphy et Basili ont mesurées. On choisit un libellé, et les grandeurs qui déterminent le résultat restent libres de prendre n'importe quelle valeur à l'intérieur du libellé choisi.

Ce dossier propose de changer l'objet du choix. Les trois topologies vendues sont des préréglages, pas des structures. Derrière elles se trouvent **quatre décisions séparables** : qui possède un cas d'usage, qui tient la plateforme sur laquelle il tourne, qui fixe la norme qu'il doit respecter, qui porte le budget qui le finance. Seize combinaisons existent. Trois portent un nom commercial. Les autres se rencontrent tous les jours sans que personne ne sache les décrire, et c'est dans leurs incohérences que se logent les symptômes qu'on attribue au modèle affiché.

[SCHEMA-01]

Trois conséquences pratiques sortent de ce renversement. La première est qu'une direction peut diagnostiquer son organisation réelle en quatre questions au lieu d'un débat sur le libellé. La deuxième est que le seuil de bascule d'une topologie à l'autre n'est pas la maturité, contrairement à ce que suggèrent la plupart des grilles : c'est une propriété de file d'attente, mesurable entité par entité. La troisième est la plus contre-intuitive : réorganiser a un coût de qualité documenté, ce qui disqualifie le changement de modèle comme geste de premier recours et désigne à sa place le réglage d'un seul cadran.

## Le mauvais objet de choix

Les trois topologies de référence sont définies par ce qu'elles centralisent, mais aucune ne dit *quoi*.

Un **centre d'excellence** rassemble la compétence rare dans une équipe unique qui porte à la fois la norme, l'outillage et la livraison. Un **modèle fédéré**, aussi appelé *hub-and-spoke*, garde un noyau central et place des relais dans les entités. Des **équipes produit autonomes** logent la compétence dans chaque domaine métier, avec une coordination réduite au minimum.

Posées ainsi, ces définitions ont un défaut rédhibitoire : elles décrivent où les personnes sont assises. Or deux entreprises qui déclarent le même modèle n'ont souvent pas la même organisation, et la même entreprise en déclare fréquemment deux selon l'interlocuteur. Les enquêtes le montrent dès qu'elles posent la question avec assez de granularité. Une consultation de pairs menée par Gartner sur les modèles opératoires data et analytique trouve 52 % de fonctions coordonnées ou fédérées de façon **informelle**, les équipes travaillant ensemble sans dispositif établi, contre seulement 21 % de *hub-and-spoke* formellement coordonné[^11]. La majorité des organisations se rangent donc dans une catégorie qui se définit par l'absence de règle écrite.

Le brouillage s'aggrave avec l'IA générative. Les travaux de McKinsey sur l'état de l'IA relèvent que plus de la moitié des entreprises ont mis en place un dispositif d'IA générative piloté centralement, y compris lorsque leur fonction data et analytique est, elle, relativement décentralisée[^8]. La même enquête distingue ce qui est centralisé de ce qui ne l'est pas : la gestion du risque et de la conformité ainsi que la gouvernance des données sont les éléments les plus souvent pleinement centralisés, tandis que les compétences techniques et l'adoption relèvent le plus souvent d'un dispositif hybride ou partiellement centralisé.

Cette dernière phrase contient déjà la thèse de ce dossier. Une entreprise peut parfaitement centraliser sa gouvernance des données, hybrider ses talents et décentraliser son adoption. Elle a alors trois réglages distincts, et aucun des trois libellés disponibles ne les capture. Quand son directeur data déclare « nous sommes en hub-and-spoke », il nomme une moyenne qui n'a pas d'existence opérationnelle.

Le vocabulaire a une seconde faiblesse, moins visible : il ne dit rien du **budget**. Une équipe centrale financée sur une ligne corporate et une équipe centrale refacturée aux entités portent le même nom sur l'organigramme et se comportent de façon opposée. La première reçoit une demande infinie, parce que son service est gratuit au point de consommation. La seconde reçoit une demande solvable, parce que chaque entité arbitre entre ce service et autre chose. Aucune grille de topologie ne demande laquelle des deux on est.

Pour en sortir, il faut des variables mesurées, pas des libellés. La recherche en fournit, et elle en fournit deux qui se transposent directement.

## Les deux variables qui prédisent

Les huit métriques organisationnelles construites par Nagappan, Murphy et Basili décrivent un composant logiciel par les gens qui l'ont produit[^2]. Trois comptent des personnes : le nombre d'ingénieurs l'ayant modifié, le nombre d'entre eux ayant quitté l'entreprise, la fréquence d'édition. Trois décrivent la propriété : la part des contributions revenant à l'organisation propriétaire, la propriété globale, la part de l'organisation effectivement mobilisée. Et deux décrivent la **forme hiérarchique** du rapport entre le composant et l'entreprise.

Ce sont ces deux-là qui nous intéressent, parce qu'elles sont les seules qu'une direction règle par décision explicite.

La première est la **profondeur de la propriété** (*depth of master ownership*) : à quelle profondeur, dans la hiérarchie, siège le responsable qui couvre 75 % du travail effectué sur le composant. La seconde est le **facteur d'intersection organisationnelle** (*organization intersection factor*) : le nombre d'organisations distinctes qui contribuent chacune pour plus de 10 % des modifications. La première mesure la distance entre l'objet et la personne qui peut en décider seule. La seconde mesure combien d'entités ont voix au chapitre sur le même objet.

[SCHEMA-02]

Deux travaux ultérieurs permettent de resserrer l'interprétation.

Le premier est un résultat **nul**, et c'est pour cela qu'il est précieux. En 2009, Christian Bird, Nagappan, Premkumar Devanbu, Harald Gall et Murphy ont examiné si la distribution géographique du développement de Windows Vista dégradait la qualité. Réponse : une fois le nombre de contributeurs par composant contrôlé, l'écart entre développement distribué et développement co-localisé devient encore moins significatif ; les caractéristiques des composants (volume de modifications, complexité, dépendances, couverture de tests) diffèrent très peu entre les deux cas[^3]. ==Où les gens sont assis ne prédit presque rien ; de qui ils relèvent prédit beaucoup.== C'est exactement la distinction que les grilles de topologie manquent, puisqu'elles ne parlent que de sièges.

Le second est une confirmation par la propriété. En 2011, la même équipe élargie a mesuré le lien entre les mesures de propriété et les défaillances sur Vista et sur Windows 7. Les deux grandeurs qui ressortent sont la part de propriété du contributeur principal et le nombre de contributeurs de faible expertise, l'une et l'autre reliées aux défauts détectés avant la mise en service comme à ceux signalés après[^4]. Une propriété concentrée va avec moins de défaillances ; une nuée de contributeurs occasionnels va avec davantage.

La transposition à une direction data demande d'être explicite sur ce qu'elle suppose. Le terrain d'origine est un ensemble de composants logiciels. Un portefeuille de cas d'usage analytiques ou d'agents n'a jamais été mesuré de cette façon. Ce qui se transpose est une forme de raisonnement plutôt qu'un coefficient : lorsqu'un objet livrable dépend de plusieurs organisations ayant chacune un pouvoir réel sur lui, et que son propriétaire est trop bas pour arbitrer seul, la probabilité d'échec monte, et elle monte pour des raisons qui n'ont rien à voir avec la compétence des équipes. Le mécanisme est une affaire de décisions qui ne se prennent pas, ou qui se prennent deux fois.

De là vient le critère de lecture de tout ce dossier. Une topologie data/IA se juge sur deux grandeurs : **combien d'organisations ont voix au chapitre sur un cas d'usage, et à quelle profondeur siège celui qui en décide**. Un centre d'excellence peut produire un facteur d'intersection de un ou de quatre. Un modèle fédéré aussi. L'étiquette ne détermine ni l'une ni l'autre.

Ce qui les détermine, ce sont quatre décisions.

## Quatre cadrans, pas trois organigrammes

Les quatre décisions sont indépendantes. Chacune se prend séparément, chacune peut être centrale ou locale, et leur combinaison produit l'organisation réelle.

**Cadran 1 — la propriété du cas d'usage.** Qui est responsable du résultat métier : la personne dont l'objectif annuel bouge si le cas d'usage échoue. C'est le seul cadran dont la position se vérifie en une question, posée à l'intéressé : « si ce cas d'usage est arrêté dans six mois, qu'est-ce que ça change pour vous ? » Une réponse embarrassée indique un propriétaire nominal.

**Cadran 2 — la plateforme.** Qui fournit le socle technique : environnement d'exécution, accès aux données, registre d'outils, dispositif d'observation. Position centrale ou locale, mais surtout : fournie selon quel mode.

**Cadran 3 — la norme.** Qui fixe les règles opposables : seuils d'évaluation avant mise en service, exigences de traçabilité, paliers d'autonomie, définitions partagées. La norme n'est pas la plateforme, et confondre les deux est l'erreur la plus fréquente du *hub-and-spoke*.

**Cadran 4 — le budget.** Qui paie, et surtout à quel point de consommation le coût apparaît. Ligne centrale invisible pour les entités, ou refacturation qui force un arbitrage local.

[SCHEMA-03]

Le vocabulaire qui manque pour relier ces cadrans existe, et il vient du génie logiciel plutôt que du conseil en organisation. Team Topologies, de Matthew Skelton et Manuel Pais, distingue quatre types d'équipes — alignée sur le flux de valeur, de plateforme, d'habilitation, de sous-système complexe — et surtout **trois modes d'interaction** : la collaboration, le mode service, et la facilitation[^5]. L'argument central porte sur la charge cognitive : une équipe alignée sur un flux de valeur et tenue d'en assumer toute la chaîne se retrouve en surcharge, et une plateforme sert à lui en retirer une part.

Le mode d'interaction est la variable que les grilles de topologie data n'ont pas. Une plateforme centrale fournie en **mode service** se consomme sans négociation : son interface est documentée, son usage ne demande pas de réunion, et elle ne détient aucun droit de regard sur ce que l'équipe en fait. Une plateforme centrale fournie en **mode collaboration** impose un échange sur chaque usage, ce qui crée mécaniquement une deuxième organisation ayant voix au chapitre. La première maintient le facteur d'intersection à un. La seconde le porte à deux au minimum, sur chaque cas d'usage, en permanence.

D'où la règle de conversion entre les deux registres : ==le mode service est le seul réglage de plateforme compatible avec un facteur d'intersection bas ; la collaboration permanente est un facteur d'intersection déguisé en bonne volonté.== Une équipe de plateforme qui se félicite d'être « proche des métiers » décrit souvent, sans le savoir, le symptôme que les métriques de Nagappan associent aux défaillances.

Les trois topologies vendues se replacent alors comme trois préréglages parmi seize :

| | Propriété | Plateforme | Norme | Budget |
|---|---|---|---|---|
| **Centre d'excellence** | centrale | centrale | centrale | central |
| **Fédéré cohérent** | locale | centrale *(mode service)* | centrale | local |
| **Équipes produit** | locale | locale | locale | local |

Trois lignes sur seize possibles. Les treize autres ne sont pas des erreurs par construction : certaines sont des étapes de transition légitimes, d'autres des réglages adaptés à une contrainte particulière. Mais quatre d'entre elles se rencontrent sans cesse et ne tiennent pas.

## Les combinaisons qui ne tiennent pas

Chacune de ces quatre incohérences produit une signature observable, et chacune se fait attribuer un diagnostic erroné.

**Propriété et plateforme centrales, budget central, mais demande locale libre.** La configuration la plus répandue, et la plus mal comprise. L'équipe centrale livre un service dont le coût n'apparaît nulle part chez le demandeur. Un service gratuit au point de consommation reçoit une demande qui ne s'arrête pas, puisque rien, chez le demandeur, n'oppose cette demande à une autre. La file s'allonge, les délais d'attente se comptent en trimestres, et les entités finissent par construire ailleurs ce qu'elles n'obtiennent pas. Le diagnostic porté est « l'équipe centrale manque de moyens ». Le réglage en cause est le cadran budget, et ajouter des moyens à service gratuit déplace la file sans la raccourcir.

**Propriété locale, norme centrale, plateforme absente ou locale.** La configuration la plus coûteuse. Les entités construisent, mais chaque mise en service passe par une validation centrale qui ne fournit rien en échange. Le centre n'a ni le socle technique, ni la connaissance du cas d'usage, ni la responsabilité du résultat, rien qu'un droit de veto. Deux organisations ont voix au chapitre sur chaque cas d'usage, et le propriétaire métier est trop bas pour passer outre. Facteur d'intersection à deux, profondeur de propriété élevée : les deux grandeurs que les métriques organisationnelles associent à la défaillance sont au mauvais réglage simultanément. Le diagnostic porté est « la gouvernance est trop lourde ». Le problème tient à ce que la norme a été centralisée sans la plateforme qui la rend applicable sans négociation.

**Tout local, plateforme comprise.** Chaque entité se dote de son socle. Les coûts se dupliquent, ce qui est visible et se chiffre. Mais la première victime n'est pas le budget : c'est la **couche sémantique**, cette représentation unifiée et cohérente des données, interprétable par des humains comme par des machines, dont les travaux du MIT CISR relèvent qu'elle devient un investissement sous pression à mesure que modèles et agents doivent s'appuyer sur des actifs de données immédiatement utilisables[^13]. Une couche sémantique est un actif partagé par construction : son intérêt vient de ce que tout le monde s'y réfère. Dupliquée en n exemplaires, elle cesse d'être un actif et devient n glossaires divergents. Le diagnostic porté est « il nous manque un outil de catalogue ». Le réglage en cause est le cadran plateforme, et aucun outil ne répare une définition que quatre entités ont écrite différemment.

**Le réglage cohérent.** Norme et plateforme centrales, la plateforme fournie en mode service ; propriété et budget locaux. Le propriétaire métier décide, paie, et arbitre donc réellement. Le centre fournit un socle qui se consomme sans réunion et une norme opposable qui s'applique sans validation au cas par cas. Facteur d'intersection à un sur la livraison, profondeur de propriété faible. C'est le seul réglage qui mérite le nom de modèle fédéré, et c'est aussi le plus rare, parce qu'il demande au centre de renoncer au droit de regard qu'il considère comme sa raison d'être.

[SCHEMA-04]

Une remarque sur la lecture de ces quatre cas. Aucun ne décrit une faute de compétence. Dans chacun, les équipes font correctement ce que leur réglage leur demande de faire : une équipe centrale gratuite accepte les demandes qu'on lui adresse, une équipe de validation valide, une entité sans socle se construit un socle. C'est le propre des problèmes de topologie : ils se présentent comme des problèmes de personnes, et résistent à tous les remèdes adressés aux personnes.

## Le seuil de bascule n'est pas la maturité

Les grilles disponibles proposent presque toutes une progression par maturité : on commence en centre d'excellence, on passe au fédéré quand on mûrit, on finit en équipes produit. Cette progression est fausse dans sa variable explicative, et elle conduit à basculer au mauvais moment.

Un centre d'excellence paie pour une raison précise : il mutualise une compétence rare. La mutualisation rend service tant que la demande de chaque entité est **sporadique**. Quatre entités qui ont besoin d'un spécialiste trois semaines par an chacune ne peuvent pas en recruter un ; mises en commun, elles en financent un à taux d'occupation correct. Le gain est réel et il est entièrement imputable au caractère intermittent de la demande.

Ce gain disparaît quand la demande devient **continue**. Une file d'attente unique alimentée par des arrivées régulières dans plusieurs voies à la fois ne mutualise plus rien : elle ordonne. Le temps d'attente ne dépend plus de la compétence de l'équipe mais du rapport entre le débit de la file et le débit des arrivées, et ce rapport se dégrade de façon non linéaire à l'approche de la saturation. Les deux derniers points de charge coûtent plus d'attente que les quarante premiers.

[SCHEMA-05]

De là une règle de décision chiffrable, qui remplace la maturité. Pour chaque entité, compter l'**équivalent temps plein de demande permanente** : le volume de travail data/IA que cette entité aurait à confier de façon continue, et non en pics. Au-delà d'environ un équivalent temps plein de demande permanente, la mutualisation cesse de payer **pour cette entité** : ce qu'elle gagne en accès à une compétence rare, elle le reperd en attente, et elle le reperd d'autant plus que l'attente dégrade aussi la qualité de la demande, un métier qui attend deux trimestres reformulant son besoin en fonction de ce qu'il croit obtenable.

Deux conséquences suivent, et ce sont elles qui font la différence pratique avec les grilles de maturité.

La première : ==la bascule se fait entité par entité, jamais d'un bloc.== Dans une entreprise à six divisions, deux dépasseront le seuil et quatre resteront en dessous. Le réglage cible n'est donc pas « nous passons au fédéré » mais « ces deux divisions prennent la propriété et le budget, les quatre autres restent servies par le centre ». Cela décrit une organisation asymétrique, que les trois libellés disponibles ne savent pas nommer, et c'est l'une des raisons pour lesquelles les entreprises réorganisent globalement là où il fallait régler localement.

La seconde : le seuil se franchit dans les deux sens. Une division qui perd son flux continu redevient candidate à la mutualisation. Une organisation qui a décentralisé par principe plutôt que par mesure se retrouve avec quatre demi-équipes sous-occupées, chacune trop petite pour couvrir le spectre de compétences dont elle a besoin. La remutualisation est un geste légitime, rarement envisagé parce que la progression par maturité la présente comme une régression.

## Ce que l'agentique déplace

L'arrivée des agents en production ne remet pas en cause les quatre cadrans. Elle déplace la ressource rare, et par conséquent la position optimale de deux d'entre eux.

Les observations publiées en octobre 2026 par McKinsey sur la réorganisation du travail décrivent le mouvement : les entreprises les plus avancées regroupent des équipes pluridisciplinaires autour de produits, de parcours clients et de processus de bout en bout, en rapprochant décisions et responsabilité du lieu où la valeur se crée. L'illustration chiffrée est parlante : des équipes de développement produit de huit à dix personnes ramenées à des équipes hybrides de quatre à six, appuyées par des agents. Et une prescription explicite, qui est le point important ici : chaque agent doit avoir un **propriétaire nommé**, avec une délimitation claire entre les décisions qu'il prend seul et celles qui passent en revue[^9].

Si la construction s'automatise partiellement et que la supervision ne s'automatise pas, alors la ressource rare se déplace du constructeur vers le propriétaire-réviseur. Un ingénieur data de plus accroît la capacité de construction ; il n'accroît pas la capacité de décider qu'une sortie est acceptable. Cette capacité suppose la connaissance du métier, et elle ne se mutualise pas : personne, dans une équipe centrale, ne peut arbitrer à la place d'une direction des risques ce qui constitue un faux positif acceptable.

[SCHEMA-06]

Les deux cadrans qui bougent sont la norme et la plateforme, dans la même direction, vers le centre, et pour un motif qui n'était pas le motif habituel de centralisation.

Le **jeu d'évaluation** devient l'actif à tenir au centre. Non parce que le centre saurait mieux évaluer, mais parce qu'un jeu d'évaluation n'a de valeur que s'il est comparable entre cas d'usage et stable dans le temps : il sert à savoir si la version d'aujourd'hui vaut celle du trimestre dernier, et cette question ne se pose qu'à une échelle qui dépasse une entité. Reconstitué localement, il perd sa seule propriété utile, qui est la comparabilité.

Le cadran **propriété**, en revanche, se trouve verrouillé par le droit. L'article 26 du règlement européen sur l'IA, dans ses obligations faites aux déployeurs, impose de confier la surveillance humaine à des personnes physiques disposant de la compétence, de la formation et de l'**autorité** nécessaires, ainsi que du soutien nécessaire[^14]. Les trois premiers termes sont des conditions de personne. Le quatrième est une condition d'organisation : l'autorité, ici, désigne la capacité de passer outre le système ou d'en suspendre l'usage sans demander la permission à quelqu'un dont les objectifs dépendent du débit.

Cette exigence est une contrainte de profondeur de propriété, formulée en droit. Un propriétaire placé cinq niveaux sous la décision budgétaire ne dispose pas de cette autorité, quelle que soit la compétence qu'on lui reconnaît par ailleurs. ==Une obligation réglementaire fixe donc, pour la première fois, une borne supérieure à la profondeur hiérarchique du propriétaire d'un cas d'usage à risque élevé.== Les directions qui liront l'article 26 comme une obligation de formation passeront à côté de la seule de ses exigences qui se traduise en organigramme.

Ces deux mouvements ne se contredisent pas, et c'est ce qui les rend lisibles : la norme et l'évaluation remontent, la propriété et la décision descendent. Le réglage que l'agentique désigne est celui que la section précédente a identifié comme le seul cohérent, et la réglementation ajoute une raison de s'y tenir.

## Le coût de la réorganisation

Reste la question qu'aucune grille de topologie ne pose : combien coûte le fait de changer.

Audris Mockus a mesuré, sur un grand projet logiciel, le lien entre les changements organisationnels et les défauts signalés par les clients. La proximité d'un changement d'organisation est significativement associée à une baisse de la qualité ; les départs récents, en particulier, vont avec une probabilité accrue de défauts remontés par les clients[^6]. Le travail a fait l'objet d'une réplication indépendante sur les données de Google Chrome, ce qui le rend moins dépendant d'un terrain unique[^7]. Le sens du résultat mérite d'être pris au mot : la dégradation s'attache au **passage** d'une organisation à une autre, indépendamment de la qualité respective des deux états.

À ce coût de transition s'ajoute un risque de forme. Le cas canonique est connu et rarement tiré jusqu'à sa conclusion. Le modèle décrit en 2012 par Spotify — escouades, tribus, chapitres, guildes — a été repris par un très grand nombre d'entreprises. En 2020, Jeremiah Lee, ancien responsable produit de l'entreprise, a établi que ce modèle relevait largement de l'aspiration et non du fonctionnement réel : des milliers d'organisations ont refait leur organigramme sur la description d'un système qui n'avait jamais pleinement tourné chez son auteur[^10]. Les motifs d'échec documentés à l'intérieur même de l'entreprise sont instructifs pour notre grille : aucun dispositif de coordination lorsque plusieurs escouades devaient travailler ensemble, et une séparation entre encadrement fonctionnel et mission produit qui laissait la responsabilité sans titulaire en cas d'échec.

Traduit dans les quatre cadrans : la copie a reproduit le cadran « propriété » en position locale et a laissé les trois autres indéterminés. Ce qui manquait n'était pas la culture, même si c'est le diagnostic le plus souvent avancé. C'était le mode d'interaction entre les équipes, qui n'était spécifié nulle part.

[SCHEMA-07]

Trois interventions sont possibles, et leurs coûts n'ont pas le même ordre de grandeur.

**Tourner un cadran** est l'intervention la moins chère et la plus réversible. Refacturer la plateforme aux entités, imposer le mode service à l'équipe centrale, remonter d'un niveau le propriétaire d'un cas d'usage, sortir le jeu d'évaluation du périmètre d'une entité : chacun de ces gestes modifie une seule variable, laisse les équipes en place, et produit un effet observable en un à deux trimestres. Aucun ne demande de réorganigramme.

**Changer de modèle** déplace les quatre cadrans à la fois et déplace les personnes. Le coût de transition documenté par Mockus s'applique intégralement, et l'effet ne devient lisible qu'après que la volatilité se soit résorbée, ce qui prend plusieurs trimestres. L'intervention se justifie quand plusieurs cadrans sont au mauvais réglage et que leurs corrections dépendent l'une de l'autre. Elle ne se justifie pas pour corriger un symptôme unique.

**Copier un modèle** est la seule des trois à n'avoir aucun effet attendu. Reprendre un organigramme publié transfère la forme sans les quatre réglages, qui ne figurent pas dans la publication parce que l'auteur ne les avait pas formulés ainsi.

D'où la règle que ce dossier propose de retenir : devant un symptôme d'organisation, chercher d'abord lequel des quatre cadrans est au mauvais réglage, et ne considérer un changement de modèle qu'après avoir épuisé les réglages isolés. Et une règle de séquence, qui découle du même résultat : ne jamais réorganiser et changer de plateforme la même année, puisque les deux chantiers produisent chacun de la volatilité et qu'on ne saura pas lequel attribuer à l'effet observé.

## Six décisions, rangées par la fenêtre où elles restent possibles

**D1 — Nommer le propriétaire de chaque cas d'usage, et vérifier la nomination par la question de l'arrêt.** Fenêtre : à tout moment, coût quasi nul. La vérification compte autant que la nomination : un propriétaire dont rien ne bouge si le cas d'usage s'arrête est un propriétaire nominal, et la liste des propriétaires nominaux est le meilleur indicateur avancé dont dispose une direction data.

**D2 — Fixer une profondeur hiérarchique maximale pour le propriétaire d'un cas d'usage à risque élevé.** Fenêtre : avant que le portefeuille ne compte des systèmes relevant du régime à risque élevé. L'article 26 § 2 exige une autorité réelle[^14] ; cette autorité se traduit par une borne de profondeur, et il est plus simple de l'écrire avant d'avoir à la démontrer.

**D3 — Imposer le mode service à l'équipe de plateforme, et l'écrire.** Fenêtre : au moment où la plateforme se constitue. Ce qui s'écrit : l'interface, le délai de mise à disposition, et surtout l'absence de droit de regard sur l'usage. Rétablir un mode service après trois ans de collaboration permanente demande de retirer à une équipe centrale un pouvoir qu'elle considère comme son métier.

**D4 — Faire suivre le budget à la propriété.** Fenêtre : à la construction du budget annuel, donc une fois par an. C'est le cadran le plus souvent oublié et le plus déterminant : il décide si la demande adressée au centre est solvable ou infinie.

**D5 — Tenir le jeu d'évaluation au centre, dès le premier cas d'usage.** Fenêtre : le premier jour, et elle se referme. Un jeu d'évaluation ne vaut que par sa comparabilité dans le temps ; reconstitué après deux ans de production locale, il ne compare plus rien.

**D6 — Désigner un responsable de la mesure du facteur d'intersection.** Fenêtre : à tout moment, mais sans titulaire la mesure n'existe pas. Il s'agit de tenir, cas d'usage par cas d'usage, la liste des organisations qui ont un pouvoir réel de blocage. Cette liste est le seul instrument de diagnostic de ce dossier qui se tienne dans un tableur, et la seule des six décisions qui révèle les cinq autres.

## Note de méthode

La politique d'accès réseau de l'environnement de rédaction a bloqué la récupération intégrale des pages sources : les domaines `mckinsey.com`, `cisr.mit.edu`, `martinfowler.com`, `artificialintelligenceact.eu`, `dl.acm.org` et plusieurs hébergeurs de documents n'ont pas été joignables. Les éléments cités proviennent d'extraits de résultats de recherche. Ils sont donnés **en substance**, recoupés quand plusieurs formulations indépendantes existaient, et les formulations exactes des articles réglementaires comme les pourcentages d'enquête doivent être revérifiés à la source avant toute réutilisation.

Trois réserves de fond, plus importantes que la précédente.

**La transposition est une analogie argumentée, non une démonstration.** Les travaux de Nagappan, Bird et Mockus portent sur des composants logiciels produits par des organisations d'ingénierie. Rien n'établit que les coefficients mesurés sur Windows Vista s'appliquent à un portefeuille de cas d'usage analytiques. Ce qui se transpose est la hiérarchie des variables : la forme de la propriété avant les propriétés de l'objet. Le lecteur qui refuserait l'analogie garderait tout de même le constat que les grilles de topologie disponibles ne mesurent rien.

**Les chiffres d'enquête sont déclarés.** Les répartitions de modèles opératoires[^11] et les taux de centralisation par élément[^8] reposent sur des auto-déclarations de dirigeants, sur des échantillons de quelques centaines à une centaine d'entreprises[^12]. Ils servent ici à établir une dispersion, jamais une proportion exacte ; la thèse de la section 2 est d'ailleurs que ces auto-déclarations sont peu fiables, ce qui interdit de les utiliser autrement.

**Le seuil d'un équivalent temps plein est un ordre de grandeur, pas un résultat.** Il dérive du raisonnement de file d'attente exposé en section 6 et de l'observation que sous ce volume une entité ne peut pas couvrir le spectre de compétences requis. Aucune mesure publiée ne le valide. Il vaut comme instrument de conversation budgétaire, à recalibrer sur le coût local d'un profil et sur la variance réelle de la demande.

## Sources

[^1]: Nachiappan Nagappan, Brendan Murphy, Victor R. Basili, « The influence of organizational structure on software quality: an empirical case study », *Proceedings of the 30th International Conference on Software Engineering (ICSE '08)*, p. 521-530. https://dl.acm.org/doi/10.1145/1368088.1368160

[^2]: Même travail, version longue avec la définition des huit métriques organisationnelles (nombre d'ingénieurs, nombre d'anciens ingénieurs, fréquence d'édition, profondeur de la propriété, part de l'organisation contribuant, niveau de propriété organisationnelle du code, propriété globale, facteur d'intersection organisationnelle). http://www.cs.umd.edu/~basili/publications/proceedings/P125.pdf

[^3]: Christian Bird, Nachiappan Nagappan, Premkumar Devanbu, Harald Gall, Brendan Murphy, « Does distributed development affect software quality? An empirical case study of Windows Vista », *ICSE 2009*. https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/bird2009ddd.pdf

[^4]: Christian Bird, Nachiappan Nagappan, Brendan Murphy, Harald Gall, Premkumar Devanbu, « Don't touch my code! Examining the effects of ownership on software quality », 2011. https://www.semanticscholar.org/paper/0ff83a2c7e1c66d03b3ddd561af28c43fae27ea0

[^5]: Matthew Skelton, Manuel Pais, *Team Topologies* — présentation des quatre types d'équipes, des trois modes d'interaction et de l'argument de charge cognitive. https://martinfowler.com/bliki/TeamTopologies.html

[^6]: Audris Mockus, « Organizational volatility and its effects on software defects », *Proceedings of the 18th ACM SIGSOFT International Symposium on Foundations of Software Engineering (FSE 2010)*. https://dl.acm.org/doi/10.1145/1882291.1882311

[^7]: « Organizational Volatility and Post-release Defects: A Replication Case Study Using Data from Google Chrome », IEEE, 2015. https://ieeexplore.ieee.org/abstract/document/7180101/

[^8]: McKinsey & Company, *The State of AI* — centralisation par élément du dispositif d'IA (risque et conformité, gouvernance des données, compétences techniques, adoption). https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai/

[^9]: McKinsey & Company, « AI is changing work. Now it has to change the organization », 5 octobre 2026. https://www.mckinsey.com/capabilities/people-and-organization/our-insights/ai-is-changing-work-now-it-has-to-change-the-organization

[^10]: Jeremiah Lee, « Spotify's Failed #SquadGoals », 2020. Analyse par un ancien responsable produit de l'écart entre le modèle publié en 2012 et son fonctionnement réel. https://www.agility11.com/blog/2020/6/22/spotify-doesnt-use-the-spotify-model

[^11]: Gartner Peer Community, *One Minute Insights: Data & Analytics Operating Models*. 52 % de fonctions coordonnées ou fédérées informellement, 21 % de *hub-and-spoke* formellement coordonné. https://www.gartner.com/peer-community/oneminuteinsights/omi-data-analytics-operating-models-lp3

[^12]: Wavestone, *2026 AI & Data Leadership Executive Benchmark Survey* — environ 110 grandes entreprises, 90 % dotées d'un CDO/CDAO/CAIO, 70 % jugeant le rôle établi, 52 % estimant qu'un responsable IA devrait être nommé. https://www.wavestone.com/en/

[^13]: MIT CISR, « The Case for a Semantic Layer », mai 2026. La couche sémantique comme représentation unifiée interprétable par les humains et les machines, et comme investissement sous pression à l'ère des agents. https://cisr.mit.edu/publication/2026_0501_SemanticLayer_LefebvreWixomLegnerVandermeulenBeath

[^14]: Règlement (UE) 2024/1689 sur l'intelligence artificielle, article 26 — obligations des déployeurs de systèmes à haut risque ; § 2 : surveillance humaine confiée à des personnes physiques dotées de la compétence, de la formation et de l'autorité nécessaires. https://artificialintelligenceact.eu/article/26/

[^15]: MIT CISR, « Enterprise IT Operating Models in the AI Era », Alan Thorogood, Stephanie Woerner, décembre 2025. Brouillage de la frontière entre fonction informatique et métiers, modularité et réemploi comme marqueurs des meilleures performances. https://cisr.mit.edu/publication/2025_1201_EntITOperatingModels_ThorogoodWoerner
