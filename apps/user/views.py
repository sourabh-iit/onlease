from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.core.mail import send_mail, BadHeaderError
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from .models import User, MobileNumber
from apps.transactions.utils import send_otp
from .serializers import UserSerializer

import time

# TODO: remove csrf ignorance
# TODO: Add validation
# TODO: indexing

def verify_otp(request, user, session, otp):
    if time.time()-session.get('time', 0) > 60*3:
        raise ValidationError('OTP has expired')
    if session.get('otp') != otp:
        raise ValidationError('Invalid OTP entered')
    session.flush()
    login(request, user)

def set_password(password, confirm_password, user):
    if password != confirm_password:
        raise ValidationError('Passwords do not match')
    user.set_password(password)
    user.save()

class UserActionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, action=None):
        user = request.user
        session = request.session
        data = request.data
        if action == 'verify-otp':
            mobile_number = session.get('mobile_number')
            verify_otp(request, user, session, data.get('otp'))
            if not user.is_verified:
                user.is_verified = True
                user.save()
            if mobile_number != user.mobile_number:
                MobileNumber.objects.create(
                    value=mobile_number,
                    user=user,
                    is_verified=True
                )
            return Response(UserSerializer(user).data)
        if action == 'request-otp':
            mobile_number = data.get('mobile_number')
            users_count = User.objects.filter(mobile_number=mobile_number, is_verified=True).count()
            numbers_count = MobileNumber.objects.filter(value=mobile_number, is_verified=True).count()
            if users_count > 0 or numbers_count > 0:
                raise ValidationError('This mobile number is already linked with another account')
            if user.mobile_numbers.filter(is_verified=True).count() >= 3:
                raise ValidationError('You cannot add more than 3 numbers')
            send_otp(session, mobile_number)
            return Response('success')
        if action == 'change-password':
            try:
                password = data['new_password']
                confirm_password = data['confirm_password']
                current_password = data['current_password']
                if not user.check_password(current_password):
                    raise ValidationError('Current password is not correct')
                set_password(user, password, confirm_password, user)
                login(request, user)
                return Response('success')
            except KeyError:
                raise ValidationError("Insufficient data provided")
        if action == 'save-profile':
            for field in ['first_name', 'last_name', 'email', 'gender']:
                if field in data:
                    setattr(user, field, data.get(field))
            user.save()
            return Response(UserSerializer(user).data, status=200)

        raise ValidationError("Invalid action")
    
    def delete(self, request, number):
        user = request.user
        try:
            mobile_number = user.mobile_numbers.get(value=number)
            mobile_number.delete()
        except ObjectDoesNotExist:
            raise ValidationError("Mobile number does not exist")
        return Response('success')

class PasswordResetView(APIView):
    def post(self, request, action=None):
        data = request.data
        session = request.session
        if action == 'request':
            try:
                mobile_number = data['mobile_number']
                users_count = User.objects.filter(mobile_number=mobile_number).count()
                numbers_count = MobileNumber.objects.filter(value=mobile_number).count()
                if users_count == 0 and numbers_count == 0:
                    raise ValidationError('Invalid mobile number')
                send_otp(session, mobile_number)
                return Response("success")
            except KeyError:
                raise ValidationError("Insufficient data provided")
        if action == 'verify':
            try:
                mobile_number = session.get('mobile_number')
                if not mobile_number:
                    raise ValidationError('Invalid attempt')
                otp = data['otp']
                try:
                    user = User.objects.get(mobile_number=mobile_number)
                except User.DoesNotExist:
                    user = MobileNumber.objects.get(value=mobile_number).user
                except MobileNumber.DoesNotExist:
                    raise ValidationError('Invalid attempt')
                verify_otp(request, user, session, otp)
                password = data['password']
                confirm_password = data['confirm_password']
                set_password(password, confirm_password, user)
                return Response("success")
            except KeyError as e:
                raise ValidationError("Insufficient data provided")
        raise ValidationError("Invalid action")

class UserContactView(APIView):
    def post(self, request):
        data = request.data
        email = data.get('email', '')
        subject = data.get('subject', '')
        name = data.get('name', '')
        message = data.get('message', '')
        if len(email) == 0 or len(subject) == 0 or len(name) == 0 or len(message) == 0:
            raise ValidationError('Incomplete data')
        try:
            mails = send_mail(
                subject=f"{subject} from {name}",
                message=message,
                from_email=email,
                recipient_list=settings.CONTACT_RECIPIENTS
            )
        except BadHeaderError:
            raise ValidationError('Invalid header found.')
        if mails > 0:
            return Response("ok")
        else:
            raise ValidationError("Unknown error occurred. Please try again later")

class RegisterView(APIView):
    def post(self, request):
        data = request.data
        try:
            password = data['password']
            confirm_password = data['confirm_password']
            mobile_number = data['mobile_number']
            email = data['email']
            first_name = data['first_name']
            last_name = data.get('last_name')
            if len(password) < 8 or len(email) == 0 or len(first_name) == 0:
                raise ValidationError("Password should be atleast 8 characters long")
            if password and confirm_password and password != confirm_password:
                raise ValidationError('Password and confirm password should match')
            if User.objects.filter(Q(mobile_number=mobile_number) | Q(email=email)).exists():
                raise ValidationError('User with this mobile number or email address already exists')
            user = User(
                mobile_number = mobile_number,
                first_name = first_name,
                last_name = last_name,
                email = email
            )
            user.set_password(password)
            send_otp(request.session, mobile_number)
            user.save()
            login(request, user)
            return Response(UserSerializer(request.user).data)
        except KeyError:
            raise ValidationError("Insufficient data provided")


class LoginView(APIView):
    def post(self, request):
        data = request.data
        try:
            username = data['username']
            password = data['password']
            user = authenticate(username=username,password=password)
            if not user:
                raise ValidationError('Invalid mobile number/email and password combination')
            if user.status==User.BLOCKED:
                raise ValidationError('You are blocked. Contact admin for further action')
            if not user.is_active:
                raise ValidationError('Account is not active. Contact admin for further information')
            login(request, user)
            return Response(UserSerializer(user).data)
        except KeyError:
            raise ValidationError('Insufficient data provided')

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response("success")
