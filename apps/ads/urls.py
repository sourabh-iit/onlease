from django.urls import re_path, path
from .views import ads_detail_view, ads_list_view
from django.views.generic import TemplateView

app_name='ads'
urlpatterns = [
    path('lodging/choose_location', 
        TemplateView.as_view(template_name="ads/location_chooser.html"), 
        name="choose-location"),
    path('lodging/<location>',ads_list_view,name="list"),
    path('lodging/<int:ad_id>/<str:slug>',ads_detail_view,name="detail"),
]