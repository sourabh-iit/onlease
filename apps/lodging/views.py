from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.http import JsonResponse, HttpResponse
from django.db import transaction
from django.core.exceptions import ValidationError
from django.views import View
from django.utils.decorators import method_decorator
from django.http.request import QueryDict
from django.conf import settings
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .forms import LodgingCreateForm, CommonlyUsedLodgingCreateForm, ChargeForm
from .models import TermAndCondition, Lodging, Charge, CommonlyUsedLodgingModel
from apps.user.utils import ViewException, number_verfication_required
from apps.image.models import ImageModel
from apps.user.utils import maintain_cookie
from .serializers import CommonLodgingSerializer
from apps.user.utils import ajax_login_required
from apps.user.serializers import UserSerializer
from apps.lodging.utils import get_room_reference

import json
import requests
from urllib.parse import urlparse
from datetime import datetime

from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse, Gather
from twilio.base.exceptions import TwilioRestException


@method_decorator([ajax_login_required,number_verfication_required],name='dispatch')
class LodgingView(View):
  form_class = LodgingCreateForm
  sub_form_class = CommonlyUsedLodgingCreateForm

  def post(self,request, ad_id=None, action=None):
    data = request.POST
    if action is not None:
      try:
          prop = CommonlyUsedLodgingModel.objects.get(id=ad_id)
      except CommonlyUsedLodgingModel.DoesNotExist:
          return JsonResponse({'errors':{'__all__':['Property does not exist']}})
      if action=='add_to_favorites':
          request.user.favorite_properties.add(prop)
      elif action=='remove_from_favorites':
          request.user.favorite_properties.remove(prop)
      else:
          return JsonResponse({'errors':{'__all__':['Unrecognized action']}})
      return JsonResponse(UserSerializer(request.user).data)
    form = self.form_class(data)
    sub_form = self.sub_form_class(request,data)
    try:
      total_images = 0
      for image_id in data.getlist('images'):
        try:
          image = ImageModel.objects.get(id=image_id)
        except ImageModel.DoesNotExist:
          continue
        if image.content_object is None:
          total_images+=1
      if total_images<2:
        raise ValidationError('Atleast two images are required')
      errors, sublodging = self.save_lodging(form,sub_form,request,data)
      if errors:
        return JsonResponse({'success':False, 'errors': errors},status=400)
      return JsonResponse({'success': True,'ad':CommonLodgingSerializer(sublodging).data})
    except ValidationError as e:
      form.add_error(None,e)
    return JsonResponse({'errors':{**form.errors,**sub_form.errors}},status=400)

  def put(self,request,ad_id, action=None):
    data=QueryDict(request.body)
    try:
      ad = Lodging.objects.get(id=ad_id)
    except Lodging.DoesNotExist:
      return JsonResponse({'errors':{'__all__':['Property does not exist']}},404)
    try:
      if request.user!=ad.posted_by:
        raise ValidationError('You are not authorized to perform this action')
      form = self.form_class(data,instance=ad)
      sub_form = self.sub_form_class(request,data,instance=ad.sublodging)
      errors, sublodging = self.save_lodging(form,sub_form,request,data)
      if errors:
        return JsonResponse({'success':False, 'errors': errors},status=400)
      return JsonResponse({'success': True,'ad':CommonLodgingSerializer(sublodging).data})
    except ValidationError as e:
      form.add_error(None,e)
    return JsonResponse({'errors':{**form.errors,**sub_form.errors}},status=400)

  def delete(self, request, ad_id, action=None):
    data = QueryDict(request.body)
    try:
      ad = Lodging.objects.get(id=ad_id)
      ad.delete()
      return JsonResponse({'success':True})
    except Lodging.DoesNotExist:
      return JsonResponse({'errors':{'__all__':['Property does not exist']}},404)


  def save_lodging(self,form,sub_form,request,data):
    if form.is_valid() and sub_form.is_valid():
      lodging = form.save(commit=False)
      lodging.posted_by=request.user
      with transaction.atomic():
        lodging.save()
        sublodging = sub_form.save(commit=False)
        sublodging.lodging = lodging
        sublodging.save()
        for image_id in data.getlist('images'):
          try:
            image = ImageModel.objects.get(id=image_id)
          except ImageModel.DoesNotExist:
            continue
          if image.content_object is not None:
            continue
          image.content_object = sublodging
          image.save()
        sublodging.charges.all().delete()
        for other_charge in json.loads(data.get('other_charges','[]')):
          charge_form = ChargeForm(other_charge)
          if charge_form.is_valid():
            charge_form.save(sublodging)
          else:
            raise ValidationError('Error in other charges')
        sublodging.termsandconditions.all().delete()
        for term_and_condition in json.loads(data.get('terms_and_conditions','[]')):
          TermAndCondition.objects.create(text=term_and_condition,lodging=sublodging)
        sublodging.is_confirmed=True
        sublodging.last_confirmed=datetime.now()
      return None, sublodging
    else:
      return {**form.errors,**sub_form.errors}, None

def verify_tour_link(request):
  tour_link = request.GET.get('virtual_tour_link')
  try:
    res = requests.get(tour_link)
    if res.status_code==200 and 'kuula' in urlparse(tour_link)[1].split('.'):
      return HttpResponse('true')
  except:
    pass
  return HttpResponse('false')

@ajax_login_required
@csrf_exempt
@require_POST
def confirm_vaccancy(request, lodging_id):
  if datetime.now().hour<8 or datetime.now().hour>22:
    return JsonResponse({'errors': {'__all__':['Can only request from 8:00 A.M. to 10:00 P.M.']}}, status=400)
  lodging = Lodging.objects.prefetch_related('sublodging').get(id=lodging_id)
  sublodging = lodging.sublodging
  try:
    client=Client(settings.TWILIO_SID,settings.TWILIO_TOKEN)
    call=client.calls.create(
      method='GET',
      status_callback=settings.BASE_URL+reverse('lodging_ajax:complete-response', args=[lodging.id, request.user.mobile_number]),
      status_callback_method='POST',
      to='+91'+lodging.posted_by.mobile_number,
      from_=settings.TWILIO_PHONE_NUMBER,
      url=settings.BASE_URL+reverse('lodging_ajax:voice-response', args=[lodging.id])
    )
  except TwilioRestException as e:
    return JsonResponse({'errors': {'__all__': [e.msg]}}, status=400)
  # confirm again after gap of 1 day
  if sublodging.is_confirmed and sublodging.last_confirmed and (datetime.now()-sublodging.last_confirmed).days<1:
    return JsonResponse({'errors': {'__all__': ['It was confirmed recently']}}, status=400)
  sublodging.last_confirmed = datetime.now()
  sublodging.is_confirmed = False
  sublodging.is_confirmation_processing = True
  sublodging.save()
  return JsonResponse(CommonLodgingSerializer(sublodging).data)

@csrf_exempt
def voice_response(request, lodging_id):
  resp = VoiceResponse()
  gather = Gather(
    numDigits=1,
    action=settings.BASE_URL+reverse('lodging_ajax:gather-response', args=[lodging_id]),
    timeout=10
  )
  lodging  = Lodging.objects.prefetch_related('sublodging').get(id=lodging_id)
  sublodging = lodging.sublodging
  text="यह कॉल ऑनलीज डॉट इन वेबसाइट की तरफ से किया गया है! आपका " + get_room_reference(lodging, sublodging) +\
     'अगर खाली है तो १ दबाए अन्यथा २ दबाए! दोबारा दोहराने के लिए ० दबाये!'
  resp.say(text)
  resp.append(gather)
  resp.say('हमें कोई इनपुट नहीं मिला। अलविदा!')
  return HttpResponse(str(resp))

@csrf_exempt
def gather_response(request, lodging_id):
  resp = VoiceResponse()
  lodging = Lodging.objects.prefetch_related('sublodging').get(id=lodging_id)
  sublodging = lodging.sublodging
  if 'Digits' in request.POST:
    choice = request.POST['Digits']
    if choice=='1':
      resp.say('आपने चयन किया है कि आपका कमरा खाली है! धन्यवाद!')
      sublodging.is_booked = False
      sublodging.is_confirmed = True
      sublodging.save()
    elif choice=='2':
      resp.say('आपने चयन किया है कि आपका कमरा खाली नहीं है! धन्यवाद!')
      sublodging.is_booked = True
      sublodging.is_confirmed = True
      sublodging.save()
    elif choice=='0':
      resp.redirect(reverse('lodging_ajax:voice-response', args=[lodging_id]))
  return HttpResponse(str(resp))

@csrf_exempt
def complete_response(request, lodging_id, mobile_number):
  lodging = Lodging.objects.prefetch_related('sublodging').get(id=lodging_id)
  sublodging = lodging.sublodging
  sublodging.is_confirmation_processing = False
  sublodging.save()
  try:
    client=Client(settings.TWILIO_SID,settings.TWILIO_TOKEN)
    call=client.calls.create(
      method='GET',
      to='+91'+mobile_number,
      from_=settings.TWILIO_PHONE_NUMBER,
      url=settings.BASE_URL+reverse('lodging_ajax:customer-voice-response', args=[lodging.id])
    )
  except TwilioRestException as e:
    print(e.msg)
  return HttpResponse('success')

@csrf_exempt
def customer_voice_response(request, lodging_id):
  lodging = Lodging.objects.prefetch_related('sublodging').get(id=lodging_id)
  sublodging = lodging.sublodging
  resp = VoiceResponse()
  text = 'यह कॉल ऑनलीज डॉट इन वेबसाइट पर आपके द्वारा की गयी इन्क्वारी के सन्दर्भ में किया गया है!'+get_room_reference(lodging, sublodging)
  if not sublodging.is_confirmed:
    text += 'उनके मकान मालिक से कोई जवाब प्राप्त नहीं हो पाया है! कुछ देर बाद दोबारा कोशिश करें! धन्यवाद्!'
  elif sublodging.is_booked:
    text += 'अभी खली नहीं है! धन्यवाद्!'
  else:
    text += ('अभी खली है! कृपया जल्द से जल्द इसे बुक कर लें! धन्यवाद्!')
  resp.say(text)
  return HttpResponse(str(resp))
