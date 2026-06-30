# CC-10 — Sources actu pour §10 Dérive des coûts

> Fact-checking préalable à la rédaction du MD CC-10 §10. Stockage de sources publiques + propositions de paraphrase quand la source n'est pas fiable.

---

## 1. Anthropic weekly rate limits (Claude Sonnet / Opus)

- **Source(s) confirmée(s) :**
  - Tweet @AnthropicAI (28 juillet 2025) : https://x.com/AnthropicAI/status/1949898502688903593
  - TechCrunch (28 juillet 2025) : https://techcrunch.com/2025/07/28/anthropic-unveils-new-rate-limits-to-curb-claude-code-power-users/
  - Anthropic blog (6 mai 2026, doublement des limites + SpaceX) : https://www.anthropic.com/news/higher-limits-spacex

- **Chiffres confirmés :**
  - **Annoncé** : 28 juillet 2025 via X (@AnthropicAI) — entrée en vigueur le **28 août 2025**
  - **Périmètre** : Pro ($20/mois) et Max ($100/mois et $200/mois) ; Team et Enterprise non concernés par ces weekly caps (ils ont des limites horaires séparées, doublées en mai 2026)
  - **Quotas hebdomadaires (reset tous les 7 jours) :**
    - Pro : 40–80 h de Sonnet 4 via Claude Code
    - Max $100 : 140–280 h Sonnet 4 + 15–35 h Opus 4
    - Max $200 : 240–480 h Sonnet 4 + 24–40 h Opus 4
  - **Impact déclaré par Anthropic** : « less than 5% of subscribers »
  - **Raison officielle** : certains power users font tourner Claude Code « 24/7 in the background », représentant un coût disproportionné
  - **Échappatoire** : les abonnés Max peuvent acheter du crédit supplémentaire aux tarifs API standard

- **Citation utilisable dans MD :**
  > « Nous allons déployer de nouveaux weekly rate limits pour Claude Pro et Max fin août. Nous estimons qu'ils s'appliqueront à moins de 5 % des abonnés d'après l'usage actuel. » — @AnthropicAI, 28 juillet 2025

- **Nota bene :** Anthropic communique l'unité en *heures de Sonnet 4* plutôt qu'en tokens ou en dollars — formulation délibérément opaque pour les utilisateurs souhaitant comparer les plans.

---

## 2. Retex Uber — dépassement de budget outils IA coding

- **Source confirmée :**
  - Fortune, 26 mai 2026 : « Uber burned through its entire 2026 AI budget in four months. Now its COO is questioning whether it's worth it » — https://fortune.com/2026/05/26/uber-coo-ai-spending-tokens-claude-code/
  - Yahoo Finance (même article syndiqué) : https://finance.yahoo.com/sectors/technology/articles/uber-burned-entire-2026-ai-180347400.html

- **Faits confirmés :**
  - Uber a épuisé l'intégralité de son budget 2026 pour les **outils de coding IA** en **4 mois** (décembre 2025–mars 2026)
  - L'outil principal est **Claude Code** (et non GitHub Copilot Enterprise spécifiquement)
  - Adoption : 32 % → 84 % des 5 000 ingénieurs d'Uber entre décembre 2025 et mars 2026
  - Coût mensuel par ingénieur : **500 $ à 2 000 $**
  - Déclencheur : leaderboard interne classant les équipes par consommation totale d'outils IA
  - COO Andrew Macdonald (conférence du 25 mai 2026) : « That link is not there yet » — incapable de tracer un lien direct entre la dépense et les livrables consommateurs

- **Point d'attention :** L'article Fortune parle de **Claude Code**, pas de GitHub Copilot Enterprise. Le terme « Copilot » n'apparaît pas dans ce retex. **Ne pas attribuer ce dépassement à Copilot Enterprise dans le MD.**

- **Paraphrase suggérée pour le MD** (pattern général Copilot Enterprise validé par d'autres sources) :
  > « Plusieurs grandes organisations ayant déployé des outils de coding IA à grande échelle (Copilot Enterprise, Claude Code) ont documenté des dépassements budgétaires significatifs en 2025-2026 — le cas le plus médiatisé étant Uber, qui a épuisé son budget IA annuel en quatre mois après avoir incité ses ingénieurs via un leaderboard interne de consommation de tokens (source Fortune, 26 mai 2026). »

- **Si on veut rester sur Copilot Enterprise spécifiquement :** aucun retex Uber/Copilot Enterprise confirmé publiquement. Paraphrase :
  > « Pattern documenté chez plusieurs grands consommateurs Copilot Enterprise 2025-2026 : les dépassements de quota premium requests ont surpris les DSI, notamment après la suppression des budgets à $0 par GitHub en décembre 2025. »

---

## 3. GitHub Copilot — premium requests pricing (2025-2026)

- **Sources confirmées :**
  - GitHub Changelog, 22 août 2025 (GA overage policy) : https://github.blog/changelog/2025-08-22-premium-request-overage-policy-is-generally-available-for-copilot-business-and-enterprise/
  - GitHub Changelog, 17 septembre 2025 (suppression des budgets $0) : https://github.blog/changelog/2025-09-17-upcoming-removal-of-copilot-premium-request-0-budgets-for-enterprise-and-team-accounts/
  - GitHub Blog, 27 avril 2026 (passage aux AI Credits) : https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/
  - GitHub Docs (legacy billing) : https://docs.github.com/en/copilot/concepts/billing/copilot-requests

- **Chiffres confirmés (modèle legacy premium requests, en vigueur juin 2025 – mai 2026) :**
  - **Copilot Business** ($19/user/mois) : **300 premium requests** incluses par utilisateur/mois
  - **Copilot Enterprise** ($39/user/mois) : **1 000 premium requests** incluses par utilisateur/mois
  - **Overage** : **0,04 $/request** au-delà du quota (les deux tiers)
  - **Multiplicateurs de modèles** : Claude Sonnet = 5× (1 requête Sonnet = 5 premium requests consommées) ; GPT-4.5 = 20× — donc un usage intensif d'agents sur modèles premium épuise le quota très vite
  - **Début de facturation des premium requests** : 18 juin 2025 (GitHub.com) ; 1er août 2025 (GHE.com)
  - **Suppression des budgets $0** : 2 décembre 2025 (comptes créés avant le 22 août 2025)

- **Transition vers AI Credits (à partir du 1er juin 2026) :**
  - Plus de comptage en "premium requests" — passage à des crédits token-based ($0,01/crédit)
  - Business : 1 900 crédits inclus/utilisateur/mois (~$19) ; Enterprise : 3 900 crédits (~$39)
  - Annonce officielle : 27 avril 2026

- **Citation utilisable dans MD :**
  > « Les abonnés Copilot Business disposaient de 300 premium requests par mois et par utilisateur — un quota épuisé en quelques jours pour les équipes travaillant avec des agents sur Claude Sonnet (facteur ×5). Au-delà, chaque requête est facturée 0,04 $. »

---

## 4. Cursor — Auto / Background agents limits (bonus)

- **Sources confirmées :**
  - Cursor Changelog v0.50 (15 mai 2025) — lancement Background Agents en preview : https://cursor.com/changelog/0-50
  - CloudZero blog (source secondaire fiable) : https://www.cloudzero.com/blog/cursor-ai-pricing/

- **Chiffres et chronologie confirmés :**
  - **Background Agents** : lancés en **preview graduelle** le **15 mai 2025** (v0.50). À ce stade : pas de quota numérique annoncé, feature en beta.
  - **Juin 2025 — changement majeur de pricing :** Cursor abandonne les request caps fixes pour un modèle **usage-based (crédit = prix API)**
    - Pro ($20/mois) : anciennement ~500 fast requests → désormais $20 de crédits API
    - En pratique : ~225 premium requests avant overage (vs ~500 avant)
    - Backlash communautaire intense ; **excuse publique de Cursor le 4 juillet 2025** + remboursements pour l'usage inattendu entre le 16 juin et le 4 juillet 2025
  - **Auto mode** : resté **illimité** sur tous les plans payants (ne consomme pas de crédits — Cursor choisit le modèle)
  - **Background Agents (état actuel 2026)** : jusqu'à 8 agents en parallèle ; consomment du pool de crédits API comme les autres requêtes premium
  - **Plans 2026** : Hobby $0 / Pro $20 ($20 crédits) / Pro+ $60 ($70 crédits) / Ultra $200 ($400 crédits)

- **Point d'attention :** Il n'y a pas de limite numérique spécifique aux Background Agents distincte du pool de crédits général. La « limite » est le pool API ($20, $70, $400 selon le plan).

- **Citation utilisable dans MD :**
  > « Cursor a abandonné les request caps fixes en juin 2025 pour facturer directement au coût API — le Pro plan offrant $20 de crédits, soit ~225 requêtes premium avant overage. Background Agents disponibles depuis mai 2025, limités par le pool de crédits du plan. »

---

## 5. Origine du terme « tokenmaxxing »

- **Sources confirmées :**
  - The Pragmatic Engineer (Gergely Orosz) : https://blog.pragmaticengineer.com/the-pulse-tokenmaxxing-as-a-weird-new-trend/
  - Wikipedia (article contesté, notabilité en débat) : https://en.wikipedia.org/wiki/Token_maxxing — sources les plus anciennes citées : Forbes, 31 mars 2026 (Richard Nieva)
  - New York Times (Kevin Roose) — article déclencheur début avril 2026 : *« More! More! More! Tech Workers Max Out Their A.I. Use »*
  - Tomasz Tunguz (1er avril 2026) : https://tomtunguz.com/tokenmaxxing/ — définit tokenmaxxing comme « deliberate practice of maximizing token consumption »
  - Fortune (28 mai 2026) : « Tokenmaxxing is over » — https://fortune.com/2026/05/28/tokenmaxxing-is-dead-companies-didnt-get-the-roi-from-ai-they-wanted-to-see/

- **Chronologie confirmée :**
  - **Fin 2025** : Shopify construit le premier leaderboard interne de consommation de tokens documenté publiquement
  - **Mars 2026** : Meta crée un « Claudeonomics leaderboard » interne classant les employés par tokens consommés, avec des titres comme « Token Legend »
  - **31 mars 2026** : Forbes (Richard Nieva) — première occurrence trouvée dans des sources indexées
  - **Début avril 2026** : NYT (Kevin Roose) popularise le terme auprès d'un public large
  - **1er avril 2026** : Tomasz Tunguz (VC First Round) publie sur le sujet, ce qui diffuse le terme dans la sphère tech/VC
  - **Avril–mai 2026** : couverture massive (Pragmatic Engineer, WBUR, NSS Magazine, Medium, Fortune)
  - **Mai 2026** : Wikipedia crée un article, immédiatement taggé « notabilité contestée » (candidat à fusion avec *Workplace impact of AI*)

- **Statut du terme :**
  - **Jargon vernaculaire tech** émergé en communauté (Slack, Twitter/X interne Meta/Shopify), popularisé via presse spécialisée (Forbes, NYT) début avril 2026
  - Pas un terme académique ni standard industriel
  - Construction par analogie avec le slang Gen Z (-maxxing : looksmaxxing, sleepmaxxing = optimisation extrême d'un paramètre)
  - Déjà en recul sémantique : Fortune titre « Tokenmaxxing is over » fin mai 2026

- **Recommandation pour le MD :**
  Introduire le terme avec une accroche de contextualisation :
  > « Ce que les ingénieurs Silicon Valley ont appelé le "tokenmaxxing" — pousser la consommation de tokens comme métrique de productivité — a eu un coût que peu d'organisations avaient anticipé. »
  
  Ou, version plus prudente sans le terme :
  > « Plusieurs grandes entreprises tech ont encouragé leurs ingénieurs à maximiser leur usage des outils IA via des classements internes — un pari coûteux qui s'est retourné contre elles. »

---

*Notes de fact-checking · 2026-06-04 · co-écrit avec l'aide d'une IA.*
