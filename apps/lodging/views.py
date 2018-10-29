from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.http import JsonResponse, HttpResponse
from django.db import transaction
from django.core.exceptions import ValidationError
from django.views import View
from django.utils.decorators import method_decorator
from django.http.request import QueryDict

from .forms import LodgingCreateForm, CommonlyUsedLodgingCreateForm, ChargeForm
from .models import TermAndCondition, Lodging, Charge
from apps.user.utils import ViewException, number_verfication_required
from apps.image.models import ImageModel
from apps.user.utils import maintain_cookie
from .serializers import CommonLodgingSerializer

import json
import requests
from urllib.parse import urlparse


@method_decorator([login_required,number_verfication_required],name='dispatch')
class LodgingView(View):
  form_class = LodgingCreateForm
  sub_form_class = CommonlyUsedLodgingCreateForm

  def post(self,request):
    data = request.POST
    form = self.form_class(data)
    sub_form = self.sub_form_class(request,data)
    try:
      sublodging = self.save_lodging(form,sub_form,request,data)
      return JsonResponse({'success': True,'ad':CommonLodgingSerializer(sublodging).data})
    except ValidationError as e:
      form.add_error(None,e)
    return JsonResponse({'errors':{**form.errors,**sub_form.errors}},status=400)

  def put(self,request,ad_id):
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
      sublodging = self.save_lodging(form,sub_form,request,data)
      return JsonResponse({'success': True,'ad':CommonLodgingSerializer(sublodging).data})
    except ValidationError as e:
      form.add_error(None,e)
    return JsonResponse({'errors':{**form.errors,**sub_form.errors}},status=400)

  def delete(self, request, ad_id):
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
        return sublodging

def verify_tour_link(request):
  tour_link = request.GET.get('virtual_tour_link')
  try:
    res = requests.get(tour_link)
    if res.status_code==200 and 'kuula' in urlparse(tour_link)[1].split('.'):
      return HttpResponse('true')
  except:
    pass
  return HttpResponse('false')