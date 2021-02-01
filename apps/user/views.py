from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.core.mail import send_mail, BadHeaderError
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db import transaction

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from .models import ProfileImage, User, MobileNumber
from apps.transactions.utils import send_otp
from .serializers import MobileNumberSerializer, UserSerializer, ImageSerializer
from apps.utils import generate_random, create_thumbnail, thumbnail_size

import time

# TODO: remove csrf ignorance
# TODO: Add validation
# TODO: indexing

def delete_otp_fields(session):
    for field in ['otp', 'mobile_number', 'time']:
        if field in session:
            del session[field]

def verify_otp(session, otp):
    if time.time()-session.get('time', 0) > 60*3:
        raise ValidationError('OTP has expired')
    if session.get('otp') != otp:
        raise ValidationError('Invalid OTP entered')
    delete_otp_fields(session)

def set_password(password, user):
    user.set_password(password)
    user.save()

class UserHandler(APIView):
    
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({})
        user = UserSerializer(request.user).data
        return Response(user)

class UserActionHandler(APIView):
    
    def post(self, request, action):
        user = request.user
        data = request.data
        if action == 'change-password':
            UserActionHandler.change_password(user, data)
            return Response('success')
        if action == 'save-profile':
            user = UserActionHandler.save_profile(user, data)
            return Response(UserSerializer(user).data)
        raise ValidationError("invalid action")

    @staticmethod
    def change_password(user, data):
        for field in ['new_password', 'current_password']:
            if field not in data:
                raise ValidationError("new password and current password are required")
        password = data['new_password']
        current_password = data['current_password']
        if not user.check_password(current_password):
            raise ValidationError('invalid password')
        set_password(password, user)

    @staticmethod
    def save_profile(user, data):
        for field in ['first_name', 'last_name', 'email', 'gender']:
            if field in data:
                setattr(user, field, data.get(field))
        user.save()
        return user

class MobileNumberHandler(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, action=None):
        user = request.user
        session = request.session
        data = request.data
        if action == 'verify-otp':
            mobile_number = MobileNumberHandler.verify_otp(session, user, data)
            return Response(MobileNumberSerializer(mobile_number).data)
        if action == 'request-otp':
            MobileNumberHandler.request_otp(session, user, data)
            return Response('success')
        if action == 'resend-otp':
            MobileNumberHandler.resend_otp(session)
            return Response('success')

        raise ValidationError("Invalid action")

    @staticmethod
    def resend_otp(session):
        if 'mobile_number' not in session:
            raise ValidationError('invalid request')
        mobile_number = session['mobile_number']
        send_otp(session, mobile_number)

    @staticmethod
    def verify_otp(session, user, data):
        if 'mobile_number' not in session:
            raise ValidationError('invalid request')
        mobile_number = session['mobile_number']
        verify_otp(session, data.get('otp'))
        return MobileNumber.objects.create(
            value=mobile_number,
            user=user
        )

    @staticmethod
    def request_otp(session, user, data):
        mobile_number = data.get('mobile_number')
        users_count = User.objects.filter(mobile_number=mobile_number).count()
        numbers_count = MobileNumber.objects.filter(value=mobile_number).count()
        if users_count > 0 or numbers_count > 0:
            raise ValidationError('This mobile number is already linked with another account')
        if user.mobile_numbers.count() >= 3:
            raise ValidationError('You cannot add more than 3 numbers')
        send_otp(session, mobile_number)
    
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
            PasswordResetView.request_otp(session, data)
            return Response("success")
        if action == 'verify':
            PasswordResetView.set_password(session, data)
            return Response("success")
        raise ValidationError("Invalid action")

    @staticmethod
    def request_otp(session, data):
        if 'mobile_number' not in data:
            raise ValidationError("mobile number is required")
        mobile_number = data['mobile_number']
        users_count = User.objects.filter(mobile_number=mobile_number).count()
        numbers_count = MobileNumber.objects.filter(value=mobile_number).count()
        if users_count != 0 or numbers_count != 0:
            send_otp(session, mobile_number)

    @staticmethod
    def set_password(session, data):
        if 'mobile_number' not in session:
            raise ValidationError('invalid request')
        mobile_number = session.get('mobile_number')
        otp = data.get('otp')
        try:
            user = User.objects.get(mobile_number=mobile_number)
        except User.DoesNotExist:
            user = MobileNumber.objects.get(value=mobile_number).user
        verify_otp(session, otp)
        password = data['password']
        confirm_password = data['confirm_password']
        set_password(password, user)

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
    def post(self, request, action):
        data = request.data
        session = request.session
        if action == 'details':
            fields = ['password', 'confirm_password', 'mobile_number']
            for field in fields:
                if field not in data:
                    raise ValidationError(f"{field} is required")
            password = data['password']
            confirm_password = data['confirm_password']
            mobile_number = data['mobile_number']
            first_name = data['first_name']
            last_name = data.get('last_name')
            if len(password) < 8:
                raise ValidationError("Password should be atleast 8 characters long")
            if password and confirm_password and password != confirm_password:
                raise ValidationError('Password and confirm password should match')
            user_exists = User.objects.filter(mobile_number=mobile_number).exists()
            mobile_number_obj = MobileNumber.objects.filter(value=mobile_number)
            if user_exists or mobile_number_obj:
                raise ValidationError('This mobile number is already registered')
            if mobile_number_obj:
                mobile_number_obj.delete()
            session['mobile_number'] = mobile_number
            session['first_name'] = first_name
            session['last_name'] = last_name
            session['password'] = password
            send_otp(session, mobile_number)
            return Response('success')
        elif action == 'verify':
            otp = data.get('otp')
            for field in ['mobile_number', 'password',  'first_name', 'last_name']:
                if field not in session:
                    raise ValidationError("invalid request")
            mobile_number = session['mobile_number']
            first_name = session['first_name']
            last_name = session['last_name']
            password = session['password']
            verify_otp(session, otp)
            user = User(
                mobile_number = mobile_number,
                first_name = first_name,
                last_name = last_name
            )
            user.set_password(password)
            user.save()
            login(request, user)
            return Response(UserSerializer(user).data)
        elif action == 'resend-otp':
            mobile_number = session.get('mobile_number')
            send_otp(session, mobile_number)
            return Response('success')

class LoginView(APIView):
    def post(self, request):
        data = request.data
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if not user:
            raise ValidationError('Invalid mobile number and password combination')
        if user.status==User.BLOCKED:
            raise ValidationError('You are blocked. Contact admin for further action')
        if not user.is_active:
            raise ValidationError('Account is not active. Contact admin for further information')
        login(request, user)
        return Response(UserSerializer(user).data)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response("success")


class ImageHandler(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        # dataUrlPattern = re.compile('data:image/(png|jpg|jpeg|gif);base64,(.*)$')
        # image_data = data['image']
        # image_data = dataUrlPattern.match(image_data).group(2)
        # image_data = image_data.encode()
        # image_data = base64.b64decode(image_data)
        # file = InMemoryUploadedFile(io.BytesIO(image_data), 'image', image_name+'.jpeg', None, None, None)
        data = request.data
        user = request.user
        if 'image' not in data or not isinstance(data['image'], InMemoryUploadedFile):
            raise ValidationError('invalid image')
        file = data['image']
        if file.size > 8*1024*1024:
            raise ValidationError("Image size should not be larger than 8mb")
        if file.content_type not in ['image/png', 'image/jpg', 'image/jpeg']:
            raise ValidationError("invalid image")
        image_extension = file.name.split('.')[-1]
        rand_str = generate_random(8)
        image_name = '_'.join('_'.join(file.name.split('.')[0:-1]).split())
        img_type = file.content_type.split('/')[-1]
        file.name = f"{image_name}_{rand_str}.{image_extension}"
        thumb_file = create_thumbnail(file, thumbnail_size, f"{image_name}_thumbnail_{rand_str}.{image_extension}", img_type)
        with transaction.atomic():
            try:
                user.image.delete()
            except:
                pass
            im = ProfileImage.objects.create(file=file, thumbnail=thumb_file, user=request.user)
        return Response(ImageSerializer(im).data)

    def delete(self, request, image_id):
        user = request.user
        if not hasattr(user, "image"):
            raise ValidationError("No image")
        if user.image.id != int(image_id):
            raise ValidationError("Not authorized")
        user.image.delete()
        return Response('success')
