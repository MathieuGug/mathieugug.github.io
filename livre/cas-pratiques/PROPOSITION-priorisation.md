# Proposition de re-priorisation des cas pratiques

> **Statut : à valider.** Ce document ne modifie pas `../use-cases-data/cases-index.json`. Il propose une grille de priorisation et un line-up cible que Mathieu valide avant que je touche au canonique. Brief de départ : *« je ne suis pas fan de tous, faut que ça parle à tout le monde mais quand même avec une expertise métier + un cas sur les usages transverses (routines, analyses, veille). »*

---

## 1. L'objectif, reformulé

Le line-up des 12 cas doit tenir **deux contraintes à la fois** :

- **Parler à tout le monde** — qu'un lecteur de n'importe quelle fonction (DSI, DAF, métier, RH, dirigeant, citoyen) se reconnaisse dans le cas, sans être un insider du secteur.
- **Porter une vraie expertise métier** — un arbitrage build/buy/gouvernance/évaluation tranché, chiffré, défendable, pas une vignette marketing.

Et une **lacune à combler** : il manque le cas **transverse** — l'usage quotidien et inter-fonctions de l'IA (routines, analyses, veille), qui est *de loin* le premier contact réel des organisations avec l'IA, et qui est aujourd'hui absent des 12.

Le défaut du line-up actuel n'est pas la qualité des cas — c'est sa **distribution** : il sur-indexe les **verticales de niche** (turbines, grid, drug discovery, fret) et sous-indexe l'**universel** (l'assistant qu'utilise tout le monde, le service public, la sécurité de mes paiements).

---

## 2. Grille de priorisation — universalité × profondeur métier

Deux axes, notés de 1 (faible) à 5 (fort) :

- **Universalité** = « parle à tout le monde » (relatabilité, indépendance au secteur).
- **Profondeur métier** = tranchant de l'arbitrage, crédibilité de l'expertise.

| ID | Cas | Secteur | Univ. | Métier | Verdict |
|---|---|---|:--:|:--:|---|
| **(NEW)** | **Assistant transverse (routines/analyses/veille)** | Transverse | **5** | **4** | **🟢 Colonne vertébrale — à créer (pièce maîtresse)** |
| CC-01 | Copilot conseiller bancaire | Banque | 4 | 5 | 🟢 Colonne vertébrale |
| CC-02 | Agent vocal service client | Télécom | 5 | 4 | 🟢 Colonne vertébrale |
| CC-03 | Détection fraude temps réel | Banque | 4 | 5 | 🟢 Colonne vertébrale |
| CC-09 | Agent guichet unique | Service public | 4 | 4 | 🟢 Colonne vertébrale |
| CC-10 | Pair programming (Copilot dev) | Dev logiciel | 4 | 5 | 🟢 Colonne vertébrale |
| CC-12 | Modération de contenu | Médias | 3 | 4 | 🟡 Galerie (HITL fort, relatable via réseaux) |
| CC-06 | Try-on virtuel | Retail | 3 | 3 | 🟡 Galerie (apporte la vision générative) |
| CC-13 | Contrôle qualité visuel usine | Industrie | 2 | 4 | 🟡 Galerie (apporte la vision + l'edge) |
| CC-04 | Maintenance prédictive turbines | Énergie | 2 | 4 | 🟡 Galerie (apporte le « buy SaaS vertical ») |
| CC-07 | Pricing dynamique fret | Transport | 2 | 4 | 🟠 Réserve (B2B de niche, gouvernance éthique déjà portée par CC-12) |
| CC-05 | Optimisation grid temps réel | Énergie | 1 | 4 | 🟠 Réserve (très niche + doublon secteur avec CC-04) |
| CC-08 | Drug discovery IA | Life science | 1 | 4 | 🟠 Réserve (passionnant mais hermétique au grand public) |

**Lecture** : six cas franchissent le double seuil (Univ ≥ 4 **et** Métier ≥ 4) — ce sont eux qui « parlent à tout le monde ». Quatre cas apportent de la **variété de type d'IA** (vision, vision générative, edge, HITL) sans être universels. Trois cas sont trop nichés pour mériter une place dans douze.

---

## 3. Reframing : 3 strates plutôt qu'une liste plate

Aujourd'hui les 12 cas sont une grille plate où une étude de turbines pèse autant que le copilot bancaire. Je propose de les **structurer en strates**, ce qui clarifie l'intention de lecture et libère de la place pour le cas transverse :

### 🟢 Colonne vertébrale (6 cas) — « lus par tous »

Les cas que **tout lecteur** parcourt, quels que soient son secteur et sa fonction. Ils couvrent les points de contact universels avec l'IA en entreprise :

1. **Assistant transverse** *(NEW)* — l'IA que j'utilise tous les jours (routines, analyses, veille)
2. **CC-01 Copilot conseiller bancaire** — le copilot métier ancré dans un SI régulé
3. **CC-02 Agent vocal service client** — l'IA qui me répond quand j'appelle une hotline
4. **CC-03 Détection fraude temps réel** — l'IA qui protège mes paiements
5. **CC-09 Agent guichet unique** — l'IA dans mes démarches administratives
6. **CC-10 Pair programming** — l'IA qui écrit du code (et que tout DSI évalue)

Couverture : les 4 facettes (build/buy, trajectoire, gouvernance, évaluation) **et** les 4 grands régimes (buy, build, hybride, souverain) **et** les types d'IA dominants (génératif, agentic, ML classique).

### 🟡 Galerie sectorielle (4 cas) — « la variété qui muscle la démonstration »

Gardés pour la **diversité de type d'IA** que la colonne vertébrale ne couvre pas (vision, vision générative, edge on-device, human-in-the-loop fort). Traitement assumé comme « galerie » : on peut les lire en diagonale.

- **CC-13 Contrôle qualité usine** — vision + edge on-device
- **CC-06 Try-on virtuel** — vision générative
- **CC-04 Maintenance prédictive** — le seul vrai « GO_BUY SaaS vertical »
- **CC-12 Modération de contenu** — human-in-the-loop fort + gouvernance éditoriale

### 🟠 Réserve (rotation) — sortis des 12

- **CC-05 Optimisation grid** (très niche, doublon secteur énergie avec CC-04)
- **CC-07 Pricing dynamique fret** (B2B de niche ; sa leçon « charte éthique tarifaire » est déjà portée par CC-12)
- **CC-08 Drug discovery** (sujet magnifique mais hermétique — à garder pour un éventuel cas « bonus » web, pas dans la colonne du livre)

> **Note** : on peut faire **remonter de la réserve** un cas universel-et-profond si on veut équilibrer les secteurs — voir §5.

---

## 4. La pièce maîtresse : le cas transverse

C'est le cas qui répond directement au brief, et je pense qu'il doit **ouvrir** l'annexe (avant même CC-01) : c'est l'usage que le lecteur connaît déjà, et c'est le meilleur véhicule pour la leçon centrale du ch. 21.5 (Hard vs Soft).

### Pitch

> **Avant tout cas vertical, l'IA entre dans l'entreprise par la porte horizontale** : l'assistant que tout le monde ouvre pour rédiger, résumer, analyser, faire sa veille. C'est l'usage le plus universel — et le plus dur à mesurer en ROI Hard, le plus risqué en gouvernance (shadow AI). Déployer 10 000 sièges d'assistant sans cas d'usage cadrés, c'est une facture certaine pour un ROI fantôme.

### Trois sous-usages = trois fils du livre

| Sous-usage | Ce que ça recouvre | Fil du livre |
|---|---|---|
| **Routines** | Rédaction, résumés, comptes-rendus de réunion, triage d'inbox, reformulation | ch. 14 (surfaces agentiques) · ch. 24 (IA et travail) |
| **Analyses** | Synthèse de données, exploration, première passe d'analyse, dataviz commentée | ch. 16 (analytics agentique) |
| **Veille** | Monitoring concurrentiel / réglementaire / techno, *deep research* agentique | ch. 7 (boucle agent) — le pattern *fan-out search → vérification → synthèse*, qui est exactement la méthode des dossiers de ce site |

> Le sous-usage **veille** permet un clin d'œil méta : la méthode de *deep research* agentique (fan-out, vérification adverse des sources, synthèse citée) est celle qui produit les dossiers illustrés de mathieugug.github.io. Le cas peut s'auto-référencer comme démonstration vivante.

### Métadonnées proposées (schéma canonique)

| Champ | Valeur |
|---|---|
| `secteur` | Toutes fonctions (transverse) · `horizontal: true` |
| `facette_principale` | **build_vs_buy** (assistant managé vs souverain vs build léger) |
| `facettes_secondaires` | **gouvernance** (shadow AI, DLP, RGPD, Art. 50, résidence data) · **trajectoire_couts** (bombe du licensing par siège) |
| `regime` | **buy_cadré** (assistant entreprise) + couche **build_léger** pour la veille agentique + option **souverain** (Le Chat Enterprise) pour les données sensibles |
| `ia_type` | generative + agentic |
| `axe_roi_principal` | **bienetre** (gain de temps, charge mentale) — *et c'est là le piège : tout est Soft* |
| `gabarit` | charnière |
| `verdict_prevu` | **GO_BUY_CADRÉ_PAR_USAGE** — sinon NO_ROI (siège déployé ≠ valeur) |
| `thèse` | *L'usage le plus universel de l'IA est le plus dur à chiffrer en Hard et le plus risqué en gouvernance — le ROI ne vient pas du siège déployé mais des cas d'usage cadrés.* |

### Build / Buy de l'assistant transverse (l'arbitrage du cas)

- **Buy managé** (assistant intégré à la suite bureautique, ou ChatGPT / Claude Enterprise) — time-to-value imbattable, mais **licence par siège** qui explose (× milliers de sièges) et **shadow AI** si non cadré.
- **Souverain** (Le Chat Enterprise / déploiement européen) — argument résidence data + secteurs sensibles, à arbitrer sur la capacité.
- **Build léger** — uniquement pour la **veille agentique** (orchestrateur deep-research maison sur API), pas pour les routines (où le buy gagne).

### Pourquoi c'est le meilleur véhicule pédagogique

C'est le cas où **le ROI Hard est presque impossible** : `doc-search-time`, temps gagné, `employee-engagement` — tout est Soft. Il illustre donc à l'état pur la règle ch. 21.5.4 (convergence d'indicateurs Soft) et le piège du « siège déployé = ROI supposé ». Là où CC-01 montre un Hard avec gardien Soft, le cas transverse montre **un usage massivement Soft qu'il faut cadrer par cas d'usage** pour en extraire du Hard ponctuel. Les deux se répondent.

### La figure `fig-00` obligatoire

L'architecture actuelle d'un cas transverse n'est pas un SI vertical mais le **poste de travail + la suite collaborative** : identités (SSO/IdP), suite bureautique (mail, docs, drive), messagerie d'équipe, DLP/CASB, et le **shadow AI** (les outils grand public utilisés en douce) — que la carte doit rendre visible comme le vrai point de départ. C'est le test de véracité : sans cette carte, le « cadrage par usage » reste un slogan.

---

## 5. Option : faire remonter 1 cas universel de la réserve

Si on veut **desserrer la sur-représentation bancaire** de la colonne vertébrale (CC-01 + CC-03 = 2 banques) et gagner en universalité, deux candidats de la réserve sont universels-et-profonds :

- **CC-20 Diagnostic assisté (santé)** — Univ 5 (tout le monde est un patient), Métier 5, et apporte le **haut risque AI Act santé** (Annexe III) + le HITL médical. Fort candidat colonne vertébrale.
- **CC-14 Scoring crédit (banque)** — Univ 4, Métier 5, le **cas haut-risque AI Act canonique** — mais 3ᵉ cas bancaire, à éviter si on veut diversifier.

**Recommandation** : si on monte un cas de la réserve, **CC-20 santé** plutôt que CC-14 — il diversifie le secteur et muscle l'angle « haut risque ». À arbitrer selon que tu veux 12 cas pile ou un line-up plus resserré.

---

## 6. Line-up cible proposé

**Colonne vertébrale (6)** — l'ordre est aussi un parcours :

1. **Assistant transverse** *(NEW)* — l'IA de tous les jours
2. CC-02 Agent vocal service client — l'IA qui me répond
3. CC-03 Détection fraude temps réel — l'IA qui me protège
4. CC-01 Copilot conseiller bancaire — l'IA qui assiste un métier régulé
5. CC-09 Agent guichet unique — l'IA dans le service public
6. CC-10 Pair programming — l'IA qui code

**Galerie sectorielle (4)** : CC-13 · CC-06 · CC-04 · CC-12

**Réserve / rotation** : CC-05, CC-07, CC-08 (+ CC-20 santé en candidat de promotion)

---

## 7. Ce que je ferai si tu valides

1. **Créer le cas transverse** (JSON 19 sections + MD + `fig-00`) — sur le modèle CC-01/CC-02/CC-03 déjà livrés en couche auteur.
2. **Retravailler `cases-index.json`** : ajouter le champ `strate` (`colonne_vertebrale` / `galerie` / `reserve`), réordonner, sortir CC-05/CC-07/CC-08 vers `reserve`, (option) promouvoir CC-20.
3. **Mettre à jour le hub `index.html`** : grouper visuellement les cartes par strate (en-tête de section) plutôt qu'une grille plate de 12.
4. **Mettre à jour l'intro du hub** : assumer le modèle « colonne vertébrale + galerie » au lieu de « collection de 12 ».

> Rien de tout cela n'est appliqué tant que tu n'as pas tranché — en particulier le sort de CC-05/07/08 (sortie de réserve) et la promotion éventuelle de CC-20, qui touchent au canonique.

---

*Document de travail · juin 2026 · co-écrit avec l'aide d'une IA.*
