# tools/veille_presse/

Python package implementing the `veille-presse-visuelle` skill.

For the contract, workflow, and design rationale, see
`.claude/skills/veille-presse-visuelle/SKILL.md`.

## Quick start

```bash
pip install -r tools/veille_presse/requirements.txt
playwright install chromium

# Manual run (same as the Sunday 20h cron)
python tools/veille_presse/cli.py run

# Rebuild a paywall session
python tools/veille_presse/cli.py build-storage-state nyt
```
