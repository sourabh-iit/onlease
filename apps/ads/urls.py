from django.urls import re_path, path
from . import views
from django.views.generic import TemplateView

app_name='ads'
urlpatterns = [
    path('ads_view', views.ads_view, name="ads-view"),
    path('ad_detail_view', views.ad_detail_view, name="ad-detail-view"),
    path('my-ads', views.my_ads_ajax, name="my-ads"),
    path('my-bookings', views.my_bookings_ajax, name="my-bookings"),
    path('ads_view/<int:page_no>', views.paginated_ads, name="paginated-ads"),
]