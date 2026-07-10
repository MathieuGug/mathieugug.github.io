{
  "schema-01": {
    "etage-euv": {
      title: "Lithographie EUV — le premier goulot",
      eyebrow: "ASML · 100 %",
      body: "<p>La lithographie par ultraviolets extrêmes (13,5 nm) est la seule technologie capable de graver le nœud de pointe. Un seul fabricant la vend au monde : le néerlandais <strong>ASML</strong>, avec 100 % du marché EUV<a class='cite' data-cite='4' href='#source-4'>4</a>.</p><p>C'est le sommet de l'entonnoir : sans EUV, pas de die logique avancé. Et ce maillon repose lui-même sur des fournisseurs uniques (Zeiss, TRUMPF) — voir le schéma 3.</p>"
    },
    "etage-fonderie": {
      title: "Fonderie de pointe — TSMC",
      eyebrow: "~90 % du logique < 7 nm",
      body: "<p>La machine EUV grave <em>chez quelqu'un</em> : au nœud de pointe, presque toujours TSMC, qui contrôle ~90 % de la production mondiale de logique avancée sous 7 nm<a class='cite' data-cite='2' href='#source-2'>2</a>.</p><p>Une usine N2 dépasse 20 Md$ ; le savoir-faire de rendement ne s'acquiert qu'en produisant à l'échelle. Chaque génération renforce le leader, et concentre le risque à Taïwan.</p>"
    },
    "etage-packaging": {
      title: "Packaging avancé — le maillon le plus tendu",
      eyebrow: "TSMC · 85 % — CoWoS",
      body: "<p>Le retournement du dossier : le vrai goulot 2024-2026 n'est pas la gravure du silicium mais l'<strong>assemblage</strong> qui réunit dies logiques et HBM sur un interposeur — le packaging CoWoS, dont Taïwan tient 85 %<a class='cite' data-cite='2' href='#source-2'>2</a>.</p><p>Rare <em>et</em> accaparé : Nvidia en réserve ~70 % (schéma 4). C'est lui qui plafonne le nombre d'accélérateurs produits chaque année.</p>"
    },
    "etage-hbm": {
      title: "Mémoire HBM — l'oligopole",
      eyebrow: "3 acteurs · SK hynix ~63 %",
      body: "<p>La mémoire à haute bande passante répond au « mur mémoire » de l'inférence. Trois fabricants seulement la produisent en volume : SK hynix (~63 %), Samsung et Micron<a class='cite' data-cite='9' href='#source-9'>9</a>.</p><p>Deux pays (Corée, États-Unis pour Micron), et un couplage critique avec le packaging : le nombre de stacks intégrables sur l'interposeur définit la mémoire du module (schéma 5).</p>"
    }
  },
  "schema-02": {
    "die-logique": {
      title: "Les dies logiques",
      eyebrow: "TSMC · N4 / N3 / N2",
      body: "<p>Le cœur de calcul, gravé par TSMC en nœud avancé (N4 pour Hopper, N4P pour Blackwell, bientôt N2). C'est la partie « célèbre » de la chaîne — celle dont on parle quand on dit « puce 3 nanomètres ».</p><p>Un accélérateur moderne dépasse la limite d'une puce monolithique : on assemble donc plusieurs <em>chiplets</em> côte à côte, ce qui déplace la difficulté vers le packaging.</p>"
    },
    "stack-hbm": {
      title: "Les stacks de HBM",
      eyebrow: "SK hynix · Samsung · Micron",
      body: "<p>La mémoire à haute bande passante, empilée en tours de 8, 12 ou 16 puces DRAM reliées par des TSV. Un GB200 en embarque huit ; le MI400 d'AMD vise 432 Go par module<a class='cite' data-cite='9' href='#source-9'>9</a>.</p><p>Elle ne vient jamais de TSMC, mais de l'oligopole coréen + Micron. C'est le deuxième composant le plus tendu de la chaîne.</p>"
    },
    "interposeur-cowos": {
      title: "L'interposeur CoWoS",
      eyebrow: "TSMC · packaging avancé",
      body: "<p>La galette de silicium sur laquelle dies logiques et stacks HBM sont posés côte à côte, reliés par des dizaines de milliers de micro-connexions et des vias traversants (TSV).</p><p>C'est le <em>packaging avancé</em> — l'opération rare qui, plus que la gravure, a limité la livraison des GPU pendant deux ans (schéma 4).</p>"
    },
    "substrat-abf": {
      title: "Le substrat ABF",
      eyebrow: "Ajinomoto · > 95 %",
      body: "<p>La plaque qui porte l'ensemble et l'interface avec la carte. Son film isolant, l'<em>Ajinomoto Build-up Film</em>, vient à plus de 95 % d'un seul chimiste japonais<a class='cite' data-cite='2' href='#source-2'>2</a> — le même qui fabrique l'exhausteur de goût.</p><p>Un maillon invisible, sans alternative, et pourtant sans lui aucun processeur haut de gamme ne s'assemble.</p>"
    }
  },
  "schema-03": {
    "source-lumiere": {
      title: "La source de lumière",
      eyebrow: "TRUMPF · Cymer",
      body: "<p>La source EUV projette ~50 000 gouttelettes d'étain par seconde, vaporisées deux fois par un laser CO₂ de forte puissance fourni par l'allemand <strong>TRUMPF</strong> (fournisseur unique). La technologie de source vient de Cymer, racheté par ASML en 2013.</p><p>Générer 13,5 nm de lumière stable est en soi une prouesse que personne d'autre ne maîtrise en production.</p>"
    },
    "optiques-zeiss": {
      title: "Les optiques",
      eyebrow: "Carl Zeiss SMT · 100 %",
      body: "<p>Aucune lentille ne transmet l'EUV : il faut des miroirs polis à la précision atomique. Ils sont fabriqués à 100 % par l'allemand <strong>Carl Zeiss SMT</strong>, partenaire exclusif d'ASML<a class='cite' data-cite='2' href='#source-2'>2</a>.</p><p>Encore un fournisseur unique emboîté dans le monopole : la dépendance est récursive.</p>"
    },
    "assemblage-asml": {
      title: "L'assemblage ASML",
      eyebrow: "~100 000 pièces · Veldhoven",
      body: "<p>ASML est un intégrateur : ~100 000 pièces par machine, transportées par plusieurs avions-cargo. Le savoir-faire d'intégration — aligner source, optiques et plateau au picomètre — est un actif tacite aussi rare que les composants.</p><p>Reconstruire ASML, ce serait reconstruire Zeiss, TRUMPF, Cymer <em>et</em> trente ans d'apprentissage. D'où l'irremplaçabilité.</p>"
    },
    "high-na": {
      title: "High-NA EUV — la relève",
      eyebrow: "EXE:5200 · 350-400 M$",
      body: "<p>L'ouverture numérique portée à 0,55 permet de descendre sous 2 nm. Le premier système de production EXE:5200B a été livré à Intel au Q4 2025, à un prix estimé de 350 à 400 M$ l'unité<a class='cite' data-cite='4' href='#source-4'>4</a>.</p><p>Un seul outil coûte le prix d'une petite usine — et prolonge le monopole d'une génération de plus.</p>"
    }
  },
  "schema-04": {
    "cowos-s": {
      title: "CoWoS-S — l'interposeur silicium",
      eyebrow: "bridé par le réticule",
      body: "<p>La forme classique : une galette de silicium pleine, gravée de pistes fines et de TSV, sur laquelle reposent dies et HBM. Elle est bridée par la <em>limite du réticule</em> (~858 mm²) : au-delà, impossible de graver l'interposeur d'un seul tenant.</p><p>Cette limite a poussé l'industrie vers CoWoS-L pour les boîtiers géants comme Blackwell.</p>"
    },
    "cowos-l": {
      title: "CoWoS-L — les ponts LSI",
      eyebrow: "boîtiers > réticule",
      body: "<p>De petits ponts de silicium (<em>LSI bridges</em>) « cousent » les chiplets sur un substrat organique, sans interposeur silicium plein. Résultat : des boîtiers plusieurs fois plus grands que le réticule, indispensables aux superchips actuels.</p><p>C'est la famille la plus tendue — et celle que Nvidia accapare le plus (schéma, à droite).</p>"
    },
    "rampe-capacite": {
      title: "La rampe de capacité",
      eyebrow: "35k → 130k plaquettes/mois",
      body: "<p>TSMC quadruple sa capacité CoWoS d'environ 35 000 plaquettes/mois fin 2024 à ~130 000 fin 2026<a class='cite' data-cite='11' href='#source-11'>11</a>. Un effort industriel colossal — et pourtant insuffisant.</p><p>La demande reste au-dessus de l'offre : les deux familles sont à guichets fermés, avec des délais de 52 à 78 semaines fin 2025.</p>"
    },
    "allocation-nvidia": {
      title: "Un goulot accaparé",
      eyebrow: "Nvidia ~70 % de CoWoS-L 2026",
      body: "<p>Le packaging est rare <em>et</em> concentré côté client : Nvidia aurait sécurisé près de 70 % de la capacité CoWoS-L 2026, les trois premiers clients absorbant plus de 85 %<a class='cite' data-cite='9' href='#source-9'>9</a>.</p><p>Couplage critique : le nombre de stacks HBM qu'on parvient à poser sur l'interposeur définit la mémoire du module. Packaging et HBM se serrent la main.</p>"
    }
  },
  "schema-05": {
    "anatomie-pile": {
      title: "Anatomie d'une pile HBM",
      eyebrow: "8-16 dies + base die + TSV",
      body: "<p>Une pile HBM empile 8 à 16 puces DRAM amincies sur un <em>base die</em> logique, le tout traversé de vias verticaux (TSV). Empiler sans casser les connexions, évacuer la chaleur, garantir le rendement de toute la tour : c'est brutalement difficile.</p><p>D'où un oligopole à trois acteurs — la barrière technologique fait la rareté.</p>"
    },
    "bande-passante": {
      title: "Pourquoi la HBM : le mur mémoire",
      eyebrow: "~1 ordre de grandeur > DDR",
      body: "<p>Le décodage d'un LLM est plafonné par la bande passante mémoire, pas par les FLOPs. La HBM offre environ un ordre de grandeur de bande passante de plus que la DDR classique — d'où son caractère incontournable pour l'IA.</p><p>Renvoi aux dossiers <em>kv-cache</em> et <em>ia-embarquee</em> : le mur mémoire, vu depuis la couche logicielle.</p>"
    },
    "parts-marche": {
      title: "Parts de marché HBM (2025)",
      eyebrow: "SK hynix ~63 %",
      body: "<p>SK hynix domine avec ~63 % du marché HBM en 2025, devant Samsung (~24 %) et Micron (~13 %)<a class='cite' data-cite='9' href='#source-9'>9</a>. Trois entreprises se partagent 100 % du marché mondial.</p><p>Aucun autre fabricant n'a de HBM en production de volume : le maillon mémoire est aussi étroit que le maillon lithographie.</p>"
    },
    "hbm4": {
      title: "HBM4 — la génération qui rebat les cartes",
      eyebrow: "base die logique gravé en fonderie",
      body: "<p>Bus mémoire élargi, <em>base die</em> logique parfois gravé par TSMC → couplage avec la fonderie. Dans l'allocation provisoire de Nvidia (fin 2025) : SK hynix ~55 %, Samsung ~25 %, Micron ~20 %<a class='cite' data-cite='9' href='#source-9'>9</a>.</p><p>AMD conçoit le MI400 autour de 432 Go de HBM4 : un retard de volume pèserait sur toute la génération 2026.</p>"
    }
  },
  "schema-06": {
    "pays-bas-euv": {
      title: "Pays-Bas — la lithographie",
      eyebrow: "ASML · EUV 100 %",
      body: "<p>Un pays, une entreprise (ASML), un maillon (EUV) : 100 % du marché, zéro alternative de production sur Terre<a class='cite' data-cite='4' href='#source-4'>4</a>.</p><p>C'est le point le plus tranchant pour le contrôle à l'export : interdire une machine ASML, c'est fermer l'accès au nœud de pointe (schéma 7).</p>"
    },
    "taiwan-fonderie": {
      title: "Taïwan — fonderie & packaging",
      eyebrow: "TSMC · ~90 % / 85 % / 67 %",
      body: "<p>TSMC : ~90 % de la fonderie sous 7 nm, 85 % du packaging avancé, 67 % de la fonderie tous nœuds<a class='cite' data-cite='2' href='#source-2'>2</a>. Deux maillons décisifs concentrés sur une seule île.</p><p>Un détroit de 180 km devient ainsi le point de défaillance unique le plus coûteux de l'économie numérique — le « bouclier de silicium ».</p>"
    },
    "coree-hbm": {
      title: "Corée du Sud — la mémoire",
      eyebrow: "SK hynix ~63 % · Samsung",
      body: "<p>Deux des trois seuls fabricants de HBM au monde sont coréens : SK hynix (~63 %) et Samsung<a class='cite' data-cite='9' href='#source-9'>9</a>. La mémoire de l'IA a une nationalité dominante.</p><p>Et une exposition : la péninsule vit sous la menace balistique permanente de son voisin du Nord.</p>"
    },
    "japon-materiaux": {
      title: "Japon — les matériaux invisibles",
      eyebrow: "> 90 % sur plusieurs consommables",
      body: "<p>Le Japon ne fabrique presque plus de puces de pointe, mais tient la couche des matériaux : photoresist EUV &gt;90 %, film ABF &gt;95 %, tracks 96 %, mask blanks 93 %, plaquettes ~51 %<a class='cite' data-cite='3' href='#source-3'>3</a>.</p><p>Le point de passage le plus discret et le plus total — utilisé comme arme dès 2019 dans le conflit Japon-Corée.</p>"
    }
  },
  "schema-07": {
    "controles-bis": {
      title: "Verrouiller — les contrôles BIS",
      eyebrow: "2022 → 2025",
      body: "<p>Le Bureau of Industry and Security a construit par vagues un régime ciblé sur les chokepoints : octobre 2022 (GPU + équipements, <em>Foreign Direct Product Rule</em>), octobre 2023 (seuils révisés contre les A800/H800), puis les contrôles HBM et le cadre AI Diffusion<a class='cite' data-cite='7' href='#source-7'>7</a>.</p><p>Contrôler les points de passage, c'est contrôler qui accède à l'IA.</p>"
    },
    "controle-hbm": {
      title: "Zoom — le contrôle HBM (déc. 2024)",
      eyebrow: "ECCN 3A090.c · 2 Go/s/mm²",
      body: "<p>Le 2 décembre 2024, toute mémoire HBM d'une densité de bande passante &gt; 2 Go/s/mm² passe sous licence (ECCN 3A090.c), et le BIS note que <em>toute</em> HBM en production dépasse ce seuil<a class='cite' data-cite='6' href='#source-6'>6</a>.</p><p>Nouveauté majeure : le contrôle vise désormais un <em>composant</em> de la chaîne, pas seulement un produit fini.</p>"
    },
    "chips-acts": {
      title: "Relocaliser — CHIPS & EU Chips Act",
      eyebrow: "52 Md$ + 43 Md€",
      body: "<p>Le CHIPS and Science Act (52 Md$) et l'EU Chips Act (43 Md€) financent des fabs sur le sol national : Arizona, Dresde, Kumamoto, et un 2 nm japonais souverain (Rapidus) visé ~2027<a class='cite' data-cite='12' href='#source-12'>12</a>.</p><p>Le bilan d'étape note une résilience émergente mais partielle : le reshoring reconstruit le milieu de la chaîne, pas les points les plus durs (EUV, matériaux, packaging).</p>"
    },
    "reponse-chine": {
      title: "Contourner — la substitution chinoise",
      eyebrow: "SMIC · Huawei · SMEE",
      body: "<p>Privée d'EUV, la Chine bâtit une chaîne parallèle « suffisamment bonne » : SMIC produit du 7 nm par DUV multi-patterning, Huawei conçoit ses accélérateurs Ascend, SMEE tente une lithographie indigène.</p><p>Elle ne rattrape pas le nœud de pointe, mais couvre ses besoins domestiques — et rend les contrôles moins étanches avec le temps.</p>"
    }
  }
}
