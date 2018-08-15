from django.conf import settings

def settings_variable(request):
    return {
        'API_PREFIX': settings.BASE_URL,
    }