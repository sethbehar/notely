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
mongo_client = MongoClient(os.getenv("MONGO_URI"))

db = mongo_client.chat_history  # database name
conversations = db.conversations  # collection name

conversation = {
    "user_id": "test-user",
    "conversation_id": str(ObjectId()),
    "user_message": "Hello",
    "ai_response": "Hi there!",
    "timestamp": datetime.now()
}

try:
    result = conversations.insert_one(conversation)
    print("Inserted document id:", result.inserted_id)
except Exception as e:
    print("Insert failed:", e)

@app.route("/chat", methods=["POST"])
def chat():
    # Extract the Clerk user ID from the request headers
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
        # Get AI response from HuggingFace
        print("Here")
        completion = hf_client.chat.completions.create(
            model="meta-llama/Meta-Llama-3-8B-Instruct", 
            messages=messages, 
            max_tokens=500
        )
        ai_response = completion.choices[0].message["content"]
        print(ai_response)
        
        # Build the conversation document including the Clerk user ID
        conversation = {
            "user_id": clerk_user_id,       # Associate conversation with this user
            "conversation_id": conversation_id,
            "user_message": user_message,
            "ai_response": ai_response,
            "timestamp": datetime.now()
        }
        
        print("Conversation doc:", conversation) 
        # Save the conversation to MongoDB
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
        # Get all conversations for the current user, sorted by timestamp
        user_conversations = list(conversations.find(
            {"user_id": clerk_user_id}
        ).sort("timestamp", -1))
        
        # Convert MongoDB ObjectIDs to strings for the client
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
        # Get all messages in a specific conversation that belong to this user
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


if __name__ == "__main__":
    app.run(debug=True, port=5000)