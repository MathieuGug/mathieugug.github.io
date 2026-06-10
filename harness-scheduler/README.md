# Le scheduler du harness agentique

> 10 juin 2026 — Mathieu Guglielmino

Deep dive sur la couche scheduler du harness agentique : selector, queue, budget tracker, parallelizer, retry / timeout. Cinq stratégies (sequential, parallel-batch, DAG-planned, speculative, anytime), trois budgets orthogonaux (tokens × latence × $), matrice retry × idempotence à quatre quadrants, matrice de sept harness production (Claude Code, Cursor, OpenHands, Aider, LangGraph, Devin, Manus), trajectoires 2026-2028.

## Formats

- **[`20260610-harness-scheduler-app.html`](./20260610-harness-scheduler-app.html)** — rapport interactif (8 sections, 6 schémas cliquables, glossaire au survol, 17 sources actives).
- `20260610-harness-scheduler-rapport.md` — version markdown du rapport (annexe, non visible publiquement).

## Schémas

1. **Anatomie du scheduler** — cinq sous-composants en pipeline.
2. **Cinq stratégies de scheduling** — taxonomie radiale.
3. **Triangle des budgets** — tokens × latence × $ + politique de dégradation.
4. **Matrice retry × idempotence** — quatre quadrants.
5. **Sept harness × six dimensions** — comparaison production.
6. **Trajectoires 2026-2028** — quatre futurs parallèles.
