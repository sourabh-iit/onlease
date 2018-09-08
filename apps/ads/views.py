# from .forms import AdsForm, RoomieAdsForm
# from django.db.models import Q
# from apps.lodging.models import Lodging, CommonlyUsedLodgingModel, ImageModel
# from django.utils.http import urlencode
# from django.contrib.auth.decorators import login_required
# from django.core.serializers.json import DjangoJSONEncoder
# from apps.user.utils import ViewException
# from django.views.decorators.csrf import csrf_exempt
# import datetime
# from django.db.models.query import Prefetch
# from apps.locations.models import Region
# import os
# from django.conf import settings
# from django.core.paginator import Paginator
# from apps.roommate.models import RoomieAd
# from apps.user.utils import number_verfication_required

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

# num_dealers_per_page = 10

# num_ads = 12

# def reverse_location(location):
#     for tup in CommonlyUsedLodgingModel.LOCATION_CHOICES:
#         if tup[0] and tup[1].lower()==location.lower():
#             return tup[0]
#     raise ViewException('Invalid location value.')

# def ads_list_view(request,state,state_id,district,district_id):
#     try:
#         q=Q(
#             region__state__id=state_id,
#             region__district__id=district_id,
#             available_from__lte=datetime.date.today()+
#                         datetime.timedelta(days=15)
#         )
#         if request.method=='POST':
#             form = AdsForm(state_id,district_id,request.POST)
#             if form.is_valid():
#                 data = form.cleaned_data
#                 # min_rent, max_rent will always be available ensured by AdsForm
#                 # Similarly for 'lower_availability' and 'upper_availability'
#                 q &= Q(
#                     rent__gte=int(data['min_rent']),
#                     rent__lte=int(data['max_rent']),
#                     available_from__gte=data['lower_availability'],
#                     available_from__lte=data['upper_availability']
#                 )
#                 # at most one of 'ground floor' and 'top floor' should be true.
#                 # if floor value is 'any' then show all ads irrespective of floor number
#                 if data['floor']=='ground floor':
#                     q &= Q(ground_floor=True)
#                 elif data['floor']=='top floor':
#                     q &= Q(top_floor=True)
#                 # if parking is False then show bith values True and False
#                 if data['parking']:
#                     q &= Q(is_parking_available=True)
#                 # if furnished is False then show bith values True and False
#                 if data['furnished']:
#                     q &= Q(furnished=True)
#                 if data['kitchen']:
#                     q &= Q(is_kitchen_available=True)
#                 if data['lodging_types']:
#                     q_ = Q()
#                     for lodging_type in data['lodging_types']:
#                         q_ |= Q(lodging_type=lodging_type)
#                     q &= q_
#                 if data['regions']:
#                     q_ = Q()
#                     for region in data['regions']:
#                         q_ |= Q(region__id=region)
#                     q &= q_
#         else:
#             form = AdsForm(state_id,district_id)
#     except KeyError:
#         messages.error(request,"Bad request")
#     except ViewException:
#         messages.error(request,'Location is not provided')
#         return HttpResponseRedirect(reverse('ads:choose-location'))
#     ads = CommonlyUsedLodgingModel.objects.prefetch_related(
#             'region','images',
#             Prefetch(
#                 'lodging',queryset=Lodging.objects.select_related('posted_by')
#             )
#         ).filter(q).order_by('lodging__posted_at')
#     for ad in ads:
#         try:
#             ad.image = ad.images.all()[0]
#         except:
#             ad.image = None
#     page_no = 1
#     if request.GET.get('page'):
#         page_no = int(request.GET['page'])
#     page = Paginator(ads,num_ads).page(page_no)
#     return render(request,'ads/ad_list.html',
#         {'form':form,'ads':page.object_list,'state':state,'district':district,
#         'state_id':state_id,'district_id':district_id,'page':page})


# @login_required
# @number_verfication_required
# def roomie_ads_list_view(request,state,state_id,district,district_id):
#     try:
#         q=Q(
#             region__state__id=state_id,
#             region__district__id=district_id
#         )
#         if request.method=='POST':
#             form = RoomieAdsForm(state_id,district_id,request.POST)
#             if form.is_valid():
#                 data = form.cleaned_data
#                 q &= Q(
#                     rent__gte=int(data['min_rent']),
#                     rent__lte=int(data['max_rent']),
#                 )
#                 if data['types']:
#                     q_ = Q()
#                     for type in data['types']:
#                         q_ |= Q(type=type)
#                     q &= q_
#                 if data['regions']:
#                     q_ = Q()
#                     for region in data['regions']:
#                         q_ |= Q(region__id=region)
#                     q &= q_
#         else:
#             form = RoomieAdsForm(state_id,district_id)
#     except KeyError:
#         messages.error(request,"Bad request")
#     except ViewException:
#         messages.error(request,'Location is not provided')
#         return HttpResponseRedirect(reverse('ads:choose-location')+'?type=roomie')
#     ads = RoomieAd.objects.prefetch_related(
#             'region','images','user'
#         ).filter(q).order_by('-created_at')
#     for ad in ads:
#         try:
#             ad.image = ad.images.all()[0]
#         except:
#             ad.image = None
#     page_no = 1
#     if request.GET.get('page'):
#         page_no = int(request.GET['page'])
#     page = Paginator(ads,num_ads).page(page_no)
#     return render(request,'ads/roomie_ad_list.html',
#         {'form':form,'ads':page.object_list,'state':state,'district':district,
#         'state_id':state_id,'district_id':district_id,'page':page})


# def ads_detail_view(request,state,state_id,district,district_id,slug,ad_id):
#     redirection_url = reverse('ads:list',kwargs={
#         'state':state,
#         'state_id':state_id,
#         'district':district,
#         'district_id':district_id})
#     try:
#         lodging = CommonlyUsedLodgingModel.objects.prefetch_related("images",'lodging').get(pk=ad_id)
#     except CommonlyUsedLodgingModel.DoesNotExist:
#         messages.error(request,'Lodging with id '+ad_id+' does not exist')
#         return HttpResponseRedirect(redirection_url)
#     if lodging.is_booked:
#         messages.error(request,'Lodging is already booked')
#         return HttpResponseRedirect(redirection_url)
#     context = {
#         'ad': lodging,
#         'images': lodging.images.all(),
#         'state': state,
#         'state_id': state_id,
#         'district': district,
#         'district_id': district_id,
#         'ad_id': ad_id,
#         'posted_by': lodging.lodging.posted_by
#     }
#     return render(request,'ads/detail.html',context)

# @login_required
# @number_verfication_required
# def roomie_ads_detail_view(request,state,state_id,district,district_id,ad_id):
#     redirection_url = reverse('ads:roomie-list',kwargs={
#         'state':state,
#         'state_id':state_id,
#         'district':district,
#         'district_id':district_id})
#     try:
#         ad = RoomieAd.objects.prefetch_related("images",'region','user').get(pk=ad_id)
#     except RoomieAd.DoesNotExist:
#         messages.error(request,'Ad with id '+ad_id+' does not exist')
#         return HttpResponseRedirect(redirection_url)
#     if not ad.is_active:
#         messages.error(request,'Ad is not active any more')
#         return HttpResponseRedirect(redirection_url)
#     context = {
#         'ad': ad,
#         'images': ad.images.all(),
#         'state': state,
#         'state_id': state_id,
#         'district': district,
#         'district_id': district_id,
#         'ad_id': ad_id,
#         'posted_by': ad.user
#     }
#     return render(request,'ads/roomie_detail.html',context)

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
