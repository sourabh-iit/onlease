from django import forms
from django_select2.forms import Select2MultipleWidget
from apps.widgets import CustomSelect2MultipleWidget

from apps.locations.models import Region, District
from apps.roommate.models import RoomieAd


class CommonQueryForm(forms.Form):
    region = forms.ChoiceField(widget=CustomSelect2MultipleWidget)
    types = forms.MultipleChoiceField(
        choices=RoomieAd.TYPE_CHOICES[1:],required=False,
        widget=Select2MultipleWidget)
    min_rent = forms.CharField(initial=0,widget = forms.TextInput(attrs={'readonly':True}))
    max_rent = forms.CharField(initial=1000000,widget = forms.TextInput(attrs={'readonly':True}))


class CommonQueryFormMixin(object):
    def __init__(self, *args, **kwargs):
        super(CommonQueryFormMixin,self).__init__(*args,**kwargs)
        if 'region' in self.data:
            self.fields['region'].queryset = Region.objects.all()

    def clean_min_rent(self):
        if not self.cleaned_data.get('min_rent') or self.cleaned_data['min_rent']<0:
            return 0
        return self.cleaned_data.get('min_rent')

    def clean_max_rent(self):
        if not self.cleaned_data.get('max_rent') or self.cleaned_data['max_rent']>1000000:
            return 10000000
        return self.cleaned_data.get('max_rent') 