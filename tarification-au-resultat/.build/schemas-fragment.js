{
  "schema-01": {
    title: "Trois compteurs, et un seul change de camp",
    regions: {
      "compteur-siege": {
        title: "Compteur 1 · Le siège",
        body: "Le modèle historique du logiciel d'entreprise facture un **droit d'accès** : un nombre d'utilisateurs nommés, connu, stable sur la durée du contrat, vérifiable dans l'annuaire interne.\n\nSa propriété la plus importante passait inaperçue tant qu'elle allait de soi : **l'acheteur contrôlait la valeur du compteur.** Ouvrir ou fermer un compte était sa décision, et il pouvait prévoir sa facture à douze mois sans rien demander à personne.\n\nCe compteur se défait sous l'agentique. Quand un agent exécute le travail à travers plusieurs applications, l'utilisateur humain cesse d'ouvrir les interfaces, et le lien entre l'usage du logiciel et le nombre de sièges se rompt. Gartner chiffre à 234 milliards de dollars la dépense logicielle d'entreprise exposée par ce mouvement [2]."
      },
      "compteur-action": {
        title: "Compteur 2 · L'action",
        body: "On facture chaque opération exécutée par l'agent. La forme la plus explicite du marché est publiée : 100 000 crédits pour 500 $, une action standard à 20 crédits, une action vocale à 30 [8].\n\nL'acheteur perd ici le contrôle de la **valeur** du compteur : il ne décide pas combien d'appels d'outils l'agent enchaînera pour traiter une demande donnée.\n\nMais le compteur reste **descriptif**. Il enregistre un fait technique daté, qui s'est produit ou ne s'est pas produit, et dont la trace existe dans les journaux d'exécution. Rien n'y est à interpréter, donc rien n'y est à négocier au-delà du prix unitaire et du plafond. C'est la différence qui compte pour la rédaction du contrat."
      },
      "compteur-resultat": {
        title: "Compteur 3 · Le résultat",
        body: "On facture une conversation résolue, un ticket traité, une qualification obtenue : 0,99 $, 1,50 $ ou 2,00 $ selon le fournisseur [5][6][7].\n\nLe compteur cesse d'être descriptif pour devenir **interprétatif**. Aucun événement technique ne dit « ce client est satisfait ». Il faut une règle qui décide quand un échange compte comme résolu, et cette règle est un énoncé normatif, rédigé par le vendeur, rarement publié en entier, jamais annexé au contrat par défaut.\n\nLa conséquence est contre-intuitive : le client final déclenche la facture par son **silence**, le fournisseur en écrit la règle, et l'acheteur, qui paie, ne contrôle ni l'un ni l'autre."
      },
      "zone-definition": {
        title: "La colonne qui décide de la facture",
        body: "Les comparatifs de marché comparent la deuxième colonne du schéma : l'unité et son prix. La facture se décide dans la dernière.\n\nTrois questions suffisent à savoir où l'on se trouve. Qui peut modifier la définition de l'événement facturable ? Par quel moyen l'acheteur apprend-il qu'elle a été modifiée ? Que peut-il opposer s'il n'est pas d'accord avec le décompte ?\n\nUn fournisseur peut répondre aux trois sans rien concéder sur son tarif unitaire. C'est ce qui rend ces questions utiles en appel d'offres : elles ne coûtent rien à poser, et elles trient les offres sans toucher au prix."
      },
      "ligne-de-partage": {
        title: "La bascule, et la clause qui y répond",
        body: "La bascule commentée dans la presse spécialisée est celle du siège vers l'usage. Elle n'est pas la plus lourde de conséquences.\n\nCelle qui compte sépare l'action du résultat. La première déplace le contrôle de la **valeur** du compteur, et un plafond de dépense y répond : on borne la facture sans discuter de la définition. La seconde déplace le contrôle de la **définition**, et aucun plafond n'y répond.\n\nL'instrument correspondant existe et tient en une page : une annexe de comptage versionnée, dont toute modification vaut modification tarifaire. Presque aucun contrat n'en contient, et sa rédaction ne demande aucune concession technique au fournisseur — seulement la mise par écrit de ce qu'il applique déjà."
      }
    }
  },
  "schema-02": {
    title: "Anatomie d'une résolution facturée",
    regions: {
      "ouverture": {
        title: "Ouverture de la conversation",
        body: "Le client ouvre un échange. Rien ne facture encore.\n\nC'est le seul moment de la chronologie où l'acheteur connaît exactement l'état du compteur, et c'est pour cette raison que le volume de demandes entrantes reste la grandeur de référence d'un prévisionnel budgétaire. Elle est métier, connue, et elle ne dépend d'aucune règle du fournisseur.\n\nTout ce qui suit dans le schéma transforme ce volume connu en un nombre d'événements facturés que l'acheteur ne peut pas recalculer de son côté."
      },
      "echange": {
        title: "Les n réponses de l'agent",
        body: "L'agent répond une fois, dix fois, vingt fois. La documentation d'Intercom décrit une facturation qui s'applique **une seule fois par conversation**, quel que soit le nombre de questions traitées [7].\n\nCette règle est favorable à l'acheteur, et il faut le dire : elle le protège d'un compteur qui s'emballerait sur les échanges longs, et elle aligne le fournisseur sur la résolution en un tour plutôt que sur la conversation interminable.\n\nElle a cependant une contrepartie qui n'apparaît pas dans la grille. Une conversation très longue coûte au fournisseur beaucoup de calcul pour un seul encaissement. Dans un marché où le coût d'inférence par flux agentique est anticipé à plus de cinq fois son niveau actuel d'ici 2028 [1], cette asymétrie pousse mécaniquement à abréger les échanges difficiles."
      },
      "fenetre-silence": {
        title: "La fenêtre de silence",
        body: "Le client cesse de répondre. Un compte à rebours démarre. Les relevés concordants décrivent vingt-quatre heures chez l'un, soixante-douze heures chez l'autre, avec examen de signaux intermédiaires (retour positif, absence de question de suivi).\n\n**Ces durées ne figurent pas dans la documentation primaire consultable**, et elles sont données ici comme relevés secondaires à faire confirmer par écrit.\n\nC'est pourtant la variable tarifaire la plus puissante du contrat. Raccourcir la fenêtre de soixante-douze à vingt-quatre heures augmente le nombre de résolutions facturées à comportement client rigoureusement inchangé. Aucune hausse de tarif n'est notifiée, aucune clause n'est violée, et la facture monte. D'où la décision D3 : la fenêtre s'écrit en heures, dans une annexe versionnée."
      },
      "presomption": {
        title: "La présomption de résolution",
        body: "Passé le délai, la conversation est réputée résolue et devient une ligne de facture.\n\nIl faut nommer l'opération pour ce qu'elle est : **une absence de signal est convertie en preuve de succès.** Le fournisseur n'a rien observé, et le silence du client porte la charge de la preuve à sa place.\n\nLe mécanisme n'est pas illégitime en soi : aucun dispositif ne peut interroger chaque client pour savoir s'il est satisfait, et une présomption est la seule façon pratique de clore un compteur. Ce qui est contestable est qu'elle ne soit ni publiée en entier, ni annexée, ni réfutable. Une présomption de droit commun admet la preuve contraire ; celle-ci n'en prévoit aucune."
      },
      "escalade": {
        title: "L'escalade : un échec déclaré",
        body: "L'escalade vers un humain ne facture pas. Chez Zendesk, toute intervention humaine exonère, et la promesse est explicite : pas de résolution, pas de facture [5][6].\n\nC'est un vrai alignement d'intérêts, et l'objection qu'un acheteur oppose en premier au raisonnement de ce dossier. Elle suppose néanmoins que l'escalade et l'échec soient la même chose.\n\nIls ne le sont pas. L'escalade est un échec **déclaré**, dont la trace existe dans le système des deux parties. Le renoncement silencieux est un échec **invisible**, dont aucune trace n'existe du côté du fournisseur. Un compteur qui facture le second et exonère le premier rémunère la discrétion de l'échec plutôt que son absence."
      },
      "reouverture": {
        title: "La réouverture hors fenêtre",
        body: "Le client revient trois semaines plus tard, sur le même problème. La première conversation a déjà été encaissée comme résolue. La seconde ouvre un nouveau compteur.\n\n**Le même problème non traité facture deux fois.**\n\nC'est l'indicateur le plus utile que l'acheteur peut tenir, et il ne demande aucune coopération du fournisseur : le taux de réouverture au-delà de la fenêtre se calcule sur les données de l'acheteur. Il est la première des mesures de la décision D6, et le seul chiffre qu'on puisse opposer à un décompte contesté."
      },
      "trois-trajectoires": {
        title: "Trois trajectoires, un seul enregistrement",
        body: "Le compteur enregistre la même chose dans trois situations qui n'ont rien de commun pour l'entreprise.\n\n**a · Le client est servi.** Le seul cas où la facture correspond à ce qu'elle prétend mesurer.\n\n**b · Le client renonce.** Il traite son problème par un autre canal, abandonne son panier, ou résilie. Aucune trace n'en parvient au fournisseur, et la ligne de facture est identique au cas précédent.\n\n**c · Le client reçoit une réponse fausse qu'il ne détecte pas.** Il reviendra, hors fenêtre, avec un problème plus coûteux.\n\nAucun des trois ne se distingue dans le décompte mensuel. C'est la raison pour laquelle un compteur au résultat ne porte, à lui seul, aucune information sur la qualité du service rendu."
      }
    }
  },
  "schema-03": {
    title: "Quatre fournisseurs, quatre définitions",
    regions: {
      "fin": {
        title: "Fin · Intercom",
        body: "**Unité** : le résultat, 0,99 $, facturé une fois par conversation quel que soit le nombre de questions traitées.\n\n**Événements facturables relevés** : la résolution, le transfert vers une procédure, la disqualification. Une qualification commerciale est facturée séparément, de l'ordre de 9,99 $ selon les relevés [7].\n\nLa liste mérite d'être lue deux fois. Le **transfert vers une procédure** et la **disqualification** facturent au même titre qu'une résolution : l'agent est payé pour avoir conclu que la demande sortait de son périmètre. Ce n'est pas abusif en soi. C'est en revanche le genre d'élément qu'un acheteur découvre à la première facture s'il ne l'a pas demandé en appel d'offres.\n\nHors de l'environnement Intercom, un forfait d'entrée mensuel inclut un quota. Sur Intercom, les sièges d'assistance restent facturés en plus."
      },
      "zendesk": {
        title: "Zendesk",
        body: "**Unité** : la résolution automatisée, 1,50 $ au tarif engagé selon le blogue du fournisseur [6]. Un tarif supérieur à l'usage non engagé est rapporté par des revues tierces, sans confirmation primaire.\n\n**Définition fournisseur** : une demande traitée entièrement par l'agent, sans intervention humaine, avec une déclinaison par canal selon des principes présentés comme constants.\n\nC'est la définition la plus claire du relevé, et la promesse associée est la plus engageante : pas de résolution, pas de facture [5]. Toute intervention humaine exonère.\n\nÀ demander par son nom en négociation : le dispositif de **tarification dynamique**, documenté pour les grands comptes, qui autorise le transfert de budget entre sièges humains et résolutions automatisées sans renégocier le contrat. C'est le seul mécanisme de souplesse budgétaire documenté des quatre."
      },
      "agentforce": {
        title: "Agentforce · Salesforce",
        body: "La trajectoire la plus instructive du relevé, et celle qui contredit le récit dominant.\n\n**Modèle initial** : 2,00 $ par conversation d'agent orienté client, l'escalade étant facturée comme la résolution. Un compteur présenté comme un résultat, mais indifférent au résultat.\n\n**Documentation primaire actuelle** : des crédits. 100 000 pour 500 $, une action standard à 20 crédits, une action vocale à 30 [8]. Le périmètre couvert est plus large que celui des conversations, et les deux modèles ne coexistent pas dans une même organisation.\n\nLa lecture à en tirer : l'acteur le plus volumineux du marché est revenu du compteur interprétatif au compteur descriptif. C'est plus simple à instrumenter, plus simple à vérifier, et cela ne demande pas à l'éditeur de porter la variance du succès."
      },
      "sierra": {
        title: "Sierra",
        body: "Rien de publié. Les montants qui circulent dans les comparatifs — frais de mise en service, engagement annuel minimum, tarif unitaire estimé — proviennent intégralement de sources tierces, souvent concurrentes. Ils ne sont pas repris ici, et ils ne devraient pas l'être dans un dossier d'appel d'offres.\n\nLe seul fait utilisable est l'absence de publication, et il a une conséquence pratique : **un acheteur ne peut pas préparer la négociation du compteur avant d'entrer en négociation.** Il arrive à la table sans savoir ce qui est standard chez le fournisseur et ce qui est concédé.\n\nLa parade est la décision D1 : poser la question de la règle de comptage dans le cahier des charges, où elle oblige une réponse écrite avant que le rapport de force commercial ne s'installe."
      },
      "colonne-verifiabilite": {
        title: "La colonne manquante",
        body: "Aucun des quatre fournisseurs ne documente publiquement comment un client peut recompter ce qui lui est facturé. La légende du schéma distingue trois états, et aucune ligne n'atteint le premier : ● documenté et vérifiable, ◐ grille publiée mais détail du comptage non stipulé, ○ non documenté.\n\nUn analyste avait posé la condition dès l'apparition du modèle : la définition et la mesure de ce qui compte comme interaction résolue doivent être claires et transparentes pour que la confiance s'établisse [12].\n\nL'écart entre cette recommandation et l'état de la documentation publique, deux ans plus tard, est le véritable résultat de ce relevé comparatif. Il explique aussi pourquoi les six décisions du dossier portent sur le contrat et non sur le choix du fournisseur : sur ce point, les quatre offres sont au même niveau."
      }
    }
  },
  "schema-04": {
    title: "La dimension payée et les dimensions muettes",
    regions: {
      "dimension-payee": {
        title: "La seule dimension payée",
        body: "« Terminer l'échange sans escalade. » C'est la totalité de ce que mesure le compteur de facturation, et c'est ce que le fournisseur est payé pour produire.\n\nHolmström et Milgrom ont démontré en 1991 ce que fait une telle rémunération quand la tâche en comporte plusieurs et qu'une seule est mesurable : l'effort se déplace vers la dimension mesurée, et le gain obtenu peut être inférieur à la perte subie sur les autres. Leur conclusion la plus contre-intuitive est qu'une rémunération **fixe**, indépendante de la performance mesurée, peut alors être optimale [10].\n\nDans sa conférence Nobel, Holmström résume la question d'une phrase utile à tout acheteur d'agent : il ne sert à rien de créer de fortes incitations pour les mauvaises actions."
      },
      "dimensions-muettes": {
        title: "Les quatre dimensions muettes",
        body: "**Exactitude de la réponse.** Une réponse plausible et fausse facture exactement comme une réponse juste. Aucun compteur du marché ne les distingue.\n\n**Satisfaction réelle.** Mesurée, le cas échéant, dans le canal du fournisseur, par un dispositif que l'acheteur ne contrôle pas et dont il ne connaît ni le taux de réponse ni le mode de sollicitation.\n\n**Conformité.** Devoir de conseil, information obligatoire, traçabilité : les obligations sectorielles ne figurent dans aucun compteur de facturation.\n\n**Coût aval.** Le problème non traité qui revient ailleurs : recontact par un autre canal, réclamation, résiliation. Il est porté intégralement par l'acheteur, et il n'apparaît dans aucune des deux factures.\n\nQuatre dimensions sur cinq, et ce sont celles pour lesquelles l'organisation a acheté le service."
      },
      "arbitrage": {
        title: "Trois arbitrages rationnels",
        body: "Le fournisseur n'a pas besoin d'être malveillant pour que l'effet se produise. Il suffit qu'il optimise ce qu'il est payé pour faire, ce qui est le comportement normal d'un fournisseur sous contrat.\n\n**Retarder l'escalade quand elle est incertaine.** Une escalade exonère la facture ; attendre un tour de plus a une valeur positive pour le fournisseur.\n\n**Formuler une réponse plausible plutôt qu'avouer une lacune.** L'aveu conduit à l'escalade, donc à la non-facturation.\n\n**Allonger le délai avant de proposer un humain.** Même mécanisme, appliqué au parcours.\n\nAucun des trois ne se voit dans le décompte mensuel, et aucun ne suppose une intention de nuire. C'est ce qui les rend durables."
      },
      "contre-mesure": {
        title: "La seule contre-mesure",
        body: "Un compteur au résultat n'a de sens que s'il est accompagné d'**au moins une mesure des dimensions muettes, tenue par l'acheteur**.\n\nQuatre indicateurs suffisent, et aucun ne demande la coopération du fournisseur : le taux de réouverture au-delà de la fenêtre, le taux de recontact par un autre canal, l'exactitude mesurée sur un échantillon tiré par l'acheteur, la satisfaction mesurée hors du canal du fournisseur.\n\nCes mesures ne servent pas à réduire la facture. Elles servent à savoir ce qu'on a acheté, et elles sont la seule réponse opérationnelle au résultat de 1991. Sans elles, l'incitation existe, elle agit, et personne ne la pilote.\n\nC'est la décision D6, et c'est la moins chère du dossier."
      }
    }
  },
  "schema-05": {
    title: "Où va vraiment la variance",
    regions: {
      "achat-jeton": {
        title: "Ce que le fournisseur achète",
        body: "Du calcul, facturé au jeton, sur un compteur qui monte. Gartner anticipe un coût d'inférence **par flux agentique** multiplié par plus de cinq d'ici 2028 [1].\n\nLa cause n'est pas le prix du jeton, qui baisse. C'est l'allongement des chaînes d'exécution : plus d'appels d'outils, plus d'allers-retours de raisonnement, plus de contexte relu à chaque tour, pour une tâche de périmètre constant.\n\nL'effet sur un contrat au résultat est direct. Le fournisseur a garanti un prix de sortie sur un coût d'entrée qu'il ne maîtrise pas et dont la trajectoire attendue est haussière. Cette tension est la donnée de base pour anticiper ce qui arrivera au contrat à son premier renouvellement."
      },
      "vente-resultat": {
        title: "Ce que le fournisseur vend",
        body: "Un résultat, à prix unitaire fixe et annoncé : 1,50 $ la résolution automatisée, 0,99 $ le résultat, selon les offres [5][6][7].\n\nC'est l'argument de vente, et il est présenté comme un partage de risque. Il peut l'être réellement. Il peut aussi ne l'être pas du tout, et la différence ne se lit pas dans la grille tarifaire.\n\nL'adoption réelle invite à la prudence : 19 % des acheteurs de services et 13 % des accords côté vendeur utilisent ce type d'arrangement, et Gartner projette moins de 25 % des contrats de services d'ici 2031 [4]. Le même analyste décrit l'essor du modèle comme davantage du bruit que de la réalité.\n\nL'argument se vérifie, il ne se déclare pas : les trois voies de reprise du schéma disent comment."
      },
      "plancher-engagement": {
        title: "Voie 1 · Le plancher d'engagement",
        body: "Le tarif unitaire bas est consenti contre un volume minimum garanti. L'acheteur paie le plancher qu'il atteigne ou non le volume.\n\nLe contrat redevient alors un forfait, habillé en tarification au résultat, et l'acheteur a payé un supplément de complexité contractuelle pour un transfert de risque nul.\n\n**Le test se fait en une division** : le plancher rapporté au volume prévisionnel. S'il en représente l'essentiel, le fournisseur ne porte aucun risque — et c'est à ce moment-là que la question de Coshow devient opérante.\n\nLe plancher n'est pas illégitime : un fournisseur qui engage des coûts de mise en service a besoin d'une assiette. Ce qui compte est de savoir ce qu'on achète, et de le dire dans la note de cadrage plutôt que de le découvrir au comité d'engagement."
      },
      "redefinition-unite": {
        title: "Voie 2 · La redéfinition de l'unité",
        body: "La voie la plus silencieuse, et celle contre laquelle presque aucun contrat ne protège.\n\nLa règle de comptage n'étant presque jamais annexée, elle peut être ajustée du côté du fournisseur sans que l'acheteur dispose d'un recours. Passer une fenêtre de silence de soixante-douze à vingt-quatre heures augmente mécaniquement le nombre de résolutions facturées, à comportement client rigoureusement inchangé.\n\nAucune hausse de tarif n'est notifiée. Aucune clause n'est violée. La facture monte, et le coût unitaire affiché n'a pas bougé.\n\nL'effet collatéral est pire que la hausse : la série budgétaire perd sa comparabilité d'un trimestre à l'autre, et personne ne le sait. Un responsable qui compare deux trimestres peut constater une amélioration qui est un changement d'unité de mesure."
      },
      "retour-credit": {
        title: "Voie 3 · Le retour au descriptif",
        body: "Abandonner le résultat et facturer l'action : 20 crédits, 0,10 $, un fait technique horodaté et vérifiable [8].\n\nC'est la voie la plus honnête des trois, et celle qu'a empruntée l'acteur le plus volumineux du relevé. Elle dit que le fournisseur facture son activité et non son résultat, et elle laisse à l'acheteur la charge de mesurer la valeur.\n\nElle a aussi une vertu que les deux précédentes n'ont pas : elle est **vérifiable**. Un compteur d'actions se recoupe avec les journaux d'exécution, ce qui n'est pas vrai d'une présomption de résolution.\n\nPour l'acheteur, la conséquence pratique est la décision D2 : sur un périmètre où la qualité se mesure mal, un compteur descriptif plus une mesure de valeur tenue en interne expose à moins de déformation qu'un compteur au résultat dont il ne contrôle pas la définition."
      }
    }
  },
  "schema-06": {
    title: "Six décisions, et la fenêtre où chacune reste possible",
    regions: {
      "avant-ao": {
        title: "Fenêtre 1 · Avant l'appel d'offres",
        body: "Deux décisions qui ne coûtent rien et qui déterminent tout le reste.\n\n**D1 · Exiger la règle de comptage comme pièce du dossier de candidature.** Formulée comme une question du cahier des charges et non comme une demande en négociation : définition exacte de l'événement facturable, durée de la fenêtre en heures, liste des événements exonérés, traitement de la réouverture. Un fournisseur qui ne répond pas à ce stade ne répondra pas davantage une fois choisi.\n\nC'est la seule décision qui mette les quatre offres du relevé sur une grille comparable, et elle ne concède rien sur le prix.\n\n**D2 · Décider si l'on veut un compteur interprétatif.** La question précède le choix du fournisseur. Sur un périmètre où la qualité se mesure mal, le compteur à l'action expose à moins de déformation [10]."
      },
      "signature": {
        title: "Fenêtre 2 · À la signature",
        body: "Trois clauses, et la fenêtre se referme définitivement derrière elles.\n\n**D3 · Annexer la règle de comptage, versionnée, avec préavis sur modification.** Toute modification de l'annexe vaut modification tarifaire. C'est la clause qui transforme une variance de définition en variance négociée, et elle ferme la deuxième voie de reprise du schéma précédent.\n\n**D4 · Stipuler la restitution du détail du comptage et sa rétention.** Une ligne par événement facturé, horodatée, avec identifiant de conversation, événement déclencheur retenu et version de l'agent en service. Le droit d'audit se rédige dans la **même clause** que l'obligation de rétention [9].\n\n**D5 · Stipuler le plafond de dépense et le comportement au plafond.** En montant et non en volume, avec la conduite du système décrite au contrat : bascule vers l'humain, file d'attente ou refus."
      },
      "exploitation": {
        title: "Fenêtre 3 · Dès le premier jour de production",
        body: "**D6 · Tenir soi-même la mesure des dimensions muettes.**\n\nQuatre indicateurs : taux de réouverture au-delà de la fenêtre, taux de recontact par un autre canal, exactitude sur échantillon tiré par l'acheteur, satisfaction mesurée hors du canal du fournisseur.\n\nTrois raisons d'en faire le premier geste de la mise en service plutôt qu'une bonne pratique parmi d'autres. Elle ne demande l'accord de personne à l'extérieur. Elle ne coûte qu'un relevé périodique sur des données que l'acheteur détient déjà. Et elle est irrattrapable après coup : **un historique de douze mois ne se reconstitue pas.**\n\nC'est exactement l'historique qu'il faut produire le jour où l'on veut contester un décompte ou renégocier un palier. Sans lui, l'acheteur n'a qu'une impression à opposer au compteur du fournisseur."
      },
      "d-gratuite": {
        title: "Les deux décisions à coût nul",
        body: "D1 et D6 ne coûtent rien et sont les plus rentables du dossier. Elles ont la même propriété, et c'est aussi ce qui les rend irrattrapables : **elles produisent un historique.**\n\nD1 produit l'historique de ce que le fournisseur a écrit avant d'être choisi, au moment où il avait encore intérêt à répondre. Après la signature, la même question obtient une réponse commerciale.\n\nD6 produit l'historique de ce que le service a réellement rendu, mois après mois, sur des données que l'acheteur détient déjà. Après douze mois de silence, ces mois sont perdus.\n\nLa fenêtre se referme vite. Le parc d'applications dotées d'agents passe, selon Gartner, de moins de 5 % en 2025 à 40 % fin 2026 [3] : les contrats se signent plus vite qu'ils ne se renégocient, et une règle de comptage non annexée à la signature ne le sera pas en cours d'exécution."
      }
    }
  }
}
