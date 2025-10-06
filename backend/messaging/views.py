from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from datetime import datetime
from .serializer import ConversationSerializer
from .tinydb_store import *
from .models import Conversation
from .mistral_functions import get_title

# Create your views here.

@permission_classes([IsAuthenticated])
@api_view(["POST"])
def send_message(request):
    conversation_id = request.data.get("conversation_id")
    text = request.data.get("text")
    user_id = request.user.id
    if not text:
        return Response({"error": "Text is required"}, status=400)
    
    if conversation_id is None:
        try:
            title = get_title(text)
            conversation_id = MessageStore.create_conversation(user_id, title=title)

        except Exception as e:
            return Response({"error": str(e)}, status=500)

    else:
        conversation = Conversation.objects.filter(id=conversation_id, user_id=user_id).first()
        if conversation is None:
            return Response({"error": "Conversation not found for the user"}, status=404)

        conversation_json = MessageStore.get_conversation(conversation_id)
        if conversation_json is None:
            return Response({"error": "Conversation not found for the user"}, status=404)

    response_message = MessageStore.add_message(conversation_id, text)
    return Response({
        "message": "Message sent successfully", 
        "content": response_message, 
        "conversation_id": conversation_id,
        "timestamp": datetime.now().isoformat()
    }, status=201)

@permission_classes([IsAuthenticated])
@api_view(["GET"])
def get_messages(request):
    conversation_id = request.query_params.get("conversation_id")
    user_id = request.user.id
    
    if not conversation_id:
        return Response({"error": "Conversation ID is required"}, status=400)
    conversation = Conversation.objects.filter(id=conversation_id, user_id=user_id).first()
    
    if conversation is None:
        return Response({"error": "Conversation not found for the user"}, status=404)
    
    # Get messages from TinyDB using your method
    messages = MessageStore.get_messages(int(conversation_id))
    
    if messages is None:
        messages = []
    
    return Response({"conversation_id": conversation_id, "messages": messages}, status=200)

@permission_classes([IsAuthenticated])
@api_view(["GET"])
def get_conversations(request):
    user_id = request.user.id
    conversations = Conversation.objects.filter(user_id=user_id).order_by('-updated_at')
    serializer = ConversationSerializer(conversations, many=True)
    return Response({"conversations": serializer.data}, status=200)