from django.shortcuts import render
from apps.ads.forms import LandingPageForm
from django.http import HttpResponseRedirect


def front_page_view(request):
    if 'min_rent' in request.method=='GET':
        form = LandingPageForm(request.GET)
        if form.is_valid():
            
            return HttpResponseRedirect(request,reverse())
    else:
        form = LandingPageForm()
    return render(request,'home/landing-page.html',{'form':form})