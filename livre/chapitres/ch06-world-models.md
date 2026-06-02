---
chapitre: 6
titre: "Bordure : world models et physique apprise"
acte: 1
acte_titre: "Les moteurs"
gabarit: encart
mots: 3340
statut: v1
date_maj: 2026-05-29
---

# Chapitre 6 (encart court) — Bordure : world models et physique apprise

> **Acte I — Les moteurs · Encart court, ~7 pages**
> _On parle beaucoup de world models en 2026. Genie 3 chez DeepMind, V-JEPA 2 chez Meta, Cosmos chez NVIDIA, GAIA-3 chez Wayve, Marble chez World Labs, AMI Labs qui lève un milliard pour LeCun en janvier — un mot qui circulait entre chercheurs depuis 2018 est devenu mot d'ordre stratégique en douze mois. Une question simple : qu'est-ce qu'on appelle vraiment world model, où est-ce mûr, où est-ce que ça reste de la recherche, et pourquoi le sujet revient dans tous les pipelines de pilotage d'écran et de robotique. Bordure pour le décideur, pas produit mûr — sauf sur les 5 % où c'est central._

> [!QUESTION] Question d'ouverture
> Si un LLM est un modèle du langage, qu'est-ce qu'un *world model* — et pourquoi est-ce que la question revient dans tous les pipelines de computer use et de robotique en 2026 ?

> [!TLDR] TL;DR décideur
> - ==Un world model, c'est une fonction apprise `f(état, action) → état suivant`== : il prédit ce qui va se passer, pas ce qu'il faut dire. Différent en nature d'un LLM, qui prédit le mot suivant dans un espace symbolique discret.
> - **Trois architectures concurrentes en 2026**, aucune n'a gagné : V/M/C → RSSM/Dreamer (pixel-prédictif, lignée Ha-Schmidhuber-DeepMind), JEPA (latent, école LeCun), autoregressif latent (Genie 3, Cosmos). Le débat pixel vs latent est technique, pas religieux.
> - ==Pour 95 % des cas d'usage agentiques 2026, ce n'est pas votre problème.== C'est une bordure de recherche, pas un produit mûr — six verrous durs (mémoire courte, physique imparfaite, compute, données vidéo bornées, évaluation immature, sécurité) tiennent encore les déploiements à l'écart.
> - Pour les 5 % restants — pilotage écran avancé ([Ch. 15](ch15-computer-use.md)), robotique humanoïde, conduite autonome, simulation 3D — c'est central. Un *language-conditioned world model* devient l'architecture de référence dans ces niches.
> - Signal faible à 18-36 mois. Ce qu'il faut surveiller : les benchmarks robotiques 2027 (V-JEPA 3 vs Cosmos+SIMA) et le coût marginal d'inférence d'un world model temps réel.

---

## 6.1 Pourquoi le langage ne suffit pas à tout

Un LLM, même excellent, tombe en panne dès qu'on lui demande d'anticiper précisément une trajectoire physique. Décrire un verre qui se renverse, oui — c'est du langage. Anticiper exactement où la flaque va s'étaler, à quelle vitesse, dans quelle forme : non. La grammaire ne fournit pas les contraintes de la gravité, et la statistique des phrases n'apprend pas la cohérence d'un objet à travers le temps.

On pourrait s'en accommoder pour la plupart des cas 2026 — un agent qui rédige un mail, planifie une tournée commerciale, résume un dossier client n'a pas besoin de simuler la physique. Mais la liste des cas où il en faudrait *quand même* s'allonge : pilotage d'écran avancé ([Ch. 15](ch15-computer-use.md)), robotique manipulatrice, conduite autonome, création d'environnements 3D, agents qui apprennent par essai-erreur dans un simulateur. À chaque fois, le même besoin — prédire l'état suivant, pas le mot suivant.

L'idée n'est pas neuve. David Ha et Jürgen Schmidhuber publient en mars 2018 un article fondateur, *World Models*, où ils montrent qu'un agent peut être entraîné *entièrement à l'intérieur de son propre rêve* — un modèle interne génère les futurs, l'agent y apprend une politique, puis on le transfère dans l'environnement réel sans dégradation[^1]. « Apprendre en rêvant », disent-ils. Le terme circulait depuis les années 1990 dans la tradition du *model-based RL* ; 2018 a fixé l'objet dans le deep learning moderne.

![Schéma 1 — Anatomie fonctionnelle d'un world model : 3 entrées (observation / action / état latent) → 3 fonctions (comprendre / prédire / planifier) → 2 sorties + boucle|1300](../../world-models/images/20260505-02-anatomie-world-model.svg)

La définition opérationnelle tient en une ligne : `f(état_t, action_t) → état_{t+1}`. Trois usages se cachent dedans, qu'il faut séparer. ==Comprendre== — condenser l'observation visuelle en une représentation latente compacte. ==Prédire== — étant donné un état et une action envisagée, dérouler un futur. ==Planifier== — utiliser ce modèle comme simulateur interne pour évaluer plusieurs séquences d'actions avant d'agir dans le réel. Les trois partagent la même fonction `f` mais ne sortent pas le même produit. Un world model qui comprend sans prédire sert à la perception ; un world model qui prédit sans planifier devient un générateur de vidéos. C'est la combinaison des trois qui ouvre la boucle agentique physique.

---

## 6.2 Trois architectures concurrentes

![Schéma 2 — Trois architectures comparées : V/M/C (Ha & Schmidhuber 2018), RSSM/Dreamer (DeepMind, Nature 2025), JEPA (LeCun/Meta, V-JEPA 2 2025)|1300](../../world-models/images/20260505-03-trois-architectures.svg)

Trois architectures cohabitent en mai 2026. Elles ne s'invalident pas — chacune vit dans des produits différents, avec ses arbitrages propres.

**V/M/C et la lignée Dreamer.** Ha et Schmidhuber découpent l'agent en trois composants : *Vision* (un autoencodeur variationnel qui compresse l'image en un vecteur latent), *Memory* (un RNN qui prédit la distribution du latent suivant) et *Controller* (très petit, souvent quelques milliers de paramètres, entraîné par évolution). DeepMind raffine le schéma à partir de 2019 avec la famille Dreamer, autour du *Recurrent State-Space Model* qui sépare proprement l'état déterministe de l'état stochastique. ==DreamerV3, publié en 2023 et paru à *Nature* en 2025, est devenu la première politique à collecter du diamant dans Minecraft sans aucune démonstration humaine, sans curriculum, avec une seule configuration d'hyperparamètres testée sur plus de 150 tâches.==[^2] Signal fort en faveur des world models comme **algorithme général** — même recette pour le contrôle continu, les jeux Atari et les environnements 3D.

**JEPA et la lignée Meta.** Yann LeCun défend depuis 2022 une thèse contraire : prédire les pixels est gaspillage, parce que la dimensionnalité y est trop haute et l'incertitude trop difficile à modéliser proprement. *Joint Embedding Predictive Architecture* (JEPA) inverse la cible : on prédit non l'image future mais sa **représentation latente** future, dans un espace appris où les détails inessentiels ont déjà été rabotés[^3] [^4]. Trois étapes — I-JEPA (image fixe, 2023), V-JEPA (vidéo passive, 2024), V-JEPA 2 (juin 2025, vidéo plus planification robotique). V-JEPA 2 est entraîné en deux phases : un million d'heures de vidéo internet pour l'auto-supervisé, puis **seulement 62 heures** de données robot avec actions pour le fine-tuning. Résultat publié : 65 à 80 % de succès en pick-and-place sur objets et environnements totalement inédits. ==Le pari de LeCun s'écrit dans ce ratio : 16 000 fois plus de données passives que de données actives. La planification ne s'apprend pas, elle se déduit d'une bonne représentation.==

**Autoregressif latent — Genie et Cosmos.** Une troisième famille émerge en 2024-2025 autour de transformeurs autoregressifs qui génèrent image après image. Genie 3, dévoilé chez DeepMind en août 2025, est un transformeur de 11 milliards de paramètres qui produit des mondes navigables en temps réel à 720p et 24 images par seconde[^5]. Cosmos chez NVIDIA (CES 2025) décline trois familles sous licence ouverte (Nano, Super, Ultra), entraînées sur 9 000 milliards de tokens issus d'environ 20 millions d'heures de vidéo réelle[^6]. Stratégie NVIDIA lisible : devenir l'infrastructure standard pour entraîner et déployer les world models des autres — Cosmos est déjà adopté par 1X, Figure AI, Agility Robotics, Skild AI. Wayve, sur son couloir conduite, publie GAIA-3 en décembre 2025 — 15 milliards de paramètres en *latent diffusion*, ×5 compute vs GAIA-2[^7].

Aucune des trois familles n'a gagné. C'est probablement la première chose à retenir.

---

## 6.3 Le débat pixel vs latent — un débat technique, pas religieux

![Schéma 3 — Matrice 2×2 pixel/latent × autoregressif/diffusif : neuf modèles positionnés (Sora, Genie 3, GAIA-3, Cosmos, Marble, V-JEPA 2, Dreamer, …)|1300](../../world-models/images/20260505-04-pixel-vs-latent.svg)

Quand un journaliste écrit « world model » en 2026, il peut désigner deux objets très différents. L'école *pixel* prédit des images ou des vidéos directement (Sora, Genie 3, GAIA-3, Cosmos, Marble, Oasis, GWM-1 de Runway). L'école *latent* prédit des représentations apprises (V-JEPA 2, AMI Labs, branche prédictive de Dreamer). La controverse n'est pas qu'académique. Elle se cristallise dans une phrase que LeCun prononce à propos de Sora en février 2024.

> [!QUOTE] Yann LeCun sur Sora (février 2024)
> *« Modéliser le monde pour l'action en générant des pixels est aussi gaspilleur et voué à l'échec. »*

Trois arguments. La dimensionnalité du pixel est immense — le modèle dépense sa capacité à reconstruire des détails inessentiels au lieu d'apprendre la physique. La prédiction pixel est intrinsèquement multi-modale (plusieurs futurs plausibles), ce qui pousse les modèles à générer un futur « moyen » flou et physiquement faux. Et empiriquement, on observe régulièrement des aberrations même dans les meilleures sorties : fourmis à quatre pattes, chaises qui flottent, flammes immobiles, neige qui ne réagit pas aux skis dans Genie 3.

L'école pixel répond symétriquement. **Les données massives existent maintenant** — l'argument valait davantage quand les world models pixel étaient surajustés sur quelques dizaines d'heures de vidéo. **Les modèles diffusifs traitent proprement la multi-modalité** en générant non un futur déterministe mais un échantillon de la distribution conditionnelle — choix de Wayve pour GAIA-3. Enfin, argument décisif côté industriel, **les rendus pixel sont directement utilisables** pour l'évaluation, la simulation, la création de données synthétiques. Un latent abstrait ne fournit rien de tel. C'est ce qui explique pourquoi l'école pixel domine le déploiement en 2026 — conduite (Wayve, Tesla), robotique (Cosmos), création 3D (World Labs, Runway), gaming (Decart). L'école latent garde l'avance théorique pour la planification efficace, mais ses produits commerciaux sont rares.

Et puis il y a janvier 2026. ==Yann LeCun quitte Meta pour fonder AMI Labs à Paris — levée seed de 1,03 milliard de dollars à 3,5 milliards de valorisation, focus robotique industrielle et santé.==[^8] L'arbitrage capital est instructif : pour la première fois à cette échelle, le marché finance une thèse qui dit non au pixel. Le pari sera tranché par les benchmarks robotiques 2026-2027 — et par la capacité de chaque école à passer du laboratoire au déploiement reproductible.

---

## 6.4 La bordure 2026 — six verrous qui retiennent le décideur

![Schéma 4 — Thermomètre des limites : six verrous mesurés (mémoire courte, physique imparfaite, compute, données vidéo bornées, évaluation immature, sécurité)|1300](../../world-models/images/20260505-08-thermometre-limites.svg)

Pourquoi « bordure de recherche » et non « produit mûr » ? Parce que six verrous durs tiennent les déploiements à l'écart, et qu'aucun n'est près de céder.

**Mémoire courte.** Genie 3 oublie au-delà d'une minute. Aucun world model public en 2026 ne tient une cohérence solide au-delà de quelques minutes — ce qui exclut, pour l'instant, toute tâche longue (entretien d'une maison sur une heure, mission robotique sur une demi-journée).

**Physique imparfaite.** Fourmis à quatre pattes de Sora, neige qui ne réagit pas aux skis de Genie 3, chaises qui flottent. Ces erreurs ne sont pas anecdotiques : elles révèlent que les modèles n'ont pas de représentation explicite de la physique, seulement une approximation statistique qui se brise dans les cas non-fréquents.

**Compute coûteux.** GAIA-3 a demandé cinq fois plus de compute que GAIA-2, qui demandait déjà des semaines sur des dizaines de milliers de GPU. Cosmos repose sur 9 000 milliards de tokens d'entraînement. Sans capacité hyperscale, le ticket d'entrée est hors de portée — d'où la concentration sur quelques laboratoires.

> [!INFO] Voir [Ch. 5 — L'économie unitaire de l'inférence](ch05-economie-inference.md)
> Les world models constituent un autre régime de scaling que la pile 7 couches ne capture pas. La LLMflation × 1 000 mesure la déflation tokens/sec sur du texte ; elle ne s'applique pas tel quel à un modèle qui doit prédire 720p × 24 fps en temps réel. Un palier d'inférence world model — sa propre courbe de coût marginal — reste à écrire. Cousin, pas identique.

**Données vidéo bornées.** Les world models pixel ont déjà consommé une part importante de la vidéo internet réellement utilisable. La prochaine décennie de scaling supposera des données synthétiques, captées par des flottes ou des robots — boucle fermée qui pose ses propres questions méthodologiques.

**Évaluation immature.** Personne ne sait évaluer un world model avec rigueur. ==Les benchmarks vidéo (FVD, FID) mesurent l'esthétique, pas la justesse physique.== Les benchmarks robotiques mesurent le succès d'une tâche, pas la qualité de la prédiction interne. L'absence de métrique consensuelle ralentit la convergence du champ et autorise toutes les déclarations marketing.

**Sécurité et désalignement.** Un world model crédible peut servir à entraîner des agents qui agissent dans le monde réel — y compris ceux qu'on ne souhaiterait pas voir déployés. La question de l'audit, de la provenance des données, de la sécurité des poids n'a pas reçu l'attention qu'elle mérite.

Ces six verrous structurent quatre boucles d'application — robotique (verrou de généralisation), conduite (fidélité physique), création 3D (qualité esthétique), agent virtuel (mémoire longue). Aucun modèle actuel n'est compétitif sur les quatre. C'est ce qui rend tentant le marketing de la convergence — et invraisemblable son arrivée avant 2027-2028.

---

## 6.5 Pourquoi la question revient en computer use et robotique

Si c'est encore une bordure pour 95 % des cas, pourquoi est-ce que tout le monde en parle ? Parce que pour les 5 % restants, c'est central — et ces 5 % touchent deux fronts qui structurent l'Acte III.

**Front 1 — Le pilotage d'écran.** Un agent qui clique dans une UI Salesforce sans connecteur dédié partage un substrat avec les world models pixel : il faut comprendre une scène visuelle, prédire ce que produira un clic, planifier une séquence d'actions sur un environnement dont la physique (le DOM, les modaux, les hover states) est apprise empiriquement. La frontière est mince entre un système de *computer use* avancé et un world model spécialisé sur les interfaces.

> [!INFO] Voir [Ch. 15 — Computer use : le régime extrême](ch15-computer-use.md)
> Traitement applicatif des modèles vision-action — Claude computer use, OmniParser, Agent S2, UI-TARS, Magma, OSAgent. Trois architectures concurrentes (vision pure, vision + parseur dédié, agent intégré perception-action), saturation OSWorld à 76,26 % en octobre 2025, cliff UI-CUBE 87 % → 32 % sur les workflows enterprise complexes.

**Front 2 — La robotique humanoïde.** 1X a ouvert en octobre 2025 les précommandes de NEO Gamma — son robot consommateur — sur un modèle commercial mixte : 20 000 dollars d'accès anticipé ou 499 dollars par mois en abonnement. En janvier 2026, l'entreprise publie son 1X World Model, qui ne mappe pas directement texte+images vers commandes motrices (la voie *vision-language-action*) mais ==génère d'abord une vidéo de ce qui devrait se passer dans la scène, puis convertit cette imagination en mouvement réel==. C'est l'architecture *language-conditioned world model* — un LLM injecté à la fois en entrée (instructions) et comme signal de supervision auxiliaire dans le world model. Pas un add-on : un changement de boucle.

![Schéma 5 — La pièce manquante : LLM verbal et World Model physique, intersection agent général|1300](../../world-models/images/20260505-07-piece-manquante.svg)

C'est ce qui donne du poids à la formule de Demis Hassabis, dans un long entretien sur l'AGI en janvier 2026.

> [!QUOTE] Demis Hassabis (14 janvier 2026)
> *« Les world models sont la pièce manquante sur la route de l'AGI. »*

Trois affirmations sous la formule : les LLM, malgré leur scaling continu, n'apprennent pas correctement à raisonner sur les trajectoires causales physiques ; un agent général a besoin d'un world model parce que l'action requiert d'anticiper les conséquences ; la combinaison LLM + world model + planification de type AlphaGo est la voie crédible vers l'AGI à horizon 2030-2035[^9]. LeCun en tire une conclusion plus radicale (les LLM sont une impasse, il faut reprendre depuis JEPA). Fei-Fei Li parle d'« intelligence spatiale ». Consensus tacite : ==les modèles entraînés exclusivement sur du texte ne franchiront pas la marche cognitive suivante.==

Mais la voie majoritaire en 2026 n'est ni purement langagière ni purement world-model. C'est **hybride**. Le LLM gère le raisonnement symbolique de haut niveau, le world model gère les trajectoires physiques fines, un planificateur arbitre. La pièce manquante ne manquera plus d'ici quelques années — ce qui ne signifie pas, attention, qu'on aura atteint l'AGI.

Pour le décideur en mai 2026, le signal est calibré : **bordure à 18-36 mois**, pas chantier immédiat. Trois variables à surveiller — les benchmarks robotiques 2027 (qui trancheront probablement pixel vs latent), le coût marginal d'inférence d'un world model temps réel, et l'attention naissante des régulateurs. Une question à se poser franchement : *est-ce que ce que j'industrialise touche au pilotage d'écran avancé, à la robotique manipulatrice, à la conduite autonome ou à la création 3D ?* Si non, l'Acte II ([Ch. 7](ch07-boucle-agentique.md)) ouvre avec ce qu'il faut.

Question prolongée par l'Acte II : un agent purement langage peut-il faire le même travail qu'un agent avec un world model interne ? Pour la grande majorité des cas 2026, oui. C'est précisément ce qui rend la boucle agentique, ReAct, le harness ([Ch. 7](ch07-boucle-agentique.md)) utilisables dès maintenant, sans attendre que la pièce manquante arrive.

> [!WARNING] Deux pièges classiques
> - **Croire que GPT-4 ou Claude-class est un world model parce qu'il décrit bien une scène.** Décrire n'est pas prédire. Un LLM peut raconter ce qui devrait se passer si vous lâchez un verre ; il ne planifie pas une trajectoire physique avec la précision qu'il faut pour qu'un robot l'exécute. La plausibilité textuelle n'est pas la justesse prédictive.
> - **Sur-investir en world models robotiques en 2026 sans cas d'usage industriel concret.** Le ticket d'entrée à un world model sérieux (cf. GAIA-3, Cosmos) est désormais hors de portée sans capacité hyperscale. Acheter Cosmos comme infrastructure est une chose ; entraîner son propre world model en est une autre — et la seconde n'a de sens qu'avec un volume de données propriétaire (flottes de robots, simulations métier) qu'aucune intégration verticale n'a constitué hors des labs de pointe.

---

## Sources

[^1]: Ha, D. & Schmidhuber, J. *World Models*. NeurIPS 2018, arXiv:1803.10122. <https://arxiv.org/abs/1803.10122> et version interactive <https://worldmodels.github.io/>. Article fondateur de la lignée V/M/C : l'agent peut être entraîné entièrement à l'intérieur de son propre rêve.

[^2]: Hafner, D., Pasukonis, J., Ba, J., Lillicrap, T. *Mastering Diverse Domains through World Models* (DreamerV3). arXiv:2301.04104, publié à *Nature* en 2025. <https://arxiv.org/abs/2301.04104>. Premier diamant Minecraft sans démonstration humaine, plus de 150 tâches avec une seule configuration d'hyperparamètres.

[^3]: LeCun, Y. *A Path Towards Autonomous Machine Intelligence*. OpenReview, juin 2022. Position paper de référence sur JEPA — prédire la représentation latente future plutôt que les pixels.

[^4]: Bardes, A. et al. *V-JEPA 2: Self-Supervised Video Models Enable Understanding, Prediction and Planning*. arXiv:2506.09985, juin 2025. <https://arxiv.org/abs/2506.09985>. 1 million d'heures de vidéo passive + 62 heures de données robot — ratio 16 000 : 1.

[^5]: Google DeepMind. *Genie 3: A new frontier for world models*. Blog post, 5 août 2025. <https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/>. 11 milliards de paramètres, 720p à 24 fps, temps réel ; mémoire de session ~1 minute.

[^6]: NVIDIA. *NVIDIA Launches Cosmos World Foundation Model Platform to Accelerate Physical AI Development*. Newsroom, CES 2025. <https://nvidianews.nvidia.com/news/nvidia-launches-cosmos-world-foundation-model-platform-to-accelerate-physical-ai-development>. 9 000 milliards de tokens d'entraînement, trois familles (Nano, Super, Ultra), adopté par 1X, Figure AI, Agility Robotics, Skild AI.

[^7]: Wayve. *Wayve launches GAIA-3, advancing world models from simulation to evaluation*. Communiqué, décembre 2025. <https://wayve.ai/press/wayve-launches-gaia3/>. 15 milliards de paramètres en latent diffusion, ×5 compute vs GAIA-2, données de 9 pays sur 3 continents.

[^8]: MIT Technology Review. *Yann LeCun's new venture is a contrarian bet against large language models*. 22 janvier 2026. <https://www.technologyreview.com/2026/01/22/1131661/yann-lecuns-new-venture-ami-labs/>. Seed 1,03 Md$ à 3,5 Md$ de valorisation, focus robotique industrielle et santé, pari latent contre l'école pixel.

[^9]: Hassabis, D. cité dans *Demis Hassabis on AGI, World Models, and the Next Golden Age of Science*. Entretien, 14 janvier 2026. <https://jalookout.com/2026/01/14/demis-hassabis-agi-world-models-deepmind/>. La pièce manquante sur la route de l'AGI ; combinaison LLM + world model + planification MCTS.
