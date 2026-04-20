/* ═════════════════════════════════════════════════════════════
   LAYERS — 10 concentric layers of an agentic system
   Ordered core → outside: 00 LLM core … 09 Governance
   ═════════════════════════════════════════════════════════════ */
const LAYERS = [
  {
    num: '00',
    short: 'Non-déterminisme',
    title: "Au cœur, <em>un tirage probabiliste</em>",
    color: '#C34E3A',
    question: "Si le cœur est un dé, comment bâtir un système fiable autour ?",
    narrative: "Tout système agentique commence ici — à la sortie du modèle, une <strong>distribution de probabilité</strong> sur le vocabulaire. Un softmax aplati par la température, un échantillonnage top-p, et le token suivant est tiré. Mêmes inputs, outputs variables&nbsp;: la stochasticité n'est pas un bug mais la <em>nature du cœur</em>. Toute la stack qui suit existe pour <strong>domestiquer cette variance</strong> sans la tuer, car c'est précisément elle qui rend le modèle capable de raisonner.",
    concepts: ['Température', 'Top-p sampling', 'Softmax', 'Stochasticité', 'Seed'],
    roles: ['ML Engineer', 'Research Scientist', 'Prompt Engineer'],
    risk: "Traiter le LLM comme une fonction pure qui renvoie toujours la même chose. En prod, un <code>T=0,7</code> rejoué mille fois produit mille trajectoires distinctes. <strong>La reproductibilité bit-à-bit n'existe pas</strong> — on vise la reproductibilité statistique, et on évalue sur des distributions, pas sur des cas isolés.",
    illusCaption: "Le noyau stochastique — origine de toute la stack agentique."
  },
  {
    num: '01',
    short: 'Boucle agent',
    title: "La boucle <em>Reason · Act · Observe</em>",
    color: '#D26E3E',
    question: "Qu'est-ce qui transforme un LLM bavard en agent capable d'enchaîner plusieurs tours ?",
    narrative: "Yao et al. le formalisent en 2022 sous le nom <strong>ReAct</strong>&nbsp;: le modèle raisonne (<em>Thought</em>), propose une action (<em>Act</em>), le runtime l'exécute, le résultat est ré-injecté. La boucle pivote sur un champ&nbsp;: <code>stop_reason</code>. Quand il vaut <code>end_turn</code>, on répond à l'utilisateur&nbsp;; quand il vaut <code>tool_use</code>, on appelle un outil et on ré-entre. Le code qui enveloppe ce cycle s'appelle un <em>harness</em> — et c'est lui, bien plus que le modèle, qui distingue un POC d'un produit.",
    concepts: ['ReAct', 'stop_reason', 'Harness', 'Runner', 'Graph execution'],
    roles: ['Agent Engineer', 'ML Engineer', 'Backend Engineer'],
    risk: "Laisser tourner la boucle sans garde-fou&nbsp;: un agent qui <em>ne s'arrête jamais</em>. Sans budget de tours, sans détection de cycle, sans plafond de tokens, un agent entre dans un <strong>loop infini à 4&nbsp;$/minute</strong>. Le harness doit être défensif par défaut.",
    illusCaption: "Anneau 01 — la boucle qui encapsule le noyau."
  },
  {
    num: '02',
    short: 'Outils',
    title: "Les outils — <em>les mains de l'agent</em>",
    color: '#DC9042',
    question: "Quelles actions l'agent peut-il réellement exécuter, avec quels droits, sur quels systèmes ?",
    narrative: "Sans outils, le LLM génère du texte. Avec outils, il <strong>agit</strong>&nbsp;: il interroge une base, écrit un fichier, appelle une API, exécute du code. Chaque outil est décrit par un schéma JSON qui énonce son nom, ses paramètres et leur type&nbsp;; le modèle choisit, le runtime exécute. Web search, code execution, file operations, navigation — ce sont ces briques d'action qui font la différence entre <em>un chat</em> et <em>un agent</em>. Le choix des outils exposés est la décision d'architecture la plus chargée de la stack.",
    concepts: ['Function calling', 'tool_use', 'JSON Schema', 'Web search', 'Code execution'],
    roles: ['Agent Engineer', 'Integrations Engineer', 'API Designer'],
    risk: "Exposer un outil <code>execute_sql</code> sans scoping ni sandbox. Sous prompt injection indirecte, l'agent exfiltre la base en trois tours. Variante&nbsp;: le <strong>tool poisoning</strong> — une description d'outil malicieuse détourne l'intention. OWASP ASI02 documente la famille entière.",
    illusCaption: "Anneau 02 — la surface d'action sur le monde."
  },
  {
    num: '03',
    short: 'Contexte',
    title: "Contexte <em>&amp; mémoire</em>",
    color: '#C5A23A',
    question: "Comment un agent se souvient-il de la conversation d'hier, du projet en cours, du dernier résultat de son sous-agent ?",
    narrative: "La fenêtre de contexte est un <strong>budget</strong>, pas un entrepôt. La mémoire court-terme vit dans la session&nbsp;; la mémoire long-terme s'externalise — vers une base vectorielle, un memory bank, un résumé condensé par <em>compaction</em>. Anthropic en fait une discipline à part entière (<em>context engineering</em>), Google propose <em>Memory Bank</em>, Mem0 capitalise sur la mémoire inter-conversations. Dans un agent qui tourne plus de vingt minutes, c'est la couche la plus négligée — et la plus coûteuse quand elle est mal faite.",
    concepts: ['Context window', 'Compaction', 'Memory Bank', 'Mem0', 'RAG'],
    roles: ['Context Engineer', 'RAG Engineer', 'Data Engineer'],
    risk: "Rejouer tout l'historique à chaque tour. <strong>La facture grimpe exponentiellement</strong> — un agent de deux heures coûte dix fois un agent de vingt minutes. Sans stratégie de compaction, le modèle perd aussi le fil&nbsp;: il rate la question simple posée quarante minutes plus tôt.",
    illusCaption: "Anneau 03 — la mémoire qui survit à la session."
  },
  {
    num: '04',
    short: 'Patterns',
    title: "Patterns de <em>référence</em>",
    color: '#8FA446',
    question: "Agent autonome ou workflow orchestré&nbsp;? Quelle topologie pour quelle tâche ?",
    narrative: "Schluntz &amp; Zhang (Anthropic, décembre 2024) distinguent <strong>six patterns canoniques</strong>&nbsp;: Augmented&nbsp;LLM, Prompt&nbsp;chaining, Routing, Parallelization, Orchestrator-workers, Evaluator-optimizer. Règle transversale&nbsp;: <em>start simple, measure, add complexity only when it delivers measurable value</em>. Un workflow bien routé résout soixante-dix pour cent des cas sans jamais mériter l'étiquette “agentique”. Le pattern est un choix d'architecture&nbsp;; il engage le coût, la latence et la dette de maintenance pour les mois à venir.",
    concepts: ['Augmented LLM', 'Prompt chaining', 'Routing', 'Parallelization', 'Orchestrator-workers'],
    roles: ['Solutions Architect', 'Agent Engineer', 'Technical Lead'],
    risk: "Sortir l'artillerie multi-agent pour un besoin qu'un workflow aurait résolu. <strong>Multi-agent = dix à quinze fois plus de tokens</strong> qu'un single-agent. Mois contre semaines de delivery. Et un debug qui devient exponentiellement plus difficile à mesure qu'on ajoute des sous-agents.",
    illusCaption: "Anneau 04 — le choix de topologie qui conditionne tout."
  },
  {
    num: '05',
    short: 'Protocoles',
    title: "Multi-agent <em>&amp; protocoles</em>",
    color: '#4B9466',
    question: "Comment des agents hétérogènes se parlent-ils, découvrent leurs outils, sans se coupler à un SDK propriétaire ?",
    narrative: "Trois protocoles dessinent l'interopérabilité. <strong>MCP</strong> (Anthropic, nov. 2024) relie l'agent à ses outils&nbsp;; <strong>A2A</strong> (Google, avr. 2025) relie deux agents pairs via une <em>Agent Card</em> publiée à <code>/.well-known/agent-card.json</code>&nbsp;; <strong>AG-UI</strong> (CopilotKit) relie l'agent à son frontend en SSE. 97&nbsp;millions de téléchargements mensuels côté MCP, plus de cent supporters côté A2A — et une gouvernance neutre à la <em>Linux Foundation AAIF</em> depuis décembre 2025. C'est la couche qui empêche la stack de se balkaniser.",
    concepts: ['MCP', 'A2A', 'AG-UI', 'Agent Card', 'Handoffs'],
    roles: ['Integrations Engineer', 'Platform Architect', 'Protocol Designer'],
    risk: "Réinventer MCP en propriétaire. Chaque SDK qui fige son propre protocole <strong>enferme ses outils dans sa chapelle</strong>. Le jour du changement de vendor, la migration coûte des trimestres. La gouvernance neutre n'existe pas pour rien.",
    illusCaption: "Anneau 05 — la langue commune des systèmes agentiques."
  },
  {
    num: '06',
    short: 'Guardrails',
    title: "Guardrails, HITL <em>&amp; sécurité</em>",
    color: '#3E8A8F',
    question: "À quel moment bloquer, demander confirmation, laisser passer — et qui porte le risque ?",
    narrative: "L'OWASP publie en décembre 2025 son <strong>Top 10 for Agentic Applications</strong>&nbsp;: Agent Goal Hijack, Tool Misuse, Identity &amp; Privilege Abuse, Rogue Agents… Principe directeur&nbsp;: <em>least agency</em> — ne jamais donner plus d'autonomie que le problème ne le justifie. Trois mécanismes concrets&nbsp;: <strong>sandboxing</strong> (AgentCore Runtime, Claude Managed Agents), <strong>permission modes</strong> et <strong>HITL</strong> via <code>interrupt()</code> pour les actions irréversibles. Une couche qui coûte au débit et se paie au centuple en incident évité.",
    concepts: ['Least agency', 'HITL', 'Prompt injection', 'Sandboxing', 'OWASP ASI'],
    roles: ['Security Engineer', 'AI Safety Lead', 'RSSI', 'Red Team'],
    risk: "48&nbsp;% des pros cybersécurité placent l'agentique en <strong>top vecteur d'attaque 2026</strong>, mais seules 34&nbsp;% des entreprises ont des contrôles spécifiques. Un agent admin sans HITL plus une injection indirecte égale <em>l'incident post-mortem télévisé</em> que personne ne veut signer.",
    illusCaption: "Anneau 06 — les garde-fous qui encadrent l'autonomie."
  },
  {
    num: '07',
    short: 'Observabilité',
    title: "Observabilité <em>&amp; évaluation</em>",
    color: '#3F75A5',
    question: "L'agent ne <em>crashe</em> pas, il <em>dérive</em>. Comment voir sa trajectoire, ses coûts, sa qualité ?",
    narrative: "Le standard converge&nbsp;: <strong>OpenTelemetry GenAI Semantic Conventions</strong> unifie les traces, avec des attributs <code>gen_ai.*</code> normalisés. Langfuse, Braintrust, Arize, LangSmith, Dynatrace et AgentCore Observability s'y alignent. On évalue par <em>trajectory inspection</em>, <em>tool-use accuracy</em>, task completion rate, et de plus en plus par LLM-as-a-Judge. 89&nbsp;% des organisations ayant des agents en production ont déjà une forme d'observabilité dédiée — parce que l'APM classique y est <strong>structurellement aveugle</strong>.",
    concepts: ['OTel GenAI', 'Trajectory eval', 'LLM-as-a-Judge', 'Cost attribution', 'Drift detection'],
    roles: ['Observability Engineer', 'Evaluation Engineer', 'SRE'],
    risk: "POC sans observabilité = <strong>dette technique massive</strong> le jour du passage en production. On ne corrige pas ce qu'on ne voit pas — on invente des hypothèses, on rejoue des cas au hasard, et le glissement comportemental se creuse à bas bruit jusqu'à l'incident.",
    illusCaption: "Anneau 07 — voir, mesurer, attribuer."
  },
  {
    num: '08',
    short: 'Runtime',
    title: "Runtime managé <em>&amp; déploiement</em>",
    color: '#5461A0',
    question: "Sessions, sandbox, scaling, isolation — qui opère ces services au quotidien, vous ou le cloud ?",
    narrative: "La couche la plus récente&nbsp;; aussi la plus contestée. <strong>Claude Managed Agents</strong> (public beta, avril 2026), <strong>OpenAI Agent Builder</strong>, <strong>Vertex AI Agent Engine</strong>, <strong>Azure AI Foundry Agent Service</strong> (GA mai 2025), <strong>AWS Bedrock AgentCore</strong> (GA octobre 2025, huit services composables). Tarification <em>consumption-based</em>, attente I/O souvent gratuite, sandbox managée, isolation par session. Le gain est réel&nbsp;; la dépendance aussi.",
    concepts: ['Claude Managed Agents', 'AgentCore', 'Vertex Agent Engine', 'Foundry Service', 'Sandbox'],
    roles: ['Platform Engineer', 'Cloud Architect', 'SRE', 'FinOps'],
    risk: "Vendor lock-in managé sans portabilité. Le jour où les prix bougent ou le vendeur dé-supporte une feature, <strong>le coût de migration dépasse le gain initial</strong>. Code-first plus protocoles ouverts — MCP, A2A — restent la meilleure assurance contre la lock-in.",
    illusCaption: "Anneau 08 — l'infrastructure qui fait tourner tout cela."
  },
  {
    num: '09',
    short: 'Gouvernance',
    title: "Gouvernance, <em>FinOps &amp; adoption</em>",
    color: '#7C5092',
    question: "Qui paie, qui valide, qui arrête — et l'utilisateur final, <em>s'en sert-il vraiment</em>&nbsp;?",
    narrative: "Gartner est formel&nbsp;: <strong>40&nbsp;% des projets d'IA agentique seront annulés d'ici 2027</strong>. Cinq causes récurrentes&nbsp;: valeur business floue, data pas prête, TCO qui explose, Responsible AI traité en afterthought, change management négligé. La couche extérieure n'est pas décorative&nbsp;: c'est elle qui <em>décide</em>, tranche, arbitre entre POC impressionnants et produits tenables. L'<em>AI Act</em> européen y ajoute une couche réglementaire — obligations par niveau de risque, documentation technique, surveillance humaine.",
    concepts: ['AI Canvas', 'FinOps', 'TCO', 'EU AI Act', 'Responsible AI'],
    roles: ['CDO / CAIO', 'Sponsor', 'Product Manager', 'Change Manager', 'DPO'],
    risk: "L'échec n'est pas technique — il est de <strong>valeur, de coût, de confiance</strong>. Un agent brillant dont personne ne se sert est juste une facture mensuelle. Une gouvernance saine <em>sait tuer</em> un cas d'usage au bon moment — avant qu'il ne tue un budget.",
    illusCaption: "Anneau 09 — la couche qui décide de tout."
  }
];

/* ═════════════════════════════════════════════════════════════
   CONCEPT DEFINITIONS — one short definition per concept key
   Keys exactly match LAYERS[*].concepts
   ═════════════════════════════════════════════════════════════ */
const CONCEPT_DEFS = {
  // 00 — LLM core
  'Température': "Scalaire qui aplatit ou contracte la distribution softmax avant le tirage. <code>T=0</code> ≈ argmax déterministe ; <code>T&gt;0</code> = sampling pondéré. Au-delà de 0,7, la créativité grimpe et la reproductibilité s'effondre.",
  'Top-p sampling': "<em>Nucleus sampling</em>. Tire parmi le plus petit sous-ensemble de tokens dont la proba cumulée atteint <code>p</code>. Typiquement <code>p=0,9</code>, souvent couplé à la température.",
  'Softmax': "Transforme les logits bruts en distribution de probabilité sommant à 1. Dernière étape avant le tirage — le lieu précis où la stochasticité prend forme.",
  'Stochasticité': "Propriété fondamentale à <code>T&gt;0</code> : mêmes inputs, outputs variables. L'agentique accumule cette variance à chaque tool call, chaque sous-agent, chaque boucle.",
  'Seed': "Fixer un seed est un leurre : opérations GPU non associatives, batching dynamique et versions de modèle introduisent des résidus. <strong>La reproductibilité bit-à-bit n'existe pas.</strong>",

  // 01 — Loop
  'ReAct': "Paradigme <em>Reasoning + Acting</em> (Yao et al., ICLR 2023). L'agent alterne <code>Thought</code> et <code>Act</code> avec observation des résultats. Base de tous les harness actuels.",
  'stop_reason': "Champ de l'API qui pivote la boucle : <code>end_turn</code>, <code>tool_use</code>, <code>max_tokens</code>, <code>stop_sequence</code>. Le commutateur qui décide de rendre la main ou de ré-entrer.",
  'Harness': "Code qui enveloppe la boucle : gestion des tools, compaction, hooks, permissions, retries. C'est ce qui reste quand on retire le modèle — et ce qui distingue un POC d'un produit.",
  'Runner': "Équivalent OpenAI du harness. <code>Runner.run()</code> exécute la boucle d'un agent jusqu'à complétion, gérant tools, handoffs, sessions et guardrails.",
  'Graph execution': "Approche LangGraph : l'agent comme <code>StateGraph</code> avec nœuds, arcs, checkpointing. Permet <code>interrupt()</code> HITL et <em>durable execution</em>.",

  // 02 — Tools
  'Function calling': "Capacité du modèle à produire un appel structuré vers une fonction externe décrite par JSON Schema. Introduit par OpenAI en juin 2023, désormais universel.",
  'tool_use': "Type de <em>content block</em> Anthropic. Le modèle émet un <code>tool_use</code> (nom + input JSON) ; le harness exécute et répond avec <code>tool_result</code>.",
  'JSON Schema': "Standard de description des inputs attendus. Le modèle s'en sert pour générer des arguments structurés. Bien écrit, c'est la moitié du travail d'un bon tool.",
  'Web search': "Outil built-in donnant accès live au web. GA chez Anthropic depuis avril 2026, également chez OpenAI et Google. Payant à la requête, pas juste au token.",
  'Code execution': "Sandbox Python/JS pour calculer, transformer, visualiser. Gratuit chez Anthropic quand couplé à web_search. Environnement isolé, jetable entre les turns.",

  // 03 — Context
  'Context window': "Taille max de l'historique + prompt + outputs par tour. Jusqu'à 1 M tokens chez Claude 4.6+. Mais une fenêtre longue n'est pas synonyme d'attention parfaite — <em>lost in the middle</em> reste valide.",
  'Compaction': "Stratégie Anthropic pour résumer automatiquement l'historique quand il approche le budget. Préserve les infos clés, évite le cycle <em>context explosion → lag → facture</em>.",
  'Memory Bank': "Service managé Google (Vertex Agent Engine, GA déc. 2025) pour mémoire inter-sessions avec extraction automatique des faits persistants.",
  'Mem0': "Framework open source de mémoire long terme : extraction, consolidation, retrieval. Standard de facto quand on ne veut pas se coupler à un cloud.",
  'RAG': "<em>Retrieval-Augmented Generation</em>. Indexer en chunks, vectoriser, récupérer au moment de la query, injecter. 80 % des échecs RAG viennent d'un mauvais chunking.",

  // 04 — Patterns
  'Augmented LLM': "Brique de base (Schluntz &amp; Zhang, 2024) : LLM + retrieval + tools + memory. Tous les patterns supérieurs composent celui-ci. Commencez toujours là.",
  'Prompt chaining': "Décomposer une tâche en étapes séquentielles avec <em>gates</em> programmatiques. Prédictible, debuggable, peu coûteux.",
  'Routing': "Classifier l'input puis diriger vers le sous-workflow spécialisé. Un routeur fin bat un agent généraliste sur 80 % des conversations.",
  'Parallelization': "Deux variantes. <em>Sectioning</em> : diviser, un worker par sous-tâche. <em>Voting</em> : N agents en parallèle pour robustesse par consensus.",
  'Orchestrator-workers': "Un orchestrateur planifie et délègue dynamiquement à des workers dont le nombre n'est <strong>pas fixé à l'avance</strong>. Pattern des agents de coding Anthropic.",

  // 05 — Protocoles
  'MCP': "<strong>Model Context Protocol</strong>. Standard JSON-RPC agent↔tools. Anthropic (nov. 2024) → Linux Foundation (déc. 2025). 97 M téléchargements SDK mensuels.",
  'A2A': "<strong>Agent-to-Agent Protocol</strong>. Standard stateful agent↔agent. Google (avr. 2025) → Linux Foundation (juin 2025). 100+ supporters enterprise.",
  'AG-UI': "<strong>Agent-User Interaction Protocol</strong>. Événementiel (SSE) pour streamer raisonnements, états, tool results vers les frontends.",
  'Agent Card': "Manifeste A2A publié à <code>/.well-known/agent-card.json</code>. Décrit capacités, endpoints, modalités, auth. Le <code>robots.txt</code> des agents.",
  'Handoffs': "Pattern OpenAI où le contrôle passe d'un agent à un autre via un tool-call. <strong>Un seul agent actif à la fois</strong>, stack-like.",

  // 06 — Guardrails
  'Least agency': "Principe OWASP ASI 2026. <strong>Ne jamais donner plus d'autonomie que la tâche ne l'exige</strong>. Restrictive-by-default sur tools, credentials, authority.",
  'HITL': "<em>Human-in-the-loop</em>. Point de pause explicite avant action critique. <code>interrupt()</code> (LangGraph), <code>permission_mode</code> (Anthropic). Obligatoire pour paiements et déploiements prod.",
  'Prompt injection': "Input qui détourne les instructions système. Version <em>indirecte</em> : instructions cachées dans un document lu par l'agent. OWASP ASI01.",
  'Sandboxing': "Exécution isolée des actions — code, browser, fichiers. AgentCore Runtime, Claude Managed Agents. Seule défense efficace contre un agent compromis.",
  'OWASP ASI': "Top 10 for Agentic Applications, publié déc. 2025. Goal hijack, tool misuse, identity abuse, rogue agents… <strong>48 % des pros cyber</strong> le placent en top vecteur 2026.",

  // 07 — Observability
  'OTel GenAI': "<em>OpenTelemetry Semantic Conventions for GenAI</em>. Attributs <code>gen_ai.*</code> normalisés. Adopté par Langfuse, LangSmith, Dynatrace, Azure Foundry, AgentCore.",
  'Trajectory eval': "Évaluer la <strong>séquence complète</strong> des décisions et actions, pas juste le résultat final. Détecte détours, tool calls ratés, bouclage.",
  'LLM-as-a-Judge': "Un LLM évalue les outputs d'un autre selon des critères (factualité, helpfulness, safety). Scalable mais <strong>moins fiable qu'un juge humain</strong> — à calibrer.",
  'Cost attribution': "Affecter les tokens aux users, tenants, features. Prérequis du FinOps GenAI. Sans attribution, la facture arrive sans responsable.",
  'Drift detection': "Surveillance des dérives comportementales : data drift, concept drift, trajectory drift. Invisibles à l'APM classique. <em>L'agent ne crashe pas — il dérive.</em>",

  // 08 — Runtime
  'Claude Managed Agents': "Runtime Anthropic en public beta (avr. 2026). Architecture <em>brain/hands separation</em> : Claude décide, le runtime exécute. Sandbox, sessions isolées, SSE streaming.",
  'AgentCore': "<em>Amazon Bedrock AgentCore</em>, GA oct. 2025. Huit services composables framework-agnostic : Runtime, Memory, Gateway, Identity, Observability, Browser, Code, Policy.",
  'Vertex Agent Engine': "Runtime managé Google. Sessions + Memory Bank (GA déc. 2025), Agent Garden, Agent Designer. Intégré Cloud Trace et IAM.",
  'Foundry Service': "<em>Azure AI Foundry Agent Service</em>, GA mai 2025. 10 000+ orgs. Agents persistants, Entra Agent ID, Connected Agents pour orchestration stateful.",
  'Sandbox': "Environnement d'exécution isolé opéré par le cloud. Libère du plumbing (VM, container, cleanup) mais impose son modèle de coût et de capacités.",

  // 09 — Governance
  'AI Canvas': "Outil de cadrage par cas d'usage : valeur business, faisabilité, risques, KPI, coûts. L'équivalent du Business Model Canvas pour l'IA.",
  'FinOps': "Intégrer le suivi coût dès le jour 1 : prompt caching, model routing, budgets tenant, visibilité continue. Gartner place le TCO hors contrôle en cause #3 d'annulation.",
  'TCO': "<em>Total Cost of Ownership</em>. Tokens + infra + stockage vectoriel + observabilité + licences + équipe + incidents. Le coût par token semble négligeable — le TCO, pas du tout.",
  'EU AI Act': "Règlement 2024/1689, application progressive 2025-2027. Obligations par niveau de risque, documentation technique, surveillance humaine.",
  'Responsible AI': "Quatre piliers (Gartner) : <strong>safety, privacy, accountability, fairness</strong>. À placer au cœur dès l'inception, pas en afterthought."
};

/* ═════════════════════════════════════════════════════════════
   ROLE DEFINITIONS — one-line mission for each role key
   ═════════════════════════════════════════════════════════════ */
const ROLE_DEFS = {
  'ML Engineer': "Entraîne, fine-tune et sert les modèles ; règle température, top-p, stratégies de sampling.",
  'Research Scientist': "Pousse les limites du sampling et de la reproductibilité statistique.",
  'Prompt Engineer': "Écrit, versionne et évalue les prompts système ; traque la variance comportementale.",
  'Agent Engineer': "Écrit le harness, la boucle, la gestion des tools — le code qui enveloppe le modèle.",
  'Backend Engineer': "Opère les endpoints, la persistance, le scaling — la plomberie sous l'agent.",
  'Integrations Engineer': "Connecte l'agent aux systèmes — CRM, ERP, APIs internes, SaaS tiers.",
  'API Designer': "Conçoit les schémas JSON, les noms d'outils, la surface d'actions exposée au modèle.",
  'Context Engineer': "Discipline Anthropic : architecte le contexte, la compaction, la mémoire de session.",
  'RAG Engineer': "Chunking, indexation, retrieval, reranking — la qualité de ce que l'agent lit.",
  'Data Engineer': "Pipelines, qualité, gouvernance des données nourrissant les bases vectorielles.",
  'Solutions Architect': "Choisit le pattern — workflow, single-agent, multi-agent — pour chaque cas d'usage.",
  'Technical Lead': "Arbitre entre simplicité, coût et ambition ; tient la dette d'architecture.",
  'Platform Architect': "Dessine la topologie inter-agents et les frontières de responsabilité.",
  'Protocol Designer': "Spécifie les contrats — MCP, A2A, AG-UI, Agent Cards — pour l'interopérabilité.",
  'Security Engineer': "Implémente sandbox, permissions, HITL ; threat-model l'agent comme un insider.",
  'AI Safety Lead': "Porte les principes <em>least agency</em> et l'analyse de risque OWASP ASI.",
  'RSSI': "Chief Information Security Officer. Valide la posture sécurité, engage sa signature.",
  'Red Team': "Attaque l'agent par prompt injection, tool poisoning, goal hijack. Trouve avant les autres.",
  'Observability Engineer': "Instrumente OTel GenAI, pose les spans, les attributs, les dashboards.",
  'Evaluation Engineer': "Construit les suites d'éval — trajectory, tool-use, task completion, LLM-as-a-Judge.",
  'SRE': "Site Reliability Engineer. Garde l'agent en vie : latence, taux d'erreur, coûts, SLO.",
  'Platform Engineer': "Opère le runtime managé ; choisit, configure, tune AgentCore / Foundry / Vertex.",
  'Cloud Architect': "Choisit vendors, régions, services managés ; arbitre portabilité contre vélocité.",
  'FinOps': "Attribue les coûts, négocie les budgets, détecte les dérives tarifaires en continu.",
  'CDO / CAIO': "Chief Data / AI Officer. Porte la stratégie agentique au niveau exécutif.",
  'Sponsor': "Business owner qui engage le budget et tranche en cas de conflit valeur / risque.",
  'Product Manager': "Cadre le cas d'usage, les KPI, le parcours utilisateur, les critères de succès.",
  'Change Manager': "Accompagne les équipes métier — formation, adoption, redistribution des rôles.",
  'DPO': "Data Protection Officer. Conformité RGPD &amp; EU AI Act — documentation, registres, audits."
};

/* ═════════════════════════════════════════════════════════════
   SPREADS — page order (left, right)
   ═════════════════════════════════════════════════════════════ */
/* Schemas interleaved immediately after the layer they illustrate.
   Mapping: schemaIdx -> layerIdx it belongs to (see book-schemas.js SCHEMAS[].layerIdx).
   We build dynamically so mapping stays declarative. */
const SPREADS = (() => {
  const out = [{ kind: 'cover' }, { kind: 'toc' }];
  const schemasByLayer = {};
  // Read from SCHEMAS if loaded; else fall back to known mapping.
  const known = (typeof SCHEMAS !== 'undefined') ? SCHEMAS : [
    { layerIdx: 1 }, { layerIdx: 4 }, { layerIdx: 6 }, { layerIdx: 7 }
  ];
  known.forEach((s, i) => {
    (schemasByLayer[s.layerIdx] = schemasByLayer[s.layerIdx] || []).push(i);
  });
  LAYERS.forEach((_, i) => {
    out.push({ kind: 'layer', layerIdx: i });
    (schemasByLayer[i] || []).forEach(schemaIdx => {
      out.push({ kind: 'schema', schemaIdx });
    });
  });
  out.push({ kind: 'closing' }, { kind: 'colophon' });
  return out;
})();
