from django.forms import fields
from rest_framework import serializers
from .models import ProfileImage, User, MobileNumber, Agreement, AgreementPoint

class MobileNumberSerializer(serializers.ModelSerializer):
  class Meta:
    model = MobileNumber
    fields = ('id','value','is_verified')


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

  class Meta:
    model = User
    fields = (
      'mobile_number',
      'email',
      'first_name',
      'last_name',
      'is_verified',
      'gender',
      'created_at',
      'updated_at',
      'image',
      'mobile_numbers',
      'favorite_properties',
      'agreements'
    )
