# Generated by Django 4.1.11 on 2023-12-01 00:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotify_controller', '0002_sessionroom_temp'),
    ]

    operations = [
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.CharField(max_length=255)),
                ('user', models.CharField(max_length=50)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
