from django.shortcuts import render
from .forms import AdsForm
from django.db.models import Q
from apps.lodging.models import Lodging, CommonlyUsedLodgingModel
from django.utils.http import urlencode
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.core.serializers.json import DjangoJSONEncoder
from apps.user.utils import ViewException
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
import datetime
from apps.locations.models import Location

def reverse_location(location):
    for tup in CommonlyUsedLodgingModel.LOCATION_CHOICES:
        if tup[0] and tup[1].lower()==location.lower():
            return tup[0]
    raise ViewException('Invalid location value.')

@csrf_exempt
def ads_list_view(request,state,district):
    try:
        if request.method=='POST':
            form = AdsForm(state,district,request.POST)
            if form.is_valid():
                data = form.cleaned_data
                # min_rent, max_rent will always be available ensured by AdsForm
                # Similarly for 'lower_availability' and 'upper_availability'
                q = Q(
                    location__state=state,
                    location__district=district,
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
                ads = CommonlyUsedLodgingModel.objects.filter(q).prefetch_related('images')
            else:
                # messages.error(form)
                ads = CommonlyUsedLodgingModel.objects.filter(
                    location__state=state,
                    location__district=district,
                    available_from__lte=datetime.date.today()+
                        datetime.timedelta(days=15)).prefetch_related('images')
        else:
            form = AdsForm(state,district)
            ads = CommonlyUsedLodgingModel.objects.filter(
                    location__state=state,
                    location__district=district,
                    available_from__lte=datetime.date.today()+
                    datetime.timedelta(days=15)).prefetch_related('images')
    except KeyError:
        messages.error(request,"Bad request")
    except ViewException:
        messages.error(request,'Location is not provided')
        return HttpResponseRedirect(reverse('ads:choose-location'))
    return render(request,'ads/ad_list.html',
        {'form':form,'ads':ads,'state':state,'district':district})

@csrf_exempt
def ads_detail_view(request,state,district,ad_id,slug):
    redirection_url = reverse('ads:list',kwargs={'state':state,'district':district})
    try:
        lodging = CommonlyUsedLodgingModel.objects.prefetch_related("images").get(pk=ad_id)
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
        'district': district,
        'ad_id': ad_id
    }
    return render(request,'ads/detail.html',context)