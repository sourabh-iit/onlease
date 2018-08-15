# from django import template
# from apps.lodging.models import CommonlyUsedLodgingModel
# from apps.user.models import User
# from apps.roommate.models import RoomieAd

# register = template.Library()

# @register.filter(name='type_full_form')
# def type_full_form(value):
#     for tup in CommonlyUsedLodgingModel.TYPE_CHOICES:
#         if tup[0] and tup[0].lower()==value.lower():
#             return tup[1]
#     return ""

# @register.filter(name='gender_type_full_form')
# def gender_type_full_form(value):
#     for tup in User.GENDER_CHOICES:
#         if tup[0] and tup[0].lower()==value.lower():
#             return tup[1]
#     return ""

# @register.filter(name='ad_type_full_form')
# def ad_type_full_form(value):
#     for tup in RoomieAd.TYPE_CHOICES:
#         if tup[0] and tup[0].lower()==value.lower():
#             return tup[1]
#     return ""

# @register.filter(name='location_full_form')
# def location_full_form(value):
#     for tup in CommonlyUsedLodgingModel.LOCATION_CHOICES:
#         if tup[0] and tup[0].lower()==value.lower():
#             return tup[1]
#     return ""
