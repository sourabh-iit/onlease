from django import forms
from .models import RoomieAd, Image
from apps.lodging.forms import AdCommonFieldsForm, AdCommonFieldsMixinForm, \
    ImageCommonFieldsMixinForm
from django.forms import inlineformset_factory


class RoomieAdForm(AdCommonFieldsMixinForm,forms.ModelForm):
    has_room = forms.BooleanField(widget=forms.RadioSelect,required=False)
    class Meta:
        model = RoomieAd
        fields = ('rent','region','type','budget','qualities',
            'lodging_description','has_room')
        widgets = {
            'qualities': forms.Textarea(attrs={'rows':4, 'cols':15}),
            'lodging_description': forms.Textarea(attrs={'rows':3, 'cols':15}),
        }


RoomieAdForm.base_fields.update(AdCommonFieldsForm.base_fields)

    
class ImageForm(ImageCommonFieldsMixinForm,forms.ModelForm):
    class Meta:
        models = Image
        fields = ('image',)
 
ImageFormset = inlineformset_factory(RoomieAd,Image,fields=('image',),
    form=ImageForm,extra=0)
