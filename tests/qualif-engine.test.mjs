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

test('dominantProfile: empty profiles array → returns null', () => {
  // Pin behavior : caller should never invoke with an empty profile list,
  // but if it does, we return null (not undefined, not throw).
  assert.equal(Q.dominantProfile([50,50,50,50,50,50], [], []), null);
});

const TEST_ADJUSTMENTS = [
  { id: 'a-contains',
    when: { axis: 'maturite-ia', input: 'freins', contains: 'hallucinations' },
    reco: 'Reco contains' },
  { id: 'a-equals',
    when: { axis: 'cas-usage', input: 'surface', equals: 'indecis' },
    reco: 'Reco equals' },
  { id: 'a-lt',
    when: { axis: 'equipe', input: 'structure', lt: 25 },
    reco: 'Reco lt' },
  { id: 'a-gte',
    when: { axis: 'maturite-ia', input: 'stade', gte: 50 },
    reco: 'Reco gte' },
  { id: 'a-and',
    when: { axis: 'equipe', input: 'structure', lt: 25,
            and: { axis: 'maturite-ia', input: 'stade', gte: 50 } },
    reco: 'Reco and' },
  { id: 'a-not',
    when: { axis: 'gouvernance', input: 'regime', not: 'hors-fin-sante' },
    reco: 'Reco not' },
  { id: 'a-contains-any-of',
    when: { axis: 'environnement', input: 'cloud', contains_any_of: ['aws', 'azure'] },
    reco: 'Reco contains_any_of' },
  { id: 'a-and-not',
    when: { axis: 'environnement', input: 'cloud', contains_any_of: ['aws', 'azure'],
            and_not: { axis: 'environnement', input: 'cloud', contains: 'gcp' } },
    reco: 'Reco and_not' }
];

test('applyAdjustments: contains triggers when option in multi-select', () => {
  const recos = Q.applyAdjustments({ 'maturite-ia.freins': ['hallucinations', 'accuracy'] }, TEST_ADJUSTMENTS);
  assert.ok(recos.includes('Reco contains'));
});

test('applyAdjustments: contains does NOT trigger when option absent', () => {
  const recos = Q.applyAdjustments({ 'maturite-ia.freins': ['accuracy'] }, TEST_ADJUSTMENTS);
  assert.ok(!recos.includes('Reco contains'));
});

test('applyAdjustments: equals triggers on exact match', () => {
  const recos = Q.applyAdjustments({ 'cas-usage.surface': 'indecis' }, TEST_ADJUSTMENTS);
  assert.ok(recos.includes('Reco equals'));
});

test('applyAdjustments: lt triggers when value below threshold', () => {
  const recos = Q.applyAdjustments({ 'equipe.structure': 10 }, TEST_ADJUSTMENTS);
  assert.ok(recos.includes('Reco lt'));
});

test('applyAdjustments: gte triggers when value at threshold', () => {
  const recos = Q.applyAdjustments({ 'maturite-ia.stade': 50 }, TEST_ADJUSTMENTS);
  assert.ok(recos.includes('Reco gte'));
});

test('applyAdjustments: and requires both conditions', () => {
  const both = Q.applyAdjustments({ 'equipe.structure': 10, 'maturite-ia.stade': 60 }, TEST_ADJUSTMENTS);
  assert.ok(both.includes('Reco and'));
  const onlyOne = Q.applyAdjustments({ 'equipe.structure': 10, 'maturite-ia.stade': 30 }, TEST_ADJUSTMENTS);
  assert.ok(!onlyOne.includes('Reco and'));
});

test('applyAdjustments: not triggers when value differs', () => {
  const recos = Q.applyAdjustments({ 'gouvernance.regime': 'banque-assur' }, TEST_ADJUSTMENTS);
  assert.ok(recos.includes('Reco not'));
  const notTriggered = Q.applyAdjustments({ 'gouvernance.regime': 'hors-fin-sante' }, TEST_ADJUSTMENTS);
  assert.ok(!notTriggered.includes('Reco not'));
});

test('applyAdjustments: not does NOT trigger when state key absent (unanswered)', () => {
  // Design choice: adjustments only apply to fields the user has actually answered.
  // An adjustment with `not: 'X'` does NOT fire if the field is undefined — otherwise
  // every untouched field would mass-trigger negative-match recos at page load.
  const recos = Q.applyAdjustments({}, TEST_ADJUSTMENTS);
  assert.ok(!recos.includes('Reco not'));
});

test('applyAdjustments: contains_any_of triggers if at least one in list', () => {
  const aws = Q.applyAdjustments({ 'environnement.cloud': ['aws'] }, TEST_ADJUSTMENTS);
  assert.ok(aws.includes('Reco contains_any_of'));
  const none = Q.applyAdjustments({ 'environnement.cloud': ['gcp'] }, TEST_ADJUSTMENTS);
  assert.ok(!none.includes('Reco contains_any_of'));
});

test('applyAdjustments: and_not blocks when secondary condition matches', () => {
  // aws + gcp → and_not(contains gcp) blocks Reco and_not
  const both = Q.applyAdjustments({ 'environnement.cloud': ['aws', 'gcp'] }, TEST_ADJUSTMENTS);
  assert.ok(!both.includes('Reco and_not'));
  // aws only → and_not satisfied → triggers
  const awsOnly = Q.applyAdjustments({ 'environnement.cloud': ['aws'] }, TEST_ADJUSTMENTS);
  assert.ok(awsOnly.includes('Reco and_not'));
});

test('applyAdjustments: caps at 2 recos max in declaration order', () => {
  const state = {
    'maturite-ia.freins': ['hallucinations'],
    'cas-usage.surface': 'indecis',
    'equipe.structure': 10,
    'maturite-ia.stade': 60,
    'gouvernance.regime': 'banque-assur'
  };
  const recos = Q.applyAdjustments(state, TEST_ADJUSTMENTS, 2);
  assert.equal(recos.length, 2);
  assert.equal(recos[0], 'Reco contains');
  assert.equal(recos[1], 'Reco equals');
});

test('renderRadarPath: 6 scores → SVG d= with 6 line segments + close', () => {
  const d = Q.renderRadarPath([50, 50, 50, 50, 50, 50], { cx: 160, cy: 160, radius: 120 });
  assert.match(d, /^M [\d.-]+,[\d.-]+( L [\d.-]+,[\d.-]+){5} Z$/);
});

test('renderRadarPath: zero scores → all points at center', () => {
  const d = Q.renderRadarPath([0, 0, 0, 0, 0, 0], { cx: 160, cy: 160, radius: 120 });
  const segments = d.match(/[\d.-]+,[\d.-]+/g);
  assert.equal(segments.length, 6);
  for (const s of segments) {
    const [x, y] = s.split(',').map(Number);
    assert.ok(Math.abs(x - 160) < 0.01, `x not at center: ${x}`);
    assert.ok(Math.abs(y - 160) < 0.01, `y not at center: ${y}`);
  }
});

test('renderRadarPath: max scores → all points at radius', () => {
  const d = Q.renderRadarPath([100, 100, 100, 100, 100, 100], { cx: 160, cy: 160, radius: 120 });
  const segments = d.match(/[\d.-]+,[\d.-]+/g);
  for (const s of segments) {
    const [x, y] = s.split(',').map(Number);
    const dist = Math.sqrt((x - 160) ** 2 + (y - 160) ** 2);
    assert.ok(Math.abs(dist - 120) < 0.01, `point not at radius: ${dist}`);
  }
});

test('renderRadarPath: no NaN in output', () => {
  const d = Q.renderRadarPath([42, 17, 88, 3, 71, 56], { cx: 160, cy: 160, radius: 120 });
  assert.ok(!d.includes('NaN'), `path contains NaN: ${d}`);
});

test('renderRadarPath: null scores treated as 0', () => {
  const d = Q.renderRadarPath([null, null, null, null, null, null], { cx: 160, cy: 160, radius: 120 });
  const segments = d.match(/[\d.-]+,[\d.-]+/g);
  for (const s of segments) {
    const [x, y] = s.split(',').map(Number);
    assert.ok(Math.abs(x - 160) < 0.01);
    assert.ok(Math.abs(y - 160) < 0.01);
  }
});
