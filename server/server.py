from huggingface_hub import InferenceClient
from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Allows frontend to call this API

# Initialize HuggingFace client
hf_client = InferenceClient(api_key=os.getenv("MOSS_KEY"))

# Initialize MongoDB client
mongo_client = MongoClient(os.getenv("MONGODB_URI"))
db = mongo_client.chat_history  # database name
conversations = db.conversations  # collection name

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    conversation_id = data.get("conversationId")
    
    messages = [
        {"role": "user", "content": user_message}
    ]

    try:
        # Get AI response
        completion = hf_client.chat.completions.create(
            model="meta-llama/Meta-Llama-3-8B-Instruct", 
            messages=messages, 
            max_tokens=500
        )
        ai_response = completion.choices[0].message["content"]
        
        # Store the conversation
        conversation = {
            "user_message": user_message,
            "ai_response": ai_response,
            "timestamp": datetime.utcnow(),
            "conversation_id": conversation_id
        }
        
        conversations.insert_one(conversation)
        
        return jsonify({
            "response": ai_response,
            "conversationId": conversation_id
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/conversations", methods=["GET"])
def get_conversations():
    try:
        # Get all conversations, sorted by timestamp
        all_conversations = list(conversations.find({}, {'_id': {'$toString': '$_id'}}))
        return jsonify(all_conversations)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/conversation/<conversation_id>", methods=["GET"])
def get_conversation(conversation_id):
    try:
        # Get all messages in a specific conversation
        conversation_messages = list(conversations.find(
            {"conversation_id": conversation_id},
            {'_id': {'$toString': '$_id'}}
        ).sort("timestamp", 1))
        
        if not conversation_messages:
            return jsonify({"error": "Conversation not found"}), 404
            
        return jsonify(conversation_messages)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/conversation/<conversation_id>", methods=["DELETE"])
def delete_conversation(conversation_id):
    try:
        result = conversations.delete_many({"conversation_id": conversation_id})
        if result.deleted_count > 0:
            return jsonify({"message": f"Deleted {result.deleted_count} messages"})
        return jsonify({"error": "Conversation not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)