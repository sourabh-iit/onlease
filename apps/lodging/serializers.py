from rest_framework import serializers
from .models import CommonlyUsedLodgingModel, Lodging, Charge, \
  TermAndCondition
from apps.image.serializers import ImageRelatedField
from apps.image.models import ImageModel
from apps.locations.serializers import RegionSerializer
from apps.user.serializers import UserSerializer

class ChargeSerializer(serializers.ModelSerializer):
  class Meta:
    model = Charge
    fields = ('id','amount','description','is_per_month')

class TermAndConditionSerializer(serializers.ModelSerializer):
  class Meta:
    model = TermAndCondition
    fields = ('id','text')

class LodgingSerializer(serializers.ModelSerializer):
  posted_by = UserSerializer()

  class Meta:
    model = Lodging
    fields = ('id','posted_by','address','posted_at','updated_at',
      'no_times_booked')

class CommonLodgingSerializer(serializers.ModelSerializer):
  images = ImageRelatedField(many=True,
    queryset=CommonlyUsedLodgingModel.objects.all())
  lodging = LodgingSerializer()
  charges = ChargeSerializer(many=True)
  region = RegionSerializer()
  termsandconditions = TermAndConditionSerializer(many=True)

  class Meta:
    model = CommonlyUsedLodgingModel
    fields = ('id','region','lodging','lodging_type','total_floors','floor_no',
      'furnishing','facilities','ground_floor','top_floor','available_from','rent',
      'area','bathrooms','rooms','balconies','halls','advance_rent_of_months','flooring',
      'flooring_other','additional_details','is_booked','images','latlng','charges',
      'virtual_tour_link','termsandconditions','title','unit')