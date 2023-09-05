from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import PlaylistSerializer
from .models import Playlist
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from songs.models import Songs
from django.core.exceptions import ObjectDoesNotExist
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from django.conf import settings

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id=settings.SPOTIPY_CLIENT_ID,
    client_secret=settings.SPOTIPY_CLIENT_SECRET,
    redirect_uri=settings.SPOTIPY_REDIRECT_URI))


class CreatePlaylist(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PlaylistSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            spotify_playlist = sp.user_playlist_create(request.user.username, serializer.data['name']) # passing Spotify username and the name of the playlist to get info of playlist
            playlist = Playlist.objects.get(pk=serializer.data['id'])  # getting my og playlist not spotify
            playlist.spotify_uri = spotify_playlist['uri']  # updating spotify_uri field for playlist with data retrieved
            playlist.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Error creating playlist'}, status=status.HTTP_400_BAD_REQUEST)


class GetAllPlaylist(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        playlists = Playlist.objects.filter(user=request.user)
        if playlists.exists():
            serializer = PlaylistSerializer(playlists, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Playlist not found'}, status=status.HTTP_404_NOT_FOUND)


class GetPlaylist(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, playlist_id):

        # similar to try catch
        try:
            playlist = Playlist.objects.get(id=playlist_id, user=request.user)
            serializer = PlaylistSerializer(playlist)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # if !playlist it will return objectdoesnotexist

        except ObjectDoesNotExist:
            return Response({'error': 'Error retrieving playlist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AddSongToPlaylist(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, playlist_id):
        song_id = request.data.get('song_id')

        try:
            playlist = Playlist.objects.get(pk=playlist_id)
            song = Songs.objects.get(pk=song_id)
            playlist.song.add(song)

            sp.playlist_add_items(playlist.spotify_uri, [song.uri])  # add songs into user's spotify account

            return Response({'msg': 'Song added to playlist'}, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response({'error': 'Playlist or Song not found'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500)