from django.urls import re_path
from . import views

app_name="user-api"
urlpatterns = [
    re_path(r'^login/?$', views.LoginView.as_view(), name="login"),
    re_path(r'^logout/?$', views.LogoutView.as_view(), name="logout"),
    re_path(r'^register/(?P<action>[\w-]+)/?$', views.RegisterView.as_view(), name="register"),
    re_path(r'^contact/?$', views.UserContactView.as_view(), name="contact"),
    re_path(r'^me/profile-image/?$', views.ImageHandler.as_view(), name="profile-image"),
    re_path(r'^me/profile-image/(?P<image_id>[0-9]+)/?$', views.ImageHandler.as_view(), name="profile-image"),
    re_path(r'^me/?$', views.UserHandler.as_view(), name="user-detail"),
    re_path(r'^me/(?P<action>[\w-]+)/?$', views.UserActionHandler.as_view(), name="user-action"),
    re_path(r'^me/number/(?P<number_id>[0-9]+)/?$', views.MobileNumberHandler.as_view(), name="delete-number"),
    re_path(r'^me/number/(?P<action>[\w-]+)/?$', views.MobileNumberHandler.as_view(), name="user-action"),
    re_path(r'^password-reset/(?P<action>[\w-]+)/?$', views.PasswordResetView.as_view(), name="password=reset"),
    re_path(r'^agreements/?$', views.AgreementListHandler.as_view(), name="agreements"),
    re_path(r'^agreements/(?P<agreement_id>[0-9]+)/?$', views.AgreementHandler.as_view(), name="agreement"),
    re_path(r'^addresses/?$', views.AddressListHandler.as_view(), name="addresses"),
    re_path(r'^address/(?P<address_id>[0-9]+)/?$', views.AddressHandler.as_view(), name="address"),
]
