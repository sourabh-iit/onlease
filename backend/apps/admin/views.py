from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from apps.lodging.models import Lodging
from .serializers import LodgingSerializer


class MapLodgingListHandler(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        lodging = Lodging.objects.filter(~Q(latlng=""))
        return Response(LodgingSerializer(lodging, many=True).data)