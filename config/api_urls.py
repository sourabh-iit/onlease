from django.urls import path, include

urlpatterns = [
    path('account/', include('apps.user.api_urls')),
    path('lodging/', include('apps.lodging.api_urls')),
    path('regions/', include('apps.locations.api_urls')),
    path('transactions/', include('apps.transactions.api_urls'))
]