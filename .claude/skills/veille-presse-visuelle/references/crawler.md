# Crawler — diff strategy + selectors

## Diff strategy

For each source, `state/last-crawl.json` stores `{slug: {seen_urls: [...]}}`.
A URL is "new" if it's not in `seen_urls`. After a successful crawl, new URLs
are appended (FIFO cap at 500 per source).

## Selectors per source

Each source in `sources.yml` declares `selectors.item` — the CSS selector to
extract URLs from the landing page. The selector should target `<a>` elements
whose `href` is the article URL. Hrefs are resolved relative to the landing
page URL.

**Common patterns** :
- NYT : `article a[href*='/interactive/'], section ol li a[href*='/spotlight/']`
- Bloomberg : `a[href*='/graphics/'], a[href*='/features/']`
- Le Monde : `a[href*='/les-decodeurs/article/']`

**When a source breaks** : if `run-log.jsonl` shows `n_crawled: 0` for a source
2 cycles in a row, the selector likely needs an update. Reopen the landing
page in DevTools, find the new pattern, edit `sources.yml`, commit.

## Scoring

```
score = source.weight × (1 + 0.3 × is_interactive)
```

`is_interactive` is heuristic — true if any of `source.interactivity_signals`
(`d3`, `scrollama`, `observable`, `mapbox`, …) matches a `<script src=...>` URL
in the article HTML.

Shortlist cap : 15 (matches historical edition size).

## Parallelism

`crawl_all()` runs up to 5 sources in parallel via `asyncio.Semaphore`. Each
source's per-item article fetching is sequential to keep memory bounded.
