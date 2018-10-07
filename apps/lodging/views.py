from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.http import JsonResponse, HttpResponse
from django.db import transaction
from django.core.exceptions import ValidationError

from .forms import LodgingCreateForm, CommonlyUsedLodgingCreateForm, ChargeForm
from .models import TermAndCondition
from apps.user.utils import ViewException, number_verfication_required
from apps.image.models import ImageModel
from apps.user.utils import maintain_cookie

import json

@login_required
@number_verfication_required
@require_POST
def lodging_create_view_ajax(request):
  try:
    data = request.POST
    form = LodgingCreateForm(data)
    sub_form = CommonlyUsedLodgingCreateForm(request,data)
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
        for other_charge in json.loads(data.get('other_charges')):
          charge_form = ChargeForm(other_charge)
          if charge_form.is_valid():
            charge_form.save(sublodging)
          else:
            raise ValidationError('Error in other charges')
        for term_and_condition in json.loads(data.get('terms_and_conditions')):
          if len(term_and_condition)>0:
            TermAndCondition.objects.create(text=term_and_condition,lodging=sublodging)
      return JsonResponse({'success': True})
  except ValidationError as e:
    form.add_error(None,e)
  return JsonResponse({'errors':{**form.errors,**sub_form.errors}},status=400)
