from django.contrib import admin
from .models import User, ContactModel, MobileNumber


admin.site.register(User)
admin.site.register(ContactModel)
admin.site.register(MobileNumber)