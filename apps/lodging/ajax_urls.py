from django.urls import path, re_path
from . import views

app_name="lodging_ajax"
urlpatterns = [
    path('create', views.LodgingView.as_view(), name="create"),
    re_path(r'^(?P<ad_id>[0-9]+)/?$', views.LodgingView.as_view(), name="edit"),
    path(r'^(?P<ad_id>[0-9]+)/<action>', views.LodgingView.as_view(), name="action"),
    path('tour-link/validate', views.verify_tour_link, name="validate-tour-link"),
    re_path(r'^(?P<lodging_id>[0-9]+)/twilio/confirm_vaccancy/?$', views.confirm_vaccancy, name='confirm-vaccancy'),
    re_path(r'^(?P<lodging_id>[0-9]+)/twilio/voice_response/?$', views.voice_response, name='voice-response'),
    re_path(r'^(?P<lodging_id>[0-9]+)/twilio/customer_voice_response/?$', views.customer_voice_response, name='customer-voice-response'),
    re_path(r'^(?P<lodging_id>[0-9]+)/twilio/gather_response/?$', views.gather_response, name='gather-response'),
    re_path(r'^(?P<lodging_id>[0-9]+)/twilio/complete_response/(?P<mobile_number>[0-9]+)/?$', views.complete_response, name='complete-response')
]