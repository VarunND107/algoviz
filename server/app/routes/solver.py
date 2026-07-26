import os

from flask import Blueprint, jsonify, request
from google import genai
from google.genai import types
from google.genai.errors import APIError

solver_bp = Blueprint("solver", __name__)

MODEL = "gemini-flash-lite-latest"

SYSTEM_PROMPT = """You are an expert algorithms tutor embedded in AlgoViz, an algorithm visualization app.
The user will describe a problem in plain language. Respond with exactly these four sections, using
the headings below verbatim:

Algorithm: The single best-fit algorithm. Prefer one of AlgoViz's supported algorithms when it
reasonably fits the problem (Bubble Sort, Quick Sort, Merge Sort, Insertion Sort, Selection Sort,
Linear Search, Binary Search, BFS, DFS, Dijkstra's Algorithm, Floyd-Warshall, or grid pathfinding via
Dijkstra/A*) — otherwise name whatever well-known algorithm genuinely fits best.

Why: 2-4 sentences explaining why this algorithm suits their specific problem, referencing details
from what they described.

Complexity: Time complexity (best/average/worst if they differ) and space complexity.

Example: A short, concrete walkthrough using details from the user's own problem description — not a
generic textbook example.

Keep the whole response tight and readable — short paragraphs, no filler, no restating the question."""


@solver_bp.post("/solve")
def solve():
    data = request.get_json(silent=True) or {}
    problem = (data.get("problem") or "").strip()

    if not problem:
        return jsonify({"error": "problem description is required"}), 400
    if len(problem) > 4000:
        return jsonify({"error": "problem description is too long (max 4000 characters)"}), 400

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return jsonify({"error": "The server is not configured with a GEMINI_API_KEY."}), 500

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model=MODEL,
            contents=problem,
            config=types.GenerateContentConfig(system_instruction=SYSTEM_PROMPT),
        )
    except APIError as e:
        return jsonify({"error": f"Gemini API error: {e.message}"}), 502

    if not response.text:
        return jsonify({"error": "Gemini did not return a response for this request."}), 422

    return jsonify({"answer": response.text, "model": MODEL})
