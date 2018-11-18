from django import forms
from django.core.validators import RegexValidator
from django.contrib.auth import get_user_model
from .models import ContactModel
from .utils import *

User = get_user_model()

class MobileNumberForm(forms.Form):
    mobile_number=forms.CharField(max_length=10,
        validators=[RegexValidator(regex=mobile_number_regex,
        message='Enter valid mobile number',
        code='invalid_number')])

class ValidateOtpForm(forms.Form):
    mobile_number=forms.CharField(max_length=10,
        validators=[RegexValidator(regex=mobile_number_regex,
        message='Enter valid mobile number',
        code='invalid_number')])
    otp = forms.CharField(
        max_length=6,
        required=True,
        validators=[
            RegexValidator(
                regex=otp_regex,
                message='Invalid OTP.',
                code='invalid_otp'
            )])

class RegisterForm(forms.ModelForm):
    confirm_password = forms.CharField(max_length=50,widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('email','password','mobile_number')
        widgets = {
            'password': forms.PasswordInput
        }

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request")
        super(RegisterForm, self).__init__(*args, **kwargs)
        self.fields['password'].required = True
        self.fields['mobile_number'].required = True

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')
        if password and confirm_password and password!=confirm_password:
            raise forms.ValidationError(
                'Password and confirm password should match',
                code = 'nomatch')

class LoginForm(forms.Form):
    username = forms.CharField(
        max_length=50,
        validators=[
            RegexValidator(
                regex=username_regex,
                message="Invalid username",
                code="invalid_username"
            )
        ])

    password = forms.CharField(
        max_length=50,
        validators = [RegexValidator(
            regex="^[0-9a-zA-Z?\/.,<>():;'\"\[\]{}~!@#$%^&*-_+]*$",
            message="Invalid password string",
            code="invalid_password"
        )],
        widget = forms.PasswordInput)

    next_ = forms.CharField(
        max_length=200,
        required=False,
        widget=forms.HiddenInput())

class ContactForm(forms.ModelForm):
    def __init__(self,user,*args,**kwargs):
        super(ContactForm,self).__init__(*args,**kwargs)
        if user.is_authenticated:
            self.fields['mobile_number'].widget.attrs['readonly']=True
            self.fields['email'].widget.attrs['readonly']=True
            self.fields['subject'].widget.attrs.update({'autofocus':''})
        else:
            self.fields['name'].widget.attrs.update({'autofocus':''})
        self.user=user

    def clean_mobile_number(self):
        if self.user.is_authenticated:
            return self.user.mobile_number
        return self.cleaned_data.get('mobile_number')

    def clean_email(self):
        if self.user.is_authenticated:
            return self.user.email
        return self.cleaned_data.get('email')

    def clean(self):
        data = self.cleaned_data
        if not data.get('mobile_number') and not data.get('email'):
            raise ValidationError('Mobile number or email address is required.')
        return data

    class Meta:
        model = ContactModel
        exclude = ('sent_on',)
        widgets = {
            'message': forms.Textarea(attrs={'rows':4,'cols':15}),
            'subject': forms.TextInput
        }

class ResetPasswordForm(forms.ModelForm):
    mobile_number=forms.CharField(max_length=10,
        validators=[RegexValidator(regex=mobile_number_regex,
        message='Enter valid mobile number',
        code='invalid_number')])
    confirm_password = forms.CharField(
        max_length=50,
        widget = forms.PasswordInput)
    otp = forms.CharField(max_length=10)

    class Meta:
        model = User
        fields = ('password',)
        widgets = {'password':forms.PasswordInput}

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')
        if password!=confirm_password:
            raise forms.ValidationError(
                'Password and confirm password should match',
                code = 'nomatch')

class PasswordChangeForm(forms.Form):
    current_password = forms.CharField(max_length=50)
    password = forms.CharField(
        max_length=50, min_length=8,
        widget = forms.PasswordInput)
    confirm_password = forms.CharField(max_length=50)

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')
        if password!=confirm_password:
            raise ValidationError('Passwords do not match')


class ProfileForm(forms.ModelForm):
    
    class Meta:
        model=User
        fields=('first_name','last_name','email','detail','type_of_roommate','gender')
    
    def __init__(self,*args,**kwargs):
        super(ProfileForm,self).__init__(*args,**kwargs)
