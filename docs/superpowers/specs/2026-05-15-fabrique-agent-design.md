# Design — *La fabrique d'un agent*

**Slug** : `fabrique-agent`
**Date** : 2026-05-15
**Branche** : `claude/fabrique-agent`
**Statut** : validé pour exécution phase 1 (rapport markdown). Phases 2 (app illustrée) et 3 (scrolly) cadrées en outline.

---

## 1. Intention du dossier

*La fabrique d'un agent* est un dossier **autonome** de la série d'études du site. Il décrit le métier d'équipe qui produit et maintient un agent en production — non l'agent comme produit fini, mais la **fabrique** qui le fait tenir dans le temps : les artefacts partagés (backlog, golden dataset, registres, runbooks, ROI cards…) que cette équipe écrit, lit, fait évoluer et défend.

Le dossier raconte cette fabrique sous **quatre stades de maturité** successifs :

- **Stade 1 · Prototype · « ça parle »** — un dev, un notebook, un prompt qui grossit.
- **Stade 2 · Pilote · « ça mesure »** — utilisateurs réels, première mesure, première vallée.
- **Stade 3 · Production · « ça tient »** — SLA, gouvernance, FinOps, runbook.
- **Stade 4 · Mature multi-agents · « ça apprend »** — swarm, mémoire partagée, mise à jour continue.

Trois personas lisent en parallèle, chacun avec son parcours balisé : PM / PO produit 🎯, Builder / Tech lead 🔧, Cadre tech encadrant 🧭.

### Positionnement vis-à-vis des autres dossiers

Le rapport **est auto-suffisant**. Il assume des recouvrements avec les dossiers existants (anatomie, harness-agentique, observabilite-agents-ia, evaluation-agentique, memoire-agentique, gouvernance, measure-roi, ia-et-travail, economie-inference) mais les revisite tous sous l'angle *artefacts partagés × maturité d'équipe*. Une Annexe B liste les pointeurs « voir aussi » pour le lecteur qui veut creuser une dimension donnée.

L'oignon à 10 couches d'anatomie n'est **pas la colonne vertébrale** de ce dossier. Il apparaît en ouverture comme un sommaire-index (SCHÉMA 01) qui rappelle la grammaire de base du site, puis on passe à la grammaire propre de la fabrique. Les deux sont orthogonaux : anatomie décrit la **structure** d'un agent, la fabrique décrit la **fabrication** d'un agent.

---

## 2. Identité éditoriale

| Champ | Valeur |
|---|---|
| Slug | `fabrique-agent` |
| Eyebrow | `Dossier · La fabrique` |
| Titre | *La fabrique d'un agent* |
| Sous-titre | Quatre stades de maturité, dix artefacts partagés, une équipe qui apprend à livrer des agents |
| Lede (≈ 240 sgnes) | Un agent ne devient pas un produit en ajoutant un LLM. Il devient un produit quand une équipe se dote des artefacts partagés qui font tenir sa fabrication : un backlog, des traces, un golden dataset, des registres. Voici comment ces artefacts naissent, mutent et s'enrichissent au fil des quatre stades de maturité. |
| Type / badge | `Dossier` |
| Date publication | 2026-05-15 (ou date de merge de la PR) |
| og:title | *La fabrique d'un agent — quatre stades de maturité, dix artefacts partagés* |
| Disclosure IA | « Format co-écrit avec l'aide d'une IA » en footer du rapport |
| Mention Lincoln | Footer global du site uniquement |
| Place dans `index.html` racine | En tête de la grille `#series` (dossier le plus récent à date) |

---

## 3. Squelette du rapport

Fichier : `fabrique-agent/20260515-fabrique-agent-rapport.md` (~10 000 mots).

```
0. OUVERTURE
   0.1 Hook : « Un agent ne crashe pas, il dérive » (citation anatomie).
       Pourquoi 95 % des pilotes sont au point mort (MIT NANDA) et
       70 % des POC ne passent jamais en prod.
   0.2 Thèse : la maturité d'une fabrique se lit dans la qualité de
       ses artefacts partagés, pas dans son code. Le harness est
       différenciant, mais ce qui le tient en vie c'est la fabrique
       autour.
   0.3 Rappel : l'oignon à 10 couches (renvoi compact à anatomie).
       SCHÉMA 01 — sommaire-index.
   0.4 Les 10 artefacts partagés (vue d'ensemble : colonne droite
       du SCHÉMA 01, récap final en SCHÉMA 12).
   0.5 Comment lire ce rapport : trois personas, trois parcours.

1. STADE 1 · PROTOTYPE · « ça parle »
   1.1 La scène. SCHÉMA 02 (atelier-totem #1).
   1.2 Artefacts qui existent déjà sous forme brouillon :
       - Backlog post-it / doc partagé
       - Prompt système v0 (non versionné) — SCHÉMA 03
       - Scratchpad mémoire de travail (CoALA #1)
       - Golden dataset embryonnaire (20-50 tasks tirées du manuel)
       - Logs print
   1.3 Antipattern signature : « il marche sur mon laptop ».
       Boucle infinie à 4 $/min sans budget de tours.
   1.4 Signal de bascule : un utilisateur réel passe son premier
       message.

2. STADE 2 · PILOTE · « ça mesure »
   2.1 La scène. SCHÉMA 04 (atelier-totem #2).
   2.2 Artefacts qui naissent :
       - DoD adaptée aux agents & critères de release v0
       - Traces OTel GenAI (4 spans canoniques)
       - 3 piliers d'observabilité (usage + perf + comportement)
       - TestCase formalisé — SCHÉMA 05
       - Mémoire sémantique (RAG basique) + épisodique (logs horodatés)
       - Boucle de feedback user (thumbs up/down + raison)
       - Premier dashboard, premier alerting (L0-L1)
   2.3 La vallée de la mort — SCHÉMA 06. Sans le palier N3 (eval
       continue), on ne sortira pas. Ce qui manque encore en
       artefacts : budget FinOps, runbook, registries, gouvernance
       formelle.
   2.4 Antipattern signature : « on alerte sur tout, donc plus
       personne ne lit les alertes ».
   2.5 Signal de bascule : un SLA est promis ou un risque
       réglementaire pointe.

3. STADE 3 · PRODUCTION · « ça tient »
   3.1 La scène. SCHÉMA 07 (atelier-totem #3).
   3.2 Artefacts qui montent en grade :
       - Epics produit & roadmap
       - Tools registry & policy (least agency explicite)
       - Agent registry (Entra Agent ID + templates Purview/Defender)
       - Budget FinOps : par agent / flow / tenant
       - Runbook & politique HITL : approval gates + escalation L2-L4
       - Charte de risques & 3 lignes de défense (SR 11-7) — overlay
         dans SCHÉMA 07
       - Pipeline d'évaluation continue : gruyère suisse à 5 couches
         — SCHÉMA 08
       - CLEAR pour décisions multi-critères
       - Cognitive audit trail
       - 6 piliers d'observabilité activés
   3.3 OBO vs Régime autonome — SCHÉMA 09. La facture cachée et le
       choix structurant.
   3.4 La boucle agentique sous tension : quand on dégrade (cache
       hit fallback, modèle low-cost, refus poli). Discipline du
       pass^k.
   3.5 Antipattern signature : « le runbook est à jour mais
       personne ne l'a lu ».
   3.6 Signal de bascule : un deuxième agent rejoint le premier,
       ou : on veut que l'agent apprenne.

4. STADE 4 · MATURE MULTI-AGENTS · « ça apprend »
   4.1 La scène. SCHÉMA 10 (atelier-totem #4).
   4.2 Artefacts qui fusionnent :
       - Mémoire CoALA complète (4 piliers) — SCHÉMA 11
       - Memory pool partagé avec scoring qualité
       - Pipeline de mise à jour (prompt système, modèle, mémoire)
         versionné séparément, A/B continu, machine unlearning RGPD
       - Évaluation adverse intégrée : tasks adversarial deliberate,
         red team, simulation user dual-control (τ²-bench)
       - Protocoles inter-agents : MCP / A2A / AG-UI, Agent Card,
         file-based handoff
       - Mode d'exécution à l'échelle : self-host vs managed
         (arbitrage TCO)
       - ROI cards mûres : 5 axes × 3 temporalités
   4.3 Impact équipe : réallocation du temps gagné (Cigref) comme
       condition sine qua non. Distinction augmentation (52 %) vs
       automatisation (45 %) — Anthropic Economic Index. Pause
       d'Engels comme scénario à éviter par choix, pas par fatalité
       (six leviers Acemoglu).
   4.4 Antipattern signature : « les agents écrivent leur mémoire
       mais ne la lisent jamais ».

5. CLÔTURE
   5.1 Tableau récap des 10 artefacts × 4 stades — SCHÉMA 12.
   5.2 Trois questions à se poser avant de démarrer une fabrique
       d'agent (une par persona).
   5.3 Coda : « le travail n'est pas un destin technologique ».
   5.4 Disclosure IA + sources.

A. ANNEXE — Glossaire (20 termes)
B. ANNEXE — Voir aussi (pointeurs vers les dossiers existants)
C. ANNEXE — Sources
```

---

## 4. Métaphore visuelle signature : *L'atelier en coupe, visité quatre fois*

Le dossier a **un schéma-totem** : un atelier en cross-section, vu de face. On le revisite à chaque stade ; à chaque visite il est plus peuplé, plus instrumenté, plus organisé. Dans l'app scrolly à venir (phase 3), un seul SVG dont les éléments fade-in / fade-out au scroll — personnages qui arrivent, postes qui s'installent, dashboards qui s'allument, conveyors qui se mettent en marche.

Sur la version markdown statique (phase 1), 4 SVG distincts — un par stade — capturent les états-clés (SCHÉMAS 02, 04, 07, 10).

L'atelier reste sobre dans son traitement (atelier d'artisan/d'ingénieur contemporain, ni usine du XIXe ni cockpit aérospatial). Personnages très épurés (silhouettes), instruments lisibles à 320 px.

---

## 5. Catalogue des 12 schémas SVG

Convention typo : celle de `coding-agents` (28pt titre, 18pt italic subtitle, 15pt body label, 13pt annotation, 12pt italic caption, 15pt mono numeric, 12pt mono marker, 12pt mono CARMINE schema marker). Zoom plein écran obligatoire (pattern `setupZoom()`).

| # | Titre | Type | Apparition |
|---|---|---|---|
| 01 | L'oignon ↔ la fabrique (TOC visuel) | Double-page compacte. À gauche, oignon 10 couches en mode index ; à droite, 10 artefacts en colonne ; lignes de correspondance fines au milieu. Renvoi anatomie. | 0.3 |
| 02 | L'atelier · Stade 1 (Prototype) | Atelier-totem #1. Un dev, un notebook, un prompt qui grossit, mur quasi vide, menace boucle infinie en coin. | 1.1 |
| 03 | Anatomie du prompt v0 comme palimpseste | Le prompt système dessiné comme un manuscrit raturé : couches d'instructions, identités, garde-fous, outils. Daté à chaque rature. | 1.2 |
| 04 | L'atelier · Stade 2 (Pilote) | Atelier-totem #2. PO rejoint le dev, premier dashboard 3 cadrans, pile de 50 cartes golden dataset au sol, microphone (feedback users), tuyau OTel au plafond. | 2.1 |
| 05 | Anatomie d'un TestCase | (Persona × Quest × Environment) → Expected Outcome. Trois boîtes en input qui se composent ; output éclaté en deux familles : metrics déterministes + suite de juges LLM single-responsibility. | 2.2 |
| 06 | La vallée de la mort des pilotes | Courbe éditoriale. X = temps de vie du pilote ; Y = probabilité de prod. Falaise franchie ou pas selon palier N3. 70 % tombent. Trois flèches accusent : FinOps absent · eval discontinue · gouvernance informelle. | 2.3 |
| 07 | L'atelier · Stade 3 (Production) | Atelier-totem #3. PO + Builder + SRE + Auditeur. Mur entier = tableau de bord 6 piliers. Au centre : coffre-fort = tools + agent registry. Au sol : cordon rouge = approval gate. Au plafond : horloge SLA. À droite : compteur FinOps (pompe à essence). | 3.1 |
| 08 | Le gruyère suisse de l'évaluation | 5 tranches superposées (auto · monitoring · A/B · revue · études), trous décalés. Bille d'incident traverse trois trous mais s'arrête au 4e. | 3.2 |
| 09 | OBO vs Régime autonome — la facture cachée | Diptyque. À gauche, agent OBO (~17 % du projet en gouv.) avec liste de coûts détaillée ; à droite, régime autonome (30-40 %) avec sa propre liste. Comparaison brutale, lecture en un coup d'œil. | 3.3 |
| 10 | L'atelier · Stade 4 (Mature multi-agents) | Atelier-totem #4. 4-5 agents (silhouettes distinctes) sur la scène, memory pool commun au centre comme un puits, équipe humaine en coulisses, ROI cards en damier sur le mur, conveyor d'éval continue. | 4.1 |
| 11 | La mémoire CoALA en cycle | 4 mémoires (travail · sémantique · épisodique · procédurale) comme 4 organes connectés par cycle 6 opérations (récupération · consolidation · mise à jour · indexation · compression · oubli). | 4.2 |
| 12 | Le tableau de récap · 10 × 4 | Grille finale 10 artefacts × 4 stades. Chaque cellule = un mot ou une icône qui décrit l'état de l'artefact à ce stade. Lecture comme partition. | 5.1 |

---

## 6. Les 10 artefacts partagés × 4 stades (matrice complète)

Cette matrice est le matériel canonique du rapport. Chaque cellule est un *état* d'un artefact à un stade — pas une instruction, juste l'état observable.

| Artefact | Stade 1 · Prototype | Stade 2 · Pilote | Stade 3 · Production | Stade 4 · Mature multi-agents |
|---|---|---|---|---|
| **1 · Backlog produit** | Post-it / doc partagé non priorisé · issues GitHub improvisées | Premier backlog priorisé · DoD provisoire (qualité acceptable oui/non) | Epics + roadmap · DoD versionnée · critères release CLEAR multi-critères | Backlog multi-agent · roadmap d'évolution coordonnée · capacity planning |
| **2 · Prompt système & spec** | Prompt griffonné dans le notebook, non versionné | Versionné git · changelog · tests de régression sur cas critiques | Prompt + Agent Card (MCP/A2A) · review obligatoire pour modifier | Pipeline A/B · versioning séparé prompt / modèle / mémoire · machine unlearning RGPD |
| **3 · Tools registry & policy** | Tools en dur dans le code, pas de registry | Liste centralisée informelle · premières restrictions (least agency émergent) | Registry formel : qui peut quoi · audit des permissions · least agency explicite | Registry multi-agent · scope partagé · politique de révocation rapide |
| **4 · Agent registry** | Non applicable (1 agent) | Un agent dans une CMDB ou doc | Entra Agent ID · templates Purview/Defender · ownership clair | Registry multi-agent · protocoles A2A / Agent Cards · lifecycle |
| **5 · Contexte & mémoire** | Scratchpad seul (CoALA #1) | Ajout sémantique (RAG basique) + épisodique (logs horodatés) | 3 piliers CoALA · cycle 6 opérations partiel (récup · compress · oubli RGPD) | 4 piliers CoALA · cycle complet · memory pool partagé · scoring qualité |
| **6 · Observabilité** | Logs `print`, métriques OS basiques | OTel GenAI + 3 piliers (usage · perf · comportement) · premier dashboard | 6 piliers complets · alertes L0-L4 · cognitive audit trail | Observabilité multi-agent (cross-agent traces · drift collectif) · LLM-as-judge automatisé continu |
| **7 · Golden dataset & éval** | 20-50 tasks tirées du manuel · capability d'abord · run ponctuel | TestCase formalisé · LLM-as-judge · alertes sur dégradation | Gruyère suisse (5 couches) · CLEAR multi-critères · capability/régression géré · pass^k explicite | Adversarial deliberate intégré · simulation user dual-control (τ²-bench) · simulation agent |
| **8 · HITL & charte risques** | Aucune charte · seul utilisateur (dev) | Politique ad hoc · premières gradations d'escalation | 3 lignes de défense (SR 11-7) · 14 piliers · approval gates · escalation L2-L4 · choix OBO vs Autonome | Charte multi-agent · simulation adverse intégrée · kill switch par agent · comité IA opérationnel |
| **9 · FinOps & routing** | Pas de budget, coûts subis | Monitoring coût par agent · premières limites (rate limit, daily cap) | Budget par agent / flow / tenant · règles routing (Sonnet/Opus/fallback) · alerting budget | Pool FinOps multi-agent · arbitrage TCO self-host vs managed · politique de dégradation économique |
| **10 · ROI cards & rituels** | Pas de mesure de valeur · "ça marche / ça marche pas" | Premières métriques (volume · qualité subjective) | ROI cards initiées (5 axes) · 1-2 méthodes (productivity gains, cost reduction) · rituels formels | 15 ROI cards · 8 méthodes · réallocation effective documentée · impact équipe mesuré (Anthropic Economic Index) |

---

## 7. Système de strates de lecture pour les trois personas

### 7.1 Trois parcours balisés en section 0.5

```
🎯 PM / PO produit         ~ 25 min   parcours fléché
   0.1 → 0.2 → 0.4 → 1.4 → 2.3 → 3.2 → 3.4 → 4.3 → 5.2

🔧 Builder / Tech lead     ~ 40 min   intégral, avec annexes

🧭 Cadre tech encadrant    ~ 20 min   parcours stratégique
   0.1 → 0.3 → 1.3 → 2.3 → 3.1 → 3.3 → 4.3 → 5.2 → 5.3
```

### 7.2 Callouts inline ciblés (max 3 par stade)

Syntaxe markdown (extension Obsidian-like) :

```markdown
> [!pm] **Pour le PM** 🎯
> Texte adressé au PM.

> [!builder] **Pour le builder** 🔧
> Texte adressé au Builder.

> [!decideur] **Pour le décideur** 🧭
> Texte adressé au Décideur.
```

Rendu HTML dans l'app : `<aside class="callout for-pm">` / `for-builder` / `for-decideur`. Trois nuances proches du `--accent` actuel (variations de saturation, pas de teinte), pour éviter le bruit chromatique.

### 7.3 Cartouches éditoriaux

| Tag markdown | Rendu HTML | Usage |
|---|---|---|
| `> [!scene]` | `<aside class="scene-card">` | Eyebrow éditorial avant chaque atelier-totem |
| `> [!antipattern]` | `<aside class="antipattern">` | Antipattern signature de chaque stade (1 par stade, fond plus sombre) |

### 7.4 Surlignages et termes

- **Surlignages stabilo** (`<mark>`) : signature visuelle du site. Syntaxe Obsidian `==texte==`. Réservé aux phrases-clés du corps narratif.
- **Termes du glossaire** (`<span class="term" data-def="...">terme</span>`) : tooltip au survol, expansion au clic. Géré par `dossier-app.js` existant.

### 7.5 Sélecteur de parcours animé dans l'app

Reporté à la phase app scrolly (phase 3). Non spécifié dans le présent design.

---

## 8. Glossaire (20 termes)

| # | Terme | 1ʳᵉ apparition |
|---|---|---|
| 1 | Harness (vs framework / wrapper / SDK) | Stade 1 |
| 2 | Boucle TAOR (Think · Act · Observe · Repeat) | Stade 1 |
| 3 | Golden dataset (capability d'abord, partir du manuel) | Stade 1 |
| 4 | Context engineering (Karpathy) | Stade 1 |
| 5 | DoD adaptée aux agents (vs DoD déterministe classique) | Stade 2 |
| 6 | Least agency (OWASP ASI 2026) | Stade 2 |
| 7 | HITL (Human-in-the-Loop) — sur-ensemble dont approval gate est un cas | Stade 2 |
| 8 | Approval gate (pattern HITL ciblé sur le flux sortant) | Stade 2 |
| 9 | OTel GenAI (4 spans : `invoke_agent` · `chat` · `execute_tool` · `gen_ai.evaluation.result`) | Stade 2 |
| 10 | TestCase = (Persona × Quest × Environment) → Expected Outcome | Stade 2 |
| 11 | LLM-as-a-judge (+ 5 biais : position · verbosity · self-enhancement · authority · format) | Stade 2 |
| 12 | Capability evals vs régression evals + graduate | Stade 2 |
| 13 | Gruyère suisse (5 couches d'éval empilées) | Stade 3 |
| 14 | CLEAR (Cost · Latency · Efficacy · Assurance · Reliability) | Stade 3 |
| 15 | OBO vs Régime autonome (~17 % vs 30-40 % du projet en gouv.) | Stade 3 |
| 16 | Pass@k vs Pass^k | Stade 3 |
| 17 | CoALA (mémoire : travail · sémantique · épisodique · procédurale) | Stade 1 → étoffée stade 4 |
| 18 | Memory poisoning (MITRE ATLAS AML.T0080) | Stade 4 |
| 19 | Hard savings vs Soft savings (Cigref) | Stade 4 |
| 20 | Réallocation du temps gagné (Cigref · condition sine qua non) | Stade 4 |

---

## 9. Mapping vers les dossiers existants (Annexe B)

| Pour creuser | Aller voir |
|---|---|
| Anatomie d'un agent (10 couches · boucle ReAct · domestiquer la variance) | **anatomie** |
| Le harness en profondeur (7 couches · pattern GAN · wide tools · file-based handoff) | **harness-agentique** |
| OTel GenAI · 6 piliers · N1→N5 · cognitive audit trail | **observabilite-agents-ia** |
| TestCase · gruyère suisse · LLM-as-judge biais · CLEAR · 8 étapes playbook | **evaluation-agentique** |
| CoALA · cycle 6 opérations · 5 frameworks (MemGPT, Generative Agents, A-MEM, Zep, Mem0) · memory poisoning | **memoire-agentique** |
| 14 piliers · 3 lignes de défense · OBO vs Autonome · Entra Agent ID | **gouvernance** |
| 5 axes ROI · 8 méthodes de calcul · 15 ROI cards | **measure-roi** |
| Augmentation vs automatisation · pause d'Engels · reverse skill bias · 6 leviers Acemoglu | **ia-et-travail** |
| Coût d'inférence · routing économique · TCO self-host vs managed | **economie-inference** |

---

## 10. Architecture du dossier dans le repo

```
fabrique-agent/
├── index.html                                # Hub
├── 20260515-fabrique-agent-rapport.md        # Phase 1
├── 20260515-fabrique-agent-app.html          # Phase 2 (à venir)
├── 20260515-fabrique-agent-scrolly.html      # Phase 3 (à venir)
├── images/
│   ├── 01-oignon-fabrique.svg
│   ├── 02-atelier-prototype.svg
│   ├── 03-prompt-palimpseste.svg
│   ├── 04-atelier-pilote.svg
│   ├── 05-testcase-anatomie.svg
│   ├── 06-vallee-de-la-mort.svg
│   ├── 07-atelier-production.svg
│   ├── 08-gruyere-suisse.svg
│   ├── 09-obo-vs-autonome.svg
│   ├── 10-atelier-mature.svg
│   ├── 11-coala-cycle.svg
│   └── 12-recap-10x4.svg
├── og.png                                    # 1200×630 SEO
└── README.md                                 # méta-doc dossier (optionnel)
```

Tuile dans `index.html` racine : en tête de la grille `#series`. Visuel de couverture : un détail de SCHÉMA 10 (l'atelier mature) ou un visuel dédié à concevoir.

Conventions site obligatoires à embarquer dans chaque page HTML interne :

- Favicon `/favicon.svg`
- Topbar 3-items (Mathieu · titre dossier · ← Hub · Accueil)
- Mobile-friendliness (7 points de CLAUDE.md)
- Surlignage `<mark>` (règle CSS ciblant `main mark`)
- Bouton zoom plein écran sur chaque schéma SVG (pattern `setupZoom()`)
- Lib `/assets/dossier-app.{js,css}` pour l'app (phase 2)
- Tag SEO via `python tools/seo_dossiers.py --only fabrique-agent` après mise à jour du hub

---

## 11. Roadmap de production en 3 phases

### Phase 1 — Rapport markdown (premier livrable, branche `claude/fabrique-agent`)

Livrables :
1. Les **12 SVG** dans `fabrique-agent/images/` (convention typo coding-agents).
2. Le **rapport markdown** `20260515-fabrique-agent-rapport.md` (~10 000 mots), avec :
   - Squelette de la section 3 ci-dessus respecté
   - 3 callouts max par stade
   - 1 cartouche `[!antipattern]` par stade
   - 1 cartouche `[!scene]` avant chaque atelier-totem
   - Surlignages `==…==` sur les phrases-clés
   - Termes du glossaire (.term) à la première occurrence des 20 termes
   - Annexe A glossaire · Annexe B voir aussi · Annexe C sources
3. Le **hub** `fabrique-agent/index.html` avec 1 carte format `format--admin` (lien vers le `.md`, intercepté en mode admin par `admin.js` pour download zip).
4. La **tuile** dans `index.html` racine (en tête de `#series`).
5. **og:image + bloc SEO** : `python tools/seo_dossiers.py --only fabrique-agent` (le driver appelle `og-card.py` automatiquement et regénère `og.png` 1200×630 + injecte le bloc SEO dans toutes les pages HTML du dossier).
6. **Topbar + favicon** sur toutes les pages HTML du dossier.
7. PR : `claude/fabrique-agent` → `main`. Pas de merge automatique — relecture par Mathieu.

### Phase 2 — App illustrée long-format (PR séparée, ultérieure)

- Dérive du rapport via la skill `illustrated-deep-research` (`assets/app-template.html`).
- Intègre la lib `/assets/dossier-app.{js,css}`.
- SCHEMAS interactifs (modales par carte cliquable).
- Hub mis à jour : 2 cartes (md + app).
- Plan détaillé produit via `writing-plans` au moment de l'exécution.

### Phase 3 — App scrolly avec overlays animés (PR séparée, ultérieure)

- Les 4 ateliers-totem deviennent 4 scènes scrolly d'un même SVG dont les éléments fade-in / fade-out au scroll.
- Pattern Intersection Observer + classes CSS `.active` sur les éléments SVG (cf. `anatomie/scrolly.html`).
- Sélecteur de parcours animé (🎯 / 🔧 / 🧭) qui surligne / dim les sections selon le parcours actif (non destructif).
- Hub mis à jour : 3 cartes (md + app + scrolly).
- Plan détaillé produit via `writing-plans` au moment de l'exécution.

---

## 12. Cadrage éditorial (rappels site)

- **Publication au nom de Mathieu Guglielmino, à titre personnel.** Pas un livrable interne.
- **Lincoln** : footer global du site uniquement (mention `Practice Manager Lincoln`). Jamais dans hero/articles/README/sources.
- **Jamais de clients ou projets internes nommés.**
- **Disclosure IA** : mention discrète en footer du rapport.
- **`main` = ce qui est publié sur GitHub Pages.** Toujours passer par `claude/fabrique-agent` et ouvrir une PR.
- **Création de PR via MCP GitHub** (`mcp__github__create_pull_request`), pas via `gh` (non installé).
- **Ne pas merger automatiquement.** Mathieu merge à la main.

---

## 13. Checklist de validation pré-merge (phase 1)

- [ ] Rapport ~10 000 mots, structure conforme à la section 3
- [ ] 12 SVG produits, valides XML (entités `&` `<` `>` échappées), polices conformes (convention coding-agents)
- [ ] Tous les SVG embarqués dans le markdown via syntaxe Obsidian `![alt|1300](images/NN-titre.svg)`
- [ ] Glossaire 20 termes en annexe A · `.term` à la 1ʳᵉ occurrence dans le texte
- [ ] Annexe B (voir aussi) · Annexe C (sources)
- [ ] Callouts 3 personas (max 3 par stade) · 1 antipattern par stade · 1 scene-card par atelier
- [ ] Hub `fabrique-agent/index.html` : 1 carte format--admin · pattern admin.js inclus
- [ ] Tuile dans `index.html` racine
- [ ] og.png 1200×630 généré · bloc SEO propagé (`tools/seo_dossiers.py --only fabrique-agent`)
- [ ] Favicon + topbar 3-items sur toutes les pages HTML internes (= le hub pour la phase 1)
- [ ] Mobile-friendliness vérifiée (7 points de CLAUDE.md)
- [ ] Aucune mention Lincoln hors footer global
- [ ] Disclosure IA présente
- [ ] PR ouverte vers `main` via MCP GitHub
