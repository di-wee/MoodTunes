
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserTempToken
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import TempTokenSerializer
from allauth.socialaccount.models import SocialAccount



class ExchangeTempTokenForJWT(APIView):
    def post(self, request):
        temp_token = request.data.get('temp_token')
        try:
            temp_token_obj = UserTempToken.objects.get(temp_token=temp_token)
            jwt_token = get_jwt(temp_token_obj.user)
            return Response({"token": jwt_token}, status=status.HTTP_200_OK)
        except UserTempToken.DoesNotExist:
            return Response({'error': 'Invalid temporary token.'}, status=status.HTTP_400_BAD_REQUEST)


def get_jwt(user):
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)


class GetTempTokenByIdentifier(APIView):
    def post(self, request):
        username = request.data.get('username')
        print(username)
        try:
            social_account = SocialAccount.objects.get(uid=username)
            user = social_account.user
            temp_token = UserTempToken.objects.get(user=user)
            serializer = TempTokenSerializer(temp_token)
            print(temp_token)
            return Response({"temptoken": serializer.data}, status=status.HTTP_200_OK)
        except (SocialAccount.DoesNotExist, UserTempToken.DoesNotExist):
            return Response({'error': 'User or temp token not found.'}, status=status.HTTP_404_NOT_FOUND)



