# {{TITLE}}

> **{{SUBTITLE}}**
>
> {{DATE}} — {{AUTHOR}}

## Contenu de ce dossier

| Fichier | Description |
|---|---|
| `{{MD_FILENAME}}` | Le rapport complet, en Markdown (compatible Obsidian). Référence les schémas SVG via `images/`. |
| `{{HTML_FILENAME}}` | L'application compagnon interactive. **Ouvrez-la d'un double-clic** dans votre navigateur. |
| `images/` | Les {{N_SCHEMAS}} schémas SVG en style éditorial. Référencés depuis le Markdown. |
| `README.md` | Ce fichier. |

## Pour utiliser le rapport en Markdown

Le fichier `{{MD_FILENAME}}` est compatible Obsidian. Les images sont référencées avec la syntaxe `![alt|width](images/...svg)`. Si vous l'ouvrez dans un autre éditeur Markdown, l'attribut `|width` peut s'afficher comme du texte — sans gravité.

## Pour utiliser l'application compagnon

1. Double-cliquez sur `{{HTML_FILENAME}}` — elle s'ouvre dans votre navigateur par défaut, sans serveur ni installation.
2. Le rapport s'affiche au centre, le sommaire à gauche, les sources à droite.
3. **Schémas interactifs** : cliquez sur les éléments d'un schéma (planner, executor, etc.) pour ouvrir un panneau de détail.
4. **Schémas en plein écran** : survolez un schéma pour faire apparaître le bouton ⛶ en haut à droite. Cliquez-le pour passer en mode plein écran avec zoom (molette ou pincement), déplacement (glisser), et raccourcis clavier `+` / `-` / `0` (recadrer) / `Échap` (fermer).
5. **Termes techniques** : les termes soulignés en pointillés ont une définition au survol (ou au tap sur mobile).
6. **Sources** : cliquez sur les numéros `[1]`, `[2]`… dans le texte pour mettre en évidence la source correspondante dans le panneau de droite.
7. **Replier le panneau Sources** (desktop) : un petit bouton sur le bord gauche du panneau (`›`) le replie ; un bouton miroir sur le bord droit de l'écran le redéploie. La préférence est mémorisée par rapport.
8. Sur mobile, les panneaux Sommaire et Sources se replient — utilisez les boutons en haut.

## Structure méthodologique

- **{{N_SECTIONS}} sections** organisées en {{N_PARTS}} parties principales
- **{{N_SCHEMAS}} schémas** SVG, chacun avec {{N_INTERACTIVE_AVG}} régions interactives en moyenne
- **{{N_SOURCES}} sources** premium ({{N_TIER_A}} institutionnelles/académiques, {{N_TIER_B}} analystes industriels, {{N_TIER_C}} presse de référence)
- **{{N_TOOLTIPS}} termes techniques** définis dans le glossaire interactif

## Notes

- Les schémas SVG dans `images/` sont les fichiers source. Ils sont également intégrés *inline* dans l'application HTML pour permettre l'interactivité, ce qui crée une duplication assumée (~{{HTML_SIZE}} pour le HTML).
- L'application HTML fonctionne hors-ligne, à l'exception de la police Google Fonts (Spectral / Inter / JetBrains Mono) chargée depuis le CDN Google. Sans connexion, des polices système prennent le relais — la lisibilité reste correcte.
- Aucune télémétrie, aucun tracker, aucun script tiers en dehors de la police.

---

*Généré avec le skill `illustrated-deep-research`.*
