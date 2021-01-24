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
            'address': lodging.address
        }

    class Meta:
        model = LodgingTransaction
        fields = (
            'status',
            'amount',
            'lodging',
            'owner',
            'created_at',
            'updated_at',
            'reason',
            'trans_id'
        )