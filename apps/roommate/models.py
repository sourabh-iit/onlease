from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
from apps.locations.models import Region
from stdimage import StdImageField
from apps.lodging.models import large_image_size, thumbnail_size, image_help_text

User = get_user_model()

def image_upload_directory(instance):
    return '{0}/{1}/{2}'.format(
        instance.user.mobile_number,
        instance.__doc__,
        instance.id
    )

def image_upload_path(instance, filename):
    return '{0}/{1}'.format(
        image_upload_directory(instance.ad),
        filename)

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
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    rent = models.CharField(max_length=10, validators=[RegexValidator(
        regex='^[1-9][0-9]+$',
        message = "Enter correct value for rent"
    )],default=-1,blank=True)
    region = models.ForeignKey(Region,on_delete=models.CASCADE)
    type = models.CharField(max_length=1,choices=TYPE_CHOICES)
    budget = models.CharField(max_length=10, validators=[RegexValidator(
        regex='^[1-9][0-9]+$',
        message="Enter correct value for budget"
    )],default=-1,blank=True)
    qualities = models.CharField(max_length=1000,validators=[RegexValidator(
        regex='^[0-9a-zA-Z ,.\'"/]*$',
        message = 'Only digits, letters and follwing characters are allowed (.,\'"/)'
    )],null=True,blank=True)
    lodging_description = models.CharField(max_length=500,validators=[RegexValidator(
        regex='^[0-9a-zA-Z ,.\'"/]*$',
        message = 'Only digits, letters and follwing characters are allowed (.,\'"/)'
    )],null=True,blank=True                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                )
    created_at=models.DateTimeField(auto_now=True)
    updated_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.id

    class Meta:
        ordering = ('created_at',)
        indexes = [
            models.Index(fields=['rent']),
            models.Index(fields=['region']),
            models.Index(fields=['type']),
            models.Index(fields=['budget']),
            models.Index(fields=['created_at']),
        ]


class Image(models.Model):
    image = StdImageField(upload_to=image_upload_path,
        variations = {'large':large_image_size,'thumbnail':thumbnail_size},
        help_text=image_help_text)
    ad = models.ForeignKey(RoomieAd,on_delete=models.CASCADE,db_index=True,related_name='images')
    created_at = models.DateTimeField(auto_now=True,db_index=True)

    def __str__(self):
        return self.image.name
