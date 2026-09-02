from flask import Blueprint, request, jsonify
from app.utils.utils import extract_text_from_file
from app.ai import generate_flashcards, generate_quiz_questions

main = Blueprint("main", __name__)

ERROR_MESSAGES = {
    "quota_exceeded": "Groq API rate limit reached. Please wait a moment and try again.",
    "no_client": "Groq API key is not configured. Please set GROQ_API_KEY in the backend .env file.",
    "model_not_found": "The configured AI model is unavailable. Please check your Groq API key permissions.",
    "parse_error": "AI returned an unexpected response format. Please try again.",
    "all_failed": "All AI models failed to respond. Please try again shortly.",
}

@main.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "Smart Cards Backend API is running",
        "endpoints": {
            "upload": "/api/upload [POST]",
            "generate_flashcards": "/api/generate_flashcards [POST]",
            "generate_quiz": "/api/generate_quiz [POST]"
        }
    })

@main.route("/api/upload", methods=["POST"])
def upload_file():
    uploaded_file = request.files.get("file")

    if not uploaded_file:
        return jsonify({"error": "No file uploaded"}), 400

    filename = uploaded_file.filename.lower()

    if filename.endswith(".doc") or filename.endswith(".ppt"):
        return jsonify({
            "error": "Files in .doc or .ppt format are not supported. Please upload as .docx or .pptx instead."
        }), 400

    processed_text = extract_text_from_file(uploaded_file)

    if not processed_text:
        return jsonify({"error": "Could not extract text"}), 400

    return jsonify({
        "preview": processed_text,
        "word_count": len(processed_text.split())
    })


@main.route("/api/generate_flashcards", methods=["POST"])
def flashcard_route():
    data = request.get_json() or {}
    text = data.get("text", "")
    count = data.get("count", 5)
    previous_questions = data.get("previous_questions", [])

    if not text:
        return jsonify({"error": "No text provided"}), 400

    flashcards, err = generate_flashcards(text, count=count, previous_questions=previous_questions)
    if err:
        return jsonify({"error": ERROR_MESSAGES.get(err, "Failed to generate flashcards.")}), 503
    return jsonify({"flashcards": flashcards})

@main.route("/api/generate_quiz", methods=["POST"])
def quiz_route():
    data = request.get_json() or {}
    text = data.get("text", "")
    count = data.get("count", 5)
    previous_questions = data.get("previous_questions", [])

    if not text:
        return jsonify({"error": "No text provided"}), 400

    quiz, err = generate_quiz_questions(text, count=count, previous_questions=previous_questions)
    if err:
        return jsonify({"error": ERROR_MESSAGES.get(err, "Failed to generate quiz.")}), 503
    return jsonify({"quiz": quiz})



