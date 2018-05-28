from PIL import Image
import io
from django.core.files.uploadedfile import InMemoryUploadedFile
import string
import random
import re
from .models import Lodging, ImageModel
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.core.exceptions import PermissionDenied

def create_thumbnail(img,size,thumb_name):
    img = img.file
    thumbnail = Image.open(img)
    thumbnail.thumbnail(size, Image.ANTIALIAS)
    thumbnail.name = thumb_name
    # save thumbnail to memory
    thumb_io = io.BytesIO()
    thumbnail.save(thumb_io,'JPEG')
    # new InMemoryUploadedFile object based on thumbnail
    file = InMemoryUploadedFile(
        thumb_io,
        'thumbnail',
        thumb_name,
        None,
        None, None
    )
    return file

def generate_random(size):
    # generate random number of given size
    char_arr = string.ascii_letters + string.digits
    return ''.join([random.SystemRandom().choice(char_arr) for _ in range(size)])

def clean_data(data):
    return re.sub(r'[7-9][0-9]{9}','',data)