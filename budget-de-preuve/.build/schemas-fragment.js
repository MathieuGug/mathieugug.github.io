{
  "schema-01": {
    title: "L'échelle du problème",
    regions: {
      "le-bruit": {
        title: "Le bruit · l'écart-type des ventes",
        body: "C'est la grandeur qui décide de tout, et elle n'est presque jamais regardée. Les ventes individuelles ne sont pas régulières : la plupart des gens n'achètent rien une semaine donnée, quelques-uns achètent beaucoup. Le résultat est une distribution dont l'écart-type dépasse largement la moyenne.\n\nLewis et Rao donnent un **coefficient de variation de 10** comme valeur courante, c'est-à-dire un écart-type dix fois supérieur à la moyenne [1]. Sur ce schéma, la barre représentant le bruit occupe toute la largeur disponible ; celle représentant le signal recherché tient dans deux pixels.\n\nCette valeur n'est pas universelle. Les catégories à achat fréquent et panier resserré descendent plus bas, et comme le coefficient intervient au carré dans le calcul de taille d'échantillon, un coefficient de 5 divise le coût de l'expérience par quatre. C'est la première chose à réestimer sur ses propres données."
      },
      "le-signal": {
        title: "Le signal · l'effet que l'on cherche",
        body: "Deux et demi pour cent des ventes. C'est l'ordre de grandeur de l'effet qu'un annonceur courant doit savoir distinguer de zéro pour savoir si sa campagne couvre son coût.\n\nCe nombre n'est pas un choix statistique. Il se déduit de deux grandeurs de gestion, l'intensité publicitaire et la marge, selon la formule détaillée au schéma 03. Une entreprise qui dépense 1 % de son chiffre d'affaires en média avec 40 % de marge doit détecter 2,5 %.\n\nLa disproportion entre les deux barres est toute la difficulté du métier. On cherche une variation qui vaut le quatre-centième de la dispersion de la variable dans laquelle on la cherche. Aucun raffinement de méthode ne comble cet écart : seule la taille d'échantillon le fait, et elle se paie en média."
      },
      "la-consequence": {
        title: "La conséquence arithmétique",
        body: "La formule de taille d'échantillon pour comparer deux moyennes s'écrit `n ≈ 31,4 × CV² / r²` pour une puissance de 80 % et un seuil bilatéral de 5 %, en comptant les deux groupes.\n\nAvec un coefficient de variation de 10 et un effet visé de 2,5 %, elle donne environ **cinq millions de personnes-semaines**. Deux millions de personnes observées pendant deux semaines et demie, ou cinq cent mille pendant dix semaines.\n\nEt ce chiffre ne permet que de distinguer l'effet de zéro. Pour savoir de combien il dépasse zéro, autrement dit pour piloter une réallocation de budget, il faut résoudre une bande étroite autour du seuil, ce qui multiplie l'échantillon par vingt-cinq. C'est ce second calcul qui explique les intervalles de cent points observés en pratique."
      },
      "les-25-experiences": {
        title: "Ce qu'on observe en pratique",
        body: "Vingt-cinq grandes expériences publicitaires, menées avec des distributeurs et des courtiers américains, la plupart touchant plusieurs millions de clients, pour 2,8 millions de dollars de média engagé. L'intervalle de confiance **médian** sur le retour sur investissement dépasse cent points de pourcentage [1].\n\nLa médiane est le mot important. Il ne s'agit pas d'un cas extrême ni d'une expérience ratée : c'est le milieu de la distribution des expériences les mieux conduites de la littérature.\n\nCe que cela signifie concrètement : l'expérience typique ne permet pas de distinguer un investissement qui détruit de la valeur d'un investissement très rentable. Elle ne conclut pas à l'échec. Elle ne conclut pas."
      }
    }
  },
  "schema-02": {
    title: "La loi du carré",
    regions: {
      "palier-accessible": {
        title: "Les paliers accessibles · 10 % et 5 %",
        body: "Un effet de 10 % à détecter demande environ 314 000 personnes-semaines. Un effet de 5 % en demande quatre fois plus. Ces deux paliers restent dans le domaine du réalisable pour un annonceur de taille intermédiaire, sur une campagne de six à huit semaines.\n\nÀ quelles questions correspondent-ils ? À celles dont l'effet attendu est **grand**, c'est-à-dire aux décisions les plus brutales : couper entièrement un canal, arbitrer entre deux blocs de média de tailles comparables.\n\nC'est une conséquence méthodologique qu'on oublie facilement : les questions bon marché à trancher sont les questions grossières. Plus une décision est fine, plus elle est chère à documenter. Le classement complet est au schéma 04."
      },
      "le-mur": {
        title: "Le mur · 2,5 % et en dessous",
        body: "À 2,5 %, l'expérience demande environ cinq millions de personnes-semaines. À 1,25 %, vingt millions. Le passage de l'un à l'autre coûte quatre fois plus, pour une exigence de précision seulement deux fois plus forte.\n\nOr 2,5 % correspond au seuil de rentabilité d'un annonceur courant, et une réallocation de budget demande d'aller nettement plus bas. **Le mur ne se dresse donc pas au-delà des besoins : il se dresse exactement à l'endroit où les questions deviennent intéressantes.**\n\nC'est le mécanisme qui produit l'intervalle médian de cent points mesuré par Lewis et Rao [1]. Ce n'est pas un défaut d'exécution mais la structure du problème, et la seule réponse honnête consiste à l'écrire avant de lancer les tests plutôt qu'à le découvrir en les rendant."
      },
      "la-mecanique": {
        title: "La mécanique du carré",
        body: "`n ≈ 31,4 × CV² / r²`\n\nLe seul terme qui compte pour une direction est le **carré au dénominateur**. Il transforme une exigence linéaire de précision en une dépense quadratique.\n\nDeux formulations utiles en réunion. Diviser par deux l'effet qu'on veut détecter quadruple la taille de l'expérience. Et : pour deux fois moins d'incertitude, quatre fois plus de budget de test.\n\nLe coefficient de variation intervient lui aussi au carré, ce qui en fait le second levier. Il se réduit en restreignant l'expérience à une population moins volatile, ce que Johnson, Lewis et Reiley ont démontré en écartant délibérément la moitié des ventes insensibles à la campagne, pour un gain de précision de 31 % [6]."
      },
      "budget-media-echantillon": {
        title: "Ce que coûte un carreau",
        body: "Voici la particularité de la mesure publicitaire, et la raison pour laquelle sa gouvernance ne ressemble à aucune autre.\n\nDans la plupart des domaines, agrandir un échantillon coûte du temps d'observation ou du temps de calcul. Ici, l'échantillon n'est pas une population qu'on observe : c'est une population qu'on **traite**, ou qu'on prive délibérément de traitement. Le groupe témoin d'un test d'extinction géographique est une région où la publicité a été coupée.\n\nLe coût d'un carreau se lit donc en chiffre d'affaires non réalisé, plus le média immobilisé dans un dispositif qui n'optimise pas. Conséquence budgétaire directe : le budget de mesure relève du plan média et non du budget des études, où il serait sous-estimé d'un ordre de grandeur."
      }
    }
  },
  "schema-03": {
    title: "Le seuil d'indétectabilité",
    regions: {
      "profil-facile": {
        title: "Distributeur alimentaire · le cas favorable",
        body: "Intensité publicitaire de 1,5 %, marge de 25 %. Le seuil de rentabilité en effet relatif s'établit à 6 %, et l'expérience qui permet de le distinguer de zéro demande environ 900 000 personnes-semaines.\n\nC'est un dispositif réalisable dans l'année, avec un test d'extinction géographique de six à huit semaines sur un nombre modeste de régions.\n\nLa raison de ce confort est mécanique et un peu ironique : la marge est mince, donc il faut beaucoup de ventes supplémentaires pour couvrir la dépense, donc l'effet à détecter est grand, donc l'expérience est abordable. Le profil qui mesure le plus facilement est celui dont chaque euro de média doit travailler le plus dur."
      },
      "profil-median": {
        title: "Enseigne spécialisée · le cas médian",
        body: "Intensité de 1 %, marge de 40 %, seuil de rentabilité à 2,5 %. Il faut environ cinq millions de personnes-semaines pour distinguer cet effet de zéro : la mesure devient l'affaire d'un exercice entier plutôt que d'une campagne.\n\nC'est le profil le plus courant du marché, et c'est celui où la tension se voit le mieux. L'entreprise a les moyens de financer un ou deux tests par an. Elle a une dizaine de questions.\n\nEt le calcul ci-dessus ne concerne que la question binaire « la campagne couvre-t-elle son coût ? ». Pour savoir si le retour est de 20 % ou de 120 %, il faut résoudre un cinquième de ce seuil, donc multiplier l'échantillon par vingt-cinq : cent vingt-cinq millions de personnes-semaines, hors de portée. La rubrique 3 de la note de renoncement existe pour cette ligne-là."
      },
      "profil-impossible": {
        title: "Marque premium · hors de portée",
        body: "Intensité de 0,8 %, marge de 60 %, seuil de rentabilité à 1,3 %. Environ 18,6 millions de personnes-semaines seraient nécessaires. Pour la plupart des marques de ce profil, la base de clients identifiables ne le permet tout simplement pas, quelle que soit la durée d'observation.\n\nCe résultat est le plus utile du schéma parce qu'il est **définitif**. Il ne dit pas que l'entreprise manque de maturité analytique ou d'outillage : il dit que la question ne se tranchera pas par l'expérience, cette année ni les suivantes, tant que l'intensité publicitaire et la marge restent ce qu'elles sont.\n\nLa conséquence de gouvernance est directe. Cette entreprise doit décider où placer son budget de preuve sur des questions plus grossières, et assumer que son allocation fine reposera sur un modèle et sur des conventions, écrites comme telles."
      },
      "regle-marge": {
        title: "La règle qui surprend en réunion",
        body: "**Plus une entreprise est rentable, plus il lui coûte cher de savoir si sa publicité l'est.**\n\nLe raisonnement tient en trois pas. Une marge élevée signifie que peu de ventes supplémentaires suffisent à couvrir la dépense publicitaire. Donc le seuil de rentabilité en effet relatif est bas. Donc l'effet à distinguer de zéro est petit. Et comme le coût de l'expérience varie comme l'inverse du carré de cet effet, il explose.\n\nLe même mécanisme joue sur l'intensité publicitaire : celui qui dépense peu en média relativement à son chiffre d'affaires a un seuil bas, donc une mesure difficile.\n\nLes deux annonceurs qui mesurent le plus facilement sont donc ceux qui dépensent beaucoup avec des marges faibles, c'est-à-dire ceux pour qui la question a le moins d'enjeu marginal. C'est une inversion qu'aucune feuille de route de mesure ne mentionne, et elle explique pourquoi les entreprises les plus rentables sont souvent celles dont le plan de mesure déçoit le plus."
      }
    }
  },
  "schema-04": {
    title: "Six questions, six coûts de preuve",
    regions: {
      "socle-testable": {
        title: "Le socle testable",
        body: "Deux questions, et ce sont les plus brutales du portefeuille.\n\n**Un canal doit-il continuer d'exister ?** L'effet à détecter est l'effet total du canal, la plus grande quantité disponible. Un test d'extinction géographique de six à huit semaines suffit pour beaucoup d'annonceurs. C'est la question qu'eBay a posée sur ses annonces de marque, avec la réponse nette que l'on sait [3].\n\n**Faut-il déplacer du budget d'un canal vers un autre ?** L'écart entre deux canaux est une fraction de l'effet de chacun, donc le coût monte d'un facteur quatre à dix. La conception à plusieurs cellules contre un groupe témoin commun, que Meridian GeoX met en avant, est ce qui rend cette question abordable [10].\n\nCe socle est étroit. Trois à cinq questions par an est un rythme réaliste pour un annonceur de taille intermédiaire, et c'est déjà un dispositif sérieux."
      },
      "zone-modele": {
        title: "La zone du modèle",
        body: "La courbe de rendement décroissant demande plusieurs points d'intensité, chacun avec sa propre exigence de puissance. Le coût se multiplie donc par le nombre de points de la courbe, ce qui la met hors de portée d'une campagne de test annuelle pour la quasi-totalité des annonceurs.\n\nC'est là que le modèle de mix prend légitimement le relais : il interpole entre des points que l'expérience ne peut pas produire, en s'appuyant sur la variation historique des dépenses.\n\nLa condition est stricte, et le dossier y revient : sa précision est **empruntée** aux tests qui le calibrent. La documentation de Meridian désigne explicitement les expériences d'incrémentalité comme la meilleure base de formulation des lois a priori [8]. Un modèle sans tests derrière lui répond quand même, ce qui est exactement le danger."
      },
      "zone-indecidable": {
        title: "L'indécidable assumé",
        body: "Trois questions que l'expérience de vente ne tranchera pas, et il vaut mieux l'écrire que le découvrir.\n\n**Le choix entre deux créations** : l'écart entre elles est typiquement un ordre de grandeur en dessous de l'effet du canal, donc cent fois le coût. Réservé aux plateformes qui traitent des volumes hors de portée d'un annonceur.\n\n**La fréquence et la séquence** : encore un cran plus bas, avec en prime un problème d'identification, la fréquence n'étant pas assignable directement puisqu'elle résulte du comportement de l'utilisateur.\n\nCes questions ne disparaissent pas du métier pour autant. Elles se tranchent par convention, par jugement professionnel, ou par des mesures intermédiaires de type attention ou mémorisation. La note de renoncement dit simplement qu'elles ne sont pas tranchées par une preuve causale, et qui a signé la convention retenue."
      },
      "question-piege": {
        title: "La question piège",
        body: "« Que rapporte cette audience ? » posée à un niveau de granularité fin est le cas le plus dangereux du tableau, parce qu'elle **reçoit toujours une réponse**.\n\nL'échantillon est petit par construction : une audience fine, c'est peu de gens. Aucune expérience ne peut y produire un intervalle utile. Et pourtant le tableau de bord de la plateforme affiche un chiffre par segment, avec deux décimales et sans intervalle.\n\nCe chiffre n'est pas mensonger au sens strict, il est simplement estimé sur des effectifs où l'incertitude domine tout. Il alimente ensuite des réallocations de budget entre segments qui relèvent du bruit.\n\nLe remède est le même que pour le reste du dossier : exiger l'intervalle avec le point, et considérer qu'un chiffre servi sans intervalle n'est pas un résultat de mesure."
      }
    }
  },
  "schema-05": {
    title: "Anatomie d'un non-résultat",
    regions: {
      "lecture-inefficace": {
        title: "Lecture 1 · L'absence de preuve",
        body: "« Non significatif, donc ça ne marche pas. »\n\nL'intervalle va de −15 % à +45 %. Il contient zéro, donc le test n'est pas significatif au seuil retenu. Mais il contient aussi +45 %, qui serait un excellent investissement.\n\nLa confusion entre **absence de preuve** et **preuve d'absence** est la plus fréquente des quatre, et la plus coûteuse quand la conclusion sert à couper une ligne budgétaire : on arrête un canal dont on n'a jamais montré qu'il ne fonctionnait pas.\n\nLa parade est dans la rubrique 4 de la note de renoncement : écrire, avant de lancer le test, ce qui sera décidé dans le cas où l'intervalle ne tranche pas. Cette ligne est presque toujours absente des protocoles, et c'est celle qui empêche la lecture fausse."
      },
      "lecture-point": {
        title: "Lecture 2 · Le point sans l'intervalle",
        body: "« Le point est à +15 %, donc c'est rentable. »\n\nL'estimation ponctuelle survit à la réunion, l'intervalle n'y survit jamais. Il disparaît d'abord de la note de synthèse, puis du support de comité, et le chiffre finit sa vie dans un tableau de suivi trimestriel où il a exactement la même apparence qu'une donnée comptable.\n\nCe que l'on perd au passage est mesurable. Sur 288 marques de grande consommation, Shapiro, Hitsch et Tuchman trouvent une part importante d'estimations non significatives ou négatives, et un retour marginal négatif pour plus de 80 % des marques [2].\n\nAutrement dit, dans cet univers, une estimation ponctuelle positive retenue sans son intervalle a de bonnes chances d'être une illusion. La règle de restitution qui en découle : le point ne circule jamais seul."
      },
      "lecture-arret": {
        title: "Lecture 3 · L'arrêt opportun",
        body: "« On coupe, le seuil vient d'être franchi. »\n\nUne expérience regardée chaque semaine et arrêtée à la première traversée du seuil de significativité n'a plus le taux d'erreur qu'elle annonce. À force de regarder, on finit par voir passer un seuil, et l'on arrête au moment le plus favorable au hasard plutôt qu'au moment prévu.\n\nLe remède est connu et coûte zéro euro : fixer la durée et la règle d'arrêt avant de commencer, et s'y tenir. Les méthodes d'analyse séquentielle existent et sont légitimes, mais elles ajustent le seuil en conséquence ; ce n'est pas ce que fait un pilotage hebdomadaire improvisé.\n\nCe point est le seul des quatre qui se règle entièrement par une décision de procédure, ce qui en fait le meilleur rapport entre effort et gain de tout le dossier."
      },
      "lecture-juste": {
        title: "La lecture juste",
        body: "« Ce test excluait un retour inférieur à −15 %. Il n'a jamais pu trancher entre 0 et +45 %. »\n\nDeux propositions, et elles sont toutes les deux informatives. Le test a bien apporté quelque chose : il a écarté les scénarios catastrophiques. Il n'a pas apporté ce qu'on lui demandait.\n\nLa conclusion opérationnelle suit : **sous cette conception, il n'aurait pas dû être lancé**. L'effet minimum détectable de l'expérience était supérieur au seuil de rentabilité, ce qui était calculable avant l'engagement du budget. La question appartenait à la rubrique 3, celle de l'indécidable assumé, et non à la rubrique 1.\n\nRendre un test dans cette forme et le documenter ainsi vaut mieux que de fabriquer une conclusion. C'est aussi la seule manière de nourrir le calcul de l'année suivante."
      },
      "biais-remontee": {
        title: "Lecture 4 · Celle que la statistique ne corrige pas",
        body: "Les tests concluants remontent au comité. Les autres meurent dans le fichier de l'analyste.\n\nAu bout de deux ans, la direction dispose d'une collection de résultats positifs qui reflète moins la réalité de ses canaux que la sélection opérée par le circuit de remontée. Aucune correction statistique ne rattrape cela, parce que le tri n'a pas lieu dans l'analyse : il a lieu dans le couloir.\n\nUne seule règle d'organisation y remédie. **Le taux de tests concluants devient lui-même un indicateur de pilotage**, et un taux élevé se lit comme une alerte.\n\nUn dispositif honnête produit une majorité de tests qui ne tranchent pas, puisque c'est la propriété du terrain établie par Lewis et Rao [1]. S'il n'en produit pas, quelqu'un choisit ce qui remonte, et cette personne fait de la stratégie de mesure sans mandat."
      }
    }
  },
  "schema-06": {
    title: "Le dispositif de renoncement",
    regions: {
      "cadrage": {
        title: "T0 · Le cadrage annuel",
        body: "Trois grandeurs de gestion suffisent : l'intensité publicitaire, la marge sur ventes incrémentales, et le coefficient de variation des ventes estimé sur les données de l'entreprise.\n\nElles produisent deux nombres. Le **seuil de rentabilité** `r* = (d/μ)/m`, qui dit quel effet il faut savoir détecter. Et l'**effet minimum atteignable** compte tenu de la base de clients et du budget de test disponible.\n\nCes deux nombres tiennent sur une ligne et ne changent pas d'un exercice à l'autre, sauf mouvement structurel de marge ou d'intensité publicitaire. Les calculer une fois et les publier est le geste le moins cher du dispositif.\n\nSignataire : le niveau qui arbitre le plan média, puisque c'est la ressource qui sera consommée."
      },
      "conception": {
        title: "T−6 semaines · La conception",
        body: "Avant l'engagement du budget, chaque test candidat reçoit son **effet minimum détectable**, calculé par simulation sur l'historique. C'est exactement ce que fait la sélection de marchés de GeoLift : elle évalue les combinaisons de régions traitées et témoins et renvoie, pour chacune, le plus petit effet qu'elle saurait distinguer [7].\n\nLa comparaison au seuil `r*` donne alors un verdict binaire, et c'est le verrou du dispositif : **si l'effet minimum détectable dépasse `r*`, le test ne se lance pas.**\n\nAucune dérogation, y compris sous la pression légitime de « avoir un chiffre pour le comité ». Un test lancé dans ces conditions produira un intervalle qui ne tranche pas, et cet intervalle sera lu comme une conclusion. Le budget aura été dépensé pour fabriquer une erreur."
      },
      "execution": {
        title: "Pendant · L'exécution",
        body: "Le protocole est déposé avant le premier euro dépensé, et il contient quatre éléments : la durée, le seuil, la règle d'arrêt, et la décision prévue pour chacune des trois issues possibles.\n\nLa troisième issue est celle qui manque presque toujours : que fait-on si l'intervalle ne tranche pas ? Sans réponse écrite à l'avance, la réunion de restitution improvisera, et elle improvisera dans le sens de la première lecture fausse du schéma 05.\n\nUne fois le test lancé, rien ne se renégocie. Le pilotage hebdomadaire qui coupe au moment favorable détruit le taux d'erreur annoncé, et c'est un dommage invisible : le résultat garde l'apparence d'un résultat significatif.\n\nCette fenêtre est celle qui coûte le moins cher à mettre en place et celle qu'on saute le plus souvent."
      },
      "restitution": {
        title: "Après · La restitution",
        body: "Une règle de forme et un indicateur.\n\nLa règle de forme : **l'estimation ponctuelle ne circule jamais seule**, ni en note de synthèse, ni en support de comité, ni en tableau de suivi. Le point sans intervalle a l'apparence d'une donnée comptable et finit par en acquérir le statut.\n\nL'indicateur : le **taux de tests concluants** sur l'année, suivi comme une mesure de qualité du dispositif. Un taux élevé signale une sélection dans ce qui remonte au comité, non une équipe performante.\n\nEt la restitution alimente la fenêtre suivante. Chaque intervalle obtenu affine l'estimation du coefficient de variation, donc le calcul de l'année d'après, et chaque test devient une loi a priori documentée pour le modèle de mix [8]. Le dispositif se paie en partie lui-même à partir de la deuxième année."
      }
    }
  }
}
