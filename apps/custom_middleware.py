import logging
from django.conf import settings

logger = logging.getLogger('testlogger')


class LogErrorMiddleware:
  def __init__(self, get_response):
    self.get_response = get_response

  def __call__(self, request):
    response = self.get_response(request)
    # if response.status_code >= 400:
    logger.error(response.content)
    return response
