from django.urls import path, re_path
from . import views
from django.views.generic import TemplateView

app_name="transactions"
urlpatterns = [
    path('lodging/instamojo-post-redirection',views.lodging_post_redirection_view,name="lodging-post-redirection"),
    path('lodging/<state>/<district>/<ad_id>/redirect-to-instamojo',views.redirect_to_instamojo_view,name="lodging-redirect-to-instamojo"),
    path('lodging/<state>/<district>/<ad_id>',views.confirm_order_view,name="lodging"),
    path('lodging/webhook',views.lodging_webhook_view,name="lodging-webhook")
]