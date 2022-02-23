from django.urls import path, re_path
from . import views

app_name="transactions"
urlpatterns = [
    re_path(r'^(?P<trans_id>[0-9]+)/?$', views.TransactionHandler.as_view(), name='transaction'),
    re_path(r'^lodging/book/?$', views.LodgingBookingHandler.as_view(), name='lodging-booking'),
]