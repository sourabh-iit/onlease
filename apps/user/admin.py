from django.contrib import admin
from .models import User, ContactModel


admin.site.register(User)
admin.site.register(ContactModel)