import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadQualif() {
  const code = readFileSync(join(ROOT, 'assets/dossier-qualif.js'), 'utf8');
  const sandbox = {
    document: { addEventListener: () => {}, readyState: 'complete' },
    globalThis: {},
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox.globalThis.__qualif;
}

const Q = loadQualif();

test('computeAxisScore: slider-anchored returns the raw value', () => {
  const axis = {
    id: 'test',
    inputs: [
      { id: 'stade', type: 'slider-anchored', scoring: 'axis',
        levels: [{value: 0}, {value: 50}, {value: 100}] }
    ]
  };
  const state = { 'test.stade': 75 };
  assert.equal(Q.computeAxisScore(axis, state), 75);
});

test('computeAxisScore: segmented with scoring=axis returns option score', () => {
  const axis = {
    id: 'cas-usage',
    inputs: [
      { id: 'surface', type: 'segmented', scoring: 'axis',
        options: [
          {id: 'a', label: 'A', score: 50},
          {id: 'b', label: 'B', score: 75},
          {id: 'indecis', label: 'Indécis', score: 0}
        ] }
    ]
  };
  assert.equal(Q.computeAxisScore(axis, { 'cas-usage.surface': 'b' }), 75);
  assert.equal(Q.computeAxisScore(axis, { 'cas-usage.surface': 'indecis' }), 0);
});

test('computeAxisScore: no state for axis returns null (not 0)', () => {
  const axis = {
    id: 'test',
    inputs: [{ id: 'stade', type: 'slider-anchored', scoring: 'axis', levels: [{value:0},{value:100}] }]
  };
  assert.equal(Q.computeAxisScore(axis, {}), null);
});

test('computeAxisScore: axis with no axial-scoring input throws', () => {
  const axis = {
    id: 'broken',
    inputs: [{ id: 'm', type: 'multi', options: [{id:'a', label:'A'}] }]
  };
  assert.throws(() => Q.computeAxisScore(axis, {}), /no axial.*scoring/i);
});
