from django import template
from apps.roommate.models import RoomieAd
from apps.locations.models import Region
import datetime

register = template.Library()

@register.filter(name='full_form')
def full_form(value,arg):
	if arg=='gender':
		for gender_tuple in RoomieAd.GENDER_CHOICES:
			if gender_tuple[0]==value:
				return gender_tuple[1]
	elif arg=="types":
		types_list = []
		for type_id in value:
			for type_tuple in RoomieAd.TYPE_CHOICES:
				if type_tuple[0]==type_id:
					types_list.append(type_tuple[1])
					break
		return ', '.join(types_list)
	elif arg=="regions":
		regions_list = []
		for region in Region.objects.filter(id__in=value):
			regions_list.append(region.name)
		return ', '.join(regions_list)
