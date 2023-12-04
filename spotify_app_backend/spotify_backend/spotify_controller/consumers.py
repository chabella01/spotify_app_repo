import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from .models import Message
from .models import SessionRoom
from django.core import serializers


class RoomConsumer(AsyncWebsocketConsumer):
    @database_sync_to_async
    def create_chat(self, msg, sender):
        return Message.objects.create(sender=sender, message=msg)

    @database_sync_to_async
    def get_room_host(self, name):
        try:
            room = SessionRoom.objects.get(name=name)
            return room.host
        except SessionRoom.DoesNotExist:
            return None


    @database_sync_to_async
    def create_or_join_room(self, user_id, room_name):
        room = SessionRoom.objects.filter(name=room_name).first()
        User = get_user_model()
        user = None
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            print('user does not exist')
        if room is None:
            new_room = SessionRoom.objects.create(
                name=room_name,
                host=user
            )
            new_room.users.add(user)
            return new_room
        else:
            room.users.add(user)
            return room

    @database_sync_to_async
    def get_messages_for_room(self, room_name):
        messages = Message.objects.filter(room_name=room_name)
        message_data = serializers.serialize("json", messages)
        return message_data


    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.messages = await self.get_messages_for_room(self.room_name)

        self.room_group_name = 'chat_%s' % self.room_name
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        await self.create_or_join_room(self.user_id, self.room_name)
        self.host = await self.get_room_host(self.room_name)
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        await self.send(text_data=json.dumps({
                    'host': self.host.username,
                    'room_name': self.room_name,
                    'past_messages': self.messages
                }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(text_data)
        if 'uri' in text_data_json:
            uri = text_data_json['uri']
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'uri',
                'uri': uri
            })
            print(uri)
            return
        message = text_data_json['message']
        sender = text_data_json['sender']
        new_msg = await self.create_chat(message, sender)
        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'chat_message',
            'message': message,
            'sender': sender
        })
#
    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']
        new_msg = await self.create_chat(message, sender)  # Pass arguments without explicit names
        await self.send(text_data=json.dumps({
            'message': new_msg.message,
            'sender': new_msg.sender,
        }))

    async def uri(self, event):
        uri = event['uri']
#         new_msg = await self.create_chat(message, sender)  # Pass arguments without explicit names
        await self.send(text_data=json.dumps({
            'uri': uri
        }))
