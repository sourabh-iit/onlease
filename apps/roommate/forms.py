from django import forms
from .models import RoomieAd, Image
from apps.lodging.forms import AdCommonFieldsForm, AdCommonFieldsMixinForm
import datetime


class RoomieAdForm(AdCommonFieldsMixinForm,forms.ModelForm):
    images = forms.ModelMultipleChoiceField(queryset=Image.objects.none(),required=False)

    def __init__(self, *args, **kwargs):
        super(RoomieAdForm,self).__init__(*args,**kwargs)
        if 'images' in self.data:    
            self.fields['images'].queryset = Image.objects.filter(
                created_at__gte=datetime.datetime.now()-datetime.timedelta(minutes=60))


    class Meta:
        model = RoomieAd
        fields = ('rent','region','type','lodging_description','has_property','images')
        widgets = {
            'lodging_description': forms.Textarea(attrs={'rows':3, 'cols':15}),
            'has_property': forms.RadioSelect
        }


RoomieAdForm.base_fields.update(AdCommonFieldsForm.base_fields)
