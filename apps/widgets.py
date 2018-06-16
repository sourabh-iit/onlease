from django_select2.forms import ModelSelect2Widget
from apps.locations.models import Region
from django.urls import reverse


class CustomSelect2Widget(ModelSelect2Widget):
    model = Region
    search_fields = [
        'name__icontains',
        'state__name__icontains',
        'district__name__icontains'
    ]

    def get_url(self):
        return reverse('locations:regions')

    def label_from_instance(self, obj):
        return obj.name.capitalize() + ' ' + obj.district.name.capitalize() + ' ' + obj.state.name.capitalize()