# Qui tient le compteur

> **La tarification au résultat ne transfère pas le risque au fournisseur : elle le déplace sur la définition du résultat.** — 9 octobre 2026, Mathieu Guglielmino

## Ce que la grille tarifaire ne dit pas

Depuis dix-huit mois, les offres d'agents de relation client ont changé d'unité de facturation. On ne paie plus un siège par mois, on paie un résultat. Intercom annonce 0,99 $ par résultat pour son agent Fin. Zendesk annonce 1,50 $ par résolution automatisée et revendique l'antériorité du modèle dans son secteur[^5]. Salesforce a d'abord affiché 2,00 $ par conversation d'agent orienté client, puis a ouvert une seconde voie au crédit par action[^8]. Sierra ne publie rien.

Une direction qui compare ces offres compare trois nombres. Elle croit arbitrer sur un prix. La facture, elle, ne dépend presque pas de ce prix.

Elle dépend de la règle qui déclare qu'une conversation s'est terminée par un résultat. Cette règle n'est pas la même chez les quatre fournisseurs. Elle n'est publiée intégralement par aucun. Chez au moins deux d'entre eux, elle repose sur une **présomption** : passé un délai de silence du client, sans réouverture ni demande d'escalade, la conversation est réputée résolue et devient facturable. Le silence d'un client mécontent qui a renoncé produit alors exactement la même ligne de facture que la satisfaction d'un client servi.

==Le passage au résultat ne supprime pas la négociation du prix : il la déplace vers la négociation du compteur, et le compteur est presque toujours tenu par le vendeur.==

Ce dossier tient en une question à poser avant de signer, qui remplace celle que les grilles invitent à poser. Non pas « au siège, à l'usage ou au résultat », mais **qui tient le compteur, selon quelle règle écrite, et puis-je la vérifier**. Les six décisions de la dernière section répondent à cette question, et elles sont classées par la fenêtre où chacune reste possible — l'une d'elles ne coûte rien et devient irrattrapable dès la mise en service.

[SCHEMA-01]

## Trois compteurs, et un seul change de camp

Le logiciel d'entreprise a longtemps facturé un **droit d'accès**. Le compteur était le siège : un nombre d'utilisateurs nommés, connu de l'acheteur, stable sur la durée du contrat, vérifiable par l'annuaire interne. Ce compteur avait une propriété rarement remarquée tant qu'elle allait de soi. L'acheteur en contrôlait la valeur. Ouvrir ou fermer un compte était sa décision.

L'agentique casse ce lien. Gartner estime que 40 % des applications d'entreprise intégreront des agents spécialisés d'ici fin 2026, contre moins de 5 % en 2025[^3], et chiffre à 234 milliards de dollars la dépense logicielle d'entreprise exposée par le mouvement[^2]. Le raisonnement est simple : quand un agent exécute le travail à travers plusieurs applications, l'utilisateur humain cesse d'ouvrir les interfaces, et le lien entre l'usage du logiciel et le nombre de sièges se défait. L'éditeur qui facture au siège regarde son compteur baisser alors que la charge utile qu'il sert augmente.

Deux compteurs de remplacement se sont installés.

Le premier est l'**action**. On facture chaque opération exécutée par l'agent. Salesforce en donne la forme la plus explicite : 100 000 crédits pour 500 $, une action standard à 20 crédits, une action vocale à 30[^8]. L'acheteur ne contrôle plus directement le compteur, puisqu'il ne décide pas combien d'appels d'outils l'agent enchaînera pour traiter une demande. Mais le compteur reste **descriptif** : il enregistre un fait technique daté, qui s'est produit ou ne s'est pas produit, et dont la trace existe dans les journaux d'exécution.

Le second est le **résultat**. On facture une conversation résolue, un ticket traité, une qualification obtenue. Ici le compteur cesse d'être descriptif pour devenir **interprétatif**. Aucun événement technique ne dit « ce client est satisfait ». Il faut une règle qui décide quand un échange compte comme résolu, et cette règle est un énoncé normatif rédigé par le vendeur.

C'est la bascule que les grilles de comparaison ne montrent pas. Du siège à l'action, l'acheteur perd le contrôle de la **valeur** du compteur. De l'action au résultat, il perd le contrôle de sa **définition**. Les deux pertes n'ont pas la même conséquence contractuelle : la première se traite par un plafond, la seconde par une clause de comptage, et presque aucun contrat ne contient la seconde.

## Anatomie d'une résolution facturée

Prenons une conversation banale. Un client ouvre un échange, l'agent répond, le client ne répond plus. Rien d'autre ne se produit. À quel moment cette conversation devient-elle une ligne de facture ?

Chez Intercom, la facturation est documentée comme s'appliquant une fois par conversation, quel que soit le nombre de questions traitées, et les événements facturables recensés dans les relevés publics incluent la résolution, le transfert vers une procédure et la disqualification, avec un tarif distinct pour une qualification commerciale[^7]. L'élément déterminant tient dans la règle de clôture : des relevés concordants décrivent une résolution comptabilisée lorsque le client s'en va sans redemander d'aide, ou reste silencieux pendant vingt-quatre heures. C'est la règle que les critiques du modèle contestent, et c'est elle qui fabrique la facture.

Chez Zendesk, l'unité est la « résolution automatisée », définie par le fournisseur comme une demande traitée entièrement par l'agent sans intervention humaine, avec une définition adaptée à chaque canal selon des principes présentés comme constants[^6]. La promesse associée est explicite : pas de résolution, pas de facture[^5]. Les guides secondaires décrivent une confirmation après soixante-douze heures d'inactivité du ticket, le système examinant pendant cette fenêtre des signaux comme un retour positif ou l'absence de question de suivi. Cette durée n'apparaît pas dans la documentation primaire que l'on peut consulter, et elle est donnée ici comme un relevé secondaire à vérifier auprès du fournisseur.

[SCHEMA-02]

La structure est la même dans les deux cas, et elle mérite d'être nommée pour ce qu'elle est. **Le compteur ne mesure pas un succès, il mesure une absence de contestation pendant un délai.** Trois trajectoires distinctes produisent le même enregistrement :

- le client a obtenu sa réponse et s'en va satisfait ;
- le client n'a pas obtenu sa réponse, a renoncé, et traitera son problème autrement — par un autre canal, par un abandon de panier, par une résiliation ;
- le client a obtenu une réponse fausse qu'il n'a pas détectée, et reviendra dans trois semaines avec un problème plus coûteux.

Les trois facturent. La deuxième et la troisième facturent même deux fois, si le client finit par rouvrir au-delà de la fenêtre : la première conversation a été encaissée comme résolue, la seconde ouvre un nouveau compteur.

Un acheteur attentif objectera que l'escalade vers un humain, elle, ne facture pas, et que le fournisseur a donc intérêt à la qualité. L'objection est juste et insuffisante. Elle suppose que l'escalade et l'échec sont la même chose. Ils ne le sont pas : l'escalade est un échec **déclaré**, dont la trace existe dans le système ; le renoncement silencieux est un échec **invisible**, dont aucune trace n'existe du côté du fournisseur. Un compteur qui facture le second et pas le premier rémunère la discrétion de l'échec plutôt que son absence.

## Quatre fournisseurs, quatre définitions

Le relevé ci-dessous distingue systématiquement ce que le fournisseur publie de ce qui provient de comparatifs secondaires, souvent rédigés par des concurrents. Cette discipline n'est pas un ornement méthodologique : sur ce sujet, la part publiée est minoritaire, et un dossier qui mélange les deux niveaux produit une grille fausse.

[SCHEMA-03]

**Fin (Intercom).** Unité : le résultat, 0,99 $. Facturation une fois par conversation. Événements facturables relevés : résolution, transfert vers une procédure, disqualification ; qualification commerciale à un tarif distinct, de l'ordre de 9,99 $ selon les relevés[^7]. Hors de l'environnement Intercom, un forfait d'entrée mensuel inclut un quota de résolutions. Sur Intercom, les sièges d'assistance restent facturés séparément. Règle de clôture reposant sur une fenêtre de silence de vingt-quatre heures d'après les relevés concordants, non confirmée dans la documentation primaire consultable.

**Zendesk.** Unité : la résolution automatisée, 1,50 $ au tarif engagé selon le blogue du fournisseur[^6]. Un tarif supérieur à l'usage non engagé est rapporté par des revues tierces sans confirmation primaire. Définition fournisseur : demande traitée entièrement par l'agent, sans intervention humaine, déclinée par canal. Quota inclus dans les offres, dépassement facturé. Un dispositif de tarification dynamique permet, pour les grands comptes, de transférer du budget entre sièges humains et résolutions automatisées sans renégocier le contrat. C'est le seul mécanisme de souplesse budgétaire documenté du relevé, et il mérite d'être demandé par son nom.

**Agentforce (Salesforce).** Trajectoire la plus instructive du relevé. Le modèle initial affichait 2,00 $ par conversation d'agent orienté client, l'escalade étant facturée comme la résolution — autrement dit, un compteur présenté comme un résultat mais indifférent au résultat. La documentation primaire actuelle vend des crédits : 100 000 pour 500 $, action standard à 20 crédits, action vocale à 30[^8]. Le périmètre couvert par les crédits est plus large que celui des conversations, et les deux modèles ne coexistent pas dans une même organisation.

**Sierra.** Rien de publié. Les montants qui circulent — frais de mise en service, engagement annuel minimum, tarif unitaire estimé — proviennent intégralement de comparatifs tiers. Ils ne sont pas repris ici. Le seul fait utilisable est l'absence de publication, et elle a une conséquence pratique : un acheteur ne peut pas préparer la négociation du compteur avant d'entrer en négociation.

Deux lectures se dégagent de ce relevé.

La première est que ==le marché n'a pas convergé vers le résultat : son acteur le plus volumineux a fait le chemin inverse, du résultat vers l'action==. Le passage d'Agentforce de la conversation au crédit par action est un retour au compteur descriptif. Il est plus simple à instrumenter, plus simple à vérifier, et il ne demande pas à l'éditeur de porter la variance du succès.

La seconde est que la colonne qui manque à tous les comparatifs est celle de la **vérifiabilité**. Aucun des quatre fournisseurs ne documente publiquement comment un client peut recompter ce qui lui est facturé. Un analyste l'a formulé comme la condition de confiance du modèle : la définition et la mesure de ce qui compte comme interaction résolue doivent être claires et transparentes[^12]. L'écart entre cette recommandation et l'état de la documentation publique est le véritable résultat du relevé.

## Le théorème qui gouverne le compteur

Il existe un résultat théorique ancien qui décrit exactement ce que fait un compteur au résultat, et il vaut mieux l'avoir lu avant de signer que de le redécouvrir au bout de deux trimestres.

Holmström et Milgrom ont étudié en 1991 la rémunération d'un agent chargé de plusieurs tâches dont une seule est mesurable de façon fiable. Leur conclusion centrale est contre-intuitive et robuste : lorsque la mesure est incomplète, une rémunération fixe, indépendante de la performance mesurée, peut être optimale. La raison tient à l'allocation d'attention. Rémunérer fortement la dimension mesurée détourne l'effort des dimensions qui ne le sont pas, et le gain obtenu sur la première peut être inférieur à la perte subie sur les secondes. Dans sa conférence Nobel, Holmström résume le problème d'une phrase que tout acheteur d'agent devrait relire : il ne sert à rien de créer de fortes incitations pour les mauvaises actions[^10].

[SCHEMA-04]

La transposition est directe. Un agent de relation client exerce plusieurs tâches simultanées, dont on peut citer cinq : terminer l'échange sans escalade, donner une réponse exacte, laisser le client satisfait, respecter les obligations de conformité du secteur, éviter de produire un problème aval plus coûteux. Une seule de ces cinq est mesurée par le compteur de facturation. Quatre sont muettes.

Le fournisseur n'a pas besoin d'être malveillant pour que l'effet se produise. Il suffit qu'il optimise ce qu'il est payé pour faire, ce qui est le comportement normal d'un fournisseur sous contrat. Les arbitrages qui en découlent sont tous rationnels de son point de vue et tous invisibles dans la facture : retarder l'escalade quand elle est incertaine, formuler une réponse plausible plutôt qu'avouer une lacune, allonger le délai avant de proposer un humain.

Le cas Klarna, dont la chronologie est publique et datée, montre le même écart sans qu'aucune question de compteur soit en jeu. L'entreprise avait annoncé en février 2024 un agent traitant 2,3 millions de conversations son premier mois, avec un délai moyen de résolution ramené de onze minutes à moins de deux. En mai 2025, son dirigeant a reconnu publiquement que l'entreprise s'était trop concentrée sur l'efficacité et le coût, que le résultat avait été une qualité moindre, et que ce n'était pas tenable ; l'entreprise a repris le recrutement d'agents humains[^11]. Les chiffres de lancement et le constat de 2025 portent sur la même période de déploiement : ce sont les mêmes conversations, comptées une fois par la métrique de production et une fois par l'expérience client.

Il faut tenir ce cas pour ce qu'il est. Il ne démontre pas qu'un agent dégrade la qualité, et les chiffres de 2024 comme le constat de 2025 sont des déclarations d'entreprise. Il établit un fait plus modeste et suffisant pour notre propos : une métrique de volume traité et une appréciation de qualité servie peuvent diverger durablement sans que personne mente, parce qu'elles ne mesurent pas la même chose. Un compteur de facturation construit sur la première ne porte aucune information sur la seconde.

La conséquence pratique est une règle de rédaction. **Un compteur au résultat n'a de sens que s'il est accompagné d'au moins une mesure des dimensions muettes, tenue par l'acheteur, et d'un mécanisme qui lie les deux.** Sans ce second instrument, l'acheteur a échangé un prix négocié contre une incitation dont il ne maîtrise aucune des cinq dimensions.

## Où va vraiment la variance

L'argument de vente du modèle au résultat tient en une phrase : le fournisseur partage le risque. Il faut l'examiner par ses deux compteurs, parce que le fournisseur en a deux.

Il vend un résultat à prix fixe. Il achète du calcul à prix variable. Et le second compteur monte. Gartner anticipe un coût d'inférence par flux agentique multiplié par plus de cinq d'ici 2028[^1]. L'explication n'est pas une hausse du prix du jeton, qui baisse plutôt, mais l'allongement des chaînes d'exécution : plus d'appels d'outils, plus d'allers-retours de raisonnement, plus de contexte relu à chaque tour, pour une tâche de périmètre constant.

[SCHEMA-05]

Un fournisseur pris entre ces deux compteurs dispose de trois voies de reprise, et les trois sont observables dans le marché.

**Le plancher d'engagement.** Le tarif unitaire bas est consenti contre un volume minimum garanti. L'acheteur paie le plancher qu'il atteigne ou non le volume, ce qui ramène le contrat à un forfait déguisé en tarification au résultat. Le test est simple : si le plancher représente l'essentiel du volume prévisionnel, le fournisseur ne porte aucun risque et l'acheteur a payé un supplément de complexité pour rien.

**La redéfinition de l'unité.** La règle de comptage n'étant presque jamais annexée au contrat, elle peut être ajustée du côté du fournisseur sans que l'acheteur ait de recours. Raccourcir une fenêtre de silence de soixante-douze à vingt-quatre heures augmente mécaniquement le nombre de résolutions facturées à comportement client inchangé. Aucune hausse de tarif n'a été notifiée, et la facture monte.

**Le retour au compteur descriptif.** La voie la plus propre, et celle qu'a empruntée l'acteur le plus volumineux du relevé en basculant de la conversation au crédit par action[^8]. Elle a le mérite de l'honnêteté : elle dit que le fournisseur facture son activité et non son résultat, et elle laisse à l'acheteur la charge de mesurer la valeur.

C'est à ce point qu'un analyste de Gartner a posé le test le plus utile du dossier. Tom Coshow décrit l'essor de la tarification au résultat comme davantage du bruit que de la réalité, chiffre l'adoption actuelle à 19 % des acheteurs de services et 13 % des accords côté vendeur, projette moins de 25 % des contrats de services d'ici 2031, et résume l'arbitrage d'une question : si le fournisseur ne prend pas le risque, pourquoi vous embarrassez-vous d'une tarification au résultat[^4] ?

La question se répond par un examen plutôt que par une déclaration d'intention du vendeur. Trois éléments la tranchent : le plancher d'engagement rapporté au volume prévisionnel, l'existence d'une règle de comptage annexée au contrat, et l'existence d'un recours quand l'acheteur contredit le compteur. Si les trois manquent, le fournisseur porte un risque nul et le modèle est un habillage.

## Le compteur opposable

Un acheteur qui veut vérifier sa facture a besoin de deux choses distinctes, et la seconde est presque toujours oubliée.

La première est un **droit** : la faculté contractuelle de demander les éléments de comptage et de contester le résultat. Elle s'écrit facilement et se trouve dans beaucoup de contrats sous la forme d'un droit d'audit standard.

La seconde est la **matière** : l'existence effective, chez le fournisseur, des enregistrements que ce droit permet de demander, et leur conservation sur une durée utile. Une note de praticien le formule de la façon la plus nette : une clause qui promet un droit d'audit est faible si l'enregistrement d'usage, de résultat ou d'action dont elle dépend n'est pas conservé. Un droit d'audit sans obligation de rétention adossée est une clause vide — elle donne le droit de demander ce qui n'existe plus.

Les travaux contractuels publiés sur les déploiements agentiques convergent sur la liste des pièces à exiger. Mayer Brown recense l'accès aux journaux d'agent, aux traces de décision, aux enregistrements d'appels d'outils, aux invites et instructions système, aux identifiants de modèle et de version, aux résultats d'évaluation et aux indicateurs de dérive, à des conditions suffisantes pour alimenter un contrôle interne, une demande de régulateur ou une enquête après incident, avec des durées de rétention et des mécanismes de remise stipulés[^9]. La même littérature souligne que les stipulations héritées des contrats logiciels classiques — propriété des données, confidentialité, responsabilité, droit d'audit, conformité — sont inadaptées à des systèmes qui évoluent en continu, s'appuient sur des sous-traitants en couches et prennent des décisions automatisées.

[SCHEMA-06]

Appliquée au comptage, cette liste se réduit à quatre exigences rédigeables, qui n'ont rien d'exotique et tout de spécifique.

**La règle de comptage est annexée au contrat.** Pas évoquée dans une page d'aide susceptible d'évoluer, mais versionnée en annexe, avec la fenêtre de silence exprimée en heures, la liste exhaustive des événements facturables, la liste des événements non facturables, et le traitement de la réouverture au-delà de la fenêtre. Toute modification de l'annexe vaut modification tarifaire et ouvre le préavis correspondant.

**Le détail du comptage est restituable.** Une ligne par événement facturé, horodatée, avec l'identifiant de conversation, l'événement déclencheur retenu et l'identifiant de version de l'agent en service. Format exploitable, délai de remise stipulé, rétention au moins égale à la durée de prescription du différend.

**La contestation a une procédure.** Qui conteste, dans quel délai, sur quelle pièce, qui tranche, et ce qui se passe pendant l'examen. Un différend sur le comptage sans procédure se règle par le rapport de force commercial, ce qui veut dire qu'il se règle en faveur du vendeur.

**Les dimensions muettes sont mesurées par l'acheteur.** Taux de réouverture au-delà de la fenêtre, taux de recontact par un autre canal, exactitude mesurée sur un échantillon tiré par l'acheteur, satisfaction mesurée hors du canal du fournisseur. Ces mesures ne servent pas à réduire la facture : elles servent à savoir ce qu'on a acheté, et elles sont la seule réponse opérationnelle au résultat de Holmström et Milgrom.

## Le budget qui cesse d'être prévisible

Un compteur au résultat produit une ligne budgétaire dont la volatilité ne ressemble à rien de ce qu'un contrôleur de gestion a l'habitude de suivre sur du logiciel.

Le siège était prévisible par construction : un nombre connu, révisé une fois l'an. L'action est volatile mais bornée par le volume de demandes entrantes, qui est une grandeur métier connue. Le résultat est volatile **et** sensible à une règle que l'acheteur ne maîtrise pas, ce qui ajoute à la variance d'usage une variance de définition. Les deux ne se couvrent pas de la même façon.

La variance d'usage se couvre par les instruments classiques, à condition de les demander explicitement. Un plafond mensuel de dépense, exprimé en montant plutôt qu'en volume, avec le comportement du système au plafond stipulé — bascule vers l'humain, file d'attente, refus — plutôt que laissé à la discrétion du fournisseur. Un engagement partiel assorti d'un tarif de dépassement connu d'avance, et la faculté de réviser le palier à la hausse comme à la baisse. Le dispositif de tarification dynamique documenté par Zendesk, qui autorise le transfert de budget entre sièges humains et résolutions automatisées sans renégociation[^6], est l'exemple le plus directement utile : il traite le point de bascule humain-machine comme une variable de pilotage mensuelle au lieu d'un arbitrage annuel.

La variance de définition ne se couvre que par l'annexe de comptage et son préavis. Sans elle, la série budgétaire perd sa comparabilité d'un trimestre à l'autre, et la perte est silencieuse : rien dans la facture ne signale qu'une fenêtre a été raccourcie. Un responsable qui compare le coût par résolution de deux trimestres consécutifs peut constater une amélioration qui est en réalité un changement d'unité de mesure.

Il y a une conséquence de gouvernance à en tirer, et elle rejoint une exigence déjà posée ailleurs sur ce site. ==Une ligne du registre des cas d'usage qui porte un contrat au résultat doit porter aussi la définition du résultat, sa version, et la date de la dernière modification.== Sans ce triplet, l'historique chiffré du cas d'usage n'est pas une série : c'est une suite de nombres qui ne mesurent pas tous la même chose.

## Six décisions, et la fenêtre où chacune reste possible

Les six décisions ci-dessous sont classées par le moment où elles cessent d'être négociables, et ce classement compte autant que leur contenu.

**Avant l'appel d'offres.**

**D1 · Exiger la règle de comptage comme pièce du dossier de candidature.** Formulée comme une question du cahier des charges, pas comme une demande en négociation : quelle est la définition exacte de l'événement facturable, quelle est la durée de la fenêtre, quels événements ne facturent pas, comment est traitée la réouverture. Un fournisseur qui ne répond pas à ce stade ne répondra pas davantage une fois choisi. Cette décision est la seule qui mette les quatre offres du relevé sur une grille comparable, et elle est gratuite.

**D2 · Décider si l'on veut un compteur interprétatif.** La question précède le choix du fournisseur. Pour un périmètre où la qualité se mesure mal — conseil, conformité, situation sensible — un compteur descriptif au nombre d'actions, assorti d'une mesure de valeur tenue en interne, expose à moins de déformation qu'un compteur au résultat dont on ne contrôle pas la définition. Le résultat de Holmström et Milgrom dit la même chose en termes théoriques : quand la mesure est trop incomplète, la rémunération fixe domine la rémunération à la performance[^10].

**À la signature.**

**D3 · Annexer la règle de comptage, versionnée, avec préavis sur modification.** Toute modification de l'annexe vaut modification tarifaire. C'est la clause qui transforme une variance de définition en variance négociée.

**D4 · Stipuler la restitution du détail du comptage et sa rétention.** Une ligne par événement facturé, horodatée, avec version d'agent, dans un format exploitable, conservée au moins le temps de la prescription du différend. Le droit d'audit se rédige dans la même clause que l'obligation de rétention, sans quoi il ne porte sur rien[^9].

**D5 · Stipuler le plafond de dépense et le comportement au plafond.** En montant et non en volume, avec la conduite du système au plafond décrite au contrat.

**En exploitation, et c'est la décision la moins chère du dossier.**

**D6 · Tenir soi-même la mesure des dimensions muettes, dès le premier jour de production.** Taux de réouverture, taux de recontact par un autre canal, exactitude sur échantillon tiré par l'acheteur, satisfaction mesurée hors du canal du fournisseur. Trois raisons d'en faire le premier geste de la mise en service plutôt qu'une bonne pratique parmi d'autres. Elle ne demande l'accord de personne à l'extérieur. Elle ne coûte qu'un relevé périodique sur des données que l'acheteur détient déjà. Et elle est irrattrapable après coup : un historique de douze mois ne se reconstitue pas, et c'est exactement l'historique qu'il faut produire le jour où l'on veut contester un compteur ou renégocier un palier.

La fenêtre se referme vite. Le parc d'applications dotées d'agents passe, selon Gartner, de moins de 5 % en 2025 à 40 % fin 2026[^3] : les contrats se signent plus vite qu'ils ne se renégocient, et une règle de comptage non annexée à la signature ne le sera pas en cours d'exécution.

## Note de méthode

Trois précautions à signaler, parce qu'elles délimitent ce que ce dossier peut affirmer.

**La part publiée est minoritaire.** Sur les quatre fournisseurs du relevé, un seul publie une grille de crédits complète et vérifiable[^8]. Les tarifs unitaires au résultat proviennent de pages commerciales et de billets de fournisseur[^5][^6][^7] ; les règles de clôture, y compris les durées de fenêtre de silence, proviennent de comparatifs tiers dont plusieurs sont écrits par des concurrents. Chaque emploi de ces relevés est signalé dans le texte comme tel. Un acheteur doit traiter les durées citées ici comme des hypothèses à faire confirmer par écrit, et cette demande de confirmation est l'objet de la décision D1.

**Aucun chiffre de marge fournisseur n'apparaît.** La tentation est forte de calculer ce que gagne un éditeur qui vend une résolution à 1,50 $ et achète son inférence au jeton. Aucun des fournisseurs cités ne publie ce qu'il faudrait pour le faire, et un tel calcul serait une reconstitution. L'argument de la section sur la variance ne repose donc pas sur une marge estimée, mais sur deux faits publiés : la trajectoire attendue du coût d'inférence par flux agentique[^1] et la bascule documentée d'un fournisseur du compteur au résultat vers le compteur à l'action[^8].

**Le cas Klarna est une illustration, pas une démonstration.** Les chiffres de février 2024 comme le constat de mai 2025 sont des déclarations d'entreprise, et aucun taux de résolution vérifié n'est disponible pour 2025 ou 2026. Le cas sert à établir qu'une métrique de volume et une appréciation de qualité peuvent diverger durablement, ce qui suffit à l'argument et n'exige pas de chiffre contesté.

*Format co-écrit avec l'aide d'une IA.*

## Sources

[^1]: Gartner, *Gartner Predicts AI Inference Costs Per Agentic Workflow Will Increase More Than Fivefold Through 2028*, communiqué de presse, 17 août 2026. https://www.gartner.com/en/newsroom/press-releases/2026-08-17-gartner-predicts-ai-inference-costs-per-agentic-workflow-will-increase-more-than-fivefold-through-2028

[^2]: Gartner, *Gartner Says $234 Billion in Enterprise Application Software Spend Is at Risk from Agentic AI*, communiqué de presse, 1ᵉʳ juillet 2026. https://www.gartner.com/en/newsroom/press-releases/2026-07-01-gartner-says-us-dollars-234-billion-in-enterprise-application-software-spend-is-at-risk-from-agentic-artificial-intelligence

[^3]: Gartner, *Gartner Predicts 40% of Enterprise Apps Will Feature Task-Specific AI Agents by 2026, Up from Less Than 5% in 2025*, communiqué de presse, 26 août 2025. https://www.gartner.com/en/newsroom/press-releases/2025-08-26-gartner-predicts-40-percent-of-enterprise-apps-will-feature-task-specific-ai-agents-by-2026-up-from-less-than-5-percent-in-2025

[^4]: Channel Dive, *Agentic AI is shifting the pricing models CIOs rely on*, 2026. Entretien et citations de Tom Coshow, analyste vice-président chez Gartner. https://www.channeldive.com/news/agentic-ai-outcome-pricing-models-zendesk-gartner/829209/

[^5]: Zendesk, *Zendesk First in CX Industry to offer Outcome-Based Pricing for AI Agents*, salle de presse. https://www.zendesk.com/newsroom/articles/zendesk-outcome-based-pricing/

[^6]: Zendesk, *Understanding outcome-based pricing: a results-driven framework*. https://www.zendesk.com/blog/ai/agentic-ai/outcome-based-pricing/

[^7]: Intercom, *AI customer service agent pricing comparison*, centre d'apprentissage. https://www.intercom.com/learning-center/ai-customer-service-agent-pricing-comparison

[^8]: Salesforce, *Agentforce Pricing*, article d'aide 004811240. https://help.salesforce.com/s/articleView?id=004811240&language=en_US&type=1

[^9]: Mayer Brown, *Key Contract Issues in Agentic AI Implementation and Integration Deals*, juin 2026. https://www.mayerbrown.com/en/insights/publications/2026/06/key-contract-issues-in-agentic-ai-implementation-and-integration-deals

[^10]: Bengt Holmström, *Pay for Performance and Beyond*, conférence Nobel, 8 décembre 2016 (et Bengt Holmström & Paul Milgrom, « Multitask Principal-Agent Analyses: Incentive Contracts, Asset Ownership, and Job Design », *Journal of Law, Economics, and Organization*, vol. 7, 1991, p. 24-52). https://www.nobelprize.org/uploads/2018/06/holmstrom-lecture.pdf

[^11]: Forbes, *Klarna Reverses AI Push, Says Customers Prefer Human Support*, 18 mai 2025. https://www.forbes.com/sites/quickerbettertech/2025/05/18/business-tech-news-klarna-reverses-on-ai-says-customers-like-talking-to-people/

[^12]: IDC, *Zendesk's Outcome-Based Pricing for AI Agents: A Shift Toward Resolution-Centric Customer Service*, document US53414425. https://my.idc.com/getdoc.jsp?containerId=US53414425
