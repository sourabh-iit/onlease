from django.apps import AppConfig


class LodgingConfig(AppConfig):
    name = 'apps.lodging'

    def ready(self):
        import apps.lodging.signal_handlers
