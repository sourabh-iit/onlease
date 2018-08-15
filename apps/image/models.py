from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

def image_upload_path(instance,filename):
  return 'images/{}'.format(filename)


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
  LODGING_TAG_CHOICES = (
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
  content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE,null=True)
  object_id = models.CharField(max_length=100,null=True)
  content_object = GenericForeignKey()
  image = models.ImageField(upload_to=image_upload_path)
  image_thumbnail = models.ImageField(upload_to=image_upload_path)
  image_mobile = models.ImageField(upload_to=image_upload_path, blank=True, null=True)
  created_at = models.DateTimeField(auto_now=True,db_index=True)
  tag = models.CharField(choices=LODGING_TAG_CHOICES,max_length=2, null=True)
  tag_other = models.CharField(max_length=100, blank=True, null=True)

  def __str__(self):
    return self.image_thumbnail.url
