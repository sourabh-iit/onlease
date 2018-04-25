from django import template
from apps.lodging.models import CommonlyUsedLodgingModel

register = template.Library()

@register.filter(name='type_full_form')
def type_full_form(value):
    for tup in CommonlyUsedLodgingModel.TYPE_CHOICES:
        if tup[0] and tup[0].lower()==value.lower():
            return tup[1]
    return ""

@register.filter(name='location_full_form')
def location_full_form(value):
    for tup in CommonlyUsedLodgingModel.LOCATION_CHOICES:
        if tup[0] and tup[0].lower()==value.lower():
            return tup[1]
    return ""
