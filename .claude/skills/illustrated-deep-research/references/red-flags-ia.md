# Red flags « texte généré par IA » — corpus mathieugug.github.io

Liste de relecture pour la prose des rapports, chapitres du livre et journaux.
Même méthode et même format que la liste ZapNews (`agents/shared/red-flags-ia.md`,
2026-08-05), appliquée à CE corpus.

## D'où sort cette liste

Analyse fréquentielle du 2026-08-09 sur les **markdown publiés** (rapports de
dossiers + chapitres du livre + journaux) : **69 documents**, **356 280 mots**,
longueur médiane **4 489 mots**. `DF` = nombre de documents distincts où la
tournure apparaît (sur 69). Mesure : `tools/analyse_formules_ia.py --only md`
(re-runnable ; il régénère aussi ce diagnostic après une passe de nettoyage).

Le critère d'entrée est celui de ZapNews : une tournure présente dans 20-90 %
de documents écrits à des mois d'écart, sur des sujets sans rapport, n'est pas
un choix d'auteur — c'est un réflexe de modèle.

## Le test, avant tout le reste

> **Est-ce que cette phrase apporte un fait, ou est-ce qu'elle apporte du
> rythme ?**

Un fait (chiffre, nom, date, contradiction documentée, réserve méthodo) → elle
reste, même si sa forme est listée ici. Du rythme seul (chute, symétrie,
balancier) → **elle saute, elle ne se reformule pas**.

---

## 1. Les deux tics signatures de CE corpus

Ils n'étaient pas dans la batterie ZapNews : c'est la passe de découverte
(n-grammes délexicalisés) qui les a fait remonter. Ce sont les marqueurs les
plus massifs jamais mesurés sur les deux corpus.

### 1.1 Le pivot après tiret — `… — c'est … / … — pas …`

| Mesure             | Corpus md                        |
| ------------------ | -------------------------------- |
| Documents          | **63/69 (91 %)**, 458 occurrences |

« Le choix est moins critique qu'on le pense — c'est ce qui entoure le modèle
qui fait la différence. » · « L'unité de raisonnement n'est plus le tour ni la
chaîne — c'est la session de travail. »

La phrase s'ouvre sur une affirmation, se suspend sur un tiret, et livre la
« vraie » version après. C'est l'antithèse du § 3 compressée en une phrase, et
elle revient **toutes les ~780 mots**.

**Quota : 2 par document.** Conversion : couper en deux phrases (l'affirmation,
puis le fait), ou garder seulement la moitié qui porte le fait.

### 1.2 La négation appositive — `…, pas …`

| Mesure             | Corpus md                        |
| ------------------ | -------------------------------- |
| Documents          | **61/69 (88 %)**, 415 occurrences |

« Tout vit dans des fichiers, pas dans le prompt. » · « Les résultats vivent en
fichiers, pas en tokens. »

Efficace une fois ; en réflexe, elle transforme chaque paragraphe en slogan.
**Quota : 2 par document.** Si le contraste est réel, le développer (« X, alors
que Y ») ; sinon supprimer la négation — l'affirmative suffit.

---

## 2. Tics structurels de ponctuation

| Mesure | Médiane | p75 | p90 | Docs | Occ. | ZapNews (médiane) |
|---|---|---|---|---|---|---|
| Tiret cadratin `—` | **16,3 / 1000 mots** | 18,4 | 20,1 | 69/69 (100 %) | 5 755 | 7,8 |
| Deux-points `:` | **18,3 / 1000 mots** | 22,9 | 28,3 | — | 6 668 | 7,7 |
| Énumération ternaire | — | — | — | 67/69 (97 %) | 950 | 32 % des docs |
| Incise-ajout `— …` en fin de phrase | — | — | — | 69/69 (100 %) | 3 183 | 37 % des docs |

Le corpus est au **double** de ZapNews — qui jugeait déjà ses propres taux
excessifs (presse : 0 à 2 tirets par article).

- **Tirets : viser ≤ 5/1000 mots.** Incise explicative → virgules ou
  parenthèses ; précision chiffrée → phrase à part ; ajout final (`… — et c'est
  ce qui compte.`) → supprimer.
- **Deux-points : viser ≤ 10/1000 mots.** Dans un corpus technique, le
  deux-points de définition, de liste ou d'exemple est légitime ; celui qui
  ménage une révélation (`Le verdict : …`, mesuré 25 % des docs en tête de
  phrase) ne l'est pas.
- **Ternaire (950 occ.)** : deux termes suffisent, sauf si les trois sont dans
  la source. Le troisième est presque toujours là pour la cadence.

---

## 3. L'antithèse par négation — la figure dominante du corpus

| Patron | DF | % docs | ZapNews | Verdict |
|---|---|---|---|---|
| `X n'est pas Y, c'est Z` | 45 | **65 %** (122 occ.) | 10 % | **Bannir.** Garder la moitié sourcée. |
| `ni… ni…` | 34 | 49 % | 17 % | **1 max**, négation réellement double. |
| `ce n'est pas… c'est…` | 15 | 22 % | 15 % | **Bannir** comme figure de style. |
| `à la fois… et…` | 16 | 23 % | 12 % | **1 max.** |
| `non pas X, mais Y` | 7 | 10 % | 6 % | **Bannir.** |
| `n'est pas anodin / pas un hasard` | 6 | 9 % | 9 % | **Bannir.** |
| `pas seulement…, aussi…` | 5 | 7 % | 8 % | **Bannir.** |

Six fois et demie le taux ZapNews pour le patron principal. Squelettes associés
dans la passe de découverte : `X n'est pas` (66/69 docs), `pas un X` (62/69),
`X , c'est` (61/69). La règle ZapNews s'applique telle quelle : une antithèse
ne se réécrit pas, elle se **tranche** — on garde le fait, on jette le
balancier.

---

## 4. Charnières de raisonnement

| Formule | DF | % docs | ZapNews | Verdict |
|---|---|---|---|---|
| `c'est précisément` | 32 | **46 %** (50 occ.) | 20 % | **Bannir.** Zéro exception. |
| `se joue / s'y joue` (métaph.) | 21 | 30 % | 17 % | **Bannir** hors citation. |
| `angle mort / zone d'ombre` | 21 | 30 % | 6 % | **1 max par document.** |
| `c'est là que` | 13 | 19 % | 9 % | **Bannir.** |
| `la (vraie) question est` | 12 | 17 % | — | **Bannir** : poser la question, pas l'annoncer. |
| `est moins X que` (renversement) | 11 | 16 % | — | **1 max.** |
| `ce qui frappe/change, c'est` | 7 | 10 % | 3 % | **Bannir.** |
| `Résultat / Verdict / Constat :` (tête) | 17 | 25 % | — | **1 max** : donner le résultat, pas son annonce. |
| `concrètement` (tête) | 7 | 10 % | 12 % | **1 max**, devant un exemple chiffré réel. |

Quasi absents ici (et que ça dure) : `autrement dit` (4 %, ZapNews 23 %),
`Or,` (3 %), `par ailleurs` (6 %), `néanmoins/toutefois` (1 %), `en clair` (0).

---

## 5. Chevilles

| Cheville | DF | % docs | ZapNews | Verdict |
|---|---|---|---|---|
| `à mesure que` | 23 | 33 % | 10 % | **1 max.** |
| `plutôt que de` | 22 | 32 % | 12 % | **1 max.** |
| `c'est-à-dire` | 15 | 22 % | 7 % | **1 max.** |
| apposition `, elle, / , lui, / , eux,` | 12 | 17 % | 33 % | **1 max.** |
| `mais surtout / et surtout` | 7 | 10 % | 11 % | **1 max.** |
| `pour l'heure / à ce jour` | 7 | 10 % | 8 % | **1 max**, préférer une date. |
| `à ce stade` | 6 | 9 % (14 occ.) | 8 % | **1 max**, préférer une date. |

---

## 6. Lexique à charge

| Lexique | DF | % docs | ZapNews | Verdict |
|---|---|---|---|---|
| `crucial / majeur / décisif` | 38 | **55 %** | 17 % | **1 max**, porté par une source. |
| `historique` (adj.) | 37 | 54 % | 16 % | **Trier** (§ 7) : l'emploi technique est légitime, l'emphase (« un tournant historique ») se bannit. |
| `silencieux / silencieusement` | 34 | 49 % | 4 % | **Trier** (§ 7) : « échoue silencieusement » = terme technique toléré, 1 max ; métaphorique (« dérive silencieuse ») = bannir. |
| `explosion / explose / exponentiel` | 28 | 41 % | 7 % | **Bannir** si un chiffre peut le remplacer ; `exponentiel` réservé au sens mathématique réel. |
| `notable / significatif / substantiel` | 26 | 38 % | 11 % | **Bannir** (le chiffre dit l'ampleur) — sauf `significatif` au sens statistique. |
| `ordre de grandeur` | 19 | 28 % (32 occ.) | 11 % | **1 max** : donner le rapport (« trois fois moins »). |
| `inédit / sans précédent` | 17 | 25 % | 15 % | **Bannir** sauf série à l'appui. |
| `spectaculaire / vertigineux / saisissant` | 13 | 19 % | 18 % | **Bannir** sauf citation. |
| `à l'heure où / à l'ère de` | 13 | 19 % | 10 % | **Bannir** ces ouvertures d'époque. |
| `profond / profondément` | 14 | 20 % | 17 % | **1 max.** |
| `tient en un mot / un chiffre` | 9 | 13 % | 7 % | **Bannir** : donner le chiffre. |
| `au cœur de` · `est/reste le cœur` | 7+6 | 10+9 % | 11 % | **1 max** au total. |
| `sans appel` | 6 | 9 % | 2 % | **Bannir** l'appréciation. |
| `pierre angulaire / talon d'Achille` | 4 | 6 % | 2 % | **Bannir** (métaphores mortes). |

---

## 7. Ce qui n'est **pas** un red flag ici

Corpus technique : ne pas sur-corriger.

- **Le vocabulaire de domaine** : harness, contexte, compaction, sandbox,
  benchmark, inference… Fréquents parce que les sujets reviennent.
- **`historique` technique** : « données historiques », « comparabilité
  historique », « l'historique de conversation » — c'est le terme exact.
- **`échoue silencieusement`** (fails silently) : terme technique semi-établi,
  toléré 1 fois par document ; au-delà, décrire le symptôme (« retourne 0 sans
  erreur »).
- **Le deux-points de définition, de liste, d'exemple** — l'ossature normale
  d'un rapport technique. Seul le deux-points de révélation compte au quota.
- **La négation factuelle** (« Le décret n'est pas publié ») : ce n'est pas
  l'antithèse du § 3.
- **`exponentiel`** quand la croissance l'est vraiment (mesurée).

---

## 8. Les chutes — le point fort du corpus

- Dernière phrase de **document** sur une formule de chute : **0/69**.
- Dernières phrases de **section** sur une formule : **34/1 896** (1,8 %).
- Dernière phrase de document **sans fait** : 6/69.

ZapNews avait « reste à savoir si… » en dernière phrase de 27 articles ; ici la
formule est absente du corpus. **À maintenir** : terminer sur un fait, une
échéance ou une réserve. Les 34 sections fautives se trouvent via le grep du
§ 10.

---

## 9. Les documents à nettoyer en premier

Densité de tics (batterie /1000 mots ; médiane du corpus ≈ 5,3) :

| Document | Tics /1000 | `—` /1000 |
|---|---|---|
| `livre/cas-pratiques/cases/CC-03-plateforme-data.md` | 11,8 | 21,9 |
| `livre/cas-pratiques/cases/CC-00-assistant-transverse.md` | 10,5 | 22,6 |
| `livre/chapitres/ch01-coeur-stochastique.md` | 10,4 | 14,4 |
| `livre/chapitres/ch24-ia-frugale.md` | 8,8 | 13,6 |
| `livre/chapitres/ch04-decode-speculative.md` | 8,5 | 15,6 |
| `livre/cas-pratiques/cases/CC-11-flotte-agents.md` | 8,0 | 19,5 |
| `donnees-synthetiques/…-rapport.md` | 8,0 | 16,3 |
| `livre/chapitres/ch07-boucle-agentique.md` | 7,8 | 17,0 |

Le **livre** concentre le problème (8 des 10 pires documents) — c'est aussi le
texte le plus engageant pour un lecteur payant. Les plus sobres, pour
calibrage : `llm-jailbreaking` (0,1/1000), `ch21-gardefous` (2,6),
`compaction-agentique` (3,1).

---

## 10. La passe de relecture, en pratique

Avant de rendre un texte :

1. **Compter la ponctuation** : si `—` > 5/1000 mots ou `:` > 10/1000,
   redescendre. C'est la passe qui rend le plus.
2. **Chercher les deux tics signatures** : `— c'est` / `— pas` (quota 2) et
   `, pas ` (quota 2).
3. **Chercher les bannis absolus** : `c'est précisément`, `n'est pas … c'est`,
   `la vraie question`, `se joue`, `tient en un`.
4. **Relire les adjectifs** : `crucial`, `majeur`, `historique` (emphase),
   `inédit`, `notable`, `spectaculaire` — portés par une source ou supprimés.
5. **Dernière phrase de chaque section** : ni chiffre, ni nom, ni date, ni
   réserve → la supprimer.

Grep de contrôle sur un document :

```sh
grep -noiP "c'est précisément|n'est pas [^,;:.]{2,45}[,;:] c'est|— c'est|— pas |, pas (le|la|les|l'|un|une|des|du|de|d'|en|dans|sur)|la vraie question|se joue|tient en une?|angle mort|crucial|majeur|historique|inédit|sans précédent|notable|significati|spectaculaire|exponentiel|silencieu" chemin/du/fichier.md
```

Mesure d'ensemble (à re-runner après une passe de nettoyage, pour objectiver la
dérive ou le progrès) :

```sh
python3 tools/analyse_formules_ia.py --only md --out tools/formules-ia-rapport-$(date +%Y%m%d).md
```

---

## 11. Les cinq à retenir

1. **`— c'est / — pas`** : 2 par document, pas 7.
2. **`X, pas Y`** : 2 par document, pas 6.
3. **`X n'est pas Y, c'est Z`** : trancher — garder la moitié sourcée.
4. **Tirets ≤ 5/1000 mots**, deux-points de révélation ≤ 4 par document.
5. **`c'est précisément`** : jamais.
