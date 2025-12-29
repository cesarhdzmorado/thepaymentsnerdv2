# ai/src/tools.py

# This is the correct import for the stable LangChain environment we built.
from langchain_core.tools import tool
import time
from typing import Dict, Tuple

import requests
from bs4 import BeautifulSoup
from duckduckgo_search import DDGS
import feedparser

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
    """Scrapes the text content of a single webpage."""
    try:
        cached = _get_cached(("scrape", url))
        if cached is not None:
            return cached
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = _session.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'lxml')
        for tag in soup(['script', 'style', 'nav', 'footer', 'header']):
            tag.decompose()
        output = soup.get_text(strip=True)[:4000]
        _set_cached(("scrape", url), output)
        return output
    except Exception as e:
        return f"Error scraping: {e}"

@tool
def rss_tool(rss_feed_url: str) -> str:
    """Fetches articles from an RSS feed."""
    try:
        cached = _get_cached(("rss", rss_feed_url))
        if cached is not None:
            return cached
        feed = feedparser.parse(rss_feed_url)
        entries = _filter_recent_entries(feed.entries, hours=48)[:5]
        if not entries:
            return "No articles found."
        summaries = [
            f"Title: {e.get('title', 'N/A')}\nSummary: {BeautifulSoup(e.get('summary', ''), 'lxml').get_text(strip=True)}"
            for e in entries
        ]
        output = "\n\n".join(summaries)
        _set_cached(("rss", rss_feed_url), output)
        return output
    except Exception as e:
        return f"Error reading RSS feed: {e}"


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
    cutoff = time.time() - (hours * 60 * 60)
    recent = []
    for entry in entries:
        published = entry.get("published_parsed") or entry.get("updated_parsed")
        if published:
            published_ts = time.mktime(published)
            if published_ts >= cutoff:
                recent.append(entry)
    return recent or list(entries)
