from datetime import timedelta
from django.db import models
from users.models import CustomUser
from django.utils import timezone


class SpotifyToken(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    access_token = models.CharField(max_length=255)
