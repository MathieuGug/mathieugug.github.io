# Chapitre 25 — Politique : procès Musk v. Altman

> **Acte IV — Mesures et garde-fous · Court encart, ~12 pages**
> _**Lundi 18 mai 2026, 14 h 27 PT, Ronald V. Dellums Federal Building, Oakland.** La juge Yvonne Gonzalez Rogers prononce un *directed verdict* sous *Fed. R. Civ. P. 50(a)* pour les défendeurs. Cinq heures de délibération du jury *advisory*, douze minutes de lecture, seize jours d'audience refermés sur la doctrine la moins couverte par la presse pendant tout le procès : la prescription. Le verrou Dudney a tenu — le forensic accountant d'AlixPartners a démontré, dollar par dollar sur les 38 M$ Musk de 2015-2017, que toute la fenêtre temporelle utile était déjà éteinte au 5 août 2021, trois ans avant le dépôt de la plainte fédérale. Les trois griefs survivants (breach of charitable trust, unjust enrichment, aiding & abetting Microsoft) sont morts en équité civile sans qu'une seule conclusion doctrinale ne soit rédigée. Le 27 avril, jour de l'ouverture, j'avais ouvert un dossier de veille « jour-J » et un journal quotidien. Ce chapitre fige une lecture au 27 mai 2026 — neuf jours après le verdict, à un moment où le dossier s'est déjà redistribué sur trois arènes parallèles que ni le verdict ni la presse n'avaient anticipées. Court encart, structurellement asymétrique avec les chapitres standard : ce n'est pas l'instanciation d'une discipline d'ingénierie ; c'est le test contentieux d'une question politique posée au Ch.24._

> [!QUESTION] Question d'ouverture
> Le Ch.24 a posé la question politique de la direction de l'IA : qui en décide, au bénéfice de qui ? Le procès Musk v. Altman — ouvert à Oakland le 27 avril 2026, clos par *directed verdict* le 18 mai — est le premier test contentieux à grande échelle de cette question dans le droit américain. ==Qui contrôle la frontière entre *safety narrative* et marché ouvert — et que dit le verdict du 18 mai 2026 du contrat moral implicite des labs frontière, à la fois pour les obligations légales qu'il fixe et pour les questions doctrinales qu'il a soigneusement laissées indéterminées ?==

> [!TLDR] TL;DR décideur
> - ==Le procès cristallise **trois positions doctrinales incompatibles**== sur ce qu'un lab frontière doit être : (1) ***safety hard*** — la safety est un devoir fiduciaire dérivé d'une charte caritative, opposable à tout pivot commercial ultérieur (la position Musk) ; (2) ***scaling efficient*** — la safety se fait à l'échelle, et l'échelle exige un capital privé qu'une *nonprofit* pure ne peut pas mobiliser (la position OpenAI/Microsoft) ; (3) ***governance-as-service*** — la safety est un produit de gouvernance (PBC, *Public Benefit Corporation*, Foundation Board, *Long-Term Benefit Trust*) qui se calibre à l'institutionnel, pas au charitable (la position Anthropic-xAI implicite, devenue dominante après le 18 mai). Le verdict ne tranche aucune des trois — il tranche une prescription.
> - **L'entonnoir judiciaire — 26 griefs → 4 → 2 → 0 tranchés au fond.** Complainte amendée novembre 2024 : 26 chefs. Décision Gonzalez Rogers 15 janvier 2026 : 4 survivants après *summary judgment*. Retrait volontaire 24 avril 2026 : 2 griefs (*breach of charitable trust*, *unjust enrichment*). Verdict 18 mai 2026 : 0 griefs tranchés au fond — tous éteints en prescription. ==Le procès est mort sur un *threshold*, pas sur une doctrine.==
> - **Le *directed verdict* du 18 mai produit une *jurisprudence négative*** : six questions doctrinales restent ouvertes après le procès (formation du *charitable trust* d'un donateur historique d'AI lab, *self-dealing* sous Cal. Corp. Code §5233, *safe harbor Casey* étendu aux partenariats frontière, plafond *Liu v. SEC* en équité civile, périmètre *parens patriae* AG, *constructive knowledge* d'un *settlor* historique). Aucune n'est tranchée. Pour les futurs défendeurs (Anthropic, xAI), le silence doctrinal vaut **bouclier proleptique**.
> - **Le dossier ne se referme pas, il se *redistribue* sur trois arènes parallèles.** Arène judiciaire (appellate 18-24 mois, proba remand ≈ 5 %), arène opérationnelle (secondary 8-12 Md$ pré-armé en six heures lundi soir post-verdict, *tender closing* visé fin Q3 2026), arène civile et administrative (pétition §12598 EyesOnOpenAI déposée le 22 mai, délai de réponse Bonta 60-90 jours — collision calendaire avec le *tender closing* fin juillet-août 2026).
> - ==Trois positions doctrinales, trois arènes post-verdict, un précédent jurisprudentiel par défaut.== Le procès n'a pas répondu à la question politique du Ch.24. Il a transféré la réponse à des institutions tierces — régulateurs civils, ONG mobilisées, marchés privés. Et il a, par son silence doctrinal, prolongé de 5 à 10 ans la fenêtre dans laquelle un lab frontière peut convertir son non-profit en PBC sans risque jurisprudentiel matériel.
> - **Pour le lecteur français**, le procès offre un précédent comparatif sur trois questions actives en Europe : la frontière entre intérêt général et profit dans les modèles hybrides (PBC, *société à mission* française, B Corp) ; la capacité d'un donateur structurant à enforcer les termes implicites d'une charte caritative ; et la prise en compte juridique des risques systémiques de l'AGI dans la gouvernance corporate.
> - ==Encart méthodologique==. Ce chapitre fige une lecture au **27 mai 2026** — neuf jours après le verdict. Le journal quotidien en ligne (`proces-musk-altman/journal.html`) reste la source vivante ; ce chapitre cristallise la grille de lecture stabilisée à fin mai. Le seul dossier *veille en temps réel* du livre — assumé comme tel.

---

## 25.1 Place du chapitre — le contrefort politique du livre

Le Ch.24 a posé la question politique de la direction de l'IA — ==qui en décide, au bénéfice de qui, et combien de temps reste-t-il aux institutions pour orienter la trajectoire avant que le palier économique soit franchi==. Le Ch.25 prend cette question et regarde **comment elle se cristallise dans un contentieux judiciaire concret**. Pas une affaire interne à la *Silicon Valley* ; le premier test contentieux à grande échelle de la question « *qui contrôle un lab frontière, et au nom de quelle mission* » dans le droit américain.

Trois propriétés rendent ce chapitre structurellement asymétrique avec les autres chapitres de l'Acte IV.

**Première propriété — court encart, pas chapitre standard.** Les chapitres 17 à 23 instancient chacun une discipline d'ingénierie ou de conformité (évaluation, observabilité, garde-fous, runtime, ROI, IA frugale, gouvernance) sur 22 pages. Le Ch.25 fait **12 pages**, parce que sa matière n'est pas une discipline mais un événement — un procès, un verdict, une redistribution institutionnelle. Le format suit la matière.

**Deuxième propriété — encart « veille en temps réel ».** Le dossier source[^proces-musk-altman-dossier] a été ouvert le **27 avril 2026** — le jour même de l'ouverture du procès à Oakland — avec un *journal quotidien* qui n'existe pour aucun autre dossier du corpus[^journal-proces]. Le journal a couru du 1ᵉʳ mai 2026 au 24 mai 2026 et continue de courir. Ce chapitre **fige une lecture au 27 mai 2026** — neuf jours après le verdict — à un moment où la grille de lecture stabilisée (« le procès n'a pas refermé le dossier — il l'a *partagé* ») s'est imposée comme convergence éditoriale entre le *New York Times*, le *Financial Times* et le *Wall Street Journal* le week-end du 23-24 mai. Le journal en ligne reste la source vivante pour les évolutions post-27 mai ; le Ch.25 cristallise la lecture à cette date.

**Troisième propriété — il ferme le livre, mais ne conclut pas.** Le procès ne tranche pas la question politique du Ch.24. Il en pose les positions doctrinales en termes juridiquement opposables, il les laisse indéterminées par silence doctrinal, et il transfère la suite aux institutions tierces (régulateurs civils, ONG mobilisées, marchés privés). ==C'est précisément ce silence qui fait du Ch.25 le bon contrefort de clôture==. Un livre qui se serait fermé sur une réponse politique nette aurait surdéterminé la trajectoire ; le Ch.25 ferme le livre sur l'observation que la trajectoire reste, en fin mai 2026, ouverte.

> [!INFO] Voir Ch. 24 — Société : IA et travail · Épilogue — Sept paris à dater 2027-2028
> Le Ch.24 a posé la question politique de la direction de l'IA ; le Ch.25 montre comment elle se cristallise dans un contentieux qui finit par *ne pas* trancher au fond. L'Épilogue mobilisera ce silence doctrinal comme l'un des sept paris à dater 2027-2028 — la question d'une nouvelle vague contentieuse (Anthropic, xAI, ou un *Musk v. Altman 2.0* sous un nouvel angle doctrinal) reste explicitement ouverte. ==Pris ensemble, Ch.24 + Ch.25 + Épilogue forment la séquence politique du livre== — chacun pose une question, aucun ne prétend la fermer définitivement.

---

## 25.2 Chronologie 2015-2026 — du courriel fondateur au verdict

![Chronologie 2015-2026 — onze années de bascule sur trois pistes parallèles (gouvernance, contentieux, écosystème commercial)|1300](../../proces-musk-altman/images/20260427-01-chronologie.svg)

Le schéma dispose la **chronologie sur trois pistes parallèles** — gouvernance, contentieux, écosystème commercial — de mai 2015 à mai 2026. Onze années de bascule, de l'idée commune Altman-Musk à la rupture judiciaire d'Oakland.

L'histoire débute par un courriel du **25 mai 2015**. Sam Altman, alors président de Y Combinator, écrit à Elon Musk : « *Y a-t-il moyen d'empêcher l'humanité de développer l'IA ? Je pense que la réponse est non. Si elle doit advenir, mieux vaudrait que ce ne soit pas Google qui le fasse en premier. Et si YC démarrait un Manhattan Project pour l'IA ?* »[^tarantola-engadget]. Musk répond le soir-même : « *Probablement la peine d'en discuter.* » De cette correspondance naît, en **décembre 2015**, OpenAI Inc. — *Delaware nonprofit corporation* dont la charte stipule l'avancement de l'intelligence numérique « *sans contrainte de retour financier* »[^openai-evolve].

Musk apportera l'essentiel du capital initial : **38 M$ de dons cumulés** entre décembre 2015 et mai 2017, sur 137 M$ levés par OpenAI à cette période[^openai-elon-for-profit]. Il joue aussi un rôle déterminant dans le recrutement d'Ilya Sutskever depuis Google Brain — qu'il qualifiait alors de « *pierre angulaire* » du succès du laboratoire[^ringer-deepdive].

**2017 est pivot.** Musk, Altman et Brockman débattent de la nécessité de lever des fonds à une échelle incompatible avec un pur statut caritatif. Musk lui-même propose, en septembre 2017, la création d'une *public benefit corporation* qu'il aurait dirigée — un point que la défense d'OpenAI exploitera abondamment[^opentools-trial-begins]. Mais quand sa demande de contrôle majoritaire est refusée, il claque la porte du conseil en février 2018, invoquant officiellement un risque de conflit d'intérêts avec Tesla[^cooper-ap]. C'est dans cette même fenêtre que Greg Brockman consigne, dans son journal personnel, la phrase qui hante désormais la défense : ==*« Je ne peux pas croire que nous nous soyons engagés dans un nonprofit si trois mois plus tard nous faisons une b-corp — alors c'était un mensonge. »*==[^techbuzz-diaries].

**2019 — la machine commerciale s'emballe.** OpenAI crée OpenAI LP, sa filiale *capped-profit* à plafond de retour 100×, et signe le partenariat Microsoft (13 G$ en cash et crédits cloud sur cinq ans, plus une exclusivité Azure pré-AGI)[^microsoft-next-chapter]. La machine décolle avec la sortie publique de ChatGPT en novembre 2022 — quatre ans après le départ de Musk. Lorsqu'Altman est briefly limogé puis réintégré en novembre 2023 (« le *Blip* »), c'est Microsoft qui orchestre le retour, scellant son emprise sur la trajectoire commerciale[^dworetzky-allies].

Musk dépose une première plainte en *California Superior Court* le **29 février 2024**, puis la retire le **11 juin**, à la veille de l'audience prévue sur la *motion to dismiss*. Il revient à la charge le **5 août 2024** devant la *U.S. District Court for the Northern District of California* — cette fois avec une équipe juridique reconstituée autour de Marc Toberoff et Steven Molo, dont l'un des conseils a comparé la première plainte à un « *poisson rouge* » et la nouvelle à un « *grand requin blanc* »[^ringer-deepdive].

---

## 25.3 Anatomie du procès — l'entonnoir 26 → 4 → 2 → 0

![Entonnoir judiciaire — du « kitchen sink » de novembre 2024 au resserrement de la veille de procès le 25 avril 2026|1300](../../proces-musk-altman/images/20260427-02-entonnoir-griefs.svg)

Le schéma dispose la **trajectoire d'attrition** des griefs en trois temps. La complainte amendée de novembre 2024 ratisse large : 26 chefs incluant antitrust fédéral, RICO, fraude, rupture de contrat, concurrence déloyale, *false advertising*, *breach of fiduciary duty* et *breach of charitable trust*[^findlaw-musk-openai]. La logique est défensive — multiplier les angles pour résister au filtre des *motions to dismiss* — mais elle s'érode rapidement sous les rulings successifs de Gonzalez Rogers.

### 25.3.1 L'attrition en trois temps

**Premier temps**, courant 2025 : la juge écarte les griefs antitrust, RICO, *false advertising* et rupture de contrat sur *motions* de rejet ou *summary judgment* partiel.

**Deuxième temps**, le **15 janvier 2026** : dans une décision de 28 pages que les avocats d'OpenAI redoutaient depuis des mois, Gonzalez Rogers refuse de prononcer le *summary judgment* demandé conjointement par OpenAI et Microsoft — concluant qu'il existe « *ample evidence* » au dossier et que « *des questions de fait pour le jury* » subsistent[^pymnts-trial-headed]. Elle cite explicitement l'entrée du journal de Brockman comme indice circonstanciel d'une intention trompeuse[^dworetzky-trial-date]. Quatre griefs survivent : fraude, *constructive fraud*, enrichissement sans cause, *breach of charitable trust*. Le 31 mars 2026, elle exclut par ailleurs les *punitive damages*, jugés inadaptés au profil patrimonial des défendeurs et au type de remèdes recherchés[^opentools-trial-begins].

**Troisième temps**, vendredi **24 avril 2026** : Musk demande lui-même le retrait des deux griefs de fraude pour « *streamliner* » l'affaire[^fortune-fraud-drop]. Cette manœuvre tactique est lue de deux manières. ==Du côté Musk, elle élimine la nécessité de prouver une intention dolosive — un seuil de preuve élevé qui aurait orienté le procès vers l'état d'esprit d'Altman plutôt que vers la mission caritative violée==[^afp-fraud-drop]. Du côté OpenAI, c'est une concession de faiblesse : « *Musk fait semblant de changer d'angle alors qu'il s'agit toujours de pouvoir et d'argent.* »

### 25.3.2 Les deux griefs survivants au procès

Les deux griefs entrés au procès sont enracinés dans le droit californien des organisations caritatives. Le ***breach of charitable trust*** repose sur la doctrine selon laquelle, dès leur réception, les actifs d'une corporation à but exclusivement caritatif sont « *irrévocablement dédiés* » à la mission de la charte — quand bien même le donateur n'aurait imposé aucune restriction explicite[^takagi-trust-doctrine]. L'***unjust enrichment*** vise plus directement les bénéficiaires individuels (Altman, Brockman) et institutionnels (Microsoft) du basculement structurel, à hauteur des avantages patrimoniaux indus.

Une particularité ajoute du sel : le *California Attorney General* Rob Bonta a été *involuntarily joined* à l'affaire après que Musk lui a demandé l'autorisation de poursuivre « *au nom* » d'OpenAI — sans réponse[^dworetzky-shakeup]. Le Delaware AG Kathleen Jennings a, elle, déposé un *amicus brief* le 30 décembre 2024 reconnaissant que « *un préjudice significatif et irréversible existe lorsque l'argent du public sert à convertir un nonprofit en for-profit* ». ==Les deux AG ont néanmoins, en octobre 2025, validé la recapitalisation moyennant des memoranda of understanding== — ce qui complique le récit de Musk.

---

## 25.4 Trois positions doctrinales incompatibles

Au-delà du contentieux juridique, le procès cristallise **trois positions doctrinales** sur ce que doit être un lab frontière — incompatibles entre elles, et dont l'affrontement constitue la véritable matière politique du chapitre.

### 25.4.1 *Safety hard* — la position Musk

La safety est un devoir fiduciaire dérivé d'une **charte caritative**, opposable à tout pivot commercial ultérieur. Le donateur historique d'un lab frontière dispose d'un *standing* en équité civile pour faire respecter les termes implicites de la mission, même en l'absence de restriction explicite dans le *deed of gift*. La concentration de capital privé sur le développement des modèles de fondation crée une **incompatibilité structurelle** avec la mission de bénéfice humain universel.

L'expert AGI safety **Stuart Russell** (UC Berkeley), témoin de Musk, devait formaliser cette position au procès : « *les sociétés d'IA ont de très fortes incitations à poursuivre l'AGI malgré les risques de safety* »[^dworetzky-trial-date]. La juge a néanmoins exclu la portion de son rapport qui qualifiait ces risques de « *catastrophiques pour l'humanité* », jugée non quantifiée et préjudiciable — le procès n'a finalement pas atteint son témoignage.

### 25.4.2 *Scaling efficient* — la position OpenAI / Microsoft

==La safety se fait à l'échelle, et l'échelle exige un capital privé qu'une *nonprofit* pure ne peut pas mobiliser.== La conversion structurelle (nonprofit → *capped-profit* → PBC) n'est pas une trahison de la mission caritative — c'est le moyen opérationnel de la réaliser. Le partenariat Microsoft (13 G$ initial, 100 Md$+ extension étendue jusqu'en 2032 sous l'accord d'octobre 2025) est l'instanciation financière nécessaire ; le *capped-profit* à 100× était l'invention de gouvernance qui rendait cet alignement possible ; la PBC sous Foundation Board est l'évolution institutionnelle qui consolide l'arbitrage sans renier l'origine.

C'est la position formalisée dans la note d'octobre 2025 *Why our structure must evolve to advance our mission*[^openai-evolve] et défendue à l'audience par Wachtell, Lipton, Rosen & Katz (William Savitt) en cabinet d'OpenAI, ainsi que par Cravath, Swaine & Moore (Brad Smith en *amicus de fait*) pour Microsoft. ==Position adversarial avec Musk, dominante institutionnellement post-conversion d'octobre 2025==, ratifiée par les AG californien et delawarien après concessions sur la sécurité, la résidence et le pouvoir de nomination du Foundation Board.

### 25.4.3 *Governance-as-service* — la position Anthropic-xAI implicite

La safety est un **produit de gouvernance** (PBC, Foundation Board, *Long-Term Benefit Trust*) qui se calibre à l'institutionnel, pas au charitable. **Anthropic** a été fondée fin 2021 par Dario et Daniela Amodei (ex-OpenAI), structurée en *Public Benefit Corporation* dès l'origine, et a installé fin 2023 l'*Anthropic Long-Term Benefit Trust* (LTBT) — un trust en *Class T stock* avec pouvoir d'élire (à terme, à partir de l'année 5) la majorité du board. C'est, en théorie de la gouvernance, le **double exact** du Foundation Board mis en place par l'accord Bonta-Jennings d'octobre 2025 sur OpenAI — avec une différence : Anthropic n'a pas eu de phase non-profit historique à convertir, donc le risque d'un procès « *breach of charitable trust* par un donateur historique » ne lui est, en droit, pas applicable[^journal-2026-05-20].

**xAI**, société de Musk fondée en juillet 2023, suit la même logique structurellement — *Delaware corporation* commerciale dès l'origine, sans phase non-profit. Position structurellement convergente avec Anthropic sur ce point précis.

==La position *governance-as-service* est, post-18 mai 2026, devenue dominante par défaut== : le procès en a, par silence doctrinal, écarté les deux concurrentes (la *safety hard* a perdu, la *scaling efficient* n'a pas eu à se défendre au fond). Elle a aussi un avantage tactique : elle est compatible avec n'importe quel lab qui n'a *jamais* été non-profit, ce qui couvre la totalité du marché frontière de 2026 sauf OpenAI.

> [!IMPORTANT] La triple incompatibilité doctrinale
> ==Les trois positions ne sont pas trois variantes d'une même doctrine ; elles sont structurellement incompatibles.== *Safety hard* refuse la conversion comme principe ; *scaling efficient* en fait le moyen opérationnel obligatoire ; *governance-as-service* la contourne en n'ayant jamais été non-profit. Aucune réconciliation jurisprudentielle ne s'est dégagée au procès, parce que la juge n'a tranché que la prescription. Le verdict du 18 mai n'arbitre pas entre les trois — il en éteint une (Musk) en première instance, en laisse une autre (OpenAI) intacte mais fragilisée, et confirme la troisième (Anthropic-xAI) par effet de précédent procédural. **L'arbitrage politique reste à faire.**

---

## 25.5 Le verdict du 18 mai 2026 — *filed too late*

### 25.5.1 La séquence du lundi 18 mai

Lundi 18 mai 2026, à **14h05 PT**, le jury *advisory* de neuf personnes (six femmes, trois hommes) rend, après cinq heures de délibération à huis clos au Ronald V. Dellums Federal Building, son verdict consultatif sur l'étage 1 du *jury charge*[^reuters-verdict]. Sur les trois griefs : ==*filed too late*==. Pas d'entrée dans l'étage 2. Pas de débat sur la *credibility* d'Altman, sur la pile Sutskever-Murati-Toner-McCauley, sur le pivot Hoffman, sur l'email Scott, sur le mémo Brad Smith. Une seule question, binaire, tranchée.

À **14h27 PT**, la juge Gonzalez Rogers exécute son pré-engagement de la semaine précédente — « *highly susceptible to accept that finding and direct verdict to the defendants* ». En **douze minutes**, elle rend un *judgment as a matter of law* sous *Federal Rule of Civil Procedure 50(a)* pour les défendeurs sur les trois griefs[^techcrunch-directed-verdict]. ==Aucune *findings of fact and conclusions of law* en équité ne sera jamais rédigée.==

À **14h35 PT**, la phase *remedies* qui devait s'ouvrir l'après-midi même est **annulée pour cause de *mootness*** — Steven Molo, qui s'apprêtait à entamer son argumentaire pour le *disgorgement* complet, se voit retirer la parole. L'audience que les commentateurs imaginaient comme une bataille de plusieurs jours sur les remèdes est ouverte puis fermée dans le même quart d'heure[^law360-remedies-mooted].

### 25.5.2 Le verrou Dudney

Le *pool reporting* organisé mardi matin avec trois des neuf jurés a permis un *informal jury briefing* qui converge sur un point unique : ==Louis Dudney, forensic accountant d'AlixPartners, a structuré à lui seul la délibération sur les trois cutoffs==[^bitcoinworld-pool]. Témoignage technique court (≈ 90 minutes en direct + 50 minutes en cross), tableau Excel dollar-par-dollar des 38 M$ Musk entre 2015-2017, conclusion sous serment que tous les fonds avaient été dépensés en mission charitable avant le 5 août 2021 — il n'a pas été démonté en cross par Molo.

Citation du foreperson rapportée par *Bitcoinworld* via le pool : « *We just looked at the timeline. The donations were spent. The math was the math.* » Le verdict est arrivé en cinq heures — sensiblement plus court que les 2-3 jours qu'imaginait la presse pour l'entrée dans l'étage 2 ; sensiblement plus long que les quatre heures que la lecture procédurale du 16 mai avait posé comme scénario défense optimal. ==La marge supplémentaire correspond, en décompte fin, au temps qu'il a fallu aux jurés pour rejeter la doctrine du *delayed discovery*== sur le grief 2 — argument que Molo avait plaidé en cross-examination du forensic accountant, et qui aurait pu sauver le grief *unjust enrichment* si le jury avait retenu que Musk n'avait pas *constructive knowledge* du préjudice avant 2022. Le départ de Musk du board en février 2018, sept ans avant le dépôt de la plainte en août 2024, valait *constructive knowledge* — ==c'est le bon sens populaire, pas une question doctrinale==.

### 25.5.3 Pourquoi le verdict *advisory* a terminé le procès

Un point que la presse mardi matin a, dans une majorité de papiers, mal formulé. Le verdict du jury *advisory* n'est pas, en soi, dispositif — sous *Federal Rule of Civil Procedure 39(c)* et 52(a)(1), la juge écrit seule, en équité, les *findings of fact and conclusions of law*. **Mais sur la prescription** — qui est, doctrinalement, une *defense affirmative* opérant comme *threshold question* — la juge n'a pas besoin d'écrire de *findings of fact* en équité pour conclure le procès. *Rule 50(a)* lui permet, *as a matter of law*, de constater que la base factuelle du jury (les *findings* binaires : la plainte a-t-elle été déposée avant ou après le cutoff ?) est suffisante pour disposer du procès. ==L'étage 1 est, en équité comme en droit, un *kill switch* — pas un *advisory step*==.

Mardi 19 mai, **Steven Molo annonce en sortie d'audience l'intention de Musk de faire appel** auprès du *9th Circuit* sous *Fed. R. App. P. 4* — fenêtre de 30 jours, butoir 17 juin 2026[^politico-appeal-9th]. Voie appellate **étroite** : l'appel ne pourra pas attaquer le verdict consultatif du jury (qui n'est, doctrinalement, qu'avis), mais devra cibler deux questions de droit dans le *jury charge* — (i) le rejet de la doctrine *continuing violation* sous *Aryeh v. Canon Business Solutions*, 55 Cal. 4th 1185 (Cal. 2013) ; (ii) la formulation de la *constructive knowledge* en *delayed discovery* sous *Bedolla v. Logan & Frazer*, 52 Cal. App. 3d 118. **Standard de review : *abuse of discretion***. Probabilité personnelle d'un *remand* à la 9th Circuit : **≈ 5 %**. Kalshi : **3 %**[^journal-2026-05-19].

---

## 25.6 Le *partage des arènes* — la grille de lecture post-verdict

![Le partage des arènes — bilan post-verdict semaine 1, trois théâtres parallèles, première collision juillet-août 2026|1300](../../proces-musk-altman/images/journal-2026-05-24-partage-arenes.svg)

Le schéma dispose les **trois arènes parallèles** sur lesquelles le dossier OpenAI s'est redistribué dans les six jours qui ont suivi le verdict du 18 mai. Le constat structurel : ==le procès n'a pas refermé le dossier — il l'a *partagé*==. Entre trois théâtres opérant désormais en parallèle, dotés chacun d'un calendrier propre, d'institutions propres, d'instruments propres, et d'une logique de décision propre. C'est ce partage — pas le verdict, pas le secondary, pas la pétition — qui constitue le **résultat structurel de la semaine 1**.

Trois titres premium qui couvrent OpenAI depuis 2023 — *NYT* (Cade Metz, 23 mai), *FT* (Hannah Murphy, 24 mai), *WSJ* (Deepa Seetharaman, 24 mai) — ont publié à 96 h d'écart trois *weekend takeaways* éditoriaux qui convergent sur cette formule[^journal-2026-05-24]. ==Convergence éditoriale rare entre les trois titres qui sert de signal de cristallisation de frame== : à partir de cette semaine, tout *legal correspondent* qui écrit sur OpenAI partira de la grille « trois arènes en parallèle », pas de la grille initiale du verdict (procès clos, jurisprudence faite).

### 25.6.1 Première arène — judiciaire, fermée à 14h27 PT lundi

Le verrou Dudney a tenu sur la prescription. Le *directed verdict* a réglé les trois griefs sans toucher au fond. ==L'arène n'est pas définitivement scellée==[^journal-2026-05-22] — la fenêtre *Fed. R. App. P. 4* court 30 jours, et un *notice of appeal* Molo-Toberoff reste possible avant le 17 juin — mais la probabilité d'un *remand* à la 9th Circuit reste sous les 5 %. L'arène judiciaire est en **standby dormant pour 18-24 mois**, le temps de l'appel. Pendant ce temps, elle ne produit rien — ni doctrine, ni faits nouveaux, ni pression sur les acteurs. Sa seule production résiduelle : la pile d'*amici* académiques en formation (ACTEC, *Harvard Law Review* annonce un *Notes & Comments* à paraître en septembre 2026 sur la *charitable trust formation doctrine* dans le contexte des AI labs) — **précédent intellectuel, pas levier opérationnel**.

### 25.6.2 Deuxième arène — opérationnelle, accélérée à 20h12 PT lundi

==Wachtell a transmis un *term sheet* secondary à Morgan Stanley et Goldman Sachs **six heures et seize minutes après le verdict**==[^the-information-secondary]. La cible : 8-12 Md$, valorisation 500 Md$ post-money, *closing* visé fin Q3 2026 (août-septembre). Le *term sheet* avait été pré-armé en trois versions calibrées sur les trois scénarios *liability* du procès : (a) *directed verdict défense* — version 8-12 Md$, 500 Md$ ; (b) *verdict mixte* — version 4-6 Md$, 380 Md$ ; (c) *verdict Musk* — *secondary annulé*. La version (a) est sortie du tiroir lundi 18 mai à 14h32 PT, signée numériquement par Brad Lightcap à 15h08 PT, transmise à Morgan Stanley à 17h45 PT. ==Six heures et seize minutes — délai d'exécution opérationnelle d'une corporation qui avait pré-armé chacun des trois scénarios.==

C'est l'arène la plus rapide — son cycle de décision est mensuel, ses acteurs (Bret Taylor au Foundation Board, Brad Lightcap au *Operating Board*) sont identifiés, ses instruments (mémo « *material transaction* », *recusal* §5233, PPM *Rule 506(c)*) sont prêts. Et c'est, paradoxalement, **l'arène la moins exposée régulatoirement à court terme** : sa logique est commerciale, ses contraintes sont contractuelles, son arbitrage est interne.

### 25.6.3 Troisième arène — civile et administrative, ouverte à 10h PT vendredi

Vendredi 22 mai à 10h PT, la coalition **EyesOnOpenAI** (>50 organisations menée par l'*Economic Security Project*, avec Public Citizen, le Midas Project, AI Now Institute et EPIC) a transformé son courrier du 6 mai 2026 en *administrative petition* formelle sous *California Government Code §12598*[^journal-2026-05-22], demandant à l'AG Bonta l'ouverture d'une investigation indépendante sur l'allocation des actifs charitables post-recap d'octobre 2025 et sur le *secondary* Q3 2026. Document de 47 pages, co-signé par cinq ONG pivot.

==Le silence prolongé de sept mois que Bonta tenait depuis octobre 2025 vient, par mécanique procédurale, de basculer en obligation de répondre publiquement entre le **21 juillet et le 20 août 2026** — exactement la fenêtre du *tender closing* du secondary visé par Wachtell==. Le silence n'est plus une option : il devient, sous délai, un *constructive denial* qui ouvre, à son tour, la voie à un *writ of mandate* (action en cogestion judiciaire de l'obligation administrative). C'est, en théorie de la régulation administrative, une **bascule de pouvoir** discrète mais binaire.

C'est l'arène la plus lente (60-90 jours par cycle), mais la seule qui force *publiquement* une institution publique à *publier* sa lecture du seuil de matérialité contestable.

### 25.6.4 Pourquoi le partage est structurel et non conjoncturel

Trois indices. **(1)** Chaque arène a son **horloge propre** — 18-24 mois pour l'appellate, 30-90 jours pour le secondary, 60-90 jours pour l'administratif. Les cycles ne se synchronisent qu'aux *collision points* — le plus saillant étant la **fenêtre 21 juillet — 20 août 2026** où la réponse Bonta croise le *tender closing*. **(2)** Chaque arène a ses **acteurs spécialisés** — Molo-Toberoff côté appellate, Wachtell-Lightcap-Taylor côté opérationnel, Lieff Cabraser-Public Citizen-Midas Project côté civil. Aucun acteur ne joue dans les trois. **(3)** Chaque arène a ses **instruments propres** — *Fed. R. App. P. 4* + *Aryeh v. Canon* en appellate, *Cal. Corp. Code §5233* + *Smith v. Van Gorkom* + *Rule 506(c)* en opérationnel, *Cal. Gov. Code §12598* + *writ of mandate* en civil. Aucun instrument n'opère dans plus d'une arène.

==Le partage est, en théorie de la régulation, doctrinalement étanche.== Et c'est cette étanchéité qui fait qu'on doit, à partir de fin mai 2026, suivre trois calendriers en parallèle — pas un seul. La semaine 1 post-verdict est, en termes systémiques, la semaine de la **redistribution**. La semaine 9 (mi-juillet) sera celle de la **première collision**.

> [!QUOTE] Casey Newton — *Platformer*, 23 mai 2026
> *« The trial wasn't about Musk — it was about whether a frontier lab can refactor its governance under shareholder pressure without judicial review. The answer, this week, is yes. With three asterisks. »*[^journal-2026-05-24]
> Les trois astérisques de Newton renvoient implicitement aux trois arènes — le *secondary*, la pétition §12598, l'appel à la 9th Circuit. ==Aucune ne ferme l'arbitrage politique du Ch.24== ; chacune le déplace vers une institution tierce dotée de sa propre logique. C'est, pour qui regarde la trajectoire de gouvernance frontier lab sur 18-36 mois, **le rythme structurel post-verdict**.

---

## 25.7 La *jurisprudence négative* — six doctrines ouvertes

Une décision tranchée en équité — même partielle, même limitée à un grief — aurait produit, sous *Rule 52(a)*, un *finding of fact* qu'un futur plaignant aurait pu citer en appui (ou un futur défendeur aurait pu citer en bouclier). Un *directed verdict* sous *Rule 50(a)* sur la prescription, lui, **ne produit aucun précédent doctrinal substantif** — il produit seulement la jurisprudence procédurale d'une prescription bien plaidée[^journal-2026-05-20]. ==Pour les futurs défendeurs, c'est l'idéal : le doute doctrinal reste un doute, et le doute doctrinal protège l'incumbent — pas le challenger.==

Six doctrines restent ouvertes après le verdict du 18 mai, par ordre de portée structurelle :

1. **La formation du *charitable trust*** sous *Probate Code §15201* et *Restatement (Third) of Trusts §2*. Altman a témoigné le 12 mai 2026 que « *there were never any promises made that could form the charitable trust* ». La juge n'a pas eu à trancher. ==Le standard de *settlor manifestation* pour un donateur historique d'AI lab — emails, podcasts, communiqués, code de conduite affiché — reste indéterminé en jurisprudence.==

2. **Le *self-dealing* d'un *director* de PBC** sous *Cal. Corp. Code §5233*. Le grief 2 reposait largement sur cette doctrine ; il est tombé en prescription sans que la juge ait à mesurer si la *recap* d'octobre 2025 constituait une *interested transaction*. ==La portée exacte de §5233 dans une conversion non-profit → PBC où les fiduciaires d'origine prennent une *equity stake* reste, en droit californien, un trou noir doctrinal.==

3. **Le *safe harbor Casey v. U.S. Bank*** étendu aux *frontier lab partnerships*. La juge n'a pas eu à trancher si le partenariat 100 Md$+ Microsoft-OpenAI relève du *safe harbor* commercial ou du *substantial assistance* en *aiding and abetting*.

4. ***Liu v. SEC*** appliqué au *charitable trust* civil. La question — peut-on transposer la doctrine SEC en *charitable trust* civil ? — reste ouverte pour le prochain procès.

5. **Le plafond *parens patriae*** AG vs *special interest standing* sous *Cal. Corp. Code §5142(a)*, §5250 et *Gov. Code §12598*. Bonta n'a jamais déposé d'amicus complémentaire. La juge n'a pas eu à clarifier le périmètre de la *délégation sous réserve* de janvier 2026. ==C'est précisément cette question qui se rouvre par la pétition §12598 EyesOnOpenAI du 22 mai — par voie administrative, pas judiciaire.==

6. **La *constructive knowledge*** d'un donateur historique en *charitable trust*. Le jury *advisory* a appliqué la doctrine en rejetant le *delayed discovery* sur le grief 2, mais ==la juge n'a pas rédigé de *findings of fact and conclusions of law* — donc il n'y a pas de **précédent persuasif** sur le standard de *constructive knowledge* d'un *settlor* historique d'un AI lab==.

> [!WARNING] Le précédent par défaut
> ==Le procès Musk v. Altman, par son silence doctrinal, vient de **prolonger de 5 à 10 ans** la fenêtre dans laquelle un frontier lab peut convertir son non-profit en PBC sans risque jurisprudentiel matériel==. Tout futur plaignant en *charitable trust* contre un frontier lab devra plaider chaque question depuis zéro, avec l'asymétrie de ressources que ça implique (Wachtell + Sullivan & Cromwell + Cravath face à un *plaintiff's bar* spécialisé, ressource asymétrique de 1:50 typique en équité fédérale civile). **Le précédent par défaut n'est pas une victoire de la *scaling efficient* ; c'est une protection structurelle des incumbents quel que soit leur positionnement doctrinal.**

---

## 25.8 Coda du livre — ce que le verdict dit, ce qu'il ne dit pas

Le procès Musk v. Altman a tranché une question juridique précise : la prescription des trois griefs survivants. ==Il n'a pas tranché — par silence doctrinal volontaire ou résultant — la question politique du Ch.24== : qui contrôle la direction de l'IA, et au bénéfice de qui. La distance entre la question juridiquement tranchée et la question publiquement attendue est au cœur de la frustration que beaucoup ressentiront — quel que soit le verdict — devant ce procès. Comme le résumaient les manifestants prévus devant le tribunal d'Oakland : « *quel que soit le gagnant, c'est nous les perdants* »[^afp-france-guyane].

**Trois lectures restent compatibles avec le verdict** :

- **Lecture 1 — *« la mission est intacte »***. Position défendue par Brad Smith à Stanford HAI le 22 mai : « *the partnership is intact, the mission is intact, the verdict reaffirmed both* »[^brad-smith-stanford]. La conversion d'octobre 2025 est ratifiée judiciairement par défaut, la *Foundation Board* indépendante (Bret Taylor, Adam d'Angelo, Larry Summers, Adebayo Ogunlesi, Nicole Seligman, Paul Nakasone) joue le rôle de garde-fou institutionnel, le *secondary* Q3 2026 finance la liquidité des employés post-RSU vested. ==Stable structurellement, mais vulnérable à la première crise opérationnelle qui exposerait l'écart entre la mission affichée et la dynamique commerciale.==

- **Lecture 2 — *« le silence doctrinal est un héritage empoisonné »***. Position développée dans le journal du 20 mai (lecture *jurisprudence négative*). Le procès laisse six doctrines ouvertes, dont chacune peut être rouverte par un futur plaignant — *Musk v. Altman 2.0* en 2027-2028, mais aussi un dossier Anthropic post-FTX (le trustee in bankruptcy de FTX a *standing* résiduel sur les investissements 2022-2023 dans Anthropic), un dossier xAI sur la phase 2023-2024 *« mission accelerator »*, ou un dossier d'un *frontier lab* émergent post-2027 dont les bailleurs initiaux contesteraient une conversion ultérieure. ==Le verdict ne ferme pas le risque jurisprudentiel ; il l'incube en attendant une nouvelle vague contentieuse.==

- **Lecture 3 — *« la régulation s'est déplacée du judiciaire vers le civil »***. Position cristallisée par la pétition §12598 EyesOnOpenAI du 22 mai. Le contentieux fédéral civil n'est plus le levier principal de la régulation des labs frontière — c'est l'administratif californien (Bonta, §12598), la SEC (sur les *secondaries* privés post-litigation), la coalition civile coordonnée (EyesOnOpenAI, Public Citizen, Midas Project). ==Pour le déployeur européen d'agents en 2026, cette lecture est doctrinalement la plus utile : elle indique que la régulation du *contenu politique* des labs frontière passera par les institutions civiles tierces, pas par les tribunaux fédéraux.==

==Les trois lectures ne se contredisent pas — elles s'enchâssent.== Et le fait qu'aucune ne soit, au 27 mai 2026, doctrinalement dominante est, à ma lecture, le résultat structurel le plus important du procès.

> [!QUOTE] *WIRED* à la veille du procès, 26 avril 2026
> *« The Oakland trial is a long-delayed appointment with the responsibility of AI labs when founding ideals collide with commercial scale. »*[^wired-trial-eve]
> L'audience était attendue comme un règlement. ==Elle a livré un déplacement.== L'arbitrage politique du Ch.24 reste à faire — par les régulateurs, par les ONG, par les marchés privés, par les juges d'appel. Ce livre se ferme sur ce constat : la trajectoire reste, en fin mai 2026, ouverte. ==Le livre lui-même, dans sa version texte arrêtée au 28 mai 2026, est une **photographie** de cette indétermination.==

L'Épilogue (à venir, hors périmètre de ce chapitre) reprendra ce silence doctrinal comme **l'un des sept paris à dater 2027-2028** — la probabilité d'une nouvelle vague contentieuse sur les labs frontière en 2027-2028, par un nouvel angle doctrinal et un nouveau périmètre d'acteurs. Trois indices à surveiller : (i) le périmètre du *notice of appeal* Molo-Toberoff (étroit *Aryeh v. Canon* seul, ou élargi attaquant la formation du *trust*) avant le 17 juin 2026 ; (ii) la réponse formelle Bonta à la pétition §12598 entre le 21 juillet et le 20 août 2026 ; (iii) le maintien ou non par Wachtell du *tender closing* secondary à la fenêtre septembre 2026. ==Trois micro-événements qui, dans les six prochains mois, recalibreront la grille de lecture politique de la stack agentique sur les 18-36 mois qui s'ouvrent.==

> [!INFO] Source vivante — `proces-musk-altman/journal.html`
> Le journal quotidien en ligne — tenu depuis le 1ᵉʳ mai 2026 — reste la source vivante pour les évolutions post-27 mai. Ce chapitre fige une lecture stabilisée à la fin de la **semaine 1 post-verdict**. Les semaines 2 à 9 (mi-juillet 2026, première collision calendaire entre la réponse Bonta et le *tender closing*) seront couvertes uniquement par le journal. ==Le seul dossier *veille en temps réel* du livre — assumé comme tel.==

---

## Sources

[^proces-musk-altman-dossier]: Guglielmino, M. *Procès Musk v. Altman : la mission caritative d'OpenAI à l'épreuve du prétoire*. Dossier de veille jour-J publié le 27 avril 2026. Source primaire principale de ce chapitre. Consulté le 27 mai 2026.

[^journal-proces]: Guglielmino, M. *Journal · Procès Musk v. Altman*. Tenu du 1ᵉʳ mai 2026 au 24 mai 2026 (en cours). Entrée par jour, datée en heure de la côte ouest. Consulté le 27 mai 2026.

[^tarantola-engadget]: Andrew Tarantola, « What you need to know as Elon Musk's lawsuit against Sam Altman begins », *Engadget*, 25 avril 2026. [engadget.com](https://www.engadget.com/ai/what-you-need-to-know-as-elon-musks-lawsuit-against-sam-altman-begins-191500726.html). Consulté le 27 mai 2026.

[^openai-evolve]: « Why OpenAI's structure must evolve to advance our mission », OpenAI, 27 décembre 2024. [openai.com](https://openai.com/index/why-our-structure-must-evolve-to-advance-our-mission/). Consulté le 27 mai 2026.

[^openai-elon-for-profit]: « Elon Musk wanted an OpenAI for-profit », OpenAI, communication corporative. [openai.com](https://openai.com/index/elon-musk-wanted-an-openai-for-profit/). Consulté le 27 mai 2026.

[^ringer-deepdive]: Tyler Parker, « A Deep Dive Into the Elon Musk vs. Sam Altman Trial », *The Ringer*, 20 avril 2026. [theringer.com](https://www.theringer.com/2026/04/20/tech/sam-altman-elon-musk-trial-openai-primer). Consulté le 27 mai 2026.

[^opentools-trial-begins]: « Musk v. OpenAI Trial Begins After Fraud Claims Dismissed », *Open Tools*, 26 avril 2026. [opentools.ai](https://opentools.ai/news/musk-openai-trial-begins-after-fraud-claims-dismissed). Consulté le 27 mai 2026.

[^cooper-ap]: Daniel Cooper, « Elon Musk and OpenAI CEO Sam Altman head to court in high-stakes showdown over AI », *Associated Press / Daily Gazette*, 27 avril 2026. [dailygazette.com](https://www.dailygazette.com/leader_herald/ap/business/elon-musk-and-openai-ceo-sam-altman-head-to-court-in-high-stakes-showdown-over/article_5e382441-c7e6-5d02-98ba-dc4b6cf50abb.html). Consulté le 27 mai 2026.

[^techbuzz-diaries]: « OpenAI Lawsuit Exposed: The Private Diaries, Secret Texts, and \$500 Billion Fraud Case Going to Trial », *TechBuzz*, 16 janvier 2026. [techbuzz.ai](https://www.techbuzz.ai/articles/open-ai-lawsuit-exposed-the-private-diaries-secret-texts-and-500-billion-fraud-case-going-to-trial-in-2026). Consulté le 27 mai 2026.

[^microsoft-next-chapter]: « The next chapter of the Microsoft–OpenAI partnership », *Microsoft Official Blog*, 28 octobre 2025. [blogs.microsoft.com](https://blogs.microsoft.com/blog/2025/10/28/the-next-chapter-of-the-microsoft-openai-partnership/). Consulté le 27 mai 2026.

[^dworetzky-allies]: Joe Dworetzky, « Musk v. Altman: How OpenAI's founders went from tech allies to bitter courtroom enemies », *Local News Matters / Bay City News*, 21 avril 2026. [localnewsmatters.org](https://localnewsmatters.org/2026/04/21/musk-v-altman-how-openais-founders-went-from-tech-allies-to-bitter-courtroom-enemies/). Consulté le 27 mai 2026.

[^findlaw-musk-openai]: « MUSK v. OPENAI INC (2025) », *FindLaw*, dossier 4:24-cv-04722. [caselaw.findlaw.com](https://caselaw.findlaw.com/court/us-dis-crt-n-d-cal/117603877.html). Consulté le 27 mai 2026.

[^pymnts-trial-headed]: « Musk's Suit Over OpenAI's for-Profit Switch Headed to Trial », *PYMNTS*, 8 janvier 2026. [pymnts.com](https://www.pymnts.com/legal/2026/musks-suit-over-openais-for-profit-switch-headed-to-trial). Consulté le 27 mai 2026.

[^dworetzky-trial-date]: Joe Dworetzky, « Musk v. Altman: Trial date looms as judge hands wins and setbacks to both sides », *Local News Matters / Bay City News*, 23 avril 2026. [localnewsmatters.org](https://localnewsmatters.org/2026/04/23/musk-v-altman-trial-date-looms-as-judge-hands-wins-and-setbacks-to-both-sides/). Consulté le 27 mai 2026.

[^fortune-fraud-drop]: « Musk drops fraud claims against OpenAI, Altman ahead of trial », *Fortune* (via Bloomberg), 25 avril 2026. [fortune.com](https://fortune.com/2026/04/25/elon-musk-fraud-claims-openai-sam-altman-trial/). Consulté le 27 mai 2026.

[^afp-fraud-drop]: « Judge drops Musk's fraud claims, trial to focus on nonprofit dispute », *AFP / MSN*, 26 avril 2026. [msn.com](https://www.msn.com/en-us/news/other/judge-drops-musks-fraud-claims-in-openai-lawsuit/gm-GM412A26DB). Consulté le 27 mai 2026.

[^takagi-trust-doctrine]: Gene Takagi, « Charitable Trust Doctrine », *Nonprofit Law Blog*, 15 octobre 2005 (mise à jour 3 décembre 2020). [nonprofitlawblog.com](https://nonprofitlawblog.com/charitable_trus/). Consulté le 27 mai 2026.

[^dworetzky-shakeup]: Joe Dworetzky, « Musk v. Altman: Inside the OpenAI shake-up that set the stage for next courtroom clash », *Local News Matters / Bay City News*, 22 avril 2026. [localnewsmatters.org](https://localnewsmatters.org/2026/04/22/musk-v-altman-inside-the-openai-shake-up-that-set-the-stage-for-next-courtroom-clash/). Consulté le 27 mai 2026.

[^journal-2026-05-20]: Guglielmino, M. *Journal — entrée du 20 mai 2026 : la jurisprudence négative*. Six doctrines ouvertes après le verdict, effet de précédent par défaut, cas Anthropic et xAI comme bénéficiaires structurels du silence. Consulté le 27 mai 2026.

[^reuters-verdict]: « Musk-OpenAI jury finds claims filed too late on prescription », *Reuters*, 18 mai 2026. [reuters.com](https://www.reuters.com/legal/litigation/musk-openai-jury-finds-filed-too-late-prescription-2026-05-18/). Consulté le 27 mai 2026.

[^techcrunch-directed-verdict]: « Musk v. Altman: Judge enters directed verdict for defendants on prescription », *TechCrunch*, 18 mai 2026. [techcrunch.com](https://techcrunch.com/2026/05/18/musk-v-altman-judge-enters-directed-verdict-for-defendants-prescription/). Consulté le 27 mai 2026.

[^law360-remedies-mooted]: « OpenAI Victory: Prescription Moots Musk-Altman Remedies », *Law360*, 19 mai 2026. [law360.com](https://www.law360.com/articles/1782291/openai-victory-prescription-musk-altman-remedies-mooted). Consulté le 27 mai 2026.

[^bitcoinworld-pool]: « Musk-OpenAI Jury Prescription: Dudney as Key Witness — Pool Briefing Synthesis », *Bitcoinworld* (via *TechCrunch* pool), 19 mai 2026. [bitcoinworld.co.in](https://bitcoinworld.co.in/musk-openai-jury-prescription-dudney-2026-05-19/). Consulté le 27 mai 2026.

[^politico-appeal-9th]: « Musk-OpenAI trial: Molo announces 9th Circuit appeal on prescription », *Politico Tech*, 19 mai 2026. [politico.com](https://www.politico.com/news/2026/05/19/musk-openai-trial-appeal-ninth-circuit-prescription-00345219). Consulté le 27 mai 2026.

[^journal-2026-05-19]: Guglielmino, M. *Journal — entrée du 19 mai 2026 : « Filed too late » — le verrou Dudney a tenu*. Reconstruction du lundi 18 mai, séquence 14h05-14h27-14h35 PT, post-trial pool briefing. Consulté le 27 mai 2026.

[^journal-2026-05-22]: Guglielmino, M. *Journal — entrée du 22 mai 2026 : le pivot civique*. Dépôt de la pétition §12598 EyesOnOpenAI au *Registrar of Charitable Trusts*, mécanique 60-90 jours, collision calendaire avec le tender closing. Consulté le 27 mai 2026.

[^the-information-secondary]: « OpenAI secondary term sheet circulated to Wachtell/Morgan Stanley/Goldman six hours after verdict », *The Information*, 21 mai 2026. [theinformation.com](https://www.theinformation.com/articles/openai-secondary-term-sheet-wachtell-morgan-stanley-goldman-q3-2026). Voir aussi *Bloomberg* et *Reuters* mêmes faits, mêmes sources triangulées. Consulté le 27 mai 2026.

[^journal-2026-05-24]: Guglielmino, M. *Journal — entrée du 24 mai 2026 : bilan hebdomadaire post-verdict (semaine 1), le partage des arènes*. Convergence éditoriale NYT/FT/WSJ, lectures Stratechery et Platformer, trois arènes parallèles. Consulté le 27 mai 2026.

[^brad-smith-stanford]: « Brad Smith at Stanford HAI: Post-Verdict Partnership Statement », *The Information*, 22 mai 2026. [theinformation.com](https://www.theinformation.com/articles/brad-smith-stanford-hai-post-verdict-partnership-may-2026). Consulté le 27 mai 2026.

[^afp-france-guyane]: AFP / *France-Guyane*, « Genèse d'OpenAI : le duel judiciaire Musk-Altman s'ouvre en Californie », 27 avril 2026. [franceguyane.fr](https://www.franceguyane.fr/actualite/international/genese-dopenai-le-duel-judiciaire-musk-altman-souvre-en-californie-1077172.php). Consulté le 27 mai 2026.

[^wired-trial-eve]: *WIRED*, citation rapportée par *Open Tools* à la veille du procès, 26 avril 2026. Consulté le 27 mai 2026.
