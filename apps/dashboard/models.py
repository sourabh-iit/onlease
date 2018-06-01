from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

def image_upload_path(instance, filename):
    return '{0}/{1}/{2}'.format(
        'users',
        'images',
        filename
    )

class Refund(models.Model):
    reason = models.TextField()
    user = models.ForeignKey(User, related_name='refunds', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=True)
    amount = models.CharField(max_length=10)

class ProfileImage(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,
        related_name='profile',null=True)
    image = models.ImageField(upload_to=image_upload_path,
        help_text="Maximum image size allowed is 2mb.")
    image_thumbnail = models.ImageField(upload_to=image_upload_path,
        help_text="Maximum image size allowed is 2mb.")
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.image_thumbnail.url