from django.urls import path
from django.views.generic import TemplateView

app_name='legal'
urlpatterns = [
    path('privacy',TemplateView.as_view(template_name="legal/privacy.html"),name="privacy"),
    path('terms',TemplateView.as_view(template_name="legal/terms.html"),name="terms"),
]