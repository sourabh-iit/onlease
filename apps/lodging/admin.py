from django.contrib import admin
from .models import Lodging, CommonlyUsedLodgingModel, ImageModel

# Register your models here.
admin.site.register(Lodging)
admin.site.register(CommonlyUsedLodgingModel)
admin.site.register(ImageModel)