from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Refund(models.Model):
    reason = models.TextField()
    user = models.ForeignKey(User, related_name='refunds', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=True)
    amount = models.CharField(max_length=10)