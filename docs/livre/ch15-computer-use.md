# Chapitre 15 — Computer use : le régime extrême

> **Acte III — Les interfaces · Chapitre standard, ~18 pages**
> _Le Ch.14 a posé les quatre régimes d'accès et cadré l'on-behalf-of comme régime UX. Ce chapitre zoome sur le sous-régime extrême : **le pilotage d'écran**. Quand l'agent voit ce que voit l'humain, et clique comme cliquerait l'humain, la boucle change de forme, l'économie change de profil, et la surface d'attaque change qualitativement. La saturation symbolique d'OSWorld par OSAgent en octobre 2025 — premier système au-dessus du baseline humain — coexiste avec le cliff UI-CUBE (87 % → 32 % sur les workflows enterprise complexes) ; ce chapitre tient les deux courbes en même temps._

> [!QUESTION] Question d'ouverture
> Anthropic inaugure la catégorie en publiant *computer use* sur Claude 3.5 Sonnet le 22 octobre 2024[^1] ; en dix-huit mois, le score état de l'art OSWorld passe de 12,2 % (avril 2024) à **76,26 %** (OSAgent, octobre 2025) — premier dépassement du baseline humain ~72 %[^4][^5]. Au même moment, UI-CUBE (UiPath, novembre 2025) mesure une chute de 68–87 % à **15–32 %** entre tâches simples et tâches enterprise complexes — *« limitation architecturale fondamentale »*, pas un déficit de prompting[^6]. Et un même agent, rejoué dix fois sur la même tâche, produit dix trajectoires divergentes[^42]. Si la promesse a tenu sur le benchmark et craqué sur le terrain au même trimestre, qu'est-ce qu'on industrialise vraiment ?

> [!TLDR] TL;DR décideur
> - ==La rupture a été rapide mais inégale.== OSWorld franchit le baseline humain (oct.2025), OSAgent à 76,26 % ; mais UI-CUBE révèle un cliff 87 % → 32 % sur les workflows enterprise complexes — limitation architecturale, pas de prompting. La conversation 2026 n'est plus *capability* mais *operational reliability*, *latency cost*, *attack surface*.
> - **Cinq phases dans la boucle**, pas quatre. Observe · plan · ground · act · **verify** — le cinquième nœud, longtemps optionnel, est ce qui explique le résultat superhumain d'OSAgent (auto-vérification temps réel + retry sur étape ratée). Sans verify, les erreurs se composent catastrophiquement.
> - ==Trois architectures concurrentes en 2026.== *(i)* vision pure (Claude computer use, UI-TARS-1.5), *(ii)* vision + parseur dédié (OmniParser + LLM, Agent S2), *(iii)* agent intégré perception-action (UI-TARS-2, Magma Microsoft). Aucune ne domine — convergence prévue 18-24 mois vers (iii).
> - **La latence est le coût caché plus que la précision.** 30 s humain vs 12 min Agent S2 = **ratio 24×**, dont 75–94 % consommés par les appels LLM de planification/réflexion[^7]. L'usage dominant en prod est l'automatisation arrière-plan (66 % tolèrent minutes, 17 % no limit selon enquête prod 2026[^43]) — pas l'interaction temps-réel.
> - ==Surface d'attaque qualitativement inédite.== VPI (Visual Prompt Injection) jusqu'à **51 % de succès contre les CUA et 100 % contre les BUA** sur certaines plateformes[^8]. CVE-2025-55322 OmniParser (septembre 2025) : le control plane qui pilote la VM devient un vecteur RCE[^9]. Ces deux verticales nouvelles s'ajoutent au threat model unifié E4 du Ch.19 — la matrice MCP du Ch.13 ne les couvre pas.

---

## 15.1 La place de ce chapitre — le sous-régime extrême de l'on-behalf-of

### 15.1.1 Du régime 4 (Ch.14) au pilotage écran

Le Ch.14 a posé quatre régimes d'accès — chat, copilote inline, canvas génératif, agent on-behalf-of. Le régime 4 a quatre sous-familles : browser agents, engineering agents, vertical agents, enterprise workflow agents. Ce chapitre traite **une fraction précise** de la première sous-famille : ==les agents qui pilotent un écran *comme un humain*, sans API métier intermédiaire, via les primitives standard d'un système d'exploitation ou d'un navigateur (curseur, clics, clavier, scroll, zoom)==.

C'est la frontière qui définit la catégorie *computer use* (CUA, pour *Computer-Using Agent*). Un agent qui appelle une API REST n'est pas un CUA ; un agent qui clique dans une UI Salesforce sans connecteur dédié l'est. La distinction est consequentielle : un CUA hérite **toutes** les fragilités d'une UI graphique (icônes minuscules, libellés ambigus, hover states, modaux qui changent le DOM), et il dispose, en retour, de la propriété structurelle qui justifie son existence — il fonctionne sur **n'importe quel** logiciel sans intégration sur-mesure.

> [!INFO] Voir Ch. 14 — Surfaces agentiques §14.6
> Le Ch.14 a cadré l'on-behalf-of comme régime UX, avec les quatre questions critiques (qu'est-ce qu'il fait / comment interrompre / valider l'irréversible / pourquoi), les chiffres business (Cursor, Devin, Sierra, Harvey, Agentforce), et la double bascule économique 2026 (coût 0,05–0,15 $/tâche × précision GUI > 90 %). Le présent chapitre déroule le sous-régime extrême — pilotage écran — avec sa boucle à cinq phases, ses trois architectures, sa surface d'attaque et son économie. La grille **Knight five-tier** du Ch.14 §14.8 s'applique : un agent computer use en prod est typiquement **approver** (Plan Mode + confirmation contextuelle) ou **observer** (activity panel + audit log), **jamais operator** au sens strict (l'opérateur est l'agent, pas l'humain).

### 15.1.2 Pourquoi un chapitre dédié

Trois propriétés font du computer use un sous-régime qualitativement différent des autres on-behalf-of :

1. ==**La boucle est plus longue et plus fragile.**== Là où un agent appelant une API exécute une transaction quasi-atomique, un agent computer use enchaîne typiquement **dizaines, parfois centaines d'étapes** : observer un screenshot, identifier les éléments cliquables, calculer des coordonnées, cliquer, attendre, ré-observer. Chaque étape est probabiliste ; les erreurs se composent.
2. ==**L'économie unitaire est dégradée.**== L'overhead d'un appel computer use est non négligeable (466–499 tokens système chez Anthropic[^28]), la latence est de plusieurs secondes par étape, et la précision GUI nécessaire requiert un modèle haut de gamme. Le ratio coût/valeur n'est positif que sur des cas d'usage à fort volume ou à fort coût humain.
3. ==**La surface d'attaque est insolite.**== Un attaquant peut cacher des instructions *dans des pixels* — VPI (Visual Prompt Injection) — ou compromettre le *control plane* qui pilote la VM (CVE-2025-55322 sur OmniParser). Aucun pattern défensif MCP classique ne couvre ces vecteurs.

Ce sont ces trois propriétés que le chapitre déroule. Il ne refait pas l'inventaire concurrentiel du Ch.14 (Cursor, Devin, Sierra) — il ajoute la couche d'industrialisation propre à la catégorie CUA.

---

## 15.2 Définition et taxonomie

### 15.2.1 Anatomie d'une famille en cours de structuration

Un **agent computer use** (CUA) est un système qui perçoit l'interface graphique d'un ordinateur (capture d'écran, accessibility tree, ou DOM) et agit dessus via les primitives standard d'un humain : déplacement de curseur, clics, saisie clavier, raccourcis. Il ne dépend ni d'API métiers ni de connecteurs spécialisés — c'est ce qui le distingue des agents de tool-use classiques. Anthropic a formalisé cette ligne dans son annonce d'octobre 2024 : *« Claude a été entraîné à des compétences informatiques générales, lui permettant d'utiliser un large éventail d'outils standard et de logiciels »*[^1].

![Taxonomie des agents pilotant une interface : périmètre, modalités d'observation, primitives d'action|1300](../../agents-computer-use/images/20260502-01-taxonomie-cua.svg)

La famille comprend plusieurs sous-classes qu'il vaut mieux ne pas confondre :

- **Browser Use Agent (BUA)** — limité au navigateur (Operator avant juillet 2025, Project Mariner, frameworks comme Stagehand v3 ou Browser Use). C'est la sous-classe la plus mature et la moins risquée (sandbox naturelle du navigateur).
- **Desktop Agent** — périmètre étendu à l'OS et aux applications natives (UI-TARS Desktop de ByteDance, OmniTool de Microsoft, l'implémentation de référence d'Anthropic en Docker Ubuntu). Surface d'attaque plus large, gains pratiques importants sur les SI legacy.
- **Mobile Agent** — Android ou iOS via des primitives tactiles (long-press, press-back). Catégorie émergente.
- **Cross-app Agent** — combinaison des trois, parfois orchestrée (Stagehand v3 expose un `mode: "cua"` qui permet de plugger Claude, Gemini ou OpenAI CUA derrière la même interface[^13]).

La terminologie reste mouvante. OpenAI parle de **Computer-Using Agent (CUA)** pour son modèle, *Operator* pour son produit[^14] ; Anthropic parle de *computer use* comme d'un *outil* exposé via l'API ; ByteDance parle d'**agent natif GUI**[^15]. Pour ce chapitre, *CUA* désigne la classe technique (modèle + capacités), tandis que *agent computer use* désigne le système complet (modèle + harness + sandbox + observabilité).

> [!NOTE] La distinction *assistant conversationnel* ↔ *CUA*
> Un agent computer use n'est *pas* une extension fonctionnelle d'un assistant conversationnel. C'est un **changement de mode opératoire**. L'assistant répond à une requête ; le CUA *exécute une intention* — souvent sur dizaines, parfois sur centaines d'étapes — avec une boucle fermée d'observation, planification, action, vérification. Cette boucle introduit des problèmes nouveaux : composabilité d'erreurs, dérive de plan, manipulation par contenu visuel — qu'aucun benchmark de réponse ne capture. Lire un score OSWorld comme on lit un score MMLU est une erreur de catégorie.

### 15.2.2 Quatre lignées chronologiques

Quatre lignées coexistent à mai 2026, chacune avec son point d'entrée historique :

- **Anthropic** — *computer use* en bêta sur Claude 3.5 Sonnet, 22 octobre 2024, premier launch commercial de la catégorie[^1]. Implémentation de référence en Docker Ubuntu, six partenaires de lancement (Asana, Canva, Cognition, DoorDash, Replit, The Browser Company), intégration immédiate Amazon Bedrock[^19] et Vertex AI[^20].
- **OpenAI** — Operator (modèle CUA = GPT-4o vision affiné par RL pour interagir avec des GUI), 23 janvier 2025, 200 $/mois ChatGPT Pro US[^2][^14]. Fusion dans ChatGPT comme *agent mode* le 17 juillet 2025[^22].
- **Google** — Project Mariner, accès large via Google AI Ultra (249,99 $/mois), 20 mai 2025[^3]. Différenciant : architecture multi-VM permettant **dix tâches parallèles**[^21].
- **ByteDance** — UI-TARS-1.5, open source Apache 2.0, 17 avril 2025[^15]. Premier modèle CUA véritablement compétitif en ouvert : 61,6 % sur ScreenSpot Pro vs 27,7 % Claude vs 23,4 % CUA. UI-TARS-2 (4 septembre 2025) étend code et tool use[^33].

![Frise chronologique : émergence et industrialisation des agents computer use entre 2023 et 2026|1300](../../agents-computer-use/images/20260502-02-timeline-cua.svg)

Microsoft entre dans la danse en février 2026 en exposant des **computer-using agents** dans Copilot Studio avec choix entre OpenAI CUA et Claude Sonnet 4.5[^23]. C'est la première convergence enterprise : un client final ne choisit plus le vendeur de modèle, il choisit l'orchestrateur — l'orchestrateur choisit le modèle selon le cas d'usage. Pattern qui se retrouve dans Vertex Agent Engine (Ch.16).

==L'inflexion 2026 n'est plus celle des capacités brutes mais celle de l'économie unitaire.== La conversation produit se déplace : non plus *que peut faire un agent*, mais *combien coûte une tâche réussie de bout en bout, et avec quelle variance*. Les sections §15.9 et §15.10 développent ces deux questions.

---

## 15.3 Architecture canonique — la boucle à cinq phases

Tout agent computer use opérationnel implémente une boucle à **cinq phases** : **observer**, **planifier**, **ancrer (ground)**, **agir**, **vérifier**. Le dernier maillon, longtemps optionnel, est devenu standard depuis 2025 — c'est la clé de la performance d'OSAgent, *« entraîné à auto-vérifier ses actions en temps réel et corriger au tour suivant quand une étape échoue »*[^27].

![Architecture canonique d'un agent computer use : boucle observer-planifier-ancrer-agir-vérifier avec sandbox, contrôle d'accès et bus d'observabilité|1300](../../agents-computer-use/images/20260502-03-architecture.svg)

### 15.3.1 Observer

L'observation combine généralement une capture d'écran (ce que voit l'humain) avec des structures complémentaires — accessibility tree pour le desktop, DOM ou Chrome Accessibility Tree pour le navigateur. La capture d'écran seule a longtemps été insuffisante : **OmniParser** de Microsoft a démontré qu'un modèle dédié de détection (YOLOv8 fine-tuné sur des icônes) couplé à un modèle de captioning (Florence-2 fine-tuné) faisait passer GPT-4o de ==**0,8 % à 39,6 %**== sur ScreenSpot Pro[^29]. C'est ce résultat qui définit les deux écoles d'architecture (§15.4) : *vision pure* versus *vision + parseur dédié*.

### 15.3.2 Planifier — le goulot de la latence

La planification décompose l'intention en sous-objectifs. Sur OSWorld, l'analyse temporelle d'Agent S2 montre que ==la planification et la réflexion consomment 75 à 94 % de la latence totale d'une tâche==[^7]. Ce coût explique pourquoi les architectures multi-modèles deviennent dominantes : un modèle large pour planifier (GPT-4o, Claude Opus, Gemini 2.5 Pro), un modèle petit pour ancrer les coordonnées (UI-TARS-7B-DPO sur GPU local). C'est le pattern *planner / grounder* d'Agent S2 et de Jedi[^7]. Le Ch.5 (économie de l'inférence) avait déjà identifié la désagrégation comme levier ; on la retrouve ici, instanciée sur le CUA.

### 15.3.3 Ancrer (grounding)

L'**ancrage** est la traduction d'une intention abstraite (*« cliquer sur le bouton submit »*) en coordonnées (x, y) sur l'écran courant. C'est techniquement le maillon le plus fragile. Anthropic le notait dès le launch : *« Claude peut faire des erreurs ou halluciner en générant des coordonnées précises »*[^28]. C'est aussi pourquoi le **ScreenSpot Pro** benchmark, qui mesure l'ancrage sur écrans haute résolution avec icônes minuscules, est devenu central — il isole la compétence critique du reste de la boucle.

### 15.3.4 Agir

L'action est traduite en primitives bas niveau : `pyautogui.click(x, y)`, `keypress`, `scroll`, `drag`. Les modèles récents enrichissent cette grammaire : Anthropic a ajouté une action `zoom` dans la version `computer_20251124`, qui permet à Claude de demander une vue agrandie d'une région avant d'agir, réduisant les erreurs d'ancrage sur petits éléments[^28]. C'est une réponse directe au problème ScreenSpot Pro.

### 15.3.5 Vérifier — le cinquième nœud qui change tout

==La vérification ferme la boucle.== Sans elle, les erreurs se composent de manière catastrophique : une mauvaise interprétation de la première étape rend toute la suite vaine. Avec elle — comme le montre la performance superhumaine d'OSAgent — l'agent gagne la capacité de détecter une dérive et de relancer une sous-séquence. Le coût en tokens est non négligeable, ce qui pousse vers des vérificateurs spécialisés (modèles plus petits, parfois déterministes via XPath ou hash visuel).

Le verify a aussi une vertu architecturale qu'on n'imaginait pas il y a un an : il **rend la trajectoire reproductible** au niveau d'une sous-séquence. Si l'agent vérifie après chaque étape critique, la trajectoire devient un graphe de checkpoints au lieu d'un fil linéaire qu'on doit rejouer depuis le début en cas d'échec. ==C'est ce qui transforme le CUA d'un système *one-shot* en un système *resumable*== — propriété nécessaire pour les workflows enterprise longs.

> [!INFO] Voir Ch. 7 — Reason · Act · Observe
> La boucle TAOR à quatre phases du Ch.7 (Reason · Act · Observe + harness) est le **cas général**. La boucle à cinq phases du CUA est sa spécialisation pour le pilotage écran : *observe* devient screenshot+OCR, *reason* devient *plan*, l'*action* devient *ground+act*, et *observe* gagne un nœud *verify* explicite parce que la composabilité des erreurs y est plus brutale qu'en tool-use classique. Le Ch.7 pose le principe ; ce chapitre l'instancie sur la spécificité GUI.

---

## 15.4 Trois architectures concurrentes

Le marché 2026 se structure autour de trois architectures qui n'ont pas convergé. Aucune ne domine, et le choix entre elles est encore largement déterminé par les contraintes opérationnelles (souveraineté, latence, coût) plutôt que par la performance pure.

### 15.4.1 Architecture (i) — vision pure

Un seul modèle prend en entrée le screenshot et émet directement les actions. Pas de parseur intermédiaire, pas de représentation symbolique de l'UI. C'est l'architecture d'**Anthropic computer use** (Claude Opus 4.5/4.7), d'**UI-TARS-1.5/2** côté open source[^15], et de la première version du modèle CUA d'OpenAI.

Force : simplicité opérationnelle, un seul appel par étape. Faiblesse : la précision d'ancrage dépend entièrement de la résolution de perception du modèle — sur écrans 4K avec icônes 16×16 px, les meilleurs modèles peinent (cf. ScreenSpot Pro).

### 15.4.2 Architecture (ii) — vision + parseur dédié

Un modèle de détection spécialisé (YOLOv8 fine-tuné, OmniParser) annote le screenshot avec les coordonnées des éléments cliquables et leurs descriptions textuelles ; un LLM généraliste lit cette représentation enrichie et planifie. C'est **Agent S2** (open source), c'est **OmniParser + LLM** chez Microsoft, c'est le pattern multi-modèles le plus déployé en académique.

Force : précision d'ancrage radicalement améliorée (GPT-4o de 0,8 % à 39,6 % ScreenSpot Pro), composabilité (on peut changer le LLM sans toucher au parseur). Faiblesse : pipeline plus lourd, deux modèles à maintenir, latence cumulée.

### 15.4.3 Architecture (iii) — agent intégré perception-action

Un modèle unique, mais **entraîné spécifiquement** pour la perception-action GUI (pas un généraliste fine-tuné). C'est **UI-TARS-2** chez ByteDance, c'est **Magma** chez Microsoft. La différence avec (i) est subtile mais structurelle : ces modèles sont entraînés sur des séquences {screenshot, action, screenshot, action} avec des fonctions de loss spécifiques au pilotage, pas sur du langage généraliste avec du fine-tuning GUI en surcouche.

Force : meilleure compression du *prior* GUI (ce qu'un humain sait quand il voit un bouton, sans avoir à le re-déduire chaque fois), latence améliorée. Faiblesse : moins polyvalent (un UI-TARS-2 n'écrit pas très bien du code), nécessite des datasets propriétaires importants.

> [!IMPORTANT] Convergence prévue 18-24 mois vers (iii)
> Aucune des trois architectures ne domine en mai 2026, mais la trajectoire de recherche pointe vers (iii) — modèles entraînés perception-action en un seul réseau. Trois raisons : (a) le coût d'inférence d'un pipeline à deux modèles (ii) est structurellement plus élevé ; (b) la latence d'un planner large (i) reste prohibitive sur les workflows longs ; (c) les fonctions de loss spécialisées (iii) capturent des invariants GUI (hover states, modal logic, focus traps) que le langage généraliste ne capture pas. ==Le pari raisonnable : les architectures multi-modèles seront optimisées, pas rejetées== — on aura des planner-grounder unifiés dans un seul modèle perception-action, plutôt qu'un seul modèle généraliste qui fait tout, ou que deux modèles spécialisés en pipeline.

---

## 15.5 Paysage concurrentiel — quatre couches

Le paysage début 2026 se structure en quatre couches. Le Ch.14 a déjà nommé les acteurs côté business (Operator, Computer Use, Devin, Sierra, Harvey, Agentforce) ; on s'intéresse ici à la **stack technique**.

![Matrice acteurs × capacités : positionnement comparé des principaux agents computer use sur sept dimensions|1300](../../agents-computer-use/images/20260502-04-paysage-concurrentiel.svg)

### 15.5.1 Couche modèle

Six acteurs sérieux : Anthropic (Claude Opus 4.5/4.6/4.7, Sonnet 4.5/4.6 avec computer use natif), OpenAI (modèle CUA basé sur o3, intégré dans ChatGPT agent), Google DeepMind (Gemini 2.5 Pro pour Mariner), ByteDance (UI-TARS-1.5 / UI-TARS-2 open source), Microsoft (Magma + OmniParser dans Copilot Studio), et l'écosystème ouvert chinois (Doubao, Qwen 2.5VL).

### 15.5.2 Couche orchestration et harness

Le tissu se densifie : **Stagehand v3** (Browserbase, MIT, TS/Python/Go) avec ses primitives `act`/`extract`/`observe`/`agent` ; **Browser Use** (Python, écosystème data science) ; **Agent S2** (open source, état de l'art académique). Microsoft propose Copilot Studio comme couche d'orchestration enterprise, intégrant à la fois OpenAI CUA et Claude Sonnet 4.5 selon le cas d'usage[^23]. Anthropic et OpenAI livrent leurs propres SDK et samples (`anthropic-quickstarts/computer-use-demo`, `openai-cua-sample-app`).

### 15.5.3 Couche infrastructure

**Browserbase**, **Steel** et **AnchorBrowser** proposent des navigateurs cloud orchestrables, une *agent identity*, du *session replay*, du contournement CAPTCHA. C'est l'équivalent moderne d'une couche Selenium/Playwright managée pour agents. Sans cette couche, on déploie son propre Docker Ubuntu avec Chromium et on gère soi-même session, replay, et CAPTCHA — viable pour le PoC, lourd pour la prod.

### 15.5.4 Couche enterprise

**Copilot Studio**, **Salesforce Agentforce**, et les grandes ESN (Accenture, Capgemini, Deloitte) emballent ces primitives dans des offres conformes (gouvernance, audit, isolation). C'est la couche qui matérialise la conformité DORA / AI Act que le Ch.23 cadrera génériquement et que le Ch.16 instancie sur la banque française.

### 15.5.5 Souveraineté — la voie UI-TARS

L'écosystème ouvert chinois mérite attention. UI-TARS-1.5-7B est sous Apache 2.0, déployable sur un seul GPU, et a démontré des résultats à la fois sur OSWorld, ScreenSpot Pro et — point de différenciation — sur des tâches de jeu vidéo (14 mini-jeux Poki, environnement Minecraft via MineRL)[^15]. ==C'est le seul vecteur sérieux de souveraineté== pour des organisations qui refusent la dépendance aux trois acteurs US. Mistral et OVH ont annoncé des intentions sans produit live début 2026. Pour une banque française, c'est l'option *self-host on GPU on-prem* qui s'ouvre — au prix de la qualité (UI-TARS reste 5-10 points sous Claude Opus 4.7 sur OSWorld-Verified à pondération équivalente).

---

## 15.6 Benchmarks — savoir ce qu'on mesure

Le paysage des benchmarks s'est structuré autour de cinq familles. **Desktop** : OSWorld (369 tâches Linux Ubuntu, baseline humain ~72 %)[^4]. **Web** : WebArena (812 tâches multi-pages, humain ~78 %)[^16], VisualWebArena (910 tâches multimodales, humain ~89 %)[^17], WebVoyager (tâches live sur 15 sites réels, juge GPT-4V)[^18]. **Ancrage** : ScreenSpot et ScreenSpot Pro[^29]. **Robustesse à l'attaque** : AgentDojo (97 tâches, 629 cas de test prompt injection)[^34], VPI-Bench (306 cas d'injection visuelle sur 5 plateformes)[^8]. **Enterprise** : UI-CUBE (UiPath, 226 tâches en deux tiers de difficulté)[^6], CUB (Computer Use Benchmark).

![Évolution des scores OSWorld et WebArena entre Q2 2024 et Q2 2026 : chronologie de la rattrapage du baseline humain|1300](../../agents-computer-use/images/20260502-05-evolution-benchmarks.svg)

### 15.6.1 La trajectoire OSWorld — convexe mais piégée

La courbe OSWorld a une dynamique convexe : 12,2 % avril 2024, 38,1 % janvier 2025 (Operator), 44 % octobre 2025 (Computer Use ×3 en un an), 66,26 % novembre 2025 (Opus 4.5), **76,26 %** octobre 2025 (OSAgent — premier dépassement humain ~72 %)[^27]. La WebArena suit une dynamique parallèle. ==Trois précautions méthodologiques s'imposent pour lire ces chiffres honnêtement.==

**Première précaution — les benchmarks ne sont pas immobiles.** OSWorld a connu une refonte majeure en juillet 2025 (**OSWorld-Verified**, infrastructure AWS, 50× parallélisation), avec corrections de plus de 300 tâches — l'équipe XLANG note elle-même que cette pratique *« réduit le caractère significatif des comparaisons dans le temps »*[^5]. ==Comparer un score 2024 à un score 2026 sur OSWorld revient parfois à comparer des tâches différentes.== Le Ch.17 a déjà documenté ce vecteur de contamination *par version-tag* dans la grille des 4 vecteurs de fuite — ici, il s'applique au cas spécifique du CUA.

**Deuxième précaution — code execution court-circuite l'épreuve GUI.** L'analyse d'Epoch AI sur OSWorld montre que ==les modèles outillés en code execution scorent bien plus haut, en utilisant openpyxl pour manipuler des spreadsheets plutôt qu'en cliquant dans LibreOffice== — ce qui n'est pas la compétence mesurée[^35]. Le score n'est pas trompeur si l'on sait ce qu'on mesure ; il l'est si on l'interprète comme « capacité GUI ».

**Troisième précaution — SELF vs 3RD party.** Les scores publiés sont souvent auto-déclarés (`SELF`) et non indépendamment vérifiés (`3RD`). La plateforme **Steel.dev** maintient un index avec cette distinction explicite — y privilégier les scores tiers est devenu une hygiène d'analyse[^36]. Pour OSWorld, la voie officielle est désormais le track *Public Evaluation* sur AWS, qui exécute le harness sous environnement contrôlé.

> [!QUOTE] Anthropic, *System Card Claude Opus 4.5*, novembre 2025
> *« Le modèle revendique l'état de l'art **parmi systèmes single-agent**, en notant que des systèmes multi-agents avec prompts site-spécifiques et outils avancés scorent plus haut « mais ne sont pas directement comparables »*[^25]. L'aveu est honnête et cadre la différence entre **capacité brute de modèle** et **performance d'un système d'agent complet**.

### 15.6.2 Le verdict UI-CUBE — le cliff enterprise

Le benchmark UI-CUBE de UiPath est probablement le signal le plus inconfortable de 2025. Sur 226 tâches enterprise réparties en deux tiers de difficulté, les CUA actuels atteignent ==**68–87 %** de la performance humaine sur le tier simple, mais s'effondrent à **15–32 %** sur le tier complexe==[^6]. Les auteurs caractérisent ce profil comme une **« limitation architecturale fondamentale en gestion mémoire, planification hiérarchique, et coordination d'état »** — pas un déficit incrémental qu'on rattraperait avec plus d'entraînement.

==Les benchmarks académiques mesurent ce que les agents savent faire ; UI-CUBE mesure ce qu'on attend d'eux en production.== C'est la grille à présenter au sponsor IA d'un projet CUA avant la signature d'un RFP. Le delta 87→32 sur une tâche enterprise réaliste est le chiffre qui dit *« ne déployez pas en autonomous mode sans le filet humain »*.

### 15.6.3 Robustesse à l'attaque — chiffres alarmants

Sur la robustesse, les chiffres sont alarmants. **VPI-Bench** mesure la susceptibilité à l'injection de prompt visuelle — un attaquant qui cache une instruction dans un élément visuel rendu (banner, infobulle, image manipulée). Le résultat : ==**51 % de succès** contre les CUA et **jusqu'à 100 %** contre les BUA sur certaines plateformes==[^8]. **AgentDojo** enfonce le clou : sur 97 tâches × 629 cas de test, les défenses existantes améliorent peu la situation[^34]. La §15.9 développe les patterns d'attaque, et §15.11 fait le pont avec le threat model unifié E4 du Ch.19.

> [!INFO] Voir Ch. 17 — Évaluer un agent et débunker les leaderboards
> Le Ch.17 a posé la grille générique : 4 vecteurs de fuite des benchmarks publics (chevauchement temporel / version-tag / harness gaming / prompt leakage), le 2×2 contrôlé × ponctuel pour acheteurs, le playbook gruyère 8 étapes. Le présent chapitre instancie sur OSWorld et UI-CUBE — il **ne refait pas** la démolition générique. La frontière éditoriale : Ch.17 = grille d'achat et démolition leaderboards ; Ch.15 = lecture honnête des chiffres CUA *en supposant* que le lecteur connaît la grille.

---

## 15.7 Cas d'usage et frameworks

Les cas d'usage se répartissent en quatre quadrants selon deux axes : *valeur business* (faible-élevée) et *maturité technologique* (pilote-production). Le quadrant *production / valeur élevée* reste mince.

![Matrice secteur × maturité : cartographie des cas d'usage computer use observés en production début 2026|1300](../../agents-computer-use/images/20260502-06-cas-usage.svg)

### 15.7.1 Les déploiements nominatifs

Quelques exemples avec données chiffrées : **Replit** utilise les capacités computer use de Claude pour évaluer des apps en cours de construction dans son produit Agent[^1] ; **The Browser Company** automatise des workflows web avec Claude (*« supérieur à tous les modèles testés »*[^1]) ; **Bridgewater Associates** déploie Claude Opus 4 comme *Investment Analyst Assistant* sur Amazon Bedrock, avec une **réduction de 50–70 % du time-to-insight** sur rapports complexes equity, FX, fixed-income[^32] ; **Tines** automatise des workflows de cybersécurité 120 étapes en une étape, avec un facteur de gain revendiqué de 100×[^32].

### 15.7.2 E-commerce et booking — le terrain le moins convaincant

Les e-commerce et booking étaient les premiers terrains présumés (Operator avec DoorDash, Instacart, OpenTable, Priceline, StubHub, Thumbtack, Uber[^2] ; Mariner avec Ticketmaster, StubHub, Resy, Vagaro[^3]). En pratique, l'expérience reste lente : Leon Furze concluait dès février 2025 qu'*« il est souvent plus rapide d'effectuer ces tâches manuellement que de superviser l'IA »*[^37]. Le cas d'usage existe surtout pour les volumes (procurement automatique, comparateurs).

### 15.7.3 Back-office et ITSM — le sweet spot

Les back-office et ITSM sont le terrain le plus mature. AtomicWork, ServiceNow, Microsoft Copilot Studio en production proposent des agents de catégorisation de tickets, de résolution L1, de gestion d'assets, avec des gains documentés de **25–60 %** sur les call times et transferts[^38]. ==Le sweet spot : tâches répétitives, à faible coût d'erreur, avec systèmes legacy sans API moderne (où le CUA évite des intégrations sur mesure).==

### 15.7.4 Customer-service voix — exclus

Le service client voix-vidéo reste un cas d'usage à part : la latence sub-seconde requise (≤300 ms) exclut les boucles agent-LLM-screenshot actuelles qui tournent en dizaines de secondes voire minutes[^39]. Les déploiements voix ne sont *pas* des CUA au sens strict — c'est du vertical agent (Sierra, Vapi, Retell), pas du computer use.

### 15.7.5 Frameworks — trois approches

![Stack technique d'un agent computer use de production : couches de la fondation modèle à la gouvernance enterprise|1300](../../agents-computer-use/images/20260502-07-stack-frameworks.svg)

Trois approches coexistent. **Frameworks haut niveau autonomes** : Browser Use (Python, prend un goal, fait tout) ; UI-TARS Desktop (autonome, modèle local). **Frameworks hybrides code+IA** : Stagehand v3 (TS/Python, primitives `act`/`extract`/`observe` que vous orchestrez en code, plus un `agent` pour les tâches multi-étapes)[^40]. **Frameworks enterprise managés** : Copilot Studio (Microsoft), Agentforce (Salesforce).

Le choix se fait sur trois axes :
- **Prévisibilité** : code > agent (un agent dont on contrôle les primitives est plus prévisible qu'un agent qui décide tout)
- **Maintenance** : auto-healing > sélecteurs hardcodés (un site change, l'agent doit s'adapter)
- **Gouvernance** : cloud managé > local (audit log natif, conformité par défaut)

Le pattern Stagehand v3 est emblématique d'une convergence : *« le seul framework open source de browser AI conçu spécifiquement pour les agents… À utiliser quand il n'y a pas d'API. À utiliser quand le site change sans préavis »*[^40]. La promesse — *« écris une fois, run forever »* via auto-caching et self-healing — est l'horizon que toute la couche orchestration tente d'atteindre. Avec demi-million de téléchargements hebdomadaires en octobre 2025 et 44 % de gain de performance sur v3, le pattern *atomic primitives + agent on top* gagne du terrain face au monolithique.

---

## 15.8 Surface d'attaque qualitativement inédite

La surface de risque d'un agent computer use est qualitativement différente de celle d'un LLM conversationnel. Quatre familles se distinguent : **manipulation par contenu** (prompt injection), **dérive d'exécution** (loop sans terminaison, action accidentelle), **fuite de données** (l'agent envoie un contenu sensible vers un tiers), **vulnérabilités du *control plane*** (l'API qui permet à l'agent d'agir devient elle-même un vecteur).

![Surface de risque et profil de latence des agents computer use : carte des vulnérabilités et des coûts cachés|1300](../../agents-computer-use/images/20260502-08-risques-latence.svg)

### 15.8.1 VPI — l'injection visuelle qui n'a pas d'équivalent défensif

Le **prompt injection** est classé numéro 1 par OWASP dans son Top 10 des vulnérabilités LLM, et caractérisé par le NIST comme *« le défaut de sécurité majeur de l'IA générative »*[^41]. Pour les agents computer use, la vulnérabilité prend une forme inédite : l'**injection visuelle** (Visual Prompt Injection, VPI). ==Un attaquant cache une instruction — visuellement subtile mais OCR-lisible — dans une page web, un avis de cookie, une infobulle, une image.== Le modèle, en regardant l'écran, transcrit l'instruction dans son contexte et l'exécute.

VPI-Bench mesure 306 cas sur 5 plateformes : **succès jusqu'à 51 % contre les CUA et 100 % contre les BUA** sur certaines surfaces[^8]. Les défenses existantes (filtrage texte, sandboxes DOM) sont structurellement inopérantes — ==elles ne couvrent pas le canal pixel==. C'est précisément ce que le Ch.13 ne pouvait pas couvrir : la matrice MCP 10×10 traite les vecteurs textuels (description empoisonnée, prompt injection cross-document, cross-server confusion, OAuth+supply chain) ; le canal pixel d'un screenshot interprété par un VLM est une **verticale orthogonale**.

> [!IMPORTANT] La verticale VPI s'ajoute à E4 (Ch.19)
> Le threat model unifié E4 du Ch.19 agrège six axes : modèle / prompt / mémoire / outil / protocole / **surface**. ==Le canal VPI est ce qui peuple l'axe « surface »== — il n'apparaît pas dans la matrice MCP du Ch.13 parce qu'il ne passe pas par le tuyau JSON-RPC ; il passe par le canal d'observation du modèle. La défense en profondeur agentique 2026 doit donc additionner : signature Sigstore + hash pinning (couche tool, Ch.13), classifieurs de prompt injection visuelle (couche surface, ici), et human-in-the-loop sur les actions irréversibles (couche action, Ch.14 §14.6.3).

### 15.8.2 Dérive d'exécution

La dérive d'exécution se manifeste sur les workflows longs. UI-CUBE quantifie le phénomène : sur tâches complexes, les agents passent de 87 % à 32 % de la performance humaine[^6]. La cause technique probable : ==les longs traces saturent le contexte, ce qui dégrade la planification==. Les contre-mesures émergentes — *context compaction* (Anthropic), *tool result clearing* (effacer les anciens screenshots), *interleaved scratchpads* — sont incrémentales et réduisent le phénomène sans l'éliminer[^25].

> [!INFO] Voir Ch. 10 — Compaction et oubli stratégique
> Le Ch.10 a documenté les 5 familles de compaction (summarization, eviction, hiérarchique, retrieval, compactors appris) et le triangle fidélité × coût × oubliabilité. Ici, le tool result clearing — effacer les anciens screenshots pour ne garder que les N derniers — est un cas particulier d'**eviction LIFO** sur un canal très lourd en tokens (un screenshot 1080p compressé représente quelques milliers de tokens visuels). Anthropic recommande explicitement le pattern dans la doc computer use ; c'est l'instanciation pratique de §10.3 pour le CUA.

### 15.8.3 Fuites de données

Les fuites de données sont une préoccupation enterprise majeure. Anthropic note que les outils computer use sont *client-side* : les screenshots et actions transitent par l'API mais ne sont pas retenus côté Anthropic après la réponse — l'agent est ZDR-éligible si l'application le permet[^28]. OpenAI applique une logique différente avec Operator : le modèle CUA cherche confirmation pour les actions sensibles (login, paiement, CAPTCHA)[^14]. ==Cette confirmation humaine *in-the-loop* est devenue la norme défensive, et figure dans 70 % des architectures produites== — au prix d'une perte sensible d'autonomie.

### 15.8.4 CVE-2025-55322 — quand le control plane devient le vecteur

La vulnérabilité du control plane est plus traîtresse. Le 25 septembre 2025, le chercheur Aonan Guan a publié une RCE critique sur OmniParser/OmniTool de Microsoft (**CVE-2025-55322**) : ==l'interface HTTP qui permet à l'agent d'exécuter des actions sur la VM était joignable sans authentification dans la configuration par défaut==[^9]. Microsoft a publié OmniParser v2.0.1 avec un correctif.

La leçon est formulée par l'auteur lui-même : *« dans un stack d'agent, chaque port HTTP qui peut faire des choses est une paire de mains. Assurez-vous qu'elles sont les vôtres. »*[^9]. C'est la formulation la plus dense de la doctrine défensive 2026 pour le computer use : **tout endpoint HTTP qui pilote la VM est un endpoint d'attaque**.

> [!QUOTE] Aonan Guan, *Click, Parse, Execute*, septembre 2025
> *« In an agent stack, every HTTP port that can do things is a pair of hands. Make sure they are yours. »* — la formulation canonique de la doctrine défensive control-plane pour les agents computer use[^9].

### 15.8.5 Reliability — runs divergents

Côté fiabilité, le problème est plus prosaïque mais aussi plus universel. L'étude *On the Reliability of Computer Use Agents* (avril 2026) montre qu'un même agent, exécuté à plusieurs reprises sur la même tâche, produit des trajectoires divergentes liées à trois sources : stochasticité du modèle, ambiguïté des instructions, variabilité de la planification[^42]. ==Pour la production, cela signifie qu'un test unique ne suffit pas — il faut des *runs* répétés, idéalement avec mécanismes de guidance par exécutions précédentes== (in-context examples). C'est la justification opérationnelle de la métrique *repro rate* que le Ch.16 §16.9.2 réinjecte dans la grille d'évaluation data-spécifique.

---

## 15.9 La latence — le coût caché plus que la précision

OSWorld-Human et OSWorld-Gold ont annoté des trajectoires humaines minimales : changer l'interligne de deux paragraphes prend ==**12 minutes** à un agent S2 contre **moins de 30 secondes** pour un humain — un rapport 24×==[^7]. Les phases planification et réflexion (75–94 % de la latence totale) sont les coupables. Les architectures multi-modèles avec grounder local mitigent le problème, comme le cache de Stagehand qui élimine les ré-inférences sur actions répétées[^40].

Une enquête en production conduite en 2026 (*Measuring Agents in Production*) tempère le tableau : **66 % des déploiements tolèrent des temps de réponse en minutes, et 17 % n'imposent aucune limite** — l'usage dominant est l'**automatisation arrière-plan**, pas l'interaction temps-réel[^43].

> [!IMPORTANT] L'usage dominant n'est pas l'interaction temps-réel
> Pour ces usages, un agent qui prend 12 minutes mais bat un humain par 10× sur le coût *total* (incluant disponibilité 24/7, parallélisation, absence de pauses) reste rationnel économiquement. ==Le cas d'usage CUA réaliste 2026 n'est pas le *« assistant temps-réel qui aide le commercial pendant son rendez-vous »*, c'est le *« worker arrière-plan qui traite cinq cents tickets ITSM pendant la nuit »*.== Cette inversion de cadrage est ce qui transforme un projet CUA en cas business viable : on ne cherche pas la latence sub-seconde, on cherche le throughput nuit/week-end avec sandbox isolée et audit log par run.

---

## 15.10 Marché 2026-2030 et inflexions

Les estimations de marché doivent être lues avec prudence — elles agrègent des catégories hétérogènes (chatbots, RPA, copilotes, CUA stricts). MarketsandMarkets projette le marché global des agents IA à **52,62 G$ en 2030** depuis 7,84 G$ en 2025 (TCAC 46,3 %)[^10]. GMI Insights donne une fourchette différente : 5,9 G$ en 2024 → 105,6 G$ en 2034 (TCAC 38,5 %)[^44]. Les ordres de grandeur convergent ; les périmètres pas tout à fait.

Sur la portion CUA strict, les chiffres sont absents — la catégorie est trop jeune et trop imbriquée dans les offres généralistes. Un repère indirect : les revenus annualisés d'Anthropic sont passés de 1 G$ fin 2024 à **14 G$** début 2026[^31] — Claude Code à lui seul génère 2,5 G$, et la part attribuable aux usages computer use et agentic est non publique mais probablement à deux chiffres en pourcentage. La levée de Série G de **30 G$** (380 G$ valorisation) en février 2026, deuxième plus grand round privé de l'histoire tech[^31], est un proxy de la conviction du marché.

### 15.10.1 Les trois prédictions Gartner à dater

Les prévisions stratégiques de Gartner valent d'être citées avec leur fourchette de fiabilité :

- **D'ici 2028**, **90 % des achats B2B** transiteraient par des agents — ~15 000 G$ de dépenses[^11]
- **D'ici 2027**, plus de ==**40 % des projets d'agentic AI** seraient abandonnés== (raisons : coûts, ROI peu clair, gouvernance immature)[^12]
- **D'ici 2030**, les **guardian agents** (agents qui surveillent et bloquent d'autres agents) capteraient 10–15 % du marché agentique[^45]

==Ces trois projections, prises ensemble, suggèrent une dynamique de polarisation== : forte croissance brute, forte mortalité projet, et émergence d'une couche de méta-agents de gouvernance.

### 15.10.2 Trois lignes de fracture

Trois lignes de fracture définissent la fenêtre 2026–2027 :

**La première est économique.** L'agent computer use coûte aujourd'hui 5–50× plus qu'un humain sur des tâches dont l'humain est plus rapide. Le ratio s'inversera avec la réduction de latence (modèles plus petits, caching, batching, distillation), mais cela prendra 12–24 mois.

**La deuxième est sécuritaire.** L'industrialisation à grande échelle requiert une couche de défense contre VPI et contre les vulnérabilités de control plane qui n'existe pas encore en mature. Anthropic a déployé ASL-3 avec classifieurs en temps réel sur Sonnet 4.5[^24], mais l'écart entre ce qui est annoncé et ce qui est testé indépendamment reste large.

**La troisième est régulatoire.** Gartner prédit que des lois IA fragmentées couvriront la moitié de l'économie mondiale d'ici 2027, induisant ~5 G$ de dépenses de conformité[^11]. L'EU AI Act, l'AI Office et les *deployer obligations* pour les systèmes à haut risque structureront le déploiement européen. Le Ch.16 instancie sur la banque française tier 1 ; le Ch.23 généralise.

### 15.10.3 Trois inflexions à dater 18-24 mois

**(i) Convergence partielle des architectures vers (iii)** — perception-action dans un seul réseau, à la UI-TARS — les architectures multi-modèles seront optimisées plutôt que rejetées.

**(ii) Émergence d'un standard d'observabilité agent** — OpenTelemetry GenAI conventions s'étendant aux traces UI, permettant le passage à l'échelle des SOC et des audits.

**(iii) Standardisation de la couche *guardian*** — agents qui supervisent, valident, bloquent — comme nouvelle ligne d'investissement, en miroir de ce que les WAF ont été pour le web applicatif des années 2010.

> [!INFO] Voir Ch. 18 — Observabilité agentique
> L'inflexion (ii) — standard d'observabilité agent — est précisément ce que le Ch.18 documente comme la convergence 2026 autour d'OpenTelemetry GenAI Semantic Conventions et du *cognitive audit trail*. Les traces UI (screenshots, coordonnées d'action, états DOM) sont la prochaine extension naturelle des semconv — front actif fin 2026, mentionné comme `gen_ai.computer_use.*` dans les early draft WG.

L'agent computer use de fin 2027 ressemblera moins à une bête de concours sur OSWorld qu'à un *worker* enterprise contraint par sandbox, observable par une stack EDR-équivalent, déclenchable par workflow, audité par un guardian. ==C'est l'industrialisation, pas l'intelligence, qui définit la décennie qui s'ouvre.==

---

## 15.11 Récap chapitre — Boucle, archis, surface, économie

Quatre points à retenir pour fermer le chapitre :

1. **La boucle à cinq phases** (observe · plan · ground · act · **verify**) — le cinquième nœud est ce qui explique le résultat superhumain d'OSAgent et ce qui transforme le CUA d'un système one-shot en système resumable.
2. **Les trois architectures concurrentes** (vision pure / vision+parseur / agent intégré) — aucune ne domine en 2026, convergence prévue vers (iii) à 18-24 mois.
3. **La surface d'attaque qualitativement inédite** — VPI (51 % CUA / 100 % BUA) + CVE-2025-55322 control plane. Ces deux verticales s'ajoutent au threat model E4 du Ch.19 et ne sont pas couvertes par la matrice MCP du Ch.13.
4. **La latence comme coût caché** — ratio 24× humain, mais ==l'usage dominant en prod (66 % minutes, 17 % no limit) est l'automatisation arrière-plan, pas l'interaction temps-réel==.

> [!WARNING] Trois pièges classiques (100 % traçables)
> **Piège 1 — RFP au score OSWorld brut.** Sans inspecter (a) la version du benchmark (Verified ou non), (b) si le système utilise code execution comme raccourci, (c) SELF vs 3RD party — un score OSWorld brut n'est pas un signal d'achat. Le Ch.17 a déjà nommé le pattern ; ici, il s'instancie.
> **Piège 2 — POC sans test reliability répété.** Une même tâche rejouée dix fois produit dix trajectoires divergentes. Tester une fois est un POC ; tester N fois avec mesure de variance est une éval. La métrique *repro rate* (Ch.16 §16.9.2) doit figurer dans le gating de release.
> **Piège 3 — Skipper le control plane audit.** Tout endpoint HTTP qui pilote la VM agent est un endpoint d'attaque. CVE-2025-55322 sur OmniParser est l'exemple canonique ; il s'en publiera d'autres. La revue sécurité doit inclure le control plane ET le canal pixel — la matrice MCP du Ch.13 ne suffit pas.

L'Acte III a maintenant traité : la plomberie tool (Ch.12), son coût sécurité (Ch.13), les régimes d'accès utilisateur (Ch.14), et le sous-régime extrême (Ch.15). Le Ch.16 ferme l'Acte sur l'instanciation sectorielle — trois surfaces agentiques GCP, banque française tier 1, pivot sémantique, régulation 2 août 2026.

---

## Sources

[^1]: Anthropic, *Introducing computer use, a new Claude 3.5 Sonnet, and Claude 3.5 Haiku*, 22 octobre 2024. [anthropic.com/news/3-5-models-and-computer-use](https://www.anthropic.com/news/3-5-models-and-computer-use). Consulté 2026-05-02.

[^2]: OpenAI, *Introducing Operator*, 23 janvier 2025. [openai.com/index/introducing-operator](https://openai.com/index/introducing-operator/). Consulté 2026-05-02.

[^3]: TechCrunch, M. Zeff, *Google rolls out Project Mariner, its web-browsing AI agent*, 20 mai 2025. [techcrunch.com/2025/05/20/google-rolls-out-project-mariner-its-web-browsing-ai-agent](https://techcrunch.com/2025/05/20/google-rolls-out-project-mariner-its-web-browsing-ai-agent/). Consulté 2026-05-02.

[^4]: T. Xie et al., *OSWorld: Benchmarking Multimodal Agents for Open-Ended Tasks in Real Computer Environments*, arXiv:2404.07972, NeurIPS 2024. [arxiv.org/abs/2404.07972](https://arxiv.org/abs/2404.07972). Consulté 2026-05-02.

[^5]: XLANG Lab, *Introducing OSWorld-Verified*, 28 juillet 2025. [xlang.ai/blog/osworld-verified](https://xlang.ai/blog/osworld-verified). Consulté 2026-05-02.

[^6]: H. Cristescu et al. (UiPath), *UI-CUBE: Enterprise-Grade Computer Use Agent Benchmarking Beyond Task Accuracy to Operational Reliability*, arXiv:2511.17131, novembre 2025. [arxiv.org/pdf/2511.17131](https://arxiv.org/pdf/2511.17131). Consulté 2026-05-02.

[^7]: *OSWorld-Human/OSWorld-Gold: Benchmarking the Efficiency of Computer-Use Agents*, arXiv:2506.16042, juin 2025 (ICML 2025). [arxiv.org/html/2506.16042v1](https://arxiv.org/html/2506.16042v1). Consulté 2026-05-02.

[^8]: T. Cao et al. (NUS), *VPI-Bench: Visual Prompt Injection Attacks for Computer-Use Agents*, arXiv:2506.02456, 2025. [arxiv.org/pdf/2506.02456](https://arxiv.org/pdf/2506.02456). Consulté 2026-05-02.

[^9]: A. Guan, *Click, Parse, Execute — When a GUI Agent's Control Plane Becomes a Remote Control Surface (CVE-2025-55322)*, 25 septembre 2025. [oddguan.com/blog/microsoft-omniparser-gui-agent-computer-use-rce-cve-2025-55322](https://oddguan.com/blog/microsoft-omniparser-gui-agent-computer-use-rce-cve-2025-55322/). Consulté 2026-05-02.

[^10]: MarketsandMarkets, *AI Agents Market by Agent Role, Offering, Agent System — Global Forecast to 2030*, 2025. [marketsandmarkets.com/Market-Reports/ai-agents-market-15761548.html](https://www.marketsandmarkets.com/Market-Reports/ai-agents-market-15761548.html). Consulté 2026-05-02.

[^11]: Digital Commerce 360, *Gartner: AI agents will command $15 trillion in B2B purchases by 2028*, 28 novembre 2025. [digitalcommerce360.com/2025/11/28/gartner-ai-agents-15-trillion-in-b2b-purchases-by-2028](https://www.digitalcommerce360.com/2025/11/28/gartner-ai-agents-15-trillion-in-b2b-purchases-by-2028/). Consulté 2026-05-02.

[^12]: Litslink (synthèse Gartner), *AI agents market size forecast 2025–2030*, 29 décembre 2025. [litslink.com/blog/ai-agent-statistics](https://litslink.com/blog/ai-agent-statistics). Consulté 2026-05-02.

[^13]: Browserbase, *Launching Stagehand v3, the best automation framework*, 29 octobre 2025. [browserbase.com/blog/stagehand-v3](https://www.browserbase.com/blog/stagehand-v3). Consulté 2026-05-02.

[^14]: OpenAI, *Computer-Using Agent (CUA) — research preview*, 23 janvier 2025. [openai.com/index/computer-using-agent](https://openai.com/index/computer-using-agent/). Consulté 2026-05-02.

[^15]: ByteDance Seed, *ByteDance Seed Agent Model UI-TARS-1.5 Open Source*, 17 avril 2025. [seed.bytedance.com/en/blog/bytedance-seed-agent-model-ui-tars-1-5-open-source](https://seed.bytedance.com/en/blog/bytedance-seed-agent-model-ui-tars-1-5-open-source-achieving-sota-performance-in-various-benchmarks). Consulté 2026-05-02.

[^16]: WebArena project, *WebArena: A realistic web environment for building autonomous agents*, CMU, NeurIPS 2024. [webarena.dev](https://webarena.dev/). Consulté 2026-05-02.

[^17]: J. Y. Koh et al. (CMU), *VisualWebArena: Evaluating Multimodal Agents on Realistic Visual Web Tasks*, arXiv:2401.13649, ACL 2024. [arxiv.org/pdf/2401.13649](https://arxiv.org/pdf/2401.13649). Consulté 2026-05-02.

[^18]: H. He et al., *WebVoyager: Building an End-to-End Web Agent with Large Multimodal Models*, arXiv:2401.13919, 2024. [arxiv.org/pdf/2401.13919](https://arxiv.org/pdf/2401.13919). Consulté 2026-05-02.

[^19]: AWS, *Anthropic's upgraded Claude 3.5 Sonnet model and computer use now in Amazon Bedrock*, 22 octobre 2024. [aws.amazon.com/about-aws/whats-new/2024/10/anthropics-claude-35-sonnet-model-computer-amazon-bedrock](https://aws.amazon.com/about-aws/whats-new/2024/10/anthropics-claude-35-sonnet-model-computer-amazon-bedrock/). Consulté 2026-05-02.

[^20]: Google Cloud, *Upgraded Claude 3.5 Sonnet with computer use on Vertex AI*, 22 octobre 2024. Consulté 2026-05-02.

[^21]: Google DeepMind, *Project Mariner — research prototype*, 2025. [deepmind.google/models/project-mariner](https://deepmind.google/models/project-mariner/). Consulté 2026-05-02.

[^22]: OpenAI, *Introducing ChatGPT agent: bridging research and action*, 17 juillet 2025. [openai.com/index/introducing-chatgpt-agent](https://openai.com/index/introducing-chatgpt-agent/). Consulté 2026-05-02.

[^23]: Microsoft, *Improve complex UI automation with computer-using agents*, Microsoft Copilot Blog, 24 février 2026. [microsoft.com/en-us/microsoft-copilot/blog/copilot-studio/computer-using-agents-now-deliver-more-secure-ui-automation-at-scale](https://www.microsoft.com/en-us/microsoft-copilot/blog/copilot-studio/computer-using-agents-now-deliver-more-secure-ui-automation-at-scale/). Consulté 2026-05-02.

[^24]: Anthropic, *System Card: Claude Sonnet 4.5*, septembre 2025. [anthropic.com/claude-sonnet-4-5-system-card](https://www.anthropic.com/claude-sonnet-4-5-system-card). Consulté 2026-05-02.

[^25]: Anthropic, *System Card: Claude Opus 4.5*, novembre 2025. [anthropic.com/claude-opus-4-5-system-card](https://www.anthropic.com/claude-opus-4-5-system-card). Consulté 2026-05-02.

[^27]: The AGI Company, *OSAgent — The World's Most Capable Computer Agent*, 23 octobre 2025. [theagi.company/blog/osworld](https://www.theagi.company/blog/osworld). Consulté 2026-05-02.

[^28]: Anthropic, *Computer use tool — Claude API Docs*, 2026. [platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool). Consulté 2026-05-02.

[^29]: Microsoft Research, *OmniParser V2: Turning Any LLM into a Computer Use Agent*, 2025. [microsoft.com/en-us/research/articles/omniparser-v2-turning-any-llm-into-a-computer-use-agent](https://www.microsoft.com/en-us/research/articles/omniparser-v2-turning-any-llm-into-a-computer-use-agent/). Consulté 2026-05-02.

[^31]: IntuitionLabs, *Claude Pricing Explained: Subscription Plans & API Costs* (synthèse de l'annonce Série G d'Anthropic et chiffres revenus 2026), 1er décembre 2025. [intuitionlabs.ai/articles/claude-pricing-plans-api-costs](https://intuitionlabs.ai/articles/claude-pricing-plans-api-costs). Consulté 2026-05-02.

[^32]: DataStudios, *Claude in the enterprise: case studies of AI deployments and real-world results*, septembre 2025. [datastudios.org/post/claude-in-the-enterprise-case-studies-of-ai-deployments-and-real-world-results-1](https://www.datastudios.org/post/claude-in-the-enterprise-case-studies-of-ai-deployments-and-real-world-results-1). Consulté 2026-05-02.

[^33]: ByteDance, *UI-TARS-2: Major upgrade with enhanced capabilities in GUI, Game, Code and Tool Use*, GitHub, 4 septembre 2025. [github.com/bytedance/UI-TARS](https://github.com/bytedance/UI-TARS). Consulté 2026-05-02.

[^34]: E. Debenedetti et al., *AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents*, arXiv:2406.13352, 2024. [arxiv.org/pdf/2406.13352](https://arxiv.org/pdf/2406.13352). Consulté 2026-05-02.

[^35]: Epoch AI, *What does OSWorld tell us about AI's ability to use computers?*, 30 octobre 2025. [epoch.ai/blog/what-does-osworld-tell-us-about-ais-ability-to-use-computers](https://epoch.ai/blog/what-does-osworld-tell-us-about-ais-ability-to-use-computers). Consulté 2026-05-02.

[^36]: Steel.dev, *AI Agent Benchmark Results Index*, 2026. [leaderboard.steel.dev/results](https://leaderboard.steel.dev/results). Consulté 2026-05-02.

[^37]: L. Furze, *Hands on with OpenAI's Operator*, 28 février 2025. [leonfurze.com/2025/02/28/hands-on-with-openais-operator](https://leonfurze.com/2025/02/28/hands-on-with-openais-operator/). Consulté 2026-05-02.

[^38]: TechTarget, T. Murphy interviewant M. Bufi (Info-Tech Research), *Agentic AI in practice: Lessons from real deployments*, mars 2026. [techtarget.com/searchcio/feature/Agentic-ai-in-practice-lessons-from-real-deployments](https://www.techtarget.com/searchcio/feature/Agentic-ai-in-practice-lessons-from-real-deployments). Consulté 2026-05-02.

[^39]: Cresta Engineering, *Engineering for Real-Time Voice Agent Latency*, 2025. [cresta.com/blog/engineering-for-real-time-voice-agent-latency](https://cresta.com/blog/engineering-for-real-time-voice-agent-latency). Consulté 2026-05-02.

[^40]: Browserbase, *Stagehand v3 documentation — Agent*, 2026. [docs.stagehand.dev/v3/basics/agent](https://docs.stagehand.dev/v3/basics/agent). Consulté 2026-05-02.

[^41]: *Prompt Injection Attacks on Agentic Coding Assistants: A Systematic Analysis*, arXiv:2601.17548 (cite NIST et OWASP), 2026. [arxiv.org/pdf/2601.17548](https://arxiv.org/pdf/2601.17548). Consulté 2026-05-02.

[^42]: *On the Reliability of Computer Use Agents*, arXiv:2604.17849, avril 2026. [arxiv.org/html/2604.17849](https://arxiv.org/html/2604.17849). Consulté 2026-05-02.

[^43]: *Measuring Agents in Production*, arXiv:2512.04123, janvier 2026. [arxiv.org/html/2512.04123v2](https://arxiv.org/html/2512.04123v2). Consulté 2026-05-02.

[^44]: GMI Insights, *AI Agents Market Size & Share, Growth Opportunity 2025-2034*, juillet 2025. [gminsights.com/industry-analysis/ai-agents-market](https://www.gminsights.com/industry-analysis/ai-agents-market). Consulté 2026-05-02.

[^45]: Gartner, *Predicts that Guardian Agents will Capture 10–15% of the Agentic AI Market by 2030*, 11 juin 2025. [gartner.com/en/newsroom/press-releases/2025-06-11-gartner-predicts-that-guardian-agents-will-capture-10-15-percent-of-the-agentic-ai-market-by-2030](https://www.gartner.com/en/newsroom/press-releases/2025-06-11-gartner-predicts-that-guardian-agents-will-capture-10-15-percent-of-the-agentic-ai-market-by-2030). Consulté 2026-05-02.
