from apps.user.serializers import AddressSerializer
from rest_framework import serializers

from .models import LodgingTransaction
from apps.user.serializers import UserSerializer

class TransactionSerializer(serializers.ModelSerializer):
    lodging = serializers.SerializerMethodField()

    @staticmethod
    def get_lodging(transaction):
        lodging = transaction.lodging
        return {
            'posted_by': UserSerializer(lodging.posted_by).data,
            'reference': lodging.reference,
            'address': AddressSerializer(lodging.address).data,
            'bookedBy': UserSerializer(lodging.bookedBy).data,
            'id': lodging.id
        }

    class Meta:
        model = LodgingTransaction
        fields = (
            'status',
            'amount',
            'lodging',
            'created_at',
            'updated_at',
            'reason',
            'trans_id'
        )