from django.shortcuts import render
from django.conf import settings
from apps.lodging.models import Lodging
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from .models import LodgingTransaction
from django.contrib.auth.decorators import login_required
from instamojo_wrapper import Instamojo
from django.utils.http import urlencode
from .forms import LodgingTransactionForm
import hmac
import hashlib

api = Instamojo(api_key=settings.INSTAMOJO_API_KEY,
        auth_token=settings.INSTAMOJO_AUTH_KEY,
        endpoint=settings.INSTAMOJO_ENDPOINT)

@login_required
def lodging_transaction_view(request):
    if request.method=='POST':
        import pdb ; pdb.set_trace()
        form = LodgingTransactionForm(request.POST)
        if form .is_valid():
            ad_id = str(request.POST['ad_id'])
            lodging = Lodging.objects.get(id=ad_id)
            transaction = LodgingTransaction.objects.create(
                amount = 50,
                user = request.user,
                lodging = lodging
            )
            response = api.payment_request_create(
                amount=50,
                purpose=transaction.id,
                send_sms=True,
                phone=request.user.mobile_number,
                send_email=True,
                email=request.user.email,
                allow_repeated_payments=False,
                redirect_url=reverse('transactions:lodging-redirection'),
                webhook=reverse('transactions:lodging-webhook')
            )
            if response['success']:
                transaction.payment_request_id = response['payment_request']['id']
                transaction.save()
                return HttpResponseRedirect(request,
                    response['payment_request']['longurl']+'?embed=form')
            form.add_error(response['message'])
    else:
        if not request.GET.get('ad_id'):
            return HttpResponseRedirect(reverse('ads:choose-location'))
        initial = {'ad_id': request.GET['ad_id']}
        form = LodgingTransactionForm(initial=initial)
    return render(request,'transactions/lodging_request.html',{'form':form})

def lodging_redirection_view(request):
    if request.method=='GET':
        payment_id = request.GET.get('payment_id')
        payment_request_id = request.GET.get('payment_request_id')
        response = api.payment_request_payment_status(payment_request_id,payment_id)
        import pdb ; pdb.set_trace()

def lodging_webhook_view(request):
    if request.method=='POST':
        mac_provided = request.POST.pop('mac')
        message = "|".join(v for k, v in sorted(request.POST.items(), key=lambda x: x[0].lower()))
        mac_calculated = hmac.new(settings.INSTAMOJO_SALT, message, hashlib.sha1).hexdigest
        if mac_provided == mac_calculated:
            purpose = request.POST.get('purpose')
            try:
                transaction = LodgingTransaction.objects.get(purpose=purpose)
            except LodgingTransaction.DoesNotExist:
                return HttpResponse(request)
            if transaction.payment_id==request.POST.get('payment_id') and transaction.payment_request_id==request.POST.get('payment_request_id') and transaction.amount==request.POST.get('amount'):
                status = request.POST.get('status')
                if status=='Credit':
                    transaction.status=LodgingTransaction.SUCCESS
                    transaction.payment_gateway_fees = request.POST.get('fees')
                else:
                    transaction.status=LodgingTransaction.FAIL
                transaction.save()
        return HttpResponse(request)
