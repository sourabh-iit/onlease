from django.db import models
from django.core.validators import RegexValidator, validate_slug
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.conf import settings
from django.core.files import File

from apps.locations.models import Region
from apps.utils import generate_random

import json
import math
import logging


logger = logging.getLogger('onlease-logger')
User = get_user_model()

def lodging_image_upload_path(instance, filename):
  return f'lodgings/images/{filename}'

def lodging_thumbnail_upload_path(instance, filename):
      return f'lodgings/thumbnails/{filename}'

def lodging_mobile_image_upload_path(instance, filename):
      return f'lodgings/mobile_images/{filename}'

def lodging_vr_image_upload_path(instance, filename):
  return f'lodgings/vrimages/{filename}'

def lodging_vr_thumbnail_upload_path(instance, filename):
      return f'lodgings/vrthumbnails/{filename}'

class Lodging(models.Model):
  '''Lodging'''
  FLAT = "0"
  HOUSE = "1"
  PAYING_GUEST = "2"
  ROOM = "3"
  OTHER = '4'
  RESIDENTIAL_CHOICES = (
    (FLAT, "Flat"),
    (HOUSE, "House/Apartment"),
    (PAYING_GUEST, "Paying guest"),
    (ROOM, "Rooms"),
    (OTHER,'Other')
  )
  LODGINGS_IN_HINDI = ["फ़्लैट", "घर/अपार्टमेंट", "PG", "कमरा", "अन्य"]
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
  FURNISHED = '0'
  SEMI_FURNISHED = '1'
  UN_FURNISHED = '2'
  FURNISHING_CHOICES = (
    (FURNISHED,'Furnished'),
    (SEMI_FURNISHED,'Semi Furnished'),
    (UN_FURNISHED,'Unfurnished'),
  )
  KITCHEN = '0'
  CAR_PARKING = '1'
  BIKE_PARKING = '2'
  AIR_CONDITIONER = '3'
  REFRIGERATOR = '4'
  WATER_COOLER = '5'
  AIR_COOLER = '6'
  GYM = '7'
  WATER_HEATER = '8'
  WIFI = '9'
  TV = '10'
  FACILITIES_AVAILABLE_CHOICES = (
    (KITCHEN, 'Kitchen'),
    (CAR_PARKING, 'Car Parking'),
    (BIKE_PARKING, 'Bike Parking'),
    (AIR_CONDITIONER, 'Air conditioner'),
    (REFRIGERATOR, 'Refrigerator'),
    (WATER_COOLER, 'Water cooler'),
    (AIR_COOLER, 'Air cooler'),
    (GYM, 'Gym'),
    (WATER_HEATER, 'Water heater'),
    (WIFI, 'Wifi'),
    (TV, 'Tv'),
  )
  MARBLE = '0'
  VITRIFIED_TILE = '1'
  VINYL = '2'
  HARDWOOD = '3'
  GRANITE = '4'
  BAMBOO = '5'
  CONCRETE = '6'
  LAMINATE = '7'
  LINOLEUM = '8'
  TERRAZZO = '9'
  BRICK = '10'
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
  SQUARE_GAJ = '0'
  SQUARE_FEET = '1'
  SQUARE_YARDS = '2'
  SQUARE_METER = '3'
  ACRE = '4'
  MARLA = '5'
  KANAL = '6'
  ARES = '7'
  BISWA = '8'
  HECTARES = '9'
  MEASURING_UNIT_CHOICES = (
    (SQUARE_GAJ,'Sq. Gaj'),
    (SQUARE_FEET,'Sq. Feet'),
    (SQUARE_YARDS,'Sq. Yds.'),
    (SQUARE_METER,'Sq. Meter'),
    (ACRE,'Acre'),
    (MARLA,'Marla'),
    (KANAL,'Kanal'),
    (ARES,'Ares'),
    (BISWA,'Biswa'),
    (HECTARES,'Hectares'),
  )
  posted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="lodgings")
  posted_at = models.DateField(auto_now=True, blank=True)
  updated_at = models.DateField(auto_now_add=True, blank=True)
  no_times_booked = models.IntegerField(default=0)
  # session_key = models.CharField(max_length=50,null=True,blank=True)
  lodging_type = models.CharField(max_length=2, choices=RESIDENTIAL_CHOICES, verbose_name="type", blank=True)
  lodging_type_other = models.CharField(max_length=100, default="", blank=True)
  total_floors = models.PositiveIntegerField(default=1)
  floor_no = models.IntegerField(default=1)
  furnishing = models.CharField(max_length=2, choices=FURNISHING_CHOICES)
  facilities = models.CharField(max_length=1000, default="[]")
  ground_floor = models.BooleanField(blank=True, default=False)
  top_floor = models.BooleanField(blank=True, default=False)
  available_from = models.DateField(null=True, blank=True)
  rent = models.PositiveIntegerField()
  area = models.CharField(max_length=12)
  unit = models.CharField(max_length=2, choices=MEASURING_UNIT_CHOICES)
  bathrooms = models.IntegerField(default=1)
  rooms = models.IntegerField(default=1)
  balconies = models.IntegerField(default=0)
  halls = models.IntegerField(default=0)
  advance_rent_of_months = models.PositiveIntegerField(default=1)
  flooring = models.CharField(max_length=2, choices=FLOORING_CHOICES)
  flooring_other = models.CharField(max_length=100, default="", blank=True)
  additional_details = models.TextField(max_length=2000, default="", blank=True)
  is_booked = models.BooleanField(default=False)
  virtual_tour_link = models.CharField(max_length=300, default="", blank=True)
  last_confirmed = models.DateTimeField(auto_now=True, blank=True)
  is_confirming = models.BooleanField(default=False)
  reference = models.CharField(default="", max_length=10, blank=True)
  agreement = models.ForeignKey('user.Agreement', related_name='lodgings', null=True, on_delete=models.SET_NULL)
  isHidden = models.BooleanField(default=False)
  bookedBy = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
  address = models.ForeignKey('user.Address', on_delete=models.SET_NULL, null=True, related_name='lodgings')

  def duplicate(self):
    charges = self.charges.all()
    images = self.images.all()
    vrimages = self.vrimages.all()
    self.id = None
    self.no_times_booked = 0
    self.updated_at = None
    self.created_at = None
    self.available_from = None
    self.is_booked = False
    self.last_confirmed = None
    self.reference = ""
    self.isHidden = False
    self.bookedBy = None
    self.save()
    logger.info(len(images))
    for charge in charges:
      charge.duplicate(self)
    for image in images:
      image.duplicate(self)
    for vrimage in vrimages:
      vrimage.duplicate(self)
    return self

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

  @property
  def all_charges(self):
    charges = [
      { 'text': 'Rent', 'amount': self.rent, 'is_per_month': True },
      { 'text': 'Brokerage', 'amount': (self.rent*settings.BROKERAGE_PERCENT)/100, 'is_per_month': False }
    ]
    if self.advance_rent_of_months > 1:
      charges.append({ 'text': 'Security', 'amount': (self.advance_rent_of_months-1)*self.rent, 'is_per_month': False })
    for charge in self.charges.all():
      charges.append({ 'text': charge.description, 'amount': charge.amount, 'is_per_month': charge.is_per_month })
    return charges

  @property
  def booking_amount(self):
    rent = self.rent
    tot_amt = math.ceil((rent*(settings.BOOKING_PERCENT + settings.BROKERAGE_PERCENT))/100)
    return tot_amt

  def save(self, *args, **kwargs):
    if isinstance(self.facilities, list):
      self.facilities = json.dumps(self.facilities)
    if self.floor_no:
      if self.floor_no == 1:
        self.ground_floor = True
      elif self.floor_no == self.total_floors:
        self.top_floor = True
    if self.advance_rent_of_months == 0:
      self.advance_rent_of_months = 1
    super(Lodging, self).save(*args, **kwargs)

  def __str__(self):
    return f"Address: {self.address}, posted by: {self.posted_by.full_name}"

  class Meta:
    ordering = ('-available_from', 'posted_at',)


class Charge(models.Model):
  amount=models.CharField(max_length=20, validators=[RegexValidator('^[0-9]+$')])
  description=models.CharField(max_length=50)
  is_per_month=models.BooleanField(default=False)
  lodging=models.ForeignKey(Lodging, on_delete=models.CASCADE, related_name='charges')

  def duplicate(self, lodging):
    self.lodging = lodging
    self.id = None
    self.save()

  def __str__(self):
    return self.description+': Rs. '+self.amount

class LodgingImage(models.Model):
  BEDROOM = '0'
  HALL = "1"
  BALCONY = '2'
  LIVING_ROOM = '3'
  ENTRANCE = "4"
  KITCHEN = "5"
  BATHROOM = "6"
  BUILDING = "7"
  FLOOR = "8"
  OUTSIDE = '9'
  OTHER = '10'
  DINING_ROOM = '11'
  LODGING_TAG_CHOICES = (
    (BEDROOM,'Bedroom'),
    (HALL, 'Hall'),
    (BALCONY, 'Balcony'),
    (LIVING_ROOM,'Living Room'),
    (ENTRANCE,'Entrance'),
    (KITCHEN, 'Kitchen'),
    (BATHROOM, 'Bathroom'),
    (BUILDING, 'Building'),
    (FLOOR, 'Floor'),
    (OUTSIDE, 'Outside View'),
    (DINING_ROOM, 'Dining Room'),
    (OTHER, 'Other')
  )
  lodging = models.ForeignKey(Lodging, on_delete=models.CASCADE, related_name="images", null=True)
  image = models.ImageField(upload_to=lodging_image_upload_path)
  image_thumbnail = models.ImageField(upload_to=lodging_thumbnail_upload_path)
  image_mobile = models.ImageField(upload_to=lodging_mobile_image_upload_path)
  created_at = models.DateTimeField(auto_now=True)
  tag = models.CharField(choices=LODGING_TAG_CHOICES, max_length=2, default=BEDROOM)
  tag_other = models.CharField(max_length=100, default="", blank=True)

  def duplicate(self, lodging):
    createNewFile = lambda image: File(image, image.name[:(len(image.name) - 8)] + generate_random(8))
    self.image = createNewFile(self.image)
    self.image_thumbnail = createNewFile(self.image_thumbnail)
    self.image_mobile = createNewFile(self.image_mobile)
    self.lodging = lodging
    self.id = None
    self.save()

  def __str__(self):
    return self.image_thumbnail.url

class LodgingVRImage(models.Model):
  lodging = models.ForeignKey(Lodging, on_delete=models.CASCADE, related_name="vrimages", null=True)
  image = models.ImageField(upload_to=lodging_vr_image_upload_path)
  image_thumbnail = models.ImageField(upload_to=lodging_vr_thumbnail_upload_path)
  created_at = models.DateTimeField(auto_now=True)
  disabled = models.BooleanField(default=False)

  def duplicate(self, lodging):
    createNewFile = lambda image: File(image, image.name[:(len(image.name) - 8)] + generate_random(8))
    self.image = createNewFile(self.image)
    self.image_thumbnail = createNewFile(self.image_thumbnail)
    self.lodging = lodging
    self.id = None
    self.save()

  def __str__(self):
    return self.image_thumbnail.url
