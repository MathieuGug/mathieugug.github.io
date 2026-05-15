{
  "schema-01": {
    "collection": {
      eyebrow: "01 · COLLECTION",
      title: "12 dépôts Python populaires",
      body: "Le scraper interroge l'API GitHub sur 12 dépôts choisis pour leur popularité et leur maturité : pandas, django, sympy, matplotlib, scikit-learn, requests, sphinx, pylint, pytest, astropy, flask, xarray. Il retient les pull-requests fermées qui (a) mentionnent explicitement une issue dans leur description, (b) modifient au moins un fichier de test, (c) sont mergées dans la branche principale.<br><br>Sortie brute : ≈ 90 000 PR candidates. La sélection finale n'en gardera que 2,5 % — ce qui pose déjà la question de la <em>représentativité statistique</em> des issues retenues face à l'écosystème Python réel."
    },
    "filtering": {
      eyebrow: "02 · FILTRAGE",
      title: "Trois conditions strictes",
      body: "(i) La PR fait passer un test qui échouait avant le patch (<code>FAIL_TO_PASS</code>). (ii) Le test isolé est exécutable hors de tout contexte humain — pas de fixture qui dépend d'un browser, d'une base de données externe, ou d'un fichier non versionné. (iii) L'environnement Docker reproductible peut être instancié avec les versions exactes du commit parent.<br><br>Résultat : 2 294 instances. Cette filtration sélectionne aussi un <em>type</em> particulier de bug — celui qui a un test pré-existant. Les bugs détectés en production sans test, ou ceux qui requièrent l'écriture d'un nouveau test, sont mécaniquement exclus."
    },
    "harness": {
      eyebrow: "03 · HARNAIS",
      title: "Conteneur Docker reproductible",
      body: "Pour chaque instance, le harnais instancie un conteneur Docker qui contient le repo au commit parent (juste avant le fix), les dépendances figées (Python version, packages avec versions exactes). Le patch produit par l'agent est appliqué. Puis <code>pytest</code> est lancé sur les tests <code>FAIL_TO_PASS</code>.<br><br><strong>Ce qui est libre :</strong> l'exploration du repo par l'agent, le nombre de retries, l'orchestration multi-tour, la lecture des fichiers, l'utilisation de tools auxiliaires. Le harnais n'évalue que le format final du patch, pas le chemin pour y parvenir. C'est cette liberté qui rend les scores non-comparables entre labos[^10]."
    },
    "scoring": {
      eyebrow: "04 · SCORING",
      title: "Binaire — pas de juge LLM, pas de partiel",
      body: "Score binaire : tous les tests <code>FAIL_TO_PASS</code> passent → 1, sinon → 0. Pas de score partiel, pas de juge LLM, pas de subjectivité.<br><br><strong>Avantage :</strong> objectivité absolue. <strong>Limite :</strong> un patch correct qui se contente de masquer le bug (ex : <code>try/except</code> qui avale l'exception) peut faire passer le test sans réparer le problème de fond. Le scoring fonctionnel ne juge pas la qualité conceptuelle de la solution.<br><br>Pour SWE-bench Verified[^2], OpenAI a ajouté en août 2024 un audit humain qui a éliminé les instances dont le patch attendu est pathologiquement trivial — mais l'audit corrige les items, pas la contamination structurelle."
    }
  },
  "schema-02": {
    "temporal-overlap": {
      eyebrow: "VECTEUR (i)",
      title: "Chevauchement train/test temporel",
      body: "Le plus connu, le plus discuté, et celui qui résiste le mieux aux dénégations. Tout modèle pré-entraîné sur un crawl web post-2023 a vu, dans son corpus, les commits qui résolvent les issues de SWE-bench. Le patch correctif est lui-même un commit public dans le repo.<br><br><strong>Quantification :</strong> Roberts et al. (2024) — sur des subsets dont la date dépasse le cutoff du modèle, les scores baissent de 8 à 15 points absolus[^7]. La fuite est explicite (mesurable) mais structurelle : pour l'éviter, il faut un benchmark à test set rolling (SWE-bench Live)."
    },
    "version-tag": {
      eyebrow: "VECTEUR (ii)",
      title: "Fuite par version-tag",
      body: "Plus subtil. Les issues SWE-bench portent dans leur description le numéro de version où le bug a été observé (ex : <em>\"This breaks in pandas 1.3.5\"</em>). Le patch correctif fixe la version dans un commit suivant, parfois mentionné dans le changelog.<br><br>Un modèle entraîné sur PyPI ou des release notes peut associer la version au type de bug et au type de fix sans avoir besoin de \"raisonner\" sur le code.<br><br><strong>Quantification :</strong> Aleithan et al. (2024) ont audité 100 instances et trouvé ≈ 18 % de <em>solution leakage</em> indirect par ce canal[^10]. Mitigeable par un audit fin à la SWE-bench Verified."
    },
    "harness-gaming": {
      eyebrow: "VECTEUR (iii)",
      title: "Gaming du harnais",
      body: "Le vecteur le plus visible, et celui que la communauté tolère le mieux. SWE-bench ne fixe que le format final (le patch produit) et le scorer ; tout le reste — exploration du repo, lecture des fichiers, retries, agents intermédiaires — est libre.<br><br><strong>Exemples 2024-2026 :</strong> Magic.dev publie un harness avec vote majoritaire à N=8. Cognition (Devin) utilise un orchestrateur multi-étapes propriétaire. Anthropic publie ses scores sur un harness \"claude-tools\" qui n'est pas exactement celui distribué publiquement.<br><br>Aucun de ces choix n'est de la triche au sens strict — mais ils rendent les scores <strong>non-comparables</strong> entre labos et entre versions du même labo. Effet cumulé : +5 à +12 pts."
    },
    "prompt-leakage": {
      eyebrow: "VECTEUR (iv)",
      title: "Leakage de prompt",
      body: "Le moins discuté, et probablement le plus difficile à mesurer. Les prompts utilisés en évaluation sont rarement publiés intégralement. Ils contiennent souvent des hints méthodologiques (\"vérifie d'abord les fichiers <code>tests/</code>\", \"regarde les imports avant de patcher\", \"n'oublie pas que pandas utilise pytest\"), parfois calibrés instance par instance lors de phases de \"prompt search\".<br><br>Un modèle évalué avec un prompt-search exhaustif a un score qui dépend autant du prompt que du modèle. Aucun audit indépendant n'est possible — les prompts sont propriétaires. Effet typique : +3 à +6 pts, rarement avoué."
    }
  },
  "schema-03": {
    "swe-bench": {
      eyebrow: "SWE-BENCH VERIFIED",
      title: "De 20 % à 78 % en dix-huit mois",
      body: "Trajectoire la plus suivie. Score moyen Q1 2024 ~12 %, sortie de SWE-bench Verified Q3 2024 → reset à ~30 %, puis montée régulière de +7 à +12 points par trimestre.<br><br><strong>Points d'inflexion :</strong> sortie de Verified (Q3 2024), montée de l'industrialisation des harness customs (Q1-Q2 2025), arrivée de Claude Opus 4.x et GPT-5 (Q4 2025).<br><br><strong>Écart au terrain :</strong> les rendements internes mesurés (banques, fintech, équipes data des grands groupes) restent à 25-40 % sur leurs monorepos. L'écart est stable, voire croissant."
    },
    "gaia": {
      eyebrow: "GAIA NIVEAU 1",
      title: "30 % → 88 % — saturation rapide",
      body: "Le niveau 1 de GAIA[^3] (la « tâche de base » selon les auteurs) est en saturation. À la sortie en novembre 2023, GPT-4 plafonnait à 30 %. Vingt mois plus tard, Claude Opus 4.6 atteint ~88 %.<br><br><strong>Mécanisme :</strong> les outils que demandent les tâches (calculatrice, Python, recherche web) sont devenus triviaux à orchestrer ; le savoir-faire d'utilisation des outils est maintenant dans le modèle.<br><br>Le niveau 3 (questions multi-hop complexes) résiste mieux — autour de 60-65 % début 2026. Mais sa saturation suit la même courbe, décalée d'environ 12-18 mois."
    },
    "osworld": {
      eyebrow: "OSWORLD",
      title: "Le moins saturé — environnement ouvert",
      body: "Trajectoire la plus douce. 4 % à la sortie début 2024, ~32 % début 2026. Pente moyenne : +2 à +3 points par trimestre — un facteur 4 plus lent que SWE-bench Verified.<br><br><strong>Pourquoi :</strong> l'environnement (OS réel : Ubuntu, applications GUI, navigateurs) introduit une variabilité que les benchmarks à instances fixes n'ont pas. Le même agent évalué sur des distributions Linux différentes, des versions LibreOffice différentes, montre des variations de ±10 points[^4].<br><br>C'est aussi le benchmark le moins « benchmark-team-friendly » : le coût d'évaluation est élevé, l'instrumentation difficile, et l'optimisation ciblée moins efficace."
    },
    "tau-bench": {
      eyebrow: "τ-BENCH v2",
      title: "Le découplage qui a fait baisser les scores",
      body: "Trajectoire qui contient l'événement le plus pédagogique des deux années écoulées. À la sortie de τ-bench v1 (mi-2024)[^5], les scores publiés montent de 32 % à 56 % en six mois.<br><br>Puis en avril 2025, l'équipe Sierra publie τ-bench v2 qui découple les modèles côté agent et côté user-simulator (constatant que les deux développaient une coopération non-intentionnelle quand ils partageaient le même modèle de base).<br><br><strong>Effet :</strong> les scores baissent de 8 points pour tous les top performers. C'est exactement le pattern « publication d'une variante v2 → reset → remontée » qu'on observe sur les autres benchmarks."
    }
  },
  "schema-04": {
    "checkpoint": {
      eyebrow: "LEVIER 1 · SÉLECTION",
      title: "Choix du checkpoint benchmark-fit",
      body: "Tout entraînement produit plusieurs checkpoints au fil des epochs. Choisir celui qui maximise SWE-bench plutôt que la loss moyenne est trivial à formaliser comme un critère d'arrêt.<br><br><strong>Effet typique :</strong> +2 à +4 points absolus. <strong>Effort :</strong> faible. Tous les labos le pratiquent — c'est la moins controversée des cinq optimisations.<br><br>Conséquence latérale : le modèle déployé n'est pas le checkpoint qui généralise le mieux, mais celui qui surfite le mieux sur la distribution du benchmark."
    },
    "harness-custom": {
      eyebrow: "LEVIER 2 · ORCHESTRATION",
      title: "Harness multi-étapes propriétaire",
      body: "L'orchestrateur appelle le modèle plusieurs fois, gère l'état du repo, parse les outputs. Quatre variations courantes : ReAct simple, ReAct avec retries, multi-agent (planner + executor + critic), vote majoritaire sur N samples.<br><br><strong>Effet typique :</strong> +5 à +10 points entre ReAct simple et harness multi-agent. <strong>Effort :</strong> moyen (plusieurs ingénieurs-trimestres pour un harness compétitif).<br><br><strong>Exemples 2024-2026 :</strong> Magic.dev (vote majoritaire à N=8), Cognition (Devin orchestrator), Anthropic (claude-tools). Aucun n'est exactement reproductible par un tiers — la comparabilité disparaît."
    },
    "prompt-eng": {
      eyebrow: "LEVIER 3 · PROMPTS",
      title: "Prompt-search exhaustif sur la validation",
      body: "Un prompt système soigneusement calibré sur des instances de validation (séparées du test mais issues de la même distribution) ajoute +3 à +6 points absolus. L'effort humain est important — plusieurs ingénieurs-semaines, parfois mois — mais la marge de gain est claire.<br><br>Le prompt final embarque souvent des hints méthodologiques (\"vérifie d'abord tests/\", \"regarde les imports avant de patcher\") et des conventions de format optimales pour le harness.<br><br><strong>Frontière éthique :</strong> rarement publié intégralement. Reproduire le score publié sans avoir le prompt exact donne typiquement -3 à -6 points."
    },
    "rl-fine-tune": {
      eyebrow: "LEVIER 4 · RL CIBLÉ",
      title: "Fine-tuning sur trajectoires similaires",
      body: "Le levier le plus puissant et le plus controversé. Plutôt que d'entraîner sur SWE-bench directement (ce qui serait du training-on-test pur et serait reproché), les labos génèrent des <strong>trajectoires synthétiques</strong> sur des issues GitHub <em>similaires</em> (autres repos, mêmes patterns), puis font du RL avec récompense binaire (le test passe / ne passe pas).<br><br><strong>Effet typique :</strong> +5 à +15 points absolus. <strong>Effort :</strong> élevé (compute GPU, courbe d'apprentissage du RL ciblé).<br><br><strong>Frontière éthique :</strong> ce qui est \"similaire\" reste défini par le labo. Anthropic publie ses pratiques. Magic ne les publie pas. La frontière entre \"transfert légitime\" et \"contamination indirecte\" est floue."
    },
    "retries": {
      eyebrow: "LEVIER 5 · RETRIES",
      title: "N=1 → N=8, vote majoritaire",
      body: "Le plus visible. Faire tourner l'agent N fois, choisir la sortie qui passe le plus de tests (interdit) ou par vote majoritaire (autorisé). Le passage de N=1 à N=8 ajoute typiquement +6 à +12 points.<br><br><strong>Coût :</strong> compute multiplié par N. Sur SWE-bench Verified (500 instances), passer de N=1 à N=8 multiplie le coût d'évaluation par 8 — passe de ~200 $ à ~1 600 $.<br><br><strong>Implication production :</strong> le score publié correspond à un usage à N=8 que personne ne paiera en production réelle. Le rendement à N=1 (la condition d'usage standard) est typiquement 8-12 points en-dessous du score publié."
    }
  },
  "schema-05": {
    "swe-live": {
      eyebrow: "APPROCHE 1",
      title: "SWE-bench Live — rolling test set",
      body: "Princeton + MSR, 2025. Réponse directe au vecteur (i) : au lieu d'un test set fixe, un harnais scrape automatiquement les nouvelles issues fermées chaque semaine et les ajoute au pool d'évaluation. Le modèle est évalué sur des instances <strong>datées après son cutoff</strong>[^11].<br><br><strong>Compromis assumé :</strong> la comparabilité historique disparaît. Un score \"SWE-bench Live janvier 2026\" ne se compare pas à un score \"Live mars 2026\". C'est l'approche la plus radicale, et probablement la plus correcte épistémologiquement.<br><br><strong>Coût :</strong> ~500 $/run, comparable à SWE-bench Verified."
    },
    "swe-lancer": {
      eyebrow: "APPROCHE 2",
      title: "SWE-Lancer — tâches payées sur Upwork",
      body: "OpenAI, 2025. Place les agents sur des tâches <strong>payées réellement</strong> sur Upwork : l'agent produit une PR, un humain (le client) la valide, l'argent change de main. Le scoring est l'argent gagné.<br><br><strong>Anti-contamination par construction</strong> : tâches privées, jamais sur GitHub public.<br><br><strong>Coût d'évaluation prohibitif :</strong> ~50-200 $ par tâche, et il faut 100-200 tâches pour un score significatif. Total : 10-40 k$ par évaluation complète. C'est pourquoi les scores SWE-Lancer sont publiés une fois par an au mieux, contre SWE-bench Verified trimestriellement."
    },
    "core-bench": {
      eyebrow: "APPROCHE 3",
      title: "CORE-Bench — reproductibilité scientifique",
      body: "NYU, 2024. Évalue les agents sur la <strong>reproductibilité scientifique</strong> : étant donné un papier publié, l'agent doit cloner le repo associé, configurer l'environnement, faire tourner l'analyse, reproduire les figures du papier.<br><br><strong>Scoring partiel</strong> (chaque figure reproduite vaut un point), automatisable. <strong>Bonne représentativité</strong> d'un usage réel pour la recherche.<br><br><strong>Limites :</strong> faible couverture des autres usages (un agent qui excelle sur CORE-Bench n'est pas nécessairement bon pour fixer des bugs en production). Coût ~2-5 k$ par run."
    },
    "mle-bench": {
      eyebrow: "APPROCHE 4",
      title: "MLE-bench — 75 compétitions Kaggle",
      body: "OpenAI, 2024[^12]. L'agent reçoit le jeu de données et l'énoncé d'une ancienne compétition Kaggle, doit produire un modèle qui obtient une médaille (bronze/argent/or selon le classement final).<br><br><strong>Design anti-contamination :</strong> les datasets Kaggle sont en partie privatisés et les solutions publiques sont monitorées. <strong>Scoring à seuil</strong> (médaille obtenue ou pas), simple à comparer entre labos.<br><br><strong>Compromis :</strong> évalue spécifiquement les compétences ML engineering, pas les compétences génériques de raisonnement ou de coding. Excellent pour les agents AutoML, plus narrow pour le reste."
    },
    "arc-agi": {
      eyebrow: "APPROCHE 5",
      title: "ARC-AGI 2 — private set, compute capé",
      body: "ARC Prize Foundation, 2024[^9]. Le benchmark le plus exigeant méthodologiquement : <strong>private test set</strong>, budget compute capé (~10 k$ par submission), scoring transparent.<br><br><strong>La barre humaine n'est pas saturée</strong> (~85 %). Les modèles plafonnent à 55 % début 2026. Les progrès y sont les plus signifiants — chaque +5 points absolus représente une avancée méthodologique réelle.<br><br><strong>Limite commerciale :</strong> peu attractif pour un communiqué de presse (score moyen bas). C'est pourquoi ARC reste un benchmark de chercheurs, peu utilisé comme KPI commercial — précisément ce qui le rend méthodologiquement le plus solide."
    }
  },
  "schema-06": {
    "benchmark-public": {
      eyebrow: "QUADRANT A · CONTRÔLÉ × PONCTUEL",
      title: "Benchmark public",
      body: "<strong>Exemples :</strong> SWE-bench Verified, GAIA, OSWorld, τ-bench v2.<br><br><strong>Sert à :</strong> comparer des architectures, publier des résultats reproductibles, communiquer sur les capacités frontière.<br><br><strong>Ne sert pas à :</strong> décider d'adopter un agent en production. La fragilité à la contamination et la non-représentativité de la distribution rendent l'extrapolation au cas métier hasardeuse.<br><br><strong>Force :</strong> comparabilité maximale entre labos (au prix des nuances de harness). <strong>Faiblesse :</strong> contamination structurelle, distribution non représentative."
    },
    "eval-interne": {
      eyebrow: "QUADRANT B · CONTRÔLÉ × LONGITUDINAL · RECOMMANDÉ",
      title: "Éval interne récurrente",
      body: "<strong>Construction :</strong> 30 à 50 tâches métier datées (après le cutoff du modèle), tirées d'incidents internes réels, jamais publiées. Scorées par les ingénieurs qui utiliseront l'agent.<br><br><strong>Sert à :</strong> décider d'adopter, détecter la dérive lors d'une mise à jour de modèle, calibrer les attentes.<br><br><strong>Force :</strong> représentativité maximale, anti-contamination par construction (tâches privées).<br><br><strong>Faiblesse :</strong> pas de comparabilité externe. <strong>Coût initial :</strong> 2-4 semaines-ingénieur. <strong>Coût récurrent :</strong> 1-2 jours par rejeu (à chaque MàJ modèle)."
    },
    "pilote": {
      eyebrow: "QUADRANT C · ÉCOLOGIQUE × PONCTUEL",
      title: "Pilote utilisateur",
      body: "<strong>Forme :</strong> canary deploy ou A/B test avec un sous-périmètre d'utilisateurs cibles, sur 2-6 semaines.<br><br><strong>Sert à :</strong> capturer les frottements UX, la cognitive load, les rejets implicites (utilisateurs qui contournent l'agent). Mesure tout ce qu'un benchmark contrôlé ne peut pas mesurer.<br><br><strong>Force :</strong> validité écologique. C'est le seul format qui révèle si l'agent est <em>utilisé</em>, pas seulement <em>performant</em>.<br><br><strong>Faiblesse :</strong> biais d'auto-sélection (les premiers utilisateurs sont plus indulgents), pas de signal sur la dérive long terme, difficulté à extraire des conclusions chiffrées."
    },
    "monitoring": {
      eyebrow: "QUADRANT D · ÉCOLOGIQUE × LONGITUDINAL",
      title: "Monitoring production",
      body: "<strong>Forme :</strong> instrumentation OpenTelemetry GenAI, traces, replays sur cohortes, métriques de dérive comportementale. Voir le dossier <em>observabilite-agents-ia</em> pour la mécanique.<br><br><strong>Sert à :</strong> détecter les régressions tôt, comprendre les incidents <em>post-mortem</em>, suivre l'évolution du coût latent, identifier les dérives de tendance que les sondes individuelles ratent.<br><br><strong>Force :</strong> seule mesure qui couvre l'usage réel sur le long terme.<br><br><strong>Faiblesse :</strong> coûteux à instrumenter (stack OTel + storage + analytique), pas de baseline contrôlée — on observe ce qui se passe, on ne mesure pas ce qui aurait pu se passer."
    }
  }
}
