from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Lodging, Charge, LodgingImage
from apps.locations.serializers import RegionSerializer
from apps.user.serializers import UserSerializer
from .utils import clean_data

from datetime import datetime


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
      'tag'
    )

class LodgingSerializer(serializers.ModelSerializer):
  images = serializers.SerializerMethodField()
  charges = ChargeSerializer(many=True, required=False)
  region = RegionSerializer(required=False)
  lodging_type = serializers.ChoiceField(choices=Lodging.RESIDENTIAL_CHOICES, required=False)
  flooring = serializers.ChoiceField(choices=Lodging.FLOORING_CHOICES, required=False)
  region_id = serializers.IntegerField()

  def get_images(self, lodging):
    return ImageSerializer(lodging.images.all(), many=True).data

  class Meta:
    model = Lodging
    fields = (
      'id',
      'address',
      'posted_at',
      'updated_at',
      'no_times_booked',
      'region',
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
      'latlng',
      'charges',
      'virtual_tour_link',
      'title',
      'unit',
      'last_confirmed',
      'is_confirming',
      'region_id',
      'reference'
    )
    read_only_fields = (
      'id',
      'posted_at',
      'updated_at',
      'no_times_booked',
      'region',
      'is_confirming',
      'images'
    )
    extra_kwargs = {
      'virtual_tour_link': {'required': False},
      'address': {'write_only': True},
      'reference': {'write_only': True}
    }

  def clean_address(self, value):
    return clean_data(value)

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
    return Lodging.objects.create(posted_by=user, **validated_data)

  def update(self, instance, validated_data):
    for key in validated_data:
      setattr(instance, key, validated_data[key])
    instance.posted_by = self.context['user']
    instance.save()
    return instance

class FullLodgingSerializer(LodgingSerializer):
  posted_by = UserSerializer()
  class Meta(LodgingSerializer.Meta):
    model = Lodging
    fields = LodgingSerializer.Meta.fields + ('address','reference','posted_by')
    extra_kwargs = {
      'address': {'write_only': False},
      'reference': {'write_only': False}
    }