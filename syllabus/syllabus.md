# Syllabus CoC Data — Acculturation IA agentique

> Cycle de **4 sessions × 45 min** + **événement final 1h30**
> Cible : ~400 ingénieurs (users + builders)
> Origine : baromètre interne 103 répondants, mai 2026
> Auteur : Mathieu Guglielmino · Format co-écrit avec l'aide d'une IA

---

## Vue d'ensemble

L'acculturation se fait en cinq temps : **présent → mécanique → valeur → futur → mise en production**. Chaque session courte est conçue pour 45 min (30 min de présentation + 15 min d'échange), animée par une seule personne. L'événement final (1h30) capitalise sur les 4 sessions et fait intervenir deux REX internes (collègues du groupe sur évaluation et observabilité).

Tous les supports sont autonomes : un participant qui rate une session peut consulter le slideshow correspondant chez lui. Tous embarquent zoom plein écran, modaux explicatifs et navigation clavier.

### Chiffres baromètre qui guident l'acculturation

- **103 répondants** consultants Data & Analytics, 92 % Grand Compte ou CAC 40
- **47 % Data Analyst / BI** = profil dominant à acculturer en priorité
- **58 % génération / débogage de code** = tâche IA n°1 (cible session 1)
- **36 % d'usage IA faible** (rarement ou jamais) = besoin d'acculturation confirmé
- **27 % de POC clients** = pression business sur la mesure (cible session 3)
- **3 % data storytelling, 7 % livrables clients** = angles morts (bonus session 4)

---

## Session 1 — Le présent · 45 min

**Hook** : *« 60 % d'entre vous utilisent l'IA chaque semaine, 58 % pour coder. Voilà comment on en tire vraiment parti — et pourquoi c'est un début, pas la fin. »*

**Plan minuté**
- 0-3'   Plan du syllabus — carte de route des 5 sessions
- 3-12'  Restitution baromètre — 4 visuels reformatés, focus sur les chiffres qui parlent à l'audience
- 12-30' Coding agents 2026 — Claude Code / Codex / Copilot, en partant du chiffre 58 %
- 30-45' Échange + appel à pilotes (cible : 5 DA/BI + 2 Data Engineers minimum)

**Schémas embarqués** (syntaxe Obsidian, preview inline ; ignorée par GitHub Pages)
- ![[images/baromètre/baro-05-plan-syllabus.svg]]
- ![[images/baromètre/baro-01-chiffres-cles.svg]]
- ![[images/baromètre/baro-02-profil-repondants.svg]]
- ![[images/baromètre/baro-03-adoption-impact.svg]]
- ![[images/baromètre/baro-04-taches-par-profil.svg]]
- ![[../coding-agents/images/20260512-01-trois-regimes.svg]]
- ![[../coding-agents/images/20260512-04-comparatif.svg]]
- ![[../coding-agents/images/20260512-08-carte-decision.svg]]

**Notes d'animation**
- Le plan-syllabus est la **carte de route** projetée pendant qu'on s'installe — donne le tableau d'ensemble en 30 secondes.
- Insister sur le passage **copilote → collègue → autonome** (`coding-agents/01-trois-regimes`) — c'est le mental model qui ouvre la suite du syllabus.
- Anticiper la question « ça remplace les développeurs ? » → renvoyer explicitement à la session 4.
- Anticiper « c'est interdit chez nos clients » (59 % accès limité) → reconnaître la contrainte, expliquer ce qu'on peut faire en local (Claude Code en CLI sur poste de travail) et ce qu'on prépare pour quand l'accès s'ouvre.
- Pour l'appel à pilotes, viser une diversité de profils (au moins 5 DA/BI + 2 DE) — sinon on a 7 DS/ML qui font déjà du code IA tout seuls.

**Slideshow** : [01-le-present-slideshow.html](01-le-present-slideshow.html)

---

## Session 2 — La mécanique · 45 min

**Hook** : *« Pour bien utiliser un agent (et bien le construire), il faut savoir comment il pense. Sinon on attend des miracles ou on perd 3 mois sur un POC qui ne tient pas. »*

**Plan minuté**
- 0-10'  Pourquoi ce volet — différencier le besoin user (mental model) du besoin builder (design partagé). Référencer l'asymétrie 84 % DS/ML codent vs 44 % DE.
- 10-30' Anatomie d'un agent : boucle, outils MCP, mémoire/contexte
- 30-45' Q&A — distinction « ce qui se passe quand vous utilisez » vs « ce qui se passe quand vous construisez »

**Schémas embarqués**
- ![[../harness-agentique/images/20260429-01-anatomie-harness.svg]]
- ![[../harness-agentique/images/20260429-02-boucle-gan.svg]]
- ![[../mcp-plateforme/images/20260508-01-anatomie-protocole.svg]]
- ![[../memoire-agentique/images/20260430-05-context-engineering.svg]]
- *(bonus si temps)* ![[../agents-computer-use/images/20260502-01-taxonomie-cua.svg]]

**Notes d'animation**
- Le schéma `boucle-gan` (think → act → observe) est **le pivot** de la session — passer le temps qu'il faut dessus, illustrer avec un exemple concret (Claude Code qui lit un fichier, modifie, run un test).
- MCP : insister sur le fait que c'est un **standard** (depuis fin 2024), pas un détail propriétaire — invite à construire des serveurs MCP côté CoC.
- Mémoire : démystifier — montrer la différence context window / mémoire persistante / RAG.

**Slideshow** : [02-la-mecanique-slideshow.html](02-la-mecanique-slideshow.html)

---

## Session 3 — La valeur · 45 min

**Hook** : *« 95 % des pilotes GenAI sans P&L mesurable — MIT NANDA. Pourquoi, et comment on s'y prend chez nos clients. »*

**Plan minuté**
- 0-10'  Le paradoxe agentique : ce qu'on mesure facilement vs ce qui crée de la valeur
- 10-30' Hard vs Soft savings, grille à 5 axes, études empiriques (Brynjolfsson +14 %, Klarna recul, Jagged Frontier)
- 30-45' Échange sur projets en cours **+ teaser explicite** : *« mesurer = instrumenter — c'est l'objet de l'événement final. Vous y serez ? »*

**Schémas embarqués**
- ![[../measure-roi/images/20260507-01-paradoxe-roi.svg]]
- ![[../measure-roi/images/20260507-05-hard-vs-soft.svg]]
- ![[../measure-roi/images/20260507-03-grille-5-axes.svg]]
- ![[../measure-roi/images/20260507-09-productivity-findings.svg]]
- ![[../evaluation-agentique/images/20260501-09-couts-goulots.svg]] *(teaser final)*

**Notes d'animation**
- Le chiffre 95 % accroche — l'utiliser comme le hook qui force l'attention.
- Être très clair sur le **paradoxe agentique** : le coût par token baisse, mais la complexité de l'agent augmente → le coût par tâche peut monter même si le coût par token baisse.
- Klarna : raconter l'histoire (pic communication, recul, ré-embauche) — exemple culturel partageable.
- **Annoncer explicitement l'événement final** dans les 5 dernières minutes : « pour mesurer vraiment, il faut instrumenter, et pour instrumenter il faut savoir ce qu'on mesure — c'est ce que les deux REX viennent expliquer le [date] ».

**Slideshow** : [03-la-valeur-slideshow.html](03-la-valeur-slideshow.html)

---

## Session 4 — Le futur · 45 min

**Hook** : *« De 47 % d'emplois exposés (Frey-Osborne 2013) à 0,55 % de productivité gagnée sur 10 ans (Acemoglu 2024) — quel scénario pour notre CoC ? »*

**Plan minuté**
- 0-10'  L'écart entre les estimations
- 10-25' Augmentation vs automatisation, 4 scénarios 2035, 6 leviers d'action
- 22-35' **Bonus narrative-experiences — l'angle mort** : 3 % storytelling, illustré par le schéma chaîne-augmentée. Pointer vers le dossier `narrative-experiences/` comme ouverture pour ceux qui veulent creuser après.
- 35-45' Échange — quel scénario pour le CoC, quelles compétences à développer (au-delà du code), comment le CoC se positionne

**Schémas embarqués**
- ![[../ia-et-travail/images/20260504-01-frise-estimations.svg]]
- ![[../ia-et-travail/images/20260504-04-augmentation-automatisation.svg]]
- ![[../ia-et-travail/images/20260504-07-quatre-scenarios.svg]]
- ![[../ia-et-travail/images/20260504-08-six-leviers.svg]]
- ![[../narrative-experiences/images/20260505-06-chaine-augmentee.svg]]

**Notes d'animation**
- L'écart Frey-Osborne / Acemoglu est l'accroche la plus efficace — c'est un chiffre qui marque.
- Pour le bonus storytelling : montrer le schéma `chaîne-augmentée` (`narrative-experiences/`) pour illustrer concrètement comment l'IA s'insère dans la production de visuels, puis donner l'URL `https://mathieugug.github.io/narrative-experiences/` pour qui veut creuser.
- Préparer mentalement la question politique « est-ce que ça remplace les juniors ? » — répondre par les leviers (formation, redéfinition des rôles, captation de la valeur).

**Slideshow** : [04-le-futur-slideshow.html](04-le-futur-slideshow.html)

---

## Événement final — Les agents en production · 1h30

**Format** : intro syllabus (15 min) + 2 REX internes (30 min chacun) + échange tripartite (15 min). Cible : **builders du CoC** — Data Engineers + Data Scientists (~33 % de l'audience baromètre, soit ~130 personnes sur les ~400 du CoC).

**Plan minuté**
- 0-15'   intro syllabus — capitalisation des 4 sessions, pourquoi on amène 2 REX maintenant
- 15-45'  **REX 1 — Évaluation des agents** : pyramide des métriques, LLM-as-judge, playbook gruyère
- 45-75'  **REX 2 — Observabilité** : 6 piliers, anatomie d'une trace OpenTelemetry GenAI, échelle de maturité
- 75-90'  Échange tripartite + roadmap CoC (mois suivants)

**Schémas embarqués**
- ![[../coding-agents/images/20260512-01-trois-regimes.svg]] *(rappel session 1)*
- ![[../harness-agentique/images/20260429-01-anatomie-harness.svg]] *(rappel session 2)*
- ![[../measure-roi/images/20260507-01-paradoxe-roi.svg]] *(rappel session 3)*
- ![[../evaluation-agentique/images/20260501-04-pyramide-metriques.svg]]
- ![[../evaluation-agentique/images/20260501-05-llm-as-judge.svg]]
- ![[../evaluation-agentique/images/20260501-10-playbook-gruyere.svg]]
- ![[../observabilite-agents-ia/images/20260430-02-six-piliers-telemetrie.svg]]
- ![[../observabilite-agents-ia/images/20260430-04-anatomie-trace-otel-genai.svg]]
- ![[../observabilite-agents-ia/images/20260430-08-echelle-maturite-observabilite.svg]]

**Brief REX**
- Envoyer aux deux : ce syllabus.md + les rapports complets `evaluation-agentique/` et `observabilite-agents-ia/`
- Demander : 30 min chrono, 3 schémas max, focus production (pas POC)
- Cadrage commun : « le CoC a vu mécanique + ROI + travail — vous arrivez sur la mise en production »

**Slideshow** : [05-evenement-final-slideshow.html](05-evenement-final-slideshow.html) (intro syllabus prête, sections REX en placeholder à compléter en pré-prod)

---

## Logistique

- **Cadence proposée** : 1 session par semaine sur 4 semaines, événement final en S+5 ou S+6
- **Salle** : assez grande pour 30-50 personnes par session courte (sur ~400, taux d'engagement réaliste : 10-15 %), salle conférence pour le final
- **Captation** : enregistrement audio/vidéo des 4 sessions courtes pour rediffusion asynchrone (les slideshows sont déjà autonomes, l'enregistrement complète l'animation)
- **Communication** : annonce groupée du cycle entier en S-1, rappel 48 h avant chaque session
- **Tracker** : feuille de présence simple par session, court formulaire post-événement pour évaluer (5 questions max)

## Itération après chaque session

Après chaque session, ajouter ici :
- Nombre de présents
- 3 questions clés qui ont émergé
- 1 ajustement à faire pour la session suivante
