from django.http import JsonResponse
from django.db.models import Q
from django.views.decorators.http import require_POST
import googlemaps
from googlemaps.exceptions import ApiError, TransportError, HTTPError, Timeout
from django.conf import settings

from .models import State, Region, District


def regions_view(request):
  data = request.GET
  business = "MATES"
  try:
    key = data['q']
    business = data['business']
    regions = Region.objects.prefetch_related('state','district','lodgings').filter(
      Q(name__icontains=key)|Q(district__name__icontains=key)|Q(state__name__icontains=key))[:20]
  except KeyError:
    regions = []
  serialized_data = []
  for region in regions:
    ads=-1
    if business.lower()=='property':
      ads=region.lodgings.count()
    serialized_data.append({
      'id':region.id,
      'region':region.name,
      'state': region.state.name,
      'district': region.district.name,
      'ads': ads
    })
  return JsonResponse({'results':serialized_data})

@require_POST
def current_location_view(request):
  data = request.POST
  if not (data.get('lat') and data.get('lng')):
    return JsonResponse({'errors':'Latitude and Longitude values are missing.'},status=400)
  gmaps_exception=googlemaps.exceptions
  try:
    gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)
    reverse_geocode_result = gmaps.reverse_geocode((data['lat'], data['lng']))
  except ApiError as e:
    return JsonResponse({'errors': {'__all__': [e.message]}},status=400)
  except Timeout:
    return JsonResponse({'errors': {'__all__': ['Connection timed out. Try again later']}},status=400)
  except TransportError:
    return JsonResponse({'errors': {'__all__': ['Something went wrong while trying to execute the request.']}},status=400)
  except HTTPError:
    return JsonResponse({'errors': {'__all__': ['An unexpected HTTP error occurred.']}},status=400)
  return JsonResponse({'result': reverse_geocode_result})
