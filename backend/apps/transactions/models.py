from django.db import models
from apps.lodging.models import Lodging
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
from apps.lodging.utils import generate_random

User = get_user_model()

class LodgingTransaction(models.Model):
    SUCCESS = '0'
    PENDING = '1'
    CANCEL = '2'
    FAIL = '3'
    REFUNDED = '4'
    STATUS_CHOICES = (
        (SUCCESS, "Success"),
        (PENDING, "Pending"),
        (CANCEL, "Cancelled"),
        (FAIL, "Failed"),
        (REFUNDED, "Refunded"),
    )
    INSTAMOJO = '0'
    GATEWAY_CHOICES = (
        (INSTAMOJO, "Instamojo"),
    )
    status = models.CharField(max_length=1, default=PENDING, choices=STATUS_CHOICES)
    amount = models.PositiveIntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="lodgingtransactions", null=True)
    lodging = models.ForeignKey(Lodging, related_name="transactions", on_delete=models.SET_NULL, null=True)
    payment_request_id = models.CharField(max_length=40, default="")
    payment_id = models.CharField(max_length=40, default="")
    payment_gateway = models.CharField(max_length=1, choices=GATEWAY_CHOICES, default=INSTAMOJO)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    payment_gateway_fees = models.DecimalField(default=0)
    reason = models.CharField(max_length=300, default="")
    trans_id = models.CharField(max_length=60, editable=False, primary_key=True)

    class Meta:
        ordering=['updated_at']

    def __str__(self):
        return str(self.id)