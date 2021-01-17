from django.dispatch import receiver
from django.db.models.signals import post_delete

from .models import LodgingImage

import os

@receiver(post_delete, sender=LodgingImage)
def delete_images(sender, instance, *args, **kwargs):
    files = [instance.image.path, instance.image_mobile.path, instance.image_thumbnail.path]
    for file in files:
        if os.path.isfile(file):
            os.remove(file)