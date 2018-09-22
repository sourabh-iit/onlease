from rest_framework import serializers
from .models import User, MobileNumber
from apps.image.serializers import ImageRelatedField

class MobileNumberSerializer(serializers.ModelSerializer):
  class Meta:
    model = MobileNumber
    fields = ('id','value','is_verified')

class UserSerializer(serializers.ModelSerializer):
  mobile_numbers = MobileNumberSerializer(many=True)
  profile_image = ImageRelatedField(many=True,queryset=User.objects.all())

  class Meta:
    model = User
    fields = ('mobile_number','email','first_name','last_name',
     'is_verified','gender','created_at','updated_at','detail',
     'profile_image','mobile_numbers')
