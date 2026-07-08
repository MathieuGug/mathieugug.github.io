# CC-10 — Pair programming → organisation dev agentique

> Spec éditorial pour le cas pratique CC-10 du livre. Strate 1 (Fondations / pôle profond), complémentaire de CC-00 (assistant transverse / pôle horizontal) et CC-03 (plateforme data / socle data). Slot `draft` dans `cases-index.json` v0.3 ; on l'amène à `livre` (JSON 19 sections + MD ~7 000 mots + 4 SVG + HTML rendu self-contained).

---

## 1. Métadonnées canoniques

| Champ | Valeur |
|---|---|
| `id` | CC-10 |
| `ordre` | 3 |
| `strate` | `fondations` |
| `titre` | Pair programming → organisation dev agentique |
| `secteur` | Développement logiciel |
| `horizontal` | true |
| `facette_principale` | `build_vs_buy` |
| `facettes_secondaires` | `evaluation`, `gouvernance` |
| `regime_recommande` | `buy` (comparatif par profil — pas uniforme) |
| `ia_type` | `agentic` |
| `axe_roi_principal` | `vitesse` |
| `axes_roi_secondaires` | `qualite`, `bienetre` |
| `gabarit` | `charniere` (~7 000 mots, jusqu'à 4 figures, 3 bifurcations, 3 quiz) |
| `verdict_prevu` | `GO_BUY_COMPARATIF_PAR_PROFIL` |
| `auteur` | Mathieu Guglielmino |
| `date_v1` | 2026-06-XX (à figer au commit) |

### Thèse — une ligne

> *Appliquer la boucle agentique au plus bas niveau — résoudre une issue, clôturer une PR, déléguer la review, jusqu'à la sécurité — sur de vraies fondations (MCP, observabilité) valide l'architecture avant de la remonter aux métiers. Mais l'**« all-you-can-eat » Copilot est mort** : le bon arbitrage 2026 n'est plus un outil unique imposé à toute l'équipe, c'est un **portefeuille par profil de ticket × profil de dev**, distribué via une gateway LLM avec quotas.*

### Décisions tranchées en brainstorming

- **Archétype d'entreprise** : ETI tech SaaS B2B, ~150 devs (validé). Permet d'évaluer les 4 patterns sans contrainte réglementaire bloquante et complète CC-01 (banque régulée) + CC-14 (grand groupe ETI mixte).
- **Personnage central de la scène d'ouverture** : **CTO** (validé). Fixe la voix narrative — l'arbitrage est vu depuis le poste qui doit trancher entre VP Eng (qualité), CFO (ROI Hard) et l'équipe.
- **Nommer les outils du marché** : **oui** (validé). La règle « pas de Klarna » s'applique aux entreprises clientes / cas d'école (anonymisées), pas aux SaaS du marché. Précédent CC-14 cite nommément Claude Code, GitHub, etc.
- **Section dédiée « Dérive des coûts »** après la grille canonique 8 postes (validé) — fil narratif explicite sur tokenmaxxing / Uber / refonte pricing Copilot.
- **4 patterns à évaluer en profondeur** (validé) : ghost autocomplete inline · chat IDE/CLI connecté · agent async cloud · code review automatique.

### Non-décisions (statu quo)

- (b) Profondeur du volet `evaluation` : reste à la dose proposée — renvoi explicite à `benchmarks-contestes/` dans la section 12, sans en faire un fil rouge transverse.

---

## 2. Contraintes éditoriales

- **Gabarit charnière** (`cases-index.json`) : ~7 000 mots, jusqu'à 4 figures (fig-00 obligatoire + 3 additionnelles), 3 bifurcations reader-driven, 3 quiz.
- **Pas de nom de client réel** ni de boîte cliente nommée. La scale-up ETI SaaS B2B reste anonyme (placeholder `[ETI_SAAS]` ou simplement « la scale-up »). Les **outils du marché sont nommés** (Cursor, Claude Code, Devin, Copilot, CodeRabbit, Greptile, Codex CLI, JetBrains AI, Tabby, Supermaven, Bedrock, etc.).
- **Pas de prénoms inventés** pour les personas — `[CTO]`, `[VP_ENG]`, `[STAFF_ENG_DX]`, `[TECH_LEAD]`, `[RSSI]`, `[DPO]`, `[CFO]`.
- **Pas de mention Lincoln** dans le corps. Footer-only via le HTML template.
- **Disclosure IA** en footer (`Format co-écrit avec l'aide d'une IA · …`).
- **Échappement SVG** : `&` `<` `>` en attributs et texte (rappel `feedback_svg_xml_validation`).
- **Renvois chapitres** : format markdown link `[ch. XX.Y](../../chapitres/chXX-*.md)` depuis `cases/CC-10.md` ; `../chapitres/` depuis `CC-10.html`.
- **Renvois croisés inter-cas** : références par numéro CC-XX et thèse, pas par titre (cf. règle `feedback_case_studies_no_brand_names`).
- **Image hint Obsidian** `|1300` (ou `|1480` pour fig-02 / fig-03 si paysage très large) sur chaque embed `![alt|N](path.svg)`.

---

## 3. Structure JSON — 19 sections obligatoires

Conforme à `livre/use-cases-data/schemas/case.schema.md` v2.

### 3.1 `meta`
Cf. tableau §1 ci-dessus.

### 3.2 `mise_en_situation`
- `scene` : 4-6 phrases. Standup mardi matin, scale-up SaaS B2B ~150 devs. Le **CTO** ouvre le tableau de bord finance interne : la ligne « AI tooling » a doublé en 6 mois. Au standup, quatre devs annoncent qu'ils utilisent quatre outils différents en parallèle (Cursor en perso, Copilot SSO entreprise, Claude Code via Bedrock, Codex CLI). Le matin même, **GitHub a envoyé un mail rappelant le passage aux premium requests** ; en filigrane le retex public d'**Uber** qui a fait dépasser son budget Copilot Enterprise circule sur les channels Slack inter-CTO. La VP Eng veut une doctrine, le CFO veut un plafond.
- `chiffres_bruts` : 6 chiffres — `Devs` 150 · `PR/sem` 280 · `Outils IA actifs` 4 (Cursor, Copilot, Claude Code, Codex CLI) + 2 review auto en POC (CodeRabbit, Greptile) · `Budget AI tooling annualisé` 480 k€ (×2 vs 2025) · `Cycle médian ticket → PR` 3,8 j · `eNPS dev` 38 (mesure interne).
- `horizon_temporel` : « POC 2 mois → doctrine v1 6 mois → régime fédéré 12 mois ».

### 3.3 `architecture_actuelle` → fig-00 obligatoire
Composants par catégorie :
- `canal_utilisateur` : Postes dev (mix VS Code 65 % / JetBrains 25 % / Neovim 10 %), Slack, Linear (web + macOS).
- `front_metier` (= IDE et CI) : Le mix IDE ci-dessus, GitHub.com (org Cloud), GitHub Actions (CI matrix), GitHub Advanced Security (secret scan).
- `data_scoring` (= obs et qualité) : Sentry (errors), Datadog APM + logs, Codecov, LaunchDarkly (feature flags).
- `core_metier` : Monorepo TypeScript (front + Node API) + un service Java (paiement legacy 2018, déconseillé d'agent async dessus), un service Go récent (event bus). Postgres + Redis managés.
- `knowledge_base` : Notion (specs, ADR), GitHub Discussions, Confluence legacy (en cours de migration vers Notion).
- `back_office` : Linear (ticketing), Vercel (preview environments), Vault (HCP) pour secrets.
- `outils_satellites` : 4 outils IA cités au standup, dont 2 hors SSO (achats perso → shadow soft).

Implications structurantes :
- Stack 100 % cloud, pas de mainframe → tous les patterns techniquement accessibles.
- Le service Java legacy 2018 est le **sclérosant** : agent async cloud déconseillé dessus jusqu'à refacto.
- Vault read-only scopé par équipe → MCP server Vault possible mais **scoping fin obligatoire**.
- GitHub Cloud + Bedrock dispo → bascule API privée Claude/GPT-5 sans contrainte souveraineté (un + vs CC-01).
- Datadog + Sentry → infra obs existante, à étendre pour observer les agents (cf. ch.20).

Renvoi figure : `fig-00`.

### 3.4 `application_concrete` → fig-02
Trois modes d'usage temporels + 4 niveaux d'autonomie + trajectoire multi-step typique.

**Modes** :
- `A — Coding inline` (caret IDE) : ghost autocomplete, dialogue chat IDE. Présent toute la journée. ~80 % des sessions dev.
- `B — Délégation de ticket` (agent async cloud, hors écran) : ouvert depuis Linear ou GitHub Issue, l'agent traite, revient avec une PR. ~10 % du flux mais le plus visible.
- `C — Review et merge` (PR GitHub) : agent code review en sentinelle + dev humain qui tranche.

**Niveaux d'autonomie** :
- `L1 Suggest` : ghost, copie-colle ou Tab. Toujours actif.
- `L2 Pré-remplir` : chat IDE avec multi-fichier diff proposé, validation step-by-step. Sénior et sénior+.
- `L3 Exécuter sous validation` : agent async qui ouvre une PR sur tier 1 / tier 2 bordé. Review humaine obligatoire avant merge.
- `L4 Pleine autonomie` : auto-merge si CI verte sur backlog `ROBOT-friendly` (bumps deps, traductions i18n, typage strict) — **opt-in explicite par repo**, jamais sur le service Java legacy ni sur le code de paiement.

**Tiering du ticket** :
- `Tier 1 — trivial` (bumps deps, traduction, typage, refacto de pattern connu) → pattern préféré : **agent async cloud**.
- `Tier 2 — refacto cadré multi-fichier` (extraction, rename API, migration framework cadré) → pattern préféré : **chat IDE en pair**.
- `Tier 3 — feature nouvelle / code prod sensible** → pattern préféré : **human-led + ghost + review auto en sentinelle**.

**Trajectoire multi-step exemple (mode B, tier 1)** :
1. `Listen` : ticket Linear taggé `tier-1` auto-routé vers l'agent async cloud (Claude Code background ou Cursor BG).
2. `Retrieve` : MCP calls vers GitHub (state du repo), Linear (acceptance criteria), Datadog (perf baseline).
3. `Reason + Plan` : chain-of-thought, plan publié en commentaire Linear et en draft PR description.
4. `Execute` : branch créée, commits, CI lancée.
5. `Audit` : log structuré + diff + traces MCP → audit trail Datadog. Renvoi ch.20.

### 3.5 `outils_internes` (MCP servers)
Table opérationnelle (effort × risque) :

| Système | Mode | Type MCP | Effort | Risque | Raison |
|---|---|---|---|---|---|
| GitHub | read_write | officiel | 2 j | bas | scoping par repo, accès limité au bot account |
| Linear | read_write | officiel | 1 j | bas | écriture des commentaires + transitions de statut |
| Datadog | read | officiel | 3 j | bas | observation agents async, dashboards éval |
| Sentry | read | officiel | 2 j | bas | corrélation incidents post-PR auto |
| Vault | read_only_scope | custom | 2 sem. | **haut** | scoping par équipe, masquage secret, audit |
| Notion | read | officiel | 3 j | bas | ADR + specs accessibles aux agents |
| Codecov | read | custom | 1 sem. | bas | détection régression coverage par agent |
| LaunchDarkly | read | officiel | 3 j | moyen | éviter qu'un agent toggle des flags prod |

Effort total : 5-6 semaines pour 1 backend / SRE senior. Renvois ch.15 (MCP plateforme) + ch.16 (sécurité MCP).

### 3.6 `modeles_cibles`
Candidats + cascade recommandée :

| Modèle | Force pour le cas | Faiblesse | Coût indicatif |
|---|---|---|---|
| Claude 4.7 Sonnet | Tool use natif, MCP first-class, 1M tokens, sweet spot dev | Cloud US (atténué Bedrock EU) | $3 / $15 par M tokens |
| Claude 4.7 Opus | Reasoning supérieur, idéal gros refactor | Coût × 5, latence | $15 / $75 par M tokens |
| Claude 4.7 Haiku | Latence faible, ghost autocomplete réaliste | Reasoning limité sur multi-fichier | $1 / $5 par M tokens |
| GPT-5 | Tool use solide, intégration Copilot par défaut | Lock-in Copilot, pricing premium | $5 / $25 par M tokens |
| Codestral 25B fine-tuné | Self-hosted possible, fallback dégradé tier 1 | Reasoning en retrait, infra | OpEx infra |
| Cursor proprietary (cursor-small) | Latence ghost imbattable, pricing siège | Boîte noire | inclus siège Cursor |

**Cascade recommandée** :
- Ghost (mode A inline) : **Haiku** (latence) ou Cursor-small natif.
- Chat IDE (mode A multi-fichier) : **Sonnet** par défaut, escalade Opus manuelle.
- Agent async cloud (mode B tier 1) : **Sonnet** + Opus en fallback réflexif si plan échoue 2× → cap budget par ticket.
- Code review auto (mode C) : **Sonnet** (CodeRabbit/Greptile) en sentinelle ; pas de bloc Opus en review (coût/PR insoutenable).

**Argument cascade** : tient le tweet « et si Anthropic est down ? » → fallback Codestral self-hosted sur tier 1. Anti-tokenmaxxing : Opus borné par budget de ticket et par session (cf. section 10 dérive des coûts).

### 3.7 `enjeux`
3 enjeux chiffrés :
- `Délester le quotidien` : -40 % cycle ticket → PR sur tier 1, +25 % throughput équipe.
- `Stabiliser la qualité` : taux de bug post-release stable à +25 % throughput (vrai test du pattern agent).
- `Soutenabilité économique` : poste inférence borné à 30 % du budget AI tooling, sinon dérive non finançable.

Benchmark : DORA *State of DevOps* 2025 + GitHub Octoverse 2026 (% PR ouvertes avec assistance agentique, distribution par taille d'équipe).

### 3.8 `build_buy`
Table 3 colonnes × 6 critères :

| Critère | Build pur (plateforme dev agent maison) | Buy uniforme (un seul outil pour tous) | **Buy comparatif par profil (hybride portefeuille)** |
|---|:---:|:---:|:---:|
| Data sensitivity | ++ | - | + |
| Personnalisation | ++ | - | + |
| Volumétrie | + | ++ | + |
| Lock-in | + | -- | 0 |
| Time-to-value | -- | ++ | + |
| Souveraineté | ++ | -- | 0 |
| **Verdict** | *Non — pas le métier d'une scale-up SaaS, effort énorme, retard de 18 mois sur l'état de l'art outils du marché.* | *Antipattern — chaque outil a ses forces, un Copilot universel laisse 30 % de vélocité sur la table sur les patterns chat IDE et async cloud. Et le pricing siège unique exploserait sur les power users.* | ***RECOMMANDÉ.** Mix ghost universel + chat IDE par profil sénior + async cloud pour tier 1 + review auto en sentinelle. Distribution via gateway LLM + quotas par profil. Doctrine itérée.* |

Décision pondérée : `Buy comparatif par profil` ; gateway LLM interne + tokens scopés par profil dev ; cascade modèle pour le run async ; doctrine en revue trimestrielle. Renvoi ch.23.6 (arbre décision).

### 3.9 `trajectoire_couts`
Phases :
- POC (2 mois, 10 devs early-adopters)
- Pilote (6 mois, 40 devs early adoption)
- Prod (12 mois, 150 devs + équipe DX en régime)
- Scale (36 mois, 150 devs + governance mature + cascade + sub-agents internes)

Postes (k€) — projection cohérente avec axe `Vitesse` + facette `build_vs_buy` + dérive inférence :

| Poste | POC | Pilote | Prod | Scale |
|---|---:|---:|---:|---:|
| Inférence (sièges + premium requests + API) | 18 | 95 | 320 | **620** |
| Infra (gateway LLM + observabilité agents) | 6 | 22 | 60 | 110 |
| Équipe (1,5 ETP DX cible) | 60 | 180 | 360 | 720 |
| Data (corpus ADR + golden set PRs) | 4 | 18 | 35 | 55 |
| Évaluation (régression suite + LLM-as-judge) | 3 | 25 | 80 | 160 |
| Gouvernance (RACI + doctrine + comité trim.) | 4 | 18 | 50 | 110 |
| Sécurité (scoping MCP + audit + RSSI) | 6 | 22 | 55 | 105 |
| Change (formation + doctrine continue + médiation profils) | 5 | 35 | 110 | 220 |
| **Total** | **106** | **415** | **1 070** | **2 100** |
| Coût par PR (≈) | 7,60 € | 4,80 € | 3,10 € | **2,30 €** |

`crossover_point` : ≈ 1 500 PR/an avec usage agentique → bascule de gateway LLM (interne) bat le tarif siège Copilot uniforme.

`commentaire_courbe` : **inférence × 35 entre POC et Scale**, vs équipe × 12, vs change × 44. Le poste change pèse plus que prévu parce que la doctrine doit évoluer trimestriellement (cf. dérive du pricing). Le coût par PR divise par ~3 mais c'est l'**inférence qui dérive sans gateway** — d'où la section dédiée §10.

### 3.10 `derive_couts` — section spéciale (ce cas ajoute une **section narrative**, pas une section JSON)

Cette section n'a pas d'équivalent dans le schéma canonique 19 sections — elle est insérée dans **le MD** entre la section 9 `trajectoire_couts` et la section 10 `gouvernance`, et matérialisée par **fig-03**.

Contenu (≈ 800 mots) :
- **Tokenmaxxing 2025-2026** : pratique mesurée chez les power users Claude Code/Cursor de tourner Opus en boucle (long context + tool calls) jusqu'à saturer le quota Max ; en réaction Anthropic introduit les **weekly rate limits** Sonnet/Opus (mid-2025), Cursor adapte ses tarifs Pro/Ultra et introduit Auto/Background limits. Le terme circule sur Twitter et a été repris dans la presse spécialisée 2025-2026.
- **Retex Uber Copilot Enterprise** : signal public 2025-2026 de dépassement budget AI dev tooling — le modèle siège illimité ne tient plus quand les devs power users tournent en boucle. Citer la source publique (interview / blogpost ingé Uber / talk DevX).
- **GitHub Copilot pricing 2025-2026** : passage aux **premium requests** (modèles avancés type Claude/GPT-5 comptés à part), quotas mensuels par siège (300 premium reqs / mois sur Business, 1500 sur Enterprise — à vérifier), dépassement facturé. Fin du modèle illimité.

Conclusion de la section : le modèle all-you-can-eat est mort. La **gateway LLM** (déjà introduite en CC-14 §7) refait surface ici comme **garde-fou financier dev** : tokens scopés par profil + quotas distribués + journalisation + plafond par ticket. Préfigure le verdict comparatif par profil.

Fig-03 : courbes superposées de coût/dev/mois 2024 → 2026 par pattern (ghost : stable ~$10 ; chat IDE : ~$20 → ~$60 ; async cloud : ~$0 → ~$140 ; review auto : ~$5 → ~$25). Annotations Anthropic weekly limits / Uber retex / Copilot premium reqs sur l'axe temps. Crossover gateway interne vs sièges au point Scale.

### 3.11 `gouvernance`
RACI :
- `responsable` : Staff eng Dev Productivity (1,5 ETP cible en Prod) + VP Eng
- `approbateur` : CTO (sponsor)
- `consultes` : CFO (budget), RSSI (scoping MCP + agents async sur code prod), DPO (PII dans les logs)
- `informes` : Tech leads par squad, COMEX (trimestriel)

Cadence revue :
- `comite_dev_practice` : mensuel (KPI usage + coût + qualité)
- `alertes` : continues (dépassement quota ticket, dépassement quota dev, taux re-prompt anormal)
- `audit_doctrine_externe` : annuel (revue par pair CTO inter-entreprise, type DX community)

Ligne AI Act :
- `niveau` : hors haut-risque par défaut (code interne, non-décisionnel sur tiers).
- `fondement` : non listé Annexe III — mais documenter le périmètre si agents async accèdent à du code de gestion utilisateur final / scoring.
- `actions` : registre interne agents async + doctrine (gate explicite pour les repos qui touchent client/PII).

Renvoi ch.25 (gouvernance AI Act) + ch.26 (IA et travail).

### 3.12 `evaluation`
- `regression_suite` : SWE-bench Live (mensuel) + golden set interne ~80 PRs annotées (replay) + critères : completion correcte, respect des conventions monorepo, pas de régression de typage, pas de leak secret.
- `metriques_online` : `pr-throughput`, `pr-acceptance-rate`, `time-to-pr`, `post-release-bug-rate` (stable malgré + throughput = bon signal), `re-prompt-ratio`, `enps-dev`.
- `detection_derive` : LLM-as-judge sur 5 % des PR async + alertes Datadog sur ratio re-prompt et taux de bug.
- `boucle_correction` : doctrine itérée trimestriel, rollback feature flag par pattern (`agent-async-tier-1: off`), bumps modèle testés en POC sur 10 devs.

Renvois : ch.19 (benchmarks contestés — citer `benchmarks-contestes/` sur SWE-bench gaming) + ch.20 (audit trail cognitif).

### 3.13 `roi`
- `axe_principal` : `vitesse`
- `axes_secondaires` : [`qualite`, `bienetre`]
- `methode_mobilisee` : TEI Forrester + DORA + ch.23.7 paradoxe agentique + ch.23.8 Cigref.
- `metriques` (références existantes dans `shared/roi-metrics.json` à vérifier avant rédaction) :
  - `processing-time` (cycle ticket→PR, -40 % cible)
  - `pr-throughput` (+25 % cible)
  - `post-release-bug-rate` (stable — KPI gardien)
  - `employee-engagement` (`enps-dev` +8 cible)
- `non_retenu` :
  - `cost-per-line` : anti-pattern Goodhart explicite (les LLM gonflent les lignes, sans valeur)
  - `revenue` : indirect, pas attribuable
  - `nps` : périmètre client, hors cas

### 3.14 `operation_equipe`

**Personas** :
- `porteur` : `[VP_ENG]` — convaincu, veut une doctrine partagée, pression du CTO.
- `sponsor` : `[CTO]` — arbitre final, sponsorise mais veut un plafond budget défendable au COMEX.
- `allie` : `[STAFF_ENG_DX]` — porte le programme opérationnel, animait déjà la communauté Cursor/Claude Code en interne.
- `opposant` : `[RSSI]` — refus agents async sur code prod sensible, exige scoping MCP fin et masquage PII.

**Équipe par phase** :
- POC (10 devs early-adopters, 2 mois) : 0,5 ETP Staff DX + 0,3 RSSI + 0,2 DPO.
- Pilote : 1 ETP Staff DX + 0,3 backend MCP + 0,3 RSSI + 0,2 DPO.
- Prod : 1,5 ETP Staff DX + 0,5 backend MCP + 0,3 RSSI + 0,2 DPO + 0,1 change manager.
- Scale : 2 ETP Staff DX + 0,5 SRE gateway + 0,3 RSSI + 0,2 DPO + 0,2 change.

**Vélocité** :
- POC : 2 mois, mode L1+L2 ghost+chat IDE, périmètre 10 devs early.
- Pilote : 6 mois, ajout L3 async cloud sur tier 1 + review auto en sentinelle.
- Prod : 12 mois, généralisation 150 devs, doctrine v1, gateway LLM interne.
- Scale : 36 mois, sub-agents custom internes, cascade modèle mature.

**Sclérosants (5)** :
- **Pricing fluctuant des outils du marché** (Anthropic weekly limits, Cursor Background changes, Copilot premium reqs) → doctrine **forcément trimestrielle**.
- **Service Java legacy 2018** → agent async cloud interdit dessus jusqu'à refacto (2 ans+ d'horizon).
- **Scoping MCP Vault** → 2 semaines, demande masquage secret + audit RSSI.
- **Formation continue** → bi-annuelle (montée des patterns chat IDE et async), inertie sur les juniors.
- **Mesure de l'eNPS dev** → outillage manquant en début, à instrumenter.

**Deadlines externes** :
- 2026-08 : AI Act transparence (Annexe III) — n'impacte pas directement le code interne, à documenter si agents touchent code de scoring/RH.
- 2026-Q3 : présentation doctrine v1 au COMEX (plafond budget AI tooling).
- 2027-Q1 : revue annuelle CFO du poste « AI dev tooling ».

### 3.15 `debat`
**Question** : *Le buy comparatif par profil installe-t-il une économie à deux vitesses dans l'équipe (sénior bien outillés vs junior bridés) ?*

**Pour** :
- Aligne outil sur valeur de ticket. La latence ghost suffit au junior 80 % du temps.
- Les coûts d'Opus/Claude Code/Cursor Ultra sur 30 % des devs power users représentent 60 % du budget AI tooling — distribuer uniformément, c'est gâcher.
- DORA mesure que l'effet ROI des outils dev se concentre sur les profils sénior + tickets standards (cf. ch.23.8).

**Contre** :
- Crée des classes (sénior outillé vs junior bridé) → risque culturel et turnover des juniors qui ne montent pas en compétence assistée.
- Les tickets « ROBOT-friendly » risquent d'être les seuls confiés aux juniors → spirale d'apprentissage cassée.
- Le pricing siège unique a une vertu : il pousse l'usage transverse, le portefeuille par profil le contredit.

**Verdict pondéré** : `GO_BUY_COMPARATIF_PAR_PROFIL` **mais** avec :
- KPI gardien `enps-dev` (+8 cible, alerte si -2).
- **Promotion rotative** : un junior par squad obtient l'outil sénior pendant 2 mois par an pour usage de montée en compétence (financement pris sur le poste change).
- KPI « % PRs où un junior a eu accès à un outil sénior pour un cas qui le méritait » mesuré trimestriellement.
- Le COMEX revoit la doctrine si écart eNPS sénior vs junior > 5 pts.

Renvois ch.23.5 (Hard vs Soft) + ch.23.7 (paradoxe agentique) + ch.26 (IA et travail).

### 3.16 `choix_lecteur` — 3 bifurcations (gabarit charnière)

#### 16.1 Sponsor du programme
*Vous êtes [VP_ENG]. Pour qui plaidez-vous comme sponsor exécutif ?*
- **A — CFO** : ROI Hard chiffrable au COMEX. *Piège — l'arbitrage se fera sur le coût pur, on perd le KPI qualité.* Renvoi ch.23.5.3.
- **B — VP Eng (vous)** : qualité du code et eNPS dev. *Piège — budget fluctuant pas défendable seul.* Renvoi ch.23.5.4.
- **C — CTO (recommandé)** : transverse, arbitre entre VP Eng et CFO. Renvoi ch.23.7.3.

#### 16.2 Réponse à la fin de l'all-you-can-eat
*GitHub Copilot annonce les premium requests. Vous faites quoi en 90 jours ?*
- **A — Tenir l'illimité chez un fournisseur niche.** *Piège — lock-in vendor et qualité incertaine.*
- **B — Accepter les quotas + les distribuer par profil via gateway interne (recommandé).** Cf. ch.15 + ch.22 (runtime managé vs maison).
- **C — Bascule API pure via Bedrock + cascade modèle interne complète.** *Effort lourd, time-to-doctrine 6 mois supplémentaires.*

#### 16.3 Autonomie des agents async sur code de prod
*Tier 1 ROBOT-friendly autorisé. Vous descendez jusqu'où ?*
- **A — Interdit total.** *Vous laissez 30 % du gain sur la table sur les tickets faciles.*
- **B — Autorisé tier 1 + review humain obligatoire (recommandé).** Renvoi ch.20 (audit trail cognitif).
- **C — Pleine autonomie + auto-merge si CI verte sur backlog ROBOT-friendly.** *Pari sur la couverture CI ; le jour où la CI rate, l'incident arrive en prod direct. Cf. ch.21 gardefous.*

### 3.17 `quiz` — 3 cartes

**Q1** : Pourquoi un seul outil IA pour toute l'équipe dev = antipattern 2026 ?
- Parce que les éditeurs IDE ne sont plus compatibles entre eux
- **Parce que les 4 patterns (ghost / chat IDE / async / review) sont structurellement différents — surfaces, latences, niveaux d'autonomie, modèles éco — un outil unique en laisse 30 % sur la table** ✓
- Parce que la loi AI Act l'interdit
- Parce que le pricing siège unique est moins cher

*Renvoi ch.14 + ch.23.7.*

**Q2** : Que mesure le « tokenmaxxing » et pourquoi change-t-il le pricing dev 2026 ?
- Le nombre maximum de tokens dans une seule requête
- **L'usage maximal du quota par session (long context + boucles Opus avec tool calls) — qui a poussé Anthropic à introduire des weekly rate limits, Cursor à plafonner Auto/Background, et GitHub Copilot à passer aux premium requests : le modèle all-you-can-eat n'est plus viable** ✓
- La compression maximale des tokens
- Une métrique de qualité du code généré

*Renvoi ch.5 (économie inférence) + section dédiée §10 du cas.*

**Q3** : Où s'arrête l'autonomie d'un agent async cloud sur le code de prod d'une scale-up SaaS B2B ?
- Pleine autonomie si CI verte sur tout le monorepo
- **Au périmètre `ROBOT-friendly` opt-in par repo (typage, deps, traduction, refacto pattern connu) — review humaine obligatoire, jamais sur le service legacy ni sur le code de paiement / scoring client** ✓
- Aucune autonomie, tous les agents async sont interdits
- L'autonomie dépend uniquement du modèle utilisé

*Renvoi ch.20 + ch.21 + bifurcation 16.3.*

### 3.18 `verdict`
- `stamp` : `GO_BUY_COMPARATIF_PAR_PROFIL`
- `label` : Buy par portefeuille, distribué par profil et par tier de ticket
- **10 conditions** :
  1. **Mix portefeuille** : ghost universel + chat IDE par profil + async cloud pour tier 1 + review auto en sentinelle.
  2. **Gateway LLM interne avec tokens scopés par profil dev** + quotas distribués + plafond par ticket.
  3. **Doctrine trimestrielle** révisée — le pricing des outils du marché bouge trop pour figer la doctrine à 12 mois.
  4. **KPI gardien `enps-dev`** + KPI « % PR juniors avec outil sénior » mesuré trimestriellement.
  5. **Promotion rotative** : un junior par squad obtient l'outil sénior pendant 2 mois/an.
  6. **MCP servers internes minimum** : GitHub, Linear, Datadog, Sentry, Vault scopé, Notion, Codecov (effort 5-6 sem.).
  7. **Tiering ticket explicite** dans Linear : auto-routage tier 1 → async cloud, tier 2 → chat IDE, tier 3 → human-led.
  8. **Code review auto en sentinelle obligatoire** sur les PRs des agents async.
  9. **Formation continue** : bi-annuelle, financement pris sur le poste change.
  10. **Charte agents async sur code de prod** : opt-in par repo, jamais sur legacy/paiement/scoring, audit trail Datadog obligatoire.

### 3.19 `renvois_livre`

`["ch.14", "ch.7", "ch.15", "ch.16", "ch.19", "ch.20", "ch.21", "ch.22", "ch.23.5", "ch.23.7", "ch.23.8", "ch.5", "ch.25", "ch.26"]`

### 3.20 `figures` (4)

| ID | Titre | viewBox suggéré | Rôle |
|---|---|---|---|
| **fig-00** | Architecture SI dev actuelle — scale-up SaaS B2B 2026 | 1600 × 1130 (A3 paysage) | Stack monorepo + GitHub + Linear + Datadog + Vault + service legacy, annotations criticité |
| **fig-01** | Anatomie comparée des 4 patterns d'agents de dev | 1600 × 900 | Tableau visuel — surface IDE/CI/PR, latence, autonomie, modèle éco, ticket type |
| **fig-02** | Workflow ticket en mode agentique | 1600 × 1000 | Trajectoire ouverture → tri → 3 voies par tier → review → merge, marqueurs L1-L4 |
| **fig-03** | Dérive des coûts inférence par pattern 2024-2026 | 1480 × 800 | Courbes par pattern + repères Anthropic weekly limits / Uber retex / Copilot premium reqs / crossover gateway |

---

## 4. Renvois croisés inter-cas

À tisser dans le MD :
- ↔ **CC-00** : pôle horizontal du livre (assistant transverse) — CC-10 est le pôle profond complémentaire.
- ↔ **CC-03** : socle data — mêmes réflexes (paved road, MCP, observabilité) sur la strate dev.
- ↔ **CC-11** : gouverner une flotte d'agents — la **gateway LLM avec quotas** est l'analogue financier dev du gateway agent.
- ↔ **CC-14** : power users — *les power users dev (= les devs eux-mêmes)* gouvernés par la même logique paved road + enablers que les power users métiers.

---

## 5. Structure du MD (17 sections numérotées)

Calquée sur CC-14 (calibration). Numérotation MD :

1. Scène d'ouverture — *Le CTO ouvre le tableau de bord finance*
2. La stack dev actuelle — *fig-00*
3. Anatomie des 4 patterns — *fig-01*
4. Workflow ticket en mode agentique — *fig-02*
5. Les 4 MCP servers qui font la différence
6. Modèles cibles + cascade
7. Pourquoi (3 enjeux + bench DORA)
8. Build / Buy / Hybride (verdict pondéré)
9. Trajectoire 8 postes × 4 phases
10. **Dérive des coûts : tokenmaxxing, Uber, fin de l'all-you-can-eat — *fig-03* (section spéciale)**
11. Gouvernance / RACI
12. Évaluation (régression + online + dérive)
13. ROI (méthodes + métriques + non retenu)
14. Équipe, vélocité, sclérosants
15. Débat (économie à deux vitesses ?)
16. Trois choix qu'il faut faire (16.1, 16.2, 16.3)
17. Verdict — `GO_BUY_COMPARATIF_PAR_PROFIL` + 10 conditions

Suivi des renvois livre + footnotes éditoriales (calibrer sur la densité de CC-14 : ~12-18 footnotes substantielles).

---

## 6. HTML rendu

Pattern repris de CC-14 (self-contained, CSS + JS inline) :
- Topbar 3-items (`← Cas pratiques` | `Pair programming → dev agentique` | `Hub livre →`).
- Hero avec eyebrow `Cas pratique CC-10 · Développement logiciel · Agentic · Charnière`.
- Widgets canoniques : `case-team-cast`, `case-archi` (fig-00 zoom), `case-app-modes` (modes A/B/C + L1-L4), `case-mcp`, `case-models`, `case-build-buy`, `case-cost-trajectory`, **`case-cost-drift`** (nouveau pour la section §10), `case-governance-stack`, `case-eval-loop`, `case-roi-grid`, `case-debate`, `case-choice` (×3), `case-quiz` (×3), `case-verdict`.
- Le widget `case-cost-drift` peut être implémenté comme un mini-svg interactif (3 courbes) ou comme un wrap autour de fig-03 — décision phase build_case_pages.
- Favicon `/favicon.svg`, polices Google Fonts, palette site (`--bg #faf6ec`, `--accent #b8582e`), bouton zoom ⛶ par figure, anchor `¶` par figcaption.
- Bloc OG injecté via `python tools/seo_dossiers.py --only cas-pratiques` après commit du HTML.

---

## 7. Ordre d'implémentation suggéré (pour writing-plans)

1. **JSON** `cases/CC-10-dev-agentique.json` — 19 sections du schéma canonique.
2. **MD** `cases/CC-10-dev-agentique.md` — 17 sections narratives (~7 000 mots) + footnotes.
3. **Figures** (parallélisables) :
   - 3.a `fig-00-architecture-actuelle.svg` (obligatoire en premier)
   - 3.b `fig-01-anatomie-patterns.svg`
   - 3.c `fig-02-workflow-ticket.svg`
   - 3.d `fig-03-derive-couts.svg`
4. **HTML** `CC-10-dev-agentique.html` — self-contained, calqué sur le patron CC-14.
5. **Index hub** `livre/cas-pratiques/index.html` — basculer la carte CC-10 de `class="draft"` à `class="livre"`.
6. **Hub livre racine** `livre/index.html` — incrémenter le compteur de cas livrés.
7. **Cases-index** `livre/use-cases-data/cases-index.json` — mettre `statut: "livre"` sur CC-10.
8. **SEO** : `python tools/seo_dossiers.py --only cas-pratiques` (regen og.png + injecte le bloc SEO dans CC-10.html).
9. **Tests CI** : passage de `tests/cases-contract.test.mjs`, `tests/roi-metrics-contract.test.mjs`, `tests/cases-build.test.mjs` si présents.
10. **Commit branche `claude/CC-10-dev-agentique`** → diff review obligatoire → push branche → PR MCP GitHub.

---

## 8. Risques et points d'attention

- **Justesse des sources actu (Anthropic weekly limits, Uber retex, Copilot pricing)** : vérifier les dates / chiffres / sources publiques avant rédaction. Si un chiffre ne se confirme pas, paraphraser sans le valider faussement (rappel `feedback_svg_xml_validation` esprit : pas de chiffre inventé).
- **eNPS dev** : pas une métrique standard DORA — vérifier qu'elle existe dans `shared/roi-metrics.json` ou la créer (renvoi à `roi-metrics.json` requise pour passage CI).
- **Densité footnotes** : viser ~12-18 substantielles (calibration CC-14 = 18), pas plus pour ne pas alourdir.
- **Risque catalogue plat sur les 4 patterns** : structurer la section 3 (anatomie) avec un fil narratif (« pourquoi 4 patterns et pas 1 ») plutôt qu'en suite d'encadrés.
- **Voix CTO** : la garder tout au long (pas glisser vers la voix VP Eng en milieu de cas).
- **Pas de nom de client interne** : aucune référence à Lincoln, à des projets Lincoln, ou à des clients réels.

---

## 9. Définition de fin (DoD éditoriale)

- [ ] JSON CC-10 valide 19 sections, parse OK
- [ ] MD CC-10 ~6 500-7 500 mots, ton CTO cohérent, 12-18 footnotes
- [ ] 4 SVG produits, XML validé parser strict, échappement `&` / `<` / `>` OK
- [ ] HTML rendu self-contained, widgets attendus présents
- [ ] Tests CI passants (contract + roi-metrics + build)
- [ ] Carte hub `livre/cas-pratiques/index.html` basculée à `class="livre"`
- [ ] Compteur hub livre racine incrémenté
- [ ] `statut: "livre"` dans `cases-index.json`
- [ ] SEO injecté via `tools/seo_dossiers.py --only cas-pratiques`
- [ ] Mobile checklist 7 points passée (mémoire `feedback`)
- [ ] PR ouverte via MCP GitHub (owner `mathieugug` / repo `mathieugug.github.io`)

---

*Spec design — brainstorming · 2026-06-04 · Mathieu Guglielmino · co-écrit avec l'aide d'une IA.*
