from django.shortcuts import render
from .forms import AdsForm
from django.db.models import Q
from apps.lodging.models import Lodging, CommonlyUsedLodgingModel, ImageModel
from django.utils.http import urlencode
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.core.serializers.json import DjangoJSONEncoder
from apps.user.utils import ViewException
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
import datetime
from django.db.models.query import Prefetch
from apps.locations.models import Region
import os
from django.conf import settings
from django.core.paginator import Paginator

num_ads = 12

def reverse_location(location):
    for tup in CommonlyUsedLodgingModel.LOCATION_CHOICES:
        if tup[0] and tup[1].lower()==location.lower():
            return tup[0]
    raise ViewException('Invalid location value.')

@csrf_exempt
def ads_list_view(request,state,state_id,district,district_id):
    try:
        q=Q(
            region__state__id=state_id,
            region__district__id=district_id,
            available_from__lte=datetime.date.today()+
                        datetime.timedelta(days=15)
        )
        if request.method=='POST':
            form = AdsForm(state_id,district_id,request.POST)
            if form.is_valid():
                data = form.cleaned_data
                # min_rent, max_rent will always be available ensured by AdsForm
                # Similarly for 'lower_availability' and 'upper_availability'
                q &= Q(
                    rent__gte=int(data['min_rent']),
                    rent__lte=int(data['max_rent']),
                    available_from__gte=data['lower_availability'],
                    available_from__lte=data['upper_availability']
                )
                # at most one of 'ground floor' and 'top floor' should be true.
                # if floor value is 'any' then show all ads irrespective of floor number
                if data['floor']=='ground floor':
                    q &= Q(ground_floor=True)
                elif data['floor']=='top floor':
                    q &= Q(top_floor=True)
                # if parking is False then show bith values True and False
                if data['parking']:
                    q &= Q(is_parking_available=True)
                # if furnished is False then show bith values True and False
                if data['furnished']:
                    q &= Q(furnished=True)
                if data['kitchen']:
                    q &= Q(is_kitchen_available=True)
                if data['lodging_types']:
                    q_ = Q()
                    for lodging_type in data['lodging_types']:
                        q_ |= Q(lodging_type=lodging_type)
                    q &= q_
                if data['regions']:
                    q_ = Q()
                    for region in data['regions']:
                        q_ |= Q(region__id=region)
                    q &= q_
        else:
            form = AdsForm(state_id,district_id)
    except KeyError:
        messages.error(request,"Bad request")
    except ViewException:
        messages.error(request,'Location is not provided')
        return HttpResponseRedirect(reverse('ads:choose-location'))
    ads = CommonlyUsedLodgingModel.objects.prefetch_related(
            Prefetch(
                'lodging',queryset=Lodging.objects.select_related('posted_by')
            ),'images'
        ).filter(q).order_by('lodging__posted_at')
    for ad in ads:
        try:
            ad.image = ad.images.all()[0]
        except:
            ad.image = None
    page_no = 1
    if request.GET.get('page'):
        page_no = int(request.GET['page'])
    page = Paginator(ads,num_ads).page(page_no)
    return render(request,'ads/ad_list.html',
        {'form':form,'ads':page.object_list,'state':state,'district':district,
        'state_id':state_id,'district_id':district_id,'page':page})

@csrf_exempt
def ads_detail_view(request,state,state_id,district,district_id,slug,ad_id):
    redirection_url = reverse('ads:list',kwargs={
        'state':state,
        'state_id':state_id,
        'district':district,
        'district_id':district_id})
    try:
        lodging = CommonlyUsedLodgingModel.objects.prefetch_related("images",'lodging').get(pk=ad_id)
    except CommonlyUsedLodgingModel.DoesNotExist:
        messages.error(request,'Lodging with id '+ad_id+' does not exist')
        return HttpResponseRedirect(redirection_url)
    if lodging.is_booked:
        messages.error(request,'Lodging is already booked')
        return HttpResponseRedirect(redirection_url)
    context = {
        'ad': lodging,
        'images': lodging.images.all(),
        'state': state,
        'state_id': state_id,
        'district': district,
        'district_id': district_id,
        'ad_id': ad_id,
        'posted_by': lodging.lodging.posted_by
    }
    return render(request,'ads/detail.html',context)