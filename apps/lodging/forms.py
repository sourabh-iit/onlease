from django import forms
from django.conf import settings
from django.core.exceptions import ValidationError

from .models import Lodging, CommonlyUsedLodgingModel, Charge
from .utils import clean_data
from apps.locations.models import Region

import datetime


# only fields in this
class AdCommonFieldsForm(forms.Form):
  region = forms.ModelChoiceField(queryset=Region.objects.none())


# only clean and init methods in this
class AdCommonFieldsMixinForm(object):
    
  def __init__(self, *args, **kwargs):
    super(AdCommonFieldsMixinForm,self).__init__(*args,**kwargs)
    if 'region' in self.data:
      self.fields['region'].queryset = Region.objects.all()


class LodgingCommonFieldsForm(forms.Form):
  available_from = forms.DateField(input_formats=settings.DATE_INPUT_FORMATS)
  facilities = forms.MultipleChoiceField(
    choices=CommonlyUsedLodgingModel.FACILITIES_AVAILABLE_CHOICES)


class LodgingCommonFieldsMixinForm(object):
    
  def clean_floor_no(self):
    floor_no = self.cleaned_data.get('floor_no')
    total_floors = self.cleaned_data.get('total_floors')
    if floor_no:
      if floor_no<1:
        raise ValidationError('Floor number cannot be less than one',
        code='less_than_1')
      elif total_floors and floor_no>total_floors:
        raise ValidationError('Floor number cannot be greater'+
        ' than total floors')
    return floor_no

    def clean_total_floors(self):
      total_floors = self.cleaned_data.get('total_floors')
      if total_floors and total_floors<1:
        raise ValidationError('Total floors value cannot be less than one',code='less_than_1')
      return total_floors

    def clean_additional_details(self):
      data = self.cleaned_data.get('additional_details')
      return clean_data(data)

    def clean_available_from(self):
      date = self.cleaned_data.get('available_from')
      if date and date<datetime.date.today():
        raise ValidationError('Enter a future value.',code='datebefore')
      if date and date>datetime.date.today()+datetime.timedelta(days=30):
        raise ValidationError('Available date more than 30 days is not permitted',
          code='dateafter')
      if not date:
        return datetime.date.today()
      return date


class LodgingCreateForm(forms.ModelForm):
  class Meta:
    model = Lodging
    fields = ('address',)

  def clean_address(self):
    data = self.cleaned_data.get('address')
    return clean_data(data)



class CommonlyUsedLodgingCreateForm(AdCommonFieldsMixinForm,LodgingCommonFieldsMixinForm,forms.ModelForm):
    
  def __init__(self, request, *args, **kwargs):
    super(CommonlyUsedLodgingCreateForm, self).__init__(*args, **kwargs)
    self.request = request

  class Meta:
    model = CommonlyUsedLodgingModel
    fields = ('lodging_type','lodging_type_other','total_floors','floor_no',
        'furnishing','facilities','rent','area','bathrooms','rooms',
        'balconies','halls','flooring','flooring_other','additional_details','title',
        'available_from','region','latlng','virtual_tour_link','unit')

  def clean_title(self):
    data = self.cleaned_data.get('title')
    return clean_data(data)

  # def clean_facilities(self):
  #   return self.request.POST.getlist('facilities')


CommonlyUsedLodgingCreateForm.base_fields.update(AdCommonFieldsForm.base_fields)
CommonlyUsedLodgingCreateForm.base_fields.update(LodgingCommonFieldsForm.base_fields)

class ChargeForm(forms.ModelForm):

  class Meta:
    model = Charge
    fields = ('amount','description','is_per_month')

  def save(self, lodging, commit=True):
    m = super(ChargeForm, self).save(commit=False)
    m.lodging = lodging
    if commit:
      m.save()
    return m
