from django.contrib import admin
from django.urls import path
from . import views

app_name="image"
urlpatterns = [
    path('upload/image/<ad_type>/', views.image_upload_view, name="upload"),
    path('image/<action>', views.image_action_view, name="action"),
]
