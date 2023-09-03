from rest_framework import serializers

class SpotifySongSerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    artist = serializers.CharField()
