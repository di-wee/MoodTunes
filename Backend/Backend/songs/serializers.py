from rest_framework import serializers
from .models import Songs

class SpotifySongSerializer(serializers.Serializer):
    name = serializers.CharField()
    artist = serializers.CharField()
    valence = serializers.FloatField()
    energy = serializers.FloatField()
    danceability = serializers.FloatField()


class DatabaseSongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Songs
        fields = '__all__'
