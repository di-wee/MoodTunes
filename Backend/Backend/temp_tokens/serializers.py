from .models import UserTempToken
from rest_framework import serializers


class TempTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTempToken
        fields = '__all__'
