from rest_framework import serializers
from .models import Mood, SubMoods


class MoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mood
        fields = ('id', 'name', 'submoods')


class SubMoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubMoods
        fields = ('id', 'submood_name')
