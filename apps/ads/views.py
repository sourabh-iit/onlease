from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse,\
  HttpResponse
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.db.models import Prefetch
from rest_framework.renderers import JSONRenderer
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator

import json
import datetime

from apps.roommate.models import RoomieAd
from apps.locations.models import Region
from apps.lodging.models import CommonlyUsedLodgingModel, Lodging
from apps.lodging.serializers import CommonLodgingSerializer
from apps.transactions.models import LodgingTransaction

User = get_user_model()

num_ads_per_page = 10

def get_paginated_data(ads,page_no=1):
  paginator = Paginator(ads,num_ads_per_page)
  page = paginator.page(page_no)
  return page.object_list, page.has_next()

def get_ads(request):
  regions = request.GET.getlist('regions')
  if request.GET.get('business')=='MATES':
    ads = RoomieAd.objects.prefetch_related('images').filter(regions__overlap=regions)
    business='MATES'
    template_name='ads_view.html'
  else:
    ads = CommonlyUsedLodgingModel.objects.prefetch_related(
      'images','region').filter(region__in=regions,is_booked=False)
    business='PROPERTY'
    template_name='property_ads_view.html'
  regions = Region.objects.select_related('state','district').filter(id__in=regions)
  regions_selected = []
  for region in regions:
    regions_selected.append({
      'id':region.id,'region':region.name,
      'state':region.state.name,'district':region.district.name})
  return ads, business, template_name, regions_selected

def ads_view(request):
  ads, business, template_name, regions_selected = get_ads(request)
  ads, has_next_page = get_paginated_data(ads)
  context = {
    'ads': ads,
    'ads_json': json.dumps(CommonLodgingSerializer(ads,many=True).data),
    'business':  business,
    'regions': regions_selected,
    'has_next_page': has_next_page,
  }
  return render(request,'ads/'+template_name,context)

def paginated_ads(request,page_no):
  ads, business, template_name, regions = get_ads(request)
  ads, has_next_page = get_paginated_data(ads,page_no)
  return JsonResponse({
    'ads': CommonLodgingSerializer(ads,many=True).data,
    'has_next_page': has_next_page,
  })

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

def my_bookings_ajax(request):
  sublodging = CommonlyUsedLodgingModel.objects.\
    prefetch_related('lodging','images','region','charges').\
    filter(lodging__purchased_by=request.user)
  return JsonResponse({
    'data':json.dumps(CommonLodgingSerializer(sublodging,many=True).data)
  })
