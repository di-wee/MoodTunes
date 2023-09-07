from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from .models import SpotifyToken
from users.models import CustomUser
from Backend.settings import SPOTIPY_CLIENT_ID, SPOTIPY_CLIENT_SECRET
from rest_framework_simplejwt.tokens import RefreshToken
import re



class ExtractCode(APIView):
    def get(self, request):
        full_url = request.build_absolute_uri()
        code_match = re.search(r"code=([^&]*)", full_url)
        if code_match:
            code = code_match.group(1)
            return Response({"code": code}, status=status.HTTP_200_OK)


        else:
            return Response({'error': 'code not found'}, status=status.HTTP_400_BAD_REQUEST)


class GetJwtToken(APIView):
    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({'error': 'code not found'}, status=status.HTTP_400_BAD_REQUEST)

        access_data = self.get_access_token(code)
        if 'access_token' not in access_data:
            return Response({"error": "error obtaining access token"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        spotify_user_data = self.get_spotify_user_data(access_data['access_token'])
        user, created = CustomUser.objects.get_or_create(spotify_id=spotify_user_data['id'])

        if created:
            user.spotify_display_name = spotify_user_data['display_name']
            user.save()

        spotify_token, _ = SpotifyToken.objects.get_or_create(user=user)
        spotify_token.access_token = access_data['access_token']
        spotify_token.save()

        jwt_token = self.generate_jwt_for_user(user)
        return Response({"token": jwt_token}, status=status.HTTP_200_OK)

    def get_access_token(self, code):
        token_url = "https://accounts.spotify.com/api/token"
        payload = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': 'http://localhost:8000/accounts/spotify/login/callback/',
            'client_id': SPOTIPY_CLIENT_ID,
            'client_secret': SPOTIPY_CLIENT_SECRET,
        }
        response = requests.post(token_url, data=payload)
        return response.json()

    def get_spotify_user_data(self, access_token):
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get("https://api.spotify.com/v1/me", headers=headers)
        return response.json()

    def generate_jwt_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)
