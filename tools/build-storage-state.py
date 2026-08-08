#!/usr/bin/env python3
"""Thin wrapper that defers to `tools.veille_presse.cli build-storage-state`.

Usage:
    python tools/build-storage-state.py <slug>
    # e.g.
    python tools/build-storage-state.py nyt
"""
import sys
from pathlib import Path

# Make the repo root importable so `from tools.veille_presse...` works
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.veille_presse.cli import main

if __name__ == "__main__":
    args = ["build-storage-state"] + sys.argv[1:]
    sys.exit(main(args))
