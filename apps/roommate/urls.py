from django.urls import path
from . import views

app_name="roommate"
urlpatterns = [
    path('create/',views.roomie_ad_create_view,name="create")
]