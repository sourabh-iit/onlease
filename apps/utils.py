import random
import string
import io

from PIL import Image

from django.core.files.uploadedfile import InMemoryUploadedFile

def generate_random(size):
    # generate random number of given size
    char_arr = string.ascii_letters + string.digits
    return ''.join([random.SystemRandom().choice(char_arr) for _ in range(size)])

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
