from django.db import models
from moods.models import Mood, SubMoods


class Songs(models.Model):
    spotify_id = models.CharField(max_length=100)
    mood = models.ForeignKey(Mood, on_delete=models.CASCADE, related_name='songs')
    submoods = models.ForeignKey(SubMoods, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    uri = models.CharField(max_length=255)

    def __str__(self):
        return self.name
