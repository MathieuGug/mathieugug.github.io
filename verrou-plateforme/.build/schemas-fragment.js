{
  "schema-01": {
    title: "La pile agentique rangée par réversibilité",
    regions: {
      "couche-modele": {
        title: "Couche 1 · Le modèle",
        body: "C'est l'étage que tous les comparatifs comparent, et c'est le seul où le coût de sortie est connu d'avance. Les trois grands fournisseurs de nuage distribuent des modèles qu'ils n'ont pas entraînés, et la bascule de l'un à l'autre se ramène à une campagne de non-régression sur les invites et les sorties.\n\nCe travail n'est pas gratuit. Il est **borné** : on sait ce qu'on teste, on sait quand on a fini, et on peut le chiffrer avant de commencer. C'est exactement ce qui manque aux trois couches du dessous. Le coût de re-qualification imposé par le rythme de sortie des modèles a été traité dans un dossier antérieur [1]."
      },
      "couche-cadre": {
        title: "Couche 2 · Le cadre et les protocoles",
        body: "Kits de développement d'agents, LangGraph, CrewAI d'un côté ; MCP et A2A de l'autre. Cette couche est la grande réussite d'ouverture des dix-huit derniers mois : MCP a été confié à une fondation en décembre 2025, A2A l'a rejointe le 17 août 2026 [10], et les cadres de programmation sont pour la plupart utilisables sur plusieurs plateformes.\n\nLe résultat pratique : ce qui coûtait un adaptateur par couple agent-outil se recode aujourd'hui en une semaine. C'est réel, et c'est la partie du problème qui se résolvait déjà."
      },
      "couche-execution": {
        title: "Couche 3 · L'exécution gérée",
        body: "Sessions, isolation entre locataires, mise à l'échelle, redémarrage. Changer de fournisseur à cet étage veut dire ré-empaqueter les agents et basculer le trafic. C'est un chantier technique lourd, parfois plusieurs mois.\n\nMais il a une propriété que les couches du dessous n'ont pas : il est **entièrement sous votre contrôle**. Aucune de ses étapes ne dépend de la bonne volonté d'un tiers, ni de la disponibilité d'une personne extérieure à l'équipe. C'est un projet, pas une négociation."
      },
      "couche-etat": {
        title: "Couche 4 · L'état accumulé",
        body: "Mémoire longue, catalogue d'outils gouverné, identités déléguées, jeu d'évaluation, traces d'exécution. Cinq objets qui n'existaient pas au démarrage, qui grossissent sans que personne ne décide de leur croissance, et dont aucun n'a de format d'échange normalisé au 2 septembre 2026.\n\nDeux caractéristiques les distinguent des couches supérieures. Rien ne s'y transfère : tout se **reconstitue**. Et la durée de la reconstitution ne dépend pas de vos moyens, mais du rythme d'usage de vos utilisateurs et de la disponibilité de vos propriétaires métier.\n\nAucune obligation d'équivalence fonctionnelle ne s'y applique, la garantie du règlement européen s'arrêtant à l'infrastructure [14]."
      },
      "renversement": {
        title: "Le renversement du critère",
        body: "La règle qui organise tout le schéma : **la visibilité en avant-vente est inversement proportionnelle au pouvoir de verrouillage**.\n\nOn peut faire la démonstration d'un modèle en dix minutes. On ne peut faire la démonstration ni de dix-huit mois de mémoire accumulée, ni de quatre-vingts outils publiés au catalogue interne, ni de deux cents habilitations d'agents dans un annuaire. Ces objets n'existent pas au moment où l'on signe, et ils existent au moment où l'on voudrait partir.\n\nD'où la conséquence méthodologique : un comparatif de plateformes construit sur ce qui est démontrable porte, par construction, sur ce qui ne verrouille pas."
      }
    }
  },
  "schema-02": {
    title: "Les cinq surfaces d'état",
    regions: {
      "surface-memoire": {
        title: "S1 · La mémoire longue",
        body: "Ce que l'agent retient d'une session à l'autre, produit par un traitement propriétaire : extraction, consolidation, résolution de contradictions, oubli.\n\nGoogle la commercialise comme Memory Bank, adossée à Agent Engine et utilisable depuis d'autres cadres logiciels [3]. AWS la facture dans AgentCore à l'enregistrement créé et à l'enregistrement récupéré [4]. Microsoft la rattache aux fils de conversation de Foundry.\n\nMême avec un export intégral et lisible, la fonction ne redémarre pas ailleurs : les enregistrements ont été produits par la politique d'extraction de la plateforme d'origine, et la plateforme de destination les récupérera selon la sienne."
      },
      "surface-outils": {
        title: "S2 · Le catalogue d'outils gouverné",
        body: "L'inventaire des actions que les agents ont le droit d'appeler, avec ses propriétaires, ses versions et ses habilitations.\n\nGoogle l'a formalisé en décembre 2025 avec le Cloud API Registry, alimenté par Apigee et exposé aux développeurs par un objet `ApiRegistry` [5]. AWS l'expose comme AgentCore Gateway, facturé aux opérations et aux outils indexés [4].\n\nLe protocole d'appel est commun, la gouvernance ne l'est pas. Une organisation qui a publié quatre-vingts outils n'a pas quatre-vingts fichiers à déplacer : elle a quatre-vingts déclarations d'appartenance et un graphe d'habilitations qui n'existe que dans la console de son fournisseur."
      },
      "surface-identite": {
        title: "S3 · L'identité déléguée",
        body: "Le compte au nom duquel l'agent agit, ses jetons, sa chaîne de délégation.\n\nMicrosoft en a fait un type d'identité à part entière dans Entra ID, avec son propre cycle de vie de gouvernance et un annuaire unifié des agents créés sur ses différentes surfaces, disponible en version générale depuis avril 2026 [6][7]. AWS répond au même besoin avec AgentCore Identity et son coffre à jetons de rafraîchissement [4][11].\n\nC'est une avancée réelle de gouvernance et le verrou le plus dur du marché. Un annuaire ne s'exporte pas : il se reconstruit, habilitation par habilitation, avec une re-signature métier à chaque ligne."
      },
      "surface-evaluation": {
        title: "S4 · Le jeu d'évaluation",
        body: "L'ensemble des cas de test qui disent si l'agent fait encore ce qu'on attend de lui. Il se construit par sédimentation, chaque incident y ajoutant un cas.\n\nC'est le seul actif de la liste qui soit réellement portable, et il l'est à une condition unique : avoir été écrit hors plateforme. Un jeu de cas est un fichier de paires entrée / comportement attendu, rien n'y est propriétaire tant qu'on ne l'a pas rédigé dans le formalisme d'un outil intégré.\n\nLa tentation de l'y écrire est forte, parce que l'outil intégré est gratuit à l'usage et déjà branché sur les traces. Le prix de cette gratuité est que le jeu devient un objet de la plateforme."
      },
      "surface-traces": {
        title: "S5 · Les traces d'exécution",
        body: "Le journal de ce que l'agent a fait, avec quels outils, dans quel ordre. Matière première de toute analyse de coût, de toute défense juridique [8] et de tout diagnostic de régression.\n\nUne grammaire commune émerge du côté des conventions sémantiques d'OpenTelemetry pour l'IA générative, mais elle reste expérimentale sur la partie agent et n'émet aucun attribut de coût en monnaie [12].\n\nLa perte est moins celle des fichiers que celle de la **continuité**. Une organisation qui change de plateforme perd la comparabilité de sa série historique au moment exact où cette série lui permettrait de juger si la bascule a été bénéfique."
      }
    }
  },
  "schema-03": {
    title: "Ce que les protocoles standardisent, et ce qu'ils laissent",
    regions: {
      "couvert-mcp": {
        title: "MCP · l'appel",
        body: "MCP normalise la manière dont un agent découvre un outil, lit sa signature, l'invoque et reçoit un résultat. C'est un acquis réel : avant lui, chaque cadre logiciel imposait sa propre convention, et brancher un agent sur un système d'information demandait un adaptateur par couple.\n\nLe protocole a été confié à une fondation en décembre 2025, avec parmi les membres fondateurs les éditeurs de modèles et les trois grands fournisseurs de nuage [10].\n\nLa portée exacte de ce qui est réglé mérite d'être tenue : le **fil**, et rien d'autre."
      },
      "couvert-a2a": {
        title: "A2A · la conversation",
        body: "A2A normalise l'échange entre agents de fournisseurs différents : carte d'agent signée, délégation de tâche, suivi d'exécution. Au bout d'un an, plus de 150 organisations le soutiennent et il est intégré dans les plateformes de Google, Microsoft et AWS [9].\n\nDeux limites à garder en tête. Une carte signée authentifie une carte et son émetteur, dans la mesure où le destinataire peut rattacher la clé à l'organisation qu'elle prétend représenter. Elle ne transporte aucune politique d'autorisation d'entreprise.\n\nEt la feuille de route reste ouverte sur la spécification d'interopérabilité, le registre, les tests et la sécurité [9]."
      },
      "laisse-gouvernance": {
        title: "Laissé au fournisseur · la gouvernance du catalogue",
        body: "Quatre questions qu'aucun protocole ne traite, et qui sont exactement celles d'un catalogue d'outils d'entreprise :\n\n**Qui possède un outil** dans l'organisation, et qui peut le publier. **Comment on le versionne**, et comment on le déprécie sans casser les agents qui l'appellent. **Quel agent a le droit de l'appeler**, dans quel contexte et avec quelles limites. **Comment on prouve après coup** quel agent l'a appelé et pour le compte de qui.\n\nChaque fournisseur y répond dans son propre plan de contrôle : Cloud API Registry côté Google [5], AgentCore Gateway côté AWS [4], registre d'outils de Foundry côté Microsoft. Les trois parlent MCP sur le fil, aucun ne parle le même langage sur la gouvernance."
      },
      "laisse-autorisation": {
        title: "Laissé au fournisseur · l'autorisation d'entreprise",
        body: "Le transfert des protocoles à une fondation commune ne standardise pas les politiques d'autorisation d'entreprise. L'habilitation par agent et par contexte, la conservation de la chaîne de délégation et la reconstitution après coup restent des objets du fournisseur.\n\nC'est le point qui rend la surface identité si coûteuse : elle ne bénéficie d'aucun des acquis d'ouverture des dix-huit derniers mois. Microsoft a construit un type d'identité dédié dans son annuaire [6][7], AWS un service de courtage avec coffre à jetons [4][11], Google un rattachement à sa propre gestion des identités et des accès. Trois réponses, trois formats, zéro passerelle."
      },
      "groupes-ouverts": {
        title: "Les chantiers encore ouverts",
        body: "La fondation qui héberge MCP et A2A compte des groupes de travail sur l'identité, la sécurité, l'observabilité, le commerce, les flux de travail, l'exactitude et l'alignement réglementaire [10].\n\nLa lecture à en faire est simple et un peu sèche : **un groupe de travail ouvert est un problème non résolu**. La présence de ces groupes est une bonne nouvelle pour 2027 ou 2028. Elle ne change rien à ce qu'une direction data signe en 2026, et elle ne doit pas être présentée en comité comme une garantie de portabilité future.\n\nLe déséquilibre qui structure le schéma tient en une phrase : la colonne de gauche se re-branche en une semaine, la colonne de droite se re-négocie en trimestres."
      }
    }
  },
  "schema-04": {
    title: "Portabilité déclarée contre coût de reconstitution",
    regions: {
      "quadrant-perdu": {
        title: "Perdu, et assumé",
        body: "La mémoire longue et les traces d'exécution sont dans ce quadrant : le fournisseur ne promet pas grand-chose sur leur transfert, et la reconstitution est coûteuse.\n\nContre-intuitivement, c'est le quadrant le moins dangereux. Un risque annoncé est un risque qu'on provisionne : il entre dans le dossier d'investissement, il apparaît dans l'estimation annuelle du coût de sortie, et personne ne découvre son existence au milieu d'une migration.\n\nLa règle générale du schéma : le risque géré est le risque le moins cher, quel que soit son montant."
      },
      "quadrant-piege": {
        title: "Le piège · l'export qui ne restitue pas la fonction",
        body: "L'identité déléguée et le catalogue d'outils sont ici, et c'est le quadrant que les plans de migration ratent.\n\nLe fournisseur restitue bien quelque chose, et ce quelque chose est lisible : une liste d'identités, une liste d'outils, des descripteurs. La fonction, elle, ne redémarre pas. Un export d'identités ne contient pas les décisions d'habilitation qui les ont créées, ni les propriétaires métier qui devront les re-signer. Un export d'outils ne contient pas le graphe des droits d'appel ni l'historique de version qui permet une dépréciation ordonnée.\n\nC'est aussi le quadrant où le règlement européen produit l'illusion la plus forte : l'interface ouverte de l'article 30 §2 est réelle, et elle livre exactement ce type d'export [14].\n\nLa question à poser au fournisseur découle directement : « que restitue votre export, et qu'est-ce qui redémarre avec ? »"
      },
      "jeu-evaluation": {
        title: "Le seul actif réellement portable",
        body: "Le jeu d'évaluation occupe seul le quadrant favorable, et il ne l'occupe qu'à une condition : vivre dans votre dépôt de sources plutôt que dans la console du fournisseur.\n\nÉcrit chez vous, il reste exécutable partout et son coût de migration est nul. Saisi dans l'outil intégré, il quitte ce quadrant et rejoint le précédent.\n\nC'est la décision la plus rentable du dossier parce qu'elle ne coûte rien, qu'elle se prend le premier jour du projet, et qu'elle est **irrattrapable le dernier**. Un jeu d'évaluation constitué par sédimentation sur dix-huit mois ne se ré-exporte pas d'une console : il se réécrit."
      }
    }
  },
  "schema-05": {
    title: "La ligne de partage du règlement européen sur les données",
    regions: {
      "art-30-1": {
        title: "Article 30 §1 · l'équivalence fonctionnelle",
        body: "Pour les services d'infrastructure, le fournisseur d'origine doit prendre les mesures nécessaires pour permettre l'**équivalence fonctionnelle** : le rétablissement, à partir des données et actifs numériques exportables du client, d'un niveau minimal de fonctionnalité dans l'environnement d'un nouveau fournisseur du même type de service [13][14].\n\nL'obligation ne s'arrête pas à la livraison d'un fichier. Elle porte sur l'information, la documentation technique, le support et, le cas échéant, les outils nécessaires.\n\nC'est le dispositif le plus ambitieux jamais adopté contre l'enfermement propriétaire dans le nuage. Il porte sur la **fonction**, pas seulement sur la donnée."
      },
      "art-30-2": {
        title: "Article 30 §2 · les interfaces ouvertes",
        body: "Pour tous les autres services — plateforme applicative et logiciel en tant que service — l'obligation change de nature : mettre à disposition gratuitement des interfaces ouvertes destinées à faciliter le processus de changement, pour le client comme pour le fournisseur de destination [14].\n\nLe texte est explicite sur ce qu'il ne fait pas : il ne crée pas d'obligation de faciliter l'équivalence fonctionnelle pour les fournisseurs autres que ceux du modèle d'infrastructure.\n\nL'obligation porte donc sur le tuyau, et non sur ce qui redémarre au bout. C'est exactement la différence entre le quadrant « perdu et assumé » et le quadrant « piège » du schéma précédent."
      },
      "angle-mort": {
        title: "L'angle mort · où se rangent les plateformes agentiques",
        body: "Agent Engine, AgentCore, Foundry Agent Service et Agentforce sont vendus comme des services gérés dont le client ne pilote ni l'exécution, ni le stockage sous-jacent, ni les traitements de distillation de la mémoire. Ils relèvent de la plateforme applicative quand ils ne relèvent pas du logiciel en tant que service.\n\nConséquence : **la garantie la plus forte du droit européen sur la portabilité s'arrête exactement à l'étage où commence la pile agentique.**\n\nDeux réserves à porter. La qualification d'un service donné relève de l'analyse juridique au cas par cas, et une plateforme fortement paramétrable pourrait plaider autrement. Et la portée effective des interfaces ouvertes dépendra de la pratique des autorités nationales. Aucune décision ni orientation publiée ne tranche ce point à ce jour."
      },
      "frise-2027": {
        title: "Le calendrier de suppression des frais",
        body: "Trois échéances, toutes issues du chapitre VI [13][14] :\n\n**12 septembre 2025** — transparence intégrale sur tous les coûts liés au changement et à la migration.\n\n**12 janvier 2026** — interdiction des pénalités de sortie, frais de migration réduits au strict nécessaire.\n\n**12 janvier 2027** — la sortie devient entièrement gratuite, contrats en cours compris.\n\nLa lecture qui compte pour une direction data : la sortie **gratuite** et la sortie **exécutable** sont deux obligations différentes, et le calendrier ne porte que sur la première. Au 12 janvier 2027, une entreprise européenne ne paiera plus de frais de sortie d'une plateforme d'agents. Elle n'aura toujours aucun droit opposable à ce que le résultat de cette sortie soit fonctionnel ailleurs."
      }
    }
  },
  "schema-06": {
    title: "La facture de sortie en cinq postes",
    regions: {
      "poste-reaccumulation": {
        title: "P1 · Re-accumulation de la mémoire",
        body: "Le poste s'exprime en **mois de trafic réel**, jamais en jours-homme. Le nouvel agent n'atteint la qualité de personnalisation de l'ancien qu'après une durée qui dépend du rythme d'usage de vos utilisateurs.\n\nC'est le seul poste de la facture que le budget ne peut pas accélérer : doubler l'équipe de migration n'y change rien. C'est aussi celui qui commande le poste 5, puisque la période de double exploitation dure au moins le temps que le nouvel agent devienne comparable.\n\nNon réductible par une décision de gestion, il ne peut être que provisionné et surveillé."
      },
      "poste-rehabilitation": {
        title: "P2 · Ré-habilitation des identités",
        body: "L'unité est le produit du nombre d'habilitations par le délai moyen de re-signature par un propriétaire métier.\n\nC'est le poste que les plans de migration sous-estiment le plus systématiquement, parce qu'il ressemble à un travail technique et n'en est pas un. Recréer chaque agent comme sujet dans un annuaire différent, retrouver ses droits, faire re-signer chaque habilitation, ré-établir les consentements délégués auprès des systèmes tiers : ces tâches mobilisent des personnes extérieures à l'équipe projet, qui n'ont aucun intérêt à la migration.\n\nRéductible en partie, par la décision D5 : tenir le registre des habilitations en double, hors de l'annuaire du fournisseur."
      },
      "poste-recatalogage": {
        title: "P3 · Re-catalogage des outils",
        body: "Un outil × un propriétaire × un historique de version, à redéclarer dans un autre plan de contrôle.\n\nLe poste se scinde nettement en deux. Le branchement protocolaire est rapide, MCP ayant fait son travail. La redéclaration des règles d'accès, des propriétaires et des politiques de dépréciation prend des trimestres, parce qu'elle rejoue les mêmes arbitrages que la première fois.\n\nRéductible en partie, si le catalogue interne est documenté hors console — ce qui est rarement le cas quand la console offre justement de le tenir."
      },
      "poste-reevaluation": {
        title: "P4 · Ré-étalonnage de l'évaluation",
        body: "Zéro, ou la totalité. Il n'y a pas d'intermédiaire, et c'est ce qui rend ce poste remarquable.\n\nSi le jeu d'évaluation vit dans votre dépôt de sources, la migration ne coûte rien : les mêmes fichiers s'exécutent sur la nouvelle plateforme. S'il a été saisi dans la console du fournisseur, il faut le réécrire, cas par cas, sans garantie de retrouver les régressions historiques qu'il encodait.\n\nC'est le seul poste de la facture qu'une décision gratuite, prise le premier jour, ramène définitivement à zéro."
      },
      "poste-double-run": {
        title: "P5 · Double exploitation",
        body: "Deux plateformes facturées en parallèle, multipliées par la durée de bascule.\n\nOn ne bascule pas un agent en contact client d'un jour à l'autre : il faut une période de recouvrement pendant laquelle l'ancien dispositif reste disponible, ne serait-ce que pour reprendre la main sur les cas où le nouveau échoue.\n\nCe poste est **dérivé du poste 1**. Sa durée n'est pas fixée par un plan de migration mais par le temps que met la mémoire longue du nouvel agent à devenir comparable. Le chiffrer suppose donc d'avoir chiffré P1 d'abord, ce que peu d'organisations font."
      }
    }
  },
  "schema-07": {
    title: "Six décisions, classées par la fenêtre où elles restent possibles",
    regions: {
      "avant-signature": {
        title: "Fenêtre 1 · Avant signature",
        body: "**D1 · Un droit d'export périodique et automatisé de l'état, et pas seulement des données.** La clause nomme les cinq surfaces, impose un format documenté et un rythme, et prévoit que l'export s'exécute sans intervention du fournisseur. Un export sur demande est un export qui n'aura pas lieu au moment de la rupture.\n\n**D2 · Une définition contractuelle de ce qui est exportable, opposable et versionnée.** Le règlement européen impose des clauses minimales et la transparence sur la migration [13]. Il n'impose pas au fournisseur de figer sa définition de l'exportable, qui peut donc se réduire au fil des versions du service.\n\n**D3 · Une clause de communication des traces et des versions**, dans un délai et un format exploitables. Elle relève du même besoin probatoire que celui identifié en matière de responsabilité [8], et elle sert deux fois : pour se défendre, et pour partir."
      },
      "en-exploitation": {
        title: "Fenêtre 2 · En exploitation",
        body: "Deux règles internes, à coût quasi nul, qui ne demandent l'accord de personne à l'extérieur.\n\n**D4 · Le jeu d'évaluation vit dans votre dépôt.** Détaillée dans la zone voisine.\n\n**D5 · Le registre des habilitations d'agents est tenu en double**, hors de l'annuaire du fournisseur : une ligne par agent, par accès, par propriétaire métier et par date de validation.\n\nCette seconde liste est le seul moyen de convertir une future migration d'identités en chantier borné plutôt qu'en enquête. Sans elle, l'équipe de migration commence par reconstituer ce que l'organisation savait déjà, en interrogeant des gens qui ont changé de poste."
      },
      "decision-gratuite": {
        title: "D4 · La décision la plus rentable du dossier",
        body: "Le jeu d'évaluation s'écrit dans un dépôt qui vous appartient, et la plateforme ne fait que l'exécuter.\n\nTrois raisons d'en faire la première décision du projet plutôt qu'une bonne pratique parmi d'autres. Elle **ne coûte rien** : écrire un fichier de cas dans un dépôt versionné n'est pas plus long que le saisir dans une console. Elle se prend **le premier jour**, avant que la sédimentation ne commence. Et elle est **irrattrapable le dernier** : un jeu constitué sur dix-huit mois dans un outil intégré ne se ré-exporte pas, il se réécrit.\n\nSon effet sur la facture de sortie est direct et vérifiable : elle ramène le poste 4 de « la totalité » à « zéro », et c'est le seul poste des cinq qui accepte ce traitement."
      },
      "apres": {
        title: "Fenêtre 3 · À tout moment · D6",
        body: "**Quelqu'un est responsable du coût de sortie**, et le révise chaque année.\n\nPas responsable de la migration, qui n'aura peut-être jamais lieu. Responsable de son **estimation**, sur les cinq postes du schéma précédent, avec la même discipline qu'une provision comptable.\n\nSans ce propriétaire, la facture de sortie n'apparaît qu'au moment où il est trop tard pour la faire baisser, et elle sert alors d'argument pour ne pas partir. Le verrou complet est là : un coût de sortie que personne n'a chiffré devient une raison de rester, et cette raison est la seule que le fournisseur n'a pas eu besoin d'écrire au contrat.\n\nLa fenêtre se referme vite : Gartner anticipe 40 % des applications d'entreprise dotées d'agents spécialisés d'ici fin 2026, contre moins de 5 % en 2025 [15]. L'état s'accumule plus vite que les contrats ne se renégocient."
      }
    }
  }
}
