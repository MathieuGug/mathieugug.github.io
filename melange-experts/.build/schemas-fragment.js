{
  "schema-01": {
    "dense": {
      title: "Le modèle dense",
      eyebrow: "Capacité = calcul",
      body: "<p>Dans un transformer dense, <strong>tous</strong> les paramètres traitent chaque token. Un modèle de 70 milliards de poids en mobilise 70 milliards pour produire chaque mot, sans distinction entre une tâche triviale et une tâche difficile.</p><p>La conséquence est économique : la capacité (ce que le modèle sait) et le coût par token sont soudés. Vouloir plus de connaissance impose plus de calcul, linéairement. C'est ce couplage que le mélange d'experts vient briser.</p>"
    },
    "creux": {
      title: "Le modèle creux (MoE)",
      eyebrow: "Capacité découplée du calcul",
      body: "<p>Un modèle creux porte un très grand nombre de paramètres — 671 milliards pour DeepSeek-V3<a class='cite' data-cite='11' href='#source-11'>11</a> — mais n'en active qu'une fraction par token. La capacité est stockée dans l'ensemble des experts ; le coût ne dépend que des experts effectivement sollicités.</p><p>C'est le levier fondateur du MoE : gonfler la capacité sans gonfler le calcul. Encore faut-il décider quels experts activer, les répartir, et les équilibrer — les trois problèmes que ce dossier explore.</p>"
    },
    "fraction-active": {
      title: "La fraction activée",
      eyebrow: "≈ 5,5 % du modèle par token",
      body: "<p>DeepSeek-V3 n'active que <strong>37 des 671 milliards</strong> de paramètres par token, soit environ 5,5 %<a class='cite' data-cite='11' href='#source-11'>11</a>. Le reste des experts existe, occupe de la mémoire, mais ne calcule pas pour ce token précis.</p><p>Cette fraction est réglée par deux boutons : le nombre total d'experts <em>N</em> (capacité) et le nombre d'activés <em>k</em> (coût). Tout l'art consiste à maximiser N tout en gardant k petit.</p>"
    },
    "memoire-vs-flops": {
      title: "Mémoire contre FLOPs",
      eyebrow: "Deux budgets qui divergent",
      body: "<p>Le MoE dissocie deux budgets que le dense confondait. En <strong>mémoire</strong>, il faut loger tous les experts (comme un dense de sa taille totale). En <strong>calcul</strong> par token, il ne dépense que comme un dense de sa taille active.</p><p>Résultat : un modèle qui a l'empreinte mémoire d'un géant et l'appétit de calcul d'un modèle moyen. C'est un cadeau pour le débit et une contrainte pour la VRAM — l'asymétrie détaillée au Schéma 6.</p>"
    }
  },
  "schema-02": {
    "routeur": {
      title: "Le routeur (gate)",
      eyebrow: "Qui décide de l'aiguillage",
      body: "<p>Le routeur est un petit réseau — souvent un simple produit matriciel suivi d'un <em>softmax</em> — qui attribue à chaque token un score d'affinité pour chacun des <em>N</em> experts.</p><p>C'est le cœur battant et le talon d'Achille du modèle creux : sa qualité détermine la spécialisation des experts, et son instabilité provoque le <em>collapse</em> (Schéma 4). Toute la recherche sur le routage — token-choice, expert-choice, biais d'équilibrage — porte sur ce composant minuscule mais décisif.</p>"
    },
    "banc-experts": {
      title: "Le banc d'experts",
      eyebrow: "N sous-réseaux FFN",
      body: "<p>La couche MoE remplace le bloc <em>feed-forward</em> dense par plusieurs FFN plus petites, les experts. Leur nombre <em>N</em> fixe la capacité du modèle : plus d'experts, plus de paramètres stockés, plus de spécialisations possibles.</p><p>La tendance 2024-2026 va vers la <strong>granularité fine</strong> : beaucoup de petits experts plutôt que quelques gros, ce qui multiplie les combinaisons (choisir 8 parmi 256 vaut bien plus que 2 parmi 8) — l'innovation de DeepSeekMoE<a class='cite' data-cite='10' href='#source-10'>10</a>.</p>"
    },
    "top-k": {
      title: "La sélection top-k",
      eyebrow: "La sparsité naît ici",
      body: "<p>Seuls les <em>k</em> experts de plus haut score sont retenus ; les autres sont ignorés pour ce token. C'est précisément cette coupe qui crée la <strong>sparsité</strong>.</p><p>Les choix divergent : Switch et Llama 4 misent sur top-1<a class='cite' data-cite='3' href='#source-3'>3</a><a class='cite' data-cite='13' href='#source-13'>13</a>, Mixtral sur top-2<a class='cite' data-cite='9' href='#source-9'>9</a>, Qwen3 et DeepSeek jusqu'à top-8<a class='cite' data-cite='14' href='#source-14'>14</a>. Plus <em>k</em> est petit, plus on peut multiplier les experts à budget de calcul égal — mais moins le mélange de spécialistes est riche.</p>"
    },
    "combine": {
      title: "La combinaison pondérée",
      eyebrow: "Σ des sorties d'experts",
      body: "<p>Les <em>k</em> experts sélectionnés traitent le token en parallèle ; leurs sorties sont ensuite <strong>sommées, pondérées</strong> par les scores de gating renormalisés. Le token ressort transformé.</p><p>Au total, il n'aura mobilisé qu'une fraction <em>k/N</em> des paramètres experts de la couche. C'est l'étape qui referme le mécanisme : la sortie a la richesse de plusieurs spécialistes pour le coût de quelques-uns.</p>"
    }
  },
  "schema-03": {
    "token-choice": {
      title: "Routage token-choice",
      eyebrow: "Chaque token choisit ses experts",
      body: "<p>Le schéma canonique : chaque token sélectionne ses <em>k</em> experts de plus haut score. Intuitif, mais sans garantie d'équilibre — un expert populaire peut être submergé pendant qu'un autre chôme.</p><p>C'est le choix de la quasi-totalité des LLM décodeurs (Switch, Mixtral, DeepSeek, Qwen3, Llama 4), au prix d'un mécanisme d'équilibrage ajouté (Schéma 4) pour éviter le <em>collapse</em>.</p>"
    },
    "expert-choice": {
      title: "Routage expert-choice",
      eyebrow: "Les experts choisissent les tokens",
      body: "<p>Zhou et al. 2022 inversent la logique : chaque expert sélectionne les tokens de plus haut score jusqu'à remplir sa capacité<a class='cite' data-cite='5' href='#source-5'>5</a>. L'équilibre de charge devient <strong>garanti par construction</strong>, sans loss auxiliaire.</p><p>Le revers : certains tokens peuvent être traités par zéro expert, d'autres par plusieurs — et un expert ne peut pas choisir un token futur non encore vu, ce qui rend le procédé mal adapté à la génération auto-régressive. D'où son adoption limitée dans les LLM décodeurs.</p>"
    },
    "experts-fins": {
      title: "Experts fins",
      eyebrow: "Beaucoup de petits spécialistes",
      body: "<p>Plutôt que quelques gros experts, en découper un grand nombre de petits. À budget de paramètres égal, cela multiplie les <strong>combinaisons</strong> possibles et affine la spécialisation.</p><p>Choisir 8 experts parmi 256 offre un espace de mélanges bien plus vaste que 2 parmi 8. Introduit par DeepSeekMoE<a class='cite' data-cite='10' href='#source-10'>10</a>, ce choix s'est imposé partout : Qwen3 et DeepSeek-V3 comptent 128 à 256 experts fins par couche.</p>"
    },
    "expert-partage": {
      title: "Expert partagé",
      eyebrow: "Le point de désaccord vif",
      body: "<p>Réserver un ou deux experts <strong>toujours actifs</strong>, chargés de capturer les connaissances communes, pendant que les experts routés se spécialisent sur le résiduel<a class='cite' data-cite='10' href='#source-10'>10</a>.</p><p>C'est le seul choix où les laboratoires divergent nettement : DeepSeek-V3 l'adopte (1 partagé), Qwen3 l'abandonne pour maximiser la spécialisation<a class='cite' data-cite='14' href='#source-14'>14</a>. Un pari sur la question : vaut-il mieux un filet commun ou des spécialistes sans redondance ?</p>"
    }
  },
  "schema-04": {
    "collapse": {
      title: "Le collapse",
      eyebrow: "Le cercle vicieux",
      body: "<p>Laissé libre, un routeur token-choice s'effondre. Les experts qu'il privilégie voient plus de données, s'améliorent plus vite, donc sont encore plus choisis — jusqu'à ce qu'une poignée absorbe tout le trafic et que les autres, jamais entraînés, deviennent des <strong>paramètres morts</strong>.</p><p>Le modèle porte alors le coût mémoire de centaines d'experts sans en tirer la capacité. Neutraliser ce cercle vicieux est le premier travail de tout entraînement MoE.</p>"
    },
    "loss-auxiliaire": {
      title: "Parade 1 · Loss auxiliaire",
      eyebrow: "Un impôt sur la qualité",
      body: "<p>Popularisée par Switch<a class='cite' data-cite='3' href='#source-3'>3</a>, elle ajoute à la perte un terme qui pénalise le déséquilibre et pousse le routeur à répartir les tokens uniformément.</p><p>Défaut structurel : cette perte auxiliaire est en <strong>tension</strong> avec la perte principale (la qualité de prédiction). On force l'équilibre au détriment, léger mais réel, de la performance. ST-MoE y ajoute le <em>router z-loss</em> pour stabiliser les logits<a class='cite' data-cite='4' href='#source-4'>4</a>.</p>"
    },
    "expert-choice": {
      title: "Parade 2 · Expert-choice",
      eyebrow: "Équilibre mécanique",
      body: "<p>En laissant chaque expert choisir ses tokens jusqu'à sa capacité, l'équilibre devient garanti sans aucune loss auxiliaire<a class='cite' data-cite='5' href='#source-5'>5</a>. Élégant et sans impôt sur la qualité.</p><p>Mais l'incompatibilité avec la génération auto-régressive (un expert ne peut pas anticiper un token futur) en a limité l'usage dans les LLM décodeurs, où le token-choice reste dominant.</p>"
    },
    "biais-sans-loss": {
      title: "Parade 3 · Biais sans-loss ★",
      eyebrow: "Le nouveau standard",
      body: "<p>DeepSeek-V3 ajoute un simple <strong>biais</strong> aux scores d'affinité, ajusté après chaque pas d'entraînement : +biais aux experts sous-chargés, −biais aux surchargés<a class='cite' data-cite='11' href='#source-11'>11</a>.</p><p>L'équilibrage devient un contrôleur externe, <strong>découplé de la descente de gradient</strong> — donc sans polluer le gradient ni taxer la qualité. Cette stratégie <em>auxiliary-loss-free</em> résout la tension fondatrice entre équilibre et performance, et s'impose comme nouveau standard.</p>"
    }
  },
  "schema-05": {
    "all-to-all-dispatch": {
      title: "All-to-all dispatch",
      eyebrow: "Envoyer les tokens à leurs experts",
      body: "<p>Le routeur est global : un token calculé sur le GPU 3 peut être routé vers un expert du GPU 47. À chaque couche MoE, un collectif <strong>all-to-all</strong> achemine chaque token vers le ou les GPU hébergeant ses experts.</p><p>C'est la première moitié de la chorégraphie de communication. Sa latence dépend de la bande passante de l'interconnexion (NVLink, InfiniBand) bien plus que de la puissance de calcul.</p>"
    },
    "expert-parallelism": {
      title: "Le parallélisme d'experts",
      eyebrow: "Placer les experts sur N GPU",
      body: "<p>Un modèle de 671 milliards de paramètres ne tient sur aucun GPU. Les experts sont donc <strong>répartis</strong> : chaque accélérateur héberge un sous-ensemble d'experts — le parallélisme d'experts formalisé par GShard<a class='cite' data-cite='2' href='#source-2'>2</a>.</p><p>C'est le basculement du MoE d'un objet d'architecture vers un objet de systèmes distribués : le placement des experts et la topologie du cluster deviennent des choix de conception à part entière, comme l'illustre DeepSeek-V3<a class='cite' data-cite='11' href='#source-11'>11</a>.</p>"
    },
    "all-to-all-combine": {
      title: "All-to-all combine",
      eyebrow: "Rapatrier les résultats",
      body: "<p>Après le calcul des experts, un second collectif all-to-all renvoie chaque sortie vers le GPU d'origine du token, pour la combinaison pondérée.</p><p>Ces deux all-to-all (dispatch + combine), répétés à chaque couche MoE, sont le véritable coût du modèle creux distribué — pas le calcul des experts, qui est trivialement parallèle. DeepSpeed-MoE<a class='cite' data-cite='7' href='#source-7'>7</a> et MegaBlocks<a class='cite' data-cite='8' href='#source-8'>8</a> ont attaqué ce coût côté systèmes et côté noyaux.</p>"
    },
    "goulot-reseau": {
      title: "Le goulot réseau",
      eyebrow: "La thèse du dossier",
      body: "<p><strong>Dans un MoE distribué, ce n'est plus le calcul qui coûte, c'est le déplacement des tokens entre GPU.</strong> La performance dépend de la bande passante de l'interconnexion autant que des FLOPs.</p><p>D'où la co-conception matériel-modèle : DeepSeek-V3 optimise son all-to-all à la main et contraint le routage à limiter le nombre de nœuds traversés par token<a class='cite' data-cite='11' href='#source-11'>11</a>. L'architecture du modèle et celle de la machine ne sont plus séparables.</p>"
    }
  },
  "schema-06": {
    "memoire-residente": {
      title: "La mémoire résidente",
      eyebrow: "Tous les experts chargés",
      body: "<p>À l'inférence, on ignore à l'avance quels experts serviront le prochain token. Il faut donc que <strong>tous</strong> soient résidents en mémoire — les 671 milliards de paramètres de DeepSeek-V3 doivent tenir en VRAM (ou être prêts à y être chargés).</p><p>Le modèle creux a donc l'empreinte mémoire d'un dense de sa taille totale. C'est la face coûteuse de l'asymétrie, celle qui rend la VRAM critique.</p>"
    },
    "calcul-actif": {
      title: "Le calcul actif",
      eyebrow: "Une poignée d'experts par token",
      body: "<p>Face à la mémoire pleine, le calcul reste sobre : seuls les <em>k</em> experts sélectionnés (37 milliards de paramètres actifs pour DeepSeek-V3) travaillent réellement par token.</p><p>C'est la face généreuse de l'asymétrie : le débit d'un modèle moyen pour la connaissance d'un géant. Un MoE coûte en mémoire comme un dense de sa taille totale, mais ne calcule que comme un dense de sa taille active.</p>"
    },
    "desequilibre-batch": {
      title: "Le piège du batching",
      eyebrow: "Le déséquilibre ressurgit",
      body: "<p>Sur une requête isolée, top-1 ou top-2 mobilise peu d'experts. Mais dès qu'on regroupe des centaines de requêtes pour saturer le GPU, les tokens du lot se dispersent sur <strong>tous</strong> les experts.</p><p>Le déséquilibre de charge ressurgit alors à l'inférence : certains experts reçoivent des rafales, d'autres restent oisifs, et la latence est dictée par l'expert le plus chargé. Les serveurs (vLLM, SGLang, TensorRT-LLM) le lissent par regroupement des tokens et noyaux <em>grouped GEMM</em>.</p>"
    },
    "offloading": {
      title: "L'offloading",
      eyebrow: "La parade mémoire",
      body: "<p>Quand la VRAM manque, on décharge les experts inactifs vers la mémoire CPU ou le disque, et on les rappelle à la demande — au prix d'une latence supplémentaire.</p><p>Combiné à la <strong>quantization</strong> (experts en 4 bits plutôt que 16), l'offloading permet de faire tourner des MoE massifs sur du matériel modeste. OLMoE<a class='cite' data-cite='12' href='#source-12'>12</a>, entièrement ouvert, a rendu ces arbitrages inspectables et reproductibles.</p>"
    }
  },
  "schema-07": {
    "mixtral": {
      title: "Mixtral 8×7B",
      eyebrow: "Mistral · 2024 — le jalon fondateur",
      body: "<p>47 Md au total, ~13 Md actifs, 8 experts grossiers, top-2, sans expert partagé, équilibrage par loss auxiliaire<a class='cite' data-cite='9' href='#source-9'>9</a>.</p><p>Sa vertu historique fut de <strong>prouver</strong> qu'un MoE ouvert pouvait égaler un dense de référence (Llama 2 70B) pour un sixième du coût d'inférence. Le signal qui a déclenché la bascule généralisée vers le creux.</p>"
    },
    "deepseek-v3": {
      title: "DeepSeek-V3",
      eyebrow: "DeepSeek · 2024 — la synthèse aboutie",
      body: "<p>671 Md au total, 37 Md actifs, 256 experts fins + 1 partagé, top-8, équilibrage <strong>sans-loss par biais</strong>, co-conçu avec l'interconnexion<a class='cite' data-cite='11' href='#source-11'>11</a>.</p><p>C'est le modèle qui a rendu explicite la thèse systèmes-distribués : routage contraint par la topologie, all-to-all optimisé à la main, couplage avec l'attention latente MLA. La référence de conception 2026.</p>"
    },
    "llama4": {
      title: "Llama 4",
      eyebrow: "Meta · 2025 — la sobriété du routage",
      body: "<p>Retour au <strong>top-1</strong> (un seul routé + un partagé), en deux tailles : Scout (16 experts, 109B) et Maverick (128 experts, 400B, ~17B actifs)<a class='cite' data-cite='13' href='#source-13'>13</a>.</p><p>Meta parie sur la sobriété du routage et revendique un entraînement moins coûteux en calcul que Llama 3, malgré une échelle bien supérieure — l'argument d'efficacité du MoE poussé à sa limite.</p>"
    },
    "qwen3": {
      title: "Qwen3",
      eyebrow: "Alibaba · 2025 — le contre-pied",
      body: "<p>235B et 30B, top-8 parmi 128 experts fins, <strong>sans expert partagé</strong><a class='cite' data-cite='14' href='#source-14'>14</a>.</p><p>Le contre-pied de DeepSeek : miser sur une spécialisation maximale, sans filet commun. Sur les autres axes, la convergence est nette — granularité fine, grand nombre d'experts, top-k élevé. En 2026, la question n'est plus « dense ou creux ? » mais « quels curseurs, et pour quelle machine ? »</p>"
    }
  }
}
