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

@login_required
def edit_profile_view(request):
    if request.method=='POST':
        form = ProfileForm(request.POST,instance=request.user)
        try:
            if not request.session.test_cookie_worked():
                raise ViewException('Cookies are not enabled')
            if form.is_valid():
                email = form.cleaned_data['email']
                account_number = form.cleaned_data['account_number']
                if email and User.objects.filter(email=email).exists():
                    raise ViewException('User with this email address already exists')
                if account_number and User.objects.filter(account_number=account_number).exists():
                    raise ViewException('User with this email address already exists')
                form.save()
                return HttpResponseRedirect(reverse('dashboard:home'))
        except ViewException as e:
            form.add_error(None,e)
    else:
        request.session.set_test_cookie()
        form = ProfileForm(request.user)
    return render(request,'dashboard/edit_profile.html',{'form':form})

# TODO Businesses edit, update and delete option