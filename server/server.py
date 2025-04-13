from huggingface_hub import InferenceClient
from dotenv import load_dotenv
import os
import json
import re 
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)  

hf_client = InferenceClient(api_key=os.getenv("MOSS_KEY"))

mongo_client = MongoClient(os.getenv("MONGO_URI"))

db = mongo_client.chat_history 

print(db)

conversations = db.conversations  
notes = db.notes
flashcards = db.flashcards
quizzes = db.quizzes

@app.route("/chat", methods=["POST"])
def chat():
    clerk_user_id = request.headers.get("X-Clerk-User-Id")
    if not clerk_user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    user_message = data.get("message", "")
    conversation_id = data.get("conversationId") or str(ObjectId())
    
    messages = [
        {"role": "user", "content": user_message}
    ]

    try:
        print("Here")
        completion = hf_client.chat.completions.create(
            model="meta-llama/Meta-Llama-3-8B-Instruct", 
            messages=messages, 
            max_tokens=500
        )
        ai_response = completion.choices[0].message["content"]
        print(ai_response)
        
        conversation = {
            "user_id": clerk_user_id,      
            "conversation_id": conversation_id,
            "user_message": user_message,
            "ai_response": ai_response,
            "timestamp": datetime.now()
        }
        
        print("Conversation doc:", conversation) 
        conversations.insert_one(conversation)
        
        return jsonify({
            "response": ai_response,
            "conversationId": conversation_id
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/conversations", methods=["GET"])
def get_conversations():
    clerk_user_id = request.headers.get("X-Clerk-User-Id")
    if not clerk_user_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        user_conversations = list(conversations.find(
            {"user_id": clerk_user_id}
        ).sort("timestamp", -1))
        
        for convo in user_conversations:
            convo["_id"] = str(convo["_id"])
            
        return jsonify(user_conversations)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/conversation/<conversation_id>", methods=["GET"])
def get_conversation(conversation_id):
    clerk_user_id = request.headers.get("X-Clerk-User-Id")
    if not clerk_user_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        conversation_messages = list(conversations.find(
            {"conversation_id": conversation_id, "user_id": clerk_user_id},
            {'_id': {'$toString': '$_id'}}
        ).sort("timestamp", 1))
        
        if not conversation_messages:
            return jsonify({"error": "Conversation not found"}), 404
            
        return jsonify(conversation_messages)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/conversation/<conversation_id>", methods=["DELETE"])
def delete_conversation(conversation_id):
    clerk_user_id = request.headers.get("X-Clerk-User-Id")
    if not clerk_user_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        result = conversations.delete_many({
            "conversation_id": conversation_id,
            "user_id": clerk_user_id
        })
        if result.deleted_count > 0:
            return jsonify({"message": f"Deleted {result.deleted_count} messages"})
        return jsonify({"error": "Conversation not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/notes", methods=["POST"])
def create_note():
    clerk_user_id = request.headers.get("X-Clerk-User-Id")
    if not clerk_user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    title = data.get("title", "")
    content = data.get("content", "")

    note = {
        "user_id": clerk_user_id,
        "title": title,
        "content": content,
        "timestamp": datetime.now()
    }

    try:
        result = notes.insert_one(note)
        note["_id"] = str(result.inserted_id)
        return jsonify(note), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/notes", methods=["GET"])
def get_notes():
    clerk_user_id = request.headers.get("X-Clerk-User-Id")
    if not clerk_user_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        ns = list(notes.find({"user_id": clerk_user_id}).sort("timestamp", -1))
        
        for note in ns:
            note["_id"] = str(note["_id"])
        
        return jsonify(ns), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Endpoint to Generate Flashcards from a Specific Note ---

@app.route("/notes/<note_id>/flashcards", methods=["POST"])
def generate_flashcards(note_id):
    clerk_user_id = request.headers.get("X-Clerk-User-Id")
    if not clerk_user_id:
        return jsonify({"error": "Unauthorized"}), 401

    # Retrieve the note from the db
    try:
        note = notes.find_one({"_id": ObjectId(note_id), "user_id": clerk_user_id})
    except Exception as e:
        return jsonify({"error": "Invalid note ID"}), 400

    if not note:
        return jsonify({"error": "Note not found"}), 404

    note_content = note.get("content", "")
    note_title = note.get("title", "Note")

    prompt = (
        f"Generate flashcards for the following note content in JSON format. "
        f"The JSON should be an array of objects, each with a 'question' and an 'answer'. "
        f"Note content: {note_content}"
    )
    messages = [{"role": "user", "content": prompt}]

    try:
        completion = hf_client.chat.completions.create(
            model="meta-llama/Meta-Llama-3-8B-Instruct",
            messages=messages,
            max_tokens=500
        )
        ai_response = completion.choices[0].message["content"]

        # Extract JSON from the response
        match = re.search(r"```(.*?)```", ai_response, re.DOTALL)
        if match:
            json_str = match.group(1).strip()
        else:
            json_str = ai_response.strip()

        try:
            flashcards_list = json.loads(json_str)
        except Exception as parse_error:
            return jsonify({
                "error": "Failed to parse LLM response as JSON",
                "details": str(parse_error),
                "raw_response": ai_response
            }), 500


        flashcard_doc = {
            "user_id": clerk_user_id,
            "note_id": note_id,
            "title": f"Flashcards for {note_title}",
            "flashcards": flashcards_list,
            "timestamp": datetime.now()
        }

        result = flashcards.insert_one(flashcard_doc)
        flashcard_doc["_id"] = str(result.inserted_id)
        return jsonify(flashcard_doc), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# --- Existing Endpoints for Flashcards  ---

@app.route("/flashcards", methods=["GET"])
def get_flashcards():
    clerk_user_id = request.headers.get("X-Clerk-User-Id")
    if not clerk_user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        flashcard_docs = list(flashcards.find({"user_id": clerk_user_id}).sort("timestamp", -1))
        for fc in flashcard_docs:
            fc["_id"] = str(fc["_id"])
        return jsonify(flashcard_docs), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/flashcards/<flashcard_id>", methods=["GET"])
def get_flashcard(flashcard_id):
    clerk_user_id = request.headers.get("X-Clerk-User-Id")
    if not clerk_user_id:
        return jsonify({"error": "Unauthorized"}), 401
    try:
        flashcard_doc = flashcards.find_one({"_id": ObjectId(flashcard_id), "user_id": clerk_user_id})
        if not flashcard_doc:
            return jsonify({"error": "Flashcard not found"}), 404
        flashcard_doc["_id"] = str(flashcard_doc["_id"])
        return jsonify(flashcard_doc), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    # --- Endpoint to Generate Quiz from a Specific Note ---

@app.route("/notes/<note_id>/quiz", methods=["POST"])
def generate_quiz(note_id):
    clerk_user_id = request.headers.get("X-Clerk-User-Id")
    if not clerk_user_id:
        return jsonify({"error": "Unauthorized"}), 401

    # Retrieve the note from the database.
    try:
        note = notes.find_one({"_id": ObjectId(note_id), "user_id": clerk_user_id})
    except Exception as e:
        return jsonify({"error": "Invalid note ID"}), 400

    if not note:
        return jsonify({"error": "Note not found"}), 404

    note_content = note.get("content", "")
    note_title = note.get("title", "Note")

    prompt = (
        f"Generate a multiple choice quiz for the following note content in JSON format. "
        f"Each quiz question should be an object with the keys 'question', 'options' (an array), "
        f"and 'answer' (an integer index referring to the correct option). "
        f"Note content: {note_content}"
    )
    messages = [{"role": "user", "content": prompt}]

    try:
        completion = hf_client.chat.completions.create(
            model="meta-llama/Meta-Llama-3-8B-Instruct",
            messages=messages,
            max_tokens=500
        )
        ai_response = completion.choices[0].message["content"]

        print("Raw AI Response:", ai_response)  # Debug logging

        # Try to extract text inside code fences (optionally with "json" language tag).
        match = re.search(r"```(?:json)?(.*?)```", ai_response, re.DOTALL)
        if match:
            extracted = match.group(1).strip()
        else:
            extracted = ai_response.strip()

        print("Extracted content before repair:", extracted)

        # Instead of taking the substring between the first '[' and the last ']',
        # extract all complete JSON objects using regex.
        # This regex finds all instances of a JSON object (from '{' to the next '}').
        matches = re.findall(r'\{.*?\}', extracted, re.DOTALL)
        if not matches:
            return jsonify({
                "error": "Failed to extract valid JSON objects from the AI response.",
                "raw_response": ai_response
            }), 500

        # Reconstruct the JSON array from the complete objects.
        repaired_json_str = '[' + ','.join(matches) + ']'
        print("Repaired JSON string:", repaired_json_str)

        try:
            quiz_list = json.loads(repaired_json_str)
        except Exception as parse_error:
            print("Error parsing repaired JSON:", parse_error)
            return jsonify({
                "error": "Failed to parse the repaired JSON output from the LLM.",
                "details": str(parse_error),
                "raw_response": ai_response
            }), 500

        quiz_doc = {
            "user_id": clerk_user_id,
            "note_id": note_id,
            "title": f"Quiz for {note_title}",
            "quiz": quiz_list,
            "timestamp": datetime.now()
        }

        result = quizzes.insert_one(quiz_doc)
        quiz_doc["_id"] = str(result.inserted_id)
        return jsonify(quiz_doc), 201

    except Exception as e:
        print("General error in quiz endpoint:", e)
        return jsonify({"error": str(e)}), 500

# --- Endpoint to Retrieve a Specific Quiz ---

@app.route("/quizzes/<quiz_id>", methods=["GET"])
def get_quiz(quiz_id):
    clerk_user_id = request.headers.get("X-Clerk-User-Id")
    if not clerk_user_id:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        quiz_doc = quizzes.find_one({"_id": ObjectId(quiz_id), "user_id": clerk_user_id})
        if not quiz_doc:
            return jsonify({"error": "Quiz not found"}), 404
        quiz_doc["_id"] = str(quiz_doc["_id"])
        return jsonify(quiz_doc), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 50

@app.route("/quizzes", methods=["GET"])
def get_quizzes():
    clerk_user_id = request.headers.get("X-Clerk-User-Id")
    if not clerk_user_id:
        return jsonify({"error": "Unauthorized"}), 401
    try:
        quiz_docs = list(quizzes.find({"user_id": clerk_user_id}).sort("timestamp", -1))
        for quiz in quiz_docs:
            quiz["_id"] = str(quiz["_id"])
        return jsonify(quiz_docs), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)