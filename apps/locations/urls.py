from django.urls import re_path, path
from . import views
from django_select2.views import AutoResponseView


app_name='locations'
urlpatterns = [
    path('',views.locations_view,name="locations"),
    path('regions',AutoResponseView.as_view(),name="regions"),
]