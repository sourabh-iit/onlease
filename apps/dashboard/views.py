from django.shortcuts import render
from apps.lodging.models import Lodging, CommonlyUsedLodgingModel
from django.contrib.auth.decorators import login_required
from .forms import ProfileForm, RefundForm
from apps.user.utils import ViewException
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth import get_user_model
from apps.transactions.models import LodgingTransaction
import datetime
from apps.user.utils import maintain_cookie
from django.core.exceptions import ValidationError
from instamojo_wrapper import Instamojo
from django.conf import settings
from django.contrib import messages
from django.db import transaction
from django.db.models.query import Prefetch

User = get_user_model()

api = Instamojo(api_key=settings.INSTAMOJO_API_KEY,
        auth_token=settings.INSTAMOJO_AUTH_KEY,
        endpoint=settings.INSTAMOJO_ENDPOINT)

def get_refund_amount(transaction):
    delay = datetime.datetime.now() - transaction.created_at
    if transaction.status!=LodgingTransaction.SUCCESS or delay>datetime.timedelta(days=3):
        return 0
    amount = float(transaction.amount_paid)
    if delay<=datetime.timedelta(days=1):
        return amount-(amount*5)//100
    elif delay<=datetime.timedelta(days=2):
        return amount-(amount*15)//100
    return amount-(amount*25)//100

@maintain_cookie
@login_required
def home_view(request):
    # Add businesses as they are made
    type=request.GET.get('type')
    lodgingtransactions=[]
    lodging_businesses=[]
    if type=='transactions':
        lodgings_bought = User.objects.raw("""
            SELECT
                u.mobile_number,
                t.created_at,
                c.title,
                ln.state,
                ln.district,
                ln.region,
                l.address,
                t.payment_id,
                t.id,
                t.status, 
                t.amount_paid
            FROM
                user_user u 
            INNER JOIN transactions_lodgingtransaction t
                ON u.mobile_number = t.user_id
            INNER JOIN lodging_lodging l 
                ON t.lodging_id=l.id
            INNER JOIN lodging_commonlyusedlodgingmodel c 
                ON l.id=c.id
            INNER JOIN locations_location ln
                ON c.location_id=ln.id
            WHERE
                u.mobile_number=%s""",[request.user.mobile_number]
        )
        lodgingtransactions = []
        for lodging in lodgings_bought:
            lodgingtransactions.append({
                'mobile_number': lodging.mobile_number,
                'created_at': lodging.created_at,
                'title': lodging.title,
                'location': lodging.region+', '+lodging.district+', '+lodging.state,
                'address': lodging.address,
                'payment_id': lodging.payment_id,
                'id': lodging.id,
                'status': lodging.status,
                'refund': get_refund_amount(lodging)
            })
    else:
        lodging_businesses = Lodging.objects.prefetch_related(
            Prefetch('sublodging',
            queryset=CommonlyUsedLodgingModel.objects.select_related('location'))).filter(posted_by=request.user)
    return render(
        request,'dashboard/home.html',
        {'lodging_businesses':lodging_businesses,
        'lodgingtransactions':lodgingtransactions})

@login_required
def refund_view(request,transaction_id):
    try:
        transaction_ = LodgingTransaction.objects.prefetch_related(
            Prefetch('lodging',queryset=Lodging.objects.select_related('sublodging'))
        ).get(pk=transaction_id)
        refund_amount = get_refund_amount(transaction_)
        if refund_amount==0:
            raise ViewException('You are not eligible for refund')
        if request.method=='POST':
            form = RefundForm(request.POST)
            if form.is_valid():
                if request.user.no_times_refunded>=2:
                    raise ViewException('Maximum times of refund has reached')
                response = api.refund_create(transaction_.payment_id,'QFL',form.cleaned_data['reason'],refund_amount)
                if response.get('success'):
                    sublodging=transaction_.lodging.sublodging
                    sublodging.is_booked=False
                    transaction_.status=LodgingTransaction.REFUNDED
                    request.user.no_times_refunded+=1
                    transaction_last = LodgingTransaction.objects.filter(lodging=transaction_.lodging)[1]
                    if transaction_last.status==LodgingTransaction.REFUNDED:
                        sublodging.no_times_refunded+=1
                    else:
                        sublodging.no_times_refunded=0                        
                    with transaction.atomic():
                        transaction_.save()
                        sublodging.save()
                        request.user.save()
                    messages.success(request,'Your refund has been generated')
                else:
                    messages.error(request,'Faced some error in generating your refund')
        else:
            form = RefundForm()
    except LodgingTransaction.DoesNotExist:
        messages.error(request,'Transaction does not exist')
        return HttpResponseRedirect(reverse('dashboard:home'))
    except ViewException as e:
        messages.error(request,e)
    return render(request,'dashboard/refund.html',{'form':form,
        'refund':refund_amount,'transaction_id':transaction_id})

@maintain_cookie
@login_required
def edit_profile_view(request):
    if request.method=='POST':
        form=ProfileForm(request.POST,instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request,'Profile has been updated successfully')
    else:
        form=ProfileForm(initial={
            'email':request.user.email,
            'mobile_number_alternate2':request.user.mobile_number_alternate2,
            'mobile_number_alternate1':request.user.mobile_number_alternate1,
            'is_dealer': request.user.is_dealer})
    return render(request,'dashboard/profile.html',{'form':form})