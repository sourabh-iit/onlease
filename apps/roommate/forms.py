from django import forms
from django.core.exceptions import ValidationError

from django_select2.forms import Select2MultipleWidget

import datetime

from .models import RoomieAd
from apps.image.models import ImageModel
from apps.widgets import CustomSelect2MultipleWidget
from apps.locations.models import Region


class RoomieAdForm(forms.ModelForm):
    # images = forms.MultipleChoice(queryset=ImageModel.objects.none(),required=False)
    regions = forms.ChoiceField(widget=CustomSelect2MultipleWidget,required=False)
    types = forms.ChoiceField(widget=Select2MultipleWidget,choices=RoomieAd.TYPE_CHOICES,required=False)
    image_ids = forms.ModelMultipleChoiceField(queryset=ImageModel.objects.none(),required=False)

    def __init__(self, *args, **kwargs):
        super(RoomieAdForm,self).__init__(*args,**kwargs)
        if 'image_ids[]' in self.data:
            self.fields['image_ids'].queryset = ImageModel.objects.filter(
                created_at__gte=datetime.datetime.now()-datetime.timedelta(minutes=60))
        if 'regions[]' in self.data:
            self.fields['regions'].queryset = Region.objects.all()
        self.fields['lodging_description'].required = False


    class Meta:
        model = RoomieAd
        fields = ('rent','regions','types','lodging_description','has_property','image_ids','share', 'gender')

    def clean_regions(self):
        if 'regions[]' not in self.data:
            raise ValidationError('This field is required')
        return self.data.getlist('regions[]')

    def clean_image_ids(self):
        return self.data.getlist('image_ids[]')

    def clean_types(self):
        if 'types[]' not in self.data:
            raise ValidationError('This field is required')
        return self.data.getlist('types[]')

    def clean(self):
        has_property = self.cleaned_data.get('has_property')
        if has_property==True:
            regions = self.cleaned_data.get('regions')
            types = self.cleaned_data.get('types')
            if len(regions)>1:
                raise ValidationError('Select only one region.')
            if len(types)>1:
                raise ValidationError('Select only one type.')
        else:
            lodging_description = self.cleaned_data.get('lodging_description')
            if lodging_description and lodging_description!="":
                raise ValidationError('Description of property is not needed.')
        return self.cleaned_data
