from django.contrib import admin
from .models import User, Address, MobileNumber, Agreement, AgreementPoint


class UserAdmin(admin.ModelAdmin):
    list_display = ('mobile_number', 'email', 'first_name', 'last_name', 'created_at', 'user_type')


class AddressAdmin(admin.ModelAdmin):
    list_display = ('id', 'region', 'text', 'user')


class MobileNumberAdmin(admin.ModelAdmin):
    list_display = ('id', 'value', 'user', 'created_at')


class AgreementAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at', 'title')


class AgreementPointAdmin(admin.ModelAdmin):
    list_display = ('id', 'text', 'agreement')


admin.site.register(User, UserAdmin)
admin.site.register(Address, AddressAdmin)
admin.site.register(MobileNumber, MobileNumberAdmin)
admin.site.register(Agreement, AgreementAdmin)
admin.site.register(AgreementPoint, AgreementPointAdmin)
