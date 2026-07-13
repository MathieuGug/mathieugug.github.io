# Le modèle du monde caché dans le prédicteur de tokens

> 13 juillet 2026 — Mathieu Guglielmino

Deep dive croisant les dossiers **World models** et **Modèles de raisonnement** : un prédicteur de séquence entraîné sans aucune intention de modéliser le monde en construit-il un par accident ? Thèse : prédire parfaitement le prochain token ne prouve pas qu'on ait induit le monde qui l'a généré. « Avoir un modèle du monde » n'est pas binaire, c'est une propriété mesurable.

## Fichiers

- `index.html` — hub d'entrée du dossier (présentation + accès aux formats).
- `20260713-llm-modele-du-monde-app.html` — **application illustrée** (long-form interactif) : 7 sections, 7 schémas SVG cliquables (28 régions), glossaire au survol, sommaire et sources actifs. S'ouvre directement dans un navigateur, sans serveur.
- `20260713-llm-modele-du-monde-rapport.md` — rapport markdown complet (compatible Obsidian), citations en notes de bas de page, schémas référencés en syntaxe `![alt|width](images/…)`.
- `images/` — les 7 schémas éditoriaux au format SVG.

## Les 7 schémas

1. La thèse de la compression — et sa faille
2. Anatomie d'une sonde linéaire (Othello-GPT)
3. Le faisceau converge (Othello · échecs · Karel · espace-temps)
4. La carte fantôme (les taxis de Vafa)
5. Kepler, pas Newton (biais inductif)
6. Le piège du benchmark (potemkine)
7. Le spectre du modèle du monde en quatre paliers

Sources tier-1 : Li (Othello-GPT, ICLR 2023), Nanda (2023), Karvonen (2024), Jin & Rinard (ICML 2024), Gurnee & Tegmark (ICLR 2024), Vafa et al. (NeurIPS 2024 & ICML 2025), Mancoridis et al. (ICML 2025), Kambhampati (2024).

_Format co-écrit avec l'aide d'une IA._
