from django.urls import re_path, path
from . import views
from django.views.generic import TemplateView

app_name='ads'
urlpatterns = [
    path('lodging/choose_location', 
        TemplateView.as_view(template_name="ads/location_chooser.html"), 
        name="choose-location"),
    path('lodging/<state>/<state_id>/<district>/<district_id>',views.ads_list_view,name="list"),
    path('roomie/<state>/<state_id>/<district>/<district_id>',views.roomie_ads_list_view,name="roomie-list"),
    path('dealer/<state>/<state_id>/<district>/<district_id>',views.dealer_ads_list_view,name="dealer-list"),
    path('lodging/<state>/<state_id>/<district>/<district_id>/<str:slug>/<int:ad_id>',views.ads_detail_view,name="detail"),
    path('roomie/<state>/<state_id>/<district>/<district_id>/<int:ad_id>',views.roomie_ads_detail_view,name="roomie-detail"),
    # path('dealer/<state>/<state_id>/<district>/<district_id>/<int:ad_id>',views.dealer_ads_detail_view,name="dealer-detail"),
]