import os
import sentry_sdk

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = bool(int(os.environ.get('DEBUG')))

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'apps.user.apps.UserConfig',
    'apps.lodging.apps.LodgingConfig',
    'apps.transactions',
    'apps.locations'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.common.BrokenLinkEmailsMiddleware',
    'apps.custom_middleware.LogData',
    'apps.custom_middleware.DisableCSRF'
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR,'templates'),
            BASE_DIR,
            os.path.join(BASE_DIR,'static/angular'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages'
            ],
        }
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

AUTH_PASSWORD_VALIDATORS = [
    # {
    #     'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    # },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        }
    },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    # },
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Kolkata'

USE_I18N = True

USE_L10N = True

USE_TZ = False

AUTHENTICATION_BACKENDS = ('apps.utils.EmailOrMobileNumberAuthenticate',)

AUTH_USER_MODEL = 'user.User'

LOGIN_URL = 'user:login'

LANGUAGE_CODE = 'hi-IN'

DATE_INPUT_FORMATS = ['%d-%m-%Y']

DATE_FORMAT = '%d-%m-%Y'

USE_I18N = False

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

GOOGLE_MAPS_API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY')

ADMINS_LIST = [ '9899761236', '7827866709' ]

REST_FRAMEWORK = {
  'DATE_FORMAT' : '%d-%m-%Y',
  'EXCEPTION_HANDLER': 'apps.custom_middleware.custom_exception_handler'
}

TWILIO_SID = os.environ.get('TWILIO_SID')
TWILIO_TOKEN = os.environ.get('TWILIO_TOKEN')
TWILIO_PHONE_NUMBER = os.environ.get('TWILIO_PHONE_NUMBER')

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY')

NG_ROK = os.environ.get('NG_ROK')
USE_NG_ROK = bool(int(os.environ.get('USE_NG_ROK')))
BASE_URL = os.environ.get('BASE_URL')
if DEBUG and USE_NG_ROK:
    BASE_URL = f'https://{NG_ROK}.ngrok.io'

ALLOWED_HOSTS = [ '*' ]

# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': 5432
    }
}

STATIC_URL = '/static/'
MEDIA_URL = '/media/'

if not DEBUG:
    STATICFILES_FINDERS = (
        'django.contrib.staticfiles.finders.FileSystemFinder',
    )
    STATIC_ROOT = '/vol/static'
    MEDIA_ROOT = '/vol/media'
else:
    MEDIA_ROOT = os.path.join(BASE_DIR,'media')

INSTAMOJO_API_KEY = os.environ.get('INSTAMOJO_API_KEY')
INSTAMOJO_AUTH_KEY = os.environ.get('INSTAMOJO_AUTH_KEY')
INSTAMOJO_SALT = os.environ.get('INSTAMOJO_SALT')
INSTAMOJO_ENDPOINT = os.environ.get('INSTAMOJO_ENDPOINT')

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

PAYMENT_GATEWAY = '0'

CONTACT_RECIPIENTS = [ 'sourabh7singh@gmail.com','sourabh.singh@onlease.in' ]

ADMINS = [('Sourabh singh','sourabh7singh@gmail.com'),('Vinit kumar','dhayania1992vinit@gmail.com')]

MANAGERS = [('Sourabh singh','sourabh7singh@gmail.com')]

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
if DEBUG:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# DEFAULT_FROM_EMAIL = 'feedback@onlease.in'
# EMAIL_HOST = 'smtp.onlease.in'
# EMAIL_PORT = 587
# EMAIL_HOST_USER = 'feedback@onlease.in'
# EMAIL_HOST_PASSWORD = os.environ.get('BIGROCK_EMAIL_PASSWORD')
# EMAIL_USE_TLS = True

DEFAULT_FROM_EMAIL = 'sourabh.singh@onlease.in'
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
TEXTLOCAL_APIKEY = os.environ.get("TEXTLOCAL_APIKEY")
MSG91_AUTH_KEY = os.environ.get("MSG91_AUTH_KEY")
TF_APIKEY=os.environ.get("TF_APIKEY")

BROKERAGE_PERCENT = 25
BOOKING_PERCENT = 25
