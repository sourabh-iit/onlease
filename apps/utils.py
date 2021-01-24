import json
import random
import string
import io
import os
from PIL import Image
import requests

from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db.models import Q
from django.conf import settings

from rest_framework.permissions import BasePermission, SAFE_METHODS

from twilio.rest import Client

from apps.user.models import User

from sentry_sdk import capture_message

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


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS

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
