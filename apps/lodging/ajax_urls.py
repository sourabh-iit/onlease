from django.urls import path
from . import views

app_name="lodging_ajax"
urlpatterns = [
    path('create', views.lodging_create_view_ajax, name="create"),
]