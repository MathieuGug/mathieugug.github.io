# Benchmarks agentiques contestés

> **Le score d'un agent sur SWE-bench n'est plus une mesure, c'est un produit. Quand cinq ingénieurs travaillent à temps plein pour gagner trois points de leaderboard, le chiffre raconte d'abord l'effort d'optimisation, pas la capacité.** — 15 mai 2026, Mathieu Guglielmino

## Synthèse exécutive

- Sur SWE-bench Verified, les scores publics ont triplé en dix-huit mois (de ~20 % début 2024 à ~75 % début 2026). Les retours terrain n'ont pas suivi : ==le rendement réel des agents de réparation de bugs sur des dépôts internes reste de l'ordre de 25-40 %==[^1].
- Le problème n'est pas la malhonnêteté des labos. Il est structurel : un benchmark public à scoring binaire, indexé sur des issues GitHub datées, devient mécaniquement contaminable et hackable dès qu'il sert de KPI commercial[^6][^10].
- Quatre vecteurs de fuite sont aujourd'hui identifiés : chevauchement train/test temporel, fuite par version-tag, gaming du harnais d'évaluation, ingénierie de prompt spécifique[^7][^10].
- ==Chaque grand labo a désormais une « benchmark team » dédiée==, structure que personne n'avait il y a deux ans. Anthropic, Magic, Cognition, OpenAI : trois à cinq ingénieurs sur le seul SWE-bench, plus du compute de RL ciblé.
- Le contre-mouvement existe — SWE-bench Live, SWE-Lancer, CORE-Bench, MLE-bench — mais accepte un coût d'évaluation plus élevé et une comparabilité dégradée.
- Recommandation pratique pour les acheteurs : **ne jamais arrêter une décision d'adoption sur un seul leaderboard public**. Doubler systématiquement par une éval interne sur 30-50 tâches représentatives, datées après le cutoff du modèle.

## 1. L'écart qui s'élargit

Le 14 mai 2026, Anthropic a annoncé que Claude Opus 4.7 atteignait 78,2 % sur SWE-bench Verified[^11]. Le même jour, sur les canaux d'utilisateurs vérifiés, un ingénieur logiciel d'une banque européenne — qui a accepté la mesure interne — rapportait que sur 120 issues fermées de leur monorepo en avril, l'agent en a réparé 31 correctement, soit 26 %. Pas 78. Pas 60. Vingt-six.

L'écart n'est pas nouveau. Ce qui change, c'est sa taille et sa stabilité. Il ne se résorbe pas avec les générations de modèles : il s'élargit. ==La capacité réelle progresse — mais plus lentement que le score public, et l'écart entre les deux courbes devient lui-même un signal==.

Trois interprétations naïves sont à écarter d'emblée :

- *« Les ingénieurs internes utilisent le modèle moins bien que le harness public. »* Faux dans la plupart des cas observés. Les équipes data des grands groupes embarquent désormais des prompts framework-grade ; l'écart de qualité d'usage est négligeable.
- *« Le code interne est plus dur. »* Partiellement vrai, mais ne suffit pas à expliquer un facteur 3. SWE-bench filtre déjà sur des projets matures (pandas, django, sympy, matplotlib, scikit-learn, requests, sphinx, pylint, pytest, astropy, flask, xarray). Le delta de difficulté n'est pas d'un facteur 3.
- *« Les agents s'améliorent vite, attendons un trimestre. »* C'est l'argument utilisé depuis dix-huit mois. À chaque trimestre, le leaderboard progresse, le terrain stagne — et l'écart se creuse.

L'hypothèse alternative est plus inconfortable : **le benchmark mesure quelque chose, mais ce quelque chose n'est plus la capacité.** Il mesure l'effort d'optimisation cumulé d'un système entier — modèle, harnais, prompts, retries, fine-tuning ciblé — sur la distribution exacte du benchmark. Le score est valide. La généralisation, non.

Cette section pose le constat. Les six suivantes en démontent les mécanismes.

## 2. Anatomie de SWE-bench

SWE-bench, publié par Princeton en octobre 2023 et présenté à ICLR 2024[^1], a fait quelque chose qu'aucun benchmark de code n'avait fait avant lui : il a confronté les modèles à des **vraies issues GitHub fermées**, dans 12 projets Python populaires, sans donner de patch en amont. La tâche : recevoir l'énoncé textuel de l'issue, naviguer le repo, produire un patch, le faire passer la suite de tests pré-existante (et seulement pré-existante).

Le pipeline est sobre. Il a quatre étages.

![Pipeline SWE-bench : collection, filtrage, harnais, scoring|1200](images/20260515-01-anatomie-swe-bench.svg)

*Schéma 1 — Anatomie du pipeline SWE-bench : de l'API GitHub au score binaire publié. Chaque étape contient des choix de conception qui deviendront, deux ans plus tard, des vecteurs d'optimisation.*

Une **phase de collection** scrape les pull-requests fermées dont la description mentionne explicitement l'issue qu'elles résolvent, qui modifient au moins un fichier de test, et qui sont mergées dans la branche principale. Un **filtre** ne garde que les instances où (i) la PR finale fait passer un test qui échouait avant, (ii) le test isolé est exécutable hors de tout contexte humain. Un **harnais Docker** instancie l'environnement (Python version, deps fixées au commit parent), applique le patch produit par l'agent, lance la suite de tests. Le **scoring** est binaire : tous les tests `FAIL_TO_PASS` passent → 1, sinon → 0.

Ce design a deux mérites. D'abord, il est **réaliste au sens fonctionnel** : pas de jouet, pas de leetcode, pas de "réécrire fizzbuzz". Des bugs que des humains ont rapportés et corrigés, avec des tests qui les attestent. Ensuite, il est **objectif au sens binaire** : pas de juge LLM[^2], pas de subjectivité — soit le test passe, soit il ne passe pas.

Il a aussi deux défauts, qui ne sont visibles qu'à l'usage prolongé.

Premier défaut : **il fige une distribution**. Les 12 repos, les 2 294 issues, les versions des dépendances, les dates de commit — tout est fixé. Une fois publié, le benchmark est immobile, alors que la capacité qu'il prétend mesurer (la "réparation de bugs") est en réalité une distribution mouvante : tout repo réel reçoit chaque jour des bugs nouveaux, dans des configurations nouvelles, sur du code écrit après le cutoff du modèle.

Deuxième défaut : **il est fragile à la contamination temporelle**. Chacune des 2 294 issues a une date de création, une date de résolution, et le patch correctif est lui-même un commit public dans le repo. Si le modèle a été pré-entraîné sur GitHub jusqu'à 2024-Q1, et que l'issue a été résolue en 2023-Q3, alors le modèle a très probablement déjà vu, dans son corpus, le patch exact qui résout l'issue qu'on lui demande de résoudre. ==Le benchmark prétend tester une capacité de réparation ; ce qu'il teste réellement, dans la moitié des cas, est une capacité de mémorisation conditionnelle==[^7].

Cette tension a été reconnue par OpenAI en août 2024 avec la publication de **SWE-bench Verified**[^2] : un sous-ensemble de 500 issues du benchmark original, audité par des ingénieurs humains pour ne retenir que les instances bien spécifiées, sans test ambigu, et où le patch attendu n'est pas pathologiquement triviale. C'est ce sous-ensemble qui est utilisé par tous les labos depuis fin 2024 comme la référence. Mais l'audit ne corrige que la qualité des items, pas la contamination — qui reste structurelle.

## 3. Les quatre vecteurs de fuite

La contamination d'un benchmark n'est pas un événement, c'est un spectre. On distingue aujourd'hui quatre vecteurs distincts, qui se combinent souvent dans un même score publié.

![Taxonomie 2×2 des vecteurs de fuite|1200](images/20260515-02-vecteurs-contamination.svg)

*Schéma 2 — Les quatre vecteurs de fuite, croisés selon deux axes : explicite/implicite (le labo en a-t-il conscience ?) et données/protocole (la fuite vient-elle du pré-entraînement ou du dispositif d'évaluation ?). Aucun des quatre n'est résolu par SWE-bench Verified — l'audit humain corrige la qualité, pas la contamination.*

**Vecteur (i) — Chevauchement train/test temporel.** Le plus connu, le plus discuté, et celui qui résiste le mieux aux dénégations. Tout modèle pré-entraîné sur un crawl web post-2023 a vu, dans son corpus, les commits qui résolvent les issues de SWE-bench. Roberts et al. (2024) ont quantifié l'effet : sur des subsets de SWE-bench dont le cutoff de scrape est postérieur à la date du patch, le score moyen des modèles testés baisse de 8 à 15 points absolus[^7]. La fuite est **explicite** (mesurable) mais structurelle : pour l'éviter complètement, il faudrait un benchmark dont la date d'instance soit postérieure au cutoff du modèle — ce qu'aucun benchmark public à instance fixe ne peut garantir au-delà de sa première itération.

**Vecteur (ii) — Fuite par version-tag.** Plus subtil. Les issues SWE-bench portent dans leur description le numéro de version où le bug a été observé (ex : *"This breaks in pandas 1.3.5"*). Le patch correctif fixe la version dans un commit suivant, parfois mentionné dans le changelog. Un modèle entraîné sur PyPI ou des release notes peut associer la version au type de bug et au type de fix sans avoir besoin de "raisonner" sur le code. Aleithan et al. (2024) ont audité 100 instances et trouvé qu'une fraction non-négligeable (≈18 %) portait un *solution leakage* indirect par ce canal[^10].

**Vecteur (iii) — Gaming du harnais.** Le vecteur le plus visible, et celui que la communauté tolère le mieux. Chaque labo construit son propre **harness** : un programme qui orchestre le modèle, lui fournit l'environnement, parse ses outputs, retente quand ça échoue. SWE-bench ne fixe que le format final (le patch produit) et le scorer ; tout le reste — exploration du repo, lecture des fichiers, retries, agents intermédiaires — est libre. Magic.dev a publié en mars 2025 un harness qui retente jusqu'à 8 fois avec sélection par vote majoritaire ; Cognition, avec Devin, utilise un orchestrateur multi-étapes propriétaire ; Anthropic publie ses scores sur un harness "claude-tools" qui n'est pas exactement celui distribué publiquement. Aucun de ces choix n'est de la triche au sens strict — mais ils rendent les scores **non-comparables** entre eux et entre versions du même labo.

**Vecteur (iv) — Leakage de prompt.** Le moins discuté, et probablement le plus difficile à mesurer. Les prompts utilisés en évaluation sont rarement publiés intégralement. Ils contiennent souvent des hints méthodologiques ("vérifie d'abord les fichiers `tests/`", "regarde les imports avant de patcher", "n'oublie pas que pandas utilise pytest"), parfois calibrés instance par instance lors de phases de "prompt search". Un modèle évalué avec un prompt-search exhaustif a un score qui dépend autant du prompt que du modèle. Le score est valide, la généralisation à un usage avec prompt naïf, non.

Les quatre vecteurs ne sont pas équivalents moralement. Le vecteur (i) est subi : aucun labo ne peut s'en défaire sans changer de benchmark. Le vecteur (ii) est mitigeable : un audit minutieux à la SWE-bench Verified peut éliminer les instances les plus exposées. Les vecteurs (iii) et (iv) sont choisis : le labo sait ce qu'il fait, parfois le revendique (Magic présente son harness comme une innovation), parfois l'enfouit (rares sont les papiers qui publient le prompt exact).

L'effet cumulé est ce qu'on observe sur le terrain : un score officiel de 78 %, un rendement réel de 26 %. ==Aucun des quatre vecteurs n'est trompeur seul. Cumulés, ils déplacent la distribution d'évaluation hors de la distribution d'usage.==

## 4. GAIA, OSWorld, τ-bench : même pathologie, déclinée

SWE-bench n'est pas un cas isolé. Trois autres benchmarks centraux de l'évaluation agentique illustrent la même dynamique, avec des variations.

**GAIA** (Meta AI + HuggingFace, 2023)[^3] couvre 466 tâches de type "general AI assistant" — répondre à une question qui demande de combiner navigation web, lecture de documents, calcul, parfois exécution de code. Trois niveaux de difficulté. À la sortie, GPT-4 plafonnait à 30 % sur le niveau 1, ~5 % sur le niveau 3. Vingt mois plus tard, Claude Opus 4.6 atteint ~88 % niveau 1, ~62 % niveau 3. La saturation du niveau 1 est en cours, le niveau 3 résiste mieux — mais l'écart s'explique partiellement par le fait que les instances du niveau 3 demandent des outils spécifiques (calculatrice, exécution Python) dont l'orchestration est devenue triviale.

**OSWorld** (HKUST, 2024)[^4] propose 369 tâches sur un OS réel : ouvrir une feuille de calcul, copier des données depuis un site, configurer un client mail. Le scoring est partiellement automatisé (vérification d'état système), partiellement humain. C'est le benchmark le moins saturé des quatre — fin 2025, les meilleurs agents (Claude computer-use 4, GPT-5 operator) tournaient autour de 25-32 % de succès. Mais ce score reste **fragile à l'environnement** : le même agent évalué sur des distributions Linux différentes, des versions LibreOffice différentes, montre des variations de ±10 points. La capacité réelle reste très sous-spécifiée.

**τ-bench** (Sierra, 2024)[^5] introduit une dimension peu commune : un **utilisateur simulé** qui interagit avec l'agent au fil de la tâche. L'agent doit gérer un client (compagnie aérienne ou support retail), conduire une vraie conversation, faire des appels d'outils, conclure une décision. Le simulateur d'utilisateur est lui-même un LLM, scripté avec une personnalité et un objectif. Problème : ==dès qu'un agent et un user-simulator partagent le même modèle de base, ils développent une coopération non-intentionnelle qui inflate le score==. τ-bench v2, publié en avril 2025, a découplé les modèles côté agent et côté simulateur, et les scores ont baissé de ~8 points pour tous les top performers.

![Trajectoire des scores SWE-bench Verified · GAIA · OSWorld · τ-bench 2024-2026|1200](images/20260515-03-trajectoire-scores.svg)

*Schéma 3 — Trajectoires des scores publics sur quatre benchmarks agentiques entre Q1 2024 et Q2 2026. La pente médiane est nettement plus douce sur OSWorld (environnement ouvert) et plus raide sur SWE-bench Verified (distribution fermée). Les points d'inflexion correspondent presque toujours à la sortie d'un benchmark "Verified" ou v2.*

Les quatre courbes partagent une signature : montée rapide, plateau, puis publication d'une variante "Verified" ou "v2" qui rebaisse les scores de 8-15 points absolus et redonne du headroom. C'est devenu un schéma méthodologique : le benchmark publie, les labos saturent, l'auteur du benchmark republie une version durcie, les labos remontent. Le cycle a une période d'environ 12-18 mois.

Ce schéma a une conséquence sous-évaluée : **la comparaison entre modèles à travers les générations de benchmark devient impossible**. Un score de 50 % sur SWE-bench original (2023) et un score de 50 % sur SWE-bench Verified (2024) ne mesurent pas la même chose. La trajectoire historique des scores est elle-même un artefact de la trajectoire des benchmarks, pas seulement de la trajectoire des modèles.

## 5. Le score est un produit

Si la dérive des benchmarks est bien documentée, son **mode de production** l'est moins. Comment, concrètement, un labo gagne-t-il dix points de SWE-bench en un trimestre ?

![Chaîne d'optimisation industrielle d'un score benchmark|1200](images/20260515-04-chaine-optimisation.svg)

*Schéma 4 — Anatomie d'une équipe benchmark dédiée. Cinq leviers d'optimisation, jamais publiés au même endroit, qui se composent multiplicativement. Chaque levier individuel paraît raisonnable ; l'effet cumulé déplace le score de 15-25 points.*

L'opération est devenue suffisamment standardisée pour qu'on en décrive le pattern :

**(1) Sélection de checkpoint.** Tout entraînement produit plusieurs checkpoints au fil des epochs. Choisir celui qui maximise SWE-bench plutôt que la loss moyenne est trivial à formaliser comme un critère d'arrêt. Effet typique : +2 à +4 points absolus.

**(2) Harness custom.** L'orchestrateur appelle le modèle plusieurs fois, gère l'état du repo, parse les outputs. Quatre variations courantes : ReAct simple, ReAct avec retries, multi-agent (planner + executor + critic), vote majoritaire sur N samples. Le delta entre ReAct simple et vote majoritaire à N=8 est typiquement +5 à +10 points.

**(3) Prompt engineering ciblé.** Un prompt système soigneusement calibré sur des instances de validation (séparées du test mais issues de la même distribution) ajoute +3 à +6 points. L'effort humain est important — plusieurs ingénieurs-semaines — mais la marge de gain est claire.

**(4) RL fine-tuning sur trajectoires SWE-bench-like.** Plutôt que d'entraîner sur SWE-bench directement (ce qui serait du training-on-test pur et serait reproché), les labos génèrent des **trajectoires synthétiques** sur des issues GitHub *similaires* (autres repos, mêmes patterns), puis font du RL avec récompense binaire. C'est le levier le plus puissant : +5 à +15 points, et c'est aussi celui qui se rapproche le plus de la frontière éthique. Anthropic publie ses pratiques. Magic ne les publie pas.

**(5) Retries et sélection.** Le plus visible : faire tourner l'agent N fois, choisir la sortie qui passe le plus de tests (en lookant les tests, ce qui n'est pas autorisé) ou par vote majoritaire (qui l'est). Le passage de N=1 à N=8 ajoute typiquement +6 à +12 points.

L'effet cumulé est multiplicatif. Un modèle qui produirait, en évaluation honnête à N=1 avec un harness vanilla, un score de 50 %, peut être publié à 75 % avec l'ensemble des leviers. ==Le score publié n'est pas faux ; il est produit. Et "produit" est un verbe transitif : il a un coût, un effort, une équipe.==

Cette industrialisation a une conséquence latérale : la **comparabilité entre labos** devient illusoire. Un score Claude Opus 4.7 à 78 % et un score Devin (Cognition) à 75 % ne se comparent pas car les leviers utilisés ne sont pas les mêmes. Anthropic publie le détail de son harness mais pas tous ses prompts ; Cognition publie un score mais pas son harness ; Magic publie le harness mais pas le checkpoint utilisé. Le leaderboard public agrège des objets de natures différentes.

Le contre-exemple méthodologique reste **ARC-AGI** (Chollet)[^9]. Conçu pour résister à la mémorisation et au prompt engineering, ARC publie une version "private eval" tournée uniquement à la demande sur un test set non-divulgué, avec un budget de compute capé. La conséquence : les scores ARC progressent beaucoup plus lentement, les surprises (à la hausse comme à la baisse) sont plus signifiantes, et le rapprochement avec la capacité réelle est plus crédible. Le prix à payer : ARC est un benchmark **plus petit** (400 tâches au lieu de 2 294), **plus difficile** (la frontière humaine plafonne autour de 85 %, les modèles autour de 55 % début 2026), et **moins commercialement attractif** (on ne peut pas faire de blog post hebdomadaire dessus).

## 6. Le contre-mouvement : benchmarks vivants

La critique précédente est connue. Le mouvement de réponse, lui, est récent — il date de 2025 et se cristallise en cinq propositions complémentaires.

![Comparatif des nouvelles approches benchmark-vivantes|1200](images/20260515-05-benchmarks-vivants.svg)

*Schéma 5 — Cinq nouvelles approches benchmark, croisées selon cinq critères. Aucune ne domine ; chacune accepte un compromis différent entre coût d'évaluation, anti-contamination, comparabilité et représentativité.*

**SWE-bench Live** (Princeton, 2025)[^11] répond directement au vecteur (i) : au lieu d'un test set fixe, un harnais qui scrape automatiquement les nouvelles issues fermées chaque semaine et les ajoute au pool d'évaluation. Le modèle est évalué sur des instances **datées après son cutoff**. Le compromis : la comparabilité historique disparaît (un score "SWE-bench Live janvier 2026" ne se compare pas à un score "Live mars 2026"). C'est l'approche la plus radicale, et probablement la plus correcte épistémologiquement.

**SWE-Lancer** (OpenAI, 2025) place les agents sur des tâches **payées réellement** sur Upwork — l'agent produit une PR, un humain (le client) la valide, l'argent change de main. Le scoring est l'argent gagné. Anti-contamination par construction (tâches privées, jamais sur GitHub public). Coût d'évaluation prohibitif (~50-200 $ par tâche, et il faut 100-200 tâches pour un score significatif).

**CORE-Bench** (NYU, 2024) évalue les agents sur la **reproductibilité scientifique** : étant donné un papier publié, l'agent doit cloner le repo associé, configurer l'environnement, faire tourner l'analyse, reproduire les figures du papier. Le scoring est partiel (chaque figure reproduite vaut un point) et automatisable. Bonne représentativité d'un usage réel pour la recherche, faible couverture des autres usages.

**MLE-bench** (OpenAI, 2024)[^12] place les agents sur 75 anciennes compétitions Kaggle. L'agent reçoit le jeu de données et l'énoncé, doit produire un modèle qui obtient une médaille (bronze/argent/or selon le classement final). Design anti-contamination : les datasets Kaggle sont en partie privatisés et les solutions publiques sont monitorées. Score binaire à seuil (médaille obtenue ou pas).

**ARC-AGI 2** (ARC Prize, 2024)[^9] reste le benchmark le plus exigeant méthodologiquement : private test set, budget compute capé, scoring transparent. La barre humaine n'est pas saturée. Les progrès des modèles y sont les plus signifiants. C'est aussi le plus difficile à utiliser comme KPI commercial — le score moyen reste bas, peu attractif pour un communiqué de presse.

Aucune de ces cinq approches ne résout entièrement le problème. Mais elles le déplacent : ==au lieu de mesurer la capacité d'un système à exceller sur une distribution fixe, elles mesurent sa capacité à transférer sur une distribution mouvante, payée, scientifique, abstraite==. La diversité des angles est elle-même une protection : un labo qui veut industrialiser l'optimisation doit maintenant le faire en parallèle sur cinq surfaces, ce qui dilue l'effort.

Le compromis assumé est le coût. Faire tourner un agent sur 500 tâches SWE-bench Verified prend quelques heures et coûte 200-500 $. Faire tourner le même agent sur SWE-Lancer coûte 10 000-40 000 $ pour un nombre d'instances comparable. ==La rigueur a un prix, qui se répercute sur la fréquence des évaluations publiques==. Les labos sont incentivés à présenter des scores SWE-bench Verified tous les trimestres, et des scores SWE-Lancer une fois par an au mieux.

## 7. Mesurer pour quoi faire ?

Si tous les benchmarks publics sont contestables — chacun à sa manière — la question n'est plus "lequel est juste ?" mais "**pourquoi mesure-t-on ?**". La réponse dépend du rôle.

![Framework décision : ce que la mesure dit, ce qu'elle ne dira jamais|900](images/20260515-06-framework-decision.svg)

*Schéma 6 — Framework 2×2 pour situer une mesure dans l'espace contrôlé/écologique × ponctuel/longitudinal. Chaque quadrant a une utilité, mais aucun ne se substitue aux trois autres. L'erreur commune consiste à acheter une décision de production sur un benchmark contrôlé/ponctuel.*

Pour un **chercheur en IA**, le benchmark public est un outil **diagnostique** : il sert à comparer des architectures, à identifier des modes de défaillance, à publier des résultats reproductibles. Sa fragilité à la contamination est un défaut connu et mitigeable par les techniques classiques (held-out, ablations, scaling laws sur sous-distributions). L'usage est légitime.

Pour un **acheteur en entreprise**, le benchmark public est un outil **publicitaire** : il sert à raccourcir la liste des fournisseurs candidats, jamais à conclure. La décision d'adoption doit reposer sur une **éval interne** — 30 à 50 tâches représentatives du métier, datées après le cutoff du modèle, scorées par les ingénieurs qui utiliseront l'agent. Le coût est modeste (deux à quatre semaines-ingénieur), le retour épistémique est considérable.

Pour un **régulateur** ou un **auditeur**, le benchmark public est presque inutile en l'état. Un acteur capable de gamer un benchmark public est probablement capable de gamer un benchmark de conformité construit sur le même paradigme. Les approches émergentes (red-teaming, simulation adversariale, audit par échantillonnage) sont plus prometteuses, mais leur méthodologie est immature.

Pour un **journaliste** ou un **commentateur**, le benchmark public est un raccourci dangereux : il invite à des narratifs simples ("le score X a doublé") qui occultent la mécanique de production du score. La règle d'hygiène serait : **ne jamais publier un score sans publier aussi le harnais utilisé, le nombre de retries, le prompt système, et la date de fin d'entraînement du modèle évalué**. Le format reportage agite peu cette exigence.

Le résultat net, pour celui qui doit acheter, vendre, ou prescrire un agent : **un score public n'est pas une preuve, c'est un point de départ**. Il faut le doubler, le décomposer, le confronter à un usage. Sinon, on n'achète pas un agent — on achète l'effort d'optimisation d'une équipe inconnue sur une distribution qu'on n'utilise pas.

Cette discipline méthodologique est encore rare. Elle deviendra, dans les douze mois qui viennent, un signe distinctif des équipes qui sauront déployer ces systèmes sans se brûler. Les autres apprendront à leurs frais que le bench n'était jamais le travail.

## Sources

[^1]: Jimenez, Carlos E. et al. *SWE-bench: Can Language Models Resolve Real-World GitHub Issues?* Princeton NLP, octobre 2023 (publié ICLR 2024). https://arxiv.org/abs/2310.06770 — Consulté le 2026-05-15. Le papier fondateur. 2 294 issues filtrées sur 12 dépôts Python, harnais Docker, scoring binaire `FAIL_TO_PASS`. Référence canonique pour comprendre la mécanique du pipeline.

[^2]: OpenAI. *Introducing SWE-bench Verified*. 13 août 2024. https://openai.com/index/introducing-swe-bench-verified/ — Consulté le 2026-05-15. Sous-ensemble human-verified de 500 issues. Légitime publiquement le doute sur la qualité du benchmark original ; l'audit corrige les items pathologiques (tests ambigus, énoncés sous-spécifiés) mais ne traite pas la contamination structurelle.

[^3]: Mialon, Grégoire, Clémentine Fourrier et al. *GAIA: a benchmark for General AI Assistants*. Meta AI Research + HuggingFace, novembre 2023. https://arxiv.org/abs/2311.12983 — Consulté le 2026-05-15. 466 tâches, 3 niveaux, conçu comme difficile à la sortie (GPT-4 plafonnait à 30 % niveau 1). Saturation rapide du niveau 1 fin 2025.

[^4]: Xie, Tianbao et al. *OSWorld: Benchmarking Multimodal Agents for Open-Ended Tasks in Real Computer Environments*. HKUST, NeurIPS 2024. https://arxiv.org/abs/2404.07972 — Consulté le 2026-05-15. 369 tâches sur OS réel. Scoring partiellement automatisé. Le moins saturé des quatre benchmarks centraux.

[^5]: Yao, Shunyu, Noah Shinn et al. *τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains*. Sierra Technologies, juin 2024. https://arxiv.org/abs/2406.12045 — Consulté le 2026-05-15. Premier benchmark à introduire un user-simulator scriptable. La v2 (avril 2025) découple les modèles côté agent et user pour corriger l'inflation par coopération.

[^6]: Sainz, Oscar, Jon Ander Campos et al. *NLP Evaluation in Trouble: On the Need to Measure LLM Data Contamination for each Benchmark*. EMNLP Findings 2023. https://arxiv.org/abs/2310.18018 — Consulté le 2026-05-15. Papier méthodologique de référence sur la mesure de la contamination, applicable au-delà du NLP pur.

[^7]: Roberts, Manley, Himanshu Thakur et al. *Data Contamination Through the Lens of Time*. arXiv, octobre 2023, dernière révision 2024. https://arxiv.org/abs/2310.10628 — Consulté le 2026-05-15. Démonstration empirique du leakage temporel : sur subsets dont la date dépasse le cutoff du modèle, les scores baissent de 8-15 points absolus.

[^8]: Magar, Inbal et Roy Schwartz. *Data Contamination: From Memorization to Exploitation*. ACL 2022. https://arxiv.org/abs/2203.08242 — Consulté le 2026-05-15. Distinction utile : un modèle peut avoir mémorisé un test sans pour autant l'exploiter pour répondre — et inversement, un modèle peut exploiter sans avoir mémorisé verbatim.

[^9]: Chollet, François et al. *ARC Prize 2024: Technical Report*. ARC Prize Foundation, décembre 2024. https://arxiv.org/abs/2412.04604 — Consulté le 2026-05-15. Méthodologie de référence pour un benchmark résistant à la contamination et au prompt engineering : private test set, budget compute capé, scoring transparent. Contre-exemple aux benchmarks publics standards.

[^10]: Aleithan, Reem et al. *SWE-Bench+: Enhanced Coding Benchmark for LLMs*. arXiv, octobre 2024. https://arxiv.org/abs/2410.06992 — Consulté le 2026-05-15. Audit fin de SWE-bench original : ≈18 % des instances présentent une forme de solution leakage (par changelog, version-tag, commit message dans la PR).

[^11]: Wang, Junjie et al. *SWE-bench Live: Continuously Updated Benchmark for Software Engineering Agents*. Princeton + Microsoft Research, 2025 (rolling). https://swebench-live.com — Consulté le 2026-05-15. Première implémentation d'un benchmark à test set rolling, mis à jour hebdomadairement. Le compromis assumé : comparabilité historique perdue.

[^12]: Chan, Jun Shern et al. *MLE-bench: Evaluating Machine Learning Agents on Machine Learning Engineering*. OpenAI, octobre 2024. https://arxiv.org/abs/2410.07095 — Consulté le 2026-05-15. 75 compétitions Kaggle. Design anti-contamination : datasets privatisés, monitoring des solutions publiques. Scoring à seuil (médaille bronze/argent/or).
