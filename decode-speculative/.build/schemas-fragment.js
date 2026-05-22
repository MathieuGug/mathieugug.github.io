{
    "schema-01": {
      "seq-loop": {
        eyebrow: "Décode autoregressive",
        title: "Un token, un forward target",
        body: "<p>Chaque token N dépend du token N−1 : la boucle est <strong>strictement séquentielle</strong>. Sur Llama 3.1 70B (H100, FP16, batch 1), un forward target prend ~40 ms. Pour 6 tokens, ~240 ms.</p><p>Le GPU est <em>memory-bound</em> : il passe l'essentiel de son temps à attendre la HBM pour lire les 140 Go de poids + le KV cache. Les tensor cores sont sous-utilisés (5-15 % du peak FLOPS). C'est ce slack compute qui rend la spéculation possible<a class='cite' href='#source-6' data-cite='6'>6</a>.</p>"
      },
      "spec-draft": {
        eyebrow: "Étape 1 · Drafting",
        title: "K tokens proposés vite",
        body: "<p>Un modèle léger (10-100× plus petit que le target — typiquement Llama-3.2-1B pour drafter Llama-3.1-70B) génère K tokens autoregressifs. K varie typiquement entre 4 et 8.</p><p>Le coût est faible : le draft est petit, sa décode est rapide même séquentielle (~1-2 ms par token). Total pour K=5 : ~8 ms.</p>"
      },
      "spec-verify": {
        eyebrow: "Étape 2 · Verification",
        title: "Un seul forward target",
        body: "<p>Le target reçoit le préfixe + les K tokens proposés en <strong>un seul forward parallèle</strong>. Cela produit <code>p_target[i]</code> aux positions 1 à K+1.</p><p>Ce forward coûte légèrement plus cher qu'un forward normal (K+1 positions au lieu de 1), mais reste compute-bound : ~45 ms pour K=5, contre 40 ms pour 1 position.</p><p>C'est ici qu'intervient le <em>tree attention mask</em> (Schéma 2), si l'on propose un arbre plutôt qu'une séquence linéaire.</p>"
      },
      "spec-accept": {
        eyebrow: "Étape 3 · Accept / Reject",
        title: "La règle de Leviathan",
        body: "<p>Pour chaque position i : <code>accept_with_prob(min(1, p_target[i] / p_draft[i]))</code>.</p><p>Si tous les K tokens sont acceptés, on a généré <strong>K+1 tokens en un forward target</strong> (le +1 vient de la position bonus K+1, échantillonnée fraîche depuis p_target).</p><p>Si le token i est rejeté, on tire un remplaçant depuis <code>max(0, p_target[i] − p_draft[i])</code> normalisé, on tronque ce qui suit, on relance le drafting. <strong>La distribution de sortie est strictement identique à la décode standard</strong><a class='cite' href='#source-1' data-cite='1'>1</a>.</p>"
      }
    },
    "schema-02": {
      "tree-root": {
        eyebrow: "Tree attention · racine",
        title: "Le dernier token confirmé",
        body: "<p>Le nœud racine est le dernier token commité de la séquence. Toutes les branches candidates partent de là.</p><p>Sa <em>position attention</em> est unique : tous les autres nœuds (candidats) le voient comme contexte, mais lui ne voit qu'eux par les Q·Kᵀ — c'est le pivot du masque.</p>"
      },
      "tree-branch": {
        eyebrow: "Tree attention · branches",
        title: "Chaque branche = une hypothèse",
        body: "<p>Le draft propose plusieurs continuations parallèles. Ici, 2 branches au niveau 1 (A vs B), 2 à chaque niveau, profondeur 3 = 7 nœuds candidats.</p><p>EAGLE-2 introduit le <strong>dynamic draft tree</strong> : la largeur et la profondeur sont calibrées par le draft à chaque étape selon la confiance courante. Sur un terrain prévisible (code structuré), l'arbre pousse à profondeur 8 ; sur du créatif, il se replie à profondeur 2-3<a class='cite' href='#source-4' data-cite='4'>4</a>.</p>"
      },
      "verify-mask": {
        eyebrow: "Masque d'attention",
        title: "Triangulaire — mais arborescent",
        body: "<p>Au lieu du masque triangulaire causal classique, on construit un masque <em>arborescent</em> : chaque nœud voit ses ancêtres dans l'arbre, jamais les nœuds de branches concurrentes.</p><p>Les cellules orange dans la grille sont les attendances autorisées ; les cellules sombres sont masquées (−∞ ajouté avant softmax). Le résultat : <strong>une seule matrice Q·Kᵀ, plusieurs hypothèses vérifiées en parallèle, zéro contamination entre branches</strong>.</p>"
      },
      "commit-path": {
        eyebrow: "Sortie · chemin retenu",
        title: "Le plus long préfixe accepté",
        body: "<p>Après le forward target, on parcourt l'arbre depuis la racine et on retient le plus long préfixe dont tous les tokens passent le test de Leviathan.</p><p>Dans l'exemple : <code>racine → A1 → A2a → A3</code> = 3 tokens accumulés. Les 4 autres branches sont jetées (leur coût n'a pas été nul, mais il est amorti).</p><p>Le serveur écrit ces 3 tokens dans le KV cache, met à jour le pointeur de séquence, et relance un nouveau cycle de drafting.</p>"
      }
    },
    "schema-03": {
      "family-draft": {
        eyebrow: "Famille 1 · 2022",
        title: "Draft model externe",
        body: "<p>L'approche fondatrice (Leviathan, Chen). Un petit modèle de la même famille pré-entraîné (Llama-3.2-1B pour Llama-3.1-70B) propose K tokens.</p><p><strong>✓ Zéro modif du target.</strong> Sampling stochastique propre, draft réutilisable.</p><p><strong>✗ Second poids à charger.</strong> +VRAM, latence de chargement, matching de distribution requis (sinon α s'effondre).</p><p>Performance : ~2,2× sur Llama-2 70B<a class='cite' href='#source-1' data-cite='1'>1</a><a class='cite' href='#source-2' data-cite='2'>2</a>.</p>"
      },
      "family-medusa": {
        eyebrow: "Famille 2 · 2024",
        title: "Têtes additionnelles (Medusa, Hydra)",
        body: "<p>Cai et al. ajoutent K têtes de décode sur le target lui-même. Chaque tête prédit le token i+k depuis la même couche cachée<a class='cite' href='#source-3' data-cite='3'>3</a>.</p><p><strong>✓ Pas de second poids à charger.</strong> Têtes attachées au target.</p><p><strong>✗ Têtes non-autoregressives.</strong> Acceptance chute pour les têtes lointaines. <em>Hydra</em> corrige partiellement en réintroduisant une dépendance séquentielle entre têtes<a class='cite' href='#source-12' data-cite='12'>12</a>.</p><p>Performance : 2,8× sur Vicuna 7B (Medusa-2).</p>"
      },
      "family-eagle": {
        eyebrow: "Famille 3 · 2024–2025",
        title: "Feature-level (EAGLE)",
        body: "<p>Yuhui Li et al. prédisent la <em>feature</em> (embedding pénultième), pas le token. La feature étant plus stable, l'acceptance monte de 30-40 % vs Medusa<a class='cite' href='#source-4' data-cite='4'>4</a>.</p><p><strong>EAGLE-2</strong> : dynamic draft tree adaptatif. <strong>EAGLE-3</strong> : loss sequence-level, ~3,0-4,5× sur Llama-3 70B.</p><p><strong>État de l'art 2026.</strong> Défaut sur Llama 3.x et Qwen 2.5 dans vLLM et SGLang.</p>"
      },
      "family-lookahead": {
        eyebrow: "Famille 4 · 2024",
        title: "Jacobi parallel (Lookahead)",
        body: "<p>Fu et al. (LMSYS, UCSD) : <strong>pas de draft du tout</strong>. Un solver Jacobi résout en parallèle un système d'équations fixe-points sur les futurs tokens<a class='cite' href='#source-5' data-cite='5'>5</a>.</p><p><strong>✓ Zero VRAM additionnelle, zero entraînement.</strong> Idéal en zero-training deployment.</p><p><strong>✗ Acceptance plus basse</strong> (35-55 %). Performance : 1,5-2,3× selon les modèles.</p>"
      }
    },
    "schema-04": {
      "domain-code": {
        eyebrow: "Haute acceptance",
        title: "Code source — α ≈ 80 %",
        body: "<p>Vocabulaire restreint, structures syntaxiques répétitives, tokens prévisibles (<code>(</code>, <code>{</code>, <code>return</code>, indentation). Le draft devine juste très souvent.</p><p>Speedup typique : <strong>~3,8×</strong> avec EAGLE-3 K=6, T° 0,2. C'est le domaine sur lequel les benchmarks marketing sont calibrés.</p>"
      },
      "domain-summary": {
        eyebrow: "Acceptance moyenne",
        title: "Résumé / Q&A — α ≈ 65 %",
        body: "<p>Prévisibilité moyenne. Le draft tient sur les structures fixes (introductions, transitions, conclusions) et décroche sur les contenus spécifiques.</p><p>Speedup typique : <strong>~2,8×</strong>. C'est le régime sur lequel la plupart des dashboards d'usage agentique tournent.</p>"
      },
      "domain-creative": {
        eyebrow: "Acceptance basse",
        title: "Génération créative — α ≈ 45 %",
        body: "<p>Variabilité lexicale, T° élevée (0,8-1,2) qui aplatit les distributions et désynchronise draft et target.</p><p>Speedup typique : <strong>~1,5×</strong>. Le gain reste positif mais marginal — les frameworks peuvent décider de désactiver la spéculation pour ce profil de requête.</p>"
      },
      "domain-cold": {
        eyebrow: "Perte nette",
        title: "Drift domaine — α ≈ 28 %",
        body: "<p>Un draft entraîné pré-2024 sur des prompts agentiques 2026 (JSON longs, tool calls, code contemporain) perd 15-25 points d'α en quelques mois.</p><p>Sous α ≈ 30 %, le surcoût du drafting et de la vérification dépasse le gain. <strong>Speedup &lt; 1× — la spéculation devient perte nette.</strong></p><p>Le scénario silencieux : pas d'erreur, pas d'alerte — juste un SLA qui se dégrade. D'où l'importance de monitorer α par requête<a class='cite' href='#source-7' data-cite='7'>7</a>.</p>"
      }
    },
    "schema-05": {
      "batch-1": {
        eyebrow: "Zone gain · memory-bound",
        title: "À batch 1-16 : la spéculation paie",
        body: "<p>À petit batch, le GPU lit les poids et le KV cache pour quelques séquences seulement — les tensor cores sont sous-utilisés. Le surcoût compute du forward de vérification est <strong>absorbé par le slack compute</strong>.</p><p>Speedup mesuré : 3-4× pour EAGLE-3 sur Llama 3.1 70B (H100, FP16, batch 1-8).</p>"
      },
      "batch-cross": {
        eyebrow: "Zone d'indifférence",
        title: "Point d'équilibre ≈ batch 24",
        body: "<p>Le seuil exact dépend du modèle, du GPU, de la variante. Sur Llama-3.1-70B H100 :</p><ul><li><strong>EAGLE-3</strong> : équilibre vers batch 24-32</li><li><strong>Medusa-2</strong> : équilibre vers batch 16-20 (coût compute par tête plus élevé)</li></ul><p>Dans cette zone, spéculer ou non donne le même throughput agrégé.</p>"
      },
      "batch-loss": {
        eyebrow: "Zone perte · compute-bound",
        title: "Au-delà : ça coûte plus",
        body: "<p>À batch 32+, les tensor cores sont saturés par le batch lui-même. Le surcoût de la vérification spéculative (K+1 positions × batch_size) devient un coût net.</p><p><strong>0,9× à batch 64 — la spéculation dégrade le throughput agrégé.</strong> C'est pour cela que les schedulers modernes la désactivent dynamiquement passé un seuil<a class='cite' href='#source-9' data-cite='9'>9</a><a class='cite' href='#source-10' data-cite='10'>10</a>.</p>"
      },
      "policy-adapt": {
        eyebrow: "Politique d'activation",
        title: "Le seuil à calibrer",
        body: "<p>vLLM 0.6+ : scheduler hybride qui active la spéculation par requête selon la charge instantanée (seuil défaut : 24).</p><p>TensorRT-LLM 0.9+ : <strong>deux schedulers parallèles</strong> (avec / sans spéculation), migration des requêtes selon <code>batch_size</code> + <code>α observé sur les 100 derniers tokens</code> + <code>SLA configuré</code>.</p><p>SGLang : <code>runtime_config.speculation_threshold</code>.</p><p>La métrique à optimiser : <strong><code>p95 time-to-first-token</code> sous charge représentative</strong>, pas le <code>peak tokens/second</code>.</p>"
      }
    },
    "schema-06": {
      "fw-vllm": {
        eyebrow: "UC Berkeley · Apache 2.0",
        title: "vLLM",
        body: "<p>La référence de fait depuis SOSP 2023<a class='cite' href='#source-6' data-cite='6'>6</a>. PagedAttention + continuous batching.</p><p><strong>Support spéculatif :</strong> draft externe (0.4+), Medusa / MLP-speculator (0.5+), EAGLE / EAGLE-3 (0.6+, mi-2025), Lookahead (preview).</p><p><strong>Scheduler hybride</strong> avec activation conditionnelle par batch depuis 0.6.</p><p>Choix par défaut pour Llama / Qwen / Mistral. Communauté la plus active sur les variantes.</p>"
      },
      "fw-sglang": {
        eyebrow: "sgl-project · Apache 2.0",
        title: "SGLang",
        body: "<p>Fondé par Lianmin Zheng (ex-LMSYS) en 2024. RadixAttention pour le prefix caching agressif.</p><p><strong>Support spéculatif</strong> aligné vLLM : draft externe, Medusa, EAGLE-1/2/3. Excellent sur les <em>workloads multi-tour structurés</em>.</p><p>RadixAttention × spéculation = combo gagnant pour les workloads agentiques (system prompt + contexte conversationnel partagés)<a class='cite' href='#source-9' data-cite='9'>9</a>.</p>"
      },
      "fw-trtllm": {
        eyebrow: "NVIDIA · Apache 2.0 / CUDA",
        title: "TensorRT-LLM",
        body: "<p>L'implémentation NVIDIA, optimisée H100/H200/B200. FP8 attention, KV cache quantization, fused MoE kernels.</p><p><strong>Support spéculatif :</strong> draft target, Medusa, ReDrafter (variante maison), EAGLE-2/3 (0.10+, optimisé B200).</p><p><strong>Scheduler à deux étages</strong> : avec/sans spéculation, migration dynamique des requêtes selon <code>batch_size</code> + <code>α observé</code> + <code>SLA</code><a class='cite' href='#source-10' data-cite='10'>10</a>.</p><p>Choix par défaut sur GPU NVIDIA récents quand on veut la performance compute pure.</p>"
      },
      "fw-deepspeed": {
        eyebrow: "Microsoft · Apache 2.0",
        title: "DeepSpeed-MII",
        body: "<p>Inference fork de DeepSpeed, intégré aux pipelines Azure ML.</p><p><strong>Support spéculatif plus limité :</strong> draft externe (GA), Medusa (GA basique), EAGLE-2 en preview communautaire, <strong>pas d'EAGLE-3 en GA au S1 2026</strong>.</p><p>Avantage : intégration native ZeRO-Inference (sharding agressif des poids multi-GPU).</p><p>Choix de niche pour déploiements multi-GPU à très grande échelle. Garde un retard de phase sur EAGLE-3.</p>"
      }
    }
  }
