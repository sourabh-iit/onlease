from .models import State, Region, District
from django.http import JsonResponse

def locations_view(request):
    data = request.GET
    if 'state' not in data:
        response=[]
        states = State.objects.all()
        for state in states:
            response.append({'id':state.id,'name':state.name})
        return JsonResponse({'values':response})
    elif 'district' not in data:
        districts = District.objects.filter(state__id=data['state'])
        response = []
        for district in districts:
            response.append({'id':district.id,'name':district.name})
        return JsonResponse({'values':response})
    elif 'region' not in data:
        regions = Region.objects.filter(
            district__id=data['district'])
        response = []
        for region in regions:
            response.append({'id':region.id,'name':region.name})
        return JsonResponse({'values':response})


def regions_view(request):
    data = request.GET
    try:
        key = data['district_key']
        regions = Region.objects.prefetch_related('state','district').filter(Q(name__icontains=key,district__name__icontains=key,state__name__icontains=key))[:20]
        serialized_data = []
        for region in regions:
            serialized_data.append({
                'id':region.id,
                'name':region.name,
                'district':region.district.name,
                'state':region.state.name
            })
        return JsonResponse({'regions':serialized_data})
    except:
        return JsonResponse({'regions':[]})