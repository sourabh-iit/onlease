from django.http import JsonResponse
from django.db.models import Q

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