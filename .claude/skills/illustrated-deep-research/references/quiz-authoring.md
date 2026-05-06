# Quiz authoring — JSON sidecar workflow

Authoring quiz cards as inline HTML inside the companion app burns a lot of
tokens for very little signal. The quiz template is ~70 % structural HTML
(aria, role, fieldset, legend, ul/li/label/input/span/p, button trio) and
~30 % content. When you pay LLM tokens by the line, the boilerplate dominates.

The `assets/insert-quizzes.py` builder lets you author quizzes as compact JSON
and inject them with one Python invocation. CSS + IIFE land once, content lands
per call. **Use it whenever you ship a quiz** — the inline-HTML pattern from
`references/companion-app.md` § "Widgets quiz de compréhension" is now the
fallback for one-off cases where Python isn't available.

## When to use

- Adding quizzes to a brand-new app : write `quizzes.json` next to the report,
  run the script once. CSS + IIFE are injected automatically the first time.
- Adding quizzes to an already-shipped app (most common case — quizzes are
  often a follow-up pass after the report is read by humans) : same call,
  the CSS + IIFE injection step is skipped if `setupQuizzes` is already
  present in the file.
- Editing a deployed quiz : edit the JSON, re-run the script. The matching
  `<aside class="quiz-card" data-quiz-id="q-{id}">` is replaced in place,
  everything else is untouched.

## JSON schema

The file is a top-level **array** of quiz objects.

```json
[
  {
    "id": "saturation",
    "title": "Quand une capability eval atteint 100 %",
    "anchor": "23-capability-evals-vs-regression-evals",
    "before_heading_id": "3-passk-vs-passk-...",
    "questions": [
      {
        "mode": "single",
        "stem": "Votre capability eval, qui partait à 35 %, plafonne à 100 %. Que faut-il en conclure ?",
        "options": [
          {
            "text": "L'agent est mature — c'est l'objectif que vous cherchiez.",
            "correct": false,
            "explain": "Faux. Une eval saturée ne mesure plus rien…"
          },
          {
            "text": "Cette eval doit <em>graduate</em> en régression eval et être remplacée par une suite plus difficile.",
            "correct": true,
            "explain": "Vrai. Une capability eval doit partir bas (&lt; 50 %) pour porter du signal…",
            "back_link": "↗ relire §2.3"
          }
        ]
      }
    ]
  }
]
```

Field-by-field:

- **`id`** — unique short slug. The script prefixes it with `q-` everywhere
  it appears in the DOM (`data-quiz-id="q-{id}"`, `id="quiz-body-{id}"`,
  `aria-controls="quiz-body-{id}"`, `aria-labelledby="quiz-title-{id}"`,
  `name="q-{id}…"`). Pick something stable — renaming forces the script to
  insert a new card next to the old one.
- **`title`** — short serif title for the card head. HTML allowed (use
  sparingly — `<em>` is fine, full markup is overkill).
- **`anchor`** — id of the section this quiz tests. Used as the target of
  the `<a href="#{anchor}">↗ relire §N</a>` link generated whenever an option
  has a `back_link` field. Also written verbatim into `data-anchor="…"` on
  the `<aside>` so reading-order tooling can locate the home section.
- **`before_heading_id`** — id of the **next** `<h2>` or `<h3>` in the prose.
  The card is inserted right before it (or before a preceding `<hr />` if
  one exists, so the visual flow stays *...prose... `<quiz/>` `<hr/>`
  `<heading/>`*). The ids on the host site's reports are stable across
  rebuilds, so this contract is robust.
- **`questions`** — array of 1 to 3 question objects. The CSS already paints
  the `+ .quiz-q` separator between sibling questions, the IIFE attaches
  validation handlers per `.quiz-q`. No code change needed for multi-question
  cards.

Per question:

- **`mode`** — `"single"` or `"multi"`.
  - `single` : `<input type="radio">`, exactly one option carries
    `"correct": true`. The user picks one; verdict is "right" iff the picked
    option is the correct one.
  - `multi` : `<input type="checkbox">`, any number of options carry
    `"correct": true`. The user picks a subset; verdict is "right" iff the
    picked subset matches *exactly* the correct subset.
  - Mix freely within an article — `single` is for tranchant questions,
    `multi` for "lesquelles parmi celles-ci".
- **`stem`** — the question text (the `<legend>`). HTML allowed — wrap
  emphasized terms in `<em>`, use `(Plusieurs réponses possibles.)` on
  multi-mode stems for clarity.
- **`options`** — array of option objects. Aim for 3–6 options per
  question. Below 3 the quiz feels trivial; above 6 the reader fatigues.

Per option:

- **`text`** — the visible answer text. HTML allowed.
- **`correct`** — boolean. The script writes this as `data-correct="true|false"`
  on the explanation paragraph (not on the option `<li>`, by design — forces
  every option to ship a real explanation).
- **`explain`** — the explanation paragraph shown after validation. **Always
  write a real explanation, even for wrong options** — the pedagogical value
  of the widget comes from explaining *why* a tempting wrong answer is wrong.
  Pattern : start with `Vrai.` / `Faux.` / `Insuffisant.`, then one or two
  sentences. HTML allowed.
- **`back_link`** *(optional)* — when present, the script appends
  `<a href="#{anchor}">{back_link}</a>` to the explanation. Convention:
  `↗ relire §N`. **Set this on at most ONE option per question** — the most
  representative correct one. Repetition kills the signal.

## Authoring rules (content)

These come from `references/companion-app.md` § "Widgets quiz de
compréhension" and apply regardless of authoring path:

- **3 to 4 quiz cards maximum per article**, never one per section. Place at
  *charnières conceptuelles* where a survol-reader risks a wrong intuition
  (counter-intuitive distinction, often-misread statistic, scenario the
  default human read simplifies).
- **1 to 3 questions per card**, never more.
- **Don't ship** : a recap/exam quiz at the end (turns the widget into a
  test and breaks the calm tone), a quiz per section (ritualises the gesture
  and dilutes value).
- **No emoji, no mascot, no score, no progress bar**, no localStorage, no
  TOC indicator. The widget is a re-reading aid, not a game.
- **Eyebrow stays `// vérifier sa compréhension`** — house signature, do
  not rename per quiz.

Content is HTML, not plain text. Write `<em>` for emphasis, `&lt;` for a
literal less-than sign, `&amp;` for ampersand, `&laquo; texte &raquo;` or
`« texte »` for French quotes, `&#x2191;` etc. for arrows if you want them
escaped (otherwise the literal character works in UTF-8 JSON).

## Invocation

From the repo root :

```
python .claude/skills/illustrated-deep-research/assets/insert-quizzes.py \
  --app evaluation-agentique/20260501-evaluation-agentique-app.html \
  --quizzes evaluation-agentique/quizzes.json
```

Or in PowerShell on Windows :

```
python .\.claude\skills\illustrated-deep-research\assets\insert-quizzes.py `
  --app evaluation-agentique\20260501-evaluation-agentique-app.html `
  --quizzes evaluation-agentique\quizzes.json
```

Flags :

- `--check` : dry-run. Prints what would be inserted/replaced/skipped without
  writing. Use before a sensitive run.
- `--strict` : raise an error (instead of a stderr warning) when a quiz's
  `before_heading_id` is not found in the app HTML. Useful in CI or when
  you've just renamed a section and want to catch stale references.

The script is idempotent — re-running it on a file that already has
`setupQuizzes` skips the CSS/IIFE injection and just refreshes the cards.
You can run it after every JSON edit without polluting the diff.

## Insertion contract

For each quiz, the script does in order :

1. **Replace if present.** Looks for `<aside class="quiz-card" data-quiz-id="q-{id}">`
   to its closing `</aside>`. If matched, replaces the entire `<aside>` block
   with the freshly rendered one. Surrounding whitespace is normalised to one
   blank line on each side.
2. **Else insert before the next heading.** Looks for `<h2 id="{before_heading_id}">`
   or `<h3 id="{before_heading_id}">`. If preceded (within ~80 chars) by a
   `<hr />` separator, the card lands BEFORE the `<hr />`. Otherwise it lands
   directly before the heading.
3. **Else warn or fail.** If `before_heading_id` doesn't match any heading,
   warns to stderr and skips the quiz (default), or raises (under `--strict`).

## Tips

- **Test the JSON in `--check` mode first** if you're unsure about
  `before_heading_id`s. The script lists each quiz with its action
  (`inserted` / `replaced` / `skipped`).
- **Keep a `quizzes.json` per artefact** next to the app, even if you currently
  have only one quiz. The file is the source of truth ; the HTML is generated.
- **Don't hand-edit the generated `<aside>` blocks.** Edit the JSON and
  re-run the script. Hand-edits are silently overwritten on the next run.
- **`<a class="cite">` citations inside a quiz explanation** work : the
  citation handler is body-level and fires on any matching click. Same for
  `<span class="term" data-tooltip="…">`. The quiz body is just HTML.

## Token budget — back-of-envelope

For a 4-quiz article (≈ 4 × 5 options each, single + multi mix) :

- **Inline HTML authoring** (the legacy path) : ≈ 480 lines emitted by the
  LLM for the 4 cards, plus 130 lines CSS, plus 90 lines IIFE = **≈ 700 lines
  of output tokens** per quiz batch.
- **JSON sidecar** : ≈ 150 lines of JSON emitted by the LLM. CSS + IIFE
  (220 lines) live in the script and are never re-emitted. **≈ 150 lines of
  output tokens** per quiz batch.

Roughly 4–5× fewer output tokens, cumulative across reports because the CSS
and IIFE are written once.
