from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.http import JsonResponse, HttpResponse
from django.db import transaction
from django.core.exceptions import ValidationError

from .forms import LodgingCreateForm, CommonlyUsedLodgingCreateForm
from apps.user.utils import ViewException, number_verfication_required
from apps.image.models import ImageModel
from apps.user.utils import maintain_cookie


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
          image = ImageModel.objects.get(id=image_id)
          image.content_object = sublodging
          image.save()
      return HttpResponse(status=200)
  except ValidationError as e:
    form.add_error(None,e)
  return JsonResponse({'errors':{**form.errors,**sub_form.errors}},status=400)



# @maintain_cookie
# @login_required
# @number_verfication_required
# def lodging_create_view(request):
#     if request.method=='POST':
#         data = request.POST
#         if 'id' in data:
#             lodging = Lodging.objects.select_related('sublodging').get(id=data['id'])
#             form = LodgingCreateForm(request,data,instance=lodging)
#             sub_form = CommonlyUsedLodgingCreateForm(request,data,instance=lodging.sublodging)
#         else:
#             form = LodgingCreateForm(request,data)
#             sub_form = CommonlyUsedLodgingCreateForm(request,data)
#         if sub_form.is_valid() and form.is_valid():
#             sublodging = sub_form.save(commit=False)
#             lodging = form.save(commit=False)
#             lodging.posted_by = request.user
#             with transaction.atomic():
#                 lodging.save()
#                 sublodging.lodging = lodging
#                 sublodging.save()
#             messages.success(request,"Lodging created successfully")
#             return HttpResponseRedirect(reverse('ads:list',kwargs={
#                 'state_id':sublodging.region.state.id,
#                 'state':sublodging.region.state.name,
#                 'district_id':sub_form.cleaned_data['district'].id,
#                 'district':sublodging.region.district.name
#             }))
#         else:
#             messages.error(request,'Error occurred while processing input')
#     else:
#         try:
#             lodging = Lodging.objects.prefetch_related(Prefetch(
#                 'sublodging',queryset=CommonlyUsedLodgingModel.objects.select_related('images')
#             )).get(Q(posted_by=request.user)|Q(session_key=request.session.session_key),
#             sublodging__temporary=True)
#         except Lodging.DoesNotExist:
#             lodging = None
#         if lodging:
#             form = LodgingCreateForm(request,instance=lodging)
#             sub_form = CommonlyUsedLodgingCreateForm(request,instance=lodging.sublodging)
#         else:
#             form = LodgingCreateForm(request)
#             sub_form = CommonlyUsedLodgingCreateForm(request)
#     return render(request,'lodging/create_lodging.html',{'form': form,
#         'sub_form': sub_form})


# @maintain_cookie
# @login_required
# @number_verfication_required
# def lodging_edit_view(request,ad_id):
#     uploaded=False
#     try:
#         lodging=Lodging.objects.prefetch_related(
#             Prefetch(
#                 'sublodging',
#                 queryset=CommonlyUsedLodgingModel.objects.prefetch_related('images')
#             ),
#             'posted_by'
#         ).get(id=ad_id)
#         if lodging.posted_by!=request.user:
#             messages.error('You are not authorized to access it')
#             return HttpResponseRedirect(reverse('home:front-page'))
#         sublodging = lodging.sublodging
#         images = sublodging.images.all()
#     except Lodging.DoesNotExist:
#         messages.error('Bad request')
#         return HttpResponseRedirect(reverse('dashboard:home'))
#     sublodging_form = CommonlyUsedLodgingUpdateForm(None,instance=sublodging)
#     if request.method=='POST':
#         if 'delete' in request.POST:
#             with transaction.atomic():
#                 images.delete()
#                 lodging.delete()
#             messages.success(request,"Lodging deleted successfully")
#             return HttpResponseRedirect(reverse('dashboard:home'))
#         elif 'update' in request.POST:
#             sublodging_form = CommonlyUsedLodgingUpdateForm(images,request.POST,
#             instance=sublodging)
#             if sublodging_form.is_valid():
#                 with transaction.atomic():
#                     sublodging_form.save()
#                     for image_id in request.POST.getlist('delete_images'):
#                         for image in images:
#                             if image.id==int(image_id):
#                                 image.delete()
#                     for image_id in request.POST.getlist('images'):
#                         image = ImageModel.objects.get(id=image_id)
#                         image.sublodging = sublodging
#                         image.save()
#                 messages.success(request,'Lodging updated successfully')
#                 return HttpResponseRedirect(reverse('lodging:edit',kwargs={
#                     'ad_id':ad_id
#                 }))
#             else:
#                 messages.error(request,'Error occurred while processing input')
#     return render(request,'lodging/edit_lodging.html',
#         {'sublodging_form': sublodging_form,'images':images})
