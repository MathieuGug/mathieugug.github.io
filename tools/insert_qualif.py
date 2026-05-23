#!/usr/bin/env python3
"""
insert_qualif.py — inject qualification mini-blocs and recap into a deep-research app from a JSON sidecar.

Usage:
    python insert_qualif.py --app PATH --qualif PATH [--check] [--strict]

Modèle calqué sur insert-quizzes.py (idempotent, dry-run, strict mode).
Spec : docs/superpowers/specs/2026-05-23-business-qualification-widget-design.md
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
from pathlib import Path
from typing import Any


def load_qualif(path: Path) -> dict[str, Any]:
    with path.open('r', encoding='utf-8') as f:
        return json.load(f)


def validate_qualif(config: dict[str, Any]) -> list[str]:
    """Retourne la liste des erreurs (vide si OK)."""
    errors: list[str] = []
    meta = config.get('meta', {})
    for field in ('slug', 'version', 'title', 'recap_before_heading_id'):
        if not meta.get(field):
            errors.append(f'meta.{field} missing or empty')

    axes = config.get('axes', [])
    if not isinstance(axes, list) or len(axes) == 0:
        errors.append('axes must be a non-empty array')
        return errors

    axis_ids: set[str] = set()
    for i, axis in enumerate(axes):
        prefix = f'axes[{i}]'
        for field in ('id', 'label', 'before_heading_id', 'intro'):
            if not axis.get(field):
                errors.append(f'{prefix}.{field} missing')
        aid = axis.get('id', '')
        if aid in axis_ids:
            errors.append(f'duplicate axis id: {aid}')
        axis_ids.add(aid)

        inputs = axis.get('inputs', [])
        if not isinstance(inputs, list) or len(inputs) == 0:
            errors.append(f'{prefix}.inputs must be non-empty')
            continue
        axial = [inp for inp in inputs if inp.get('scoring') == 'axis']
        if len(axial) != 1:
            errors.append(f'{prefix} should have exactly 1 axial-scoring input (got {len(axial)})')

    profiles = config.get('profiles', [])
    profile_ids: set[str] = set()
    for i, p in enumerate(profiles):
        prefix = f'profiles[{i}]'
        if not p.get('id'):
            errors.append(f'{prefix}.id missing')
        pid = p.get('id', '')
        if pid in profile_ids:
            errors.append(f'duplicate profile id: {pid}')
        profile_ids.add(pid)
        anchor = p.get('anchor', [])
        if not (isinstance(anchor, list) and len(anchor) == 6):
            errors.append(f'{prefix}.anchor must be a list of 6 numbers')
        else:
            for j, v in enumerate(anchor):
                if not isinstance(v, (int, float)) or not (0 <= v <= 100):
                    errors.append(f'{prefix}.anchor[{j}] = {v} not in [0..100]')

    for i, adj in enumerate(config.get('adjustments', [])):
        prefix = f'adjustments[{i}]'
        if not adj.get('id'):
            errors.append(f'{prefix}.id missing')
        if not adj.get('reco'):
            errors.append(f'{prefix}.reco missing')
        when = adj.get('when', {})
        if not when.get('axis') or when['axis'] not in axis_ids:
            errors.append(f'{prefix}.when.axis unknown: {when.get("axis")}')

    return errors


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description='Inject qualification widget blocks into an app HTML.')
    ap.add_argument('--app', required=True, type=Path)
    ap.add_argument('--qualif', required=True, type=Path)
    ap.add_argument('--check', action='store_true', help='dry-run: do not write')
    ap.add_argument('--strict', action='store_true', help='treat missing headings as errors')
    args = ap.parse_args(argv)

    if not args.app.exists():
        print(f'error: app file not found: {args.app}', file=sys.stderr)
        return 2
    if not args.qualif.exists():
        print(f'error: qualif file not found: {args.qualif}', file=sys.stderr)
        return 2

    config = load_qualif(args.qualif)
    errors = validate_qualif(config)
    if errors:
        print('JSON validation failed:', file=sys.stderr)
        for e in errors:
            print('  - ' + e, file=sys.stderr)
        return 3

    html_src = args.app.read_text(encoding='utf-8')

    # Phase 5.3+ : rendu + injection
    print(f'qualif JSON validated: {len(config["axes"])} axes, {len(config["profiles"])} profiles, {len(config.get("adjustments", []))} adjustments')
    print(f'app: {args.app} ({len(html_src)} chars)')
    print('rendu + injection: TODO (Task 5.3+)')

    return 0


if __name__ == '__main__':
    sys.exit(main())
