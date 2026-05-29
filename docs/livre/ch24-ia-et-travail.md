# Chapitre 24 — Société : IA et travail

> **Acte IV — Mesures et garde-fous · Chapitre standard, ~22 pages**
> _Trois chiffres ont structuré la conversation mondiale sur l'IA et le travail depuis 2013. **47 %** d'emplois américains à haut risque d'automatisation (Frey & Osborne). **300 millions** d'équivalents temps plein exposés sur dix ans (Goldman Sachs). **0,55 %** de productivité totale des facteurs sur dix ans (Acemoglu). Ils ne se contredisent pas frontalement — ils ne se comparent pas. Chacun mesure une chose différente, sous des conventions méthodologiques distinctes, dans des cadres théoriques qui ne tranchent pas la même question. L'écart entre 300 millions d'ETP et 0,55 % de PTF n'est pas un débat technique d'économètres : c'est un choix politique sur la **direction** que la technologie prendra. Ce chapitre cartographie la littérature qui sépare le récit médiatique du débat scientifique, démonte les frameworks d'estimation, convoque la pause d'Engels comme analogie historique load-bearing, et formalise les **quatre scénarios à 2035** et les **six leviers anti-catastrophe** que la stratégie publique peut actionner — ou pas. Le Ch.21 a mesuré le ROI agent par agent ; le Ch.23 a posé les obligations légales ; ce chapitre prend la question à l'étage au-dessus : qui produit, qui en bénéficie, et combien de temps reste-t-il aux institutions pour décider._

> [!QUESTION] Question d'ouverture
> Entre les pronostics de catastrophe — Goldman Sachs : 300 millions d'équivalents temps plein exposés à l'automatisation — et les estimations modestes — Acemoglu : 0,55 % de productivité totale des facteurs sur dix ans — la littérature économique sur l'IA et le travail paraît irréconciliable. Elle ne l'est pas. ==Quel cadre méthodologique choisir pour estimer l'impact emploi, et qu'est-ce que la « pause d'Engels » d'Allen 2009 suggère du calendrier de redistribution dans une économie où les gains de productivité ne se diffusent pas mécaniquement aux salaires médians ?==

> [!TLDR] TL;DR décideur
> - ==Les chiffres médiatiques sur l'IA et le travail **ne se comparent pas entre eux**.== Goldman additionne des *expositions à l'automatisation* (300M ETP). Acemoglu calcule l'*impact macroéconomique net après adoption profitable* (0,55 % de PTF). Frey-Osborne 2013 compte des *professions entières* (47 %) ; l'OCDE Arntz et al. 2016 refait par tâche et tombe à **9 %**. La même technologie, deux unités de mesure, un facteur cinq d'écart.
> - **L'IA générative est probablement une *general-purpose technology*** au sens de Bresnahan-Trajtenberg 1995, comparable à l'électricité et aux TIC. Trois critères convergents (pervasivité, amélioration intrinsèque, complémentarités innovationnelles). Un palier historique : électricité commerciale 1880, gain de productivité manufacturière américain visible vers 1920 — **trente à quarante ans**. La littérature converge sur **5 à 15 ans** pour l'IA.
> - **Le risque dominant n'est pas le chômage de masse, mais une nouvelle pause d'Engels.** Période 1790-1840 en Grande-Bretagne : la productivité monte, les salaires réels stagnent, la part du capital explose. Acemoglu-Johnson, Korinek-Stiglitz : ce scénario reste techniquement plausible, économiquement non-fatal, ==politiquement explosif==.
> - **Les études empiriques convergent sur un point structurant** : l'IA *comprime les écarts par le bas* plutôt qu'elle ne *détruit par le haut*. Brynjolfsson-Li-Raymond 2023 : +14 % de productivité moyenne, +34 % pour les novices, 0 % pour les seniors. Peng et al. 2023 (Copilot) : −56 % de temps de complétion, gain concentré sur les développeurs juniors. Noy-Zhang 2023 : substitution à l'effort, court-circuit de la phase d'apprentissage des juniors.
> - **Quatre scénarios à 2035** sur deux axes (vitesse × distribution) : (A) productivité partagée, (B) pause d'Engels 2.0, (C) plateau capacitaire, (D) rupture agentique. Aucun n'est inéluctable — tous dépendent de choix politiques, fiscaux, institutionnels que les sociétés peuvent encore faire.
> - **Six leviers anti-catastrophe** documentés par la littérature : redirection technologique, formation continue, sécurisation des transitions, partage des gains (fiscalité + négociation collective + revenu universel), gouvernance des modèles, revitalisation territoriale. Aucun ne suffit seul — leur combinaison définit le scénario réalisé.
> - **Cas français — adoption lente, dialogue social structuré, fracture territoriale.** 10 % des entreprises FR utilisaient au moins une techno IA en 2024 (INSEE) vs ~40 % aux US (Census). 35,5 % des postes français exposés. Rapport Aghion-Bouverot 2024 (logique schumpetérienne) vs France Stratégie / Benhamou 2025 (sécuriser les personnes plutôt que protéger les emplois) : pas un désaccord, deux temporalités complémentaires.
> - ==Le débat public confond systématiquement exposition, automatisation potentielle, automatisation réelle et déplacement effectif.== Parler en fourchettes liées aux hypothèses plutôt qu'en chiffre choc est une discipline d'hygiène intellectuelle — et un prérequis pour qu'une politique publique mature soit possible.

---

## 24.1 Place du chapitre — du ROI agent-par-agent au choix politique de société

L'Acte IV a déroulé les **mesures et garde-fous** dans l'ordre où une organisation les rencontre — Ch.17-18 pour évaluer et observer, Ch.19-20 pour cadrer et déployer, Ch.21 pour mesurer le ROI, Ch.22 pour la facture énergétique, Ch.23 pour la conformité réglementaire. Les chapitres précédents traitaient les agents *à l'intérieur* d'une organisation — comment les évaluer, les opérer, les sécuriser, les amortir. Le Ch.24 ouvre les fenêtres : ==que produit-on, qui le fait, qui en bénéficie — et combien de temps reste-t-il aux institutions pour orienter la trajectoire avant que le palier soit franchi ?==

Trois raisons justifient un chapitre dédié à cette question sociétale dans un livre qui se voulait, pour l'essentiel, technique.

**Première raison** : la trajectoire technique décrite dans les Actes I-III a une **conséquence sociétale qui n'est plus marginale**. Le Ch.5 a montré que l'inférence est devenue une ressource industrielle dont la courbe LLMflation crée un nouveau régime de coût ; le Ch.7 a montré que la boucle agentique pilote désormais des tâches qu'aucun LLM en chat ne savait toucher en 2022 ; le Ch.15 a montré que `computer use` enlève la dernière frontière (la souris et le clavier). Cumulés, ces trois résultats déplacent la frontière entre tâches *exposées* et tâches *automatisables* à un rythme que les frameworks économiques de 2023 — calibrés sur les LLM en chat — peinent à intégrer. Un livre qui traite la stack agentique sans poser la question du travail laisse un angle mort.

**Deuxième raison** : le ROI agent-par-agent du Ch.21 et l'externalité énergétique du Ch.22 sont des **composants partiels** d'une équation politique plus large. Un agent peut être très rentable en hard savings (sortie 2026 typique : −30 à −50 % de coût opérationnel sur un cas standard) sans que ses gains se redistribuent au-delà de l'organisation qui le déploie. La littérature économique appelle ce phénomène la **dissociation des gains de productivité et des salaires médians** ; le Ch.24 montre qu'elle n'est pas un accident de marché mais le résultat d'un rapport de force.

**Troisième raison** : sans cette mise en perspective, le Ch.25 — *Politique : procès Musk v. Altman* — perd la moitié de son sens. Le Ch.25 décrit le contentieux juridique qui cristallise *qui contrôle la direction de l'IA*. Sans le Ch.24 qui pose les enjeux de cette direction, le Ch.25 se réduit à une querelle de cofondateurs. Avec lui, il devient le test contentieux d'une question politique — qui décide ce que l'IA doit faire, et au bénéfice de qui.

> [!INFO] Voir Ch. 5 — Économie inférence · Ch. 21 — ROI agent · Ch. 22 — IA frugale · Ch. 23 — Gouvernance · Ch. 25 — Procès Musk v. Altman
> Le Ch.5 a posé le coût unitaire de l'inférence ; le Ch.21 a mesuré ce que vaut un agent pour qui le déploie ; le Ch.22 a chiffré l'externalité énergétique ; le Ch.23 a posé les obligations légales. Le Ch.24 fait un saut d'échelle : il pose la question macroéconomique et politique de la trajectoire. Le Ch.25 le prolonge en regardant comment le contentieux juridique cristallise les positions doctrinales — *safety hard*, *scaling efficient*, *governance-as-service*. ==Pris ensemble, Ch.24 et Ch.25 forment le contrefort sociétal du livre== — sans eux, l'analyse technique reste cohérente mais socialement incomplète.

---

## 24.2 Le malentendu fondamental — pourquoi les chiffres ne se comparent pas

![Frise des six estimations les plus citées de l'impact de l'IA sur le travail|1300](../../ia-et-travail/images/20260504-01-frise-estimations.svg)

Le schéma dispose les **six estimations les plus citées** sur dix ans, ramenées à leur unité de mesure réelle. Frey-Osborne 2013 : 47 % de professions américaines à haut risque (granularité profession). Arntz et al. OCDE 2016 : 9 % en moyenne OCDE (granularité tâche). McKinsey 2023 : 2,6-4,4 T$ de valeur ajoutée annuelle (impact macroéconomique). Goldman Sachs Briggs-Kodnani 2023 : 300 M ETP exposés (comptabilité heures-équivalent). Eloundou et al. 2023-2024 : 80 % de la main-d'œuvre américaine avec ≥10 % de tâches affectées E1 (exposition partielle). Acemoglu 2024 : 0,55 % de PTF sur dix ans (Hulten macroéconomique). ==Aucune n'est directement comparable== à une autre — chacune mesure une chose différente, sous des conventions méthodologiques distinctes, dans un cadre théorique qui ne tranche pas la même question.

### 24.2.1 Ce que mesure réellement Goldman Sachs

Le 26 mars 2023, six mois après la sortie publique de ChatGPT, Goldman Sachs publie une note de Joseph Briggs et Devesh Kodnani estimant que **l'équivalent de 300 millions d'emplois temps plein** pourraient être exposés à l'automatisation par l'IA générative[^briggs-kodnani]. Le chiffre n'est pas un nombre d'emplois détruits. C'est l'**équivalent en heures de travail** de tâches susceptibles d'être affectées — substituées ou augmentées — par l'IA, calculé en additionnant pour chaque profession sa proportion de tâches automatisables pondérée par les effectifs. Briggs et Kodnani estiment que **deux tiers des emplois actuels sont exposés à un degré quelconque**, et que l'IA pourrait automatiser environ **25 % du temps de travail** total aux États-Unis et en Europe. Leur scénario central : **6 à 7 % des travailleurs déplacés** sur dix ans — taux historiquement élevé mais pas hors normes (la transition agricole-industrie a déplacé bien davantage, sur plusieurs décennies).

### 24.2.2 Ce que mesure Acemoglu

À l'autre extrême, Daron Acemoglu publie en 2024 *The Simple Macroeconomics of AI*[^acemoglu-2024]. Il applique le **théorème de Hulten** — l'effet macroéconomique d'un changement technologique est égal à la somme pondérée des effets sur les tâches affectées — avec des hypothèses prudentes : environ **20 % des tâches aux États-Unis sont exposées à l'IA**, dont **23 % seulement seront profitablement automatisées** dans les dix ans, avec une **économie de coût moyenne par tâche de 27 %**. Le calcul donne **0,71 % de gain de PTF sur dix ans**, ramené à **0,55 %** quand on tient compte du fait que les premiers gains viennent de tâches faciles et que les tâches restantes seront plus dures à automatiser. En PIB : **1,1 à 1,6 %** cumulé sur dix ans, soit **environ 0,05 % par an**.

Goldman Sachs et Acemoglu ne se contredisent pas frontalement. Le premier additionne des **expositions à l'automatisation** ; le second calcule l'**impact macroéconomique net après adoption profitable**. ==Le premier dit *ce que la technologie pourrait faire*, le second dit *ce qu'elle fera vraiment compte tenu des coûts d'adoption et de la lenteur de réorganisation*==. Cette distinction structure tout le débat.

### 24.2.3 Trois confusions structurantes

Avant d'aller plus loin, trois distinctions doivent être posées comme axiomes de lecture pour tout chiffre rencontré sur l'IA et le travail :

1. **Emploi vs tâche.** Un emploi est composé de dizaines de tâches. Frey-Osborne 2013 classait l'emploi entier dès lors qu'une majorité de ses tâches étaient automatisables — d'où le chiffre dramatique de **47 %**[^frey-osborne]. En 2016, l'OCDE refait le calcul en regardant les tâches individuellement : le chiffre tombe à **9 % en moyenne dans les pays OCDE**[^arntz]. ==La même technologie, deux unités de mesure, un facteur cinq d'écart.==

2. **Exposition vs déplacement.** *Exposition* signifie qu'une tâche pourrait techniquement être réalisée par l'IA. *Déplacement* signifie qu'un travailleur perd son emploi parce que l'IA la réalise effectivement. Entre les deux : le coût d'adoption, l'inertie organisationnelle, les contraintes réglementaires, les préférences des consommateurs, et — surtout — le fait que des gains de productivité sur certaines tâches augmentent souvent la demande pour les autres tâches du même métier (l'effet productivité d'Acemoglu-Restrepo[^acemoglu-restrepo]).

3. **Automation vs augmentation.** L'*Anthropic Economic Index*, qui analyse depuis 2025 les conversations réelles avec Claude, mesure cette distinction empiriquement. En février 2026, **52 % des conversations relèvent de l'augmentation** (l'utilisateur apprend, itère, demande un retour) contre **45 % d'automatisation** (l'IA fait la tâche à la place)[^aei-jan2026]. La frontière n'est pas figée — la part d'automatisation a crû de 27 % à 39 % en un an[^aei-sep2025] — mais le récit du « remplacement pur » ne décrit qu'une fraction du phénomène.

> [!IMPORTANT] Hygiène de lecture
> ==Aucun chiffre cité dans la presse sur l'IA et le travail n'a de sens sans son framework.== « 47 % des emplois sont menacés » est faux dès qu'on précise les hypothèses de Frey-Osborne ; « 0,55 % de productivité sur dix ans » est correct sous des hypothèses très conservatrices ; « 80 % des tâches affectées » est compatible avec Goldman Sachs comme avec Acemoglu, mais ne dit rien du déplacement net. Avant toute citation chiffrée, deux questions à se poser : **(1) quelle est l'unité de mesure ? (emploi, tâche, heure-équivalent, point de PTF, dollar)** et **(2) quel est l'horizon ?**. Sans ces deux clés, la conversation se réduit à un échange de chiffres incommensurables.

---

## 24.3 L'IA comme *general-purpose technology* — ce que l'histoire prédit

![Triptyque GPT — les trois critères de Bresnahan-Trajtenberg 1995 mappés sur quatre cas historiques|1300](../../ia-et-travail/images/20260504-02-triptyque-gpt.svg)

Le schéma dispose les **trois critères** de Bresnahan-Trajtenberg 1995 (pervasivité, amélioration intrinsèque, complémentarités innovationnelles) sur quatre cas historiques (machine à vapeur, électricité, TIC, IA générative). Les quatre cochent les trois cases ; pour l'IA, le verdict de la littérature économique mainstream est convergent — Eloundou et al. 2023 affirment explicitement que « l'attribut collectif des LLM tels que les *generative pretrained transformers* suggère fortement qu'ils possèdent les caractéristiques clés des autres GPT »[^eloundou]. Acemoglu lui-même, malgré ses estimations conservatrices, ne conteste pas la classification : il conteste le *timing* et l'*ampleur* des gains.

### 24.3.1 Ce que ce cadre prédit — trois enseignements load-bearing

**1. Un long délai entre invention et productivité agrégée.** Paul David, dans *The Dynamo and the Computer* (1990), montre que l'électricité — inventée commercialement dans les années 1880 — ne contribue significativement à la productivité manufacturière américaine que dans les **années 1920**, soit **trente à quarante ans plus tard**[^david-1990]. La raison : les usines doivent abandonner le système de transmission par arbres et courroies (qui exigeait une source de puissance unique au centre) pour adopter le « moteur unitaire » — un moteur électrique par machine. Ce changement architectural a pris une génération. Le *Solow paradox* — « on voit l'âge de l'ordinateur partout sauf dans les statistiques de productivité » — décrit le même phénomène appliqué à l'informatique des années 1970-1990[^solow].

**2. Une explosion de la productivité après le palier.** Une fois le palier franchi, les gains s'enchaînent rapidement : pour l'électricité, **la moitié de la croissance de la productivité manufacturière américaine des années 1920** lui est attribuable[^david-1990]. Le pari implicite des prévisions optimistes (McKinsey, Goldman Sachs, Aghion-Bouverot) : l'IA suivra cette trajectoire — avec un palier plus court, parce que la diffusion logicielle est plus rapide que la diffusion d'infrastructure physique.

**3. Une transformation profonde des structures organisationnelles.** Bresnahan et Trajtenberg insistent : la GPT exige une réorganisation. Pour la machine à vapeur, c'est l'usine ; pour l'électricité, la ligne de production ; pour les TIC, la fonction support et le back-office. ==Pour l'IA, ce pourrait être l'organisation cognitive elle-même== — la manière dont les entreprises produisent du raisonnement, de l'analyse, de la décision. Une réorganisation à cette échelle prend, historiquement, une à deux décennies — pas six mois.

### 24.3.2 Ce qui pourrait être différent cette fois

Trois hypothèses circulent sur ce qui pourrait distinguer l'IA des GPT précédentes :

**(a) Vitesse de diffusion.** ChatGPT a atteint cent millions d'utilisateurs en deux mois — record historique pour un produit de consommation. La diffusion logicielle, sans infrastructure physique à déployer, peut être beaucoup plus rapide qu'une révolution électrique. ==Ce qui ne signifie pas que les gains de productivité seront rapides== : la lenteur du palier ne tient pas à la diffusion de l'outil mais à la réorganisation des processus, et cette réorganisation reste, elle, lente.

**(b) Nature cognitive.** Les GPT précédentes augmentaient le travail physique. L'IA générative augmente — et potentiellement automatise — le travail cognitif. McKinsey parle de « *reverse skill bias* » : pour la première fois, ==une technologie d'automatisation a un impact disproportionné sur les emplois à fort capital humain== (cadres, juristes, consultants, journalistes, développeurs)[^mckinsey-2023]. Cette inversion n'est pas neutre politiquement : la coalition socialement bénéficiaire/perdante n'est pas celle des révolutions précédentes — et la classe moyenne cognitive, qui a porté les Trente Glorieuses, devient l'éventuelle perdante.

**(c) Capacité d'auto-amélioration.** Les modèles d'IA participent à leur propre développement (génération de code, RLHF, agents autonomes ; cf. Ch.7 et Ch.15). Si cette boucle se referme — *self-improving AI* — le rythme de progrès pourrait s'accélérer, raccourcissant le palier d'adoption. C'est l'argument central des chercheurs en sécurité de l'IA (Geoffrey Hinton, Yoshua Bengio, Stuart Russell)[^bengio-hinton]. La littérature économique mainstream traite cette hypothèse avec scepticisme ; ==elle n'est plus marginale==, et elle constitue la pierre angulaire du scénario D développé au §24.7.

> [!INFO] Voir Ch. 7 — Boucle agentique · Ch. 15 — Computer use
> Les chapitres 7 et 15 documentent une trajectoire technique tangible : l'IA n'est plus un outil amnésique de réponse en un coup, c'est un système qui pilote des écrans (Ch.15), persiste (Ch.9), capitalise (Ch.10) et orchestre d'autres agents (Ch.11). Cette transformation technique est un ==multiplicateur d'exposition== que les frameworks économiques de 2023 — basés sur les LLM en chat — commencent à peine à intégrer. Pour un économiste qui calibrait son taux d'automatisation en 2023, le fait qu'un agent moderne sache cliquer dans un CRM, lire une feuille Excel, exécuter du code et boucler entre les trois change la base de calcul — pas marginalement, structurellement.

---

## 24.4 Cartographie des frameworks d'estimation — cinq choix méthodologiques

![Anatomie d'un framework d'estimation — six étapes méthodologiques que les estimations combinent différemment|1300](../../ia-et-travail/images/20260504-03-anatomie-framework.svg)

Comment passe-t-on d'« un emploi » à « un impact sur l'emploi » ? Le schéma cartographie les **six étapes méthodologiques** que les frameworks combinent différemment. Les estimations chiffrées de l'impact de l'IA sur le travail dépendent de **cinq choix méthodologiques** que chaque équipe combine différemment. Comprendre ces choix permet de lire les chiffres pour ce qu'ils sont.

### 24.4.1 Étape 1 — la granularité (profession vs tâche)

**Profession entière** (Frey-Osborne 2013 : 47 %) ou **tâches** (Eloundou 2023, Acemoglu 2024) ? La première produit des chiffres dramatiques mais fragiles, parce qu'un emploi rare 100 % automatisé pèse autant qu'un emploi massif partiellement automatisé. La seconde produit des chiffres plus modestes mais plus robustes. Depuis 2018, la littérature a basculé majoritairement sur la granularité-tâche.

### 24.4.2 Étape 2 — la source du jugement

**Experts humains** (Frey-Osborne ont fait étiqueter 70 professions par des chercheurs en machine learning, puis ont extrapolé à 702), **modèle économétrique sur les compétences O\*NET** (la base américaine décrivant ~900 professions par ~200 attributs), ou **LLM lui-même comme évaluateur** (Eloundou et al. ont utilisé GPT-4 pour évaluer la pertinence de 19 000 tâches O\*NET). ==Chaque source a ses biais== : les humains sont influencés par les démonstrations récentes, les modèles statistiques cristallisent les corrélations historiques, le LLM tend à surestimer ses propres capacités sur les tâches qu'il décrit.

### 24.4.3 Étape 3 — la métrique d'exposition

**Substitution complète** (« l'IA peut faire la totalité de cette tâche »), **substitution partielle** (« l'IA peut faire la moitié »), ou **complémentarité** (« l'IA augmente la productivité du travailleur sans la remplacer »). Eloundou distingue trois niveaux : E0 (pas d'impact), E1 (LLM réduit le temps d'au moins 50 % avec accès direct au modèle), E2 (avec logiciels supplémentaires). Résultat : ==80 % de la main-d'œuvre américaine a au moins 10 % de tâches affectées au niveau E1, mais seulement 19 % a 50 % ou plus de tâches affectées==[^eloundou]. La même étude, deux récits possibles selon la statistique mise en avant.

### 24.4.4 Étape 4 — exposition vs complémentarité (le pivot FMI)

Le FMI, dans sa note de discussion *Gen-AI: Artificial Intelligence and the Future of Work* (Cazzaniga, Jaumotte, Pizzinelli et al., janvier 2024)[^fmi-2024], introduit une **pondération par contexte**. Une profession peut être très exposée à l'IA mais avoir **un fort complément humain** (médecin : l'IA aide au diagnostic mais ne remplace pas la consultation), ou exposée avec **faible complément** (secrétariat administratif : l'IA peut produire l'output direct). Le FMI estime que **60 % des emplois dans les économies avancées sont exposés à l'IA**, mais que parmi eux, environ **la moitié sont en complémentarité forte** (gain de productivité sans destruction d'emploi), l'autre moitié en complémentarité faible (risque de substitution).

La complémentarité, ajoute le FMI, est ==fortement corrélée au revenu== : les pays avancés ont une main-d'œuvre plus complémentaire à l'IA, ce qui pourrait creuser les écarts internationaux. Pour les pays émergents, l'exposition tombe à 40 %, et 26 % dans les pays à bas revenus. C'est la **divergence Nord-Sud** que le débat public français évoque rarement et que toute prospective IA et travail à dix ans doit intégrer.

### 24.4.5 Étape 5 — la conversion en impact

C'est l'étape qui sépare le plus radicalement les estimations. Quatre approches :

| Approche | Question posée | Exemple |
|---|---|---|
| **Comptabilité d'exposition** | Combien d'emplois ont une part significative de tâches automatisables ? | Frey-Osborne, Eloundou |
| **Heures-équivalent** | Combien d'heures de travail pourraient être réalisées par l'IA ? | Goldman Sachs (300M ETP) |
| **Macroéconomique (Hulten)** | Quel est l'impact sur la productivité totale des facteurs ? | Acemoglu (0,55 %), McKinsey ($2,6-4,4 T) |
| **Empirique (RCT, expériences)** | Que mesure-t-on quand on déploie l'IA dans un environnement réel ? | Brynjolfsson, Noy-Zhang, Peng |

==Aucune approche ne domine les autres.== La comptabilité d'exposition produit les chiffres les plus impressionnants mais ne dit rien du chemin de la technologie aux résultats économiques. L'approche macroéconomique est rigoureuse mais dépend de petites différences d'hypothèses qui se composent de manière non-linéaire (Acemoglu obtient 0,55 % avec ses paramètres ; en doublant les hypothèses de Brookings, on dépasse 2 %). L'approche empirique mesure du concret, mais sur des situations très spécifiques (un centre d'appel, un panel de rédacteurs) qui généralisent mal.

> [!NOTE] La leçon — parler en fourchettes
> ==La citation chiffrée n'a de sens qu'avec son framework.== La presse populaire et les décideurs gagneraient à parler en **fourchettes liées aux hypothèses** plutôt qu'en *chiffre choc*. Un tableau de bord crédible pour un sponsor IA en 2026 ressemble à : « exposition large (Goldman) : ⅔ des emplois ; exposition narrow et profitable (Acemoglu, 10 ans) : ~5 % ; déplacement net effectivement réalisé (estimation médiane littérature, 10 ans) : 3-7 % ; gain de PTF (10 ans, scénario central) : 0,5-1,5 % ». Trois ordres de grandeur, quatre métriques, une honnêteté épistémologique. C'est moins vendeur qu'un titre — c'est nécessaire à toute décision publique.

---

## 24.5 Ce que les études empiriques mesurent — la compression par le bas

![Augmentation vs automatisation — part des conversations Claude (Anthropic Economic Index)|1300](../../ia-et-travail/images/20260504-04-augmentation-automatisation.svg)

Le schéma dispose, mois par mois sur 2025-2026, la part des conversations Claude en **augmentation** (l'utilisateur apprend, itère, demande un retour) versus **automatisation** (l'IA fait la tâche à la place). En février 2026 : 52 % augmentation, 45 % automatisation, 3 % indéterminé. La part d'automatisation a crû de 27 % à 39 % entre fin 2024 et septembre 2025[^aei-sep2025]. ==La frontière n'est pas figée, mais elle ne bascule pas non plus vers le « remplacement pur »== que beaucoup de prévisions anticipaient en 2023.

À côté des cartographies théoriques, une littérature empirique s'accumule depuis 2023 — études contrôlées en entreprise, expériences randomisées, analyses de logs d'usage. Quatre résultats robustes, et un *caveat* central.

### 24.5.1 Brynjolfsson, Li, Raymond — le centre d'appel (2023)

L'étude la plus citée sur l'impact réel de l'IA générative sur le travail observe **5 179 agents de support client** dans une grande entreprise technologique, utilisant un assistant conversationnel branché sur GPT-4[^brynjolfsson-li-raymond]. Trois résultats :

- **Productivité +14 %** en problèmes résolus par heure, en moyenne sur l'ensemble des agents.
- **Effet hétérogène** : les agents novices et peu qualifiés gagnent **+34 %** de productivité ; les agents les plus expérimentés ne gagnent rien (et parfois sont légèrement freinés par l'outil).
- **Diffusion du savoir tacite** : l'IA propage les pratiques des meilleurs agents aux moins expérimentés, **divisant par deux** le temps que mettent les nouveaux à atteindre la performance d'un agent expérimenté.

Ce résultat — ==compression des écarts par le bas plutôt que destruction par le haut== — est confirmé par d'autres études dans des contextes proches. Il a une conséquence opérationnelle directe pour un manager : la valeur de l'IA est plus forte sur la **rampe de montée en compétence des juniors** que sur la **productivité marginale des seniors**.

### 24.5.2 Noy, Zhang — la rédaction (2023, *Science*)

Étude pré-enregistrée auprès de **444 professionnels diplômés** sur des tâches de rédaction professionnelle (mémos, e-mails, plans marketing)[^noy-zhang]. Le groupe traité (avec accès à ChatGPT) :

- **Temps moyen −40 %**.
- **Qualité jugée par des évaluateurs aveugles +18 %**.
- **Inégalité de productivité réduite** : les rédacteurs faibles bénéficient davantage que les forts.
- **Effet d'apprentissage durable** : deux mois après, les participants exposés sont 1,6 fois plus susceptibles d'utiliser l'outil au travail que le groupe contrôle.

Noy et Zhang notent un point important pour la politique de formation : ==l'IA *substitue à l'effort* plutôt qu'elle ne *complémente la compétence*==. La tâche est restructurée vers la génération d'idées et l'édition, en court-circuitant la phase de premier jet — ce qui pose une question sérieuse pour la formation des juniors, dont la phase de premier jet est précisément la phase d'apprentissage.

### 24.5.3 Peng et al. — le développement logiciel (2023, GitHub Copilot)

Expérience contrôlée auprès de **95 développeurs professionnels** chargés d'implémenter un serveur HTTP en JavaScript[^peng-copilot]. Le groupe avec accès à GitHub Copilot :

- **Temps de complétion −56 %** (71 minutes vs 161 minutes).
- Pas de différence significative sur le taux de complétion (les deux groupes finissent).
- Effet plus fort pour les **développeurs moins expérimentés, plus âgés, et en forte charge cognitive**.

À l'échelle d'un secteur, un gain de 50 % de productivité par développeur déplace l'équilibre marché du travail. L'enquête McKinsey 2025 montre déjà cet effet sur le junior : ==51 % des organisations interrogées par McKinsey rapportent que l'IA générative réduit leur besoin en postes débutants==[^mckinsey-2023]. La question du **vivier de seniors dans dix ans** — sachant que les seniors d'aujourd'hui ont été formés comme juniors d'hier — devient un sujet de politique publique structurel.

### 24.5.4 Anthropic Economic Index — la mesure en continu (2025-2026)

Depuis février 2025, Anthropic publie un index trimestriel basé sur l'analyse de millions de conversations Claude, avec mapping sur la base O\*NET[^aei-jan2026]. Résultats à février 2026 :

- ==52 % des conversations sont en mode augmentation==, 45 % en automatisation, 3 % indéterminé.
- La part d'automatisation a augmenté de **27 % à 39 % entre fin 2024 et septembre 2025**, signe d'une délégation croissante.
- L'usage est **très concentré géographiquement** : aux États-Unis, le top 5 des États concentre 24 % de l'usage par habitant ; à l'international, les 20 premiers pays concentrent 48 % de l'usage par habitant — et cette concentration s'accroît[^aei-mar2026].
- Pour chaque année supplémentaire d'usage de Claude, l'écart d'éducation requis pour comprendre les prompts s'élargit d'environ une année — les utilisateurs apprennent à mieux utiliser l'outil.

### 24.5.5 Le *caveat* central — sélection, nouveauté, équilibre général

Tous ces résultats portent sur des **adoptions précoces, dans des contextes contrôlés, sur des tâches choisies pour s'adapter à l'IA**. La généralisation est délicate pour trois raisons :

1. **Sélection** — les entreprises et tâches étudiées sont celles où le déploiement est faisable. Les résistances organisationnelles (formation, refus syndicaux, contraintes réglementaires, intégration aux systèmes existants) sont sous-représentées.
2. **Effet de nouveauté** — les premiers gains peuvent venir de tâches faciles ; le profil de gain à mesure que l'usage mature est inconnu.
3. **Effets d'équilibre général** — un développeur qui produit deux fois plus de code peut soit doubler le marché, soit le faire à effectifs moitié moindres. La littérature empirique observée ne distingue pas ces deux régimes.

C'est précisément ce que dit Goldman Sachs en mars 2025 : malgré la prolifération massive de l'IA générative, ==aucun effet discernable sur les indicateurs majeurs du marché du travail== au niveau agrégé[^goldman-2025]. Le palier de la GPT, encore une fois. Pour le sponsor IA qui prépare un investissement à trois ans, ce non-signal agrégé est le rappel utile que les gains de productivité mesurés en pilote (Ch.21) ne deviennent une dynamique macro qu'après un délai institutionnel et organisationnel non-compressible.

---

## 24.6 Le précédent historique — la pause d'Engels

![La pause d'Engels — productivité vs salaires réels en Grande-Bretagne, 1770-1900|1300](../../ia-et-travail/images/20260504-05-pause-engels.svg)

Le schéma dispose, sur l'axe temporel **1770-1900** en Grande-Bretagne, la **courbe de productivité** (en hausse continue à partir de 1790) et la **courbe des salaires réels** (stagnante de 1790 à 1840, puis croissante à partir de 1840). Le décalage de cinquante ans entre les deux courbes — c'est ce que Marx et Engels appelaient le « paupérisme » industriel. Données : Allen 2009[^allen-engels]. ==Le scénario que la littérature économique évoque le plus quand elle parle de l'IA et du travail n'est pas celui du chômage de masse. C'est celui de la pause d'Engels.==

### 24.6.1 Le concept

Le concept est dû à l'historien économique Robert C. Allen[^allen-engels]. Entre **1790 et 1840** en Grande-Bretagne, la productivité du travail manufacturier augmente fortement (mécanisation textile, machine à vapeur, organisation en usine). Mais les **salaires réels stagnent** sur la même période, tandis que la part du capital dans le revenu national grimpe massivement. Friedrich Engels, observant Manchester en 1842, décrit dans *La situation de la classe laborieuse en Angleterre* une misère ouvrière qui contraste avec l'enrichissement industriel : ce n'est pas une dépression économique, c'est une distribution déséquilibrée.

Allen, dans une étude statistique publiée en 2009, confirme : pendant cinquante ans, ==les gains de productivité ont été quasi-intégralement captés par les détenteurs de capital==. Les salaires réels britanniques ne reprennent leur croissance qu'après 1840, lorsque l'éducation, la syndicalisation, l'extension du droit de vote et la régulation des conditions de travail (Factory Acts) renversent le rapport de force. ==Le retour à une croissance partagée a pris une génération — et n'a pas été automatique== : il a fallu de l'organisation politique et des conflits sociaux.

### 24.6.2 Pourquoi ce précédent revient dans le débat IA

Trois économistes contemporains parmi les plus influents — Daron Acemoglu, Simon Johnson, et Anton Korinek — ont explicitement convoqué le précédent d'Engels pour décrire le risque IA[^korinek-stiglitz]. Leur argument :

- Une technologie nouvelle peut ==augmenter la productivité agrégée sans augmenter les salaires== ni l'emploi, si elle se déploie dans un contexte où le pouvoir de négociation des travailleurs est faible et où la concentration de marché des producteurs de la technologie est élevée.
- L'IA présente précisément ces deux caractéristiques : **pouvoir de négociation des salariés en déclin** dans la plupart des pays OCDE depuis 1980 (densité syndicale moyenne de 35 % à 16 %), et **concentration extrême** du marché des modèles de fondation (OpenAI, Anthropic, Google, Meta, xAI — cinq acteurs sur 90 %+ du marché des modèles frontière).
- La question n'est pas *si* l'IA produira des gains de productivité, mais ==*qui les captera*==.

L'analogie avec Engels n'est pas mécanique. Trois différences importantes méritent d'être posées :

1. **Vitesse** — la révolution textile s'est étalée sur trois générations. L'IA pourrait franchir son palier en une décennie.
2. **Cible** — la révolution industrielle frappait les ouvriers ; l'IA frappe d'abord les cols blancs, dont le pouvoir politique et économique est différent (et dont la coalition électorale traverse les partis traditionnels).
3. **Élasticité de la demande** — pour la machine à vapeur, la demande mondiale de textile a explosé ; pour l'IA, l'élasticité de la demande pour les services cognitifs est moins claire.

Mais l'enseignement structurel reste : ==les gains de productivité ne se redistribuent pas automatiquement. C'est une conquête institutionnelle==. Le Ch.21, en mesurant le ROI agent par agent, donne le numérateur ; ce chapitre rappelle qu'il n'y a pas de mécanisme automatique qui transforme ce numérateur en bien-être médian.

### 24.6.3 Le palier électrique — pourquoi il faut être patient

Avant d'invoquer une nouvelle pause d'Engels, il faut accepter le second enseignement historique : les bénéfices d'une *general-purpose technology* sont lents à matérialiser. Paul David l'a montré pour l'électricité — moteurs commerciaux dès 1880, gain de productivité significatif vers 1920[^david-1990]. Erik Brynjolfsson l'a documenté pour les TIC — Internet commercial en 1995, gains de productivité visibles dans les statistiques américaines à partir de 2002 environ[^brynjolfsson-rock-syverson].

Pour l'IA, la littérature converge sur un palier de **5 à 15 ans** entre la disponibilité commerciale (ChatGPT, novembre 2022) et la matérialisation dans les statistiques de productivité agrégée. Goldman Sachs estime, dans sa note de mars 2025, que les gains commenceront à apparaître nettement à partir de 2027, avec un pic dans les années 2030[^goldman-2025]. ==C'est compatible avec l'histoire des GPT, et incompatible avec les récits — apocalyptiques ou messianiques — qui voient les effets dans les six mois.==

Le palier est aussi un **risque politique**. Si la productivité agrégée n'augmente pas pendant que les pertes d'emploi se concrétisent localement (centres d'appel, juniors administratifs, certains profils tertiaires), la fenêtre d'adhésion populaire à la technologie peut se refermer. La pause d'Engels n'a pas seulement creusé les inégalités : elle a produit le mouvement chartiste, les révolutions de 1848, et — à plus long terme — le marxisme. Le scénario IA équivalent ne serait pas une révolution armée mais un blocage politique : régulations punitives, défiance généralisée, fragmentation géopolitique. ==C'est précisément ce qu'Acemoglu et Johnson appellent dans *Power and Progress* à anticiper==[^acemoglu-johnson].

> [!QUOTE] Acemoglu & Johnson — *Power and Progress*, 2023
> *« La direction de la technologie n'est pas, comme la direction du vent, une force de la nature au-delà du contrôle humain. »*[^acemoglu-johnson]
> Cette phrase — qui ferme *Power and Progress* — est la plus optimiste de la littérature contemporaine sur l'IA et le travail. Elle est aussi **la plus exigeante** : elle prend acte du fait que la trajectoire n'est pas écrite, et impose donc à chaque acteur — État, entreprise, citoyen — la charge de l'orienter. Le scénario favorable n'est ni mécanique ni utopique : il est conditionnel.

---

## 24.7 Quatre scénarios pour 2035

![Quatre scénarios à dix ans, projetés sur deux axes : vitesse de diffusion × distribution des gains|1300](../../ia-et-travail/images/20260504-07-quatre-scenarios.svg)

Le schéma dispose les **quatre scénarios contrastés** sur deux axes : vitesse de diffusion (lente / rapide) × distribution des gains (concentrée / partagée). Plutôt qu'une prévision unique, la littérature converge vers une logique de scénarios dont la probabilité dépend des choix politiques, économiques et organisationnels des dix prochaines années. ==Aucun n'est inéluctable==.

### 24.7.1 Scénario A — Productivité partagée

Le palier IA se franchit en 7 à 10 ans. La productivité agrégée grimpe de **1 à 2 % par an** dans les économies avancées (Brynjolfsson et al., scénario haut[^brynjolfsson-rock-syverson]). Les gains se partagent entre capital et travail grâce à : (i) un marché du travail tendu maintenu par le départ massif des baby-boomers, (ii) une politique fiscale et sociale qui taxe les rentes IA, (iii) une formation continue massive financée par les gains de productivité. La semaine de quatre jours se généralise dans les secteurs à fort gain ; le revenu médian croît plus vite que sur les vingt années précédentes ; certains métiers disparaissent mais sont compensés par de nouveaux secteurs (santé prédictive, climat, éducation personnalisée).

C'est le scénario implicite des optimistes (McKinsey, Aghion, Brynjolfsson). ==Il suppose trois conditions politiques fortes== : redistribution active, formation continue à grande échelle, et institutions de partage de la valeur. Aucune n'est mécanique.

### 24.7.2 Scénario B — La pause d'Engels 2.0

Le palier IA se franchit en 7 à 10 ans, **mais les gains sont captés par le sommet**. Les revenus du capital augmentent fortement ; les salaires médians stagnent ; la classe moyenne cognitive (juristes, comptables, journalistes, certains profils tech) se polarise — élite augmentée par l'IA d'un côté, prolétariat cognitif partiellement déclassé de l'autre. Les pays qui hébergent les producteurs d'IA (États-Unis essentiellement) creusent l'écart avec les pays utilisateurs (Europe, sauf Royaume-Uni en partie). Le PIB mondial monte ; ==le bien-être médian stagne==.

C'est le scénario qu'Acemoglu et Korinek alertent[^korinek-stiglitz] : techniquement plausible, économiquement non-fatal, ==politiquement explosif==. Les phénomènes contemporains de défiance démocratique (*deaths of despair* documentées par Case et Deaton[^case-deaton], polarisation politique, vote populiste) trouveraient un nouveau combustible.

### 24.7.3 Scénario C — Le plateau

Le palier de la GPT s'avère plus long que prévu : 15-20 ans. Les modèles atteignent un palier capacitaire (limites des données d'entraînement, coûts énergétiques croissants, saturation des cas d'usage faciles). Les gains de productivité restent diffus et lents (Acemoglu, scénario bas : **0,55 % de PTF sur dix ans**). L'IA s'intègre comme outil de support — une « meilleure recherche Google » — sans transformation structurelle.

Pour beaucoup d'organisations, ce scénario est en fait ==le moins déstabilisant== : il laisse le temps d'adapter les institutions, les formations, les contrats sociaux. Mais il est aussi celui où la France et l'Europe restent dépendantes des modèles fondationnels américains, sans bénéfice industriel propre. La désillusion économique vis-à-vis de l'IA, après le bruit médiatique de 2023-2026, pourrait alimenter un rejet politique avant que les gains lents ne se matérialisent.

### 24.7.4 Scénario D — La rupture agentique

Le palier IA se franchit en moins de cinq ans, porté par les **agents autonomes** capables de piloter des écrans (Ch.15), persister (Ch.9), capitaliser. La courbe d'amélioration s'auto-renforce (les agents génèrent du code et des données qui améliorent les modèles). Une fraction significative des emplois cognitifs est automatisée en moins d'une décennie : juniors juridiques, supports administratifs, premiers niveaux de codage, certaines parties du conseil et de l'audit. Les gains de productivité dépassent ==3-4 % par an== en macroéconomie.

C'est le scénario que les chercheurs en sécurité de l'IA (Hinton, Bengio, Russell) tiennent pour plausible[^bengio-hinton]. Il pose deux problèmes simultanés : un **choc de transition extrême** sur le marché du travail (sans précédent depuis la transition agricole-industrie), et la **question de la gouvernance des systèmes autonomes**, traitée au Ch.23 sous l'angle légal et au Ch.25 sous l'angle politique. ==La discussion sur le revenu universel, marginalisée jusque-là, redeviendrait centrale== — non comme utopie progressiste, mais comme nécessité technique.

### 24.7.5 Le point commun aux quatre scénarios

==Aucun de ces scénarios n'est techniquement inéluctable.== Les quatre dépendent de variables politiques, fiscales et institutionnelles que les sociétés peuvent encore choisir. Le scénario A demande une volonté redistributive ; le B est ce qui arrive *par défaut* sans choix politique ; le C suppose une stagnation technique qu'aucun des leaders du secteur n'anticipe ; le D suppose à la fois une percée technique et un effondrement institutionnel face à elle. ==Le rôle de la stratégie publique est moins de *prédire* le scénario que de *préparer les institutions à plusieurs d'entre eux*== — discipline d'option, pas de pari.

---

## 24.8 Six leviers contre la catastrophe

![Six familles d'intervention publique pour orienter l'IA vers une trajectoire socialement bénéfique|1300](../../ia-et-travail/images/20260504-08-six-leviers.svg)

Le schéma dispose les **six leviers** sur une grille à deux dimensions (horizon de mise en œuvre × ampleur d'effet attendu). La littérature économique récente — Acemoglu-Johnson (*Power and Progress*, 2023), Korinek-Stiglitz (2024), Benhamou (France Stratégie 2025), FMI (*Gen-AI*, 2024), OCDE (*Employment Outlook 2025*) — converge sur **ces six leviers** pour orienter la trajectoire IA vers les scénarios A plutôt que B.

### 24.8.1 Levier 1 — Redirection technologique

Acemoglu et Johnson en font la thèse centrale de *Power and Progress*[^acemoglu-johnson] : la direction de la technologie n'est pas une force de la nature, c'est un choix social. Aujourd'hui, les modèles d'IA sont massivement entraînés et déployés pour ==automatiser le travail humain== plutôt que pour ==augmenter la productivité humaine==. Cette orientation est le résultat d'un calcul économique : remplacer un salarié vaut le salaire net ; augmenter sa productivité vaut le gain marginal. Tant que le travail est traité comme un coût plutôt que comme une ressource, l'incitation est à la substitution.

Trois leviers de redirection :

- **Égalisation fiscale** entre l'emploi de salariés et l'utilisation d'algorithmes/équipements. Aujourd'hui, le travail supporte des cotisations sociales et l'impôt sur le revenu ; le capital algorithmique amorti supporte beaucoup moins. Acemoglu propose explicitement d'aligner ces régimes.
- **Financement public de la R&D « complémentaire »** — recherche orientée vers les outils d'IA qui assistent le travailleur sans le remplacer (médicaux d'aide au diagnostic, pédagogiques, productifs). En France, le PEPR IA et France 2030 sont des leviers existants ; leur orientation est aujourd'hui dominante côté capacité, pas côté complémentarité.
- **Préférence dans les marchés publics** pour les systèmes IA qui démontrent une logique de complémentarité.

### 24.8.2 Levier 2 — Formation continue à grande échelle

Toutes les institutions internationales (OCDE, FMI, France Stratégie) convergent : ==la formation continue est le levier le plus large et le plus efficace==[^ocde-2025]. Mais elle est aussi le plus cher et le plus structurellement difficile à activer dans des systèmes éducatifs conçus pour la formation initiale.

Trois composantes nécessaires :

- **Compte de formation universel et portable** (CPF en France, modèle qui inspire d'autres pays). À étendre quantitativement et à débloquer pour des durées plus longues (reconversion).
- **Formation aux outils IA pour 100 % des cadres** sur cinq ans. Pas la culture générale IA, mais la pratique d'usage : prompting, vérification, gouvernance de ses propres usages.
- **Filières de reconversion accélérées** pour les métiers à forte exposition / faible complémentarité (administratif, secrétariat, certains métiers d'analyse). 12-24 mois, financées publiquement, avec engagement de placement.

### 24.8.3 Levier 3 — Sécurisation des transitions professionnelles

C'est le levier français par excellence. Le rapport Benhamou (France Stratégie 2025) y consacre sa troisième recommandation principale[^benhamou]. Le principe : ==plutôt que de protéger les emplois, sécuriser les personnes==.

Outils :

- **Indemnisation de longue durée** pour les reconversions complexes (modèle danois de la flexicurité).
- **Validation des acquis de l'expérience accélérée** pour reconvertir les compétences cognitives transverses (analyse, organisation, relation client).
- **Accompagnement individualisé** par des conseillers dédiés (modèle allemand AVGS, suédois *Trygghetsråd*).

Le coût n'est pas marginal — environ **0,5 à 1 % du PIB** pour une transition à grande échelle —, mais il est inférieur au coût social et politique d'une transition non-sécurisée.

### 24.8.4 Levier 4 — Partage des gains : fiscalité et négociation

C'est le débat le plus politiquement chargé. Trois familles d'instruments :

**(a) Fiscalité du capital algorithmique.** Une étude du MIT en 2022 (Costinot et Werning) a évalué qu'une « taxe modeste sur les robots » (aux alentours de 1-3,7 %) pourrait financer la redistribution sans pénaliser sensiblement l'adoption[^costinot-werning]. La proposition de Benoît Hamon en France (2017) allait dans ce sens, comme la résolution de Mady Delvaux au Parlement européen. Bill Gates a soutenu l'idée publiquement.

**(b) Renforcement de la négociation collective.** L'évidence empirique est solide : ==les gains de productivité se partagent quand les syndicats sont forts== (voir l'historique des Trente Glorieuses). Le déclin syndical OCDE depuis 1980 (de 35 % à 16 % en moyenne) coïncide avec la stagnation des salaires réels médians. Le levier institutionnel n'est pas l'absolutisation des syndicats — c'est la **présence d'un contre-pouvoir crédible** dans la négociation salariale.

**(c) Revenu universel.** Considéré marginal il y a dix ans, redevenu central avec les scénarios D (rupture agentique). L'expérience financée par OpenResearch (la fondation soutenue par Sam Altman) sur **3 000 personnes pendant trois ans** a montré des effets positifs sur la santé mentale et la mobilité professionnelle, sans réduction massive de l'offre de travail[^openresearch-rcrt]. Ce n'est pas un argument décisif, mais c'est une donnée empirique nouvelle qui change le débat.

### 24.8.5 Levier 5 — Gouvernance des modèles

Ce levier est techniquement le plus complexe et politiquement le plus instable. Il concerne la régulation des grands modèles d'IA eux-mêmes : transparence d'entraînement, évaluation préalable, audit, responsabilité. C'est l'objet du **Ch.23** dans ce livre — l'AI Act européen (entré en application graduelle 2024-2026), les *executive orders* américains successifs, et les codes de conduite volontaires.

Le point essentiel pour le débat travail : ==plus la gouvernance est faible, plus le risque de scénarios B et D dominants augmente==. La gouvernance technique et la politique du travail ne sont pas deux questions séparées. ==Une gouvernance forte oriente la R&D vers la complémentarité ; une gouvernance faible laisse les incitations privées orienter la R&D vers la substitution==.

Le Ch.25 — *Politique : procès Musk v. Altman* — pose explicitement la question : à qui appartient le contrôle de la direction de l'IA ? Au-delà de la querelle entre fondateurs d'OpenAI, c'est cette question qui détermine si l'IA s'orientera vers la complémentarité (avec une exigence de bien public) ou vers la maximisation de la rente privée.

### 24.8.6 Levier 6 — Revitalisation territoriale

Le dernier levier est le plus localement efficace mais le moins théorisé. L'IA, comme toutes les GPT précédentes, ==se diffuse de manière géographiquement très inégale== — concentration dans les métropoles, désertification cognitive des territoires intermédiaires. Anne Case et Angus Deaton ont documenté pour les États-Unis l'impact dévastateur de la décompression industrielle de 1990-2015 sur la santé, l'espérance de vie, le tissu social des régions affectées[^case-deaton] — les *deaths of despair*.

Le scénario IA peut reproduire cette dynamique sur les emplois administratifs et tertiaires des villes moyennes françaises : centres d'appel, comptabilité, secrétariat, certaines fonctions juridiques et bancaires. Ces emplois sont la colonne vertébrale économique de ces territoires.

Trois outils de réponse :

- **Politique d'implantation** des centres de calcul et de R&D IA hors des métropoles principales. La France a partiellement ce levier avec son réseau d'écoles d'ingénieurs régionales et ses pôles de compétitivité.
- **Financement de la transformation numérique des PME régionales** — si elles adoptent l'IA, elles peuvent rester concurrentielles sans devoir migrer.
- **Investissement dans les infrastructures cognitives** (santé, éducation) qui sont à la fois résistantes à l'automatisation et essentielles aux territoires.

> [!IMPORTANT] Aucun levier ne suffit seul
> ==Les six leviers sont complémentaires, et leur combinaison définit le scénario qu'une société choisit.== La France a des atouts (système de formation continue, dialogue social, services publics performants) et des handicaps (lenteur d'adoption, fracture territoriale, faiblesse industrielle IA). Les choix faits dans les **trois à cinq prochaines années** détermineront en grande partie le scénario réalisé en 2035. Ne pas choisir, c'est choisir le scénario B par défaut.

---

## 24.9 Le cas français — adoption lente, dialogue social structuré, fracture territoriale

![Familles professionnelles françaises classées par exposition à l'IA et complémentarité|1300](../../ia-et-travail/images/20260504-06-carte-metiers.svg)

Le schéma dispose les **familles professionnelles françaises** (nomenclature DARES, 228 familles) sur deux axes : exposition à l'IA × complémentarité humaine. Données : croisement DARES *Familles professionnelles 2021* × INSEE *Enquête Emploi Continu 2024* × cadre Pizzinelli/FMI 2024. ==35,5 % des postes français sont fortement exposés== à l'automatisation par l'IA (score d'exposition ≥ 7/10). Les plus exposés (8/10 ou plus) : gestion administrative, comptabilité, secrétariat, informatique, finance, journalisme. Les moins exposés : artisanat, services à la personne, bâtiment, agriculture, restauration.

Le débat français sur l'IA et l'emploi s'est structuré autour de deux pôles institutionnels :

### 24.9.1 La position d'Aghion-Bouverot — croissance d'abord

Le rapport remis au Président de la République le 13 mars 2024 affirme un parti pris ==résolument optimiste==[^aghion-bouverot] :

- L'IA pourrait augmenter la productivité globale de **40 % d'ici 2035**, tout en modifiant ou supprimant environ 40 % des emplois actuels.
- L'enjeu n'est pas de « préserver l'emploi tel qu'il est », mais de **gagner la course de l'IA pour ne pas dépendre des modèles étrangers**.
- Recommandation centrale : un **fonds France & IA de 10 Md€**, un investissement public annuel de 5 Md€ sur cinq ans, formation massive, allègement des contraintes réglementaires sur l'expérimentation.

La logique d'Aghion est schumpetérienne : la destruction créatrice (qu'il a théorisée pendant trente ans) suppose qu'on accepte la destruction. ==Le risque, pour lui, n'est pas que l'IA détruise des emplois ; c'est que la France rate l'IA et reste dépendante des plateformes américaines== — ce qui détruirait *plus* d'emplois à terme, sans contrepartie de productivité.

Cette position a deux faiblesses analytiques. Elle suppose (a) que la France a une chance réaliste de produire des champions IA souverains alors que la concentration des capacités calcul-données est extrêmement défavorable, et (b) que les gains de productivité macro se traduiront automatiquement en bien-être collectif — la pause d'Engels suggère que cette hypothèse est fragile.

### 24.9.2 La position de France Stratégie — transformer plutôt que protéger

Le rapport de Salima Benhamou (avril 2025) prend un angle complémentaire[^benhamou]. Plutôt qu'une estimation chiffrée globale, il étudie en profondeur **trois secteurs** — banque de détail, transport, santé — et conclut :

- L'IA va ==transformer profondément les métiers== plus qu'elle ne va les supprimer.
- Pour le transport, **800 000 conducteurs français** sont concernés à terme par les véhicules autonomes — mais la transition sera graduelle et exige une stratégie de reconversion proactive.
- Trois recommandations : **prospective au niveau des branches**, **formation différenciée** (producteurs hautement qualifiés vs utilisateurs informés), **sécurisation des transitions professionnelles** dans les secteurs exposés.

Le rapport insiste sur un risque souvent sous-estimé : ==la dégradation des conditions de travail liée à un déploiement IA mal calibré== — perte d'autonomie, intensification, surveillance. Ce risque n'apparaît pas dans les chiffres d'emploi, mais il pèse sur la santé au travail et sur l'engagement.

### 24.9.3 Données INSEE/DARES — l'adoption ralentie

Ce qui distingue spécifiquement la France :

1. **Adoption plus lente** que les États-Unis. L'INSEE rapporte qu'en 2024, ==10 % des entreprises françaises de 10 salariés ou plus== utilisent au moins une technologie d'IA[^insee-2025], contre ==~40 % aux États-Unis== (Census Bureau Business Trends and Outlook Survey, 2024). Ce facteur 4 d'écart d'adoption n'est pas un retard culturel : c'est un retard structurel (taille moyenne d'entreprise plus petite, taux d'investissement en logiciel inférieur, cadre réglementaire AI Act plus exigeant qui ralentit le déploiement).
2. **Dialogue social structuré**. Les transitions IA y sont par défaut négociées au niveau de la branche, ce qui peut ralentir mais aussi mieux distribuer les gains. Le rapport Benhamou insiste sur ce point.
3. **Concentration géographique de l'usage**. Comme aux États-Unis, l'IA est plus utilisée en Île-de-France, dans les métropoles, dans les grandes entreprises et dans certains secteurs (finance, conseil, tech). ==Le risque de fracture territoriale est explicite==.

### 24.9.4 La synthèse française

Ni Aghion ni Benhamou ne sont en désaccord radical. La différence de ton — *go for growth* vs *steer the transition* — masque un consensus sur les fondamentaux : l'IA va transformer le travail français, l'effet net sur l'emploi dépend des politiques mises en place, et ==le statu quo n'est pas une option== (pour Aghion parce que la concurrence internationale impose le mouvement ; pour Benhamou parce que la transition mal accompagnée crée des dégâts sociaux).

Ce que le débat français pourrait gagner à intégrer plus clairement : **les six leviers concrets de redistribution des gains** du §24.8, sur lesquels l'économie politique (Acemoglu-Johnson, Korinek) a beaucoup à dire et que la conversation française médiatique aborde peu.

---

## 24.10 Récap chapitre — trois propositions load-bearing

L'argument que ce chapitre a déroulé tient en trois propositions :

1. ==L'IA est une general-purpose technology== au sens de Bresnahan-Trajtenberg, comparable à l'électricité ou aux TIC. Sa diffusion sera rapide en termes d'adoption logicielle, lente en termes d'impact macroéconomique. Le palier de productivité sera franchi entre 2027 et 2035, selon les estimations crédibles.

2. ==Les frameworks d'estimation médiatisés ne se comparent pas.== Les chiffres marquants (47 % d'emplois menacés, 300 millions d'ETP, 0,55 % de PTF) reposent sur des conventions différentes et mesurent des choses différentes. Le débat public confond exposition, automatisation potentielle, automatisation réelle et déplacement effectif. La discipline de fourchettes liées aux hypothèses est un prérequis pour toute politique publique mature.

3. ==Le risque dominant n'est pas le chômage de masse, mais une nouvelle pause d'Engels== — une période où la productivité agrégée augmente sans que les salaires suivent, où les gains sont captés par le sommet, où la classe moyenne cognitive se polarise. Ce risque est **politique avant d'être technique**. Il dépend des choix de redistribution, de fiscalité, de formation, de gouvernance — choix que les institutions humaines ont les outils pour faire.

L'erreur des conversations apocalyptique et messianique est la même : traiter le résultat comme imposé par la technologie. ==L'histoire des GPT précédentes le démentit explicitement.== La machine à vapeur a coexisté avec la pause d'Engels britannique (paupérisme) et avec la prospérité partagée des Trente Glorieuses (consommation de masse). L'électricité a permis à la fois la chaîne de montage tayloriste (déqualification ouvrière) et le secteur des services hautement qualifiés. Les TIC ont produit Silicon Valley *et* la désindustrialisation des Rust Belts, simultanément, dans le même pays. Ces résultats divergents ne s'expliquent pas par les technologies, mais par les ==institutions, les coalitions politiques, les choix fiscaux, les rapports de force== qui les ont entourées.

L'IA suivra la même règle. Les chiffres conservateurs d'Acemoglu (0,55 % de PTF) ne sont pas une fatalité ; ses recommandations politiques (taxer le capital algorithmique, financer la R&D complémentaire, renforcer la négociation collective) sont des choix opérationnels. Le scénario favorable (productivité partagée, semaine de quatre jours, déclassement minimisé) ==n'est ni mécanique ni utopique== : il est conditionnel à une combinaison de leviers documentés.

> [!WARNING] Trois pièges classiques (100 % traçables)
> **Citer un chiffre sans son framework** — « 47 % d'emplois menacés » et « 0,55 % de PTF » sont compatibles avec deux récits radicalement différents ; sans le framework, la conversation se réduit à un échange de chiffres incommensurables. **Traiter le scénario A (productivité partagée) comme mécanique** — il suppose trois conditions politiques fortes ; sans elles, le scénario B s'installe par défaut. **Sous-estimer la lenteur du palier** — la décennie 2026-2035 verra des effets locaux concentrés (déclassement de cohortes juniors) avant que les gains agrégés ne se matérialisent ; la fenêtre politique d'adhésion à la technologie se joue dans cet intervalle.

Le Ch.25 prend la suite en regardant **comment cette question politique se cristallise dans un contentieux judiciaire concret** — le procès Musk v. Altman, dont la phase 1 s'est ouverte à Oakland le 27 avril 2026 et dont le verdict du 18 mai 2026 a redistribué le dossier sur trois arènes parallèles. Le procès ne tranche pas la question politique ; il en pose les positions doctrinales en termes juridiquement opposables. ==Le Ch.24 a posé la question (qui contrôle la direction) ; le Ch.25 montre qui tente d'y répondre devant un jury, et avec quelle issue.==

---

## Sources

[^briggs-kodnani]: Briggs, Joseph et Devesh Kodnani. *The Potentially Large Effects of Artificial Intelligence on Economic Growth*. Goldman Sachs Global Economics Analyst, 26 mars 2023. [gspublishing.com](https://www.gspublishing.com/content/research/en/reports/2023/03/27/d64e052b-0f6e-45d7-967b-d7be35fabd16.html). Consulté le 28 mai 2026.

[^acemoglu-2024]: Acemoglu, Daron. *The Simple Macroeconomics of AI*. NBER Working Paper 32487, mai 2024 ; publié dans *Economic Policy*, vol. 40, n° 121, 2025. [nber.org](https://www.nber.org/papers/w32487). Consulté le 28 mai 2026.

[^arntz]: Arntz, Melanie, Terry Gregory et Ulrich Zierahn. *The Risk of Automation for Jobs in OECD Countries: A Comparative Analysis*. OECD Social, Employment and Migration Working Papers, n° 189, 2016. Refait Frey-Osborne par tâches et abaisse l'estimation de 47 % à 9 % en moyenne OCDE. Consulté le 28 mai 2026.

[^frey-osborne]: Frey, Carl Benedikt et Michael A. Osborne. *The Future of Employment: How Susceptible Are Jobs to Computerisation?*. Oxford Martin School Working Paper, septembre 2013 ; publié dans *Technological Forecasting and Social Change*, vol. 114, 2017. [oxfordmartin.ox.ac.uk](https://www.oxfordmartin.ox.ac.uk/publications/the-future-of-employment). Consulté le 28 mai 2026.

[^acemoglu-restrepo]: Acemoglu, Daron et Pascual Restrepo. *Automation and New Tasks: How Technology Displaces and Reinstates Labor*. *Journal of Economic Perspectives*, vol. 33, n° 2, 2019, p. 3-30. Pose la distinction effet de déplacement / effet de productivité / effet de création de tâches nouvelles. Consulté le 28 mai 2026.

[^eloundou]: Eloundou, Tyna, Sam Manning, Pamela Mishkin et Daniel Rock. *GPTs are GPTs: An Early Look at the Labor Market Impact Potential of Large Language Models*. arXiv:2303.10130, mars 2023 ; publié dans *Science*, vol. 384, n° 6702, juin 2024. [arxiv.org/abs/2303.10130](https://arxiv.org/abs/2303.10130). Consulté le 28 mai 2026.

[^fmi-2024]: Cazzaniga, Mauro, Florence Jaumotte, Longji Li, Giovanni Melina, Augusta Panton, Carlo Pizzinelli, Emma J. Rockall et Marina M. Tavares. *Gen-AI: Artificial Intelligence and the Future of Work*. IMF Staff Discussion Note SDN/2024/001, 14 janvier 2024. [imf.org](https://www.imf.org/en/Publications/Staff-Discussion-Notes/Issues/2024/01/14/Gen-AI-Artificial-Intelligence-and-the-Future-of-Work-542379). Consulté le 28 mai 2026.

[^bengio-hinton]: Bengio, Yoshua, Geoffrey Hinton, Andrew Yao, Stuart Russell et al. *Managing extreme AI risks amid rapid progress*. *Science*, vol. 384, n° 6698, mai 2024, p. 842-845. Préprint [arxiv.org/abs/2310.17688](https://arxiv.org/abs/2310.17688). Consulté le 28 mai 2026.

[^aei-jan2026]: Anthropic. *Anthropic Economic Index Report: Economic Primitives*. Janvier 2026. [anthropic.com](https://www.anthropic.com/research/anthropic-economic-index-january-2026-report). Consulté le 28 mai 2026.

[^aei-sep2025]: Anthropic. *Anthropic Economic Index Report: Uneven Geographic and Occupational Adoption*. Septembre 2025. [anthropic.com](https://www.anthropic.com/research/anthropic-economic-index-september-2025-report). Consulté le 28 mai 2026.

[^aei-mar2026]: Anthropic. *Anthropic Economic Index Report: Learning Curves*. Mars 2026. [anthropic.com](https://www.anthropic.com/research/economic-index-march-2026-report). Consulté le 28 mai 2026.

[^david-1990]: David, Paul A. *The Dynamo and the Computer: An Historical Perspective on the Modern Productivity Paradox*. *American Economic Review*, vol. 80, n° 2, mai 1990, p. 355-361.

[^solow]: Solow, Robert. « We'd better watch out ». *New York Times Book Review*, 12 juillet 1987, p. 36. Citation originale du paradoxe de productivité.

[^mckinsey-2023]: McKinsey Global Institute. *Generative AI and the Future of Work in America*. Juillet 2023, mise à jour 2025. [mckinsey.com](https://www.mckinsey.com/mgi/our-research/generative-ai-and-the-future-of-work-in-america/). Consulté le 28 mai 2026.

[^brynjolfsson-li-raymond]: Brynjolfsson, Erik, Danielle Li et Lindsey R. Raymond. *Generative AI at Work*. NBER Working Paper 31161, avril 2023, révisé 2024. [nber.org](https://www.nber.org/papers/w31161). Consulté le 28 mai 2026.

[^noy-zhang]: Noy, Shakked et Whitney Zhang. *Experimental Evidence on the Productivity Effects of Generative Artificial Intelligence*. *Science*, vol. 381, n° 6654, juillet 2023, p. 187-192. Consulté le 28 mai 2026.

[^peng-copilot]: Peng, Sida, Eirini Kalliamvakou, Peter Cihon et Mert Demirer. *The Impact of AI on Developer Productivity: Evidence from GitHub Copilot*. arXiv:2302.06590, février 2023. Consulté le 28 mai 2026.

[^goldman-2025]: Goldman Sachs Research. *AI's Impact on the US Labor Market: An Update*. Mars 2025. Voir aussi *Fortune*, 14 mars 2025. Consulté le 28 mai 2026.

[^allen-engels]: Allen, Robert C. *Engels' Pause: Technical Change, Capital Accumulation, and Inequality in the British Industrial Revolution*. *Explorations in Economic History*, vol. 46, n° 4, 2009, p. 418-435. Consulté le 28 mai 2026.

[^korinek-stiglitz]: Korinek, Anton et Joseph Stiglitz. *Artificial Intelligence, Globalization, and Strategies for Economic Development*. NBER Working Paper 28453, 2021 ; voir aussi Korinek (2024) *Scenarios for the Transition to AGI*. Consulté le 28 mai 2026.

[^acemoglu-johnson]: Acemoglu, Daron et Simon Johnson. *Power and Progress: Our Thousand-Year Struggle Over Technology and Prosperity*. PublicAffairs, 2023. Voir notamment p. 387 et suivantes (chapitre sur la pause d'Engels) et p. 415 (citation finale « not like the wind »). Consulté le 28 mai 2026.

[^brynjolfsson-rock-syverson]: Brynjolfsson, Erik, Daniel Rock et Chad Syverson. *Artificial Intelligence and the Modern Productivity Paradox: A Clash of Expectations and Statistics*. NBER Working Paper 24001, 2017. Pose le cadre du palier IA par analogie avec l'électricité. Voir aussi Brynjolfsson, Erik et Andrew McAfee, *The Second Machine Age*, W. W. Norton, 2014. Consulté le 28 mai 2026.

[^case-deaton]: Case, Anne et Angus Deaton. *Deaths of Despair and the Future of Capitalism*. Princeton University Press, 2020. Voir aussi *Education, Despair and Death*, NBER Working Paper 29241, 2021. Consulté le 28 mai 2026.

[^ocde-2025]: OCDE. *OECD Employment Outlook 2025: Can we get through the demographic crunch?*. OECD Publishing, 2025. Voir aussi OECD AI WG, *Generative AI and the Future of Work Global Dialogue*, janvier 2025. Consulté le 28 mai 2026.

[^benhamou]: Benhamou, Salima et al. *Intelligence artificielle et travail*. Rapport de France Stratégie au ministre du Travail et au secrétaire d'État chargé du Numérique, avril 2025. [strategie-plan.gouv.fr](https://www.strategie-plan.gouv.fr/en/publications/intelligence-artificielle-travail). Consulté le 28 mai 2026.

[^costinot-werning]: Costinot, Arnaud et Iván Werning. *Robots, Trade, and Luddism: A Sufficient Statistic Approach to Optimal Technology Regulation*. *Review of Economic Studies*, vol. 90, n° 5, 2023. Consulté le 28 mai 2026.

[^openresearch-rcrt]: Bartik, Alexander, Elizabeth Rhodes, David Broockman, Patrick Krause, Sarah Miller, Eva Vivalt. *The Employment Effects of a Guaranteed Income: Experimental Evidence from Two U.S. States*. NBER Working Paper 32719, 2024 (étude OpenResearch financée par Sam Altman). Consulté le 28 mai 2026.

[^aghion-bouverot]: Bouverot, Anne et Philippe Aghion (présidents). *IA : notre ambition pour la France*. Rapport de la Commission de l'IA au Président de la République, mars 2024. [info.gouv.fr](https://www.info.gouv.fr/upload/media/content/0001/09/4d3cc456dd2f5b9d79ee75feea63b47f10d75158.pdf). Consulté le 28 mai 2026.

[^insee-2025]: INSEE. *Les technologies de l'information et de la communication dans les entreprises en 2024*. Insee Première n° 2061, 2025. [insee.fr](https://www.insee.fr/fr/statistiques/8604126). Consulté le 28 mai 2026.

[^ia-et-travail-dossier]: Guglielmino, M. *L'IA et le travail — frameworks d'estimation, pause d'Engels, quatre scénarios 2035, six leviers anti-catastrophe*. Dossier publié le 4 mai 2026. Source primaire de ce chapitre. Consulté le 28 mai 2026.
