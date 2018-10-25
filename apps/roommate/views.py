from django.db import transaction
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user
from django.views.decorators.http import require_POST
from django.http import JsonResponse, HttpResponse

from .forms import RoomieAdForm
from .models import RoomieAd
from apps.image.models import ImageModel
from apps.user.utils import number_verfication_required


@require_POST
@login_required
@number_verfication_required
def roomie_ad_create_view(request):
    form = RoomieAdForm(request.POST)
    if form.is_valid():
        roomie_ad = form.save(commit=False)
        roomie_ad.sender = request.user
        with transaction.atomic():
            roomie_ad.save()
            for image_id in request.POST.getlist('image_ids[]'):
                image = ImageModel.objects.get(id=image_id)
                image.content_object = roomie_ad
                image.save()
        images = roomie_ad.images.all()
        return HttpResponse(status=200)
    return JsonResponse({'errors':form.errors},status=400)
