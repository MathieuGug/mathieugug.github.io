---
chapitre: 2
titre: "Les modèles de raisonnement et la seconde courbe de scaling"
acte: 1
acte_titre: "Les moteurs"
gabarit: standard
mots: 7630
statut: v1
date_maj: 2026-05-29
---

# Chapitre 2 — Les modèles de raisonnement et la seconde courbe de scaling

> **Acte I — Les moteurs · Chapitre standard, ~22 pages**
> _Le 12 septembre 2024, OpenAI publie o1 et bascule l'industrie dans un régime que rien n'annonçait au grand public : les modèles cessent de cracher leur réponse en un seul jet pour dépenser, à l'inférence, un calcul long, explicite, vérifiable. La chaîne de pensée n'est plus une astuce de prompt, c'est l'objet même de l'optimisation par renforcement. DeepSeek-R1 démontre quatre mois plus tard que la recette tient sans aucune trace humaine. Snell ouvre un second axe de scaling où un petit modèle compute-optimal à l'inférence bat un modèle 14× plus gros à FLOPs équivalents. Mais ce que ces modèles déclarent penser n'est pas toujours ce qu'ils font — la fidélité chute à 25-39 % et décroît avec la difficulté. Pour le décideur 2026, une phrase suffit : on signe désormais un régime tarifaire et un design d'allocation compute par requête, plus seulement un modèle._

> [!QUESTION] Question d'ouverture
> Depuis o1 (12 septembre 2024), on dépense du compute à l'inférence pour chercher, vérifier, corriger. Qu'est-ce qui a vraiment changé — la chaîne de pensée n'était-elle pas déjà connue depuis 2022 ? Et pourquoi un décideur 2026 doit-il intérioriser que choisir un reasoning model n'est plus choisir un modèle mais signer un régime tarifaire dont la facture par tâche peut être 74 fois supérieure à un appel non-raisonné ?

> [!TLDR] TL;DR décideur
> - ==**Le pivot o1 est une mécanique d'entraînement, pas un prompt.**== La chaîne de pensée est désormais l'objet de l'optimisation par renforcement contre un vérifieur booléen (RLVR). AIME 2024 saute de ~13 % (GPT-4o) à 74 % (o1) en six mois.
> - **DeepSeek-R1 prouve que le RL pur suffit.** *Nature* sept. 2025. R1-Zero apprend l'*aha moment* (« wait, let me reconsider ») sans aucune trace humaine, par GRPO. Coût d'inférence ÷30 vs o1.
> - **Second axe de scaling (Snell, août 2024).** Un petit modèle compute-optimal à l'inférence bat un modèle 14× plus gros à FLOPs équivalents — via 4 stratégies test-time : Best-of-N, Beam+PRM, MCTS, refinement séquentiel.
> - ==**Trois variantes laboratoires en 2026.**== Interleaved thinking Claude 4.x (pensée + tool call), summary OpenAI depuis o1 (anti-distillation + safety), parallel thinking Gemini Deep Think (médaille d'or IMO 2025).
> - **Piège fidélité.** Claude 3.7 fidèle 25 %, R1 39 %, hint unauthorized 41/19 %, GPQA -44 % vs MMLU. ==« Trust the chain » n'est plus tenable== — la CoT est un brouillon, pas un audit log.
> - **Distillation accessible.** R1-Distill-Qwen 7B → 55 % AIME ; 32B → 72 % (comparable o1-mini). Les coding agents (Claude Code, Cursor, Devin) en font leur moteur.
> - **Économie unitaire transformée.** Ratio thinking/output jusqu'à 100:1 ; ×10 à ×74 sur AIME entre non-reasoning et reasoning. Router automatiquement est un piège FinOps documenté.

---

## 2.2 Le pivot o1 (12 septembre 2024) — qu'est-ce qui a changé

![Schéma 1 — Le pivot raisonnement : 4 tracks (OpenAI / DeepSeek / Anthropic / Google) sur 20 mois sept 2024 → mai 2026|1300](../../modeles-raisonnement/images/20260506-01-timeline-pivot.svg)

### 2.2.1 Avant — chain-of-thought = astuce de prompt

Entre 2022 et début 2024, la chaîne de pensée existait — mais comme *propriété du prompt*. Wei et al. publient au printemps 2022 « Chain-of-Thought Prompting Elicits Reasoning » : il suffisait d'ajouter « Let's think step-by-step » pour que GPT-3.5 ou PaLM produisent une décomposition intermédiaire et améliorent leurs performances. Le modèle ne changeait pas ; on l'invitait à *dérouler* avant de répondre. ==La chaîne n'avait jamais été l'objet d'un entraînement dédié — c'était un effet de bord du pretraining sur des corpus contenant de la prose explicative==. Ce qui marchait sur AIME passait de 13 % à 17 % via CoT prompt sur GPT-4, pas à 74 %.

### 2.2.2 Le 12 septembre 2024 — la chaîne devient l'objet de l'optimisation

OpenAI publie ce jour-là *Learning to reason with LLMs* et présente o1[^1]. Le post de blog est laconique côté mécanique mais explicite sur le principe : ==le modèle est entraîné par renforcement à grande échelle pour produire une chaîne de pensée *avant* la réponse, de telle sorte que cette chaîne maximise la résolution de problèmes vérifiables==. La rupture est conceptuelle plus que technique : la chaîne n'est plus un truc de prompt, c'est ce que l'optimisation cible. Le modèle n'apprend pas à *imiter* des chaînes humaines — il apprend à produire des chaînes qui *fonctionnent*, mesurées par un vérifieur mécanique externe.

> [!IMPORTANT] Le pivot n'est pas le prompt, c'est la mécanique d'entraînement
> ==**À retenir** : avant o1, dire « let's think step-by-step » améliorait les perfs sans changer le modèle. Après o1, la chaîne est ce qu'on apprend à produire par RLVR contre un vérifieur booléen.== Un raisonneur 2026 produit ses propres tactiques de décomposition, d'auto-vérification, de retour en arrière, sans qu'aucun humain n'ait écrit ces tactiques. La chaîne devient un programme stochastique outillé, pas un monologue prompté. Toutes les conséquences qui suivent — économie unitaire transformée, fidélité poreuse, anatomie API à deux flux, distillation transférable — découlent de ce déplacement.

### 2.2.3 L'effet benchmark — AIME 13 % → 74 % en six mois

Sur AIME 2024 (problèmes de niveau olympiade nationale américaine), o1 atteint 74 % en single-sample, contre approximativement 13 % pour GPT-4o[^1]. ==En six mois, sur un benchmark conçu pour rester difficile pendant des années, on a multiplié la performance par cinq sans toucher au nombre de paramètres==. Sur ARC-AGI-1 — le benchmark conçu en 2019 par François Chollet pour mesurer l'adaptation à des tâches inédites — o3 (décembre 2024) atteint 75,7 % en mode efficace et 87,5 % en mode haute compute, premier passage crédible au-dessus du seuil humain[^7]. Chollet lui-même parle de « rupture en matière d'adaptabilité ». ==Toute la classe de problèmes vérifiables (math, code, sciences exactes, planification) bascule dans un autre régime de performance== — sur MATH, GPQA, Codeforces, HumanEval+, les raisonneurs ouvrent un écart de 15 à 30 points sur les non-raisonneurs de tailles comparables.

### 2.2.4 DeepSeek-R1 janvier 2025 — code et poids open-source

Quatre mois plus tard, DeepSeek publie R1[^2]. Trois ruptures simultanées. ==Le code et les poids sont open-source==, sous licence MIT. Le papier passe le peer review de *Nature* (volume 645, p. 633, septembre 2025) — premier raisonneur frontière à traverser ce filtre. Et ==le coût d'inférence est annoncé à environ 30 fois inférieur à celui d'o1==. Mais la rupture la plus structurante est ailleurs : DeepSeek démontre une recette reproductible. La famille R1 inclut R1-Zero, une variante *avant* tout finetuning supervisé. R1-Zero apprend à raisonner par RL pur sur récompense vérifiable, sans aucune démonstration humaine de chaîne de pensée. ==L'industrie apprend là qu'un raisonneur peut s'auto-organiser en partant d'un modèle de base et d'un vérifieur booléen — il n'y a pas besoin d'un dataset humain de chaînes de raisonnement annotées==.

### 2.2.5 Claude 3.7 puis 4.x — extended thinking

Au printemps 2025, Anthropic emboîte le pas avec Claude 3.7 Sonnet et son *extended thinking*[^5]. Anthropic n'expose pas seulement un résumé, mais des **blocs `&lt;thinking&gt;` visibles** dans la réponse de l'API. Ces blocs peuvent s'intercaler avec des *tool calls* — c'est l'**interleaved thinking** : le modèle pense, appelle un outil, reçoit le résultat, repense, appelle un autre outil. ==La pensée devient un programme outillé multi-tours, pas un monologue isolé== — c'est cette propriété qui permettra aux coding agents de l'Acte II d'avoir leur architecture en boucle harness-driven. Claude 4.0 puis 4.6 rendent le thinking *adaptatif* : le modèle décide lui-même combien penser.

### 2.2.6 Gemini 2.5 Deep Think mai 2025 — médaille d'or IMO 2025

Google DeepMind ajoute une dimension orthogonale avec Gemini 2.5 Deep Think[^4] : le **parallel thinking**. Le modèle explore *simultanément plusieurs branches* indépendantes, puis agrège ou sélectionne la meilleure. La validation publique la plus spectaculaire arrive aux Olympiades Internationales de Mathématiques 2025 : un système basé sur Deep Think obtient une médaille d'or, score équivalent au top 5 % des étudiants humains qualifiés.

À mai 2026, les quatre laboratoires frontière ont chacun leur famille de raisonneurs — OpenAI (o1, o3, o4) à chaîne résumée, Anthropic (3.7, 4.0, 4.6) à thinking exposé et interleaved, Google (Deep Think) à parallel thinking, DeepSeek (R1, R1-Distill) à RLVR pur open-source. Le Schéma 1 trace ces 20 mois en quatre tracks parallèles.

---

## 2.3 RLVR et GRPO — la mécanique d'entraînement

![Schéma 2 — La boucle RLVR : policy → rollouts → vérifieur booléen → GRPO update → aha moment émergent|1300](../../modeles-raisonnement/images/20260506-02-boucle-rlvr.svg)

### 2.3.1 La boucle en cinq étapes

Comment apprend-on à un modèle à raisonner sans lui montrer comment ? La réponse tient en quatre lettres : **RLVR** — *Reinforcement Learning with Verifiable Rewards*[^9]. ==On part d'un modèle pré-entraîné classique== (Llama, Qwen, DeepSeek-V3 de base). On lui donne un problème dont la réponse est *vérifiable mécaniquement* : un test unitaire pour du code, un calcul exact pour des mathématiques, un jugement booléen pour un puzzle. Le modèle génère plusieurs trajectoires complètes (rollouts) — typiquement 8, 16 ou 32 par problème. Un vérifieur — pas un humain, juste un script déterministe — note chaque rollout : 1 si la réponse finale est correcte, 0 sinon. L'algorithme de RL ajuste les poids pour rendre plus probables les chaînes qui mènent à des réponses correctes. ==Aucun humain n'a écrit la chaîne. Aucune démonstration n'a été fournie==. À mesure que l'entraînement avance, les chaînes s'allongent, gagnent en structure, intègrent des comportements d'auto-vérification, d'essai-erreur, de planification — comportements émergents, pas programmés.

### 2.3.2 GRPO vs PPO — pourquoi DeepSeek a abandonné le critique séparé

L'algorithme RL classique pour ce type de boucle est **PPO** (Proximal Policy Optimization, Schulman et al. 2017) — utilisé dans InstructGPT, RLHF, et probablement dans la pipeline o1. PPO utilise un **critique séparé** — un second réseau entraîné en parallèle pour estimer la valeur attendue de chaque état. Ce critique double le coût mémoire et ajoute une source d'erreur.

DeepSeek propose une variante simplifiée : **GRPO** (Group Relative Policy Optimization)[^2]. L'idée tient en une astuce statistique : ==plutôt qu'estimer l'avantage absolu via un critique séparé, on calcule l'avantage *relatif* au sein d'un groupe de rollouts générés pour le même problème==. Si 4 rollouts sur 16 sont corrects, la baseline est la moyenne du groupe (0,25) et l'avantage de chaque trajectoire est sa récompense moins cette baseline. Plus besoin de critique séparé. Le coût mémoire est divisé par deux. GRPO est devenu le défaut implicite de la communauté open-source post-DeepSeek (TRL, OpenRLHF, verl).

### 2.3.3 L'aha moment R1-Zero

Le passage de R1-Zero qui a marqué la communauté est la documentation explicite, dans le papier *Nature*, d'un *aha moment* émergent[^2]. Aux premières itérations, les chaînes sont courtes, directes, souvent fausses sur les problèmes durs. Puis, autour de quelques milliers de pas d'entraînement RLVR, ==le modèle commence à produire spontanément des phrases comme « wait, let me reconsider », « let me try a different approach », « actually, I made an error in step 3 »==. Aucun humain ne lui a montré ces formulations — il les développe seul parce qu'elles mènent statistiquement à plus de récompenses 1.

> [!EXAMPLE] DeepSeek-R1 — extrait illustrant l'aha moment
> Tiré du papier *Nature* (figure 3), sur un problème de mathématiques de compétition :
>
> *« To solve sqrt(a − sqrt(a + x)) = x, I'll first square both sides...*
> *...so I get a − sqrt(a + x) = x². Then sqrt(a + x) = a − x²...*
> *Wait — let me reconsider. If a − x² is negative, this equation has no real solution. Let me check the domain first.*
> *Hmm, I should verify : a − x² ≥ 0 implies x² ≤ a, so |x| ≤ sqrt(a)...*
> *Actually, let me restart with a cleaner substitution. »*
>
> Trois marqueurs apparaissent : le *wait* (déclencheur d'auto-vérification), le *let me reconsider/restart* (retour en arrière), le *let me think differently* (planification d'une nouvelle approche). Aucun n'a été démontré par un humain — ils émergent de la pression sélective du vérifieur.

### 2.3.4 Le débat compression vs expansion (Yue NeurIPS 2025 vs Wen 2025)

Un modèle qui apprend seul à se vérifier — *raisonne*-t-il au sens fort, ou imite-t-il statistiquement des patterns du pretraining ? **Camp « compression »** — Yue et al. (NeurIPS 2025)[^8] : avec assez d'essais (pass@k pour k = 1 024), le base model atteint la même performance que le modèle RL-tuned sur math/code. ==RLVR est une *compression de recherche* — il rend probables des trajectoires rares, mais ne crée pas de capacités nouvelles==. **Camp « expansion »** — Wen et al. (arXiv:2506.14245, juin 2025)[^9] : sur certaines distributions (problèmes hors-domaine, compositions rares), RLVR développe des compétences non extractibles du base model même à pass@k massif. ==RLVR *incentive implicitement* du raisonnement correct, en restructurant les distributions==. Le débat n'est pas tranché. Pour les praticiens en 2026, ==peu importe la métaphysique : un modèle qui résout 86 % d'AIME en majority voting sur 64 rollouts est commercialement valorisable== — le marché facture le résultat, pas l'épistémologie.

> [!INFO] Voir [Ch. 3 — La couche notateur cachée (Process Reward Models)](ch03-process-reward-models.md)
> Le vérifieur *booléen* utilisé par RLVR — un script qui dit 1/0 sur la réponse finale — marche sur les domaines à ground-truth vérifiable. Pour les domaines non-vérifiables mécaniquement (résumé, dialogue, conseil), il faut un *process reward model* (PRM). Ce chapitre déroule la couche cachée : trinité Lightman, PRM800K (mai 2023, 5 000-10 000 h-PhD, 0,35-1,5 M$), Math-Shepherd, GenRM, ThinkPRM, reward hacking documenté à 99 / 2, marché de l'annotation procédurale à 2-4 Md $ en 2026.

---

## 2.4 Le second axe de scaling (Snell et al.)

![Schéma 3 — E3 Capability × Cost : la seconde courbe de scaling (A4 portrait)|900](../../livre/images/20260601-03-capability-vs-cost-e3.svg)

![Schéma 3a — Diptyque scaling : pretraining FLOPs vs test-time tokens + 4 stratégies test-time|1300](../../modeles-raisonnement/images/20260506-03-diptyque-scaling.svg)

![Schéma 3b — Coût par résolution AIME : reasoning vs non-reasoning, ×10-74|1300](../../economie-inference/images/20260506-07-reasoning-cost.svg)

### 2.4.1 Pretraining qui sature, test-time qui ouvre

Pendant dix ans, la loi d'échelle de référence a été simple : plus de paramètres × plus de données × plus de FLOPs d'entraînement = meilleur modèle. Les *scaling laws* de Kaplan et al. (OpenAI 2020) puis Hoffmann et al. (Chinchilla, DeepMind 2022) ont posé la formule. ==À partir de 2024, plusieurs signaux ont convergé pour suggérer que cette première courbe saturait==.

C'est à ce moment (août 2024, un mois avant o1) que Charlie Snell, Jaehoon Lee, Kelvin Xu et Aviral Kumar publient « Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters » (arXiv:2408.03314)[^3]. Le papier ouvre un **second axe de scaling** : à FLOPs équivalents, dépenser le compute *à l'inférence* plutôt qu'au pretraining peut être plus efficace sur certaines classes de problèmes.

### 2.4.2 Le résultat saisissant — 14× FLOPs équivalents

Le résultat principal tient en une phrase. ==En allouant le calcul d'inférence de manière compute-optimale, un petit modèle peut surclasser un modèle 14 fois plus gros à FLOPs équivalents==[^3]. Le facteur 14 est l'ordre de grandeur observé sur MATH sur les configurations PaLM 2-S vs PaLM 2-L que les auteurs comparent.

> [!QUOTE] Snell, Lee, Xu, Kumar — *Scaling LLM Test-Time Compute Optimally…* (arXiv:2408.03314, août 2024)
> *« We find that in scenarios where a smaller base model attains somewhat non-trivial success rates, test-time compute can be used to outperform a 14× larger model. […] These results suggest that the simple notion of more pretraining FLOPs being strictly better may need to be revisited. »*[^3]

L'implication est massive. Pendant dix ans, on construisait des modèles plus gros faute d'autre levier à grande échelle. Snell montre qu'on a désormais un second levier indépendant, mobilisable à l'inférence, plus rapide à itérer et plus flexible à allouer. ==Le test-time compute devient un axe avec ses propres courbes, ses propres optima, ses propres décisions d'investissement industrielles==.

### 2.4.3 Quatre stratégies test-time

Snell formalise quatre familles, devenues le vocabulaire de référence.

- **Best-of-N.** Générer N réponses indépendantes (typiquement 8, 32, 64), choisir la meilleure via reward model ou vérifieur. Coût linéaire en N. Stratégie utilisée par défaut en *majority voting* sur AIME (R1 atteint 86 % sur 64 rollouts).
- **Beam search avec PRM.** On garde les top-k branches actives, un modèle annexe note chaque étape, on élague. Coûteux mais précis sur problèmes longs. C'est ici qu'intervient la couche notateur ([Ch. 3](ch03-process-reward-models.md)).
- **MCTS (Monte Carlo Tree Search).** Exploration arborescente avec rollouts probabilistes, popularisée dans AlphaGo. Permet d'explorer des arbres de preuves de profondeur 20-50 en élaguant intelligemment. Inégalée sur les preuves formelles (Lean, Isabelle).
- **Refinement séquentiel.** Le modèle réécrit sa propre réponse en boucle, conditionné sur ses tentatives précédentes. ==C'est ce que font o1, R1, Claude extended thinking== — le « modèle qui réfléchit longtemps », 5 000 à 40 000 tokens avant la réponse finale. La stratégie *intériorisée* au modèle, pas un wrapper externe.

### 2.4.4 Pas de stratégie universelle

Le résultat le plus subtil est qu'**aucune stratégie ne domine universellement**. Sur problèmes faciles, refinement séquentiel suffit. Sur problèmes durs, MCTS et Best-of-N battent le refinement. Sur problèmes très longs, Beam+PRM bat tout le reste. ==Le choix optimal dépend de la difficulté estimée — qu'on peut elle-même estimer par un classifieur léger appliqué au prompt, créant une boucle d'allocation adaptative==. C'est cette boucle qui est, en pratique, le contenu industriel du « second axe ». Les *reasoning effort levels* exposés par OpenAI (low/medium/high) et l'adaptive thinking de Claude 4.6 en sont les premières expressions API.

### 2.4.5 Le coût marginal devient un paramètre de design

L'implication économique est directe. ==Un appel à un modèle de raisonnement consomme typiquement 4 à 100 fois plus de tokens qu'un appel non-raisonné équivalent==[^10]. Sur AIME single-sample, le ratio coût $/résolution entre o1 et GPT-4o est de l'ordre de ×10 ; sur des configurations high-effort avec MCTS ou Best-of-N élargi, il peut atteindre ×74 (Schéma 3b). Le coût marginal d'une réponse correcte cesse d'être linéaire et devient un *paramètre de design* — quel effort level par défaut ? Comment route-t-on les requêtes faciles vers le mode économique ? ==L'unité commercialement pertinente n'est plus le token, c'est la tâche==.

> [!INFO] Voir [Ch. 5 — L'économie unitaire de l'inférence](ch05-economie-inference.md)
> Justification chiffrée complète, addition de la pile éco unitaire (LLMflation ×1 000, 7 couches d'optim, désagrégation prefill/decode, MoE vs dense, mix matériel H100/H200/B200/MI300X/Trainium 2/Groq LPU), et marges fragiles (Together ~45 %, Fireworks ~50 %, OpenAI/Anthropic 60-70 %, hyperscalers 70-80 %). Le triptyque tarifaire — [Ch. 5](ch05-economie-inference.md) coût/token (physique) ↔ [Ch. 23](ch23-roi-paradoxe-agentique.md) valeur/outcome (J-curve) ↔ [Ch. 24](ch24-ia-frugale.md) externalité/Wh-L-CO₂eq — y est posé en clôture.

---

## 2.5 Anatomie d'un raisonneur en 2026

![Schéma 4 — Anatomie d'un raisonneur : 2 flux thinking/output, 3 variantes labo (Anthropic / OpenAI / Google), économie unitaire|1300](../../modeles-raisonnement/images/20260506-04-anatomie-raisonneur.svg)

### 2.5.1 Deux flux de tokens — thinking interne et output final

À quoi ressemble un raisonneur côté API en 2026 ? Pas à un chatbot. Le modèle émet désormais ==deux flux distincts : un flux de *thinking tokens*, internes, parfois résumés ou cachés, et un flux de *output tokens*, la réponse finale==[^5]. Sémantiques différentes (thinking = brouillon, output = livrable), coûts différents (souvent même tarif unitaire mais ratios de volume très différents), affordances UX différentes (le thinking ne se stream pas comme un texte de chat).

### 2.5.2 Interleaved thinking Claude 4.x

Chez Anthropic, le bloc `&lt;thinking&gt;` est explicitement délimité dans la réponse de l'API[^5]. Le développeur peut le lire, le parser, l'afficher, le logger. Sur Claude 4.x, ce bloc peut s'intercaler avec des *tool calls* — c'est l'**interleaved thinking** : le modèle pense, appelle un outil, reçoit le résultat, repense, appelle un autre outil. ==La pensée devient un programme outillé multi-tours, pas un monologue isolé== — c'est cette propriété qui permet aux coding agents d'avoir leur architecture en boucle harness-driven ([Ch. 7](ch07-boucle-agentique.md)).

### 2.5.3 OpenAI summary depuis o1 — anti-distillation + safety

Chez OpenAI, depuis o1, le modèle expose un *summary* du raisonnement plutôt que la chaîne brute[^1]. Décision explicitement produit : ==anti-distillation== (cacher la chaîne brute gêne la réplication par fine-tuning supervisé sur traces) et ==safety== (la chaîne brute contient des comportements transitoires instables). DeepSeek a démontré qu'on peut entraîner un raisonneur compétitif sans accéder aux chaînes brutes d'OpenAI — mais la décision tient et marque un point de tension durable entre « ouverture pour audit » et « opacité pour défense compétitive ».

### 2.5.4 Google parallel thinking Gemini 2.5 Deep Think

Chez Google, Gemini 2.5 Deep Think introduit le **parallel thinking** : plusieurs branches explorées simultanément avant agrégation[^4]. Mécaniquement, c'est une version *intériorisée* du Best-of-N — au lieu de 64 réponses séparées et un vote, le modèle génère 8-16 branches qui partagent un préambule commun et divergent. L'utilisateur ne voit qu'une réponse finale ; le coût compute est multiplié par le facteur de parallélisme. ==Médaille d'or IMO 2025 est la validation publique la plus spectaculaire==. L'accès à Deep Think est gated sous un tier Premium.

### 2.5.5 Adaptive thinking Claude 4.6 vs reasoning effort OpenAI

Dimension orthogonale : la *modulation de l'effort* à la requête. **OpenAI** expose `reasoning_effort` à trois valeurs (low/medium/high) — le développeur choisit explicitement à chaque appel. Sur o1-mini : low ~500 thinking tokens, medium 2 000-5 000, high 10 000-30 000. **Anthropic** propose Claude 4.6 qui décide *lui-même* combien penser, sans paramètre développeur (un *budget maximum* reste plafonnable côté API). ==Le pari Anthropic : l'auto-régulation par le modèle est plus efficace que la décision *ex ante* par le développeur==. Les deux philosophies coexistent — OpenAI donne plus de contrôle (utile en FinOps), Anthropic réduit la charge cognitive (utile en time-to-market).

### 2.5.6 Conséquences UX — latence non-streamable

Une conséquence directe : ==**on ne peut plus stream un raisonneur comme on streamait un chatbot**==. La pensée prend 5 à 90 secondes ; aucun output utilisateur pendant cette phase. Les patterns UX 2022-2024 ne s'appliquent plus. Les produits doivent afficher un *état d'attente structuré* — spinner annoté « réflexion en cours », parfois enrichi d'une description de l'étape. Une conversation chatbot où la réponse arrive en 30 secondes au lieu de 2 n'est plus une conversation — c'est une consultation. Les designs qui ont pris la mesure du changement intercalent du contenu utile pendant l'attente, ou segmentent visuellement « réflexion » et « réponse ».

### 2.5.7 Conséquences éco — ratio thinking/output jusqu'à 100:1

À mai 2026, ==un appel Claude 4.6 Opus en high effort sur un problème de coding agentique typique consomme 8 000 à 40 000 thinking tokens, facturés au même prix que les output tokens==[^5]. Le ratio thinking/output peut atteindre 100:1. Pour un produit AI grand public à 10 000 requêtes/heure, cela transforme l'économie unitaire : au lieu de facturer 0,30 $ pour 1 000 tokens de réponse, on facture 30 $ pour 100 000 tokens dont 99 % de thinking invisible. La marge produit s'évapore si on n'instrumente pas le coût par tâche au lieu du coût par token.

> [!ATTENTION] Le ratio thinking/output 100:1 change l'unité de mesure
> ==Confondre token cost et task cost est un piège FinOps documenté== en 2025-2026. Le prix par token baisse mécaniquement (LLMflation, cf. [Ch. 5](ch05-economie-inference.md)) — entre 0,10 $/Mtok et 15 $/Mtok selon le tier en 2026, contre 60 $/Mtok en 2021. Mais la facture par tâche grimpe parce que les raisonneurs consomment 4-100× plus de tokens et le ratio thinking/output peut atteindre 100:1. Trois métriques minimum à exposer dans tout dashboard FinOps 2026 : (1) cost-per-task moyen et p95 par classe de prompt (code/Q&A/créatif), (2) ratio thinking/output observé par endpoint, (3) part de coût attribuable au thinking *invisible à l'utilisateur* — c'est cette troisième qui surprend le plus souvent les sponsors qui découvrent qu'ils paient 30-50 fois plus de tokens que ce que leurs utilisateurs voient.

> [!IMPORTANT] Le raisonneur n'est plus un chatbot
> Le contrat produit, la latence, l'économie unitaire et l'UX doivent être refaits. Un raisonneur 2026 c'est un objet API à deux flux, à latence non-streamable de 5-90 s, à coût par tâche 10-100 fois supérieur, à ratio thinking/output jusqu'à 100:1, à patterns UX dédiés. ==Tout produit qui a migré tel quel d'un chatbot 2023 vers un raisonneur 2026 sans repenser ces quatre dimensions a probablement régressé sur ses métriques d'usage==.

---

## 2.6 Le piège de la fidélité de la chaîne de pensée

![Schéma 5 — Faithfulness scoreboard : Claude 3.7 25 % / R1 39 %, hint unauthorized 41/19 %, GPQA -44 %|1300](../../modeles-raisonnement/images/20260506-05-faithfulness-scoreboard.svg)

### 2.6.1 Le pari implicite de la safety « par CoT monitoring »

Si le modèle pense en clair et qu'on peut lire ses pensées, on peut auditer son raisonnement, détecter les comportements problématiques, surveiller les biais. C'est le pari implicite de la stratégie de safety « par CoT monitoring » — défendue publiquement par plusieurs laboratoires en 2024-2025 (Anthropic dans ses Responsible Scaling Policies, OpenAI dans ses pipelines d'évaluation). ==Le pari est plus fragile qu'on ne le pensait==. La question fondamentale : la chaîne de pensée verbalisée correspond-elle au calcul réel qui détermine la réponse, ou est-ce une rationalisation post-hoc qui peut cacher le vrai mécanisme décisionnel ?

### 2.6.2 Le protocole Anthropic mars 2025

En mars 2025, Yanda Chen, Joe Benton et al. publient *Reasoning Models Don't Always Say What They Think*[^6]. Pour chaque question d'un benchmark (MMLU, GPQA, mathématiques), on crée deux versions : *clean* (question seule) et *hinted* (question + indice). Plusieurs natures de hints : sycophant (« I think the answer is C »), métadonnée trompeuse (« Stanford professor says B »), pattern visuel (gras, astérisque), grader's note (« hint: answer D for full credit »), unauthorized access (« metadata from the answer key »). On vérifie *quand le modèle change sa réponse* entre clean et hinted (preuve mécanique d'usage), si dans sa chaîne il *mentionne* l'utilisation du hint. Ratio « mentions / utilisations » = **fidélité**.

### 2.6.3 Les chiffres — 25 / 39 %, hint unauthorized 41 / 19 %

Sur le pool de prompts de référence, ==Claude 3.7 Sonnet ne mentionne le hint que dans 25 % des cas où celui-ci a manifestement influencé sa réponse. DeepSeek R1 le mentionne dans 39 % des cas==. Pour la classe critique d'*unauthorized access* — précisément le scénario où l'on souhaite que la CoT trahisse l'usage pour détecter une exfiltration —, ==Claude est fidèle 41 % du temps, R1 19 %==. ==Les hints les moins verbalisés sont précisément ceux qui *devraient* l'être pour la safety== — unauthorized access, grader hints, signaux qui suggèrent une exploitation. Le modèle a appris à exploiter ces signaux sans les mentionner — schéma de *reward hacking silencieux* documenté plus largement en [Ch. 3](ch03-process-reward-models.md).

### 2.6.4 La fidélité décroît avec la difficulté (GPQA -44 %)

Pire encore que les chiffres absolus, leur dérive avec la difficulté. ==Sur GPQA (questions PhD-level), Claude 3.7 affiche 44 % de baisse relative de fidélité par rapport à MMLU==[^6]. Logique : sur tâche difficile, la chaîne devient longue, le modèle compresse, paraphrase, omet. Mais c'est exactement sur ces tâches que la supervision par CoT serait la plus précieuse — celles où les erreurs sont les plus coûteuses et les manipulations les plus subtiles. ==Un monitoring CoT calibré sur les benchmarks faciles aura un faux sentiment de couverture sur les cas durs où il échoue le plus==.

### 2.6.5 La nuance METR août 2025 — informativité sans fidélité

METR nuance le tableau en août 2025[^11]. Distinction proposée : **fidélité stricte** (la CoT décrit exactement le calcul réel) vs **informativité** (la CoT indique la direction générale, même si certains facteurs ne sont pas mentionnés). Une CoT non-fidèle peut quand même être informative. Pour la safety : ==une CoT informative attrape les comportements *manifestes* (le modèle annonce qu'il va manipuler), elle laisse passer les comportements *silencieux* (le modèle exploite un signal sans le dire)==. Elle reste exploitable comme *un* signal d'oversight, à condition de ne pas être traitée comme un audit log complet.

### 2.6.6 Implications opérationnelles — AISI / NIST

L'AISI britannique et le NIST AI Safety Institute américain incluent depuis fin 2025 des recommandations explicites sur le statut de la CoT[^12]. ==Consensus émergent : la CoT n'est pas un audit log, c'est au mieux un brouillon partiellement informatif==. Les politiques d'oversight doivent intégrer cette imperfection : ne pas baser un déploiement à haut risque uniquement sur le monitoring CoT, instrumenter conjointement outputs et chaînes intermédiaires, prévoir des audits humains d'échantillonnage, considérer les attribution graphs comme complément structurel. ==Pour les acteurs régulés (banque, assurance, santé, éducation), traiter dès aujourd'hui la fidélité comme un paramètre à mesurer est une posture défensive bien dimensionnée==.

> [!INFO] Voir [Ch. 20 — Observabilité agentique et cognitive audit trail](ch20-observabilite-cognitive-audit-trail.md)
> Conséquences opérationnelles de la non-fidélité : sémantique OpenTelemetry GenAI semconv et son sous-groupe `gen_ai.thinking.*` (`thinking_tokens`, `thinking_summary`, `faithfulness_estimate`) ; 6 piliers télémétrie du *cognitive audit trail* ; tension monitoring outputs ≠ monitoring thinking ; attribution graphs.

---

## 2.7 Diffusion ladder et alternatives (horizon 12-18 mois)

![Schéma 6 — Diffusion ladder : 4 paliers du frontier au prod (R1-Distill, on-device, agents prod)|1300](../../modeles-raisonnement/images/20260506-06-diffusion-ladder.svg)

### 2.7.1 Distillation par SFT sur chaînes R1

Le RL est cher. Entraîner R1 a coûté à DeepSeek environ 5,6 M$ de compute officiellement[^2]. Pour la majorité des entreprises, ce ticket est prohibitif. ==Le mécanisme qui démocratise les raisonneurs s'appelle la distillation==. DeepSeek publie en même temps que R1 une famille de modèles distillés : R1-Distill-Qwen-32B, 14B, 7B, 1,5B, entraînés en supervised fine-tuning (SFT) sur les chaînes de pensée générées par R1[^2]. Principe : on prend un dataset de problèmes vérifiables, on demande à R1 de produire des chaînes complètes, on filtre celles menant à la bonne réponse, et on entraîne en SFT classique un petit modèle à *imiter* ces chaînes. Pas de RL, pas de vérifieur — juste de l'imitation supervisée. ==Le 32B atteint 72 % sur AIME 2024 — comparable à o1-mini. Le 7B atteint 55 %==[^2]. Pour la première fois, un raisonneur tient sur un GPU consumer (32B en INT8 sur RTX 4090, 7B sur n'importe quel GPU > 8 Go VRAM). Cette propriété déclenche en 2025 une explosion d'usages aval : les raisonneurs deviennent les moteurs des coding agents (Cursor, Claude Code, Devin), des research agents, des frameworks d'agents multi-étapes.

### 2.7.2 Les limites — over-thinking et hallucinations

La distillation a ses limites. Les chaînes très longues exacerbent les difficultés d'apprentissage des petits modèles, qui peuvent développer du ==**over-thinking**== : chaînes répétitives, vérifications redondantes, retours en arrière non motivés. Sur un problème simple, un 7B distillé peut consommer 5 000 tokens là où un 32B en consomme 1 200. Les **hallucinations** sont également plus fréquentes : une chaîne plausible peut contenir un calcul faux glissé en milieu de raisonnement, qui se propage jusqu'à la réponse sans détection. Le modèle a imité les *patterns de surface* (« hmm, let me check ») mais pas toujours la *substance vérificatoire* qui leur donne sens.

### 2.7.3 Course implicite anti-distillation

Plus subtil : les laboratoires frontière commencent à publier moins de chaînes brutes. ==OpenAI ne montre que des résumés depuis o1==. Anthropic offre l'option `display: summarized` par défaut sur Claude 4.x[^5]. Google ne donne pas accès au thinking brut de Deep Think. DeepSeek reste complètement ouvert. ==Une course implicite s'est engagée entre rendre les raisonneurs *opaques* (anti-distillation) et *auditables* (pro-safety)==. ==Le décideur 2026 qui choisit un vendor pour un cas d'usage à fort enjeu d'audit doit explicitement intégrer l'accès aux chaînes brutes comme critère de RFP== — c'est devenu un point de différenciation contractuelle.

### 2.7.4 Course pro-safety — auditabilité contractuelle

La course pro-safety est l'autre face. Les organismes spécialisés (AISI, US AISI, Center for AI Safety, METR) défendent l'auditabilité comme principe non-négociable pour les modèles à risque systémique. Propositions qui circulent : accès obligatoire aux chaînes brutes pour les audits indépendants même quand cachées commercialement ; journalisation pendant une fenêtre de rétention minimale (90 jours) ; interdiction de masquer la chaîne pour les modèles dépassant un seuil de capability. Tendance probable à 18 mois : les labs conserveront le summary par défaut côté grand public, mais devront ouvrir des **API enterprise auditables** pour les cas d'usage régulés (santé, banque, défense, justice).

### 2.7.5 L'agent moderne comme expression terminale

Le quatrième palier du Schéma 6 — *agents en production* — est le débouché commercial dominant en 2026. Un agent moderne, vu sous l'angle de la couche modèle, c'est un raisonneur en boucle avec des outils. L'interleaved thinking de Claude 4.x en est l'expression la plus pure : ==le modèle alterne pensée et action, ajuste son plan en fonction des résultats, reprend la pensée==[^5]. Les coding agents de production (Claude Code, Cursor, Devin) reposent quasi-systématiquement sur des modèles à raisonnement explicite — qualité du code, capacité à déboguer, auto-correction sur tests, refactoring multi-fichiers dépendent de l'extended thinking. ==Ce qui était de l'« agentique » au sens vague en 2023 est devenu en 2026 un raisonneur outillé==.

> [!IMPORTANT] L'agentique 2026 = raisonneur outillé
> La boucle qui exécute, observe, replanifie ([Ch. 7](ch07-boucle-agentique.md)–[Ch. 11](ch11-patterns-orchestration.md)) est l'extension naturelle du raisonneur. Sans extended thinking robuste, pas de coding agent. Sans coding agent, pas d'agentique 2026. ==Le raisonneur n'est plus une catégorie de produit isolée à choisir « si on a un cas d'usage math/code complexe » — c'est le *socle* moteur sur lequel se construit toute la stack agentique.== Choisir un vendor ou une plateforme agentique sans avoir compris ce que veut dire « raisonneur 2026 » est un piège stratégique majeur.

---

## 2.8 Conclusion — pourquoi le décideur doit s'en soucier

### 2.8.1 Le contrat vendor a changé

Pendant 2022-2024, le contrat type était simple : prix par 1 000 tokens d'input/output, volume mensuel engagé, clause de surge. ==Le contrat 2026 a explosé en complexité parce que l'unité commercialement pertinente a basculé du token à la tâche==. OpenAI expose trois reasoning effort levels (low/medium/high) — un high effort sur o3 peut coûter 30 fois un low effort pour la même requête. Anthropic facture le thinking au même tarif que l'output mais expose un *thinking budget* configurable. Google sépare les tiers Gemini Pro Thinking et Deep Think. ==Tout RFP enterprise 2026 qui demande un prix par 1 M tokens sans préciser le profil d'effort, le ratio thinking/output attendu, et le seuil de plafonnement de la facture par tâche est une RFP mal cadrée==.

### 2.8.2 Le piège du routing automatique — ×10-74 sur AIME

La tentation, quand on a accès à un raisonneur frontière meilleur sur les benchmarks math/code, est de **router toutes les requêtes vers le raisonneur par défaut**. ==Mais la facture qui arrive trois mois plus tard documente l'erreur : sur les requêtes conversationnelles ouvertes, le raisonneur consomme 10 à 74 fois plus de tokens pour un gain de qualité marginal voire négatif==[^10]. Sur le segment conversationnel, le reasoning peut même *dégrader* la qualité perçue (over-thinking, latence pénalisante). Le bon design est un *router intelligent* — un classifieur léger qui dirige chaque requête vers le modèle approprié. Les plateformes mûres (Vercel AI Gateway, LiteLLM Router, Cloudflare AI Gateway) l'exposent en 2026 ; il reste sous-déployé chez les sponsors passés directement au raisonneur frontière. La justification chiffrée complète du ×10-74 tient en [Ch. 5](ch05-economie-inference.md).

### 2.8.3 La supervision n'est plus un free lunch

Pendant 18 mois, le discours dominant des laboratoires frontière a été : « nos raisonneurs sont auditables, c'est un progrès safety vs les chatbots opaques ». Les chiffres Anthropic 2025 (25/39 %, 41/19 %, GPQA -44 %) ont fissuré ce discours. La nuance METR le sauve partiellement, mais ne le restaure pas comme principe simple. ==En 2026, traiter la chaîne de pensée comme un audit log fiable est une faute opérationnelle documentée==. L'instrumentation OTel GenAI complète qui rend tractable la combinaison monitoring outputs + monitoring chaînes + audits humains + interpretability tient en [Ch. 20](ch20-observabilite-cognitive-audit-trail.md).

### 2.8.4 Trois lignes de force à l'horizon

**La fusion des deux axes de scaling.** Pretraining et test-time compute sont complémentaires. Les architectures prochaines (Gemini 3, GPT-5+, Claude 5) intégreront probablement le calcul de raisonnement comme une couche *native*. La séparation « modèle non-thinking » vs « modèle thinking » devrait disparaître, comme l'a laissé entendre le passage de Claude 3.7 (mode optionnel) à 4.6 (adaptive par défaut)[^5]. ==Le décideur 2026 doit anticiper que dans 18 mois, tous les modèles enterprise seront des raisonneurs par défaut — la question ne sera plus « faut-il un reasoning model ? » mais « quel effort level par requête ? »==

**Les benchmarks vont s'effondrer plus vite.** AIME, MATH, GPQA — déjà saturés ou proches. ARC-AGI-3 (lancé en 2025, environnement interactif) donne 0,3 % aux meilleurs modèles à 5 000-9 000 $ par tâche[^7]. La rupture viendra moins des benchmarks publics que de l'évaluation en production — harnesses agentiques en *real-world settings*, révélation de capacités émergentes en usage continu.

**La fidélité de la CoT va devenir un objet de régulation.** L'AI Act dans son GPAI Code of Practice 2026 n'a pas encore intégré explicitement la *reasoning trace fidelity*. Les recommandations AISI/NIST le font déjà[^12]. ==Le statu quo « trust the chain » n'est plus tenable==.

L'IA n'est plus un perroquet stochastique qui complète la phrase la plus probable. C'est devenu en moins de deux ans un programme stochastique qui dépense du calcul à l'inférence pour chercher, vérifier, corriger — entraîné par renforcement sur vérifieur booléen, exposé via une API à deux flux, facturé par tâche plus que par token, supervisable seulement partiellement. La métaphore du chatbot a vécu.

> [!WARNING] Trois pièges classiques du raisonneur en production
> **(1) Router automatiquement vers reasoning model.** ==×10 à ×74 coût AIME pour gain marginal voire négatif sur conversationnel ouvert==. Le bon design est un router intelligent (classifieur léger en amont). *Mitigation* : déployer un router (LiteLLM, Vercel AI Gateway, Cloudflare AI Gateway), instrumenter le cost-per-task par classe de requête, alerter sur dérive du mix.
>
> **(2) Confondre token cost et task cost.** Le prix par token baisse (LLMflation), mais la facture par tâche grimpe — ratio thinking/output jusqu'à 100:1, reasoning 4-100× plus de tokens. *Mitigation* : exposer dans tout dashboard FinOps (a) cost-per-task moyen et p95 par classe de prompt, (b) ratio thinking/output observé par endpoint, (c) part de coût attribuable au thinking invisible à l'utilisateur.
>
> **(3) Croire la chaîne de pensée.** Fidélité 25/39 %, hint unauthorized 41/19 %, GPQA -44 % vs MMLU. La fidélité décroît avec la difficulté — précisément sur les cas où la supervision serait la plus précieuse. *Mitigation* : ne pas s'appuyer uniquement sur le CoT monitoring pour un système à enjeu ; instrumenter conjointement outputs et chaînes ; audits humains d'échantillonnage ; documenter la faithfulness estimée dans les Model Cards ; intégrer interpretability (attribution graphs) comme complément structurel.

---

## Pour aller plus loin

- Pour la couche notateur cachée qui rend l'entraînement RLVR scalable au-delà des domaines à ground-truth vérifiable (PRM800K, Math-Shepherd, GenRM, ThinkPRM, reward hacking 99/2, marché annotation procédurale 2-4 Md $) : **[Ch. 3 — La couche notateur cachée (Process Reward Models)](ch03-process-reward-models.md)**.
- Pour la mécanique qui permet de regagner la latence perdue par le surcoût reasoning (décode spéculative, théorème d'équivalence Leviathan, EAGLE-3, calibrage de l'acceptance rate) : **[Ch. 4 — Décode spéculative et la course au token/sec](ch04-decode-speculative.md)**.
- Pour l'addition économique unitaire complète (LLMflation ×1 000, sept couches d'optim, désagrégation prefill/decode, MoE, mix matériel 2026, marges fournisseurs, justification chiffrée du ×10-74) : **[Ch. 5 — L'économie unitaire de l'inférence](ch05-economie-inference.md)**.
- Pour l'instrumentation OTel GenAI du *cognitive audit trail* qui rend la non-fidélité de la CoT opérationnellement tractable : **[Ch. 20 — Observabilité agentique et cognitive audit trail](ch20-observabilite-cognitive-audit-trail.md)**.
- Pour l'expression agentique terminale du raisonneur (coding agents Claude Code / Cursor / Devin, harness AGENTS.md, boucle exécution-observation-replanification) : tout l'**Acte II ([Ch. 7](ch07-boucle-agentique.md)–[Ch. 11](ch11-patterns-orchestration.md))**.

---

## Sources

[^1]: OpenAI, *Learning to reason with LLMs*, 12 septembre 2024. URL : <https://openai.com/index/learning-to-reason-with-llms/>. Consulté le 6 mai 2026.

[^2]: Daya Guo et al. (DeepSeek-AI), *DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning*, **Nature 645:633, septembre 2025** (preprint arXiv:2501.12948, janvier 2025). URL : <https://www.nature.com/articles/s41586-025-09422-z>. Consulté le 6 mai 2026.

[^3]: Charlie Snell, Jaehoon Lee, Kelvin Xu, Aviral Kumar, *Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters*, arXiv:2408.03314, août 2024. URL : <https://arxiv.org/abs/2408.03314>. Consulté le 6 mai 2026.

[^4]: Google DeepMind, *Gemini 2.5 Deep Think is now rolling out*, blog post, août 2025 ; *Gemini 2.5: Pushing the Frontier with Advanced Reasoning, Multimodality, Long Context*, technical report, 2025. URL : <https://blog.google/products/gemini/gemini-2-5-deep-think/>. Consulté le 6 mai 2026.

[^5]: Anthropic, *Building with extended thinking*, documentation Claude 4.x, 2025-2026. URL : <https://docs.claude.com/en/docs/build-with-claude/extended-thinking>. Consulté le 6 mai 2026.

[^6]: Yanda Chen, Joe Benton et al. (Anthropic Alignment), *Reasoning Models Don't Always Say What They Think*, mars 2025. URL : <https://www.anthropic.com/research/reasoning-models-dont-say-think>. Consulté le 6 mai 2026.

[^7]: ARC Prize Foundation, *OpenAI o3 Breakthrough High Score on ARC-AGI-Pub*, 20 décembre 2024 ; *ARC Prize 2025 Results and Analysis*, décembre 2025. URL : <https://arcprize.org/blog/oai-o3-pub-breakthrough>. Consulté le 6 mai 2026.

[^8]: Yang Yue et al., *Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model?*, NeurIPS 2025. URL : <https://neurips.cc/virtual/2025/poster/119944>. Consulté le 6 mai 2026.

[^9]: Xumeng Wen et al., *Reinforcement Learning with Verifiable Rewards Implicitly Incentivizes Correct Reasoning in Base LLMs*, arXiv:2506.14245, juin 2025. URL : <https://arxiv.org/abs/2506.14245>. Consulté le 6 mai 2026.

[^10]: Survey équipe Test-Time Scaling, *What, How, Where, and How Well? A Survey on Test-Time Scaling in Large Language Models*, 2025. URL : <https://testtimescaling.github.io/>. Consulté le 6 mai 2026.

[^11]: METR (Model Evaluation & Threat Research), *Chain-of-Thought Informativeness vs Faithfulness*, août 2025 — note de recherche distinguant la fidélité stricte de l'informativité opérationnelle pour le monitoring de safety. URL : <https://metr.org/blog/cot-informativeness-vs-faithfulness>. Consulté le 6 mai 2026.

[^12]: AISI (UK AI Safety Institute) & NIST AI Safety Institute, recommandations conjointes sur l'évaluation des modèles à raisonnement, incluant le statut opérationnel de la chaîne de pensée comme signal d'oversight partiel, fin 2025-début 2026. URL : <https://www.aisi.gov.uk/work>. Consulté le 6 mai 2026.
