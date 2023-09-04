from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from .serializers import SpotifySongSerializer


class SpotifySongSearch(APIView):
    def get(self, request):
        # fetching query 'track' param
        track = request.query_params.get('track', None)

        if not track:
            return Response({'error': 'Track name not provided or does not exists.'}, status=status.HTTP_404_NOT_FOUND)

        # initialize spotipy with authentication manager
        sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=settings.SPOTIPY_CLIENT_ID, client_secret=settings.SPOTIPY_CLIENT_SECRET))

        # spotify api call, searches song and fetches top 10 results.
        # to search for track to get ID that will allow me to access track audio features

        results = sp.search(q=track, limit=10)

        # one api call to get audio features
        track_ids = [track['id'] for track in results['tracks']['items']]
        audio_features_list = sp.audio_features(track_ids)

        tracks = []

        combined_track_audio_features = zip(results['tracks']['items'], audio_features_list)
        for track, audio_features in combined_track_audio_features:
            song_data = {
                'id': track['id'],
                'name': track['name'],
                'artist': track['artists'][0]['name'],
                'link': track['external_urls']['spotify'],
                'valence': audio_features['valence'],
                'energy': audio_features['energy'],
                'danceability': audio_features['danceability'],
            }
            tracks.append(song_data)

        serializer = SpotifySongSerializer(tracks, many=True)
        return Response(serializer.data)
