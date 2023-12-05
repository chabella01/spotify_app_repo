from rest_framework.decorators import api_view
from rest_framework.response import Response
from .credentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID
from .serializers import SessionRoomSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from requests import Request, post
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import SessionRoom

## create rooms here
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_room(request):
    # user will create a new room
        # returns the name of the room along with the host name
    if request.method == 'POST':
        user = request.user
        room_data = {
            'name': request.data.get('name'),
            'host': user.username
        }

        serializer = SessionRoomSerializer(data=room_data)
        if serializer.is_valid():
            session_room = serializer.save()
            session_room.users.add(user)
            session_room.save()
            return Response({"data":serializer.data, "session_id": session_room.session_id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def join_room(request):
    # here a user will join an already existing room
        # add user to the room and return the room and all of its data
    user = request.user
    if request.method == 'POST':
        if SessionRoom.objects.filter(session_id=request.state).exists():
            session = SessionRoom.objects.filter(session_id=request.state)
            session.users.add(user)
            session.save()
            return Response({"data":session.data, "session_id": session.session_id}, status=status.HTTP_202_ACCEPTED)
        return Response(session.errors, status=status.HTTP_400_BAD_REQUEST)