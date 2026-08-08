# Crawler — diff strategy + selectors + paywall fallback

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
- NYT : `section ol li a[href*='/interactive/'], section ol li a[href*='/spotlight/']`
- Bloomberg : `a[href*='/graphics/'], a[href*='/features/']`
- Le Monde : `a[href*='/les-decodeurs/article/']`

**When a source breaks** : if `run-log.jsonl` shows `n_crawled: 0` for a source
2 cycles in a row, the selector likely needs an update. Reopen the landing
page in DevTools, find the new pattern, edit `sources.yml`, commit.

## Paywall fallback chain

For sources where `paywall: true`, the article fetch follows a 4-step ladder
implemented in `crawler._fetch_article_with_fallback` :

```
1. Gift link (Reddit-discovered)
   ↓ if no cached gift link or it didn't unlock
2. Direct fetch with storage_state (if storage_state file exists)
   ↓ if storage_state expired (heuristic _looks_paywalled triggers)
3. archive.ph/newest/{url}
   ↓ if no snapshot available
4. Wayback Machine closest snapshot
   ↓ if no snapshot
SKIP — article goes into edition's captures_impossibles section
```

For sources where `paywall: false` (Reuters, Pudding, BBC, etc.) the chain
short-circuits at step 2 — failure is loud (no archive fallback) because
it's almost always a selector issue worth fixing.

### Gift links — automation

`tools/veille_presse/gift_links.py` searches Reddit's unauthenticated JSON
API for shared `unlocked_article_code=` (NYT) and `?gift=` (WaPo) URLs :

- r/nytimes, r/nytimesgiftarticles (NYT)
- r/WaPoGiftLinks (WaPo)

Gift links are cached in `state/gift-links-cache.json` for 14 days (the
natural validity of NYT/WaPo gift links). The cache is keyed by canonical
article URL (path only, no query string).

`cmd_run` refreshes the cache automatically at cycle start. Skip with
`--skip-gift-links` if Reddit is down or rate-limited.

Manual refresh :
```bash
python -m tools.veille_presse.cli refresh-gift-links --verbose
```

**Sources NOT covered by gift links** :
- FT — no dedicated Reddit sub for FT gift links (rare)
- Le Monde, Le Figaro, Mediapart, Folha, El País, ZEIT, Bloomberg, WSJ, The Economist, Atlantic, Nikkei — these don't have shareable gift links from their subscriber tiers, so they fall through to the archive chain

If you want to extend gift-link coverage to a new source, add a config entry
to `REDDIT_SOURCES` in `gift_links.py` with the subreddit list and the gift
URL regex.

### archive.ph

`https://archive.ph/newest/{article_url}` returns the most recent snapshot.
Pixel-perfect copy of the original, full visual fidelity. Best for paywall
bypass when no gift link exists. Some sites systematically block archive.ph
(rare) — falls through to Wayback.

### Wayback Machine (archive.org)

Two-step :
1. `http://archive.org/wayback/available?url={article_url}` → JSON with the
   closest snapshot URL
2. Fetch that snapshot URL

Wayback tends to capture less of the dynamic/interactive content than
archive.ph but is more comprehensive in time coverage.

### Manual gift links from other sources

For paywalled sources without Reddit gift-link communities (FT, Le Monde,
Bloomberg, etc.), Mathieu can :

1. Subscribe to those sources himself and run `python tools/build-storage-state.py <slug>` to inject a Playwright session
2. Hunt for gift links on Mastodon, Lemmy (`lemmy.world/c/nytimes` is active), or via Google search using `"unlocked_article_code" site:nytimes.com {topic}` constraint
3. Use [archive.ph](https://archive.ph) directly to seed a snapshot before the cycle runs (submit URL to create a fresh snapshot, then the cycle picks it up via the fallback chain)

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
The gift-links cache is loaded once and shared across all parallel workers
(read-only access, no race).

## Paywall detection heuristic

`_looks_paywalled(html)` returns `True` when the HTML is `< 30_000 chars` AND
contains any of these sentinels :
- "subscribe to continue" / "subscribe now" / "subscribe to read"
- "create an account to continue"
- "abonnez-vous" / "réservé aux abonnés"
- "this article is for subscribers" / "subscriber-only content"
- "to continue reading" / "exclusivement réservé"

The size threshold avoids false positives on full-length articles that
happen to mention "subscribe" in a navigation menu.
