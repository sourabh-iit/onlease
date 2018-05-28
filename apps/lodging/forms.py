from django import forms
from .models import Lodging, ImageModel, CommonlyUsedLodgingModel
from django.core.exceptions import ValidationError
from django.forms import inlineformset_factory
from .utils import clean_data, generate_random, create_thumbnail
import datetime
from django.forms.models import BaseInlineFormSet
from PIL import Image
import io
import hashlib
from django.core.files.uploadedfile import InMemoryUploadedFile
from apps.locations.models import State, District, Region
from django.db.models.query import Prefetch
from django.conf import settings
import os
import stdimage

allowed_image_formats = ['png','jpg','jpeg','gif']

thumb_size = (228,180)

image_size = (800,500)

max_size = 2 # size in mb

def mb_to_bytes(size):
    return size*1024*1024

class LodgingCreateForm(forms.ModelForm):
    class Meta:
        model = Lodging
        fields = ('address',)

    def clean_address(self):
        data = self.cleaned_data.get('address')
        return clean_data(data)

class CommonlyUsedLodgingCreateForm(forms.ModelForm):
    district = forms.ModelChoiceField(queryset=District.objects.none(),widget=forms.Select)
    region = forms.ModelChoiceField(queryset=Region.objects.none(),widget=forms.Select)
    available_from = forms.DateField(input_formats=settings.DATE_INPUT_FORMATS)
    images = forms.ModelMultipleChoiceField(queryset=ImageModel.objects.none())

    def __init__(self, *args, **kwargs):
        super(CommonlyUsedLodgingCreateForm, self).__init__(*args, **kwargs)
        self.fields['is_furnished'].required = False
        self.fields['is_parking_available'].required = False
        self.fields['is_kitchen_available'].required = False
        self.fields['state'] = forms.ChoiceField(
            choices=[('','Choose State')]+[(state.id,state.name) for state in State.objects.all()],
            widget=forms.Select
        )
        if 'images' in self.data:    
            self.fields['images'].queryset = ImageModel.objects.filter(
                created_at__gte=datetime.datetime.now()-datetime.timedelta(minutes=60))
        if 'state' in self.data and 'district' in self.data:
            try:
                districts = District.objects.prefetch_related('regions').filter(state__id=int(self.data['state']))
                self.fields['district'].queryset = districts
                self.fields['region'].queryset = districts.get(id=int(self.data['district'])).regions.all()
            except:
                pass

    class Meta:
        model = CommonlyUsedLodgingModel
        fields = ('lodging_type','total_floors','floor_no','is_furnished',
            'is_kitchen_available','is_parking_available','available_from',
            'rent','additional_details','title','district','region')
        widgets = {
            'additional_details': forms.Textarea(attrs={'rows':4, 'cols':15})
        }

    def clean_available_from(self):
        date = self.cleaned_data.get('available_from')
        if date and date<datetime.date.today():
            raise ValidationError('Enter a future value.',code='datebefore')
        if date and date>datetime.date.today()+datetime.timedelta(days=30):
            raise ValidationError('Available date more than 30 days is not permitted',
            code='dateafter')
        return date

    def clean_floor_no(self):
        floor_no = self.cleaned_data.get('floor_no')
        if floor_no and floor_no<0:
            raise ValidationError('Floor number cannot be negative',code='invlaid')
        return floor_no

    def clean_total_floors(self):
        total_floors = self.cleaned_data.get('total_floors')
        if total_floors and total_floors<=0:
            raise ValidationError('Total floors value cannot be negative',code='invlaid')
        return total_floors

    def clean_title(self):
        data = self.cleaned_data.get('title')
        return clean_data(data)

    def clean_additional_details(self):
        data = self.cleaned_data.get('additional_details')
        return clean_data(data)

    def clean(self):
        cleaned_data = super().clean()
        floor_no = cleaned_data.get('floor_no')
        total_floors = cleaned_data.get('total_floors')
        if floor_no and total_floors and floor_no>=total_floors:
            raise ValidationError('Total floors value cannot be equal to or greater'+
            ' than total floors')
        return cleaned_data


class ImageForm(forms.ModelForm):
    class Meta:
        model = ImageModel
        fields = ('image',)

    def __init__(self, *args, **kwargs):
        super(ImageForm, self).__init__(*args, **kwargs)
        self.fields['image'].required = False

    def clean_image(self):
        img = self.cleaned_data['image']
        if type(img)!=stdimage.models.StdImageFieldFile:
            if not img:
                raise ValidationError('This field is required')
            if img._size > mb_to_bytes(2):
                raise ValidationError('Upload a valid image. Only files with size less than 5mb are allowed.',code='invalidsize')
            if img.content_type.split('/')[-1] not in allowed_image_formats:
                raise ValidationError('Upload a valid image. Only files with extensions png, jpg, jpeg and gif are allowed.',code='invalidformat')
        return img

    def save(self,commit=True):
        im = super(ImageForm,self).save(commit=False)
        img = im.image
        name_and_ext = os.path.splitext(img.name)
        random_suffix = generate_random(32)
        img.name = name_and_ext[0]+"_"+random_suffix+name_and_ext[1]
        thumb_name = name_and_ext[0]+"_"+random_suffix+'.thumbnail'+name_and_ext[1]
        im.image_thumbnail = create_thumbnail(img,thumb_size,thumb_name)
        if commit:
            im.save()
        return im

UpdateImageFormset = inlineformset_factory(CommonlyUsedLodgingModel,ImageModel,fields=('image',),
    can_delete=True,form=ImageForm,extra=0)

class CommonlyUsedLodgingUpdateForm(forms.ModelForm):
    images = forms.ModelMultipleChoiceField(queryset=ImageModel.objects.none(),required=False)
    delete_images = forms.ModelMultipleChoiceField(queryset=ImageModel.objects.none(),required=False)
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

    def clean_available_from(self):
        date = self.cleaned_data.get('available_from')
        if date and date<datetime.date.today():
            raise ValidationError('Enter a future value',code='datebefore')
        if date and date>datetime.date.today()+datetime.timedelta(days=30):
            raise ValidationError('Available date more than 30 days is not permitted',
            code='dateafter')
        return date

    def clean_additional_details(self):
        data = self.cleaned_data.get('additional_details')
        return clean_data(data)

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
            raise ValidationError('Total floors value cannot be negative',code='less_than_0')
        return total_floors
