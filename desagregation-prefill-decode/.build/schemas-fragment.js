{
  "schema-01": {
    "decode": {
      title: "Decode — collé au mur mémoire",
      eyebrow: "memory-bound",
      body: "<p>Le decode génère un token à la fois. À chaque pas, il relit l'intégralité du KV cache déjà calculé pour faire l'attention : c'est une multiplication matrice × vecteur, peu d'opérations mais une lecture massive de mémoire.</p><p>Son intensité arithmétique est faible — il sature la <em>bande passante</em> de la HBM, pas le calcul. Sur le roofline, il vit sur la pente de gauche. C'est lui qui gouverne le TPOT (temps par token), donc la fluidité ressentie du flux de texte.</p>"
    },
    "prefill": {
      title: "Prefill — sur le plateau du calcul",
      eyebrow: "compute-bound",
      body: "<p>Le prefill traite tout le prompt en un seul passage parallèle (tous les tokens sont connus d'avance). C'est une grosse multiplication matrice × matrice : beaucoup d'opérations flottantes par octet lu.</p><p>Son intensité arithmétique est élevée — il sature les <em>tensor cores</em>, pas la mémoire. Sur le roofline, il vit sur le plateau de droite. Son temps croît avec la longueur du prompt et détermine le TTFT (délai du premier token).</p>"
    },
    "ridge": {
      title: "Le point d'inflexion",
      eyebrow: "intensité critique",
      body: "<p>Le coude du roofline marque l'intensité arithmétique à partir de laquelle on bascule du régime memory-bound (à gauche, sous la pente) au régime compute-bound (à droite, sous le plateau).</p><p>Le decode et le prefill se trouvent de part et d'autre de ce point, séparés de plus d'un ordre de grandeur. C'est la raison profonde pour laquelle un seul réglage de batch ne peut convenir aux deux : trop petit, il gaspille le calcul en prefill ; trop gros, il fait exploser la latence en decode.</p>"
    },
    "ceiling": {
      title: "Les deux plafonds matériels",
      eyebrow: "FLOPS · bande passante",
      body: "<p>Le plateau horizontal est le pic de calcul du GPU (FLOPS) ; la pente est sa bande passante mémoire (HBM). Tout point sous ce toit est atteignable, tout point au-dessus est physiquement impossible.</p><p>Un GPU optimal pour le prefill maximise les FLOPS ; un GPU optimal pour le decode maximise la bande passante et la capacité HBM. Co-loger les deux phases force à payer le composant le plus cher pour les deux usages — l'argument matériel de la désagrégation.</p>"
    }
  },
  "schema-02": {
    "stall": {
      title: "Le generation stall",
      eyebrow: "batch mixte",
      body: "<p>Le continuous batching (Orca, 2022) recompose le lot à chaque itération. Mais un même batch peut mêler des decodes (un token à produire) et un prefill entrant (des milliers de tokens d'un coup).</p><p>Comme l'itération s'exécute en une passe synchrone, le long prefill <strong>gèle</strong> les decodes en cours : un pic d'ITL visible par tous les utilisateurs du batch. Plus le prompt entrant est long, plus le trou est marqué. Sur des charges mêlant requêtes courtes et contextes longs (RAG, agents), l'expérience devient erratique.</p>"
    },
    "chunked": {
      title: "Chunked prefill (Sarathi-Serve)",
      eyebrow: "école co-localisée",
      body: "<p>La réponse co-localisée : garder prefill et decode sur la même machine mais découper chaque prefill en <em>chunks</em> de taille fixe, cousus à beaucoup de decodes, sans jamais dépasser un budget de calcul par itération.</p><p>C'est le <em>stall-free batching</em> : aucune itération n'est assez lourde pour geler une génération. Une seule classe de machines, pas de transfert réseau. Souvent le bon défaut à petite échelle ou sous charge homogène (Sarathi-Serve, OSDI 2024).</p>"
    },
    "disagg": {
      title: "Séparation physique",
      eyebrow: "école désagrégée",
      body: "<p>La réponse désagrégée : si les deux phases s'interfèrent, on les sépare sur deux pools de GPU distincts. Plus aucun prefill ne peut bloquer un decode, puisqu'ils ne tournent plus sur les mêmes machines.</p><p>Le prix à payer : transférer le KV cache du pool prefill au pool decode (voir schémas 3 et 4). Le pari de Splitwise, DistServe et Mooncake. Il débloque le dimensionnement indépendant des deux pools — mais ne paie qu'à l'échelle.</p>"
    },
    "metric": {
      title: "ITL / TBT — la latence inter-token",
      eyebrow: "ce qu'on mesure",
      body: "<p>L'<em>inter-token latency</em> (ITL), ou <em>time-between-tokens</em> (TBT), est le temps qui sépare deux tokens générés. C'est la métrique qui rend le <em>generation stall</em> visible : un pic d'ITL trahit une génération gelée.</p><p>Son agrégat, le TPOT (temps moyen par token), est l'un des deux SLO clés du serving — l'autre étant le TTFT. Les deux écoles cherchent justement à protéger l'ITL des decodes contre l'irruption des prefills.</p>"
    }
  },
  "schema-03": {
    "router": {
      title: "Routeur / scheduler global",
      eyebrow: "orchestration",
      body: "<p>Le point d'entrée de l'architecture désagrégée. Il reçoit la requête, choisit une instance de prefill (selon la charge et la possibilité de réutiliser un préfixe en cache), puis apparie cette requête à une instance de decode une fois le KV cache prêt.</p><p>Il supervise les deux pools et porte le levier décisif : le ratio xP:yD (combien d'instances prefill pour combien de decode), ajusté à la forme réelle du trafic — prompts longs et réponses courtes, ou l'inverse.</p>"
    },
    "prefill-pool": {
      title: "Pool prefill",
      eyebrow: "compute-dense",
      body: "<p>Un ensemble d'instances dédiées au seul prefill. Comme la phase est compute-bound, ce pool privilégie un parallélisme tensoriel agressif sur peu de GPU à fort calcul.</p><p>Chaque instance lit le prompt en un passage parallèle, calcule le KV cache de tous les tokens d'entrée et produit le premier token. Le cache est ensuite expédié vers le pool decode. DistServe choisit le parallélisme de ce pool indépendamment de celui du decode.</p>"
    },
    "kv-transfer": {
      title: "Transfert du KV cache",
      eyebrow: "le chemin critique",
      body: "<p>Le maillon que la désagrégation ajoute — et son principal coût. Le KV cache d'une requête (plusieurs Go) doit voyager du pool prefill au pool decode sur le chemin critique de latence.</p><p>Les implémentations sérieuses passent par RDMA / InfiniBand, NVLink, ou des moteurs dédiés (NIXL chez Dynamo, Transfer Engine chez Mooncake). Le streaming layer-by-layer recouvre le transfert avec le calcul pour le rendre en grande partie invisible (voir schéma 4).</p>"
    },
    "decode-pool": {
      title: "Pool decode",
      eyebrow: "memory-dense",
      body: "<p>Un ensemble d'instances dédiées à la génération token par token. Comme la phase est memory-bound, ce pool privilégie la bande passante et la capacité HBM — il peut tourner sur des GPU plus anciens ou moins chers que le pool prefill.</p><p>Chaque instance reçoit le KV cache, l'installe dans sa mémoire et génère la réponse jusqu'à la fin. On en déploie typiquement plus que d'instances prefill (ratio xP:yD), car le decode occupe la machine plus longtemps par requête.</p>"
    }
  },
  "schema-04": {
    "kv-anatomy": {
      title: "Anatomie et taille du KV cache",
      eyebrow: "pourquoi c'est lourd",
      body: "<p>Le KV cache stocke une paire (clé, valeur) d'attention par token, par tête, par couche. Sa taille croît <strong>linéairement</strong> avec la longueur du contexte et avec la profondeur du modèle.</p><p>Pour un contexte long, il atteint plusieurs gigaoctets par requête. C'est précisément ce volume qu'il faut déplacer entre pools dans une architecture désagrégée — d'où l'importance du transport et du recouvrement.</p>"
    },
    "transports": {
      title: "Transport rapide",
      eyebrow: "pas de TCP",
      body: "<p>Déplacer des Go par requête sur le chemin critique exige des liens à très faible latence : NVLink entre GPU d'un même nœud, RDMA sur InfiniBand ou RoCE entre nœuds.</p><p>NVIDIA a standardisé cette couche avec NIXL (au cœur de Dynamo) ; Mooncake a son propre Transfer Engine RDMA, désormais réutilisé par d'autres serveurs (dont SGLang). Le transport devient une couche standardisée qui abstrait HBM, DRAM et stockage.</p>"
    },
    "tiered": {
      title: "Pool tiéré CPU/DRAM/SSD (Mooncake)",
      eyebrow: "KV-centric",
      body: "<p>Mooncake fait du KV cache l'objet central : le cache vit dans un pool désagrégé exploitant la DRAM et le SSD inutilisés de la grappe, en niveaux (HBM chaud → DRAM tiède → SSD froid).</p><p>Ce pool alimente les instances de decode <em>et</em> réutilise les préfixes entre requêtes : deux conversations partageant un system prompt ne le recalculent pas. Sur des charges à fort recouvrement de contexte, ce prefix caching transforme l'économie de la désagrégation.</p>"
    },
    "streaming": {
      title: "Streaming layer-by-layer",
      eyebrow: "masquer le transfert",
      body: "<p>Plutôt que d'attendre la fin du prefill complet pour expédier le cache, on le <em>streame</em> couche par couche : le transfert de la couche n recouvre le calcul de la couche n+1.</p><p>DéjàVu a poussé cette idée de <em>KV-cache streaming</em>, qui sert aussi la tolérance aux pannes et le swapping de micro-batchs. Bien pipeliné, le transfert devient en grande partie gratuit, masqué derrière le calcul — ce qui rend la désagrégation viable sur le chemin critique.</p>"
    }
  },
  "schema-05": {
    "ttft": {
      title: "TTFT — gouverné par le prefill",
      eyebrow: "axe horizontal",
      body: "<p>Le <em>time-to-first-token</em> est le délai avant que l'utilisateur voie le premier mot. Il dépend de la vitesse du prefill : taille du prompt, parallélisme, et possibilité de réutiliser un préfixe en cache.</p><p>Dans une architecture désagrégée, on le réduit en ajoutant des instances au pool prefill — sans toucher au decode. C'est le premier des deux cadrans indépendants.</p>"
    },
    "tpot": {
      title: "TPOT — gouverné par le decode",
      eyebrow: "axe vertical",
      body: "<p>Le <em>time-per-output-token</em> (ou ITL) est le temps entre deux tokens générés, donc la fluidité du flux. Il dépend de la vitesse du decode, elle-même bornée par la bande passante mémoire et la taille du batch.</p><p>On le tient en ajoutant des instances au pool decode — sans toucher au prefill. Second cadran indépendant. C'est cette séparation des deux leviers qui fait la force de la désagrégation.</p>"
    },
    "scaling": {
      title: "Levier de scaling indépendant (xP:yD)",
      eyebrow: "deux cadrans séparés",
      body: "<p>Le cœur de l'argument DistServe : puisque TTFT dépend du prefill et TPOT du decode, on peut dimensionner et régler chaque pool <strong>pour son seul SLO</strong>, sans compromis.</p><p>TTFT trop lent ? + prefill. TPOT qui dérive sous charge ? + decode. Le ratio xP:yD devient un cadran qu'on tourne selon la forme du trafic. C'est ce qui maximise le goodput — le nombre de requêtes respectant les deux SLO à la fois — à matériel égal.</p>"
    },
    "chunked-wins": {
      title: "Où le chunked prefill gagne",
      eyebrow: "le contre-point honnête",
      body: "<p>La désagrégation a un coût fixe d'entrée : transférer le KV cache ajoute latence et complexité, et séparer en deux pools suppose assez de GPU pour bien remplir chacun.</p><p>Sur un petit déploiement, sous charge homogène (peu d'interférence), ou quand le réseau est cher, le chunked prefill co-localisé de Sarathi-Serve reste le meilleur choix : une seule classe de machines, pas de transfert. Le seuil de bascule est une décision d'ingénierie, pas un dogme.</p>"
    }
  },
  "schema-06": {
    "pure-disagg": {
      title: "Désagrégé — les fondateurs",
      eyebrow: "2024, la base conceptuelle",
      body: "<p>Splitwise (ISCA 2024) a posé le phase splitting et l'angle coût/énergie/matériel hétérogène. DistServe (OSDI 2024) a formalisé le goodput sous SLO et le placement par phase.</p><p>TetriInfer y ajoute une classification des requêtes pour router selon leur profil ; DéjàVu apporte le streaming de KV et la tolérance aux pannes. Statut : recherche, transport sur InfiniBand / RDMA. Ces quatre travaux fixent le vocabulaire de tout le champ.</p>"
    },
    "colocated": {
      title: "Co-localisé — le rival",
      eyebrow: "pas de transfert KV",
      body: "<p>L'autre école. Sarathi-Serve (OSDI 2024) garde prefill et decode sur la même machine et discipline le batch par chunked prefill : stall-free, une seule classe de machines, aucun transfert réseau.</p><p>Son ancêtre est Orca (continuous batching, 2022) ; le socle mémoire commun aux deux écoles est PagedAttention (vLLM). À petite échelle ou charge homogène, c'est souvent le bon défaut — le vrai concurrent de la désagrégation.</p>"
    },
    "production": {
      title: "Frameworks de production",
      eyebrow: "à grande échelle",
      body: "<p>Mooncake (Moonshot / Kimi, FAST'25 best paper) est le premier grand déploiement désagrégé centré KV cache. NVIDIA Dynamo (GTC 2025) fait du disaggregated serving un mode natif open-source, avec routage KV-aware, planificateur de pools et transport NIXL.</p><p>llm-d (Red Hat, Google, IBM, CoreWeave, 2025) porte la désagrégation dans Kubernetes : inférence distribuée fondée sur vLLM, routage sensible au cache. Le pattern est passé de la recherche à la production.</p>"
    },
    "oss": {
      title: "Adoption open-source",
      eyebrow: "option de déploiement standard",
      body: "<p>vLLM a introduit un support expérimental de disaggregated prefilling via un connecteur KV (configurations 1P1D et au-delà). SGLang a ajouté la désagrégation P/D et intègre le Transfer Engine de Mooncake.</p><p>Quand les deux serveurs open-source les plus utilisés câblent la désagrégation, le signal est clair : ce n'est plus une curiosité de recherche, mais une option de déploiement que tout opérateur peut activer.</p>"
    }
  }
}
