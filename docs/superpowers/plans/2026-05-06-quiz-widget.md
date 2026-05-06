# Quiz Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter 4 widgets QCM "vérifier sa compréhension" (charnières §1, §2, §4, §7) à `ia-et-travail/20260504-ia-et-travail-app.html` selon le pattern *inline expand replié par défaut*.

**Architecture:** Composant unique `<aside class="quiz-card">` inséré en fin de section ; HTML inline avec `data-*` attributes pour stocker la bonneté et les explications par option ; un seul IIFE `setupQuizzes()` gère expand/validation/retry. Pas de score, pas de localStorage.

**Tech Stack:** HTML/CSS/JS vanille, palette CSS variables existante (`--carmine`, `--paper-2`, `--teal`, etc.), pas de dépendance.

**Spec source :** `docs/superpowers/specs/2026-05-06-quiz-widget-design.md`

---

## File Structure

**Modifié (un seul fichier sur cette branche test) :**
- `ia-et-travail/20260504-ia-et-travail-app.html`
  - Bloc CSS `.quiz-card` ajouté à la fin du `<style>` (avant la ligne 454 `</style>`)
  - Bloc CSS mobile ajouté au sein de `@media (max-width: 1024px)` existant (autour de la ligne 358)
  - 4 cartes HTML `<aside class="quiz-card">` insérées en fin de §1, §2, §4, §7 (avant le `<h2>` suivant)
  - IIFE `setupQuizzes()` ajouté avant `</script>` (ligne 1693), après `setupZoom()`

Aucun autre fichier touché. La migration vers la skill (template + références) est traitée dans un plan séparé après merge.

---

## Conventions d'exécution

- Pas de framework de tests automatisés sur ce site. Chaque "test" = ouverture du fichier en navigateur (`file://` ou serveur local) et vérification visuelle/comportementale.
- Test mobile via DevTools (responsive 375 px iPhone SE).
- Commits atomiques par tâche, message explicite.
- Toujours rester sur la branche `claude/quiz-ia-et-travail`. Vérifier avec `git branch --show-current` avant chaque commit si doute.

---

### Task 1 : CSS desktop pour `.quiz-card`

**Files:**
- Modify: `ia-et-travail/20260504-ia-et-travail-app.html` — insérer juste avant la ligne 454 (`</style>` du bloc `<style>` principal)

- [ ] **Step 1 : Insérer le bloc CSS quiz-card desktop**

Le bloc à insérer (à placer juste avant `</style>` ligne 454) :

```css
    /* === quiz cards (vérification de compréhension) === */
    .quiz-card {
      margin: 2rem 0 2.4rem;
      padding: 18px 22px;
      background: var(--paper-2);
      border-left: 3px solid var(--carmine);
      border-radius: 2px;
    }
    .quiz-card__head {
      display: flex;
      align-items: baseline;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .quiz-card__eyebrow {
      font-family: var(--mono);
      font-size: 0.72rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--graphite);
      flex-basis: 100%;
      margin: 0 0 0.25rem;
    }
    .quiz-card__title {
      font-family: var(--serif);
      font-size: 1.05rem;
      font-weight: 600;
      margin: 0;
      flex: 1 1 auto;
      color: var(--ink);
    }
    .quiz-card__toggle {
      font-family: var(--mono);
      font-size: 0.78rem;
      letter-spacing: 0.06em;
      background: transparent;
      border: 1px solid var(--mist);
      color: var(--ink);
      padding: 6px 14px;
      border-radius: 2px;
      cursor: pointer;
      transition: color .15s, border-color .15s;
    }
    .quiz-card__toggle:hover, .quiz-card__toggle:focus-visible {
      color: var(--carmine);
      border-color: var(--carmine);
      outline: none;
    }
    .quiz-card__body {
      margin-top: 1.2rem;
      padding-top: 1rem;
      border-top: 1px dashed var(--rule);
    }
    .quiz-card__body[hidden] { display: none; }

    .quiz-q { margin: 0; padding: 0; }
    .quiz-q + .quiz-q { margin-top: 1.6rem; padding-top: 1.6rem; border-top: 1px dashed var(--rule); }
    .quiz-q fieldset { border: 0; padding: 0; margin: 0; }
    .quiz-q__stem {
      font-family: var(--serif);
      font-size: 1rem;
      font-weight: 600;
      color: var(--ink);
      padding: 0;
      margin: 0 0 0.9rem;
    }
    .quiz-q__options { list-style: none; padding: 0; margin: 0 0 1rem; }
    .quiz-q__options li {
      margin: 0;
      padding: 8px 0;
      border-top: 1px solid var(--rule);
      transition: background-color .2s;
    }
    .quiz-q__options li:last-child { border-bottom: 1px solid var(--rule); }
    .quiz-q__options label {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      cursor: pointer;
      padding: 4px 0;
    }
    .quiz-q__options input { margin: 0.3em 0 0; flex: 0 0 auto; accent-color: var(--carmine); }
    .quiz-q__options label > span { flex: 1; line-height: 1.5; }

    .quiz-q__explain {
      font-size: 0.92rem;
      margin: 0.5rem 0 0 1.7rem;
      padding: 8px 12px;
      background: var(--paper);
      border-left: 2px solid var(--mist);
      color: var(--graphite);
    }
    .quiz-q__explain[hidden] { display: none; }
    .quiz-q__options li.is-correct .quiz-q__explain,
    .quiz-q__options li.expected .quiz-q__explain { border-left-color: var(--teal); }
    .quiz-q__options li.is-wrong .quiz-q__explain { border-left-color: var(--carmine); }
    .quiz-q__options li.is-correct > label > span,
    .quiz-q__options li.expected > label > span {
      background: linear-gradient(transparent 60%, rgba(31, 85, 96, 0.14) 60%);
    }
    .quiz-q__options li.is-wrong > label > span {
      background: linear-gradient(transparent 60%, rgba(178, 59, 27, 0.14) 60%);
    }

    .quiz-q__check {
      font-family: var(--mono);
      font-size: 0.78rem;
      letter-spacing: 0.04em;
      background: var(--ink);
      color: var(--paper);
      border: 0;
      padding: 8px 16px;
      border-radius: 2px;
      cursor: pointer;
      transition: background .15s;
    }
    .quiz-q__check:hover, .quiz-q__check:focus-visible { background: var(--carmine); outline: none; }
    .quiz-q__check:disabled { background: var(--mist); cursor: not-allowed; }

    .quiz-q__verdict {
      font-family: var(--mono);
      font-size: 0.78rem;
      letter-spacing: 0.04em;
      margin: 1rem 0 0;
      padding: 8px 12px;
      border-left: 2px solid var(--graphite);
    }
    .quiz-q__verdict[hidden] { display: none; }
    .quiz-q__verdict.is-correct { border-left-color: var(--teal); color: var(--teal); }
    .quiz-q__verdict.is-wrong { border-left-color: var(--carmine); color: var(--carmine); }

    .quiz-q__retry {
      font-family: var(--mono);
      font-size: 0.74rem;
      letter-spacing: 0.06em;
      background: transparent;
      border: 0;
      color: var(--graphite);
      padding: 6px 0;
      margin: 0.6rem 0 0;
      cursor: pointer;
      text-decoration: underline;
      text-decoration-color: var(--mist);
      text-underline-offset: 3px;
    }
    .quiz-q__retry:hover, .quiz-q__retry:focus-visible { color: var(--ink); text-decoration-color: var(--carmine); outline: none; }
    .quiz-q__retry[hidden] { display: none; }
```

- [ ] **Step 2 : Verify CSS parses**

Run: ouvrir `ia-et-travail/20260504-ia-et-travail-app.html` dans Chrome.
Expected : la page charge sans erreur (DevTools console = clean), aucune nouvelle classe visible (rien n'a encore été ajouté en HTML).

- [ ] **Step 3 : Commit**

```bash
git add ia-et-travail/20260504-ia-et-travail-app.html
git commit -m "feat(ia-et-travail): CSS pour quiz-card (desktop)"
```

---

### Task 2 : CSS mobile pour `.quiz-card`

**Files:**
- Modify: `ia-et-travail/20260504-ia-et-travail-app.html` — au sein du `@media (max-width: 1024px)` existant (autour de la ligne 358)

- [ ] **Step 1 : Localiser le bon media query**

Run: `grep -n "@media (max-width: 1024px)" ia-et-travail/20260504-ia-et-travail-app.html`
Expected : plusieurs occurrences ; cibler celle autour de la ligne 358 qui contient déjà la typographie mobile (`header.site`, `main#report`, `h1.report-title`, etc.). Insérer juste avant l'accolade fermante `}` de **ce** bloc.

- [ ] **Step 2 : Insérer le bloc CSS mobile quiz-card**

À insérer en fin de bloc `@media (max-width: 1024px)` (avant le `}` de fermeture du media query) :

```css
      /* === quiz cards : variantes mobile === */
      .quiz-card { padding: 14px 16px; margin: 1.6rem 0 2rem; }
      .quiz-card__head { gap: 0.6rem; }
      .quiz-card__title { flex-basis: 100%; }
      .quiz-card__toggle {
        width: 100%;
        padding: 12px;
        min-height: 44px;
        font-size: 0.82rem;
      }
      .quiz-q__check {
        width: 100%;
        padding: 12px;
        min-height: 44px;
        font-size: 0.82rem;
      }
      .quiz-q__options li { padding: 10px 0; }
      .quiz-q__options label { padding: 8px 0; min-height: 44px; }
      .quiz-q__explain { margin: 0.5rem 0 0 0; padding: 10px 12px; }
      .quiz-q__retry { width: 100%; padding: 10px 0; min-height: 44px; }
```

- [ ] **Step 3 : Verify mobile CSS**

Run : ouvrir le fichier dans Chrome, DevTools → Device Mode 375 px.
Expected : pas d'erreur console ; pas de changement visible (rien d'inséré en HTML pour l'instant).

- [ ] **Step 4 : Commit**

```bash
git add ia-et-travail/20260504-ia-et-travail-app.html
git commit -m "feat(ia-et-travail): CSS quiz-card variantes mobile"
```

---

### Task 3 : IIFE `setupQuizzes()` skeleton — toggle uniquement

**Files:**
- Modify: `ia-et-travail/20260504-ia-et-travail-app.html` — bloc `<script>` final, juste avant la ligne 1693 (`</script>`)

- [ ] **Step 1 : Insérer l'IIFE skeleton**

À ajouter juste après le bloc `setupZoom()` (qui finit ligne 1692), avant `</script>` :

```js

    (function setupQuizzes() {
      const cards = document.querySelectorAll('.quiz-card');
      if (!cards.length) return;

      cards.forEach(card => {
        const toggle = card.querySelector('.quiz-card__toggle');
        const body = card.querySelector('.quiz-card__body');
        if (!toggle || !body) return;

        const initialLabel = toggle.textContent.trim() || 'Tester →';
        const openLabel = 'Replier ↑';

        toggle.addEventListener('click', () => {
          const open = toggle.getAttribute('aria-expanded') === 'true';
          toggle.setAttribute('aria-expanded', String(!open));
          body.hidden = open;
          toggle.textContent = open ? initialLabel : openLabel;
          if (!open) {
            const firstInput = body.querySelector('input');
            if (firstInput) setTimeout(() => firstInput.focus(), 0);
          }
        });

        card.querySelectorAll('.quiz-q').forEach(q => attachQuestionHandlers(q));
      });

      function attachQuestionHandlers(q) {
        const mode = q.dataset.mode || 'single';
        const check = q.querySelector('.quiz-q__check');
        const retry = q.querySelector('.quiz-q__retry');
        const verdict = q.querySelector('.quiz-q__verdict');
        const items = Array.from(q.querySelectorAll('.quiz-q__options > li'));
        if (!check || !retry || !verdict || !items.length) return;

        check.addEventListener('click', () => evaluate(q, mode, items, verdict, check, retry));
        retry.addEventListener('click', () => reset(items, verdict, check, retry, q));
      }

      function evaluate(q, mode, items, verdict, check, retry) {
        const userPicked = items.map(li => !!li.querySelector('input').checked);
        const expected = items.map(li => li.querySelector('.quiz-q__explain[data-correct="true"]') !== null);
        let allRight = true;
        items.forEach((li, i) => {
          const explain = li.querySelector('.quiz-q__explain');
          if (explain) explain.hidden = false;
          const input = li.querySelector('input');
          input.disabled = true;
          if (mode === 'single') {
            if (userPicked[i] && expected[i]) li.classList.add('is-correct');
            else if (userPicked[i] && !expected[i]) { li.classList.add('is-wrong'); allRight = false; }
            else if (!userPicked[i] && expected[i]) { li.classList.add('expected'); allRight = false; }
          } else {
            if (userPicked[i] === expected[i] && userPicked[i]) li.classList.add('is-correct');
            else if (userPicked[i] && !expected[i]) { li.classList.add('is-wrong'); allRight = false; }
            else if (!userPicked[i] && expected[i]) { li.classList.add('expected'); allRight = false; }
          }
        });
        verdict.textContent = allRight ? 'Bonne réponse.' : 'Pas tout à fait — relisez la section concernée.';
        verdict.classList.toggle('is-correct', allRight);
        verdict.classList.toggle('is-wrong', !allRight);
        verdict.hidden = false;
        check.disabled = true;
        retry.hidden = false;
        retry.focus();
      }

      function reset(items, verdict, check, retry, q) {
        items.forEach(li => {
          li.classList.remove('is-correct', 'is-wrong', 'expected');
          const explain = li.querySelector('.quiz-q__explain');
          if (explain) explain.hidden = true;
          const input = li.querySelector('input');
          input.checked = false;
          input.disabled = false;
        });
        verdict.hidden = true;
        verdict.classList.remove('is-correct', 'is-wrong');
        check.disabled = false;
        retry.hidden = true;
        const firstInput = q.querySelector('input');
        if (firstInput) firstInput.focus();
      }
    })();
```

Note : la logique de validation (`evaluate`/`reset`) est ajoutée dès cette tâche pour éviter une refonte plus tard. Elle ne fera rien tant qu'aucune `.quiz-q` n'existe dans le DOM, donc c'est sans risque.

- [ ] **Step 2 : Verify no JS error**

Run : ouvrir le fichier en navigateur, DevTools console.
Expected : console clean (`setupQuizzes` ne trouve aucune `.quiz-card`, sort tôt). Aucune erreur.

- [ ] **Step 3 : Commit**

```bash
git add ia-et-travail/20260504-ia-et-travail-app.html
git commit -m "feat(ia-et-travail): IIFE setupQuizzes (toggle + validate + retry)"
```

---

### Task 4 : Insérer le quiz §1 (Le malentendu fondamental)

**Files:**
- Modify: `ia-et-travail/20260504-ia-et-travail-app.html` — insérer juste avant la ligne 660 (`<h2 id="gpt">2. L'IA comme...`), donc en fin de §1.

- [ ] **Step 1 : Insérer la carte HTML quiz §1**

Le code à insérer (après le `</p>` qui termine §1, juste avant `<h2 id="gpt">`) :

```html
      <aside class="quiz-card" data-quiz-id="q-malentendu" data-anchor="malentendu" role="region" aria-labelledby="quiz-title-malentendu">
        <header class="quiz-card__head">
          <span class="quiz-card__eyebrow">// vérifier sa compréhension</span>
          <h3 class="quiz-card__title" id="quiz-title-malentendu">Automation, augmentation, exposition</h3>
          <button class="quiz-card__toggle" type="button" aria-expanded="false" aria-controls="quiz-body-malentendu">Tester →</button>
        </header>
        <div class="quiz-card__body" id="quiz-body-malentendu" hidden>
          <article class="quiz-q" data-mode="multi">
            <fieldset>
              <legend class="quiz-q__stem">Lesquelles de ces affirmations sur l'IA et le travail sont correctes ? (Plusieurs réponses possibles.)</legend>
              <ul class="quiz-q__options">
                <li>
                  <label>
                    <input type="checkbox" name="q-malentendu-1">
                    <span>Selon l'Anthropic Economic Index de février 2026, l'augmentation reste majoritaire dans les usages Claude (52 %), même si la part d'automatisation a crû ces derniers mois.</span>
                  </label>
                  <p class="quiz-q__explain" data-correct="true" hidden>Vrai. 52 % des conversations relèvent de l'augmentation contre 45 % d'automatisation, mais la part d'automatisation est passée de 27 % à 39 % en un an : la frontière n'est pas figée. <a href="#malentendu">↗ relire §1</a></p>
                </li>
                <li>
                  <label>
                    <input type="checkbox" name="q-malentendu-2">
                    <span>Une tâche « exposée » à l'IA est, par définition, une tâche qui sera détruite à court terme.</span>
                  </label>
                  <p class="quiz-q__explain" data-correct="false" hidden>Faux. Exposition ≠ déplacement. Entre les deux il y a le coût d'adoption, l'inertie organisationnelle, les contraintes réglementaires, et l'effet productivité d'Acemoglu-Restrepo qui peut <em>augmenter</em> la demande pour les autres tâches du métier.</p>
                </li>
                <li>
                  <label>
                    <input type="checkbox" name="q-malentendu-3">
                    <span>Frey-Osborne (47 % des emplois US à risque) et Arntz-OCDE (9 %) mesurent la même réalité ; l'écart vient principalement de la granularité (profession entière vs tâche).</span>
                  </label>
                  <p class="quiz-q__explain" data-correct="true" hidden>Vrai. Frey-Osborne classait l'emploi entier dès lors qu'une majorité de ses tâches étaient automatisables ; l'OCDE refait le calcul à la granularité de la tâche individuelle, ce qui divise mécaniquement par cinq.</p>
                </li>
                <li>
                  <label>
                    <input type="checkbox" name="q-malentendu-4">
                    <span>Un emploi composé majoritairement de tâches automatisables sera nécessairement détruit.</span>
                  </label>
                  <p class="quiz-q__explain" data-correct="false" hidden>Faux. Confond emploi et tâche. Un emploi est composé de dizaines de tâches : la technologie peut en automatiser certaines sans détruire l'emploi — c'est ce qu'on appelle <em>augmentation</em>. La distinction est explicitement mesurée par l'Anthropic Economic Index.</p>
                </li>
              </ul>
            </fieldset>
            <button class="quiz-q__check" type="button">Valider</button>
            <div class="quiz-q__verdict" role="status" aria-live="polite" hidden></div>
            <button class="quiz-q__retry" type="button" hidden>Recommencer</button>
          </article>
        </div>
      </aside>

```

- [ ] **Step 2 : Verify expand toggle**

Run : ouvrir le fichier dans Chrome, scroller jusqu'à la fin de §1, cliquer `Tester →`.
Expected :
- La carte s'ouvre, montre la question + 4 options + bouton `Valider` + bouton `Recommencer` (caché).
- Le bouton du header devient `Replier ↑`.
- Le focus est sur la première case à cocher.
- Cliquer `Replier ↑` referme la carte.

- [ ] **Step 3 : Verify validation flow**

Run : ré-ouvrir la carte, cocher uniquement les options 1 et 3 (les deux vraies), cliquer `Valider`.
Expected :
- Options 1 et 3 deviennent verdâtres (stabilo teal).
- Options 2 et 4 restent neutres mais leur explication s'affiche.
- Verdict mono `Bonne réponse.` en teal.
- Bouton `Valider` désactivé, bouton `Recommencer` visible et focus dessus.

- [ ] **Step 4 : Verify wrong-answer flow**

Run : cliquer `Recommencer`, cocher uniquement les options 2 et 4 (les deux fausses), cliquer `Valider`.
Expected :
- Options 2 et 4 deviennent rouges (stabilo carmine).
- Options 1 et 3 deviennent vert/teal (`expected` — non cochées par l'utilisateur mais correctes).
- Toutes les explications s'affichent.
- Verdict `Pas tout à fait — relisez la section concernée.` en carmine.

- [ ] **Step 5 : Verify anchor link**

Run : cliquer le lien `↗ relire §1` dans une explication.
Expected : la page scrolle vers `<h2 id="malentendu">`. Pas d'erreur console.

- [ ] **Step 6 : Commit**

```bash
git add ia-et-travail/20260504-ia-et-travail-app.html
git commit -m "feat(ia-et-travail): quiz §1 — automation/augmentation/exposition"
```

---

### Task 5 : Insérer le quiz §2 (La logique GPT)

**Files:**
- Modify: `ia-et-travail/20260504-ia-et-travail-app.html` — insérer juste avant `<h2 id="frameworks">3. Cartographie...` (autour de la ligne 718).

- [ ] **Step 1 : Insérer la carte HTML quiz §2**

À insérer après le dernier `<p>` de §2 et avant `<h2 id="frameworks">` :

```html
      <aside class="quiz-card" data-quiz-id="q-gpt" data-anchor="gpt" role="region" aria-labelledby="quiz-title-gpt">
        <header class="quiz-card__head">
          <span class="quiz-card__eyebrow">// vérifier sa compréhension</span>
          <h3 class="quiz-card__title" id="quiz-title-gpt">La logique des general-purpose technologies</h3>
          <button class="quiz-card__toggle" type="button" aria-expanded="false" aria-controls="quiz-body-gpt">Tester →</button>
        </header>
        <div class="quiz-card__body" id="quiz-body-gpt" hidden>
          <article class="quiz-q" data-mode="single">
            <fieldset>
              <legend class="quiz-q__stem">Si l'IA générative est une <em>general-purpose technology</em>, qu'est-ce que la littérature sur les GPT historiques nous apprend à anticiper ?</legend>
              <ul class="quiz-q__options">
                <li>
                  <label>
                    <input type="radio" name="q-gpt">
                    <span>Une transformation immédiate et visible de la productivité agrégée dès la première décennie d'usage.</span>
                  </label>
                  <p class="quiz-q__explain" data-correct="false" hidden>Faux. Paul David documente que l'électricité, inventée commercialement dans les années 1880, n'a contribué significativement à la productivité qu'à partir des années 1920 — un palier de 30-40 ans. Le « Solow paradox » décrit le même décalage pour l'informatique des années 1970-90.</p>
                </li>
                <li>
                  <label>
                    <input type="radio" name="q-gpt">
                    <span>Un long délai entre invention et productivité agrégée, dû à la nécessité de réorganiser les processus, suivi d'une explosion de productivité une fois le palier franchi.</span>
                  </label>
                  <p class="quiz-q__explain" data-correct="true" hidden>Vrai. C'est le pattern documenté pour l'électricité (palier ~40 ans, puis la moitié de la croissance manufacturière US des années 1920 lui est attribuable). Le pari implicite des prévisions optimistes est que l'IA suivra cette trajectoire avec un palier plus court (diffusion logicielle plus rapide qu'infrastructure physique). <a href="#gpt">↗ relire §2</a></p>
                </li>
                <li>
                  <label>
                    <input type="radio" name="q-gpt">
                    <span>Un impact concentré sur les emplois physiques peu qualifiés, comme les vagues d'automatisation précédentes.</span>
                  </label>
                  <p class="quiz-q__explain" data-correct="false" hidden>Faux. McKinsey parle de <em>reverse skill bias</em> : pour la première fois, une technologie d'automatisation a un impact disproportionné sur les emplois à fort capital humain (cadres, juristes, consultants, journalistes, développeurs). La coalition gagnante/perdante n'est pas celle des révolutions précédentes.</p>
                </li>
                <li>
                  <label>
                    <input type="radio" name="q-gpt">
                    <span>Une adoption uniforme entre secteurs, sans nécessité de réorganisation interne aux entreprises.</span>
                  </label>
                  <p class="quiz-q__explain" data-correct="false" hidden>Faux. Bresnahan et Trajtenberg insistent : la GPT exige une réorganisation. Pour la machine à vapeur, c'est l'usine ; pour l'électricité, la ligne de production ; pour les TIC, le back-office. Cette réorganisation est la principale source du palier de productivité, pas la diffusion de l'outil lui-même.</p>
                </li>
              </ul>
            </fieldset>
            <button class="quiz-q__check" type="button">Valider</button>
            <div class="quiz-q__verdict" role="status" aria-live="polite" hidden></div>
            <button class="quiz-q__retry" type="button" hidden>Recommencer</button>
          </article>
        </div>
      </aside>

```

- [ ] **Step 2 : Verify single-mode validation**

Run : ouvrir la page, scroller à la fin de §2, ouvrir la carte, sélectionner l'option 2 (la bonne), `Valider`.
Expected :
- Option 2 devient verdâtre, son explication apparaît avec le lien `↗ relire §2`.
- Options 1, 3, 4 affichent leur explication mais ne sont pas marquées (ni rouges ni vertes — neutres).
- Verdict `Bonne réponse.` en teal.

- [ ] **Step 3 : Verify single-mode wrong**

Run : cliquer `Recommencer`, sélectionner l'option 1, `Valider`.
Expected :
- Option 1 devient rouge.
- Option 2 devient verte (`expected`).
- Verdict `Pas tout à fait`.

- [ ] **Step 4 : Commit**

```bash
git add ia-et-travail/20260504-ia-et-travail-app.html
git commit -m "feat(ia-et-travail): quiz §2 — logique GPT et palier"
```

---

### Task 6 : Insérer le quiz §4 (Études empiriques)

**Files:**
- Modify: `ia-et-travail/20260504-ia-et-travail-app.html` — insérer juste avant `<h2 id="engels">5. Le précédent historique...` (autour de la ligne 889).

- [ ] **Step 1 : Insérer la carte HTML quiz §4**

À insérer après le dernier `<p>` de §4 et avant `<h2 id="engels">` :

```html
      <aside class="quiz-card" data-quiz-id="q-empiriques" data-anchor="empiriques" role="region" aria-labelledby="quiz-title-empiriques">
        <header class="quiz-card__head">
          <span class="quiz-card__eyebrow">// vérifier sa compréhension</span>
          <h3 class="quiz-card__title" id="quiz-title-empiriques">Ce que mesurent (et ne mesurent pas) les études empiriques</h3>
          <button class="quiz-card__toggle" type="button" aria-expanded="false" aria-controls="quiz-body-empiriques">Tester →</button>
        </header>
        <div class="quiz-card__body" id="quiz-body-empiriques" hidden>
          <article class="quiz-q" data-mode="multi">
            <fieldset>
              <legend class="quiz-q__stem">Que faut-il garder en tête en lisant les études empiriques sur l'impact productif de l'IA (Brynjolfsson, Noy-Zhang, Peng) ? (Plusieurs réponses possibles.)</legend>
              <ul class="quiz-q__options">
                <li>
                  <label>
                    <input type="checkbox" name="q-empiriques-1">
                    <span>Plusieurs études convergent sur un effet hétérogène : les agents novices ou peu qualifiés gagnent davantage que les experts (compression des écarts par le bas).</span>
                  </label>
                  <p class="quiz-q__explain" data-correct="true" hidden>Vrai. Brynjolfsson et al. : agents novices +34 %, experts ~0 %. Noy-Zhang : rédacteurs faibles bénéficient davantage. Peng : effet plus fort pour développeurs moins expérimentés. Résultat robuste à travers plusieurs contextes. <a href="#empiriques">↗ relire §4</a></p>
                </li>
                <li>
                  <label>
                    <input type="checkbox" name="q-empiriques-2">
                    <span>Ces études établissent un effet net mesurable de l'IA sur l'emploi agrégé.</span>
                  </label>
                  <p class="quiz-q__explain" data-correct="false" hidden>Faux. Elles mesurent la productivité par travailleur dans des contextes contrôlés. Goldman Sachs (mars 2025) note explicitement « aucun effet discernable sur les indicateurs majeurs du marché du travail » au niveau agrégé. Un développeur 50 % plus productif peut soit doubler le marché, soit le faire à effectifs moitié moindres ; la littérature empirique ne distingue pas ces régimes.</p>
                </li>
                <li>
                  <label>
                    <input type="checkbox" name="q-empiriques-3">
                    <span>Les contextes étudiés (centres d'appel, rédaction de mémos, code JS) sont sélectionnés parce que le déploiement IA y est faisable, ce qui surreprésente les cas favorables.</span>
                  </label>
                  <p class="quiz-q__explain" data-correct="true" hidden>Vrai. C'est le caveat « sélection » : les entreprises et tâches étudiées sont celles où le déploiement est faisable. Les résistances organisationnelles (formation, syndicats, intégration aux systèmes existants, contraintes réglementaires) sont sous-représentées.</p>
                </li>
                <li>
                  <label>
                    <input type="checkbox" name="q-empiriques-4">
                    <span>L'effet observé est durable et mature : on peut extrapoler les gains des premières études aux dix prochaines années.</span>
                  </label>
                  <p class="quiz-q__explain" data-correct="false" hidden>Faux. Caveat « effet de nouveauté » : les premiers gains peuvent venir de tâches faciles ; le profil de gain à mesure que l'usage mature est inconnu. Acemoglu réduit lui-même son estimation de productivité à 0,55 % parce que les tâches restantes seront plus dures à automatiser.</p>
                </li>
              </ul>
            </fieldset>
            <button class="quiz-q__check" type="button">Valider</button>
            <div class="quiz-q__verdict" role="status" aria-live="polite" hidden></div>
            <button class="quiz-q__retry" type="button" hidden>Recommencer</button>
          </article>
        </div>
      </aside>

```

- [ ] **Step 2 : Verify quiz §4 flow**

Run : ouvrir la page, scroller à la fin de §4, ouvrir la carte, cocher options 1 et 3 uniquement, `Valider`.
Expected : verdict `Bonne réponse.`, options 1 et 3 vertes, options 2 et 4 neutres avec explication visible. Lien `↗ relire §4` fonctionne.

- [ ] **Step 3 : Commit**

```bash
git add ia-et-travail/20260504-ia-et-travail-app.html
git commit -m "feat(ia-et-travail): quiz §4 — caveats des études empiriques"
```

---

### Task 7 : Insérer le quiz §7 (Quatre scénarios)

**Files:**
- Modify: `ia-et-travail/20260504-ia-et-travail-app.html` — insérer juste avant `<h2 id="leviers">8. Six leviers...` (autour de la ligne 1135).

- [ ] **Step 1 : Insérer la carte HTML quiz §7**

À insérer après le dernier `<p>` de §7 et avant `<h2 id="leviers">` :

```html
      <aside class="quiz-card" data-quiz-id="q-scenarios" data-anchor="scenarios" role="region" aria-labelledby="quiz-title-scenarios">
        <header class="quiz-card__head">
          <span class="quiz-card__eyebrow">// vérifier sa compréhension</span>
          <h3 class="quiz-card__title" id="quiz-title-scenarios">Les quatre scénarios pour 2035</h3>
          <button class="quiz-card__toggle" type="button" aria-expanded="false" aria-controls="quiz-body-scenarios">Tester →</button>
        </header>
        <div class="quiz-card__body" id="quiz-body-scenarios" hidden>
          <article class="quiz-q" data-mode="single">
            <fieldset>
              <legend class="quiz-q__stem">Parmi les quatre scénarios pour 2035, lequel est décrit comme celui qui se produit <em>par défaut</em>, en l'absence de choix politiques actifs ?</legend>
              <ul class="quiz-q__options">
                <li>
                  <label>
                    <input type="radio" name="q-scenarios">
                    <span>Scénario A — Productivité partagée.</span>
                  </label>
                  <p class="quiz-q__explain" data-correct="false" hidden>Faux. A demande au contraire trois conditions politiques fortes : redistribution active, formation continue à grande échelle, institutions de partage de la valeur. C'est le moins mécanique des quatre.</p>
                </li>
                <li>
                  <label>
                    <input type="radio" name="q-scenarios">
                    <span>Scénario B — La pause d'Engels 2.0.</span>
                  </label>
                  <p class="quiz-q__explain" data-correct="true" hidden>Vrai. B est explicitement décrit comme ce qui arrive « par défaut sans choix politique » : gains captés par le sommet, salaires médians stagnants, polarisation de la classe moyenne cognitive. Techniquement plausible, économiquement non-fatal, politiquement explosif. <a href="#scenarios">↗ relire §7</a></p>
                </li>
                <li>
                  <label>
                    <input type="radio" name="q-scenarios">
                    <span>Scénario C — Le plateau.</span>
                  </label>
                  <p class="quiz-q__explain" data-correct="false" hidden>Faux. C suppose une stagnation technique qu'aucun des leaders du secteur n'anticipe. C'est le scénario le moins déstabilisant institutionnellement, mais il dépend d'une butée capacitaire des modèles, pas de l'absence de choix politique.</p>
                </li>
                <li>
                  <label>
                    <input type="radio" name="q-scenarios">
                    <span>Scénario D — La rupture agentique.</span>
                  </label>
                  <p class="quiz-q__explain" data-correct="false" hidden>Faux. D suppose à la fois une percée technique (palier &lt; 5 ans, auto-amélioration) et un effondrement institutionnel face à elle. Ce n'est pas un scénario par défaut : il combine deux ruptures.</p>
                </li>
              </ul>
            </fieldset>
            <button class="quiz-q__check" type="button">Valider</button>
            <div class="quiz-q__verdict" role="status" aria-live="polite" hidden></div>
            <button class="quiz-q__retry" type="button" hidden>Recommencer</button>
          </article>
        </div>
      </aside>

```

- [ ] **Step 2 : Verify quiz §7 flow**

Run : ouvrir la page, scroller à la fin de §7, ouvrir la carte, sélectionner option 2 (Scénario B), `Valider`.
Expected : verdict `Bonne réponse.`, option 2 verte, options 1/3/4 neutres avec explication visible.

- [ ] **Step 3 : Commit**

```bash
git add ia-et-travail/20260504-ia-et-travail-app.html
git commit -m "feat(ia-et-travail): quiz §7 — scénarios 2035"
```

---

### Task 8 : Vérification mobile

**Files:** aucun (vérification seule)

- [ ] **Step 1 : Test 375 px (iPhone SE)**

Run : Chrome DevTools → Device Mode → 375 px. Charger le fichier. Scroller à §1, ouvrir le quiz.
Expected :
- Header de carte sur 2 lignes (titre puis bouton plein largeur).
- Bouton `Tester →` à 100 % de largeur, hauteur ≥ 44 px.
- Chaque option de la liste = bloc cliquable, label étendu, padding tactile suffisant.
- Bouton `Valider` plein largeur.
- Aucun débordement horizontal (scroll horizontal = 0).
- Explications déroulent inline sous chaque option, lisibles, sans imbrication étrange.

- [ ] **Step 2 : Test 320 px (très petit écran)**

Run : DevTools → custom 320 px de large.
Expected : aucun débordement, lisibilité OK même si plus serré.

- [ ] **Step 3 : Test 1024 px et 1440 px (frontière desktop)**

Run : redimensionner à 1024 px puis 1440 px.
Expected :
- À 1024 px exactement, on est encore en mode mobile (le media query est `max-width: 1024px`).
- À 1025 px, layout desktop, header de carte sur une ligne.
- La carte reste dans la colonne `main#report` (max-width 760 px), elle ne déborde pas sur les sidebars TOC/Sources.

- [ ] **Step 4 : Si problème détecté, fix puis commit**

Si un débordement ou un défaut tactile apparaît, ajuster le CSS mobile de la Task 2 (re-modifier le bloc `@media (max-width: 1024px)`) et re-commit avec :

```bash
git add ia-et-travail/20260504-ia-et-travail-app.html
git commit -m "fix(ia-et-travail): ajustement mobile quiz-card"
```

Si tout est bon, pas de commit.

---

### Task 9 : Vérification a11y

**Files:** aucun (vérification seule)

- [ ] **Step 1 : Navigation clavier complète**

Run : retour à 1440 px desktop, recharger le fichier, cliquer dans le `<body>` une fois pour donner le focus. Naviguer uniquement au clavier.
Expected pour chaque card :
- `Tab` atteint le bouton `Tester →` du header (focus ring visible carmine).
- `Enter` ou `Espace` ouvre la carte.
- `Tab` parcourt successivement chaque `<input>` puis `Valider` puis (après validation) `Recommencer`.
- `Espace` coche/décoche les inputs.
- `Enter` active `Valider` et `Recommencer`.
- `Tab` après le retry sort de la carte vers le contenu suivant.

- [ ] **Step 2 : Vérifier `aria-live` du verdict**

Run : ouvrir DevTools → onglet Accessibility, sélectionner le `.quiz-q__verdict`.
Expected : `role=status`, `aria-live=polite`. Lecteur d'écran (si dispo : NVDA/VoiceOver) annonce le verdict après validation.

- [ ] **Step 3 : Vérifier l'absence d'interférence avec les autres widgets**

Run :
- Avec un quiz ouvert, presser `Escape`.
Expected : aucun comportement inattendu (les handlers `Escape` du fichier ferment zoom-overlay/modal-root/sidebars, mais pas le quiz — comportement souhaité, le quiz reste ouvert).
- Avec zoom-overlay ouvert (cliquer `⛶` sur un schéma), `Escape` doit le fermer normalement.
- Avec un panneau TOC ou Sources ouvert sur mobile, `Escape` les ferme.

- [ ] **Step 4 : Pas de commit si tout va bien**

Sinon ajuster et commit `fix(ia-et-travail): a11y quiz-card`.

---

### Task 10 : Non-régression

**Files:** aucun (vérification seule)

- [ ] **Step 1 : Vérifier que les schémas SVG inchangés**

Run : ouvrir la page, cliquer le bouton `⛶` sur le schéma 1 → vérifier zoom-overlay s'ouvre, molette zoome, `Escape` ferme. Idem pour schéma 4.
Expected : comportement identique à avant.

- [ ] **Step 2 : Vérifier les modals tooltip**

Run : cliquer sur un terme avec `data-tooltip` (ex. « théorème de Hulten » dans §1, ou « effet productivité d'Acemoglu et Restrepo »).
Expected : modal s'ouvre, contenu correct, `Escape` ferme.

- [ ] **Step 3 : Vérifier la sidebar Sources collapse/expand**

Run : cliquer le bouton `›` sur le bord gauche de la sidebar Sources (desktop ≥ 1025 px).
Expected : la sidebar se replie, le bouton miroir `‹` apparaît côté droit, le re-déplier la rouvre. Aucune interférence avec les quiz.

- [ ] **Step 4 : Vérifier le scrollspy du TOC**

Run : scroller la page lentement.
Expected : l'item actif du TOC change quand on franchit chaque H2. Quand on est dans une `.quiz-card`, l'item TOC reste celui de la section parente (pas de section "quiz" parasite).

- [ ] **Step 5 : Vérifier le footer disclosure IA**

Run : scroller jusqu'au footer.
Expected : la mention `Format co-écrit avec l'aide d'une IA` (ou équivalent) est toujours présente.

- [ ] **Step 6 : Pas de commit si tout va bien**

Sinon ajuster et commit ciblé.

---

### Task 11 : Push et PR via MCP GitHub

**Files:** aucun (workflow git/GitHub)

- [ ] **Step 1 : Vérifier l'historique de la branche**

Run :
```bash
git log --oneline main..HEAD
```
Expected : la liste des commits de la branche, dans l'ordre — au moins :
- `spec(quiz-widget): brainstorm validé...`
- `feat(ia-et-travail): CSS pour quiz-card (desktop)`
- `feat(ia-et-travail): CSS quiz-card variantes mobile`
- `feat(ia-et-travail): IIFE setupQuizzes...`
- `feat(ia-et-travail): quiz §1 — automation/augmentation/exposition`
- `feat(ia-et-travail): quiz §2 — logique GPT et palier`
- `feat(ia-et-travail): quiz §4 — caveats des études empiriques`
- `feat(ia-et-travail): quiz §7 — scénarios 2035`
- (éventuels `fix(...)` mobiles ou a11y)

- [ ] **Step 2 : Reviewer le diff complet avant push**

Run :
```bash
git diff main...HEAD -- ia-et-travail/
```
Expected : seuls les ajouts CSS, HTML quiz, IIFE JS dans le fichier `ia-et-travail/20260504-ia-et-travail-app.html`. Aucune modification d'autres fichiers.

Si quelque chose d'inattendu apparaît, **ne pas pousser**, demander à l'utilisateur.

- [ ] **Step 3 : Push de la branche**

Run :
```bash
git push -u origin claude/quiz-ia-et-travail
```
Expected : push réussi, branche apparaît côté origin.

- [ ] **Step 4 : Ouvrir la PR via MCP GitHub**

Tool : `mcp__github__create_pull_request` (le binaire `gh` n'est pas installé — ne pas l'utiliser).

Paramètres :
- `owner`: `mathieugug`
- `repo`: `mathieugug.github.io`
- `base`: `main`
- `head`: `claude/quiz-ia-et-travail`
- `title`: `feat(ia-et-travail): widgets quiz QCM en fin de §1, §2, §4, §7`
- `body`:

```markdown
## Pourquoi

Ajoute des micro-quiz de vérification de compréhension à 4 charnières conceptuelles de l'article *L'IA et le travail*, là où le lecteur peut sortir avec une fausse intuition s'il a survolé. Ce PR teste le pattern *quiz-card* sur cet article ; la migration vers la skill `illustrated-deep-research` arrivera dans une PR séparée si le pattern est validé.

## Décisions de design

Validées dans `docs/superpowers/specs/2026-05-06-quiz-widget-design.md` :

- **Modalité** : inline expand replié par défaut (pas d'auto-trigger, pas de modal).
- **Densité** : 4 quiz aux charnières §1 (automation/augmentation), §2 (logique GPT), §4 (études empiriques), §7 (scénarios 2035) — jamais systématique.
- **Format** : QCM mixte (radio simple ou checkbox multi selon la nuance du sujet).
- **Feedback** : pédagogique, par option, avec lien d'ancre vers la section parente.
- **Pas de score, pas de persistance, pas de tracking.**

## Vérifications faites

- Desktop 1440 px : expand, validation single, validation multi, retry, ancres.
- Mobile 320/375 px : tactile, pas de débordement horizontal.
- A11y : navigation clavier complète, `aria-expanded`/`aria-controls`/`aria-live`, `<fieldset>`+`<legend>`.
- Non-régression : zoom SVG, modals tooltip, sidebar Sources collapse/expand, scrollspy TOC, `Escape` global.

## Hors scope

- Migration vers la skill (template + références) → PR séparée.
- Application aux 7 autres apps deep-research → décision article par article, pas un projet global.
- Persistance localStorage / score cumulé / indicateur TOC → volontairement omis (cf. spec).
```

Expected : PR créée, URL retournée. **Ne pas merger automatiquement** — Mathieu merge à la main.

- [ ] **Step 5 : Communiquer l'URL de la PR à l'utilisateur**

Afficher l'URL retournée par le tool MCP. Stop. Attendre la review humaine.

---

## Self-review de ce plan

- **Couverture du spec** : modalité (Tasks 1, 4-7) ✓ ; densité 4 charnières (Tasks 4-7) ✓ ; mode mixte single/multi (data-mode dans Tasks 4-7, support JS Task 3) ✓ ; feedback pédagogique avec ancres (Tasks 4-7) ✓ ; pas de score/persistance (absent du JS Task 3) ✓ ; mobile (Task 2 + Task 8) ✓ ; a11y (Task 9) ✓ ; non-régression (Task 10) ✓ ; PR via MCP (Task 11) ✓.
- **Placeholders** : aucun, chaque tâche contient le code et les vérifs concrètes.
- **Cohérence des noms** : `setupQuizzes`, `.quiz-card`, `.quiz-q`, `.quiz-q__check`, `.quiz-q__retry`, `.quiz-q__verdict`, `.quiz-q__explain[data-correct]`, `data-mode="single|multi"`, `data-quiz-id`, `data-anchor` — tous cohérents entre Task 1 (CSS), Task 3 (JS), Tasks 4-7 (HTML).
- **Décision résolue** : `data-correct` est porté par la phrase d'explication (`<p class="quiz-q__explain" data-correct="true|false">`), pas sur l'option `<li>`. Confirmé pendant la phase brainstorming.
