from django.urls import re_path, path
from . import views


app_name='locations'
urlpatterns = [
    path('regions2/',views.regions_view,name="regions2"),
]