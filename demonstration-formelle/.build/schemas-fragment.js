{
      "schema-01": {
        "probleme": {
          title: "L'énoncé de départ",
          body: "<p>Un problème d'olympiade arrive en <strong>langage naturel</strong> : une phrase de mathématiques ordinaire. C'est le tronc commun aux deux routes — tout le reste diverge selon qu'on choisit de le formaliser ou de le résoudre directement.</p>"
        },
        "route-formelle": {
          title: "Route A — la voie formelle",
          body: "<p>On <strong>autoformalise</strong> d'abord l'énoncé en Lean, puis on cherche une preuve que le noyau acceptera. Chaque pas est garanti, mais il faut franchir le mur de la traduction (schéma 6). C'est la voie d'AlphaProof <a class=\"cite\" data-cite=\"1\" href=\"#source-1\">1</a> et d'Aristotle <a class=\"cite\" data-cite=\"6\" href=\"#source-6\">6</a> — argent à l'IMO 2024, or formel en 2025.</p>"
        },
        "verificateur": {
          title: "Le vérificateur — récompense incorruptible",
          body: "<p>Sur la route formelle, le <strong>noyau de Lean</strong> rend un verdict binaire, automatique et reproductible. Contrairement à un juge appris, il ne peut pas être trompé : c'est la définition du <strong>RLVR</strong> (Reinforcement Learning with Verifiable Rewards) poussée à sa forme limite <a class=\"cite\" data-cite=\"10\" href=\"#source-10\">10</a>.</p>"
        },
        "route-naturelle": {
          title: "Route B — le langage naturel",
          body: "<p>Le modèle raisonne directement en prose, comme un humain, sans jamais passer par Lean. Plus général et plus rapide, mais <strong>aucune garantie mécanique</strong> : la correction repose sur un jury humain. C'est la voie de Gemini Deep Think et du modèle d'OpenAI <a class=\"cite\" data-cite=\"3\" href=\"#source-3\">3</a>.</p>"
        },
        "imo-2025": {
          title: "Le sommet — argent puis or",
          body: "<p>IMO 2024 : 28 points, médaille d'<strong>argent</strong>, en formel (3/6 par AlphaProof) <a class=\"cite\" data-cite=\"2\" href=\"#source-2\">2</a>. IMO 2025 : 35/42, médaille d'<strong>or</strong> (5/6), mais en langage naturel non vérifié <a class=\"cite\" data-cite=\"3\" href=\"#source-3\">3</a>. Le même sommet, atteint par deux routes aux garanties opposées.</p>"
        }
      },
      "schema-02": {
        "enonce": {
          title: "L'énoncé est un type",
          body: "<p>En Lean (théorie des types), un théorème n'est pas une phrase à évaluer mais un <strong>type à habiter</strong>. Écrire <code>theorem T : ∀ n, P n</code>, c'est déclarer qu'on cherche un terme dont le type est <code>∀ n, P n</code>. Prouver = construire cet objet.</p>"
        },
        "tactiques": {
          title: "Les tactiques construisent le terme",
          body: "<p>Le <em>script de preuve</em> (<code>intro</code>, <code>induction</code>, <code>simp</code>…) est la partie générée par le modèle de langage. Les tactiques sont des <strong>méta-programmes</strong> qui élaborent, pas à pas, le terme de preuve. Elles peuvent se tromper sans danger : c'est le noyau, en aval, qui tranche.</p>"
        },
        "noyau-confiance": {
          title: "Le noyau — le seul à qui faire confiance",
          body: "<p>Quelques milliers de lignes, indépendantes des tactiques : le noyau <strong>type-checke</strong> le terme final selon le <em>critère de de Bruijn</em>. Toute la confiance du système y est concentrée. <mark>Un modèle ne peut pas halluciner un terme que le noyau accepte à tort</mark> <a class=\"cite\" data-cite=\"13\" href=\"#source-13\">13</a>.</p>"
        },
        "mathlib": {
          title: "Mathlib — la bibliothèque vérifiée",
          body: "<p>Plus de 1,5 M de lignes, plus de 200 000 théorèmes déjà passés au noyau <a class=\"cite\" data-cite=\"13\" href=\"#source-13\">13</a>. Mathlib est le corpus de référence : un lemme invoqué est garanti. Revers : un raisonnement qui dépend d'un lemme <em>absent</em> échoue, même s'il est juste — la bibliothèque borne ce qui est prouvable en pratique.</p>"
        }
      },
      "schema-03": {
        "autoformaliseur": {
          title: "L'autoformaliseur — le vrai déverrouillage",
          body: "<p>Le verrou n'était pas la recherche mais les <strong>données</strong>. Un réseau d'autoformalisation a traduit ~1 M de problèmes en langage naturel en ~100 M d'énoncés Lean <a class=\"cite\" data-cite=\"1\" href=\"#source-1\">1</a> — le corpus synthétique sans lequel AlphaZero n'aurait rien eu à se mettre sous la dent.</p>"
        },
        "recherche-preuve": {
          title: "La recherche de preuve",
          body: "<p>Comme aux échecs, AlphaProof construit un <strong>arbre de pas de preuve</strong> guidé par le réseau de valeur/politique. Le <em>test-time RL</em> lui permet de continuer à apprendre sur le problème même qu'il tente de résoudre, via un curriculum de variantes <a class=\"cite\" data-cite=\"1\" href=\"#source-1\">1</a>.</p>"
        },
        "verif-lean": {
          title: "La vérification par Lean",
          body: "<p>Chaque preuve candidate est soumise au noyau : <strong>acceptée ou rejetée</strong>, sans ambiguïté. Ce verdict joue deux rôles à la fois — signal de récompense pour le RL, et filtre de qualité pour les données réinjectées. Le vérificateur est le moteur silencieux de toute la boucle.</p>"
        },
        "renforcement": {
          title: "Le renforcement",
          body: "<p>Les preuves vérifiées remontent au modèle comme données d'entraînement : il s'améliore, puis s'attaque à des problèmes plus durs — la boucle <em>self-improving</em> d'AlphaZero appliquée aux maths. À l'IMO 2024, elle a résolu P1, P2 et le redoutable P6 <a class=\"cite\" data-cite=\"2\" href=\"#source-2\">2</a>.</p>"
        }
      },
      "schema-04": {
        "alphaproof": {
          title: "AlphaProof (DeepMind)",
          body: "<p>Couple AlphaZero et Lean ; <strong>fermé</strong>. Médaille d'argent à l'IMO 2024 (formel) <a class=\"cite\" data-cite=\"1\" href=\"#source-1\">1</a>. Référence historique du domaine, mais non reproductible — d'où la course open-source qui a suivi.</p>"
        },
        "deepseek": {
          title: "DeepSeek-Prover-V2",
          body: "<p>671B, voie <strong>subgoal decomposition</strong> : DeepSeek-V3 découpe en lemmes, RL via GRPO sur preuves vérifiées. <strong>88,9 %</strong> miniF2F-test, <strong>49/658</strong> PutnamBench <a class=\"cite\" data-cite=\"4\" href=\"#source-4\">4</a>. Ouvert et formel.</p>"
        },
        "goedel": {
          title: "Goedel-Prover-V2",
          body: "<p>32B — vingt fois plus petit — par synthèse de données échafaudée et auto-correction guidée par le vérificateur. <strong>90,4 %</strong> miniF2F (self-correction) et <strong>86</strong> PutnamBench, tête des modèles ouverts <a class=\"cite\" data-cite=\"5\" href=\"#source-5\">5</a>. La preuve que la méthode prime sur la taille.</p>"
        },
        "aristotle": {
          title: "Aristotle (Harmonic)",
          body: "<p>Revendique une performance niveau <strong>or</strong> à l'IMO 2025 — mais, contrairement à Gemini, <em>avec vérification formelle en Lean 4</em> <a class=\"cite\" data-cite=\"6\" href=\"#source-6\">6</a>. Montre que le formel n'était pas condamné à rester en dessous du naturel.</p>"
        }
      },
      "schema-05": {
        "whole-proof": {
          title: "A — Génération de preuve entière",
          body: "<p>Le modèle écrit toute la preuve d'un coup et la soumet à Lean ; on échantillonne jusqu'à ce qu'une tentative passe (<em>pass@k</em>). Simple, mais coûteux quand le théorème est dur — le nombre de tentatives explose.</p>"
        },
        "subgoal": {
          title: "B — Décomposition en sous-objectifs",
          body: "<p>Un grand modèle raisonne en langage naturel sur le <strong>plan</strong>, découpe le théorème en lemmes, puis formalise chaque morceau. Marie l'intuition du naturel et la rigueur du formel. Voie de DeepSeek-Prover-V2 (88,9 % miniF2F) <a class=\"cite\" data-cite=\"4\" href=\"#source-4\">4</a>.</p>"
        },
        "tree-search": {
          title: "C — Recherche + itération d'expert",
          body: "<p>Explorer l'espace des tactiques, garder les preuves trouvées comme données d'entraînement, recommencer : une <strong>boucle auto-alimentée</strong> où le vérificateur produit à la fois le signal et les données. AlphaProof et Goedel-Prover-V2 <a class=\"cite\" data-cite=\"5\" href=\"#source-5\">5</a>.</p>"
        },
        "autoformalize": {
          title: "D — Autoformaliser puis prouver",
          body: "<p>L'amont des trois autres : passer du langage naturel à l'énoncé formel. C'est le <strong>verrou réel</strong> (schéma 6) — la qualité de la traduction borne tout ce qui suit. La parade dominante est la synthèse de données à grande échelle <a class=\"cite\" data-cite=\"12\" href=\"#source-12\">12</a>.</p>"
        }
      },
      "schema-06": {
        "perte-semantique": {
          title: "Les modes d'échec de la traduction",
          body: "<p>Trois pièges récurrents : <strong>imports hallucinés</strong> (lemmes inexistants dans Mathlib), <strong>syntaxe mélangée</strong> (Coq/Isabelle vue à l'entraînement), et surtout <strong>dérive sémantique</strong> — un énoncé valide qui compile mais prouve le <em>mauvais</em> théorème. Ce dernier passe le noyau sans être détecté <a class=\"cite\" data-cite=\"11\" href=\"#source-11\">11</a>.</p>"
        },
        "data-scarcity": {
          title: "Le problème de fond — la rareté",
          body: "<p>Les preuves formelles ne se <em>scrapent</em> pas comme du texte ou du code : elles se comptent en dizaines de milliers, pas en milliards. Cette pénurie structurelle est la cause profonde du mur — sans données, ni l'autoformaliseur ni le prouveur ne peuvent passer à l'échelle <a class=\"cite\" data-cite=\"12\" href=\"#source-12\">12</a>.</p>"
        },
        "synthese-donnees": {
          title: "Parade 1 — synthèse de données",
          body: "<p>Autoformaliser en masse (AlphaProof, ~100 M d'énoncés) et <strong>échafauder</strong> des théorèmes de difficulté croissante (Goedel). On fabrique le corpus que le web ne fournit pas — au risque d'introduire du bruit que le vérificateur doit filtrer <a class=\"cite\" data-cite=\"5\" href=\"#source-5\">5</a>.</p>"
        },
        "expert-iteration": {
          title: "Parade 2 — itération d'expert",
          body: "<p>Le prouveur fabrique ses <strong>propres</strong> données : il garde les preuves qu'il trouve, s'entraîne dessus, résout des problèmes plus durs, et recommence. La boucle vertueuse où le vérificateur produit signal <em>et</em> données — mais elle bute sur l'analyse et la combinatoire, où l'autoformalisation reste fragile.</p>"
        }
      },
      "schema-07": {
        "autoformaliseur-fiable": {
          title: "Autoformaliseurs fiables",
          body: "<p>La ligne critique 2026-2028. Le jour où traduire un énoncé en Lean sera aussi robuste que compiler du code, le mur du schéma 6 tombe — et le formel rejoint le naturel en généralité, sans rien céder sur la garantie.</p>"
        },
        "preuve-as-ci": {
          title: "Preuve-comme-intégration-continue",
          body: "<p>Des bibliothèques mathématiques — et bientôt des spécifications logicielles critiques — maintenues sous <strong>vérification formelle permanente</strong> : chaque modification doit re-passer le noyau, comme une suite de tests. La math (et la spec) traitée comme une base de code.</p>"
        },
        "convergence": {
          title: "Fusion naturel × formel",
          body: "<p>Le programme le plus prometteur : <em>le langage naturel propose le plan, Lean certifie chaque pas</em>. Les pipelines de vérification-et-raffinement <a class=\"cite\" data-cite=\"7\" href=\"#source-7\">7</a> en sont les premiers prototypes — recoudre la bifurcation au lieu de choisir un camp.</p>"
        },
        "reward-universel": {
          title: "Le vérificateur comme récompense universelle",
          body: "<p>Le pari le plus structurant : brancher la sortie des modèles généralistes sur un vérificateur qui ne ment pas, pour <strong>importer dans tous les domaines</strong> la garantie qui n'existait jusqu'ici qu'en mathématiques <a class=\"cite\" data-cite=\"10\" href=\"#source-10\">10</a>. La math formelle aurait alors rempli son rôle de laboratoire du raisonnement.</p>"
        }
      }
    }