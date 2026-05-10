"""Second pass: add dossier title (.dossier-context) to every existing topbar.

Targets: 14 apps + 4 slideshows + 1 journal. Uses each dossier hub's
og:title as the source of truth, stripping any " — N formats" suffix.

Run from repo root:
    python tools/add_topbar_dossier_title.py
"""

from pathlib import Path
import re
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

SLIDESHOWS = [
    "coding-agents/20260512-coding-agents-slideshow.html",
    "ia-et-travail/20260507-ia-et-travail-slideshow.html",
    "measure-roi/20260507-roi-ia-generative-agentique-slideshow.html",
    "narrative-experiences/20260505-narrative-experiences-slideshow.html",
    "observabilite-agents-ia/20260505-observabilite-agents-ia-slideshow.html",
]

OTHER = [
    "proces-musk-altman/journal.html",
]

ALL_PAGES = APPS + SLIDESHOWS + OTHER


def get_dossier_title(folder: str) -> str:
    """Read og:title from a dossier hub and clean it."""
    hub = ROOT / folder / "index.html"
    text = hub.read_text(encoding="utf-8")
    m = re.search(r'property="og:title"\s+content="([^"]+)"', text)
    if not m:
        raise RuntimeError(f"no og:title in {hub}")
    title = m.group(1)
    # Strip " — anything" suffix
    title = re.split(r"\s+—\s+", title, maxsplit=1)[0]
    return title.strip()


CSS_DOSSIER_RULE = ".topbar .dossier-context { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.22em; text-transform: uppercase; opacity: 0.55; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 320px; flex-shrink: 1; min-width: 0; }"
CSS_DOSSIER_MEDIA = "@media (max-width: 768px) { .topbar .dossier-context { display: none; } }"


def transform(content: str, title: str) -> tuple[str, bool]:
    if 'class="dossier-context"' in content:
        return content, False  # already done

    # 1. Inject CSS rule. Anchor on the line containing ".topbar .back-nav"
    # so we capture and preserve its leading whitespace.
    css_re = re.compile(r"^([ \t]*)\.topbar \.back-nav \{ display: inline-flex;", re.MULTILINE)
    matches = list(css_re.finditer(content))
    if len(matches) != 1:
        raise RuntimeError(f"expected exactly one back-nav CSS line, got {len(matches)}")
    m = matches[0]
    indent = m.group(1)
    insertion = f"{indent}{CSS_DOSSIER_RULE}\n{indent}{CSS_DOSSIER_MEDIA}\n"
    # Insert before the matched line (keep the matched text intact).
    content = content[: m.start()] + insertion + content[m.start():]

    # 2. Insert the <span class="dossier-context"> right after the Mathieu <a>.
    # Pattern matches both apps' indent (4 spaces) and slideshow/journal indent (2 spaces).
    pattern = re.compile(
        r'(<a href="\.\./index\.html">Mathieu <em>Guglielmino</em></a>)\n(\s+)'
    )
    matches = list(pattern.finditer(content))
    if len(matches) != 1:
        raise RuntimeError(f"expected exactly one Mathieu link, got {len(matches)}")
    m = matches[0]
    indent = m.group(2)
    replacement = (
        f'{m.group(1)}\n'
        f'{indent}<span class="dossier-context">{title}</span>\n'
        f'{indent}'
    )
    content = content[: m.start()] + replacement + content[m.end():]
    return content, True


def main() -> int:
    only = sys.argv[1] if len(sys.argv) > 1 else None
    changed = 0
    for rel in ALL_PAGES:
        if only and only not in rel:
            continue
        path = ROOT / rel
        if not path.exists():
            print(f"missing: {rel}", file=sys.stderr)
            continue
        folder = rel.split("/")[0]
        title = get_dossier_title(folder)
        original = path.read_text(encoding="utf-8")
        try:
            new_content, did_change = transform(original, title)
        except RuntimeError as e:
            print(f"FAIL {rel}: {e}", file=sys.stderr)
            return 1
        if did_change:
            path.write_text(new_content, encoding="utf-8", newline="\n")
            print(f"updated: {rel}  ->  {title}")
            changed += 1
        else:
            print(f"already done: {rel}")
    print(f"\n{changed} file(s) updated")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
