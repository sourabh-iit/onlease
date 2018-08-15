from PIL import Image
import io
from django.core.files.uploadedfile import InMemoryUploadedFile
import string
import random
import re
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.core.exceptions import PermissionDenied

def generate_random(size):
    # generate random number of given size
    char_arr = string.ascii_letters + string.digits
    return ''.join([random.SystemRandom().choice(char_arr) for _ in range(size)])

def clean_data(data):
    return re.sub(r'[7-9][0-9]{9}','',data)

# TODO
def measurement_unit_conversion():
    pass
