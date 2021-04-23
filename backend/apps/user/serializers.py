from django.forms import fields
from rest_framework import serializers

from .models import ProfileImage, User, MobileNumber, Agreement, AgreementPoint, Address
from apps.locations.serializers import RegionSerializer


class MobileNumberSerializer(serializers.ModelSerializer):
  class Meta:
    model = MobileNumber
    fields = ('id','value')


class AgreementPointSerializer(serializers.ModelSerializer):
  class Meta:
    model = AgreementPoint
    fields = ('id', 'text', 'updated_at')


class AgreementSerializer(serializers.ModelSerializer):
  points = AgreementPointSerializer(many=True)
  class Meta:
    model = Agreement
    fields = ('id', 'points', 'title')

class ImageSerializer(serializers.ModelSerializer):
  class Meta:
    model = ProfileImage
    fields = (
      'id',
      'file',
      'thumbnail',
      'created_at'
    )

class UserSerializer(serializers.ModelSerializer):
  mobile_numbers = MobileNumberSerializer(many=True)
  agreements = AgreementSerializer(many=True)
  image = ImageSerializer()
  favorites = serializers.SerializerMethodField()

  @staticmethod
  def get_favorites(user):
    return [lodging.id for lodging in user.favorite_properties.all()]

  class Meta:
    model = User
    fields = (
      'mobile_number',
      'email',
      'first_name',
      'last_name',
      'gender',
      'created_at',
      'updated_at',
      'image',
      'mobile_numbers',
      'agreements',
      'favorites',
      'user_type',
      'is_superuser'
    )

class AddressSerializer(serializers.ModelSerializer):
  region = RegionSerializer(required=False)
  region_id = serializers.IntegerField()

  def create(self, validated_data):
    user = self.context['user']
    return Address.objects.create(user=user, **validated_data)

  class Meta:
    model = Address
    fields = (
      'id',
      'region',
      'text',
      'region_id'
    )
