from django.shortcuts import render
from django.http import HttpResponseRedirect
from django import forms
from django.views.decorators.http import require_GET

from apps.common_forms import CommonQueryForm, CommonQueryFormMixin
from apps.roommate.forms import RoomieAdForm


class LandingPageForm(CommonQueryFormMixin,CommonQueryForm):
    business = forms.ChoiceField(choices=[
        ('MATES','MATES'),('PROPERTY','PROPERTY')],
        widget=forms.HiddenInput,initial="PROPERTY")


@require_GET
def front_page_view(request):
    if request.method=='GET':
        form = LandingPageForm(request.GET)
        if form.is_valid():
            return HttpResponseRedirect(request,reverse())
    else:
        form = LandingPageForm()
    return render(request,'home/landing-page.html',
        {'form':form})