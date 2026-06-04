# Cas pratique (spec à valider) — Power users & saaspocalypse : apps maison sans coder

> **ID : CC-14 — pendant de CC-11 dans la nouvelle strate 2 « Gouverner la prolifération »** (`ordre = 5`). **Cadrage** : CC-11 traite la prolifération **officielle** (flotte d'agents Copilot + verticaux + shadow). CC-14 traite la prolifération **artisanale** : les power users métiers (RH, marketing, ops, finance, IT) qui construisent leurs propres applications avec Claude Code et l'écosystème d'assistants de code, sans passer par les éditeurs SaaS habituels. Mêmes réflexes (socle fédéré, gouvernance de portefeuille), mêmes risques (sprawl, doublons, zombies, sécurité, conformité) — mais à la **strate du livrable**, pas à celle de l'agent. Statut : **spec** ; JSON 19 sections + MD + `fig-00`/`fig-01`/`fig-02` à écrire sur ton feu vert.

**Transverse · Agentic · charnière · facette principale `gouvernance` (secondaires `build_vs_buy` du socle, `evaluation` à l'échelle).**

> **Thèse** : quand les power users construisent leurs propres applications avec Claude Code, le SaaS recule (on remplace un abonnement par un dossier git + un dépôt statique). Mais sans **socle partagé** (design system, hébergement, observabilité, identité, sécurité) ni **gouvernance des power users** (qui a le droit de quoi, où, sur quelles données, à quel niveau de risque), on troque une prolifération SaaS pour une **prolifération artisanale** équivalente — applications orphelines, copies de données métier non revues, design hétérogène, dette de maintenance privée.

Ce cas est le **miroir civil** de CC-11. Là où CC-11 organise la flotte d'agents officiels et shadow, CC-14 organise l'aval — les livrables que les power users produisent en utilisant ces agents (apps de suivi, scrolly, mini-outils internes, documents interactifs, micro-services métier). C'est le moment où la frontière entre « utiliser un outil » et « builder un outil » s'efface pour des profils qui n'ont jamais codé. Le verdict ne dit pas *« freinez les power users »* — il dit *« le seul gisement de ROI durable est de leur fournir un socle qui rend la voie conforme la plus simple à emprunter »*.

---

## 1. Mise en situation — « tu peux pas faire un PowerPoint, fais-moi un HTML interactif »

Grand groupe / ETI. En 18 mois, l'écosystème des assistants de code (Claude Code, copilote IDE, agent async cloud) a percolé hors du périmètre dev :

- **Une analyste finance** code un suivi budgétaire mensuel (tableau filtrable + graphes + export) en HTML statique, hébergé sur un partage interne. Elle n'a jamais codé. Le suivi tourne mieux que l'outil SaaS précédent — et personne ne sait que ça existe.
- **Une responsable RH** remplace 6 modèles PowerPoint par un assistant qui génère un livrable HTML interactif par recrutement (synthèse, scorecards, annotations sur le CV). Le livrable est partageable par lien, annotable, versionné.
- **Le département marketing** abandonne un outil de roadmap SaaS (40 €/utilisateur/mois × 50 sièges) au profit d'une app maison écrite en deux jours par un PM avec Claude Code. Hébergement : un bucket S3 sur un compte AWS interne, accès non revu.
- **Quatre analyses ad hoc** circulent en HTML interactif au lieu de PPT : annotations *progressive disclosure*, schémas SVG interactifs, deep-link vers sections. La direction adore ; le DSI découvre l'existence après coup.
- **Deux outils « shadow »** : un suivi de licences logicielles et un tableau de bord RGPD ont été construits par des power users et sont devenus la **source de vérité** d'équipes entières — sans owner officiel, sans backup, sans revue sécu.

Le déclencheur CODIR : un livrable RH interactif contenant des données candidat **partagé par lien public** est indexé par un moteur de recherche externe ; le DAF voit **5 outils internes orphelins** au moment où leur power user historique change de poste ; le DPO découvre **3 apps power users** stockant des données personnelles hors du périmètre RGPD ; le directeur marketing reçoit en réunion trois versions différentes d'un même livrable « roadmap » au design hétérogène. Question CODIR : *« les power users gagnent en vélocité, c'est mesurable et indéniable — mais comment on évite que ça devienne le nouveau shadow IT ? »*

**Chiffres bruts** (à caler) : ~30 power users actifs · ~80 apps/livrables maison sur 12 mois · X k€ d'abonnements SaaS supprimés (gain Hard) · ~45 % d'apps zombies à 6 mois (le power user a changé de poste, l'app n'a pas d'owner) · N incidents accès/données · % d'apps sans hébergement officiel · % d'apps utilisant du design system hétérogène (ou rien).

**`fig-00`** = la carte des apps power users (la sprawl civile) — voir `images/CC-14-power-users/CC-14-fig-00-apps-maison-sprawl.svg`. Sans cette carte, le « cadrage » reste un slogan ; comme pour CC-11, c'est le test de véracité du raisonnement build/buy du socle.

---

## 2. Quel socle ? (→ `build_buy` + `outils_internes`)

Le socle CC-14 reprend la logique des 6 services de CC-11 mais à la **strate du livrable** (l'app que le power user produit) plutôt que de l'agent qui l'a aidé à le produire. Six services partagés, formant les **enablers** :

| # | Service du socle (enabler) | Rôle | Sans lui |
|---|---|---|---|
| 1 | **Design system partagé** | Composants visuels (typo, palette, layout, micro-interactions) packagés en CSS/JS prêt à inclure, plus un template HTML « page interne » | Chaque livrable a un design différent → cacophonie, marque interne illisible |
| 2 | **Hébergement standardisé** | URL interne sous domaine officiel, déploiement par push git ou drop folder, isolation par auteur, expiration optionnelle | Apps stockées sur des partages personnels, indexation publique accidentelle |
| 3 | **Identité & accès** | SSO entreprise + groupes AD pour scoper les apps, partage par lien révocable, audit des accès | Liens publics par défaut, fuites de données candidat / RH / financières |
| 4 | **Catalogue d'apps power users** | Registre : owner, finalité, données utilisées, statut RGPD, niveau de risque, date de dernière utilisation | Pas d'inventaire → on découvre l'app le jour où elle casse |
| 5 | **Observabilité légère** | Pings de santé, compteur d'usage, alerte si app non visitée depuis N jours | Pas de détection des zombies, pas de signal pour le dé-commissionnement |
| 6 | **Briques techniques mutualisées** | Bibliothèque interne réutilisable (charts, tableaux, scrolly, annotations interactives, *progressive disclosure*, export PDF, deep-link figcaption `¶`) + serveurs MCP partagés (lecture datamart, CRM, datalake) | Chaque power user rebuild les mêmes briques + chacun configure son propre accès aux données métier |

### L'arbitrage central — build/buy **du socle**

| Option | Couvre quoi | Limite |
|---|---|---|
| **Buy un outil low-code interne** (plateforme citizen-dev classique) | Génération guidée d'apps métier | N'embarque pas l'assistance par agent de code, vision pré-Claude Code, vélocité bridée par l'éditeur visuel |
| **Buy une plateforme « citizen-dev IA » mainstream** | Apps + assistance IA | Lock-in éditeur, hors du flux Claude Code que les power users utilisent déjà |
| **Build socle maison léger** (template + bucket + SSO + registre) | Tout, conforme au flux Claude Code | Effort plateforme, équipe |
| **Hybride fédéré** *(recommandé)* | **Tout** | Discipline d'architecture |

**Recommandation — hybride fédéré** : un **socle maison léger** (design system + template HTML + bucket d'hébergement SSO + registre + briques mutualisées) qui **ne contraint pas le flux de création** (le power user continue d'utiliser Claude Code comme il l'entend) mais **rend la voie conforme la plus simple à emprunter** : pousser une app dans le bucket interne est plus facile que de la mettre sur un partage personnel ; utiliser le template de design system est plus rapide que de coder son CSS ; appeler les MCP servers internes est plus simple que de copier-coller des CSV.

> Renvois : ch.14 (assistants de code — l'outil-source), ch.15 (MCP plateforme = data via MCP partagés), ch.16 (sécurité MCP = gateway), ch.20 (observabilité).

---

## 3. Qui ? Power users vs DSI ? (→ `gouvernance` + `operation_equipe`)

Le débat est exactement homothétique à CC-11, mais sur un autre périmètre. Trois modèles opératoires :

- **Centralisé (la DSI build tout)** — contrôle maximal, mais **annule complètement le gain de vélocité** des power users. Reproduit l'erreur historique du « tout passe par la DSI ». Inacceptable politiquement après que les power users ont goûté à Claude Code.
- **Laisser-faire complet** — vélocité maximale à court terme, **c'est la sprawl actuelle**. Le DPO et le RSSI vont déclencher un arrêt brutal au premier incident sérieux.
- **Fédéré (recommandé)** — un **Center of Excellence power users / enablement** possède le socle, les enablers, la formation, le registre, l'observabilité ; les **power users possèdent leurs apps** (finalité, contenu, données, owner nommé, niveau de risque déclaré) **dans le cadre des enablers**. Principe de la « paved road » appliqué aux non-codeurs.

**RACI cible** :

| Acteur | Responsabilité |
|---|---|
| **Plateforme / CoE enablement (DSI + UX + sécu)** | Le socle, les enablers, le design system, l'hébergement, l'identité, le registre, la formation Claude Code |
| **Power user (app product owner)** | La finalité, le contenu, la donnée, la cible, le ROI de **son** app ; revue 6-mois ou retrait |
| **Sécu / DPO** | Revue proportionnée par niveau de risque (notamment données personnelles + données financières), gate de mise en partage public, audit accès |
| **Manager direct du power user** | Reconnaissance de l'activité (l'app maison n'est pas du temps « volé »), priorisation, succession (qui reprend l'app si le power user part) |
| **Comité de portefeuille power users** (semestriel) | Admission, **dé-commissionnement**, arbitrage des doublons inter-départements, escalade niveau risque |

**Rôles nouveaux** : un **Head of Power User Enablement** (côté plateforme) + des **app product owners** côté métier. **Règle d'or : toute app ayant dépassé 5 utilisateurs récurrents a un owner nommé + une fiche au registre — sinon elle est éteinte (ou bascule en projet officiel).**

### Le conflit générationnel — PPT vs HTML interactif

C'est un point politique majeur, pas seulement technique. Les power users qui ont basculé en HTML interactif :

- **Gagnent en vélocité** (un livrable HTML versionné, partageable par lien, deep-linkable, est plus rapide à itérer qu'une chaîne d'allers-retours PPT par email).
- **Perdent leur public le moins technophile** (un CODIR senior peut refuser un lien et exiger un PDF ou un PPT « pour pouvoir prendre des notes »).
- **Créent un sentiment de classe** : ceux qui codent leurs livrables vs ceux qui restent au PPT. Risque RH non négligeable.

Le **socle de design system** + un **export PDF/PPT automatique depuis le HTML** est la médiation : on garde la vélocité HTML pour le travail, et on fournit une dérivée traditionnelle pour les destinataires qui en ont besoin. La gouvernance interdit *l'obligation* du HTML pour la consommation (le partage PPT/PDF reste un droit), mais valorise le HTML pour la production.

> Renvois : ch.26 (IA & travail — recomposition des métiers, conflit générationnel), ch.13 (surfaces agentiques — l'app maison comme nouvelle surface).

---

## 4. Quelle gouvernance ? (→ `gouvernance`)

- **Cycle de vie app power user** (le pendant du cycle de vie agent de CC-11) : idée → **admission au registre** quand l'app dépasse l'usage personnel (≥ 5 utilisateurs ou ≥ 1 destinataire externe au département) → revue proportionnée → hébergement officialisé → monitoring usage → revue 6 mois → **dé-commissionnement** ou bascule officielle (l'app devient un projet DSI standard).
- **Tiering par le risque** — la même clé qu'en CC-11, mais sur d'autres critères :
  - **Tier 1 (fort)** : données personnelles (RH, candidats, clients), données financières non publiques, partage externe → revue sécu + DPO obligatoire, hébergement SSO obligatoire, audit accès.
  - **Tier 2 (moyen)** : données internes non sensibles, partage interne large → revue standard, design system obligatoire, identité interne.
  - **Tier 3 (faible)** : usage personnel ou équipe restreinte, données publiques ou anonymisées → **self-service complet sur la paved road**, pas de revue.
- **RGPD par app** : le registre porte le statut RGPD de chaque app (catégorie de données, base légale, durée de conservation, partage). Le registre **est** l'outil de conformité (comme en CC-11 pour l'AI Act).
- **Apps shadow** : **amnistie + onboarding** plutôt que la chasse — mêmes leçons que CC-11. « Ramène ton app au registre, on t'aide à la rendre conforme et on t'offre le SSO + design system. » On convertit la sprawl en flotte.
- **Cas particulier des apps qui deviennent critiques** : quand une app power user devient la source de vérité d'une équipe entière, elle **doit basculer en projet officiel** (gate explicite). Le power user reste owner fonctionnel ; la DSI reprend l'opération.

> Renvois : ch.25 (gouvernance — RGPD par app, AI Act par usage), ch.21 (garde-fous — DLP, PII).

---

## 5. Quelle validation ? (→ `evaluation`)

L'enjeu d'éval est différent de CC-11 (où on évalue le comportement d'agents conversationnels). Ici on évalue **la qualité d'un livrable produit par un non-codeur avec l'aide d'un agent de code**.

- **Checks automatisés intégrés au socle** : accessibilité (a11y de base), responsive, conformité au design system, absence de secrets en clair, absence de données personnelles dans le code, taille raisonnable, pas de dépendance externe non whitelistée. Le power user pousse, les checks passent ou bloquent.
- **Revue par les pairs entre power users** : un canal interne où les power users s'entraident, partagent des patterns (annotations interactives, *progressive disclosure*, deep-link), revoient les apps prêtes à passer Tier 2. C'est moins coûteux qu'une revue DSI, plus pédagogique pour le power user, et ça crée de la communauté.
- **Test d'usage réel après 3 mois** : si l'app n'a pas atteint son public cible, on déclasse (et on dégage la slot pour autre chose). KPI : taux d'apps avec usage actif vs zombies.
- **Validation continue** : l'app power user vit dans le bucket, observée par le socle. Quand un enabler évolue (nouvelle version du design system, nouveau MCP server), le socle fournit un script de migration ou une compatibilité ascendante — la dette de maintenance ne tombe pas sur le power user.

> Renvois : ch.19 (éval — adaptée au cas), ch.20 (observabilité légère).

---

## 6. Performance ? (→ observabilité + `trajectoire_couts`)

- **Observabilité légère** : compteur d'usage par app (combien d'utilisateurs uniques par mois), coût d'hébergement (souvent négligeable pour du HTML statique), incidents sécu, accès anormaux.
- **Le KPI de portefeuille power users** : **taux d'apps actives avec usage récurrent prouvé** vs **apps zombies**. Sur 80 apps, souvent **< 50 %** réellement utilisées au-delà du sprint de création → comme en CC-11, le premier gisement de valeur n'est pas d'en construire plus, c'est d'**éteindre les zombies** et de mutualiser les patterns récurrents en briques internes du socle.
- **Le coût de la sprawl civile** : (a) abonnements SaaS dupliqués (mais ce poste baisse avec la saaspocalypse), (b) duplication d'effort (chacun rebuild son tableau filtrable), (c) maintenance privée à l'aveugle, (d) incidents sécu/RGPD, (e) coût de re-build lorsque le power user historique part.

---

## 7. ROI au niveau portefeuille — la saaspocalypse (→ `trajectoire_couts` + `roi`)

C'est ici que le récit s'inverse par rapport à CC-11. CC-11 disait : *« passé une dizaine d'agents, le socle devient rentable »*. CC-14 dit : *« passé une vingtaine d'apps power users, ce qui était SaaS recule visiblement »*.

- **Le ROI direct (Hard)** est le **gain de saaspocalypse** : abonnements SaaS supprimés (roadmap, doc collaborative, dashboard léger, mini-tracker, formulaire). Sur le périmètre d'un grand groupe, **les économies en abonnement SaaS dépassent rapidement le coût du socle d'enablers** (équivalent d'un ETP plateforme + un ETP UX/design system + l'hébergement) dès qu'on atteint quelques dizaines d'apps actives. C'est le **crossover saaspocalypse** — l'analogue power users du crossover build/buy.
- **Le ROI indirect (Soft)** est la **vélocité métier** : un livrable HTML interactif produit en 4h là où le précédent flow PPT prenait 3 jours, multiplié par le nombre de power users. Difficile à chiffrer, mais c'est le moteur politique de l'adoption.
- **Les 8 postes appliqués au portefeuille power users** : inférence (Claude Code, déjà mutualisé), infra (le bucket + SSO), équipe (le CoE enablement + UX design system), data (les MCP servers partagés), évaluation (les checks auto + revue pairs), gouvernance (registre + comité semestriel + tiering), sécurité (gateway, DLP), change (enablement, formation, médiation PPT/HTML).
- **Le paradoxe agentique appliqué aux power users** : à l'échelle individuelle, chaque power user gagne du temps (Claude Code accélère beaucoup). À l'échelle de l'organisation, **le coût de coordination** (socle, gouvernance, médiation générationnelle, accompagnement) devient le poste dominant. Sans socle, le gain individuel se dissipe en désordre collectif.
- **Axe ROI principal** : `vitesse` (cycle d'apps réduit, saaspocalypse) ; secondaires `cout` (TCO du portefeuille), `bienetre` (power users valorisés, conflit générationnel encadré). **Gardien** : taux d'usage réel + nombre d'incidents sécu/RGPD (un incident grave peut tout remettre en cause).

---

## 8. Verdict prévu — `GO_SOCLE_ENABLERS_PARTAGÉS`

Sinon la sprawl civile coûte plus qu'elle ne rapporte et déclenche un arrêt brutal au premier incident. Conditions :

1. **Socle d'enablers** — design system + hébergement SSO + briques mutualisées + MCP servers partagés. La voie conforme doit être la plus simple à emprunter.
2. **Registre obligatoire** à partir de l'usage dépassant le périmètre personnel (≥ 5 utilisateurs ou destinataire externe au département).
3. **Tiering par le risque** — 3 niveaux, pas une revue uniforme.
4. **Modèle fédéré** — CoE enablement possède le socle, power users possèdent les apps.
5. **Médiation générationnelle PPT/HTML** — export automatique depuis le HTML, pas d'obligation côté consommation.
6. **Bascule en projet officiel** quand une app devient critique (gate explicite, power user reste owner fonctionnel).
7. **Dé-commissionnement actif des zombies** (KPI taux d'usage à 3 et 6 mois).
8. **Amnistie + onboarding** des shadow apps déjà existantes.

---

## 9. Bifurcations reader-driven (charnière → 3)

1. **Stratégie d'enablement** : laisser-faire complet (= shadow IT à venir) / DSI re-centralise (= mort de la vélocité, retour PPT) / **socle fédéré paved road** (le bon).
2. **Le socle** : low-code mainstream (lock-in, hors flux Claude Code) / plateforme citizen-dev IA mainstream (re-lock-in) / build pur (effort) / **hybride socle maison léger + Claude Code libre** (le bon).
3. **Médiation PPT/HTML** : forcer le HTML (conflit politique) / freiner le HTML (perte vélocité) / **double sortie HTML interactif pour la production + export PPT/PDF automatique pour la consommation** (le bon).

---

## 10. Design patterns à packager dans le socle

Le socle ne fournit pas seulement de l'infra, il fournit aussi des **patterns d'interaction** que les power users réutilisent (briques du service #6). Six patterns récurrents :

| Pattern | Quand l'utiliser | Brique fournie par le socle |
|---|---|---|
| **Progressive disclosure** | Synthèse exécutive + détails repliés | Composant accordéon + heuristique de niveau de détail |
| **Annotations interactives** | Décision documentée pas-à-pas (livrable RH, audit) | Composant marker + tooltip + sidebar de commentaires |
| **Deep-link figcaption (¶)** | Pouvoir pointer un schéma précis dans un échange asynchrone | Convention `<a class="anchor" href="#fig-NN">¶</a>` + style |
| **Tableau filtrable + tri** | Suivi opérationnel (licences, projets, candidats) | Composant `data-table` avec sort/filter sans dépendance externe |
| **Scrolly narrative** | Présentation chronologique (roadmap, parcours utilisateur) | Mini-framework HTML/CSS sticky + steps |
| **Export PDF/PPT** | Médiation générationnelle (CODIR, conseil d'administration) | Bouton « exporter en PDF » embarqué, route serveur pour la conversion |

Ces patterns sont **stables** (ils ne changent pas à chaque génération d'agent), **transverses** (utilisables dans n'importe quel domaine métier), et **reconnaissables** (cohérence visuelle inter-apps). C'est ce qui transforme une collection d'apps power users en **système** lisible par tous.

---

## 11. Figures prévues

- **`fig-00` — Carte des apps power users (la sprawl civile)** : ~80 apps maison + ~5 SaaS résiduels + ~2 shadow critiques, avec les angles morts (pas de design system commun, pas de SSO partagé, pas de registre, pas de monitoring, doublons inter-départements) — *à dessiner*.
- `fig-01` — Le socle d'enablers (6 services) + modèle opératoire RACI (CoE enablement possède le socle, power users possèdent les apps) — *à dessiner*.
- `fig-02` — Cycle de vie d'une app power user (idée → registre quand usage dépasse personnel → tiering → hébergement SSO → revue 6 mois → dé-commissionnement OU bascule projet officiel) + les 6 design patterns packagés — *à dessiner*.

---

## Renvois livre

ch.14 (assistants de code = l'outil-source) · ch.13 (surfaces agentiques = l'app maison comme nouvelle surface) · ch.7 (boucle agentique appliquée à la création de livrables) · ch.15 (MCP plateforme = les MCP servers internes consommés par les power users) · ch.16 (sécurité MCP = gateway, scope par power user) · ch.20 (observabilité légère des apps) · ch.21 (garde-fous, DLP, PII) · ch.23.5 (Hard/Soft — saaspocalypse Hard + vélocité Soft) · ch.23.7 (paradoxe agentique appliqué aux power users) · ch.25 (RGPD par app, AI Act par usage) · ch.26 (IA & travail — conflit générationnel PPT vs HTML interactif).

---

*Spec de travail · juin 2026 · co-écrit avec l'aide d'une IA.*
