# ai/src/tools.py

# In this known-good version, 'tool' is correctly imported from 'crewai_tools'
from crewai_tools import SerperDevTool, WebsiteSearchTool, tool
import feedparser

# --- Existing Tools ---
search_tool = SerperDevTool()
scrape_tool = WebsiteSearchTool()

# --- Custom Tool Definition ---
@tool("RSS Feed Reader")
def rss_tool(rss_feed_url: str) -> str:
    """A tool to fetch and parse articles from an RSS feed URL."""
    try:
        feed = feedparser.parse(rss_feed_url)
        if feed.bozo:
            return f"Error: Failed to parse RSS feed."

        entries = feed.entries[:5]
        if not entries:
            return "No articles found in this RSS feed."

        formatted_entries = []
        for entry in entries:
            title = entry.get("title", "No Title")
            summary = entry.get("summary", "No Summary Available.")
            formatted_entries.append(f"- Title: {title}\n  Summary: {summary}\n")
        
        return "\n".join(formatted_entries)

    except Exception as e:
        return f"An error occurred: {e}"