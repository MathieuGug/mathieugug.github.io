#!/usr/bin/env python3
"""Insert a stacked-bar probability tracker SVG into each entry of journal.html.

Each tracker shows daily stacked bars (Musk in accent at bottom, Altman in ink-mid
at top — sum = 100 %), with bars filled only up to the entry's date so the
historical "vue" se construit en avançant dans le journal. ViewBox 1080×320.
Idempotent: detects existing class="tracker" blocks and replaces them on each run.
"""
import re
from pathlib import Path

PATH = Path("/home/user/mathieugug.github.io/proces-musk-altman/journal.html")

# Probability series (Mathieu's estimate of P(Musk wins in equity))
# (day_str, x_center, p_musk%, short_label_for_badge)
DATA = [
    ("01", 80,  35, "ven 1 mai"),
    ("02", 140, 22, "sam 2 mai"),
    ("03", 200, 20, "dim 3 mai"),
    ("04", 260, 23, "lun 4 mai"),
    ("05", 320, 28, "mar 5 mai"),
    ("06", 380, 24, "mer 6 mai"),
    ("07", 440, 32, "jeu 7 mai"),
    ("08", 500, 40, "ven 8 mai"),
    ("09", 560, 42, "sam 9 mai"),
    # ("10", 620, None, "dim 10 mai"),  # pas d'audience — colonne laissée vide
    ("11", 680, 50, "lun 11 mai"),
    ("12", 740, 38, "mar 12 mai"),
    ("13", 800, 28, "mer 13 mai"),
    ("14", 860, 20, "jeu 14 mai"),
    ("15", 920, 18, "ven 15 mai"),
    ("16", 980, 16, "sam 16 mai"),
]

# All 16 day positions for the X axis (the dim 10 mai stays labeled even with no bar)
DAY_X = [
    ("01", 80), ("02", 140), ("03", 200), ("04", 260), ("05", 320), ("06", 380),
    ("07", 440), ("08", 500), ("09", 560), ("10", 620), ("11", 680), ("12", 740),
    ("13", 800), ("14", 860), ("15", 920), ("16", 980),
]

PLOT_TOP = 92        # y at 100 %
PLOT_BOTTOM = 272    # y at 0 %
PLOT_HEIGHT = PLOT_BOTTOM - PLOT_TOP  # 180
BAR_WIDTH = 40
BAR_HALF = BAR_WIDTH // 2

COLOR_MUSK = "#b8582e"
COLOR_ALTMAN = "#3b3f4d"


def y_top_of_musk(p):
    return round(PLOT_BOTTOM - (p / 100) * PLOT_HEIGHT)


def tracker_svg(up_to_day):
    """Build the SVG tracker, with bars drawn for days up to and including up_to_day."""
    drawn = [(d, x, p, lbl) for (d, x, p, lbl) in DATA if d <= up_to_day]
    if not drawn:
        return ""

    latest_day, latest_x, latest_p, latest_lbl = drawn[-1]
    latest_altman = 100 - latest_p

    # Bars: Altman segment (top) + Musk segment (bottom)
    bars = []
    for (d, x, p, _) in drawn:
        musk_top = y_top_of_musk(p)
        musk_h = PLOT_BOTTOM - musk_top
        altman_h = musk_top - PLOT_TOP
        bx = x - BAR_HALF
        bars.append(
            f'<rect x="{bx}" y="{PLOT_TOP}" width="{BAR_WIDTH}" height="{altman_h}" fill="{COLOR_ALTMAN}"/>'
        )
        bars.append(
            f'<rect x="{bx}" y="{musk_top}" width="{BAR_WIDTH}" height="{musk_h}" fill="{COLOR_MUSK}"/>'
        )
    bars_block = "\n            ".join(bars)

    # Latest-bar emphasis: thin accent stroke around the full bar (Altman + Musk)
    latest_bx = latest_x - BAR_HALF
    emphasis = (
        f'<rect x="{latest_bx - 2}" y="{PLOT_TOP - 2}" width="{BAR_WIDTH + 4}" '
        f'height="{PLOT_HEIGHT + 4}" fill="none" stroke="{COLOR_MUSK}" '
        f'stroke-width="1.6" rx="2"/>'
    )

    # X-axis day labels: latest one in accent + bold
    x_labels = []
    for (d, x) in DAY_X:
        if d == latest_day:
            x_labels.append(
                f'<text x="{x}" y="292" font-weight="600" fill="{COLOR_MUSK}">{d}</text>'
            )
        else:
            x_labels.append(f'<text x="{x}" y="292">{d}</text>')
    x_labels_block = "\n              ".join(x_labels)

    # Top-right badge: MUSK X% · ALTMAN Y%
    badge = (
        f'<text x="1040" y="32" font-family="\'JetBrains Mono\', monospace" '
        f'font-size="11" font-weight="600" letter-spacing="0.06em" '
        f'text-anchor="end">'
        f'<tspan fill="{COLOR_MUSK}">MUSK {latest_p}%</tspan>'
        f'<tspan fill="#6b6f7c"> · </tspan>'
        f'<tspan fill="{COLOR_ALTMAN}">ALTMAN {latest_altman}%</tspan>'
        f'</text>'
        f'<text x="1040" y="50" font-family="\'JetBrains Mono\', monospace" '
        f'font-size="9.5" fill="#9a9ca5" letter-spacing="0.18em" '
        f'text-anchor="end">AU {latest_lbl.upper()}</text>'
    )

    return f'''      <div class="tracker" aria-label="Probabilité estimée que Musk gagne en équité, au {latest_lbl}. Musk {latest_p} pour cent, Altman {latest_altman} pour cent.">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 320" role="img">
          <rect width="1080" height="320" fill="#faf6ec"/>

          <text x="40" y="32" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="600" fill="#b8582e" letter-spacing="0.14em">PROBABILITÉ ESTIMÉE · MUSK VS ALTMAN EN ÉQUITÉ</text>
          <text x="40" y="52" font-family="'Fraunces', serif" font-size="13" font-style="italic" fill="#6b6f7c">estimation Mathieu Guglielmino · révisée chaque jour du procès</text>
          {badge}
          <line x1="40" y1="64" x2="1040" y2="64" stroke="rgba(30,30,44,0.20)" stroke-width="1"/>

          <line x1="60" y1="92" x2="1020" y2="92" stroke="rgba(30,30,44,0.18)" stroke-width="1"/>
          <line x1="60" y1="182" x2="1020" y2="182" stroke="rgba(30,30,44,0.18)" stroke-width="1" stroke-dasharray="3 4"/>
          <line x1="60" y1="272" x2="1020" y2="272" stroke="rgba(30,30,44,0.30)" stroke-width="1"/>

          <text x="52" y="96" font-family="'JetBrains Mono', monospace" font-size="9" fill="#9a9ca5" text-anchor="end">100</text>
          <text x="52" y="186" font-family="'JetBrains Mono', monospace" font-size="9" fill="#9a9ca5" text-anchor="end">50</text>
          <text x="52" y="276" font-family="'JetBrains Mono', monospace" font-size="9" fill="#9a9ca5" text-anchor="end">0%</text>

          <g>
            {bars_block}
          </g>
          {emphasis}

          <g font-family="'JetBrains Mono', monospace" font-size="10" fill="#9a9ca5" text-anchor="middle">
              {x_labels_block}
          </g>
          <text x="540" y="312" font-family="'JetBrains Mono', monospace" font-size="9" fill="#9a9ca5" letter-spacing="0.18em" text-anchor="middle">MAI 2026</text>
        </svg>
      </div>
'''


def main():
    text = PATH.read_text()

    pattern = re.compile(
        r'(<article class="entry">.*?<div class="entry-date">(\d{4}-\d{2}-\d{2}).*?</article>)',
        re.DOTALL,
    )

    # Match any existing tracker block (re-rendered or first-pass).
    tracker_pattern = re.compile(
        r'      <div class="tracker"[^>]*>.*?</div>\n',
        re.DOTALL,
    )

    def replace_article(m):
        article = m.group(1)
        date = m.group(2)  # 2026-05-14
        day = date.split("-")[2]  # "14"

        new_tracker = tracker_svg(day)
        if not new_tracker:
            return article

        if tracker_pattern.search(article):
            return tracker_pattern.sub(new_tracker, article, count=1)
        return article.replace("</article>", new_tracker + "    </article>")

    new_text = pattern.sub(replace_article, text)
    count = new_text.count('class="tracker"')
    print(f"Tracker present on {count} entries")
    PATH.write_text(new_text)


if __name__ == "__main__":
    main()
