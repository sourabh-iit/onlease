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
import hmac
import hashlib
from django.contrib import messages

api = Instamojo(api_key=settings.INSTAMOJO_API_KEY,
        auth_token=settings.INSTAMOJO_AUTH_KEY,
        endpoint=settings.INSTAMOJO_ENDPOINT)

@login_required
def redirect_to_instamojo_view(request,state,district,ad_id):
    try:
        lodging = Lodging.objects.prefetch_related('sublodging').get(id=ad_id)
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
            redirect_url='http://localhost:8000'+reverse('transactions:lodging-post-redirection')
        # webhook will be added here   
        )
        if response['success']:
            transaction.payment_request_id = response['payment_request']['id']
            transaction.save()
            return HttpResponseRedirect(
                response['payment_request']['longurl']+'?embed=form')
        messages.error(request,'Failed to process request')
        return HttpResponseRedirect(reverse('transactions:lodging',kwargs={'state':state,'district':district,'ad_id':ad_id}))
    except Lodging.DoesNotExist:
        messages.error(request,'Lodging with id '+ad_id+' does not exist.')
        return HttpResponseRedirect(reverse('ads:list',kwargs={'state':state,'district':district}))

@login_required
def lodging_post_redirection_view(request):
    try:
        payment_id = request.GET.get('payment_id')
        payment_request_id = request.GET.get('payment_request_id')
        response = api.payment_request_payment_status(payment_request_id,payment_id)
        transaction = LodgingTransaction.objects.prefetch_related('lodging').get(id=response['payment_request']['purpose'])
        lodging = transaction.lodging
        sublodging = lodging.sublodging
        location = sublodging.location
        if response['success']:
            data = response['payment_request']
            if float(data['amount'])==float(transaction.amount):
                transaction.amount_paid=float(data['amount'])
                transaction.payment_gateway_fees=data['payment']['fees']
                transaction.status=LodgingTransaction.SUCCESS
                transaction.save()
                sublodging.is_booked=True
                sublodging.save()
                messages.success(request,'Your order was successful')
                return render(request,'transactions/success.html',{'location':location,
                    'lodging':lodging,'transaction':transaction,'sublodging':sublodging})
        messages.error(request,'An invalid amount was paid')
        return render(request,'transactions/error.html',{
            'amount_paid': float(data['amount']),
            'transaction': transaction
        })
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

def lodging_webhook_view(request):
    if request.method=='POST':
        mac_provided = request.POST.pop('mac')
        message = "|".join(v for k, v in sorted(request.POST.items(), key=lambda x: x[0].lower()))
        mac_calculated = hmac.new(settings.INSTAMOJO_SALT, message, hashlib.sha1).hexdigest
        if mac_provided == mac_calculated:
            purpose = request.POST.get('purpose')
            try:
                transaction = LodgingTransaction.objects.get(purpose=purpose)
            except LodgingTransaction.DoesNotExist:
                return HttpResponse(request)
            if transaction.payment_id==request.POST.get('payment_id') and transaction.payment_request_id==request.POST.get('payment_request_id') and transaction.amount==request.POST.get('amount'):
                status = request.POST.get('status')
                if status=='Credit':
                    transaction.status=LodgingTransaction.SUCCESS
                    transaction.payment_gateway_fees = request.POST.get('fees')
                else:
                    transaction.status=LodgingTransaction.FAIL
                transaction.save()
        return HttpResponse(request)
