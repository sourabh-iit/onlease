from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic import TemplateView

# handler500 = 'mysite.views.my_custom_error_view'

# TODO: handle all urls and load from angular

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('config.api_urls')),
    path('vrview/',TemplateView.as_view(template_name="vrview-master/index.html"),
                   name='vrview'),
    path('privacy-policy/', TemplateView.as_view(template_name='privacy-policy.html'), name="privacy-policy"),
    # re_path(r'.*', TemplateView.as_view(template_name=''))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)