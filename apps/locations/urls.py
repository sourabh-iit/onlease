from django.urls import re_path, path
from . import views


app_name='locations'
urlpatterns = [
    path('',views.locations_view,name="locations"),
]