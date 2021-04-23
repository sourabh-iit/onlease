from rest_framework import serializers
from .models import Region, State


class StateSerializer(serializers.ModelSerializer):

  class Meta:
    model = State
    fields = ('id', 'name')

class RegionSerializer(serializers.ModelSerializer):
  state = StateSerializer()

  class Meta:
    model = Region
    fields = ('id', 'name', 'pincode', 'state')