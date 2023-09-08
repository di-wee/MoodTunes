from rest_framework import serializers

class SpotifySongSerializer(serializers.Serializer):
    name = serializers.CharField()
    artist = serializers.CharField()
    valence = serializers.FloatField()
    energy = serializers.FloatField()
    danceability = serializers.FloatField()
