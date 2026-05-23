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

const TEST_PROFILES = [
  { id: 'explorer',   anchor: [20, 30, 25, 15, 25, 30] },
  { id: 'poc',        anchor: [40, 50, 50, 35, 50, 35] },
  { id: 'builder',    anchor: [65, 70, 70, 65, 70, 50] },
  { id: 'regulated',  anchor: [50, 60, 50, 50, 60, 85] },
  { id: 'pioneer',    anchor: [80, 80, 85, 80, 85, 60] }
];
const TIEBREAK_ORDER = ['regulated', 'builder', 'poc', 'pioneer', 'explorer'];

test('dominantProfile: explorer vector → explorer', () => {
  assert.equal(Q.dominantProfile([20, 30, 25, 15, 25, 30], TEST_PROFILES, TIEBREAK_ORDER).id, 'explorer');
});

test('dominantProfile: builder vector → builder', () => {
  assert.equal(Q.dominantProfile([65, 70, 70, 65, 70, 50], TEST_PROFILES, TIEBREAK_ORDER).id, 'builder');
});

test('dominantProfile: regulated vector → regulated', () => {
  assert.equal(Q.dominantProfile([50, 60, 50, 50, 60, 85], TEST_PROFILES, TIEBREAK_ORDER).id, 'regulated');
});

test('dominantProfile: pioneer vector → pioneer', () => {
  assert.equal(Q.dominantProfile([80, 80, 85, 80, 85, 60], TEST_PROFILES, TIEBREAK_ORDER).id, 'pioneer');
});

test('dominantProfile: poc vector → poc', () => {
  assert.equal(Q.dominantProfile([40, 50, 50, 35, 50, 35], TEST_PROFILES, TIEBREAK_ORDER).id, 'poc');
});

test('dominantProfile: equidistant between explorer & poc → poc wins (tiebreak)', () => {
  // Midpoint of explorer (20,30,25,15,25,30) and poc (40,50,50,35,50,35) = (30,40,37.5,25,37.5,32.5)
  assert.equal(Q.dominantProfile([30, 40, 37.5, 25, 37.5, 32.5], TEST_PROFILES, TIEBREAK_ORDER).id, 'poc');
});

test('dominantProfile: null entries treated as 50 (neutral) for partial profiles', () => {
  // Filling unknowns with 50 from [20,30,null,null,null,null] = [20,30,50,50,50,50]
  // explorer dist² = 0+0+625+1225+625+400 = 2875
  // poc dist²      = 400+400+0+225+0+225  = 1250
  // → poc wins
  assert.equal(Q.dominantProfile([20, 30, null, null, null, null], TEST_PROFILES, TIEBREAK_ORDER).id, 'poc');
});
