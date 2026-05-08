#!/usr/bin/env python3
"""og-card.py — generate 1200x630 og:image cards branded for mathieugug.github.io.

Usage:
    python tools/og-card.py \
        --title "MCP, le HTTP des agents" \
        --eyebrow "Dossier 14 . 8 mai 2026" \
        --output mcp-plateforme/og.png \
        [--accent-word "agents"] [--kind dossier|veille|etude]

Design choices:
- 1200x630 = standard og:image ratio (Facebook, LinkedIn, Twitter summary_large_image).
- Cream paper #faf6ec, accent #b8582e, ink #1e1e2a — matches the host site.
- Italic Cambria stands in for italic Fraunces (not installed locally). Consolas for JetBrains Mono.
  When/if Mathieu installs Fraunces locally, swap the FONT_SERIF_ITALIC constant.
- Pure PIL — no cairo, no Playwright. Runs anywhere.
"""

import argparse
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

WIN_FONTS = Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts"

PAPER = (250, 246, 236)
INK = (30, 30, 42)
ACCENT = (184, 88, 46)
DIM = (107, 111, 124)
DIM_DEEP = (59, 63, 77)
RULE = (227, 220, 207)

W, H = 1200, 630
PAD = 80

FONT_SERIF = "cambria.ttc"
FONT_SERIF_ITALIC = "cambriai.ttf"
FONT_MONO = "consola.ttf"
FONT_SANS = "segoeui.ttf"
FONT_SANS_LIGHT = "segoeuil.ttf"


def font(name, size):
    return ImageFont.truetype(str(WIN_FONTS / name), size)


def wrap_text(draw, text, fnt, max_w):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if draw.textlength(test, font=fnt) <= max_w:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def render_card(title, eyebrow, output, accent_word=None, kind="dossier"):
    img = Image.new("RGB", (W, H), PAPER)
    draw = ImageDraw.Draw(img)

    # Vertical accent bar top-left (matches the stylo signature of the site)
    draw.rectangle([PAD, PAD, PAD + 5, PAD + 54], fill=ACCENT)

    # Eyebrow (mono uppercase letterspaced)
    eb_font = font(FONT_MONO, 21)
    eb_text = eyebrow.upper()
    eb_text_spaced = " ".join(eb_text)  # crude letter-spacing
    # Use single-char spacing instead of per-letter join (too aggressive). Keep as-is.
    draw.text((PAD + 22, PAD + 16), eb_text, fill=DIM_DEEP, font=eb_font)

    # Title size adapts to length
    raw_title = title.strip()
    title_size = 92 if len(raw_title) <= 38 else (78 if len(raw_title) <= 60 else 64)
    title_font = font(FONT_SERIF_ITALIC, title_size)
    max_w = W - 2 * PAD
    lines = wrap_text(draw, raw_title, title_font, max_w)
    if len(lines) > 4:
        # downsize once if it overflows 4 lines
        title_size = max(48, title_size - 12)
        title_font = font(FONT_SERIF_ITALIC, title_size)
        lines = wrap_text(draw, raw_title, title_font, max_w)

    line_h = int(title_size * 1.12)
    title_block_h = len(lines) * line_h
    title_top = (H - title_block_h) // 2 - 24

    for i, line in enumerate(lines):
        y = title_top + i * line_h
        if accent_word:
            low = line.lower()
            target = accent_word.lower()
            idx = low.find(target)
        else:
            idx = -1
        if idx >= 0:
            before = line[:idx]
            word = line[idx : idx + len(accent_word)]
            after = line[idx + len(accent_word):]
            x = PAD
            if before:
                draw.text((x, y), before, fill=INK, font=title_font)
                x += draw.textlength(before, font=title_font)
            draw.text((x, y), word, fill=ACCENT, font=title_font)
            x += draw.textlength(word, font=title_font)
            if after:
                draw.text((x, y), after, fill=INK, font=title_font)
        else:
            draw.text((PAD, y), line, fill=INK, font=title_font)

    # Bottom hairline rule
    rule_y = H - 88
    draw.rectangle([PAD, rule_y, W - PAD, rule_y + 1], fill=RULE)

    # Bottom-left: site URL (mono dim)
    site_font = font(FONT_MONO, 20)
    draw.text((PAD, rule_y + 22), "mathieugug.github.io", fill=DIM_DEEP, font=site_font)

    # Bottom-right: kind badge + monogram
    badge_font = font(FONT_MONO, 18)
    badge_text = kind.upper()
    badge_w = draw.textlength(badge_text, font=badge_font)
    monogram_font = font(FONT_SERIF_ITALIC, 32)
    monogram = "MG"
    monogram_w = draw.textlength(monogram, font=monogram_font)

    # Position monogram far-right, badge to its left with separator
    monogram_x = W - PAD - monogram_w
    draw.text((monogram_x, rule_y + 16), monogram, fill=ACCENT, font=monogram_font)

    sep_x = monogram_x - 18
    draw.rectangle([sep_x, rule_y + 24, sep_x + 1, rule_y + 44], fill=RULE)

    badge_x = sep_x - 14 - badge_w
    draw.text((badge_x, rule_y + 24), badge_text, fill=DIM, font=badge_font)

    Path(output).parent.mkdir(parents=True, exist_ok=True)
    img.save(output, "PNG", optimize=True)
    size_kb = Path(output).stat().st_size / 1024
    print(f"wrote {output} ({size_kb:.1f} KB)")


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--title", required=True)
    ap.add_argument("--eyebrow", required=True, help="e.g. 'Dossier 14 . 8 mai 2026'")
    ap.add_argument("--output", required=True)
    ap.add_argument("--accent-word", default=None, help="One word in the title to render in accent orange")
    ap.add_argument("--kind", default="dossier", choices=["dossier", "veille", "etude"])
    args = ap.parse_args()
    render_card(args.title, args.eyebrow, args.output, args.accent_word, args.kind)


if __name__ == "__main__":
    main()
