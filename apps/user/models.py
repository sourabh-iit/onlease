from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import RegexValidator
from django.contrib.contenttypes.models import ContentType
from django.core.mail import send_mail
from .utils import *


class CustomUserManager(BaseUserManager):

    def create_user(self,mobile_number,password):
        user = User.objects.create(mobile_number=mobile_number)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self,mobile_number,password):
        user = User.objects.create(mobile_number=mobile_number)
        user.set_password(password)
        user.save()
        return user


class User(AbstractUser):
    BLOCKED = 'B'
    WARNED = 'W'
    REGULAR = 'R'
    STATUS_CHOICES = (
        (BLOCKED,'Blocked'),
        (WARNED,'Warned'),
        (REGULAR,'REGULAR')
    )
    STATE_CHOICES=(
        (True,'Yes'),
        (False,'No')
    )
    mobile_number = models.CharField(max_length=16, primary_key=True, db_index=True,
        validators=[RegexValidator(mobile_number_regex)])
    password = models.CharField(max_length=100, null=False, blank=False,
        help_text="Password should be atleast of 8 charaters. It should"+
        " consists of atleast one digit, one small alphabet and one capital alphabet.",
        validators=[RegexValidator(password_digit,
            message="Password must contain at least one digit."),
            RegexValidator(password_lower_case_letter,
            message="Password must contain at least one lower case letter."),
            RegexValidator(password_upper_case_letter,
            message="Password must contain at least one upper case letter."),])
    email = models.EmailField(unique=True,null=True,blank=True,
        validators=[RegexValidator(email_regex)])
    first_name = models.CharField(max_length=30, null=True, blank=True,
        validators=[RegexValidator('^[a-zA-Z]{3,}$')])
    last_name = models.CharField(max_length=30, null=True, blank=True,
        validators=[RegexValidator('^[a-zA-Z]{3,}$')])
    is_allowed = models.BooleanField(default=False,help_text="Profile completion is required for adding business.")
    status = models.CharField(max_length=1,choices=STATUS_CHOICES,
        default=REGULAR)
    is_verified = models.BooleanField(default=False)
    is_dealer = models.BooleanField(default=False)
    no_times_refunded = models.PositiveIntegerField(default=0)
    no_times_not_booked = models.PositiveIntegerField(default=0)
    no_times_took_commission = models.PositiveIntegerField(default=0)
    is_dealer = models.BooleanField(
        verbose_name="Are you a dealer?",
        choices=STATE_CHOICES)

    USERNAME_FIELD = 'mobile_number'
    objects = CustomUserManager()

    def full_name(self):
        return self.first_name+" "+self.last_name

    def save(self,*args,**kwargs):
        self.username = self.mobile_number
        super().save(*args,**kwargs)

    def __str__(self):
        return self.mobile_number

    # TODO indexing


class ContactModel(models.Model):
    name = models.CharField(max_length=50,validators=[RegexValidator(
        regex="^[a-zA-Z ]+$",
        message = "Enter a valid name."
    )])
    email = models.EmailField(validators=[
        RegexValidator(email_regex,message="Enter a valid email address.")])
    mobile_number = models.CharField(max_length=16,validators=[
        RegexValidator(mobile_number_regex,
            message="Enter a valid mobile number.")])
    message = models.TextField(max_length=2000,validators=[
        RegexValidator('^[0-9A-Za-z ,.]{10,}$',
            message="Enter a valid message.")],
            help_text="Message can contain digits, alphabets, space, comma and period")
    subject = models.CharField(max_length=100,validators=[
        RegexValidator('^[0-9A-Za-z ,.]+$',
            message="Enter a valid subject.")],
            help_text="Subject can contain digits, alphabets, space, comma and period")
    sent_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.message