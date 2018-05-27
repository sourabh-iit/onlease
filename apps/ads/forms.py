from django import forms
import datetime
from django.forms import ValidationError
from apps.lodging.models import CommonlyUsedLodgingModel
from apps.locations.models import Region
from apps.roommate.models import RoomieAd
from apps.user.models import User

lower_availability = datetime.date.today()-datetime.timedelta(days=6*30)

class AdsForm(forms.Form):
    FLOOR_CHOICES = (
        ('ground floor','Ground floor'),
        ('top floor','Top floor'),
        ('any','Any')
    )
    lodging_types = forms.MultipleChoiceField(
        choices=CommonlyUsedLodgingModel.TYPE_CHOICES[1:],required=False,
        widget=forms.CheckboxSelectMultiple)
    min_rent = forms.IntegerField(initial=0,required=False)
    max_rent = forms.IntegerField(initial=1000000,required=False)
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

    def clean_min_rent(self):
        if not self.cleaned_data.get('min_rent') or self.cleaned_data['min_rent']<0:
            return 0
        return self.cleaned_data.get('min_rent')

    def clean_max_rent(self):
        if not self.cleaned_data.get('max_rent') or self.cleaned_data['max_rent']>1000000:
            return 10000000
        return self.cleaned_data.get('max_rent')

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
            

class RoomieAdsForm(forms.Form):
    types = forms.MultipleChoiceField(
        choices=RoomieAd.TYPE_CHOICES[1:],required=False,
        widget=forms.CheckboxSelectMultiple)
    min_rent = forms.IntegerField(initial=0,required=False)
    max_rent = forms.IntegerField(initial=1000000,required=False)
    with_room = forms.BooleanField(widget=forms.RadioSelect,required=False)
    gender = forms.MultipleChoiceField(choices=User.GENDER_CHOICES[1:],
        required=False,widget=forms.CheckboxSelectMultiple)
    
    def __init__(self,state_id, district__id, *args, **kwargs):
        super(RoomieAdsForm,self).__init__(*args,**kwargs)
        self.fields['regions'] = forms.MultipleChoiceField(required=False,
            widget=forms.CheckboxSelectMultiple,
            choices=[(str(region.id),region.name) for region in Region.objects.filter(district__id=district__id,state__id=state_id)])

    def clean_min_rent(self):
        if not self.cleaned_data.get('min_rent') or self.cleaned_data['min_rent']<0:
            return 0
        return self.cleaned_data.get('min_rent')

    def clean_max_rent(self):
        if not self.cleaned_data.get('max_rent') or self.cleaned_data['max_rent']>1000000:
            return 10000000
        return self.cleaned_data.get('max_rent')
