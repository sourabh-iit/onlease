from django.urls import path
from . import views

app_name="lodging_ajax"
urlpatterns = [
    path('create', views.LodgingView.as_view(), name="create"),
    path('<ad_id>', views.LodgingView.as_view(), name="edit"),
    path('<ad_id>/<action>', views.LodgingView.as_view(), name="action"),
    path('tour-link/validate', views.verify_tour_link, name="validate-tour-link"),
]