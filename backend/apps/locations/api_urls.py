from django.urls import re_path

from . import views


app_name='locations'
urlpatterns = [
    re_path(r'^all/?$', views.RegionListHandler.as_view(), name="regions"),
]