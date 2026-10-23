{
  "schema-01": {
    title: "La chaîne de mesure rangée par détectabilité de l'erreur",
    regions: {
      "maillon-instrumentation": {
        title: "Maillon 1 · Instrumentation",
        body: "Plan de marquage, taxonomie des paramètres de campagne, contrôle qualité des flux entrants. L'appétence de délégation y est moyenne, parce que le travail paraît ingrat plutôt que risqué.\n\nC'est pourtant le maillon le plus sûr à confier. Une erreur d'instrumentation **casse un total** : les volumes ne se réconcilient plus entre la plateforme et l'entrepôt, un identifiant disparaît, un événement cesse d'être émis. Le symptôme est chiffré, il se déclenche sans intervention humaine, et la reprise consiste à corriger la collecte puis à retraiter une période.\n\nPalier défendable : l'agent exécute, avec revue a posteriori par échantillonnage."
      },
      "maillon-preparation": {
        title: "Maillon 2 · Préparation",
        body: "Jointures entre sources, dédoublonnage, réconciliation entre le système de gestion de la relation client et les régies, traitement des périodes manquantes.\n\nMême profil que l'instrumentation : l'erreur se manifeste par un écart mesurable entre deux totaux qui devraient coïncider. La condition pour y monter le palier d'autonomie est explicite — des règles de réconciliation versionnées et un seuil d'écart qui déclenche une alerte.\n\nLe seul piège est l'erreur qui ne casse rien : une jointure qui perd silencieusement 3 % des commandes. D'où la revue a posteriori, qui porte sur les volumes plus que sur le code."
      },
      "maillon-specification": {
        title: "Maillon 3 · Spécification",
        body: "Le choix du plan d'identification : qui sert de témoin, sur quelle fenêtre, quels facteurs de confusion sont supposés absents, quelle règle de décision s'appliquera au résultat.\n\nC'est le premier des deux maillons du croisement. L'appétence de délégation y est forte, parce que le travail ressemble à de la rédaction. La détectabilité d'une erreur y est **nulle**, parce qu'il faudrait connaître le contre-factuel pour savoir que l'hypothèse était fausse [1].\n\nPalier plafond : l'agent propose. Il rédige la spécification, un humain nommé la signe avant collecte."
      },
      "maillon-estimation": {
        title: "Maillon 4 · Estimation",
        body: "L'exécution de la méthode retenue et le calcul des intervalles. Le maillon le plus technique, et le moins problématique des quatre centraux.\n\nUne erreur d'exécution se voit : la chaîne échoue, un intervalle devient absurde, un signe s'inverse. Une erreur de méthode ne se voit pas — mais elle a été commise au maillon précédent, pas ici. La détectabilité est donc partielle, et le palier défendable est l'exécution sous revue préalable du plan.\n\nLa condition pour monter d'un palier est concrète : la batterie de réfutation du schéma 05 exécutée et verte sur le plan effectivement retenu."
      },
      "maillon-lecture": {
        title: "Maillon 5 · Lecture et réallocation",
        body: "La traduction du chiffre en décision budgétaire. Le second maillon du croisement, et celui que 82 % des acheteurs interrogés se déclarent prêts à confier à un agent [14].\n\nDeux raisons d'y plafonner le palier. L'erreur n'est pas détectable, puisque le chiffre qui la porte est bien formé. Et elle n'est pas réversible : le budget déplacé a été dépensé, et le trimestre ne se rejoue pas.\n\nLa condition de montée n'est pas technique. Une décision budgétaire appartient à une personne, et aucun test ne peut la lui retirer."
      },
      "maillon-archivage": {
        title: "Maillon 6 · Archivage et réfutation",
        body: "Le registre des mesures, la rejouabilité, les contrôles de robustesse. Le maillon où l'appétence de délégation est la plus faible, et où le palier défendable est le plus haut.\n\nL'écart entre les deux est l'argument central du dossier. Personne n'a envie de confier l'archivage à un agent, parce que personne n'en attend de valeur. Or tout y est vérifiable : un test de réfutation rend un verdict binaire, une spécification archivée se rejoue à l'identique, un journal est complet ou ne l'est pas.\n\nPalier défendable : l'agent exécute seul."
      },
      "le-croisement": {
        title: "Le croisement",
        body: "La règle qui organise le schéma : **l'appétence de délégation déclarée ne suit pas la détectabilité de l'erreur**, et sur deux maillons les deux se croisent exactement.\n\nLa spécification et la lecture cumulent une appétence forte et une détectabilité nulle. Ce sont les deux seuls maillons où aucun contrôle automatique ne peut contredire l'agent, et ce sont ceux que le marché désigne spontanément comme délégables.\n\nL'explication tient au critère implicite employé par les acheteurs. Interrogés sur ce qu'ils confieraient, ils répondent à la question « cette tâche est-elle fastidieuse et bien définie ? ». La question utile est différente : « une erreur serait-elle détectée avant d'avoir coûté quelque chose ? »"
      }
    }
  },
  "schema-02": {
    title: "Deux chaînes, un seul contre-factuel observable",
    regions: {
      "verite-terrain-supervise": {
        title: "La vérité de terrain, en prédiction",
        body: "Le modèle annonce une probabilité d'achat. Quelques semaines plus tard, l'achat a eu lieu ou non. La quantité de référence **arrive d'elle-même**, dans le système d'information, sans qu'il faille la reconstituer.\n\nTrois conséquences pratiques. On peut masquer une partie des données avant l'entraînement, ce qui donne un échantillon de contrôle propre. On peut comparer deux modèles sur un critère unique et non négociable. Et on peut confier la boucle entière à un agent, parce qu'un mauvais choix de sa part se traduit par un mauvais score.\n\nC'est ce régime que l'intuition sur « l'IA qui s'améliore toute seule » décrit, et il ne vaut que pour la prédiction."
      },
      "verite-terrain-causal": {
        title: "Le contre-factuel, jamais observé",
        body: "La quantité qu'il faudrait connaître est le chiffre d'affaires qu'auraient réalisé **les mêmes clients, sur la même période, sans la dépense**. Elle n'a pas été observée, et elle ne le sera jamais.\n\nUne expérience randomisée ne lève pas cette impossibilité : elle fabrique un groupe témoin dont on accepte de croire qu'il se comporte comme les traités l'auraient fait. L'hypothèse est raisonnable, construite, et reste une hypothèse.\n\nHors expérience, l'hypothèse porte sur des données que personne n'a produites exprès. C'est là que se joue tout l'écart mesuré par Gordon et ses coauteurs [1], et c'est là qu'aucun contrôle automatique ne peut intervenir."
      },
      "boucle-validation": {
        title: "La boucle de validation",
        body: "La flèche qui remonte de la vérité de terrain vers le choix méthodologique est le mécanisme qui rend l'apprentissage supervisé délégable.\n\nElle est automatisable, répétable, et son verdict ne se discute pas. Un agent qui choisit mal une architecture ou une variable le découvre en une exécution, et la correction ne demande aucun arbitrage humain.\n\nCette flèche est aussi ce qui fonde l'essentiel de la confiance accordée aujourd'hui aux agents d'analyse. L'erreur consiste à la supposer présente dans toutes les tâches de données, alors qu'elle est propre à celles dont la réponse finit par être observée."
      },
      "erreur-silencieuse": {
        title: "L'erreur silencieuse",
        body: "Du côté droit, la même flèche n'existe pas : elle est barrée sur le schéma. Il n'y a rien pour remonter de la quantité de référence vers le choix méthodologique, puisque cette quantité n'a pas été mesurée.\n\nLa conséquence est une propriété et non une maladresse. Un plan d'identification faux **ne produit aucun symptôme** : ni exception, ni avertissement, ni dégradation d'un indicateur de qualité. Il produit un retour sur investissement, un intervalle de confiance, et un rapport de bonne tenue.\n\nC'est cette propriété qui disqualifie l'estimation causale comme tâche à confier en autonomie, indépendamment du niveau de compétence de l'agent."
      },
      "chiffre-663": {
        title: "Ce que coûte l'absence de boucle",
        body: "Gordon, Moakler et Zettelmeyer ont repris 663 expériences à grande échelle menées chez Meta, en disposant du dispositif le plus favorable imaginable : les expériences randomisées comme référence, des données au niveau de l'utilisateur, et l'apprentissage automatique double implémenté avec des réseaux profonds [1].\n\nL'erreur médiane sur l'incrémentalité reste de 83 %, 58 % et 24 % selon l'étage du tunnel. L'appariement par score de propension stratifié fait beaucoup plus mal, à 173 %, 176 % et 64 %.\n\nLa conclusion des auteurs mérite d'être citée dans sa franchise : malgré tout cela, ils ne parviennent pas à estimer de façon fiable l'effet causal d'une campagne. Ce qui manque, selon eux, n'est pas un meilleur estimateur, mais la journalisation par les plateformes des caractéristiques propres à chaque enchère."
      }
    }
  },
  "schema-03": {
    title: "Neuf tâches rangées par ce qu'un contrôle automatique peut attraper",
    regions: {
      "zone-deleguer": {
        title: "Bande 1 · Déléguer",
        body: "Critère d'appartenance : une erreur de l'agent produit un écart mesurable, ou un verdict qu'un tiers peut rejouer sans connaître la bonne réponse.\n\nNoter que la **compétence mesurée n'est pas le critère d'entrée**. La traduction d'une question en requête figure dans cette bande avec un taux de réussite de 21,3 % sur Spider 2.0 [7], parce qu'une requête fausse rend un résultat faux qu'on peut contrôler. La bande range par visibilité de l'échec, non par fréquence.\n\nPalier associé : l'agent exécute, avec revue a posteriori par échantillonnage."
      },
      "tache-refutation": {
        title: "La batterie de réfutation",
        body: "La tâche qui donne son argument au dossier. Elle réunit les quatre propriétés d'une délégation tenable.\n\nElle est énumérable : la liste des tests pertinents se déduit du plan d'identification retenu. Elle est mécanique : chaque test rejoue la même chaîne sur des données modifiées de façon spécifiée, sans nouvelle hypothèse. Elle est vérifiable : un placebo qui remonte un effet là où il n'y en a pas rend un verdict binaire, contrôlable par un tiers. Et elle est coûteuse à la main, donc toujours la première abandonnée dans un cycle budgétaire.\n\nDoWhy en formalise le contenu comme quatrième temps de l'analyse causale [3]. Le schéma 05 en détaille six tests."
      },
      "zone-revue": {
        title: "Bande 2 · Déléguer sous revue",
        body: "Critère d'appartenance : aucune machine ne peut trancher, mais un humain peut relire la proposition ligne à ligne avant qu'elle ne produise un effet.\n\nLes trois tâches de cette bande ont la même forme : l'agent produit un texte ou un graphe que l'analyste accepte, amende ou rejette. La proposition des facteurs de confusion y est la plus intéressante, parce que c'est là que les modèles de langage sont réellement bons — 86 % sur l'identification de causes nécessaires et suffisantes [4] — tout en défaillant de façon imprévisible.\n\nPalier associé : l'agent exécute sous revue préalable, jamais après."
      },
      "zone-verrouiller": {
        title: "Bande 3 · Verrouiller",
        body: "Critère d'appartenance : l'erreur sort sous la forme d'un chiffre plausible, et le budget engagé ne revient pas.\n\nLes trois tâches de cette bande ne sont pas interdites à l'agent : elles sont plafonnées au palier « propose ». L'agent peut rédiger, suggérer, documenter. Il ne peut pas arrêter le choix, parce qu'aucun dispositif ne permettrait de constater après coup qu'il s'est trompé.\n\nUne asymétrie mérite d'être relevée. C'est la bande où le marché déclare la plus forte appétence de délégation [14], et la seule où une erreur ne laisse aucune trace exploitable."
      },
      "tache-identification": {
        title: "La déduction de l'effet estimable",
        body: "Passer du graphe causal à la formule d'estimation que ce graphe autorise. L'opération est purement formelle, et c'est celle où les modèles de langage sont les plus faibles.\n\nLe jeu d'épreuves Corr2Cause mesure exactement cela : à partir d'un ensemble d'énoncés de corrélation, quelle relation causale peut-on déduire ? Sur plus de 200 000 exemples et dix-sept modèles, les performances s'approchent du tirage aléatoire, et l'affinage spécialisé ne généralise pas hors distribution [5].\n\nLa combinaison avec le résultat de Kıcıman et al. [4] dessine la ligne de partage du dossier : bon pour proposer le graphe, mauvais pour en tirer la formule. Or dans un plan de mesure, c'est la formule qui détermine le chiffre."
      }
    }
  },
  "schema-04": {
    title: "Le jardin aux sentiers qui bifurquent, à l'échelle machine",
    regions: {
      "bifurcation-fenetre": {
        title: "Bifurcation 1 · La fenêtre",
        body: "Sept jours, quatorze jours, trente jours. Trois choix défendables, trois résultats différents, et aucune donnée qui permette de trancher entre eux depuis l'intérieur de l'analyse.\n\nLa fenêtre est l'exemple le plus propre du mécanisme, parce que l'argument en faveur de chaque valeur est recevable : la fenêtre courte limite la contamination par d'autres leviers, la fenêtre longue capte la rémanence. Un comité acceptera les trois.\n\nC'est précisément ce qui rend le choix dangereux une fois le résultat connu. Un analyste qui retient la fenêtre après avoir vu les trois estimations a pris une décision que rien dans le livrable ne signale."
      },
      "bifurcation-population": {
        title: "Bifurcation 2 · La population",
        body: "Tous les clients, hors clients déjà fidèles, clients actifs sur la période. Le choix du périmètre déplace l'estimation parce qu'il déplace la part du résultat qui serait advenue de toute façon.\n\nLa variante « hors clients fidèles » est souvent la plus honnête, puisqu'elle retire du calcul ceux dont l'achat ne devait rien à la campagne. Elle est aussi celle qui donne les chiffres les moins flatteurs, ce qui explique sa rareté dans les livrables.\n\nLes deux bifurcations suivantes — traitement des valeurs extrêmes et forme de la saturation — suivent la même logique. Quatre choix à trois branches suffisent à produire quatre-vingt-une spécifications."
      },
      "debit-humain": {
        title: "Le débit d'un analyste",
        body: "Cinq chemins, parce que chaque chemin coûte une demi-journée de reconstruction du jeu de données, d'exécution et de dépouillement.\n\nCette limite a longtemps joué un rôle protecteur involontaire. Le biais de sélection décrit par Gelman et Loken existait, mais il portait sur cinq spécifications parmi quatre-vingt-une, ce qui bornait son ampleur [9].\n\nElle jouait aussi un rôle disciplinaire : un analyste qui n'a le temps que de cinq chemins les choisit avant de commencer, et les justifie. La contrainte de temps produisait une forme rudimentaire de pré-enregistrement."
      },
      "debit-agent": {
        title: "Le débit d'un agent",
        body: "Quatre-vingt-une spécifications avant midi, et le rapport d'une seule.\n\nLe mécanisme de Gelman et Loken était un biais de sélection implicite, borné par le temps humain. Il devient **exhaustif**. Demander à un agent « trouve une mesure de l'effet de la promotion qui soit robuste » revient à demander le maximum de la distribution, assorti des justifications méthodologiques qui vont bien.\n\nAucune mauvaise foi n'est requise, ni de l'agent ni de celui qui l'emploie. La formulation de la demande suffit, et c'est ce qui rend le problème difficile à repérer en relecture : le livrable est impeccable, et il ne mentionne pas les quatre-vingts autres chemins."
      },
      "contre-mesure": {
        title: "Les deux contre-mesures",
        body: "Le même débit, orienté autrement, fournit la pièce qui documente le problème qu'il avait aggravé.\n\n**Pré-enregistrer** la règle de décision avant collecte : indicateur principal, population, fenêtre, seuil, traitement des valeurs extrêmes, écrits et horodatés. La plateforme d'expérimentation de Spotify l'impose au niveau de l'outil et standardise la chaîne d'analyse — mêmes tests, même contrôle de déséquilibre d'allocation, même correction de tests multiples [10]. Limite admise : un plan mal spécifié réintroduit la souplesse qu'il prétendait fermer.\n\n**Journaliser les quatre-vingt-une**, avec le rang de celle qu'on propose. Cette analyse en courbe de spécification coûtait des semaines, donc restait académique. Un agent la produit en une après-midi."
      }
    }
  },
  "schema-05": {
    title: "Le poste de travail de la réfutation",
    regions: {
      "colonne-cout": {
        title: "La colonne du coût à la main",
        body: "C'est cette colonne qui explique pourquoi la réfutation est presque toujours absente des livrables de mesure, et pourquoi sa délégation change quelque chose.\n\nChaque test demande une reconstruction du jeu de données, un passage complet de la chaîne, un dépouillement. Multiplié par six tests et par le nombre de canaux d'un plan média, le volume dépasse ce qu'une équipe de mesure absorbe dans un cycle budgétaire. La réfutation est donc la variable d'ajustement par défaut.\n\nLe déplacement proposé est budgétaire autant que méthodologique : la ligne se dimensionne en jours-agent plutôt qu'en jours-homme, ce qui la rend défendable devant un comité."
      },
      "test-placebo": {
        title: "Le test de placebo",
        body: "On applique la même chaîne d'estimation à un traitement qui n'a pas eu lieu : une période où aucune campagne n'a tourné, ou un groupe qui n'a jamais été exposé.\n\nSi un effet remonte, le plan d'identification capte autre chose que la campagne — une saisonnalité, une tendance, un biais de sélection dans la constitution du témoin.\n\nC'est le test le plus utile et le plus vérifiable de la batterie. Son verdict est binaire, il ne demande aucune interprétation, et un tiers peut le rejouer sans connaître la vérité de terrain. DoWhy le place au cœur de son quatrième temps [3]."
      },
      "test-controle-negatif": {
        title: "Le contrôle négatif",
        body: "On choisit un indicateur dont on sait d'avance qu'il ne pouvait pas être affecté par la campagne : les ventes d'une catégorie non promue, le trafic d'une zone non couverte, une cohorte exclue du ciblage.\n\nSi cet indicateur bouge, le plan capte un phénomène commun aux deux groupes et l'attribue au traitement.\n\nLe coût est faible et la valeur de signal élevée, ce qui en fait le premier test à automatiser. La difficulté n'est pas l'exécution mais le choix de l'indicateur, qui relève de la connaissance du domaine — donc du maillon « proposition », sous revue humaine."
      },
      "test-periode-anterieure": {
        title: "Le rejeu avant traitement",
        body: "On mesure l'écart entre groupe traité et groupe témoin sur une période qui précède le début de la campagne.\n\nL'écart attendu est nul. S'il ne l'est pas, les deux groupes n'étaient pas comparables, et toute différence mesurée pendant la campagne mélange l'effet du traitement avec cet écart préexistant.\n\nCe test est le contrôle de base de tout test géographique, et il est régulièrement omis parce qu'il demande de remonter une période d'historique supplémentaire. C'est un travail de préparation de données, sans aucune décision méthodologique nouvelle : le profil exact d'une tâche d'agent."
      },
      "test-sensibilite-priors": {
        title: "La sensibilité aux priors",
        body: "Dans un modèle de mix bayésien, le retour sur investissement estimé dépend des distributions fixées avant l'estimation. On fait varier ces priors et on observe de combien l'estimation bouge.\n\nSi elle bouge beaucoup, le résultat reflète la croyance de l'analyste davantage que les données de la période. Le constat n'invalide pas le modèle, mais il interdit de présenter l'estimation comme une mesure.\n\nMeridian a codifié ce diagnostic : un score composite de besoin de calibration par canal, un seuil à 67,5 en dessous duquel le canal est proposé à la calibration, et le rappel que les priors livrés par défaut sont modérément informatifs [11]. C'est le seul test de la batterie dont la délégation suppose que l'humain ait d'abord fixé le prior de référence."
      }
    }
  },
  "schema-06": {
    title: "Le circuit de signature d'une mesure déléguée",
    regions: {
      "artefact-specification": {
        title: "Artefact 1 · La spécification pré-enregistrée",
        body: "Question posée, plan d'identification, indicateur principal, population, fenêtre, règle de décision, seuil. Horodatée avant que la première donnée n'arrive.\n\nL'agent la rédige, et il le fait mieux qu'un humain pressé : énumérer les choix et leurs justifications est un travail de rédaction structurée. L'analyste la revoit. Le responsable de la mesure la signe.\n\nC'est le seul des trois artefacts qui porte une signature, et c'est le point de non-délégation du dispositif. Ce que la signature engage n'est pas un calcul, mais une hypothèse sur le monde que les données ne trancheront jamais."
      },
      "artefact-journal": {
        title: "Artefact 2 · Le journal des spécifications",
        body: "Toutes les variantes parcourues, leur estimation, et le rang de celle qu'on propose dans la distribution obtenue.\n\nProduit intégralement par l'agent, et relu par personne. Le journal n'existe pas pour être lu : il existe pour être consultable le jour où un résultat est contesté. Sa seule existence décourage la sélection opportuniste, de la même façon qu'un registre décourage l'approximation.\n\nIl a un second usage, moins défensif. Les quatre-vingt-une estimations journalisées constituent une connaissance réutilisable sur la sensibilité de la mesure aux choix de méthode. Non journalisées, elles ne sont qu'une occasion de biais."
      },
      "artefact-refutation": {
        title: "Artefact 3 · Le jeu de réfutation",
        body: "Les tests exigés par le plan d'identification retenu, avec leur verdict. Exécuté par l'agent, lu par l'analyste.\n\nUn test qui échoue bloque la publication du chiffre, sans arbitrage humain préalable. C'est le seul endroit du dispositif où l'agent dispose d'un droit de veto, et il l'a pour une raison précise : son verdict se vérifie sans connaître la vérité de terrain.\n\nLa règle n'interdit pas de publier malgré un échec. Elle impose que la levée du blocage soit une décision explicite, signée, avec son motif — plutôt qu'un test jamais exécuté."
      },
      "signature-humaine": {
        title: "Le point de non-délégation",
        body: "La signature de la spécification est ce que le dispositif refuse de confier à un agent, et la raison tient en une phrase : elle engage une personne sur une hypothèse que les données ne trancheront jamais.\n\nUne seconde règle la complète. Le signataire de la spécification se distingue du porteur du résultat. Le premier engage une compétence méthodologique, le second une décision budgétaire. Quand les deux rôles sont tenus par la même personne, la revue préalable devient une formalité — et le fait qu'un agent rédige la spécification achève de vider la signature de contenu.\n\nAucune des deux règles n'est nouvelle. Ce qui change, c'est que le coût de production d'une spécification complète vient de s'effondrer, ce qui retire le dernier argument pratique contre leur généralisation."
      }
    }
  },
  "schema-07": {
    title: "Un palier d'autonomie par maillon, et sa condition de sortie",
    regions: {
      "palier-proposer": {
        title: "Palier 1 · L'agent propose",
        body: "L'agent rédige, documente, suggère. Il n'engage rien. Un humain nommé valide avant toute exécution, et sa validation est tracée.\n\nC'est le plafond défendable sur les deux maillons du croisement : la spécification du plan d'identification et la lecture qui engage le budget. Dans les deux cas, l'agent reste utile — une spécification bien rédigée est un gain réel de temps et de qualité — mais son produit n'a aucun effet avant la signature.\n\nLa condition pour dépasser ce palier sur la spécification serait l'existence d'un dispositif capable de noter un choix d'identification sur des données d'entreprise. Il n'en existe aucun, et la troisième section du dossier explique pourquoi."
      },
      "palier-supervise": {
        title: "Palier 2 · Exécute sous revue préalable",
        body: "Le plan produit par l'agent est relu par un humain avant de tourner, puis l'exécution se fait sans intervention.\n\nC'est le plafond de l'estimation. Une erreur d'exécution se voit — la chaîne échoue, un intervalle devient absurde, un signe s'inverse — mais une erreur de méthode ne se voit pas, et elle a été commise au maillon précédent.\n\nLa condition de montée est opérationnelle et atteignable : la batterie de réfutation du schéma 05 exécutée et verte sur le plan effectivement retenu. Un dispositif qui remplit cette condition peut passer l'estimation en revue a posteriori."
      },
      "palier-revue-posteriori": {
        title: "Palier 3 · Revue a posteriori",
        body: "L'agent exécute sans validation préalable. Un échantillon de ses sorties est contrôlé après coup, à cadence fixée.\n\nC'est le plafond défendable sur l'instrumentation et la préparation des données. Une erreur y produit un écart mesurable entre deux totaux qui devraient coïncider, et la reprise consiste à retraiter une période.\n\nLe piège de ce palier est l'erreur qui ne casse rien : une jointure qui perd silencieusement 3 % des commandes. D'où la forme que doit prendre la revue — un contrôle de volumes et de réconciliations plutôt qu'une relecture de code."
      },
      "palier-autonome": {
        title: "Palier 4 · Exécute seul",
        body: "Aucune revue systématique. Le palier n'est défendable que sur un maillon : l'archivage et la réfutation.\n\nLa raison est la même que celle qui fonde tout le dossier. Un test de réfutation rend un verdict binaire, vérifiable sans connaître la vérité de terrain. Une spécification archivée se rejoue à l'identique. Un journal est complet ou ne l'est pas. Rien de tout cela ne demande d'arbitrage.\n\nL'écart entre ce palier et l'appétence déclarée mérite d'être noté : c'est le maillon que personne ne songe à déléguer, et le seul qui supporte l'autonomie complète."
      },
      "condition-montee": {
        title: "La colonne des conditions",
        body: "Chaque ligne du tableau porte une condition **vérifiable**, et non une promesse de maturité.\n\nLa formulation compte. « Quand les modèles seront meilleurs » ne constitue pas une condition : elle ne se constate pas, elle ne se date pas, et elle autorise une montée de palier à n'importe quel moment. « Quand la batterie de réfutation sera verte sur le plan retenu » se constate en une exécution.\n\nDeux lignes du tableau portent une condition qui ne dépend d'aucun progrès technique. Sur la spécification, il faudrait un dispositif de notation qui n'existe pas. Sur la lecture, il n'y a rien à attendre : la décision budgétaire appartient à une personne, et le budget engagé ne revient pas."
      }
    }
  }
}
