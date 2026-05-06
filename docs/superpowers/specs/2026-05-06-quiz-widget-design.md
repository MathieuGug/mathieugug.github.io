# Widgets quiz QCM dans les apps deep-research

**Date** : 2026-05-06
**Cible immédiate** : `ia-et-travail/20260504-ia-et-travail-app.html`
**Cible aval** : skill `illustrated-deep-research` (template + références)

## Intention

Insérer dans les apps long format des micro-quiz de **vérification de compréhension** placés à des charnières conceptuelles. Objectif : aider le lecteur à détecter ses propres contresens, pas le noter. Ton calme, pas de gamification.

## Décisions de design

### Modalité
- **Inline expand, replié par défaut** (carte sobre en fin de section, ~64 px). Le bouton `Tester →` déroule le quiz en place.
- Refusé : auto-trigger sur scroll (intrusif, antinomique avec l'esthétique éditoriale du site) ; pastille latérale (faible découvrabilité, marges déjà tendues avec sidebars TOC/Sources).

### Densité et placement
- **3-4 quiz par article**, jamais systématique. Placés aux charnières où le lecteur peut sortir avec une **fausse intuition** s'il a survolé.
- Pour `ia-et-travail`, les charnières retenues sont : §1 *Le malentendu fondamental*, §2 *La logique GPT*, §4 *Études empiriques*, §7 *Quatre scénarios*.
- Total ~5–7 questions par article, jamais plus de 2 questions par card.

### Anatomie d'une question
- **Format mixte** : QCM 1-bonne-parmi-N (radio) **ou** plusieurs-bonnes (checkbox), choisi question par question via `data-mode="single|multi"`. Le mix évite la réduction caricaturale quand le sujet est nuancé.
- **Feedback pédagogique (B2)** : à la validation, chaque option (bonne ET fausses) est annotée d'une phrase courte expliquant *pourquoi*. La première explication contient un lien d'ancre `↗ relire §N` vers la section parente.
- **Pas de score, pas de persistance, pas de tracking**. `Recommencer` permet de retenter. Pas de localStorage. Pas d'indicateur dans le TOC.

### Visual
- Carte `<aside class="quiz-card">` avec `border-left: 3px solid var(--accent)`, fond `var(--paper-2)`.
- Eyebrow mono uppercase `// vérifier sa compréhension`, titre court sérif `1.05rem`.
- Pas d'emoji, pas de mascotte. ✓ et ✗ en symboles unicode discrets ou SVG inline.
- Animation d'ouverture : `max-height` 240 ms `cubic-bezier(.4,0,.2,1)`.

## Architecture

### Authoring : HTML inline avec attributs `data-*`

```html
<aside class="quiz-card" data-quiz-id="q-malentendu" data-anchor="malentendu">
  <header class="quiz-card__head">
    <span class="quiz-card__eyebrow">// vérifier sa compréhension</span>
    <h3 class="quiz-card__title">Automation vs augmentation</h3>
    <button class="quiz-card__toggle" type="button" aria-expanded="false" aria-controls="quiz-body-malentendu">Tester →</button>
  </header>
  <div class="quiz-card__body" id="quiz-body-malentendu" hidden>
    <article class="quiz-q" data-mode="multi">
      <fieldset>
        <legend class="quiz-q__stem">Lesquelles de ces affirmations sont vraies ?</legend>
        <ul class="quiz-q__options">
          <li>
            <label>
              <input type="checkbox" name="q-malentendu-1">
              <span>Texte de l'option</span>
            </label>
            <p class="quiz-q__explain" data-correct="true" hidden>Phrase d'explication. <a href="#malentendu">↗ relire §1</a></p>
          </li>
          <!-- autres options -->
        </ul>
      </fieldset>
      <button class="quiz-q__check" type="button">Valider</button>
      <div class="quiz-q__verdict" role="status" aria-live="polite" hidden></div>
      <button class="quiz-q__retry" type="button" hidden>Recommencer</button>
    </article>
  </div>
</aside>
```

Le contenu du quiz (stem, options, explications) vit dans le DOM aux côtés de la prose qu'il teste. L'auteur édite les deux dans la foulée — pas de structure de données séparée.

### Comportement JS : un seul IIFE `setupQuizzes()`

Ajouté au bloc `<script>` final, après `setupZoom()`, `setupModals()`. Responsabilités :
1. Scanne `document.querySelectorAll('.quiz-card')`
2. Attache un handler sur `.quiz-card__toggle` qui bascule `aria-expanded`, le `hidden` du body, et le label du bouton (`Tester →` ↔ `Replier ↑`). Anime via classe CSS, pas via JS direct.
3. Pour chaque `.quiz-q`, attache un handler sur `.quiz-q__check` qui :
   - Lit le `data-mode` et les `<input>` cochés
   - Compare aux options dont `.quiz-q__explain[data-correct="true"]` existe (inversion : la bonneté est portée par la phrase d'explication, pas par l'option — ça force l'auteur à toujours écrire l'explication)
   - Marque chaque `<li>` avec `.is-correct` ou `.is-wrong` selon la réponse de l'utilisateur
   - Affiche tous les `.quiz-q__explain`
   - Désactive les inputs et le bouton `Valider`
   - Affiche le verdict global dans `.quiz-q__verdict` (`Bonne réponse.` / `Pas tout à fait — relisez.`)
   - Affiche `Recommencer`
4. Handler `Recommencer` : restaure l'état initial (uncheck, re-cache explanations, ré-active inputs, masque verdict et retry)

Pas de gestion d'état globale, pas de framework, pas de localStorage.

### CSS : ajouté au `<style>` existant

Bloc nouveau `/* === quiz cards === */` après les styles de modals. Réutilise les variables `--accent`, `--paper-2`, `--ink`, `--ink-dim`, `--carmine` déjà définies. Inclus la déclinaison mobile dans le `@media (max-width: 1024px)` existant (typographie de l'app, cf. CLAUDE.md règle 3 mobile-friendliness).

## Accessibilité

- `<fieldset>` + `<legend>` pour grouper le stem et ses options
- `<input type="radio|checkbox">` natifs (pas de div custom)
- Bouton expand : `aria-expanded`, `aria-controls`
- Verdict : `role="status" aria-live="polite"`
- Lien d'ancre : `<a href="#anchor">` standard
- Focus management : à l'ouverture, focus sur premier `<input>` ; à la validation, focus sur `Recommencer`
- Tab + Espace + Entrée fonctionnent par défaut grâce aux primitives natives

## Mobile (< 1024 px)

- Card en colonne : header sur 2 lignes (titre puis bouton), bouton plein largeur, hauteur tactile min 44 px
- Padding `14px 16px`
- Chaque `<li>` d'option = bloc cliquable plein largeur (label étendu)
- Explications déroulent inline, pas en accordéon imbriqué
- Aucune logique JS spécifique mobile

## Non-régression à vérifier sur `ia-et-travail`

- `Escape` ferme bien zoom-overlay, modal-root, panneaux TOC/Sources — pas d'interférence avec un éventuel handler quiz
- TOC scrollspy continue de marquer la section active quand on est dans une card quiz
- Lien d'ancre `#malentendu` scrolle vers le H2 sans casser le sticky header
- Aucun débordement horizontal sur 320 / 375 / 414 / 1024 / 1440 / 1920 px
- Sidebar Sources collapse/expand fonctionne identique
- Bouton zoom des SVG inchangé

## Plan de test (sur la branche `claude/quiz-ia-et-travail`)

1. Implémenter CSS + 4 cards HTML + IIFE dans `ia-et-travail/20260504-ia-et-travail-app.html`
2. Rédiger le contenu des ~5–7 questions (stem + options + explications), en relisant les sections concernées pour ancrer les distracteurs sur des contresens plausibles
3. Vérifier desktop (Chrome) : expand, validation, feedback, ancres
4. Vérifier mobile (DevTools 375 px) : tactile, débordements, lisibilité
5. A11y : navigation clavier complète, lecture VoiceOver/NVDA si dispo
6. Non-régression : items de la section précédente
7. Commit, ouvrir PR via MCP GitHub. **Pas de merge automatique.**

## Migration vers la skill (branche distincte `claude/skill-quiz-widget`)

À déclencher une fois `claude/quiz-ia-et-travail` mergé sur `main` :

1. `assets/app-template.html` : ajouter le bloc CSS `.quiz-card` (incluant variantes mobile), un commentaire-template HTML d'une card vide montrant les deux modes (single/multi), l'IIFE `setupQuizzes()` dans le bloc script
2. `references/companion-app.md` : nouvelle section *§ Widgets quiz de compréhension* — modalité, règle de placement (3-4 charnières conceptuelles, jamais systématique), modèle d'authoring `data-*`, raison du non-score, contenu d'a11y attendu
3. `SKILL.md` : ajouter une étape dans la checklist de production *Identifier 3-4 charnières conceptuelles → quiz de compréhension*
4. Commits avec `git add -f` (nécessaire à cause du `.gitignore` parent), branche distincte du test, PR séparée

**Règle stricte** : la skill et le test sont sur des branches différentes. Pas de merge croisé.

## Hors scope

- Persistance des réponses (localStorage)
- Score cumulé / barre de progression
- Indicateur dans le TOC (§N ✓)
- Auto-trigger sur scroll
- Telemetry / analytics
- Application rétroactive aux 7 autres apps deep-research existantes (à décider article par article ; pas un projet global)
- Quiz à réponse libre / texte ouvert
- Internationalisation (le site est francophone)
