from .common_settings import *
import os

# SECURITY WARNING: keep the secret key used in production secret!

SECRET_KEY = '_q$l!3v2zo#$z+pt9hawchy2xjo)3+&y!f@w=o(2(_tz+quj&#'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['0.0.0.0', 'localhost', 'localhost:8000', 'localhost:8001','127.0.0.1']

# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'onlease',
        'USER': 'sourabh',
        'PASSWORD': 'sourabh',
        'HOST': 'localhost',
        'PORT': ''
    }
}

INSTAMOJO_API_KEY = 'test_6789fe46ddf86acf17557f8d030'
INSTAMOJO_AUTH_KEY = 'test_0d6fd27a256047d31bf26b109a8'
INSTAMOJO_SALT = '1d83a8d73aa84093857eb269fd825d67'
INSTAMOJO_ENDPOINT = 'https://test.instamojo.com/api/1.1/'

RECIPIENTS = ['sourabh7singh@gmail.com']

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# DEFAULT_FROM_EMAIL = 'feedback@onlease.in'
# EMAIL_HOST = 'smtp.onlease.in'
# EMAIL_PORT = 587
# EMAIL_HOST_USER = 'feedback@onlease.in'
# EMAIL_HOST_PASSWORD = os.environ.get('BIGROCK_EMAIL_PASSWORD')
# EMAIL_USE_TLS = True

DEFAULT_FROM_EMAIL = 'feedback@onlease.in'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = os.environ.get('GMAIL_EMAIL')
EMAIL_HOST_PASSWORD = os.environ.get('GMAIL_PASSWORD')
EMAIL_USE_TLS = True

BASE_URL = 'http://localhost:8000'

LANGUAGE_CODE = 'hi-IN'

DATE_INPUT_FORMATS = ['%d-%m-%Y','%Y-%m-%d']

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]

# STATIC_ROOT = os.path.join(BASE_DIR,'static')

# CACHES = {
#     "default": {
#         "BACKEND": "django_redis.cache.RedisCache",
#         "LOCATION": "redis://127.0.0.1:6379/1",
#         "OPTIONS": {
#             "CLIENT_CLASS": "django_redis.client.DefaultClient",
#         }
#     },
#     'select2': {
#         "BACKEND": "django_redis.cache.RedisCache",
#         "LOCATION": "redis://127.0.0.1:6379/2",
#         "OPTIONS": {
#             "CLIENT_CLASS": "django_redis.client.DefaultClient",
#         }
#     }
# }
