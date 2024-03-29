from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic import TemplateView
from django.http import HttpResponse

def not_found_handler(request, exception=None):
    return HttpResponse('Url not found', status=404)

urlpatterns = [
    path('admin/map', TemplateView.as_view(template_name='index.html')),
    path('admin/', admin.site.urls),
    path('api/', include('config.api_urls')),
    path('privacy-policy/', TemplateView.as_view(template_name='privacy-policy.html'), name="privacy-policy"),
    re_path(r'^$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^user/login/?$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^user/register/?$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^user/agreements/?$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^user/agreements/(?P<agreement_id>-?[0-9]+)/?$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^user/addresses/?$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^user/address/(?P<agreement_id>-?[0-9]+)/?$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^lodgings/?$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^lodgings/(?P<lodging_id>[0-9]+)/?$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^lodgings/edit/(?P<lodging_id>-?[0-9]+)/?$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^lodgings/details/(?P<lodging_id>-?[0-9]+)/?$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^user/me/profile/?$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^user/me/favorites/?$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^user/me/ads/?$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^user/me/bookings/?$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^user/me/change-password/?$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^user/me/add-number/?$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^user/me/agreements/?$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^user/me/addresses/?$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^transactions/(?P<trans_id>\w+)/?$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^transactions/', include("apps.transactions.urls")),
    re_path(r'^api/.*', not_found_handler),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)