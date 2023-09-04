from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from allauth.socialaccount.providers.oauth2.client import OAuth2Error
from allauth.socialaccount.models import SocialApp, SocialToken
from django.shortcuts import get_object_or_404
from rest_framework import status


class GetRoles(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.user.groups.filter(name='Admins').exists():
            return Response({'role': 'admin'})
        else:
            return Response({'role': 'user'})


class RefreshSpotifyToken(APIView):
    def post(self, request):
        user = request.user
        try:
            app = SocialApp.objects.get(provider="spotify")
            token = get_object_or_404(SocialToken, app=app, account__user=user)
            if token.token_expired():
                token = token.app.get_access_token(token.token)
            return Response({'access_token': token.token})
        except OAuth2Error as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)


class GetSpotifyToken(APIView):
    def get(self, request):
        user = request.user

        if not user.is_authenticated:
            return Response({'error': 'User is not authenticated'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            app = SocialApp.objects.get(provider='spotify')
            token = get_object_or_404(SocialToken, app=app, account__user=user)

            if token.token_expired():
                token.app.get_access_token(token.token)
            return Response({"access_token": token.token})
        except SocialToken.DoesNotExist:
            return Response({"error": "Spotify token not found for user"}, status=status.HTTP_404_NOT_FOUND)

