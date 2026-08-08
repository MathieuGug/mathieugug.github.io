#!/usr/bin/env python3
"""Build syllabus slideshow N from the T8 (Session 1) slideshow as base.

Token-efficient: cp T8 -> T<N>, then surgical regex replacements
(head metadata, SVG inlining, SCHEMAS, SCENES, dossier-context).

Usage: python tools/build_syllabus_slideshow.py <session-number>

Sessions implemented: 2 (la mécanique).
Other sessions to be added incrementally.
"""

import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

# ============================================================================
# Session 2 — La mécanique
# ============================================================================

SESSION_2 = {
    "out_filename": "02-la-mecanique-slideshow.html",
    "title": "La mécanique — Session 2 Syllabus CoC Data",
    "description": "Slideshow interactif — Session 2 : La mécanique. Anatomie d'un agent, boucle agentique, MCP, mémoire/context-engineering. 10 scènes.",
    "dossier_context": "Syllabus CoC Data — Session 2",
    "canonical_url": "https://mathieugug.github.io/syllabus/02-la-mecanique-slideshow.html",
    "og_image_url": "https://mathieugug.github.io/harness-agentique/og.png",
    "svgs": [
        ("harness-01", "harness-agentique/images/20260429-01-anatomie-harness.svg"),
        ("harness-02", "harness-agentique/images/20260429-02-boucle-gan.svg"),
        ("mcp-01",     "mcp-plateforme/images/20260508-01-anatomie-protocole.svg"),
        ("memoire-05", "memoire-agentique/images/20260430-05-context-engineering.svg"),
        ("cua-01",     "agents-computer-use/images/20260502-01-taxonomie-cua.svg"),
    ],
    "scenes_js": r"""[
  /* 01 — Intro punchline */
  {
    type: 'punchline',
    title: 'La mécanique — Session 2',
    body: 'Pour bien utiliser un agent — ou bien le construire — il faut <mark>savoir comment il pense</mark>.'
  },
  /* 02 — Pourquoi : asymétrie users/builders */
  {
    type: 'punchline',
    title: 'Pourquoi cette session',
    body: '<mark>84 % des Data Scientists/ML</mark> utilisent l\'IA pour coder. <mark>44 % des Data Engineers</mark> seulement. La différence est dans le mental model — pas dans l\'outil.',
    attribution: 'Baromètre CoC Data 2026'
  },
  /* 03 — Anatomie d'un harness (harness-01) */
  {
    type: 'schema',
    title: 'Anatomie d\'un harness — vue d\'ensemble',
    schemaId: 'harness-01',
    steps: [
      { caption: 'Un agent agentique n\'est pas un modèle. C\'est sept couches qui orchestrent un modèle. Vue d\'ensemble.', highlight: [], dim: [], hidden: [], fullView: true },
      { caption: 'La boucle — c\'est le cœur. Think -> Act -> Observe, en cycles successifs jusqu\'à la complétion.', highlight: ['[data-card="boucle"]'], dim: ['[data-card="contexte"]','[data-card="modele"]','[data-card="outils"]','[data-card="memoire"]','[data-card="observabilite"]','[data-card="gouvernance"]'], hidden: [], modalAuto: 'boucle' },
      { caption: 'Les outils — ce que l\'agent peut faire au monde extérieur (lire un fichier, exécuter du code, appeler une API).', highlight: ['[data-card="outils"]'], dim: ['[data-card="boucle"]','[data-card="contexte"]','[data-card="modele"]','[data-card="memoire"]','[data-card="observabilite"]','[data-card="gouvernance"]'], hidden: [], modalAuto: 'outils' },
      { caption: 'La mémoire — ce qui survit d\'un cycle au suivant. Critère structurant pour distinguer un assistant d\'un délégué.', highlight: ['[data-card="memoire"]'], dim: ['[data-card="boucle"]','[data-card="contexte"]','[data-card="modele"]','[data-card="outils"]','[data-card="observabilite"]','[data-card="gouvernance"]'], hidden: [], modalAuto: 'memoire' }
    ]
  },
  /* 04 — Boucle GAN (harness-02) — LE pivot */
  {
    type: 'schema',
    title: 'Boucle agentique — think -> act -> observe',
    schemaId: 'harness-02',
    steps: [
      { caption: 'La boucle de raisonnement détaillée. Pivot de la session — passer le temps qu\'il faut dessus. Exemple : Claude Code qui lit un fichier, le modifie, lance un test, lit le résultat.', highlight: [], dim: [], hidden: [], fullView: true },
      { caption: 'Spec — l\'objectif que l\'humain énonce. Tout part de là. Une spec floue produit un agent flou.', highlight: ['[data-card="spec"]'], dim: ['[data-card="planner"]','[data-card="generator"]','[data-card="evaluator"]','[data-card="critique"]','[data-card="git"]','[data-card="criteres"]','[data-card="progress"]'], hidden: [], modalAuto: 'spec' },
      { caption: 'Generator — l\'étape de génération. Le modèle propose une action ou un patch.', highlight: ['[data-card="generator"]'], dim: ['[data-card="spec"]','[data-card="planner"]','[data-card="evaluator"]','[data-card="critique"]','[data-card="git"]','[data-card="criteres"]','[data-card="progress"]'], hidden: [], modalAuto: 'generator' },
      { caption: 'Evaluator — l\'étape d\'évaluation. Le résultat passe-t-il les critères ? Si oui, on continue. Sinon, on critique et on régénère.', highlight: ['[data-card="evaluator"]','[data-card="critique"]'], dim: ['[data-card="spec"]','[data-card="planner"]','[data-card="generator"]','[data-card="git"]','[data-card="criteres"]','[data-card="progress"]'], hidden: [], modalAuto: 'evaluator' }
    ]
  },
  /* 05 — Outils punchline */
  {
    type: 'punchline',
    title: 'Outils',
    body: '<mark>Outils.</mark> Le langage que parle un agent au monde.'
  },
  /* 06 — MCP (mcp-01) */
  {
    type: 'schema',
    title: 'MCP — protocole standard depuis fin 2024',
    schemaId: 'mcp-01',
    steps: [
      { caption: 'MCP — Model Context Protocol. Standard ouvert porté par Anthropic, adopté par OpenAI et Google. Permet à n\'importe quel agent d\'utiliser n\'importe quel outil sans intégration ad hoc.', highlight: [], dim: [], hidden: [], fullView: true },
      { caption: 'Host — l\'application qui héberge l\'agent (Claude Desktop, Cursor, etc.). Côté utilisateur.', highlight: ['[data-card="host"]'], dim: ['[data-card="server"]','[data-card="transport"]'], hidden: [], modalAuto: 'host' },
      { caption: 'Server — un outil ou une source de données exposée via MCP. Côté fournisseur. Le CoC peut en construire pour ses propres systèmes.', highlight: ['[data-card="server"]'], dim: ['[data-card="host"]','[data-card="transport"]'], hidden: [], modalAuto: 'server' }
    ]
  },
  /* 07 — Mémoire punchline */
  {
    type: 'punchline',
    title: 'Mémoire',
    body: '<mark>Mémoire.</mark> Ce qui survit à un appel LLM, ou pas.'
  },
  /* 08 — Context engineering (memoire-05) */
  {
    type: 'schema',
    title: 'Context engineering — write, select, compress, isolate',
    schemaId: 'memoire-05',
    steps: [
      { caption: 'Quatre opérations sur la mémoire d\'un agent. Le context engineer décide quoi garder, quoi écarter, quoi résumer, quoi cloisonner.', highlight: [], dim: [], hidden: [], fullView: true },
      { caption: 'Write — écrire dans la mémoire. Décider quoi persister entre les cycles (CLAUDE.md, notes de session).', highlight: ['[data-card="write"]'], dim: ['[data-card="select"]','[data-card="compress"]','[data-card="isolate"]'], hidden: [], modalAuto: 'write' },
      { caption: 'Select — choisir ce qu\'on rapatrie dans le context window à chaque cycle. RAG, indexation, recherche sémantique.', highlight: ['[data-card="select"]'], dim: ['[data-card="write"]','[data-card="compress"]','[data-card="isolate"]'], hidden: [], modalAuto: 'select' },
      { caption: 'Compress — résumer pour tenir dans la fenêtre. Stratégique : on garde l\'essentiel, on jette le bruit.', highlight: ['[data-card="compress"]'], dim: ['[data-card="write"]','[data-card="select"]','[data-card="isolate"]'], hidden: [], modalAuto: 'compress' }
    ]
  },
  /* 09 — Computer use (cua-01) — bonus */
  {
    type: 'schema',
    title: 'Computer use — la frontière des agents qui voient l\'écran',
    schemaId: 'cua-01',
    steps: [
      { caption: 'Bonus si temps. Computer-use agents : ils ne lisent pas du code, ils <em>voient</em> et <em>cliquent</em> une interface. Frontier 2026.', highlight: [], dim: [], hidden: [], fullView: true },
      { caption: 'Browser agent — automate des tâches dans un navigateur (formulaires, scraping, parcours utilisateur). Le cas d\'usage le plus mature.', highlight: ['[data-card="browser-agent"]'], dim: ['[data-card="desktop-agent"]','[data-card="mobile-agent"]','[data-card="agent-cua"]','[data-card="obs-pixel"]','[data-card="obs-dom"]','[data-card="obs-at"]'], hidden: [], modalAuto: 'browser-agent' },
      { caption: 'Desktop / Mobile — l\'agent contrôle un OS complet. Réservé à des cas bornés et observables.', highlight: ['[data-card="desktop-agent"]','[data-card="mobile-agent"]'], dim: ['[data-card="browser-agent"]','[data-card="agent-cua"]','[data-card="obs-pixel"]','[data-card="obs-dom"]','[data-card="obs-at"]'], hidden: [], modalAuto: 'desktop-agent' }
    ]
  },
  /* 10 — Outro */
  {
    type: 'outro',
    title: 'Session 2',
    outroTitle: 'Session 2 — <em>La mécanique</em>',
    body: 'Sept couches, une boucle, des outils standard, une mémoire à orchestrer. La prochaine session : comment on chiffre l\'impact d\'un projet IA — et pourquoi 95 % des pilotes GenAI sont sans P&amp;L mesurable.',
    cta: { href: '03-la-valeur-slideshow.html', label: 'Session 3 — La valeur' },
    secondary: { href: 'index.html', label: 'Revenir au hub' }
  }
]""",
    "schemas_js": r"""{
  /* ── Harness anatomie (harness-01) ── */
  "harness-01": {
    "boucle": {
      "eyebrow": "PIVOT", "title": "La boucle — think -> act -> observe",
      "body": "<p>Le cycle de raisonnement de l'agent. À chaque tour : il pense (génère une action), il agit (appelle un outil), il observe (lit le résultat), puis il replanifie. Ce cycle se répète jusqu'à la complétion ou l'arrêt.</p><p><strong>Pour les users :</strong> c'est ce qui fait que Claude Code peut « lire un fichier, le modifier, vérifier son test ». Pour les builders : c'est l'unité atomique qu'on instrumente, qu'on cache, qu'on observe.</p>"
    },
    "outils": {
      "eyebrow": "ACT", "title": "Les outils — ce que l'agent peut faire au monde",
      "body": "<p>Lire un fichier, écrire un fichier, exécuter une commande, appeler une API HTTP, interroger une base. Chaque outil est une <em>capacité</em> définie par son interface. <mark>Plus l'outil est précis, mieux l'agent le manipule.</mark></p><p>MCP standardise cette couche depuis fin 2024 : un serveur MCP expose un outil de manière universelle, n'importe quel agent peut l'utiliser.</p>"
    },
    "memoire": {
      "eyebrow": "PERSISTANCE", "title": "La mémoire — ce qui survit d'un cycle à l'autre",
      "body": "<p>Trois niveaux : le context window (court terme, perdu en fin de session), la mémoire de session (CLAUDE.md, notes), la mémoire persistante (vector store, RAG). Choix structurant : qu'est-ce qu'on persiste ?</p><p>Critère qui distingue un assistant (sans mémoire) d'un délégué (avec mémoire de tâche)."
    },
    "contexte": {
      "eyebrow": "CONTEXT WINDOW", "title": "Le contexte — la fenêtre de raisonnement",
      "body": "<p>Tout ce que l'agent « voit » à un instant T : prompt système, historique de conversation, fichiers en cache, retours d'outils. Limite physique du modèle (200k -> 1M tokens en 2026).</p><p>Bien gérer le contexte = sélectionner ce qui entre, compresser ce qui s'accumule. C'est l'art du <em>context engineering</em>.</p>"
    },
    "modele": {
      "eyebrow": "MOTEUR", "title": "Le modèle — le moteur de raisonnement",
      "body": "<p>LLM ou multi-modèles (un grand pour le planning, un petit pour les exécutions répétées). Le choix dépend du coût/qualité, mais aussi du fournisseur (latence, sécurité, conformité). <mark>Le modèle n'est plus la pièce critique</mark> : ce sont les couches autour qui font la différence.</p>"
    },
    "observabilite": {
      "eyebrow": "VOIR", "title": "L'observabilité — savoir ce qui s'est passé",
      "body": "<p>Traces, logs, métriques par cycle. Sans observabilité, un agent en production est une boîte noire — impossible à diagnostiquer, impossible à améliorer. C'est le sujet de l'événement final du syllabus.</p>"
    },
    "gouvernance": {
      "eyebrow": "CADRE", "title": "La gouvernance — qui décide quoi",
      "body": "<p>Permissions, autorisations, escalades. Quels outils l'agent peut utiliser sans validation humaine ? Quelles actions sont irréversibles et exigent confirmation ? La gouvernance évolue avec la maturité — au début tout est validé, ensuite on relâche selon la confiance acquise.</p>"
    }
  },
  /* ── Boucle GAN (harness-02) ── */
  "harness-02": {
    "spec": {
      "eyebrow": "POINT DE DÉPART", "title": "Spec — l'objectif énoncé par l'humain",
      "body": "<p>Tout commence par une spec : « refactorise cette fonction », « ajoute un test pour ce cas », « investigue ce bug ». La qualité de la spec conditionne la qualité de l'agent. <mark>Spec floue = agent qui patauge.</mark></p>"
    },
    "planner": {
      "eyebrow": "PLAN", "title": "Planner — décompose la spec en sous-tâches",
      "body": "<p>Étape optionnelle (mais utile pour les tâches complexes) : l'agent génère un plan d'action avant d'exécuter. Permet de valider l'approche avant que les actions consomment des tokens et du temps.</p>"
    },
    "generator": {
      "eyebrow": "ACT", "title": "Generator — propose une action",
      "body": "<p>Le modèle génère la prochaine action : appel d'outil, modification de fichier, message à l'utilisateur. L'unité de génération.</p>"
    },
    "evaluator": {
      "eyebrow": "JUGER", "title": "Evaluator — vérifie le résultat",
      "body": "<p>Une fois l'action exécutée, le résultat est évalué. Critères automatiques (tests passent ?), critères du modèle (réponse satisfait la spec ?), critères humains (validation explicite). <mark>Sans evaluator, pas de feedback loop.</mark></p>"
    },
    "critique": {
      "eyebrow": "FEEDBACK", "title": "Critique — pourquoi ça n'a pas marché",
      "body": "<p>Si l'evaluator échoue, le critique génère une analyse : qu'est-ce qui a manqué, quoi essayer ensuite. Cette critique nourrit le prochain cycle de génération. Pattern GAN appliqué au raisonnement.</p>"
    },
    "criteres": {
      "eyebrow": "RÈGLES DU JEU", "title": "Critères — comment on juge",
      "body": "<p>Les critères d'acceptation explicites. Tests unitaires qui doivent passer, format de sortie attendu, contraintes de style. Plus les critères sont précis, plus la boucle converge vite.</p>"
    },
    "progress": {
      "eyebrow": "MESURE", "title": "Progress — suivi inter-cycles",
      "body": "<p>État d'avancement : nombre de cycles, tokens consommés, ratio de critères validés. Permet d'arrêter quand on stagne ou quand on dépasse un budget.</p>"
    },
    "git": {
      "eyebrow": "VERSIONNEMENT", "title": "Git — la trace d'audit",
      "body": "<p>Chaque modification de code passe par git. Permet de rollback, de comparer, de réviser. Sans git, un agent qui touche du code est ingérable. <mark>Pré-requis non négociable</mark> pour confier de vrais livrables à un agent.</p>"
    }
  },
  /* ── MCP protocole (mcp-01) ── */
  "mcp-01": {
    "host": {
      "eyebrow": "CÔTÉ USER", "title": "Host — l'application qui héberge l'agent",
      "body": "<p>Claude Desktop, Cursor, Continue, Cline, Aider… autant d'hôtes MCP-compatibles. L'utilisateur lance l'host, configure les serveurs MCP qu'il veut activer, et chaque outil exposé devient utilisable par l'agent.</p>"
    },
    "server": {
      "eyebrow": "CÔTÉ FOURNISSEUR", "title": "Server — un outil ou une source exposée via MCP",
      "body": "<p>Un serveur MCP encapsule une capacité (lire un fichier, requêter une base, appeler une API métier). <mark>Le CoC peut construire ses propres serveurs MCP</mark> pour exposer ses systèmes internes aux agents — sans intégration ad hoc, sans wrapper propriétaire.</p>"
    },
    "transport": {
      "eyebrow": "CÂBLAGE", "title": "Transport — comment host et server se parlent",
      "body": "<p>Stdio (le serveur tourne en local, l'host pipe), HTTP/SSE (le serveur tourne en remote, l'host appelle), WebSocket. Choix selon la sécurité et la latence. Détail technique mais conditionne le déploiement.</p>"
    }
  },
  /* ── Context engineering (memoire-05) ── */
  "memoire-05": {
    "write": {
      "eyebrow": "PERSISTER", "title": "Write — écrire dans la mémoire",
      "body": "<p>Décider ce qui mérite d'être conservé entre les cycles. Notes de session, conventions de projet (CLAUDE.md), résultats intermédiaires. <mark>L'agent ne se souvient que de ce qu'on a écrit explicitement.</mark></p>"
    },
    "select": {
      "eyebrow": "RAPATRIER", "title": "Select — choisir ce qu'on rapatrie",
      "body": "<p>RAG, recherche sémantique, indexation. À chaque cycle, l'agent reformule sa question et tire de la mémoire ce qui est pertinent. Plus le select est intelligent, moins la fenêtre est encombrée.</p>"
    },
    "compress": {
      "eyebrow": "RÉSUMER", "title": "Compress — réduire pour tenir dans la fenêtre",
      "body": "<p>Résumer le passé pour libérer de la place. Risque : perdre l'information critique. Stratégie : compresser ce qui est ancien, garder verbatim ce qui est récent. Inspiré du forgetting curve cognitif.</p>"
    },
    "isolate": {
      "eyebrow": "CLOISONNER", "title": "Isolate — séparer les contextes",
      "body": "<p>Sub-agents avec leur propre fenêtre. Permet d'éviter qu'un contexte pollue un autre. Pattern : un agent maître orchestre, des sous-agents focalisés exécutent — chacun avec une mémoire dédiée.</p>"
    }
  },
  /* ── Computer use taxonomy (cua-01) ── */
  "cua-01": {
    "agent-cua": {
      "eyebrow": "CATÉGORIE", "title": "Agent CUA — l'agent qui pilote un OS",
      "body": "<p>Computer-Use Agent. Capable de voir une interface graphique (capture écran), interpréter les éléments visibles, et agir via clic/clavier comme un utilisateur humain. <mark>Frontier 2026.</mark></p>"
    },
    "browser-agent": {
      "eyebrow": "BROWSER", "title": "Browser agent — le cas le plus mature",
      "body": "<p>Automatisation de tâches dans un navigateur web. Cas d'usage classiques : remplir des formulaires, scraper, simuler un parcours utilisateur. Maturité commerciale : Claude Computer Use, OpenAI Operator, Anthropic Web Use.</p>"
    },
    "desktop-agent": {
      "eyebrow": "DESKTOP", "title": "Desktop agent — l'agent qui contrôle un OS complet",
      "body": "<p>Plus ambitieux : l'agent pilote tout l'environnement de bureau (Excel, IDE, communication). Réservé à des cas bornés et observables. Risque maximal — l'agent peut faire des dégâts sur le système hôte.</p>"
    },
    "mobile-agent": {
      "eyebrow": "MOBILE", "title": "Mobile agent — l'agent qui pilote un smartphone",
      "body": "<p>Application sur appareil ou sur émulateur cloud. Cas d'usage marginal aujourd'hui mais en croissance (assistants vocaux + actions). À surveiller pour 2027.</p>"
    },
    "obs-pixel": {
      "eyebrow": "OBSERVATION", "title": "Pixel-based — l'agent voit comme un humain",
      "body": "<p>L'agent reçoit une capture d'écran, l'analyse via vision (modèle multimodal). Robuste mais coûteux en tokens et en latence.</p>"
    },
    "obs-dom": {
      "eyebrow": "OBSERVATION", "title": "DOM-based — l'agent lit la structure HTML",
      "body": "<p>Pour les browser agents : l'agent lit l'arbre DOM directement. Plus précis, moins coûteux que pixel, mais limité aux pages web.</p>"
    },
    "obs-at": {
      "eyebrow": "OBSERVATION", "title": "Accessibility tree — l'agent lit l'arbre d'accessibilité",
      "body": "<p>Pour les desktop agents : l'arbre d'accessibilité OS expose la structure de l'UI. Compromis entre robustesse (DOM) et universalité (pixel).</p>"
    }
  }
}""",
}

# ============================================================================
# Build function
# ============================================================================

BASE_SLIDESHOW = REPO / "coding-agents" / "20260512-coding-agents-slideshow.html"

def build_session(cfg: dict, force: bool = False) -> None:
    target = REPO / "syllabus" / cfg["out_filename"]
    if force or not target.exists():
        # cp from up-to-date reference slideshow (coding-agents — has all the fixes)
        target.write_bytes(BASE_SLIDESHOW.read_bytes())
        print(f"[cp] {BASE_SLIDESHOW.name} -> {target.name}")

    text = target.read_text(encoding="utf-8")

    # 1. Head metadata
    text = re.sub(
        r"<title>[^<]+</title>",
        f"<title>{cfg['title']}</title>",
        text,
        count=1,
    )
    text = re.sub(
        r'<meta name="description" content="[^"]*"',
        f'<meta name="description" content="{cfg["description"]}"',
        text,
        count=1,
    )
    # canonical URL (if present)
    text = re.sub(
        r'<link rel="canonical" href="[^"]*"',
        f'<link rel="canonical" href="{cfg["canonical_url"]}"',
        text,
    )
    # og:url, og:title, og:description, og:image
    text = re.sub(
        r'<meta property="og:url" content="[^"]*"',
        f'<meta property="og:url" content="{cfg["canonical_url"]}"',
        text,
    )
    text = re.sub(
        r'<meta property="og:title" content="[^"]*"',
        f'<meta property="og:title" content="{cfg["title"]}"',
        text,
    )
    text = re.sub(
        r'<meta property="og:description" content="[^"]*"',
        f'<meta property="og:description" content="{cfg["description"]}"',
        text,
    )
    text = re.sub(
        r'<meta property="og:image" content="[^"]*"',
        f'<meta property="og:image" content="{cfg["og_image_url"]}"',
        text,
    )
    text = re.sub(
        r'<meta name="twitter:title" content="[^"]*"',
        f'<meta name="twitter:title" content="{cfg["title"]}"',
        text,
    )
    text = re.sub(
        r'<meta name="twitter:description" content="[^"]*"',
        f'<meta name="twitter:description" content="{cfg["description"]}"',
        text,
    )
    text = re.sub(
        r'<meta name="twitter:image" content="[^"]*"',
        f'<meta name="twitter:image" content="{cfg["og_image_url"]}"',
        text,
    )

    # 2. dossier-context
    text = re.sub(
        r'<span class="dossier-context">[^<]+</span>',
        f'<span class="dossier-context">{cfg["dossier_context"]}</span>',
        text,
        count=1,
    )

    # 3. Inline new SVGs (rename data-schema-id to avoid collisions)
    inlined_blocks = []
    for new_id, rel_path in cfg["svgs"]:
        svg_path = REPO / rel_path
        svg_text = svg_path.read_text(encoding="utf-8")
        if 'data-schema-id="' in svg_text:
            svg_text = re.sub(
                r'data-schema-id="[^"]*"',
                f'data-schema-id="{new_id}"',
                svg_text,
                count=1,
            )
        else:
            svg_text = re.sub(
                r"<svg\b",
                f'<svg data-schema-id="{new_id}"',
                svg_text,
                count=1,
            )
        # Strip the FIRST background <rect> with a paper-ivory fill so SVG is transparent.
        # The slideshow stage and zoom-overlay supply the background. Without strip, the
        # SVG shows a visible ivory panel on the dark zoom backdrop.
        svg_text = re.sub(
            r'\s*<rect\b[^>]*\bwidth="\d+"[^>]*\bheight="\d+"[^>]*\bfill="#[fF][aA0-9a-fA-F][fF0-9a-fA-F]{4}"[^>]*/>',
            '',
            svg_text,
            count=1,
        )
        # Crop viewBox vertically to hide the SVG header (schema marker + title + subtitle +
        # hairline rule) — the slideshow already shows the scene title via scene-title-bar.
        # Pattern : transform `viewBox="0 0 W H"` into `viewBox="0 155 W (H-155)"`.
        # 155 px is the typical header height in the site's SVG convention (cf. coding-agents
        # which uses `viewBox="0 155 1200 645"`).
        def _crop(m):
            w, h = int(m.group(1)), int(m.group(2))
            return f'viewBox="0 155 {w} {h - 155}"'
        svg_text = re.sub(
            r'viewBox="0\s+0\s+(\d+)\s+(\d+)"',
            _crop,
            svg_text,
            count=1,
        )
        # Replace HTML inline tags inside <text> with SVG-compatible <tspan>. When inlining
        # SVG into HTML, the HTML parser sees `<em>`, `<i>`, `<strong>`, `<b>` as exits from
        # the SVG context and aborts parsing — only the first few children of the SVG land
        # in the DOM, leaving the schema visually empty. Replacing them with `<tspan>` keeps
        # the SVG well-formed for the HTML parser. (Bug observed on ia-et-travail/01-frise.)
        svg_text = re.sub(r'<em>', '<tspan font-style="italic">', svg_text)
        svg_text = re.sub(r'</em>', '</tspan>', svg_text)
        svg_text = re.sub(r'<i>', '<tspan font-style="italic">', svg_text)
        svg_text = re.sub(r'</i>', '</tspan>', svg_text)
        svg_text = re.sub(r'<strong>', '<tspan font-weight="600">', svg_text)
        svg_text = re.sub(r'</strong>', '</tspan>', svg_text)
        svg_text = re.sub(r'<b>', '<tspan font-weight="600">', svg_text)
        svg_text = re.sub(r'</b>', '</tspan>', svg_text)
        inlined_blocks.append(svg_text.strip())
    new_svgs_block = "\n\n".join(inlined_blocks)

    # Insert at the beginning of the schemas div (so they take priority)
    text = text.replace(
        '<div id="schemas" hidden>',
        f'<div id="schemas" hidden>\n<!-- T9 SVGs (override T8 by appearing first; T8 SVGs unused but kept for token efficiency) -->\n{new_svgs_block}',
        1,
    )

    # 4. Replace SCENES (regex DOTALL up to "];")
    text = re.sub(
        r"const SCENES = \[.*?\n\];",
        f"const SCENES = {cfg['scenes_js']};",
        text,
        flags=re.DOTALL,
        count=1,
    )

    # 5. Replace SCHEMAS (regex DOTALL up to "};")
    text = re.sub(
        r"const SCHEMAS = \{.*?\n\};",
        f"const SCHEMAS = {cfg['schemas_js']};",
        text,
        flags=re.DOTALL,
        count=1,
    )

    # Patch the outro template fragment that the base (coding-agents) hardcoded with its own
    # title and a `download` attribute on the secondary CTA. These break two things in the
    # syllabus context : (1) scene.outroTitle from our SCENES is never used (the user sees
    # 'Coding agents 2026' on every outro); (2) the `download` attribute on the link forces
    # the browser to download `index.html` instead of navigating to the hub.
    text = text.replace(
        "<h2>Coding agents <em>2026</em> — l'essentiel</h2>",
        "<h2>${scene.outroTitle || scene.title || ''}</h2>",
    )
    text = text.replace(
        'href="${scene.secondary.href}" download',
        'href="${scene.secondary.href}"',
    )

    target.write_text(text, encoding="utf-8")
    print(f"[ok] wrote {target}")


# ============================================================================
# Session 3 — La valeur
# ============================================================================

SESSION_3 = {
    "out_filename": "03-la-valeur-slideshow.html",
    "title": "La valeur — Session 3 Syllabus CoC Data",
    "description": "Slideshow interactif — Session 3 : La valeur. 95 % des pilotes GenAI sans P&L mesurable — pourquoi, et comment chiffrer l'impact d'un projet IA. 9 scènes.",
    "dossier_context": "Syllabus CoC Data — Session 3",
    "canonical_url": "https://mathieugug.github.io/syllabus/03-la-valeur-slideshow.html",
    "og_image_url": "https://mathieugug.github.io/measure-roi/og.png",
    "svgs": [
        ("roi-01",  "measure-roi/images/20260507-01-paradoxe-roi.svg"),
        ("roi-05",  "measure-roi/images/20260507-05-hard-vs-soft.svg"),
        ("roi-03",  "measure-roi/images/20260507-03-grille-5-axes.svg"),
        ("roi-09",  "measure-roi/images/20260507-09-productivity-findings.svg"),
        ("eval-09", "evaluation-agentique/images/20260501-09-couts-goulots.svg"),
    ],
    "scenes_js": r"""[
  { type: 'punchline', title: 'La valeur — Session 3', body: '<mark>95 %</mark> des pilotes GenAI sans P&amp;L mesurable.', attribution: 'MIT NANDA, 2026' },
  { type: 'punchline', title: 'Le malentendu', body: 'On mesure ce qui est <em>facile à compter</em> (les heures économisées). On rate ce qui crée de la valeur (la <mark>réallocation</mark>).' },
  { type: 'schema', title: 'Le paradoxe agentique', schemaId: 'roi-01', steps: [
    { caption: 'Trois constats. Un potentiel annoncé, une réalité décevante, et un échec mesuré.', highlight: [], dim: [], hidden: [], fullView: true },
    { caption: 'Le potentiel : 2,6-4,4 trillions $ par an (McKinsey 2024). Le chiffre qui fait rêver les directions.', highlight: ['[data-card="potentiel"]'], dim: ['[data-card="realite"]','[data-card="echec"]'], hidden: [], modalAuto: 'potentiel' },
    { caption: 'La réalité observée : 95 % des pilotes sans P&amp;L mesurable. L\'écart est béant.', highlight: ['[data-card="echec"]'], dim: ['[data-card="potentiel"]','[data-card="realite"]'], hidden: [], modalAuto: 'echec' }
  ]},
  { type: 'schema', title: 'Hard savings vs soft savings', schemaId: 'roi-05', steps: [
    { caption: 'Cinq axes de valeur — mais tous ne sont pas mesurables de la même façon. Les soft savings (bien-être, qualité) résistent à la quantification.', highlight: [], dim: [], hidden: [], fullView: true },
    { caption: 'Coût et volume : hard savings — directement chiffrables en P&amp;L.', highlight: ['[data-card="bar-cout"]','[data-card="bar-volume"]'], dim: ['[data-card="bar-vitesse"]','[data-card="bar-qualite"]','[data-card="bar-bien-etre"]'], hidden: [], modalAuto: 'bar-cout' },
    { caption: 'Bien-être : soft saving le plus rétif à la mesure. Pourtant souvent le plus durable.', highlight: ['[data-card="bar-bien-etre"]'], dim: ['[data-card="bar-cout"]','[data-card="bar-volume"]','[data-card="bar-vitesse"]','[data-card="bar-qualite"]'], hidden: [], modalAuto: 'bar-bien-etre' }
  ]},
  { type: 'schema', title: 'La grille à 5 axes', schemaId: 'roi-03', steps: [
    { caption: 'Cinq axes pour évaluer un projet IA : Coût, Bien-être, Vitesse, Volume, Qualité. Lus ensemble — pas en silos.', highlight: [], dim: [], hidden: [], fullView: true },
    { caption: 'Vitesse : un cycle qui passe de 3 jours à 30 minutes change la nature du livrable, pas que sa cadence.', highlight: ['[data-card="vitesse"]'], dim: ['[data-card="cout"]','[data-card="qualite"]','[data-card="bien-etre"]','[data-card="volume"]'], hidden: [], modalAuto: 'vitesse' }
  ]},
  { type: 'schema', title: 'Empirique — ce que les études disent', schemaId: 'roi-09', steps: [
    { caption: 'Six études marquantes. Les chiffres ne convergent pas — et c\'est précisément l\'intérêt.', highlight: [], dim: [], hidden: [], fullView: true },
    { caption: 'Brynjolfsson : +14 % de productivité au support client. Bénéfice maximal pour les juniors.', highlight: ['[data-card="study-brynjolfsson"]'], dim: ['[data-card="study-copilot"]','[data-card="study-jagged-positive"]','[data-card="study-jagged-negative"]','[data-card="study-klarna"]','[data-card="study-metr"]'], hidden: [], modalAuto: 'study-brynjolfsson' },
    { caption: 'Klarna : pic communication, puis recul. Cas culte de la mesure ROI mal cadrée.', highlight: ['[data-card="study-klarna"]'], dim: ['[data-card="study-brynjolfsson"]','[data-card="study-copilot"]','[data-card="study-jagged-positive"]','[data-card="study-jagged-negative"]','[data-card="study-metr"]'], hidden: [], modalAuto: 'study-klarna' },
    { caption: 'Jagged frontier : ±19 pp selon que la tâche est dans la frontière de l\'IA ou pas.', highlight: ['[data-card="study-jagged-positive"]','[data-card="study-jagged-negative"]'], dim: ['[data-card="study-brynjolfsson"]','[data-card="study-copilot"]','[data-card="study-klarna"]','[data-card="study-metr"]'], hidden: [], modalAuto: 'study-jagged-positive' }
  ]},
  { type: 'punchline', title: 'Mesurer = instrumenter', body: 'Pour mesurer vraiment, il faut <mark>instrumenter</mark>. C\'est l\'objet de l\'événement final.', attribution: 'Teaser Lincoln Transform' },
  { type: 'schema', title: 'Coûts et goulots — teaser final', schemaId: 'eval-09', steps: [
    { caption: 'Évaluer un agent en production a un coût caché : la dette d\'instrumentation. Avant-goût de l\'événement final.', highlight: [], dim: [], hidden: [], fullView: true },
    { caption: 'Le piège des tokens : on optimise ce qu\'on facture, pas ce qui crée de la valeur.', highlight: ['[data-card="token-trap"]'], dim: [], hidden: [], modalAuto: 'token-trap' }
  ]},
  { type: 'outro', title: 'Session 3', outroTitle: 'Session 3 — <em>La valeur</em>', body: 'Une grille à 5 axes, 6 études empiriques, un paradoxe à 95 %. La prochaine session prend de la hauteur : ce que l\'IA change au travail data, et au CoC lui-même.', cta: { href: '04-le-futur-slideshow.html', label: 'Session 4 — Le futur' }, secondary: { href: 'index.html', label: 'Revenir au hub' } }
]""",
    "schemas_js": r"""{
  "roi-01": {
    "potentiel": { "eyebrow": "MIRAGE", "title": "Le potentiel annoncé — 2,6-4,4 trillions $/an", "body": "<p>Chiffre McKinsey 2024 — la fourchette qui a déclenché les budgets IA dans toutes les directions financières du monde. C'est l'estimation théorique de la création de valeur si toute l'économie capturait l'IA générative à pleine puissance.</p>" },
    "realite": { "eyebrow": "ÉCART", "title": "La réalité observée — pilotes nombreux, P&L muet", "body": "<p>Multiplication des POC, succès locaux dans les démos. Mais l'impact P&amp;L reste invisible. La cause n'est pas l'IA — c'est le passage à l'échelle qui ne se fait pas.</p>" },
    "echec": { "eyebrow": "MIT NANDA 2026", "title": "95 % de pilotes sans impact P&L mesurable", "body": "<p>Étude MIT NANDA : sur 100 pilotes GenAI suivis, 95 ne convertissent pas en valeur économique mesurée. <mark>Le problème n'est pas l'absence de valeur — c'est l'absence de mesure adaptée.</mark></p>" }
  },
  "roi-05": {
    "bar-cout": { "eyebrow": "HARD", "title": "Coût — l'axe le plus tangible", "body": "<p>Heures économisées × taux horaire = baisse de coût. Direct, lisible, mais souvent surévalué (ne capture pas la réallocation des heures gagnées).</p>" },
    "bar-volume": { "eyebrow": "HARD", "title": "Volume — produire plus avec autant", "body": "<p>Plus de tickets traités, plus d'analyses livrées. Mesurable mais conditionné à la demande (un volume gagné sans usage est du gâchis).</p>" },
    "bar-vitesse": { "eyebrow": "MIXTE", "title": "Vitesse — le cycle qui se compresse", "body": "<p>Time-to-market raccourci. Lisible si le marché valorise la vitesse (Tech, finance), invisible sinon (réglementé, B2B long).</p>" },
    "bar-qualite": { "eyebrow": "SOFT", "title": "Qualité — l'erreur évitée", "body": "<p>Moins de bugs, moins de litiges. Mesurable a posteriori (incidents évités) mais difficile à attribuer ex ante.</p>" },
    "bar-bien-etre": { "eyebrow": "SOFT", "title": "Bien-être — la couche invisible et durable", "body": "<p>Moins de tâches répétitives, plus de focus sur le métier. <mark>L'axe le plus difficile à chiffrer, souvent le plus durable</mark> en termes de rétention et de qualité de delivery.</p>" }
  },
  "roi-03": {
    "cout": { "eyebrow": "AXE 1", "title": "Coût", "body": "<p>Baisse directe ou évitement. Le réflexe naturel — mais réducteur si seul utilisé.</p>" },
    "bien-etre": { "eyebrow": "AXE 2", "title": "Bien-être", "body": "<p>Charge cognitive, satisfaction, sens. Difficile à mesurer mais cité par 80 % des répondants comme bénéfice principal de l'IA dans leur quotidien.</p>" },
    "vitesse": { "eyebrow": "AXE 3", "title": "Vitesse", "body": "<p>Cycle de livraison. <mark>Quand un livrable passe de 3 jours à 30 min, ce n'est pas un gain de productivité — c'est un changement de nature.</mark></p>" },
    "volume": { "eyebrow": "AXE 4", "title": "Volume", "body": "<p>Capacité à traiter plus de cas avec les mêmes ressources. Sensé seulement si la demande suit.</p>" },
    "qualite": { "eyebrow": "AXE 5", "title": "Qualité", "body": "<p>Erreurs évitées, conformité accrue. Souvent le levier le plus rentable mais le moins visible court terme.</p>" }
  },
  "roi-09": {
    "study-brynjolfsson": { "eyebrow": "BRYNJOLFSSON 2023", "title": "+14 % au support client", "body": "<p>Étude au support client tech. Productivity boost de +14 % en moyenne. <mark>Bénéfice concentré sur les juniors</mark> : +35 % pour eux, négligeable pour les seniors.</p>" },
    "study-copilot": { "eyebrow": "COPILOT 2024", "title": "+26 % vitesse, qualité stable", "body": "<p>Étude GitHub Copilot sur 4867 développeurs. Vitesse de complétion +26 %, sans baisse de qualité du code mergé. Effet plus marqué sur les tâches répétitives.</p>" },
    "study-jagged-positive": { "eyebrow": "JAGGED FRONTIER (+)", "title": "+40 % qualité — dans la frontière", "body": "<p>Dell'Acqua et al. — pour les tâches dans le périmètre de l'IA, gain massif. <mark>+40 % de qualité, +12 % de vitesse.</mark></p>" },
    "study-jagged-negative": { "eyebrow": "JAGGED FRONTIER (-)", "title": "-19 pp — hors frontière", "body": "<p>Mais pour les tâches hors frontière, l'IA induit des erreurs : -19 pp de qualité quand elle est utilisée à mauvais escient. Connaître la frontière est devenu une compétence.</p>" },
    "study-klarna": { "eyebrow": "KLARNA 2024", "title": "Pic communication puis recul", "body": "<p>Cas culte. Klarna communique en 2024 sur le remplacement de 700 agents support. En 2025, recul partiel — recrutement humain repris pour la qualité conversationnelle. <mark>Mesurer le ROI, c'est aussi mesurer ce qu'on sacrifie.</mark></p>" },
    "study-metr": { "eyebrow": "METR 2025", "title": "-19 % sur tâches longues complexes", "body": "<p>METR : sur des tâches d'ingénierie longues (>2h), les développeurs avec IA sont en moyenne 19 % moins productifs — alors qu'ils estiment être plus rapides. Biais d'auto-évaluation massif.</p>" }
  },
  "eval-09": {
    "token-trap": { "eyebrow": "PIÈGE", "title": "Le piège des tokens", "body": "<p>Optimiser ce qu'on facture (tokens consommés) au lieu d'optimiser ce qui crée de la valeur (qualité de la sortie). Pattern classique : on baisse les coûts unitaires mais on régresse sur la qualité, et personne ne le voit.</p>" },
    "cost-bar": { "eyebrow": "COÛT TOTAL", "title": "Coût total d'une eval", "body": "<p>L'évaluation continue d'agents en production a un coût propre — souvent 10-30 % du coût d'inférence de l'agent lui-même. Sujet de l'événement final.</p>" },
    "optim-levers": { "eyebrow": "LEVIERS", "title": "Optimiser sans dégrader", "body": "<p>Sampling, sub-models, caching. Trois leviers pour réduire le coût d'éval sans perdre en signal.</p>" }
  }
}""",
}

# ============================================================================
# Session 4 — Le futur
# ============================================================================

SESSION_4 = {
    "out_filename": "04-le-futur-slideshow.html",
    "title": "Le futur — Session 4 Syllabus CoC Data",
    "description": "Slideshow interactif — Session 4 : Le futur. De Frey-Osborne (47 % d'emplois exposés) à Acemoglu (0,55 % de productivité) — quel scénario pour le CoC ? Bonus narrative-experiences. 10 scènes.",
    "dossier_context": "Syllabus CoC Data — Session 4",
    "canonical_url": "https://mathieugug.github.io/syllabus/04-le-futur-slideshow.html",
    "og_image_url": "https://mathieugug.github.io/ia-et-travail/og.png",
    "svgs": [
        ("travail-01", "ia-et-travail/images/20260504-01-frise-estimations.svg"),
        ("travail-04", "ia-et-travail/images/20260504-04-augmentation-automatisation.svg"),
        ("travail-07", "ia-et-travail/images/20260504-07-quatre-scenarios.svg"),
        ("travail-08", "ia-et-travail/images/20260504-08-six-leviers.svg"),
        ("narr-06",    "narrative-experiences/images/20260505-06-chaine-augmentee.svg"),
    ],
    "scenes_js": r"""[
  { type: 'punchline', title: 'Le futur — Session 4', body: 'De <mark>47 %</mark> d\'emplois exposés (Frey-Osborne 2013) à <mark>0,55 %</mark> de productivité gagnée sur 10 ans (Acemoglu 2024).', attribution: 'L\'écart entre les estimations' },
  { type: 'schema', title: 'L\'écart entre les estimations', schemaId: 'travail-01', steps: [
    { caption: 'Sept estimations majeures de l\'impact emploi/productivité de l\'IA, sur dix ans. L\'écart entre la plus haute et la plus basse est d\'un facteur 100.', highlight: [], dim: [], hidden: [], fullView: true },
    { caption: 'Frey-Osborne 2013 : 47 % d\'emplois exposés à l\'automatisation. Le chiffre fondateur, repris partout.', highlight: ['[data-card="est-frey-osborne"]'], dim: ['[data-card="est-acemoglu"]','[data-card="est-arntz"]','[data-card="est-eloundou"]','[data-card="est-goldman"]','[data-card="est-imf"]','[data-card="est-mckinsey"]'], hidden: [], modalAuto: 'est-frey-osborne' },
    { caption: 'Acemoglu 2024 : 0,55 % de productivité gagnée sur 10 ans. À l\'opposé radical du précédent.', highlight: ['[data-card="est-acemoglu"]'], dim: ['[data-card="est-frey-osborne"]','[data-card="est-arntz"]','[data-card="est-eloundou"]','[data-card="est-goldman"]','[data-card="est-imf"]','[data-card="est-mckinsey"]'], hidden: [], modalAuto: 'est-acemoglu' }
  ]},
  { type: 'schema', title: 'Augmentation vs automatisation', schemaId: 'travail-04', steps: [
    { caption: 'Deux trajectoires opposées. Augmentation : l\'humain + IA fait mieux que l\'humain seul. Automatisation : l\'IA remplace.', highlight: [], dim: [], hidden: [], fullView: true },
    { caption: 'Zone d\'augmentation : tâches où l\'humain reste central, l\'IA l\'amplifie. C\'est le scénario souhaitable pour le CoC.', highlight: ['[data-card="aug-zone"]'], dim: ['[data-card="auto-zone"]'], hidden: [], modalAuto: 'aug-zone' },
    { caption: 'Zone d\'automatisation : tâches où l\'humain disparaît. C\'est le scénario qu\'il faut anticiper, pas subir.', highlight: ['[data-card="auto-zone"]'], dim: ['[data-card="aug-zone"]'], hidden: [], modalAuto: 'auto-zone' }
  ]},
  { type: 'schema', title: 'Quatre scénarios pour 2035', schemaId: 'travail-07', steps: [
    { caption: 'Quatre futurs possibles pour le travail data en 2035. Aucun n\'est certain — chacun se joue par les choix qu\'on fait maintenant.', highlight: [], dim: [], hidden: [], fullView: true },
    { caption: 'Scénario A — Productivité partagée. L\'IA augmente, les gains sont redistribués.', highlight: ['[data-card="scenario-a-partagee"]'], dim: ['[data-card="scenario-b-engels"]','[data-card="scenario-c-plateau"]','[data-card="scenario-c2-stagnation"]','[data-card="scenario-d-rupture"]'], hidden: [], modalAuto: 'scenario-a-partagee' },
    { caption: 'Scénario B — La pause d\'Engels. Les gains restent concentrés, les salaires stagnent une décennie.', highlight: ['[data-card="scenario-b-engels"]'], dim: ['[data-card="scenario-a-partagee"]','[data-card="scenario-c-plateau"]','[data-card="scenario-c2-stagnation"]','[data-card="scenario-d-rupture"]'], hidden: [], modalAuto: 'scenario-b-engels' }
  ]},
  { type: 'schema', title: 'Six leviers d\'action publique (et d\'entreprise)', schemaId: 'travail-08', steps: [
    { caption: 'Six leviers concrets pour orienter le scénario vers A (partagé) plutôt que B (Engels). Applicables à l\'échelle entreprise comme État.', highlight: [], dim: [], hidden: [], fullView: true },
    { caption: 'Levier 2 — Formation. Le levier le plus directement actionnable au niveau d\'un CoC.', highlight: ['[data-card="levier-02-formation"]'], dim: ['[data-card="levier-01-redirection"]','[data-card="levier-03-securisation"]','[data-card="levier-04-partage"]','[data-card="levier-05-gouvernance"]','[data-card="levier-06-territoires"]'], hidden: [], modalAuto: 'levier-02-formation' }
  ]},
  { type: 'punchline', title: 'L\'angle mort', body: '<mark>3 % data storytelling. 7 % livrables clients.</mark> Les vrais angles morts du baromètre — où l\'IA pourrait pourtant tout changer.' },
  { type: 'schema', title: 'Bonus — Narrative experiences augmentées par l\'IA', schemaId: 'narr-06', steps: [
    { caption: 'La chaîne de production de visuels narratifs : 7 étapes. L\'IA peut intervenir à chaque étape — c\'est tout le sujet du dossier narrative-experiences.', highlight: [], dim: [], hidden: [], fullView: true },
    { caption: 'Étape Cadrage — angle, audience, message clé. L\'IA aide à formuler, pas à décider.', highlight: ['[data-card="step-cadrage"]'], dim: ['[data-card="step-donnees"]','[data-card="step-exploration"]','[data-card="step-scenario"]','[data-card="step-production"]','[data-card="step-qa"]','[data-card="step-integration"]'], hidden: [], modalAuto: 'step-cadrage' },
    { caption: 'Étape Production — graphismes, mises en scène. L\'IA accélère le rendu mais ne remplace pas le jugement esthétique.', highlight: ['[data-card="step-production"]'], dim: ['[data-card="step-cadrage"]','[data-card="step-donnees"]','[data-card="step-exploration"]','[data-card="step-scenario"]','[data-card="step-qa"]','[data-card="step-integration"]'], hidden: [], modalAuto: 'step-production' }
  ]},
  { type: 'punchline', title: 'Et après ?', body: 'Le cycle se referme. La prochaine session : <mark>les agents en production.</mark>' },
  { type: 'outro', title: 'Session 4', outroTitle: 'Session 4 — <em>Le futur</em>', body: 'Sept estimations, deux trajectoires, quatre scénarios, six leviers, un angle mort à creuser. Le cycle court se termine — l\'événement final 1h30 attend, ciblé builders.', cta: { href: '05-evenement-final-slideshow.html', label: 'Événement final — Les agents en production' }, secondary: { href: '../narrative-experiences/', label: 'Creuser l\'angle mort — narrative-experiences' } }
]""",
    "schemas_js": r"""{
  "travail-01": {
    "est-frey-osborne": { "eyebrow": "FREY-OSBORNE 2013", "title": "47 % d'emplois exposés à l'automatisation", "body": "<p>Étude fondatrice. Calcul par tâches automatisables. Repris partout, mais largement contesté depuis (méthode jugée trop optimiste sur ce qui est automatisable).</p>" },
    "est-arntz": { "eyebrow": "ARNTZ-GREGORY-ZIERAHN 2016", "title": "9 % seulement (OCDE) — quand on regarde par poste", "body": "<p>Réplication de l'étude Frey-Osborne mais en regardant les postes (pas les tâches isolées). Résultat : 9 %. La méthode de comptage change tout.</p>" },
    "est-mckinsey": { "eyebrow": "MCKINSEY 2017-2024", "title": "60-70 % d'activités potentiellement automatisables", "body": "<p>Approche par activités, pas par emplois. Le chiffre est haut, mais l'horizon est long (2030-2055) et conditionné à de nombreux paramètres (coûts, acceptabilité, régulation).</p>" },
    "est-goldman": { "eyebrow": "GOLDMAN SACHS 2023", "title": "300 millions d'emplois exposés", "body": "<p>L'étude qui a fait la une des médias. Estimation à l'échelle mondiale, GenAI uniquement. <mark>Mais « exposé » ne veut pas dire « supprimé » — beaucoup d'exposés seront augmentés, pas remplacés.</mark></p>" },
    "est-eloundou": { "eyebrow": "ELOUNDOU 2023", "title": "80 % des emplois US affectés à au moins 10 %", "body": "<p>Étude OpenAI/Penn. Mesure plus fine : combien d'emplois ont au moins 10 % de leurs tâches affectées par les LLMs. Le chiffre signale l'ubiquité, pas l'ampleur.</p>" },
    "est-imf": { "eyebrow": "FMI 2024", "title": "40 % des emplois mondiaux exposés", "body": "<p>Étude FMI. Estimation médiane des projections macro. Note importante : 60 % dans les économies avancées, 40 % émergentes — les outils profitent d'abord aux contextes outillés.</p>" },
    "est-acemoglu": { "eyebrow": "ACEMOGLU 2024", "title": "0,55 % de TFP gagné sur 10 ans", "body": "<p>L'estimation la plus pessimiste. Acemoglu (Nobel 2024) modèlise les gains effectifs après diffusion, déploiement, frictions. <mark>L'écart avec Goldman (×100) raconte l'incertitude réelle du débat.</mark></p>" }
  },
  "travail-04": {
    "aug-zone": { "eyebrow": "AUGMENTATION", "title": "L'IA amplifie l'humain", "body": "<p>L'humain reste décideur, l'IA exécute, propose, accélère. Modèle dominant pour le travail data en 2026 : Claude Code en pair programming, copilots BI en assistance.</p>" },
    "auto-zone": { "eyebrow": "AUTOMATISATION", "title": "L'IA remplace l'humain", "body": "<p>Tâches entièrement déléguées : génération de rapports types, classification, première triage. Périmètre qui grandit lentement mais irréversiblement.</p>" },
    "obs-conversational": { "eyebrow": "OBSERVATION", "title": "Conversational tasks plus exposées", "body": "<p>Les tâches conversationnelles (support, rédaction) sont les premières touchées. Pas par hasard — c'est le terrain natif des LLMs.</p>" },
    "obs-onet": { "eyebrow": "DONNÉES O*NET", "title": "Cartographie des activités automatisables", "body": "<p>Base O*NET : 1000 occupations US décomposées en activités. Permet d'évaluer finement quelles activités sont susceptibles d'être automatisées par les outils actuels.</p>" },
    "obs-limites": { "eyebrow": "LIMITES", "title": "Ce que l'IA ne fait pas (encore)", "body": "<p>Décision à fort enjeu, négociation, créativité ouverte, responsabilité juridique. Ces zones restent humaines — pour des raisons techniques, légales, et culturelles.</p>" }
  },
  "travail-07": {
    "scenario-a-partagee": { "eyebrow": "SCÉNARIO A", "title": "Productivité partagée", "body": "<p>L'IA augmente, les gains sont distribués (salaires, formation, temps libre). Scénario souhaitable mais demande des choix politiques actifs.</p>" },
    "scenario-b-engels": { "eyebrow": "SCÉNARIO B", "title": "La pause d'Engels", "body": "<p>Référence historique : 1820-1840 en Angleterre, productivité industrielle qui explose, salaires qui stagnent. Une décennie d'attente avant que les gains ne se diffusent. <mark>Scénario où la valeur est captée par les détenteurs des outils.</mark></p>" },
    "scenario-c-plateau": { "eyebrow": "SCÉNARIO C", "title": "Plateau de productivité", "body": "<p>L'IA n'apporte pas autant qu'espéré. Frictions de déploiement, attentes irréalistes, retour à un usage plus modeste. Scénario probable si on regarde les cycles précédents (Internet, mobile).</p>" },
    "scenario-c2-stagnation": { "eyebrow": "SCÉNARIO C bis", "title": "Stagnation par dette technique", "body": "<p>Variante : l'IA produit du code/contenu en masse, mais la qualité globale baisse. La dette technique l'emporte sur les gains de vitesse. Risque réel pour les CoC qui n'instrumentent pas.</p>" },
    "scenario-d-rupture": { "eyebrow": "SCÉNARIO D", "title": "Rupture — AGI ou choc majeur", "body": "<p>Soit AGI atteint (probabilité faible mais non nulle), soit choc régulatoire ou géopolitique majeur qui change les règles du jeu. Scénario à anticiper sans pouvoir s'y préparer.</p>" }
  },
  "travail-08": {
    "levier-01-redirection": { "eyebrow": "LEVIER 1", "title": "Réorienter la R&D vers l'augmentation", "body": "<p>Choisir consciemment de financer/déployer les usages qui complètent l'humain plutôt que ceux qui le remplacent. Choix politique et éthique avant d'être technique.</p>" },
    "levier-02-formation": { "eyebrow": "LEVIER 2", "title": "Formation continue — actionnable au niveau CoC", "body": "<p>Le seul levier sur lequel un CoC a un contrôle direct. Acculturation, parcours techniques, montée en compétences. <mark>Le syllabus que vous animez est précisément ce levier.</mark></p>" },
    "levier-03-securisation": { "eyebrow": "LEVIER 3", "title": "Sécurisation des transitions", "body": "<p>Filets sociaux, accompagnement des reconversions. Niveau État/branche, pas entreprise.</p>" },
    "levier-04-partage": { "eyebrow": "LEVIER 4", "title": "Partage de la valeur créée", "body": "<p>Mécanismes de redistribution des gains de productivité (salaires, intéressement, temps de travail). Bataille collective.</p>" },
    "levier-05-gouvernance": { "eyebrow": "LEVIER 5", "title": "Gouvernance des modèles fondamentaux", "body": "<p>Régulation à l'échelle mondiale (AI Act EU, Executive Orders US). Lent mais structurant pour ce qui sera autorisé.</p>" },
    "levier-06-territoires": { "eyebrow": "LEVIER 6", "title": "Implantation territoriale", "body": "<p>Éviter la concentration des bénéfices dans quelques métropoles. Levier de cohésion territoriale, pas seulement économique.</p>" }
  },
  "narr-06": {
    "step-cadrage": { "eyebrow": "ÉTAPE 1", "title": "Cadrage — l'angle, l'audience", "body": "<p>L'IA aide à reformuler le brief, à explorer les angles. Mais le choix d'angle reste humain — c'est éditorial avant d'être technique.</p>" },
    "step-donnees": { "eyebrow": "ÉTAPE 2", "title": "Données — collecte, qualité, sources", "body": "<p>L'IA accélère la collecte (scraping, API, parsing) et la vérification de qualité. Vigilance sur la provenance et les biais.</p>" },
    "step-exploration": { "eyebrow": "ÉTAPE 3", "title": "Exploration — patterns, surprises", "body": "<p>L'IA explore largement les patterns possibles. L'humain choisit lesquels valent la peine d'être racontés.</p>" },
    "step-scenario": { "eyebrow": "ÉTAPE 4", "title": "Scénario — arc narratif, dramaturgie", "body": "<p>Construction de l'histoire, choix des moments clés, gestion de la tension. <mark>Zone humaine par excellence</mark> — l'IA propose, l'humain choisit la cohérence.</p>" },
    "step-production": { "eyebrow": "ÉTAPE 5", "title": "Production — graphismes, mises en scène", "body": "<p>L'IA accélère le rendu (SVG, illustrations, animations). Mais la cohérence visuelle, la signature graphique, restent du jugement humain.</p>" },
    "step-qa": { "eyebrow": "ÉTAPE 6", "title": "QA — vérification, accessibilité", "body": "<p>L'IA vérifie l'accessibilité, le contraste, l'orthographe. Filet de sécurité utile mais imparfait.</p>" },
    "step-integration": { "eyebrow": "ÉTAPE 7", "title": "Intégration — diffusion, métriques", "body": "<p>Publication, mesure d'audience, itération. L'IA aide à analyser les retours et à proposer des ajustements.</p>" }
  }
}""",
}

# ============================================================================
# Session 5 — Événement final · Les agents en production (1h30)
# ============================================================================

SESSION_5 = {
    "out_filename": "05-evenement-final-slideshow.html",
    "title": "Événement final — Les agents en production",
    "description": "Slideshow interactif — Événement final 1h30 du syllabus CoC Data : intro syllabus + 2 REX internes (évaluation et observabilité). Cible : builders du CoC (Data Engineers + Data Scientists). 15 scènes.",
    "dossier_context": "Syllabus CoC Data — Final · Builders",
    "canonical_url": "https://mathieugug.github.io/syllabus/05-evenement-final-slideshow.html",
    "og_image_url": "https://mathieugug.github.io/observabilite-agents-ia/og.png",
    "svgs": [
        ("recap-coding",  "coding-agents/images/20260512-01-trois-regimes.svg"),
        ("recap-harness", "harness-agentique/images/20260429-01-anatomie-harness.svg"),
        ("recap-roi",     "measure-roi/images/20260507-01-paradoxe-roi.svg"),
        ("eval-04",       "evaluation-agentique/images/20260501-04-pyramide-metriques.svg"),
        ("eval-05",       "evaluation-agentique/images/20260501-05-llm-as-judge.svg"),
        ("eval-10",       "evaluation-agentique/images/20260501-10-playbook-gruyere.svg"),
        ("obs-02",        "observabilite-agents-ia/images/20260430-02-six-piliers-telemetrie.svg"),
        ("obs-04",        "observabilite-agents-ia/images/20260430-04-anatomie-trace-otel-genai.svg"),
        ("obs-08",        "observabilite-agents-ia/images/20260430-08-echelle-maturite-observabilite.svg"),
    ],
    "scenes_js": r"""[
  { type: 'punchline', title: 'Événement final · 1h30', body: 'Les agents <em>en production</em>.', attribution: 'Cible : Data Engineers + Data Scientists' },
  { type: 'punchline', title: 'Le cycle se referme', body: '4 sessions courtes. Aujourd\'hui : <mark>la mise en production technique</mark>. 2 REX internes, 1 cycle d\'échanges.' },
  /* === Rappels des 3 sessions courtes === */
  { type: 'schema', title: 'Rappel Session 1 — Trois régimes', schemaId: 'recap-coding', steps: [
    { caption: 'Vu en Session 1. Trois régimes successifs : autocomplete (2018), assistant IDE (2022), coding agent (2025). C\'est le saut de régime qui change tout.', highlight: [], dim: [], hidden: [], fullView: true },
    { caption: 'Le régime agent est le seul qui produit du livrable autonome — la PR. Tout le reste s\'organise autour.', highlight: ['[data-card="regime-agent"]'], dim: ['[data-card="regime-autocomplete"]','[data-card="regime-ide"]'], hidden: [], modalAuto: 'regime-agent' }
  ]},
  { type: 'schema', title: 'Rappel Session 2 — Anatomie d\'un harness', schemaId: 'recap-harness', steps: [
    { caption: 'Vu en Session 2. Sept couches : boucle, outils, mémoire, contexte, modèle, observabilité, gouvernance. Aujourd\'hui on zoome sur deux d\'entre elles.', highlight: [], dim: [], hidden: [], fullView: true },
    { caption: 'Observabilité — REX 2 va creuser cette couche. Sans elle, l\'agent en prod est une boîte noire.', highlight: ['[data-card="observabilite"]'], dim: ['[data-card="boucle"]','[data-card="contexte"]','[data-card="modele"]','[data-card="outils"]','[data-card="memoire"]','[data-card="gouvernance"]'], hidden: [], modalAuto: 'observabilite' }
  ]},
  { type: 'schema', title: 'Rappel Session 3 — Le paradoxe ROI', schemaId: 'recap-roi', steps: [
    { caption: 'Vu en Session 3. 95 % des pilotes GenAI sans P&amp;L mesurable. La cause n\'est pas l\'IA — c\'est l\'absence d\'instrumentation.', highlight: [], dim: [], hidden: [], fullView: true },
    { caption: 'Pour mesurer vraiment, il faut instrumenter. C\'est précisément ce que les deux REX vont raconter.', highlight: ['[data-card="echec"]'], dim: ['[data-card="potentiel"]','[data-card="realite"]'], hidden: [], modalAuto: 'echec' }
  ]},
  /* === REX 1 — Évaluation === */
  { type: 'punchline', title: 'REX 1 — Évaluation des agents', body: 'Comment on <mark>juge</mark> un agent en production. Pyramide des métriques, LLM-as-judge, playbook gruyère.', attribution: 'Retour d\'expérience interne · 30 min' },
  { type: 'schema', title: 'Pyramide des métriques d\'évaluation', schemaId: 'eval-04', steps: [
    { caption: 'Cinq niveaux de métriques pour évaluer un agent. Du retrieval au comportement multi-étapes. Chaque niveau a son coût et sa précision.', highlight: [], dim: [], hidden: [], fullView: true },
    { caption: 'Le niveau Agent — où on évalue la trajectoire complète, pas une réponse isolée. Le plus coûteux mais le plus représentatif de la production.', highlight: ['[data-card="level-agent"]'], dim: ['[data-card="level-classical"]','[data-card="level-retrieval"]','[data-card="level-generation"]','[data-card="level-clear"]'], hidden: [], modalAuto: 'level-agent' }
  ]},
  { type: 'schema', title: 'LLM-as-judge — biais, calibration, corrections', schemaId: 'eval-05', steps: [
    { caption: 'Pattern dominant : un LLM juge la sortie d\'un autre LLM. Économique mais piégé : biais de position, biais de longueur, biais d\'auto-préférence.', highlight: [], dim: [], hidden: [], fullView: true },
    { caption: 'Quand ne PAS utiliser LLM-as-judge : critères objectifs (ex : code qui compile), high-stakes (santé, juridique), évaluations à fort enjeu réputationnel.', highlight: ['[data-card="when-not"]'], dim: [], hidden: [], modalAuto: 'when-not' },
    { caption: 'Les biais connus à neutraliser : position, longueur, verbosité, auto-préférence. La calibration humaine reste indispensable au démarrage.', highlight: ['[data-card="biases"]'], dim: [], hidden: [], modalAuto: 'biases' }
  ]},
  { type: 'schema', title: 'Playbook gruyère — 8 étapes, des trous à boucher', schemaId: 'eval-10', steps: [
    { caption: 'Image du gruyère : chaque étape de l\'éval a ses trous. L\'art consiste à aligner les étapes pour que les trous ne se superposent pas.', highlight: [], dim: [], hidden: [], fullView: true },
    { caption: 'Étape 1 — définir le périmètre. Sans périmètre clair, toute mesure est arbitraire.', highlight: ['[data-card="step-1"]'], dim: ['[data-card="step-0"]','[data-card="step-2"]','[data-card="step-3"]'], hidden: [], modalAuto: 'step-1' }
  ]},
  /* === REX 2 — Observabilité === */
  { type: 'punchline', title: 'REX 2 — Observabilité', body: 'Comment on <mark>voit</mark> un agent en production. Six piliers, OpenTelemetry GenAI, échelle de maturité.', attribution: 'Retour d\'expérience interne · 30 min' },
  { type: 'schema', title: 'Six piliers de la télémétrie agentique', schemaId: 'obs-02', steps: [
    { caption: 'Six dimensions à instrumenter : performance, qualité, comportement, drift, usage, gouvernance. Aucune ne suffit seule.', highlight: [], dim: [], hidden: [], fullView: true },
    { caption: 'Drift — le pilier le plus subtil. Le modèle change, les données changent, les comportements dérivent. Sans monitoring drift, on découvre le problème en production.', highlight: ['[data-card="pillar-drift"]'], dim: ['[data-card="pillar-performance"]','[data-card="pillar-qualite"]','[data-card="pillar-comportement"]','[data-card="pillar-usage"]','[data-card="pillar-gouvernance"]'], hidden: [], modalAuto: 'pillar-drift' }
  ]},
  { type: 'schema', title: 'Anatomie d\'une trace OpenTelemetry GenAI', schemaId: 'obs-04', steps: [
    { caption: 'Standard OpenTelemetry GenAI (2025). Trace l\'invocation d\'un agent depuis le chat jusqu\'aux appels d\'outils. Permet de reconstruire toute la trajectoire.', highlight: [], dim: [], hidden: [], fullView: true },
    { caption: 'execute-tool — le span clé. Chaque outil appelé devient un span enfant. Permet de voir où le temps et les tokens s\'évaporent.', highlight: ['[data-card="execute-tool"]'], dim: ['[data-card="chat-1"]','[data-card="chat-2"]','[data-card="invoke-agent"]','[data-card="external-api"]','[data-card="eval-event"]'], hidden: [], modalAuto: 'execute-tool' }
  ]},
  { type: 'schema', title: 'Échelle de maturité observabilité — où est-on ?', schemaId: 'obs-08', steps: [
    { caption: 'Cinq niveaux de maturité. Du logs basiques au cognitive audit trail. La majorité des projets sont à L1-L2.', highlight: [], dim: [], hidden: [], fullView: true },
    { caption: 'L3 — passage critique. C\'est ici qu\'on démarre la vraie évaluation continue. En dessous, on bricole. Au-dessus, on industrialise.', highlight: ['[data-card="maturity-l3"]'], dim: ['[data-card="maturity-l1"]','[data-card="maturity-l2"]','[data-card="maturity-l4"]','[data-card="maturity-l5"]'], hidden: [], modalAuto: 'maturity-l3' }
  ]},
  /* === Échange + outro === */
  { type: 'punchline', title: 'Échange tripartite', body: '<mark>15 minutes</mark> pour vos questions, vos cas, vos blocages. Roadmap CoC à esquisser ensemble.' },
  { type: 'outro', title: 'Lincoln Transform', outroTitle: 'Le cycle <em>se ferme</em>', body: 'Quatre sessions, un événement final. Reste à transformer ce savoir en pratique : pilotes, instrumentation, mesure. La balle est dans votre camp.', cta: { href: 'index.html', label: 'Revenir au hub du syllabus' }, secondary: { href: 'syllabus.md', label: 'Document maître' } }
]""",
    "schemas_js": r"""{
  /* === RAPPELS — modaux ultra-courts === */
  "recap-coding": {
    "regime-agent": { "eyebrow": "RAPPEL S1", "title": "Régime 3 — Coding agent", "body": "<p>Accès au système de fichiers, boucle de plusieurs minutes, livrable en pull request. <mark>Le délégué.</mark></p>" },
    "regime-autocomplete": { "eyebrow": "RAPPEL S1", "title": "Régime 1 — Autocomplete", "body": "<p>L'outil prédit la suite du curseur. Latence en millisecondes.</p>" },
    "regime-ide": { "eyebrow": "RAPPEL S1", "title": "Régime 2 — Assistant IDE", "body": "<p>Le contexte s'élargit au fichier. Réponse ou patch local.</p>" }
  },
  "recap-harness": {
    "boucle": { "eyebrow": "RAPPEL S2", "title": "La boucle", "body": "<p>Think -> act -> observe.</p>" },
    "observabilite": { "eyebrow": "RAPPEL S2 -> AUJOURD'HUI", "title": "L'observabilité", "body": "<p>Couche critique pour la production. <mark>REX 2 va y consacrer 30 minutes.</mark></p>" },
    "outils": { "eyebrow": "RAPPEL S2", "title": "Les outils", "body": "<p>Le langage que l'agent parle au monde. MCP standardise.</p>" },
    "memoire": { "eyebrow": "RAPPEL S2", "title": "La mémoire", "body": "<p>Ce qui survit d'un cycle au suivant.</p>" },
    "modele": { "eyebrow": "RAPPEL S2", "title": "Le modèle", "body": "<p>Le moteur — plus la pièce critique.</p>" },
    "contexte": { "eyebrow": "RAPPEL S2", "title": "Le contexte", "body": "<p>La fenêtre de raisonnement.</p>" },
    "gouvernance": { "eyebrow": "RAPPEL S2", "title": "La gouvernance", "body": "<p>Permissions et escalades.</p>" }
  },
  "recap-roi": {
    "echec": { "eyebrow": "RAPPEL S3 -> AUJOURD'HUI", "title": "95 % de pilotes sans P&L mesurable", "body": "<p>La cause : <mark>absence d'instrumentation.</mark> Que les deux REX vont précisément combler.</p>" },
    "potentiel": { "eyebrow": "RAPPEL S3", "title": "2,6-4,4 trillions $/an", "body": "<p>Le potentiel annoncé McKinsey.</p>" },
    "realite": { "eyebrow": "RAPPEL S3", "title": "L'écart", "body": "<p>Pilotes nombreux, P&amp;L muet.</p>" }
  },
  /* === REX 1 — Évaluation === */
  "eval-04": {
    "level-agent": { "eyebrow": "NIVEAU CRITIQUE", "title": "Niveau Agent — la trajectoire complète", "body": "<p>Le niveau le plus représentatif de la production. On évalue toute la session : décisions intermédiaires, choix d'outils, qualité du livrable final. <mark>Coûteux mais incontournable</mark> pour un agent en production.</p>" },
    "level-classical": { "eyebrow": "NIVEAU 1", "title": "Métriques classiques", "body": "<p>Précision, rappel, F1. Adapté aux tâches discrètes (classification, NER) — peu adapté aux trajectoires d'agents.</p>" },
    "level-retrieval": { "eyebrow": "NIVEAU 2", "title": "Métriques retrieval", "body": "<p>Mesure la qualité du RAG : recall@k, MRR, NDCG. Essentiel quand l'agent puise dans une base de connaissances.</p>" },
    "level-generation": { "eyebrow": "NIVEAU 3", "title": "Métriques de génération", "body": "<p>Qualité du texte produit : coherence, factualité, style. Demande des juges (humains ou LLM).</p>" },
    "level-clear": { "eyebrow": "NIVEAU 4", "title": "Métriques claires (CLEAR)", "body": "<p>Critères explicites : la sortie est-elle conforme aux exigences ? Mesurable de façon binaire ou par grille.</p>" }
  },
  "eval-05": {
    "judge-model": { "eyebrow": "PATTERN", "title": "Le judge — un LLM qui en juge un autre", "body": "<p>Pattern économique mais piégé. Demande calibration humaine au démarrage et monitoring continu (les biais évoluent avec les versions du modèle).</p>" },
    "biases": { "eyebrow": "ATTENTION", "title": "Les biais à neutraliser", "body": "<p>Position (l'option A est préférée), longueur (les longues réponses gagnent), auto-préférence (le judge préfère son propre style), verbosité. <mark>Sans corrections, le judge ment.</mark></p>" },
    "when-not": { "eyebrow": "QUAND NE PAS", "title": "Cas où LLM-as-judge n'a pas sa place", "body": "<p>Critères objectifs (le code compile-t-il ?), high-stakes (santé, juridique), évaluations à fort enjeu réputationnel. Préférer alors des juges déterministes ou humains.</p>" },
    "mode-pointwise": { "eyebrow": "MODE", "title": "Pointwise — note absolue", "body": "<p>Le judge note chaque sortie indépendamment, sur une échelle. Simple mais peu robuste aux dérives d'échelle.</p>" },
    "mode-pairwise": { "eyebrow": "MODE", "title": "Pairwise — A ou B", "body": "<p>Le judge compare deux sorties. Plus fiable car relatif, mais coûte O(n²) en évaluations.</p>" },
    "mode-listwise": { "eyebrow": "MODE", "title": "Listwise — classement", "body": "<p>Le judge ordonne plusieurs sorties. Compromis pairwise/pointwise.</p>" },
    "mode-reference": { "eyebrow": "MODE", "title": "Reference-based", "body": "<p>Le judge compare à une réponse de référence. Précis mais demande une vérité de terrain.</p>" }
  },
  "eval-10": {
    "step-1": { "eyebrow": "ÉTAPE 1", "title": "Définir le périmètre", "body": "<p>Quel est l'agent ? Quels sont ses inputs ? Quelles sont les sorties attendues ? <mark>Sans périmètre, toute mesure est arbitraire.</mark></p>" },
    "step-0": { "eyebrow": "ÉTAPE 0", "title": "Préalable — la spec", "body": "<p>Avant tout, un jeu d'exemples canoniques validés humainement. La base de toute évaluation.</p>" },
    "step-2": { "eyebrow": "ÉTAPE 2", "title": "Construire le dataset d'éval", "body": "<p>Cas faciles, cas pénibles, cas adverses. Représentativité du trafic réel.</p>" },
    "step-3": { "eyebrow": "ÉTAPE 3", "title": "Choisir les métriques", "body": "<p>Sortie objective ? Métriques classiques. Sortie générative ? Judges. Trajectoire ? Métriques agent.</p>" }
  },
  /* === REX 2 — Observabilité === */
  "obs-02": {
    "pillar-drift": { "eyebrow": "PILIER SUBTIL", "title": "Drift — la dérive silencieuse", "body": "<p>Le modèle change (mises à jour fournisseur), les données changent (saisons, marchés), les comportements dérivent. Sans monitoring drift, <mark>on découvre le problème en production</mark>, après les incidents.</p>" },
    "pillar-performance": { "eyebrow": "PILIER", "title": "Performance — latence et coût", "body": "<p>Latence par étape, coût par requête. Première ligne de défense — l'utilisateur ressent immédiatement.</p>" },
    "pillar-qualite": { "eyebrow": "PILIER", "title": "Qualité — pertinence des sorties", "body": "<p>Évaluation continue (couplée au pilier eval). Pas de mesure -> pas de boucle d'amélioration.</p>" },
    "pillar-comportement": { "eyebrow": "PILIER", "title": "Comportement — patterns d'usage", "body": "<p>Quels outils l'agent utilise le plus ? Quelle est la longueur moyenne des trajectoires ? Indicateur de design.</p>" },
    "pillar-usage": { "eyebrow": "PILIER", "title": "Usage — qui utilise quoi", "body": "<p>Volumes par utilisateur, par cas d'usage. Permet de détecter les abus et les sous-usages.</p>" },
    "pillar-gouvernance": { "eyebrow": "PILIER", "title": "Gouvernance — qui a accès, qui a fait quoi", "body": "<p>Audit trail. Indispensable pour les contextes régulés (santé, finance) et pour la conformité RGPD.</p>" }
  },
  "obs-04": {
    "execute-tool": { "eyebrow": "SPAN CLÉ", "title": "execute-tool — où le temps s'évapore", "body": "<p>Chaque outil appelé devient un span enfant. <mark>Permet de voir où le temps et les tokens s'évaporent</mark> — souvent c'est un appel d'outil lent ou un retry caché qui plombe.</p>" },
    "invoke-agent": { "eyebrow": "SPAN", "title": "invoke-agent — l'invocation racine", "body": "<p>Le span racine de toute la trace. Toutes les actions de l'agent en sont les descendants.</p>" },
    "chat-1": { "eyebrow": "SPAN", "title": "chat — l'appel LLM", "body": "<p>Un span par appel au modèle. Permet de chiffrer combien de tokens à chaque cycle.</p>" },
    "chat-2": { "eyebrow": "SPAN", "title": "chat suivant — la répétition", "body": "<p>L'agent rappelle le LLM autant de fois que la boucle l'exige. Visibilité directe sur la profondeur de raisonnement.</p>" },
    "external-api": { "eyebrow": "SPAN", "title": "external-api — appel sortant", "body": "<p>Quand l'agent contacte une API externe (RAG, base, service). Souvent le maillon faible en latence.</p>" },
    "eval-event": { "eyebrow": "EVENT", "title": "eval-event — évaluation continue", "body": "<p>Émission d'un événement d'évaluation (judge, métrique). Couple eval et observabilité.</p>" }
  },
  "obs-08": {
    "maturity-l1": { "eyebrow": "L1", "title": "Logs basiques", "body": "<p>On enregistre les inputs/outputs. Indispensable, insuffisant.</p>" },
    "maturity-l2": { "eyebrow": "L2", "title": "Métriques agrégées", "body": "<p>Latence, taux d'erreur, coûts. Vue d'ensemble mais aveugle au détail.</p>" },
    "maturity-l3": { "eyebrow": "L3 — PALIER", "title": "Évaluation continue", "body": "<p>Judges automatiques, datasets de régression. <mark>C'est ici que la vraie observabilité commence.</mark> En dessous on bricole, au-dessus on industrialise.</p>" },
    "maturity-l4": { "eyebrow": "L4", "title": "Cognitive trace", "body": "<p>Reconstruction du raisonnement. Pourquoi l'agent a fait ce choix ? Permet le debug profond.</p>" },
    "maturity-l5": { "eyebrow": "L5", "title": "Cognitive audit trail", "body": "<p>Audit complet de la cognition de l'agent — pour les contextes les plus régulés. État de l'art 2026.</p>" }
  }
}""",
}

SESSIONS = {2: SESSION_2, 3: SESSION_3, 4: SESSION_4, 5: SESSION_5}


def main():
    if len(sys.argv) < 2:
        print("Usage: python tools/build_syllabus_slideshow.py <session-number> [--force]")
        sys.exit(1)
    n = int(sys.argv[1])
    force = "--force" in sys.argv[2:]
    if n not in SESSIONS:
        print(f"Session {n} not implemented. Available: {sorted(SESSIONS)}")
        sys.exit(1)
    build_session(SESSIONS[n], force=force)


if __name__ == "__main__":
    main()
