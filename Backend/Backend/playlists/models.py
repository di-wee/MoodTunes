from django.contrib.auth.models import User
from django.db import models
from songs.models import Songs



class Playlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_playlist')
    name = models.CharField(max_length=100)
    song = models.ManyToManyField(Songs, related_name='playlists', blank=True)  # one song can be in multiple playlists, multiple playlists can have multiple songs.
    spotify_uri = models.CharField(max_length=255, null=True, blank=True)  # for spotify playlist playback

    def __str__(self):
        return self.name
