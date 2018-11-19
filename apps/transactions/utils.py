import http.client
from django.conf import settings
import os
import requests
import random
import json
import time
from django.contrib import messages
from django.core.exceptions import ValidationError

onlease_last_message = ' www.onlease.in'

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
        'sender': 'ONLNTF',
        'country': '91',
        'route': '4'
    }
    url = 'http://api.msg91.com/api/sendhttp.php'
    response = requests.get(url,params=params)

def send_otp(session, mobile_number, user, otp):
    if 'time' in session and time.time() - session['time']<60:
        raise ValidationError('Request to send OTP can be made only after 1 minute')
    session['otp'] = otp
    session['time'] = time.time()
    if settings.DEBUG==True:
        return
    url = 'http://control.msg91.com/api/sendotp.php'
    otp = session['otp']
    params={
        'mobile': mobile_number,
        'authkey': os.environ.get('MSG91_AUTH_KEY'),
        'message': 'Your verification code is '+otp+'. This code will expire in 3 minutes.'+onlease_last_message,
        'sender': 'ONLOTP',
        'otp': otp
    }
    res = requests.post(url=url, params=params)
    data = json.loads(res.text)
    if data['type']=='error':
        raise ValidationError('Sorry, OTP was not sent. Please try again')

def get_name(user):
    if not user.first_name and user.last_name:
        user_name = "User"
    else:
        if user.first_name:
            user_name += user.first_name
        if user.last_name:
            user_name += ' ' + user.last_name
    return user_name

def successfull_transaction_message(owner,customer,lodging,transaction):
    message = 'Dear '+get_name(customer)+', your transaction id is '+str(transaction.id)+'. Contact number of owner is '+owner.mobile_number+'. You can see further details on our website.'+onlease_last_message
    return message

def invalid_transaction_message(owner,customer,lodging,transaction,response):
    message = 'Dear '+get_name(customer)+', your transaction id is '+str(transaction.id)+'. Your transaction was invalid.'+onlease_last_message
    return message

def lodging_booked_message(owner,customer,lodging,transaction):
    # TODO User all mobile numbers
    return 'Dear '+get_name(owner)+', your property has been booked. This is his/her contact number: '+customer.mobile_number+'.'+onlease_last_message
