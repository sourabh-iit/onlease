from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
from apps.locations.models import Region
from stdimage import StdImageField
from apps.lodging.models import large_image_size, thumbnail_size, image_help_text

User = get_user_model()

def image_upload_path(instance, filename):
    return '{0}/{1}/{2}'.format(
        'Roomie','images',filename)

class RoomieAd(models.Model):
    '''
    Roomie
    '''
    ROOM = 'R'
    FLAT = 'F'
    TYPE_CHOICES = (
        (None,'Choose type'),
        (ROOM,'Room(s)'),
        (FLAT,'Flat')
    )
    user = models.ForeignKey(User,on_delete=models.CASCADE,db_index=True)
    rent = models.CharField(max_length=10, validators=[RegexValidator(
        regex='^[1-9][0-9]+$',
        message = "Enter correct value for rent"
    )],blank=True,db_index=True)
    has_property = models.BooleanField(db_index=True)
    region = models.ForeignKey(Region,on_delete=models.CASCADE,db_index=True)
    type = models.CharField(max_length=1,choices=TYPE_CHOICES,db_index=True,
        help_text='Property type you want roommate for.')
    lodging_description = models.CharField(max_length=500,validators=[RegexValidator(
        regex='^[0-9a-zA-Z ,.\'"/]*$',
        message = 'Only digits, letters and follwing characters are allowed (.,\'"/)'
    )],help_text="e.g. Fully furnished 2BHK FLAT.",null=True)
    is_active = models.BooleanField(default=True) 
    created_at=models.DateTimeField(auto_now=True,db_index=True)
    updated_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.id

    class Meta:
        ordering = ('created_at',)
        indexes = [
            models.Index(fields=['rent']),
            models.Index(fields=['region',]),
            models.Index(fields=['type']),
            models.Index(fields=['created_at']),
        ]


class Image(models.Model):
    ad = models.ForeignKey(RoomieAd,on_delete=models.CASCADE,
        related_name='images',null=True,db_index=True)
    image = models.ImageField(upload_to=image_upload_path,
        help_text="Allowed image formats are jpeg/png/gif.")
    image_thumbnail = models.ImageField(upload_to=image_upload_path,
        help_text="Allowed image formats are jpeg/png/gif.")
    created_at = models.DateTimeField(auto_now=True,db_index=True)

    def __str__(self):
        return self.image.url
