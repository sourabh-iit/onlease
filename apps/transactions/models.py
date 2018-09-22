from django.db import models
from apps.lodging.models import Lodging
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
from apps.lodging.utils import generate_random

User = get_user_model()

class LodgingTransaction(models.Model):
    SUCCESS = 'S'
    PENDING = 'P'
    CANCEL = 'C'
    FAIL = 'F'
    REFUNDED = 'R'
    STATUS_CHOICES = (
        (SUCCESS, "Success"),
        (PENDING, "Pending"),
        (CANCEL, "Cancel"),
        (FAIL, "Fail"),
        (REFUNDED, "Refunded"),
    )
    status = models.CharField(max_length=1, default=PENDING, choices=STATUS_CHOICES)
    amount = models.PositiveIntegerField(validators=[RegexValidator('^[1-9][0-9]{1,10}$')])
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="lodgingtransaction")
    lodging = models.ForeignKey(Lodging,on_delete=models.CASCADE)
    payment_request_id = models.CharField(max_length=40,null=True)
    payment_id = models.CharField(max_length=40,null=True)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    sms_status = models.CharField(max_length=1,choices=STATUS_CHOICES,
        default=PENDING)
    email_status = models.CharField(max_length=1,choices=STATUS_CHOICES,
        default=PENDING)
    payment_gateway_fees = models.CharField(max_length=12,default=0)
    amount_paid = models.CharField(max_length=10,default=0)
    reason = models.TextField(null=True)
    trans_id = models.CharField(max_length=100, default=generate_random(42), editable=False, unique =True)

    class Meta:
        ordering=['updated_at']

    def __str__(self):
        return str(self.id)