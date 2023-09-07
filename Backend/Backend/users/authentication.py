from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import CustomUser
import requests

class SpotifyOAuthAuthentication(BaseAuthentication):

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            # split authorization header into token_type and token
            token_type, token = auth_header.split()

            #if token_type is not 'bearer' or header not split properly
            if token_type.lower() != "bearer":
                return None
        except ValueError:
            return None

        # if token is invalid = authenticationfailed
        if not self.verify_token_with_spotify(token):
            raise AuthenticationFailed('Invalid Spotify OAuth token.')

        # if token is valid creates or get user based on spotify data
        user = self.get_or_create_user_from_spotify(token)
        if not user:
            raise AuthenticationFailed('Unable to fetch or create user using Spotify data.')

        return user, None

    def verify_token_with_spotify(self, token):
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get("https://api.spotify.com/v1/me", headers=headers)
        return response.status_code == 200

    def get_or_create_user_from_spotify(self, token):
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get("https://api.spotify.com/v1/me", headers=headers)
        if response.status_code != 200:
            return None
        spotify_data = response.json()
        user, created = CustomUser.objects.get_or_create(
            spotify_id=spotify_data['id'],
            defaults={'username': spotify_data['display_name']}
        )
        return user
