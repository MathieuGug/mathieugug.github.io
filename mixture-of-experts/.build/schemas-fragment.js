{
  "schema-01": {
    "dense-block": {
      title: "Le FFN dense",
      eyebrow: "100 % actif par token",
      body: "<p>Dans un transformer dense, le sous-bloc <em>feed-forward</em> de chaque couche est appliqué à chaque token avec la totalité de ses paramètres. Le nombre de FLOPs par token est, à l'ordre un, proportionnel au nombre de paramètres — c'est la loi d'airain que la MoE brise.</p><p>Conséquence : doubler la capacité d'un dense double sa facture de calcul, en entraînement comme en inférence. Il n'y a aucun moyen d'ajouter du savoir sans ajouter du calcul.</p>"
    },
    "router": {
      title: "Le routeur",
      eyebrow: "Une projection minuscule",
      body: "<p>Le routeur est une simple projection linéaire suivie d'un softmax : à partir du vecteur d'un token, il attribue un score à chacun des N experts et sélectionne les k meilleurs. Il ne pèse que quelques milliers de paramètres — négligeable devant les milliards des experts.</p><p>C'est pourtant lui qui détermine toute la dynamique du modèle : mal réglé, il provoque l'effondrement du routage (Schéma 3).</p>"
    },
    "active-expert": {
      title: "Les k experts actifs",
      eyebrow: "Le calcul réellement effectué",
      body: "<p>Seuls les k experts sélectionnés (ici k=2) traitent le token ; leurs sorties sont sommées, pondérées par les scores de gate. C'est <em>ce</em> calcul, et lui seul, qui compte dans la facture de FLOPs.</p><p>Chez DeepSeek-V3, k=8 experts routés (+1 partagé) sur 256 sont activés : 37 Md de paramètres actifs pour 671 Md au total<a class=\"cite\" data-cite=\"8\" href=\"#source-8\">8</a>.</p>"
    },
    "dormant-expert": {
      title: "Les N−k experts dormants",
      eyebrow: "Résidents mais inertes",
      body: "<p>Pour ce token, les autres experts restent inertes — zéro FLOP. Mais ils doivent tous rester <em>résidents en mémoire</em>, prêts à être appelés par le prochain token. C'est là que se cache la vraie facture de la MoE : l'empreinte VRAM est celle du modèle total, pas des paramètres actifs (Schéma 4).</p>"
    }
  },
  "schema-02": {
    "gate": {
      title: "Le gate (routeur)",
      eyebrow: "Linéaire → softmax → N scores",
      body: "<p>Le gate projette le vecteur du token sur N dimensions (une par expert) et applique un softmax pour obtenir une distribution de confiance. Les scores serviront à la fois à choisir les experts et à pondérer leurs sorties.</p><p>GShard a formalisé cette mécanique à grande échelle<a class=\"cite\" data-cite=\"2\" href=\"#source-2\">2</a> ; Switch Transformer l'a simplifiée à k=1<a class=\"cite\" data-cite=\"3\" href=\"#source-3\">3</a>.</p>"
    },
    "topk": {
      title: "La sélection top-k",
      eyebrow: "k=1 (Switch) ou k=2 (Mixtral)",
      body: "<p>On ne garde que les k experts aux plus hauts scores. k=1 (Switch Transformer) maximise l'efficacité de calcul ; k=2 (Mixtral, la plupart des modèles) offre une meilleure qualité au prix d'un calcul doublé.</p><p>DeepSeek-V3 pousse à k=8 experts routés fins — la granularité élevée rend chaque expert peu coûteux, donc en activer beaucoup reste abordable.</p>"
    },
    "expert-ffn": {
      title: "Les experts (FFN)",
      eyebrow: "N réseaux indépendants",
      body: "<p>Chaque expert est un FFN complet avec ses propres poids. Les experts non sélectionnés ne calculent rien pour ce token, mais occupent tous la mémoire.</p><p>Contrairement à une intuition répandue, les experts ne se spécialisent pas en domaines sémantiques lisibles : ils captent surtout des motifs syntaxiques de bas niveau<a class=\"cite\" data-cite=\"6\" href=\"#source-6\">6</a>.</p>"
    },
    "combine": {
      title: "La combinaison pondérée",
      eyebrow: "Σ gᵢ · Eᵢ(x)",
      body: "<p>Les sorties des k experts sélectionnés sont sommées, chacune pondérée par son score de gate (renormalisé sur les k retenus). Le résultat remplace la sortie qu'aurait produite un FFN dense unique.</p><p>Le reste du bloc transformer (attention, normalisations, résiduel) est inchangé — seul le FFN devient une couche MoE.</p>"
    }
  },
  "schema-03": {
    "collapse": {
      title: "L'effondrement du routage",
      eyebrow: "Rich-get-richer",
      body: "<p>Cercle vicieux d'auto-renforcement : un expert légèrement favorisé reçoit plus de tokens, s'entraîne plus vite, devient meilleur, et attire encore plus de trafic. À terme, une poignée d'experts capte tout et les autres restent morts.</p><p>Le modèle a nominalement N experts mais n'en exploite qu'une fraction — le pire des deux mondes : l'empreinte mémoire du total, la capacité effective d'une poignée.</p>"
    },
    "aux-loss": {
      title: "La perte auxiliaire",
      eyebrow: "coût += λ · L équilibrage",
      body: "<p>On ajoute au coût un terme qui pénalise le déséquilibre de charge, forçant le routeur à répartir les tokens. Efficace, mais c'est un compromis : ce terme entre en tension avec la perplexité — on route parfois un token vers un expert sous-optimal juste pour l'équilibre.</p><p>ST-MoE y ajoute le <em>router z-loss</em> qui stabilise l'amplitude des logits<a class=\"cite\" data-cite=\"4\" href=\"#source-4\">4</a>. DeepSeek supprime carrément la perte auxiliaire au profit d'un biais dynamique par expert<a class=\"cite\" data-cite=\"8\" href=\"#source-8\">8</a>.</p>"
    },
    "capacity-drop": {
      title: "Capacité et token dropping",
      eyebrow: "Le plafond par expert",
      body: "<p>Pour paralléliser, on fixe une capacité maximale par expert. Les tokens excédentaires sont <em>droppés</em> : ils sautent la couche MoE via le résiduel, sans être traités — une perte de qualité silencieuse.</p><p>MegaBlocks reformule la MoE comme une multiplication matricielle creuse par blocs, traitant tous les tokens sans capacité fixe ni drop<a class=\"cite\" data-cite=\"9\" href=\"#source-9\">9</a>.</p>"
    },
    "expert-choice": {
      title: "Le routage par les experts",
      eyebrow: "Expert choice",
      body: "<p>Renversement : au lieu que chaque token choisisse ses k experts, chaque expert choisit ses top-k tokens<a class=\"cite\" data-cite=\"5\" href=\"#source-5\">5</a>. L'équilibrage devient parfait par construction (chaque expert reçoit exactement sa capacité).</p><p>Contrepartie : un token peut être choisi par zéro, un ou plusieurs experts — ce qui casse la garantie d'un traitement uniforme et complique l'inférence auto-régressive.</p>"
    }
  },
  "schema-04": {
    "dispatch": {
      title: "Le dispatch des tokens",
      eyebrow: "Tokens ≠ experts co-localisés",
      body: "<p>Les tokens arrivent en batch sur chaque GPU, mais leurs experts cibles sont répartis sur d'autres GPU (expert parallelism). Il faut donc réacheminer chaque token vers l'accélérateur qui héberge son expert.</p><p>C'est une opération collective <em>all-to-all</em> : chaque GPU envoie une part de ses tokens à tous les autres.</p>"
    },
    "alltoall": {
      title: "Le goulot all-to-all",
      eyebrow: "Le réseau dicte le débit",
      body: "<p>À grande échelle, l'échange all-to-all — chaque GPU parle à tous les autres — devient le poste dominant, devant le calcul lui-même<a class=\"cite\" data-cite=\"2\" href=\"#source-2\">2</a>. La bande passante d'interconnexion (NVLink, InfiniBand) et sa latence gouvernent le débit.</p><p>Une part majeure de l'ingénierie MoE consiste à chevaucher cet échange avec le calcul pour le masquer — c'est le rôle du schéma DualPipe de DeepSeek<a class=\"cite\" data-cite=\"8\" href=\"#source-8\">8</a>.</p>"
    },
    "expert-compute": {
      title: "Les experts résidents",
      eyebrow: "Empreinte = total, pas actif",
      body: "<p>Chaque GPU héberge un sous-ensemble d'experts, tous résidents en VRAM. L'empreinte mémoire agrégée est celle du modèle <em>total</em> (ex. 671 Md pour DeepSeek-V3), même si seuls quelques experts s'activent par token.</p><p>C'est ce qui rend les MoE difficiles à servir sur du matériel modeste et motive l'offloading CPU/SSD des experts inactifs.</p>"
    },
    "combine-a2a": {
      title: "Le combine : second all-to-all",
      eyebrow: "Coût doublé, à chaque couche",
      body: "<p>Une fois les experts calculés, les sorties doivent revenir vers le GPU d'origine de chaque token : c'est un <em>second</em> all-to-all, le trajet retour. Le coût de communication est donc payé deux fois par couche MoE.</p><p>Multiplié par la profondeur du modèle, ce va-et-vient explique pourquoi servir une MoE est d'abord un problème de plomberie réseau.</p>"
    }
  },
  "schema-05": {
    "shared-expert": {
      title: "L'expert partagé",
      eyebrow: "Toujours actif",
      body: "<p>Certaines connaissances (grammaire, tokens fréquents) servent à <em>tous</em> les tokens. Dans une MoE classique, chaque expert doit les réapprendre — capacité gaspillée. DeepSeek isole ce socle dans un expert partagé, toujours activé en plus des experts routés<a class=\"cite\" data-cite=\"7\" href=\"#source-7\">7</a>.</p><p>Les experts routés sont alors libérés pour se spécialiser sur le savoir différenciant.</p>"
    },
    "fine-grained": {
      title: "Les experts fins",
      eyebrow: "Découper pour combiner",
      body: "<p>À budget de paramètres et de calcul constant, on découpe chaque gros expert en plusieurs experts plus petits<a class=\"cite\" data-cite=\"7\" href=\"#source-7\">7</a>. Chaque expert devient peu coûteux, donc on peut en activer davantage (k plus grand) et composer des « spécialistes » beaucoup plus finement.</p><p>DeepSeek-V3 : 256 experts routés fins, k=8 activés.</p>"
    },
    "routed": {
      title: "Les experts routés actifs",
      eyebrow: "k=8 sur 256",
      body: "<p>Pour chaque token, le routeur sélectionne 8 experts fins parmi 256. Avec un expert partagé toujours actif, le token voit donc 9 FFN au total — mais chacun est petit, d'où 37 Md de paramètres actifs seulement.</p><p>L'équilibrage se fait sans perte auxiliaire, via un biais dynamique par expert<a class=\"cite\" data-cite=\"8\" href=\"#source-8\">8</a>.</p>"
    },
    "combinations": {
      title: "L'explosion combinatoire",
      eyebrow: "C(256,8) ≈ 4 × 10¹⁴",
      body: "<p>Le gain de la granularité est combinatoire : passer de 8 experts top-2 (28 combinaisons) à 256 experts top-8 fait exploser le nombre de « spécialistes » composables de plusieurs ordres de grandeur.</p><p>C'est cette richesse combinatoire — pas des experts individuellement plus savants — qui explique la supériorité empirique du fine-grained, confirmée par les ablations OLMoE<a class=\"cite\" data-cite=\"12\" href=\"#source-12\">12</a>.</p>"
    }
  },
  "schema-06": {
    "dense-curve": {
      title: "La courbe dense",
      eyebrow: "params ∝ FLOPs",
      body: "<p>Pour un dense, ajouter des paramètres impose d'ajouter des FLOPs par token. À budget de calcul fixe, il bute donc à une taille maximale — il ne peut pas « ranger » plus de savoir sans payer plus cher chaque token.</p>"
    },
    "sparse-curve": {
      title: "La courbe sparse",
      eyebrow: "params découplés des FLOPs",
      body: "<p>La MoE découple les deux : à FLOPs par token constants, on peut empiler bien plus de paramètres totaux. La courbe sparse descend donc plus bas en perte que la dense à budget de calcul égal<a class=\"cite\" data-cite=\"3\" href=\"#source-3\">3</a>.</p><p>C'est la démonstration empirique que la sparsité est un levier d'échelle, pas juste une astuce d'implémentation.</p>"
    },
    "granularity": {
      title: "La granularité",
      eyebrow: "Une dimension supplémentaire",
      body: "<p>Krajewski et al. ajoutent aux lois d'échelle un troisième paramètre : la granularité (la finesse du découpage en experts)<a class=\"cite\" data-cite=\"11\" href=\"#source-11\">11</a>. Résultat clé : la granularité optimale <em>croît</em> avec l'échelle du modèle.</p><p>Plus un modèle est grand, plus il gagne à être découpé en experts fins et nombreux — la justification théorique de la trajectoire DeepSeek.</p>"
    },
    "optimal": {
      title: "L'optimum isoFLOP",
      eyebrow: "Le bon point de fonctionnement",
      body: "<p>Pour un budget de calcul donné, il existe une configuration optimale (nombre total de paramètres, nombre d'experts, granularité, k) qui minimise la perte. Ce point se déplace vers plus de paramètres et plus de granularité à mesure que le budget croît.</p><p>Concevoir une MoE, c'est calibrer ce point — pas choisir binairement dense ou sparse.</p>"
    }
  },
  "schema-07": {
    "mixtral-row": {
      title: "Mixtral 8×7B",
      eyebrow: "Le déclencheur grand public · janvier 2024",
      body: "<p>La première MoE ouverte vraiment compétitive : 8 experts, top-2, ~47 Md totaux pour ~13 Md actifs<a class=\"cite\" data-cite=\"6\" href=\"#source-6\">6</a>. Pas d'expert partagé, granularité grossière — mais des poids ouverts qui ont démocratisé l'architecture.</p><p>Son analyse a aussi démonté le mythe des experts sémantiques : la spécialisation observée est surtout syntaxique.</p>"
    },
    "deepseek-row": {
      title: "DeepSeek-V3",
      eyebrow: "L'état de l'art ouvert",
      body: "<p>671 Md totaux / 37 Md actifs, 256 experts fins + 1 partagé, k=8, équilibrage sans perte auxiliaire<a class=\"cite\" data-cite=\"8\" href=\"#source-8\">8</a>. La synthèse de la ligne DeepSeekMoE<a class=\"cite\" data-cite=\"7\" href=\"#source-7\">7</a>, combinée à la MLA et à la prédiction multi-token.</p><p>La référence de facto pour une MoE de frontière en accès ouvert.</p>"
    },
    "llama4-row": {
      title: "Llama 4 Maverick",
      eyebrow: "MoE + expert partagé chez Meta",
      body: "<p>~400 Md totaux / 17 Md actifs, 128 experts routés + 1 partagé, routage peu profond (k=1 routé)<a class=\"cite\" data-cite=\"7\" href=\"#source-7\">7</a>. Meta adopte la combinaison fine-grained + shared, confirmant sa généralisation au-delà de DeepSeek.</p><p>Signe que le motif architectural s'est standardisé chez les grands laboratoires.</p>"
    },
    "olmoe-row": {
      title: "OLMoE-1B-7B",
      eyebrow: "100 % ouvert — le banc d'essai",
      body: "<p>6,9 Md totaux / 1,3 Md actifs, 64 experts fins, k=8<a class=\"cite\" data-cite=\"12\" href=\"#source-12\">12</a>. Unique par son ouverture totale — poids, données, code, logs d'entraînement — ce qui en fait le laboratoire reproductible de la recherche MoE.</p><p>Ses ablations valident empiriquement le fine-grained, la granularité élevée et l'effet marginal des experts partagés à petite échelle.</p>"
    }
  }
}
