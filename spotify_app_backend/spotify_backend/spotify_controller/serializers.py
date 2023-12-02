from rest_framework import serializers
from .models import SessionRoom

class SessionRoomSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = SessionRoom
        fields = ('name', 'host')


class MessageSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = SessionRoom
        fields = ('message', 'user', 'users')