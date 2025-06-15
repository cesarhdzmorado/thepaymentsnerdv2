# ai/src/main.py

# This is a system-level hack to ensure we use a modern version of sqlite3.
# It must be at the very top of the entry-point file.
__import__('pysqlite3')
import sys
sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')

import yaml
from crewai import Crew, Process

# We import our custom modules after the system hack.
from .agents import NewsletterAgents
from .tasks import NewsletterTasks


class NewsletterCrew:
    def __init__(self, output_path):
        self.output_path = output_path
        # Load the list of news sources from our YAML config file.
        with open('ai/config.yml', 'r') as file:
            self.config = yaml.safe_load(file)
        self.agents = NewsletterAgents()
        self.tasks = NewsletterTasks()

    def run(self):
        # Create all the agents
        researchers = [self.agents.make_researcher(f"researcher_{i}", source['topic']) for i, source in enumerate(self.config['newsletters'])]
        curiosity_agent = self.agents.make_curiosity_researcher()
        writer_agent = self.agents.make_writer()

        # Create all the tasks
        research_tasks = [self.tasks.research_task(researchers[i], source['url'], source['topic']) for i, source in enumerate(self.config['newsletters'])]
        curiosity_task = self.tasks.curiosity_task(agent=curiosity_agent)
        
        # The compile task is the final one, taking context from all previous tasks.
        compile_task = self.tasks.compile_newsletter_task(
            agent=writer_agent,
            contexts=research_tasks + [curiosity_task],
            output_path=self.output_path
        )

        # Form the crew with a sequential process
        crew = Crew(
            agents=researchers + [curiosity_agent, writer_agent],
            tasks=research_tasks + [curiosity_task, compile_task],
            process=Process.sequential,
            verbose=True  # <-- THE FIX: Changed from '2' to 'True' for compatibility with new CrewAI versions.
        )
        
        # Kick off the crew's work
        result = crew.kickoff()
        
        print("\n\n########################")
        print("## Crew work complete! ##")
        print("########################\n")
        print("Final Result:")
        print(result)

# This is the entry point of the script
if __name__ == "__main__":
    # Define the path where the final JSON newsletter will be saved.
    output_file_path = "web/public/newsletter.json"
    newsletter_crew = NewsletterCrew(output_path=output_file_path)
    newsletter_crew.run()