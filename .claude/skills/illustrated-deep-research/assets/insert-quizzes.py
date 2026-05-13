#!/usr/bin/env python3
"""
insert-quizzes.py — inject quiz cards into a deep-research companion app from a JSON sidecar.

Usage:
    python insert-quizzes.py --app PATH --quizzes PATH [--check] [--strict]

What it does
------------
1. If 'setupQuizzes' is not yet in the file, injects:
   - The full quiz CSS (desktop + a `@media (max-width: 1024px)` block) just
     before `</style>`.
   - The `setupQuizzes()` IIFE just before the final `</script>`.
   Both are skipped on subsequent runs (idempotent).

2. For each quiz in the JSON array:
   - If `<aside class="quiz-card" data-quiz-id="q-{id}">` already exists,
     it is replaced in place.
   - Otherwise, the rendered card is inserted just before the heading
     `<h2 id="{before_heading_id}">` or `<h3 id="{before_heading_id}">`.
     If that heading is preceded by `<hr />`, the card lands BEFORE the `<hr />`
     so the visual flow stays "...prose... <quiz/> <hr/> <heading/>".

JSON schema (file is an array of quiz objects)
----------------------------------------------
    {
      "id": "saturation",
      "title": "Quand une capability eval atteint 100 %",
      "anchor": "23-capability-evals-vs-regression-evals",
      "before_heading_id": "3-passk-vs-passk-...",
      "questions": [
        {
          "mode": "single" | "multi",
          "stem": "Stem text (HTML allowed).",
          "options": [
            {
              "text":      "Option text (HTML allowed).",
              "correct":   true | false,
              "explain":   "Explanation paragraph (HTML allowed).",
              "back_link": "↗ relire §N"   // optional, on ONE correct option per question
            }
          ]
        }
      ]
    }

Naming convention for `<input>` elements (preserves backwards compatibility
with hand-written quizzes):
- single, 1 question        : all radios share `name="q-{id}"`.
- single, N>1 questions     : question k's radios share `name="q-{id}-{k}"`.
- multi,  1 question        : each option has `name="q-{id}-{opt}"`.
- multi,  N>1 questions     : each option has `name="q-{id}-{k}-{opt}"`.

Content is HTML — write `<em>` for emphasis, `&lt;` for a literal `<`, etc.
The script does NOT escape user input (single-author personal site, trust
the JSON).
"""
from __future__ import annotations

import argparse
import json
import pathlib
import re
import sys


# ---------------------------------------------------------------------------
# Templates
# ---------------------------------------------------------------------------

# Single self-contained CSS block. Appended before </style>.
QUIZ_CSS = """
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
      background-image: linear-gradient(transparent 60%, rgba(31, 85, 96, 0.14) 60%);
      background-size: 100% 1.5em;
      background-repeat: repeat-y;
    }
    .quiz-q__options li.is-wrong > label > span {
      background-image: linear-gradient(transparent 60%, rgba(178, 59, 27, 0.14) 60%);
      background-size: 100% 1.5em;
      background-repeat: repeat-y;
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

    @media (max-width: 1024px) {
      /* === quiz cards : variantes mobile === */
      .quiz-card { padding: 14px 16px; margin: 1.6rem 0 2rem; }
      .quiz-card__head { gap: 0.6rem; }
      .quiz-card__title { flex-basis: 100%; overflow-wrap: break-word; }
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
      .quiz-q__options label { padding: 8px 0; min-height: 44px; align-items: center; }
      .quiz-q__explain { margin: 0.5rem 0 0 0; padding: 10px 12px; }
      .quiz-q__retry { padding: 10px 0; min-height: 44px; }
    }
"""


# IIFE injected before the closing </script>. Verbatim copy of the canonical
# setupQuizzes function shipped with the deep-research apps.
QUIZ_IIFE = """    (function setupQuizzes() {
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
        const userPicked = items.map(li => {
          const inp = li.querySelector('input');
          return inp ? !!inp.checked : false;
        });
        const expected = items.map(li => li.querySelector('.quiz-q__explain[data-correct="true"]') !== null);
        let allRight = true;
        items.forEach((li, i) => {
          const explain = li.querySelector('.quiz-q__explain');
          if (explain) explain.hidden = false;
          const input = li.querySelector('input');
          if (input) input.disabled = true;
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
"""


# ---------------------------------------------------------------------------
# Rendering
# ---------------------------------------------------------------------------

def input_name(qid: str, mode: str, q_idx: int, opt_idx: int, num_questions: int) -> str:
    """Build the `name` attribute for an <input>, mirroring the historical pattern."""
    parts = [f"q-{qid}"]
    if num_questions > 1:
        parts.append(str(q_idx + 1))
    if mode == "multi":
        parts.append(str(opt_idx + 1))
    return "-".join(parts)


def render_option(qid: str, q_idx: int, opt_idx: int, mode: str,
                  num_questions: int, opt: dict, anchor: str) -> str:
    name = input_name(qid, mode, q_idx, opt_idx, num_questions)
    input_type = "radio" if mode == "single" else "checkbox"
    correct = "true" if opt.get("correct") else "false"
    explain = opt["explain"]
    back_link = opt.get("back_link")
    if back_link:
        explain = f'{explain} <a href="#{anchor}">{back_link}</a>'

    return (
        '          <li>\n'
        '            <label>\n'
        f'              <input type="{input_type}" name="{name}">\n'
        f'              <span>{opt["text"]}</span>\n'
        '            </label>\n'
        f'            <p class="quiz-q__explain" data-correct="{correct}" hidden>{explain}</p>\n'
        '          </li>'
    )


def render_question(qid: str, q_idx: int, q: dict, anchor: str, num_questions: int) -> str:
    mode = q.get("mode", "single")
    if mode not in ("single", "multi"):
        raise ValueError(f"Quiz '{qid}' question {q_idx + 1}: mode must be 'single' or 'multi', got '{mode}'.")
    stem = q["stem"]
    options = q["options"]
    if not options:
        raise ValueError(f"Quiz '{qid}' question {q_idx + 1}: at least one option required.")
    options_html = "\n".join(
        render_option(qid, q_idx, i, mode, num_questions, opt, anchor)
        for i, opt in enumerate(options)
    )
    return (
        f'    <article class="quiz-q" data-mode="{mode}">\n'
        f'      <fieldset>\n'
        f'        <legend class="quiz-q__stem">{stem}</legend>\n'
        f'        <ul class="quiz-q__options">\n'
        f'{options_html}\n'
        f'        </ul>\n'
        f'      </fieldset>\n'
        f'      <button class="quiz-q__check" type="button">Valider</button>\n'
        f'      <div class="quiz-q__verdict" role="status" aria-live="polite" hidden></div>\n'
        f'      <button class="quiz-q__retry" type="button" hidden>Recommencer</button>\n'
        f'    </article>'
    )


def render_quiz_card(quiz: dict) -> str:
    qid = quiz["id"]
    title = quiz["title"]
    anchor = quiz["anchor"]
    questions = quiz["questions"]
    if not questions:
        raise ValueError(f"Quiz '{qid}': at least one question required.")
    num_questions = len(questions)
    questions_html = "\n".join(
        render_question(qid, i, q, anchor, num_questions)
        for i, q in enumerate(questions)
    )
    return (
        f'<aside class="quiz-card" data-quiz-id="q-{qid}" data-anchor="{anchor}" role="region" aria-labelledby="quiz-title-{qid}">\n'
        f'  <header class="quiz-card__head">\n'
        f'    <span class="quiz-card__eyebrow">// vérifier sa compréhension</span>\n'
        f'    <h3 class="quiz-card__title" id="quiz-title-{qid}">{title}</h3>\n'
        f'    <button class="quiz-card__toggle" type="button" aria-expanded="false" aria-controls="quiz-body-{qid}">Tester →</button>\n'
        f'  </header>\n'
        f'  <div class="quiz-card__body" id="quiz-body-{qid}" hidden>\n'
        f'{questions_html}\n'
        f'  </div>\n'
        f'</aside>'
    )


# ---------------------------------------------------------------------------
# HTML mutation
# ---------------------------------------------------------------------------

def inject_css_iife_if_missing(html: str) -> tuple[str, bool]:
    # Apps qui chargent /assets/dossier-app.js : la lib partagée fournit déjà
    # setupQuizzes() et son CSS quiz est attendu dans assets/dossier-app.css.
    # Ré-injecter ici provoquerait un double binding (chaque click déclencherait
    # deux fois le toggle, l'état s'annule visuellement). On skip totalement.
    if re.search(r'<script[^>]+src=["\'](?:\.\.\/)?\/?assets\/dossier-app\.js["\']', html):
        return html, False

    if "setupQuizzes" in html:
        return html, False
    if "</style>" not in html:
        raise ValueError("No </style> in app HTML — cannot inject quiz CSS.")
    if "</body>" not in html:
        raise ValueError("No </body> in app HTML — cannot inject quiz IIFE.")

    # Inject CSS just before the FIRST </style> (the one that closes <head>'s style block).
    html = html.replace("</style>", QUIZ_CSS + "  </style>", 1)

    # Inject IIFE as its own inline <script> just before </body>. We must NOT
    # merge it into an existing <script src="..."> — when a <script> carries a
    # `src` attribute the browser silently ignores its inline text content
    # (HTML spec). Wrapping in our own pair guarantees execution regardless of
    # whichever scripts the host page already declares.
    iife_block = "<script>\n" + QUIZ_IIFE + "</script>\n"
    html = html.replace("</body>", iife_block + "</body>", 1)
    return html, True


def insert_or_replace_quiz(html: str, quiz: dict, strict: bool = False) -> tuple[str, str]:
    qid = quiz["id"]
    rendered = render_quiz_card(quiz)

    # Replace if already present.
    pat = re.compile(
        r'\s*<aside class="quiz-card" data-quiz-id="q-' + re.escape(qid) + r'".*?</aside>\s*',
        re.DOTALL,
    )
    if pat.search(html):
        html = pat.sub("\n\n" + rendered + "\n\n", html, count=1)
        return html, "replaced"

    # Insert before <h2 id="..."> or <h3 id="..."> matching `before_heading_id`.
    before_id = quiz["before_heading_id"]
    heading_re = re.compile(r'<h[23] id="' + re.escape(before_id) + r'"')
    m = heading_re.search(html)
    if not m:
        msg = f"Quiz '{qid}': before_heading_id='{before_id}' not found in app HTML."
        if strict:
            raise ValueError(msg)
        print(f"WARN: {msg} (skipped)", file=sys.stderr)
        return html, "skipped"

    insert_pos = m.start()

    # If the heading is preceded by `<hr />` (with optional whitespace), insert
    # the quiz BEFORE the <hr /> so the visual flow stays:
    #   ...prose...
    #   <quiz/>
    #   <hr/>
    #   <heading/>
    pre_window = html[max(0, insert_pos - 80):insert_pos]
    hr_match = re.search(r'<hr\s*/?>\s*\Z', pre_window)
    if hr_match:
        insert_pos = max(0, insert_pos - 80) + hr_match.start()

    insertion = "\n" + rendered + "\n\n"
    html = html[:insert_pos] + insertion + html[insert_pos:]
    return html, "inserted"


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser(
        description="Inject quiz cards from a JSON sidecar into a deep-research companion app.",
    )
    parser.add_argument("--app", required=True, help="Path to the companion app HTML (edited in place).")
    parser.add_argument("--quizzes", required=True, help="Path to the JSON quiz file (array of quiz objects).")
    parser.add_argument("--check", action="store_true", help="Dry run — print actions, do not write.")
    parser.add_argument("--strict", action="store_true",
                        help="Raise instead of warn when a `before_heading_id` is not found.")
    args = parser.parse_args()

    app_path = pathlib.Path(args.app)
    quiz_path = pathlib.Path(args.quizzes)
    html = app_path.read_text(encoding="utf-8")
    quizzes = json.loads(quiz_path.read_text(encoding="utf-8"))
    if not isinstance(quizzes, list):
        raise ValueError(f"{quiz_path}: top-level JSON must be an array of quiz objects.")

    html, css_iife_done = inject_css_iife_if_missing(html)
    if css_iife_done:
        print(f"Injected quiz CSS + IIFE into {app_path.name}.")

    for quiz in quizzes:
        html, action = insert_or_replace_quiz(html, quiz, strict=args.strict)
        anchor = quiz.get("anchor", "?")
        print(f"  Quiz '{quiz['id']}' — {action} (anchor: {anchor}).")

    if args.check:
        print("--check mode: no write performed.")
        return 0

    # Preserve LF newlines (do not let Windows convert to CRLF on write).
    with open(app_path, "w", encoding="utf-8", newline="") as f:
        f.write(html)
    print(f"Wrote {app_path}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
