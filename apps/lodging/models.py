from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey,GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.core.validators import RegexValidator, validate_slug, DecimalValidator
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.utils import timezone

import os
from datetime import date

from apps.locations.models import Region, District
from apps.image.models import ImageModel

User = get_user_model()

class Lodging(models.Model):
  '''Lodging'''
  posted_by = models.ForeignKey(User,on_delete=models.CASCADE,related_name="lodgings",null=True,blank=True)
  purchased_by = models.ManyToManyField(User,related_name="customers")
  address = models.CharField(max_length=200, help_text='Valid length is under 200 characters.')
  posted_at = models.DateField(auto_now=True, editable=False, blank=True)
  updated_at = models.DateField(auto_now_add=True, editable=False, blank=True)
  no_times_booked = models.IntegerField(default=0)
  session_key = models.CharField(max_length=50,null=True,blank=True)

  def __str__(self):
    return self.address

  class Meta:
    ordering = ('posted_at',)


class CommonlyUsedLodgingModel(models.Model):
  '''
  Lodging can be saved as temporary if not fully completed. Session id is used to create
  temporary lodging if user is not logged in else user id is used.
  '''
  FLAT = "F"
  HOUSE = "H"
  PAYING_GUEST = "P"
  ROOM = "R"
  OTHER = 'O'
  RESIDENTIAL_CHOICES = (
    (FLAT, "Flat"),
    (HOUSE, "House/Apartment"),
    (PAYING_GUEST, "Paying guest"),
    (ROOM, "Rooms"),
    (OTHER,'Other')
  )
  # OFFICE_SPACE = 'OS'
  # BANQUET_PARTY_LAWN = 'BP'
  # SHOP = 'S'
  # SHOWROOM = 'SR'
  # LAND = 'L'
  # AGRICULTURAL_LAND = 'AL'
  # GUEST_HOUSE = 'GH'
  # WARE_HOUSE = 'WH'
  # COLD_STORAGE = 'CS'
  # FACTORY = 'F'
  # COMMERCIAL_CHOICES = (
  #     (OFFICE_SPACE,'Office space'),
  #     (BANQUET_PARTY_LAWN,'Banquert/Party lawn'),
  #     (SHOP,'Shop/Store'),
  #     (SHOWROOM,'Showroom'),
  #     (LAND,'Land/Plot'),
  #     (AGRICULTURAL_LAND,'Farming Land'),
  #     (GUEST_HOUSE,'Guest House'),
  #     (WARE_HOUSE,'Ware House'),
  #     (COLD_STORAGE,'Cold Storage'),
  #     (FACTORY,'Factory'),
  #     (OTHER,'Other'),
  # )
  FURNISHED = 'F'
  SEMI_FURNISHED = 'S'
  UN_FURNISHED = 'U'
  FURNISHING_CHOICES = (
    (FURNISHED,'Furnished'),
    (SEMI_FURNISHED,'Semi Furnished'),
    (UN_FURNISHED,'Unfurnished'),
  )
  KITCHEN = 'K'
  PARKING = 'P'
  AIR_CONDITIONER = 'A'
  FACILITIES_AVAILABLE_CHOICES = (
    (KITCHEN,'Kitchen'),
    (PARKING,'Parking'),
    (AIR_CONDITIONER,'Air conditioner'),
  )
  MARBLE = 'M'
  VITRIFIED_TILE = 'VT'
  VINYL = 'V'
  HARDWOOD = 'H'
  GRANITE = 'G'
  BAMBOO = 'B'
  CONCRETE = 'C'
  LAMINATE = 'L'
  LINOLEUM = 'LI'
  TERRAZZO = 'T'
  BRICK = 'BR'
  FLOORING_CHOICES = (
    (MARBLE, 'Marble'),
    (VITRIFIED_TILE,'Vitrified Tile'),
    (VINYL, 'Vinyl'),
    (HARDWOOD, 'Hardwood'),
    (GRANITE, 'Granite'),
    (BAMBOO, 'Bamboo'),
    (CONCRETE, 'Concrete'),
    (LAMINATE, 'Laminate'),
    (LINOLEUM, 'Linoleum'),
    (TERRAZZO, 'Terrazzo'),
    (BRICK, 'Brick'),
    (OTHER, 'Other')
  )
  # COMMERCIAL = 'C'
  # RESIDENTIAL = 'R'
  # LODGING_CHOICES = (
  #     (COMMERCIAL,'Commercial'),
  #     (RESIDENTIAL,'Residential'),
  # )
  region = models.ForeignKey(Region,related_name="lodgings",on_delete=models.CASCADE)
  lodging = models.OneToOneField(Lodging,on_delete=models.CASCADE,related_name='sublodging')
  lodging_type = models.CharField(max_length=2,choices=RESIDENTIAL_CHOICES,
              verbose_name="type",default=ROOM)
  # type_choice = models.CharField(max_length=2,choices=LODGING_CHOICES,default=COMMERCIAL)
  lodging_type_other = models.CharField(max_length=100,null=True,blank=True)
  total_floors = models.PositiveIntegerField(default=1)
  floor_no = models.IntegerField(default=1)
  furnishing = models.CharField(max_length=2,choices=FURNISHING_CHOICES,default=UN_FURNISHED)
  facilities = models.CharField(max_length=1000,null=True,blank=True)
  ground_floor = models.BooleanField(blank=True,default=False)
  top_floor = models.BooleanField(blank=True,default=False)
  available_from = models.DateField(default=timezone.now())
  rent = models.CharField(max_length=10,validators=[RegexValidator('^[1-9][0-9]+$')])
  area = models.CharField(max_length=12)
  bathrooms = models.IntegerField(default=1)
  rooms = models.IntegerField(default=1)
  balconies = models.IntegerField(default=0)
  halls = models.IntegerField(default=0)
  advance_rent_of_months = models.PositiveIntegerField(default=1)
  flooring = models.CharField(max_length=2,choices=FLOORING_CHOICES,null=True,blank=True)
  flooring_other = models.CharField(max_length=100,blank=True, null=True)
  additional_details = models.TextField(max_length=2000,
      help_text='Valid length is under 500 characters.',
      default="")
  title = models.CharField(max_length=70, validators=[RegexValidator('^[-a-zA-Z0-9_ ]+\Z')],
        help_text="Max length is 70 characters. Only characters, digits, hyphen and underscore are allowed.")
  slug = models.SlugField(max_length=70,editable=False,validators=[validate_slug])
  is_booked = models.BooleanField(default=False)
  images = GenericRelation(ImageModel)
  latlng = models.CharField(max_length=100, blank=True, null=True)

  def get_per_month_amount(self):
    total = int(self.rent)
    for charge in self.charges.all():
      if charge.is_per_month:
        total += int(charge.amount)
    return total
    
  def get_first_month_amount(self):
    total = int(self.rent)*self.advance_rent_of_months
    for charge in self.charges.all():
      total += int(charge.amount)
    return total

  def get_booking_amount(self):
    return int(self.rent)//8

  def save(self, *args, **kwargs):
    if self.title:
      self.slug = slugify(self.title)
    if self.floor_no:
      if self.floor_no==self.total_floors:
        self.top_floor=True
      elif self.floor_no==1:
        self.ground_floor=True
    if not self.advance_rent_of_months==0:
      self.advance_rent_of_months = 1
    super(CommonlyUsedLodgingModel, self).save(*args, **kwargs)

  class Meta:
    ordering = ('-available_from',)
    # TODO indexing


class Charge(models.Model):
  amount=models.CharField(max_length=20, validators=[RegexValidator('^[0-9]+$')])
  description=models.CharField(max_length=50, validators=[validate_slug])
  is_per_month=models.BooleanField(default=False)
  lodging=models.ForeignKey(CommonlyUsedLodgingModel,on_delete=models.CASCADE,related_name='charges')

  def __str__(self):
    return self.description+': Rs. '+self.amount
