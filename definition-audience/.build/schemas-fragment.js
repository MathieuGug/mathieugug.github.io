{
  "schema-01": {
    title: "La pile d'activation en 2026",
    regions: {
      "entrepot": {
        title: "L'entrepôt · le lakehouse",
        body: "L'étage qui a gagné le débat. Les trois éditeurs de plateformes clients y ont replié leur stockage, chacun à sa manière : fédération de lecture pour Salesforce [3], requête poussée sans stockage pour Adobe [5], descente complète du produit pour Databricks [7]. L'entrepôt tient désormais les tables clients, les événements, le catalogue de gouvernance et les habilitations. Ce qu'il ne tient pas, c'est la règle qui décide quelle population sera activée demain. Il est devenu le lieu de la donnée sans devenir le lieu de la décision."
      },
      "couche-semantique": {
        title: "La couche sémantique normalisée",
        body: "L'acquis de 2025-2026 : un format commun pour déclarer des jeux de données, des relations, des mesures, des dimensions et du contexte, versionné et lisible par les agents comme par les outils décisionnels [8][12]. Toutes ces primitives répondent à la question « combien ». Aucune ne répond à la question « qui ». Une audience est un prédicat d'appartenance porté par une fenêtre, une règle d'identité et une finalité — quatre choses qu'un filtre de dimension ne porte pas. Voir le schéma 04."
      },
      "console": {
        title: "La console d'activation",
        body: "L'étage qui n'a pas bougé. Le segment s'y compose à la souris, avec les valeurs par défaut de l'outil pour fenêtre et pour règle d'identité. La définition y est rarement versionnée au-delà de l'état courant, jamais publiée dans le catalogue, et invisible de la couche sémantique. C'est pourtant elle qui décide de la dépense média engagée et du dénominateur du bilan. Le zéro copie a déplacé la donnée d'un étage ; il a laissé l'écriture ici."
      },
      "activation": {
        title: "Les destinations",
        body: "Régies, messagerie, personnalisation sur site, salles blanches. Chaque destination applique ses propres règles de normalisation avant de reconnaître les membres d'une audience, jusqu'au détail de la ponctuation des adresses [13]. La conséquence est mécanique : la même audience envoyée à deux destinations produit deux populations différentes pour des raisons purement syntaxiques. Il n'y a donc pas une population activée mais une par destination. Voir le schéma 05."
      },
      "deplacement": {
        title: "Le déplacement à décider",
        body: "Faire descendre la définition d'un étage : la déclarer comme un objet nommé à côté des mesures et des dimensions, avec ses quatre composants explicites, et la compiler vers l'entrepôt à l'exécution. Le standard ne fournit pas cet objet, ce qui laisse une position à occuper plutôt qu'un blocage. Ce que le déplacement change : la règle survit au fournisseur d'activation, elle se compare d'une exécution à l'autre, et elle se relit sans ouvrir la console de personne. C'est le montage C du schéma 06."
      }
    }
  },
  "schema-02": {
    title: "Anatomie d'une définition d'audience",
    regions: {
      "predicat": {
        title: "Le prédicat de population",
        body: "La condition d'appartenance, exprimée sur des attributs et des événements. C'est la seule partie que l'interface fait composer et que l'organisation croit posséder. Elle est effectivement écrite quelque part — souvent dans une console, parfois dans un modèle versionné. Retenir la nuance : « écrit » ne veut pas dire « conservé », « comparable » ni « exportable ». Le test d'acceptation posé à la décision 2 du dossier reste le même : peut-on recalculer l'audience à l'identique sans la plateforme qui l'héberge ?"
      },
      "fenetre": {
        title: "La fenêtre temporelle",
        body: "Sur quelle période les événements comptent, et à quelle date la population est arrêtée. Une audience « clients actifs » sur quatre-vingt-dix jours glissants et la même sur l'exercice comptable n'ont pas les mêmes membres, et l'étiquette ne le dit pas. La fenêtre est presque toujours un réglage par défaut hérité de l'outil, c'est-à-dire une décision que personne n'a prise. C'est ce composant qui produit l'écart entre la population activée et la population recalculée au bilan (schéma 05)."
      },
      "identite": {
        title: "La règle de résolution d'identité",
        body: "À quel niveau deux enregistrements désignent la même personne : identifiant client déterministe, adresse électronique normalisée, foyer, appareil, appariement probabiliste. Ce choix change la cardinalité de la population avant même que le prédicat s'applique. Il est hérité de la configuration de la plateforme et traité comme un paramètre d'installation. Le registre des audiences propose de l'expliciter et d'y adjoindre le taux de résolution constaté à la dernière exécution."
      },
      "finalite": {
        title: "Le rattachement de finalité",
        body: "Au titre de quel traitement la population est constituée, et sur quelle base. Le règlement européen impose des finalités déterminées, explicites et légitimes, et l'autorité française a rappelé qu'un consentement recueilli pour une finalité ne couvre pas une transmission à une finalité distincte [2]. Ce composant vit habituellement dans un registre séparé, tenu par d'autres personnes, à une autre fréquence. La conformité se découple ainsi de l'exécution, et l'écart n'apparaît qu'au contrôle."
      }
    }
  },
  "schema-03": {
    title: "Zéro copie : ce qui bouge et ce qui ne bouge pas",
    regions: {
      "col-salesforce": {
        title: "Salesforce Data 360 · fédération zéro copie",
        body: "La donnée reste dans l'entrepôt et sert à la résolution d'identité comme à la segmentation, sans duplication [3]. Les limites documentées disent où passe la frontière : les objets doivent correspondre au modèle Customer 360 pour être interrogeables, le nombre d'audiences appuyées sur des jeux externes est plafonné, leur recalcul intervient à intervalle de douze heures, et chaque aperçu, activation ou résolution déclenche une requête réelle sur l'entrepôt — d'où une double facturation, crédits de plateforme et calcul d'entrepôt [4]."
      },
      "col-adobe": {
        title: "Adobe · composition d'audience fédérée",
        body: "La composition est traduite en SQL poussé vers le moteur de l'entrepôt ; seules les identités résultantes et les attributs sélectionnés remontent. Le service ne stocke aucune donnée client, ce qui reporte sur le client la conformité aux demandes d'effacement et impose de connecter des bases dans la région du bac à sable correspondant [5]. La contrepartie est visible à l'entrée : une audience composée à l'extérieur n'apporte que sa colonne d'identité primaire, et un identifiant sans correspondance crée un profil orphelin [6]."
      },
      "col-databricks": {
        title: "Databricks CustomerLake · la plateforme descend",
        body: "Annoncée le 16 juin 2026, elle installe profil unifié, résolution d'identité, construction d'audiences, activation et personnalisation à l'intérieur du lakehouse, sous la gouvernance du catalogue existant [7]. C'est l'architecture la plus proche de la thèse du dossier, avec deux réserves. Le produit a été présenté en avant-première privée, et une avant-première n'est pas un retour d'expérience. Et faire descendre la composition sous un catalogue règle le contrôle d'accès sans régler, à soi seul, la forme de la définition."
      },
      "ligne-definition": {
        title: "La ligne que le zéro copie n'a pas déplacée",
        body: "Dans les trois colonnes, l'objet qui circule entre l'entrepôt et l'activation est une population, jamais un prédicat. Une audience définie dans l'entrepôt arrive dans la plateforme comme un résultat : irrévisable, incomparable, non auditable. C'est cette asymétrie qui rend le sujet décisionnel plutôt que technique, parce qu'elle détermine ce dont l'organisation disposera le jour où elle voudra vérifier un chiffre, comparer deux exécutions ou changer de fournisseur."
      }
    }
  },
  "schema-04": {
    title: "La couche sémantique s'est arrêtée avant l'audience",
    regions: {
      "jalon-osi": {
        title: "23 septembre 2025 · l'initiative de format commun",
        body: "Snowflake annonce avec Salesforce, dbt Labs, BlackRock et RelationalAI une initiative destinée à faire cesser la fragmentation des définitions entre outils [8]. Le modèle visé est explicite dès l'origine : des jeux de données, des relations avec leur logique de jointure et leur cardinalité, des mesures, des dimensions et des métadonnées de contexte. Le périmètre est fixé là, et il ne bougera pas : la normalisation porte sur les objets de l'analyse, pas sur les objets de l'activation."
      },
      "jalon-metricflow": {
        title: "14 octobre 2025 · MetricFlow sous Apache 2.0",
        body: "dbt Labs place le moteur de compilation de sa couche sémantique sous licence ouverte [9]. La motivation affichée dit quel utilisateur cette couche s'est donné : un agent qui compile contre des définitions gouvernées rend la même réponse partout. C'est l'agent conversationnel qui a fait aboutir une normalisation que dix ans de projets décisionnels n'avaient pas produite — et c'est aussi ce qui explique le périmètre retenu, centré sur l'indicateur."
      },
      "jalon-ga": {
        title: "Mars et avril 2026 · les implémentations en disponibilité générale",
        body: "Le 2 mars 2026, l'interrogation des vues sémantiques de Snowflake en SQL standard passe en disponibilité générale [10]. Le 2 avril 2026, les vues de métriques du catalogue de Databricks suivent, avec séparation explicite entre la définition d'une mesure et les champs servant à la grouper, la filtrer et l'agréger [11]. Les deux implémentations majeures convergent sur la même grammaire à quelques semaines d'intervalle. Aucune des deux ne nomme d'objet population."
      },
      "jalon-apache": {
        title: "Juin 2026 · la donation à la fondation Apache",
        body: "L'initiative est donnée à la fondation Apache et entre en incubation, la coalition étant passée de dix-sept partenaires initiaux à plus de cinquante organisations [12]. C'est le moment où le périmètre cesse d'être une décision d'éditeur pour devenir un fait public et opposable : on peut désormais désigner précisément ce que la norme couvre et ce qu'elle laisse dehors. Toute extension ultérieure devra passer par la gouvernance de la fondation, ce qui rend le trou durable à court terme."
      },
      "trou-population": {
        title: "La primitive manquante",
        body: "Une audience n'est ni une mesure ni une dimension : c'est un prédicat d'appartenance appliqué à une date, sous une règle d'identité, pour une finalité. On peut la bricoler avec les primitives existantes — un filtre de dimension, un indicateur booléen, une table matérialisée — mais bricoler n'est pas normaliser. Un filtre ne porte ni sa fenêtre, ni sa règle d'identité, ni sa finalité, ne se versionne pas comme un objet nommé et ne se compare pas d'une exécution à l'autre. Le trou est une position à occuper : l'extension coûte quelques semaines."
      }
    }
  },
  "schema-05": {
    title: "Une audience, quatre populations",
    regions: {
      "definie": {
        title: "N₀ · la population définie",
        body: "Le prédicat s'exécute sur l'entrepôt et renvoie un nombre. C'est celui qui apparaît dans la présentation interne, et le seul des quatre que l'organisation contrôle entièrement. Il est aussi le seul à ne dépendre d'aucun tiers, ce qui explique qu'il soit systématiquement le nombre cité — et rarement celui qui a servi à quoi que ce soit."
      },
      "resolue": {
        title: "N₁ · la population résolue",
        body: "Le prédicat s'applique à des enregistrements, la campagne s'adresse à des personnes. Le passage dépend de la règle d'identité : résoudre au foyer, à l'individu, à l'adresse électronique normalisée ou à l'identifiant client ne donne pas la même cardinalité. C'est l'étape la moins souvent chiffrée de la chaîne, parce qu'elle est traitée comme un réglage d'installation plutôt que comme une décision. Le registre des audiences propose d'y adjoindre le taux de résolution constaté."
      },
      "activee": {
        title: "N₂ · la population activée",
        body: "La taille appariée vaut le segment envoyé moins les enregistrements invalides et moins les non appariés [13]. Les règles de normalisation diffèrent d'une destination à l'autre, jusqu'à la ponctuation des adresses : certaines plateformes exigent la suppression des points avant l'arrobase, d'autres non. Deux destinations rendent donc deux populations différentes pour des raisons purement syntaxiques. Il n'y a pas un N₂ mais un par destination, ce qui interdit de traiter ce nombre comme un dénominateur unique."
      },
      "mesuree": {
        title: "N₃ · la population mesurée",
        body: "Au bilan, quelqu'un recalcule l'audience pour comparer exposés et non exposés. S'il la recalcule à la date du bilan plutôt qu'à celle de l'activation, la fenêtre glissante a bougé : la population n'est ni un sous-ensemble ni un sur-ensemble des précédentes, c'est une autre composition. Personne n'a modifié le prédicat. Le biais qui en résulte ne produit ni valeur aberrante ni intervalle anormalement large, donc il ne se voit pas dans les résultats. La décision 3 du dossier le ferme pour le prix d'une table."
      }
    }
  },
  "schema-06": {
    title: "Trois montages, trois factures",
    regions: {
      "montage-console": {
        title: "Montage A · la définition reste dans la console",
        body: "Le marketing opérationnel compose sans passer par la data, ce qui est le vrai argument de ce montage : la boucle d'itération est courte. Le prix se paie à la sortie. L'outil ne versionne guère que l'état courant et un journal d'accès ; ce qui survit à un départ est la liste des membres à la date d'export, pas la règle. La facture de sortie a pour poste principal la ré-écriture de toutes les définitions actives, et elle n'apparaît qu'au moment où il est trop tard pour la faire baisser."
      },
      "montage-entrepot": {
        title: "Montage B · la définition vit dans l'entrepôt",
        body: "Le prédicat est un modèle versionné dans le dépôt de transformation, matérialisé en table, transmis à la plateforme comme une liste. C'est l'architecture composable dans sa forme courante. Elle gagne l'auditabilité côté data et le coût de calcul devient visible parce qu'il est facturé. Son angle mort est réel : la plateforme d'activation reçoit toujours une table de membres, qu'elle ne peut ni réviser ni comparer. Le point de friction quotidien reste l'aller-retour entre le marketing et la data."
      },
      "montage-semantique": {
        title: "Montage C · la définition vit dans la couche sémantique",
        body: "Le prédicat est déclaré comme un objet nommé à côté des mesures et des dimensions, avec ses quatre composants, compilé vers l'entrepôt à l'exécution et exposé aux outils aval par la même interface que les indicateurs. Tout survit au départ, y compris la comparabilité entre exécutions. Le coût est le travail d'extension, puisque le standard ne fournit pas l'objet [12]. Le risque est de construire seul une extension qu'une norme ultérieure contredira ; il se mitige en restant près de la grammaire existante."
      },
      "critere-verifiabilite": {
        title: "Le critère de tri",
        body: "Une seule question suffit dans la plupart des cas : combien de vos audiences alimentent un chiffre présenté à la direction ? En dessous d'une dizaine, le montage A tient. De dix à cinquante, le montage B offre le rapport coût-bénéfice raisonnable, à condition d'accepter son angle mort. Au-delà, ou dès qu'un test d'incrémentalité annuel structure le plan média, le montage C se justifie — non pour l'élégance, mais parce que la comparabilité entre deux exécutions devient l'actif principal."
      }
    }
  }
}
