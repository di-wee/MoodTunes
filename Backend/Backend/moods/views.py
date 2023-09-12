from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import MoodSerializer, SubMoodSerializer
from .models import Mood, SubMoods
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from songs.models import Songs
from playlists.models import Playlist
from songs.serializers import DatabaseSongSerializer


class GetMoods(APIView):
    def get(self, request):
        moods = Mood.objects.all()
        serializer = MoodSerializer(moods, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateMoods(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        name = request.data.get('name')
        try:
            mood = Mood.objects.create(name=name)
            return Response({'message': 'Mood created successfully.'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
            serializer = DatabaseSongSerializer(songs, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Mood.DoesNotExist:
            return Response({"error": "Mood does not exist"}, status=status.HTTP_404_NOT_FOUND)
