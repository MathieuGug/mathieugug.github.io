# Tests statiques — bibliothèque dossier-app

Suite de tests zero-dep qui valide que :
1. La lib `assets/dossier-app.{js,css}` est intègre.
2. Chaque app `*/2026*-app.html` respecte le contrat de la lib.

## Lancer les tests

Local :
```
node --test tests/lib-contract.test.mjs tests/apps-integration.test.mjs
```

Node ≥ 20 requis (`node:test` builtin). Le mode `node --test <dir>` (auto-discovery par dossier) ne fonctionne pas de manière portable sur Windows — passer chaque fichier explicitement.

## Périmètre

**Couvert** :
- Validité syntaxique de la lib JS.
- Présence des fonctions/sélecteurs attendus dans la lib (cf. `fixtures/`).
- Chaque app embarque le `<script src>` et le `<link rel>` de la lib.
- Chaque app définit `window.SCHEMAS` inline.
- Chaque app contient les IDs racines requis.
- Aucune app ne ré-inline les fonctions extraites.

**Non couvert** :
- Comportement runtime (le modal s'ouvre vraiment, le zoom marche, etc.).
- Rendu visuel.
- A11y.
- Cross-browser.

Pour ces aspects : validation manuelle au moment du merge (ouvrir 2-3 apps dans le navigateur, exercer zoom + modal + citations).

## Mettre à jour le contrat

Quand on ajoute une fonction ou un sélecteur à la lib, l'ajouter aussi dans :
- `fixtures/expected-fns.json` si c'est une fonction
- `fixtures/expected-ids.json` si c'est un ID/sélecteur clé

Sinon les tests passent même si la fonction est manquante dans une lib future.
