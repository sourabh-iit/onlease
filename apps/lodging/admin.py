from django.contrib import admin
from .models import Lodging, CommonlyUsedLodgingModel

# Register your models here.
admin.site.register(Lodging)
admin.site.register(CommonlyUsedLodgingModel)