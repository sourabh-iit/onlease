from django import forms
import datetime
from django.forms import ValidationError
from apps.lodging.models import CommonlyUsedLodgingModel
from apps.locations.models import Region, District
from apps.roommate.models import RoomieAd
from apps.user.models import User
from django_select2.forms import Select2MultipleWidget
from apps.widgets import CustomSelect2Widget
from django.urls import reverse
from apps.locations.views import regions_view
from django.conf import settings


lower_availability = datetime.date.today()-datetime.timedelta(days=6*30)

class CommonQueryForm(forms.Form):
    region = forms.ChoiceField(widget=CustomSelect2Widget)
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
        

class AdsForm(CommonQueryFormMixin,CommonQueryForm):
    FLOOR_CHOICES = (
        ('ground floor','Ground floor'),
        ('top floor','Top floor'),
        ('any','Any')
    )
    lower_availability = forms.DateField(initial=lower_availability,
            required=False)
    upper_availability = forms.DateField(initial=datetime.date.today()+
        datetime.timedelta(days=15),required=False)
    floor = forms.ChoiceField(choices=FLOOR_CHOICES,widget=forms.RadioSelect
        ,required=False,initial=FLOOR_CHOICES[2])
    furnished = forms.BooleanField(initial=False,required=False)
    parking = forms.BooleanField(initial=False,required=False)
    kitchen = forms.BooleanField(initial=False,required=False)

    def __init__(self,state_id, district__id, *args, **kwargs):
        super(AdsForm,self).__init__(*args,**kwargs)
        self.fields['regions'] = forms.MultipleChoiceField(required=False,
            widget=forms.CheckboxSelectMultiple,
            choices=[(str(region.id),region.name) for region in Region.objects.filter(district__id=district__id,state__id=state_id)])

    def clean_lower_availablity(self):
        if not self.cleaned_data.get('lower_availablity') or self.cleaned_data['lower_availablity']<datetime.date.today():
            return lower_availability
        return self.cleaned_data.get('lower_availablity')

    def clean_upper_availablity(self):
        if not self.cleaned_data.get('upper_availablity') or self.cleaned_data['upper_availablity']>datetime.date.today()+datetime.timedelta(days=15):
            return datetime.date.today()+datetime.timedelta(days=15)
        return self.cleaned_data.get('upper_availablity')

    def clean(self):
        if self.cleaned_data.get('ground_floor') and self.cleaned_data.get('top_floor'):
            raise ValidationError('Choose either ground floor or top floor.',code="invalid")
            

class RoomieAdsForm(CommonQueryFormMixin,CommonQueryForm):
    pass


class LandingPageForm(CommonQueryFormMixin,CommonQueryForm):
    business = forms.ChoiceField(choices=[
        ('MATES','MATES'),('BROKERS','BROKERS'),('OWNERS','OWNERS')],
        widget=forms.HiddenInput,initial="MATES")
