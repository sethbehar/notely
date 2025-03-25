from huggingface_hub import InferenceClient
from dotenv import load_dotenv
import os
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
conversations = db.conversations  
notes = db.notes

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



if __name__ == "__main__":
    app.run(debug=True, port=5000)