# ai/src/tools.py

# This is the correct import for the stable LangChain environment we built.
from langchain_core.tools import tool
import time
from typing import Dict, Tuple

import requests
from bs4 import BeautifulSoup
from duckduckgo_search import DDGS
import feedparser

# Retry configuration
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds

@tool
def search_tool(query: str) -> str:
    """Performs a web search to find relevant URLs."""
    try:
        cached = _get_cached(("search", query))
        if cached is not None:
            return cached
        with DDGS() as ddgs:
            results = [r for r in ddgs.text(query, max_results=10)]
            output = str(results) if results else "No results found."
            _set_cached(("search", query), output)
            return output
    except Exception as e:
        return f"Error searching: {e}"

@tool
def scrape_tool(url: str) -> str:
    """Scrapes the text content of a single webpage with retry logic."""
    cached = _get_cached(("scrape", url))
    if cached is not None:
        return cached

    # Retry logic for failed scrapes
    last_error = None
    for attempt in range(MAX_RETRIES):
        try:
            headers = {'User-Agent': 'Mozilla/5.0'}
            response = _session.get(url, headers=headers, timeout=10)
            response.raise_for_status()  # Raise error for bad status codes

            soup = BeautifulSoup(response.text, 'lxml')
            for tag in soup(['script', 'style', 'nav', 'footer', 'header']):
                tag.decompose()
            # Increased from 4000 to 12000 chars to capture full article content
            # 12000 chars ≈ 3000 tokens, prevents losing critical details at end of articles
            output = soup.get_text(strip=True)[:12000]
            _set_cached(("scrape", url), output)
            return output

        except Exception as e:
            last_error = e
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_DELAY)
                continue

    return f"Error scraping {url} after {MAX_RETRIES} attempts: {last_error}"

@tool
def rss_tool(rss_feed_url: str) -> str:
    """Fetches articles from an RSS feed with retry logic for reliability."""
    cached = _get_cached(("rss", rss_feed_url))
    if cached is not None:
        return cached

    # Retry logic for failed feeds
    last_error = None
    for attempt in range(MAX_RETRIES):
        try:
            feed = feedparser.parse(rss_feed_url)

            # Check if feed parsed successfully
            if hasattr(feed, 'bozo_exception'):
                raise feed.bozo_exception

            # Increased from 10 to 15 entries to capture more stories from high-volume feeds
            # Prevents missing important stories from feeds that publish 20+ articles/day
            entries = _filter_recent_entries(feed.entries, hours=48)[:15]
            if not entries:
                return f"No recent articles found in {rss_feed_url}"

            summaries = [
                # Truncate summary to 1000 chars to prevent runaway RSS feeds that include full article text
                # This prevents token overflow while preserving key information
                f"Title: {e.get('title', 'N/A')}\nLink: {e.get('link', 'N/A')}\nSummary: {BeautifulSoup(e.get('summary', ''), 'lxml').get_text(strip=True)[:1000]}"
                for e in entries
            ]
            output = "\n\n".join(summaries)
            _set_cached(("rss", rss_feed_url), output)
            return output

        except Exception as e:
            last_error = e
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_DELAY)
                continue

    return f"Error reading RSS feed {rss_feed_url} after {MAX_RETRIES} attempts: {last_error}"


_CACHE_TTL_SECONDS = 6 * 60 * 60
_cache: Dict[Tuple[str, str], Tuple[float, str]] = {}
_session = requests.Session()


def _get_cached(key: Tuple[str, str]) -> str | None:
    cached = _cache.get(key)
    if not cached:
        return None
    timestamp, value = cached
    if (time.time() - timestamp) > _CACHE_TTL_SECONDS:
        _cache.pop(key, None)
        return None
    return value


def _set_cached(key: Tuple[str, str], value: str) -> None:
    _cache[key] = (time.time(), value)


def _filter_recent_entries(entries, hours: int) -> list:
    """Filter RSS entries to only include recent ones within specified hours."""
    cutoff = time.time() - (hours * 60 * 60)
    recent = []
    for entry in entries:
        published = entry.get("published_parsed") or entry.get("updated_parsed")
        if published:
            published_ts = time.mktime(published)
            if published_ts >= cutoff:
                recent.append(entry)
    return recent or list(entries)


def _calculate_similarity(text1: str, text2: str) -> float:
    """
    Calculate similarity between two texts using a simple word overlap metric.
    Returns a score between 0 (completely different) and 1 (identical).
    """
    # Simple word-based similarity
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())

    if not words1 or not words2:
        return 0.0

    intersection = words1.intersection(words2)
    union = words1.union(words2)

    return len(intersection) / len(union) if union else 0.0


def deduplicate_stories(stories: list, similarity_threshold: float = 0.4) -> list:
    """
    Remove duplicate or highly similar stories from a list.
    Each story should be a dict with 'title' and optionally 'summary' or 'body'.
    Returns deduplicated list of stories.
    """
    if not stories:
        return []

    deduplicated = []
    seen_content = []

    for story in stories:
        # Combine title and body/summary for comparison
        story_text = story.get('title', '') + ' ' + story.get('body', story.get('summary', ''))

        # Check against already seen stories
        is_duplicate = False
        for seen in seen_content:
            similarity = _calculate_similarity(story_text, seen)
            if similarity > similarity_threshold:
                is_duplicate = True
                break

        if not is_duplicate:
            deduplicated.append(story)
            seen_content.append(story_text)

    return deduplicated
