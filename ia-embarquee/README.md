# L'IA embarquée : le budget mémoire commande

> 6 juillet 2026 — Mathieu Guglielmino

Deep dive sur l'IA **on-device** : pourquoi la contrainte porteuse de l'IA embarquée n'est pas le modèle mais le **budget mémoire de l'appareil**, et pourquoi l'architecture réellement déployée en 2026 est un routage vérifiable device↔cloud.

## Contenu du dossier

- **`20260706-ia-embarquee-app.html`** — l'application illustrée (format d'entrée). 7 sections, 7 schémas SVG cliquables (29 régions), glossaire au survol, sommaire et sources actifs, zoom plein écran. Ouvrir directement dans un navigateur.
- **`20260706-ia-embarquee-rapport.md`** — le rapport complet en markdown (compatible Obsidian), schémas SVG référencés, citations en notes de bas de page.
- **`images/`** — les 7 schémas éditoriaux (`20260706-01-…` à `-07-…`).
- **`index.html`** — le hub d'entrée du dossier.

## Thèse

L'IA embarquée est un problème de budget mémoire, pas de modèle. La contrainte d'octets sur l'appareil (~2-4 Go allouables) dessine la taille des modèles (~3B), impose la quantification (2-4 bits), justifie les astuces d'architecture (MatFormer, Per-Layer Embedding, natif ternaire) et le silicium dédié (NPU) — et, quand le budget ne suffit pas, commande une architecture hybride où le vrai produit est le routage vérifiable device↔cloud (Private Cloud Compute).

_Format co-écrit avec l'aide d'une IA._
