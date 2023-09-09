from rest_framework import serializers
from .models import Mood, SubMoods


class MoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mood
        fields = '__all__'


class SubMoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubMoods
        fields = ('id', 'submood_name')
