{
  "schema-01": {
    title: "Trois couches, une seule se gouverne",
    regions: {
      "couche-modele": {
        title: "Le modèle : un objet d'achat",
        body: "<p>Une direction choisit un fournisseur, négocie une facture et encadre un usage. Elle n'a aucune prise sur le comportement interne du modèle, et aucun intérêt à en avoir : ce n'est pas son métier et ce ne sera jamais son actif.</p><p>Les dispositifs qu'on accroche à cette couche — filtres d'entrée, consignes système, garde-fous de contenu — portent sur ce qui entre et ce qui sort, à travers une interface dont le fournisseur fixe le format et la disponibilité. Ils sont utiles. Ils ne constituent pas une politique d'entreprise, parce que leur périmètre d'application change quand le fournisseur change son produit.</p>"
      },
      "couche-agent": {
        title: "L'agent : une variable, pas un objet",
        body: "<p>Un agent est une boucle : il observe, décide, appelle un outil, observe le résultat, recommence. Sa configuration effective à l'instant <em>t</em> dépend de ce que le tour précédent a produit. Il n'existe donc pas d'état stable sur lequel accrocher une règle.</p><p>C'est le mécanisme derrière un écart que toutes les organisations constatent : la charte d'IA responsable décrit un agent idéalisé, et les journaux décrivent une trajectoire. Écrire « l'agent ne doit pas faire X » produit une intention ; écrire « cet outil n'est pas habilité pour cet agent » produit un contrôle.</p>"
      },
      "couche-outil": {
        title: "L'outil : le seul objet déclaré",
        body: "<p>Un outil possède un nom, une description, un schéma d'entrée et une adresse. Il est déclaré <strong>avant</strong> l'exécution, donc énumérable, versionnable, attribuable à un propriétaire. C'est la définition d'un élément d'inventaire.</p><p>Cette propriété est ce qui rend la couche gouvernable. Une politique a besoin d'un domaine d'application fini et nommable. Le catalogue d'outils en fournit un ; les deux couches supérieures n'en fournissent pas. La révision de juillet 2026 a d'ailleurs renforcé la description de cet objet : les schémas d'entrée et de sortie relèvent désormais du standard JSON Schema 2020-12 complet <a href=\"#source-9\" class=\"cite\" data-src=\"9\">[9]</a>.</p>"
      },
      "point-de-controle": {
        title: "Pourquoi tout passe par là",
        body: "<p>Un modèle de langage produit du texte. Pour qu'un effet se produise dans un système d'information — une lecture, une écriture, un paiement, un message envoyé — ce texte doit être interprété comme un appel d'outil et exécuté par un composant qui détient une habilitation.</p><p>Il n'existe pas de chemin parallèle. Un agent qui n'a aucun outil habilité ne peut rien faire d'autre que parler. C'est ce qui fait de l'appel d'outil le point de passage obligé, et du catalogue le seul endroit où une politique porte sur l'intégralité de la surface d'effet.</p><p>Conséquence directe : un palier d'autonomie qui ne nomme pas sa liste d'outils ne décrit aucun périmètre.</p>"
      }
    }
  },
  "schema-02": {
    title: "Onze champs, et quatre absences",
    regions: {
      "champs-presents": {
        title: "Ce que le schéma officiel définit",
        body: "<p>L'objet <code>ServerDetail</code> compte onze propriétés. Trois sont obligatoires : <code>name</code> (en DNS inversé, avec exactement une barre oblique séparant l'espace de noms du nom), <code>description</code> (texte libre) et <code>version</code> (chaîne libre, versionnage sémantique recommandé) <a href=\"#source-3\" class=\"cite\" data-src=\"3\">[3]</a>.</p><p>Les huit autres sont facultatives et orientées affichage ou distribution : titre, icônes, adresse de site, dépôt de code, paquets, accès distants, métadonnées d'extension, référence du schéma. Lues ensemble, elles décrivent un objet conçu pour être <strong>trouvé et installé</strong>, non pour être tenu dans le temps.</p>"
      },
      "absence-proprietaire": {
        title: "Absence 1 — aucun propriétaire",
        body: "<p>Aucune des onze propriétés ne désigne une personne, une équipe ou un service responsable. Le modèle canonique de l'écosystème ne prévoit pas d'endroit où écrire qui répond de l'outil.</p><p>C'est l'absence la plus lourde, parce qu'elle est aussi la moins chère à corriger côté entreprise : une colonne dans un référentiel suffit. Son effet n'est pas administratif. Un outil sans propriétaire ne peut pas être déprécié, parce que personne n'a qualité pour décider de son retrait ni pour en subir les conséquences. L'absence de propriétaire est donc la cause racine de l'absence de cycle de vie.</p>"
      },
      "absence-contact": {
        title: "Absence 2 — aucun contact",
        body: "<p>Rien dans la fiche ne dit où une alerte arrive, ni dans quel délai une réponse est attendue. Le champ <code>repository</code> existe, recommandé « pour la transparence et l'inspection de sécurité », mais un dépôt de code n'est pas une boîte d'astreinte.</p><p>Pour un exploitant de socle agentique, cette absence se paie au premier incident : l'outil renvoie des erreurs, l'agent échoue en boucle, et la recherche du responsable commence par une archéologie de l'historique de publication. Le délai de réponse attendu est précisément le genre de grandeur qui se négocie une fois et se vérifie ensuite.</p>"
      },
      "absence-cycle-vie": {
        title: "Absence 3 — aucun état déclaré par l'éditeur",
        body: "<p>Le registre officiel tient bien un état par version : <code>active</code>, <code>deprecated</code> ou <code>deleted</code>, avec un message d'accompagnement plafonné à cinq cents caractères <a href=\"#source-5\" class=\"cite\" data-src=\"5\">[5]</a>. Mais cet état vit dans les métadonnées du registre, sous son propre espace de noms, et se change par une opération d'administration.</p><p>L'éditeur ne le déclare pas dans la fiche de son outil. La différence est opérationnelle : une information absente du contrat de l'objet ne voyage pas avec lui. Un outil recopié dans un catalogue interne arrive sans son état, et le sous-registre doit le reconstituer par interrogation périodique du registre d'origine.</p>"
      },
      "absence-support": {
        title: "Absence 4 — aucun engagement",
        body: "<p>Aucune durée d'engagement, aucune fenêtre de préavis avant modification ou retrait, aucun niveau de service. Le modèle canonique décrit ce qu'un outil <em>est</em>, jamais ce que son éditeur <em>promet</em>.</p><p>Le contraste avec la couche inférieure est instructif : le protocole lui-même s'est doté en juillet 2026 d'une politique de dépréciation avec fenêtre minimale de douze mois <a href=\"#source-1\" class=\"cite\" data-src=\"1\">[1]</a>. La grammaire existe donc dans l'écosystème. Elle n'a simplement pas été descendue au niveau de l'objet que les entreprises consomment.</p>"
      },
      "namespace-preuve": {
        title: "Ce que l'espace de noms prouve, et ce qu'il ne prouve pas",
        body: "<p>Publier sous un espace de noms exige d'en prouver la maîtrise une fois : authentification sur une plateforme de code pour les préfixes qui la désignent, ou vérification de domaine par DNS ou HTTP pour les autres <a href=\"#source-4\" class=\"cite\" data-src=\"4\">[4]</a>. Le mécanisme est solide et suffit à empêcher l'usurpation de préfixe.</p><p>Il établit <strong>qui a publié</strong>, à une date. Il n'établit pas qui en répond aujourd'hui, qui a le droit de retirer l'outil, ni à qui s'adresse la demande quand il casse. Pour un déployeur, un espace de noms vérifié est une preuve d'origine, et non un engagement de tenue.</p>"
      }
    }
  },
  "schema-03": {
    title: "La description d'outil est une consigne",
    regions: {
      "description": {
        title: "Étape 1 — le fournisseur rédige",
        body: "<p>C'est le fournisseur de l'outil qui écrit le nom, la description, le schéma d'entrée et les annotations de comportement. Ce texte n'a pas d'autre destinataire que le modèle : c'est lui qui décidera, à partir de ces mots, s'il appelle l'outil et avec quels paramètres.</p><p>Autrement dit, la fiche produit d'un outil est fonctionnellement une consigne adressée à la machine, rédigée par un tiers. La littérature de conception d'outils le reconnaît implicitement en recommandant des exemples d'usage dans la définition, parce qu'ils améliorent la sélection et le passage de paramètres <a href=\"#source-11\" class=\"cite\" data-src=\"11\">[11]</a>.</p>"
      },
      "annotations": {
        title: "Étape 2 — le client énumère",
        body: "<p>Le client interroge le serveur, reçoit la liste des outils et leurs annotations de comportement — lecture seule, destructif, idempotent, monde ouvert. Ces annotations orientent l'interface présentée à l'utilisateur et, souvent, la décision d'exiger ou non une confirmation.</p><p>Le client n'a aucun moyen de les vérifier. Un outil peut se déclarer en lecture seule et écrire. La révision de juillet 2026 a ajouté des métadonnées de cache (<code>ttlMs</code>, <code>cacheScope</code>) sur les réponses d'énumération, ce qui réduit le nombre d'interrogations mais ne change rien au problème de confiance <a href=\"#source-9\" class=\"cite\" data-src=\"9\">[9]</a>.</p>"
      },
      "contexte-modele": {
        title: "Étape 3 — le texte entre dans le contexte",
        body: "<p>À ce point, la description cesse d'être une fiche et devient une instruction active, au même niveau que la demande de l'utilisateur. La plupart des clients chargent l'intégralité des définitions en amont, avant même d'avoir lu la demande <a href=\"#source-10\" class=\"cite\" data-src=\"10\">[10]</a>.</p><p>Deux conséquences se cumulent. La première est économique : ce texte occupe du contexte à chaque tour. La seconde est une question de sécurité : tout texte présent dans le contexte peut influencer le comportement, et le texte des descriptions n'a jamais été soumis à revue par l'organisation qui l'exécute.</p>"
      },
      "trou-de-confiance": {
        title: "La règle, et le trou qu'elle laisse",
        body: "<p>La spécification est nette : les clients <strong>doivent</strong> considérer les annotations d'outils comme non fiables, sauf lorsqu'elles proviennent de serveurs de confiance. Elle demande par ailleurs qu'un humain conserve la capacité de refuser une invocation, et que les entrées d'un appel soient montrées avant transmission <a href=\"#source-7\" class=\"cite\" data-src=\"7\">[7]</a>.</p><p>Elle ne définit nulle part ce qu'est un serveur de confiance, et ne peut pas le faire : la confiance est une décision d'organisation. Le protocole délègue donc la frontière au déployeur — qui, pour la tracer, aurait besoin d'une liste de serveurs approuvés, avec un propriétaire et une date de revue. C'est exactement l'objet qui manque.</p>"
      }
    }
  },
  "schema-04": {
    title: "Un catalogue coûte deux fois",
    regions: {
      "jetons-134k": {
        title: "134 000 jetons, avant la première phrase utile",
        body: "<p>Le chiffre vient de mesures internes publiées par un éditeur sur ses propres déploiements : des définitions d'outils occupant 134 000 jetons avant optimisation <a href=\"#source-11\" class=\"cite\" data-src=\"11\">[11]</a>. Il ne s'agit pas d'un plafond théorique mais d'un relevé sur une configuration réelle.</p><p>Ce coût a une propriété désagréable : il est <strong>récurrent et préalable</strong>. Il se paie avant que la demande soit lue, et à chaque tour de la boucle. Sur une ligne budgétaire agentique, il apparaît mélangé au coût des appels utiles, ce qui le rend presque impossible à contester en comité — et donc à réduire.</p>"
      },
      "chargement-amont": {
        title: "Deux régimes de chargement, même travail",
        body: "<p>Sur un flux de travail documenté joignant deux systèmes d'entreprise, le passage d'un chargement en amont de toutes les définitions à une découverte à la demande fait tomber la consommation de 150 000 à 2 000 jetons <a href=\"#source-10\" class=\"cite\" data-src=\"10\">[10]</a>. L'écart tient au régime de chargement, pas à la qualité du catalogue.</p><p>À retenir pour une décision : le chargement en amont est le <strong>comportement par défaut</strong> de la plupart des clients. L'économie n'arrive donc pas d'elle-même, elle se décide. Et elle déplace le besoin : un outil découvert à la demande doit être décrit assez précisément pour être retrouvé, ce qui renforce l'exigence de tenue du catalogue au lieu de l'alléger.</p>"
      },
      "exactitude": {
        title: "Le coût qu'aucun dossier d'investissement ne contient",
        body: "<p>Sur des évaluations d'appel d'outils, l'introduction d'une recherche d'outils à la demande fait passer un modèle de 49 % à 74 % d'exactitude, et un modèle plus récent de 79,5 % à 88,1 % <a href=\"#source-11\" class=\"cite\" data-src=\"11\">[11]</a>. Les deux séries proviennent d'évaluations internes de l'éditeur et non d'un référentiel public : à lire comme un ordre de grandeur.</p><p>Le mécanisme avancé n'est pas mystérieux. Les échecs dominants sont la sélection du mauvais outil et le passage de mauvais paramètres, favorisés par des noms d'outils trop proches. Un catalogue qui s'allonge sans discipline de nommage fabrique lui-même ses propres confusions.</p>"
      },
      "dimensionnement": {
        title: "L'asymétrie qui rend toute politique déclarative",
        body: "<p>Celui qui publie un outil gagne la visibilité de son travail. Celui qui paie est l'exploitant du socle, sur une ligne où personne n'isole la part des définitions. Les trois coûts d'un outil supplémentaire — contexte consommé, sélection dégradée, surface d'autorisation élargie — sont tous externalisés.</p><p>Tant que cette asymétrie tient, une politique de catalogue restera un document. L'instrumentation existe pourtant déjà : un <strong>budget de jetons de définitions par domaine</strong>, mesuré et publié, se tient avec les mêmes moyens qu'un budget d'appels. C'est la version agentique d'une refacturation interne, et elle transforme « réduisez votre catalogue » en une grandeur que son propriétaire peut suivre.</p>"
      }
    }
  },
  "schema-05": {
    title: "L'état existe, l'usage non",
    regions: {
      "part-active": {
        title: "96,46 % — ce que « actif » signifie vraiment ici",
        body: "<p>Sur les 21 029 enregistrements de version relevés le 6 novembre 2026, 96,46 % portent l'état <code>active</code> <a href=\"#source-12\" class=\"cite\" data-src=\"12\">[12]</a>. Le chiffre serait rassurant s'il décrivait un parc entretenu. Il décrit surtout un état par défaut : <code>active</code> est la valeur qu'une version reçoit à la publication et qu'elle conserve en l'absence de toute action ultérieure.</p><p>Croisé avec les 63,2 % de noms à version unique, le résultat se lit autrement : une large part de ces enregistrements « actifs » sont des publications uniques que personne n'a revisitées. L'état ne distingue pas l'outil tenu de l'outil abandonné.</p>"
      },
      "part-depreciee": {
        title: "3,54 % — 744 versions sur 21 029",
        body: "<p>Le registre offre aux éditeurs un état <code>deprecated</code>, assorti d'un message explicatif de cinq cents caractères au plus <a href=\"#source-5\" class=\"cite\" data-src=\"5\">[5]</a>. Trois versions publiées sur cent le portent.</p><p>Un taux de cet ordre ne décrit pas un écosystème qui déprécie proprement. Il décrit un écosystème où la dépréciation est un geste rare, réservé à quelques éditeurs disciplinés, et où l'abandon silencieux est la norme. Pour un déployeur, la conséquence pratique est qu'on ne peut pas s'appuyer sur ce signal pour nettoyer un catalogue : son absence ne veut rien dire.</p>"
      },
      "aucun-supprime": {
        title: "Zéro suppression : un catalogue ne se vide jamais",
        body: "<p>Aucun enregistrement <code>deleted</code> dans l'échantillon. L'état existe dans l'interface, avec même un paramètre dédié pour les faire réapparaître dans une requête <a href=\"#source-5\" class=\"cite\" data-src=\"5\">[5]</a>, mais le relevé n'en trouve pas.</p><p>Un catalogue public ne rétrécit donc par aucun mécanisme naturel : il s'allonge. Pour une organisation qui alimente son catalogue interne depuis une source publique, cela signifie qu'<strong>aucune force extérieure ne fera le tri</strong>. La seule force de réduction disponible est une décision interne, portée par quelqu'un dont c'est le mandat — ce qui ramène à l'exigence du propriétaire nommé.</p>"
      },
      "version-unique": {
        title: "63,2 % — la longue traîne publiée une fois",
        body: "<p>2 996 des 4 743 noms relevés n'ont jamais publié qu'une seule version <a href=\"#source-12\" class=\"cite\" data-src=\"12\">[12]</a>. La moyenne de 4,43 versions par nom est donc portée par une minorité de projets réellement tenus.</p><p>C'est la mesure la plus directe de ce qu'une organisation importe quand elle ouvre son catalogue sur un registre public : une majorité d'objets dont personne n'a jamais publié de deuxième état. Rien n'interdit qu'un outil à version unique soit excellent et stable. Mais rien ne permet de le distinguer d'un outil abandonné, et c'est le travail que la curation doit faire à la main.</p>"
      }
    }
  },
  "schema-06": {
    title: "Deux horloges",
    regions: {
      "etat-actif": {
        title: "Actif — la fonctionnalité est au contrat",
        body: "<p>Premier des trois états de la politique adoptée en juillet 2026. Une fonctionnalité active fait partie du contrat : les implémentations peuvent l'adopter sans réserve, et les clients peuvent s'y appuyer.</p><p>L'intérêt de nommer cet état n'est pas descriptif. Il est contrastif : à partir du moment où « actif » est un état déclaré, ne pas l'être devient une information. C'est la condition minimale pour qu'une liste d'outils porte un signal de confiance exploitable par une équipe qui ne connaît pas le contexte de publication.</p>"
      },
      "etat-deprecie": {
        title: "Déprécié — fonctionne encore, ne pas adopter",
        body: "<p>La dépréciation ne casse rien. Les fonctionnalités dépréciées dans la révision du 28 juillet 2026 restent pleinement fonctionnelles pendant toute la fenêtre ; la consigne adressée aux nouvelles implémentations est de ne plus les adopter <a href=\"#source-1\" class=\"cite\" data-src=\"1\">[1]</a>.</p><p>C'est la nuance que les catalogues d'entreprise ratent le plus souvent, en confondant « déprécié » et « coupé ». Un état intermédiaire explicite est ce qui permet de communiquer une intention de retrait sans provoquer d'incident, et donc ce qui rend le retrait négociable au lieu d'être subi.</p>"
      },
      "etat-supprime": {
        title: "Supprimé — exige une décision, jamais une péremption",
        body: "<p>Le retrait d'une fonctionnalité exige une proposition distincte, soumise au même processus que son adoption <a href=\"#source-13\" class=\"cite\" data-src=\"13\">[13]</a>. L'écoulement de la fenêtre rend le retrait <em>possible</em>, il ne le déclenche pas.</p><p>Transposé à un catalogue d'entreprise, ce détail de procédure vaut une clause : l'oubli ne vaut pas suppression. Un outil dont la fenêtre de préavis est expirée n'est pas retiré automatiquement ; il entre dans une file d'arbitrage. C'est ce qui évite les deux dérives symétriques, le catalogue qui ne se vide jamais et le catalogue qui se vide par surprise.</p>"
      },
      "fenetre-douze-mois": {
        title: "La fenêtre, et son point de départ",
        body: "<p>Au moins douze mois séparent la dépréciation du premier retrait possible, et la fenêtre se compte depuis la publication de la révision qui marque la fonctionnalité comme dépréciée, non depuis l'adoption de la proposition qui l'a décidée <a href=\"#source-13\" class=\"cite\" data-src=\"13\">[13]</a>. Le détail du point de départ est ce qui rend la garantie opposable.</p><p>Première application concrète : trois fonctionnalités dépréciées le 28 juillet 2026, retrait possible au plus tôt lors de la première révision publiée à partir du 28 juillet 2027 <a href=\"#source-1\" class=\"cite\" data-src=\"1\">[1]</a>. Une date, calculable par n'importe quel exploitant, sans demander son avis au fournisseur.</p>"
      },
      "cote-entreprise": {
        title: "L'autre horloge, celle qui n'existe pas",
        body: "<p>Dans la plupart des organisations, le catalogue d'outils n'a ni état nommé, ni fenêtre de préavis, ni procédure de retrait. Un outil y naît quand une équipe le branche et y meurt quand quelqu'un s'aperçoit qu'il ne répond plus.</p><p>Le contraste est l'argument du dossier : la couche la plus basse de la pile, celle qui ne porte aucune valeur métier, a désormais une politique écrite ; la couche qui porte le droit d'écrire en production n'en a pas. Une direction n'a pas à l'inventer. Elle peut recopier celle du protocole et n'en changer que l'échelle — trois états, une durée, un registre, une décision de retrait.</p>"
      }
    }
  },
  "schema-07": {
    title: "Cinq exigences, par coût croissant",
    regions: {
      "e1-proprietaire": {
        title: "E1 — un propriétaire nommé par outil",
        body: "<p>Une personne ou une équipe, un contact d'alerte, un délai de réponse attendu. Aucun outillage requis : une colonne dans le référentiel que l'organisation tient déjà.</p><p>C'est l'exigence la moins chère et la plus souvent absente, et son effet est indirect : elle rend visibles les outils que personne ne réclame. Un outil sans propriétaire ne peut pas être déprécié, faute de quelqu'un qui ait qualité pour en décider. E1 est donc la condition de possibilité de E3, et le bon ordre des travaux commence par elle.</p>"
      },
      "e2-version": {
        title: "E2 — la version du contrat, distincte de celle du serveur",
        body: "<p>Le contrat vu par un agent est un quadruplet : nom, description, schéma d'entrée, schéma de sortie. Un serveur peut changer de version sans que ce quadruplet bouge, et un changement de description modifie la sélection du modèle sans toucher une ligne de code.</p><p>La version qui compte pour un consommateur est donc celle du contrat, et elle doit être déclarée et comparable. L'enjeu est la reproductibilité d'une analyse <em>a posteriori</em> : sans elle, personne ne peut dire quelle description l'agent a lue le jour de l'incident. C'est aussi l'information qui rend un journal d'appels interprétable six mois plus tard.</p>"
      },
      "e3-depreciation": {
        title: "E3 — une politique de dépréciation écrite",
        body: "<p>Trois états, une durée minimale de préavis, un registre tenu des outils dépréciés avec leur date de retrait au plus tôt, et une décision explicite pour retirer. Le modèle existe et a été éprouvé à l'échelle d'un écosystème : la politique adoptée par le protocole fixe douze mois <a href=\"#source-13\" class=\"cite\" data-src=\"13\">[13]</a>.</p><p>Une organisation choisira une autre durée selon son rythme de livraison — trois mois, six mois. Ce qu'elle ne peut pas faire, c'est ne pas en choisir une. L'intérêt d'un nombre est qu'il se négocie en comité entre l'éditeur, qui veut pouvoir avancer, et l'exploitant, qui veut pouvoir planifier.</p>"
      },
      "e4-separation": {
        title: "E4 — séparer la découverte de l'autorisation",
        body: "<p>Deux listes, deux décisions, deux traces. Qu'un outil figure au catalogue ne vaut pas droit d'exécution ; le droit d'exécution s'attache à un agent, à un commanditaire et à une portée.</p><p>C'est la séparation qui rend les paliers d'autonomie exécutables : on monte un cran en ajoutant un droit d'exécution, et le catalogue reste inchangé. Le protocole a lui-même durci cette chaîne en juillet 2026 — validation obligatoire de l'émetteur, liaison des identifiants client à l'émetteur qui les a délivrés <a href=\"#source-9\" class=\"cite\" data-src=\"9\">[9]</a>. Une direction qui fusionne découverte et autorisation dans un seul réglage de console se prive de tout palier intermédiaire.</p>"
      },
      "e5-export": {
        title: "E5 — une déclaration exportable hors console",
        body: "<p>Contenu minimal, par outil : nom, version du contrat, propriétaire, état de cycle de vie, date de retrait au plus tôt, graphe des habilitations. Forme : export périodique, format documenté, obtenu sans intervention humaine du fournisseur.</p><p>C'est la jumelle des clauses déjà écrites pour les journaux et pour les appariements d'identité, et elle répond à la même asymétrie : en cas de contrôle, l'incapacité du fournisseur à produire devient la défaillance du déployeur. Le rattachement réglementaire existe — surveillance humaine nommément désignée et conservation des journaux sous contrôle du déployeur <a href=\"#source-14\" class=\"cite\" data-src=\"14\">[14]</a>. Le test d'acceptation se joue avant la signature, pas après l'incident.</p>"
      }
    }
  }
}
