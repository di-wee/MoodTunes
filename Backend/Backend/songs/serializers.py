from rest_framework import serializers

class SpotifySongSerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    artist = serializers.CharField()
    link = serializers.URLField()
    valence = serializers.FloatField()
    energy = serializers.FloatField()
