from django.urls import path
from . import views

app_name='home'
urlpatterns = [
    path('',views.front_page_view,name='front-page'),
    # re_path(r'location',views.choose_location_view,name='choose_location'),
    # re_path(r'business',views.choose_business_view,name='choose_business'),
]