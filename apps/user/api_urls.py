from django.urls import path
from . import views

app_name="user-api"
urlpatterns = [
    path('verify-number/', views.verfiy_number_ajax, name="verify-number"),
    path('request-otp/', views.request_otp_ajax, name="request-otp"),
    path('login/', views.loginView_ajax, name="login"),
    path('logout/', views.logoutView_ajax, name="logout"),
    path('contact/', views.contact_view_ajax, name="contact"),
    path('register/', views.register_view_ajax, name="register"),
    path('reset-password/', views.reset_password_view_ajax, name="reset-password"),
    path('change-password/', views.password_change_view_ajax, name="change-password"),
    path('add-number/<str:action>', views.add_mobile_number_ajax, name="add-number"),
    path('save-profile/',views.edit_profile_view, name="save-profile"),
]
