from django.db import models
from django.contrib.auth.models import User
import secrets
import string

def generate_random_id():
    letters = string.ascii_letters + string.digits
    rand_id = ''.join(secrets.choice(letters) for _ in range(10))
    return rand_id


class SessionRoom(models.Model):
    name = models.CharField(max_length=150)
    session_id = models.CharField(max_length=10, default=generate_random_id, unique=True)
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    users = models.ManyToManyField(User, related_name='rooms')
    current_song = models.CharField(max_length=50, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    temp = models.CharField(max_length=20, null=True)


class Message(models.Model):
    message = models.CharField(max_length=255)
    sender = models.CharField(max_length=50)
    date_created = models.DateTimeField(auto_now_add=True)