from django.shortcuts import render
from django.http import JsonResponse
from .models import Location


def locations_view(request):
    if request.method=='GET':
        if 'state' not in request.GET:
            locations = Location.objects.order_by('state').distinct('state')
            states = []
            for location in locations:
                states.append(location.state)
            return JsonResponse({'values':states})
        elif 'district' not in request.GET:
            state = request.GET['state']
            locations = Location.objects.filter(state=state).order_by('district').distinct('district')
            districts = []
            for location in locations:
                districts.append(location.district)
            return JsonResponse({'values':districts})
        else:
            state = request.GET['state']
            district = request.GET['district']
            locations = Location.objects.filter(state=state,district=district).order_by('region').distinct('region')
            regions=[]
            for location in locations:
                regions.append([location.id,location.region])
            return JsonResponse({'values':regions})