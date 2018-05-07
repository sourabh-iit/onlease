from django import forms
from django.contrib.auth import get_user_model

User = get_user_model()

class ProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('first_name','last_name','email')

class RefundForm(forms.Form):
    reason = forms.CharField(widget=forms.Textarea(attrs={'rows':4}))

class ProfileForm(forms.ModelForm):
    class Meta:
        model=User
        fields=('email','mobile_number_alternate1','mobile_number_alternate2')
    def __init__(self,*args,**kwargs):
        super(ProfileForm,self).__init__(*args,**kwargs)
        self.fields['mobile_number_alternate1'].required=False
        self.fields['mobile_number_alternate2'].required=False
