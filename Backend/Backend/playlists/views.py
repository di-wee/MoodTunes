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
from allauth.socialaccount.models import SocialAccount, SocialToken


class CreatePlaylist(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_social_account = SocialAccount.objects.get(user_id=request.user.id, provider='spotify')
        token_obj = SocialToken.objects.get(account=user_social_account)

        sp = spotipy.Spotify(auth=token_obj.token)

        data = {
            **request.data,
            'user': request.user.id
        }

        serializer = PlaylistSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            user = SocialAccount.objects.get(user_id=request.user.id)
            spotify_playlist = sp.user_playlist_create(user.uid, serializer.data['name'])
            playlist = Playlist.objects.get(pk=serializer.data['id'])
            playlist.spotify_uri = spotify_playlist['uri']
            playlist.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeletePlaylist(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, playlist_id):
        user_account = SocialAccount.objects.get(user_id=request.user.id, provider='spotify')
        token = SocialToken.objects.get(account=user_account)

        sp = spotipy.Spotify(auth=token.token)

        try:
            playlist = Playlist.objects.get(pk=playlist_id, user=request.user)

              # getting spotify playlist id
            spotify_playlist_id = playlist.spotify_uri.split(':')[-1]

            sp.current_user_unfollow_playlist(spotify_playlist_id)
            playlist.delete()

            return Response({'msg': 'Playlist deleted successfully'}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({'error': 'Playlist not found'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class GetAllPlaylist(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            playlists = Playlist.objects.filter(user=request.user)
            if playlists.exists():
                serializer = PlaylistSerializer(playlists, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Playlist not found'}, status=status.HTTP_404_NOT_FOUND)
        except Playlist.DoesNotExist as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)


class GetPlaylist(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, playlist_id):

        # similar to try catch
        try:
            playlist = Playlist.objects.get(id=playlist_id, user=request.user)
            serializer = PlaylistSerializer(playlist, many=True)
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

        user_social_account = SocialAccount.objects.get(user_id=request.user.id, provider='spotify')
        token_obj = SocialToken.objects.get(account=user_social_account)

        sp = spotipy.Spotify(auth=token_obj.token)

        try:
            playlist = Playlist.objects.get(pk=playlist_id)
            song = Songs.objects.get(pk=song_id)
            playlist.song.add(song)
            sp.playlist_add_items(playlist.spotify_uri, [song.uri])  # add songs into user's spotify account

            return Response({'msg': 'Song added to playlist'}, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response({'error': 'Playlist or Song not found'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
