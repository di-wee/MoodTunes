from rest_framework import serializers
from .models import CustomUser
from allauth.socialaccount.models import SocialAccount
import json


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

# this essentially converts a string of object into an object for one of my table data that is inbuilt
class SocialAccountSerializer(serializers.ModelSerializer):
    # to_representation defines output; trying to override method for custom output
    def to_representation(self, instance):
        # calling for original behavior of the to_representation method
        representation = super().to_representation(instance)
        try:
            # convert string in 'extra_dat' property to an object/dictionary
            representation['extra_data'] = convert_python_to_json(instance.extra_data)
        except ValueError:
            print("Failed to convert:", instance.extra_data)
            representation['extra_data'] = {}
        return representation

    class Meta:
        model = SocialAccount
        fields = '__all__'


def convert_python_to_json(data):

    # if the instance of the data is not a dictionary/object to return empty {}
    if not isinstance(data, dict):
        return {}

    # looping through the object and replacing Python None with JSON null
    for key, value in data.items():
        if value is None:
            data[key] = None
            # check to handle nested dictionary
        elif isinstance(value, dict):
            data[key] = convert_python_to_json(value)

    return data
