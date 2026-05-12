#!/usr/bin/env python3
"""Build syllabus slideshow N from the T8 (Session 1) slideshow as base.

Token-efficient: cp T8 → T<N>, then surgical regex replacements
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
      { caption: 'La boucle — c\'est le cœur. Think → Act → Observe, en cycles successifs jusqu\'à la complétion.', highlight: ['[data-card="boucle"]'], dim: ['[data-card="contexte"]','[data-card="modele"]','[data-card="outils"]','[data-card="memoire"]','[data-card="observabilite"]','[data-card="gouvernance"]'], hidden: [], modalAuto: 'boucle' },
      { caption: 'Les outils — ce que l\'agent peut faire au monde extérieur (lire un fichier, exécuter du code, appeler une API).', highlight: ['[data-card="outils"]'], dim: ['[data-card="boucle"]','[data-card="contexte"]','[data-card="modele"]','[data-card="memoire"]','[data-card="observabilite"]','[data-card="gouvernance"]'], hidden: [], modalAuto: 'outils' },
      { caption: 'La mémoire — ce qui survit d\'un cycle au suivant. Critère structurant pour distinguer un assistant d\'un délégué.', highlight: ['[data-card="memoire"]'], dim: ['[data-card="boucle"]','[data-card="contexte"]','[data-card="modele"]','[data-card="outils"]','[data-card="observabilite"]','[data-card="gouvernance"]'], hidden: [], modalAuto: 'memoire' }
    ]
  },
  /* 04 — Boucle GAN (harness-02) — LE pivot */
  {
    type: 'schema',
    title: 'Boucle agentique — think → act → observe',
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
      "eyebrow": "PIVOT", "title": "La boucle — think → act → observe",
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
      "body": "<p>Tout ce que l'agent « voit » à un instant T : prompt système, historique de conversation, fichiers en cache, retours d'outils. Limite physique du modèle (200k → 1M tokens en 2026).</p><p>Bien gérer le contexte = sélectionner ce qui entre, compresser ce qui s'accumule. C'est l'art du <em>context engineering</em>.</p>"
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

def build_session(cfg: dict) -> None:
    target = REPO / "syllabus" / cfg["out_filename"]
    if not target.exists():
        # cp from T8 base
        base = REPO / "syllabus" / "01-le-present-slideshow.html"
        target.write_bytes(base.read_bytes())
        print(f"[cp] {base.name} → {target.name}")

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

    target.write_text(text, encoding="utf-8")
    print(f"[ok] wrote {target}")


SESSIONS = {2: SESSION_2}


def main():
    if len(sys.argv) < 2:
        print("Usage: python tools/build_syllabus_slideshow.py <session-number>")
        sys.exit(1)
    n = int(sys.argv[1])
    if n not in SESSIONS:
        print(f"Session {n} not implemented. Available: {sorted(SESSIONS)}")
        sys.exit(1)
    build_session(SESSIONS[n])


if __name__ == "__main__":
    main()
