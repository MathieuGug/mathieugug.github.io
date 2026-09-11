{
  "schema-01": {
    title: "Cinq mesures du même effet, cinq mondes différents",
    regions: {
      "academique": {
        title: "La référence académique · Spider 2.0",
        body: "Le seul banc du corpus qu'aucun éditeur n'a construit, et le seul dont personne ne tire argument commercial. 632 tâches issues de patrimoines d'entreprise réels, bases dépassant fréquemment le millier de colonnes, plusieurs dialectes SQL cohabitant [5].\n\nAucune couche sémantique n'y est fournie : les taux mesurés — 10,1 % pour un modèle généraliste, 17,1 % pour un modèle de raisonnement — décrivent ce qu'un agent obtient sur un patrimoine brut. Ils servent ici de **plancher de référence**, la valeur que les quatre autres bancs cherchent à faire monter.\n\nLire cette ligne comme une critique des modèles serait une erreur de lecture. Les générations suivantes font nettement mieux sur le même banc. Ce que la ligne établit, c'est l'ordre de grandeur de l'effort que demande un patrimoine réel par rapport à un jeu de démonstration."
      },
      "tiers": {
        title: "La mesure tierce · Atlan AI Labs",
        body: "174 requêtes uniques, 522 évaluations, un passage de 16,1 % à 22,2 % quand l'agent reçoit un contexte gouverné [3]. Un gain relatif de 38 %, sur une base absolue qui reste très basse.\n\nC'est la ligne la plus inconfortable du schéma, et la plus utile. Elle montre qu'un contexte gouverné fait effet **même quand le patrimoine est difficile**, et qu'il ne suffit pas à rendre le résultat exploitable. Un agent à 22 % n'est pas un outil de décision ; il n'est pas non plus un outil sans valeur, puisqu'il a doublé son rendement sur un chantier qui n'avait pas commencé.\n\nAucun des deux nombres ne se transpose. Ils décrivent le patrimoine sur lequel la mesure a été faite."
      },
      "apparie": {
        title: "La mesure appariée · le banc de Cube",
        body: "Le seul travail du corpus qui réunisse les trois propriétés qu'on attend d'une mesure : **appariée** (les mêmes cent questions dans les deux conditions), **testée** (McNemar exact, p < 0,002 dans les trois cas), **rejouable** (dépôt public sous licence MIT) [1].\n\nProtocole : 100 questions du jeu Contoso sur ClickHouse, cinq niveaux de difficulté de vingt questions, trois modèles de frontière à effort de raisonnement médian. La couche sémantique est un document d'environ neuf kilo-octets rédigé à la main, contenant treize règles de pilotage.\n\nLes auteurs qualifient eux-mêmes le résultat de **plancher** : la couche a été écrite une fois, sans itération. C'est la mesure sur laquelle s'appuient les deux résultats analytiques du dossier — la convergence des modèles, et la nature de ce que la couche déplace."
      },
      "editeurs": {
        title: "Les chiffres d'éditeur",
        body: "Deux mesures publiées par des fournisseurs sur leurs propres produits, et qui occupent le haut de l'échelle : de l'ordre de 40 % à 85-90 % chez l'un [4], de 84-90 % à 98-100 % chez l'autre [2].\n\nCes chiffres ne sont pas faux. Ils sont **mesurés ailleurs** : sur un jeu de démonstration soigné pour le premier, sur un projet déjà modélisé depuis des années pour le second. Le point de départ de la deuxième ligne (84 à 90 % sans couche sémantique) est à peu près le point d'arrivée de la ligne du dessous, ce qui suffit à montrer que les deux ne mesurent pas la même population de questions.\n\nRègle de lecture, la même que celle appliquée dans les dossiers antérieurs de cette série : **annoncé et non audité**. On retient la forme du résultat, jamais sa valeur."
      },
      "delta": {
        title: "Ce que la dispersion démontre",
        body: "Cinq équipes, cinq protocoles, cinq patrimoines. Le **sens** de l'effet est constant : partout la description formelle du patrimoine améliore l'exactitude, et dans un cas la significativité statistique est établie.\n\nLe **niveau**, lui, court de 22 % à 100 %. Il ne s'agit pas de bruit de mesure, mais d'une propriété des jeux de données : plus le patrimoine ressemble à un entrepôt d'entreprise réel, plus le niveau tombe.\n\nLa conséquence est actionnable. Un taux publié dans une plaquette caractérise le jeu de démonstration du fournisseur. Le vôtre dépend de vos tables, de vos conventions non écrites et de vos définitions concurrentes. On ne peut pas l'estimer par transposition — seulement le mesurer, ce qui coûte quelques jours (décision D1)."
      }
    }
  },
  "schema-02": {
    title: "Le même modèle, trois patrimoines",
    regions: {
      "spider1": {
        title: "Spider 1.0 · le monde de la démonstration",
        body: "Bases académiques de quelques tables, construites pour l'exercice d'évaluation. Noms de colonnes explicites, relations évidentes, aucune convention implicite, aucune table gelée.\n\nUn modèle généraliste y résout 86,6 % des tâches [5]. C'est le régime dans lequel se déroulent la plupart des démonstrations commerciales : trois tables préparées, une question bien posée, un chiffre juste.\n\nCe régime n'est pas trompeur en soi. Il devient trompeur quand on en tire une prévision pour un patrimoine qui n'a aucune de ses propriétés."
      },
      "bird": {
        title: "BIRD · le point intermédiaire",
        body: "Bases réalistes : valeurs sales, colonnes redondantes, quelques conventions implicites, des jointures qui demandent d'être choisies. Le même modèle y tombe à 57,4 % [6].\n\nCe point du milieu est le plus instructif des trois, parce qu'il montre que la dégradation est **continue** et qu'elle suit une seule variable. Entre 86,6 % et 57,4 %, ni le modèle ni la tâche n'a changé : seule la quantité de non-écrit dans la base a augmenté.\n\nOn peut en tirer un instrument de cadrage : la position de votre patrimoine sur cet axe se mesure par le nombre de décisions métier qu'un analyste doit prendre avant d'écrire sa requête."
      },
      "spider2": {
        title: "Spider 2.0 · le patrimoine réel",
        body: "632 tâches issues d'applications réelles, bases dépassant fréquemment le millier de colonnes, plusieurs dialectes SQL, requêtes de référence qui dépassent souvent cent lignes, tâches qui supposent d'enchaîner plusieurs requêtes plutôt que d'en écrire une [5].\n\nLe même modèle y résout 10,1 % des tâches ; un modèle de raisonnement, 17,1 %. Les générations plus récentes font sensiblement mieux, ce qui ne change pas la lecture : à modèle constant, le passage du premier régime au troisième coûte plus de soixante-dix points.\n\nAucune de ces tâches n'est intrinsèquement difficile pour un analyste qui connaît la maison. Ce que le banc mesure, c'est ce qui manque à qui ne la connaît pas."
      },
      "schema-reel": {
        title: "La variable décisive · ce qui n'est écrit nulle part",
        body: "Trois des quatre différences entre le premier régime et le troisième sont mesurables et se corrigent par de l'ingénierie : le nombre de colonnes, la cohabitation des dialectes, la longueur des requêtes.\n\nLa quatrième ne se mesure pas et ne s'automatise pas. C'est l'ensemble des décisions métier prises un jour, encodées dans une convention, et jamais écrites : quelle table fait foi, quel périmètre s'applique par défaut, ce que vaut une clé technique, quelles tables sont gelées et pourquoi on les a gardées.\n\nUn analyste humain porte cette connaissance et l'applique sans y penser. **Tout ce qu'un analyste sait sans l'avoir lu, l'agent doit le lire.** C'est la totalité du chantier de préparation, et c'est l'objet de la décision D5."
      }
    }
  },
  "schema-03": {
    title: "Trois classes d'erreur, rangées par le bruit qu'elles font",
    regions: {
      "silencieuse": {
        title: "Classe 1 · l'erreur silencieuse",
        body: "L'agent rend une réponse plausible, bien formée, chiffrée, et fausse. Rien ne signale l'anomalie : ni l'agent, ni le moteur, ni le lecteur.\n\nL'exemple canonique vient du banc de Cube : dans le jeu Contoso, la clé de promotion dont la valeur vaut 1 désigne l'**absence** de promotion [1]. Convention écrite nulle part, évidente pour qui connaît le jeu, invisible pour qui ne le connaît pas. L'agent qui l'ignore compte les ventes hors promotion parmi les ventes promues et rend un chiffre présentable.\n\nToutes les erreurs de cette classe partagent une structure : une décision métier a été prise, elle a été encodée dans une convention, et la convention n'a jamais été écrite parce qu'aucun humain n'en avait besoin. C'est la seule classe qui contamine une décision, et c'est celle que la préparation du socle vise."
      },
      "bruyante": {
        title: "Classe 2 · l'erreur bruyante",
        body: "Refus, accès refusé, table introuvable, question hors du périmètre déclaré. L'échec est explicite et il est daté.\n\nLe banc de dbt Labs donne la formulation la plus nette de l'opposition : les échecs d'une couche sémantique prennent la forme de refus, quand ceux du texte-vers-SQL brut prennent la forme de chiffres faux énoncés avec aplomb [2]. La différence entre un système qui dit « je ne sais pas » et un système qui dit « 4 738 219 € ».\n\nCette classe coûte un aller-retour avec un analyste. Elle ne coûte jamais une décision. C'est pourquoi le bon objectif de préparation n'est pas de la supprimer mais de l'**agrandir**, aux dépens de la précédente."
      },
      "couteuse": {
        title: "Classe 3 · l'erreur coûteuse",
        body: "La réponse est juste ; le chemin pour l'obtenir ne l'est pas. Balayage de plusieurs téraoctets faute de pré-agrégat ou de borne temporelle déclarée, requête relancée en boucle par un agent qui itère sur sa propre sortie.\n\nCette classe se traite par des plafonds d'exécution, des quotas et une surveillance de la dépense, c'est-à-dire par des dispositifs déjà connus et déjà outillés. Elle relève du pilotage financier d'un agent en production, traité pour lui-même dans un dossier antérieur de cette série.\n\nElle figure ici pour une raison de méthode : la ranger avec les deux autres évite de la confondre avec un problème de confiance. Une facture inattendue est désagréable ; elle ne fait pas prendre une mauvaise décision."
      },
      "regle": {
        title: "La règle, et comment la mesurer",
        body: "**Un socle prêt pour l'agentique est un socle où toute erreur est bruyante.**\n\nCette formulation a une propriété que « améliorer la qualité des données » n'a pas : elle se mesure. Sur le jeu de questions de référence constitué en D1, on compte la proportion des échecs qui passent inaperçus — une réponse rendue, plausible, et différente de la réponse de référence.\n\nCe taux devient le critère de recette du chantier de préparation, et il se suit dans le temps. Un socle dont le taux d'erreur silencieuse baisse pendant que l'exactitude stagne progresse quand même : il a converti du risque en friction, et la friction est visible.\n\nLa préparation ne vise donc pas d'abord la justesse. Elle vise la **visibilité des fautes**, qui est la condition pour que la justesse s'améliore ensuite."
      }
    }
  },
  "schema-04": {
    title: "Ce que la couche sémantique déplace",
    regions: {
      "avant": {
        title: "État 1 · l'agent tente tout",
        body: "Sans description formelle du patrimoine, l'agent traite toute question qu'on lui pose. Il n'a aucun moyen de savoir qu'il ne sait pas : son entrée est un schéma de base de données, et un schéma ne dit jamais qu'il est incomplet.\n\nLa conséquence structurelle est la plus importante de ce schéma : **la zone de refus est vide**. Toute question reçoit un chiffre. Ce qui n'est pas juste est donc faux et silencieux, par construction.\n\nLe banc apparié situe la zone verte entre 46 et 51 % sur son jeu de démonstration [1]. Sur un patrimoine d'entreprise non préparé, les mesures disponibles la placent nettement plus bas [3][5]. Dans les deux cas, la zone rouge est tout le reste."
      },
      "apres": {
        title: "État 2 · l'agent tente moins",
        body: "Avec une couche sémantique, deux choses changent en même temps. La zone verte s'agrandit — le banc apparié la porte à environ 68 %, et les trois modèles testés y convergent [1]. Et une zone nouvelle apparaît : celle des questions que le système refuse explicitement de traiter.\n\nLa convergence des modèles est le résultat le plus utile pour un arbitrage budgétaire. Sans couche, les trois modèles se tiennent entre 46 et 51 % ; avec, ils se tiennent tous autour de 68 %. **La dispersion entre modèles est faible dans les deux états.** Autrement dit, l'argent dépensé à comparer des modèles produit moins d'effet que le même argent dépensé à écrire des définitions.\n\nLa zone rouge subsiste. Un tiers des réponses reste faux sur un jeu de démonstration soigné, et les auteurs présentent ce chiffre comme un plancher plutôt qu'un plafond."
      },
      "zone-refus": {
        title: "La zone de refus · l'effet recherché",
        body: "C'est la zone qui n'existait pas dans l'état 1, et c'est la vraie contribution de la couche sémantique.\n\nUn moteur d'indicateurs refuse ce qu'il ne sait pas calculer. Le banc de dbt Labs le documente : certaines questions n'ont pas pu être traitées parce que le schéma d'origine exigeait davantage de sauts entre entités que le moteur n'en accepte [2]. Du point de vue d'une plaquette commerciale, c'est un défaut. Du point de vue d'une direction data, c'est la fonctionnalité.\n\nChaque question qui bascule du rouge vers le gris est une décision qui ne sera pas prise sur un chiffre faux. Le coût de ce basculement est un aller-retour avec un analyste ; son bénéfice est une erreur silencieuse en moins.\n\nRéserve de lecture : seule la zone verte est adossée à une mesure publiée. La répartition du reste entre rouge et gris illustre le mécanisme sans être quantifiée par les bancs disponibles."
      },
      "zone-fausse": {
        title: "L'arbitrage : couverture contre fiabilité",
        body: "La couche sémantique ne rend pas l'agent plus intelligent. Elle **rétrécit l'espace des questions qu'il accepte de traiter**, et augmente la confiance qu'on peut accorder à ce qu'il rend.\n\nCe qu'on gagne : une partie des réponses fausses devient un refus explicite, et le choix du modèle cesse de peser lourd sur le résultat.\n\nCe qu'on paie : des questions métier parfaitement légitimes sortent du périmètre outillé et repassent par un analyste. Une organisation qui mesure le succès de son agent au nombre de questions traitées verra ce chiffre baisser.\n\nUne direction qui achète une couche sémantique en croyant acheter un agent plus intelligent sera déçue. Une direction qui l'achète en sachant qu'elle achète un périmètre déclaré et des refus explicites saura quoi en faire — et écrira ce périmètre elle-même (décision D4)."
      }
    }
  },
  "schema-05": {
    title: "Les trois états d'une définition métier",
    regions: {
      "implicite": {
        title: "État 1 · implicite",
        body: "La définition vit dans le SQL d'un rapport et dans la mémoire de son auteur. Elle ne coûte rien à produire, puisqu'elle n'a jamais été produite : elle s'est déposée.\n\nC'est l'état par défaut de presque toutes les organisations, et il a fonctionné pendant vingt ans. Le coût de la divergence entre deux définitions concurrentes se payait en réunions de réconciliation, jamais en décision : deux directions arrivaient avec deux chiffres, on cherchait l'écart, on repartait.\n\nPour un agent, cet état ne vaut rien. Il ne peut ni lire un SQL de rapport pour en extraire une intention, ni interroger l'auteur. Il devine, et la section 3 dit ce que produit une devinette : un chiffre plausible."
      },
      "documente": {
        title: "État 2 · documentée",
        body: "La définition est écrite, dans un glossaire métier ou un catalogue de données. Elle est consultable. C'est un vrai progrès pour un humain qui cherche, et c'est un progrès partiel pour un agent, qui peut la lire.\n\nSa limite est qu'elle **ne contraint rien**. Aucun mécanisme n'empêche un rapport, un tableau de bord ou une requête ad hoc de la contredire, et rien ne signale la contradiction quand elle se produit. Le glossaire dit ce que devrait être le chiffre d'affaires ; le rapport calcule autre chose ; les deux coexistent.\n\nBeaucoup de programmes de gouvernance de la donnée s'arrêtent ici et considèrent le travail fait. Un glossaire que rien n'exécute reste un document d'intention."
      },
      "opposable": {
        title: "État 3 · opposable",
        body: "La définition devient un objet exécutable, versionné, doté d'un propriétaire nommé et d'une procédure de modification. Tous les consommateurs, l'agent compris, calculent depuis cet objet.\n\nLa propriété qui compte est asymétrique : contredire la définition reste possible, mais suppose de créer un objet concurrent — donc de laisser une trace visible et datée. La divergence cesse d'être gratuite.\n\nC'est le seul des trois états qui change quelque chose pour un agent. Le passage de l'état 2 à l'état 3 est aussi le seul qui coûte, et son coût n'est pas technique : il faut trancher entre des définitions concurrentes dont chacune a un porteur légitime dans l'organisation."
      },
      "proprietaire": {
        title: "Ce que le format ne fournit pas",
        body: "Les trois grands fournisseurs de plateformes de données proposent désormais un objet portant l'état opposable : vues sémantiques de niveau schéma [9], vues de métriques recalculées au moment de la requête [10], indicateurs définis une fois en YAML versionné [2].\n\nAucun d'eux ne fournit ce qui manque réellement : **qui a le droit de modifier une définition**, qui doit être consulté avant, et ce qu'on fait quand la modification casse une série historique.\n\nCes règles se prennent dans une instance et s'écrivent dans une note. La conséquence pratique tient en une phrase : le propriétaire d'une définition doit être un responsable métier. L'ingénieur data implémente ; il n'a pas l'autorité pour décider si un avoir se déduit du chiffre d'affaires. Confier la propriété à l'équipe technique produit soit un arbitrage illégitime, soit un arbitrage indéfiniment reporté (décision D2)."
      }
    }
  },
  "schema-06": {
    title: "Le filtre a changé d'étage",
    regions: {
      "bi": {
        title: "Le modèle décisionnel · filtrer à la restitution",
        body: "Pendant vingt ans, l'habilitation s'est appliquée au **rapport**. L'analyste qui construisait un tableau de bord disposait d'un accès large au patrimoine ; le tableau publié filtrait ce que chaque lecteur voyait, selon son périmètre.\n\nL'architecture tenait pour une raison structurelle : il y avait toujours un artefact intermédiaire entre la donnée et le lecteur, et cet artefact était le point de contrôle. Un lecteur ne formulait pas de requête, il consommait une restitution.\n\nCe modèle ne se transpose pas à un agent, parce que l'artefact intermédiaire disparaît. C'est le point aveugle de la plupart des pilotes : l'équipe reprend le modèle de sécurité de la BI dans un contexte qui en a supprimé le pivot."
      },
      "service-account": {
        title: "Le compte de service · l'identité se perd en route",
        body: "Le montage le plus simple, et celui de la majorité des démonstrations : l'agent s'authentifie sous un compte technique et interroge l'entrepôt sous cette identité.\n\nLa conséquence est mécanique. L'agent voit l'union de tout ce que le compte peut lire, et **chaque utilisateur de l'agent hérite des droits du compte**, quels que soient les siens. Une question formulée de la bonne manière suffit à faire sortir une information à laquelle le demandeur n'a pas accès.\n\nCe défaut ne se corrige pas par des consignes ajoutées à l'invite, qui relèvent de la suggestion et non du contrôle : rien n'oblige un modèle à respecter une restriction exprimée en prose, et rien ne le journalise.\n\nUn pilote mené ainsi démontre une faisabilité qui n'existe pas, puisqu'il exclut la contrainte qui déterminera l'architecture (décision D3)."
      },
      "identite-propagee": {
        title: "L'identité propagée · filtrer à la requête",
        body: "Le montage correct : l'identité du demandeur est portée jusqu'à l'entrepôt, de sorte que les règles de sécurité au niveau des lignes et des colonnes s'appliquent à la requête que l'agent vient d'écrire.\n\nIl suppose une chaîne complète, et chaque maillon est un chantier : authentification du demandeur, échange de jeton conservant la trace de la délégation, exécution sous l'identité déléguée, journalisation exploitable après coup.\n\nLa contrepartie est que le point de contrôle redescend à l'étage où la question est effectivement posée à la donnée. Le filtre ne dépend plus de l'existence d'un rapport, ni de la bonne formulation d'une consigne. Il dépend de ce que l'annuaire dit du demandeur, c'est-à-dire de la même règle que celle qui s'applique déjà à ses autres accès."
      },
      "compilation": {
        title: "Compiler la règle, plutôt que la vérifier",
        body: "L'état du parc est documenté par une enquête d'éditeur auprès de 235 responsables sécurité de grandes entreprises : 92 % sans visibilité complète sur leurs identités d'IA, 86 % sans politique d'habilitation appliquée à ces identités, 71 % constatant un accès de systèmes d'IA à des plateformes métier critiques pour 16 % estimant le gouverner effectivement [11]. Chiffres annoncés et non audités, retenus pour l'ordre de grandeur.\n\nLa conséquence architecturale est contre-intuitive, et elle relie cette section à la précédente : **la couche sémantique est le bon endroit où poser les règles d'accès**, parce qu'elle est l'objet que l'agent traverse obligatoirement.\n\nUne règle exprimée au niveau de la définition d'un indicateur s'applique à toute requête qui utilise cet indicateur, quelle que soit la formulation de la question. Une règle vérifiée après coup ne s'applique qu'aux requêtes qu'on a pensé à vérifier — et la liste de ce qu'on a pensé à vérifier est précisément ce qu'un agent explore."
      }
    }
  },
  "schema-07": {
    title: "Six décisions, classées par ce qu'elles rendent bruyant",
    regions: {
      "d1": {
        title: "D1 · Le jeu de questions de référence",
        body: "Trente à cent questions métier réelles, chacune accompagnée de la réponse que l'entreprise tient pour juste, exécutables sur le patrimoine réel.\n\nC'est la décision la moins chère du dossier et la plus rentable, pour trois raisons. Elle produit **le seul taux d'exactitude qui engage quelque chose**, puisque tous les taux publiés décrivent le patrimoine d'un autre [1][2][3][4]. Elle rend comparables deux offres dont les plaquettes ne le sont pas. Et c'est un actif qui reste à vous : il survit au changement de plateforme, de modèle et de génération d'outillage.\n\nCoût : quelques jours d'analyste, moins qu'une semaine de conseil en cadrage. À produire **avant** la mise en concurrence, faute de quoi le fournisseur fournira le jeu d'évaluation avec le produit qu'il évalue."
      },
      "d2": {
        title: "D2 · Un propriétaire métier par famille de définitions",
        body: "Une personne par famille — pas un comité, pas une équipe — avec le droit de trancher entre deux définitions concurrentes et le devoir de motiver son arbitrage.\n\nC'est la décision qui débloque le seul chantier que la technique ne fera pas à votre place. Les objets qui portent une définition opposable existent chez tous les fournisseurs ; aucun format ne dit qui signe [9][10].\n\nLe titulaire doit être un responsable métier. L'ingénieur data implémente une définition, il n'a pas l'autorité pour décider si un avoir se déduit du chiffre d'affaires. L'enquête 2026 auprès de 363 praticiens situe l'ambiguïté de la propriété des données parmi les difficultés persistantes, citée par 41 % des répondants [8].\n\nCoût : politique. C'est le seul poste de ce schéma qui ne s'achète pas."
      },
      "d3": {
        title: "D3 · L'identité propagée dès le pilote",
        body: "Aucune expérimentation sous compte de service au-delà d'un jeu de données public.\n\nLa règle a l'air excessive et elle ne l'est pas. Un pilote mené sous compte de service exclut la contrainte qui déterminera l'architecture cible : il démontre une faisabilité qui n'existe pas, et il produit une remise à plat six mois plus tard, au moment où l'équipe croit être en phase d'industrialisation.\n\nLe surcoût est réel — quelques semaines pour monter la chaîne d'authentification et de délégation — et il est payé une fois. Le coût de la remise à plat, lui, se paie sur un projet déjà engagé, avec des utilisateurs qui attendent.\n\nFenêtre : avant le pilote. Après, la démonstration a créé une attente que l'architecture ne peut pas tenir."
      },
      "d4": {
        title: "D4 · Écrire ce que l'agent refuse",
        body: "La liste des questions hors périmètre est un livrable au même titre que la liste des indicateurs, et elle se rédige en même temps.\n\nSon effet est direct sur la classe 1 : chaque question déclarée hors périmètre est une question qui reçoit un refus explicite au lieu d'un chiffre plausible. C'est exactement le mécanisme observé sur les moteurs d'indicateurs, dont les échecs prennent la forme de refus [2].\n\nSa difficulté est culturelle. Écrire noir sur blanc ce que l'outil ne fait pas contredit la logique de la démonstration, où tout fonctionne. Une direction qui accepte cet inconfort obtient un dispositif dont on connaît les bords ; une direction qui le refuse obtient un dispositif dont les bords se découvrent en comité.\n\nCoût : faible. Rendement : moyen, mais immédiat."
      },
      "d5": {
        title: "D5 · Les conventions avant les indicateurs",
        body: "Codes techniques porteurs d'un sens métier, tables gelées qu'il ne faut plus interroger, granularité des tables d'instantanés, exercice fiscal, périmètre par défaut, lignes d'annulation.\n\nC'est la meilleure conversion de classe 1 vers classe 2 par jour investi, et l'ordre importe : ces conventions se documentent **avant** les définitions d'indicateurs, parce qu'un indicateur correctement défini sur une table mal comprise reste faux.\n\nElles sont aussi exactement ce qu'aucune génération automatique ne peut deviner. Les générateurs de couche sémantique proposés depuis 2026 dérivent une structure du schéma existant [4] ; ils lisent des noms de colonnes, ils ne lisent pas des décisions passées.\n\nCoût : quelques jours d'entretien avec les analystes qui savent. Ce coût augmente chaque année, parce que ces analystes changent de poste."
      },
      "d6": {
        title: "D6 · La maintenance sémantique comme ligne budgétaire",
        body: "Une définition se périme : nouvelle offre commerciale, changement de périmètre juridique, refonte d'un système source, fusion d'entités.\n\nUne couche sémantique non entretenue redevient en dix-huit mois un glossaire faux — et un glossaire faux qui est **exécuté** est pire qu'un glossaire absent, puisqu'il produit des chiffres au lieu de produire des doutes. Le dispositif se retourne alors contre son objet : il rend silencieuses des erreurs qui auraient été bruyantes.\n\nLa parade est une ligne budgétaire annuelle et un rythme de revue explicite, rattaché aux propriétaires nommés en D2.\n\nC'est la seule des six décisions qui soit récurrente. Les cinq autres se prennent une fois ; celle-ci se reprend chaque année, et c'est ce qui la rend facile à supprimer au premier arbitrage budgétaire."
      }
    }
  }
}
