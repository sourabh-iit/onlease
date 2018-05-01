from django.db import models

# Create your models here.
class Location(models.Model):
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    pincode = models.CharField(max_length=20)

    class Meta:
        indexes = [
            models.Index(fields=['state']),
            models.Index(fields=['state','district']),
            models.Index(fields=['state','district','region']),
        ]
