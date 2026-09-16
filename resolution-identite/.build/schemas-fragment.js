{
  "schema-01": {
    title: "Trois issues, un seul chiffre",
    regions: {
      "seuils-utilisateur": {
        title: "Les deux seuils appartiennent à l'acheteur",
        body: "Dans le cadre original, l'analyste déclare µ (probabilité de lier deux personnes distinctes) et λ (probabilité de manquer un vrai rapprochement) **avant** de lancer l'appariement. La procédure optimale est ensuite celle qui minimise la zone d'incertitude sous ces deux contraintes [1].\n\nL'ordre des opérations porte tout le raisonnement : on déclare d'abord ce qu'on accepte de se tromper, la machine optimise ensuite. En 2026, un acheteur de graphe d'identité ne fixe ni l'un ni l'autre, et n'est le plus souvent pas informé qu'il existe des seuils. C'est l'exigence E1 du cahier des charges (schéma 07)."
      },
      "zone-grise": {
        title: "Le troisième verdict, celui qui a disparu",
        body: "Fellegi et Sunter définissent une zone intermédiaire, le *lien possible*, pour les paires dont le poids de preuve ne permet de trancher ni dans un sens ni dans l'autre. Le cadre ne la traite pas comme un échec : il en fait le lieu où l'incertitude devient visible, et la renvoie à une revue humaine [1].\n\nLes instituts statistiques nationaux la pratiquent encore, sous le nom de revue clérical, en général sur un échantillon probabiliste de paires. Le marché publicitaire l'a absorbée : le fournisseur tranche cette zone en interne, par une règle qu'il ne publie pas, et livre un résultat binaire. C'est la seule partie du cadre dont la suppression ne se voit nulle part dans le livrable."
      },
      "verdict-binaire": {
        title: "Ce qu'un acheteur reçoit",
        body: "Un fichier à deux états : apparié, non apparié. Aucun indicateur de confiance par paire, aucune trace de ce qui a été rapproché, aucune indication de la part des décisions qui relevaient de la zone grise.\n\nLe non-apparié est retiré du livrable sans motif, ce qui masque la distinction entre « personne absente du graphe » et « personne présente mais sous le seuil ». L'apparié est livré comme certain, quel que soit le poids de preuve qui l'a produit : une correspondance sur identifiant fort et une correspondance sur nom et code postal ressortent dans la même colonne."
      },
      "chiffre-publie": {
        title: "Une grandeur sur trois",
        body: "La décision d'appariement comporte au moins trois grandeurs : la couverture, le taux de fausse fusion, et la part de la zone d'incertitude. Une seule circule entre le fournisseur et le comité d'achat.\n\nSa particularité est d'être la seule que le fournisseur puisse faire monter sans rien améliorer, en abaissant le seuil de décision. Deux propositions affichant le même pourcentage peuvent donc correspondre à deux niveaux d'exigence entièrement différents, et le comparatif ne le dira pas."
      }
    }
  },
  "schema-02": {
    title: "La dissymétrie des deux erreurs",
    regions: {
      "faux-non-lien": {
        title: "Le faux non-lien : une erreur confortable",
        body: "Le graphe ne reconnaît pas qu'il s'agit de la même personne. Le coût est de la portée : audience plus petite, exclusion qui ne s'applique pas, fréquence mal plafonnée, client traité comme un prospect.\n\nTrois propriétés le rendent gérable. Il est **visible** au point d'origine (le volume adressable se lit dans la console), **chiffrable** (impressions non délivrées, média acheté plus cher), et **corrigible par du budget** (élargir le ciblage, ajouter un second fournisseur).\n\nUn directeur marketing le voit dans son tableau de bord la semaine où il se produit. C'est, par construction, le seul des deux qu'il pense à négocier."
      },
      "fausse-fusion": {
        title: "La fausse fusion : l'erreur qui ne remonte pas",
        body: "Le graphe déclare identiques deux personnes distinctes. Ses propriétés sont l'exact opposé des précédentes.\n\n**Invisible** : rien, dans une console, ne signale qu'un profil agrège deux individus, et le profil obtenu paraît même meilleur que les autres. **Propagée** : une fois écrite, la fusion se transmet à l'activation, à la mesure, aux exclusions, à la personnalisation et aux droits des personnes (schéma 03). **Irrattrapable sans la trace** : défusionner suppose de savoir quels enregistrements ont été rapprochés, sur quelle base, à quelle date.\n\nQuatrième propriété, la plus dérangeante : elle est **non uniformément distribuée**, et se concentre sur les combinaisons d'attributs les moins discriminantes. Un régulateur l'a établi dans un autre secteur [5]."
      },
      "regle-marche": {
        title: "Pourquoi le marché ne corrige pas de lui-même",
        body: "Sans exigence écrite sur µ, aucun mécanisme ne pousse un fournisseur à réduire la fausse fusion, et un mécanisme puissant pousse à l'accepter : elle augmente le taux d'appariement, seul chiffre qui circule jusqu'au comité d'achat.\n\nLa règle est opposable en négociation, et elle se teste en une question : « quel taux de fausse fusion garantissez-vous, et sur quel protocole le mesurez-vous ? ». Un fournisseur qui refuse de le plafonner vient d'indiquer qu'il ne le mesure pas. La réponse renseigne davantage que le chiffre qu'il aurait fourni."
      }
    }
  },
  "schema-03": {
    title: "La propagation d'une fausse fusion",
    regions: {
      "usage-activation": {
        title: "A1 · Activation média",
        body: "Le budget destiné à une personne est dépensé sur deux, ou l'inverse. Le plafond de fréquence porte sur une entité qui n'existe pas, donc la pression réelle sur chacun des deux individus reste inconnue.\n\nL'effet net sur la performance affichée est ambigu, ce qui explique qu'il ne déclenche aucune alerte : un profil fusionné paraît plus actif et plus multi-canal, donc plus qualifié, et les campagnes qui le ciblent affichent souvent un meilleur taux d'engagement apparent."
      },
      "usage-mesure": {
        title: "A2 · Mesure d'incrémentalité",
        body: "Une part du comportement du groupe témoin est attribuée au groupe traité, et réciproquement. Le mélange brouille la relation entre exposition et réponse, et le résultat statistique est connu : les coefficients de pente sont systématiquement biaisés vers zéro [4].\n\nLa conséquence de gestion est traitée au schéma 04. Elle est plus sévère qu'il n'y paraît, parce qu'un effet raboté se lit comme un effet mesuré avec prudence, et non comme un artefact."
      },
      "usage-exclusion": {
        title: "A3 · Listes d'exclusion et de suppression",
        body: "Une opposition exprimée par une personne s'applique à une autre, ou ne s'applique pas à celle qui l'a exprimée. Les deux directions posent un problème, et la seconde est une non-conformité caractérisée.\n\nC'est l'usage où la fausse fusion produit le plus rapidement une réclamation, parce que la personne concernée constate elle-même que son opposition n'a pas été honorée. C'est aussi, par conséquent, le canal par lequel une direction découvre en général qu'elle a un problème d'appariement."
      },
      "usage-personnalisation": {
        title: "A4 · Personnalisation, tarification, éligibilité",
        body: "Un segment de valeur, une offre, un refus s'appuient sur un historique qui appartient pour partie à quelqu'un d'autre. L'erreur devient individuelle et matérielle.\n\nC'est le seul des cinq usages où la fausse fusion produit un effet directement défavorable à une personne identifiée, ce qui le fait relever d'un régime de risque différent : dans un cadre européen, une erreur inégalement répartie selon la fréquence des patronymes devient une question de discrimination indirecte. C'est la raison pour laquelle cet usage figure en décision irréversible dans la section 9."
      },
      "usage-droits": {
        title: "A5 · Droits d'accès et d'effacement",
        body: "Répondre à une demande d'accès sur une identité fusionnée revient à communiquer les données d'un tiers : l'exercice d'un droit devient la violation d'un autre. Une demande d'effacement pose le problème symétrique, puisque effacer proprement suppose de savoir défusionner.\n\nLes deux opérations dépendent d'une information que le fournisseur détient et que le contrat prévoit rarement de restituer (exigence E5, schéma 07). C'est le seul des cinq usages où l'erreur finit par se signaler, mais elle se signale par une réclamation plutôt que par un tableau de bord."
      }
    }
  },
  "schema-04": {
    title: "Le rabotage de la preuve",
    regions: {
      "effet-vrai": {
        title: "L'effet réel, celui qu'on cherche à établir",
        body: "La part du résultat commercial qui n'aurait pas eu lieu sans l'exposition. C'est la grandeur que finance un plan de mesure, et elle n'est jamais observée directement : elle est estimée par comparaison à un groupe témoin.\n\nLa construction de ces deux groupes s'appuie sur le graphe d'identité, qui décide qui a été exposé et qui ne l'a pas été. Cette dépendance est rarement explicitée dans un plan de mesure, alors qu'elle en conditionne la validité au même titre que la taille de l'échantillon."
      },
      "attenuation": {
        title: "L'atténuation, conséquence des faux liens",
        body: "Mélanger le comportement de deux personnes distinctes brouille la relation entre l'exposition et la réponse, et un brouillage aléatoire aplatit la pente. Le résultat est établi : dans une régression estimée sur des données appariées à tort, les coefficients sont systématiquement biaisés vers zéro [4].\n\nLa direction du biais est ce qui rend l'erreur dangereuse. Un effet surestimé aurait déclenché une vérification ; un effet sous-estimé passe pour un résultat honnête. Le dispositif construit pour prouver l'effet le rabote, et il le rabote dans le sens qui ressemble à de la prudence."
      },
      "selection": {
        title: "La sélection, conséquence des faux non-liens",
        body: "Les enregistrements qui échouent à s'apparier ne sont pas un échantillon aléatoire : ce sont les personnes aux données incomplètes, mobiles, récemment arrivées, ou moins connectées [3].\n\nL'estimation porte donc sur une sous-population systématiquement différente de celle qu'on visait. À la différence de l'atténuation, la direction du biais n'est pas prévisible : elle dépend de la corrélation entre la propension à s'apparier et la réponse à l'exposition. Un intervalle plus large accompagne en général l'estimation, ce qui dégrade encore la puissance disponible."
      },
      "lecture-direction": {
        title: "Ce qui se passe en comité",
        body: "Un effet réel, raboté par l'atténuation, passe sous le seuil de détectabilité du budget de test. Le dispositif rend alors un résultat non concluant, et le comité le lit comme l'absence d'effet.\n\nLa combinaison avec la puissance statistique est le point à retenir : le budget d'expérimentation d'un annonceur ordinaire place déjà son seuil d'indétectabilité au-dessus de bien des effets réels. Ajouter une atténuation d'origine identitaire revient à financer un dispositif qui ne peut structurellement pas conclure. La parade tient dans l'ordre des travaux : qualifier le graphe avant d'arrêter le plan de mesure, et non l'inverse."
      }
    }
  },
  "schema-05": {
    title: "Ce que le crédit a tranché avant la publicité",
    regions: {
      "fcra-exactitude": {
        title: "Une norme qui porte sur la procédure",
        body: "Le *Fair Credit Reporting Act* impose depuis 1970 de suivre « des procédures raisonnables pour assurer l'exactitude maximale possible » des informations rapportées sur un consommateur.\n\nLa formulation est plus habile qu'une obligation de résultat : elle n'exige pas l'exactitude, elle exige que les procédures soient raisonnables au regard de l'exactitude visée. C'est exactement la forme que prendrait une clause de qualité d'appariement dans un contrat de fourniture d'identité, et c'est ce que les exigences E1 à E3 du cahier des charges reconstituent."
      },
      "regle-illegale": {
        title: "Une règle d'appariement peut être illégale",
        body: "L'avis du 4 novembre 2021 établit que l'appariement sur le seul nom, sans vérification par un élément d'identification supplémentaire, se situe nettement en deçà de l'obligation légale [5].\n\nL'objet de la décision n'est ni une donnée, ni une finalité, ni un consentement : c'est la règle de rapprochement elle-même, son seuil, sa logique interne. Le raisonnement est transposable à tout graphe dont la règle produit un dommage prévisible. Aucune autorité européenne ne l'a fait à ce jour dans le domaine publicitaire, et c'est une lecture de l'auteur, non un état du droit."
      },
      "clause-non-garantie": {
        title: "La mention de non-correspondance n'exonère pas",
        body: "La déclaration accompagnant l'avis avertit les agences contre la tentative d'échapper à leurs responsabilités en assortissant leur rapport d'une mention indiquant qu'il pourrait ne pas correspondre à la bonne personne [6].\n\nToute personne ayant lu un contrat de fourniture de données publicitaires reconnaîtra la clause : le fournisseur y décline la responsabilité de l'exactitude des appariements. Dans le secteur du crédit, cette clause a été jugée sans effet exonératoire. Elle reste la norme contractuelle dans la publicité, et personne ne l'a encore testée."
      },
      "effet-demographique": {
        title: "L'erreur a un profil démographique",
        body: "L'avis relève que les rapprochements erronés sont plus fréquents parmi les populations hispaniques, noires et asiatiques, la diversité des patronymes y étant moindre que dans la population blanche non hispanique [5].\n\nLe constat est purement combinatoire : à règle d'appariement égale, une population où un patronyme est partagé par davantage de personnes produit davantage de collisions. Il vaut donc pour tout système d'appariement onomastique, publicitaire compris. Une direction qui adosse un ciblage, une exclusion ou une éligibilité à un graphe non qualifié déploie une erreur inégalement répartie, dans un cadre européen où la discrimination indirecte est un risque caractérisé."
      }
    }
  },
  "schema-06": {
    title: "La carte des espaces d'identité",
    regions: {
      "identite-authentifiee": {
        title: "F1 · Dérivé d'une authentification",
        body: "Une adresse de courrier électronique fournie par l'utilisateur connecté, hachée et salée, assortie d'un mécanisme de consentement explicite et d'une rotation périodique de l'identifiant.\n\nCe que la famille garantit réellement : la provenance de l'entrée et la traçabilité du consentement associé, ce qui répond au grief central de la sanction française [10]. Ce qu'elle ne déclare pas : la règle qui rapproche deux adresses différentes d'une même personne, et le taux de fausse fusion qui en résulte. Le hachage ne fait pas sortir l'identifiant du champ du règlement [9]."
      },
      "identite-inferee": {
        title: "F2 · Émis pour trafic non authentifié",
        body: "Aucune entrée fournie par la personne : l'identifiant est construit par inférence à partir de signaux d'appareil et de contexte. C'est, par construction, la famille dont la couverture est la raison d'être.\n\nC'est aussi celle où l'écart entre taux d'appariement et exactitude est le plus large, et celle où l'absence de mesure publique pèse le plus lourd. L'étude de terrain la plus citée sur la qualité des données de tierce partie trouvait des segments ne faisant pas mieux que le hasard [2], et rien d'équivalent n'a été publié depuis sur les graphes de 2026."
      },
      "graphe-plateforme": {
        title: "F3 · Graphe propriétaire de plateforme",
        body: "Un compte utilisateur détenu par la plateforme, enrichi de tout ce qu'elle observe. L'appariement s'exécute hors de la vue de l'acheteur, et rien n'en est vérifiable de l'extérieur : ni la règle, ni les seuils, ni la population de référence.\n\nS'y ajoute la configuration déjà décrite un étage plus haut dans cette série : la partie qui définit l'identité est aussi celle qui vend l'espace dont on mesure la performance sur la base de cette identité. La parade est la même, et elle est contractuelle : un droit de vérification écrit, et un jeu de vérité terrain détenu par l'acheteur."
      },
      "graphe-interne": {
        title: "F4 · Graphe interne de l'entreprise",
        body: "Vos propres identifiants clients. La contrainte réelle se déplace vers la qualité de vos référentiels, qui devient le facteur limitant, et non plus vers la couverture du marché.\n\nC'est la seule famille où les seuils vous appartiennent, donc la seule où la restauration du troisième verdict ne se négocie pas : vous décidez ce que vous faites de la zone d'incertitude, usage par usage. Rien n'y est structurellement non déclaré, à condition de l'écrire. Le coût d'entrée est réel, et il est de nature organisationnelle plutôt que technique."
      },
      "trou-accreditation": {
        title: "Les deux trous du dispositif de transparence",
        body: "**Le standard de déclaration.** `id-sources.json` permet de déclarer quels identifiants circulent chez un acteur, pour rendre lisibles les chemins d'approvisionnement [13]. Aucun champ ne porte la règle d'appariement, ses seuils, ni ses taux d'erreur.\n\n**L'accréditation.** Le dispositif de référence impose la divulgation méthodologique et l'audit des **services de mesure** [14]. La résolution d'identité qui les alimente reste largement hors champ, l'identité et la qualité des données figurant parmi les sujets en cours d'évaluation plutôt que parmi les standards. Le résultat est une couche auditée posée sur une couche qui ne l'est pas."
      }
    }
  },
  "schema-07": {
    title: "Le cahier des charges",
    regions: {
      "mu-impose": {
        title: "E1 · Plafonner la fausse fusion",
        body: "Le contrat nomme une valeur maximale tolérée pour la probabilité d'apparier deux enregistrements désignant des personnes distinctes, et la rend contrôlable. C'est le paramètre µ que la théorie confie à l'utilisateur depuis 1969 [1].\n\nLe poser change la conversation commerciale avant même d'obtenir un chiffre : un fournisseur qui refuse de plafonner µ vient d'indiquer qu'il ne le mesure pas. La valeur exacte importe moins que l'existence de la ligne, parce qu'elle oblige à produire un protocole de mesure là où il n'y en avait aucun."
      },
      "zone-declaree": {
        title: "E3 · Déclarer la zone d'incertitude",
        body: "Le fournisseur indique la part des paires comparées qui tombent dans la zone intermédiaire, et la règle par laquelle il les tranche aujourd'hui en silence.\n\nL'acheteur peut alors choisir en connaissance de cause : écarter ces paires (précision haute, couverture basse), les rattacher (l'inverse), ou les traiter différemment selon l'usage aval — rattachées pour une audience de prospection, écartées pour une liste d'exclusion ou un dispositif de mesure. C'est la décision la plus structurante de la liste, parce qu'elle rend l'arbitrage visible au lieu de le déléguer."
      },
      "verite-terrain": {
        title: "E4 · Détenir son jeu de vérité terrain",
        body: "Quelques milliers d'identités connues avec certitude, issues de la base propre : clients authentifiés, doublons résolus manuellement, foyers documentés. Tenues hors du périmètre livré au fournisseur, et rejouées à chaque version du graphe.\n\nC'est le seul dispositif qui transforme une exactitude annoncée en exactitude mesurée, et la contrepartie indispensable de E1 et E2 : sans lui, un taux plafonné au contrat reste une déclaration. Coût : quelques jours-homme. Aucune négociation n'est requise, et il sert immédiatement à départager deux propositions. C'est la décision la moins chère du dossier et la seule qui ne dépende de personne."
      },
      "restitution": {
        title: "E5 · Rendre les appariements restituables",
        body: "L'acheteur peut obtenir, dans un format exploitable et un délai borné, la liste des enregistrements rapprochés et la base du rapprochement.\n\nSans cette clause, une fausse fusion détectée n'est pas corrigible et une demande d'effacement n'est pas exécutable proprement : on efface trop ou trop peu, et les deux sont fautifs. L'information existe chez le fournisseur, puisqu'elle est le produit de son propre traitement. Elle figure rarement au contrat, et c'est la clause dont l'absence se découvre au moment où elle devient nécessaire."
      },
      "titulaire-droits": {
        title: "E7 · Désigner un titulaire pour les droits des personnes",
        body: "Une personne nommée répond de la capacité à reconstituer, pour une demande d'accès ou d'effacement, l'ensemble des identités que le graphe a rattachées à un individu.\n\nL'exigence paraît administrative. Elle est la seule qui oblige à vérifier que E5 fonctionne réellement, parce qu'elle assigne à quelqu'un la charge d'exécuter la restitution plutôt que de la stipuler. Elle prolonge une constante de cette série : une obligation sans titulaire échoit au dernier maillon technique capable de l'exécuter, qui n'a ni le mandat ni les moyens de la refuser."
      }
    }
  }
}
