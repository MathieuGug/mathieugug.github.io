# Compresser le KV-cache

> 17 juillet 2026 — Mathieu Guglielmino

Deep dive prolongeant le dossier **L'économie du KV-cache**. Là où `kv-cache` traitait de la *gestion* d'un cache de taille fixée (pagination, partage de préfixes, désagrégation), celui-ci traite de l'autre moitié du problème : **rendre le cache plus petit à la source**. Thèse : compresser le cache est un choix d'architecture d'attention à trois étages — partager les têtes (MQA/GQA), les projeter dans un latent (MLA), ou compresser les octets après coup (quantification, éviction). L'arbitrage porteur de 2026 : **MLA contre GQA**.

## Fichiers

- `index.html` — hub d'entrée du dossier (présentation + accès aux formats).
- `20260717-compression-kv-cache-app.html` — **application illustrée** (long-form interactif) : 8 sections, 7 schémas SVG cliquables (28 régions), glossaire au survol, sommaire et sources actifs. S'ouvre directement dans un navigateur, sans serveur.
- `20260717-compression-kv-cache-rapport.md` — rapport markdown complet (compatible Obsidian), citations en notes de bas de page, schémas référencés en syntaxe `![alt|width](images/…)`.
- `images/` — les 7 schémas éditoriaux au format SVG.

## Les 7 schémas

1. Les trois étages de la compression (architectural · numérique · token)
2. Le continuum des têtes clé/valeur (MHA → GQA → MQA)
3. Anatomie de MLA (latent conjoint · RoPE découplé · absorption)
4. Matrice comparative MHA / MQA / GQA / MLA × 5 dimensions
5. Géométrie des outliers K/V (per-channel vs per-token)
6. Taxonomie de l'éviction (sinks · heavy hitters · récent · saillance)
7. La frontière de Pareto qualité × mémoire

Sources tier-1 : Shazeer (MQA, 2019), Ainslie et al. (GQA, EMNLP 2023), DeepSeek-V2 & V3 (MLA, 2024), TransMLA (2025), KIVI (ICML 2024), KVQuant (NeurIPS 2024), StreamingLLM (ICLR 2024), H2O (NeurIPS 2023), SnapKV (NeurIPS 2024), FastGen (ICLR 2024), Yuan et al. (benchmark, 2024), Native Sparse Attention (2025).

_Format co-écrit avec l'aide d'une IA._
