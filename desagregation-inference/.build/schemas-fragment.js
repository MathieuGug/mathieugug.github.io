{
  "schema-01": {
    "prefill-phase": {
      title: "Prefill — compute-bound",
      eyebrow: "1 · lecture du prompt",
      body: "<p>Le prefill ingère le prompt complet et traite <strong>tous les tokens d'entrée en parallèle</strong>, en une seule passe avant. Il calcule, pour chaque couche d'attention, les vecteurs <em>key</em> et <em>value</em> de chaque token et les écrit dans le <strong>KV cache</strong>.</p><p>Comme le calcul porte sur N tokens d'un coup, la phase sature les unités de calcul du GPU : elle est <em>compute-bound</em>. Sa métrique de SLO est le <strong>TTFT</strong> (time-to-first-token) — le délai avant le premier mot. C'est la phase qu'on veut paralléliser agressivement (tensoriel, gros batch).</p>"
    },
    "decode-phase": {
      title: "Decode — memory-bandwidth-bound",
      eyebrow: "2 · génération",
      body: "<p>Le decode génère la réponse <strong>un token à la fois</strong>, de façon autorégressive. À chaque pas, le modèle ne calcule que pour un seul nouveau token, mais doit <strong>relire tout le KV cache</strong> accumulé.</p><p>Le calcul est minuscule, le volume de données déplacé depuis la mémoire est énorme : la phase est <em>memory-bandwidth-bound</em>, et les unités de calcul du GPU restent largement oisives. Sa métrique de SLO est le <strong>TPOT / ITL</strong> (inter-token latency) — la fluidité du flux. On veut ici beaucoup de capacité KV et un batch decode large.</p>"
    },
    "kv-cache-handoff": {
      title: "Le KV cache, ce qui circule",
      eyebrow: "3 · la charnière",
      body: "<p>Le KV cache est <strong>produit</strong> par le prefill et <strong>consommé</strong> par le decode. Dans un moteur colocalisé, il reste sur place. Dans une architecture désagrégée, il devient l'objet qu'on <strong>transfère</strong> d'un pool à l'autre (cf. Schéma 2), qu'on <strong>met en cache</strong> et qu'on <strong>mutualise</strong> (cf. Schéma 3).</p><p>C'est ce déplacement du KV cache au centre de l'architecture qui structure toute la suite : sa gestion devient le principal levier de débit et de marge.</p>"
    },
    "roofline-asymmetry": {
      title: "L'asymétrie sur la roofline",
      eyebrow: "4 · pourquoi séparer",
      body: "<p>Sur le modèle <em>roofline</em> (débit en fonction de l'intensité arithmétique, en FLOP/octet), les deux phases tombent dans des régimes opposés : le <strong>prefill plafonne sur le toit du compute</strong>, le <strong>decode rampe le long de la pente mémoire</strong>.</p><p>Un GPU réglé pour le prefill (gros batch, parallélisme tensoriel) est mal réglé pour le decode, et réciproquement. Un moteur unique ne peut donc optimiser ni le TTFT ni le TPOT : il négocie un compromis médiocre. D'où l'idée fondatrice de la désagrégation — donner à chaque régime son propre matériel.</p>"
    }
  },
  "schema-02": {
    "colocated-engine": {
      title: "Le moteur colocalisé (hier)",
      eyebrow: "le point de départ",
      body: "<p>L'architecture historique : un seul pool de GPU fait à la fois le prefill et le decode, via le <em>continuous batching</em> (Orca, 2022). Simple, mais elle souffre de l'<strong>interférence prefill/decode</strong> — un prefill long gèle les decodes en cours.</p><p>Pire, elle <strong>couple de force</strong> le plan de parallélisme et l'allocation de ressources : un seul réglage doit servir deux régimes antagonistes. C'est le péché du monolithe que la désagrégation corrige.</p>"
    },
    "smart-router": {
      title: "Routeur conscient du cache",
      eyebrow: "l'aiguillage",
      body: "<p>En tête de la flotte, un routeur dirige chaque requête. Au-delà de l'équilibrage de charge, il pratique le <strong>KV-aware routing</strong> : il choisit le <em>worker</em> prefill selon un <strong>score de recouvrement de cache</strong>, pour réutiliser un préfixe déjà en mémoire plutôt que de le recalculer.</p><p>C'est la brique commune à NVIDIA Dynamo et llm-d. Le routage cesse d'être une question de charge pure pour devenir une question de <strong>localité de cache</strong>.</p>"
    },
    "prefill-pool": {
      title: "Pool prefill",
      eyebrow: "spécialisé compute",
      body: "<p>Un ensemble de GPU dédié exclusivement au prefill. Comme il n'a qu'un régime à servir, on l'optimise sans compromis : gros <em>batches</em>, parallélisme tensoriel agressif, voire un type de GPU choisi pour son débit de calcul.</p><p>Sa cible : minimiser le <strong>TTFT</strong>. Il produit le KV cache, qu'il transmet ensuite au pool decode.</p>"
    },
    "decode-pool": {
      title: "Pool decode",
      eyebrow: "spécialisé mémoire",
      body: "<p>Un ensemble de GPU dédié exclusivement au decode. On l'optimise pour la <strong>capacité mémoire et la bande passante</strong> : grande réserve de KV cache, batch decode large pour amortir le coût mémoire sur de nombreuses requêtes simultanées.</p><p>Sa cible : minimiser le <strong>TPOT / ITL</strong>. Il consomme le KV cache reçu du pool prefill et génère la réponse token par token.</p>"
    },
    "kv-transfer": {
      title: "Transfert du KV cache",
      eyebrow: "le maillon critique",
      body: "<p>Le coût propre de la désagrégation : déplacer le KV cache du pool prefill vers le pool decode. Il transite par les interconnexions rapides — <strong>NVLink</strong> intra-nœud, <strong>RDMA</strong> inter-nœuds — via des bibliothèques comme <strong>NIXL</strong> (NVIDIA).</p><p>La clé est que le transfert soit <strong>non bloquant</strong> : les passes GPU continuent de servir d'autres requêtes pendant qu'il s'effectue. C'est ce coût de transfert qui fixe le seuil de rentabilité de la désagrégation (cf. « Beyond the Buzz »).</p>"
    }
  },
  "schema-03": {
    "paging": {
      title: "Paging — PagedAttention",
      eyebrow: "1 · la fondation",
      body: "<p>Inspiré de la mémoire virtuelle des systèmes d'exploitation, PagedAttention (vLLM, SOSP 2023) découpe le KV cache en <strong>blocs de taille fixe</strong>, alloués à la demande et non contigus en mémoire.</p><p>Cela supprime la fragmentation interne et externe : le gaspillage mémoire passe de <strong>60-80 % à moins de 4 %</strong>, ce qui débloque des batches bien plus gros et un débit <strong>2 à 4×</strong> supérieur. C'est devenu le socle de facto de tous les moteurs modernes — aucun système sérieux ne s'en passe en 2026.</p>"
    },
    "prefix-sharing": {
      title: "Partage de préfixes — RadixAttention",
      eyebrow: "2 · la mutualisation",
      body: "<p>Beaucoup de requêtes partagent un préfixe : même <em>system prompt</em>, mêmes exemples few-shot, mêmes documents en contexte. RadixAttention (SGLang) organise les caches dans un <strong>arbre radix</strong> où tout préfixe commun n'est calculé et stocké <strong>qu'une seule fois</strong>.</p><p>La réutilisation est automatique : chaque requête qui partage le préfixe le retrouve sans recalcul. Sur les charges à fort recouvrement — agents, chat à long system prompt, RAG — le gain en débit se compte en multiples.</p>"
    },
    "offloading": {
      title: "Offloading hiérarchique",
      eyebrow: "3 · l'étagement",
      body: "<p>La VRAM (HBM) est rare et chère. Plutôt que d'évincer un cache devenu inactif, on le <strong>rétrograde</strong> vers la DRAM CPU, puis le SSD — et on le <strong>promeut</strong> à nouveau s'il redevient utile.</p><p>Des bibliothèques comme <strong>LMCache</strong> industrialisent cette hiérarchie HBM → DRAM → SSD. Tout le cluster devient une mémoire à plusieurs étages : rare et rapide en haut, abondant et lent en bas. Le cache survit ainsi bien au-delà de la capacité VRAM d'un seul GPU.</p>"
    },
    "disaggregated-pool": {
      title: "Pool désagrégé global — Mooncake",
      eyebrow: "4 · l'aboutissement",
      body: "<p>L'étape ultime : un <strong>cache global mutualisé</strong> entre tous les nœuds, adressable par n'importe quel <em>worker</em>, construit sur la DRAM et les SSD inutilisés du cluster. Le parti pris de Mooncake : « <em>trading more storage for less computation</em> ».</p><p>Le cache cesse d'appartenir à une requête ou à un GPU : il devient une ressource partagée du cluster. Le <em>scheduler</em> raisonne alors en <strong>localité de cache</strong> autant qu'en charge de calcul. C'est ce qui permet à Kimi de servir +75 % de requêtes.</p>"
    }
  },
  "schema-04": {
    "vllm": {
      title: "vLLM",
      eyebrow: "moteur",
      body: "<p>Le moteur de référence open-source, né de PagedAttention (SOSP 2023). KV cache pagé natif, partage de préfixes, chunked prefill par défaut. La désagrégation P/D y est <strong>expérimentale</strong> (intégration en cours avec Mooncake et Dynamo).</p><p>C'est la brique d'exécution sous la plupart des orchestrateurs.</p>"
    },
    "sglang": {
      title: "SGLang",
      eyebrow: "moteur",
      body: "<p>Moteur centré sur l'exécution de programmes LM structurés, célèbre pour <strong>RadixAttention</strong> (partage automatique de préfixes via arbre radix). KV pagé, chunked prefill, offloading partiel.</p><p>Comme vLLM, la désagrégation à grande échelle passe par une couche d'orchestration au-dessus.</p>"
    },
    "distserve": {
      title: "DistServe",
      eyebrow: "recherche · OSDI 2024",
      body: "<p>Le papier fondateur de la désagrégation prefill/decode : pools physiquement séparés, parallélisme co-optimisé par phase. <strong>7,4× de requêtes ou un SLO 12,6× plus serré</strong>.</p><p>C'est un prototype de recherche : il ne porte pas le paging avancé ni l'offloading ; son héritage vit aujourd'hui dans Dynamo et llm-d.</p>"
    },
    "mooncake": {
      title: "Mooncake",
      eyebrow: "Moonshot · prod Kimi",
      body: "<p>L'architecture désagrégée la plus complète déployée en production (Best Paper FAST 2025). Désagrégation P/D <strong>plus</strong> un cache global mutualisé sur DRAM/SSD, paging et partage de préfixes.</p><p>Sert Kimi avec +75 % de requêtes en charge réelle. La preuve que la désagrégation tient à l'échelle d'un service grand public.</p>"
    },
    "dynamo": {
      title: "NVIDIA Dynamo",
      eyebrow: "orchestrateur · 2025",
      body: "<p>Orchestrateur multi-nœud qui se place <strong>au-dessus</strong> des moteurs (vLLM, SGLang, TensorRT-LLM). Il coordonne routage KV-aware, désagrégation, transfert KV non bloquant (NIXL), tiering mémoire et autoscaling.</p><p>Le paging et le partage de préfixes sont <strong>délégués aux moteurs</strong> sous-jacents ; Dynamo apporte la couche distribuée. Pièce maîtresse de la standardisation en cours.</p>"
    },
    "llm-d": {
      title: "llm-d",
      eyebrow: "Red Hat/Google · K8s",
      body: "<p>Le pendant <strong>cloud-native</strong> de Dynamo : désagrégation et gestion de cache portées dans l'écosystème Kubernetes, avec intégration annoncée du Dynamo Planner et du KV Cache Manager.</p><p>Encore émergent en maturité, mais c'est la voie qui rend la désagrégation déployable et autoscalable comme n'importe quelle charge conteneurisée.</p>"
    }
  },
  "schema-05": {
    "slo-regime": {
      title: "Axe vertical — sévérité du SLO",
      eyebrow: "la contrainte",
      body: "<p>Plus le SLO est <strong>strict</strong> sur les deux métriques à la fois (TTFT <em>et</em> TPOT), plus il devient impossible de les tenir avec un réglage de compromis unique. C'est là que la désagrégation, qui optimise chaque phase séparément, prend l'avantage.</p><p>Sous des SLO lâches, le compromis colocalisé du chunked prefill suffit largement.</p>"
    },
    "interference-axis": {
      title: "Axe horizontal — volume & interférence",
      eyebrow: "l'échelle",
      body: "<p>Plus le volume de charge monte et plus les profils prefill/decode sont déséquilibrés (prompts longs, réponses courtes ou l'inverse), plus le <strong>coût de l'interférence</strong> colocalisée grimpe.</p><p>À petite échelle, l'interférence est négligeable et le coût de transfert du KV cache ne se justifie pas. À grande échelle, l'interférence devient le goulot dominant — et la désagrégation l'élimine.</p>"
    },
    "chunked-prefill": {
      title: "Chunked prefill (Sarathi-Serve)",
      eyebrow: "la voie colocalisée",
      body: "<p>On garde prefill et decode sur les mêmes GPU, mais on <strong>découpe le prefill en chunks</strong> de taille quasi égale et on bâtit des batches « stall-free » qui ne suspendent jamais les decodes en cours.</p><p>Gain : 2,6× à 5,6× de capacité selon le modèle. Atouts : <strong>un seul pool</strong>, simplicité de déploiement, pas de coût de transfert. C'est le défaut de vLLM et SGLang modernes — le bon choix tant qu'on n'est pas à très grande échelle.</p>"
    },
    "disaggregation": {
      title: "Désagrégation P/D",
      eyebrow: "la voie séparée",
      body: "<p>On sépare physiquement les phases sur des pools distincts (DistServe, Splitwise, Mooncake), reliés par un transfert de KV cache. Chaque pool est optimisé sans compromis.</p><p>Gain : 7,4× de requêtes ou SLO 12,6× plus serré. Coût : le <strong>transfert du KV cache</strong> et une infrastructure plus complexe. Rentable au-dessus d'un seuil d'échelle et pour les SLO doubles — la conclusion nuancée de « Beyond the Buzz ».</p>"
    }
  },
  "schema-06": {
    "era-batching": {
      title: "Ère 1 — Batching continu (2022)",
      eyebrow: "la fondation",
      body: "<p>Orca (OSDI 2022) introduit le <strong>continuous / iteration-level batching</strong> : on injecte de nouvelles requêtes dans le batch à chaque itération plutôt qu'en attendant la fin des précédentes. Bond de débit majeur.</p><p>Mais cette colocalisation crée l'<strong>interférence prefill/decode</strong> — le problème que les ères suivantes vont chercher à résoudre.</p>"
    },
    "era-paging": {
      title: "Ère 2 — Paging du KV cache (2023)",
      eyebrow: "le cache devient gérable",
      body: "<p>PagedAttention (vLLM) et RadixAttention (SGLang) font du KV cache une <strong>structure de données gérable</strong> : paging pour supprimer la fragmentation (gaspillage &lt; 4 %), arbre radix pour partager les préfixes.</p><p>Le cache cesse d'être un bloc monolithique opaque et devient adressable, partageable, réutilisable. Prérequis indispensable de tout ce qui suit.</p>"
    },
    "era-disaggregation": {
      title: "Ère 3 — Désagrégation (2024-2025)",
      eyebrow: "les phases se séparent",
      body: "<p>DistServe et Splitwise (2024) démontrent la séparation physique prefill/decode ; Sarathi-Serve propose l'alternative chunked prefill. Puis Mooncake, Dynamo et llm-d (2025) industrialisent : pools spécialisés, KV-aware routing, transfert NIXL.</p><p>DeepSeek publie en février 2025 les <strong>chiffres économiques</strong> de sa flotte désagrégée — marge théorique 545 % —, faisant entrer la désagrégation dans le langage du compte de résultat.</p>"
    },
    "era-cache-market": {
      title: "Ère 4 — Le marché du cache (2026-2028)",
      eyebrow: "le cache, un actif",
      body: "<p>La trajectoire : le <strong>KV-cache-as-a-service</strong> (cache mutualisé persistant, facturé à la rétention et au taux de hit) ; la désagrégation plus fine — <strong>intra-GPU</strong> (Nexus) et <strong>hétérogène</strong> (HexGen-2) ; la convergence des standards de transfert (NIXL) et de routage ; et le couplage avec le decode spéculatif.</p><p>Le fil rouge : le KV cache passe d'objet central à <strong>actif facturable</strong>. La prochaine bataille se jouera sur qui possède le cache.</p>"
    }
  }
}
