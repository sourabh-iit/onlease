from django.urls import path, re_path
from . import views

app_name="transactions"
urlpatterns = [
    path('lodging-instamojo-redirection',views.lodging_redirection_view,name="lodging-redirection"),
    path('lodging',views.lodging_transaction_view,name="lodging"),
    path('lodging/webhook',views.lodging_webhook_view,name="lodging-webhook")
]