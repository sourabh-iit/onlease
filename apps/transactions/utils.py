from django.conf import settings
import os
import requests
import random
import json
import time

from rest_framework.exceptions import ValidationError

from django.urls import reverse

onlease_last_message = 'www.onlease.in'

def generate_otp(length):
    if settings.DEBUG:
        return '0000'
    rng = random.SystemRandom()
    return ''.join([str(rng.randint(0,9)) for _ in range(length)])

def send_otp(session, mobile_number):
    if 'time' in session and time.time() - session['time'] < 2*60:
        raise ValidationError('Request to send OTP can be made only after 2 minutes')
    otp = generate_otp(4)
    session['otp'] = otp
    session['mobile_number'] = mobile_number
    session['time'] = time.time()
    session['attempts'] = 0
    if settings.DEBUG==True:
        return
    url = 'http://control.msg91.com/api/sendotp.php'
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
    if not user.first_name:
        user_name = "User"
    else:
        user_name = user.first_name
        if user.last_name:
            user_name += ' ' + user.last_name
    return user_name

def get_lodging_link(lodging):
    # TODO: write view for viewing lodging
    return settings.BASE_URL + reverse("lodging:lodging-view", [lodging.id])

def successfull_transaction_message(customer, transaction, lodging):
    return f"Dear {get_name(customer)}, your transaction was successful. Your transaction id is {transaction.trans_id}. " +\
            f"Click on {get_lodging_link(lodging)} to see contact details. " + onlease_last_message

def lodging_booked_message(owner, customer):
    return f"Dear {get_name(owner)}, your lodging has been booked by {get_name(customer)}. Call on this" +\
            f" number {customer.mobile_number} to contact him/her. " + onlease_last_message
