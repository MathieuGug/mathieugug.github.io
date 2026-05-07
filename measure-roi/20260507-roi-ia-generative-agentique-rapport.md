---
titre: "Mesurer le ROI de l'IA générative et agentique"
sous-titre: "Un terrain miné, cinq axes, et la conviction que la productivité ne suffit plus"
date: 2026-05-07
auteur: Mathieu Guglielmino
---

# Mesurer le ROI de l'IA générative et agentique

> **Thèse** — Le débat sur le ROI de l'IA générative et agentique se joue sur deux malentendus tenaces : on mesure ce qui est facile à compter (les heures économisées) plutôt que ce qui crée de la valeur (la réallocation), et on importe les méthodes IT classiques sur des projets qui n'ont plus la même structure de coûts ni la même temporalité de bénéfices. Ce rapport propose une grille en cinq axes pour cartographier les bénéfices, croise les frameworks 2025-2026 (Cigref, McKinsey, BCG, MIT NANDA, Forrester TEI), et confronte les chiffres aux études empiriques disponibles.
>
> **2026-05-07 · Mathieu Guglielmino**
>
> *Format co-écrit avec l'aide d'une IA.*

---

## 1. Le paradoxe ROI 2026

Quatre chiffres résument la tension. McKinsey estime à **2 600 à 4 400 milliards de dollars** la valeur économique annuelle potentielle de l'IA générative à l'échelle mondiale, sur 63 cas d'usage[^3]. La même étude indique pourtant que **seuls 39 % des organisations** parviennent à relier *un quelconque impact EBIT* à l'IA — et pour la majorité, cet impact reste inférieur à 5 %[^3]. À l'autre bout du spectre, le rapport MIT NANDA *State of AI in Business 2025* avance que ==95 % des pilotes d'IA générative en entreprise n'ont pas démontré d'impact mesurable sur le P&L==[^2], et Gartner annonçait dès juillet 2024 que **30 % des projets seraient abandonnés après PoC** d'ici fin 2025, faute de qualité des données, de gouvernance, ou simplement de business case lisible[^9].

![Le paradoxe ROI 2026|1200](images/20260507-01-paradoxe-roi.svg)

L'écart entre le potentiel et la réalisation n'est donc pas un défaut de technologie. Le rapport BCG *Build for the Future 2025* estime que **5 % d'entreprises sont déjà "future-built"** sur l'IA, **35 % sont en train d'industrialiser**, et **60 % restent en retard** — avec un écart qui se creuse : les leaders affichent un croissance du chiffre d'affaires **1,7×** supérieure et une marge EBIT **1,6×** supérieure aux retardataires[^4]. Le sujet n'est pas "est-ce que ça marche", il est "qu'est-ce qui distingue ceux qui captent la valeur".

Cigref, dans sa note de janvier 2026, formule le diagnostic de manière brutale : ==justifier un projet d'IA générative comme on le ferait pour une migration de serveur est une impasse==[^1]. Les méthodes comptables classiques — payback en 18 mois, NPV sur 5 ans avec hypothèses tenables, attribution claire d'un revenu — buttent sur trois caractéristiques nouvelles que la section suivante détaille.

## 2. Pourquoi les méthodes IT classiques calent

Trois ruptures structurelles rendent la mesure du ROI plus difficile sur l'IA générative et agentique que sur les vagues IT précédentes (cloud, ERP, mobile, BI).

**Le coût marginal de l'unité de production tend vers zéro mais le coût total d'usage explose.** Une <span class="term" data-tooltip="L'inférence est le moment où un modèle d'IA produit une réponse à partir d'une requête. Son coût se mesure typiquement par token (≈ 0,75 mot) en entrée et en sortie. Sur les modèles frontières, ce coût a chuté d'un facteur 1000 entre 2022 et 2025 par token, mais les usages explosent en parallèle.">inférence</span> sur un modèle frontière coûte aujourd'hui une fraction de centime, mais une organisation qui industrialise une centaine d'agents internes génère des millions de tokens par jour, et le **coût total d'usage** devient une variable difficile à anticiper. Cigref recense les coûts à intégrer : ingénierie, infrastructures cloud, licences, consommation énergétique, inférence — auxquels s'ajoutent ==30 à 40 % de coûts de transformation cachés== (conduite du changement, gouvernance, formation, FinOps)[^1].

**Les bénéfices ne sont pas localisés sur un poste mais se diluent sur un workflow.** Quand un assistant rédactionnel fait gagner 6 minutes sur un mémo, ces 6 minutes se redistribuent : un peu de relecture en plus, un peu de café en plus, un peu de réflexion sur le mémo suivant. Aucune de ces redistributions n'apparaît dans une ligne de P&L. McKinsey identifie d'ailleurs ==la refonte des workflows comme la variable n°1== qui distingue les organisations à fort impact EBIT[^3] : sans ré-architecture des processus, l'économie locale ne se traduit pas en gain global.

**Les bénéfices apparaissent en J-curve.** Les économistes Erik Brynjolfsson, Daniel Rock et Chad Syverson ont formalisé ce qu'ils appellent la *productivity J-curve*[^12] : les technologies à usage général comme l'IA exigent des investissements complémentaires intangibles (refonte de processus, formation, redesign organisationnel) qui sont *dépensés* mais non *capitalisés* dans la comptabilité standard. La productivité mesurée plonge donc d'abord, avant de remonter quand les actifs intangibles produisent leurs effets. Lire un ROI à 12 ou 18 mois revient souvent à mesurer le creux de la J et à conclure trop vite à l'échec.

À ces trois ruptures s'en ajoute une quatrième pour les agents autonomes : ==la définition de l'unité de mesure se déplace==. On ne mesure plus le coût d'une transaction ou le temps d'une tâche, mais le coût et la qualité d'une suite de décisions enchaînées par un agent qui appelle des outils, des sous-agents et reformule sa propre stratégie en cours de route. La section 7 y revient en détail.

## 3. Le panorama des frameworks 2024-2026

Cinq grands cadres se sont imposés en 18 mois pour structurer la mesure de la valeur. Aucun ne remplace les autres ; ils se complètent et leurs angles de vue convergent.

![Panorama des cinq frameworks ROI IA 2024-2026|1200](images/20260507-02-panorama-frameworks.svg)

**Cigref (janvier 2026)** propose une **cartographie en 4 catégories** — bénéfices opérationnels (productivité, automatisation, erreurs), organisationnels (engagement, marque employeur, allocation des ressources), stratégiques (avantage compétitif, nouveaux business models) et financiers (coûts, revenus, conformité)[^1]. Surtout, Cigref introduit deux distinctions essentielles : la séparation **fondations / IA horizontales / IA verticales** (et le ROI propre à chaque niveau), et l'opposition **Hard Savings / Soft Savings** (productivité chiffrable au P&L vs gains diffus de compétitivité).

**McKinsey (March 2025)** met en avant un seul indicateur d'aboutissement — le **% d'EBIT attribuable à l'IA** — et identifie une cohorte étroite de "high performers" : 5,5 % des entreprises disent dépasser **5 % d'EBIT lié à l'IA**[^3]. Sa thèse : *organizations are rewiring to capture value*. Le redesign des workflows, l'investissement dans le talent, et la responsabilisation au niveau du COMEX sont les variables qui ressortent.

**BCG (Build for the Future, Sept 2025)** segmente la population en trois : les **5 % future-built**, les **35 % scalers**, les **60 % laggards**, avec un AI Maturity Score qui croise dépense, talent, capacité agentique et impact mesuré. BCG insiste sur la part croissante de la valeur captée par les agents : **17 % en 2025, 29 % attendu en 2028**[^4].

**MIT NANDA (août 2025)** documente le *GenAI Divide* : derrière le chiffre choc des 95 % de pilotes au point mort se cache une mécanique précise. ==Les déploiements achetés à des éditeurs spécialisés réussissent dans 67 % des cas, contre un tiers pour les développements internes==[^2]. Le facteur structurant n'est pas la techno, c'est l'apprentissage continu : la majorité des systèmes GenAI ne mémorisent pas le feedback, ne s'adaptent pas au contexte, ne progressent pas dans le temps.

**Forrester TEI** — le *Total Economic Impact* — n'est pas un cadre nouveau (Forrester l'a établi il y a plus de 20 ans), mais il s'applique particulièrement bien à l'IA agentique parce qu'il oblige à modéliser quatre dimensions ensemble : **bénéfices, coûts, flexibilité (options réelles futures), risques**[^8]. Sur Microsoft 365 Copilot, sur des solutions agentiques Microsoft, sur OutSystems, les études TEI publiées depuis 2024 affichent des ROI 3 ans entre 200 % et 465 %[^8] — chiffres construits sur des organisations composites, pas des projections marketing.

**Que retenir ?** Aucun de ces cinq cadres ne suffit seul. Cigref donne la bonne taxonomie, McKinsey impose un indicateur d'aboutissement, BCG positionne l'organisation dans une cohorte, MIT NANDA explique pourquoi 95 % stagnent, Forrester fournit la méthode de chiffrage. Un dossier ROI sérieux les mobilise tous.

## 4. Une grille en cinq axes pour cartographier la valeur

Les quatre catégories Cigref et l'indicateur EBIT McKinsey sont des cadres de *bilan* — ils servent à présenter les résultats au COMEX. Ils sont moins utiles pour *cadrer un cas d'usage en amont* : par où commencer, quelle métrique choisir, quel poste de bénéfice cibler ? Pour cela, j'utilise une grille analytique propriétaire à cinq axes.

![Grille 5 axes : Coût, Bien-être, Vitesse, Volume, Qualité|900](images/20260507-03-grille-5-axes.svg)

Chaque cas d'usage IA génère de la valeur sur **un ou plusieurs des cinq axes suivants** :

- **💰 Coût** — argent économisé, baisse des dépenses. Question clé : *« on dépense moins ? »*. Métriques typiques : <span class="term" data-tooltip="Total Cost of Ownership : coût total de possession sur la durée de vie d'une solution, incluant achat, intégration, maintenance, énergie, formation, retrait. Inclut souvent un facteur de risque pour les coûts cachés.">TCO</span>, CapEx évité, coût par transaction, heures économisées valorisées au coût horaire chargé.
- **😊 Bien-être** — satisfaction des collaborateurs, des clients, de la société. Question clé : *« les gens vont mieux ? »*. Métriques : <span class="term" data-tooltip="Net Promoter Score (NPS) côté client / Employee NPS (eNPS) côté collaborateur. Mesure la propension à recommander, comprise entre -100 et +100.">NPS</span>, eNPS, turnover, qualité de vie au travail, score ESG.
- **⚡ Vitesse** — efficacité, temps, productivité. Question clé : *« on va plus vite ? »*. Métriques : time-to-market, cycle time, throughput, délai de traitement.
- **📈 Volume** — croissance, plus de clients, plus de chiffre d'affaires. Question clé : *« on a plus de clients ou un panier plus gros ? »*. Métriques : revenus, parts de marché, conversion, <span class="term" data-tooltip="Average Revenue Per User : revenu moyen par utilisateur, souvent mensuel. Métrique standard sur l'abonnement et le e-commerce.">ARPU</span>, churn.
- **✅ Qualité** — précision, fiabilité, conformité, risque maîtrisé. Question clé : *« on fait moins d'erreurs ? »*. Métriques : taux d'erreur, défauts par million (PPM), taux de faux positifs, conformité réglementaire, vulnérabilités détectées.

Cette grille fait deux choses utiles. D'abord, elle force à **expliciter le mécanisme de création de valeur** d'un cas d'usage avant d'aller chercher la formule de calcul : un même outil de support client ne crée pas la même valeur selon qu'on cible une économie de masse salariale (Coût), une amélioration du <span class="term" data-tooltip="Customer Satisfaction Score : satisfaction client mesurée à chaud après une interaction, typiquement sur une échelle de 1 à 5.">CSAT</span> (Bien-être), ou un raccourcissement du temps de résolution (Vitesse). Le choix de l'axe dominant détermine le KPI de pilotage.

Ensuite, elle **se mappe proprement sur les quatre catégories Cigref**. La table ci-dessous montre la correspondance bidirectionnelle.

![Mapping bidirectionnel grille 5 axes vs catégories Cigref|1200](images/20260507-04-mapping-cigref.svg)

| Catégorie Cigref | Axes 5-grille concernés | Bénéfice Cigref typique | Métrique exemple |
|---|---|---|---|
| **Opérationnels** | Vitesse, Qualité, Bien-être | Automatisation, réduction du temps de décision, baisse des erreurs | `cycle-time`, `processing-errors`, `employee-engagement` |
| **Organisationnels** | Bien-être, Qualité | Marque employeur, agilité, valorisation des données | `eNPS`, `model-accuracy`, `prediction-reliability` |
| **Stratégiques** | Vitesse, Volume, Bien-être | Avantage compétitif, nouveaux business models, différenciation | `time-to-market`, `markets-addressed`, `brand-trust` |
| **Financiers** | Coût, Volume, Qualité | Coûts opérationnels, revenus, conformité | `tco-infrastructure`, `revenue`, `fines-avoided` |

Trois bénéfices identifiés par le Cigref restent difficiles à capter : la **valorisation des données propriétaires**, l'**émergence de nouveaux business models**, et le **coût de la décision**. Ce sont des angles morts honnêtes — la grille à cinq axes ne les comble pas mieux que les autres cadres, et il vaut mieux les traiter qualitativement (par exemple via la dimension *flexibilité* de Forrester TEI[^8]) que de fabriquer un chiffre douteux.

## 5. Hard Savings vs Soft Savings — la vraie ligne de partage

Cigref reprend une distinction héritée du procurement[^15] et la place au cœur de son cadre : **Hard Savings** vs **Soft Savings**. Les Hard Savings sont des économies *tangibles, comptabilisables au P&L* — un contrat renégocié à 10 € au lieu de 12 €, une licence remplacée, un FTE non remplacé. Les Soft Savings sont des *gains diffus, indirects, porteurs de valeur future* mais qui ne génèrent pas de ligne d'écriture comptable identifiable — six minutes économisées par mémo, un meilleur engagement, un meilleur NPS, une réponse plus rapide.

![Hard vs Soft Savings sur les 5 axes|1200](images/20260507-05-hard-vs-soft.svg)

==Une part importante de la valeur de l'IA générative tombe dans la catégorie Soft Savings== — et c'est précisément ce qui rend le sujet inflammable au CFO. Le risque est double :

1. **Soit on refuse de compter les Soft Savings** au nom de la rigueur comptable, et on sous-estime massivement le retour. C'est la trajectoire qui mène à un abandon prématuré ("on a investi 500 K€, on ne voit rien venir au P&L après 12 mois, on coupe").
2. **Soit on les compte sans méthode**, et on construit un business case fictif où chaque collaborateur gagne 30 minutes par jour, multiplié par 10 000 collaborateurs, valorisé au coût horaire chargé — produisant un chiffre que personne ne croit et que la finance refuse de signer.

La sortie par le haut, formalisée par Brynjolfsson, Rock et Syverson[^12], passe par la **productivity J-curve**. Les gains réels ne se matérialisent qu'**après** une phase d'investissement intangible non comptabilisé : refonte des processus, formation, redesign organisationnel.

![Productivity J-curve de Brynjolfsson, Rock & Syverson|1200](images/20260507-06-j-curve.svg)

Pendant cette phase, la productivité mesurée *plonge*. Les actifs intangibles (compétences, processus revus, données mieux structurées) s'accumulent invisiblement. Quand ils atteignent une masse critique, la productivité remonte au-dessus du niveau initial. Brynjolfsson et al. estiment que **les ajustements liés aux intangibles informatiques rendaient déjà la TFP américaine 15,9 % plus élevée que les mesures officielles fin 2017**[^12]. Sur l'IA générative, le même mécanisme est attendu, à un horizon de 3 à 7 ans selon le secteur.

**Implication pratique pour un business case.** On peut traiter les deux types de gains, mais sous des règles différentes :

- **Hard Savings** : règle de validation stricte — un FTE économisé ne se compte que s'il est non remplacé *ou* explicitement réaffecté à un projet à valeur démontrable. Une économie d'achat ne se compte qu'avec une preuve de facturation. Cigref alerte explicitement : ==la valeur réelle des IA horizontales dépend de la réallocation du temps gagné vers des missions à plus haute valeur ajoutée==[^1].
- **Soft Savings** : règle de validation par convergence — le gain n'est crédible que si **trois indicateurs alignés** convergent (par exemple : NPS ↑, churn ↓, conversion ↑). On n'attribue pas un montant aux Soft Savings ; on les utilise comme **conditions nécessaires** d'un effet futur de Volume ou de Coût.

Cette discipline de double traitement — Hard chiffrés et fermés, Soft suivis comme indicateurs avancés — est ce qui permet de tenir un dialogue crédible avec la direction financière sans s'enfermer dans un déni de la valeur diffuse.

## 6. La boîte à outils méthodologique

Une fois l'axe identifié et la nature Hard/Soft tranchée, il reste à choisir une *méthode de calcul*. Huit méthodes principales suffisent à couvrir l'essentiel des cas d'usage IA générative et agentique.

![Arbre de décision : quelle méthode ROI pour quel cas|1200](images/20260507-07-decision-tree-methode.svg)

| # | Méthode | Formule | Quand l'utiliser | Quand l'éviter |
|---|---|---|---|---|
| 1 | **Cost Reduction** | `(Coût Avant − Coût Après) / Investissement` | Automatisation de processus, efficacité opérationnelle | Bénéfices majoritairement qualitatifs |
| 2 | **Cost Avoidance** | `Coût évité × Probabilité / Investissement` | Détection fraude, conformité, sécurité | Événements à très faible probabilité ou non quantifiables |
| 3 | **Productivity Gains** | `Temps gagné × Coût horaire × Volume / Investissement` | Assistants, copilots, automatisation partielle | Le temps gagné ne se traduit pas en réallocation utile |
| 4 | **Revenue Increase** | `Δ CA × Marge / Investissement` | Pricing, upsell, conversion, churn | Attribution incertaine ou marketing-only |
| 5 | **Time-to-Market** | `Accélération × Fenêtre marché / Investissement` | R&D, développement produit, time-critical | Fenêtre marché incertaine |
| 6 | **NPV (Net Present Value)** | `Σ(Flux futurs / (1+r)^t) − Investissement` | Projets stratégiques long terme, infrastructures | Taux d'actualisation contestable |
| 7 | **Payback Period** | `Investissement / Bénéfice annuel net` | Quick wins tactiques, validation d'enveloppe | Bénéfices qui croissent dans le temps (sous-estimation) |
| 8 | **TEI (Forrester)** | `Bénéfices − Coûts ± Flexibilité − Risques` | Décisions plateforme, projets agentiques structurants | Données projetées peu robustes |

L'arbre de décision tient en trois questions :

1. **Le bénéfice est-il principalement de la baisse de coût ?** Si oui, *Cost Reduction* (Hard) ou *Productivity Gains* (Soft tant que la réallocation n'est pas prouvée). Si le bénéfice est *évité* (un risque qui ne s'est pas matérialisé), *Cost Avoidance*.
2. **Le bénéfice est-il principalement de la croissance du revenu ?** Si oui, *Revenue Increase* (si attribution claire) ou *Time-to-Market* (si l'effet vient de l'accélération d'un lancement).
3. **L'horizon dépasse-t-il 24 mois et l'investissement est-il structurant ?** Alors quitter les méthodes simples pour *NPV* (ROI projet) ou *TEI* (ROI plateforme/portefeuille avec flexibilité et risque).

Trois pièges pratiques à connaître. **Le piège du Payback** : sur un projet où les bénéfices croissent (effet d'apprentissage, J-curve), le Payback simple sous-estime systématiquement le retour parce qu'il ignore la trajectoire. **Le piège de la NPV** : un taux d'actualisation à 10 % vs 7 % change l'ordre des projets — et personne n'a un taux unique défendable sur des projets aussi atypiques. **Le piège de la *Productivity Gains* mal conduite** : valoriser 30 minutes économisées par jour × 10 000 personnes × 80 €/h sans tester la réallocation produit un nombre absurdement élevé que la finance refusera. La règle Cigref tient ici : ==pas de FTE économisé sans preuve de réallocation==[^1].

## 7. Le paradoxe agentique : l'unité de mesure se déplace

L'arrivée des agents — entités logicielles capables de planifier, d'appeler des outils, de raisonner et de revenir sur leurs propres décisions — décale la mesure du ROI à un niveau d'abstraction supérieur. BCG estime déjà à **17 % la part de valeur captée par les agents en 2025**, et anticipe **29 % en 2028**[^4]. IBM IBV confirme que ==61 % des dirigeants disent adopter activement des agents et préparer leur déploiement à l'échelle==[^10]. Le sujet n'est plus émergent.

![Stack ROI agentique : token → tâche → processus → outcome|1200](images/20260507-08-stack-roi-agentique.svg)

Le déplacement se joue sur quatre niveaux d'unité de mesure, chacun avec ses métriques propres :

1. **Token** — l'unité de coût directe de l'inférence. Métrique : coût par mille tokens en entrée et en sortie. Décroissance d'environ ×1000 entre 2022 et 2025 sur les modèles frontières. C'est la dimension la plus visible mais la moins discriminante au niveau du business case.
2. **Tâche** — une étape atomique réalisée par l'agent (résoudre un ticket, générer un brouillon, requêter une base). Métrique : coût par tâche, taux de succès, qualité. C'est l'unité où la productivité GenAI se mesure au mieux dans la littérature empirique (cf. section 8).
3. **Processus** — l'enchaînement de tâches qui produit un résultat métier (un cas client résolu de bout en bout, un mémo livré, un dossier préqualifié). Métrique : taux d'autonomie (% de processus terminés sans intervention humaine), taux d'escalade, coût total.
4. **Outcome** — l'effet métier final (rétention client, marge, conformité). C'est le seul niveau qui parle vraiment au COMEX, et le plus difficile à attribuer.

==Le ROI agentique se construit en remontant ces niveaux, pas en se concentrant sur un seul.== Une économie au niveau token ne dit rien si le taux d'autonomie au niveau processus stagne à 30 %. Un taux d'autonomie de 95 % au niveau processus ne dit rien non plus si le taux d'erreur dégrade l'outcome.

Le **cas Klarna** illustre la difficulté de cette remontée. En 2024, l'entreprise communiquait sur un assistant IA qui faisait *l'équivalent du travail de 700 ETP humains*, avec une réduction de 80 % du temps moyen de résolution et 70 % des tâches répétitives automatisées[^11]. Tous les indicateurs aux niveaux 1 (token), 2 (tâche) et 3 (processus) étaient excellents. **Pourtant, en mai 2025, Klarna a réembauché des agents humains et basculé vers un modèle hybride** — l'IA faisant le triage et les requêtes simples, les humains traitant les cas nuancés, avec escalade automatique quand la confiance baisse ou qu'une émotion est détectée[^11]. L'outcome (la qualité globale du service, la confiance client) ne suivait pas le rythme.

Cigref formule une règle directement utile ici : ==seuls les projets top-down, alignés sur la stratégie globale, génèrent un impact structurant à long terme==[^1]. Sur un agent autonome, "aligné sur la stratégie" se traduit en cible d'outcome explicite, pas en cible d'efficacité.

## 8. Ce que disent vraiment les études empiriques

Cinq études bien construites donnent un éclairage solide sur la productivité réelle de l'IA générative. Lues ensemble, elles dessinent un paysage *jagged* — irrégulier — qu'il faut accepter pour ne pas se tromper.

![Carte des findings empiriques sur la productivité IA|1200](images/20260507-09-productivity-findings.svg)

**Brynjolfsson, Li, Raymond (NBER 31161, support client).** Étude sur 5 179 agents de support technique, déploiement progressif d'un assistant conversationnel GenAI. Résultat principal : **+14 % de productivité moyenne (issues résolues par heure)**, mais ==+34 % pour les novices et débutants, effet marginal pour les seniors==[^5]. L'IA *égalise* la qualité en diffusant les meilleures pratiques des bons agents vers les nouveaux. Effets secondaires : satisfaction client améliorée, taux d'attrition des agents baissé de 8,6 %.

**Peng et al. (arXiv 2302.06590, GitHub Copilot).** Expérience contrôlée sur 95 développeurs, tâche de rédaction d'un serveur HTTP en JavaScript. Le groupe traité (Copilot) termine **55,8 % plus vite**[^13]. Étude complémentaire Microsoft / MIT / Princeton / Wharton sur **plus de 4 000 développeurs** à Microsoft, Accenture et un Fortune 100 : **+26,08 % de pull requests par semaine**, avec un effet marqué pour les développeurs moins expérimentés[^14].

**Dell'Acqua et al. (HBS WP 24-013, "Jagged Frontier").** Étude BCG × HBS sur 758 consultants. Sur les tâches *à l'intérieur de la frontière de capacités IA* : **+40 % de qualité, +25 % de vitesse, +12 % de tâches complétées**[^6]. Sur les tâches *à l'extérieur de la frontière* (où l'IA est plausible mais en réalité incompétente), ==les consultants qui utilisent l'IA performent 19 points de pourcentage en dessous de ceux qui ne l'utilisent pas==[^6]. Deux comportements émergent : les *Cyborgs* (intégration continue avec l'IA) et les *Centaurs* (délégation par découpage de tâches).

**METR (juillet 2025, devs OSS expérimentés).** RCT sur 16 développeurs très expérimentés (5 ans en moyenne sur leur projet OSS), 246 tâches randomisées avec ou sans IA. Résultat *contre-intuitif* : ==l'autorisation des outils IA augmente le temps de complétion de 19 %==[^7]. Le ressenti des développeurs allait dans l'autre sens (ils estimaient *avant* un gain de 24 %, *après* un gain de 20 %), ce qui suggère un **biais de perception massif**. METR attribue le résultat à la complexité élevée du codebase, à la maturité du projet, et à l'expertise déjà très haute des participants.

**Klarna (2024-2025).** Cas industriel exposé en section 7 — gains spectaculaires aux niveaux tâche et processus, **revers vers un modèle hybride en mai 2025** quand le niveau outcome ne suivait pas[^11].

**Lecture intégrée.** Trois patterns se dégagent :

- **L'effet IA est globalement positif sur les tâches mid-skill et standardisées** (support, rédaction usuelle, code de boilerplate), avec un boost particulièrement marqué pour les profils en montée en compétence.
- **L'effet est négatif ou nul sur les tâches d'expertise mature** (devs OSS sur leur propre codebase complexe) ou *hors frontière* de capacités IA (où l'IA produit des hallucinations plausibles).
- **Le niveau de l'outcome n'est jamais garanti par l'efficacité au niveau de la tâche.** La phase d'industrialisation est celle de l'arbitrage entre rapidité et qualité — Klarna en est l'illustration la plus publique.

## 9. Pièges à éviter et checklist en 7 questions

Les pièges les plus fréquents sur un dossier ROI IA générative ou agentique se ressemblent :

- **Vanity metrics.** Compter les utilisateurs actifs d'un copilot interne, le nombre de prompts, ou le volume de tokens ne dit rien sur la création de valeur. Ce sont des indicateurs d'adoption, pas de ROI.
- **FTE illusion.** Multiplier des minutes économisées par un nombre de personnes et un coût horaire chargé sans démonstration de réallocation produit un chiffre théorique. La règle Cigref est claire[^1] : sans preuve de réallocation, le gain est Soft, pas Hard.
- **Attribution illusion.** Sur un effet *Volume* (revenu en hausse, churn en baisse), l'IA est rarement le seul facteur. Une <span class="term" data-tooltip="Méthode statistique consistant à introduire une nouveauté sur un sous-ensemble (ex. 10 % des clients) et à comparer ses résultats à un groupe témoin pour mesurer l'effet causal réel d'une intervention.">étude contrefactuelle</span> ou un test contrôlé est indispensable pour étayer l'attribution.
- **J-curve premature judgment.** Lire un ROI à 12 mois sur un projet plateforme ou agentique structurant revient souvent à mesurer le creux de la J. Cigref recommande une fenêtre **3 à 7 ans** pour les projets stratégiques[^1] ; Brynjolfsson et al. confirment l'ordre de grandeur[^12].
- **Soft Savings sans convergence.** Affirmer qu'on gagne en bien-être ou en agilité sans triangulation par trois indicateurs alignés revient à se contenter d'un récit, pas d'une mesure.

**Sept questions à se poser avant de signer un business case ROI IA générative ou agentique** :

1. **Quel est l'axe dominant de création de valeur** (Coût, Bien-être, Vitesse, Volume, Qualité) et quel KPI métier le mesure de bout en bout ?
2. **Quelle part du gain est Hard, quelle part est Soft ?** Hard chiffré et fermé, Soft suivi par convergence d'indicateurs.
3. **Quels sont les coûts cachés de transformation** (formation, gouvernance, FinOps, conduite du changement) ? Cigref recommande +30 à 40 % au-dessus des coûts techniques[^1].
4. **Quel niveau d'unité agentique** est ciblé : tâche, processus, ou outcome ? La cible se traduit-elle en KPI testable ?
5. **Quelle est la fenêtre temporelle réaliste** ? Quick win 6-12 mois, plateforme 3-7 ans. Ne pas mélanger les horizons.
6. **Quelle preuve de réallocation** est attendue pour les FTE économisés ? Sans preuve, le gain reste Soft.
7. **Quel test causal** confirme l'attribution sur un effet de Volume ? <span class="term" data-tooltip="Test A/B : on partage la population en deux sous-groupes équivalents, on n'expose qu'un des deux à la nouveauté, et on compare les résultats. Méthode standard pour isoler l'effet causal d'une intervention.">A/B test</span>, déploiement progressif, étude contrefactuelle.

---

## Sources

[^1]: Cigref. *Évaluer le retour sur investissement des solutions d'IA générative et agentique*. Note d'information et d'actualité, 15 janvier 2026. [cigref.fr](https://www.cigref.fr/evaluer-le-retour-sur-investissement-des-solutions-dia-generative-et-agentique). Consulté le 7 mai 2026.

[^2]: MIT NANDA Initiative. *The GenAI Divide — State of AI in Business 2025*. Rapport, août 2025. [mlq.ai/state-of-ai-in-business-2025](https://mlq.ai/media/quarterly_decks/v0.1_State_of_AI_in_Business_2025_Report.pdf). Consulté le 7 mai 2026.

[^3]: Singla, A., Sukharevsky, A., Yee, L. *The state of AI: How organizations are rewiring to capture value*. McKinsey & Company, mars 2025. [mckinsey.com/state-of-ai](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-how-organizations-are-rewiring-to-capture-value). Consulté le 7 mai 2026.

[^4]: Boston Consulting Group. *The Widening AI Value Gap — Build for the Future 2025*. Rapport, septembre 2025. [media-publications.bcg.com/AI-Value-Gap-Sept-2025](https://media-publications.bcg.com/The-Widening-AI-Value-Gap-Sept-2025.pdf). Consulté le 7 mai 2026.

[^5]: Brynjolfsson, E., Li, D., Raymond, L. *Generative AI at Work*. NBER Working Paper 31161, avril 2023. Publié dans *The Quarterly Journal of Economics*, 140(2), 2025. [nber.org/papers/w31161](https://www.nber.org/papers/w31161). Consulté le 7 mai 2026.

[^6]: Dell'Acqua, F., McFowland III, E., Mollick, E. R., et al. *Navigating the Jagged Technological Frontier — Field Experimental Evidence of the Effects of AI on Knowledge Worker Productivity and Quality*. Harvard Business School Working Paper 24-013, septembre 2023. [hbs.edu/24-013](https://www.hbs.edu/ris/Publication%20Files/24-013_d9b45b68-9e74-42d6-a1c6-c72fb70c7282.pdf). Consulté le 7 mai 2026.

[^7]: METR. *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity*. Rapport, juillet 2025. [metr.org/early-2025-os-dev-study](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/). Consulté le 7 mai 2026.

[^8]: Forrester Research. *The Total Economic Impact™ Methodology*. [forrester.com/policies/tei](https://www.forrester.com/policies/tei/) — voir notamment *The Total Economic Impact™ Of Microsoft's Agentic AI Solutions*, [tei.forrester.com/microsoft/agenticai](https://tei.forrester.com/go/microsoft/agenticaisolutions/docs/Forrester_TEI_The_Total_Economic_Impact%E2%84%A2_Of_Microsoft%E2%80%99s_Agentic_AI_Solutions.pdf). Consultés le 7 mai 2026.

[^9]: Gartner. *Gartner Predicts 30% of Generative AI Projects Will Be Abandoned After Proof of Concept By End of 2025*. Communiqué, 29 juillet 2024. [gartner.com/newsroom/2024-07-29](https://www.gartner.com/en/newsroom/press-releases/2024-07-29-gartner-predicts-30-percent-of-generative-ai-projects-will-be-abandoned-after-proof-of-concept-by-end-of-2025). Consulté le 7 mai 2026.

[^10]: IBM Institute for Business Value. *2025 CEO Study — Mindshifts for Growth*. Mai 2025. [newsroom.ibm.com/2025-CEO-study](https://newsroom.ibm.com/2025-05-06-ibm-study-ceos-double-down-on-ai-while-navigating-enterprise-hurdles). Et *From AI projects to profits — How agentic AI scales enterprise value*. [ibm.com/agentic-ai-profits](https://www.ibm.com/thought-leadership/institute-business-value/en-us/report/agentic-ai-profits). Consultés le 7 mai 2026.

[^11]: Sources combinées sur le cas Klarna : LangChain blog, *How Klarna's AI assistant redefined customer support at scale* ; The Financial Brand, *Inside Klarna's High-Profile Giant Bet on AI* (mai 2025) ; Bockius, C., *When the Metrics Lie: Klarna's AI Case Study*. [blog.langchain.com/customers-klarna](https://blog.langchain.com/customers-klarna/) ; [thefinancialbrand.com/klarna-ai](https://thefinancialbrand.com/news/fintech-banking/behind-klarnas-giant-bet-on-ai-182882) ; [chadbockius.com/case-studies/klarna](https://chadbockius.com/case-studies/klarna/). Consultés le 7 mai 2026.

[^12]: Brynjolfsson, E., Rock, D., Syverson, C. *The Productivity J-Curve — How Intangibles Complement General Purpose Technologies*. NBER Working Paper 25148, octobre 2018, révisé 2020. Publié dans *American Economic Journal: Macroeconomics*, 13(1), 333–372. [nber.org/papers/w25148](https://www.nber.org/papers/w25148). Consulté le 7 mai 2026.

[^13]: Peng, S., Kalliamvakou, E., Cihon, P., Demirer, M. *The Impact of AI on Developer Productivity — Evidence from GitHub Copilot*. arXiv:2302.06590, février 2023. [arxiv.org/abs/2302.06590](https://arxiv.org/abs/2302.06590). Consulté le 7 mai 2026.

[^14]: Cui, Z., Demirer, M., Jaffe, S., Musolff, L., Peng, S., Salz, T. *The Effects of Generative AI on High-Skilled Work — Evidence from Three Field Experiments with Software Developers*. MIT Economics Working Paper, 2024 (Microsoft, Accenture, Fortune 100 ; >4 000 développeurs). [economics.mit.edu/draft_copilot_experiments](https://economics.mit.edu/sites/default/files/inline-files/draft_copilot_experiments.pdf). Consulté le 7 mai 2026.

[^15]: Procureability. *Understanding Hard and Soft Cost Savings in Procurement*. Référence procurement sur la distinction. [procureability.com/hard-soft-savings](https://procureability.com/hard-soft-savings-procurement-guide/). Consulté le 7 mai 2026.
