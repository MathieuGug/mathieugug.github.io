{
  "schema-01": {
    title: "Où la déclaration entre dans la chaîne",
    regions: {
      "adstock": {
        title: "Déclaration 1 · La rémanence",
        body: "Combien de semaines l'effet d'une exposition peut-il durer ? Le modèle ne le découvre pas seul : on lui donne une forme de décroissance et un intervalle admissible.\n\nMeridian tire ce paramètre d'une loi uniforme entre 0 et 1 par défaut [1]. Robyn demande à l'utilisateur de borner l'intervalle canal par canal, par exemple en disant que la demi-vie de l'effet télévisé se situe entre deux et huit semaines [6].\n\nC'est la déclaration la plus discrète des trois, parce qu'elle porte sur une grandeur que personne ne vérifie en comité. Elle a pourtant un effet direct : allonger la rémanence autorisée d'un canal lui attribue les ventes des semaines suivantes."
      },
      "saturation": {
        title: "Déclaration 2 · La saturation",
        body: "À partir de quel niveau de dépense chaque euro supplémentaire rend-il moins que le précédent ? C'est la courbe qui décide de la recommandation de réallocation, puisqu'elle détermine où le budget marginal est le mieux placé.\n\nMeridian la paramètre par une fonction de Hill dont le point d'inflexion suit par défaut une loi normale tronquée centrée sur 0,8 [1]. PyMC-Marketing laisse la spécification entièrement libre, et c'est sur cette courbe que sa méthode de calibration fait porter l'information expérimentale plutôt que sur le niveau moyen du retour [7].\n\nDeux modèles qui ajustent la même série de ventes avec des courbes de saturation différentes rendent des recommandations opposées sur le budget marginal."
      },
      "prior-roi": {
        title: "Déclaration 3 · Le retour lui-même",
        body: "La déclaration la plus engageante, et la seule des trois qu'un directeur média sait lire. Meridian place la loi a priori directement sur le retour sur investissement du canal, et non sur un coefficient de régression intermédiaire.\n\nLa valeur par défaut est une loi log-normale de paramètres 0,2 et 0,9 [1], de médiane environ 1,2 : un canal est réputé rentable avant toute donnée. Quand l'indicateur suivi n'est pas du revenu, l'ancrage bascule sur la contribution totale du média payant, fixée à 40 % en moyenne avec un écart-type de 20 % [3].\n\nDéclarer sur une grandeur interprétable rend la déclaration contestable, donc gouvernable. C'est la vertu de ce choix, et personne n'en profite tant que la valeur ne figure pas dans le livrable."
      },
      "posterior": {
        title: "Ce qui sort du modèle",
        body: "Le chiffre remonté au comité est une distribution a posteriori, c'est-à-dire le résultat d'un arbitrage entre deux sources d'information : ce que 104 à 156 semaines de données supportent, et ce que les trois déclarations précédentes imposent.\n\nLe poids relatif des deux sources n'est ni choisi ni affiché. Il se déduit de la richesse du signal contenu dans les données : fort pour un canal coupé puis relancé, nul pour un canal maintenu au même niveau pendant trois ans.\n\nAucun indicateur du tableau de bord de qualité ne dit dans quelle proportion le résultat vient de l'une ou de l'autre. C'est le trou que ce dossier propose de combler par une fiche d'a priori jointe au livrable."
      }
    }
  },

  "schema-02": {
    title: "Le budget d'information",
    regions: {
      "donnees": {
        title: "Ce dont on dispose",
        body: "Un modèle de mix national travaille sur des séries hebdomadaires. Trois ans de recul donnent 156 points, deux ans en donnent 104.\n\nAllonger l'historique ne résout rien : au-delà de trois ans, l'entreprise a changé de gamme, de périmètre ou de stratégie, et les semaines anciennes décrivent un autre monde. Elles dégradent l'estimation au lieu de l'enrichir, en mélangeant des régimes que le modèle traite comme un seul.\n\nChan et Perry ouvrent leur exposé des difficultés de l'exercice par cette question du volume de données disponible, avant même d'aborder le biais de sélection et la spécification [8]. C'est la contrainte de base, et elle n'a pas bougé depuis 2017."
      },
      "parametres": {
        title: "Ce qu'il faut estimer",
        body: "Pour douze canaux, le modèle estime au minimum trois paramètres chacun : un coefficient d'effet, un paramètre de rémanence, un paramètre de saturation. Soit trente-six.\n\nS'y ajoutent la tendance et la saisonnalité, une quinzaine de paramètres selon la finesse retenue ; les variables de contrôle, prix, promotion, distribution ; et la variance résiduelle. On arrive à une cinquantaine de paramètres dans une configuration ordinaire, davantage si le modèle est géographique et porte une structure hiérarchique par région.\n\nLe décompte présenté ici est un ordre de grandeur établi pour ce dossier sur une configuration nationale à douze canaux. Il varie selon les choix de spécification, jamais d'un ordre de grandeur."
      },
      "zone-sous-determinee": {
        title: "La zone où le modèle ne tranche plus",
        body: "Environ 2,7 observations par paramètre, là où la règle usuelle en régression en demande dix à vingt. Le problème est sous-déterminé au sens propre : plusieurs jeux de valeurs très différents expliquent la série observée aussi bien l'un que l'autre.\n\nEt la colinéarité aggrave le compte. Deux canaux poussés ensemble pendant deux ans n'apportent pas deux fois l'information d'un canal : ils sont statistiquement indiscernables, et le nombre d'observations réellement informatives est inférieur au nombre d'observations disponibles.\n\nAucune méthode fréquentiste ne rend de résultat exploitable dans cette situation. L'approche bayésienne en rend un, et elle le fabrique en partie à partir de ce qu'on lui a déclaré."
      }
    }
  },

  "schema-03": {
    title: "Trois piles, trois surfaces de déclaration",
    regions: {
      "meridian": {
        title: "Meridian · Google",
        body: "Mise à disposition générale le 29 janvier 2025, après une phase de test auprès de plusieurs centaines de marques et avec plus de vingt partenaires de mesure certifiés [4]. Remplace LightweightMMM, déprécié peu après.\n\nSa surface de déclaration est la plus explicite des trois : la loi a priori porte sur le retour du canal, grandeur qu'un directeur média sait lire. Les valeurs par défaut sont publiques et vérifiables ligne à ligne dans le dépôt [1].\n\nLa calibration passe par un outil dédié qui traduit un résultat d'expérience en a priori, avec intégration directe de GeoX [2]. C'est la pile la plus auditable, et aussi celle dont l'a priori contraint le résultat le plus directement."
      },
      "robyn": {
        title: "Robyn · Meta",
        body: "Distribuée en R et en Python, toujours activement maintenue en 2026 [6]. Elle n'est pas bayésienne : elle combine une régression ridge et une optimisation sans gradient des hyperparamètres, et rend un front de Pareto de modèles entre lesquels l'analyste tranche.\n\nLa déclaration existe malgré tout, déplacée vers les bornes d'hyperparamètres de rémanence et de saturation. Elle porte sur la forme de l'effet et jamais sur son ampleur, ce qui la rend plus discrète et plus difficile à auditer qu'une loi a priori sur le retour.\n\nLa calibration entre par un troisième objectif d'optimisation, une erreur en pourcentage entre l'effet impliqué et l'effet mesuré : elle devient un critère de sélection de modèle plutôt qu'une information injectée."
      },
      "pymc": {
        title: "PyMC-Marketing · indépendant",
        body: "La seule des trois à ne pas être publiée par un vendeur d'espace publicitaire. Bibliothèque bayésienne générale, où l'utilisateur spécifie chaque loi a priori et assume chaque choix.\n\nSa contribution la plus intéressante concerne la calibration : plutôt que de traduire une expérience en a priori sur le retour, elle ajoute une vraisemblance portant directement sur la courbe de saturation, avec une loi Gamma justifiée par la monotonie de la courbe et la positivité des effets mesurés [7]. L'expérience informe alors la forme et pas seulement le niveau.\n\nLe revers de la liberté est l'absence de trace. Un modèle Meridian mal calibré expose ses défauts dans un fichier public ; un modèle PyMC-Marketing mal spécifié n'expose rien du tout."
      }
    }
  },

  "schema-04": {
    title: "Ce que l'a priori pèse, selon ce que les données disent",
    regions: {
      "signal-fort": {
        title: "Cas 1 · Signal fort",
        body: "Le canal a été coupé puis relancé, ou son budget a varié largement, et il n'a pas bougé en même temps que les autres. La vraisemblance issue des données est étroite et située loin de l'a priori.\n\nDans ce cas, le résultat suit les données et l'a priori s'efface presque entièrement. C'est le fonctionnement nominal du dispositif bayésien, et c'est le cas dans lequel un modèle de mix mérite pleinement sa réputation.\n\nIl est rare. Il suppose une variation délibérée de la pression sur un canal, donc une expérience ou un accident de plan média, et un canal suffisamment isolé des autres pour que l'effet lui soit attribuable."
      },
      "signal-faible": {
        title: "Cas 2 · Signal faible",
        body: "Le budget du canal est resté stable, et il a été poussé en même temps que deux autres. La vraisemblance issue des données est large et plate : elle réduit l'espace des valeurs possibles sans désigner la bonne.\n\nLe résultat est alors un compromis, et la position de ce compromis dépend de l'a priori autant que des données. Deux analystes partant d'a priori différents sur le même jeu de données rendront des recommandations de réallocation différentes, chacune assortie d'un intervalle qui paraîtra raisonnable.\n\nC'est le cas ordinaire, celui que décrivent le décompte de paramètres du schéma 02 et la borne de bruit de Lewis et Rao [12]."
      },
      "signal-absent": {
        title: "Cas 3 · Signal absent",
        body: "Le canal est maintenu au même niveau depuis trois ans, ou l'indicateur suivi n'a pas de valeur monétaire et n'a pas été calibré. Les données ne contiennent aucune information qui discrimine.\n\nLe résultat est alors l'a priori, au bruit d'échantillonnage près. Sur un indicateur non monétaire sans calibration, Meridian ancre la contribution totale du média payant à 40 % en moyenne avec un écart-type de 20 % [3] : c'est ce chiffre qui ressort, et c'est lui qui déplace la frontière entre les canaux qu'on renforce et ceux qu'on coupe.\n\nÀ l'écran, la sortie de ce cas ressemble exactement à celle du cas 1. Rien dans la présentation ne les distingue."
      }
    }
  },

  "schema-05": {
    title: "D'où vient l'a priori, et ce que chaque origine engage",
    regions: {
      "experience-propre": {
        title: "Origine 1 · L'expérience propre",
        body: "L'annonceur a modifié la dépense sur un sous-ensemble de régions, conservé un groupe témoin, et mesuré l'écart. Le résultat devient l'a priori du canal.\n\nC'est la seule origine qui coche les trois colonnes : protocole écrit, intervalle publié, refaisable par un tiers qui dispose des mêmes données. Meridian fournit un outil dédié qui traduit un tel résultat en loi a priori sur le retour [2].\n\nSon coût n'est pas celui de l'outil, qui est gratuit, mais celui du budget délibérément mal alloué pendant la durée du test. Sur un canal significatif, une expérience de huit semaines sacrifie un ou deux points de performance sur la période."
      },
      "expert": {
        title: "Origine 2 · Le jugement d'expert",
        body: "Reprise d'un modèle antérieur, d'un référentiel sectoriel, ou de l'expérience accumulée d'un analyste. C'est la pratique majoritaire, et l'article fondateur de Google l'assume comme telle en présentant l'approche bayésienne comme un moyen de mobiliser la connaissance des modèles précédents [10].\n\nCette origine n'est pas illégitime : un analyste expérimenté sait qu'un canal de notoriété ne rend pas trois fois sa dépense la semaine même. Elle devient problématique pour une autre raison, qui est l'absence de trace.\n\nDans le fichier de configuration final, rien ne distingue un a priori mesuré d'un a priori supposé. Le modèle traite les deux exactement de la même façon, et le livrable aussi."
      },
      "vendeur": {
        title: "Origine 3 · L'étude du vendeur d'espace",
        body: "L'a priori provient d'une étude de lift fournie par la régie du canal concerné. Depuis le 9 septembre 2026 et la disponibilité mondiale de Meridian GeoX, le vendeur d'espace fournit le modèle, la bibliothèque d'expérimentation qui le calibre, et le pont entre les deux [5].\n\nL'objection courante est fausse : les outils de plateforme ne sont pas naïfs et ne cachent pas les biais qui les arrangent. Google a publié en 2018 la correction du biais de sélection qui gonflait la mesure de son propre canal search [9], et l'article qui recense les limites de l'exercice [8].\n\nL'objection porte sur la position, pas sur la méthode : l'annonceur reçoit un nombre qu'il ne peut ni auditer ni reproduire."
      },
      "verdict": {
        title: "Le verdict praticable",
        body: "Aucune origine n'est à interdire. Une étude de vendeur reste souvent la meilleure information disponible pour un canal donné, et s'en priver dégrade le modèle plutôt que de l'assainir.\n\nCe qui manque est la colonne qui dit laquelle a servi. Un a priori entre dans un modèle et n'en ressort plus sous forme de ligne séparée : il ne figure nulle part dans le résultat, il s'y est dissous. Il faut donc l'étiqueter avant l'estimation, au moment où c'est encore possible.\n\nTrois colonnes suffisent : canal, valeur déclarée, origine. La décision de gouvernance consiste ensuite à sommer la troisième colonne et à fixer un seuil au-delà duquel la dépense est pilotée par des chiffres invérifiables."
      }
    }
  },

  "schema-06": {
    title: "Le cycle annuel de calibration",
    regions: {
      "estimand": {
        title: "Le point de rupture d'estimand",
        body: "Google signale dans sa propre documentation que l'outil de calibration est conçu pour les expériences mesurant un lift incrémental moyen contre un contrefactuel de dépense nulle. Les expériences mesurant un lift marginal contre une dépense réduite ne sont pas recommandées, parce qu'elles introduisent une incompatibilité d'estimand [2].\n\nTraduit en termes de gestion : un test qui demande « et si on baissait de 20 % » ne calibre pas un modèle qui répond à « et si on ne dépensait rien ». Les deux nombres sont valides et ne répondent pas à la même question.\n\nOr le protocole le plus facile à faire accepter en interne est justement celui de la réduction partielle, parce qu'il est le moins risqué commercialement. Le piège est donc structurel."
      },
      "plan-test": {
        title: "Le plan de test",
        body: "La pièce qui n'existe presque jamais. Elle dit quels canaux sont testés, dans quel ordre, sur quelle durée, et avec quel budget délibérément sacrifié.\n\nDeux contraintes la déterminent. La rotation d'abord : une campagne unique ne couvre pas un portefeuille de douze canaux, et un plan réaliste se lit sur trois ans à raison d'un ou deux canaux par trimestre. La péremption ensuite : un a priori calibré vieillit avec la création, la pression concurrentielle et les changements d'algorithme des régies.\n\nUne calibration de 2024 utilisée en 2026 est un jugement d'expert déguisé en mesure. La règle de péremption est donc une pièce du plan, pas une précaution rédactionnelle."
      },
      "repartition": {
        title: "La répartition, et le retour de boucle",
        body: "Le modèle tourne, la répartition du budget de l'année suivante se décide, et cette répartition détermine ce qu'il sera possible de tester ensuite.\n\nUn canal qu'on réduit à presque rien devient inobservable, et son a priori se figera faute de données pour le contredire. Un canal qu'on maintient rigoureusement stable cesse de produire du signal. La décision de répartition est donc aussi une décision de mesure, prise sans être formulée comme telle.\n\nC'est l'argument principal pour loger le budget de calibration dans le plan média plutôt que dans le projet de modélisation : la même instance arbitre les deux, et l'arbitrage n'a de sens que fait ensemble."
      }
    }
  },

  "schema-07": {
    title: "Deux axes indépendants, un seul est mesuré",
    regions: {
      "indicateurs-comite": {
        title: "Ce que le comité regarde",
        body: "Coefficient de détermination, erreur en pourcentage absolu moyen, qualité de la prédiction hors échantillon. Ce sont les trois indicateurs qui figurent sur une note de synthèse de modèle de mix.\n\nIls mesurent tous la même chose : la capacité du modèle à reproduire la série de ventes observée. Autrement dit, ils lisent tous l'axe horizontal de cette matrice.\n\nAucun ne mesure le biais d'attribution entre canaux. Rien n'empêche un modèle d'ajuster parfaitement le total des ventes tout en répartissant l'effet entre les canaux de façon entièrement fausse : le total est une somme, et une somme juste se décompose de beaucoup de manières."
      },
      "ce-qui-detecte": {
        title: "Ce qui lit l'axe vertical",
        body: "Une source d'information extérieure au modèle, et il n'y en a qu'une : l'expérience randomisée.\n\nElle ne figure sur aucun tableau de bord de qualité, parce qu'elle n'est pas une propriété du modèle mais une pièce indépendante qu'il faut avoir produite. C'est ce qui rend la calibration structurante : au-delà d'améliorer l'estimation, elle est le seul instrument capable de dire si l'estimation est biaisée.\n\nConséquence pratique pour une direction : un dispositif de mesure sans budget d'expérimentation n'a aucun moyen de savoir dans quel quadrant il se trouve. Il peut seulement savoir s'il est à gauche ou à droite."
      },
      "bon-ajustement-fort-biais": {
        title: "Le quadrant dangereux",
        body: "Bon ajustement, fort biais d'attribution. La courbe de ventes est reproduite, le total est juste, tous les contrôles usuels passent, et l'effet a été attribué au mauvais canal.\n\nDeux travaux indépendants montrent que ce quadrant est peuplé. Gordon, Moakler et Zettelmeyer ont testé sur 663 expériences à grande échelle si des méthodes non expérimentales retrouvaient les effets mesurés : ni l'apprentissage automatique double débiaisé ni l'appariement sur score de propension n'y parviennent, y compris avec des modèles d'apprentissage profond et sur des données individuelles [11]. Heusch construit un terrain à vérité connue avec dépense endogène pour poser la même question proprement [13].\n\nAucun indicateur de la note de synthèse ne signale qu'on s'y trouve."
      }
    }
  }
}
