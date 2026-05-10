import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const expectedFns = JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/expected-fns.json'), 'utf8'));
const expectedIds = JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/expected-ids.json'), 'utf8'));

const apps = execSync('git ls-files "*/2026*-app.html"', { cwd: ROOT, encoding: 'utf8' })
  .trim().split('\n').filter(Boolean);

assert.ok(apps.length >= 14, `Expected at least 14 apps, found ${apps.length}`);

for (const app of apps) {
  const html = readFileSync(join(ROOT, app), 'utf8');
  const isMigrated = /\/assets\/dossier-app\.js/.test(html);

  if (!isMigrated) {
    test(`${app}: SKIPPED — pas encore migré vers /assets/dossier-app`, { skip: true }, () => {});
    continue;
  }

  test(`${app}: includes lib JS via /assets/dossier-app.js`, () => {
    // Accept absolute (/assets/...) or relative (../assets/...) — both resolve
    // to the same file on GitHub Pages, but only the relative one works via file://
    assert.match(html, /<script[^>]+src=["'](?:\.\.\/)?\/?assets\/dossier-app\.js["']/,
      `Missing <script src="(/|../)assets/dossier-app.js"> in ${app}`);
  });

  test(`${app}: includes lib CSS via /assets/dossier-app.css`, () => {
    assert.match(html, /<link[^>]+href=["'](?:\.\.\/)?\/?assets\/dossier-app\.css["']/,
      `Missing <link href="(/|../)assets/dossier-app.css"> in ${app}`);
  });

  test(`${app}: provides window.SCHEMAS`, () => {
    const hasInline = /(?:const|var|let)\s+SCHEMAS\s*=/.test(html);
    const hasWindow = /window\.SCHEMAS\s*=/.test(html);
    assert.ok(hasInline || hasWindow,
      `${app} must define SCHEMAS (inline const) and expose it via window.SCHEMAS`);
    if (hasInline) {
      assert.match(html, /window\.SCHEMAS\s*=\s*SCHEMAS/,
        `${app} declares const SCHEMAS but doesn't expose it via window.SCHEMAS = SCHEMAS`);
    }
  });

  test(`${app}: contains required root IDs`, () => {
    const missing = [];
    for (const id of expectedIds.rootIds) {
      if (!html.includes(`id="${id}"`)) missing.push(id);
    }
    assert.deepEqual(missing, [], `Missing IDs in ${app}: ${missing.join(', ')}`);
  });

  test(`${app}: does not inline lib functions`, () => {
    const found = [];
    for (const fn of expectedFns) {
      if (new RegExp(`function\\s+${fn}\\b`).test(html)) {
        found.push(fn);
      }
    }
    assert.deepEqual(found, [],
      `${app} contains inline copies of lib functions: ${found.join(', ')}. They should live in /assets/dossier-app.js only.`);
  });

  test(`${app}: if has interactive figures, has #zoom-overlay`, () => {
    if (/<figure[^>]+class="[^"]*\bfigure\b[^"]*"[^>]*>[\s\S]*?<svg/.test(html)) {
      assert.ok(html.includes('id="zoom-overlay"'),
        `${app} has interactive figures but no #zoom-overlay container`);
    }
  });

  test(`${app}: does not inline lib CSS rules (signatures)`, () => {
    // Si le bloc CSS pattern de la lib a été correctement extrait,
    // ces règles ne doivent plus apparaître dans le <style> inline.
    // Note : l'ID dans le HTML body (id="zoom-overlay") est OK,
    // ce test cible uniquement la déclaration de RÈGLE CSS.
    const signatures = [
      /#zoom-overlay\s*\{/,
      /#modal-root\s*\{/,
      /\.sigil-mark\s*\{/,
      /#sources-collapse-btn\s*\{/,
    ];
    const leaks = signatures.filter(re => re.test(html));
    assert.equal(leaks.length, 0,
      `${app} has inline lib CSS rules: ${leaks.map(r => r.source).join(', ')}. They should live in /assets/dossier-app.css only.`);
  });
}
