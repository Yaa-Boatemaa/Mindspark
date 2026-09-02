import os
import re
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key) if api_key else None

# Groq-hosted models
MODELS = [
    "qwen/qwen3.8-27b",
    "groq/compound-mini",
    "groq/compound",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
]


def _clean_json(content):
    """Strip reasoning tags, markdown code fences, and extract valid JSON array string."""
    content = content.strip()
    # Remove any <think>...</think> blocks from reasoning models
    content = re.sub(r"<think>.*?</think>", "", content, flags=re.DOTALL).strip()
    # Extract from markdown code fences if present
    if "```" in content:
        match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", content, flags=re.IGNORECASE)
        if match:
            content = match.group(1).strip()
    # Extract the JSON array [ ... ]
    match = re.search(r"(\[[\s\S]*\])", content)
    if match:
        content = match.group(1).strip()
    return content


def _generate_with_fallback(prompt):
    """Try each model until one works. Returns (text, error_code)."""
    if not client:
        return None, "no_client"

    last_error = None
    for model in MODELS:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=2000,
            )
            text = response.choices[0].message.content
            print(f"Used model: {model}")
            return text, None
        except Exception as e:
            print(f"Model {model} failed: {e}")
            last_error = e

    print("All models failed:", last_error)
    err_str = str(last_error)
    if "429" in err_str or "rate_limit" in err_str.lower():
        return None, "quota_exceeded"
    if "404" in err_str or "model_not_found" in err_str.lower():
        return None, "model_not_found"
    return None, "all_failed"


def generate_flashcards(text, count=5, previous_questions=None):
    if not client:
        print("Groq client not initialized. Please set GROQ_API_KEY in .env.")
        return [], "no_client"

    avoid_block = ""
    if previous_questions and len(previous_questions) > 0:
        prev_list = "\n".join(f"- {q}" for q in previous_questions[:25])
        avoid_block = f"""
IMPORTANT: Do NOT repeat or generate flashcards similar to these previously created items:
{prev_list}
Focus on DIFFERENT concepts, definitions, or details from the text.
"""

    prompt = f"""You are a helpful study assistant. Based on the following text, generate exactly {count} flashcards.{avoid_block}
Each flashcard must be in this JSON format:
{{ "question": "...", "answer": "..." }}

Return ONLY a valid JSON array, with no extra text, no markdown fences.

Text:
{text}
"""
    try:
        raw, err = _generate_with_fallback(prompt)
        if raw is None:
            return [], err
        content = _clean_json(raw)
        print("Groq flashcards response:", content[:200])
        return json.loads(content), None
    except Exception as e:
        print("Flashcard parse error:", e)
        return [], "parse_error"


def generate_quiz_questions(text, count=5, previous_questions=None):
    if not client:
        print("Groq client not initialized. Please set GROQ_API_KEY in .env.")
        return [], "no_client"

    avoid_block = ""
    if previous_questions and len(previous_questions) > 0:
        prev_list = "\n".join(f"- {q}" for q in previous_questions[:25])
        avoid_block = f"""
IMPORTANT: Do NOT repeat or duplicate these previously asked questions:
{prev_list}
Generate completely NEW and FRESH multiple choice questions testing different facts, concepts, or details from the text.
"""

    prompt = f"""You are a helpful quiz generator. Based on the following text, generate exactly {count} multiple choice questions.{avoid_block}
Each question must include:
- a "question" field (string)
- an "options" field (a JSON array of exactly 4 strings)
- a "correct_answer" field (the exact string from options that is correct)

Return ONLY a valid JSON array, with no extra text, no markdown fences.

Text:
{text}
"""
    try:
        raw, err = _generate_with_fallback(prompt)
        if raw is None:
            return [], err
        content = _clean_json(raw)
        print("Groq quiz response:", content[:200])
        parsed = json.loads(content)
        normalized = []
        for item in parsed:
            if isinstance(item, dict):
                q = str(item.get("question", "")).strip()
                raw_opts = item.get("options", [])
                opts = []
                if isinstance(raw_opts, list):
                    opts = [str(o).strip() for o in raw_opts if str(o).strip()]
                elif isinstance(raw_opts, str):
                    opts = [o.strip() for o in re.split(r'[\n\r]+|[A-D]\)|\d+\.', raw_opts) if o.strip()]
                ans = str(item.get("correct_answer", "")).strip()
                if ans and ans not in opts and len(opts) < 4:
                    opts.append(ans)
                normalized.append({
                    "question": q,
                    "options": opts,
                    "correct_answer": ans
                })
        return normalized, None
    except Exception as e:
        print("Quiz parse error:", e)
        return [], "parse_error"
