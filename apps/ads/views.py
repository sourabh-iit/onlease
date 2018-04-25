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

def reverse_location(location):
    for tup in CommonlyUsedLodgingModel.LOCATION_CHOICES:
        if tup[0] and tup[1].lower()==location.lower():
            return tup[0]
    raise ViewException('Invalid location value.')

@csrf_exempt
def ads_list_view(request,location):
    try:
        location_ = reverse_location(location)
        if request.method=='POST':
            form = AdsForm(request.POST)
            if form.is_valid():
                data = form.cleaned_data
                print(data)
                print(location_)
                # min_rent, max_rent will always be available ensured by AdsForm
                # Similarly for 'lower_availability' and 'upper_availability'
                q = Q(
                    is_booked=False,
                    location=location_,
                    rent__gte=int(data['min_rent']),
                    rent__lte=int(data['max_rent']),
                    available_from__gte=data['lower_availability'],
                    available_from__lte=data['upper_availability']
                )
                print(CommonlyUsedLodgingModel.objects.filter(q).count())
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
                    location=location_,
                    available_from__lte=datetime.date.today()+
                    datetime.timedelta(days=15)).prefetch_related('images')
        else:
            form = AdsForm()
            ads = CommonlyUsedLodgingModel.objects.filter(
                    location=location_,
                    available_from__lte=datetime.date.today()+
                    datetime.timedelta(days=15)).prefetch_related('images')
    except KeyError:
        messages.error(request,"Bad request")
    except ViewException:
        messages.error(request,'Location is not provided')
        return HttpResponseRedirect(reverse('ads:choose-location'))
    return render(request,'ads/ad_list.html',
        {'form':form,'ads':ads,'location':location})

@csrf_exempt
def ads_detail_view(request,ad_id,slug):
    redirection_url = reverse('ads:choose-location')
    try:
        lodging = CommonlyUsedLodgingModel.objects.prefetch_related("images").get(pk=ad_id)
    except CommonlyUsedLodgingModel.DoesNotExist:
        messages.error(request,'Lodging with id '+ad_id+' does not exist')
        return HttpResponseRedirect(request,redirection_url)
    if lodging.is_booked:
        messages.error(request,'Lodging is already booked')
        return HttpResponseRedirect(request,redirection_url)
    context = {
        'ad': lodging,
        'images': lodging.images.all()
    }
    return render(request,'ads/detail.html',context)