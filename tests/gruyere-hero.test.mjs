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

test('gruyere-hero.js initialises a Three.js scene', () => {
  assert.match(HERO_JS, /new THREE\.Scene/);
  assert.match(HERO_JS, /new THREE\.PerspectiveCamera/);
  assert.match(HERO_JS, /new THREE\.WebGLRenderer/);
});

test('gruyere-hero.js builds 3 well-spaced extruded plates', () => {
  assert.match(HERO_JS, /PLATE_Z\s*=\s*\[0\.5,\s*3\.0?,\s*5\.5\]/);
  assert.match(HERO_JS, /function\s+buildPlate/);
  assert.match(HERO_JS, /ExtrudeGeometry/);
  // Plates use Phong material (lit by directional lights). The accumulator
  // screen uses MeshBasicMaterial since the écran-blanc-papier fix.
  assert.match(HERO_JS, /MeshPhongMaterial/);
});

test('gruyere-hero.js wires IntersectionObserver lifecycle', () => {
  assert.match(HERO_JS, /new IntersectionObserver/);
});

test('gruyere-hero.js destroy() disposes Three.js resources', () => {
  assert.match(HERO_JS, /renderer\.dispose/);
  assert.match(HERO_JS, /\.geometry\.dispose/);
});

test('gruyere-hero.js exposes targetSurvivalRate', () => {
  assert.match(HERO_JS, /targetSurvivalRate:\s*0\.\d+/);
});

test('gruyere-hero.js tunes hole alignment via Monte Carlo to match target', () => {
  assert.match(HERO_JS, /function\s+monteCarloSurvival/);
  assert.match(HERO_JS, /function\s+tuneHolesForTarget/);
});

test('gruyere-hero-poster.svg exists and is well-formed', () => {
  const svg = readFileSync(join(ROOT, 'evaluation-agentique/gruyere-hero-poster.svg'), 'utf8');
  assert.ok(svg.length > 1000, 'poster SVG suspiciously short');
  assert.match(svg, /<svg/);
  assert.match(svg, /viewBox="0 0 1200 620"/);
});

// Pages qui montent directement gruyere-hero sur <figure id="gruyere-hero"> (app + carte zoomable).
const DIRECT_HOST_PAGES = [
  'evaluation-agentique/20260501-evaluation-agentique-app.html',
  'evaluation-agentique/20260521-evaluation-agentique-canvas.html',
];

for (const page of DIRECT_HOST_PAGES) {
  const html = readFileSync(join(ROOT, page), 'utf8');

  test(`${page}: includes gruyere-hero.css`, () => {
    assert.match(html, /href=["']gruyere-hero\.css["']/);
  });

  test(`${page}: declares importmap for three`, () => {
    assert.match(html, /importmap[\s\S]*"three"[\s\S]*three\.module\.js/);
  });

  test(`${page}: contains <figure class="gruyere-hero" id="gruyere-hero">`, () => {
    assert.match(html, /<figure[^>]*class="gruyere-hero"[^>]*id="gruyere-hero"/);
  });

  test(`${page}: mounts mountGruyereHero on the figure`, () => {
    assert.match(html, /import\s*\{\s*mountGruyereHero\s*\}\s*from\s*['"]\.\/gruyere-hero\.js['"]/);
    assert.match(html, /mountGruyereHero\(\s*document\.getElementById\(['"]gruyere-hero['"]\)/);
  });

  test(`${page}: has <noscript> poster fallback`, () => {
    assert.match(html, /<noscript>\s*<img[^>]*gruyere-hero-poster\.svg/);
  });
}

// Hub : structure scrollytelling spécifique
{
  const page = 'evaluation-agentique/index.html';
  const html = readFileSync(join(ROOT, page), 'utf8');

  test(`${page}: includes gruyere-hero.css`, () => {
    assert.match(html, /href=["']gruyere-hero\.css["']/);
  });

  test(`${page}: declares importmap for three`, () => {
    assert.match(html, /importmap[\s\S]*"three"[\s\S]*three\.module\.js/);
  });

  test(`${page}: contains intro section with 5 beat triggers`, () => {
    assert.match(html, /<section[^>]*class="hero-intro"[^>]*id="hero-intro"/);
    for (let n = 1; n <= 5; n++) {
      assert.match(html, new RegExp(`<div[^>]*class="hero-intro__trigger"[^>]*data-beat="${n}"`),
        `intro section must contain a trigger for beat ${n}`);
    }
  });

  test(`${page}: contains fullscreen figure inside sticky wrapper`, () => {
    assert.match(html, /<div[^>]*class="hero-intro__sticky"/);
    assert.match(html, /<figure[^>]*class="gruyere-hero"[^>]*id="gruyere-hero-intro"/);
  });

  test(`${page}: contains banner figure with id gruyere-hero`, () => {
    assert.match(html, /<figure[^>]*class="gruyere-hero gruyere-hero--banner"[^>]*id="gruyere-hero"/);
  });

  test(`${page}: caption overlay has aria-live polite`, () => {
    assert.match(html, /<div[^>]*class="hero-intro__caption"[^>]*aria-live="polite"/);
  });

  test(`${page}: mounts mountHeroIntro from hero-intro.js`, () => {
    assert.match(html, /import\s*\{\s*mountHeroIntro\s*\}\s*from\s*['"]\.\/hero-intro\.js['"]/);
    assert.match(html, /mountHeroIntro\(/);
  });

  test(`${page}: has <noscript> poster fallback in intro figure`, () => {
    assert.match(html, /<noscript>\s*<img[^>]*gruyere-hero-poster\.svg/);
  });
}

test('gruyere-hero.js declares setBeat function', () => {
  assert.match(HERO_JS, /\bsetBeat\b/, 'mountGruyereHero return value must include setBeat');
});

test('gruyere-hero.js declares getBeat function', () => {
  assert.match(HERO_JS, /\bgetBeat\b/, 'mountGruyereHero return value must include getBeat');
});

test('gruyere-hero.js supports initialBeat option', () => {
  assert.match(HERO_JS, /initialBeat/, 'DEFAULTS or opts must reference initialBeat');
});

test('gruyere-hero.js supports beatTransitionMs option', () => {
  assert.match(HERO_JS, /beatTransitionMs/, 'DEFAULTS or opts must reference beatTransitionMs');
});

test('gruyere-hero.js gates collision by plate.enabled', () => {
  // The collision loop in updateParticles must check an `enabled` field on plates.
  // We match the JS source for an `enabled` reference inside the collision logic.
  assert.match(HERO_JS, /\.enabled\b/, 'plates must have an .enabled flag used by collision gate');
});
