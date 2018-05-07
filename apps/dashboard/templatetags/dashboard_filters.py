from django import template
from apps.lodging.models import CommonlyUsedLodgingModel
from apps.transactions.models import LodgingTransaction
import datetime

register = template.Library()

@register.filter(name='get_class')
def get_class(value):
    if value:
        return "fa fa-check-circle green-text"
    return "fa fa-times-circle red-text"

@register.filter(name='get_status') 
def get_status(value):
    for choice in LodgingTransaction.STATUS_CHOICES:
        if choice[0]==value:
            return choice[1]
    return ""