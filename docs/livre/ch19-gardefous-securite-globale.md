# Chapitre 19 — Garde-fous, jailbreaking et sécurité globale

> **Acte IV — Mesures et garde-fous · Chapitre charnière, ~30 pages**
> _Trois ans après les premiers jailbreaks ChatGPT, l'asymétrie attaque/défense reste structurelle : attaques automatisées à 90-99 % de succès sur les modèles open-weights, 50-90 % sur les modèles frontière fermés, **aucune défense en production au-delà de ~95 % de fiabilité**. Le chapitre absorbe le manuel `llm-jailbreaking/` (28 avril 2026) et la couche 06 d'`anatomie` (guardrails, HITL, sécurité), avec renvois forts vers Ch. 10 (memory poisoning), Ch. 13 (MCP 10×10), Ch. 15 (computer use VPI). Il construit la **synthèse menaces 2026** — six surfaces (modèle, prompt, mémoire, outil, protocole, surface) — qui sert d'objet transverse de l'Acte IV._

> [!QUESTION] Question d'ouverture
> 48 % des professionnels cybersécurité placent l'agentique en **top vecteur d'attaque 2026** ; 34 % seulement ont des contrôles dédiés. Sur l'écart de 14 points, c'est-à-dire sur ==une entreprise sur sept qui sait qu'elle est exposée et qui a installé une réponse==, qu'est-ce qu'on a appris depuis DAN 2022, GCG 2023, Crescendo 2024, Policy Puppetry 2025 ? Et surtout — sachant qu'il n'y a pas de *silver bullet* au niveau du modèle, **où place-t-on les couches qui marchent vraiment**, et qui dans l'organisation porte la décision quand l'agent est admin + l'injection est indirecte + la facture du post-mortem est sur la table ?

> [!TLDR] TL;DR décideur
> - ==Trois ans d'escalade ont produit un constat opérationnel net : il n'y a pas de défense parfaite au niveau du modèle.== Le **problème originel** — un transformer qui lit un flux de tokens ne distingue pas *instructions* et *données* — reste structurel en 2026. La sécurité agentique n'est donc pas une compétence de prompt engineering : c'est de la défense en profondeur classique, héritée du software security, appliquée à un système non-déterministe.
> - **Cinq couches** s'empilent : alignement modèle (RLHF + Constitutional Classifiers + circuit breakers) · classifiers input/output (Llama Guard, ShieldGemma, Prompt Shields) · *system prompt hardening* + spotlighting · ==**isolation architecturale**== (StruQ/SecAlign, CaMeL, Dual-LLM, sandbox d'outils) · monitoring opérationnel et HITL. ==Les couches 4-5 portent l'essentiel de la défense ; les couches 1-3 sont nécessaires mais jamais suffisantes==.
> - **Agents ≠ chatbots.** Les benchmarks AgentDojo et AgentHarm montrent que des modèles qui refusent une requête nuisible directe **acceptent la même intention** quand elle est emballée dans un workflow multi-étapes. L'injection indirecte via outputs d'outils atteint 24 %+ ASR sur GPT-4 ReAct sans aucun jailbreak explicite[^injecagent].
> - **Quatre vecteurs structurels** orchestrent les incidents 2025-2026 : *tool poisoning* sur MCP (jusqu'à 72 % ASR — MCPTox[^mcptox]), *indirect prompt injection* via emails/docs/calendrier (EchoLeak CVE-2025-32711, Reprompt CVE-2026-24307), ==*memory poisoning* persistant== (SpAIware, MINJA — cf. Ch. 10), et *cross-server confusion* (cf. Ch. 13).
> - **Principe directeur OWASP ASI Top 10 (décembre 2025) — *least agency*.** Ne jamais donner plus d'autonomie que la tâche ne l'exige. Sandboxing, permission modes scopés, HITL sur écritures via `interrupt()`. ==Une couche qui coûte au débit, qui se paie au centuple en incident évité.==
> - **Synthèse menaces 2026** = six surfaces empilées (modèle, prompt, mémoire, outil, protocole, surface utilisateur). Toute fiche de sécurité d'un agent doit nommer **les six**, dire qui porte le risque, et inventorier les défenses choisies. Un agent admin sans HITL plus une injection indirecte égale l'incident post-mortem que personne ne veut signer.
> - **Trois pièges 100 % traçables.** Confondre alignement et sécurité — un Claude 3.7 calé sur RLHF tombe sur Policy Puppetry en cinq minutes · trust des descriptions de tools MCP — OX Security a poisoné 9 registres sur 11 d'un seul payload · *single-layer defense* — un classifier seul est à un bug du bypass total.

---

## 19.1 Le déplacement — du périmètre déterministe à la défense en profondeur agentique

### 19.1.1 Trois ans qui ont changé la nature du problème

La sécurité de l'IA générative s'est structurée par phases. En 2022-2023, **phase artisanale** : Reddit et Discord découvrent DAN, Evil Confidant, AIM, STAN — des templates de roleplay qui contournent la modération via un prompt[^dan]. En 2023-2024, **phase optimisation** : GCG (Zou et al.) industrialise l'attaque white-box[^gcg] ; PAIR démontre l'attaque black-box automatisée en moins de 20 requêtes[^pair]. En 2024, **phase multi-tour et multimodal** : les fenêtres atteignent 200 k+ tokens, ouvrant la surface aux many-shot jailbreaks[^msj], Crescendo (Russinovich)[^crescendo], past-tense bypass[^past], Best-of-N[^bon]. ==En 2025-2026, **phase agentique** : la frontière se déplace du chat aux agents.==

AgentDojo (NeurIPS 2024)[^agentdojo] et AgentHarm (UK AISI octobre 2024)[^agentharm] deviennent les benchmarks de référence pour les agents tool-using. **EchoLeak (CVE-2025-32711, juin 2025)** réalise une exfiltration de données zero-click sur Microsoft 365 Copilot[^echoleak]. La Slack AI exfiltration (août 2024)[^slack-ai], les emails frauduleux Gemini for Workspace, le ChatGPT Operator sensitive-info leakage, le **Reprompt (CVE-2026-24307, janvier 2026)** sur Microsoft Copilot — la liste s'allonge tous les trimestres. Le Model Context Protocol, sorti fin 2024, héberge 10 000+ serveurs MCP en février 2026 ; Invariant Labs et CyberArk démontrent les *tool poisoning attacks* avec jusqu'à 72 % de succès[^mcptox].

==Ce qui a changé, c'est l'objet à sécuriser.== Un chatbot expose un modèle qui peut hallucler ; un agent expose un modèle qui peut *envoyer des emails au nom de l'utilisateur*, *exécuter du code*, *écrire en base*, *appeler des outils tiers*. La même injection qui produisait un texte gênant en 2023 produit un transfert bancaire en 2026.

### 19.1.2 Le problème originel — *instruction-data boundary*

Le problème fondamental, identifié par Simon Willison dès 2022[^willison-promptinj], n'est pas résolu : ==un transformer qui lit un flux de tokens n'a pas de séparateur architectural== entre *« ce que le développeur m'a dit de faire »*, *« ce que l'utilisateur me demande »*, et *« ce que cet email que je viens de lire me demande »*. La distinction est sémantique, pas structurelle. Tant qu'on n'a pas un modèle qui sépare nativement ces canaux, la défense doit s'opérer *en dehors* du modèle — au niveau du système, des capacités, du processus.

Trois phénomènes sont souvent regroupés sous le terme *jailbreak* mais qu'il faut distinguer pour décider[^survey-jb].

- **Jailbreaking proprement dit** — contourner les garde-fous d'alignement qui empêchent le modèle de produire du contenu prohibé (CBRN, malware, hate speech, conseil illégal). L'utilisateur **est** l'attaquant, dispose d'un accès API légitime.
- **Prompt injection** — détourner le modèle avec des instructions intégrées dans des données tierces (page web, email, résultat d'outil, document retrieved). L'utilisateur **est la victime** ; l'attaquant contrôle une source de données que le modèle lit.
- **Data exfiltration et harms indirects** — utiliser les deux primitives ci-dessus pour extraire un system prompt, leak des credentials, ou pivoter vers des systèmes downstream via tool calls.

Les trois exploitent la même cause racine : ==l'absence de séparation native entre instructions et données==. C'est exactement le constat que Mark Russinovich résume par une métaphore opérationnelle : *« un agent LLM est un junior employee très intelligent, très enthousiaste »*[^russinovich-junior]. Connaissances vastes, jugement réel proche de zéro, susceptible à l'ingénierie sociale. En 2026, ce junior a accès à l'email.

> [!INFO] Voir Ch. 8 — Outils · Ch. 13 — MCP sécurité · Ch. 10 — Compaction
> Ce chapitre est **le tronc commun** de la sécurité agentique. Le Ch. 8 a posé l'outil comme « décision d'architecture la plus chargée de la stack ». Le Ch. 13 détaille la matrice 10×10 spécifique à MCP. Le Ch. 10 décrit la couche cachée memory poisoning à travers la compaction. Lus ensemble, ils donnent les vecteurs ; ce chapitre donne le **threat model unifié** et les couches qui marchent vraiment.

---

## 19.2 Taxonomie d'attaque — quatre axes orthogonaux

Une taxonomie utile, raffinée à travers les surveys et la pratique[^survey-jb][^mao-survey], organise les attaques selon quatre axes orthogonaux.

![Taxonomie maîtresse des attaques LLM et agentiques|1300](../../llm-jailbreaking/images/20260428-01-jailbreak-taxonomy.svg)

- **Accès de l'attaquant** — black-box (API seulement), gray-box (logits ou top-token probas), white-box (gradients et poids).
- **Optimisation vs craft** — token-level optimization (GCG, AutoDAN) produisant des suffixes inintelligibles, vs attaques semantic prompt-level (PAIR, personas, multilingue).
- **Single-turn vs multi-turn** — prompts one-shot vs escalade progressive sur une conversation (Crescendo, Skeleton Key).
- **Modalité** — texte, image (typographique, perturbations adversariales, stéganographie), audio (speed/pitch/noise), compositions cross-modales.

La distinction directe / indirecte recoupe ces axes : ==l'injection **directe** a l'utilisateur pour attaquant, l'injection **indirecte** a un *tiers* qui contrôle une source de données que le modèle lit==. La seconde est structurellement plus dangereuse : la victime est un tiers qui ne voit jamais la payload malveillante.

La taxonomie compte parce que **les défenses ne généralisent pas entre cellules**. Un perplexity filter qui attrape les suffixes GCG ne fait rien contre les jailbreaks PAIR en langage naturel. Un classifier de safety multi-tour qui attrape Crescendo manque un many-shot single-turn. Les déploiements production efficaces exigent des couches de défense **alignées sur le modèle de menace**, pas un seul produit *guardrail*.

---

## 19.3 Timeline 2022-2026 — l'arms race comprimé

![Timeline des jailbreaks et défenses, 2022-2026|1300](../../llm-jailbreaking/images/20260428-02-attack-defense-timeline.svg)

Le pattern est consistent à travers les phases : ==une nouvelle capacité ship → une surface d'attaque émerge → la communauté offensive publie en 6-18 mois → les défenseurs livrent des contre-mesures 6-12 mois plus tard==. Aucune défense annoncée avant 2024 ne tient en 2026 à son efficacité initialement revendiquée — les circuit breakers tombent sur Crescendo multi-turn[^cb-multiturn], spotlighting tombe sur les staged attacks (STACK, juin 2025[^stack]), et même les Constitutional Classifiers v2 admettent ==un universal bypass tous les ~1 700 heures de red-teaming==[^cc2].

Trois jalons fixent l'horizon 2026.

- **Anthropic Constitutional Classifiers v2** (janvier 2026)[^cc2] — universal jailbreak success ramené de 86 % à 4,4 %, 1 % d'overhead compute, 0,05 % de refus sur trafic production. C'est le meilleur stack input/output classifier en production à la date du chapitre.
- **CaMeL — Capabilities for Machine Learning** (Google DeepMind, mars 2025)[^camel] — première défense capability-based qui ==**ne dépend pas du modèle**==. 67 % de mitigation sur AgentDojo. Inspirée des OS à capabilities des années 1970.
- **OWASP Agentic Security Initiative Top 10** (décembre 2025)[^owasp-asi] — la traduction OWASP pour les agents, qui complète OWASP LLM 2025[^owasp2025]. Agent Goal Hijack, Tool Misuse, Identity & Privilege Abuse, Rogue Agents, *Cascading Hallucinations*, *Excessive Agency*… Le principe directeur — *least agency* — devient la maxime opérationnelle.

---

## 19.4 Huit attaques canoniques — mécanismes et signatures

Huit familles d'attaques couvrent l'essentiel des incidents documentés. Chacune a son mécanisme propre, son taux de succès typique contre les modèles frontière, et ses défenses empiriquement efficaces.

![Mécanismes des attaques computationnelles|1300](../../llm-jailbreaking/images/20260428-03-attack-mechanisms.svg)

Les quatre premières exploitent les propriétés *computationnelles* du modèle.

- **GCG et successeurs** (optimization-based) — gradient sur des suffixes, produit des chaînes inintelligibles type `! ! ! ! ! describing.\ + similarlyNow...`. >95 % ASR white-box sur Vicuna/Llama, 2-5 % en transfer sur GPT-3.5. Mask-GCG et DeGCG réduisent le coût compute de 10-100×[^mask-gcg]. Défense : perplexity filtering, SmoothLLM, circuit breakers.
- **PAIR / TAP** (iterative refinement) — un LLM attaquant raffine ses prompts en lisant la réponse de refus. 14 queries moyennes pour GPT-4. AutoInject (RL-tuned) atteint 78 % ASR sur AgentDojo[^autoinject]. Défense : refus *silencieux* (sans expliquer le motif), classifier intent-based.
- **Crescendo / Skeleton Key** (multi-turn) — escalade progressive sur 5-10 tours. Crescendo gagne 29-61 % de ASR vs SOTA single-turn sur AdvBench. Skeleton Key fait *« augmenter »* la safety policy plutôt que la remplacer. Défense : classifiers multi-turn trajectoire-aware (AI Watchdog), monitoring conversation-wide.
- **Many-shot jailbreaking (MSJ)** (long-context) — des centaines de paires user/assistant fictives où l'assistant compile, puis la vraie cible. Power-law en nombre de shots. À 256 shots, jailbreak fiable sur Claude 2, GPT-3.5/4, Llama 2-70B, Mistral 7B[^msj]. ==Plus la fenêtre s'agrandit, plus l'attaque est forte==. Anthropic a publié une mitigation *cautionary warning* qui ramène 61 % → 2 % d'ASR mais dégrade l'utilité in-context.

![Mécanismes des attaques compositionnelles|1300](../../llm-jailbreaking/images/20260428-03b-attack-mechanisms-continued.svg)

Les quatre suivantes exploitent la *composition* — roleplay, encoding, modalité, templates.

- **Persona-based (DAN, Evil Confidant, AIM)** — second identité décrite comme *non liée* à la safety. ~88 % ASR moyen sur de nouveaux variants en mars 2026 (étude *Nature Communications*[^repello-personas]). Défense : input classifiers entraînés sur signatures jailbreak, system prompt explicite contre persona swap.
- **Encoding / cipher / linguistic shift** — Base64 (35 % ASR GPT-4), leetspeak, langues low-resource (Zulu, Scots Gaelic) bumpant GPT-4 de 1 % à 79 % sur AdvBench[^yong], past-tense reformulation faisant passer GPT-4o de 1 % à 88 % ASR sur 20 essais[^past], Best-of-N atteignant 78-89 % ASR avec N=10 000[^bon]. Défense : classification multi-stage, datasets multilingues, langage detection.
- **Multimodal (image, audio)** — typographic attacks (texte dans image), perturbations adversariales (gradient pixel), stéganographie. MML atteint 97,80 % ASR sur SafeBench contre GPT-4o[^mml]. Défense : OCR + safety classification, cross-modal consistency, adversarial training.
- **Universal templates (Policy Puppetry, avril 2025)** — XML/JSON policy framing + roleplay (Dr. House) + leetspeak. Universal across GPT-4o, Claude 3.7, Gemini 2.5, Llama, Mistral, DeepSeek, Qwen[^policy]. Défense : Constitutional Classifiers détectent le pattern structural, instruction hierarchy enforcement.

> [!ATTENTION] La défense ne généralise pas entre familles
> ==Un perplexity filter qui attrape les suffixes GCG ne voit rien contre PAIR.== Un classifier safety multi-tour qui voit Crescendo manque le many-shot single-turn. Un classifier text-only ne voit pas typographic image attack. ==C'est précisément pourquoi le single-layer defense est mort en 2026 — il faut empiler.==

---

## 19.5 La surface d'attaque agent — sept canaux

Les agents — combinent un LLM avec tools, retrieval, memory, action sur le monde — multiplient la surface d'attaque dans trois directions : plus de **canaux** par lesquels une injection peut arriver, plus de **conséquences** quand un jailbreak réussit (exfiltration, actions non autorisées), plus de **persistance** (memory poisoning survit aux sessions).

![Les sept surfaces d'attaque d'un agent LLM|1300](../../llm-jailbreaking/images/20260428-04-agent-attack-surface.svg)

Sept surfaces, brièvement (le détail est dans les chapitres dédiés).

### 19.5.1 Injection prompt indirecte (IPI)

Un attaquant tiers plante des instructions dans des données que l'agent lira au runtime — page web, Google Doc, email, calendrier, ticket support, repo code, review produit[^greshake][^ipi]. Quand l'agent retrieve et process cette donnée, il **exécute** les instructions intégrées comme si elles venaient de l'utilisateur.

Quelques incidents disclosed et patchés : EchoLeak (CVE-2025-32711, juin 2025) zero-click sur Microsoft 365 Copilot[^echoleak] ; Slack AI exfiltration (août 2024)[^slack-ai] ; Gemini for Workspace fraudulent emails ; ChatGPT Operator sensitive-info leakage ; Reprompt (CVE-2026-24307, janvier 2026)[^reprompt]. AgentDojo baseline GPT-4o : 69 % utilité benign, drop à 45 % sous attaque ; canonical *« Important Message »* injection à 53,1 % ASR[^agentdojo]. AutoInject (RL-tuned suffix generator) atteint 77,96 % ASR sur Gemini 2.5 Flash[^autoinject].

Défenses qui marchent : **spotlighting** (delimiting + datamarking + base64 encoding du contenu untrusted)[^spotlight] ; **CaMeL** capability-based isolation (67 % mitigation AgentDojo)[^camel] ; **Dual-LLM pattern** (privileged LLM ne voit jamais le untrusted data)[^willison-dual] ; tool-output classifiers. Défenses qui échouent : per-prompt classifiers sur user input seul, prompt sandwiching (laisse 30,8 % ASR), output filters keyés sur harmful content.

### 19.5.2 Tool poisoning sur MCP

==Le Ch. 13 détaille la matrice 10×10. On n'y revient pas==. Le résumé : trois familles — description poisoning, Full-Schema Poisoning, Advanced Tool Poisoning (output) — auxquels s'ajoutent rug pulls (mutation post-approval) et cross-server exfiltration. MCPTox (août 2025) : jusqu'à 72 % ASR sur leading LLM agents[^mcptox]. OX Security a poisoné 9 sur 11 MCP registries d'un seul payload, confirmant l'exécution de commandes sur six plateformes production live (LiteLLM, LangChain, IBM LangFlow)[^oxsec-mcp].

### 19.5.3 Memory poisoning (cf. Ch. 10)

Une instruction plantée en session 1, activée en session 2 — ou 5 semaines plus tard — quand une query non liée la déclenche. **MINJA** (Dong et al. 2025) atteint 95 % d'injection success, 70 % de downstream attack success en interactions query-only[^minja]. **MemoryGraft** (décembre 2025) plante des *« successful experiences »* malveillantes plutôt que des jailbreaks directs[^memorygraft]. **SpAIware** (Rehberger, mai 2024) et la démonstration ChatGPT memory hacking (septembre 2024) ont montré le hijack du tool *« bio »*. **Morris-II** (arXiv 2403.02817) étend le memory poisoning à la propagation multi-agent via prompts auto-réplicatifs dans RAG partagé[^morris-ii].

==Le Ch. 10 traite le cas spécifique de la compaction — un attaquant qui plante une injection à t, le résumé à t+10 la promeut au statut d'instruction utilisateur, et à t+20 elle s'exécute.== Les défenses : memory provenance tagging, sandbox de staging pour memory writes, contrôles d'accès explicites, confirmations out-of-band avant action.

### 19.5.4 Cross-prompt injection (XPIA) et A2A

Dans les systèmes multi-agents et les protocoles agent-to-agent, un agent compromis peut injecter des prompts dans d'autres agents via les messages inter-agents. Le contexte partagé de MCP — tous les outputs de tools atterrissent dans le même contexte agent — signifie qu'un tool empoisonné peut influencer le raisonnement sur d'autres tools (*infection attack* dans la littérature MCP)[^mcp-systematic]. Défenses immatures ; front actif de recherche en 2026.

### 19.5.5 Visual Prompt Injection (VPI) sur computer use (cf. Ch. 15)

==Le Ch. 15 détaille==. Surface inédite des agents qui pilotent un écran : une image rendue par l'OS, un screenshot du browser, un bouton qui dit *« cliquez ici pour annuler »* — l'agent observe, plan, ground, act. La VPI ajoute un calque adversarial à n'importe quel rendu. CVE-2025-55322 documente le cas. Profil de latence dégradé, surface d'attaque inédite.

---

## 19.6 Profils de vulnérabilité — la dispersion par modèle

La vulnérabilité **n'est pas uniforme** entre familles de modèles. La même technique d'attaque peut réussir à 100 % sur un modèle et à ~10 % sur un autre.

![Matrice de vulnérabilité par modèle et classe d'attaque|1300](../../llm-jailbreaking/images/20260428-05-model-vulnerability-matrix.svg)

Quelques signatures notables.

- **OpenAI** — GPT-4 / 4o relativement robustes en chat direct ; Skeleton Key initially resisting mais vulnerable en system message[^skeleton]. BoN 89 % ASR avec N=10 000[^bon]. Cross-modal jailbreaks atteignent 97 % ASR[^mml]. o1-preview / o3-mini : robustesse baseline meilleure (Cisco HarmBench : o1-preview 26 % vs DeepSeek-R1 100 %[^cisco-ds]).
- **Anthropic** — Claude 3.5 Sonnet et suite mènent les modèles fermés sur la robustesse adversariale. Constitutional Classifiers v2 (déployés janvier 2026) : universal jailbreak success de 86 % baseline à **4,4 %** en production, 99,7 % de prompts bloqués au layer input, 1 % overhead, 0,05 % refus sur trafic production[^cc2]. Claude 3.7 / Opus 4.x : vulnérable à Policy Puppetry roleplay+leetspeak en avril 2025 disclosure[^policy].
- **Google Gemini** — Crescendo 49-71 % d'amélioration sur Gemini Pro sur AdvBench[^crescendo]. Multiples incidents RAG poisoning et indirect injection sur Gemini for Workspace.
- **Meta Llama 3.x** (open-weights) — challenge spécial : n'importe quel utilisateur peut fine-tune away l'alignment. Llama 3.1 405B : ==96 % ASR sur HarmBench== (Cisco)[^cisco-ds]. Avec circuit breakers (R2D2) sur Llama 3 8B : strong single-turn, mais 54 % Crescendo ASR persistant[^cb-multiturn].
- **DeepSeek R1** — vulnérabilité spectaculaire : **100 % ASR** sur 50 prompts random HarmBench (Cisco/Penn)[^cisco-ds] ; 58 % failure rate sur 885 attaques en 18 catégories (Qualys TotalAI)[^qualys-ds] ; références d'entraînement extraites par jailbreak (Wallarm). Pour deploiement enterprise, ==DeepSeek requiert un pipeline safety externe== — input filtering, output classification, content moderation au niveau applicatif.

==Le paradoxe reasoning :== les modèles à chaîne de raisonnement (o1, o3, Gemini 2.5 reasoning) sont *plus robustes* sous certains angles (la délibération internalise des considérations safety) et *plus vulnérables* sous d'autres (réponses plus longues et détaillées quand ils compilent, ciphers complexes succeedent en exploitant leur capacité de décodage). Net effect varie par benchmark.

---

## 19.7 Architecture de défense — cinq couches qui s'empilent

Aucune défense unique ne marche contre toutes les attaques. Le champ a convergé sur un modèle defense-in-depth à cinq couches, mappé sur OWASP LLM Top 10 2025[^owasp2025] et OWASP Agentic Top 10 (décembre 2025)[^owasp-asi], avec le principe *least privilege* hérité du software security classique.

![Architecture defense-in-depth pour applications et agents LLM|1300](../../llm-jailbreaking/images/20260428-06-defense-layers.svg)

### 19.7.1 Layer 1 — Training-time alignment (modèle)

RLHF, Constitutional AI, refusal training, adversarial fine-tuning. **Ce qui marche** : Constitutional AI (Anthropic)[^cai], adversarial fine-tuning sur templates connus (DAN, GCG, MSJ), **circuit breakers** (Zou et al. 2024, representation engineering)[^cb] — réduction ASR ~2 ordres de magnitude sur single-turn, *attack-agnostic*. **Ce qui échoue** : tout training-only seul. PAIR, Crescendo, Policy Puppetry bypassent SOTA RLHF. Past-tense montre 88 % ASR contre GPT-4o heavily aligned. Limitation structurelle : ne peut adresser que les patterns *connus* ; les nouvelles classes émergent plus vite que les cycles de retraining.

### 19.7.2 Layer 2 — Input-side classifiers (guardrails)

Classifiers légers qui score chaque input pour intent jailbreak avant le main model. **Options production** : Llama Guard (Meta, open-weight)[^llamaguard], ShieldGemma (Google, trois tailles 2B/9B/27B)[^shieldgemma], Constitutional Classifiers v2 (Anthropic, deux-stage input+output, production-grade)[^cc2], WildGuard (AI2), Microsoft Prompt Shields / AI Watchdog[^watchdog]. **Ce qui marche** : ces classifiers réduisent les attaques directes simples (DAN, templates nommés, BoN augmentation) à <5 % ASR avec coût production acceptable. **Ce qui échoue** : STACK (juin 2025) atteint 71 % ASR contre ShieldGemma sur ClearHarm catastrophic-misuse[^stack]. PAIR-style refinement apprend à évader le classifier spécifiquement.

### 19.7.3 Layer 3 — System prompt hardening + spotlighting

Instructions défensives dans le system prompt qui établissent des règles que le modèle est censé suivre over user instructions. **Spotlighting** (Microsoft Research)[^spotlight] ajoute trois primitives structurelles : **delimiting** (markers UUID per-session), **datamarking** (token spécial interleaved dans untrusted content — `^` à la place de chaque espace, par exemple — ASR GPT-3.5 Turbo passe de 50 % à <3 %), **encoding** (base64 du contenu untrusted, ASR à 0,0 % sur évaluation Microsoft). **Ce qui marche** : nécessaire, **jamais suffisant**. Spotlighting+encoding est la plus forte option à ce layer. **Ce qui échoue** : attaques sophistiquées qui apprennent à override le system prompt — Skeleton Key fait *augmenter* plutôt que *remplacer*, Policy Puppetry exploite l'ambiguité XML.

### 19.7.4 Layer 4 — Isolation architecturale (le layer qui porte la défense)

C'est ==**le layer le plus fiable** parce qu'il emprunte aux principes éprouvés du software security : capability isolation, privilege separation, principle of least authority==.

**Structured Queries (StruQ)** — Berkeley[^struq]. Entraîner le LLM à accepter des inputs sur deux canaux séparés : *prompt* (trusted, du développeur) et *data* (untrusted, des utilisateurs/tools). Le modèle est fine-tuné pour suivre instructions seulement du prompt channel. **<2 % ASR sous optimization-free attacks**. **SecAlign** (successor) via preference optimization atteint 0 % sur la plupart des attaques, <15 % sous optimization-based across 5 LLMs[^secalign-bair].

**CaMeL — Capabilities for Machine Learning** — Google DeepMind[^camel]. Inspiré des OS à capabilities des années 1970. La tâche est parsée en plan de control-flow par un LLM *privilégié* qui ne voit **jamais** les données untrusted. Un Python interpreter custom exécute le plan, tracking provenance de chaque variable. Les opérations sur untrusted data exigent approbation policy explicite. **67 % de mitigation sur AgentDojo.** ==Première défense qui ne dépend pas du comportement du modèle sous pression adversariale==.

**Dual-LLM pattern** (Willison, 2023)[^willison-dual]. Privileged LLM plans actions et ne voit que la query initiale ; quarantined LLM process untrusted data et retourne des résultats *structurés* (extracted fields, classified categories) plutôt que du free text. Le privileged LLM agit sur les résultats structurés. Déploiement limité parce que l'intégration est complexe.

**Tool-use sandboxing.** Exécution agent-driven code en containers isolés (Anthropic's claude-code, OpenAI's code interpreter). Tool access par *capability*, pas par trust. Per-user authentication avec scoped authorization. Tool-output sanitization avant re-injection. **Ce qui marche** : quand implémenté proprement, l'isolation architecturale prévient des classes d'attaques entières *peu importe ce que fait le modèle*. ==Un modèle entièrement jailbroken ne peut pas exfiltrer des données que le privileged LLM n'a jamais vues, ou appeler des tools sans capability==. **Ce qui échoue** : social engineering au niveau utilisateur (l'utilisateur approuve une action malveillante explicitement), fatigue des confirmation prompts.

### 19.7.5 Layer 5 — Output filtering et monitoring opérationnel

**Output filters** sur réponse modèle avant retour utilisateur. **Provenance tracking** — quels sources data ont contribué. **Anomaly detection** statistique sur comportement (agent qui commence soudain à envoyer emails externes, queries unusual tables, génère des réponses beaucoup plus longues). **Rate limiting** et **conversation-trajectory monitoring** pour Crescendo, PAIR multi-tour (AI Watchdog)[^watchdog]. **HITL** pour actions high-impact — emails, transactions financières, deletions, deployments. **Red-teaming continuous** : AgentDojo[^agentdojo], AgentHarm[^agentharm], JailbreakBench, HarmBench, PyRIT[^pyrit].

---

## 19.8 Matrice d'efficacité — qui arrête quoi

Les cellules montrent l'efficacité typique de chaque défense contre chaque classe d'attaque, dérivée des benchmarks publiés.

![Matrice d'efficacité — quel layer arrête quelle classe|1300](../../llm-jailbreaking/images/20260428-07-defense-effectiveness.svg)

La conclusion est claire : ==**aucun layer ne couvre la matrice ; seules les défenses empilées approchent une robustesse production acceptable**==.

Combinaisons les plus fortes documentées dans la littérature :

- **Constitutional Classifiers v2 + RLHF + circuit breakers** (Anthropic stack) : ~4 % ASR sur universal jailbreaks across 1 700+ heures de red-teaming[^cc2].
- **StruQ/SecAlign + spotlighting** : ~0 % ASR sur optimization-free, <15 % sur optimization-based[^secalign-bair].
- **CaMeL + Dual-LLM** : 67 % AgentDojo mitigation ; la défense agent la plus serrée connue[^camel].
- **Microsoft Prompt Shields + AI Watchdog + spotlighting** (Azure stack) : déploiement production canonique pour indirect injection.

Modes d'échec notables qu'aucune défense actuelle n'adresse complètement :

- **Universal Policy-Puppetry-style templates** combinant roleplay + structured-format injection + encoding restent partiellement efficaces même contre Constitutional Classifiers[^policy].
- **Memory poisoning** persiste through sessions et bypasse per-session filters ; isolation architecturale est la seule mitigation connue, rarement déployée.
- **Multi-turn agentic attacks** (compositions de indirect injection, tool poisoning, escalade progressive) défont les single-layer defenses ; CaMeL est le plus proche d'une réponse structurelle mais reste research-stage.

---

## 19.9 Playbook production — l'architecture de défense intégrée

![Architecture production — defense-in-depth intégrée|1300](../../llm-jailbreaking/images/20260428-08-production-architecture.svg)

### 19.9.1 Threat model first

Avant **toute** décision outillage, documenter :

- **Qui est l'adversaire ?** Utilisateur externe, source data malveillante, insider, supply-chain (un MCP server compromis, un document RAG empoisonné) ?
- **Quel est le risque ?** Exfiltration data, output nuisible à utilisateur, actions non autorisées (email, transaction, code exec), réputation, exposition régulatoire (EU AI Act, GDPR, HIPAA, DORA) ?
- **Quel est le blast radius ?** Single user, single tenant, multi-tenant, cross-customer ?

Le threat model détermine quels layers sont **obligatoires** vs **optionnels**. Un consumer chatbot (low blast radius, sans tools) a besoin de L1-L2-L3. Un agent enterprise avec email + CRM access a besoin de **tous les cinq layers** et ne doit pas être déployé sans isolation architecturale.

### 19.9.2 Stack pragmatique (avril 2026)

1. **Modèle avec alignement fort.** Claude 3.7 / Opus 4.x ou GPT-4o/o3 mènent les benchmarks fermés. Open-weight : Llama 3.3 70B avec circuit-breaker fine-tuning. ==**Éviter DeepSeek-R1 pour toute déploiement safety-sensitive sans mitigation externe**==.
2. **Input classifier.** Constitutional Classifiers (API), Llama Guard 3, ShieldGemma 9B, ou Microsoft Prompt Shields. Sur chaque input avant main model.
3. **Spotlighting** sur toute donnée untrusted (RAG, tool outputs, emails, docs user-uploaded). Base64 quand possible ; markers randomisés sinon.
4. **System prompt hardening** explicite contre persona swap, instruction override, roleplay bypass. Tester avec PAIR et Crescendo via PyRIT avant déploiement.
5. **Structured queries (StruQ-style)** où le modèle et le framework le permettent. Séparer prompt channel et data channel.
6. **Pour agents : capability isolation enforced.** Un agent prod ne devrait pas avoir raw tool access ; tools wrappés en policy gates. CaMeL ou Dual-LLM pour high-impact actions.
7. **Output filtering.** Llama Guard ou Constitutional Classifiers au stage output.
8. **HITL pour high-impact actions.** Email, écriture base, transactions, déploiements code — confirmation user avec full action transparency (pattern Claude Code *« tool-call transparency »*).
9. **Logger tout.** Chaque prompt, tool call, response. Provenance tags sur data flowing. Anomaly detection sur action patterns. ==C'est le cognitive audit trail du Ch. 18==.
10. **Red-team continuously.** AgentDojo et AgentHarm sur le déploiement spécifique, mensuellement. Subscribe aux CVE disclosed. Bug-bounty avec explicit jailbreak rewards.

### 19.9.3 Anti-patterns documentés en post-mortems

- **Trust des descriptions tools MCP sans vérification.** OX Security a poisoné 9 sur 11 registries d'un seul payload[^oxsec-mcp]. Signed registries, version pinning, descriptions tools traitées comme untrusted data sous spotlighting.
- **Même agent pour user-trusted et external data.** Séparer en privileged et quarantined LLMs est le fix structurel.
- **Letting LLM construct tool-call arguments from untrusted data without validation.** L'injection indirecte succeed souvent en faisant l'agent *utiliser une valeur malveillante* comme tool parameter (recipient email, file path, SQL, URL).
- **Memory sans provenance.** Si l'agent remembers, chaque entrée memory tagged avec source et trust level.
- **Single-layer defense.** Un classifier, however good, est un bug away du bypass total. Defense-in-depth = supposer **n'importe quel** layer peut tomber.
- **Croire le marketing vendor sans test indépendant.** Chaque modèle et chaque classifier a été jailbroken en public research ; *« robust safety »* ou *« 99 % protection »* doit être répliqué sur le use case spécifique.

### 19.9.4 Régulation et compliance

- **EU AI Act** — Art. 15 (cybersecurity, accuracy) applique aux haute-risque à partir d'août 2026. Documentation jailbreak resistance dans la technical file. Renvoi Ch. 23.
- **NIST AI RMF + Generative AI Profile (NIST AI 600-1)** — adversarial robustness comme Trustworthy AI characteristic ; prompt injection explicitement adressé.
- **ISO/IEC 42001** (AI Management Systems, 2023) — risk-based controls pour menaces AI-specific.
- **OWASP Top 10 for LLM Applications 2025 + Agentic Top 10 (déc. 2025)**[^owasp2025][^owasp-asi] — référence community-vetted pour contrôles requis. LLM01 (prompt injection) et LLM06 (excessive agency) les plus directement liés.
- **France/UE** — CNIL guidance sur déploiement LLM sous RGPD (minimisation, finalité, base légale). ANSSI publie des recommandations techniques sur sécurité systèmes IA.

> [!INFO] Voir Ch. 23 — Gouvernance · Ch. 16 — Analytics agentique banque
> Le Ch. 23 reprend les calendriers AI Act art. 12/13/15 + DORA + machine unlearning. Le Ch. 16 a posé l'instanciation sectorielle banque tier 1 française (DORA + EBA + ACPR + BCBS 239 + souveraineté + Assured Workloads SecNumCloud). Pour chaque obligation, **quel rôle porte la signature** — DPO, RSSI, sponsor, CDO.

---

## 19.10 Synthèse menaces 2026 — six surfaces empilées

L'angle propre du chapitre, et l'objet **transverse** de l'Acte IV : un threat model **unifié** qui agrège ce que les chapitres voisins décrivent en silos. ==Six surfaces empilées, chacune avec son owner, ses défenses spécifiques, ses indicateurs OTel `gen_ai.security.*`==.

![Schéma E4 — Threat model unifié 2026 : six surfaces, six familles, quatre parades load-bearing|1400](../../livre/images/20260601-e4-threat-model-unifie-2026.svg)

> [!NOTE] À propos du Schéma E4
> Version v1 — schéma transverse RSSI agrégeant les vecteurs identifiés en silos dans Ch.10 (memory poisoning SpAIware), Ch.13 (matrice MCP 10×10), Ch.15 (VPI + CVE-2025-55322), Ch.2 §2.6 (faithfulness CoT), Ch.3 §3.6 (reward hacking). Six cartes-surfaces en grille 3×2 avec, pour chacune, trois vecteurs typiques + parade dominante + renvoi chapitre. Bandeau bas : quatre parades load-bearing transverses (Sigstore + hash pinning · tool tagging · allowlist namespace · HITL writes irréversibles). Cité 4× dans le livre : Ch.19 (principal), Ch.10, Ch.13, Ch.15.

| Surface | Cible primaire | Vecteurs principaux | Défense load-bearing | Owner |
| --- | --- | --- | --- | --- |
| **(i) Modèle** | poids, refus, alignement | GCG, PAIR, Crescendo, MSJ, Policy Puppetry | Constitutional Classifiers v2 + circuit breakers | provider modèle + AI Safety Lead |
| **(ii) Prompt** | system prompt, instructions | persona swap, encoding cipher, instruction override | spotlighting + StruQ/SecAlign | agent engineer |
| **(iii) Mémoire** *(Ch. 10)* | scratchpad, long-term, compaction summary | SpAIware, MINJA, MemoryGraft, Morris-II | provenance tagging + sandboxed staging + signed compactions | platform engineer + DPO |
| **(iv) Outil** *(Ch. 8 + 13)* | tool descriptions, schémas, outputs | Tool poisoning, FSP, ATPA, rug pull, cross-server exfil | Sigstore + hash pinning + tool tagging + HITL writes | platform engineer + RSSI |
| **(v) Protocole** *(Ch. 12 + 13)* | MCP, A2A, AG-UI | namespace shadowing, OAuth+supply chain, infection attack | allowlist namespace + signed registries + per-user auth | integrations engineer + RSSI |
| **(vi) Surface utilisateur** *(Ch. 15)* | écran, browser, copilote, on-behalf-of | VPI (CVE-2025-55322), typographic injection, social engineering UI | OCR + classifier + HITL + confirmation transparency | product manager + RSSI |

==Toute fiche de sécurité d'un agent **doit nommer les six** == — pas l'une, pas trois. Si un layer est absent, le justifier explicitement par le threat model (cf. §19.9.1) — typiquement *« cet agent n'a pas de mémoire long terme, surface (iii) inapplicable »*. Si un layer est présent sans défense load-bearing nommée, c'est un trou que le post-mortem viendra documenter.

> [!IMPORTANT] Cinq patterns load-bearing
> Sur la matrice ci-dessus, ==**cinq patterns** portent l'essentiel de la défense== — le reste est cosmétique.
>
> **(1) Constitutional Classifiers v2 + circuit breakers** au layer modèle. **(2) Spotlighting (base64 du untrusted content) + StruQ/SecAlign** au layer prompt/data. **(3) Provenance tagging + signed compactions** au layer mémoire. **(4) Sigstore + hash pinning + tool tagging + HITL writes** au layer outil/protocole. **(5) HITL transparence sur actions destructrices** à la surface utilisateur.
>
> Le reste — system prompt hardening seul, classifiers single-stage, refusal training, output filters keyword-based — **est** utile mais ne porte pas la défense. Si la fiche de sécurité ne contient pas les cinq patterns ci-dessus, elle ne tient pas.

---

## 19.11 Horizon 2026-2027 — trois trends

Trois tendances structurent les 12-18 mois.

**Agentique = défaut.** Chat-based attacks (DAN-era) sont legacy ; la live frontière est multi-step agentic compromise. AgentDojo et AgentHarm families vont croître. Plus de CVE disclosed publiquement contre integrations agent (Microsoft Copilot family, Google Workspace, Salesforce Einstein, Notion AI). Slack AI, EchoLeak, Reprompt sont leading indicators, pas edge cases.

**Capability-based defenses production-viable.** CaMeL est research-stage en 2025 mais ses principes (provenance tracking, capability gating, dual-LLM separation) sont déjà adoptés dans vendor SDKs. Anthropic, Microsoft, OpenAI vont ship implémentations commerciales en 2026.

**Le paradoxe reasoning se durcit.** Reasoning models deviennent standard ; defenders vont leverage la délibération chain elle-même pour safety reasoning. Attackers vont cibler la délibération chain — exploiter chain-of-thought pour faire passer le raisonnement nuisible pour *« thinking through ethics »*.

Ce qui **n'arrive pas**, dans le jugement de l'auteur : un silver bullet au layer modèle. Le problème instruction-data boundary est une propriété structurelle des transformers consommant des token streams. ==La résoudre exige soit (a) une nouvelle architecture qui distingue nativement les canaux, soit (b) accepter que la frontière s'enforce *en dehors* du modèle — au layer système, capability, processus==. La seconde voie est atteignable aujourd'hui ; la première est multi-année.

---

## 19.12 Récap chapitre — six règles pour security engineer 2026

Si le lecteur ne retient qu'une page de ce chapitre, c'est celle-ci.

==**Six règles opérationnelles** pour qui déploie un LLM en 2026==.

1. **Traiter chaque input, output, tool description, memory entry comme untrusted.** Software security classique ; les LLMs ne changent rien à ça.
2. **Defense-in-depth ou rien.** Single-layer defenses tombent. Cinq layers est le consensus opératoire : alignement modèle, classifier input, system prompt hardening, isolation architecturale, output monitoring.
3. **Isolation architecturale > défenses comportementales.** Un modèle jailbroken qui ne peut pas joindre vos données ou appeler vos tools n'est pas un incident. Un modèle parfaitement aligné avec raw access à votre serveur email est un prompt injection away du désastre.
4. **Red-team continuously.** AgentDojo, AgentHarm, PyRIT, vos suites custom. Les nouvelles attaques émergent plus vite que les patches vendor.
5. **Modèle ↔ blast radius.** DeepSeek-R1 OK pour code completion en sandbox isolé ; pas OK pour agent customer-facing. Open-weights exigent des layers de défense que le modèle ne peut pas enforcer lui-même.
6. **Logger, auditer, assumer le breach.** Chaque déploiement production LLM va affronter au moins une prompt injection. La question est : la détectez-vous, la contenez-vous, recouvrez-vous ?

==L'arms race n'est pas gagné ; il est managé.== Rester courant, rester layered, et se rappeler que les LLMs restent ce junior employee intelligent et enthousiaste — sauf qu'ils ont maintenant les clés.

---

> [!WARNING] Trois pièges classiques (les trois sont 100 % traçables)
> **Confondre alignement et sécurité** — un Claude 3.7 calé sur RLHF tombe sur Policy Puppetry roleplay+leetspeak en cinq minutes (avril 2025 disclosure[^policy]). RLHF est nécessaire ; il n'est jamais suffisant. La sécurité ne vit pas dans le modèle ; elle vit dans la stack autour.
>
> **Trust des descriptions de tools MCP** — OX Security a poisoné **9 sur 11** registries MCP d'un seul payload test, confirmant l'exécution de commandes sur six plateformes production live[^oxsec-mcp]. Signed registries + version pinning + descriptions traitées comme untrusted. ==Si vous downloadez un MCP server depuis un registry public sans hash check, vous avez déjà signé le post-mortem.==
>
> **Single-layer defense** — un classifier, however good, est un bug away du bypass total. STACK (juin 2025) atteint 71 % ASR contre ShieldGemma sur ClearHarm catastrophic-misuse[^stack]. Defense-in-depth signifie supposer que **chaque** layer peut tomber. Une équipe qui déploie un agent sans avoir testé l'effondrement de **chacun** des cinq layers n'a pas un agent sécurisé — elle a un agent dont la chance n'a pas encore été testée.

---

## Sources

[^owasp2025]: OWASP Foundation, *OWASP Top 10 for LLM Applications 2025*, v4.2.0a, 14 nov. 2024. <https://owasp.org/www-project-top-10-for-large-language-model-applications/>

[^owasp-asi]: OWASP Foundation, *OWASP Agentic Security Initiative — Top 10 for Agentic Applications*, décembre 2025.

[^pair]: Chao, Robey, Dobriban, Hassani, Pappas, Wong, *Jailbreaking Black Box Large Language Models in Twenty Queries*, arXiv:2310.08419, NeurIPS 2023 SoLaR Workshop.

[^bon]: Hughes, Price, Lynch, Schaeffer, Barez, Koyejo, Sleight, Jones, Perez, Sharma, *Best-of-N Jailbreaking*, arXiv:2412.03556, 4 déc. 2024.

[^crescendo]: Russinovich, Salem, Eldan, *Great, Now Write an Article About That: The Crescendo Multi-Turn LLM Jailbreak Attack*, USENIX Security 2025 / arXiv:2404.01833.

[^policy]: HiddenLayer, *Novel Universal Bypass for All Major LLMs (Policy Puppetry)*, avril 2025. <https://www.hiddenlayer.com/research/novel-universal-bypass-for-all-major-llms>

[^cc1]: Sharma et al., *Constitutional Classifiers: Defending against Universal Jailbreaks*, arXiv:2501.18837, Anthropic, février 2025.

[^cc2]: Anthropic, *Constitutional Classifiers++: Efficient Production-Grade Defenses against Universal Jailbreaks*, arXiv:2601.04603, 9 janv. 2026.

[^agentdojo]: Debenedetti, Zhang, Balunovic, Beurer-Kellner, Fischer, Tramèr, *AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents*, NeurIPS 2024 / arXiv:2406.13352.

[^agentharm]: Andriushchenko et al., *AgentHarm: A Benchmark for Measuring Harmfulness of LLM Agents*, arXiv:2410.09024 / UK AI Safety Institute, oct. 2024.

[^injecagent]: Zhan et al., *InjecAgent: Benchmarking Indirect Prompt Injections in Tool-Integrated LLM Agents*, arXiv:2403.02691, 2024.

[^camel]: Debenedetti, Shumailov et al., *Defeating Prompt Injections by Design (CaMeL)*, arXiv:2503.18813, Google DeepMind, mars 2025.

[^cisco-ds]: Cisco / Robust Intelligence + UPenn, *Evaluating Security Risk in DeepSeek and Other Frontier Reasoning Models*, 29 janv. 2026.

[^survey-jb]: Wei et al., *Jailbreaking LLMs: A Survey of Attacks, Defenses and Evaluation*, TechRxiv, janvier 2026.

[^mao-survey]: Mao, Cui, Liu, You, Zhu, *From LLMs to MLLMs to Agents: A Survey of Emerging Paradigms in Jailbreak Attacks and Defenses*, arXiv:2506.15170, 2025.

[^willison-promptinj]: Simon Willison, *Prompt injection: What's the worst that can happen?*, ongoing series. <https://simonwillison.net/series/prompt-injection/>

[^dan]: 0xk1h0, *ChatGPT_DAN: Jailbreaks prompt*, GitHub community archive 2023-2025.

[^gcg]: Zou, Wang, Carlini, Nasr, Kolter, Fredrikson, *Universal and Transferable Adversarial Attacks on Aligned Language Models*, arXiv:2307.15043, juillet 2023.

[^msj]: Anil et al., *Many-shot Jailbreaking*, NeurIPS 2024 / Anthropic, avril 2024.

[^skeleton]: Russinovich, *Mitigating Skeleton Key, a new type of generative AI jailbreak technique*, Microsoft Security Blog, 26 juin 2024.

[^past]: Andriushchenko, Flammarion, *Does Refusal Training in LLMs Generalize to the Past Tense?*, arXiv:2407.11969, EPFL, juillet 2024.

[^mml]: *Jailbreak Large Vision-Language Models Through Multi-Modal Linkage*, arXiv:2412.00473.

[^cb]: Zou et al., *Improving Alignment and Robustness with Circuit Breakers*, NeurIPS 2024 / arXiv:2406.04313.

[^cb-multiturn]: *A Representation Engineering Perspective on the Effectiveness of Multi-Turn Jailbreaks*, arXiv:2507.02956, juin 2025.

[^stack]: *STACK: Adversarial Attacks on LLM Safeguard Pipelines*, arXiv:2506.24068, juin 2025.

[^repello-personas]: Repello AI, *Evil Confidant, AntiGPT, and DAN: The Jailbreak Personas That Still Work in 2026*, mars 2026.

[^mask-gcg]: *Mask-GCG: Are All Tokens in Adversarial Suffixes Necessary for Jailbreak Attacks?*, arXiv:2509.06350, 2025.

[^autoinject]: *Learning to Inject: Automated Prompt Injection via Reinforcement Learning*, arXiv:2602.05746, 2026.

[^yong]: Yong, Menghini, Bach, *Low-Resource Languages Jailbreak GPT-4*, arXiv:2310.02446, Brown University, oct. 2023.

[^spotlight]: Hines, Lopez, Hall, Zarfati, Zunger, Kiciman, *Defending Against Indirect Prompt Injection Attacks With Spotlighting*, arXiv:2403.14720, Microsoft Research, mars 2024.

[^struq]: Chen, Piet, Sitawarin, Wagner, *StruQ: Defending Against Prompt Injection with Structured Queries*, USENIX Security 2025 / arXiv:2402.06363.

[^secalign-bair]: BAIR, *Defending against Prompt Injection with Structured Queries (StruQ) and Preference Optimization (SecAlign)*, avril 2025.

[^greshake]: Greshake et al., *Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection*, arXiv:2302.12173, 2023.

[^ipi]: *Prompt Injection Attacks in LLM and AI Agent Systems: A Comprehensive Review*, MDPI Information 17(1):54, janvier 2026.

[^echoleak]: Microsoft Security Response Center, *EchoLeak (CVE-2025-32711)*, disclosed juin 2025.

[^slack-ai]: Kuznetsov et al., *Slack AI Data Exfiltration via RAG Poisoning*, août 2024.

[^reprompt]: Varonis Threat Labs, *Reprompt: Single-Click Microsoft Copilot Data Exfiltration*, CVE-2026-24307, janvier 2026.

[^mcptox]: *MCPTox: A Benchmark for Tool Poisoning Attack on Real-World MCP Servers*, arXiv:2508.14925, août 2025.

[^oxsec-mcp]: OX Security, *Critical Anthropic's MCP Vulnerability Enables Remote Code Execution Attacks*, avril 2026.

[^mcp-systematic]: *Systematic Analysis of MCP Security*, arXiv:2508.12538, 2025.

[^minja]: Dong et al., *MINJA: Memory Injection Attack on LLM Agents*, 2025 ; cf. arXiv:2601.05504v2.

[^memorygraft]: MemoryGraft research, décembre 2025 ; cf. Hannecke, *Agent Memory Poisoning — The Attack That Waits*, janvier 2026.

[^morris-ii]: Cohen et al., *Morris-II: Self-Replicating AI Worm Targeting RAG-Based Multi-Agent Systems*, arXiv:2403.02817, 2024.

[^qualys-ds]: Qualys, *DeepSeek Jailbreak Vulnerability Analysis*, mars 2025.

[^cai]: Bai et al., *Constitutional AI: Harmlessness from AI Feedback*, arXiv:2212.08073, Anthropic, 2022.

[^llamaguard]: Inan et al., *Llama Guard: LLM-based Input-Output Safeguard for Human-AI Conversations*, arXiv:2312.06674, Meta, déc. 2023.

[^shieldgemma]: Google, *ShieldGemma 1 / 2*, model cards 2024-2025.

[^watchdog]: Microsoft Security Response Center, *How Microsoft defends against indirect prompt injection attacks*, juillet 2025.

[^pyrit]: Microsoft Azure, *PyRIT: Python Risk Identification Tool for AI*, open-source. <https://github.com/Azure/PyRIT>

[^willison-dual]: Simon Willison, *The Dual LLM pattern for building AI assistants that can resist prompt injection*, avril 2023.

[^russinovich-junior]: Russinovich, *Microsoft Reveals 'Skeleton Key': A Powerful New AI Jailbreak Technique*, juin 2024.
