# ai/src/tools.py

# This is the correct import for the stable LangChain environment we built.
from langchain_core.tools import tool
import requests
from bs4 import BeautifulSoup
from duckduckgo_search import DDGS
import feedparser

@tool
def search_tool(query: str) -> str:
    """Performs a web search to find relevant URLs."""
    try:
        with DDGS() as ddgs:
            results = [r for r in ddgs.text(query, max_results=5)]
            return str(results) if results else "No results found."
    except Exception as e:
        return f"Error searching: {e}"

@tool
def scrape_tool(url: str) -> str:
    """Scrapes the text content of a single webpage."""
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'lxml')
        for tag in soup(['script', 'style', 'nav', 'footer', 'header']):
            tag.decompose()
        return soup.get_text(strip=True)[:4000]
    except Exception as e:
        return f"Error scraping: {e}"

@tool
def rss_tool(rss_feed_url: str) -> str:
    """Fetches articles from an RSS feed."""
    try:
        feed = feedparser.parse(rss_feed_url)
        entries = feed.entries[:5]
        if not entries: return "No articles found."
        summaries = [f"Title: {e.get('title', 'N/A')}\nSummary: {BeautifulSoup(e.get('summary', ''), 'lxml').get_text(strip=True)}" for e in entries]
        return "\n\n".join(summaries)
    except Exception as e:
        return f"Error reading RSS feed: {e}"