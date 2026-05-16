from scrapegraphai.graphs import SmartScraperMultiGraph

sources = [
    "https://www.getyourguide.com/palermo-l432/",
    "https://www.getyourguide.com/lipari-l1193/"
]

graph_config = {
    "llm": {
        "api_key": "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",  # Replace with your OpenAI / Gemini API key
        "model": "openai/gpt-4o-mini",
    },
    "headless": True,
}

prompt = """
For each city/island, extract exactly one sample for:
- A 5-star hotel
- A beach-side resort
- An experience-based tour
Return the name, category, and city for each.
"""

scraper = SmartScraperMultiGraph(prompt=prompt, source=sources, config=graph_config)
print(scraper.run())
