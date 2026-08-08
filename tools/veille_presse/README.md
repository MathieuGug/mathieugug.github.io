# tools/veille_presse/

Python package implementing the `veille-presse-visuelle` skill.

For the contract, workflow, and design rationale, see
`.claude/skills/veille-presse-visuelle/SKILL.md`.

## Quick start

```bash
pip install -r tools/veille_presse/requirements.txt
playwright install chromium

# Phase 1 dry-run (crawl + shortlist, no captures, no commit)
python -m tools.veille_presse.cli discover-only

# Full weekly cycle (commit local, no push)
python -m tools.veille_presse.cli run --no-push --date 2026-05-17

# Full weekly cycle (commit + push + write mcp-pending.json)
python -m tools.veille_presse.cli run

# Rebuild a paywall session (interactive Playwright login)
python tools/build-storage-state.py nyt
```

> **Invocation form** : the CLI must be invoked as `python -m tools.veille_presse.cli ...` (module form) because of package imports — NOT as `python tools/veille_presse/cli.py ...`.

## External dependencies

- **Python 3.10+** (uses native generics `list[dict]`)
- **Playwright** + **Chromium** (`pip install playwright && playwright install chromium`)
- **ffmpeg** (in PATH, or installed at the WinGet default path on Windows — see `capture.FFMPEG_BIN`)

## Schedule

Le cron est enregistré via la skill `/schedule` :

| Nom | Cron | TZ | Action |
|---|---|---|---|
| `veille-presse-hebdo` | `0 20 * * 0` | `Europe/Paris` | `python -m tools.veille_presse.cli run` |

Pour modifier : `/schedule list`, `/schedule update veille-presse-hebdo`.

## MCP actions bridge

Le CLI ne peut pas appeler les MCP tools (PR / merge). À la fin d'un run, il
écrit `.claude/skills/veille-presse-visuelle/state/mcp-pending.json` que la
session Claude (ou Mathieu en manuel) doit lire pour exécuter :

1. `mcp__github__create_pull_request` → récupérer `pr_number`
2. `mcp__github__merge_pull_request` avec `pullNumber: <pr_number>`, `mergeMethod: "squash"`
3. Compléter l'entrée correspondante dans `state/run-log.jsonl` avec `pr_number` + `merge_sha`
4. Supprimer `state/mcp-pending.json`

## Tests

```bash
python -m unittest discover tests/test_veille_presse -v
```

Tous les tests (sources, crawler, metadata, capture, output, publish) doivent passer. La suite prend ~60s à cause des tests Playwright/ffmpeg.

## First smoke test (recommandé avant le premier vrai cycle)

```bash
# 1) Dry-run pour vérifier que les sélecteurs YAML matchent quelque chose
python -m tools.veille_presse.cli discover-only

# 2) Si la shortlist est correcte (>5 items), lance un cycle complet sans push :
python -m tools.veille_presse.cli run --no-push --date 2026-05-17

# 3) Ouvrir veille-presse/2026-05-17/index.html dans un navigateur
# 4) Si OK, nettoyer (le commit local sur veille/2026-05-17) :
git checkout main
git branch -D veille/2026-05-17
# le contenu de veille-presse/2026-05-17/ reste si tu veux le garder, sinon :
# rm -rf veille-presse/2026-05-17
```

## Reconstruire un `storage_state` Playwright

Quand une source paywallée commence à apparaître dans le `run-log.jsonl`
sous `n_skipped` (la session a expiré), reconstruis la session :

```bash
python tools/build-storage-state.py <slug>
# ex : python tools/build-storage-state.py nyt
```

Une fenêtre Chromium s'ouvre, te demande de te connecter manuellement,
puis sauvegarde le cookie/localStorage dans
`.claude/skills/veille-presse-visuelle/state/storage-state/<slug>.json`.
