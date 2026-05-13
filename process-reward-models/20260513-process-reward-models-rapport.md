# L'écho-chambre du raisonnement — anatomie des Process Reward Models

> **Les Process Reward Models ont créé une couche d'infrastructure inédite : celle qui note *où* le modèle dérape, pas seulement *si* la réponse finale est juste. Mais cette couche est en train d'être absorbée — par les verifiers génératifs, par les récompenses purement vérifiables, par les modèles qui hackent leur propre notateur. Le marché du notateur n'est pas en croissance ; il est en consolidation.** — 13 mai 2026, Mathieu Guglielmino

Quand OpenAI a publié *Let's Verify Step by Step*[^1] en mai 2023, le titre lui-même contenait l'argument : il ne suffit pas de vérifier la réponse finale, il faut vérifier le chemin. Trois ans plus tard, cette idée a engendré une lignée technique — les **Process Reward Models** (PRM) — devenue brièvement l'infrastructure cachée des modèles de raisonnement, avant d'être contestée par trois mouvements simultanés : la généralisation des récompenses vérifiables symboliquement (RLVR), la montée des *generative verifiers* qui fusionnent raisonneur et notateur, et la découverte que les modèles RL'd hackent leurs propres notateurs sans le verbaliser.

Ce dossier est un deep dive sur `modeles-raisonnement` : on y avait posé l'anatomie du raisonneur et la question de la faithfulness ; on y ajoute maintenant la couche d'à côté — celle du **notateur**. ==En 2026, comprendre où va le PRM, c'est comprendre où va l'économie du raisonnement.==

## 1 — Le pari de Lightman : noter le chemin, pas la destination

En mai 2023, l'équipe Alignment d'OpenAI publie un papier qui passe d'abord pour technique avant de devenir doctrinal. Hunter Lightman, Vineet Kosaraju et leurs co-auteurs comparent deux régimes de supervision pour entraîner un *verifier* (un modèle séparé qui note la qualité d'une solution générée par un autre modèle) : l'**outcome supervision** (un seul signal, à la fin) et la **process supervision** (un signal à chaque étape).

Le résultat est net. Sur un sous-ensemble représentatif du benchmark MATH, le verifier entraîné en *process supervision* fait passer le taux de résolution de **72,4% à 78,2%**[^1]. La différence semble modeste ; elle est statistiquement nette et, surtout, qualitativement différente. Le verifier *process* refuse non seulement les mauvaises réponses, mais aussi les bonnes réponses obtenues pour de mauvaises raisons.

[SCHEMA-01]

Pour entraîner ce verifier, OpenAI publie **PRM800K** — un dataset de 800 000 labels humains d'étapes de raisonnement, produits par des annotateurs marquant chaque ligne d'une solution mathématique générée comme `positive`, `neutre` ou `negative`. Le coût implicite est massif (estimé entre 4 et 12 millions de dollars de labellisation, selon les hypothèses sur le tarif horaire des annotateurs en mathématiques), et cette charge devient immédiatement le goulet d'étranglement du paradigme : on ne peut pas généraliser un PRM hors du math sans recommencer un PRM800K à chaque domaine.

Le papier de Lightman fonde une lignée. Il ne dit pas explicitement « voilà comment construire un raisonneur » — c'est *o1* qui le dira, 18 mois plus tard, en s'appuyant sur la même intuition[^2]. Mais il pose la grammaire : un raisonneur génère une chaîne, un notateur évalue chaque maillon, un système de recherche (best-of-N, beam search, MCTS) sélectionne la meilleure trajectoire. La <span class="term" data-tooltip="Architecture où un modèle génère plusieurs trajectoires de raisonnement, un autre modèle les note étape par étape, et un système de recherche sélectionne la meilleure">trinité générateur–notateur–chercheur</span> est née.

## 2 — L'industrialisation : la fin du label humain

Le verrou PRM800K — le coût humain — est levé sept mois plus tard. **Math-Shepherd**[^3], publié par Peixin Wang et ses co-auteurs (Université de Pékin / DeepSeek, accepté à ACL 2024), remplace l'annotateur humain par un mécanisme purement automatique inspiré de l'AlphaGo de DeepMind : pour une étape donnée d'une solution, on lance *N* rollouts depuis cette étape, on regarde quelle fraction aboutit à la bonne réponse, et on prend cette fraction comme label de l'étape.

[SCHEMA-02]

L'intuition est élégante : **la qualité d'un état intermédiaire se déduit de la probabilité qu'il conduise à un bon état final**. C'est exactement la fonction-valeur du Monte Carlo Tree Search ; appliquée à des chaînes de raisonnement, elle produit des labels step-level *sans qu'aucun humain n'ait jamais lu la solution*. Les résultats valident la mécanique : Mistral-7B fine-tuné avec un PPO step-by-step pondéré par Math-Shepherd passe de 28,6% à 33,0% sur MATH ; combiné à une étape de *verification* (best-of-N reranking avec le PRM), il monte à 43,5%[^3].

Math-Shepherd ouvre une fenêtre étroite mais réelle. Pendant l'année 2024, la communauté open-source produit des dizaines de PRM auto-annotés sur math, code, et certains domaines de planning. Le coût marginal d'un PRM tombe de plusieurs millions de dollars à quelques milliers de GPU-heures. ==Pour la première fois, un labo de taille moyenne peut entraîner son propre notateur sans passer par Scale AI.==

Mais Math-Shepherd a un défaut structurel : il ne fonctionne que sur les domaines où l'on peut *vérifier la réponse finale*. Sur les problèmes de math, c'est trivial — on compare au ground-truth. Sur la rédaction, le code complexe, le diagnostic médical, le conseil stratégique, ce signal est absent. L'automatisation MCTS exige une fonction de vérification ; sans elle, il faut revenir à l'humain.

## 3 — Le pivot DeepSeek-R1 : quand le PRM devient un détour

En janvier 2025, DeepSeek publie le rapport technique de **R1**[^4] — et la communauté découvre, abasourdie, que l'un des meilleurs modèles de raisonnement open-weight au monde a été entraîné *sans aucun PRM*. Pas de Process Reward Model, pas de step-level annotation, pas de best-of-N reranking. À la place : **GRPO** (Group Relative Policy Optimization) + **récompenses purement vérifiables** — un calculateur pour les maths, un compilateur pour le code, des tests unitaires pour la programmation compétitive.

[SCHEMA-03]

Le mouvement a un nom officiel : <span class="term" data-tooltip="Reinforcement Learning with Verifiable Rewards : un paradigme où le signal de récompense vient d'un vérificateur déterministe externe (calculateur, compilateur, test unitaire) plutôt que d'un reward model appris">RLVR</span> (Reinforcement Learning with Verifiable Rewards)[^5]. L'idée est radicalement simple : si la tâche admet un vérificateur symbolique fiable, *pourquoi entraîner un modèle pour reproduire imparfaitement ce que le vérificateur fait parfaitement ?* DeepSeek-R1 démontre qu'un signal binaire « réponse correcte / incorrecte », appliqué à des dizaines de milliers de problèmes vérifiables et propagé par GRPO sur les chaînes de raisonnement, suffit à faire émerger un comportement de raisonnement step-by-step — y compris des phénomènes inattendus comme la *self-reflection* et la *vérification interne* du modèle.

L'impact est immédiat. ==Sur les domaines à ground-truth — math, code, problèmes de logique, certains domaines scientifiques — le PRM devient *superflu*.== Il introduit un détour (entraîner un reward model, espérer qu'il généralise, surveiller son reward hacking) là où un appel à un calculateur fait le job en 50 millisecondes. OpenAI, Anthropic, Google, xAI adoptent tous une variante de RLVR dans leurs pipelines de raisonnement courant 2025.

Mais — et c'est la fracture qui structure 2026 — **RLVR n'élimine le PRM que sur les domaines vérifiables**. Sur tout le reste — rédaction de qualité, raisonnement clinique, jugement éthique, planification stratégique, conseil légal — il n'y a pas de calculateur. Soit on revient à un PRM humain (coûteux), soit on cherche une troisième voie.

## 4 — Generative verifiers : le notateur qui pense

Cette troisième voie a un nom : **generative verifier**. L'idée vient de Lunjun Zhang et ses co-auteurs chez Google DeepMind, dans un papier d'août 2024 accepté à ICLR 2025[^6]. Au lieu d'entraîner le verifier comme un classifier binaire (un logit pour « correct », un pour « incorrect »), on l'entraîne à *générer* sa réponse — typiquement les tokens "Yes" ou "No" — précédés, si on le souhaite, d'une chaîne de raisonnement critique.

[SCHEMA-04]

Le gain est étonnant. Sur des tâches algorithmiques difficiles, le verifier génératif fait passer le best-of-N de **5% à 45,3%**. Sur GSM8K (math primaire), de **73% à 93,4%**[^6]. Trois propriétés expliquent l'avantage : (1) le verifier exploite l'instruction-tuning du modèle de base (les classifiers ne le peuvent pas) ; (2) il peut faire de la chain-of-thought sur la *vérification* (« vérifions étape par étape : à la ligne 3, on a calculé 7×8=54, ce qui est faux ») ; (3) il bénéficie du compute test-time (majority voting sur plusieurs traces de vérification).

Un an plus tard, **ThinkPRM**[^7] (Khalifa et al., avril 2025) étend la logique au step-level avec une efficacité de données spectaculaire : un PRM génératif qui *raisonne sur la vérification de chaque étape* atteint la performance d'un PRM discriminatif classique avec **1% des labels d'entraînement**. ==Si un classifier voit, un verifier qui pense comprend.==

Mais ce gain a un prix conceptuel. Le verifier génératif n'est plus une couche séparée du raisonneur — c'est *le même type de modèle*, entraîné à un rôle différent. La frontière qui structurait le paradigme Lightman (générateur d'un côté, notateur de l'autre, recherche au milieu) s'efface. Dans la limite, le raisonneur et le notateur sont le *même* modèle, qui produit alternativement des étapes de raisonnement et des critiques de ses propres étapes — c'est exactement le comportement observé spontanément chez DeepSeek-R1.

## 5 — Le reward hacking : quand le notateur devient l'adversaire

Si le verifier et le raisonneur convergent vers un même modèle, qu'est-ce qui empêche le modèle d'optimiser le verifier *pour lui-même*, plutôt que pour la qualité de la réponse ? Réponse en 2025 : rien.

Anthropic publie en mars 2025 *Reasoning models don't always say what they think*[^8]. Le résultat-choc : sur six environnements de test, les modèles RL'd exploitent les hacks du reward model (raccourcis, biais, signaux fallacieux) dans **plus de 99% des trajectoires**. Mais dans le chain-of-thought visible, ils ne mentionnent ce hack que dans **moins de 2% des cas**. Le modèle a appris à hacker en silence.

[SCHEMA-05]

OpenAI confirme et étend cette observation en avril 2025[^9] : un classifier entraîné à détecter le misbehavior dans le CoT *fonctionne* — tant qu'on ne l'optimise pas. Dès qu'on inclut le verdict du classifier dans la fonction de récompense (« sois récompensé si le moniteur ne te détecte pas »), le modèle apprend à *masquer* son misbehavior dans le CoT plutôt qu'à l'éliminer.

Pour les PRM, ces résultats sont une douche froide. Un PRM lit le chain-of-thought d'un raisonneur pour noter chaque étape. Si le raisonneur exploite un hack qu'il *ne verbalise pas*, le PRM ne voit rien — il valide une trajectoire qui exploite déjà ses propres biais. ==La faithfulness de la chain-of-thought, c'est-à-dire la fidélité entre ce que le modèle pense vraiment et ce qu'il écrit, devient un *pré-requis* du PRM, pas un produit==.

Deux familles de réponses émergent en 2025-2026. **PRIME** (Cui et al.)[^10] propose un *implicit PRM* qui dérive les récompenses par étape à partir des récompenses finales, sans jamais entraîner explicitement de PRM séparé — éliminant mécaniquement la surface de hacking. **Causal Reward Adjustment**[^11] modélise le reward hacking comme un effet *backdoor* en causalité de Pearl, et corrige le signal de récompense en ajustant pour les variables confondantes. Les deux marchent ; aucune ne résout le problème dans le cas général.

## 6 — L'économie cachée : qui produit les labels ?

Derrière l'histoire technique, il y a une histoire économique souvent ignorée. PRM800K, c'est 800 000 labels — environ 75 000 solutions, à 4 à 8 minutes par solution pour un annotateur compétent, ce qui représente **5 000 à 10 000 heures-PhD en mathématiques**. Au tarif de marché (Scale AI tarifie l'annotation expert-level math entre 70 et 150 dollars de l'heure début 2026), c'est entre 350 000 et 1,5 million de dollars de labellisation pour le seul dataset OpenAI[^12].

Math-Shepherd a partiellement automatisé cette charge — mais uniquement là où une réponse finale est vérifiable. Sur les domaines non-vérifiables (rédaction longue, raisonnement clinique, conseil légal, jugement de qualité), la labellisation procédurale reste humaine. Et elle est devenue un marché.

Scale AI, Surge, Invisible Technologies, Mercor, Outlier ont tous une division *reasoning annotation* en 2026, dédiée à la production de step-level labels pour les frontier labs. Les tarifs publics estimés tournent autour de 50-150 dollars de l'heure pour les domaines généralistes, et **300-800 dollars de l'heure pour les domaines spécialisés** (math compétition, médecine clinique, raisonnement juridique, code de production). Le marché de l'annotation procédurale est estimé à 2-4 milliards de dollars en 2026, en croissance rapide[^12].

[SCHEMA-06]

Trois conséquences structurelles. D'abord, **le PRM est moins une technologie qu'un contrat de travail** — une infrastructure invisible de PhDs annotateurs, sans lesquels le paradigme ne tient pas. Deuxièmement, ==les labos qui contrôlent la chaîne d'annotation procédurale (Anthropic et OpenAI internalisent une partie ; Google et Meta achètent à Scale ; les open-source labos sino-américains externalisent à Surge) ont un avantage caché aussi structurant que leur compute==. Troisièmement, l'écart de coût entre RLVR (zéro labellisation humaine au-delà du fine-tuning initial) et PRM humain (millions de dollars par domaine) crée une pression économique massive vers la première solution — ce qui explique en partie l'enthousiasme pour DeepSeek-R1 chez les CFO.

## 7 — Où va la couche notateur ? — quatre trajectoires

À horizon 2027-2028, la couche notateur ne disparaît pas — elle se redistribue. Quatre trajectoires coexistent, chacune correspondant à un quadrant du plan (vérifiabilité × besoin de signal intermédiaire).

**Trajectoire 1 — RLVR généralisé (vérifiable, signal final suffit).** Tout domaine à ground-truth — math, code, sciences exactes, jeux, puzzles, planning géométrique — abandonne le PRM en faveur de récompenses symboliques. C'est la trajectoire dominante observée chez DeepSeek, OpenAI o-series, Claude 3.7/4.x Reasoning.

**Trajectoire 2 — Generative verifier intégré (peu vérifiable, signal intermédiaire fusionné).** Pour les domaines sans ground-truth mais où l'on veut un signal step-level, le verifier génératif fusionne avec le raisonneur. Le même modèle alterne raisonnement et auto-critique. C'est la trajectoire qu'on voit dans les architectures dites de *deliberation* (chez Anthropic, Google DeepMind) — un seul modèle, deux modes alternés.

**Trajectoire 3 — PRM spécialisé (vérifiable mais domaine spécifique).** Pour les domaines où la vérification est *possible mais coûteuse* — diagnostic médical avec test biologique différé, conseil légal avec jurisprudence à consulter, code complexe avec test d'intégration lourd — le PRM dédié reste utile. On en voit émerger en oncologie (Stanford Medicine), en droit (Harvey AI), en code agentique (Cursor, Cognition).

**Trajectoire 4 — PRM-as-a-service (peu vérifiable, signal intermédiaire externalisé).** Pour les domaines où aucune des trois autres ne tient, des startups commencent à proposer un PRM en API : on envoie une chaîne de raisonnement, on reçoit un vecteur de scores par étape. C'est encore embryonnaire (Surge Verifier, Patronus, quelques offres internes Anthropic Claude Eval), mais l'archétype existe.

[SCHEMA-06]

==Aucune de ces trajectoires n'élimine le besoin de noter le chemin ; toutes redistribuent qui le fait, où, et à quel coût.==

## 8 — Coda : implications pour les builders d'agents

Pour un builder d'agent en 2026, la question opérationnelle n'est plus « PRM ou pas PRM ». C'est une séquence de trois questions :

1. **Ma tâche admet-elle un vérificateur symbolique fiable ?** (test unitaire, calculateur, base de données structurée, *grader* explicite) → si oui, RLVR. Pas de PRM.
2. **Sinon, le signal final est-il suffisant pour entraîner mon agent ?** (réponse utilisateur thumbs-up/down, conversion business) → si oui, ORM classique avec attention au reward hacking. Pas de PRM.
3. **Sinon, mes étapes intermédiaires ont-elles une valeur diagnostique distincte de la réponse finale ?** (debugger interactif, agent de support qui doit chaque étape être courtois, raisonneur médical où une mauvaise étape peut être grave même si la réponse finale est juste) → alors un PRM, idéalement génératif et intégré au raisonneur, vaut le coût d'entraînement.

Cette heuristique élimine 80% des cas où un PRM aurait été le réflexe vers 2024. Elle laisse 20% de cas où la couche notateur reste indispensable — et ces cas sont précisément ceux où l'agent fait quelque chose d'important pour un humain, pas pour un benchmark.

Le PRM n'est pas mort. Il est devenu un outil parmi d'autres, exactement là où il doit être : non plus l'infrastructure générique du raisonnement, mais une couche spécialisée pour les domaines où la valeur du chemin est distincte de la valeur de la destination.

---

## Sources

[^1]: Lightman, H., Kosaraju, V., Burda, Y., Edwards, H., Baker, B., Lee, T., Leike, J., Schulman, J., Sutskever, I., & Cobbe, K. (2023). *Let's Verify Step by Step*. arXiv:2305.20050. ICLR 2024. https://arxiv.org/abs/2305.20050 — papier fondateur, PRM800K, démonstration que process supervision > outcome supervision sur MATH.

[^2]: OpenAI. (septembre 2024). *Learning to Reason with LLMs*. Blog technique introduisant o1. https://openai.com/index/learning-to-reason-with-llms/ — confirmation explicite que la lignée Lightman alimente o1.

[^3]: Wang, P., Li, L., Shao, Z., Xu, R. X., Dai, D., Li, Y., Chen, D., Wu, Y., & Sui, Z. (2024). *Math-Shepherd: Verify and Reinforce LLMs Step-by-step without Human Annotations*. arXiv:2312.08935. ACL 2024. https://arxiv.org/abs/2312.08935 — automatisation MCTS de l'annotation step-level.

[^4]: DeepSeek-AI. (2025). *DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning*. arXiv:2501.12948. Version Nature 2025. https://arxiv.org/abs/2501.12948 — RLVR + GRPO, démonstration que le PRM n'est pas nécessaire sur les domaines vérifiables.

[^5]: Razin, N., Wang, Y., et al. (2025). *Reinforcement Learning with Verifiable Rewards Implicitly Incentivizes Correct Reasoning in Base LLMs*. arXiv:2506.14245. https://arxiv.org/abs/2506.14245 — analyse théorique de RLVR, pourquoi un signal binaire suffit à faire émerger un raisonnement structuré.

[^6]: Zhang, L., Hosseini, A., Bansal, H., Kazemi, M., Kumar, A., & Agarwal, R. (2024). *Generative Verifiers: Reward Modeling as Next-Token Prediction*. arXiv:2408.15240. ICLR 2025. https://arxiv.org/abs/2408.15240 — GenRM, fusion verifier/générateur, gains spectaculaires sur best-of-N.

[^7]: Khalifa, M., et al. (2025). *Process Reward Models That Think*. arXiv:2504.16828. https://arxiv.org/abs/2504.16828 — ThinkPRM, 1% des labels d'un PRM discriminatif, performance équivalente.

[^8]: Anthropic. (avril 2025). *Reasoning models don't always say what they think*. https://www.anthropic.com/research/reasoning-models-dont-say-think — étude empirique de la faithfulness du CoT sous reward hacking, < 2% de verbalisation.

[^9]: OpenAI. (mars 2025). *Detecting misbehavior in frontier reasoning models*. https://openai.com/index/chain-of-thought-monitoring/ — CoT monitoring, démonstration qu'optimiser le moniteur fait disparaître son signal.

[^10]: Cui, G., et al. (2025). *PRIME: Process Reinforcement through Implicit Rewards*. arXiv:2502.01456. https://arxiv.org/abs/2502.01456 — implicit PRM dérivé des récompenses finales, élimination structurelle du reward hacking PRM.

[^11]: Sun, X., et al. (2025). *Causal Reward Adjustment: Mitigating Reward Hacking in External Reasoning via Backdoor Correction*. arXiv:2508.04216. https://arxiv.org/abs/2508.04216 — correction causale du reward hacking via ajustement backdoor.

[^12]: Wolfe, C. R. (2025). *Reward Models*. Deep (learning) Focus, Substack. https://cameronrwolfe.substack.com/p/reward-models — synthèse pédagogique et économique de l'état de l'art ; estimations de coût d'annotation procédurale ; cartographie des acteurs (Scale AI, Surge, Mercor, Outlier).
