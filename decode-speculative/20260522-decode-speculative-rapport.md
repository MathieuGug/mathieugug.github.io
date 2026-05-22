# Décode spéculative en production

> **La décode spéculative est passée du papier (2023) à l'option par défaut des frameworks de serving (2026). Elle livre 2× à 4× sur le temps par token sans modifier la sortie — mais son gain réel dépend d'un paramètre invisible : l'acceptance rate, qui s'effondre dès que le draft sort de sa distribution d'entraînement ou que le batch grossit.** — 22 mai 2026, Mathieu Guglielmino

## Synthèse exécutive

- **Le théorème d'équivalence tient.** Leviathan, Kalman et Matias (Google Research) le démontrent en 2022 : si l'on accepte chaque token spéculatif avec probabilité `min(1, p_target/p_draft)` et qu'on rééchantillonne le rejet sur `max(0, p_target - p_draft)`, la distribution de sortie est **strictement identique** à celle d'une décode autoregressive standard[^1]. La décode spéculative ne dégrade ni la qualité, ni la calibration, ni les benchmarks. C'est une optimisation de latence, pas un compromis de qualité.
- ==**Les gains observés en production sont entre 2× et 4× sur le temps par token.**== Les chiffres convergent en 2025-2026 : ~2,3× pour la décode spéculative naïve avec draft model externe[^2], 2,2-3,6× pour Medusa-2 selon le domaine[^3], 3,0-4,5× pour EAGLE-3 sur les modèles Llama 3.1 / 3.3[^4]. Lookahead Decoding atteint 1,5-2,3× sans aucun draft model, ce qui le rend particulièrement attractif quand le déploiement d'un second poids GPU est coûteux[^5].
- **L'acceptance rate est le paramètre caché.** Une décode spéculative ne va vite que si le draft model prédit ce que le target aurait prédit. En code, le taux d'acceptance dépasse souvent 80 % (vocabulaire restreint, structures répétitives) ; en génération créative, il chute à 40-50 % ; sur un domaine *out-of-distribution* pour le draft, il s'effondre sous 30 % et la spéculation devient **plus lente** que la décode standard[^7].
- ==**Le piège du batching dynamique.** Le speedup spéculatif est maximal à `batch_size=1` (decode memory-bound). À `batch_size=32` ou plus, le serveur sature les unités compute du GPU et le surcoût du draft annule le gain. vLLM, SGLang et TensorRT-LLM ont intégré en 2025-2026 des politiques d'activation conditionnelle qui désactivent la spéculation dynamiquement passé un seuil de batch[^6]==[^9][^10].
- **L'état du marché s'est consolidé.** vLLM (UC Berkeley), SGLang (sgl-project), TensorRT-LLM (NVIDIA) et DeepSpeed-MII (Microsoft) supportent désormais en GA au moins une variante spéculative chacun. EAGLE-3 est devenu le défaut sur Llama 3.x / Qwen 2.5 en 2026 ; Medusa reste populaire chez ceux qui ne veulent pas reentraîner ; Lookahead garde sa niche en zero-train deployment[^4][^5][^10].

## 1. Pourquoi décoder est sériel

L'inférence LLM se découpe en deux phases asymétriques. La **prefill** traite le prompt complet en un seul forward parallèle : 1 000 tokens d'entrée = 1 forward, compute-bound, le GPU sature ses tensor cores. La **decode** génère les tokens de sortie *un par un*, chaque token dépendant du précédent : 100 tokens de sortie = 100 forwards séquentiels[^6]. Cette deuxième phase est **memory-bound** — le goulot n'est pas le compute, c'est le débit de lecture du KV cache et des poids du modèle depuis la HBM vers les registres.

Une seule décode autoregressive d'un Llama-3 70B sur un H100 lit environ 140 Go de poids et 2-30 Go de KV cache par token généré, sur une bande passante HBM3 de ~3,35 To/s — ce qui plafonne théoriquement à ~24 tokens/seconde. Le GPU passe l'essentiel de son temps à attendre la mémoire ; ses tensor cores sont sous-utilisés (souvent à 5-15 % de leur peak FLOPS pendant la décode)[^6]. C'est ce *slack compute* qui rend la spéculation possible : il y a de la puissance de calcul disponible si l'on trouve un moyen d'évaluer plusieurs tokens en parallèle.

D'où l'idée fondatrice. Plutôt que d'attendre que le target produise le token N pour ensuite produire le token N+1, on demande à un **petit modèle rapide** (le *draft*) de produire spéculativement les K tokens suivants. Le *target* — le gros modèle — les valide tous en **un seul forward parallèle** (compute-bound, comme un mini-prefill). Si le draft a bien deviné, on a généré K tokens en un seul aller-retour HBM au lieu de K. Si le draft a mal deviné, on retombe sur la décode normale à partir du dernier token accepté.

## 2. Anatomie de la décode spéculative

La boucle se décompose en trois étapes (voir Schéma 1).

**Étape 1 — Drafting.** Un modèle léger (typiquement 10-100× plus petit que le target : Llama-3.2-1B pour drafter Llama-3.1-70B, par exemple) génère K tokens autoregressifs. Ce coût est faible — le draft est petit, sa décode est rapide même séquentielle. K varie typiquement entre 4 et 8 ; au-delà, l'acceptance rate chute trop vite pour que ça paie.

**Étape 2 — Verification.** Le target reçoit la séquence préfixe + les K tokens proposés en *un seul forward*. Cela produit les distributions `p_target` aux positions 1 à K+1. Cette étape utilise le `tree attention mask` (voir Schéma 2) : un masque qui permet à plusieurs branches d'hypothèses de coexister dans le même forward sans interférence.

**Étape 3 — Accept / Reject.** Pour chaque position i, on compare `p_target[i]` à `p_draft[i]`. Le critère d'acceptation est `accept_with_prob(min(1, p_target[i] / p_draft[i]))`. Si tous les K tokens sont acceptés, on a généré K+1 tokens en un forward target (le +1 vient de la position K+1, qui est échantillonnée fraîche depuis `p_target[K+1]`). Si le token i est rejeté, on échantillonne un token de remplacement depuis la distribution `max(0, p_target[i] - p_draft[i])` (normalisée), on tronque tout ce qui suit, et on relance le drafting au prochain cycle[^1][^2].

Le point théorique clé — celui qui rend la technique adoptable sans débat de qualité — est l'**équivalence de distribution**. Leviathan et al. prouvent que ce schéma produit des séquences indistinguables d'une décode standard du target : même distribution marginale, même comportement de sampling, même reproductibilité à seed fixe. Pas de *trade-off qualité/vitesse* — c'est ce qui distingue la décode spéculative d'autres optimisations agressives (quantification 4-bit, pruning, distillation) qui dégradent toutes mesurablement les benchmarks[^1]. C'est aussi pourquoi l'industrie a basculé : ==aucune justification produit n'est nécessaire, la sortie est bit-identique en sampling stochastique==.

![Schéma 1 — Décode séquentielle vs spéculative : anatomie temporelle|1200](images/20260522-01-decode-sequentielle-vs-speculative.svg)

*Schéma 1 — À gauche, la décode autoregressive : un forward target par token, la HBM est le goulot. À droite, la spéculation : K tokens proposés par le draft (petits forwards rapides) puis un forward target unique qui les valide en parallèle. Le coût ne croît qu'en proportion de l'acceptance rate.*

![Schéma 2 — L'arbre de tokens spéculatifs : tree attention et vérification parallèle|1200](images/20260522-02-arbre-tokens-tree-attention.svg)

*Schéma 2 — Les variantes modernes (Medusa, EAGLE, TensorRT-LLM tree decoding) proposent un arbre de continuations plutôt qu'une seule séquence linéaire. Un masque d'attention spécialisé permet de vérifier toutes les branches dans un seul forward target ; le serveur retient le plus long préfixe accepté.*

## 3. Quatre familles de variantes

Le paysage des variantes s'est structuré entre 2023 et 2025 autour de quatre approches qui répondent toutes au même problème — *où trouver le draft model ?* — par des stratégies différentes (voir Schéma 3).

**Famille 1 — Draft model externe (Leviathan, Chen).** L'approche originale : on entraîne ou on télécharge un petit modèle de la même famille (Llama-3.2-1B pour drafter Llama-3.1-70B). Avantages : zéro modification du target, draft réutilisable sur plusieurs tailles, sampling stochastique propre. Inconvénients : il faut héberger et charger un second modèle (occupation VRAM, latence de chargement), et le draft doit avoir été pré-entraîné sur une distribution proche du target sinon l'acceptance rate s'effondre[^1][^2].

**Famille 2 — Têtes additionnelles (Medusa, Hydra).** Tianle Cai et al. (Together AI, Princeton) proposent en 2024 d'**ajouter K têtes de décode sur le target lui-même** — chaque tête prédit le token à i+1, i+2, …, i+K en parallèle, à partir de la même couche cachée[^3]. Avantage majeur : pas de second modèle, pas de second poids à charger. Inconvénient : le draft n'est plus autoregressif (chaque tête voit la même couche cachée, pas la prédiction de la tête précédente), donc l'acceptance rate des tokens lointains chute vite. Hydra corrige partiellement en réintroduisant une dépendance séquentielle entre têtes[^12]. Medusa-2 (2024) augmente le nombre de têtes et combine avec tree attention pour atteindre 2,8× sur Vicuna 7B[^3].

**Famille 3 — Feature-level autoregression (EAGLE).** Yuhui Li et al. (Microsoft Research, Vector Institute) repèrent en 2024 un défaut de Medusa : prédire les tokens directement est intrinsèquement bruité. EAGLE prédit la **feature** (l'embedding intermédiaire de la couche pénultième) au lieu du token, puis applique la couche LM finale séparément. La feature étant un signal plus stable que le token, EAGLE atteint des acceptance rates 30-40 % plus élevés que Medusa sur les mêmes K[^4]. EAGLE-2 (mi-2024) introduit un mécanisme de **dynamic draft tree** qui adapte la profondeur et la largeur du tree à la confiance courante. EAGLE-3 (2025) supprime l'entraînement de la feature loss au profit d'une nouvelle fonction d'objective basée sur la sequence-level acceptance — atteignant 4,5-5× sur Llama 3.1 8B et 3,0-4,5× sur Llama 3.3 70B[^4]. **EAGLE-3 est en 2026 l'état de l'art de la décode spéculative entraînée.**

**Famille 4 — Jacobi parallel decoding (Lookahead).** Yichao Fu et al. (LMSYS, UCSD) proposent en 2024 une approche radicalement différente : **pas de draft model du tout**. Lookahead Decoding utilise un solver Jacobi pour résoudre en parallèle un système d'équations fixe-points sur les futurs tokens, en exploitant le fait que le target lui-même peut servir de critique. Acceptance rate plus faible (35-55 %), mais zéro overhead de drafting, zéro entraînement supplémentaire, zéro VRAM additionnelle. Speedup mesuré : 1,5-2,3× selon les modèles[^5]. **C'est la variante de choix pour les déploiements zero-training où l'on ne veut ni gérer un second poids ni reentraîner le target.**

À ces quatre familles s'ajoute un raffinement orthogonal : la **décode spéculative en ligne** (Liu et al., ICML 2024) qui adapte le draft à la distribution observée en production, via fine-tuning continu sur les rejets[^8]. C'est techniquement compatible avec les familles 1 et 3 (où le draft existe comme entité entraînable séparément). En pratique, peu de déploiements l'activent — la complexité opérationnelle (qui ré-entraîne ? sur quelles données ? avec quelle gouvernance ?) freine l'adoption hors des labs de recherche.

![Schéma 3 — Taxonomie des variantes de décode spéculative|1200](images/20260522-03-taxonomie-variantes-speculation.svg)

*Schéma 3 — Quatre familles, classées par stratégie de drafting. À gauche, le draft model externe (papier fondateur) ; au centre, Medusa et EAGLE qui collent au target ; à droite, Lookahead qui s'en passe complètement. EAGLE-3 domine la qualité, Lookahead domine le coût de déploiement.*

## 4. Le piège de l'acceptance rate

Tous les chiffres marketing des frameworks (« 2× », « 3× », « jusqu'à 5× ») masquent une dépendance forte au **domaine de la séquence générée**. Le speedup réel d'une décode spéculative est gouverné par la formule (Leviathan et al., 2022) :

```
speedup ≈ (1 + α + α² + … + α^K) × (T_target / (T_target + K · T_draft + T_verify))
```

où `α` est l'acceptance rate par token et K le nombre de tokens proposés. Pour α = 0,8 et K = 5, le facteur géométrique vaut ~3,4. Pour α = 0,4, il chute à ~1,6. Sous α = 0,3, le surcoût du drafting et de la vérification dépasse le gain — la spéculation devient nette perte.

**Trois facteurs gouvernent α en production** (voir Schéma 4).

**Le domaine.** Le code source affiche des acceptance rates très élevés (75-85 %) : vocabulaire restreint, structures syntaxiques répétitives, tokens prévisibles (`(`, `{`, `return`, indentation). Les résumés et la réponse Q&A factuelle se situent autour de 60-70 % : prévisibilité moyenne. La génération créative ouverte (fiction, poésie, brainstorming) tombe à 40-50 % : variabilité lexicale, températures élevées (0,8-1,2) qui aplatissent les distributions et désynchronisent draft et target. La traduction varie selon la paire de langues — élevée dans les langues européennes, plus basse pour les langues à morphologie riche (finnois, hongrois, turc).

**La température et la stratégie de sampling.** À température 0 (greedy), draft et target convergent vers les mêmes argmax si leurs top-1 coïncident — α monte mécaniquement. À température 0,7-1,0, la divergence stochastique des deux distributions fait chuter α de 10-15 points. Top-p et top-k filtering compliquent l'analyse : Together AI a documenté en 2024 des cas où top-p = 0,95 sur le draft mais 0,9 sur le target causait un effondrement silencieux de α (le draft proposait des tokens hors-top-p du target, systématiquement rejetés)[^11]. **Garder le sampling cohérent entre draft et target est une condition de production trop souvent oubliée.**

**Le drift de distribution.** Un draft entraîné sur les données pré-2024 et appelé en 2026 sur des prompts agentiques (chaînes JSON longues, calls de tools, code generation contemporaine) verra son α s'effondrer. C'est le scénario silencieux : le SLA latence se dégrade graduellement sans erreur, sans alerte ; seul un monitoring explicite de l'acceptance rate par requête permet de détecter le drift. ==En 2026, l'instrumentation de α est devenue un indicateur de premier rang dans les dashboards d'inference, au même titre que `p99 latency` ou `tokens/second`==[^9][^10].

EAGLE-3 et Medusa-2 incluent des mécanismes de **draft tree dynamique** qui adaptent la profondeur K et la largeur (nombre de branches dans le tree) à la confiance courante : sur une zone à haute prédictibilité (génération de code structuré), le tree pousse à K=8 et largeur 4 ; sur une zone créative, il retombe à K=3 et largeur 1 — voire désactive temporairement la spéculation. Cette adaptativité est ce qui distingue une intégration GA mature (vLLM 0.6+, TensorRT-LLM 0.9+) d'un prototype académique[^4][^9][^10].

![Schéma 4 — Acceptance rate selon le domaine|1200](images/20260522-04-acceptance-rate-domaine.svg)

*Schéma 4 — La spéculation paie plein pot sur le code, paie mais moins sur la prose informative, casse sur la génération créative à haute température. Sous α ≈ 0,3 (domaine drifté, hors-distribution), la spéculation devient perte nette par rapport à la décode standard.*

## 5. Spéculation × batching dynamique : où ça casse

Le second piège — celui que la littérature académique a longtemps esquivé et que la mise en production a forcé à regarder en face — est l'interaction entre spéculation et **batching dynamique**.

La décode est memory-bound à `batch_size = 1` : un seul utilisateur, le GPU lit les poids et le KV cache pour une seule séquence, les tensor cores sont sous-employés. C'est précisément le régime où la spéculation brille : le surcoût compute du forward de vérification (qui traite K+1 positions au lieu de 1) est absorbé par les cores inutilisés. Le speedup mesuré est maximal — proche du 4-5× annoncé par EAGLE-3 sur les benchmarks single-batch.

Mais en production multi-tenant, un serveur d'inference n'opère pas à batch 1. vLLM, SGLang et TensorRT-LLM agrègent dynamiquement les requêtes concurrentes en un batch unique pour amortir le coût de chargement des poids (le **continuous batching** introduit par Orca et popularisé par vLLM)[^6]. À batch 32 ou 64, le GPU repasse en régime compute-bound : les tensor cores sont saturés par le batch lui-même, le slack compute disparaît, et le surcoût de la vérification spéculative (K+1 positions × batch_size) devient un coût net.

Le point de bascule (voir Schéma 5) dépend du modèle, du GPU, et de la variante de spéculation choisie. Sur Llama-3.1-70B en FP16 sur H100, le point d'équilibre se situe autour de `batch_size ≈ 24-32` pour EAGLE-3 et `batch_size ≈ 16-20` pour Medusa-2 (qui paie plus cher en compute par tête)[^9][^10]. Au-delà de ce seuil, la spéculation **dégrade le throughput agrégé** : on traite moins de tokens/seconde total avec spéculation activée que sans.

D'où la sophistication récente des serveurs. vLLM 0.6 (juin 2025) introduit un **scheduler hybride** : il active la spéculation par requête, en fonction de la charge instantanée. Quand le batch courant est < 16, la spéculation est activée ; quand le batch dépasse un seuil (configurable, défaut 24), elle est désactivée pour les nouvelles requêtes du batch. TensorRT-LLM 0.9 (octobre 2025) va plus loin : il maintient deux schedulers parallèles, un avec spéculation et un sans, et migre dynamiquement les requêtes entre les deux selon une heuristique combinant `batch_size`, `α observé sur les 100 derniers tokens` et `SLA configuré`[^10]. SGLang propose une approche similaire via son `runtime_config.speculation_threshold`[^9].

L'implication pratique : ==**l'optimisation d'un déploiement spéculatif en production n'est plus le choix de la variante (EAGLE-3 vs Medusa-2), c'est le calibrage du seuil de désactivation par batch**==. Un seuil trop bas laisse du speedup sur la table aux heures creuses ; un seuil trop haut dégrade le throughput aux heures de pointe. La métrique à optimiser n'est pas le `tokens/second peak` mais le `p95 time-to-first-token` sous charge représentative, qui capture les deux régimes.

![Schéma 5 — Le point de bascule : speedup vs batch size|1200](images/20260522-05-point-bascule-batch.svg)

*Schéma 5 — Le speedup spéculatif est maximal à batch 1 (memory-bound), s'effondre au-delà d'un seuil (compute-bound), et peut devenir perte nette à très haut batch. Les serveurs modernes activent la spéculation conditionnellement selon la charge instantanée.*

## 6. Le marché des frameworks en 2026

Quatre frameworks dominent l'inference LLM open-source en 2026, et tous quatre intègrent au moins une variante spéculative en GA. Le choix entre eux dépend moins de la disponibilité d'une variante que de la **maturité de son intégration avec le scheduler et le batching dynamique** (voir Schéma 6).

**vLLM (UC Berkeley, sky-lab).** La référence de fait depuis la publication SOSP 2023[^6]. Architecture PagedAttention + continuous batching. Support spéculatif en GA : draft model externe (depuis 0.4), Medusa et MLP-speculator (depuis 0.5), EAGLE et EAGLE-3 (depuis 0.6, ajouté mi-2025), Lookahead (expérimental). Scheduler hybride avec activation conditionnelle par batch depuis 0.6. License Apache 2.0. **Choix par défaut pour qui veut un déploiement spéculatif éprouvé sur Llama / Qwen / Mistral**.

**SGLang (sgl-project, fondé par Lianmin Zheng, ex-LMSYS).** Né en 2024 comme alternative académique à vLLM, ciblant initialement les workloads multi-tour structurés (RadixAttention pour le prefix caching agressif). Support spéculatif aligné sur vLLM : draft externe, Medusa, EAGLE-1/2/3. RadixAttention + spéculation = particulièrement efficace pour les workloads agentiques où les prompts partagent des préfixes longs (system prompt, contexte conversationnel)[^9]. License Apache 2.0. **Choix montant pour workloads agentiques et multi-tour conversationnels.**

**TensorRT-LLM (NVIDIA).** L'implémentation propriétaire NVIDIA, optimisée pour H100 / H200 / B200. Support spéculatif : draft target, Medusa, ReDrafter (variante NVIDIA), EAGLE-2/3. Particularité : intégration avec le `inflight batching` propre à NVIDIA, et avec les optimisations bas niveau (FP8 attention, KV cache quantization, fused MoE kernels). Le scheduler à deux étages (avec/sans spéculation) est documenté[^10]. License : Apache 2.0 côté code, mais lié à l'écosystème CUDA. **Choix par défaut sur GPU NVIDIA récents quand on veut la performance compute pure ; moins flexible sur GPU non-NVIDIA.**

**DeepSpeed-MII (Microsoft).** L'inference fork de DeepSpeed, intégré aux pipelines Azure ML. Support spéculatif plus limité : draft externe et Medusa, pas d'EAGLE-3 en GA au S1 2026. Avantage : intégration native ZeRO-Inference (sharding agressif des poids sur multi-GPU). License Apache 2.0. **Choix de niche pour déploiements multi-GPU à très grande échelle ; moins de variantes spéculatives matures.**

À ces quatre frameworks s'ajoutent les solutions managées : **Together AI**, **Fireworks**, **Anyscale**, **Modal**, **Replicate** — qui exposent les mêmes variantes sous forme d'API, en ayant fait les calibrations de seuils pour leurs clients. Together AI a publié en 2024 un benchmark croisé public qui reste une référence — EAGLE atteignait alors 2,5× sur Llama-2 70B à charge moyenne, Medusa 2,1×, Lookahead 1,7×[^11]. Les chiffres ont depuis augmenté avec EAGLE-3 (3,0-4,5×) et les optimisations B200.

![Schéma 6 — Matrice frameworks × variantes spéculatives (2026)|1200](images/20260522-06-matrice-frameworks.svg)

*Schéma 6 — Disponibilité des variantes spéculatives et maturité de leur intégration scheduler dans les quatre frameworks open-source dominants. vLLM et SGLang couvrent le plus large ; TensorRT-LLM optimise le plus profond sur stack NVIDIA ; DeepSpeed-MII garde un retard de phase sur EAGLE-3.*

## 7. Horizon 2026-2028

Trois directions de recherche structurent l'avenir court de la décode spéculative.

**RL-guided drafting.** Plutôt qu'entraîner le draft par cross-entropy classique sur des corpus généraux, l'approche RL optimise directement l'acceptance rate observé contre le target sur une distribution représentative. Premiers résultats publics fin 2025 : +5 à +8 points d'α sur des draft models de même taille, pour un coût d'entraînement marginal (quelques milliers d'heures GPU). EAGLE-3 utilise déjà partiellement cette stratégie via son loss sequence-level. Attendu en GA dans vLLM et SGLang fin 2026.

**Multi-draft mixture.** Au lieu d'un seul draft, plusieurs drafts spécialisés (un pour code, un pour prose, un pour JSON) tournent en parallèle et le serveur route chaque requête vers le bon draft selon une classification du prompt. Le surcoût VRAM est multiplié par le nombre de drafts (3-5× le poids d'un draft standard), mais l'acceptance rate moyen pondéré peut atteindre 75-80 % en multi-tenant — bien au-dessus du 50-60 % d'un draft généraliste sur la même distribution mixte. Première implémentation publique : Together AI MoSpec, papier attendu été 2026.

**Ensemble verification.** Symétrique de l'idée précédente : au lieu de proposer plusieurs drafts, on vérifie une seule proposition avec plusieurs *targets* (typiquement deux instances quantifiées différemment). Si les deux targets s'accordent, on accepte avec haute confiance ; sinon, on remonte au target full-precision. Permet de combiner la latence d'un modèle 4-bit avec la qualité d'un modèle FP16 sans dégradation mesurable. Encore en phase recherche.

À horizon plus lointain (2027-2028), les pistes intéressantes sont la **spéculation hiérarchique** (cascade draft 1B → draft 7B → target 70B, chaque étage filtrant pour le suivant), la **co-entraînement draft/target** (le target est explicitement régularisé pour produire des distributions faciles à draft), et l'**intégration MoE-spéculation** (chaque expert MoE a son propre draft, exploitant la routing sparsity). Ces directions restent expérimentales : ==aucune n'a encore franchi le seuil de maturité pour un déploiement production en 2026==.

## 8. Pour aller plus loin

Pour le décor économique de l'inference LLM dans lequel s'inscrit la décode spéculative (LLMflation, pile logicielle, désagrégation prefill/decode, MoE, mix matériel), voir [*Économie de l'inference LLM*](../economie-inference/). Pour l'orchestration multi-modèle (planner / executor / verifier) qui consomme cette inference accélérée, voir [*Harness agentiques*](../harness-agentique/) et [*La fabrique d'un agent*](../fabrique-agent/) si publié.

## Sources

[^1]: Yaniv Leviathan, Matan Kalman, Yossi Matias (Google Research), *Fast Inference from Transformers via Speculative Decoding*, arXiv 2211.17192, ICML 2023. URL : https://arxiv.org/abs/2211.17192. Consulté le 2026-05-22.

[^2]: Charlie Chen, Sebastian Borgeaud, Geoffrey Irving, Jean-Baptiste Lespiau, Laurent Sifre, John Jumper (DeepMind), *Accelerating Large Language Model Decoding with Speculative Sampling*, arXiv 2302.01318, 2023. URL : https://arxiv.org/abs/2302.01318. Consulté le 2026-05-22.

[^3]: Tianle Cai, Yuhong Li, Zhengyang Geng, Hongwu Peng, Jason D. Lee, Deming Chen, Tri Dao, *Medusa: Simple LLM Inference Acceleration Framework with Multiple Decoding Heads*, arXiv 2401.10774, ICML 2024. URL : https://arxiv.org/abs/2401.10774. Consulté le 2026-05-22.

[^4]: Yuhui Li, Fangyun Wei, Chao Zhang, Hongyang Zhang, *EAGLE: Speculative Sampling Requires Rethinking Feature Uncertainty*, arXiv 2401.15077, ICML 2024 ; suivi par EAGLE-2 (arXiv 2406.16858) et EAGLE-3 (arXiv 2503.01840). URL : https://arxiv.org/abs/2401.15077. Consulté le 2026-05-22.

[^5]: Yichao Fu, Peter Bailis, Ion Stoica, Hao Zhang (LMSYS, UCSD), *Break the Sequential Dependency of LLM Inference Using Lookahead Decoding*, arXiv 2402.02057, 2024 ; blog LMSYS associé. URL : https://arxiv.org/abs/2402.02057. Consulté le 2026-05-22.

[^6]: Woosuk Kwon, Zhuohan Li, Siyuan Zhuang, Ying Sheng, Lianmin Zheng, Cody Hao Yu, Joseph Gonzalez, Hao Zhang, Ion Stoica (UC Berkeley), *Efficient Memory Management for Large Language Model Serving with PagedAttention*, SOSP 2023 ; documentation vLLM speculative decoding. URL : https://arxiv.org/abs/2309.06180. Consulté le 2026-05-22.

[^7]: Heming Xia, Zhe Yang, Qingxiu Dong, Peiyi Wang, Yongqi Li, Tao Ge, Tianyu Liu, Wenjie Li, Zhifang Sui, *Unlocking Efficiency in Large Language Model Inference: A Comprehensive Survey of Speculative Decoding*, arXiv 2401.07851, ACL 2024 Findings. URL : https://arxiv.org/abs/2401.07851. Consulté le 2026-05-22.

[^8]: Xiaoxuan Liu, Lanxiang Hu, Peter Bailis, Alvin Cheung, Zhijie Deng, Ion Stoica, Hao Zhang, *Online Speculative Decoding*, ICML 2024 / arXiv 2310.07177. URL : https://arxiv.org/abs/2310.07177. Consulté le 2026-05-22.

[^9]: SGLang Team (sgl-project, Lianmin Zheng et al.), SGLang documentation et blog d'ingénierie, 2024-2026. URL : https://github.com/sgl-project/sglang. Consulté le 2026-05-22.

[^10]: NVIDIA, *TensorRT-LLM Speculative Decoding documentation* (draft target, Medusa, ReDrafter, EAGLE), versions 0.8 à 0.10, 2024-2026. URL : https://nvidia.github.io/TensorRT-LLM/advanced/speculative-decoding.html. Consulté le 2026-05-22.

[^11]: Together AI Engineering Blog, *Speculative decoding: better, faster, cheaper LLM inference*, 2024 ; benchmarks croisés EAGLE / Medusa / Lookahead sur Llama-2 7B et 70B. URL : https://www.together.ai/blog/specdec. Consulté le 2026-05-22.

[^12]: Zhuoming Chen, Avner May, Ruslan Svirschevski, Yuhsun Huang, Max Ryabinin, Zhihao Jia, Beidi Chen, *Hydra: Sequentially-Dependent Draft Heads for Medusa Decoding*, arXiv 2402.05109, COLM 2024. URL : https://arxiv.org/abs/2402.05109. Consulté le 2026-05-22.
