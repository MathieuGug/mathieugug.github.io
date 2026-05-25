import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APP = readFileSync(
  join(ROOT, 'surfaces-agentiques/20260518-surfaces-agentiques-app.html'),
  'utf8'
);
const CONFIG = JSON.parse(
  readFileSync(join(ROOT, 'surfaces-agentiques/qualif.json'), 'utf8')
);

test('surfaces app contains exactly 6 qualif-step aside elements', () => {
  const matches = APP.match(/<aside class="qualif-step"(?: id="qualif-step-[^"]+")? data-axis="[^"]+">/g) || [];
  assert.equal(matches.length, 6, `expected 6 mini-blocs, got ${matches.length}`);
});

test('surfaces app: each axis from JSON has a matching mini-bloc with data-axis', () => {
  for (const axis of CONFIG.axes) {
    const re = new RegExp(`<aside class="qualif-step"(?: id="qualif-step-${axis.id}")? data-axis="${axis.id}">`);
    assert.ok(re.test(APP), `missing mini-bloc for axis "${axis.id}"`);
  }
});

test('surfaces app contains exactly 1 qualif-recap aside', () => {
  const matches = APP.match(/<aside id="qualif-recap"/g) || [];
  assert.equal(matches.length, 1);
});

test('surfaces app references the shared lib (CSS + JS)', () => {
  assert.ok(APP.includes('href="/assets/dossier-qualif.css"'), 'missing dossier-qualif.css link');
  assert.ok(APP.includes('src="/assets/dossier-qualif.js"'), 'missing dossier-qualif.js script');
});

test('surfaces app contains <link rel="qualif-data"> pointing to qualif.json', () => {
  assert.ok(/rel="qualif-data"[^>]+qualif\.json/.test(APP), 'missing or wrong qualif-data link');
});

test('surfaces recap has all expected data-bind hooks', () => {
  const expected = ['profile-label', 'verdict', 'recos', 'ts', 'completeness', 'radar-desc', 'radar-caption', 'user-polygon', 'profile-polygon'];
  for (const hook of expected) {
    assert.ok(APP.includes(`data-bind="${hook}"`), `missing data-bind="${hook}"`);
  }
});

test('surfaces: each axis mini-bloc has the right number of inputs (3 fieldsets each)', () => {
  for (const axis of CONFIG.axes) {
    const re = new RegExp(`<aside class="qualif-step"(?: id="qualif-step-${axis.id}")? data-axis="${axis.id}">[\\s\\S]*?</aside>`);
    const m = APP.match(re);
    assert.ok(m, `axis "${axis.id}" block not found`);
    const fieldsetCount = (m[0].match(/<fieldset class="qualif-input/g) || []).length;
    assert.equal(fieldsetCount, axis.inputs.length, `axis "${axis.id}" expected ${axis.inputs.length} fieldsets, got ${fieldsetCount}`);
  }
});

test('surfaces: mini-blocs sit before their target section in document order', () => {
  for (const axis of CONFIG.axes) {
    const asidePat = new RegExp(`<aside class="qualif-step"(?: id="qualif-step-${axis.id}")? data-axis="${axis.id}">`);
    const headingPat = new RegExp(`<(?:h[23]|section) id="${axis.before_heading_id}"`);
    const asidePos = APP.search(asidePat);
    const headingPos = APP.search(headingPat);
    assert.ok(asidePos !== -1, `axis "${axis.id}" aside not found`);
    assert.ok(headingPos !== -1, `section "${axis.before_heading_id}" not found`);
    assert.ok(asidePos < headingPos, `axis "${axis.id}" should be before section "${axis.before_heading_id}" (aside at ${asidePos}, section at ${headingPos})`);
  }
});

test('surfaces app has the qualif-nav drawer and the topbar toggle button', () => {
  assert.ok(/<aside id="qualif-nav"/.test(APP), 'missing qualif-nav drawer');
  assert.ok(/id="toggle-qualif"/.test(APP), 'missing #toggle-qualif button in topbar');
});
