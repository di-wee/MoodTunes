from django.db import models
from moods.models import Mood, SubMoods

class Songs(models.Model):
    spotify_id = models.CharField(max_length=100)
    mood = models.ForeignKey(Mood, on_delete=models.CASCADE)
    submoods = models.ForeignKey(SubMoods, on_delete=models.CASCADE)

