# ai/src/agents.py

from . import config

from crewai import Agent
from langchain_openai import ChatOpenAI

# MODIFIED: Import the new rss_tool alongside the others
from .tools import search_tool, scrape_tool, rss_tool

# Initialize the language model using the name from our config file
llm = ChatOpenAI(model=config.OPENAI_MODEL_NAME)

class NewsletterAgents():
    def make_researcher(self, name: str, topic: str) -> Agent:
        return Agent(
            role=f"Expert News Researcher for {topic}",
            goal=f"Uncover the latest, most relevant news and developments in {topic}. Focus on groundbreaking stories, significant funding rounds, and major company announcements.",
            backstory=f"As a seasoned news analyst specializing in {topic}, you have a keen eye for what's important. You dissect news from various sources, filtering out noise to find the signal. Your summaries are concise, accurate, and provide the core essence of the news.",
            llm=llm,
            # This list now correctly includes the imported rss_tool
            tools=[search_tool, scrape_tool, rss_tool],
            verbose=True,
            allow_delegation=False
        )

    def make_curiosity_researcher(self) -> Agent:
        return Agent(
            role="Quirky Fact Finder",
            goal="Discover one fascinating, unexpected, or delightful fact related to technology, finance, or human ingenuity.",
            backstory="You are a digital archaeologist of interesting trivia. You dig through the web to find little-known gems of information that make people say 'Wow!'. Your findings are always short, verifiable, and surprising.",
            llm=llm,
            # We also give the curiosity researcher all the tools
            tools=[search_tool, scrape_tool, rss_tool],
            verbose=True,
            allow_delegation=False
        )

    def make_writer(self) -> Agent:
        return Agent(
            role="Engaging Tech Copywriter",
            goal="""Synthesize research from multiple agents into a single, compelling newsletter. The newsletter must contain exactly 5 news items and 1 'Curiosity of the Day'.
            Rewrite the content to be engaging, sharp, and in the style of a top-tier professional publication like 'The Verge' or 'Wired'.""",
            backstory="You are a world-class copywriter, known for your ability to turn dry facts into captivating stories. You have a knack for headlines and an informal yet authoritative tone. Your writing is what makes people excited to read the news every day.",
            llm=llm,
            verbose=True,
            memory=True,
            allow_delegation=False
        )