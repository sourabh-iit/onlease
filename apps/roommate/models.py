from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
from django.contrib.postgres.fields import ArrayField
from django.contrib.contenttypes.fields import GenericRelation

from apps.locations.models import Region
from apps.image.models import ImageModel

User = get_user_model()


class RoomieAd(models.Model):
    ROOM = 'R'
    FLAT = 'F'
    HOUSE = 'H'
    TYPE_CHOICES = (
        (ROOM,'Room(s)'),
        (FLAT,'Flat'),
        (HOUSE,'House/Apartment'),
    )
    MALE = 'M'
    FEMALE = 'F'
    ANY = 'A'
    GENDER_CHOICES = (
        (None,'Choose gender'),
        (MALE,'Male'),
        (FEMALE,'Female'),
        (ANY,'Any'),
    )
    sender = models.ForeignKey(User,on_delete=models.CASCADE,db_index=True)
    rent = models.CharField(max_length=10, validators=[RegexValidator(
        regex='^[1-9][0-9]+$',
        message = "Enter correct value for rent"
    )],db_index=True)
    has_property = models.BooleanField(db_index=True)
    regions = ArrayField(models.CharField(max_length=10),size=10)
    types = ArrayField(models.CharField(max_length=1,choices=TYPE_CHOICES),size=8)
    lodging_description = models.TextField(validators=[RegexValidator(
        regex='^[0-9a-zA-Z ,.\'"/]*$',
        message = 'Only digits, letters and follwing characters are allowed (.,\'"/)'
    )],help_text="e.g. Fully furnished 2BHK FLAT.",null=True)
    share = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True) 
    created_at=models.DateTimeField(auto_now=True,db_index=True)
    updated_at=models.DateTimeField(auto_now_add=True)
    gender = models.CharField(max_length=2, choices=GENDER_CHOICES)
    images = GenericRelation(ImageModel)

    def __str__(self):
        return str(self.id)

    class Meta:
        ordering = ('created_at',)
