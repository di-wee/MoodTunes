from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from allauth.socialaccount.providers.oauth2.client import OAuth2Error
from allauth.socialaccount.models import SocialApp, SocialToken, SocialAccount
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSerializer


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


class GetUserJWT(APIView):
    def get(self, request):
        user = request.user
        print(user)
        # check that user is already authenticated with spotify before issuing jwt token
        spotify_acc = SocialAccount.objects.filter(user=user, provider='spotify').first()
        if not spotify_acc:
            return Response({"error": "User is not authenticated with Spotify."}, status=status.HTTP_403_FORBIDDEN)
        try:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return Response({'access_token': access_token}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetUserDetails(APIView):
    permission_classes = [IsAuthenticated]


    def post(self, request):
        try:
            user = request.user
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)


# for user updating their own details not for admin
class UpdateUserDetails(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            user = request.user
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
