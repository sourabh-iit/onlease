from django.shortcuts import render
from django.conf import settings
from apps.lodging.models import Lodging
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.views.decorators.http import require_POST
from django.core.exceptions import ValidationError
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt

import hmac
import hashlib
import time
from requests.exceptions import ConnectionError
from json.decoder import JSONDecodeError

from instamojo_wrapper import Instamojo

from .models import LodgingTransaction
from apps.lodging.models import Lodging
from .utils import *
from apps.lodging.utils import generate_random

api = Instamojo(api_key=settings.INSTAMOJO_API_KEY,
        auth_token=settings.INSTAMOJO_AUTH_KEY,
        endpoint=settings.INSTAMOJO_ENDPOINT)

commission_percent = 10

# TODO: Cron job to call owner of every booked property to ask if is vaccant

@require_POST
def redirect_to_instamojo_view(request, ad_id):
  if settings.DEBUG:
    base_url = 'http://'+request.META['HTTP_HOST']
  else:
    base_url = settings.BASE_URL
  try:
    if request.POST.get('agreement', 'false') == 'false':
      raise ValidationError('Acceptance of agreement is required')
    if not (request.user.first_name and request.user.email):
        raise ValidationError('Profile not complete')
    lodging = Lodging.objects.get(id=ad_id)
    if not lodging.last_confirmed or lodging.last_confirmed-time.time() > 24*60*60:
      raise ValidationError('Confirmation for vaccancy is not done')
    time_diff = time.time() - lodging.last_time_booking
    if lodging.is_booking and time_diff > 3*60:
      lodging.is_booking = False
      lodging.save()
    else:
      raise ValidationError("Property is in process of booking")
    if lodging.is_booked:
      raise ValidationError('This property is already booked.')
    amount = (int(lodging.rent)*commission_percent)//100
    trans_id = generate_random(40)
    while LodgingTransaction.objects.filter(trans_id=trans_id).exists():
      trans_id = generate_random(40)
    trans = LodgingTransaction.objects.create(
      amount = amount,
      user = request.user,
      lodging = lodging,
      trans_id = trans_id
    )
    response = api.payment_request_create(
      amount=amount,
      purpose=trans_id,
      buyer_name=request.user.full_name(),
      send_sms=True,
      phone=request.user.mobile_number,
      send_email=True,
      email=request.user.email,
      allow_repeated_payments=False,
      redirect_url=base_url+reverse('transactions:lodging-post-redirection'),
      webhook=base_url+reverse('transactions:lodging-webhook',
        kwargs={'trans_id':trans_id})
    )
    if response['success']:
      lodging.is_booking = True
      lodging.last_time_booking = time.time()
      lodging.save()
      # TODO: add task after delay of 3 minutes to set is_booking false
      trans.payment_request_id = response['payment_request']['id']
      trans.save()
      return JsonResponse({
        'url': response['payment_request']['longurl']+'?embed=form',
        'status': 200
      })
    return JsonResponse({
      'errors': {**response['message']}
    }, status=400)
  except Lodging.DoesNotExist:
    return JsonResponse({
      'errors':{'__all__':['Lodging with id '+ad_id+' does not exist.']}
    }, status=400)
  except ValidationError as e:
    return JsonResponse({'errors':{'__all__':e.messages}}, status="400")
  except ConnectionError as e:
    return JsonResponse({
      'errors':{'__all__':['Connection could not be made. Please try again later.']}
    },status=400)
  except JSONDecodeError as e:
    return JsonResponse({
      'errors':{'__all__':['Payment gateway server is not responding. Contact us about this issue exists.']}
    },status=400)


def on_transaction(trans_id, response, webhook, request):
  trans = LodgingTransaction.objects.get(trans_id=trans_id)
  transaction_success = response['status']=='Credit' and float(response['amount'])==float(trans.amount)
  lodging = trans.lodging
  region = lodging.region
  if not trans.payment_id:
    trans.payment_id=response['payment_id']
    lodging.is_booked=False
    lodging.is_booking=False
    if response['status']=='Credit':
      if float(response['amount'])==float(trans.amount):
        transaction_success = True
        trans.amount_paid=float(response['amount'])
        trans.payment_gateway_fees=response['fees']
        trans.status=LodgingTransaction.SUCCESS
        lodging.is_booked=True
        # Notify owner about property being booked and tenant contact numbers
        msg = lodging_booked_message(lodging.posted_by,request.user,lodging,trans)
        send_message(lodging.posted_by.mobile_number, msg)
        # Notify user about transaction id and owner contact numbers
        msg = successfull_transaction_message(lodging.posted_by, request.user, lodging, trans)
        send_message(request.user.mobile_number, msg)
      else:
        # Notify tenant about transaction being invalid
        msg = invalid_transaction_message(lodging.posted_by, request.user, lodging, trans, response)
        send_message(request.user.mobile_number, msg)
    else:
      trans.status = LodgingTransaction.FAIL
      msg = failed_transaction_message(lodging.posted_by, request.user, lodging, trans)
      send_message(request.user.mobile_number, msg)
    with transaction.atomic():
      trans.save()
      lodging.save()
  return transaction_success, lodging, region, trans


@login_required
def lodging_post_redirection_view(request):
  try:
    payment_id = request.GET.get('payment_id')
    payment_request_id = request.GET.get('payment_request_id')
    response = api.payment_request_payment_status(payment_request_id,payment_id)
    trans_id = response['payment_request']['purpose']
    transaction_success, lodging, region, trans = on_transaction(trans_id,response['payment_request']['payment'],False,request)
    if request.user != trans.user:
      return HttpResponse('Invalid request')
  except LodgingTransaction.DoesNotExist:
    messages.error(request,'Invalid transaction')
    return HttpResponseRedirect('/')
  return render(request,'transactions/success.html',{'region':region,
    'lodging':lodging,'transaction':trans, 'success': transaction_success})

@csrf_exempt
def lodging_webhook_view(request,trans_id):
  if request.method=='POST':
    purpose = request.POST.get('purpose')
    mac_provided = request.POST.get('mac')
    message = "|".join(v for k, v in sorted(request.POST.items(), key=lambda x: x[0].lower()))
    mac_calculated = hmac.new(settings.INSTAMOJO_SALT, message.encode('utf-8'), hashlib.sha1).hexdigest
    if mac_provided == mac_calculated:
      on_transaction(purpose,request.POST,True,request)
  return HttpResponse('ok',status=200)
