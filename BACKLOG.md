# Backlog éditorial — illustrated deep research
_Mis à jour par la routine `Illustrated deep research · mer + ven`._

## En cours / prio haute
- [ ] 2026-05-13 · process-reward-models · deep dive sur `modeles-raisonnement` — anatomie des PRM (Lightman, Math-Shepherd, GenRM/ThinkPRM, RLVR/DeepSeek-R1) ; thèse : marché du notateur en consolidation (fusion / évanescence / spécialisation / externalisation) ; reward hacking + faithfulness ; économie de l'annotation procédurale (Scale, Surge, PhDs annotation)
- [ ] 2026-05-11 · ia-frugale · frameworks d'analyse et de mesures (kWh/token, gCO₂eq, WUE/PUE, ML CO2 Impact, Green Algorithms, MLCO2, ISO/IEC 21031, méthodologie AIE 2026, Code of Conduct EU pour data centers) · histoire (de Strubell et al. 2019 au rapport AIE 2026, Frugal AI Challenge, distillation/quantification/MoE comme leviers structurels) · où on va (small language models, on-device, sparse MoE, hardware spécialisé, refroidissement liquide, mix énergétique, datacenters nucléarisés) · estimer l'impact (cycle de vie : training vs inference vs embodied carbon ; ratios par modalité texte/image/vidéo ; ordres de grandeur par requête vs recherche Google vs streaming) · debunk rationnel des croyances : eau (vraie consommation WUE par data center, scope 1 vs 2, où l'eau est réellement consommée et où elle est juste prêtée), électricité (TWh annualisés vs pic local sur le grid, cannibalisation des renouvelables, comparaison avec crypto/streaming/cloud non-IA), empreinte par requête (les ordres de grandeur réels vs les chiffres viraux), embodied carbon des GPU (souvent oublié), rebond Jevons

## Deep dives candidats sur dossiers existants
- harness-agentique : zoom sur le scheduler et la file d'attente d'outils
- observabilite-agents-ia : trace OpenTelemetry GenAI semconv en production
- memoire-agentique : compaction et oubli sélectif
- evaluation-agentique : benchmarks agentiques contestés (SWE-bench, GAIA)
- mcp-plateforme : OWASP MCP Top 10, dissection des 10 vecteurs et matrice défensive
- mcp-plateforme : MCP en production enterprise — patterns d'isolation, audit log OTel, OAuth 2.0 + PKCE

## Sujets evergreen — backlog
- Process Reward Models et verifier-as-a-service — le marché des « notateurs »
- AlphaProof / Lean / formal math — la branche démonstrations formelles du raisonnement
- Synthetic data et model collapse — Shumailov et al.
- Souveraineté des semi-conducteurs (TSMC, ASML, Nvidia, AMD MI400)
- Energy footprint des LLMs en 2026 — data centers et grids
- Edge AI / on-device — Apple Intelligence, Phi-5, Gemma
- Speculative decoding et batching dynamique (vLLM, SGLang, TensorRT-LLM)

## Watchlist actu
- Claude 4.7 — sortie Opus / Sonnet, benchmarks
- AI Act — premiers contrôles d'organismes notifiés (été 2026)
- AISI / NIST — frontier model evals publiées
- M&A : Mistral / Cohere / xAI
- Procès Musk v. Altman — verdict mi-mai 2026
- AAIF — révision majeure de la spec MCP attendue automne 2026 (signature Sigstore, isolation, audit log)
- A2A (Google) — adoption cross-vendor ou absorption par MCP via sampling/subagents

## Déjà couverts (date · slug · angle)
- 2026-05-12 · coding-agents · Claude Code / Codex CLI / Copilot, anatomie + pyramide d'usage 4 étages (transverse / data quotidien / data expert / produit-décideurs), retex chiffrés vs benchmarks publics
- 2026-05-08 · mcp-plateforme · effet de réseau, donation Linux Foundation, surface d'attaque tool-poisoning + cross-server, layering MCP / function calling / OpenAPI / A2A
- 2026-05-06 · modeles-raisonnement · pivot o1, RLVR, second axe scaling, anatomie raisonneur, faithfulness, diffusion
- 2026-05-06 · economie-inference · LLMflation, pile logicielle, désagrégation, MoE, mix matériel, marges
- 2026-04-21 · gouvernance-agentic · scrolly AI Act
- 2026-04-27 · proces-musk-altman · veille jour-J
- 2026-04-28 · llm-jailbreaking · asymétrie attaque/défense
- 2026-04-29 · harness-agentique · couche d'orchestration
- 2026-04-30 · memoire-agentique · learning gap
- 2026-04-30 · observabilite-agents-ia · cognitive audit trail
- 2026-05-01 · evaluation-agentique · trajectoires et juges
- 2026-05-02 · agents-computer-use · pilotage écran
- 2026-05-04 · ia-et-travail · cartographie politique
- 2026-05-05 · narrative-experiences · troisième voie
- 2026-05-05 · world-models · physique apprise
