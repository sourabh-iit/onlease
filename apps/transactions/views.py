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
        purpose=trans_id,
        buyer_name=request.user.full_name(),
        send_sms=True,
        phone=request.user.mobile_number,
        # send_email=True,
        # email=request.user.email,
        allow_repeated_payments=False,
        redirect_url=base_url+reverse('transactions:lodging-post-redirection'),
        webhook=base_url+reverse('transactions:lodging-webhook',
          kwargs={'trans_id':trans_id})
      )
    else:
      response = api.payment_request_create(
        amount=amount,
        purpose=trans_id,
        buyer_name=request.user.first_name,
        send_sms=True,
        phone=request.user.mobile_number,
        allow_repeated_payments=False,
        redirect_url=base_url+reverse('transactions:lodging-post-redirection'),
        # webhook=base_url+reverse('transactions:lodging-webhook',
        #   kwargs={'trans_id':trans_id})  
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
      'errors':{**response['message']}
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
      'errors':{'__all__':['Payment gateway server is not responding. Contact us about this issue exists.']}
    },status=400)


def on_transaction(trans_id,response,webhook,request):
  transaction_success = False
  transaction_ = LodgingTransaction.objects.prefetch_related('user',
    Prefetch('lodging',queryset=Lodging.objects.prefetch_related('posted_by',
      Prefetch('sublodging',queryset=CommonlyUsedLodgingModel.objects.prefetch_related('region'))
      )
    )
  ).get(trans_id=trans_id)
  lodging = transaction_.lodging
  sublodging = lodging.sublodging
  region = sublodging.region
  if not transaction_.payment_id:
    transaction_.payment_id=response['payment_id']
    sublodging.is_booked=False
    sublodging.is_booking=False
    if response['status']=='CREDIT':
      if float(response['amount'])==float(transaction_.amount):
        transaction_success = True
        transaction_.amount_paid=float(response['amount'])
        transaction_.payment_gateway_fees=responsex['fees']
        transaction_.status=LodgingTransaction.SUCCESS
        sublodging.is_booked=True
        lodging.purchased_by.add(request.user)
        messages.success(request,'Your transaction was successful')
        # Notify owner about property being booked and tenant contact numbers
        send_message(lodging.posted_by.mobile_number,
          lodging_booked_message(lodging.posted_by,request.user,
          lodging,transaction_))
        # Notify user about transaction id and owner contact numbers
        send_message(request.user.mobile_number,
          successfull_transaction_message(
            lodging.posted_by,request.user,
            lodging,transaction_))
      else:
        messages.error(request,'An invalid amount was paid')
        send_message(request.user.mobile_number,
          invalid_transaction_message(
            lodging.posted_by,request.user,
            lodging,transaction_))
    else:
      messages.error(request,'Transaction was failed')
      send_message(request.user.mobile_number,
        failed_transaction_message(
          lodging.posted_by,request.user,
          lodging,transaction_,response))
    with transaction.atomic():
      sublodging.save()
      transaction_.save()
      lodging.save()
  return transaction_success, lodging, sublodging, region, transaction_


@login_required
def lodging_post_redirection_view(request):
  try:
    payment_id = request.GET.get('payment_id')
    payment_request_id = request.GET.get('payment_request_id')
    response = api.payment_request_payment_status(payment_request_id,payment_id)
    trans_id = response['payment_request']['purpose']
    transaction_success, lodging, sublodging, region, transaction_ = on_transaction(trans_id,response['payment_request']['payment'],False,request)
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
      on_transaction(purpose,request.POST,True,request)
  return HttpResponse('ok',status=200)
