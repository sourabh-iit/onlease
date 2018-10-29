import http.client
from django.conf import settings
import os
import requests
import random
import json
from django.contrib import messages

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

def get_name(user):
    user_name = "User"
    if user.first_name:
        user_name += user.first_name
    if user.last_name:
        user_name += user.last_name

def successfull_transaction_message(owner,customer,lodging,transaction):
    message = 'Dear '+get_name(customer)+', your transaction for lodging "'+lodging.sublodging.title+'" was successfull. Your transaction id is '+str(transaction.id)+'. Contact number(s) of owner/dealer is/are '+owner.mobile_number+'. You can see further details on our website.'+onlease_last_message
    return message

def invalid_transaction_message(owner,customer,lodging,transaction,response):
    message = 'Dear '+get_name(customer)+', your transaction for lodging "'+lodging.sublodging.title+'" was invalid. Your transaction id is '+str(transaction.id)+'. You paid amount '+response['amount']+' while actual amount is '+transaction.amount+onlease_last_message
    return message

def failed_transaction_message(owner,customer,lodging,transaction):
    message = 'Dear '+get_name(customer)+', your transaction for lodging "'+lodging.sublodging.title+'" was failed. Your transaction id is '+str(transaction.id)+onlease_last_message
    return message

def lodging_booked_message(owner,customer,lodging,transaction):
    # TODO User all mobile numbers
    return 'Dear '+get_name(owner)+', your lodging "'+lodging.sublodging.title+'" has been booked. This is his/her contact number(s): '+customer.mobile_number+'.'+onlease_last_message
