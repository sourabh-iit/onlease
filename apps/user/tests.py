from django.test import TestCase
from django.urls import reverse
from django.db import models
from .models import User
from .models import MobileNumber
from .forms import RequestOtpForm, RegisterForm
import time
from django.core import mail

details = {
    'email':'abc@gmail.com',
    'first_name':'abcd',
    'last_name': 'efgh'
}

invalid_details = {
    'email':'2a@gmail',
    'first_name':'abcd abdc',
    'last_name':'ad9'
}

right_number = '8978978978'
wrong_number = '897897897'
password1 = 'Ss123456'
password2 = 'Ss123457'

def registerFunc(self):
    self.client.get(reverse('user:request-otp'))
    self.client.post(reverse('user:request-otp'),
        {'mobile_number':right_number})
    self.client.get(reverse('user:validate-otp'))
    self.client.post(reverse('user:validate-otp'),
        {'otp':self.client.session['otp']})
    self.client.get(reverse('user:register'))
    self.client.post(reverse('user:register'),
        {'first_name': details['first_name'],
        'last_name': details['last_name'],
        'email': details['email'],
        'password': password1,
        'confirm_password': password1})

def loginFunc(self):
    registerFunc(self)
    self.client.get(reverse('user:login'))
    self.client.post(reverse('user:login'),
        {'username':right_number,'password':password1})

class UserModelTests(TestCase):

    wrong_number = wrong_number
    right_number = right_number
    password1 = password1
    password2 = password2

    def test_request_otp_blank_form(self):
        response = self.client.get(reverse('user:request-otp'))
        self.assertEqual(response.status_code,200)
        self.assertEqual(response.context['form'].is_bound,False)
        self.assertEqual(response.client.session.test_cookie_worked(),True)

    def test_request_otp_test_cookie_not_set_error(self):
        response = self.client.post(reverse('user:request-otp'),
        {'mobile_number':self.right_number})
        self.assertContains(response,'Cookies are not enabled.')

    def test_request_otp_wrong_number(self):
        response = self.client.post(reverse('user:request-otp'),
            {'mobile_number':self.wrong_number})
        self.assertContains(response,'Invalid mobile number.')

    def test_request_otp_right_number(self):
        self.client.get(reverse('user:request-otp'))
        response = self.client.post(reverse('user:request-otp'),
            {'mobile_number':self.right_number})
        self.assertEqual(response.client.session.has_key('otp'),True)
        self.assertEqual(response.client.session.has_key('time'),True)
        self.assertEqual(response.client.session['mobile_number'],self.right_number)
        self.assertEqual(response.client.session.has_key('testcookie'),False)
        self.assertRedirects(response,reverse('user:validate-otp'))

    def test_request_otp_resend_otp_with_no_number(self):
        self.client.get(reverse('user:request-otp'))
        response = self.client.post(reverse('user:request-otp'),{'otp':'0000'})
        self.assertEqual(response.context['form'].errors,
            {'mobile_number':['This field is required.']})

    def test_request_otp_resend_otp_with_number(self):
        self.client.get(reverse('user:request-otp'))
        self.client.post(reverse('user:request-otp'),{'mobile_number':self.right_number})
        self.client.get(reverse('user:request-otp'))
        response = self.client.post(reverse('user:request-otp'),{'otp':'0000'})
        self.assertRedirects(response,reverse('user:validate-otp'))

    def test_validate_otp_blank_form(self):
        response = self.client.get(reverse('user:validate-otp'))
        self.assertEqual(response.status_code,200)
        self.assertEqual(response.context['form'].is_bound,False)
        self.assertEqual(response.client.session['testcookie'],'worked')

    def test_validate_otp_test_cookie_not_set_error(self):
        response = self.client.post(reverse('user:validate-otp'),
        {'mobile_number':self.right_number})
        self.assertContains(response,'Cookies are not enabled.')

    def test_validate_otp_no_mobile_number(self):
        self.client.get(reverse('user:validate-otp'))
        response = self.client.post(reverse('user:validate-otp'),{'otp':'0000'})
        self.assertRedirects(response,reverse('user:request-otp'))

    def test_validate_otp_success(self):
        self.client.get(reverse('user:request-otp'))
        self.client.post(reverse('user:request-otp'),
            {'mobile_number':right_number})
        self.client.get(reverse('user:validate-otp'))
        response = self.client.post(reverse('user:validate-otp'),
            {'otp':self.client.session['otp']})
        self.assertEqual(self.client.session.has_key('otp'),False)
        self.assertEqual(self.client.session.has_key('time'),False)
        self.assertEqual(self.client.session.has_key('uuid'),True)
        self.assertEqual(self.client.session['mobile_number'],right_number)
        self.assertEqual(MobileNumber.objects.get(mobile_number=\
        right_number).mobile_number,right_number)
        self.assertRedirects(response,reverse('user:register'))

    def test_validate_otp_invalid_otp(self):
        self.client.get(reverse('user:request-otp'))
        self.client.post(reverse('user:request-otp'),
            {'mobile_number':self.right_number})
        self.client.get(reverse('user:validate-otp'))
        response = self.client.post(reverse('user:validate-otp'),
            {'otp':'1111'})
        self.assertContains(response,'Invalid OTP.')

    def test_register_view_blank_form(self):
        response = self.client.get(reverse('user:register'))
        self.assertEqual(response.status_code,200)
        self.assertEqual(response.context['form'].is_bound,False)
        self.assertEqual(response.client.session['testcookie'],'worked')

    def test_register_view_test_cookie_not_set_error(self):
        response = self.client.post(reverse('user:register'),{})
        self.assertEqual(response.context['form'].non_field_errors(),
                ["Cookies are not enabled."])

    def test_register_view_password_confirm_password_not_match(self):
        self.client.get(reverse('user:request-otp'))
        self.client.post(reverse('user:request-otp'),
            {'mobile_number':self.right_number})
        self.client.get(reverse('user:validate-otp'))
        self.client.post(reverse('user:validate-otp'),
            {'otp':self.client.session['otp']})
        self.client.get(reverse('user:register'))
        response = self.client.post(reverse('user:register'),
            {'password':'Ss123456','confirm_password':'Ss123457'})
        self.assertEqual(response.status_code,200)
        self.assertEqual(response.context['form'].is_bound,True)
        self.assertEqual(response.client.session['testcookie'],'worked')
        self.assertEqual(response.context['form'].non_field_errors(),
                ['Password and confirm password should match.'])

    def test_register_success(self):
        self.client.get(reverse('user:request-otp'))
        self.client.post(reverse('user:request-otp'),
            {'mobile_number':self.right_number})
        self.client.get(reverse('user:validate-otp'))
        self.client.post(reverse('user:validate-otp'),
            {'otp':self.client.session['otp']})
        self.client.get(reverse('user:register'))
        response = self.client.post(reverse('user:register'),
            {'first_name': details['first_name'],
            'last_name': details['last_name'],
            'email': details['email'],
            'password': password1,
            'confirm_password': password1})
        import pdb ; pdb.set_trace()
        self.assertEqual(repr(response),'<HttpResponseRedirect status_code=302, "text/html; charset=utf-8", url="/dashboard/">')
        self.assertEqual(MobileNumber.objects.filter(mobile_number=\
            self.right_number).exists(),True)
        self.assertEqual(User.objects.filter(mobile_number=\
            self.right_number).exists(),True)
        self.assertEqual(len(self.client.session.keys()),2)

    def test_details_view_number_not_validate(self):
        self.client.get(reverse('user:request-otp'))
        self.client.post(reverse('user:request-otp'),
            {'mobile_number':self.right_number})
        self.client.get(reverse('user:register'))
        response = self.client.post(reverse('user:register'),
            {'first_name': details['first_name'],
            'last_name': details['last_name'],
            'email': details['email'],
            'password': password1,
            'confirm_password': password1})
        self.assertRedirects(response,reverse('user:request-otp'))

    def test_register_view_user_already_exists(self):
        registerFunc(self)
        self.client.get(reverse('user:request-otp'))
        self.client.post(reverse('user:request-otp'),
            {'mobile_number':self.right_number})
        self.client.get(reverse('user:validate-otp'))
        self.client.post(reverse('user:validate-otp'),
            {'otp':self.client.session['otp']})
        self.client.get(reverse('user:register'))
        response = self.client.post(reverse('user:register'),
            {'first_name': details['first_name'],
            'last_name': details['last_name'],
            'email': details['email'],
            'password': password1,
            'confirm_password': password1})
        self.assertEqual(response.context['form']['email'].errors,
            ['User with this Email already exists.'])

    def test_loginView_success(self):
        registerFunc(self)
        self.client.get(reverse('user:login'))
        response = self.client.post(reverse('user:login'),
            {'mobile_number':self.right_number,'password':self.password1})
        self.assertRedirects(response,reverse('dashboard:home'))
        self.assertEqual(bool(response.client.session.get('_auth_user_id')),True)
        self.assertEqual(bool(response.client.session.get('_auth_user_backend')),True)
        self.assertEqual(bool(response.client.session.get('_auth_user_hash')),True)

    def test_loginView_invalid_number(self):
        registerFunc(self)
        self.client.get(reverse('user:login'))
        response = self.client.post(reverse('user:login'),
            {'mobile_number':self.right_number,'password':self.password2})
        self.assertContains(response,'Invalid mobile number/email and password combination.')

    def test_loginView_not_registered(self):
        self.client.get(reverse('user:request-otp'))
        self.client.post(reverse('user:request-otp'),
            {'mobile_number':right_number})
        self.client.get(reverse('user:validate-otp'))
        self.client.post(reverse('user:validate-otp'),
            {'otp':self.client.session['otp']})
        self.client.get(reverse('user:login'))
        response = self.client.post(reverse('user:login'),
            {'mobile_number':self.right_number,'password':self.password1})
        self.assertContains(response,'Invalid mobile number/email and password combination.')

    def test_loginView_not_validated(self):
        self.client.get(reverse('user:request-otp'))
        self.client.post(reverse('user:request-otp'),
            {'mobile_number':right_number})
        self.client.get(reverse('user:login'))
        response = self.client.post(reverse('user:login'),
            {'mobile_number':self.right_number,'password':self.password1})
        self.assertContains(response,'Invalid mobile number/email and password combination.')

    def test_login_required_redirection(self):
        self.client.get(reverse('user:feedback'))
        response = self.client.post(reverse('user:feedback'),
                {})
        self.assertRedirects(response,reverse('user:login')+
                '?next='+reverse('user:feedback'))

    def test_login_view_redirection_after_login_required(self):
        registerFunc(self)
        self.client.get(reverse('user:login'))
        response = self.client.post(reverse('user:login'),{
                'mobile_number': right_number,
                'password': password1,
                'next': reverse('user:feedback')
            })
        self.assertRedirects(response,reverse('user:feedback'))

    def test_loginView_login_required_next_post_from_get(self):
        registerFunc(self)
        response = self.client.get(reverse('user:login')+
            '?next='+reverse('user:feedback'))
        self.assertEqual(response.context['form'].is_bound,True)
        self.assertEqual(response.context['form']['next'].value(),reverse('user:feedback'))

    def test_logoutView_success(self):
        loginFunc(self)
        response = self.client.get(reverse('user:logout'))
        self.assertRedirects(response,reverse('user:login'))
        self.assertEqual(bool(response.client.session.get('_auth_user_id')),False)
        self.assertEqual(bool(response.client.session.get('_auth_user_backend')),False)
        self.assertEqual(bool(response.client.session.get('_auth_user_hash')),False)

    def test_feedback_success(self):
        loginFunc(self)
        self.client.get(reverse('user:feedback'))
        response = self.client.post(reverse('user:feedback'),{
            'message': 'At least 10 characters'
        })
        self.assertEqual(response.context['message'],'Your feedback has been saved.')
        self.assertEqual(len(mail.outbox),1)
        self.assertEqual(mail.outbox[0].subject,'Feedback from {} {}({}).'.format(
            details['first_name'],details['last_name'],right_number
        ))

    def test_redirection_not_logged_in(self):
        loginFunc(self)
        response = self.client.get(reverse('user:register'))
        self.assertRedirects(response,reverse('dashboard:home'))