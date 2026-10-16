# Capture — Playwright + ffmpeg

## Engine

**Playwright Chromium headless** is the only capture engine. We do not use
claude-in-chrome in the auto loop (requires an interactive session).

For paywalled sources, the crawler loads a per-source `storage_state.json`
(Playwright session export) via `browser_context.storage_state`. These
sessions are rebuilt manually with `python tools/build-storage-state.py <slug>`.

## ffmpeg

ffmpeg is invoked as a subprocess. The path is resolved at import via
`shutil.which("ffmpeg")` with a hardcoded fallback to the WinGet install
location (see `capture.FFMPEG_BIN`). To use a different binary, set PATH so
that `ffmpeg` resolves there.

## Outputs per item

For a shortlisted article at `https://nyt.com/interactive/.../heat.html` with
title "How Heat Reshapes Cities", we save :

```
veille-presse/2026-05-17/images/
  nyt-how-heat-reshapes-cities-fullpage.png
  nyt-how-heat-reshapes-cities-hero.png         ← section #hero
  nyt-how-heat-reshapes-cities-sect-1.png       ← unnamed section
  nyt-how-heat-reshapes-cities-interaction.gif  ← if is_interactive
```

## GIF/MP4 fallback ladder

1. Encode GIF at width=1000 → if ≤ 6 Mo, keep
2. Re-encode GIF at width=800 → if ≤ 6 Mo, keep
3. Encode MP4 H.264 → if ≤ 8 Mo, keep, drop GIF
4. Otherwise skip both, keep only fullpage PNG + note in `notes.md`

## ffmpeg commands

Palette-based GIF :
```
ffmpeg -y -framerate 10 -i frame_%04d.png -vf "scale=W:-1,palettegen" palette.png
ffmpeg -y -framerate 10 -i frame_%04d.png -i palette.png \
  -filter_complex "[0:v]scale=W:-1[x];[x][1:v]paletteuse" out.gif
```

MP4 H.264 :
```
ffmpeg -y -framerate 10 -i frame_%04d.png -c:v libx264 -pix_fmt yuv420p \
  -crf 23 -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2" out.mp4
```

## Frame capture (scroll)

`_capture_frames_async` opens the article at 1000×700 viewport, computes the
total scrollable height, and takes a screenshot every `1/fps` seconds while
scrolling from top to bottom over `duration_s` seconds. Default 80 frames
(8 s × 10 FPS).
