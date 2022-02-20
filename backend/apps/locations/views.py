from apps.clients.google_maps import GoogleMapsClient

from rest_framework.views import APIView
from rest_framework.response import Response

class RegionListHandler(APIView):

  def __init__(self) -> None:
      self.client = GoogleMapsClient()

  def get(self, request):
    q = request.query_params.get('q')
    suggestions = self.client.autocomplete(q)
    return Response(suggestions)

# def current_location_view(request):
#   data = request.POST
#   if not (data.get('lat') and data.get('lng')):
#     return JsonResponse({'errors':{'__all__':['Latitude and Longitude values are missing.']}},status=400)
#   gmaps_exception=googlemaps.exceptions
#   try:
#     gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)
#     reverse_geocode_result = gmaps.reverse_geocode((data['lat'], data['lng']))
#   except ApiError as e:
#     return JsonResponse({'errors': {'__all__': [e.message]}},status=400)
#   except Timeout:
#     return JsonResponse({'errors': {'__all__': ['Connection timed out. Try again later']}},status=400)
#   except TransportError:
#     return JsonResponse({'errors': {'__all__': ['Something went wrong while trying to execute the request.']}},status=400)
#   except HTTPError:
#     return JsonResponse({'errors': {'__all__': ['An unexpected HTTP error occurred.']}},status=400)
#   return JsonResponse({'result': reverse_geocode_result})
