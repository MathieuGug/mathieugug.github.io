"""Build the livre hub : inline the 4 acte SVG infographies into livre/index.html.

Reads livre/index.template.html, finds the 4 markers `<!-- SVG_ACTE_{1,2,3,4} -->`,
substitutes each with the corresponding SVG content (stripped of the <?xml ?> declaration
if present). Writes the result to livre/index.html. Idempotent.

Re-run after any change to the template or to one of the 4 acte SVGs.
"""

import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Template lives under tools/ (not livre/) so the SEO sweep does not pollute
# it and GitHub Pages does not serve it as a public page.
TEMPLATE = os.path.join(ROOT, "tools", "livre.template.html")
OUTPUT = os.path.join(ROOT, "livre", "index.html")

SVG_FILES = {
    "1": os.path.join(ROOT, "livre", "images", "20260601-acte1-moteurs-infographie.svg"),
    "2": os.path.join(ROOT, "livre", "images", "20260601-acte2-boucle-infographie.svg"),
    "3": os.path.join(ROOT, "livre", "images", "20260601-acte3-interfaces-infographie.svg"),
    "4": os.path.join(ROOT, "livre", "images", "20260601-acte4-mesures-garde-fous-infographie.svg"),
}


def load_svg(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    # Strip XML declaration if present (e.g. <?xml version="1.0"?>)
    content = re.sub(r"^\s*<\?xml[^>]*\?>\s*", "", content)
    return content.strip()


def main():
    if not os.path.exists(TEMPLATE):
        raise SystemExit("Missing template: " + TEMPLATE)

    with open(TEMPLATE, "r", encoding="utf-8") as f:
        html = f.read()

    for num, path in SVG_FILES.items():
        marker = "<!-- SVG_ACTE_{} -->".format(num)
        if marker not in html:
            raise SystemExit("Marker not found in template: " + marker)
        svg = load_svg(path)
        # Preserve indentation of the marker line so the SVG sits cleanly
        html = html.replace(marker, svg)

    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write(html)
    print("Built {} bytes -> {}".format(len(html), OUTPUT))


if __name__ == "__main__":
    main()
