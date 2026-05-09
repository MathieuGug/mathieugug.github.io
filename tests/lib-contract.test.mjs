import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const expectedFns = JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/expected-fns.json'), 'utf8'));
const expectedIds = JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/expected-ids.json'), 'utf8'));

test('dossier-app.js parses as valid JS', () => {
  const js = readFileSync(join(ROOT, 'assets/dossier-app.js'), 'utf8');
  vm.compileFunction(js);
});

test('dossier-app.js contains all expected function definitions', () => {
  const js = readFileSync(join(ROOT, 'assets/dossier-app.js'), 'utf8');
  const missing = [];
  for (const fn of expectedFns) {
    if (!new RegExp(`function\\s+${fn}\\b`).test(js)) {
      missing.push(fn);
    }
  }
  assert.deepEqual(missing, [], `Missing functions in dossier-app.js: ${missing.join(', ')}`);
});

test('dossier-app.css is non-empty and contains key selectors', () => {
  const css = readFileSync(join(ROOT, 'assets/dossier-app.css'), 'utf8');
  assert.ok(css.length > 500, 'dossier-app.css is suspiciously short');
  const missing = [];
  for (const sel of expectedIds.cssSelectors) {
    if (!css.includes(sel)) missing.push(sel);
  }
  assert.deepEqual(missing, [], `Missing selectors in dossier-app.css: ${missing.join(', ')}`);
});
