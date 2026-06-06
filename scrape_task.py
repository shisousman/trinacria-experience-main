import os
from scrapegraphai.graphs import SmartScraperMultiGraph

sources = [
    "https://www.getyourguide.com/palermo-l432/",
    "https://www.getyourguide.com/lipari-l1193/"
]

graph_config = {
    "llm": {
        "api_key": os.getenv("OPENAI_API_KEY"),
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
