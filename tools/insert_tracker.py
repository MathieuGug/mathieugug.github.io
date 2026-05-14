#!/usr/bin/env python3
"""Insert a probability tracker SVG into each entry of journal.html.

Each tracker shows the cumulative win-probability curve UP TO that entry's date,
with the latest day highlighted. The schema viewBox is 1080x240; plot area is
[80,1020] x [80,180] (60% range, linear).
"""
import re
from pathlib import Path

PATH = Path("/home/user/mathieugug.github.io/proces-musk-altman/journal.html")

# Probability series (Mathieu's estimate)
# Day number -> (x, P%, label)
DATA = [
    ("01", 80,  35, "ven 1 mai"),
    ("02", 151, 22, "sam 2 mai"),
    ("03", 222, 20, "dim 3 mai"),
    ("04", 292, 23, "lun 4 mai"),
    ("05", 363, 28, "mar 5 mai"),
    ("06", 434, 24, "mer 6 mai"),
    ("07", 505, 32, "jeu 7 mai"),
    ("08", 575, 40, "ven 8 mai"),
    ("09", 646, 42, "sam 9 mai"),
    # ("10", 717, None, "dim 10 mai"),  # no entry that day
    ("11", 788, 50, "lun 11 mai"),
    ("12", 858, 38, "mar 12 mai"),
    ("13", 929, 28, "mer 13 mai"),
    ("14", 1000, 20, "jeu 14 mai"),
]

# X positions for all 14 days (for axis labels)
DAY_X = {
    "01": 80, "02": 151, "03": 222, "04": 292, "05": 363, "06": 434, "07": 505,
    "08": 575, "09": 646, "10": 717, "11": 788, "12": 858, "13": 929, "14": 1000,
}

PLOT_BOTTOM = 180
PLOT_TOP = 80
P_MAX = 60  # the y axis spans 0% to 60%

def y_for_p(p):
    return round(PLOT_BOTTOM - p * (PLOT_BOTTOM - PLOT_TOP) / P_MAX)

def tracker_svg(up_to_day):
    """Build the SVG tracker showing data up to and including up_to_day (e.g. '14')."""
    # Filter DATA to entries up to up_to_day
    points = [(d, x, p, lbl) for (d, x, p, lbl) in DATA if d <= up_to_day]
    if not points:
        return ""

    latest_day, latest_x, latest_p, latest_lbl = points[-1]
    latest_y = y_for_p(latest_p)

    # Polyline points (only if more than one)
    line_pts = " ".join(f"{x},{y_for_p(p)}" for (_, x, p, _) in points)

    # Static dots (all except latest)
    static_dots = "\n      ".join(
        f'<circle cx="{x}" cy="{y_for_p(p)}" r="3.5"/>'
        for (d, x, p, _) in points[:-1]
    )

    # X-axis labels (all 14 days, regardless of progress, to keep axis stable)
    x_labels = "\n      ".join(
        f'<text x="{x}" y="206">{d}</text>'
        for d, x in DAY_X.items()
    )

    polyline = (
        f'<polyline points="{line_pts}" fill="none" stroke="#b8582e" '
        f'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'
        if len(points) >= 2 else ""
    )

    # Latest-value badge top-right
    # P(MUSK) big, day label small below
    badge = (
        f'<text x="1040" y="36" font-family="\'JetBrains Mono\', monospace" '
        f'font-size="13" font-weight="600" fill="#b8582e" letter-spacing="0.06em" '
        f'text-anchor="end">P(MUSK) = {latest_p}%</text>'
        f'<text x="1040" y="54" font-family="\'JetBrains Mono\', monospace" '
        f'font-size="9.5" fill="#9a9ca5" letter-spacing="0.18em" '
        f'text-anchor="end">AU {latest_lbl.upper()}</text>'
    )

    # Vertical guide from latest dot down to x-axis (subtle, dashed)
    guide = (
        f'<line x1="{latest_x}" y1="{latest_y + 8}" x2="{latest_x}" y2="180" '
        f'stroke="#b8582e" stroke-width="1" stroke-dasharray="2 3" opacity="0.5"/>'
    )

    return f'''      <div class="tracker" aria-label="Probabilité estimée que Musk gagne en équité, au {latest_lbl}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 240" role="img">
          <rect width="1080" height="240" fill="#faf6ec"/>

          <text x="40" y="32" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="600" fill="#b8582e" letter-spacing="0.14em">PROBABILITÉ ESTIMÉE · MUSK GAGNE EN ÉQUITÉ</text>
          <text x="40" y="52" font-family="'Fraunces', serif" font-size="13" font-style="italic" fill="#6b6f7c">estimation Mathieu Guglielmino · révisée chaque jour du procès</text>
          {badge}
          <line x1="40" y1="64" x2="1040" y2="64" stroke="rgba(30,30,44,0.20)" stroke-width="1"/>

          <line x1="80" y1="97" x2="1020" y2="97" stroke="rgba(30,30,44,0.10)" stroke-width="1" stroke-dasharray="2 4"/>
          <line x1="80" y1="138" x2="1020" y2="138" stroke="rgba(30,30,44,0.10)" stroke-width="1" stroke-dasharray="2 4"/>
          <line x1="80" y1="180" x2="1020" y2="180" stroke="rgba(30,30,44,0.30)" stroke-width="1"/>

          <text x="68" y="101" font-family="'JetBrains Mono', monospace" font-size="9" fill="#9a9ca5" text-anchor="end">50</text>
          <text x="68" y="142" font-family="'JetBrains Mono', monospace" font-size="9" fill="#9a9ca5" text-anchor="end">25</text>
          <text x="68" y="184" font-family="'JetBrains Mono', monospace" font-size="9" fill="#9a9ca5" text-anchor="end">0%</text>

          <g font-family="'JetBrains Mono', monospace" font-size="9" fill="#9a9ca5" text-anchor="middle">
      {x_labels}
          </g>
          <text x="540" y="226" font-family="'JetBrains Mono', monospace" font-size="9" fill="#9a9ca5" letter-spacing="0.18em" text-anchor="middle">MAI 2026</text>

          {guide}
          {polyline}
          <g fill="#faf6ec" stroke="#b8582e" stroke-width="1.6">
      {static_dots}
          </g>
          <circle cx="{latest_x}" cy="{latest_y}" r="6" fill="#b8582e"/>
        </svg>
      </div>
'''


def main():
    text = PATH.read_text()

    # Find each article block.
    # Pattern: <article class="entry"> ... <div class="entry-date">YYYY-MM-DD ...</div> ... </article>
    # We'll regex-find each article and inject the tracker right before its </article>.

    pattern = re.compile(
        r'(<article class="entry">.*?<div class="entry-date">(\d{4}-\d{2}-\d{2}).*?</article>)',
        re.DOTALL,
    )

    def replace_article(m):
        article = m.group(1)
        date = m.group(2)  # 2026-05-14
        day = date.split("-")[2]  # "14"

        # Check if already has a tracker (idempotent)
        if 'class="tracker"' in article:
            return article

        tracker = tracker_svg(day)
        if not tracker:
            return article

        # Insert just before </article>
        return article.replace("</article>", tracker + "    </article>")

    new_text = pattern.sub(replace_article, text)

    # Count how many articles got the tracker
    count_inserted = new_text.count('class="tracker"')
    print(f"Inserted {count_inserted} trackers")

    PATH.write_text(new_text)

if __name__ == "__main__":
    main()
