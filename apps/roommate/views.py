from django.shortcuts import render
from .forms import RoomieAdForm
from .models import RoomieAd
from django.http import HttpResponseRedirect
from django.db import transaction
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user
from django.urls import reverse
from apps.locations.models import State


@login_required
def roomie_ad_create_view(request):
    formset = ImageFormset(prefix='image')
    if request.method=='POST':
        form = RoomieAdForm(request.POST)
        if form.is_valid():
            roomie_ad = form.save(commit=False)
            roomie_ad.user = request.user
            formset = ImageFormset(request.POST,request.FILES,
                instance=roomie_ad,prefix='image')
            if formset.is_valid():
                with transaction.atomic():
                    roomie_ad.save()
                    formset.save()
                return HttpResponseRedirect(reverse('ads:roomie-list',
                    kwargs={'district':form.cleaned_data['district'].name,
                    'district_id':form.cleaned_data['district'].id,
                    'state':State.objects.get(pk=form.cleaned_data['state']).name,
                    'state_id':form.cleaned_data['state']}))
    else:
        form = RoomieAdForm()
    return render(request,'roommate/form.html',
        {'form':form,'formset':formset})