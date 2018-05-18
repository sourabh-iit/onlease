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
