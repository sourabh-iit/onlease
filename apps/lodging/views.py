from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import ImageModel, Lodging,CommonlyUsedLodgingModel, image_upload_directory
from django.http import HttpResponseRedirect, HttpResponseBadRequest, JsonResponse
from .forms import LodgingCreateForm, ImageForm, UpdateImageFormset,\
                    CommonlyUsedLodgingCreateForm, CommonlyUsedLodgingUpdateForm,\
                    thumb_size
from django.urls import reverse
from apps.user.utils import ViewException
from django.conf import settings
from django.db import transaction
import os
import shutil
from django.dispatch import receiver
from django.db.models.signals import post_delete, post_save
from django.contrib import messages
from django.db.models.query import Prefetch
from apps.user.utils import maintain_cookie
from apps.locations.models import Region
from django.core.files.uploadedfile import InMemoryUploadedFile
from .utils import generate_random, create_thumbnail
import re
import base64
import io

def delete_files(*args):
    for file in args:
        if os.path.isfile(file):
            os.remove(file)

@receiver(post_delete, sender=ImageModel)
def delete_image(sender,instance,using,**kwargs):
    import pdb; pdb.set_trace()
    delete_files(
        instance.image.url,
        instance.image_thumbnail.url)

@maintain_cookie
@login_required
def lodging_create_view(request):
    if not request.user.is_verified:
        messages.error(request,'Verify mobile number to add business')
        return HttpResponseRedirect(reverse('dashboard:home'))
    if request.method=='POST':
        form = LodgingCreateForm(request.POST)
        sub_form = CommonlyUsedLodgingCreateForm(request.POST)
        if sub_form.is_valid():
            sublodging = sub_form.save(commit=False)
            if form.is_valid():
                lodging = form.save(commit=False)
                lodging.posted_by = request.user
                with transaction.atomic():
                    lodging.save()
                    sublodging.lodging = lodging
                    sublodging.save()
                    for image_id in request.POST.getlist('images'):
                        image = ImageModel.objects.get(id=image_id)
                        image.sublodging = sublodging
                        image.save()
                messages.success(request,"Lodging created successfully")
                return HttpResponseRedirect(reverse('ads:list',kwargs={
                    'state_id':sublodging.region.state.id,
                    'state':sublodging.region.state.name,
                    'district_id':sub_form.cleaned_data['district'].id,
                    'district':sublodging.region.district.name
                }))
    else:
        request.session.set_test_cookie()
        form = LodgingCreateForm()
        sub_form = CommonlyUsedLodgingCreateForm()
    return render(request,'lodging/create_lodging.html',{'form': form,
        'sub_form': sub_form})

@maintain_cookie
@login_required
def lodging_edit_view(request,ad_id):
    try:
        lodging=Lodging.objects.prefetch_related(
            Prefetch(
                'sublodging',
                queryset=CommonlyUsedLodgingModel.objects.prefetch_related('images')
            ),
            'posted_by'
        ).get(id=ad_id)
        if lodging.posted_by!=request.user:
            raise ViewException('Unauthorized access')
        sublodging = lodging.sublodging
        images = sublodging.images.all()
    except Lodging.DoesNotExist:
        messages.error('Bad request')
        return HttpResponseRedirect(reverse('dashboard:home'))
    sublodging_form = CommonlyUsedLodgingUpdateForm(None,instance=sublodging)
    if request.method=='POST':
        if 'delete' in request.POST:
            with transaction.atomic():
                images.delete()
                lodging.delete()
            messages.success(request,"Lodging deleted successfully")
            return HttpResponseRedirect(reverse('dashboard:home'))
        elif 'update' in request.POST:
            sublodging_form = CommonlyUsedLodgingUpdateForm(images,request.POST,
            instance=sublodging)
            if sublodging_form.is_valid():
                with transaction.atomic():
                    sublodging_form.save()
                    for image_id in request.POST.getlist('delete_images'):
                        for image in images:
                            if image.id==int(image_id):
                                image.delete()
                    for image_id in request.POST.getlist('images'):
                        image = ImageModel.objects.get(id=image_id)
                        image.sublodging = sublodging
                        image.save()
                messages.success(request,'Lodging updated successfully')
                return HttpResponseRedirect(reverse('ads:list',kwargs={
                    'state': sublodging.region.state.name,
                    'state_id': sublodging.region.state.id,
                    'district': sublodging.region.district.name,
                    'district_id': sublodging.region.district.id,
                }))
    return render(request,'lodging/edit_lodging.html',
        {'sublodging_form': sublodging_form,'images':images})

def image_upload_view(request):
    if request.method=="POST":
        try:
            dataUrlPattern = re.compile('data:image/(png|jpeg);base64,(.*)$')
            image_data = request.POST['image']
            image_data = dataUrlPattern.match(image_data).group(2)
            image_data = image_data.encode()
            image_data = base64.b64decode(image_data)
            image_name = generate_random(32)
            file = InMemoryUploadedFile(io.BytesIO(image_data),
                'image',image_name+'.jpeg',None,None,None)
            thumb_file = create_thumbnail(file,thumb_size,
                image_name+'.thumbnail.jpeg')
            im = ImageModel.objects.create(image=file,image_thumbnail=thumb_file)
            return JsonResponse({
                'id':im.id,
                'url': im.image_thumbnail.url})
        except Exception as e:
            return HttpResponseBadRequest(request,{'errors':'Sorry, could not upload file.'})