{
  "schema-01": {
    title: "Trois variables sous un seul mot",
    regions: {
      "bcg": {
        title: "Les paliers mérités · le degré de supervision",
        body: "Le cadre organise la montée comme un parcours de promotion : l'agent gagne son autonomie en franchissant des seuils de performance prouvés [8]. Premier palier, le mode fantôme, où l'agent propose et l'humain agit. Dernier palier, l'autonomie complète, humain hors de la boucle, réservée aux environnements où le coût d'une erreur est négligeable.\n\nLe mérite est réel : l'autonomie ne s'accorde plus par décret. Le défaut tient au critère. La **justesse mesurée** est une probabilité d'erreur, et une probabilité ne borne pas une perte. Diviser par dix le taux d'erreur sur un acte irrattrapable ne change pas l'ordre de grandeur de ce qu'on risque.\n\nS'y ajoute le paradoxe du schéma 2 : le critère de montée dégrade la supervision qui sécurisait le palier d'avant."
      },
      "mckinsey": {
        title: "L'autonomie gouvernée · un mécanisme sans échelle",
        body: "Cinquième des cinq principes du maillage agentique, aux côtés de la composabilité, de l'intelligence distribuée, du découplage des couches et de la neutralité vis-à-vis du fournisseur [9]. Il est défini comme le contrôle proactif du comportement de l'agent par des politiques embarquées, des habilitations et des mécanismes d'escalade.\n\nC'est le meilleur vocabulaire de mécanisme du corpus des cabinets, et le plus honnête sur sa propre limite : il dit **par quoi** un palier se fait respecter, jamais **sur quoi** on gradue. Aucune échelle n'est publiée.\n\nUne direction qui adopte le maillage dispose donc de la plomberie du contrôle et doit choisir elle-même la variable qui l'actionne. C'est l'objet de ce dossier."
      },
      "imda": {
        title: "Le bornage par conception · l'espace d'action et la réversibilité",
        body: "Publié le 22 janvier 2026, mis à jour le 20 mai avec des cas d'entreprise, le cadre singapourien est le premier texte d'État dédié aux agents [1]. Sa première dimension demande de comprendre les risques à partir de l'espace d'action, de la **réversibilité des actions** et du degré d'autonomie, puis de borner par conception la portée de l'impact.\n\nTrois choix s'y lisent. La réversibilité entre comme variable, au même rang que l'espace d'action. Le bornage est opératoire : accès aux outils, accès aux données, autorité de décision, soit trois listes. Et l'irréversibilité devient un **déclencheur** de validation humaine, aux côtés des décisions à fort enjeu, des comportements aberrants et des limites posées par l'utilisateur.\n\nLe cadre reste volontaire ; la responsabilité légale pour le comportement des agents, elle, demeure [2]."
      },
      "ai-act": {
        title: "Les articles 14 et 26 · l'usage, et une capacité exigée en bloc",
        body: "Le règlement européen ne contient aucune échelle d'autonomie : il classe par **usage** et attache des obligations à la classe haut risque [3].\n\nDeux points de l'article 14 § 4 comptent ici. Le texte demande aux personnes chargées de la surveillance d'être conscientes de la tendance à se reposer automatiquement, ou excessivement, sur la sortie du système : le biais d'automatisation est nommé dans le corps du règlement. Et il exige la capacité de ne pas utiliser le système, d'ignorer, de passer outre ou d'**inverser** sa sortie.\n\nLe mot de la bonne variable est donc présent dans le texte le plus contraignant des quatre. Mais il est exigé en bloc, à toutes les intensités d'usage, sans distinguer l'acte qui s'annule de celui qui ne s'annule pas. L'article 26 ajoute une exigence d'autorité sans créer de poste."
      }
    }
  },
  "schema-02": {
    title: "Le paradoxe de la graduation par la fiabilité",
    regions: {
      "critere-montee": {
        title: "La pente montante · l'autonomie accordée",
        body: "Cette courbe est celle que les cadres de paliers décrivent explicitement : l'autonomie progresse quand la justesse mesurée progresse [8]. Elle est présentée comme un parcours de confiance, quantifié par la précision de l'agent.\n\nPrise seule, la construction se défend. Elle interdit d'accorder l'autonomie sans preuve, elle rend la promotion contestable devant une instance, et elle produit une trace.\n\nSon problème n'apparaît qu'en la superposant à la seconde courbe. Le même paramètre qui la fait monter fait descendre l'autre. Les deux ne peuvent donc pas servir de critères simultanés : accorder le palier suivant au motif de la fiabilité, c'est retirer l'effectivité du contrôle qui justifiait le palier courant."
      },
      "vigilance": {
        title: "La pente descendante · l'effectivité de la supervision",
        body: "La complaisance d'automatisation est l'un des phénomènes les mieux établis des facteurs humains. La synthèse de 2010 de Parasuraman et Manzey intègre trois décennies de travaux et identifie trois conditions qui la produisent : une automatisation très fiable, une charge de travail élevée avec des tâches concurrentes, et une expérience positive prolongée [4].\n\nLes trois décrivent la situation d'un valideur d'actes agentiques en production.\n\nDeux résultats font la différence entre un inconfort et une objection. La détection des défaillances chute d'environ moitié sur les systèmes à fiabilité constamment élevée. Et l'effet se retrouve chez les experts comme chez les novices : il ne se corrige pas par la simple pratique, parce que le mécanisme est attentionnel. La revue systématique de 2012 ajoute que l'exhortation à la vigilance ne fonctionne pas [5]."
      },
      "ciseaux": {
        title: "Le croisement que rien ne signale",
        body: "Les deux pentes se croisent quelque part, et c'est le trait le plus gênant de la configuration : **aucun indicateur ne marque le passage**.\n\nUne supervision ne tombe pas en panne. Elle se dégrade sans émettre de signal. Un taux d'approbation de 99 % se lit exactement de la même manière dans deux situations opposées : un valideur attentif qui approuve des actes justes, et un valideur qui ne lit plus rien.\n\nD'où la seule mesure exploitable, reprise en décision 5 : traiter un taux d'approbation qui tend vers 100 % comme un indicateur de **défaillance** et non de qualité. Il ne dit pas que la supervision est bonne ; il dit qu'elle a cessé. C'est le signal de rétrogradation du schéma 7."
      },
      "palier-fictif": {
        title: "La zone du palier supervisé fictif",
        body: "À droite du croisement, le palier existe encore sur le papier : la politique dit que l'agent est supervisé, un valideur est désigné, une interface de validation est ouverte, et des approbations sont enregistrées.\n\nDans les faits, la garantie a disparu. L'agent opère au niveau d'autonomie que la justesse lui a valu, et le contrôle censé le borner n'intercepte plus rien.\n\nC'est la configuration la plus coûteuse des trois possibles, parce qu'elle est celle où l'organisation croit détenir un contrôle. Un régime sans valideur assume son absence de filet et borne l'espace d'action en conséquence. Un régime avec valideur fictif ne borne rien **et** se dispense de le faire. Le régime 1 du schéma 6 tire la conséquence : sur les actes annulables à portée bornée, pas de valideur du tout."
      }
    }
  },
  "schema-03": {
    title: "Le palier intermédiaire, neuf ans après",
    regions: {
      "niveau-3": {
        title: "Le niveau 3 · automatisation conditionnelle",
        body: "Dans la norme J3016, le niveau 3 est l'étage où le système conduit, où le conducteur peut détourner son attention, et où il doit néanmoins reprendre le contrôle sur demande.\n\nC'est le seul niveau de l'échelle qui exige des deux parties d'être simultanément responsables : la machine pendant la conduite, l'humain à l'instant de la reprise. Les niveaux 2 et 4 n'ont pas cette ambiguïté — au niveau 2 l'humain surveille en continu, au niveau 4 le système gère la défaillance lui-même dans son domaine.\n\nL'intérêt pour une direction data est que ce palier a été spécifié, homologué et commercialisé. On dispose donc de neuf ans d'observation sur le sort réel d'un étage intermédiaire gradué par la reprise humaine."
      },
      "superviseur-passif": {
        title: "Le superviseur passif · ce que la recherche a mesuré",
        body: "Le résultat central des travaux sur le transfert de tâche : le rôle du conducteur passe de **contrôleur actif** à **superviseur passif**, et un opérateur hors de la boucle de contrôle perd la conscience de situation nécessaire pour reprendre correctement [12].\n\nLe délai de reprise dépend de la charge de la tâche annexe, et la qualité de la reprise se dégrade quand cette charge augmente. La réponse technique des constructeurs est révélatrice : estimer le temps de récupération du conducteur et surveiller ce qu'il fait d'autre. Autrement dit, ajouter une couche de supervision pour surveiller le superviseur.\n\nC'est la configuration exacte que les cadres agentiques placent au milieu de leur échelle, sous le nom d'autonomie supervisée puis guidée. Le même mécanisme attentionnel que décrit la littérature sur la complaisance [4] y est à l'œuvre."
      },
      "deploiements": {
        title: "Neuf ans de déploiement · ce que le niveau 3 a produit",
        body: "Quatre dates suffisent. En 2017, le premier niveau 3 est annoncé comme la caractéristique phare d'une berline haut de gamme. En 2020, le constructeur y renonce pour cette génération et réinvestit dans le niveau 2, faute de cadre d'homologation stabilisé [14]. En mars 2021, une fonction homologuée au Japon est commercialisée en série limitée à cent exemplaires, uniquement en location sur trois ans. En décembre 2024, l'autorité fédérale allemande autorise un système de niveau 3 jusqu'à 95 km/h, en suivi d'un véhicule sur autoroute [13].\n\nLe palier n'a pas disparu. Il a survécu en **rétrécissant son domaine opérationnel** jusqu'à ce que la reprise ne serve presque jamais. C'est une réponse par le bornage de l'espace d'action, non par le renforcement de la vigilance."
      },
      "transposition": {
        title: "La transposition, et le geste inverse",
        body: "Le parallèle n'est pas une analogie décorative : la configuration est la même. Un acteur qui agit, un humain qui doit pouvoir reprendre, et une échelle graduée sur la part de supervision restante.\n\nL'enseignement est dans le geste. Les cadres de cabinets **élargissent** l'espace d'action quand la justesse progresse. L'automobile a fait le contraire : elle a **borné** l'espace d'action pour que le palier tienne.\n\nEt c'est le geste de la première dimension du cadre singapourien, borner par conception [1]. Deux secteurs, deux époques, une même conclusion : le palier intermédiaire ne se sécurise pas par la vigilance de celui qui surveille, il se sécurise par la réduction de ce qui peut mal tourner."
      }
    }
  },
  "schema-04": {
    title: "Quatre classes d'actes, trois propriétés mesurables",
    regions: {
      "classe-r0": {
        title: "R0 · annulable seul",
        body: "Délai de rétractation long, l'organisation annule sans concours extérieur, aucun tiers n'a vu l'effet. Écriture dans un brouillon, étiquetage, enrichissement d'une fiche interne, calcul rangé dans une table de travail.\n\nSur cette classe, un valideur humain est contre-productif : il n'apporte aucune garantie que l'annulation n'apporte déjà, et il crée l'apparence d'un contrôle que le schéma 2 décrit comme fictif. Le régime 1 du schéma 6 l'assume et retire le valideur.\n\nCe qui reste exigible est d'une autre nature : une identité propre à l'agent, un journal des actes, un plafond de volume par exécution, et le test d'annulation rejoué à chaque version. Le contrôle se déplace de la validation vers la **bornitude** de l'acte et sa traçabilité."
      },
      "classe-r1": {
        title: "R1 · annulable avec un tiers",
        body: "Délai court, concours externe nécessaire, effet encore invisible du dehors. Une commande fournisseur avant traitement, une réservation annulable, une écriture dans un système partagé avec un partenaire.\n\nCette classe est celle qu'on sous-estime le plus, parce qu'elle se présente comme réversible. Le critère qui compte est **organisationnel** et non technique : un acte techniquement annulable qui exige l'accord d'un tiers a un délai réel qui se compte en jours et un taux de succès inférieur à un. L'annulation devient une démarche, avec une file d'attente et un interlocuteur.\n\nD'où le régime 2 : l'agent agit, mais un seuil de volume écrit déclenche l'arrêt. Au-delà du seuil, ce n'est plus une annulation, c'est une campagne de rattrapage."
      },
      "classe-r2": {
        title: "R2 · compensable",
        body: "L'effet a été observé hors de l'organisation. L'état antérieur n'est pas restituable, quoi qu'on fasse ensuite. Un courriel client, un message public, un devis ou un tarif transmis.\n\nC'est la classe la plus mal traitée par les cadres existants. Le cadre singapourien place l'envoi de courriel « entre les deux » et s'arrête là [1]. Or c'est l'entre-deux où vit la majorité des agents d'entreprise déployés : relation client, prospection, support, diffusion de rapports.\n\nPour cette classe, la bonne question n'est pas comment annuler mais **quelle compensation est prévue et qui la porte**. Un régime d'autonomie qui ne répond pas à cette question laisse l'organisation découvrir la réponse au premier incident. C'est aussi là que la parole de l'agent commence à engager celui qui l'a déployé."
      },
      "classe-r3": {
        title: "R3 · irréversible",
        body: "Délai nul, ou effet juridique constitué. Signature, paiement exécuté, suppression définitive, déclaration réglementaire déposée.\n\nSur cette classe, la logique de la graduation s'arrête. Aucun niveau de justesse ne borne une perte non reconstituable : un agent qui se trompe une fois sur dix mille sur un acte R3 expose à la même classe de conséquence qu'un agent qui se trompe une fois sur cent, à un facteur de fréquence près. Le coût unitaire ne baisse pas.\n\nD'où le régime 4 et sa formulation en termes d'habilitation plutôt que de confiance : l'agent prépare, un humain pose l'acte, et l'agent **n'a pas** l'habilitation technique de l'acte. S'y ajoute la séparation entre celui qui prépare et celui qui pose. Un outil non classé est traité en R3 par défaut, par transposition du défaut pessimiste du protocole [10]."
      }
    }
  },
  "schema-05": {
    title: "La chaîne de déclaration de réversibilité",
    regions: {
      "serveur": {
        title: "Étape 1 · le serveur d'outils déclare",
        body: "La révision du 26 mars 2025 du protocole de contexte pour les modèles introduit quatre booléens optionnels sur chaque outil : lecture seule, destructif, idempotent, monde ouvert [10].\n\nLe fait notable est que ce vocabulaire est **exactement** celui de la réversibilité. Lecture seule correspond à la classe R0, destructif à la classe R3, monde ouvert à l'observation par un tiers donc à la classe R2, et l'idempotence est la propriété qui rend une reprise sur erreur possible. L'étage technique a adopté la variable que l'étage de la gouvernance n'a pas convertie en politique.\n\nMais la déclaration est faite par la partie même dont l'acte est celui qu'on cherche à borner. C'est la faille, et elle n'est pas corrigeable par une meilleure rédaction du champ."
      },
      "client": {
        title: "Étape 2 · le client reçoit la déclaration",
        body: "Le client agentique reçoit les annotations telles que le serveur les a écrites, et les expose au modèle ainsi qu'à l'interface de validation.\n\nUn point de conception mérite d'être relevé au crédit du protocole : les **valeurs par défaut sont pessimistes**. En l'absence de déclaration, un outil est réputé non en lecture seule, potentiellement destructif, non idempotent et ouvert sur le monde. Le protocole a pris la décision prudente que les politiques d'entreprise, elles, ne prennent généralement pas — un outil nouveau y arrive le plus souvent avec les droits de son voisin.\n\nLa décision 2 reprend ce défaut et le remonte d'un étage : un outil sans classification du déployeur est traité en R3 jusqu'à classement."
      },
      "rupture": {
        title: "La rupture · des indices, non un contrat",
        body: "La spécification qualifie elle-même ces annotations d'**indices non contractuels**. Un serveur non digne de confiance peut déclarer un outil en lecture seule et supprimer des fichiers, ce qui conduit la spécification à demander aux clients de traiter les annotations de serveurs non vérifiés comme purement informatives [10].\n\nLa conséquence rejoint ce qui a été établi ailleurs sur les identités d'agents : un palier d'autonomie qu'on ne peut pas faire respecter techniquement reste une charte. Une classification de réversibilité recopiée de la déclaration du fournisseur a exactement ce statut.\n\nC'est la raison pour laquelle la décision 3 est formulée en interdiction : ne jamais dériver une habilitation des annotations déclarées par un serveur. Elles servent à détecter une divergence et non à fonder un droit."
      },
      "catalogue-deployeur": {
        title: "Le catalogue du déployeur · ce qui gouverne",
        body: "L'exigence qui en découle est concrète et peu coûteuse. Pour chaque outil exposé à un agent, le catalogue tenu par le déployeur porte quatre colonnes : la classe R0 à R3, le propriétaire de l'outil, la date du dernier test d'annulation et son résultat.\n\nDeux règles de préséance suffisent à en faire une politique. Quand la déclaration du serveur et la classification du déployeur divergent, c'est la seconde qui gouverne l'habilitation. Quand un outil arrive sans classification, il est traité en R3.\n\nLe volet identité et autorisation de l'initiative américaine sur les normes des agents fournit les briques qui rendent cette classification opposable plutôt que déclarative : authentification, autorisation, audit, non-répudiation, atténuation des injections d'instructions [11]."
      }
    }
  },
  "schema-06": {
    title: "La matrice des régimes d'habilitation",
    regions: {
      "regime-1": {
        title: "Régime 1 · exécution libre",
        body: "Classe R0, portée bornée. L'agent agit sans validation.\n\nExigences : une identité propre, un journal des actes, un plafond de volume par exécution, et un test d'annulation rejoué à chaque version de modèle, de fournisseur ou de catalogue.\n\nLe point qui surprend les comités est l'absence délibérée de valideur humain. Ce n'est pas un relâchement : c'est la conséquence directe du schéma 2. Sur des actes annulables et bornés, un valideur n'intercepterait rien et produirait l'illusion d'un contrôle, laquelle dispense l'organisation de borner réellement l'espace d'action. Mieux vaut un régime qui assume son absence de filet et resserre le plafond de volume."
      },
      "regime-2": {
        title: "Régime 2 · exécution plafonnée",
        body: "Classe R0 ou R1, portée large. L'agent agit, mais un seuil de volume déclenche un arrêt et une reprise humaine.\n\nExigences : celles du régime 1, plus un seuil écrit et un titulaire nommé pour l'arbitrer.\n\nLe déplacement essentiel est là : **le seuil devient l'objet de gouvernance**, et la validation cesse de l'être. Un comité qui discute d'un seuil discute d'un nombre révisable, documenté, et dont le franchissement laisse une trace. Un comité qui discute d'une validation discute d'une intention.\n\nCe régime est aussi celui qui rattrape le cas que la classe R0 laisse passer : corriger une étiquette sur un enregistrement et sur quatre cent mille enregistrements est le même acte, et la seconde exécution peut arrêter une chaîne de facturation."
      },
      "regime-3": {
        title: "Régime 3 · validation par acte",
        body: "Classe R2. Chaque acte observable par un tiers passe par une validation nominative, avec le contenu exact de ce qui sortira.\n\nExigences : celles des régimes précédents, plus la conservation du couple proposition/validation, plus une procédure de compensation écrite avec son porteur.\n\nC'est le régime le plus coûteux, et c'est celui où vit la majorité des agents d'entreprise déployés. Il faut donc l'écrire en sachant qu'il est fragile : c'est exactement le régime où la complaisance d'automatisation s'installe [4], et il est le seul à requérir la surveillance du taux d'approbation comme indicateur de défaillance.\n\nLa procédure de compensation n'est pas un ornement. Sur un acte R2, l'annulation n'existe pas ; seule la compensation existe, et elle a un porteur ou elle n'a rien."
      },
      "regime-4": {
        title: "Régime 4 · acte humain délibéré",
        body: "Classe R3, quelle que soit la portée. L'agent prépare, un humain pose l'acte.\n\nExigences : celles des régimes précédents, plus la séparation des habilitations entre celui qui prépare et celui qui pose.\n\nLa formulation compte : l'agent **n'a pas l'habilitation technique** de l'acte. Ce n'est pas une mesure de défiance envers l'agent, c'est la conséquence du fait qu'aucune confiance ne borne une perte non reconstituable. Un agent dix fois plus juste reste exposé à la même classe de conséquence.\n\nC'est la raison pour laquelle ce régime ignore l'axe horizontal de la matrice. La classe R3 impose le régime 4 à portée bornée comme à portée large : sur un acte irréversible, la portée ne change que la taille du sinistre, jamais sa réparabilité."
      }
    }
  },
  "schema-07": {
    title: "Le cycle d'autonomie et la boucle absente",
    regions: {
      "montee": {
        title: "La montée · documentée par les quatre cadres",
        body: "C'est la seule étape du cycle que les quatre textes traitent, et ils la traitent bien. Les paliers mérités détaillent les seuils de promotion [8], l'autonomie gouvernée les mécanismes d'escalade [9], le cadre singapourien les déclencheurs de validation [1], le règlement européen les capacités d'intervention [3].\n\nOn sait donc comment une organisation accorde un palier : des tests, un seuil, une instance qui signe, une trace.\n\nCe que la montée ne dit pas, c'est ce qui se passe après. Et dans un cycle où seule la montée est spécifiée, un palier accordé est un palier définitif — non par décision, mais par absence de procédure inverse."
      },
      "exploitation": {
        title: "L'exploitation · le régime s'installe, puis se tasse",
        body: "L'agent opère au nouveau régime. Les premiers mois ressemblent à ce que la promotion décrivait : les valideurs lisent, les incidents remontent, l'organisation observe.\n\nPuis la configuration du schéma 2 se met en place. L'agent devient fiable, la charge de travail du valideur ne baisse pas, l'expérience positive s'accumule — les trois conditions de la complaisance d'automatisation sont réunies [4]. Le taux d'approbation monte, et l'organisation le lit comme une confirmation.\n\nAucun signal ne distingue à ce stade une supervision qui fonctionne d'une supervision qui a cessé. C'est ce qui rend l'étape suivante nécessaire : si la dégradation ne s'annonce pas, il faut la mesurer par un indicateur choisi d'avance."
      },
      "signal": {
        title: "Les trois signaux calculables",
        body: "Trois mesures se calculent sur des données que l'organisation possède déjà.\n\n**L'échec d'un test d'annulation** : le test du schéma 4 est rejoué, l'état ne revient pas. C'est un signal dur, binaire, et sur un outil R3 il justifie l'automaticité.\n\n**Le taux d'incident par mille actes** : classique, mais il ne vaut que rapporté à la classe de l'acte, un incident R0 et un incident R2 n'ayant pas le même sens.\n\n**La dérive du taux d'approbation vers 100 %** sur un régime 3 : le seul observable qui approche l'effectivité de la supervision. Il fonctionne comme indicateur de **défaillance** et non de qualité. Il ne dit pas que la supervision est bonne ; il dit qu'elle a cessé. C'est la décision 5 du dossier."
      },
      "retrogradation": {
        title: "La rétrogradation · absente des quatre cadres",
        body: "Le relevé est simple à vérifier et il tient sur une ligne : aucun des quatre cadres ne définit de critère, de titulaire ni de durée pour **retirer** à un agent une autonomie déjà accordée.\n\nLa conséquence est organisationnelle avant d'être technique. Une autonomie accordée devient un acquis, et la révoquer devient un acte politique coûteux, qui met en cause l'équipe qui l'a obtenue. L'organisation préfère alors empiler des contrôles en aval plutôt que redescendre, et elle finit par superviser un palier qu'elle n'ose plus réduire.\n\nC'est l'asymétrie la plus chère de tout le corpus, et c'est aussi la plus facile à corriger : la clause s'écrit en quatre éléments, avant la première montée."
      },
      "clause": {
        title: "Les quatre éléments d'une clause praticable",
        body: "**Le signal** : quelle mesure déclenche l'examen, choisie parmi les trois calculables.\n\n**Le titulaire** : qui prononce la descente. L'article 26 du règlement exige une surveillance humaine dotée d'autorité sans créer de poste [3] ; la rétrogradation est le cas d'usage qui donne un contenu à ce mot. Un titulaire qui ne peut pas redescendre un agent d'un régime a un intitulé.\n\n**L'automaticité** : l'échec d'un test d'annulation sur un outil R3 suspend l'habilitation sans attendre une réunion, à charge pour le titulaire de la rétablir. C'est le coupe-circuit appliqué à l'habilitation plutôt qu'à la dépense.\n\n**La durée** : sans terme, c'est une sanction. Avec un terme et des conditions de retour, c'est un dispositif. Le retour suppose le rejeu du jeu de tests et non l'écoulement du temps."
      }
    }
  }
}
