from django.urls import path
from .views import send_message, get_messages, get_conversations

urlpatterns = [
    path("send/", send_message, name="send_message"),
    path("messages/", get_messages, name="get_messages"),
    path("conversations/", get_conversations, name="get_conversations"),
]
