from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse, reverse_lazy
from django.contrib.auth.decorators import login_required
import time
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db.models import Q
from .forms import ValidateOtpForm, RegisterForm, LoginForm,\
      ResetPasswordForm, ContactForm, MobileNumberForm
from .utils import ViewException, maintain_cookie, not_logged_in
from .models import User
from django.db import IntegrityError
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.core.mail import send_mail, BadHeaderError
from django.contrib.auth.views import PasswordChangeView
from django.contrib.auth.password_validation import validate_password
from django.contrib import messages
from apps.transactions.utils import send_otp, generate_otp

cookie_message = 'Cookies are not enabled. We use cookies for better user experience.'

# check if test is not taking extra space, means multiple test cookies are not set

@maintain_cookie
def request_otp(request):
    if request.method=='POST':
        try:
            form=MobileNumberForm(request.POST)
            if form.is_valid():
                # save mobile number in sesison and redirect to verify number view 
                # with reset variable in get
                request.session['mobile_number']=form.cleaned_data['mobile_number']
                url=reverse('user:verify-number')
                return HttpResponseRedirect(url)
        except ViewException as e:
            messages.error(request,e)
    else:
        form=MobileNumberForm()
    return render(request,'user/request_otp.html',{'form':form})

@maintain_cookie
def verfiy_number(request):
    if request.method=='POST':
        form = ValidateOtpForm(request.POST)
        try:
            if form.is_valid():
                # no testcase for expiration till now
                # expiry time of an otp
                if time.time()-request.session['time']>60*3:
                    messages.error(request,'OTP has expired')
                # maximum number of attempts allowed on an otp
                if request.session['attempts']>=3:
                    messages.error(request,'Too many invalid attempts')
                if form.cleaned_data['otp'] != request.session.get('otp'):
                    request.session['attempts']+=1
                    # warning for number of invalid attempts
                    raise ViewException('Invalid OTP entered')
                # set user as verified. This is if request is for mobile verification
                if request.user.is_authenticated:
                    request.user.is_verified=True
                    request.user.save()
                    del request.session['time']
                else:
                    # set verfied as true and time of verification to prevent misuse
                    request.session['verified']=True
                    request.session['time']=time.time()
                # delete not required session keys
                del request.session['otp']
                del request.session['attempts']
                # send message of successful verification
                messages.success(request, 'OTP has been verfied successfully')
                # if it is for password reset, then redirect to reset_password_view
                if request.session.get('mobile_number'):
                    return HttpResponseRedirect(reverse('user:reset-password'))
                return HttpResponseRedirect(reverse('dashboard:home'))
        except ViewException as e:
            messages.error(request, e)
    else:
        form = ValidateOtpForm()
        if request.user.is_authenticated:
            # if user is authenticated, get mobile number from database
            mobile_number=request.user.mobile_number
        elif not request.session.get('mobile_number'):
            # if user is not authenticated and mobile number is not in session
            # redirect to required url
            messages.error(request,'Enter mobile number')
            return HttpResponseRedirect(reverse('user:request-otp'))
        else:
            # if user is not authenticated and mobile number is present is session
            mobile_number=request.session['mobile_number']
        # set required values in session
        request.session['otp'] = generate_otp(6)
        request.session['time'] = time.time()
        request.session['attempts'] = 0
        send_otp(request,mobile_number)
    return render(request,'user/validate_otp.html',{'form':form})

@maintain_cookie
@not_logged_in
def register_view(request):
    if request.method=='POST':
        form = RegisterForm(request.POST,request=request)
        try:
            if form.is_valid():
                mobile_number = form.cleaned_data['mobile_number']
                email = form.cleaned_data['email']
                # check that none of mobile number and email already exists
                if User.objects.filter(Q(mobile_number=mobile_number)|Q(email=email)).exists():
                    raise ViewException('User with this mobile number or email address already exists')
                # create instance of user model without password
                user = User(
                    mobile_number = mobile_number,
                    first_name = form.cleaned_data['first_name'],
                    last_name = form.cleaned_data['last_name'],
                    email = form.cleaned_data['email'],
                    is_dealer = form.cleaned_data['is_dealer']
                    )
                password = form.cleaned_data['password']
                # validate password using django' inbuilt validators also
                validate_password(password,user)
                # set password and save user instance
                user.set_password(password)
                user.save()
                # login user and set session
                login(request,user)
                messages.success(request,'You are registered successfully')
                return HttpResponseRedirect(reverse('user:verify-number'))
        except ViewException as e:
            messages.error(request, e)
        except ValidationError as e:
            messages.error(request, e)
    else:
        form = RegisterForm(request=request)
    return render(request,'user/register.html',{'form':form})

@maintain_cookie
@not_logged_in
def loginView(request):
    if request.method=='POST':
        form = LoginForm(request.POST)
        try:
            if form.is_valid():
                username = form.cleaned_data.get('username')
                password = form.cleaned_data.get('password')
                # authenticate user using django's inbuilt authenticate function
                user = authenticate(username=username,password=password)
                if not user:
                    raise ViewException('Invalid mobile number/email and password combination')
                # checks on user
                if user.status==User.BLOCKED:
                    raise ViewException('You are blocked. Contact admin for further action')
                if not user.is_active:
                    raise ViewException('Account is not active. Contact admin for further information')
                # log user in
                login(request,user)
                messages.success(request,"Logged in successfully")
                # redirect to required view
                if form.cleaned_data.get('next_'):
                    return HttpResponseRedirect(form.cleaned_data['next_'])
                return HttpResponseRedirect(reverse('dashboard:home'))
        except ViewException as e:
            messages.error(request, e)
    else:
        # set next varialbe data in form next_ field if it is available
        if request.GET.get('next'):
            form = LoginForm(initial={'next_': request.GET['next']})
        else:
            form = LoginForm()
    return render(request,'user/login.html',{'form':form})

def logoutView(request):
    logout(request)
    messages.success(request, 'Logged out successfully')
    return HttpResponseRedirect(reverse('user:login'))

@maintain_cookie
@not_logged_in
def reset_password_view(request):
    if request.method=='POST':
        try:
            form = ResetPasswordForm(request.POST)
            # mobile number is saved in session by previous views
            mobile_number = request.session['mobile_number']
            # if mobile number is verified, verified is set in session key
            if not request.session.get('verified') or time.time()-request.session['time']>3*60:
                # send mobile number is required message
                messages.error(request,'Mobile number verification is required')
                # redirect to enter mobile number view
                return HttpResponseRedirect(reverse('user:request-otp'))
            if form.is_valid():
                user = User.objects.get(mobile_number=mobile_number)
                password = form.cleaned_data['password']
                # validate password using django's inbuilt password validators
                validate_password(password,user)
                user.set_password(password)
                user.save()
                # clear session
                request.session.flush()
                # log user in
                login(request,user)
                messages.success(request, 'Password has been reset successfully')
                return HttpResponseRedirect(reverse('dashboard:home'))
        except (KeyError):
            messages.error(request,'Cannot process request. Invalid request')
        except User.DoesNotExist:
            messages.error(request,'User with this mobile number '+mobile_number+' does not exist')
        except ValidationError as e:
            form.add_error('password',e)
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
                    subject=form.cleaned_data['subject']+' '+form.cleaned_data['name'],
                    message=form.cleaned_data['message'],
                    from_email=form.cleaned_data['email'],
                    recipient_list=settings.RECIPIENTS,
                )
                print(mails)
            except BadHeaderError:
                messages.error(request,'Invalid header found.')
            if mails>0:
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