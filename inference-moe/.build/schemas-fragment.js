{
  "schema-01": {
    "gate": {
      title: "Le routeur (gate)",
      eyebrow: "local au GPU",
      body: "<p>Pour chaque token, le routeur calcule un score sur les <em>N</em> experts et sélectionne les <em>k</em> meilleurs (top-k, 8 sur 256 pour DeepSeek-V3). C'est une opération <strong>locale</strong> : pas de communication, juste un petit produit matriciel et un tri.</p><p>Mais sa décision commande tout le reste : quels tokens vont où, et donc le volume de chaque flux du all-to-all qui suit. Un routeur déséquilibré fabrique des straggler (schéma 5).</p>"
    },
    "dispatch-a2a": {
      title: "Dispatch — all-to-all #1",
      eyebrow: "collectif · tokens vers experts",
      body: "<p>Premier collectif de la couche : chaque GPU envoie ses tokens vers les GPU qui hébergent les experts cibles. Le motif est <strong>tout-à-tout</strong> — chacun parle à tous — avec des volumes dictés par les décisions du routeur, donc impossibles à connaître avant l'exécution<a class='cite' data-cite='3' href='#source-3'>3</a>.</p><p>C'est ici que se paie l'asymétrie NVLink / RDMA (schéma 2) : un token qui reste dans le nœud coûte 3 à 10× moins qu'un token qui en sort.</p>"
    },
    "expert-ffn": {
      title: "Le calcul des experts",
      eyebrow: "local · presque gratuit en decode",
      body: "<p>Chaque expert applique son réseau feed-forward aux tokens reçus. En décodage (limité par la mémoire), ce calcul est <strong>presque gratuit</strong> : le GPU est de toute façon en attente de la mémoire.</p><p>D'où le retournement : sur un MoE à grande échelle, ce n'est pas ce bloc qui coûte, mais les deux collectifs qui l'encadrent. DeepGEMM fournit les GEMM groupés FP8 dédiés (schéma 4).</p>"
    },
    "combine-a2a": {
      title: "Combine — all-to-all #2",
      eyebrow: "collectif · sorties vers origine",
      body: "<p>Second collectif : les sorties des experts repartent vers les GPU d'origine des tokens, où elles sont recombinées de façon pondérée. Même motif tout-à-tout que le dispatch, même coût.</p><p>Deux all-to-all par couche, synchrones : un modèle de 60 couches en aligne <strong>120</strong> sur le chemin critique de chaque token généré. C'est le poste que toute l'ingénierie de ce dossier cherche à masquer.</p>"
    }
  },
  "schema-02": {
    "nvlink-domain": {
      title: "Le domaine NVLink intra-nœud",
      eyebrow: "~150 Go/s",
      body: "<p>Les 8 GPU d'un même serveur communiquent par un maillage <span class='term' data-tooltip='Interconnexion haut débit reliant les GPU d’un même serveur.'>NVLink</span> à très haute bande passante. DeepEP y mesure des débits de dispatch de l'ordre de 150 Go/s<a class='cite' data-cite='2' href='#source-2'>2</a>.</p><p>C'est le régime rapide : tant que le all-to-all reste dans le nœud, il se recouvre facilement par le calcul. Les fabrics scale-up (NVL72, schéma 7) cherchent précisément à agrandir ce domaine.</p>"
    },
    "all-to-all-matrix": {
      title: "Le motif all-to-all",
      eyebrow: "chacun parle à tous",
      body: "<p>Contrairement à un all-reduce (volume fixe, motif régulier), le all-to-all fait dialoguer <em>chaque</em> GPU avec <em>tous</em> les autres, avec des volumes qui dépendent du routeur.</p><p>C'est le pire motif de communication : impossible à planifier statiquement, sensible au moindre déséquilibre. Les bibliothèques comme Tutel<a class='cite' data-cite='6' href='#source-6'>6</a> et Lina<a class='cite' data-cite='7' href='#source-7'>7</a> ont passé des années à l'optimiser avant DeepEP.</p>"
    },
    "rdma-domain": {
      title: "Le domaine RDMA inter-nœud",
      eyebrow: "~45–90 Go/s",
      body: "<p>Dès qu'un token franchit la frontière du serveur, on tombe sur le réseau <span class='term' data-tooltip='Remote Direct Memory Access via InfiniBand : accès mémoire direct entre serveurs.'>RDMA</span>/InfiniBand, où DeepEP mesure 45 à 90 Go/s<a class='cite' data-cite='2' href='#source-2'>2</a> — un facteur 3 à 10 sous le NVLink.</p><p>Cette marche d'un ordre de grandeur est le fait central qui a façonné toute l'ingénierie de l'inférence MoE distribuée.</p>"
    },
    "node-limited-routing": {
      title: "Le routage borné aux nœuds",
      eyebrow: "la parade, inscrite à l'entraînement",
      body: "<p>Parade de DeepSeek : chaque token n'est autorisé à choisir des experts que dans un petit nombre de nœuds (4 pour DeepSeek-V3), ce qui <strong>plafonne le nombre de sauts RDMA</strong> coûteux et permet de recouvrir presque intégralement la communication par le calcul<a class='cite' data-cite='1' href='#source-1'>1</a>.</p><p>La leçon : le motif de routage n'est pas qu'une affaire de qualité de modèle, c'est une variable d'architecture réseau décidée dès l'entraînement.</p>"
    }
  },
  "schema-03": {
    "tp": {
      title: "Parallélisme de tenseurs (TP)",
      eyebrow: "chaque expert découpé",
      body: "<p>On découpe <em>chaque</em> expert en tranches réparties sur les GPU. Avantage : pas de all-to-all, charge parfaitement équilibrée. Inconvénient décisif : un <strong>all-reduce à chaque couche</strong>, activations répliquées, bande passante qui explose avec la taille du groupe.</p><p>Le TP ne passe pas l'échelle au-delà d'un nœud. C'est la solution simple et robuste des petits déploiements, ou l'étage intra-nœud quand un expert est trop gros pour un seul GPU.</p>"
    },
    "ep": {
      title: "Parallélisme d'experts (EP)",
      eyebrow: "des experts entiers par GPU",
      body: "<p>On place des experts <em>entiers</em> sur des GPU distincts. C'est ceci qui introduit le double all-to-all — mais aussi ce qui permet de faire tenir un modèle de 671 milliards de paramètres en gardant chaque expert local et calculé efficacement.</p><p>L'EP échange le coût du all-reduce du TP contre celui du all-to-all — et à grande échelle, bien optimisé, le second gagne. La taille du groupe (EP32, EP144) est le paramètre porteur du déploiement.</p>"
    },
    "dp-attention": {
      title: "DP sur l'attention",
      eyebrow: "découpler l'attention du MoE",
      body: "<p>Innovation clé des déploiements DeepSeek 2025 : l'attention (et son cache KV, très gourmand — voir <a href='../attention-latente/'>attention-latente</a>) est répliquée par <strong>parallélisme de données</strong>, chaque GPU traitant son propre lot.</p><p>On évite ainsi de dupliquer le cache KV sur tout le groupe TP, tout en laissant le MoE s'étaler en EP. C'est la moitié attention du patron canonique.</p>"
    },
    "hybrid": {
      title: "Le patron canonique 2026",
      eyebrow: "DP-attention + EP-MoE",
      body: "<p>La combinaison gagnante : <strong>attention en DP</strong> (répliquée, chacun son lot) + <strong>MoE en EP</strong> à grande échelle. Elle réconcilie deux exigences contradictoires — ne pas dupliquer le cache KV, et étaler les experts<a class='cite' data-cite='8' href='#source-8'>8</a>.</p><p>C'est le standard des déploiements SGLang et vLLM de 2026, et la base des chiffres du schéma 6.</p>"
    },
    "memory-tradeoff": {
      title: "Le compromis se lit en mémoire",
      eyebrow: "activations vs poids vs équilibrage",
      body: "<p>Le TP réplique les activations et sature la bande passante — robuste dans le nœud, ingérable au-delà. L'EP disperse les experts (peu de mémoire de poids par GPU) mais paie la latence du all-to-all et exige un <strong>équilibrage dynamique</strong> (schéma 5).</p><p>À grande échelle, tous les déploiements sérieux de 2026 convergent vers l'EP pour le MoE, réservant le TP à l'intérieur du nœud.</p>"
    }
  },
  "schema-04": {
    "normal-mode": {
      title: "Mode normal — haut débit",
      eyebrow: "prefill · entraînement",
      body: "<p>Pour les phases à gros lots de tokens (prefill, entraînement), où l'on veut maximiser le débit. Ce mode exploite à fond NVLink (~150 Go/s) et RDMA (~45–90 Go/s)<a class='cite' data-cite='2' href='#source-2'>2</a>.</p><p>Objectif : saturer les liens pour la phase compute-bound du prefill, où le all-to-all a de la matière à transporter.</p>"
    },
    "low-latency-mode": {
      title: "Mode faible latence — pur-RDMA",
      eyebrow: "decode interactif",
      body: "<p>Pour le decode, où compte non le débit mais le <strong>délai d'un aller-retour</strong>. Ce mode utilise du RDMA pur, contourne les chemins à forte latence, et vise le time-per-output-token le plus court sur de petits lots.</p><p>C'est lui qui rend le décodage MoE distribué viable en interactif : sans mode faible latence, chaque token payerait le coût plein d'un collectif à grande échelle.</p>"
    },
    "hook-overlap": {
      title: "Recouvrement par hook",
      eyebrow: "communication masquée",
      body: "<p>DeepEP fournit un mécanisme (hook-based) qui laisse le all-to-all progresser <em>pendant</em> que le GPU calcule autre chose, <strong>sans consommer de SM</strong> pour la communication : le réseau travaille en arrière-plan pendant que les cœurs restent sur le modèle<a class='cite' data-cite='2' href='#source-2'>2</a>.</p><p>Combiné au recouvrement à deux lots (schéma 6), il fait quitter au barrier le chemin critique — le levier de performance décisif.</p>"
    },
    "fp8-dispatch": {
      title: "Dispatch FP8 + socle DeepGEMM",
      eyebrow: "moitié moins de volume réseau",
      body: "<p>Les tokens sont expédiés en <span class='term' data-tooltip='Format flottant 8 bits.'>FP8</span> (recombinaison en BF16), divisant par deux le volume sur le réseau — la quantification (voir <a href='../quantification-llm/'>quantification-llm</a>) au service de la bande passante, pas seulement de la mémoire.</p><p>DeepGEMM<a class='cite' data-cite='10' href='#source-10'>10</a> complète le socle avec des GEMM groupés FP8 (layouts contiguous / masked) pour le calcul des experts. DeepEP + DeepGEMM = la moitié basse de la pile MoE ouverte.</p>"
    }
  },
  "schema-05": {
    "hot-expert": {
      title: "Les experts populaires (hot)",
      eyebrow: "le routeur ne distribue pas uniformément",
      body: "<p>En production, le routeur envoie beaucoup plus de tokens à certains experts qu'à d'autres. La distribution réelle des requêtes diffère de celle de l'entraînement, donc même un modèle bien équilibré à l'entraînement se déséquilibre au service.</p><p>Le GPU qui héberge un expert populaire reçoit une charge disproportionnée — et comme le all-to-all est synchrone, il devient le straggler.</p>"
    },
    "straggler-barrier": {
      title: "Le straggler commande le barrier",
      eyebrow: "un déséquilibre de 2× = latence de 2×",
      body: "<p>Le double all-to-all est <strong>synchrone</strong> : la couche ne peut avancer tant que le GPU le plus chargé n'a pas fini. Le plus lent (<span class='term' data-tooltip='Le nœud le plus lent d’un collectif synchrone, qui impose sa cadence à tous.'>straggler</span>) impose sa cadence à tout le groupe.</p><p>Conséquence directe et impitoyable : un déséquilibre de charge de 2× se paie en latence de 2× sur toute la couche. D'où l'enjeu de l'équilibrage au moment du service.</p>"
    },
    "redundant-replica": {
      title: "EPLB — la redondance d'experts",
      eyebrow: "répliquer les experts populaires",
      body: "<p>Idée maîtresse de l'<strong>EPLB</strong><a class='cite' data-cite='9' href='#source-9'>9</a> : plutôt que de placer chaque expert sur un seul GPU, on réplique les experts populaires sur plusieurs GPU et on répartit leurs tokens entre les copies. DeepSeek-V3 en décodage ajoute 32 experts redondants<a class='cite' data-cite='1' href='#source-1'>1</a>.</p><p>Le placement est calculé en mode hiérarchique (respecte les nœuds) ou global (lissage maximal), recalculable quand la charge dérive. Coût : la VRAM des copies n'accueille plus de cache KV.</p>"
    },
    "bias-term": {
      title: "Pourquoi l'entraînement ne suffit pas",
      eyebrow: "biais sans-loss vs charge réelle",
      body: "<p>Le biais <em>auxiliary-loss-free</em> de DeepSeek-V3 (détaillé dans <a href='../melange-experts/'>melange-experts</a>) équilibre remarquablement bien la charge à l'entraînement — sans la taxe qualité d'une loss auxiliaire.</p><p>Mais il équilibre pour la distribution d'entraînement, pas pour celle des requêtes réelles. D'où la nécessité d'un équilibrage <strong>au moment du service</strong>, vivant, recalculé — pas fixé une fois pour toutes.</p>"
    }
  },
  "schema-06": {
    "prefill-pool": {
      title: "Pool prefill — EP32",
      eyebrow: "limité par le calcul · 4 nœuds",
      body: "<p>Le prefill traite le prompt entier d'un coup, en gros lots : phase <strong>limitée par le calcul</strong>. On veut un débit maximal ; un groupe EP modéré suffit et le mode normal de DeepEP domine.</p><p>DeepSeek-V3 sert le prefill en EP32, sur 4 nœuds<a class='cite' data-cite='1' href='#source-1'>1</a>. C'est le régime où le all-to-all a le moins de poids relatif.</p>"
    },
    "decode-pool": {
      title: "Pool decode — EP144",
      eyebrow: "limité par la mémoire · 18 nœuds",
      body: "<p>Le decode génère token par token, en petits lots : phase <strong>limitée par la mémoire</strong>, où le all-to-all pèse le plus lourd relativement au calcul. On étale donc les experts sur beaucoup plus de GPU pour minimiser la mémoire de poids par accélérateur.</p><p>DeepSeek-V3 sert le decode en EP144, sur 18 nœuds<a class='cite' data-cite='1' href='#source-1'>1</a> — un groupe EP bien plus large que le prefill.</p>"
    },
    "redundancy": {
      title: "+ 32 experts redondants",
      eyebrow: "lissage de charge au decode",
      body: "<p>Le decode large est le régime le plus exposé au straggler (schéma 5) : plus le groupe EP est grand, plus un expert populaire mal placé plombe le barrier. DeepSeek-V3 ajoute donc 32 experts redondants au pool decode<a class='cite' data-cite='1' href='#source-1'>1</a>, via l'EPLB.</p><p>Illustration concrète que la redondance n'est pas un luxe mais une condition de la latence à grande échelle.</p>"
    },
    "two-batch-overlap": {
      title: "Recouvrement à deux lots",
      eyebrow: "52,3k / 22,3k tokens·s·nœud",
      body: "<p>Le lot est coupé en deux micro-lots entrelacés : le all-to-all de l'un se déroule pendant le calcul de l'autre. Combiné au hook de DeepEP et à l'EPLB, il masque la communication.</p><p>Résultat mesuré par SGLang sur 96 GPU H100 : 52,3k tokens d'entrée/s et 22,3k tokens de sortie/s par nœud, jusqu'à 5× le débit d'un TP simple<a class='cite' data-cite='8' href='#source-8'>8</a>. Sur GB200 NVL72 : ×3,8 prefill, ×4,8 decode<a class='cite' data-cite='11' href='#source-11'>11</a>.</p>"
    }
  },
  "schema-07": {
    "sglang": {
      title: "SGLang",
      eyebrow: "1ʳᵉ implémentation ouverte P/D + EP",
      body: "<p>SGLang a livré la première implémentation open source de la désagrégation prefill/decode + EP à grande échelle reproduisant le déploiement DeepSeek<a class='cite' data-cite='8' href='#source-8'>8</a>, avec la pile complète DeepEP + DeepGEMM + EPLB.</p><p>Depuis couplé à la prédiction multi-tokens (+60 % de débit de sortie). C'est la référence de facto pour servir un gros MoE ouvert en 2026.</p>"
    },
    "vllm": {
      title: "vLLM",
      eyebrow: "DP-attention + EP · DeepEP",
      body: "<p>vLLM a suivi avec son propre support DP-attention + EP et l'intégration de DeepEP. Le serveur le plus déployé de l'écosystème ouvert applique désormais le même patron canonique.</p><p>Sur la fabric NVL72, son support est encore en cours de maturation (partiel) — d'où le point ◐ du schéma.</p>"
    },
    "dynamo": {
      title: "NVIDIA Dynamo · TensorRT-LLM",
      eyebrow: "désagrégation + EP jusqu'au NVL72",
      body: "<p>Côté propriétaire, NVIDIA Dynamo (avec TensorRT-LLM) pousse la désagrégation et l'EP jusqu'au GB200 NVL72, dont la fabric scale-up est taillée pour absorber le all-to-all.</p><p>C'est l'offre la mieux intégrée au matériel du fabricant — au prix de l'ouverture.</p>"
    },
    "socle": {
      title: "Le socle ouvert (DeepSeek)",
      eyebrow: "DeepEP · DeepGEMM · EPLB",
      body: "<p>Le trio open source de DeepSeek — <strong>DeepEP</strong> (communication)<a class='cite' data-cite='2' href='#source-2'>2</a>, <strong>DeepGEMM</strong> (calcul FP8)<a class='cite' data-cite='10' href='#source-10'>10</a>, <strong>EPLB</strong> (équilibrage)<a class='cite' data-cite='9' href='#source-9'>9</a> — que la plupart des serveurs intègrent plutôt que de le réimplémenter.</p><p>Fait marquant : un laboratoire de modèles a fourni la couche système de référence de tout un marché. La moitié basse de la pile est un bien commun.</p>"
    },
    "nvl72": {
      title: "La fabric scale-up NVL72",
      eyebrow: "×3,8 prefill · ×4,8 decode",
      body: "<p>Le GB200 NVL72 réunit 72 GPU dans un seul domaine de cohérence NVLink. Conséquence directe : le all-to-all <strong>redevient intra-domaine rapide</strong>, et l'asymétrie NVLink/RDMA du schéma 2 se dissout largement.</p><p>SGLang y mesure ×3,8 en prefill et ×4,8 en decode<a class='cite' data-cite='11' href='#source-11'>11</a>. C'est la trajectoire matérielle qui pourrait, à terme, faire disparaître le goulot inter-nœud qui a façonné toute cette ingénierie.</p>"
    }
  }
}
