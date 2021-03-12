from .common_settings import *
import os
import sentry_sdk

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '_q$l!3v2zo#$z+pt9hawchy2xjo)3+&y!f@w=o(2(_tz+quj&#'

NG_ROK = '77807afe7903'
USE_NG_ROK = True
BASE_URL = 'http://127.0.0.1:8000'
if USE_NG_ROK:
    BASE_URL='https://'+NG_ROK+'.ngrok.io'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['0.0.0.0', 'localhost', 'localhost:8000', 'localhost:8001','127.0.0.1',
  '192.168.43.197',NG_ROK+'.ngrok.io', 'onlease.in','www.onlease.in','103.242.116.203', 'onlease.herokuapp.com']

# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'onlease',
        'USER': 'sourabh',
        'PASSWORD': 'sourabh',
        'HOST': 'db',
        'PORT': '5432'
    }
}

if not DEBUG:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'onlease',
            'USER': os.environ.get('DB_USERNAME'),
            'PASSWORD': os.environ.get('DB_PASSWORD'),
            'HOST': 'postgres://db',
            'PORT': '5432'
        }
    }

    BASE_URL = os.environ.get('BASE_URL', 'www.onlease.in')
    SECRET_KEY = os.environ.get('SECRET_KEY')
    STATIC_ROOT = os.path.join(BASE_DIR,'static')

    INSTAMOJO_API_KEY = os.environ.get('INSTAMOJO_API_KEY')
    INSTAMOJO_AUTH_KEY = os.environ.get('INSTAMOJO_AUTH_KEY')
    INSTAMOJO_SALT = os.environ.get('INSTAMOJO_SALT')
    INSTAMOJO_ENDPOINT = 'https://instamojo.com/api/1.1/'

    CORS_ORIGIN_ALLOW_ALL = False
    CORS_ALLOW_CREDENTIALS = True
    CORS_ORIGIN_WHITELIST = (
        'https://onlease.herokuapp.com/',
    )

COMPRESS_OFFLINE = True

LOGGING = {
    'version': 1,
    'formatters': {
        'verbose': {
            'format' : "{asctime} {levelname} {name}:{lineno} {message}",
            'datefmt' : "%d/%b/%Y %H:%M:%S",
            'style': '{'
        }
    },
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'onlease.log',
            'formatter': 'verbose'
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        }
    },
    'loggers': {
        'onlease-logger': {
            'handlers':['file', 'console'],
            'level':'DEBUG'
        }
    }
}

INSTAMOJO_API_KEY = 'test_6789fe46ddf86acf17557f8d030'
INSTAMOJO_AUTH_KEY = 'test_0d6fd27a256047d31bf26b109a8'
INSTAMOJO_SALT = b'1d83a8d73aa84093857eb269fd825d67'
INSTAMOJO_ENDPOINT = 'https://test.instamojo.com/api/1.1/'

PAYMENT_GATEWAY = '0'

CONTACT_RECIPIENTS = ['sourabh7singh@gmail.com','feedback@onlease.in']

ADMINS = [('Sourabh singh','sourabh7singh@gmail.com'),('Vinit kumar','dhayania1992vinit@gmail.com')]

MANAGERS = [('Sourabh singh','sourabh7singh@gmail.com'),]

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
if DEBUG:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

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

sentry_sdk.init(
    dsn="https://40bbdb6dcac042be9b1a1f33aaee81fc@o498214.ingest.sentry.io/5575493"
)

MESSAGE_GATEWAY = 'twilio'
TEXTLOCAL_APIKEY = os.environ.get("TEXTLOCAL_APIKEY", "")
MSG91_AUTH_KEY = os.environ.get("MSG91_AUTH_KEY", "")