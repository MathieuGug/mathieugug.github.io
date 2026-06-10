{
  "schema-01": {
    "selector": {
      title: "Selector — décision d'invocation",
      eyebrow: "1 · entrée du pipeline",
      body: "<p>Le selector reçoit l'intention exprimée par le modèle (<code>tool_calls</code>) et la convertit en décision d'invocation. Il valide que l'outil existe et que les arguments matchent le schéma JSON, résout les collisions de namespace (deux outils <code>search</code> exposés par deux serveurs MCP distincts), applique l'allowlist / denylist de la session, et décide si l'appel nécessite une HITL gate (écriture fichier, paiement, email).</p><p>C'est aussi le point d'entrée des politiques de sécurité MCP : <em>tool poisoning</em>, <em>cross-server confusion</em>, <em>prompt injection</em> via descriptions d'outils — toutes les défenses se concentrent ici.</p>"
    },
    "queue": {
      title: "Queue — file d'attente typée",
      eyebrow: "2 · attente",
      body: "<p>La queue maintient la file des appels en attente. Sur un agent séquentiel naïf, elle est triviale (FIFO de profondeur 1). Sur un agent qui parallélise, c'est une structure de données non-triviale : ordre de soumission préservé ou réordonné par latence prévue, groupement (<em>batch</em>) des appels commutatifs, déduplication des appels identiques émis dans le même tour.</p><p>LangGraph documente sa queue comme un <em>graph runtime</em> ; OpenHands l'implémente comme une <code>EventStream</code> typée qui distingue explicitement actions et observations.</p>"
    },
    "budget-tracker": {
      title: "Budget tracker — trois compteurs orthogonaux",
      eyebrow: "3 · contrôle",
      body: "<p>Le budget tracker suit en temps réel la consommation sur trois axes orthogonaux : <strong>tokens</strong> (cumul input + output, par modèle, par session), <strong>latence wall-clock</strong> (timeout dur de la session), <strong>dollars</strong> (cumul $ basé sur le pricing modèle et outils payants).</p><p>Quand l'un des trois budgets approche son seuil (typiquement 70-80 %), le tracker déclenche une politique de dégradation : downgrade modèle, compaction agressive, désactivation d'outils onéreux, <em>anytime answer</em>, ou hard fail. Voir Schéma 3 pour les politiques détaillées.</p>"
    },
    "parallelizer": {
      title: "Parallelizer — exécution simultanée",
      eyebrow: "4 · dispatch",
      body: "<p>Le parallelizer décide quels outils peuvent être lancés simultanément. La règle de sûreté : deux outils peuvent être parallélisés s'ils sont <strong>commutatifs</strong> dans leurs effets observables — l'ordre d'exécution ne change ni leur résultat ni l'état observable du monde.</p><p>Le LLM ne sait pas en général si deux outils sont commutatifs. L'API Anthropic expose un flag <code>disable_parallel_tool_use=true</code> quand l'application doit imposer la sérialisation. Claude Code adopte une heuristique : lecture seule parallélisée agressivement, écriture sérialisée et précédée d'une confirmation utilisateur.</p>"
    },
    "retry-timeout": {
      title: "Retry / timeout policy",
      eyebrow: "5 · fiabilité",
      body: "<p>Le sous-composant le plus subtil. Il décide quels échecs sont retriables (transient : timeout réseau, rate-limit 429, 500 éphémère), lesquels ne le sont pas (permanent : 404, schéma invalide, OOM), combien d'essais (<em>exponential backoff</em>, plafond), et quoi compenser quand un retry sur un outil non-idempotent a déjà partiellement réussi.</p><p>La matrice retry × idempotence à quatre quadrants (Schéma 4) gouverne cette politique. Le quadrant <em>transient × non-idempotent</em> est le plus dangereux — il exige idempotency-key ou compensation explicite, pas un simple retry.</p>"
    }
  },
  "schema-02": {
    "sequential": {
      title: "Sequential — un outil par tour",
      eyebrow: "Stratégie ancestrale",
      body: "<p>L'ancêtre. Un seul outil par tour, le modèle attend la réponse, raisonne, demande l'outil suivant. ReAct 2023 et Toolformer 2023 codent cette boucle comme primitive. C'est la stratégie par défaut de toute API de tool-use et la seule qui marche sans hypothèse sur les outils.</p><p><strong>Gagne</strong> : agent long-horizon où chaque étape dépend strictement de la précédente (Devin justifie son architecture séquentielle pure par l'horizon de planification long).</p><p><strong>Perd</strong> : tous les autres cas. Latence linéaire en N outils — sur un agent qui invoque 30 outils, 5 à 12 minutes là où parallel-batch ferait 90 secondes.</p>"
    },
    "parallel-batch": {
      title: "Parallel-batch — N outils simultanés",
      eyebrow: "Le gain le plus rentable",
      body: "<p>Le modèle émet plusieurs <code>tool_calls</code> dans le même tour ; le harness les lance simultanément. Anthropic l'a généralisé sur l'API Messages dès 2024 ; OpenAI Responses API a suivi début 2025.</p><p><strong>Conditions de sûreté</strong> : outils commutatifs, timeout individuel par outil, ordre déterministe préservé pour la réponse au modèle.</p><p><strong>Gain typique</strong> : 2,3× à 3,1× sur la latence end-to-end. C'est le gain le plus rentable du décennie en termes ratio impact / effort. La condition limite : la dépendance entre outils — quand <code>grep</code> doit s'appliquer au résultat de <code>find</code>, on ne peut pas batcher.</p>"
    },
    "dag-planned": {
      title: "DAG-planned — graphe de dépendances",
      eyebrow: "Sophistication LangGraph",
      body: "<p>Le modèle (ou un planner LLM dédié) émet d'abord un graphe de dépendances entre outils, puis le harness exécute le DAG en parallélisant les nœuds indépendants. LangGraph est la référence : l'agent décrit explicitement nœuds et arêtes ; le runtime calcule le plus court chemin et batchera ce qui peut l'être.</p><p><strong>Gagne</strong> : tâches multi-outils où la structure de dépendance est connue à l'avance — pipelines RAG complexes, agents data-engineering, agents avec sous-agents. Gain &gt; 5× en latence vs séquentiel.</p><p><strong>Perd</strong> : tâches exploratoires (codage interactif, debug). Forcer un DAG préalable coûte plus en planification ratée qu'il ne gagne en parallélisation.</p>"
    },
    "speculative": {
      title: "Speculative — plans concurrents",
      eyebrow: "Expérimental 2026",
      body: "<p>Analogie directe du speculative decoding : on lance en parallèle plusieurs plans d'exécution probables, sans attendre la confirmation du modèle, et on garde celui qui converge. Encore expérimental en 2026 — premiers prototypes Anthropic Research mi-2025 mais pas en production grand public.</p><p>Le verrou : le coût des plans abandonnés (tokens et appels d'outils gaspillés).</p><p><strong>Hypothèse de viabilité</strong> : sur une tâche dont la prochaine étape est fortement prédictible (acceptance rate &gt; 70 %), le gain de latence compense le coût des plans rejetés. En-dessous, perte nette. Condition de viabilité analogue au decode spéculatif.</p>"
    },
    "anytime": {
      title: "Anytime — meilleure réponse à tout instant",
      eyebrow: "Discipline de terminaison",
      body: "<p>Pas exactement une stratégie d'ordonnancement, mais une discipline de <em>terminaison</em>. L'agent maintient à tout moment une « meilleure réponse trouvée jusqu'ici » ; quand le budget est épuisé, il rend cette réponse plutôt que d'échouer. Manus documente cette discipline comme primitive.</p><p><strong>Gagne</strong> : agents en SLA serré (latence &lt; 10 s) où une réponse approximative dans le budget vaut mieux qu'une réponse exacte hors budget. Aussi : agents à exécution longue où l'utilisateur peut interrompre.</p><p><strong>Perd</strong> : tâches binaires (le test passe / ne passe pas, le fichier compile / ne compile pas) — il n'y a pas de « 80 % de la réponse ».</p>"
    }
  },
  "schema-03": {
    "tokens-axis": {
      title: "Axe tokens",
      eyebrow: "Compteur le plus directement observable",
      body: "<p>Un agent Claude Code typique consomme 80 k–400 k tokens sur une session de 30 minutes ; un agent Devin sur tâche complexe dépasse régulièrement 2 M tokens cumulés.</p><p>Le budget tokens est multi-niveau : par tour, par session, par compte. Le dépassement du budget de session déclenche soit une terminaison hard, soit une <strong>compaction</strong> — passage d'un état de 200 k à 8 k via summarization, eviction (StreamingLLM, H2O) ou retrieval. Voir le dossier <a href=\"../compaction-agentique/\">compaction-agentique</a> pour la taxonomie complète des algorithmes.</p>"
    },
    "latency-axis": {
      title: "Axe latence wall-clock",
      eyebrow: "Le LLM n'a aucune notion native du temps",
      body: "<p>Le LLM ne perçoit pas le temps écoulé. Le harness l'instrumente <em>de l'extérieur</em> via deux mécanismes :</p><ul><li>un <strong>timeout dur par session</strong> (souvent 30 minutes pour un agent batch, 8 s pour un agent conversationnel) ;</li><li>une <strong>deadline propagée</strong> à chaque outil sous forme d'argument injecté ou de contexte d'exécution — l'outil l'utilise pour décider lui-même de couper.</li></ul><p>L'instrumentation OTel <code>gen_ai.client.operation.duration</code> rend ce budget observable et asservissable à des SLO en production.</p>"
    },
    "cost-axis": {
      title: "Axe dollars",
      eyebrow: "Cumul pricing modèle + outils",
      body: "<p>Cumul à partir du pricing modèle (input / output) plus pricing des outils payants : API tierces, compute coding-sandbox, LLM-as-judge externe.</p><p>En 2026, le pricing Claude Sonnet est à 3 $ / Mtok input et 15 $ / Mtok output ; une session Devin de plusieurs heures peut dépasser 200 $. Le budget $ est typiquement une enveloppe par tâche, plus rarement par utilisateur ou par compte.</p><p>L'attribut OTel <code>gen_ai.usage.cost</code> reste optionnel — peu de providers exposent un coût stable et le calcul côté SDK est volatile.</p>"
    },
    "degradation-policy": {
      title: "Politique de dégradation",
      eyebrow: "Déclenchée à 70-80 % d'un axe",
      body: "<p>Cinq actions, à composer selon l'axe contraint :</p><ol><li><strong>Downgrade modèle</strong> : Opus → Sonnet → Haiku.</li><li><strong>Compaction agressive</strong> : <code>/compact</code> (Claude Code), eviction (StreamingLLM, H2O), résumé hiérarchique.</li><li><strong>Désactivation d'outils onéreux</strong> : couper l'accès aux API payantes (LLM-as-judge cher).</li><li><strong>Anytime answer</strong> : rendre la meilleure réponse trouvée et arrêter.</li><li><strong>Hard fail</strong> : terminer et notifier — la moins préférable.</li></ol><p>Manus 2026 : perte de qualité de 4 points (politique explicite) vs 18 points (sans politique) quand le budget passe de 200 k à 50 k tokens.</p>"
    }
  },
  "schema-04": {
    "quadrant-safe-retry": {
      title: "Safe retry — transient × idempotent",
      eyebrow: "Le cas standard",
      body: "<p>Le quadrant le plus simple. La faute est transitoire (timeout réseau, rate-limit 429, 500 éphémère, contention DB) et l'outil est idempotent (lecture, GET HTTP, recherche, calcul pur).</p><p><strong>Politique</strong> : exponential backoff classique. 3-5 tentatives, plafond 30 secondes entre essais, jitter aléatoire pour éviter les vagues synchronisées (<em>thundering herd</em>).</p><p>C'est le pattern canonique des systèmes distribués depuis 20 ans. Tous les SDK HTTP modernes (Stripe, AWS, Azure) l'implémentent par défaut. Aucune subtilité côté agent.</p>"
    },
    "quadrant-dangerous-retry": {
      title: "⚠ Zone dangereuse — transient × non-idempotent",
      eyebrow: "Source des incidents agent 2025",
      body: "<p>Le piège. Un POST de paiement timeout côté client : le paiement a-t-il été passé côté serveur, ou pas ? Le scheduler ne sait pas. Deux protocoles canoniques :</p><p><strong>Idempotency key</strong> : la requête porte un identifiant unique généré par le harness <em>avant</em> le premier essai ; le serveur dédoublonne. Stripe, AWS et tous les processeurs de paiement modernes l'imposent. Suppose un état persistant côté harness — sinon chaque retry produit une nouvelle clé et le dédoublonnage est cassé.</p><p><strong>Compensation</strong> : annuler une exécution réussie silencieusement. Suppose un outil de compensation cohérent (refund, undo, rollback), ce qui n'est pas toujours le cas.</p>"
    },
    "quadrant-no-retry": {
      title: "No retry — permanent × idempotent",
      eyebrow: "Log + fail-fast",
      body: "<p>La faute est permanente (404 not found, schéma invalide, paramètre OOB, 403 autorisation). Réessayer est un gaspillage net : la même requête échouera de la même façon.</p><p><strong>Politique</strong> : log l'erreur, remonter au LLM. Le LLM peut alors pivoter (reformuler avec d'autres paramètres, choisir un autre outil, ou abandonner cette branche du plan).</p><p>Ne pas masquer l'erreur. Le pivot du LLM dépend de la transparence — si le harness retente silencieusement ou tronque l'erreur, le modèle ne reçoit pas le signal qui lui permettrait d'adapter sa stratégie.</p>"
    },
    "quadrant-compensate": {
      title: "Surface l'erreur — permanent × non-idempotent",
      eyebrow: "Cas typique de la HITL gate",
      body: "<p>L'effet a-t-il eu lieu côté serveur ? On ne sait pas. Le harness ne peut pas trancher seul. Trois options :</p><ul><li><strong>Surface l'erreur au LLM</strong> : laisser le modèle décider — il peut consulter l'état (par exemple <code>list_orders</code> pour vérifier si le paiement est passé) et compenser si nécessaire.</li><li><strong>Demander confirmation humaine</strong> : HITL gate sur les actions irréversibles.</li><li><strong>Bloquer la session</strong> : si l'enjeu est critique (transaction, déploiement production), arrêter et alerter.</li></ul><p>La parade structurelle : concevoir l'outil pour qu'il soit idempotent <em>par construction</em>. Le manifest MCP v2 (automne 2026) prévoit de standardiser la déclaration d'idempotence par outil.</p>"
    }
  },
  "schema-05": {
    "claude-code": {
      title: "Claude Code",
      eyebrow: "Anthropic · agent CLI tour-par-tour",
      body: "<p>Le harness le plus mûr côté parallélisation et budgets. <strong>Parallel-batch agressif</strong> (jusqu'à 6 outils par tour), <code>/compact</code> natif pour gérer le budget tokens, et un retry-policy spécifique aux outils <code>bash</code> et <code>read_file</code>.</p><p><strong>Sa limite</strong> : pas de DAG-planning explicite — l'ordonnancement reste piloté par le LLM tour par tour. Pas de scheduler appris.</p><p><strong>Heuristique de parallélisation</strong> : outils en lecture seule parallélisés agressivement ; outils en écriture sérialisés et précédés d'une confirmation utilisateur sur les chemins concernés.</p>"
    },
    "cursor": {
      title: "Cursor",
      eyebrow: "Anysphere · agent intégré IDE",
      body: "<p>Architecture similaire à Claude Code côté boucle, avec une couche IDE — l'éditeur expose des outils contextuels (auto-suggestion, ligne courante, sélection).</p><p>Parallélisation oui, DAG non, budgets gérés au niveau IDE (timeout par opération). Le retry est délégué à l'API du modèle sous-jacent — Cursor consomme plusieurs providers et laisse chacun gérer sa propre politique de retry HTTP.</p><p>Pas d'observabilité publique du scheduler — le code est propriétaire et la télémétrie n'est pas exposée côté client.</p>"
    },
    "openhands": {
      title: "OpenHands",
      eyebrow: "Open-source · EventStream queue typée",
      body: "<p>Le harness ouvert le plus structuré côté scheduler. L'<code>EventStream</code> est une queue typée, le scheduler distingue explicitement les actions de l'agent et les observations du monde extérieur.</p><p>Support natif des budgets multi-axes (tokens, temps). <strong>DAG-planning partiel</strong> via la microagent architecture : un agent principal peut déléguer à des sous-agents qui forment un DAG implicite. Retry policy paramétrable par session.</p><p>Pas de scheduler appris. La feuille de route 2026 mentionne des expérimentations RL mais aucune n'a atteint la production.</p>"
    },
    "aider": {
      title: "Aider",
      eyebrow: "Léger · séquentiel par design",
      body: "<p>Pas de parallélisation ; le pari est qu'un agent de codage interactif a peu à gagner du batch — l'humain valide à chaque tour, et la lisibilité du flux prime sur la performance brute.</p><p>Budget tokens via context window naïf (compactage léger). Retry léger côté API. Pas de DAG ni de scheduler appris.</p><p>C'est délibéré : Aider cible le pair-programming, pas l'agent autonome long-horizon. Sur ce profil, la complexité d'un scheduler sophistiqué est un coût sans gain proportionnel.</p>"
    },
    "langgraph": {
      title: "LangGraph",
      eyebrow: "Framework · DAG comme primitive",
      body: "<p>Pas un agent en soi mais un <em>framework</em> pour construire des schedulers. Sa primitive est le DAG : nœuds (étapes), arêtes (transitions conditionnelles), state partagé.</p><p><strong>Parallélisation native</strong> sur les nœuds indépendants — le runtime calcule automatiquement quels nœuds peuvent être lancés simultanément. Budgets et retries sont laissés à l'utilisateur (configurables via les nœuds).</p><p>C'est le framework qui pousse le plus loin la sophistication du scheduler explicite côté écosystème ouvert. La contrepartie : une courbe d'apprentissage non triviale par rapport à Aider ou un harness ReAct simple.</p>"
    },
    "devin": {
      title: "Devin",
      eyebrow: "Cognition AI · séquentiel long-horizon",
      body: "<p>Agent managé propriétaire. Architecture séquentielle pure documentée publiquement, horizon long (sessions multi-heures). Budgets implicites côté Cognition — non exposés à l'utilisateur. Retry géré côté plateforme.</p><p><strong>Le pari</strong> : pour les sessions longues, la sophistication du DAG est moins importante que la stabilité de l'horizon. Mieux vaut un fil séquentiel qui ne perd pas le contexte qu'un graphe parallèle qui s'embrouille.</p><p>Pas de scheduler appris exposé, mais le retex public de Cognition (2024-2025) laisse entendre que des optimisations RL sur les trajectoires internes sont en cours d'expérimentation.</p>"
    },
    "manus": {
      title: "Manus",
      eyebrow: "Multi-machines · sandbox parallèle",
      body: "<p>L'autre agent managé multi-domaines. Public retex documente une <strong>architecture multi-machines</strong> : sandbox parallèle pour les tâches indépendantes (recherche web, analyse, codage), avec un coordinateur central qui orchestre les retours.</p><p>C'est l'implémentation la plus proche d'un DAG en production sur agent managé. Budgets multi-axes documentés (tokens / latence / $). Politiques d'ordonnancement heuristiques fortement codées.</p><p>Pas de scheduler appris au sens RL strict, mais le coordinateur central applique des règles d'ordonnancement qui ressemblent à un classifieur léger — frontière floue avec le RL-guided ordering visé pour 2026-2027.</p>"
    }
  },
  "schema-06": {
    "learned-scheduler": {
      title: "Track 1 — Scheduler appris",
      eyebrow: "RL sur trajectoires",
      body: "<p>Les premiers travaux datent de Tool-LLM et Gorilla Berkeley (2023-2024) sur la sélection d'outils par modèle distillé. L'extension naturelle : faire apprendre au scheduler non pas seulement <em>quel outil</em> mais <em>quel ordre, quel parallélisme, quel budget</em>.</p><p>RL sur des trajectoires d'agent passées avec réussite, latence et coût comme signal de récompense composite.</p><p><strong>Horizon</strong> : prototypes académiques fin 2026, premiers déploiements sur agents managés (Devin, Manus) en 2027, ouvert via SDK en 2028.</p>"
    },
    "rl-guided": {
      title: "Track 2 — RL-guided ordering",
      eyebrow: "Classifieur tactique",
      body: "<p>Variante plus tactique : un petit modèle dédié décide, à chaque tour, si parallélisation ou sérialisation, sur la base d'un classifieur entraîné sur des trajectoires annotées.</p><p>Plus simple à déployer qu'un scheduler appris complet — le modèle ne raisonne pas sur le plan entier mais sur une décision locale.</p><p><strong>Analogie</strong> : RL-guided drafting prévu pour le speculative decoding (cf. dossier <a href=\"../decode-speculative/\">decode-speculative</a> mai 2026). Publications académiques visées fin 2026, intégration vLLM-style dans les harness ouverts en 2027.</p>"
    },
    "slo-driven": {
      title: "Track 3 — SLO-driven scheduling",
      eyebrow: "Contrôleur PID budgets",
      body: "<p>L'observabilité OTel (cf. dossier <a href=\"../otel-genai-semconv/\">otel-genai-semconv</a> juin 2026) rend mesurable la latence et le coût en production. La prochaine étape : asservir le scheduler à des SLO explicites (« p95 latence &lt; 8 s », « coût moyen par session &lt; 0,50 $ »).</p><p>Le tracker budget devient un contrôleur PID qui ajuste downgrade, compaction et parallélisation en boucle fermée selon l'erreur entre SLO cible et mesure courante.</p><p><strong>Premiers patterns en production 2027</strong>, généralisation en 2028 — porté par les vendeurs APM qui veulent monétiser la couche d'orchestration.</p>"
    },
    "scheduler-as-a-service": {
      title: "Track 4 — Scheduler-as-a-service",
      eyebrow: "Offre SaaS découplée",
      body: "<p>L'aboutissement commercial. Une offre SaaS qui prend la politique de scheduling en charge : le client expose ses outils (via MCP), choisit ses budgets, et la plateforme orchestre.</p><p>C'est ce que Devin et Manus font déjà en pratique, mais comme partie d'un agent monolithique ; l'offre découplée — scheduler seul, modèle laissé au client — n'existe pas encore.</p><p><strong>Probable à horizon 2027-2028</strong>, portée par les vendeurs MCP et les APM (Datadog, Honeycomb) qui veulent monétiser la couche d'orchestration. Catégorie commerciale nouvelle à observer.</p>"
    }
  }
}
