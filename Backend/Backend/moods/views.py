from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import MoodSerializer, SubMoodSerializer
from .models import Mood, SubMoods
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from songs.models import Songs

from songs.serializers import DatabaseSongSerializer


class GetMoods(APIView):
    def get(self, request):
        moods = Mood.objects.all()
        serializer = MoodSerializer(moods, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateMoods(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):

        # de-serializing JSON into data for python
        serializer = MoodSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Unable to create mood.'}, status=status.HTTP_400_BAD_REQUEST)


class GetSubMoods(APIView):
    def get(self, request, mood_id=None):

        # checking if mood exists or mood_id is present
        if mood_id:
            submoods = SubMoods.object.filter(mood__id=mood_id)
            serializer = SubMoodSerializer(submoods, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Mood ID not provided or does not exists'}, status=status.HTTP_404_NOT_FOUND)


class CreateSubMoods(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = SubMoodSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Unable to create sub-mood.'}, status=status.HTTP_400_BAD_REQUEST)




class GetSongsFromMood(APIView):

    permission_classes = [IsAuthenticated]
    def get(self, request, mood):
        mood_to_filter = mood

        if not mood_to_filter:
            return Response({"error": "Mood not provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            mood = Mood.objects.get(name=mood_to_filter)
            songs = Songs.objects.filter(mood=mood)
            song_list = [
                {'name': song.name,
                 'artist': song.artist,
                 'uri': song.uri} for song in songs
            ]
            serializer = DatabaseSongSerializer(song_list, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Mood.DoesNotExist:
            return Response({"error": "Mood does not exist"}, status=status.HTTP_404_NOT_FOUND)
