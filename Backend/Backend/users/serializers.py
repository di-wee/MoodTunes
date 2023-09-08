from rest_framework import serializers
from .models import CustomUser
from allauth.socialaccount.models import SocialAccount


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'


class SocialAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialAccount
        fields = '__all__'
