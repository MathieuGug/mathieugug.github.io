import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const HERO_JS = readFileSync(join(ROOT, 'evaluation-agentique/gruyere-hero.js'), 'utf8');

test('gruyere-hero.js exports mountGruyereHero', () => {
  assert.match(HERO_JS, /export\s+function\s+mountGruyereHero/);
});

test('gruyere-hero.js detects prefers-reduced-motion', () => {
  assert.match(HERO_JS, /prefers-reduced-motion/);
});

test('gruyere-hero.js detects WebGL availability', () => {
  assert.match(HERO_JS, /getContext\(['"]webgl/);
});

test('gruyere-hero.js has poster fallback path', () => {
  assert.match(HERO_JS, /gruyere-hero-poster\.svg/);
});

test('gruyere-hero.js declares mulberry32 RNG', () => {
  assert.match(HERO_JS, /function\s+mulberry32/);
});

test('gruyere-hero.js generates holes per plate', () => {
  assert.match(HERO_JS, /function\s+generateHoles/);
});

test('gruyere-hero.js applies alignment ratio between plates', () => {
  assert.match(HERO_JS, /0\.30|0\.3/, 'expected ~30% plate-2 alignment with plate-1');
  assert.match(HERO_JS, /0\.15/, 'expected ~15% plate-3 alignment with plate-2');
});
