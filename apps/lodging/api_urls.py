from django.urls import re_path
from . import views

app_name="lodging_apis"
urlpatterns = [
    re_path(r'^create/?$', views.LodgingView.as_view(), name="create"),
    re_path(r'^list/?$', views.LodgingListView.as_view(), name="list"),
    re_path(r'^(?P<lodging_id>[0-9]+)/?$', views.LodgingView.as_view(), name="lodging"),
    re_path(r'^charges/(?P<lodging_id>[0-9]+)/?$', views.LodgingChargesHandler.as_view(), name="charges"),
    re_path(r'^(?P<lodging_id>[0-9]+)/(?P<action>[\w-]+)/?$', views.LodgingActionView.as_view(), name="action"),
    re_path(r'^my/(?P<action>[\w-]+)/?$', views.LodgingActionView.as_view(), name="action"),
    re_path(r'^tour-link/validate/?$', views.TourLink.as_view(), name="validate-tour-link"),
    re_path(r'^(?P<lodging_id>[0-9]+)/twilio/(?P<action>[\w-]+)/?$', views.TwilioHandler.as_view(), name='twilio-actions'),
    re_path(r'^images/(?P<image_id>[0-9]+)/?$', views.ImageHandler.as_view(), name='image'),
    re_path(r'^images/?$', views.ImageListHandler.as_view(), name='image-list'),
    re_path(r'^vrimages/(?P<image_id>[0-9]+)/?$', views.VRImageHandler.as_view(), name='vrimage'),
    re_path(r'^vrimages/?$', views.VRImageListHandler.as_view(), name='vrimage-list')
]