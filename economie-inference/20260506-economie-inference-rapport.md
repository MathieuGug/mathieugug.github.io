# L'économie unitaire de l'inférence.

> **En 2026, le prix d'un million de tokens a chuté d'un facteur 1 000 en trois ans — pas grâce à des modèles plus petits, mais grâce à une pile logicielle qui multiplie le débit par GPU d'un ordre de grandeur sur le même silicium. La marge brute des fournisseurs reste pourtant fragile.** — 6 mai 2026, Mathieu Guglielmino.

## Synthèse exécutive

- **La courbe LLMflation est réelle et brutale.** Un modèle de qualité GPT-3 coûtait 60 $ par million de tokens en novembre 2021 ; le même score se paie aujourd'hui 0,06 $ chez Together AI sur Llama 3.2 3B[^1]. ==Trois ordres de grandeur en trois ans, soit un facteur 10 par an — plus rapide que le Moore historique et que la déflation bandwidth dotcom.==
- **Les gains viennent d'abord de la pile logicielle, pas du silicium.** Sur le même B300, une version naïve produit ~1 000 tokens/seconde par GPU ; une version pleinement optimisée monte à 14 000[^9]. Le hardware fait son travail, mais l'écart de 14× se gagne entre PagedAttention, FlashAttention-3, batching continu, FP8/FP4, désagrégation prefill/decode et speculative decoding.
- **La marge brute des fournisseurs d'inférence reste fragile.** Sacra estime celle de Together AI à ~45 % et celle de Fireworks à ~50 % avec une cible de 60 %[^10] — loin des 70-80 % d'un SaaS classique. La cause : le coût des GPU est dans le COGS, pas dans le R&D, et la concurrence pousse les prix vers le bas.
- **Les reasoning models rouvrent la facture.** o1 et o3 multiplient le coût par requête par un facteur 10 à 74 sur des benchmarks comme AIME[^12]. Au moment où la déflation semblait acquise, le test-time compute relance la course aux coûts — et déplace la bataille du « modèle moins cher » vers le « raisonnement moins cher ».

L'inférence est devenue une industrie à part entière. ==L'avantage compétitif s'y joue désormais dans le harness de service, pas dans le poids du modèle.== Ce rapport démonte les sept couches qui composent ce harness, les architectures de désagrégation qui s'imposent en production, et la dynamique de marge qui sépare ceux qui survivront à la déflation de ceux qui n'y survivront pas.

## 1. La chute d'un facteur 1 000

En novembre 2021, OpenAI ouvre l'API GPT-3 au public à 60 $ par million de tokens. Trois ans plus tard, en novembre 2024, le même score MMLU se paie 0,06 $ chez Together AI sur Llama 3.2 3B — soit ==un facteur 1 000==[^1]. Andreessen Horowitz a baptisé le phénomène *LLMflation* et calculé un taux de 10× par an sur les trois dernières années[^1]. À titre de repère, la déflation des transistors sous Moore historique tourne autour de 2× tous les 18-24 mois ; la baisse du prix de la bande passante pendant la bulle dotcom plafonnait à ~5× par an.

[SCHEMA-01]

La trajectoire n'est pas linéaire. Trois régimes se distinguent :

- **2021 — début 2023 : l'ère des modèles encoder-decoder denses.** Le coût est dominé par les FLOPs de génération autorégressive sur des architectures comme GPT-3 (175 B paramètres denses) et Codex. L'utilisation des GPU plafonne autour de 30-40 % parce que le KV cache est mal géré et que le batching est statique.
- **2023 — milieu 2024 : la révolution servicing.** PagedAttention (vLLM, SOSP 2023) résout la fragmentation mémoire du KV cache et permet le batching continu[^2]. FlashAttention-3 (juillet 2024) fait passer l'utilisation du H100 de 35 % à 75 %[^3]. Mistral 7B, Mixtral 8×7B et Llama 2/3 popularisent les modèles open-weight performants. Le prix du token chute d'un facteur 30.
- **2024 — 2026 : MoE + désagrégation + Blackwell.** DeepSeek V3 (671 B totaux / 37 B actifs) et Llama 4 imposent les architectures MoE en production[^4]. Splitwise et Mooncake industrialisent la séparation prefill/decode[^5][^6]. Le passage de Hopper à Blackwell apporte un 15× sur le coût-par-million-tokens grâce au support FP4 natif[^8]. Les benchmarks InferenceMAX (octobre 2025) mesurent ==0,02 $ par million de tokens à 55 TPS/utilisateur sur GPT-OSS-120B avec un système Blackwell pleinement optimisé==[^8][^9].

L'analogie historique la plus fidèle n'est ni Moore ni la dotcom — c'est la baisse du prix du kilowattheure pendant l'industrialisation du XXe siècle. Une combinaison de meilleurs combustibles (silicium plus dense), de meilleures turbines (FlashAttention, PagedAttention) et d'une intégration verticale du grid (la désagrégation prefill/decode) qui n'aurait pas eu d'équivalent sur un système isolé.

## 2. Anatomie du coût d'une seconde-GPU

Pour comprendre où vont les optimisations, il faut d'abord savoir où va le temps. Un appel d'inférence se découpe en deux phases aux profils opposés :

- **Le prefill** (ingestion du prompt) — *compute-bound*. Le modèle traite tous les tokens d'entrée en parallèle. Les unités tensor du GPU tournent à plein régime, la mémoire HBM travaille en deuxième rideau. Sur un H100, un prefill peut atteindre 80 % d'utilisation FLOPS si le batch est correctement formé.
- **Le decode** (génération token-par-token) — *memory-bound*. À chaque pas, le modèle lit l'intégralité de ses poids depuis la HBM pour produire un seul nouveau token. Sur un Llama 70B en FP16, ça fait 140 Go à charger par token : la HBM3 du H100 (3,35 To/s) plafonne le débit à ~24 tokens/seconde par requête. Les FLOPs tensor sont sous-utilisés.

[SCHEMA-02]

Entre les deux, le **KV cache** : pour éviter de recalculer l'attention sur tous les tokens précédents à chaque pas de decode, le modèle stocke en HBM les clés et valeurs déjà calculées. Sa taille croît linéairement avec le contexte et se compte en gigaoctets. Sur Llama 70B avec un contexte de 32 K tokens, le KV cache pèse ~5 Go par utilisateur ; pour servir 100 utilisateurs en parallèle, il faut 500 Go de HBM — ==plus que toutes les variantes commerciales du H100 (80 Go) et du B200 (192 Go) prises individuellement==. C'est cette contrainte qui dicte l'architecture du serveur.

Avant PagedAttention (2023), le KV cache était alloué en blocs contigus de taille maximale[^2]. Si un utilisateur demandait 32 K tokens mais en consommait 4 K, les 28 K restants étaient gaspillés. Le taux d'utilisation effectif de la HBM tombait à 40-50 %. PagedAttention applique le principe de la mémoire virtuelle paginée des OS : les blocs de 16-256 tokens sont alloués à la demande, indexés par un translation table. Le gaspillage tombe à <4 %, et le batch utilisable double, voire quadruple[^2].

Le **batching** complète l'optimisation. Le batching *statique* attend qu'une fenêtre de N requêtes soit pleine avant de lancer un forward pass — chaque requête dans le batch progresse au rythme de la plus lente. Le batching *continu* ajoute des requêtes au batch dès qu'une fente se libère (decode terminé). L'utilisation GPU passe de 40 % à 90+ %, et le coût par token chute de 50 % en production[^2]. C'est devenu la valeur par défaut de vLLM, TensorRT-LLM et SGLang.

## 3. La pile d'optimisation logicielle

Les gains de l'inférence ne viennent pas d'une seule innovation. Ils viennent de l'**empilement** de sept couches logicielles, chacune apportant 1,3× à 4× sur la précédente. Sur un B300, une version naïve produit environ 1 000 tokens/seconde par GPU ; une version pleinement optimisée atteint 14 000 — **un facteur 14 sur le même silicium**[^9].

[SCHEMA-03]

De bas en haut, les couches s'empilent comme suit :

1. **Kernel fusion + tensor cores** (gain ~1,5×). Fusionner softmax + matmul + dropout dans un seul kernel CUDA évite les allers-retours en HBM. FlashAttention-1 (2022) a popularisé le pattern.
2. **FlashAttention-3** (gain ~2×). En exploitant l'asynchronie des Tensor Cores Hopper, le warp-specialization et le block quantization, FA-3 atteint 75 % d'utilisation FLOPS H100 en BF16 (vs 35 % pour FA-2) et 1,2 PFLOPS en FP8[^3].
3. **PagedAttention + continuous batching** (gain ~2-4×). vLLM remplace l'allocation contiguë du KV cache par un système paginé et active le batching continu[^2].
4. **Quantization FP8 / FP4** (gain ~2× chacune). La FP8 sur Hopper est devenue standard pour l'inférence ; la FP4 sur Blackwell apporte un nouveau facteur 2 sans perte significative de qualité sur les modèles correctement calibrés. DeepSeek V3 a démontré la faisabilité de l'entraînement FP8 à grande échelle[^4].
5. **Speculative decoding (EAGLE-3)** (gain ~3-6,5×). Une tête de prédiction légère (1-2 couches au lieu de plusieurs dizaines) génère plusieurs tokens candidats que le modèle cible vérifie en un seul forward pass[^7]. P-EAGLE, intégré dans vLLM, ajoute un 1,69× supplémentaire sur B200 grâce au parallélisme.
6. **Prefix caching** (gain situationnel, jusqu'à 10× sur les workloads RAG). Mémoriser le KV cache des préfixes communs (system prompt, retrieved docs) entre requêtes évite des prefills redondants. Anthropic, OpenAI et Google le facturent désormais à un tarif réduit (10-25 % du prix nominal).
7. **Désagrégation prefill/decode** (voir section suivante).

==Aucune de ces couches n'est un breakthrough en soi.== L'avantage compétitif vient de leur intégration cohérente : un harness comme vLLM ou TensorRT-LLM doit gérer simultanément la planification du KV cache paginé, le scheduling des requêtes en batch continu, les kernels FlashAttention, les calibrations de quantization et les vérifications spéculatives — sans que les couches ne se piétinent. C'est une dette d'ingénierie, pas une dette de recherche.

## 4. Désagréger prefill et decode

L'observation est simple : prefill et decode ont des profils opposés. Les forcer à cohabiter sur le même GPU revient à demander à un sprinter et à un marathonien de partager un short. La conséquence en production : si un utilisateur lance un long prefill, les utilisateurs en cours de decode subissent une latence dégradée (pic de TTFT, dégradation du TPOT). À l'inverse, si on optimise pour le decode, le prefill est sous-utilisé.

La **désagrégation prefill/decode** sépare ces deux phases sur des pools de calcul distincts, communicants par un transfert de KV cache via réseau RDMA. Trois architectures de référence se sont imposées en 18 mois :

- **Splitwise** (Microsoft / UW, ISCA 2024). Mélange hétérogène : prefill sur H100 (compute-bound), decode sur A100 (memory-bound, moins cher)[^5]. Les nœuds communiquent via NCCL au niveau couche par couche. Gain : 1,4× sur la cost-per-query à perf égale.
- **Mooncake** (Moonshot AI, Kimi). Architecture KVCache-centric : un pool de KV cache partagé exploite la DRAM CPU et les SSDs des nœuds GPU sous-utilisés. ==Mooncake sert plus de 100 milliards de tokens par jour aux utilisateurs Kimi, déployé sur des milliers de nœuds==[^6]. Le transfert utilise RDMA pour des latences sub-milliseconde.
- **DistServe** (UCSD, OSDI 2024). Sépare prefill et decode pour respecter des SLO de TTFT et de TPOT indépendants. Le retour d'expérience publié 18 mois plus tard montre une adoption industrielle massive[^13].

[SCHEMA-04]

Le coût n'est pas nul : le transfert du KV cache croît linéairement avec la longueur du contexte. Pour un contexte 128 K sur Llama 70B FP16, on déplace ~20 Go de prefill vers decode. Le réseau devient un budget à part entière — les datacenters d'inférence modernes provisionnent 800 Gbps Ethernet ou InfiniBand HDR/NDR par nœud. Les gains TTFT mesurés sur des workloads réels tournent autour de **1,4 à 2,3×**[^13].

L'effet économique est plus subtil que la simple amélioration de latence. La désagrégation permet d'**allouer** le hardware en fonction du profil de charge : un fournisseur qui voit ses utilisateurs taper des prompts de 50 K tokens (RAG, code) dimensionnera son cluster prefill plus généreusement ; un fournisseur servant majoritairement du chat court fera l'inverse. Cette flexibilité d'allocation est ==la principale raison pour laquelle les hyperscalers maintiennent un avantage de coût sur les fournisseurs spécialisés== — leur trafic est diversifié, ils peuvent rééquilibrer.

## 5. MoE — la nouvelle économie de l'inférence

L'architecture **Mixture of Experts** (MoE) découple les paramètres totaux des paramètres actifs. Un modèle MoE comme DeepSeek V3 a 671 milliards de paramètres au total, mais seulement ~37 milliards sont activés pour traiter chaque token[^4]. Pour Mixtral 8×7B, ces chiffres sont 47 B / 13 B. Les FLOPs par token sont déterminés par les paramètres *actifs* (ce qui réduit le coût de génération), mais la VRAM requise est déterminée par les paramètres *totaux* (ce qui augmente le coût de hosting).

[SCHEMA-05]

L'arbitrage économique est clair : ==MoE bat un dense de même nombre total de paramètres en throughput, mais perd contre un dense de même nombre de paramètres actifs==[^11]. Sur un workload à fort traffic — où la VRAM utilisée pour les poids est amortie sur des milliers de requêtes simultanées — le MoE gagne. Sur un workload à faible traffic — où chaque requête « paie » sa part de VRAM —, le dense gagne.

Trois techniques rendent les MoE viables à grande échelle :

- **Expert parallelism**. Les experts sont distribués entre GPU. Une requête activant les experts 3 et 7 nécessite un all-to-all entre les nœuds qui les hébergent. Le trafic réseau se déplace du data parallelism (gradients en training) vers l'inférence (activations).
- **Routing learning**. Le routeur (un petit réseau qui choisit les experts) doit éviter le déséquilibre — sinon certains experts saturent pendant que d'autres dorment. DeepSeek V3 introduit un *auxiliary-loss-free balancing* qui élimine le coût supplémentaire d'entraînement[^4].
- **Multi-head Latent Attention (MLA)**. DeepSeek V3 compresse le KV cache via une projection latente. Pour un contexte 128 K, le KV cache de Llama 70B pèse ~20 Go ; celui de DeepSeek V3 environ 1 Go — un facteur 20. C'est la véritable raison pour laquelle DeepSeek peut servir des millions d'utilisateurs depuis une infrastructure modeste.

Les chiffres économiques de DeepSeek V3 sont désormais publics : **2,664 millions d'heures H800 pour le pre-training**, à 2 $/heure cela donne 5,6 M$ pour le seul run de pré-entraînement[^4]. SemiAnalysis a souligné que ce chiffre n'inclut ni la R&D, ni les expérimentations préliminaires, ni les salaires — le coût *total* est sans doute 5-10× supérieur. Mais l'écart structurel avec un Llama 3.1 405B (entraîné en 30,8 millions d'heures H100) reste massif. ==DeepSeek a démontré qu'un modèle de qualité GPT-4 peut être entraîné pour <10 M$ de compute pur, et servi à 60 % moins cher qu'OpenAI à qualité équivalente==[^4].

## 6. Le mix matériel — Hopper, Blackwell, et les paris alternatifs

Le marché de l'inférence en 2026 reste dominé par NVIDIA, mais avec une diversification croissante de la couche silicium. Quatre acteurs comptent vraiment :

| Plateforme | TFLOPS FP8/FP4 | VRAM | Cible | $/Mtok (modèle 70B-class) |
|---|---|---|---|---|
| **NVIDIA H100** (Hopper, 2023) | 1 979 FP8 | 80 Go HBM3 | Workhorse | ~0,15 $ |
| **NVIDIA H200** (Hopper, 2024) | 1 979 FP8 | 141 Go HBM3e | Long context | ~0,10 $ |
| **NVIDIA B200** (Blackwell, 2025) | 4 500 FP4 | 192 Go HBM3e | Inférence MoE | ~0,02 $ |
| **AMD MI300X** (CDNA 3, 2024) | 1 307 FP8 | 192 Go HBM3 | Anti-NVIDIA | ~0,12 $ |

Source : InferenceMAX / SemiAnalysis, fiches produits constructeurs[^9].

[SCHEMA-06]

Le saut Hopper → Blackwell est vertical. NVIDIA revendique **15× sur le coût-par-million-tokens** et **10× sur le throughput par mégawatt** pour les charges MoE[^8]. Le moteur principal est le support natif FP4 (Tensor Core de cinquième génération), qui double la densité de calcul à pourcentage d'erreur acceptable. Le NVLink 5 (1,8 To/s par GPU) divise par deux la latence des all-to-all MoE. Sur GPT-OSS-120B en TensorRT-LLM, un B200 produit ==60 000 tokens/seconde par GPU à 1 000 tokens/seconde par utilisateur==[^8].

Hors NVIDIA, trois paris :

- **AMD MI300X / MI400**. Strictement compétitif sur le papier (192 Go HBM3, 1 307 TFLOPS FP8) ; en pratique, l'écosystème logiciel (ROCm vs CUDA) reste le talon d'Achille. Microsoft, Meta et Oracle ont déployé des MI300X en volume, mais surtout pour le decode memory-bound où la VRAM compte plus que les FLOPS.
- **AWS Trainium 2 / Inferentia 3**. AWS facture l'inférence Anthropic Claude sur Trainium 2 à des tarifs 30-40 % inférieurs aux mêmes modèles sur H100. Le pari : intégration verticale (silicium maison + datacenter + service managé) absorbe les marges intermédiaires.
- **Groq, Cerebras, SambaNova**. Spécialistes du decode ultra-rapide : la LPU de Groq dépasse 800 tokens/seconde par utilisateur sur Llama 3 70B, contre ~200 sur un H100 optimisé. Le coût par token reste plus élevé qu'un B200, mais la latence justifie un premium pour les agents en boucle serrée et les voice apps.

==L'enseignement industriel : il n'y a pas un GPU optimal, mais un mix optimal pour un workload donné.== Un fournisseur d'API serveuse à 10 $ par utilisateur-mois aura un mix dominé par H100 et B200 ; un fournisseur d'agents temps-réel à 100 $ par utilisateur-mois acceptera de payer une LPU Groq pour le decode et un H100 pour le prefill.

## 7. La marge fragile, et l'angle mort des reasoning models

L'économie d'un fournisseur d'inférence ressemble à celle d'un transporteur low-cost, pas à celle d'un éditeur SaaS. Le COGS contient le coût des GPU (loués ou amortis), le réseau, l'énergie, et le software stack. La marge brute typique tourne autour de **45-50 %**, contre 70-80 % pour un SaaS de référence[^10].

| Fournisseur | Marge brute estimée (2025) | Cible déclarée | Modèle |
|---|---|---|---|
| **Together AI** | ~45 % | 60 %+ | Inférence à coût (proche du break-even) |
| **Fireworks AI** | ~50 % | 60 % | Inférence + dédiés enterprise |
| **OpenAI / Anthropic** | non public, estimée 60-70 % sur les flagship | — | Marge captive sur les modèles propriétaires |
| **Hyperscalers (AWS, Azure)** | 70-80 % sur Bedrock / OpenAI Service | — | Intégration verticale + premium enterprise |

Sources : Sacra (Together, Fireworks), estimations sectorielles SemiAnalysis[^10].

Trois forces tirent la marge vers le bas, trois la tirent vers le haut. **À la baisse** : la concurrence par les prix entre fournisseurs serveuse (chaque deal de Llama 4 70B se gagne au cent près) ; le coût d'amortissement des GPU achetés au pic 2023-2024 quand les prix retombent ; et la pression contractuelle des clients enterprise qui négocient des rabais de volume. **À la hausse** : la part croissante des deployments dédiés (un client paie un cluster réservé, marge proche du SaaS classique) ; les services à valeur ajoutée (fine-tuning, monitoring, RAG managé) ; et l'effet d'échelle sur l'utilisation GPU (un fournisseur qui charge 80 % de ses GPU au lieu de 50 % a un avantage structurel).

L'**angle mort** est arrivé fin 2024 avec o1 et la série des reasoning models. Ces modèles ne génèrent pas plus vite, ils génèrent **plus** : avant la réponse finale, ils produisent une longue chaîne de pensée invisible qui peut représenter 5 à 50× le nombre de tokens output. Le résultat sur la facture est sans appel : ==des recherches récentes ont mesuré que les reasoning models sont 10 à 74 fois plus chers à exploiter que leurs équivalents non-reasoning sur AIME==[^12].

[SCHEMA-07]

Trois nuances tempèrent ce constat. Premièrement, l'efficacité des chaînes de pensée s'améliore vite : o3-mini est 63 % moins cher qu'o1-mini à performance comparable[^12]. Deuxièmement, le reasoning n'est rentable que sur les workloads qui en ont besoin — un chatbot conversationnel n'a pas à invoquer un raisonnement à 50 K tokens. Troisièmement, le speculative decoding reste partiellement compatible avec les chaînes de pensée, ce qui ouvre une voie d'optimisation supplémentaire.

L'équation économique reste néanmoins inversée : ==la déflation tokens/seconde gagnée par la pile logicielle est partiellement consommée par l'inflation tokens/requête des reasoning models==. Pour un usage code ou math intensif, la facture client peut paradoxalement augmenter en 2026 alors même que le prix unitaire baisse.

## 8. Outlook 12-24 mois

Trois trajectoires plausibles à horizon mai 2027 :

- **La déflation continue, à pente décroissante.** Les gains software faciles ont été cueillis. Les prochains 5× viendront d'une nouvelle génération de hardware (Rubin chez NVIDIA, MI400 chez AMD) et d'optimisations plus marginales. a16z prévoit ==3-5× par an jusqu'en 2027, puis 1,5-2× par an== à mesure que les opportunités se raréfient[^1].
- **La désagrégation se généralise.** Tous les serveurs majeurs (vLLM, TensorRT-LLM, SGLang) supportent désormais la séparation prefill/decode native. La prochaine étape est l'intégration cross-region : prefill à Paris, decode à Dublin, KV cache transféré sur backbone privé. C'est ce que Mooncake déploie aujourd'hui pour Kimi[^6].
- **Le test-time compute redéfinit la métrique.** Si la facture pertinente passe de « $/Mtok » à « $/résolution-de-problème », les comparaisons inter-fournisseurs se reconfigurent. Un modèle qui résout AIME en 20 K tokens à 0,02 $ le Mtok gagne contre un modèle qui le résout en 200 K tokens à 0,01 $ le Mtok. ==L'efficacité de raisonnement devient le KPI dominant==, et les benchmarks comme InferenceMAX migrent vers le coût-par-tâche-réussie.

L'industrie de l'inférence est en train d'achever sa phase de standardisation logicielle. Les briques techniques sont stables ; les architectures de référence convergent ; les benchmarks ouverts (InferenceMAX, MLPerf Inference v6) permettent une comparaison crédible entre acteurs. ==Le terrain de jeu se déplace vers la gestion fine du mix matériel, l'intégration verticale et la capacité à servir des reasoning models à un coût compétitif== — pas vers de nouveaux modèles. Pour Mathieu, ça veut dire qu'un audit d'infrastructure d'inférence devient un livrable possible et lisible, sur la base de métriques publiques.

## Sources

[^1]: Andreessen Horowitz / Guido Appenzeller, *Welcome to LLMflation — LLM inference cost is going down fast*. a16z, novembre 2024. URL : https://a16z.com/llmflation-llm-inference-cost/. Consulté le 6 mai 2026.

[^2]: Kwon, Woosuk et al., *Efficient Memory Management for Large Language Model Serving with PagedAttention*. SOSP 2023, arXiv:2309.06180. URL : https://arxiv.org/abs/2309.06180. Consulté le 6 mai 2026.

[^3]: Dao, Tri et al., *FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision*. NeurIPS 2024, arXiv:2407.08608. URL : https://arxiv.org/abs/2407.08608. Consulté le 6 mai 2026.

[^4]: DeepSeek-AI, *DeepSeek-V3 Technical Report*. arXiv:2412.19437, décembre 2024. URL : https://arxiv.org/abs/2412.19437. Consulté le 6 mai 2026.

[^5]: Patel, Pratyush et al., *Splitwise: Efficient Generative LLM Inference Using Phase Splitting*. ISCA 2024, arXiv:2311.18677. URL : https://arxiv.org/abs/2311.18677. Consulté le 6 mai 2026.

[^6]: Qin, Ruoyu et al. (Moonshot AI), *Mooncake: A KVCache-centric Disaggregated Architecture for LLM Serving*. ACM Transactions on Storage, 2025. URL : https://dl.acm.org/doi/10.1145/3773772. Consulté le 6 mai 2026.

[^7]: Li, Yuhui et al., *EAGLE-3: Scaling up Inference Acceleration of Large Language Models via Training-Time Test*. NeurIPS 2025, arXiv:2503.01840. URL : https://arxiv.org/abs/2503.01840. Consulté le 6 mai 2026.

[^8]: NVIDIA Technical Blog, *Blackwell Raises Bar in New InferenceMAX Benchmarks, Delivering Unmatched Performance and Lowest Cost Per Token*. Octobre 2025. URL : https://blogs.nvidia.com/blog/blackwell-inferencemax-benchmark-results/. Consulté le 6 mai 2026.

[^9]: SemiAnalysis, *InferenceMAX: Open Source Inference Benchmarking*. 2025. URL : https://newsletter.semianalysis.com/p/inferencemax-open-source-inference. Consulté le 6 mai 2026.

[^10]: Sacra, *Together AI revenue, valuation & funding* et *Fireworks AI revenue, valuation & funding*. 2025. URL : https://sacra.com/c/together-ai/. Consulté le 6 mai 2026.

[^11]: Epoch AI, *MoE vs AI dense models: How do they compare in inference?*. 2025. URL : https://epoch.ai/gradient-updates/moe-vs-dense-models-inference. Consulté le 6 mai 2026.

[^12]: OpenAI, *Learning to reason with LLMs*. Septembre 2024. URL : https://openai.com/index/learning-to-reason-with-llms/. Consulté le 6 mai 2026.

[^13]: Hao AI Lab UCSD, *Disaggregated Inference: 18 Months Later*. 2025. URL : https://haoailab.com/blogs/distserve-retro/. Consulté le 6 mai 2026.
