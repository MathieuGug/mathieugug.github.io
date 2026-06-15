{
  "schema-01": {
    "prefill-phase": {
      title: "Prefill — la phase compute-bound",
      eyebrow: "1 · ingestion du prompt",
      body: "<p>Le prefill traite tous les tokens d'entrée en un seul passage avant, calcule le KV cache complet et émet le premier token. Le coût croît avec le nombre de tokens du prompt, et un prefill bien formé sature les unités tensor du GPU.</p><p>Conséquence de dimensionnement : la phase veut du calcul. On la place sur les GPU les plus récents, avec un parallélisme tensoriel agressif, pour écraser le TTFT d'un long prompt.</p>"
    },
    "decode-phase": {
      title: "Decode — la phase memory-bound",
      eyebrow: "2 · génération",
      body: "<p>Le decode produit un token à la fois. À chaque pas, il relit l'intégralité des poids du modèle <em>et</em> tout le KV cache accumulé depuis la HBM, pour ne sortir qu'un seul token. Le facteur limitant n'est pas le calcul mais la bande passante mémoire ; les unités tensor restent largement inutilisées.</p><p>Conséquence : le decode n'a pas besoin des GPU les plus puissants. Splitwise en fait l'argument central — le faire tourner sur du matériel moins cher et moins énergivore ne dégrade pas la qualité de service.</p>"
    },
    "kv-cache": {
      title: "Le KV cache — l'état partagé entre les deux phases",
      eyebrow: "le pont",
      body: "<p>Le KV cache est l'ensemble des vecteurs clé/valeur calculés pour chaque token. Il est <strong>écrit</strong> pendant le prefill et <strong>relu</strong> à chaque pas de decode. Sa taille croît linéairement avec la longueur du contexte ; pour un long contexte, il pèse plusieurs gigaoctets.</p><p>C'est précisément cet objet qui devra voyager du pool prefill au pool decode une fois les phases séparées (Schéma 5).</p>"
    },
    "interference": {
      title: "L'interférence en colocalisation",
      eyebrow: "le problème fondateur",
      body: "<p>Avec le continuous batching classique, prefills et decodes de requêtes différentes partagent le même lot GPU — et se gênent dans les deux sens. Un long prefill monopolise le calcul et <strong>bloque les decodes</strong> en cours (pic de TPOT). Inversement, intercaler des decodes memory-bound <strong>dilue l'utilisation compute</strong> du prefill.</p><p>L'interférence est structurelle : aucun ordonnancement ne la supprime, parce que les deux phases réclament des ressources antagonistes au même instant. C'est l'observation qui justifie toute la littérature 2024.</p>"
    }
  },
  "schema-02": {
    "ttft-slo": {
      title: "SLO TTFT — le budget de réactivité",
      eyebrow: "axe horizontal",
      body: "<p>Le <em>Time To First Token</em> mesure le délai avant le premier mot. C'est le SLO gouverné par le prefill. Un chat conversationnel l'exige serré (réactivité perçue) ; une génération de code long le tolère plus lâche.</p><p>Toute requête à droite du seuil viole ce SLO, même si elle finit par être servie.</p>"
    },
    "tpot-slo": {
      title: "SLO TPOT — le budget de fluidité",
      eyebrow: "axe vertical",
      body: "<p>Le <em>Time Per Output Token</em> mesure l'intervalle entre deux tokens successifs. C'est le SLO gouverné par le decode : il dit si le flux est fluide ou saccadé.</p><p>Les deux SLO sont indépendants : une application peut exiger un TPOT régulier tout en tolérant un TTFT lâche. C'est ce découplage qui interdit de raisonner par un seul chiffre de latence.</p>"
    },
    "goodput-zone": {
      title: "La zone de goodput",
      eyebrow: "les deux SLO respectés",
      body: "<p>Le goodput est le débit utile : le nombre de requêtes par seconde qui respectent <strong>simultanément</strong> leurs deux SLO. Seuls les points de ce rectangle inférieur-gauche comptent.</p><p>Raisonner en goodput force à budgéter la latence par phase — et dès lors, séparer prefill et decode cesse d'être une option pour devenir la conséquence logique. À SLO constant, DistServe sert 7,4× plus de requêtes, ou tient un SLO 12,6× plus serré.</p>"
    },
    "throughput-trap": {
      title: "Le piège du throughput",
      eyebrow: "pourquoi la métrique brute ment",
      body: "<p>Le throughput compte <em>tous</em> les tokens produits, qu'ils respectent ou non les SLO. Ici, 11 requêtes servies — mais 5 seulement dans la zone : throughput = 11, goodput = 5.</p><p>Optimiser le throughput pousse à empiler de gros lots, ce qui gonfle le chiffre brut tout en détruisant les latences individuelles. La métrique brute récompense exactement le mauvais comportement.</p>"
    }
  },
  "schema-03": {
    "kv-router": {
      title: "Le routeur KV-aware",
      eyebrow: "l'aiguilleur d'entrée",
      body: "<p>Chez NVIDIA Dynamo, le <code>PrefillRouter</code> choisit un worker prefill non par simple équilibrage de charge, mais par <em>KV-aware routing</em> : il privilégie un worker qui détient déjà, en cache, un préfixe partagé par la requête (un system prompt commun, des documents récupérés).</p><p>Le routage devient ainsi une décision de premier ordre : il détermine combien de calcul on évite par réutilisation de préfixe, avant même que le prefill ne commence.</p>"
    },
    "prefill-pool": {
      title: "Le pool prefill",
      eyebrow: "dimensionné pour le calcul",
      body: "<p>Un cluster dédié à l'ingestion des prompts. Comme la phase est compute-bound, il reçoit les GPU haut de gamme et un parallélisme tensoriel agressif pour minimiser le TTFT. Il calcule le KV cache complet, émet le premier token, puis passe la main.</p>"
    },
    "kv-transfer": {
      title: "Le transfert KV",
      eyebrow: "le tendon nouveau",
      body: "<p>Une fois le prefill terminé, le KV cache de la requête doit voyager de la VRAM du GPU prefill vers la VRAM du GPU decode. C'est le maillon inexistant dans l'architecture colocalisée — et le nouveau goulot potentiel.</p><p>NIXL le réalise de VRAM à VRAM, sans copie CPU, de façon non bloquante (Schéma 5). La règle : ce transfert doit rester négligeable devant la durée d'un pas de decode.</p>"
    },
    "decode-pool": {
      title: "Le pool decode",
      eyebrow: "dimensionné pour la mémoire",
      body: "<p>Un cluster séparé qui prend le relais. Comme la phase est memory-bound, il est dimensionné pour la bande passante mémoire et le débit agrégé : on y entasse un grand lot pour amortir la relecture des poids. C'est là que Splitwise place du matériel moins cher et moins énergivore.</p>"
    },
    "autoscale": {
      title: "Autoscaling séparé",
      eyebrow: "la vertu structurelle",
      body: "<p>Les deux pools n'ont aucune raison de scaler au même rythme. Un trafic riche en prompts longs (RAG) sature le prefill ; un trafic riche en générations longues (agent) sature le decode. Séparés, chacun dimensionne ses répliques indépendamment.</p><p>Dans llm-d, ce sont deux déploiements Kubernetes distincts, chacun avec son Horizontal Pod Autoscaler. Splitwise ajoute un troisième pool mixte élastique pour absorber les pics sans surdimensionner les deux autres.</p>"
    }
  },
  "schema-04": {
    "dimension-objectif": {
      title: "Dimension : la fonction-objectif",
      eyebrow: "ce que chaque système optimise",
      body: "<p>La clé de lecture de la matrice. Les trois écoles partagent le même geste — séparer les phases — mais n'optimisent pas la même chose : DistServe maximise le goodput, Splitwise minimise coût et puissance, Mooncake maximise le débit effectif sous SLO en échangeant du stockage contre du calcul.</p>"
    },
    "dimension-kvstore": {
      title: "Dimension : la gestion du KV cache",
      eyebrow: "transfert direct vs store désagrégé",
      body: "<p>DistServe et Splitwise transfèrent directement le cache entre pools. Mooncake va plus loin : il bâtit un <strong>KV store désagrégé</strong> qui récupère CPU, DRAM et SSD inutilisés de tout le cluster pour en faire une mémoire de cache multi-étages, pilotée par un ordonnanceur KVCache-centric. C'est ce pattern que reprennent Dynamo et llm-d.</p>"
    },
    "distserve": {
      title: "DistServe — l'école du goodput",
      eyebrow: "OSDI 2024 · académique",
      body: "<p>L'angle le plus pur. DistServe pose la désagrégation comme une co-optimisation : pour chaque phase, choisir indépendamment le parallélisme et l'allocation de ressources qui maximisent le goodput sous TTFT/TPOT.</p><p>Double apport : la métrique de goodput elle-même, et un placement qui exploite l'affinité réseau (NVLink) pour que le transfert KV reste négligeable. Résultat : 7,4× plus de requêtes, ou un SLO 12,6× plus serré. C'est l'école qui a fourni le vocabulaire.</p>"
    },
    "splitwise": {
      title: "Splitwise — l'école de l'efficacité",
      eyebrow: "ISCA 2024 · Microsoft",
      body: "<p>L'angle systèmes et énergie. Puisque le decode sous-utilise le calcul, le faire tourner sur des GPU haut de gamme gâche puissance et coût. Splitwise déploie deux pools <strong>hétérogènes</strong> — récent pour le prompt, moins cher pour la génération — plus un pool mixte élastique.</p><p>Gains chiffrés : 1,4× de débit à -20 % de coût, ou 2,35× à coût et puissance constants. C'est l'école qui a fait de la désagrégation un argument de TCO.</p>"
    },
    "mooncake": {
      title: "Mooncake — l'école KVCache-centric",
      eyebrow: "FAST 2025 · Moonshot / Kimi",
      body: "<p>L'angle production à grande échelle. Mooncake fait du KV cache l'objet central : autour des pools, un cache désagrégé récupère CPU/DRAM/SSD du cluster, piloté par un ordonnanceur KVCache-centric. La devise FAST '25 : <em>trading more storage for less computation</em>.</p><p>Résultats en production réelle : +525 % de throughput simulé en long contexte, +75 % de requêtes sous charge, sur des milliers de nœuds et 100 Md tokens/jour. La preuve que ça tient à l'échelle d'un service grand public.</p>"
    }
  },
  "schema-05": {
    "nvlink": {
      title: "Intra-nœud — NVLink / NVSwitch",
      eyebrow: "bande passante maximale",
      body: "<p>Le meilleur cas : prefill et decode sur des GPU d'un même serveur, reliés par NVLink/NVSwitch. Le transfert KV y est si rapide qu'il reste négligeable devant un pas de decode — la condition de viabilité de DistServe est trivialement satisfaite.</p><p>D'où l'algorithme de placement de DistServe : maximiser l'affinité réseau entre le worker prefill et le worker decode d'une même requête.</p>"
    },
    "rdma": {
      title: "Inter-nœud — RDMA / InfiniBand / RoCE",
      eyebrow: "vitesse de fil",
      body: "<p>Quand les pools s'étalent sur plusieurs serveurs, le cache traverse le réseau du datacenter. NIXL utilise le RDMA (accès direct à la mémoire distante sans passer par le CPU) sur InfiniBand, ou RoCE sur Ethernet via la couche UCX.</p><p>C'est le régime normal d'un déploiement à grande échelle : le transport y devient un vrai problème d'ingénierie, et tout l'enjeu est de rester sous le seuil de viabilité.</p>"
    },
    "nvme-object": {
      title: "Débordement — TCP / NVMe-oF / objet",
      eyebrow: "caches tièdes et froids",
      body: "<p>La queue de la hiérarchie : TCP en repli, NVMe-oF pour spiller le cache sur SSD distant, jusqu'au stockage objet S3-compatible pour les caches froids. Plus lent, mais bien moins cher que la VRAM.</p><p>C'est ce que Mooncake industrialise : une mémoire de cache à plusieurs étages où les caches chauds restent en HBM et les tièdes débordent vers le bas — le KV cache devient un objet persistant et adressable.</p>"
    },
    "layerwise": {
      title: "Transfert layer-by-layer, non bloquant",
      eyebrow: "recouvrir calcul et transport",
      body: "<p>Plutôt que d'attendre la fin de tout le prefill, on transfère le KV cache <strong>couche par couche</strong> : dès qu'une couche du Transformer a fini, son cache part vers le decode pendant que les couches suivantes calculent encore.</p><p>Le transfert se recouvre avec le calcul au lieu d'être séquencé, et il reste non bloquant — le forward du GPU continue à servir d'autres requêtes. C'est ce qui fait tenir la règle de viabilité même sur de longs contextes.</p>"
    }
  },
  "schema-06": {
    "papers-2024": {
      title: "2024 — les papiers fondateurs",
      eyebrow: "le laboratoire",
      body: "<p>En quelques mois, ISCA et OSDI accueillent DistServe (goodput), Splitwise (efficacité) et Sarathi-Serve (chunked prefill, l'alternative agrégée). Mooncake suit en juillet, premier déploiement à l'échelle d'un service grand public.</p><p>Tout le vocabulaire — goodput, phase splitting, KV store désagrégé, chunked prefill — est posé en une seule année.</p>"
    },
    "nixl-2025": {
      title: "2025 — le transport se standardise",
      eyebrow: "la couche réutilisable",
      body: "<p>NVIDIA open-source NIXL à GTC et bâtit Dynamo par-dessus vLLM et TensorRT-LLM. Le transfert KV cesse d'être un problème à résoudre pour chaque déploiement et devient une bibliothèque réutilisable.</p><p>La question bascule : non plus « comment transférer le cache » mais « comment orchestrer les pools ».</p>"
    },
    "cncf-2026": {
      title: "2026 — la consécration open-source",
      eyebrow: "24 mars 2026",
      body: "<p>Le projet llm-d entre au CNCF Sandbox : une pile Kubernetes-native où prefill et decode sont des pods de première classe scalés par HPA, branchés sur NIXL et la Gateway API Inference Extension. Porté par IBM, Red Hat, Google, CoreWeave, NVIDIA.</p><p><code>vLLM + llm-d + NIXL + Kubernetes</code> devient l'architecture de référence open-source, déjà en production chez Meta, LinkedIn, Mistral et Hugging Face. Là où Dynamo orchestre au-dessus de K8s, llm-d s'y intègre nativement.</p>"
    },
    "conditional": {
      title: "Désagrégation conditionnelle",
      eyebrow: "la troisième voie",
      body: "<p>Faut-il toujours désagréger ? Non. Sur un seul nœud à charge modérée, le chunked prefill suffit et évite la complexité de deux clusters. À grande échelle, sous SLO serrés et long contexte, la désagrégation gagne.</p><p>D'où la désagrégation conditionnelle : le routeur surveille la file ; sous le seuil, prefill et decode cohabitent en chunked prefill ; au-delà, le système bascule vers le pool dédié. Le bon design n'est pas « désagréger ou non » mais « savoir à partir de quand ».</p>"
    },
    "horizon": {
      title: "Horizon 2027-2028",
      eyebrow: "ce qui vient ensuite",
      body: "<p>Trois prolongements. <strong>Au-delà de deux pools</strong> : séparer aussi l'attention du reste, ou dédier des pools au KV store comme service. <strong>Le KV cache comme marché</strong> : du prefix caching facturé aujourd'hui vers un cache partagé, persistant et facturé entre tenants. <strong>La désagrégation pilotée par SLO</strong> : un contrôleur qui ajuste en temps réel le ratio des pools et le seuil conditionnel selon les SLO mesurés.</p><p>Le serving LLM finit d'emprunter les patterns vieux de trente ans des systèmes distribués.</p>"
    }
  }
}
