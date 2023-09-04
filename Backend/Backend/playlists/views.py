from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import PlaylistSerializer
from .models import Playlist
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from songs.models import Songs
from django.core.exceptions import ObjectDoesNotExist


class CreatePlaylist(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PlaylistSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
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
            return Response({'msg': 'Song added to playlist'}, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response({'error': 'Playlist or Song not found'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500)
