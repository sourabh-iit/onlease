from django import forms
from django.contrib.auth import get_user_model
from apps.lodging.models import CommonlyUsedLodgingModel
from apps.locations.models import District, State

User = get_user_model()

class RadioSelectWidget(forms.widgets.RadioSelect):
    template_name = 'project/widgets/filter.html'

class RefundForm(forms.Form):
    reason = forms.CharField(widget=forms.Textarea(attrs={'rows':4}))

class ProfileForm(forms.ModelForm):
    class Meta:
        model=User
        fields=('first_name','last_name','email','mobile_number_alternate1',
            'mobile_number_alternate2','is_dealer')
        widgets={
            'is_dealer': forms.RadioSelect
        }
    def __init__(self,*args,**kwargs):
        super(ProfileForm,self).__init__(*args,**kwargs)
        self.fields['mobile_number_alternate1'].required=False
        self.fields['mobile_number_alternate2'].required=False

class DealerProfileForm(forms.Form):
    available_property_types=forms.MultipleChoiceField(choices=CommonlyUsedLodgingModel.TYPE_CHOICES[1:],widget=forms.CheckboxSelectMultiple,help_text="Choose all types of property you have currently for customers")
    state = forms.ChoiceField(choices=[(None,'Choose State')]+[(state.id,state.name) for state in State.objects.all()])
    district = forms.ChoiceField(choices=[(None,'Choose District')],help_text="This is area in which you operate currently")
    
    def __init__(self, *args, **kwargs):
        super(DealerProfileForm,self).__init__(*args, **kwargs)
        if 'state' in self.data:
            try:
                self.fields['district'].choices = [(district.id,district.name) for district in District.objects.filter(state__id=int(self.data['state']))]
            except:
                pass
