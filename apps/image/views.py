from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.http import HttpResponseBadRequest, JsonResponse
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db.models.signals import post_delete
from django.dispatch import receiver

from apps.constants import *
from .models import ImageModel
from apps.utils import generate_random, create_thumbnail

import re
import base64
import io
import os

def delete_files(*files):
  for file in files:
    if os.path.isfile(file):
      os.remove(file)

@receiver(post_delete, sender=ImageModel)
def delete_images(sender,instance,*args,**kwargs):
  delete_files(instance.image.path,instance.image_mobile.path,
    instance.image_thumbnail.path)

@login_required
@require_POST
def image_upload_view(request,ad_type):
  # if ad_type!='user-profile' and 'tag' not in request.POST:
  #     return HttpResponseBadRequest({'errors':{'image':'Image tag is required'}})
  try:
    dataUrlPattern = re.compile('data:image/(png|jpg|jpeg|gif);base64,(.*)$')
    image_data = request.POST['image']
    image_data = dataUrlPattern.match(image_data).group(2)
    image_data = image_data.encode()
    image_data = base64.b64decode(image_data)
    image_name = generate_random(32)
    file = InMemoryUploadedFile(io.BytesIO(image_data),
      'image',image_name+'.jpeg',None,None,None)
    if ad_type=='user-profile':
      thumb_size=profile_thumbnail_size
      mobile_image = profile_moble_image_size
    else:
      thumb_size=thumbnail_size
      mobile_image = mobile_image_size
    image_mobile = create_thumbnail(file,mobile_image,
      image_name+'.mobile.jpeg')
    thumb_file = create_thumbnail(file,thumb_size,
      image_name+'.thumbnail.jpeg')
    if ad_type=='user-profile':
      try:
        profile = request.user.profile_image.all()
        if(len(profile)>0):
          profile.delete()
      except:
        pass
      im = ImageModel.objects.create(image=file,image_thumbnail=thumb_file,
        content_object=request.user,image_mobile=image_mobile)
    else:
      im = ImageModel.objects.create(image=file,image_thumbnail=thumb_file,
        image_mobile=image_mobile,tag=request.POST.get('tag'))
    return JsonResponse({
      'id': im.id,
      'url': im.image_mobile.url,
      'url_thumbnail': im.image_thumbnail.url,
    })
  except Exception as e:
    return HttpResponseBadRequest({'errors':'Sorry, could not upload file.'})
            