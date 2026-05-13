# Process Reward Models — l'écho-chambre du raisonnement

> 13 mai 2026 — Mathieu Guglielmino

Deep dive sur `modeles-raisonnement` : anatomie de la couche notateur du raisonnement LLM, des PRM de Lightman (OpenAI 2023) au pivot DeepSeek-R1 (2025), en passant par les generative verifiers (Zhang 2024, ThinkPRM 2025) et la découverte du reward hacking invisible (Anthropic / OpenAI 2025).

## Formats

- **Rapport interactif** — [`20260513-process-reward-models-app.html`](20260513-process-reward-models-app.html). Six schémas cliquables, douze sources reliées, sommaire latéral. Ouvrir directement dans un navigateur.
- **Rapport markdown** — [`20260513-process-reward-models-rapport.md`](20260513-process-reward-models-rapport.md). Source texte, schémas référencés en syntaxe Obsidian, footnotes numérotées.

## Schémas (6)

1. ORM vs PRM — noter la destination ou noter le chemin
2. Math-Shepherd — annotation step-level par rollouts MCTS
3. Trois familles de récompenses (ORM, PRM, RLVR)
4. Discriminative vs generative verifier
5. Le reward hacking invisible — exploitation vs verbalisation
6. Quatre trajectoires pour la couche notateur (2027-2028)

## Disclosure

Format co-écrit avec l'aide d'une IA.
