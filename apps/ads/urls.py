from django.urls import re_path, path
from . import views
from django.views.generic import TemplateView

app_name='ads'
urlpatterns = [
    path('', views.ads_view, name="ads-view"),
    re_path(r'^(?P<lodging_id>[0-9]+)/(?P<lodging_slug>[\w\- ]+)/?$', views.ad_detail_view, name="ad-detail-view"),
    path('my-ads', views.my_ads_ajax, name="my-ads"),
    path('my-bookings', views.my_bookings_ajax, name="my-bookings"),
    path('my_favorite_properties', views.my_favorite_properties, name="my-favorite-properties"),
    path('<int:page_no>', views.paginated_ads, name="paginated-ads"),
    path('details/<int:lodging_id>',views.get_ad_contact_details, name="property-details")
]