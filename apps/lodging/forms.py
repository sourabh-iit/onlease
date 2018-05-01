from django import forms
from .models import Lodging, ImageModel, CommonlyUsedLodgingModel
from django.core.exceptions import ValidationError
from django.forms import inlineformset_factory
from .utils import clean_data, generate_random, create_thumbnail
import datetime
from django.forms.models import BaseInlineFormSet

allowed_image_formats = ['png','jpg','jpeg','gif']

thumb_size = (128,128)

class LodgingCreateForm(forms.ModelForm):
    class Meta:
        model = Lodging
        fields = ('address',)

    def clean_address(self):
        data = self.cleaned_data.get('address')
        return clean_data(data)

class CommonlyUsedLodgingCreateForm(forms.ModelForm):
    id = forms.CharField(max_length=20)
    class Meta:
        model = CommonlyUsedLodgingModel
        fields = ('lodging_type','total_floors','floor_no','is_furnished',
            'is_kitchen_available','is_parking_available','available_from',
            'rent','additional_details','title','id')
        widgets = {
            'additional_details': forms.Textarea(attrs={'rows':4, 'cols':15})
        }

    def __init__(self, *args, **kwargs):
        super(CommonlyUsedLodgingCreateForm, self).__init__(*args, **kwargs)
        self.fields['is_furnished'].required = False
        self.fields['is_parking_available'].required = False
        self.fields['is_kitchen_available'].required = False

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


class ImageForm(forms.ModelForm):
    class Meta:
        model = ImageModel
        fields = ('image',)

    def __init__(self, *args, **kwargs):
        super(ImageForm, self).__init__(*args, **kwargs)
        self.fields['image'].required = False

    def clean_image(self):
        img = self.cleaned_data['image']
        if img._size > 5000000:
            raise ValidationError('Upload a valid image. Only files with size less than 5mb are allowed.',code='invalidsize')
        if img.content_type.split('/')[-1] not in allowed_image_formats:
            raise ValidationError('Upload a valid image. Only files with extensions png, jpg, jpeg and gif are allowed.',code='invalidformat')
        return img

    def save(self,commit=True):
        im = super(ImageForm,self).save(commit=False)
        img = im.image
        ext = img.name.split('.')[-1]
        img_name = ''.join(img.name.split('.')[:-1])
        random_suffix = generate_random(16)
        img.name = img_name+"_"+random_suffix+'.'+ext
        thumb_name = img_name+"_"+random_suffix+'.thumbnail.'+ext
        thumbnail = create_thumbnail(img,thumb_size,thumb_name)
        im.image_thumbnail = thumbnail
        if commit:
            im.save()
        return im

ImageFormset = inlineformset_factory(CommonlyUsedLodgingModel,ImageModel,fields=('image',),
    can_delete=True,form=ImageForm,extra=3)

class CommonlyUsedLodgingUpdateForm(forms.ModelForm):
    class Meta:
        model = CommonlyUsedLodgingModel
        fields = ('is_furnished','is_kitchen_available','is_parking_available',
        'is_booked','available_from','rent',
        'additional_details','floor_no','total_floors')
        widgets = {
            'additional_details': forms.Textarea(attrs={'rows':4,'cols':15}),
        }

    def __init__(self, *args, **kwargs):
        super(CommonlyUsedLodgingUpdateForm, self).__init__(*args, **kwargs)
        self.fields['is_furnished'].required = False
        self.fields['is_booked'].required = False
        self.fields['available_from'].required = False
        self.fields['rent'].required = False
        self.fields['additional_details'].required = False
        self.fields['floor_no'].required = False
        self.fields['total_floors'].required = False

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
        if floor_no and floor_no<0:
            raise ValidationError('Floor number cannot be negative',
            code='less_than_0')
        return floor_no

    def clean_total_floors(self):
        total_floors = self.cleaned_data.get('total_floors')
        if total_floors and total_floors<=0:
            raise ValidationError('Total floors value can be negative',code='less_than_0')
        return total_floors

    def clean(self):
        cleaned_data = super().clean()
        floor_no = cleaned_data.get('floor_no')
        total_floors = cleaned_data.get('total_floors')
        if floor_no and total_floors and floor_no>=total_floors:
            raise ValidationError('Total floors cannot be equal to or greater'+
            ' than total floors')