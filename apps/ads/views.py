from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse,\
  HttpResponse
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.db.models import Prefetch
from rest_framework.renderers import JSONRenderer
from django.contrib.auth.decorators import login_required

import json
import datetime

from apps.roommate.models import RoomieAd
from apps.locations.models import Region
from apps.lodging.models import CommonlyUsedLodgingModel, Lodging
from apps.lodging.serializers import CommonLodgingSerializer
from apps.transactions.models import LodgingTransaction

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
    data = CommonLodgingSerializer(ads,many=True)
  regions = Region.objects.select_related('state','district').filter(id__in=regions)
  regions_selected = []
  for region in regions:
    regions_selected.append({
      'id':region.id,'region':region.name,
      'state':region.state.name,'district':region.district.name})
  context = {
    'ads': ads,
    'ads_json': json.dumps(CommonLodgingSerializer(ads,many=True).data),
    'business':  business,
    'regions': regions_selected,
    'data': json.dumps(data.data)
  }
  return render(request,'ads/'+template_name,context)

@login_required
def ad_detail_view(request):
  try:
    business = request.GET.get('business')
    if business=='PROPERTY':
      sublodging = CommonlyUsedLodgingModel.objects.\
        prefetch_related('lodging','images','region','charges').\
        get(id=request.GET.get('id'))
      lodging = sublodging.lodging
      show_contact_details = False
      try:
        if lodging.posted_by == request.user:
          show_contact_details=True
        else:
          _transactions = LodgingTransaction.objects.filter(lodging=lodging,
            user=request.user,status=LodgingTransaction.SUCCESS)
          if len(_transactions)>0:
            latest_transation = _transactions[0]
            for _transaction in _transactions:
              if _transaction.updated_at>latest_transation:
                latest_transation=_transaction
            if latest_transation.updated_at>lodging.available_from:
              show_contact_details=True
      except LodgingTransaction.DoesNotExist:
        pass
      time_diff = datetime.datetime.now() - sublodging.last_time_booking
      if sublodging.is_booking and time_diff.seconds > 3*60:
        sublodging.is_booking=False
        sublodging.save()
      return render(request,'ads/ad_detail.html',{
        'lodging':lodging,
        'sublodging':sublodging,
        'data': json.dumps(CommonLodgingSerializer(sublodging).data),
        'show_contact_details': show_contact_details
      })
    return HttpResponse('')
  except Lodging.DoesNotExist:
    messages.error(request,'Ad does not exist or has been deleted.')
    return HttpResponseRedirect('/')

def my_ads_ajax(request):
  sublodging = CommonlyUsedLodgingModel.objects.\
    prefetch_related('lodging','images','region','charges').\
    filter(lodging__posted_by=request.user)
  return JsonResponse({
    'data':json.dumps(CommonLodgingSerializer(sublodging,many=True).data)
  })
