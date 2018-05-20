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
from .models import Refund
from apps.locations.models import Region

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
    type_=request.GET.get('type')
    lodgingtransactions=[]
    lodging_businesses=[]
    transaction = False
    if type_=='transactions':
        transaction = True
        lodgings_bought = User.objects.raw("""
            SELECT
                u.mobile_number,
                t.created_at,
                t.payment_id,
                t.id,
                t.status, 
                t.amount_paid,
                c.title,
                s.name as state,
                d.name as district,
                r.name as region,
                l.address
            FROM
                user_user u 
            INNER JOIN transactions_lodgingtransaction t
                ON u.mobile_number = t.user_id
            INNER JOIN lodging_lodging l 
                ON t.lodging_id=l.id
            INNER JOIN lodging_commonlyusedlodgingmodel c 
                ON l.id=c.id
            INNER JOIN locations_region r
                ON c.region_id=r.id
            INNER JOIN locations_district d
                ON r.district_id=d.id
            INNER JOIN locations_state s
                ON r.state_id=s.id
            WHERE
                u.mobile_number=%s
            AND(
                t.status=%s
            OR
                t.status=%s
            OR
                t.status=%s
            )
            ORDER BY
                t.updated_at DESC""",[request.user.mobile_number,
                LodgingTransaction.SUCCESS,LodgingTransaction.FAIL,
                LodgingTransaction.REFUNDED]
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
            Prefetch('sublodging',queryset=CommonlyUsedLodgingModel.objects.prefetch_related(
                Prefetch('region',
                queryset=Region.objects.prefetch_related('state','district')))
            )).filter(posted_by=request.user)
    return render(
        request,'dashboard/home.html',
        {'lodging_businesses':lodging_businesses,
        'lodgingtransactions':lodgingtransactions,
        'transaction': transaction})

@login_required
def refund_view(request,transaction_id):
    form = RefundForm()
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
                try:
                    response = api.refund_create(transaction_.payment_id,'QFL',form.cleaned_data['reason'],refund_amount)
                except ConnectionError:
                    response=None
                if response.get('success'):
                    sublodging=transaction_.lodging.sublodging
                    sublodging.is_booked=False
                    transaction_.status=LodgingTransaction.REFUNDED
                    request.user.no_times_refunded+=1
                    if request.user.lodgingtransaction.count()>1:
                        trans = request.user.lodgingtransaction.latest('updated_at')
                        if trans.status==LodgingTransaction.SUCCESS:
                            request.user.no_times_refunded=0
                    sublodging.no_times_refunded+=1
                    if transaction_.lodging.lodgingtransaction_set.count()>1:
                        trans = transaction_.lodging.lodgingtransaction_set.latest('updated_at')
                        if trans.status==LodgingTransaction.SUCCESS:
                            sublodging.no_times_refunded=0
                    with transaction.atomic():
                        transaction_.save()
                        sublodging.save()
                        request.user.save()
                    Refund.objects.create(
                        user=request.user,
                        amount=refund_amount,
                        reason = form.cleaned_data['reason']
                    )
                    messages.success(request,'Your refund has been generated')
                else:
                    if response:
                        messages.error(request,'Faced some error in generating your refund')
                    else:
                        messages.error(request,'Unable to process your request currently')
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