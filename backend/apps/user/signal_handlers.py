from django.dispatch import receiver
from django.db.models.signals import post_delete

from .models import ProfileImage

import os

@receiver(post_delete, sender=ProfileImage)
def delete_images(sender, instance, *args, **kwargs):
    files = [instance.file.path, instance.thumbnail.path]
    for file in files:
        if os.path.isfile(file):
            os.remove(file)