{
  "schema-01": {
    "prefill-compute-bound": {
      title: "Prefill — compute-bound",
      eyebrow: "phase 1 · lecture du prompt",
      body: "<p>Le prefill traite <strong>tous les tokens du prompt en parallèle</strong> : une cascade de GEMM denses qui sature les unités de calcul. Son intensité arithmétique est élevée — beaucoup d'opérations par octet lu — donc il vit à droite du <em>ridge point</em>, sur le plateau de calcul du roofline.</p><p>Conséquence : un prefill de quelques milliers de tokens approche le pic de FLOPS d'un H100. C'est la phase pour laquelle on veut du <strong>silicium à forts FLOPS</strong> et un fort parallélisme tensoriel.</p>"
    },
    "decode-memory-bound": {
      title: "Decode — memory-bound",
      eyebrow: "phase 2 · génération",
      body: "<p>Le decode génère <strong>un seul token à la fois</strong>, mais doit relire l'intégralité des poids du modèle <em>et</em> tout le KV cache accumulé à chaque pas. L'intensité arithmétique s'effondre : presque aucun calcul par octet transféré.</p><p>La phase est donc <strong>bornée par la bande passante mémoire (HBM)</strong> et laisse les unités de calcul oisives. Un GPU en decode gaspille la quasi-totalité des FLOPS pour lesquels on l'a payé : il lui faut de la <strong>bande passante et de la capacité mémoire</strong>, pas des FLOPS.</p>"
    },
    "ridge-point": {
      title: "Le ridge point",
      eyebrow: "frontière du roofline",
      body: "<p>Le <em>ridge point</em> sépare les deux régimes du modèle roofline : à gauche, la performance est plafonnée par la bande passante mémoire ; à droite, par le pic de calcul. Le decode tombe nettement à gauche, le prefill nettement à droite.</p><p>C'est la raison géométrique pour laquelle <strong>aucun réglage matériel unique</strong> ne peut être optimal pour les deux phases à la fois — et donc le fondement même de l'argument de désagrégation.</p>"
    },
    "interference-zone": {
      title: "Zone d'interférence",
      eyebrow: "le coût de la colocalisation",
      body: "<p>Quand prefill et decode partagent le même batch sur le même GPU, un long prefill <strong>monopolise les unités de calcul</strong> pendant des dizaines de millisecondes — et fige tous les decodes en cours.</p><p>Le symptôme mesurable : des <strong>pics de TPOT</strong> (latence inter-token) hautement variables. DistServe montre qu'avec interférence, serrer simultanément un SLO de TTFT et un SLO de TPOT devient quasi impossible<sup>[1]</sup>.</p>"
    }
  },
  "schema-02": {
    "router-scheduler": {
      title: "Routeur / ordonnanceur",
      eyebrow: "entrée du pipeline",
      body: "<p>Le routeur reçoit chaque requête et choisit une instance de prefill, puis pilote le passage vers le decode. C'est lui qui maintient le <strong>ratio P:D</strong> (nœuds de prefill vs decode) en fonction du profil de charge.</p><p>Il intègre un signal de <em>feedback SLO</em> : en mesurant TTFT et TPOT en continu, il rééquilibre dynamiquement la taille des deux pools. NVIDIA Dynamo y ajoute un routage <em>KV-aware</em> qui évite de recalculer un préfixe déjà en cache<sup>[5]</sup>.</p>"
    },
    "prefill-pool": {
      title: "Pool de prefill",
      eyebrow: "compute-bound",
      body: "<p>Le pool de prefill calcule le KV cache du prompt entier — phase compute-bound. On le dimensionne avec du <strong>matériel à forts FLOPS</strong> (H100 SXM5, B200) et un <strong>fort parallélisme tensoriel</strong> pour minimiser le TTFT.</p><p>Découplé du decode, ce pool peut être scalé indépendamment : une charge RAG (longs prompts) en réclame davantage qu'une charge agent (prompts courts, longues réponses).</p>"
    },
    "kv-transfer": {
      title: "Transfert du KV cache",
      eyebrow: "la jointure critique",
      body: "<p>Le KV cache calculé par le prefill (de 0,1 à plusieurs Go par requête) doit rejoindre le pool de decode. Le réseau TCP/IP est trop lent — il faut plusieurs Go/s — donc on utilise <strong>RDMA (InfiniBand), NVLink ou NIXL</strong>, qui laissent un GPU lire la VRAM d'un autre sans passer par le CPU.</p><p>L'astuce clé : le transfert <strong>pipeliné couche par couche</strong>, qui recouvre le calcul du prefill et l'I/O réseau pour cacher la latence<sup>[1]</sup><sup>[5]</sup>.</p>"
    },
    "decode-pool": {
      title: "Pool de decode",
      eyebrow: "memory-bound",
      body: "<p>Le pool de decode génère la réponse token par token — phase memory-bound. On le dimensionne avec du matériel à <strong>forte bande passante et grande capacité mémoire</strong> (H200 et ses 141 Go de HBM3e) et de <strong>gros batchs</strong> pour amortir la relecture des poids.</p><p>C'est ce que verrouillait la colocalisation : ici, le decode tourne sur le silicium qui lui convient, sans gaspiller les FLOPS d'un H100<sup>[2]</sup>.</p>"
    },
    "slo-feedback": {
      title: "Boucle de feedback SLO",
      eyebrow: "pilotage dynamique",
      body: "<p>L'ordonnanceur mesure en continu le <strong>TTFT</strong> (gouverné par le prefill) et le <strong>TPOT</strong> (gouverné par le decode), et ajuste le <strong>ratio P:D</strong> en conséquence.</p><p>Exemple de production : LMSYS sert DeepSeek-R1 avec un pool de <strong>3 nœuds de prefill pour 9 nœuds de decode</strong>, un ratio dérivé de la distribution réelle des longueurs entrée/sortie<sup>[8]</sup>. Le bon ratio n'est jamais universel.</p>"
    }
  },
  "schema-03": {
    "nixl-vram": {
      title: "Transfert VRAM ↔ VRAM (NIXL)",
      eyebrow: "le chemin chaud",
      body: "<p>Le chemin le plus rapide : transférer le KV directement de la VRAM du nœud de prefill vers la VRAM du nœud de decode. NVIDIA Dynamo le réalise avec <strong>NIXL</strong>, de façon <strong>non bloquante</strong> — les passes avant du GPU continuent de servir d'autres requêtes pendant le transfert<sup>[5]</sup><sup>[6]</sup>.</p><p>Exigence : plus de 4,5 Go/s de bande passante effective, d'où RDMA ou NVLink obligatoires entre les deux pools.</p>"
    },
    "dram-ssd-pool": {
      title: "Pool KV distribué (DRAM / SSD)",
      eyebrow: "l'idée Mooncake",
      body: "<p>Mooncake étend le cache au-delà de la VRAM : il agrège la <strong>CPU, la DRAM et le SSD sous-utilisés</strong> de tout le cluster en un pool de KV cache unique, hiérarchisé du plus rapide/petit (VRAM) au plus lent/vaste (SSD).</p><p>Cela transforme la capacité de cache d'une contrainte locale en ressource globale — et permet de conserver bien plus de préfixes réutilisables qu'une seule carte ne le pourrait<sup>[3]</sup><sup>[4]</sup>.</p>"
    },
    "pipelined-transfer": {
      title: "Transfert pipeliné couche par couche",
      eyebrow: "cacher la latence",
      body: "<p>Plutôt que d'attendre la fin du prefill complet, on envoie le KV des <strong>premières couches</strong> vers le nœud de decode pendant que les <strong>dernières couches</strong> sont encore en cours de calcul sur le nœud de prefill.</p><p>Ce recouvrement calcul / I/O réseau réduit la latence effective de transfert presque à zéro quand le prompt est long — et explique pourquoi la désagrégation gagne sur les longs prompts mais pas sur les courts<sup>[1]</sup>.</p>"
    },
    "prefix-reuse": {
      title: "Réutilisation de préfixe",
      eyebrow: "le cache qui paie",
      body: "<p>Un prompt système partagé par des milliers de requêtes n'a besoin d'être calculé <strong>qu'une seule fois</strong> : son KV cache sert ensuite à toutes. Le pool de cache global de Mooncake rend cette réutilisation possible à l'échelle de la flotte.</p><p>Gain mesuré sur traces réelles : <strong>+59 % à +498 %</strong> de capacité effective<sup>[3]</sup>. Le calcul n'est plus roi — l'octet de cache l'est.</p>"
    }
  },
  "schema-04": {
    "slo-box": {
      title: "La boîte SLO",
      eyebrow: "le seul espace qui compte",
      body: "<p>La boîte SLO est l'intersection des deux contraintes : <strong>TTFT &lt; seuil</strong> ET <strong>TPOT &lt; seuil</strong>. Une requête n'a de valeur que si elle tombe dans cette boîte.</p><p>Le <strong>goodput</strong> est le nombre de requêtes servies dans la boîte par seconde — à distinguer du débit brut, qui compte aussi les tokens produits hors contrat de latence, donc sans valeur pour l'utilisateur<sup>[1]</sup><sup>[12]</sup>.</p>"
    },
    "colocated-curve": {
      title: "Courbe colocalisée",
      eyebrow: "sort vite de la boîte",
      body: "<p>Sous colocalisation, l'interférence prefill→decode fait grimper simultanément le TTFT et le TPOT dès que la charge augmente. La courbe <strong>sort rapidement de la boîte SLO</strong> : au-delà d'un point, chaque requête supplémentaire viole un des deux seuils.</p><p>Un débit agrégé flatteur peut masquer ce phénomène — d'où la nécessité de mesurer le goodput, pas le throughput.</p>"
    },
    "disagg-curve": {
      title: "Courbe désagrégée",
      eyebrow: "reste dans la boîte",
      body: "<p>Avec des pools séparés, on serre le TTFT en ajustant le pool de prefill et le TPOT en ajustant le pool de decode, <strong>sans que l'un sabote l'autre</strong>. La courbe reste plus longtemps dans la boîte SLO.</p><p>Résultat : DistServe sert <strong>7,4× plus de requêtes</strong> dans la boîte, ou tient un SLO 12,6× plus serré, à matériel égal<sup>[1]</sup>.</p>"
    },
    "ttft-axis": {
      title: "Axe TTFT",
      eyebrow: "gouverné par le prefill",
      body: "<p>Le <strong>Time To First Token</strong> mesure le délai jusqu'au premier token émis. Il est dominé par la phase de prefill : taille du prompt, FLOPS disponibles, file d'attente.</p><p>Dans un système désagrégé, on le pilote en dimensionnant le pool de prefill et son parallélisme tensoriel.</p>"
    },
    "tpot-axis": {
      title: "Axe TPOT",
      eyebrow: "gouverné par le decode",
      body: "<p>Le <strong>Time Per Output Token</strong> (ou ITL) mesure le délai moyen entre deux tokens générés — il gouverne la fluidité perçue du streaming. Il est dominé par la phase de decode : bande passante mémoire, taille de batch.</p><p>On le pilote en dimensionnant le pool de decode et la capacité mémoire de son matériel.</p>"
    }
  },
  "schema-05": {
    "chunked-quadrant": {
      title: "Chunked prefill (intra-instance)",
      eyebrow: "Sarathi-Serve",
      body: "<p>Plutôt que d'exiler le prefill, Sarathi-Serve le <strong>découpe en morceaux</strong> de taille proche et les <strong>interleave</strong> avec les decodes en cours dans des batchs hybrides. Aucun decode n'est plus bloqué : l'ordonnancement devient <em>stall-free</em>.</p><p>Avantage : <strong>aucun transfert réseau</strong>, idéal à petite échelle ou sur instance unique. Limite : le même GPU fait toujours les deux phases, avec le même parallélisme et le même matériel<sup>[7]</sup>.</p>"
    },
    "disagg-quadrant": {
      title: "Désagrégation pleine",
      eyebrow: "DistServe, Mooncake",
      body: "<p>Deux pools physiquement distincts, reliés par un transfert de KV cache. La désagrégation <strong>découple tout</strong> : parallélisme, matériel, dimensionnement — au prix du transfert.</p><p>Elle brille à <strong>grande échelle</strong>, sur <strong>longs prompts</strong> (où le transfert se recouvre), avec du <strong>matériel hétérogène</strong>. C'est le quadrant des grands déploiements de production<sup>[1]</sup><sup>[3]</sup>.</p>"
    },
    "hybrid-zone": {
      title: "Zones hybrides",
      eyebrow: "le meilleur des deux",
      body: "<p>Le choix n'est pas binaire. Beaucoup de systèmes 2026 combinent les deux : <strong>chunked prefill à l'intérieur</strong> de chaque pool de prefill, et <strong>désagrégation entre</strong> les pools.</p><p>Hors diagonale, le bon réglage dépend du coût relatif du transfert : sur petits prompts, le surcoût de transfert (TTFT ×1,9 mesuré sur MI300X) peut pencher vers le multiplexage intra-instance<sup>[10]</sup>.</p>"
    },
    "crossover": {
      title: "La ligne de bascule",
      eyebrow: "trois variables",
      body: "<p>Le point où désagréger devient rentable dépend de trois variables : l'<strong>échelle</strong> du déploiement (nombre de GPU), la <strong>longueur des prompts</strong> (plus longs = transfert mieux recouvert = désagrégation gagnante), et l'<strong>hétérogénéité du parc</strong> (matériel mixte = spécialisation par phase rentable).</p><p>Sous la ligne : multiplexer. Au-dessus : désagréger. La frontière se déplace avec chaque génération d'interconnexion plus rapide.</p>"
    }
  },
  "schema-06": {
    "distserve": {
      title: "DistServe",
      eyebrow: "UCSD / PKU · OSDI'24",
      body: "<p>Le papier fondateur. Co-optimise, pour chaque phase, l'allocation de ressources <em>et</em> le plan de parallélisme, puis place les phases selon la bande passante du cluster. Première formalisation du <strong>goodput</strong> comme objectif.</p><p>Transfert pipeliné couche par couche. Gains : 7,4× requêtes / 12,6× SLO plus serré<sup>[1]</sup>.</p>"
    },
    "splitwise": {
      title: "Splitwise",
      eyebrow: "Microsoft · ISCA'24",
      body: "<p>L'argument coût/énergie. Caractérise les deux phases (compute vs memory-bound) et affecte à chacune le <strong>matériel hétérogène</strong> le plus adapté, transfert sur back-plane InfiniBand.</p><p>Gain : 2,35× de débit à coût et puissance constants, ou 1,4× à 20 % de coût en moins face à une baseline 100 % H100<sup>[2]</sup>.</p>"
    },
    "mooncake": {
      title: "Mooncake",
      eyebrow: "Moonshot / Kimi · FAST'25",
      body: "<p>L'architecture <strong>KVCache-centric</strong>, Best Paper FAST 2025. Construit un pool de KV cache distribué sur la DRAM et le SSD sous-utilisés du cluster ; ordonnanceur centré cache, réutilisation de préfixe à l'échelle.</p><p>Plateforme de production de Kimi : +525 % de débit en simulation, +59 % à +498 % sur traces réelles<sup>[3]</sup><sup>[4]</sup>.</p>"
    },
    "dynamo": {
      title: "NVIDIA Dynamo",
      eyebrow: "NVIDIA · 2025",
      body: "<p>Le framework d'inférence désagrégée de NVIDIA. Transfert <strong>NIXL</strong> VRAM↔VRAM non bloquant, routage <em>KV-aware</em> pour éviter le recalcul de préfixe, ordonnancement dynamique des GPU.</p><p>Jusqu'à 30× de débit sur DeepSeek-R1 / Blackwell ; compatible vLLM, SGLang, TensorRT-LLM<sup>[5]</sup><sup>[6]</sup>.</p>"
    },
    "sglang-vllm": {
      title: "SGLang / vLLM (llm-d)",
      eyebrow: "communauté · 2025",
      body: "<p>La désagrégation est devenue un socle open-source. SGLang et vLLM (via llm-d) supportent le P/D désagrégé avec backends Mooncake / NIXL, déployés à 96-128 GPU.</p><p>Production : Kimi K2 sur 128 H200 (224k/288k tok/s), DeepSeek-R1 sur 96 H100 (52,3k in / 22,3k out par nœud), inférence désagrégée managée sur AWS<sup>[8]</sup><sup>[9]</sup><sup>[10]</sup>.</p>"
    }
  },
  "schema-07": {
    "attention-disagg": {
      title: "Désagrégation à grain fin",
      eyebrow: "front 1 · granularité",
      body: "<p>La granularité descend de la phase vers l'<strong>opérateur</strong>. <em>Adrenaline</em> désagrège l'attention elle-même — la sous-opération memory-bound — pour récupérer la capacité de calcul oisive du decode et booster l'utilisation<sup>[11]</sup>.</p><p>D'autres travaux (PPD) distinguent les prefills <em>eux-mêmes</em> : premier tour vs tour multi-tour avec préfixe déjà en cache. La désagrégation devient récursive.</p>"
    },
    "cross-vendor": {
      title: "Matériel cross-vendor",
      eyebrow: "front 2 · matériel",
      body: "<p>Le découplage matériel par phase ouvre la porte aux <strong>parcs mixtes</strong> : prefill sur NVIDIA H100, decode sur AMD MI300X, le KV cache franchissant la frontière du fabricant.</p><p>Chaque phase atterrit sur le silicium le plus rentable, indépendamment du vendeur — ce qui érode l'avantage de verrouillage d'un fournisseur unique<sup>[10]</sup><sup>[11]</sup>.</p>"
    },
    "global-cache": {
      title: "KVCache global / as-a-service",
      eyebrow: "front 3 · cache",
      body: "<p>La logique de Mooncake — un pool de cache distribué sur tout le cluster — tend vers un <strong>KVCache-as-a-service</strong> : un cache global, partagé entre modèles et requêtes, avec réutilisation de préfixe à l'échelle de la flotte.</p><p>Le cache devient une couche d'infrastructure de premier ordre, gérée, facturée et optimisée pour elle-même<sup>[3]</sup><sup>[4]</sup>.</p>"
    },
    "moe-ep": {
      title: "Couplage MoE / expert-parallel",
      eyebrow: "front 4 · modèle",
      body: "<p>Les déploiements 2025-2026 (DeepSeek, Kimi K2) montrent que la désagrégation P/D et le <strong>parallélisme d'experts</strong> à grande échelle se renforcent : séparer les phases permet d'appliquer à chacune le schéma de distribution d'experts qui lui convient.</p><p>C'est la combinaison qui débloque les débits records de production observés sur 96-128 GPU<sup>[8]</sup><sup>[9]</sup>.</p>"
    }
  }
}
