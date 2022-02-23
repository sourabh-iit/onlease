from django.conf import settings
from django.urls import reverse

from apps.utils import onlease_last_message

def get_name(user):
    if not user.first_name:
        user_name = "User"
    else:
        user_name = user.first_name
        if user.last_name:
            user_name += ' ' + user.last_name
    return user_name

def get_lodging_link(lodging):
    # TODO: write view for viewing lodging
    return settings.BASE_URL + reverse("lodging:lodging-view", [lodging.id])

def successfull_transaction_message(customer, transaction, lodging):
    return f"Dear {get_name(customer)}, your transaction was successful. Your transaction id is {transaction.trans_id}. " +\
            f"Click on {get_lodging_link(lodging)} to see contact details. " + onlease_last_message

def lodging_booked_message(owner, customer):
    return f"Dear {get_name(owner)}, your lodging has been booked by {get_name(customer)}. Call on this" +\
            f" number {customer.mobile_number} to contact him/her. " + onlease_last_message
