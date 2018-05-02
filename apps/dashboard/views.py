from django.shortcuts import render
from apps.lodging.models import Lodging, CommonlyUsedLodgingModel
from django.contrib.auth.decorators import login_required
from .forms import ProfileForm
from apps.user.utils import ViewException
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth import get_user_model

User = get_user_model()

@login_required
def home_view(request):
    # Add businesses as you made them
    lodging_businesses = Lodging.objects.filter(posted_by=request.user)
    return render(
        request,'dashboard/home.html',
        {'lodging_businesses':lodging_businesses})
