from django.urls import path
from django.conf.urls import include
from . import views

urlpatterns = [
    path('create-room/', views.create_room)
]
