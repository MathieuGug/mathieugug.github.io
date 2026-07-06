{
  "schema-01": {
    "marge-os": {
      title: "Le système d'exploitation",
      eyebrow: "La part réservée d'office",
      body: "<p>iOS ou Android réservent une large part de la RAM unifiée pour le noyau, les services de fond, le compositeur graphique et les applications actives. Sur un flagship de 12&nbsp;Go, l'ordre de grandeur réservé au système tourne autour de 5&nbsp;Go.</p><p>Ce n'est pas négociable : un modèle qui déborde de son enveloppe fait <em>tuer l'application hôte</em> par le gestionnaire mémoire. La contrainte est donc plus dure que le simple « combien de RAM ai-je » — c'est « combien puis-je réserver sans être expulsé ».</p>"
    },
    "app-buffer": {
      title: "L'application et son tampon",
      eyebrow: "Le voisin qui prend sa place",
      body: "<p>Le modèle ne tourne jamais seul : l'application hôte (clavier, navigateur, assistant) et son tampon graphique occupent eux aussi la mémoire unifiée pendant l'inférence.</p><p>C'est pourquoi l'enveloppe réellement disponible pour le modèle est bien inférieure à la RAM totale — quelques giga-octets au mieux, et souvent moins quand l'utilisateur a d'autres apps ouvertes.</p>"
    },
    "ram-totale": {
      title: "L'enveloppe allouable",
      eyebrow: "≈ 2 – 4 Go, pas 12",
      body: "<p>C'est le chiffre qui compte vraiment : l'espace qu'un modèle peut occuper <em>durablement</em> sans se faire expulser. Sur un appareil de 8 à 16&nbsp;Go, il tourne autour de 2 à 4&nbsp;Go<a class='cite' data-cite='12' href='#source-12'>12</a>.</p><p>Cette enveloppe, et non la taille théorique du modèle, définit ce qui est faisable. Elle explique directement pourquoi les modèles embarqués convergent vers ~3&nbsp;Md de paramètres : c'est le plus gros qui tient une fois quantifié à 4&nbsp;bits.</p>"
    },
    "poids-modele": {
      title: "Les poids en INT4",
      eyebrow: "1,5 Go pour un 3B",
      body: "<p>Un modèle de 3&nbsp;milliards de paramètres quantifié à 4&nbsp;bits pèse ~1,5&nbsp;Go — contre ~6&nbsp;Go en FP16. C'est la différence entre l'infaisable et le faisable.</p><p>Mais les poids ne sont pas seuls dans l'enveloppe : il faut aussi loger le KV-cache et les activations. C'est l'addition des trois qui doit tenir sous le plafond, pas les poids seuls.</p>"
    },
    "kv-cache": {
      title: "Le KV-cache",
      eyebrow: "Le poste qui grandit avec le contexte",
      body: "<p>Le cache clé-valeur mémorise les états des tokens déjà traités pour éviter de les recalculer. Son empreinte croît <em>linéairement</em> avec la longueur du contexte : plus la conversation est longue, plus il mange de RAM.</p><p>Sur un appareil, c'est un poste critique — et ce sera le poste dominant pour les agents on-device, dont les contextes sont longs. D'où l'intérêt du partage de KV-cache entre couches, comme le fait Apple<a class='cite' data-cite='1' href='#source-1'>1</a>.</p>"
    }
  },
  "schema-02": {
    "fp16": {
      title: "FP16 — la référence",
      eyebrow: "16 bits, 100 % de qualité",
      body: "<p>Le format de virgule flottante 16&nbsp;bits est celui de l'entraînement et de l'inférence non compressée : 2 octets par poids, aucune perte. C'est l'étalon de qualité contre lequel on mesure toutes les quantifications.</p><p>Son défaut : un modèle 3B y pèse ~6&nbsp;Go, hors de portée de l'enveloppe allouable d'un téléphone. Il faut descendre.</p>"
    },
    "int4-ptq": {
      title: "INT4 en post-training",
      eyebrow: "Le bon compromis, jusqu'à la falaise",
      body: "<p>La quantification post-entraînement (PTQ) en 4&nbsp;bits est bon marché et bien outillée : GGUF Q4_K_M pour le mobile, AWQ qui retient 97-99&nbsp;% de la qualité, GPTQ<a class='cite' data-cite='13' href='#source-13'>13</a>.</p><p>À 4&nbsp;bits, la qualité tient encore. Mais en dessous, la simple compression post-hoc s'effondre — c'est la « falaise ». Passer sous ce seuil demande une autre méthode : réentraîner (QAT) ou entraîner natif.</p>"
    },
    "qat": {
      title: "QAT — apprendre à résister",
      eyebrow: "2 à 5 points regagnés en bas",
      body: "<p>La quantification pendant l'entraînement (QAT) simule la perte de précision au fil de l'apprentissage : le modèle apprend à y résister. Plus coûteuse, elle récupère 2 à 5 points de qualité aux compressions extrêmes<a class='cite' data-cite='13' href='#source-13'>13</a>.</p><p>C'est la voie des acteurs qui maîtrisent le pipeline : Apple entraîne en QAT 2-bit puis recolle la qualité via des adaptateurs LoRA<a class='cite' data-cite='1' href='#source-1'>1</a> ; Meta combine QAT+LoRA et SpinQuant<a class='cite' data-cite='9' href='#source-9'>9</a>.</p>"
    },
    "ternaire": {
      title: "Le natif ternaire",
      eyebrow: "1,58 bit, haut malgré tout",
      body: "<p>BitNet ne compresse pas après coup : il <em>entraîne</em> directement des poids ternaires {−1, 0, +1}, soit ~1,58&nbsp;bit<a class='cite' data-cite='7' href='#source-7'>7</a>. Le modèle naît à basse précision, il n'a rien à « perdre ».</p><p>C'est ce qui lui permet de rester compétitif à une compression où la PTQ serait au fond de la falaise — tout en gagnant l'énergie et l'inférence CPU sans GPU.</p>"
    }
  },
  "schema-03": {
    "quantif": {
      title: "Levier 1 — la quantification",
      eyebrow: "Le prix d'entrée",
      body: "<p>Réduire les bits par poids (16 → 8 → 4) divise d'autant l'empreinte : facteur ×2 à ×8. C'est ce qui fait passer un 3B de 6&nbsp;Go à 1,5&nbsp;Go et le rend embarquable<a class='cite' data-cite='13' href='#source-13'>13</a>.</p><p>Son coût : la falaise de qualité sous 4&nbsp;bits, et une sensibilité inégale selon la tâche — code et maths souffrent plus que le résumé. C'est le levier obligatoire, mais pas suffisant pour aller très bas.</p>"
    },
    "matformer": {
      title: "MatFormer — le modèle matriochka",
      eyebrow: "Un jeu de poids, plusieurs tailles",
      body: "<p>Gemma 3n imbrique des sous-modèles plus petits dans un modèle plus grand, comme des poupées russes<a class='cite' data-cite='5' href='#source-5'>5</a>. On peut exécuter le seul cœur sans activer les couches englobantes.</p><p>Résultat : un même modèle offre plusieurs points de fonctionnement (calcul, latence, énergie) selon la difficulté de la requête — au lieu d'imposer une taille fixe. Le modèle s'adapte au budget disponible.</p>"
    },
    "ple": {
      title: "Per-Layer Embedding",
      eyebrow: "Décharger vers la RAM lente",
      body: "<p>Les tables d'embeddings sont volumineuses mais peu sollicitées à chaque instant. Gemma 3n les décharge vers la RAM lente et les réinjecte couche par couche<a class='cite' data-cite='4' href='#source-4'>4</a>.</p><p>Effet spectaculaire : E4B a 8&nbsp;Md de paramètres bruts mais ne tient que 3&nbsp;Go en mémoire de travail. Le principe est celui de tout le dossier : ce qui compte, c'est l'empreinte résidente, pas le décompte total.</p>"
    },
    "bitnet-natif": {
      title: "Levier 3 — le natif ternaire",
      eyebrow: "Trois gains d'un coup",
      body: "<p>BitNet b1.58 2B4T est entraîné directement en 1,58&nbsp;bit sur 4&nbsp;000&nbsp;Md tokens<a class='cite' data-cite='7' href='#source-7'>7</a>. Les poids ternaires remplacent les multiplications par des additions.</p><p>D'où trois gains simultanés : mémoire minimale, jusqu'à −82&nbsp;% d'énergie, et inférence CPU sans GPU — au point de faire tourner un modèle de 100&nbsp;Md sur un seul processeur à vitesse de lecture humaine<a class='cite' data-cite='8' href='#source-8'>8</a>. Le seul levier qui attaque les trois axes à la fois.</p>"
    }
  },
  "schema-04": {
    "npu": {
      title: "Le NPU",
      eyebrow: "L'efficacité énergétique",
      body: "<p>Le Neural Processing Unit est un accélérateur dédié aux réseaux de neurones, optimisé pour l'efficacité plutôt que la polyvalence. Phi-Silica y tourne à ~650&nbsp;tok/s pour ~1,5&nbsp;W, en libérant CPU et GPU<a class='cite' data-cite='6' href='#source-6'>6</a>.</p><p>Sur CPU, le même modèle ferait chauffer l'appareil et fondrait la batterie. Sur NPU, l'inférence devient une fonction de fond soutenable — condition sine qua non d'un usage permanent.</p>"
    },
    "bande-passante": {
      title: "La bande passante mémoire",
      eyebrow: "Le vrai goulot du décodage",
      body: "<p>À chaque token, tous les poids sont relus depuis la RAM. Le débit de génération est donc plafonné par la vitesse de ce transfert (~50-120&nbsp;Go/s sur mobile), pas par la puissance de calcul<a class='cite' data-cite='12' href='#source-12'>12</a>.</p><p>Conséquence : un NPU à 45&nbsp;TOPS relié à une RAM lente reste bridé par la RAM. C'est le prochain champ de bataille du silicium embarqué — plus de bande passante, pas plus de TOPS.</p>"
    },
    "apple-ane": {
      title: "Apple — la frontière qui se brouille",
      eyebrow: "Du Neural Engine aux cœurs GPU",
      body: "<p>Apple a cessé de publier un chiffre de TOPS pour le Neural Engine avec le M5 (octobre 2025) et route désormais une large part de l'IA on-device via des accélérateurs neuronaux intégrés à chaque cœur GPU<a class='cite' data-cite='11' href='#source-11'>11</a>.</p><p>Signe que la distinction nette NPU/GPU s'estompe : ce qui compte n'est plus l'unité nommée mais l'efficacité par watt de l'ensemble du SoC.</p>"
    },
    "hexagon": {
      title: "Qualcomm Hexagon — 45 TOPS",
      eyebrow: "Le socle des Copilot+ PC",
      body: "<p>Le NPU Hexagon des Snapdragon X annonce 45&nbsp;TOPS<a class='cite' data-cite='11' href='#source-11'>11</a> et sert de socle aux Copilot+ PC, avec Phi-Silica embarqué et une collaboration Windows AI Foundry<a class='cite' data-cite='6' href='#source-6'>6</a>.</p><p>Mais le TOPS vend le silicium ; il ne prédit pas le débit réel d'un LLM, plafonné par la mémoire. Les mesures sérieuses portent sur des tokens/seconde à budget énergétique donné.</p>"
    }
  },
  "schema-05": {
    "apple-fm": {
      title: "Apple Foundation ~3B",
      eyebrow: "QAT 2-bit, ~1 Go",
      body: "<p>Livré dans iOS via le Foundation Models framework, ~1&nbsp;Go d'empreinte grâce au QAT 2-bit, avec adaptateurs LoRA et KV-cache partagé<a class='cite' data-cite='1' href='#source-1'>1</a><a class='cite' data-cite='2' href='#source-2'>2</a>.</p><p>Apple revendique qu'il dépasse Phi-3-mini, Mistral-7B, Gemma-7B et Llama-3-8B — des modèles pourtant plus gros. Exemple type de l'acteur qui maîtrise tout le pipeline et mise sur le QAT.</p>"
    },
    "gemma3n": {
      title: "Gemma 3n E4B",
      eyebrow: "MatFormer + PLE",
      body: "<p>Décompte brut de 8&nbsp;Md, mais empreinte de 3&nbsp;Go grâce au MatFormer et au Per-Layer Embedding<a class='cite' data-cite='4' href='#source-4'>4</a>. Multimodal, taillé mobile-first par Google.</p><p>Illustration directe du principe du dossier : la stratégie n'est pas de réduire le modèle mais de réorganiser son occupation mémoire pour que l'empreinte résidente tienne dans l'enveloppe.</p>"
    },
    "phi-silica": {
      title: "Phi-Silica 3.3B",
      eyebrow: "Distillé, NPU-résident",
      body: "<p>Distillé de la famille Phi et optimisé pour le NPU Hexagon 45 TOPS, il est embarqué dans tous les Copilot+ PC : ~650&nbsp;tok/s à ~1,5&nbsp;W<a class='cite' data-cite='6' href='#source-6'>6</a>.</p><p>La stratégie Microsoft : ni QAT maison ni PTQ ouverte, mais une distillation ciblée sur un silicium précis. Le modèle et la puce sont co-conçus.</p>"
    },
    "bitnet": {
      title: "BitNet b1.58 2B4T",
      eyebrow: "Le seul natif ternaire",
      body: "<p>2&nbsp;Md de paramètres entraînés nativement en 1,58&nbsp;bit sur 4&nbsp;000&nbsp;Md tokens<a class='cite' data-cite='7' href='#source-7'>7</a>. Empreinte et énergie minimales, inférence CPU sans GPU<a class='cite' data-cite='8' href='#source-8'>8</a>.</p><p>L'outsider du paysage : il ne compresse pas un modèle existant, il en propose un nouveau né à basse précision. La trajectoire la plus prometteuse pour l'edge à moyen terme.</p>"
    }
  },
  "schema-06": {
    "on-device": {
      title: "Le modèle on-device",
      eyebrow: "Premier étage de la pile",
      body: "<p>Un modèle ~3B quantifié tourne localement : latence nulle, fonctionnement hors-ligne, données qui ne quittent pas l'appareil. Il traite ce qu'il fait bien — résumé, réécriture, réponses courtes.</p><p>Mais il ne remplace pas un modèle frontière pour les requêtes complexes. D'où la nécessité d'une frontière de décision : que garder ici, que faire escalader.</p>"
    },
    "critere-escalade": {
      title: "La frontière de décision",
      eyebrow: "Quatre critères d'escalade",
      body: "<p>Le routage arbitre quatre facteurs : la <strong>complexité</strong> (un raisonnement multi-étapes dépasse le modèle local), la <strong>confidentialité</strong> (les données sensibles restent par défaut sur l'appareil), l'<strong>état réseau</strong> (hors-ligne force le local), et le <strong>budget énergétique</strong> (une longue génération sur NPU peut coûter plus qu'un aller-retour réseau).</p><p>Ce routage est le véritable produit de l'IA embarquée — pas le petit modèle pris isolément.</p>"
    },
    "pcc-attestation": {
      title: "Le nœud attesté",
      eyebrow: "Vérifier plutôt que faire confiance",
      body: "<p>Avec Private Cloud Compute, l'appareil chiffre la charge utile uniquement vers les clés publiques des nœuds dont la mesure attestée figure dans un journal de transparence public<a class='cite' data-cite='3' href='#source-3'>3</a>.</p><p>L'utilisateur n'a plus à croire le fournisseur sur parole : il peut vérifier qu'aucun logiciel non attesté ne verra ses données. La confidentialité devient une propriété démontrable, pas une clause contractuelle.</p>"
    },
    "stateless": {
      title: "Sans état",
      eyebrow: "« No privileged access »",
      body: "<p>Les serveurs PCC sont sans état : les données ne sont jamais stockées, elles ne servent qu'à la requête en cours<a class='cite' data-cite='3' href='#source-3'>3</a>. La conception exclut explicitement l'accès administrateur (« no privileged access »).</p><p>S'y ajoute un registre matériel append-only à double racine de confiance contre les attaques de chaîne d'approvisionnement. L'ensemble fait de la cloud-AI un prolongement vérifiable du traitement local, pas une boîte noire.</p>"
    }
  },
  "schema-07": {
    "ternaire-2027": {
      title: "Le natif ternaire se généralise",
      eyebrow: "Trajectoire 1",
      body: "<p>BitNet a montré qu'entraîner directement en 1,58&nbsp;bit bat la compression post-hoc sur les trois axes de l'edge : mémoire, énergie, indépendance au GPU<a class='cite' data-cite='7' href='#source-7'>7</a><a class='cite' data-cite='8' href='#source-8'>8</a>.</p><p>À attendre : des modèles ternaires natifs plus gros et multimodaux, avec des kernels CPU dédiés qui feront du NPU un luxe plutôt qu'une nécessité pour une partie des charges.</p>"
    },
    "npu-first": {
      title: "Le NPU, unité première",
      eyebrow: "Trajectoire 2",
      body: "<p>Le brouillage Apple entre Neural Engine et cœurs GPU<a class='cite' data-cite='11' href='#source-11'>11</a>, la course aux TOPS de Qualcomm et l'intégration Windows AI Foundry<a class='cite' data-cite='6' href='#source-6'>6</a> convergent vers un SoC où l'inférence neuronale est un citoyen de première classe.</p><p>Le prochain champ de bataille n'est pas le TOPS mais la bande passante mémoire — la ressource qui plafonne réellement le débit.</p>"
    },
    "agents-local": {
      title: "Les agents on-device",
      eyebrow: "Trajectoire 3",
      body: "<p>Passer d'un chatbot local à un agent local — qui appelle des outils, lit l'écran, enchaîne des étapes — change la donne mémoire : le KV-cache d'un contexte agentique long devient le poste dominant.</p><p>Cela rejoint directement les problématiques de compaction et de gestion du cache déjà critiques côté datacenter, mais sous une contrainte d'octets bien plus dure.</p>"
    },
    "regulation": {
      title: "La confidentialité, levier réglementaire",
      eyebrow: "Trajectoire 4",
      body: "<p>Le traitement local est, du point de vue du RGPD, une forme de <em>minimisation</em> : ce qui ne quitte jamais l'appareil n'est pas un transfert de données.</p><p>Combiné à l'attestation vérifiable de PCC<a class='cite' data-cite='3' href='#source-3'>3</a>, cela transforme la privacy d'une clause de confiance en une propriété démontrable — un angle que la régulation européenne (RGPD, AI Act) est outillée pour récompenser. L'IA embarquée devient une architecture de la confiance.</p>"
    }
  }
}
