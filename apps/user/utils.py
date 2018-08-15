from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.db.models import Q
from django.contrib import messages

class ViewException(Exception):
    pass

email_regex = '[a-zA-Z][a-zA-Z0-9-\._]+@[a-zA-Z]+\.[a-zA-Z]{1,3}'
ifsc_regex = '^[A-Z]{4}0[A-Z0-9]{6}$'
password_digit = "^(?=[^0-9]*[0-9])[0-9a-zA-Z?\/.,<>():;'\"\[\]{}~!@#$%^&*-_+]*$"
password_lower_case_letter = "^(?=[^a-z]*[a-z])[0-9a-zA-Z?\/.,<>():;'\"\[\]{}~!@#$%^&*-_+]*$"
password_upper_case_letter = "^(?=[^A-Z]*[A-Z])[0-9a-zA-Z?\/.,<>():;'\"\[\]{}~!@#$%^&*-_+]*$"
mobile_number_regex = "^[789][0-9]{9}$"
otp_regex = '^[0-9]{4,6}$'
username_regex = "("+mobile_number_regex+")|"+"("+email_regex+")"
cookie_message = "Cookies are not enabled in browser"

def not_logged_in(view):
    def wrap(request,*args,**kwargs):
        if request.user.is_authenticated:
            if request.is_ajax():
              messages.success(request,'User already logged in.')
              return HttpResponseRedirect('/')
            else:
              return HttpResponse('User not logged in required.',status=400)
        else:
            return view(request,*args,**kwargs)
    wrap.__doc__ = view.__doc__
    wrap.__name__ = view.__name__
    return wrap

def number_verfication_required(view):
    def wrap(request,*args,**kwargs):
        if not request.user.is_verified:
            return HttpResponse({'errors':['Mobile number verification is required']},status=400)
        else:
            return view(request,*args,**kwargs)
    wrap.__doc__ = view.__doc__
    wrap.__name__ = view.__name__
    return wrap

def maintain_cookie(view):
    def wrap(request,*args,**kwargs):
        if request.method=='POST':
            if not request.session.test_cookie_worked():
                raise ViewException(cookie_message)
        elif request.method=='GET':
            try:
                request.session.delete_test_cookie()
            except KeyError:
                pass
            request.session.set_test_cookie()
        return view(request,*args,**kwargs)
    wrap.__doc__ = view.__doc__
    wrap.__name__ = view.__name__
    return wrap
