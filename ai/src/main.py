# ai/src/main.py

# This is the system-level hack for sqlite3
__import__('pysqlite3')
import sys
sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')

import yaml
import json
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.agents import create_openai_functions_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# Import our custom tools
from .tools import search_tool, scrape_tool, rss_tool

def main():
    """The main function that runs the agent-based workflow."""
    load_dotenv()

    # 1. Load Configuration from the YAML file
    with open('ai/config.yml', 'r') as file:
        config = yaml.safe_load(file)
    
    # Create a string of news sources for the prompt
    news_sources_str = "\n".join([f"- {s['url']} ({s['topic']})" for s in config['newsletters']])
    
    # 2. Initialize the Language Model and the tools list
    llm = ChatOpenAI(model="gpt-4-turbo", temperature=0)
    tools = [search_tool, scrape_tool, rss_tool]

    # 3. Create the Researcher Agent using a LangChain prompt template
    researcher_prompt_template = ChatPromptTemplate.from_messages([
        ("system", f"""You are an expert news researcher. Your goal is to find the most significant and interesting news from the provided sources.
        
        Sources to analyze:
        {news_sources_str}
        
        Process:
        1. For each source, use the appropriate tool (rss_tool for RSS feeds, or search_tool and scrape_tool for websites) to get the latest content.
        2. From all the content you gather, identify the top 5 most important news stories and 1 fascinating, quirky fact.
        3. Your final answer MUST be a simple list of these 6 summaries. Nothing else."""),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])
    
    researcher_agent = create_openai_functions_agent(llm, tools, researcher_prompt_template)
    researcher_executor = AgentExecutor(agent=researcher_agent, tools=tools, verbose=True)

    # 4. Create the Writer Agent
    writer_prompt_template = ChatPromptTemplate.from_messages([
        ("system", """You are a professional copywriter for a newsletter called '/thepaymentsnerd'.
        Your task is to take a list of raw summaries and rewrite them into a final, polished JSON output.

        Instructions:
        1. Review the 6 summaries provided by the user.
        2. Select the best 5 news items and the single best fact for the 'Interesting Fact of the Day'.
        3. Rewrite each item in an engaging, sharp, professional tone.
        4. Your final output MUST be a single, valid JSON object and nothing else.
        5. The JSON structure must be exactly:
           {{"news": [{{"title": "...", "body": "...", "source": "..."}}], "curiosity": {{"text": "...", "source": "..."}}}}
        6. For the "source" field, use the original URL of the story if available, otherwise use the base domain of the source (e.g., "axios.com")."""),
        ("user", "Here are the raw summaries:\n\n{input}"),
    ])
    
    # MODIFIED: Create a simple 'chain' for the writer, as it doesn't need tools.
    # This avoids the "empty functions" error.
    writer_chain = writer_prompt_template | llm

    # 5. Run the agents in a chain
    print("--- Starting Researcher Agent ---")
    research_result = researcher_executor.invoke({"input": "Please research the latest news from my list of sources."})
    
    print("\n--- Starting Writer Agent ---")
    # MODIFIED: Invoke the new writer_chain
    final_result_chain = writer_chain.invoke({"input": research_result['output']})

    # 6. Save the final output to a file
    try:
        # MODIFIED: The output from a simple chain is in the 'content' attribute.
        # We also clean up potential markdown formatting from the AI's response.
        output_text = final_result_chain.content.strip().replace("```json", "").replace("```", "").strip()
        output_json = json.loads(output_text)
        
        output_path = "web/public/newsletter.json"
        with open(output_path, 'w') as f:
            json.dump(output_json, f, indent=2)
            
        print(f"\n--- Newsletter successfully saved to {output_path} ---")
        print("Final JSON output:")
        print(json.dumps(output_json, indent=2))
        
    except (json.JSONDecodeError, AttributeError, KeyError) as e:
        print(f"\n--- FAILED to parse or save the final JSON. ---")
        print(f"Error: {e}")
        print("Raw AI Output:")
        # Print the raw content for debugging
        print(final_result_chain.content if hasattr(final_result_chain, 'content') else final_result_chain)

if __name__ == "__main__":
    main()