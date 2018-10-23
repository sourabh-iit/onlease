from django.shortcuts import render
from django.conf import settings
from apps.lodging.models import Lodging
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.urls import reverse
from django.db.utils import IntegrityError
from django.contrib.auth.decorators import login_required
from django.utils.http import urlencode
from django.contrib import messages
from django.views.decorators.http import require_POST
from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models.query import Prefetch
from django.views.decorators.csrf import csrf_exempt

import hmac
import hashlib
import datetime
from requests.exceptions import ConnectionError
from json.decoder import JSONDecodeError

from instamojo_wrapper import Instamojo

from .models import LodgingTransaction
from .forms import LodgingTransactionForm
from apps.lodging.models import Lodging, CommonlyUsedLodgingModel, ImageModel
from apps.user.utils import ViewException
from .utils import send_message, successfull_transaction_message, lodging_booked_message
from apps.lodging.utils import generate_random

api = Instamojo(api_key=settings.INSTAMOJO_API_KEY,
        auth_token=settings.INSTAMOJO_AUTH_KEY,
        endpoint=settings.INSTAMOJO_ENDPOINT)

@login_required
@require_POST
def redirect_to_instamojo_view(request,ad_id):
  if settings.DEBUG:
    base_url = 'http://'+request.META['HTTP_HOST']
  else:
    base_url = settings.BASE_URL
  try:
    if request.POST.get('termsandconditions','false')=='false':
      raise ValidationError('You have not agreed to terms and conditions')
    lodging = Lodging.objects.prefetch_related('sublodging').get(id=ad_id)
    sublodging = lodging.sublodging
    time_diff = datetime.datetime.now() - sublodging.last_time_booking
    if sublodging.is_booking and time_diff.seconds > 3*60:
      sublodging.is_booking=False
      sublodging.save()
    if sublodging.is_booked or sublodging.is_booking:
      return JsonResponse({
        'errors':{
          '__all__':['This property is already booked or in process of booking.']
        }
      },status=400)
    amount = int(sublodging.rent)//10
    trans_id = generate_random(40)
    while LodgingTransaction.objects.filter(trans_id=trans_id).exists():
      trans_id = generate_random(40)
    transaction_ = LodgingTransaction.objects.create(
      amount = amount,
      user = request.user,
      lodging = lodging,
      trans_id = trans_id
    )
    if settings.DEBUG:
      response = api.payment_request_create(
        amount=amount,
        purpose=transaction_.id,
        buyer_name=request.user.full_name(),
        send_sms=True,
        phone=request.user.mobile_number,
        # send_email=True,
        # email=request.user.email,
        allow_repeated_payments=False,
        redirect_url=base_url+reverse('transactions:lodging-post-redirection'),
        webhook=base_url+reverse('transactions:lodging-webhook',
          kwargs={'trans_id':str(transaction_.id)})
      )
    else:
      response = api.payment_request_create(
        amount=amount,
        purpose=transaction_.id,
        buyer_name=request.user.first_name,
        send_sms=True,
        phone=request.user.mobile_number,
        allow_repeated_payments=False,
        redirect_url=base_url+reverse('transactions:lodging-post-redirection'),
        # webhook=base_url+reverse('transactions:lodging-webhook',
        #   kwargs={'trans_id':str(transaction_.id)})  
      )
    if response['success']:
      sublodging.is_booking = True
      sublodging.save()
      transaction_.payment_request_id = response['payment_request']['id']
      transaction_.save()
      return JsonResponse({
        'url': response['payment_request']['longurl']+'?embed=form',
        'status': 200
      })
    return JsonResponse({
      'errors':{'__all__':['Failed to process request']}.update(response['message'])
    },status=400)
  except Lodging.DoesNotExist:
    return JsonResponse({
      'errors':{'__all__':['Lodging with id '+ad_id+' does not exist.']}
    },status=400)
  except ValidationError as e:
    return JsonResponse({'errors':{'__all__':e.messages}},status="400")
  except ConnectionError as e:
    return JsonResponse({
      'errors':{'__all__':['Connection could not be made. Please try again later.']}
    },status=400)
  except JSONDecodeError as e:
    return JsonResponse({
      'errors':{'__all__':['Payment gateway server is not responding. Contact about this issue.']}
    },status=400)


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
    sublodging.is_booked=False
    sublodging.is_booking=False
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
    return HttpResponseRedirect('/')
  return render(request,'transactions/success.html',{'region':region,
    'lodging':lodging,'transaction':transaction_,'sublodging':sublodging,
    'success': transaction_success})

# @login_required
# def confirm_order_view(request,state,state_id,district,district_id,ad_id):
#     try:
#         lodging = Lodging.objects.prefetch_related(Prefetch(
#             'sublodging',queryset=CommonlyUsedLodgingModel.objects.prefetch_related('images'))
#         ).get(id=ad_id)
#         sublodging = lodging.sublodging
#         sublodging.image = sublodging.images.all()[0]
#         return render(request,'transactions/confirm_order.html',{
#             'amount':sublodging.rent//10,
#             'state': state,
#             'state_id': state_id,
#             'district': district,
#             'district_id': district_id,
#             'ad_id': ad_id,
#             'slug': sublodging.slug,
#             'ad': sublodging,
#             'lodging': lodging
#         })
#     except Lodging.DoesNotExist:
#         messages.error(request,'Lodging does not exist')
#         return HttpResponse(reverse('ads:list',kwargs={'state': state,'district': district}))

@csrf_exempt
def lodging_webhook_view(request,trans_id):
  if request.method=='POST':
    purpose = request.POST.get('purpose')
    mac_provided = request.POST.get('mac')
    message = "|".join(v for k, v in sorted(request.POST.items(), key=lambda x: x[0].lower()))
    mac_calculated = hmac.new(settings.INSTAMOJO_SALT, message.encode('utf-8'), hashlib.sha1).hexdigest
    if mac_provided == mac_calculated:
      sublodging.is_booked=False
      try:
        transaction_ = LodgingTransaction.objects.prefetch_related('user',
          Prefetch(
            'lodging',
            queryset=Lodging.objects.prefetch_related(
              Prefetch(
                'sublodging',
                queryset=CommonlyUsedLodgingModel.objects.prefetch_related('region')
              )
            )
          )
        ).get(id=purpose)
      except LodgingTransaction.DoesNotExist:
        return HttpResponse('ok',status=200)
      if trans_id==transaction_.trans_id:
        return HttpResponse('ok',status=200)
      status = request.POST.get('status')
      if not transaction_.payment_id:
        transaction_.payment_id=request.POST.get('payment_id')
        lodging = transaction_.lodging
        sublodging = lodging.sublodging
        region = sublodging.region
        if status=='Credit':
          transaction_.amount_paid=float(request.POST.get('amount'))
          transaction_.payment_gateway_fees=request.POST.get('fees')
          transaction_.status=LodgingTransaction.FAIL
          if float(request.POST.get('amount'))==float(transaction_.amount):
            transaction_.status=LodgingTransaction.SUCCESS
            sublodging.is_booked=True
        sublodging.is_booking=False
        with transaction.atomic():
          sublodging.save()
          transaction_.save()
  return HttpResponse('ok',status=200)
