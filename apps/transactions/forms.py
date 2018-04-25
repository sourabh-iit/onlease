from django import forms
import re
from django.core.exceptions import ValidationError

class LodgingTransactionForm(forms.Form):
    ad_id = forms.IntegerField(widget=forms.HiddenInput)
    def clean_ad_id(self):
        ad_id = self.cleaned_data.get('ad_id')
        if ad_id and not re.match("^[0-9]+$",str(ad_id)):
            raise ValidationError('Ad id is not valid.')
        return ad_id