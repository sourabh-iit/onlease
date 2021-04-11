import logging
import json
import traceback

from rest_framework.views import exception_handler
from rest_framework.response import Response

from django.conf import settings

from sentry_sdk import capture_exception

logger = logging.getLogger('onlease-logger')

class DisableCSRF:
  def __init__(self, get_response):
    self.get_response = get_response

  def __call__(self, request):
    setattr(request, '_dont_enforce_csrf_checks', True)
    response = self.get_response(request)
    return response

def get_client_ip(request):
  x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
  if x_forwarded_for:
    ip = x_forwarded_for.split(',')[-1].strip()
  else:
    ip = request.META.get('REMOTE_ADDR')
  return ip

class LogData:
  def __init__(self, get_response):
    self.get_response = get_response

  def __call__(self, request):
    url = request.get_raw_uri()
    try:
      body = json.loads(request.body)
    except:
      body = {}
    response = self.get_response(request)
    req_data = f"{url} {response.status_code} {request.method} {body} {get_client_ip(request)}"
    logger.info(req_data)
    return response

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    logger.error(traceback.format_exc())
    if response is None:
        if not settings.DEBUG:
            capture_exception(exc)
        response = Response(['Unknow error occurred'], status=500)
    return response