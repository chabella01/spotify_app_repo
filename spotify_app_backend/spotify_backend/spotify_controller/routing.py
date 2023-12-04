from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path, re_path
from spotify_controller.consumers import RoomConsumer
from spotify_backend.wsgi import *

websocket_urlpatterns = [
    re_path(r"ws/room/(?P<room_name>\w+)/(?P<user_id>\w+)$", RoomConsumer.as_asgi())
]
