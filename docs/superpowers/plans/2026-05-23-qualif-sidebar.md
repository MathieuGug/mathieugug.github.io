# Sidebar qualif (nav + état) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter une 3e sidebar `#qualif-nav` à droite de la prose (au-dessus de `#sources`) qui liste les 6 axes du widget de qualif avec leur état de complétude et un lien direct vers chaque mini-bloc inline. Mobile = drawer plein écran via un 3e bouton topbar.

**Architecture:** Sidebar nav-only (zéro input, lit le state existant). Grille `.layout` actuelle (3 cols `240px | 1fr | 320px`) inchangée — `#qualif-nav` et `#sources` cohabitent dans la col 3 via stacking sticky. Mobile : drawer `position: fixed; inset: 0; z-index: 90` activé par `#toggle-qualif`, même pattern que TOC/Sources existants.

**Tech Stack:** Vanilla JS (extension de `assets/dossier-qualif.js`), CSS (extension de `assets/dossier-qualif.css`), Python (extension de `tools/insert_qualif.py`), tests Node natifs.

**Spec:** `docs/superpowers/specs/2026-05-23-qualif-sidebar-design.md`.

**Branche:** `claude/business-qualif-widget-2026-05-23` (déjà ouverte en PR #104 — les commits de cette feature s'ajoutent à la PR existante).

---

## Phase 1 — Helper JS partagé + sidebar binding

À la fin : `axisCompletion()` est un helper pur réutilisé par `updateStepWitness` et `updateNavState`. La sidebar s'allume sur la page mais le markup n'est pas encore injecté (placeholder DOM check).

### Task 1.1 — Extraire `axisCompletion()` + refactor `updateStepWitness`

**Files:**
- Modify: `assets/dossier-qualif.js`

- [ ] **Step 1: Ajouter le helper pur `axisCompletion`**

Dans `assets/dossier-qualif.js`, **juste au-dessus** de la fonction existante `function updateStepWitness(step, axis, state)`, ajouter :

```javascript
  /**
   * Helper pur : compte les inputs renseignés d'un axe.
   * Retourne { filled: number, total: number, isComplete: boolean }.
   * Réutilisé par updateStepWitness (mini-bloc inline) et updateNavState (sidebar).
   */
  function axisCompletion(axis, state) {
    const total = axis.inputs.length;
    let filled = 0;
    for (let i = 0; i < axis.inputs.length; i++) {
      const input = axis.inputs[i];
      const key = axis.id + '.' + input.id;
      const v = state[key];
      if (v === undefined || v === null) continue;
      if (Array.isArray(v) && v.length === 0) continue;
      if (typeof v === 'string' && v === '') continue;
      filled++;
    }
    return { filled: filled, total: total, isComplete: filled === total };
  }
```

- [ ] **Step 2: Refactor `updateStepWitness` pour utiliser le helper**

Remplacer la fonction existante `updateStepWitness` par :

```javascript
  function updateStepWitness(step, axis, state) {
    const witness = step.querySelector('.qualif-step__witness');
    const seeRecap = step.querySelector('.qualif-step__see-recap');
    if (!witness) return;

    const { filled, total, isComplete } = axisCompletion(axis, state);

    if (filled === 0) {
      witness.textContent = '— En attente de saisie';
      if (seeRecap) seeRecap.hidden = true;
    } else if (!isComplete) {
      witness.textContent = filled + ' sur ' + total + ' renseignés';
      if (seeRecap) seeRecap.hidden = false;
    } else {
      witness.textContent = '✓ Axe pris en compte';
      if (seeRecap) seeRecap.hidden = false;
    }
  }
```

- [ ] **Step 3: Vérifier la suite de tests passe toujours**

Run:
```bash
node --test tests/qualif-contract.test.mjs tests/qualif-engine.test.mjs tests/qualif-integration.test.mjs
```

Expected : tests `36 + 8 + 8 = 52` qualif tests, all pass (regression check — comportement de `updateStepWitness` inchangé).

- [ ] **Step 4: Commit**

```bash
git add assets/dossier-qualif.js
git commit -m "refactor(qualif): extraire axisCompletion() (réutilisé par sidebar)"
```

### Task 1.2 — Ajouter `wireQualifNav` + `updateNavState`

**Files:**
- Modify: `assets/dossier-qualif.js`

- [ ] **Step 1: Ajouter `wireQualifNav(handles)`**

Dans `assets/dossier-qualif.js`, **juste après** la fonction `wireRecap(handles)`, ajouter :

```javascript
  function wireQualifNav(handles) {
    const nav = document.querySelector('aside#qualif-nav');
    if (!nav) return;

    // Topbar toggle button (mobile)
    const toggleBtn = document.querySelector('#toggle-qualif');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        nav.classList.toggle('open');
        document.body.classList.toggle('has-panel-open', nav.classList.contains('open'));
      });
    }

    // Panel close button
    const closeBtn = nav.querySelector('.panel-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        nav.classList.remove('open');
        document.body.classList.remove('has-panel-open');
      });
    }

    // ESC closes the drawer (mobile)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        document.body.classList.remove('has-panel-open');
      }
    });

    // Click on any axis link → close drawer (mobile) then native scroll
    nav.querySelectorAll('a[href^="#qualif-step-"]').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        document.body.classList.remove('has-panel-open');
      });
    });
    // Same for "Voir mon profil ↓"
    const seeRecap = nav.querySelector('a[href="#qualif-recap"]');
    if (seeRecap) {
      seeRecap.addEventListener('click', function () {
        nav.classList.remove('open');
        document.body.classList.remove('has-panel-open');
      });
    }
  }
```

- [ ] **Step 2: Ajouter `updateNavState(handles)`**

Dans `assets/dossier-qualif.js`, **juste après** `wireQualifNav`, ajouter :

```javascript
  function updateNavState(handles) {
    const nav = document.querySelector('aside#qualif-nav');
    if (!nav) return;

    handles.config.axes.forEach(function (axis) {
      const li = nav.querySelector('li[data-axis="' + axis.id + '"]');
      if (!li) return;
      const stateEl = li.querySelector('[data-bind="state"]');
      const { filled, total, isComplete } = axisCompletion(axis, handles.state);

      li.classList.remove('is-empty', 'is-partial', 'is-complete');
      if (filled === 0) {
        li.classList.add('is-empty');
        if (stateEl) stateEl.textContent = '0 / ' + total;
      } else if (isComplete) {
        li.classList.add('is-complete');
        if (stateEl) stateEl.textContent = '✓';
      } else {
        li.classList.add('is-partial');
        if (stateEl) stateEl.textContent = filled + ' / ' + total;
      }
    });
  }
```

- [ ] **Step 3: Brancher `wireQualifNav` dans `init()`**

Dans `init()`, trouver la séquence `wireSteps(handles); wireRecap(handles); renderAll(handles);` et la remplacer par :

```javascript
      wireSteps(handles);
      wireRecap(handles);
      wireQualifNav(handles);
      renderAll(handles);
```

- [ ] **Step 4: Brancher `updateNavState` dans `renderAll()`**

Dans `renderAll(handles)`, après la ligne `renderRecapUI(config, vec, filledCount, profile, adjRecos);`, ajouter une ligne :

```javascript
    updateNavState(handles);
```

- [ ] **Step 5: Vérifier syntaxe**

Run:
```bash
node -e "const vm = require('vm'); const fs = require('fs'); vm.compileFunction(fs.readFileSync('assets/dossier-qualif.js', 'utf8')); console.log('syntax OK')"
```

Expected: `syntax OK`.

- [ ] **Step 6: Vérifier la suite de tests passe toujours**

Run:
```bash
node --test tests/qualif-contract.test.mjs tests/qualif-engine.test.mjs tests/qualif-integration.test.mjs
```

Expected : 52/52 pass (nouvelles fonctions touchent le DOM, pas le moteur ; pas de régression).

- [ ] **Step 7: Commit**

```bash
git add assets/dossier-qualif.js
git commit -m "feat(qualif): wireQualifNav + updateNavState — sidebar nav + état dynamique"
```

---

## Phase 2 — CSS sidebar (desktop sticky + mobile drawer)

À la fin : `assets/dossier-qualif.css` rend la sidebar visuellement correcte sur desktop et mobile, mais le markup n'est pas encore injecté dans l'app GCP.

### Task 2.1 — Ajouter le bloc CSS `.qualif-nav` (desktop + identité visuelle)

**Files:**
- Modify: `assets/dossier-qualif.css`

- [ ] **Step 1: Ajouter le bloc CSS principal**

Dans `assets/dossier-qualif.css`, **juste avant** le bloc `@media (max-width: 1024px)` (la section mobile), ajouter :

```css
/* ─────────────────────────────────────────────────────────────────────────
 * Sidebar qualif — nav + état (desktop)
 *
 * Cohabite avec #sources dans la col 3 du grid .layout via grid-column:3.
 * Sticky en haut, sources sticky en-dessous.
 * ───────────────────────────────────────────────────────────────────────── */

aside#qualif-nav {
  grid-column: 3;
  align-self: start;
  position: sticky;
  top: 56px;
  padding: 24px 20px 20px 20px;
  border-left: 3px solid var(--qualif);
  background: var(--paper, #faf6ec);
  font-family: var(--sans, 'Inter', sans-serif);
  z-index: 5;
}

.qualif-nav__head {
  position: relative;
  margin-bottom: 0.8rem;
}
.qualif-nav__eyebrow {
  font-family: var(--mono, 'JetBrains Mono', monospace);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--qualif);
  margin: 0 0 0.25rem 0;
}
.qualif-nav__head h4 {
  font-family: var(--serif, 'Fraunces', serif);
  font-size: 1.05rem;
  font-weight: 500;
  margin: 0;
  color: var(--ink, #1a1a1a);
}

.qualif-nav__list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
  counter-reset: qualif-nav-counter;
}
.qualif-nav__list li {
  counter-increment: qualif-nav-counter;
  position: relative;
  margin: 0;
  padding: 0;
  border-bottom: 1px dashed var(--ink-soft, #c8c5b9);
}
.qualif-nav__list li:last-child { border-bottom: none; }
.qualif-nav__list li::before {
  content: counter(qualif-nav-counter) ".";
  position: absolute;
  left: 0;
  top: 0.55rem;
  font-family: var(--mono, monospace);
  font-size: 0.7rem;
  color: var(--ink-soft, #888);
  width: 1.4rem;
  text-align: right;
}
.qualif-nav__list a {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.5rem 0 0.5rem 1.8rem;
  color: var(--ink, #1a1a1a);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 120ms;
}
.qualif-nav__list a:hover {
  color: var(--qualif);
}
.qualif-nav__list .qualif-nav__label {
  flex: 1 1 auto;
}
.qualif-nav__list .qualif-nav__state {
  font-family: var(--mono, monospace);
  font-size: 0.78rem;
  color: var(--ink-soft, #888);
  flex: 0 0 auto;
}

.qualif-nav__list li.is-partial .qualif-nav__state {
  color: var(--qualif);
}
.qualif-nav__list li.is-complete .qualif-nav__state {
  color: var(--accent, #b8582e);
  font-weight: 600;
}
.qualif-nav__list li.is-complete .qualif-nav__label {
  color: var(--ink-soft, #555);
}

.qualif-nav__foot {
  padding-top: 0.5rem;
  border-top: 1px solid var(--ink-soft, #e6e3d8);
}
.qualif-nav__see-recap {
  display: block;
  text-align: center;
  font-size: 0.85rem;
  color: var(--accent, #b8582e);
  text-decoration: none;
  border-bottom: 1px dotted currentColor;
  padding: 0.4rem 0;
}
.qualif-nav__see-recap:hover {
  border-bottom-style: solid;
}

/* Le bouton "panel-close" n'est visible qu'en mode drawer mobile (cf. media query plus bas) */
aside#qualif-nav .panel-close {
  display: none;
}
```

- [ ] **Step 2: Ajuster le `top` de `#sources` pour cohabiter avec `#qualif-nav`**

Vérifier que `#sources` est défini ailleurs (dans l'app HTML inline ou dans `dossier-app.css`). D'après l'exploration : c'est dans le bloc `<style>` inline de l'app (`#sources { ... position: sticky; top: 56px; ... }`). Cela signifie qu'on ne peut pas overrider proprement via `dossier-qualif.css` qui a une spécificité égale.

**Décision** : on N'override PAS le `top: 56px` de `#sources`. Les deux sont sticky au même top — quand on scrolle, qualif-nav restera sticky en haut, et sources commencera quand qualif-nav arrive à sa hauteur naturelle (le DOM order place qualif-nav avant sources dans la col 3). En pratique, les deux empilent verticalement et l'utilisateur voit qualif-nav en haut + le début de sources juste en dessous.

**Note importante** : si visuellement les deux se superposent ou laissent un gap inattendu, on ajustera en Phase 4 (verif visuelle). Pas de modif CSS à ce stade.

- [ ] **Step 3: Commit**

```bash
git add assets/dossier-qualif.css
git commit -m "feat(qualif): CSS sidebar nav desktop — sticky col 3, identité slate-blue"
```

### Task 2.2 — Ajouter le bloc CSS mobile drawer

**Files:**
- Modify: `assets/dossier-qualif.css`

- [ ] **Step 1: Ajouter les règles mobile dans le bloc `@media (max-width: 1024px)`**

Dans `assets/dossier-qualif.css`, trouver le bloc `@media (max-width: 1024px) { ... }` existant (vers la fin du fichier, juste avant `@media print`). À l'intérieur des accolades de ce bloc, ajouter :

```css
  /* qualif-nav en mode drawer (mobile) */
  aside#qualif-nav {
    display: none;
    grid-column: auto;
    position: static;
    top: auto;
    border-left: none;
    background: var(--paper, #faf6ec);
  }
  aside#qualif-nav.open {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 90;
    background: var(--paper, #faf6ec);
    overflow-y: auto;
    padding: 64px 24px 24px 24px;
    border-left: none;
  }
  aside#qualif-nav.open .panel-close {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 91;
    background: var(--paper, #faf6ec);
    border: 1px solid var(--ink-soft, #c8c5b9);
    border-radius: 4px;
    padding: 8px 14px;
    font-family: var(--mono, monospace);
    font-size: 0.85rem;
    cursor: pointer;
    color: var(--ink, #1a1a1a);
  }
  aside#qualif-nav.open .panel-close:hover {
    background: var(--paper-2, #f0ebdf);
  }
```

(Ce bloc imite le pattern `#toc.open .panel-close` / `#sources.open .panel-close` déjà présent dans le CSS inline de l'app GCP.)

- [ ] **Step 2: Ajouter à `@media print` pour cacher la sidebar**

Toujours dans `assets/dossier-qualif.css`, trouver le bloc `@media print { ... }`. Trouver la longue liste de sélecteurs `display: none !important` (commence par `body > *:not(main)` ...). Ajouter `aside#qualif-nav,` à cette liste, juste après `aside.qualif-step,` :

```css
@media print {
  body > *:not(main),
  main > *:not(aside#qualif-recap),
  header.site,
  aside#toc,
  aside#sources,
  .topbar,
  #topbar,
  aside.qualif-step,
  aside#qualif-nav,
  aside.quiz-card,
  aside.callout {
    display: none !important;
  }
  ...
}
```

- [ ] **Step 3: Vérifier brace balance**

Run:
```bash
node -e "const css = require('fs').readFileSync('assets/dossier-qualif.css', 'utf8'); const open = (css.match(/\{/g)||[]).length; const close = (css.match(/\}/g)||[]).length; if (open === close) console.log('balanced (' + open + ' pairs)'); else { console.error('UNBALANCED: ' + open + ' open vs ' + close + ' close'); process.exit(1); }"
```

Expected : `balanced (N pairs)` where N > 77 (the previous count).

- [ ] **Step 4: Commit**

```bash
git add assets/dossier-qualif.css
git commit -m "feat(qualif): CSS sidebar nav mobile drawer + print hide"
```

---

## Phase 3 — Injecteur Python : render + inject sidebar + ajouter id aux mini-blocs + bouton topbar

À la fin : `python tools/insert_qualif.py --check` ajoute la sidebar et le bouton topbar dans la liste des actions, et l'app GCP a tout en place.

### Task 3.1 — Ajouter `id="qualif-step-{axisId}"` sur les mini-blocs

**Files:**
- Modify: `tools/insert_qualif.py`

- [ ] **Step 1: Modifier `render_step` pour inclure l'id**

Dans `tools/insert_qualif.py`, trouver la fonction `def render_step(axis: dict[str, Any]) -> str:` (vers les lignes ~210-230). À l'intérieur, trouver la ligne :

```python
    return f'''<aside class="qualif-step" data-axis="{axis["id"]}">
```

Et la remplacer par :

```python
    return f'''<aside class="qualif-step" id="qualif-step-{axis["id"]}" data-axis="{axis["id"]}">
```

- [ ] **Step 2: Mettre à jour la regex de replace dans `inject_step`**

Dans la même fonction file, trouver la fonction `inject_step`. Trouver la ligne :

```python
    pat = re.compile(
        rf'<aside class="qualif-step" data-axis="{re.escape(axis["id"])}">.*?</aside>',
        re.DOTALL,
    )
```

Remplacer par :

```python
    pat = re.compile(
        rf'<aside class="qualif-step"(?: id="qualif-step-{re.escape(axis["id"])}")? data-axis="{re.escape(axis["id"])}">.*?</aside>',
        re.DOTALL,
    )
```

(La regex matche les anciens `<aside class="qualif-step" data-axis="...">` ET les nouveaux `<aside class="qualif-step" id="qualif-step-..." data-axis="...">`. Idempotence sur la version v1 → v1.1 du script.)

- [ ] **Step 3: Quick smoke test**

Run:
```bash
python -c "import sys; sys.path.insert(0, 'tools'); from insert_qualif import render_step; import json; c = json.load(open('analytics-agentique-gcp/qualif.json')); s = render_step(c['axes'][0]); assert 'id=\"qualif-step-maturite-ia\"' in s; assert 'data-axis=\"maturite-ia\"' in s; print('id added OK')"
```

Expected : `id added OK`.

- [ ] **Step 4: Commit**

```bash
git add tools/insert_qualif.py
git commit -m "feat(qualif): ajouter id=qualif-step-{axisId} sur les mini-blocs (anchors)"
```

### Task 3.2 — Ajouter `render_qualif_nav(config)` + `inject_qualif_nav(html_src, config, strict)`

**Files:**
- Modify: `tools/insert_qualif.py`

- [ ] **Step 1: Ajouter `render_qualif_nav` après `render_recap`**

Dans `tools/insert_qualif.py`, **juste après** la définition de `render_recap`, ajouter :

```python
def render_qualif_nav(config: dict[str, Any]) -> str:
    """Rend la sidebar nav (liste des 6 axes + état)."""
    items = []
    for axis in config['axes']:
        items.append(
            f'    <li data-axis="{axis["id"]}" class="is-empty">'
            f'<a href="#qualif-step-{axis["id"]}">'
            f'<span class="qualif-nav__label">{html.escape(axis["label"])}</span>'
            f'<span class="qualif-nav__state" data-bind="state">0 / {len(axis["inputs"])}</span>'
            f'</a></li>'
        )
    items_html = '\n'.join(items)
    return f'''<aside id="qualif-nav" class="qualif-nav" aria-labelledby="qualif-nav-title">
  <header class="qualif-nav__head">
    <p class="qualif-nav__eyebrow">// votre profil</p>
    <h4 id="qualif-nav-title">Profil de qualif</h4>
    <button class="panel-close" type="button" aria-label="Fermer le profil de qualif">Fermer ✕</button>
  </header>
  <ol class="qualif-nav__list">
{items_html}
  </ol>
  <footer class="qualif-nav__foot">
    <a href="#qualif-recap" class="qualif-nav__see-recap">Voir mon profil ↓</a>
  </footer>
</aside>'''
```

- [ ] **Step 2: Ajouter `inject_qualif_nav` après `inject_recap`**

Dans `tools/insert_qualif.py`, **juste après** la définition de `inject_recap`, ajouter :

```python
ASIDE_QUALIF_NAV_RE = re.compile(
    r'<aside id="qualif-nav"[^>]*>.*?</aside>',
    re.DOTALL,
)


def inject_qualif_nav(html_src: str, config: dict[str, Any], strict: bool = False) -> tuple[str, str]:
    """Inject (or replace) the qualif-nav sidebar in the col-3 grid, before #sources."""
    rendered = render_qualif_nav(config)
    if ASIDE_QUALIF_NAV_RE.search(html_src):
        new_html = ASIDE_QUALIF_NAV_RE.sub(lambda m: rendered, html_src, count=1)
        return new_html, 'replaced'
    # Insert just before <aside id="sources"
    sources_pat = re.compile(r'<aside id="sources"', re.IGNORECASE)
    m = sources_pat.search(html_src)
    if not m:
        msg = 'warning: <aside id="sources"> not found — cannot anchor qualif-nav'
        if strict:
            raise RuntimeError(msg)
        print(msg, file=sys.stderr)
        return html_src, 'skipped'
    insert_pos = m.start()
    indent = '\n\n    '
    new_html = html_src[:insert_pos] + rendered + indent + html_src[insert_pos:]
    return new_html, 'inserted'
```

- [ ] **Step 3: Brancher dans `main()`**

Dans `tools/insert_qualif.py`, trouver dans `main()` la séquence :

```python
    # Inject récap
    html_src, recap_action = inject_recap(html_src, config, strict=args.strict)
    actions.append(f'  recap → {recap_action}')

    # Inject lib tags (link + script) if absent
    html_src, lib_action = ensure_lib_tags(html_src)
    actions.append(f'  lib tags → {lib_action}')
```

Et insérer juste après la ligne `actions.append(f'  recap → {recap_action}')` :

```python
    # Inject qualif-nav sidebar
    html_src, nav_action = inject_qualif_nav(html_src, config, strict=args.strict)
    actions.append(f'  qualif-nav → {nav_action}')
```

- [ ] **Step 4: Dry-run**

Run:
```bash
python tools/insert_qualif.py --app analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html --qualif analytics-agentique-gcp/qualif.json --check
```

Expected output includes :
```
  axis "maturite-ia" → replaced
  ...
  recap → replaced
  qualif-nav → inserted
  lib tags → present
  data link → present
```

Note : axes sont `replaced` (anciens markers présents), nav est `inserted` (nouveau).

- [ ] **Step 5: Commit**

```bash
git add tools/insert_qualif.py
git commit -m "feat(qualif): render_qualif_nav + inject_qualif_nav (idempotent)"
```

### Task 3.3 — Ajouter le bouton topbar `#toggle-qualif`

**Files:**
- Modify: `tools/insert_qualif.py`

- [ ] **Step 1: Ajouter `ensure_topbar_button`**

Dans `tools/insert_qualif.py`, **juste après** la fonction `ensure_data_link`, ajouter :

```python
def ensure_topbar_button(html_src: str) -> tuple[str, str]:
    """Inject the <button id="toggle-qualif"> after #toggle-sources in <header class="site">."""
    if 'id="toggle-qualif"' in html_src:
        return html_src, 'present'

    btn = '<button id="toggle-qualif" class="menu-toggle" aria-label="Ouvrir le profil de qualif">Profil</button>'
    # Insert just after the toggle-sources button
    pat = re.compile(
        r'(<button id="toggle-sources"[^>]*>[^<]*</button>)',
        re.IGNORECASE,
    )
    m = pat.search(html_src)
    if not m:
        return html_src, 'skipped (no toggle-sources anchor)'
    new_html = pat.sub(lambda mt: mt.group(1) + '\n      ' + btn, html_src, count=1)
    return new_html, 'inserted'
```

- [ ] **Step 2: Brancher dans `main()`**

Dans `main()`, trouver la ligne `html_src, data_link_action = ensure_data_link(...)` et juste après son `actions.append(...)`, ajouter :

```python
    # Inject the qualif topbar button
    html_src, topbar_action = ensure_topbar_button(html_src)
    actions.append(f'  topbar button → {topbar_action}')
```

- [ ] **Step 3: Dry-run**

Run:
```bash
python tools/insert_qualif.py --app analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html --qualif analytics-agentique-gcp/qualif.json --check
```

Expected, somewhere in the action list :
```
  topbar button → inserted
```

- [ ] **Step 4: Commit**

```bash
git add tools/insert_qualif.py
git commit -m "feat(qualif): bouton topbar #toggle-qualif (idempotent)"
```

---

## Phase 4 — Run sur GCP + verif visuelle + tests intégration

À la fin : l'app GCP a la sidebar, le bouton topbar, les anchors sur les mini-blocs. Tests CI mis à jour passent.

### Task 4.1 — Run réel du script sur GCP

**Files:**
- Modify: `analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html`

- [ ] **Step 1: Run sans `--check`**

Run:
```bash
python tools/insert_qualif.py --app analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html --qualif analytics-agentique-gcp/qualif.json
```

Expected output includes :
```
  axis "maturite-ia" → replaced
  ... (6 axes)
  recap → replaced
  qualif-nav → inserted
  lib tags → present
  data link → present
  topbar button → inserted

written: analytics-agentique-gcp\20260519-analytics-agentique-gcp-app.html
```

- [ ] **Step 2: Sanity checks**

Run:
```bash
echo "qualif-nav count:" && grep -c 'id="qualif-nav"' analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html
echo "qualif-step ids:" && grep -c 'id="qualif-step-' analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html
echo "toggle-qualif button:" && grep -c 'id="toggle-qualif"' analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html
```

Expected : `1`, `6`, `1`.

- [ ] **Step 3: Idempotence — re-run doit produire 0 diff**

Run:
```bash
git add analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html
git commit -m "feat(gcp): sidebar #qualif-nav + ids ancrables + bouton topbar"
python tools/insert_qualif.py --app analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html --qualif analytics-agentique-gcp/qualif.json
git diff --stat analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html
```

Expected : the diff is empty (no changes after re-run).

Si la diff n'est pas vide, debug : le re-run doit donner `axis "..." → replaced`, `qualif-nav → replaced`, `topbar button → present`. Tout `replaced`/`present`.

### Task 4.2 — Vérification visuelle en navigateur (Playwright)

**Files:**
- (vérification — pas de fichier modifié)

- [ ] **Step 1: Démarrer un serveur local**

Run en background :
```bash
python -m http.server 8765
```

- [ ] **Step 2: Naviguer vers l'app**

Open in browser (ou via Playwright MCP) :
`http://localhost:8765/analytics-agentique-gcp/20260519-analytics-agentique-gcp-app.html`

- [ ] **Step 3: Vérifier la sidebar desktop**

Via Playwright `mcp__plugin_playwright_playwright__browser_evaluate` :

```javascript
() => {
  const nav = document.querySelector('aside#qualif-nav');
  const items = nav ? Array.from(nav.querySelectorAll('li[data-axis]')).map(li => ({
    axis: li.dataset.axis,
    state: li.querySelector('[data-bind="state"]')?.textContent,
    href: li.querySelector('a')?.getAttribute('href'),
    cls: li.className,
  })) : [];
  const topbarBtn = !!document.querySelector('#toggle-qualif');
  const anchors = Array.from(document.querySelectorAll('aside.qualif-step')).map(a => a.id);
  return { navPresent: !!nav, items, topbarBtn, anchors };
}
```

Expected :
- `navPresent: true`
- `items.length: 6`, each with `state: "0 / 3"`, valid href like `#qualif-step-maturite-ia`, class `is-empty`
- `topbarBtn: true`
- `anchors: ["qualif-step-maturite-ia", "qualif-step-environnement", ...]` (6 ids)

- [ ] **Step 4: Test interaction sidebar**

Via Playwright, simuler des saisies sur le premier mini-bloc et vérifier que la sidebar reflète l'état :

```javascript
async () => {
  await new Promise(r => setTimeout(r, 800));
  // Set 2 inputs on Maturité IA
  const slider = document.querySelector('input[name="maturite-ia.stade"]');
  slider.value = '50';
  slider.dispatchEvent(new Event('input', { bubbles: true }));
  const cb = document.querySelector('input[name="maturite-ia.freins"][value="hallucinations"]');
  cb.checked = true;
  cb.dispatchEvent(new Event('change', { bubbles: true }));
  await new Promise(r => setTimeout(r, 200));

  const navLi = document.querySelector('aside#qualif-nav li[data-axis="maturite-ia"]');
  return {
    classes: navLi?.className,
    stateText: navLi?.querySelector('[data-bind="state"]')?.textContent,
  };
}
```

Expected : `classes: "is-partial"` (1-2/3 renseigné), `stateText: "2 / 3"`.

Si Step 3 ou 4 échoue : report BLOCKED, ne pas continuer.

- [ ] **Step 5: Test mobile drawer (viewport 375px)**

Toujours via Playwright, redimensionner la viewport :

```javascript
// First, resize via browser_resize tool to 375x800
```

Puis :

```javascript
() => {
  const nav = document.querySelector('aside#qualif-nav');
  const computedDisplay = window.getComputedStyle(nav).display;
  const btn = document.querySelector('#toggle-qualif');
  btn.click();
  return {
    initialDisplay: computedDisplay, // expected: "none"
    afterClickHasOpen: nav.classList.contains('open'),
    afterClickDisplay: window.getComputedStyle(nav).display, // expected: "block"
  };
}
```

Expected : initial display `none`, après clic la classe `open` est ajoutée, display devient `block`.

- [ ] **Step 6: Arrêter le serveur**

Kill the background HTTP server.

### Task 4.3 — Étendre les tests d'intégration

**Files:**
- Modify: `tests/qualif-integration.test.mjs`

- [ ] **Step 1: Ajouter 4 nouveaux tests**

Dans `tests/qualif-integration.test.mjs`, à la fin du fichier (après le dernier `test(...)`), ajouter :

```javascript
test('GCP app contains exactly 1 qualif-nav sidebar', () => {
  const matches = APP.match(/<aside id="qualif-nav"/g) || [];
  assert.equal(matches.length, 1, `expected 1 qualif-nav, got ${matches.length}`);
});

test('Each mini-bloc has id="qualif-step-{axisId}" (for sidebar anchors)', () => {
  for (const axis of CONFIG.axes) {
    const expectedId = `id="qualif-step-${axis.id}"`;
    assert.ok(APP.includes(expectedId), `missing ${expectedId} on mini-bloc`);
  }
});

test('Sidebar lists all 6 axes with state binding', () => {
  // Extract sidebar block
  const m = APP.match(/<aside id="qualif-nav"[\s\S]*?<\/aside>/);
  assert.ok(m, 'qualif-nav block not found');
  const sidebar = m[0];
  for (const axis of CONFIG.axes) {
    assert.ok(sidebar.includes(`data-axis="${axis.id}"`), `sidebar missing data-axis="${axis.id}"`);
    assert.ok(sidebar.includes(`href="#qualif-step-${axis.id}"`), `sidebar missing link to qualif-step-${axis.id}`);
  }
  // 6 state bindings
  const stateBindings = (sidebar.match(/data-bind="state"/g) || []).length;
  assert.equal(stateBindings, 6, `expected 6 state bindings, got ${stateBindings}`);
});

test('Topbar has the #toggle-qualif button', () => {
  assert.ok(APP.includes('id="toggle-qualif"'), 'missing topbar button #toggle-qualif');
  // Should be positioned after #toggle-sources for visual ordering
  const sourcesPos = APP.indexOf('id="toggle-sources"');
  const qualifPos = APP.indexOf('id="toggle-qualif"');
  assert.ok(sourcesPos !== -1 && qualifPos !== -1);
  assert.ok(qualifPos > sourcesPos, 'toggle-qualif should come after toggle-sources in document order');
});
```

- [ ] **Step 2: Run tous les tests**

Run:
```bash
node --test tests/qualif-contract.test.mjs tests/qualif-engine.test.mjs tests/qualif-integration.test.mjs
```

Expected : tests `36 + 8 + 12 = 56` qualif tests, all pass.

(Avant : 36+8+8=52. Après : +4 sur intégration = 56.)

- [ ] **Step 3: Run la suite repo complète pour anti-regression**

Run:
```bash
node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs tests/qualif-contract.test.mjs tests/qualif-engine.test.mjs tests/qualif-integration.test.mjs
```

Expected : tout vert. Le total devrait être ~212 (208 précédent + 4 nouveaux).

- [ ] **Step 4: Commit**

```bash
git add tests/qualif-integration.test.mjs
git commit -m "test(qualif): +4 tests intégration sidebar (présence, anchors, bouton topbar)"
```

---

## Phase 5 — Doc + push

À la fin : CLAUDE.md mentionne la sidebar ; les commits sont push sur la PR #104 existante.

### Task 5.1 — Mettre à jour CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Étendre la section "Widget de qualification business"**

Dans `CLAUDE.md`, trouver la section `## Widget de qualification business (qualif)` ajoutée précédemment. À la fin de cette section (juste avant la section suivante), ajouter un paragraphe :

```markdown
**Sidebar de navigation** : depuis 2026-05-23, l'app a aussi une `<aside id="qualif-nav">` à droite (au-dessus de `#sources` sur desktop, drawer mobile via `#toggle-qualif`). Elle liste les 6 axes avec leur état de complétude live (0/3 → 1/3 → ✓) et un lien direct vers chaque mini-bloc. La saisie reste inline dans la prose ; la sidebar est purement navigationnelle (zéro input). Auto-injectée par `tools/insert_qualif.py` au même titre que le récap.
```

- [ ] **Step 2: Vérifier le rendu**

Run:
```bash
grep -A 3 "Sidebar de navigation" CLAUDE.md
```

Expected : la nouvelle ligne apparaît.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: section CLAUDE.md mention de la sidebar qualif"
```

### Task 5.2 — Push sur la PR #104 existante

**Files:**
- (git op uniquement)

- [ ] **Step 1: Voir les nouveaux commits**

Run:
```bash
git log --oneline a60bebe..HEAD
```

Attendu : ~10-12 nouveaux commits depuis le dernier de la PR initiale.

- [ ] **Step 2: Push**

Run:
```bash
git push origin claude/business-qualif-widget-2026-05-23
```

Expected : push successful, la PR #104 se met à jour automatiquement.

- [ ] **Step 3: Ajouter un commentaire à la PR (optionnel)**

Via le MCP GitHub `mcp__github__add_issue_comment` (issue number = PR number = 104), commenter :

```
Follow-up : sidebar qualif (#qualif-nav) ajoutée — 3e sidebar à droite sur desktop, drawer mobile via #toggle-qualif. Liste les 6 axes avec état live (0/3 → 1/3 → ✓) + lien vers chaque mini-bloc. Le récap final et les mini-blocs inline restent inchangés. +4 tests d'intégration → 212/212 pass.
```

---

## Self-Review interne (avant de transmettre)

Avant de considérer le plan terminé :

1. **Coverage spec** : Les 9 critères de succès du spec sidebar sont couverts par les tâches :
   - 1 (sidebar sticky desktop) → Task 2.1 ✓
   - 2 (mobile drawer) → Task 2.2 + Task 1.2 (events) ✓
   - 3 (6 axes ordre JSON) → Task 3.2 ✓
   - 4 (état live) → Task 1.2 ✓
   - 5 (scroll vers mini-bloc) → Task 3.1 (id ancrable) + lien natif ✓
   - 6 (scroll vers récap) → Task 3.2 (footer link) ✓
   - 7 (print hide) → Task 2.2 ✓
   - 8 (tests CI) → Task 4.3 ✓
   - 9 (idempotence) → Task 4.1 step 3 ✓

2. **Aucun placeholder** dans le plan : pas de `TBD`/`TODO`/`FIXME`. Tout le code est en clair.

3. **Type/naming consistency** :
   - `axisCompletion(axis, state)` retourne `{ filled, total, isComplete }` — utilisé identiquement en Task 1.1 et 1.2.
   - `wireQualifNav(handles)` et `updateNavState(handles)` — handles est l'objet établi en Phase 3 du widget initial. Cohérent.
   - Sélecteurs CSS : `aside#qualif-nav`, `.qualif-nav__head`, `.qualif-nav__list`, `.qualif-nav__state`, `.is-empty`/`.is-partial`/`.is-complete` — utilisés identiquement entre JS (Task 1.2) et CSS (Task 2.1) et Python (Task 3.2).
   - Sélecteurs Python : `'id="qualif-step-{axis_id}"'` (Task 3.1) — matche le `href="#qualif-step-{axis_id}"` rendu par `render_qualif_nav` (Task 3.2).
   - Bouton topbar : `id="toggle-qualif"`, label "Profil" (Task 3.3) — wire en JS (Task 1.2).
