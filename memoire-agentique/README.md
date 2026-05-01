# La mémoire agentique

> **De l'outil amnésique au partenaire persistant : architectures, opérations, fournisseurs, sécurité et feuille de route opérationnelle.**
>
> 30 avril 2026 — Mathieu Guglielmino

## Contenu de ce dossier

| Fichier | Description |
|---|---|
| `20260430-memoire-agentique-rapport.md` | Le rapport complet, en Markdown (compatible Obsidian). Référence les schémas SVG via `images/`. |
| `20260430-memoire-agentique-app.html` | L'application compagnon interactive. **Ouvrez-la d'un double-clic** dans votre navigateur. |
| `images/` | Les 8 schémas SVG en style éditorial. Référencés depuis le Markdown. |
| `README.md` | Ce fichier. |

## Pour utiliser le rapport en Markdown

Le fichier `20260430-memoire-agentique-rapport.md` est compatible Obsidian. Les images sont référencées avec la syntaxe `![alt|width](images/...svg)`. Si vous l'ouvrez dans un autre éditeur Markdown, l'attribut `|width` peut s'afficher comme du texte — sans gravité.

## Pour utiliser l'application compagnon

1. Double-cliquez sur `20260430-memoire-agentique-app.html` — elle s'ouvre dans votre navigateur par défaut, sans serveur ni installation.
2. Le rapport s'affiche au centre, le sommaire à gauche, les sources à droite.
3. **Schémas interactifs** : cliquez sur les éléments d'un schéma (planner, executor, etc.) pour ouvrir un panneau de détail.
4. **Termes techniques** : les termes soulignés en pointillés ont une définition au survol (ou au tap sur mobile).
5. **Sources** : cliquez sur les numéros `[1]`, `[2]`… dans le texte pour mettre en évidence la source correspondante dans le panneau de droite.
6. Sur mobile, les panneaux Sommaire et Sources se replient — utilisez les boutons en haut.

## Structure méthodologique

- **9 sections** organisées en 4 parties principales
- **8 schémas** SVG, chacun avec 5,5 régions interactives en moyenne
- **37 sources** premium (17 institutionnelles/académiques, 3 analystes industriels, 17 presse de référence)
- **20 termes techniques** définis dans le glossaire interactif

## Notes

- Les schémas SVG dans `images/` sont les fichiers source. Ils sont également intégrés *inline* dans l'application HTML pour permettre l'interactivité, ce qui crée une duplication assumée (~574K pour le HTML).
- L'application HTML fonctionne hors-ligne, à l'exception de la police Google Fonts (Spectral / Inter / JetBrains Mono) chargée depuis le CDN Google. Sans connexion, des polices système prennent le relais — la lisibilité reste correcte.
- Aucune télémétrie, aucun tracker, aucun script tiers en dehors de la police.

---

*Généré avec le skill `illustrated-deep-research`.*
