from django import template
from apps.lodging.models import CommonlyUsedLodgingModel

register = template.Library()

@register.filter(name='get_class')
def get_class(value):
    if value:
        return "fa fa-check-circle green-text"
    return "fa fa-times-circle red-text"
