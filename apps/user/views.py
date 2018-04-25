from django.shortcuts import render
from .forms import RequestOtpForm, ValidateOtpForm, RegisterForm, LoginForm,\
      ResetPasswordForm, ContactForm
from django.http import HttpResponseRedirect
from .utils import generate_otp, ViewException
from .models import MobileNumber, User
from django.urls import reverse, reverse_lazy
from django.db import IntegrityError
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
from .models import User
import time
from django.conf import settings
from django.core.mail import send_mail, BadHeaderError
from .utils import not_logged_in
from django.db.models import Q
from django.contrib.auth.views import PasswordChangeView
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.conf import settings
from django.contrib import messages

@not_logged_in
def request_otp(request):
    if request.method == 'POST':
        try:
            if request.POST.get('mobile_number'):
                form = RequestOtpForm(request.POST)
            else:
                form = RequestOtpForm(request.session)
            if not request.session.test_cookie_worked():
                raise ViewException("Cookies are not enabled")
            if form.is_valid():
                mobile_number = form.cleaned_data['mobile_number']
                if not MobileNumber.objects.filter(mobile_number=mobile_number).exists():
                    MobileNumber.objects.create(mobile_number=mobile_number)
                request.session['mobile_number'] = mobile_number
                request.session['otp'] = generate_otp(mobile_number)
                request.session['time'] = time.time()
                request.session.delete_test_cookie()
                url = reverse('user:validate-otp')
                if 'reset_password' in request.POST:
                    url += '?reset_password='+request.POST['reset_password']
                messages.success(request, 'OTP has been sent')
                return HttpResponseRedirect(url)
        except ViewException as e:
            messages.error(request, e)
    else:
        request.session.set_test_cookie()
        if 'reset_password' in request.GET:
            form = RequestOtpForm(initial={
                'reset_password': request.GET['reset_password']})
        else:
            form = RequestOtpForm()
    return render(request,'user/request_otp.html',{'form':form})

@not_logged_in
def validate_otp(request):
    if request.method=='POST':
        form = ValidateOtpForm(request.POST)
        try:
            if not request.session.test_cookie_worked():
                raise ViewException("Cookies are not enabled")
            if form.is_valid():
                try:
                    mobile_number = request.session['mobile_number']
                except:
                    messages.error('Bad request.')
                    return HttpResponseRedirect(reverse('user:request-otp'))
                # no testcase for expiration till now
                if time.time()-request.session['time']>60*3:
                    raise ViewException('OTP expired. Click on resend-otp')
                if not form.cleaned_data['otp'] == request.session['otp']:
                    raise ViewException('Invalid OTP.')
                m = MobileNumber.objects.get(mobile_number=mobile_number)
                m.is_verified = True
                m.save()
                request.session['uuid'] = str(m.uuid)
                del request.session['otp']
                del request.session['time']
                request.session.delete_test_cookie()
                messages.success(request, 'OTP has been verfied successfully')
                if request.POST['reset_password']=='True':
                    return HttpResponseRedirect(reverse('user:reset-password'))
                return HttpResponseRedirect(reverse('user:register'))
        except ViewException as e:
            messages.error(request, e)
    else:
        request.session.set_test_cookie()
        if 'reset_password' in request.GET:
            form = ValidateOtpForm(initial={
                'reset_password': request.GET['reset_password']})
        else:
            form = ValidateOtpForm()
    return render(request,'user/validate_otp.html',{'form':form})

@not_logged_in
def register_view(request):
    if request.method=='POST':
        form = RegisterForm(request.POST,request=request)
        try:
            if not request.session.test_cookie_worked():
                raise ViewException("Cookies are not enabled")
            if form.is_valid():
                mobile_number = request.session['mobile_number']
                m = MobileNumber.objects.get(mobile_number=mobile_number)
                if not (m.is_verified and str(m.uuid)==request.session.get('uuid')):
                    return HttpResponseRedirect(reverse('user:request-otp'))
                if User.objects.filter(mobile_number=mobile_number).exists():
                    raise ViewException('User with this mobile number already exists')
                password = form.cleaned_data['password']
                user = User(
                    mobile_number = mobile_number,
                    first_name = form.cleaned_data['first_name'],
                    last_name = form.cleaned_data['last_name'],
                    email = form.cleaned_data['email']
                    )
                validate_password(password,user)
                user.set_password(password)
                user.save()
                request.session.delete_test_cookie()
                login(request,user)
                messages.success(request,'You are registered successfully')
                return HttpResponseRedirect(reverse('dashboard:home'))
        except (KeyError,MobileNumber.DoesNotExist):
            messages.error(request,"Bad request")
            return HttpResponseRedirect(reverse('user:request-otp'))
        except ViewException as e:
            messages.error(request, e)
        except ValidationError as e:
            messages.error(request, e)
    else:
        request.session.set_test_cookie()
        form = RegisterForm(request=request)
    return render(request,'user/register.html',{'form':form,'so':'dfg'})

@not_logged_in
def loginView(request):
    if request.method=='POST':
        form = LoginForm(request.POST)
        try:
            if not request.session.test_cookie_worked():
                raise ViewException('Cookies are not enabled.')
            if form.is_valid():
                username = form.cleaned_data.get('username')
                password = form.cleaned_data.get('password')
                user = authenticate(username=username,password=password)
                if not user:
                    raise ViewException('Invalid mobile number/email and password combination')
                if user.status==User.BLOCKED:
                    raise ViewException('You are blocked. Contact admin for further action')
                if not user.is_active:
                    raise ViewException('Account is not active. Contact admin for further information')
                login(request,user)
                request.session.delete_test_cookie()
                messages.success(request,"Logged in successfully")
                if form.cleaned_data.get('next_'):
                    return HttpResponseRedirect(form.cleaned_data['next_'])
                return HttpResponseRedirect(reverse('dashboard:home'))
        except ViewException as e:
            messages.error(request, e)
    else:
        request.session.set_test_cookie()
        if request.GET.get('next'):
            form = LoginForm(initial={'next_': request.GET['next']})
        else:
            form = LoginForm()
    return render(request,'user/login.html',{'form':form})

def logoutView(request):
    logout(request)
    messages.success(request, 'Logged out successfully')
    return HttpResponseRedirect(reverse('user:login'))

@not_logged_in
def reset_password_view(request):
    if request.method=='POST':
        try:
            form = ResetPasswordForm(request.POST)
            mobile_number = request.session['mobile_number']
            uuid = request.session['uuid']
            MobileNumber.objects.get(mobile_number=mobile_number,
                uuid=uuid)
            if form.is_valid():
                user = User.objects.get(mobile_number=mobile_number)
                password = form.cleaned_data['password']
                validate_password(password,user)
                user.set_password(password)
                user.save()
                request.session.flush()
                messages.success(request, 'Password has been reset successfully')
                return HttpResponseRedirect(reverse('user:login'))
        except (KeyError,MobileNumber.DoesNotExist):
            messages.error(request,'Cannot process request. Invalid request')
        except User.DoesNotExist:
            messages.error(request,'User with mobile number '+mobile_number+' does not exist')
    else:
        form = ResetPasswordForm()
    return render(request,'user/reset_password.html',{'form':form})

class PasswordChangeView2(PasswordChangeView):
    success_url=reverse_lazy('dashboard:home')
    template_name = 'user/change_password.html'

def contact_view(request):
    if request.method=='POST':
        form = ContactForm(request.user,request.POST)
        if form.is_valid():
            form.save()
            try:
                mails = send_mail(
                    subject=form.cleaned_data['subject']+form.cleaned_data['name'],
                    message=form.cleaned_data['message'],
                    from_email=form.cleaned_data['email'],
                    recipient_list=settings.RECIPIENTS,
                    fail_silently=True
                )
            except BadHeaderError:
                messages.error(request,'Invalid header found.')
            if mails==0:
                messages.success(request, "Your message has been saved with us. We will contact you soon")
            else:
                messages.error(request,"Unable to send message. Please try again later")
    else:
        user = request.user
        initial = {}
        if user.is_authenticated:
            initial = {'name': '{} {}'.format(user.first_name,user.last_name),
                'email': user.email, 'mobile_number': user.mobile_number}
        form = ContactForm(request.user,initial=initial)
    return render(request,'user/contact.html',{'form':form})