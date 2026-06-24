{
  "schema-01": {
    "la-formule": {
      title: "La formule de taille du cache",
      eyebrow: "Anatomie",
      body: "<p>La mémoire d'un KV-cache pour une requête vaut <code>2 · L · H_kv · d · seq · batch · octets</code>. Le facteur <strong>2</strong> couple clé et valeur ; <strong>L</strong> est le nombre de couches, <strong>H_kv</strong> le nombre de têtes KV (que GQA/MQA réduisent — Schéma 7), <strong>d</strong> la dimension par tête.</p><p>Le point décisif : seul le produit <strong>seq × batch</strong> dépend de la <em>charge</em>. Tous les autres termes sont fixés par l'architecture du modèle. C'est ce qui fait du cache la seule structure de l'inférence dont la taille se gère à l'exécution, et non se provisionne une fois pour toutes.</p>"
    },
    "recompute-vs-cache": {
      title: "Pourquoi le cache existe",
      eyebrow: "Recalcul O(n²) contre cache O(n)",
      body: "<p>Sans cache, générer le token <em>n</em> de façon auto-régressive imposerait de recalculer les clés et valeurs des <em>n−1</em> tokens précédents à chaque pas : un coût cumulé quadratique, O(n²), qui explose sur les longs contextes.</p><p>Mémoriser les K et V déjà calculés ramène le calcul à O(n) — linéaire. Le KV-cache est donc un échange explicite : on troque du <em>calcul répété</em> contre de la <em>mémoire occupée</em>. Tout le reste du rapport découle de ce troc : la mémoire qu'on vient d'économiser en calcul devient la nouvelle ressource rare.</p>"
    },
    "domination-memoire": {
      title: "Quand le cache dépasse les poids",
      eyebrow: "Poids constants, cache variable",
      body: "<p>Les poids du modèle occupent une mémoire <em>constante</em>. Le KV-cache, lui, croît avec la longueur de contexte et la taille du lot. À contexte court et petit lot, les poids dominent — l'intuition « il faut de la mémoire pour le modèle ».</p><p>Mais à mesure que le contexte s'allonge (8 k, 32 k, 128 k tokens) et que le lot grossit, le cache franchit la barre des poids et devient le premier poste mémoire. C'est ce renversement qui a transformé l'inférence d'un problème de calcul en problème de gestion mémoire.<a class='cite' data-cite='1' href='#source-1'>1</a></p>"
    },
    "croissance-lineaire": {
      title: "Un ordre de grandeur concret",
      eyebrow: "Modèle 13 Md, FP16",
      body: "<p>Pour un modèle de ~13 milliards de paramètres servi en demi-précision, chaque token mis en cache coûte de l'ordre de <strong>800 Ko</strong>. Une seule requête de 2 000 tokens immobilise donc près de <strong>1,6 Go</strong> de HBM — pour une <em>seule</em> conversation.</p><p>Multipliez par la taille du lot (des dizaines à des centaines de requêtes simultanées en production) et le KV-cache agrégé dépasse vite la taille des poids. Chaque gigaoctet de HBM gaspillé, c'est autant de requêtes concurrentes en moins : la mémoire du cache se traduit directement en débit servi.<a class='cite' data-cite='1' href='#source-1'>1</a></p>"
    }
  },
  "schema-02": {
    "reservation-max": {
      title: "Sur-réservation au maximum",
      eyebrow: "Le péché originel",
      body: "<p>Avant 2023, à l'arrivée d'une requête, on ne sait pas combien de tokens le modèle va générer. Par prudence, on réserve un bloc <em>contigu</em> dimensionné sur la longueur <em>maximale</em> possible (ex. 2 048 tokens).</p><p>Cette réservation anticipée immobilise immédiatement une mémoire qu'on n'utilisera peut-être jamais, et qui devient indisponible pour les autres requêtes. C'est la racine du gaspillage : une politique d'allocation héritée de l'entraînement, où les tenseurs ont une taille connue à l'avance — hypothèse fausse en service génératif.<a class='cite' data-cite='1' href='#source-1'>1</a></p>"
    },
    "frag-interne": {
      title: "Fragmentation interne",
      eyebrow: "Le réservé non rempli",
      body: "<p>On a réservé pour 2 048 tokens ; la requête en génère 340. Les ~1 700 slots restants sont alloués mais vides — c'est la <strong>fragmentation interne</strong>, l'écart entre ce qu'on réserve et ce qu'on remplit.</p><p>Sur des requêtes courtes face à un maximum élevé, cette perte domine : la majorité de la mémoire d'une allocation reste inutilisée pendant toute la vie de la requête. PagedAttention l'élimine en n'allouant un bloc que lorsque son token est effectivement généré (Schéma 3).</p>"
    },
    "frag-externe": {
      title: "Fragmentation externe",
      eyebrow: "Les trous entre requêtes",
      body: "<p>Quand des requêtes de tailles différentes occupent et libèrent des blocs contigus, il reste entre elles des <strong>trous</strong> de mémoire libre — trop petits, individuellement, pour accueillir une nouvelle requête contiguë.</p><p>La mémoire totale libre peut être abondante, mais inutilisable parce que dispersée : c'est la <strong>fragmentation externe</strong>, le même fléau que connaissent les allocateurs mémoire classiques. La pagination la supprime en renonçant à l'exigence de contiguïté physique : un bloc libre n'importe où est utilisable.</p>"
    },
    "cible-pagination": {
      title: "La cible : des blocs paginés",
      eyebrow: "Ce que vise la solution",
      body: "<p>La parade est connue depuis cinquante ans en systèmes d'exploitation : découper la mémoire en <strong>blocs de taille fixe</strong> (ici 16 tokens), alloués à la demande dans une mémoire physique non contiguë, et référençables par plusieurs requêtes.</p><p>Plus de réservation anticipée (on alloue token par token), plus de trous inutilisables (n'importe quel bloc libre convient), et possibilité de partage entre requêtes. Résultat visé et atteint par vLLM : <strong>gaspillage sous 4 %</strong>. Le mécanisme exact — la block table — est détaillé au Schéma 3.<a class='cite' data-cite='1' href='#source-1'>1</a></p>"
    }
  },
  "schema-03": {
    "blocs-logiques": {
      title: "La vue logique",
      eyebrow: "Contiguë, du point de vue de la requête",
      body: "<p>Du point de vue de la requête, son KV-cache est une suite <em>contiguë</em> de blocs logiques : bloc 0 = tokens 0-15, bloc 1 = tokens 16-31, etc. Le code d'attention raisonne sur cette vue continue, simple et inchangée.</p><p>C'est exactement l'abstraction qu'offre la mémoire virtuelle d'un OS à un programme : un espace d'adresses qui <em>paraît</em> continu, alors que la réalité physique est éparpillée. La requête ignore où ses blocs vivent vraiment — l'indirection s'en charge.</p>"
    },
    "block-table": {
      title: "La block table",
      eyebrow: "La traduction logique → physique",
      body: "<p>Chaque requête possède une <strong>block table</strong> : une table qui associe à chaque bloc logique (L0, L1…) l'adresse d'un bloc <em>physique</em> (P07, P02…) potentiellement n'importe où en mémoire.</p><p>C'est l'analogue exact de la table des pages d'un OS, qui traduit les adresses virtuelles en cadres physiques. L'indirection a un coût (une lecture de table par accès) mais débloque tout : allocation à la demande, fin de la fragmentation, et — surtout — la possibilité que deux tables pointent vers le <em>même</em> bloc physique, fondement du partage de préfixe.<a class='cite' data-cite='1' href='#source-1'>1</a></p>"
    },
    "blocs-physiques": {
      title: "La mémoire physique",
      eyebrow: "Éparse, sans contrainte de contiguïté",
      body: "<p>En mémoire réelle, les blocs d'une même requête sont <em>épars</em> : P07, P02, P09, P04 n'ont aucune raison d'être voisins. Un bloc se matérialise seulement quand son token est généré ; tant qu'il ne l'est pas, la mémoire reste disponible pour d'autres requêtes.</p><p>En supprimant l'exigence de contiguïté, PagedAttention ramène le gaspillage sous 4 % et augmente le débit d'un facteur 2 à 4 à latence égale — un gain entièrement dû à l'allocation, sans toucher un seul FLOP du calcul d'attention.<a class='cite' data-cite='1' href='#source-1'>1</a><a class='cite' data-cite='7' href='#source-7'>7</a></p>"
    },
    "copy-on-write": {
      title: "Copy-on-write",
      eyebrow: "Le partage de préfixe, gratuit",
      body: "<p>Comme un bloc physique peut être référencé par plusieurs block tables, deux requêtes qui partagent un préfixe (même system prompt, même contexte few-shot) pointent vers les <em>mêmes</em> blocs — un seul exemplaire en mémoire.</p><p>Tant qu'aucune ne modifie le bloc partagé, le partage tient. Dès qu'une branche écrit, le bloc est <strong>dupliqué à la volée</strong> (copy-on-write) et la table de l'écrivain bascule vers la copie. Conséquence directe : l'échantillonnage parallèle et le beam search, qui partagent un long préfixe pour <em>k</em> branches, deviennent quasi gratuits en mémoire.</p>"
    }
  },
  "schema-04": {
    "prefixe-systeme": {
      title: "Le préfixe système, racine chaude",
      eyebrow: "Partagé par toutes",
      body: "<p>Dans un service réel, des milliers de requêtes partagent le même <em>system prompt</em> : instructions, format de sortie, garde-fous. RadixAttention représente ce préfixe commun comme la <strong>racine chaude</strong> de l'arbre — calculé une fois, gardé en cache, réutilisé par tous.</p><p>Plus le préfixe partagé est long (agents avec de longues instructions, gabarits RAG), plus l'économie est grande : on ne recalcule jamais ce qui est commun, et la mémoire d'un seul exemplaire sert toute la flotte de requêtes.<a class='cite' data-cite='2' href='#source-2'>2</a></p>"
    },
    "branche-partagee": {
      title: "Branches mutualisées",
      eyebrow: "Few-shot, RAG, multi-tours",
      body: "<p>Sous la racine, l'arbre se ramifie : un jeu d'exemples few-shot ici, un document RAG là, partagés par les requêtes qui les utilisent. Chaque branche est un préfixe commun à un sous-ensemble de requêtes.</p><p>Une requête entrante descend l'arbre jusqu'au plus long préfixe déjà en cache, puis ne calcule que son <em>suffixe</em> propre. C'est la généralisation du partage : non plus seulement le system prompt, mais toute structure commune intermédiaire est mutualisée automatiquement, sans que l'application ait à la déclarer.<a class='cite' data-cite='2' href='#source-2'>2</a></p>"
    },
    "lru-eviction": {
      title: "Éviction LRU",
      eyebrow: "Libérer sans casser le partage",
      body: "<p>La mémoire est finie : il faut évincer. RadixAttention applique une politique <strong>LRU</strong> (least recently used) <em>au niveau des feuilles</em> — on libère les suffixes les moins récemment utilisés, les branches froides.</p><p>Le point clé : on n'évince jamais un nœud tant qu'il a des enfants actifs. Les préfixes chauds, partagés par de nombreuses requêtes, sont protégés ; seules les extrémités froides tombent. L'éviction respecte ainsi la structure de partage au lieu de la détruire — c'est ce qui rend le cache à la fois borné et durablement utile.</p>"
    },
    "cache-aware-scheduling": {
      title: "Cache-aware scheduling",
      eyebrow: "Le partage devient stratégie",
      body: "<p>Le dernier pas : l'ordonnanceur ne traite plus le partage comme une aubaine passive, mais comme un objectif. Il <strong>route</strong> chaque requête entrante vers le nœud de l'arbre où son préfixe est déjà chaud, maximisant le réutilisé et minimisant le recalcul.</p><p>Sur des charges à fort recouvrement de préfixe, ce couplage ordonnancement × cache multiplie le débit. Et il a une traduction commerciale directe : le <em>prompt caching</em> des API (Anthropic dès 2024, puis OpenAI, Google) facture les tokens lus en cache jusqu'à −90 % — le préfixe partagé est devenu une ligne de facturation.<a class='cite' data-cite='2' href='#source-2'>2</a><a class='cite' data-cite='12' href='#source-12'>12</a></p>"
    }
  },
  "schema-05": {
    "prefill-compute": {
      title: "Prefill : compute-bound",
      eyebrow: "Saturer les FLOPs",
      body: "<p>Le <strong>prefill</strong> traite tout le prompt d'entrée en une seule passe, tous les tokens en parallèle. Cette parallélisation sature les unités de calcul du GPU : la phase est <em>compute-bound</em>, limitée par les FLOPs disponibles.</p><p>Sur le roofline, le prefill se place près du plafond de calcul, à haute intensité arithmétique. C'est la phase « chère en calcul, brève » — elle produit le KV-cache de toute la requête d'un coup, puis cède la place au decode.<a class='cite' data-cite='4' href='#source-4'>4</a></p>"
    },
    "decode-memory": {
      title: "Decode : memory-bound",
      eyebrow: "Saturer la bande passante",
      body: "<p>Le <strong>decode</strong> génère les tokens un par un. Chaque pas ne fait qu'une ligne de calcul, mais doit <em>lire l'intégralité du KV-cache</em> accumulé. La phase est donc <em>memory-bound</em> : limitée par la bande passante mémoire, pas par les FLOPs.</p><p>Conséquence frappante : un GPU en decode pur utilise typiquement <strong>moins de 10 % de sa puissance de calcul</strong> tout en saturant sa bande passante — l'exact opposé du prefill. Cette asymétrie est la raison d'être de tout ce qui suit : si les deux phases ont des profils inverses, les faire cohabiter gaspille forcément l'une ou l'autre.<a class='cite' data-cite='3' href='#source-3'>3</a></p>"
    },
    "interference": {
      title: "L'interférence prefill/decode",
      eyebrow: "Le decode stalé par le prefill",
      body: "<p>Le <em>continuous batching</em> (Orca) regroupe les requêtes à l'échelle de l'itération. Mais quand une nouvelle requête arrive, son prefill lourd s'insère dans un lot de decodes légers et <strong>monopolise le GPU</strong> : les générations en cours se figent.</p><p>Tous les utilisateurs actifs subissent alors un pic de latence inter-token, le temps que le prefill passe. C'est l'<strong>interférence prefill/decode</strong> — un coût caché du batching naïf, d'autant plus pénalisant que les prompts sont longs. Deux familles de remèdes existent : découper le prefill (ci-contre), ou séparer physiquement les phases (Schéma 6).<a class='cite' data-cite='7' href='#source-7'>7</a></p>"
    },
    "chunked-prefill": {
      title: "Chunked prefill",
      eyebrow: "Le remède sans changer de matériel",
      body: "<p>Sarathi-Serve découpe un prefill long en <strong>morceaux</strong> de taille bornée, insérables un par un dans les lots de decode sans jamais les interrompre. L'ordonnancement devient <em>stall-free</em> : les decodes continuent à cadence régulière pendant que le prefill progresse par tranches.</p><p>Le gain est net : <strong>×2,6 à 3,7 de capacité de service</strong> face à vLLM (Mistral-7B et Yi-34B sur A100), sans aucune modification matérielle — uniquement de l'ordonnancement. C'est la solution « logicielle » au conflit, complémentaire de la désagrégation matérielle du Schéma 6.<a class='cite' data-cite='6' href='#source-6'>6</a></p>"
    }
  },
  "schema-06": {
    "pool-prefill": {
      title: "Le pool prefill",
      eyebrow: "Compute-optimisé",
      body: "<p>Premier pool de GPU, dédié au prefill. On le dimensionne et le parallélise pour le calcul : c'est là que les FLOPs comptent. Une requête y exécute son prefill, ce qui <em>produit</em> le KV-cache de tout son prompt.</p><p>Isolé du decode, ce pool peut tourner à pleine charge de calcul sans jamais figer une génération en cours. Sa configuration (parallélisme tensoriel, taille de lot) est réglée pour le profil compute-bound, indépendamment des contraintes du decode.<a class='cite' data-cite='3' href='#source-3'>3</a></p>"
    },
    "pool-decode": {
      title: "Le pool decode",
      eyebrow: "Mémoire-optimisé",
      body: "<p>Second pool, dédié à la génération token par token. On le dimensionne pour la <em>bande passante mémoire</em> et la capacité de KV-cache, puisque le decode est memory-bound. Il <em>consomme</em> le KV-cache reçu du pool prefill et produit le flux de tokens.</p><p>Parce qu'aucun prefill ne s'y insère, le decode tourne sans interférence : latence inter-token stable, débit prévisible. Chaque pool est ainsi optimisé pour son régime — c'est tout l'intérêt de la séparation.<a class='cite' data-cite='3' href='#source-3'>3</a></p>"
    },
    "kv-transfer": {
      title: "Le transfert du KV-cache",
      eyebrow: "Le coût explicite de la désagrégation",
      body: "<p>La séparation a un prix : le KV-cache produit côté prefill doit <strong>transiter</strong> jusqu'au pool decode — plusieurs gigaoctets d'états d'attention, sur le réseau, pour chaque requête.</p><p>Si le lien est lent, cette latence de transfert annule le gain de la désagrégation. D'où l'investissement massif de ces systèmes dans le transfert rapide (<em>RDMA</em>, NVLink) et la <em>localité</em> : placer le cache au plus près de là où il sera lu. La rareté du cache n'a pas disparu — elle s'est déplacée du GPU vers le réseau.<a class='cite' data-cite='4' href='#source-4'>4</a></p>"
    },
    "kvcache-pool": {
      title: "Le pool KVCache global",
      eyebrow: "L'architecture KVCache-centric de Mooncake",
      body: "<p>Mooncake pousse la logique à son terme : le KV-cache n'est plus attaché à un GPU mais vit dans un <strong>pool désagrégé</strong> qui exploite la DRAM, les SSD et le CPU sous-utilisés de tout le cluster — une hiérarchie HBM (chaud) → DRAM → SSD (froid).</p><p>Le placement du cache devient alors un problème d'ordonnancement de premier ordre. Résultat en production : <strong>+59 à +498 %</strong> de capacité effective selon la charge ; Mooncake sert Kimi sur des milliers de nœuds, &gt;100 milliards de tokens par jour. Le cache est devenu une ressource cluster à part entière, gérée comme telle.<a class='cite' data-cite='5' href='#source-5'>5</a></p>"
    }
  },
  "schema-07": {
    "gqa-mqa": {
      title: "GQA / MQA — moins de têtes KV",
      eyebrow: "Compression architecturale",
      body: "<p>La taille du cache est proportionnelle au nombre de têtes KV (<code>H_kv</code> dans la formule du Schéma 1). La <strong>MQA</strong> (Shazeer, 2019) fait partager une <em>seule</em> tête clé/valeur à toutes les têtes de requête — division maximale, mais perte de qualité notable.</p><p>La <strong>GQA</strong> (Ainslie, 2023) interpole avec <em>g</em> groupes de têtes KV, dosant le compromis. Devenue standard (Llama 2 70B et la plupart des modèles ouverts récents), c'est une compression décidée à l'<em>entraînement</em> : elle ne se règle pas à l'inférence.<a class='cite' data-cite='8' href='#source-8'>8</a><a class='cite' data-cite='9' href='#source-9'>9</a></p>"
    },
    "mla": {
      title: "MLA — un latent compressé",
      eyebrow: "Le pari DeepSeek",
      body: "<p>La Multi-head Latent Attention de DeepSeek-V2 change la nature de ce qu'on cache : au lieu des clés et valeurs pleines, on stocke un <strong>vecteur latent</strong> de basse dimension, dont K et V sont reconstruits à la volée au moment de l'attention.</p><p>Le cache rétrécit d'un <strong>ordre de grandeur</strong> tout en préservant la qualité de l'attention multi-têtes — un compromis remarquablement favorable, qui a fait de MLA un pilier de l'efficacité des modèles DeepSeek. Comme GQA, c'est une décision d'architecture, prise à l'entraînement.<a class='cite' data-cite='11' href='#source-11'>11</a></p>"
    },
    "quantization": {
      title: "Quantization — réduire les bits",
      eyebrow: "KIVI, 2-bit, runtime",
      body: "<p>Plutôt que de réduire le <em>nombre</em> d'éléments cachés, on réduit leur <em>précision</em>. KIVI quantifie le KV-cache en <strong>2 bits</strong>, sans fine-tuning, avec une stratégie asymétrique : clés quantifiées par canal, valeurs par token (les deux n'ont pas la même distribution).</p><p>Le cache rétrécit d'un facteur ~8 contre une dégradation marginale. Avantage décisif : c'est une technique <em>runtime</em>, applicable à un modèle déjà entraîné — contrairement à GQA et MLA. On peut donc l'empiler sur n'importe quel modèle existant.<a class='cite' data-cite='10' href='#source-10'>10</a></p>"
    },
    "eviction": {
      title: "Éviction — oublier des tokens",
      eyebrow: "H2O, StreamingLLM",
      body: "<p>Quatrième levier : ne pas tout garder. Tous les tokens passés ne pèsent pas également dans l'attention. <strong>H2O</strong> identifie les « heavy hitters » — tokens à fort poids d'attention — et évince les autres, bornant la taille du cache à budget fixe.</p><p>C'est l'oubli sélectif au niveau du cache, et son coût qualité <em>dépend de la tâche</em> : indolore quand l'information utile est concentrée, risqué quand un détail lointain redevient pertinent. Le sujet est traité en profondeur, sous l'angle mémoire agentique et régulatoire, dans le dossier <em>compaction-agentique</em>.<a class='cite' data-cite='13' href='#source-13'>13</a></p>"
    },
    "cout-qualite": {
      title: "L'axe porteur : mémoire ⇄ qualité",
      eyebrow: "Pas de balle d'argent",
      body: "<p>Les quatre leviers se lisent sur un même axe : chacun échange de la <em>mémoire économisée</em> contre un <em>risque de qualité</em>. GQA et MLA paient ce prix une fois à l'entraînement ; quantization et éviction le paient au runtime, modèle inchangé.</p><p>Aucun n'est universellement supérieur. La discipline d'ingénierie de 2026 ne consiste pas à élire un gagnant, mais à <strong>composer</strong> pagination + partage + désagrégation + compression selon le profil de charge réel. Le KV-cache se gère comme un portefeuille de compromis, pas comme un problème à résoudre une fois.</p>"
    }
  }
}
