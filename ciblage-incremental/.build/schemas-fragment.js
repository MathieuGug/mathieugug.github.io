{
  "schema-01": {
    title: "Les quatre populations d'une campagne",
    regions: {
      "persuadables": {
        title: "Les persuadables",
        body: "Ils n'achètent pas si on les laisse tranquilles, et ils achètent si on les sollicite. **Ce sont les seuls sur lesquels un budget de sollicitation produit de la valeur**, et le seul groupe dont l'existence justifie qu'on dépense.\n\nUn score de propension les classe en haut, mélangés aux acquis d'avance : les deux groupes achètent quand on leur parle, et rien dans les données observées ne les sépare. La séparation exige un groupe témoin, parce qu'elle repose sur ce qui se serait passé sans sollicitation.\n\nLeur part dans une base est généralement faible. C'est ce qui explique que l'effet moyen d'une campagne soit petit alors même que le taux de conversion des ciblés paraît élevé [1]."
      },
      "acquis": {
        title: "Les acquis d'avance",
        body: "Ils achètent dans les deux cas. Toute dépense consentie sur eux est une remise accordée sans contrepartie : la conversion aurait eu lieu, le coupon en a seulement réduit la marge.\n\nC'est le groupe que l'expérience eBay a mis en évidence sur le terrain publicitaire. Les utilisateurs fréquents, dont le comportement d'achat n'était pas modifié par la publicité, absorbaient l'essentiel de la dépense ; le rendement moyen en ressortait négatif [1].\n\nUn score de propension les place mécaniquement en tête de liste, puisqu'ils achètent souvent. Un classement par effet les renvoie au milieu, autour de zéro."
      },
      "perdus": {
        title: "Les perdus d'avance",
        body: "Ils n'achètent dans aucun des deux cas. La dépense engagée sur eux est perdue, mais elle ne détruit rien d'autre que le budget : aucune conversion n'est annulée, aucune relation n'est dégradée.\n\nC'est le groupe le moins coûteux des trois qu'il faut écarter, et paradoxalement celui que les organisations écartent le mieux, parce qu'un score de propension suffit à les repérer : ils achètent rarement, donc ils tombent en bas de n'importe quel classement.\n\nL'erreur de ciblage qui coûte n'est pas là. Elle est sur les acquis d'avance, qui se cachent en haut du classement."
      },
      "refractaires": {
        title: "Les réfractaires",
        body: "Ils achètent si on les laisse tranquilles, et la sollicitation annule cet achat. La relance réveille une résiliation oubliée, le coupon dégrade la perception de prix, la pression publicitaire lasse.\n\nSur eux, la dépense produit un effet réel, du mauvais signe. C'est ce qui rend le classement par effet structurellement différent d'un classement par priorité : **il a un bas de liste qu'il faut exclure activement**, et pas seulement un bas de liste qu'on n'appelle pas.\n\nLe travail d'Ascarza fournit l'illustration canonique sur le terrain de la rétention : les clients au plus fort risque de départ ne sont pas les meilleures cibles d'un programme, et certains réagissent négativement à l'offre qu'on leur adresse [2]."
      }
    }
  },
  "schema-02": {
    title: "La boucle qui se confirme elle-même",
    regions: {
      "selection": {
        title: "Étape 1 · La politique sélectionne",
        body: "Le score en vigueur retient une fraction de la base. Le reste ne sera pas sollicité, et surtout ne sera pas observé sous sollicitation.\n\nÀ ce stade, la décision paraît anodine : elle porte sur une campagne. Elle détermine en réalité la population sur laquelle le modèle suivant apprendra, et donc le champ de ce que l'organisation pourra encore découvrir au tour d'après."
      },
      "observation": {
        title: "Étape 2 · La campagne observe",
        body: "On enregistre les conversions des seuls individus que la politique a retenus. C'est le point où l'information manquante se fabrique.\n\nLe taux de conversion mesuré sur la population ciblée est supérieur à la moyenne de la base. Il le serait aussi si la politique n'avait sélectionné que des acquis d'avance. **L'indicateur qui remonte au comité ne distingue pas les deux cas.**"
      },
      "apprentissage": {
        title: "Étape 3 · Le modèle réapprend",
        body: "Le réentraînement se fait sur une population que le modèle précédent a choisie. Les corrélations apprises portent la trace de cette sélection, et non les seules régularités du marché.\n\nC'est ce qui rend les comparaisons hors ligne peu concluantes. Simester, Timoshenko et Zoumpoulis ont dû valider dans une seconde expérience de terrain les politiques apprises sur la première : les écarts de performance entre sept méthodes ne se lisaient pas sur les données d'entraînement [4]."
      },
      "confirmation": {
        title: "Étape 4 · Le ciblage se resserre",
        body: "Les segments jamais sollicités restent inconnus ; les segments sur-sollicités paraissent performants. Chaque itération resserre le ciblage sur la zone déjà explorée.\n\nLa boucle se stabilise sur un optimum local qu'aucune métrique interne ne signale, puisque le taux de conversion observé continue de monter. Une organisation peut passer plusieurs années à améliorer un indicateur qui mesure la sélection plutôt que l'effet."
      },
      "rupture": {
        title: "La seule sortie de boucle",
        body: "Une fraction tirée au sort, non sollicitée, reconstituée à chaque cycle plutôt que figée une fois pour toutes.\n\nElle réintroduit dans les données la seule information que la boucle a cessé de produire : ce qui arrive quand on ne sollicite pas. Sans elle, aucune des trois familles d'estimateurs de l'effet ne fonctionne, et aucune courbe d'évaluation ne peut être tracée [11].\n\nSon coût est le manque à gagner sur les persuadables qu'elle contient. Ce coût est calculable une fois l'effet moyen connu ; le coût de son absence ne l'est pas."
      }
    }
  },
  "schema-03": {
    title: "Trois chemins de la donnée au classement par effet",
    regions: {
      "transformation": {
        title: "Chemin 1 · La transformation de la réponse",
        body: "On réécrit l'étiquette de sorte qu'un modèle de régression ordinaire, entraîné dessus, estime en espérance l'effet plutôt que la probabilité de conversion.\n\n**Avantage de direction** : rien ne change dans l'infrastructure. Les mêmes outils, les mêmes équipes, le même cycle de production.\n\n**Coût** : une variance élevée. L'étiquette transformée est bruitée, et il faut beaucoup d'observations pour que le signal émerge. La méthode suppose par ailleurs une probabilité d'assignation connue et stable, donc une randomisation maîtrisée en amont."
      },
      "metaapprenants": {
        title: "Chemin 2 · Les méta-apprenants",
        body: "Des procédures qui décomposent l'estimation de l'effet conditionnel en plusieurs problèmes de régression confiés à n'importe quel algorithme d'apprentissage [7].\n\nLe S-apprenant entraîne un modèle unique avec le traitement comme variable explicative. Le T-apprenant entraîne deux modèles séparés et prend la différence. Le X-apprenant ajoute une imputation croisée qui le rend nettement plus stable quand les bras sont déséquilibrés. Le R-apprenant isole l'effet en neutralisant d'abord la partie prédictible du résultat et du traitement [8].\n\n**Ce que la direction doit retenir** : le choix de la variante dépend du déséquilibre entre bras, et ce déséquilibre est une décision de budget prise au cadrage de la campagne."
      },
      "foret": {
        title: "Chemin 3 · Les forêts causales et la politique",
        body: "Wager et Athey ont adapté les forêts aléatoires à l'estimation d'effets hétérogènes, avec une propriété rare dans ce domaine : un intervalle de confiance valide sur l'effet estimé pour un individu donné [9].\n\nC'est ce qui permet de passer d'un classement à une décision documentée, puisqu'on peut dire de combien on est sûr avant d'exclure quelqu'un.\n\nAthey et Wager ont ensuite traité l'objet qui intéresse réellement un comité : la règle de décision elle-même, optimisée directement plutôt que déduite d'un seuil posé à la main sur un score [10]. Kitagawa et Tetenov en avaient posé le cadre, où la contrainte peut être un budget ou une exigence d'interprétabilité [13]."
      },
      "exigence": {
        title: "L'exigence commune aux trois chemins",
        body: "Une population délibérément non sollicitée. **La randomisation est la matière première du classement par effet, et non une précaution ajoutée par prudence.**\n\nL'ordre de grandeur se laisse deviner sur les jeux publics : le jeu de données d'incrémentalité de Criteo compte environ 25 millions de lignes, avec un taux de visite proche de 4 % et un taux de conversion proche de 0,2 % [14].\n\nQuand l'événement à expliquer est rare et que l'effet recherché est une différence de quelques points de base entre deux bras, le volume requis n'a rien à voir avec celui d'un modèle de propension. C'est un arbitrage de budget, pas un choix d'outil."
      }
    }
  },
  "schema-04": {
    title: "La courbe de gain incrémental, lue en décision",
    regions: {
      "aire": {
        title: "L'aire · Le coefficient de Qini",
        body: "On trie la population par effet prédit décroissant, on découpe en tranches, et dans chaque tranche on compare le taux de conversion des sollicités à celui des témoins. La courbe de gain incrémental cumulé qui en résulte se compare à la droite d'un ciblage aléatoire.\n\nL'aire entre les deux est le coefficient de Qini, généralisation du coefficient de Gini au cas de l'effet, introduit par Radcliffe et Surry [11].\n\n**Ce que le chiffre dit** : de combien le classement fait mieux qu'un tirage au hasard. **Ce qu'il ne dit pas** : à quel volume s'arrêter. Cette information est dans la forme de la courbe, pas dans son aire."
      },
      "retournement": {
        title: "Le maximum · La décision réellement achetée",
        body: "Le gain incrémental cumulé croît tant qu'on ajoute des persuadables, plafonne quand on ajoute des acquis et des perdus, puis décroît quand on atteint les réfractaires.\n\nLe sommet dit à quel volume de sollicitation s'arrêter. **C'est la seule information de la courbe qui se traduise directement en euros non dépensés.**\n\nUne organisation qui pilote au taux de couverture — « on adresse le premier tiers de la base » — dépense au-delà du maximum sans le savoir, parce que le taux de couverture est fixé par le budget disponible et non par la forme de la courbe."
      },
      "descente": {
        title: "La descente · Ce que coûte le zèle",
        body: "Au-delà du sommet, chaque tranche ajoutée contient plus de réfractaires que de persuadables. Le gain cumulé baisse : la campagne détruit de la valeur qu'elle avait créée sur les premières tranches.\n\nCette zone n'apparaît sur aucun tableau de bord construit sur le taux de conversion, puisque les personnes qu'on y sollicite continuent d'acheter à un rythme visible. Seule la comparaison avec le témoin de la même tranche la révèle.\n\nC'est l'argument le plus court en faveur du témoin permanent : sans lui, la partie descendante de la courbe reste invisible, et rien n'indique qu'on a dépassé le point d'arrêt."
      },
      "temoin": {
        title: "Ce que la courbe exige pour exister",
        body: "Chaque tranche du classement doit contenir des individus sollicités **et** des individus tirés au sort qui ne l'ont pas été. Une campagne qui a sollicité toute sa cible ne produit aucune courbe, quelle que soit la sophistication du modèle en amont.\n\nLa mesure de qualité du ciblage et le coût du ciblage sont donc liés par construction : on ne peut pas savoir si l'on a bien ciblé sans avoir renoncé à cibler une partie de la base.\n\nLa bonne nouvelle est que ce renoncement se réutilise. Hitsch, Misra et Zhang montrent qu'un seul jeu de données randomisé permet d'évaluer un nombre arbitraire de politiques candidates, sans repayer une expérience de terrain par candidate [3]."
      }
    }
  },
  "schema-05": {
    title: "Anatomie d'un dispositif de ciblage évaluable",
    regions: {
      "temoin-permanent": {
        title: "Élément 1 · Le témoin permanent",
        body: "Une fraction de la base, tirée au sort, qui ne reçoit pas la sollicitation, et qui est **reconstituée à chaque cycle plutôt que figée**. Un témoin figé cesse d'être comparable dès que la base évolue.\n\nSon coût est le manque à gagner sur les persuadables qu'il contient, ce qui se calcule une fois l'effet moyen connu. Il se compare aux dépenses inutiles qu'il permet d'éviter sur les acquis d'avance.\n\n**Porté par** un tiers hors de la chaîne commerciale. Toute autre désignation revient à confier la protection du témoin à celui qui a intérêt à le consommer."
      },
      "trace": {
        title: "Élément 2 · La trace d'assignation",
        body: "Quatre colonnes : l'indicateur de bras, l'horodatage, la version de la règle appliquée, la probabilité d'assignation.\n\nSans elles, les données d'une campagne ne sont pas réutilisables pour une évaluation hors politique six mois plus tard. Avec elles, chaque campagne passée devient un jeu d'évaluation exploitable par les politiques candidates suivantes [3].\n\n**Porté par** l'ingénierie du socle de données. C'est un point de conception, à poser au même niveau qu'un registre de mesure, et non un ajout d'analyste en aval."
      },
      "politiques": {
        title: "Élément 3 · Les politiques candidates",
        body: "La règle qui transforme un score en décision de contacter est un objet à part entière : elle porte un seuil, une contrainte de volume, des exclusions.\n\nElle se révise. On doit pouvoir dire laquelle était active à une date donnée, sans quoi l'analyse rétrospective d'une campagne devient une reconstitution de mémoire.\n\n**Porté par** l'équipe data, qui la versionne et la date comme n'importe quel artefact de production. C'est la différence entre un modèle et une politique : le premier produit un score, la seconde produit une décision qui engage un budget."
      },
      "evaluation": {
        title: "Élément 4 · L'évaluation hors politique",
        body: "Un seul jeu de données randomisé permet d'évaluer un nombre arbitraire de politiques candidates, ce qui représente un avantage de coût considérable par rapport à la conduite d'autant d'expériences de terrain [3].\n\nSimester et ses coauteurs ont traité la même question sous l'angle du protocole d'entreprise, en montrant comment dépasser l'essai champion contre challenger qui reste la norme [5].\n\n**Porté par** l'instance qui arbitre le budget de sollicitation. C'est elle qui décide du volume, donc c'est elle qui doit lire la courbe."
      },
      "revision": {
        title: "La boucle de révision",
        body: "Le seuil et le volume se révisent à chaque cycle, à partir de ce que la courbe du cycle précédent a montré.\n\nCette boucle se distingue de celle du schéma 02 sur un point : elle réinjecte dans la décision une information produite **contre** un témoin, là où la boucle pathologique réinjecte une information produite par la politique elle-même.\n\nLa différence ne se voit pas dans l'organigramme ni dans la chaîne de traitement. Elle se voit uniquement dans la présence ou l'absence d'une fraction tirée au sort en amont."
      },
      "garde": {
        title: "Le point de rupture",
        body: "Vu d'une direction commerciale en fin de trimestre, un groupe témoin est un stock de clients non sollicités disponible immédiatement, sans coût d'acquisition et sans délai.\n\nIl disparaît dans l'année si sa protection n'est écrite nulle part et si personne n'a l'autorité de refuser sa réaffectation.\n\n**La décision de direction n'est donc pas de créer le témoin ; elle est de nommer qui a le droit de dire non lorsqu'on viendra le chercher.** Cette désignation relève de la même logique que la séparation du contrôle et de la conduite dans une direction data."
      }
    }
  },
  "schema-06": {
    title: "Qui détient le groupe témoin",
    regions: {
      "regie": {
        title: "Le témoin tenu par la régie",
        body: "La plateforme construit son témoin au niveau de l'enchère, sans priver personne d'une offre commerciale. La technique des publicités fantômes, qui enregistre quelles publicités auraient été servies aux personnes du témoin, reste hors de portée d'un annonceur.\n\nLa proposition est méthodologiquement sérieuse : optimiser sur l'incrémental estimé plutôt que sur la probabilité de conversion corrige exactement le défaut décrit dans ce dossier. Meta l'expose en deux modes, mesure et optimisation, l'estimation provenant d'un modèle entraîné sur l'historique des tests d'incrémentalité de la plateforme [12].\n\n**Ce qui reste hors de portée de l'acheteur** : le protocole n'est ni choisi ni rejouable. Activer l'option revient à déléguer simultanément le ciblage et sa preuve."
      },
      "annonceur": {
        title: "Le témoin tenu par l'annonceur",
        body: "L'entreprise tire au sort sur sa propre base, avant l'envoi de la sollicitation. Rien n'est délégué : le coût du témoin et la charge d'analyse restent internes, et la trace d'assignation lui appartient.\n\nC'est le seul montage qui rende le dispositif pleinement opposable, parce que l'organisation détient à la fois le tirage, la règle de décision et les données de résultat.\n\n**Sa limite est structurelle** : il est aveugle à ce qui se passe hors de la base. Les impressions non servies, les effets de report entre canaux et les personnes que l'entreprise ne connaît pas encore échappent à la mesure."
      },
      "tiers": {
        title: "Le témoin tenu par un tiers",
        body: "Un protocole géographique arrêté avant la campagne, indépendant du canal mesuré, avec une règle de lecture écrite d'avance. Il mesure l'effet total du canal sans dépendre de la comptabilité de la régie.\n\nC'est le seul chiffre qui permette de trancher si l'optimisation incrémentale d'une plateforme a produit ce qu'elle annonce.\n\n**Sa limite est la cadence.** Un dispositif géographique consomme du budget et du temps, et la contrainte de puissance n'autorise que quelques questions par an. Il sert de référence externe, pas de pilotage continu."
      },
      "contrat": {
        title: "Ce qui se négocie au contrat",
        body: "Les trois montages se combinent, et aucun ne suffit seul. Le témoin de l'annonceur porte le ciblage sur base ; celui de la régie porte le média ; celui du tiers arbitre entre les deux.\n\n**Le seul arbitrage qui ne se délègue pas : ne pas acheter à la même partie le ciblage et sa preuve.** L'optimisation incrémentale d'une régie s'active, à condition d'être adossée à une vérification tenue ailleurs.\n\nCe point se négocie au contrat, avant les résultats. Une clause écrite après la première lecture d'un tableau de bord n'obtient plus rien : la référence externe doit être cadencée et sa règle de lecture pré-enregistrée pour avoir une valeur probante."
      }
    }
  }
}
