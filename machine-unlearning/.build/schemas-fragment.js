{
  "schema-01": {
    title: "Carte régulatoire 2024-2028",
    regions: {
      "edpb-2024": {
        title: "EDPB Opinion 28/2024 — décembre 2024",
        body: "Le Comité européen rappelle que les modèles d'IA entraînés sur des données personnelles tombent fréquemment sous le RGPD du fait de leur <strong>capacité de mémorisation</strong>. Un modèle qui peut restituer verbatim un nom ou une adresse vue en entraînement contient bien, du point de vue régulatoire, ces données. Conséquence directe : le droit d'effacement art. 17 s'applique aux poids quand la mémorisation est démontrable. <em>C'est la bascule doctrinale qui débloque toute la chaîne 2025-2026.</em><sup><a href='#source-11' class='cite' data-src='11'>11</a></sup>"
      },
      "cnil-2025": {
        title: "CNIL — recommandations juin 2025",
        body: "Deux recommandations parallèles. La première : <strong>l'intérêt légitime</strong> est reconnu comme base juridique probable pour l'entraînement IA, sous conditions de mesures préventives (critères de collecte, exclusion catégories sensibles, suppression données non pertinentes). La seconde : <mark>l'effacement total dans les poids n'est pas toujours techniquement faisable</mark>, mais des mesures d'atténuation sont attendues — suppression des données brutes, filtrage des sorties, documentation tracée. C'est la première formalisation institutionnelle de ce qu'un déployeur doit produire.<sup><a href='#source-10' class='cite' data-src='10'>10</a></sup>"
      },
      "aiact-2026": {
        title: "AI Act art. 10 — application 2 août 2026",
        body: "Pour les systèmes haut-risque, trois exigences structurantes : datasets <em>relevant, representative, error-free, complete</em> ; lignage documenté (origine, transformations, agrégations) ; biais identifiés, mesurés, mitigés. <strong>Sanctions : 15 M€ ou 3 % CA mondial</strong> pour les violations de gouvernance des données, jusqu'à 35 M€ / 6 % en cas de non-conformité systémique. Combiné au RGPD, cela impose une forme d'oubli traçable.<sup><a href='#source-12' class='cite' data-src='12'>12</a></sup>"
      },
      "horizon-2028": {
        title: "Horizon contrôles 2027-2028",
        body: "Les organismes notifiés (art. 43 AI Act) commencent leurs contrôles sur les systèmes haut-risque. En parallèle, le travail de standardisation CEN-CENELEC JTC 21 pourrait produire une norme harmonisée sur l'unlearning — créant une présomption de conformité pour les méthodes validées. Émergence probable d'un marché de la certification d'oubli."
      }
    }
  },
  "schema-02": {
    title: "Trois couches d'oubli",
    regions: {
      "layer-rag": {
        title: "Couche 1 — RAG / retrieval",
        body: "<strong>Surface.</strong> La donnée vit dans un index vectoriel (FAISS, Pinecone, pgvector). Effacement = suppression d'un embedding + son texte source. Immédiat, peu coûteux, exact. <em>Ne couvre que les données apportées à chaque requête</em>. <mark>Pas suffisant pour les données mémorisées par le modèle base</mark> — un déployeur qui se limite à cette couche ne couvre pas l'article 17 quand la mémorisation est démontrée."
      },
      "layer-finetune": {
        title: "Couche 2 — Fine-tune / adapter",
        body: "<strong>Intermédiaire.</strong> La donnée vit dans les poids d'un LoRA ou QLoRA adapter monté sur un modèle base. Effacement : ré-entraîner un adapter sans la donnée, ou influence functions pour annuler son effet. Coût modéré, garanties partielles. Traçabilité possible si la chaîne d'entraînement est versionnée — c'est souvent ici qu'on contrôle les vraies données <em>propriétaires</em> introduites par le déployeur."
      },
      "layer-weights": {
        title: "Couche 3 — Poids du modèle base",
        body: "<strong>Le problème régulatoire.</strong> La donnée a contribué au gradient descent des milliards de paramètres pré-entraînés. Effacement : retraining complet (coût prohibitif, plusieurs millions €) ou unlearning approximatif in-place. <mark>Seule couche qui couvre la mémorisation des poids — donc l'article 17 quand celle-ci est démontrée</mark>. C'est sur cette couche que portent les méthodes des sections 3-6 du dossier."
      }
    }
  },
  "schema-03": {
    title: "Taxonomie 4 familles",
    regions: {
      "family-sisa": {
        title: "Famille A — SISA (exact retraining)",
        body: "<strong>Bourtoule et al., IEEE S&amp;P 2021.</strong> Le modèle est entraîné sur k shards disjoints ; si une donnée doit être supprimée, seul le shard concerné est ré-entraîné, puis l'agrégation est recalculée. <mark>Pour AlexNet et VGG-16, réduction du temps de retraining de 62 % et 58 %</mark>, perte d'exactitude ≈ 0,4 %. <em>Atout</em> : garantie mathématique stricte. <em>Limite</em> : qualité s'effondre au-delà k=8-16, inapplicable aux LLMs 70B+.<sup><a href='#source-1' class='cite' data-src='1'>1</a></sup>"
      },
      "family-npo": {
        title: "Famille B — NPO (gradient-based)",
        body: "<strong>Zhang et al. 2024.</strong> Le forget set est traité comme des exemples négatifs dans un cadre DPO sans positifs ; la loss est bornée par construction, ce qui empêche le catastrophic collapse du Gradient Ascent pur. <mark>Leader des leaderboards TOFU et MUSE en 2025</mark>, baseline implicite de toute nouvelle publication. Simplicité d'implémentation : quelques centaines de lignes au-dessus d'un loop DPO standard.<sup><a href='#source-4' class='cite' data-src='4'>4</a></sup>"
      },
      "family-rmu": {
        title: "Famille C — RMU (representation engineering)",
        body: "<strong>Li et al., WMDP 2024.</strong> À une couche intermédiaire choisie, on entraîne le modèle à mapper les activations des prompts du forget set vers un vecteur aléatoire fixe, tout en préservant les activations des autres prompts. <em>Surchirurgical</em> — préserve l'utilité générale mesurée par MMLU. <em>Limite</em> : choix de la couche cible empirique. Variante 2025 : <em>Adaptive RMU</em>, 4ᵉ place SemEval-2025 task 4.<sup><a href='#source-3' class='cite' data-src='3'>3</a></sup>"
      },
      "family-influence": {
        title: "Famille D — Influence functions + LoRA",
        body: "<strong>Koh &amp; Liang 2017, réactivés 2024-2025.</strong> Hessian inverse approché avec damping, contribution d'un sample estimée puis annulée par mise à jour des poids. Combinée à des adapters LoRA pour limiter le périmètre. <mark>Jusqu'à 250× plus rapide que retraining</mark> sur systèmes de recommandation. Famille la plus modulaire et la plus prometteuse ratio coût/qualité — mais la moins mature en production. Publication 2026 : <em>WIN-U</em> (Newton-Woodbury retain-free)."
      }
    }
  },
  "schema-04": {
    title: "Matrice benchmarks × garanties",
    regions: {
      "bench-tofu": {
        title: "TOFU — Maini et al. 2024",
        body: "<strong>200 auteurs fictifs, 4 000 questions générées</strong> sur leurs biographies. Le modèle est fine-tuné sur ces données puis on lui demande d'en oublier une fraction. Métriques : <em>forget quality</em> (ROUGE, probabilités) + <em>model utility</em> (préservation capacités générales). <em>C'est le bench le plus joué de 2024-2026</em>, mais il mesure la mémorisation verbatim — un score TOFU élevé n'implique pas la robustesse aux prompts adversaires (cf. REBEL section 5).<sup><a href='#source-2' class='cite' data-src='2'>2</a></sup>"
      },
      "bench-wmdp": {
        title: "WMDP — Li et al. 2024",
        body: "<strong>4 157 QCM sur armes</strong> (chimiques, biologiques, cyber). Proxy de malveillance : le modèle doit oublier le savoir dangereux sans perdre ses capacités générales (MMLU). Sert de banc d'essai pour les méthodes de safety unlearning — RMU a été introduit dans ce papier. <em>Limite</em> : sur un QCM, on mesure surtout la capacité d'inférence sur des distracteurs, pas la mémorisation verbatim.<sup><a href='#source-3' class='cite' data-src='3'>3</a></sup>"
      },
      "bench-muse": {
        title: "MUSE — Shi et al. 2024",
        body: "<strong>Six métriques</strong> conçues pour mesurer l'écart résiduel entre modèle unlearned et modèle ré-entraîné from scratch : mémorisation verbatim, paraphrase, privacy leakage, utilité, robustesse, équité. <em>Approche la plus complète</em> côté académique, mais reste centrée sur l'écart au retraining — pas sur la résistance aux attaques externes."
      },
      "bench-openunlearn": {
        title: "OpenUnlearning — méta-framework 2025",
        body: "<strong>13 algorithmes × 16 évaluations × 3 benchmarks (TOFU, WMDP, MUSE)</strong> + couche méta-évaluation qui mesure la fiabilité des métriques elles-mêmes. <mark>État de l'art 2025 pour comparer rigoureusement deux méthodes</mark>. Reste à intégrer SMIA et les probes de relearning comme métriques de premier rang.<sup><a href='#source-7' class='cite' data-src='7'>7</a></sup>"
      }
    }
  },
  "schema-05": {
    title: "Matrice attaques × familles",
    regions: {
      "attack-rebel": {
        title: "REBEL — Łucki et al., ICLR 2025",
        body: "<strong>Prompts évolutionnaires adversariaux</strong> qui sondent le modèle après unlearning. Sur des modèles ayant publié des scores forget quality &gt; 0,9 : <mark>jusqu'à 60 % du savoir TOFU et 93 % du savoir WMDP sont récupérés</mark>. Même l'exact unlearning par retraining est vulnérable via des « difference attacks » comparant les sorties pré- et post-suppression. <em>C'est la publication qui a fait basculer le discours de l'optimisme méthodologique vers la prudence régulatoire.</em><sup><a href='#source-5' class='cite' data-src='5'>5</a></sup>"
      },
      "attack-relearn": {
        title: "Benign relearning — Hu et al., CMU 2025",
        body: "<strong>Un fine-tune sur quelques centaines d'exemples loosely related</strong> suffit à réveiller le savoir prétendument oublié. Exemples publiés : un modèle ayant oublié les bio-armes WMDP, ré-entraîné sur des <em>articles médicaux publics</em>, restitue le savoir dangereux. Un modèle ayant oublié <em>Harry Potter</em>, ré-exposé à un résumé Wikipedia, restitue verbatim. Conséquence pratique : <mark>NPO et RMU sont particulièrement vulnérables</mark> (jusqu'à 85 % de récupération).<sup><a href='#source-6' class='cite' data-src='6'>6</a></sup>"
      },
      "attack-smia": {
        title: "SMIA — Statistical MIA pour audit",
        body: "<strong>Pas une attaque, mais un outil d'audit.</strong> Test statistique training-free qui compare les distributions de samples membres et non-membres post-unlearning. <mark>Fournit un forgetting rate avec intervalle de confiance — première métrique avec garantie quantifiable</mark>, défendable devant un régulateur. Détecte la trace résiduelle de la donnée dans la plupart des familles, y compris SISA dans certaines conditions.<sup><a href='#source-9' class='cite' data-src='9'>9</a></sup>"
      },
      "attack-apollo": {
        title: "Apollo — MIA label-only post-unlearning",
        body: "<strong>arXiv 2506.09923, 2025.</strong> Une MIA <em>label-only</em> (sans accès aux logits) spécifiquement conçue pour les modèles ayant subi un unlearning. Démontre qu'on peut détecter qu'une donnée a été <em>présente</em> dans le training set d'origine, même après un effacement déclaré. <em>Impact régulatoire</em> : un déployeur ne peut pas argumenter que l'oubli est total face à une autorité qui dispose d'Apollo."
      }
    }
  },
  "schema-06": {
    title: "Pipeline d'audit d'unlearning",
    regions: {
      "gate-forget": {
        title: "Étape 1 — Identification du forget set",
        body: "<strong>Quelles données, quels critères de sélection, quel scope.</strong> Manifest data versionné (Git LFS ou DVC), hashes SHA-256 par fichier, registre des demandes d'effacement entrantes. <em>C'est ici qu'on tranche la couche</em> (RAG, fine-tune, poids) selon la criticité — un effacement RAG ne nécessite pas le reste du pipeline. <em>Livrable</em> : manifest signé, traçable, daté."
      },
      "gate-unlearn": {
        title: "Étape 2 — Application de l'unlearning",
        body: "<strong>Choix de la famille</strong> (NPO, RMU, SISA-LoRA, influence+adapter) calibrée sur le scope identifié. Hyperparamètres documentés, seed fixée, environnement reproductible (Docker image hashée). Le modèle unlearned θ' est produit avec son delta hash vs θ initial. <em>Livrable</em> : θ' + journal d'exécution + delta cryptographique."
      },
      "gate-audit": {
        title: "Étape 3 — Gate SMIA · audit statistique",
        body: "<strong>Test statistique training-free</strong> qui compare les distributions de samples membres et non-membres post-unlearning. Fournit un forgetting rate avec intervalle de confiance défini. <mark>Premier gate quantifiable opposable au régulateur</mark> — au-dessus du seuil, on passe à l'étape 4 ; en-dessous, on retourne à l'étape 2 calibrer plus agressivement.<sup><a href='#source-9' class='cite' data-src='9'>9</a></sup>"
      },
      "gate-cert": {
        title: "Étape 4 — Gate relearn probe",
        body: "<strong>Fine-tune adversaire sur données <em>loosely related</em></strong> (méthodologie Hu et al. CMU 2025). On mesure le % de récupération sous probe — si la donnée revient à &lt; 30 %, le modèle est robuste ; au-dessus, retour étape 2 ou bascule étape 5 (distillation). <em>C'est le gate qui sépare un unlearning superficiel d'un oubli résilient</em>. Pas encore standardisé dans les benchmarks ; risque de devenir attendu par les autorités d'ici 2027.<sup><a href='#source-6' class='cite' data-src='6'>6</a></sup>"
      }
    }
  }
}
