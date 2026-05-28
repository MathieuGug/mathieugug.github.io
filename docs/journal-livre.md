# Journal de suivi — livre

Journal de production du livre (28 dossiers → 25 chapitres). Voir [`livre-outline.md`](./livre-outline.md) pour la structure globale.

> **Branche** : `claude/book-outline-concepts-2mRuR` · **Dépôt** : [mathieugug/mathieugug.github.io](https://github.com/MathieuGug/mathieugug.github.io)

## État global

| | Statut | Note |
| --- | --- | --- |
| Outline | ✅ v0 mergé (PR #127) | 4 actes, 25 chapitres, 3 catégories de schémas (S/R/E) |
| Audit schémas | 🟡 partiel | Ch.7 + Ch.10 + Ch.11 faits — les 25 autres en attente |
| Manuscrit | 🟡 3/25 | **Ch.7 charnière : v1 livrée** + **Ch.10 standard : v1 livrée** + **Ch.11 standard : v1 livrée** |
| Schémas R/E à produire | ⏳ | E4 (threat model), E3 (capability×cost), E5 (PRM comparatif), R1 (boucle ReAct + 3 variantes — Ch.7 traité par réutilisation), R4 (8 patterns canoniques — Ch.11 traité par réutilisation de `patterns-canoniques.svg` tel quel), R5 (fabrique 4 stades — Ch.11 traité par tableau markdown faute de schéma fabrique-12 satisfaisant en gabarit récap) — pas démarré pour les schémas E |
| Bugs SVG corrigés | ✅ 1 | `cinq-familles.svg` (balise XML malformée) |
| Rendu print/web | ⏳ | non décidé |

---

## Chapitre 7 — Reason · Act · Observe : le harness et ce qu'il enveloppe

> **Acte II — La boucle · Gabarit charnière 28-40 p · ~9 800 mots**
> **Lecteur cible** : agent engineer, tech lead, architecte, acheteur AI.
> **Sortie lecteur** : comprend la grille à 7 couches d'un harness, sait pourquoi la boucle ReAct invariante porte trois noms (TAOR / Gather-Act-Verify / GAN 3 agents) selon le contexte, distingue tools / bash / codegen et leurs zones de pertinence, sait choisir entre Client SDK / Agent SDK / Claude Code / Managed Agents, peut calibrer un budget POC vs prod multi-agent, et a identifié les trois pièges 100 % traçables (loop infinie, exfil via tool non scopé, multi-agent prématuré).

### Statut

| Étape | Statut |
| --- | --- |
| Audit schémas source (4 dossiers) | ✅ fait (cf. §Audit ci-dessous) |
| Plan détaillé | ✅ fait |
| Manuscrit | ✅ **v1 livrée** — `docs/livre/ch07-boucle-agentique.md` (≈ 9 800 mots, 12 encadrés, 8 schémas intégrés) |
| Schémas à créer | 0 v1 (R1 « boucle ReAct + 3 variantes » traité par **superposition** des 4 schémas source ; à refaire en fusion lourde si édition print) |
| Renvois inter-chapitres | ✅ Ch. 1 (cœur stochastique), Ch. 9 (mémoire), Ch. 10 (compaction), Ch. 11 (orchestration multi-agent), Ch. 13 (MCP sécurité), Ch. 18 (observabilité), Ch. 19 (threat model E4), Ch. 20 (runtime managé), Ch. 21 (ROI) |

### Sources matérielles

Le Ch.7 est une **charnière à 4 dossiers** — c'est le chapitre qui dédouble la matière du corpus sur la « boucle agentique » avec la discipline éditoriale stricte d'une seule description canonique.

- **Dossier principal #1 — [`harness-agentique/`](../harness-agentique/)** (29 avr 2026, étude #04) — l'anatomie 7 couches + pattern GAN + cartographie 3 couches + observabilité 6 piliers + effort de dev. **C'est l'épine** du chapitre.
  - [Rapport (.md, ~7 500 mots)](../harness-agentique/20260429-harness-agentique-rapport.md) · [App interactive](../harness-agentique/20260429-harness-agentique-app.html)
  - 9 schémas SVG dans [`images/`](../harness-agentique/images/)
- **Dossier principal #2 — [`agent-sdk/`](../agent-sdk/)** (18 mai 2026) — Claude Code + Agent SDK, *bash is all you need*, Gather/Act/Verify, hooks, skills, sub-agents, gruyère sécurité, 3 voies de build.
  - [Rapport (.md, ~7 000 mots)](../agent-sdk/20260518-agent-sdk-rapport.md) · [App interactive](../agent-sdk/20260518-agent-sdk-app.html)
  - 11 schémas SVG dans [`images/`](../agent-sdk/images/) (dont 3 `ref-*` qui pointent déjà vers harness/coding-agents)
- **Dossier principal #3 — [`coding-agents/`](../coding-agents/)** (12 mai 2026, outils #17) — instanciation Claude Code/Codex/Copilot + **pyramide d'usage 4 étages** + gains/coûts/risques + carte de décision par profil.
  - [Rapport (.md, ~12 000 mots)](../coding-agents/20260512-coding-agents-rapport.md) · [App](../coding-agents/20260512-coding-agents-app.html) · [Slideshow](../coding-agents/20260512-coding-agents-slideshow.html)
  - 9 schémas SVG dans [`images/`](../coding-agents/images/)
- **Source méta — [`anatomie/`](../anatomie/)** (14 mai 2026) — anneaux 01 (boucle) + 04 (patterns) de `livre-data.js`. **Sert de définition canonique** pour ReAct, `stop_reason`, harness, et les 6 patterns Schluntz-Zhang qui sont étendus en Ch.11.

### Audit des schémas — Ch.7

Au total, **29 schémas SVG** dans les 4 dossiers source. Classement S (au fil du texte du Ch.7) / R (récap chapitre) / E (essentiel transverse) / Ch.X (assigné à un autre chapitre) / écarté.

#### Schémas du dossier `harness-agentique/` (9)

| Fig | Slug | Aperçu | Catégorie Ch.7 | Statut |
| --- | --- | --- | --- | --- |
| 00 | [`exec-sum-a4`](../harness-agentique/images/20260429-00-exec-sum-a4.svg) | A4 portrait synthèse | écarté (livre) | annexe rapport |
| 01 | [`anatomie-harness`](../harness-agentique/images/20260429-01-anatomie-harness.svg) | ![](../harness-agentique/images/20260429-01-anatomie-harness.svg) | **S §7.2 + Récap §7** | tel quel — schéma signature du chapitre, utilisé **2×** (S §7.2 + récap) |
| 01b | [`architecture-systeme`](../harness-agentique/images/20260429-01b-architecture-systeme.svg) | ![](../harness-agentique/images/20260429-01b-architecture-systeme.svg) | **S §7.2.3** | tel quel — 4 zones + bus observabilité, complète anatomie-harness |
| 02 | [`boucle-gan`](../harness-agentique/images/20260429-02-boucle-gan.svg) | ![](../harness-agentique/images/20260429-02-boucle-gan.svg) | **S §7.4** | tel quel — planner/generator/evaluator |
| 03 | [`trois-couches`](../harness-agentique/images/20260429-03-trois-couches.svg) | ![](../harness-agentique/images/20260429-03-trois-couches.svg) | **Ch.20** (runtime managé) | renvoi Ch.20 — la cartographie API/SDK/Managed appartient au chapitre runtime |
| 04 | [`secteurs-maturite`](../harness-agentique/images/20260429-04-secteurs-maturite.svg) | ![](../harness-agentique/images/20260429-04-secteurs-maturite.svg) | **Ch.21** (ROI) | renvoi Ch.21 — matrice secteurs × maturité |
| 05 | [`effort-developpement`](../harness-agentique/images/20260429-05-effort-developpement.svg) | ![](../harness-agentique/images/20260429-05-effort-developpement.svg) | **S §7.11** | tel quel — trois trajectoires POC / mid / multi-agent |
| 06 | [`observabilite-piliers`](../harness-agentique/images/20260429-06-observabilite-piliers.svg) | ![](../harness-agentique/images/20260429-06-observabilite-piliers.svg) | **S §7.7** | tel quel — 6 piliers (renvoi Ch.18 pour détail) |
| 07 | [`trajectoire`](../harness-agentique/images/20260429-07-trajectoire.svg) | ![](../harness-agentique/images/20260429-07-trajectoire.svg) | **Ch.20** (horizon runtime) | renvoi Ch.20 |

#### Schémas du dossier `agent-sdk/` (11, dont 3 ref)

| Fig | Slug | Aperçu | Catégorie Ch.7 | Statut |
| --- | --- | --- | --- | --- |
| 00 | [`exec-sum-a4`](../agent-sdk/images/20260518-00-exec-sum-a4.svg) | A4 portrait | écarté (livre) | annexe rapport |
| 01 | [`evolution-agents`](../agent-sdk/images/20260518-01-evolution-agents.svg) | ![](../agent-sdk/images/20260518-01-evolution-agents.svg) | **Prologue/Ch.1** (LLM features → workflows → agents) | écarté Ch.7 — trop méta, mieux placé en intro générale |
| 02 | [`anatomie-claude-code`](../agent-sdk/images/20260518-02-anatomie-claude-code.svg) | ![](../agent-sdk/images/20260518-02-anatomie-claude-code.svg) | écarté Ch.7 (redondant avec harness-01) | mieux placé en encart "vue produit" du Ch.7 si édition print le réclame |
| 03 | [`cc-vs-sdk`](../agent-sdk/images/20260518-03-cc-vs-sdk.svg) | ![](../agent-sdk/images/20260518-03-cc-vs-sdk.svg) | écarté Ch.7 (couverte textuellement §7.10) | optionnel pour zoom produit |
| 04 | [`trois-voies`](../agent-sdk/images/20260518-04-trois-voies.svg) | ![](../agent-sdk/images/20260518-04-trois-voies.svg) | **S §7.10** (envisagé) | tel quel — mais §7.10 a privilégié la matrice tabulaire pour densité d'info |
| 05 | [`pokeapi-variantes`](../agent-sdk/images/20260518-05-pokeapi-variantes.svg) | ![](../agent-sdk/images/20260518-05-pokeapi-variantes.svg) | écarté Ch.7 (cas spécifique) | gardé en ligne sur dossier source |
| 06 | [`bash-funnel`](../agent-sdk/images/20260518-06-bash-funnel.svg) | ![](../agent-sdk/images/20260518-06-bash-funnel.svg) | **S §7.5.2** (envisagé) | non retenu v1 — texte du scénario rideshare suffit ; à réintroduire si édition print veut une illustration |
| 07 | [`matrice-tools-bash-codegen`](../agent-sdk/images/20260518-07-matrice-tools-bash-codegen.svg) | ![](../agent-sdk/images/20260518-07-matrice-tools-bash-codegen.svg) | **S §7.5** | tel quel — matrice trois paradigmes |
| 08 | [`agent-loop`](../agent-sdk/images/20260518-08-agent-loop.svg) | ![](../agent-sdk/images/20260518-08-agent-loop.svg) | candidat **S §7.3** | non retenu v1 — la formulation TAOR + variante GAN suffit textuellement ; à réintégrer si édition print veut un schéma boucle dédié |
| 09 | [`securite-couches`](../agent-sdk/images/20260518-09-securite-couches.svg) | ![](../agent-sdk/images/20260518-09-securite-couches.svg) | **S §7.8** | tel quel — gruyère 3 couches |
| ref-1 | [`ref-coding-agents-anatomie`](../agent-sdk/images/ref-coding-agents-anatomie.svg) | (copie de coding-agents-02) | — | source originale en coding-agents/ |
| ref-2 | [`ref-gruyere-suisse`](../agent-sdk/images/ref-gruyere-suisse.svg) | (parallèle évaluation) | **Ch.17** (gruyère évaluation) | renvoi Ch.17 — c'est la fig signature playbook eval 8 étapes |
| ref-3 | [`ref-harness-7-couches`](../agent-sdk/images/ref-harness-7-couches.svg) | (copie de harness-01) | — | source originale en harness-agentique/ |

#### Schémas du dossier `coding-agents/` (9)

| Fig | Slug | Aperçu | Catégorie Ch.7 | Statut |
| --- | --- | --- | --- | --- |
| 00 | [`exec-sum-a4`](../coding-agents/images/20260512-00-exec-sum-a4.svg) | A4 portrait | écarté (livre) | annexe rapport |
| 01 | [`trois-regimes`](../coding-agents/images/20260512-01-trois-regimes.svg) | ![](../coding-agents/images/20260512-01-trois-regimes.svg) | écarté Ch.7 (trop coding-spé) | gardé en ligne sur dossier source |
| 02 | [`anatomie`](../coding-agents/images/20260512-02-anatomie.svg) | ![](../coding-agents/images/20260512-02-anatomie.svg) | écarté Ch.7 (redondant avec harness-01 + sdk-02) | gardé en ligne ; signe la redondance massive identifiée |
| 03 | [`cycle-skill`](../coding-agents/images/20260512-03-cycle-skill.svg) | ![](../coding-agents/images/20260512-03-cycle-skill.svg) | candidat §7.6.1 | non retenu v1 — descriptions textuelles des skills suffisent ; à réintroduire en print si nécessaire |
| 04 | [`comparatif`](../coding-agents/images/20260512-04-comparatif.svg) | ![](../coding-agents/images/20260512-04-comparatif.svg) | écarté Ch.7 (comparatif produits trop coding-spé) | gardé en ligne |
| 05 | [`pyramide`](../coding-agents/images/20260512-05-pyramide.svg) | ![](../coding-agents/images/20260512-05-pyramide.svg) | **S §7.9** | tel quel — schéma signature de §7.9 |
| 06 | [`gains`](../coding-agents/images/20260512-06-gains.svg) | ![](../coding-agents/images/20260512-06-gains.svg) | **Ch.21** (ROI/gains) | renvoi Ch.21 |
| 07 | [`couts`](../coding-agents/images/20260512-07-couts.svg) | ![](../coding-agents/images/20260512-07-couts.svg) | **Ch.21** (ROI/coûts) | renvoi Ch.21 |
| 08 | [`carte-decision`](../coding-agents/images/20260512-08-carte-decision.svg) | ![](../coding-agents/images/20260512-08-carte-decision.svg) | écarté Ch.7 (matrice tabulaire §7.10.5 suffit) | gardé en ligne |

#### Schémas du dossier `anatomie/` (méta)

Les anneaux concentriques de `livre.html` (rendus par `livre-render.js` à partir de `LAYERS` dans `livre-data.js`) ne sont pas exportés en SVG indépendants. Les anneaux 01 (boucle), 02 (outils), 03 (contexte), 04 (patterns) constituent le **squelette conceptuel** mais ne fournissent pas d'images directement réutilisables ; ils nourrissent en revanche la **discipline éditoriale** (définitions canoniques, risques par couche, rôles par couche). Le schéma E1 (anatomie 10 anneaux concentriques) sera dérivé pour l'ouverture du livre.

### Redondances et complémentarités entre les 4 dossiers

**3 redondances majeures identifiées, déduplications opérées dans le chapitre :**

| Sujet | `harness-agentique` | `agent-sdk` | `coding-agents` | `anatomie` | Décision Ch.7 |
| --- | --- | --- | --- | --- | --- |
| **Anatomie d'un harness** | 7 couches verticales + 2 plans (le plus dense, vue système) | 9 satellites autour du modèle (vue produit Claude Code) | 6 rouages (vue coding agent) | 10 anneaux concentriques (vue stratégique) | **Définition canonique = harness-01 (7 couches)**. Sdk-02 et coding-02 cités en mémoire, anatomie en référence amont. Évite 3 schémas redondants. |
| **Boucle Reason · Act · Observe** | TAOR (Think-Act-Observe-Repeat) | Gather · Act · Verify (Anthropic Agent SDK) | « itère en boucle » (description narrative) | ReAct (formalisation académique) | **Définition canonique = §7.3 avec 3 variantes nommées**. Une seule description, 3 noms reconnus, 1 pivot (`stop_reason`). Le R1 « boucle + 3 variantes » de l'outline est rempli par superposition textuelle dans §7.3 — pas de schéma fusionné v1, à créer si édition print. |
| **6 patterns canoniques Anthropic** | mention rapide | non couvert | mention rapide | 6 patterns détaillés (anneau 04 livre-data.js) | **Définition canonique = Ch.11**, pas Ch.7. Le Ch.7 fixe le principe (start simple, règle Schluntz-Zhang), Ch.11 déroule la taxonomie complète. |

**Complémentarités assumées (pas de doublon vrai) :**

| Apport unique du dossier | À conserver pour le Ch.7 |
| --- | --- |
| `harness-agentique` | Anatomie 7 couches, pattern GAN, observabilité 6 piliers, effort de dev (les 4 schémas signature) |
| `agent-sdk` | Matrice tools/bash/codegen, gruyère 3 couches sécurité, matrice 4 voies de build, hooks 6 points d'interception |
| `coding-agents` | Pyramide d'usage 4 étages (le seul angle qui structure l'adoption transverse), retex chiffrés (Stripe, METR), pyramide d'adoption |
| `anatomie/livre-data.js` | Définitions canoniques (ReAct, stop_reason, harness, runner, graph execution, function calling, tool_use…), risques par couche |

**1 absence notable, non bloquante** : pas de **schéma fusionné R1** (boucle ReAct canonique + 3 variantes harness GAN / gather-act-verify / coding loop). L'outline (annexe A.2) le liste comme « à créer par fusion ». **Décision v1** : couvert textuellement dans §7.3 (3 variantes nommées, une seule description), et le récap chapitre réutilise harness-01 (7 couches) qui couvre déjà la boucle comme couche 2. Si l'édition print réclame un récap fusionné dédié, le coût est ~3-5 jours SVG.

### Plan détaillé du chapitre

```
> [!QUESTION] Question d'ouverture
  Si l'écart inter-modèles tombe sous 1,3pt mais que le scaffold pèse 22pt,
  où passe le levier d'ingénierie 2026 ?

> [!TLDR] TL;DR décideur (6 bullets)

§7.1  Pourquoi 2026 est l'année du harness (3 faits empiriques)
      └─ encadré [!INFO] Voir Ch.1 (cœur stochastique)

§7.2  Anatomie d'un harness — sept couches
      ├─ §7.2.1 Modèle, boucle, contexte, outils, mémoire
      │  └─ encadré [!INFO] Voir Ch.9 (mémoire agentique)
      ├─ §7.2.2 Observabilité, gouvernance (plans horizontaux)
      └─ §7.2.3 Du conceptuel au système
         ├─ [SVG S] harness-01-anatomie-harness.svg
         └─ [SVG S] harness-01b-architecture-systeme.svg

§7.3  La boucle Reason · Act · Observe et son pivot stop_reason
      ├─ encadré [!EXAMPLE] boucle minimale Anthropic Client SDK
      ├─ §7.3.1 Trois variantes d'une même boucle (TAOR / Gather-Act-Verify / GAN)
      └─ §7.3.2 Pourquoi la boucle mono-agent s'effondre
         └─ encadré [!QUOTE] Rajasekaran Anthropic Labs

§7.4  Le pattern à trois agents (GAN-inspiré)
      ├─ [SVG S] harness-02-boucle-gan.svg
      ├─ §7.4.1 Anatomie (planner / generator / evaluator)
      ├─ §7.4.2 L'économie du pattern (mono 20min/9$ vs trois agents 6h/200$)
      └─ §7.4.3 Trois leçons d'ingénierie
         └─ encadré [!ATTENTION] Le pattern n'est pas la seule architecture

§7.5  Outils, bash et codegen — les trois paradigmes d'action
      ├─ [SVG S] sdk-07-matrice-tools-bash-codegen.svg
      ├─ §7.5.1 Tools — actions structurées
      ├─ §7.5.2 Bash — composition, filesystem, mémoire (scénario rideshare)
      ├─ §7.5.3 Codegen — flexibilité, deep research
      │  └─ encadré [!EXAMPLE] codegen avec hooks
      └─ §7.5.4 La règle de combinaison
         └─ encadré [!IMPORTANT] RBAC passe par l'infra, pas le prompt

§7.6  Skills, hooks, sub-agents — leviers de fiabilité déterministe
      ├─ §7.6.1 Les skills — objet partageable
      ├─ §7.6.2 Les hooks — rattrapage déterministe
      └─ §7.6.3 Les sub-agents — déléguer dans la délégation
         └─ encadré [!INFO] Voir Ch.11 (orchestration multi-agent)

§7.7  Observabilité — six piliers, et pourquoi l'APM est aveugle
      ├─ [SVG S] harness-06-observabilite-piliers.svg
      └─ encadré [!INFO] Voir Ch.18 (observabilité agentique)

§7.8  Gouvernance — gruyère suisse, sandbox, RBAC
      ├─ [SVG S] sdk-09-securite-couches.svg
      ├─ encadré [!WARNING] Piège classique de la couche outils (execute_sql + injection)
      └─ encadré [!INFO] Voir Ch.13 et Ch.19 (sécurité MCP + threat model E4)

§7.9  La pyramide d'adoption — qui s'en sert pour quoi
      ├─ [SVG S] coding-05-pyramide.svg
      ├─ 4 étages (transverse / data quotidien / data expert / produit-décideurs)
      └─ encadré [!NOTE] Le sommet n'est pas mieux que la base

§7.10 Trois voies pour builder + une — matrice de décision
      ├─ §7.10.1 Client SDK
      ├─ §7.10.2 Agent SDK
      ├─ §7.10.3 Claude Code comme plateforme d'extension
      ├─ §7.10.4 Managed Agents
      ├─ §7.10.5 Matrice transverse (8 cas d'usage × voie × mix × surveillance)
      └─ encadré [!INFO] Voir Ch.20 (runtime managé)

§7.11 Effort de développement — combien, combien de temps, avec qui
      ├─ [SVG S] harness-05-effort-developpement.svg
      ├─ 3 trajectoires (POC 50-100k€ / mid 150-300k€ / multi-agent 500k-2M€+)
      ├─ Distribution effort (data prep 60-75%, intégration 40-60%, safety +20-30%)
      └─ encadré [!INFO] Voir Ch.21 (ROI + paradoxe agentique)

Récap chapitre — Sept couches, une boucle, trois voies
       └─ [SVG R] harness-01-anatomie-harness.svg (réutilisé en récap)

> [!WARNING] Trois pièges classiques (les trois sont 100% traçables)
  Loop infinie sans budget de tours · execute_sql sans sandbox ·
  multi-agent prématuré (×10-15 tokens, mois vs semaines, debug exponentiel)

Sources (23 footnotes : 4 dossiers source + Anthropic engineering blog +
        Microsoft Tech Community + ReAct paper + Coinbase + McKinsey + OWASP +
        Stack Overflow Survey + METR)
```

### Encadrés prévus dans le chapitre

Variété des `> [!TYPE]` Obsidian retenus :

| Type | Usage | Compte |
| --- | --- | --- |
| `[!QUESTION]` | Ouverture chapitre | 1 |
| `[!TLDR]` | Synthèse décideur 6 bullets | 1 |
| `[!INFO]` | Renvois inter-chapitres (Ch.1, 9, 11, 13/19, 18, 20, 21) | 7 |
| `[!EXAMPLE]` | Code pseudo-Python (Client SDK loop + Agent SDK hooks) | 2 |
| `[!QUOTE]` | Citation Rajasekaran (Anthropic Labs) | 1 |
| `[!ATTENTION]` | Le pattern n'est pas la seule architecture (renvoi Ch.11) | 1 |
| `[!IMPORTANT]` | RBAC passe par l'infra | 1 |
| `[!NOTE]` | Le sommet n'est pas mieux que la base (pyramide §7.9) | 1 |
| `[!WARNING]` | Piège exec_sql + trois pièges classiques en clôture | 2 |
| **Total** | | **17** |

### Tâches restantes Ch.7

- [x] Rédiger le manuscrit `docs/livre/ch07-boucle-agentique.md` (~9 800 mots)
- [x] Audit des 29 schémas SVG des 4 dossiers source
- [ ] Relecture Mathieu — passes critiques suggérées :
  - **(a) La discipline anti-redondance** : vérifier que les 3 redondances majeures (anatomie / boucle / 6 patterns) sont effectivement déduplicéés sans perte de matière utile.
  - **(b) Le récap §Récap** : décider si on garde la réutilisation du schéma harness-01 ou si on commande la fusion R1 (boucle ReAct + 3 variantes).
  - **(c) Le §7.5.2 bash** : le scénario rideshare est cité textuellement sans schéma ; valider que ça passe ou réintégrer sdk-06-bash-funnel.svg.
  - **(d) Le §7.9 pyramide** : c'est l'angle unique du dossier coding-agents — vérifier qu'il n'est pas dilué par l'absorption en charnière.
  - **(e) La frontière Ch.7 ↔ Ch.11** : règle d'écriture posée (§7.4 trois agents = Ch.7 ; 8 patterns canoniques + topologies multi-agents + arbre buy/build = Ch.11). À valider pendant la rédaction du Ch.11.
- [ ] Si validation : copier-coller la matière vers le futur format de sortie (print HTML / PDF) quand décidé

---

## Chapitre 11 — Patterns canoniques et orchestration multi-agents

> **Acte II — La boucle · Gabarit standard 16-24 p · ~6 500 mots**
> **Lecteur cible** : agent engineer, tech lead, architecte, sponsor IA.
> **Sortie lecteur** : connaît les 4 régimes de contrôle et sait à quel moment basculer du workflow vers l'agent autonome ; maîtrise les 8 patterns canoniques (5 workflows Anthropic + 3 topologies multi-agents) ; distingue les 3 couches du stack (ADK / runtime / plateforme) et sait que « on utilise Bedrock » ne dit rien tant qu'on n'a pas précisé les briques ; reconnaît les 5 problèmes durs qui font crasher les agents en prod ; peut dérouler l'arbre buy/build à 4 questions ; et sait qu'une fabrique d'équipe en 4 stades × 10 artefacts est ce qui sépare 5 % de projets qui livrent des 95 % qui restent en pilote (MIT NANDA).

### Statut

| Étape | Statut |
| --- | --- |
| Audit schémas source (3 dossiers) | ✅ fait (cf. §Audit ci-dessous) |
| Plan détaillé | ✅ fait |
| Manuscrit | ✅ **v1 livrée** — `docs/livre/ch11-patterns-orchestration.md` (≈ 6 500 mots, 14 encadrés, 8 schémas intégrés) |
| Schémas à créer | 0 v1 (R4 « 8 patterns canoniques » traité par réutilisation tel quel de `orchestration-04-patterns-canoniques.svg` ; R5 « fabrique 4 stades » traité par tableau markdown — le schéma `fabrique-12-recap-10x4.svg` reste optionnel pour le récap dédié si édition print l'exige) |
| Frontière Ch.7 ↔ Ch.11 | ✅ respectée — Ch.7 garde le pattern GAN 3-agents (§7.4) ; Ch.11 déroule la taxonomie complète des 8 patterns et cite §7.4 comme cas particulier d'evaluator-optimizer enrichi d'un planner |
| Renvois inter-chapitres | ✅ Ch. 5 (économie token), Ch. 7 (boucle, pattern GAN, RBAC), Ch. 9 (mémoire), Ch. 10 (compaction), Ch. 12 (MCP plateforme), Ch. 13 (MCP sécurité), Ch. 14 (surfaces + Knight levels), Ch. 15 (computer use / browser tool), Ch. 17 (eval pass^k), Ch. 18 (observabilité), Ch. 19 (threat model E4), Ch. 20 (runtime managé), Ch. 21 (ROI Klarna second usage), Ch. 24 (IA et travail réallocation) |

### Sources matérielles

Le Ch.11 est une **charnière à 3 dossiers**, ancré dans le dossier le plus récent de la série (`orchestration-agentique/` mergé via PR #126 le 27 mai 2026, source principale) qui structure les huit patterns, les quatre régimes, le stack en trois couches, les cinq problèmes durs et l'arbre buy/build. La couche fabrique d'équipe vient de `fabrique-agent/`. L'absorbé `anatomie/` couche 04 fournit les définitions canoniques.

- **Dossier principal — [`orchestration-agentique/`](../orchestration-agentique/)** (27 mai 2026, dossier #28) — épine du chapitre : 4 régimes (§3), 8 patterns canoniques (§4), stack ADK/runtime/plateforme (§5), cartographie 2026 (§6), 5 problèmes prod (§7), arbre de décision buy/build (§8).
  - [Rapport (.md, ~6 500 mots)](../orchestration-agentique/20260527-orchestration-agentique-rapport.md) · [App interactive](../orchestration-agentique/20260527-orchestration-agentique-app.html)
  - 8 schémas SVG dans [`images/`](../orchestration-agentique/images/) — **tous** intégrés en Ch.11 (taux d'absorption maximal du corpus).
- **Dossier sous-chapitre équipe — [`fabrique-agent/`](../fabrique-agent/)** (15 mai 2026, étude #21) — 4 stades de maturité (Prototype · Pilote · Production · Mature multi-agents) × 10 artefacts partagés, 5 cellules pivots.
  - [Rapport (.md, ~14 000 mots)](../fabrique-agent/20260515-fabrique-agent-rapport.md) · [App interactive](../fabrique-agent/20260515-fabrique-agent-app.html)
  - 13 schémas SVG dans [`images/`](../fabrique-agent/images/) — pas absorbés visuellement (le tableau §11.8.1 condense, fidèle à la discipline anti-mur-de-schéma)
- **Source méta — [`anatomie/`](../anatomie/)** (14 mai 2026) — anneau 04 (patterns) de `livre-data.js`. Définitions canoniques mobilisées textuellement, pas de schéma autonome extrait.

### Audit des schémas — Ch.11

Au total, **21 schémas SVG** dans les 3 dossiers source. Classement S (au fil du texte Ch.11) / R (récap chapitre) / Ch.X (assigné à un autre chapitre) / écarté.

#### Schémas du dossier `orchestration-agentique/` (8 — tous absorbés)

| Fig | Slug | Aperçu | Catégorie Ch.11 | Statut |
| --- | --- | --- | --- | --- |
| 01 | [`shift-chat-systeme`](../orchestration-agentique/images/20260527-01-shift-chat-systeme.svg) | ![](../orchestration-agentique/images/20260527-01-shift-chat-systeme.svg) | **S §11.1.2** | tel quel — frise 2023→2026 qui pose le motif du chapitre |
| 02 | [`anatomie-boucle`](../orchestration-agentique/images/20260527-02-anatomie-boucle.svg) | ![](../orchestration-agentique/images/20260527-02-anatomie-boucle.svg) | **S §11.2** | tel quel — 4 phases + 4 ressources + orchestrateur enveloppant |
| 03 | [`spectre-controle`](../orchestration-agentique/images/20260527-03-spectre-controle.svg) | ![](../orchestration-agentique/images/20260527-03-spectre-controle.svg) | **S §11.3 + Récap §11.9** | tel quel — schéma signature du chapitre, utilisé **2×** |
| 04 | [`patterns-canoniques`](../orchestration-agentique/images/20260527-04-patterns-canoniques.svg) | ![](../orchestration-agentique/images/20260527-04-patterns-canoniques.svg) | **R4 §11.4** | tel quel — couvre la bibliothèque des 8 patterns sans gap. Le R4 de l'outline (annexe A.2) est ainsi rempli sans fusion lourde. |
| 05 | [`stack-trois-couches`](../orchestration-agentique/images/20260527-05-stack-trois-couches.svg) | ![](../orchestration-agentique/images/20260527-05-stack-trois-couches.svg) | **S §11.5** | tel quel — ADK / runtime / plateforme |
| 06 | [`cartographie-2026`](../orchestration-agentique/images/20260527-06-cartographie-2026.svg) | ![](../orchestration-agentique/images/20260527-06-cartographie-2026.svg) | **S §11.5.4** | tel quel — 4 bandes + 2 protocoles |
| 07 | [`problemes-prod`](../orchestration-agentique/images/20260527-07-problemes-prod.svg) | ![](../orchestration-agentique/images/20260527-07-problemes-prod.svg) | **S §11.6** | tel quel — 5 problèmes durs, ancrés en symptôme / signal / parade |
| 08 | [`arbre-decision`](../orchestration-agentique/images/20260527-08-arbre-decision.svg) | ![](../orchestration-agentique/images/20260527-08-arbre-decision.svg) | **S §11.7 (+ E6 outline)** | tel quel — arbre 4 questions. C'est aussi le schéma essentiel transverse **E6** de l'outline, cité ici en source et à recadrer si l'annexe consultative print le réclame. |

#### Schémas du dossier `fabrique-agent/` (13, aucun absorbé visuellement)

Les 13 schémas de `fabrique-agent/` (atelier par stade, recap 10×4, ROI cards, etc.) sont **tous écartés** du Ch.11 v1 — non par jugement de qualité, mais par discipline éditoriale. Le chapitre Ch.11 est standard (16-24 p), il a déjà 8 schémas intégrés (tous d'`orchestration-agentique/`), et la matière fabrique est condensée en §11.8 par un **tableau markdown 4 stades × artefacts naissants** qui suffit à porter la thèse sans alourdir. Si une édition print exige un schéma de récap dédié à la fabrique (équivalent du R5 listé en annexe A.2 de l'outline), `fabrique-12-recap-10x4.svg` est le candidat naturel ; sa réutilisation en Ch.11 reste possible à coût zéro.

Détail de classification pour mémoire (et pour le Ch.11 qui ne les absorbe pas) :

| Fig | Slug | Catégorie | Note |
| --- | --- | --- | --- |
| 01 | `oignon-fabrique` | écarté Ch.11 | superposition oignon / fabrique — appartient à l'ouverture du livre ou au prologue |
| 02-04, 07, 10 | `atelier-prototype` / `atelier-pilote` / `atelier-production` / `atelier-mature` | écarté Ch.11 | scènes d'atelier par stade — appartiennent à un éventuel sous-chapitre dédié `fabrique-agent` |
| 05 | `testcase-anatomie` | **Ch.17** | format TestCase = (Persona × Quest × Environment) → Expected Outcome — appartient au chapitre éval |
| 06 | `vallee-de-la-mort` | **Ch.21** | 95 %/70 % POC qui meurent — ROI/économie |
| 08 | `gruyere-suisse` | **Ch.17** | Anthropic 5 couches d'évaluation — appartient au chapitre éval (renvoyé déjà via `agent-sdk ref-2` au Ch.7) |
| 09 | `obo-vs-autonome` | **Ch.13/Ch.19/Ch.23** | régimes d'identité — sécurité MCP / threat model / gouvernance |
| 11 | `coala-cycle` | **Ch.9** | 4 piliers CoALA + 6 opérations — appartient au chapitre mémoire |
| 12 | `recap-10x4` | candidat **R5 Ch.11** (édition print) | matrice 10 artefacts × 4 stades — réservée pour récap fabrique si gabarit print le réclame. v1 du Ch.11 fait sans, par tableau markdown. |
| 13 | `roi-cards` | **Ch.21** | 5 axes × 3 temporalités = 15 ROI cards — appartient au chapitre ROI |

#### Schémas du dossier `anatomie/` (couche 04 patterns)

Les anneaux concentriques de `livre.html` (rendus par `livre-render.js` à partir de `LAYERS` dans `livre-data.js`) ne sont pas exportés en SVG indépendants. La couche 04 (patterns) fournit en revanche la **discipline éditoriale** : c'est elle qui pose le principe que la taxonomie des 6 patterns Schluntz-Zhang est canonique et qu'elle s'étend en multi-agent par 3 topologies. Aucune image directement réutilisable — la matière est dans le SVG `orchestration-04-patterns-canoniques` qui couvre les 8 patterns en une bibliothèque visuelle.

### Redondances et complémentarités entre les 3 dossiers

**2 redondances majeures identifiées, déduplications opérées dans le chapitre :**

| Sujet | `orchestration-agentique` | `fabrique-agent` | `anatomie` 04 | Décision Ch.11 |
| --- | --- | --- | --- | --- |
| **Boucle agentique 4 phases** | SCHÉMA 02 anatomie-boucle (perceive·decide·act·observe + 4 ressources) | TAOR mentionnée comme couche 01 de l'oignon | ReAct dans `livre-data.js` LAYERS[1] | **Définition canonique = Ch.7 §7.3** (déjà acquise). Ch.11 §11.2 réutilise le schéma 02 pour rappeler les 4 ressources sous l'angle « ce qu'on orchestre exactement », sans redécrire la mécanique. Pas de doublon vrai parce que l'angle change (orchestration vs harness). |
| **8 patterns Anthropic + multi-agents** | SCHÉMA 04 patterns-canoniques (la bibliothèque complète) | non couvert visuellement | 6 patterns Schluntz-Zhang dans anneau 04 | **Définition canonique = Ch.11 §11.4** (objet propre du chapitre). Le Ch.7 a explicitement repoussé en Ch.11 (cf. son audit). Le Ch.11 cite §7.4 (pattern GAN à 3 agents) comme cas particulier d'evaluator-optimizer enrichi d'un planner, sans refaire la narration. |

**Complémentarités assumées (pas de doublon vrai) :**

| Apport unique du dossier | À conserver pour le Ch.11 |
| --- | --- |
| `orchestration-agentique` | 4 régimes de contrôle (§3) ; 8 patterns canoniques (§4) ; stack 3 couches ADK / runtime / plateforme (§5) ; cartographie 2026 4 bandes + 2 protocoles (§6) ; 5 problèmes durs en prod (§7) ; arbre de décision buy/build 4 questions (§8). C'est **le** dossier qui structure l'ensemble. |
| `fabrique-agent` | Discipline « la maturité se lit dans les artefacts, pas dans le code » + 4 stades + 10 artefacts + 5 cellules pivots + chiffres MIT NANDA (95 %) / consensus POC (70 %). **L'angle équipe** que `orchestration-agentique` n'a pas. |
| `anatomie/livre-data.js` couche 04 | Définitions canoniques des 6 patterns Schluntz-Zhang, risques par couche, rôles par couche. Sert de référence amont, pas d'absorption directe. |

**Cohérence avec la frontière posée par Ch.7** : le Ch.7 a repoussé explicitement en Ch.11 (a) les 8 patterns canoniques, (b) l'arbre de décision buy/build, (c) la cartographie des 4 régimes étendue. Le Ch.7 garde (i) le principe `start simple` Schluntz-Zhang, (ii) le pattern GAN à 3 agents comme cas particulier traité en détail §7.4. Le Ch.11 respecte cette frontière sans la franchir : §11.4.1 mentionne le pattern à 3 agents comme cas particulier d'evaluator-optimizer + planner, renvoie au Ch.7 §7.4 pour l'économie et la narration, et ne refait pas le schéma `harness-02-boucle-gan.svg` (qui reste signature du Ch.7).

**1 absence notable, non bloquante** : pas de **schéma fusionné R5** (matrice 4 stades fabrique × 10 artefacts). L'outline (annexe A.2) le liste comme « tel quel à partir de `fabrique-12-recap-10x4.svg` ». **Décision v1** : couvert par tableau markdown §11.8.1, plus condensé qu'un schéma 10 colonnes × 4 lignes qui demanderait une double-page A3 pour rester lisible. Si l'édition print réclame un récap visuel dédié, `fabrique-12-recap-10x4.svg` est le candidat naturel et son coût d'intégration est nul (réutilisation tel quel).

### Plan détaillé du chapitre

```
> [!QUESTION] Question d'ouverture
  Si plus de la moitié des projets multi-agents reviennent en workflow routé
  en 6 mois (sans perte de qualité, ×10 facture, debug lisible),
  à quel moment bascule-t-on dans le multi-agent — et qui pilote la boucle ?

> [!TLDR] TL;DR décideur (6 bullets)

§11.1  Pourquoi un chapitre dédié aux patterns
       ├─ §11.1.1 La place de ce chapitre dans l'Acte II
       │  └─ encadré [!INFO] Voir Ch.7 (boucle / pattern GAN)
       └─ §11.1.2 Le glissement 2023 → 2026
          └─ [SVG S] orchestration-01-shift-chat-systeme.svg

§11.2  Ce qu'on orchestre exactement
       ├─ [SVG S] orchestration-02-anatomie-boucle.svg
       ├─ 4 ressources + 5 questions par tour
       └─ encadré [!NOTE] La distinction workflow vs agent (Anthropic)

§11.3  Quatre régimes de contrôle
       ├─ [SVG S] orchestration-03-spectre-controle.svg
       ├─ §11.3.1 Code-driven (workflow)
       ├─ §11.3.2 LLM-driven (routines + handoffs) — OpenAI Swarm
       │  └─ encadré [!EXAMPLE] signature minimale handoff Agents SDK
       ├─ §11.3.3 Graphe déclaratif — LangGraph
       └─ §11.3.4 Agent autonome (boucle libre)
          └─ encadré [!ATTENTION] Recommandation Anthropic — réserver l'autonomie

§11.4  Les huit patterns canoniques
       ├─ [SVG R4] orchestration-04-patterns-canoniques.svg
       ├─ §11.4.1 Cinq workflows Anthropic
       │  └─ encadré [!INFO] Voir Ch.7 §7.4 — pattern à 3 agents
       ├─ §11.4.2 Trois topologies multi-agents
       ├─ encadré [!IMPORTANT] La maxime non-écrite — on compose
       └─ encadré [!INFO] Voir Ch.14 (surfaces + Knight levels)

§11.5  Le stack en trois couches — ADK ≠ runtime ≠ plateforme
       ├─ [SVG S] orchestration-05-stack-trois-couches.svg
       ├─ §11.5.1 Couche 1 — ADK (tableau 7 ADK)
       ├─ §11.5.2 Couche 2 — Runtime
       │  └─ encadré [!INFO] Voir Ch.20 (runtime managé)
       ├─ §11.5.3 Couche 3 — Services de plateforme (6 briques AgentCore)
       └─ §11.5.4 Cartographie 2026 — 4 bandes + 2 protocoles
          ├─ [SVG S] orchestration-06-cartographie-2026.svg
          └─ encadré [!INFO] Voir Ch.12 et Ch.13 (MCP plateforme + sécurité)

§11.6  Les cinq problèmes durs en prod
       ├─ [SVG S] orchestration-07-problemes-prod.svg
       ├─ §11.6.1 Mémoire et contexte (renvoi Ch.9, Ch.10)
       ├─ §11.6.2 Observabilité (renvoi Ch.18)
       ├─ §11.6.3 Sécurité (renvoi Ch.7 §7.5.4, Ch.13, Ch.19)
       ├─ §11.6.4 Idempotence et retry
       ├─ §11.6.5 Coût et amplification de tokens (renvoi Ch.10)
       └─ encadré [!WARNING] La cascade d'erreurs en multi-agents

§11.7  L'arbre de décision — produit, ADK + runtime, ou tout construire ?
       ├─ [SVG S] orchestration-08-arbre-decision.svg
       ├─ §11.7.1 Q1 — Cas d'usage standard ?
       │  └─ encadré [!QUOTE] L'angle Klarna — deux lectures, deux chapitres
       ├─ §11.7.2 Q2 — Workflow + besoin prod ?
       ├─ §11.7.3 Q3 — Spécificité forte + SRE ?
       ├─ §11.7.4 Q4 — Contraintes uniques ?
       ├─ §11.7.5 Si toutes les réponses sont « non »
       └─ §11.7.6 Trois signaux de migration

§11.8  La fabrique d'équipe — quatre stades, dix artefacts
       ├─ §11.8.1 Quatre stades (tableau markdown)
       │  └─ encadré [!IMPORTANT] La maturité d'une fabrique se lit
       │     dans ses artefacts
       └─ §11.8.2 Cinq cellules pivots (Entra Agent ID, memory_hit_rate,
          pass^k, OBO vs Autonome, réallocation)

§11.9  Récap chapitre — Quatre régimes, huit patterns, trois couches,
       un arbre
       └─ [SVG R] orchestration-03-spectre-controle.svg (réutilisé en récap
          — c'est le schéma qui articule tout le reste)

> [!WARNING] Trois pièges classiques (les trois sont 100 % traçables)
  Multi-agent prématuré · mal nommer la zone du stack · sauter le stade 3
  pour aller direct au stade 4

Sources (22 footnotes : 3 dossiers + Anthropic Building Effective Agents
        + OpenAI Cookbook/Agents SDK + AWS AgentCore + Google ADK +
        MS Agent Framework + Stellagent A2A + Knowlee + GuruSup + Morph +
        Claude Code docs + Sierra + Mem0 + Braintrust + OWASP ASI +
        GitHub Engineering multi-agent failures + Klarna press/post-mortem)
```

### Encadrés prévus dans le chapitre

Variété des `> [!TYPE]` Obsidian retenus :

| Type | Usage | Compte |
| --- | --- | --- |
| `[!QUESTION]` | Ouverture chapitre | 1 |
| `[!TLDR]` | Synthèse décideur 6 bullets | 1 |
| `[!INFO]` | Renvois inter-chapitres (Ch.7, 12+13, 14, 20) | 4 |
| `[!NOTE]` | Distinction workflow vs agent (maxime Anthropic) | 1 |
| `[!EXAMPLE]` | Code pseudo-Python (signature handoff Agents SDK) | 1 |
| `[!ATTENTION]` | Recommandation Anthropic — réserver l'autonomie | 1 |
| `[!IMPORTANT]` | La maxime "on compose" + La maturité des artefacts | 2 |
| `[!QUOTE]` | L'angle Klarna — deux lectures, deux chapitres (anticipe Ch.21) | 1 |
| `[!WARNING]` | Cascade d'erreurs multi-agents + Trois pièges classiques clôture | 2 |
| **Total** | | **14** |

### Tâches restantes Ch.11

- [x] Rédiger le manuscrit `docs/livre/ch11-patterns-orchestration.md` (~6 500 mots)
- [x] Audit des 21 schémas SVG des 3 dossiers source (8 absorbés sur 8 d'`orchestration-agentique` ; 0 sur 13 absorbés visuellement de `fabrique-agent` mais 6 réassignés à d'autres chapitres)
- [ ] Relecture Mathieu — passes critiques suggérées :
  - **(a) La frontière Ch.7 ↔ Ch.11** : vérifier que §11.4.1 (mention pattern à 3 agents comme cas particulier d'evaluator-optimizer) renvoie correctement au Ch.7 §7.4 sans rejouer l'économie 9 $/200 $ ni redécrire la mécanique. Statut v1 : renvoi unique sans répétition.
  - **(b) La fabrique d'équipe §11.8** : choix éditorial fort — table markdown plutôt que `fabrique-12-recap-10x4.svg`. Risque : sous-représentation visuelle du sous-chapitre. Alternative : insérer le schéma en récap dédié si édition print l'exige, ou créer un sous-chapitre `fabrique-agent` autonome (cf. friction 1 outline §4.2).
  - **(c) Le récap §11.9** : décision de réutiliser `orchestration-03-spectre-controle.svg` plutôt que `orchestration-04-patterns-canoniques.svg`. Justification : le spectre articule tout le reste (régimes → patterns → stack → problèmes → arbre) alors que le schéma 04 est une bibliothèque. Si Mathieu préfère le 04, swap trivial.
  - **(d) L'angle Klarna §11.7.1** : double usage explicite avec Ch.21 (ROI). Vérifier que les deux lectures restent complémentaires, pas redondantes.
  - **(e) La frontière Ch.11 ↔ Ch.20** : §11.5.2 (runtime) introduit AgentCore Runtime, Vertex Agent Engine, Foundry Service. Le Ch.20 dédié va creuser la matrice vendor. À ne pas refaire en Ch.20 — règle d'écriture posée.
- [ ] Si validation : copier-coller la matière vers le futur format de sortie (print HTML / PDF) quand décidé

---

## Chapitre 10 — Compaction et oubli stratégique

> **Acte II — La boucle · Gabarit standard 16-24 p · ~5 500-6 500 mots**
> **Lecteur cible** : agent engineer, tech lead, RSSI, DPO.
> **Sortie lecteur** : sait choisir une famille de compaction selon le triangle régulatoire/économique, connaît la surface d'attaque cachée et les attributs OTel candidats du WG GenAI fin 2026, peut justifier le choix de policy auprès d'un DPO/RSSI.

### Statut

| Étape | Statut |
| --- | --- |
| Audit schémas source | ✅ fait (cf. §Audit ci-dessous) |
| Plan détaillé | ✅ fait |
| Manuscrit | ✅ **v1 livrée** — `docs/livre/ch10-compaction.md` (≈ 5 800 mots, 14 encadrés, 7 schémas intégrés) |
| Schémas à créer | 0 (la matière source couvre) |
| Schémas à fixer | ✅ fait — `cinq-familles.svg` ligne 26 (XML désormais valide via xmllint) |
| Renvois inter-chapitres | ✅ Ch. 9 (mémoire), Ch. 18 (observabilité), Ch. 19 (sécurité E4), Ch. 23 (gouvernance) |

### Sources matérielles

- **Dossier principal** : [`compaction-agentique/`](../compaction-agentique/) — publié 27 mai 2026
  - [Rapport complet (.md, ~6 000 mots)](../compaction-agentique/20260527-compaction-agentique-rapport.md)
  - [App interactive (.html)](../compaction-agentique/20260527-compaction-agentique-app.html)
  - 7 schémas SVG dans [`images/`](../compaction-agentique/images/)
- **Dossier cross-référencé** : [`memoire-agentique/`](../memoire-agentique/) — publié 30 avril 2026
  - 9 schémas SVG dans [`images/`](../memoire-agentique/images/) — utilisés pour la **transition Ch.9 → Ch.10** uniquement (renvoi, pas absorption).

### Audit des schémas — Ch.10

Sept schémas dans `compaction-agentique`, neuf dans `memoire-agentique` mobilisables. Classement S (au fil du texte) / R (récap chapitre) / E (essentiel transverse).

#### Schémas du dossier compaction-agentique (7)

| Fig | Slug | Aperçu | Taille | Catégorie | Statut | Note |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | [`mur-fenetre`](../compaction-agentique/images/20260527-01-mur-fenetre.svg) | [![mur-fenetre](../compaction-agentique/images/20260527-01-mur-fenetre.svg)](../compaction-agentique/images/20260527-01-mur-fenetre.svg) | 7.7 Ko | **S** §10.2 | tel quel | Pose le problème : courbe en U (Liu et al.). À garder en ouverture chapitre. |
| 02 | [`contrat-io`](../compaction-agentique/images/20260527-02-contrat-io.svg) | [![contrat-io](../compaction-agentique/images/20260527-02-contrat-io.svg)](../compaction-agentique/images/20260527-02-contrat-io.svg) | 8.3 Ko | **S** §10.3 | tel quel | Anatomie I/O + 4 rôles (compactor, ledger, retrieval handle, security wrap). |
| 03 | [`cinq-familles`](../compaction-agentique/images/20260527-03-cinq-familles.svg) | [![cinq-familles](../compaction-agentique/images/20260527-03-cinq-familles.svg)](../compaction-agentique/images/20260527-03-cinq-familles.svg) | 14 Ko | **S** §10.4 | ⚠ **fix XML** + tel quel | Schéma le plus dense (5 colonnes summarization / eviction / hiérarchique / retrieval / learned). **Bug ligne 26** : `</title<` au lieu de `</text>` — duplication du titre. À corriger avant intégration. |
| 04 | [`triangle-tradeoff`](../compaction-agentique/images/20260527-04-triangle-tradeoff.svg) | [![triangle-tradeoff](../compaction-agentique/images/20260527-04-triangle-tradeoff.svg)](../compaction-agentique/images/20260527-04-triangle-tradeoff.svg) | 8.9 Ko | **R3** §10.5 + récap fin de chapitre | tel quel | **Schéma signature du chapitre.** Triangle non-dégénéré fidélité × coût × oubliabilité, positionnement des 5 familles, encadré "Conséquence opérationnelle" déjà présent côté droit. Format actuel A4 paysage 1200×760, à imprimer A3 paysage double-page si le récap pleine page est validé. |
| 05 | [`matrice-production`](../compaction-agentique/images/20260527-05-matrice-production.svg) | [![matrice-production](../compaction-agentique/images/20260527-05-matrice-production.svg)](../compaction-agentique/images/20260527-05-matrice-production.svg) | 9.6 Ko | **S** §10.6 | tel quel | Matrice 5 produits × 4 dimensions (Claude Code / Cursor / ChatGPT / Mem0 / Letta). |
| 06 | [`cycle-attaque`](../compaction-agentique/images/20260527-06-cycle-attaque.svg) | [![cycle-attaque](../compaction-agentique/images/20260527-06-cycle-attaque.svg)](../compaction-agentique/images/20260527-06-cycle-attaque.svg) | 9.5 Ko | **S** §10.7 | tel quel | Cycle d'attaque memory poisoning persistant à travers la compaction (SpAIware). À renvoyer ensuite vers le futur schéma **E4 (threat model unifié)** en Ch.19. |
| 07 | [`horizon`](../compaction-agentique/images/20260527-07-horizon.svg) | [![horizon](../compaction-agentique/images/20260527-07-horizon.svg)](../compaction-agentique/images/20260527-07-horizon.svg) | 7.4 Ko | **S** §10.9 | tel quel | Horizon 2026-2028 : compactors appris, multi-résolution, ledger transparent OTel. |

#### Schémas du dossier memoire-agentique (cross-ref, 9)

Tous appartiennent au **Ch.9 — Mémoire agentique** (Acte II). Listés ici pour vérifier les redondances et fixer les renvois.

| Fig | Slug | Catégorie Ch.9 | Renvoi depuis Ch.10 |
| --- | --- | --- | --- |
| 00 | [`exec-sum-a4`](../memoire-agentique/images/20260430-00-exec-sum-a4.svg) | annexe rapport (27.5 Ko) | non |
| 01 | [`cadrage-strategique`](../memoire-agentique/images/20260430-01-cadrage-strategique.svg) | S Ch.9 §1 | non |
| 02 | [`taxonomie-piliers`](../memoire-agentique/images/20260430-02-taxonomie-piliers.svg) | **R2 Ch.9** (récap 4 piliers) | ✅ renvoi dans §10.1 ouverture |
| 03 | [`cycle-de-vie`](../memoire-agentique/images/20260430-03-cycle-de-vie.svg) | S Ch.9 (6 opérations) | non |
| 04 | [`frameworks-matrice`](../memoire-agentique/images/20260430-04-frameworks-matrice.svg) | S Ch.9 (matrice frameworks) | non — la matrice production compaction §10.6 couvre |
| 05 | [`context-engineering`](../memoire-agentique/images/20260430-05-context-engineering.svg) | S Ch.9 | non |
| 06 | [`vendors-comparison`](../memoire-agentique/images/20260430-06-vendors-comparison.svg) | S Ch.9 (vendors mémoire) | non |
| 07 | [`surface-attaque`](../memoire-agentique/images/20260430-07-surface-attaque.svg) | S Ch.9 (MITRE ATLAS AML.T0080) | ⚠ **complémentaire** au `compaction-06-cycle-attaque` — voir §Redondances |
| 08 | [`roadmap`](../memoire-agentique/images/20260430-08-roadmap.svg) | S Ch.9 (roadmap 6/12/18 mois) | non |

### Redondances et complémentarités

**Pas de doublon vrai entre `compaction-agentique` et `memoire-agentique`**. Les deux dossiers sont **strictement complémentaires** :

| Sujet | `memoire-agentique` (Ch.9) | `compaction-agentique` (Ch.10) | Décision |
| --- | --- | --- | --- |
| Taxonomie générale | 4 piliers travail/sémantique/épisodique/procédurale | Approfondit le pilier *travail / scratchpad* | Ch.9 cartographie, Ch.10 approfondit un pilier |
| Surface d'attaque mémoire | `memoire-07-surface-attaque.svg` = MITRE ATLAS AML.T0080 (vue générale) | `compaction-06-cycle-attaque.svg` = cycle SpAIware spécifique au compactor | Les deux schémas restent — le Ch.10 cite le Ch.9 et ouvre vers le futur E4 (threat model unifié) en Ch.19 |
| Frameworks / vendors | `memoire-04` + `memoire-06` (mémoire long-terme : Letta, Mem0, Zep, A-MEM, Generative Agents) | `compaction-05` (compactors prod : Claude Code, Cursor, ChatGPT, Mem0, Letta) | Pas de doublon — l'angle est différent (mémoire vs compaction). Renvoi croisé possible mais pas indispensable. |
| Architectures cognitives | CoALA Sumers et al. TMLR 2024 | non couvert | Reste Ch.9 |
| Lost in the Middle | non couvert | Liu et al. TACL 2024 | Reste Ch.10 |

**Une seule absence notable, non bloquante** : pas de schéma de transition « Où agit la compaction dans la grille des 4 piliers mémoire ». Coût ≈ 1 h SVG. **Décision** : textualiser la transition via un encadré `> [!INFO] Voir Ch.9` plutôt que de créer un schéma redondant. Si l'éditeur le réclame en relecture, on le créera.

### Plan détaillé du chapitre

```
> [!QUESTION] Question d'ouverture
  Pourquoi 1 M tokens de fenêtre ne suffisent pas, et comment fait-on oublier
  un agent sans détruire sa cohérence ?

> [!TLDR] TL;DR décideur (5 lignes)

§10.1  De la mémoire à la compaction (transition Ch.9 → Ch.10)
       └─ encadré [!INFO] Voir Ch.9

§10.2  Pourquoi 1 M tokens de fenêtre ne suffisent pas
       ├─ [SVG S] mur-fenetre.svg
       ├─ La courbe en U de Liu et al. (TACL 2024)
       │  └─ encadré [!QUOTE] Liu et al.
       └─ Les contraintes économiques et de latence

§10.3  Anatomie de la compaction
       ├─ [SVG S] contrat-io.svg
       ├─ Le contrat I/O
       │  └─ encadré [!EXAMPLE] pseudo-code compact()
       └─ La policy comme première classe

§10.4  Cinq familles de stratégies
       ├─ [SVG S] cinq-familles.svg (après fix XML)
       ├─ Summarization LLM
       ├─ Eviction attention-based
       ├─ Hiérarchique avec paging
       ├─ Retrieval-augmentée
       ├─ Compactors appris
       └─ encadré [!ATTENTION] aucune dominante

§10.5  Le triangle fidélité × coût × oubliabilité
       ├─ encadré [!IMPORTANT] règle du triangle non-dégénéré
       ├─ Positionnement des 5 familles
       └─ Conséquence opérationnelle (B2C/B2B/streaming)

§10.6  Compaction en production
       ├─ [SVG S] matrice-production.svg
       └─ Trois observations transversales

§10.7  La surface d'attaque cachée
       ├─ [SVG S] cycle-attaque.svg
       ├─ Le cycle d'attaque memory poisoning persistant
       │  └─ encadré [!WARNING] SpAIware
       ├─ Pourquoi les filtres I/O ne suffisent pas
       └─ encadré [!INFO] Voir Ch.19 (E4 threat model unifié)

§10.8  RGPD, AI Act et l'oubli prouvable
       ├─ Trois cas de figure
       ├─ encadré [!NOTE] Rappel RGPD art.17
       ├─ encadré [!IMPORTANT] AI Act art.10 + 25
       ├─ Machine unlearning (CNIL/EDPS 2025-2026)
       └─ encadré [!INFO] Voir Ch.23 (gouvernance)

§10.9  Horizon 2026-2028
       ├─ [SVG S] horizon.svg
       ├─ Compactors appris (2026-2027)
       ├─ Multi-résolution (2026-2028)
       ├─ Ledger transparent et observabilité (2027-2028)
       │  └─ encadré [!INFO] Voir Ch.18 (WG GenAI OTel)
       └─ AI Act art.25 transforme observabilité en obligation

Récap chapitre — Le triangle non-dégénéré
       └─ [SVG R3] triangle-tradeoff.svg (pleine page A3 paysage)

> [!WARNING] Piège classique
  Faire confiance à /compact sur un agent à mémoire persistante sans signer
  les compactions — une injection paraphrasée 3 mois en arrière reste active.

Sources (12 footnotes du rapport)
```

### Encadrés prévus dans le chapitre

Variété des `> [!TYPE]` Obsidian retenus :

| Type | Usage | Compte |
| --- | --- | --- |
| `[!QUESTION]` | Ouverture chapitre | 1 |
| `[!TLDR]` | Synthèse décideur | 1 |
| `[!INFO]` | Renvois inter-chapitres (Ch.9, 18, 19, 23) | 4 |
| `[!QUOTE]` | Citation Liu et al. | 1 |
| `[!EXAMPLE]` | Pseudo-code contrat I/O | 1 |
| `[!ATTENTION]` | Pas de famille dominante | 1 |
| `[!IMPORTANT]` | Règle du triangle + AI Act art.10/25 | 2 |
| `[!NOTE]` | Rappel RGPD art.17 | 1 |
| `[!WARNING]` | SpAIware + piège classique | 2 |
| **Total** | | **14** |

### Tâches restantes Ch.10

- [x] Rédiger le manuscrit `docs/livre/ch10-compaction.md`
- [x] Corriger le bug XML `cinq-familles.svg` ligne 26 (`</title<` → `</text>`) — validé `xmllint --noout`
- [ ] Relecture Mathieu — passe critique sur le triangle (positionnement des familles relativement aux sommets) et sur l'encadré SpAIware
- [ ] Si validation : copier-coller la matière vers le futur format de sortie (print HTML / PDF) quand décidé

### Tâches restantes globales livre

- [ ] Auditer les 22 dossiers restants (priorité : `evaluation-agentique` Ch.17, `economie-inference` Ch.5, `modeles-raisonnement` Ch.2, `mcp-plateforme` + `mcp-securite` Ch.12-13)
- [ ] Créer le schéma E4 (threat model unifié 2026) — ~4-6 jours, schéma le plus coûteux
- [ ] Créer E3 (capability × cost) et R16 (J-curve × LLMflation) — ~2-3 j chacun
- [ ] Créer R1 (boucle ReAct canonique + 3 variantes) si édition print le demande — ~3-5 j (v1 du Ch.7 fait sans, par superposition textuelle)
- [ ] Décider du format de sortie (print PDF / web interactif / les deux)
- [ ] Décider du calendrier de gel des contenus évolutifs
