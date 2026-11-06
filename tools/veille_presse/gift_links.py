"""Discover gift links shared on Reddit for paywalled press articles.

Uses Reddit's unauthenticated JSON search API. Rate-limited but adequate
for a weekly cycle (~30 sources × 1 search = 30 requests, well under
60 req/min limit).

Cache lives at state/gift-links-cache.json — keyed by canonical article URL,
holds the most recently discovered gift URL. TTL is the gift link's natural
validity (14 days for NYT/WaPo).
"""
import json
import re
import time
from pathlib import Path
from typing import Optional
from urllib.parse import urlparse, urlunparse, quote
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError


USER_AGENT = "mathieugug-veille-presse/1.0 (https://mathieugug.github.io)"

# Per-source query + URL-pattern config.
# Gift links are scattered across many subreddits (r/steelers, r/Documentaries,
# r/hockey, etc.), not centralized in dedicated subs. We use Reddit's GLOBAL
# search (no subreddit restriction) to surface them.
REDDIT_SOURCES = {
    "nyt": {
        "query": "nytimes.com unlocked_article_code",
        "gift_url_pattern": re.compile(
            # Stop at whitespace, quote, angle bracket, paren/bracket close, backslash
            r"https?://(?:www\.)?nytimes\.com/[^\s\"'<>)\]\\]+?unlocked_article_code=[^\s\"'<>)\]\\]+",
            re.IGNORECASE,
        ),
        "domain": "nytimes.com",
    },
    "wapo": {
        "query": "washingtonpost.com gift=",
        "gift_url_pattern": re.compile(
            r"https?://(?:www\.)?washingtonpost\.com/[^\s\"'<>)\]\\]+?[?&]gift=[^\s\"'<>)\]\\]+",
            re.IGNORECASE,
        ),
        "domain": "washingtonpost.com",
    },
}


# Curated dataviz RSS feeds — same regex extraction as Reddit, but higher signal
# (the feed authors hand-pick the articles they reference).
EXTERNAL_RSS_FEEDS = [
    "https://flowingdata.com/feed/",
]


def _decode_entities(s: str) -> str:
    """Replace common HTML/XML entities that appear in RSS-encoded gift URLs."""
    return (s.replace("&#038;", "&")
             .replace("&amp;", "&")
             .replace("&#x26;", "&")
             .replace("&quot;", "")
             .replace("&#39;", "'"))


def _canonicalize(url: str) -> str:
    """Strip query string + fragment + trailing slash for matching gift link to article."""
    p = urlparse(url)
    return urlunparse((p.scheme, p.netloc, p.path.rstrip("/"), "", "", ""))


def _fetch_json(url: str, timeout: int = 15) -> Optional[dict]:
    """GET URL with our user agent, parse JSON. Returns None on any error."""
    try:
        req = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
        with urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except (URLError, HTTPError, json.JSONDecodeError, TimeoutError):
        return None


def _search_reddit_global(query: str, limit: int = 100) -> list[dict]:
    """Global Reddit search via JSON API. Returns list of post 'data' dicts."""
    url = (f"https://www.reddit.com/search.json"
           f"?q={quote(query)}&sort=new&t=week&limit={limit}&raw_json=1")
    data = _fetch_json(url)
    if not data:
        return []
    return [child["data"] for child in data.get("data", {}).get("children", [])]


def discover_gift_links_for_source(slug: str) -> dict[str, str]:
    """Search Reddit for gift links for the given source slug. Returns {canonical_url: gift_url}."""
    cfg = REDDIT_SOURCES.get(slug)
    if not cfg:
        return {}
    found: dict[str, str] = {}
    posts = _search_reddit_global(cfg["query"])
    for post in posts:
        # Scan both the URL field (link posts) and the selftext (text posts)
        blobs = []
        if post.get("url"):
            blobs.append(post["url"])
        if post.get("selftext"):
            blobs.append(post["selftext"])
        for blob in blobs:
            for match in cfg["gift_url_pattern"].findall(blob):
                canonical = _canonicalize(match)
                # Prefer first-seen (Reddit returns sorted by new, so most recent wins)
                if canonical not in found:
                    found[canonical] = match
    time.sleep(1)  # polite rate limit between source queries
    return found


def discover_from_rss_feeds(slugs: Optional[list[str]] = None) -> dict[str, str]:
    """Scrape curated dataviz RSS feeds (FlowingData, etc.) for gift URLs.

    Higher signal than Reddit (feed authors hand-pick the articles), lower
    volume. Filters by `slugs` if provided (e.g. only ['nyt']).
    Returns {canonical_url: gift_url} same shape as Reddit discovery.
    """
    found: dict[str, str] = {}
    slugs_set = set(slugs) if slugs else set(REDDIT_SOURCES.keys())
    for feed_url in EXTERNAL_RSS_FEEDS:
        body = _fetch_text(feed_url)
        if not body:
            continue
        body = _decode_entities(body)
        for slug, cfg in REDDIT_SOURCES.items():
            if slug not in slugs_set:
                continue
            for match in cfg["gift_url_pattern"].findall(body):
                canonical = _canonicalize(match)
                if canonical not in found:
                    found[canonical] = match
    return found


def _fetch_text(url: str, timeout: int = 15) -> Optional[str]:
    """GET URL, return body as text, None on error."""
    try:
        req = Request(url, headers={"User-Agent": USER_AGENT})
        with urlopen(req, timeout=timeout) as resp:
            return resp.read().decode("utf-8", errors="replace")
    except (URLError, HTTPError, TimeoutError):
        return None


def discover_gift_links(slugs: list[str]) -> dict[str, str]:
    """Aggregate gift links across all requested slugs.

    Combines Reddit global search + curated RSS feeds (FlowingData, etc.).
    Reddit-discovered URLs win duplicates (more recent).
    """
    all_links: dict[str, str] = {}
    # 1. Curated RSS first (high signal, hand-picked)
    all_links.update(discover_from_rss_feeds(slugs))
    # 2. Reddit overlays (overwrites duplicates with most-recent Reddit version)
    for slug in slugs:
        all_links.update(discover_gift_links_for_source(slug))
    return all_links


def load_cache(cache_path: Path) -> dict:
    """Load gift-links cache. Returns {} if missing."""
    if not cache_path.exists():
        return {}
    try:
        return json.loads(cache_path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}


def save_cache(cache_path: Path, links: dict[str, str], ttl_seconds: int = 14 * 24 * 3600) -> None:
    """Save gift-links cache with embedded timestamp + TTL marker per entry."""
    cache_path.parent.mkdir(parents=True, exist_ok=True)
    now = int(time.time())
    payload = {
        url: {"gift_url": gift, "fetched_at": now, "expires_at": now + ttl_seconds}
        for url, gift in links.items()
    }
    # Merge with existing cache, drop expired entries
    existing = load_cache(cache_path)
    for url, entry in existing.items():
        if entry.get("expires_at", 0) > now and url not in payload:
            payload[url] = entry
    cache_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")


def lookup_gift_url(article_url: str, cache: dict) -> Optional[str]:
    """Find a non-expired gift URL matching `article_url` in the cache."""
    canonical = _canonicalize(article_url)
    entry = cache.get(canonical)
    if not entry:
        return None
    if entry.get("expires_at", 0) < int(time.time()):
        return None
    return entry.get("gift_url")
