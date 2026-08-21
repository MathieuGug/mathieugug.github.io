{
  "schema-01": {
    "mandat-humain": {
      title: "L'humain commanditaire",
      body: "<p>Le seul point de la chaîne où l'identité est <strong>établie</strong> plutôt que présentée. L'humain s'authentifie, éventuellement avec un second facteur, et le contrôle d'accès conditionnel évalue son contexte : appareil connu, réseau, horaire, niveau de risque.</p><p>Toute la pile de sécurité d'identité que les organisations ont construite depuis quinze ans se concentre ici. C'est aussi pourquoi elle n'a rien vu en août 2025 : l'attaquant n'est jamais passé par cette porte.</p><p>La question à se poser en cadrage : combien de vos agents peuvent-ils agir <em>sans</em> qu'un humain ait franchi cette étape, par déclenchement programmé ou par appel d'un autre système ?</p>"
    },
    "agent": {
      title: "L'agent",
      body: "<p>À cet endroit, deux identités coexistent normalement : celle de l'agent lui-même, enregistrée dans un registre, et celle de l'humain qu'il sert, portée par le jeton reçu.</p><p>La bonne pratique consiste à conserver les deux jusqu'au bout de la chaîne. La RFC 8693 en donne la forme exacte avec la revendication <code>act</code>, qui exprime qu'un mandataire agit pour le compte d'un mandant et qui s'imbrique sur plusieurs sauts<sup><a href=\"#source-6\" class=\"cite\" data-src=\"6\">[6]</a></sup>.</p><p>Dans la plupart des déploiements observés, l'agent conserve les deux jusqu'à sa propre sortie, puis n'en transmet aucune.</p>"
    },
    "frontiere-outil": {
      title: "La frontière de l'outil — le point de rupture",
      eyebrow: "Là où tout se joue",
      body: "<p>C'est ici que l'agent doit re-présenter le mandat, et c'est ici qu'il présente autre chose : une clé d'API, un jeton de service, un compte technique partagé par tous les utilisateurs de l'agent.</p><p>L'enquête de juin 2026 chiffre l'ampleur du phénomène : 69 % des entreprises interrogées font partager des secrets d'accès entre agents quelque part dans leur déploiement<sup><a href=\"#source-2\" class=\"cite\" data-src=\"2\">[2]</a></sup>. Une identité compromise à cet endroit hérite de l'accès de tous les flux qu'elle touche.</p><p>Le Model Context Protocol traite correctement le serveur d'outils comme un serveur de ressource distinct, mais rien dans le protocole n'oblige le jeton présenté à porter le mandat de l'utilisateur<sup><a href=\"#source-15\" class=\"cite\" data-src=\"15\">[15]</a></sup>. C'est une décision de plateforme, pas une décision de protocole.</p>"
    },
    "systeme-cible": {
      title: "Le système cible",
      body: "<p>Le système exécute et journalise. Ce qu'il inscrit dans son journal est ce qui restera disponible six mois plus tard, quand il faudra reconstituer.</p><p>Si le mandat a été perdu deux sauts plus tôt, aucun enrichissement ultérieur ne le rétablira : l'information n'a jamais atteint ce point. C'est la propriété la plus contrariante de la chaîne de délégation, elle ne se répare pas rétroactivement.</p><p>L'article 26 du règlement européen sur l'IA impose au déployeur d'un système à haut risque une conservation des journaux d'au moins six mois<sup><a href=\"#source-16\" class=\"cite\" data-src=\"16\">[16]</a></sup>. Conserver un journal qui ne nomme personne satisfait la lettre de l'obligation sans en servir l'objet.</p>"
    },
    "journal-rompu": {
      title: "Ce que le journal retient après la rupture",
      body: "<p>Au-delà du point de rupture, le journal ne contient plus qu'un nom d'agent, puis un nom de compte de service. Le commanditaire humain a disparu.</p><p>La conséquence pratique se mesure : c'est le <strong>taux de reconstitution</strong> proposé au schéma 5. Tirez au sort des actions d'agent dans le trimestre écoulé et comptez la proportion qui remonte à un humain nommé.</p><p>La conséquence juridique tient au retournement probatoire en cours. La directive européenne sur la responsabilité du fait des produits défectueux, transposable en décembre 2026, assortit le refus <em>ou l'incapacité</em> de produire des éléments d'une présomption de défectuosité. Ne pas savoir devient une position défavorable.</p>"
    }
  },
  "schema-02": {
    "charge-travail": {
      title: "Identité de charge de travail",
      eyebrow: "Qu'est-ce qui s'exécute",
      body: "<p>Elle nomme le processus, pas l'application ni la personne. SPIFFE en est le cadre de référence et SPIRE l'implémentation la plus déployée.</p><p>Le principe est une inversion : au lieu de distribuer un secret que la charge présentera, on <em>atteste</em> des propriétés observables. SPIRE procède en deux temps, attestation du nœud puis attestation de la charge, et délivre un document de courte durée renouvelé toutes les heures<sup><a href=\"#source-13\" class=\"cite\" data-src=\"13\">[13]</a></sup>.</p><p>Avantage décisif pour l'agentique : quand un agent éphémère disparaît, son identité expire seule. Pas de clé résiduelle, donc pas d'orphelin de ce type.</p><p>Limite : elle ne dit ni quel agent applicatif tourne dans ce processus, ni pour qui.</p>"
    },
    "principal-agent": {
      title: "Principal applicatif de l'agent",
      eyebrow: "Quel agent est-ce",
      body: "<p>C'est la colonne que le marché vend en 2026. Microsoft Entra Agent ID fait apparaître les agents dans la même console que les utilisateurs, avec registre, propriétaire, habilitations lisibles et revues d'accès<sup><a href=\"#source-12\" class=\"cite\" data-src=\"12\">[12]</a></sup>. Côté agents entre eux, A2A a livré des cartes d'agent signées permettant une vérification cryptographique d'identité<sup><a href=\"#source-14\" class=\"cite\" data-src=\"14\">[14]</a></sup>.</p><p>Le progrès est réel : sans registre, il n'y a pas de gouvernance, seulement un inventaire manuel périmé à la semaine.</p><p>Le piège est de croire la question réglée. Un principal d'agent est une identité <em>stable</em> ; le mandat est une propriété de <em>chaque appel</em>. Les deux ne se substituent pas.</p>"
    },
    "mandat-delegue": {
      title: "Mandat délégué",
      eyebrow: "Au nom de qui",
      body: "<p>La seule des trois que le droit interroge, et la seule qui ne s'achète pas comme un produit.</p><p>Sa forme normalisée existe : la revendication <code>act</code> de la RFC 8693, imbriquable pour représenter une chaîne complète, avec la règle de lecture qui empêche l'accumulation d'autorité — le destinataire ne considère que les revendications de premier niveau et l'acteur courant, les acteurs antérieurs restant informatifs<sup><a href=\"#source-6\" class=\"cite\" data-src=\"6\">[6]</a></sup>.</p><p>Elle porte aussi la distinction dont dépend toute reconstitution ultérieure : sans jeton d'acteur, l'échange produit une usurpation et l'agent devient indiscernable de l'utilisateur dans les journaux en aval ; avec jeton d'acteur, il produit une délégation et le jeton porte les deux parties.</p>"
    },
    "case-vide": {
      title: "Ce que l'organisation tient effectivement",
      body: "<p>Le motif observé se répète : colonne 2 achetée et administrée, colonne 1 en projet d'infrastructure, colonne 3 remplacée par un compte de service partagé, identique pour tous les utilisateurs de l'agent.</p><p>L'ordre de grandeur public le plus proche : 32 % des entreprises interrogées en juin 2026 attribuent à chaque agent une identité gérée et cadrée<sup><a href=\"#source-2\" class=\"cite\" data-src=\"2\">[2]</a></sup>. Autrement dit, deux tiers ne le font pas, et pour celles-là la question « au nom de qui » n'a pas de réponse technique.</p><p>La formulation qui fait mouche en comité : le mandat n'a pas été perdu, il n'a jamais été propagé.</p>"
    }
  },
  "schema-03": {
    "execution": {
      title: "Le choix des actions à l'exécution",
      body: "<p>Un compte de service exécute un traitement dont la liste d'appels est écrite dans du code relu, versionné, déployé. Un agent reçoit un objectif et compose sa séquence à chaque requête.</p><p>La conséquence pour l'habilitation est un changement de nature. Ce qu'on accorde à un agent n'est plus la liste de ce qu'il fera, c'est la <strong>borne de ce qu'il pourrait faire</strong>. L'écart entre les deux est ce qu'on ne sait pas mesurer avant l'incident.</p><p>Le <em>taux de portée</em> du schéma 5 est précisément l'instrument qui rend cet écart mesurable après coup, à partir de journaux que l'organisation possède déjà.</p>"
    },
    "enchainement": {
      title: "L'enchaînement d'outils",
      body: "<p>Chaque appel d'outil est une frontière où le mandat doit être re-présenté. Une tâche qui en enchaîne six franchit six frontières, et chacune est une occasion de perdre l'information.</p><p>Le nombre de frontières varie d'une requête à l'autre, ce qui interdit de raisonner sur un chemin nominal : il n'y en a pas. C'est une différence structurelle avec un traitement automatisé classique, dont le graphe d'appels est connu à l'avance.</p><p>Corollaire pratique pour l'audit : un contrôle par échantillon ne suffit pas si l'échantillon est tiré sur les chemins <em>connus</em>. Il faut tirer sur les exécutions réelles.</p>"
    },
    "sous-agents": {
      title: "L'engendrement de sous-agents",
      body: "<p>Quand un agent A délègue à B et B à C, l'autorité s'élargit à chaque saut : B tourne avec les habilitations de A plus les siennes, C accumule les deux. Une action au fond de la chaîne s'exécute alors avec un ensemble de permissions qu'aucun humain n'a jamais accordé.</p><p>L'invariant qui manque est nommé dans la littérature récente : les permissions effectives doivent être l'<strong>intersection</strong> de celles de l'utilisateur et de celles autorisées à l'agent, jamais leur union, et l'invariant doit tenir à chaque saut<sup><a href=\"#source-11\" class=\"cite\" data-src=\"11\">[11]</a></sup>.</p><p>La RFC 8693 fournit la moitié de la réponse avec sa règle de lecture des acteurs antérieurs. L'autre moitié, l'application de l'intersection à l'exécution, reste à la charge de la plateforme.</p>"
    },
    "detournabilite": {
      title: "La détournabilité par l'entrée",
      eyebrow: "La propriété qu'aucun compte de service ne possède",
      body: "<p>Un agent lit des contenus qu'il n'a pas choisis : une boîte de réception, un ticket, un document récupéré, la sortie d'un outil. Quiconque peut écrire dans l'un de ces canaux peut y placer des instructions.</p><p>Ce qui distingue la situation de 2026 des générations précédentes d'assistants conversationnels n'est pas la facilité d'injection, c'est <strong>l'autorité que l'agent détient au moment où il exécute</strong>. Une injection réussie sur un agent en lecture seule produit une réponse fausse ; la même injection sur un agent doté d'un droit d'écriture produit un acte.</p><p>C'est pourquoi le dossier place le curseur sur l'habilitation et non sur la robustesse du modèle.</p>"
    },
    "depute-confus": {
      title: "Le député confus",
      eyebrow: "Une figure de 1988, un périmètre de 2026",
      body: "<p>Un intermédiaire légitimement doté d'une autorité est amené à en faire usage pour le compte de quelqu'un qui ne la possède pas. La formulation est ancienne en sécurité informatique ; ce qui change avec les agents tient à l'ampleur de l'autorité déléguée et au nombre de canaux d'entrée.</p><p>Le Cloud Security Alliance en a fait l'objet d'une note de recherche dédiée<sup><a href=\"#source-8\" class=\"cite\" data-src=\"8\">[8]</a></sup>. La conclusion est inconfortable pour qui espérait une parade au niveau du modèle : aucune amélioration de la robustesse aux instructions injectées ne compense une autorité que l'agent n'aurait pas dû détenir.</p><p>Décision de direction correspondante : la question « notre agent résiste-t-il à l'injection ? » est moins utile que « que peut-il faire au maximum s'il ne résiste pas ? ».</p>"
    }
  },
  "schema-04": {
    "rfc8693": {
      title: "RFC 8693 — l'échange de jeton",
      eyebrow: "IETF, janvier 2020",
      body: "<p>La pièce centrale, et la plus ancienne. Elle définit la revendication <code>act</code>, son imbrication pour représenter une chaîne de délégation, et la règle selon laquelle le destinataire ne considère que l'acteur courant, les acteurs antérieurs restant informatifs<sup><a href=\"#source-6\" class=\"cite\" data-src=\"6\">[6]</a></sup>.</p><p>Elle porte aussi la distinction délégation / usurpation, qui décide de ce qu'on pourra reconstituer.</p><p>La colonne <em>rejouer</em> est marquée partielle : la chaîne est présente dans le jeton, donc conservable dans un journal, mais rien dans la spécification n'organise sa conservation ni sa relecture. C'est un matériau, pas un dispositif.</p>"
    },
    "spiffe": {
      title: "SPIFFE et SPIRE — l'attestation",
      body: "<p>Réponse propre à l'identité de charge de travail : attestation du nœud puis de la charge, documents de courte durée renouvelés à l'heure, aucun secret à présenter pour obtenir une identité<sup><a href=\"#source-13\" class=\"cite\" data-src=\"13\">[13]</a></sup>.</p><p>La colonne <em>révoquer</em> est marquée partielle pour une raison intéressante : SPIFFE ne révoque pas au sens classique, il laisse expirer. Sur des durées d'une heure, l'expiration fait office de révocation pour la plupart des scénarios, sans couvrir le cas d'une chaîne à interrompre immédiatement.</p><p>La difficulté est de déploiement. Le socle suppose un plan de contrôle que beaucoup d'équipes n'ont pas, et la plupart utiliseront des jetons à longue durée encore ce trimestre.</p>"
    },
    "mcp-oauth": {
      title: "MCP — l'autorisation des outils",
      body: "<p>Le Model Context Protocol adosse son autorisation à OAuth 2.1, avec l'enregistrement dynamique de client (RFC 7591) et les métadonnées de serveur d'autorisation (RFC 8414), et traite le serveur d'outils comme un serveur de ressource distinct<sup><a href=\"#source-15\" class=\"cite\" data-src=\"15\">[15]</a></sup>.</p><p>Le découpage est le bon : il sépare celui qui délivre le droit de celui qui l'exerce.</p><p>La colonne <em>propager</em> est marquée partielle parce que rien n'oblige, dans le protocole, à ce que le jeton présenté porte le mandat de l'utilisateur plutôt que l'identité de l'agent seul. C'est là que la décision de plateforme reprend la main sur la décision de protocole, et c'est le contenu de la décision 4 du dossier.</p>"
    },
    "a2a-cartes": {
      title: "A2A — les cartes d'agent signées",
      body: "<p>Versé à la Linux Foundation, A2A a livré une version 1.0 stable comportant des cartes d'agent signées pour la vérification cryptographique d'identité, avec plus de cent cinquante organisations participantes revendiquées en un an<sup><a href=\"#source-14\" class=\"cite\" data-src=\"14\">[14]</a></sup>.</p><p>La réserve porte sur l'écart entre la signature et le registre. À la mi-2026, la proposition de registre d'agents et celle de vérification d'identité des cartes restaient des questions ouvertes du projet : la découverte et l'identité ne sont pas résolues au niveau du protocole, et les pairs se configurent à la main.</p><p>Traduction pour un déployeur : une carte signée prouve qu'un agent est celui qu'il dit être, sans dire qui répond de lui ni à quel titre il agit.</p>"
    },
    "brouillons": {
      title: "Les brouillons d'autorisation agentique",
      body: "<p>Le chantier est abondant au point d'être illisible : plus de soixante-dix brouillons individuels proposés au seul groupe de travail OAuth de l'IETF, plus les travaux de l'OpenID Foundation et du W3C<sup><a href=\"#source-9\" class=\"cite\" data-src=\"9\">[9]</a></sup>.</p><p>La pièce la plus intéressante pour une direction est un profil traitant le cas où une politique ne peut pas <em>encore</em> autoriser une action parce qu'un préalable manque : une approbation, un consentement, une autorité déléguée, une attestation. C'est la formalisation de l'humain dans la boucle comme état du système et non comme intention.</p><p>Ce sont des brouillons. Ils ne fondent aucune exigence contractuelle en 2026, et une architecture qui les anticipe prend un risque de réécriture.</p>"
    },
    "cases-vides": {
      title: "Les deux fonctions que personne ne couvre",
      eyebrow: "Révoquer en chaîne · rejouer",
      body: "<p><strong>Révoquer en chaîne.</strong> Un agent a délégué à trois sous-agents, qui ont ouvert des sessions auprès de cinq systèmes. Comment interrompre l'ensemble en une opération ? Aucun standard ne le décrit. En pratique, on révoque à la source et on attend l'expiration, ce qui laisse une fenêtre dont la durée est celle des jetons en circulation.</p><p><strong>Rejouer.</strong> Reconstituer, six mois après, la séquence complète d'une action avec l'identité de chaque acteur à chaque saut. Le matériau existe dans les jetons ; sa conservation et sa relecture ne sont organisées par aucune spécification.</p><p>Une analyse systématique de cinq protocoles conclut que la gouvernance d'une communauté d'agents constitue une <strong>couche architecturale manquante au-dessus</strong> des standards d'interopérabilité, non une fonctionnalité manquante à l'intérieur de chacun<sup><a href=\"#source-10\" class=\"cite\" data-src=\"10\">[10]</a></sup>. Ces deux cases sont exactement celles dont on a besoin le jour d'un incident.</p>"
    }
  },
  "schema-05": {
    "dispersion": {
      title: "La dispersion des ratios publiés",
      body: "<p>De 40 pour 1 à 109 pour 1 sur douze mois. Un même éditeur publie 45 sur une page produit et 82 dans son rapport annuel<sup><a href=\"#source-3\" class=\"cite\" data-src=\"3\">[3]</a></sup> ; une compilation ultérieure avance 109, dont 79 attribuées aux seuls agents.</p><p>Un écart de facteur 2,7 entre publications d'une même année ne se lit pas comme une croissance. Il se lit comme une absence de définition partagée : compte-t-on les comptes de service, les certificats, les clés d'API, les jetons éphémères, les instances de conteneurs, les sessions ?</p><p>Le chiffre n'est donc pas faux ; il n'est pas comparable, ce qui est pire, parce qu'il autorise des séries temporelles qui ne mesurent rien.</p>"
    },
    "conflit-source": {
      title: "Pourquoi ce chiffre ne se pilote pas",
      body: "<p><strong>a. La position de la source.</strong> Toutes ces mesures viennent d'éditeurs qui vendent le remède. L'observation porte sur leur position, non sur leur honnêteté : personne d'autre n'a de raison de compter, et aucun organisme indépendant ne s'en est chargé.</p><p><strong>b. L'absence de dénominateur.</strong> Sans définition partagée de l'unité comptée, deux chiffres ne se comparent pas, et une évolution d'une année sur l'autre ne s'interprète pas.</p><p><strong>c. L'absence de décision attachée.</strong> Savoir qu'on a quatre-vingts identités machine par salarié ne dit ni lesquelles sont dangereuses, ni lesquelles sont abandonnées, ni par laquelle commencer. C'est un chiffre destiné à ouvrir un budget, pas à le piloter.</p>"
    },
    "taux-propriete": {
      title: "Le taux de propriété",
      eyebrow: "Indicateur 1",
      body: "<p>Part des identités non humaines actives portant un propriétaire nommé, vivant dans l'organisation, et une date de revue non dépassée.</p><p>La réponse initiale est généralement basse au point d'être inconfortable à publier. C'est exactement pourquoi elle est utile : elle borne toute autre ambition de gouvernance. Une politique d'autonomie graduée ne peut pas s'appliquer à des identités dont personne ne répond.</p><p>Production : elle demande le croisement de l'annuaire des identités non humaines avec l'annuaire du personnel. Quelques jours d'analyste, aucun outillage nouveau.</p>"
    },
    "taux-portee": {
      title: "Le taux de portée",
      eyebrow: "Indicateur 2",
      body: "<p>Part des habilitations accordées à un agent qui ont été effectivement exercées sur les quatre-vingt-dix derniers jours.</p><p>L'écart entre accordé et exercé est la mesure directe du rayon d'un détournement. Il traduit en chiffre l'argument du député confus : ce que l'agent pourrait faire s'il était détourné, moins ce qu'il fait réellement.</p><p>Production : il se calcule à partir de journaux d'accès que l'organisation possède déjà, à condition qu'ils distinguent les identités d'agent. Là où ils ne les distinguent pas, l'impossibilité de calculer le taux est en elle-même le résultat.</p>"
    },
    "taux-reconstitution": {
      title: "Le taux de reconstitution",
      eyebrow: "Indicateur 3 — le seul qui mesure la chaîne",
      body: "<p>Sur un échantillon d'actions d'agents tirées au sort dans le trimestre écoulé, part de celles qui permettent de remonter à un humain commanditaire nommé.</p><p>C'est le seul des trois qui mesure la chaîne de délégation, et celui qui prédit ce qu'on pourra opposer à un contrôle. Il est aussi le plus direct : il ne se calcule pas, il s'éprouve, en essayant de remonter.</p><p>Il joue le rôle du test de falsification du schéma 6. Un agent dont on ne reconstitue pas les actions n'est pas au palier que le comité croit lui avoir accordé, quelle que soit la délibération inscrite au compte rendu.</p><p>Aucun de ces trois taux ne se compare entre entreprises, et c'est leur avantage : ils se comparent à eux-mêmes d'un trimestre à l'autre.</p>"
    }
  },
  "schema-06": {
    "palier-1": {
      title: "Palier 1 — l'agent propose",
      body: "<p>L'agent lit, rédige, recommande. Un humain valide avant tout effet sur un système ou sur un tiers.</p><p><strong>Pièce exigée :</strong> un principal applicatif enregistré, avec propriétaire nommé. C'est la colonne 2 du schéma 2, celle que le marché sait vendre.</p><p><strong>Point de refus :</strong> le registre. Un agent absent du registre ne reçoit aucun accès en lecture au-delà du bac à sable.</p><p>C'est le palier le plus simple à faire respecter, et la porte d'entrée du dispositif : sans registre opposable, aucun palier supérieur n'a de sens.</p>"
    },
    "palier-2": {
      title: "Palier 2 — l'agent exécute sous validation",
      eyebrow: "La marche presque toujours sautée",
      body: "<p>L'agent agit, un humain contresigne chaque effet externe.</p><p><strong>Pièce exigée :</strong> la propagation du mandat. Chaque appel d'outil porte l'identité de l'humain commanditaire, distincte de celle de l'agent, sous forme de délégation et non d'usurpation<sup><a href=\"#source-6\" class=\"cite\" data-src=\"6\">[6]</a></sup>.</p><p><strong>Point de refus :</strong> le serveur d'outils, qui rejette tout jeton dépourvu de mandat.</p><p>C'est la marche la plus haute de toute l'échelle. Elle est presque toujours sautée parce qu'elle demande une modification d'intégration là où un compte de service partagé fonctionne immédiatement. Les 69 % de partage de secrets mesurés en juin 2026 sont la trace statistique de ce saut<sup><a href=\"#source-2\" class=\"cite\" data-src=\"2\">[2]</a></sup>.</p>"
    },
    "palier-3": {
      title: "Palier 3 — l'agent exécute et notifie",
      body: "<p>L'agent agit, l'humain découvre après coup et dispose des moyens de revenir en arrière.</p><p><strong>Pièces exigées</strong>, en plus des précédentes : l'attestation de la charge de travail, une habilitation dont la portée est bornée à l'exécution, et un journal conservant la chaîne complète.</p><p><strong>Point de refus :</strong> le serveur d'autorisation, qui n'échange un jeton qu'au bénéfice d'une charge attestée<sup><a href=\"#source-13\" class=\"cite\" data-src=\"13\">[13]</a></sup>.</p><p>Ce palier suppose un socle d'attestation. C'est le seul de la grille dont le coût est principalement un coût d'infrastructure et non un coût d'arbitrage.</p>"
    },
    "palier-4": {
      title: "Palier 4 — l'agent exécute sans préavis",
      eyebrow: "Fermé, et pour une raison précise",
      body: "<p>L'agent agit dans son périmètre sans signalement individuel.</p><p><strong>Pièce exigée :</strong> tout ce qui précède, plus une capacité de révocation en chaîne <strong>éprouvée par exercice</strong>. Non pas documentée : testée, avec une date et un compte rendu.</p><p><strong>Point de refus :</strong> personne, à ce jour. Aucun mécanisme normalisé ne décrit l'interruption simultanée d'une arborescence de délégations<sup><a href=\"#source-10\" class=\"cite\" data-src=\"10\">[10]</a></sup>.</p><p>La conséquence est une décision qu'un comité peut voter demain, sans budget : tant que la révocation en chaîne n'est pas démontrée par un exercice, le palier 4 reste fermé hors du bac à sable.</p>"
    }
  },
  "schema-07": {
    "naissance": {
      title: "La prolifération",
      body: "<p>Un agent se crée en quelques heures dans un dépôt de code, un atelier métier ou une plateforme à faible codage. Une revue de gouvernance prend des mois. Quand l'instance se prononce, l'agent est en production depuis un trimestre et l'arbitrage porte sur un fait accompli<sup><a href=\"#source-7\" class=\"cite\" data-src=\"7\">[7]</a></sup>.</p><p>Le rythme de création n'est pas la variable sur laquelle une direction souhaite agir : le ralentir revient à annuler le bénéfice attendu.</p><p>La parade consiste à déplacer le point d'entrée. L'agent ne se crée pas <em>contre</em> le registre, il se crée <strong>par</strong> le registre, qui devient la source de son identité au lieu d'en être l'inventaire a posteriori.</p>"
    },
    "derive": {
      title: "L'accumulation de privilèges",
      body: "<p>Un agent reçoit des habilitations larges au déploiement, pour que le cas d'usage fonctionne sans allers-retours entre équipes. Ces habilitations ne sont jamais réduites, parce que personne ne sait lesquelles sont exercées.</p><p>C'est le motif le plus facile à corriger, et le moins traité, parce qu'il ne produit aucun symptôme visible avant l'incident.</p><p>Le taux de portée du schéma 5 est l'instrument qui le débloque : il transforme « on ne sait pas ce qui est utile » en une liste d'habilitations non exercées sur quatre-vingt-dix jours, qui devient un ordre du jour de revue.</p>"
    },
    "orphelinat": {
      title: "L'orphelinat",
      body: "<p>L'agent survit à son cas d'usage, à son commanditaire, parfois à l'équipe qui l'a écrit. Ses identifiants restent valides et son accès reste ouvert.</p><p>Deux conséquences, de nature différente. Côté sécurité, les identifiants inutilisés figurent régulièrement parmi les premiers vecteurs d'accès initial dans les analyses de compromission. Côté conformité, les habilitations résiduelles gonflent artificiellement le périmètre des audits et compliquent les attestations.</p><p>L'orphelinat est le seul des trois motifs dont la correction est purement administrative : il suffit qu'un processus existant, la sortie d'un salarié, comporte une rubrique de plus.</p>"
    },
    "portes-manquantes": {
      title: "Les trois portes qui manquent",
      body: "<p><strong>À la naissance :</strong> pas d'identité sans propriétaire nommé, sans cas d'usage rattaché au registre, sans date d'expiration. L'expiration est la mesure la plus efficace du lot, parce qu'elle inverse la charge : le maintien devient l'action à justifier.</p><p><strong>À la mobilité :</strong> quand le propriétaire d'un agent change de poste, l'agent apparaît dans sa liste de transfert au même titre qu'un dossier. Une ligne à ajouter à un formulaire existant.</p><p><strong>Au départ :</strong> la liste de sortie d'un salarié comporte une rubrique « agents dont il est propriétaire ». Sans elle, le départ d'un chef de projet produit mécaniquement une cohorte d'orphelins.</p><p>Ces trois portes s'installent dans le registre des cas d'usage que la conformité réclame déjà, augmenté de trois colonnes : type d'identifiant, propriétaire technique, date de revue. Tenir deux registres séparés garantit qu'au moins l'un des deux ment.</p>"
    }
  }
}
