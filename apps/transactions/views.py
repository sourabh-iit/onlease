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
from requests.exceptions import ConnectionError
from json.decoder import JSONDecodeError
from .utils import send_message, successfull_transaction_message, lodging_booked_message

api = Instamojo(api_key=settings.INSTAMOJO_API_KEY,
        auth_token=settings.INSTAMOJO_AUTH_KEY,
        endpoint=settings.INSTAMOJO_ENDPOINT)

@login_required
def redirect_to_instamojo_view(request,state,state_id,district,district_id,ad_id):
    transactions_lodging = reverse('transactions:lodging', kwargs={
        'state':state,'state_id':state_id,'district':district,'district_id':district_id,'ad_id':ad_id})
    ads_list = reverse('ads:list', kwargs={
        'state':state,'state_id':state_id,'district':district,'district_id':district_id})
    try:
        lodging = Lodging.objects.prefetch_related('sublodging').get(id=ad_id)
        if lodging.sublodging.is_booked or lodging.sublodging.no_times_refunded>=2:
            if lodging.sublodging.is_booked:
                messages.error(request,'This lodging is already booked')
            else:
                messages.error(request,'This is lodging is not available for booking anymore')
            return HttpResponseRedirect(ads_list)
        if lodging.sublodging.is_blocked:
            raise ViewException('This lodging is under process of booking by another user')
        try:
            transaction_ = LodgingTransaction.objects.filter(
                status=LodgingTransaction.SUCCESS,
                created_at__gte=datetime.datetime.now()-datetime.timedelta(days=3),
                user=request.user
            ).latest('updated_at')
        except:
            transaction_=None
        if transaction_:
            raise ValidationError('You have lodging that needs to be settled')
        amount = lodging.sublodging.rent//10
        transaction_ = LodgingTransaction.objects.create(
            amount = amount,
            user = request.user,
            lodging = lodging
        )
        response = api.payment_request_create(
            amount=amount,
            purpose=transaction_.id,
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
            transaction_.payment_request_id = response['payment_request']['id']
            transaction_.save()
            return HttpResponseRedirect(
                response['payment_request']['longurl']+'?embed=form')
        messages.error(request,'Failed to process request')
        return HttpResponseRedirect(transactions_lodging)
    except Lodging.DoesNotExist:
        messages.error(request,'Lodging with id '+ad_id+' does not exist.')
        return HttpResponseRedirect(ads_list)
    except (ValidationError,ViewException) as e:
        messages.error(request,e)
        return HttpResponseRedirect(ads_list)
    except ConnectionError as e:
        messages.error(request,'Connection could not be made. Please check your internet connection')
        return HttpResponseRedirect(transactions_lodging)
    except JSONDecodeError as e:
        messages.error(require,'Currently payment gateway server is not responding correctly')
        return HttpResponseRedirect(transactions_lodging)


@login_required
def lodging_post_redirection_view(request):
    try:
        transaction_success = False
        payment_id = request.GET.get('payment_id')
        payment_request_id = request.GET.get('payment_request_id')
        response = api.payment_request_payment_status(payment_request_id,payment_id)
        transaction_ = LodgingTransaction.objects.prefetch_related(
            Prefetch('lodging',queryset=Lodging.objects.prefetch_related('posted_by',
                Prefetch('sublodging',queryset=CommonlyUsedLodgingModel.objects.prefetch_related('region'))
                )
            )
        ).get(id=response['payment_request']['purpose'])
        transaction_.payment_id=payment_id
        lodging = transaction_.lodging
        sublodging = lodging.sublodging
        region = sublodging.region
        if response['success']:
            data = response['payment_request']
            if float(data['amount'])==float(transaction_.amount):
                transaction_success = True
                transaction_.amount_paid=float(data['amount'])
                transaction_.payment_gateway_fees=data['payment']['fees']
                transaction_.status=LodgingTransaction.SUCCESS
                sublodging.is_booked=True
                messages.success(request,'Your transaction was successful')
            else:
                messages.error(request,'An invalid amount was paid')
        else:
            messages.error(request,'Transaction was failed')
        with transaction.atomic():
            sublodging.save()
            transaction_.save()
        send_message(request.user.mobile_number,
            successfull_transaction_message(
                lodging.posted_by,request.user,
                lodging,transaction_))
        send_message(lodging.posted_by.mobile_number,
            lodging_booked_message(lodging.posted_by,request.user,
            lodging,transaction_))
    except LodgingTransaction.DoesNotExist:
        messages.error(request,'Invalid transaction')
        return HttpResponseRedirect(reverse('ads:choose-location'))
    return render(request,'transactions/success.html',{'region':region,
                'lodging':lodging,'transaction':transaction_,'sublodging':sublodging,
                'success': transaction_success})

@login_required
def confirm_order_view(request,state,state_id,district,district_id,ad_id):
    try:
        lodging = Lodging.objects.prefetch_related(Prefetch(
            'sublodging',queryset=CommonlyUsedLodgingModel.objects.prefetch_related('images'))
        ).get(id=ad_id)
        sublodging = lodging.sublodging
        sublodging.image = sublodging.images.all()[0]
        return render(request,'transactions/confirm_order.html',{
            'amount':sublodging.rent//10,
            'state': state,
            'state_id': state_id,
            'district': district,
            'district_id': district_id,
            'ad_id': ad_id,
            'slug': sublodging.slug,
            'ad': sublodging,
            'lodging': lodging
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
                return HttpResponse('ok',status=200)
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
        return HttpResponse('ok',status=200)

