from django.contrib import admin
from .models import State, District, Region, Pincode

# Register your models here.
admin.site.register(State)
admin.site.register(District)
admin.site.register(Region)
admin.site.register(Pincode)