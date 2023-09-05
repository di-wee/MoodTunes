from rest_framework import serializers
from .models import CustomUser

class UserProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['profile_picture']
