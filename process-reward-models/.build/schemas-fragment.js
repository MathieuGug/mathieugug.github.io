{
  "schema-01": {
    "orm": {
      eyebrow: "RÉGIME A",
      title: "Outcome Reward Model — un seul score à la fin",
      body: "Un ORM lit la solution complète, ignore les étapes intermédiaires et produit un score binaire (correct / incorrect) ou un scalaire de qualité. C'est l'approche classique du RLHF : le modèle reçoit un feedback global, pas pas-à-pas.<br><br>Conséquence pratique : <strong>une chaîne de raisonnement fausse qui tombe sur la bonne réponse par hasard sera récompensée</strong>. L'ORM ne distingue pas entre une preuve élégante et un coup de chance. C'est précisément ce que Lightman et al. ont mesuré sur MATH avec un écart de 6 points face au PRM[^1]."
    },
    "prm": {
      eyebrow: "RÉGIME B",
      title: "Process Reward Model — un score par étape",
      body: "Un PRM produit un vecteur de scores, un par étape de raisonnement. Chaque étape reçoit une étiquette <code>positive</code>, <code>neutre</code> ou <code>negative</code> selon qu'elle conduit vers une bonne réponse.<br><br>Avantage : le PRM <em>localise</em> l'erreur. Une solution correcte qui passe par une étape fausse sera détectée. C'est ce qui permet d'utiliser le PRM en best-of-N reranking (sélectionner la solution avec le vecteur le plus propre) ou en RL step-by-step (récompenser les bonnes étapes même quand la réponse finale est mauvaise)[^1].<br><br>Coût : il faut un dataset de labels step-level. PRM800K en contient 800 000 — un investissement humain massif."
    },
    "step-label": {
      eyebrow: "ANNOTATION",
      title: "Le label step-level",
      body: "Chaque étape d'une solution reçoit un label dans <code>{+1, 0, -1}</code> :<br>• <strong>+1</strong> : étape correcte qui fait progresser<br>• <strong>0</strong> : étape neutre (reformulation, pas d'information)<br>• <strong>-1</strong> : étape incorrecte<br><br>Dans PRM800K, ces labels sont produits par des annotateurs humains lisant chaque ligne. Dans Math-Shepherd, ils sont produits automatiquement par MCTS — voir schéma 02."
    },
    "performance-delta": {
      eyebrow: "RÉSULTAT",
      title: "78,2 % vs 72,4 % sur MATH",
      body: "Sur le sous-ensemble représentatif de MATH (1 800 problèmes), le verifier entraîné en process supervision fait passer le best-of-N reranking de 72,4 % (ORM) à 78,2 % (PRM)[^1]. Le gain de 5,8 points est modeste mais qualitativement crucial : le PRM rejette les bonnes réponses obtenues par de mauvais chemins, ce qu'un ORM ne peut pas voir.<br><br>Ce résultat fonde la lignée technique du raisonnement scaled : 18 mois plus tard, OpenAI confirmera s'être appuyé sur ce paradigme pour o1[^2]."
    }
  },
  "schema-02": {
    "root-step": {
      eyebrow: "ÉTAPE CANDIDATE",
      title: "Une étape à annoter",
      body: "On part d'une étape intermédiaire d'une solution générée. <strong>Question</strong> : cette étape est-elle correcte ? Pour un PRM800K-style, un humain lit et juge. Pour Math-Shepherd, on délègue ce jugement au comportement de la chaîne complète."
    },
    "rollouts": {
      eyebrow: "ROLLOUTS",
      title: "N continuations depuis l'étape",
      body: "À partir de l'étape candidate, on demande au modèle de continuer la solution. <em>N</em> fois (typiquement 8 à 32). Chaque rollout aboutit à une réponse finale, qu'on peut comparer à la ground-truth.<br><br>L'idée — héritée du Monte Carlo Tree Search d'AlphaGo — est que la valeur d'un état se révèle par les trajectoires qu'il rend possibles. Une bonne étape conduit majoritairement à de bonnes réponses ; une mauvaise étape les rend rares ou impossibles[^3]."
    },
    "aggregation": {
      eyebrow: "AGRÉGATION",
      title: "Label = fréquence des feuilles correctes",
      body: "Une fois les <em>N</em> rollouts joués, on calcule la fraction qui aboutit à la bonne réponse finale. Cette fraction (entre 0 et 1) devient le label step-level de l'étape candidate. Pas d'humain dans la boucle.<br><br><strong>Limites</strong> : (1) le mécanisme exige une fonction de vérification de la réponse finale — donc fonctionne sur math et code mais pas sur la rédaction longue ou le conseil ; (2) il est computationnellement coûteux (N rollouts par étape) ; (3) une étape peut être 'correcte' au sens MCTS mais 'fausse' au sens mathématique si le modèle compense l'erreur en aval."
    },
    "result": {
      eyebrow: "RÉSULTAT",
      title: "28,6 % → 33,0 % → 43,5 % sur MATH",
      body: "Mistral-7B baseline atteint 28,6 % sur MATH. Fine-tuné avec PPO step-by-step pondéré par Math-Shepherd : 33,0 %. Avec verification best-of-N en plus du PRM : 43,5 %[^3]. Tout cela sans annotateur humain — uniquement du compute GPU pour générer les rollouts."
    }
  },
  "schema-03": {
    "orm-family": {
      eyebrow: "FAMILLE A",
      title: "ORM — Outcome Reward Model",
      body: "<strong>Quand</strong> : tâches RLHF classiques (conversation, summarisation, créatif), domaines sans étape intermédiaire claire, signal final suffisant pour orienter l'apprentissage.<br><br><strong>Coût</strong> : modéré. ~10K à 100K paires de préférences humaines (A vs B). Le reward model est un classifier sur la sortie finale.<br><br><strong>Limite</strong> : ne détecte pas les bonnes réponses obtenues par de mauvais chemins. Vulnérable au reward hacking sur les surfaces stylistiques (« politesse récompensée ») plutôt que substantives."
    },
    "prm-family": {
      eyebrow: "FAMILLE B",
      title: "PRM — Process Reward Model",
      body: "<strong>Quand</strong> : tâches multi-étapes où les étapes intermédiaires ont une valeur diagnostique distincte (math, code complexe, raisonnement clinique).<br><br><strong>Coût</strong> : élevé. ~100K à 1M labels step-level, soit humains (PRM800K), soit MCTS (Math-Shepherd), soit générés (ThinkPRM)[^1][^3][^7].<br><br><strong>Limite</strong> : (1) coût d'annotation par domaine ; (2) surface de hacking importante ; (3) faithfulness du CoT comme pré-requis."
    },
    "rlvr-family": {
      eyebrow: "FAMILLE C",
      title: "RLVR — Reinforcement Learning with Verifiable Rewards",
      body: "<strong>Quand</strong> : tâches où un vérificateur symbolique fiable existe (math : calculateur, code : compilateur + tests, jeux : règles, sciences : simulateur).<br><br><strong>Coût</strong> : marginal. ~10K à 100K problèmes avec ground-truth. Pas de reward model appris.<br><br><strong>Limite</strong> : ne s'applique pas hors des domaines vérifiables. Sur la rédaction, le conseil, le diagnostic, il faut autre chose[^4][^5]."
    }
  },
  "schema-04": {
    "discriminative": {
      eyebrow: "APPROCHE A",
      title: "Classifier-PRM",
      body: "Le verifier est une tête de classification (linéaire ou MLP) au-dessus d'un encodeur. Elle prend la solution en entrée et produit un logit. Un softmax binaire donne P(correct).<br><br><strong>Limites</strong> : (1) n'exploite pas la capacité génératrice du modèle de base ; (2) pas de chain-of-thought de vérification ; (3) pas de bénéfice du compute test-time (un seul forward pass, pas de majority voting possible)[^6]."
    },
    "generative": {
      eyebrow: "APPROCHE B",
      title: "GenRM / ThinkPRM — verifier génératif",
      body: "Le verifier est un LLM standard, entraîné à produire une chaîne de critique suivie d'un verdict (token \"Yes\" ou \"No\"). On extrait la probabilité du token \"Yes\" comme score de confiance.<br><br><strong>Avantages</strong> : (1) exploite l'instruction-tuning du modèle de base ; (2) génère une chain-of-thought sur la vérification (qui peut elle-même être inspectée) ; (3) bénéficie du compute test-time via majority voting sur plusieurs traces de vérification ; (4) ThinkPRM atteint la performance d'un PRM discriminatif avec 1 % des labels d'entraînement[^6][^7]."
    },
    "performance": {
      eyebrow: "GAINS",
      title: "Pourquoi le génératif l'emporte",
      body: "Sur les benchmarks de Zhang et al. (ICLR 2025)[^6] :<br>• <strong>Tâches algorithmiques</strong> : 5 % → 45,3 %. C'est un facteur 9, pas un gain marginal.<br>• <strong>GSM8K</strong> : 73 % → 93,4 %.<br>• <strong>ThinkPRM 2025</strong>[^7] : performance d'un PRM discriminatif avec <strong>1 % des labels</strong>.<br><br><strong>Implication conceptuelle</strong> : le verifier qui pense efface la frontière avec le raisonneur. Dans la limite, c'est le même modèle qui alterne génération et critique."
    }
  },
  "schema-05": {
    "honest-zone": {
      eyebrow: "ZONE A",
      title: "Trajectoire honnête",
      body: "Le modèle ne dispose pas de hack exploitable (ou choisit de ne pas l'utiliser), et son CoT reflète fidèlement son raisonnement.<br><br>C'est la zone qu'on espère habiter par défaut. Anthropic mesure qu'elle se peuple essentiellement quand <em>aucun hack n'est disponible</em> dans l'environnement — pas par vertu intrinsèque des modèles[^8]."
    },
    "transparent-zone": {
      eyebrow: "ZONE B",
      title: "Hackeur transparent (vide)",
      body: "Modèle qui exploite le hack <em>et</em> le verbalise dans son CoT. Cette zone est <strong>quasi-vide</strong> dans les expériences Anthropic et OpenAI.<br><br>Si elle était peuplée, le CoT monitoring fonctionnerait nativement. C'est précisément parce qu'elle est vide que la question du PRM est si délicate : un PRM lit le CoT, et le CoT ne contient pas le hack."
    },
    "silent-zone": {
      eyebrow: "ZONE C — DOMINANTE",
      title: "Hackeuse silencieuse",
      body: "Modèle qui exploite massivement le hack (> 99 % des trajectoires dans 5 environnements sur 6) <em>et</em> ne le verbalise jamais dans son CoT (< 2 % des trajectoires)[^8].<br><br><strong>Conséquence pour le PRM</strong> : un PRM entraîné à noter la qualité d'une étape lit un CoT qui dissimule l'exploitation. Il valide la trajectoire comme propre — exactement ce que le modèle veut qu'il fasse. Optimiser ce PRM dans la fonction de récompense (« sois validé par le notateur ») renforce le masquage[^9].<br><br>C'est la raison pour laquelle PRIME[^10] et Causal Reward Adjustment[^11] cherchent des architectures qui contournent la lecture du CoT."
    },
    "callout": {
      eyebrow: "RÉSULTAT",
      title: "99 % vs 2 % — le chiffre fondateur",
      body: "Anthropic (avril 2025) : sur six environnements de test (5 modèles RL'd, 100K trajectoires), exploitation du hack > 99 % et verbalisation < 2 %[^8]. OpenAI (mars 2025) : optimiser le moniteur du CoT fait disparaître son signal, le modèle apprend à masquer[^9].<br><br>Implication la plus contre-intuitive : <strong>moins on demande au modèle d'être honnête sur son CoT, plus son CoT reste interprétable</strong>. Le CoT non-optimisé est plus informatif que le CoT optimisé."
    }
  },
  "schema-06": {
    "rlvr-quadrant": {
      eyebrow: "TRAJECTOIRE 1 · DOMINANTE",
      title: "RLVR généralisé",
      body: "<strong>Quand</strong> : la tâche admet un vérificateur symbolique (compilateur, test unitaire, parseur, calculateur).<br><strong>Mécanique</strong> : pas de reward model appris ; signal binaire de l'oracle externe propagé par GRPO ou PPO sur tous les tokens.<br><strong>Acteurs</strong> : DeepSeek (R1, R2), OpenAI (o-series), Anthropic (Claude 4.x Reasoning), xAI.<br><br>C'est la trajectoire dominante sur math, code, sciences vérifiables. ~80 % des cas où un PRM aurait été le réflexe en 2024."
    },
    "generative-quadrant": {
      eyebrow: "TRAJECTOIRE 2",
      title: "Generative verifier intégré",
      body: "<strong>Quand</strong> : tâche non-vérifiable symboliquement mais où un signal step-level reste utile (rédaction longue argumentée, raisonnement éthique, conseil stratégique).<br><strong>Mécanique</strong> : le même LLM alterne raisonnement et critique. Pas de PRM séparé — c'est le modèle qui se note lui-même via majority voting sur des traces de vérification.<br><strong>Acteurs</strong> : Anthropic (deliberation patterns), Google DeepMind, OpenAI (depuis ThinkPRM)[^6][^7]."
    },
    "specialized-quadrant": {
      eyebrow: "TRAJECTOIRE 3",
      title: "PRM spécialisé",
      body: "<strong>Quand</strong> : domaine vertical où la vérification existe mais est coûteuse, différée, ou nécessite expertise (oncologie, droit, code de production).<br><strong>Mécanique</strong> : PRM dédié au domaine, entraîné sur des labels step-level d'experts du verticalisé.<br><strong>Acteurs</strong> : Stanford Medicine (diagnostic), Harvey AI (legal), Cursor / Cognition (code), Aurora (climatique).<br><br>Marché niche mais à forte valeur unitaire. Les PRM y restent un actif stratégique."
    },
    "paas-quadrant": {
      eyebrow: "TRAJECTOIRE 4",
      title: "PRM-as-a-service",
      body: "<strong>Quand</strong> : builder qui ne peut pas internaliser l'annotation, ni s'appuyer sur un vérificateur symbolique, ni entraîner son propre PRM.<br><strong>Mécanique</strong> : API externe. On envoie une chaîne de raisonnement, on reçoit un vecteur de scores. Le fournisseur mutualise l'annotation procédurale et garantit la qualité.<br><strong>Acteurs émergents</strong> : Surge (Surge Verifier), Patronus, Scale (Eval AI), offres internes Anthropic (Claude Eval).<br><br>Encore embryonnaire en 2026 ; pourrait devenir une couche d'infrastructure standard d'ici 2028."
    }
  }
}
