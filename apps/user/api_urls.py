from django.urls import re_path
from . import views

app_name="user-api"
urlpatterns = [
    re_path(r'^login/?$', views.LoginView.as_view(), name="login"),
    re_path(r'^logout/?$', views.LogoutView.as_view(), name="logout"),
    re_path(r'^register/?$', views.RegisterView.as_view(), name="register"),
    re_path(r'^contact/?$', views.UserContactView.as_view(), name="contact"),
    re_path(r'^me/profile-image/?$', views.ImageHandler.as_view(), name="profile-image"),
    re_path(r'^me/profile-image/(?P<image_id>[0-9]+)/?$', views.ImageHandler.as_view(), name="profile-image"),
    re_path(r'^me/(?P<action>[\w-]+)/?$', views.UserActionView.as_view(), name="user-action"),
    re_path(r'^password-reset/(?P<action>[\w-]+)/?$', views.PasswordResetView.as_view(), name="password=reset"),
]
