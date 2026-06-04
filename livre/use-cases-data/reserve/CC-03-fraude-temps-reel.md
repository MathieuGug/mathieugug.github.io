---
id: CC-03
titre: Détection fraude temps réel
secteur: Banque
facette_scaling: evaluation
regime_recommande: build
gabarit: standard
date_v1: 2026-06-03
auteur: Mathieu Guglielmino
---

# CC-03 — Détection fraude temps réel

**Banque · Traditional ML · standard (~4 600 mots)**

> Hard savings nets et auditables — mais la boucle d'évaluation continue est le poste sous-estimé qui décide de la dérive 18 mois plus tard.

---

## 1. 3 h 12 du matin, un BIN compromis

Cellule fraude moyens de paiement de [VILLE], 3 h 12. Un pic de transactions carte sur un BIN compromis. Le modèle temps réel score chaque autorisation en moins de 50 millisecondes dans le switch : passer, challenger en 3-D Secure, bloquer. L'équipe a remplacé l'ancien moteur de règles + scoring acheté il y a deux ans. Les Hard savings sont clairs — la fraude évitée se chiffre au centime, signable, auditable. C'est le cas ROI le plus propre du livre.

Quarante millions de transactions par an, un taux de fraude brut autour de 0,08 %, un budget de latence de scoring sous 50 ms, un false-positive cible sous 0,5 % du flux légitime. Tout va bien.

Sauf que le responsable évaluation regarde une courbe que personne d'autre ne regarde : **le rappel baisse lentement depuis quatre mois**. Les fraudeurs ont muté. Et il pose la question qui décide vraiment du sort du modèle : *« combien coûte la boucle d'éval continue, et qui la paie quand le projet sera marqué terminé ? »*

C'est un cas d'**évaluation**. Pas de build/buy (le build est évident, on verra pourquoi), pas de gouvernance lourde (la fraude est, on le verra, exclue du haut risque AI Act). Le cœur du cas, c'est que les Hard savings de la fraude ne sont **jamais acquis une fois pour toutes** : l'adversaire s'adapte, et la dérive est silencieuse parce que la vérité terrain arrive en retard.

## 2. La carte de la stack — un chemin chaud et une boucle froide

![Architecture SI actuelle — détection fraude temps réel, banque émettrice 2026|1300](../images/CC-03-fig-00-architecture-actuelle.svg)

Deux circuits coexistent, et c'est toute l'histoire du cas.

**Le chemin chaud (< 50 ms)** : le switch d'autorisation (mainframe, réseaux Visa/Mastercard) interroge le **feature store temps réel** (Kafka + Feast/Tecton), qui alimente le **service de scoring** (gradient boosting + features de graphe). Le modèle renvoie un score, le switch applique la règle métier : passer / challenger / bloquer. Tout cela en moins de 50 ms — un timeout, et c'est l'autorisation qui se dégrade à grande échelle.

**La boucle froide (J+30 / J+90)** : les alertes priorisées remontent à la **console analyste**, qui qualifie ; les **chargebacks confirmés** reviennent comme labels ; le **datalake + registre de modèles (MLflow)** alimente le ré-entraînement et le backtesting. C'est ici que vit la boucle d'évaluation — le cœur du cas.

Ce que cette carte dit immédiatement :

- **Pas de foundation model dans le chemin chaud.** Le scoring sous 50 ms exige un GBM CPU, pas un appel LLM. Le cas est traditional ML — et c'est un **choix**, pas un retard.
- **Le sclérosant n'est pas le modèle.** Un GBM se ré-entraîne en heures. Le sclérosant, c'est la cohérence du feature store online/offline (training-serving skew) et surtout le **décalage de la vérité terrain** : le chargeback revient à J+30/J+90, quand les fraudeurs, eux, mutent en semaines.
- **Le vrai gardien n'est pas la fraude attrapée mais le client légitime bloqué.** Un modèle qui maximise le rappel en bloquant tout détruit le CSAT et provoque de l'attrition.

## 3. Ce que le modèle fait, vraiment

### 3.1 Scoring temps réel inline

À chaque autorisation : calcul des features (vélocité, géoloc, écart au comportement, device), score GBM, vérification du graphe d'entités liées (la carte est-elle reliée à un réseau de fraude connu ?), renvoi du score au switch, et alerte priorisée vers la console si le score est élevé. Le tout sous 50 ms.

### 3.2 Investigation augmentée (analyste)

Les alertes sont **rankées** par score × montant × risque graphe — l'analyste traite d'abord ce qui compte. Chaque alerte vient avec son **explication SHAP** (les features qui l'ont déclenchée, pas de boîte noire) et la **visualisation du graphe** des cartes / comptes / devices liés.

### 3.3 Boucle d'apprentissage

Les qualifications analystes et les chargebacks confirmés reviennent comme **labels** (vérité terrain retardée). Le pipeline ré-entraîne un **challenger** sur le training set mis à jour, l'évalue en **shadow** contre le **champion**, et le promeut **sous validation humaine** s'il gagne sur le holdout temporel. C'est cette boucle, peu spectaculaire, qui décide du ROI à 18 mois.

## 4. Quatre niveaux d'autonomie, et le quatrième est interdit

- **L1 Score advisory** (POC / shadow) — le modèle renvoie un score, la règle décide.
- **L2 Auto-challenge** (Pilote) — déclenche automatiquement un 3-D Secure sur score moyen.
- **L3 Auto-block réversible** (Prod) — bloque sur score très élevé ; le client peut contester (hotline, voie humaine).
- **L4 Auto-block total sans recours** — **Interdit.** Le **RGPD Art. 22** (décision automatisée à effet significatif) impose une voie d'intervention humaine, et un faux positif lèse un client légitime. Le blocage est toujours réversible et contestable.

## 5. Anatomie d'un scoring — Features, Score, Graphe, Décision, Action, Feedback

Une autorisation de 1 240 € à 3 h 12, pays étranger, device inconnu.

**1. Features.** Le feature store renvoie : vélocité (3 transactions en 4 min), géoloc incohérente, montant très au-dessus de l'habituel, device jamais vu (cf. [ch. 18](../../chapitres/ch18-analytics-agentique-banque.md)).

**2. Score.** Le GBM score 0,92 en moins de 20 ms. Au-dessus du seuil de blocage.

**3. Graphe.** Le GNN détecte que la carte est liée à deux autres cartes déjà marquées frauduleuses sur le même device → renforce le score.

**4. Décision.** Score 0,92 + lien graphe → règle métier : bloquer + alerte analyste P1.

**5. Action.** Blocage temporaire + SMS au client (*« confirmez-vous cette opération ? »*) — réversible, voie de contestation ouverte.

**6. Feedback.** L'analyste confirme la fraude → label ajouté au training set ; le chargeback éventuel reviendra à J+30/J+90 pour consolider la vérité terrain (cf. [ch. 19](../../chapitres/ch19-evaluation-benchmarks.md), [ch. 20](../../chapitres/ch20-observabilite-cognitive-audit-trail.md)).

Le client raccroche rassuré, ou la fraude est arrêtée. Mais l'étape qui compte sur le long terme est la sixième — celle qui nourrit la boucle.

## 6. Build, Buy, Hybride — pourquoi le build pur s'impose

Trois options, six critères. Notation `--` → `++`.

| Critère | **Build pur** *(recommandé)*<br>*GBM + GNN self-hosted* | **Buy mainstream**<br>*Moteur de fraude packagé* | **Hybride**<br>*Moteur acheté + challenger interne* |
| --- | :---: | :---: | :---: |
| Sensibilité data | `++` | `-` | `0` |
| Personnalisation | `++` | `-` | `+` |
| Volumétrie | `++` | `+` | `+` |
| Lock-in | `+` | `--` | `-` |
| Time-to-value | `0` | `++` | `+` |
| Souveraineté | `++` | `-` | `0` |
| **Verdict** | ***GO_BUILD_PUR.** Data ultra-sensible, latence < 50 ms incompatible avec une API externe, ré-entraînement en heures contre une fraude adaptative. Au volume, le coût équipe + infra bat la licence.* | *Time-to-value rapide et éprouvé, mais licence qui explose au volume, modèle boîte-noire, cycle de release en mois quand la fraude mute en semaines.* | *Transition douce, mais double coût transitoire et l'avantage d'adaptation reste plafonné par le socle acheté. Bon tremplin, pas une cible.* |

**Décision** : GO_BUILD_PUR. À 40 millions de transactions par an, la licence d'un moteur acheté dépasse le coût équipe + infra interne, **et** l'adaptation rapide contre la fraude adaptative est l'avantage que seul le build procure. Le crossover build/buy est déjà passé.

La vraie question n'est donc pas build vs buy. C'est : **combien budgète-t-on la boucle d'évaluation continue ?** Et c'est là que se joue le cas.

## 7. Le modèle est une commodité — la valeur est ailleurs

Le réflexe est de chercher le bon modèle. Mais ici :

- **Gradient Boosting (LightGBM)** dans le chemin chaud : rapide (< 20 ms CPU), robuste, explicable via SHAP, ré-entraînable en heures. C'est le cœur — et c'est une commodité.
- **Graph Neural Network** en augmentation de features : capture les réseaux de fraude que le GBM rate seul.
- **Isolation Forest** : détection de patterns nouveaux non labellisés.
- **LLM (Mistral / Claude)** : **uniquement** dans la couche d'investigation analyste (résumés de cas), **hors** chemin chaud — trop lent et trop cher pour le scoring inline, et un risque d'hallucination qu'on ne prend pas sur une décision de blocage.

L'argument tient devant la DSI : pas de foundation model dans le chemin chaud, c'est **pas de dépendance API, pas d'exposition à la LLMflation, latence maîtrisée, données qui ne sortent jamais**. La valeur n'est pas dans le modèle — elle est dans les **features**, la **qualité des labels** et la **boucle d'évaluation**. C'est le contre-pied éditorial des cas génératifs CC-01 et CC-02.

## 8. Les huit postes sur quatre phases — l'évaluation qui décide

Grille CC-03, en k€. Regardez la ligne évaluation.

| Poste | POC 3 m | Pilote 6 m | Prod 12 m | Scale 36 m |
| --- | --- | --- | --- | --- |
| Inférence *(GBM CPU)* | 2 | 8 | 25 | 50 |
| Infra | 12 | 35 | 90 | 160 |
| **Équipe** | **110** | **300** | **620** | **1 100** |
| **Data** | **25** | **60** | **130** | **220** |
| **Évaluation** | **15** | **70** | **220** | **480** |
| Gouvernance | 5 | 15 | 45 | 90 |
| Sécurité | 6 | 18 | 55 | 110 |
| Change | 0 | 20 | 60 | 110 |
| **Total** | **175** | **526** | **1 245** | **2 320** |
| Coût/transaction | 0,120 € | 0,040 € | 0,012 € | 0,006 € |

Lecture transverse :

- **L'inférence est triviale.** Un GBM CPU coûte des clopinettes par transaction (0,006 € à Scale). Le poste qu'on regarde d'habitude est, ici, négligeable.

- **L'évaluation est multipliée par ~32** (15 → 480 k€) et passe de ~10 % du POC à ~22 % du Scale. C'est le poste qui croît le plus vite en part relative. Pourquoi ? Parce que la fraude est **adversariale** : le modèle doit être ré-évalué et ré-entraîné en continu contre des fraudeurs qui s'adaptent.

- **La data est lourde** (25 → 220 k€) : features, labels, données consortium. C'est le second poste structurant.

C'est le **paradoxe agentique** ([ch. 23.7](../../chapitres/ch23-roi-paradoxe-agentique.md)) en version traditional ML : l'unité de mesure n'est pas l'inférence (négligeable) mais l'évaluation + la data. **Couper l'éval, c'est programmer la dérive à 18 mois.**

**Crossover build/buy** déjà franchi : au-delà de ~15-20 M transactions/an, la licence d'un moteur acheté dépasse le coût interne, et l'avantage d'adaptation rapide devient décisif.

## 9. Gouvernance — léger sur l'AI Act, sérieux sur le model risk

Bonne nouvelle réglementaire, et elle est éditoriale autant que juridique : **la détection de fraude n'est pas un système haut risque au sens de l'AI Act**. L'Annexe III §5(b) classe le scoring crédit en haut risque **à l'exception des systèmes utilisés pour la détection de la fraude financière**. La fraude est explicitement **exclue**.

Conséquence : le drag de conformité est plus léger qu'en CC-01 — ce qui **isole d'autant mieux le vrai coût caché**, la boucle d'évaluation. Pas d'écran de fumée FRIA/registre haut risque ici ; juste le cœur du sujet.

Ce qui reste applicable, et sérieusement :

- **RGPD Art. 22** : un blocage est une décision automatisée à effet significatif → **voie de contestation humaine obligatoire**.
- **Model risk management** (cadre prudentiel) : validation indépendante, backtesting documenté, suivi de performance.
- **LCB-FT / Tracfin** : déclaration de soupçon tracée.

**RACI** : responsable = équipe data science fraude ; approbateur = Directeur fraude / CDO ; consultés = DPO, RSSI, audit interne / model risk, conformité LCB-FT ; informés = DAF, ACPR. **Cadence** : comité éval mensuel (rappel, précision, false-positive, dérive PSI, champion/challenger), alertes continues, audit annuel.

## 10. La boucle d'évaluation — le cœur du cas

C'est la facette principale. Quatre temps, avec une difficulté qui change tout : **la vérité terrain est en retard.**

**1. Régression suite.** Backtesting sur historique fraude labellisé (millions de transactions) + **holdout temporel** (train sur le passé, test sur le futur — pas un échantillon mélangé, sinon data leakage) + cas adversariaux synthétiques (patterns simulés). Ré-évaluation hebdomadaire en période calme, quotidienne en période d'attaque.

**2. Métriques en ligne.** Rappel, précision / false-positive-rate (< 0,5 %), `fraud-avoided` (€ bloqués confirmés). La métrique structurante : le **rappel sur fenêtre glissante**.

**3. Détection de dérive — et son piège.** Le problème central : la vérité terrain (chargeback confirmé) revient à **J+30/J+90**. On ne peut pas piloter au jour le jour sur les vrais labels — ils arrivent trop tard. On surveille donc des **proxies** : le **PSI** (Population Stability Index) sur les features pour détecter un drift de population, le taux de challenge, le taux de contestation client. Alerte si le rappel 7 jours passe sous la baseline 90 jours.

**4. Boucle de correction.** Ré-entraînement du challenger (hebdomadaire à quotidien selon la pression), promotion champion/challenger sous validation humaine, **rollback en minutes** via le registre de modèles, feature flags par segment.

Cette boucle n'est pas un nice-to-have. C'est **le mécanisme qui maintient le Hard savings dans le temps**. Sans elle, le rappel baisse en silence, et on découvre la dérive sur la première grosse vague de fraude — six mois trop tard.

## 11. ROI — le Hard le plus propre, et son gardien

Axe principal : **Coût**. Axe secondaire : Qualité. Méthode : Hard savings directs + Cigref Hard/Soft + model risk + arbre [ch. 23.6](../../chapitres/ch23-roi-paradoxe-agentique.md).

| Métrique | Borne basse | Cible | Borne haute | Catégorie |
| --- | --- | --- | --- | --- |
| `fraud-avoided` | −30 % pertes | **−45 % pertes carte** | −60 % | Hard |
| `mttd` | −heures | **détection inline (< 50 ms)** | temps réel | Hard |
| `prediction-reliability` | rappel +5 pt | **rappel +12 pt vs règles** | +18 pt | Qualité |
| `csat` | −0,3 | **stable (FP < 0,5 %)** | +0,2 | Soft |

> **KPI gardien : `csat`** (mesuré via le false-positive-rate et les contestations). Le vrai gardien n'est pas la fraude attrapée mais le **client légitime bloqué**. Un modèle qui maximise le rappel en bloquant tout détruit le CSAT et provoque de l'attrition. Le false-positive < 0,5 % borne l'optimisation du rappel — sans ce garde-fou, on « gagne » sur la fraude en perdant des clients.

**Non retenues** : `sla-penalties-avoided` (hors périmètre), `nps` (suivi en CSAT/contestations), `cost-per-contact` (c'est le périmètre de CC-02).

## 15. L'équipe, la vélocité, la course permanente

**7,8 ETP** au POC, avec un poste qu'il ne faut surtout pas couper :

| Rôle | ETP | Profil cible |
| --- | --- | --- |
| Lead Data Scientist fraude | 1,0 | GBM, GNN, eval, a déjà combattu de la fraude adaptative |
| ML Engineer | 1,5 | Serving < 50 ms, MLOps, registre de modèles |
| **Data Engineer (feature store)** | 1,5 | **pivot** — Kafka, feature store online/offline, cohérence training-serving |
| **Expert métier fraude** | 1,0 | **pivot** — ex-analyste, connaît les typologies et les pièges des labels |
| **Responsable évaluation / drift** | 1,0 | **LE POSTE SOUS-BUDGÉTÉ** — backtesting, holdout temporel, drift, champion/challenger |
| MLOps / SRE | 0,8 | Latence, disponibilité chemin chaud, pipeline de ré-entraînement |
| DPO référent | 0,3 | RGPD Art. 22, voie de contestation |
| RSSI référent | 0,2 | Adversarial ML, vol de modèle |

En Prod, descente à 6 ETP core — **dont 1 responsable évaluation à NE PAS couper.** C'est le poste dont la suppression déclenche la dérive 18 mois.

**Vélocité** : POC 8 semaines (backtest + shadow) → Pilote 6 mois (10 % du flux, auto-challenge) → Prod 12 mois (100 % du flux, auto-block réversible) → Scale 36 mois (multi-rail, adjacence AML, ré-entraînement adaptatif).

**Quatre sclérosants** : cohérence feature store online/offline (training-serving skew) ; latence de la vérité terrain (J+30/J+90, on pilote sur proxies) ; accès aux données consortium (blocage contractuel) ; cycle de validation model risk (semaines).

**La deadline n'est pas un jalon projet — c'est une course permanente.** Chaque semaine sans ré-évaluation est une semaine de dérive potentielle.

## 16. Le débat — peut-on couper l'éval une fois le modèle en prod ?

**Pour considérer le modèle « fini »** : Hard savings nets et auditables (le ROI le plus propre du livre), build pur justifié (latence, souveraineté, adaptation), réglementairement léger (fraude exclue du haut risque AI Act).

**Contre** : la fraude est adversariale — couper l'éval = dérive silencieuse, le rappel baisse sans que personne ne le voie, la perte revient dans le P&L 12-18 mois plus tard. La vérité terrain retardée (J+30/J+90) rend la dérive invisible sans suivi de proxies. Et le poste évaluation, le moins glamour, est le premier qu'on coupe quand le projet est marqué « terminé ».

**Verdict pondéré** : GO_BUILD_PUR — mais l'évaluation continue n'est **pas optionnelle**. KPI primaire = `fraud-avoided`, KPI gardien = false-positive-rate. Le poste responsable évaluation est **sanctuarisé** en prod : sa suppression est l'erreur qui déclenche la dérive à 18 mois.

## 13. Deux choix qu'il faut faire

### 13.1 Vous héritez d'un moteur de fraude acheté, coûteux et lent à adapter. Vous faites quoi ?

**A. Garder le moteur acheté.** Vous évitez le projet, mais la licence explose au volume et l'adaptation prend des mois pendant que les fraudeurs mutent en semaines. Le rappel décroche structurellement. *Confort court terme ; au volume, le crossover est déjà franchi ([ch. 23.6](../../chapitres/ch23-roi-paradoxe-agentique.md)).*

**B. GO_BUILD_PUR.** Équipe ML à monter, mais latence maîtrisée, data souveraine, ré-entraînement en heures contre la fraude adaptative. *La bonne réponse à ce volume : l'avantage décisif est la vitesse d'adaptation, que seul le build procure.*

**C. Hybride moteur + challenger.** Transition douce si l'équipe n'existe pas encore, mais double coût et avantage d'adaptation plafonné. *Bon tremplin, pas une cible.*

### 13.2 À 18 mois, le rappel est stable et le DAF veut couper le budget d'évaluation (« le modèle est fini »). Vous faites quoi ?

**A. Couper l'éval.** Six mois plus tard, le rappel a baissé de 8 points sans que personne ne le voie (vérité terrain retardée). La fraude revient dans le P&L, découverte sur une grosse vague, et il faut tout reprendre dans l'urgence. *Le piège central du cas ([ch. 23.5.3](../../chapitres/ch23-roi-paradoxe-agentique.md)) : un Hard savings n'est pas acquis pour toujours quand l'adversaire s'adapte.*

**B. Maintenir l'éval + montrer la courbe de drift.** Vous gardez le responsable évaluation et présentez au DAF la dérive simulée si on coupe : le Hard savings se reperd. Le budget éval est sanctuarisé comme **coût récurrent**, pas comme projet. *La bonne réponse ([ch. 19](../../chapitres/ch19-evaluation-benchmarks.md)) : l'évaluation est un budget continu. La fraude est une course, pas une livraison.*

## 17. Quiz

**Q1.** Pourquoi build pur ici, alors que CC-04 (maintenance turbines) recommande d'acheter ?
- Parce que la banque a plus de budget
- **Parce que data ultra-sensible + latence < 50 ms + adaptation rapide contre une fraude adaptative + volume au-delà du crossover imposent le build** ✓
- Parce que les moteurs de fraude achetés n'existent pas
- Parce que le build est toujours préférable

*L'arbitrage build/buy dépend du contexte : ici la latence, la sensibilité data et la vitesse d'adaptation font basculer vers le build. En maintenance prédictive, le SaaS vertical gagne sur le time-to-value.*

**Q2.** Pourquoi la détection de fraude n'est-elle PAS un système haut risque au sens de l'AI Act ?
- Parce qu'elle ne traite pas de données personnelles
- **Parce que l'Annexe III §5(b) exclut explicitement la détection de fraude financière du scoring crédit haut risque** ✓
- Parce qu'elle est entièrement automatisée
- Parce qu'elle ne concerne pas les particuliers

*Conséquence éditoriale : le drag de conformité est plus léger qu'en CC-01, ce qui isole d'autant mieux le vrai coût caché — la boucle d'évaluation. (RGPD Art. 22 et model risk restent applicables.)*

**Q3.** Quel poste décide du ROI réel à 18 mois ?
- L'inférence (le scoring GBM)
- L'infrastructure GPU
- **L'évaluation continue — elle détecte la dérive d'un adversaire qui s'adapte, et c'est le premier poste qu'on coupe à tort** ✓
- Les licences

*L'inférence est triviale. Le poste qui décide est l'évaluation (×32 entre POC et Scale) : la fraude est adversariale, le rappel dérive si on ne ré-évalue pas, et la vérité terrain retardée rend la dérive invisible jusqu'au choc P&L.*

## 18. Verdict — go build pur, évaluation sanctuarisée

**GO_BUILD_PUR** — sous condition que la boucle d'évaluation soit budgétée en continu.

Cinq conditions :

1. **KPI primaire `fraud-avoided` + KPI gardien false-positive-rate** (CSAT / contestations).
2. **Poste responsable évaluation SANCTUARISÉ** en prod — sa suppression = dérive à 18 mois.
3. **Détection de dérive sur proxies** (PSI, taux de challenge, contestations) en attendant la vérité terrain retardée.
4. **Champion / challenger permanent** + rollback modèle en minutes via registre.
5. **Voie de contestation humaine** sur tout blocage (RGPD Art. 22) + documentation model risk.

Le cas est le plus propre du livre sur le papier — Hard savings auditables, peu de drag réglementaire. Et c'est précisément ce qui le rend piégeux : parce que tout semble acquis, on coupe l'éval, et on programme la dérive. La leçon du cas tient en une ligne : **contre un adversaire qui s'adapte, le ROI n'est jamais fini.**

---

## Renvois livre

- **[Ch. 18 — Analytics agentique banque](../../chapitres/ch18-analytics-agentique-banque.md)**
- **[Ch. 19 — Évaluation agent](../../chapitres/ch19-evaluation-benchmarks.md)**
- **[Ch. 20 — Audit trail cognitif](../../chapitres/ch20-observabilite-cognitive-audit-trail.md)**
- **[Ch. 21 — Garde-fous](../../chapitres/ch21-gardefous-securite-globale.md)**
- **[Ch. 23.5 — Hard vs Soft Savings](../../chapitres/ch23-roi-paradoxe-agentique.md)**
- **[Ch. 23.5.3 — Validation Hard dans le temps](../../chapitres/ch23-roi-paradoxe-agentique.md)**
- **[Ch. 23.6 — Arbre de décision méthode ROI](../../chapitres/ch23-roi-paradoxe-agentique.md)**
- **[Ch. 23.7 — Paradoxe agentique](../../chapitres/ch23-roi-paradoxe-agentique.md)**
- **[Ch. 23.8 — Études empiriques](../../chapitres/ch23-roi-paradoxe-agentique.md)**
- **[Ch. 25 — Gouvernance AI Act (exclusion fraude Annexe III §5b)](../../chapitres/ch25-gouvernance-ai-act.md)**

---

*Format co-écrit avec l'aide d'une IA. Données et calibrage : analyse Mathieu Guglielmino · juin 2026.*
