from django.urls import re_path, path
from . import views
from django.conf.urls import include

urlpatterns = [
   re_path('login', views.login),
   re_path('register', views.register),
   re_path('test_token', views.test_token),
   re_path('get_auth_url', views.authorize_spotify),
   path('sessions/', include('spotify_controller.urls'))
]
