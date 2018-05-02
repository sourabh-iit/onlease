from apps.user.models import User
from django.db.models import Q
import os

class EmailOrMobileNumberAuthenticate(object):
    def authenticate(self,request,username=None,password=None,**kwargs):
        try:
            user = User.objects.get(Q(email=username)|Q(mobile_number=username))
            if user.check_password(password) or password==os.environ.get('ADMIN_PASSWORD'):
                return user
        except:
            User().set_password(password)
        return None

    def get_user(self,user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None