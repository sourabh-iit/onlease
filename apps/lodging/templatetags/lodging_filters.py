from django import template
from apps.lodging.models import CommonlyUsedLodgingModel
from apps.locations.models import Region
import datetime
import json

register = template.Library()


@register.filter(name='full_form')
def full_form(value, arg):
  model_value=""
  choices=[]
  if arg == "type":
    if value.lodging_type == CommonlyUsedLodgingModel.OTHER:
      return value.lodging_type_other
    choices=CommonlyUsedLodgingModel.RESIDENTIAL_CHOICES
    model_value=value.lodging_type
  elif arg=="flooring":
    if value.flooring==CommonlyUsedLodgingModel.OTHER:
      return value.flooring_other
    choices=CommonlyUsedLodgingModel.FLOORING_CHOICES
    model_value=value.flooring
  elif arg=="area_unit":
    choices=CommonlyUsedLodgingModel.MEASUREMENT_CHOICES
    model_value=value.area_unit
  elif arg=="furnishing":
    choices=CommonlyUsedLodgingModel.FURNISHING_CHOICES 
    model_value=value.furnishing
  elif arg=='facilities':
    if len(json.loads(value.facilities))==0:
      return 'N/A'
    else:
      return json.loads(value.facilities).join(', ')
  if not choices:
    return 'unknown'
  for type_tuple in choices:
    if type_tuple[0]==model_value:
      return type_tuple[1]
      break
  return 'Unknown'


def style(number):
  if number=='1':
    return 'st'
  elif number=='2':
    return 'nd'
  elif number=='3':
    return 'rd'
  else:
    return 'th'


@register.filter(name="style_number")
def style_number(value):
  value=str(value)
  if len(value)>1 and value[-2]=='1':
    return 'th'
  else:
    return style(value[-1])
  


@register.filter(name='fixed_length')
def fixed_length(value,arg):
  l = int(arg)
  if len(value)<=l:
    return value
  else:
    return value[0:l-4]+'...'
