from datetime import datetime
from django.conf import settings
from apps.lodging.models import Lodging
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.db import transaction

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, PermissionDenied

import math
import hmac
import hashlib
import json
from threading import Timer
import logging

from instamojo_wrapper import Instamojo

from sentry_sdk import capture_message

from .serializers import TransactionSerializer
from .models import LodgingTransaction
from apps.lodging.models import Lodging
from .utils import *
from apps.lodging.utils import generate_random
from apps.utils import send_message

api = Instamojo(api_key=settings.INSTAMOJO_API_KEY,
        auth_token=settings.INSTAMOJO_AUTH_KEY,
        endpoint=settings.INSTAMOJO_ENDPOINT)

timer_jobs = {}

logger = logging.getLogger('onlease-logger')

class RefundHandler(APIView):
  def post(self, request, trans_id):
    data = request.data
    if 'reason' not in data or len(data['reason']) == 0:
      raise ValidationError("reason is required")
    try:
      trans = LodgingTransaction.objects.get(id=trans_id)
    except LodgingTransaction.DoesNotExist:
      raise ValidationError("invalid trans_id")
    trans.reason = data['reason']
    trans.save()
    refund_amount(trans.payment_id, "TAN", data['reason'])
    return Response('success')

class TransactionHandler(APIView):
  permission_classes = (IsAuthenticated, )

  @staticmethod
  def on_transaction_complete(lodging_id):
    try:
      lodging = Lodging.objects.get(id=lodging_id)
      lodging.is_booking = False
      lodging.save()
    except Lodging.DoesNotExist:
      pass
    finally:
      del timer_jobs[lodging_id]

  @staticmethod
  def generate_random_transaction_id():
    trans_id = generate_random(40)
    while LodgingTransaction.objects.filter(trans_id=trans_id).exists():
      trans_id = generate_random(40)
    return trans_id

  def get(self, request, trans_id):
    try:
      trans = LodgingTransaction.objects.get(trans_id=trans_id)
    except LodgingTransaction.DoesNotExist:
      raise ValidationError("Transaction does not exist")
    if trans.user != request.user:
      raise PermissionDenied()
    return Response(TransactionSerializer(trans).data)

  def post(self, request, lodging_id, action):
    data = request.data
    if action == 'create':
      gateway = settings.PAYMENT_GATEWAY
      if settings.DEBUG:
        base_url = 'http://'+request.META['HTTP_HOST']
      else:
        base_url = settings.BASE_URL
      try:
        lodging = Lodging.objects.get(id=lodging_id)
        # if not lodging.last_confirmed or lodging.last_confirmed.timestamp() - time.time() > 24*60*60:
        #   raise ValidationError('Latest confirmation for vaccancy is not done')
        if lodging.is_booked or lodging.isHidden or lodging.is_booking:
          raise ValidationError('It is already booked.')
        if lodging.is_booking:
          if (lodging.updated_at - datetime.now()).seconds > 600:
            lodging.is_booking = False
            lodging.save()
          else:
            raise ValidationError('It is already booked.')
        trans_id = TransactionHandler.generate_random_transaction_id()
        trans = LodgingTransaction.objects.create(
          user = request.user,
          lodging = lodging,
          trans_id = trans_id,
          payment_gateway = gateway
        )
        payment_request_data = {
          "amount": lodging.booking_amount,
          "purpose": trans_id,
          "email": request.user.email,
          "phone": f"+91{request.user.mobile_number}",
          "buyer_name": request.user.full_name,
          "allow_repeated_payments": False,
          "redirect_url": base_url+reverse('transactions:lodging-booking'),
          "webhook": base_url+reverse('transactions-api:lodging-actions', args=[lodging.id, "webhook"])
        }
        logger.info(payment_request_data)
        if gateway == LodgingTransaction.INSTAMOJO:
          response = api.payment_request_create(**payment_request_data)
        else:
          raise ValidationError("invalid gateway")
        if response['success']:
          lodging.is_booking = True
          lodging.save()
          timer_jobs[lodging_id] = Timer(3*60, TransactionHandler.on_transaction_complete, args=[lodging_id])
          timer_jobs[lodging_id].start()
          trans.payment_request_id = response['payment_request']['id']
          trans.save()
          return Response({
            'url': response['payment_request']['longurl']+'?embed=form',
            'status': 200
          })
        else:
          logger.error(json.dumps(response))
          raise ValidationError("Got some error while processing")
      except Lodging.DoesNotExist:
        raise ValidationError('Lodging with id '+lodging_id+' does not exist.')
    elif action == 'webhook':
      if lodging_id in timer_jobs:
        timer_jobs[lodging_id].cancel()
        del timer_jobs[lodging_id]
      trans_id = data.get('purpose')
      mac_provided = data.get('mac')
      message = "|".join(v for k, v in sorted(data.items(), key=lambda x: x[0].lower()))
      mac_calculated = hmac.new(settings.INSTAMOJO_SALT, message.encode('utf-8'), hashlib.sha1).hexdigest
      if mac_provided == mac_calculated:
        try:
          trans = LodgingTransaction.objects.get(trans_id=trans_id)
        except LodgingTransaction.DoesNotExist:
          raise ValidationError("transaction does not exist")
        logger.debug("reach here")
        on_transaction(trans, data, request.user, trans.lodging)
      return Response('ok')
    raise ValidationError("invalid action")


def on_transaction(trans, response, user, lodging):
  if not trans.payment_id:
    trans.payment_id = response['payment_id']
    trans.status = LodgingTransaction.FAIL
    transaction_success = False
    owner = None
    if response['status'] == 'Credit':
      amount_paid = int(float(response['amount']))
      if amount_paid == math.ceil(lodging.rent * (settings.BROKERAGE_PERCENT/100)):
        trans.amount = amount_paid
        trans.payment_gateway_fees = response['fees']
        trans.status = LodgingTransaction.SUCCESS
        lodging.bookedBy = user
        lodging.is_booked = True
        owner = lodging.posted_by
        transaction_success = True
      else:
        trans.status = LodgingTransaction.PENDING
        trans.reason = "partial payment done"
    with transaction.atomic():
      trans.save()
      lodging.save()
    # if transaction_success:
    #   msg = lodging_booked_message(owner, user)
    #   send_message(msg, owner.mobile_number)
    #   msg = successfull_transaction_message(user, trans, lodging)
    #   send_message(msg, user.mobile_number)

def refund_amount(payment_id, type, body, attempt=1):
  logger.info(f"Refunding for payment id: {payment_id}, attempt: {attempt}")
  if attempt < 4:
    response = api.refund_create(
      payment_id=payment_id,
      type=type,
      body=body)
    if 'success' not in response or not response['success']:
      t = Timer(20**attempt, refund_amount, [payment_id, type, body, attempt+1])
      t.start()
  else:
    capture_message(f"Unable to refund for payment_id: {payment_id}", level='error')


class LodgingBookingHandler(APIView):
  permission_classes = (IsAuthenticated, )

  def get(self, request):
    data = request.query_params
    trans_id = -1
    try:
      payment_id = data.get('payment_id')
      payment_request_id = data.get('payment_request_id')
      response = api.payment_request_payment_status(payment_request_id, payment_id)
      if response['success'] == True:
        trans_id = response['payment_request']['purpose']
        trans = LodgingTransaction.objects.get(trans_id=trans_id)
        if trans.user == request.user:
          on_transaction(trans, response['payment_request']['payment'], request.user, trans.lodging)
    except LodgingTransaction.DoesNotExist:
      return HttpResponseRedirect("/")
    return HttpResponseRedirect(f"/transactions/{trans_id}")
