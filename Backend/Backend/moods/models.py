from django.db import models


class Mood(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class SubMoods(models.Model):
    submood_name = models.CharField(max_length=100)
    mood = models.ForeignKey(Mood, on_delete=models.CASCADE, related_name='submoods')

    def __str__(self):
        return self.submood_name
