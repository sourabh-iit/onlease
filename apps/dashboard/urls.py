from django.urls import path
from . import views

app_name='dashboard'
urlpatterns = [
    path('',views.home_view,name="home"),
    path('refund/<transaction_id>',views.refund_view,name="refund"),
    path('profile',views.edit_profile_view,name="profile"),
]