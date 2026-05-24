import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const HERO_INTRO_JS_PATH = join(ROOT, 'evaluation-agentique/hero-intro.js');

test('hero-intro.js exists', () => {
  assert.ok(existsSync(HERO_INTRO_JS_PATH), 'hero-intro.js must exist at evaluation-agentique/hero-intro.js');
});

// Lecture conditionnelle — si le fichier n'existe pas encore, on évite le crash
// du module-level readFileSync. Les tests suivants seront alors skipped/failed
// proprement plutôt qu'avec un ENOENT.
const HERO_INTRO_JS = existsSync(HERO_INTRO_JS_PATH)
  ? readFileSync(HERO_INTRO_JS_PATH, 'utf8')
  : '';

test('hero-intro.js exports mountHeroIntro', () => {
  assert.match(HERO_INTRO_JS, /export\s+function\s+mountHeroIntro/);
});

test('hero-intro.js imports mountGruyereHero', () => {
  assert.match(HERO_INTRO_JS, /import\s*\{\s*mountGruyereHero\s*\}\s*from\s*['"]\.\/gruyere-hero\.js['"]/);
});

test('hero-intro.js declares 5 beats with title and lede', () => {
  assert.match(HERO_INTRO_JS, /BEATS\s*=\s*\[/);
  const titleMatches = HERO_INTRO_JS.match(/title:\s*['"`]/g) || [];
  assert.ok(titleMatches.length >= 5, `expected ≥5 title: entries, got ${titleMatches.length}`);
  const ledeMatches = HERO_INTRO_JS.match(/lede:\s*['"`]/g) || [];
  assert.ok(ledeMatches.length >= 5, `expected ≥5 lede: entries, got ${ledeMatches.length}`);
});

test('hero-intro.js wires IntersectionObserver on triggers', () => {
  assert.match(HERO_INTRO_JS, /new IntersectionObserver/);
  assert.match(HERO_INTRO_JS, /rootMargin:\s*['"`]-50%/);
});

test('hero-intro.js calls setBeat on the intro mount', () => {
  assert.match(HERO_INTRO_JS, /\.setBeat\s*\(/);
});

test('hero-intro.js guards mobile and reduced-motion paths', () => {
  assert.match(HERO_INTRO_JS, /max-width:\s*768px/);
  assert.match(HERO_INTRO_JS, /prefers-reduced-motion/);
});

test('hero-intro.js applies aria-live update via caption swap', () => {
  assert.match(HERO_INTRO_JS, /textContent\s*=/);
});
