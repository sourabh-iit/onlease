from rest_framework import serializers
from .models import ImageModel
from apps.user.models import User
from apps.lodging.models import CommonlyUsedLodgingModel

import json

class ImageSerializer(serializers.ModelSerializer):
  class Meta:
    model = ImageModel
    fields = ('image','image_mobile','image_thumbnail','created_at',
      'tag')

class ImageRelatedField(serializers.RelatedField):
  def to_representation(self, value):
    if isinstance(value,ImageModel):
      return ImageSerializer(value).data
    return ImageSerializer(value.first()).data