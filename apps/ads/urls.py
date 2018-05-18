from django.urls import re_path, path
from .views import ads_detail_view, ads_list_view
from django.views.generic import TemplateView

app_name='ads'
urlpatterns = [
    path('lodging/choose_location', 
        TemplateView.as_view(template_name="ads/location_chooser.html"), 
        name="choose-location"),
    path('lodging/<state>/<state_id>/<district>/<district_id>',ads_list_view,name="list"),
    path('lodging/<state>/<state_id>/<district>/<district_id>/<str:slug>/<int:ad_id>',ads_detail_view,name="detail"),
]