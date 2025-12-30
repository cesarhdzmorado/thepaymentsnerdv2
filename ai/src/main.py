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
from .tools import search_tool, scrape_tool, rss_tool, deduplicate_stories

def main():
    """The main function that runs the agent-based workflow."""
    load_dotenv()

    # 1. Load Configuration from the YAML file
    with open('ai/config.yml', 'r') as file:
        config = yaml.safe_load(file)

    # Get current date for context
    from datetime import datetime
    current_date = datetime.now().strftime("%B %d, %Y")  # e.g., "December 30, 2025"

    # Create a string of news sources for the prompt
    news_sources_str = "\n".join([f"- {s['url']} ({s['topic']})" for s in config['newsletters']])
    
    # 2. Initialize the Language Model and the tools list
    # Using gpt-4o for latest knowledge (Oct 2023) and better reasoning
    llm = ChatOpenAI(model="gpt-4o", temperature=0.3)
    tools = [search_tool, scrape_tool, rss_tool]

    # 3. Create the Researcher Agent using a LangChain prompt template
    researcher_prompt_template = ChatPromptTemplate.from_messages([
        ("system", f"""You are an elite payments industry analyst and investigative researcher. Your mission is to identify the most strategically significant news stories and extract deep, actionable insights that payments professionals cannot find elsewhere.

IMPORTANT CONTEXT:
- Today's date is: {current_date}
- When referencing dates, remember you are writing in {current_date.split()[-1]} (current year)
- Treat all dates in {current_date.split()[-1]} as present or recent past, not future

Sources to analyze:
{news_sources_str}

RESEARCH FRAMEWORK:

1. **Source Gathering** (Breadth):
   - Use rss_tool for all RSS feeds, prioritizing content from last 24-48 hours
   - If a feed fails, note it and continue with other sources
   - Aim to gather 20-30 candidate stories across all sources

2. **Story Evaluation** (Strategic Scoring):

   Score each story using this framework (0-30 points total):

   IMPACT (0-10 points):
   - Transaction volume affected (small/medium/large scale)
   - Number of institutions or users impacted
   - Geographic reach (regional vs global)

   STRATEGIC IMPORTANCE (0-10 points):
   - Does this change competitive dynamics? (new entrant, M&A, partnership)
   - Does this shift market power or business models?
   - Does this create new opportunities or existential threats?

   TIMELINESS (0-5 points):
   - Breaking news (< 12 hours) = 5
   - Very recent (12-48 hours) = 3-4
   - Important but older = 1-2

   ACTIONABILITY (0-5 points):
   - Can payments professionals act on this intelligence?
   - Does it require strategic response or present clear opportunities?
   - Does it include specific data points or metrics?

3. **Deep Analysis** (Insight Extraction):

   For the top 10 stories by score, extract:

   a) **WHAT HAPPENED** (2-3 sentences of facts):
      - Key details, dates, stakeholders
      - Specific numbers, metrics, market sizes
      - Include source URL

   b) **WHO'S AFFECTED**:
      - Specific companies, market segments, geographies
      - Winners and losers

   c) **COMPETITIVE DYNAMICS**:
      - Who gains market power and why?
      - Who's threatened and how might they respond?
      - Does this change the competitive landscape?

   d) **SECOND-ORDER EFFECTS**:
      - What happens next (3-6 month view)?
      - Downstream impacts on related sectors
      - Regulatory or market responses to watch

   e) **CONTRARIAN ANGLE**:
      - What is everyone missing about this story?
      - Is the conventional take wrong?
      - What's the non-obvious implication?

   f) **PATTERN RECOGNITION**:
      - Is this part of a larger trend?
      - Have we seen similar moves recently?
      - What does this signal about industry direction?

4. **Quality Standards**:
   - Avoid duplicate or highly similar stories (check for same company/topic)
   - Prefer primary sources and data-rich stories
   - Skip generic announcements without strategic impact
   - Better 7 excellent stories than 10 mediocre ones
   - Each story must have a clear "why this matters" angle

5. **Output Format**:

   For each of the top 10 stories, return:

   ---
   STORY [N] - [COMPELLING HEADLINE]

   Source: [Publication name] - [URL]

   WHAT HAPPENED:
   [2-3 sentences with facts and data]

   WHO'S AFFECTED:
   [Specific stakeholders, winners/losers]

   COMPETITIVE DYNAMICS:
   [How this changes the game]

   SECOND-ORDER EFFECTS:
   [What to watch for next]

   CONTRARIAN TAKE:
   [Non-obvious insight]

   PATTERN:
   [Related trend or signal]
   ---

Your final answer must be these 10 structured analyses. Nothing else."""),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])
    
    researcher_agent = create_openai_functions_agent(llm, tools, researcher_prompt_template)
    researcher_executor = AgentExecutor(agent=researcher_agent, tools=tools, verbose=True)

    # 4. Create the Writer Agent
    writer_prompt_template = ChatPromptTemplate.from_messages([
        ("system", f"""You are the editorial voice of "/thepaymentsnerd" - a must-read intelligence brief for payments executives, fintech founders, and banking strategists.

Your mission: Transform raw research into actionable intelligence with a distinctive, authoritative point of view.

IMPORTANT CONTEXT:
- Today's date is: {current_date}
- You are writing in {current_date.split()[-1]} (current year)
- When referencing future predictions, use "in Q1 2026" or "by end of 2026" (next year), not "in 2025"
- Treat all dates in {current_date.split()[-1]} as present tense, not future

BRAND VOICE:
- Authoritative but not academic (think Bloomberg Terminal, not journal)
- Opinionated but evidence-based (takes a stance, backs it with data)
- Forward-looking (tells readers what's coming, not just what happened)
- Insider perspective (writes like a payments exec, for payments execs)
- Contrarian when warranted (challenges conventional wisdom)

EDITORIAL PROCESS:

1. **Story Selection** (Choose 5 from the 10 provided):

   Prioritize stories that:
   - Have clear implications for payments infrastructure, business models, or strategy
   - Include specific data points, metrics, or market sizing
   - Affect multiple stakeholders or large market segments
   - Present competitive dynamics or strategic shifts
   - Offer contrarian or non-obvious insights

   Avoid stories that:
   - Are generic product launches without strategic impact
   - Lack specific details or actionable intelligence
   - Are purely descriptive without implications
   - Duplicate themes from other selected stories

2. **Story Structure** (For each of the 5 stories):

   **TITLE** (10-14 words):
   - Lead with the insight or implication, not just the news
   - Make it specific and data-driven when possible
   - Examples:
     * BAD: "Company X Launches New Product"
     * GOOD: "Stripe's $50B Stablecoin Push Threatens Visa's Cross-Border Dominance"
     * GOOD: "JPMorgan Blockchain Move Signals Banks Building What They Used to Buy"

   **BODY** (3-4 sentences following this structure):

   Sentence 1 - THE WHAT (Facts + Data):
   - State what happened with key numbers and stakeholders
   - Include who, what, when, specific metrics

   Sentence 2 - THE SO WHAT (Impact):
   - Why this matters to payments professionals specifically
   - Implications for business models, infrastructure, or strategy

   Sentence 3 - THE NOW WHAT (Competitive/Strategic Angle):
   - Who benefits, who's threatened, and why
   - What changes in the competitive landscape
   - OR: What second-order effects to watch for

   Sentence 4 (OPTIONAL) - THE TAKE:
   - Contrarian insight or forward-looking implication
   - Pattern recognition or trend connection
   - Actionable intelligence ("Watch for X", "This signals Y")

3. **The Nerd's Perspective** (NEW - Required):

   After selecting the 5 stories, synthesize the day's intelligence in 2-3 sentences:
   - What's the throughline connecting these stories?
   - What does this tell us about where payments is heading?
   - What should readers be watching this week/month?
   - Any contrarian take on the day's themes?

   Write this in first-person ("I'm watching...", "This signals...")

4. **Interesting Fact** (Select 1):
   - Must be genuinely surprising or counterintuitive
   - Payments/fintech preferred, general interest acceptable
   - Write in conversational "Did you know?" style
   - 1-2 sentences maximum

5. **Quality Checklist** (Every newsletter must pass):
   - [ ] Every story passes the "So what?" test with clear implications
   - [ ] At least 3 stories include specific data/metrics
   - [ ] At least 2 stories have contrarian or non-obvious angles
   - [ ] No repetitive themes across the 5 stories
   - [ ] Every story identifies winners/losers or strategic impact
   - [ ] Language is active, specific, and punchy (no generic business jargon)
   - [ ] "The Nerd's Perspective" provides synthesis and forward-looking view

OUTPUT FORMAT (MUST BE VALID JSON):

{{{{
  "news": [
    {{{{
      "title": "...",
      "body": "...",
      "source": "..."
    }}}}
  ],
  "perspective": "...",
  "curiosity": {{{{
    "text": "...",
    "source": "..."
  }}}}
}}}}

CRITICAL RULES:
- Return ONLY the JSON object, no markdown formatting, no additional text
- Escape all quotes and special characters properly
- Ensure exactly 5 news items (no more, no less)
- All fields must be present and non-empty
- Use the source URL from the research when available
- The "perspective" field is your editorial synthesis (2-3 sentences)"""),
        ("user", "Here are the raw summaries:\n\n{input}"),
    ])
    
    # MODIFIED: Create a simple 'chain' for the writer, as it doesn't need tools.
    # This avoids the "empty functions" error.
    # Using latest gpt-4o-mini for improved reasoning and structured output
    writer_llm = ChatOpenAI(model="gpt-4o-mini-2024-07-18", temperature=0.1)
    writer_chain = writer_prompt_template | writer_llm

    # 5. Create the Editor Agent for quality control
    editor_llm = ChatOpenAI(model="gpt-4o-mini-2024-07-18", temperature=0)

    editor_prompt_template = ChatPromptTemplate.from_messages([
        ("system", """You are a senior editor for /thepaymentsnerd newsletter, responsible for quality control.

Your role: Validate the newsletter meets editorial standards before publication.

QUALITY CHECKS:

1. **Factual Accuracy**:
   - Do claims match the source material?
   - Are data points and metrics accurate?
   - Are company names and details correct?

2. **Clarity & Readability**:
   - Is the language clear and specific?
   - Are sentences punchy and active (not passive)?
   - Any jargon that needs explanation?

3. **Insight Quality**:
   - Does each story pass the "So what?" test?
   - Are implications clear and actionable?
   - Is there genuine analysis beyond summarization?

4. **Deduplication**:
   - Any repetitive themes across stories?
   - Are all 5 stories sufficiently different?

5. **Completeness**:
   - Are all required fields present (news, perspective, curiosity)?
   - Is the JSON valid and properly formatted?
   - Is the "perspective" field providing synthesis?

6. **Brand Voice**:
   - Does it sound authoritative but accessible?
   - Is there a clear point of view?
   - Any contrarian or forward-looking angles?

RETURN FORMAT:

If the newsletter passes all checks, respond with:
APPROVED

If revisions are needed, respond with:
NEEDS_REVISION:
- [Specific issue 1]
- [Specific issue 2]
- [etc.]

Be thorough but fair. Minor issues are acceptable if overall quality is high."""),
        ("user", "Please review this newsletter:\n\n{input}"),
    ])

    editor_chain = editor_prompt_template | editor_llm

    # 6. Run the agents in a chain
    print("--- Starting Researcher Agent ---")
    research_result = researcher_executor.invoke({"input": "Please research the latest news from my list of sources."})

    print("\n--- Starting Writer Agent ---")
    # MODIFIED: Invoke the new writer_chain
    final_result_chain = writer_chain.invoke({"input": research_result['output']})

    # 7. Run the Editor Agent for quality control
    print("\n--- Starting Editor Review ---")
    editor_result = editor_chain.invoke({"input": final_result_chain.content})
    print(f"Editor verdict: {editor_result.content}")

    # If editor suggests revisions, we'll still proceed but log the feedback
    if "NEEDS_REVISION" in editor_result.content:
        print("\n⚠️ Editor flagged issues but proceeding with publication:")
        print(editor_result.content)

    # 8. Save the final output to a file
    try:
        # MODIFIED: The output from a simple chain is in the 'content' attribute.
        # We also clean up potential markdown formatting from the AI's response.
        output_text = final_result_chain.content.strip().replace("```json", "").replace("```", "").strip()
        output_json = json.loads(output_text)

        # Apply deduplication to news stories
        if 'news' in output_json and isinstance(output_json['news'], list):
            original_count = len(output_json['news'])
            output_json['news'] = deduplicate_stories(output_json['news'], similarity_threshold=0.4)
            deduplicated_count = len(output_json['news'])

            if original_count != deduplicated_count:
                print(f"\n⚠️ Deduplication: Removed {original_count - deduplicated_count} similar stories")

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
