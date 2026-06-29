{
  "schema-01": {
    "prefill-compute": {
      eyebrow: "Phase 1 · compute-bound",
      title: "Le prefill sature le calcul",
      body: "<p>Le <strong>prefill</strong> traite tout le prompt d'entrée en une seule passe, tous les tokens en parallèle. Cette parallélisation remplit les unités de calcul du GPU : la phase est <em>compute-bound</em>, limitée par les FLOPs.</p><p>Sur le roofline, elle se place près du plafond de calcul, à haute intensité arithmétique. C'est la phase « chère en calcul, brève » : elle produit d'un coup le KV-cache de toute la requête, puis cède la place au decode.<a class='cite' data-cite='1' href='#source-1'>1</a></p>"
    },
    "decode-memory": {
      eyebrow: "Phase 2 · memory-bound",
      title: "Le decode sature la mémoire",
      body: "<p>Le <strong>decode</strong> génère les tokens un par un. Chaque pas ne fait qu'une ligne de calcul, mais doit <em>lire l'intégralité du KV-cache</em> accumulé. La phase est donc <em>memory-bound</em> : limitée par la bande passante mémoire.</p><p>Conséquence frappante : un GPU en decode pur utilise typiquement <strong>moins de 10 % de sa puissance de calcul</strong> tout en saturant sa bande passante — l'exact opposé du prefill. Cette asymétrie est la raison d'être de toute la désagrégation.<a class='cite' data-cite='2' href='#source-2'>2</a></p>"
    },
    "interference-stall": {
      eyebrow: "Le coût caché",
      title: "L'interférence prefill/decode",
      body: "<p>Le <em>continuous batching</em> (Orca) regroupe les requêtes à l'échelle de l'itération. Mais quand une nouvelle requête arrive, son prefill lourd s'insère dans un lot de decodes légers et <strong>monopolise le GPU</strong> : les générations en cours se figent.</p><p>Tous les utilisateurs actifs subissent un pic de latence inter-token, le temps que le prefill passe — d'autant plus pénalisant que les prompts sont longs. Deux familles de remèdes : découper le prefill (Schéma 6), ou séparer physiquement les phases.<a class='cite' data-cite='11' href='#source-11'>11</a></p>"
    },
    "parallelisme-impose": {
      eyebrow: "La contrainte de fond",
      title: "Un seul pool = un seul plan",
      body: "<p>Au-delà de l'interférence, le co-placement impose un <strong>parallélisme unique</strong> (tensor/pipeline) et un <strong>ratio de nœuds figé</strong> à deux phases aux optima opposés. Le prefill aime le parallélisme tensoriel ; le decode préfère étaler la pression mémoire.</p><p>Et le dimensionnement est bloqué : on ne peut pas ajouter du matériel pour le decode sans en ajouter, mécaniquement, pour le prefill. Le chunked prefill soigne le symptôme ; la désagrégation supprime la cause.<a class='cite' data-cite='4' href='#source-4'>4</a></p>"
    }
  },
  "schema-02": {
    "ttft-slo": {
      eyebrow: "SLO du prefill",
      title: "TTFT — time-to-first-token",
      body: "<p>Le <strong>TTFT</strong> est le délai avant le premier token : « combien de temps avant que ça réponde ». Il est dominé par le <em>prefill</em>, la passe qui digère le prompt d'entrée.</p><p>Sur une charge interactive, c'est la première promesse de latence à tenir. La serrer pousse à former de gros lots de prefill — au risque de relâcher l'autre contrainte, le TPOT. Les deux SLO tirent en sens inverse sur un pool partagé.<a class='cite' data-cite='1' href='#source-1'>1</a></p>"
    },
    "tpot-slo": {
      eyebrow: "SLO du decode",
      title: "TPOT — time-per-output-token",
      body: "<p>Le <strong>TPOT</strong> est l'intervalle entre deux tokens successifs : « à quelle vitesse ça défile ensuite ». Il est dominé par le <em>decode</em>, la génération auto-régressive.</p><p>C'est la seconde promesse de latence. La tenir exige un decode régulier, sans stall — exactement ce que l'arrivée d'un prefill vient briser sur un pool co-placé. TTFT et TPOT sont deux cibles antagonistes que la désagrégation permet d'optimiser séparément.<a class='cite' data-cite='1' href='#source-1'>1</a></p>"
    },
    "debit-trompeur": {
      eyebrow: "Pourquoi la moyenne ment",
      title: "Le débit brut est trompeur",
      body: "<p>Le <strong>débit brut</strong> — tokens/s agrégés — se maximise en empilant les requêtes jusqu'à ce que la latence individuelle devienne inacceptable. Une fraction des requêtes viole alors l'un des deux SLO, mais la moyenne reste flatteuse.</p><p>Optimiser ce chiffre revient à optimiser une moyenne qui masque la violation de contraintes antagonistes. C'est précisément ce biais qui a longtemps caché le conflit prefill/decode : on regardait la mauvaise métrique.<a class='cite' data-cite='1' href='#source-1'>1</a></p>"
    },
    "goodput-def": {
      eyebrow: "La métrique de vérité",
      title: "Le goodput selon DistServe",
      body: "<p>Le <strong>goodput</strong> ne compte que les requêtes par seconde (et par GPU) qui respectent <em>à la fois</em> leur cible TTFT <em>et</em> leur cible TPOT. C'est la capacité réellement utile, pas le débit nominal.</p><p>Sous cette lentille, séparer les deux phases sur du matériel dédié devient la conséquence logique de la métrique. DistServe rapporte jusqu'à <strong>×7,4 requêtes servies, ou ×12,6 sur la sévérité du SLO</strong>, en tenant les cibles pour &gt; 90 % des requêtes.<a class='cite' data-cite='1' href='#source-1'>1</a></p>"
    }
  },
  "schema-03": {
    "routeur": {
      eyebrow: "Maillon 1",
      title: "Le routeur cache-aware",
      body: "<p>Le <strong>routeur</strong> reçoit la requête et décide où la placer. Dans les systèmes <em>cache-aware</em>, il connaît l'état des KV-caches déjà chauds et route vers une instance qui détient le bon préfixe.</p><p>La mécanique de l'arbre radix de SGLang devient ici une décision de routage inter-nœuds : maximiser le réutilisé, minimiser le transfert. Le routeur est le cerveau du pipeline désagrégé — c'est lui qui transforme la localité du cache en politique d'ordonnancement.<a class='cite' data-cite='9' href='#source-9'>9</a></p>"
    },
    "pool-prefill": {
      eyebrow: "Maillon 2",
      title: "Le pool prefill",
      body: "<p>Premier pool de GPU, dédié au prefill et dimensionné pour le <em>calcul</em>. Une requête y exécute sa passe d'entrée, ce qui <strong>produit</strong> le KV-cache de tout son prompt.</p><p>Isolé du decode, il peut tourner à pleine charge de calcul sans jamais figer une génération en cours. Son parallélisme (tensoriel, taille de lot) est réglé pour le profil compute-bound, indépendamment des contraintes du decode — le premier bénéfice du découplage.<a class='cite' data-cite='1' href='#source-1'>1</a></p>"
    },
    "transfert-kv": {
      eyebrow: "Maillon 3",
      title: "Le transfert du KV-cache",
      body: "<p>La séparation a un prix : le KV-cache produit côté prefill doit <strong>transiter</strong> jusqu'au pool decode — plusieurs gigaoctets d'états d'attention, sur le réseau, par requête.</p><p>Si le lien est lent, cette latence annule le gain. D'où l'investissement massif dans le transfert rapide (RDMA, NVLink, NIXL) et la localité. La rareté du cache n'a pas disparu : elle s'est déplacée du GPU vers le réseau. Le Schéma 5 détaille cette économie.<a class='cite' data-cite='3' href='#source-3'>3</a></p>"
    },
    "pool-decode": {
      eyebrow: "Maillon 4",
      title: "Le pool decode",
      body: "<p>Second pool, dédié à la génération token par token et dimensionné pour la <em>bande passante mémoire</em> et la capacité de KV-cache. Il <strong>consomme</strong> le cache reçu et produit le flux de tokens.</p><p>Parce qu'aucun prefill ne s'y insère, le decode tourne sans interférence : latence inter-token stable, débit prévisible. C'est ici que la séparation paie son dividende le plus direct — un TPOT enfin tenable.<a class='cite' data-cite='1' href='#source-1'>1</a></p>"
    },
    "pool-kv": {
      eyebrow: "Maillon 5 · Mooncake",
      title: "Le pool KVCache global",
      body: "<p>Mooncake pousse la logique à son terme : le KV-cache n'est plus attaché à un GPU, il vit dans un <strong>pool désagrégé</strong> exploitant la DRAM, les SSD et le CPU sous-utilisés du cluster — une hiérarchie HBM (chaud) → DRAM → SSD (froid).</p><p>Le placement du cache devient alors un problème d'ordonnancement de premier ordre. Le cache cesse d'être un sous-produit local pour devenir une ressource cluster gérée comme telle.<a class='cite' data-cite='3' href='#source-3'>3</a></p>"
    }
  },
  "schema-04": {
    "parallelisme-prefill": {
      eyebrow: "DeepSeek-V3 · prefill",
      title: "Unité prefill : EP32, 4 nœuds",
      body: "<p>L'unité de prefill de DeepSeek-V3 tourne en <strong>EP32 sur 4 nœuds H800</strong>, avec 9 routed + 1 shared expert par GPU et 32 experts redondants pour l'équilibrage.</p><p>Dimensionnée pour digérer vite de gros prompts, elle atteint <strong>~73 700 tokens/s en entrée par nœud</strong> (cache hits inclus). Son parallélisme est choisi pour le régime compute-bound — sans aucune contrainte imposée par le decode, qui vit sur une flotte distincte.<a class='cite' data-cite='6' href='#source-6'>6</a></p>"
    },
    "parallelisme-decode": {
      eyebrow: "DeepSeek-V3 · decode",
      title: "Unité decode : EP144, 18 nœuds",
      body: "<p>L'unité de decode pousse jusqu'à <strong>EP144 sur 18 nœuds</strong> — 4,5× plus de GPU que le prefill — avec 2 routed + 1 shared expert par GPU. Le parallélisme d'experts étalé répartit la pression mémoire du KV-cache et des 256 experts.</p><p>Elle débite <strong>~14 800 tokens/s en sortie par nœud</strong>. Deux phases, deux dimensionnements radicalement différents sur le même modèle : c'est le découplage poussé à l'échelle d'experts.<a class='cite' data-cite='6' href='#source-6'>6</a></p>"
    },
    "ratio-dynamique": {
      eyebrow: "Le cadran",
      title: "Régler le ratio prefill:decode",
      body: "<p>Le ratio de nœuds entre les deux pools n'est pas figé : il s'ajuste à la <strong>composition réelle du trafic</strong>.</p><p>Un service à prompts longs et réponses courtes (RAG, résumé, classification) sur-provisionne le prefill ; un service conversationnel ou de raisonnement, à réponses longues, sur-provisionne le decode. La désagrégation transforme un compromis d'architecture jadis gravé dans le marbre en un cadran qu'on règle — voire qu'un planificateur ajuste automatiquement (Schéma 7, Dynamo).</p>"
    },
    "co-optimisation": {
      eyebrow: "Ce que ça débloque",
      title: "Co-optimiser parallélisme et placement",
      body: "<p>DistServe en fait un problème d'optimisation explicite : <strong>co-optimiser le parallélisme et le placement de chaque phase</strong> sous contrainte de bande passante du lien, pour maximiser le goodput par GPU.</p><p>On peut même composer des flottes hétérogènes : GPU récents et coûteux pour le prefill compute-bound, GPU plus anciens mais à forte bande passante pour le decode (Splitwise). Un compromis jadis figé devient un espace de configuration à explorer.<a class='cite' data-cite='1' href='#source-1'>1</a><a class='cite' data-cite='2' href='#source-2'>2</a></p>"
    }
  },
  "schema-05": {
    "taille-transfert": {
      eyebrow: "Ce qu'il faut déplacer",
      title: "Plusieurs gigaoctets par requête",
      body: "<p>Le transfert porte sur le KV-cache du prompt entier. À ~800 Ko par token pour un modèle de 13 Md en FP16, une requête de 2 000 tokens immobilise déjà près de 1,6 Go ; sur de longs contextes, c'est plusieurs gigaoctets par requête.</p><p>C'est cette masse qui doit franchir le réseau entre les deux pools. Sa taille fixe le budget de bande passante du lien — et donc la viabilité même de la désagrégation (cf. dossier kv-cache §1).</p>"
    },
    "hierarchie-lien": {
      eyebrow: "Le débit décide",
      title: "NVLink ≫ RDMA ≫ TCP",
      body: "<p>Tout dépend du lien. Sur <strong>NVLink</strong> intra-nœud (centaines de Go/s à plusieurs To/s), le transfert est quasi gratuit. Sur <strong>RDMA RoCE</strong>, Mooncake mesure 87 Go/s (4×200 Gbps) à 190 Go/s (8×400 Gbps).</p><p>Sur <strong>TCP</strong>, c'est 2,4 à 4,6 fois plus lent — souvent assez pour annuler le gain. La hiérarchie des liens est la variable cachée qui décide où la désagrégation est rentable.<a class='cite' data-cite='3' href='#source-3'>3</a></p>"
    },
    "recouvrement-couches": {
      eyebrow: "Masquer la latence",
      title: "Le recouvrement couche-par-couche",
      body: "<p>Plutôt que d'attendre la fin du prefill complet, on <strong>streame le KV d'une couche dès qu'elle est calculée</strong>. Le transfert de la couche L<em>n</em> recouvre alors le calcul de L<em>n+1</em>.</p><p>La latence réseau disparaît derrière le calcul des couches suivantes — le coût du transfert devient largement invisible. DistServe et Mooncake exploitent ce pipeline couche-par-couche, condition pour que la désagrégation tienne sa promesse.<a class='cite' data-cite='1' href='#source-1'>1</a><a class='cite' data-cite='3' href='#source-3'>3</a></p>"
    },
    "point-bascule": {
      eyebrow: "Gagner ou perdre",
      title: "Le point de bascule",
      body: "<p>La règle est simple : la désagrégation gagne tant que le <strong>temps de transfert KV reste inférieur au temps de calcul qu'elle libère</strong>. Sous un lien lent ou pour des prompts courts, le co-placement reste préférable.</p><p>D'où NIXL (NVIDIA Dynamo), qui déplace le KV <em>directement de VRAM à VRAM</em> derrière 5 backends, et le routage cache-aware, qui évite carrément le transfert quand le préfixe est déjà chaud sur le bon nœud.<a class='cite' data-cite='7' href='#source-7'>7</a><a class='cite' data-cite='12' href='#source-12'>12</a></p>"
    }
  },
  "schema-06": {
    "ecole-chunked": {
      eyebrow: "École A · entrelacer",
      title: "Chunked prefill (Sarathi-Serve)",
      body: "<p>L'école de l'<strong>entrelacement</strong> refuse de séparer les phases. Elle découpe le prefill en morceaux bornés, insérés dans les lots de decode sans jamais les interrompre — un ordonnancement <em>stall-free</em> qui exploite les cœurs GPU inactifs pendant le decode.</p><p>Gain : <strong>×2,6 (Mistral-7B) à ×5,6 (Falcon-180B)</strong> vs vLLM, sans aucune modification matérielle. Son argument décisif : zéro coût réseau, puisque tout reste sur le même GPU.<a class='cite' data-cite='4' href='#source-4'>4</a></p>"
    },
    "ecole-desagregee": {
      eyebrow: "École B · séparer",
      title: "Désagrégation (DistServe, Splitwise)",
      body: "<p>L'école de la <strong>séparation</strong> place prefill et decode sur deux pools de GPU dédiés, chacun avec son parallélisme et son dimensionnement ; le KV transite de l'un à l'autre.</p><p>Elle supprime l'interférence par construction et débloque le découplage du dimensionnement. Son prix : le transfert KV, rentable seulement à la bonne échelle et sur le bon lien. C'est l'architecture des grands services à fort trafic.<a class='cite' data-cite='1' href='#source-1'>1</a></p>"
    },
    "charge-favorable-chunked": {
      eyebrow: "Où A gagne",
      title: "Quand entrelacer suffit",
      body: "<p>Le chunked prefill l'emporte sur les <strong>déploiements modestes</strong> (un à quelques nœuds), où un transfert inter-pools serait pure perte ; quand le <strong>lien inter-nœuds est lent ou absent</strong> ; et sur les <strong>prompts courts</strong>, où le KV à déplacer ne justifie pas son coût réseau.</p><p>L'argument est économique autant que technique : pourquoi payer un transfert quand un ordonnancement astucieux sur un seul GPU résout déjà l'interférence ?<a class='cite' data-cite='12' href='#source-12'>12</a></p>"
    },
    "charge-favorable-desag": {
      eyebrow: "Où B gagne",
      title: "Quand séparer s'impose",
      body: "<p>La désagrégation l'emporte à grande échelle : <strong>grands clusters</strong>, <strong>prompts longs</strong>, lien rapide (RDMA/NVLink), et surtout exigence de <strong>TTFT et TPOT serrés simultanément</strong> avec le besoin de dimensionner les phases indépendamment.</p><p>Les deux écoles ne s'excluent d'ailleurs pas : un pool prefill désagrégé peut employer le chunked prefill en interne. La vraie question est l'échelle de bascule — un débat encore ouvert.<a class='cite' data-cite='12' href='#source-12'>12</a></p>"
    }
  },
  "schema-07": {
    "mooncake": {
      eyebrow: "Moonshot · Kimi",
      title: "Mooncake — l'architecture KVCache-centric",
      body: "<p>L'architecture la plus aboutie : pool KV global sur DRAM/SSD, transfert RDMA (87→190 Go/s), et un <strong>ordonnancement orienté surcharge</strong> (<em>prediction-based early rejection</em>) qui rejette par avance les requêtes condamnées à violer leur SLO plutôt que de dégrader tout le monde.</p><p>Résultat : jusqu'à <strong>+525 % de débit en simulation</strong> sous SLO ; en charge réelle, Kimi traite <strong>+75 % de requêtes</strong>.<a class='cite' data-cite='3' href='#source-3'>3</a></p>"
    },
    "deepseek-v3": {
      eyebrow: "DeepSeek-AI",
      title: "DeepSeek-V3 — désagrégation × MoE",
      body: "<p>La désagrégation à très grande échelle d'experts : prefill (EP32, 4 nœuds) et decode (EP144, 18 nœuds) sur des unités aux degrés d'<em>expert parallelism</em> très différents, 32 experts redondants pour l'équilibrage.</p><p>Démonstration que désagrégation et MoE se composent — avec un cache massivement réutilisé : <strong>56,3 % des tokens d'entrée servis depuis le cache on-disk</strong>, et une marge de profit théorique annoncée à 545 %.<a class='cite' data-cite='6' href='#source-6'>6</a></p>"
    },
    "splitwise": {
      eyebrow: "Microsoft · Azure",
      title: "Splitwise — le levier coût et énergie",
      body: "<p>Trois pools — <em>prompt</em>, <em>token</em>, <em>mixte</em> — sur des flottes hétérogènes, avec transfert InfiniBand. Splitwise montre que la désagrégation est aussi un levier de <strong>coût</strong> et d'<strong>énergie</strong>, pas seulement de latence.</p><p>On met les GPU récents au prefill compute-bound, les plus anciens à forte bande passante au decode : <strong>×2,35 de débit à coût et enveloppe énergétique constants</strong>, ou ×1,4 à −20 % de coût.<a class='cite' data-cite='2' href='#source-2'>2</a></p>"
    },
    "dynamo": {
      eyebrow: "NVIDIA · GTC 2025",
      title: "Dynamo — la désagrégation comme produit",
      body: "<p>La plateforme qui industrialise le pattern : <em>disaggregated serving</em> natif, <strong>Smart Router</strong> KV-aware (score de recouvrement + charge), bibliothèque de transfert <strong>NIXL</strong> (VRAM→VRAM, 5 backends), et un <strong>Planner</strong> qui ajuste dynamiquement le ratio prefill:decode.</p><p>Jusqu'à <strong>×30 de requêtes servies</strong> sur DeepSeek-R1 (GB200 NVL72) et <strong>&gt;×2 sur Llama 70B</strong> (Hopper), à parc GPU constant.<a class='cite' data-cite='7' href='#source-7'>7</a></p>"
    },
    "vllm-llmd": {
      eyebrow: "Open source",
      title: "vLLM · SGLang · llm-d",
      body: "<p>L'open source généralise : support natif du <em>disaggregated prefill</em> (connecteurs LMCache/NIXL), et avec <strong>llm-d</strong> — initiative Kubernetes-native (Red Hat, Google, IBM), en <em>CNCF Sandbox</em> depuis mars 2026 — une orchestration distribuée standardisée.</p><p>Son routage cache-aware revendique <strong>~×3 de débit de sortie et ~×2 de réduction du TTFT</strong> face au round-robin. Ce qui était recherche en 2024 est devenu brique d'infrastructure en 2026.<a class='cite' data-cite='8' href='#source-8'>8</a></p>"
    }
  }
}
