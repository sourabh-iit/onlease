from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST, require_http_methods
from django.http import HttpResponseRedirect, HttpResponseBadRequest, JsonResponse, HttpResponseNotFound
from django.urls import reverse
from django.conf import settings
from django.db import transaction
from django.dispatch import receiver
from django.db.models.signals import post_delete, post_save
from django.contrib import messages
from django.db.models.query import Prefetch
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db.models import Q

from .models import ImageModel, Lodging, CommonlyUsedLodgingModel, thumbnail_size, \
                    mobile_image_size
from .forms import LodgingCreateForm, CommonlyUsedLodgingCreateForm, \
                    CommonlyUsedLodgingUpdateForm
from .utils import generate_random, create_thumbnail
from apps.user.utils import ViewException, number_verfication_required
from apps.roommate.models import Image
from apps.dashboard.models import ProfileImage
from apps.user.utils import maintain_cookie
from apps.locations.models import Region

import re
import base64
import io
import os
import shutil

def delete_files(*args):
    for file in args:
        if os.path.isfile(settings.MEDIA_ROOT+'/'+file):
            os.remove(settings.MEDIA_ROOT+'/'+file)

@receiver(post_delete, sender=ImageModel)
def delete_image(sender,instance,using,**kwargs):
    delete_files(
        instance.image.name,
        instance.image_mobile.name,
        instance.image_thumbnail.name)

@receiver(post_delete, sender=Image)
def delete_image(sender,instance,using,**kwargs):
    delete_files(
        instance.image.name,
        instance.image_mobile.name,
        instance.image_thumbnail.name)

@receiver(post_delete, sender=ProfileImage)
def delete_image(sender,instance,using,**kwargs):
    delete_files(
        instance.image.name,
        instance.image_thumbnail.name)


@maintain_cookie
@login_required
@number_verfication_required
def lodging_create_view(request):
    if request.method=='POST':
        data = request.POST
        if 'id' in data:
            lodging = Lodging.objects.select_related('sublodging').get(id=data['id'])
            form = LodgingCreateForm(request,data,instance=lodging)
            sub_form = CommonlyUsedLodgingCreateForm(request,data,instance=lodging.sublodging)
        else:
            form = LodgingCreateForm(request,data)
            sub_form = CommonlyUsedLodgingCreateForm(request,data)
        if sub_form.is_valid() and form.is_valid():
            sublodging = sub_form.save(commit=False)
            lodging = form.save(commit=False)
            lodging.posted_by = request.user
            with transaction.atomic():
                lodging.save()
                sublodging.lodging = lodging
                sublodging.save()
            messages.success(request,"Lodging created successfully")
            return HttpResponseRedirect(reverse('ads:list',kwargs={
                'state_id':sublodging.region.state.id,
                'state':sublodging.region.state.name,
                'district_id':sub_form.cleaned_data['district'].id,
                'district':sublodging.region.district.name
            }))
        else:
            messages.error(request,'Error occurred while processing input')
    else:
        try:
            lodging = Lodging.objects.prefetch_related(Prefetch(
                'sublodging',queryset=CommonlyUsedLodgingModel.objects.select_related('images')
            )).get(Q(posted_by=request.user)|Q(session_key=request.session.session_key),
            sublodging__temporary=True)
        except Lodging.DoesNotExist:
            lodging = None
        if lodging:
            form = LodgingCreateForm(request,instance=lodging)
            sub_form = CommonlyUsedLodgingCreateForm(request,instance=lodging.sublodging)
        else:
            form = LodgingCreateForm(request)
            sub_form = CommonlyUsedLodgingCreateForm(request)
    return render(request,'lodging/create_lodging.html',{'form': form,
        'sub_form': sub_form})


@maintain_cookie
@login_required
@require_POST
@number_verfication_required
def create_temporary_lodging(request):
    data = request.POST
    if 'id' in data:
        try:
            lodging = Lodging.objects.select_related('sublodging').get(id=data['id'])
            form = LodgingCreateForm(request,data,instance=lodging)
            sub_form = CommonlyUsedLodgingCreateForm(request,data,instance=lodging.sublodging)
        except Lodging.DoesNotExist:
            return HttpResponseNotFound('Lodging does not exist')
    else:
        form = LodgingCreateForm(request,data)
        sub_form = CommonlyUsedLodgingCreateForm(request,data)
    if form.is_valid() and sub_form.is_valid():
        with transaction.atomic():
            lodging = form.save()
            sublodging = sub_form.save(commit=False)
            sublodging.lodging = lodging
            sublodging.save()
        return JsonResponse({'id':lodging.id})
    return HttpResponseBadRequest({'errors':form.errors})


@maintain_cookie
@login_required
@number_verfication_required
def lodging_edit_view(request,ad_id):
    uploaded=False
    try:
        lodging=Lodging.objects.prefetch_related(
            Prefetch(
                'sublodging',
                queryset=CommonlyUsedLodgingModel.objects.prefetch_related('images')
            ),
            'posted_by'
        ).get(id=ad_id)
        if lodging.posted_by!=request.user:
            messages.error('You are not authorized to access it')
            return HttpResponseRedirect(reverse('home:front-page'))
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
                return HttpResponseRedirect(reverse('lodging:edit',kwargs={
                    'ad_id':ad_id
                }))
            else:
                messages.error(request,'Error occurred while processing input')
    return render(request,'lodging/edit_lodging.html',
        {'sublodging_form': sublodging_form,'images':images})

@login_required
@require_POST
def image_upload_view(request,ad_type):
    if ad_type!='user-profile' and 'tag' not in request.POST:
        return HttpResponseBadRequest({'errors':{'image':'Image tag is required'}})
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
            thumb_size=(50,50)
        else:
            thumb_size=thumbnail_size
            image_mobile = create_thumbnail(file,mobile_image_size,
            image_name+'.mobile.jpeg')
        thumb_file = create_thumbnail(file,thumb_size,
            image_name+'.thumbnail.jpeg')
        if ad_type=='lodging':
            im = ImageModel.objects.create(image=file,image_thumbnail=thumb_file,
            image_mobile=image_mobile,tag=request.POST['tag'])
        elif ad_type=='roommate':
            im = Image.objects.create(image=file,image_thumbnail=thumb_file,
            image_mobile=image_mobile,tag=request.POST['tag'])
        elif ad_type=='user-profile':
            try:
                profile = request.user.profile
                if(profile):
                    profile.delete()
            except:
                pass
            im = ProfileImage.objects.create(image=file,image_thumbnail=thumb_file,
                user=request.user)
        return JsonResponse({
            'id':im.id,
            'url': im.image.url})
    except Exception as e:
        return HttpResponseBadRequest(request,{'errors':'Sorry, could not upload file.'})
            