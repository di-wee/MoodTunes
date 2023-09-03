from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


class GetRoles(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.user.groups.filter(name='Admins').exists():
            return Response({'role': 'admin'})
        else:
            return Response({'role': 'user'})


