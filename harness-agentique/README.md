# Harness agentiques — rapport illustré

Deep research report sur les harness agentiques : architecture technique, cas d'usage multi-sectoriels, effort de développement. Destiné aux **AI engineers** et architectes data/IA.

**Date** : 29 avril 2026
**Auteur** : Mathieu Guglielmino

## Thèse centrale

> Le harness — la couche d'orchestration qui transforme un LLM en agent productif — est devenu en 2026 le déterminant principal de la fiabilité, du coût et de la vitesse d'industrialisation des systèmes IA. **Modèle banalisé, harness différenciant** : c'est l'inversion stratégique que les directions Data/IA doivent intégrer.

L'écart entre modèles frontières s'est refermé sur SWE-bench Verified (six modèles dans 1,3 point en avril 2026). L'écart résiduel se loge dans le harness : jusqu'à 22 points de variance entre un scaffold basique et un scaffold optimisé sur le **même** modèle.

## Contenu du livrable

```
.
├── 20260429-harness-agentique-rapport.md     ← Rapport markdown (~7 500 mots)
├── 20260429-harness-agentique-app.html       ← App compagnon interactive autonome
├── images/                                    ← 7 schémas éditoriaux SVG
│   ├── 20260429-01-anatomie-harness.svg
│   ├── 20260429-02-boucle-gan.svg
│   ├── 20260429-03-trois-couches.svg
│   ├── 20260429-04-secteurs-maturite.svg
│   ├── 20260429-05-effort-developpement.svg
│   ├── 20260429-06-observabilite-piliers.svg
│   └── 20260429-07-trajectoire.svg
└── README.md
```

## Comment consommer

### App interactive (recommandé)

Ouvrir `20260429-harness-agentique-app.html` directement dans le navigateur (double-clic, aucun serveur requis, file:// fonctionne). L'app fournit :

- **Schémas cliquables** — chaque région d'un schéma ouvre une fiche modale détaillée (51 fiches au total sur les 7 schémas).
- **Citations actives** — chaque `[N]` dans le texte ramène à la source dans la sidebar droite et la met en évidence.
- **Tooltips de jargon** — 25 termes techniques (TAOR, MCP, A2A, GAN, RAG, LLM-as-Judge, OpenTelemetry, etc.) sont définis au survol.
- **Sommaire actif** — le sommaire à gauche suit la lecture, scroll fluide vers chaque section.
- **Storytelling animations** — les schémas se révèlent au scroll (IntersectionObserver + transitions CSS), pulsation discrète à l'apparition. `prefers-reduced-motion` honoré.

### Markdown

`20260429-harness-agentique-rapport.md` est lisible tel quel dans Obsidian / GitHub / VS Code. Les images sont référencées via la syntaxe `![alt|width](images/...)` compatible Obsidian.

## Schémas (7)

1. **Anatomie d'un harness** — sept couches verticales (modèle, boucle, contexte, outils, mémoire) traversées par les plans observabilité et gouvernance.
2. **Pattern GAN à trois agents** — planner, generator, evaluator avec artefacts file-based et critères gradables.
3. **Cartographie trois couches** — API (commodity), SDK (moat), Managed (verrouillage), avec protocoles MCP / A2A / x402 transversaux.
4. **Secteurs × cas d'usage × maturité** — sept secteurs croisés avec six familles de cas d'usage agentiques.
5. **Effort de développement** — trois trajectoires (POC, mid-complexity, multi-agent prod) sur timeline + distribution effort + run cost.
6. **Six piliers de l'observabilité agentique** — traces, qualité, coût, drift, guardrails, audit.
7. **Trajectoire 2026-2027** — trois pistes parallèles (technologie, régulation, adoption) sur dix-huit mois.

## Sources

31 sources primaires et tier-A : Anthropic Engineering, Microsoft Tech Community (Azure SRE Agent), Coinbase Engineering, AWS Customer Stories (Thomson Reuters), McKinsey, Deloitte Insights, Dataiku, BenchLM, GitHub Engineering, Linux Foundation Agentic AI Foundation. Toutes consultées le 2026-04-29, listées en pied de rapport et dans la sidebar de l'app.

## Notes techniques

- **Stack app** : HTML/CSS/JS vanilla, aucune dépendance externe au build, aucun serveur requis.
- **Polices** : chargées depuis Google Fonts (Spectral, Inter, JetBrains Mono). Fallback système si offline.
- **Animations** : CSS keyframes + IntersectionObserver. Esprit Theatre.js (storytelling séquencé) sans la dépendance ESM, pour préserver l'autonomie file://. Extensible : un import Theatre.js peut être ajouté pour des séquences d'animations chorégraphiées plus complexes si besoin.
- **Accessibilité** : régions interactives `tabindex="0"` + `role="button"`, focus visible, modal trap, Escape pour fermer, `prefers-reduced-motion` honoré.
- **Print** : feuille print stylisée incluse — masque sommaire et sidebar sources, étend la prose, évite les page-breaks dans les figures.

## Méthodologie

Synthèse de sources primaires (Anthropic Engineering Blog, Microsoft Tech Community, Coinbase Engineering, AWS Solutions Cases), publications d'analystes (McKinsey, Deloitte, Gartner cités via primaire), benchmarks publics (SWE-bench, Terminal-Bench, Aider Polyglot via Epoch AI et BenchLM), et observation directe d'écosystèmes open source (LangGraph, CrewAI, AutoGen).

Les fourchettes d'effort et de coût sont des valeurs centrales de la littérature 2026 ; elles n'engagent pas un client précis et doivent être calibrées projet par projet. Aucun fait n'est cité sans source de tier A ou B.

---

*Mathieu Guglielmino — 29 avril 2026 — Format co-écrit avec l'aide d'une IA*
