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


class PlayTrack(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        uri = request.data.get('uri', None)
        device_id = request.data.get('device_id', None)

        user_social_account = SocialAccount.objects.get(user_id=request.user.id, provider='spotify')
        token_obj = SocialToken.objects.get(account=user_social_account)

        sp = spotipy.Spotify(auth=token_obj.token)

        try:
            if uri:
                # check if the player is paused
                player_state = sp.current_playback()
                if player_state and player_state['is_playing'] is False:
                    # position_ms is where it was paused
                    sp.start_playback(device_id=device_id, uris=[uri], position_ms=player_state['progress_ms'])
                else:
                    sp.start_playback(device_id=device_id, uris=[uri])

                return Response({'msg': 'Playback started for the track!'}, status=status.HTTP_200_OK)
            else:
                # Check if the player is paused, and if so, resume playback
                player_state = sp.current_playback()
                if player_state and player_state['is_playing'] is False:
                    sp.start_playback(device_id=device_id, position_ms=player_state['progress_ms'])
                    return Response({'msg': 'Playback resumed from a paused state!'}, status=status.HTTP_200_OK)
                else:
                    sp.start_playback(device_id=device_id)
                    return Response({'msg': 'Playback started for the track!'}, status=status.HTTP_200_OK)

        except spotipy.SpotifyException as sp_error:
            return Response({'error': str(sp_error)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PlaySongFromPlaylist(APIView):
    def post(self, request):
        playlist_uri = request.data.get('playlist_uri', None)
        device_id = request.data.get('device_id', None)
        user_social_account = SocialAccount.objects.get(user_id=request.user.id, provider='spotify')
        token_obj = SocialToken.objects.get(account=user_social_account)

        sp = spotipy.Spotify(auth=token_obj.token)

        try:
            if not playlist_uri:
                # Check if the player is paused
                player_state = sp.current_playback()
                if player_state and player_state['is_playing'] is False:
                    sp.start_playback(device_id=device_id, position_ms=player_state['progress_ms'])
                else:
                    sp.start_playback(device_id=device_id)

                return Response({'msg': 'Resumed playback!'}, status=status.HTTP_200_OK)

            elif playlist_uri:
                sp.start_playback(device_id=device_id, context_uri=playlist_uri)
                return Response({'msg': 'Playback started for the playlist!'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Playlist URI is required'}, status=status.HTTP_400_BAD_REQUEST)
        except spotipy.SpotifyException as sp_error:
            return Response({'error': str(sp_error)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class Pause(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        device_id = request.data.get('device_id', None)  # get device_id from request

        user_social_account = SocialAccount.objects.get(user_id=request.user.id, provider='spotify')
        token_obj = SocialToken.objects.get(account=user_social_account)
        sp = spotipy.Spotify(auth=token_obj.token)
        try:
            sp.pause_playback(device_id=device_id)
            return Response({'msg': 'Playback is paused.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class Next(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        device_id = request.data.get('device_id', None)  # get device_id from request

        user_social_account = SocialAccount.objects.get(user_id=request.user.id, provider='spotify')
        token_obj = SocialToken.objects.get(account=user_social_account)
        sp = spotipy.Spotify(auth=token_obj.token)
        try:
            sp.next_track(device_id=device_id)
            return Response({'msg': 'Next track'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class Previous(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        device_id = request.data.get('device_id', None)  # get device_id from request

        user_social_account = SocialAccount.objects.get(user_id=request.user.id, provider='spotify')
        token_obj = SocialToken.objects.get(account=user_social_account)
        sp = spotipy.Spotify(auth=token_obj.token)
        try:
            sp.previous_track(device_id=device_id)
            return Response({'msg': 'Previous track'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
