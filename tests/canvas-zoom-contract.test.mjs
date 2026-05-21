import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const expectedFns = JSON.parse(
  readFileSync(join(ROOT, 'tests/fixtures/expected-canvas-fns.json'), 'utf8')
);

test('canvas-zoom.js parses as valid JS', () => {
  const js = readFileSync(join(ROOT, 'assets/canvas-zoom.js'), 'utf8');
  vm.compileFunction(js);
});

test('canvas-zoom.js contains all expected function definitions', () => {
  const js = readFileSync(join(ROOT, 'assets/canvas-zoom.js'), 'utf8');
  const missing = [];
  for (const fn of expectedFns) {
    if (!new RegExp(`function\\s+${fn}\\b`).test(js)) {
      missing.push(fn);
    }
  }
  assert.deepEqual(missing, [],
    `Missing functions in canvas-zoom.js: ${missing.join(', ')}`);
});

test('canvas-zoom.js exposes window.canvasZoom API', () => {
  const js = readFileSync(join(ROOT, 'assets/canvas-zoom.js'), 'utf8');
  assert.match(js, /window\.canvasZoom\s*=/,
    'canvas-zoom.js must expose window.canvasZoom');
  assert.match(js, /openLeaf/, 'window.canvasZoom.openLeaf required');
  assert.match(js, /reset/, 'window.canvasZoom.reset required');
  assert.match(js, /getLevel/, 'window.canvasZoom.getLevel required');
});

test('canvas-zoom.js auto-bootstraps on DOMContentLoaded', () => {
  const js = readFileSync(join(ROOT, 'assets/canvas-zoom.js'), 'utf8');
  assert.match(js, /DOMContentLoaded/,
    'canvas-zoom.js must auto-bootstrap on DOMContentLoaded');
});

test('canvas-zoom.css is non-empty and contains key selectors', () => {
  const css = readFileSync(join(ROOT, 'assets/canvas-zoom.css'), 'utf8');
  assert.ok(css.length > 500, 'canvas-zoom.css is suspiciously short');
  const expected = [
    'svg[data-canvas-zoom]',
    '.zoom-target',
    '[data-state="focused"]',
    '[data-state="dimmed"]',
    '.canvas-mobile-interstitial',
    '.canvas-stage',
  ];
  const missing = expected.filter((sel) => !css.includes(sel));
  assert.deepEqual(missing, [],
    `Missing selectors in canvas-zoom.css: ${missing.join(', ')}`);
});
