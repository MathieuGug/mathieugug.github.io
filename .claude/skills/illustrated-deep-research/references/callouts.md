# Callouts — renvois inter-dossiers

Pattern `main .callout` pour pointer vers un autre dossier en parallèle d'une section de prose (ex. obs ↔ eval, harness ↔ agent-sdk). Bordure gauche en couleur secondaire (`--teal` par défaut) pour différencier visuellement des `.quiz-card` (bordure `--carmine`).

## Structure HTML

```html
<aside class="callout">
  <button type="button" class="callout-thumb-link"
          data-svg-src="../<autre-dossier>/images/<schema>.svg"
          data-svg-alt="Description de la mini-vignette"
          aria-label="Agrandir : <titre>">
    <img class="callout-thumb" src="../<autre-dossier>/images/<schema>.svg"
         alt="…" loading="lazy">
  </button>
  <div class="callout-body">
    <p class="callout-eyebrow">Eyebrow contextuel (mono caps)</p>
    <p>Texte de renvoi avec <a href="../<autre-dossier>/">lien</a> vers le hub.</p>
  </div>
</aside>
```

## Mécanique du zoom

La mini-vignette est un `<button>` (pas un `<a>`). Le click est intercepté par `setupPortraitZoom()` dans `/assets/dossier-app.js` : il lit `data-svg-src` / `data-svg-alt`, fetche le SVG et l'injecte dans `#zoom-overlay` via `window.__dossierOpenZoom`.

**Aucun script inline à ajouter.** Le seul prérequis est d'inclure la lib (`<script src="/assets/dossier-app.js" defer>`) — ce qui est déjà le contrat de base d'une app deep-research. Le test CI `apps-integration.test.mjs` interdit les IIFE inline qui ré-implémenteraient ce comportement (elles dédoubleraient les listeners et ouvriraient deux modals).

## Variantes

`<aside class="callout callout--text">` — variante sans vignette, pleine largeur, pour un renvoi purement textuel.

## Où trouver le CSS

Le CSS canonique du `.callout` s'embarque localement dans la `<style>` de chaque app qui ajoute des callouts (pas dans une lib partagée à date). **Référence complète** (sélecteur `.callout` ~20 lignes pour layout 2-col vignette + body, bordure gauche, padding, responsive `max-width: 640px` qui empile vignette au-dessus, transitions hover, badge `::after`, JS IIFE avancée avec cache `Map` et `DOMParser`) : `references/companion-app.md` § « Encadrés de renvoi vers d'autres dossiers ».

## Quand l'utiliser

À chaque charnière où le lecteur peut tirer parti d'un dossier voisin (parallèle thématique, prérequis conceptuel, suite logique). Ne pas saupoudrer : un renvoi par section maximum, sinon ça devient du bruit.
