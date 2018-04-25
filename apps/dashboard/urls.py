from django.urls import path
from . import views

app_name='dashboard'
urlpatterns = [
    path('',views.home_view,name="home"),
    path('edit-profile',views.home_view,name="edit-profile"),
]