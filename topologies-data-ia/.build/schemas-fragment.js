{
  "schema-01": {
    title: "Trois étiquettes, quatre cadrans",
    regions: {
      "cadrans": {
        title: "Les quatre décisions séparables",
        body: "Chacune se prend indépendamment des trois autres, et chacune peut être centrale ou locale. Quatre décisions binaires, donc **seize combinaisons** possibles.\n\nLes trois topologies vendues en occupent trois. Les treize autres n'ont pas de nom, ce qui ne les empêche pas d'exister : une entreprise peut centraliser sa gouvernance des données, hybrider ses talents et décentraliser son adoption [8]. Elle a alors trois réglages distincts, et aucun libellé ne les capture.\n\nLe cadran le plus souvent oublié est le quatrième. Une équipe centrale financée sur une ligne corporate et une équipe centrale refacturée portent le même nom sur l'organigramme et reçoivent des demandes de nature opposée : infinie dans le premier cas, solvable dans le second."
      },
      "coe": {
        title: "Préréglage 1 · Le centre d'excellence",
        body: "Les quatre cadrans en position centrale. La compétence rare est rassemblée dans une équipe unique qui porte à la fois la norme, l'outillage et la livraison.\n\nCe réglage paie pour une raison précise, et une seule : il **mutualise une compétence rare**. Quatre entités qui ont besoin d'un spécialiste trois semaines par an chacune ne peuvent pas en recruter un ; mises en commun, elles le financent à taux d'occupation correct.\n\nLe gain est entièrement imputable au caractère intermittent de la demande. Dès que la demande devient continue, la file d'attente unique ne mutualise plus rien : elle ordonne. Voir le schéma 05."
      },
      "federe": {
        title: "Préréglage 2 · Le fédéré cohérent",
        body: "Le seul mélange des trois : propriété et budget **locaux**, norme et plateforme **centrales**, cette dernière fournie en mode service.\n\nLe propriétaire métier décide, paie, et arbitre donc réellement. Le centre fournit un socle qui se consomme sans réunion et une norme opposable qui s'applique sans validation au cas par cas. Facteur d'intersection à un sur la livraison, profondeur de propriété faible.\n\nLa mention « mode service » n'est pas décorative : c'est elle qui distingue ce réglage du droit de veto déguisé. Une plateforme centrale en collaboration permanente porte le facteur d'intersection à deux sur chaque cas d'usage [5].\n\nC'est le plus rare des trois, parce qu'il demande au centre de renoncer au droit de regard qu'il considère comme sa raison d'être."
      },
      "produit": {
        title: "Préréglage 3 · Les équipes produit autonomes",
        body: "Les quatre cadrans en position locale. Chaque domaine métier loge sa compétence, avec une coordination réduite au minimum.\n\nLes coûts de plateforme se dupliquent, ce qui est visible et se chiffre. Mais la première victime est ailleurs : la **couche sémantique**, dont l'intérêt vient de ce que tout le monde s'y réfère [13]. Dupliquée en n exemplaires, elle devient n glossaires divergents.\n\nSeconde difficulté, moins commentée : une entité sous le seuil d'un équivalent temps plein de demande permanente se retrouve avec une demi-équipe, trop petite pour couvrir le spectre de compétences dont elle a besoin. Voir le schéma 05."
      }
    }
  },
  "schema-02": {
    title: "Ce que la recherche mesure, et ce qu'on peut régler",
    regions: {
      "dmo": {
        title: "DMO · La profondeur de la propriété",
        body: "Le rang hiérarchique, compté depuis le sommet, du responsable qui couvre 75 % du travail effectué sur un objet livrable [2].\n\nCette grandeur mesure la **distance entre l'objet et la personne qui peut en décider seule**. Plus elle est élevée, plus les décisions remontent, se prennent en retard, ou ne se prennent pas.\n\nC'est l'un des deux seuls réglages qu'une direction modifie par décision explicite, et le moins cher des deux : il suffit de remonter le propriétaire d'un niveau. Coût : une nomination.\n\nDepuis le règlement sur l'IA, cette grandeur a aussi une borne juridique. L'article 26 § 2 exige du titulaire de la surveillance humaine une **autorité** réelle [14] — ce qu'un propriétaire enfoui à cinq niveaux ne peut pas avoir."
      },
      "oif": {
        title: "OIF · Le facteur d'intersection organisationnelle",
        body: "Le nombre d'organisations distinctes qui contribuent chacune pour **plus de 10 %** des modifications d'un même objet [2].\n\nCette grandeur mesure combien d'entités ont voix au chapitre sur le même livrable. C'est la variable que les grilles de topologie ne contiennent pas, et c'est elle qui explique pourquoi deux entreprises affichant le même modèle obtiennent des résultats opposés.\n\nElle se règle par le **mode d'interaction** imposé à la plateforme, pas par la position de la plateforme sur l'organigramme. Une plateforme centrale en mode service maintient le facteur à un ; la même plateforme en collaboration permanente le porte à deux, sur chaque cas d'usage, en permanence [5].\n\nCoût du réglage : un renoncement, pas un budget. C'est ce qui le rend difficile."
      },
      "effectif": {
        title: "Les comptages d'effectif",
        body: "Nombre d'ingénieurs ayant modifié l'objet, nombre d'entre eux ayant quitté l'entreprise, fréquence d'édition. Trois des huit métriques, et trois de celles qui ressortent le plus nettement dans les données [1].\n\nElles sont corrélées à la défaillance, mais elles ne constituent pas un levier : une direction ne décide pas du nombre de personnes qui touchent un objet, elle décide de la structure qui le produit. Le comptage est la **conséquence** du réglage des deux métriques de forme.\n\nLe cas du nombre d'anciens ingénieurs mérite une note. Il croise le résultat de Mockus sur la volatilité organisationnelle : les départs récents vont avec une probabilité accrue de défauts signalés par les clients [6]. Un effectif qui tourne est à la fois un symptôme et une cause."
      },
      "distance-nulle": {
        title: "Le résultat nul qui tranche",
        body: "En 2009, la même équipe a examiné si la distribution géographique du développement de Windows Vista dégradait la qualité. Une fois le nombre de contributeurs par composant contrôlé, l'écart entre développement distribué et co-localisé devient **encore moins significatif** ; les caractéristiques des composants diffèrent très peu entre les deux cas [3].\n\nC'est un résultat négatif, et c'est pour cela qu'il est utile : il élimine une explication concurrente. Si la distance comptait, les métriques de forme hiérarchique pourraient n'être qu'une approximation de la géographie. Elles ne le sont pas.\n\nConséquence pour une direction data : **où les gens sont assis ne prédit presque rien ; de qui ils relèvent prédit beaucoup**. Toutes les grilles de topologie disponibles décrivent des sièges."
      },
      "propriete": {
        title: "La confirmation par la propriété",
        body: "En 2011, sur Vista et sur Windows 7, deux grandeurs de propriété ressortent : la **part de propriété du contributeur principal** et le **nombre de contributeurs de faible expertise**. L'une et l'autre sont reliées aux défauts détectés avant la mise en service comme à ceux signalés après [4].\n\nUne propriété concentrée va avec moins de défaillances. Une nuée de contributeurs occasionnels va avec davantage.\n\nC'est la lecture positive du facteur d'intersection : ce que la métrique compte comme « organisations ayant voix au chapitre », ce travail le retrouve comme « contributeurs sans expertise dominante ». Les deux décrivent la même pathologie organisationnelle sous deux angles."
      }
    }
  },
  "schema-03": {
    title: "Le tableau des quatre cadrans",
    regions: {
      "cadran-propriete": {
        title: "Cadran 1 · La propriété du cas d'usage",
        body: "La position se vérifie en une question, posée à l'intéressé : « si ce cas d'usage est arrêté dans six mois, qu'est-ce que ça change pour vous ? » Une réponse embarrassée indique un propriétaire **nominal**.\n\nEn position centrale, ce cadran achète une norme homogène et un seul interlocuteur. En position locale, il achète un arbitrage réel et une profondeur de propriété faible.\n\nMal réglé, il produit l'organisation dont tous les cas d'usage ont un propriétaire sur le papier et aucun dans les faits. La liste des propriétaires nominaux est le meilleur indicateur avancé dont dispose une direction data, et elle se tient dans un tableur.\n\nDepuis l'arrivée des agents, la prescription converge : chaque agent doit avoir un propriétaire nommé, avec une délimitation claire entre ce qu'il décide seul et ce qui passe en revue [9]."
      },
      "cadran-plateforme": {
        title: "Cadran 2 · La plateforme",
        body: "Environnement d'exécution, accès aux données, registre d'outils, dispositif d'observation. Position centrale ou locale.\n\nEn position centrale, ce cadran achète un socle unique et une couche sémantique partagée [13]. En position locale, il achète une autonomie totale et n socles à financer.\n\nMais ce cadran a un **second réglage**, qui n'apparaît dans aucune grille de topologie : le mode d'interaction. Une plateforme centrale en mode service se consomme sans négociation et maintient le facteur d'intersection à un. La même plateforme en collaboration permanente impose un échange par usage et le porte à deux au minimum [5].\n\nUne équipe de plateforme qui se félicite d'être « proche des métiers » décrit souvent, sans le savoir, le symptôme que les métriques de Nagappan associent aux défaillances [1]."
      },
      "cadran-norme": {
        title: "Cadran 3 · La norme opposable",
        body: "Seuils d'évaluation avant mise en service, exigences de traçabilité, paliers d'autonomie, définitions partagées.\n\nEn position centrale, ce cadran achète la comparabilité : savoir si la version d'aujourd'hui vaut celle du trimestre dernier, et si le cas d'usage de la division A se compare à celui de la division B. En position locale, il achète une norme adaptée au métier, et incomparable d'un métier à l'autre.\n\nLa norme **n'est pas** la plateforme, et confondre les deux est l'erreur la plus fréquente du hub-and-spoke. Une norme centralisée sans la plateforme qui la rend applicable devient un droit de veto : le centre valide sans fournir, et deux organisations se retrouvent à décider du même objet.\n\nLes enquêtes relèvent d'ailleurs que la gouvernance est l'élément le plus souvent pleinement centralisé [8] — ce qui est cohérent, à condition que la plateforme suive."
      },
      "cadran-budget": {
        title: "Cadran 4 · Le budget",
        body: "Qui paie, et surtout **à quel point de consommation le coût apparaît**.\n\nSur une ligne centrale, le service est gratuit pour le demandeur. Rien, chez lui, n'oppose cette demande à une autre : la demande ne s'arrête donc pas. La file s'allonge, les délais se comptent en trimestres, et les entités finissent par construire ailleurs.\n\nRefacturé, le même service reçoit une demande solvable, arbitrée contre autre chose. C'est le seul mécanisme qui régule le volume sans comité d'arbitrage.\n\nC'est le cadran le plus souvent oublié et le plus déterminant. Il est aussi le plus facile à tourner : la fenêtre s'ouvre une fois par an, à la construction du budget. Ajouter des moyens à service gratuit déplace la file sans la raccourcir."
      }
    }
  },
  "schema-04": {
    title: "Les combinaisons qui ne tiennent pas",
    regions: {
      "file-attente": {
        title: "Incohérence A · Le service gratuit",
        body: "Les quatre cadrans en position centrale, mais la demande locale reste libre. La configuration la plus répandue, et la plus mal comprise.\n\n**Signature observable** : des délais d'attente en trimestres, une file qui s'allonge quel que soit l'effectif ajouté, et des constructions parallèles dans les entités. Le facteur d'intersection reste à un et la profondeur de propriété reste faible : les deux variables de forme sont bien réglées, et le problème est ailleurs.\n\n**Diagnostic porté** : « l'équipe centrale manque de moyens. »\n\n**Cadran en cause** : le budget. Un service gratuit au point de consommation reçoit une demande que rien n'arbitre. Ajouter des moyens déplace la file sans la raccourcir, parce que la demande croît avec l'offre tant qu'elle ne coûte rien à celui qui la formule."
      },
      "veto-central": {
        title: "Incohérence B · Le droit de veto",
        body: "Propriété locale, norme centrale, plateforme absente ou locale. La configuration la plus coûteuse des quatre.\n\n**Signature observable** : chaque mise en service passe par une validation centrale qui ne fournit rien en échange. Le centre n'a ni le socle technique, ni la connaissance du cas d'usage, ni la responsabilité du résultat, rien qu'un droit de veto.\n\nFacteur d'intersection à deux, profondeur de propriété élevée : les deux grandeurs que les métriques organisationnelles associent à la défaillance sont au mauvais réglage **simultanément** [1] [4]. C'est ce qui en fait la plus coûteuse.\n\n**Diagnostic porté** : « la gouvernance est trop lourde. » Ce qui conduit à alléger la norme, donc à perdre la comparabilité, sans toucher à la cause.\n\n**Cadran en cause** : la plateforme. La norme a été centralisée sans ce qui la rend applicable sans négociation."
      },
      "plateformes-dupliquees": {
        title: "Incohérence C · Les n glossaires",
        body: "Tout local, plateforme comprise. Chaque entité se dote de son socle.\n\n**Signature observable** : les coûts dupliqués, qui se voient et se chiffrent. Mais la première victime n'est pas le budget : c'est la **couche sémantique**, cette représentation unifiée interprétable par les humains comme par les machines, dont le MIT CISR relève qu'elle devient un investissement sous pression à mesure que modèles et agents doivent s'appuyer sur des actifs immédiatement utilisables [13].\n\nUne couche sémantique est un actif partagé par construction : son intérêt vient de ce que tout le monde s'y réfère. Dupliquée en n exemplaires, elle cesse d'être un actif.\n\n**Diagnostic porté** : « il nous manque un outil de catalogue. »\n\n**Cadran en cause** : la plateforme. Aucun outil ne répare une définition que quatre entités ont écrite différemment — il la documente en quatre exemplaires."
      },
      "coherente": {
        title: "Le réglage cohérent",
        body: "Propriété et budget locaux ; norme et plateforme centrales, la plateforme en mode service.\n\nLe propriétaire métier décide, paie, et arbitre donc réellement. Le centre fournit un socle qui se consomme sans réunion et une norme opposable qui s'applique sans validation au cas par cas. Facteur d'intersection à un sur la livraison, profondeur de propriété faible.\n\nC'est le seul réglage qui mérite le nom de modèle fédéré — et aussi le plus rare, parce qu'il demande au centre de céder le droit de regard qu'il considère comme sa raison d'être.\n\nDeux remarques. D'abord, ce réglage est celui vers lequel l'arrivée des agents pousse indépendamment : la norme et l'évaluation remontent, l'autorité du propriétaire descend [9] [14]. Ensuite, il n'a pas à être adopté partout en même temps : le seuil de bascule se franchit entité par entité (schéma 05)."
      }
    }
  },
  "schema-05": {
    title: "Le seuil de bascule n'est pas la maturité",
    regions: {
      "sporadique": {
        title: "La zone où la mutualisation paie",
        body: "Sous le seuil, la demande de chaque entité est **sporadique** : des pics, pas un flux.\n\nQuatre entités qui ont besoin d'un spécialiste trois semaines par an chacune ne peuvent pas en recruter un. Mises en commun, elles en financent un à taux d'occupation correct, et chacune accède à une compétence qu'elle n'aurait jamais eue seule.\n\nLe gain est réel, et il est **entièrement imputable au caractère intermittent de la demande**. Ce n'est ni une question de maturité, ni une question de discipline, ni une question de taille d'entreprise.\n\nCorollaire rarement tiré : une entité qui perd son flux continu redevient candidate à la mutualisation. La remutualisation est un geste légitime, que les grilles de maturité présentent à tort comme une régression."
      },
      "continue": {
        title: "La zone où la file prend le dessus",
        body: "Au-delà du seuil, la demande devient **continue** dans plusieurs voies à la fois. Une file d'attente unique alimentée par des arrivées régulières ne mutualise plus rien : elle ordonne.\n\nLe temps d'attente ne dépend plus de la compétence de l'équipe mais du rapport entre son débit et celui des arrivées, et ce rapport se dégrade de façon non linéaire à l'approche de la saturation : **les deux derniers points de charge coûtent plus d'attente que les quarante premiers**.\n\nSecond effet, plus insidieux : l'attente dégrade la qualité de la demande elle-même. Un métier qui attend deux trimestres reformule son besoin en fonction de ce qu'il croit obtenable, et la file se met à sélectionner les demandes modestes plutôt que les demandes utiles."
      },
      "seuil-etp": {
        title: "La règle qui remplace la maturité",
        body: "Pour chaque entité, compter l'**équivalent temps plein de demande permanente** : le volume de travail data et IA qu'elle aurait à confier de façon continue sur l'année, et non en pics.\n\nAu-delà d'environ un équivalent temps plein, la mutualisation cesse de payer **pour cette entité, et pour elle seule**. Ce qu'elle gagne en accès à une compétence rare, elle le reperd en attente.\n\nLe chiffre est un ordre de grandeur, pas un résultat mesuré. Il dérive du raisonnement de file d'attente et de l'observation qu'en dessous de ce volume une entité ne peut pas couvrir le spectre de compétences requis. Il vaut comme **instrument de conversation budgétaire**, à recalibrer sur le coût local d'un profil et sur la variance réelle de la demande.\n\nSon intérêt n'est pas sa précision : c'est qu'il remplace un débat sur la maturité par un comptage que deux personnes peuvent faire ensemble en une heure."
      },
      "erreur-maturite": {
        title: "L'erreur de la progression par maturité",
        body: "« On commence en centre d'excellence, on passe au fédéré quand on mûrit, on finit en équipes produit. » La variable explicative est fausse, et elle produit deux erreurs de conduite.\n\n**Première erreur : la bascule globale.** Dans une entreprise à six divisions, deux dépasseront le seuil et quatre resteront en dessous. Le réglage cible est donc asymétrique — ces deux divisions prennent la propriété et le budget, les quatre autres restent servies par le centre. Les trois libellés disponibles ne savent pas nommer cette organisation, et c'est l'une des raisons pour lesquelles les entreprises réorganisent globalement là où il fallait régler localement.\n\n**Seconde erreur : l'irréversibilité supposée.** Présentée comme une progression, la grille interdit le retour. Une organisation qui a décentralisé par principe plutôt que par mesure se retrouve avec quatre demi-équipes sous-occupées, et aucun vocabulaire pour décrire le geste qui la sauverait."
      }
    }
  },
  "schema-06": {
    title: "Ce que l'agentique déplace",
    regions: {
      "avant": {
        title: "Avant · La capacité de construire est le facteur limitant",
        body: "Des équipes de développement produit de huit à dix personnes, dans lesquelles la ressource rare est le **constructeur** : un ingénieur de plus accroît directement le débit livré [9].\n\nDans cette configuration, la mutualisation de la compétence rare a un sens évident, et le centre d'excellence a sa raison d'être arithmétique. C'est le monde dans lequel les trois topologies de référence ont été formulées.\n\nC'est aussi le monde dans lequel les grilles de maturité sont à peu près cohérentes : à mesure que l'entreprise accumule des compétences, la rareté baisse, et la mutualisation perd son intérêt. La progression décrit alors une réalité — pour la mauvaise raison, mais elle la décrit."
      },
      "apres": {
        title: "Après · La supervision devient le facteur limitant",
        body: "Des équipes hybrides de quatre à six personnes appuyées par des agents, avec décisions et responsabilité rapprochées du lieu où la valeur se crée [9].\n\nSi la construction s'automatise partiellement et que la supervision ne s'automatise pas, alors la ressource rare se déplace du constructeur vers le **propriétaire-réviseur**. Un ingénieur data de plus accroît la capacité de construction ; il n'accroît pas la capacité de décider qu'une sortie est acceptable.\n\nOr cette capacité suppose la connaissance du métier, et elle **ne se mutualise pas**. Personne, dans une équipe centrale, ne peut arbitrer à la place d'une direction des risques ce qui constitue un faux positif acceptable.\n\nConséquence directe sur les cadrans : la justification arithmétique du centre d'excellence s'affaiblit sur la propriété au moment même où elle se renforce sur la norme."
      },
      "jeu-evaluation": {
        title: "Ce qui remonte · Le jeu d'évaluation",
        body: "Le jeu d'évaluation devient l'actif à tenir au centre. Non parce que le centre saurait mieux évaluer : **parce qu'un jeu d'évaluation n'a de valeur que par sa comparabilité**.\n\nIl sert à savoir si la version d'aujourd'hui vaut celle du trimestre dernier, et si le cas d'usage de la division A se compare à celui de la division B. Ces deux questions ne se posent qu'à une échelle qui dépasse une entité. Reconstitué localement, il perd sa seule propriété utile.\n\nLa fenêtre de décision est la plus étroite des six du dossier : elle s'ouvre au premier cas d'usage et elle se referme. Un jeu d'évaluation reconstitué après deux ans de production locale ne compare plus rien, puisque la série historique qui lui donnait son sens n'existe pas.\n\nC'est aussi la décision la moins chère : elle ne coûte rien le premier jour, et elle est irrattrapable le dernier."
      },
      "article-26": {
        title: "Ce qui descend · L'autorité, et l'article 26",
        body: "L'article 26 du règlement européen sur l'IA impose au déployeur de confier la surveillance humaine à des personnes physiques disposant de la compétence, de la formation et de l'**autorité** nécessaires, ainsi que du soutien nécessaire [14].\n\nLes trois premiers termes sont des conditions de personne : on les satisfait par un recrutement et une formation. Le quatrième est une condition d'**organisation**. L'autorité désigne ici la capacité de passer outre le système ou d'en suspendre l'usage sans demander la permission à quelqu'un dont les objectifs dépendent du débit.\n\nUn propriétaire placé cinq niveaux sous la décision budgétaire ne l'a pas, quelle que soit la compétence qu'on lui reconnaît par ailleurs. L'exigence est donc une **contrainte de profondeur de propriété, formulée en droit** — la première borne supérieure opposable sur cette variable.\n\nLes directions qui liront l'article 26 comme une obligation de formation passeront à côté de la seule de ses exigences qui se traduise en organigramme."
      }
    }
  },
  "schema-07": {
    title: "Trois interventions, trois coûts",
    regions: {
      "tourner": {
        title: "Intervention 1 · Tourner un cadran",
        body: "La moins chère et la plus réversible. Un seul cadran change, les équipes restent en place, aucun organigramme ne bouge.\n\nQuatre exemples : refacturer la plateforme aux entités ; imposer le mode service à l'équipe centrale ; remonter d'un niveau le propriétaire d'un cas d'usage ; sortir le jeu d'évaluation du périmètre d'une entité.\n\nChacun de ces gestes modifie une seule variable et produit un effet observable en **un à deux trimestres**. Aucun ne déclenche le coût de transition documenté par Mockus [6], précisément parce qu'aucun ne déplace de personnes.\n\nC'est le geste de premier recours, et la règle qui en découle est simple : devant un symptôme d'organisation, chercher d'abord lequel des quatre cadrans est au mauvais réglage."
      },
      "changer": {
        title: "Intervention 2 · Changer de modèle",
        body: "Les quatre cadrans bougent ensemble, et les personnes changent de place.\n\nLe coût de transition s'applique intégralement : la proximité d'un changement d'organisation est significativement associée à une baisse de la qualité, les départs récents allant avec une probabilité accrue de défauts signalés par les clients [6], résultat répliqué indépendamment sur Chrome [7].\n\nLa conséquence pratique est double. L'effet du nouveau réglage ne devient lisible qu'après résorption de la volatilité, ce qui prend plusieurs trimestres — pendant lesquels la direction qui a réorganisé verra ses indicateurs se dégrader sans savoir si c'est le réglage ou la transition.\n\nL'intervention se justifie quand plusieurs cadrans sont mal réglés **et** que leurs corrections dépendent l'une de l'autre. Elle ne se justifie pas pour corriger un symptôme unique.\n\nRègle de séquence associée : ne jamais réorganiser et changer de plateforme la même année."
      },
      "copier": {
        title: "Intervention 3 · Copier un modèle publié",
        body: "La seule des trois à n'avoir **aucun effet attendu**, et pourtant la plus fréquente.\n\nLe cas canonique est connu. Le modèle décrit en 2012 par Spotify — escouades, tribus, chapitres, guildes — a été repris par un très grand nombre d'entreprises. En 2020, un ancien responsable produit de l'entreprise a établi qu'il relevait largement de l'aspiration et non du fonctionnement réel : des milliers d'organisations ont refait leur organigramme sur la description d'un système qui n'avait jamais pleinement tourné chez son auteur [10].\n\nLes motifs d'échec documentés à l'intérieur même de l'entreprise se lisent dans notre grille : aucun dispositif de coordination quand plusieurs escouades devaient travailler ensemble, et une séparation entre encadrement fonctionnel et mission produit qui laissait la responsabilité sans titulaire.\n\nTraduit en cadrans : la copie a reproduit la propriété en position locale et laissé les trois autres indéterminés. Ce qui manquait n'était pas la culture, diagnostic le plus souvent avancé. C'était le mode d'interaction, qui n'était spécifié nulle part — et qui ne figure dans aucune publication d'organigramme, parce que son auteur ne l'a pas formulé ainsi."
      }
    }
  }
}
