# Refonte homepage — bandeau À la une + bibliothèque filtrable — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer dans `index.html` les sections `#series` (Favoris) + `#dossiers` (Dossiers) par une structure unifiée `#a-la-une` (3 cartes éditoriales) + `#bibliotheque` (grille filtrable avec chips Type, chips Thèmes, recherche texte, pagination « Voir 12 de plus », état URL).

**Architecture:** Tout reste vanilla — aucun framework, aucune dépendance. Le CSS s'ajoute au `<style>` existant en bas du `<head>`. Le JS s'ajoute en un bloc `<script>` IIFE juste avant `</body>`. Les 16 cartes existantes reçoivent leurs `data-*` (type, themes, date, numero, search-text) via un script Python idempotent dans `tools/`. Un test Node `node:test` zero-dep vérifie que toutes les cartes sont taggées et que les chips/IDs requis existent dans le HTML.

**Tech Stack:** HTML/CSS/JS vanilla, Python 3 + BeautifulSoup4 (script de tagging idempotent), Node 20+ `node:test` (suite de tests zero-dep alignée avec `tests/apps-integration.test.mjs`).

**Spec:** `docs/superpowers/specs/2026-05-10-homepage-filters-design.md` — à lire avant d'attaquer la première tâche.

**Branche:** `claude/homepage-filters` (déjà créée depuis `main`, le spec doc y est commité — `12b82f2`).

**Workflow commits :** chaque task se termine par un commit ciblé (pas de batch). Push vers `origin claude/homepage-filters` une fois Phase 5 terminée. Pas de push automatique tant que Mathieu n'a pas relu visuellement.

---

## Phase 1 — Tests + script de tagging

À la fin de cette phase : un test Node échoue parce qu'aucune carte n'est taggée. Le script Python `tools/tag_homepage_cards.py` existe mais n'a pas encore été exécuté. Mapping type+thèmes encodé en dur dans le script depuis le spec.

### Task 1.1 — Lire le spec et l'index actuel

**Files:**
- Read: `docs/superpowers/specs/2026-05-10-homepage-filters-design.md`
- Read: `index.html` (lignes 1-50 pour l'en-tête, 750-1980 pour les sections cartes)

- [ ] **Step 1: Lire le spec en entier**

Particulièrement les sections "Modèle de données par carte", "Mapping initial type + thèmes", "CSS — filter bar", "JS — comportement", "Migration".

- [ ] **Step 2: Repérer les frontières dans `index.html`**

Run:
```
grep -n 'class="serie"\|<section class="section series-wrap"\|</section>' index.html
```

Expected (les 16 cartes + les 2 sections à fusionner) :
- ligne 760 : `<section class="section series-wrap" id="series">` (Favoris, 4 cartes)
- ligne 1029 : `</section>` (fin Favoris)
- ligne 1031 : `<section class="section series-wrap" id="dossiers">` (Dossiers, 12 cartes)
- ligne 1978 : `</section>` (fin Dossiers)

### Task 1.2 — Créer le test Node de validation des `data-*`

**Files:**
- Create: `tests/homepage-filters.test.mjs`

- [ ] **Step 1: Écrire le test qui échoue**

Crée `tests/homepage-filters.test.mjs` avec :

```javascript
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

// Extract all .serie cards from #bibliotheque (after the fusion).
// During phase 1, cards are still in #series + #dossiers — we still match all of them.
const cardRe = /<a[^>]+class="serie[^"]*"[^>]*>/g;
const cards = html.match(cardRe) || [];

test('homepage exposes at least 16 .serie cards', () => {
  assert.ok(cards.length >= 16, `Found ${cards.length} cards, expected ≥ 16`);
});

for (const [idx, card] of cards.entries()) {
  const href = (card.match(/href="([^"]+)"/) || [])[1] || `card-${idx}`;

  test(`${href}: has data-type ∈ {veille, etude, dossier}`, () => {
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
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

Run:
```
node --test tests/homepage-filters.test.mjs
```

Expected: échec sur chaque carte (les `data-*` n'existent pas encore). Les 16 cartes doivent toutes être détectées par le regex initial — si le compte n'est pas ≥16, c'est un bug du test, pas du HTML.

- [ ] **Step 3: Commit**

```
git add tests/homepage-filters.test.mjs
git commit -m "test(homepage): contrat data-* sur les cartes .serie

Test node zero-dep qui vérifie que chaque .serie de index.html
porte data-type ∈ {veille,etude,dossier}, data-themes (1-3 tokens
valides), data-date YYYY-MM-DD, data-numero 2 digits, data-search-text
non-vide en minuscules sans accents.

Échoue actuellement (cartes pas encore taggées) — passe après Task 2.2."
```

### Task 1.3 — Créer le script Python de tagging

**Files:**
- Create: `tools/tag_homepage_cards.py`

- [ ] **Step 1: Écrire le script idempotent**

Crée `tools/tag_homepage_cards.py` :

```python
#!/usr/bin/env python3
"""Tag .serie cards in index.html with data-type, data-themes, data-date,
data-numero, data-search-text. Idempotent — re-run updates in place.

Mapping type + thèmes encodé ici depuis le spec
docs/superpowers/specs/2026-05-10-homepage-filters-design.md.
"""
from __future__ import annotations
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"

# slug → (type, [themes], iso_date)
# Date manquante (Avril 2026 sans jour) → 1er du mois.
CARDS = {
    "proces-musk-altman":     ("veille",  ["gouvernance", "economie"],   "2026-04-27"),
    "evaluation-agentique":   ("etude",   ["agentique", "production"],   "2026-05-01"),
    "observabilite-agents-ia":("etude",   ["agentique", "production"],   "2026-04-30"),
    "anatomie":               ("dossier", ["agentique"],                  "2026-04-01"),
    "mcp-plateforme":         ("dossier", ["agentique"],                  "2026-05-08"),
    "measure-roi":            ("dossier", ["economie"],                   "2026-05-07"),
    "ia-et-travail":          ("etude",   ["societe"],                    "2026-05-06"),
    "gouvernance":            ("dossier", ["gouvernance"],                "2026-04-01"),
    "agents-computer-use":    ("etude",   ["agentique"],                  "2026-05-06"),
    "economie-inference":     ("etude",   ["economie", "production"],     "2026-05-05"),
    "harness-agentique":      ("etude",   ["agentique"],                  "2026-05-05"),
    "memoire-agentique":      ("etude",   ["agentique"],                  "2026-05-04"),
    "modeles-raisonnement":   ("etude",   ["modeles"],                    "2026-05-02"),
    "world-models":           ("etude",   ["modeles"],                    "2026-04-30"),
    "llm-jailbreaking":       ("etude",   ["gouvernance"],                "2026-04-29"),
    "narrative-experiences":  ("dossier", ["storytelling"],               "2026-04-28"),
}

THEME_LABELS = {
    "agentique": "agentique",
    "production": "production",
    "modeles": "modeles recherche",
    "gouvernance": "gouvernance risques",
    "economie": "economie roi",
    "societe": "ia societe travail",
    "storytelling": "storytelling narrative",
}

def strip_accents(s: str) -> str:
    """Lower + NFD + drop combining marks."""
    return "".join(
        c for c in unicodedata.normalize("NFD", s.lower())
        if unicodedata.category(c) != "Mn"
    )

def extract_text(html: str) -> str:
    """Crude tag stripper: drop everything between < and >, collapse whitespace."""
    text = re.sub(r"<[^>]+>", " ", html)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def build_search_text(card_html: str, themes: list[str]) -> str:
    """title + sub + theme labels, normalized."""
    # Extract serie-title and serie-sub blocks.
    title_m = re.search(r'<h3 class="serie-title"[^>]*>(.*?)</h3>', card_html, re.S)
    sub_m   = re.search(r'<p class="serie-sub"[^>]*>(.*?)</p>',   card_html, re.S)
    title_text = extract_text(title_m.group(1)) if title_m else ""
    sub_text   = extract_text(sub_m.group(1))   if sub_m   else ""
    theme_text = " ".join(THEME_LABELS[t] for t in themes)
    combined = f"{title_text} {sub_text} {theme_text}"
    return strip_accents(combined)

def upsert_attr(opening_tag: str, attr: str, value: str) -> str:
    """Insert or replace `attr="value"` inside an <a ...> opening tag."""
    pattern = re.compile(rf'\s{re.escape(attr)}="[^"]*"')
    new_attr = f' {attr}="{value}"'
    if pattern.search(opening_tag):
        return pattern.sub(new_attr, opening_tag)
    # Insert before the closing >
    return opening_tag[:-1] + new_attr + ">"

def slug_from_href(href: str) -> str | None:
    m = re.fullmatch(r'([a-z][a-z0-9-]*)/', href)
    return m.group(1) if m else None

def numero_from_card(card_html: str) -> str | None:
    """Pull the leading 2-digit numero from <div class="serie-tag">."""
    m = re.search(r'<div class="serie-tag">(\d{2})\s*·', card_html)
    return m.group(1) if m else None

def main() -> int:
    src = INDEX.read_text(encoding="utf-8")
    # Match each <a class="serie ..." href="slug/" ...>...</a> block.
    card_re = re.compile(
        r'(<a\s+href="([^"]+)"\s+class="serie[^"]*"[^>]*>)(.*?)(</a>)',
        re.S,
    )
    updated = 0
    skipped = []

    def replace(match: re.Match) -> str:
        nonlocal updated
        opening, href, body, closing = match.groups()
        slug = slug_from_href(href)
        if slug is None or slug not in CARDS:
            skipped.append(href)
            return match.group(0)
        type_, themes, date = CARDS[slug]
        numero = numero_from_card(body) or "00"
        search_text = build_search_text(body, themes)
        opening = upsert_attr(opening, "data-type", type_)
        opening = upsert_attr(opening, "data-themes", " ".join(themes))
        opening = upsert_attr(opening, "data-date", date)
        opening = upsert_attr(opening, "data-numero", numero)
        opening = upsert_attr(opening, "data-search-text", search_text)
        updated += 1
        return opening + body + closing

    new_src = card_re.sub(replace, src)
    INDEX.write_text(new_src, encoding="utf-8")
    print(f"Tagged {updated} cards.")
    if skipped:
        print(f"Skipped (no slug mapping): {skipped}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 2: Vérifier la syntaxe Python**

Run:
```
python -c "import tools.tag_homepage_cards"
```

Expected: aucune erreur (tools/__init__.py existe peut-être pas — si erreur d'import, utiliser `python -m py_compile tools/tag_homepage_cards.py` à la place).

- [ ] **Step 3: Commit**

```
git add tools/tag_homepage_cards.py
git commit -m "tools: script idempotent de tagging des cartes homepage

tag_homepage_cards.py ajoute data-type, data-themes, data-date,
data-numero, data-search-text sur chaque <a class=\"serie\"> de
index.html. Mapping slug → (type, themes, date) encodé en dur
depuis le spec. Re-runnable en place via upsert_attr."
```

---

## Phase 2 — Application des tags

À la fin de cette phase : les 16 cartes portent leurs `data-*`. Le test `tests/homepage-filters.test.mjs` passe. Aucun autre changement de structure.

### Task 2.1 — Snapshot du HTML avant exécution

**Files:**
- Read: `index.html`

- [ ] **Step 1: Capturer un fingerprint avant**

Run:
```
git diff --stat HEAD -- index.html
wc -l index.html
```

Expected: 0 ligne diff (rien de modifié), 2103 lignes.

- [ ] **Step 2: Vérifier qu'aucune carte ne porte déjà des `data-*`**

Run:
```
grep -c 'data-themes=' index.html
```

Expected: `0`. Si > 0, le script a déjà tourné — abort et investiguer.

### Task 2.2 — Exécuter le script de tagging

**Files:**
- Modify: `index.html` (16 ouvertures de balise `<a class="serie">`)

- [ ] **Step 1: Lancer le script**

Run:
```
python tools/tag_homepage_cards.py
```

Expected output:
```
Tagged 16 cards.
```

Si "Skipped" apparaît, vérifier le mapping `CARDS` dans le script — un slug a peut-être été oublié.

- [ ] **Step 2: Vérifier le diff**

Run:
```
git diff --stat index.html
git diff index.html | grep "^\+" | grep "data-themes" | head -20
```

Expected: ~16 lignes modifiées dans `index.html` (un par carte). Chaque ligne ajoutée contient `data-type=`, `data-themes=`, `data-date=`, `data-numero=`, `data-search-text=`.

Vérification visuelle — la première carte doit ressembler à :
```html
<a href="proces-musk-altman/" class="serie" data-type="veille" data-themes="gouvernance economie" data-date="2026-04-27" data-numero="03" data-search-text="proces musk v. altman dossier de veille publie le jour de l'ouverture du proces a oakland chronologie tri-pistes anatomie juridique temoins ecosysteme financier application compagnon avec 52 regions interactives journal d'audience tenu jour apres jour gouvernance risques economie roi">
```

- [ ] **Step 3: Lancer le test Node pour vérifier qu'il passe**

Run:
```
node --test tests/homepage-filters.test.mjs
```

Expected: tous les tests passent (16 cartes × 5 assertions + 1 sanity = 81 tests `pass`, 0 `fail`).

Si une carte a un thème invalide ou une date manquante : retourner dans `tools/tag_homepage_cards.py`, corriger le mapping, re-runner le script (idempotent).

- [ ] **Step 4: Lancer la suite complète des tests pour vérifier qu'on n'a rien cassé**

Run:
```
node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs tests/homepage-filters.test.mjs
```

Expected: tout passe.

- [ ] **Step 5: Commit**

```
git add index.html
git commit -m "homepage: tag les 16 cartes .serie avec data-* (filters + search)

Application de tools/tag_homepage_cards.py. Aucune modification
visuelle — purement structurelle. Permet le filtrage et la
recherche client-side des prochaines tâches."
```

---

## Phase 3 — CSS pour la filter bar et les chips

À la fin de cette phase : les règles CSS sont en place dans `<style>` mais inutilisées (aucun HTML ne les déclenche encore). Pas de changement visuel.

### Task 3.1 — Ajouter les règles CSS de la bibliothèque

**Files:**
- Modify: `index.html` (insertion dans `<style>`, juste avant `/* ═════ PARCOURS ═════ */` à la ligne ~553)

- [ ] **Step 1: Localiser le point d'insertion**

Run:
```
grep -n "═════ PARCOURS" index.html
```

Expected: une ligne, ~553. Insérer le nouveau bloc CSS juste **avant** ce commentaire.

- [ ] **Step 2: Insérer le bloc CSS**

Insère ce bloc avant `/* ═════ PARCOURS ═════ */` :

```css
/* ═════ BIBLIOTHÈQUE FILTRÉE ═════ */
.featured-wrap {
  border-top: 1px solid var(--line-strong);
  padding-top: 54px;
}
.biblio-wrap {
  border-top: 1px solid var(--line-strong);
  padding-top: 54px;
}
.biblio-filters {
  position: sticky;
  top: 56px;
  z-index: 40;
  background: rgba(250, 246, 236, 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid transparent;
  margin: 24px -5vw 32px;
  padding: 16px 5vw;
  display: grid;
  grid-template-columns: minmax(240px, 1fr) auto auto;
  grid-template-areas:
    "search type counter"
    "search themes counter";
  gap: 12px 24px;
  align-items: center;
  transition: background 0.3s, border-color 0.3s;
}
.biblio-filters.scrolled {
  border-bottom-color: var(--line);
  background: rgba(250, 246, 236, 0.96);
}
.biblio-search { grid-area: search; }
.biblio-search input[type="search"] {
  width: 100%;
  padding: 10px 14px 10px 38px;
  border: 1px solid var(--line-strong);
  border-radius: 100px;
  background-color: var(--surface);
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%236b6f7c' stroke-width='1.5'><circle cx='7' cy='7' r='4.5'/><path d='m11 11 3 3'/></svg>");
  background-repeat: no-repeat;
  background-position: 14px center;
  background-size: 14px 14px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: var(--text);
  transition: border-color 0.15s;
}
.biblio-search input[type="search"]:focus {
  outline: none;
  border-color: var(--accent);
}
.biblio-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.biblio-chips[aria-label="Type d'artefact"] { grid-area: type; }
.biblio-chips[aria-label="Thèmes"] { grid-area: themes; }
.chip {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: 1px solid var(--line-strong);
  border-radius: 100px;
  background: transparent;
  color: var(--text-mid);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  white-space: nowrap;
}
.chip:hover { border-color: var(--text); color: var(--text); }
.chip[aria-checked="true"] {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}
.chip-type[data-type=""][aria-checked="true"] {
  background: var(--text);
  border-color: var(--text);
  color: var(--bg);
}
.biblio-counter {
  grid-area: counter;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--text-mid);
  white-space: nowrap;
  text-transform: uppercase;
}
.biblio-empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-mid);
}
.biblio-empty p {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 19px;
  margin-bottom: 16px;
}
.biblio-reset {
  appearance: none;
  background: transparent;
  border: 1px solid var(--line-strong);
  border-radius: 100px;
  padding: 9px 18px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.biblio-reset:hover { background: var(--text); color: var(--bg); }
.biblio-more-wrap {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
.biblio-more {
  appearance: none;
  background: var(--surface);
  border: 1px solid var(--line-strong);
  border-radius: 100px;
  padding: 14px 28px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}
.biblio-more:hover {
  background: var(--text);
  color: var(--bg);
  border-color: var(--text);
}
.biblio-more-arrow {
  display: inline-block;
  margin-left: 6px;
  transition: transform 0.15s;
}
.biblio-more:hover .biblio-more-arrow { transform: translateX(3px); }

@media (max-width: 960px) {
  .biblio-filters {
    grid-template-columns: 1fr;
    grid-template-areas:
      "search"
      "type"
      "themes"
      "counter";
    margin: 16px -6vw 24px;
    padding: 14px 6vw;
  }
  .biblio-counter { justify-self: end; font-size: 10px; }
  .biblio-chips {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    touch-action: pan-x;
  }
  .biblio-chips::-webkit-scrollbar { display: none; }
}
```

- [ ] **Step 3: Vérifier que le HTML reste bien formé**

Run:
```
grep -c "═════ BIBLIOTHÈQUE" index.html
grep -c "═════ PARCOURS" index.html
```

Expected: `1` et `1`.

- [ ] **Step 4: Vérifier l'absence de régression visuelle**

Ouvrir `index.html` dans un navigateur (ou via Playwright local). La page doit être strictement identique à avant — aucun élément `.biblio-*` n'existe encore dans le HTML, donc le CSS dort.

- [ ] **Step 5: Commit**

```
git add index.html
git commit -m "homepage: ajoute le CSS de la bibliothèque filtrée

Règles .biblio-filters (sticky), .chip, .biblio-empty, .biblio-more,
.biblio-counter, et adaptations mobile @960px. Pas encore utilisé —
le HTML cible vient en Phase 4. Aucun changement visuel."
```

---

## Phase 4 — Restructuration HTML : À la une + Bibliothèque

À la fin de cette phase : les sections `#series` et `#dossiers` ont disparu, remplacées par `#a-la-une` (3 cartes featured) + `#bibliotheque` (filter bar + 16 cartes). Aucun JS encore. Les filtres sont visibles mais inertes. Les ancres `#series` et `#dossiers` redirigent via `<span>` invisibles.

### Task 4.1 — Choisir et préparer les 3 cartes featured

**Files:**
- Read: `index.html` (cartes proces-musk-altman, evaluation-agentique, mcp-plateforme)

- [ ] **Step 1: Confirmer le choix initial**

Choix par défaut du spec : `proces-musk-altman` · `evaluation-agentique` · `mcp-plateforme`.

Si Mathieu veut changer ces 3 cartes, c'est ici qu'on le fait — modifier la section À la une de la Task 4.2 ci-dessous en conséquence.

- [ ] **Step 2: Extraire le HTML de chaque carte choisie**

Run:
```
grep -n 'href="proces-musk-altman/"' index.html
grep -n 'href="evaluation-agentique/"' index.html
grep -n 'href="mcp-plateforme/"' index.html
```

Note les lignes de début. Chaque bloc `<a class="serie" …>…</a>` s'étend jusqu'au prochain `</a>` qui ferme la balise (multi-ligne, ~50-200 lignes par carte selon la complexité du SVG).

Tu vas dupliquer ces blocs dans la nouvelle section À la une. Pas besoin de modifier les `data-*` — c'est exactement le même contenu que dans la grille.

### Task 4.2 — Remplacer les sections #series + #dossiers

**Files:**
- Modify: `index.html` (lignes ~760-1978, fusion en 1 seul bloc)

- [ ] **Step 1: Remplacer la section #series**

Localiser :
- Ligne 760 : `<section class="section series-wrap" id="series">`
- Ligne 1029 : `</section>` (fin de #series)

Remplacer **tout** le bloc 760-1029 par cette nouvelle section À la une :

```html
<section class="section featured-wrap" id="a-la-une">
  <div class="series-head">
    <div>
      <div class="section-eyebrow">À la une</div>
      <h2>Trois <em>repères</em> en ce moment.</h2>
    </div>
    <span class="series-hint">3 sélections · mai 2026</span>
  </div>
  <p class="section-lede">Lecture proposée. Le reste vit dans <a href="#bibliotheque">la bibliothèque</a> ci-dessous.</p>

  <div class="series-grid featured-grid">

    <!-- COPIE de la carte proces-musk-altman (HTML complet du <a class="serie" … href="proces-musk-altman/" …> jusqu'au </a> correspondant) -->

    <!-- COPIE de la carte evaluation-agentique -->

    <!-- COPIE de la carte mcp-plateforme -->

  </div>
</section>
```

Les 3 commentaires `<!-- COPIE … -->` doivent être remplacés par les blocs HTML complets des 3 cartes choisies, **copiés** depuis l'ancienne section #series (proces-musk-altman, evaluation-agentique) ou #dossiers (mcp-plateforme).

- [ ] **Step 2: Remplacer la section #dossiers par la Bibliothèque**

Localiser le nouveau point :
- Ligne où commence `<section class="section series-wrap" id="dossiers">` (était ~1031, maintenant décalée par les changements ci-dessus)
- Le `</section>` qui ferme la section dossiers (était ~1978)

Remplacer **tout** le bloc par :

```html
<section class="section biblio-wrap" id="bibliotheque">
  <span id="series" aria-hidden="true" style="display:block;height:0"></span>
  <span id="dossiers" aria-hidden="true" style="display:block;height:0"></span>

  <div class="series-head">
    <div>
      <div class="section-eyebrow">Bibliothèque</div>
      <h2>Tous les <em>artefacts</em>.</h2>
    </div>
    <span class="series-hint" id="biblio-total">16 publications · 2026</span>
  </div>
  <p class="section-lede">Filtre par type, par thème, ou cherche un sujet. <strong>Tout est ici.</strong></p>

  <form class="biblio-filters" role="search" aria-label="Filtrer la bibliothèque">
    <div class="biblio-search">
      <input type="search" id="biblio-q"
             placeholder="Rechercher un sujet, un titre…"
             aria-label="Rechercher dans les artefacts"
             autocomplete="off">
    </div>

    <div class="biblio-chips" role="radiogroup" aria-label="Type d'artefact">
      <button type="button" class="chip chip-type" role="radio"
              aria-checked="true" data-type="">Tous</button>
      <button type="button" class="chip chip-type" role="radio"
              aria-checked="false" data-type="veille">Veille</button>
      <button type="button" class="chip chip-type" role="radio"
              aria-checked="false" data-type="etude">Étude</button>
      <button type="button" class="chip chip-type" role="radio"
              aria-checked="false" data-type="dossier">Dossier</button>
    </div>

    <div class="biblio-chips" role="group" aria-label="Thèmes">
      <button type="button" class="chip chip-theme" role="checkbox"
              aria-checked="false" data-theme="agentique">Agentique</button>
      <button type="button" class="chip chip-theme" role="checkbox"
              aria-checked="false" data-theme="production">Production</button>
      <button type="button" class="chip chip-theme" role="checkbox"
              aria-checked="false" data-theme="modeles">Modèles &amp; recherche</button>
      <button type="button" class="chip chip-theme" role="checkbox"
              aria-checked="false" data-theme="gouvernance">Gouvernance &amp; risques</button>
      <button type="button" class="chip chip-theme" role="checkbox"
              aria-checked="false" data-theme="economie">Économie &amp; ROI</button>
      <button type="button" class="chip chip-theme" role="checkbox"
              aria-checked="false" data-theme="societe">IA &amp; société</button>
      <button type="button" class="chip chip-theme" role="checkbox"
              aria-checked="false" data-theme="storytelling">Storytelling &amp; narrative</button>
    </div>

    <div class="biblio-counter" aria-live="polite">
      <span id="biblio-shown">12</span> / <span id="biblio-matched">16</span>
    </div>
  </form>

  <div class="series-grid biblio-grid" id="biblio-grid">

    <!-- 16 cartes .serie ICI : COPIE intégrale des 4 cartes ex-#series + 12 cartes ex-#dossiers, dans l'ordre actuel (date desc). -->

  </div>

  <div class="biblio-empty" id="biblio-empty" hidden>
    <p>Aucun artefact ne correspond à ces filtres.</p>
    <button type="button" class="biblio-reset" id="biblio-reset">Réinitialiser tous les filtres</button>
  </div>

  <div class="biblio-more-wrap" id="biblio-more-wrap">
    <button type="button" class="biblio-more" id="biblio-more">
      Voir <span id="biblio-more-count">12</span> de plus <span class="biblio-more-arrow">→</span>
    </button>
  </div>
</section>
```

Le commentaire `<!-- 16 cartes … -->` doit être remplacé par les 16 blocs `<a class="serie" …>…</a>` complets, dans l'ordre actuel **par date desc** (`mcp-plateforme` d'abord — date 2026-05-08, puis `measure-roi` 2026-05-07, puis `ia-et-travail` 2026-05-06, puis `agents-computer-use` 2026-05-06, etc., jusqu'à `anatomie` 2026-04-01 et `gouvernance` 2026-04-01 en derniers).

L'ordre actuel dans le HTML est déjà date desc — il suffit donc de **fusionner les 4 cartes de #series + les 12 cartes de #dossiers en respectant cet ordre**. Concrètement : prendre les 4 cartes #series et les insérer aux bonnes positions dans la séquence des 12 cartes #dossiers selon leur date.

Référence d'ordre attendu (par `data-date` desc) :
1. mcp-plateforme · 2026-05-08
2. measure-roi · 2026-05-07
3. ia-et-travail · 2026-05-06
4. agents-computer-use · 2026-05-06
5. economie-inference · 2026-05-05
6. harness-agentique · 2026-05-05
7. memoire-agentique · 2026-05-04
8. modeles-raisonnement · 2026-05-02
9. evaluation-agentique · 2026-05-01
10. observabilite-agents-ia · 2026-04-30
11. world-models · 2026-04-30
12. llm-jailbreaking · 2026-04-29
13. narrative-experiences · 2026-04-28
14. proces-musk-altman · 2026-04-27
15. anatomie · 2026-04-01
16. gouvernance · 2026-04-01

- [ ] **Step 3: Mettre à jour le lien "Dossiers" de la topbar**

Localiser :
```
grep -n 'href="#series">Dossiers</a>' index.html
```

Expected: ligne 753.

Remplacer :
```html
<a href="#series">Dossiers</a>
```
par :
```html
<a href="#bibliotheque">Bibliothèque</a>
```

- [ ] **Step 4: Lancer la suite des tests**

Run:
```
node --test tests/homepage-filters.test.mjs
```

Expected: tous les tests passent. Le test detecte les cartes via regex global, donc il n'est pas affecté par la duplication featured.

Vérification supplémentaire — il y a maintenant **19** cartes (16 dans la bibliothèque + 3 dans À la une qui sont des duplicatas) :
```
grep -c 'class="serie"' index.html
```
Expected: `19` (à confirmer — peut être 20 si une carte coming-soon `class="serie coming-soon"` traîne).

```
grep -c 'class="serie coming-soon"' index.html
```
Expected: probablement `0` ou `1`. Si `1`, le total est 20.

- [ ] **Step 5: Vérification visuelle**

Ouvrir `index.html` dans un navigateur. Comportement attendu :
- Section "À la une" visible avec 3 cartes en grille 3 colonnes desktop.
- Section "Bibliothèque" en dessous avec la filter bar (sticky) et toutes les 16 cartes affichées (le JS de pagination n'est pas encore là, donc tout sort).
- Les chips sont cliquables visuellement mais ne filtrent rien.
- La recherche ne filtre rien.
- Le bouton "Voir 12 de plus" est visible mais inerte.
- Le clic sur "Bibliothèque" dans la topbar scrolle vers la nouvelle section.
- Les liens externes pointant vers `#series` ou `#dossiers` (en hash dans l'URL) doivent toujours scroller vers le bon endroit grâce aux `<span>` de compat.

- [ ] **Step 6: Commit**

```
git add index.html
git commit -m "homepage: fusion #series + #dossiers en À la une + Bibliothèque

Section #a-la-une (3 cartes featured curées éditorialement) +
section #bibliotheque (filter bar inerte + grille 16 cartes triées
date desc). Spans de compat pour préserver les ancres #series et
#dossiers existantes. Topbar lien 'Dossiers' → 'Bibliothèque'.
JS de filtrage en Phase 5."
```

---

## Phase 5 — JavaScript : filtrage, recherche, pagination, URL state

À la fin de cette phase : la filter bar est entièrement fonctionnelle. Les chips filtrent, la recherche filtre, la pagination paginé, l'URL se synchronise, l'empty state s'affiche, le reset marche.

### Task 5.1 — Ajouter le bloc `<script>` IIFE

**Files:**
- Modify: `index.html` (insertion juste avant `</body>`)

- [ ] **Step 1: Localiser le point d'insertion**

Run:
```
grep -n "</body>" index.html
```

Expected: une seule ligne, en bas du fichier (dans les ~10 dernières).

Vérifier qu'il existe déjà un `<script>` pour la topbar scroll handler :
```
grep -n "topbar.*scrolled\|scroll" index.html | tail -10
```

S'il y en a un, l'isoler — on ajoute notre nouveau bloc juste **après** lui (et juste **avant** `</body>`).

- [ ] **Step 2: Insérer le bloc IIFE**

Insère ce bloc juste avant `</body>` :

```html
<script>
(function () {
  const PAGE_SIZE = 12;

  const grid = document.getElementById('biblio-grid');
  if (!grid) return; // page hors index.html — silently no-op

  const cards = Array.from(grid.querySelectorAll('.serie'));
  const searchInput = document.getElementById('biblio-q');
  const typeChips = document.querySelectorAll('.chip-type');
  const themeChips = document.querySelectorAll('.chip-theme');
  const shownEl = document.getElementById('biblio-shown');
  const matchedEl = document.getElementById('biblio-matched');
  const moreCountEl = document.getElementById('biblio-more-count');
  const moreBtn = document.getElementById('biblio-more');
  const moreWrap = document.getElementById('biblio-more-wrap');
  const empty = document.getElementById('biblio-empty');
  const resetBtn = document.getElementById('biblio-reset');
  const filtersForm = document.querySelector('.biblio-filters');

  const TOTAL = cards.length;

  let state = {
    q: '',
    type: '',
    themes: new Set(),
    shown: PAGE_SIZE,
  };

  // ── 1. URL state ─────────────────────────────────────────────────
  function readUrl() {
    const p = new URLSearchParams(location.search);
    state.q = p.get('q') || '';
    state.type = p.get('type') || '';
    const t = p.get('theme');
    state.themes = t ? new Set(t.split(',').filter(Boolean)) : new Set();
  }
  function writeUrl() {
    const p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.type) p.set('type', state.type);
    if (state.themes.size) p.set('theme', Array.from(state.themes).join(','));
    const qs = p.toString();
    const target = qs ? '?' + qs : location.pathname;
    history.replaceState(null, '', target + location.hash);
  }

  // ── 2. Normalize search (lower + NFD + drop combining diacritics U+0300..U+036F) ─
  function norm(s) {
    return (s || '').toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  // ── 3. Filter ───────────────────────────────────────────────────
  function matches(card) {
    if (state.type && card.dataset.type !== state.type) return false;
    if (state.themes.size) {
      const cardThemes = (card.dataset.themes || '').split(/\s+/);
      const hit = cardThemes.some(t => state.themes.has(t));
      if (!hit) return false;
    }
    if (state.q) {
      const needle = norm(state.q);
      const hay = card.dataset.searchText || '';
      if (!hay.includes(needle)) return false;
    }
    return true;
  }

  // ── 4. Render ───────────────────────────────────────────────────
  function render() {
    let matched = 0, shown = 0;
    cards.forEach(card => {
      const ok = matches(card);
      if (!ok) { card.hidden = true; return; }
      matched++;
      if (shown < state.shown) {
        card.hidden = false;
        shown++;
      } else {
        card.hidden = true;
      }
    });
    shownEl.textContent = shown;
    matchedEl.textContent = matched;
    empty.hidden = matched > 0;
    moreWrap.hidden = matched <= state.shown;
    grid.hidden = matched === 0;
    const remaining = Math.max(0, matched - state.shown);
    moreCountEl.textContent = Math.min(PAGE_SIZE, remaining);
  }

  // ── 5. Sync UI from state (for load + reset) ────────────────────
  function syncUi() {
    searchInput.value = state.q;
    typeChips.forEach(c => {
      const on = (c.dataset.type || '') === state.type;
      c.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    themeChips.forEach(c => {
      const on = state.themes.has(c.dataset.theme);
      c.setAttribute('aria-checked', on ? 'true' : 'false');
    });
  }

  // ── 6. Reset ────────────────────────────────────────────────────
  function reset() {
    state = { q: '', type: '', themes: new Set(), shown: PAGE_SIZE };
    syncUi();
    writeUrl();
    render();
  }

  // ── 7. Event listeners ──────────────────────────────────────────
  let qTimer;
  searchInput.addEventListener('input', e => {
    clearTimeout(qTimer);
    qTimer = setTimeout(() => {
      state.q = e.target.value;
      state.shown = PAGE_SIZE;
      writeUrl();
      render();
    }, 100);
  });

  typeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      state.type = chip.dataset.type || '';
      state.shown = PAGE_SIZE;
      syncUi();
      writeUrl();
      render();
    });
  });

  themeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const t = chip.dataset.theme;
      if (state.themes.has(t)) state.themes.delete(t);
      else state.themes.add(t);
      state.shown = PAGE_SIZE;
      syncUi();
      writeUrl();
      render();
    });
  });

  moreBtn.addEventListener('click', () => {
    state.shown += PAGE_SIZE;
    render();
  });

  resetBtn.addEventListener('click', reset);

  // Submit a form by pressing Enter in the search shouldn't reload the page.
  filtersForm.addEventListener('submit', e => e.preventDefault());

  // ── 8. Sticky scroll border ─────────────────────────────────────
  function checkScroll() {
    const top = filtersForm.getBoundingClientRect().top;
    filtersForm.classList.toggle('scrolled', top <= 57);
  }
  window.addEventListener('scroll', checkScroll, { passive: true });

  // ── 9. Init ─────────────────────────────────────────────────────
  readUrl();
  syncUi();
  render();
  checkScroll();
})();
</script>
```

- [ ] **Step 3: Vérifier que le HTML est bien formé**

Run:
```
grep -c "</script>" index.html
```

Expected: au moins 2 (le script existant pour la topbar + le nouveau).

```
grep -c "</body>" index.html
```

Expected: `1`.

- [ ] **Step 4: Vérification visuelle navigateur**

Ouvrir `index.html` dans un navigateur. Tester :

1. **Au chargement** : 12 cartes visibles dans la bibliothèque, compteur "12 / 16", bouton "Voir 4 de plus" visible.
2. **Cliquer "Voir 4 de plus"** : 16 cartes visibles, bouton disparaît.
3. **Cliquer chip "Veille"** : seule la carte `proces-musk-altman` reste, compteur "1 / 1", bouton "Voir plus" disparu, autres chips Type désactivés visuellement.
4. **Cliquer chip "Tous"** : retour à 12 cartes / 16.
5. **Cliquer chip "Agentique"** : 7 cartes restent (cf. mapping spec).
6. **Cliquer chip "Production"** en plus : OR logique → entre 7 et 10 cartes (Agentique ∪ Production = 7 + 3 - chevauchement).
7. **Re-cliquer chip "Production"** : revient à 7 cartes (Agentique seul).
8. **Re-cliquer chip "Agentique"** : retour à 16/16.
9. **Taper "eval" dans la recherche** : seules les cartes contenant "eval" dans titre/sub/thèmes sortent (≥ 1 — `evaluation-agentique` au minimum, possiblement `observabilite-agents-ia` si "évaluation" mentionné).
10. **Combinaison** : Type=Étude + Thème=Production + recherche="metrique" → résultat précis.
11. **Aucun résultat** : taper "zzzzz" → empty state visible avec bouton Réinitialiser.
12. **Cliquer Réinitialiser** : tout se remet à zéro, 12/16 cartes.
13. **URL state** : sélectionner Type=veille + Thème=gouvernance → URL devient `?type=veille&theme=gouvernance`. Recharger la page → filtres restaurés, compteur cohérent.
14. **Sticky bar** : scroller dans la grille → la filter bar reste collée sous la topbar avec border-bottom apparente (classe `.scrolled`).
15. **Mobile (375px)** : DevTools → mode mobile. Filter bar en colonne, chips scrollables horizontalement, cartes en single column.

- [ ] **Step 5: Commit**

```
git add index.html
git commit -m "homepage: branche le JS de filtrage de la bibliothèque

Bloc IIFE ~150 lignes : filtrage chips Type (single) + chips Thèmes
(multi OR), recherche texte instantanée (debounce 100ms, accent-strip),
pagination 'Voir 12 de plus', état URL via history.replaceState,
empty state avec reset, sticky scroll border. Aucune dépendance —
vanilla pur."
```

---

## Phase 6 — QA et finitions

À la fin de cette phase : la branche est prête à être poussée et reviewée. Pas de PR encore — Mathieu valide visuellement avant.

### Task 6.1 — Test cross-browser et mobile

**Files:** aucune modification, juste validation.

- [ ] **Step 1: Tester sur Chrome desktop**

Ouvrir l'`index.html` local. Faire les 15 vérifications de Task 5.1 Step 4.

- [ ] **Step 2: Tester sur Safari (si dispo)**

Particulièrement : `backdrop-filter` (filter bar), `-webkit-overflow-scrolling: touch` (chips scroll mobile), `:focus-visible` sur chips.

- [ ] **Step 3: Tester sur Firefox**

Vérifier `appearance: none` sur les chips et le bouton search (Firefox a un styling natif différent).

- [ ] **Step 4: Tester mobile réel ou DevTools mobile (iPhone 12 Pro = 390×844)**

Particulièrement :
- La filter bar sticky ne déborde pas sur les côtés (pas de scroll horizontal de page).
- Les chips scrollent horizontalement à l'intérieur de leur conteneur.
- L'input search prend toute la largeur.
- Les cartes en single column.
- Le compteur reste lisible.

- [ ] **Step 5: Si tout est OK, sinon : itérer**

Noter les problèmes, corriger, re-commit.

### Task 6.2 — Vérification finale a11y et Lighthouse

**Files:** aucune modification, juste validation.

- [ ] **Step 1: Audit a11y manuel**

Tab dans la page : ordre attendu = topbar → hero → cartes À la une → recherche → chips Type → chips Thèmes → cartes biblio → bouton Voir plus → footer.

Vérifier que le focus est visible sur chaque chip et sur le bouton search.

- [ ] **Step 2: Lighthouse (Chrome DevTools)**

Run dans DevTools → Lighthouse → Mobile → Performance + Accessibility + Best Practices.

Expected:
- Accessibility ≥ 95 (les `aria-label`, `aria-checked`, `aria-live` doivent suffire).
- Performance ≥ 85 (15 cartes + ~150 lignes JS + 1 IIFE = négligeable).
- Pas de régression vs avant la refonte.

- [ ] **Step 3: Si problème a11y, corriger et re-commit**

### Task 6.3 — Préparer la PR

**Files:** aucune modification.

- [ ] **Step 1: Vérifier l'état de la branche**

Run:
```
git log --oneline main..HEAD
git status --short
```

Expected:
- ~6-7 commits depuis main (un par task qui modifie du code).
- Working tree clean.

- [ ] **Step 2: Vérifier le diff total**

Run:
```
git diff --stat main..HEAD
```

Expected:
- `docs/superpowers/specs/2026-05-10-homepage-filters-design.md` créé
- `docs/superpowers/plans/2026-05-10-homepage-filters.md` créé
- `tools/tag_homepage_cards.py` créé
- `tests/homepage-filters.test.mjs` créé
- `index.html` modifié significativement (CSS + HTML + JS)

- [ ] **Step 3: Lire le diff de `index.html` une dernière fois**

Run:
```
git diff main..HEAD -- index.html | head -200
```

Vérifier :
- Aucune carte n'a perdu son contenu (titre, sub, SVG cover, meta, CTA).
- Aucune ancre vers `#series` ou `#dossiers` n'a été cassée (les `<span>` de compat sont en place).
- Le CSS ajouté n'a pas écrasé une autre règle existante.

- [ ] **Step 4: Pousser la branche vers origin**

Run:
```
git push -u origin claude/homepage-filters
```

Expected: push OK. Mathieu peut maintenant ouvrir la PR via l'UI GitHub ou via le MCP GitHub.

- [ ] **Step 5: Notifier Mathieu**

Message attendu pour Mathieu : "Branche `claude/homepage-filters` poussée. PR à ouvrir manuellement vers `main`. Spec et plan dans `docs/superpowers/`. À tester en local : ouvrir `index.html`, vérifier les 15 scénarios de la Task 5.1 Step 4."
