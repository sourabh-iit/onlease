from .common_settings import *
import os

SECRET_KEY = os.environ.get('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

INSTAMOJO_API_KEY = os.environ.get('INSTAMOJO_API_KEY')
INSTAMOJO_AUTH_KEY = os.environ.get('INSTAMOJO_AUTH_KEY')
INSTAMOJO_SALT = os.environ.get('INSTAMOJO_SALT')
INSTAMOJO_ENDPOINT = 'https://instamojo.com/api/1.1/'

RECIPIENTS = ['sourabh7singh@gmail.com','feedback@onlease.in']

SECURE_CONTENT_TYPE_NOSNIFF = True

SECURE_BROWSER_XSS_FILTER = True

ADMINS = [('Sourabh singh','sourabh7singh@gmail.com'),('Vinit kumar','dhayania1992vinit@gmail.com')]

MANAGERS = [('Sourabh singh','sourabh7singh@gmail.com'),]

STATIC_ROOT = os.path.join(BASE_DIR,'static')

CORS_ORIGIN_ALLOW_ALL = False

CORS_ORIGIN_WHITELIST = (
    'www.staging.onlease.in',
    'staging.onlease.in',
    'www.onlease.in',
    'onlease.in',
)
