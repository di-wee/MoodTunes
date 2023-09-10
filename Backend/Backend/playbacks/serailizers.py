from rest_framework import serializers

class SpotifyTokenSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=355)
