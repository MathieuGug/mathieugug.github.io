# Désagrégation prefill/decode : quand le serving LLM devient un problème d'architecture distribuée

> **La désagrégation prefill/decode fait passer le serving LLM d'un problème de *scheduling* sur GPU homogènes à un problème d'*architecture distribuée* — deux pools de calcul aux profils matériels opposés, reliés par un transfert de KV cache qui est à la fois le déverrouillage (goodput ×7) et le nouveau goulot d'étranglement.** — 15 juin 2026, Mathieu Guglielmino

Le dossier [economie-inference](../economie-inference/) posait le décor : l'avantage compétitif de l'inférence se joue dans le harness de service, pas dans le poids du modèle, et la désagrégation prefill/decode y figurait comme la septième couche d'optimisation. Ce rapport ouvre cette couche. Car en deux ans, la séparation des phases est passée d'une astuce de laboratoire à l'architecture de référence de toute pile d'inférence à grande échelle — Kimi sert 100 milliards de tokens par jour sur une architecture désagrégée[^3], et le 24 mars 2026 le projet `llm-d` est entré au CNCF Sandbox comme implémentation Kubernetes-native de cette idée[^7]. ==La désagrégation n'est plus une optimisation : c'est devenu la forme par défaut d'un système de serving qui veut tenir ses SLO à l'échelle.==

L'histoire est celle d'un déplacement de problème. Tant que prefill et decode partagent le même GPU, le serving est un exercice de *scheduling* : comment entrelacer deux types de travail sur une ressource unique sans que l'un n'affame l'autre. Dès qu'on les sépare, le serving devient un exercice d'*architecture distribuée* : deux clusters spécialisés, un routeur, et un réseau de transport pour acheminer l'état intermédiaire — le KV cache — du premier vers le second. Le goulot d'étranglement ne disparaît pas ; il change de nature.

## 1. L'interférence prefill/decode : deux phases qui se gênent

Tout appel d'inférence autoregressive se décompose en deux phases aux profils matériels diamétralement opposés.

Le **prefill** ingère le prompt. Le modèle traite tous les tokens d'entrée en un seul passage avant, calcule les vecteurs clé/valeur (le KV cache) pour chacun, et produit le premier token de sortie. C'est une opération **compute-bound** : les unités tensor tournent à plein régime, le coût croît avec le nombre de tokens d'entrée, et un prefill bien formé peut saturer les FLOPS d'un H100[^1].

Le **decode** génère la suite, un token à la fois. À chaque pas, le modèle lit l'intégralité de ses poids depuis la HBM et relit tout le KV cache accumulé, pour ne produire qu'un seul token. C'est une opération **memory-bound** : ce qui limite n'est pas le calcul mais la bande passante mémoire, et l'utilisation des unités tensor s'effondre[^1][^2]. ==Le decode n'a pas besoin de la puissance de calcul des GPU les plus récents — il peut tourner sur du matériel moins cher et moins gourmand en énergie.==[^2]

[SCHEMA-01]

Le problème naît quand on colocalise les deux. La technique standard — le *continuous batching*, où l'on regroupe en continu prefills et decodes de requêtes différentes dans le même lot — fait que les deux phases se disputent le même GPU. Et elles se gênent dans les deux sens. Un long prefill, qui monopolise les unités de calcul pendant des centaines de millisecondes, **bloque les decodes** des autres requêtes : leur production de token suivant est suspendue, et leur *Time Per Output Token* (TPOT) part en pic[^4]. Inversement, intercaler des decodes memory-bound dans un lot de prefill **dilue l'utilisation compute** : le GPU passe son temps à attendre la mémoire au lieu de calculer.

Cette interférence est structurelle, pas conjoncturelle. On ne peut pas la régler par un meilleur ordonnancement parce que les deux phases veulent des ressources antagonistes au même instant. C'est l'observation fondatrice de toute la littérature 2024 : ==tant que prefill et decode partagent un GPU, optimiser la latence de l'un dégrade la latence de l'autre.==

## 2. Goodput, pas throughput : la métrique qui change tout

L'erreur classique est de mesurer un système de serving par son *throughput* — le nombre brut de tokens produits par seconde. Cette métrique ment, parce qu'elle ne dit rien du respect des contrats de latence.

Un service LLM a deux SLO (*Service Level Objectives*) orthogonaux, hérités des deux phases :

- le **TTFT** (*Time To First Token*) — combien de temps avant que l'utilisateur voie le premier mot. Gouverné par le prefill.
- le **TPOT** (*Time Per Output Token*) — l'intervalle entre deux tokens successifs, soit la fluidité du flux. Gouverné par le decode.

Ces deux SLO sont indépendants : une application de chat conversationnel exige un TTFT serré (réactivité perçue) ; une application de génération de code long tolère un TTFT lâche mais exige un TPOT régulier (pas de saccades). DistServe introduit la métrique qui réconcilie tout cela : le **goodput** — non pas le débit brut, mais ==le nombre de requêtes par seconde qui respectent *simultanément* leurs deux SLO (TTFT et TPOT)==[^1]. Une requête servie vite mais hors contrat de latence ne compte pas ; elle gonfle le throughput sans satisfaire personne.

[SCHEMA-02]

Le basculement conceptuel est là. Optimiser le throughput pousse à empiler des requêtes dans des lots toujours plus gros — ce qui dégrade précisément les latences individuelles. Optimiser le goodput force à raisonner par phase, avec un budget de latence par phase. Et dès qu'on raisonne par phase, la conséquence est mécanique : si prefill et decode ont des SLO distincts et des profils matériels opposés, pourquoi les laisser sur le même GPU ? ==Le goodput est la métrique qui rend la désagrégation non pas séduisante mais nécessaire.== DistServe mesure le gain : à SLO constant, son architecture désagrégée sert **7,4× plus de requêtes**, ou tient un **SLO 12,6× plus serré**, tout en gardant plus de 90 % des requêtes dans les bornes de latence[^1].

## 3. L'anatomie d'une pile désagrégée

Désagréger, concrètement, c'est éclater le serveur monolithique en quatre organes.

**Le pool prefill.** Un cluster de GPU dédié à l'ingestion des prompts. Comme la phase est compute-bound, ce pool est dimensionné pour le calcul : GPU haut de gamme, parallélisme tensoriel agressif pour réduire le TTFT d'un long prompt. Il calcule le KV cache complet de chaque requête, émet le premier token, puis transmet ce cache au pool decode.

**Le pool decode.** Un cluster séparé qui prend le relais. Comme la phase est memory-bound, ce pool est dimensionné pour la mémoire et le débit agrégé : on y entasse un grand lot de requêtes pour amortir la relecture des poids, et l'on peut y mettre du matériel moins cher — c'est l'argument-clé de Splitwise, qui fait tourner le token generation sur des GPU moins puissants et moins énergivores sans perte de qualité de service[^2].

**Le routeur.** L'aiguilleur d'entrée. Chez NVIDIA Dynamo, le `PrefillRouter` sélectionne un worker prefill par *KV-aware routing* — il route en fonction du recouvrement de cache (un prompt qui partage un préfixe déjà calculé, comme un system prompt commun) et de la charge[^5]. Le routage n'est pas qu'un *load balancing* : c'est une décision qui détermine combien de calcul on peut éviter par réutilisation de préfixe.

**Le transfert KV.** Le tendon qui relie les deux pools. Une fois le prefill terminé, le KV cache de la requête — qui peut peser plusieurs gigaoctets pour un long contexte — doit voyager de la VRAM du GPU prefill vers la VRAM du GPU decode. C'est le maillon nouveau, inexistant dans l'architecture colocalisée, et nous y revenons en section 5.

[SCHEMA-03]

L'autre vertu de l'éclatement est l'**autoscaling séparé**. Les deux pools n'ont aucune raison de monter en charge au même rythme : un trafic riche en prompts longs (RAG, analyse de documents) sature le prefill ; un trafic riche en générations longues (rédaction, agent) sature le decode. En les séparant, chaque pool dimensionne son nombre de répliques indépendamment. Dans `llm-d`, prefill et decode sont deux déploiements Kubernetes distincts, qui scalent chacun via leur propre *Horizontal Pod Autoscaler*[^7]. Splitwise ajoute un troisième pool « mixte » élastique, qui se contracte et s'étend pour absorber les pics et lisser le surdimensionnement[^2].

## 4. Trois écoles de désagrégation

L'idée de séparer les phases a émergé presque simultanément dans trois équipes, avec trois fonctions-objectif différentes. Comprendre la désagrégation, c'est comprendre ce que chacune optimise.

[SCHEMA-04]

**DistServe (OSDI 2024) — l'école du goodput.** L'angle académique, le plus pur. DistServe pose le problème comme une co-optimisation : pour chaque phase, choisir indépendamment le degré de parallélisme et l'allocation de ressources qui maximise le goodput sous contraintes de TTFT et TPOT[^1]. Sa contribution conceptuelle est double : la métrique de goodput elle-même, et un algorithme de placement qui tient compte de la bande passante entre nœuds — quand l'affinité réseau est forte (GPU reliés par NVLink), il place prefill et decode au plus près pour que le transfert KV reste négligeable devant la durée d'un pas de decode[^1]. C'est l'école qui a fourni le vocabulaire.

**Splitwise (ISCA 2024, Microsoft) — l'école de l'efficacité.** L'angle systèmes et énergie. Splitwise part d'une observation matérielle : puisque le token generation sous-utilise le calcul, on gâche de la puissance et du coût en le faisant tourner sur les mêmes GPU haut de gamme que le prefill[^2]. Sa proposition : deux pools de machines hétérogènes — du matériel récent pour le prompt, du matériel moins cher et moins énergivore pour la génération — plus un pool mixte élastique. Le résultat est chiffré en coût et en puissance : ==1,4× de throughput à 20 % de coût en moins, ou 2,35× de throughput à coût et budget de puissance constants== par rapport à une flotte H100 homogène[^2]. C'est l'école qui a transformé la désagrégation en argument de TCO.

**Mooncake (FAST 2025, Moonshot/Kimi) — l'école KVCache-centric.** L'angle production à grande échelle. Mooncake ne se contente pas de séparer les deux phases : il fait du KV cache l'**objet central de l'architecture**[^3]. Autour des clusters prefill et decode, il bâtit un cache désagrégé de KV cache qui récupère les ressources sous-utilisées — CPU, DRAM, SSD — de l'ensemble du cluster GPU, pilotées par un ordonnanceur KVCache-centric qui maximise le débit effectif sous SLO[^3][^10]. Le slogan de la présentation FAST '25 résume la philosophie : *trading more storage for less computation* — échanger du stockage bon marché contre du calcul cher[^11]. Les résultats sont ceux d'un système en production réelle : jusqu'à **+525 % de throughput** en scénario long-contexte simulé, **+75 % de requêtes** servies sous charge réelle, le tout sur des milliers de nœuds traitant **plus de 100 milliards de tokens par jour**[^3]. C'est l'école qui a prouvé que ça tient à l'échelle d'un service grand public.

Les trois écoles ne s'opposent pas : elles se sédimentent. DistServe a donné la métrique, Splitwise l'argument économique, Mooncake la preuve de production et le pattern du KV store désagrégé que reprennent aujourd'hui Dynamo et `llm-d`.

## 5. Le KV cache, nouveau goulot d'étranglement

Le piège de la désagrégation est qu'elle déplace le goulot sans le supprimer. En séparant les pools, on crée une dépendance qui n'existait pas : chaque requête doit faire voyager son KV cache du prefill vers le decode, et ce cache n'est pas petit. Pour un contexte long, il se chiffre en gigaoctets. Si le transfert est lent, on a remplacé l'interférence compute par une latence de transport — et le gain s'évapore.

La règle de viabilité, posée dès DistServe, est simple : ==le transfert du KV cache doit rester négligeable devant la durée d'un pas de decode==[^1]. Tant que cette condition tient, la désagrégation est gratuite ; dès qu'elle se brise (transfert trop lent, contexte trop long, réseau saturé), elle devient nette perte. Tenir cette condition à l'échelle est un problème de transport réseau pur — et c'est devenu un domaine d'ingénierie à part entière.

[SCHEMA-05]

La réponse de NVIDIA est **NIXL** (*NVIDIA Inference Transfer Library*), une bibliothèque de transfert point-à-point open-sourcée à GTC 2025[^6]. NIXL déplace les tenseurs de KV cache directement de la VRAM du GPU prefill vers la VRAM du GPU decode, sans copie CPU intermédiaire, et de façon **non bloquante** : le passage avant du GPU peut continuer à servir d'autres requêtes pendant que le transfert s'effectue en arrière-plan[^6][^5]. Elle abstrait une hiérarchie de backends de transport, du plus rapide au plus lent :

- **Intra-nœud** : NVLink / NVSwitch entre GPU d'un même serveur — la bande passante la plus haute, le cas idéal de DistServe.
- **Inter-nœud** : RDMA sur InfiniBand, ou RoCE via UCX, pour traverser le réseau du datacenter à vitesse de fil.
- **Débordement** : TCP en repli, NVMe-oF pour spiller sur SSD, jusqu'au stockage objet S3-compatible pour les caches froids[^6].

Cette hiérarchie est exactement ce que Mooncake exploite avec son KV store désagrégé : les caches chauds restent en HBM, les tièdes débordent en DRAM/SSD, et le tout devient une mémoire à plusieurs étages adressable par l'ordonnanceur[^3][^10]. Le transfert peut même se faire **couche par couche** (*layer-by-layer*) : dès qu'une couche du Transformer a fini son prefill, son KV cache part vers le decode pendant que les couches suivantes calculent encore — on recouvre transfert et calcul au lieu de les séquencer. ==Le KV cache n'est plus un sous-produit du prefill : il est devenu un objet de première classe, routé, transféré, mis en cache et facturé.==

## 6. Le contre-argument : faut-il vraiment désagréger ?

La désagrégation n'est pas la seule réponse à l'interférence prefill/decode. Une école concurrente répond au même problème *sans* séparer les pools — et il faut la prendre au sérieux, sous peine de désagréger des systèmes qui n'en avaient pas besoin.

C'est la voie de **Sarathi-Serve** (OSDI 2024) et de son *chunked prefill*[^4]. L'idée : plutôt que de laisser un long prefill bloquer les decodes, on **découpe** le prefill en morceaux de taille quasi égale, et l'on intercale ces morceaux avec les decodes en cours dans des lots « sans décrochage » (*stall-free*)[^4]. Le decode n'est jamais suspendu derrière un long prompt, parce que le prompt arrive par petits paquets entre deux pas de génération. On obtient le bénéfice principal de la désagrégation — protéger le TPOT des decodes contre les pics de prefill — tout en restant sur une architecture colocalisée, sans pool séparé ni transfert KV.

Le chunked prefill a un coût propre, honnêtement documenté : découper un prefill en *N* morceaux force à relire le KV cache des morceaux déjà calculés à chaque nouveau morceau, ce qui augmente les lectures depuis la HBM[^4]. Mais comme l'attention en prefill reste compute-bound même à petite taille de chunk, ce surcoût mémoire reste tolérable[^4]. La conséquence pratique est un arbitrage net :

- **Sur un seul nœud, à charge modérée**, le chunked prefill suffit souvent : il évite la complexité opérationnelle de deux clusters et d'un réseau de transport KV. Désagréger ici, c'est payer un transport qu'on n'amortit pas.
- **À grande échelle, sous SLO serrés et contexte long**, la désagrégation gagne : seule elle permet de dimensionner et de faire scaler les deux phases indépendamment, et d'amortir le matériel hétérogène à la Splitwise.

D'où l'émergence d'une troisième voie, la **désagrégation conditionnelle** : ne désagréger qu'au-delà d'un seuil de charge ou de longueur de contexte. Le routeur surveille la file d'attente ; tant qu'elle reste sous le seuil, prefill et decode cohabitent en chunked prefill sur le même worker ; au-delà, le système bascule en mode désagrégé et route les prefills vers un pool dédié. ==Le bon design en 2026 n'est pas « désagréger ou non », mais « savoir à partir de quand ».==

## 7. La bascule production 2026 et l'horizon

En deux ans, la désagrégation est passée des papiers à l'infrastructure standard. La trajectoire est lisible.

[SCHEMA-06]

**2024 — les papiers fondateurs.** DistServe, Splitwise et Sarathi-Serve sortent à quelques mois d'intervalle (ISCA et OSDI), posant la métrique de goodput, l'argument d'efficacité et l'alternative chunked prefill. Mooncake suit en juillet 2024, premier déploiement à l'échelle d'un service grand public[^1][^2][^3][^4].

**2025 — le transport se standardise.** NVIDIA open-source NIXL à GTC et bâtit Dynamo par-dessus vLLM et TensorRT-LLM, transformant le transfert KV en couche réutilisable[^5][^6]. Le problème cesse d'être « comment transférer le cache » pour devenir « comment orchestrer les pools ».

**2026 — la consécration open-source.** Le 24 mars 2026, `llm-d` entre au CNCF Sandbox : une pile Kubernetes-native, portée par IBM, Red Hat, Google, CoreWeave et NVIDIA, où prefill et decode sont des pods de première classe scalés par HPA, branchés sur NIXL pour le transport et la *Gateway API Inference Extension* pour le routage[^7]. ==`vLLM + llm-d + NIXL + Kubernetes` devient l'architecture de référence open-source du serving LLM en production==, déjà adoptée par Meta, LinkedIn, Mistral et Hugging Face[^7][^8]. Là où Dynamo orchestre *au-dessus* de Kubernetes, `llm-d` s'y intègre nativement — deux philosophies pour la même désagrégation[^7].

L'horizon 2026-2028 prolonge trois tendances. D'abord, **la désagrégation au-delà de deux pools** : séparer non plus prefill/decode mais aussi l'attention du reste du modèle, ou dédier des pools au KV store comme service. Ensuite, **le KV cache comme marché** : déjà, le *prefix caching* est facturé à tarif réduit par les grands fournisseurs[^9] ; le pas suivant est un cache KV partagé, persistant et facturé entre requêtes et entre tenants, à la Mooncake. Enfin, **la désagrégation pilotée par SLO** : un contrôleur qui ajuste en temps réel le ratio de pools prefill/decode et le seuil de désagrégation conditionnelle selon les SLO mesurés — la boucle de contrôle que `llm-d` et Dynamo sont en train d'industrialiser.

La leçon dépasse l'inférence. La désagrégation prefill/decode est un cas d'école d'un mouvement plus large : ==le serving LLM mûrit en empruntant, un à un, les patterns vieux de trente ans des systèmes distribués== — pools spécialisés, routage *content-aware*, hiérarchies de cache, transport RDMA, autoscaling découplé. Ce qui était un monolithe GPU devient un système réparti. Et comme toujours dans les systèmes répartis, le travail réel n'est pas de séparer les composants — c'est de gérer ce qui circule entre eux.

## Sources

[^1]: Zhong, Liu et al., *DistServe: Disaggregating Prefill and Decoding for Goodput-optimized Large Language Model Serving*, OSDI 2024 — arXiv:2401.09670. Métrique de goodput, co-optimisation parallélisme par phase, 7,4× requêtes / 12,6× SLO, condition de viabilité du transfert KV.
[^2]: Patel et al., *Splitwise: Efficient Generative LLM Inference Using Phase Splitting*, Microsoft / ISCA 2024 — arXiv:2311.18677. Deux pools matériels hétérogènes + pool mixte, gains coût/puissance (1,4× à -20 %, 2,35× à coût constant).
[^3]: Qin et al., *Mooncake: A KVCache-centric Disaggregated Architecture for LLM Serving*, Moonshot AI — arXiv:2407.00079. Architecture KVCache-centric de Kimi, +525 % throughput simulé, +75 % requêtes réelles, 100 Md tokens/jour.
[^4]: Agrawal et al., *Taming Throughput-Latency Tradeoff in LLM Inference with Sarathi-Serve*, OSDI 2024 — arXiv:2403.02310. Chunked prefill, lots stall-free, l'alternative agrégée à la désagrégation.
[^5]: NVIDIA, *Disaggregated Serving — NVIDIA Dynamo Documentation*. PrefillRouter, KV-aware routing, transfert KV non bloquant via NIXL.
[^6]: NVIDIA, *NIXL — NVIDIA Inference Transfer Library* (GTC 2025). Transport point-à-point VRAM→VRAM, backends RDMA/IB, RoCE/UCX, TCP, NVMe-oF, S3.
[^7]: *llm-d* — projet CNCF Sandbox (accepté le 24 mars 2026). Pile Kubernetes-native, pools prefill/decode en pods HPA, IBM / Red Hat / Google / CoreWeave / NVIDIA ; adoption Meta, LinkedIn, Mistral, Hugging Face.
[^8]: vLLM, *Disaggregated Prefill — production-stack documentation*. Implémentation de référence open-source du prefill désagrégé.
[^9]: Tarification prefix caching des fournisseurs (Anthropic, OpenAI, Google) — cache de préfixes KV facturé à tarif réduit, préfiguration du KV cache comme marché.
[^10]: *Mooncake documentation* — kvcache-ai.github.io. KV store désagrégé sur CPU/DRAM/SSD, ordonnanceur KVCache-centric (conductor).
[^11]: Qin et al., *Mooncake: Trading More Storage for Less Computation*, USENIX FAST '25 presentation. Philosophie de l'échange stockage contre calcul.
[^12]: Patel et al., *Splitwise* PDF (University of Washington) — détails de placement, profils de puissance et dimensionnement des pools.
