{
  "schema-01": {
    "boucle-fermee": {
      eyebrow: "Régime 1 · à éviter",
      title: "Boucle fermée pure — le scénario Shumailov",
      body: "<p>Dans ce régime, le corpus d'entraînement de chaque génération est constitué <strong>exclusivement</strong> des sorties du modèle précédent. La donnée humaine d'origine disparaît du mix dès la première itération. C'est le protocole de Shumailov <em>et al.</em> 2024<a class='cite' href='#source-1' data-cite='1'>1</a> sur OPT-125M / WikiText-2.</p><p>Le résultat est mathématiquement démontrable et empiriquement reproductible : neuf itérations suffisent à un collapse complet. Mais <strong>aucune équipe industrielle n'opère ainsi</strong>. C'est un cas de laboratoire utile pour isoler le mécanisme, pas pour anticiper le comportement des modèles de frontière.</p>"
    },
    "accumulation": {
      eyebrow: "Régime 2 · industrie",
      title: "Accumulation — le mode Phi, Llama, Gemma",
      body: "<p>La donnée humaine d'origine <strong>persiste</strong> dans le mix de chaque génération. Le synthétique s'ajoute sans remplacer. Gerstgrasser <em>et al.</em> (Stanford 2024)<a class='cite' href='#source-2' data-cite='2'>2</a> prouvent que dans ce régime, la perte de fidélité par rapport à la distribution réelle est <strong>bornée par un facteur constant</strong>, dépendant uniquement du ratio synthétique / réel.</p><p>C'est la pratique réelle de l'industrie. Phi-4 mélange ~40 % de synthétique avec 60 % de corpus humain<a class='cite' href='#source-7' data-cite='7'>7</a> ; Llama 3.1 conserve son pré-entraînement humain<a class='cite' href='#source-8' data-cite='8'>8</a>. Pas de collapse spectaculaire — mais des effets de second ordre subsistent.</p>"
    },
    "mix-curate": {
      eyebrow: "Régime 3 · production",
      title: "Synthetic-first curaté — Phi-4 et post-training Llama",
      body: "<p>Le synthétique est généré par un <em>teacher</em> plus fort (typiquement GPT-4o ou Claude-class), filtré par un juge automatique + des juges humains, et structuré autour de micro-curricula thématiques. Pas d'itération récursive : la chaîne est <strong>courte et contrôlée</strong>.</p><p>Phi-4 14B atteint 84,8 % MMLU avec ce mix<a class='cite' href='#source-7' data-cite='7'>7</a>. Llama 3.1 post-training est quasi 100 % synthétique mais vérifié<a class='cite' href='#source-8' data-cite='8'>8</a>. Le risque collapse est faible (pas de boucle fermée), mais le risque <strong>convergence stylistique</strong> entre modèles entraînés sur des outputs voisins est réel.</p>"
    }
  },
  "schema-02": {
    "early-collapse": {
      eyebrow: "Régime A · perte des queues",
      title: "Early collapse — les événements rares disparaissent en premier",
      body: "<p>Quelques générations suffisent à éroder les <em>queues</em> de la distribution — les événements rares, mots peu fréquents, styles minoritaires. Le mécanisme est probabiliste : tout échantillonnage discret tronque les probabilités les plus basses, et le modèle suivant n'apprend que ce qui a été échantillonné.</p><p>Padmakumar &amp; He (ICLR 2024)<a class='cite' href='#source-5' data-cite='5'>5</a> mesurent <strong>−11 % à −39 %</strong> de diversité lexicale après <strong>un seul tour</strong> d'assistance LLM. Sur cinq tours : −60 %. Ce qui disparaît, ce sont les termes techniques minoritaires, les néologismes, les structures syntaxiques inhabituelles.</p>"
    },
    "late-collapse": {
      eyebrow: "Régime B · catastrophe d'unimode",
      title: "Late collapse — la variance globale s'effondre",
      body: "<p>Après plusieurs générations, la masse probabiliste se concentre sur un petit nombre de modes. Le modèle ne sait plus produire que quelques séquences répétitives — la « catastrophe d'unimode » bien connue des chercheurs en modèles génératifs.</p><p>Dans le protocole Shumailov<a class='cite' href='#source-1' data-cite='1'>1</a>, OPT-125M passe par cet état dès la 7ᵉ-8ᵉ itération. Le texte généré n'a plus de structure linguistique cohérente. C'est le « crash » dramatique que la presse a popularisé — mais qui n'arrive jamais en pratique industrielle parce que personne n'itère 9 fois sur ses propres sorties.</p>"
    },
    "accumulation-borne": {
      eyebrow: "Régime C · stable",
      title: "Accumulation — la distribution reste préservée",
      body: "<p>Quand les données humaines d'origine persistent dans le mix à chaque génération, la perte de fidélité ne croît plus avec <em>n</em> mais reste bornée par un terme en O(1). C'est le résultat central de Gerstgrasser <em>et al.</em> (Stanford 2024)<a class='cite' href='#source-2' data-cite='2'>2</a>.</p><p>Démontré théoriquement sur des régressions linéaires (calcul exact), confirmé empiriquement sur GPT-2 small en fine-tuning itéré. Alemohammad <em>et al.</em><a class='cite' href='#source-4' data-cite='4'>4</a> trouvent le même résultat sur Stable Diffusion : <strong>5-10 % de données fraîches suffisent à éteindre le MAD</strong>. Seuil très accessible en pratique.</p>"
    }
  },
  "schema-03": {
    "paper-shumailov": {
      eyebrow: "1 · le pivot médiatique",
      title: "Shumailov et al. — Nature, juillet 2024",
      body: "<p>Le papier-référence qui a popularisé le terme « model collapse ». Protocole : OPT-125M fine-tuné sur WikiText-2, itéré 9 fois en remplacement strict. Résultat empirique : collapse complet vers la 9ᵉ génération. Preuves théoriques sur GMM.</p><p><strong>Régime étudié :</strong> remplacement strict. <strong>Verdict :</strong> collapse fatal — sous ces conditions.</p><p>Contribution réelle : identifier les trois régimes (early / late / convergence pathologique). Limite : généralisation médiatique à des scénarios qui ne sont pas ceux du protocole<a class='cite' href='#source-1' data-cite='1'>1</a>.</p>"
    },
    "paper-dohmatob": {
      eyebrow: "2 · formalisation théorique",
      title: "Dohmatob, Feng, Kempe (NYU/Meta) — fév. 2024",
      body: "<p>Formalisation théorique du collapse comme <strong>changement des scaling laws</strong>. Sous hypothèses techniques (distribution heavy-tailed, modèle sous-paramétrisé), même l'accumulation ne suffit pas — la dégradation se manifeste comme un régime moins favorable des scaling laws<a class='cite' href='#source-3' data-cite='3'>3</a>.</p><p><strong>Régime étudié :</strong> divers, dont accumulation. <strong>Verdict :</strong> « Strong Model Collapse » possible sous hypothèses restrictives.</p><p>Le débat 2024-2025 entre Stanford (Gerstgrasser) et NYU/Meta porte sur la pertinence pratique de ces hypothèses pour les modèles de frontière modernes.</p>"
    },
    "paper-alemohammad": {
      eyebrow: "3 · l'angle image",
      title: "Alemohammad et al. (Rice) — 2023, rev. 2024",
      body: "<p>« Self-Consuming Generative Models Go MAD » — étude sur Stable Diffusion auto-cannibale (entraînement itéré sur ses propres sorties). Observent un « Model Autophagy Disorder » combinant perte de qualité et perte de diversité.</p><p><strong>Régime étudié :</strong> auto-consommation totale → injection partielle. <strong>Verdict :</strong> collapse réel en boucle fermée, mais <strong>5-10 % de données fraîches suffisent à l'éteindre</strong><a class='cite' href='#source-4' data-cite='4'>4</a>.</p><p>Apport décisif : le seuil de stabilité est très bas. Aucune contrainte industrielle ne l'empêche d'être atteint en pratique.</p>"
    },
    "paper-gerstgrasser": {
      eyebrow: "4 · la contre-référence",
      title: "Gerstgrasser et al. (Stanford) — avril 2024",
      body: "<p>« Breaking the Curse of Recursion by Accumulating Real and Synthetic Data » — devenue la contre-référence centrale au papier Shumailov. Reprend le même protocole mais ajoute la variable <strong>accumulation</strong> : à chaque génération, les données réelles d'origine persistent.</p><p><strong>Régime étudié :</strong> accumulation explicite. <strong>Verdict :</strong> <strong>pas de collapse</strong> — perte de fidélité bornée par un terme en O(1)<a class='cite' href='#source-2' data-cite='2'>2</a>.</p><p>Démontré sur régressions linéaires (calcul exact) puis confirmé sur GPT-2 small. C'est ce papier qui a reformulé tout le débat 2024-2025.</p>"
    },
    "paper-bertrand": {
      eyebrow: "5 · point de bascule",
      title: "Bertrand et al. — ICLR 2024",
      body: "<p>« On the Stability of Iterative Retraining of Generative Models » — étude théorique du point de bascule entre stabilité et collapse en retraining itératif. Identifie les conditions formelles (taux d'injection, ratio synthétique / réel) qui séparent les deux régimes<a class='cite' href='#source-11' data-cite='11'>11</a>.</p><p><strong>Régime étudié :</strong> spectre complet, de remplacement à accumulation. <strong>Verdict :</strong> bistabilité — le système bascule entre stable et collapse selon des paramètres précis.</p><p>Fournit le cadre théorique pour comprendre pourquoi 5-10 % de fraîcheur suffisent (Alemohammad) ou ne suffisent pas (Dohmatob).</p>"
    }
  },
  "schema-04": {
    "axe-qualite": {
      eyebrow: "Axe 1 · visible",
      title: "Qualité moyenne — ce que les benchmarks mesurent",
      body: "<p>MMLU, GPQA, HumanEval, MATH : la suite standard du marché. Tous progressent continûment depuis 2022, indépendamment de la part synthétique du mix. Phi-4 14B = 84,8 % MMLU<a class='cite' href='#source-7' data-cite='7'>7</a> ; GPT-4o = 88,7 % ; Claude 3.5 = 88,7 % ; Llama 3.1 405B = 87,3 %<a class='cite' href='#source-8' data-cite='8'>8</a>.</p><p>C'est l'axe que regardent les <em>buyers</em>. C'est aussi le seul axe instrumenté par défaut. Conséquence : tant que MMLU monte, le risque silencieux passe inaperçu. La courbe ne dit rien sur la diversité ni sur la couverture des cas rares.</p>"
    },
    "axe-diversite": {
      eyebrow: "Axe 2 · invisible sans audit",
      title: "Diversité lexicale — chute documentée",
      body: "<p>Padmakumar &amp; He (ICLR 2024)<a class='cite' href='#source-5' data-cite='5'>5</a> mesurent la diversité avant/après assistance LLM par TTR (Type-Token Ratio) et richesse n-grammique. Résultat : <strong>−11 % à −39 %</strong> en un seul tour, <strong>−60 %</strong> en cinq tours itérés.</p><p>Aucun rapport technique de modèle de frontière ne publie cette métrique. Il faudrait un audit propriétaire. Ce qui disparaît : termes techniques minoritaires, néologismes, registre stylistique, expressions régionales — précisément ce qui fait la valeur d'un modèle pour des cas non-conventionnels.</p>"
    },
    "axe-queues": {
      eyebrow: "Axe 3 · effondrement caché",
      title: "Couverture des queues rares — la biodiversité statistique",
      body: "<p>Les événements rares sont les premiers à disparaître dans le mécanisme Shumailov<a class='cite' href='#source-1' data-cite='1'>1</a> : l'échantillonnage discret tronque mécaniquement les probabilités les plus basses, et le modèle suivant n'apprend que ce qui a été vu.</p><p>Pas de chute brutale visible. La perte se manifeste à l'usage : capacité créative érodée sur tâches non-conventionnelles, couverture de cas spéciaux insuffisante, convergence stylistique imperceptible mais cumulée.</p><p>Mesurable uniquement par audit adversarial — prompts spécifiquement conçus pour exercer les queues. Aucun benchmark public ne le fait aujourd'hui.</p>"
    }
  },
  "schema-05": {
    "famille-watermarking": {
      eyebrow: "Famille A · prometteur mais volontaire",
      title: "Watermarking actif — SynthID et signatures au sampling",
      body: "<p>Perturbation contrôlée de la distribution de sampling pendant l'inférence, selon un schéma pseudo-aléatoire connu. Laisse une signature statistique détectable sans coût en qualité perçue. Google DeepMind SynthID-Text<a class='cite' href='#source-9' data-cite='9'>9</a> revendique &gt; 90 % de détection sur textes &gt; 200 tokens, déployé en production sur Gemini depuis 2024.</p><p>Limites structurelles : (a) <strong>volontaire</strong> — dépend du producteur ; (b) résiste mal à la paraphrase agressive (traduction aller-retour) ; (c) inopérant sur les modèles open-weight dont les utilisateurs peuvent désactiver le mécanisme. Utile dans un écosystème coopératif, pas une preuve dans un contexte adversarial.</p>"
    },
    "famille-classifieurs": {
      eyebrow: "Famille B · grand public, peu fiable",
      title: "Classifieurs post-hoc — GPTZero, Turnitin, Originality",
      body: "<p>Classifieurs binaires (humain / IA) entraînés sur paires étiquetées. Précisions annoncées 80-99 %, mais sur distributions de test alignées. En production : 60-75 %.</p><p>Trois biais documentés : (a) <strong>faux positifs sur écrivains non-natifs</strong> (Liang 2023 : 60 % des essais d'étudiants chinois en anglais classés à tort comme IA) ; (b) dégradation rapide avec les modèles récents alignés sur la fluidité humaine ; (c) contournement trivial par paraphrase via un second modèle.</p><p>Turnitin et GPTZero ont publiquement révisé leurs taux en 2024-2025. La précision absolue reste inatteignable.</p>"
    },
    "famille-statistique": {
      eyebrow: "Famille C · borne théorique",
      title: "Détection statistique — DetectGPT, Binoculars, perplexité",
      body: "<p>Méthodes sans supervision : mesurent la perplexité ou l'entropie locale selon un modèle de référence. Le texte IA est typiquement « trop probable » — courbure de la log-vraisemblance plus négative que pour du texte humain.</p><p>Sadasivan <em>et al.</em> 2023 (rev. 2024)<a class='cite' href='#source-10' data-cite='10'>10</a> ont prouvé que <strong>la détection devient impossible quand l'écart distributionnel humain/IA tend vers 0</strong>. Taux borné par 1/2 + ε, où ε décroît avec le progrès des modèles.</p><p>Pas un échec de la recherche : une propriété structurelle. Les méthodes restent utiles pour des audits agrégés, pas pour identifier un texte individuel.</p>"
    },
    "limite-sadasivan": {
      eyebrow: "⚠ Borne théorique 2023",
      title: "Sadasivan et al. — l'asymétrie est structurelle",
      body: "<p>Démonstration formelle : tout détecteur statistique D vérifie <code>TPR − FPR ≤ TV(p_humain, p_IA)</code> où TV est la distance en variation totale entre les deux distributions. Quand TV → 0, D tend vers le hasard.</p><p>Or le progrès des modèles converge précisément vers TV → 0 — c'est même la définition de « modèle aligné sur l'humain ». <strong>La détection ne peut pas suivre indéfiniment</strong>. Conclusion : la détection fiable exigerait soit un watermarking universel (coopération de l'écosystème complète), soit une stagnation des modèles — deux scénarios improbables<a class='cite' href='#source-10' data-cite='10'>10</a>.</p>"
    }
  },
  "schema-06": {
    "mod-texte": {
      eyebrow: "Modalité texte",
      title: "Texte — la modalité la plus exposée",
      body: "<p>Coût marginal de génération proche de zéro, diffusion sans marquage par défaut, réabsorption par les corpus de pré-entraînement. Common Crawl 2024-2025 estime 15-35 % des pages post-2023 portent des marqueurs de génération.</p><p>C'est aussi la modalité où la <strong>perte de queues</strong> a le plus d'impact (registre stylistique, vocabulaire technique, structures argumentatives rares). Risque élevé en pré-training, moyen en fine-tuning curaté (Phi/Llama), bas si le RAG est strictement humain-vérifié<a class='cite' href='#source-7' data-cite='7'>7</a><a class='cite' href='#source-8' data-cite='8'>8</a>.</p>"
    },
    "mod-image": {
      eyebrow: "Modalité image",
      title: "Image — provenance C2PA, biais récursifs",
      body: "<p>Capacité plus récente (2022-2023), diffusion à grande échelle plus contrôlée, techniques de provenance plus matures : <span class='term' data-tooltip='Coalition for Content Provenance and Authenticity — standard ouvert d&apos;attestation cryptographique d&apos;origine.'>C2PA</span> natif sur iPhone récents, Sony Alpha, Adobe Firefly.</p><p>Deux fronts de risque : (a) désinformation et deepfake — problème politique majeur ; (b) <strong>dégradation récursive des biais démographiques</strong> — Wenger <em>et al.</em> (FAccT 2024)<a class='cite' href='#source-12' data-cite='12'>12</a> documentent l'amplification monotone des classes majoritaires à chaque génération sur Stable Diffusion auto-cannibale.</p>"
    },
    "mod-code": {
      eyebrow: "Modalité code",
      title: "Code — discipline naturelle par la vérification",
      body: "<p>Territoire paradoxal : le code généré (Copilot, Cursor, Claude Code) représente déjà ~46 % du code écrit par les utilisateurs de Copilot en 2024. Mais le code a une <strong>fonction de vérification dure</strong> : il compile ou non, il passe les tests ou non.</p><p>Cette discipline limite la dérive — un code qui ne marche pas est filtré par le développeur. RLVR (RL sur signaux vérifiables) constitue une boucle de feedback robuste. La perte de diversité existe (patterns architecturaux convergents, surutilisation de bibliothèques populaires), mais le risque catastrophique est contenu.</p>"
    },
    "mod-audio": {
      eyebrow: "Modalité audio",
      title: "Audio — la modalité émergente, profil texte +18 mois",
      body: "<p>La synthèse vocale (ElevenLabs, OpenAI Voice, Play.ht, Suno) a franchi le seuil d'indistinguabilité en 2023-2024. Les corpus d'entraînement audio restent encore majoritairement humains (podcasts, livres audio peu réabsorbés) — mais la prolifération attendue dans les 18 prochains mois rendra le problème comparable au texte.</p><p>SynthID-Audio (Google DeepMind) est l'équivalent watermark pour cette modalité, robuste à la compression et au ré-échantillonnage. Détection statistique : analyse spectrale fréquentielle, mais arms race continue avec les améliorations TTS.</p>"
    }
  },
  "schema-07": {
    "horizon-court": {
      eyebrow: "Phase 1 · 6-12 mois",
      title: "Court terme — déploiement + entrée en vigueur AI Act",
      body: "<p>Trois événements certains : (a) SynthID-Text généralisé sur Gemini et Imagen — pression incidente sur OpenAI et Anthropic ; (b) <strong>AI Act art. 10 (gouvernance des données) et art. 50 (transparence des contenus synthétiques) en vigueur le 2 août 2026</strong> ; (c) FineWeb-Edu 2.0 et les corpus de référence humain-vérifié s'étoffent.</p><p>Côté industriel : Phi-5 et Llama 4 publics avec data mix &gt; 50 % synthétique. Émergence d'offerings « RAG humain-only » premium. Pas encore d'obligation watermark — formulation AI Act floue couvre déclarations explicites.</p>"
    },
    "horizon-moyen": {
      eyebrow: "Phase 2 · 18-24 mois",
      title: "Moyen terme — registres de données, jurisprudence",
      body: "<p>Côté technique : C2PA généralisé (caméras, navigateurs), apparition des premières <strong>métriques de diversité</strong> dans des benchmarks publics, maturité des modèles « data-efficient » (RLVR généralisé, distillation extrême).</p><p>Côté réglementaire : registres de données standardisés (UE + UK + États-Unis), jurisprudence se fixe sur les actions « data sourcing » initiées en 2023-2024 (NYT, éditeurs FR, Reddit). Le marché du <strong>corpus pur</strong> émerge avec licences premium humain-vérifié.</p><p>Côté open-source : rattrape via curation collective (RedPajama-V3, FineWeb-Edu 3).</p>"
    },
    "horizon-bascule": {
      eyebrow: "Phase 3 · 2028",
      title: "Bascule — l'instrumentation devient un standard",
      body: "<p>L'audit de biodiversité statistique devient un standard de l'industrie : entropie de sortie, couverture lexicale, audit adversarial régulier sur les queues. Émergence de métriques d'homogénéisation cross-modèles.</p><p>Côté réglementaire : provenance par défaut sur le contenu numérique signé. Débat sur l'obligation de watermarking : oui / non / sectoriel — pas encore tranché.</p><p>Côté produit : différenciation par <strong>diversité</strong>, pas seulement qualité moyenne. C'est l'événement de 2028 — la prise de conscience que les benchmarks publics ne suffisaient pas, et qu'il faut des instruments qu'on n'a pas encore construits.</p>"
    }
  }
}
