#!/usr/bin/env python
import traceback
import sys
import os

print("Starting scraper...", file=sys.stderr)

try:
    print("Importing...", file=sys.stderr)
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
    
    print("Creating scraper...", file=sys.stderr)
    scraper = SmartScraperMultiGraph(prompt=prompt, source=sources, config=graph_config)
    
    print("Running scraper...", file=sys.stderr)
    result = scraper.run()
    
    print("Result:", result)
    
except Exception as e:
    print(f"Error: {type(e).__name__}: {e}", file=sys.stderr)
    traceback.print_exc(file=sys.stderr)
    sys.exit(1)

print("Done!", file=sys.stderr)
