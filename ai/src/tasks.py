from textwrap import dedent
from crewai import Task

class NewsletterTasks():
    def research_task(self, agent: "Agent", url: str, topic: str) -> Task:
        return Task(
            description=dedent(f"Analyze the content of the website: {url}. Your goal is to extract the top 2-3 most significant news stories from this source related to {topic}. For each story, provide a concise summary, the source URL, and a title."),
            expected_output=dedent("A list of summaries in markdown format: '- **[Story Title]**: [Brief summary]. (Source: {url})'"),
            agent=agent,
        )

    def curiosity_task(self, agent: "Agent") -> Task:
        return Task(
            description="Find a single, mind-blowing fact about technology or finance.",
            expected_output="A single sentence containing the curiosity and its source.",
            agent=agent
        )

    def compile_newsletter_task(self, agent: "Agent", contexts: list, output_path: str) -> Task:
        return Task(
            description=dedent("Compile a final newsletter from the research provided. Select the best 5 news stories, discard duplicates, and rewrite them engagingly. Format the curiosity. Structure the entire output as a single JSON object."),
            expected_output=dedent("""
                A single, valid JSON object following this exact structure:
                {
                  "news": [{"title": "...", "body": "...", "source": "..."}, ...],
                  "curiosity": {"text": "...", "source": "..."}
                }
            """),
            agent=agent,
            context=contexts,
            output_file=output_path
        )