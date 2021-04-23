from django.urls import re_path

from . import views


app_name = 'custom_admin'
urlpatterns = [
    re_path(r'^map/lodgings?$', views.MapLodgingListHandler.as_view(), name="map-lodgings"),
]