from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import ImageModel, Lodging,CommonlyUsedLodgingModel
from django.http import HttpResponseRedirect
from .forms import LodgingCreateForm, ImageForm, ImageFormset,\
                    CommonlyUsedLodgingCreateForm, CommonlyUsedLodgingUpdateForm
from django.urls import reverse
from apps.user.utils import ViewException
from django.conf import settings
from django.db import transaction
import os
from django.dispatch import receiver
from django.db.models.signals import post_delete
from django.contrib import messages
from apps.locations.models import Location

def delete_files(*args):
    for file in args:
        if os.path.isfile(settings.MEDIA_ROOT+'/'+file):
            os.remove(settings.MEDIA_ROOT+'/'+file)

@receiver(post_delete, sender=ImageModel)
def delete_image(sender,instance,using,**kwargs):
    delete_files(instance.image.name,instance.image_thumbnail.name)

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
        try:
            if not request.session.test_cookie_worked():
                raise ViewException('Cookies are not enabled')
            if sub_form.is_valid():
                sublodging = sub_form.save(commit=False)
                formset = ImageFormset(request.POST, request.FILES,
                        instance=sublodging,prefix="image")
                if form.is_valid() and formset.is_valid():
                    lodging = form.save(commit=False)
                    lodging.posted_by = request.user
                    location = Location.objects.get(pk=sub_form.cleaned_data['id'])
                    with transaction.atomic():
                        lodging.save()
                        sublodging.lodging = lodging
                        sublodging.location = location
                        sublodging.save()
                        formset.save()
                    messages.success(request,"Lodging created successfully")
                    return HttpResponseRedirect(reverse('dashboard:home'))
        except ViewException as e:
            messages.error(request,e)
        except Location.DoesNotExist:
            messages.error(request,'Choose location only from given options')
    else:
        request.session.set_test_cookie()
        form = LodgingCreateForm()
        sub_form = CommonlyUsedLodgingCreateForm()
        formset = ImageFormset(instance=CommonlyUsedLodgingModel(),prefix="image")
    return render(request,'lodging/create_lodging.html',{'form': form,
        'sub_form': sub_form, 'formset': formset})

@login_required
def lodging_edit_view(request,ad_id):
    try:
        lodging=Lodging.objects.prefetch_related('sublodging').get(id=ad_id)
        if lodging.posted_by!=request.user:
            raise ViewException('Unauthorized access')
        sublodging = lodging.sublodging
        images = sublodging.images.all()
    except Lodging.DoesNotExist:
        messages.error('Bad request')
        return HttpResponseRedirect(reverse('dashboard:home'))
    sublodging_form = CommonlyUsedLodgingUpdateForm(instance=sublodging)
    formset = ImageFormset(instance=CommonlyUsedLodgingModel(),prefix='image')
    if request.method=='POST':
        if request.session.test_cookie_worked():
            if 'delete' in request.POST:
                with transaction.atomic():
                    for image in images:
                        image.delete()
                    lodging.delete()
                messages.success(request,"Lodging deleted successfully")
                return HttpResponseRedirect(reverse('dashboard:home'))
            elif 'update' in request.POST:
                sublodging_form = CommonlyUsedLodgingUpdateForm(request.POST,
                    instance=sublodging)
                formset = ImageFormset(request.POST,request.FILES,instance=sublodging,
                    prefix='image')
                if sublodging_form.is_valid() and formset.is_valid():
                    with transaction.atomic():
                        sublodging_form.save()
                        formset.save()
                    messages.success(request,'Lodging updated successfully')
                    return HttpResponseRedirect(reverse('dashboard:home'))
        else:
            messages.error(request,'Cookies are not enabled')
    else:
        request.session.set_test_cookie()
    return render(request,'lodging/edit_lodging.html',
        {'sublodging_form': sublodging_form,'formset':formset})
