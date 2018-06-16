from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey,GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.core.validators import RegexValidator, validate_slug
from django.contrib.auth import get_user_model
from django.utils.text import slugify

import os
from datetime import date

from apps.locations.models import Region, District

thumbnail_size = (228,180)
mobile_image_size = (480,600)
image_help_text = "Allowed image formats are jpeg/png/gif."

User = get_user_model()

def image_upload_directory(instance):
    return '{0}/{1}/{2}'.format(
        instance.posted_by.mobile_number,
        instance.__doc__,
        instance.id
    )

def image_upload_path(instance, filename):
    return '{0}/{1}/{2}'.format('lodging','images',filename)

class Lodging(models.Model):
    '''Lodging'''
    posted_by = models.ForeignKey(User,on_delete=models.CASCADE,related_name="lodgings",null=True,blank=True)
    purchased_by = models.ManyToManyField(User,related_name="customers")
    address = models.CharField(max_length=200, validators=[
        RegexValidator('^[0-9A-Za-z .\/\-\,]{10,}$')],
        help_text='Valid characters are alphabets, digits, period and hyphen'+
        ' Valid length is under 200 characters.',null=True,blank=True)
    posted_at = models.DateField(auto_now=True, editable=False, blank=True)
    updated_at = models.DateField(auto_now_add=True, editable=False, blank=True)
    no_times_booked = models.PositiveIntegerField(default=0)
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
    OFFICE_SPACE = 'OS'
    BANQUET_PARTY_LAWN = 'BP'
    SHOP = 'S'
    SHOWROOM = 'SR'
    LAND = 'L'
    AGRICULTURAL_LAND = 'AL'
    GUEST_HOUSE = 'GH'
    WARE_HOUSE = 'WH'
    COLD_STORAGE = 'CS'
    FACTORY = 'F'
    COMMERCIAL_CHOICES = (
        (OFFICE_SPACE,'Office space'),
        (BANQUET_PARTY_LAWN,'Banquert/Party lawn'),
        (SHOP,'Shop/Store'),
        (SHOWROOM,'Showroom'),
        (LAND,'Land/Plot'),
        (AGRICULTURAL_LAND,'Farming Land'),
        (GUEST_HOUSE,'Guest House'),
        (WARE_HOUSE,'Ware House'),
        (COLD_STORAGE,'Cold Storage'),
        (FACTORY,'Factory'),
        (OTHER,'Other'),
    )
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
    GAJ = 0
    SQUARE_FEET = 1
    SQUARE_YARDS = 2
    SQUARE_METER = 3
    ACRES = 4
    MARLA = 5
    BIGHA = 6
    KANAL = 7
    GROUNDS = 8
    ARES = 9
    BISWA = 10
    GUNTHA = 11
    HECTARES = 12
    MEASUREMENT_CHOICES = (
        (GAJ,'Gaj'),
        (SQUARE_FEET,'Sq.Ft.'),
        (SQUARE_YARDS,'Sq.YDS.'),
        (SQUARE_METER,'Sq. METER'),
        (ACRES,'Acres'),
        (MARLA,'Marla'),
        (BIGHA,'Bigha'),
        (KANAL,'Kanal'),
        (GROUNDS,'Grounds'),
        (ARES,'Ares'),
        (BISWA,'Biswa'),
        (GUNTHA,'Guntha'),
        (HECTARES,'Hectares'),
    )
    COMMERCIAL = 'C'
    RESIDENTIAL = 'R'
    LODGING_CHOICES = (
        (COMMERCIAL,'Commercial'),
        (RESIDENTIAL,'Residential'),
    )
    region = models.ForeignKey(Region,related_name="lodgings",on_delete=models.CASCADE)
    lodging = models.OneToOneField(Lodging,on_delete=models.CASCADE,related_name='sublodging')
    lodging_type = models.CharField(max_length=2,choices=RESIDENTIAL_CHOICES+COMMERCIAL_CHOICES,
                verbose_name="type")
    type_choice = models.CharField(max_length=2,choices=LODGING_CHOICES)
    lodging_type_other = models.CharField(max_length=100)
    total_floors = models.PositiveIntegerField(help_text="Ground floor is included in total floors.")
    floor_no = models.IntegerField(help_text='Ground floor is zeroth floor.')
    furnishing = models.CharField(max_length=2,choices=FURNISHING_CHOICES)
    facilities = models.CharField(max_length=200,null=True,blank=True)
    ground_floor = models.BooleanField(blank=True,default=False)
    top_floor = models.BooleanField(blank=True,default=False)
    is_booked = models.BooleanField(default=False)
    available_from = models.DateField()
    rent = models.PositiveIntegerField()
    area = models.CharField(max_length=12,
        validators=[RegexValidator('^[1-9][0-9]*$')])
    area_unit = models.CharField(max_length=2,choices=MEASUREMENT_CHOICES,
        validators=[RegexValidator('^[0-9]+$')])
    bathrooms = models.IntegerField()
    bedrooms = models.IntegerField()
    balconies = models.IntegerField()
    other_rooms = models.IntegerField()
    halls = models.IntegerField()
    security_deposit = models.CharField(max_length=20,validators=[RegexValidator(
        regex="^[1-9][0-9]*$",
        message="Enter in digits only"
    )])
    booking_amount = models.CharField(max_length=20,validators=[RegexValidator(
        regex="^[1-9][0-9]*$",
        message="Enter in digits only"
    )])
    flooring = models.CharField(max_length=2,choices=FLOORING_CHOICES)
    additional_details = models.TextField(max_length=2000,
        validators=[RegexValidator('^[0-9a-zA-Z ,-/.&$%?\'\"]*$')],
        help_text='Valid characters are alphabets, digits, and "-,./.&$%?\'\" only'+
        ' Valid length is under 500 characters.')
    title = models.CharField(max_length=20, validators=\
        [RegexValidator(
            '^[0-9A-Za-z _-]{10,}',
            message='Valid characters are alphabets, digits and "-_" only.'+
        " Valid length is under 20 characters.")],
        help_text="Make title as informative as possible under 20 characters")
    slug = models.SlugField(max_length=20,editable=False,validators=[validate_slug])
    temporary = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if self.title:
            self.slug = slugify(self.title)
        if self.floor_no:
            if self.floor_no==self.total_floors-1:
                self.top_floor=True
            elif self.floor_no==0:
                self.ground_floor=True
        super(CommonlyUsedLodgingModel, self).save(*args, **kwargs)

    class Meta:
        ordering = ('-available_from',)
        # TODO indexing

class ImageModel(models.Model):
    BEDROOM = 'B'
    HALL = "H"
    BALCONY = 'BA'
    LIVING_ROOM = 'LR'
    ENTRANCE = "E"
    KITCHEN = "K"
    BATHROOM = "BR"
    BUILDING = "BU"
    FLOOR = "F"
    OUTSIDE = 'OU'
    OTHER = 'O'
    TAG_CHOICES = (
        (BEDROOM,'Bedroom'),
        (HALL, 'H'),
        (BALCONY, 'Balcony'),
        (LIVING_ROOM,'Living Room'),
        (ENTRANCE,'Entrance'),
        (KITCHEN, 'Kitchen'),
        (BATHROOM, 'Bathroom'),
        (BUILDING, 'Building'),
        (FLOOR, 'Floor'),
        (OUTSIDE, 'Outside View'),
        (OTHER, 'Other')
    )
    sublodging = models.ForeignKey(CommonlyUsedLodgingModel,on_delete=models.CASCADE,
        related_name='images',null=True)
    image = models.ImageField(upload_to=image_upload_path)
    image_thumbnail = models.ImageField(upload_to=image_upload_path)
    image_mobile = models.ImageField(upload_to=image_upload_path, blank=True, null=True)
    created_at = models.DateTimeField(auto_now=True,db_index=True)
    tag = models.CharField(choices=TAG_CHOICES,max_length=2, blank=True, null=True)
    tag_other = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.image_thumbnail.url


class Dealer(models.Model):
    '''
    regions is a comma separated string of Region model id's
    page is a comma separated string of page position in respective regions and 0 means it is not assigned
    position is a comma separated string of ad position in a page in respective regions
    len(regions.split(',')) = len(page.split(',')) = len(position.split(','))
    '''
    user = models.OneToOneField(User, related_name='dealer', on_delete=models.CASCADE)
    regions = models.CharField(max_length=500, blank=True, null=True)
    page = models.CharField(max_length=200, blank=True, null=True)
    position = models.CharField(max_length=200, blank=True, null=True)
