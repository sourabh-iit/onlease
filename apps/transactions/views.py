from django.shortcuts import render
from django.conf import settings
from apps.lodging.models import Lodging
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from .models import LodgingTransaction
from django.contrib.auth.decorators import login_required
from instamojo_wrapper import Instamojo
from django.utils.http import urlencode
from .forms import LodgingTransactionForm
from apps.lodging.models import Lodging, CommonlyUsedLodgingModel, ImageModel
import hmac
import hashlib
from django.contrib import messages
import datetime
from django.views.decorators.http import require_POST
from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models.query import Prefetch
from apps.user.utils import ViewException
from django.views.decorators.csrf import csrf_exempt

api = Instamojo(api_key=settings.INSTAMOJO_API_KEY,
        auth_token=settings.INSTAMOJO_AUTH_KEY,
        endpoint=settings.INSTAMOJO_ENDPOINT)

@login_required
def redirect_to_instamojo_view(request,state,district,ad_id):
    try:
        lodging = Lodging.objects.prefetch_related('sublodging').get(id=ad_id)
        if lodging.sublodging.is_booked or lodging.sublodging.no_times_refunded>=2:
            if lodging.sublodging.is_booked:
                messages.error(request,'This lodging is already booked')
            else:
                messages.error(request,'This is lodging is not available for booking anymore')
            return HttpResponseRedirect(reverse('ads:list',
                kwargs={'state':state,'district':district}))
        if lodging.sublodging.is_blocked:
            raise ViewException('This lodging is under process of booking by another user')
        transaction = LodgingTransaction.objects.filter(
            status=LodgingTransaction.SUCCESS,
            created_at__gte=datetime.datetime.now()-datetime.timedelta(days=3)
        ).latest('updated_at')
        if transaction:
            raise ValidationError('You have lodging that needs to be settled')
        amount = lodging.sublodging.rent//10
        transaction = LodgingTransaction.objects.create(
            amount = amount,
            user = request.user,
            lodging = lodging
        )
        response = api.payment_request_create(
            amount=amount,
            purpose=transaction.id,
            buyer_name=request.user.first_name,
            send_sms=True,
            phone=request.user.mobile_number,
            send_email=True,
            email=request.user.email,
            allow_repeated_payments=False,
            redirect_url=settings.BASE_URL+reverse('transactions:lodging-post-redirection')
            # webhook will be added here   
        )
        if response['success']:
            transaction.payment_request_id = response['payment_request']['id']
            lodging.sublodging.is_blocked=True
            with transaction.atomic():
                lodging.sublodging.save()
                transaction.save()
            return HttpResponseRedirect(
                response['payment_request']['longurl']+'?embed=form')
        print(response)
        messages.error(request,'Failed to process request')
        return HttpResponseRedirect(reverse('transactions:lodging',kwargs={'state':state,'district':district,'ad_id':ad_id}))
    except Lodging.DoesNotExist:
        messages.error(request,'Lodging with id '+ad_id+' does not exist.')
        return HttpResponseRedirect(reverse('ads:list',kwargs={'state':state,'district':district}))
    except (ValidationError,ViewException) as e:
        messages.error(request,e)
        return HttpResponseRedirect(reverse('ads:list',kwargs={'state':state,'district':district}))

@login_required
def lodging_post_redirection_view(request):
    try:
        payment_id = request.GET.get('payment_id')
        payment_request_id = request.GET.get('payment_request_id')
        response = api.payment_request_payment_status(payment_request_id,payment_id)
        transaction_ = LodgingTransaction.objects.prefetch_related(
            Prefetch('lodging',queryset=Lodging.objects.prefetch_related(
                Prefetch('sublodging',queryset=CommonlyUsedLodgingModel.objects.prefetch_related('location'))
                )
            )
        ).get(id=response['payment_request']['purpose'])
        transaction_.payment_id=payment_id
        lodging = transaction_.lodging
        sublodging = lodging.sublodging
        location = sublodging.location
        if response['success']:
            data = response['payment_request']
            if float(data['amount'])==float(transaction_.amount):
                transaction_.amount_paid=float(data['amount'])
                transaction_.payment_gateway_fees=data['payment']['fees']
                transaction_.status=LodgingTransaction.SUCCESS
                sublodging.is_booked=True
                messages.success(request,'Your order was successful')
            else:
                messages.error(request,'An invalid amount was paid')
        else:
            messages.error(request,'Transaction was failed')
        if LodgingTransaction.objects.count()>1:
            transaction_prev = LodgingTransaction.objects.order_by('-updated_at')[1]
            if transaction_prev.status==LodgingTransaction.SUCCESS:
                request.user.no_times_refunded=0
        sublodging.is_blocked=False
        with transaction.atomic():
            sublodging.save()
            transaction_.save()
            request.user.save()
        return render(request,'transactions/success.html',{'location':location,
                    'lodging':lodging,'transaction':transaction_,'sublodging':sublodging})
    except LodgingTransaction.DoesNotExist:
        messages.error(request,'Invalid transaction')
        return HttpResponseRedirect(reverse('ads:choose-location'))

@login_required
def confirm_order_view(request,state,district,ad_id):
    try:
        sublodging = Lodging.objects.prefetch_related('sublodging').get(id=ad_id).sublodging
        return render(request,'transactions/confirm_order.html',{
            'amount':sublodging.rent//10,
            'state': state,
            'district': district,
            'ad_id': ad_id,
            'slug': sublodging.slug
        })
    except Lodging.DoesNotExist:
        messages.error(request,'Lodging does not exist')
        return HttpResponse(reverse('ads:list',kwargs={'state': state,'district': district}))

@csrf_exempt
def lodging_webhook_view(request):
    if request.method=='POST':
        mac_provided = request.POST.pop('mac')
        message = "|".join(v for k, v in sorted(request.POST.items(), key=lambda x: x[0].lower()))
        mac_calculated = hmac.new(settings.INSTAMOJO_SALT, message, hashlib.sha1).hexdigest
        if mac_provided == mac_calculated:
            purpose = request.POST.get('purpose')
            try:
                transaction_ = LodgingTransaction.objects.prefetch_related(
                    Prefetch('lodging',queryset=Lodging.objects.prefetch_related(
                        Prefetch('sublodging',queryset=CommonlyUsedLodgingModel.objects.prefetch_related('location'))
                        )
                    )
                ).get(id=purpose)
            except LodgingTransaction.DoesNotExist:
                return HttpResponse('Received')
            status = request.POST.get('status')
            if transaction_.payment_id!=request.POST.get('payment_id'):
                transaction_.payment_id=request.POST.get('payment_id')
                lodging = transaction_.lodging
                sublodging = lodging.sublodging
                location = sublodging.location
                if status=='Credit':
                    if float(request.POST.get('amount'))==float(transaction_.amount):
                        transaction_.amount_paid=float(request.POST.get('amount'))
                        transaction_.payment_gateway_fees=request.POST.get('fees')
                        transaction_.status=LodgingTransaction.SUCCESS
                        sublodging.is_booked=True
                        messages.success(request,'Your order was successful')
                    else:
                        messages.error(request,'An invalid amount was paid')
                else:
                    messages.error(request,'Transaction was failed')
                if LodgingTransaction.objects.count()>1:
                    transaction_prev = LodgingTransaction.objects.order_by('-updated_at')[1]
                    if transaction_prev.status==LodgingTransaction.SUCCESS:
                        request.user.no_times_refunded=0
                sublodging.is_blocked=False
                with transaction.atomic():
                    sublodging.save()
                    transaction_.save()
                    request.user.save()
        return HttpResponse('Received')

