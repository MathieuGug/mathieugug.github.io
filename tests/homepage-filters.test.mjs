import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(ROOT, 'index.html'), 'utf8');

const VALID_TYPES = ['veille', 'etude', 'dossier'];
const VALID_THEMES = [
  'agentique', 'production', 'modeles',
  'gouvernance', 'economie', 'societe', 'storytelling'
];

const cardRe = /<a[^>]+class="serie[^"]*"[^>]*>/g;
const cards = html.match(cardRe) || [];

test('homepage exposes at least 16 .serie cards', () => {
  assert.ok(cards.length >= 16, `Found ${cards.length} cards, expected >= 16`);
});

for (const [idx, card] of cards.entries()) {
  const href = (card.match(/href="([^"]+)"/) || [])[1] || `card-${idx}`;

  test(`${href}: has data-type in {veille, etude, dossier}`, () => {
    const m = card.match(/data-type="([^"]*)"/);
    assert.ok(m, `${href} is missing data-type`);
    assert.ok(VALID_TYPES.includes(m[1]),
      `${href} has invalid data-type="${m[1]}"`);
  });

  test(`${href}: has data-themes (1-3 valid tokens)`, () => {
    const m = card.match(/data-themes="([^"]*)"/);
    assert.ok(m, `${href} is missing data-themes`);
    const tokens = m[1].split(/\s+/).filter(Boolean);
    assert.ok(tokens.length >= 1 && tokens.length <= 3,
      `${href} has ${tokens.length} themes, expected 1-3`);
    for (const t of tokens) {
      assert.ok(VALID_THEMES.includes(t),
        `${href} has invalid theme "${t}"`);
    }
  });

  test(`${href}: has data-date in YYYY-MM-DD`, () => {
    const m = card.match(/data-date="(\d{4}-\d{2}-\d{2})"/);
    assert.ok(m, `${href} is missing valid data-date`);
  });

  test(`${href}: has data-numero (2 digits)`, () => {
    const m = card.match(/data-numero="(\d{2})"/);
    assert.ok(m, `${href} is missing data-numero`);
  });

  test(`${href}: has data-search-text (non-empty, lowercase, no accents)`, () => {
    const m = card.match(/data-search-text="([^"]*)"/);
    assert.ok(m, `${href} is missing data-search-text`);
    const text = m[1];
    assert.ok(text.length >= 20, `${href} has search-text too short`);
    assert.ok(text === text.toLowerCase(), `${href} search-text must be lowercase`);
    assert.ok(!/[éèêëàâäîïôöùûüç]/.test(text),
      `${href} search-text contains accented chars (must be normalized)`);
  });
}
