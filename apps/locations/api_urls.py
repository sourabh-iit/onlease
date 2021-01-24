from django.urls import path

from . import views


app_name='locations'
urlpatterns = [
    path('all/', views.RegionListHandler.as_view(), name="regions"),
]