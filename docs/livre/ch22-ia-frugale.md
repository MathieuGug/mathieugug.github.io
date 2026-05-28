# Chapitre 22 — Externalité énergétique : IA frugale

> **Acte IV — Mesures et garde-fous · Gabarit standard, ~22 pages**
> _Le débat public sur l'empreinte de l'IA est saturé de chiffres viraux faux d'un ordre de grandeur — 3 Wh par requête, 500 ml d'eau pour dix réponses, des datacenters qui « boivent » des fleuves. Ce chapitre absorbe le dossier `ia-frugale/` (13 mai 2026) pour reposer l'arithmétique honnête 2026, lire la matrice GHG à neuf cases (3 scopes × 3 phases), nommer les leviers qui marchent (Patterson 100-1 000×) et l'effet qui les neutralise (Jevons). Il ferme le triptyque tarifaire de l'Acte IV — Ch.5 mesure le prix par token, Ch.21 la valeur par outcome, ce chapitre l'externalité énergétique qui n'apparaît sur aucune facture. Et il bascule §22.9 vers le Ch.23 : la question de l'IA frugale n'est plus technique, elle est devenue politique._

> [!QUESTION] Question d'ouverture
> Une requête ChatGPT consomme 0,3 Wh ou 3 Wh ? Une vidéo IA générée, 50 Wh ou 1 000 Wh ? Google a divisé par dix l'énergie par requête depuis 2019 — et ses émissions globales ont monté de **48 %** sur la même période[^google-2025]. ==Si chaque levier d'efficience est mangé par le volume qu'il rend possible, qu'est-ce qu'il reste à décider — et qui le décide ?==

> [!TLDR] TL;DR décideur
> - ==Les chiffres viraux sur l'empreinte IA sont presque tous faux d'un ordre de grandeur.== Strubell 2019 (cinq voitures pour un entraînement) décrivait un cas NAS extrême. De Vries 2023 (3 Wh par requête) était un scénario top-down. Li 2023 (500 ml d'eau) un site précis du Washington. Epoch AI a recalibré à **0,3 Wh** par requête GPT-4o en février 2025 — Altman et Google ont confirmé la semaine suivante.
> - **Toute empreinte se lit sur deux axes**, et 90 % des chiffres publics omettent l'un ou l'autre : trois scopes GHG Protocol (1 direct site / 2 électricité achetée / 3 fabrication et tout le reste) × trois phases cycle de vie (entraînement ponctuel / inférence continue 65-80 % du total opérationnel / embodied silicium amorti sur 5-7 ans). ==Un chiffre sans scope, sans phase et sans date est suspect par défaut.==
> - **Arithmétique honnête 2026** : texte direct 0,3 Wh, raisonnement 5-20 Wh (l'explosion silencieuse du thinking), image 2-4 Wh, **vidéo 50 à 1 000 Wh** — le poste qui explose et qu'aucune métrique grand public ne capture. Une équipe agentique de 10 personnes en stack MCP : **1,4 MWh/an**, soit 7 frigos modernes ou un demi-vol Paris-NY collectif.
> - **L'eau n'est plus le scandale annoncé.** Microsoft a basculé en décembre 2024 l'intégralité de ses nouveaux designs sur cooling à boucle fermée zéro-évaporation (×120 sur le WUE annuel) ; Google a généralisé le direct-to-chip sur TPU v6. ==Le vrai sujet eau est la concentration locale== — Dublin 79 % de l'électricité urbaine, Phoenix sur aquifères fragiles, TSMC 200 millions de litres/jour à Taïwan.
> - **Le vrai bottleneck est électrique et local.** AIE projette 460 → 945 → 1 300 TWh datacenters (2024 / 2030 / 2035) ; les serveurs accélérés expliquent **la moitié de la croissance**. Mais le mur n'est pas la puissance installée — c'est l'interconnexion grid local. C'est pour ça que les hyperscalers achètent **des centrales nucléaires entières** : Microsoft TMI, Amazon Susquehanna, Google Kairos, Meta Vistra — **plus de 10 GW signés en douze mois**.
> - **Le carbone fantôme est l'angle mort.** H100 = 1 312 kg CO₂eq par baseboard, soit 164 kg/carte. À mix carboné, l'embodied s'amortit en 3 mois. À mix nucléaire dédié, il devient dominant à 5 ans. ==Décarboner les hyperscalers sans décarboner TSMC, c'est repeindre la façade en blanc== — et TSMC tourne à 83 % fossile.
> - **Cinq familles de leviers**, combinaison Patterson **100 à 1 000×** sur une même tâche d'entraînement : architecture (MoE, distillation, quantization), hardware (accélérateurs ML-purpose, liquid cooling), site (geo-aware carbon, nucléaire dédié), régulation (EU DC EE Q2 2026, prix carbone interne), usage (smart routing, KV cache, SLM on-device).
> - **Tout ça peut ne servir à rien.** ==Google +48 % d'émissions 2019-2024 malgré -10× par requête.== DeepSeek-V3 janvier 2025 : 10× moins de compute pour entraîner → **demande mondiale de compute IA en hausse**, pas en baisse. Sans politique (prix carbone, caps régionaux, allocation usages), l'efficience est mangée par le volume — c'est le paradoxe de Jevons appliqué à l'IA. Trois trajectoires 2030 sur la table : laissez-faire 1 500 TWh, efficience seule 1 100, efficience+plafond 650. **La question n'est pas si l'IA est verte, c'est qui décide du volume.**

---

## 22.1 La fabrique des chiffres viraux

### 22.1.1 Place du chapitre dans le triptyque tarifaire

L'Acte IV du livre lit la même facture sous trois angles complémentaires. Le **Ch.5** a posé la physique du **prix par token** — sept couches d'optimisation, LLMflation ×1000 entre 2022 et 2025, économie unitaire de l'inférence. Le **Ch.21** a posé la **valeur métier par outcome** — quatre ruptures structurelles, stack à quatre niveaux token→tâche→processus→outcome, paradoxe agentique. Ce chapitre pose la troisième lecture : ==l'externalité énergétique qui n'apparaît sur aucune facture==, jusqu'au jour où elle y apparaît brutalement (PPA nucléaire, taxe carbone, moratoire municipal).

Les trois lectures se complètent strictement. Le décideur qui ne lit qu'une seule des trois prend une décision biaisée : optimiser le prix par token au détriment de la valeur outcome (Klarna §21.7), ou maximiser la valeur outcome sans regarder l'externalité (DeepSeek-V3 trigger Jevons), c'est se préparer une révision désagréable à 18-36 mois.

> [!INFO] Voir Ch. 5 — Économie unitaire de l'inférence · Ch. 21 — ROI et paradoxe agentique
> Le Ch.5 traite des **mêmes leviers techniques** que ce chapitre — MoE, distillation, quantization, liquid cooling, geo-aware — sous l'angle *direct cost* (sept couches d'optimisation côté facture token). Ce chapitre les reprend sous l'angle *externalité environnementale*. La frontière est claire : Ch.5 = TWh qui se traduisent en lignes de facture cloud ; Ch.22 = TWh qui se traduisent en grid stress local, embodied carbon, eau. Les deux se lisent côte à côte sur les chantiers FinOps + RSE.

### 22.1.2 Quatre chiffres viraux et leur correction

Avant de mesurer, il faut comprendre d'où viennent les phrases qui circulent. Quatre chiffres dominent le débat public depuis cinq ans, et trois sur quatre sont mal cités. La carte des jalons éditoriaux raconte l'histoire :

![Six ans de chiffres viraux et leur correction|1300](../../ia-frugale/images/20260513-01-fabrique-chiffres-viraux.svg)

**2019 — Strubell : « entraîner un Transformer = la durée de vie de cinq voitures ».** L'article d'Emma Strubell, Ananya Ganesh et Andrew McCallum à l'ACL 2019[^strubell-2019] mesurait le coût énergétique d'un cas spécifique : un Transformer NLP entraîné avec *neural architecture search*, c'est-à-dire en explorant des milliers de configurations. La phrase « cinq voitures » est devenue le slogan d'une charge bien plus générique. ==Le chiffre était juste — il décrivait un protocole de recherche extrême, pas un entraînement de production.== Le slogan a circulé sans la clause.

**2023 — Alex de Vries : « ChatGPT consomme 3 Wh par requête ».** L'article publié dans Joule[^devries-2023] proposait un *scénario* — que se passerait-il si l'intégralité du trafic search de Google basculait sur des LLM ? Le chiffre était une extrapolation top-down sur la consommation totale du parc Google divisée par un trafic hypothétique. Repris sans la clause hypothétique, il s'est imposé comme une **métrique par requête**.

**2023 — Li, Yang, Islam, Ren : « 500 ml d'eau pour 10 à 50 réponses ChatGPT ».** L'article *Making AI Less "Thirsty"*[^li-2023] porte sur GPT-3 dans un datacenter Microsoft du Washington State, à un moment précis (été 2023), avec un WUE régional élevé. Le chiffre est sourcé, méthodologique, honnête. ==Le problème : il a été universalisé en règle « ChatGPT boit 500 ml par requête », alors que la fourchette dépend du DC, de l'heure et du modèle, de 1 à 50.==

**2025 — Epoch AI : 0,3 Wh par requête.** Joshua You publie en février 2025 une mise à jour méthodologique[^epoch-2025]. Le hardware a évolué (H100 + tensor cores FP8, batching dynamique, KV cache compressé) ; le décompte de tokens d'origine était surestimé. La conclusion : ==0,3 Wh pour une requête typique GPT-4o, soit un facteur dix sur le chiffre qui structurait l'imaginaire public depuis dix-huit mois.== Sam Altman confirme dans un post de blog quelques semaines plus tard ; Google fait de même pour Gemini (0,24 Wh par requête médiane[^google-2025-gcp]).

Ce n'est pas une querelle de virgules. C'est un facteur dix sur la grandeur la plus citée du débat. La leçon n'est pas qu'il faut faire confiance aux corrections les plus récentes — c'est que **la mesure de l'empreinte d'un système qui évolue tous les six mois doit elle-même se renouveler tous les six mois**, et que tout chiffre cité sans son année et son scope est suspect par défaut.

> [!IMPORTANT] La discipline non-négociable — scope + date + phase
> ==Chaque chiffre d'empreinte cité dans un document décideur, un comité d'engagement, ou un dossier RSE doit porter explicitement son scope (1 / 2 / 3 GHG Protocol), sa date (à la version près si possible) et sa phase (entraînement / inférence / embodied).== Exemple correct : *« 0,3 Wh par requête (Scope 2, inférence, GPT-4o, février 2025, Epoch AI) »*. Exemple incorrect — donc à reformuler : *« ChatGPT consomme 3 Wh par requête »*. La règle est sèche parce que la rigueur n'a pas de prix : un chiffre sans scope ni date ni phase n'est pas un chiffre, c'est un slogan.

---

## 22.2 La grille de mesure — 3 scopes × 3 phases

L'écart entre Strubell 2019 et Epoch 2025 ne vient pas que de l'évolution du hardware. Il vient surtout du fait que **l'empreinte d'un système d'IA est une matrice à deux dimensions** que peu d'études couvrent en entier. Sans la matrice, on additionne des chiffres incomparables ; avec la matrice, on situe chaque chiffre dans une case et la conversation devient possible.

![Matrice scope × phase × outils|1300](../../ia-frugale/images/20260513-02-frameworks-mesure.svg)

### 22.2.1 Les trois scopes du GHG Protocol

Le **GHG Protocol** (Greenhouse Gas Protocol, *Corporate Standard* publié dès 2001) découpe l'empreinte d'une organisation en trois scopes :

- **Scope 1** — émissions directes sur site. Pour un datacenter : générateurs diesel de secours, fuites de gaz frigorigènes, et — pour l'eau — évaporation des tours de refroidissement.
- **Scope 2** — électricité achetée. C'est le poste dominant en exploitation ; sa valeur dépend du mix régional (~180 gCO₂/kWh en France, ~380 en Allemagne, ~600 dans le Wyoming).
- **Scope 3** — tout le reste : fabrication du GPU, du bâtiment, du réseau, transport, fin de vie. ==C'est l'angle mort historique==, et c'est aussi là que se logent les émissions « cachées » des chips fabriqués à Taïwan.

### 22.2.2 Les trois phases du cycle de vie

L'**axe perpendiculaire** est temporel.

- **Entraînement** — un événement ponctuel et discret. GPT-3 est estimé à 552 tCO₂eq ; BLOOM à 50,5 tCO₂eq[^luccioni-bloom] ; Llama 3.1 405B à 8 930 tCO₂eq selon Meta. ==C'est le poste qui a alimenté l'effroi entre 2019 et 2023, mais ce n'est plus le poste dominant.==
- **Inférence** — continu, distribué, dépendant du trafic. Selon Meta et Google, l'inférence pèse aujourd'hui ==entre 65 % et 80 % du total opérationnel== d'un modèle déployé, et la part monte avec la diffusion.
- **Fabrication / embodied** — amortie sur la durée de vie matérielle (typiquement 5 à 7 ans pour un GPU de production). Selon Patterson et Gupta[^gupta-2021], elle peut représenter 25 à 40 % de l'empreinte totale d'un chip une fois l'opérationnel décarboné — voir §22.6.

Le croisement des deux axes donne une matrice 3×3, soit neuf cases distinctes. Un chiffre publié sans précision sur sa case n'est pas comparable à un autre chiffre publié sans précision sur la sienne. C'est aussi simple, et c'est aussi systématiquement ignoré.

### 22.2.3 Outils et normes — l'arsenal métrique

Une floraison d'outils s'est imposée pour instrumenter les neuf cases :

- **CodeCarbon** — instrumentation côté training (mesure RAPL + GPU NVML + mix régional)
- **ML CO2 Impact** — estimateur par GPU-heure et région
- **Green Algorithms** — modèle générique pour la recherche académique
- **MLPerf Power** — benchmark hardware comparatif

Côté **normes**, la base reste l'**ISO/IEC 30134**, qui définit PUE (*Power Usage Effectiveness*), WUE (*Water Usage Effectiveness*), CUE (*Carbon Usage Effectiveness*) et ERF (*Energy Reuse Factor*). La nouvelle **ISO/IEC 21031** spécifique à l'efficacité énergétique du software ML est en cours de validation (publication attendue Q3 2026). Côté **régulation**, l'Union européenne durcit son **Code of Conduct on Data Centres** : volontaire depuis 2008 (~500 sites), il devient un *rating obligatoire* au Q2 2026 dans le cadre du *Data Centre Energy Efficiency Package*[^eu-coc], couplé au *Cloud and AI Development Act*.

> [!ATTENTION] 90 % des chiffres publics omettent une dimension
> ==Quand un communiqué dit *« X grammes de CO₂ par requête »*, demandez systématiquement : scope 1+2 ou +3 ? Inférence seule ou amortie sur l'entraînement ? Quelle région, quelle heure, quel modèle, quelle version ?== Dans plus de neuf cas sur dix, deux des cinq précisions manquent. L'argument n'est pas que ces chiffres sont *faux* — c'est qu'ils sont *incomparables*, et que les empiler dans un dashboard RSE produit une métrique de coucher de soleil : jolie, agrégée, ininterprétable.

---

## 22.3 L'arithmétique honnête 2026

Reprenons à zéro, avec les chiffres de mai 2026.

![Énergie par interaction IA en échelle logarithmique|1300](../../ia-frugale/images/20260513-03-arithmetique-requete.svg)

### 22.3.1 Texte direct — 0,3 Wh

**Modèles « directs » (GPT-4o, Gemini 2.5 Flash, Claude Sonnet).** Une requête typique fait 200 tokens d'entrée et 150 tokens de sortie. Sur un H100 batché à 80 % d'occupation, le compteur tombe entre 0,2 et 0,4 Wh selon le modèle. ==Référence consolidée : 0,3 Wh par requête (Scope 2, inférence, GPT-4o, février 2025), soit moins qu'une seconde de four micro-ondes, ou 1/12 d'une recherche Google avec AI Overview.== Cette valeur est triangulée par trois sources indépendantes : Epoch AI[^epoch-2025], OpenAI (blog Altman février 2025), et Google Cloud[^google-2025-gcp].

### 22.3.2 Texte avec raisonnement — 5 à 20 Wh, l'explosion silencieuse

**Modèles thinking (o3, Claude Opus thinking, DeepSeek R1, Gemini 2.5 Thinking).** Le modèle « réfléchit » avant de répondre, parfois plusieurs dizaines de secondes. La chaîne de raisonnement multiplie le coût par 20 à 70× : ==5 à 20 Wh par requête==. Sur du raisonnement long (preuve mathématique, agent autonome multi-étapes), des cas extrêmes dépassent 100 Wh — l'équivalent d'une heure d'ampoule LED. C'est exactement le facteur 10-74 documenté en Ch.2 sur AIME et en Ch.5 sur les régimes de scaling — vu sous l'angle énergétique, il devient l'**explosion silencieuse du thinking** : la même requête, sur un modèle de raisonnement, consomme un à deux ordres de grandeur de plus qu'en direct, et ce coût ne se voit nulle part dans l'interface utilisateur.

### 22.3.3 Image générée — 2 à 4 Wh

**Imagen 4, Flux 1.1 Pro, Midjourney v7.** Diffusion latente 28 à 50 étapes sur une image 1024×1024 : 2 à 4 Wh. Plus haute résolution ou plus d'étapes : multiplication linéaire. C'est un ordre de grandeur au-dessus du texte direct, et c'est massivement industrialisé en marketing, e-commerce, design.

### 22.3.4 Vidéo générée — 50 à 1 000 Wh, le poste qui explose

**Sora 2, Veo 3, Kling 2.** Un clip de 6 secondes en 720p : 50 à 200 Wh. Un clip 4K de 30 secondes : ==jusqu'à 1 000 Wh==, soit trois ordres de grandeur au-dessus d'une requête texte. C'est le poste qui explose silencieusement parce qu'il est le plus jeune (industrialisation 2025-2026), le plus visible côté usage grand public, et celui que personne ne quantifie dans les *sustainability reports* — la plupart des opérateurs publient des chiffres consolidés *par requête*, en mélangeant texte direct (98 % du volume, 2 % de l'énergie) et vidéo (0,1 % du volume, 30 % de l'énergie selon plusieurs estimations internes).

### 22.3.5 Le débat de l'agrégat — 2 % vs 98 %

Hannah Ritchie résume[^ritchie-2025] le point structurel le plus important du débat 2026 : ==dix requêtes texte ChatGPT équivalent à dix secondes de four micro-ondes ; cent requêtes texte = 30 Wh, soit une minute de consommation moyenne d'un Américain.== Le point n'est pas que la requête est gratuite — c'est qu'elle est négligeable individuellement, et que **le débat doit se déplacer vers l'agrégat**.

Et l'agrégat raconte une autre histoire. ==Si l'on prend les estimations de consommation totale des datacenters IA et qu'on les divise par le trafic public d'inférence, le texte explique 2 % de la facture. Les 98 % restants sont distribués entre entraînement (one-shot mais massif), génération image/vidéo, embeddings d'enterprise, search summaries, et tout ce qui n'est pas une conversation visible==. C'est là que le débat « combien de Wh par ChatGPT » bute : ==la métrique mesurable n'est pas la métrique qui pèse==. Le citoyen qui se demande s'il doit culpabiliser de taper un prompt regarde la mauvaise variable. Le sponsor IA qui présente un dashboard centré requête texte présente le mauvais dashboard.

### 22.3.6 Cas concret — une équipe agentique en 2026

Pour matérialiser, prenons un profil 2026 type : un développeur en stack MCP + agents, dont le quotidien est documenté en Ch.7 et Ch.12.

![Stack-up énergétique d'une équipe agentique 2026|1300](../../ia-frugale/images/20260513-10-equipe-agentique.svg)

Profil journalier : 200 chats directs (60 Wh) + 50 turns de raisonnement (400 Wh) + 80 appels d'outils via MCP (160 Wh) + quelques générations image (15 Wh) + une vidéo (10 Wh prorata). Total : ==~645 Wh par jour, soit ~142 kWh par an et par personne==.

> [!EXAMPLE] Une équipe de 10 personnes — 1,4 MWh/an
> Sur 220 jours ouvrés et 10 personnes, l'équipe consomme ~1,4 MWh par an. C'est l'équivalent de :
> - **7 frigos modernes** sur l'année
> - **~10 % d'une voiture essence moyenne** (15 000 km/an)
> - **~½ vol Paris-NY** pour les 10 membres
>
> ==Le débat « culpabilité du prompt » se déplace : à l'échelle d'une équipe complète, l'IA agentique est mesurable, pas dramatique.== Le sujet pertinent pour la même équipe n'est pas son empreinte IA — c'est le mix électrique de son cloud provider, la concentration locale (a-t-elle un datacenter à Dublin ?), et l'embodied carbon des GPU qu'elle utilise. Trois niveaux que le wattmètre individuel ne voit pas.

---

## 22.4 Eau — trois scopes, un seul vrai sujet

Le débat de l'eau est l'exemple parfait d'un faux scandale qui en cache un vrai. Les chiffres viraux (« 500 ml par requête ») agrègent trois scopes incommensurables, et masquent la seule variable qui compte vraiment : la **concentration locale**.

![Eau — trois scopes et trois sites locaux|1300](../../ia-frugale/images/20260513-04-eau-scope-sites.svg)

### 22.4.1 Scope 1 — évaporation directe (cooling)

Quand un datacenter utilise un *cooling tower* à eau perdue, une fraction de l'eau qui circule s'évapore pour évacuer la chaleur. Le ratio dépend du climat, de la saison et de la technologie. La métrique standard est le **WUE** (*Water Usage Effectiveness*), en L/kWh.

- **Microsoft** moyenne mondiale 2024 : ==0,30 L/kWh, contre 0,49 en 2021 (-39 %)==[^microsoft-2024]
- **Google** moyenne 2024 : ~1,1 L/kWh sur sa flotte évaporative ; ~0 sur ses nouveaux sites *air-cooled* ou direct-to-chip
- **AWS** : ne publie pas de WUE moyenne flotte

### 22.4.2 Scope 2 — eau thermique pour produire l'électricité

Les centrales thermiques (nucléaire, gaz, charbon) consomment massivement de l'eau pour leur cycle de refroidissement : 1,8 à 7,5 L/kWh selon le type. Cette eau est généralement *prélevée puis retournée* (cycle ouvert), mais 1 à 3 L/kWh s'évaporent réellement. ==C'est le scope 2 hydrique, et il est souvent *plus important* que le scope 1== — un détail qui ne figure presque jamais dans les communications opérateurs, parce qu'il pointe une responsabilité externalisée à la chaîne électrique.

### 22.4.3 Scope 3 — fabrication

TSMC consomme ==200 millions de litres par jour== pour ses fabs taïwanaises, soit ~0,1 % de la consommation d'eau de Taïwan. La fabrication d'un GPU H100 mobilise environ 700 à 1 500 L d'eau ultrapure[^tsmc-2024], dont l'essentiel est recyclé en boucle de fab (~85 % en moyenne TSMC 2024). Ce scope est invisible dans les bilans hyperscaler — il appartient au scope 1+2 de TSMC, sous-traité d'une géographie unique.

### 22.4.4 Le bilan d'une session GPT-4o de 50 requêtes

Réagrégeons. Une session GPT-4o de 50 requêtes consomme typiquement :

- **Scope 1** (cooling, datacenter US moyen) : ~7,5 cL
- **Scope 2** (électricité thermique) : ~25 cL
- **Scope 3** (amortissement fabrication GPU) : ~3 cL
- **Total** : **~35 cL** — deux tiers d'un verre d'eau pour 50 requêtes.

Loin du « 500 ml par requête » qui circule encore en 2026 dans les éditoriaux grand public.

### 22.4.5 Le vrai sujet — la concentration locale

L'eau IA globale, rapportée à l'irrigation agricole, est négligeable. ==Le vrai problème n'est pas le bilan global — c'est la concentration spatiale sur des aquifères fragiles.==

- **Phoenix (Arizona)** : datacenters géants en zone de *drought* permanent depuis 2002, l'industrie ouvre des sites dans des bassins déjà sous stress.
- **Dublin (Irlande)** : les datacenters absorbent ==79 % de l'électricité urbaine== ; un moratoire municipal sur les nouvelles implantations tient depuis 2024 et 2025.
- **Atacama (Chili)** : Microsoft et Google explorent des implantations dans le désert le plus aride du monde, sur des aquifères vieux de plusieurs millénaires.
- **Taïwan (Taoyuan, Hsinchu, Tainan)** : 200 ML/jour pour TSMC, alors que le pays a connu sa pire sécheresse historique en 2021.

> [!INFO] Dublin et la Virginie — la concentration en chiffres
> **Dublin** absorbe 79 % de l'électricité urbaine en datacenters. **Virginie du Nord** (Loudoun, Prince William, Fairfax) absorbe ==26 % de la consommation électrique de l'État== — un État de 8,7 millions d'habitants. Le débat eau et électricité est municipal et national, pas mondial. C'est aussi ce qui prépare le bascule politique du Ch.23 — les régulateurs qui agiront en premier seront municipaux.

### 22.4.6 La réponse industrielle — Microsoft 12/2024

Microsoft a annoncé en décembre 2024[^microsoft-zero-water] que **tous ses nouveaux designs depuis août 2024 utilisent un cooling à boucle fermée à remplissage unique**. L'eau est versée à la construction, recircule entre les serveurs et des chillers mécaniques, ne s'évapore jamais. Économie : ==125 millions de litres par DC par an==. Coût : un PUE légèrement dégradé (besoin de chillers mécaniques en plus). Pilotes : Phoenix et Mt Pleasant en 2026. Google déploie du *direct-to-chip liquid cooling* sur ses TPU v6 ; Equinix généralise l'immersion à partir de 2027.

![Sankey des flux d'eau — évaporatif vs boucle fermée|1300](../../ia-frugale/images/20260513-11-sankey-eau.svg)

==En dix-huit mois, l'industrie a tranché : l'eau d'évaporation, c'est fini sur les nouveaux sites.== Le scandale court-circuite l'industrie qui l'a déjà résolu. Le facteur ×120 sur le WUE annuel (1 200 m³/MW/an évaporatif → 10 m³/MW/an closed-loop, après remplissage initial) est l'une des inflexions les plus brutales jamais observées dans une infrastructure industrielle. Le scope 1 hydrique IA est en train de devenir un faux problème — il reste à régler le scope 2 thermique (qui dépend du mix électrique) et la concentration locale (qui ne se règle que politiquement, voir §22.8 et Ch.23).

---

## 22.5 Électricité — annualisé vs pic local

C'est ici que se loge le vrai problème. L'eau a été tranchée par l'industrie en dix-huit mois. L'électricité ne se tranche pas — elle se distribue, et la grille américaine n'a pas été dimensionnée pour absorber un triplement de la demande datacenter en cinq ans.

![Trajectoire mondiale, mix nouveau, rush nucléaire|1300](../../ia-frugale/images/20260513-05-electricite-trajectoire-mix.svg)

### 22.5.1 Les chiffres consolidés AIE 2025

L'**Energy and AI** publié par l'Agence Internationale de l'Énergie en avril 2025[^iea-2025] documente :

- Consommation datacenters mondiaux : **460 TWh (2024) → 945 TWh (2030) → 1 300 TWh (2035)**, scénario base.
- Part globale : ~1,5 % aujourd'hui → ==~3 % en 2030==.
- Croissance 2025 vs 2024 : +17 % (datacenters globaux), +30 % pour les sites accélérés IA.
- Les serveurs IA expliquent **environ la moitié de la croissance totale** des datacenters d'ici 2030.

Aux **États-Unis** (rapport LBNL décembre 2024[^lbnl-2024]) : datacenters US à 58 TWh en 2014 → 176 TWh en 2023 → ==325 à 580 TWh en 2028==, soit 6,7 % à 12 % de la consommation US selon le scénario. ==Le triplement en cinq ans est le plus brutal qu'aura jamais connu la grid américaine en temps de paix.==

### 22.5.2 Le point méthodologique important — l'IA et le reste

Carbon Brief[^carbonbrief-2025] rappelle que dans la projection AIE, **les datacenters expliquent 8 % de la croissance électrique mondiale d'ici 2030** — derrière les véhicules électriques (838 TWh ajoutés) et l'industrie (1 936 TWh). ==L'IA n'est pas la cause dominante de la croissance électrique mondiale ; elle est la cause la plus médiatisée.== Cela n'enlève rien à son intensité locale, mais cadre le débat global.

![La facture mondiale — ordres de grandeur|1300](../../ia-frugale/images/20260513-09-facture-mondiale.svg)

L'échelle logarithmique en TWh annuels remet les choses à plat. L'IA accélérée (~155 TWh estimés 2025) est de l'ordre du crypto-mining (~150 TWh), en-dessous du streaming vidéo (~200 TWh), et **200× plus petite que la production électrique mondiale** (~30 000 TWh). Le rapport à l'aviation civile (~1 400 TWh) est d'un facteur 9. ==Le slogan « l'IA va consommer plus que des pays entiers » est techniquement vrai (Pays-Bas ~110 TWh, Belgique ~80 TWh) et globalement trompeur== : aucune autre activité industrielle moderne ne consomme moins que des pays moyens, et l'IA n'y fait pas exception.

### 22.5.3 Le mix de la nouvelle demande

Sur les **530 TWh additionnels** de datacenters mondiaux d'ici 2030 :

- **~46 % renouvelables** (solaire + éolien + hydro)
- **~31 % gaz naturel** (avec capacités neuves, surtout US)
- **~22 % nucléaire** — la résurrection 2024-2026
- **~1 % charbon** (marginal mais persistant en Asie)

Le nucléaire est le grand retour. ==Microsoft a signé en septembre 2024 un PPA 20 ans avec Constellation Energy pour rouvrir Three Mile Island Unit 1== (835 MW, démarrage 2028)[^tmi-2024] — première fois qu'un réacteur retiré aux US est ressuscité pour un client unique. Amazon a injecté 20 milliards de dollars dans Susquehanna (Pennsylvania, 1 920 MW). Google a signé avec Kairos Power un fleet deal SMR (500 MW, 2030). Meta a engagé Vistra sur quatre sites. **Big Tech a signé plus de 10 GW de nucléaire en douze mois** — un volume jamais vu depuis les années 1970.

### 22.5.4 Le vrai bottleneck — interconnexion grid local

C'est le point que la presse rate systématiquement. Une AI factory de 1 GW consomme autant qu'**une ville de 700 000 habitants — en permanence, 24/7**. La grid moyenne d'un État américain absorbe difficilement plus de 50 à 100 MW de nouvelle demande baseload par an sans renforcement de lignes haute tension. Or, NVIDIA livre des clusters de 100 000 GPU (~150 MW chacun) en deux ans.

==Le bottleneck n'est plus la puissance installée — c'est l'interconnexion grid local.== C'est pour cela que les hyperscalers achètent **des centrales** et non plus de l'électricité : ils contournent la queue d'interconnexion en s'attachant à un point d'injection existant. Three Mile Island, Susquehanna, Kairos — chaque deal nucléaire est aussi (surtout) un raccourci d'interconnexion. Le moratoire de Dublin (2024-2025) est, lu sous cet angle, une décision d'allocation d'interconnexion plus qu'une décision énergétique au sens strict.

> [!QUOTE] AIE — *Energy and AI*, avril 2025
> *« La pression sur la grille américaine et européenne ne vient pas de la disponibilité électrique, mais de la capacité à acheminer une demande baseload concentrée à des points spécifiques. C'est un problème de transmission et d'interconnexion, pas de génération. »*[^iea-2025] La phrase est sèche. Elle déplace le débat : on ne décarbone pas l'IA en ajoutant du solaire à 2 000 km, on la décarbone en ajoutant du nucléaire ou du gaz CCGT à 50 km. Et ça, c'est municipal.

---

## 22.6 Le carbone fantôme — embodied carbon des GPU

C'est le poste que personne ne regarde — et qui devient dominant à mesure que l'opérationnel se décarbone. C'est l'angle mort 2026 le plus structurel, et c'est la raison principale pour laquelle les annonces *« datacenter zero carbon »* sont vraies en scope 2 et trompeuses en scope 3.

![Embodied carbon H100 et courbe d'amortissement|1300](../../ia-frugale/images/20260513-06-embodied-amortissement.svg)

### 22.6.1 Anatomie d'un H100

80 milliards de transistors, 814 mm² de silicium gravé sur le process TSMC 4N. Chaque carte intègre 80 Go de HBM3 (SK Hynix dominant), assemblée via le procédé CoWoS de TSMC sur un interposeur silicium, soudée à un baseboard SXM. NVIDIA publie une *Product Carbon Footprint Summary*[^nvidia-pcf] : ==1 312 kg CO₂eq par baseboard HGX H100, soit environ 164 kg par carte==.

Ventilation par sous-système :

| Sous-système | Part embodied | Commentaire |
| --- | --- | --- |
| **Mémoire (HBM3)** | **42 %** | Le poste dominant — chaque pile HBM3 est un assemblage 3D coûteux énergétiquement |
| **Logique (die GPU + interposeur)** | 25 % | Le die TSMC 4N et l'interposeur CoWoS |
| **Thermique (vapor chamber, baseplate)** | 18 % | Refroidissement local de la carte |
| **Autres** | 15 % | PCB, packaging, connecteurs, transport |

C'est un détail méconnu : **la mémoire HBM domine l'empreinte fabrication d'un GPU IA moderne**, davantage que le die de calcul lui-même. Ce qui place SK Hynix, Samsung et Micron au cœur de la décarbonation embodied, au même titre que TSMC.

### 22.6.2 Le B200 — l'arithmétique se retourne

Le B200 (génération Blackwell) a 208 milliards de transistors (×2,6 vs H100), un die de ~1 600 mm² (×2), et double HBM3E. Par carte, l'empreinte fabrication grimpe — mais l'**efficacité par FLOP** s'améliore : NVIDIA revendique 0,50 gCO₂eq par exaflop sur B200 vs 0,66 sur H100[^nvidia-b200], soit -24 % d'embodied par exaflop. ==Le bilan dépend entièrement de la durée d'usage opérationnel== : un B200 utilisé pleinement 5 ans amortit son embodied surdimensionné ; un B200 obsolète à 3 ans laisse une dette carbone par exaflop **supérieure** à celle d'un H100.

### 22.6.3 La règle d'amortissement — l'inversion silencieuse

Pour un GPU à mix électrique européen (~250 gCO₂/kWh moyen) et 300 W d'usage actif, l'opérationnel annuel est ~660 kg CO₂eq par carte. L'embodied de 164 kg s'amortit donc en **environ 3 mois d'utilisation à pleine charge**. À mix décarboné (nucléaire dédié, ~30 gCO₂/kWh), l'opérationnel tombe à ~80 kg par an : ==l'embodied devient égal à l'opérationnel à 2 ans, et dominant à 5 ans.==

> [!IMPORTANT] L'inversion silencieuse — scope 3 silicium = le prochain front
> ==Tant que le grid est carboné, l'opérationnel domine et l'embodied semble anecdotique. À mesure que les hyperscalers décarbonent l'opérationnel (PPA renouvelables, nucléaire dédié, geo-aware carbon), la **fabrication devient le poste numéro un** — et il dépend d'un seul fournisseur (TSMC) dans une géographie unique (Taïwan), dont le mix électrique reste à 80-83 % fossile.== La décarbonation de l'IA passe par TSMC, pas seulement par les opérateurs cloud. C'est une inversion silencieuse parce qu'elle ne se voit pas dans les *sustainability reports* annuels, qui consolident scope 2 (à la baisse, opérationnel décarboné) et omettent scope 3 (à la hausse, embodied stable ou en hausse en valeur absolue).

### 22.6.4 TSMC — géographie unique, monoculture fossile

Le rapport Greenpeace *Energy Consumption of AI*[^greenpeace-2025] documente que l'industrie semi-conducteurs taïwanaise a augmenté sa consommation électrique de **25 % en deux ans**, principalement pour la production d'AI chips, et que ses fabs restent alimentées à **83 % par des fossiles** (mix Taïwan 2024). Le scope 3 des hyperscalers américains est largement le scope 1+2 de TSMC. La résilience géopolitique du dossier (concentration sur Taïwan, exposition au détroit, monopole 4nm et 3nm) double la résilience environnementale (mix fossile, dépendance gaz LNG importé).

==Décarboner l'IA exige de décarboner la chaîne silicium, pas seulement les datacenters opérateurs.== Et la chaîne silicium est, en 2026, presque entièrement détenue par un seul fournisseur dans une géographie à haut risque énergétique et géopolitique.

---

## 22.7 Les leviers structurels — ce qui marche

Cinq familles de leviers, classées par ordre de grandeur du gain potentiel et par horizon d'action. Le facteur combiné — la règle Patterson 2021[^patterson-2021] — est la nouvelle qui devrait dominer la couverture médiatique et qui ne circule presque pas.

![Leviers structurels par niveau et gain potentiel|1300](../../ia-frugale/images/20260513-07-leviers-structurels.svg)

### 22.7.1 Architecture des modèles — ×3 à ×30

- **Mixture-of-Experts (MoE) sparse** : Mixtral 8×22B active ~39 B paramètres sur 141 B au total, gain énergétique 3 à 6×[^mixtral]. GPT-4o et Claude utilisent désormais des variantes MoE. ==Patterson 2021 chiffrait déjà un gain potentiel ×10 sur les DNN sparses vs denses.==
- **Distillation et quantization** : Phi-4-mini (3,8 B paramètres) bat GPT-4o sur MATH et GPQA tout en consommant ~30× moins par requête. La quantization int8 et int4 divise la mémoire par 2 à 4 sans perte significative sur les modèles modernes.
- **Modèles compacts dédiés (SLM)** : Gemma 4 dans AICore Android, Phi-4 sur PC Copilot+, SmolLM3 sur edge — l'inférence migre du cloud vers le device. Effet collatéral : l'empreinte se déplace de scope 2 cloud vers scope 3 device, mais sur des durées de vie matérielle bien supérieures (5-7 ans pour un téléphone, ~3 ans pour un cycle de remplacement GPU datacenter).

### 22.7.2 Hardware spécialisé — ×2 à ×5

- **Accélérateurs dédiés** : TPU v6 (Trillium) à 4,7× la perf/watt de v5e ; AWS Trainium2 ; Meta MTIA. Patterson estime que *ML-purpose-built* > GPU généraliste sur un facteur 2 à 5×.
- **Refroidissement** : *direct-to-chip liquid* (Google, Meta), immersion biphasique (Microsoft, Equinix). Un PUE qui passe de 1,4 à 1,1 économise 25 % de l'électricité totale du DC. Sur l'eau, voir §22.4.6.

### 22.7.3 Localisation et timing — ×1,5 à ×20

- **Géo-distribution carbon-aware** : Google bât ses workloads non urgents sur les régions et les heures où le mix carbone est le plus propre (Iowa nuit, Finlande hiver). Gain typique : 30 à 50 % sur le carbone d'un workload donné. Patterson chiffre l'effet combiné DC × DNN × processeur à **un facteur 100 à 1 000×** sur l'empreinte d'un entraînement.
- **Mix énergétique dédié** : Three Mile Island, Susquehanna, Kairos SMR — l'objectif est de découpler la nouvelle demande du grid public. Gain : facteur ×10 à ×20 sur l'intensité carbone d'un kWh consommé (de 400 gCO₂/kWh grid mixte à 20-30 gCO₂/kWh nucléaire dédié).

### 22.7.4 Mesure et régulation — multiplicateur d'effort

- **Disclosure obligatoire** : EU Data Centre EE Package Q2 2026 force le rating et la publication PUE/WUE/CUE par site. ==Les opérateurs hors UE le suivront pour vendre en UE== — effet Bruxelles classique.
- **AI Energy Score** (Hugging Face, Sasha Luccioni) : grille publique pour les modèles open-weights ; les modèles propriétaires doivent opt-in, et peu le font.
- **Prix carbone interne** : Microsoft et Google appliquent déjà un *internal carbon fee* (~100 $/tCO₂) qui finance leurs PPA renouvelables. Apple, Meta, AWS suivent.

### 22.7.5 Comportement et design produit — ×5 à ×30

- **Routage modèle** : le routeur GPT-5 d'OpenAI choisit dynamiquement entre mini, standard et thinking selon la difficulté. ==Un bon routage économise 80 % d'énergie sur l'usage agrégé.==
- **Caching agressif** : 30 à 50 % des requêtes texte se rejouent. Le prompt caching d'Anthropic et le KV cache global de DeepSeek divisent le coût par 5 à 10 sur la portion répétée. Renvoi Ch.5 §5.4 pour la mécanique fine.
- **SLM on-device** : la migration de l'inférence vers le téléphone/PC déplace la facture du scope 2 cloud (centralisé) vers le scope 3 device (distribué), avec un effet net globalement favorable au-delà d'un seuil d'usage.

### 22.7.6 Patterson combiné — le facteur 100 à 1 000×

Patterson 2021 résume en une phrase : ==le choix combiné du DC, du DNN, et du processeur peut réduire l'empreinte carbone d'un entraînement par un facteur 100 à 1 000×.== C'est la nouvelle qui devrait dominer la couverture médiatique, et pourtant elle ne circule presque pas — sans doute parce qu'elle implique de citer une décision technique au lieu d'un slogan moral.

> [!INFO] Voir Ch. 5 — mêmes leviers, angle direct cost
> Les cinq familles ci-dessus sont **les mêmes** que celles déroulées en Ch.5 §5.2-5.8 (les sept couches d'optimisation côté coût par token). Les angles diffèrent : Ch.5 mesure des centimes de facture cloud ; Ch.22 mesure des grammes de CO₂eq, des litres d'eau et des MWh agrégés. Le décideur qui pilote son FinOps et son RSE doit lire les deux chapitres comme un seul tableau de bord — chaque optimisation d'architecture, hardware ou usage joue simultanément sur les deux faces de la même décision technique. La cohérence interne est forte : ce qui baisse le coût par token baisse aussi (presque) toujours l'empreinte par token. La divergence apparaît au niveau agrégé — c'est ce que la section suivante traite.

---

## 22.8 Jevons — pourquoi tout ça peut ne servir à rien

Le paradoxe de Jevons (1865) : ==l'amélioration de l'efficacité d'usage d'une ressource ne réduit pas sa consommation totale ; elle l'augmente==, parce que l'efficacité fait baisser le coût marginal, donc le volume explose. Stanley Jevons l'observait sur le charbon britannique au XIXᵉ siècle ; la mécanique se rejoue en 2025-2026 sur l'IA, et c'est la seule histoire qui compte vraiment pour le débat 2030.

### 22.8.1 L'évidence empirique — Google +48 %

==Google. Émissions globales : 11,5 MtCO₂eq en 2019 → 17 MtCO₂eq en 2024 (rapport environnemental 2025[^google-2025]). +48 % en cinq ans, alors que l'empreinte par requête a chuté d'un facteur 5 à 10 sur la même période.== Le facteur volume a écrasé le facteur efficacité.

C'est l'illustration empirique la plus nette du paradoxe Jevons appliqué à l'IA. Google a optimisé chaque levier technique disponible — TPU v5/v6, MoE sur Gemini, direct-to-chip cooling, geo-aware scheduling, PPA renouvelables — et a vu ses émissions absolues monter de la moitié. La raison est triviale : à mesure que chaque requête devient moins chère, plus de requêtes deviennent possibles ; à mesure que les modèles deviennent plus capables, de nouveaux usages s'ouvrent ; à mesure que l'IA s'industrialise, le volume explose.

### 22.8.2 DeepSeek-V3 — Jevons en action

**DeepSeek-V3, janvier 2025.** Modèle entraîné pour ~6 M$ et 2 048 H800, soit ~10× moins de compute que GPT-4. NPR Planet Money[^npr-jevons] documente la réaction : dans les trois mois qui suivent, ==la demande mondiale de compute IA *augmente*== parce que l'efficacité de DeepSeek convainc les financiers que la barrière à l'entrée a baissé, qu'il faut investir *plus*, pas moins. Capex hyperscalers Q1 2025 record. Nvidia : commandes records. Equinix : carnets pleins.

C'est exactement le mécanisme Jevons : un gain d'efficience massif (×10 sur l'entraînement) déclenche une vague d'investissement qui amplifie la consommation totale au lieu de la diminuer. Le retour boursier de l'efficience n'est jamais une réduction de la demande — c'est un repricing du marché qui augmente la demande.

### 22.8.3 Les trois leviers politiques — Hilton et al. FAccT 2025

L'article ACM FAccT 2025 *From Efficiency Gains to Rebound Effects*[^hilton-faact-2025] formalise la mécanique et nomme trois familles de politiques. Ce sont **les seules interventions** documentées dans la littérature qui découplent efficience et consommation totale.

> [!QUOTE] Hilton et al., FAccT 2025
> *« La trajectoire de l'IA dépend des incitations business, de la gouvernance et des normes sociales, pas seulement de l'efficacité technique. Sans intervention politique, l'efficacité ne réduit jamais le total. »*[^hilton-faact-2025] ==La conclusion est dure== : tous les leviers du §22.7, additionnés et multipliés, ne suffisent pas. Il faut une décision politique pour fermer la boucle.

**1. Prix carbone élevé sur le compute IA.** Un prix qui force l'internalisation du coût climatique, indépendant du marché de l'électricité (parce que le marché électricité est saturé par les hyperscalers). Ce prix serait par exaflop consommé, pas par tonne de CO₂eq émise — l'angle métier importe plus que l'angle physique.

**2. Caps absolus régionaux.** Dublin et Singapour ont déjà imposé des moratoires sur les nouveaux datacenters. Bruxelles l'a évoqué dans le *Cloud and AI Act* (consultation Q1 2026). C'est l'arme politique la plus brutale et la plus efficace : pas de négociation sur l'efficience, un plafond physique sur la capacité installée par région.

**3. Allocation vers usages à fort retour social.** Santé, énergie, climat, recherche fondamentale. C'est le moins discuté politiquement, et probablement le plus efficace : reorienter le compute disponible plutôt que limiter sa croissance. Modèle inspiré du *spectrum allocation* en télécom — l'État alloue la ressource rare par enchère ou par usage prioritaire.

### 22.8.4 Les trois trajectoires 2030

Trois trajectoires possibles à l'horizon 2030 selon les politiques activées :

![Trois trajectoires énergétiques 2024-2030|1300](../../ia-frugale/images/20260513-08-trajectoires-2030.svg)

- **Laissez-faire.** Capex hyperscalers continue, nucléaire signé, pas de cap. Conso datacenters mondiale : ==~1 500 TWh en 2030==, 4-5 % du grid global. Tension grid extrême sur 5-7 hubs (Loudoun, Dublin, Phoenix, Taïwan, Singapore, Stockholm, Tokyo).
- **Efficience seule.** Tous les leviers techniques activés (MoE, SLM, liquid cooling, nuclear), pas de régulation Jevons. Conso : **~1 100 TWh** — les gains d'efficience sont mangés à 60 % par le volume. C'est le scénario AIE central.
- **Efficience + plafond.** Cap absolu sur la capacité datacenter par région + prix carbone + obligation de disclosure. Conso : **~650 TWh**, soit ~2 % du grid global. Demande courte. C'est le scénario *Net-Zero Energy* AIE — politiquement difficile, techniquement faisable.

==Le débat « est-ce que l'IA est verte ou pas » est mal posé.== La question n'est pas l'intensité par token, c'est **qui décide du volume agrégé**. Et cette décision se prend dans des assemblées de régulateurs, pas dans des datacenters.

---

## 22.9 Conclusion — quatre points pour ranger le débat

Quatre points tiennent le chapitre, et le quatrième bascule vers le chapitre suivant.

**1. Cesser de relayer les chiffres viraux sans leur scope et leur date.** ChatGPT à **0,3 Wh par requête** en 2026, pas 3 Wh ; l'eau d'un datacenter Microsoft à **0,30 L/kWh** moyen monde, et **~0 sur les nouveaux sites** depuis août 2024. Le slogan est faux, la donnée est publique, la discipline « scope + date + phase » est non-négociable. Un dashboard RSE qui n'a pas adopté cette discipline ne dit rien de vrai sur l'empreinte ; il accumule des chiffres invendables le jour où un auditeur pose la question de la case GHG.

**2. Réorienter l'inquiétude vers l'agrégat et le local.** Le bon indicateur n'est pas la requête, c'est la **part régionale** (Dublin 79 %, Virginie 26 %, Phoenix horizon 2027). ==Le combat est municipal et national, pas individuel.== Le moratoire de Dublin a tenu deux ans ; le Cloud and AI Act bruxellois étudie l'extension à l'échelle UE. Une équipe FinOps + RSE qui veut piloter sérieusement regarde la concentration locale de ses workloads, pas le compteur de prompts d'un copilot.

**3. Compter l'embodied.** Décarboner les hyperscalers sans décarboner TSMC, c'est repeindre la façade en blanc. ==Le scope 3 silicium est le prochain front==, et il dépend d'une géographie unique (Taïwan, 83 % fossile, monoculture TSMC). L'inversion silencieuse est en cours : à mesure que l'opérationnel se décarbone (PPA, nucléaire dédié), la fabrication GPU devient le poste dominant. Un dossier RSE 2026 sérieux pose l'embodied carbon comme une ligne propre, distincte de l'opérationnel, avec son propre plan de réduction (allongement de la durée de vie, recyclage, pression sur TSMC pour mix moins fossile).

**4. Nommer Jevons — c'est ici que le politique commence.** Tous les gains d'efficacité de la décennie ont été engloutis par le volume. Google +48 % d'émissions malgré -10× par requête. DeepSeek-V3 a déclenché une vague d'investissement, pas une vague d'économies. ==Sans plafond ou prix carbone, la trajectoire 2030 sera tirée par la demande, pas par la technologie. C'est un choix politique, pas un destin physique.==

L'IA frugale existe. Elle s'appelle Phi-4 sur un Copilot+ PC, Gemma 4 sur Android, un H100 en Iowa la nuit, un PPA nucléaire en Pennsylvanie, un cap urbain à Dublin. Elle n'a juste rien à voir avec la culpabilité du prompt qu'un utilisateur tape à 21 h depuis son canapé.

> [!INFO] Voir Ch. 23 — Gouvernance
> Le quatrième point est l'amorce du Ch.23. ==Là où s'arrête le mesurable, commence le politique.== Le triptyque tarifaire complet (Ch.5 coût token, Ch.21 valeur outcome, Ch.22 externalité énergétique) cesse d'être un sujet de mesure et devient un sujet de **décision collective**. Le Ch.23 traite de la gouvernance — six référentiels convergents (DORA, AI Act art. 9-15, EBA, BCBS 239, RGPD, ACPR) et la fenêtre du 2 août 2026 pour l'AI Act haut-risque. Le Jevons politique du §22.8 est ce qui transforme la mesure d'externalité en obligation réglementaire (prix carbone interne, caps régionaux, disclosure obligatoire EU DC EE Q2 2026, AI Energy Score). Le passage est direct : la mesure produit le diagnostic ; la gouvernance produit la décision ; l'AI Act produit l'obligation.

> [!WARNING] Trois pièges classiques (100 % traçables)
> **Citer un chiffre énergie sans scope/date/phase** — produit un slogan, pas une mesure (cf. la mécanique des chiffres viraux §22.1). · **Confondre annualisé global et pic local** — l'IA mondiale est négligeable rapportée à l'aviation civile, mais elle absorbe 79 % de Dublin et 26 % de la Virginie. Le bon dénominateur dépend de la décision visée. · **Croire que MoE + nucléaire suffit** — sans plafond Jevons, tous les gains techniques sont mangés par le volume. Google +48 % d'émissions en cinq ans malgré -10× par requête en est la preuve empirique la plus nette.

---

## Sources

[^strubell-2019]: Strubell, E., Ganesh, A., McCallum, A. *Energy and Policy Considerations for Deep Learning in NLP*. ACL 2019. [aclanthology.org/P19-1355](https://aclanthology.org/P19-1355/). Consulté le 13 mai 2026.

[^devries-2023]: de Vries, A. *The growing energy footprint of artificial intelligence*. Joule 7(10), octobre 2023. [cell.com/joule](https://www.cell.com/joule/fulltext/S2542-4351(23)00365-3). Consulté le 13 mai 2026.

[^li-2023]: Li, P., Yang, J., Islam, M.A., Ren, S. *Making AI Less "Thirsty": Uncovering and Addressing the Secret Water Footprint of AI Models*. arXiv:2304.03271, avril 2023 ; publié dans *Communications of the ACM*, 2025. [arxiv.org/abs/2304.03271](https://arxiv.org/abs/2304.03271). Consulté le 13 mai 2026.

[^epoch-2025]: You, J. *How much energy does ChatGPT use?*. Epoch AI Gradient Updates, février 2025. [epoch.ai/gradient-updates](https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use). Consulté le 13 mai 2026.

[^google-2025-gcp]: Google Cloud. *Measuring the environmental impact of AI inference*. Blog Google Cloud, août 2025. [cloud.google.com/blog](https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference/). Consulté le 13 mai 2026.

[^luccioni-bloom]: Luccioni, A.S., Viguier, S., Ligozat, A.-L. *Estimating the Carbon Footprint of BLOOM, a 176B Parameter Language Model*. Journal of Machine Learning Research 24, 2023. [jmlr.org/papers/v24/23-0069.html](https://jmlr.org/papers/v24/23-0069.html). Consulté le 13 mai 2026.

[^gupta-2021]: Gupta, U., Kim, Y.G., Lee, S., Tse, J., Lee, H.-H.S., Wei, G.-Y., Brooks, D., Wu, C.-J. *Chasing Carbon: The Elusive Environmental Footprint of Computing*. IEEE HPCA 2021. [arxiv.org/abs/2011.02839](https://arxiv.org/abs/2011.02839). Consulté le 13 mai 2026.

[^eu-coc]: Commission européenne. *European Code of Conduct for Energy Efficiency in Data Centres* + *Data Centre Energy Efficiency Package* (consultation publique mars-avril 2026). [joint-research-centre.ec.europa.eu](https://joint-research-centre.ec.europa.eu/scientific-activities-z/energy-efficiency/energy-efficiency-products/code-conduct-ict/european-code-conduct-energy-efficiency-data-centres_en). Consulté le 13 mai 2026.

[^ritchie-2025]: Ritchie, H. *How much electricity does AI consume? [2025 summary]*. Sustainability by Numbers, août 2025. [hannahritchie.substack.com](https://hannahritchie.substack.com/p/ai-electricity-2025). Consulté le 13 mai 2026.

[^microsoft-2024]: Microsoft. *2024 Environmental Sustainability Report*, mai 2024. [microsoft.com/sustainability](https://www.microsoft.com/en-us/corporate-responsibility/sustainability/report). Consulté le 13 mai 2026.

[^microsoft-zero-water]: Microsoft. *Sustainable by design: Next-generation datacenters consume zero water for cooling*. Microsoft Cloud Blog, 9 décembre 2024. [microsoft.com/en-us/microsoft-cloud/blog](https://www.microsoft.com/en-us/microsoft-cloud/blog/2024/12/09/sustainable-by-design-next-generation-datacenters-consume-zero-water-for-cooling/). Consulté le 13 mai 2026.

[^tsmc-2024]: TSMC. *Sustainability Report 2024*, juillet 2024 (consommation d'eau des fabs taïwanaises et politiques de recyclage). [esg.tsmc.com](https://esg.tsmc.com/en-US/resources/reports.html). Consulté le 13 mai 2026.

[^iea-2025]: International Energy Agency. *Energy and AI*. World Energy Outlook Special Report, avril 2025. [iea.org/reports/energy-and-ai](https://www.iea.org/reports/energy-and-ai). Consulté le 13 mai 2026.

[^lbnl-2024]: Shehabi, A. et al. *2024 United States Data Center Energy Usage Report*. Lawrence Berkeley National Laboratory, décembre 2024 (commande DOE). [eta.lbl.gov](https://eta.lbl.gov/publications/2024-lbnl-data-center-energy-usage-report). Consulté le 13 mai 2026.

[^carbonbrief-2025]: Carbon Brief. *AI: Five charts that put data-centre energy use – and emissions – into context*. Mai 2025. [carbonbrief.org](https://www.carbonbrief.org/ai-five-charts-that-put-data-centre-energy-use-and-emissions-into-context/). Consulté le 13 mai 2026.

[^tmi-2024]: Data Center Dynamics. *Three Mile Island nuclear power plant to return as Microsoft signs 20-year, 835MW AI data center PPA*. Septembre 2024. [datacenterdynamics.com](https://www.datacenterdynamics.com/en/news/three-mile-island-nuclear-power-plant-to-return-as-microsoft-signs-20-year-835mw-ai-data-center-ppa/). Consulté le 13 mai 2026.

[^nvidia-pcf]: NVIDIA. *Product Carbon Footprint Summary — HGX H100*. Datasheet officielle, 2024. [images.nvidia.com](https://images.nvidia.com/aem-dam/Solutions/documents/HGX-H100-PCF-Summary.pdf). Consulté le 13 mai 2026.

[^nvidia-b200]: NVIDIA Developer Blog. *NVIDIA HGX B200 Reduces Embodied Carbon Emissions Intensity*. 2025. [developer.nvidia.com](https://developer.nvidia.com/blog/nvidia-hgx-b200-reduces-embodied-carbon-emissions-intensity/). Consulté le 13 mai 2026.

[^greenpeace-2025]: Greenpeace East Asia. *Energy Consumption of AI — Appendix: A Bottom-up Analysis*. Avril 2025. [greenpeace.org](https://www.greenpeace.org/static/planet4-eastasia-stateless/2025/04/c97a710a-energy_consumption_of_ai_appendix.pdf). Consulté le 13 mai 2026.

[^mixtral]: Mistral AI. *Mixtral of Experts*. arXiv:2401.04088, janvier 2024. [arxiv.org/abs/2401.04088](https://arxiv.org/abs/2401.04088). Consulté le 13 mai 2026.

[^patterson-2021]: Patterson, D., Gonzalez, J., Le, Q., Liang, C., Munguia, L.-M., Rothchild, D., So, D., Texier, M., Dean, J. *Carbon Emissions and Large Neural Network Training*. arXiv:2104.10350, avril 2021. [arxiv.org/abs/2104.10350](https://arxiv.org/abs/2104.10350). Consulté le 13 mai 2026.

[^google-2025]: Google. *Environmental Report 2025*. Mai 2025 (émissions globales 11,5 → 17 MtCO₂eq 2019-2024). [sustainability.google](https://sustainability.google/reports/). Consulté le 13 mai 2026.

[^npr-jevons]: NPR Planet Money. *Why the AI world is suddenly obsessed with Jevons paradox*. Février 2025. [npr.org/planet-money](https://www.npr.org/sections/planet-money/2025/02/04/g-s1-46018/ai-deepseek-economics-jevons-paradox). Consulté le 13 mai 2026.

[^hilton-faact-2025]: Hilton, A. et al. *From Efficiency Gains to Rebound Effects: The Problem of Jevons' Paradox in AI's Polarized Environmental Debate*. ACM FAccT 2025. [arxiv.org/abs/2501.16548](https://arxiv.org/abs/2501.16548). Consulté le 13 mai 2026.
