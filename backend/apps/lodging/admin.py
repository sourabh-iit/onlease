from django.contrib import admin
from django import forms

from .models import Lodging, Charge

class LodgingForm(forms.ModelForm):
    facilities = forms.MultipleChoiceField(choices=Lodging.FACILITIES_AVAILABLE_CHOICES, widget=forms.SelectMultiple)
    class Meta:
        model = Lodging
        fields = ('__all__')


class LodgingAdmin(admin.ModelAdmin):
    form = LodgingForm
    list_display = ('id', 'address', 'lodging_type', 'lodging_type_other', 'posted_by',
                    'total_floors', 'floor_no', 'last_confirmed', 'is_confirming', 'reference')
    date_hierarchy = 'posted_at'
    exclude = ('posted_at', 'updated_at', 'no_times_booked', 'last_confirmed', 'is_confirming', 'bookedBy', 'top_floor', 'ground_floor')


class ChargeAdmin(admin.ModelAdmin):
    list_display = ('id', 'amount', 'description', 'is_per_month', 'lodging')


admin.site.register(Lodging, LodgingAdmin)
admin.site.register(Charge, ChargeAdmin)