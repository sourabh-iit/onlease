import http.client
from django.conf import settings
import os
import requests
import random
import json
from django.contrib import messages

onlease_last_message = ' onlease.in'

def generate_otp(length):
    if settings.DEBUG:
        return '0000'
    rng = random.SystemRandom()
    return ''.join([str(rng.randint(0,9)) for _ in range(length)])

def send_message(mobile_number,message):
    if settings.DEBUG==True:
        return
    params={
        'mobiles': mobile_number,
        'authkey': os.environ.get('MSG91_AUTH_KEY'),
        'message': message,
        'sender': 'ONLSMS',
        'country': '91',
        'route': '4'
    }
    url = 'http://api.msg91.com/api/sendhttp.php'
    response = requests.get(url,params=params)
    

def send_otp(request,mobile_number):
    if settings.DEBUG==True:
        return
    mobile_number=mobile_number
    url = 'http://control.msg91.com/api/sendotp.php'
    otp = request.session['otp']
    params={
        'mobile': mobile_number,
        'authkey': os.environ.get('MSG91_AUTH_KEY'),
        'message': 'This code will expire in 3 minutes. Your verification code is '+otp+'.',
        'sender': 'ONLOTP',
        'otp': otp
    }
    # TODO make ajax compatible
    if 'total_otps' in request.session:
        if request.session['total_otps']>=5:
            messages.error(request,'Too many OTPs has been sent to this number')
            return
    else:
        request.session['total_otps']=0
    res = requests.post(url=url, params=params)
    data = json.loads(res.text)
    if request.is_ajax():
      return
    if data['type']=='error':
        messages.error(request,'Sorry, OTP was not sent. Please try again')
    else:
        messages.success(request,'An OTP has been sent successfully')

def successfull_transaction_message(owner,customer,lodging,transaction):
    message = 'Dear '+customer.first_name+', your transaction for lodging id '+str(lodging.id)+' was successfull. Your transaction id is '+str(transaction.id)+'. Contact number of owner/dealer is '+owner.mobile_number+'. You can see further details in your dashboard.'+onlease_last_message
    return message

def lodging_booked_message(owner,customer,lodging,transaction):
    owner_name = ""
    if owner.first_name:
        owner_name += owner.first_name
    if owner.last_name:
        owner_name += owner.last_name
    return 'Dear '+owner_name+', your lodging with id '+str(lodging.id)+' has been booked. This is his/her mobile number: '+customer.mobile_number+'.'+onlease_last_message
