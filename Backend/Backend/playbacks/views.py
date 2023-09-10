from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import spotipy
from .serailizers import SpotifyTokenSerializer
from allauth.socialaccount.models import SocialAccount, SocialToken


class GetSpotifyToken(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_social_account = SocialToken.objects.get(account__user=request.user, account__provider='spotify')
            token = user_social_account.token
            serializer = SpotifyTokenSerializer(data={"token": token})
            if serializer.is_valid():
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except SocialToken.DoesNotExist:
            return Response({"error": "Spotify token not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Play(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        uri = request.data.get('uri', None)  # getting uri from req.body
        uri_type = request.data.get('uri_type', 'track')  # if no uri_type specified, default will be 'track'

        # not declared globally in case multiple users use app at the same time
        user_social_account = SocialAccount.objects.get(user_id=request.user.id, provider='spotify')
        token_obj = SocialToken.objects.get(account=user_social_account)

        sp = spotipy.Spotify(auth=token_obj.token)
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
    permission_classes = [IsAuthenticated]

    def post(self, request):
        uri = request.data.get('uri', None)
        uri_type = request.data.get('uri_type', 'track')
        user_social_account = SocialAccount.objects.get(user_id=request.user.id, provider='spotify')
        token_obj = SocialToken.objects.get(account=user_social_account)

        sp = spotipy.Spotify(auth=token_obj.token)
        try:
            sp.pause_playback()
            return Response({'msg': 'Playback is paused.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class Next(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        uri = request.data.get('uri', None)
        uri_type = request.data.get('uri_type', 'tracks')
        user_social_account = SocialAccount.objects.get(user_id=request.user.id, provider='spotify')
        token_obj = SocialToken.objects.get(account=user_social_account)

        sp = spotipy.Spotify(auth=token_obj.token)
        try:
            sp.next_track()
            return Response({'msg': 'Next track'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class Previous(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        uri = request.data.get('uri', None)
        uri_type = request.data.get('uri_type', 'track')
        user_social_account = SocialAccount.objects.get(user_id=request.user.id, provider='spotify')
        token_obj = SocialToken.objects.get(account=user_social_account)

        sp = spotipy.Spotify(auth=token_obj.token)

        try:
            sp.previous_track()
            return Response({'msg': 'Previous track'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
