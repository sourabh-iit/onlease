from django import forms
from django.conf import settings
from django_select2.forms import Select2MultipleWidget, Select2Widget
from django.core.exceptions import ValidationError

from .models import Lodging, CommonlyUsedLodgingModel
from .utils import clean_data
from apps.locations.models import Region
from apps.widgets import CustomSelect2Widget

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

  # def clean_region(self):
  #   import pdb ; pdb.set_trace()
  #   id_ = self.cleaned_data.get('region')
  #   try:
  #     return Region.objects.get(id=id_)
  #   except Region.DoesNotExist:
  #     raise ValidationError('Region with this id does not exist')


class LodgingCommonFieldsForm(forms.Form):
  available_from = forms.DateField(input_formats=settings.DATE_INPUT_FORMATS)
  facilities = forms.MultipleChoiceField(
    choices=CommonlyUsedLodgingModel.FACILITIES_AVAILABLE_CHOICES,
    widget=Select2MultipleWidget)


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


widgets = {
  'additional_details': forms.Textarea(attrs={'rows':4, 'cols':15}),
  'flooring': Select2Widget,
  'lodging_type': Select2Widget,
  'furnishing': Select2Widget,
  'facilities': Select2MultipleWidget,
}


class CommonlyUsedLodgingCreateForm(AdCommonFieldsMixinForm,LodgingCommonFieldsMixinForm,forms.ModelForm):
    
  def __init__(self, request, *args, **kwargs):
    super(CommonlyUsedLodgingCreateForm, self).__init__(*args, **kwargs)
    self.request = request

  class Meta:
    model = CommonlyUsedLodgingModel
    fields = ('lodging_type','lodging_type_other','total_floors','floor_no',
        'furnishing','facilities','rent','area','area_unit','bathrooms','bedrooms',
        'balconies','other_rooms','halls','security_deposit','booking_amount',
        'flooring','additional_details','title','available_from','region')
    widgets = widgets

  def clean_title(self):
    data = self.cleaned_data.get('title')
    return clean_data(data)

  def clean_facilities(self):
    return self.request.POST.getlist('facilities[]')

    # def save(self,commit=True):
    #     data = self.cleaned_data
    #     sublodging = super(CommonlyUsedLodgingCreateForm,self).save(commit=False)
    #     if data.get('facilities'):
    #         sublodging.facilities = ','.join(data['facilities'])
    #     if commit:
    #       return sublodging.save()
    #     else:
    #       return sublodging.save(commit=False)


CommonlyUsedLodgingCreateForm.base_fields.update(AdCommonFieldsForm.base_fields)
CommonlyUsedLodgingCreateForm.base_fields.update(LodgingCommonFieldsForm.base_fields)


# class CommonlyUsedLodgingUpdateForm(LodgingCommonFieldsMixinForm,AdCommonFieldsMixinForm,forms.ModelForm):
#     delete_images = forms.ModelMultipleChoiceField(queryset=ImageModel.objects.none(),
#                 required=False)
#     class Meta:
#         model = CommonlyUsedLodgingModel
#         fields = ('total_floors','floor_no','furnishing','facilities','rent',
#             'area','area_unit','bathrooms','bedrooms','balconies','other_rooms',
#             'halls','security_deposit','booking_amount','flooring',
#             'additional_details','title','available_from')
#         widgets = widgets

#     def __init__(self, images, *args, **kwargs):
#         super(CommonlyUsedLodgingUpdateForm, self).__init__(*args, **kwargs)
#         for field in self.fields:
#             self.fields[field].required=False
#         if images:
#             self.fields['delete_images'].queryset = images


# CommonlyUsedLodgingUpdateForm.base_fields.update(LodgingCommonFieldsForm.base_fields)
