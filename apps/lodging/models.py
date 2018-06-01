from django.db import models
import os
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from datetime import date
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey,GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.core.validators import RegexValidator, validate_slug
from stdimage import StdImageField
from apps.locations.models import Region, District

allowed_image_formats = ['png','jpg','jpeg','gif']

thumbnail_size = (228,180)

large_image_size = (900,500)

max_size = 2 # size in mb

image_help_text = "Maximum image size allowed is 2mb."

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
    posted_by = models.ForeignKey(User,on_delete=models.CASCADE,related_name="lodgings")
    purchased_by = models.ManyToManyField(User,related_name="customers")
    address = models.CharField(max_length=200, validators=[
        RegexValidator('^[0-9A-Za-z .\/\-\,]{10,}$')],
        help_text='Valid characters are alphabets, digits, period and hyphen'+
        ' Valid length is under 200 characters.')
    posted_at = models.DateField(auto_now=True, editable=False, blank=True)
    updated_at = models.DateField(auto_now_add=True, editable=False, blank=True)
    no_times_booked = models.PositiveIntegerField(default=0,editable=False)

    def __str__(self):
        return self.address

    class Meta:
        ordering = ('posted_at',)


class CommonlyUsedLodgingModel(models.Model):
    FLAT = "F"
    HOUSE = "H"
    PAYING_GUEST = "P"
    ROOM = "R"
    TYPE_CHOICES = (
        (None,'Choose type'),
        (FLAT, "Flat"),
        (HOUSE, "House/Apartment"),
        (PAYING_GUEST, "Paying guest"),
        (ROOM, "Rooms"),
    )
    region = models.ForeignKey(Region,related_name="lodgings",on_delete=models.CASCADE)
    lodging = models.OneToOneField(Lodging,on_delete=models.CASCADE,related_name='sublodging')
    lodging_type = models.CharField(max_length=1,choices=TYPE_CHOICES,
                verbose_name="type")
    total_floors = models.PositiveIntegerField(help_text="Ground floor is included in total floors.")
    floor_no = models.IntegerField(help_text='Ground floor is zeroth floor.')
    is_furnished = models.BooleanField()
    is_kitchen_available = models.BooleanField()
    is_parking_available = models.BooleanField()
    ground_floor = models.BooleanField(blank=True,default=False)
    top_floor = models.BooleanField(blank=True,default=False)
    is_booked = models.BooleanField(default=False)
    available_from = models.DateField()
    rent = models.PositiveIntegerField(db_index=True)
    # land_area = models.CharField(max_length=12,
    #     validators=[RegexValidator('^[1-9][0-9]*x[1-9][0-9]*$')])
    additional_details = models.TextField(max_length=500,null=True,blank=True,
        validators=[RegexValidator('^[0-9a-zA-Z ,-/.&$%?\'\"]*$')],
        help_text='Valid characters are alphabets, digits, and "-,./.&$%?\'\" only'+
        ' Valid length is under 500 characters.')
    title = models.CharField(max_length=70, validators=\
        [RegexValidator('^[0-9A-Za-z _-]{10,}')],
        help_text='Valid characters are alphabets, digits and "-_" only.'+
        " Valid length is under 70 characters.")
    slug = models.SlugField(max_length=70,editable=False,validators=[validate_slug])
    is_blocked = models.BooleanField(default=False)
    no_times_refunded = models.PositiveIntegerField(default=0)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title)
        if self.floor_no==self.total_floors-1:
            self.top_floor=True
        if self.floor_no==0:
            self.ground_floor=True
        super(CommonlyUsedLodgingModel, self).save(*args, **kwargs)

    class Meta:
        ordering = ('-available_from',)
        # TODO indexing

class ImageModel(models.Model):
    sublodging = models.ForeignKey(CommonlyUsedLodgingModel,on_delete=models.CASCADE,
        related_name='images',null=True)
    image = models.ImageField(upload_to=image_upload_path,
        help_text="Maximum image size allowed is 2mb.")
    image_thumbnail = models.ImageField(upload_to=image_upload_path,
        help_text="Maximum image size allowed is 2mb.")
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.image_thumbnail.url


class Dealer(models.Model):
    user = models.OneToOneField(User, related_name='dealer', on_delete=models.CASCADE)
    available_property_types = models.CharField(max_length=100,choices=CommonlyUsedLodgingModel.TYPE_CHOICES,null=True)
    district = models.ForeignKey(District,related_name='dealers',on_delete=models.CASCADE,null=True)
    page = models.PositiveIntegerField(default=1000,db_index=True,null=True)
    position = models.PositiveIntegerField(default=1000,db_index=True,null=True)
