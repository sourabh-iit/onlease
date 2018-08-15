from django.urls import re_path, path
from . import views
from django_select2.views import AutoResponseView


app_name='locations'
urlpatterns = [
    path('regions2/',views.regions_view,name="regions2"),
    path('regions',AutoResponseView.as_view(),name="regions"),
]