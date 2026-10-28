{
  "schema-01": {
    title: "Le compte rendu dit combien, le journal dit quoi",
    regions: {
      "niveau-agregat": {
        title: "Niveau 1 · L'agrégat de facturation",
        body: "Un montant, une période, un volume d'impressions, parfois un prix unitaire moyen.\n\nC'est le socle que le droit français impose depuis le 1er janvier 2018 au vendeur d'espace : dates et emplacements de diffusion, prix global de la campagne, prix unitaire de l'espace facturé [7].\n\n**Ce que ce niveau autorise.** Payer la facture, la justifier devant un contrôle de gestion, comparer deux périodes.\n\n**Ce qu'il interdit de constater.** Tout le reste. Un agrégat de facturation est compatible avec n'importe quelle réalité d'achat sous-jacente : le même montant peut correspondre à un inventaire choisi ou à quarante mille sites inconnus."
      },
      "niveau-placement": {
        title: "Niveau 2 · Le rapport de placement",
        body: "Une liste de domaines ou d'applications, avec pour chacun un volume d'impressions et un coût. C'est le niveau que les plateformes mettent spontanément à disposition, et celui que la plupart des annonceurs appellent « avoir accès à la donnée ».\n\n**Son apport réel.** Il autorise l'exclusion d'un emplacement, après l'avoir payé.\n\n**Sa limite structurelle.** Il reste un agrégat : le regroupement est choisi par celui qui le produit, et les regroupements ne se recoupent pas. La somme des impressions par site ne dit rien du chemin d'approvisionnement, et la somme par chemin ne dit rien des sites. On ne peut pas recalculer selon une dimension que le producteur n'a pas prévue."
      },
      "niveau-journal": {
        title: "Niveau 3 · Le journal d'impressions",
        body: "Une ligne par impression servie : horodatage, identifiant d'enchère, domaine ou application servi, chemin d'intermédiaires, prix facturé, et selon les fournisseurs tout ou partie des frais prélevés à chaque étage.\n\nC'est le seul niveau à partir duquel on peut recalculer autre chose que ce qui a été calculé pour vous.\n\n**L'appui juridique existe, partiellement.** L'article 6 § 8 du règlement sur les marchés numériques impose la mise à disposition gratuite des données nécessaires à une vérification indépendante, données non agrégées comprises [8]. Il ne vise que les services désignés des contrôleurs d'accès désignés, ce qui laisse entiers les étages intermédiaires de la chaîne."
      },
      "ce-qui-manque": {
        title: "La case vide",
        body: "Le journal existe déjà. La facturation en est dérivée : un système qui facture à l'impression tient nécessairement la trace de chaque impression facturée.\n\nCe qui manque est le droit de le recevoir, dans un format et un délai choisis par l'acheteur.\n\n**Pourquoi cette formulation compte en négociation.** Tant que l'annonceur demande au fournisseur de « produire un fichier », il demande un développement, et la réponse est un devis ou un refus. Quand il demande la restitution d'un fichier existant, il demande une clause, et la discussion porte sur le format, le rythme et la rétention."
      }
    }
  },
  "schema-02": {
    title: "Où va l'euro média",
    regions: {
      "couts-transaction": {
        title: "−29 · Les coûts de transaction",
        body: "Sur 100 unités de dépense programmatique, 29 sont absorbées par la chaîne avant d'atteindre l'éditeur, et 71 l'atteignent [1].\n\nCes 29 points se répartissent entre plateforme d'achat, places de marché traversées, prestataires de vérification et frais technologiques intermédiaires. Le journal est le seul instrument qui permette d'en répartir le détail, et encore : seulement dans la limite de ce que chaque acteur consent à renseigner.\n\n**Point de comparaison.** L'audit britannique de 2020 mesurait 51 % de la dépense parvenant au propriétaire du média, et 65 % deux ans plus tard [5] [6]. Les périmètres diffèrent, mais l'ordre de grandeur de la ponction est cohérent entre les deux marchés."
      },
      "inventaire-fabrique": {
        title: "−10 · L'inventaire fabriqué pour la publicité",
        body: "Des sites dont le modèle économique consiste à produire des emplacements publicitaires en volume plutôt qu'une audience éditoriale.\n\nIls représentaient environ un cinquième des impressions achetées dans l'échantillon de décembre 2023, soit une dizaine de points de la dépense [1].\n\n**La trajectoire est réelle, l'écart de pratiques l'est aussi.** Au deuxième trimestre 2025, l'exposition médiane était tombée à 0,8 %, mais certains annonceurs du même échantillon y consacraient encore jusqu'à 28,7 % de leur dépense [3]. Une médiane basse ne dit rien de sa propre position : seul le journal le dit."
      },
      "non-mesurable": {
        title: "−25 · Non visible, non mesurable, non conforme",
        body: "Le reste des pertes se répartit entre impressions qui n'ont pas atteint le seuil de visibilité, impressions sur lesquelles la mesure n'a pas pu s'exécuter, et impressions servies dans un contexte écarté par les critères de sécurité de marque [1].\n\n**Ce que l'agrégat masque ici.** Ces trois catégories sont mesurées par des prestataires de vérification, qui tiennent leur propre journal. Sans clé de réconciliation entre ce journal et celui de la plateforme d'achat, on obtient un taux de visibilité global et un coût global, sans pouvoir croiser les deux : impossible de savoir quel chemin d'approvisionnement produit l'inventaire le moins visible."
      },
      "media-utile": {
        title: "36 · Le média utile",
        body: "Au bout de la cascade, 36 unités sur 100 atteignent une impression valide, visible, mesurable et servie sur un site qui n'a pas été fabriqué pour la publicité [1].\n\n**La réserve à porter avec le chiffre.** L'échantillon est composé d'annonceurs volontaires, de grande taille, sélectionnés de fait par leur capacité à fournir des journaux. Ce sont les mieux outillés du marché, et le biais joue donc dans le sens de l'optimisme.\n\n**La trajectoire.** L'indice équivalent s'établissait à 36,5 % au deuxième trimestre 2025, en recul par rapport aux 37,8 % du relevé précédent [3]. L'ordre de grandeur est robuste, la décimale ne l'est pas."
      }
    }
  },
  "schema-03": {
    title: "L'expérience quasi naturelle",
    regions: {
      "audit-2020": {
        title: "Audit 2020 · agrégats livrés",
        body: "Données collectées du 1er janvier au 20 mars 2020, auprès de 15 annonceurs, 12 agences, 5 plateformes d'achat, 6 places de marché et 12 éditeurs [5].\n\nSur 267 millions d'impressions identifiées, 31 millions ont pu être appariées de bout en bout, soit 12 %. La dépense non rattachable à un bénéficiaire identifié atteignait 15 %, et 51 % de la dépense parvenait au propriétaire du média.\n\n**Le diagnostic qui commande la suite.** Le cabinet a explicitement désigné l'accès et la qualité des données comme le problème principal, et le résidu non attribuable comme un problème secondaire. Les explications possibles du résidu incluaient les limites des jeux de données, les frais non visibles, l'écrêtage d'enchère et les effets de change."
      },
      "audit-2022": {
        title: "Audit 2022 · journaux livrés",
        body: "Publié en janvier 2023, sur 1,3 milliard d'impressions de 11 annonceurs observées pendant neuf mois [6].\n\nTaux d'appariement à 58 %, et 70 % sur les transactions de marché privé. Dépense non attribuable à 3 %. Part reçue par le propriétaire du média à 65 %.\n\n**Ce que le marché privé ajoute à la lecture.** Un périmètre d'acheteurs invités, avec un inventaire et des conditions négociés à l'avance, s'apparie mieux qu'une enchère ouverte. La structure de la transaction détermine donc la lisibilité du journal autant que le format du fichier, ce qui donne un second levier à l'acheteur : il peut déplacer une part de son achat vers des transactions qui se vérifient."
      },
      "variable-changee": {
        title: "La variable changée",
        body: "L'organisation commanditaire attribue explicitement le saut du taux d'appariement à un fait unique : tous les fournisseurs de la chaîne ont été en mesure de livrer des données de niveau journal plutôt que des agrégats [6].\n\nAucun tarif n'a été renégocié, aucun intermédiaire n'a été retiré de la chaîne, aucune dépense média n'a été engagée pour obtenir ce résultat.\n\n**La conséquence pour un plan de mesure.** Le gain de lisibilité se négocie sur un format de fichier. C'est l'un des rares postes d'un plan média dont le coût est un coût d'ingénierie et de négociation contractuelle, sans arbitrage contre du budget d'achat."
      },
      "limite-echantillon": {
        title: "Ce que la comparaison ne dit pas",
        body: "Ce n'est pas une expérience contrôlée, et il faut le porter pour que la lecture reste honnête.\n\n**Trois différences entre les deux exercices.** Le panel a changé : 15 annonceurs en 2020, 11 en 2022. Le périmètre du second se concentrait sur un univers plus sélectif, qui ne couvre pas la longue traîne du marché. Et la durée d'observation est passée de trois à neuf mois.\n\n**L'instrumentation a changé aussi.** Les équipes du cabinet ont travaillé étroitement avec les plateformes d'achat et les places de marché sur le filtrage et le transfert des données [6]. Une partie du progrès mesuré est un progrès d'appareillage. Cette réserve ne diminue pas la thèse : elle établit que l'appareillage est un actif, donc une décision budgétaire."
      }
    }
  },
  "schema-04": {
    title: "Le trou d'accès est contractuel",
    regions: {
      "volontaires": {
        title: "2023 · 67 volontaires, 21 participants",
        body: "Soixante-sept entreprises membres avaient accepté de participer à l'audit. Vingt et une sont allées au bout [2].\n\n**Pourquoi ce taux de recrutement est le chiffre le plus parlant de l'étude.** Les 46 abandons ne mesurent pas un manque d'intérêt : ces entreprises avaient déjà accepté, à un niveau de direction, de faire auditer leur dépense. Elles se sont arrêtées faute de pouvoir produire la matière.\n\nLe chiffre renseigne donc sur une capacité, et non sur une volonté. Il dit qu'en 2023, deux tiers des grands annonceurs engagés dans une démarche de transparence n'étaient pas en mesure d'y contribuer avec leurs propres données."
      },
      "blocage-juridique": {
        title: "Les motifs déclarés du blocage",
        body: "Deux motifs sont rapportés : des obstacles juridiques, et l'impossibilité d'obtenir les données de journal auprès des plateformes d'achat, des places de marché et des prestataires de vérification [2].\n\n**Ce que ces motifs ne sont pas.** Ils ne sont pas techniques : le fichier est le support de la facturation, et sa livraison relève de l'exploitation courante. Ils ne sont pas davantage réglementaires au sens d'une impossibilité : le second audit britannique s'est tenu sous le même droit que le premier, et son taux d'appariement a quintuplé [5] [6]. La protection des données conditionne la forme de la livraison, sa durée de conservation et son périmètre, sans la rendre impossible."
      },
      "acces-mediatise": {
        title: "52 % d'accès direct, 48 % d'accès médiatisé",
        body: "Parmi les 21 participants, un peu plus de la moitié disposait d'un accès direct aux données de la plateforme d'achat par son propre contrat. Pour les autres, l'accès était médiatisé par le contrat de l'agence [2].\n\n**La conséquence concrète du défaut de qualité de partie.** Quand l'annonceur n'est pas partie au contrat, sa demande traverse un intermédiaire qui est à la fois celui qui exécute l'achat et celui à qui l'on demanderait de produire la pièce permettant de le contrôler.\n\nD'où la décision D2 du dossier : à défaut d'accès direct, la clause de restitution figure dans le mandat d'agence, avec le même niveau de détail que dans un contrat de plateforme."
      },
      "persistance-2025": {
        title: "2025 · 21 journaux complets sur 39",
        body: "Au deuxième trimestre 2025, le relevé trimestriel compte 39 annonceurs participants, dont 21 ont pu fournir des journaux complets [3].\n\nL'ordre de grandeur n'a pas bougé : une moitié environ, deux ans après le premier audit, pendant lesquels le sujet a été largement commenté dans la profession.\n\n**Ce que cette stabilité établit.** Un obstacle qui ne cède pas à l'attention publique ne cède pas non plus aux bonnes pratiques. Il se lève contrat par contrat, au renouvellement, par une clause nommée. C'est la raison pour laquelle ce dossier traite l'accès au journal comme un objet contractuel et non comme un chantier d'outillage."
      }
    }
  },
  "schema-05": {
    title: "Personne ne détient le journal entier",
    regions: {
      "plateforme-achat": {
        title: "Étage 1 · La plateforme d'achat",
        body: "Elle enchérit pour le compte de l'annonceur et porte la facturation. Son journal contient l'enchère remportée, le prix facturé et le chemin d'approvisionnement tel qu'elle le déclare.\n\n**Ce qu'il ne contient pas.** Ce que l'éditeur a effectivement reçu. L'écart entre le prix facturé à l'acheteur et le montant reversé au média est précisément l'objet que l'appariement cherche à établir, et il se trouve de l'autre côté de la première jointure.\n\n**Point contractuel.** C'est l'étage où la clause de restitution a le plus de chances d'aboutir, parce que c'est celui où l'annonceur, ou son agence, est partie au contrat."
      },
      "place-de-marche": {
        title: "Étage 2 · La place de marché",
        body: "Elle met l'inventaire aux enchères côté éditeur, prélève ses frais et reverse le solde. Son journal contient la vente réalisée, le prix reversé et les frais prélevés.\n\n**Ce qu'il ne contient pas.** Ce que l'acheteur a payé en amont. Une place de marché voit la demande qui lui parvient, pas la chaîne qui l'a précédée.\n\n**La difficulté propre à cet étage.** L'annonceur n'est pas son client : l'éditeur l'est. Obtenir ce journal suppose donc soit un accord tripartite, soit le passage par un dispositif d'appariement tiers, soit une structure de transaction qui prévoit l'échange, ce qui explique le meilleur taux d'appariement observé en marché privé [6]."
      },
      "editeur": {
        title: "Étage 3 · Le serveur publicitaire de l'éditeur",
        body: "Il décide, pour chaque emplacement disponible, quelle annonce afficher et dans quel ordre les sources de demande sont consultées. Son journal contient l'emplacement servi, l'ordre d'affichage et le revenu encaissé.\n\n**Ce qu'il ne contient pas.** Le chemin en amont : du point de vue de l'éditeur, une impression arrive d'une source de demande, sans trace des intermédiaires traversés avant elle.\n\n**Pourquoi cet étage a sa propre histoire juridique.** C'est à son niveau qu'ont été constatées les pratiques d'auto-préférence sanctionnées en France en 2021 [9] et la vente liée établie aux États-Unis en 2025 [10]. Les deux décisions portent sur son fonctionnement, non sur son journal."
      },
      "verification": {
        title: "En parallèle · Le prestataire de vérification",
        body: "Il mesure ce qui était visible, mesurable et conforme aux critères de sécurité de marque. Son journal contient ces trois verdicts, impression par impression.\n\n**Ce qu'il ne contient pas.** Le prix payé. C'est l'absence la plus coûteuse de tout le dispositif, parce qu'elle empêche la question la plus utile : quel chemin d'approvisionnement produit l'inventaire le moins visible, au prix le plus élevé.\n\n**Conséquence pratique.** Les trois quarts des pertes de la cascade [1] se trouvent du côté de ce journal, et le prix du côté de celui de la plateforme d'achat. Sans jointure entre les deux, la cascade reste un constat global, non un instrument de pilotage."
      },
      "jointures": {
        title: "Les trois jointures",
        body: "Chaque jointure suppose un identifiant commun permettant de reconnaître la même impression dans deux journaux différents. Le taux d'appariement est le nom de la qualité de ces clés.\n\n**L'ordre de grandeur de l'enjeu.** Il se déplace de 12 % à 58 % selon que les fournisseurs livrent des agrégats ou des journaux [5] [6]. Un annonceur qui ne connaît pas le sien ne sait pas s'il observe sa chaîne ou un échantillon de sa chaîne.\n\n**D'où la décision D4.** Un appariement de référence par an, sur un périmètre restreint, dont le seul objectif est de produire ce taux et de le suivre dans le temps. Sans clé commune, douze journaux ne font pas une chaîne : ils font douze fichiers."
      }
    }
  },
  "schema-06": {
    title: "Ce que le droit produit déjà",
    regions: {
      "decret-2017": {
        title: "9 février 2017 · Le droit français au compte rendu",
        body: "Le décret relatif aux prestations de publicité digitale, en vigueur au 1er janvier 2018, applique au numérique le régime de transparence issu de la loi du 29 janvier 1993, tel que modifié en 2015 [7].\n\n**Ce qu'il donne.** Un compte rendu obligatoire du vendeur d'espace, à deux niveaux, dont un volet renforcé pour le programmatique qui étend l'information à l'univers des sites de diffusion et aux indicateurs d'interaction.\n\n**Ses deux limites structurelles.** Il exclut de son champ les vendeurs établis dans un autre État membre, ce qui laisse hors de portée une part significative de la chaîne. Et il organise un agrégat enrichi, sans droit à la ligne par impression, sans format imposé, sans délai réellement opposable."
      },
      "autorite-2021": {
        title: "7 juin 2021 · La décision sur l'auto-préférence",
        body: "L'Autorité de la concurrence a sanctionné 220 millions d'euros l'auto-préférence d'un acteur dominant entre son serveur publicitaire pour éditeurs et sa place de marché, dans une procédure de transaction où l'entreprise n'a pas contesté les faits [9].\n\n**Ce qu'elle donne.** Des engagements d'interopérabilité du serveur publicitaire avec les places de marché concurrentes, rendus obligatoires pour trois ans.\n\n**Ce qu'elle ne donne pas.** Aucun droit d'accès aux données au profit de l'acheteur. La décision améliore les conditions de concurrence du côté vendeur, ce qui compte pour les éditeurs et laisse l'annonceur exactement où il était quant à la lisibilité de son achat."
      },
      "marches-numeriques": {
        title: "Art. 6 § 8 · Le règlement sur les marchés numériques",
        body: "Le texte le plus proche d'un droit au journal. Le contrôleur d'accès doit fournir aux annonceurs, aux éditeurs et aux tiers qu'ils autorisent, sur demande et gratuitement, l'accès à ses outils de mesure de performance et aux données nécessaires à une vérification indépendante, **données agrégées et non agrégées comprises**, dans des conditions permettant d'utiliser ses propres outils [8].\n\nLes articles 5 § 9 et 5 § 10 y ajoutent une information quotidienne sur les prix et les rémunérations. Le manquement est passible d'une amende pouvant atteindre 10 % du chiffre d'affaires mondial.\n\n**Les deux limites.** Le règlement ne vise que les services désignés des contrôleurs d'accès désignés, et il n'impose aucun format, donc aucune garantie d'appariement avec les journaux des autres étages."
      },
      "jugement-americain": {
        title: "2025 · 2026 · Le contentieux américain",
        body: "Le 17 avril 2025, le tribunal fédéral de Virginie orientale a établi le maintien d'une position monopolistique sur les serveurs publicitaires pour éditeurs et les places de marché de l'internet ouvert, ainsi que le caractère illicite de la vente liée des deux [10].\n\n**Le point qui porte pour un annonceur.** Les demandeurs n'ont pas obtenu la reconnaissance du marché qu'ils proposaient du côté acheteur. Le terrain où se joue l'accès de l'annonceur à ses données est exactement celui où la démonstration n'a pas abouti.\n\n**Les remèdes du 2 septembre 2026.** Les trois remèdes structurels demandés ont été écartés, au profit de remèdes comportementaux avec moniteur et comité technique pour six ans [11]. Opinion pour partie sous scellés, appel annoncé : détail à reprendre sur l'ordonnance définitive."
      },
      "case-vide": {
        title: "La case commune aux quatre",
        body: "Aucun de ces textes ne donne à l'annonceur le droit d'obtenir, dans un format et un délai qu'il a choisis, la ligne par impression de ses propres achats.\n\nLe règlement européen s'en approche, pour une poignée d'acteurs et sans format. Le décret français organise un compte rendu dont il fixe le contenu. Les deux décisions de concurrence portent sur la conduite des acteurs dominants côté vendeur.\n\n**La conséquence opérationnelle.** Le reste se négocie, ce qui veut dire que le reste s'écrit. Un annonceur qui attend que le droit produise ce droit attendra plusieurs cycles de renouvellement de contrat, pendant lesquels il aurait pu l'obtenir par la clause."
      }
    }
  },
  "schema-07": {
    title: "Six décisions, classées par fenêtre",
    regions: {
      "avant-signature": {
        title: "Fenêtre 1 · Avant signature",
        body: "**D1 · Le droit au journal, écrit avec ses six paramètres.** Périmètre énuméré surface par surface, granularité par impression, liste de champs, délai et rythme d'exécution automatique, durées de rétention dans les deux sens, clé de réconciliation. C'est la décision dont tout le reste dépend.\n\n**D2 · L'accès direct, ou la cession du droit d'accès.** À défaut d'être partie au contrat de plateforme, la clause D1 figure dans le mandat d'agence sous forme d'obligation de restitution. Un mandat qui prévoit un compte rendu et pas une restitution de journal reproduit la configuration des 48 % d'accès médiatisé [2].\n\n**D3 · La déclaration annexée des champs non livrables**, avec le motif de chacun et une date. Elle transforme une ambition contractuelle en état des lieux opposable, et donne une base au renouvellement."
      },
      "en-exploitation": {
        title: "Fenêtre 2 · En exploitation",
        body: "Deux décisions internes qui ne demandent l'accord d'aucun tiers.\n\n**D4 · Un appariement de référence par an**, sur un périmètre restreint. L'objectif est de connaître son propre taux d'appariement et de le suivre, sans auditer tout le budget. L'indicateur se déplace de 12 % à 58 % selon la qualité de la livraison [5] [6] : un annonceur qui ne connaît pas le sien ne sait pas s'il observe sa chaîne ou un échantillon.\n\n**D5 · Une liste restreinte de vendeurs, dérivée du journal.** C'est la recommandation principale de l'audit de 2023, qui constatait des campagnes diffusées sur plus de 40 000 sites [1]. La liste doit être tirée du journal de l'annonceur, non d'un classement acheté à un tiers, faute de quoi elle réintroduit à l'étage du choix la dépendance qu'on voulait lever à l'étage de la mesure."
      },
      "en-continu": {
        title: "Fenêtre 3 · En continu",
        body: "**D6 · Un propriétaire nommé du journal, qui n'est pas l'acheteur.** Responsable de la réception du fichier, de son ingestion, du suivi du taux d'appariement, et de l'alerte quand un fournisseur cesse de livrer.\n\n**Pourquoi la séparation.** Le journal est la pièce qui permet de contrôler la qualité d'un achat. Le confier à l'équipe qui réalise cet achat revient à lui demander d'instruire son propre dossier, dans la même configuration que celle décrite pour l'agence.\n\n**Le coût à budgéter avec la clause.** Environ 290 lignes de journal par unité monétaire dépensée, déduites de l'audit de 2023 [1]. Le journal annuel d'un annonceur de taille moyenne est un objet d'ingénierie de la donnée. Une clause obtenue sans budget d'ingestion ne produit rien."
      }
    }
  }
}
