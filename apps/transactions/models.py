from django.db import models
from apps.lodging.models import Lodging
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator

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
    user = models.ForeignKey(User,on_delete=models.CASCADE)
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

    def save(self, *args, **kwargs):
        super(LodgingTransaction, self).save(*args, **kwargs)
        if(self.status==self.SUCCESS):
            # send message of successfull transaction
            print("transaction successfull")
        elif(self.status==self.FAIL):
            # send message of fail transaction
            print("transaction fail")

    def __str__(self):
        return self.id