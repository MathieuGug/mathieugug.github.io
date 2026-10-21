{
  "schema-01": {
    title: "Trois régimes d'accès, un seul sans procédure",
    regions: {
      "regime-art15": {
        title: "Article 15 · la description auditée du profilage",
        body: "Le contrôleur d'accès remet à la Commission, dans les six mois de sa désignation, une description de ses techniques de profilage **auditée de façon indépendante**, révisée au moins une fois par an [1].\n\nLa Commission n'a pas laissé le principe seul : son modèle de rapport fixe l'identité du déclarant, les informations minimales, le déroulé de l'audit, et l'évaluation par l'auditeur du caractère complet et exact de la description avec un niveau d'assurance raisonnable [2]. Le document peut être transmis au Comité européen de la protection des données.\n\nC'est le régime le plus outillé des trois, et il porte sur l'objet le plus sensible."
      },
      "regime-dsa40": {
        title: "Article 40 · l'accès des chercheurs agréés",
        body: "Le règlement sur les services numériques ouvre aux chercheurs l'accès à des données non publiques des très grandes plateformes. Là encore, le principe ne suffisait pas : un acte délégué entré en vigueur le 29 octobre 2025 a installé la mécanique complète [3].\n\nTrois éléments méritent d'être retenus par un annonceur. La vérification des demandeurs est confiée aux coordinateurs nationaux des services numériques, et non aux plateformes. Les types et formats de données recevables sont définis. Et l'instruction passe par un portail central plutôt que par une négociation bilatérale.\n\nUn annonceur n'a aucun de ces trois éléments."
      },
      "regime-art68": {
        title: "Article 6(8) · les outils de mesure publicitaire",
        body: "La disposition la plus favorable qu'un annonceur ait jamais obtenue sur la mesure : accès aux outils de mesure de la performance du contrôleur d'accès et aux données nécessaires pour faire tourner ses propres outils de vérification, sur demande, gratuitement, en données agrégées comme non agrégées [1].\n\nCe que le texte ne dit pas : la forme, la maille, le format, le délai, et qui arbitre en cas de désaccord.\n\nEn quatre ans, aucune décision de non-conformité publiée n'a porté sur cette disposition [11]. Un droit que personne n'a encore fait appliquer est un argument de négociation faible."
      },
      "ligne-produit": {
        title: "Ce que chaque régime produit réellement",
        body: "C'est la ligne qui tranche. Le régime du profilage produit un **document** : normalisé, signé par un auditeur, daté, révisé. Le régime de la recherche produit un **jeu de données** : types et formats définis, instruction tracée.\n\nLe régime de la mesure publicitaire produit un **accès**. Un accès n'est ni un document ni un jeu de données : c'est une possibilité dont la forme reste à la main de celui qui l'ouvre.\n\nLa conséquence pratique pour l'annonceur : la forme de la restitution ne lui sera pas donnée par le droit. Il doit l'écrire lui-même, et c'est l'objet des quatre paramètres du schéma 4."
      },
      "verdict": {
        title: "Ce que la comparaison établit",
        body: "Le législateur européen sait exiger un document audité, et sait construire une procédure d'accès. Dans les deux cas, il ne l'a pas fait pour l'annonceur.\n\nIl faut dire pourquoi sans supposer de malveillance. Les articles 15 et 40 protègent des intérêts diffus, ceux des personnes concernées et de la recherche publique, qui n'ont pas de contrepartie contractuelle. L'annonceur, lui, est un client : le législateur a posé une garantie de plancher et laissé le reste à la négociation.\n\nLe raisonnement n'est pas absurde. Il suppose seulement que l'annonceur écrive la clause, et l'étude de 2023 montre qu'il ne l'écrit presque jamais [4]."
      }
    }
  },
  "schema-02": {
    title: "Trois murs devant l'audit de la méthode",
    regions: {
      "mur-confidentialite": {
        title: "Mur 1 · Le plancher de confidentialité",
        body: "Les salles blanches n'écartent pas les questions sensibles : elles écartent les réponses trop fines. La documentation impose un nombre minimal d'utilisateurs par ligne de résultat — dix pour les requêtes limitées aux clics et aux conversions, cinquante pour les autres types — et supprime les lignes qui n'atteignent pas le seuil [5].\n\nUn rattrapage existe, le résumé de lignes filtrées, qui agrège en une ligne tout ce qui a été écarté. Il ne couvre pas les requêtes d'audience et n'est pas actif par défaut pour les requêtes créées par interface de programmation.\n\nConséquence : les campagnes à petit budget ou à ciblage étroit disparaissent du résultat avant d'avoir été analysées. Or auditer une méthode suppose d'éprouver ses cas limites."
      },
      "mur-juge-partie": {
        title: "Mur 2 · Juge et partie, sans arbitre",
        body: "L'organisme d'accréditation de la place résume son périmètre en cinq domaines : visibilité, trafic invalide sophistiqué, audience, sûreté de marque, résultats. Il précise que ce résumé ne reflète pas le périmètre complet de chaque plateforme et que seules les lettres d'accréditation font foi ; sa politique de 2024 attend des services qu'ils énoncent ce qui est couvert et, dans certains cas, ce qui ne l'est pas [10].\n\nLa mesure du lift n'y figure pas. L'annonceur qui demande un audit tiers de la modélisation demande donc un service qu'aucune institution de place ne rend aujourd'hui.\n\nLa cartographie de ceux qui mesurent pour le compte de ceux qui vendent est traitée dans un dossier antérieur [12]."
      },
      "mur-puissance": {
        title: "Mur 3 · Le signal n'y est pas",
        body: "Sur vingt-cinq expériences de terrain représentant 2,8 millions de dollars de dépense, l'intervalle de confiance médian sur le retour dépasse cent points de pourcentage [9]. La cause est mécanique : le coefficient de variation des ventes individuelles rapporté au coût publicitaire par personne atteint couramment un ordre de grandeur de dix. Les auteurs estiment qu'une expérience informative peut exiger plus de dix millions de personnes-semaines.\n\nLa conséquence pour notre sujet est rarement tirée : **même avec un accès intégral aux données brutes**, l'annonceur ne pourrait pas départager deux méthodes de modélisation sur un trimestre de campagne. L'audit de méthode se heurte à un manque de signal avant de se heurter à un refus d'accès."
      },
      "consequence": {
        title: "Ce qu'il faut en tirer pour rédiger",
        body: "Les trois murs sont indépendants : lever l'un ne lève pas les autres. Un fournisseur entièrement coopératif laisserait les trois en place.\n\nD'où la conclusion de rédaction. Une clause qui exige l'audit de la méthode ne produit pas un droit : elle produit une négociation enlisée, puis un refus que le fournisseur justifiera par la protection des données — et il aura raison sur ce point précis.\n\nLa sortie est de demander autre chose : non la méthode, mais les quatre paramètres qui disent ce que la méthode a coûté. Part modélisée, seuil de non-réponse, délai et format, recours. Chacun se vérifie sans accéder à la méthode, et c'est l'objet du schéma 4."
      }
    }
  },
  "schema-03": {
    title: "Ce qui est déjà publié, et que personne ne demande",
    regions: {
      "publie-defaut": {
        title: "Zone 1 · publié par défaut, coût de négociation nul",
        body: "Le cas le plus instructif est l'impact du mode consentement, défini par la plateforme comme le rapport des conversions modélisées aux conversions observées, par couple domaine-pays [7]. C'est une **part modélisée publiée** : l'annonceur en dispose déjà sans rien négocier.\n\nLa même documentation publie les seuils d'activation : de l'ordre de sept cents clics sur sept jours par regroupement pays-domaine côté Google Ads, une centaine de clics par jour côté Search Ads 360. En dessous, la modélisation ne s'active pas, et certaines mailles ne sont pas restituées lorsque l'apport est faible.\n\nPeu de plans de mesure suivent ces indicateurs dans le temps. Encore moins les font figurer dans les comptes rendus remis à la direction générale."
      },
      "sur-demande": {
        title: "Zone 2 · l'écart exploitable",
        body: "C'est ici que se joue le contrat de mesure. Trois objets y sont particulièrement accessibles.\n\nL'**export vers les outils de l'annonceur** : un fournisseur qui a écrit à la Commission que l'export fait partie de son obligation au titre de l'article 6(8) ne peut pas, en négociation, le traiter comme une faveur commerciale [8]. Le rapport de conformité est une pièce utilisable en pré-contractuel.\n\nLe **résumé de lignes filtrées** nommé comme livrable obligatoire plutôt que comme option [5]. Sans lui, les totaux ne se réconcilient pas et l'annonceur ne sait pas combien de ses données ont disparu.\n\nLa **notification préalable** de tout changement de seuil ou de définition d'indicateur. C'est la clause pivot du dossier."
      },
      "jamais": {
        title: "Zone 3 · ce qui ne s'obtient pas",
        body: "Les poids du modèle, la liste des variables explicatives retenues, la procédure de calibration, l'historique des réentraînements, les paramètres du dispositif d'attribution propriétaire. Rien de cela n'est publié, et rien ne sera communiqué.\n\nLes trois murs du schéma 2 expliquent pourquoi, et deux de ces raisons ne sont pas des refus commerciaux : le plancher de confidentialité traduit une obligation de protection des données, et le manque de puissance statistique rendrait l'information inexploitable même si elle était remise.\n\nLe point de rédaction : une clause bien écrite ne demande jamais un objet de cette zone. Une clause qui en demande un donne au fournisseur le moyen de refuser l'ensemble du paquet."
      },
      "ecart": {
        title: "La règle de rédaction",
        body: "Une clause utile ne demande rien à la zone 3. Elle **verrouille** la zone 1 et **conquiert** la zone 2.\n\nVerrouiller la zone 1 veut dire transformer une publication unilatérale en engagement contractuel. Ce que la plateforme publie aujourd'hui sans engagement, elle peut cesser de le publier demain sans préavis : l'inscrire au contrat coûte très peu et change le régime juridique de la donnée.\n\nConquérir la zone 2 se fait ligne par ligne, dans l'ordre de coût croissant du schéma 4. Un annonceur qui ouvre la négociation par la zone 3 obtient un refus global ; un annonceur qui l'ouvre par la zone 1 obtient trois acquis avant d'arriver au point dur."
      }
    }
  },
  "schema-04": {
    title: "Anatomie de la clause de restitution",
    regions: {
      "param-part-modelisee": {
        title: "P1 · La part modélisée",
        body: "Pour chaque indicateur facturé ou utilisé en pilotage : la proportion issue d'une modélisation et celle issue d'une observation directe, à la maille du rapport remis. C'est un chiffre, et non une méthode.\n\nLa demande n'est pas inédite : elle est déjà publiée dans un cas, sous le nom d'impact du mode consentement [7]. Cela en fait un précédent opposable plutôt qu'une exigence maison.\n\nSa valeur de pilotage est double. Elle dit à partir de quel moment une variation de performance peut venir d'un changement de modèle plutôt que d'un changement de marché. Et elle permet de **dater** les ruptures de série, ce qu'aucune autre donnée ne permet."
      },
      "param-seuil": {
        title: "P2 · Le seuil de non-réponse — la clause pivot",
        body: "La publication des seuils en dessous desquels le fournisseur ne restitue plus rien, et la **notification préalable** de leur évolution. Trois seuils sont visés : activation de la modélisation, nombre minimal d'utilisateurs par ligne de résultat, apport minimal en dessous duquel une maille n'est pas rapportée.\n\nLa clause ne crée pas d'obligation nouvelle de documentation : ces seuils sont déjà publics [5][7]. Elle crée une obligation de notification quand ils bougent, ce qui est tout autre chose.\n\nSans elle, l'annonceur confond une absence de donnée avec une absence d'effet. C'est l'erreur de lecture la plus coûteuse d'un plan de mesure, et la seule qui se corrige par une ligne de contrat."
      },
      "param-delai": {
        title: "P3 · Le délai et le format",
        body: "Niveau de granularité remis, format, fréquence, délai de mise à disposition, durée de conservation côté fournisseur. Le niveau se tranche avant la signature et fait l'objet du schéma 5 ; les autres éléments sont des variables de service.\n\nOrdre de grandeur raisonnable, observé dans les contrats qui comportent déjà une clause de ce type : remise mensuelle sous quinze jours ouvrés, conservation de treize mois pour permettre une comparaison annuelle, format tabulaire documenté dont les colonnes ne changent pas sans notification.\n\nUn ajout peu coûteux et souvent oublié : les **variables de contrôle** fournies par la plateforme au modèle interne entrent dans le même périmètre, à la même maille et sous le même régime."
      },
      "param-recours": {
        title: "P4 · Le recours",
        body: "Ce qui se déclenche quand rien n'est remis. Le schéma 6 détaille les quatre étages disponibles et leur délai réaliste.\n\nLe point de rédaction tient en une phrase : un paramètre sans recours est une déclaration d'intention. Les trois premiers paramètres n'ont de valeur que si le quatrième existe.\n\nC'est aussi le seul des quatre qui ait un prix pour le fournisseur, d'où l'ordre de négociation. La part modélisée est un calcul qu'il fait déjà. Les seuils sont une documentation qu'il publie déjà. Le délai et le format sont un engagement de service. Ouvrir par le recours produit un refus global ; l'atteindre en quatrième position produit trois acquis avant le point dur."
      }
    }
  },
  "schema-05": {
    title: "L'échelle de granularité se tranche avant de signer",
    regions: {
      "niveau-journal": {
        title: "Niveau 1 · Le journal d'événements",
        body: "Une ligne par impression, par clic, par conversion, avec ses identifiants techniques. Le seul niveau qui permette une réconciliation financière indépendante et une vérification de la chaîne d'approvisionnement.\n\nC'est aussi le seul niveau qui permette de **contredire le fournisseur sur son propre chiffre**, et c'est celui que les contrats n'accordent presque jamais : sur soixante-sept annonceurs volontaires d'une étude de place, quarante-six n'ont pas pu obtenir leurs journaux [4].\n\nL'étude britannique conduite avec PwC donne le contrepoint : environ 15 % de la dépense non attribuable en 2020, ramenés à environ 3 % dans la seconde édition [6]. L'opacité recule quand un audit financier est organisé."
      },
      "niveau-salle-blanche": {
        title: "Niveau 2 · La salle blanche",
        body: "L'annonceur apporte ses données, interroge celles du fournisseur, et reçoit des résultats agrégés. Le niveau le plus répandu et le plus mal compris.\n\nIl permet de trancher le recoupement d'audience, la séquence d'exposition, la contribution par segment. Il ne permet pas la réconciliation financière, et il est entièrement gouverné par le plancher de confidentialité : seuils par ligne, suppression des lignes insuffisantes, interdiction de désagréger [5].\n\nPoint de rédaction précis : quand ce niveau est retenu, la clause doit nommer le résumé de lignes filtrées comme **livrable obligatoire**. Sans lui, les totaux ne se réconcilient pas et l'annonceur ignore combien de ses données ont été écartées."
      },
      "niveau-flux": {
        title: "Niveau 3 · Le flux agrégé",
        body: "Une table périodique à une maille convenue — jour, zone géographique, campagne — destinée à alimenter un modèle de contribution interne.\n\nC'est le niveau juste pour la plupart des usages de pilotage budgétaire, et le plus facile à obtenir, parce qu'il correspond à ce que les plateformes produisent déjà pour alimenter les modèles de mix média [13].\n\nLe piège est dans la maille. Un flux hebdomadaire sans découpage géographique ne permet aucune calibration par expérimentation, ce qui retire au modèle interne la seule chose qui le rendait crédible. La maille se négocie donc avec autant de soin que le niveau lui-même."
      },
      "niveau-tableau": {
        title: "Niveau 4 · Le tableau de bord",
        body: "La console du fournisseur, consultée par un humain. Ce barreau ne restitue rien.\n\nIl n'autorise aucune reprise de l'analyse hors de l'environnement du fournisseur et ne laisse aucune trace opposable. Deux conséquences se cumulent : l'entreprise ne peut pas vérifier un chiffre qu'elle contesterait, et elle perd l'intégralité de sa série historique au changement de régie.\n\nUne organisation qui s'en tient là n'a pas de plan de mesure : elle a un abonnement. Le constat est sévère mais il se vérifie simplement — il suffit de demander à l'équipe de mesure de reproduire hors console un chiffre du dernier compte rendu."
      },
      "annotation-ana": {
        title: "Ce que l'étude de 2023 a réellement mesuré",
        body: "Une analyse au niveau du journal portant sur 123 millions de dollars de dépense, vingt et un annonceurs et trente-cinq milliards d'impressions. Soixante-sept entreprises s'étaient portées volontaires ; quarante-six ont rencontré un obstacle juridique ou n'ont pas pu obtenir leurs journaux auprès de leurs plateformes d'achat, de vente ou de vérification [4].\n\nEt sur ces soixante-sept, un peu plus de la moitié seulement disposaient d'un accès direct par leur **propre** contrat, le reste passant par celui de leur agence.\n\nC'est le cœur empirique du dossier. L'obstacle n'est ni technique ni réglementaire : il est contractuel, et il se manifeste plusieurs années après la signature, au moment précis où l'entreprise ne peut plus le corriger."
      }
    }
  },
  "schema-06": {
    title: "Le recours, étage par étage",
    regions: {
      "etage-credit": {
        title: "Étage 1 · Le crédit de service",
        body: "Une pénalité contractuelle modeste, déclenchée automatiquement par le dépassement du délai de remise.\n\nSon intérêt n'est pas financier : il est documentaire. Un crédit de service appelé crée une **trace datée** du manquement, et cette trace est ce qui rend les trois étages suivants utilisables. Un audit sans historique de manquements n'a pas de point de départ ; une réallocation de budget sans trace écrite se discute en réunion plutôt qu'en comité.\n\nC'est la clause la moins cher payée de toute la liste, et la plus souvent oubliée. Son montant peut être symbolique sans rien perdre de sa valeur, ce qui en fait aussi la plus facile à obtenir."
      },
      "etage-audit": {
        title: "Étage 2 · Le droit d'audit",
        body: "Le modèle de contrat d'achat média de l'association américaine des annonceurs, version de juin 2023, distingue deux objets que les praticiens traitaient déjà séparément : l'audit de conformité et l'audit de performance. Il ouvre un droit de transparence sur les prestations non transparentes achetées sans autorisation en bonne forme, et ajoute une annexe de données de transaction énumérant ce que l'agence doit obtenir des fournisseurs pour le compte de l'annonceur [14].\n\nCe modèle n'oblige personne — l'association le présente comme un point de départ à adapter. Sa vertu est ailleurs : il existe, il est public, et il est l'œuvre des acheteurs. Demander une clause de place est plus facile que défendre une rédaction maison."
      },
      "etage-regulateur": {
        title: "Étage 3 · Le régulateur",
        body: "La plainte pour manquement à l'article 6(8) est l'étage dont on parle le plus, et celui qu'il faut manier avec le plus de prudence. Trois raisons : il ne vise que les contrôleurs d'accès désignés, ce qui laisse hors champ la majorité des fournisseurs d'un plan média ; aucune décision publiée n'a encore porté sur cette disposition [11] ; et le calendrier d'une procédure européenne n'a aucun rapport avec celui d'une revue budgétaire.\n\nIl garde une valeur par **anticipation**. L'instruction d'une plainte produit un échange documenté entre la plateforme et la Commission, et une plateforme déjà sanctionnée dans la technologie publicitaire [15] n'a pas intérêt à multiplier les refus écrits d'accès aux données de mesure."
      },
      "etage-budget": {
        title: "Étage 4 · La réallocation du budget",
        body: "Le seul recours qui ne dépende pas de l'accord du fournisseur, le seul dont le délai soit maîtrisé par l'annonceur, et le seul qui se chiffre sans incertitude.\n\nIl a une condition d'exercice unique, et elle est organisationnelle plutôt que juridique : la personne qui constate le manquement de restitution doit avoir un accès direct à celle qui arbitre la répartition du budget média.\n\nDans beaucoup d'organisations, l'équipe de mesure rend compte à une direction qui n'arbitre pas les investissements. Le recours existe sur le papier et n'est jamais exercé. C'est la seule disposition du dossier qui se prend sans négocier avec personne, et elle est gratuite."
      }
    }
  },
  "schema-07": {
    title: "Six clauses, trois moments",
    regions: {
      "moment-avant": {
        title: "Avant de signer · trois clauses",
        body: "Les trois clauses de ce moment portent sur la part modélisée, les seuils, et le trio granularité / format / conservation.\n\nCe qui les réunit : elles sont **irrattrapables après la signature**. Le niveau de granularité ne se renégocie pas en cours de contrat, parce qu'il détermine la tarification du service et l'architecture de la livraison. Une entreprise qui découvre à l'occasion d'un audit qu'elle n'a pas de titre d'accès à ses journaux ne peut pas corriger la situation dans le délai de l'audit [4].\n\nLa question qui organise ce moment : quelles questions l'entreprise veut-elle pouvoir trancher **elle-même** pendant toute la durée du contrat ? Le schéma 5 donne la correspondance."
      },
      "moment-exploitation": {
        title: "En exploitation · deux clauses",
        body: "Le crédit de service sur le délai de remise, et le droit d'audit distingué.\n\nCe qui les réunit : elles produisent la **preuve datée**. Le crédit de service documente le manquement au fil de l'eau ; le droit d'audit permet d'en faire un constat contradictoire. L'un sans l'autre perd l'essentiel de sa valeur — un audit sans historique de manquements n'a pas de point de départ, et un historique sans droit d'audit n'a pas de débouché.\n\nLeur coût de négociation est faible à moyen, et le second bénéficie d'un modèle de place public rédigé par les acheteurs [14], ce qui déplace la discussion d'une rédaction maison vers un standard de marché."
      },
      "moment-sortie": {
        title: "À la sortie · une clause",
        body: "La restitution terminale et la conservation post-contractuelle : remise finale de l'historique complet au niveau convenu, dans un délai fixé, et accès en lecture maintenu pendant une période déterminée.\n\nC'est le point dur de la négociation, et c'est l'équivalent pour la mesure de la clause de sortie qu'on écrit pour une plateforme technique [16].\n\nL'enjeu est une série temporelle. Un historique de mesure qu'on ne peut pas emporter rend la comparaison avec le fournisseur suivant impossible et transforme un changement de régie en remise à zéro. Le coût de cette remise à zéro n'apparaît jamais dans la décision de signature, et il apparaît toujours dans la décision de partir."
      },
      "clause-pivot": {
        title: "La clause pivot · publication et notification des seuils",
        body: "Le fournisseur publie les seuils en dessous desquels il ne restitue pas de donnée, et notifie leur évolution **avant** application.\n\nPourquoi elle est pivot. Son coût apparent est quasi nul, puisque ces seuils sont déjà documentés publiquement [5][7] : la clause n'ajoute qu'une obligation de notification. Et sa valeur probatoire est maximale, parce qu'elle est la seule qui protège contre l'erreur de lecture la plus fréquente d'un plan de mesure, qui consiste à prendre une maille non restituée pour une maille sans effet.\n\nElle convertit une absence silencieuse en information disponible. C'est aussi la clause par laquelle ouvrir la négociation, parce qu'un refus de notifier un changement de seuil est difficile à justifier par écrit."
      }
    }
  }
}
