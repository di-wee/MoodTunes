from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from django.conf import settings

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id=settings.SPOTIPY_CLIENT_ID,
    client_secret=settings.SPOTIPY_CLIENT_SECRET,
    redirect_uri=settings.SPOTIPY_REDIRECT_URI))


class Play(APIView):
    def post(self, request):
        track_uri = request.data.get('track_uri', None)
        try:
            if track_uri:
                sp.start_playback(uris=[track_uri])  # playback via song in req body
            else:
                sp.start_playback()
            return Response({'msg': 'Playback started!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class Pause(APIView):
    def post(self, request):
        track_uri = request.data.get('track_uri', None)
        try:
            if track_uri:
                sp.pause_playback(track_uri)
            else:
                sp.pause_playback()
            return Response({'msg': 'Playback is paused.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class Next(APIView):
    def post(self, request):
        track_uri = request.data.get('track_uri', None)
        try:
            if track_uri:
                sp.next_track(track_uri)
            else:
                sp.next_track()
            return Response({'msg': 'Next track'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class Previous(APIView):
    def post(self, request):
        try:
            sp.previous_track()
            return Response({'msg': 'Next track'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
