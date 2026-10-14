{
  "schema-01": {
    title: "La chaîne contre-couplée",
    regions: {
      "parole": {
        title: "La parole",
        body: "La charte, les principes d'usage, la politique interne. Coût de production : une réunion et une relecture juridique.\n\nC'est la seule des trois productions qui ne demande l'accord de personne pour exister, et la seule qui s'adresse directement à un public externe (conseil d'administration, régulateur, clients, candidats).\n\nSa fonction première est de produire de la légitimité. Ce n'est pas un reproche : une organisation a besoin de légitimité, et la parole est le moyen le moins coûteux de s'en procurer. Le problème commence quand on lit cette production comme l'annonce d'une décision à venir."
      },
      "decision": {
        title: "La décision",
        body: "L'autorisation, le refus, la condition de maintien. Coût de production : un conflit avec celui à qui l'on dit non.\n\nUne décision se reconnaît à ce qu'elle ferme une option. Elle a un titulaire, une date, un périmètre, et elle laisse une trace que quelqu'un pourra produire plus tard.\n\nC'est la production la plus rare des trois, et la grille de la section 2 sert précisément à vérifier qu'elle a eu lieu."
      },
      "action": {
        title: "L'action",
        body: "Le déploiement réel : les agents en production, les jeux de données exposés, les outils branchés sur les systèmes de gestion.\n\nL'action a une propriété que les deux autres productions n'ont pas : elle n'a pas besoin d'un accord pour se produire. Une direction métier dotée d'un budget et d'un fournisseur agit, et la gouvernance la découvre après.\n\nCredo AI mesure que 60 % des entreprises déploient de l'IA dans plusieurs directions métier, contre 4 % qui estiment leur gouvernance capable de suivre [9]. L'écart est l'objet de ce schéma."
      },
      "contre-couplage": {
        title: "Le contre-couplage",
        body: "La thèse de Brunsson, et le point de bascule de ce dossier. Les trois productions d'une organisation ne sont pas faiblement couplées : elles sont **contre-couplées**. La parole et la décision servent à *compenser* l'action plutôt qu'à l'annoncer [11].\n\nAutrement dit, plus une organisation est contrainte d'agir dans un sens, plus elle a besoin de parler dans l'autre. Une entreprise qui déploie vite et sans arbitrage a un besoin de charte proportionnel à sa vitesse.\n\nConséquence de lecture : la publication d'une charte d'IA ne renseigne pas sur l'existence d'une instance, et peut même renseigner contre."
      },
      "mesure-2026": {
        title: "L'écart mesuré en 2026",
        body: "Deux enquêtes de 2026, deux formulations différentes, le même décalage.\n\nCredo AI : 60 % des entreprises déploient de l'IA dans plusieurs directions métier, 4 % estiment disposer d'une gouvernance capable de suivre ce rythme [9].\n\nGrant Thornton : 78 % des dirigeants interrogés ne se déclarent pas confiants dans leur capacité à passer un audit indépendant de gouvernance de l'IA sous quatre-vingt-dix jours [10].\n\nRéserve importante : ce sont des déclarations de dirigeants et non des mesures auditées. Elles ne prouvent pas la thèse, elles en décrivent le terrain."
      }
    }
  },
  "schema-02": {
    title: "Quatre pièces, quatre substituts",
    regions: {
      "ordre-du-jour": {
        title: "Pièce 1 — l'ordre du jour contraint",
        body: "L'ordre du jour d'une instance d'arbitrage est produit par une règle, et non par une négociation. La règle lie le registre des cas d'usage à la saisine obligatoire : tel niveau d'exposition, tel montant, tel type de donnée, telle autonomie accordée à un agent déclenchent un passage.\n\n**Ce qu'elle rend indéniable** : qu'un cas d'usage a été vu.\n\n**Son substitut** : un ordre du jour construit par la direction qui porte le sujet, où ne remonte que ce qu'on accepte de montrer. Une instance qui choisit son ordre du jour n'arbitre pas un portefeuille, elle commente un échantillon.\n\n**Son coût** : une règle écrite, et un registre tenu par quelqu'un qui n'est pas le porteur des cas d'usage."
      },
      "proces-verbal": {
        title: "Pièce 2 — le procès-verbal nominatif",
        body: "Non pas « le comité a validé », mais « X a décidé, Y s'est opposé, Z était absent ».\n\n**Ce qu'elle rend indéniable** : qui a décidé.\n\n**Son substitut** : le compte rendu de séance au style impersonnel, qui enregistre un consensus sans titulaire.\n\n**Pourquoi elle vaut plus qu'une formalité** : dans la doctrine Caremark, ce qui protège un dirigeant est l'existence d'un dispositif de remontée et la preuve qu'il l'a suivi [12]. Le procès-verbal nominatif est cette preuve.\n\n**Son coût** : une convention de rédaction, et l'acceptation que le désaccord s'écrive."
      },
      "decision-datee": {
        title: "Pièce 3 — la décision à effet daté",
        body: "Une décision d'instance porte une date d'effet, des conditions de maintien, et une procédure de reprise si les conditions cessent d'être remplies.\n\n**Ce qu'elle rend indéniable** : ce qui a été autorisé, et jusqu'à quand.\n\n**Son substitut** : l'avis favorable, qui autorise sans borner et se périme sans que personne le constate. Un avis favorable de mars 2026 sur un agent dont le périmètre d'action a doublé depuis ne protège plus rien, et personne n'a de raison de le rouvrir.\n\n**Sa mesure** : le taux de reprise (schéma 07). Une instance qui n'a jamais rouvert une autorisation n'a pas de procédure de reprise."
      },
      "trace-refus": {
        title: "Pièce 4 — la trace du refus",
        body: "La pièce la plus coûteuse à produire, et la seule qui ne se simule pas.\n\n**Ce qu'elle rend indéniable** : que l'instance pouvait refuser.\n\n**Son substitut** : le refus informel en amont, obtenu par un appel téléphonique avant la séance. Il évite le passage et ne laisse rien. Il est aussi plus confortable pour tout le monde, ce qui explique sa fréquence.\n\n**Le test** : une instance qui n'a rien arrêté en dix-huit mois de fonctionnement n'a pas démontré qu'elle le pouvait.\n\n**Son coût** : un conflit. C'est le prix de l'existence de l'instance, et il n'y a pas de substitut."
      },
      "trois-sur-quatre": {
        title: "Les figures à trois pièces sur quatre",
        body: "Les quatre pièces sont indépendantes, et c'est ce qui rend la grille utile. Trois sur quatre produisent des figures reconnaissables.\n\n**Sans refus** : un bureau d'enregistrement. Il documente convenablement un flux qu'il ne régule pas.\n\n**Sans procès-verbal nominatif** : une instance qui décide et que personne ne pourra défendre. Le jour où la décision est contestée, elle n'a pas de titulaire.\n\n**Sans ordre du jour contraint** : un comité d'exception. Il arbitre bien ce qui lui arrive, et ignore ce qui ne lui arrive pas. C'est la configuration la plus fréquente, et la plus trompeuse, parce qu'elle produit des décisions de qualité sur une base non représentative.\n\n**Sans décision datée** : une instance qui statue sur des principes et laisse l'exploitation régler les modalités.\n\nLa grille n'est pas un barème de maturité : elle sert à nommer ce qui manque et à en estimer le coût."
      }
    }
  },
  "schema-03": {
    title: "Le précédent audité",
    regions: {
      "politique-conseil": {
        title: "La politique approuvée par le conseil",
        body: "SR 11-7 exige une politique écrite de gestion du risque de modèle approuvée par le conseil d'administration, couvrant le périmètre, les critères de hiérarchisation par niveau de risque, les rôles et les chemins d'escalade [1].\n\nLa différence avec une charte d'IA n'est pas dans le contenu, qui se ressemble souvent. Elle est dans le fait qu'un tiers extérieur (le superviseur) lit ce document et le confronte aux traces.\n\nUne charte que personne d'extérieur ne lira jamais ne subit aucune épreuve de réalité."
      },
      "inventaire": {
        title: "L'inventaire hiérarchisé par risque",
        body: "SR 11-7 demande un inventaire complet des modèles, hiérarchisé par niveau de risque, avec gestion des changements [1].\n\nLe point qui compte : l'inventaire n'est pas un tableau de suivi, il **détermine** quel modèle passe par quel niveau de contrôle. C'est exactement la pièce 1 de la grille — la règle qui lie l'inventaire à la saisine.\n\nCôté IA, beaucoup d'organisations tiennent un registre des cas d'usage. Peu l'ont relié à une règle de saisine obligatoire. Le registre existe donc comme document, pas comme mécanisme."
      },
      "validation-independante": {
        title: "La validation organisationnellement séparée",
        body: "Le validateur ne relève ni de l'équipe qui développe le modèle ni de celle qui l'utilise. La séparation est structurelle et non déclarative [1].\n\nC'est la transposition la plus discutée côté IA, et la plus souvent manquée : dans la majorité des organisations, l'évaluation d'un système d'IA est conduite par l'équipe qui l'a construit, ou par une équipe qui dépend du même responsable.\n\nLe dossier `cdo-caio-rattachement` traite le cas général de cette séparation sous l'angle du rattachement : nul ne contrôle les finalités et les moyens qu'il détermine."
      },
      "effective-challenge": {
        title: "Effective challenge — le statut du contestataire",
        body: "La contribution conceptuelle la plus utile du texte, et celle qui ne s'importe jamais.\n\nLa contestation d'un modèle n'est **effective** que si celui qui la porte dispose de la compétence, de la connaissance **et du statut** nécessaires pour être entendu [1]. Un validateur compétent sans statut ne conteste rien : son avis entre dans un dossier et n'en sort pas.\n\nLa résonance avec le règlement européen est frappante. L'article 26 § 2 exige que les personnes chargées de la surveillance humaine disposent de la compétence, de la formation et de l'**autorité** nécessaires [5]. Quinze ans d'écart, le même mot, et la même absence de mécanisme pour l'accorder."
      },
      "audit-interne": {
        title: "L'audit interne du dispositif",
        body: "SR 11-7 demande un audit interne qui porte sur le **dispositif** de gestion du risque de modèle, et non sur les modèles eux-mêmes [1].\n\nC'est l'asymétrie qui résume la section 3. En banque, l'instance de décision est un objet audité, sur ses traces. En gouvernance de l'IA, elle est décrite dans un document d'intention.\n\nFormulation opérationnelle : un superviseur bancaire peut demander à voir, pour un modèle donné, qui a approuvé quoi, sur la base de quelle validation, à quelle date, et ce qui a été refusé. La question équivalente posée à une direction IA obtient le plus souvent une charte en réponse."
      }
    }
  },
  "schema-04": {
    title: "La seule instance réellement écrite",
    regions: {
      "presidence": {
        title: "Le niveau de la présidence",
        body: "La variable qu'on écrit en dernier et qui décide de tout.\n\nDans les plans de conformité publiés en septembre 2024, le conseil de gouvernance de l'IA est présidé par le **secrétaire adjoint** — le numéro deux de l'organisation — au ministère de la Sécurité intérieure [3] comme au ministère du Commerce [4]. Le montage se réplique d'une agence à l'autre, avec des variantes de titre (secrétaire adjoint pour la gestion et les ressources au Département d'État, procureur général adjoint à la Justice).\n\nCe n'est pas une marque de solennité. C'est le seul niveau auquel un arbitrage contre une direction métier puissante peut tenir.\n\nTransposition : une instance IA présidée par un directeur de pôle arbitre les cas d'usage des autres pôles, et pas les siens."
      },
      "vice-presidence": {
        title: "Les sièges",
        body: "Le directeur IA est vice-président, et non président. La nuance est le cœur du montage : celui qui porte le sujet instruit les dossiers, celui qui arbitre a un rang supérieur et un périmètre plus large.\n\nSelon l'agence, siègent aussi le directeur des systèmes d'information (en co-vice-présidence au Trésor), le directeur des données, des secrétaires adjoints de métier, le directeur de cabinet.\n\nUne agence a retenu une **instance préexistante** plutôt que d'en créer une (le conseil des technologies émergentes du procureur général adjoint). C'est une option souvent meilleure en entreprise : un comité d'investissement ou un comité des risques qui fonctionne déjà vaut mieux qu'une instance neuve dont la légitimité reste à établir."
      },
      "cadence": {
        title: "La cadence semestrielle",
        body: "Deux réunions par an, ou plus fréquemment si nécessaire [3]. Le ministère des Transports annonce « au moins deux fois par an ».\n\nC'est faible, et c'est cohérent. Deux séances annuelles ne permettent pas d'examiner un portefeuille de cas d'usage. Elles permettent de statuer sur des dérogations, des seuils et des remontées.\n\nLe dispositif suppose donc une **délégation massive** en dessous de l'instance, ce qui est exactement le sujet du schéma 06. Une cadence faible assumée vaut mieux qu'une cadence mensuelle qui se dégrade en enregistrement.\n\nErreur fréquente en entreprise : fixer une cadence mensuelle pour montrer l'engagement, puis saturer en six mois."
      },
      "registre": {
        title: "La saisine par le registre",
        body: "M-25-21 maintient l'obligation de tenir un inventaire des cas d'usage, public pour une large part, et institue une catégorie d'IA « à fort impact » à laquelle s'appliquent des pratiques minimales : essais préalables au déploiement, évaluation d'incidence, surveillance continue, supervision humaine assortie de formation, voies de recours pour les personnes affectées [2].\n\nC'est la pièce 1 de la grille, écrite dans un texte opposable : le registre détermine la catégorie, et la catégorie détermine les obligations.\n\nEn entreprise, c'est la ligne la plus facile à copier et la plus souvent omise, parce qu'elle oblige à définir un critère plutôt qu'à énoncer un principe."
      },
      "derogation": {
        title: "La dérogation documentée",
        body: "Le mécanisme qui fait plus de travail que la liste des principes.\n\nDans ce montage, un responsable qui veut déployer sans appliquer une pratique minimale doit produire une **dérogation écrite**, documentée et traçable [2].\n\nLa charge de la preuve est inversée : le porteur doit justifier l'exception avant de déployer. Il n'a pas à convaincre l'instance de refuser, il a à produire un document qui restera.\n\nCette inversion est reproductible dans une entreprise et coûte une ligne dans un mandat. Elle est aussi la plus efficace des six lignes de la section 8, parce qu'elle fonctionne même quand l'instance ne se réunit pas : le document existe, et il est signé."
      }
    }
  },
  "schema-05": {
    title: "L'échéance qui a disparu",
    regions: {
      "art4": {
        title: "Article 4 — la maîtrise de l'IA",
        body: "Applicable depuis le **2 février 2025**, sans période transitoire.\n\nL'article crée une obligation de niveau de compétence pour les personnes qui utilisent des systèmes d'IA au nom de l'organisation, sans désigner de titulaire chargé de l'atteindre ni de mécanisme de constat.\n\nC'est le modèle de ce que ce dossier appelle une obligation sans instance : le texte exige un résultat, aucune autorité interne n'est nommément chargée de le produire, et à défaut de décision la charge échoit au dernier maillon disponible."
      },
      "art50": {
        title: "Article 50 et les nouvelles interdictions",
        body: "Les obligations de transparence de l'article 50 s'appliquent depuis le **2 août 2026** et n'ont pas été reportées par le règlement omnibus [6].\n\nDeux nouvelles interdictions ajoutées à l'article 5 entrent en vigueur le **2 décembre 2026**.\n\nLecture pour une direction : le calendrier n'a pas glissé en bloc. Ce qui a glissé est précisément la partie qui aurait obligé à instrumenter une instance (les systèmes à haut risque de l'annexe III et les obligations de déployeur qui vont avec). Ce qui reste en vigueur relève de l'étiquetage et de l'information, qui se traitent sans arbitrage."
      },
      "report-annexe3": {
        title: "Le report de seize mois",
        body: "Le règlement omnibus numérique, règlement (UE) 2026/1744, approuvé en dernière lecture par le Conseil le 29 juin 2026, déplace les obligations applicables aux systèmes à haut risque autonomes de l'annexe III du 2 août 2026 au **2 décembre 2027** [6].\n\nL'article 26 § 2 (autorité de la surveillance humaine) et l'article 26 § 6 (conservation des journaux, six mois au moins) sont reportés avec le reste.\n\n**L'effet qui intéresse une direction data.** Beaucoup d'organisations avaient adossé la création de leur instance à l'échéance d'août 2026 : la date servait d'argument budgétaire et de point de rendez-vous. Seize mois de délai ne rendent pas l'instance moins nécessaire, mais ils suppriment la seule contrainte externe qui obligeait à la créer avant d'en avoir envie.\n\nRéserve : les dates d'approbation, de signature et d'entrée en vigueur circulent avec de légers écarts selon les commentateurs. Seule la date d'application du 2 décembre 2027 est recoupée de façon stable."
      },
      "annexe1": {
        title: "Annexe I — le 2 août 2028",
        body: "Les systèmes à haut risque **intégrés** dans un produit déjà couvert par une réglementation sectorielle (dispositifs médicaux, machines, véhicules) voient leurs obligations reportées au 2 août 2028 [6].\n\nPour une direction industrielle, cela repousse l'échéance au-delà de l'horizon de la plupart des plans en cours. Le raisonnement de la section 5 s'applique avec encore plus de force : si l'instance attend l'échéance, elle n'existera pas avant 2028, et l'état accumulé entre-temps sera considérable."
      }
    }
  },
  "schema-06": {
    title: "Le seuil de délégation",
    regions: {
      "zone-examen": {
        title: "La zone d'examen réel",
        body: "Tant que le flux de saisines reste sous la capacité de l'instance, le temps par dossier permet un examen effectif et le refus reste argumentable.\n\nC'est la zone où les quatre pièces de la grille se produisent sans effort particulier : l'ordre du jour tient, le procès-verbal a du contenu, la décision porte des conditions, et le refus est défendable parce qu'on a eu le temps de l'instruire.\n\nLa plupart des instances commencent ici, avec quinze à trente dossiers par an, et personne ne mesure le moment où elles en sortent."
      },
      "seuil": {
        title: "Le seuil écrit",
        body: "La décision structurante d'une instance n'est pas la liste des cas qu'elle examine : c'est la frontière en dessous de laquelle elle renonce **explicitement** à voir.\n\nUn seuil écrit transforme une saturation subie en arbitrage assumé. Quatre composantes :\n\n1. **Le critère** — exposition, montant, nature des données, niveau d'autonomie accordé à un agent.\n2. **Le délégataire nommé** — une personne, pas une direction.\n3. **La remontée statistique** — l'instance reçoit le volume et la distribution de ce qu'elle ne voit pas.\n4. **La liste des actes non délégables.**\n\nSans seuil écrit, la délégation se fait quand même, par abandon, et sans remontée."
      },
      "zone-tamponnage": {
        title: "La zone d'enregistrement",
        body: "Quand le flux dépasse la capacité d'examen, une instance ne s'arrête pas. Elle continue de siéger, et son comportement se dégrade selon une trajectoire prévisible :\n\n1. Le temps par dossier se réduit.\n2. L'examen se déplace sur le document préparatoire plutôt que sur l'objet.\n3. L'avis par défaut devient favorable, parce que le refus demande une justification que le temps disponible ne permet plus de construire.\n\nUne instance saturée ne produit pas moins de décisions : elle produit les mêmes décisions sans les instruire. Grant Thornton observe cette saturation des organes de revue centralisés à mesure que les cas d'usage se multiplient [10].\n\nLe signal avancé est le délai de passage, pas le taux de refus : le délai dérive avant que la qualité d'examen se dégrade."
      },
      "refus-non-delegable": {
        title: "Les trois actes non délégables",
        body: "**1 — Le refus.** La raison n'est pas symbolique. Si un délégataire peut refuser, chaque refus devient négociable à son niveau, et la négociation se gagne par la pression métier. Une instance qui conserve le monopole du refus conserve la seule chose qui rend son autorisation significative.\n\n**2 — Le relèvement d'un palier d'autonomie** accordé à un agent. Monter un cran est une décision de risque, pas un réglage d'exploitation.\n\n**3 — La reprise après incident** et la levée des conditions. Celui qui a subi l'arrêt ne peut pas prononcer la reprise.\n\nIMDA pousse le raisonnement du côté de la mesure : il ne suffit pas de définir des points de contrôle où une approbation humaine est requise, il faut **auditer l'efficacité** de ces approbations, et suivre les taux de contournement et les délais de réponse [7]. Un taux d'approbation de 100 % mesure l'absence de contrôle plutôt que sa réussite.\n\nLa littérature sur le biais d'automatisation décrit le même mécanisme un cran plus bas : la discrétion humaine posée comme garantie, sans dispositif qui la soutienne, ne protège pas [14]."
      }
    }
  },
  "schema-07": {
    title: "Mesurer une instance",
    regions: {
      "taux-refus": {
        title: "Le taux de refus",
        body: "Part des saisines ayant donné lieu à un refus ou à une autorisation sous conditions bloquantes, sur douze mois glissants.\n\nC'est l'indicateur non falsifiable de la grille, et le seul qui coûte quelque chose à produire. Il mesure la pièce 4.\n\n**Lecture dans les deux sens.** Un taux nul signale une instance qui enregistre. Un taux très élevé signale souvent une règle de saisine mal calibrée, qui fait remonter des dossiers qui n'avaient rien à faire là.\n\nLa valeur de l'indicateur tient donc moins à son niveau qu'à son existence et à sa stabilité. Un taux qui s'effondre d'une année sur l'autre, sans changement de règle de saisine, décrit une instance en train de perdre son autorité."
      },
      "delai-passage": {
        title: "Le délai de passage",
        body: "Durée médiane entre la saisine et la décision.\n\nC'est le prix que l'instance fait payer à l'organisation, et la variable que les directions métier surveillent réellement. Une instance qui ignore son délai de passage se fera contourner sans le savoir.\n\n**Son usage principal est d'alerte.** Un délai médian qui dérive est le signe avancé de la saturation décrite au schéma 06, et il se lit avant que la qualité d'examen se dégrade. C'est l'indicateur qui déclenche la révision du seuil de délégation.\n\nÀ suivre en médiane et non en moyenne : quelques dossiers très longs masquent la tendance centrale."
      },
      "taux-saisine": {
        title: "Le taux de saisine",
        body: "Part des cas d'usage du registre qui ont effectivement été soumis, rapportée à ceux qui devaient l'être au titre de la règle de saisine.\n\nC'est la mesure de la pièce 1, et le plus gênant des quatre à publier : il révèle le contournement.\n\n**Son prérequis est structurant.** Il suppose un registre tenu par quelqu'un qui n'est pas le porteur des cas d'usage. Un registre alimenté sur déclaration volontaire ne permet pas de calculer ce taux, puisque le dénominateur est fourni par ceux dont on mesure le contournement.\n\nC'est pour cette raison que la ligne 1 du mandat de la section 8 nomme à la fois la règle et le tenant du registre."
      },
      "taux-reprise": {
        title: "Le taux de reprise",
        body: "Part des autorisations rouvertes après incident ou après changement de périmètre, et délai de réouverture.\n\nC'est la mesure de la pièce 3. Une instance qui n'a jamais rouvert une autorisation n'a pas de procédure de reprise : elle a des avis favorables permanents.\n\n**Le cas typique.** Un agent autorisé en mars sur un périmètre restreint voit ce périmètre doubler en septembre, sans nouvelle saisine, parce que l'extension est présentée comme une évolution d'exploitation. Le taux de reprise rend ce cas visible, à condition que la décision initiale ait porté des conditions de maintien explicites.\n\n**Précaution commune aux quatre indicateurs.** Ils se dégradent dès qu'ils deviennent des objectifs chiffrés opposables : un taux de refus cible produit des refus de façade, un délai cible produit des examens abrégés. Ils se publient comme une description d'activité, et non comme un contrat de performance."
      }
    }
  }
}
