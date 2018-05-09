import http.client
from django.conf import settings
import os
import requests
import random
import json
from django.contrib import messages

def generate_otp(length):
    if settings.DEBUG:
        return '0000'
    rng = random.SystemRandom()
    return ''.join([str(rng.randint(0,9)) for _ in range(length)])

def send_message(mobile_number,message):
    params={
        'mobiles': mobile_number,
        'authkey': os.environ.get('MSG91_AUTH_KEY'),
        'message': message,
        'sender': 'ONLOTP',
        'country': '91',
        'route': '4',
        'response': 'json',
        'encrypt': '1'
    }
    url = 'http://api.msg91.com/api/sendhttp.php'
    response = requests.get(url,params=params)
    import pdb; pdb.set_trace()

def send_otp(request,mobile_number):
    if settings.DEBUG==True:
        return
    mobile_number="+91"+mobile_number
    url = 'http://control.msg91.com/api/sendotp.php'
    otp = request.session['otp']
    params={
        'mobile': mobile_number,
        'authkey': os.environ.get('MSG91_AUTH_KEY'),
        'message': 'This code will expire in 3 minutes. Your verification code is '+otp+'.',
        'sender': 'ONLOTP',
        'otp': otp
    }
    if 'total_otps' in request.session:
        if request.session['total_otps']>=5:
            messages.error(request,'Too many OTPs has been sent to this number')
            return
    else:
        request.session['total_otps']=0
    res = requests.post(url=url, params=params)
    data = json.loads(res.text)
    if data['type']=='error':
        messages.error(request,'Sorry, OTP was not sent. Please try again')
    else:
        messages.success(request,'An OTP has been sent successfully')
