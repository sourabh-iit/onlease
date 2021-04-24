
from django.db import transaction
from django.conf import settings
from django.db.models.lookups import Regex
from django.db.models.query_utils import Q
from django.http.response import HttpResponse
from django.urls import reverse
from django.core.paginator import Paginator
from django.core.files.uploadedfile import InMemoryUploadedFile

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from .models import Lodging, Charge, LodgingImage, LodgingVRImage
from .serializers import (
  ChargeSerializer, FullLodgingSerializer, LodgingSerializer, ImageSerializer,
  VRImageSerializer
)
from apps.utils import *
from apps.permissions import ReadOnly, IsOwnerOrReadOnly, IsAdmin, IsLodgingOwner, IsLodgingTenant

import requests
from urllib.parse import urlparse
from datetime import date, datetime, timedelta
from threading import Timer
import logging
from time import time

from twilio.twiml.voice_response import VoiceResponse, Gather
from twilio.base.exceptions import TwilioRestException
from twilio.rest import Client

# TODO: Cron job to call owner of every booked property to ask if is vaccant

num_lodgings_per_page = 20

logger = logging.getLogger('onlease-logger')

class LodgingActionView(APIView):
  permission_classes = [IsAuthenticated]

  def post(self, request, lodging_id, action):
    user = request.user
    try:
      prop = Lodging.objects.get(id=lodging_id)
    except Lodging.DoesNotExist:
      return Response("Not found", status=404)
    if action == 'add_to_favorites':
      if user.user_type == User.OWNER:
        raise ValidationError('You don\'t have permission to perform this action')
      user.favorite_properties.add(prop)
    elif action == 'remove_from_favorites':
      if user.user_type == User.OWNER:
        raise ValidationError('You don\'t have permission to perform this action')
      user.favorite_properties.remove(prop)
    elif action == 'disable' or action == 'enable':
      if user.user_type == User.TENANT:
        raise ValidationError('You don\'t have permission to perform this action')
      if prop.posted_by_id != user.mobile_number:
        raise ValidationError("Not allowed")
      prop.isHidden = True if action == 'disable' else False
      prop.save()
    else:
      raise ValidationError("Invalid action")
    return Response('success')

  def get(self, request, action):
    user = request.user
    if action == 'lodgings':
      lodgings = Lodging.objects.prefetch_related('images', 'address').filter(posted_by=user)
      return Response(FullLodgingSerializer(lodgings, many=True).data)
    if action == 'bookings':
      lodgings = user.bookings.prefetch_related('images', 'address').filter(is_booked=True)
      return Response(FullLodgingSerializer(lodgings, many=True).data)
    if action == 'favorites':
      lodgings = user.favorite_properties.prefetch_related('images', 'address').all()
      return Response(LodgingSerializer(lodgings, many=True).data)
    raise ValidationError('Invalid action')

class LodgingListView(APIView):
  def get(self, request):
    regions = request.query_params.get('regions', [])
    page_num = request.query_params.get('page', 1)
    query = (Q(is_booked=False) | Q(is_booked=True, available_from__lt=datetime.now()+timedelta(days=60))) & Q(isHidden=False)
    if len(regions) > 0:
      query &= Q(address__region__in=regions)
    lodgings = Lodging.objects.prefetch_related('posted_by', 'address', 'images', 'charges').filter(query)
    paginator = Paginator(lodgings, num_lodgings_per_page)
    page = paginator.page(page_num)
    return Response({
      'data': LodgingSerializer(page.object_list, many=True).data,
      'has_next_page': page.has_next()
    })

class LodgingView(APIView):
  permission_classes = [IsOwnerOrReadOnly, IsLodgingOwner|ReadOnly]

  def get(self, request, lodging_id, action=None):
    try:
      lodging = Lodging.objects.get(id=lodging_id)
    except Lodging.DoesNotExist:
      raise ValidationError('Lodging does not exist')
    user = request.user
    show_contact_details = self.can_show_contact_details(user, lodging)
    if show_contact_details:
      serializer = FullLodgingSerializer(lodging)
    else:
      serializer = LodgingSerializer(lodging)
    return Response(serializer.data)

  def can_show_contact_details(self, user, lodging):
    return user.is_authenticated and (lodging.posted_by == user or (lodging.is_booked and lodging.tenant == user))

  def post(self, request):
    lodging = self.save_lodging(request.data, request.user, None)
    return Response(FullLodgingSerializer(lodging).data)

  def put(self, request, lodging_id):
    try:
      lodging = Lodging.objects.get(id=lodging_id)
    except Lodging.DoesNotExist:
      raise ValidationError('Property does not exist')
    lodging = self.save_lodging(request.data, request.user, lodging)
    return Response(FullLodgingSerializer(lodging).data)

  def delete(self, request, lodging_id):
    try:
      lodging = Lodging.objects.get(id=lodging_id)
    except Lodging.DoesNotExist:
      raise ValidationError('Property does not exist')
    lodging.delete()
    return Response({'success':True})

  def save_lodging(self, data, user, lodging):
    with transaction.atomic():
      data['last_confirmed'] = datetime.now()
      serializer = LodgingSerializer(lodging, data=data, context={'user': user})
      serializer.is_valid(raise_exception=True)
      lodging = serializer.save()
      tot_images = 0
      for image_id in data.get('images', []):
        try:
          image = LodgingImage.objects.get(id=image_id)
          tot_images += 1
          image.lodging = lodging
          image.save()
        except LodgingImage.DoesNotExist:
          continue
      for image_id in data.get('vrimages', []):
        try:
          image = LodgingVRImage.objects.get(id=image_id)
          image.lodging = lodging
          image.save()
        except LodgingVRImage.DoesNotExist:
          continue
      if lodging.images.count() < 2:
        raise ValidationError('Atleast 2 images are requried')
      lodging.charges.all().delete()
      for charge in data.get('charges', []):
        serializer = ChargeSerializer(data=charge, context={'lodging': lodging})
        serializer.is_valid(raise_exception=True)
        serializer.save()
    return lodging

class LodgingChargesHandler(APIView):
  permission_classes = [IsLodgingOwner|ReadOnly]

  def get(self, request, lodging_id):
    try:
      lodging = Lodging.objects.get(id=lodging_id)
    except Lodging.DoesNotExist:
      raise ValidationError('Lodging does not exist')
    return Response({
      'charges': lodging.all_charges,
      'bookingAmount': lodging.booking_amount,
      'brokerage': settings.BROKERAGE_PERCENT,
      'advanceRent': settings.BOOKING_PERCENT
    })

class TourLink(APIView):
  permission_classes = [IsLodgingOwner]

  def post(self, request):
    tour_link = request.data.get('link')
    try:
      res = requests.get(tour_link)
      if res.status_code==200 and 'kuula' in urlparse(tour_link)[1].split('.'):
        return Response({'is_valid': True})
    except:
      pass
    return Response({'is_valid': False})

customer_numbers = {}
timer = {}

def onCallResult(lodging_id):
  logger.info(f"complete response not called for {lodging_id}")
  try:
    lodging = Lodging.objects.get(id=lodging_id)
    if lodging.is_confirming:
      lodging.is_confirming = False
      lodging.save()
  except Lodging.DoesNotExist:
    pass
  finally:
    if lodging_id in customer_numbers:
      del customer_numbers[lodging_id]
    if lodging_id in timer:
      del timer[lodging_id]

class TwilioHandler(APIView):
  def post(self, request, lodging_id, action=None):
    try:
      data = request.data
      user = request.user
      try:
        lodging = Lodging.objects.get(id=lodging_id)
      except Lodging.DoesNotExist:
        raise ValidationError('lodging not found')
      if action == 'confirm-vaccancy':
        now = datetime.now()
        if now.hour < 8 or now.hour > 22:
          raise ValidationError('Can only request between 8:00 A.M. and 10:00 P.M')
        if datetime.now() - timedelta(hours=24) < lodging.last_confirmed:
          raise ValidationError('It was confirmed recently')
        if lodging_id in customer_numbers:
          if user.mobile_number not in customer_numbers[lodging_id]:
            customer_numbers[lodging_id].append(user.mobile_number)
        else:
          customer_numbers[lodging_id] = []
          try:
            client = Client(settings.TWILIO_SID, settings.TWILIO_TOKEN)
            client.calls.create(
              method = 'GET',
              status_callback = settings.BASE_URL + reverse('lodging_apis:twilio-actions', args=[lodging_id, 'complete-response']),
              status_callback_method = 'POST',
              to = '+91'+lodging.posted_by.mobile_number,
              from_ = settings.TWILIO_PHONE_NUMBER,
              url = settings.BASE_URL+reverse('lodging_apis:twilio-actions', args=[lodging_id, 'voice-response'])
            )
            lodging.is_confirming = True
            lodging.save()
            timer[lodging_id] = Timer(3*60, onCallResult, [lodging.id])
            timer[lodging_id].start()
            customer_numbers[lodging_id].append(user.mobile_number)
          except TwilioRestException as e:
            raise ValidationError(e.msg)
        return Response({'success': True, 'message': 'We have placed the request. A message will be sent to your mobile number with booking link.'})
      if action == 'complete-response':
        if lodging_id in timer:
          timer[lodging_id].cancel()
          del timer[lodging_id]
        lodging.is_confirming = False
        lodging.save()
        if datetime.now() - timedelta(hours=24) < lodging.last_confirmed and not lodging.is_booked:
          for mobile_number in customer_numbers.get(lodging_id, []):
            link = settings.BASE_URL + reverse("lodging_apis:lodging", args=[lodging_id])
            lodging_type = Lodging.RESIDENTIAL_CHOICES[ord(lodging.lodging_type)-ord('0')][1]
            body = f"The {lodging_type} you enquired about recently is empty. Book now {link}. Hurry up! \n www.onlease.in"
            send_message(body, settings.TWILIO_PHONE_NUMBER, mobile_number)
        del customer_numbers[lodging_id]
        return Response('success')
      if action == 'gather-response':
        resp = VoiceResponse()
        if 'Digits' in data:
          choice = data['Digits']
          if choice=='1':
            resp.say('आपने चयन किया है कि आपका कमरा खाली है! धन्यवाद!', language="hi-IN")
            lodging.last_confirmed = datetime.now()
            lodging.is_booked = False
            lodging.save()
          elif choice=='2':
            resp.say('आपने चयन किया है कि आपका कमरा खाली नहीं है! धन्यवाद!', language="hi-IN")
            lodging.last_confirmed = datetime.now()
            lodging.is_booked = True
            lodging.available_from = None
            lodging.save()
          elif choice=='0':
            resp.redirect(reverse('lodging_apis:twilio-actions', args=[lodging_id, 'voice-response']))
        return HttpResponse(str(resp))
      if action == 'voice-response':
        resp = VoiceResponse()
        gather = Gather(
          numDigits=1,
          action=settings.BASE_URL+reverse('lodging_apis:twilio-actions', args=[lodging_id, 'gather-response']),
          timeout=10
        )
        text = self.lodging_text(lodging)
        resp.say(text, language="hi-IN")
        resp.append(gather)
        resp.say('हमें कोई इनपुट नहीं मिला। अलविदा!', language="hi-IN")
        return HttpResponse(str(resp))
      raise ValidationError("Invalid action")
    except KeyError:
      raise ValidationError('Insuficient data')
  
  def get(self, request, lodging_id, action=None):
    try:
      lodging = Lodging.objects.get(id=lodging_id)
    except Lodging.DoesNotExist:
      raise ValidationError('lodging not found')
    if action == 'voice-response':
      resp = VoiceResponse()
      gather = Gather(
        numDigits=1,
        action=settings.BASE_URL+reverse('lodging_apis:twilio-actions', args=[lodging_id, 'gather-response']),
        timeout=10
      )
      text1 = "यह कॉल ऑनलीज डॉट इन वेबसाइट की तरफ से है!"
      text2 = self.lodging_text(lodging)
      resp.say(text1, language="hi-IN")
      resp.say(text2, language="hi-IN")
      resp.append(gather)
      return HttpResponse(str(resp))

  @staticmethod
  def lodging_text(lodging):
    lodging_type = Lodging.LODGINGS_IN_HINDI[ord(lodging.lodging_type)]
    return f"आपका {lodging_type} जिस्की पहचान है {lodging.reference} अगर खाली है तो १ दबाए अन्यथा २ दबाए! दोबारा दोहराने के लिए ० दबाये!"

class ImageHandler(APIView):
  permission_classes = [IsOwnerOrReadOnly, IsLodgingOwner]
  
  def put(self, request, image_id):
    data = request.data
    try:
      if 'tag' not in data or data['tag'].strip() == "" or int(data['tag']) >= len(LodgingImage.LODGING_TAG_CHOICES):
        raise ValidationError("invalid tag")
      image = LodgingImage.objects.get(id=image_id)
      image.tag = data['tag']
      image.tag_other = data['tag_other']
      image.save()
      return Response(ImageSerializer(image).data)
    except LodgingImage.DoesNotExist:
      raise ValidationError("invalid image id")
    except ValueError:
      raise ValidationError("invalid tag")
  
  def delete(self, request, image_id):
    try:
      image = LodgingImage.objects.get(id=image_id)
      if image.lodging and image.lodging.images.count() < 3:
        raise ValidationError('Cannot delete image. Atleast two images are required')
      image.delete()
      return Response('success')
    except LodgingImage.DoesNotExist:
      raise ValidationError("invalid image id")

class ImageListHandler(APIView):
  permission_classes = [IsLodgingOwner]
  
  def get(self, request):
    data = request.query_params
    image_ids = data.get('ids', [])
    images = LodgingImage.objects.filter(id__in=image_ids)
    return Response(ImageSerializer(images, many=True).data)

  def post(self, request):
    data = request.data
    if 'image' not in data:
      raise ValidationError('invalid image')
    if 'tag' not in data or data['tag'].strip() == "" or int(data['tag']) >= len(LodgingImage.LODGING_TAG_CHOICES):
      raise ValidationError("invalid tag")
    if data['tag'] == 47+len(LodgingImage.LODGING_TAG_CHOICES) and data.get('tag_other', '') == '':
      raise ValidationError("invalid tag")
    file = data['image']
    if file.size > 8*1024*1024:
      raise ValidationError("Image size should not be larger than 8mb")
    if file.content_type not in ['image/png', 'image/jpg', 'image/jpeg']:
      raise ValidationError("invalid image")
    image_extension = file.name.split('.')[-1]
    rand_str = generate_random(8)
    image_name = '_'.join('_'.join(file.name.split('.')[0:-1]).split())
    img_type = file.content_type.split('/')[-1]
    file.name = f"{image_name}_{rand_str}.{image_extension}"
    image_mobile = create_thumbnail(file, mobile_image_size, f"{image_name}_mobile_{rand_str}.{image_extension}", img_type)
    thumb_file = create_thumbnail(file, thumbnail_size, f"{image_name}_thumbnail_{rand_str}.{image_extension}", img_type)
    im = LodgingImage.objects.create(
      image=file, image_thumbnail=thumb_file,
      image_mobile=image_mobile, tag=data['tag'],
      tag_other=data.get('tag_other', '')
    )
    if 'lodgingId' in data:
      im.lodging_id = data['lodgingId']
      im.save()
    return Response(ImageSerializer(im).data)

class VRImageListHandler(APIView):
  permission_classes = [IsLodgingOwner]
  
  def get(self, request):
    data = request.query_params
    image_ids = data.get('ids', [])
    images = LodgingVRImage.objects.filter(id__in=image_ids)
    return Response(VRImageSerializer(images, many=True).data)

  def post(self, request):
    data = request.data
    if 'image' not in data or not isinstance(data['image'], InMemoryUploadedFile):
      raise ValidationError('invalid image')
    file = data['image']
    if file.size > 8*1024*1024:
      raise ValidationError("Image size should not be larger than 8mb")
    if file.content_type not in ['image/png', 'image/jpg', 'image/jpeg']:
      raise ValidationError("invalid image")
    image_extension = file.name.split('.')[-1]
    rand_str = generate_random(8)
    image_name = '_'.join('_'.join(file.name.split('.')[0:-1]).split())
    img_type = file.content_type.split('/')[-1]
    file.name = f"{image_name}_{rand_str}.{image_extension}"
    thumb_file = create_thumbnail(file, thumbnail_size, f"{image_name}_thumbnail_{rand_str}.{image_extension}", img_type)
    im = LodgingVRImage.objects.create(
      image=file, image_thumbnail=thumb_file
    )
    if 'lodgingId' in data:
      im.lodging_id = data['lodgingId']
      im.save()
    return Response(VRImageSerializer(im).data)

class VRImageHandler(APIView):
  permission_classes = [IsLodgingOwner, IsOwnerOrReadOnly]
  
  def delete(self, request, image_id):
    try:
      image = LodgingVRImage.objects.get(id=image_id)
      lodging = image.lodging
      image.disabled = True
      image.save()
      return Response('success')
    except LodgingImage.DoesNotExist:
      raise ValidationError("invalid image id")
