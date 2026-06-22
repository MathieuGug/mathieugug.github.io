{
  "schema-01": {
    "prefill-phase": {
      title: "Prefill — compute-bound",
      eyebrow: "Phase 1 · traitement du prompt",
      body: "<p>Le prefill calcule en une seule passe les représentations de <strong>tous les tokens du prompt en parallèle</strong>, et remplit le KV cache. Parce qu'il traite des centaines ou des milliers de tokens d'un coup, il sature les unités de calcul matriciel du GPU : il est <em>compute-bound</em>.</p><p>Son objectif de latence est le <strong>TTFT</strong> (time-to-first-token). Il préfère le GPU le plus rapide en FLOPs. Un assistant à long contexte (gros prompt, courte réponse) est dominé par cette phase.</p>"
    },
    "decode-phase": {
      title: "Decode — memory-bound",
      eyebrow: "Phase 2 · génération",
      body: "<p>Le decode génère la réponse <strong>un token à la fois</strong>. Chaque itération lit l'intégralité du KV cache, calcule un seul nouveau token, l'ajoute, recommence. Le calcul par pas est minuscule ; ce qui domine, c'est le va-et-vient mémoire — il est <em>memory-bandwidth-bound</em> et laisse le calcul largement inoccupé.</p><p>Son objectif est le <strong>TBT</strong> (time-between-tokens). Il se contente d'un GPU moins onéreux, moins énergivore<a class=\"cite\" data-cite=\"2\" href=\"#source-2\">2</a>.</p>"
    },
    "kv-cache": {
      title: "Le KV cache",
      eyebrow: "Objet partagé entre les deux phases",
      body: "<p>Le <em>Key-Value cache</em> stocke les paires clé/valeur de l'attention de chaque token déjà vu, pour ne pas les recalculer. Le prefill <strong>l'écrit</strong> ; le decode <strong>le lit et l'étend</strong> à chaque pas.</p><p>Pour un long contexte, il pèse plusieurs gigaoctets. C'est lui qu'il faudra transférer d'un pool à l'autre quand on désagrège — d'où le rôle central du transfert KV (Schéma 5).</p>"
    },
    "roofline": {
      title: "La roofline matérielle",
      eyebrow: "Deux points opposés",
      body: "<p>Le modèle <em>roofline</em> représente la performance atteignable d'un kernel selon son intensité arithmétique. À gauche, la pente est bornée par la <strong>bande passante mémoire</strong> ; à droite, le plafond est le <strong>débit de calcul</strong>.</p><p>Le decode se situe sur la pente mémoire (faible intensité), le prefill sous le toit de calcul (forte intensité). Les colocaliser, c'est demander à un seul matériel d'être optimal aux deux extrémités — impossible.</p>"
    }
  },
  "schema-02": {
    "ongoing-decode": {
      title: "Decodes en cours",
      eyebrow: "Flux token par token",
      body: "<p>Chaque ligne est une requête en train de générer : un tick = un token émis, à intervalle régulier de quelques millisecondes. Tant que rien ne les interrompt, le flux est fluide et le TBT respecté.</p><p>En colocation, ces decodes partagent le GPU avec les nouveaux prompts à traiter — et c'est là que tout se joue.</p>"
    },
    "prefill-injection": {
      title: "Injection d'un prefill",
      eyebrow: "Un long prompt arrive",
      body: "<p>Le scheduler insère un nouveau prefill dans le batch. Une passe de prefill sur un long prompt prend des <strong>centaines de millisecondes</strong> — contre quelques millisecondes pour une itération de decode.</p><p>Pendant ce temps, le GPU est monopolisé par le calcul du prefill. Les requêtes déjà en génération ne peuvent pas avancer.</p>"
    },
    "hol-blocking": {
      title: "Head-of-line blocking",
      eyebrow: "Le mécanisme de l'interférence",
      body: "<p>Tous les decodes en cours sont <strong>mis en pause</strong> le temps que le prefill s'exécute : une tâche longue en tête de file bloque toutes celles qui la suivent. Pour l'utilisateur dont la réponse s'écrivait, l'écran se fige brutalement.</p><p>C'est l'interférence prefill-decode que la désagrégation supprime à la racine, en plaçant les deux phases sur des pools distincts.</p>"
    },
    "slo-violation": {
      title: "La violation de SLO",
      eyebrow: "Pic de TBT",
      body: "<p>Le temps inter-tokens, normalement de quelques millisecondes, explose pendant le stall. Sarathi-Serve mesure un pic de TBT en queue allant <strong>jusqu'à 28,3×</strong> la valeur d'un batch de decode pur<a class=\"cite\" data-cite=\"4\" href=\"#source-4\">4</a>.</p><p>Au-delà du plafond de SLO, ces tokens arrivent trop tard pour compter : le goodput s'effondre (Schéma 3).</p>"
    }
  },
  "schema-03": {
    "throughput-curve": {
      title: "Le throughput brut",
      eyebrow: "Ce que la métrique naïve montre",
      body: "<p>Le débit brut — tokens ou requêtes par seconde, toutes confondues — monte continûment avec la charge puis plafonne quand le matériel sature. Il compte autant une requête servie dans les temps qu'une requête arrivée trop tard.</p><p>Maximiser le throughput sans regarder la latence donne une illusion de capacité : la machine est occupée, mais l'expérience utilisateur peut être déjà cassée.</p>"
    },
    "goodput-curve": {
      title: "Le goodput",
      eyebrow: "Le débit qui compte",
      body: "<p>Le goodput est le nombre de requêtes par seconde qui respectent <strong>simultanément tous leurs SLO</strong> (TTFT et TBT)<a class=\"cite\" data-cite=\"8\" href=\"#source-8\">8</a>. Il suit le throughput jusqu'au knee, puis chute : au-delà, le système traite toujours autant de tokens mais une fraction croissante viole la latence.</p><p>C'est la seule métrique honnête pour dimensionner un service sous contrainte d'expérience.</p>"
    },
    "slo-knee": {
      title: "Le knee SLO",
      eyebrow: "Le point de bascule",
      body: "<p>Le <em>knee</em> est la charge à partir de laquelle la latence commence à violer les SLO. En colocation, l'interférence prefill-decode le fait arriver tôt. En désagrégé, la suppression de l'interférence le repousse vers la droite.</p><p>Tout l'art du serving consiste à éloigner ce point le plus possible — c'est ce que mesure le gain de la désagrégation.</p>"
    },
    "disagg-gain": {
      title: "Le gain de la désagrégation",
      eyebrow: "Knee repoussé",
      body: "<p>En découplant les latences des deux phases, la désagrégation déplace le knee : à SLO constant, DistServe sert <strong>7,4× plus de requêtes</strong> ; ou tient un SLO <strong>12,6× plus serré</strong> à charge constante, en gardant plus de 90 % des requêtes dans les clous<a class=\"cite\" data-cite=\"1\" href=\"#source-1\">1</a>.</p><p>Attention : ces chiffres n'ont de sens qu'attachés à une paire de seuils (TTFT, TBT) explicite.</p>"
    }
  },
  "schema-04": {
    "router": {
      title: "Routeur KV-aware",
      eyebrow: "Entrée du système",
      body: "<p>Le routeur reçoit les requêtes et les oriente. Dans les systèmes modernes il est <em>KV-aware</em> : il sait quels préfixes sont déjà en cache et où, et dirige le trafic pour <strong>maximiser les réutilisations</strong> et minimiser les recalculs<a class=\"cite\" data-cite=\"5\" href=\"#source-5\">5</a>.</p><p>C'est la première brique qui transforme deux pools isolés en un système cohérent.</p>"
    },
    "prefill-pool": {
      title: "Pool prefill",
      eyebrow: "Cible : TTFT",
      body: "<p>Un <strong>petit nombre de GPU haut de gamme</strong>, calibrés pour le calcul, qui produisent le KV cache du prompt le plus vite possible. Ils peuvent utiliser un parallélisme tensoriel agressif pour minimiser la latence du prefill.</p><p>Leur dimensionnement est indépendant du pool decode — et le ratio entre les deux s'ajuste à la charge réelle, là où la colocation imposait un compromis figé<a class=\"cite\" data-cite=\"1\" href=\"#source-1\">1</a>.</p>"
    },
    "kv-transfer": {
      title: "Transfert du KV cache",
      eyebrow: "Le chemin critique",
      body: "<p>Le KV cache produit par le prefill doit rejoindre le pool decode avant que la génération commence. C'est le coût propre à la désagrégation : mal géré, il devient le nouveau goulot.</p><p>Les parades — transfert layer-by-layer, transport RDMA/NVLink via NIXL, hit de préfixe — font l'objet du Schéma 5. Bien géré, il devient quasi invisible.</p>"
    },
    "decode-pool": {
      title: "Pool decode",
      eyebrow: "Cible : TBT",
      body: "<p>Un <strong>plus grand nombre de GPU</strong>, éventuellement moins coûteux et moins énergivores, optimisés pour la bande passante mémoire. Ils génèrent la réponse token par token sous contrainte de TBT.</p><p>Comme le decode n'a pas besoin de la pleine puissance de calcul, ce pool peut tourner sur du matériel meilleur marché — d'où une partie de l'économie de la désagrégation<a class=\"cite\" data-cite=\"2\" href=\"#source-2\">2</a>.</p>"
    },
    "kv-store": {
      title: "KV store global",
      eyebrow: "Cache mutualisé",
      body: "<p>Le store mutualise les caches au-delà d'un seul nœud : le <em>Mooncake Store</em> agrège la DRAM, les SSD et les NIC sous-exploités du cluster pour étendre la capacité de cache et servir de hub de transfert inter-nœuds<a class=\"cite\" data-cite=\"3\" href=\"#source-3\">3</a>.</p><p>C'est lui qui rend possible le cache de préfixes partagé entre requêtes — la troisième parade du Schéma 5.</p>"
    },
    "slo-planner": {
      title: "Planificateur sous SLO",
      eyebrow: "Le socle de régulation",
      body: "<p>Le <em>SLO Planner</em> de Dynamo surveille en continu la capacité et l'activité de prefill, et <strong>réajuste l'allocation de GPU</strong> (le ratio prefill/decode) pour tenir les objectifs de latence malgré les variations de trafic<a class=\"cite\" data-cite=\"5\" href=\"#source-5\">5</a>.</p><p>Sans lui, les pools seraient figés et perdraient l'avantage clé de la désagrégation : l'élasticité par phase.</p>"
    }
  },
  "schema-05": {
    "layerwise-transfer": {
      title: "Transfert layer-by-layer",
      eyebrow: "Parade 1 · recouvrir",
      body: "<p>Le KV cache se construit couche par couche pendant le prefill. Plutôt que d'attendre la fin pour tout transférer en bloc, on <strong>émet le cache de chaque couche dès qu'elle est calculée</strong> : le transfert recouvre le calcul.</p><p>Quand la dernière couche est prête, l'essentiel est déjà parti. FlowKV pousse la logique avec réorganisation mémoire et allocation par segments — jusqu'à <strong>−96 à −98 %</strong> de latence de transfert<a class=\"cite\" data-cite=\"11\" href=\"#source-11\">11</a>.</p>"
    },
    "transport-backends": {
      title: "Le transport (NIXL)",
      eyebrow: "Parade 2 · transporter vite",
      body: "<p>Intra-nœud, le cache circule sur <strong>NVLink</strong> ; inter-nœuds, sur <strong>InfiniBand ou RoCE en RDMA</strong>. NVIDIA packe cette couche dans NIXL, utilisée par Dynamo, qui déplace le cache de VRAM à VRAM sur le transport le plus rapide disponible.</p><p>NIXL expose plusieurs backends : RDMA/InfiniBand, RoCE via UCX, repli TCP, NVMe-oF, et même stockage objet S3<a class=\"cite\" data-cite=\"12\" href=\"#source-12\">12</a>.</p>"
    },
    "bandwidth-wall": {
      title: "Le mur de bande passante",
      eyebrow: "La contrainte",
      body: "<p>Règle d'ingénierie : <strong>le transfert KV ne doit jamais excéder le budget de latence libéré</strong> par la suppression de l'interférence — sinon il réintroduit sur le chemin critique ce qu'on venait d'éliminer.</p><p>D'où l'importance d'un interconnect à 400+ Gbps en production. En dessous, la désagrégation peut coûter plus qu'elle ne rapporte<a class=\"cite\" data-cite=\"12\" href=\"#source-12\">12</a>.</p>"
    },
    "prefix-cache-hit": {
      title: "Le hit de préfixe",
      eyebrow: "Parade 3 · éviter",
      body: "<p>Si deux requêtes partagent un préfixe — un <em>system prompt</em>, un document, un tour de conversation antérieur — le KV cache correspondant n'a pas à être recalculé : il est servi depuis le store global.</p><p>Le transfert cesse d'être un pur coût pour devenir le support d'une économie de calcul. C'est le cœur de l'architecture de Mooncake : <strong>plus de 100 Md tokens/jour</strong> chez Kimi<a class=\"cite\" data-cite=\"3\" href=\"#source-3\">3</a>.</p>"
    }
  },
  "schema-06": {
    "distserve": {
      title: "DistServe",
      eyebrow: "OSDI 2024 · le cadre",
      body: "<p>Le papier qui a <strong>posé le cadre du goodput</strong> et démontré le placement par phase, avec une allocation et un parallélisme distincts pour chaque pool. Auteurs de Peking University, UC San Diego et StepFun.</p><p>Résultat de référence : <strong>7,4× plus de requêtes</strong> servies ou un SLO <strong>12,6× plus serré</strong> à matériel constant<a class=\"cite\" data-cite=\"1\" href=\"#source-1\">1</a>.</p>"
    },
    "splitwise": {
      title: "Splitwise",
      eyebrow: "ISCA 2024 · Best Paper",
      body: "<p>De Microsoft Research. Apporte l'argument des <strong>pools matériels hétérogènes</strong> — GPU haut de gamme pour le prefill, GPU plus modestes pour le decode — et la mesure énergétique.</p><p>Gain : <strong>2,35×</strong> de débit à coût et puissance égaux, ou 1,4× à 20 % de coût en moins<a class=\"cite\" data-cite=\"2\" href=\"#source-2\">2</a>.</p>"
    },
    "mooncake": {
      title: "Mooncake",
      eyebrow: "FAST 2025 · Best Paper",
      body: "<p>De Moonshot AI et Tsinghua. <strong>Industrialise l'approche KVCache-centric</strong> en production derrière Kimi, avec le Mooncake Store comme couche de cache distribuée (DRAM/SSD/NIC mutualisés).</p><p>En production sur des milliers de nœuds, <strong>100+ Md tokens/jour</strong>, avec un gain de capacité effective de <strong>59 à 498 %</strong> sous SLO<a class=\"cite\" data-cite=\"3\" href=\"#source-3\">3</a>.</p>"
    },
    "dynamo": {
      title: "NVIDIA Dynamo",
      eyebrow: "GTC 2025 · plateforme",
      body: "<p>L'offre la plus intégrée : routeur KV-aware, <strong>NIXL</strong> pour le transport, KV Block Manager pour la hiérarchie mémoire, et <strong>SLO Planner</strong> pour l'allocation dynamique. Open source (Apache 2.0).</p><p>Cible explicitement les modèles de raisonnement, dont les longues sorties amplifient le bénéfice de pools séparés<a class=\"cite\" data-cite=\"5\" href=\"#source-5\">5</a>.</p>"
    },
    "vllm": {
      title: "vLLM + LMCache",
      eyebrow: "Écosystème ouvert",
      body: "<p>vLLM expose la désagrégation (encore expérimentale) via un <strong>connecteur de transfert KV configurable</strong> : NIXL, LMCache, ou mémoire partagée<a class=\"cite\" data-cite=\"6\" href=\"#source-6\">6</a>.</p><p>L'équipe LMSYS l'a démontré à l'échelle en mai 2025 : DeepSeek-R1 sur <strong>96 GPU H100</strong> (3 nœuds prefill, 9 decode), ~5× le débit de sortie du parallélisme tensoriel classique<a class=\"cite\" data-cite=\"7\" href=\"#source-7\">7</a>.</p>"
    },
    "sglang-trtllm": {
      title: "SGLang / TensorRT-LLM",
      eyebrow: "Suiveurs de production",
      body: "<p>Les deux frameworks ont ajouté leurs propres implémentations de désagrégation, signe que la technique est passée du papier au standard de fait de l'inférence à grande échelle.</p><p>Leur maturité reste un cran derrière les pionniers, mais l'écart se réduit vite — l'inflexion d'adoption de 2025 a été économique avant d'être technique.</p>"
    }
  },
  "schema-07": {
    "q-colocation": {
      title: "Colocation simple",
      eyebrow: "Faible charge · contexte court",
      body: "<p>Un seul type de GPU, batch continu, les deux phases mélangées. Pour une charge faible, des contextes courts et des SLO lâches, <strong>le défaut suffit</strong> : l'interférence reste rare et son coût négligeable.</p><p>Désagréger ici reviendrait à payer la complexité de deux pools et d'un fabric de transfert pour un bénéfice nul, voire négatif<a class=\"cite\" data-cite=\"10\" href=\"#source-10\">10</a>.</p>"
    },
    "q-chunked": {
      title: "Prefill découpé",
      eyebrow: "Gros prefills · charge modérée",
      body: "<p>Quand les contextes s'allongent mais que la charge reste modérée, Sarathi-Serve découpe les longs prefills en morceaux insérés sans figer les decodes (<em>stall-free</em>).</p><p>On capture l'essentiel du gain de latence <strong>sans payer le transfert KV ni deux pools</strong> : 2,6 à 5,6× de capacité selon le modèle<a class=\"cite\" data-cite=\"4\" href=\"#source-4\">4</a>. C'est le baseline sérieux à battre.</p>"
    },
    "q-disagg": {
      title: "Désagrégation pleine",
      eyebrow: "Forte charge · SLO serrés",
      body: "<p>Dès que la charge et l'exigence de débit montent, séparer physiquement les pools devient rentable : DistServe, Splitwise, Dynamo. Chaque phase se dimensionne et se parallélise indépendamment, et le decode tourne sur du matériel moins cher.</p><p>Le transfert KV doit être maîtrisé (Schéma 5), mais le goodput gagné justifie la complexité opérationnelle.</p>"
    },
    "q-kvcentric": {
      title: "Architecture KVCache-centric",
      eyebrow: "Échelle multi-nœuds · réutilisation",
      body: "<p>À très grande échelle, avec de longs contextes fortement réutilisés, le cache KV devient l'objet central : un store global mutualise et réutilise les préfixes (Mooncake Store).</p><p>C'est le régime dominant des plus gros services. L'horizon 2026-2028 — modèles de raisonnement, MoE, KVCache-as-a-service — étend ce quadrant<a class=\"cite\" data-cite=\"3\" href=\"#source-3\">3</a>.</p>"
    }
  }
}
