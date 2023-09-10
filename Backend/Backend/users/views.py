from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from allauth.socialaccount.providers.oauth2.client import OAuth2Error
from allauth.socialaccount.models import SocialApp, SocialToken
from django.shortcuts import get_object_or_404
from rest_framework import status
from allauth.socialaccount.models import SocialAccount

from .serializers import UserSerializer, SocialAccountSerializer



class GetUserDetails(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            user = request.user
            social_account = SocialAccount.objects.get(user=user)
            serializer = SocialAccountSerializer(social_account)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)

