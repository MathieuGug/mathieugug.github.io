{
      "schema-01": {
        "fp16-baseline": {
          title: "FP16 / BF16 — la référence",
          body: `<p>Le format d'entraînement et d'inférence non compressée : <strong>2 octets par poids</strong>. Un modèle de 70&nbsp;Md de paramètres pèse ~140&nbsp;Go, qu'il faut relire depuis la HBM à chaque token généré. C'est le point de départ — et le gâchis à combattre : la précision FP16 dépasse de loin ce dont l'inférence a besoin pour la plupart des poids.</p>`
        },
        "int8-fp8-safe": {
          title: "INT8 · FP8 — le palier sûr",
          body: `<p>Diviser la mémoire par deux (~70&nbsp;Go). C'est le palier « gratuit » : la dégradation reste négligeable, et le matériel récent (Hopper, Blackwell) exécute <strong>FP8 nativement</strong>, ce qui accélère aussi le calcul, pas seulement la mémoire. Le seul obstacle sérieux à 8&nbsp;bits est l'activation : c'est là qu'apparaissent les outliers émergents<a class="cite" data-cite="2" href="#source-2">2</a> que SmoothQuant et LLM.int8() ont appris à dompter.</p>`
        },
        "int4-cliff": {
          title: "INT4 · NF4 — le bord de la falaise",
          body: `<p>×4 sur la mémoire (~35&nbsp;Go), et le point d'équilibre : les <em>k-bit inference scaling laws</em> situent le <strong>4&nbsp;bits comme l'optimum qualité/octet</strong><a class="cite" data-cite="12" href="#source-12">12</a>. Au-dessus, on gaspille des bits ; en dessous, on tombe. GPTQ<a class="cite" data-cite="5" href="#source-5">5</a> et AWQ<a class="cite" data-cite="6" href="#source-6">6</a> y excellent sans réentraînement. NF4 place ses 16 niveaux aux quantiles d'une gaussienne pour mieux épouser la distribution des poids<a class="cite" data-cite="7" href="#source-7">7</a>.</p>`
        },
        "sub4-artillery": {
          title: "2 bits — l'artillerie lourde",
          body: `<p>×8 sur la mémoire, mais la quantification scalaire uniforme ne tient plus. Il faut des <strong>codebooks</strong> : AQLM (quantification additive) et QuIP#<a class="cite" data-cite="10" href="#source-10">10</a> représentent des groupes de poids par des index vers un dictionnaire appris, avec traitement d'incohérence. Coûteux à calibrer, mais c'est le seul moyen d'atteindre 2&nbsp;bits sans réentraîner.</p>`
        },
        "ternary-native": {
          title: "Ternaire natif — hors courbe",
          body: `<p>~1,58&nbsp;bit ({−1, 0, +1}). BitNet b1.58<a class="cite" data-cite="11" href="#source-11">11</a> ne se place pas sur la courbe PTQ : il <strong>entraîne directement</strong> en ternaire, dès la première itération. Impossible de ternariser un modèle FP16 existant sans dégât — c'est une décision d'architecture, pas une compression post-hoc. En échange : plus de multiplications, une énergie effondrée, une inférence CPU sans GPU.</p>`
        }
      },
      "schema-02": {
        "scale-zeropoint": {
          title: "Échelle et point-zéro",
          body: `<p>La quantification affine tient en deux nombres. L'<strong>échelle</strong> (<em>scale</em>) est le pas de la grille : la distance réelle entre deux entiers consécutifs. Le <strong>point-zéro</strong> (<em>zero-point</em>) est l'entier qui correspond à la valeur flottante 0. Déquantifier revient à <code>valeur ≈ échelle × (entier − point_zéro)</code><a class="cite" data-cite="3" href="#source-3">3</a>. Tout le reste — méthodes, rotations — ne fait que choisir <em>comment</em> régler ces deux nombres au mieux.</p>`
        },
        "sym-asym": {
          title: "Symétrique vs asymétrique",
          body: `<p>Une grille <strong>symétrique</strong> centre le zéro et se passe de point-zéro : plus simple, plus rapide, idéale pour des poids répartis autour de zéro. Une grille <strong>asymétrique</strong> ajoute un décalage pour épouser une distribution unilatérale — typiquement les activations après ReLU, toutes positives. Le choix se fait tenseur par tenseur selon la forme réelle de la distribution.</p>`
        },
        "granularity": {
          title: "La granularité de l'échelle",
          body: `<p>Combien d'échelles partager ? <strong>Per-tensor</strong> : une seule pour tout — grossier, mais sans surcoût. <strong>Per-channel</strong> : une par colonne — absorbe les disparités entre canaux. <strong>Per-group</strong> : une par bloc de 64-128 poids — le plus fidèle, au prix de quelques bits de métadonnées d'échelle par bloc. Plus fin = meilleur, mais le surcoût de métadonnées finit par manger le gain. C'est le premier réglage de tout quantificateur sérieux.</p>`
        },
        "dequant": {
          title: "Déquantification à l'inférence",
          body: `<p>Détail décisif : dans la plupart des schémas <em>weight-only</em> (W4A16), les poids stockés en 4&nbsp;bits sont <strong>déquantifiés en FP16</strong> juste avant le calcul. On ne gagne alors que la mémoire et la bande passante — les FLOPs restent en FP16. Pour accélérer <em>aussi</em> le calcul, il faut quantifier les activations (W8A8, W4A4) et utiliser des unités entières ou FP8. C'est pourquoi les rotations, qui rendent les activations quantifiables, comptent tant.</p>`
        }
      },
      "schema-03": {
        "emergent-features": {
          title: "Les traits émergents",
          body: `<p>La découverte fondatrice de Dettmers 2022<a class="cite" data-cite="2" href="#source-2">2</a> : au-delà de ~6,7&nbsp;Md de paramètres, <strong>moins de 0,1&nbsp;% des dimensions d'activation</strong> voient leur magnitude exploser. Ces canaux aberrants sont systématiques (les mêmes d'une entrée à l'autre), concentrés, et portent une part disproportionnée du comportement du modèle. Ils ne sont pas un bug : ils émergent avec l'échelle. Toute la discipline de la quantification LLM en découle.</p>`
        },
        "why-breaks-int8": {
          title: "Pourquoi une seule échelle s'effondre",
          body: `<p>La quantification uniforme fixe son pas d'après la valeur maximale. Un seul outlier à 70 quand le reste vit autour de 0,1 force un pas si grossier que toutes les valeurs normales <strong>tombent dans le même cran</strong> — dans le bruit d'arrondi. L'information utile est écrasée par une poignée d'aberrations. C'est le problème que chaque méthode sérieuse résout à sa façon : isoler, migrer, ou dissoudre l'outlier.</p>`
        },
        "smoothquant-migration": {
          title: "SmoothQuant — migrer la difficulté",
          body: `<p>L'idée-clé de 2023<a class="cite" data-cite="4" href="#source-4">4</a> : les poids se quantifient bien, les activations résistent. Alors <strong>déplaçons la difficulté</strong>. Diviser un canal d'activation par un facteur α et multiplier le poids correspondant par α laisse la sortie <em>mathématiquement inchangée</em>, mais lisse l'activation (facile à quantifier) en durcissant à peine le poids. Ce principe de <em>migration de difficulté</em> est la matrice conceptuelle de presque tout ce qui suit.</p>`
        },
        "mixed-decomposition": {
          title: "LLM.int8() — décomposition mixte",
          body: `<p>La première parade<a class="cite" data-cite="2" href="#source-2">2</a> : isoler les quelques canaux aberrants, les calculer en <strong>FP16</strong>, et quantifier les 99,9&nbsp;% restants en INT8. Correct sur la qualité — mais la voie à précision mixte casse la régularité du produit matriciel, donc la vitesse. C'est l'argument qui a motivé les approches suivantes (SmoothQuant, rotations) : neutraliser l'outlier <em>sans</em> fragmenter le calcul.</p>`
        }
      },
      "schema-04": {
        "gptq-hessian": {
          title: "GPTQ — la Hessienne",
          body: `<p>GPTQ<a class="cite" data-cite="5" href="#source-5">5</a> quantifie poids par poids et <strong>compense l'erreur</strong> introduite sur les poids restants, via l'inverse de la Hessienne de la couche (algorithme OBQ passé à l'échelle). Résultat : un modèle de 175&nbsp;Md de paramètres quantifié en quelques heures GPU, référence tenace en 3-4&nbsp;bits <em>weight-only</em>. Le risque : sur-optimiser le jeu de calibration.</p>`
        },
        "awq-activation": {
          title: "AWQ — activation-aware",
          body: `<p>MLSys 2024 Best Paper<a class="cite" data-cite="6" href="#source-6">6</a>. Observation : <strong>1&nbsp;% des poids</strong> — repérés par la magnitude des <em>activations</em> qui les traversent, pas par leur propre magnitude — portent l'essentiel de l'erreur. AWQ les protège par une mise à l'échelle par canal, sans backprop ni reconstruction. Conséquence : il préserve la généralisation à d'autres domaines et modalités, là où les méthodes à reconstruction lourde se fragilisent hors calibration.</p>`
        },
        "gguf-kquant": {
          title: "GGUF k-quants — le format de l'edge",
          body: `<p>Le format de facto de <em>llama.cpp</em> et du grand public. Les <strong>k-quants</strong> quantifient par blocs à bits mixtes : un schéma comme <code>Q4_K_M</code> mêle 4 et 6&nbsp;bits selon l'importance des sous-blocs, avec des échelles hiérarchiques. Moins académique que GPTQ ou AWQ, mais robuste, largement outillé, et taillé pour le CPU — c'est ce qui fait tourner un LLM sur un ordinateur portable.</p>`
        },
        "codebooks-2bit": {
          title: "Codebooks — la frontière 2 bits",
          body: `<p>Sous ~3&nbsp;bits, la quantification scalaire uniforme cède. AQLM (quantification additive) et QuIP#<a class="cite" data-cite="10" href="#source-10">10</a> passent aux <strong>codebooks</strong> : représenter un groupe de poids par un index vers un dictionnaire de vecteurs appris, avec traitement d'incohérence (une pré-rotation qui rend les poids plus « quantifiables »). Plus lent à calibrer, mais franchit un seuil que le scalaire ne tient pas.</p>`
        },
        "wa-smoothquant": {
          title: "SmoothQuant — la branche W+A",
          body: `<p>Quantifier <strong>poids ET activations</strong> (W8A8) pour activer les unités de calcul entières — donc accélérer le <em>prefill</em> compute-bound, pas seulement la mémoire. SmoothQuant<a class="cite" data-cite="4" href="#source-4">4</a> rend les activations quantifiables en migrant leurs outliers vers les poids. C'est la branche à privilégier quand le goulot est le calcul et non la lecture des poids.</p>`
        },
        "wa-llmint8": {
          title: "LLM.int8() — décomposition mixte",
          body: `<p>L'ancêtre de la branche W+A<a class="cite" data-cite="2" href="#source-2">2</a> : garder les outliers en FP16, le reste en INT8. Qualité préservée, mais calcul fragmenté donc plus lent. Historiquement décisif — c'est lui qui a nommé le problème des <em>emergent features</em> et ouvert tout le champ.</p>`
        }
      },
      "schema-05": {
        "original-basis": {
          title: "La base d'origine, avec ses outliers",
          body: `<p>Dans le repère « naturel » des activations, quelques canaux dominent par leur magnitude. Toutes les méthodes des sections précédentes travaillent <em>dans</em> ce repère : elles isolent, migrent ou protègent ces pics. Les rotations posent une autre question — et si le repère lui-même était le problème ?</p>`
        },
        "hadamard-rotation": {
          title: "La rotation de Hadamard",
          body: `<p>QuaRot<a class="cite" data-cite="8" href="#source-8">8</a> applique une rotation orthogonale — une matrice de <strong>Hadamard aléatoire</strong> — aux états cachés. Une rotation ne perd aucune information (elle est inversible) mais <strong>redistribue l'énergie</strong> des quelques canaux aberrants sur toutes les dimensions. Après rotation, la distribution est quasi-gaussienne : plus d'outliers, une quantification 4&nbsp;bits qui « passe » superbement.</p>`
        },
        "computational-equivalence": {
          title: "L'équivalence computationnelle",
          body: `<p>Le tour de force : la rotation R est <strong>fusionnée dans les matrices de poids adjacentes</strong>. Le réseau produit exactement la même sortie qu'avant — il est <em>computationnellement équivalent</em> — mais ses activations internes n'ont plus d'outliers. C'est ce qui débloque la quantification 4&nbsp;bits <strong>de bout en bout</strong> : poids, activations et KV-cache tous en 4&nbsp;bits<a class="cite" data-cite="8" href="#source-8">8</a>, là où les méthodes de contournement plafonnaient.</p>`
        },
        "learned-rotation": {
          title: "SpinQuant — apprendre la rotation",
          body: `<p>Pourquoi une rotation <em>aléatoire</em> ? SpinQuant<a class="cite" data-cite="9" href="#source-9">9</a> <strong>apprend</strong> la meilleure rotation par optimisation de Cayley sur la variété des matrices orthogonales. Résultat : écart à la pleine précision réduit à <strong>2,9&nbsp;points</strong> (LLaMA-2 7B, W4A4KV4), soit ~30&nbsp;% d'écart résiduel en moins que Hadamard fixe sur les modèles durs. L'insight se généralise : l'outlier est une question de repère ; le meilleur repère n'est pas aléatoire, il s'apprend.</p>`
        }
      },
      "schema-06": {
        "ptq-fast": {
          title: "PTQ — rapide, mais bornée",
          body: `<p>Quantifier sans réentraîner : quelques minutes à quelques heures GPU sur un petit jeu de calibration. GPTQ<a class="cite" data-cite="5" href="#source-5">5</a>, AWQ<a class="cite" data-cite="6" href="#source-6">6</a>, GGUF y sont <strong>excellents à 4&nbsp;bits et au-dessus</strong>. C'est la voie dominante en pratique — bon marché, sans accès au pipeline d'entraînement. Sa limite : sous 4&nbsp;bits, la PTQ naïve décroche.</p>`
        },
        "rotations-mid": {
          title: "Rotations — repousser la falaise",
          body: `<p>À coût modéré (une calibration un peu plus lourde, voire une petite optimisation pour SpinQuant), les rotations<a class="cite" data-cite="8" href="#source-8">8</a><a class="cite" data-cite="9" href="#source-9">9</a> débloquent le <strong>4&nbsp;bits complet</strong> — poids, activations, KV-cache. Elles occupent la zone intermédiaire : plus chères que la PTQ pure, bien moins que la QAT, pour un gain de qualité à basse précision qui justifie souvent l'effort.</p>`
        },
        "qat-costly": {
          title: "QAT — coûteuse mais robuste",
          body: `<p>Simuler la quantification <em>pendant</em> l'entraînement (via le Straight-Through Estimator) fait <strong>apprendre au modèle à résister</strong> à sa propre compression. Coût : des jours GPU et l'accès au pipeline d'entraînement. Bénéfice : c'est la seule voie qui tient vraiment <strong>sous 4&nbsp;bits</strong>. Apple pousse ses Foundation Models embarqués à ~2&nbsp;bits par QAT ; LLM-QAT et EfficientQAT l'industrialisent.</p>`
        },
        "cliff-4bit": {
          title: "La falaise sous 4 bits",
          body: `<p>La dégradation n'est pas linéaire. De 16 à 8 à 4&nbsp;bits, la perte reste modeste ; <strong>sous 4&nbsp;bits, la PTQ naïve plonge</strong>. C'est précisément là que rotations, codebooks et QAT gagnent leur place : ce sont les seuls moyens de repousser la falaise. Mesurer une méthode uniquement à 4&nbsp;bits masque ce comportement — d'où l'importance de la méta-évaluation.</p>`
        },
        "ternary-native6": {
          title: "BitNet — hors échelle PTQ",
          body: `<p>Le ternaire natif<a class="cite" data-cite="11" href="#source-11">11</a> n'est pas sur cet axe : il ne quantifie rien <em>après coup</em>, il <strong>entraîne en 1,58&nbsp;bit dès le départ</strong>. Le coût est celui d'un entraînement complet, mais le résultat échappe à la falaise parce que le modèle n'a jamais connu la haute précision. C'est le cas limite qui redéfinit la question : et si la basse précision était un choix d'architecture, pas une compression ?</p>`
        }
      },
      "schema-07": {
        "col-retrain": {
          title: "Réentraîne-t-on le modèle ?",
          body: `<p>La ligne de partage la plus structurante. La <strong>PTQ</strong> (LLM.int8, SmoothQuant, GPTQ, AWQ, GGUF, QuaRot) ne touche pas aux poids d'entraînement : bon marché, universelle. La <strong>QAT et le natif</strong> (SpinQuant apprend une rotation ; Apple ~2 bits ; BitNet ternaire) paient du calcul d'entraînement contre de la qualité récupérée à basse précision. Qui contrôle son pipeline choisit la seconde voie ; l'écosystème ouvert reste sur la première.</p>`
        },
        "col-hardware": {
          title: "Le support matériel",
          body: `<p>Quantifier ne sert qu'à la mesure où le matériel sait exécuter le format. INT8/FP8 sont natifs depuis Hopper ; le grand tournant de 2025 est le <strong>FP4 natif</strong> sur Blackwell : NVFP4<a class="cite" data-cite="11" href="#source-11">11</a> (bloc 16, double échelle FP8+FP32, ×3,5 vs FP16<a class="cite" data-cite="12" href="#source-12">12</a>) et MXFP4 (standard OCP, bloc 32). Le FP4 devient un <strong>type de donnée de première classe</strong> : le calcul lui-même se fait en 4&nbsp;bits.</p>`
        },
        "row-rotations": {
          title: "La ligne des rotations",
          body: `<p>QuaRot et SpinQuant<a class="cite" data-cite="8" href="#source-8">8</a><a class="cite" data-cite="9" href="#source-9">9</a> sont les seules méthodes du tableau à quantifier <strong>W+A+KV en 4&nbsp;bits</strong> de bout en bout, en dissolvant les outliers par rotation orthogonale plutôt qu'en les contournant. SpinQuant, en apprenant la rotation, atteint la qualité pleine (●●●●) là où QuaRot laisse un léger résidu. C'est la percée qui a rendu le 4-bit complet praticable.</p>`
        },
        "row-native-formats": {
          title: "Les formats natifs",
          body: `<p>BitNet<a class="cite" data-cite="11" href="#source-11">11</a> et NVFP4/MXFP4<a class="cite" data-cite="12" href="#source-12">12</a> incarnent la convergence algorithme↔silicium. BitNet entraîne en ternaire dès le départ, remplaçant les multiplications par des additions. NVFP4/MXFP4 gravent le FP4 dans les tensor cores. Dans les deux cas, la basse précision n'est plus une compression post-hoc mais une <strong>propriété de conception</strong>, pensée à l'entraînement et exécutée nativement — la trajectoire dominante 2026-2028.</p>`
        }
      }
    }
