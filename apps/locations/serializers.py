from rest_framework import serializers
from .models import Region, State, District

class StateSerializer(serializers.ModelSerializer):
  class Meta:
    model = State
    fields = ('id','name')

class DistrictSerializer(serializers.ModelSerializer):
  class Meta:
    model = District
    fields = ('id','name')

class RegionSerializer(serializers.ModelSerializer):
  state = StateSerializer()
  district = DistrictSerializer()

  class Meta:
    model = Region
    fields = ('id','name','state','district')