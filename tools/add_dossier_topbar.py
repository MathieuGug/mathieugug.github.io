"""One-shot script: add a sticky topbar (Mathieu / Hub / Accueil) to all
deep-research app pages. Idempotent.

Pages targeted: every `*-app.html` under a dossier folder. Slideshows and
the journal already have a topbar; they're updated separately.

Run from repo root:
    python tools/add_dossier_topbar.py
"""

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent

APPS = [
    "agents-computer-use/20260502-agents-computer-use-app.html",
    "coding-agents/20260512-coding-agents-app.html",
    "economie-inference/20260506-economie-inference-app.html",
    "evaluation-agentique/20260501-evaluation-agentique-app.html",
    "harness-agentique/20260429-harness-agentique-app.html",
    "ia-et-travail/20260504-ia-et-travail-app.html",
    "llm-jailbreaking/20260428-llm-jailbreaking-report-app.html",
    "mcp-plateforme/20260508-mcp-plateforme-app.html",
    "measure-roi/20260507-roi-ia-generative-agentique-app.html",
    "memoire-agentique/20260430-memoire-agentique-app.html",
    "modeles-raisonnement/20260506-modeles-raisonnement-app.html",
    "narrative-experiences/20260505-narrative-experiences-app.html",
    "observabilite-agents-ia/20260430-observabilite-agents-ia-app.html",
    "proces-musk-altman/20260427-proces-musk-altman-app.html",
    "world-models/20260505-world-models-app.html",
]

CSS_BLOCK = """    /* === Sticky topbar — Mathieu / Hub / Accueil === */
    .topbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 60;
      height: 56px; padding: 12px 28px;
      display: flex; align-items: center; justify-content: space-between; gap: 24px;
      background: rgba(250,248,243,0.82);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      border-bottom: 1px solid transparent;
      transition: border-color 0.3s;
    }
    .topbar.scrolled { border-bottom-color: var(--rule); }
    .topbar > a { font-family: var(--serif); font-weight: 500; font-size: 15.5px; letter-spacing: -0.01em; text-decoration: none; color: var(--ink); flex-shrink: 0; }
    .topbar em { font-style: italic; color: var(--carmine); }
    .topbar .back { font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--graphite); text-decoration: none; }
    .topbar .back:hover { color: var(--carmine); }
    .topbar .back-nav { display: inline-flex; align-items: center; gap: 14px; flex-shrink: 0; }
    .topbar .back-sep { font-family: var(--mono); font-size: 9.5px; color: var(--graphite); user-select: none; }
    @media (max-width: 560px) {
      .topbar { padding: 10px 14px; gap: 8px; }
      .topbar > a { font-size: 13px; }
      .topbar .back { font-size: 9px; letter-spacing: 0.16em; }
      .topbar .back-nav { gap: 10px; }
    }
    @media (max-width: 380px) {
      .topbar > a:first-child em { display: none; }
    }
    body { padding-top: 56px; }

    """

TOPBAR_HTML = """  <header class="topbar" id="topbar">
    <a href="../index.html">Mathieu <em>Guglielmino</em></a>
    <nav class="back-nav" aria-label="Navigation retour">
      <a href="index.html" class="back" title="Revenir au hub du dossier">← Hub</a>
      <span class="back-sep" aria-hidden="true">·</span>
      <a href="../index.html#series" class="back" title="Revenir à l'accueil">Accueil</a>
    </nav>
  </header>
"""

SCROLL_JS = """<script>
(function(){var b=document.getElementById('topbar');if(!b)return;window.addEventListener('scroll',function(){b.classList.toggle('scrolled',window.scrollY>4);},{passive:true});})();
</script>
"""

OLD_BACK_LINE = '      <a class="back" href="../index.html#series">← Retour aux dossiers</a>\n'


def transform(content: str) -> tuple[str, bool]:
    if 'class="topbar"' in content:
        return content, False  # already done

    # 1. Inject CSS before the multi-line "header.site {" rule. We anchor on
    # newline+4-spaces+rule+newline so we don't match the @media single-liner.
    css_anchor = "\n    header.site {\n"
    if content.count(css_anchor) != 1:
        raise RuntimeError(f"expected exactly one header.site rule, got {content.count(css_anchor)}")
    content = content.replace(css_anchor, "\n" + CSS_BLOCK + "header.site {\n", 1)

    # 2. Update sticky top
    content = content.replace(
        "position: sticky; top: 0; align-self: start;",
        "position: sticky; top: 56px; align-self: start;",
    )

    # 3. Update sticky height — both single-line and multi-line
    content = content.replace("height: 100vh", "height: calc(100vh - 56px)")

    # 4. Insert topbar after <body>
    body_anchor = "<body>\n  <div class=\"layout\">"
    if content.count(body_anchor) != 1:
        raise RuntimeError(f"expected exactly one body+layout anchor, got {content.count(body_anchor)}")
    content = content.replace(body_anchor, "<body>\n" + TOPBAR_HTML + "  <div class=\"layout\">", 1)

    # 5. Remove old back link
    if content.count(OLD_BACK_LINE) != 1:
        raise RuntimeError(f"expected exactly one old back link, got {content.count(OLD_BACK_LINE)}")
    content = content.replace(OLD_BACK_LINE, "", 1)

    # 6. Inject scroll JS before </body>
    if SCROLL_JS not in content:
        content = content.replace("</body>", SCROLL_JS + "</body>", 1)

    return content, True


def main() -> int:
    only = sys.argv[1] if len(sys.argv) > 1 else None
    changed = 0
    for rel in APPS:
        if only and only not in rel:
            continue
        path = ROOT / rel
        if not path.exists():
            print(f"missing: {rel}", file=sys.stderr)
            continue
        original = path.read_text(encoding="utf-8")
        try:
            new_content, did_change = transform(original)
        except RuntimeError as e:
            print(f"FAIL {rel}: {e}", file=sys.stderr)
            return 1
        if did_change:
            path.write_text(new_content, encoding="utf-8", newline="\n")
            print(f"updated: {rel}")
            changed += 1
        else:
            print(f"already done: {rel}")
    print(f"\n{changed} file(s) updated")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
