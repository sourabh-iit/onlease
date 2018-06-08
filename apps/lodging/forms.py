from django import forms
from django.core.exceptions import ValidationError
from django.db.models.query import Prefetch
from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile

from .models import Lodging, ImageModel, CommonlyUsedLodgingModel, thumbnail_size
from .utils import clean_data, generate_random, create_thumbnail
from apps.locations.models import Region
from apps.widgets import CustomSelect2Widget

from django_select2.forms import Select2MultipleWidget, Select2Widget

import datetime
import io
import hashlib
import os
from PIL import Image


def mb_to_bytes(size):
    return size*1024*1024


# only fields in this
class AdCommonFieldsForm(forms.Form):
    region = forms.ModelChoiceField(queryset=Region.objects.none(),widget=CustomSelect2Widget,required=False)


# only clean and init methods in this
class AdCommonFieldsMixinForm(object):
    
    def __init__(self, *args, **kwargs):
        super(AdCommonFieldsMixinForm,self).__init__(*args,**kwargs)

        if 'region' in self.data:
            self.fields['region'].queryset = Region.objects.all()


class LodgingCommonFieldsForm(forms.Form):
    available_from = forms.DateField(input_formats=settings.DATE_INPUT_FORMATS,required=False)
    images = forms.ModelMultipleChoiceField(queryset=ImageModel.objects.none(),required=False)
    facilities = forms.MultipleChoiceField(
        choices=CommonlyUsedLodgingModel.FACILITIES_AVAILABLE_CHOICES,
        widget=Select2MultipleWidget)


class LodgingCommonFieldsMixinForm(object):
    
    def __init__(self, *args, **kwargs):
        super(LodgingCommonFieldsMixinForm,self).__init__(*args,**kwargs)
        if 'images' in self.data:    
            self.fields['images'].queryset = ImageModel.objects.filter(
                created_at__gte=datetime.datetime.now()-datetime.timedelta(minutes=60*24*7))
    
    def clean_floor_no(self):
        floor_no = self.cleaned_data.get('floor_no')
        total_floors = self.cleaned_data.get('total_floors')
        if floor_no:
            if floor_no<0:
                raise ValidationError('Floor number cannot be negative',
                code='less_than_0')
            elif total_floors and floor_no>=total_floors:
                raise ValidationError('Total floors cannot be equal to or greater'+
                ' than total floors')
        return floor_no

    def clean_total_floors(self):
        total_floors = self.cleaned_data.get('total_floors')
        if total_floors and total_floors<=0:
            raise ValidationError('Total floors value cannot be negative',code='invlaid')
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

    def __init__(self, *args, **kwargs):
        super(CommonlyUsedLodgingCreateForm, self).__init__(*args, **kwargs)
        self.fields['is_furnished'].required = False
        self.fields['is_parking_available'].required = False
        self.fields['is_kitchen_available'].required = False

    class Meta:
        model = CommonlyUsedLodgingModel
        fields = ('lodging_type','lodging_type_other','total_floors','floor_no',
            'furnishing','facilities','rent','area','area_unit','bathrooms','bedrooms',
            'balconies','other_rooms','halls','security_deposit','booking_amount',
            'flooring','additional_details','title','region','available_from')
        widgets = {
            'additional_details': forms.Textarea(attrs={'rows':4, 'cols':15}),
            'flooring': Select2Widget,
            'flooring': Select2Widget,
            'flooring': Select2Widget,
            'flooring': Select2Widget,
        }    

    def clean_title(self):
        data = self.cleaned_data.get('title')
        return clean_data(data)


CommonlyUsedLodgingCreateForm.base_fields.update(AdCommonFieldsForm.base_fields)
CommonlyUsedLodgingCreateForm.base_fields.update(LodgingCommonFieldsForm.base_fields)


class CommonlyUsedLodgingUpdateForm(LodgingCommonFieldsMixinForm,AdCommonFieldsMixinForm,forms.ModelForm):
    delete_images = forms.ModelMultipleChoiceField(queryset=ImageModel.objects.none(),
                required=False)
    images = forms.ModelMultipleChoiceField(queryset=ImageModel.objects.none(),required=False)
    class Meta:
        model = CommonlyUsedLodgingModel
        fields = ('is_furnished','is_kitchen_available','is_parking_available',
        'is_booked','available_from','rent',
        'additional_details','floor_no','total_floors')
        widgets = {
            'additional_details': forms.Textarea(attrs={'rows':4,'cols':15}),
        }

    def __init__(self, images, *args, **kwargs):
        super(CommonlyUsedLodgingUpdateForm, self).__init__(*args, **kwargs)
        self.fields['is_furnished'].required = False
        self.fields['is_booked'].required = False
        self.fields['available_from'].required = False
        self.fields['rent'].required = False
        self.fields['additional_details'].required = False
        self.fields['floor_no'].required = False
        self.fields['total_floors'].required = False
        if images:
            self.fields['delete_images'].queryset = images
        if 'images' in self.data:    
            self.fields['images'].queryset = ImageModel.objects.filter(
                created_at__gte=datetime.datetime.now()-datetime.timedelta(minutes=60))


CommonlyUsedLodgingUpdateForm.base_fields.update(LodgingCommonFieldsForm.base_fields)
