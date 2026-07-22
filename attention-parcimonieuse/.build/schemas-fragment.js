{
  "schema-01": {
    "cout-dense": {
      title: "Attention dense — O(n²)",
      body: `<p>Chaque token de requête calcule un score avec <em>chacun</em> des n tokens de clé : la matrice d'attention compte n² entrées. Doubler le contexte quadruple le calcul et l'empreinte des scores. À 128 000 tokens, une seule tête manipule plus de seize milliards de scores.</p><p>C'est le « péché originel » du Transformer : exact, mais quadratique. Toute la recherche sur l'attention efficace cherche à en sortir sans sacrifier la qualité<a class="cite" data-cite="1" href="#source-1">1</a>.</p>`
    },
    "cout-sparse": {
      title: "Attention parcimonieuse — O(n·k)",
      body: `<p>Si chaque requête ne regardait que <em>k</em> clés soigneusement choisies au lieu des n, le coût tomberait à n·k — <strong>linéaire</strong> en longueur dès que k est fixe. C'est le pari de toute la parcimonie.</p><p>Toute la difficulté est dans le choix des k clés : bien choisir (qualité préservée), et choisir <em>vite</em> — un mécanisme de sélection plus coûteux que l'économie réalisée annulerait le gain.</p>`
    },
    "point-bascule": {
      title: "Le point de bascule",
      body: `<p>À court contexte, dense et parcimonieux se valent — l'écart est négligeable. C'est au-delà d'un certain seuil de longueur que la courbe quadratique décolle et rend le long contexte inabordable en dense.</p><p>La parcimonie ne « gagne » donc pas partout : elle devient décisive exactement là où l'on en a besoin, sur les très longues séquences (documents, bases de code, longues chaînes de raisonnement).</p>`
    },
    "prefill-vs-decode": {
      title: "Prefill vs decode — deux goulots distincts",
      body: `<p>Le <span class="term" data-tooltip="Lecture parallèle du prompt d'entrée.">prefill</span> est <strong>borné par le calcul</strong> : c'est là que le O(n²) mord, et c'est ce que la parcimonie attaque. Le <span class="term" data-tooltip="Génération token par token.">decode</span> est <strong>borné par la mémoire</strong> : c'est la taille du KV-cache qui plafonne, objet des dossiers <code>kv-cache</code> et <code>compression-kv-cache</code>.</p><p>Confondre les deux mène à optimiser le mauvais goulot. Ce dossier traite du calcul de l'attention ; les précédents traitaient de la mémoire du cache<a class="cite" data-cite="1" href="#source-1">1</a>.</p>`
    }
  },
  "schema-02": {
    "motifs-fixes": {
      title: "Génération 1 — les motifs fixes",
      body: `<p>2019-2020 : la parcimonie est un <strong>motif conçu à la main</strong>, gravé dans l'architecture. Le concepteur décide à l'avance où l'attention doit se porter — une fenêtre locale, quelques tokens globaux, un peu d'aléatoire.</p><p>Ces motifs excellent en encodage (classification de longs documents) mais résistent mal au décodage génératif, où la structure des dépendances varie d'un token et d'une tâche à l'autre. Un biais inductif imposé de l'extérieur.</p>`
    },
    "sparse-transformers": {
      title: "Sparse Transformers (2019)",
      body: `<p>Le point de départ. OpenAI factorise l'attention en deux passes — une attention par blocs locaux (<em>strided</em>) et une attention sur des positions fixes (<em>fixed</em>) — ramenant le coût de O(n²) à O(n·√n)<a class="cite" data-cite="6" href="#source-6">6</a>.</p><p>Utilisé pour générer images, texte et audio à longue portée. C'est la première démonstration qu'un motif épars bien choisi préserve la qualité générative.</p>`
    },
    "bigbird-theorie": {
      title: "BigBird — la garantie théorique",
      body: `<p>BigBird combine trois ingrédients : fenêtre glissante, tokens à attention globale, et connexions <strong>aléatoires</strong>. Sa contribution majeure est théorique : ce triptyque préserve les propriétés du Transformer dense — c'est un <strong>approximateur universel</strong> de fonctions séquence-à-séquence, et il est Turing-complet<a class="cite" data-cite="8" href="#source-8">8</a>.</p><p>Autrement dit, on peut être épars sans rien perdre en puissance d'expression — à condition de garder un peu d'aléatoire pour connecter le graphe.</p>`
    },
    "bascule-apprise": {
      title: "La bascule de 2024-2025",
      body: `<p>Le renversement : <em>laisser le modèle décider où regarder</em>. Le motif n'est plus gravé dans l'architecture ; il est calculé selon l'entrée, voire appris par descente de gradient.</p><p>Le clivage porteur n'est pas « fixe contre dynamique » — c'est <strong>où la décision est prise</strong> : à la conception (gén. 1), à l'inférence sur un modèle figé (MInference, éviction), ou à l'entraînement du modèle lui-même (NSA, MoBA, DSA). C'est cette dernière voie que le dossier lit serré.</p>`
    }
  },
  "schema-03": {
    "quadrant-posthoc": {
      title: "Colonne « post-hoc » — décidé à l'inférence",
      body: `<p>La parcimonie est appliquée à un modèle <strong>déjà entraîné, aux poids figés</strong>. La plus répandue car la moins coûteuse. MInference reconnaît en ligne des motifs dans le prefill<a class="cite" data-cite="5" href="#source-5">5</a> ; Quest sélectionne des pages de cache selon la requête<a class="cite" data-cite="14" href="#source-14">14</a>.</p><p>Déployable immédiatement, mais avec un plafond : le modèle n'a jamais été entraîné à vivre avec ces trous.</p>`
    },
    "quadrant-entraine": {
      title: "Colonne « natif » — décidé à l'entraînement",
      body: `<p>La parcimonie est présente <strong>dès le pré-entraînement</strong> (NSA, MoBA) ou distillée dans le modèle (SeerAttention, DSA). Le trou n'est plus une surprise d'inférence : c'est le régime nominal, que le modèle apprend à honorer.</p><p>Coût d'entrée plus élevé (entraînement ou distillation), mais qualité préservée et généralisation robuste. C'est la thèse du dossier : cette colonne domine la précédente pour les mêmes raisons que MLA domine GQA.</p>`
    },
    "risque-ood": {
      title: "Le risque hors distribution (OOD)",
      body: `<p>L'éviction gloutonne — H2O garde les <span class="term" data-tooltip="Tokens dont les scores d'attention cumulés dominent.">heavy hitters</span><a class="cite" data-cite="12" href="#source-12">12</a>, StreamingLLM borne aux <span class="term" data-tooltip="Premiers tokens, puits d'attention par défaut.">puits</span> + fenêtre<a class="cite" data-cite="11" href="#source-11">11</a> — jette de l'information de façon irréversible.</p><p>Tant que la devinette est juste, tout va bien. Mais un token évincé qui redevient pertinent 10 000 positions plus loin place le modèle <strong>hors distribution</strong> : il n'a jamais vu ce cas à l'entraînement, et l'information est perdue. C'est le défaut structurel que la parcimonie entraînée supprime.</p>`
    },
    "analogie-mla": {
      title: "L'analogie MLA / GQA",
      body: `<p>Le dossier <code>compression-kv-cache</code> montrait que <span class="term" data-tooltip="Compression latente conjointe, apprise et intégrée à l'objectif.">MLA</span> (compression apprise) domine <span class="term" data-tooltip="Partage de têtes, souvent appliqué par uptraining.">GQA</span> (compression simple) parce qu'elle est <em>intégrée à l'objectif d'entraînement</em>.</p><p>La même logique s'applique un cran plus loin, sur le calcul plutôt que la mémoire : <strong>la parcimonie native est à l'éviction ce que MLA est à GQA</strong>. Ce n'est pas une optimisation de plus — c'est déplacer la décision vers l'endroit où le modèle peut l'internaliser.</p>`
    }
  },
  "schema-04": {
    "branche-compression": {
      title: "Branche 1 — compression",
      body: `<p>Le passé est découpé en blocs contigus ; un petit réseau appris résume chaque bloc en un <strong>unique token compressé</strong>. La requête attend ces résumés grossiers : une vue basse résolution de <em>tout</em> le contexte, pour un coût divisé par la taille de bloc.</p><p>C'est la vue d'ensemble bon marché — elle ne rate rien globalement, mais manque de finesse. Elle sert aussi à alimenter la branche de sélection.</p>`
    },
    "branche-selection": {
      title: "Branche 2 — sélection top-n",
      body: `<p>Le cœur de la précision de NSA. Les scores de compression <em>classent</em> les blocs ; on retient les <strong>top-n</strong> les plus prometteurs et on y applique une attention <strong>fine, pleine résolution</strong>.</p><p>Le modèle regarde donc finement là où le résumé grossier lui a signalé de l'information. Point clé : cette sélection est <span class="term" data-tooltip="Le gradient traverse l'opération : elle s'apprend au lieu d'être fixée.">différentiable</span>, si bien que représenter et sélectionner s'apprennent ensemble<a class="cite" data-cite="2" href="#source-2">2</a>.</p>`
    },
    "branche-fenetre": {
      title: "Branche 3 — fenêtre glissante",
      body: `<p>La garantie du local. Un accès direct aux tokens les plus récents, que les deux premières branches (résumés grossiers, blocs distants sélectionnés) pourraient négliger.</p><p>C'est l'héritage assumé de Longformer et StreamingLLM : le voisinage immédiat compte presque toujours, autant le câbler explicitement plutôt que d'espérer que la sélection le retrouve.</p>`
    },
    "gate-appris": {
      title: "Le gate appris",
      body: `<p>Les trois branches produisent chacune une sortie d'attention ; un <strong>gate appris</strong> les pondère, <em>par requête</em>. Selon le token courant, le modèle donne plus de poids au résumé global, à la sélection fine ou au voisinage local.</p><p>C'est ce qui fait de NSA un mécanisme unifié et non trois heuristiques juxtaposées : la combinaison elle-même est optimisée par descente de gradient.</p>`
    },
    "hardware-align": {
      title: "Natively trainable · hardware-aligned",
      body: `<p>Deux propriétés font la force de NSA. <strong>Nativement entraînable</strong> : le gradient traverse la sélection par blocs, donc la parcimonie s'apprend au lieu d'être plaquée. <strong>Aligné matériel</strong> : les noyaux GPU sont conçus pour que la sélection par blocs produise des accès mémoire contigus et une intensité arithmétique équilibrée, dans l'esprit de FlashAttention<a class="cite" data-cite="10" href="#source-10">10</a>.</p><p>Sans cet alignement, un motif épars mais irrégulier peut être <em>plus lent</em> que le dense sur GPU. Résultat : qualité ≥ dense, et jusqu'à 11× plus vite sur 64k, ACL 2025 Best Paper<a class="cite" data-cite="2" href="#source-2">2</a>.</p>`
    }
  },
  "schema-05": {
    "blocs-experts": {
      title: "Les blocs comme experts",
      body: `<p>L'intuition de MoBA : et si les blocs de contexte étaient des <strong>experts</strong>, comme dans un <span class="term" data-tooltip="Architecture où un routeur envoie chaque token vers un petit sous-ensemble d'experts FFN.">mixture-of-experts</span> ? Le contexte est découpé en blocs ; seuls quelques-uns sont calculés pour une requête donnée, les autres sont ignorés — l'économie.</p><p>Le parallèle avec <code>melange-experts</code> est direct : là où le MoE route un token vers k experts FFN, MoBA route une requête vers k blocs de contexte<a class="cite" data-cite="3" href="#source-3">3</a>.</p>`
    },
    "routeur-topk": {
      title: "Le routeur top-k",
      body: `<p>Pour chaque requête, un routeur léger calcule une affinité avec chaque bloc (score entre la requête et une représentation résumée du bloc), puis sélectionne le <strong>top-k</strong>. L'attention n'est calculée que sur ces blocs.</p><p>La parcimonie devient un problème de <strong>routage appris</strong> — avec ses vertus (capacité découplée du calcul) et ses écueils hérités du MoE (l'équilibrage de charge entre blocs, pour éviter qu'un petit nombre capte tout le trafic).</p>`
    },
    "less-structure": {
      title: "Le principe « less structure »",
      body: `<p>La signature de MoBA : ne <strong>rien présupposer</strong> sur l'endroit où se trouve l'information. Contrairement à Longformer (fenêtre) ou StreamingLLM (puits), MoBA n'impose aucun motif — le routeur apprend seul quels blocs comptent.</p><p>C'est le pari maximaliste de la génération apprise : moins on grave de biais dans l'architecture, plus le modèle peut s'adapter à des structures de dépendance qu'aucun concepteur n'aurait anticipées.</p>`
    },
    "switch-full-sparse": {
      title: "Bascule sans couture full ↔ sparse",
      body: `<p>MoBA peut être activé sur certaines couches et remplacé par la dense sur d'autres, ou basculer de l'un à l'autre selon la phase — <strong>sans réentraîner</strong>. Une souplesse précieuse en production : on garde la dense là où elle est critique, l'éparse ailleurs.</p><p>MoBA n'est pas un prototype : il sert les requêtes long-contexte de <strong>Kimi</strong>, l'assistant de Moonshot<a class="cite" data-cite="3" href="#source-3">3</a>. Face à NSA (trois branches fixes apprises), MoBA propose une seule branche, mais un routage de type MoE.</p>`
    }
  },
  "schema-06": {
    "attn-maps": {
      title: "Observer les cartes d'attention",
      body: `<p>Le point de départ de SeerAttention : la parcimonie utile est <strong>déjà latente</strong> dans le modèle dense. On fait tourner le modèle figé et on récupère ses vraies cartes d'attention — la trace de ce qu'il regarde réellement.</p><p>Nul besoin de la deviner (motif fixe) ni de la réapprendre de zéro : il suffit de l'<em>extraire</em> du comportement observé<a class="cite" data-cite="4" href="#source-4">4</a>.</p>`
    },
    "maxpool-cible": {
      title: "2D-maxpool — la cible de distillation",
      body: `<p>Les cartes d'attention sont réduites par un <span class="term" data-tooltip="Agrégation par blocs : le maximum de chaque bloc.">2D-maxpool</span> au niveau des blocs. Le résultat répond à la question : « <em>quels blocs le modèle regarde-t-il vraiment ?</em> »</p><p>C'est la <strong>cible</strong> d'entraînement du gate. On ne cherche pas à reproduire chaque score individuel — trop fin, trop coûteux — mais la structure grossière de la parcimonie, au grain du bloc, qui suffit à décider quoi calculer.</p>`
    },
    "attngate": {
      title: "L'AttnGate — le seul module appris",
      body: `<p>Un module léger, l'<strong>AttnGate</strong>, est entraîné à reproduire la cible 2D-maxpool. Crucialement, <strong>seuls ses paramètres sont appris</strong> — le corps du modèle reste figé — d'où une convergence rapide et un coût de calibration minime.</p><p>À l'inférence, le gate prédit la parcimonie par bloc, et un <strong>noyau block-sparse compatible FlashAttention</strong> ne calcule que les blocs retenus. C'est de l'auto-distillation : le modèle est son propre professeur<a class="cite" data-cite="4" href="#source-4">4</a>.</p>`
    },
    "deux-voies": {
      title: "Deux voies vers la parcimonie entraînée",
      body: `<p><strong>Voie A — from-scratch</strong> (NSA, MoBA) : la parcimonie est présente dès le pré-entraînement. Meilleure qualité, mais coûte un entraînement complet. Pour les modèles neufs.</p><p><strong>Voie B — post-training</strong> (SeerAttention) : distiller la parcimonie d'un modèle dense <em>existant</em>, corps figé, seul le gate appris. Le compromis pragmatique. SeerAttention-R spécialise l'approche pour le raisonnement long, où les chaînes de pensée font exploser le contexte à parcourir.</p>`
    }
  },
  "schema-07": {
    "lightning-indexer": {
      title: "Le lightning indexer",
      body: `<p>Premier composant de DSA : une <strong>fonction de similarité pondérée, volontairement légère</strong>, qui désigne pour chaque requête les tokens que l'attention dense aurait regardés.</p><p>Fait remarquable : l'indexeur est <strong>entraîné sur 2,1 milliards de tokens à imiter la dense de V3.1-Terminus</strong>. C'est une distillation de la carte d'attention — l'esprit de SeerAttention, mais intégré au pipeline de service d'un modèle servi à grande échelle<a class="cite" data-cite="13" href="#source-13">13</a>.</p>`
    },
    "topk-select": {
      title: "La sélection top-k sur MLA",
      body: `<p>Second composant : la sélection fine top-k ne calcule l'attention que sur les <em>k</em> tokens désignés par l'indexeur. L'attention elle-même reste en <span class="term" data-tooltip="Multi-head Latent Attention, l'attention latente compressée de DeepSeek.">MLA</span> — la parcimonie du calcul se branche donc directement sur la compression de la mémoire.</p><p>C'est la co-conception explicite des deux moitiés du problème long-contexte : quoi lire (top-k) et quoi stocker (latent MLA), dans un même modèle<a class="cite" data-cite="13" href="#source-13">13</a>.</p>`
    },
    "cout-lineaire": {
      title: "O(L²) → O(Lk)",
      body: `<p>En ne calculant l'attention que sur k tokens fixés, DSA fait passer la complexité cœur de l'attention de <strong>O(L²) à O(Lk)</strong> : le coût d'inférence croît désormais <em>linéairement</em> avec la longueur d'entrée.</p><p>C'est exactement la promesse du schéma 1 (O(n·k)) tenue en production. La qualité de sortie reste <strong>quasi identique</strong> à la dense — la falaise de qualité redoutée n'a pas lieu, parce que l'indexeur a été entraîné à imiter précisément la dense.</p>`
    },
    "adoption": {
      title: "De l'artefact à la brique de service",
      body: `<p>V3.2-Exp est identique à V3.1-Terminus <em>à une exception près</em> : DSA. DeepSeek a répercuté l'économie en <strong>baissant ses prix d'API d'environ 50 %</strong>, et vLLM comme SGLang ont livré un <strong>support day-0</strong> des noyaux DSA<a class="cite" data-cite="13" href="#source-13">13</a>.</p><p>C'est le moment où l'attention parcimonieuse entraînée cesse d'être un résultat de laboratoire pour devenir une brique tarifée, servie à grande échelle. La bascule est consommée.</p>`
    }
  }
}
