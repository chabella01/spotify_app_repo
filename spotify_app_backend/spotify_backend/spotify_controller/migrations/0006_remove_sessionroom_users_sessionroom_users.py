# Generated by Django 4.1.11 on 2023-12-01 19:52

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('spotify_controller', '0005_remove_sessionroom_users_sessionroom_users'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='sessionroom',
            name='users',
        ),
        migrations.AddField(
            model_name='sessionroom',
            name='users',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
    ]