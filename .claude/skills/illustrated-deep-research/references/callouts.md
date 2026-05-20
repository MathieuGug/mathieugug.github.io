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

La mini-vignette est un `<button>` (pas un `<a>`). Un IIFE inline en bas de page attache un click handler qui fetch le SVG et réutilise `window.__dossierOpenZoom` (exposé par la lib partagée `/assets/dossier-app.js` ou par l'IIFE locale `setupZoom()` selon le contexte).

```js
(function setupCalloutZoom() {
  document.querySelectorAll('.callout-thumb-link').forEach(btn => {
    btn.addEventListener('click', async () => {
      const src = btn.dataset.svgSrc;
      const alt = btn.dataset.svgAlt || '';
      const res = await fetch(src);
      const svgText = await res.text();
      if (window.__dossierOpenZoom) {
        window.__dossierOpenZoom(svgText, alt);
      }
    });
  });
})();
```

## Variantes

`<aside class="callout callout--text">` — variante sans vignette, pleine largeur, pour un renvoi purement textuel.

## Où trouver le CSS

Le CSS canonique du `.callout` s'embarque localement dans la `<style>` de chaque app qui ajoute des callouts (pas dans une lib partagée à date). **Référence complète** (sélecteur `.callout` ~20 lignes pour layout 2-col vignette + body, bordure gauche, padding, responsive `max-width: 640px` qui empile vignette au-dessus, transitions hover, badge `::after`, JS IIFE avancée avec cache `Map` et `DOMParser`) : `references/companion-app.md` § « Encadrés de renvoi vers d'autres dossiers ».

## Quand l'utiliser

À chaque charnière où le lecteur peut tirer parti d'un dossier voisin (parallèle thématique, prérequis conceptuel, suite logique). Ne pas saupoudrer : un renvoi par section maximum, sinon ça devient du bruit.
