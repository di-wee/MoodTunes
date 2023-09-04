from django.contrib.auth.models import User
from django.db import models
from songs.models import Songs


class Playlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_playlists')
    name = models.CharField(max_length=100)
    song = models.ManyToManyField(Songs, related_name='playlists')
    #  one song can be in multiple playlists, multiple playlists can have multiple songs.

    def __str__(self):
        return self.name
