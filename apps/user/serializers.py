from rest_framework import serializers
from .models import User, MobileNumber, TermAndCondition
from apps.image.serializers import ImageRelatedField

class MobileNumberSerializer(serializers.ModelSerializer):
  class Meta:
    model = MobileNumber
    fields = ('id','value','is_verified')

class TermAndConditionSerializer(serializers.ModelSerializer):
  class Meta:
    model = TermAndCondition
    fields = ('id','text')

class UserSerializer(serializers.ModelSerializer):
  mobile_numbers = MobileNumberSerializer(many=True)
  profile_image = ImageRelatedField(many=True,queryset=User.objects.all())
  termsandconditions = TermAndConditionSerializer(many=True)

  class Meta:
    model = User
    fields = ('mobile_number','email','first_name','last_name',
     'is_verified','gender','created_at','updated_at','detail',
     'profile_image','mobile_numbers', 'favorite_properties',
     'termsandconditions')
