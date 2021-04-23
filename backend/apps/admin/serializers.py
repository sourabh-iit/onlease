from rest_framework.serializers import ModelSerializer

from apps.lodging.models import Lodging


class LodgingSerializer(ModelSerializer):
    
    class Meta:
        model = Lodging
        fields = (
            'id',
            'address',
            'posted_at',
            'updated_at',
            'region',
            'lodging_type',
            'is_booked',
            'latlng',
            'isHidden'
        )