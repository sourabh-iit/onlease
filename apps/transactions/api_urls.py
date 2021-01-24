from django.urls import path, re_path
from . import views

app_name="transactions-api"
urlpatterns = [
    re_path(r'^lodging/(?P<lodging_id>[0-9]+)/(?P<gateway>[0-9]+)/(?P<action>[\w-]+)/?$', views.TransactionHandler.as_view(), name='lodging-actions'),
]