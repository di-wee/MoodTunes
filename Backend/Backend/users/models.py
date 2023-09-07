from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    spotify_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    spotify_display_name = models.CharField(max_length=255, null=True, blank=True)
