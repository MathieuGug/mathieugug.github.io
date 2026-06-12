# La désagrégation prefill / decode

> **Le prefill et le decode sont deux charges aux profils matériels antagonistes que l'histoire a forcées à partager la même puce ; les séparer en pools distincts reliés par une fabrique de transfert de KV cache débloque 2 à 7× de *goodput* sous SLO — et fait du KV cache, non plus du GPU, le centre de gravité du système d'inférence.** — 12 juin 2026, Mathieu Guglielmino

## Synthèse exécutive

- **Une requête d'inférence LLM n'est pas une charge homogène : c'est deux régimes matériels opposés.** Le *prefill* (lecture du prompt) sature le calcul ; le *decode* (génération token par token) sature la bande passante mémoire. ==Les exécuter sur le même GPU force un compromis perdant : un long prefill bloque les decodes en cours et fait exploser la latence inter-token.== [^1][^2] [SCHEMA-01]

- **La désagrégation sépare les deux phases en pools matériels distincts**, reliés par un transfert du KV cache. DistServe sert **7,4× plus de requêtes** ou tient un **SLO 12,6× plus serré** à isopérimètre ; Splitwise atteint **2,35× de débit** à coût et puissance constants[^1][^2]. [SCHEMA-02]

- **Le KV cache devient le centre de gravité du système.** Mooncake — la plateforme de Kimi (Moonshot AI), *Best Paper* à FAST 2025 — réorganise toute l'architecture autour d'un pool de KV cache distribué sur la VRAM, la DRAM et le SSD inexploités du cluster[^3][^4]. ==Le goulot d'étranglement n'est plus le FLOP, c'est l'octet de cache et sa bande passante de transfert.== [SCHEMA-03]

- **La bonne métrique n'est pas le débit agrégé mais le *goodput*** : le nombre de requêtes servies *en respectant simultanément* les deux SLO (TTFT pour le prefill, TPOT pour le decode). Un système peut afficher un débit record tout en violant ses SLO sur la moitié des requêtes[^1][^12]. [SCHEMA-04]

- **La désagrégation n'est pas gratuite, et elle a un rival intra-instance : le *chunked prefill***. Sarathi-Serve découpe le prefill en morceaux interleavés avec les decodes (ordonnancement *stall-free*, **5,6×** de capacité)[^7]. Le vrai espace de conception 2026 est un continuum : multiplexer dans une instance, ou désagréger en pools — selon l'échelle, la longueur des prompts et l'hétérogénéité du matériel. [SCHEMA-05]

- **En 2026, la désagrégation est passée de la recherche au cœur de tous les moteurs majeurs** — vLLM (llm-d), SGLang, TensorRT-LLM, NVIDIA Dynamo. Kimi K2 tourne sur **128 GPU H200** en P/D désagrégé (224k tok/s prefill, 288k tok/s decode) ; DeepSeek-R1 sur **96 H100** atteint 52,3k tokens d'entrée et 22,3k de sortie par nœud[^8][^9]. [SCHEMA-06]

---

## 1. Le péché originel : deux charges antagonistes sur une même puce

Une requête envoyée à un grand modèle de langage traverse deux phases dont les profils de calcul n'ont presque rien en commun.

La première, le **prefill**, ingère le prompt entier d'un coup. Tous les tokens d'entrée sont traités en parallèle : une cascade de multiplications matricielles denses (*GEMM*) sur l'ensemble de la séquence. C'est une charge à **haute intensité arithmétique** — beaucoup d'opérations par octet lu en mémoire — qui sature les unités de calcul du GPU. Sur un H100, un prefill de quelques milliers de tokens approche le pic théorique de FLOPS de la puce[^2][^12].

La seconde, le **decode**, génère la réponse un token à la fois. À chaque pas, le modèle ne traite qu'**un seul** nouveau token, mais doit relire l'intégralité des poids du modèle *et* tout le KV cache accumulé. L'intensité arithmétique s'effondre : presque aucun calcul par octet transféré. La phase devient **bornée par la bande passante mémoire** (HBM), et les unités de calcul restent largement oisives[^1][^2]. ==Un GPU en phase de decode gaspille la quasi-totalité des FLOPS pour lesquels on l'a payé.==

Placer ces deux régimes sur le même <span class="term" data-tooltip="Roofline model : graphe reliant la performance atteignable à l'intensité arithmétique d'une charge, borné à gauche par la bande passante mémoire, à droite par le pic de calcul.">roofline</span> rend la tension visible : le prefill vit à droite du *ridge point* (zone compute-bound), le decode à gauche (zone memory-bound). Aucun réglage matériel ne peut être optimal pour les deux à la fois. [SCHEMA-01]

### 1.1 L'interférence : quand le prefill étrangle le decode

Le problème ne serait qu'académique si les deux phases ne se disputaient pas le **même** GPU au même instant. Les moteurs d'inférence classiques (vLLM monolithique, TGI première génération) *colocalisent* les phases et les *batchent* ensemble. Or quand un long prefill arrive dans le batch, il monopolise les unités de calcul pendant plusieurs dizaines de millisecondes — et **tous les decodes en cours s'arrêtent**. Le lecteur d'un chatbot voit alors sa génération se figer ponctuellement : c'est l'interférence prefill→decode, qui se traduit par des **pics de TPOT** (*time per output token*) hautement variables[^1][^7].

DistServe quantifie l'effet : sous colocalisation, satisfaire à la fois un SLO de <span class="term" data-tooltip="Time To First Token : délai entre l'envoi de la requête et l'émission du premier token. Gouverné par la phase de prefill.">TTFT</span> serré et un SLO de <span class="term" data-tooltip="Time Per Output Token : délai moyen entre deux tokens générés successifs. Gouverne la fluidité perçue du streaming. Aussi appelé ITL (inter-token latency).">TPOT</span> fluide devient quasi impossible : optimiser l'un dégrade systématiquement l'autre[^1].

### 1.2 Le double couplage : parallélisme et matériel

L'interférence n'est que la partie visible. La colocalisation impose deux couplages plus profonds :

- **Couplage du parallélisme.** Le prefill, compute-bound, tire profit d'un fort <span class="term" data-tooltip="Tensor Parallelism : découpage des matrices de poids entre plusieurs GPU pour paralléliser une même couche. Réduit la latence au prix d'une communication all-reduce.">parallélisme tensoriel (TP)</span> qui réduit sa latence. Le decode, memory-bound, préfère souvent un TP plus faible et davantage de requêtes en parallèle pour amortir la lecture des poids. Un seul réglage de parallélisme pour les deux phases est un compromis bancal[^1].

- **Couplage matériel.** Le decode n'a pas besoin des FLOPS d'un H100 ; il a besoin de **bande passante et de capacité mémoire**. Splitwise observe qu'on peut faire tourner le decode sur du matériel moins cher et moins gourmand en énergie sans perte de débit — impossible tant que la même machine doit aussi encaisser les prefills[^2].

C'est ce triple constat — interférence, couplage du parallélisme, couplage matériel — qui motive la désagrégation.

---

## 2. L'anatomie de la désagrégation

L'idée est simple à énoncer : **assigner le prefill et le decode à des GPU différents**, organisés en deux pools spécialisés, et transférer l'état intermédiaire de l'un vers l'autre.

Le chemin d'une requête devient[^1][^5] : [SCHEMA-02]

1. Un **routeur / ordonnanceur** reçoit la requête et choisit une instance de **prefill**.
2. L'instance de prefill calcule le KV cache du prompt entier — phase compute-bound, sur du matériel à forts FLOPS.
3. Le **KV cache** de la requête est **transféré** vers une instance de **decode** (le cœur du système, cf. §3).
4. L'instance de decode génère la réponse token par token — phase memory-bound, sur du matériel à forte bande passante mémoire.
5. Un signal de **feedback SLO** alimente l'ordonnanceur pour rééquilibrer dynamiquement la taille des deux pools (cf. §5).

Chaque pool peut désormais être dimensionné, parallélisé et matérialisé **indépendamment**. C'est exactement ce que verrouillait la colocalisation.

### 2.1 DistServe : la preuve par le goodput

DistServe (Zhong et al., *OSDI 2024*) est le papier fondateur. Il co-optimise, pour chaque phase, l'allocation de ressources *et* le plan de parallélisme, puis place les deux phases en tenant compte de la bande passante du cluster pour minimiser le coût de communication. Résultat : ==**7,4× plus de requêtes servies, ou un SLO 12,6× plus serré**, tout en respectant les contraintes de latence pour plus de 90 % des requêtes==[^1][^12].

Le point conceptuel central de DistServe : en éliminant l'interférence, on peut serrer *chaque* SLO séparément, là où la colocalisation imposait un arbitrage permanent.

### 2.2 Splitwise : l'argument économique

Splitwise (Patel et al., Microsoft Research, *ISCA 2024*) attaque l'angle coût/énergie. En séparant la « phase de calcul du prompt » et la « phase de génération de tokens » sur des machines distinctes, chaque phase tourne sur le matériel qui lui convient. Le gain : **2,35× de débit à budget de coût et de puissance constants**, ou 1,4× de débit à 20 % de coût en moins face à une baseline 100 % H100[^2]. La désagrégation n'est pas qu'une optimisation de latence — c'est un levier d'**efficience capitalistique** du parc GPU.

---

## 3. Le KV cache devient le centre de gravité

Désagréger déplace le problème : il faut maintenant **transférer le KV cache** du pool de prefill vers le pool de decode, par requête. Pour un grand modèle et un long prompt, ce cache pèse plusieurs centaines de mégaoctets à plusieurs gigaoctets. Mal géré, le transfert annule tout le gain. [SCHEMA-03]

### 3.1 La fabrique de transfert : RDMA, NVLink, NIXL

Le réseau TCP/IP classique est trop lent : il faut plusieurs Go/s par requête. Les clusters de production s'appuient donc sur des interconnexions à accès mémoire direct — <span class="term" data-tooltip="Remote Direct Memory Access : un GPU lit directement la mémoire d'un autre sans passer par le CPU ni la pile réseau de l'OS. InfiniBand en est le support typique.">RDMA</span> (InfiniBand) ou NVLink — qui laissent un GPU lire la VRAM d'un autre sans passer par le CPU[^5]. NVIDIA Dynamo formalise cette fabrique avec **NIXL**, une bibliothèque qui transfère le KV cache de VRAM à VRAM de façon **non bloquante** : les passes avant du GPU continuent de servir d'autres requêtes pendant le transfert[^5][^6].

L'astuce d'ordonnancement clé est le **transfert pipeliné couche par couche** : DistServe envoie le cache des premières couches vers le nœud de decode pendant que les dernières couches sont encore calculées sur le nœud de prefill, recouvrant ainsi le calcul et l'I/O réseau[^1].

### 3.2 L'overhead est réel — surtout sur les petits prompts

La désagrégation a un coût mesurable. Sur 8 GPU MI300X, le transfert de KV cache de vLLM ajoute en moyenne **1,4× sur le débit et 1,9× sur le TTFT**, avec un surcoût *plus grand* pour les **petits prompts** — précisément parce qu'il y a alors moins de calcul pour recouvrir le transfert[^10]. ==La désagrégation gagne quand les prompts sont longs et le déploiement à grande échelle ; elle perd quand les prompts sont courts et l'instance unique.== C'est la racine du continuum de la §6.

### 3.3 Mooncake : tout réorganiser autour du cache

Mooncake (arXiv 2407.00079, *Best Paper FAST 2025*), la plateforme de Kimi, pousse la logique à son terme : une architecture **KVCache-centric**. Au-delà de séparer prefill et decode, Mooncake construit un **pool de KV cache distribué** qui exploite la **CPU, la DRAM et le SSD sous-utilisés** de tout le cluster GPU[^3][^4]. Son ordonnanceur, centré sur le cache, maximise le débit effectif sous contrainte de SLO et tire parti de la **réutilisation de préfixe** : un prompt système partagé entre milliers de requêtes n'est calculé qu'une fois, son cache servant à tous. En simulation, Mooncake gagne jusqu'à **525 % de débit** sous SLO ; sur traces réelles, +59 % à +498 % de capacité effective[^3]. Le système de Kimi n'organise plus des GPU autour d'un modèle — il organise un **cache** autour d'une flotte de GPU.

---

## 4. Goodput, pas throughput : la métrique qui change tout

Le déplacement le plus subtil opéré par la désagrégation est métrologique. La bonne mesure n'est pas le **débit** brut (tokens/seconde agrégés) mais le **goodput** : le nombre de requêtes servies *en respectant simultanément* les deux SLO[^1][^12]. [SCHEMA-04]

Pourquoi la distinction est porteuse : un système colocalisé peut afficher un débit agrégé flatteur en empilant d'énormes batchs — tout en violant le SLO de TTFT (prompts qui attendent) ou de TPOT (générations saccadées) sur une fraction importante des requêtes. ==Ce débit-là est en partie du « gaspillage » : des tokens produits hors contrat de latence, donc sans valeur pour l'utilisateur.== Le goodput ne compte que les requêtes *dans la boîte SLO* définie par les deux seuils (TTFT max, TPOT max).

La désagrégation optimise directement cette boîte : comme chaque phase a son propre pool, on serre le TTFT en ajustant le pool de prefill et le TPOT en ajustant le pool de decode, sans que l'un sabote l'autre. DistServe se présente d'ailleurs explicitement comme un système *goodput-optimized*[^1][^12].

### 4.1 Le ratio P:D, variable de pilotage

La conséquence opérationnelle : le **ratio entre nœuds de prefill et nœuds de decode (P:D)** devient un cadran de réglage. Une charge de type RAG (longs prompts, courtes réponses) est gourmande en prefill ; un agent qui raisonne longuement (court prompt, longue génération) est gourmand en decode. Les déploiements de production ajustent ce ratio dynamiquement — LMSYS fait tourner DeepSeek-R1 avec un pool de **3 nœuds de prefill et 9 nœuds de decode** pour son profil de charge[^8]. Le bon ratio n'est pas universel : il suit la distribution des longueurs entrée/sortie du trafic réel.

---

## 5. Le rival intra-instance : le chunked prefill

La désagrégation n'est pas la seule réponse au problème d'interférence. Son rival le plus sérieux travaille *à l'intérieur* d'une instance unique : le **chunked prefill** de Sarathi-Serve (Agrawal et al., *OSDI 2024*). [SCHEMA-05]

Plutôt que d'exiler le prefill sur d'autres GPU, Sarathi-Serve le **découpe** en morceaux de taille à peu près égale, puis **interleave** ces chunks avec les decodes en cours dans des batchs hybrides. Aucun decode n'est plus jamais bloqué derrière un long prefill : l'ordonnancement devient <span class="term" data-tooltip="Stall-free scheduling : ordonnancement qui ajoute de nouvelles requêtes à un batch sans jamais suspendre les decodes en cours, en fractionnant les prefills.">*stall-free*</span>. Le gain : jusqu'à **5,6×** de capacité de service, en domptant l'arbitrage débit/latence sans aucun transfert réseau[^7].

### 5.1 Un continuum, pas un duel

Opposer les deux approches est trompeur. Elles occupent un **continuum** :

- Le **chunked prefill** ne paie aucun transfert de KV cache et brille à **petite échelle** ou sur une instance unique — mais il garde un certain couplage (le même GPU fait toujours les deux phases, avec le même parallélisme et le même matériel).
- La **désagrégation** paie le transfert mais découple *tout* : parallélisme, matériel, dimensionnement. Elle brille à **grande échelle**, sur **longs prompts**, avec du **matériel hétérogène**.

Le point de bascule dépend de trois variables : l'**échelle** du déploiement (nombre de GPU), la **longueur des prompts** (plus ils sont longs, plus le transfert se recouvre et plus la désagrégation gagne), et l'**hétérogénéité du parc** (du matériel mixte rend la spécialisation par phase rentable). Beaucoup de systèmes 2026 combinent d'ailleurs les deux : chunked prefill *à l'intérieur* du pool de prefill, désagrégation *entre* les pools.

---

## 6. L'état de l'art 2026 : qui désagrège quoi

En l'espace de dix-huit mois, la désagrégation est passée du papier de recherche au **socle architectural par défaut** des moteurs d'inférence à grande échelle. [SCHEMA-06]

| Système | Origine | Spécificité |
|---|---|---|
| **DistServe** | UCSD / PKU, OSDI'24 | Co-optimisation parallélisme + placement, goodput-first[^1] |
| **Splitwise** | Microsoft, ISCA'24 | Matériel hétérogène par phase, argument coût/puissance[^2] |
| **Mooncake** | Moonshot AI (Kimi), FAST'25 | KVCache-centric, pool DRAM/SSD, prod à l'échelle[^3][^4] |
| **NVIDIA Dynamo** | NVIDIA, 2025 | NIXL VRAM↔VRAM, routing KV-aware, 30× DeepSeek-R1 Blackwell[^5][^6] |
| **SGLang / vLLM (llm-d)** | Communauté, 2025 | P/D désagrégé open-source à 96-128 GPU, backends Mooncake/NIXL[^8][^9][^10] |

### 6.1 Le matériel hétérogène, enfin exploitable

La désagrégation rend concret ce que Splitwise théorisait : **affecter le bon GPU à la bonne phase**. En 2026, la doctrine d'ingénierie est stabilisée — le prefill réclame des FLOPS bruts (H100 SXM5, B200, B300), le decode réclame de la bande passante et de la capacité mémoire (H200 et ses 141 Go de HBM3e)[^9]. Des travaux poussent même le **cross-vendor** : prefill sur NVIDIA H100, decode sur AMD MI300X, le KV cache franchissant la frontière du fabricant[^10][^11].

### 6.2 Les chiffres de production

Les déploiements ouverts confirment l'échelle. LMSYS sert **Kimi K2 sur 128 GPU H200** en P/D désagrégé avec parallélisme d'experts massif : **224k tok/s en prefill, 288k tok/s en decode**[^9]. La même équipe reproduit **DeepSeek-R1 sur 96 H100** (12 nœuds), atteignant **52,3k tokens d'entrée et 22,3k tokens de sortie par nœud** — soit jusqu'à **5×** le débit de sortie d'un parallélisme tensoriel vanille à ressources égales[^8]. Côté cloud, AWS propose désormais l'inférence désagrégée via llm-d en production managée[^10].

---

## 7. Trajectoires 2026-2028

La séparation prefill/decode n'est qu'un premier découpage. La trajectoire est claire : **désagréger à grain de plus en plus fin, et faire du cache un service de premier ordre.** [SCHEMA-07]

- **Désagrégation à grain fin.** Des travaux comme *Adrenaline* désagrègent l'**attention** elle-même — la sous-opération memory-bound — pour récupérer la capacité de calcul oisive du decode et booster l'utilisation des ressources[^11]. La granularité descend de la phase vers l'opérateur. D'autres (PPD) distinguent même les prefills *eux-mêmes* selon qu'il s'agit d'un premier tour ou d'un tour multi-tour avec préfixe déjà en cache.

- **Cross-vendor et désagrégation matérielle.** Le découplage matériel par phase ouvre la porte à des parcs mixtes (NVIDIA + AMD), où chaque phase atterrit sur le silicium le plus rentable, indépendamment du fabricant[^10][^11].

- **Le KV cache comme service global.** La logique de Mooncake — un pool de cache distribué sur tout le cluster — tend vers un **KVCache-as-a-service** : un cache global, partagé entre modèles et requêtes, avec réutilisation de préfixe à l'échelle de la flotte[^3][^4].

- **Couplage avec le MoE et le parallélisme d'experts.** Les déploiements 2025-2026 (DeepSeek, Kimi K2) montrent que la désagrégation P/D et le **parallélisme d'experts** à grande échelle se renforcent : séparer les phases permet d'appliquer à chacune le schéma de distribution d'experts qui lui convient[^8][^9].

---

## 8. Conclusion

La désagrégation prefill/decode corrige une anomalie historique : avoir traité comme une charge unique deux régimes matériels opposés. En les séparant, on récupère un facteur 2 à 7 sur le goodput, on rend le parc GPU hétérogène exploitable, et on déplace le centre de gravité du système — du GPU vers le KV cache. ==Le système d'inférence de 2026 ne s'organise plus autour du calcul, mais autour de la mémoire et de son transfert.== Reste un arbitrage vivant, pas un dogme : entre multiplexer dans une instance (chunked prefill) et désagréger en pools, le bon choix suit l'échelle, la longueur des prompts et la composition du parc. La frontière 2027-2028 désagrège déjà plus finement — l'attention, le préfixe, l'expert — et fait du cache un service partagé. Le FLOP n'est plus roi ; l'octet de cache l'a détrôné.

---

*Format co-écrit avec l'aide d'une IA.*

## Sources

[^1]: Yinmin Zhong et al., *DistServe: Disaggregating Prefill and Decoding for Goodput-optimized Large Language Model Serving*, OSDI 2024. [arxiv.org/abs/2401.09670](https://arxiv.org/abs/2401.09670)
[^2]: Pratyush Patel et al., *Splitwise: Efficient Generative LLM Inference Using Phase Splitting*, ISCA 2024, Microsoft Research. [Splitwise_ISCA24.pdf](https://www.microsoft.com/en-us/research/wp-content/uploads/2023/12/Splitwise_ISCA24.pdf)
[^3]: Ruoyu Qin et al., *Mooncake: A KVCache-centric Disaggregated Architecture for LLM Serving*, FAST 2025 (Best Paper). [arxiv.org/abs/2407.00079](https://arxiv.org/abs/2407.00079)
[^4]: Mooncake — dépôt `kvcache-ai/Mooncake` (plateforme de serving de Kimi, Moonshot AI). [github.com/kvcache-ai/Mooncake](https://github.com/kvcache-ai/Mooncake)
[^5]: NVIDIA, *Disaggregated Serving* — documentation Dynamo (NIXL, transfert KV VRAM↔VRAM non bloquant). [docs.dynamo.nvidia.com](https://docs.dynamo.nvidia.com/dynamo/design-docs/disaggregated-serving)
[^6]: NVIDIA, *Introducing NVIDIA Dynamo, A Low-Latency Distributed Inference Framework for Scaling Reasoning AI Models*, 2025. [developer.nvidia.com](https://developer.nvidia.com/blog/introducing-nvidia-dynamo-a-low-latency-distributed-inference-framework-for-scaling-reasoning-ai-models/)
[^7]: Amey Agrawal et al., *Taming Throughput-Latency Tradeoff in LLM Inference with Sarathi-Serve*, OSDI 2024 (chunked prefill, stall-free batching). [arxiv.org/abs/2403.02310](https://arxiv.org/abs/2403.02310)
[^8]: LMSYS Org, *Deploying DeepSeek with PD Disaggregation and Large-Scale Expert Parallelism on 96 H100 GPUs*, 5 mai 2025. [lmsys.org/blog/2025-05-05-large-scale-ep](https://www.lmsys.org/blog/2025-05-05-large-scale-ep/)
[^9]: LMSYS Org, *Deploying Kimi K2 with PD Disaggregation and Large-Scale Expert Parallelism on 128 H200 GPUs*, 20 juillet 2025. [lmsys.org/blog/2025-07-20-k2-large-scale-ep](https://www.lmsys.org/blog/2025-07-20-k2-large-scale-ep/)
[^10]: AWS, *Introducing Disaggregated Inference on AWS powered by llm-d*, 2025. [aws.amazon.com/blogs/machine-learning](https://aws.amazon.com/blogs/machine-learning/introducing-disaggregated-inference-on-aws-powered-by-llm-d/)
[^11]: *Injecting Adrenaline into LLM Serving: Boosting Resource Utilization and Throughput via Attention Disaggregation*, arXiv 2503.20552, 2025. [arxiv.org/abs/2503.20552](https://arxiv.org/abs/2503.20552)
[^12]: Hao AI Lab (UCSD), *Throughput is Not All You Need: Maximizing Goodput in LLM Serving using Prefill-Decode Disaggregation*, blog des auteurs de DistServe. [haoailab.com/blogs/distserve](https://haoailab.com/blogs/distserve/)
