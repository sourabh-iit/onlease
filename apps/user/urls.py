from django.contrib import admin
from django.urls import path
from . import views
from django.urls import reverse

app_name="user"
urlpatterns = [
    path('', views.loginView),
    path('validate-otp/', views.validate_otp, name="validate-otp"),
    path('request-otp/', views.request_otp, name="request-otp"),
    path('login/', views.loginView, name="login"),
    path('logout/', views.logoutView, name="logout"),
    path('contact/', views.contact_view, name="contact"),
    path('register/', views.register_view, name="register"),
    path('reset-password/', views.reset_password_view, name="reset-password"),
    path('change-password/', views.PasswordChangeView2.as_view(), name="change-password"),
]
