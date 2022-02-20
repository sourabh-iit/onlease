from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Lodging, Charge, LodgingImage, LodgingVRImage
from apps.user.serializers import UserSerializer, AgreementSerializer, AddressSerializer
from .utils import clean_data

from datetime import datetime
import json


class ChargeSerializer(serializers.ModelSerializer):
  class Meta:
    model = Charge
    fields = (
      'id',
      'amount',
      'description',
      'is_per_month'
    )
    read_only_fields = ('id',)

  def validate_description(self, value):
    return clean_data(value)
  
  def create(self, validated_data):
    return Charge.objects.create(lodging=self.context['lodging'], **validated_data)

  def update(self, instance, validated_data):
    for key in validated_data:
      setattr(instance, key, validated_data[key])
    instance.lodging = self.context['lodging']
    return instance.save()

class ImageSerializer(serializers.ModelSerializer):
  class Meta:
    model = LodgingImage
    fields = (
      'id',
      'image',
      'image_mobile',
      'image_thumbnail',
      'created_at',
      'tag',
      'tag_other'
    )

class VRImageSerializer(serializers.ModelSerializer):
  class Meta:
    model = LodgingVRImage
    fields = (
      'id',
      'image',
      'image_thumbnail',
      'created_at'
    )

class LodgingSerializer(serializers.ModelSerializer):
  images = serializers.SerializerMethodField()
  vrimages = serializers.SerializerMethodField()
  lodging_type = serializers.ChoiceField(choices=Lodging.RESIDENTIAL_CHOICES)
  flooring = serializers.ChoiceField(choices=Lodging.FLOORING_CHOICES)
  agreement_id = serializers.IntegerField(required=False)
  agreement = AgreementSerializer(required=False)
  address_id = serializers.IntegerField()
  address = AddressSerializer(required=False)
  charges = ChargeSerializer(many=True)

  @staticmethod
  def get_images(lodging):
    return ImageSerializer(lodging.images.all(), many=True).data

  @staticmethod
  def get_vrimages(lodging):
    return VRImageSerializer(lodging.vrimages.filter(disabled=False), many=True).data

  class Meta:
    model = Lodging
    fields = (
      'id',
      'address',
      'address_id',
      'posted_at',
      'updated_at',
      'no_times_booked',
      'lodging_type',
      'total_floors',
      'floor_no',
      'furnishing',
      'facilities',
      'ground_floor',
      'top_floor',
      'available_from',
      'rent',
      'area',
      'bathrooms',
      'rooms',
      'balconies',
      'halls',
      'advance_rent_of_months',
      'flooring',
      'flooring_other',
      'additional_details',
      'is_booked',
      'images',
      'virtual_tour_link',
      'unit',
      'last_confirmed',
      'is_confirming',
      'reference',
      'isHidden',
      'charges',
      'vrimages',
      'agreement',
      'agreement_id'
    )
    read_only_fields = (
      'id',
      'posted_at',
      'updated_at',
      'no_times_booked',
      'is_confirming',
      'images',
      'charges',
      'vrimages'
    )
    extra_kwargs = {
      'virtual_tour_link': {'required': False, 'allow_blank': True},
      'additional_details': {'required': False, 'allow_blank': True},
      'available_from': {'required': False},
      'facilities': {'required': False, 'allow_blank': True},
      'flooring_other': {'required': False, 'allow_blank': True},
      'reference': {'write_only': True}
    }

  def clean_total_floors(self, value):
    if value and value < 1:
      raise ValidationError('Invalid total floors')
    return value

  def validate_additional_details(self, value):
    return clean_data(value)

  def validate_available_from(self, value):
    if not value or value < datetime.today().date():
      raise ValidationError('Invalid available from')
    return value
    
  def validate(self, data):
    floor_no = data.get('floor_no')
    total_floors = data.get('total_floors')
    lodging_type_other = data.get('lodging_type_other', '')
    flooring_other = data.get('flooring_other', '')
    if not floor_no or floor_no < 1:
      raise ValidationError('Invalid floor number')
    if not total_floors or floor_no > total_floors:
      raise ValidationError('Invalid total floors')
    if not data.get('flooring') and flooring_other == '':
      raise ValidationError('Invalid flooring')
    if not data.get('lodging_type') and lodging_type_other == '':
      raise ValidationError('Invalid lodging type')
    return data

  def create(self, validated_data):
    user = self.context['user']
    if 'charges' in validated_data:
      del validated_data['charges']
    return Lodging.objects.create(posted_by=user, **validated_data)

  def update(self, instance, validated_data):
    for key in validated_data:
      if key not in self.Meta.read_only_fields:
        setattr(instance, key, validated_data[key])
    instance.posted_by = self.context['user']
    instance.save()
    return instance

class FullLodgingSerializer(LodgingSerializer):
  posted_by = UserSerializer()
  
  class Meta(LodgingSerializer.Meta):
    model = Lodging
    fields = LodgingSerializer.Meta.fields + ('reference', 'posted_by')
    extra_kwargs = {
      'reference': {'write_only': False}
    }