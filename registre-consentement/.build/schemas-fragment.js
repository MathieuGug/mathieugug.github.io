{
  "schema-01": {
    title: "Trois registres, un seul nom",
    regions: {
      "registre-choix": {
        title: "Registre 1 · Le choix",
        body: "Le seul des trois qu'un outil du marché produit sans qu'on le demande. Il répond à une question opérationnelle : faut-il réafficher la bannière à ce visiteur ? D'où son indexation par identifiant de navigateur ou de compte, et sa granularité par finalité et par fournisseur.\n\nLa recommandation consolidée de janvier 2026 retient six mois comme bonne pratique de conservation des choix, refus compris, en précisant que la durée s'apprécie au cas par cas selon la nature du site et les spécificités de son audience [2].\n\nSix mois est une durée d'exploitation. L'appliquer aux deux autres registres est l'erreur d'archivage la plus courante du domaine."
      },
      "registre-preuve": {
        title: "Registre 2 · La preuve",
        body: "Il répond à une question de contrôle : que proposait-on, et comment, à cette date ? Il n'est donc pas indexé par utilisateur mais par **version d'affichage**. C'est un registre de configurations et non de personnes, ce qui a une conséquence agréable : il ne contient pas de donnée personnelle, et sa conservation longue ne pose pas de difficulté au titre de la minimisation.\n\nSa durée pertinente est celle du risque : tant qu'un contrôle ou une action peut porter sur une période, la preuve relative à cette période doit exister.\n\nLa recommandation en liste les pièces attendues [2]. Aucune n'est produite par défaut par une plateforme de recueil."
      },
      "registre-serie": {
        title: "Registre 3 · La série",
        body: "Il répond à une question analytique : comment le consentement a-t-il évolué, et pourquoi ? Agrégé, daté, sans donnée personnelle. Aucun texte ne l'exige, aucun audit ne le réclame, aucune ligne budgétaire ne le porte.\n\nSon absence ne fait jamais échouer un contrôle. Elle fait échouer, silencieusement, toute tentative d'expliquer une variation de performance : les quatre causes possibles d'une baisse de conversions produisent la même forme de courbe, et seule une série datée les sépare.\n\nTrois colonnes suffisent : la date, le taux par finalité, l'identifiant de version de bannière en production. Une quatrième, indiquant si la période était modélisée, rend le tableau utilisable en comité."
      },
      "ligne-proprietaire": {
        title: "La ligne qui explique tout le reste",
        body: "Les trois registres n'appartiennent pas à la même équipe, et c'est la raison la plus banale de leur état.\n\nLe premier est technique : il vit chez qui administre l'outil, qui a le budget et les accès. Le deuxième est documentaire : il relève du délégué à la protection des données, qui en définit le contenu sans disposer, le plus souvent, des accès techniques permettant de le constituer. Le troisième intéresse l'équipe mesure, qui n'a aucun mandat pour l'exiger de qui que ce soit.\n\nUn registre dont personne n'est propriétaire est un registre inexistant, quel que soit le budget alloué. C'est l'objet de la décision D1."
      }
    }
  },
  "schema-02": {
    title: "Anatomie d'une pièce de preuve opposable",
    regions: {
      "condensat": {
        title: "Dispositif 1 · Le condensat horodaté",
        body: "La recommandation consolidée suggère de publier un condensat du code informatique de la bannière, de façon horodatée, sur une plate-forme publique, afin de pouvoir prouver a posteriori l'authenticité de la version invoquée [2].\n\nL'intérêt du dispositif tient entièrement au tiers : une date que l'on s'attribue à soi-même ne vaut pas beaucoup, une date attestée hors de son propre système vaut davantage.\n\nSa limite est indiquée dans le dossier : il établit qu'un code existait à une date, non qu'il était servi à l'ensemble du trafic. Une organisation qui expérimente sur ses bannières doit journaliser ses variantes en parallèle, faute de quoi son registre atteste d'une version qu'une partie de ses visiteurs n'a jamais vue."
      },
      "capture": {
        title: "Dispositif 2 · La capture du rendu",
        body: "Une capture du rendu visuel affiché, conservée de façon horodatée pour chaque version, sur terminal mobile et sur terminal fixe [2].\n\nC'est la pièce la plus directement probante, parce qu'elle montre ce que le grief viserait : le nombre de boutons au premier niveau, la présence d'un refus direct, la hiérarchie visuelle entre les deux chemins.\n\nC'est aussi le poste que les organisations sous-estiment le plus, parce que le nombre de combinaisons croît vite. Deux terminaux, deux niveaux d'affichage, trois langues et une refonte par trimestre font quarante-huit pièces par an.\n\nLa même capture sert à annoter les séries de conversion. C'est le point de jonction entre le registre 2 et le registre 3."
      },
      "configuration": {
        title: "Dispositif 3 · L'historique des configurations",
        body: "Les informations relatives aux outils mis en œuvre et à leurs configurations successives, conservées de façon horodatée [2].\n\nC'est le dispositif dont la faisabilité ne dépend pas de l'éditeur mais de son prestataire. La plupart des consoles d'administration affichent l'état courant du paramétrage et écrasent le précédent : il n'y a pas d'historique à extraire, seulement un instantané.\n\nD'où le statut de cette exigence : un point de négociation contractuelle plutôt qu'un problème technique. L'export périodique horodaté du paramétrage complet, liste des fournisseurs incluse, est la première des trois clauses de la décision D3."
      },
      "restitution": {
        title: "La sortie · Le dossier d'une date",
        body: "La procédure qui, à partir d'une date, produit le dossier complet de ce qui était affiché et configuré. C'est la seule chose qu'un contrôleur demandera, et c'est rarement ce qu'une organisation a préparé.\n\nDeux exigences pratiques. Elle doit être écrite, parce qu'elle mobilise plusieurs systèmes détenus par plusieurs équipes. Et elle doit être testée : une procédure de restitution non testée est une hypothèse, pas une capacité.\n\nUn test par an suffit, à condition de le mener sur une date choisie au hasard plutôt que sur la plus récente."
      }
    }
  },
  "schema-03": {
    title: "Qui détient quoi dans la chaîne",
    regions: {
      "outil-recueil": {
        title: "La plateforme de recueil",
        body: "Elle conserve le choix de chaque visiteur et l'état courant de son propre paramétrage. Elle ne conserve ni l'historique de ses configurations successives, ni le rendu qui était affiché, sauf si le contrat l'exige.\n\nSa charge de preuve est nulle : elle est prestataire technique, et le responsable du traitement reste l'éditeur.\n\nL'étude longitudinale sur 11 364 sites apporte ici un constat inconfortable pour le marché : les plateformes de recueil montrent peu de réaction à l'action réglementaire et peu d'influence sur les taux de conformité observés [8]. La délégation de la conformité à l'outil n'est pas seulement juridiquement inexacte, elle est empiriquement démentie."
      },
      "editeur": {
        title: "L'éditeur · responsable du traitement",
        body: "Il porte la charge entière de la démonstration, et il est le seul acteur de la chaîne dans ce cas.\n\nCe qu'il détient : le code de son site dans son gestionnaire de versions, et des tableaux de bord de performance sans annotation. Ce qu'il ne détient pas : le rendu daté de sa bannière, l'historique du paramétrage, la série de ses taux. C'est exactement la liste de ce qu'on lui demandera.\n\nLe même travail montre que la progression de la conformité vient des éditeurs : la part de bannières offrant un refus en un clic passe de 2,94 % en 2018 à 30,66 % en 2024, et cette progression suit l'action des autorités nationales [8]."
      },
      "plateforme": {
        title: "Les plateformes en aval",
        body: "Régies, partenaires de mesure, places de marché. Elles conservent le signal de consentement reçu à chaque appel et leurs propres modèles d'estimation, qu'elles ne restituent pas.\n\nLeur charge de preuve n'est pas nulle : elle est **reportée**. La politique européenne de consentement de Google exige du client qu'il conserve le texte et les choix présentés à l'utilisateur, avec la date et l'heure du consentement affirmatif [11].\n\nLa conséquence est l'argument budgétaire du dossier : le registre de preuve n'est plus une dépense de conformité pure dès lors que son absence peut dégrader l'accès aux données de campagne."
      },
      "trou": {
        title: "Le trou",
        body: "Deux acteurs exigent la même pièce, pour des raisons opposées. Le régulateur français recommande de conserver, horodatés, le rendu visuel par version et l'historique des configurations [2]. Le principal acheteur d'inventaire l'impose par contrat, dans des termes presque identiques [11].\n\nAucun des deux ne la produit. Et celui qui doit la produire, l'éditeur, est précisément le seul acteur de la chaîne à ne pas l'avoir.\n\nLes recours diffèrent, ce qui vaut d'être noté en comité : un manquement au premier expose à une sanction administrative, un manquement au second à une restriction de collecte dont l'effet sur la mesure est immédiat."
      }
    }
  },
  "schema-04": {
    title: "Les six postes d'un registre opposable",
    regions: {
      "versionnement": {
        title: "Poste 1 · Versionner la bannière",
        body: "Traiter la configuration de recueil comme du code : chaque modification produit une version identifiée, datée, avec son auteur et son motif.\n\nPour une équipe qui pratique déjà la gestion de versions, le coût de mise en place est faible et le récurrent est nul. C'est le poste qui rend les cinq autres possibles, parce qu'il fournit l'identifiant auquel tout le reste s'accroche : la capture, l'export de configuration, et la colonne d'annotation des séries de conversion.\n\nCommencer par ce poste plutôt que par l'achat d'un outil est le seul conseil d'ordonnancement de ce dossier."
      },
      "capture-rendu": {
        title: "Poste 2 · Capturer le rendu",
        body: "Le premier niveau et le second niveau, sur terminal fixe et sur terminal mobile, pour chaque langue et chaque variante géographique servie, à chaque déploiement.\n\nLe volume est la difficulté. Trois langues, deux terminaux, deux niveaux et une refonte trimestrielle produisent quarante-huit pièces par an, et le nombre de variantes géographiques d'un site marchand européen dépasse souvent trois.\n\nLa parade est l'automatisation à la mise en production plutôt que la capture manuelle périodique, qui décroche au deuxième trimestre dans à peu près toutes les organisations."
      },
      "journal-configuration": {
        title: "Poste 3 · Journaliser les configurations",
        body: "Extraire périodiquement l'état complet du paramétrage de l'outil, liste des fournisseurs déclarés incluse, et conserver la série de ces extractions.\n\nLa faisabilité ne dépend pas de l'éditeur. Elle dépend de ce que le prestataire accepte d'exposer, et de la forme sous laquelle il l'expose. Un export lisible par machine, horodaté, complet, n'est pas une fonctionnalité universelle du marché.\n\nD'où la place de ce poste : dans le contrat, au renouvellement, comme critère de sélection. C'est la première des trois clauses de la décision D3."
      },
      "reconstitution": {
        title: "Poste 6 · Reconstituer ce qu'on n'a pas conservé",
        body: "Le seul poste dont le coût a été mesuré, et il l'a été par des chercheurs plutôt que par une entreprise.\n\nPour reconstruire l'histoire des bannières de 11 364 sites entre 2018 et 2024, les auteurs de l'étude longitudinale ont dû combiner une archive publique du web et un jeu de données de collecte à grande échelle, en développant une méthode de rejeu des bannières sur des pages archivées [8].\n\nUne équipe de recherche a donc conçu un dispositif d'archéologie du web pour obtenir une information que chaque éditeur concerné détenait par construction et n'avait pas conservée. Le résultat reste partiel, et il n'est pas opposable : la date d'archivage d'un tiers ne prouve pas la date de mise en production."
      }
    }
  },
  "schema-05": {
    title: "D'où vient la variation ?",
    regions: {
      "branche-marche": {
        title: "Branche 1 · Le marché",
        body: "Demande en recul, pression concurrentielle, saisonnalité. C'est l'explication qui remonte en comité, parce qu'elle est la seule qu'on puisse formuler sans donnée interne supplémentaire.\n\nElle n'est pas fausse pour autant. Elle est simplement **non testée** tant que les trois autres branches n'ont pas été écartées, et les trois autres branches se testent avec des pièces documentaires que l'organisation est censée détenir.\n\nRègle de lecture : le marché est une conclusion, pas une hypothèse de départ."
      },
      "branche-banniere": {
        title: "Branche 2 · La bannière",
        body: "Une refonte du parcours de choix modifie le taux de consentement, donc la population observée, donc le volume de conversions mesuré.\n\nL'ampleur n'est pas marginale. Les travaux de Nouwens et de ses coauteurs, présentés à CHI en 2020, montrent que la position et la disponibilité du refus au premier niveau déplacent le consentement de plus de vingt points de pourcentage [9]. Le niveau de départ compte aussi : l'opt-in français se situe autour de 55 à 60 % [10].\n\nConséquence de cadrage : un changement de design de bannière est une intervention sur l'instrument de mesure, de la même nature qu'un changement de balise, et devrait être traité avec les mêmes précautions.\n\nLa pièce qui tranche cette branche est le journal des versions, soit exactement celle que le régulateur demande."
      },
      "branche-modelisation": {
        title: "Branche 3 · La modélisation",
        body: "L'extrapolation des données manquantes depuis les visiteurs consentants ne s'active que sous conditions : au moins mille événements par jour avec stockage analytique refusé pendant sept jours, et au moins mille utilisateurs quotidiens consentants sur sept des vingt-huit derniers jours. La documentation ajoute que le respect de ces seuils ne garantit pas l'éligibilité [13].\n\nUne propriété peut donc entrer et sortir du régime modélisé sans notification, et la part modélisée du chiffre affiché varie sans que rien ne le signale.\n\nC'est la branche que rien ne permet de trancher rétrospectivement, sauf à avoir tenu sa propre série de taux et de volumes. Elle est la raison d'être du registre 3."
      },
      "branche-perimetre": {
        title: "Branche 4 · Le périmètre",
        body: "Un pixel ajouté, un partenaire retiré de la liste, une finalité renommée dans la configuration : la population mesurée change sans qu'aucune ligne de code du site n'ait bougé.\n\nCette branche est la plus facile à écarter, à condition de disposer de l'historique des configurations. Elle est aussi la plus fréquente, parce que les listes de fournisseurs d'une plateforme de recueil évoluent au rythme des contrats commerciaux plutôt qu'à celui des mises en production.\n\nLe périmètre concerné dépasse largement le cookie : les lignes directrices européennes couvrent le suivi par URL et par pixel, le traitement local avec sortie d'information, et le suivi par adresse IP seule [7]."
      },
      "verdict": {
        title: "Le verdict",
        body: "Trois des quatre branches se tranchent avec des pièces que le régulateur demande déjà : le journal des versions, les captures horodatées, l'historique des configurations. L'argument est donc économique autant que juridique, puisque la dépense est mutualisée entre deux usages.\n\nLa quatrième branche, la modélisation, ne se tranche avec aucune pièce fournie par un tiers. Elle exige une série tenue en interne, que personne n'exige et que personne ne finance.\n\nC'est pourquoi la décision D4 attache la série à la pièce réglementaire plutôt que de la défendre pour elle-même : une ligne qu'aucune obligation ne protège ne survit pas au premier arbitrage de fin d'exercice."
      }
    }
  },
  "schema-06": {
    title: "Quatre décisions, quatre pièces",
    regions: {
      "d1": {
        title: "D1 · Nommer un propriétaire unique",
        body: "Ni la plateforme de recueil, ni l'agence, ni le délégué à la protection des données seul. Le partage qui fonctionne : la fonction qui déploie la bannière **tient** le registre, la fonction qui porte la conformité en **définit le contenu**.\n\nLa pièce produite est modeste et décisive : une ligne dans une lettre de mission ou une fiche de poste, assortie de l'accès technique correspondant. L'accès compte autant que la ligne, parce que le cas le plus fréquent est celui d'un propriétaire désigné sans droit de lecture sur la console d'administration.\n\nÀ défaut, le registre n'existera pas, quel que soit le budget alloué."
      },
      "d2": {
        title: "D2 · Écrire deux durées, séparément",
        body: "Celle des choix : six mois comme bonne pratique, ajustée à la nature du site et aux spécificités de son audience [2]. Celle de la preuve : la période pendant laquelle un contrôle ou une action peut porter sur les traitements concernés.\n\nLes deux se documentent dans le registre des traitements, avec leur justification et la règle de purge qui va avec. Un registre qui conserve tout sans règle devient à son tour un manquement.\n\nL'erreur à éviter est nommée dans le dossier : appliquer les six mois des choix à la preuve, et détruire la pièce avant la fin de la période de risque. Le registre de preuve ne contient pas de donnée personnelle, ce qui lève l'objection la plus souvent avancée contre sa conservation longue."
      },
      "d3": {
        title: "D3 · Exiger l'export et le rejeu au contrat",
        body: "Trois clauses, négociées au renouvellement, et dont l'absence est un critère de sélection.\n\nUn : l'export périodique et horodaté du paramétrage complet, liste des fournisseurs incluse, dans un format exploitable hors de l'outil. Deux : la conservation de l'historique des configurations pendant une durée au moins égale à celle du registre de preuve. Trois : la capacité de restituer, pour une date passée, la version de bannière alors servie.\n\nLa pièce produite comprend un test de restitution à la recette, sans quoi les clauses restent déclaratives. La valeur de ces clauses se révèle surtout au changement de prestataire, moment où l'historique disparaît si rien ne l'a prévu."
      },
      "d4": {
        title: "D4 · Annoter les séries de conversion",
        body: "Tout tableau de bord de conversion porte, sur le même axe temporel, les changements de version de bannière, les taux de consentement par finalité, et l'indication du régime de modélisation en vigueur.\n\nLa règle de comité qui en découle se formule en une phrase : aucune variation de performance n'est commentée sans que ces trois informations soient affichées.\n\nC'est la décision qui sauve le troisième registre, et sa mécanique est délibérée. Une série qu'aucune obligation ne protège disparaît au premier arbitrage de fin d'exercice. En l'attachant à la pièce que le régulateur demande, on la rend structurellement inséparable d'une dépense déjà justifiée."
      }
    }
  }
}
