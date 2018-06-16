from django.urls import path
from . import views

app_name="lodging"
urlpatterns = [
    path('create/temporary', views.create_temporary_lodging, name="temporary"),
    path('create', views.lodging_create_view, name="create"),
    path('edit/<int:ad_id>', views.lodging_edit_view, name="edit"),
    path('image/upload/<ad_type>', views.image_upload_view, name="image-upload"),
]