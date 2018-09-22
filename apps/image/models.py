from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

def image_upload_path(instance,filename):
  return 'images/{}'.format(filename)


class ImageModel(models.Model):
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
    (OTHER, 'Other'),
    (DINING_ROOM, 'Dining Room')
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
