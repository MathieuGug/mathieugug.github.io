# Syllabus CoC Data — design

**Date** : 2026-05-11
**Auteur** : Mathieu Guglielmino (assisté Claude)
**Statut** : design validé, prêt pour plan d'implémentation

## Contexte

Le centre de compétences data (~400 ingénieurs, profils mixtes *users IA* et *builders d'agents*) vient de publier un baromètre interne qui éclaire la situation. Le syllabus a deux objectifs :

1. **Acculturer** régulièrement le CoC à l'IA agentique (sessions courtes, presque informelles)
2. **Converger** vers un événement officiel (1h30) qui présente les agents *en production* avec deux consultants externes (évaluation + observabilité)

Le syllabus doit s'appuyer **maximalement** sur le matériel déjà publié sur mathieugug.github.io (huit dossiers deep research + leurs schémas SVG inline interactifs), pour éviter de produire du nouveau contenu et capitaliser sur le travail existant.

### Chiffres clés du baromètre (mai 2026)

- **103 répondants** consultants Data & Analytics, 92 % Grand Compte ou CAC 40
- **Profils dominants** : Data Analyst / BI **47 %**, Data Scientist / ML 18 %, Data Engineer 15 %, Architecte / Tech Lead 6 %, Autre 15 %
- **Niveaux d'expérience** : Expert/Lead 16 %, Senior 35 %, Confirmé 47 %, Junior 3 % (cœur de cible Senior + Confirmé = 82 %)
- **Adoption IA** : 60 % usage régulier (en continu, quotidien ou hebdomadaire) ; 36 % rarement ou jamais
- **Tâche IA n°1** : génération / débogage de code **58 %**, loin devant veille techno 11 %, doc 7 %, livrables clients 7 %, **data storytelling 3 %**
- **Asymétrie code par profil** : DS/ML 84 %, Architecte 67 %, DA/BI 60 %, Data Engineer 44 %, Manager 33 %
- **IA chez les clients** : 27 % en POC, 21 % agents/analytics conv, 18 % copilots BI, 14 % pas du tout
- **Contrainte structurelle** : 59 % d'accès IA limité chez les clients, 27 % libre, 11 % bloqué
- **Perception** : « IA bouleverse le métier » 3.6/5, maturité data clients 3.8/5

### Lectures structurantes pour le syllabus

- **Le syllabus est légitimé par les chiffres** : 58 % génération de code → session 1 (coding agents) tape pile dans l'usage actuel ; 36 % d'usage faible → l'acculturation est nécessaire ; 11 % de veille → le syllabus *est* une réponse à ce manque.
- **Profil cible session 1** : Data Analyst / BI (47 %, le plus nombreux, le plus à acculturer côté code).
- **Asymétrie à exploiter en session 2** : pourquoi 84 % des DS/ML utilisent l'IA pour coder mais seulement 44 % des Data Engineers ? Mécaniques d'agents → ouvrir le champ aux profils sous-représentés.
- **Le ROI (session 3) prend du sens** vu la pression POC clients (27 %) — les ingénieurs CoC seront sollicités pour chiffrer.
- **Session 4 ou bonus** : data storytelling 3 % et livrables clients 7 % sont les deux usages les plus sous-exploités. Teaser optionnel vers le dossier `narrative-experiences/` (publié, accessible) pour ceux qui veulent creuser.

## Cible

- **Audience mixte** users + builders dans la même salle pour les 4 sessions courtes et l'événement final
- ~400 ingénieurs au total ; sessions ouvertes (présence variable, à estimer après session 1)
- Format **presque informel** : présentation + échange, pas une conférence

## Arc narratif

```
Session 1 — LE PRÉSENT       ce que dit le baromètre, ce que les outils permettent
Session 2 — LA MÉCANIQUE     ce qu'il y a sous le capot d'un agent
Session 3 — LA VALEUR        comment chiffrer l'impact d'un projet IA (teaser → final)
Session 4 — LE FUTUR         ce que ça change au travail data (et au CoC)
ÉVÉNEMENT FINAL (1h30)       les agents en production
                              ├─ intro Mathieu (capitalise les 4 sessions)
                              ├─ consultant 1 — évaluation
                              ├─ consultant 2 — observabilité
                              └─ échange tripartite + roadmap CoC
```

**Justifications** :
- Session 1 ancre dans le concret (baromètre = miroir, outils = action immédiate). Sortie : volontaires pour pilote.
- Session 2 répond à la question *« oui mais comment ça marche vraiment ? »* qui sortira en session 1. Bénéfice double : users arrêtent d'attendre des miracles, builders ont un mental model partagé.
- Session 3 fait le pont vers la valeur métier (langage des managers). **Teaser explicite** *« pour mesurer vraiment, il faut instrumenter — voir événement final »* prépare la convergence.
- Session 4 prend de la hauteur (impact macro/RH/structure CoC).
- L'événement final n'apparaît pas du chapeau : il répond à la question soulevée en session 3.

**Hors scope** : `narrative-experiences/` reste accessible via le hub principal mais n'entre pas dans le syllabus (sujet parallèle, pas dans l'arc).

## Format

| Paramètre | Valeur |
|---|---|
| Sessions courtes | 4 sessions × 45 min (30 présent + 15 échange) |
| Événement final | 1 × 1h30 (15' intro + 30' consultant 1 + 30' consultant 2 + 15' échange) |
| Schémas par session courte | 4 max + 1 bonus optionnel |
| Réutilisation | 100 % des schémas viennent de dossiers existants (sauf ceux du baromètre, fournis par Mathieu) |

## Contenu détaillé

### Session 1 — Le présent · 45 min
**Hook** : *« 60 % d'entre vous utilisent l'IA chaque semaine, 58 % pour coder. Voilà comment on en tire vraiment parti — et pourquoi c'est un début, pas la fin. »*

| Slot | Contenu | Schémas |
|---|---|---|
| 0-12' | Restitution baromètre — 4 visuels (chiffres clés, profil répondants, adoption & impact, tâches par profil) **reformatés au style site** (papier ivoire, accent orange, polices Fraunces/Inter/JetBrains Mono) ; mention « Lincoln » retirée des CTAs (cf. règle CLAUDE.md : Lincoln en footer uniquement) | 4 SVG inédits à créer dans `syllabus/images/baromètre/` à partir des PNG fournis par Mathieu : `baro-01-chiffres-cles.svg`, `baro-02-profil-repondants.svg`, `baro-03-adoption-impact.svg`, `baro-04-taches-par-profil.svg` |
| 12-30' | Coding agents 2026 — Claude Code / Codex / Copilot. Cadrer en partant du chiffre **58 % génération de code** : ce que les outils permettent vraiment au-delà de la complétion | `coding-agents/images/20260512-01-trois-regimes.svg` · `04-comparatif.svg` · `08-carte-decision.svg` |
| 30-45' | Échange + appel à pilotes (5-10 volontaires, cible prioritaire Data Analyst / BI vu les 47 % de l'audience) | — |

**Sortie attendue** : engagement à venir aux sessions suivantes + liste de volontaires pour expérimenter (au moins 5 DA/BI + 2 DE).

**Note importante sur le reformat des visuels baromètre** : les PNG fournis par Mathieu sont au style corporate Lincoln (bleu, ton institutionnel). Les recréer en SVG au style site (palette ivoire/orange, polices serif/mono) garantit la cohérence visuelle du syllabus *et* respecte la règle CLAUDE.md « Lincoln = footer uniquement ». Les chiffres restent identiques ; seule la mise en forme change. Les 4 SVG suivent les conventions typo des schémas du site (cf. CLAUDE.md « Convention typo des schémas »).

### Session 2 — La mécanique · 45 min
**Hook** : *« Pour bien utiliser un agent (et bien le construire), il faut savoir comment il pense. »*

| Slot | Contenu | Schémas |
|---|---|---|
| 0-10' | Pourquoi ce volet — *users* : éviter d'attendre des miracles ; *builders* : design partagé | — |
| 10-30' | Anatomie + boucle + outils + mémoire | `harness-agentique/images/20260429-01-anatomie-harness.svg` · `harness-agentique/images/20260429-02-boucle-gan.svg` · `mcp-plateforme/images/20260508-01-anatomie-protocole.svg` · `memoire-agentique/images/20260430-05-context-engineering.svg` |
| 30-45' | Q&A — différences attendues users vs builders | *bonus si temps* : `agents-computer-use/images/20260502-01-taxonomie-cua.svg` |

### Session 3 — La valeur · 45 min
**Hook** : *« 95 % des pilotes GenAI sans P&L mesurable. Pourquoi, et comment on s'y prend. »*

| Slot | Contenu | Schémas |
|---|---|---|
| 0-10' | Le paradoxe agentique | `measure-roi/images/20260507-01-paradoxe-roi.svg` |
| 10-30' | Hard vs Soft, grille 5 axes, études empiriques | `measure-roi/images/20260507-05-hard-vs-soft.svg` · `03-grille-5-axes.svg` · `09-productivity-findings.svg` |
| 30-45' | Échange sur projets en cours **+ teaser explicite** : *« mesurer = instrumenter → c'est l'événement final »* | `evaluation-agentique/images/20260501-09-couts-goulots.svg` *(teaser visuel rapide)* |

### Session 4 — Le futur · 45 min
**Hook** : *« De 47 % d'emplois exposés (Frey-Osborne) à 0,55 % de productivité (Acemoglu) — quel scénario pour notre CoC ? »*

| Slot | Contenu | Schémas |
|---|---|---|
| 0-10' | L'écart entre les estimations | `ia-et-travail/images/20260504-01-frise-estimations.svg` |
| 10-25' | Augmentation vs automatisation, scénarios, leviers | `04-augmentation-automatisation.svg` · `07-quatre-scenarios.svg` · `08-six-leviers.svg` |
| 25-32' | **Bonus baromètre — l'angle mort** : le baromètre montre 3 % de data storytelling et 7 % de livrables clients. Pointer vers le dossier `narrative-experiences/` comme ouverture pour ceux qui veulent creuser | `narrative-experiences/` (lien vers le hub, pas de schéma intégré pour rester sur 4 schémas max) |
| 32-45' | Échange — quel scénario pour le CoC, quelles compétences à développer (au-delà du code), comment le CoC se positionne | — |

### Événement final · 1h30 — Les agents en production

| Slot | Contenu | Schémas |
|---|---|---|
| 0-15' | Intro Mathieu — capitalisation des 4 sessions | reprises rapides : `coding-agents/01-trois-regimes` · `harness-agentique/01-anatomie-harness` · `measure-roi/01-paradoxe-roi` |
| 15-45' | **Consultant 1 — Évaluation** | `evaluation-agentique/images/20260501-04-pyramide-metriques.svg` · `05-llm-as-judge.svg` · `10-playbook-gruyere.svg` (placeholder, à confirmer avec consultant) |
| 45-75' | **Consultant 2 — Observabilité** | `observabilite-agents-ia/images/20260430-02-six-piliers-telemetrie.svg` · `04-anatomie-trace-otel-genai.svg` · `08-echelle-maturite-observabilite.svg` (placeholder, à confirmer avec consultant) |
| 75-90' | Échange tripartite + roadmap CoC | — |

**Total** : ~25 schémas existants réutilisés + 4 schémas baromètre à créer (reformat des PNG fournis au style site). Aucune autre création requise.

## Architecture technique

```
syllabus/
├── syllabus.md                            ← document maître Obsidian-friendly
├── index.html                             ← hub HTML, projetable en intro session 1
├── 01-le-present-slideshow.html           ← session 1 (autonome, exécutable seul)
├── 02-la-mecanique-slideshow.html         ← session 2
├── 03-la-valeur-slideshow.html            ← session 3
├── 04-le-futur-slideshow.html             ← session 4
├── 05-evenement-final-slideshow.html      ← intro Mathieu + placeholders consultants
└── images/
    └── baromètre/                         ← seuls SVG locaux (créations inédites)
        ├── baro-01-chiffres-cles.svg
        ├── baro-02-profil-repondants.svg
        ├── baro-03-adoption-impact.svg
        └── baro-04-taches-par-profil.svg
```

**Décisions** :

- **Pas de copie des SVG des dossiers existants** : les slideshows pointent directement vers `../coding-agents/images/...`, etc. Plus léger, mais **risque de dérive** : si un schéma source est modifié plus tard, le slideshow syllabus reflète automatiquement la nouvelle version. Accepté en l'état ; si une session est jouée puis le schéma modifié, on pourra rétroactivement copier la version « gelée » dans `syllabus/images/` pour cette session.
- **Seul `syllabus/images/baromètre/` contient des SVG locaux** : ce sont des créations inédites (reformat des PNG du deck baromètre fournis par Mathieu) qui n'ont pas vocation à exister ailleurs dans le repo. 4 SVG, créés au style éditorial du site (palette ivoire/orange, polices Fraunces/Inter/JetBrains Mono, mention « Lincoln » retirée), interactifs (régions cliquables → modaux explicatifs).
- **Hub `syllabus/index.html` non listé dans la grille de l'accueil** : artefact interne CoC, pas un dossier public au même titre que `coding-agents/`, etc. Accessible via URL directe `https://mathieugug.github.io/syllabus/`. Si Mathieu décide plus tard d'en faire un artefact public, il suffira d'ajouter une tuile dans `index.html` racine.
- **Slideshow événement final inclus** : trame complète pour les 15' d'intro Mathieu + sections placeholder pour les 2 consultants (titres, schémas pressentis, mais contenu modaux vide). Mathieu et les consultants compléteront ensemble en pré-prod du final.
- **Toutes les pages internes embarquent les conventions du site** : favicon `/favicon.svg`, polices Google (Fraunces / Inter / JetBrains Mono), palette `--bg #faf6ec` / `--accent #b8582e`, topbar 3 zones (cf. CLAUDE.md), bibliothèque partagée `/assets/dossier-app.{js,css}` pour les patterns interactifs (zoom, modaux, panel-close mobile).
- **Slideshows = pattern `illustrated-deep-research/assets/slideshow-template.html`** : focus sur un schéma à la fois, modaux explicatifs au clic sur les régions interactives, navigation flèches clavier, exécutable en projection (mode plein écran) **et** explorable individuellement après. Embarque le `<mark>` style stabilo pour les phrases-clés (cf. CLAUDE.md).

## Document `syllabus.md` — structure

```markdown
# Syllabus CoC Data — Acculturation IA agentique
> Cycle de 4 sessions × 45 min + événement final 1h30
> Cible : ~400 ingénieurs (users + builders)
> Origine : baromètre interne 100 répondants, mai 2026

## Arc narratif
présent → mécanique → valeur → futur → mise en production

## Session 1 — Le présent · 45 min
**Hook** : ...
**Plan minuté**
- 0-10'  Restitution baromètre
- 10-30' Coding agents 2026
- 30-45' Échange + appel à pilotes

**Schémas embarqués** *(syntaxe Obsidian, preview inline dans Obsidian, ignorée par GitHub Pages)*
- ![[../coding-agents/images/20260512-01-trois-regimes.svg]]
- ![[../coding-agents/images/20260512-04-comparatif.svg]]
- ![[../coding-agents/images/20260512-08-carte-decision.svg]]

**Notes d'animation**
- Insister sur le passage copilote → collègue
- Anticiper la question « ça remplace les développeurs ? » (renvoyer session 4)

**Slideshow** : [01-le-present-slideshow.html](01-le-present-slideshow.html)

## Sessions 2, 3, 4 — même structure
## Événement final — brief consultants
## Logistique — planning, salle, captation
```

## Critères de succès

1. **Mathieu peut animer chaque session** sans préparation supplémentaire substantielle (les slideshows sont prêts, les notes d'animation dans `syllabus.md` suffisent).
2. **Les 4 sessions sont auto-suffisantes** : un participant qui en rate une peut consulter le slideshow correspondant chez lui.
3. **L'arc narratif est lisible** : à la fin de la session 4, l'événement final apparaît comme la suite logique, pas comme un addendum.
4. **Le matériel est exclusivement réutilisé** des dossiers existants, sauf 1-2 schémas baromètre fournis par Mathieu en aval.
5. **Le syllabus est versionné** dans le repo, traitable comme tout autre artefact (commit, branche, PR pour relecture).

## Ouvertures (hors scope immédiat)

- **Versions PDF / impression** des slideshows pour distribution post-session : à voir si demande, peut être généré en `?print=true` sur les slideshows existants.
- **Tracker d'engagement** : feuille de présence, retours qualitatifs après chaque session — manuel pour démarrer, instrumenter plus tard si besoin.
- **Itération** : après les 2 premières sessions, ajuster le minutage de 3 et 4 selon les questions qui sortent.
- **Si publication publique du syllabus à terme** : ajouter tuile dans `index.html` racine + générer `og.png` via `tools/og-card.py` + run `tools/seo_dossiers.py --only syllabus`.

## Risques identifiés

| Risque | Impact | Mitigation |
|---|---|---|
| Dérive des SVG sources (un schéma modifié casse le sens du slideshow) | Moyen | Si une session est jouée et le schéma modifié, copier rétroactivement la version « gelée » dans `syllabus/images/` |
| Audience trop hétérogène (users vs builders) → personne ne se reconnaît | Moyen | Hooks de session ciblés *« pour les users : ... · pour les builders : ... »* explicitement annoncés |
| Le baromètre ne donne pas matière suffisante à 10 min d'ouverture session 1 | Faible | Mathieu peut compléter avec des observations terrain CoC |
| Les 2 consultants n'arrivent pas à temps pour le final | Élevé | Calage très en amont ; backup possible : Mathieu présente seul en s'appuyant sur les apps `evaluation-agentique/` et `observabilite-agents-ia/` |
