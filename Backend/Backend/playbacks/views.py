from rest_framework.permissions import IsAuthenticated
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
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        uri = request.data.get('uri', None)  # getting uri from req.body
        uri_type = request.data.get('uri_type', 'track')  # if no uri_type specified, default will be 'track'

        try:
            if uri:
                if uri_type == 'track':
                    sp.start_playback(uris=[uri])  # playback via uri stated in req.body
                elif uri_type == 'playlist':
                    sp.start_playback(context_uri=uri)
                else:
                    return Response({'error': 'Invalid URI type'}, status=status.HTTP_404_NOT_FOUND)
            else:
                sp.start_playback()
            return Response({'msg': 'Playback started!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class Pause(APIView):
    def post(self, request):
        uri = request.data.get('uri', None)
        uri_type = request.data.get('uri_type', 'track')
        try:
            if uri:
                if uri_type == 'track':
                    sp.pause_playback(uris=[uri])
                elif uri_type == 'playlist':
                    sp.pause_playback(context_uri=uri)
                else:
                    return Response({'error': 'Invalid URI type'}, status=status.HTTP_404_NOT_FOUND)
            else:
                sp.pause_playback()
                return Response({'msg': 'Playback is paused.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class Next(APIView):
    def post(self, request):
        uri = request.data.get('uri', None)
        uri_type = request.data.get('uri_type', 'tracks')

        try:
            if uri:
                if uri_type == 'track':
                    sp.next_track(uris=[uri])
                elif uri_type == 'playlist':
                    sp.next_track(context_uri=uri)
                else:
                    return Response({'error': 'Invalid URI type'}, status=status.HTTP_404_NOT_FOUND)
            else:
                sp.next_track()
                return Response({'msg': 'Next track'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class Previous(APIView):
    def post(self, request):
        uri = request.data.get('uri', None)
        uri_type = request.data.get('uri_type', 'track')

        try:
            if uri:
                if uri_type == 'track':
                    sp.previous_track(uris=[uri])
                elif uri_type == 'playlist':
                    sp.previous_track(context_uri=uri)
                else:
                    return Response({'error': 'Invalid URI type'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({'msg': 'Next track'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
