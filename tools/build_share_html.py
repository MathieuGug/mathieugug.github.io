#!/usr/bin/env python3
"""Build a self-contained share version of a dossier HTML app.

Reads an existing dossier HTML (designed to be served on GitHub Pages with
absolute paths like /assets/dossier-app.css and /coding-agents/images/*.svg),
and produces a self-contained sibling HTML with:

- /assets/dossier-app.css → inlined into a <style> block
- /assets/dossier-app.js  → inlined into a <script> block
- <img src="/<dossier>/images/foo.svg"> → inlined as data:image/svg+xml;base64 URIs
- <img src="images/foo.svg"> (relative) → inlined as data:image/svg+xml;base64 URIs
- data-svg-src attributes (used by the callout zoom modal) → also rewritten to
  data: URIs so the modal still opens without a network fetch

External resources NOT inlined (kept as-is): Google Fonts, OG/social images,
canonical URLs, links to other dossier hubs (these remain absolute paths under
mathieugug.github.io with target=_blank so a reader who clicks reaches the
canonical version).

Usage :
    python tools/build_share_html.py analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html

Output : sibling file with -share suffix
    analytics-agentique-gcp/20260519-analytics-agentique-gcp-app-share.html
"""
from __future__ import annotations

import argparse
import base64
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent


def encode_svg(svg_path: Path) -> str:
    data = svg_path.read_bytes()
    b64 = base64.b64encode(data).decode("ascii")
    return f"data:image/svg+xml;base64,{b64}"


def resolve_url(url: str, html_dir: Path) -> Path | None:
    """Resolve an absolute (/foo) or relative (foo, images/foo) URL to a repo path."""
    if url.startswith("http://") or url.startswith("https://") or url.startswith("data:"):
        return None
    if url.startswith("/"):
        return REPO_ROOT / url.lstrip("/")
    # relative to the HTML file
    return (html_dir / url).resolve()


def inline_external_assets(html: str, html_path: Path) -> tuple[str, dict[str, int]]:
    """Inline CSS, JS, SVG references."""
    html_dir = html_path.parent
    counts: dict[str, int] = {"css": 0, "js": 0, "svg_img": 0, "svg_data_attr": 0, "missing": 0}

    # 1) <link rel="stylesheet" href="..."> → <style>...</style>
    def repl_link(m: re.Match) -> str:
        url = m.group(1)
        target = resolve_url(url, html_dir)
        if target is None or not target.exists():
            counts["missing"] += 1
            return m.group(0)
        css = target.read_text(encoding="utf-8")
        counts["css"] += 1
        return f"<style data-inlined-from=\"{url}\">\n{css}\n</style>"

    html = re.sub(
        r'<link\s+rel="stylesheet"\s+href="([^"]+)"\s*/?>',
        repl_link,
        html,
    )

    # 2) <script src="..."> → <script>...</script>
    def repl_script(m: re.Match) -> str:
        attrs_before = m.group(1) or ""
        url = m.group(2)
        attrs_after = m.group(3) or ""
        target = resolve_url(url, html_dir)
        if target is None or not target.exists():
            counts["missing"] += 1
            return m.group(0)
        js = target.read_text(encoding="utf-8")
        counts["js"] += 1
        # Drop defer/async since we're inlining (script runs in document order anyway).
        merged_attrs = (attrs_before + " " + attrs_after).strip()
        merged_attrs = re.sub(r"\b(defer|async)\b", "", merged_attrs).strip()
        prefix = f" {merged_attrs}" if merged_attrs else ""
        return f"<script{prefix} data-inlined-from=\"{url}\">\n{js}\n</script>"

    html = re.sub(
        r'<script([^>]*?)\s+src="([^"]+)"([^>]*?)>\s*</script>',
        repl_script,
        html,
    )

    # 3) <img ... src="...svg" ...> → src="data:image/svg+xml;base64,..."
    def repl_img_svg(m: re.Match) -> str:
        prefix = m.group(1)
        url = m.group(2)
        suffix = m.group(3)
        if url.endswith(".svg"):
            target = resolve_url(url, html_dir)
            if target and target.exists():
                data_uri = encode_svg(target)
                counts["svg_img"] += 1
                return f'<img{prefix}src="{data_uri}"{suffix}>'
        return m.group(0)

    html = re.sub(
        r'<img([^>]*?)\s+src="([^"]+)"([^>]*?)>',
        repl_img_svg,
        html,
    )

    # 4) data-svg-src="...svg" → data-svg-src="data:image/svg+xml;base64,..."
    def repl_data_attr(m: re.Match) -> str:
        url = m.group(1)
        target = resolve_url(url, html_dir)
        if target and target.exists() and url.endswith(".svg"):
            counts["svg_data_attr"] += 1
            return f'data-svg-src="{encode_svg(target)}"'
        return m.group(0)

    html = re.sub(
        r'data-svg-src="([^"]+\.svg)"',
        repl_data_attr,
        html,
    )

    # 5) Anchor links to other dossier hubs /<slug>/ → keep but add absolute URL
    # so a reader who clicks reaches the canonical version online.
    def repl_anchor(m: re.Match) -> str:
        slug = m.group(1)
        return f'href="https://mathieugug.github.io/{slug}/" target="_blank" rel="noopener"'

    html = re.sub(
        r'href="/(coding-agents|surfaces-agentiques|mcp-plateforme|observabilite-agents-ia|evaluation-agentique|narrative-experiences|gouvernance|measure-roi|anatomie|proces-musk-altman|agent-sdk|analytics-agentique-gcp|llm-jailbreaking|agents-computer-use|ia-et-travail|veille-presse|syllabus)/"',
        repl_anchor,
        html,
    )

    # 6) Anchor links to other dossier HTML files (e.g. -rapport.md or sub-HTML pages)
    # are LEFT as relative paths to the dossier root. Less common, so we keep them.

    # 7) Banner indicating this is a share copy
    banner = (
        '\n<!-- ============================================================\n'
        '     SELF-CONTAINED SHARE VERSION\n'
        '     Generated by tools/build_share_html.py.\n'
        '     All CSS, JS and SVG assets are inlined.\n'
        '     Source : ' + html_path.relative_to(REPO_ROOT).as_posix() + '\n'
        '============================================================ -->\n'
    )
    html = html.replace("<!DOCTYPE html>", "<!DOCTYPE html>" + banner, 1)

    return html, counts


def main() -> int:
    parser = argparse.ArgumentParser(description="Build a self-contained share HTML.")
    parser.add_argument("source", help="Path to the source HTML (e.g. analytics-agentique-gcp/20260519-...-app.html)")
    parser.add_argument("--output", "-o", help="Output path. Defaults to <source>-share.html in the same folder.")
    args = parser.parse_args()

    src = Path(args.source).resolve()
    if not src.exists():
        sys.stderr.write(f"Source not found: {src}\n")
        return 1
    if args.output:
        dst = Path(args.output).resolve()
    else:
        dst = src.with_name(src.stem + "-share.html")

    html = src.read_text(encoding="utf-8")
    out, counts = inline_external_assets(html, src)
    dst.write_text(out, encoding="utf-8")

    size_kb = dst.stat().st_size / 1024
    sys.stdout.write(
        f"Wrote {dst.relative_to(REPO_ROOT).as_posix()}\n"
        f"  inlined : {counts['css']} CSS, {counts['js']} JS, "
        f"{counts['svg_img']} SVG (img.src), {counts['svg_data_attr']} SVG (data-svg-src)\n"
        f"  missing : {counts['missing']}\n"
        f"  size    : {size_kb:.1f} KB\n"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
