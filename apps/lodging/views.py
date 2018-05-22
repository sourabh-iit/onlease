from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import ImageModel, Lodging,CommonlyUsedLodgingModel, image_upload_directory
from django.http import HttpResponseRedirect
from .forms import LodgingCreateForm, ImageForm, ImageFormset, UpdateImageFormset,\
                    CommonlyUsedLodgingCreateForm, CommonlyUsedLodgingUpdateForm
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

def delete_files(*args):
    for file in args:
        if os.path.isfile(settings.MEDIA_ROOT+'/'+file):
            os.remove(settings.MEDIA_ROOT+'/'+file)

@receiver(post_delete, sender=ImageModel)
def delete_image(sender,instance,using,**kwargs):
    image = os.path.splitext(instance.image.name)
    delete_files(
        instance.image.name,
        instance.image_thumbnail.name,
        image[0]+'.large'+image[1])

@receiver(post_delete, sender=Lodging)
def delete_lodging(sender,instance,using,**kwargs):
    shutil.rmtree(settings.MEDIA_ROOT+'/'+image_upload_directory(instance))


@maintain_cookie
@login_required
def lodging_create_view(request):
    if not request.user.is_verified:
        messages.error(request,'Verify mobile number to add business')
        return HttpResponseRedirect(reverse('dashboard:home'))
    if request.method=='POST':
        form = LodgingCreateForm(request.POST)
        sub_form = CommonlyUsedLodgingCreateForm(request.POST)
        formset = ImageFormset(request.POST,request.FILES,
            instance=CommonlyUsedLodgingModel(), prefix="image")
        # try:
        if sub_form.is_valid():
            sublodging = sub_form.save(commit=False)
            formset = ImageFormset(request.POST, request.FILES,
                    instance=sublodging,prefix="image")
            if form.is_valid() and formset.is_valid():
                lodging = form.save(commit=False)
                lodging.posted_by = request.user
                with transaction.atomic():
                    lodging.save()
                    sublodging.lodging = lodging
                    sublodging.save()
                    formset.save()
                messages.success(request,"Lodging created successfully")
                return HttpResponseRedirect(reverse('ads:list',kwargs={
                    'state_id':sublodging.region.state.id,
                    'state':sublodging.region.state.name,
                    'district_id':sub_form.cleaned_data['district'].id,
                    'district':sublodging.region.district.name
                }))
        # except ViewException as e:
        #     formset.add_error(None,e)
    else:
        request.session.set_test_cookie()
        form = LodgingCreateForm()
        sub_form = CommonlyUsedLodgingCreateForm()
        formset = ImageFormset(instance=CommonlyUsedLodgingModel(),prefix="image")
    return render(request,'lodging/create_lodging.html',{'form': form,
        # 'sub_form': sub_form})
        'sub_form': sub_form, 'formset': formset})

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
    sublodging_form = CommonlyUsedLodgingUpdateForm(instance=sublodging)
    formset = UpdateImageFormset(instance=sublodging,prefix='image')
    if request.method=='POST':
        if request.session.test_cookie_worked():
            if 'delete' in request.POST:
                with transaction.atomic():
                    images.delete()
                    lodging.delete()
                messages.success(request,"Lodging deleted successfully")
                return HttpResponseRedirect(reverse('dashboard:home'))
            elif 'update' in request.POST:
                sublodging_form = CommonlyUsedLodgingUpdateForm(request.POST,
                    instance=sublodging)
                formset = UpdateImageFormset(request.POST,request.FILES,instance=sublodging,
                    prefix='image')
                if sublodging_form.is_valid() and formset.is_valid():
                    with transaction.atomic():
                        sublodging_form.save()
                        formset.save()
                    messages.success(request,'Lodging updated successfully')
                    return HttpResponseRedirect(reverse('ads:list',kwargs={
                        'state': sublodging.region.state.name,
                        'state_id': sublodging.region.state.id,
                        'district': sublodging.region.district.name,
                        'district_id': sublodging.region.district.id,
                    }))
        else:
            messages.error(request,'Cookies are not enabled')
    else:
        request.session.set_test_cookie()
    return render(request,'lodging/edit_lodging.html',
        {'sublodging_form': sublodging_form,'formset':formset})
