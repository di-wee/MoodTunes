from django.conf import settings
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from .serializers import SpotifySongSerializer
from moods.models import Mood
from songs.models import Songs
from django.core.exceptions import ObjectDoesNotExist


# sorting songs to mood
def determine_mood(valence, energy, danceability):
    if 0.75 <= valence <= 1.0 and 0.5 <= energy <= 1.0 and 0.5 <= danceability <= 1.0:
        return "Happy"
    elif 0.4 <= valence <= 0.7 and 0.2 <= energy <= 0.5 and 0.2 <= danceability <= 0.5:
        return "Relaxed"
    elif 0.0 <= valence <= 0.4 and 0.0 <= energy <= 0.4 and 0.2 <= danceability <= 0.5:
        return "Sad"
    elif 0.2 <= valence <= 0.5 and 0.7 <= energy <= 1.0 and 0.4 <= danceability <= 0.7:
        return "Angry"
    else:
        return "Undefined"


class SpotifySongSearch(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        # fetching query 'track' param
        track = request.query_params.get('track', None)

        if not track:
            return Response({'error': 'Track name not provided or does not exists.'}, status=status.HTTP_404_NOT_FOUND)

        # initialize spotipy with authentication manager
        sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=settings.SPOTIPY_CLIENT_ID,
                                                                   client_secret=settings.SPOTIPY_CLIENT_SECRET))

        # spotify api call, searches song and fetches top 10 results.
        # to search for track to get ID that will allow me to access track audio features

        results = sp.search(q=track, limit=10)

        # one api call to get audio features
        track_ids = [track['id'] for track in results['tracks']['items']]
        audio_features_list = sp.audio_features(track_ids)

        tracks = []

        combined_track_audio_features = zip(results['tracks']['items'], audio_features_list)
        for track, audio_features in combined_track_audio_features:
            mood_name = determine_mood(audio_features['valence'], audio_features['energy'],
                                       audio_features['danceability'])

            try:
                # retrieving mood of song
                song_to_mood = Mood.objects.get(name=mood_name)
            except ObjectDoesNotExist:
                return Response({'error': f'Mood {mood_name} not found in the database.'},
                                status=status.HTTP_404_NOT_FOUND)

            # finding an instance of the songs model via spotify_id;
            # checking if song already exists in db
            # song refer to retrieved or newly created object
            # created is a boolean to check if song is true or false

            song, created = Songs.object.get_or_created(
                spotify_id=track['id'],
                defaults={
                    'name': track['name'],
                    'artist': track['artists'][0]['name'],
                    'mood': song_to_mood,
                    'uri': track['uri'],  # for playback
                }
            )

            song_data = {
                'id': track['id'],
                'name': track['name'],
                'artist': track['artists'][0]['name'],
                'valence': audio_features['valence'],
                'energy': audio_features['energy'],
                'danceability': audio_features['danceability'],
                'uri': track['uri'],
            }
            tracks.append(song_data)

        serializer = SpotifySongSerializer(tracks, many=True)
        return Response(serializer.data)
