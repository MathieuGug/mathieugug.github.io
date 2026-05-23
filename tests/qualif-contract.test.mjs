import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const QUALIF_GCP = JSON.parse(
  readFileSync(join(ROOT, 'analytics-agentique-gcp/qualif.json'), 'utf8')
);

test('qualif.json: meta has required fields', () => {
  assert.ok(QUALIF_GCP.meta);
  assert.equal(typeof QUALIF_GCP.meta.slug, 'string');
  assert.equal(typeof QUALIF_GCP.meta.version, 'number');
  assert.equal(typeof QUALIF_GCP.meta.title, 'string');
  assert.equal(typeof QUALIF_GCP.meta.recap_before_heading_id, 'string');
});

test('qualif.json: has exactly 6 axes with unique ids', () => {
  assert.equal(QUALIF_GCP.axes.length, 6);
  const ids = QUALIF_GCP.axes.map(a => a.id);
  assert.equal(new Set(ids).size, 6, `duplicate axis ids: ${ids.join(', ')}`);
});

test('qualif.json: each axis has required fields and at least 1 input', () => {
  for (const axis of QUALIF_GCP.axes) {
    assert.equal(typeof axis.id, 'string', `axis missing id`);
    assert.equal(typeof axis.label, 'string', `${axis.id} missing label`);
    assert.equal(typeof axis.before_heading_id, 'string', `${axis.id} missing before_heading_id`);
    assert.equal(typeof axis.intro, 'string', `${axis.id} missing intro`);
    assert.ok(Array.isArray(axis.inputs) && axis.inputs.length >= 1, `${axis.id} has no inputs`);
  }
});

test('qualif.json: each axis has exactly one axial-scoring input', () => {
  for (const axis of QUALIF_GCP.axes) {
    const axial = axis.inputs.filter(i => i.scoring === 'axis');
    assert.equal(axial.length, 1, `${axis.id} should have exactly 1 axial-scoring input, got ${axial.length}`);
  }
});

test('qualif.json: has exactly 5 profiles with unique ids', () => {
  assert.equal(QUALIF_GCP.profiles.length, 5);
  const ids = QUALIF_GCP.profiles.map(p => p.id);
  assert.equal(new Set(ids).size, 5);
});

test('qualif.json: each profile has anchor of length 6 with values 0-100', () => {
  for (const p of QUALIF_GCP.profiles) {
    assert.ok(Array.isArray(p.anchor), `${p.id} anchor not array`);
    assert.equal(p.anchor.length, 6, `${p.id} anchor length != 6`);
    for (const v of p.anchor) {
      assert.ok(typeof v === 'number' && v >= 0 && v <= 100, `${p.id} anchor has invalid value: ${v}`);
    }
  }
});

test('qualif.json: each profile has verdict and 3-5 recos', () => {
  for (const p of QUALIF_GCP.profiles) {
    assert.equal(typeof p.verdict, 'string', `${p.id} missing verdict`);
    assert.ok(Array.isArray(p.recos) && p.recos.length >= 3 && p.recos.length <= 5, `${p.id} should have 3-5 recos, got ${p.recos.length}`);
  }
});

test('qualif.json: adjustments reference valid axes and inputs', () => {
  const axisIds = new Set(QUALIF_GCP.axes.map(a => a.id));
  const inputIds = new Map();
  for (const axis of QUALIF_GCP.axes) {
    inputIds.set(axis.id, new Set(axis.inputs.map(i => i.id)));
  }
  for (const adj of QUALIF_GCP.adjustments) {
    assert.equal(typeof adj.id, 'string', `adjustment missing id`);
    assert.equal(typeof adj.reco, 'string', `${adj.id} missing reco`);
    assert.ok(adj.when, `${adj.id} missing when clause`);
    assert.ok(axisIds.has(adj.when.axis), `${adj.id} references unknown axis: ${adj.when.axis}`);
    assert.ok(inputIds.get(adj.when.axis).has(adj.when.input), `${adj.id} references unknown input ${adj.when.input} on axis ${adj.when.axis}`);
  }
});
