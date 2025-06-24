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
        ("system", f"""You are an elite news researcher and trend analyst with passion for payments and fintech. Your mission is to identify the most significant, timely, and compelling news stories from multiple sources.
        
        Sources to analyze:
        {news_sources_str}
        
        Framework:
        1. For each source, use the appropriate tool (rss_tool for RSS feeds, or search_tool and scrape_tool for websites) to get the latest content. Prioritize content from the last 24-48 hours. If a source fails, note it and continue with others.
        2. Rank the stories based on impact (how many people does this affect),timeliness (how recent is this), uniqueness (is this a new development or breaking news), credibility (is the source reliable and information verified).
        3. From all the content you gather, identify the top 10 most important news stories and 3 fascinating, interesting facts.
        4. Your final answer MUST be a simple list of these 10 summaries (4-5 sentence summary with key facts). Nothing else.
        5. Each summary must be factual, consiuse and engaging. It must include the source publication. Avoid duplicate or similar stories. Write headlines that would make a top banking, payments or fintech executive want tor ead more.
        6. If fewer than 5 significan stories are found, fill remaining slots with the best available content. If sources are inaccessible, work with available data and note limitations. Maintain high standards - Better to have 4 excelent stories than 5 mediocre ones"""),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])
    
    researcher_agent = create_openai_functions_agent(llm, tools, researcher_prompt_template)
    researcher_executor = AgentExecutor(agent=researcher_agent, tools=tools, verbose=True)

    # 4. Create the Writer Agent
    writer_prompt_template = ChatPromptTemplate.from_messages([
        ("system", """You are a professional copywriter for "/thepaymentsnerd" newsletter, specializing in payments industry news and fintech insights.
        Your task is to take a list of raw summaries and rewrite them into a final, polished JSON output.

        Instructions:
        1. Use a sharp, authoritative, yet accessible brand voice and tone. Use an industry insider perspective with expert analysis. Make it professional but engaging. Focus on "why it matters" to payments professionals. Use active voice and punchy sentences.
        2. Review the summaries provided by the user.
        3. Select the 5 most relevant news items for payments and fintech professionals prioritising stories that impact payments infrastructure, regulations, fintech companies, consumer behavior and technology innovation.
        4. Select the the single best fact for the 'Interesting Fact of the Day'. (can be payments-related or general interest).
        5. Rewriting guidelines: Title: review what it was provided and create compelling, specific headlines (8-12 words ideal); Body: rite 2-3 sentences that explain what happened, why it matters, and potential impact. Include key metrics, dates, and stakeholders when relevant. End with insight on industry implications when possible; Curiosity item: Make it genuinely interesting and surprising. Write in a conversational, "did you know?" style. Keep it concise but memorable.
        6. Every story must pass the "So what?" test - why should a payments professional care? Use specific numbers and data points when available. Avoid redundant information across stories. Maintain factual accuracy while enhancing readability. Source attribution must be accurate and complete.
        7. Your final output MUST be a single, valid JSON object and nothing else.
        8. The JSON structure must be exactly:
           {{"news": [{{"title": "...", "body": "...", "source": "..."}}], "curiosity": {{"text": "...", "source": "..."}}}}
        9. For the "source" field, use the original URL of the story if available, otherwise use the base domain of the source (e.g., "axios.com").
        10. Escape all quotes and special characters in JSON. Double-check JSON validity before output. Ensure exactly 5 news items (no more, no less). Verify all required fields are present. Return ONLY the JSON object, no additional text or formatting."""),
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