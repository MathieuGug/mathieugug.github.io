# Proposition de re-priorisation des cas pratiques

> **Statut : v2 — recentrage agentique appliqué au canonique.** Cette passe a appliqué à `../use-cases-data/cases-index.json` et `index.html` les changements **explicitement instruits** par Mathieu : (1) sortie de la fraude (ML traditionnel) en réserve + remplacement par un cas **plateforme data moderne** ; (2) **assistant transverse en CC-00** ouvreur ; (3) reframe de CC-10 en **dev agentique** ; (4) promotion de **CC-11 (flotte)** en chapeau de clôture ; (5) réordonnancement en **arc de maturité**. Restent **à arbitrer par Mathieu** (donc *proposés* ici, non appliqués) : la sortie de CC-05/07/08 vers la réserve et la promotion éventuelle de CC-20 santé. Brief de départ : *« recentrer sur l'agentique ; faut que ça parle à tout le monde mais avec une vraie expertise métier + un cas sur les usages transverses (routines, analyses, veille) + le socle data qu'on oublie. »*

---

## 1. L'objectif, reformulé

Le line-up ne doit plus être **un catalogue plat** où une étude de turbines pèse autant que le copilot bancaire. Il doit se lire comme **un arc de maturité agentique**, tendu entre deux pôles :

- **Pôle large / peu maîtrisé — l'assistant transverse.** L'IA entre dans l'entreprise par la porte horizontale : l'assistant que tout le monde ouvre pour rédiger, résumer, faire sa veille. Adoption immédiate, souvent via des **solutions propriétaires** (Microsoft 365 Copilot, « Agent 365 », ChatGPT Enterprise) — mais **faible valeur ajoutée unitaire**, réallocation du temps incertaine, **ROI fuyant**. C'est la question ouverte : *comment être plus transformant ?*
- **Pôle profond / maîtrisé — le dev agentique.** À l'autre bout, les power users (les devs) pour qui **le code est déjà la surface d'interaction principale**. On y applique la **boucle agentique au plus bas niveau** (résoudre une issue, clôturer une PR, code review, jusqu'à la sécurité — *red-team agentique*), sur de **vraies fondations** (MCP, observabilité). Maîtriser l'organisation agentique au niveau dev, c'est **valider l'architecture avant de la remonter aux métiers**.

Entre les deux pôles, **le socle data** : la plateforme qu'on oublie quand on parle d'IA, et la **condition** pour démocratiser l'analytics. Le line-up enchaîne ensuite la **remontée vers les métiers** (banque, télécom, service public), une **galerie sectorielle** pour la variété des types d'IA, et un **cas-chapeau** : gouverner la flotte une fois qu'elle a proliféré.

Le line-up doit toujours tenir **deux contraintes** :

- **Parler à tout le monde** — qu'un lecteur de n'importe quelle fonction se reconnaisse dans le cas.
- **Porter une vraie expertise métier** — un arbitrage build/buy/gouvernance/évaluation tranché, chiffré, défendable.

Et **recentrer sur l'agentique** : c'est ce qui a motivé la **sortie de CC-03 « Détection fraude temps réel »** — un cas de **ML traditionnel** (scoring supervisé, pas d'agent, pas de boucle outillée) — au profit d'un cas qui parle du **socle data sous l'IA agentique**.

---

## 2. Grille de priorisation — universalité × profondeur métier

Deux axes, notés de 1 (faible) à 5 (fort) :

- **Universalité** = « parle à tout le monde » (relatabilité, indépendance au secteur).
- **Profondeur métier** = tranchant de l'arbitrage, crédibilité de l'expertise.

| ID | Cas | Secteur | Univ. | Métier | Strate |
|---|---|---|:--:|:--:|---|
| **CC-00** | **Assistant transverse (routines/analyses/veille)** | Transverse | **5** | **4** | 🟦 Fondations — ouvreur |
| **CC-03** | **Plateforme data moderne & analytics agentique** *(NEW)* | Transverse | **5** | **5** | 🟦 Fondations — le socle |
| CC-10 | Pair programming → dev agentique | Dev logiciel | 4 | 5 | 🟦 Fondations — pôle profond |
| CC-01 | Copilot conseiller bancaire | Banque | 4 | 5 | 🟩 Remontée métiers |
| CC-02 | Agent vocal service client | Télécom | 5 | 4 | 🟩 Remontée métiers |
| CC-09 | Agent guichet unique | Service public | 4 | 4 | 🟩 Remontée métiers |
| CC-13 | Contrôle qualité visuel usine | Industrie | 2 | 4 | 🟨 Galerie (vision + edge) |
| CC-06 | Try-on virtuel | Retail | 3 | 3 | 🟨 Galerie (vision générative) |
| CC-04 | Maintenance prédictive turbines | Énergie | 2 | 4 | 🟨 Galerie (buy SaaS vertical) |
| CC-12 | Modération de contenu | Médias | 3 | 4 | 🟨 Galerie (HITL fort) |
| CC-05 | Optimisation grid temps réel | Énergie | 1 | 4 | 🟨 Galerie — *proposé réserve* |
| CC-07 | Pricing dynamique fret | Transport | 2 | 4 | 🟨 Galerie — *proposé réserve* |
| CC-08 | Drug discovery IA | Life science | 1 | 4 | 🟨 Galerie — *proposé réserve* |
| CC-11 | Gouverner une flotte d'agents | Transverse | 4 | 5 | 🟥 Chapeau — clôture |
| ~~CC-03~~ | ~~Détection fraude temps réel~~ | ~~Banque~~ | 4 | 5 | ⬛ **Réserve — ML traditionnel, hors focus** |

---

## 3. Reframing : 4 strates (l'arc), plus une liste plate

### 🟦 Strate 1 — Fondations : le socle et ses deux pôles (3 cas)

Le triptyque d'ouverture qui pose la trajectoire :

1. **CC-00 Assistant transverse** — pôle large/peu maîtrisé : l'IA de tous les jours (routines, analyses, veille).
2. **CC-03 Plateforme data moderne & analytics agentique** *(NEW)* — le socle data à sécuriser avant de démocratiser.
3. **CC-10 Pair programming → dev agentique** — pôle profond/maîtrisé : la boucle agentique au plus bas niveau, qui valide l'architecture.

### 🟩 Strate 2 — La remontée vers les métiers (3 cas)

Une fois l'architecture validée, les applications sectorielles ancrées dans un SI réel : **CC-01** copilot bancaire · **CC-02** agent vocal · **CC-09** guichet unique.

### 🟨 Strate 3 — Galerie sectorielle (variété de type d'IA)

Gardés pour la **diversité de type d'IA** que les fondations ne couvrent pas : **CC-13** (vision + edge), **CC-06** (vision générative), **CC-04** (buy SaaS vertical), **CC-12** (HITL fort). *Proposés à la sortie vers la réserve (arbitrage Mathieu) : **CC-05**, **CC-07**, **CC-08**.*

### 🟥 Strate 4 — Chapeau : gouverner la flotte (1 cas)

**CC-11 Gouverner une flotte d'agents** — la synthèse de clôture. Point de convergence de tous les cas : leurs MCP servers, harness d'éval, garde-fous deviennent des composants mutualisés d'un socle fédéré. Détail : [`PROPOSITION-cas-flotte-agents.md`](PROPOSITION-cas-flotte-agents.md).

### ⬛ Réserve (rotation)

- **CC-03-reserve Détection fraude temps réel** *(nouvellement archivé)* — ML traditionnel, hors focus agentique. **Couche auteur conservée** (JSON + MD + fig-00) pour réactivation éventuelle.
- **CC-05 / CC-07 / CC-08** — *proposés* à la sortie (très niche / doublon secteur) ; **maintenus actifs tant que Mathieu n'a pas tranché**.
- Candidat promotion : **CC-20 Diagnostic assisté (santé)** — cf. §6.

---

## 4. Pièce maîtresse n°1 : le cas transverse (CC-00)

L'ouvreur de l'annexe : c'est l'usage que le lecteur connaît déjà, et le meilleur véhicule pour la leçon centrale du ch. 21.5 (Hard vs Soft).

### Pitch

> **Avant tout cas vertical, l'IA entre par la porte horizontale** : l'assistant que tout le monde ouvre pour rédiger, résumer, analyser, faire sa veille. C'est l'usage le plus universel — et le plus dur à mesurer en ROI Hard, le plus risqué en gouvernance (shadow AI). Déployer 10 000 sièges d'assistant sans cas d'usage cadrés, c'est une facture certaine pour un ROI fantôme.

### Trois sous-usages = trois fils du livre

| Sous-usage | Ce que ça recouvre | Fil du livre |
|---|---|---|
| **Routines** | Rédaction, résumés, comptes-rendus, triage d'inbox | ch. 14 (surfaces agentiques) · ch. 24 (IA et travail) |
| **Analyses** | Synthèse de données, première passe, dataviz commentée | ch. 16 (analytics agentique) |
| **Veille** | Monitoring concurrentiel/réglementaire, *deep research* agentique | ch. 7 (boucle agent — *fan-out search → vérification → synthèse*) |

> Clin d'œil méta : la méthode de *deep research* agentique (fan-out, vérification adverse, synthèse citée) est celle qui produit les dossiers illustrés de mathieugug.github.io.

### Verdict & figure

`GO_BUY_CADRE_PAR_USAGE` — sinon NO_ROI (siège déployé ≠ valeur). **`fig-00`** = le poste de travail + la suite collaborative (SSO/IdP, mail/docs/drive, messagerie, DLP/CASB) + le **shadow AI** rendu visible comme vrai point de départ.

---

## 4 bis. Pièce maîtresse n°2 : le socle data (CC-03 — remplace la fraude)

Le cas qui répond directement au brief *« on oublie le socle data »*. Il est le **pivot de l'arc** : sans socle sécurisé, ni l'assistant transverse ni la démocratisation analytique ne tiennent.

### Pitch

> **Quand on parle d'IA, on oublie le socle.** Avant de démocratiser l'analytics agentique (text-to-SQL, deep-research sur les données, dashboards générés, data storytelling), il faut une **plateforme data moderne** : ingestion fiable, qualité **automatisée**, mises à jour **automatisées**, couche sémantique gouvernée. La démocratisation des expertises data n'est un actif qu'**à condition de sécuriser le socle** (accès, RBAC, lignage, DLP) — sinon c'est industrialiser l'erreur à l'échelle.

### Trois sous-usages = trois promesses

| Sous-usage | Ce que ça recouvre | Fil du livre |
|---|---|---|
| **Automatiser** | Qualité (détection d'anomalies, tests dbt), mise à jour des pipelines, première passe d'analyse — agents data quality / data ops | ch. 16 (analytics agentique) · ch. 18 (observabilité) |
| **Analyser** | Text-to-SQL, exploration conversationnelle, dashboards interactifs générés, **visualisations avancées + data storytelling** | ch. 16 · ch. 14 (surfaces) |
| **Démocratiser** | Donner l'accès aux métiers — **conditionné** à la gouvernance d'accès et au lignage | ch. 12 (MCP plateforme) · ch. 23 (gouvernance) |

### Métadonnées proposées (schéma canonique)

| Champ | Valeur |
|---|---|
| `secteur` | Transverse · `horizontal: true` |
| `facette_principale` | **build_vs_buy** (modern data stack : Snowflake/Databricks/dbt/Power BI vs build) |
| `facettes_secondaires` | **gouvernance** (sécurité + accès = *la condition*) · **trajectoire_couts** |
| `regime` | **hybride** — stack data managée + couche agentique maison |
| `ia_type` | **agentic** |
| `axe_roi_principal` | **bienetre** (démocratisation, temps analyste gagné) ; secondaires `qualite`, `cout` |
| `gabarit` | charnière |
| `verdict_prevu` | **GO_SOCLE_DATA_AVANT_DEMOCRATISATION** |
| `thèse` | *On parle d'IA en oubliant le socle data : sans qualité automatisée ni gouvernance d'accès, démocratiser l'analytics agentique, c'est industrialiser l'erreur.* |

### Pourquoi c'est le meilleur véhicule pédagogique

Comme l'assistant transverse, **le ROI est diffus** : le socle ne « rend » pas directement, il **multiplie la valeur de tous les cas en aval** (chaque copilot métier consomme ce socle). C'est le piège de mesure du paradoxe agentique (ch.21.7) appliqué à une *fondation* : le poste qui décide de tout est le plus dur à attribuer. Et il introduit la condition de gouvernance (sécuriser avant de démocratiser) que CC-11 généralisera à la flotte.

### La figure `fig-00` (à dessiner)

Architecture du socle data moderne : **ingestion → data warehouse/lakehouse → transformation (dbt) → couche sémantique → BI/dashboards**, avec la **couche agentique** (data quality agent, text-to-SQL, deep-research données, data storytelling) greffée par-dessus, et le **périmètre de sécurité/accès** (RBAC, lignage, DLP) dessiné comme le **gardien** — sans lui, le « démocratiser » reste un slogan.

---

## 5. Option : faire remonter 1 cas universel de la réserve

Si on veut **desserrer la sur-représentation bancaire** (CC-01 reste le seul cas banque actif après la sortie de la fraude), deux candidats de la réserve sont universels-et-profonds :

- **CC-20 Diagnostic assisté (santé)** — Univ 5 (tout le monde est un patient), Métier 5, apporte le **haut risque AI Act santé** (Annexe III) + le HITL médical. Fort candidat.
- **CC-14 Scoring crédit (banque)** — Univ 4, Métier 5, le **cas haut-risque AI Act canonique** — mais re-banque, à éviter si on veut diversifier.

**Recommandation** : si on monte un cas, **CC-20 santé** plutôt que CC-14.

---

## 6. Line-up cible (l'ordre est le parcours)

**🟦 Fondations (3)** — 1. CC-00 Assistant transverse · 2. CC-03 Plateforme data moderne · 3. CC-10 Dev agentique
**🟩 Remontée métiers (3)** — 4. CC-01 Copilot banque · 5. CC-02 Agent vocal · 6. CC-09 Guichet unique
**🟨 Galerie (4 + 3 en sursis)** — CC-13 · CC-06 · CC-04 · CC-12 · *(CC-05, CC-07, CC-08 — proposés réserve)*
**🟥 Chapeau (1)** — CC-11 Gouverner une flotte d'agents
**⬛ Réserve** — CC-03-reserve (fraude) · CC-05/07/08 (si arbitrés) · candidat promo CC-20

---

## 7. État d'application

**Déjà appliqué au canonique cette passe** :

1. `cases-index.json` — fraude → `reserve` (`CC-03-reserve`) ; nouveau CC-03 data platform ; ajout CC-00 + CC-11 ; reframe CC-10 (ia_type `agentic`) ; champ `strate` ajouté à chaque cas ; réordonnancement `ordre` en arc ; `meta.description` + bloc `strates` mis à jour.
2. `index.html` — hub regroupé en 4 strates (en-têtes de section) ; carte fraude retirée ; cartes draft CC-00, CC-03 data, CC-11 ajoutées ; CC-10 relabelé ; hero + intro réécrits sur l'arc.
3. `CLAUDE.md` — tableau d'état mis à jour.
4. Fichiers fraude archivés (conservés, pas supprimés).

**Reste à faire (sur feu vert)** :

1. **Authoring du contenu** des 2 nouveaux cas (CC-00, CC-03) : JSON 19 sections + MD + figures (dont `fig-00`).
2. **Authoring de CC-11** (flotte) : JSON + MD + `fig-01`/`fig-02` (la spec et `fig-00` existent déjà).
3. **Arbitrage Mathieu** : sortie effective de CC-05/07/08 vers la réserve ? Promotion de CC-20 santé ?

> Tant que (3) n'est pas tranché, CC-05/07/08 restent **actifs** dans la galerie.

---

*Document de travail · juin 2026 · co-écrit avec l'aide d'une IA.*
