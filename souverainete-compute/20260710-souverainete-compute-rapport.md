# La chaîne du silicium

> **Le facteur limitant de l'IA générative en 2026 n'est ni le modèle ni les FLOPs, mais une chaîne d'approvisionnement en forme d'entonnoir : un lithographe (ASML), un fondeur (TSMC), un packaging (CoWoS), une mémoire (HBM) — chacun un point de passage quasi unique, tous concentrés en Asie de l'Est. Le maillon le plus tendu n'est pas la gravure du silicium mais le packaging avancé ; et cette concentration fait du compute un objet géopolitique.** — 10 juillet 2026, Mathieu Guglielmino

## 1. Le substrat oublié

Les dossiers de ce site parlent des modèles : comment ils raisonnent, comment on les évalue, comment on les sert à moindre coût. L'économie de l'inférence[^1], la gestion du KV-cache, le mélange d'experts, l'IA embarquée — tous partent d'un présupposé si évident qu'on l'oublie : **il y a des accélérateurs disponibles**. On optimise la façon dont un GPU est rempli, jamais la question de savoir d'où vient le GPU.

Or « avoir des GPU » n'est pas une donnée, c'est le sommet d'un entonnoir. Sous chaque module Blackwell ou MI400 se cache une chaîne d'approvisionnement d'une profondeur vertigineuse et d'une étroitesse inquiétante. ==À chaque étage de cette chaîne, un seul acteur — ou une poignée — détient plus de 90 % du marché mondial, sans substitut viable et avec des délais de 12 à 24 mois.== Une étude conjointe de la *Semiconductor Industry Association* et du Boston Consulting Group a recensé **plus de cinquante points** dans la chaîne de valeur où une seule région détient plus de 65 % de la part de marché mondiale.[^2]

Ce dossier prend le problème par le bas. Il ne demande pas « quel modèle tourne sur le GPU » mais « qui peut fabriquer le GPU, et où ». La réponse dessine un entonnoir dont chaque rétrécissement est un **point de passage obligé** : un maillon que rien ne contourne. Et cet entonnoir a une géographie très précise — Veldhoven, Hsinchu, Icheon, quelques villes japonaises. Voir le schéma 1.

[SCHEMA-01]

La thèse est simple à énoncer, dérangeante à admettre : la contrainte porteuse de l'IA en 2026 n'est pas algorithmique, elle est **physique et géographique**. Et le maillon le plus tendu n'est même pas celui qu'on croit — pas la gravure du silicium, mais le *packaging avancé* qui assemble le processeur et sa mémoire.

## 2. Anatomie d'un accélérateur IA

Pour comprendre l'entonnoir, il faut ouvrir le module. Un accélérateur d'IA moderne — un superchip GB200 de Nvidia, un MI400 d'AMD — n'est pas *une* puce. C'est un **assemblage hétérogène** de composants venus de fournisseurs distincts, tenus ensemble par une prouesse d'ingénierie qui, elle-même, n'existe qu'à un seul endroit. Voir le schéma 2.

[SCHEMA-02]

Décomposons de haut en bas :

- **Les dies logiques** — le cœur de calcul, gravé par TSMC en nœud avancé (N4 pour Hopper, N4P pour Blackwell, bientôt N2 pour la génération Rubin). C'est la partie « célèbre » de la chaîne, celle dont on parle quand on dit « puce 3 nanomètres ».
- **Les stacks de HBM** — la mémoire à haute bande passante, empilée en tours de 8, 12 ou 16 puces DRAM. Un GB200 en embarque huit ; le MI400 d'AMD en vise 432 gigaoctets par module.[^9] Cette mémoire vient de SK hynix, Samsung ou Micron — jamais de TSMC.
- **L'interposeur CoWoS** — la galette de silicium sur laquelle dies logiques et stacks HBM sont posés côte à côte, reliés par des dizaines de milliers de micro-connexions. C'est le *packaging avancé*, fabriqué par TSMC (et une minorité par des sous-traitants).
- **Le substrat ABF** — la plaque de résine qui porte l'ensemble et l'interface avec la carte. Son film isolant, l'*Ajinomoto Build-up Film*, vient à plus de 95 % d'un seul chimiste japonais — le même qui fabrique votre exhausteur de goût.

==Chacune de ces quatre briques a son propre goulot d'étranglement, et aucun n'est situé aux États-Unis, siège des concepteurs Nvidia et AMD.== Le concepteur dessine ; l'Asie de l'Est fabrique, empile, assemble. La suite du dossier remonte chaque maillon, du plus amont — la lumière qui grave — au plus aval — le droit qui interdit.

## 3. Le lithographe unique — ASML

Tout commence par la lumière. Graver un transistor de quelques nanomètres suppose de projeter un motif d'une finesse extrême sur une plaquette de silicium. La seule technologie capable de le faire au nœud de pointe est la **lithographie par ultraviolets extrêmes** (*EUV*, longueur d'onde 13,5 nm), et un seul fabricant au monde vend ces machines : le néerlandais **ASML**.

Le mot « monopole » est ici littéral. ==ASML détient 100 % du marché de la lithographie EUV et environ 94 % de la lithographie tous types confondus[^4] ; aucun concurrent, ni japonais (Nikon, Canon) ni chinois (SMEE), n'a jamais livré une seule machine EUV de production.== Ce monopole a coûté trente ans de recherche et plus de dix milliards de dollars à construire — et il repose lui-même sur une sous-chaîne de dépendances en poupées russes. Voir le schéma 3.

[SCHEMA-03]

La machine EUV n'est pas un produit ASML « pur ». C'est un intégrateur :

- La **source de lumière** projette 50 000 gouttelettes d'étain par seconde, vaporisées deux fois par un laser CO₂ de forte puissance fourni par l'allemand **TRUMPF** — encore un fournisseur unique. La technologie de source vient de Cymer, racheté par ASML en 2013.
- Les **optiques** — des miroirs polis à une précision atomique, car aucune lentille ne transmet l'EUV — sont fabriquées à 100 % par l'allemand **Carl Zeiss SMT**, partenaire exclusif.[^2]
- L'**assemblage** final, quelque **100 000 pièces** par machine, se fait à Veldhoven. Une machine de dernière génération se transporte par plusieurs avions-cargo.

La relève, la **High-NA EUV** (ouverture numérique portée à 0,55, pour descendre sous les 2 nm), a franchi une étape en 2025 : le premier système de production EXE:5200B a été livré à Intel au quatrième trimestre, à un prix estimé entre 350 et 400 millions de dollars l'unité.[^4] Un seul outil, le prix d'une petite usine.

Ce que ce maillon révèle : la profondeur du fossé. On ne « rattrape » pas ASML en investissant quelques milliards. Il faudrait reconstruire Zeiss, TRUMPF, Cymer et trente ans d'apprentissage tacite. C'est précisément cette **irremplaçabilité** qui en fait l'arme géopolitique la plus tranchante de la chaîne (section 8).

## 4. Le fondeur de pointe — TSMC

La machine EUV grave, mais elle grave *chez quelqu'un*. Ce quelqu'un, au nœud de pointe, est presque toujours le taïwanais **TSMC**. ==Le fondeur contrôle environ 90 % de la production mondiale de logique avancée sous 7 nm[^2], et l'île de Taïwan concentre à elle seule 67 % de la production de fonderie et 85 % du packaging avancé.==

Cette concentration n'est pas un accident, c'est le résultat d'une boucle de rétroaction : la fabrication de pointe exige un capital colossal (une usine N2 dépasse les 20 milliards de dollars), un savoir-faire de rendement qui ne s'acquiert qu'en produisant à grande échelle, et une densité d'ingénieurs et de sous-traitants qui n'existe qu'à Hsinchu et Tainan. Chaque génération renforce le leader. TSMC produit aujourd'hui en N3, monte le N2 (transistors *gate-all-around*) en 2025-2026, et reste le seul fondeur dont Apple, Nvidia, AMD et bientôt tout le monde dépendent au même moment.

La conséquence stratégique porte un nom : le **« bouclier de silicium »** (*silicon shield*). L'idée que l'indispensabilité industrielle de Taïwan la protégerait d'une agression, parce qu'une interruption de TSMC coûterait des centaines de milliards à l'économie mondiale — Chine comprise. C'est une thèse rassurante et fragile : elle fait d'un détroit de 180 km le point de défaillance unique le plus coûteux de l'économie numérique. Les projets de diversification — Fab 21 en Arizona, Kumamoto au Japon, Dresde en Allemagne — desserrent l'étau à la marge, mais ==le nœud de pointe et le packaging avancé restent, en 2026, massivement taïwanais.==

## 5. Le vrai goulot 2024-2026 : le packaging avancé

Voici le retournement contre-intuitif de tout ce dossier. Pendant deux ans, ce qui a limité la livraison des accélérateurs Nvidia n'a été **ni la gravure des dies logiques, ni la HBM prise isolément, mais l'opération qui les réunit** : le *packaging avancé* de type **CoWoS** (*Chip-on-Wafer-on-Substrate*). Voir le schéma 4.

[SCHEMA-04]

Pourquoi le packaging et pas le wafer ? Parce qu'un accélérateur moderne a dépassé la limite de taille d'une puce monolithique (le *reticle limit*, ~858 mm²). Pour aller plus loin, il faut poser plusieurs *chiplets* logiques et plusieurs tours de HBM côte à côte sur un **interposeur** — une galette de silicium percée de milliers de vias traversants (*TSV*) et gravée de pistes ultra-fines. C'est cet interposeur, et l'assemblage qu'il permet, qui est rare.

Les chiffres racontent une pénurie planifiée. TSMC fait passer sa capacité CoWoS d'environ **35 000 plaquettes par mois fin 2024 à ~130 000 fin 2026**, un quadruplement en deux ans[^11] — et malgré cela, ==les deux familles CoWoS-S et CoWoS-L sont réservées à guichets fermés, avec des délais de 52 à 78 semaines fin 2025.== La demande court plus vite que l'offre.

Le glissement technologique CoWoS-S → **CoWoS-L** (avec ponts de silicium *LSI* pour « coudre » les chiplets) autorise des boîtiers plusieurs fois plus grands que le réticule, indispensables à Blackwell. Et la concentration client est extrême : Nvidia aurait sécurisé à lui seul **près de 70 % de la capacité CoWoS-L 2026**[^9], les trois premiers clients absorbant plus de 85 % de la capacité verrouillée. Le packaging avancé est donc un double goulot : rare *et* accaparé. C'est le maillon qui, plus que tout autre, détermine combien d'accélérateurs le monde peut produire cette année.

## 6. La mémoire empilée — HBM

Un accélérateur passe l'essentiel de son temps non pas à calculer mais à **attendre la mémoire**. Le décodage d'un LLM est plafonné par la bande passante mémoire, pas par les FLOPs — c'est le « mur mémoire » déjà décrit dans les dossiers `kv-cache` et `ia-embarquee`. La réponse matérielle à ce mur est la **HBM** (*High Bandwidth Memory*) : des puces DRAM empilées verticalement, reliées par des TSV, offrant une bande passante d'un ordre de grandeur supérieure à la DDR classique. Voir le schéma 5.

[SCHEMA-05]

Fabriquer de la HBM est brutalement difficile : empiler douze à seize dies amincis sans casser les connexions, évacuer la chaleur, garantir le rendement d'une tour entière. Résultat, un **oligopole** à trois acteurs, tous est-asiatiques. ==SK hynix domine avec environ 63 % du marché HBM en 2025[^9], devant Samsung et Micron ; les trois se partagent la totalité du marché mondial.== Aucun autre fabricant n'a de HBM en production de volume.

La HBM est aussi le lieu d'un couplage devenu critique avec le packaging : c'est le nombre de stacks HBM que l'on parvient à intégrer sur l'interposeur CoWoS qui définit la mémoire d'un module. Les deux goulots — packaging et HBM — se serrent la main. La génération **HBM4** (bus mémoire élargi, *base die* logique parfois gravé par TSMC) redistribue provisoirement les cartes : dans l'allocation provisoire de Nvidia fin 2025, SK hynix a capté une part du milieu de la cinquantaine de pour cent, Samsung le milieu de la vingtaine, Micron autour de 20 %.[^9] Là encore, ==la mémoire de l'IA est produite par trois entreprises situées dans deux pays, dont l'un — la Corée du Sud — vit sous la menace balistique permanente de son voisin.==

## 7. Les matériaux invisibles — le verrou japonais

Sous le lithographe, le fondeur, le packaging et la mémoire, il existe une couche que personne ne voit jamais dans les présentations d'entreprise : les **consommables et matériaux** sans lesquels rien ne fonctionne. Et cette couche a une nationalité dominante : le **Japon**. Voir le schéma 6.

[SCHEMA-06]

Le cartographe le plus rigoureux de cette couche est le CSET de Georgetown, qui a documenté maillon par maillon des concentrations qui donnent le vertige[^3] :

- **Photoresist EUV** : les trois japonais JSR, Tokyo Ohka Kogyo (TOK) et Shin-Etsu détiennent **plus de 90 %** du segment EUV. Au nœud sous-7 nm, le Japon est de fait le seul fournisseur au monde.[^3]
- **Plaquettes de silicium** : Shin-Etsu et SUMCO en fournissent à eux seuls environ la moitié — 95 % des grands fournisseurs sont en Asie.
- **Film ABF** (substrat) : Ajinomoto, plus de 95 % du marché mondial.[^2]
- **Mask blanks EUV** : AGC et Hoya, 93 %.
- **Tracks** (machines de revêtement des résists) : Tokyo Electron et Screen, 96 %.

==Le Japon ne fabrique presque plus de puces de pointe, mais il tient la couche des matériaux si serré qu'aucune usine avancée au monde ne peut tourner sans lui.== C'est le point de passage le plus discret et le plus total de toute la chaîne — celui qui, en 2019, a servi d'arme dans le conflit commercial Japon–Corée quand Tokyo a restreint l'export de trois résists vers Séoul. La leçon a été retenue : les matériaux sont un levier.

Cette section clôt la remontée de la chaîne. On peut maintenant la lire d'un seul trait, de la lumière au consommable : à chaque étage, un ou deux acteurs, une ou deux nations. L'entonnoir du schéma 1 n'était pas une métaphore.

## 8. Le compute comme arme

Une chaîne aussi concentrée est, par construction, une **surface géopolitique**. Si tout advanced compute doit franchir une poignée de points de passage, alors contrôler ces points, c'est contrôler qui accède à l'IA. C'est exactement la logique qu'ont adoptée les États-Unis à partir de 2022. Voir le schéma 7.

[SCHEMA-07]

Le *Bureau of Industry and Security* (BIS) du Département du Commerce a construit, par vagues successives, un régime de contrôle à l'export ciblé sur les chokepoints :

- **Octobre 2022** — première salve : restriction des GPU de calcul avancés et des équipements de fabrication (SME) vers la Chine, avec la *Foreign Direct Product Rule* qui étend la portée américaine à tout produit fabriqué avec de la technologie US.
- **Octobre 2023** — resserrement : les seuils de performance sont révisés pour rattraper les puces conçues pour les contourner (le fameux A800/H800), et un plafond de bande passante est introduit.
- **2 décembre 2024** — la HBM entre dans le champ : ==toute mémoire HBM d'une densité de bande passante supérieure à 2 Go/s/mm² passe sous licence (ECCN 3A090.c), et le BIS précise que *toute* HBM en production dépasse ce seuil.==[^6] Le contrôle vise désormais un composant, pas seulement un produit fini.
- **15 janvier 2025** — le *Framework for Artificial Intelligence Diffusion* propose une architecture à trois cercles (alliés, intermédiaires sous quota, adversaires) régissant jusqu'aux poids de modèles.[^5] Contesté par l'industrie et les alliés, il sera révisé en cours d'année : le principe d'un contrôle mondialisé du compute est posé, ses modalités restent instables.[^7]

En miroir, deux mouvements. Côté occidental, un effort de **relocalisation** massif : le *CHIPS and Science Act* américain (52 Md$) et l'*EU Chips Act* (43 Md€) financent des fabs sur le sol national — Arizona, Dresde, Kumamoto — et un bilan d'étape note une résilience *émergente* mais partielle.[^12] Côté chinois, une **substitution** forcée : SMIC produit du 7 nm par DUV multi-patterning malgré l'absence d'EUV, Huawei conçoit ses Ascend, SMEE tente une machine de lithographie indigène. La Chine ne rattrape pas le nœud de pointe, mais elle bâtit une chaîne parallèle « suffisamment bonne » pour ses besoins domestiques.

Le cadre théorique de tout cela est celui de Chris Miller dans *Chip War*[^10] : le compute est devenu le pétrole du XXIᵉ siècle, à ceci près que sa production est **encore plus concentrée** que celle des hydrocarbures. Le détroit de Taïwan y joue le rôle du détroit d'Ormuz — sauf qu'aucune réserve stratégique ne se constitue en accélérateurs.

## 9. Trajectoires 2026-2028

Trois vecteurs à surveiller.

**La diversification lente.** Le reshoring produit ses premiers volumes — Arizona monte, Rapidus vise un 2 nm japonais souverain à l'horizon 2027 — mais reconstruit surtout le *milieu* de la chaîne (fonderie logique). Les points les plus durs (EUV, matériaux japonais, packaging) restent quasi inchangés. La géographie de l'entonnoir bougera à la marge, pas dans sa forme.

**Le déplacement du goulot.** Le packaging avance vers le *panel-level* (substrats rectangulaires plus grands que les plaquettes rondes) et la HBM vers des *base dies* logiques personnalisés gravés en fonderie — ce qui **couple encore davantage** mémoire, packaging et fonderie chez le même acteur, TSMC. Le goulot ne disparaît pas, il se concentre.

**L'instabilité réglementaire.** Le régime de contrôle à l'export restera un chantier permanent : chaque seuil de performance appelle une puce conçue pour le contourner, chaque contournement appelle un nouveau seuil. ==Pour l'acheteur de compute — l'entreprise qui déploie des agents, entraîne des modèles, ou loue des GPU — la leçon est que la disponibilité et le prix du calcul dépendront de plus en plus de décisions prises à Veldhoven, Hsinchu, Washington et Pékin, pas seulement du marché.==

Le compute n'est pas une commodité fongible. C'est le produit d'une chaîne étroite, profonde et politiquement exposée. Les dossiers sur les modèles supposent le GPU donné ; celui-ci rappelle qu'il ne l'est jamais tout à fait.

---

*Format co-écrit avec l'aide d'une IA. Analyse personnelle de Mathieu Guglielmino ; les chiffres de parts de marché et de capacité sont des ordres de grandeur publics, appelés à bouger trimestre par trimestre.*

## Sources

[^1]: Mathieu Guglielmino, dossiers *L'économie de l'inférence*, *L'économie du KV-cache*, *Le mélange d'experts* et *L'IA embarquée*, mathieugug.github.io — la couche modèles/systèmes que ce dossier prend par le bas.
[^2]: Semiconductor Industry Association & Boston Consulting Group, *Strengthening the Global Semiconductor Supply Chain in an Uncertain Era*, 2021 — semiconductors.org / bcg.com. Concentration géographique, 50+ points >65 % de part régionale, Taïwan ~90 % du logique avancé et 85 % du packaging, chokepoints matériaux (Zeiss 100 % optiques EUV, TRUMPF 100 % lasers, Ajinomoto >95 % ABF).
[^3]: Center for Security and Emerging Technology (Georgetown), *The Semiconductor Supply Chain: Assessing National Competitiveness*, S. Khan, A. Mann, D. Peterson, 2021 — cset.georgetown.edu. Cartographie maillon par maillon : photoresist EUV Japon >90 %, plaquettes, mask blanks, tracks.
[^4]: ASML Holding NV, *Annual Report / Form 20-F* 2024-2025 — asml.com, sec.gov. Monopole EUV (100 %), part lithographie ~94 %, High-NA EXE:5200 (~350-400 M$, première livraison production Intel Q4 2025), exposition Chine.
[^5]: Bureau of Industry and Security (US Dept. of Commerce), *Framework for Artificial Intelligence Diffusion*, Federal Register, 15 janvier 2025 — federalregister.gov. Architecture à paliers du contrôle du compute et des poids de modèles.
[^6]: Holland & Knight / BIS, *U.S. Strengthens Export Controls on Advanced Computing Items, Semiconductor Manufacturing Items*, décembre 2024 — hklaw.com, bis.gov. Contrôle HBM ECCN 3A090.c (seuil 2 Go/s/mm²).
[^7]: Congressional Research Service, *U.S. Export Controls and China: Advanced Semiconductors*, R48642 — congress.gov. Synthèse législative des vagues de contrôle 2022-2025.
[^8]: Center for Strategic and International Studies, *Understanding the Biden Administration's Updated Export Controls* — csis.org. Logique « chokepoint » des contrôles à l'export.
[^9]: TrendForce, analyses *HBM Industry* et allocations CoWoS-L / HBM4 (2025-2026) — trendforce.com. Parts SK hynix ~63 % (2025), Samsung, Micron ; allocation provisoire HBM4 Nvidia ; Nvidia ~60 % de la HBM et ~70 % de la capacité CoWoS-L ; MI400 ~432 Go HBM4.
[^10]: Chris Miller, *Chip War: The Fight for the World's Most Critical Technology*, Scribner, 2022 — le cadre géopolitique de référence sur la concentration de la chaîne et le rôle de Taïwan.
[^11]: TSMC, communications investisseurs 2025 (capacité CoWoS ~35k→130k plaquettes/mois, nœud N2) ; recoupé par SIA (packaging avancé 85 % Taïwan) et analyses de capacité de fonderie 2025-2026.
[^12]: Boston Consulting Group & SIA, *Emerging Resilience in the Semiconductor Supply Chain*, 2024 — bcg.com. Bilan d'étape du reshoring (CHIPS Act 52 Md$, EU Chips Act 43 Md€) : résilience émergente mais partielle.
