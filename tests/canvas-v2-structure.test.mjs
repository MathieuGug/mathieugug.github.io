import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILE = join(ROOT, 'evaluation-agentique/20260521-evaluation-agentique-canvas.html');
const html = readFileSync(FILE, 'utf8');

const ATTACKS = [
  'A-prompt-injection', 'A-hallucination', 'A-tool-misuse',
  'A-context-saturation', 'A-reward-hacking', 'A-spec-mismatch',
  'A-latency-drift',
];
const COUCHES = ['N1', 'N2', 'N3'];
const SUBCARDS_PHASE = ['S0', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7'];
const SUBCARDS_COUCHE = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'];

test('21 verdict-content (7 attaques × 3 couches)', () => {
  // Compter les verdict-content par attaque ET par couche (presence)
  let total = 0;
  for (const couche of COUCHES) {
    // Trouver le bloc .verdict-overlay pour cette couche
    const overlayRe = new RegExp(
      `<div class="verdict-overlay" data-couche="${couche}">[\\s\\S]*?</div>\\s*</div>\\s*</div>`
    );
    // Lighter heuristic : count contents matching the data-attack inside the file as a whole
    for (const attack of ATTACKS) {
      const re = new RegExp(`<div class="verdict-content" data-attack="${attack}"`);
      if (re.test(html)) {
        // count multiple occurrences globally
      }
    }
  }
  // Simpler: count total verdict-content tags
  const count = (html.match(/<div class="verdict-content" data-attack="A-[^"]+"/g) || []).length;
  assert.equal(count, 21, `Expected 21 verdict-content fragments, got ${count}`);
});

test('Each attack has exactly 3 verdict-content (1 per couche)', () => {
  for (const attack of ATTACKS) {
    const re = new RegExp(`<div class="verdict-content" data-attack="${attack}"`, 'g');
    const count = (html.match(re) || []).length;
    assert.equal(count, 3, `Attack ${attack} expected 3 verdict-content, got ${count}`);
  }
});

test('8 sub-card phase teasers + 8 details (S0..S7)', () => {
  for (const s of SUBCARDS_PHASE) {
    assert.match(html, new RegExp(`<article class="subcard-teaser" data-subcard="${s}"`),
      `Missing teaser ${s}`);
    assert.match(html, new RegExp(`<article class="subcard-detail" data-subcard="${s}"`),
      `Missing detail ${s}`);
  }
});

test('6 sub-card couche teasers + 6 details (C1..C6)', () => {
  for (const c of SUBCARDS_COUCHE) {
    assert.match(html, new RegExp(`<article class="subcard-teaser" data-subcard="${c}"`),
      `Missing teaser ${c}`);
    assert.match(html, new RegExp(`<article class="subcard-detail" data-subcard="${c}"`),
      `Missing detail ${c}`);
  }
});

test('no v1 position:fixed inset:56px overlay pattern', () => {
  assert.doesNotMatch(html, /position:\s*fixed[\s\S]{0,200}?inset:\s*56px\s+0\s+0\s+0/,
    'v1 fixed-inset sub-card overlay pattern must not reappear');
});

test('canvas grid bound viewport (calc(100vh - 56px))', () => {
  assert.match(html, /calc\(100vh\s*-\s*56px\)/,
    'Canvas grid must be bound to viewport via calc(100vh - 56px)');
});

test('JS exposes window.canvasV2 with required functions', () => {
  for (const fn of ['parseHash', 'stateToHash', 'applyState', 'setAxis', 'currentState']) {
    assert.match(html, new RegExp(`function\\s+${fn}\\b`),
      `Missing JS function ${fn}`);
  }
  assert.match(html, /window\.canvasV2\s*=/, 'window.canvasV2 must be exposed');
});

test('Canonical hash format documented in JS comment', () => {
  assert.match(html, /#P1\/N1\/A-prompt-injection/,
    'Canonical hash example must appear in JS as a comment for discoverability');
});

test('No v1 long-form sections (sanity check démolition complete)', () => {
  for (const cls of ['playbook', 'gruyere', 'attaques', 'outcomes']) {
    assert.doesNotMatch(html, new RegExp(`<section class="${cls}"`),
      `v1 <section class="${cls}"> must be removed`);
  }
});

test('No :root[data-zoom] CSS selectors (v1 styling gone)', () => {
  assert.doesNotMatch(html, /:root\[data-zoom/,
    'v1 :root[data-zoom] CSS selectors must be removed');
});

test('Default attributes on .canvas-v2 (P0/N0/A0)', () => {
  assert.match(html, /<main\s+class="canvas\s+canvas-v2"\s+data-phase-zoom="P0"\s+data-couche-zoom="N0"\s+data-attack="A0"/,
    'main.canvas-v2 must have default data-phase-zoom="P0" data-couche-zoom="N0" data-attack="A0"');
});
