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
    region = forms.ChoiceField(widget=CustomSelect2Widget)


# only clean and init methods in this
class AdCommonFieldsMixinForm(object):
    
    def __init__(self, *args, **kwargs):
        super(AdCommonFieldsMixinForm,self).__init__(*args,**kwargs)
        if 'region' in self.data:
            self.fields['region'].queryset = Region.objects.all()


class LodgingCommonFieldsForm(forms.Form):
    available_from = forms.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    images = forms.ModelMultipleChoiceField(queryset=ImageModel.objects.none())
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
    
    def __init__(self, request, *args, **kwargs):
        super(LodgingCreateForm,self).__init__(*args,**kwargs)
        self.request = request

    def clean_address(self):
        data = self.cleaned_data.get('address')
        return clean_data(data)

    def save(self):
        data = self.cleaned_data
        lodging = super(LodgingCreateForm,self).save(commit=False)
        if self.request.user.is_authenticated:
            lodging.posted_by = self.request.user
        else:
            lodging.session_key = self.request.session.session_key
        lodging.save()
        return lodging


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
            'flooring','additional_details','title','available_from')
        widgets = widgets

    def clean_title(self):
        data = self.cleaned_data.get('title')
        return clean_data(data)

    def save(self):
        data = self.cleaned_data
        sublodging = super(CommonlyUsedLodgingCreateForm,self).save(commit=False)
        if data.get('facilities'):
            sublodging.facilities = ','.join(data['facilities'])
        sublodging.save()
        for image_id in self.data.getlist('images'):
            image = ImageModel.objects.get(id=image_id)
            image.sublodging = sublodging
            image.save()
        return sublodging


CommonlyUsedLodgingCreateForm.base_fields.update(AdCommonFieldsForm.base_fields)
CommonlyUsedLodgingCreateForm.base_fields.update(LodgingCommonFieldsForm.base_fields)


class CommonlyUsedLodgingUpdateForm(LodgingCommonFieldsMixinForm,AdCommonFieldsMixinForm,forms.ModelForm):
    delete_images = forms.ModelMultipleChoiceField(queryset=ImageModel.objects.none(),
                required=False)
    class Meta:
        model = CommonlyUsedLodgingModel
        fields = ('total_floors','floor_no','furnishing','facilities','rent',
            'area','area_unit','bathrooms','bedrooms','balconies','other_rooms',
            'halls','security_deposit','booking_amount','flooring',
            'additional_details','title','available_from')
        widgets = widgets

    def __init__(self, images, *args, **kwargs):
        super(CommonlyUsedLodgingUpdateForm, self).__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].required=False
        if images:
            self.fields['delete_images'].queryset = images


CommonlyUsedLodgingUpdateForm.base_fields.update(LodgingCommonFieldsForm.base_fields)
