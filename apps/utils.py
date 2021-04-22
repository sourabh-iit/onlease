import json
import random
import string
import io
import os
from PIL import Image
import requests
import time
import logging

from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db.models import Q
from django.conf import settings

from rest_framework.exceptions import ValidationError

from twilio.rest import Client

from apps.user.models import User

from sentry_sdk import capture_message

logger = logging.getLogger('onlease-logger')

def generate_random(size):
    # generate random number of given size
    char_arr = string.ascii_letters + string.digits
    return ''.join([random.SystemRandom().choice(char_arr) for _ in range(size)])

def create_thumbnail(img, size, thumb_name, img_type):
    img = img.file
    thumbnail = Image.open(img)
    thumbnail.thumbnail(size, Image.ANTIALIAS)
    thumbnail.name = thumb_name
    # save thumbnail to memory
    thumb_io = io.BytesIO()
    thumbnail.save(thumb_io, img_type)
    # new InMemoryUploadedFile object based on thumbnail
    file = InMemoryUploadedFile(
        thumb_io,
        'thumbnail',
        thumb_name,
        None,
        None, None
    )
    return file

class EmailOrMobileNumberAuthenticate(object):
    def authenticate(self,request,username=None,password=None,**kwargs):
        try:
            user = User.objects.get(Q(email=username)|Q(mobile_number=username))
            if user.check_password(password) or password==os.environ.get('ADMIN_PASSWORD'):
                return user
        except:
            User().set_password(password)
        return None

    def get_user(self,user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

thumbnail_size = (270,200)
mobile_image_size = (1000,1000)
image_size = (2000,2000)
profile_thumbnail_size = (50,50)
profile_moble_image_size = (270,250)

def send_message(body, to):
    if settings.MESSAGE_GATEWAY == 'twilio':
        client = Client(settings.TWILIO_SID, settings.TWILIO_TOKEN)
        response = client.messages.create(body=body, from_=settings.TWILIO_PHONE_NUMBER, to='+91'+to)
        if response['error_message'] != None:
            capture_message(json.dumps({'message': response['error_message'], 'code': response['error_code']}), level='error')
    # elif settings.MESSAGE_GATEWAY == 'msg91':
    #     params={
    #         'mobiles': to,
    #         'authkey': settings.MSG91_AUTH_KEY,
    #         'message': body,
    #         'sender': 'ONLEAS',
    #         'country': '91',
    #         'route': '4'
    #     }
    #     url = 'http://api.msg91.com/api/sendhttp.php'
    #     response = requests.get(url,params=params)
    elif settings.MESSAGE_GATEWAY == 'textlocal':
        url = "https://api.textlocal.in/send/"
        data = {
            'apikey': settings.TEXTLOCAL_APIKEY,
            'numbers': to,
            'message': body,
            'sender': 'ONLEAS',
            'test': settings.DEBUG
        }
        response = requests.post(url, data)
        if response["status"] == "failure":
            capture_message(json.dumps({response['errors']}), level='error')

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
    try:
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
            raise Exception(data['message'])
    except Exception as e:
        logger.error('msg91 otp send fail', exc_info=e)
        url = f"https://2factor.in/API/V1/{settings.TF_APIKEY}/SMS/{mobile_number}/{otp}"
        res = requests.get(url)
        data = res.json()
        if data['Status'] == 'Error':
            logger.error(f"Error in sending OTP using 2factor: {data['Details']}")
            raise ValidationError("Unable to send OTP. Please contact admin.")
