# L'expérimentation géographique comme actif d'entreprise

> **Le coût d'un test d'incrémentalité n'est pas le prix de l'outil, c'est le budget qu'on renonce à dépenser — et sa valeur ne se réalise qu'en régime, jamais sur un test isolé.** — 1er août 2026, Mathieu Guglielmino

---

## 1. La question qui remonte au comité

Il arrive un moment, dans presque toutes les directions data que je croise, où quelqu'un pose la question à voix haute pendant la revue de performance : « ce ROAS de 8, il vient d'où ? ». La réponse honnête est presque toujours la même — d'un outil d'attribution qui a observé une corrélation entre une exposition publicitaire et un achat, et qui a décidé, par convention, d'attribuer l'achat à l'exposition. La convention est documentée, l'outil est correctement paramétré, et le chiffre ne dit rien sur ce qui se serait passé sans la dépense.

Ce n'est pas une découverte. La littérature académique a documenté l'écart depuis plus de dix ans, avec des ordres de grandeur qui devraient suffire à clore le débat. Blake, Nosko et Tadelis ont coupé le référencement payant d'eBay sur une partie du territoire américain et mesuré que les retours du search de marque étaient **indiscernables de zéro** à court terme, et que les retours moyens sur les mots-clés hors marque étaient **négatifs** — les acheteurs fréquents, qui seraient venus de toute façon, absorbant l'essentiel de la dépense[^9]. Gordon, Zettelmeyer, Bhargava et Chapsky ont comparé, sur quinze expériences aléatoires menées chez Facebook — 500 millions d'observations utilisateur-expérience, 1,6 milliard d'impressions — les effets mesurés expérimentalement et ceux qu'auraient produits les méthodes observationnelles usuelles sur les mêmes données. ==Les méthodes observationnelles échouent à retrouver l'effet causal, même en conditionnant sur un jeu très large de variables démographiques et comportementales==[^10].

Ce qui a changé en 2026, ce n'est pas la validité de ce constat, c'est son coût politique. Trois évolutions l'ont poussé hors du service mesure et jusqu'au comité de direction.

D'abord, la **perte de signal** a détruit l'illusion de complétude. Les identifiants tiers se sont raréfiés, les fenêtres d'attribution se sont raccourcies, une part croissante des conversions remontées par les régies est modélisée plutôt qu'observée. Un tableau de bord d'attribution qui donnait l'impression de couvrir 90 % du parcours en couvre aujourd'hui une fraction, et le reste est comblé par des estimations propriétaires que l'annonceur ne peut pas auditer.

Ensuite, le **retour du modèle de mix média** (MMM) a déplacé le problème sans le résoudre. Le MMM est revenu massivement — Meridian côté Google, PyMC-Marketing et Robyn côté logiciel libre — parce qu'il travaille sur des séries agrégées et résiste donc à la perte de signal. Mais un MMM est un modèle de régression sur des données d'observation : il hérite de la même faiblesse identificatoire que l'attribution. Il produit des courbes de rendement décroissant très convaincantes à partir de variations de budget que personne n'a décidées au hasard.

Enfin — et c'est le point décisif pour une direction — l'arbitrage budgétaire est devenu plus serré. Quand la question est « faut-il ajouter 10 % au budget média », un ROI faux dans un sens ou dans l'autre coûte quelques points de marge. Quand la question est « faut-il supprimer une ligne budgétaire de plusieurs millions », personne ne signe sur un chiffre observationnel.

C'est ce qui remet l'expérimentation géographique au centre. Elle est, à l'échelle d'un marché, **la seule source de variation exogène qu'une entreprise peut se procurer** : on décide de couper ou d'ajouter de la pression publicitaire dans certaines zones et pas dans d'autres, on choisit l'affectation, et la comparaison qui suit ne repose plus sur une hypothèse d'ignorabilité mais sur un acte. C'est aussi, accessoirement, la seule méthode qui fonctionne pour les canaux hors ligne, pour la télévision, pour l'affichage — c'est-à-dire précisément là où l'attribution n'a jamais rien eu à dire.

Le dossier `ia-causale-retail` s'arrêtait sur ce constat : le graphe causal est ce qui porte le risque, et sa validation ne peut pas être un score de prédiction. Le présent dossier prend la suite par l'autre bout — non pas comment identifier un effet à partir de données existantes, mais **comment une entreprise se dote de la capacité de produire des données qui identifient un effet**. La différence n'est pas méthodologique. Elle est organisationnelle et budgétaire.

---

## 2. Anatomie d'une expérience géographique

[SCHEMA-01]

Une expérience géographique est une expérience aléatoire dont l'unité n'est pas la personne mais la **zone ciblable par la publicité** : un *designated market area* (DMA) aux États-Unis, une région ou un département en France, une ville, un code postal selon la granularité que les régies acceptent. On assigne ces zones à un groupe traité et à un groupe témoin, on modifie la pression publicitaire dans le groupe traité — en l'ajoutant, en la coupant, en la déplaçant — et on compare les ventes observées à ce qu'elles auraient été sans l'intervention.

Trois périodes structurent le dispositif, et leur découpage est plus important que le choix de l'estimateur.

La **période pré-test** sert à apprendre la relation entre les zones. C'est elle qui produit le contrefactuel : la façon dont les ventes du groupe témoin prédisent celles du groupe traité en régime normal. Une période pré-test trop courte donne un contrefactuel instable ; trop longue, elle intègre des changements de structure (ouvertures de magasins, refonte du réseau, choc concurrentiel) qui ne vaudront plus pendant le test.

La **période de test** est celle où l'intervention est active. Sa durée n'est pas un paramètre de confort : elle détermine directement la précision. Google Ads, pour son produit *Conversion Lift* fondé sur la géographie, impose une durée minimale de 7 jours et maximale de 56[^14] — bornes qui trahissent l'arbitrage réel : en dessous d'une semaine on ne mesure que du bruit, au-delà de huit semaines la stabilité de l'environnement n'est plus crédible.

La **période de rémanence** est celle qu'on oublie systématiquement. Une campagne coupée continue de produire des conversions pendant plusieurs jours ou semaines ; une campagne ajoutée met du temps à produire son effet complet. Si la fenêtre de mesure s'arrête au dernier jour de diffusion, l'effet est sous-estimé ; si le test suivant démarre immédiatement, il hérite d'une contamination. ==La période de refroidissement entre deux tests est une contrainte de calendrier, et elle est la première victime des arbitrages de planification.==

En sortie, deux estimands distincts, qu'il faut choisir avant et non après.

Le **lift cumulé** répond à « combien de conversions supplémentaires cette campagne a-t-elle produites sur la période ». C'est la quantité naturelle quand on teste l'existence d'un effet, et c'est celle que produit un contrôle synthétique.

L'**iROAS** — *incremental return on ad spend*, retour incrémental sur dépense publicitaire — répond à « combien d'euros de chiffre d'affaires supplémentaire par euro dépensé ». C'est un rapport de deux différences, donc une quantité beaucoup plus instable, et c'est celle dont un directeur a besoin pour arbitrer. La tension entre ce que la méthode estime bien et ce que la décision réclame traverse tout le sujet.

Reste la particularité qui rend le design difficile, et qu'aucun manuel de test A/B ne prépare : **le nombre d'unités est petit et les unités sont très hétérogènes**. Il y a 210 DMA aux États-Unis, treize régions métropolitaines en France, une centaine de zones de chalandise exploitables pour un réseau de distribution national. Les ventes suivent une distribution à queue lourde — quelques zones pèsent une part disproportionnée du total. Une randomisation naïve sur trente unités dont l'une pèse 15 % du chiffre d'affaires produira, une fois sur deux, deux groupes qui n'ont rien de comparable. C'est ce problème — et non l'estimation — qui a occupé l'essentiel de la recherche méthodologique de la dernière décennie.

---

## 3. Quatre familles de méthodes, un seul arbitrage

[SCHEMA-02]

La littérature applicable tient en quatre familles, plus une cinquième qui n'est pas géographique mais qui répond à la même question quand la géographie ne suffit pas. Ce qui les sépare n'est pas la sophistication statistique mais le régime d'application : combien d'unités on a, à quel point elles sont hétérogènes, et ce que le résultat doit permettre de décider.

**La régression géographique (GBR)** est le texte fondateur. Vaver et Koehler, chez Google, ont formalisé en 2011 le geo-test moderne : on régresse la variation de ventes de chaque zone sur sa variation de dépense publicitaire, à travers les zones, et le coefficient se lit directement comme un iROAS[^1]. C'est élégant, c'est interprétable, et cela suppose qu'on dispose d'assez de zones pour que la régression transversale ait du sens.

**La régression temporelle (TBR)** a été développée précisément pour le cas où cette condition n'est pas remplie. Kerman, Wang et Vaver l'ont introduite en 2017 pour les situations où les zones disponibles sont peu nombreuses, jusqu'au cas limite d'un unique marché test comparé à un unique marché témoin[^2]. Au lieu de régresser à travers les zones, on apprend sur la période pré-test la relation entre la série temporelle du groupe témoin et celle du groupe traité, on projette cette relation pendant le test, et l'écart cumulé entre observé et prédit donne l'effet. ==Le passage de GBR à TBR n'est pas un raffinement : c'est un changement d'unité d'information, du nombre de zones vers le nombre de jours d'historique.==

**Le contrôle synthétique** généralise cette idée. Plutôt que de prendre le groupe témoin tel quel, on construit une combinaison pondérée des zones non traitées qui reproduit au mieux la trajectoire pré-test de la zone traitée — le « jumeau synthétique ». C'est la méthode retenue par **GeoLift**, la bibliothèque publiée en source ouverte par Meta, qui en fait une méthodologie de bout en bout : sélection des marchés, analyse de puissance a priori, exécution, analyse[^6]. Son argument commercial est cohérent avec l'époque : elle travaille sur des données agrégées au niveau du marché, donc elle est structurellement résistante à la perte de signal.

**L'appariement robuste** attaque le problème par le design plutôt que par l'estimation. Chen et Au ont proposé le *Trimmed Match*, un estimateur de l'iROAS sans hypothèse distributionnelle, explicitement construit pour résister aux queues lourdes : il écarte une fraction des paires les plus aberrantes avant d'estimer, ce qui évite qu'une seule zone atypique porte le résultat[^3]. Le travail de design associé apparie les zones deux à deux avant randomisation, de sorte que le tirage se fasse à l'intérieur de paires déjà comparables[^4]. L'extension **supergeo** pousse la logique plus loin : autoriser l'agrégation de plusieurs zones en unités composites pour améliorer la qualité d'appariement. Le problème devient NP-difficile — les auteurs le formulent en programme linéaire mixte en nombres entiers — mais l'amélioration sur données publicitaires réelles est significative, que les effets soient homogènes ou hétérogènes[^5].

**Le switchback**, enfin, n'est pas une méthode géographique : on alterne dans le temps l'exposition d'une même unité, plutôt que de séparer des unités dans l'espace. C'est la réponse quand les unités sont trop peu nombreuses ou trop interdépendantes pour être séparées — un marché national unique, une place de marché où l'offre et la demande se rencontrent. Bojinov, Simchi-Levi et Zhao en ont dérivé le design optimal sous différentes hypothèses sur la durée de l'effet de report, en formulant le choix des instants de bascule comme un problème d'optimisation minimax[^12]. Le résultat pratique à retenir : **la durée de l'effet de report détermine la fréquence de bascule optimale**, et un switchback dont les périodes sont plus courtes que la rémanence ne mesure rien.

L'arbitrage se résume donc ainsi. Beaucoup de zones homogènes et un besoin d'iROAS lisible : GBR ou Trimmed Match. Peu de zones, historique long : TBR ou contrôle synthétique. Une seule zone traitée : contrôle synthétique. Zones inséparables : switchback. Et dans tous les cas, le choix de la méthode pèse beaucoup moins lourd sur la qualité du résultat que le point traité à la section suivante.

---

## 4. Le mur de la puissance

[SCHEMA-03]

C'est ici que le sujet cesse d'être technique et devient budgétaire.

Le résultat le plus important de toute la littérature sur la mesure publicitaire n'est pas un estimateur, c'est un constat d'infaisabilité partielle. Lewis et Rao ont analysé vingt-cinq grandes expériences de terrain menées avec des distributeurs et des courtiers américains, la plupart touchant des millions de clients, représentant ensemble 2,8 millions de dollars de dépense publicitaire numérique. Leur conclusion : **l'intervalle de confiance médian sur le retour sur investissement dépasse 100 points de pourcentage**[^8]. Autrement dit, dans la moitié des cas, une expérience correctement menée sur des millions de personnes ne permet pas de distinguer un ROI de −50 % d'un ROI de +50 %.

La cause est mécanique. Les ventes individuelles sont extrêmement volatiles — un coefficient de variation de 10 est courant — alors que l'effet de la publicité, même rentable, est statistiquement minuscule au regard de cette dispersion. Il faut donc énormément d'observations pour extraire le signal : les auteurs estiment qu'une expérience informative peut aisément requérir **plus de dix millions de personnes-semaines**. Le corollaire qu'ils tirent est celui qui compte pour une direction : puisque l'effet vrai est petit devant le bruit, ==le biais de sélection des méthodes observationnelles est nécessairement du même ordre que l'effet qu'elles prétendent mesurer==. Ce n'est pas un problème de précision, c'est un problème de recevabilité.

L'expérience géographique n'échappe pas à cette économie. Elle l'aggrave même sur un point : en agrégeant les personnes en zones, elle réduit drastiquement le nombre d'unités indépendantes. Trente zones, ce sont trente points de données, quelle que soit la population qu'elles contiennent.

L'étude de simulation publiée par Recast en 2025 est, à ma connaissance, la mise à l'épreuve la plus directe de ce que valent réellement les outils disponibles. Le protocole est le bon : quatre bibliothèques ouvertes — CausalPy, Google Matched Markets, Google CausalImpact, Meta GeoLift — appliquées aux mêmes milliers de jeux de données simulés où **l'effet incrémental vrai est connu à l'avance**, mêmes marchés traités et témoins, seul l'outil d'analyse varie[^7].

Les résultats méritent d'être lus lentement.

GeoLift est le meilleur outil sur trois métriques sur quatre : sa couverture est la plus proche de la cible de 95 % (92–95 %), son taux de faux positifs est le plus bas (3–5 %), et ses estimations ponctuelles sont les plus proches de l'effet vrai dans la plupart des scénarios. CausalPy et CausalImpact se dégradent le plus fortement quand les données se raréfient : leur taux de faux positifs **dépasse 24 %**, ce qui signifie qu'environ un test « gagnant » sur quatre, dans ce régime, n'est que du bruit.

Mais le résultat qui devrait figurer sur la première diapositive de tout comité de mesure est l'autre face du même arbitrage : dans les scénarios de rareté, GeoLift **rate 89 à 96 % des effets réellement présents**, et ses intervalles de confiance sont assez larges pour contenir simultanément l'effet vrai et zéro. L'outil le plus prudent du marché est prudent au point de ne presque rien détecter.

Il faut nommer clairement ce que cela implique, parce que c'est l'inverse de ce qui se pratique.

**Un test non concluant n'est pas une information neutre.** Dans l'usage courant, un geo-test qui ne rejette pas l'hypothèse nulle est interprété comme « ce canal n'est pas incrémental », et sert à justifier une coupe budgétaire. Si la puissance du test est de 5 %, cette lecture est simplement fausse : le test n'avait aucune chance de détecter un effet même important. Le résultat ne dit rien sur le canal ; il dit que le dispositif était sous-dimensionné. La dépense engagée — le budget témoin sacrifié, le temps de l'équipe, le coût politique de la négociation avec le métier — a produit zéro information.

D'où la seule discipline qui tienne : **l'effet minimal détectable (MDE) se calcule avant le test, et il conditionne la décision de le lancer**. La question à poser en amont n'est pas « ce test sera-t-il significatif » mais « quel est le plus petit effet que ce dispositif peut détecter, et cet effet est-il plus petit que celui qui changerait ma décision ». Si le MDE est de 15 % de lift alors qu'un lift de 8 % suffirait à justifier le budget, le test est inutile avant même d'avoir commencé. GeoLift intègre d'ailleurs cette analyse de puissance dans son flux de travail nominal[^6] — la fonctionnalité existe, elle est simplement ignorée dans la précipitation du lancement.

---

## 5. Le budget délibérément sacrifié

[SCHEMA-04]

Voici le poste que je ne vois presque jamais chiffré dans un plan de mesure, et qui est pourtant le seul qui compte.

Les outils sont gratuits. GeoLift, Matched Markets, CausalImpact, Trimmed Match, CausalPy sont tous publiés en source ouverte. L'analyse mobilise un analyste pendant quelques jours. Le coût réel d'une expérience géographique, c'est **le chiffre d'affaires qu'on renonce à produire dans le groupe témoin**.

Quand on coupe la publicité dans 20 % du territoire pendant six semaines pour mesurer son effet, on perd — si la publicité est effectivement incrémentale — une part des ventes de ces zones pendant cette période. Le paradoxe est parfait : plus la campagne est efficace, plus le test coûte cher, et plus il est justifié de le mener. La littérature de terrain le formule sans détour : introduire un groupe témoin, c'est délibérément ne pas commercialiser à ce groupe, et c'est un coût d'opportunité inévitable de la mesure — qui crée une tension permanente avec les équipes commerciales jugées sur le chiffre d'affaires du trimestre.

Cette tension est la vraie raison pour laquelle les programmes d'expérimentation échouent. Elle n'est pas statistique, elle est organisationnelle : le coût de la mesure est immédiat, visible, imputable à une région ou à un responsable identifiable ; son bénéfice est différé, diffus, et bénéficie à l'allocation globale. Sans arbitrage explicite au niveau où le budget global est tenu, l'échelon local a toujours raison de refuser.

Le dimensionnement se joue alors sur trois curseurs qui se contraignent mutuellement.

**La taille du groupe témoin.** Plus il est grand, plus le contrefactuel est précis, plus le coût d'opportunité est élevé. La relation n'est pas linéaire : la précision progresse comme la racine du nombre d'unités, le coût progresse proportionnellement. Le rendement de la précision décroît donc vite.

**La durée.** Elle achète de la précision à un coût proportionnel, mais elle achète aussi du risque : plus le test est long, plus la probabilité qu'un événement exogène — promotion concurrente, météo, actualité — contamine la comparaison augmente. Les bornes de 7 à 56 jours du produit Google[^14] encadrent le compromis usuel.

**L'ampleur de l'intervention.** Couper totalement est plus puissant que réduire de 30 %, et beaucoup plus coûteux. C'est le curseur le moins discuté et souvent le plus rentable : un test de coupe totale sur un petit nombre de zones sera plus informatif, pour un coût total identique, qu'un test de réduction partielle sur beaucoup de zones.

Il existe une exception spectaculaire à cette économie, et il faut comprendre pourquoi elle n'est pas accessible à l'annonceur. Les **publicités fantômes** (*ghost ads*), formalisées par Johnson, Lewis et Nubbemeyer, consistent pour la plateforme publicitaire à enregistrer, pour chaque utilisateur du groupe témoin, l'occasion où elle *aurait* servi l'annonce s'il avait été traité[^11]. Le groupe témoin voit ce que la plateforme aurait diffusé en l'absence de la campagne, et la comparaison se fait entre exposés et contrefactuels exacts. Le gain est considérable : les auteurs montrent qu'on mesure le lift avec la même précision **en dépensant au moins un ordre de grandeur de moins**, et leur mise en œuvre enregistre plus de cent millions de publicités fantômes prédites par jour. Dans une démonstration sur une campagne de reciblage, le lift mesuré était de +17,2 % sur les visites et +10,5 % sur les achats.

Cette technique suppose l'accès aux journaux de décision du moteur d'enchères. Elle appartient donc structurellement à la plateforme. ==L'annonceur qui veut mesurer sans dépendre de la plateforme paie le prix fort ; celui qui accepte la mesure de la plateforme obtient une précision bien supérieure au prix d'une dépendance — c'est un arbitrage de souveraineté déguisé en choix méthodologique.==

Reste le seuil d'entrée. Les retours de terrain convergent sur une observation simple : sous un certain volume de dépense, le coût du groupe témoin dépasse la valeur de la décision qu'il éclaire, et l'adoption est marginale ; au-delà, le test géographique en continu devient la norme. Pour une direction, la conséquence pratique est qu'il faut **calculer ce seuil pour son propre portefeuille** avant de construire un programme — et accepter qu'en dessous, la bonne réponse soit d'acheter quelques tests ponctuels plutôt que de bâtir une capacité.

---

## 6. Cinq façons de rater un geo-test

[SCHEMA-05]

Les échecs se répètent avec une régularité qui permet de les cataloguer. Aucun n'est exotique ; tous sont détectables au moment du design.

**Le débordement.** Techniquement une violation de l'hypothèse SUTVA — l'hypothèse selon laquelle le résultat d'une unité ne dépend que de son propre traitement. Si les habitants des zones traitées se déplacent vers les zones témoins, si les médias débordent des frontières administratives, ou si le ciblage géographique de la régie est approximatif, le groupe témoin est partiellement traité et **l'effet mesuré est comprimé vers zéro**. La parade standard est le tampon géographique : exclure du groupe témoin les zones adjacentes aux zones traitées, au prix d'une perte d'unités. La parade sophistiquée est le regroupement en supergeos assez larges pour que le débordement devienne négligeable[^5]. La détection se fait par analyse de décroissance avec la distance : si l'effet apparent dans les zones témoins varie avec leur proximité aux zones traitées, le débordement est confirmé.

**La rémanence.** L'effet publicitaire persiste après l'arrêt de la diffusion, et le délai de conversion décale les ventes par rapport aux expositions. Un test dont la fenêtre de mesure coïncide exactement avec la fenêtre de diffusion sous-estime systématiquement l'effet. Le symptôme classique est un test de coupe qui conclut à un effet nul parce que les conversions résiduelles ont maintenu les ventes pendant les deux semaines mesurées. La parade est double : allonger la fenêtre de mesure au-delà de la fin de diffusion, et imposer une période de refroidissement avant le test suivant.

**La saisonnalité et les chocs exogènes.** Le contrefactuel appris en période pré-test suppose que la relation entre zones reste stable. Une campagne concurrente régionale, une opération commerciale non coordonnée, un événement local suffisent à la casser. Le risque croît avec la durée du test — c'est l'argument le plus solide contre les tests très longs. La parade est un test A/A préalable : rejouer l'analyse sur une période sans intervention, et vérifier que l'effet estimé est bien nul. ==Un test A/A qui trouve un effet significatif est le seul diagnostic honnête qu'on puisse produire avant d'engager le budget.==

**La sélection des marchés après coup.** Le péché capital. Le contrôle synthétique laisse à l'analyste plusieurs degrés de liberté : quelles zones dans le vivier de donneurs, quelle fenêtre pré-test, quelle variable de correspondance. Explorer ces choix après avoir vu le résultat, puis retenir la spécification qui donne le lift le plus favorable, produit un chiffre dont la p-valeur ne veut plus rien dire. C'est d'autant plus tentant que l'exploration est peu coûteuse et facile à justifier a posteriori (« ce marché était atypique »). La seule parade est procédurale : **figer la spécification par écrit avant l'ouverture des données de test**, et traiter toute déviation comme une analyse exploratoire explicitement étiquetée comme telle.

**Le test unique surinterprété.** L'erreur qui coûte le plus cher, parce qu'elle est structurelle. Un test donne un intervalle, souvent large, sur un canal, sur une période, dans un contexte concurrentiel donné. En faire une vérité générale sur l'incrémentalité du canal — et réallouer plusieurs millions sur cette base — c'est traiter un tirage comme une loi. Cela vaut symétriquement pour les résultats favorables et défavorables. La parade n'est pas méthodologique mais programmatique, et c'est l'objet de la section suivante : ce n'est pas un test qui informe, c'est une série.

---

## 7. La boucle : du test au prior, du prior au budget

[SCHEMA-06]

Ce qui transforme une dépense de mesure en actif, c'est le mécanisme par lequel un résultat d'expérience se propage dans les décisions ultérieures, y compris celles qui ne font l'objet d'aucun test.

Le débat « MMM contre tests d'incrémentalité » est un faux débat, et le fait qu'il occupe encore des comités en 2026 est un symptôme. Les deux objets ne répondent pas à la même question. Le test répond avec précision sur un canal, une période et un périmètre étroits, au prix d'un budget sacrifié. Le modèle de mix média couvre tous les canaux en continu, sans coût d'opportunité, mais sans identification causale propre. L'articulation évidente consiste à **utiliser le test pour identifier ce que le modèle ne peut pas identifier seul**.

C'est exactement le mécanisme de calibration exposé dans la documentation de Meridian : plutôt que de laisser le modèle estimer librement le rendement d'un canal à partir de variations non contrôlées, on pose un *prior* directement sur le ROI de ce canal, informé par le résultat d'une expérience passée[^13]. L'expérience apporte l'information exogène ; le modèle la propage à l'ensemble du portefeuille, dans le temps, et sur les canaux non testés via la structure du modèle. Le résultat expérimental cesse d'être un point isolé et devient une contrainte sur la surface d'allocation.

Deux précautions structurent cette boucle, et elles sont souvent escamotées.

**La correspondance de périmètre.** Un test mesure un effet sur un canal, à un niveau de pression donné, à une période donnée. Le prior qu'on en dérive doit porter sur le même objet. Calibrer le rendement annuel d'un canal entier avec un test mené sur une sous-région et un format particulier en pleine saison creuse revient à importer une précision qui n'existe pas.

**La péremption.** Un résultat d'incrémentalité vieillit. Le mix concurrentiel change, les algorithmes d'enchères des régies changent, le point de saturation se déplace. Un prior calibré sur un test de dix-huit mois n'est pas une donnée, c'est un souvenir. C'est le premier argument pour la cadence — non pas « tester beaucoup » mais **maintenir la fraîcheur du stock de résultats**.

D'où la forme que prend concrètement la capacité. Les praticiens qui opèrent des programmes durables convergent sur une cadence de l'ordre de **six à douze tests par an**, organisée comme une feuille de route plutôt que comme une file de demandes : le canal le plus doté testé en début d'année, un canal de haut d'entonnoir au trimestre suivant, un test de croissance sur un canal émergent, et un temps réservé au recalibrage du modèle avant l'exercice de planification annuelle. L'important n'est pas le nombre exact — il dépend du portefeuille et du seuil calculé à la section 5 — mais le fait que la question testée soit **choisie en fonction de la décision qu'elle éclaire**, et non de la disponibilité de l'équipe.

Cette feuille de route a une conséquence budgétaire qu'il faut assumer : le budget témoin doit être **provisionné en début d'exercice, au niveau où le budget média global est tenu**, et non négocié test par test avec les responsables de canaux. Une ligne « mesure » qui vaut une fraction du budget média, arbitrée une fois par an, résout la tension décrite à la section 5 mieux que n'importe quelle argumentation méthodologique. Elle a aussi le mérite de rendre visible ce que la mesure coûte réellement — ce qui est, en soi, un progrès de gouvernance.

---

## 8. Gouvernance des résultats

[SCHEMA-07]

Il reste la partie que la littérature technique ne traite pas et qui décide de tout : qui a le droit de dire qu'un test est concluant.

**La règle de décision pré-enregistrée.** Avant l'ouverture des données, un document d'une page fixe : l'hypothèse, l'estimand, la spécification d'analyse, le MDE calculé, le seuil de décision, et surtout **ce qui sera fait dans chacun des cas de figure, y compris le cas non concluant**. Ce dernier point est celui qu'on omet, et c'est celui qui produit le plus de valeur : si l'organisation ne sait pas à l'avance ce qu'elle fera d'un intervalle large, elle improvisera une lecture favorable à la position déjà défendue. Le pré-enregistrement n'est pas un formalisme académique importé ; c'est le seul mécanisme connu pour empêcher qu'une mesure coûteuse serve à confirmer une conviction préexistante.

**Le registre des tests.** Un inventaire tenu dans la durée : date, canal, périmètre géographique, design, MDE, résultat, intervalle, décision prise, et date de péremption estimée. Il sert trois usages qu'aucun tableau de bord ne couvre. Il évite de refaire un test déjà mené (fréquent en organisation fédérée). Il rend visible le taux réel de tests concluants — souvent inférieur à la moitié, ce qui est une information de pilotage majeure sur le dimensionnement du programme. Et il documente la source de chaque prior injecté dans le modèle, ce qui est la condition pour qu'un tiers puisse auditer une allocation. C'est le même objet, dans son principe, que le registre des cas d'usage en gouvernance de l'IA : un inventaire opposable plutôt qu'une liste tenue par une personne.

**Le conflit du juge et partie.** C'est le point le plus délicat à porter en comité, et il faut le poser froidement. Les outils de mesure d'incrémentalité les mieux dotés sont ceux des régies elles-mêmes : Conversion Lift géographique côté Google — accessible via le représentant commercial du compte, sur des campagnes qui ne peuvent participer qu'à une étude à la fois[^14] — et les dispositifs équivalents chez les autres plateformes. Ces produits sont techniquement excellents ; ils bénéficient notamment de l'avantage structurel des publicités fantômes que l'annonceur ne peut pas répliquer[^11]. Mais ils mesurent la performance du vendeur, avec les données du vendeur, selon la méthodologie du vendeur, dans un périmètre que le vendeur définit. Ce n'est pas une accusation de mauvaise foi : c'est une structure d'incitation, et elle ne se corrige pas par la bonne volonté.

La réponse raisonnable n'est pas le refus — se priver des outils de la régie coûte cher en précision — mais la **triangulation contractualisée** : accepter la mesure de la plateforme, exiger l'accès aux résultats détaillés plutôt qu'à la synthèse, et conserver la capacité de mener au moins un test indépendant par an sur les canaux les plus dotés. La ligne à écrire dans le contrat de la régie est moins « nous refusons votre mesure » que « nous nous réservons le droit de la vérifier, et voici à quelle fréquence ».

**Faire ou acheter.** Trois configurations existent, et le choix dépend moins de la maturité technique que du volume et de la fréquence.

*Acheter au coup par coup* — mandater une agence ou un prestataire pour un test ponctuel. Pertinent en dessous du seuil de financement, ou pour une question isolée. Le risque est l'absence de cumul : chaque test repart de zéro, rien n'alimente de modèle, et le résultat périme sans successeur.

*Acheter la capacité* — souscrire à une plateforme de mesure d'incrémentalité en continu. On achète la cadence, l'outillage, l'analyse, et souvent l'intégration au modèle de mix. On achète aussi une dépendance : la méthodologie est celle du prestataire, la comparabilité dans le temps dépend de sa continuité, et la sortie coûte cher parce que l'historique des tests ne se transporte pas toujours.

*Construire* — internaliser sur des bibliothèques ouvertes. Le coût logiciel est nul, le coût réel est un profil rare (économétrie appliquée et inférence causale, pas science des données généraliste) et la discipline de programme. Ce qui justifie l'internalisation n'est pas l'économie de licence mais **la propriété du dispositif expérimental** : la capacité de choisir ce qu'on teste, y compris ce qui dérange, et de conserver un historique cumulatif que personne ne peut retirer.

Dans les trois cas, une chose ne se délègue pas : l'instance qui arbitre. Une capacité d'expérimentation sans comité qui tranche produit des résultats que chacun lit à sa convenance — c'est-à-dire la situation que le programme était censé corriger.

---

## 9. Ce que ça change pour une direction data

Le sujet paraît technique et ne l'est pas. Une direction data qui veut construire cette capacité prend cinq décisions, et aucune n'est un choix d'algorithme.

**Provisionner le budget témoin comme une ligne.** Une fraction du budget média, arbitrée une fois par an au niveau où le budget global est tenu, jamais négociée test par test avec les responsables de canaux. C'est la décision qui débloque toutes les autres.

**Calculer le MDE avant de lancer, et renoncer quand il est trop grand.** Un test sous-puissant n'est pas un demi-test, c'est une dépense sans contrepartie. La discipline consiste à refuser de lancer plus souvent qu'à lancer.

**Passer d'un test à un programme.** Six à douze tests par an, calés sur les décisions du calendrier de planification, avec une période de refroidissement respectée entre deux tests sur le même périmètre.

**Fermer la boucle sur le modèle.** Chaque résultat devient un prior calibré dans le modèle de mix, avec correspondance de périmètre et date de péremption. Sans cette boucle, la valeur du test s'arrête à la décision qu'il a directement éclairée.

**Instituer la règle de décision et le registre.** Pré-enregistrement d'une page avant ouverture des données, registre tenu dans la durée, et une instance qui a seule le droit de déclarer un test concluant.

Et cinq questions à poser avant de signer un plan de mesure, qui suffisent à distinguer un dispositif sérieux d'un exercice de présentation :

1. Quel est le plus petit effet que ce dispositif peut détecter, et est-il plus petit que celui qui changerait notre décision ?
2. Combien de chiffre d'affaires renonçons-nous à produire pour mener ce test, et qui a validé ce montant ?
3. Qu'écrirons-nous dans la note de synthèse si l'intervalle contient zéro ?
4. Qui mesure — et si c'est le vendeur, quand vérifions-nous nous-mêmes ?
5. Où ce résultat sera-t-il rangé, et dans combien de temps cessera-t-il d'être valable ?

La question posée en ouverture — « ce ROAS de 8, il vient d'où ? » — n'admet qu'une réponse défendable en 2026 : d'une variation qu'on a décidée, sur un périmètre qu'on a défini, selon une règle qu'on avait écrite avant de regarder. Tout le reste est de la corrélation bien présentée.

---

*Format co-écrit avec l'aide d'une IA. Les chiffres cités proviennent des sources listées ci-dessous ; les ordres de grandeur de coût et de cadence sont des repères de terrain, pas des mesures.*

## Sources

[^1]: Jon Vaver et Jim Koehler, *Measuring Ad Effectiveness Using Geo Experiments*, Google Inc., 2011. https://research.google/pubs/measuring-ad-effectiveness-using-geo-experiments/

[^2]: Jouni Kerman, Peng Wang et Jon Vaver, *Estimating Ad Effectiveness using Geo Experiments in a Time-Based Regression Framework*, Google Inc., 2017. https://research.google/pubs/estimating-ad-effectiveness-using-geo-experiments-in-a-time-based-regression-framework/

[^3]: Aiyou Chen et Timothy C. Au, *Robust Causal Inference for Incremental Return on Ad Spend with Randomized Paired Geo Experiments*, Annals of Applied Statistics 16(1), 2022. https://arxiv.org/abs/1908.02922

[^4]: Aiyou Chen et al., *Trimmed Match Design for Randomized Paired Geo Experiments*, 2021. https://arxiv.org/abs/2105.07060

[^5]: Aiyou Chen, Nick Doudchenko, Shunhua Jiang, Cliff Stein et Bicheng Ying, *Supergeo Design: Generalized Matching for Geographic Experiments*, 2023. https://arxiv.org/abs/2301.12044

[^6]: Meta (facebookincubator), *GeoLift — Methodology*, documentation du projet. https://facebookincubator.github.io/GeoLift/docs/Methodology/

[^7]: Recast, *Open-Source Geo-Experiment Tools — A Head-to-Head Simulation Study*, 2025. https://research.getrecast.com/geolift-sim-study

[^8]: Randall A. Lewis et Justin M. Rao, *The Unfavorable Economics of Measuring the Returns to Advertising*, The Quarterly Journal of Economics 130(4), 2015, p. 1941-1973. https://academic.oup.com/qje/article-abstract/130/4/1941/1914592

[^9]: Thomas Blake, Chris Nosko et Steven Tadelis, *Consumer Heterogeneity and Paid Search Effectiveness: A Large-Scale Field Experiment*, Econometrica 83(1), 2015, p. 155-174. https://www.nber.org/papers/w20171

[^10]: Brett R. Gordon, Florian Zettelmeyer, Neha Bhargava et Dan Chapsky, *A Comparison of Approaches to Advertising Measurement: Evidence from Big Field Experiments at Facebook*, Marketing Science 38(2), 2019. https://pubsonline.informs.org/doi/10.1287/mksc.2018.1135

[^11]: Garrett A. Johnson, Randall A. Lewis et Elmar I. Nubbemeyer, *Ghost Ads: Improving the Economics of Measuring Online Ad Effectiveness*, Journal of Marketing Research 54(6), 2017. https://journals.sagepub.com/doi/abs/10.1509/jmr.15.0297

[^12]: Iavor Bojinov, David Simchi-Levi et Jinglong Zhao, *Design and Analysis of Switchback Experiments*, Management Science 69(7), 2022, p. 3759-3777. https://arxiv.org/abs/2009.00148

[^13]: Google, *Meridian — Calibrate treatment priors*, documentation développeur. https://developers.google.com/meridian/docs/advanced-modeling/roi-priors-and-calibration

[^14]: Google Ads Help, *Set up Conversion Lift based on geography*. https://support.google.com/google-ads/answer/14097193
