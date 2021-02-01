from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import RegexValidator, MinLengthValidator
from django.contrib.contenttypes.fields import GenericRelation

from .utils import *

def profile_image_upload_path(instance, filename):
  return f'profile/images/{filename}'

def profile_thumbnail_upload_path(instance, filename):
      return f'profile/thumbnails/{filename}'


class CustomUserManager(BaseUserManager):
  def create_user(self,mobile_number,password):
    user = User.objects.create(mobile_number=mobile_number)
    user.set_password(password)
    user.save()
    return user
  def create_superuser(self,mobile_number,email,password):
    user = User.objects.create(mobile_number=mobile_number)
    user.set_password(password)
    user.is_superuser=True
    user.is_staff=True
    user.save()
    return user

class User(AbstractUser):
  MALE = 'M'
  FEMALE = 'F'
  GENDER_CHOICES = (
      (MALE,'Male'),
      (FEMALE,'Female'),
  )
  BLOCKED = 'B'
  WARNED = 'W'
  REGULAR = 'R'
  STATUS_CHOICES = (
      (BLOCKED,'Blocked'),
      (WARNED,'Warned'),
      (REGULAR,'Regular')
  )
  STATE_CHOICES=(
      (True,'Yes'),
      (False,'No')
  )
  mobile_number = models.CharField(max_length=16, primary_key=True, db_index=True,
      validators=[RegexValidator(mobile_number_regex)])
  password = models.CharField(max_length=100, null=False, blank=False, validators=[MinLengthValidator(8)])
  email = models.EmailField(null=True,blank=True, validators=[RegexValidator(email_regex)])
  first_name = models.CharField(max_length=30, null=True, blank=True, validators=[RegexValidator('^[a-zA-Z]{3,}$')])
  last_name = models.CharField(max_length=30, null=True, blank=True, validators=[RegexValidator('^[a-zA-Z]{3,}$')])
  is_allowed = models.BooleanField(default=False, help_text="Profile is not completed yet.")
  status = models.CharField(max_length=1, choices=STATUS_CHOICES, default=REGULAR)
  gender = models.CharField(choices=GENDER_CHOICES, max_length=1, default="")
  created_at = models.DateTimeField(auto_now=True)
  updated_at = models.DateTimeField(auto_now_add=True, null=True)
  favorite_properties = models.ManyToManyField("lodging.Lodging", related_name="favorite_of")

  USERNAME_FIELD = 'mobile_number'
  objects = CustomUserManager()

  @property
  def full_name(self):
    if self.first_name and self.last_name:
      return self.first_name+" "+self.last_name
    elif self.first_name:
      return self.first_name
    elif self.last_name:
      return self.last_name
    return ''

  def save(self,*args,**kwargs):
    self.username = self.mobile_number
    super().save(*args,**kwargs)

  def __str__(self):
    return self.mobile_number


class MobileNumber(models.Model):
  value = models.CharField(max_length=16,unique=True,validators=[
      RegexValidator(mobile_number_regex,
          message="Enter a valid mobile number.")])
  user = models.ForeignKey(User, related_name='mobile_numbers', on_delete=models.CASCADE)
  created_at = models.DateTimeField(auto_now=True)


class ContactModel(models.Model):
  name = models.CharField(max_length=50,validators=[RegexValidator(
    regex="^[a-zA-Z ]+$",
    message = "Enter a valid name."
  )],blank=True, null=True)
  email = models.EmailField(validators=[
      RegexValidator(email_regex,message="Email address is not valid.")],blank=True, null=True)
  mobile_number = models.CharField(max_length=16,validators=[
      RegexValidator(mobile_number_regex,
          message="Mobile number is not valid.")],null=True,blank=True)
  message = models.TextField(max_length=2000,validators=[
      RegexValidator('^[0-9A-Za-z ,.]{10,}$',
          message="Enter a valid message.")],
          help_text="Message can contain digits, alphabets, space, comma and period")
  subject = models.CharField(max_length=100,validators=[
      RegexValidator('^[0-9A-Za-z ,.]+$',
          message="Enter a valid subject.")],
          help_text="Subject can contain digits, alphabets, space, comma and period")
  sent_on = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.message


class SharedProperty(models.Model):
  address = models.CharField(max_length=200)
  created_at = models.DateTimeField(auto_now=True)
  updated_at = models.DateTimeField(auto_now_add=True)
  details = models.CharField(max_length=1000,blank=True,null=True)
  rent = models.CharField(max_length=10,blank=True,null=True)
  user = models.ForeignKey(User, on_delete=models.CASCADE,blank=True,null=True)
  owner_number = models.CharField(max_length=16)

  def __str__(self):
    return self.address


class Agreement(models.Model):
  user = models.ForeignKey(User,on_delete=models.CASCADE,
    related_name='agreements', null=True)
  created_at = models.DateTimeField(auto_now=True)
  title = models.CharField(max_length=200, default="Agreement")

class AgreementPoint(models.Model):
  agreement = models.ForeignKey(Agreement, on_delete=models.CASCADE, related_name="points")
  text = models.CharField(max_length=200, default="")
  created_at = models.DateTimeField(auto_now=True)
  updated_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
        return self.text

class ProfileImage(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="image")
  file = models.ImageField(upload_to=profile_image_upload_path)
  thumbnail = models.ImageField(upload_to=profile_thumbnail_upload_path)
  created_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.file.name
