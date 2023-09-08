from django.contrib import admin
from .models import Songs
from spotipy.oauth2 import SpotifyClientCredentials
import spotipy
from django.conf import settings
from moods.models import Mood
from django.core.exceptions import ObjectDoesNotExist


def determine_mood(valence, energy, danceability):
    if 0.7 <= valence and 0.4 <= energy and 0.4 <= danceability:
        return "Happy"
    elif valence < 0.35 and energy < 0.5:
        return "Sad"
    elif valence <= 0.45 and 0.65 <= energy and danceability <= 0.45:
        return "Angry"
    elif 0.35 <= valence <= 0.65 and energy <= 0.35 and danceability <= 0.45:
        return "Relaxed"
    elif energy >= 0.75 and danceability >= 0.75:
        return "Energetic"
    elif valence <= 0.4 and energy >= 0.65:
        return "Intense"
    else:
        return "Neutral"


class SongsAdmin(admin.ModelAdmin):
    change_list_template = 'admin/songs/songs/change_list.html'

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}

        if 'track' in request.GET:
            track = request.GET.get('track')
            sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=settings.SPOTIPY_CLIENT_ID,
                                                                       client_secret=settings.SPOTIPY_CLIENT_SECRET))
            results = sp.search(q=track, limit=10)
            track_ids = [track['id'] for track in results['tracks']['items']]
            audio_features_list = sp.audio_features(track_ids)
            tracks = []
            combined_track_audio_features = zip(results['tracks']['items'], audio_features_list)

            for track, audio_features in combined_track_audio_features:
                mood_name = determine_mood(audio_features['valence'], audio_features['energy'],
                                           audio_features['danceability'])
                try:
                    song_to_mood = Mood.objects.get(name=mood_name)
                except ObjectDoesNotExist:
                    extra_context['error'] = f'Mood {mood_name} not found in the database.'
                    continue

                song, created = Songs.objects.get_or_create(
                    spotify_id=track['id'],
                    defaults={
                        'name': track['name'],
                        'artist': track['artists'][0]['name'],
                        'mood': song_to_mood,
                        'uri': track['uri'],
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

            extra_context['searched_songs'] = tracks

        return super().changelist_view(request, extra_context=extra_context)


admin.site.register(Songs, SongsAdmin)
