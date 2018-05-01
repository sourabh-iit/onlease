from django.contrib import admin
from django.urls import path
from . import views
from django.urls import reverse
from django.views.generic import RedirectView

app_name="user"
urlpatterns = [
    path('', RedirectView.as_view(pattern_name='user:login')),
    path('verfiy-number/', views.verfiy_number, name="verify-number"),
    path('request-otp/', views.request_otp, name="request-otp"),
    path('login/', views.loginView, name="login"),
    path('logout/', views.logoutView, name="logout"),
    path('contact/', views.contact_view, name="contact"),
    path('register/', views.register_view, name="register"),
    path('reset-password/', views.reset_password_view, name="reset-password"),
    path('change-password/', views.PasswordChangeView2.as_view(), name="change-password"),
]
