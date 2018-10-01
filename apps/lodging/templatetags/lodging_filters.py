from django import template
from apps.lodging.models import CommonlyUsedLodgingModel
from apps.locations.models import Region
from apps.image.models import ImageModel
import datetime
import ast

register = template.Library()


FACILITY_ICON = {
  'K': 'utensils',
  'P': 'car',
  'A': 'plug',
}


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
  elif arg=="furnishing":
    choices=CommonlyUsedLodgingModel.FURNISHING_CHOICES 
    model_value=value.furnishing
  elif arg=='facilities':
    facilities = ast.literal_eval(value.facilities)
    if len(facilities)==0:
      return [{'value': 'None available', 'icon': 'check-trash'}]
    else:
      l = []
      for tup in CommonlyUsedLodgingModel.FACILITIES_AVAILABLE_CHOICES:
        if tup[0] in facilities:
          l.append({
            'value': tup[1],
            'icon': FACILITY_ICON[tup[0]],
          })
      return l
          
  elif arg=='image_tag':
    choices=ImageModel.LODGING_TAG_CHOICES
    model_value=value.tag
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


@register.filter(name="phone_numbers")
def style_number(value):
  phone_numbers = [value.posted_by.mobile_number]
  for mobile_number in value.posted_by.mobile_numbers.all():
    phone_numbers.append(mobile_number.value)
  return ', '.join(phone_numbers)


@register.filter(name='fixed_length')
def fixed_length(value,arg):
  l = int(arg)
  if len(value)<=l:
    return value
  else:
    return value[0:l-4]+'...'
