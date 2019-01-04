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

hindi_numbers_map = {
  '1': '१‍',
  '2': '२',
  '3': '३',
  '4': '४',
  '5': '५',
  '6': '६',
  '7': '७',
  '8': '८',
  '9': '९',
  '0': '०',
}

def translate_number_to_hindi_chars(num_str, separate=False):
  hin_str = ""
  for i in num_str:
    if i in hindi_numbers_map:
      hin_str += hindi_numbers_map[i]
      if separate:
        hin_str += ' '
    else:
      hin_str += i
  return hin_str

def get_room_reference(lodging, sublodging):
  if sublodging.lodging_type=='R':
    text = "कमरा जिसकी संख्या "+translate_number_to_hindi_chars(str(sublodging.room_number))+" है व "
  else:
    text = "घर जिसकी "
  text+="मंज़िल "+translate_number_to_hindi_chars(str(sublodging.floor_no))+' है और पता '+\
        translate_number_to_hindi_chars(lodging.address,True)+' है '
  return text
