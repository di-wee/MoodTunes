from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import MoodSerializer, SubMoodSerializer
from .models import Mood, SubMoods
from rest_framework import status


class GetMoods(APIView):
    def get(self, request):
        moods = Mood.objects.all()
        serializer = MoodSerializer(moods, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetSubMoods(APIView):
    def get(self, request, mood_id=None):

        # checking if mood exists or mood_id is present
        if mood_id:
            submoods = SubMoods.object.filter(mood__id=mood_id)
            serializer = SubMoodSerializer(submoods, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Mood ID not provided or does not exists'}, status=status.HTTP_404_NOT_FOUND)
        
