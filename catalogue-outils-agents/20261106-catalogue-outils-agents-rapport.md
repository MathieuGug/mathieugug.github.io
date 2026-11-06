# Personne ne possède l'outil

> **Un agent n'exerce aucune autorisation autrement qu'en appelant un outil : le catalogue d'outils est la seule surface où une politique d'entreprise s'applique vraiment. Ce catalogue n'est pourtant le produit de personne.** — 6 novembre 2026, Mathieu Guglielmino

Il existe une question que les comités d'arbitrage de l'IA ne posent presque jamais, et qui décide de la réponse à toutes les autres : *quelle est la liste ?* Pas la liste des agents, ni celle des cas d'usage, ni celle des modèles retenus au référencement. La liste des outils qu'un agent a le droit d'appeler, avec pour chacun un propriétaire, une version, un état.

Cette liste existe partout, et elle n'appartient à personne. Elle est répartie entre la console d'un fournisseur de plateforme, quelques fichiers de configuration sur les postes des développeurs, un dépôt interne tenu par une équipe qui ne savait pas qu'elle tenait un référentiel, et la mémoire de trois personnes. Aucune de ces quatre sources ne porte de date de dépréciation. Aucune ne dit qui répond quand l'outil casse.

Ce dossier soutient une thèse simple et une conséquence inconfortable. La thèse : ==on ne gouverne pas un agent, on gouverne son catalogue d'outils==. La conséquence : tant que ce catalogue n'est pas un produit interne — avec un propriétaire nommé, une version de contrat, une politique de dépréciation écrite et une déclaration exportable hors de la console du fournisseur — chaque décision d'autonomie se prend sur un inventaire que l'organisation ne détient pas.

Le calendrier aide. La révision du 28 juillet 2026 du protocole dominant d'intégration d'outils a doté la couche la plus basse de la pile d'une politique de cycle de vie formelle : trois états, une fenêtre minimale de douze mois entre dépréciation et retrait, un registre des fonctionnalités dépréciées[^1]. Autrement dit, le protocole s'est donné ce que presque aucune direction data n'a encore écrit pour ses propres outils.

[SCHEMA-01]

## 1. L'outil est la seule surface qui se gouverne

Les trois couches d'une pile agentique ne s'arbitrent pas de la même manière, et une seule des trois se gouverne réellement.

**Le modèle ne s'arbitre pas, il s'achète.** Une direction choisit un fournisseur, négocie une facture, encadre un usage. Elle n'a aucune prise sur le comportement interne du modèle, et aucun intérêt à en avoir. Les politiques qu'on y accroche — filtres, consignes système, garde-fous de contenu — portent sur ce qui entre et ce qui sort, à travers une interface que le fournisseur contrôle.

**L'agent ne s'arbitre pas davantage, parce qu'il n'a pas de forme stable.** Un agent est une boucle : il observe, décide, appelle, observe à nouveau. Sa configuration effective change à chaque tour, selon ce que le tour précédent a produit. Écrire une politique sur « l'agent » revient à écrire une politique sur une variable. C'est le mécanisme derrière l'écart, documenté par tous ceux qui ont essayé, entre la charte d'IA responsable d'une organisation et ce que ses agents font le mardi matin.

**L'outil, lui, est un objet déclaré.** Il a un nom, une description, un schéma d'entrée, une adresse. Il existe avant l'exécution, il est énumérable, il est versionnable. Et surtout : ==toute autorisation qu'un agent exerce passe par un outil==. Lire une base, écrire dans un système de gestion de la relation client, émettre un paiement, envoyer un message à un client : il n'y a pas d'autre chemin. L'outil est le point de passage obligé entre l'intention de la machine et l'effet sur le monde.

Cela donne un critère de tri pour les dispositifs de gouvernance. Un contrôle posé sur le modèle est un contrôle sur une boîte qu'on ne possède pas. Un contrôle posé sur l'agent est un contrôle sur une configuration qui aura changé avant la fin de la réunion. Un contrôle posé sur le catalogue d'outils est un contrôle sur un inventaire, et un inventaire se tient.

La plupart des cadres publiés en 2025-2026 l'admettent à demi-mot. Ils recommandent des paliers d'autonomie gagnés, une observabilité des trajectoires, une traçabilité des décisions. Ces recommandations ne deviennent opérantes qu'une fois posée la question du *quoi* : sur quelle liste le palier s'applique-t-il ? Sans catalogue, un palier d'autonomie est une intention.

## 2. Ce qu'une fiche d'outil contient, et les quatre champs qu'elle n'a pas

Le protocole d'intégration d'outils qui s'est imposé depuis 2025 a été donné le 9 décembre 2025 à une fondation hébergée par la Linux Foundation, avec le soutien des principaux fournisseurs[^2]. Il dispose depuis d'un registre public et d'un modèle de données canonique pour décrire un serveur d'outils. Ce modèle est le bon endroit pour chercher ce que l'écosystème considère comme une information nécessaire.

Le schéma officiel définit un objet à onze propriétés, dont trois obligatoires : le nom, la description et la version[^3]. Les huit autres sont facultatives : un titre d'affichage, un ensemble d'icônes, une adresse de site, une référence de dépôt de code, une liste de paquets, une liste d'accès distants, un champ de métadonnées d'extension, et la référence du schéma lui-même.

Lisons la liste par ce qu'elle ne contient pas.

**Pas de propriétaire.** Aucun champ ne désigne la personne ou l'équipe responsable de l'outil. Le seul signal de propriété est la forme du nom : un identifiant en DNS inversé, dont le préfixe doit être prouvé une fois au moment de la publication, par une authentification sur une plateforme de code ou une vérification de domaine[^4]. Cela établit qui a publié. Cela n'établit pas qui répond.

**Pas de contact.** Rien qui dise où une alerte arrive, ni dans quel délai.

**Pas d'état de cycle de vie déclaré par l'éditeur.** Le registre officiel, lui, tient un état par version (`active`, `deprecated`, `deleted`), accompagné d'un message facultatif plafonné à cinq cents caractères[^5]. Mais cet état vit dans les métadonnées du registre, sous son propre espace de noms. Il est posé par une opération d'administration du registre ; l'éditeur ne le déclare pas dans la fiche de son outil. La différence compte : une information qui n'est pas dans le contrat de l'objet ne voyage pas avec lui.

**Pas de politique de support.** Aucune durée d'engagement, aucune fenêtre de préavis, aucun niveau de service.

[SCHEMA-02]

Ces quatre absences ne sont pas un oubli. Le registre officiel se décrit lui-même comme un **méta-registre** : il héberge des métadonnées sur des paquets, pas le code ni les binaires, et se concentre sur « la découvrabilité et les métadonnées de base »[^6]. Il assume un périmètre étroit et renvoie explicitement la curation à d'autres : les clients tirent leurs listes de *sous-registres*, qui ajoutent de la valeur par la curation ou par des métadonnées supplémentaires[^6].

La conséquence pour une direction data est directe. Les quatre champs manquants ne manquent pas parce que personne n'y a pensé. Ils manquent parce que le protocole a décidé qu'ils relevaient de l'organisation qui déploie. ==Le catalogue d'entreprise est un sous-registre : un produit, avec un propriétaire nommé et une feuille de route.==

## 3. La description d'outil est du prompt

Une fiche d'outil n'est pas un enregistrement administratif inerte. Son nom, sa description et ses annotations entrent dans le contexte du modèle, et c'est sur cette base que le modèle choisit d'appeler. Le texte descriptif d'un outil est donc une consigne adressée à la machine, rédigée par le fournisseur de l'outil.

La spécification en tire une règle nette. Elle impose aux clients de considérer les annotations d'outils comme non fiables, sauf lorsqu'elles proviennent de serveurs de confiance[^7]. Elle demande par ailleurs qu'un humain reste dans la boucle avec la capacité de refuser une invocation, et que les entrées d'un appel soient montrées à l'utilisateur avant d'être transmises[^7].

Cette règle contient un trou, et le trou est intentionnel. ==La spécification exige de distinguer les serveurs de confiance des autres, et ne définit nulle part ce qu'est un serveur de confiance.== Elle ne peut pas le faire : la confiance est une décision d'organisation, et aucun protocole ne peut la trancher à sa place. Le protocole renvoie donc la frontière de confiance au déployeur — qui, dans la très grande majorité des cas, n'a pas de liste sur laquelle tracer cette frontière.

[SCHEMA-03]

L'incident de référence, en mai 2025, montre pourquoi la frontière ne peut pas être tracée au niveau du code. Des chercheurs ont documenté une exfiltration de données de dépôts privés passant par un serveur d'outils officiel et largement déployé : les instructions malveillantes n'étaient pas dans l'outil mais dans une donnée que l'outil rapportait, une fiche d'incident publique que l'agent avait lue et suivie. Les auteurs ont insisté sur un point : le serveur fonctionnait comme prévu, et aucun correctif côté serveur ne pouvait fermer complètement le problème[^8].

Trois conséquences pour une direction, qui tiennent toutes à la tenue du catalogue.

D'abord, l'échelon où la politique s'applique est l'autorisation de l'outil. La qualité de son code est un autre sujet. Un outil irréprochable reste dangereux s'il est habilité au-delà de son usage.

Ensuite, découverte et autorisation sont deux opérations distinctes. Savoir qu'un outil existe ne vaut pas le droit de l'exécuter. Une direction qui fusionne les deux dans un seul réglage de console ne dispose en pratique d'aucun palier intermédiaire.

Enfin, l'inventaire doit porter l'habilitation, et pas seulement l'existence. La bonne question posée à un catalogue n'est pas « quels outils avons-nous » mais « quel agent peut appeler quel outil, au nom de qui, et avec quelle portée ». La révision de juillet 2026 a durci la chaîne d'autorisation dans ce sens : validation obligatoire de l'émetteur selon la norme RFC 9207 avant d'échanger un code, liaison des identifiants client à l'émetteur qui les a délivrés, ré-enregistrement lorsqu'une ressource change de serveur d'autorisation[^9]. Le protocole a cessé de supposer que tous les émetteurs étaient interchangeables. Le catalogue d'entreprise, lui, suppose encore que tous les outils sont interchangeables.

## 4. Le catalogue a un coût, et ce n'est pas le coût d'un appel

Un dossier d'investissement agentique chiffre les appels de modèle. Il ne chiffre presque jamais le catalogue. Or le catalogue coûte deux fois.

**Il coûte des jetons avant le premier appel.** La plupart des clients chargent toutes les définitions d'outils en amont, directement dans le contexte[^10]. Le modèle porte donc l'intégralité des descriptions avant d'avoir lu la demande. Les chiffres mesurés par Anthropic sur ses propres déploiements donnent l'ordre de grandeur : des définitions d'outils occupant 134 000 jetons avant optimisation[^11]. Sur un flux de travail documenté joignant deux systèmes d'entreprise, le passage à une découverte différée fait tomber la consommation de 150 000 à 2 000 jetons[^10].

**Il coûte de l'exactitude.** C'est le résultat le moins intuitif et le plus lourd de conséquences. Sur des évaluations d'appel d'outils, l'introduction d'une recherche d'outils à la demande, où le modèle découvre les définitions dont il a besoin au lieu de les porter toutes, fait passer un modèle de 49 % à 74 %, et un modèle plus récent de 79,5 % à 88,1 %[^11]. Les échecs les plus fréquents sont la sélection du mauvais outil et le passage de mauvais paramètres, et ils sont attribués notamment à des noms d'outils trop proches les uns des autres[^11].

[SCHEMA-04]

Traduit pour un comité : ==un catalogue se dimensionne, il ne s'accumule pas==. Ajouter un outil à la liste n'est pas une opération neutre d'un point de vue économique ni d'un point de vue de fiabilité. Elle consomme du contexte, elle dégrade la sélection, et elle ajoute une surface d'autorisation. Trois coûts, aucun des trois porté par l'équipe qui publie l'outil.

Ce déséquilibre des incitations est le vrai problème d'organisation. Celui qui publie gagne la visibilité de son outil. Celui qui paie est l'exploitant du socle agentique, sur une ligne budgétaire où personne n'arrive à isoler la part des définitions. Toute politique de catalogue qui n'affecte pas ce coût à l'éditeur restera déclarative. Une direction peut l'instrumenter : un budget de jetons de définitions par domaine, mesuré et publié, se tient avec les mêmes outils qu'un budget d'appels.

Les deux parades disponibles sont de même famille : différer le chargement des définitions, ou donner à l'agent un moyen d'appeler les outils par code plutôt qu'un par un. Elles réduisent la facture. Elles ne réduisent pas le besoin d'inventaire — elles l'augmentent, puisqu'un outil qu'on découvre à la demande doit être décrit assez bien pour être retrouvé, et donc être tenu.

## 5. Ce que la discipline de publication vaut à l'échelle du registre public

Le registre officiel offre aux éditeurs un état de dépréciation. La question intéressante est de savoir s'ils s'en servent. Elle est mesurable, et je l'ai mesurée.

**Méthode.** Le 6 novembre 2026, j'ai interrogé l'interface publique du registre officiel par pagination[^12], en semant les curseurs sur trente-six points d'entrée de l'espace des noms (les vingt-six lettres et les dix chiffres) afin d'éviter le biais d'un parcours purement alphabétique depuis le début. Six pages de cent enregistrements par point d'entrée. Le relevé porte sur 21 029 enregistrements de version, correspondant à 4 743 noms de serveurs distincts. Ce n'est pas un recensement exhaustif du registre, dont la taille est d'un ordre de grandeur supérieur ; c'est un échantillon stratifié sur l'espace des noms, et les proportions sont à lire comme telles.

**Résultats.**

| Grandeur mesurée | Valeur |
|---|---|
| Enregistrements de version relevés | 21 029 |
| Noms de serveurs distincts | 4 743 |
| Versions portant l'état `active` | 96,46 % |
| Versions portant l'état `deprecated` | 3,54 % |
| Versions portant l'état `deleted` | 0,00 % |
| Noms n'ayant jamais publié qu'une seule version | 63,2 % |
| Versions publiées par nom, en moyenne | 4,43 |

[SCHEMA-05]

Trois lectures.

**L'outil existe, l'usage non.** Le registre propose un état de dépréciation documenté, assorti d'un message explicatif. Trois versions publiées sur cent le portent. Un chiffre de cet ordre ne décrit pas un écosystème qui déprécie proprement ; il décrit un écosystème où la dépréciation est un événement rare, et où l'abandon silencieux est la norme.

**La suppression n'existe pas.** Aucun enregistrement supprimé dans l'échantillon. Un catalogue public ne se vide donc jamais : il s'allonge. Pour un déployeur, cela signifie qu'une liste tirée d'un registre public sans filtrage actif ne rétrécit par aucun mécanisme naturel. La seule force de réduction disponible est une décision interne.

**Deux tiers des outils n'ont qu'une version.** 63,2 % des noms n'ont jamais publié qu'une seule version. La moyenne de 4,43 versions par nom est donc portée par une minorité de projets tenus, le reste formant une longue traîne publiée une fois. C'est la mesure la plus directe de ce qu'une organisation importe quand elle ouvre son catalogue sur un registre public : une majorité d'objets dont personne n'a jamais publié de deuxième état.

Rien de ceci ne condamne le registre public, qui remplit exactement l'office qu'il s'est donné. Cela condamne l'idée qu'une direction puisse s'en servir comme catalogue d'entreprise sans travail de curation. La curation est une fonction permanente, et se finance comme telle.

## 6. Le protocole s'est doté d'une politique de cycle de vie ; l'entreprise, non

La révision du 28 juillet 2026 est la plus lourde du protocole depuis son lancement. Elle rend le cœur sans état, sort deux fonctionnalités vers des extensions, durcit l'autorisation, et ajoute une politique de dépréciation[^13].

Cette politique mérite d'être lue dans le détail, parce qu'elle fournit un modèle réutilisable.

**Trois états.** Toute fonctionnalité est Active, Dépréciée ou Supprimée.

**Une fenêtre minimale de douze mois.** Au moins douze mois doivent s'écouler entre la dépréciation et le premier retrait possible, et la fenêtre se compte depuis la publication de la révision qui marque la fonctionnalité comme dépréciée, et non depuis l'adoption de la proposition qui l'a décidée[^13]. L'annonce officielle le formule en langage d'exploitant : une politique de dépréciation formelle avec une fenêtre minimale de douze mois, « pour que vous puissiez planifier vos montées de version au lieu d'y réagir »[^1].

**Un registre des fonctionnalités dépréciées.** L'état s'écrit dans une liste tenue, avec une date de retrait au plus tôt. Une mention dans une note de version ne suffit pas.

**Un retrait exige un acte distinct.** On ne supprime pas par péremption : il faut une proposition dédiée.

[SCHEMA-06]

La première application de la politique a déprécié trois fonctionnalités au 28 juillet 2026, avec un retrait possible au plus tôt lors de la première révision publiée à partir du 28 juillet 2027[^1]. Elles continuent de fonctionner pendant toute la fenêtre ; la consigne adressée aux nouvelles implémentations est simplement de ne plus les adopter.

Le contraste est l'argument de ce dossier. La couche la plus basse de la pile, celle qui ne porte aucune valeur métier, dispose désormais d'états nommés, d'une fenêtre de préavis chiffrée, d'un registre et d'une procédure de retrait. La couche qui porte l'autorisation d'écrire dans un système de production — le catalogue d'outils d'une entreprise — n'a, dans la plupart des organisations, ni états, ni fenêtre, ni registre, ni procédure.

Une direction n'a pas besoin d'inventer la politique manquante. Elle peut recopier celle-ci et en changer l'échelle : trois états, une fenêtre de préavis adaptée au rythme interne, un registre tenu, un retrait qui exige une décision. La valeur de l'emprunt tient à ce qu'il rend la question arbitrable en comité : une fenêtre de préavis est un nombre, et un nombre se négocie entre l'éditeur et l'exploitant.

## 7. Où vit la liste

Reste la question la plus matérielle : dans quel système la liste qui fait foi est-elle écrite ?

Le registre public ne peut pas tenir ce rôle. Il est en préversion depuis le 8 septembre 2025, avec un gel d'interface sur la version 0.1 en attendant une version de disponibilité générale[^4], et il ne porte pas les serveurs privés. Sa documentation renvoie les organisations vers leur propre registre pour tout ce qui n'est pas publiquement accessible. Son modèle de l'écosystème est explicite : les clients tirent de sous-registres, et la curation est le travail de ces sous-registres[^6].

Dans les faits, trois endroits se présentent, et deux sont des pièges.

**La console du fournisseur de plateforme.** C'est l'option par défaut et la plus confortable : la plateforme agentique propose une page qui liste les serveurs d'outils approuvés, et un administrateur y coche. Le piège est de prendre cette page pour l'inventaire. Une liste qui vit dans une console est une liste dont le format, la rétention, le niveau de détail et la disponibilité appartiennent au fournisseur. Une direction qui ne peut pas produire son catalogue sans se connecter chez son prestataire ne détient pas son catalogue.

**Les fichiers de configuration des postes de travail.** C'est l'option réelle dans beaucoup d'organisations avant toute décision : chaque équipe déclare ses serveurs d'outils dans sa configuration locale. L'avantage est la vitesse d'adoption. L'inconvénient est qu'aucune des quatre informations qui manquent déjà au modèle canonique — propriétaire, contact, état, engagement de support — n'a d'endroit où être écrite.

**Un sous-registre interne.** C'est la seule option qui soit un produit. Il implémente l'interface du registre public, de sorte que les clients existants le consomment sans adaptation, tire les entrées publiques approuvées, ajoute les outils internes, et porte les métadonnées que le modèle canonique laisse vides. Le coût réel n'est pas le logiciel, qui existe sous plusieurs formes chez les fournisseurs de socle et en libre accès. Le coût est la fonction : quelqu'un doit décider ce qui entre, ce qui sort, à quel rythme, et sur quels critères.

C'est à ce stade que la décision remonte au niveau d'une direction, parce qu'elle engage un poste et une clause. Le poste : un propriétaire du catalogue, rattaché à l'exploitant du socle et non à l'équipe qui publie le plus d'outils. La clause : une obligation d'export périodique de la déclaration du catalogue, dans un format exploitable, à une fréquence contractuelle, vérifiable sans intervention du fournisseur. Cette seconde exigence est la jumelle de celles que l'on écrit déjà pour les journaux et pour les appariements d'identité, et elle répond à la même asymétrie : l'incapacité du fournisseur à produire devient, en cas de contrôle, la défaillance du déployeur.

Le rattachement réglementaire est utile pour la faire accepter. Le règlement européen sur l'IA fait reposer sur le déployeur d'un système à haut risque deux obligations qui supposent toutes deux un inventaire : confier la surveillance humaine à des personnes nommées disposant de la compétence, de la formation et de l'autorité nécessaires, et conserver les journaux produits automatiquement, pour autant qu'il en ait le contrôle, pendant une durée appropriée à la finalité et au moins six mois sauf disposition contraire[^14]. Une surveillance humaine nommée suppose de savoir sur quoi elle porte. Une conservation de journaux « pour autant qu'il en ait le contrôle » suppose de savoir ce qui a été appelé, par qui, et avec quelle version du contrat d'outil. Les deux obligations échouent sur la même absence.

## 8. Cinq exigences

Le cahier des charges tient en cinq exigences, écrites pour être opposables à un fournisseur comme à une équipe interne. Elles sont ordonnées par coût croissant.

**E1 · un propriétaire nommé par outil.** Une personne ou une équipe, avec un contact d'alerte et un délai de réponse. C'est l'exigence la moins chère et la plus souvent absente. Elle ne demande aucun outillage : une colonne. Son effet principal est de rendre visibles les outils que personne ne réclame, et donc de rendre leur retrait discutable.

**E2 · une version du contrat d'outil, distincte de la version du serveur.** Un serveur d'outils peut évoluer sans que le contrat vu par un agent change, et l'inverse est vrai aussi : un changement de description modifie le comportement de sélection du modèle sans toucher au code. La version qui compte pour un consommateur est celle du contrat — nom, description, schéma d'entrée, schéma de sortie. Elle doit être déclarée et comparable.

**E3 · une politique de dépréciation écrite, avec une fenêtre chiffrée.** Trois états, une durée minimale de préavis, un registre tenu des outils dépréciés avec leur date de retrait au plus tôt, et l'exigence d'une décision explicite pour retirer. Le modèle est disponible et éprouvé : la politique adoptée par le protocole lui-même fixe douze mois. Une organisation choisira une autre durée selon son rythme de livraison ; ce qu'elle ne peut pas faire, c'est ne pas en choisir une.

**E4 · la séparation de la découverte et de l'autorisation.** Deux listes, deux décisions, deux traces. Qu'un outil apparaisse au catalogue ne vaut pas droit d'exécution ; le droit d'exécution s'attache à un agent, à un commanditaire et à une portée. Cette séparation est ce qui rend les paliers d'autonomie exécutables au lieu de déclaratifs : on monte un cran en ajoutant un droit d'exécution, et le catalogue reste inchangé.

**E5 · une déclaration du catalogue exportable hors console.** Le contenu minimal : pour chaque outil, son nom, la version de son contrat, son propriétaire, son état de cycle de vie, sa date de retrait au plus tôt le cas échéant, et le graphe des habilitations qui s'y rattachent. La forme : un export périodique, dans un format documenté, obtenu sans intervention humaine du fournisseur. Le test d'acceptation est simple, et il doit être joué avant la signature : demander l'export, chronométrer, et vérifier que le fichier reçu permet de répondre à la question « qui pouvait appeler cet outil le mois dernier ».

[SCHEMA-07]

Aucune de ces cinq exigences ne porte sur un modèle, une architecture ou une capacité technique. Elles portent sur un inventaire, un poste et un contrat. C'est ce qui les rend arbitrables par une direction, et c'est aussi ce qui explique qu'elles soient si souvent reportées : elles ne produisent aucune démonstration.

Le coût du report, lui, se paie en une seule fois, le jour où il faut répondre à une question au passé. Quel outil cet agent pouvait-il appeler le 14 mars ? Qui en était responsable ? Quelle version de sa description a-t-il lue ? Ce jour-là, l'organisation qui a tenu son catalogue produit un fichier. Celle qui ne l'a pas tenu produit une capture d'écran de la console de son fournisseur, à la date d'aujourd'hui.

---

## Sources

[^1]: Model Context Protocol, « The 2026-07-28 Specification », blog officiel du protocole, 28 juillet 2026. <https://blog.modelcontextprotocol.io/posts/2026-07-28/> (consulté le 6 novembre 2026). Annonce de la révision finale : cœur sans état, durcissement de l'autorisation, et « a formal deprecation policy with a twelve-month minimum window so you can plan upgrades instead of reacting to them ». Précise que les fonctionnalités dépréciées « still work, and they'll keep working for at least twelve months ».

[^2]: Anthropic, « Donating the Model Context Protocol and establishing the Agentic AI Foundation », 9 décembre 2025. <https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation> (consulté le 6 novembre 2026). Don du protocole à une fondation dirigée hébergée par la Linux Foundation, cofondée avec Block et OpenAI, avec le soutien de Google, Microsoft et AWS.

[^3]: Model Context Protocol, schéma canonique `server.json`, définition `ServerDetail`. <https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json> (consulté le 6 novembre 2026). Onze propriétés, trois obligatoires (`name`, `description`, `version`). Aucun champ de propriétaire, de contact, de cycle de vie ou d'engagement de support.

[^4]: Model Context Protocol Registry, dépôt officiel et documentation de publication. <https://github.com/modelcontextprotocol/registry> (consulté le 6 novembre 2026). Préversion depuis le 8 septembre 2025, gel d'interface v0.1 le 24 octobre 2025 en vue d'une version 1 ; preuve de propriété de l'espace de noms par authentification sur plateforme de code ou vérification de domaine.

[^5]: Model Context Protocol Registry, référence de l'interface officielle. <https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/api/official-registry-api.md> (consulté le 6 novembre 2026). États `active`, `deprecated`, `deleted` ; `statusMessage` facultatif plafonné à 500 caractères et interdit avec `active` ; tri des versions comme chaînes de caractères, d'où le piège du « premier résultat » pris pour la dernière version.

[^6]: Model Context Protocol Registry, « Ecosystem vision ». <https://github.com/modelcontextprotocol/registry/blob/main/docs/design/ecosystem-vision.md> (consulté le 6 novembre 2026). Le registre officiel comme dépôt autoritaire des serveurs publics et comme *métaregistre* (« they host metadata about packages, but not the package code or binaries ») ; les clients tirent de *sous-registres* qui apportent la curation et les métadonnées supplémentaires ; périmètre assumé : « focuses on discoverability and basic metadata ».

[^7]: Model Context Protocol, spécification 2026-07-28, « Tools ». <https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx> (consulté le 6 novembre 2026). Modèle de données d'un outil ; les clients « MUST consider tool annotations to be untrusted unless they come from trusted servers » ; un humain « SHOULD always be in the loop with the ability to deny tool invocations » ; recommandation de montrer les entrées d'appel avant transmission.

[^8]: Invariant Labs, « GitHub MCP Exploited: Accessing private repositories via MCP », mai 2025. <https://invariantlabs.ai/blog/mcp-github-vulnerability> (consulté le 6 novembre 2026). Exfiltration de données de dépôts privés déclenchée par une fiche d'incident publique et non par un outil compromis ; qualifiée par ses auteurs de problème d'architecture et non de défaut de code du serveur.

[^9]: Model Context Protocol, « Beta SDKs and the 2026-07-28 Release Candidate ». <https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/> (consulté le 6 novembre 2026). Détail des propositions retenues : validation obligatoire du paramètre `iss` selon RFC 9207 avant échange du code, liaison des identifiants client à l'émetteur, ré-enregistrement en cas de changement de serveur d'autorisation, schémas d'outils en JSON Schema 2020-12, états du cycle de vie et fonctionnalités dépréciées.

[^10]: Anthropic, « Code execution with MCP », blog d'ingénierie, novembre 2025. <https://www.anthropic.com/engineering/code-execution-with-mcp> (consulté le 6 novembre 2026). « Most MCP clients load all tool definitions upfront directly into context » ; au-delà de milliers d'outils, « they'll need to process hundreds of thousands of tokens before reading a request » ; passage de 150 000 à 2 000 jetons sur un flux de travail documenté.

[^11]: Anthropic, « Advanced tool use », blog d'ingénierie. <https://anthropic.com/engineering/advanced-tool-use> (consulté le 6 novembre 2026). « We've seen tool definitions consume 134K tokens before optimization » ; réduction de 85 % avec recherche d'outils à la demande ; exactitude sur évaluations d'appel d'outils portée de 49 % à 74 % et de 79,5 % à 88,1 % ; échecs dominants : mauvais outil sélectionné et mauvais paramètres, favorisés par des noms d'outils proches.

[^12]: Model Context Protocol Registry, interface publique de consultation, `GET /v0/servers`. <https://registry.modelcontextprotocol.io/v0/servers> (relevé effectué le 6 novembre 2026). Support du relevé décrit en section 5 : 21 029 enregistrements de version sur 4 743 noms distincts, obtenus par pagination semée sur trente-six points d'entrée de l'espace des noms.

[^13]: Model Context Protocol, « SEP-2596 — Specification feature lifecycle and deprecation policy », et « SEP-2577 — Deprecate Roots, Sampling, and Logging ». Propositions d'évolution de la spécification publiées sur le site du protocole, juillet 2026. <https://blog.modelcontextprotocol.io/posts/2026-07-28/> (consulté le 6 novembre 2026, via l'annonce de révision et le journal des modifications associé). États Actif / Déprécié / Supprimé ; fenêtre minimale de douze mois comptée depuis la révision qui marque la dépréciation ; registre des fonctionnalités dépréciées ; retrait conditionné à une proposition distincte ; premier retrait possible pour les trois fonctionnalités dépréciées lors de la première révision publiée à partir du 28 juillet 2027.

[^14]: Commission européenne, AI Act Service Desk, « Article 26 — Obligations of deployers of high-risk AI systems ». <https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-26> (consulté le 6 novembre 2026). Paragraphe 2 : la surveillance humaine est confiée à des personnes physiques disposant de la compétence, de la formation et de l'autorité nécessaires, ainsi que du soutien nécessaire. Paragraphe sur la conservation : les journaux générés automatiquement sont conservés pour autant qu'ils soient sous le contrôle du déployeur, pour une durée appropriée à la finalité prévue et d'au moins six mois, sauf disposition contraire du droit de l'Union ou national.
