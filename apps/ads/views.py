from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.db.models import Prefetch

from apps.roommate.models import RoomieAd
from apps.locations.models import Region
from apps.lodging.models import CommonlyUsedLodgingModel, Lodging

User = get_user_model()

def ads_view(request):
  regions = request.GET.getlist('regions')
  if request.GET.get('business')=='MATES':
    ads = RoomieAd.objects.prefetch_related('images').filter(regions__overlap=regions)
    business='MATES'
    template_name='ads_view.html'
  elif request.GET.get('business')=='PROPERTY':
    ads = CommonlyUsedLodgingModel.objects.prefetch_related(
      'images','region').filter(region__in=regions)
    business='PROPERTY'
    template_name='property_ads_view.html'
  regions = Region.objects.select_related('state','district').filter(id__in=regions)
  regions_selected = []
  for region in regions:
    regions_selected.append({'id':region.id,'region':region.name,'state':region.state.name,'district':region.district.name})
  context = {
    'ads': ads,
    'business':  business,
    'regions': regions_selected
  }
  return render(request,'ads/'+template_name,context)
  messages.error(request,'Invalid request')
  return HttpResponseRedirect(reverse('home:front-page'))

def ad_detail_view(request):
  try:
    business = request.GET.get('business')
    if business=='PROPERTY':
      sublodging = CommonlyUsedLodgingModel.objects.prefetch_related('lodging','images','region','charges').get(id=request.GET.get('id'))
      lodging = sublodging.lodging
      return render(request,'ads/ad_detail.html',{'lodging':lodging,'sublodging':sublodging})
    return HttpResponse('');
  except Lodging.DoesNotExist:
    messages.error(request,'Ad does not exist or has been deleted.')
    return HttpResponseRedirect('/')
