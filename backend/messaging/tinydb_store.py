from tinydb import TinyDB, Query
from datetime import datetime
from .models import Conversation
from .mistral_functions import *

db = TinyDB('appdata.json')

conversations_table = db.table('conversations')
messages_table = db.table('messages')

class MessageStore:
    @staticmethod
    def get_conversations_by_user(user_id):
        # Retrieve all conversations for a specific user.
        q = Query()
        return conversations_table.search(q.user_id == user_id)

    @staticmethod
    def get_conversation(conversation_id):
        # Retrieve a specific conversation by its ID.
        q = Query()
        conversation = conversations_table.get(q.conversation_id == conversation_id)
        return conversation

    @staticmethod
    def create_conversation(user_id, title="New Chat"):
        # Create a new conversation and return its ID.
        conversation = Conversation.objects.create(title=title, user_id=user_id)
        conversation_id = conversation.id
        created_at = conversation.created_at.isoformat()
        conversation_json = {
            "conversation_id": conversation_id,
            "title": title,
            "user_id": user_id,
            "messages": [],
            "created_at": created_at
        }
        conversations_table.insert(conversation_json)
        return conversation_id

    @staticmethod
    def add_message(conversation_id, text, sender="user", title="New Chat", user_id=None):

        # Add a message to a conversation. If the conversation doesn't exist it will be created first.
        q = Query()
        try:
            conversation = Conversation.objects.filter(id=conversation_id).first()
            conversation_json = conversations_table.get(q.conversation_id == conversation_id)
            messages = conversation_json.get("messages", []) if conversation_json else []
        except Conversation.DoesNotExist:
            return None
        
        message = {
            "role": sender,"content": text, "timestamp": datetime.now().isoformat()
        }

        # Append
        messages.append(message)
        messages_no_date = [{"role": m["role"], "content": m["content"]} for m in messages if "role" in m and "content" in m]
        send_message_response, response_timestamp = send_message(messages_no_date)
        messages.append({"role": "assistant", "content": send_message_response, "timestamp": response_timestamp})

        conversations_table.update({"messages": messages}, q.conversation_id == conversation_id)
        return send_message_response

    @staticmethod
    def get_messages(conversation_id):
        
        # Retrieve all messages for a specific conversation.
        q = Query()
        conversation = conversations_table.get(q.conversation_id == conversation_id)
        return conversation.get("messages", []) if conversation else []
